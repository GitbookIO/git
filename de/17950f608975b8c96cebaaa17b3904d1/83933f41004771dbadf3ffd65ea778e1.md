# Einrichten des Servers

<!--Let’s walk through setting up SSH access on the server side. In this example, you’ll use the `authorized_keys` method for authenticating your users. We also assume you’re running a standard Linux distribution like Ubuntu. First, you create a 'git' user and a `.ssh` directory for that user.-->

Nun kommen wir zur Einrichtung des SSH-Zugangs auf der Server-Seite. In diesem Beispiel verwendest Du die `authorized_keys`-Methode zur Authentifizierung der Benutzer. Wir nehmen auch an, dass Du eine gebräuchliche Linux-Distribution wie Ubuntu verwendest. Zuerst erstellst Du den Benutzer ‚git‘ und ein `.ssh`-Verzeichnis für diesen Benutzer.

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

<!--Next, you need to add some developer SSH public keys to the `authorized_keys` file for that user. Let’s assume you’ve received a few keys by e-mail and saved them to temporary files. Again, the public keys look something like this:-->

Als nächstes ist es nötig, einige öffentliche SSH-Schlüssel der Entwickler zu der `authorized_keys`-Datei des Benutzers hinzuzufügen. Nehmen wir an, dass Du ein paar Schlüssel per E-Mail empfangen hast und diese in temporären Dateien gespeichert hast. Die öffentlichen Schlüssel sehen wieder etwa wie folgt aus:

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

<!--You just append them to your `authorized_keys` file:-->

Du hängst sie einfach an Deine `authorized_keys`-Datei an:

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

<!--Now, you can set up an empty repository for them by running `git init` with the `-\-bare` option, which initializes the repository without a working directory:-->

Jetzt kannst Du einen leeren Ordner für sie anlegen, indem Du den Befehl `git init` mit der Option `--bare` ausführst. Damit wird ein Repository ohne ein Arbeitsverzeichnis erzeugt.

	$ cd /opt/git
	$ mkdir project.git
	$ cd project.git
	$ git --bare init

<!--Then, John, Josie, or Jessica can push the first version of their project into that repository by adding it as a remote and pushing up a branch. Note that someone must shell onto the machine and create a bare repository every time you want to add a project. Let’s use `gitserver` as the hostname of the server on which you’ve set up your 'git' user and repository. If you’re running it internally, and you set up DNS for `gitserver` to point to that server, then you can use the commands pretty much as is:-->

Dann können John, Josie oder Jessica die erste Version ihres Projektes in das Repository hochladen, indem sie es als externes Repository hinzufügen und einen Branch hochladen. Beachte, dass sich bei jeder Projekterstellung jemand mit der Maschine auf eine Shell verbinden muss, um ein einfaches Repository zu erzeugen. Lass uns `gitserver` als Hostnamen des Servers verwenden, auf dem Du den Benutzer ‚git‘ und das Repository eingerichtet hast. Wenn Du den Server intern betreibst und das DNS so eingerichtet hast, dass `gitserver` auf den Server zeigt, dann kannst Du die Befehle ziemlich wie hier benutzen:

	# on Johns computer
	$ cd myproject
	$ git init
	$ git add .
	$ git commit -m 'initial commit'
	$ git remote add origin git@gitserver:/opt/git/project.git
	$ git push origin master

<!--At this point, the others can clone it down and push changes back up just as easily:-->

An diesem Punkt können die anderen das Repository klonen und Änderungen ebenso leicht hochladen:

	$ git clone git@gitserver:/opt/git/project.git
	$ cd project
	$ vim README
	$ git commit -am 'fix for the README file'
	$ git push origin master

<!--With this method, you can quickly get a read/write Git server up and running for a handful of developers.-->

Mit dieser Methode kannst Du schnell für eine Handvoll Entwickler einen Lese/Schreib Git-Server zum Laufen bekommen.

<!--As an extra precaution, you can easily restrict the 'git' user to only doing Git activities with a limited shell tool called `git-shell` that comes with Git. If you set this as your 'git' user’s login shell, then the 'git' user can’t have normal shell access to your server. To use this, specify `git-shell` instead of bash or csh for your user’s login shell. To do so, you’ll likely have to edit your `/etc/passwd` file:-->

Als zusätzliche Vorsichtsmaßnahme kannst Du den Benutzer ‚git‘ so beschränken, dass er nur Git-Aktivitäten mit einem limitierten Shell-Tool namens `git-shell` ausführen kann, dass mit Git kommt. Wenn Du das als Login-Shell des ‚git‘-Benutzers einrichtest, dann hat der Benutzer ‚git‘ keinen normalen Shell-Zugriff auf den Server. Zur Benutzung bestimme `git-shell` anstatt von bash oder csh als Login-Shell Deines Benutzers. Um das zu tun wirst Du wahrscheinlich Deine `/etc/passwd` editieren:

	$ sudo vim /etc/passwd

<!--At the bottom, you should find a line that looks something like this:-->

Am Ende solltest Du eine Zeile finden, die in etwa so aussieht:

	git:x:1000:1000::/home/git:/bin/sh

<!--Change `/bin/sh` to `/usr/bin/git-shell` (or run `which git-shell` to see where it’s installed). The line should look something like this:-->

Ändere `/bin/sh` zu `/usr/bin/git-shell` (oder führe `which git-shell` aus, um zu sehen, wo es installiert ist). Die Zeile sollte in etwa so aussehen:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

<!--Now, the 'git' user can only use the SSH connection to push and pull Git repositories and can’t shell onto the machine. If you try, you’ll see a login rejection like this:-->

Jetzt kann der ‚git‘-Benutzer die SSH-Verbindung nur noch verwenden, um Git-Repositories hochzuladen und herunterzuladen. Der Benutzer kann sich nicht mehr per Shell zur Maschine verbinden. Wenn Du es versuchst, siehst Du eine Login-Ablehnung wie diese:

	$ ssh git@gitserver
	fatal: What do you think I am? A shell?
	Connection to gitserver closed.

<!--# Public Access-->