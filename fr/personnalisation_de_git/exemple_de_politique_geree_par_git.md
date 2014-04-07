# Exemple de politique gérée par Git

Dans ce chapitre, nous allons utiliser ce que nous venons d'apprendre pour installer une gestion Git qui vérifie la présence d'un format personnalisé de message de validation, n'autorise que les poussées en avance rapide et autorise seulement certains utilisateurs à modifier certains sous-répertoires dans un projet.
Nous construirons des scripts client pour informer les développeurs que leurs poussées vont être rejetées et des scripts sur le serveur pour mettre effectivement en place ces règles.

J'ai utilisé Ruby pour les écrire, d'abord parce que c'est mon langage de script favori, ensuite parce que je pense que c'est le langage de script qui s'apparente le plus à du pseudo-code.
Ainsi, il devrait être simple de suivre grossièrement le code même sans connaître le langage Ruby.
Cependant, tout langage peut être utilisé.
Tous les scripts d'exemple distribués avec Git sont soit en Perl soit en Bash, ce qui donne de nombreux autres exemples de crochets dans ces langages.

## Crochets côté serveur

Toutes les actions côté serveur seront contenues dans le fichier `update` dans le répertoire `hooks`.
Le fichier `update` s'exécute une fois par branche poussée et accepte comme paramètre la référence sur laquelle on pousse, l'ancienne révision de la branche et la nouvelle révision de la branche.
Vous pouvez aussi avoir accès à l'utilisateur qui pousse si la poussée est réalisée par SSH.
Si vous avez permis à tout le monde de se connecter avec un utilisateur unique (comme « git ») avec une authentification à clé publique, il vous faudra fournir à cet utilisateur une enveloppe de shell qui déterminera l'identité de l'utilisateur à partir de sa clé publique et positionnera une variable d'environnement spécifiant cette identité.
Ici, je considère que la variable d'environnement `$USER` indique l'utilisateur connecté, donc le script update commence par rassembler toutes les informations nécessaires :

	#!/usr/bin/env ruby

	$nomref       = ARGV[0]
	$anciennerev  = ARGV[1]
	$nouvellerev  = ARGV[2]
	$utilisateur  = ENV['USER']

	puts "Vérification des règles... \n(#{$nomref}) (#{$anciennerev[0,6]}) (#{$nouvellerev[0,6]})"

Et oui, j'utilise des variables globales.
C'est seulement pour simplifier la démonstration.

### Application d'une politique de format du message de validation

Notre première tâche consiste à forcer que chaque message de validation adhère à un format particulier.
En guise d'objectif, obligeons chaque message à contenir une chaîne de caractère qui ressemble à « ref: 1234 » parce que nous souhaitons que chaque validation soit liée à une tâche de notre système de tickets.
Nous devons donc inspecter chaque *commit* poussé, vérifier la présence de la chaîne et sortir avec un code non-nul en cas d'absence pour rejeter la poussée.

Vous pouvez obtenir une liste des valeurs SHA-1 de tous les *commits* en cours de poussée en passant les valeurs `$nouvellerev` et `$anciennerev` à une commande de plomberie Git appelée `git-rev-list`.
C'est comme la commande `git log` mais elle n'affiche par défaut que les valeurs SHA-1, sans autre information.
Donc, pour obtenir une liste de tous les SHA des *commits* introduits entre un SHA de *commit* et un autre, il suffit de lancer quelque chose comme :

	$ git rev-list 538c33..d14fc7
	d14fc7c847ab946ec39590d87783c69b031bdfb7
	9f585da4401b0a3999e84113824d15245c13f0be
	234071a1be950e2a8d078e6141f5cd20c1e61ad3
	dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
	17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

Vous pouvez récupérer la sortie, boucler sur chacun de ces SHA de *commit*, en extraire le message et tester la conformité du message avec une structure au moyen d'une expression rationnelle.

