# Le remisage

Souvent, lorsque vous avez travaillé sur une partie de votre projet, les choses sont dans un état instable mais vous voulez changer de branche pour travailler momentanément sur autre chose.
Le problème est que vous ne voulez pas valider un travail à moitié fait seulement pour pouvoir y revenir plus tard.
La réponse à cette problématique est la commande `git stash`.

Remiser prend l'état en cours de votre répertoire de travail, c'est-à-dire les fichiers modifiés et l'index, et l'enregistre dans la pile des modifications non finies que vous pouvez réappliquer à n'importe quel moment.

## Remiser votre travail

Pour démontrer cette possibilité, allez dans votre projet et commencez à travailler sur quelques fichiers et à indexer l'un de ces changements.
Si vous exécutez `git status`, vous pouvez voir votre état instable :

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

À ce moment-là, vous voulez changer de branche, mais vous ne voulez pas encore valider ce travail ; vous allez donc remiser vos modifications.
Pour créer une nouvelle remise sur votre pile, exécutez `git stash` :

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

Votre répertoire de travail est propre :

	$ git status
	# On branch master
	nothing to commit (working directory clean)

À ce moment, vous pouvez facilement changer de branche et travailler autre part ; vos modifications sont conservées dans votre pile.
Pour voir quelles remises vous avez sauvegardées, vous pouvez utiliser la commande `git stash list` :

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

Dans ce cas, deux remises ont été créées précédemment, vous avez donc accès à trois travaux remisés différents.
Vous pouvez réappliquer celui que vous venez juste de remiser en utilisant la commande affichée dans la sortie d'aide de la première commande de remise : `git stash apply`.
Si vous voulez appliquer une remise plus ancienne, vous pouvez la spécifier en la nommant, comme ceci : `git stash apply stash@{2}`.
Si vous ne spécifiez pas une remise, Git présume que vous voulez la remise la plus récente et essaye de l'appliquer.

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

Vous pouvez observer que Git remodifie les fichiers non validés lorsque vous avez créé la remise.
Dans ce cas, vous aviez un répertoire de travail propre lorsque vous avez essayé d'appliquer la remise et vous l'avez fait sur la même branche que celle où vous l'aviez créée ; mais avoir un répertoire de travail propre et l'appliquer sur la même branche n'est pas nécessaire pour réussir à appliquer une remise.
Vous pouvez très bien créer une remise sur une branche, changer de branche et essayer d'appliquer les modifications.
Vous pouvez même avoir des fichiers modifiés et non validés dans votre répertoire de travail quand vous appliquez une remise, Git vous indique les conflits de fusions si quoi que ce soit ne s'applique pas proprement.

Par défaut, les modifications de vos fichiers sont réappliquées, mais pas les indexations.
Pour cela, vous devez exécuter la commande `git stash apply` avec l'option `--index` pour demander à Git d'essayer de réappliquer les modifications de votre index.
Si vous exécutez cela à la place de la commande précédente, vous vous retrouvez dans la position d'origine de la remise :

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

L'option `apply` essaye seulement d'appliquer le travail remisé, vous aurez toujours la remise dans votre pile.
Pour la supprimer, vous pouvez exécuter `git stash drop` avec le nom de la remise à supprimer :

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

Vous pouvez également exécuter `git stash pop` pour appliquer et supprimer immédiatement la remise de votre pile.

## Défaire l'effet d'une remise

Dans certains cas, il est souhaitable de pouvoir appliquer une modification remisée, réaliser d'autres modifications, puis défaire les modifications de la remise.
Git ne fournit pas de commande `stash unapply` mais il est possible d'obtenir le même effet en extrayant les modifications qui constituent la remise et en appliquant leur inverse :

    $ git stash show -p stash@{0} | git apply -R

Ici aussi, si la remise n'est pas indiquée, Git utilise la plus récente.

    $ git stash show -p | git apply -R

La création d'un alias permettra d'ajouter effectivement la commande `stash-unapply` à votre Git.
Par exemple :

    $ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
    $ git stash
    $ #... work work work
    $ git stash-unapply

## Créer une branche depuis une remise

Si vous remisez votre travail, et l'oubliez pendant un temps en continuant sur la branche où vous avez créé la remise, vous pouvez avoir un problème en réappliquant le travail.
Si l'application de la remise essaye de modifier un fichier que vous avez modifié depuis, vous allez obtenir des conflits de fusion et vous devrez essayer de les résoudre.
Si vous voulez un moyen plus facile de tester une nouvelle fois les modifications remisées, vous pouvez exécuter `git stash branch`, qui créera une nouvelle branche à votre place, récupérant le *commit* où vous étiez lorsque vous avez créé la remise, réappliquera votre travail dedans, et supprimera finalement votre remise si cela a réussi :

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

C'est un bon raccourci pour récupérer facilement du travail remisé et pouvoir travailler dessus dans une nouvelle branche.
