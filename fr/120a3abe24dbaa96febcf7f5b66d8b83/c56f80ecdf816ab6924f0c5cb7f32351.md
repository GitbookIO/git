# Travailler avec des dépôts distants

Pour pouvoir collaborer sur un projet Git, il est nécessaire de savoir comment gérer les dépôts distants.
Les dépôts distants sont des versions de votre projet qui sont hébergées sur Internet ou le réseau.
Vous pouvez en avoir plusieurs, pour lesquels vous pouvez avoir des droits soit en lecture seule, soit en lecture/écriture.
Collaborer avec d'autres personnes consiste à gérer ces dépôts distants, en poussant ou tirant des données depuis et vers ces dépôts quand vous souhaitez partager votre travail.

Gérer des dépôts distants inclut savoir comment ajouter des dépôts distants, effacer des dépôts distants qui ne sont plus valides, gérer des branches distantes et les définir comme suivies ou non, et plus encore.
Dans cette section, nous traiterons des commandes de gestion distante.

## Afficher les dépôts distants

Pour visualiser les serveurs distants que vous avez enregistrés, vous pouvez lancer la commande `git remote`.
Elle liste les noms des différentes références distantes que vous avez spécifiées.
Si vous avez cloné un dépôt, vous devriez au moins voir l'origine `origin` — c'est-à-dire le nom par défaut que Git donne au serveur à partir duquel vous avez cloné :

	$ git clone git://github.com/schacon/ticgit.git
	Initialized empty Git repository in /private/tmp/ticgit/.git/
	remote: Counting objects: 595, done.
	remote: Compressing objects: 100% (269/269), done.
	remote: Total 595 (delta 255), reused 589 (delta 253)
	Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
	Resolving deltas: 100% (255/255), done.
	$ cd ticgit
	$ git remote
	origin

Vous pouvez aussi spécifier `-v`, qui vous montre l'URL que Git a stockée pour chaque nom court :

	$ git remote -v
	origin  git://github.com/schacon/ticgit.git (fetch)
	origin  git://github.com/schacon/ticgit.git (push)

Si vous avez plus d'un dépôt distant, la commande précédente les liste tous.
Par exemple, mon dépôt Grit ressemble à ceci.

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

Cela signifie que nous pouvons tirer très facilement des contributions depuis certains utilisateurs.
Mais il est à noter que seul le dépôt distant `origin` utilise une URL SSH, ce qui signifie que c'est le seul sur lequel je peux pousser (nous traiterons de ceci au chapitre 4).

## Ajouter des dépôts distants

J'ai expliqué et donné des exemples d'ajout de dépôts distants dans les chapitres précédents, mais voici spécifiquement comment faire.
Pour ajouter un nouveau dépôt distant Git comme nom court auquel il est facile de faire référence, lancez `git remote add [nomcourt] [url]` :

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Maintenant, vous pouvez utiliser le mot-clé `pb` sur la ligne de commande au lieu de l'URL complète.
Par exemple, si vous voulez récupérer toute l'information que Paul a mais que vous ne souhaitez pas l'avoir encore dans votre branche, vous pouvez lancer `git fetch pb` :

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

La branche `master` de Paul est accessible localement en tant que `pb/master` — vous pouvez la fusionner dans une de vos propres branches, ou vous pouvez extraire une branche localement si vous souhaitez l'inspecter.

## Récupérer et tirer depuis des dépôts distants

Comme vous venez tout juste de le voir, pour obtenir les données des dépôts distants, vous pouvez lancer :

	$ git fetch [nom-distant]

Cette commande s'adresse au dépôt distant et récupère toutes les données de ce projet que vous ne possédez pas déjà.
Après cette action, vous possédez toutes les références à toutes les branches contenues dans ce dépôt, que vous pouvez fusionner ou inspecter à tout moment (nous reviendrons plus précisément sur les branches et leur utilisation au chapitre 3).

