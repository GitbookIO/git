# Mit Hilfe von Git debuggen

<!--Git also provides a couple of tools to help you debug issues in your projects. Because Git is designed to work with nearly any type of project, these tools are pretty generic, but they can often help you hunt for a bug or culprit when things go wrong.-->

Git bietet auch ein paar Werkzeuge, die den Debug-Vorgang bei einem Projekt unterstützen. Da Git so aufgebaut ist, dass es für nahezu jedes Projekt eingesetzt werden kann, sind diese Werkzeuge sehr generisch gehalten. Wenn gewisse Dinge schief laufen, können Dir aber diese Tools oft helfen, den Bug oder den Übeltäter zu finden.

<!--## File Annotation-->
## Datei Annotation

<!--If you track down a bug in your code and want to know when it was introduced and why, file annotation is often your best tool. It shows you what commit was the last to modify each line of any file. So, if you see that a method in your code is buggy, you can annotate the file with `git blame` to see when each line of the method was last edited and by whom. This example uses the `-L` option to limit the output to lines 12 through 22:-->

Wenn Du nach einem Bug in Deinem Code suchst und gerne wissen willst, wann und warum dieser zum ersten Mal auftrat, dann kann Dir das Werkzeug Datei-Annotation (engl. File Annotation) sicher weiterhelfen. Es kann Dir anzeigen, in welchem Commit die jeweilige Zeile einer Datei zuletzt geändert wurde. Wenn Du also feststellst, dass eine Methode beziehungsweise eine Funktion in Deinem Code nicht mehr das gewünschte Resultat liefert, kannst Du Dir die Datei mit `git blame` genauer ansehen. Nach Aufruf des Befehls zeigt Git Dir an, welche Zeile von welcher Person als letztes geändert wurde, inklusive Datum. Das folgende Beispiel verwendet die Option `-L`, um die Ausgabe auf die Zeilen 12 bis 22 einzuschränken:

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

<!--Notice that the first field is the partial SHA-1 of the commit that last modified that line. The next two fields are values extracted from that commit—the author name and the authored date of that commit — so you can easily see who modified that line and when. After that come the line number and the content of the file. Also note the `^4832fe2` commit lines, which designate that those lines were in this file’s original commit. That commit is when this file was first added to this project, and those lines have been unchanged since. This is a tad confusing, because now you’ve seen at least three different ways that Git uses the `^` to modify a commit SHA, but that is what it means here.-->

In der ersten Spalte wird die Kurzform der SHA1-Prüfsumme des Commits angezeigt, in welchem diese Zeile zuletzt verändert wurde. Die nächsten beiden Spalten weisen auf den Autor des Commits und wann dieser verfasst wurde, hin. Auf diese Weise kannst Du leicht bestimmen, wer die jeweilige Zeile geändert hat und wann dies durchgeführt wurde. In den nächsten Spalten wird die Zeilennummer und der Inhalt der Zeile angezeigt. Die Zeilen mit der SHA-1-Prüfsumme `^4832fe2` weisen darauf hin, dass diese bereits im ersten Commit vorhanden waren. Das ist also der Commit, in dem die Datei „simplegit.rb“ zum Repository hinzugefügt wurde und die Zeilen deuten damit darauf hin, dass diese bisher nie geändert wurden. Das ist für Dich wahrscheinlich ein bisschen verwirrend, denn nun kennst Du bereits drei Möglichkeiten, wie Git mit dem Zeichen `^` einer SHA-Prüfsumme eine neue Bedeutung gibt. Aber in Zusammenhang mit  `git blame` weist das Zeichen auf den eben geschilderten Sachverhalt hin.

<!--Another cool thing about Git is that it doesn’t track file renames explicitly. It records the snapshots and then tries to figure out what was renamed implicitly, after the fact. One of the interesting features of this is that you can ask it to figure out all sorts of code movement as well. If you pass `-C` to `git blame`, Git analyzes the file you’re annotating and tries to figure out where snippets of code within it originally came from if they were copied from elsewhere. Recently, I was refactoring a file named `GITServerHandler.m` into multiple files, one of which was `GITPackUpload.m`. By blaming `GITPackUpload.m` with the `-C` option, I could see where sections of the code originally came from:-->

