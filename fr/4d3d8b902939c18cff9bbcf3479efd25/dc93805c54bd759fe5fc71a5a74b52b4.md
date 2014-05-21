# Accès public

Et si vous voulez permettre des accès anonymes en lecture ?
Peut-être souhaitez-vous héberger un projet open source au lieu d'un projet interne privé.
Ou peut-être avez-vous quelques serveurs de compilation ou d'intégration continue qui changent souvent et vous ne souhaitez pas avoir à regénérer des clés SSH tout le temps — vous avez besoin d'un accès en lecture seule simple.

Le moyen le plus simple pour des petites installations est probablement d'installer un serveur web statique dont la racine pointe sur vos dépôts Git puis d'activer le crochet `post-update` mentionné à la première partie de ce chapitre.
Reprenons l'exemple précédent.
Supposons que vos dépôts soient dans le répertoire `/opt/git` et qu'un serveur Apache soit installé sur la machine.
Vous pouvez bien sûr utiliser n'importe quel serveur web mais nous utiliserons Apache pour montrer la configuration nécessaire.

Premièrement, il faut activer le crochet :

	$ cd projet.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Quelle est l'action de ce crochet `post-update` ?
Il contient simplement ceci :

	$ cat .git/hooks/post-update
	#!/bin/sh
	exec git-update-server-info

Cela signifie que lorsque vous poussez vers le serveur via SSH, Git lance cette commande pour mettre à jour les fichiers nécessaires lorsqu'on tire par HTTP.

Ensuite, il faut ajouter dans la configuration Apache une entrée VirtualHost dont la racine pointe sur vos dépôts Git.
Ici, nous supposerons que vous avez réglé un DNS avec résolution générique qui renvoit `*.gitserveur` vers la machine qui héberge ce système :

	<VirtualHost *:80>
	    ServerName git.gitserveur
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

Vous devrez aussi positionner le groupe d'utilisateurs Unix du répertoire `/opt/git` à `www-data` de manière à ce que le serveur web puisse avoir accès en lecture seule aux répertoires si le serveur Apache lance le script CGI avec cet utilisateur (par défaut) :

	$ chgrp -R www-data /opt/git

Après avoir redémarré Apache, vous devriez être capable de cloner vos dépôts en spécifiant l'URL de votre projet :

	$ git clone http://git.gitserveur/projet.git

Ainsi, vous pouvez donner accès en lecture seule à tous vos projets à un grand nombre d'utilisateurs en quelques minutes.
Une autre option simple pour fournir un accès public non-authentifié consiste à lancer un *daemon* Git, bien que cela requière de démoniser le processus — nous traiterons cette option dans un chapitre ultérieur si vous préférez cette option.
