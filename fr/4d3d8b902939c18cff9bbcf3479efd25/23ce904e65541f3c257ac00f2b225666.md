# Le *daemon* Git

Pour garantir les accès publics non authentifiés en lecture à vos projets, il est préférable de dépasser le protocole HTTP et de commencer à utiliser le protocole Git.
La raison principale en est la vitesse.
Le protocole Git est bien plus efficace et de ce fait plus rapide que le protocole HTTP et fera gagner du temps à vos utilisateurs.

Ce système n'est valable que pour les accès non authentifiés en lecture seule.
Si vous mettez ceci en place sur un serveur à l'extérieur de votre pare-feu, il ne devrait être utilisé que pour des projets qui sont destinés à être visibles publiquement par le monde entier.
Si  le serveur est derrière le pare-feu, il peut être utilisé pour des projets avec accès en lecture seule pour un grand nombre d'utilisateurs ou des ordinateurs (intégration continue ou serveur de compilation) pour lequels vous ne souhaitez pas avoir à gérer des clés SSH.

En tout cas, le protocole Git est relativement facile à mettre en place.
Grossièrement, il suffit de lancer la commande suivante en tant que *daemon* :

	git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

`--reuseaddr` autorise le serveur à redémarrer sans devoir attendre que les anciennes connexions expirent, l'option `--base-path` autorise les gens à cloner des projets sans devoir spécifier le chemin complet, et le chemin en fin de ligne indique au *daemon* Git l'endroit où chercher des dépôts à exporter.
Si vous utilisez un pare-feu, il sera nécessaire de rediriger le port 9418 sur la machine hébergeant le serveur.

Transformer ce processus en *daemon* se réalise par différentes manières qui dépendent du système d'exploitation sur lequel il est lancé.
Sur une machine Ubuntu, c'est un script Upstart.
Donc dans le fichier :

	/etc/event.d/local-git-daemon

vous mettez le script suivant :

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

Par sécurité, ce *daemon* devrait être lancé par un utilisateur n'ayant que des droits de lecture seule sur les dépôts — simplement en créant un nouvel utilisateur « git-ro » qui servira à lancer le *daemon*.
Par simplicité, nous le lancerons avec le même utilisateur « git » qui est utilisé par Gitosis.

Au rédémarrage de la machine, votre *daemon* Git démarrera automatiquement et redémarrera s'il meurt.
Pour le lancer sans avoir à redémarrer, vous pouvez lancer ceci :

	initctl start local-git-daemon

Sur d'autres systèmes, le choix reste large, allant de `xinetd` à un script de système `sysvinit` ou à tout autre moyen — tant que le programme est démonisé et surveillé.

Ensuite, il faut spécifier à votre serveur Gitosis les dépôts à autoriser en accès Git.
Si vous ajoutez une section pour chaque dépôt, vous pouvez indiquer ceux que vous souhaitez servir en lecture via votre *daemon* Git.
Par exemple, si vous souhaitez un accès par protocole Git à votre projet iphone, ajoutez ceci à la fin du fichier `gitosis.conf` :

	[repo iphone_projet]
	daemon = yes

Une fois cette configuration validée et poussée, votre *daemon* devrait commencer à servir des requêtes pour ce projet à toute personne ayant accès au port 9518 de votre serveur.

Si vous décidez de ne pas utiliser Gitosis, mais d'utiliser un *daemon* Git, il faudra lancer les commandes suivantes sur chaque projet que vous souhaitez faire servir par le *daemon* Git :

	$ cd /chemin/au/projet.git
	$ touch git-daemon-export-ok

La présence de ce fichier indique à Git que ce projet peut être servi sans authentification.

Gitosis peut aussi contrôler les projets que GitWeb publie.
Premièrement, il faut ajouter au fichier `/etc/gitweb.conf` quelque chose comme :

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

Vous pouvez contrôler les projets publiés sur GitWeb en ajoutant ou retirant une propriété `gitweb` au fichier de configuration de Gitosis.
Par exemple, si vous voulez que le projet iphone soit visible sur GitWeb, le paramétrage `repo` doit être le suivant :

	[repo iphone_projet]
	daemon = yes
	gitweb = yes

Maintenant, si vous validez et poussez le projet `gitosis-admin`, GitWeb commencera automatiquement à publier votre projet iphone.
