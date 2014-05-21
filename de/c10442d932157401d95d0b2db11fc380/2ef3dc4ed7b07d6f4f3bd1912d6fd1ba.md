# Änderungen am Repository nachverfolgen

<!--You have a bona fide Git repository and a checkout or working copy of the files for that project. You need to make some changes and commit snapshots of those changes into your repository each time the project reaches a state you want to record.-->

Du hast jetzt ein voll funktionsfähiges Git Repository und eine Arbeitskopie des Projekts ist in Deinem Verzeichnis ausgecheckt. Du kannst nun die Dateien im Projekt bearbeiten. Immer wenn Dein Projekt einen Zustand erreicht hat, den Du festhalten willst, musst Du diese Änderungen einchecken.

<!--Remember that each file in your working directory can be in one of two states: *tracked* or *untracked*. *Tracked* files are files that were in the last snapshot; they can be *unmodified*, *modified*, or *staged*. *Untracked* files are everything else — any files in your working directory that were not in your last snapshot and are not in your staging area.  When you first clone a repository, all of your files will be tracked and unmodified because you just checked them out and haven’t edited anything.-->

Jede Datei in Deinem Arbeitsverzeichnis kann sich in einem von zwei Zuständen befinden: Änderungen werden verfolgt (engl. tracked) oder nicht (engl. untracked). Alle Dateien, die sich im letzten Snapshot (Commit) befanden, werden in der Versionskontrolle verfolgt. Sie können entweder unverändert (engl. unmodified), modifiziert (engl. modified) oder für den nächsten Commit vorgemerkt (engl. staged) sein. Alle anderen Dateien in Deinem Arbeitsverzeichnis dagegen sind nicht versioniert: das sind all diejenigen Dateien, die nicht schon im letzten Snapshot enthalten waren und die sich nicht in der Staging Area befinden. Wenn Du ein Repository gerade geklont hast, sind alle Dateien versioniert und unverändert – Du hast sie gerade ausgecheckt aber noch nicht verändert.

<!--As you edit files, Git sees them as modified, because you’ve changed them since your last commit. You *stage* these modified files and then commit all your staged changes, and the cycle repeats. This lifecycle is illustrated in Figure 2-1.-->

Sobald Du versionierte Dateien bearbeitest, wird Git sie als modifiziert erkennen, weil Du sie seit dem letzten Commit geändert hast. Du merkst diese geänderten Dateien für den nächsten Commit vor (d.h. Du fügst sie zur Staging Area hinzu bzw. Du stagest sie), legst aus allen markierten Änderungen einen Commit an und der Vorgang beginnt von vorn. Bild 2-1 stellt diesen Zyklus dar:

<!--Figure 2-1. The lifecycle of the status of your files.-->


