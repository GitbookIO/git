# Sous-modules

Il arrive souvent lorsque vous travaillez sur un projet que vous deviez utiliser un autre projet comme dépendance.
Cela peut être une bibliothèque qui est développée par une autre équipe ou que vous développez séparément pour l'utiliser dans plusieurs projets parents.
Ce scénario provoque un problème habituel : vous voulez être capable de gérer deux projets séparés tout en utilisant l'un dans l'autre.

Voici un exemple.
Supposons que vous développez un site web et que vous créez des flux Atom.
Plutôt que d'écrire votre propre code de génération Atom, vous décidez d'utiliser une bibliothèque.
Vous allez vraisemblablement devoir soit inclure ce code depuis un gestionnaire partagé comme CPAN ou Ruby gem, soit copier le code source dans votre propre arborescence de projet.
Le problème d'inclure la bibliothèque en tant que bibliothèque externe est qu'il est difficile de la personnaliser de quelque manière que ce soit et encore plus de la déployer, car vous devez vous assurer de la disponibilité de la bibliothèque chez chaque client.
Mais le problème d'inclure le code dans votre propre projet est que n'importe quelle personnalisation que vous faites est difficile à fusionner lorsque les modifications du développement principal arrivent.

Git gère ce problème avec les sous-modules.
Les sous-modules vous permettent de gérer un dépôt Git comme un sous-répertoire d'un autre dépôt Git.
Cela vous laisse la possibilité de cloner un dépôt dans votre projet et de garder isolés les *commits* de ce dépôt.

## Démarrer un sous-module

