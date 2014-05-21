# GitWeb

<!--Now that you have basic read/write and read-only access to your project, you may want to set up a simple web-based visualizer. Git comes with a CGI script called GitWeb that is commonly used for this. You can see GitWeb in use at sites like `http://git.kernel.org` (see Figure 4-1).-->

Da Du jetzt sowohl einen einfachen Lese- und Schreibzugriff, als auch einen schreibgeschützten Zugang auf Dein Projekt hast, wird es jetzt Zeit eine simple webbasierte Visualisierung dafür einzurichten. Git wird mit einem CGI-Skript namens GitWeb ausgeliefert, welches für diese Aufgabe häufig verwendet wird. Auf Seiten, wie zum Beispiel `http://git.kernel.org`, kannst Du Dir GitWeb in Aktion anschauen (siehe Abbildung 4-1).

<!--Figure 4-1. The GitWeb web-based user interface.-->


![](http://git-scm.com/figures/18333fig0401-tn.png)

Abbildung 4-1. Die webbasierte Benutzeroberfläche von GitWeb.

<!--If you want to check out what GitWeb would look like for your project, Git comes with a command to fire up a temporary instance if you have a lightweight server on your system like `lighttpd` or `webrick`. On Linux machines, `lighttpd` is often installed, so you may be able to get it to run by typing `git instaweb` in your project directory. If you’re running a Mac, Leopard comes preinstalled with Ruby, so `webrick` may be your best bet. To start `instaweb` with a non-lighttpd handler, you can run it with the `-\-httpd` option.-->

Wenn Du Dir anschauen möchtest, wie GitWeb bei Deinem Projekt ausschauen würde, gibt es dafür eine einfache Möglichkeit. Wenn Du einen einfachen Webserver wie `lighttpd` or `webrick` auf Deinem Server installiert hast, kannst Du mit einem in Git integrierten Kommando eine temporäre Instanz von GitWeb starten. Da `lighttpd` auf vielen Linux Rechnern bereits installiert ist, kannst Du versuchen ihn zum Laufen zu bringen, indem Du das Kommando  `git instaweb` in Deinem Projektverzeichnis ausführst. Bei Mac OS X 10.5 alias Leopard ist Ruby bereits vorinstalliert. Falls Du also einen Mac verwendest, solltest Du es mal mit `webrick` versuchen. Um `instaweb` mit einem anderen Webserver als `lighthttpd` zu starten, kannst Du an den Befehl die Option `--httpd` anhängen.

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

<!--That starts up an HTTPD server on port 1234 and then automatically starts a web browser that opens on that page. It’s pretty easy on your part. When you’re done and want to shut down the server, you can run the same command with the `-\-stop` option:-->

Dadurch wird auf dem Port 1234 ein HTPPD Server gestartet. Gleichzeitig wird automatisch Dein Webbrowser mit der entsprechenden Seite geöffnet. Das Ganze gestaltet sich also ziemlich einfach. Wenn Du dann fertig bist und den Server wieder beenden willst, kannst Du das gleiche Kommando mit der Option `--stop` ausführen:

	$ git instaweb --httpd=webrick --stop

<!--If you want to run the web interface on a server all the time for your team or for an open source project you’re hosting, you’ll need to set up the CGI script to be served by your normal web server. Some Linux distributions have a `gitweb` package that you may be able to install via `apt` or `yum`, so you may want to try that first. We’ll walk though installing GitWeb manually very quickly. First, you need to get the Git source code, which GitWeb comes with, and generate the custom CGI script:-->

Wenn Du das Web Interface für Dein Team oder ein von Dir gehostetes Open-Source Projekt dauerhaft zur Verfügung stellen willst, musst Du das CGI-Skript so einrichten, dass es von Deinem normalen Webserver zur Verfügung gestellt werden kann. Bei manchen Linux Distributionen ist ein `gitweb` Paket enthalten, welches Du via `apt` oder `yum` installieren kannst. Vielleicht probierst Du das einfach mal zuerst aus. Wir werden hier nämlich die manuelle Installation von GitWeb nur kurz überfliegen. Zum Starten benötigst Du den Git Quellcode. Dort ist GitWeb enthalten und Du kannst damit Dein angepasstest CGI-Skript erstellen:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb
	$ sudo cp -Rf gitweb /var/www/

<!--Notice that you have to tell the command where to find your Git repositories with the `GITWEB_PROJECTROOT` variable. Now, you need to make Apache use CGI for that script, for which you can add a VirtualHost:-->

Bitte beachte, dass Du dem Kommando angeben musst, wo sich Deine Git Repositorys befinden. Dazu wird die `GITWEB_PROJECTROOT` Variable verwendet. Jetzt musst Du den Apache noch so konfigurieren, dass er CGI für das Skript verwendet. Dazu kannst Du einen VirtualHost einrichten:

	<VirtualHost *:80>
	    ServerName gitserver
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

<!--Again, GitWeb can be served with any CGI capable web server; if you prefer to use something else, it shouldn’t be difficult to set up. At this point, you should be able to visit `http://gitserver/` to view your repositories online, and you can use `http://git.gitserver` to clone and fetch your repositories over HTTP.-->

Ich möchte Dich noch einmal darauf hinweisen, dass GitWeb prinzipiell mit jedem CGI-fähigen Webserver funktioniert. Wenn Du einen anderen Webserver bevorzugst, sollte es also kein Problem sein, GitWeb dafür einzurichten. Nach einem Neustart Deines Apache solltest Du jetzt in der Lage sein, Deine Repositorys über die Adresse `http://gitserver/` in GitWeb anzuschauen. Gleichzeitig kannst Du über `http://git.gitserver` Deine Repositorys per HTTP klonen und abholen (im Sinne eines Fetch).

<!--# Gitosis-->