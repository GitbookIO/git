# Maintenance d'un projet

En plus de savoir comment contribuer efficacement à un projet, vous aurez probablement besoin de savoir comment en maintenir un.
Cela peut consister à accepter et appliquer les patchs générés via `format-patch` et envoyés par e-mail, ou à intégrer des modifications dans des branches distantes de dépôts distants.
Que vous mainteniez le dépôt de référence ou que vous souhaitiez aider en vérifiant et approuvant les patchs, vous devez savoir comment accepter les contributions d'une manière limpide pour vos contributeurs et soutenable à long terme pour vous.

## Travail dans des branches thématiques

Quand vous vous apprêtez à intégrer des contributions, une bonne idée consiste à les essayer d'abord dans une branche thématique, une branche temporaire spécifiquement créée pour essayer cette nouveauté.
De cette manière, il est plus facile de rectifier un patch à part et de le laisser s'il ne fonctionne pas jusqu'à ce que vous disposiez de temps pour y travailler.
Si vous créez une simple branche nommée d'après le thème de la modification que vous allez essayer, telle que `ruby_client` ou quelque chose d'aussi descriptif, vous pouvez vous en souvenir simplement plus tard.
Le mainteneur du projet Git a l'habitude d'utiliser des espaces de nommage pour ses branches, tels que `sc/ruby_client`, où `sc` représente les initiales de la personne qui a contribué les modifications.
Comme vous devez vous en souvenir, on crée une branche à part du master de la manière suivante :

	$ git branch sc/ruby_client master

Ou bien, si vous voulez aussi basculer immédiatement dessus, vous pouvez utiliser l'option `checkout -b` :

	$ git checkout -b sc/ruby_client master

Vous voilà maintenant prêt à ajouter les modifications sur cette branche thématique et à déterminer si c'est prêt à être fusionné dans les branches au long cours.

## Application des patchs à partir d'e-mail

Si vous recevez par e-mail un patch que vous devez intégrer à votre projet, vous avez besoin d'appliquer le patch dans une branche thématique pour l'évaluer.
Il existe deux méthodes pour appliquer un patch envoyé par e-mail : `git apply` et `git am`.

### Application d'un patch avec `apply`

Si vous avez reçu le patch de quelqu'un qui l'a généré avec la commande `git diff` ou `diff` Unix, vous pouvez l'appliquer avec la commande `git apply`.
Si le patch a été sauvé comme fichier `/tmp/patch-ruby-client.patch`, vous pouvez l'appliquer comme ceci :

	$ git apply /tmp/patch-ruby-client.patch

Les fichiers dans votre copie de travail sont modifiés.
C'est quasiment identique à la commande `patch -p1` qui applique directement les patchs mais en plus paranoïaque et moins tolérant sur les concordances approximatives.
Les ajouts, effacements et renommages de fichiers sont aussi gérés s'ils sont décrits dans le format `git diff`, ce que `patch` ne supporte pas.
Enfin, `git apply` fonctionne en mode « applique tout ou refuse tout » dans lequel toutes les modifications proposées sont appliquées si elles le peuvent, sinon rien n'est modifié, là où `patch` peut n'appliquer que partiellement les patchs, laissant le répertoire de travail dans un état intermédiaire.
`git apply` est par dessus tout plus paranoïaque que `patch`.
Il ne créera pas une validation à votre place : après l'avoir lancé, vous devrez indexer et valider les modifications manuellement.

Vous pouvez aussi utiliser `git apply` pour voir si un patch s'applique proprement avant de réellement l'appliquer — vous pouvez lancer `git apply --check` avec le patch :

	$ git apply --check 0001-seeing-if-this-helps-the-gem.patch
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply

S'il n'y pas de message, le patch devrait s'appliquer proprement.
Cette commande se termine avec un statut non-nul si la vérification échoue et vous pouvez donc l'utiliser dans des scripts.

### Application d'un patch avec `am`

