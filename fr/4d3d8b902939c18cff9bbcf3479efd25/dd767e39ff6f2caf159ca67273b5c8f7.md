# Gitosis

Conserver les clés publiques de tous les utilisateurs dans le fichier `authorized_keys` n'est satisfaisant qu'un temps.
Avec des centaines d'utilisateurs, la gestion devient compliquée.
À chaque fois, il faut se connecter au serveur et il n'y a aucun contrôle d'accès — toute personne avec une clé dans le fichier a accès en lecture et écriture à tous les projets.

Il est temps de se tourner vers un logiciel largement utilisé appelé Gitosis.
Gitosis est une collection de scripts qui aident à gérer le fichier `authorized_keys` ainsi qu'à implémenter des contrôles d'accès simples.
La partie la plus intéressante de l'outil est que l'interface d'administration permettant d'ajouter des utilisateurs et de déterminer leurs droits n'est pas une interface web mais un dépôt Git spécial.
Vous paramétrez les informations dans ce projet et lorsque vous le poussez, Gitosis reconfigure les serveurs en fonction des données, ce qui est cool.

L'installation de Gitosis n'est pas des plus aisées.
Elle est plus simple sur un serveur Linux — les exemples qui suivent utilisent une distribution Ubuntu Server 8.10 de base.

Gitosis nécessite des outils Python.
Il faut donc installer le paquet Python setuptools qu'Ubuntu fournit en tant que python-setuptools :

	$ apt-get install python-setuptools

Ensuite, il faut cloner et installer Gitosis à partir du site principal du projet :

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

La dernière commande installe deux exécutables que Gitosis utilisera.
Ensuite, Gitosis veut gérer ses dépôts sous `/home/git`, ce qui est parfait.
Mais vous avez déjà installé vos dépôts sous `/opt/git`, donc au lieu de tout reconfigurer, créez un lien symbolique :

	$ ln -s /opt/git /home/git/repositories

Comme Gitosis gèrera vos clés pour vous, il faut effacer le fichier `authorized_keys`, réintroduire les clés plus tard, et laisser Gitosis contrôler le fichier automatiquement.
Pour l'instant, déplacez le fichier `authorized_keys` ailleurs :

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

Ensuite, il faut réactiver le shell pour l'utilisateur « git » si vous l'avez désactivé au moyen de `git-shell`.
Les utilisateurs ne pourront toujours pas se connecter car Gitosis contrôlera cet accès.
Modifions la ligne dans le fichier `/etc/passwd` :

	git:x:1000:1000::/home/git:/usr/bin/git-shell

pour la version d'origine :

	git:x:1000:1000::/home/git:/bin/sh

Vous pouvez maintenant initialiser Gitosis en lançant la commande `gitosis-init` avec votre clé publique.
Si votre clé publique n'est pas présente sur le serveur, il faut l'y télécharger :

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Cela permet à l'utilisateur disposant de cette clé de modifier le dépôt Git qui contrôle le paramétrage de Gitosis.
Ensuite, il faudra positionner manuellement le bit « execute » du script `post-update` du dépôt de contrôle nouvellement créé.

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Vous voilà prêt.
Si tout est réglé correctement, vous pouvez essayer de vous connecter par SSH au serveur en tant que l'utilisateur pour lequel vous avez ajouté la clé publique lors de l'initialisation de Gitosis.
Vous devriez voir quelque chose comme :

	$ ssh git@gitserveur
	PTY allocation request failed on channel 0
	fatal: unrecognized command 'gitosis-serve schacon@quaternion'
	  Connection to gitserveur closed.

Cela signifie que Gitosis vous a bien reconnu mais vous a rejeté car vous ne lancez pas de commandes Git.
Lançons donc une vraie commande Git en clonant le dépôt de contrôle Gitosis :

	# sur votre ordinateur local
	$ git clone git@gitserveur:gitosis-admin.git

Vous avez à présent un répertoire `gitosis-admin` qui contient deux entrées :

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

