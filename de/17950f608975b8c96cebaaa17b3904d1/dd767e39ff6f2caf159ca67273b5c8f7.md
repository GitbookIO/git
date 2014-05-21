# Gitosis

<!--Keeping all users’ public keys in the `authorized_keys` file for access works well only for a while. When you have hundreds of users, it’s much more of a pain to manage that process. You have to shell onto the server each time, and there is no access control — everyone in the file has read and write access to every project.-->

Das manuelle Verwalten der öffentlichen Benutzerschlüssel in der Datei `authorized_keys` ist auf Dauer nicht sinnvoll. Wenn Du hunderte von Benutzer verwalten musst, wird dieser Prozess noch viel schwieriger und macht keinen Spaß mehr. Du musst jedes mal über die Shell auf Deinen Server zugreifen und es gibt auch keine Zugriffsberechtigungen. Jeder der in der `authorized_keys` Datei eingetragen ist, hat auf jedes Projekt Lese- und Schreibzugriff.

<!--At this point, you may want to turn to a widely used software project called Gitosis. Gitosis is basically a set of scripts that help you manage the `authorized_keys` file as well as implement some simple access controls. The really interesting part is that the UI for this tool for adding people and determining access isn’t a web interface but a special Git repository. You set up the information in that project; and when you push it, Gitosis reconfigures the server based on that, which is cool.-->

Vielleicht ist es deshalb sinnvoll, dass Du Dich mit dem weit verbreiteten Projekt Gitosis beschäftigst. Gitosis ist im Grunde eine Sammlung von Skripts, die Dir dabei helfen, sowohl die Datei `authorized_keys` zu verwalten, als auch ein paar einfache Zugriffsberechtigungen zu setzen. Das wirklich interessante an diesem Werkzeug ist es, dass die Benutzeroberfläche zum Hinzufügen von Benutzern oder Setzen von Berechtigungen, kein Web Interface ist, sondern ein spezielles Git Repository. Die ganzen Informationen werden in diesem Projekt verwaltet und sobald dieses gepusht wird, konfiguriert Gitosis den Server auf Basis dieser Daten entsprechend um. Das ist ziemlich cool, oder?

<!--Installing Gitosis isn’t the simplest task ever, but it’s not too difficult. It’s easiest to use a Linux server for it — these examples use a stock Ubuntu 8.10 server.-->

Die Installation von Gitosis ist nicht einfach, aber auf jeden Fall machbar. Am einfachsten gestaltet sich die Installation auf einem Linux Server. In unserem Beispiel verwenden wir dafür einen Standard Ubuntu Server in der Version 8.10.

<!--Gitosis requires some Python tools, so first you have to install the Python setuptools package, which Ubuntu provides as python-setuptools:-->

Gitosis setzt einige Python Werkzeuge voraus. Deshalb solltest Du zuerst das Python Setuptools Paket installieren. Unter Ubuntu wird es als python-setuptools zur Verfügung gestellt:

	$ apt-get install python-setuptools

<!--Next, you clone and install Gitosis from the project’s main site:-->

Danach klonst Du Gitosis von der offiziellen Projektseite und installierst es:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

<!--That installs a couple of executables that Gitosis will use. Next, Gitosis wants to put its repositories under `/home/git`, which is fine. But you have already set up your repositories in `/opt/git`, so instead of reconfiguring everything, you create a symlink:-->

Einige ausführbare Dateien, welche von Gitosis benötigt werden, werden mit dem Skript installiert. Außerdem will Gitosis seine Repositorys im Verzeichnis `/home/git` ablegen. Das ist auch ok so. Allerdings liegen unsere Repositorys bereits im Verzeichnis `/opt/git`, aber anstatt alles umzukonfigurieren, erstellst Du einfach eine symbolische Verknüpfung (symlink):

	$ ln -s /opt/git /home/git/repositories

<!--Gitosis is going to manage your keys for you, so you need to remove the current file, re-add the keys later, and let Gitosis control the `authorized_keys` file automatically. For now, move the `authorized_keys` file out of the way:-->