Vous devez trouver comment extraire le message de validation à partir de chacun des *commits* à tester.
Pour accéder aux données brutes du *commit*, vous pouvez utiliser une autre commande de plomberie appelée `git cat-file`.
Nous traiterons en détail toutes ces commandes de plomberie au chapitre 9 mais pour l'instant, voici ce que cette commande affiche:

	$ git cat-file commit ca82a6
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Un moyen simple d'extraire le message de validation d'un *commit* à partir de son SHA-1 consiste à rechercher la première ligne vide et à sélectionner tout ce qui suit.
Cela peut être facilement réalisé avec la commande `sed` sur les systèmes Unix :

	$ git cat-file commit ca82a6 | sed '1,/^$/d'
	changed the version number

Vous pouvez utiliser cette ligne pour récupérer le message de validation de chaque *commit* en cours de poussée et sortir si quelque chose ne correspond à ce qui est attendu.
Pour sortir du script et rejeter la poussée, il faut sortir avec un code non nul.
La fonction complète ressemble à ceci :

	$regex = /\[ref: (\d+)\]/

	# vérification du format des messages de validation
	def verif_format_message
	  revs_manquees = `git rev-list #{$anciennerev}..#{$nouvellerev}`.split("\n")
	  revs_manquees.each do |rev|
	    message = `git cat-file commit #{rev} | sed '1,/^$/d'`
	    if !$regex.match(message)
	      puts "[REGLE] Le message de validation n'est pas conforme"
	      exit 1
	    end
	  end
	end
	verif_format_message

Placer ceci dans un script `update` rejettera les mises à jour contenant des *commits* dont les messages ne suivent pas la règle.

### Mise en place d'un système d'ACL par utilisateur

Supposons que vous souhaitiez ajouter un mécanisme à base de liste de contrôle d'accès (access control list : ACL) qui permette de spécifier quel utilisateur a le droit de pousser des modifications vers quelle partie du projet.
Certaines personnes ont un accès complet tandis que d'autres n'ont accès que pour mettre à jour certains sous-répertoires ou certains fichiers.
Pour faire appliquer ceci, nous allons écrire ces règles dans un fichier appelé `acl` situé dans le dépôt brut Git sur le serveur.
Le crochet `update` examinera ces règles, listera les fichiers impactés par la poussée et déterminera si l'utilisateur qui pousse a effectivement les droits nécessaires sur ces fichiers.

Écrivons en premier le fichier d'ACL.
Nous allons utiliser un format très proche de celui des ACL de CVS.
Le fichier est composé de lignes dont le premier champ est `avail` ou `unavail`, le second est une liste des utilisateurs concernés séparés par des virgules et le dernier champ indique le chemin pour lequel la règle s'applique (le champ vide indiquant une règle générale).
Tous les champs sont délimités par un caractère pipe « | ».

Dans notre cas, il y a quelques administrateurs, des auteurs de documentation avec un accès au répertoire `doc` et un développeur qui n'a accès qu'aux répertoires `lib` et `tests`.
Le fichier ACL ressemble donc à ceci :

	avail|nickh,pjhyett,defunkt,tpw
	avail|usinclair,cdickens,ebronte|doc
	avail|schacon|lib
	avail|schacon|tests

Le traitement consiste à lire le fichier dans une structure utilisable.
Dans notre cas, pour simplifier, nous ne traiterons que les directives `avail`.
Voici une fonction qui crée à partir du fichier un tableau associatif dont la clé est l'utilisateur et la valeur est une liste des chemins pour lesquels l'utilisateur a les droits en écriture :

	def get_acl_access_data(nom_fichier_acl)
	  # lire le fichier ACL
	  fichier_acl = File.read(nom_fichier_acl).split("\n").reject { |ligne| ligne == '' }
	  acces = {}
	  fichier_acl.each do |ligne|
	    avail, utilisateurs, chemin = ligne.split('|')
	    next unless avail == 'avail'
	    utilisateurs.split(',').each do |utilisateur|
	      acces[utilisateur] ||= []
	      acces[utilisateur] << chemin
	    end
	  end
	  acces
	end

Pour le fichier d'ACL décrit plus haut, le fonction `get_acl_access_data` retourne une structure de données qui ressemble à ceci :

	{"defunkt"=>[nil],
	 "tpw"=>[nil],
	 "nickh"=>[nil],
	 "pjhyett"=>[nil],
	 "schacon"=>["lib", "tests"],
	 "cdickens"=>["doc"],
	 "usinclair"=>["doc"],
	 "ebronte"=>["doc"]}

