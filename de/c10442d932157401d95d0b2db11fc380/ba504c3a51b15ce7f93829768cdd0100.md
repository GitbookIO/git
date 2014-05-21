# Tipps und Tricks

<!--Before we finish this chapter on basic Git, a few little tips and tricks may make your Git experience a bit simpler, easier, or more familiar. Many people use Git without using any of these tips, and we won’t refer to them or assume you’ve used them later in the book; but you should probably know how to do them.-->

Bevor wir zum Ende dieses Grundlagenkapitels kommen, möchten wir noch einige Tipps und Tricks vorstellen, die Dir den Umgang mit Git ein bisschen vereinfachen können. Du kannst Git natürlich einsetzen, ohne diese Tipps anzuwenden, und wir werden später in diesem Buch auch nicht darauf Bezug nehmen oder sie voraussetzen. Aber wir finden, Du solltest sie kennen, weil sie einfach nützlich sind.

<!--## Auto-Completion-->
## Auto-Vervollständigung

<!--If you use the Bash shell, Git comes with a nice auto-completion script you can enable. Download it directly from the Git source code at https://github.com/git/git/blob/master/contrib/completion/git-completion.bash . Copy this file to your home directory, and add this to your `.bashrc` file:-->

Wenn Du die Bash Shell verwendest, dann kannst Du ein Skript für die Git Auto-Vervollständigung einbinden. Du kannst dieses Skript direkt aus den Git Quellen von https://github.com/git/git/blob/master/contrib/completion/git-completion.bash herunterladen. Kopiere diese Datei in Dein Home Verzeichnis  und füge die folgende Zeile in Deine `.bashrc` Datei hinzu:

	source ~/git-completion.bash

<!--If you want to set up Git to automatically have Bash shell completion for all users, copy this script to the `/opt/local/etc/bash_completion.d` directory on Mac systems or to the `/etc/bash_completion.d/` directory on Linux systems. This is a directory of scripts that Bash will automatically load to provide shell completions.-->

Wenn Du Git Auto-Vervollständigung für alle Benutzer Deines Rechners aufsetzen willst, kopiere das Skript in das Verzeichnis `/opt/local/etc/bash_completion.d` (auf Mac OS X Systemen) bzw. `/etc/bash_completion.d/` (auf Linux Systemen). Bash sucht in diesem Verzeichnis nach Erweiterungen für die Autovervollständigung und lädt sie automatisch.

<!--If you’re using Windows with Git Bash, which is the default when installing Git on Windows with msysGit, auto-completion should be preconfigured.-->

Auf Windows Systemen sollte die Autovervollständigung bereits aktiv sein, wenn Du die Git Bash aus dem msysGit Paket verwendest.

<!--Press the Tab key when you’re writing a Git command, and it should return a set of suggestions for you to pick from:-->

Während Du einen Git Befehl eintippst, kannst Du die Tab Taste drücken und Du erhälst eine Auswahl von Vorschlägen, aus denen Du auswählen kannst:

	$ git co<tab><tab>
	commit config

<!--In this case, typing `git co` and then pressing the Tab key twice suggests commit and config. Adding `m<tab>` completes `git commit` automatically.-->

D.h., wenn Du `git co` schreibst und dann die Tab Taste zwei Mal drückst, erhältst Du die Vorschläge `commit` und `config`. Wenn Du Tab nur ein Mal drückst, vervollständigt den Befehl Deine Eingabe direkt zu `git commit`.

<!--This also works with options, which is probably more useful. For instance, if you’re running a `git log` command and can’t remember one of the options, you can start typing it and press Tab to see what matches:-->

Das funktioniert auch mit Optionen – was oftmals noch hilfreicher ist. Wenn Du beispielsweise `git log` verwenden willst und Dich nicht an eine bestimmte Option erinnern kannst, schreibst Du einfach den Befehl und drückst die Tab Taste, um die Optionen anzuzeigen:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

<!--That’s a pretty nice trick and may save you some time and documentation reading.-->

Du musst also nicht dauernd die Dokumentation zu Rate ziehen und erspart Dir somit etwas Zeit. Ein toller Trick, nicht wahr?

<!--## Git Aliases-->
## Git Aliase

<!--Git doesn’t infer your command if you type it in partially. If you don’t want to type the entire text of each of the Git commands, you can easily set up an alias for each command using `git config`. Here are a couple of examples you may want to set up:-->

Git versucht nicht zu erraten, welchen Befehl Du verwenden willst, wenn Du ihn nur teilweise eingibst. Wenn Du lange Befehle nicht immer wieder eintippen willst, kannst Du mit `git config` auf einfache Weise Aliase definieren. Hier einige Beispiele, die Du vielleicht nützlich findest:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

<!--This means that, for example, instead of typing `git commit`, you just need to type `git ci`. As you go on using Git, you’ll probably use other commands frequently as well; in this case, don’t hesitate to create new aliases.-->

Das heißt, dass Du z.B. einfach `git ci` anstelle von `git commit` schreiben kannst. Wenn Du Git oft verwendest, werden Dir sicher weitere Befehle begegnen, die Du sehr oft nutzt. In diesem Fall zögere nicht, weitere Aliase zu definieren.

<!--This technique can also be very useful in creating commands that you think should exist. For example, to correct the usability problem you encountered with unstaging a file, you can add your own unstage alias to Git:-->

Diese Technik kann auch dabei helfen, Git Befehle zu definieren, von denen Du denkst, es sollte sie geben:

	$ git config --global alias.unstage 'reset HEAD --'

<!--This makes the following two commands equivalent:-->

Das bewirkt, dass die beiden folgenden Befehle äquivalent sind:

	$ git unstage fileA
	$ git reset HEAD fileA

<!--This seems a bit clearer. It’s also common to add a `last` command, like this:-->

Unser neuer Alias ist wahrscheinlich aussagekräftiger, oder? Ein weiterer, typischer Alias ist der `last` Befehl:

	$ git config --global alias.last 'log -1 HEAD'

<!--This way, you can see the last commit easily:-->

Auf diese Weise kannst Du leicht den letzten Commit nachschlagen:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

<!--As you can tell, Git simply replaces the new command with whatever you alias it to. However, maybe you want to run an external command, rather than a Git subcommand. In that case, you start the command with a `!` character. This is useful if you write your own tools that work with a Git repository. We can demonstrate by aliasing `git visual` to run `gitk`:-->

Wie Du Dir denken kannst, ersetzt Git ganz einfach den Alias mit dem jeweiligen Befehl, für den er definiert ist. Wenn Du allerdings einen externen Befehl anstelle eines Git Befehls ausführen willst, kannst Du den Befehl mit einem Auführungszeichen (`!`) am Anfang kennzeichnen. Das ist in der Regel nützlich, wenn Du Deine eigenen Hilfsmittel schreibst, um Git zu erweitern. Wir können das demonstrieren, indem wir `git visual` als `gitk` definieren:

	$ git config --global alias.visual '!gitk'

<!--# Summary-->