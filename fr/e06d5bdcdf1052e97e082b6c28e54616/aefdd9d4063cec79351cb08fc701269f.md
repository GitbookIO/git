# Les références spécifiques

Dans tout le livre, nous avons utilisé des associations simples entre les branches distantes et les références locales.
Elles peuvent être plus complexes.
Supposons que vous ajoutiez un dépôt distant comme ceci :

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

Cela ajoute une section au fichier `.git/config`, contenant le nom du dépôt distant (`origin`), l'URL de ce dépôt et la spécification des références pour la récupération :

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

Le format d'une spécification de référence est un `+` facultatif, suivi de `<src>:<dst>`, où `<src>` est le motif des références du côté distant et `<dst>` est l'emplacement local où les références seront enregistrées.
Le `+` précise à Git de mettre à jour la référence même si ce n'est pas une avance rapide.

Dans le cas par défaut, qui est celui d'un enregistrement automatique par la commande `git remote add`, Git récupère toutes les références de `refs/heads/` sur le serveur et les enregistre localement dans `refs/remotes/origin/`.
Ainsi, s'il y a une branche `master` sur le serveur, vous pouvez accéder localement à l'historique de cette branche via :

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

Ces syntaxes sont toutes équivalentes, car Git les développe en `refs/remotes/origin/master`.

Si vous préférez que Git récupère seulement la branche `master` et non chacune des branches du serveur distant, vous pouvez remplacer la ligne fetch par :

	fetch = +refs/heads/master:refs/remotes/origin/master

C'est la spécification des références de `git fetch` pour ce dépôt distant.
Si l'on veut effectuer une action particulière une seule fois, la spécification des références peut aussi être précisée en ligne de commande.
Pour retirer la branche `master` du dépôt distant vers la branche locale `origin/mymaster`, vous pouvez exécuter :

	$ git fetch origin master:refs/remotes/origin/mymaster

Vous pouvez indiquer des spécifications pour plusieurs références.
En ligne de commande, vous pouvez tirer plusieurs branches de cette façon :

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

Dans ce cas, la récupération *pull* de la branche `master` a été refusée car ce n'était pas une avance rapide.
On peut surcharger ce comportement en précisant un `+` devant la spécification de la référence.

On peut aussi indiquer plusieurs spécifications de référence pour la récupération, dans le fichier de configuration.
Si vous voulez toujours récupérer les branches `master` et `experiment`, ajoutez ces deux lignes :

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Vous ne pouvez pas utiliser des jokers partiels, ce qui suit est donc invalide :

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

On peut toutefois utiliser des espaces de noms pour accomplir cela.
S'il existe une équipe qualité (QA) qui publie une série de branches et que l'on veut la branche `master`, les branches de l'équipe qualité et rien d'autre, on peut utiliser la configuration suivante :

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

Si vous utilisez des processus complexes impliquant une équipe qualité, des développeurs et des intégrateurs qui publient des branches et qui collaborent sur des branches distantes, vous pouvez facilement utiliser des espaces de noms, de cette façon.

## Publier une référence spécifique

Il est pratique de pouvoir récupérer des références issues d'espace de nom de cette façon, mais comment l'équipe qualité insère-t-elle ces branches dans l'espace de nom `qa/` en premier lieu ?
On peut accomplir cela en utilisant les spécifications de références pour la publication.

Si l'équipe qualité veut publier sa branche `master` vers `qa/master` sur le serveur distant, elle peut exécuter :

	$ git push origin master:refs/heads/qa/master

Si elle veut que Git le fasse automatiquement à chaque exécution de `git push origin`, elle peut ajouter une entrée `push` au fichier de configuration :

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

De même, cela fera que, par défaut, `git push origin` publiera la branche locale `master` sur la branche distante `qa/master`.

## Supprimer des références

Vous pouvez aussi utiliser les spécifications de références pour supprimer des références sur le serveur distant en exécutant une commande comme :

	$ git push origin :topic

La spécification de référence ressemble à `<src>:<dst>`, mais en laissant vide la partie `<src>`, cela signifie une création de la branche à partir de rien et donc sa suppression.
