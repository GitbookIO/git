# Visualiser l'historique des validations

Après avoir créé plusieurs *commits* ou si vous avez cloné un dépôt ayant un historique de *commits*, vous souhaitez probablement revoir le fil des évènements.
Pour ce faire, la commande `git log` est l'outil le plus basique et le plus puissant.

Les exemples qui suivent utilisent un projet très simple nommé `simplegit` utilisé pour les démonstrations.
Pour récupérer le projet, lancez :

	git clone git://github.com/schacon/simplegit-progit.git

Lorsque vous lancez `git log` dans le répertoire de ce projet, vous devriez obtenir un résultat qui ressemble à ceci :

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

Par défaut, `git log` invoqué sans argument énumère en ordre chronologique inversé les *commits* réalisés.
Cela signifie que les *commits* les plus récents apparaissent en premier.
Comme vous le remarquez, cette commande indique chaque *commit* avec sa somme de contrôle SHA-1, le nom et l'e-mail de l'auteur, la date et le message du *commit*.

`git log` dispose d'un très grand nombre d'options permettant de paramétrer exactement ce que l'on cherche à voir.
Nous allons détailler quelques-unes des plus utilisées.

Une des options les plus utiles est `-p`, qui montre les différences introduites entre chaque validation.
Vous pouvez aussi utiliser `-2` qui limite la sortie de la commande aux deux entrées les plus récentes :

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,5 +5,5 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	     s.name      =   "simplegit"
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"
	     s.email     =   "schacon@gee-mail.com

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Cette option affiche la même information mais avec un diff suivant directement chaque entrée.
C'est très utile pour des revues de code ou pour naviguer rapidement à travers l'historique des modifications qu'un collaborateur a apportées.

Quelques fois, il est plus facile de visualiser les modifications au niveau des mots plutôt qu'au niveau des lignes.
L'option `--word-diff` ajoutée à la commande `git log -p` modifie l'affichage des différences en indiquant les modifications au sein des lignes.
Le format de différence sur les mots est généralement peu utile pour les fichiers de code source, mais s'avère particulièrement pertinent pour les grands fichiers de texte, tels que des livres ou des dissertations. En voici un exemple :

	$ git log -U1 --word-diff
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -7,3 +7,3 @@ spec = Gem::Specification.new do |s|
	    s.name      =   "simplegit"
	    s.version   =   [-"0.1.0"-]{+"0.1.1"+}
	    s.author    =   "Scott Chacon"

Comme vous le voyez, les indications de lignes ajoutées ou retirées d'un *diff* normal ont disparu.
Les modifications sont affichées en ligne.
Les mots ajoutés sont encadrés par `{+ +}` tandis que les mots effacés sont encadrés par `[- -]`.
Vous souhaiterez sûrement réduire le contexte habituel de trois lignes à seulement une ligne, du fait qu'il est à présent constitué de mots et non de lignes.
Cela est réalisé avec l'option `-U1` utilisée dans l'exemple précédent.

Vous pouvez aussi utiliser une liste d'options de résumé avec `git log`.
Par exemple, si vous souhaitez visualiser des statistiques résumées pour chaque *commit*, vous pouvez utiliser l'option `--stat` :

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 LISEZMOI           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Comme vous pouvez le voir, l'option `--stat` affiche sous chaque entrée de validation une liste des fichiers modifiés, combien de fichiers ont été changés et combien de lignes ont été ajoutées ou retirées dans ces fichiers.
Elle ajoute un résumé des informations en fin de sortie.
Une autre option utile est `--pretty`.
Cette option modifie le journal vers un format différent.
Quelques options incluses sont disponibles.
L'option `oneline` affiche chaque *commit* sur une seule ligne, ce qui peut s'avérer utile lors de la revue d'un long journal.
De plus, les options `short` (court), `full` (complet) et `fuller` (plus complet) montrent le résultat à peu de choses près dans le même format mais avec plus ou moins d'informations :

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

L'option la plus intéressante est `format` qui permet de décrire précisément le format de sortie.
C'est spécialement utile pour générer des sorties dans un format facile à analyser par une machine — lorsqu'on spécifie intégralement et explicitement le format, on s'assure qu'il ne changera pas au gré des mises à jour de Git :

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Le tableau 2-1 liste les options de formatage les plus utiles.

	Option	Description du formatage
	%H	Somme de contrôle du commit
	%h	Somme de contrôle abrégée du commit
	%T	Somme de contrôle de l'arborescence
	%t	Somme de contrôle abrégée de l'arborescence
	%P	Sommes de contrôle des parents
	%p	Sommes de contrôle abrégées des parents
	%an	Nom de l'auteur
	%ae	E-mail de l'auteur
	%ad	Date de l'auteur (au format de l'option -date=)
	%ar	Date relative de l'auteur
	%cn	Nom du validateur
	%ce	E-mail du validateur
	%cd	Date du validateur
	%cr	Date relative du validateur
	%s	Sujet

Vous pourriez vous demander quelle est la différence entre _auteur_  et _validateur_.
L'_auteur_ est la personne qui a réalisé initialement le travail, alors que le _validateur_ est la personne qui a effectivement validé ce travail en gestion de version.
Donc, si quelqu'un envoie un patch à un projet et un des membres du projet l'applique, les deux personnes reçoivent le crédit — l'écrivain en tant qu'auteur, et le membre du projet en tant que validateur.
Nous traiterons plus avant de cette distinction au chapitre 5.

