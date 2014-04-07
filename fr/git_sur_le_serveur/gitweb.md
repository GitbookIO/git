# GitWeb

Après avoir réglé les accès de base en lecture/écriture et en lecture seule pour vos projets, vous souhaiterez peut-être mettre en place une interface web simple de visualisation.
Git fournit un script CGI appelé GitWeb qui est souvent utilisé à cette fin.
Vous pouvez voir GitWeb en action sur des sites tels que `http://git.kernel.org` (voir figure 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)

Figure 4-1. L'interface web de visualisation GitWeb.

Si vous souhaitez vérifier à quoi GitWeb ressemblerait pour votre projet, Git fournit une commande pour démarrer une instance temporaire de serveur si vous avez un serveur léger tel que `lighttpd` ou `webrick` sur votre système.
Sur les machines Linux, `lighttpd` est souvent pré-installé et vous devriez pouvoir le démarrer en tapant `git instaweb` dans votre répertoire de travail.
Si vous utilisez un Mac, Ruby est installé de base avec Léopard, donc `webrick` est une meilleure option.
Pour démarrer `instaweb` avec un gestionnaire autre que lighttpd, vous pouvez le lancer avec l'option `--httpd`.

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Cette commande démarre un serveur HTTP sur le port 1234 et lance automatique un navigateur Internet qui ouvre la page d'accueil.
C'est vraiment très simple.
Pour arrêter le serveur, il suffit de lancer la même commande, mais avec l'option `--stop` :

	$ git instaweb --httpd=webrick --stop

Si vous souhaitez fournir l'interface web en permanence sur le serveur pour votre équipe ou pour un projet opensource que vous hébergez, il sera nécessaire d'installer le script CGI pour qu'il soit appelé par votre serveur web.
Quelques distributions Linux ont un package `gitweb` qu'il suffira d'installer via `apt` ou `yum`, ce qui est une possibilité.
Nous détaillerons tout de même rapidement l'installation manuelle de GitWeb.
Premièrement, le code source de Git qui fournit GitWeb est nécessaire pour pouvoir générer un script CGI personnalisé :

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb
	$ sudo cp -Rf gitweb /var/www/

Notez que vous devez indiquer où trouver les dépôts Git au moyen de la variable `GITWEB_PROJECTROOT`.
Maintenant, il faut paramétrer dans Apache l'utilisation de CGI pour ce script, en spécifiant un nouveau VirtualHost :

	<VirtualHost *:80>
	    ServerName gitserveur
	    DocumentRoot /var/www/gitweb
	    <Directory /var/www/gitweb>
	        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
	        AllowOverride All
	        order allow,deny
	        Allow from all
	        AddHandler cgi-script cgi
	        DirectoryIndex gitweb.cgi
	    </Directory>
	</VirtualHost>

Une fois de plus, GitWeb peut être géré par tout serveur web capable de prendre en charge CGI.
La mise en place ne devrait pas être plus difficile avec un autre serveur.
Après redémarrage du serveur, vous devriez être capable de visiter `http://gitserveur/` pour visualiser vos dépôts en ligne et de cloner et tirer depuis ces dépôts par HTTP sur `http://git.gitserveur`.