![](http://git-scm.com/figures/18333fig0201-tn.png)

Bild 2-1. Zyklus der Grundzustände Deiner Dateien

<!--## Checking the Status of Your Files-->
## Den Zustand Deiner Dateien prüfen

<!--The main tool you use to determine which files are in which state is the `git status` command. If you run this command directly after a clone, you should see something like this:-->

Das wichtigste Hilfsmittel, um den Zustand zu überprüfen, in dem sich die Dateien in Deinem Repository gerade befinden, ist der Befehl `git status`. Wenn Du diesen Befehl unmittelbar nach dem Klonen eines Repositorys ausführst, sollte er folgende Ausgabe liefern:

	$ git status
	On branch master
	nothing to commit, working directory clean

<!--This means you have a clean working directory — in other words, no tracked files are modified. Git also doesn’t see any untracked files, or they would be listed here. Finally, the command tells you which branch you’re on. For now, that is always `master`, which is the default; you won’t worry about it here. The next chapter will go over branches and references in detail.-->

Dieser Zustand wird auch als sauberes Arbeitsverzeichnis (engl. clean working directory) bezeichnet. Mit anderen Worten, es gibt keine Dateien, die unter Versionskontrolle stehen und seit dem letzten Commit geändert wurden – andernfalls würden sie hier aufgelistet werden. Außerdem teilt Dir der Befehl mit, in welchem Branch Du Dich gerade befindest. In diesem Beispiel ist dies der Branch `master`. Mach Dir darüber im Moment keine Gedanken, wir werden im nächsten Kapitel auf Branches detailliert eingehen.

<!--Let’s say you add a new file to your project, a simple `README` file. If the file didn’t exist before, and you run `git status`, you see your untracked file like so:-->

Sagen wir Du fügst eine neue `README` Datei zu Deinem Projekt hinzu. Wenn die Datei zuvor nicht existiert hat und Du jetzt `git status` ausführst, zeigt Git die bisher nicht versionierte Datei wie folgt an:

	$ vim README
	$ git status
	On branch master
	Untracked files:
	  (use "git add <file>..." to include in what will be committed)
	
	        README

	nothing added to commit but untracked files present (use "git add" to track)

<!--You can see that your new `README` file is untracked, because it’s under the “Untracked files” heading in your status output. Untracked basically means that Git sees a file you didn’t have in the previous snapshot (commit); Git won’t start including it in your commit snapshots until you explicitly tell it to do so. It does this so you don’t accidentally begin including generated binary files or other files that you did not mean to include. You do want to start including README, so let’s start tracking the file.-->

Alle Dateien, die in der Sektion „Untracked files“ aufgelistet werden, sind Dateien, die bisher nocht nicht versioniert sind. Dort wird jetzt auch die Datei `README` angezeigt. Mit anderen Worten, die Datei `README` wird in diesem Bereich gelistet, weil sie im letzen Snapshot (Commit) von Git nicht enthalten ist. Git nimmt eine solche Datei nicht automatisch in die Versionskontrolle auf, sondern man muss Git dazu ausdrücklich auffordern. Ansonsten würden generierte Binärdateien oder andere Dateien, die Du nicht in Deinem Repository haben willst, automatisch hinzugefügt werden. Das möchte man in den meisten Fällen vermeiden. Jetzt wollen wir aber Änderungen an der Datei `README` verfolgen und fügen sie deshalb zur Versionskontrolle hinzu.

<!--## Tracking New Files-->
## Neue Dateien zur Versionskontrolle hinzufügen

<!--In order to begin tracking a new file, you use the command `git add`. To begin tracking the `README` file, you can run this:-->

Um eine neue Datei zur Versionskontrolle hinzuzufügen, verwendest Du den Befehl `git add`. Für Deine neue `README` Datei kannst Du ihn wie folgt ausführen:

	$ git add README

<!--If you run your status command again, you can see that your `README` file is now tracked and staged:-->

Wenn Du den `git status` Befehl erneut ausführst, siehst Du, dass sich Deine `README` Datei jetzt unter Versionskontrolle befindet und für den nächsten Commit vorgemerkt ist (gestaged ist):

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	

<!--You can tell that it’s staged because it’s under the “Changes to be committed” heading. If you commit at this point, the version of the file at the time you ran `git add` is what will be in the historical snapshot. You may recall that when you ran `git init` earlier, you then ran `git add (files)` — that was to begin tracking files in your directory. The `git add` command takes a path name for either a file or a directory; if it’s a directory, the command adds all the files in that directory recursively.-->

Dass die Datei für den nächsten Commit vorgemerkt ist, siehst Du daran, dass sie in der Sektion „Changes to be committed“ aufgelistet ist. Wenn Du jetzt einen Commit anlegst, wird der Snapshot den Zustand der Datei beinhalten, den sie zum Zeitpunkt des Befehls `git add` hatte. Du erinnerst Dich daran, dass Du, als Du vorhin `git init` ausgeführt hast, anschließend `git add` ausgeführt hast: an dieser Stelle hast Du die Dateien in Deinem Verzeichnis der Versionskontrolle hinzugefügt. Der `git add` Befehl akzeptiert einen Pfadnamen einer Datei oder eines Verzeichnisses. Wenn Du ein Verzeichnis angibst, fügt `git add` alle Dateien in diesem Verzeichnis und allen Unterverzeichnissen rekursiv hinzu.

<!--## Staging Modified Files-->
## Geänderte Dateien stagen

<!--Let’s change a file that was already tracked. If you change a previously tracked file called `benchmarks.rb` and then run your `status` command again, you get something that looks like this:-->

Wenn Du eine bereits versionierte Datei `benchmarks.rb` änderst und den `git status` Befehl ausführst, erhältst Du folgendes:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README

	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

<!--The `benchmarks.rb` file appears under a section named “Changes not staged for commit” — which means that a file that is tracked has been modified in the working directory but not yet staged. To stage it, you run the `git add` command (it’s a multipurpose command — you use it to begin tracking new files, to stage files, and to do other things like marking merge-conflicted files as resolved). Let’s run `git add` now to stage the `benchmarks.rb` file, and then run `git status` again:-->

Die Datei `benchmarks.rb` erscheint in der Sektion „Changes not staged for commit“ – d.h., dass eine versionierte Datei im Arbeitsverzeichnis verändert worden ist, aber noch nicht für den Commit vorgemerkt wurde. Um sie vorzumerken, führst Du den Befehl `git add` aus. (`git add` wird zu verschiedenen Zwecken eingesetzt. Man verwendet ihn, um neue Dateien zur Versionskontrolle hinzuzufügen, Dateien für einen Commit zu markieren und verschiedene andere Dinge – beispielsweise, einen Konflikt aus einem Merge als aufgelöst zu kennzeichnen.)

	$ git add benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	        modified:   benchmarks.rb
	

<!--Both files are staged and will go into your next commit. At this point, suppose you remember one little change that you want to make in `benchmarks.rb` before you commit it. You open it again and make that change, and you’re ready to commit. However, let’s run `git status` one more time:-->

Beide Dateien sind nun für den nächsten Commit vorgemerkt. Nehmen wir an, Du willst jetzt aber noch eine weitere Änderung an der Datei `benchmarks.rb` vornehmen, bevor Du den Commit tatsächlich anlegst. Du öffnest die Datei und änderst sie. Jetzt könntest Du den Commit anlegen. Aber zuvor führen wir noch mal `git status` aus:

	$ vim benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	        modified:   benchmarks.rb
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

<!--What the heck? Now `benchmarks.rb` is listed as both staged and unstaged. How is that possible? It turns out that Git stages a file exactly as it is when you run the `git add` command. If you commit now, the version of `benchmarks.rb` as it was when you last ran the `git add` command is how it will go into the commit, not the version of the file as it looks in your working directory when you run `git commit`. If you modify a file after you run `git add`, you have to run `git add` again to stage the latest version of the file:-->

Huch, was ist das? Jetzt wird `benchmarks.rb` sowohl in der Staging Area als auch als geändert aufgelistet. Die Erklärung dafür ist, dass Git eine Datei in exakt dem Zustand für den Commit vormerkt, in dem sie sich befindet, wenn Du den Befehl `git add` ausführst. Wenn Du den Commit jetzt anlegst, wird die Version der Datei `benchmarks.rb` diejenigen Inhalte haben, die sie hatte, als Du `git add` zuletzt ausgeführt hast – nicht diejenigen, die sie in dem Moment hat, wenn Du den Commit anlegst. Wenn Du stattdessen die gegenwärtige Version im Commit haben willst, kannst Du einfach erneut `git add` ausführen:

	$ git add benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	        modified:   benchmarks.rb
	

<!--## Ignoring Files-->
## Dateien ignorieren

<!--Often, you’ll have a class of files that you don’t want Git to automatically add or even show you as being untracked. These are generally automatically generated files such as log files or files produced by your build system. In such cases, you can create a file listing patterns to match them named `.gitignore`.  Here is an example `.gitignore` file:-->

Du wirst in der Regel eine Reihe von Dateien in Deinem Projektverzeichnis haben, die Du nicht versionieren bzw. im Repository haben willst, wie z.B. automatisch generierte Dateien, wie Logdateien oder Dateien, die Dein Build-System erzeugt. In solchen Fällen kannst Du in der Datei `.gitignore` alle Dateien oder Dateimuster angeben, die Du ignorieren willst.

	$ cat .gitignore
	*.[oa]
	*~

<!--The first line tells Git to ignore any files ending in `.o` or `.a` — *object* and *archive* files that may be the product of building your code. The second line tells Git to ignore all files that end with a tilde (`~`), which is used by many text editors such as Emacs to mark temporary files. You may also include a `log`, `tmp`, or `pid` directory; automatically generated documentation; and so on. Setting up a `.gitignore` file before you get going is generally a good idea so you don’t accidentally commit files that you really don’t want in your Git repository.-->

Die erste Zeile weist Git an, alle Dateien zu ignorieren, die mit einem `.o` oder `.a` enden (also Objekt- und Archiv-Dateien, die von Deinem Build-System erzeugt werden). Die zweite Zeile bewirkt, dass alle Dateien ignoriert werden, die mit einer Tilde (`~`) enden. Viele Texteditoren speichern ihre temporären Dateien auf diese Weise, wie bespielsweise Emacs. Du kannst außerdem Verzeichnisse wie `log`, `tmp` oder `pid` hinzufügen, automatisch erzeugte Dokumentation, und so weiter. Es ist normalerweise empfehlenswert, eine `.gitignore` Datei anzulegen, bevor man mit der eigentlichen Arbeit anfängt, damit man nicht versehentlich Dateien ins Repository hinzufügt, die man dort nicht wirklich haben will.

<!--The rules for the patterns you can put in the `.gitignore` file are as follows:-->

Folgende Regeln gelten in einer `.gitignore` Datei:

<!--*	Blank lines or lines starting with `#` are ignored.-->
<!--*	Standard glob patterns work.-->
<!--*	You can end patterns with a forward slash (`/`) to specify a directory.-->
<!--*	You can negate a pattern by starting it with an exclamation point (`!`).-->

*	Leere Zeilen oder Zeilen, die mit `#` beginnen, werden ignoriert.
*	Standard `glob` Muster funktionieren.
*	Du kannst ein Muster mit einem Schrägstrich (`/`) abschließen, um ein Verzeichnis zu deklarieren.
*	Du kannst ein Muster negieren, indem Du ein Ausrufezeichen (`!`) voranstellst.

<!--Glob patterns are like simplified regular expressions that shells use. An asterisk (`*`) matches zero or more characters; `[abc]` matches any character inside the brackets (in this case `a`, `b`, or `c`); a question mark (`?`) matches a single character; and brackets enclosing characters separated by a hyphen(`[0-9]`) matches any character in the range (in this case 0 through 9) .-->

Glob Muster sind vereinfachte reguläre Ausdrücke, die von der Shell verwendet werden. Ein Stern (`*`) bezeichnet „kein oder mehrere Zeichen“; `[abc]` bezeichnet eines der in den eckigen Klammern angegebenen Zeichen (in diesem Fall also `a`, `b` oder `c`); ein Fragezeichen (`?`) bezeichnet ein beliebiges, einzelnes Zeichen; und eckige Klammern mit Zeichen, die von einem Bindestrich getrennt werden (`[0-9]`) bezeichnen ein Zeichen aus der jeweiligen Menge von Zeichen (in diesem Fall also aus der Menge der Zeichen von 0 bis 9).

<!--Here is another example `.gitignore` file:-->

Hier ist ein weiteres Beispiel für eine `.gitignore` Datei:

<!--	# a comment - this is ignored-->
<!--	# no .a files-->
<!--	*.a-->
<!--	# but do track lib.a, even though you're ignoring .a files above-->
<!--	!lib.a-->
<!--	# only ignore the root TODO file, not subdir/TODO-->
<!--	/TODO-->
<!--	# ignore all files in the build/ directory-->
<!--	build/-->
<!--	# ignore doc/notes.txt, but not doc/server/arch.txt-->
<!--	doc/*.txt-->
<!--	# ignore all .txt files in the doc/ directory-->
<!--	doc/**/*.txt-->

	# ein Kommentar - dieser wird ignoriert
	# ignoriert alle Dateien, die mit .a enden
	*.a
	# nicht aber lib.a Dateien (obwohl obige Zeile *.a ignoriert)
	!lib.a
	# ignoriert eine TODO Datei nur im Wurzelverzeichnis, nicht aber
	/TODO
	# ignoriert alle Dateien im build/ Verzeichnis
	build/
	# ignoriert doc/notes.txt, aber nicht doc/server/arch.txt
	doc/*.txt
	# ignoriert alle .txt Dateien unterhalb des doc/ Verzeichnis
	doc/**/*.txt

<!--A `**/` pattern is available in Git since version 1.8.2.-->

Die Kombination `**/` wurde in der Git Version 1.8.2 eingeführt.

<!--## Viewing Your Staged and Unstaged Changes-->
## Die Änderungen in der Staging Area durchsehen

<!--If the `git status` command is too vague for you — you want to know exactly what you changed, not just which files were changed — you can use the `git diff` command. We’ll cover `git diff` in more detail later; but you’ll probably use it most often to answer these two questions: What have you changed but not yet staged? And what have you staged that you are about to commit? Although `git status` answers those questions very generally, `git diff` shows you the exact lines added and removed — the patch, as it were.-->

Wenn Dir die Ausgabe des Befehl `git status` nicht aussagekräftig genug ist, weil Du exakt wissen willst, was sich geändert hat – und nicht lediglich, welche Dateien geändert wurden – kannst Du den `git diff` Befehl verwenden. Wir werden `git diff` später noch einmal im Detail besprechen, aber Du wirst diesen Befehl in der Regel verwenden wollen, um eine der folgenden, zwei Fragen zu beantworten: Was hast Du geändert, aber noch nicht für einen Commit vorgemerkt? Und welche Änderungen hast Du für einen Commit bereits vorgemerkt? Während `git status` diese Fragen nur mit Dateinamen beantwortet, zeigt Dir `git diff` exakt an, welche Zeilen hinzugefügt, geändert und entfernt wurden. Dies entspricht gewissermaßen einem Patch.

<!--Let’s say you edit and stage the `README` file again and then edit the `benchmarks.rb` file without staging it. If you run your `status` command, you once again see something like this:-->

Nehmen wir an, Du hast die Datei `README` geändert und für einen Commit in der Staging Area vorgemerkt. Dann änderst Du außerdem die Datei `benchmarks.rb`, fügst sie aber noch nicht zur Staging Area hinzu. Wenn Du den `git status` Befehl dann ausführst, zeigt er Dir in etwa Folgendes an:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

<!--To see what you’ve changed but not yet staged, type `git diff` with no other arguments:-->

Um festzustellen, welche Änderungen Du bisher nicht gestaged hast, führe `git diff` ohne irgendwelche weiteren Argumente aus:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

<!--That command compares what is in your working directory with what is in your staging area. The result tells you the changes you’ve made that you haven’t yet staged.-->

Dieser Befehl vergleicht die Inhalte Deines Arbeitsverzeichnisses mit den Inhalten Deiner Staging Area. Das Ergebnis zeigt Dir die Änderungen, die Du an Dateien im Arbeitsverzeichnis vorgenommen, aber noch nicht für den nächsten Commit vorgemerkt hast.

<!--If you want to see what you’ve staged that will go into your next commit, you can use `git diff -\-cached`. (In Git versions 1.6.1 and later, you can also use `git diff -\-staged`, which may be easier to remember.) This command compares your staged changes to your last commit:-->

Wenn Du sehen willst, welche Änderungen in der Staging Area und somit für den nächsten Commit vorgesehen sind, kannst Du `git diff --cached` verwenden. (Ab der Version Git 1.6.1 kannst Du außerdem `git diff --staged` verwenden, was vielleicht leichter zu merken ist.) Dieser Befehl vergleicht die Inhalte der Staging Area mit dem letzten Commit:

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

<!--It’s important to note that `git diff` by itself doesn’t show all changes made since your last commit — only changes that are still unstaged. This can be confusing, because if you’ve staged all of your changes, `git diff` will give you no output.-->

Es ist wichtig, im Kopf zu behalten, dass `git diff` nicht alle Änderungen seit dem letzten Commit anzeigt – er zeigt lediglich diejenigen Änderungen an, die noch nicht in der Staging Area sind. Das kann verwirrend sein. Wenn Du all Deine Änderungen bereits für einen Commit vorgemerkt hast, zeigt `git diff` überhaupt nichts an.

<!--For another example, if you stage the `benchmarks.rb` file and then edit it, you can use `git diff` to see the changes in the file that are staged and the changes that are unstaged:-->

Ein anderes Beispiel: Wenn Du Änderungen an der Datei `benchmarks.rb` bereits zur Staging Area hinzugefügt hast und sie dann anschließend noch mal änderst, kannst Du `git diff` verwenden, um diese letzten Änderungen anzuzeigen, die noch nicht in der Staging Area sind:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   benchmarks.rb
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

<!--Now you can use `git diff` to see what is still unstaged-->

Jetzt kannst Du `git diff` verwenden, um zu sehen, was noch nicht für den nächsten Commit vorgemerkt ist:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats
	+# test line

<!--and `git diff -\-cached` to see what you’ve staged so far:-->

und `git diff --cached`, um zu sehen, was für den nächsten Commit vorgesehen ist:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

<!--## Committing Your Changes-->
## Einen Commit erzeugen

<!--Now that your staging area is set up the way you want it, you can commit your changes. Remember that anything that is still unstaged — any files you have created or modified that you haven’t run `git add` on since you edited them — won’t go into this commit. They will stay as modified files on your disk.-->
<!--In this case, the last time you ran `git status`, you saw that everything was staged, so you’re ready to commit your changes. The simplest way to commit is to type `git commit`:-->

Nachdem Du jetzt alle Änderungen, die Du im nächsten Commit haben willst, in Deiner Staging Area gesammelt hast, kannst Du den Commit anlegen. Denke daran, dass Änderungen, die nicht in der Staging Area sind (also alle Änderungen, die Du vorgenommen hast, seit Du zuletzt `git add` ausgeführt hast), auch nicht in den Commit aufgenommen werden. Sie werden ganz einfach weiterhin als geänderte Dateien im Arbeitsverzeichnis verbleiben. In unserem Beispiel haben wir gesehen, dass alle Änderungen vorgemerkt waren, als wir zuletzt `git status` ausgeführt haben, also können wir den Commit jetzt anlegen. Das geht am einfachsten mit dem Befehl:

	$ git commit

<!--Doing so launches your editor of choice. (This is set by your shell’s `$EDITOR` environment variable — usually vim or emacs, although you can configure it with whatever you want using the `git config -\-global core.editor` command as you saw in *Chapter 1*).-->

Wenn Du diesen Befehl ausführst, wird Git den Texteditor Deiner Wahl starten. (D.h. denjenigen Texteditor, der durch die `$EDITOR` Variable Deiner Shell angegeben wird – normalerweise ist das vim oder emacs, aber Du kannst jeden Editor Deiner Wahl angeben. Wie in Kapitel 1 besprochen, kannst Du dazu `git config --global core.editor` verwenden.)

<!--The editor displays the following text (this example is a Vim screen):-->

Der Editor zeigt in etwa folgenden Text an (dies ist ein Beispiel mit vim):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#       new file:   README
	#       modified:   benchmarks.rb
	#
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

<!--You can see that the default commit message contains the latest output of the `git status` command commented out and one empty line on top. You can remove these comments and type your commit message, or you can leave them there to help you remember what you’re committing. (For an even more explicit reminder of what you’ve modified, you can pass the `-v` option to `git commit`. Doing so also puts the diff of your change in the editor so you can see exactly what you did.) When you exit the editor, Git creates your commit with that commit message (with the comments and diff stripped out).-->

Du siehst, dass die vorausgefüllte Commit Meldung die Ausgabe des letzten `git status` Befehls als einen Kommentar und darüber eine leere Zeile enthält. Du kannst die Kommentare entfernen und Deine eigene Meldung einfügen. Oder Du kannst sie stehen lassen, damit Du siehst, was im Commit enthalten sein wird. (Um die Änderungen noch detaillierter sehen zu können, kannst Du den Befehl `git commit` mit der Option `-v` verwenden. Das fügt zusätzlich das Diff Deiner Änderungen im Editor ein, sodass Du exakt sehen kannst, was sich im Commit befindet.) Wenn Du den Texteditor beendest, erzeugt Git den Commit mit der gegebenen Meldung (d.h., ohne den Kommentar und das Diff).

<!--Alternatively, you can type your commit message inline with the `commit` command by specifying it after a `-m` flag, like this:-->

Alternativ kannst Du die Commit Meldung direkt mit dem Befehl `git commit` angeben, indem Du die Option `-m` wie folgt verwendest:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master 463dc4f] Fix benchmarks for speed
	 2 files changed, 3 insertions(+)
	 create mode 100644 README

