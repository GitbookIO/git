# Interaktives Stagen

<!--Git comes with a couple of scripts that make some command-line tasks easier. Here, you’ll look at a few interactive commands that can help you easily craft your commits to include only certain combinations and parts of files. These tools are very helpful if you modify a bunch of files and then decide that you want those changes to be in several focused commits rather than one big messy commit. This way, you can make sure your commits are logically separate changesets and can be easily reviewed by the developers working with you.-->
<!--If you run `git add` with the `-i` or `-\-interactive` option, Git goes into an interactive shell mode, displaying something like this:-->

Git umfasst eine Reihe von Skripten, die so manche Aufgabe auf der Kommandozeile leichter machen. Im Folgenden schauen wir uns einige interaktive Befehle an, die dabei hilfreich sein können, wenn man Änderungen in vielen Dateien vorgenommen hat, aber nur einige Änderungen gezielt committen will – nicht alles auf einmal in einem riesigen Commit. Auf diese Weise kann man Commits logisch gruppieren und macht es anderen Entwicklern damit leichter, sie zu verstehen. Wenn Du `git add` mit der `-i` oder `--interactive` Option verwendest, geht Git in einen interaktiven Shell-Modus, der in etwa wie folgt aussieht:

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now>

<!--You can see that this command shows you a much different view of your staging area — basically the same information you get with `git status` but a bit more succinct and informative. It lists the changes you’ve staged on the left and unstaged changes on the right.-->

Wie Du siehst, zeigt dieser Befehl eine andere Ansicht der Staging-Area an – im Wesentlichen also die Information, die Du auch mit `git status` erhältst, aber anders formatiert, kurz und knapp, und informativer. Sie listet alle Änderungen, die in der Staging-Area enthalten sind, auf der linken Seite, und alle anderen Änderungen auf der rechten Seite.

<!--After this comes a Commands section. Here you can do a number of things, including staging files, unstaging files, staging parts of files, adding untracked files, and seeing diffs of what has been staged.-->

Danach folgt eine Liste von Befehlen wie, u.a., Dateien ganz oder teilweise stagen und unstagen, nicht versionskontrollierte Dateien hinzufügen, Diffs der gestageten Änderungen anzeigen etc.

<!--## Staging and Unstaging Files-->
## Hinzufügen und Enfernen von Dateien aus der Staging-Area

<!--If you type `2` or `u` at the `What now>` prompt, the script prompts you for which files you want to stage:-->

Wenn Du am `What now>` Prompt `2` oder `u` eingibst, wirst Du als Nächstes gefragt, welche Dateien Du stagen willst:

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

<!--To stage the TODO and index.html files, you can type the numbers:-->

Um z.B. die TODO und index.html Dateien zu stagen, gibst Du die jeweiligen Zahlen ein:

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

<!--The `*` next to each file means the file is selected to be staged. If you press Enter after typing nothing at the `Update>>` prompt, Git takes anything selected and stages it for you:-->

Das `*` neben den Dateinamen bedeutet, dass die Datei ausgewählt ist und zur Staging-Area hinzugefügt werden wird, sobald Du (bei einem sonst leeren `Update>>` Prompt) Enter drückst:

	Update>>
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

<!--Now you can see that the TODO and index.html files are staged and the simplegit.rb file is still unstaged. If you want to unstage the TODO file at this point, you use the `3` or `r` (for revert) option:-->

Du kannst sehen, dass die TODO und index.html Dateien jetzt gestaget sind, während simplegit.rb immer noch ungestaget ist. Wenn Du die TODO unstagen willst, kannst Du die Option `3` oder `r` (für revert) nutzen:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path

<!--Looking at your Git status again, you can see that you’ve unstaged the TODO file:-->

Wenn Du wiederum Deinen Git-Status ansiehst, kannst Du sehen, dass Du die TODO ungestaget hast.

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

<!--To see the diff of what you’ve staged, you can use the `6` or `d` (for diff) command. It shows you a list of your staged files, and you can select the ones for which you would like to see the staged diff. This is much like specifying `git diff -\-cached` on the command line:-->

