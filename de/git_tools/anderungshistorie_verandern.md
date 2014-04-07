# Änderungshistorie verändern

<!--Many times, when working with Git, you may want to revise your commit history for some reason. One of the great things about Git is that it allows you to make decisions at the last possible moment. You can decide what files go into which commits right before you commit with the staging area, you can decide that you didn’t mean to be working on something yet with the stash command, and you can rewrite commits that already happened so they look like they happened in a different way. This can involve changing the order of the commits, changing messages or modifying files in a commit, squashing together or splitting apart commits, or removing commits entirely — all before you share your work with others.-->

Beim Arbeiten mit Git kommt es häufig vor, dass man seine Commit-Historie aus irgendeinem Grund noch einmal ändern möchte. Und das Tolle an Git ist, dass es Dir die Möglichkeit bietet, Entscheidungen erst im allerletzten Moment zu treffen. Zum Beispiel bietet Dir Git mit Hilfe der Staging-Area die Möglichkeit, alle Dateien zu sammeln und kurz vor einem Commit zu entscheiden, welche Daten alle in einen Commit wandern sollen. Du kannst auch Deine Dateien, die sich geändert haben, aber noch nicht ins Repository eingepflegt werden sollen, mit dem Stash-Kommando in einem Zwischenspeicher ablegen. Außerdem kannst Du bereits verfasste Commits nachträglich noch einmal ändern, sodass sich die Historie so ändert, als wäre sie ganz anders vorangeschritten. Das kann man zum Beispiel durch Änderung der Reihenfolge der Commits, durch Ändern von Commit-Nachrichten, durch Modifikationen an Dateien innerhalb eines Commits, durch Zusammenfügen zweier Commits zu einem Commit oder durch Löschen eines Commits erreichen. Und das Besondere daran: Das alles, bevor Du Deine Arbeit mit anderen teilst und veröffentlichst.

<!--In this section, you’ll cover how to accomplish these very useful tasks so that you can make your commit history look the way you want before you share it with others.-->

In diesem Kapitel werden wir die nützlichen Arbeitsschritte besprechen, die Dir helfen, Deine Commit-Historie Deinen Wünschen entsprechend zu gestalten, sodass Du Dein Ergebnis danach mit anderen teilen kannst und es damit Deinem gewünschten Ergebnis entspricht.

<!--## Changing the Last Commit-->
## Ändern des letzten Commits

<!--Changing your last commit is probably the most common rewriting of history that you’ll do. You’ll often want to do two basic things to your last commit: change the commit message, or change the snapshot you just recorded by adding, changing and removing files.-->

Am häufigsten möchte man wahrscheinlich seinen letzten durchgeführten Commit noch einmal nachträglich ändern. Meist sind es zwei Dinge, die man verändern möchte: Änderung der eingegebenen Commit-Nachricht oder den eigentlichen Inhalt des Schnappschusses durch Hinzufügen, Ändern oder Löschen von Dateien.

<!--If you only want to modify your last commit message, it’s very simple:-->

Die letzte Commit-Nachricht noch einmal zu ändern ist sehr einfach:

	$ git commit --amend

<!--That drops you into your text editor, which has your last commit message in it, ready for you to modify the message. When you save and close the editor, the editor writes a new commit containing that message and makes it your new last commit.-->

Nach Eingabe dieses Befehls wird der Texteditor mit dem Inhalt der letzten Commit-Nachricht geöffnet. Jetzt hat man Gelegenheit diesen Text zu ändern. Nach dem Speichern und Schließen des Editors, wird die Commit-Nachricht des letzten Commits entsprechend angepasst. Der alte Commit ist dadurch nicht mehr vorhanden und Du erhältst einen neuen Commit mit dem gleichen Inhalt und Deiner neuen Commit-Nachricht.

<!--If you’ve committed and then you want to change the snapshot you committed by adding or changing files, possibly because you forgot to add a newly created file when you originally committed, the process works basically the same way. You stage the changes you want by editing a file and running `git add` on it or `git rm` to a tracked file, and the subsequent `git commit -\-amend` takes your current staging area and makes it the snapshot for the new commit.-->

