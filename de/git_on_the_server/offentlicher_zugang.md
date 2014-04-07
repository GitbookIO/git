# Öffentlicher Zugang

<!--What if you want anonymous read access to your project? Perhaps instead of hosting an internal private project, you want to host an open source project. Or maybe you have a bunch of automated build servers or continuous integration servers that change a lot, and you don’t want to have to generate SSH keys all the time — you just want to add simple anonymous read access.-->

Was ist, wenn Du anonymen Lese-Zugriff zu Deinem Projekt ermöglichen möchtest? Vielleicht möchtest Du ein Open-Source Projekt, anstatt einem privaten, nicht öffentlichen Projekt hosten. Oder Du hast ein paar automatisierte Build-Server oder Continuous Integration Server, die ständig wechseln, und Du möchtest für diese nicht dauernd neue SSH-Schlüssel generieren. Dann wäre es doch schön, wenn ein anonymer Lese-Zugriff zu Deinem Projekt möglich wäre.

<!--Probably the simplest way for smaller setups is to run a static web server with its document root where your Git repositories are, and then enable that `post-update` hook we mentioned in the first section of this chapter. Let’s work from the previous example. Say you have your repositories in the `/opt/git` directory, and an Apache server is running on your machine. Again, you can use any web server for this; but as an example, we’ll demonstrate some basic Apache configurations that should give you an idea of what you might need.-->

Der wahrscheinlich einfachste Weg für kleinere Konfigurationen ist, einen Webserver, in dessen Basisverzeichnis die Git Repositorys liegen, laufen zu lassen und den `post-update` Hook, den wir im ersten Abschnitt dieses Kapitels erwähnt haben, zu aktivieren. Gehen wir vom vorherigen Beispiel aus. Sagen wir, Du hast Deine Repositorys im Verzeichnis `/opt/git` und ein Apache-Server läuft auf Deiner Maschine. Du kannst dafür jeden beliebigen Webserver benutzen, aber in diesem Beispiel demonstrieren wir das Ganze an Hand einer Apache Basis-Konfiguration. Dies sollte Dir eine Vorstellung geben, wie Du es mit dem Webserver Deiner Wahl umsetzen kannst.

<!--First you need to enable the hook:-->

Zuerst musst Du den Hook aktivieren:

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

<!--If you’re using a version of Git earlier than 1.6, the `mv` command isn’t necessary — Git started naming the hooks examples with the .sample postfix only recently.-->

Wenn Du eine ältere Git Version als 1.6 benutzt, brauchst Du den `mv`-Befehl nicht auszuführen. Das Namensschema mit der .sample Endung wurde erst bei den neueren Git Versionen eingeführt.

<!--What does this `post-update` hook do? It looks basically like this:-->

Welche Aufgabe hat der `post-update` Hook? Er enthält in etwa folgendes:

	$ cat .git/hooks/post-update
	#!/bin/sh
	#
	# An example hook script to prepare a packed repository for use over
	# dumb transports.
	#
	# To enable this hook, rename this file to "post-update".
	#
	
	exec git-update-server-info

<!--This means that when you push to the server via SSH, Git will run this command to update the files needed for HTTP fetching.-->

Wenn Du via SSH etwas auf den Server hochlädst, wird Git den Befehl `git-update-server-info` ausführen. Dieser Befehl aktualisiert alle Dateien, die benötigt werden, damit das Repository über HTTP geholt (fetch) beziehungsweise geklont werden kann.

<!--Next, you need to add a VirtualHost entry to your Apache configuration with the document root as the root directory of your Git projects. Here, we’re assuming that you have wildcard DNS set up to send `*.gitserver` to whatever box you’re using to run all this:-->

Als nächstes musst Du einen VirtualHost Eintrag zu Deiner Apache-Konfiguration hinzufügen. Das dort angegebene DocumentRoot Verzeichnis muss mit dem Basisverzeichnis Deiner Git Projekte übereinstimmen. In diesem Beispiel gehen wir davon aus, dass ein Wildcard-DNS Eintrag besteht, der dafür sorgt, dass `*.gitserver` auf den Server zeigt, auf dem das Ganze hier läuft:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

<!--You’ll also need to set the Unix user group of the `/opt/git` directories to `www-data` so your web server can read-access the repositories, because the Apache instance running the CGI script will (by default) be running as that user:-->

Da die Apache-Instanz, die das CGI-Skript ausführt, standardmäßig unter dem Benutzer `www-data` läuft, musst Du auch die Unix Eigentümer-Gruppe des Verzeichnisses `/opt/git` auf `www-data` setzen. Ansonsten kann Dein Webserver die Repositorys nicht lesen:

	$ chgrp -R www-data /opt/git

<!--When you restart Apache, you should be able to clone your repositories under that directory by specifying the URL for your project:-->

Nach einem Neustart des Apache, solltest Du in der Lage sein, Deine Repositorys innerhalb diesem Verzeichnis zu klonen, indem Du die URL für das jeweilige Projekt angibst.

	$ git clone http://git.gitserver/project.git

<!--This way, you can set up HTTP-based read access to any of your projects for a fair number of users in a few minutes. Another simple option for public unauthenticated access is to start a Git daemon, although that requires you to daemonize the process - we’ll cover this option in the next section, if you prefer that route.-->

Auf diese Art und Weise kannst Du in wenigen Minuten einen HTTP-basierten Lese-Zugriff auf all Deine Projekte für eine große Anzahl von Benutzern ermöglichen. Ein Git Daemon ist eine andere einfache Möglichkeit für einen öffentlichen Zugang. Wenn Du diese Methode bevorzugst, solltest Du Dir den nächsten Abschnitt unbedingt anschauen.

<!--# GitWeb-->