Si le contributeur est un utilisateur de Git qui a été assez gentil d'utiliser la commande `format-patch` pour générer ses patchs, votre travail sera facilité car le patch contient alors déjà l'information d'auteur et le message de validation.
Si possible, encouragez vos contributeurs à utiliser `format-patch` au lieu de `patch` pour générer les patchs qu'ils vous adressent.
Vous ne devriez avoir à n'utiliser `git apply` que pour les vrais patchs.

Pour appliquer un patch généré par `format-patch`, vous utilisez `git am`.
Techniquement, `git am` s'attend à lire un fichier au format mbox, qui est un format texte simple permettant de stocker un ou plusieurs messages e-mail dans un unique fichier texte.
Un fichier ressemble à ceci :

	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] Ajout d'une limite à la fonction de log

	Limite la fonctionnalité de log aux 20 premières lignes

C'est le début de ce que la commande `format-patch` affiche, comme vous avez vu dans la section précédente.
C'est aussi un format e-mail mbox parfaitement valide.
Si quelqu'un vous a envoyé par e-mail un patch correctement formaté en utilisant `git send-mail` et que vous le téléchargez en format mbox, vous pouvez pointer `git am` sur ce fichier mbox et il commencera à appliquer tous les patchs contenus.
Si vous utilisez un client e-mail qui sait sauver plusieurs messages au format mbox, vous pouvez sauver la totalité de la série de patchs dans un fichier et utiliser `git am` pour les appliquer tous en une fois.

Néanmoins, si quelqu'un a déposé un fichier de patch généré via `format-patch` sur un système de suivi de faits techniques ou quelque chose de similaire, vous pouvez toujours sauvegarder le fichier localement et le passer à `git am` pour l'appliquer :

	$ git am 0001-limite-la-fonction-de-log.patch
	Applying:  Ajout d'une limite à la fonction de log

Vous remarquez qu'il s'est appliqué proprement et a créé une nouvelle validation pour vous.
L'information d'auteur est extraite des en-têtes `From` et `Date` tandis que le message de validation est repris du champ `Subject` et du corps (avant le patch) du message.
Par exemple, si le patch est appliqué depuis le fichier mbox ci-dessus, la validation générée ressemblerait à ceci :

	$ git log --pretty=fuller -1
	commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Author:     Jessica Smith <jessica@example.com>
	AuthorDate: Sun Apr 6 10:17:23 2008 -0700
	Commit:     Scott Chacon <schacon@gmail.com>
	CommitDate: Thu Apr 9 09:19:06 2009 -0700

	Ajout d'une limite à la fonction de log

	Limite la fonctionnalité de log aux 20 premières lignes

L'information `Commit` indique la personne qui a appliqué le patch et la date d'application.
L'information `Author` indique la personne qui a créé le patch et la date de création.

Il reste la possibilité que le patch ne s'applique pas proprement.
Peut-être votre branche principale a déjà trop divergé de la branche sur laquelle le patch a été construit, ou le patch dépend d'un autre patch qui n'a pas encore été appliqué.
Dans ce cas, le processus de `git am` échouera et vous demandera ce que vous souhaitez faire :

	$ git am 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Patch failed at 0001.
	When you have resolved this problem run "git am --resolved".
	If you would prefer to skip this patch, instead run "git am --skip".
	To restore the original branch and stop patching run "git am --abort".

Cette commande introduit des marqueurs de conflit dans tous les fichiers qui ont généré un problème, de la même manière qu'un conflit de fusion ou de rebasage.
Vous pouvez résoudre les problèmes de manière identique — éditez le fichier pour résoudre les conflits, indexez le nouveau fichier, puis lancez `git am --resolved` pour continuer avec le patch suivant :

	$ (correction du fichier)
	$ git add ticgit.gemspec
	$ git am --resolved
	Applying: seeing if this helps the gem

Si vous souhaitez que Git essaie de résoudre les conflits avec plus d'intelligence, vous pouvez passer l'option `-3` qui demande à Git de tenter une fusion à trois sources.
Cette option n'est pas active par défaut parce qu'elle ne fonctionne pas si le *commit* sur lequel le patch indique être basé n'existe pas dans votre dépôt.
Si par contre, le patch est basé sur un *commit* public, l'option `-3` est généralement beaucoup plus fine pour appliquer des patchs conflictuels :

	$ git am -3 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Using index info to reconstruct a base tree...
	Falling back to patching base and 3-way merge...
	No changes -- Patch already applied.

