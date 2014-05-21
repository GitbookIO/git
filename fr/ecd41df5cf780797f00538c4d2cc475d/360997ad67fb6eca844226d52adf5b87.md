# Attributs Git

Certains de ces réglages peuvent aussi s'appliquer sur un chemin, de telle sorte que Git ne les applique que sur un sous-répertoire ou un sous-ensemble de fichiers.
Ces réglages par chemin sont appelés attributs Git et sont définis soit dans un fichier `.gitattributes` dans un répertoire (normalement la racine du projet), soit dans un fichier `.git/info/attributes` si vous ne souhaitez pas que le fichier de description des attributs fasse partie du projet.

Les attributs permettent de spécifier des stratégies de fusion différentes pour certains fichiers ou répertoires dans votre projet, d'indiquer à Git la manière de calculer les différences pour certains fichiers non-texte, ou de faire filtrer à Git le contenu avant qu'il ne soit validé ou extrait.
Dans ce chapitre, nous traiterons certains attributs applicables aux chemins et détaillerons quelques exemples de leur utilisation en pratique.

## Fichiers binaires

Un des trucs malins permis par les attributs Git est d'indiquer à Git quels fichiers sont binaires (dans les cas où il ne pourrait pas le deviner par lui-même) et de lui donner les instructions spécifiques pour les traiter.
Par exemple, certains fichiers peuvent être générés par machine et impossible à traiter par diff, tandis que pour certains autres fichiers binaires, les différences peuvent être calculées.
Nous détaillerons comment indiquer à Git l'un et l'autre.

### Identification des fichiers binaires

Certains fichiers ressemblent à des fichiers texte mais doivent en tout état de cause être traités comme des fichiers binaires.
Par exemple, les projets Xcode sous Mac contiennent un fichier finissant en `.pbxproj`, qui est en fait un jeu de données JSON (format de données en texte JavaScript) enregistré par l'application EDI pour y sauver les réglages entre autres de compilation.
Bien que ce soit techniquement un fichier texte en ASCII, il n'y a aucun intérêt à le gérer comme tel parce que c'est en fait une mini base de données.
Il est impossible de fusionner les contenus si deux utilisateurs le modifient et les calculs de différence par défaut sont inutiles.
Ce fichier n'est destiné qu'à être manipulé par un programme.
En résumé, ce fichier doit être considéré comme un fichier binaire opaque.

Pour indiquer à Git de traiter tous les fichiers `pbxproj` comme binaires, ajoutez la ligne suivante à votre fichier `.gitattributes` :

	*.pbxproj -crlf -diff

À présent, Git n'essaiera pas de convertir ou de corriger les problèmes des CRLF, ni de calculer ou d'afficher les différences pour ces fichiers quand vous lancez `git show` ou `git diff` sur votre projet.
Dans la branche 1.6 de Git, vous pouvez aussi utiliser une macro fournie qui signifie `-crlf -diff` :

	*.pbxproj binary

### Comparaison de fichiers binaires

Dans la branche 1.6 de Git, vous pouvez utiliser la fonctionnalité des attributs Git pour effectivement comparer les fichiers binaires.
Pour ce faire, indiquez à Git comment convertir vos données binaires en format texte qui peut être comparé via un diff normal.

#### Fichiers MS Word

Comme c'est une fonctionnalité plutôt cool et peu connue, nous allons en voir quelques exemples.
Premièrement, nous utiliserons cette technique pour résoudre un des problèmes les plus ennuyeux de l'humanité : gérer en contrôle de version les documents Word.
Tout le monde convient que Word est l'éditeur de texte le plus horrible qui existe, mais bizarrement, tout le monde persiste à l'utiliser.
Si vous voulez gérer en version des documents Word, vous pouvez les coller dans un dépôt Git et les valider de temps à autre.
Mais qu'est-ce que ça vous apporte ?
Si vous lancez `git diff` normalement, vous verrez quelque chose comme :

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index 88839c4..4afcb7c 100644
	Binary files a/chapter1.doc and b/chapter1.doc differ