<!--Now you’ve created your first commit! You can see that the commit has given you some output about itself: which branch you committed to (`master`), what SHA-1 checksum the commit has (`463dc4f`), how many files were changed, and statistics about lines added and removed in the commit.-->

Du hast jetzt Deinen ersten Commit angelegt! Git zeigt Dir als Rückmeldung einige Details über den neu angelegten Commit an: in welchem Branch er sich befindet (master), welche SHA-1 Checksumme er hat (`463dc4f`, in diesem Fall nur die Kurzform), wie viele Dateien geändert wurden und eine Zusammenfassung über die insgesamt neu hinzugefügten und entfernten Zeilen in diesem Commit.

<!--Remember that the commit records the snapshot you set up in your staging area. Anything you didn’t stage is still sitting there modified; you can do another commit to add it to your history. Every time you perform a commit, you’re recording a snapshot of your project that you can revert to or compare to later.-->

Denke daran, dass jeder neue Commit denjenigen Snapshot aufzeichnet, den Du in der Staging Area vorbereitet hast. Änderungen, die nicht in der Staging Area waren, werden weiterhin als modifizierte Dateien im Arbeitsverzeichnis vorliegen. Jedes Mal wenn Du einen Commit anlegst, zeichnest Du einen Snapshot Deines Projektes auf, zu dem Du zurückkehren oder mit dem Du spätere Änderungen vergleichen kannst.