Dans ce cas, je cherchais à appliquer un patch qui avait déjà été intégré.
Sans l'option `-3`, cela aurait ressemblé à un conflit.

Si vous appliquez des patchs à partir d'un fichier mbox, vous pouvez aussi lancer la commande `am` en mode interactif qui s'arrête à chaque patch trouvé et vous demande si vous souhaitez l'appliquer :

	$ git am -3 -i mbox
	Commit Body is:
	--------------------------
	seeing if this helps the gem
	--------------------------
	Apply? [y]es/[n]o/[e]dit/[v]iew patch/[a]ccept all

C'est agréable si vous avez un certain nombre de patchs sauvegardés parce que vous pouvez voir les patchs pour vous rafraîchir la mémoire et ne pas les appliquer s'ils ont déjà été intégrés.

Quand tous les patchs pour votre sujet ont été appliqués et validés dans votre branche, vous pouvez choisir si et comment vous souhaitez les intégrer dans une branche au long cours.

## Vérification des branches distantes

Si votre contribution a été fournie par un utilisateur de Git qui a mis en place son propre dépôt public sur lequel il a poussé ses modifications et vous a envoyé l'URL du dépôt et le nom de la branche distante, vous pouvez les ajouter en tant que dépôt distant et réaliser les fusions localement.

Par exemple, si Jessica vous envoie un e-mail indiquant qu'elle a une nouvelle fonctionnalité géniale dans la branche `ruby-client` de son dépôt, vous pouvez la tester en ajoutant le dépôt distant et en tirant la branche localement :

	$ git remote add jessica git://github.com/jessica/monprojet.git
	$ git fetch jessica
	$ git checkout -b rubyclient jessica/ruby-client

Si elle vous envoie un autre mail indiquant une autre branche contenant une autre fonctionnalité géniale, vous pouvez la récupérer et la tester simplement à partir de votre référence distante.

C'est d'autant plus utile si vous travaillez en continu avec une personne.
Si quelqu'un n'a qu'un seul patch à contribuer de temps en temps, l'accepter via e-mail peut s'avérer moins consommateur en temps de préparation du serveur public, d'ajout et retrait de branches distantes juste pour tirer quelques patchs.
Vous ne souhaiteriez sûrement pas devoir gérer des centaines de dépôts distants pour intégrer à chaque fois un ou deux patchs.
Néanmoins, des scripts et des services hébergés peuvent rendre cette tâche moins ardue.
Cela dépend largement de votre manière de développer et de celle de vos contributeurs.

Cette approche a aussi l'avantage de vous fournir l'historique des validations.
Même si vous pouvez rencontrer des problèmes de fusion légitimes, vous avez l'information dans votre historique de la base ayant servi pour les modifications contribuées.
La fusion à trois sources est choisie par défaut plutôt que d'avoir à spécifier l'option `-3` en espérant que le patch a été généré à partir d'un instantané public auquel vous auriez accès.

Si vous ne travaillez pas en continu avec une personne mais souhaitez tout de même tirer les modifications de cette manière, vous pouvez fournir l'URL du dépôt distant à la commande `git pull`.
Cela permet de réaliser un tirage unique sans sauver l'URL comme référence distante :

	$ git pull git://github.com/typeunique/projet.git
	From git://github.com/typeunique/projet
	 * branch            HEAD       -> FETCH_HEAD
	Merge made by recursive.

## Déterminer les modifications introduites

Vous avez maintenant une branche thématique qui contient les contributions.
De ce point, vous pouvez déterminer ce que vous souhaitez en faire.
Cette section revisite quelques commandes qui vont vous permettre de faire une revue de ce que vous allez exactement introduire si vous fusionnez dans la branche principale.