Wenn Du Deine Änderungen bereits eingecheckt hast und den Schnappschuss nachträglich durch Hinzufügen oder Ändern von Dateien noch einmal ändern möchtest, läuft das im Prinzip auf die gleiche Art und Weise ab. Meist kommt so etwas vor, weil man vergessen hat, eine neu erstellte Datei zu stagen. Wenn so etwas passiert, kannst Du Folgendes machen: Führe Deine gewünschte Änderungen durch Ändern oder Hinzufügen einer Datei aus und stage dieses Ergebnis mit dem Befehl `git add`. Alternativ kannst Du auch mit dem Befehl `git rm` eine Datei aus dem Repository entfernen. Wenn die Staging-Area Dein gewünschtes Ergebnis enthält, führst Du einfach den Befehl  `git commit --amend` aus. Der neue Commit enthält nun die Änderungen aus dem alten Commit plus die Änderungen aus Deiner Staging-Area.

<!--You need to be careful with this technique because amending changes the SHA-1 of the commit. It’s like a very small rebase — don’t amend your last commit if you’ve already pushed it.-->

Mit dem Befehl `--amend` sollte man vorsichtig umgehen, weil sich mit jeder nachträglichen Modifikation eines Commits auch die SHA-1-Prüfsumme ändert. Das Ändern des letzten Commits hat ein ähnliches Verhalten wie das Durchführen eines Rebase-Befehls. Deshalb sollte man einen Commit niemals nachträglich anpassen, wenn dieser bereits veröffentlicht wurde.

<!--## Changing Multiple Commit Messages-->
## Änderung von mehreren Commit-Nachrichten

<!--To modify a commit that is farther back in your history, you must move to more complex tools. Git doesn’t have a modify-history tool, but you can use the rebase tool to rebase a series of commits onto the HEAD they were originally based on instead of moving them to another one. With the interactive rebase tool, you can then stop after each commit you want to modify and change the message, add files, or do whatever you wish. You can run rebase interactively by adding the `-i` option to `git rebase`. You must indicate how far back you want to rewrite commits by telling the command which commit to rebase onto.-->

Um einen Commit, der etwas weiter in der Historie zurückliegt, zu ändern, hilft einem der Befehl `--amend` nicht weiter. Man benötigt dazu ein etwas mächtigeres und komplexeres Werkzeug. Für diese Aufgabe kann man den Rebase-Befehl, den wir bereits kennengelernt haben, auf eine etwas andere Art und Weise nutzen. Anstatt den Rebase auf einen HEAD eines anderen Commits auszuführen, führt man den Rebase auf genau dem gleichen Commit aus, auf dem er bereits basiert. Dazu müssen wir nur den interaktiven Modus des Rebase-Befehls nutzen. Dieser bietet einem die Möglichkeit bei jedem Commit, der geändert werden soll, zu stoppen. Dann kann man seine Änderungen an den Dateien oder an der Commit-Nachricht entsprechend einpflegen und mit dem nächsten Commit fortfahren. Um einen interaktiven Rebase durchzuführen, muss man die Option `-i` an den Befehl `git rebase` anhängen. Außerdem musst Du natürlich bestimmen, wie viele Commits Du ändern möchtest. Dazu musst Du den Commit angeben, auf welchem der Rebase basieren soll.

<!--For example, if you want to change the last three commit messages, or any of the commit messages in that group, you supply as an argument to `git rebase -i` the parent of the last commit you want to edit, which is `HEAD~2^` or `HEAD~3`. It may be easier to remember the `~3` because you’re trying to edit the last three commits; but keep in mind that you’re actually designating four commits ago, the parent of the last commit you want to edit:-->

