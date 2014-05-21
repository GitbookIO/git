# Änderungen rückgängig machen

<!--At any stage, you may want to undo something. Here, we’ll review a few basic tools for undoing changes that you’ve made. Be careful, because you can’t always revert some of these undos. This is one of the few areas in Git where you may lose some work if you do it wrong.-->

Es kommt immer wieder mal vor, dass Du Änderungen rückgängig machen willst. Im Folgenden gehen wir auf einige grundlegende Möglichkeiten dazu ein. Sei allerdings vorsichtig damit, denn Du kannst nicht immer alles wieder herstellen, was Du rückgängig gemacht hast. Dies ist eine der wenigen Situationen in Git, in denen man Daten verlieren kann, wenn man etwas falsch macht.

<!--## Changing Your Last Commit-->
## Den letzten Commit ändern

<!--One of the common undos takes place when you commit too early and possibly forget to add some files, or you mess up your commit message. If you want to try that commit again, you can run commit with the `-\-amend` option:-->

Manchmal hat man einen Commit zu früh angelegt und möglicherweise vergessen, einige Dateien hinzuzufügen, oder eine falsche Commit Meldung verwendet. Wenn Du den letzten Commit korrigieren willst, kannst Du dazu `git commit` zusammen mit der `--amend` Option verwenden:

	$ git commit --amend

<!--This command takes your staging area and uses it for the commit. If you’ve made no changes since your last commit (for instance, you run this command immediately after your previous commit), then your snapshot will look exactly the same and all you’ll change is your commit message.-->

Dieser Befehl verwendet Deine Staging Area für den Commit. Wenn Du seit dem letzten Commit keine Änderungen vorgenommen hast (z.B. wenn Du den Befehl unmittelbar nach einem Commit ausführst), wird der Snapshot exakt genauso aussehen wie der vorherige – alles, was Du dann änderst, ist die Commit Meldung.

<!--The same commit-message editor fires up, but it already contains the message of your previous commit. You can edit the message the same as always, but it overwrites your previous commit.-->

Der Texteditor startet wie üblich, aber diesmal enthält er bereits die Meldung aus dem vorherigen Commit. Du kannst diese Meldung wie gewohnt bearbeiten, speichern und die vorherige Meldung dadurch überschreiben.

<!--As an example, if you commit and then realize you forgot to stage the changes in a file you wanted to add to this commit, you can do something like this:-->

Wenn Du beispielsweise einen Commit angelegt hast und dann feststellst, dass Du zuvor vergessen hast, die Änderungen in einer bestimmten Datei zur Staging Area hinzuzufügen, kannst Du folgendes tun:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend

<!--After these three commands, you end up with a single commit — the second commit replaces the results of the first.-->

Diese drei Befehle legen einen einzigen neuen Commit an – der letzte Befehl ersetzt dabei das Ergebnis des ersten Befehls.

<!--## Unstaging a Staged File-->
## Änderungen aus der Staging Area entfernen

<!--The next two sections demonstrate how to wrangle your staging area and working directory changes. The nice part is that the command you use to determine the state of those two areas also reminds you how to undo changes to them. For example, let’s say you’ve changed two files and want to commit them as two separate changes, but you accidentally type `git add *` and stage them both. How can you unstage one of the two? The `git status` command reminds you:-->

Die nächsten zwei Abschnitte gehen darauf ein, wie Du Änderungen in der Staging Area und dem Arbeitsverzeichnis verwalten kannst. Praktischerweise liefert Dir der Befehl `git status`, den Du verwendest, um den Status dieser beiden Bereiche zu überprüfen, zugleich auch einen Hinweis dafür, wie Du Änderungen rückgängig machen kanst. Nehmen wir beispielsweise an, Du hast zwei Dateien geändert und willst sie als zwei seperate Commits anlegen, Du hast aber versehentlich `git add *` ausgeführt und damit beide zur Staging Area hinzugefügt. Wie kannst Du jetzt eine der beiden Änderungen wieder aus der Staging Area nehmen? `git status` gibt Dir einen Hinweis:

	$ git add .
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   README.txt
	        modified:   benchmarks.rb
	