Faire une revue de tous les *commits* dans cette branche s'avère souvent d'une grande aide.
Vous pouvez exclure les *commits* de la branche `master` en ajoutant l'option `--not` devant le nom de la branche.
Par exemple, si votre contributeur vous envoie deux patchs et que vous créez une branche appelée `contrib` et y appliquez ces patchs, vous pouvez lancer ceci :

	$ git log contrib --not master
	commit 5b6235bd297351589efc4d73316f0a68d484f118
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Oct 24 09:53:59 2008 -0700

	    seeing if this helps the gem

	commit 7482e0d16d04bea79d0dba8988cc78df655f16a0
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Mon Oct 22 19:38:36 2008 -0700

	    updated the gemspec to hopefully work better

Pour visualiser les modifications que chaque *commit* introduit, souvenez-vous que vous pouvez passer l'option `-p` à `git log` et elle ajoutera le diff introduit à chaque *commit*.

Pour visualiser un diff complet de ce qui arriverait si vous fusionniez cette branche thématique avec une autre branche, vous pouvez utiliser un truc bizarre pour obtenir les résultats corrects.
Vous pourriez penser à lancer ceci :

	$ git diff master

Cette commande affiche un diff mais elle peut être trompeuse.
Si votre branche `master` a avancé depuis que vous en avez créé la branche thématique, vous obtiendrez des résultats apparemment étranges.
Cela arrive parce que Git compare directement l'instantané de la dernière validation sur la branche thématique et celui de la dernière validation sur la branche `master`.
Par exemple, si vous avez ajouté une ligne dans un fichier sur la branche `master`, une comparaison directe donnera l'impression que la branche thématique va retirer cette ligne.

Si `master` est un ancêtre directe de la branche thématique, ce n'est pas un problème.
Si les deux historiques ont divergé, le diff donnera l'impression que vous ajoutez toutes les nouveautés de la branche thématique et retirez tout ce qui a été fait depuis dans la branche `master`.

Ce que vous souhaitez voir en fait, ce sont les modifications ajoutées sur la branche thématique — le travail que vous introduirez si vous fusionnez cette branche dans `master`.
Vous obtenez ce résultat en demandant à Git de comparer le dernier instantané de la branche thématique avec son ancêtre commun à la branche `master` le plus récent.

Techniquement, c'est réalisable en déterminant exactement l'ancêtre commun et en lançant la commande `diff` dessus :

	$ git merge-base contrib master
	36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
	$ git diff 36c7db

Néanmoins, comme ce n'est pas très commode, Git fournit un raccourci pour réaliser la même chose : la syntaxe à trois points.
Dans le contexte de la commande `diff`, vous pouvez placer trois points après une autre branche pour réaliser un `diff` entre le dernier instantané de la branche sur laquelle vous vous trouvez et son ancêtre commun avec une autre branche :

	$ git diff master...contrib

Cette commande ne vous montre que les modifications que votre branche thématique a introduites depuis son ancêtre commun avec master.
C'est une syntaxe très simple à retenir.

## Intégration des contributions

Lorsque tout le travail de votre branche thématique est prêt à être intégré dans la branche principale, il reste à savoir comment le faire.
De plus, il faut connaître le mode de gestion que vous souhaitez pour votre projet.
Vous avez de nombreux choix et je vais en traiter quelques-uns.

### Modes de fusion

Un mode simple fusionne votre travail dans la branche `master`.
Dans ce scénario, vous avez une branche `master` qui contient le code stable.
Quand vous avez des modifications prêtes dans une branche thématique, vous la fusionnez dans votre branche `master` puis effacez la branche thématique, et ainsi de suite.
Si vous avez un dépôt contenant deux branches nommées `ruby_client` et `php_client` qui ressemble à la figure 5-19 et que vous fusionnez `ruby_client` en premier, suivi de `php_client`, alors votre historique ressemblera à la fin à la figure 5-20.