Wenn Du zum Beispiel die letzten drei, oder eine oder mehrere der letzten drei Commit-Nachrichten ändern möchtest, musst Du zusätzlich zu dem Befehl `git rebase -i` den übergeordneten Commit (also dem Commit, der in der Historie genau ein Commit zurückliegt) des letzten Commits, den Du ändern möchtest, angeben. Bei drei Commit-Nachrichten müsste das Argument also `HEAD~2^` beziehungsweise `HEAD~3` lauten. Wahrscheinlich fällt es Dir leichter das Argument `~3` zu merken, weil Du ja schließlich auf die letzten drei Einträge verweisen möchtest. Du solltest Dir aber bewusst sein, dass Du auf den viertältesten Commit verweisen musst, also den übergeordneten Commit, den Du ändern möchtest.

	$ git rebase -i HEAD~3

<!--Remember again that this is a rebasing command — every commit included in the range `HEAD~3..HEAD` will be rewritten, whether you change the message or not. Don’t include any commit you’ve already pushed to a central server — doing so will confuse other developers by providing an alternate version of the same change.-->

Es ist wichtig, dass Du Dir bewusst bist, dass mit diesem Rebase-Befehl jeder Commit im Bereich `HEAD~3..HEAD` geändert wird, unabhängig davon, ob Du die Commit-Nachricht beziehungsweise den Schnappschuss änderst oder nicht. Der Rebase-Befehl sollte nie einen Commit beinhalten, der bereits an einen zentralen Server gepusht worden ist.
Hältst Du Dich nicht daran, werden sich andere Entwickler über Dich ärgern oder wundern, weil es jetzt eine alternative Version der gleichen Änderung gibt.

<!--Running this command gives you a list of commits in your text editor that looks something like this:-->

Wenn Du den Befehl ausführst, erhältst Du eine Reihe von Commits in Deinem Texteditor. Das könnte in etwa folgendermaßen aussehen:

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

	# Rebase 710f0f8..a5f4a0d onto 710f0f8
	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

<!--It’s important to note that these commits are listed in the opposite order than you normally see them using the `log` command. If you run a `log`, you see something like this:-->

Vielleicht ist es Dir schon aufgefallen, die Commits werden genau in der umgekehrten Reihenfolge dargestellt, wie sie der `log` Befehl ausgegeben hätte. Wenn Du also den Befehl `log` ausführst, erhält man in etwa die folgende Ausgabe:

	$ git log --pretty=format:"%h %s" HEAD~3..HEAD
	a5f4a0d added cat-file
	310154e updated README formatting and added blame
	f7f3f6d changed my name a bit

<!--Notice the reverse order. The interactive rebase gives you a script that it’s going to run. It will start at the commit you specify on the command line (`HEAD~3`) and replay the changes introduced in each of these commits from top to bottom. It lists the oldest at the top, rather than the newest, because that’s the first one it will replay.-->

Siehst Du den Unterschied? Es ist genau die umgekehrte Reihenfolge. Ein interaktiver Rebase wird nach einem festen Schema, einer Art Skript, durchgeführt und der Texteditor zeigt Dir an, wie dieses Skript genau ablaufen wird. Der Rebase startet bei dem Commit, der in der Kommandozeile angegeben wird (`HEAD~3`) und führt die Änderungen, die durch jeden Commit hinzukommen, von oben nach unten aus. Das bedeutet, dass anstatt des neuesten, der älteste Commit ganz oben steht, weil dieser der erste Commit ist, der bearbeitet wird.

<!--You need to edit the script so that it stops at the commit you want to edit. To do so, change the word pick to the word edit for each of the commits you want the script to stop after. For example, to modify only the third commit message, you change the file to look like this:-->

Du musst das Skript so anpassen, dass es an jedem Commit anhält, den Du ändern möchtest. Dazu musst Du bei jedem Commit, an dem das Skript anhalten soll, das Wort „pick“ mit dem Wort „edit“ ersetzen. Um zum Beispiel die drittälteste Commit-Nachricht zu ändern, müssen die Änderungen am Skript in etwa folgendermaßen aussehen:

	edit f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

<!--When you save and exit the editor, Git rewinds you back to the last commit in that list and drops you on the command line with the following message:-->

Nachdem Du das Skript gespeichert und den Editor beendet hast, setzt Git nun alle Änderungen bis zum letzten Commit der Liste zurück und zeigt danach in der Kommandozeile in etwa Folgendes an:

	$ git rebase -i HEAD~3
	Stopped at 7482e0d... updated the gemspec to hopefully work better
	You can amend the commit now, with

	       git commit --amend

	Once you’re satisfied with your changes, run

	       git rebase --continue

