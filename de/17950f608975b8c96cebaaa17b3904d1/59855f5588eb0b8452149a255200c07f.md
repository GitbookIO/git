# Die Protokolle

<!--Git can use four major network protocols to transfer data: Local, Secure Shell (SSH), Git, and HTTP. Here we’ll discuss what they are and in what basic circumstances you would want (or not want) to use them.-->

Git kann vier wichtige Netzwerk Protokolle zum Datentransfer benutzen: Lokal, Secure Shell (SSH), Git und HTTP. Hier wollen wir diskutieren, was diese Protokolle sind und unter welchen grundlegenden Gegebenheiten Du sie benutzen möchtest (oder auch nicht).

<!--It’s important to note that with the exception of the HTTP protocols, all of these require Git to be installed and working on the server.-->

Es ist wichtig zu beachten, dass alle Protokolle mit Ausnahme von HTTP eine funktionierende Git Installation auf dem Server benötigen.

<!--## Local Protocol-->
## Lokales Protokoll

<!--The most basic is the _Local protocol_, in which the remote repository is in another directory on disk. This is often used if everyone on your team has access to a shared filesystem such as an NFS mount, or in the less likely case that everyone logs in to the same computer. The latter wouldn’t be ideal, because all your code repository instances would reside on the same computer, making a catastrophic loss much more likely.-->

Am einfachsten ist das _Lokale Protokoll_, wobei das externe Repository in einem anderen Verzeichnis auf der Festplatte ist. Das wird oft genutzt, wenn jeder aus Deinem Team Zugriff zu einem gemeinsamen Dateisystem hat, zum Beispiel ein eingebundenes NFS, oder im unwahrscheinlicheren Fall jeder loggt sich auf bei dem gleichen Computer ein. Das letztere ist nicht ideal, weil alle Code Repository Instanzen auf dem selben Computer wären, ein katastrophaler Verlust wäre wahrscheinlicher.

<!--If you have a shared mounted filesystem, then you can clone, push to, and pull from a local file-based repository. To clone a repository like this or to add one as a remote to an existing project, use the path to the repository as the URL. For example, to clone a local repository, you can run something like this:-->

Wenn Du ein gemeinsames Dateisystem eingebunden hast, kannst Du von einem lokalen Datei-basiertem Repository clonen, pushen und pullen. Um ein Repository wie dieses zu clonen, oder ein externes zu einem bestehenden Projekt hinzuzufügen, benutze den Pfad zu dem Repository als URL. Um zum Beispiel ein lokales Repository zu clonen kannst Du einen Befehl wie diesen nutzen:

	$ git clone /opt/git/project.git

<!--Or you can do this:-->

Oder Du kannst das machen:

	$ git clone file:///opt/git/project.git

<!--Git operates slightly differently if you explicitly specify `file://` at the beginning of the URL. If you just specify the path, and the source and the destination are on the same filesystem, Git tries to hardlink the objects it needs. If they are not on the same filesystem, it will copy the objects it needs using the system's standard copying functionality. If you specify `file://`, Git fires up the processes that it normally uses to transfer data over a network which is generally a lot less efficient method of transferring the data. The main reason to specify the `file://` prefix is if you want a clean copy of the repository with extraneous references or objects left out — generally after an import from another version-control system or something similar (see Chapter 9 for maintenance tasks). We’ll use the normal path here because doing so is almost always faster.-->

Git arbeitet etwas anders, wenn Du am Anfang der URL ausdrücklich `file://` angibst. Wenn Du nur den Pfad angibst, und sowohl die Quelle, als auch das Ziel sich auf dem selben Dateisystem befinden, versucht Git harte Links zu benutzen. Wenn sie sich nicht auf dem selben Dateisystem befinden, kopiert Git die benötigten Objekte mit Hilfe der Standardkopierfunktion des jeweiligen Betriebssystems. Wenn Du `file://` angibst, startet Git den Prozess, den es normalerweise zum Übertragen von Daten über ein Netzwerk verwendet, dass ist gewöhnlich eine wesentlich ineffizientere Methode zum Übertragen der Daten. Der Hauptgrund das `file://`-Präfix anzugeben ist eine saubere Kopie von dem Repository mit fremden Referenzen oder fehlenden Objekten – generell nach einem Import von einem anderen Versionskontrollsystem oder etwas ähnliches (siehe Kapitel 9 für Wartungsarbeiten). Wir benutzen hier den normalen Pfad, weil das fast immer schneller ist.

