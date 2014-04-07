# Migrer sur Git

Si vous avez une base de code dans un autre VCS et que vous avez décidé d'utiliser Git, vous devez migrer votre projet d'une manière ou d'une autre.
Ce chapitre traite d'outils d'import inclus dans Git avec des systèmes communs et démontre comment développer votre propre outil.

## Importer

Nous allons détailler la manière d'importer des données à partir de deux des plus grands systèmes SCM utilisés en milieu professionnel, Subversion et Perforce, pour les raisons combinées qu'ils regroupent la majorité des utilisateurs que je connais migrer vers Git et que des outils de grande qualité pour ces deux systèmes sont distribués avec Git.

## Subversion

Si vous avez lu la section précédente sur l'utilisation de `git svn`, vous pouvez facilement utiliser ces instructions pour réaliser un `git svn clone` du dépôt.
Ensuite, arrêtez d'utiliser le serveur Subversion, poussez sur un nouveau serveur Git et commencez à l'utiliser.
Si vous voulez l'historique, vous pouvez l'obtenir aussi rapidement que vous pourrez tirer les données du serveur Subversion (ce qui peut prendre un certain temps).

Cependant, l'import n'est pas parfait ; et comme cela prend autant de temps, autant le faire bien.
Le premier problème est l'information d'auteur.
Dans Subversion, chaque personne qui valide dispose d'un compte sur le système qui est enregistré dans l'information de validation.
Les exemples de la section précédente montrent `schacon` à certains endroits, tels que la sortie de `blame` ou de `git svn log`.
Si vous voulez transposer ces données vers des données d'auteur au format Git, vous avez besoin d'une correspondance entre les utilisateurs Subversion et les auteurs Git.
Créez un fichier appelé `users.txt` contenant cette équivalence dans le format suivant :

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

Pour récupérer la liste des noms d'auteurs utilisés par SVN, vous pouvez utiliser la ligne suivante :

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

Cela génère une sortie au format XML — vous pouvez visualiser les auteurs, créer une liste unique puis éliminer l'XML.
Évidemment, cette ligne ne fonctionne que sur une machine disposant des commandes `grep`, `sort` et `perl`.
Ensuite, redirigez votre sortie dans votre fichier users.txt pour pouvoir y ajouter en correspondance les données équivalentes Git.

Vous pouvez alors fournir ce fichier à `git svn` pour l'aider à convertir les données d'auteur plus précisément.
Vous pouvez aussi indiquer à `git svn` de ne pas inclure les méta-données que Subversion importe habituellement en passant l'option `--no-metadata` à la commande `clone` ou `init`.
Au final, votre commande d'import ressemble à ceci :

	$ git-svn clone http://mon-projet.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

Maintenant, l'import depuis Subversion dans le répertoire `my_project` est plus présentable.
En lieu et place de *commits* qui ressemblent à ceci :

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029

les *commits* ressemblent à ceci :

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

Non seulement le champ auteur a meilleure mine, mais de plus, le champ `git-svn-id` a disparu.

Il est encore nécessaire de faire un peu de ménage `post-import`. Déjà, vous devriez nettoyer les références bizarres que `git svn` crée.
Premièrement, déplacez les étiquettes pour qu'elles soient de vraies étiquettes plutôt que des branches distantes étranges, ensuite déplacez le reste des branches pour qu'elles deviennent locales.

Pour déplacer les étiquettes et en faire de vraies étiquettes Git, lancez :

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do
	git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname";
	done

Cela récupère les références déclarées comme branches distantes commençant par `tags/` et les transforme en vraies étiquettes (légères).

Ensuite, déplacez le reste des références sous `refs/remotes` en branches locales :

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do
	git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname";
	done

À présent, toutes les vieilles branches sont des vraies branches Git et toutes les vieilles étiquettes sont de vraies étiquettes Git.
La dernière activité consiste à ajouter votre nouveau serveur Git comme serveur distant et à y pousser votre projet transformé.
Pour pousser le tout, y compris branches et étiquettes, lancez :

	$ git push origin --tags

Toutes vos données, branches et tags sont à présent disponibles sur le serveur Git comme import propre et naturel.

## Perforce

L'autre système duquel on peut souhaiter importer les données est Perforce.
Un outil d'import Perforce est aussi distribué avec Git.
Si votre version de Git est antérieures à 1.7.11, celui-ci n'est disponible que dans la section `contrib` du code source.
Dans ce dernier cas, pour le lancer, il vous faut récupérer le code source de Git que vous pouvez télécharger à partir de `git.kernel.org` :

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

Dans ce répertoire `fast-import`, vous devriez trouver un script exécutable Python appelé `git-p4`.
Python et l'outil `p4` doivent être installés sur votre machine pour que cet import fonctionne.
Par exemple, nous importerons le projet Jam depuis le Perforce Public Depot.
Pour installer votre client, vous devez exporter la variable d'environnement `P4PORT` qui pointe sur le dépôt Perforce :

	$ export P4PORT=public.perforce.com:1666

