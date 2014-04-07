# Subtree Merging

<!--Now that you’ve seen the difficulties of the submodule system, let’s look at an alternate way to solve the same problem. When Git merges, it looks at what it has to merge together and then chooses an appropriate merging strategy to use. If you’re merging two branches, Git uses a _recursive_ strategy. If you’re merging more than two branches, Git picks the _octopus_ strategy. These strategies are automatically chosen for you because the recursive strategy can handle complex three-way merge situations — for example, more than one common ancestor — but it can only handle merging two branches. The octopus merge can handle multiple branches but is more cautious to avoid difficult conflicts, so it’s chosen as the default strategy if you’re trying to merge more than two branches.-->

Nachdem wir neben den Vor- und Nachteilen beim Arbeiten mit Submodulen kennengelernt haben, möchte ich jetzt noch eine alternative Lösung zeigen, wie man ähnliche Probleme lösen kann. Wenn Git etwas zusammenführt, also mergt, analysiert es die Teile, die es mergen muss. Auf Basis dieser Analyse entscheidet Git sich für eine geeignete Merging-Methode. Wenn man zwei Branches mergt, dann verwendet Git automatisch die sogenannte Recursive-Strategie. Wenn man mehr als zwei Branches mergt, verwendet Git die sogenannte Octopus-Strategie. Diese Strategien werden automatisch für Dich gewählt, weil die Recursive-Strategie normalerweise sehr gut geeignet ist, um einen Drei-Wege-Merge (engl. three-way merge) durchzuführen — zum Beispiel, wenn es mehr als einen gemeinsamen Vorgänger-Commit gibt — aber der Drei-Wege-Merge ist nur für das Mergen von zwei Branches geeignet. Die Octopus-Merge-Strategie kann mehrere Branches zusammenführen, aber es wird dabei vorsichtiger vorgegangen, um schwierig aufzulösende Konflikte zu vermeiden. Aus diesem Grund wird diese Strategie standardmäßig verwendet, wenn man mehr als zwei Branches zusammenführen möchte.

<!--However, there are other strategies you can choose as well. One of them is the _subtree_ merge, and you can use it to deal with the subproject issue. Here you’ll see how to do the same rack embedding as in the last section, but using subtree merges instead.-->

Es gibt jedoch noch weitere Strategien, die man verwenden kann. Einer dieser Strategien ist der sogenannte Subtree-Merge. Dies kann verwendet werden, um unser Problem mit Unterprojekten zu lösen. Ich möchte Dir im Folgenden aufzeigen, wie man das Rack-Projekt aus dem letzten Kapitel einbindet und dabei den Subtree-Merge anstatt der Submodule verwendet.

<!--The idea of the subtree merge is that you have two projects, and one of the projects maps to a subdirectory of the other one and vice versa. When you specify a subtree merge, Git is smart enough to figure out that one is a subtree of the other and merge appropriately — it’s pretty amazing.-->

Das Prinzip, das hinter einem Subtree-Merge steckt, ist, dass man zwei Projekte hat und eines der Projekte wird in ein Unterverzeichnis des anderen Projekts abgebildet. Wenn man ein Subtree-Merge ausführt, ist Git schlau genug, um zu erkennen, dass ein Projekt ein Abbild von einem anderen Projekt ist und es kann den Merge in geeigneter Weise durchführen — das ist wirklich sehr erstaunlich.

<!--You first add the Rack application to your project. You add the Rack project as a remote reference in your own project and then check it out into its own branch:-->

Als erstes musst Du dazu die Rack-Applikation zu Deinem Projekt hinzufügen. Dazu fügst Du das Rack-Projekt als neues Remote-Repository in Deinem Projekt hinzu und checkst dieses in einem separaten Branch aus:

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

<!--Now you have the root of the Rack project in your `rack_branch` branch and your own project in the `master` branch. If you check out one and then the other, you can see that they have different project roots:-->

Nach der Ausführung der drei Befehle befindet sich das Rack-Projekt in Deinem Branch `rack_branch` und Dein eigenes Projekt liegt weiterhin im Branch `master`. Wenn man jetzt den jeweiligen Zweig auscheckt, sieht man die unterschiedlichen Inhalte im Wurzelverzeichnis:

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