<!--To add a local repository to an existing Git project, you can run something like this:-->

Um ein lokales Repository zu einem existierenden Git Projekt hinzuzufügen, kannst Du einen Befehl wie diesen ausführen:

	$ git remote add local_proj /opt/git/project.git

<!--Then, you can push to and pull from that remote as though you were doing so over a network.-->

Dann kannst Du zu diesem externen Repository pushen und davon pullen, als würdest Du das über ein Netzwerk machen.

<!--### The Pros-->
### Die Vorteile

<!--The pros of file-based repositories are that they’re simple and they use existing file permissions and network access. If you already have a shared filesystem to which your whole team has access, setting up a repository is very easy. You stick the bare repository copy somewhere everyone has shared access to and set the read/write permissions as you would for any other shared directory. We’ll discuss how to export a bare repository copy for this purpose in the next section, “Getting Git on a Server.”-->

Die Vorteile von Datei-basierten Repositories sind die Einfachheit und das Nutzen bereits bestehender Datei-Berechtigungen und bestehendem Netzwerk-Zugriff. Wenn Du bereits ein gemeinsames Dateisystem hast, zu dem das gesamte Team Zugriff hat, ist das Einrichten eines Repositories sehr einfach. Du exportierst eine Kopie des einfachen Repositories dahin, wo jeder gemeinsamen Zugriff hat und stellst die Lese- und Schreibberechtigungen wie bei jedem anderem gemeinsamen Verzeichnis ein. Wir werden im nächsten Abschnitt „Git auf einen Server bekommen“ diskutieren, wie man die Kopie eines einfachen Repositories für diesen Zweck exportiert.

<!--This is also a nice option for quickly grabbing work from someone else’s working repository. If you and a co-worker are working on the same project and they want you to check something out, running a command like `git pull /home/john/project` is often easier than them pushing to a remote server and you pulling down.-->

Dies ist auch eine nette Möglichkeit zum schnellen Abholen von Änderungen aus dem Arbeitsverzeichnis von jemand anderem. Wenn Du und ein Kollege an dem gleichen Projekt arbeitet und ihr wollt etwas auschecken, dann ein Befehl wie `git pull /home/john/project` ist oft einfacher als das pushen zu einem externen Server und das pullen zurück.

<!--### The Cons-->
### Die Nachteile

<!--The cons of this method are that shared access is generally more difficult to set up and reach from multiple locations than basic network access. If you want to push from your laptop when you’re at home, you have to mount the remote disk, which can be difficult and slow compared to network-based access.-->

Die Nachteile von dieser Methode sind, dass ein gemeinsamer Zugriff im allgemeinen schwieriger einrichten ist und der Zugriff von mehreren Orten ist schwieriger als einfacher Netzwerk Zugriff. Wenn Du von Deinem Laptop zuhause pushen möchtest, musst Du eine entfernte Festplatte einbinden. Das kann schwierig und langsam sein, verglichen mit netzwerk-basiertem Zugriff.

<!--It’s also important to mention that this isn’t necessarily the fastest option if you’re using a shared mount of some kind. A local repository is fast only if you have fast access to the data. A repository on NFS is often slower than the repository over SSH on the same server, allowing Git to run off local disks on each system.-->

Es ist auch wichtig zu erwähnen, dass dies nicht unbedingt die schnellste Möglichkeit ist, wenn Du ein gemeinsames Dateisystem oder ähnliches hast. Ein lokales Repository ist nur dann schnell, wenn Du schnellen Zugriff auf die Daten hast. Ein NFS-basiertes Repository ist oftmals langsamer als ein Repository über SSH auf dem gleichen Server, weil Git über SSH auf jedem System auf den lokalen Festplatten arbeitet.