Um einen Diff dessen zu sehen, das Du gestaget hast, kannst Du den Befehl `6` oder `d` (für diff) nutzen. Dieser zeigt Dir eine Liste der gestageten Dateien, und Du kannst diejenigen auswählen, von denen Du den gestageten Diff sehen willst. Dies ähnelt sehr dem Befehl `git diff --cached` auf der Kommandozeile.

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

<!--With these basic commands, you can use the interactive add mode to deal with your staging area a little more easily.-->

Mit diesen grundlegenden Befehlen kannst Du den interaktiven Hinzufüge-Modus nutzen, um Dir den Umgang mit Deiner Staging-Area etwas zu erleichtern.

<!--## Staging Patches-->
## Patches stagen

<!--It’s also possible for Git to stage certain parts of files and not the rest. For example, if you make two changes to your simplegit.rb file and want to stage one of them and not the other, doing so is very easy in Git. From the interactive prompt, type `5` or `p` (for patch). Git will ask you which files you would like to partially stage; then, for each section of the selected files, it will display hunks of the file diff and ask if you would like to stage them, one by one:-->

Es ist für Git auch möglich, bestimmte Teile einer Datei zu stagen und nicht den Rest. Wenn Du z.B. zwei Veränderungen an der simplegit.rb machst und eine davon stagen willst und die andere nicht, ist dies sehr einfach in Git möglich. Wähle `5` oder `p` (für patch) auf dem interaktiven Prompt. Git wird Dich fragen, welche Dateien Du teilweise stagen willst; dann wird es für jeden Abschnitt der gewählten Dateien Diff-Ausschnitte ausgeben und Dich jeweils einzeln fragen, ob Du sie stagen willst.

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]?

<!--You have a lot of options at this point. Typing `?` shows a list of what you can do:-->

Du hast an diesem Punkt viele Optionen. Tippe `?` ein, um eine Liste der Möglichkeiten zu bekommen:

	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
	y - stage this hunk
	n - do not stage this hunk
	a - stage this and all the remaining hunks in the file
	d - do not stage this hunk nor any of the remaining hunks in the file
	g - select a hunk to go to
	/ - search for a hunk matching the given regex
	j - leave this hunk undecided, see next undecided hunk
	J - leave this hunk undecided, see next hunk
	k - leave this hunk undecided, see previous undecided hunk
	K - leave this hunk undecided, see previous hunk
	s - split the current hunk into smaller hunks
	e - manually edit the current hunk
	? - print help

<!--Generally, you’ll type `y` or `n` if you want to stage each hunk, but staging all of them in certain files or skipping a hunk decision until later can be helpful too. If you stage one part of the file and leave another part unstaged, your status output will look like this:-->

Im Allgemeinen, wirst Du `y` oder `n` nutzen, wenn Du jeden Ausschnitt stagen willst, aber alle Ausschnitte in bestimmten Dateien zu stagen oder die Entscheidung für einen Ausschnitt auf später zu verschieben kann auch sehr hilfreich sein. Wenn Du nur einen Teil der Datei stagest und den anderen ungestaget lässt, sieht Deine Status-Ausgabe in etwa so aus:

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

<!--The status of the simplegit.rb file is interesting. It shows you that a couple of lines are staged and a couple are unstaged. You’ve partially staged this file. At this point, you can exit the interactive adding script and run `git commit` to commit the partially staged files.-->

Der Status der simplegit.rb ist interessant. Er zeigt Dir, dass ein paar Zeilen gestaget und ein paar ungestaget sind. Du hast diese Datei teilweise gestaget. An dieser Stelle kannst Du das interaktive Hinzufüge-Skript verlassen und `git commit` ausführen, um die teilweise gestageten Dateien zu commiten.

<!--Finally, you don’t need to be in interactive add mode to do the partial-file staging — you can start the same script by using `git add -p` or `git add -\-patch` on the command line.-->

Letztendlich musst Du nicht den interaktiven Hinzufüge-Modus nutzen, um Dateien teilweise zu stagen – Du kannst das gleiche Skript starten, indem Du `git add -p` oder `git add --patch` auf der Kommandozeile eingibst.

<!--# Stashing-->