<!--These instructions tell you exactly what to do. Type-->

Diese Anweisungen zeigen Dir sehr genau, was Du zu tun hast. Gib also den folgenden Befehl ein:

	$ git commit --amend

<!--Change the commit message, and exit the editor. Then, run-->

Im sich öffnenden Texteditor kannst Du jetzt die Commit-Nachricht ändern und danch wieder schließen. Danach führst Du folgenden Befehl aus:

	$ git rebase --continue

<!--This command will apply the other two commits automatically, and then you’re done. If you change pick to edit on more lines, you can repeat these steps for each commit you change to edit. Each time, Git will stop, let you amend the commit, and continue when you’re finished.-->

Der letzte Befehl speichert die letzten beiden Commits automatisch im Repository und der Rebase ist danach abgeschlossen. Wenn Du in einer weiteren Zeile „pick“ mit „edit“ ersetzt hast, kannst Du die oben dargestellten Schritte entsprechend noch einmal ausführen. Git wird nach jedem Commit anhalten und Dir die Möglichkeit bieten, den Commit anzupassen. Danach kannst Du Git auffordern, den Rebase fortzusetzen (`git rebase --continue`).

<!--## Reordering Commits-->
## Reihenfolge von Commits verändern

<!--You can also use interactive rebases to reorder or remove commits entirely. If you want to remove the "added cat-file" commit and change the order in which the other two commits are introduced, you can change the rebase script from this-->

Mit einem interaktiven Rebase kannst Du ebenso die Reihenfolge von Commits ändern oder sogar komplette Commits löschen. Um den Commit „added cat-file“ zu löschen und die Reihenfolge der beiden anderen Commits zu ändern, kannst Du das vorhandene Skript

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

<!--to this:-->

folgendermaßen ändern:

	pick 310154e updated README formatting and added blame
	pick f7f3f6d changed my name a bit

<!--When you save and exit the editor, Git rewinds your branch to the parent of these commits, applies `310154e` and then `f7f3f6d`, and then stops. You effectively change the order of those commits and remove the "added cat-file" commit completely.-->

Nach dem Speichern und Verlassen des Editors, setzt Git nun alle Änderungen bis zum letzten Commit der Liste zurück, speichert den Commit `310154e`, danach den Commit `310154e` und beendet danach den Rebase. Das Ergebnis: Der Commit „added cat-file“ ist aus der Historie verschwunden und die Reihenfolge der beiden restlichen Commits ist getauscht.

<!--## Squashing Commits-->
## Mehrere Commits zusammenfassen

<!--It’s also possible to take a series of commits and squash them down into a single commit with the interactive rebasing tool. The script puts helpful instructions in the rebase message:-->

Man kann mit einem interaktiven Rebase auch mehrere Commits zu einem einzelnen Commit zusammenfassen. Im Skript der Rebase-Nachricht steht eine Anleitung, wie Du dazu vorgehen musst:

	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

<!--If, instead of "pick" or "edit", you specify "squash", Git applies both that change and the change directly before it and makes you merge the commit messages together. So, if you want to make a single commit from these three commits, you make the script look like this:-->

Wenn Du statt „pick“ oder „edit“, den Befehl „squash“ angibst, führt Git beide Commits zu einem gemeinsamen Commit zusammen und bietet Dir die Möglichkeit, die Commit-Nachricht ebenso entsprechend zu verheiraten. Wenn Du also aus den drei Commits einen einzelnen Commit machen willst, muss Dein Skript folgendermaßen aufgebaut sein:

	pick f7f3f6d changed my name a bit
	squash 310154e updated README formatting and added blame
	squash a5f4a0d added cat-file

<!--When you save and exit the editor, Git applies all three changes and then puts you back into the editor to merge the three commit messages:-->

