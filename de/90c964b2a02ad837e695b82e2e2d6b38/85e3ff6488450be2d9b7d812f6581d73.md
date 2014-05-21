# Git Konfiguration

<!--As you briefly saw in the Chapter 1, you can specify Git configuration settings with the `git config` command. One of the first things you did was set up your name and e-mail address:-->

Wie in Kapitel 1 schon kurz beschrieben, kann man die Konfiguration von Git mit Hilfe des Befehls `git config` steuern. Einer Deiner ersten Aktionen war es, Deinen Namen und E-Mail Adresse anzugeben:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

<!--Now you’ll learn a few of the more interesting options that you can set in this manner to customize your Git usage.-->

Jetzt wirst Du einige weitere, interessantere Optionen kennenlernen, die Du auf gleiche Art und Weise einsetzen kannst, um Git Deiner Arbeitsumgebung anzupassen.

<!--You saw some simple Git configuration details in the first chapter, but I’ll go over them again quickly here. Git uses a series of configuration files to determine non-default behavior that you may want. The first place Git looks for these values is in an `/etc/gitconfig` file, which contains values for every user on the system and all of their repositories. If you pass the option `-\-system` to `git config`, it reads and writes from this file specifically.-->

In Kapitel 1 hast Du bereits Deine ersten Erfahrungen mit einigen einfachen Einstellparametern von Git gemacht, aber ich möchte sie hier noch einmal kurz wiederholen. Git verwendet eine Reihe von Konfigurationsdateien, um Deine persönliche Einstellungen, welche von den Standard-Einstellungen abweichen, festzuhalten. Zu aller erst prüft Git die Einstellungen in der Datei `/etc/gitconfig`. Diese Datei enthält Werte, welche für alle Benutzer des Systems und deren Repositorys gelten. Wenn Du `git config` mit der Option `--system` benutzt, liest und schreibt Git von genau dieser Datei.

<!--The next place Git looks is the `~/.gitconfig` file, which is specific to each user. You can make Git read and write to this file by passing the `-\-global` option.-->

Als nächstes prüft Git die Datei `~/.gitconfig`, welche nur für den jeweiligen Benutzer gilt. Damit Git diese Datei zum Lesen und Schreiben nutzt, kannst Du die Option `--global` angeben.

<!--Finally, Git looks for configuration values in the config file in the Git directory (`.git/config`) of whatever repository you’re currently using. These values are specific to that single repository. Each level overwrites values in the previous level, so values in `.git/config` trump those in `/etc/gitconfig`, for instance. You can also set these values by manually editing the file and inserting the correct syntax, but it’s generally easier to run the `git config` command.-->

Als Letztes sucht Git in der Konfigurationsdatei im Git Verzeichnis des gerade verwendeten Repositorys (`.git/config`). Die dort enthaltenen Parameter sind nur für dieses einzelne Repository gültig. Jede der erwähnten Ebenen überschreibt die vorhergehende. Das bedeutet, dass z.B. die Einstellungen in der Datei `/etc/gitconfig` von den Einstellungen in der Datei `.git/config` überschrieben werden. Du kannst alle Parameter auch durch manuelles Editieren der jeweiligen Datei setzen bzw. verändern (vorausgesetzt Du verwendest die richtige Syntax). In der Regel ist es aber einfacher den Befehl `git config` zu verwenden.

<!--## Basic Client Configuration-->
## Grundlegende Client Konfiguration

<!--The configuration options recognized by Git fall into two categories: client side and server side. The majority of the options are client side—configuring your personal working preferences. Although tons of options are available, I’ll only cover the few that either are commonly used or can significantly affect your workflow. Many options are useful only in edge cases that I won’t go over here. If you want to see a list of all the options your version of Git recognizes, you can run-->

Einstellparameter in Git lassen sich in zwei Kategorien aufteilen: Parameter für die Client-Konfiguration und für die Server-Konfiguration. Der Großteil der Einstellungen bezieht sich auf den Client – zur Konfiguration Deines persönlichen Arbeitsablaufs. Auch wenn es eine große Anzahl an Einstellmöglichkeiten gibt, werde ich nur die wenigen besprechen, die sehr gebräuchlich sind oder Deine Arbeitsweise bedeutend beeinflussen können. Viele Optionen sind nur für Spezialfälle interessant, auf die ich hier aber nicht weiter eingehen möchte. Falls Du eine Liste aller Optionen haben willst, kannst Du folgenden Befehl ausführen:

	$ git config --help

<!--The manual page for `git config` lists all the available options in quite a bit of detail.-->