<!--## Skipping the Staging Area-->
## Die Staging Area überspringen

<!--Although it can be amazingly useful for crafting commits exactly how you want them, the staging area is sometimes a bit more complex than you need in your workflow. If you want to skip the staging area, Git provides a simple shortcut. Providing the `-a` option to the `git commit` command makes Git automatically stage every file that is already tracked before doing the commit, letting you skip the `git add` part:-->

Obwohl die Staging Area unglaublich nützlich ist, um genau diejenigen Commits anzulegen, die Du in Deiner Projekt Historie haben willst, ist sie manchmal auch ein bisschen umständlich. Git stellt Dir deshalb eine Alternative zur Verfügung, mit der Du die Staging Area überspringen kannst. Wenn Du den Befehl `git commit` mit der Option `-a` ausführst, übernimmt Git automatisch alle Änderungen an dejenigen Dateien, die sich bereits unter Versionskontrolle befinden, in den Commit – sodass Du auf diese Weise den Schritt `git add` weglassen kannst:

	$ git status
	On branch master
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	
	no changes added to commit (use "git add" and/or "git commit -a")
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+)

<!--Notice how you don’t have to run `git add` on the `benchmarks.rb` file in this case before you commit.-->

Beachte, dass Du in diesem Fall `git add` zuvor noch nicht ausgeführt hast, die Änderungen an `benchmarks.rb` aber dennoch in den Commit übernommen werden.

