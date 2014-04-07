# Maintenance et récupération de données

Parfois, vous aurez besoin de faire un peu de ménage : faire un dépôt plus compact, nettoyer les dépôts importés, ou récupérer du travail perdu.
Cette section couvrira certains de ces scénarios.


## Maintenance

De temps en temps, Git exécute automatiquement une commande appelée « auto gc ».
La plupart du temps, cette commande ne fait rien.
Cependant, s'il y a trop d'objets bruts (des objets qui ne sont pas dans des fichiers groupés), ou trop de fichiers groupés, Git lance une commande `git gc` à part entière.
`gc` est l'abréviation pour « garbage collect » (ramasse-miettes) et la commande fait plusieurs choses : elle rassemble plusieurs objets bruts et les place dans des fichiers groupés, elle rassemble des fichiers groupés en un gros fichier groupé et elle supprime des objets qui ne sont plus accessibles depuis un *commit* et qui sont vieux de plusieurs mois.

Vous pouvez exécuter `auto gc` manuellement :

	$ git gc --auto

Encore une fois, cela ne fait généralement rien.
Vous devez avoir environ 7 000 objets bruts ou plus de 50 fichiers groupés pour que Git appelle une vraie commande `gc`.
Vous pouvez modifier ces limites avec les propriétés de configuration `gc.auto` et `gc.autopacklimit`, respectivement.

`gc` regroupera aussi vos références dans un seul fichier.
Supposons que votre dépôt contienne les branches et étiquettes suivantes :

	$ find .git/refs -type f
	.git/refs/heads/experiment
	.git/refs/heads/master
	.git/refs/tags/v1.0
	.git/refs/tags/v1.1

Si vous exécutez `git gc`, vous n'aurez plus ces fichiers dans votre répertoire `refs`.
Git les déplacera pour plus d'efficacité dans un fichier nommé `.git/packed-refs` qui ressemble à ceci :

	$ cat .git/packed-refs
	# pack-refs with: peeled
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
	ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
	9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
	^1a410efbd13591db07496601ebc7a059dd55cfe9

Si vous mettez à jour une référence, Git ne modifiera pas ce fichier, mais enregistrera plutôt un nouveau fichier dans `refs/heads`.
Pour obtenir l'empreinte SHA approprié pour une référence donnée, Git cherche d'abord cette référence dans le répertoire `refs`, puis dans le fichier `packed-refs` si non trouvée.
Cependant, si vous ne pouvez pas trouver une référence dans votre répertoire `refs`, elle est probablement dans votre fichier `packed-refs`.

Remarquez la dernière ligne du fichier, celle commençant par `^`.
Cela signifie que l'étiquette directement au-dessus est une étiquette annotée et que cette ligne est le *commit* que l'étiquette annotée référence.

## Récupération de données

À un moment quelconque de votre vie avec Git, vous pouvez accidentellement perdre un *commit*.
Généralement, cela arrive parce que vous avez forcé la suppression d'une branche contenant du travail et il se trouve que vous vouliez cette branche finalement ; ou vous avez réinitialisé une branche avec suppression, en abandonnant des *commits* dont vous vouliez des informations.
Supposons que cela arrive, comment pouvez-vous récupérer vos *commits* ?

Voici un exemple qui réinitialise la branche `master` avec suppression dans votre dépôt de test vers un ancien *commit* et qui récupère les *commits* perdus.
Premièrement, vérifions dans quel état est votre dépôt en ce moment :

	$ git log --pretty=oneline
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Maintenant, déplaçons la branche `master` vers le *commit* du milieu :

	$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
	HEAD is now at 1a410ef third commit
	$ git log --pretty=oneline
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Vous avez effectivement perdu les deux *commits* du haut, vous n'avez pas de branche depuis laquelle ces *commits* seraient accessibles.
Vous avez besoin de trouver le SHA du dernier *commit* et d'ajouter une branche s'y référant.
Le problème est de trouver ce SHA, ce n'est pas comme si vous l'aviez mémorisé, hein ?

Souvent, la manière la plus rapide est d'utiliser l'outil `git reflog`.
Pendant que vous travaillez, Git enregistre l'emplacement de votre HEAD chaque fois que vous le changez.
À chaque *commit* ou commutation de branche, le journal des références (*reflog*) est mis à jour.
Le journal des références est aussi mis à jour par la commande `git update-ref`, qui est une autre raison de l'utiliser plutôt que de simplement écrire votre valeur SHA dans vos fichiers de références, comme mentionné dans la section « Références Git » plus haut dans ce chapitre.
Vous pouvez voir où vous étiez à n'importe quel moment en exécutant `git reflog` :

	$ git reflog
	1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
	ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Ici, nous pouvons voir deux *commits* que nous avons récupérés, cependant, il n'y a pas plus d'information ici.