Eine weitere herausragende Eigenschaft von Git ist die Tatsache, dass es nicht per se das Umbenennen von Dateien verfolgt. Git speichert immer den jeweiligen Schnappschuss des Dateisystems und versucht erst danach zu bestimmen, welche Dateien umbenannt wurden. Das bietet Dir zum Beispiel die Möglichkeit herauszufinden, wie Code innerhalb des Repositorys hin und her verschoben wurde. Wenn Du also die Option `-C` an `git blame` anfügst, analysiert Git die angegebene Datei und versucht herauszufinden, ob und von wo bestimmte Codezeilen herkopiert wurden. Vor kurzem habe ich ein Refactoring an einer Datei mit dem Namen `GITServerHandler.m` durchgeführt. Dabei habe ich diese Datei in mehrere Dateien aufgeteilt, eine davon war `GITPackUpload.m`. Wenn ich jetzt `git blame` mit der Option `-C` auf die Datei `GITPackUpload.m` ausführe, erhalte ich eine Ausgabe mit den Codezeilen, von denen das Ergebnis ursprünglich stammt:

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

<!--This is really useful. Normally, you get as the original commit the commit where you copied the code over, because that is the first time you touched those lines in this file. Git tells you the original commit where you wrote those lines, even if it was in another file.-->

Das ist enorm hilfreich. Für gewöhnlich erhältst Du damit als ursprünglichen Commit, den Commit, von welchem der Code kopiert wurde, da dies der Zeitpunkt war, bei dem diese Zeilen zum ersten Mal angefasst wurden. Git zeigt Dir den ursprünglichen Commit, in dem Du die Zeilen verfasst hast, sogar an, wenn es sich dabei um eine andere Datei handelt.

<!--## Binary Search-->
### Das Bisect Werkzeug – Binäre Suche###

<!--Annotating a file helps if you know where the issue is to begin with. If you don’t know what is breaking, and there have been dozens or hundreds of commits since the last state where you know the code worked, you’ll likely turn to `git bisect` for help. The `bisect` command does a binary search through your commit history to help you identify as quickly as possible which commit introduced an issue.-->

`git blame` kann Dir sehr weiterhelfen, wenn Du bereits weißt, an welcher Stelle das Problem liegt. Wenn Du aber nicht weißt, warum gewisse Dinge schief laufen, und es gibt inzwischen Dutzende oder Hunderte von Commits seit dem letzten funktionierenden Stand, dann solltest Du `git bisect` als Hilfestellung verwenden. Der `bisect` Befehl führt eine binäre Suche durch die Commit-Historie durch und hilft Dir auf schnelle Art und Weise die Commits zu bestimmen, die eventuell für das Problem verantwortlich sind.

<!--Let’s say you just pushed out a release of your code to a production environment, you’re getting bug reports about something that wasn’t happening in your development environment, and you can’t imagine why the code is doing that. You go back to your code, and it turns out you can reproduce the issue, but you can’t figure out what is going wrong. You can bisect the code to find out. First you run `git bisect start` to get things going, and then you use `git bisect bad` to tell the system that the current commit you’re on is broken. Then, you must tell bisect when the last known good state was, using `git bisect good [good_commit]`:-->

Nehmen wir zum Beispiel an, dass Du gerade eben Deinen Code in einer Produktivumgebung veröffentlicht hast und auf einmal bekommst Du zahlreiche Fehlerberichte über Probleme, die in Deiner Entwicklungsumgebung nicht aufgetreten sind. Du kannst Dir auch keinen Reim darauf bilden, warum der Code so reagiert. Nachdem Du Dich noch einmal näher mit Deinem Code beschäftigt hast, stellst Du fest, dass Du die Fehlerwirkung reproduzieren kannst, aber Dir ist es immer noch ein Rätsel, was genau schief läuft. Wenn Du vor einem solchen Problem stehst, hilft Dir es bestimmt, wenn Du die Historie in mehrere Teile aufspaltest (engl. bisect: halbieren, zweiteilen). Als erstes startest Du mit dem Befehl `git bisect start`. Danach gibst Du mit dem Befehl `git bisect bad` an, dass der derzeit ausgecheckte Commit den Fehler aufweist. Jetzt braucht Git noch die Information, in welchem Commit das Problem noch nicht aufgetreten ist. Dazu verwendest Du den Befehl `git bisect good [good_commit]`:

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

<!--Git figured out that about 12 commits came between the commit you marked as the last good commit (v1.0) and the current bad version, and it checked out the middle one for you. At this point, you can run your test to see if the issue exists as of this commit. If it does, then it was introduced sometime before this middle commit; if it doesn’t, then the problem was introduced sometime after the middle commit. It turns out there is no issue here, and you tell Git that by typing `git bisect good` and continue your journey:-->