Lancez la commande `git-p4 clone` pour importer le projet Jam depuis le serveur Perforce, en fournissant le dépôt avec le chemin du projet et le chemin dans lequel vous souhaitez importer le projet :

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

Si vous vous rendez dans le répertoire  `/opt/p4import` et lancez la commande `git log`, vous pouvez examiner votre projet importé :

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

Vous pouvez visualiser l'identifiant `git-p4` de chaque *commit*.
Il n'y a pas de problème à garder cet identifiant ici, au cas où vous auriez besoin de référencer dans l'avenir le numéro de modification Perforce.
Cependant, si vous souhaitez supprimer l'identifiant, c'est le bon moment, avant de commencer à travailler avec le nouveau dépôt.
Vous pouvez utiliser `git filter-branch` pour faire un retrait en masse des chaînes d'identifiant :

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

Si vous lancez `git log`, vous vous rendez compte que toutes les sommes de contrôle SHA-1 des *commits* ont changé, mais aussi que plus aucune chaîne `git-p4` n'apparaît dans les messages de validation :

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

Votre import est fin prêt pour être poussé sur un nouveau serveur Git.

## Un outil d'import personnalisé

Si votre système n'est ni Subversion, ni Perforce, vous devriez rechercher sur Internet un outil d'import spécifique — il en existe de bonne qualité pour CVS, Clear Case, Visual Source Safe ou même pour un répertoire d'archives.
Si aucun de ses outils ne fonctionne pour votre cas, que vous ayez un outil plus rare ou que vous ayez besoin d'un mode d'import personnalisé, `git fast-import` peut être la solution.
Cette commande lit de simples instructions sur `stdin` pour écrire les données spécifiques Git.
C'est tout de même plus simple pour créer les objets Git que de devoir utiliser les commandes Git brutes ou d'essayer d'écrire directement les objets (voir chapitre 9 pour plus d'information).
De cette façon, vous écrivez un script d'import qui lit les informations nécessaires depuis le système d'origine et affiche des instructions directes sur `stdout`.
Vous pouvez alors simplement lancer ce programme et rediriger sa sortie dans `git fast-import`.

Pour démontrer rapidement cette fonctionnalité, nous allons écrire un script simple d'import.
Supposons que vous travailliez dans `en_cours` et que vous fassiez des sauvegardes de temps en temps dans des répertoires nommés avec la date `back_AAAA_MM_JJ` et que vous souhaitiez importer ceci dans Git.
Votre structure de répertoire ressemble à ceci :

	$ ls /opt/import_depuis
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	en_cours

Pour importer un répertoire dans Git, vous devez savoir comment Git stocke ses données.
Comme vous pouvez vous en souvenir, Git est à la base une liste chaînée d'objets de *commits* qui pointent sur un instantané de contenu.
Tout ce qu'il y a à faire donc, et d'indiquer à `fast-import` ce que sont les instantanés de contenu, quelles données de *commit* pointent dessus et l'ordre dans lequel ils s'enchaînent.
La stratégie consistera à parcourir les instantanés un par un et à créer des *commits* avec le contenu de chaque répertoire, en le reliant à son prédécesseur.

Comme déjà fait dans la section « Un exemple de règle appliquée par Git » du chapitre 7, nous l'écrirons en Ruby parce que c'est le langage avec lequel je travaille en général et qu'il est assez facile à lire.
Vous pouvez facilement retranscrire cet exemple dans votre langage de prédilection, la seule contrainte étant qu'il doit pouvoir afficher les informations appropriées sur `stdout`.
Si vous travaillez sous Windows, cela signifie que vous devrez faire particulièrement attention à ne pas introduire de retour chariot à la fin de vos lignes.
`git fast-import` n'accepte particulièrement que les sauts de ligne (line feed LF) et pas les retour chariot saut de ligne (CRLF) utilisés par Windows.

Pour commencer, déplaçons-nous dans le répertoire cible et identifions chaque sous-répertoire, chacun représentant un instantané que vous souhaitez importer en tant que *commit*.
Nous visiterons chaque sous-répertoire et afficherons les commandes nécessaires à son export.
La boucle principale ressemble à ceci :

	last_mark = nil

	# loop through the directories
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # move into the target directory
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

Dans chaque répertoire, nous lançons `print_export` qui prend le manifeste et la marque de l'instantané précédent et retourne le manifeste et la marque de l'actuel ; de cette manière, vous pouvez les chaîner correctement.
« Marque » est le terme de `fast-import` pour nommer un identifiant que vous donnez à un *commit*.
Au fur et à mesure de la création des *commits*, vous leur attribuez une marque individuelle qui pourra être utilisée pour y faire référence depuis d'autres *commits*.
La première chose à faire dans `print_export` est donc de générer une marque à partir du nom du répertoire :

	mark = convert_dir_to_mark(dir)