<!--You want to pull the Rack project into your `master` project as a subdirectory. You can do that in Git with `git read-tree`. You’ll learn more about `read-tree` and its friends in Chapter 9, but for now know that it reads the root tree of one branch into your current staging area and working directory. You just switched back to your `master` branch, and you pull the `rack` branch into the `rack` subdirectory of your `master` branch of your main project:-->

Jetzt möchten wir das Rack-Projekt in Deinen Branch `master` als Unterverzeichnis hinzufügen. Dies kann man in Git mit dem Befehl `git read-tree` durchführen. In Kapitel 9 werde ich den Befehl `read-tree` und dessen verwandte Befehle näher erläutern. Hier möchte ich nur erklären, dass der Befehl das Wurzelverzeichnis eines Branches in die aktuelle Staging-Area und in das Arbeitsverzeichnis packt. Damit hast Du jetzt zu Deinem Branch `master` zurückgewechselt, den Inhalt des Branches `rack` in das Unterverzeichnis `rack` im Branch `master` Deines Projekts hinterlegt:

	$ git read-tree --prefix=rack/ -u rack_branch

<!--When you commit, it looks like you have all the Rack files under that subdirectory — as though you copied them in from a tarball. What gets interesting is that you can fairly easily merge changes from one of the branches to the other. So, if the Rack project updates, you can pull in upstream changes by switching to that branch and pulling:-->

Wenn Du jetzt einen Commit ausführst, erscheint es einem so, als ob die ganzen Dateien aus dem Rack-Projekt in diesem Unterverzeichnis liegen — als ob man das Projekt aus einem Tarball-Container hineinkopiert hätte. Das Besondere ist jetzt aber, dass man Änderungen zwischen den verschiedenen Branches jetzt einfach zusammenführen kann. Das bedeutet, wenn das Rack-Projekt aktualisiert wird, kann man sich diese Änderungen einfach holen, indem man in diesen Branch wechselt und dort einen Pull durchführt:

	$ git checkout rack_branch
	$ git pull

<!--Then, you can merge those changes back into your master branch. You can use `git merge -s subtree` and it will work fine; but Git will also merge the histories together, which you probably don’t want. To pull in the changes and prepopulate the commit message, use the `-\-squash` and `-\-no-commit` options as well as the `-s subtree` strategy option:-->

Danach kann man diese Änderungen wieder in den Branch master mergen. Wenn man den Befehl `git merge -s subtree` verwendet, sollte dies einwandfrei funktionieren. Allerdings wird Git bei Ausführen dieses Befehls auch die jeweilige Historie mergen, was Du wahrscheinlich nicht haben möchtest. Um nun die Änderungen zu holen und eine entsprechende Commit-Nachricht vorzubereiten, hängt man einfach `--squash`, `--no-commit` und natürlich `-s subtree` als Option an:

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

<!--All the changes from your Rack project are merged in and ready to be committed locally. You can also do the opposite — make changes in the `rack` subdirectory of your master branch and then merge them into your `rack_branch` branch later to submit them to the maintainers or push them upstream.-->

Die ganzen Änderungen des Rack-Projekts wurden nun zusammengeführt, Du musst jetzt nur noch einen entsprechenden Commit durchführen. Man kann aber auch genau das Gegenteil machen: Man führt Änderungen im Unterverzeichnis `rack` des Branches master aus und mergt diese dann später in den Zweig `rack_branch`. Diesen kann man dann den Entwicklern des Rack-Projekts zur Verfügung stellen.

<!--To get a diff between what you have in your `rack` subdirectory and the code in your `rack_branch` branch — to see if you need to merge them — you can’t use the normal `diff` command. Instead, you must run `git diff-tree` with the branch you want to compare to:-->

Um die Unterschiede zwischen dem Inhalt in Deinem Verzeichnis `rack` und dem Code im Zweig `rack_branch` anzuzeigen, kann man keinen normalen Vergleich mit `diff` durchführen. Man muss stattdessen den Befehl `git diff-tree` verwenden und als Argument den zu vergleichenden Branch angeben:

	$ git diff-tree -p rack_branch

<!--Or, to compare what is in your `rack` subdirectory with what the `master` branch on the server was the last time you fetched, you can run-->

Um Dein Verzeichnis `rack` mit dem letzten Stand des Branches `master` auf dem Server zu vergleichen, kannst Du folgenden Befehl verwenden:

	$ git diff-tree -p rack_remote/master

<!--# Summary-->