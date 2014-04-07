# Ein Git Repository anlegen

<!--You can get a Git project using two main approaches. The first takes an existing project or directory and imports it into Git. The second clones an existing Git repository from another server.-->

Es gibt grundsätzlich zwei Möglichkeiten, ein Git Repository auf dem eigenen Rechner anzulegen. Erstens kann man ein existierendes Projekt oder Verzeichnis in ein neues Git Repository importieren. Zweitens kann man ein existierendes Repository von einem anderen Rechner, der als Server fungiert, auf den eigenen Rechner klonen.

<!--## Initializing a Repository in an Existing Directory-->
## Ein existierendes Verzeichnis als Git Repository initialisieren

<!--If you’re starting to track an existing project in Git, you need to go to the project’s directory and type-->

Wenn Du künftige Änderungen an einem bestehenden Projekt auf Deinem Rechner mit Git versionieren und nachverfolgen willst, kannst Du dazu einfach in das jeweilige Verzeichnis wechseln und diesen Befehl ausführen:

	$ git init

<!--This creates a new subdirectory named `.git` that contains all of your necessary repository files — a Git repository skeleton. At this point, nothing in your project is tracked yet. (See *Chapter 9* for more information about exactly what files are contained in the `.git` directory you just created.)-->

Das erzeugt ein Unterverzeichnis `.git`, in dem alle relevanten Git Repository Daten enthalten sind, also ein Git Repository Grundgerüst. Zu diesem Zeitpunkt werden noch keine Dateien in Git versioniert. (In Kapitel 9 werden wir genauer darauf eingehen, welche Dateien im .git Verzeichnis enthalten sind und was ihre Aufgabe ist.)

<!--If you want to start version-controlling existing files (as opposed to an empty directory), you should probably begin tracking those files and do an initial commit. You can accomplish that with a few `git add` commands that specify the files you want to track, followed by a commit:-->

Wenn in Deinem Projekt bereits Dateien vorhanden sind (und es sich nicht nur um ein leeres Verzeichnis handelt), willst Du diese vermutlich zur Versionskontrolle hinzufügen, damit Änderungen daran künftig nachverfolgbar sind. Dazu kannst Du die folgenden Git Befehle ausführen um die Dateien zur Versionskontrolle hinzuzufügen. Anschließend kannst Du Deinen ersten Commit anlegen:

	$ git add *.c
	$ git add README
	$ git commit -m 'initial project version'

<!--We’ll go over what these commands do in just a minute. At this point, you have a Git repository with tracked files and an initial commit.-->

Wir werden gleich noch einmal genauer auf diese Befehle eingehen. Im Moment ist nur wichtig zu verstehen, dass Du jetzt ein Git Repository erzeugt und einen ersten Commit angelegt hast.

<!--## Cloning an Existing Repository-->
## Ein existierendes Repository klonen

<!--If you want to get a copy of an existing Git repository — for example, a project you’d like to contribute to — the command you need is `git clone`. If you’re familiar with other VCS systems such as Subversion, you’ll notice that the command is `clone` and not `checkout`. This is an important distinction — Git receives a copy of nearly all data that the server has. Every version of every file for the history of the project is pulled down when you run `git clone`. In fact, if your server disk gets corrupted, you can use any of the clones on any client to set the server back to the state it was in when it was cloned (you may lose some server-side hooks and such, but all the versioned data would be there — see *Chapter 4* for more details).-->

Wenn Du eine Kopie eines existierenden Git Repositorys anlegen willst – z.B. um an einem Projekt mitzuarbeiten – dann kannst Du dazu den Befehl `git clone` verwenden. Wenn Du schon mit anderen VCS Sytemen wie Subversion gearbeitet hast, wird Dir auffallen, dass der Befehl `clone` heißt und nicht `checkout`. Dies ist ein wichtiger Unterschied, den Du verstehen solltest. Git lädt eine Kopie aller Daten, die sich im existierenden Repository befinden, auf Deinen Rechner. Mit `git clone` wird jede einzelne Version jeder einzelnen Datei in der Historie des Repositorys heruntergeladen. Wenn ein Repository auf einem Server einmal beschädigt wird (z.B. weil die Festplatte beschädigt wird), kann man tatsächlich jeden beliebigen Klon des Repositorys verwenden, um das Repository auf dem Server wieder in dem Zustand wieder herzustellen, in dem es sich befand, als es geklont wurde. (Es kann passieren, dass man einige auf dem Server vorhandenen Hooks verliert, aber alle versionierten Daten bleiben erhalten. In Kapitel 4 gehen wir darauf noch einmal genauer ein.)

<!--You clone a repository with `git clone [url]`. For example, if you want to clone the Ruby Git library called Grit, you can do so like this:-->

Du kannst ein Repository mit dem Befehl `git clone [url]` klonen. Um beispielsweise das Repository der Ruby Git Bibliothek Grit zu klonen, führst Du den folgenden Befehl aus:

	$ git clone git://github.com/schacon/grit.git

<!--That creates a directory named `grit`, initializes a `.git` directory inside it, pulls down all the data for that repository, and checks out a working copy of the latest version. If you go into the new `grit` directory, you’ll see the project files in there, ready to be worked on or used. If you want to clone the repository into a directory named something other than grit, you can specify that as the next command-line option:-->

Git legt dann ein Verzeichnis `grit` an, initialisiert ein `.git` Verzeichnis darin, lädt alle Daten des Repositorys herunter, und checkt eine Arbeitskopie der letzten Version aus. Wenn Du in das neue `grit` Verzeichnis wechselst, findest Du dort die in diesem Projekt enthaltenen Dateien und kannst sie benutzen oder bearbeiten. Wenn Du das Repository in ein Verzeichnis mit einem anderen Namen als `grit` klonen willst, kannst Du das wie folgt angeben:

	$ git clone git://github.com/schacon/grit.git mygrit

<!--That command does the same thing as the previous one, but the target directory is called `mygrit`.-->

Dieser Befehl tut das gleiche wie der vorhergehende, aber das Zielverzeichnis ist diesmal `mygrit`.

<!--Git has a number of different transfer protocols you can use. The previous example uses the `git://` protocol, but you may also see `http(s)://` or `user@server:/path.git`, which uses the SSH transfer protocol. *Chapter 4* will introduce all of the available options the server can set up to access your Git repository and the pros and cons of each.-->

Git unterstützt eine Reihe unterschiedlicher Übertragungsprotokolle. Das vorhergehende Beispiel verwendet das `git://` Protokoll, aber Du wirst auch auf `http(s)://` oder `user@server:/path.git` treffen, die das SSH Protokoll verwenden. In Kapitel 4 gehen wir auf die verfügbaren Optionen (und deren Vor- und Nachteile) ein, die ein Server hat, um Zugriff auf ein Git Repository zu ermöglichen.

<!--# Recording Changes to the Repository-->