Les options `oneline` et `format` sont encore plus utiles avec une autre option `log` appelée `--graph`.
Cette option ajoute un joli graphe en caractères ASCII pour décrire l'historique des branches et fusions, ce que nous pouvons visualiser pour notre copie du dépôt de Grit :

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Les options ci-dessus ne sont que des options simples de format de sortie de `git log` — il y en a de nombreuses autres.
Le tableau 2-2 donne une liste des options que nous avons traitées ainsi que d'autres options communément utilisées accompagnées de la manière dont elles modifient le résultat de la commande `log`.

	Option	Description
	-p	Affiche le patch appliqué par chaque commit
	--stat	Affiche les statistiques de chaque fichier pour chaque commit
	--shortstat	N'affiche que les ligne modifiées/insérées/effacées de l'option --stat
	--name-only	Affiche la liste des fichiers modifiés après les informations du commit
	--name-status	Affiche la liste des fichiers affectés accompagnés des informations d'ajout/modification/suppression
	--abbrev-commit	N'affiche que les premiers caractères de la somme de contrôle SHA-1
	--relative-date	Affiche la date en format relatif (par exemple "2 weeks ago" : il y a deux semaines) au lieu du format de date complet
	--graph	Affiche en caractères ASCII le graphe de branches et fusions en vis-à-vis de l'historique
	--pretty=<format>	Affiche les *commits* dans un format alternatif. Les formats incluent `oneline`, `short`, `full`, `fuller`, et `format` (où on peut spécifier son propre format)
	--oneline	Option de convenance correspondant à `--pretty=oneline --abbrev-commit`

## Limiter la longueur de l'historique

En complément des options de formatage de sortie, `git log` est pourvu de certaines options de limitation utiles — des options qui permettent de restreindre la liste à un sous-ensemble de *commits*.
Vous avez déjà vu une de ces options — l'option `-2` qui ne montre que les deux derniers *commits*.
En fait, on peut utiliser `-<n>`, où `n` correspond au nombre de *commits* que l'on cherche à visualiser en partant des plus récents.
En vérité, il est peu probable que vous utilisiez cette option, parce que Git injecte par défaut sa sortie dans un outil de pagination qui permet de la visualiser page à page.

Cependant, les options de limitation portant sur le temps, telles que `--since` (depuis) et `--until` (jusqu'à) sont très utiles.
Par exemple, la commande suivante affiche la liste des *commits* des deux dernières semaines :

	$ git log --since=2.weeks

Cette commande fonctionne avec de nombreux formats — vous pouvez indiquer une date spécifique (2008-01-05) ou une date relative au présent telle que "2 years 1 day 3 minutes ago".

Vous pouvez aussi restreindre la liste aux *commits* vérifiant certains critères de recherche.
L'option `--author` permet de filtrer sur un auteur spécifique, et l'option `--grep` permet de chercher des mots clés dans les messages de validation.
Notez que si vous cherchez seulement des *commits* correspondant simultanément aux deux critères, vous devez ajouter l'option `--all-match`, car par défaut ces commandes retournent les *commits* vérifiant au moins un critère lors de recherche.

La dernière option vraiment utile à `git log` est la spécification d'un chemin.
Si un répertoire ou un nom de fichier est spécifié, le journal est limité aux *commits* qui ont introduit des modifications aux fichiers concernés.
C'est toujours la dernière option de la commande, souvent précédée de deux tirets (`--`) pour séparer les chemins des options précédentes.

Le tableau 2-3 récapitule les options que nous venons de voir ainsi que quelques autres pour référence.

	Option	Description
	-(n)	N'affiche que les n derniers *commits*
	--since, --after	Limite l'affichage aux *commits* réalisés après la date spécifiée
	--until, --before	Limite l'affichage aux *commits* réalisés avant la date spécifiée
	--author	Ne montre que les *commits* dont le champ auteur correspond à la chaîne passée en argument
	--committer	Ne montre que les *commits* dont le champ validateur correspond à la chaîne passée en argument

Par exemple, si vous souhaitez visualiser quels *commits* modifiant les fichiers de test dans l'historique du source de Git ont été validés par Junio Hamano et n'étaient pas des fusions durant le mois d'octobre 2008, vous pouvez lancer ce qui suit :

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

À partir des 20 000 *commits* constituant l'historique des sources de Git, cette commande extrait les 6 qui correspondent aux critères.

## Utiliser une interface graphique pour visualiser l'historique

Si vous préférez utiliser un outil plus graphique pour visualiser l'historique d'un projet, vous pourriez jeter un œil à un programme distribué avec Git nommé `gitk`.
Gitk est un outil graphique mimant les fonctionnalités de `git log`, et il donne accès à quasiment toutes les options de filtrage de `git log`.
Si vous tapez `gitk` en ligne de commande, vous devriez voir une interface ressemblant à la figure 2-2.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Figure 2-2. Le visualiseur d'historique gitk.

Vous pouvez voir l'historique des *commits* dans la partie supérieure de la fenêtre avec un graphique d'enchaînement.
Le visualisateur de diff dans la partie inférieure de la fenêtre affiche les modifications introduites par le *commit* sélectionné.