<!--## The SSH Protocol-->
## Das SSH Protokoll

<!--Probably the most common transport protocol for Git is SSH. This is because SSH access to servers is already set up in most places — and if it isn’t, it’s easy to do. SSH is also the only network-based protocol that you can easily read from and write to. The other two network protocols (HTTP and Git) are generally read-only, so even if you have them available for the unwashed masses, you still need SSH for your own write commands. SSH is also an authenticated network protocol; and because it’s ubiquitous, it’s generally easy to set up and use.-->

Das vermutlich gebräuchlichste Transport-Protokoll für Git ist SSH. Das hat den Grund, dass der SSH-Zugriff an den meisten Orten bereits eingerichtet ist – und wenn das nicht der Fall ist, einfach zu machen ist. SSH ist außerdem das einzige netzwerk-basierte Protokoll von dem man einfach lesen und darauf schreiben kann. Die beiden anderen Netzwerk-Protokolle (HTTP und Git) sind nur lesbar. Auch wenn sie für die breite Masse sind, brauchst Du trotzdem SSH für Deine Schreib-Befehle. SSH ist auch ein authentifiziertes Netzwerk-Protokoll, und weil es universell ist, ist es im Allgemeinen einfach einzurichten und zu benutzen.

<!--To clone a Git repository over SSH, you can specify ssh:// URL like this:-->

Um ein Git Repository über SSH zu clonen, kannst Du eine ssh:// URL angeben:

	$ git clone ssh://user@server/project.git

<!--Or you can use the shorter scp-like syntax for SSH protocol:-->

Oder Du kannst auch kein Protokoll angeben – Git nimmt SSH an, wenn Du nicht eindeutig bist:

	$ git clone user@server:project.git

<!--You can also not specify a user, and Git assumes the user you’re currently logged in as.-->

Du kannst auch keinen Benutzer angeben, und Git nimmt den Benutzer an, als der Du gerade eingeloggt bist.

<!--### The Pros-->
### Die Vorteile

<!--The pros of using SSH are many. First, you basically have to use it if you want authenticated write access to your repository over a network. Second, SSH is relatively easy to set up — SSH daemons are commonplace, many network admins have experience with them, and many OS distributions are set up with them or have tools to manage them. Next, access over SSH is secure — all data transfer is encrypted and authenticated. Last, like the Git and Local protocols, SSH is efficient, making the data as compact as possible before transferring it.-->

Die Vorteile von SSH sind vielseitig. Erstens, grundlegend musst Du es benutzen, wenn Du authentifizierten Schreib-Zugriff auf Dein Repository über ein Netzwerk haben möchtest. Zweitens, SSH ist relativ einfach einzurichten – SSH-Dämonen sind alltäglich, viele Netzwerk-Administratoren haben Erfahrungen mit ihnen und viele Betriebssysteme sind mit ihnen eingerichtet oder haben Werkzeuge um sie zu verwalten. Als nächstes, Zugriff über SSH ist sicher – der gesamte Daten-Transfer ist verschlüsselt und authentifiziert. Als letztes, wie Git und die lokalen Protokolle, SSH ist effizient, es macht die Daten so kompakt wie möglich bevor es die Daten überträgt.

<!--### The Cons-->
### Die Nachteile

<!--The negative aspect of SSH is that you can’t serve anonymous access of your repository over it. People must have access to your machine over SSH to access it, even in a read-only capacity, which doesn’t make SSH access conducive to open source projects. If you’re using it only within your corporate network, SSH may be the only protocol you need to deal with. If you want to allow anonymous read-only access to your projects, you’ll have to set up SSH for you to push over but something else for others to pull over.-->

