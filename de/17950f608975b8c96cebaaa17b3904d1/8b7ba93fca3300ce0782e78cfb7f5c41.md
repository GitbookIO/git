# Git auf einen Server bekommen

<!--In order to initially set up any Git server, you have to export an existing repository into a new bare repository — a repository that doesn’t contain a working directory. This is generally straightforward to do.-->
<!--In order to clone your repository to create a new bare repository, you run the clone command with the `-\-bare` option. By convention, bare repository directories end in `.git`, like so:-->

Um zunächst einen beliebigen Git Server einzurichten, musst Du ein existierendes Repository in ein neues einfaches Repository exportieren – ein Repository, dass kein Arbeitsverzeichnis enthält. Das ist im Allgemeinen einfach zu erledigen.
Um zunächst Dein Repository zu klonen, um ein neues einfaches Repository anzulegen, führst Du den Klonen-Befehl mit der `--bare` Option aus. Per Konvention haben einfache Repository Verzeichnisse die Endung `.git`, wie hier:

	$ git clone --bare my_project my_project.git
	Cloning into bare repository 'my_project.git'...
	done.

<!--The output for this command is a little confusing. Since `clone` is basically a `git init` then a `git fetch`, we see some output from the `git init` part, which creates an empty directory. The actual object transfer gives no output, but it does happen. You should now have a copy of the Git directory data in your `my_project.git` directory.-->

Die Ausgabe für diesen Befehl ist etwas verwirrend. Weil `clone` im Grunde ein `git init` und ein `git fetch` ist, sehen wir eine Ausgabe vom `git init`-Teil, der ein leeres Verzeichnis anlegt. Die eigentliche Objekt-Übertragung erzeugt keine Ausgabe, aber sie findet statt. Du solltest jetzt eine Kopie von den Git-Verzeichnis Daten in Deinem `my_project.git` Verzeichnis haben.

<!--This is roughly equivalent to something like-->

Dies ist entsprechend zu etwas wie

	$ cp -Rf my_project/.git my_project.git

<!--There are a couple of minor differences in the configuration file; but for your purpose, this is close to the same thing. It takes the Git repository by itself, without a working directory, and creates a directory specifically for it alone.-->

Es gibt ein paar kleine Unterschiede in der Konfigurationsdatei, aber für Deine Zwecke ist es nahezu dasselbe. Es nimmt das Git-Repository selbst, ohne ein Arbeitsverzeichnis, und erzeugt ein Verzeichnis speziell für es allein.

<!--## Putting the Bare Repository on a Server-->
## Inbetriebnahme des einfachen Repository auf einem Server

<!--Now that you have a bare copy of your repository, all you need to do is put it on a server and set up your protocols. Let’s say you’ve set up a server called `git.example.com` that you have SSH access to, and you want to store all your Git repositories under the `/opt/git` directory. You can set up your new repository by copying your bare repository over:-->

Jetzt da Du eine einfache Kopie Deines Repository hast, ist alles was Du tun musst das Aufsetzen auf einem Server und das Einrichten Deiner Protokolle. Angenommen, Du hast einen Server mit dem Namen `git.example.com`, zu dem Du SSH-Zugang hast, und Du möchtest alle Deine Git Repositories im Verzeichnis `/opt/git` speichern. Du kannst Dein neues Repository einrichten, indem Du Dein einfaches Repository dorthin kopierst:

	$ scp -r my_project.git user@git.example.com:/opt/git

<!--At this point, other users who have SSH access to the same server which has read-access to the `/opt/git` directory can clone your repository by running-->

An diesem Punkt können andere Benutzer, die SSH-Zugang zu dem gleichen Server und Lesezugriff auf das `/opt/git` Verzeichnis haben, Dein Repository klonen:

	$ git clone user@git.example.com:/opt/git/my_project.git

<!--If a user SSHs into a server and has write access to the `/opt/git/my_project.git` directory, they will also automatically have push access.  Git will automatically add group write permissions to a repository properly if you run the `git init` command with the `-\-shared` option.-->

Wenn sich ein Benutzer per SSH mit dem Server verbindet und Schreibzugriff zu dem Verzeichnis `/opt/git/my_project.git` hat, wird er automatisch auch Push-Zugriff haben. Git wird automatisch die richtigen Gruppenschreibrechte zu einem Repository hinzufügen, wenn Du den `git init` Befehl mit der `--shared` Option ausführst:

	$ ssh user@git.example.com
	$ cd /opt/git/my_project.git
	$ git init --bare --shared

<!--You see how easy it is to take a Git repository, create a bare version, and place it on a server to which you and your collaborators have SSH access. Now you’re ready to collaborate on the same project.-->

Du siehst wie einfach es ist ein Git Repository zu nehmen, eine einfache Version zu erzeugen, es auf einen Server zu platzieren zu dem Du und Deine Mitarbeiter SSH-Zugriff haben.

<!--It’s important to note that this is literally all you need to do to run a useful Git server to which several people have access — just add SSH-able accounts on a server, and stick a bare repository somewhere that all those users have read and write access to. You’re ready to go — nothing else needed.-->

Es ist wichtig zu beachten, dass dies wortwörtlich alles ist, was Du tun musst, um einen nützlichen Git-Server laufen zu lassen, zu dem mehrere Personen Zugriff haben – füge auf dem Server einfach SSH-fähige Konten und irgendwo ein einfaches Repository hinzu, zu dem alle Benutzer Schreib- und Lesezugriff haben.

