# Fichiers groupés

Revenons à la base de donnée d'objet de notre dépôt Git de test.
Pour l'instant, elle contient 11 objets : 4 blobs, 3 arbres, 3 *commits* et 1 tag :

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # arbre 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # arbre 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # arbre 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git compresse le contenu de ces fichiers avec zlib et on ne stocke pas grand chose, au final, tous ces fichiers occupent seulement 925 octets.
Ajoutons de plus gros contenu au dépôt pour montrer une fonctionnalité intéressante de Git.
Ajoutez le fichier `repo.rb` de la bibliothèque Grit que vous avez manipulé plus tôt.
Il représente environ 12 Kio de code source :

	$ curl https://raw.github.com/mojombo/grit/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb
	$ git commit -m 'added repo.rb'
	[master 484a592] added repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

Si vous observez l'arbre qui en résulte, vous verrez l'empreinte SHA-1 du blob contenant le fichier `repo.rb` :

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Vous pouvez vérifier la taille de l'objet sur disque :

	$ du -b .git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	4102	.git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e

Maintenant, modifiez le fichier un peu et voyez ce qui arrive :

	$ echo '# testing' >> repo.rb
	$ git commit -am 'modified repo a bit'
	[master ab1afef] modified repo a bit
	 1 files changed, 1 insertions(+), 0 deletions(-)

Regardez l'arbre créé par ce *commit* et vous verrez quelque chose d'intéressant :

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Ce blob est un blob différent.
Bien que l'on ait ajouté une seule ligne à la fin d'un fichier en faisant 400, Git enregistre ce nouveau contenu dans un objet totalement différent :

	$ du -b .git/objects/05/408d195263d853f09dca71d55116663690c27c
	4109	.git/objects/05/408d195263d853f09dca71d55116663690c27c

Il y a donc deux objets de 4 Kio quasiment identiques sur le disque.
Ne serait-ce pas bien si Git pouvait n'enregistrer qu'un objet en entier, le deuxième n'étant qu'un delta (une différence) avec le premier ?

Il se trouve que c'est possible.
Le format initial dans lequel Git enregistre les objets sur le disque est appelé le format brut (*loose object*).
De temps en temps, Git compacte plusieurs de ces objets en un seul fichier binaire appelé *packfile* (fichier groupé), afin d'économiser de l'espace et d'être plus efficace.
Git effectue cette opération quand il y a trop d'objets au format brut, ou si l'on exécute manuellement la commande `git gc`, ou encore quand on pousse vers un serveur distant.
Pour voir cela en action, vous pouvez demander manuellement à Git de compacter les objets en exécutant la commande `git gc` :

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

Si l'on jette un œil dans le répertoire des objets, on constatera que la plupart des objets ne sont plus là et qu'un couple de fichiers est apparu :

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

Les objets restant sont des blobs qui ne sont pointés par aucun *commit*.
Dans notre cas, il s'agit des blobs « what is up, doc? » et « test content » créés plus tôt comme exemple.
Puisqu'ils n'ont été ajoutés à aucun *commit*, ils sont considérés en suspend et ne sont pas compactés dans le nouveau fichier groupé.

Les autres fichiers sont le nouveau fichier groupé et un index.
Le fichier groupé est un fichier unique rassemblant le contenu de tous les objets venant d'être supprimés du système de fichier.
L'index est un fichier contenant les emplacements dans le fichier groupé, pour que l'on puisse accéder rapidement à un objet particulier.
Ce qui est vraiment bien, c'est que les objets occupaient environ 12 Kio d'espace disque avant `gc` et que le nouveau fichier groupé en occupe seulement 6 Kio.
On a divisé par deux l'occupation du disque en regroupant les objets.

Comment Git réalise-t-il cela ?
Quand Git compacte des objets, il recherche les fichiers qui ont des noms et des tailles similaires, puis enregistre seulement les deltas entre une version du fichier et la suivante.
On peut regarder à l'intérieur du fichier groupé et voir l'espace économisé par Git.
La commande de plomberie `git verify-pack` vous permet de voir ce qui a été compacté :

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

Si on se souvient bien, le blob `9bc1d`, qui est la première version du fichier `repo.rb`, référence le blob `05408`, qui est la seconde version du fichier.
La troisième colonne de l'affichage est la taille de l'objet dans le fichier compact et on peut voir que `05408` occupe 12 Kio dans le fichier, mais que `9bc1d` occupe seulement 7 octets.
Ce qui est aussi intéressant est que la seconde version du fichier est celle qui est enregistrée telle quelle, tandis que la version originale est enregistrée sous forme d'un delta.
La raison en est que vous aurez sans doute besoin d'accéder rapidement aux versions les plus récentes du fichier.

Une chose intéressante à propos de ceci est que l'on peut recompacter à tout moment.
Git recompacte votre base de donnée occasionnellement, en essayant d'économiser de la place.
Vous pouvez aussi recompacter à la main, en exécutant la commande `git gc` vous-même.