Die Hilfeseite zu `git config` listet alle verfügbaren Optionen sehr detailliert auf.

<!--### core.editor-->
### core.editor

<!--By default, Git uses whatever you’ve set as your default text editor or else falls back to the Vi editor to create and edit your commit and tag messages. To change that default to something else, you can use the `core.editor` setting:-->

In der Grundeinstellung benutzt Git Deinen Standard Texteditor oder greift auf den Vi Editor zurück, um Deine Commit und Tag Nachrichten zu erstellen und zu bearbeiten. Um einen andern Editor als Standard einzurichten kannst Du die Option `core.editor` nutzen:

	$ git config --global core.editor emacs

<!--Now, no matter what is set as your default shell editor variable, Git will fire up Emacs to edit messages.-->

Ab jetzt wird Git immer Emacs starten um Nachrichten zu editieren, unabhängig davon welcher Standard Shell-Editor gesetzt ist.

<!--### commit.template-->
### commit.template

<!--If you set this to the path of a file on your system, Git will use that file as the default message when you commit. For instance, suppose you create a template file at `$HOME/.gitmessage.txt` that looks like this:-->

Wenn Du diese Einstellung auf einen Pfad zu einer Datei auf Deinem System einstellst, wird Git den Inhalt dieser Datei als Standard Commit Nachricht verwenden. Nehmen wir zum Beispiel an, Du erstellst eine Vorlage unter dem Namen `$HOME/.gitmessage.txt`, die den folgenden Inhalt hat:

	subject line

	what happened

	[ticket: X]

<!--To tell Git to use it as the default message that appears in your editor when you run `git commit`, set the `commit.template` configuration value:-->

Damit Git diese Datei als Standard Nachricht benutzt, die in Deinem Editor erscheint, wenn Du `git commit` aufrufst, richte die Option `commit.template` ein:

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

<!--Then, your editor will open to something like this for your placeholder commit message when you commit:-->