<!--In the next few sections, you’ll see how to expand to more sophisticated setups. This discussion will include not having to create user accounts for each user, adding public read access to repositories, setting up web UIs, using the Gitosis tool, and more. However, keep in mind that to collaborate with a couple of people on a private project, all you _need_ is an SSH server and a bare repository.-->

In den nächsten Abschnitten wirst Du sehen, wie man auf anspruchsvollere Konfigurationen erweitert. Diese Diskussion wird beinhalten nicht Benutzerkonten für jeden Benutzer hinzufügen zu müssen, öffentlichen Lese-Zugriff auf Repositories hinzuzufügen, die Einrichtung von Web-UIs, die Benutzung des Gitosis-Tools und weiteres. Aber denke daran, zur Zusammenarbeit mit ein paar Personen an einem privaten Projekt, ist alles was Du _brauchst_ ein SSH-Server und ein einfaches Repository.

<!--## Small Setups-->
## Kleine Konfigurationen

<!--If you’re a small outfit or are just trying out Git in your organization and have only a few developers, things can be simple for you. One of the most complicated aspects of setting up a Git server is user management. If you want some repositories to be read-only to certain users and read/write to others, access and permissions can be a bit difficult to arrange.-->

Wenn Du eine kleine Ausrüstung hast oder Git gerade in Deinem Unternehmen ausprobierst und nur ein paar Entwickler hast, sind die Dinge einfach für dich. Einer der kompliziertesten Aspekte der Einrichtung eines Git-Servers ist die Benutzerverwaltung. Wenn einige Repositories für bestimmte Benutzer nur lesend zugänglich sein sollen und andere Benutzer Lese/Schreib-Zugriff haben sollen, können Zugriff und Berechtigungen ein bisschen schwierig zu organisieren sein.

<!--### SSH Access-->
### SSH-Zugriff

<!--If you already have a server to which all your developers have SSH access, it’s generally easiest to set up your first repository there, because you have to do almost no work (as we covered in the last section). If you want more complex access control type permissions on your repositories, you can handle them with the normal filesystem permissions of the operating system your server runs.-->

Wenn Du bereits einen Server hast, zu dem alle Entwickler SSH-Zugriff haben, ist es generell einfach, Dein erstes Repository einzurichten, weil Du fast keine Arbeit zu erledigen hast (wie wir im letzen Abschnitt abgedeckt haben). Wenn Du komplexere Zugriffskontroll-Berechtigungen auf Deine Repositories willst, kannst Du diese mit normalen Dateisystem-Berechtigungen des Betriebssystems Deines Servers bewältigen.

<!--If you want to place your repositories on a server that doesn’t have accounts for everyone on your team whom you want to have write access, then you must set up SSH access for them. We assume that if you have a server with which to do this, you already have an SSH server installed, and that’s how you’re accessing the server.-->

Wenn Du Deine Repositories auf einem Server platzieren möchtest, der keine Accounts für jeden aus Deinem Team hat, der Schreibzugriff haben soll, dann musst Du SSH-Zugriff für diese Personen einrichten. Wir nehmen an, wenn Du einen Server hast, mit welchem Du dies tun möchtest, Du bereits einen SSH-Server installiert hast und so greifst Du auf den Server zu.

<!--There are a few ways you can give access to everyone on your team. The first is to set up accounts for everybody, which is straightforward but can be cumbersome. You may not want to run `adduser` and set temporary passwords for every user.-->

Es gibt ein paar Wege allen Mitgliedern Deines Teams Zugriff zu geben. Der erste ist einen Account für jeden einzurichten, was unkompliziert aber mühsam sein kann. Du möchtest vielleicht nicht für jeden Benutzer `adduser` ausführen und ein temporäres Passwort setzen.

<!--A second method is to create a single 'git' user on the machine, ask every user who is to have write access to send you an SSH public key, and add that key to the `~/.ssh/authorized_keys` file of your new 'git' user. At that point, everyone will be able to access that machine via the 'git' user. This doesn’t affect the commit data in any way — the SSH user you connect as doesn’t affect the commits you’ve recorded.-->

Eine zweite Methode ist, einen einzigen ‚git‘-Benutzer auf der Maschine zu erstellen und jeden Benutzer, der Schreibzugriff haben soll, nach einem öffentliche SSH-Schlüssel zu fragen und diesen Schlüssel zu der `~/.ssh/authorized_keys`-Datei Deines neuen ‚git‘ Benutzers hinzuzufügen. Das beeinflusst die Commit-Daten in keiner Weise – der SSH-Benutzer, mit dem Du Dich verbindest, beeinflusst die von Dir aufgezeichneten Commits nicht.

<!--Another way to do it is to have your SSH server authenticate from an LDAP server or some other centralized authentication source that you may already have set up. As long as each user can get shell access on the machine, any SSH authentication mechanism you can think of should work.-->

Ein anderer Weg ist, einen LDAP-Server zur Authentifizierung zu benutzen oder eine andere zentrale Authentifizierungsquelle, die Du vielleicht bereits eingerichtet hast. Solange jeder Benutzer Shell-Zugriff zu der Maschine hat, sollte jede SSH-Authentifizierungsmethode funktionieren, die Du Dir vorstellen kannst.

<!--# Generating Your SSH Public Key-->