![](http://git-scm.com/figures/18333fig0519-tn.png)

Figure 5-19. Historique avec quelques branches thématiques.


![](http://git-scm.com/figures/18333fig0520-tn.png)

Figure 5-20. Après fusion d'une branche thématique.

C'est probablement le mode le plus simple mais cela peut s'avérer problématique si vous avez à gérer des dépôts ou des projets plus gros.

Si vous avez plus de développeurs ou un projet plus important, vous souhaiterez probablement utiliser un cycle de fusion à au moins deux étapes.
Dans ce scénario, vous avez deux branches au long cours, `master` et `develop`, dans lequel vous déterminez que `master` est mis à jour seulement lors d'une version vraiment stable et tout le nouveau code est intégré dans la branche `develop`.
Vous poussez régulièrement ces deux branches sur le dépôt public.
Chaque fois que vous avez une nouvelle branche thématique à fusionner (figure 5-21), vous la fusionnez dans `develop` (figure 5-22).
Puis, lorsque vous étiquetez une version majeure, vous mettez `master` à niveau avec l'état stable de `develop` en avance rapide (figure 5-23).


![](http://git-scm.com/figures/18333fig0521-tn.png)

Figure 5-21. Avant la fusion d'une branche thématique.


![](http://git-scm.com/figures/18333fig0522-tn.png)

Figure 5-22. Après la fusion d'une branche thématique.


![](http://git-scm.com/figures/18333fig0523-tn.png)

Figure 5-23. Après une publication d'une branche thématique.

Ainsi, lorsque l'on clone le dépôt de votre projet, on peut soit extraire la branche `master` pour construire la dernière version stable et mettre à jour facilement ou on peut extraire la branche `develop` qui représente le nec plus ultra du développement.

Vous pouvez aussi continuer ce concept avec une branche d'intégration où tout le travail est fusionné.
Alors, quand la base de code sur cette branche est stable et que les tests passent, vous la fusionnez dans la branche `develop`.
Quand cela s'est avéré stable pendant un certain temps, vous mettez à jour la branche `master` en avance rapide.

### Gestions avec nombreuses fusions

Le projet Git dispose de quatre branches au long cours : `master`, `next`, `pu` (*proposed updates* : propositions) pour les nouveaux travaux et `maint` pour les backports de maintenance.
Quand une nouvelle contribution est proposée, elle est collectée dans des branches thématiques dans le dépôt du mainteneur d'une manière similaire à ce que j'ai décrit (voir figure 5-24).
À ce point, les fonctionnalités sont évaluées pour déterminer si elles sont stables et prêtes à être consommées ou si elles nécessitent un peaufinage.
Si elles sont stables, elles sont fusionnées dans `next` et cette branche est poussée sur le serveur public pour que tout le monde puisse essayer les fonctionnalités intégrées ensemble.


![](http://git-scm.com/figures/18333fig0524-tn.png)

Figure 5-24. Série complexe de branches thématiques contribuées en parallèle.

Si les fonctionnalités nécessitent encore du travail, elles sont fusionnées plutôt dans `pu`.
Quand elles sont considérées comme totalement stables, elles sont re-fusionnées dans `master` et sont alors reconstruites à partir des fonctionnalités qui résidaient dans `next` mais n'ont pu intégrer `master`.
Cela signifie que `master` évolue quasiment toujours en mode avance rapide, tandis que `next` est rebasé assez souvent et `pu` est rebasé encore plus souvent (voir figure 5-25).


![](http://git-scm.com/figures/18333fig0525-tn.png)

Figure 5-25. Fusion des branches thématiques dans les branches à long terme.

Quand une branche thématique a finalement été fusionnée dans `master`, elle est effacée du dépôt.
Le projet Git a aussi une branche `maint` qui est créée à partir de la dernière version pour fournir des patchs correctifs en cas de besoin de version de maintenance.
Ainsi, quand vous clonez le dépôt de Git, vous avez quatre branches disponibles pour évaluer le projet à différentes étapes de développement, selon le niveau de développement que vous souhaitez utiliser ou pour lequel vous souhaitez contribuer.
Le mainteneur a une gestion structurée qui lui permet d'évaluer et sélectionner les nouvelles contributions.

### Gestion par rebasage et sélection de *commit*

D'autres mainteneurs préfèrent rebaser ou sélectionner les contributions sur le sommet de la branche `master`, plutôt que les fusionner, de manière à conserver un historique à peu près linéaire.
Lorsque plusieurs modifications sont présentes dans une branche thématique et que vous souhaitez les intégrer, vous vous placez sur cette branche et vous lancer la commande `rebase` pour reconstruire les modifications à partir du sommet courant de la branche `master` (ou `develop`, ou autre).
Si cela fonctionne correctement, vous pouvez faire une avance rapide sur votre branche `master` et vous obtenez au final un historique de projet linéaire.

L'autre moyen de déplacer des modifications introduites dans une branche vers une autre consiste à les sélectionner (`cherry-pick`).
Une sélection dans Git ressemble à un rebasage appliqué à un *commit* unique.
Cela consiste à prendre le patch qui a été introduit lors d'une validation et à essayer de l'appliquer sur la branche sur laquelle on se trouve.
C'est très utile si on a un certain nombre de *commits* sur une branche thématique et que l'on veut n'en intégrer qu'un seul, ou si on n'a qu'un *commit* sur une branche thématique et qu'on préfère le sélectionner plutôt que de lancer `rebase`.
Par exemple, supposons que vous ayez un projet ressemblant à la figure 5-26.


![](http://git-scm.com/figures/18333fig0526-tn.png)

Figure 5-26. Historique d'exemple avant une sélection.

Si vous souhaitez tirer le *commit* `e43a6` dans votre branche `master`, vous pouvez lancer :

	$ git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
	Finished one cherry-pick.
	[master]: created a0a41a9: "More friendly message when locking the index fails."
	 3 files changed, 17 insertions(+), 3 deletions(-)

La même modification que celle introduite en `e43a6` est tirée mais vous obtenez une nouvelle valeur de SHA-1 car les dates d'application sont différentes.
À présent, votre historique ressemble à la figure 5-27.


![](http://git-scm.com/figures/18333fig0527-tn.png)

Figure 5-27. Historique après sélection d'un *commit* dans une branche thématique.

Maintenant, vous pouvez effacer votre branche thématique et abandonner les *commits* que vous n'avez pas tirés dans `master`.

## Étiquetage de vos publications

Quand vous décidez de créer une publication de votre projet, vous souhaiterez probablement étiqueter le projet pour pouvoir recréer cette version dans le futur.
Vous pouvez créer une nouvelle étiquette telle que décrite au chapitre 2.
Si vous décidez de signer l'étiquette en tant que mainteneur, la commande ressemblera à ceci :

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gmail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Si vous signez vos étiquettes, vous rencontrerez le problème de la distribution de votre clé publique PGP permettant de vérifier la signature.
Le mainteneur du projet Git a résolu le problème en incluant la clé publique comme blob dans le dépôt et en ajoutant une étiquette qui pointe directement sur ce contenu.
Pour faire de même, vous déterminez la clé de votre trousseau que vous voulez publier en lançant `gpg --list-keys` :

	$ gpg --list-keys
	/Users/schacon/.gnupg/pubring.gpg
	---------------------------------
	pub   1024D/F721C45A 2009-02-09 [expires: 2010-02-09]
	uid                  Scott Chacon <schacon@gmail.com>
	sub   2048g/45D02282 2009-02-09 [expires: 2010-02-09]

Ensuite, vous pouvez importer la clé directement dans la base de données Git en l'exportant de votre trousseau et en la redirigeant dans `git hash-object` qui écrit un nouveau blob avec son contenu dans Git et vous donne en sortie le SHA-1 du blob :

	$ gpg -a --export F721C45A | git hash-object -w --stdin
	659ef797d181633c87ec71ac3f9ba29fe5775b92

À présent, vous avez le contenu de votre clé dans Git et vous pouvez créer une étiquette qui pointe directement dessus en spécifiant la valeur SHA-1 que la commande `hash-object` vous a fournie :

	$ git tag -a maintainer-pgp-pub 659ef797d181633c87ec71ac3f9ba29fe5775b92

Si vous lancez `git push --tags`, l'étiquette `maintainer-pgp-pub` sera partagée publiquement.
Un tiers pourra vérifier une étiquette après import direct de votre clé publique PGP, en extrayant le blob de la base de donnée et en l'important dans GPG :

	$ git show maintainer-pgp-pub | gpg --import

Il pourra alors utiliser cette clé pour vérifier vos étiquettes signées.
Si de plus, vous incluez des instructions d'utilisation pour la vérification de signature dans le message d'étiquetage, l'utilisateur aura accès à ces informations en lançant la commande `git show <étiquette>`.

## Génération d'un nom de révision

Comme Git ne fournit pas par nature de nombres croissants tels que « r123 » à chaque validation, la commande `git describe` permet de générer un nom humainement lisible pour chaque *commit*.
Git concatène le nom de l'étiquette la plus proche, le nombre de validations depuis cette étiquette et un code SHA-1 partiel du *commit* que l'on cherche à définir :

	$ git describe master
	v1.6.2-rc1-20-g8c5b85c

De cette manière, vous pouvez exporter un instantané ou le construire et le nommer de manière intelligible.
En fait, si Git est construit à partir du source cloné depuis le dépôt Git, `git --version` vous donne exactement cette valeur.
Si vous demandez la description d'un instantané qui a été étiqueté, le nom de l'étiquette est retourné.

La commande `git describe` repose sur les étiquettes annotées (étiquettes créées avec les options `-a` ou `-s`).
Les étiquettes de publication doivent donc être créées de cette manière si vous souhaitez utiliser `git describe` pour garantir que les *commits* seront décrits correctement.
Vous pouvez aussi utiliser ces noms comme cible lors d'une extraction ou d'une commande `show`, bien qu'ils reposent sur le SHA-1 abrégé et pourraient ne pas rester valide indéfiniment.
Par exemple, le noyau Linux a sauté dernièrement de 8 à 10 caractères pour assurer l'unicité des objets SHA-1 et les anciens noms `git describe` sont par conséquent devenus invalides.

## Préparation d'une publication

Maintenant, vous voulez publier une version.
Une des étapes consiste à créer une archive du dernier instantané de votre code pour les pauvres hères qui n'utilisent pas Git.
La commande dédiée à cette action est `git archive` :

	$ git archive master --prefix='projet/' | gzip > `git describe master`.tar.gz
	$ ls *.tar.gz
	v1.6.2-rc1-20-g8c5b85c.tar.gz

Lorsqu'on ouvre l'archive, on obtient le dernier instantané du projet sous un répertoire `projet`.
On peut aussi créer une archive au format zip de manière similaire en passant l'option `--format=zip` à la commande `git archive` :

	$ git archive master --prefix='projet/' --format=zip > `git describe master`.zip

Voilà deux belles archives tar.gz et zip de votre projet prêtes à être téléchargées sur un site web ou envoyées par e-mail.

## Shortlog

Il est temps d'envoyer une annonce à la liste de diffusion des annonces relatives à votre projet.
Une manière simple d'obtenir rapidement une sorte de liste des modifications depuis votre dernière version ou e-mail est d'utiliser la commande `git shortlog`.
Elle résume toutes les validations dans l'intervalle que vous lui spécifiez.
Par exemple, ce qui suit vous donne un résumé de toutes les validations depuis votre dernière version si celle-ci se nomme v1.0.1 :

	$ git shortlog --no-merges master --not v1.0.1
	Chris Wanstrath (8):
	      Add support for annotated tags to Grit::Tag
	      Add packed-refs annotated tag support.
	      Add Grit::Commit#to_patch
	      Update version and History.txt
	      Remove stray `puts`
	      Make ls_tree ignore nils

	Tom Preston-Werner (4):
	      fix dates in history
	      dynamic version method
	      Version bump to 1.0.2
	      Regenerated gemspec for version 1.0.2

Vous obtenez ainsi un résumé clair de toutes les validations depuis v1.0.1, regroupées par auteur, prêt à être envoyé sur la liste de diffusion.