Gitosis wird Deine Schlüssel für Dich verwalten. Deshalb musst Du die bereits vorhandene Datei `authorized_keys` entfernen, die Schlüssel später wieder hinzufügen und Gitosis die automatisierte Verarbeitung dieser Datei überlassen. Zuerst musst Du also die Datei `authorized_keys` aus dem Weg räumen:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

<!--Next you need to turn your shell back on for the 'git' user, if you changed it to the `git-shell` command. People still won’t be able to log in, but Gitosis will control that for you. So, let’s change this line in your `/etc/passwd` file-->

Wenn Du für den Benutzer ‚git‘ die Shell auf die `git-shell` gesetzt hast (siehe Kapitel 4.4), musst Du die normale Shell für diesen Benutzer wieder aktivieren. Den Benutzern wird es danach immer noch nicht möglich sein sich einzuloggen, dafür sorgt Gitosis. Ändere also in Deiner `/etc/passwd` die Zeile

	git:x:1000:1000::/home/git:/usr/bin/git-shell

<!--back to this:-->

zurück in folgendes:

	git:x:1000:1000::/home/git:/bin/sh

<!--Now it’s time to initialize Gitosis. You do this by running the `gitosis-init` command with your personal public key. If your public key isn’t on the server, you’ll have to copy it there:-->

Jetzt wird es Zeit Gitosis zu initialisieren. Dafür musst Du das Kommando `gitosis-init` mit Deinem öffentlichen Schlüssel ausführen. Wenn sich Dein öffentlicher Schlüssel nicht auf dem Server befindet, musst Du ihn vorher dorthin kopieren:

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

<!--This lets the user with that key modify the main Git repository that controls the Gitosis setup. Next, you have to manually set the execute bit on the `post-update` script for your new control repository.-->

Dem Benutzer, mit dem hier angegeben Schlüssel, ist es jetzt möglich, das Git Repository, mit dem Gitosis konfiguriert wird, zu modifizieren. Als nächstes musst Du manuell das Execute-Bit für das Skript `post-update` in Deinem neuen „Verwaltungs“-Repository setzen.

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

<!--You’re ready to roll. If you’re set up correctly, you can try to SSH into your server as the user for which you added the public key to initialize Gitosis. You should see something like this:-->

Jetzt kann es losgehen. Wenn Du alles richtig eingerichtet hast, kannst Du jetzt versuchen Dich über SSH einzuloggen. Du musst dafür den Benutzer verwenden, dem der öffentliche Schlüssel gehört, den Du in den vorherigen Schritten hinzugefügt hast. Du solltest dann in etwa folgende Ausgabe erhalten:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	ERROR:gitosis.serve.main:Need SSH_ORIGINAL_COMMAND in environment.
	  Connection to gitserver closed.

<!--That means Gitosis recognized you but shut you out because you’re not trying to do any Git commands. So, let’s do an actual Git command — you’ll clone the Gitosis control repository:-->

Das bedeutet das Gitosis Dich als Benutzer kennt, aber Dich ausschließt, weil Du nicht versuchst ein Git Kommando auszuführen. Lass uns also ein Git Kommando ausprobieren. Wir klonen dazu das Verwaltungsrepository von Gitosis:

	# on your local computer
	$ git clone git@gitserver:gitosis-admin.git

<!--Now you have a directory named `gitosis-admin`, which has two major parts:-->

Jetzt hast Du auf Deinem Rechner ein Verzeichnis mit dem Namen `gitosis-admin`. Dieses besteht aus hauptsächlich zwei Teilen:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

<!--The `gitosis.conf` file is the control file you use to specify users, repositories, and permissions. The `keydir` directory is where you store the public keys of all the users who have any sort of access to your repositories — one file per user. The name of the file in `keydir` (in the previous example, `scott.pub`) will be different for you — Gitosis takes that name from the description at the end of the public key that was imported with the `gitosis-init` script.-->