Vous ne pouvez pas comparer directement les versions à moins de les extraire et de les parcourir manuellement.
En fait, vous pouvez faire la même chose plutôt bien en utilisant les attributs Git.
Ajoutez la ligne suivante dans votre fichier `.gitattributes` :

	*.doc diff=word

Cette ligne indique à Git que tout fichier correspondant au patron (.doc) doit utiliser le filtre `word` pour visualiser le diff des modifications.
Qu'est-ce que le filtre « word » ?
Nous devons le définir.
Vous allez configurer Git à utiliser le programme `strings` pour convertir les documents Word en fichiers texte lisibles qu'il pourra alors comparer correctement :

	$ git config diff.word.textconv strings

Cette commande ajoute à votre fichier `.git/config` une section qui ressemble à ceci :

	[diff "word"]
	  textconv = strings

Note : il existe différents types de fichiers `.doc`.
Certains utilisent un codage UTF-16 ou d'autres pages de codes plus exotiques dans lesquels `strings` ne trouvera aucune chaîne utile.
Le résultat de ce filtre pour vos fichiers dépendra de ces conditions.

À présent, Git sait que s'il essaie de faire un diff entre deux instantanés et qu'un des fichiers finit en `.doc`, il devrait faire passer ces fichiers par le filtre `word` défini comme le programme `strings`.
Cette méthode fait effectivement des jolies versions texte de vos fichiers Word avant d'essayer de les comparer.

Voici un exemple.
J'ai mis le chapitre 1 de ce livre dans Git, ajouté du texte à un paragraphe et sauvegardé le document.
Puis, j'ai lancé `git diff` pour visualiser ce qui a changé :

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index c1c8a0a..b93c9e4 100644
	--- a/chapter1.doc
	+++ b/chapter1.doc
	@@ -8,7 +8,8 @@ re going to cover Version Control Systems (VCS) and Git basics
	 re going to cover how to get it and set it up for the first time if you don
	 t already have it on your system.
	 In Chapter Two we will go over basic Git usage - how to use Git for the 80%
	-s going on, modify stuff and contribute changes. If the book spontaneously
	+s going on, modify stuff and contribute changes. If the book spontaneously
	+Let's see if this works.

Git réussit à m'indiquer succinctement que j'ai ajouté la chaîne « *Let's see if this works* », ce qui est correct.
Ce n'est pas parfait car il y a toujours un tas de données aléatoires à la fin, mais c'est suffisant.
Si vous êtes capable d'écrire un convertisseur Word vers texte qui fonctionne suffisamment bien, cette solution peut s'avérer très efficace.
Cependant, `strings` est disponible sur la plupart des systèmes Mac et Linux et peut donc constituer un bon début pour de nombreux formats binaires.

#### Fichiers OpenDocument texte

Une approche identique à celle des fichiers MS Word (`*.doc`) peut être appliquée aux fichiers texte OpenDocument (`*.odt`) créés par OpenOffice.org ou LibreOffice.

Ajoutez la ligne suivante à la fin de votre fichier `.gitattributes` :

	*.odt diff=odt

À présent, renseignez le filtre de différence `odt` dans `.git/config` :

	[diff "odt"]
		binary = true
		textconv = /usr/local/bin/odt-to-txt

