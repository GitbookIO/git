# Was ist ein Branch?

<!--To really understand the way Git does branching, we need to take a step back and examine how Git stores its data. As you may remember from Chapter 1, Git doesn’t store data as a series of changesets or deltas, but instead as a series of snapshots.-->

Um wirklich zu verstehen wie Git Branching durchführt, müssen wir einen Schritt zurück gehen und untersuchen wie Git die Daten speichert. Wie Du Dich vielleicht noch an Kapitel 1 erinnerst, speichert Git seine Daten nicht als Serie von Änderungen oder Unterschieden, sondern als Serie von Schnappschüssen.

<!--When you commit in Git, Git stores a commit object that contains a pointer to the snapshot of the content you staged, the author and message metadata, and zero or more pointers to the commit or commits that were the direct parents of this commit: zero parents for the first commit, one parent for a normal commit, and multiple parents for a commit that results from a merge of two or more branches.-->

Wenn Du in Git committest, speichert Git ein sogenanntes Commit-Objekt. Dieses enthält einen Zeiger zu dem Schnappschuss mit den Objekten der Staging-Area, dem Autor, den Commit-Metadaten und einem Zeiger zu den direkten Eltern des Commits. Ein initialer Commit hat keine Eltern-Commits, ein normaler Commit stammt von einem Eltern-Commit ab und ein Merge-Commit, welcher aus einer Zusammenführung von zwei oder mehr Branches resultiert, besitzt ebenso viele Eltern-Commits.

<!--To visualize this, let’s assume that you have a directory containing three files, and you stage them all and commit. Staging the files checksums each one (the SHA-1 hash we mentioned in Chapter 1), stores that version of the file in the Git repository (Git refers to them as blobs), and adds that checksum to the staging area:-->

Um das zu verdeutlichen, lass uns annehmen, Du hast ein Verzeichnis mit drei Dateien, die Du alle zu der Staging-Area hinzufügst und in einem Commit verpackst. Durch das Stagen der Dateien erzeugt Git für jede Datei eine Prüfsumme (der SHA-1 Hash, den wir in Kapitel 1 erwähnt haben), speichert diese Version der Datei im Git-Repository (Git referenziert auf diese als Blobs) und fügt die Prüfsumme der Staging-Area hinzu:

	$ git add README test.rb LICENSE
	$ git commit -m 'initial commit of my project'

<!--Running `git commit` checksums all project directories and stores them as `tree` objects in the Git repository. Git then creates a `commit` object that has the metadata and a pointer to the root project `tree` object so it can re-create that snapshot when needed.-->

Wenn Du einen Commit mit dem Kommando `git commit` erstellst, erzeugt Git für jedes Projektverzeichnis eine Prüfsumme und speichert diese als sogenanntes `tree`-Objekt im Git Repository. Git erzeugt dann ein Commit Objekt, das die Metadaten und den Zeiger zum `tree`-Objekt des Wurzelverzeichnis enthält, um bei Bedarf den Snapshot erneut erzeugen zu können.

<!--Your Git repository now contains five objects: one blob for the contents of each of your three files, one tree that lists the contents of the directory and specifies which file names are stored as which blobs, and one commit with the pointer to that root tree and all the commit metadata. Conceptually, the data in your Git repository looks something like Figure 3-1.-->

Dein Git-Repository enthält nun fünf Objekte: einen Blob für den Inhalt jeder der drei Dateien, einen Baum, der den Inhalt des Verzeichnisses auflistet und spezifiziert welcher Dateiname zu welchem Blob gehört, sowie einen Zeiger, der auf die Wurzel des Projektbaumes und die Metadaten des Commits verweist. Prinzipiell sehen Deine Daten im Git Repository wie in Abbildung 3-1 aus.

<!--Figure 3-1. Single commit repository data.-->