<!--Right below the “Changes to be committed” text, it says "use `git reset HEAD <file>...` to unstage". So, let’s use that advice to unstage the `benchmarks.rb` file:-->

Direkt unter der Zeile „Changes to be committed“ findest Du den Hinweis „use `git reset HEAD <file>...` to unstage“, d.h. „aus der Staging Area zu entfernen“. Wir verwenden nun also diesen Befehl, um die Änderungen an der Datei `benchmarks.rb` aus der Staging Area zu nehmen:

	$ git reset HEAD benchmarks.rb
	Unstaged changes after reset:
	M       benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   README.txt
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

<!--The command is a bit strange, but it works. The `benchmarks.rb` file is modified but once again unstaged.-->

Der Befehl liest sich zunächst vielleicht etwas merkwürdig, aber wie Du siehst, funktioniert er. Die Datei benchmarks.rb ist weiterhin modifiziert, befindet sich aber nicht mehr in der Staging Area.

<!--## Unmodifying a Modified File-->
## Eine Änderung an einer Datei rückgängig machen

<!--What if you realize that you don’t want to keep your changes to the `benchmarks.rb` file? How can you easily unmodify it — revert it back to what it looked like when you last committed (or initially cloned, or however you got it into your working directory)? Luckily, `git status` tells you how to do that, too. In the last example output, the unstaged area looks like this:-->

Was aber, wenn Du die Änderungen an der Datei `benchmarks.rb` überhaupt nicht beibehalten willst? D.h., wenn Du sie in den Zustand zurückversetzen willst, in dem sie sich befand, als Du den letzten Commit angelegt hast (oder das Repository geklont hast). Das ist einfach, und glücklicherweise zeigt der `git status` Befehl ebenfalls bereits einen Hinweis dafür an. Die obige Ausgabe enthält den folgenden Text:

	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

<!--It tells you pretty explicitly how to discard the changes you’ve made (at least, the newer versions of Git, 1.6.1 and later, do this — if you have an older version, we highly recommend upgrading it to get some of these nicer usability features). Let’s do what it says:-->

Das sagt ziemlich klar, was wir zu tun haben um die Änderungen an der Datei zu verwerfen (genauer gesagt, Git tut dies seit der Version 1.6.1 – wenn Du eine ältere Version hast, empfehlen wir dir, sie zu aktualisieren). Wir führen den vorgeschlagenen Befehl also aus:

	$ git checkout -- benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   README.txt
	

<!--You can see that the changes have been reverted. You should also realize that this is a dangerous command: any changes you made to that file are gone — you just copied another file over it. Don’t ever use this command unless you absolutely know that you don’t want the file. If you just need to get it out of the way, we’ll go over stashing and branching in the next chapter; these are generally better ways to go.-->

Die Änderung wurde also rückgängig gemacht: sie taucht nicht mehr in der Liste der geänderten Dateien auf. Sei Dir bewusst, dass dieser Befehl potentiell gefährlich ist, da er Änderungen an einer Datei vollständig verwirft. Es ist also ratsam, ihn nur dann zu verwenden, wenn Du Dir absolut sicher bist, dass Du die Änderungen nicht mehr brauchst. Für Situationen, in denen Du eine Änderung lediglich vorläufig aus dem Weg räumen willst, werden wir im nächsten Kapitel noch auf Stashing und Branching eingehen – die dazu besser geeignet sind.

<!--Remember, anything that is committed in Git can almost always be recovered. Even commits that were on branches that were deleted or commits that were overwritten with an `-\-amend` commit can be recovered (see *Chapter 9* for data recovery). However, anything you lose that was never committed is likely never to be seen again.-->

Beachte, dass alles was jemals in einem Commit in Git enthalten war, fast immer wieder hergestellt werden kann. Selbst Commits, die sich in gelöschten Branches befanden, oder Commits, die mit einem `--amend` Commit überschrieben wurden, können wieder hergestellt werden (siehe Kapitel 9 für Datenrettung). Allerdings wirst Du Änderungen, die es nie in einen Commit geschafft haben, wahrscheinlich auch nie wieder restaurieren können.

<!--# Working with Remotes-->