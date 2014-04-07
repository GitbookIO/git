# Fusion de sous-arborescences

Maintenant que vous avez vu les difficultés qu'il peut y avoir avec le système de sous-module, voyons une alternative pour résoudre la même problématique.
Lorsque Git fusionne, il regarde ce qu'il doit fusionner et choisit alors une stratégie de fusion appropriée.
Si vous fusionnez deux branches, Git utilise une stratégie _récursive_ (_recursive_ strategy).
Si vous fusionnez plus de deux branches, Git choisit la stratégie de la _pieuvre_ (_octopus_ strategy).
Ces stratégies sont choisies automatiquement car la stratégie récursive peut gérer des problèmes complexes de fusions à trois entrées avec par exemple plus d'un ancêtre commun, mais il ne peut gérer que deux branches à fusionner.
La fusion de la pieuvre peut gérer plusieurs branches mais elle est plus prudente afin d'éviter les conflits difficiles, elle est donc choisie comme stratégie par défaut si vous essayez de fusionner plus de deux branches.

Cependant, il existe d'autres stratégies que vous pouvez tout aussi bien choisir.
L'une d'elles est la fusion de sous-arborescence que vous pouvez utiliser pour gérer la problématique du sous-projet.
Nous allons donc voir comment gérer l'inclusion de `rack` comme dans la section précédente, mais en utilisant cette fois-ci les fusions de sous-arborescence.

La fusion de sous-arborescence suppose que vous ayez deux projets et que l'un s'identifie à un sous-répertoire de l'autre.
Lorsque vous spécifiez une fusion de sous-arborescence, Git est assez intelligent pour deviner lequel est un sous-répertoire de l'autre et fusionne en conséquence — c'est assez bluffant.

Premièrement, vous ajoutez l'application Rack à votre projet.
Vous ajoutez le projet Rack comme une référence distante dans votre propre projet et le récupérez dans sa propre branche :

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

Vous avez maintenant la racine du projet Rack dans votre branche `rack_branch` et votre propre projet dans la branche `master`.
Si vous récupérez l'une puis l'autre branche, vous pouvez voir que vous avez différentes racines de projet :

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

Pour tirer le projet Rack dans votre projet `master` comme un sous-répertoire, vous pouvez utiliser la commande `git read-tree`.
Vous apprendrez davantage sur `read-tree` et compagnie dans le chapitre 9, mais pour le moment, sachez qu'il lit la racine d'une de vos branches et l'inscrit dans votre index et votre répertoire de travail.
Vous venez juste de commuter vers votre branche `master` et vous tirez la branche `rack` vers le sous-répertoire `rack` de votre branche `master` de votre projet principal :

	$ git read-tree --prefix=rack/ -u rack_branch

Au moment de valider, vous verrez tous les fichiers de Rack de ce sous-répertoire, comme si vous les aviez copiés depuis une archive.
Ce qui est intéressant, c'est que vous pouvez assez facilement fusionner les changements d'une branche à l'autre.
Par conséquence, s'il y a des mises à jour pour le projet Rack, vous pouvez les tirer depuis le dépôt principal en commutant dans cette branche et tirant les modifications :

	$ git checkout rack_branch
	$ git pull

Puis, vous pouvez fusionner ces changements dans votre branche principale.
Vous pouvez utiliser `git merge -s subtree` et cela fonctionnera, mais Git fusionnera également les historiques ensemble, ce que vous ne voulez probablement pas.
Pour tirer les changements et préremplir le message de validation, utilisez les options `--squash` et `--no-commit` avec l'option de stratégie `-s subtree` :

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

Toutes les modifications de votre projet Rack sont fusionnées et prêtes à être validées localement.
Vous pouvez également faire le contraire, faire des modifications dans le sous-répertoire `rack` de votre branche principale et les fusionner plus tard dans votre branche `rack_branch` pour les envoyer aux mainteneurs du projet Rack ou les pousser dans le dépôt principal.

Pour voir les différences entre ce que vous avez dans le sous-répertoire `rack` et le code de la branche `rack_branch` (pour savoir si vous devez les fusionner),  vous ne pouvez pas utiliser la commande `diff` habituelle.
Vous devez plutôt exécuter `git diff-tree` en renseignant la branche avec laquelle vous voulez comparer :

	$ git diff-tree -p rack_branch

Ou, pour comparer ce qu'il y a dans votre répertoire `rack` avec ce qu'il y avait sur le serveur la dernière fois que vous avez vérifié, vous pouvez exécuter :

	$ git diff-tree -p rack_remote/master