Die negative Seite von SSH ist, dass Du Deine Repositories nicht anonym darüber anbieten kannst. Die Leute müssen Zugriff auf Deine Maschine über SSH haben um zuzugreifen, auch mit einem Nur-Lese-Zugriff, was SSH nicht zuträglich zu Open-Source-Projekten macht. Wenn Du es nur innerhalb von Deinem Firmen-Netzwerk benutzt, SSH ist vielleicht das einzige Protokoll mit dem Du arbeiten musst. Wenn Du anonymen Nur-Lese-Zugriff zu Deinen Projekten erlauben willst, musst Du SSH für Dich einsetzen um zu pushen, aber ein anderes Protokoll für andere um zu pullen.

<!--## The Git Protocol-->
## Das Git Protokoll

<!--Next is the Git protocol. This is a special daemon that comes packaged with Git; it listens on a dedicated port (9418) that provides a service similar to the SSH protocol, but with absolutely no authentication. In order for a repository to be served over the Git protocol, you must create the `git-daemon-export-ok` file — the daemon won’t serve a repository without that file in it — but other than that there is no security. Either the Git repository is available for everyone to clone or it isn’t. This means that there is generally no pushing over this protocol. You can enable push access; but given the lack of authentication, if you turn on push access, anyone on the internet who finds your project’s URL could push to your project. Suffice it to say that this is rare.-->

Als nächstes kommt das Git Protokoll. Das ist ein spezieller Dämon, der zusammen mit Git kommt. Er horcht auf einem bestimmten Port (9418), dieser Service ist vergleichbar mit dem SSH-Protokoll, aber ohne jegliche Authentifizierung. Um ein Repository über das Git Protokoll, musst Du die `git-daemon-export-ok` Datei erstellen – der Dämon bietet kein Repository ohne die Datei darin an – außer dieser Datei gibt es keine Sicherheit. Entweder das Git Repository ist für jeden zum Clonen verfügbar oder halt nicht. Das bedeutet, dass dieses Protokoll generell kein push anbietet. Du kannst push-Zugriff aktivieren; aber ohne Authentifizierung, wenn Du den push-Zugriff aktivierst, kann jeder im Internet, der Deine Projekt-URL findet, zu Deinem Projekt pushen. Ausreichend zu sagen, dass das selten ist.

<!--### The Pros-->
### Die Vorteile

<!--The Git protocol is the fastest transfer protocol available. If you’re serving a lot of traffic for a public project or serving a very large project that doesn’t require user authentication for read access, it’s likely that you’ll want to set up a Git daemon to serve your project. It uses the same data-transfer mechanism as the SSH protocol but without the encryption and authentication overhead.-->

Das Git Protokoll ist das schnellste verfügbare Transfer Protokoll. Wenn Du viel Traffic für ein öffentliches Projekt hast oder ein sehr großes Projekt hast, dass keine Benutzer-Authentifizierung für den Lese-Zugriff voraussetzt, es ist üblich einen Git Dämon einzurichten, der Dein Projekt serviert. Er benutzt den selben Daten-Transfer Mechanismus wie das SSH-Protokoll, aber ohne den Entschlüsselungs- und Authentifizierungs-Overhead.

<!--### The Cons-->
### Die Nachteile

<!--The downside of the Git protocol is the lack of authentication. It’s generally undesirable for the Git protocol to be the only access to your project. Generally, you’ll pair it with SSH access for the few developers who have push (write) access and have everyone else use `git://` for read-only access.-->
<!--It’s also probably the most difficult protocol to set up. It must run its own daemon, which is custom — we’ll look at setting one up in the “Gitosis” section of this chapter — it requires `xinetd` configuration or the like, which isn’t always a walk in the park. It also requires firewall access to port 9418, which isn’t a standard port that corporate firewalls always allow. Behind big corporate firewalls, this obscure port is commonly blocked.-->

