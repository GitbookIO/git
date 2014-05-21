# Protocoles de transfert

Git peut transférer des données entre deux dépôts, de deux façons principales : via HTTP et via un protocole dit « intelligent » utilisé par les transports `file://`, `ssh://` et `git://`.
Cette section fait un tour d'horizon du fonctionnement de ces deux protocoles.

## Protocole stupide

On parle souvent du transfert Git sur HTTP comme étant un protocole stupide, car il ne nécessite aucun code spécifique à Git côté serveur durant le transfert.
Le processus de récupération est une série de requêtes GET, où le client devine la structure du dépôt Git présent sur le serveur.
Suivons le processus `http-fetch` pour la bibliothèque simplegit :

	$ git clone http://github.com/schacon/simplegit-progit.git

La première chose que fait cette commande est de récupérer le fichier `info/refs`.
Ce fichier est écrit par la commande `update-server-info` et c'est pour cela qu'il faut activer le crochet `post-receive`, sinon le transfert HTTP ne fonctionnera pas correctement :

	=> GET info/refs
	ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

On possède maintenant une liste des références distantes et empreintes SHA1.
Ensuite, on regarde vers quoi pointe HEAD, pour savoir sur quelle branche se placer quand on aura fini :

	=> GET HEAD
	ref: refs/heads/master

On aura besoin de se placer sur la branche `master`, quand le processus sera terminé.
On est maintenant prêt à démarrer le processus de parcours.
Puisque votre point de départ est l'objet *commit* `ca82a6` que vous avez vu dans le fichier `info/refs`, vous commencez par le récupérer :

	=> GET objects/ca/82a6dff817ec66f44342007202690a93763949
	(179 bytes of binary data)

Vous obtenez un objet, cet objet est dans le format brut sur le serveur et vous l'avez récupéré à travers une requête HTTP GET statique.
Vous pouvez le décompresser avec zlib, ignorer l'en-tête et regarder le contenu du *commit* :

	$ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Puis, vous avez deux autres objets supplémentaires à récupérer : `cfda3b` qui est l'arbre du contenu sur lequel pointe le *commit* que nous venons de récupérer et `085bb3` qui est le *commit* parent :

	=> GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	(179 bytes of data)

Cela vous donne l'objet du prochain *commit*.
Récupérez l'objet arbre :

	=> GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
	(404 - Not Found)

Oups, on dirait que l'objet arbre n'est pas au format brut sur le serveur, vous obtenez donc une réponse 404.
On peut en déduire certaines raisons : l'objet peut être dans un dépôt suppléant ou il peut être dans un fichier groupé de ce dépôt.
Git vérifie la liste des dépôts suppléants d'abord :

	=> GET objects/info/http-alternates
	(empty file)

Si la réponse contenait une liste d'URL suppléantes, Git aurait cherché les fichiers bruts et les fichiers groupés à ces emplacements, c'est un mécanisme sympathique pour les projets qui ont dérivés d'un autre pour partager les objets sur le disque.
Cependant, puisqu'il n'y a pas de suppléants listés dans ce cas, votre objet doit se trouver dans un fichier groupé.
Pour voir quels fichiers groupés sont disponibles sur le serveur, vous avez besoin de récupérer le fichier `objects/info/packs`, qui en contient la liste (générée également par `update-server-info`) :

	=> GET objects/info/packs
	P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Il n'existe qu'un seul fichier groupé sur le serveur, votre objet se trouve évidemment dedans, mais vous allez tout de même vérifier l'index pour être sûr.
C'est également utile lorsque vous avez plusieurs fichiers groupés sur le serveur, vous pouvez donc voir quel fichier groupé contient l'objet dont vous avez besoin :

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
	(4k of binary data)

Maintenant que vous avez l'index du fichier groupé, vous pouvez vérifier si votre objet est bien dedans car l'index liste les empreintes SHA-1 des objets contenus dans ce fichier groupé et des emplacements de ces objets.
Votre objet est là, allez donc récupérer le fichier groupé complet :

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
	(13k of binary data)

Vous avez votre objet arbre, vous continuez donc le chemin des *commits*.
Ils sont également tous contenus dans votre fichier groupé que vous venez de télécharger, vous n'avez donc pas d'autres requêtes à faire au serveur.
Git récupère une copie de travail de votre branche `master` qui été référencée par HEAD que vous avez téléchargé au début.

La sortie complète de cette procédure ressemble à :

	$ git clone http://github.com/schacon/simplegit-progit.git
	Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
	got ca82a6dff817ec66f44342007202690a93763949
	walk ca82a6dff817ec66f44342007202690a93763949
	got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Getting alternates list for http://github.com/schacon/simplegit-progit.git
	Getting pack list for http://github.com/schacon/simplegit-progit.git
	Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
	Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
	 which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	walk a11bef06a3f659402fe7563abf99ad00de2209e6

## Protocole intelligent