En plus des permissions, il faut déterminer les chemins impactés par la poussée pour s'assurer que l'utilisateur a bien droit d'y toucher.

La liste des fichiers modifiés est assez simplement obtenue par la commande `git log` complétée par l'option `--name-only` mentionnée au chapitre 2.

	$ git log -1 --name-only --pretty=format:'' 9f585d

	README
	lib/test.rb

Chaque fichier des *commits* doit être vérifié par rapport à la structure ACL retournée par la fonction `get_acl_access_data` pour déterminer si l'utilisateur a le droit de pousser tous ses *commits* :

	# permission à certains utilisateurs de modifier certains sous-répertoires du projet
	def verif_perms_repertoire
	  acces = get_acl_access_data('acl')

	  # verifier si quelqu'un chercher à pousser où il n'a pas le droit
	  nouveaux_commits = `git rev-list #{$anciennerev}..#{$nouvellerev}`.split("\n")
	  nouveaux_commits.each do |rev|
	    fichiers_modifies = `git log -1 --name-only --pretty=format:'' #{rev}`.split("\n")
	    fichiers_modifies.each do |chemin|
	      next if chemin.size == 0
	      acces_permis = false
	      acces[$utilisateur].each do |chemin_acces|
	        if !chemin_acces || # l'utilisateur a un accès complet
	          (chemin.index(chemin_acces) == 0) # acces à ce chemin
	          acces_permis = true
	        end
	      end
	      if !acces_permis
	        puts "[ACL] Vous n'avez pas le droit de pousser sur #{path}"
	        exit 1
	      end
	    end
	  end
	end

	verif_perms_repertoire

L'algorithme ci-dessus reste simple.
Pour chaque élément de la liste des nouveaux *commits* à pousser obtenue au moyen de `git rev-list`, on vérifie que l'utilisateur qui pousse a accès au chemin de chacun des fichiers modifiés.
L'expression `chemin.index(chemin_acces) == 0` est un Rubyisme qui n'est vrai que si `chemin` commence comme `chemin_acces`.
Ce script s'assure non pas qu'un `chemin` fait partie des chemins permis, mais que tous les chemins accédés font bien partie des chemins permis.

À présent, les utilisateurs ne peuvent plus pousser de *commits* comprenant un message incorrectement formaté ou des modifications à des fichiers hors de leur zone réservée.

### Application des poussées en avance rapide

Il ne reste plus qu'à forcer les poussées en avance rapide uniquement.
À partir de la version 1.6, les paramètres `receive.denyDeletes` et `receive.denyNonFastForwards` règlent le problème.
Cependant, l'utilisation d'un crochet permet de fonctionner avec des versions antérieures de Git et même après modification, des permissions par utilisateur ou toute autre évolution.

L'algorithme consiste à vérifier s'il y a des *commits* accessibles depuis l'ancienne révision qui ne sont pas accessibles depuis la nouvelle.
S'il n'y en a aucun alors la poussée est effectivement en avance rapide.
Sinon, il faut le rejeter :

	# Forcer les poussées qu'en avance rapide
	def verif_avance_rapide
	  refs_manquees = `git rev-list #{$nouvellerev}..#{$anciennerev}`
	  nb_refs_manquees = refs_manquees.split("\n").size
	  if nb_refs_manquees > 0
	    puts "[REGLE] Poussée en avance rapide uniquement"
	    exit 1
	  end
	end

	verif_avance_rapide

Tout est en place.
En lançant `chmod u+x .git/hooks/update`, `update` étant le fichier dans lequel tout le code précédent réside, puis en essayant de pousser une référence qui n'est pas en avance rapide, on obtient ceci :

	$ git push -f origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 323 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	Unpacking objects: 100% (3/3), done.
	Vérification des règles...
	(refs/heads/master) (8338c5) (c5b616)
	[REGLE] Poussée en avance rapide uniquement
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master
	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Il y a plusieurs points à relever ici.
Premièrement, une ligne indique l'endroit où le crochet est appelé.

	Vérification des règles...
	(refs/heads/master) (8338c5) (c5b616)