![](http://git-scm.com/figures/18333fig0301-tn.png)

Abbildung 3-1. Repository-Daten eines einzelnen Commits.

<!--If you make some changes and commit again, the next commit stores a pointer to the commit that came immediately before it. After two more commits, your history might look something like Figure 3-2.-->

Wenn Du erneut etwas änderst und wieder einen Commit machst, wird dieser einen Zeiger enthalten, der auf den Vorhergehenden verweist. Nach zwei weiteren Commits könnte die Historie wie in Abbildung 3-2 aussehen.

<!--Figure 3-2. Git object data for multiple commits.-->


![](http://git-scm.com/figures/18333fig0302-tn.png)

Abbildung 3-2. Git Objektdaten für mehrere Commits.

<!--A branch in Git is simply a lightweight movable pointer to one of these commits. The default branch name in Git is master. As you initially make commits, you’re given a `master` branch that points to the last commit you made. Every time you commit, it moves forward automatically.-->

Ein Branch in Git ist nichts anderes als ein simpler Zeiger auf einen dieser Commits. Der Standardname eines Git-Branches lautet `master`. Mit dem initialen Commit erhältst Du einen `master`-Branch, der auf Deinen letzten Commit zeigt. Mit jedem Commit bewegt er sich automatisch vorwärts.

<!--Figure 3-3. Branch pointing into the commit data’s history.-->


![](http://git-scm.com/figures/18333fig0303-tn.png)

Abbildung 3-3. Branch, der auf einen Commit in der Historie zeigt.

<!--What happens if you create a new branch? Well, doing so creates a new pointer for you to move around. Let’s say you create a new branch called testing. You do this with the `git branch` command:-->

Was passiert, wenn Du einen neuen Branch erstellst? Nun, zunächst wird ein neuer Zeiger erstellt. Sagen wir, Du erstellst einen neuen Branch mit dem Namen `testing`. Das machst Du mit dem `git branch` Befehl:

	$ git branch testing

<!--This creates a new pointer at the same commit you’re currently on (see Figure 3-4).-->

Dies erzeugt einen neuen Zeiger, der auf den gleichen Commit zeigt, auf dem Du gerade arbeitest (siehe Abbildung 3-4).

<!--Figure 3-4. Multiple branches pointing into the commit’s data history.-->


![](http://git-scm.com/figures/18333fig0304-tn.png)

Abbildung 3-4. Mehrere Branches zeigen in den Commit-Verlauf

<!--How does Git know what branch you’re currently on? It keeps a special pointer called HEAD. Note that this is a lot different than the concept of HEAD in other VCSs you may be used to, such as Subversion or CVS. In Git, this is a pointer to the local branch you’re currently on. In this case, you’re still on master. The git branch command only created a new branch — it didn’t switch to that branch (see Figure 3-5).-->

Woher weiß Git, welchen Branch Du momentan verwendest? Dafür gibt es einen speziellen Zeiger mit dem Namen HEAD. Berücksichtige, dass dieses Konzept sich grundsätzlich von anderen HEAD-Konzepten anderer VCS, wie Subversion oder CVS, unterscheidet. Bei Git handelt es sich bei HEAD um einen Zeiger, der auf Deinen aktuellen lokalen Branch zeigt. In dem Fall bist Du aber immer noch auf dem `master`-Branch. Das `git branch` Kommando hat nur einen neuen Branch erstellt, aber nicht zu diesem gewechselt (siehe Abbildung 3-5).

<!--Figure 3-5. HEAD file pointing to the branch you’re on.-->


![](http://git-scm.com/figures/18333fig0305-tn.png)

Abbildung 3-5. Der HEAD-Zeiger verweist auf Deinen aktuellen Branch.

<!--To switch to an existing branch, you run the `git checkout` command. Let’s switch to the new testing branch:-->

Um zu einem anderen Branch zu wechseln, benutze das Kommando `git checkout`. Lass uns nun zu unserem neuen Branch `testing` wechseln:

	$ git checkout testing

<!--This moves HEAD to point to the testing branch (see Figure 3-6).-->

Das lässt HEAD neuerdings auf den Branch „testing“ verweisen (siehe Abbildung 3-6).

<!--Figure 3-6. HEAD points to another branch when you switch branches.-->


![](http://git-scm.com/figures/18333fig0306-tn.png)

Abbildung 3-6. Wenn Du den Branch wechselst, zeigt HEAD auf einen neuen Zweig.

<!--What is the significance of that? Well, let’s do another commit:-->

Und was bedeutet das? Ok, lass uns noch einen weiteren Commit machen:

	$ vim test.rb
	$ git commit -a -m 'made a change'

<!--Figure 3-7 illustrates the result.-->

Abbildung 3-7 verdeutlicht das Ergebnis.

<!--Figure 3-7. The branch that HEAD points to moves forward with each commit.-->


![](http://git-scm.com/figures/18333fig0307-tn.png)

Abbildung 3-7. Der HEAD-Zeiger schreitet mit jedem weiteren Commit voran.

<!--This is interesting, because now your testing branch has moved forward, but your `master` branch still points to the commit you were on when you ran `git checkout` to switch branches. Let’s switch back to the `master` branch:-->

Das ist interessant, denn Dein Branch `testing` hat sich jetzt voranbewegt und Dein `master`-Branch zeigt immer noch auf seinen letzten Commit. Den Commit, den Du zuletzt bearbeitet hattest, bevor Du mit `git checkout` den aktuellen Zweig gewechselt hast. Lass uns zurück zu dem `master`-Branch wechseln:

	$ git checkout master

<!--Figure 3-8 shows the result.-->

Abbildung 3-8 zeigt das Ergebnis.

<!--Figure 3-8. HEAD moves to another branch on a checkout.-->


![](http://git-scm.com/figures/18333fig0308-tn.png)

Abbildung 3-8. HEAD zeigt nach einem Checkout auf einen anderen Branch.

<!--That command did two things. It moved the HEAD pointer back to point to the `master` branch, and it reverted the files in your working directory back to the snapshot that `master` points to. This also means the changes you make from this point forward will diverge from an older version of the project. It essentially rewinds the work you’ve done in your testing branch temporarily so you can go in a different direction.-->

Das Kommando hat zwei Dinge veranlasst. Zum einen bewegt es den HEAD-Zeiger zurück zum `master`-Branch, zum anderen setzt es alle Dateien im Arbeitsverzeichnis auf den Bearbeitungsstand des letzte Commits in diesem Zweig zurück. Das bedeutet aber auch, dass nun alle Änderungen am Projekt vollkommen unabhängig von älteren Projektversionen erfolgen. Kurz gesagt, werden alle Änderungen aus dem `testing`-Zweig vorübergehend rückgängig gemacht und Du hast die Möglichkeit einen vollkommen neuen Weg in der Entwicklung einzuschlagen.

<!--Let’s make a few changes and commit again:-->

Lass uns ein paar Änderungen machen und mit einem Commit festhalten:

	$ vim test.rb
	$ git commit -a -m 'made other changes'

<!--Now your project history has diverged (see Figure 3-9). You created and switched to a branch, did some work on it, and then switched back to your main branch and did other work. Both of those changes are isolated in separate branches: you can switch back and forth between the branches and merge them together when you’re ready. And you did all that with simple `branch` and `checkout` commands.-->

Nun verzweigen sich die Projektverläufe (siehe Abbildung 3-9). Du hast einen Branch erstellt und zu ihm gewechselt, hast ein bisschen gearbeitet, bist zu Deinem Haupt-Zweig zurückgekehrt und hast da was ganz anderes gemacht. Beide Arbeiten existieren vollständig unabhängig voneinander in zwei unterschiedlichen Branches. Du kannst beliebig zwischen den beiden Zweigen wechseln und sie zusammenführen, wenn Du meinst es wäre soweit. Und das alles hast Du mit simplen `branch` und `checkout`-Befehlen vollbracht.

<!--Figure 3-9. The branch histories have diverged.-->


![](http://git-scm.com/figures/18333fig0309-tn.png)

Abbildung 3-9. Die Historie läuft auseinander.

<!--Because a branch in Git is in actuality a simple file that contains the 40 character SHA-1 checksum of the commit it points to, branches are cheap to create and destroy. Creating a new branch is as quick and simple as writing 41 bytes to a file (40 characters and a newline).-->

Branches können in Git spielend erstellt und entfernt werden, da sie nur kleine Dateien sind, die eine 40 Zeichen lange SHA-1 Prüfsumme der Commits enthalten, auf die sie verweisen. Einen neuen Zweig zu erstellen erzeugt ebenso viel Aufwand wie das Schreiben einer 41 Byte großen Datei (40 Zeichen und einen Zeilenumbruch).

<!--This is in sharp contrast to the way most VCS tools branch, which involves copying all of the project’s files into a second directory. This can take several seconds or even minutes, depending on the size of the project, whereas in Git the process is always instantaneous. Also, because we’re recording the parents when we commit, finding a proper merge base for merging is automatically done for us and is generally very easy to do. These features help encourage developers to create and use branches often.-->

Das steht im krassen Gegensatz zu dem Weg, den die meisten andere VCS Tools beim Thema Branching einschlagen. Diese kopieren oftmals jeden neuen Entwicklungszweig in ein weiteres Verzeichnis, was – je nach Projektgröße – mehrere Minuten in Anspruch nehmen kann, wohingegen Git diese Aufgabe sofort erledigt. Da wir außerdem immer den Ursprungs-Commit festhalten, lässt sich problemlos eine gemeinsame Basis für eine Zusammenführung finden und umsetzen. Diese Eigenschaft soll Entwickler ermutigen Entwicklungszweige häufig zu erstellen und zu nutzen.

<!--Let’s see why you should do so.-->

Lass uns mal sehen, warum Du das machen solltest.

<!--# Basic Branching and Merging-->