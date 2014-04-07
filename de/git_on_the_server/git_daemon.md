# Git Daemon

<!--For public, unauthenticated read access to your projects, you’ll want to move past the HTTP protocol and start using the Git protocol. The main reason is speed. The Git protocol is far more efficient and thus faster than the HTTP protocol, so using it will save your users time.-->

Wenn Du anonymen, öffentlichen Lesezugriff für Deine Repositorys zur Verfügung stellen willst, solltest Du Dir mal das Git Protokoll, als Ersatz für das HTTP Protokoll anschauen. Der Hauptgrund dafür ist die Geschwindigkeit. Das Git Protokoll ist weitaus effizienter und deshalb viel schneller als das HTTP Protokoll. Wenn Du Deinen Anwendern Zeit ersparen willst, solltest Du es zur Verfügung stellen.

<!--Again, this is for unauthenticated read-only access. If you’re running this on a server outside your firewall, it should only be used for projects that are publicly visible to the world. If the server you’re running it on is inside your firewall, you might use it for projects that a large number of people or computers (continuous integration or build servers) have read-only access to, when you don’t want to have to add an SSH key for each.-->

Ich möchte Dich noch mal darauf hinweisen, dass das Git Protokoll nur für anonymen (also ohne Authentifizierung) Lesezugriff geeignet ist. Wenn Du einen öffentlichen Server betreibst, sollte das Git Protokoll nur für Projekte eingesetzt werden, die öffentlich für den Rest einsehbar sein sollen. Innerhalb Deines eigenen Netzwerks, welches mit einer Firewall abgeschottet ist, ist es sinnvoll, da Du mit dem Git Protokoll einer großen Anzahl von Benutzern und Computern (Continuous Integration oder Build-Server), Lesezugriff zur Verfügung stellen kannst, ohne dass Du für jeden einzelnen Nutzer ein SSH Schlüssel verwalten musst.

<!--In any case, the Git protocol is relatively easy to set up. Basically, you need to run this command in a daemonized manner:-->

Auf jeden Fall ist es sehr einfach das Git Protokoll einzurichten. Im Prinzip musst Du nur folgendes tun:

	git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

<!--`-\-reuseaddr` allows the server to restart without waiting for old connections to time out, the `-\-base-path` option allows people to clone projects without specifying the entire path, and the path at the end tells the Git daemon where to look for repositories to export. If you’re running a firewall, you’ll also need to punch a hole in it at port 9418 on the box you’re setting this up on.-->

Mit `--reuseaddr` teilst Du dem Server mit, dass ein Neustart sofort durchgeführt werden kann, ohne darauf zu warten, dass alte, offene Verbindungen mit einem Timeout abbrechen. Die Option `--base-path` erlaubt es den Nutzern, Projekte zu klonen, ohne den gesamten Pfad angeben zu müssen. Die Pfadangabe als letztes Argument gibt dem Daemon an, wo sich die zu exportierenden Repositorys befinden. Wenn Du eine Firewall eingerichtet hast, musst Du zusätzlich den Port 9418 freischalten.

<!--You can daemonize this process a number of ways, depending on the operating system you’re running. On an Ubuntu machine, you use an Upstart script. So, in the following file-->

Du kannst den Hintergrunddienst für diesen Prozess auf verschiedene Art und Weise einrichten. Das ist natürlich abhängig vom verwendeten Betriebssystem. Auf einem Ubuntu System kannst Du dazu ein Upstart Skript verwenden. Zum Beispiel fügst Du in der folgenden Datei

	/etc/event.d/local-git-daemon

<!--you put this script:-->

das folgende Skript ein (Achtung: In neueren Ubuntu-Versionen lautet der Pfad /etc/init):

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

<!--For security reasons, it is strongly encouraged to have this daemon run as a user with read-only permissions to the repositories — you can easily do this by creating a new user 'git-ro' and running the daemon as them.  For the sake of simplicity we’ll simply run it as the same 'git' user that Gitosis is running as.-->

