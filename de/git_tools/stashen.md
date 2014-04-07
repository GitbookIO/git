# Stashen

<!--Often, when you’ve been working on part of your project, things are in a messy state and you want to switch branches for a bit to work on something else. The problem is, you don’t want to do a commit of half-done work just so you can get back to this point later. The answer to this issue is the `git stash` command.-->

Während man an einer bestimmten Funktion eines Projekts arbeitet, ist es oft so, dass man den Branch wechseln will, weil man an etwas anderem weiterarbeiten will. Meist ist dann auch das Arbeitsverzeichnis in einem chaotischen Zustand, da die Funktion noch nicht fertiggestellt ist. Das Problem dabei ist, dass Du Deine halbfertige Arbeit dann auch nicht committen möchtest, um später daran weiter arbeiten zu können. Die Lösung dieses Problems bietet der `git stash` Befehl.

<!--Stashing takes the dirty state of your working directory — that is, your modified tracked files and staged changes — and saves it on a stack of unfinished changes that you can reapply at any time.-->

Beim Stashen werden die aus Deinem Arbeitsverzeichnis noch nicht committeten Änderungen – also Deine geänderten beobachteten Dateien und die in der Staging-Area enthaltenen Dateien – in einem Stack voller unfertiger Änderungen gespeichert. Diese kannst Du dann jederzeit wieder vom Stack holen und auf Dein Arbeitsverzeichnis anwenden.

<!--## Stashing Your Work-->
## Stash verwenden

<!--To demonstrate, you’ll go into your project and start working on a couple of files and possibly stage one of the changes. If you run `git status`, you can see your dirty state:-->

Um dies zu demonstrieren, gehst Du in Dein Projekt und beginnst an ein paar Dateien zu arbeiten und merkst ein paar dieser Änderungen in der Staging-Area vor. Wenn Du den Befehl `git status` ausführst, siehst Du, dass sich einige Dateien seit dem letzen Commit verändert haben.

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

<!--Now you want to switch branches, but you don’t want to commit what you’ve been working on yet; so you’ll stash the changes. To push a new stash onto your stack, run `git stash`:-->

Jetzt kommt der Zeitpunkt, an dem Du den aktuellen Branch wechseln möchtest. Allerdings willst Du den aktuellen Zustand auch nicht committen, da Deine Arbeit noch nicht ganz fertiggestellt ist. Darum legst Du Deine Änderungen jetzt in einem Stash ab. Um diesen neuen Stash auf dem Stack abzulegen, verwendest Du den Befehl `git stash`:

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

<!--Your working directory is clean:-->

In Deinem Arbeitsverzeichnis befinden sich jetzt keine geänderten Dateien mehr und die Staging-Area ist auch leer:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

<!--At this point, you can easily switch branches and do work elsewhere; your changes are stored on your stack. To see which stashes you’ve stored, you can use `git stash list`:-->

In diesem Zustand, kannst Du in beliebig andere Branches wechseln und an etwas anderem weiterarbeiten. Deine Änderungen sind alle in einem Stack gesichert. Um eine Übersicht, der bereits gestashten Änderungen anzusehen, kannst Du den Befehl `git stash list` verwenden:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

<!--In this case, two stashes were done previously, so you have access to three different stashed works. You can reapply the one you just stashed by using the command shown in the help output of the original stash command: `git stash apply`. If you want to apply one of the older stashes, you can specify it by naming it, like this: `git stash apply stash@{2}`. If you don’t specify a stash, Git assumes the most recent stash and tries to apply it:-->

In diesem Beispiel waren bereits zwei Stashes auf dem Stack vorhanden. Sie wurden zu einem früheren Zeitpunkt gespeichert. Dir stehen jetzt also drei verschiedene Stashes auf dem Stack zur Verfügung. Mit dem Befehl `git stash apply` kannst Du die zuletzt gestashten Änderungen in Deinem Arbeitsverzeichnis wiederherstellen. Git zeigt diesen Befehlsaufruf auch bei Ausführen des Befehls `git stash` als Hilfestellung an. Wenn Du einen der älteren Stashes auf Dein Arbeitsverzeichnis anwenden willst, kannst Du den entsprechenden Stashnamen an den Befehl anhängen: `git stash apply stash@{2}`. Wie Du bereits gesehen hast, verwendet Git die zuletzt gestashten Änderungen und versucht diese im Arbeitsverzeichnis wiederherzustellen, wenn der Stashname nicht angegeben wird:

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

<!--You can see that Git re-modifies the files you uncommitted when you saved the stash. In this case, you had a clean working directory when you tried to apply the stash, and you tried to apply it on the same branch you saved it from; but having a clean working directory and applying it on the same branch aren’t necessary to successfully apply a stash. You can save a stash on one branch, switch to another branch later, and try to reapply the changes. You can also have modified and uncommitted files in your working directory when you apply a stash — Git gives you merge conflicts if anything no longer applies cleanly.-->