Cela sera réalisé en créant un tableau des répertoires et en utilisant l'indice comme marque, celle-ci devant être un nombre entier.
Votre méthode ressemble à ceci :

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

Après une représentation entière de votre *commit*, vous avez besoin d'une date pour les méta-données du *commit*.
La date est présente dans le nom du répertoire, alors analysons-le.
La ligne suivante du fichier `print_export` est donc :

	date = convert_dir_to_date(dir)

où `convert_dir_to_date` est défini comme :

	def convert_dir_to_date(dir)
	  if dir == 'en_cours'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

Elle retourne une nombre entier pour la date de chaque répertoire.
La dernière partie des méta-informations nécessaires à chaque *commit* est l'information du validateur qui sera stockée en dur dans une variable globale :

	$author = 'Scott Chacon <schacon@example.com>'

Nous voilà prêt à commencer à écrire les informations de *commit* du script d'import.
La première information indique qu'on définit un objet *commit* et la branche sur laquelle il se trouve, suivi de la marque qui a été générée, l'information du validateur et le message de validation et enfin le *commit* précédent, s'il existe.
Le code ressemble à ceci :

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

Nous codons en dur le fuseau horaire (-0700) car c'est simple.
Si vous importez depuis un autre système, vous devez spécifier le fuseau horaire comme un décalage.
Le message de validation doit être exprimé dans un format spécial :

	data (taille)\n(contenu)

Le format est composé du mot « data », la taille des données à lire, un caractère saut de ligne, et finalement les données.
Ce format est réutilisé plus tard, alors autant créer une méthode auxiliaire, `export_data` :

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

Il reste seulement à spécifier le contenu en fichiers de chaque instantané.
C'est facile, car vous les avez dans le répertoire.
Git va alors enregistrer de manière appropriée chaque instantané :

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

Note:   Comme de nombreux systèmes conçoivent leurs révisions comme des modifications d'un *commit* à l'autre, fast-import accepte aussi avec chaque *commit* des commandes qui spécifient quels fichiers ont été ajoutés, effacés ou modifiés et ce que sont les nouveaux contenus.
Vous pourriez calculer les différences entre chaque instantané et ne fournir que ces données, mais cela est plus complexe — vous pourriez tout aussi bien fournir à Git toutes les données et lui laisser faire le travail.
Si c'est ce qui convient mieux à vos données, référez-vous à la page de manuel de `fast-import` pour savoir comment fournir les données de cette façon.

Le format pour lister le contenu d'un nouveau fichier ou spécifier le nouveau contenu d'un fichier modifié est comme suit :

	M 644 inline chemin/du/fichier
	data (taille)
	(contenu du fichier)

Ici, 644 est le mode (si vous avez des fichiers exécutables, vous devez le détecter et spécifier plutôt 755), « inline » signifie que le contenu du fichier sera listé immédiatement après cette ligne.
La méthode `inline_data` ressemble à ceci :

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

Nous réutilisons la méthode `export_data` définie plus tôt, car c'est la même méthode que pour spécifier les données du message de validation.

La dernière chose à faire consiste à retourner la marque actuelle pour pouvoir la passer à la prochaine itération :

	return mark

NOTE : si vous utilisez Windows, vous devrez vous assurer d'ajouter une étape supplémentaire.
Comme mentionné auparavant, Windows utilise CRLF comme caractère de retour à la ligne tandis que `git fast-import` s'attend à LF.
Pour contourner ce problème et satisfaire `git fast-import`, il faut forcer Ruby à utiliser LF au lieu de CRLF :

	$stdout.binmode

Et voilà.
Si vous lancez ce script, vous obtiendrez un contenu qui ressemble à ceci :

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

Pour lancer l'outil d'import, redirigez cette sortie dans `git fast-import` alors que vous vous trouvez dans le projet Git dans lequel vous souhaitez importer.
Vous pouvez créer un nouveau répertoire, puis l'initialiser avec `git init`, puis lancer votre script :

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

Comme vous pouvez le remarquer, lorsqu'il se termine avec succès, il affiche quelques statistiques sur ses réalisations.
Dans ce cas, 18 objets ont été importés en 5 validations dans 1 branche.
À présent, `git log` permet de visualiser le nouvel historique :

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from en_cours

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

Et voilà !
Un joli dépôt Git tout propre.
Il est important de noter que rien n'a été extrait.
Présentement, aucun fichier n'est présent dans votre copie de travail.
Pour les avoir, vous devez réinitialiser votre branche sur `master` :

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from en_cours
	$ ls
	file.rb  lib

Vous pouvez faire bien plus avec l'outil `fast-import` — gérer différents modes, les données binaires, les branches multiples et la fusion, les étiquettes, les indicateurs de progrès, et plus encore.
Des exemples de scénarios plus complexes sont disponibles dans le répertoire `contrib/fast-import` du code source Git ; un des meilleurs est justement le script `git-p4` traité précédemment.