Mit Hilfe der Datei `gitosis.conf` kannst Du die Benutzer, Repositorys und die Zugriffsrechte festlegen. Im Verzeichnis `keydir` werden alle öffentlichen Schlüssel der Benutzer abgelegt, die einen Zugriff auf Deine Repositorys haben sollen und zwar für jeden Benutzer eine einzelne Datei. Der Name der Datei, die sich jetzt bereits im `keydir` Verzeichnis befindet (in diesem Beispiel ist es `scott.pub`), wird bei Dir anders lauten. Die Beschreibung, die sich am Ende des öffentlichen Schlüssels befindet, der beim initialen Import mit dem Skript `gitosis-init` angegeben wurde, wird von Gitosis als Dateiname verwendet.

<!--If you look at the `gitosis.conf` file, it should only specify information about the `gitosis-admin` project that you just cloned:-->

Wenn Du Dir die Datei `gitosis.conf` anschaust, sollten lediglich Daten für das Projekt `gitosis-admin` enthalten sein. `gitosis-admin` ist das Projekt, welches Du gerade geklont hast.

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	members = scott
	writable = gitosis-admin

<!--It shows you that the 'scott' user — the user with whose public key you initialized Gitosis — is the only one who has access to the `gitosis-admin` project.-->

In dieser Datei wird Dir angezeigt, dass nur der Benutzer ‚scott‘ — das ist der Anwender mit dessen öffentlichen Schlüssel Gitosis initialisiert wurde — Zugriff auf das Projekt `gitosis-admin` hat.

<!--Now, let’s add a new project for you. You’ll add a new section called `mobile` where you’ll list the developers on your mobile team and projects that those developers need access to. Because 'scott' is the only user in the system right now, you’ll add him as the only member, and you’ll create a new project called `iphone_project` to start on:-->

Lass uns jetzt für Dich ein neues Projekt hinzufügen. Dazu fügen wir eine neue Sektion mit dem Namen `mobile` hinzu, in der wir alle Teammitglieder aus dem „Mobile“-Team und alle Repositorys, die von Ihnen benötigt werden, auflisten. Da ‚scott‘ bisher der einzige Benutzer im System ist, werden wir ihn als einziges Teammitglied hinzufügen. Das erste von uns erzeugte Projekt mit dem wir anfangen, nennt sich `iphone_project`:

	[group mobile]
	members = scott
	writable = iphone_project

<!--Whenever you make changes to the `gitosis-admin` project, you have to commit the changes and push them back up to the server in order for them to take effect:-->

Immer wenn Du Änderungen im Projekt `gitosis-admin` durchführst, musst Du diese Änderungen auch einchecken und auf den Server pushen, damit diese auch eine Wirkung zeigen:

	$ git commit -am 'add iphone_project and mobile group'
	[master 8962da8] add iphone_project and mobile group
	 1 file changed, 4 insertions(+)
	$ git push origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 272 bytes | 0 bytes/s, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:gitosis-admin.git
	   fb27aec..8962da8  master -> master

<!--You can make your first push to the new `iphone_project` project by adding your server as a remote to your local version of the project and pushing. You no longer have to manually create a bare repository for new projects on the server — Gitosis creates them automatically when it sees the first push:-->

Du kannst Deinen ersten Push für das neue Projekt `iphone_project` ausführen, indem Du Deinen Server als Remote zu Deinem lokalen Repository hinzufügst und dann auf diesen pushst. Ab jetzt musst Du auf Deinem Server nicht mehr manuell ein Bare Repository für neue Projekte erstellen. Gitosis übernimmt diese Aufgabe für Dich, sobald es den ersten Push erhält:

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes | 0 bytes/s, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

<!--Notice that you don’t need to specify the path (in fact, doing so won’t work), just a colon and then the name of the project — Gitosis finds it for you.-->

Beachte, dass Du den Pfad nicht angeben musst (es ist sogar so, wenn Du ihn angibst, wird es nicht funktionieren). Gib lediglich ein Doppelpunkt gefolgt vom Namen des Projekts an. Das reicht Gitosis aus, um den richtigen Pfad für Dich zu finden.