Le script `update` affiche ces lignes sur stdout au tout début.
Tout ce que le script écrit sur stdout sera transmis au client.

La ligne suivante à remarquer est le message d'erreur.

	[REGLE] Poussée en avance rapide uniquement
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master

Le première ligne a été écrite par le script, les deux autres l'ont été par Git pour indiquer que le script `update` a rendu un code de sortie non nul, ce qui a causé l'échec de la poussée.
Enfin, il y a ces lignes :

	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Il y a un message d'échec distant pour chaque référence que le crochet a rejetée et une indication que l'échec est dû spécifiquement à un échec du crochet.

Par ailleurs, si le marqueur `ref` n'est pas présent dans le message de validation, le message d'erreur spécifique est affiché :

	[REGLE] Le message de validation n'est pas conforme

Ou si quelqu'un cherche à modifier un fichier auquel il n'a pas les droits d'accès lors d'une poussée, il verra quelque chose de similaire.
Par exemple, si un auteur de documentation essaie de pousser un *commit* qui modifie quelque chose dans le répertoire `lib`, il verra :

	[ACL] Vous n'avez pas le droit de pousser sur lib/test.rb

C'est tout.
À partir de maintenant, tant que le script `update` est en place et exécutable, votre dépôt ne peut plus subir de poussées hors avancée rapide, n'accepte plus de messages sans format et vos utilisateurs sont bridés.

## Crochets côté client

Le problème de cette approche, ce sont les plaintes des utilisateurs qui résulteront inévitablement des échecs de leurs poussées.
Leur frustration et leur confusion devant le rejet à la dernière minute d'un travail minutieux est tout à fait compréhensible.
De plus, la correction nécessitera  une modification de leur historique, ce qui n'est pas une partie de plaisir.

Pour éviter ce scénario, il faut pouvoir fournir aux utilisateurs des crochets côté client qui leur permettront de vérifier que leurs validations seront effectivement acceptées par le serveur.
Ainsi, ils pourront corriger les problèmes avant de valider et avant que ces difficultés ne deviennent des casse-têtes.
Ces scripts n'étant pas diffusés lors du clonage du projet, il vous faudra les distribuer d'une autre manière, puis indiquer aux utilisateurs de les copier dans leur répertoire `.git/hooks` et de les rendre exécutables.
Vous pouvez distribuer ces crochets au sein du projet ou dans un projet annexe mais il n'y a aucun moyen de les mettre en place automatiquement.

Premièrement, pour éviter le rejet du serveur au motif d'un mauvais format du message de validation, il faut vérifier celui-ci avant que chaque *commit* ne soit enregistré.
Pour ce faire, utilisons le crochet `commit-msg`.
En lisant le message à partir du fichier passé en premier argument et en le comparant au format attendu, on peut forcer Git à abandonner la validation en cas d'absence de correspondance :

	#!/usr/bin/env ruby
	fichier_message = ARGV[0]
	message = File.read(fichier_message)

	$regex = /\[ref: (\d+)\]/

	if !$regex.match(message)
	  puts "[REGLE] Le message de validation ne suit pas le format"
	  exit 1
	end

Avec ce fichier exécutable et à sa place dans `.git/hooks/commit-msg`, si une validation avec un message incorrect est tentée, voici le résultat :

	$ git commit -am 'test'
	[REGLE] Le message de validation ne suit pas le format

La validation n'a pas abouti.
Néanmoins, si le message contient la bonne forme, Git accepte la validation :

	$ git commit -am 'test [ref: 132]'
	[master e05c914] test [ref: 132]
	 1 files changed, 1 insertions(+), 0 deletions(-)

Ensuite, il faut s'assurer des droits sur les fichiers modifiés.
Si le répertoire `.git` du projet contient une copie du fichier d'ACL précédemment utilisé, alors le script `pre-commit` suivant appliquera ses règles :

	#!/usr/bin/env ruby

	$utilisateur    = ENV['USER']

	# [ insérer la fonction acl_access_data method ci-dessus ]

	# Ne permet qu'à certains utilisateurs de modifier certains sous-répertoires
	def verif_perms_repertoire
	  acces = get_acl_access_data('.git/acl')

	  fichiers_modifies = `git diff-index --cached --name-only HEAD`.split("\n")
	  fichiers_modifies.each do |chemin|
	    next if chemin.size == 0
	    acces_permis = false
	    acces[$utilisateur].each do |chemin_acces|
	    if !chemin_acces || (chemin.index(chemin_acces) == 0)
	      acces_permis = true
	    end
	    if !acces_permis
	      puts "[ACL] Vous n'avez pas le droit de pousser sur #{path}"
	      exit 1
	    end
	  end
	end

	verif_perms_repertoire