<!--## Removing Files-->
## Dateien entfernen

<!--To remove a file from Git, you have to remove it from your tracked files (more accurately, remove it from your staging area) and then commit. The `git rm` command does that and also removes the file from your working directory so you don’t see it as an untracked file next time around.-->

Um eine Datei aus der Git Versionskontrolle zu entfernen, muss diese von den verfolgten Dateien (genauer, aus der Staging Area) entfernt werden und dann mit einem Commit bestätigt werden. Der Befehl `git rm` tut genau das – und löscht die Datei außerdem aus dem Arbeitsverzeichnis, sodass sie dort nicht unbeabsichtigt (als eine nun unversionierte Datei) liegen bleibt.

<!--If you simply remove the file from your working directory, it shows up under the “Changes not staged for commit” (that is, _unstaged_) area of your `git status` output:-->

Wenn Du einfach nur eine Datei aus dem Arbeitsverzeichnis löschst, wird sie in der Sektion „Changes not staged for commit“ angezeigt, wenn Du `git status` ausführst:

	$ rm grit.gemspec
	$ git status
	On branch master
	Changes not staged for commit:
	  (use "git add/rm <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        deleted:    grit.gemspec
	
	no changes added to commit (use "git add" and/or "git commit -a")

<!--Then, if you run `git rm`, it stages the file’s removal:-->

Wenn Du jetzt `git rm` ausführst, wird diese Änderung für den nächsten Commit in der Staging Area vorgemerkt:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        deleted:    grit.gemspec
	

<!--The next time you commit, the file will be gone and no longer tracked. If you modified the file and added it to the index already, you must force the removal with the `-f` option. This is a safety feature to prevent accidental removal of data that hasn’t yet been recorded in a snapshot and that can’t be recovered from Git.-->

Nach dem nächsten Anlegen eines Commits, wird die Datei nicht mehr im Arbeitsverzeichnis liegen und sich nicht länger unter Versionskontrolle befinden. Wenn Du die Datei zuvor geändert und diese Änderung bereits zur Staging Area hinzugefügt hattest, musst Du die Option `-f` verwenden, um zu erzwingen, dass sie gelöscht wird. Dies ist eine Sicherheitsmaßnahme, um zu vermeiden, dass Du versehentlich Daten löschst, die sich bisher noch nicht als Commit Snapshot in der Historie Deines Projektes befinden – und deshalb auch nicht wiederhergestellt werden können.

<!--Another useful thing you may want to do is to keep the file in your working tree but remove it from your staging area. In other words, you may want to keep the file on your hard drive but not have Git track it anymore. This is particularly useful if you forgot to add something to your `.gitignore` file and accidentally staged it, like a large log file or a bunch of `.a` compiled files. To do this, use the `-\-cached` option:-->

Ein anderer Anwendungsfall für `git rm` ist, dass Du eine Datei in Deinem Arbeitsverzeichnis behalten, aber aus der Staging Area nehmen willst. In anderen Worten, Du willst die Datei nicht löschen, sondern aus der Versionskontrolle nehmen. Das könnte zum Beispiel der Fall sein, wenn Du vergessen hattest, eine Datei in `.gitignore` anzugeben und sie versehentlich zur Versionskontrolle hinzugefügt hast, beispielsweise eine große Logdatei oder eine Reihe kompilierter `.a` Dateien. Hierzu kannst Du dann die `--cached` Option verwenden:

	$ git rm --cached readme.txt

<!--You can pass files, directories, and file-glob patterns to the `git rm` command. That means you can do things such as-->

Der `git rm` Befehl akzeptiert Dateien, Verzeichnisse und `glob` Dateimuster. D.h., Du kannst z.B. folgendes tun:

	$ git rm log/\*.log

<!--Note the backslash (`\`) in front of the `*`. This is necessary because Git does its own filename expansion in addition to your shell’s filename expansion. On Windows with the system console, the backslash must be omitted. This command removes all files that have the `.log` extension in the `log/` directory. Or, you can do something like this:-->

Beachte den Backslash (`\`) vor dem Stern (`*`). Er ist nötig, weil Git Dateinamen zusätzlich zur Dateinamen-Expansion Deiner Shell selbst vervollständigt. D.h., dieser Befehl entfernt alle Dateien, die die Erweiterung `.log` haben und sich im `/log` Verzeichnis befinden. Ein anderes Beispiel ist:

	$ git rm \*~

<!--This command removes all files that end with `~`.-->

Dieser Befehl entfernt alle Dateien, die mit einer Tilde (`~`) aufhören.

<!--## Moving Files-->
## Dateien verschieben

<!--Unlike many other VCS systems, Git doesn’t explicitly track file movement. If you rename a file in Git, no metadata is stored in Git that tells it you renamed the file. However, Git is pretty smart about figuring that out after the fact — we’ll deal with detecting file movement a bit later.-->

Anders als andere VCS Systeme verfolgt Git nicht explizit, ob Dateien verschoben werden. Wenn Du eine Datei umbenennst, werden darüber keine Metadaten in der Historie gespeichert. Stattdessen ist Git schlau genug, solche Dinge im Nachhinein zu erkennen. Wir werden uns damit später noch befassen.

<!--Thus it’s a bit confusing that Git has a `mv` command. If you want to rename a file in Git, you can run something like-->

Es ist allerdings ein bisschen verwirrend, dass Git trotzdem einen `git mv` Befehl kennt. Wenn Du eine Datei umbenennen willst, kannst Du folgendes tun:

	$ git mv file_from file_to

<!--and it works fine. In fact, if you run something like this and look at the status, you’ll see that Git considers it a renamed file:-->

Das funktioniert einwandfrei. Wenn Du diesen Befehl ausführst und danach den `git status` ausführst, zeigt Git an, dass die Datei umbenannt wurde:

	$ git mv README.txt README
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        renamed:    README.txt -> README
	

<!--However, this is equivalent to running something like this:-->
Allerdings kannst Du genauso folgendes tun:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

<!--Git figures out that it’s a rename implicitly, so it doesn’t matter if you rename a file that way or with the `mv` command. The only real difference is that `mv` is one command instead of three — it’s a convenience function. More important, you can use any tool you like to rename a file, and address the add/rm later, before you commit.-->

Git ist clever genug, selbst herauszufinden, dass Du die Datei umbenannt hast. Du brauchst dies also nicht explizit mit dem `git mv` Befehl zu tun. Der einzige Unterschied ist, dass Du mit `git mv` nur einen Befehl, nicht drei, ausführen musst – das ist natürlich etwas bequemer. Darüberhinaus kannst Du aber Dateien auf jede beliebige Art und Weise extern umbenennen und dann später `git add` bzw. `git rm` verwenden, wenn Du einen Commit zusammenstellst.

<!--# Viewing the Commit History-->