Die Negativseite des Git Protokoll ist das Fehlen der Authentifizierung. Es ist generell unerwünscht, dass das Git Protokoll der einzige Zugang zu dem Projekt ist. Im Allgemeinen willst Du es mit SSH-Zugriff für die Entwickler paaren, die push (Schreib) Zugriff haben und jeder andere benutzt `git://` für Nur-Lese-Zugriff.
Es ist vielleicht auch das das schwierigste Protokoll beim Einrichten. Es muss ein eigener Dämon laufen, welcher Git-spezifisch ist – wir wollen im „Gitosis“-Abschnitt in diesem Kapitel schauen, wie man einen einrichtet – es setzt eine `xinetd`-Konfiguration oder ähnliches voraus, das ist nicht immer ein Spaziergang. Es setzt auch einen Firewall-Zugriff auf den Port 9418 voraus, das ist kein Standard-Port, den Firmen-Firewalls immer erlauben. Hinter einer großen Firmen-Firewall ist dieser unklare Port häufig gesperrt.

<!--## The HTTP/S Protocol-->
## Das HTTP/S Protokoll

<!--Last we have the HTTP protocol. The beauty of the HTTP or HTTPS protocol is the simplicity of setting it up. Basically, all you have to do is put the bare Git repository under your HTTP document root and set up a specific `post-update` hook, and you’re done (See Chapter 7 for details on Git hooks). At that point, anyone who can access the web server under which you put the repository can also clone your repository. To allow read access to your repository over HTTP, do something like this:-->

Als letztes haben wir das HTTP Protokoll. Das Schöne am HTTP bzw. HTTPS Protokoll ist die Einfachheit des Einrichtens. Im Grunde musst Du nur das einfach Git Repository in Dein HTTP Hauptverzeichnis legen und einen speziellen `post-update` hook (xxx) einrichten und schon bist Du fertig (siehe Kapitel 7 für Details zu Git hooks (xxx)). Jetzt kann jeder, der auf den Web-Server mit dem Repository zugreifen kann, das Repository clonen. Um Lese-Zugriff auf das Repository über HTTP zu erlauben, führe die folgenden Befehle aus:

	$ cd /var/www/htdocs/
	$ git clone --bare /path/to/git_project gitproject.git
	$ cd gitproject.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

<!--That’s all. The `post-update` hook that comes with Git by default runs the appropriate command (`git update-server-info`) to make HTTP fetching and cloning work properly. This command is run when you push to this repository over SSH; then, other people can clone via something like-->

Das ist alles. Der `post-update` hook (xxx) der standardmäßig zusammen mit Git kommt führt den richtigen Befehl aus (`git update-server-info`), damit der HTTP-Server das Repository richtig abruft und klont. Dieser Befehl läuft, wenn Du zu diesem Repository per SSH pusht, andere Leute können dann clonen mit dem Befehl

	$ git clone http://example.com/gitproject.git

<!--In this particular case, we’re using the `/var/www/htdocs` path that is common for Apache setups, but you can use any static web server — just put the bare repository in its path. The Git data is served as basic static files (see Chapter 9 for details about exactly how it’s served).-->

In diesem besonderen Fall benutzen Dir den `/var/www/htdocs`-Pfad, der typisch für Apache-Setups ist, aber Du kannst jeden statischen Web-Server benutzen – nur das einfache Repository in den richtigen Ordner legen. Die Git-Daten werden als einfache statische Dateien serviert (siehe Kapitel 9 für Details, wie es genau serviert wird).

<!--It’s possible to make Git push over HTTP as well, although that technique isn’t as widely used and requires you to set up complex WebDAV requirements. Because it’s rarely used, we won’t cover it in this book. If you’re interested in using the HTTP-push protocols, you can read about preparing a repository for this purpose at `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`. One nice thing about making Git push over HTTP is that you can use any WebDAV server, without specific Git features; so, you can use this functionality if your web-hosting provider supports WebDAV for writing updates to your web site.-->

Es ist möglich, Git-Daten auch über HTTP zu pushen, trotzdem wird diese Technik nicht oft eingesetzt und es setzt komplexe WebDAV-Anforderungen voraus. Weil es selten genutzt wird, werden wir das nicht in diesem Buch behandeln. Wenn Du Interesse am HTTP-Push-Protokoll hast, kannst Du das Einrichten unter `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt` nachlesen. Eine Schöne Sache über Git-Push über HTTP ist, dass Du jeden WebDAV-Server benutzen kannst, ohne spezifische Git-Features; also kannst Du diese Funktionalität nutzen, wenn Dein Web-Hosting-Provider WebDAV unterstützt, um Änderungen auf Deine Webseite zu schreiben.