Pour voir, les mêmes informations d'une manière plus utile, nous pouvons exécuter `git log -g`, qui nous donnera une sortie normalisée pour votre journal de références :

	$ git log -g
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:22:37 2009 -0700

	    third commit

	commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	     modified repo a bit


On dirait que le *commit* du bas est celui que vous avez perdu, vous pouvez donc le récupérer en créant une nouvelle branche sur ce *commit*.
Par exemple, vous créez une branche nommée `recover-branch` au *commit* (ab1afef):

	$ git branch recover-branch ab1afef
	$ git log --pretty=oneline recover-branch
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Super, maintenant vous avez une nouvelle branche appelée `recover-branch` à l'emplacement où votre branche `master` se trouvait, faisant en sorte que les deux premiers *commits* soit à nouveau accessibles.

Pour poursuivre, nous supposerons que vos pertes ne sont pas dans le journal des références pour une raison quelconque.
On peut simuler cela en supprimant `recover-branch` et le journal des références.
Maintenant, les deux premiers *commits* ne sont plus accessibles (encore) :

	$ git branch –D recover-branch
	$ rm -Rf .git/logs/


Puisque les données du journal de référence sont sauvegardées dans le répertoire `.git/logs/`, vous n'avez effectivement plus de journal de références.
Comment pouvez-vous récupérer ces *commits* maintenant ?
Une manière de faire est d'utiliser l'outil `git fsck`, qui vérifie l'intégrité de votre base de données.
Si vous l'exécutez avec l'option `--full`, il vous montre tous les objets qui ne sont pas référencés par d'autres objets :

	$ git fsck --full
	dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
	dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
	dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

Dans ce cas, vous pouvez voir votre *commit* manquant après « dangling commit ».
Vous pouvez le restaurer de la même manière que précédemment, en créant une branche qui référence cette empreinte SHA.

## Suppression d'objets

Il y a beaucoup de choses dans Git qui sont géniales, mais une fonctionnalité qui peut poser problème est le fait que `git clone` télécharge l'historique entier du projet, incluant chaque version de chaque fichier.
C'est très bien lorsque le tout est du code source, parce que Git est hautement optimisé pour compresser les données efficacement.
Cependant, si quelqu'un à un moment donné de l'historique de votre projet a ajouté un énorme fichier, chaque clone sera forcé de télécharger cet énorme fichier, même s'il a été supprimé du projet dans le *commit* suivant.
Puisqu'il est accessible depuis l'historique, il sera toujours là.

Cela peut être un énorme problème, lorsque vous convertissez un dépôt Subversion ou Perforce en un dépôt Git.
Car, comme vous ne téléchargez pas l'historique entier dans ces systèmes, ce genre d'ajout n'a que peu de conséquences.
Si vous avez importé depuis un autre système ou que votre dépôt est beaucoup plus gros que ce qu'il devrait être, voici comment vous pouvez trouver et supprimer des gros objets.

Soyez prévenu : cette technique détruit votre historique de *commit*.
Elle réécrit chaque objet *commit* depuis le premier objet arbre que vous modifiez pour supprimer une référence d'un gros fichier.
Si vous faites cela immédiatement après un import, avant que quiconque n'ait eu le temps de commencer à travailler sur ce *commit*, tout va bien.
Sinon, vous devez alerter tous les contributeurs qu'ils doivent recommencer (ou au moins faire un `rebase`) sur votre nouveau *commit*.

Pour la démonstration, nous allons ajouter un gros fichier dans votre dépôt de test, le supprimer dans le *commit* suivant, le trouver et le supprimer de manière permanente du dépôt.
Premièrement, ajoutons un gros objet à votre historique :

	$ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
	$ git add git.tbz2
	$ git commit -am 'added git tarball'
	[master 6df7640] added git tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 create mode 100644 git.tbz2

Oups, vous ne vouliez pas rajouter une énorme archive à votre projet.
Il vaut mieux s'en débarrasser :

	$ git rm git.tbz2
	rm 'git.tbz2'
	$ git commit -m 'oops - removed large tarball'
	[master da3f30d] oops - removed large tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 delete mode 100644 git.tbz2

Maintenant, faites un `gc` sur votre base de données, pour voir combien d'espace disque vous utilisez :

	$ git gc
	Counting objects: 21, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (16/16), done.
	Writing objects: 100% (21/21), done.
	Total 21 (delta 3), reused 15 (delta 1)

Vous pouvez exécuter la commande `count-objects` pour voir rapidement combien d'espace disque vous utilisez :

	$ git count-objects -v
	count: 4
	size: 16
	in-pack: 21
	packs: 1
	size-pack: 2016
	prune-packable: 0
	garbage: 0