Le fichier `gitosis.conf` est le fichier de configuration qui permet de spécifier les utilisateurs, les dépôts et les permissions.
Le répertoire `keydir` stocke les clés publiques de tous les utilisateurs qui peuvent avoir un accès à vos dépôts — un fichier par utilisateur.
Le nom du fichier dans `keydir` (dans l'exemple précédent, `scott.pub`) sera différent pour vous — Gitosis utilise le nom issu de la description à la fin de la clé publique qui a été importée par le script `gitosis-init`.

Le fichier `gitosis.conf` contient la configuration du projet `gitosis-admin` cloné à l'instant :

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

Il indique que l'utilisateur « scott » — l'utilisateur dont la clé publique a servi à initialiser Gitosis — est le seul à avoir accès au projet `gitosis-admin`.

À présent, ajoutons un nouveau projet.
Ajoutons une nouvelle section appelée `mobile` où vous listez les développeurs de votre équipe mobile et les projets auxquels ces développeurs ont accès.
Comme « scott » est le seul utilisateur déclaré pour l'instant, vous devrez l'ajouter comme membre unique et vous créerez un nouveau projet appelé `iphone_projet` pour commencer :

	[group mobile]
	writable = iphone_projet
	members = scott

À chaque modification du projet `gitosis-admin`, il est nécessaire de valider les changements et de les pousser sur le serveur pour qu'ils prennent effet :

	$ git commit -am 'ajout iphone_projet et groupe mobile'
	[master]: created 8962da8: "changed name"
	 1 files changed, 4 insertions(+), 0 deletions(-)
	$ git push
	Counting objects: 5, done.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 272 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	To git@gitserver:/opt/git/gitosis-admin.git
	   fb27aec..8962da8  master -> master

Vous pouvez pousser vers le nouveau `iphone_projet` en ajoutant votre serveur comme dépôt distant dans votre dépôt local de projet et en poussant.
Vous n'avez plus besoin de créer manuellement un dépôt nu sur le serveur pour les nouveaux projets.
Gitosis les crée automatiquement dès qu'il voit la première poussée :

	$ git remote add origin git@gitserveur:iphone_projet.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_projet.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Notez qu'il est inutile de spécifier le chemin distant (en fait, c'est interdit), juste deux points et le nom du projet.
Gitosis gère les chemins.

Souhaitant travailler sur ce projet avec vos amis, vous devrez rajouter leurs clés publiques.
Plutôt que de les accoler manuellement au fichier `~/.ssh/authorized_keys` de votre serveur, il faut les ajouter, une clé par fichier, dans le répertoire `keydir`.
Le nom de fichier détermine le nom de l'utilisateur dans le fichier `gitosis.conf`.
Rajoutons les clés publiques de John, Josie et Jessica :

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Vous pouvez maintenant les ajouter tous à votre équipe `mobile` pour qu'ils aient accès en lecture/écriture à `iphone_projet` :

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

Après validation et poussée vers le serveur, les quatre utilisateurs sont admis à lire et écrire sur ce projet.

Gitosis fournit aussi des permissions simples.
Si vous souhaitez que John n'ait qu'un accès en lecture à ce projet, vous pouvez configurer ceci plutôt :

	[group mobile]
	writable = iphone_projet
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_projet
	members = john

À présent, John peut cloner le projet et récupérer les mises à jour, mais Gitosis lui refusera de pousser sur ce projet.
Vous pouvez créer autant que groupes que vous désirez contenant des utilisateurs et projets différents.
Vous pouvez aussi spécifier un autre groupe comme membre du groupe (avec le préfixe `@`) pour faire hériter ses membres automatiquement :

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_projet
	members   = @mobile_committers

	[group mobile_2]
	writable  = autre_iphone_projet
	members   = @mobile_committers john

Si vous rencontrez des problèmes, il peut être utile d'ajouter `loglevel=DEBUG` sous la section `[gitosis]`.
Si vous avez perdu le droit de pousser en envoyant une configuration vérolée, vous pouvez toujours réparer le fichier `/home/git/.gitosis.conf` sur le serveur — le fichier dans lequel Gitosis lit sa configuration.
Pousser sur le projet `gitosis-admin` provoque la recopie du fichier `gitosis.conf` à cet endroit.
Si vous éditez ce fichier à la main, il restera dans cet état jusqu'à la prochaine poussée.