Wenn Du dann das nächste Mal einen Commit durchführst, wird Dein Editor mit etwa der folgenden Nachricht starten:

	subject line

	what happened

	[ticket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

<!--If you have a commit-message policy in place, then putting a template for that policy on your system and configuring Git to use it by default can help increase the chance of that policy being followed regularly.-->

Falls eine Richtlinie für Commit Nachrichten existiert, solltest Du Git so konfigurieren, dass eine Vorlage davon bei einem Commit geladen wird. Dies erhöht die Chance, dass diese Richtlinie auch eingehalten wird.

<!--### core.pager-->
### core.pager

<!--The core.pager setting determines what pager is used when Git pages output such as `log` and `diff`. You can set it to `more` or to your favorite pager (by default, it’s `less`), or you can turn it off by setting it to a blank string:-->

Die Einstellung `core.pager` legt fest, welche Anwendung zur Seitenanzeige benutzt wird, wenn Git Text ausgibt, wie zum Beispiel bei `log` und `diff`. Du kannst es auch auf `more` oder eine andere Seitenanzeige Deiner Wahl (der Standard ist `less`) einstellen, oder Du kannst es mittels eines leeren Strings ganz ausschalten:

	$ git config --global core.pager ''

<!--If you run that, Git will page the entire output of all commands, no matter how long it is.-->

Wenn Du dies ausführst, wird Git immer die komplette Ausgabe aller Befehle anzeigen, egal wie lange sie ist.

<!--### user.signingkey-->
### user.signingkey

<!--If you’re making signed annotated tags (as discussed in Chapter 2), setting your GPG signing key as a configuration setting makes things easier. Set your key ID like so:-->

Falls Du signierte kommentierte Tags erstellst (wie in Kapitel 2 beschrieben), so macht es die Arbeit leichter, wenn Du Deinen GPG Signierschlüssel in Git festlegst. Du kannst Deine Schlüssel ID wie folgt festlegen:

	$ git config --global user.signingkey <gpg-key-id>

<!--Now, you can sign tags without having to specify your key every time with the `git tag` command:-->

Beim Signieren von Tags mit Hilfe von `git tag` musst Du Deinen Schlüssel jetzt nicht mehr angeben. Es reicht folgendes auszuführen:

	$ git tag -s <tag-name>

<!--### core.excludesfile-->
### core.excludesfile

<!--You can put patterns in your project’s `.gitignore` file to have Git not see them as untracked files or try to stage them when you run `git add` on them, as discussed in Chapter 2. However, if you want another file outside of your project to hold those values or have extra values, you can tell Git where that file is with the `core.excludesfile` setting. Simply set it to the path of a file that has content similar to what a `.gitignore` file would have.-->

In Kapitel 2 habe ich bereits beschrieben, wie Du mit Hilfe der projektspezifischen `.gitignore` Datei Git dazu bringst, bestimmte Dateien nicht weiter zu verfolgen beziehungsweise zu stagen, wenn Du den Befehl `git add` verwendest. Falls Du jedoch eine weitere Datei außerhalb Deines Projekts verwenden willst, die diese Werte enthält oder zusätzliche Muster definiert, dann kannst Du Git mit der Option `core.excludesfile` mitteilen, wo sich diese Datei befindet. Trage hier einfach den Pfad zu einer Datei ein, welche entsprechend einer `.gitignore` Datei aufgebaut ist.

<!--### help.autocorrect-->
### help.autocorrect

<!--This option is available only in Git 1.6.1 and later. If you mistype a command in Git, it shows you something like this:-->

Diese Option ist in Git ab Version 1.6.1 verfügbar. Wenn Du in Git einen Befehl falsch schreibst, bekommst Du eine Meldung wie diese:

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

<!--If you set `help.autocorrect` to 1, Git will automatically run the command if it has only one match under this scenario.-->

Wenn Du die Option `help.autocorrect` auf 1 setzt, wird Git automatisch den entsprechenden Befehl ausführen, falls es in dieser Situation die einzige passende Alternative ist.

<!--## Colors in Git-->
## Farben in Git

<!--Git can color its output to your terminal, which can help you visually parse the output quickly and easily. A number of options can help you set the coloring to your preference.-->

Git kann für die Textanzeige im Terminal Farben benutzen, die Dir helfen können, die Ausgabe schnell und einfach zu begreifen. Mit einer Vielzahl von Optionen kannst Du die Farben an Deine Vorlieben anpassen.

<!--### color.ui-->
### color.ui

<!--Git automatically colors most of its output if you ask it to. You can get very specific about what you want colored and how; but to turn on all the default terminal coloring, set `color.ui` to true:-->

Wenn Du Git entsprechend konfigurierst, wird es den Großteil der Ausgaben automatisch farblich darstellen. Du kannst sehr detailliert einstellen, wie und welche Farben verwendet werden sollen, aber um die Standard-Terminalfarben zu aktivieren musst Du `color.ui` auf ‚true‘ setzen:

	$ git config --global color.ui true

<!--When that value is set, Git colors its output if the output goes to a terminal. Other possible settings are false, which never colors the output, and always, which sets colors all the time, even if you’re redirecting Git commands to a file or piping them to another command.-->

Wenn dieser Wert gesetzt wurde, benutzt Git für seine Ausgaben Farben, sofern diese zu einem Terminal geleitet werden. Weitere mögliche Einstellungen sind ‚false‘, wodurch alle Farben deaktiviert werden, sowie ‚always‘, wodurch Farben immer aktiviert sind, selbst wenn Du Git Befehle in eine Datei oder über eine Pipe zu einem anderen Befehl umleitest.

<!--You’ll rarely want `color.ui = always`. In most scenarios, if you want color codes in your redirected output, you can instead pass a `-\-color` flag to the Git command to force it to use color codes. The `color.ui = true` setting is almost always what you’ll want to use.-->

Du wirst selten die Einstellung `color.ui = always` benötigen. In den meisten Fällen in denen Du in Deiner umgeleiteten Ausgabe Farben haben willst, kannst Du stattdessen die Option `--color` in der Kommandozeile benutzen. Damit weist Du Git an, die Farbkodierung für die Ausgabe zu verwenden. Die Einstellung `color.ui = true` sollte aber in den meisten Fällen Deinen Anforderungen genügen.

<!--### `color.*`-->
### `color.*`

<!--If you want to be more specific about which commands are colored and how, Git provides verb-specific coloring settings. Each of these can be set to `true`, `false`, or `always`:-->

Falls Du im Detail einstellen willst, welche Befehle wie gefärbt werden, dann stellt Git Verb-spezifische Farbeinstellungen zur Verfügung. Jede dieser Optionen kann auf `true`, `false`, oder `always` eingestellt werden:

	color.branch
	color.diff
	color.interactive
	color.status

<!--In addition, each of these has subsettings you can use to set specific colors for parts of the output, if you want to override each color. For example, to set the meta information in your diff output to blue foreground, black background, and bold text, you can run-->

Zusätzlich hat jede dieser Einstellungen Unteroptionen, die Du benutzen kannst, um die Farbe für einzelne Teile der Ausgabe festzulegen. Um zum Beispiel die Meta Informationen in Deiner Diff Ausgabe mit blauem, fettem Text auf schwarzem Hintergrund darzustellen, kannst Du folgenden Befehl verwenden:

	$ git config --global color.diff.meta "blue black bold"

<!--You can set the color to any of the following values: normal, black, red, green, yellow, blue, magenta, cyan, or white. If you want an attribute like bold in the previous example, you can choose from bold, dim, ul, blink, and reverse.-->

Du kannst als Farben jeden der folgenden Werte verwenden: `normal`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, oder `white`. Falls Du ein Attribut wie z.B. die Fettschrift aus dem vorigen Beispiel verwenden willst, stehen Dir folgende Werte zur Auswahl: `bold`, `dim`, `ul`, `blink`, und `reverse`.

<!--See the `git config` manpage for all the subsettings you can configure, if you want to do that.-->

Auf der Manpage zu `git config` findest Du eine Liste aller Unteroptionen, die Du konfigurieren kannst.

<!--## External Merge and Diff Tools-->
## Externe Merge- und Diff-Werzeuge

<!--Although Git has an internal implementation of diff, which is what you’ve been using, you can set up an external tool instead. You can also set up a graphical merge conflict-resolution tool instead of having to resolve conflicts manually. I’ll demonstrate setting up the Perforce Visual Merge Tool (P4Merge) to do your diffs and merge resolutions, because it’s a nice graphical tool and it’s free.-->

Bisher hast Du die in Git integrierte Implementierung von diff benutzt, aber Du kannst stattdessen auch eine externe Anwendung verwenden. Du kannst ebenso ein grafisches Merge-Werkzeug zur Auflösung von Konflikten einsetzen, statt diese manuell zu lösen. Ich werde demonstrieren, wie man das grafische Merge-Werkzeug von Perforce (P4Merge) konfiguriert, um Diffs und Merges zu bearbeiten. Ich habe P4Merge gewählt, da es ein freies und gutes grafisches Werkzeug ist.

<!--If you want to try this out, P4Merge works on all major platforms, so you should be able to do so. I’ll use path names in the examples that work on Mac and Linux systems; for Windows, you’ll have to change `/usr/local/bin` to an executable path in your environment.-->

Da P4Merge für die üblichen Plattformen verfügbar ist, sollte es kein Problem sein, es einmal auszuprobieren. In den Beispielen werde ich Pfadnamen nutzen, die auf Mac- und Linux-System funktionieren. Die Windows Benutzer müssen `/usr/local/bin` durch einen Pfad ersetzen, der in der Umgebungsvariable `PATH` gelistet ist.

<!--You can download P4Merge here:-->

Du kannst P4Merge hier herunterladen:

	http://www.perforce.com/perforce/downloads/component.html

<!--To begin, you’ll set up external wrapper scripts to run your commands. I’ll use the Mac path for the executable; in other systems, it will be where your `p4merge` binary is installed. Set up a merge wrapper script named `extMerge` that calls your binary with all the arguments provided:-->

Als erstes solltest Du einige Wrapper Skripte erstellen um Deine Befehle auszuführen. Ich verwende hier die Pfade, die für einen Mac gelten. Auf anderen Systemen muss der Pfad zur ausführbaren Datei von P4Merge entsprechend angepasst werden. Mit den folgenden Befehlen erzeugen wir ein Skript mit dem Namen `extMerge`, welches die Anwendung mit allen angegebenen Argumenten aufruft:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*

<!--The diff wrapper checks to make sure seven arguments are provided and passes two of them to your merge script. By default, Git passes the following arguments to the diff program:-->

Das Wrapper Skript für den Diff Befehl stellt sicher, dass es mit sieben Parametern aufgerufen wird und leitet zwei von diesen an das Merge Skript weiter. Standardmäßig übergibt Git die folgenden Argumente an das Diff-Werkzeug:

	path old-file old-hex old-mode new-file new-hex new-mode

<!--Because you only want the `old-file` and `new-file` arguments, you use the wrapper script to pass the ones you need.-->

Da nur die Parameter `old-file` und `new-file` benötigt werden, verwenden wir das Wrapper Skript um nur die notwendigen Parameter weiterzugeben.

	$ cat /usr/local/bin/extDiff
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

<!--You also need to make sure these tools are executable:-->

Außerdem muss sichergestellt werden, dass die Skripte ausführbar sind::

	$ sudo chmod +x /usr/local/bin/extMerge
	$ sudo chmod +x /usr/local/bin/extDiff

<!--Now you can set up your config file to use your custom merge resolution and diff tools. This takes a number of custom settings: `merge.tool` to tell Git what strategy to use, `mergetool.*.cmd` to specify how to run the command, `mergetool.trustExitCode` to tell Git if the exit code of that program indicates a successful merge resolution or not, and `diff.external` to tell Git what command to run for diffs. So, you can either run four config commands-->

Jetzt kannst Du Git so konfigurieren, dass es Deine persönlichen Merge- und Diff-Werkzeuge benutzt. Dazu sind einige weitere Einstellungen nötig: `merge.tool`, um die von Git verwendete Merge Strategie festzulegen, `mergetool.*.cmd`, um festzulegen, wie der Befehl auszuführen ist, `mergetool.trustExitCode`, damit Git weiß, ob der Exit-Code des Programms eine erfolgreiche Merge Auflösung anzeigt oder nicht, und `diff.external`, um einzustellen welches Diff Kommando Git benutzen soll. Du kannst also entweder die vier folgenden Befehle ausführen

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

<!--or you can edit your `~/.gitconfig` file to add these lines:-->

oder Du bearbeitest Deine `~/.gitconfig` Datei und fügst dort folgende Zeilen hinzu:

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

<!--After all this is set, if you run diff commands such as this:-->

Nach Setzen dieser Einstellungen und beim Ausführen eines Diff Befehls wie den folgenden:

	$ git diff 32d1776b1^ 32d1776b1

<!--Instead of getting the diff output on the command line, Git fires up P4Merge, which looks something like Figure 7-1.-->

wird Git P4Merge starten, anstatt den Vergleich in der Kommandozeile auszugeben. Abbildung 7-1 zeigt hierzu ein Beispiel.

<!--Figure 7-1. P4Merge.-->


![](http://git-scm.com/figures/18333fig0701-tn.png)

Abbildung 7-1. P4Merge

<!--If you try to merge two branches and subsequently have merge conflicts, you can run the command `git mergetool`; it starts P4Merge to let you resolve the conflicts through that GUI tool.-->

Wenn Du versuchst zwei Branches zu mergen und dabei Merge Konflikte auftreten, kannst Du den Befehl `git mergetool` ausführen. Das Kommando startet P4Merge und erlaubt es Dir, die Konflikte mit Hilfe des grafischen Werkzeugs aufzulösen.

<!--The nice thing about this wrapper setup is that you can change your diff and merge tools easily. For example, to change your `extDiff` and `extMerge` tools to run the KDiff3 tool instead, all you have to do is edit your `extMerge` file:-->

Das Tolle an dem Wrapper Ansatz ist, dass Du Deine Diff- und Merge-Werkzeuge sehr leicht wechseln kannst. Wenn Du zum Beispiel für `extDiff` und `extMerge` statt P4Merge, KDiff3 verwenden willst, musst Du lediglich Dein Wrapper Skript `extMerge` anpassen:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

<!--Now, Git will use the KDiff3 tool for diff viewing and merge conflict resolution.-->

Ab jetzt verwendet Git KDiff3 zur Anzeige von Diffs und zur Auflösung von Merge Konflikten.

<!--Git comes preset to use a number of other merge-resolution tools without your having to set up the cmd configuration. You can set your merge tool to kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff, or gvimdiff. If you’re not interested in using KDiff3 for diff but rather want to use it just for merge resolution, and the kdiff3 command is in your path, then you can run-->

Git wird bereits mit Standard-Einstellungen für verschiedene Merge-Auflösungswerkzeuge ausgeliefert, sodass Du diese nicht extra konfigurieren musst. Als Merge-Werkzeug kann Du kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff oder gvimdiff einstellen. Wenn Du KDiff3 nur zum Auflösen von Konflikten und nicht für einen Diff verwenden willst, kannst Du den folgenden Befehl ausführen (vorausgesetzt KDiff3 befindet sich im Standard-Pfad):

	$ git config --global merge.tool kdiff3

<!--If you run this instead of setting up the `extMerge` and `extDiff` files, Git will use KDiff3 for merge resolution and the normal Git diff tool for diffs.-->

Wenn Du diesen Befehl ausführst, anstatt die `extMerge` und `extDiff` Skripte zu erstellen, dann wird Git KDiff3 zum Auflösen von Merge Konflikten verwenden. Für einen Vergleich verwendet Git weiterhin das integrierte Diff-Werkzeug.

<!--## Formatting and Whitespace-->
## Formatierungen und Leerzeichen

<!--Formatting and whitespace issues are some of the more frustrating and subtle problems that many developers encounter when collaborating, especially cross-platform. It’s very easy for patches or other collaborated work to introduce subtle whitespace changes because editors silently introduce them or Windows programmers add carriage returns at the end of lines they touch in cross-platform projects. Git has a few configuration options to help with these issues.-->

Bei der Zusammenarbeit mit anderen Entwicklern sind Probleme mit Formatierungen und Leerzeichen einige der frustrierendsten und heikelsten Themen denen viele Entwickler begegnen, vor allem bei plattformübergreifenden Projekten. Es kann sehr leicht passieren, dass durch Patches oder andere gemeinsame Arbeit fast unmerklich Leerzeichen Änderungen eingeführt werden, z.B. weil ein Editor sie stillschweigend einfügt. Beim Programmieren unter Windows können durch Änderungen an einer Zeile auch leicht Wagenrückläufe (CR) am Zeilenende eingefügt werden (relevant bei plattformübergreifenden Projekten). Git kann mit ein paar Einstellungen hierbei unterstützend eingreifen.

<!--### core.autocrlf-->
### core.autocrlf

<!--If you’re programming on Windows or using another system but working with people who are programming on Windows, you’ll probably run into line-ending issues at some point. This is because Windows uses both a carriage-return character and a linefeed character for newlines in its files, whereas Mac and Linux systems use only the linefeed character. This is a subtle but incredibly annoying fact of cross-platform work.-->

Falls Du unter Windows programmierst oder ein anderes System benutzt und mit anderen zusammenarbeitest, die unter Windows programmieren, wirst Du sehr wahrscheinlich irgendwann Problemen mit Zeilenenden begegnen. Dies liegt daran, dass Windows sowohl ein CR Zeichen, als auch ein LF Zeichen zum Signalisieren einer neuen Zeile in Dateien verwendet. Mac und Linux nutzen stattdessen nur ein LF Zeichen (Mac OS bis Version 9 verwendet ein einzelnes CR Zeichen). Dies ist eine kleine, aber extrem störende Tatsache beim Arbeiten über Plattformgrenzen hinweg.

<!--Git can handle this by auto-converting CRLF line endings into LF when you commit, and vice versa when it checks out code onto your filesystem. You can turn on this functionality with the `core.autocrlf` setting. If you’re on a Windows machine, set it to `true` — this converts LF endings into CRLF when you check out code:-->

Git kann dies vermeiden, indem es CRLF am Zeilenende automatisch zu LF konvertiert, wenn Du ein Commit durchführst, und umgekehrt wenn es Code in Dein lokales Dateisystem auscheckt. Du kannst diese Funktionalität mittels der Option `core.autocrlf` aktivieren. Falls Du auf einem Windows System arbeitest, setze sie auf `true` — dies konvertiert LF zu CRLF, wenn Du Code auscheckst:

	$ git config --global core.autocrlf true

<!--If you’re on a Linux or Mac system that uses LF line endings, then you don’t want Git to automatically convert them when you check out files; however, if a file with CRLF endings accidentally gets introduced, then you may want Git to fix it. You can tell Git to convert CRLF to LF on commit but not the other way around by setting `core.autocrlf` to input:-->

Falls Du auf einem Linux oder Mac System arbeitest, welches LF Zeilenenden verwendet, dann soll Git keine Datei automatisch konvertieren, wenn sie ausgecheckt wird. Wenn allerdings versehentlich eine Datei mit CRLF in das Repository eingeführt wurde, dann möchtest Du vielleicht, dass Git dies automatisch für Dich repariert. Wenn Du den Parameter `core.autocrlf` auf input setzt, wird Git bei einem Commit automatisch CRLF in LF umwandeln. Allerdings nicht in die andere Richtung bei einem Checkout:

	$ git config --global core.autocrlf input

<!--This setup should leave you with CRLF endings in Windows checkouts but LF endings on Mac and Linux systems and in the repository.-->

Mit dieser Einstellung solltest Du CRLF Zeilenenden in unter Windows ausgecheckten Dateien haben und LF Zeilenenden auf Mac und Linux Sytemen und im Repository.

<!--If you’re a Windows programmer doing a Windows-only project, then you can turn off this functionality, recording the carriage returns in the repository by setting the config value to `false`:-->

Falls Du ein Windows Programmierer bist und an einem Projekt arbeitest, welches nur unter Windows entwickelt wird, dann kannst Du diese Funktionalität auch deaktivieren. In diesem Fall werden Zeilenenden mit CRLF im Repository gespeichert. Dazu setzt Du die Option auf `false`:

	$ git config --global core.autocrlf false

<!--### core.whitespace-->
### core.whitespace

<!--Git comes preset to detect and fix some whitespace issues. It can look for four primary whitespace issues — two are enabled by default and can be turned off, and two aren’t enabled by default but can be activated.-->

Git ist so voreingestellt, dass es einige Leerzeichen Probleme erkennen und beheben kann. Es kann nach vier grundlegenden Problemen mit Leerzeichen suchen — Zwei davon sind standardmässig aktiviert und können deaktiviert werden. Die anderen beiden sind inaktiv, können aber aktiviert werden.

<!--The two that are turned on by default are `trailing-space`, which looks for spaces at the end of a line, and `space-before-tab`, which looks for spaces before tabs at the beginning of a line.-->

Die zwei standardmäßig aktiven Optionen sind `trailing-space`, das nach Leerzeichen am Ende einer Zeile sucht, und `space-before-tab`, das nach Leerzeichen vor Tabulatoren am Anfang einer Zeile sucht.

<!--The two that are disabled by default but can be turned on are `indent-with-non-tab`, which looks for lines that begin with eight or more spaces instead of tabs, and `cr-at-eol`, which tells Git that carriage returns at the end of lines are OK.-->

Die beiden aktivierbaren, aber normalerweise deaktivierten Optionen sind `indent-with-non-tab`, welches nach Zeilen sucht, die mit acht oder mehr Leerzeichen anstelle von Tabulatoren beginnen, und `cr-at-eol`, wodurch Git angewiesen wird, dass CR Zeichen am Zeilenende in Ordnung sind.

<!--You can tell Git which of these you want enabled by setting `core.whitespace` to the values you want on or off, separated by commas. You can disable settings by either leaving them out of the setting string or prepending a `-` in front of the value. For example, if you want all but `cr-at-eol` to be set, you can do this:-->

Du kannst Git mitteilen, welche dieser Optionen es aktivieren soll, indem Du `core.whitespace` auf die Werte setzt, die Du an- oder abgeschaltet haben möchtest. Die jeweiligen Werte werden mit einem Komma getrennt. Du kannst Optionen deaktivieren, indem Du sie entweder aus der Parameterliste entfernst, oder ihnen ein `-` Zeichen voranstellst. Wenn Du zum Beispiel alle Optionen außer `cr-at-eol` aktivieren willst, kannst Du folgenden Befehl ausführen:

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

<!--Git will detect these issues when you run a `git diff` command and try to color them so you can possibly fix them before you commit. It will also use these values to help you when you apply patches with `git apply`. When you’re applying patches, you can ask Git to warn you if it’s applying patches with the specified whitespace issues:-->

Git wird die möglichen Problemstellen erkennen, wenn Du den `git diff` Befehl ausführst, und es wird versuchen, sie farblich hervorzuheben, damit Du sie vor einem Commit beheben kannst. Git wird diese Einstellungen auch benutzen, um Dir zu helfen, wenn Du mit `git apply` Patches anwendest. Wenn Du Patches anwendest, kannst Du Git anweisen eine Warnung auszugeben, falls es beim Patchen die spezifizierten Leerzeichenprobleme erkennt:

	$ git apply --whitespace=warn <patch>

<!--Or you can have Git try to automatically fix the issue before applying the patch:-->

Oder Du kannst Git versuchen lassen, diese Probleme automatisch zu beheben, bevor es den Patch anwendet:

	$ git apply --whitespace=fix <patch>

<!--These options apply to the `git rebase` command as well. If you’ve committed whitespace issues but haven’t yet pushed upstream, you can run a `rebase` with the `-\-whitespace=fix` option to have Git automatically fix whitespace issues as it’s rewriting the patches.-->

Diese Optionen gelten auch für den Rebase Befehl. Falls Du einen Commit gemacht hast, der problematische Leerzeichen enthält, aber Du die Änderungen noch nicht auf den Server gepusht hast, kannst Du ein `rebase` mit dem Parameter `--whitespace=fix` ausführen. Damit behebt Git automatisch die Leerzeichenfehler während des Rebase-Vorgangs.

<!--## Server Configuration-->
## Server Konfiguration

<!--Not nearly as many configuration options are available for the server side of Git, but there are a few interesting ones you may want to take note of.-->

Es gibt nicht annähernd so viele Konfigurationsmöglichkeiten für die Serverfunktionalitäten von Git, aber es gibt dabei einige interessante Parameter, die Du Dir anschauen solltest.

<!--### receive.fsckObjects-->
### receive.fsckObjects

<!--By default, Git doesn’t check for consistency all the objects it receives during a push. Although Git can check to make sure each object still matches its SHA-1 checksum and points to valid objects, it doesn’t do that by default on every push. This is a relatively expensive operation and may add a lot of time to each push, depending on the size of the repository or the push. If you want Git to check object consistency on every push, you can force it to do so by setting `receive.fsckObjects` to true:-->

Die Objekte, die Git durch einen Push empfängt, werden von Haus aus nicht auf Konsistenz geprüft. Auch wenn Git sicherstellen kann, dass jedes Objekt mit dessen SHA-1 Checksumme übereinstimmt und auf gültige Objekte verweist, so wird dies standardmäßig nicht bei jedem Push durchgeführt. Das ist eine aufwändige Operation und kann abhängig von der Größe des Repositorys oder dem Push eine Menge Zeit kosten. Wenn Du die Objektkonsistenz bei jedem Push durch Git prüfen lassen willst, so kannst Du das erzwingen, indem Du `receive.fsckObjects` auf ‚true‘ setzt:

	$ git config --system receive.fsckObjects true

<!--Now, Git will check the integrity of your repository before each push is accepted to make sure faulty clients aren’t introducing corrupt data.-->

Ab jetzt prüft Git die Integrität des Repositorys bevor der Push akzeptiert wird. Damit ist sichergestellt, dass kein Client korrupte Daten einspeist.

<!--### receive.denyNonFastForwards-->
### receive.denyNonFastForwards

<!--If you rebase commits that you’ve already pushed and then try to push again, or otherwise try to push a commit to a remote branch that doesn’t contain the commit that the remote branch currently points to, you’ll be denied. This is generally good policy; but in the case of the rebase, you may determine that you know what you’re doing and can force-update the remote branch with a `-f` flag to your push command.-->

Falls Du auf Commits, die bereits gepusht sind, einen Rebase anwendest, und diese dann versuchst zu pushen, wird Git dies mit einer Fehlermeldung zurückweisen. Wenn der Remote Branch auf einen Commit zeigt, welcher nicht in Deinem lokalen Branch enthalten ist und Du versuchst diesen Branch zu pushen, wird sich Git genau gleich verhalten und den Push verweigern. Das ist in den meisten Fällen eine gute Richtlinie, aber im Falle eines Rebase ist eventuell ein anderes Verhalten gewünscht (vorausgesetzt Du weißt was Du tust). Dann kannst Du den Push auch erzwingen, indem Du den Parameter `-f` zu dem Push Kommando hinzufügst.

<!--To disable the ability to force-update remote branches to non-fast-forward references, set `receive.denyNonFastForwards`:-->

Aktualisierungen auf dem Remote Branch, welche nicht einem Fast-Forward entsprechen können durch Setzen des Parameters `receive.denyNonFastForward` auf den Wert ‚true‘ deaktiviert werden:

	$ git config --system receive.denyNonFastForwards true

<!--The other way you can do this is via server-side receive hooks, which I’ll cover in a bit. That approach lets you do more complex things like deny non-fast-forwards to a certain subset of users.-->

Eine andere Möglichkeit ist die Einrichtung von serverseitigen Hooks, die ich etwas später noch beschreiben werde. Dieser Ansatz erlaubt noch komplexere Szenarien. Man kann z.B. die Pushes, welche nicht einem Fast-Forward entsprechen nur für bestimmte Benutzergruppen verweigern.

<!--### receive.denyDeletes-->
### receive.denyDeletes

<!--One of the workarounds to the `denyNonFastForwards` policy is for the user to delete the branch and then push it back up with the new reference. In newer versions of Git (beginning with version 1.6.1), you can set `receive.denyDeletes` to true:-->

Es ist möglich die Option `denyNonFastForwards` zu umgehen, indem man den Remote Branch zuerst löscht und dann mit einer neuen Referenz pusht. In neueren Versionen von Git (ab Version 1.6.1) kann man den Parameter  `receive.denyDeletes` auf ‚true‘ setzen:

	$ git config --system receive.denyDeletes true

<!--This denies branch and tag deletion over a push across the board — no user can do it. To remove remote branches, you must remove the ref files from the server manually. There are also more interesting ways to do this on a per-user basis via ACLs, as you’ll learn at the end of this chapter.-->

Dies verbietet grundsätzlich jedem Benutzer das Löschen eines Branches oder Tags. Um einen Remote Branch zu löschen müssen die ref Dateien manuell vom Server entfernt werden. Es gibt aber auch noch andere interessantere Wege dies auf Benutzerbasis über Zugriffssteuerungslisten (ACL) durchzuführen. Ich werde dies am Ende dieses Kapitel noch vorstellen.

<!--# Git Attributes-->