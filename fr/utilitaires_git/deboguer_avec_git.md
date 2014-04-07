# Deboguer avec Git

Git fournit aussi quelques outils pour vous aider à déboguer votre projet.
Puisque Git est conçu pour fonctionner avec pratiquement tout type de projet, ces outils sont plutôt génériques, mais ils peuvent souvent vous aider à traquer un bogue ou au moins cerner où cela tourne mal.

## Fichier annoté

Si vous traquez un bogue dans votre code et que vous voulez savoir quand il est apparu et pourquoi, annoter les fichiers est souvent le meilleur moyen.
Cela vous montre le dernier *commit* qui a modifié chaque ligne de votre fichier.
Donc, si vous voyez une méthode dans votre code qui est boguée, vous pouvez visualiser le fichier annoté avec `git blame` pour voir quand chaque ligne de la méthode a été modifiée pour la dernière fois et par qui.
Cet exemple utilise l'option `-L` pour limiter la sortie des lignes 12 à 22 :

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

Remarquez que le premier champ est le SHA-1 partiel du dernier *commit* à avoir modifié la ligne.
Les deux champs suivants sont des valeurs extraites du *commit* : l'auteur et la date du *commit*, vous pouvez donc facilement voir qui a modifié la ligne et quand.
Ensuite arrive le numéro de ligne et son contenu.
Remarquez également les lignes dont le *commit* est `^4832fe2`, elles désignent les lignes qui étaient dans la version du fichier lors du premier *commit* de ce fichier.
Ce *commit* contient le premier ajout de ce fichier, et ces lignes n'ont pas été modifiées depuis.
Tout ça est un peu confus, parce que vous connaissez maintenant au moins trois façons différentes que Git interprète `^` pour modifier l'empreinte SHA, mais au moins, vous savez ce qu'il signifie ici.

Une autre chose sympa sur Git, c'est qu'il ne suit pas explicitement les renommages de fichier.
Il enregistre les contenus puis essaye de deviner ce qui a été renommé implicitement, après coup.
Ce qui nous permet d'utiliser cette fonctionnalité intéressante pour suivre toutes sortes de mouvements de code.
Si vous passez `-C` à `git blame`, Git analyse le fichier que vous voulez annoter et essaye de deviner d'où les bouts de code proviennent par copie ou déplacement.
Récemment, j'ai remanié un fichier nommé `GITServerHandler.m` en le divisant en plusieurs fichiers, dont le fichier `GITPackUpload.m`.
En annotant `GITPackUpload.m` avec l'option `-C`, je peux voir quelles sections de code en sont originaires :

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

C'est vraiment utile, non ?
Normalement, vous obtenez comme *commit* originel celui dont votre code a été copié, puisque ce fut la première fois que vous avez touché à ces lignes dans ce fichier.
Git vous montre le *commit* d'origine, celui où vous avez écrit ces lignes, même si c'était dans un autre fichier.

## La recherche dichotomique

Annoter un fichier peut aider si vous savez déjà où le problème se situe.
Si vous ne savez pas ce qui a cassé le code, il peut y avoir des douzaines, voire des centaines de *commits* depuis le dernier état où votre code fonctionnait et vous aimeriez certainement exécuter `git bisect` pour vous aider.
La commande `bisect` effectue une recherche par dichotomie dans votre historique pour vous aider à identifier aussi vite que possible quel *commit* a vu le bogue naître.

Disons que vous venez juste de pousser une version finale de votre code en production, vous récupérez un rapport de bogue à propos de quelque chose qui n'arrivait pas dans votre environnement de développement, et vous n'arrivez pas à trouver pourquoi votre code le fait.
Vous retournez sur votre code et il apparait que vous pouvez reproduire le bogue mais vous ne savez pas ce qui se passe mal.
Vous pouvez faire une recherche par dichotomie pour trouver ce qui ne va pas.
D'abord, exécutez `git bisect start` pour démarrer la procédure, puis utilisez la commande `git bisect bad` pour dire que le *commit* courant est bogué.
Ensuite, dites à `bisect` quand le code fonctionnait, en utilisant `git bisect good [bonne_version]` :

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git trouve qu'il y a environ 12 *commits* entre celui que vous avez marqué comme le dernier bon connu (v1.0) et la version courante qui n'est pas bonne, et il a récupéré le *commit* du milieu à votre place.
À ce moment, vous pouvez dérouler vos tests pour voir si le bogue existait dans ce *commit*.
Si c'est le cas, il a été introduit quelque part avant ce *commit* médian, sinon, il l'a été évidemment après.
Il apparait que le bogue ne se reproduit pas ici, vous le dites à Git en tapant `git bisect good` et continuez votre périple :

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

Vous êtes maintenant sur un autre *commit*, à mi-chemin entre celui que vous venez de tester et votre *commit* bogué.
Vous exécutez une nouvelle fois votre test et trouvez que ce *commit* est bogué, vous le dites à Git avec `git bisect bad` :

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

Ce *commit*-ci est bon, et Git a maintenant toutes les informations dont il a besoin pour déterminer où le bogue a été créé.
Il vous affiche le SHA-1 du premier *commit* bogué, quelques informations du *commit* et quels fichiers ont été modifiés dans celui-ci, vous pouvez donc trouver ce qui s'est passé pour créer ce bogue :

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

Lorsque vous avez fini, vous devez exécuter `git bisect reset` pour réinitialiser votre HEAD où vous étiez avant de commencer, ou vous travaillerez dans un répertoire de travail non clairement défini :

	$ git bisect reset

C'est un outil puissant qui vous aidera à vérifier des centaines de *commits* en quelques minutes.
En réalité, si vous avez un script qui sort avec une valeur 0 s'il est bon et autre chose sinon, vous pouvez même automatiser `git bisect`.
Premièrement vous lui spécifiez l'intervalle en lui fournissant les bon et mauvais *commits* connus.
Vous pouvez faire cela en une ligne en les entrant à la suite de la commande `bisect start`, le mauvais *commit* d'abord :

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

Cela exécute automatiquement `test-error.sh` sur chaque *commit* jusqu'à ce que Git trouve le premier *commit* bogué.
Vous pouvez également exécuter des commandes comme `make` ou `make tests` ou quoi que ce soit qui exécute des tests automatisés à votre place.
