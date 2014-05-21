# Démarrer un dépôt Git

Vous pouvez principalement démarrer un dépôt Git de deux manières.
La première consiste à prendre un projet ou un répertoire existant et à l'importer dans Git.
La seconde consiste à cloner un dépôt Git existant sur un autre serveur.

## Initialisation d'un dépôt Git dans un répertoire existant

Si vous commencez à suivre un projet existant dans Git, vous n'avez qu'à vous positionner dans le répertoire du projet et saisir :

	$ git init

Cela crée un nouveau sous-répertoire nommé `.git` qui contient tous les fichiers nécessaires au dépôt — un squelette de dépôt Git.
Pour l'instant, aucun fichier n'est encore versionné.
(Cf. chapitre 9 pour plus d'information sur les fichiers contenus dans le répertoire `.git` que vous venez de créer.)


Si vous souhaitez commencer à suivre les versions des fichiers existants (contrairement à un répertoire vide), vous devriez probablement commencer par indexer ces fichiers et faire une validation initiale.
Vous pouvez réaliser ceci avec une poignée de commandes `git add` qui spécifient les fichiers que vous souhaitez suivre, suivie d'une validation :

	$ git add *.c
	$ git add README
	$ git commit –m 'version initiale du projet'

Nous allons passer en revue ce que ces commandes font dans une petite minute.
Pour l'instant, vous avez un dépôt Git avec des fichiers sous gestion de version et une validation initiale.

## Cloner un dépôt existant

Si vous souhaitez obtenir une copie d'un dépôt Git existant — par exemple, un projet auquel vous aimeriez contribuer — la commande dont vous avez besoin s'appelle `git clone`.
Si vous êtes familier avec d'autres systèmes de gestion de version tels que Subversion, vous noterez que la commande est `clone` et non `checkout`.
C'est une distinction importante — Git reçoit une copie de quasiment toutes les données dont le serveur dispose.
Toutes les versions de tous les fichiers pour l'historique du projet sont téléchargées quand vous lancez `git clone`.
En fait, si le disque du serveur se corrompt, vous pouvez utiliser n'importe quel clone pour remettre le serveur dans l'état où il était au moment du clonage (vous pourriez perdre quelques paramètres du serveur, mais toutes les données sous gestion de version seraient récupérées — cf. chapitre 4 pour de plus amples détails).

Vous clonez un dépôt avec `git clone [url]`.
Par exemple, si vous voulez cloner la bibliothèque Git Ruby appelée Grit, vous pouvez le faire de la manière suivante :

	$ git clone git://github.com/schacon/grit.git

Ceci crée un répertoire nommé `grit`, initialise un répertoire `.git` à l'intérieur, récupère toutes les données de ce dépôt, et extrait une copie de travail de la dernière version.
Si vous examinez le nouveau répertoire `grit`, vous y verrez les fichiers du projet, prêts à être modifiés ou utilisés.
Si vous souhaitez cloner le dépôt dans un répertoire nommé différemment, vous pouvez spécifier le nom dans une option supplémentaire de la ligne de commande :

	$ git clone git://github.com/schacon/grit.git mongrit

Cette commande réalise la même chose que la précédente, mais le répertoire cible s'appelle `mongrit`.

Git dispose de différents protocoles de transfert que vous pouvez utiliser.
L'exemple précédent utilise le protocole `git://`, mais vous pouvez aussi voir `http(s)://` ou `utilisateur@serveur:/chemin.git`, qui utilise le protocole de transfert SSH.
Le chapitre 4 introduit toutes les options disponibles pour mettre en place un serveur Git, ainsi que leurs avantages et inconvénients.
