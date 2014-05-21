# Indexation interactive

Git propose quelques scripts qui rendent les opérations en ligne de commande plus simples.
Nous allons à présent découvrir des commandes interactives vous permettant de choisir les fichiers ou les parties d'un fichier à incorporer à un *commit*.
Ces outils sont particulièrement pratiques si vous modifiez un grand nombre de fichiers et que vous souhaitez valider ces changements en modifications plus atomiques plutôt que d'un tenant.
De la sorte, vous vous assurez que vos *commits* sont des ensembles cohérents de modifications et qu'ils peuvent être facilement revus par vos collaborateurs.
Si vous exécutez `git add` avec l'option `-i` ou `--interactive`, Git entre en mode interactif et affiche quelque chose comme :

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now>

Vous vous apercevrez que cette commande propose une vue bien différente de votre index ; en gros, c'est la même information que vous auriez obtenue avec `git status` mais en plus succinct et plus instructif.
Cela liste les modifications que vous avez indexées à gauche et celles hors index à droite.

En dessous vient la section des commandes (*Commands*).
Vous aurez accès à un certain nombre d'actions, notamment indexer des fichiers, les enlever de l'index, indexer des parties de fichiers, ajouter des fichiers non indexés, et vérifier les différences de ce que vous avez indexé.

## Indexation des fichiers

Si vous tapez `2` ou `u` au prompt `What now>`, le script vous demande quels fichiers vous voulez indexer :

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Pour indexer les fichiers TODO et index.html, vous pouvez taper ces nombres :

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Le caractère `*` au début de la ligne de chaque fichier indique que celui-ci est sélectionné.
Si vous tapez Entrée sur l'invite `Update>>`, Git prend tout ce qui est sélectionné et l'indexe pour vous :

	Update>>
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

À présent, vous pouvez voir que les fichiers TODO et index.html sont indexés (*staged* en anglais) et que `simplegit.rb` ne l'est toujours pas.
Si vous souhaitez enlever de l'index le fichier TODO, utilisez `3` (ou `r` pour revert en anglais) :

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path

Un aperçu rapide à votre statut Git et vous pouvez voir que vous avez enlevé le fichier TODO de l'index :

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Pour voir la modification que vous avez indexée, utilisez `6` ou `d` (pour différence).
Cela vous affiche la liste des fichiers indexés et vous pouvez choisir ceux pour lesquels vous voulez consulter la différence.
C'est équivalent à `git diff --cached` en ligne de commande :

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

Avec ces commandes élémentaires, vous pouvez utiliser l'ajout interactif pour manipuler votre index un peu plus facilement.

## Indexations partielles

Git est également capable d'indexer certaines parties d'un fichier.
Par exemple, si vous modifiez en deux endroits votre fichier `simplegit.rb` et que vous souhaitez indexer une modification seulement, cela peut se faire très aisément avec Git.
En mode interactif, tapez `5` ou `p` (pour *patch* en anglais).
Git vous demandera quels fichiers vous voulez indexer partiellement, puis, pour chacun des fichiers sélectionnés, il affichera les parties du fichier où il y a des différences et vous demandera si vous souhaitez les indexer, une par une :

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]?

À cette étape, vous disposez de bon nombre d'options.
`?` vous liste les actions possibles dont voici une traduction :

	indexer cette partie [y,n,a,d,/,j,J,g,e,?]?
	y - indexer cette partie
	n - ne pas indexer cette partie
	a - indexer cette partie et toutes celles restantes dans ce fichier
	d - ne pas indexer cette partie ni aucune de celles restantes dans ce fichier
	g - sélectionner une partie à voir
	/ - chercher une partie correspondant à la regexp donnée
	j - laisser cette partie non décidée, voir la prochaine partie non encore décidée
	J - laisser cette partie non décidée, voir la prochaine partie
	k - laisser cette partie non décidée, voir la partie non encore décidée précédente
	K - laisser cette partie non décidée, voir la partie précédente
	s - couper la partie courante en parties plus petites
	e - modifier manuellement la partie courante
	? - afficher l'aide

En règle générale, vous choisirez `y` ou `n` pour indexer ou non chacun des blocs, mais tout indexer pour certains fichiers ou remettre à plus tard le choix pour un bloc peut également être utile.
Si vous indexez une partie d'un fichier et une autre non, votre statut ressemblera à peu près à ceci :

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

Le statut pour le fichier `simplegit.rb` est intéressant.
Il vous montre que quelques lignes sont indexées et d'autres non.
Vous avez partiellement indexé ce fichier.
Dès lors, vous pouvez quitter l'ajout interactif et exécuter `git commit` pour valider les fichiers partiellement indexés.

Enfin, vous pouvez vous passer du mode interactif pour indexer partiellement un fichier ; vous pouvez faire de même avec `git add -p` ou `git add --patch` en ligne de commande.