Wie Du sehen kannst, stellt Git die Dateien wieder her, die Du in einem Stash gespeichert hast. In dem Beispiel war Dein Arbeitsverzeichnis in einem sauberen Zustand, als Du versucht hast, den Stash zurückzuladen. Ebenso wurde der Stash auf dem gleichen Branch angewandt, der auch beim Stashen der Änderungen ausgecheckt war. Aber es ist nicht zwingend notwendig, dass der gleiche Branch verwendet wird und dass das Arbeitsverzeichnis in einem sauberen Zustand ist, wenn ein Stash zurückgeladen wird. Du kannst die Änderungen in einem Stash ablegen, zu einem anderen Branch wechseln und die Änderungen in diesem neuen Branch wiederherstellen. Es können auch geänderte oder gestagte Dateien im Arbeitsverzeichnis vorhanden sein, während ein Stash zurückgeladen wird. Können die Änderungen nicht ordnungsgemäß zurückgeladen werden, zeigt Git einen entsprechenden Merge-Konflikt an.

<!--The changes to your files were reapplied, but the file you staged before wasn’t restaged. To do that, you must run the `git stash apply` command with a `-\-index` option to tell the command to try to reapply the staged changes. If you had run that instead, you’d have gotten back to your original position:-->

Die Änderungen an den Dateien wurden in Deinem Arbeitsverzeichnis wiederhergestellt. Allerdings ist die Datei, die beim Stashen in der Staging-Area vorhanden war, nicht automatisch wieder in die Staging-Area gewandert. Wenn Du die Option `--index` an den Befehl `git stash apply` anhängst, wird Git versuchen, die Dateien wieder zu stagen. Wenn Du diesen Befehl angewandt hättest, wäre Dein Arbeitsverzeichnis und Deine Staging-Area im exakt gleichen Zustand, wie vor dem Stashen:

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

<!--The apply option only tries to apply the stashed work — you continue to have it on your stack. To remove it, you can run `git stash drop` with the name of the stash to remove:-->

Mit der Option `apply` wird nur versucht die Änderungen wiederherzustellen. Der Stash an sich bleibt weiterhin auf dem Stack vorhanden. Um diesen zu entfernen, kannst Du den Befehl `git stash drop` zusammen mit dem Namen des Stashes anwenden:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

<!--You can also run `git stash pop` to apply the stash and then immediately drop it from your stack.-->

Um den Stash zurückzuführen und gleichzeitig vom Stack zu entfernen, kann der Befehl `git stash pop` verwendet werden.

<!--## Un-applying a Stash-->
## Zurückgeführten Stash wieder rückgängig machen

<!--In some use case scenarios you might want to apply stashed changes, do some work, but then un-apply those changes that originally came from the stash. Git does not provide such a `stash unapply` command, but it is possible to achieve the effect by simply retrieving the patch associated with a stash and applying it in reverse:-->

Stellen wir uns folgendes Szenario vor: Du wendest die Änderungen eines Stashes wieder auf das Arbeitsverzeichnis an und änderst danach noch ein paar Dateien von Hand. Jetzt möchtest Du die Änderungen, die vom Stash her rühren, aber wieder rückgängig machen. Git besitzt kein Feature, welches dies möglich macht. Allerdings kann man den gleichen Effekt erzeugen, indem man vom betreffenden Stash einen Patch erzeugt und diesen mit der Option `-R` wieder anwendet (Patch rückwärts anwenden).

    $ git stash show -p stash@{0} | git apply -R

<!--Again, if you don’t specify a stash, Git assumes the most recent stash:-->

An dieser Stelle noch einmal der Hinweis, dass Git den zuletzt erstellten Stash verwendet, wenn kein Stashname angegeben wird:

    $ git stash show -p | git apply -R

<!--You may want to create an alias and effectively add a `stash-unapply` command to your Git. For example:-->

Wenn Du dieses Feature öfters benötigst, ist es wahrscheinlich sinnvoll, einen Alias `stash-unapply` in Git dafür anzulegen:

    $ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
    $ git stash
    $ #... work work work
    $ git stash-unapply

<!--## Creating a Branch from a Stash-->
## Branch auf Basis eines Stashes erzeugen

<!--If you stash some work, leave it there for a while, and continue on the branch from which you stashed the work, you may have a problem reapplying the work. If the apply tries to modify a file that you’ve since modified, you’ll get a merge conflict and will have to try to resolve it. If you want an easier way to test the stashed changes again, you can run `git stash branch`, which creates a new branch for you, checks out the commit you were on when you stashed your work, reapplies your work there, and then drops the stash if it applies successfully:-->

Wenn Du einen Teil Deiner Arbeit in einem Stash ablegst, dort eine Weile liegen lässt und danach Deine Arbeit an dem Branch fortsetzt, der auch für den Stash verwendet wurde, hast Du vielleicht später Probleme beim Zurückführen des Stashes. Wenn beim Anwenden des Stashes Dateien modifiziert werden sollen, die Du im bisherigen Verlauf bereits geänderst hast, werden Merge-Konflikte auftreten, die Du manuell auflösen musst. Wenn Du nach einer einfachen Möglichkeit suchst, die gestashten Änderungen separat zu testen, kannst Du den Befehl `git stash branch` verwenden. Dieser Befehl erzeugt einen neuen Branch, checkt den Commit aus, auf dessen Basis der Stash erstellt wurde, und führt den Stash wieder in das Arbeitsverzeichnis zurück. Wenn dabei kein Fehler auftritt, wird der Stash automatisch gelöscht:

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

<!--This is a nice shortcut to recover stashed work easily and work on it in a new branch.-->

Damit ist es auf einfache Art und Weise möglich, die gestashten Änderungen in einem neuen Branch wiederherzustellen und daran weiterzuarbeiten.

<!--# Rewriting History-->