Supposons que vous voulez ajouter la bibliothèque Rack (un serveur d'application web en Ruby) à votre projet, avec la possibilité de gérer vos propres changements à celle-ci mais en continuant de fusionner avec la branche principale.
La première chose que vous devez faire est de cloner le dépôt externe dans votre sous-répertoire.
Ajouter des projets externes comme sous-modules de votre projet se fait avec la commande `git submodule add` :

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.

Vous avez maintenant le projet Rack dans le sous-répertoire `rack` à l'intérieur de votre propre projet.
Vous pouvez aller dans ce sous-répertoire, effectuer des modifications, ajouter votre propre dépôt distant pour y pousser vos modifications, récupérer et fusionner depuis le dépôt originel, et plus encore.
Si vous exécutez `git status` juste après avoir ajouté le sous-module (donc dans le répertoire parent du répertoire `rack`), vous verrez deux choses :

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

Premièrement, vous remarquerez le fichier `.gitmodules`.
C'est un fichier de configuration sauvegardant la liaison entre l'URL du projet et le sous-répertoire local où vous l'avez mis :

	$ cat .gitmodules
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

Si vous avez plusieurs sous-modules, vous aurez plusieurs entrées dans ce fichier.
Il est important de noter que ce fichier est en gestion de version comme vos autres fichiers, à l'instar de votre fichier `.gitignore`.
Il est poussé et tiré comme le reste de votre projet.
C'est également le moyen que les autres personnes qui clonent votre projet puissent savoir où récupérer le projet du sous-module.

L'autre information dans la sortie de `git status` est l'entrée `rack`.
Si vous exécutez `git diff`, vous verrez quelque chose d'intéressant :

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Même si `rack` est un sous-répertoire de votre répertoire de travail, Git le voit comme un sous-module et ne suit pas son contenu (si vous n'êtes pas dans ce répertoire).
En échange, Git l'enregistre comme un *commit* particulier de ce dépôt.
Lorsque vous faites des modifications et des validations dans ce sous-répertoire, le super-projet (le projet contenant le sous-module) remarque que la branche HEAD a changé et enregistre le *commit* exact dans lequel il se trouve à ce moment.
De cette manière, lorsque d'autres clonent ce super-projet, ils peuvent recréer exactement le même environnement.

Un autre point important avec les sous-modules : Git enregistre le *commit* exact où ils se trouvent.
Vous ne pouvez pas enregistrer un module comme étant en branche `master` ou n'importe quelle autre référence symbolique.

Au moment de valider, vous voyez quelque chose comme :

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

Remarquez le mode 160000 pour l'entrée `rack`.
C'est un mode spécial de Git qui signifie globalement que vous êtes en train d'enregistrer un *commit* comme un répertoire plutôt qu'un sous-répertoire ou un fichier.

Vous pouvez traiter le répertoire `rack` comme un projet séparé et mettre à jour votre super-projet de temps en temps avec une référence au dernier *commit* de ce sous-projet.
Toutes les commandes Git fonctionnent indépendamment dans les deux répertoires :

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

## Cloner un projet avec des sous-modules

Maintenant, vous allez apprendre à cloner un projet contenant des sous-modules.
Quand vous récupérez un tel projet, vous obtenez les différents répertoires qui contiennent les sous-modules, mais encore aucun des fichiers :

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

Le répertoire `rack` est présent mais vide.
Vous devez exécuter deux commandes : `git submodule init` pour initialiser votre fichier local de configuration, et `git submodule update` pour tirer toutes les données de ce projet et récupérer le *commit* approprié tel que listé dans votre super-projet :

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

Votre répertoire `rack` est maintenant dans l'état exact dans lequel il était la dernière fois que vous avez validé.
Si un autre développeur modifie le code de `rack` et valide, que vous tirez cette référence et que vous fusionnez, vous obtiendrez quelque chose d'un peu étrange :

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

En réalité, vous n'avez fusionné que la modification de la référence de votre sous-module, mais Git n'a pas mis à jour le code dans le répertoire du sous-module, de ce fait, cela ressemble à un état « en cours » dans votre répertoire de travail :

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

La cause de tout cela, c'est que la référence pour votre sous-module ne correspond pas à ce qu'il y a actuellement dans son répertoire.
Pour corriger ça, vous devez exécuter une nouvelle fois `git submodule update` :

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

Vous devez faire cela à chaque fois que vous récupérez une modification du sous-module dans le projet principal.
C'est étrange, mais ça fonctionne.

Un problème habituel peut survenir lorsqu'un développeur modifie localement un sous-module, mais ne le pousse pas sur un serveur public.
Puis, il valide une référence à cet état non public et pousse le super-projet.
Lorsque les autres développeurs exécutent `git submodule update`, le système dans le sous-module ne trouve pas le *commit* qui est référencé, car il existe uniquement sur le système du premier développeur.
Dans ce cas, vous verrez une erreur de ce style :

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

Vous devez regarder qui a modifié le sous-module en dernier :

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

Envoyez-lui un mail pour lui crier dessus.

## Super-projets

Parfois, les développeurs désirent séparer un gros projet en sous-répertoires en fonction de l'équipe qui travaille dessus.
C'est logique si vous venez de CVS ou de Subversion, où vous aviez l'habitude de définir un module ou un ensemble de sous-répertoires, et que vous voulez garder ce type de procédure de travail.

Une bonne manière de le faire avec Git est de créer un dépôt Git pour chaque sous-dossier, et de créer un super-projet contenant les différents modules.
Le bénéfice de cette approche est de pouvoir spécifier les relations entre les projets avec des étiquettes et des branches depuis le super-projet.

## Les problèmes avec les sous-modules

Cependant, utiliser des sous-modules ne se déroule pas sans accroc.
Premièrement, vous devez être relativement prudent lorsque vous travaillez dans le répertoire du sous-module.
Lorsque vous exécutez `git submodule update`, cela récupère une version spécifique d'un projet, mais pas à l'intérieur d'une branche.
Cela s'appelle avoir la tête en l'air (*detached head*), c'est-à-dire que votre HEAD référence directement un *commit*, pas une référence symbolique.
Le problème est que vous ne voulez généralement pas travailler dans un environnement tête en l'air, car il est facile de perdre des modifications dans ces conditions.
Si vous faites un premier `git submodule update`, que vous validez des modifications dans ce sous-module sans créer vous-même de branche pour y travailler, et que vous exécutez un nouveau `git submodule update` depuis le projet parent sans y avoir validé pendant ce temps, Git écrasera vos modifications sans vous le dire.
Techniquement, vous ne perdrez pas votre travail, mais vous n'aurez aucune branche s'y référant, il sera donc assez difficile de le récupérer.

Pour éviter ce problème, créez toujours une branche lorsque vous travaillez dans un répertoire de sous-module avec `git checkout -b work` ou une autre commande équivalente.
Lorsque vous mettrez à jour le sous-module une deuxième fois, Git réinitialisera toujours votre travail, mais vous aurez au moins une référence à votre travail pour y retourner.

Commuter des branches qui contiennent des sous-modules peut également s'avérer difficile.
Si vous créez une nouvelle branche, y ajoutez un sous-module, et revenez ensuite à une branche dépourvue de ce sous-module, vous aurez toujours le répertoire de ce sous-module comme un répertoire non suivi :

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/


Vous devez soit déplacer ce répertoire hors de votre dépôt local, soit le supprimer et dans ce dernier cas, vous devrez le cloner une nouvelle fois lorsque vous recommuterez et vous pouvez donc perdre des modifications ou des branches locales si vous ne les avez pas poussées.

La dernière difficulté présentée consiste à passer d'un sous-répertoire à un sous-module.
Si vous suiviez des fichiers dans votre projet et que vous voulez les déplacer dans un sous-module, vous devez être très prudent ou Git sera inflexible.
Présumons que vous avez les fichiers du projet `rack` dans un sous-répertoire de votre projet, et que vous voulez les transformer en un sous-module.
Si vous supprimez le sous-répertoire et que vous exécutez `submodule add`, Git vous hurle dessus avec :

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

Vous devez d'abord supprimer le répertoire `rack` de l'index.
Vous pourrez ensuite ajouter le sous-module :

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.

Maintenant, supposons que vous avez fait cela dans une branche.
Si vous essayez de basculer dans une ancienne branche où ces fichiers sont toujours dans l'arbre de projet plutôt que comme sous-module, vous aurez cette erreur :

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

Vous devez déplacer le répertoire du sous-module `rack` en dehors de votre dépôt local avant de pouvoir basculer vers une branche qui ne l'a pas :

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

Puis, lorsque vous recommutez, vous aurez un répertoire `rack` vide.
Vous pouvez soit exécuter `git submodule update` pour cloner une nouvelle fois, ou vous pouvez remettre votre répertoire `/tmp/rack` dans votre répertoire vide.