La méthode HTTP est simple mais un peu inefficace.
Utiliser des protocoles intelligents est une méthode plus habituelles pour transférer des données.
Ces protocoles ont un exécutable du côté distant qui connaît Git, il peut lire les données locales et deviner ce que le client a ou ce dont il a besoin pour générer des données personnalisées pour lui.
Il y a deux ensembles d'exécutables pour transférer les données : une paire pour téléverser des données et une paire pour en télécharger.

### Téléverser des données

Pour téléverser des données vers un exécutable distant, Git utilise les exécutables `send-pack` et `receive-pack`.
L'exécutable `send-pack` tourne sur le client et se connecte à l'exécutable `receive-pack` du côté serveur.

Par exemple, disons que vous exécutez `git push origin master` dans votre projet et `origin` est défini comme une URL qui utilise le protocole SSH.
Git appelle l'exécutable `send-pack`, qui initialise une connexion à travers SSH vers votre serveur.
Il essaye d'exécuter une commande sur le serveur distant via un appel SSH qui ressemble à :

	$ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
	005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
	003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
	0000

La commande `git-receive-pack` répond immédiatement avec une ligne pour chaque référence qu'elle connaît actuellement, dans ce cas, uniquement la branche `master` et ses empreintes SHA.
La première ligne contient également une liste des compétences du serveur (ici : `report-status` et `delete-refs`).

Chaque ligne commence avec une valeur hexadécimale sur 4 octets, spécifiant le reste de la longueur de la ligne.
La première ligne, ici, commence avec `005b`, soit 91 en hexadécimal, ce qui signifie qu'il y a 91 octets restants sur cette ligne.
La ligne suivante commence avec `003e`, soit 62, vous lisez donc les 62 octets restants.
La ligne d'après est `0000`, signifiant que le serveur a fini de lister ses références.

Maintenant que vous connaissez l'état du serveur, votre exécutable `send-pack` détermine quels *commits* il a que le serveur n'a pas.
L'exécutable `send-pack` envoie alors à l'exécutable `receive-pack`, les informations concernant chaque référence que cette commande `push` va mettre à jour.
Par exemple, si vous mettez à jour la branche `master` et ajoutez la branche `experiment`, la réponse de `send-pack` ressemblera à quelque chose comme :

	0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
	00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
	0000

La valeur SHA-1 remplie de '0' signifie qu'il n'y avait rien à cet endroit avant, car vous êtes en train d'ajouter la référence `experiment`.
Si vous étiez en train de supprimer une référence, vous verriez l'opposé : que des '0' du côté droit.

Git envoie une ligne pour chaque référence que l'on met à jour avec l'ancien SHA, le nouveau SHA et la référence en train d'être mise à jour.
La première ligne contient également les compétences du client.
Puis, le client téléverse un fichier groupé de tous les objets que le serveur n'a pas encore.
Finalement, le serveur répond avec une indication de succès (ou d'échec) :

	000Aunpack ok

### Téléchargement des données

Lorsque vous téléchargez des données, les exécutables `fetch-pack` et `upload-pack` entrent en jeu.
Le client initialise un exécutable `fetch-pack` qui se connecte à un exécutable `upload-pack` du côté serveur pour négocier quelles données seront remontées.

Il y a plusieurs manières d'initialiser l'exécutable `upload-pack` sur le dépôt distant.
Vous pouvez passer par SSH de la même manière qu'avec l'exécutable `receive-pack`.
Vous pouvez également initialiser l'exécutable à travers le *daemon* Git, qui écoute sur le port 9418 du serveur par défaut.
L'exécutable `fetch-pack` envoie des données qui ressemblent à cela juste après la connexion :

	003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Cela commence par les 4 octets désignant la quantité de données qui suit, puis la commande à exécuter suivie par un octet nul, puis le nom d'hôte du serveur suivi d'un octet nul final.
Le *daemon* Git vérifie que la commande peut être exécutée, que le dépôt existe et est accessible publiquement.
Si tout va bien, il appelle l'exécutable `upload-pack` et lui passe la main.

Si vous êtes en train de tirer (*fetch*) à travers SSH, `fetch-pack` exécute plutôt quelque chose du genre :

	$ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

Dans tous les cas, après que `fetch-pack` se connecte, `upload-pack` lui répond quelque chose du style :

	0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
	  side-band side-band-64k ofs-delta shallow no-progress include-tag
	003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
	003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
	0000

C'est très proche de ce que répondait `receive-pack` mais les compétences sont différentes.
En plus, il vous répond la référence HEAD, afin que le client sache quoi récupérer dans le cas d'un clone.

À ce moment, l'exécutable `fetch-pack` regarde quels objets il a et répond avec les objets dont il a besoin en envoyant « want » (vouloir) suivi du SHA qu'il veut.
Il envoie tous les objets qu'il a déjà avec « have » suivi du SHA.
À la fin de la liste, il écrit « done » pour inciter l'exécutable `upload-pack` à commencer à envoyer le fichier groupé des données demandées :

	0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
	0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	0000
	0009done

C'est le cas basique d'un protocole de transfert.
Dans des cas plus complexes, le client a des compétences `multi_ack` (plusieurs réponses) ou `side-band` (plusieurs connexions), mais cet exemple vous montre les bases du protocole intelligent.