Les fichiers OpenDocument sont en fait des répertoires compressés par zip, contenant de nombreux fichiers (le contenu en format XML, les feuilles de style, les images, etc.).
Nous allons devoir écrire un script capable d'extraire le contenu et de l'afficher comme simple texte.
Créez un fichier `/usr/local/bin/odt-to-txt` (vous êtes libre de le placer dans un répertoire différent) contenant le texte suivant :

	#! /usr/bin/env perl
	# Convertisseur simpliste OpenDocument Text (.odt) vers texte
	# Author: Philipp Kempgen

	if (! defined($ARGV[0])) {
		print STDERR "Pas de fichier fourni!\n";
		print STDERR "Usage: $0 [nom du fichier]\n";
		exit 1;
	}

	my $content = '';
	open my $fh, '-|', 'unzip', '-qq', '-p', $ARGV[0], 'content.xml' or die $!;
	{
		local $/ = undef;  # slurp mode
		$content = <$fh>;
	}
	close $fh;
	$_ = $content;
	s/<text:span\b[^>]*>//g;           # éliminer spans
	s/<text:h\b[^>]*>/\n\n*****  /g;   # en-têtes
	s/<text:list-item\b[^>]*>\s*<text:p\b[^>]*>/\n    --  /g;  # items de liste
	s/<text:list\b[^>]*>/\n\n/g;       # listes
	s/<text:p\b[^>]*>/\n  /g;          # paragraphes
	s/<[^>]+>//g;                      # nettoyer les balises XML
	s/\n{2,}/\n\n/g;                   # nettoyer les lignes vides consécutives
	s/\A\n+//;                         # nettoyer les lignes vides d'en-tête
	print "\n", $_, "\n\n";

Puis rendez-le exécutable :

	chmod +x /usr/local/bin/odt-to-txt

Maintenant, `git diff` est capable de vous indiquer ce qui a changé dans les fichiers `odt`.


#### Fichiers image

Un autre problème intéressant concerne la comparaison de fichiers d'images.
Une méthode consiste à faire passer les fichiers PNG à travers un filtre qui extrait les données EXIF, les méta-données enregistrées avec la plupart des formats d'image.
Si vous téléchargez et installez le programme `exiftool`, vous pouvez l'utiliser pour convertir vos images en texte de méta-données de manière que le diff puisse au moins montrer une représentation textuelle des modifications pratiquées :

	$ echo '*.png diff=exif' >> .gitattributes
	$ git config diff.exif.textconv exiftool

Si vous remplacez une image dans votre projet et lancez `git diff`, vous verrez ceci :

	diff --git a/image.png b/image.png
	index 88839c4..4afcb7c 100644
	--- a/image.png
	+++ b/image.png
	@@ -1,12 +1,12 @@
	 ExifTool Version Number         : 7.74
	-File Size                       : 70 kB
	-File Modification Date/Time     : 2009:04:17 10:12:35-07:00
	+File Size                       : 94 kB
	+File Modification Date/Time     : 2009:04:21 07:02:43-07:00
	 File Type                       : PNG
	 MIME Type                       : image/png
	-Image Width                     : 1058
	-Image Height                    : 889
	+Image Width                     : 1056
	+Image Height                    : 827
	 Bit Depth                       : 8
	 Color Type                      : RGB with Alpha

Vous pouvez réaliser rapidement que la taille du fichier et les dimensions des images ont changé.

## Expansion des mots-clés

L'expansion de mots-clés dans le style de CVS ou de SVN est souvent une fonctionnalité demandée par les développeurs qui y sont habitués.
Le problème principal de ce système avec Git est que vous ne pouvez pas modifier un fichier avec l'information concernant le *commit* après la validation parce que Git calcule justement la somme de contrôle sur son contenu.
Cependant, vous pouvez injecter des informations textuelles dans un fichier au moment où il est extrait et les retirer avant qu'il ne soit ajouté à un *commit*.
Les attributs Git vous fournissent deux manières de le faire.

Premièrement, vous pouvez injecter automatiquement la somme de contrôle SHA-1 d'un blob dans un champ `$Id$` d'un fichier.
Si vous positionnez cet attribut pour un fichier ou un ensemble de fichiers, la prochaine fois que vous extrairez cette branche, Git remplacera chaque champ avec le SHA-1 du blob.
Il est à noter que ce n'est pas le SHA du *commit* mais celui du blob lui-même :

	$ echo '*.txt ident' >> .gitattributes
	$ echo '$Id$' > test.txt