Nach dem Speichern und Beenden des Editors, führt Git alle drei Änderungen zu einem einzelnen Commit zusammen und öffnet einen Texteditor, der alle drei Commit-Nachrichten enthält:


	# This is a combination of 3 commits.
	# The first commit's message is:
	changed my name a bit

	# This is the 2nd commit message:

	updated README formatting and added blame

	# This is the 3rd commit message:

	added cat-file

<!--When you save that, you have a single commit that introduces the changes of all three previous commits.-->

Du kannst nun die Commit-Nachricht entsprechend anpassen oder auch entsprechend dem vorgeschlagenen Ergebnis belassen. Wenn Du die Commit-Nachricht speicherst, hast Du danach nur noch einen einzelnen Commit, der die letzten drei Commits beinhaltet, in Deiner Historie.

<!--## Splitting a Commit-->
## Aufsplitten eines einzelnen Commits

<!--Splitting a commit undoes a commit and then partially stages and commits as many times as commits you want to end up with. For example, suppose you want to split the middle commit of your three commits. Instead of "updated README formatting and added blame", you want to split it into two commits: "updated README formatting" for the first, and "added blame" for the second. You can do that in the `rebase -i` script by changing the instruction on the commit you want to split to "edit":-->

Man kann mit Git einen einzelnen Commit auch aufsplitten. Das bedeutet, man setzt den ursprünglichen Commit zurück, fügt dann einen Teil der Änderungen zur Staging-Area hinzu und checkt das Ergebnis ein. Dies kann man unbegrenzt oft wiederholen und so einen einzelnen Commit in mehrere Commits aufteilen. Nehmen wir an, wir möchten den mittleren der beiden Commits aufteilen. Anstatt „updated README formatting and added blame“, möchten wir den Commit in folgende beiden Commits aufteilen: „updated README formatting“ soll das Thema des ersten Commits und „added blame“ soll das Thema des zweiten Commits sein. Dazu kannst Du das angezeigte Skript, welches Dir der Befehl `rebase -i` erzeugt, folgendermaßen anpassen:

	pick f7f3f6d changed my name a bit
	edit 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

<!--When you save and exit the editor, Git rewinds to the parent of the first commit in your list, applies the first commit (`f7f3f6d`), applies the second (`310154e`), and drops you to the console. There, you can do a mixed reset of that commit with `git reset HEAD^`, which effectively undoes that commit and leaves the modified files unstaged. Now you can take the changes that have been reset, and create multiple commits out of them. Simply stage and commit files until you have several commits, and run `git rebase -\-continue` when you’re done:-->

Nach dem Speichern und Schließen des Editors, setzt Git die Änderungen entsprechend zurück und wendet den ersten (`f7f3f6d`) und zweiten (`310154e`) Commit an und wechselt danach zurück zur Kommandozeile. Jetzt hast Du die Möglichkeit den letzten Commit zurückzusetzen, ohne dass die Änderungen im Arbeitsverzeichnis zurückgesetzt werden. Das heißt, der Commit im Repository wird gelöscht, aber Deine Änderungen im Arbeitsverzeichnis gehen nicht verloren. Um dies durchzuführen, kannst Du den Befehl `git reset HEAD^` verwenden. Jetzt kannst Du die gewünschten Änderungen für den ersten Commit zur Staging-Area hinzufügen und danach einchecken. Diesen Vorgang kannst Du beliebig wiederholen, bis alle Änderungen eingecheckt sind. Wenn Du fertig bist, kannst Du den Rebase mit `git rebase --continue` fortsetzen beziehungsweise abschließen:

	$ git reset HEAD^
	$ git add README
	$ git commit -m 'updated README formatting'
	$ git add lib/simplegit.rb
	$ git commit -m 'added blame'
	$ git rebase --continue

<!--Git applies the last commit (`a5f4a0d`) in the script, and your history looks like this:-->

Git speichert dazu den letzten Commit (`a5f4a0d`) aus dem Skript im Repository. Das Resultat sieht in etwa folgendermaßen aus:

	$ git log -4 --pretty=format:"%h %s"
	1c002dd added cat-file
	9b29157 added blame
	35cfb2b updated README formatting
	f3cc40e changed my name a bit