<!--You want to work on this project with your friends, so you’ll have to re-add their public keys. But instead of appending them manually to the `~/.ssh/authorized_keys` file on your server, you’ll add them, one key per file, into the `keydir` directory. How you name the keys determines how you refer to the users in the `gitosis.conf` file. Let’s re-add the public keys for John, Josie, and Jessica:-->

Da Du an diesem Projekt nicht alleine, sondern mit Deinen Freunden, arbeiten willst, musst Du deren öffentliche Schlüssel wieder hinzufügen. Aber anstatt diese manuell in der Datei `~/.ssh/authorized_keys` auf Deinem Server einzutragen, fügst Du jeden Schlüssel als einzelne Datei in das Verzeichnis `keydir` hinzu. Der Name der Dateien entspricht den gleichen Namen, auf die Du in der Datei `gitosis.conf` referenzierst. Lass uns für John, Josie und Jessica die öffentlichen Schlüssel hinzufügen:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

<!--Now you can add them all to your 'mobile' team so they have read and write access to `iphone_project`:-->

Damit diese Personen Lese- und Schreibzugriff auf das Projekt `iphone_project` haben, musst Du sie dem ‚mobile‘-Team hinzufügen:

	[group mobile]
	members = scott john josie jessica
	writable = iphone_project

<!--After you commit and push that change, all four users will be able to read from and write to that project.-->

Nachdem Du diese Änderung commitet und gepusht hast, können alle vier Benutzer dieses Projekt lesen und schreiben.

<!--Gitosis has simple access controls as well. If you want John to have only read access to this project, you can do this instead:-->

Mit Gitosis kann man auch einfache Zugriffsberechtigungen setzen. Wenn John nur Lesezugriff zum Projekt haben soll, dann kannst Du stattdessen folgendes angeben:

	[group mobile]
	members = scott josie jessica
	writable = iphone_project

	[group mobile_ro]
	members = john
	readonly = iphone_project

<!--Now John can clone the project and get updates, but Gitosis won’t allow him to push back up to the project. You can create as many of these groups as you want, each containing different users and projects. You can also specify another group as one of the members (using `@` as prefix), to inherit all of its members automatically:-->

Mit dieser Konfiguration kann John das Projekt klonen und kann neue Stände herunterladen, aber Gitosis wird jeden Push von ihm ablehnen. Du kannst beliebig viele Gruppen angeben, die jeweils unterschiedliche Benutzer und Projekte enthalten. Ebenso ist es möglich eine andere Gruppe als Mitglied hinzuzufügen damit deren Teammitglieder automatisch miteinbezogen werden. Dazu musst Du bei der Gruppe `@` als Präfix angeben:

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	members   = @mobile_committers
	writable  = iphone_project

	[group mobile_2]
	members   = @mobile_committers john
	writable  = another_iphone_project

<!--If you have any issues, it may be useful to add `loglevel=DEBUG` under the `[gitosis]` section. If you’ve lost push access by pushing a messed-up configuration, you can manually fix the file on the server under `/home/git/.gitosis.conf` — the file from which Gitosis reads its info. A push to the project takes the `gitosis.conf` file you just pushed up and sticks it there. If you edit that file manually, it remains like that until the next successful push to the `gitosis-admin` project.-->

Solltest Du Probleme mit Gitosis haben, hilft es Dir vielleicht, wenn Du den Eintrag `loglevel=DEBUG` in der Sektion `[gitosis]` hinzufügst. Wenn Du keinen Push auf das Verwaltungsrepository ausführen kannst und Du Dich damit ausgeschlossen hast, kannst Du die Konfiguration unter `/home/git/.gitosis.conf` manuell bearbeiten. Diese Datei verwendet Gitosis als Konfigurationsdatei. Bei einem Push wird diese durch die im Verwaltungsrepository enthaltene Datei ersetzt. Wenn Du diese Datei also manuell änderst, bleibt diese bis zum nächsten erfolgreichen Push auf das Projekt `gitosis-admin` bestehen.

<!--# Gitolite-->