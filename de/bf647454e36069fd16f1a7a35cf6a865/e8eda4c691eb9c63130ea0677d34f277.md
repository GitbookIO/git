# Git konfigurieren

<!--Now that you have Git on your system, you’ll want to do a few things to customize your Git environment. You should have to do these things only once; they’ll stick around between upgrades. You can also change them at any time by running through the commands again.-->

Nachdem Du jetzt Git auf Deinem System installiert hast, solltest Du Deine Git Konfiguration anpassen. Das brauchst Du nur einmal zu tun, die Konfiguration bleibt auch bestehen, wenn Du Git auf eine neuere Version aktualisierst. Du kannst sie jederzeit ändern, indem Du die folgenden Befehle einfach noch einmal ausführst.

<!--Git comes with a tool called git config that lets you get and set configuration variables that control all aspects of how Git looks and operates. These variables can be stored in three different places:-->

Git umfasst das Werkzeug `git config`, das Dir erlaubt, Konfigurationswerte zu verändern. Auf diese Weise kannst Du anpassen, wie Git aussieht und arbeitet. Diese Werte sind an drei verschiedenen Orten gespeichert:

<!--*	`/etc/gitconfig` file: Contains values for every user on the system and all their repositories. If you pass the option` -\-system` to `git config`, it reads and writes from this file specifically.-->
<!--*	`~/.gitconfig` file: Specific to your user. You can make Git read and write to this file specifically by passing the `-\-global` option.-->
<!--*	config file in the git directory (that is, `.git/config`) of whatever repository you’re currently using: Specific to that single repository. Each level overrides values in the previous level, so values in `.git/config` trump those in `/etc/gitconfig`.-->

* Die Datei `/etc/gitconfig` enthält Werte, die für jeden Anwender des Systems und all ihre Projekte gelten. Wenn Du `git config` mit der Option `--system` verwendest, wird diese Datei verwendet.
* Die Werte in der Datei `~/.gitconfig` gelten ausschließlich für Dich und all Deine Projekte. Wenn Du `git config` mit der Option `--global` verwendest, wird diese Datei verwendet.
* Die Datei `.git/config` im Git Verzeichnis eines Projektes enthält Werte, die nur für das jeweilige Projekt gelten. Diese Dateien überschreiben Werte aus den jeweils vorhergehenden Dateien in dieser Reihenfolge. D.h. Werte in beispielsweise `.git/config` überschreiben diejenigen in `/etc/gitconfig`.

<!--On Windows systems, Git looks for the `.gitconfig` file in the `$HOME` directory (`%USERPROFILE%` in Windows’ environment), which is `C:\Documents and Settings\$USER` or `C:\Users\$USER` for most people, depending on version (`$USER` is `%USERNAME%` in Windows’ environment). It also still looks for /etc/gitconfig, although it’s relative to the MSys root, which is wherever you decide to install Git on your Windows system when you run the installer.-->

Auf Windows Systemen sucht Git nach der `.gitconfig` Datei im `$HOME` Verzeichnis (für die meisten Leute ist das das Verzeichnis `C:\Dokumente und Einstellungen\$USER`). Git sucht außerdem auch nach dem Verzeichnis /etc/gitconfig, aber es sucht relativ demjenigen Verzeichnis, in dem Du Git mit Hilfe des Installers installiert hast.

<!--## Your Identity-->
## Deine Identität

<!--The first thing you should do when you install Git is to set your user name and e-mail address. This is important because every Git commit uses this information, and it’s immutably baked into the commits you pass around:-->

Nachdem Du Git installiert hast, solltest Du als erstes Deinen Namen und Deine E-Mail Adresse konfigurieren. Das ist wichtig, weil Git diese Information für jeden Commit verwendet, den Du anlegst, und sie ist unveränderlich in Deine Commits eingebaut (xxx):

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

<!--Again, you need to do this only once if you pass the `-\-global` option, because then Git will always use that information for anything you do on that system. If you want to override this with a different name or e-mail address for specific projects, you can run the command without the `-\-global` option when you’re in that project.-->

Du brauchst diese Konfiguration, wie schon erwähnt, nur einmal vorzunehmen, wenn Du die `--global` Option verwendest, weil Git diese Information dann für all Deine Projekte verwenden wird. Wenn Du sie für ein spezielles Projekt mit einem anderen Namen oder einer anderen E-Mail Adresse überschreiben willst, kannst Du dazu den Befehl ohne die `--global` Option innerhalb dieses Projektes ausführen.

<!--## Your Editor-->
## Dein Editor

<!--Now that your identity is set up, you can configure the default text editor that will be used when Git needs you to type in a message. By default, Git uses your system’s default editor, which is generally Vi or Vim. If you want to use a different text editor, such as Emacs, you can do the following:-->

Nachdem Du Deine Identität jetzt konfiguriert hast, kannst Du einstellen, welchen Texteditor Git in Situationen verwenden soll, in denen Du eine Nachricht eingeben musst. Normalerweise verwendet Git den Standard-Texteditor Deines Systems – das ist üblicherweise Vi oder Vim. Wenn Du einen anderen Texteditor, z.B. Emacs, verwenden willst, kannst Du das wie folgt festlegen:

	$ git config --global core.editor emacs

<!--## Your Diff Tool-->
## Dein Diff Programm

<!--Another useful option you may want to configure is the default diff tool to use to resolve merge conflicts. Say you want to use vimdiff:-->

Eine andere nützliche Einstellung, die Du möglicherweise vornehmen willst, ist welches Diff Programm Git verwendet. Mit diesem Programm kannst Du Konflikte auflösen, die während der Arbeit mit Git manchmal auftreten. Wenn Du beispielsweise vimdiff verwenden willst, kannst Du das so festlegen:

	$ git config --global merge.tool vimdiff

<!--Git accepts kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge, and opendiff as valid merge tools. You can also set up a custom tool; see Chapter 7 for more information about doing that.-->

Git kann von Hause aus mit den folgenden Diff Programmen arbeiten: kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge, and opendiff. Außerdem kannst Du ein eigenes Programm aufsetzen. Wir werden in Kapitel 7 darauf eingehen, wie das geht.

<!--## Checking Your Settings-->
## Deine Einstellungen überprüfen

<!--If you want to check your settings, you can use the `git config -\-list` command to list all the settings Git can find at that point:-->

Wenn Du Deine Einstellungen überprüfen willst, kannst Du mit dem Befehl `git config --list` alle Einstellungen anzuzeigen, die Git an dieser Stelle (z.B. innerhalb eines bestimmten Projektes) bekannt sind:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

<!--You may see keys more than once, because Git reads the same key from different files (`/etc/gitconfig` and `~/.gitconfig`, for example). In this case, Git uses the last value for each unique key it sees.-->

Manche Variablen werden möglicherweise mehrfach aufgelistet, weil Git dieselbe Variable in verschiedenen Dateien (z.B. `/etc/gitconfig` und `~/.gitconfig`) findet. In diesem Fall verwendet Git dann den jeweils zuletzt aufgelisteten Wert.

<!--You can also check what Git thinks a specific key’s value is by typing `git config {key}`:-->

Außerdem kannst Du mit dem Befehl `git config {key}` prüfen, welchen Wert Git für einen bestimmten Variablennamen verwendet:

	$ git config user.name
	Scott Chacon

<!--# Getting Help-->