Aus Sicherheitsgründen wird dringend empfohlen, dass dieser Daemon als Benutzer ausgeführt wird, welcher nur Lesezugriff auf die betreffenden Repositorys hat. Du stellst das auf einfache Art und Weise sicher, indem Du einen neuen Benutzer ‚git-ro‘ erstellst und den Daemon mit diesem ausführst. Einfachheitshalber verwenden wir hier den Benutzer ‚git‘, den wir auch schon für Gitosis verwendet haben.

<!--When you restart your machine, your Git daemon will start automatically and respawn if it goes down. To get it running without having to reboot, you can run this:-->

Nach einem Neustart des System wird der Git Daemon automatisch starten. Er startet ebenso neu, wenn er unerwartet beendet wird. Der Daemon kann auch ohne einen Neustart gestartet werden:

	initctl start local-git-daemon

<!--On other systems, you may want to use `xinetd`, a script in your `sysvinit` system, or something else — as long as you get that command daemonized and watched somehow.-->

Auf anderen Systemen kannst Du `xinetd`, ein Skript in der `sysvinit`-Umgebung oder irgendetwas anderes verwenden. Du musst nur sicherstellen, dass der Befehl als Hintergrunddienst ausgeführt wird.

<!--Next, you have to tell your Gitosis server which repositories to allow unauthenticated Git server-based access to. If you add a section for each repository, you can specify the ones from which you want your Git daemon to allow reading. If you want to allow Git protocol access for the `iphone_project`, you add this to the end of the `gitosis.conf` file:-->

Als nächstes musst Du dem Gitosis Server mitteilen, für welche Repositorys ein anonymer Zugriff über das Git Protokoll möglich sein soll. Für jedes einzelne Repository kannst Du individuell festlegen, ob der Git Daemon auf dieses Zugriff haben soll. Wenn Du beispielsweise das Git Protokoll für das Projekt `iphone_project` erlauben willst, kannst Du folgendes am Ende der Konfigurationsdatei `gitosis.conf` einfügen:

	[repo iphone_project]
	daemon = yes

<!--When that is committed and pushed up, your running daemon should start serving requests for the project to anyone who has access to port 9418 on your server.-->

Nachdem Du dies eingecheckt und gepusht hast, sollte Dein im Hintergrund laufender Git Daemon die Anfragen aller Benutzer, die Zugriff auf den Port 9418 haben, bearbeiten.

<!--If you decide not to use Gitosis, but you want to set up a Git daemon, you’ll have to run this on each project you want the Git daemon to serve:-->

Wenn Du Dich gegen Gitosis entschieden hast, aber trotzdem dem Git Daemon verwenden willst, musst Du auf dem Server für jedes Projekt, welches der Git Daemon zur Verfügung stellen soll, folgendes ausführen:

	$ cd /path/to/project.git
	$ touch git-daemon-export-ok

<!--The presence of that file tells Git that it’s OK to serve this project without authentication.-->

Wenn diese Datei existiert, erlaubt Git einen anonymen Lesezugriff auf dieses Projekt.

<!--Gitosis can also control which projects GitWeb shows. First, you need to add something like the following to the `/etc/gitweb.conf` file:-->

In Gitosis kann man ebenso einstellen, welche Projekte in GitWeb dargestellt werden sollen. Dazu musst Du als erstes in etwa folgendes in die Konfigurationsdatei `/etc/gitweb.conf` einfügen:

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

<!--You can control which projects GitWeb lets users browse by adding or removing a `gitweb` setting in the Gitosis configuration file. For instance, if you want the `iphone_project` to show up on GitWeb, you make the `repo` setting look like this:-->

Um für die einzelnen Projekte festzulegen, dass diese in GitWeb auftauchen, musst Du die Einstellung `gitweb` in der Gitosis Konfigurationsdatei festlegen. Wenn Du beispielsweise willst, dass das Repository `iphone_project` in GitWeb erscheint, muss die Einstellung `repo` in etwa folgendermaßen aussehen:

	[repo iphone_project]
	daemon = yes
	gitweb = yes

<!--Now, if you commit and push the project, GitWeb will automatically start showing the `iphone_project`.-->

Das Projekt `iphone_projekt` wird automatisch in GitWeb angezeigt, sobald Du die Änderungen eingecheckt und auf den Server gepusht hast.

<!--# Hosted Git-->