C'est grossièrement le même script que celui côté serveur, mais avec deux différences majeures.
Premièrement, le fichier ACL est à un endroit différent parce que le script s'exécute depuis le copie de travail et non depuis le répertoire Git.
Il faut donc changer le chemin vers le fichier d'ACL de :

	acces = get_acl_access_data('acl')

en :

	acces = get_acl_access_data('.git/acl')

L'autre différence majeure réside dans la manière d'obtenir la liste des fichiers modifiés.
La fonction sur le serveur la recherche dans le journal des *commits* mais comme dans le cas actuel, le *commit* n'a pas encore été enregistré, il faut chercher la liste dans la zone d'index.
Donc au lieu de :

	fichiers_modifies = `git log -1 --name-only --pretty=format:'' #{ref}`

on utilise :

	fichiers_modifies = `git diff-index --cached --name-only HEAD`

Mais à ces deux différences près, le script fonctionne de manière identique.
Ce script a aussi une autre limitation : il s'attend à ce que l'utilisateur qui le lance localement soit identique à celui sur le serveur distant.
S'ils sont différents, il faudra positionner manuellement la variable `$utilisateur`.

La dernière action à réaliser consiste à vérifier que les références poussées sont bien en avance rapide, mais l'inverse est plutôt rare.
Pour obtenir une référence qui n'est pas en avance rapide, il faut soit rebaser après un *commit* qui a déjà été poussé, soit essayer de pousser une branche locale différente vers la même branche distante.

Comme le serveur indiquera qu'on ne peut pas pousser sans avance rapide de toute façon et que le crochet empêche les poussées forcées, la seule action accidentelle qu'il faut intercepter reste le rebasage de *commits* qui ont déjà été poussés.

Voici un exemple de script `pre-rebase` qui fait cette vérification.
Ce script récupère une liste de tous les *commits* qu'on est sur le point de réécrire et vérifie s'ils existent dans une référence distante.
S'il en trouve un accessible depuis une des références distantes, il interrompt le rebasage :

	#!/usr/bin/env ruby

	branche_base = ARGV[0]
	if ARGV[1]
	  branche_thematique = ARGV[1]
	else
	  branche_thematique = "HEAD"
	end

	sha_cibles = `git rev-list #{branche_base}..#{branche_thematique}`.split("\n")
	refs_distantes = `git branch -r`.split("\n").map { |r| r.strip }

	shas_cibles.each do |sha|
	  refs_distantes.each do |ref_distante|
	    shas_pousses = `git rev-list ^#{sha}^@ refs/remotes/#{ref_distante}`
	    if shas_pousses.split(“\n”).include?(sha)
	      puts "[REGLE] Le commit #{sha} a déjà été poussé sur #{ref_distante}"
	      exit 1
	    end
	  end
	end

Ce script utilise une syntaxe qui n'a pas été abordée à la section « sélection de révision » du chapitre 6.
La liste des *commits* déjà poussés est obtenue avec cette commande :

	git rev-list ^#{sha}^@ refs/remotes/#{ref_distante}

La syntaxe `SHA^@` fait référence à tous le parents du *commit*.
Les *commits* recherchés sont accessibles depuis le dernier *commit* distant et inaccessibles depuis n'importe quel parent de n'importe quel SHA qu'on cherche à pousser.
C'est la définition d'avance rapide.

La limitation de cette approche reste qu'elle peut s'avérer très lente et non nécessaire.
Si vous n'essayez pas de forcer à pousser avec l'option `-f`, le serveur vous avertira et n'acceptera pas la poussée.
Cependant, cela reste un exercice intéressant qui peut aider théoriquement à éviter un rebasage qui devra être annulé plus tard.