Nach Ausführen des letzten Befehls, zeigt Git Dir als Erstes an, dass in etwa 12 Commits zwischen der letzten guten Revision (v1.0) und der aktuellen, fehlerhaften Revision liegen. Auf Basis dieser Information hat Git Dir den mittleren Commit ausgecheckt. Jetzt hast Du die Möglichkeit Deine Tests auf Basis des ausgecheckten Stands durchzuführen, um herauszufinden, ob in diesem Commit der Fehler bereits bestand. Wenn der Fehler hier bereits auftritt, dann wurde er in diesem oder in einem der früheren Commits eingefügt. Wenn der Fehler hier noch nicht auftritt, dann wurde er in einem der späteren Commits eingeschleppt. In unserem Beispiel nehmen wir an, dass in diesem Commit der Fehler noch nicht bestand. Das geben wir mit dem Befehl `git bisect good` an und fahren fort:

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

<!--Now you’re on another commit, halfway between the one you just tested and your bad commit. You run your test again and find that this commit is broken, so you tell Git that with `git bisect bad`:-->

Git hat Dir jetzt einen weiteren Commit ausgecheckt, und zwar wieder den mittleren Commit zwischen dem letzten Stand im Repository und dem mittleren Commit aus der letzten Runde. Hier nehmen wir an, dass Du nach Deinen durchgeführten Tests feststellst, dass in diesem Commit der Fehler bereits vorhanden ist. Das müssen wir Git über `git bisect bad` mitteilen:

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

<!--This commit is fine, and now Git has all the information it needs to determine where the issue was introduced. It tells you the SHA-1 of the first bad commit and show some of the commit information and which files were modified in that commit so you can figure out what happened that may have introduced this bug:-->

Git checkt wieder den nächsten mittleren Commit aus und wir stellen fest, dass dieser in Ordnung ist. Ab jetzt hat Git alle notwendigen Informationen um festzustellen, in welchem Commit der Fehler eingebaut wurde. Git zeigt Dir dazu die SHA-1-Prüfsumme des ersten fehlerhaften Commits an. Zusätzlich gibt es noch weitere Commit-Informationen und welche Dateien in diesem Commit geändert wurden, an. Das sollte Dir nun helfen, den Fehler näher zu bestimmen:

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

<!--When you’re finished, you should run `git bisect reset` to reset your HEAD to where you were before you started, or you’ll end up in a weird state:-->

Wenn Du fertig mit der Fehlersuche bist, solltest Du den Befehl `git bisect reset` ausführen. Dies checkt den ursprünglichen Stand aus, den Du ausgecheckt hattest, bevor Du mit der Fehlersuche begonnen hast:

	$ git bisect reset

<!--This is a powerful tool that can help you check hundreds of commits for an introduced bug in minutes. In fact, if you have a script that will exit 0 if the project is good or non-0 if the project is bad, you can fully automate `git bisect`. First, you again tell it the scope of the bisect by providing the known bad and good commits. You can do this by listing them with the `bisect start` command if you want, listing the known bad commit first and the known good commit second:-->

Wie Du vielleicht gesehen hast, ist dieser Befehl ein mächtiges Werkzeug, um Hunderte von Commits auf schnelle Art und Weise nach einem bestimmten Fehler zu durchsuchen. Besonders nützlich ist es, wenn Du ein Skript hast, welches mit dem Fehlercode Null beendet, wenn das Projekt in Ordnung ist und mit einem Fehlercode größer Null, wenn das Projekt Fehler enthält. Wenn Dir ein solches Skript zur Verfügung steht, kannst Du den bisher manuell durchgeführten Vorgang auch automatisieren. Wie im vorigen Beispiel musst Du Git den zuletzt fehlerfreien Commit und den fehlerhaften Commit angeben. Als verkürzte Schreibweise kannst Du an den Befehl `bisect start` den fehlerhaften und den fehlerfreien Commit angeben:

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

<!--Doing so automatically runs `test-error.sh` on each checked-out commit until Git finds the first broken commit. You can also run something like `make` or `make tests` or whatever you have that runs automated tests for you.-->

Wenn Du die untere, genannte Zeile ausführst, führt Git automatisch nach jedem Auscheckvorgang das Skript `test-error.sh` aus und zwar solange bis es den Commit findet, der als erstes ein fehlerhaftes Ergebnis liefert. Statt eines Skripts kannst Du natürlich auch `make` oder `make tests` oder eine beliebige, andere Testumgebung starten.

<!--# Submodules-->