<!--Once again, this changes the SHAs of all the commits in your list, so make sure no commit shows up in that list that you’ve already pushed to a shared repository.-->

Ich möchte Dich noch einmal darauf hinweisen, dass jede SHA-Prüfsumme von allen Commits aus der Liste geändert werden. Bitte stell also sicher, dass diese Commits in keinem öffentlichen Repository verfügbar sind.

<!--## The Nuclear Option: filter-branch-->
## Hol den Vorschlaghammer raus: filter-branch

<!--There is another history-rewriting option that you can use if you need to rewrite a larger number of commits in some scriptable way — for instance, changing your e-mail address globally or removing a file from every commit. The command is `filter-branch`, and it can rewrite huge swaths of your history, so you probably shouldn’t use it unless your project isn’t yet public and other people haven’t based work off the commits you’re about to rewrite. However, it can be very useful. You’ll learn a few of the common uses so you can get an idea of some of the things it’s capable of.-->

Es gibt noch eine weitere Möglichkeit, wie man die Historie nach seinen Wünschen anpassen kann. Diese wird oft angewandt, wenn man eine große Zahl von Commits automatisiert mit Hilfe eines Skripts anpassen will. Zum Beispiel kann man damit die E-Mail-Adresse in jedem Commit ändern oder auch eine Datei aus jedem Commit entfernen. Das Werkzeug dazu heißt `filter-branch`. Damit kann man einen riesigen Teil der Historie ändern. Man sollte diesen Befehl also nur verwenden, wenn das Projekt noch nicht weit verbreitet ist, oder andere Personen noch nicht damit begonnen haben an dem Projekt zu arbeiten (also auf Basis der bisherigen Historie neue Branches mit Commits erstellt wurden). Trotzdem kann dieses Werkzeug sehr nützlich sein. Ich möchte hier ein paar der Möglichkeiten dieses Werkzeugs vorstellen.

<!--### Removing a File from Every Commit-->
### Löschen einer Datei aus jedem Commit

<!--This occurs fairly commonly. Someone accidentally commits a huge binary file with a thoughtless `git add .`, and you want to remove it everywhere. Perhaps you accidentally committed a file that contained a password, and you want to make your project open source. `filter-branch` is the tool you probably want to use to scrub your entire history. To remove a file named passwords.txt from your entire history, you can use the `-\-tree-filter` option to `filter-branch`:-->

Dieses Szenario tritt sogar relativ häufig auf. Nehmen wir einmal an, jemand fügt gedankenlos eine große binäre Datei mit `git add .` zum Repository dazu und diese soll aber in keinem der Commits enthalten sein. Oder Du hast aus Versehen eine Datei, welche ein Passwort enthält, zum Repository hinzugefügt und möchtest dieses Repository nun veröffentlichen. `filter-branch` ist dann das Werkzeug Deiner Wahl, um die komplette Historie umzukrempeln. Um eine Datei mit dem Namen „passwords.txt“ aus der kompletten Historie zu löschen, kannst Du die Option `--tree-filter` verwenden:

	$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
	Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
	Ref 'refs/heads/master' was rewritten

<!--The `-\-tree-filter` option runs the specified command after each checkout of the project and then recommits the results. In this case, you remove a file called passwords.txt from every snapshot, whether it exists or not. If you want to remove all accidentally committed editor backup files, you can run something like `git filter-branch -\-tree-filter "rm -f *~" HEAD`.-->

Die Option `--tree-filer` führt den nachfolgenden Befehl nach jedem Auschecken eines Commits des Projekts aus und checkt danach das Ergebnis wieder ein. In diesem Beispiel wird die Datei „passwords.txt“ aus jedem Schnappschuss entfernt, unabhängig davon, ob sie existiert oder nicht. Ein anderes Beispiel wäre es, alle Backup-Dateien eines Texteditors aus dem Repository zu löschen. Dazu kann man in etwa den Befehl `git filter-branch -\-tree-filter "rm -f *~" HEAD` ausführen.

