# Branch Management

<!--Now that you’ve created, merged, and deleted some branches, let’s look at some branch-management tools that will come in handy when you begin using branches all the time.-->

Du weißt jetzt, wie Du Branches erstellen, mergen und löschen kannst. Wir schauen uns jetzt noch ein paar recht nützliche Tools für die Arbeit mit Branches an.

<!--The `git branch` command does more than just create and delete branches. If you run it with no arguments, you get a simple listing of your current branches:-->

Das Kommando `git branch` kann mehr, als nur Branches zu erstellen oder zu löschen. Wenn Du es ohne weitere Argumente ausführst, wird es Dir eine Liste mit Deinen aktuellen Branches anzeigen:

	$ git branch
	  iss53
	* master
	  testing

<!--Notice the `*` character that prefixes the `master` branch: it indicates the branch that you currently have checked out. This means that if you commit at this point, the `master` branch will be moved forward with your new work. To see the last commit on each branch, you can run `git branch -v`:-->

Das `*` vor dem `master`-Branch bedeutet, dass dies der gerade ausgecheckte Branch ist. Wenn Du also jetzt einen Commit erzeugst, wird dieser in den `master`-Branch gehen. Du kannst Dir mit `git branch -v` ganz schnell für jeden Branch den letzten Commit anzeigen lassen:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

<!--Another useful option to figure out what state your branches are in is to filter this list to branches that you have or have not yet merged into the branch you’re currently on. There are useful `-\-merged` and `-\-no-merged` options available in Git for this purpose. To see which branches are already merged into the branch you’re on, you can run `git branch -\-merged`:-->

Mit einer weiteren nützlichen Option kannst Du herausfinden, in welchem Zustand Deine Branches sind: welche der Branches wurden bereits in den aktuellen Branch gemergt und welche wurden es nicht. Für diesen Zweck gibt es in Git die Optionen `--merged` und `--no-merged`. Um herauszufinden, welche Branches schon in den aktuell ausgecheckten gemergt wurden, kannst Du einfach `git branch --merged` aufrufen:

	$ git branch --merged
	  iss53
	* master

<!--Because you already merged in `iss53` earlier, you see it in your list. Branches on this list without the `*` in front of them are generally fine to delete with `git branch -d`; you’ve already incorporated their work into another branch, so you’re not going to lose anything.-->

Da Du den Branch `iss53` schon gemergt hast, siehst Du ihn in dieser Liste. Alle Branches in dieser Liste, welchen kein `*` voransteht, können ohne Datenverlust mit `git branch -d` gelöscht werden, da sie ja bereits gemergt wurden.

<!--To see all the branches that contain work you haven’t yet merged in, you can run `git branch -\-no-merged`:-->

Um alle Branches zu sehen, welche noch nicht gemergte Änderungen enthalten, kannst Du `git branch --no-merged` aufrufen:

	$ git branch --no-merged
	  testing

<!--This shows your other branch. Because it contains work that isn’t merged in yet, trying to delete it with `git branch -d` will fail:-->

Die Liste zeigt Dir den anderen Branch. Er enthält Arbeit, die noch nicht gemergt wurde. Der Versuch, den Branch mit `git branch -d` zu löschen schlägt fehl:

	$ git branch -d testing
	error: The branch 'testing' is not fully merged.
	If you are sure you want to delete it, run 'git branch -D testing'.

<!--If you really do want to delete the branch and lose that work, you can force it with `-D`, as the helpful message points out.-->

Wenn Du den Branch trotzdem löschen willst – und damit alle Änderungen dieses Branches verlieren – kannst Du das mit `git branch -D testing` machen.

<!--# Branching Workflows-->