Si vous clonez un dépôt, le dépôt distant est automatiquement ajouté sous le nom `origin`.
Donc, `git fetch origin` récupère tout ajout qui a été poussé vers ce dépôt depuis que vous l'avez cloné ou la dernière fois que vous avez récupéré les ajouts.
Il faut noter que la commande `fetch` tire les données dans votre dépôt local mais sous sa propre branche — elle ne les fusionne pas automatiquement avec aucun de vos travaux ni ne modifie votre copie de travail.
Vous devez volontairement fusionner ses modifications distantes dans votre travail lorsque vous le souhaitez.

Si vous avez créé une branche pour suivre l'évolution d'une branche distante (cf.
la section suivante et le chapitre 3 pour plus d'information), vous pouvez utiliser la commande `git pull` qui récupère et fusionne automatiquement une branche distante dans votre branche locale.
Ce comportement peut correspondre à une méthode de travail plus confortable, sachant que par défaut la commande `git clone` paramètre votre branche locale pour qu'elle suive la branche `master` du dépôt que vous avez cloné (en supposant que le dépôt distant ait une branche `master`).
Lancer `git pull` récupère généralement les données depuis le serveur qui a été initialement cloné et essaie de les fusionner dans votre branche de travail actuel.

## Pousser son travail sur un dépôt distant

Lorsque votre dépôt vous semble prêt à être partagé, il faut le pousser en amont.
La commande pour le faire est simple : `git push [nom-distant] [nom-de-branche]`.
Si vous souhaitez pousser votre branche `master` vers le serveur `origin` (pour rappel, cloner un dépôt définit automatiquement ces noms pour vous), alors vous pouvez lancez ceci pour pousser votre travail vers le serveur amont :

	$ git push origin master

Cette commande ne fonctionne que si vous avez cloné depuis un serveur sur lequel vous avez des droits d'accès en écriture et si personne n'a poussé dans l'intervalle.
Si vous et quelqu'un d'autre clonez un dépôt au même moment et que cette autre personne pousse ses modifications et qu'après vous tentez de pousser les vôtres, votre poussée sera rejetée à juste titre.
Vous devrez tout d'abord tirer les modifications de l'autre personne et les fusionner avec les vôtres avant de pouvoir pousser.
Référez-vous au chapitre 3 pour de plus amples informations sur les techniques pour pousser vers un serveur distant.

## Inspecter un dépôt distant

Si vous souhaitez visualiser plus d'informations à propos d'un dépôt distant particulier, vous pouvez utiliser la commande `git remote show [nom-distant]`.
Si vous lancez cette commande avec un nom court particulier, tel que `origin`, vous obtenez quelque chose comme :

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit


Cela donne la liste des URL pour le dépôt distant ainsi que la liste des branches distantes suivies.
Cette commande vous informe que si vous êtes sur la branche `master` et si vous lancez `git pull`, il va automatiquement fusionner la branche `master` du dépôt distant après avoir récupéré toutes les références sur le serveur distant.
Cela donne aussi la liste des autres références qu'il aura tirées.

Le résultat ci-dessus est un exemple simple mais réaliste de dépôt distant.
Lors d'une utilisation plus intense de Git, la commande `git remote show` fournira beaucoup d'information :

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Cette commande affiche les branches poussées automatiquement lorsqu'on lance `git push` dessus.
Elle montre aussi les branches distantes qui n'ont pas encore été rapatriées, les branches distantes présentes localement mais effacées sur le serveur, et toutes les branches qui seront fusionnées quand on lancera `git pull`.

## Retirer et déplacer des branches distantes

Si vous souhaitez renommer une référence, dans les versions récentes de Git, vous pouvez lancer `git remote rename` pour modifier le nom court d'un dépôt distant.
Par exemple, si vous souhaitez renommer `pb` en `paul`, vous pouvez le faire avec `git remote rename` :

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Il faut mentionner que ceci modifie aussi les noms de branches distantes.
Celle qui était référencée sous `pb/master` l'est maintenant sous `paul/master`.

Si vous souhaitez retirer une référence pour certaines raisons — vous avez changé de serveur ou vous n'utilisez plus ce serveur particulier, ou peut-être un contributeur a cessé de contribuer — vous pouvez utiliser `git remote rm` :

	$ git remote rm paul
	$ git remote
	origin