<!--You’ll be able to watch Git rewriting trees and commits and then move the branch pointer at the end. It’s generally a good idea to do this in a testing branch and then hard-reset your master branch after you’ve determined the outcome is what you really want. To run `filter-branch` on all your branches, you can pass `-\-all` to the command.-->

Git informiert Dich über den Fortschritt dieses Vorgangs und Du siehst, wie jeder Commit angepasst wird und der Zeiger auf den Branch auf den letzten Commit gesetzt wird. Es ist empfehlenswert, diesen Befehl in einem Testzweig durchzuführen. Wenn das Ergebnis, wie gewünscht ausfällt, kann man danach den Branch master auf diesen Testzweig setzen. Wenn man an den Befehl `filter-branch` die Option `--all` anfügt, führt Git diesen Vorgang für jeden vorhandenen Zweig aus.

<!--### Making a Subdirectory the New Root-->
### Aus einem Unterverzeichnis das neue Wurzelverzeichnis machen

<!--Suppose you’ve done an import from another source control system and have subdirectories that make no sense (trunk, tags, and so on). If you want to make the `trunk` subdirectory be the new project root for every commit, `filter-branch` can help you do that, too:-->

Wenn man zum Beispiel ein Projekt aus einem anderen Versionskontrollwerkzeug in Git importiert, gibt es dort oft Verzeichnisse, die in Git nicht relevant sind, zum Beispiel trunk, tags, usw.. Wenn man also das Unterverzeichnis `trunk` das neue Wurzelverzeichnis machen will, kann man dies mit Hilfe von `filter-branch` umsetzen:

	$ git filter-branch --subdirectory-filter trunk HEAD
	Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
	Ref 'refs/heads/master' was rewritten

<!--Now your new project root is what was in the `trunk` subdirectory each time. Git will also automatically remove commits that did not affect the subdirectory.-->

Nach der Ausführung dieses Befehls ist das „trunk“ Verzeichnis das neue Arbeitsverzeichnis. Bei diesem Vorgang entfernt Git außerdem alle Commits, die nicht eine Änderung des „trunk“-Verzeichnisses beinhalten.

<!--### Changing E-Mail Addresses Globally-->
### E-Mail Adresse in jedem Commit ändern

<!--Another common case is that you forgot to run `git config` to set your name and e-mail address before you started working, or perhaps you want to open-source a project at work and change all your work e-mail addresses to your personal address. In any case, you can change e-mail addresses in multiple commits in a batch with `filter-branch` as well. You need to be careful to change only the e-mail addresses that are yours, so you use `-\-commit-filter`:-->

Verflixt, es ist schon wieder passiert. Du hast vergessen, den Befehl `git config` auszuführen und Deinen Namen und E-Mail-Adresse zu setzen, bevor Du mit der Arbeit begonnen hast. Mit `filter-branch` kann man diesen Fehler einfach beheben. Man sollte nur darauf achten, dass man nur seine eigene E-Mail-Adresse ändert. Deshalb verwenden wir die Option `--commit-filter`:

	$ git filter-branch --commit-filter '
	        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
	        then
	                GIT_AUTHOR_NAME="Scott Chacon";
	                GIT_AUTHOR_EMAIL="schacon@example.com";
	                git commit-tree "$@";
	        else
	                git commit-tree "$@";
	        fi' HEAD

<!--This goes through and rewrites every commit to have your new address. Because commits contain the SHA-1 values of their parents, this command changes every commit SHA in your history, not just those that have the matching e-mail address.-->

Dieser Befehl durchforstet das Repository und ersetzt in jedem Commit, dessen E-Mail-Adresse des Autors „schacon@localhost“ lautet, mit der neuen E-Mail-Adresse „schacon@example.com“. Zusätzlich wird der Name des Autors geändert, falls dieser nicht vorher schon „Scott Chacon“ war. Auf Grund der Architektur, dass in Git in jedem Commit die SHA1-Prüfsumme des Vorgänger-Commits enthalten ist, ändert dieser Befehl jeden Commit in Deiner Historie. Die SHA1-Prüfsumme wird sich auch in allen Commits, die nicht die angegebene E-Mail-Adresse enthalten, verändern.

<!--# Debugging with Git-->