À la prochaine extraction de ce fichier, Git injecte le SHA du blob :

	$ rm test.txt
	$ git checkout -- test.txt
	$ cat test.txt
	$Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $

Néanmoins, ce résultat n'a que peu d'intérêt.
Si vous avez utilisé la substitution avec CVS ou Subversion, il est possible d'inclure la date.
Le code SHA n'est pas des plus utiles car il ressemble à une valeur aléatoire et ne vous permet pas de distinguer si tel SHA est plus récent ou plus ancien que tel autre.

Il apparaît que vous pouvez écrire vos propres filtres pour réaliser des substitutions dans les fichiers lors des validations/extractions.
Ces filtres s'appellent « *clean* » et « *smudge* ».
Dans le fichier `.gitattributes`, vous pouvez indiquer un filtre pour des chemins particuliers puis créer des scripts qui traiteront ces fichiers avant qu'ils soient extraits (« *smudge* », voir figure 7-2) et juste avant qu'ils soient validés (« *clean* », voir figure 7-2).
Ces filtres peuvent servir à faire toutes sortes de choses attrayantes.


![](http://git-scm.com/figures/18333fig0702-tn.png)

Figure 7-2. Le filtre « *smudge* » est lancé lors d'une extraction.


![](http://git-scm.com/figures/18333fig0703-tn.png)

Figure 7-3. Le filtre « *clean* » est lancé lorsque les fichiers sont indexés.

Le message de validation d'origine pour cette fonctionnalité donne un exemple simple permettant de passer tout votre code C par le programme `indent` avant de valider.
Vous pouvez le faire en réglant l'attribut `filter` dans votre fichier `.gitattributes` pour filtrer les fichiers `*.c` avec le filtre « indent » :

	*.c     filter=indent

Ensuite, indiquez à Git ce que le filtre « indent » fait sur *smudge* et *clean* :

	$ git config --global filter.indent.clean indent
	$ git config --global filter.indent.smudge cat

Dans ce cas, quand vous validez des fichiers qui correspondent à `*.c`, Git les fera passer par le programme `indent` avant de les valider et les fera passer par le programme `cat` avant de les extraire sur votre disque.
Le programme `cat` ne  fait rien : il se contente de régurgiter les données telles qu'il les a lues.
Cette combinaison filtre effectivement tous les fichiers de code source C par `indent` avant leur validation.

Un autre exemple intéressant fournit l'expansion du mot-clé `$Date$` dans le style RCS.
Pour le réaliser correctement, vous avez besoin d'un petit script qui prend un nom de fichier, calcule la date de la dernière validation pour le projet et l'insère dans le fichier.
Voici un petit script Ruby qui le fait :

	#! /usr/bin/env ruby
	data = STDIN.read
	last_date = `git log --pretty=format:"%ad" -1`
	puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')

Tout ce que le script fait, c'est récupérer la date de la dernière validation à partir de la commande `git log`, la coller dans toutes les chaînes `$Date$` qu'il trouve et réécrire le résultat.
Ce devrait être simple dans n'importe quel langage avec lequel vous êtes à l'aise.
Appelez ce fichier `expand_date` et placez-le dans votre chemin.
À présent, il faut paramétrer un filtre dans Git (appelons le `dater`) et lui indiquer d'utiliser le filtre `expand_date` en tant que *smudge* sur les fichiers à extraire.
Nous utiliserons une expression Perl pour nettoyer lors d'une validation :

	$ git config filter.dater.smudge expand_date
	$ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'

Cette commande Perl extrait tout ce qu'elle trouve dans une chaîne `$Date$` et la réinitialise.
Le filtre prêt, on peut le tester en écrivant le mot-clé `$Date$` dans un fichier, puis en créant un attribut Git pour ce fichier qui fait référence au nouveau filtre :

	$ echo '# $Date$' > date_test.txt
	$ echo 'date*.txt filter=dater' >> .gitattributes

Si vous validez ces modifications et extrayez le fichier à nouveau, vous remarquez le mot-clé correctement substitué :

	$ git add date_test.txt .gitattributes
	$ git commit -m "Testing date expansion in Git"
	$ rm date_test.txt
	$ git checkout date_test.txt
	$ cat date_test.txt
	# $Date: Tue Apr 21 07:26:52 2009 -0700$

Vous pouvez voir à quel point cette technique peut être puissante pour des applications personnalisées.
Il faut rester néanmoins vigilant car le fichier `.gitattributes` est validé et inclus dans le projet tandis que le gestionnaire (ici, `dater`) ne l'est pas.
Du coup, ça ne marchera pas partout.
Lorsque vous créez ces filtres, ils devraient pouvoir avoir un mode dégradé qui n'empêche pas le projet de fonctionner.

## Export d'un dépôt

Les données d'attribut Git permettent aussi de faire des choses intéressantes quand vous exportez une archive du projet.

### export-ignore

Vous pouvez dire à Git de ne pas exporter certains fichiers ou répertoires lors de la génération d'archive.
S'il y a un sous-répertoire ou un fichier que vous ne souhaitez pas inclure dans le fichier archive mais que vous souhaitez extraire dans votre projet, vous pouvez indiquer ce fichier via l'attribut `export-ignore`.

Par exemple, disons que vous avez des fichiers de test dans le sous-répertoire `test/` et que ce n'est pas raisonnable de les inclure dans l'archive d'export de votre projet.
Vous pouvez ajouter la ligne suivante dans votre fichier d'attribut Git :

	test/ export-ignore

À présent, quand vous lancez `git archive` pour créer une archive `tar` de votre projet, ce répertoire ne sera plus inclus dans l'archive.

### export-subst

Une autre chose à faire pour vos archives est une simple substitution de mots-clés.
Git vous permet de placer la chaîne `$Format:$` dans n'importe quel fichier avec n'importe quel code de format du type `--pretty=format` que vous avez pu voir au chapitre 2.
Par exemple, si vous voulez inclure un fichier appelé `LAST_COMMIT` dans votre projet et y injecter automatiquement la date de dernière validation lorsque `git archive` est lancé, vous pouvez créer un fichier comme ceci :

	$ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
	$ echo "LAST_COMMIT export-subst" >> .gitattributes
	$ git add LAST_COMMIT .gitattributes
	$ git commit -am 'adding LAST_COMMIT file for archives'

Quand vous lancez `git archive`, le contenu de ce fichier inclus dans l'archive ressemblera à ceci :

	$ cat LAST_COMMIT
	Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$

## Stratégies de fusion

Vous pouvez aussi utiliser les attributs Git pour indiquer à Git d'utiliser des stratégies de fusion différenciées pour des fichiers spécifiques dans votre projet.
Une option très utile est d'indiquer à Git de ne pas essayer de fusionner des fichiers spécifiques quand ils rencontrent des conflits mais plutôt d'utiliser prioritairement votre version du fichier.

C'est très utile si une branche de votre projet a divergé ou s'est spécialisée, mais que vous souhaitez pouvoir fusionner les modifications qu'elle porte et vous voulez ignorer certains fichiers.
Supposons que vous avez un fichier de paramètres de base de données appelé `database.xml` différent sur deux branches et vous voulez les fusionner sans corrompre le fichier de base de données.
Vous pouvez déclarer un attribut comme ceci :

	database.xml merge=ours

Si vous fusionnez dans une autre branche, plutôt que de rencontrer des conflits de fusion avec le fichier database.xml, vous verrez quelque chose comme :

	$ git merge topic
	Auto-merging database.xml
	Merge made by recursive.

Dans ce cas, `database.xml` reste dans l'état d'origine, quoi qu'il arrive.
