# Annuler des actions

À tout moment, vous pouvez désirer annuler une de vos dernières actions.
Dans cette section, nous allons passer en revue quelques outils de base permettant d'annuler des modifications.
Il faut être très attentif car certaines de ces annulations sont définitives (elles ne peuvent pas être elles-mêmes annulées).
C'est donc un des rares cas d'utilisation de Git où des erreurs de manipulation peuvent entraîner des pertes définitives de données.

## Modifier le dernier *commit*

Une des annulations les plus communes apparaît lorsqu'on valide une modification trop tôt en oubliant d'ajouter certains fichiers, ou si on se trompe dans le message de validation.
Si vous souhaitez rectifier cette erreur, vous pouvez valider le complément de modification avec l'option `--amend` :

	$ git commit --amend

Cette commande prend en compte la zone d'index et l'utilise pour le *commit*.
Si aucune modification n'a été réalisée depuis la dernière validation (par exemple en lançant cette commande immédiatement après la dernière validation), alors l'instantané sera identique et la seule modification à introduire sera le message de validation.

L'éditeur de message de validation démarre, mais il contient déjà le message de la validation précédente.
Vous pouvez éditer ce message normalement, mais il écrasera le message de la validation précédente.

Par exemple, si vous validez une version puis réalisez que vous avez oublié de spécifier les modifications d'un fichier, vous pouvez taper les commandes suivantes :

	$ git commit -m 'validation initiale'
	$ git add fichier_oublie
	$ git commit --amend

Les trois dernières commandes donnent lieu à la création d'un unique *commit* — la seconde validation remplace le résultat de la première.

## Désindexer un fichier déjà indexé

Les deux sections suivantes démontrent comment bricoler les modifications dans votre zone d'index et votre zone de travail.
Un point sympathique est que la commande permettant de connaître l'état de ces deux zones vous rappelle aussi comment annuler les modifications.
Par exemple, supposons que vous avez modifié deux fichiers et voulez les valider comme deux modifications indépendantes, mais que vous avez tapé accidentellement `git add *` et donc indexé les deux.
Comment annuler l'indexation d'un des fichiers ? La commande `git status` vous le rappelle :

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   LISEZMOI.txt
	#       modified:   benchmarks.rb
	#

Juste sous le texte « Changes to be committed », elle vous indique d'utiliser `git reset HEAD <fichier>...` pour désindexer un fichier.
Utilisons donc ce conseil pour désindexer le fichier `benchmarks.rb` :


	$ git reset HEAD benchmarks.rb
	benchmarks.rb: locally modified
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   LISEZMOI.txt
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

La commande à taper peut sembler étrange mais elle fonctionne.
Le fichier `benchmarks.rb` est modifié mais de retour à l'état non indexé.

## Réinitialiser un fichier modifié

Que faire si vous réalisez que vous ne souhaitez pas conserver les modifications du fichier `benchmark.rb` ?
Comment le réinitialiser facilement, le ramener à son état du dernier instantané (ou lors du clonage, ou dans l'état dans lequel vous l'avez obtenu dans votre copie de travail) ?
Heureusement, `git status` est secourable.
Dans le résultat de la dernière commande, la zone de travail ressemble à ceci :

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Ce qui vous indique de façon explicite comment annuler des modifications que vous avez faites (du moins, les nouvelles versions de Git, 1.6.1 et supérieures le font, si vous avez une version plus ancienne, nous vous recommandons de la mettre à jour pour bénéficier de ces fonctionnalités pratiques).
Faisons comme indiqué :

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   LISEZMOI
	#

Vous pouvez constater que les modifications ont été annulées.
Vous devriez aussi vous apercevoir que c'est une commande dangereuse : toutes les modifications que vous auriez réalisées sur ce fichier ont disparu — vous venez tout juste de l'écraser avec un autre fichier.
N'utilisez jamais cette commande à moins d'être vraiment sûr de ne pas vouloir de ces modifications.
Si vous souhaitez seulement écarter momentanément cette modification, nous verrons comment mettre de côté et créer des branches dans le chapitre suivant ; ce sont de meilleures façons de procéder.
Souvenez-vous, tout ce qui a été validé dans Git peut quasiment toujours être récupéré.
Y compris des *commits* sur des branches qui ont été effacées ou des *commits* qui ont été écrasés par une validation avec l'option `--amend` (se référer au chapitre 9 pour la récupération de données).
Cependant, tout ce que vous perdez avant de l'avoir validé n'a aucune chance d'être récupérable via Git.
