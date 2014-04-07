# Gitolite

Cette section constitue une introduction à Gitolite et fournit des instructions de base pour son installation et sa mise en œuvre.
Elle ne peut pas cependant se substituer à l'importante quantité de [documentation][gldpg] fournie avec Gitolite.
Il se peut qu'elle subisse aussi occasionnellement quelques corrections qui sont disponibles [ici][gltoc].

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

Gitolite est une couche de gestion d'accès posée au dessus de Git, reposant sur `sshd` et `httpd` pour l'authentification.
L'authentification consiste à identifier l'utilisateur, la gestion d'accès permet de décider si celui-ci est autorisé à accomplir ce qu'il s'apprête à faire.

## Installation

L'installation de Gitolite est très simple, même sans lire la documentation extensive qui l'accompagne.
Vous n'avez besoin que d'un compte sur un serveur de type Unix.
Vous n'avez pas besoin d'accès root si Git, Perl et un serveur compatible OpenSSH sont déjà installés.
Dans les exemples qui suivent, un compte `git` sur un serveur `gitserver` sera utilisé.

Pour commencer, créez un utilisateur nommé `git` et loggez-vous avec cet utilisateur.
Copiez votre clé publique SSH depuis votre station de travail en la renommant `<votrenom>.pub` (nous utiliserons `scott.pub` pour l'exemple de cette section).
Ensuite, lancez les commandes ci-dessous :

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	  # suppose que $HOME/bin existe et apparaît dans $PATH
	$ gitolite setup -pk $HOME/scott.pub

Cette dernière commande crée un nouveau dépôt Git appelé `gitolite-admin` sur le serveur.

Enfin, de retour sur la station de travail, lancez `git clone git@gitserver:gitolite-admin`.
C'est fini !
Gitolite est à présent installé sur le serveur ainsi qu'un nouveau dépôt appelé `gitolite-admin` qui a été cloné sur la station de travail.
L'administration de Gitolite passe par des modifications dans ce dépôt suivies d'une poussée sur le serveur.


## Personnalisation de l'installation

L'installation rapide par défaut suffit à la majorité des besoins, mais il existe des moyens de la paramétrer plus finement.
Ces modifications sont réalisées en éditant le fichier « rc » utilisé par le serveur, mais si cela ne s'avère pas suffisant, il existe plus d'information dans la documentation sur la personnalisation de Gitolite.

## Fichier de configuration et règles de contrôle d'accès

Une fois l'installation terminée, vous pouvez basculer vers le clone `gitolite-admin` présent sur votre station de travail et inspecter ce qui s'y trouve :

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

Notez que « scott » (le nom de la clé publique pour la commande `gl-setup` ci-dessus) détient les permissions en lecture/écriture sur le dépôt `gitolite-admin` ainsi qu'une clé publique du même nom.

L'ajout d'utilisateurs est simple.
Pour ajouter une utilisatrice appelée « alice », demandez-lui de vous fournir une clé publique SSH, renommez-la `alice.pub`, et placez-la dans le répertoire `keydir` du clone du dépôt `gitolite-admin` sur la station de travail.
Validez le fichier dans le dépôt et poussez les modifications sur le serveur.
L'utilisatrice « alice » vient d'être ajoutée.

Le fichier de configuration est richement commenté et nous n'allons donc mentionner ici que quelques points principaux.

Pour vous simplifier la tâche, vous pouvez grouper les utilisateurs et les dépôts.
Les noms de groupes sont juste comme des macros.
À leur définition, il importe peu que ce soient des projets ou des utilisateurs.
Cette distinction ne sert que lors de *l'utilisation* de la « macro ».

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

Vous pouvez contrôler les permissions au niveau « ref ».
Dans l'exemple suivant, les stagiaires (intern) ne peuvent pousser que sur la branche « int ».
Les ingénieurs peuvent pousser toutes les branches dont le nom commence par « eng » et les étiquettes qui commencent par « rc » suivi d'un chiffre.
Les administrateurs ont tous les droits (y compris le rembobinage) sur toutes les `refs`.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

L'expression après les `RW` ou les `RW+` est une expression rationnelle (*regular expression* ou regex) qui filtre le nom de la référence (`ref`).
Elle s'appelle donc une « refex » !
Bien entendu, une « refex » peut être bien plus puissante que celles montrées ci-dessus et il est inutile de trop chercher si vous n'êtes pas à l'aise avec les regex Perl.

De plus, logiquement, Gitolite préfixe les refex qui ne commencent pas par `refs/` avec la chaîne `refs/heads/`.

Une autre particularité importante de la syntaxe du fichier de configuration est que toutes les règles ne sont pas nécessairement à un seul endroit.
On peut conserver toute la configuration commune, telle que l'ensemble des règles pour tous les dépôts `oss_repo` ci-dessus au début puis ajouter des règles spécifiques plus loin, comme :

	repo gitolite
	    RW+                     = sitaram

Cette règle sera juste ajoutée à l'ensemble des règles préexistantes du dépôt `gitolite`.

Du coup, il est nécessaire d'expliciter la politique d'application des règles de contrôle d'accès.

Il existe deux niveaux de contrôle d'accès dans Gitolite.
Le premier réside au niveau du dépôt.
Si vous avez un droit d'accès en lecture (resp. en écriture) à *n'importe quelle* `ref` du dépôt, alors vous avez accès en lecture (resp. en écriture) au dépôt.

Le second niveau, applicable seulement pour l'accès en écriture, se focalise sur les branches et les étiquettes dans un dépôt.
L'utilisateur, le type d'accès en cours (`W` ou `+`) et le nom de la référence permettent de définir les critères.
Les règles d'accès sont vérifiées par ordre d'apparition dans le fichier de configuration, par recherche d'une correspondance sur cette combinaison (en se souvenant que la correspondance de référence est une refex, non une simple comparaison).
Si une correspondance est trouvée, l'accès en poussée est accepté.
Si aucune correspondance n'est trouvée, l'accès est refusé.

## Contrôle d'accès avancé avec les règles « deny »

Jusqu'ici, les seuls types de permissions rencontrés ont été `R`, `RW` ou `RW+`.
Néanmoins, Gitolite connaît une autre permission : `-` qui signifie « deny », accès refusé.
Cela vous donne bien plus de possibilités, au prix d'une complexité accrue car à présent l'absence de correspondance n'est plus la *seule* manière de refuser l'accès, mais il devient nécessaire de faire attention à l'ordre des règles !

Supposons que dans la situation ci-dessus, nous souhaitons que les ingénieurs soient capables de rembobiner n'importe quelle branche *excepté* master et integ.
Voici comment faire :

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

Une fois encore, il suffit de suivre simplement les règles de haut en bas jusqu'à rencontrer une correspondance pour votre mode d'accès ou de refus.
Les poussées en non-rembobinage sur master ou integ sont permises par la première règle.
Les poussées en rembobinage à ces références n'ont pas de correspondance dans la première règle et se poursuivent par la seconde qui les refuse.
Toute poussée (en rembobinage ou non) à des `refs` autres que master ou integ ne correspondra pas aux deux premières règles et sera permise par la troisième.

## Restriction des poussées sur les fichiers modifiés

En sus de la restriction sur les branches utilisables par un utilisateur, il est possible de mettre en place des restrictions sur les fichiers qu'il aura droit de toucher.
Par exemple, un Makefile (ou tout autre script) n'est pas supposé être modifié par n'importe qui, du fait que de nombreuses choses en dépendent et qu'une modification non maîtrisée pourrait casser beaucoup de choses.
Vous pouvez indiquer à Gitolite :

    repo foo
        RW                      =   @junior_devs @senior_devs

        RW  NAME/               =   @senior_devs
        -   NAME/Makefile       =   @junior_devs
        RW  NAME/               =   @junior_devs
		-   VREF/NAME/Makefile  =   @junior_devs

Les utilisateurs migrant depuis une version précédente de Gitolite pourront noter qu'il y a une modification significative du comportement de cette fonctionnalité.
Référez-vous au guide de migration pour plus de détails.

## Branches personnelles

Gitolite a aussi une fonction appelée « branches personnelles » (ou plutôt « espace de branches personnelles ») qui peut s'avérer très utiles en environnement professionnel.

Dans le monde de Git, une grande quantité d'échange de code se passe par requêtes de tirage.
En environnement professionnel, cependant, les accès non-authentifiés sont inimaginables et une authentification poste à poste est impossible.
Il est donc nécessaire de pousser sur le serveur central et demander à quelqu'un d'en tirer.

Cela provoquerait normalement le même bazar de branches que dans les VCS centralisés, avec en plus la surcharge pour l'administrateur de la gestion des permissions.

Gitolite permet de définir un préfixe d'espace de nom « personnel » ou « brouillon » pour chaque développeur (par exemple, `refs/personnel/<nom du dev>/*`).
Référez-vous à la documentation pour plus de détails.

## Dépôts « joker »

Gitolite permet de spécifier des dépôts avec jokers (en fait des regex Perl), comme par exemple, au hasard, `devoirs/s[0-9][0-9]/a[0-9][0-9]`.
Un nouveau mode de permission devient accessible (`C`).
En suivant ces schémas de nommage, les utilisateurs peuvent alors créer des dépôts dont ils seront automatiquement propriétaires, leur permettant ainsi de leur assigner des droits en lecture ou lecture/écriture pour d'autres utilisateurs avec lesquels ils souhaitent collaborer.
Référez-vous à la documentation pour plus de détail.

## Autres fonctionnalités

Nous terminerons cette section avec quelques échantillons d'autres fonctions qui sont toutes décrites, ainsi que d'autres dans la documentation.

**Journalisation** : Gitolite enregistre tous les accès réussis.
Si vous étiez réticent à donner aux utilisateurs des droits de rembobiner (`RW+`) et qu'un plaisantin a complètement cassé « master », le journal des activités est là pour vous aider à trouver facilement et rapidement le SHA qui a tout déclenché.

**Rapport sur les droits d'accès** : une autre fonctionnalité très utile concerne la prise en charge de la connexion SSH au serveur.
Gitolite vous affiche à quels dépôts vous pouvez accéder et avec quels droits.
Ci-dessous un exemple :

	hello scott, this is git@git running gitolite3 \
	v3.01-18-g9609868 on git 1.7.4.4

	         R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**Délégation** : Pour les grands déploiements, il est possible de déléguer la responsabilité de groupes de dépôts à différentes personnes en leur permettant de les gérer de manière autonome.
Cela permet de réduire la charge de travail de l'administrateur principal et évite d'en faire un goulet d'étranglement.

**Miroirs** : Gitolite peut vous aider à maintenir de multiples miroirs et à basculer simplement entre eux si le miroir principal tombe en panne.