<!--### The Pros-->
### Die Vorteile

<!--The upside of using the HTTP protocol is that it’s easy to set up. Running the handful of required commands gives you a simple way to give the world read access to your Git repository. It takes only a few minutes to do. The HTTP protocol also isn’t very resource intensive on your server. Because it generally uses a static HTTP server to serve all the data, a normal Apache server can serve thousands of files per second on average — it’s difficult to overload even a small server.-->

Die Positivseite beim Benutzen des HTTP-Protokolls ist, dass es einfach einzurichten ist. Das Ausführen von einer Handvoll notwendiger Befehle ist ein einfacher Weg, um der Welt Lese-Zugriff auf Dein Git-Repository zu geben. Es braucht nur ein paar Minuten. Das HTTP Protokoll benötigt auch nicht viele Ressourcen auf Deinem Server. Es braucht generell nur einen statischen Server um die Daten zu auszuliefern. Ein normaler Apache-Server kann Tausende von Dateien pro Sekunde servieren – es ist schwierig selbst einen kleinen Server zu überlasten.

<!--You can also serve your repositories read-only over HTTPS, which means you can encrypt the content transfer; or you can go so far as to make the clients use specific signed SSL certificates. Generally, if you’re going to these lengths, it’s easier to use SSH public keys; but it may be a better solution in your specific case to use signed SSL certificates or other HTTP-based authentication methods for read-only access over HTTPS.-->

Du kannst Deine Repositories auch als Nur-Lese-Repositories über HTTPS servieren, Du kannst also den Daten-Transfer verschlüsseln. Oder Du kannst so weit gehen, dass die Clients spezifische signierte SSL-Zertifikate benutzen. Im Allgemeinen, wenn Du soweit gehst, ist es einfacher öffentliche SSH-Schlüssel zu benutzen; aber es ist vielleicht für Deinen Fall eine bessere Lösung, signierte SSL-Zertifikate zu benutzen oder andere HTTP-basierte Authentifizierungs-Methoden für Nur-Lese-Zugriff über HTTPS zu benutzen.

<!--Another nice thing is that HTTP is such a commonly used protocol that corporate firewalls are often set up to allow traffic through this port.-->

Eine andere schöne Sache ist, dass HTTP so oft genutzt wird, dass Firmen-Firewalls oft Traffic über den HTTP-Port erlauben.

<!--### The Cons-->
### Die Nachteile

<!--The downside of serving your repository over HTTP is that it’s relatively inefficient for the client. It generally takes a lot longer to clone or fetch from the repository, and you often have a lot more network overhead and transfer volume over HTTP than with any of the other network protocols. Because it’s not as intelligent about transferring only the data you need — there is no dynamic work on the part of the server in these transactions — the HTTP protocol is often referred to as a _dumb_ protocol. For more information about the differences in efficiency between the HTTP protocol and the other protocols, see Chapter 9.-->

Die Unterseite vom Servieren von Deinem Repository über HTTP ist, dass es recht ineffizient für den Client ist. Es braucht im Allgemeinen länger zu clonen oder Daten vom Repository zu holen und Du hast oft wesentlich mehr Netzwerk-Overhead und Transfer-Volumen als mit jedem anderen Netzwerk Protokoll. Weil es nicht so intelligent beim Daten-Transfer ist, um nur die benötigten Daten zu übertragen – es gibt keine dynamische Arbeit auf dem Server bei diesen Aktionen – das HTTP Protokoll wird oft als _dummes_ Protokoll bezeichnet. Für mehr Informationen über die Unterschiede bei der Effizienz zwischen dem HTTP Protokoll und den anderen Protokollen: siehe Kapitel 9.

<!--# Getting Git on a Server-->