L'entrée `size-pack` est la taille de vos fichiers groupés en kilo-octet, vous utilisez donc 2 Mio.
Avant votre dernier *commit*, vous utilisiez environ 2 Kio, clairement, supprimer le fichier avec le *commit* précédent ne l'a pas enlevé de votre historique.
À chaque fois que quelqu'un clonera votre dépôt, il aura à cloner les 2 Mio pour récupérer votre tout petit projet, parce que vous avez accidentellement rajouté un gros fichier.
Débarrassons-nous en.

Premièrement, vous devez le trouver.
Dans ce cas, vous savez déjà de quel fichier il s'agit.
Mais supposons que vous ne le sachiez pas, comment identifieriez-vous quel(s) fichier(s) prennent trop de place ?
Si vous exécutez `git gc`, tous les objets sont dans des fichiers groupés ; vous pouvez identifier les gros objets en utilisant une autre commande de plomberie appelée `git verify-pack` et en triant sur le troisième champ de la sortie qui est la taille des fichiers.
Vous pouvez également le faire suivre à la commande `tail` car vous ne vous intéressez qu'aux fichiers les plus gros :

	$ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
	7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

Le gros objet est à la fin : 2 Mio.
Pour trouver quel fichier c'est, vous allez utiliser la commande `rev-list`, que vous avez utilisée brièvement dans le chapitre 7.
Si vous mettez l'option `--objects` à `rev-list`, elle listera tous les SHA des *commits* et des blobs avec le chemin du fichier associé.
Vous pouvez utilisez cette commande pour trouver le nom de votre blob :

	$ git rev-list --objects --all | grep 7a9eb2fb
	7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Maintenant, vous voulez supprimer ce fichier de toutes les arborescences passées.
Vous pouvez facilement voir quels *commits* ont modifié ce fichier :

	$ git log --pretty=oneline --branches -- git.tbz2
	da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
	6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Vous devez réécrire tous les *commits* qui sont liés à `6df76` pour supprimer totalement ce fichier depuis votre historique Git.
Pour cela, utilisez `filter-branch`, que vous avez utilisé dans le chapitre 6 :

	$ git filter-branch --index-filter \
	   'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
	Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
	Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
	Ref 'refs/heads/master' was rewritten

L'option `--index-filter` est similaire à l'option `--tree-filter` utilisée dans le chapitre 6, sauf qu'au lieu de modifier les fichiers sur le disque, vous modifiez votre zone d'attente et votre index.
Plutôt que de supprimer un fichier spécifique avec une commande comme `rm file`, vous devez le supprimer avec `git rm --cached` ; vous devez le supprimer de l'index, pas du disque.
La raison de faire cela de cette manière est la rapidité, car Git n'ayant pas besoin de récupérer chaque révision sur disque avant votre filtre, la procédure peut être beaucoup, beaucoup plus rapide.
Vous pouvez faire la même chose avec `--tree-filter` si vous voulez.
L'option `--ignore-unmatch` de `git rm` lui dit que ce n'est pas une erreur si le motif que vous voulez supprimez n'existe pas.
Finalement, vous demandez à `filter-branch` de réécrire votre historique seulement depuis le parent du *commit* `6df7640`, car vous savez que c'est de là que le problème a commencé.
Sinon, il aurait démarré du début et serait plus long sans nécessité.

Votre historique ne contient plus de référence à ce fichier.
Cependant, votre journal de révision et un nouvel ensemble de références que Git a ajouté lors de votre `filter-branch` dans `.git/refs/original` en contiennent encore, vous devez donc les supprimer puis regrouper votre base de données.
Vous devez vous débarrasser de tout ce qui fait référence à ces vieux *commits* avant de regrouper :

	$ rm -Rf .git/refs/original
	$ rm -Rf .git/logs/
	$ git gc
	Counting objects: 19, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (19/19), done.
	Total 19 (delta 3), reused 16 (delta 1)

Voyons combien d'espace vous avez récupéré :

	$ git count-objects -v
	count: 8
	size: 2040
	in-pack: 19
	packs: 1
	size-pack: 7
	prune-packable: 0
	garbage: 0

La taille du dépôt regroupé est retombée à 7 Kio, ce qui est beaucoup moins que 2 Mio.
Vous pouvez voir dans la valeur « size » que votre gros objet est toujours dans vos objets bruts, il n'est donc pas parti ; mais il ne sera plus transféré lors d'une poussée vers un serveur ou un clone, ce qui est l'important dans l'histoire.
Si vous voulez réellement, vous pouvez supprimer complètement l'objet en exécutant `git prune --expire`.
