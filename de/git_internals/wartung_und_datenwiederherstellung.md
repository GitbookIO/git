# Wartung und Datenwiederherstellung

<!--Occasionally, you may have to do some cleanup — make a repository more compact, clean up an imported repository, or recover lost work. This section will cover some of these scenarios.-->

Gelegentlich will man ein bisschen aufräumen – ein Repository komprimieren, ein importiertes Repository aufräumen oder verloren gegangene Daten wiederherstellen. Dieses Kapitel wird sich mit einigen derartigen Szenarien befassen.

<!--## Maintenance-->
## Wartung

<!--Occasionally, Git automatically runs a command called "auto gc". Most of the time, this command does nothing. However, if there are too many loose objects (objects not in a packfile) or too many packfiles, Git launches a full-fledged `git gc` command. The `gc` stands for garbage collect, and the command does a number of things: it gathers up all the loose objects and places them in packfiles, it consolidates packfiles into one big packfile, and it removes objects that aren’t reachable from any commit and are a few months old.-->

Git führt den Befehl `auto gc` hin und wieder automatisch aus. In den meisten Fällen tut dieser Befehl nichts. Wenn allerdings zu viele lose Objekte (d.h. Objekte, die nicht in einem Packfile gepackt sind) oder zu viele einzelne Packfiles vorhanden sind, führt Git den Befehl `git gc` aus. `gc` steht für „Garbage Collection“. Dieser Befehl führt eine Reihe von Aufgaben durch: er sammelt die losen Objekte und packt sie in ein Packfile, er führt einzelne Packfiles zu einem einzigen, großen Packfile zusammen, und er entfernt Objekte, die mit keinem Commit erreichbar und einige Monate alt sind.

<!--You can run auto gc manually as follows:-->

Du kannst `auto gc` wie folgt manuell ausführen:

	$ git gc --auto

<!--Again, this generally does nothing. You must have around 7,000 loose objects or more than 50 packfiles for Git to fire up a real gc command. You can modify these limits with the `gc.auto` and `gc.autopacklimit` config settings, respectively.-->

Wie schon erwähnt tut dies normalerweise gar nichts. Es müssen sich etwa 7.000 lose Objekte oder mehr als 50 Packfiles angesammelt haben, bevor Git tatsächlich den echten gc-Befehl startet. Du kannst diese Werte mit Hilfe der Konfigurationsvariablen `gc.auto` bzw. `gc.autopacklimit` manuell setzen.

<!--The other thing `gc` will do is pack up your references into a single file. Suppose your repository contains the following branches and tags:-->

`gc` packt außerdem Referenzen in eine einzige Datei zusammen. Nehmen wir an, Dein Repository enthält die folgenden Branches und Tags:

	$ find .git/refs -type f
	.git/refs/heads/experiment
	.git/refs/heads/master
	.git/refs/tags/v1.0
	.git/refs/tags/v1.1

<!--If you run `git gc`, you’ll no longer have these files in the `refs` directory. Git will move them for the sake of efficiency into a file named `.git/packed-refs` that looks like this:-->

Nachdem Du `git gc` ausgeführt hast, werden diese Dateien um der Effizienz willen aus dem Verzeichnis `refs` entfernt und in eine Datei `.git/packed-refs` verschoben, die dann wie folgt aussieht:

	$ cat .git/packed-refs
	# pack-refs with: peeled
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
	ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
	9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
	^1a410efbd13591db07496601ebc7a059dd55cfe9

<!--If you update a reference, Git doesn’t edit this file but instead writes a new file to `refs/heads`. To get the appropriate SHA for a given reference, Git checks for that reference in the `refs` directory and then checks the `packed-refs` file as a fallback. However, if you can’t find a reference in the `refs` directory, it’s probably in your `packed-refs` file.-->

Wenn Du eine Referenz bearbeitest, lässt Git diese Datei unverändert und schreibt stattdessen eine neue Datei nach `refs/heads`. Um eine SHA-Prüfsumme für eine Referenz nachzuschlagen, schaut Git zunächst im Verzeichnis `refs` und danach erst in der Datei `packed-refs` nach, falls nötig. Wenn eine Referenz also nicht im Verzeichnis `refs` liegt, befindet sie sich wahrscheinlich in der Datei `packed-refs`.

<!--Notice the last line of the file, which begins with a `^`. This means the tag directly above is an annotated tag and that line is the commit that the annotated tag points to.-->

Beachte, dass die letzte Zeile der Datei mit `^` anfängt. Das bedeutet, dass der Tag darüber ein annotierter Tag ist und diese Zeile zeigt den Commit, auf den der annotierte Tag zeigt.

<!--## Data Recovery-->
## Daten-Wiederherstellung

<!--At some point in your Git journey, you may accidentally lose a commit. Generally, this happens because you force-delete a branch that had work on it, and it turns out you wanted the branch after all; or you hard-reset a branch, thus abandoning commits that you wanted something from. Assuming this happens, how can you get your commits back?-->

Irgendwann wird es vielleicht mal vorkommen, dass Du während der Arbeit mit Git einen Commit verlierst. Normalerweise passiert das, wenn Du versehentlich einen Branch löschst, an dem Du gearbeitet hattest und den Du noch brauchst. Oder Du führst `git reset --hard` aus und stellst fest, dass Du einige der Commits noch brauchst. Nehmen wir an, Du steckst in einer solchen Situation – wie kannst Du Deine Commits dann wiederherstellen?

<!--Here’s an example that hard-resets the master branch in your test repository to an older commit and then recovers the lost commits. First, let’s review where your repository is at this point:-->

Das folgende Beispiel setzt zuerst den Branch `master` auf einen älteren Commit zurück und stellt die verlorenen Commits dann wieder her. Zunächst schauen wir uns den gegenwärtigen Zustand des Repositorys an:

	$ git log --pretty=oneline
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

<!--Now, move the `master` branch back to the middle commit:-->

Jetzt setzen wir den Branch `master` auf den mittleren Commit zurück:

	$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
	HEAD is now at 1a410ef third commit
	$ git log --pretty=oneline
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

<!--You’ve effectively lost the top two commits — you have no branch from which those commits are reachable. You need to find the latest commit SHA and then add a branch that points to it. The trick is finding that latest commit SHA — it’s not like you’ve memorized it, right?-->

Du hast damit die oberen beiden Commits verloren, d.h. es gibt keinen Branch mehr, von dem aus diese Commits erreichbar wären. Um sie wiederherzustellen, kannst Du einen neuen Branch anlegen, der auf den SHA-Hash des obersten (letzten) Commits zeigt. Der Trick besteht darin, diesen letzten Commit-Hash herauszufinden. Es ist ja nicht so, dass Du Dir jederzeit all die Hashes merken könntest, oder?

<!--Often, the quickest way is to use a tool called `git reflog`. As you’re working, Git silently records what your HEAD is every time you change it. Each time you commit or change branches, the reflog is updated. The reflog is also updated by the `git update-ref` command, which is another reason to use it instead of just writing the SHA value to your ref files, as we covered in the "Git References" section of this chapter earlier.  You can see where you’ve been at any time by running `git reflog`:-->

In der Regel ist der schnellste Weg, solche Hashes zu finden, der Befehl `git reflog`. Während Du mit Git arbeitest, macht Git im Stillen fortlaufende Notizen darüber, was HEAD ist. Jedes Mal, wenn Du einen Commit anlegst oder den Branch wechselst, wird das „Reflog“ aktualisiert. Das Reflog wird außerdem vom Befehl `git update-ref` verwendet – ein weiterer guter Grund, nicht stattdessen einfach den SHA-Wert in eine Referenz-Datei zu schreiben (wie wir das in der Sektion „Git-Referenzen“ zuvor in diesem Kapitel besprochen haben). Du kannst also jederzeit nachschlagen, woran Du jeweils gearbeitet hast, indem Du den Befehl `git reflog` verwendest:

	$ git reflog
	1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
	ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

<!--Here we can see the two commits that we have had checked out, however there is not much information here.  To see the same information in a much more useful way, we can run `git log -g`, which will give you a normal log output for your reflog.-->

Das zeigt also die beiden verloren gegangenen Commits an, die wir zuvor ausgecheckt hatten. Allerdings zeigt es auch nicht viel mehr Information. Um das Reflog in einer anderen, etwas nützlicheren Weise anzuzeigen, kannst Du `git log -g` verwenden. Das gibt das Reflog im gewohnten Log-Format aus:

	$ git log -g
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:22:37 2009 -0700

	    third commit

	commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	     modified repo a bit

<!--It looks like the bottom commit is the one you lost, so you can recover it by creating a new branch at that commit. For example, you can start a branch named `recover-branch` at that commit (ab1afef):-->

Es sieht also so aus, als sei der untere Commit derjenige, den Du verloren hast, aber noch brauchst. Du kannst ihn jetzt wiederherstellen, indem Du einen neuen Branch erstellst, der auf diesen Commit zeigt. Beispielsweise kannst Du einen Branch `recover-branch` anlegen, der auf den Commit `ab1afef` zeigt:

	$ git branch recover-branch ab1afef
	$ git log --pretty=oneline recover-branch
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

<!--Cool — now you have a branch named `recover-branch` that is where your `master` branch used to be, making the first two commits reachable again.-->
<!--Next, suppose your loss was for some reason not in the reflog — you can simulate that by removing `recover-branch` and deleting the reflog. Now the first two commits aren’t reachable by anything:-->

Sehr gut. Du hast jetzt einen neuen Branch `recover-branch`, der diejenigen Commits enthält, die sich zuvor in Deinem Branch `master` befanden. Damit hast Du wieder Zugriff auf die beiden verloren gegangenen Commits. Als nächstes nehmen wir aber außerdem an, dass diese verlorenen Commits aus irgendeinem Grunde nicht im Reflog enthalten sind – Du kannst das z.B. simulieren, indem Du den Branch `recover-branch` und das Reflog löschst. Damit sind die beiden Commits jetzt von nirgendwo her mehr erreichbar:

	$ git branch -D recover-branch
	$ rm -Rf .git/logs/

<!--Because the reflog data is kept in the `.git/logs/` directory, you effectively have no reflog. How can you recover that commit at this point? One way is to use the `git fsck` utility, which checks your database for integrity. If you run it with the `-\-full` option, it shows you all objects that aren’t pointed to by another object:-->

Das Reflog wird im Verzeichnis `.git/logs/` aufbewahrt, d.h. Du hast nun faktisch kein Reflog mehr. Wie kann man einen Commit jetzt noch wiederherstellen? Eine Möglichkeit dazu ist der Befehl `git fsck`, der die Integrität der Git-Datenbank prüft. Wenn Du den Befehl mit der Option `--full` ausführst, zeigt er alle Objekte an, auf die nicht von einem anderen Objekt verwiesen wird:

	$ git fsck --full
	dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
	dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
	dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

<!--In this case, you can see your missing commit after the dangling commit. You can recover it the same way, by adding a branch that points to that SHA.-->

In diesem Fall findest Du den verlorenen Commit nach den Worten „dangling commit“. Du kannst ihn dann auf dieselbe Weise wiederherstellen wie zuvor, indem Du einen Branch erstellst, der auf diesen Commit-Hash zeigt.

<!--## Removing Objects-->
## Objekte entfernen

<!--There are a lot of great things about Git, but one feature that can cause issues is the fact that a `git clone` downloads the entire history of the project, including every version of every file. This is fine if the whole thing is source code, because Git is highly optimized to compress that data efficiently. However, if someone at any point in the history of your project added a single huge file, every clone for all time will be forced to download that large file, even if it was removed from the project in the very next commit. Because it’s reachable from the history, it will always be there.-->

Git ist in vielerlei Hinsicht unschlagbar, aber es gibt auch Features, die Probleme verursachen können. Ein solches Problem kann darin bestehen, dass `git clone` die vollständige Historie eines Projektes herunterlädt, d.h. jede einzelne Version jeder einzelnen Datei. Das ist eine feine Sache, solange es sich um Quellcode handelt, denn Git ist darauf optimiert, diese Art von Daten effizient zu komprimieren. Wenn allerdings irgendwann einmal eine einzelne, sehr große Datei zur Versionskontrolle hinzugefügt wurde, wird jeder Clone dieses Repositorys diese Datei gezwungenermaßen herunterladen müssen – auch dann, wenn die Datei inzwischen aus dem Repository entfernt würde. Weil sie über die Historie erreichbar ist, muss die Datei vorhanden sein.

<!--This can be a huge problem when you’re converting Subversion or Perforce repositories into Git. Because you don’t download the whole history in those systems, this type of addition carries few consequences. If you did an import from another system or otherwise find that your repository is much larger than it should be, here is how you can find and remove large objects.-->

Hierin kann ein großes Problem bestehen, wenn Du Subversion- oder Perforce-Repositorys nach Git konvertierst. Weil Du in diesen Systemen nicht die gesamte Historie herunterlädst, kann diese Art von Hinzufügung einige unangenehme Konsequenzen haben. Wenn Du Dein Repository aus einem anderen System importiert hast oder aus irgendeinem anderen Grunde findest, dass es sehr viel größer ist, als es eigentlich sein sollte, kannst Du große Objekte wie folgt suchen und entfernen.

<!--Be warned: this technique is destructive to your commit history. It rewrites every commit object downstream from the earliest tree you have to modify to remove a large file reference. If you do this immediately after an import, before anyone has started to base work on the commit, you’re fine — otherwise, you have to notify all contributors that they must rebase their work onto your new commits.-->

Sei Dir allerdings bewusst, dass diese Technik die Commit-Historie zerstört. Sie schreibt angefangen beim ursprünglichen Tree jedes einzelne Commit-Objekt neu, um die jeweilige, große Datei zu entfernen. Wenn Du das direkt nach einem Import tust, d.h. bevor jemand angefangen hat, auf der Basis eines Commits zu arbeiten, ist das in Ordnung – andernfalls müssen alle Mitarbeiter ihre Arbeit auf Deinen Commit rebasen.

<!--To demonstrate, you’ll add a large file into your test repository, remove it in the next commit, find it, and remove it permanently from the repository. First, add a large object to your history:-->

Um das zu demonstrieren, werden wir eine große Datei zu Deinem Test-Repository hinzufügen, sie dann im nächsten Commit löschen, in der Datenbank nachschlagen und sie schließlich dauerhaft aus dem Repository entfernen. Als erstes checke also eine große Datei in Dein Repository ein:

	$ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
	$ git add git.tbz2
	$ git commit -am 'added git tarball'
	[master 6df7640] added git tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 create mode 100644 git.tbz2

<!--Oops — you didn’t want to add a huge tarball to your project. Better get rid of it:-->

Oha. Du wolltest keinen dermaßen großen Tarball in Deinem Projekt. Am besten löschen wir es gleich wieder:

	$ git rm git.tbz2
	rm 'git.tbz2'
	$ git commit -m 'oops - removed large tarball'
	[master da3f30d] oops - removed large tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 delete mode 100644 git.tbz2

<!--Now, `gc` your database and see how much space you’re using:-->

Jetzt lassen wir die Garbage-Collection über die Datenbank laufen und sehen, wieviel Platz sie braucht:

	$ git gc
	Counting objects: 21, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (16/16), done.
	Writing objects: 100% (21/21), done.
	Total 21 (delta 3), reused 15 (delta 1)

<!--You can run the `count-objects` command to quickly see how much space you’re using:-->

Du kannst auch den Befehl `count-objects` laufen lassen, um einen schnellen Überblick darüber zu erhalten, wieviel Platz das Repository einnimmt:

	$ git count-objects -v
	count: 4
	size: 16
	in-pack: 21
	packs: 1
	size-pack: 2016
	prune-packable: 0
	garbage: 0

<!--The `size-pack` entry is the size of your packfiles in kilobytes, so you’re using 2MB. Before the last commit, you were using closer to 2K — clearly, removing the file from the previous commit didn’t remove it from your history. Every time anyone clones this repository, they will have to clone all 2MB just to get this tiny project, because you accidentally added a big file. Let’s get rid of it.-->

Der `size-pack`-Eintrag zeigt die Größe der Packfiles in Kilobytes an, d.h. Dein Repository braucht 2 MB. Vor dem letzten Commit lag dieser Wert eher bei 2 KB. D.h., die Datei wurde im letzten Commit eindeutig nicht aus der History entfernt. Jedes Mal, wenn jemand künftig dieses sehr kleine Repository klont, wird er die 2 MB mit herunterladen müssen – nur weil wir versehentlich diese große Datei hinzugefügt hatten. Also versuchen wir, sie endgültig loszuwerden.

<!--First you have to find it. In this case, you already know what file it is. But suppose you didn’t; how would you identify what file or files were taking up so much space? If you run `git gc`, all the objects are in a packfile; you can identify the big objects by running another plumbing command called `git verify-pack` and sorting on the third field in the output, which is file size. You can also pipe it through the `tail` command because you’re only interested in the last few largest files:-->

Zunächst mal müssen wir sie finden. In diesem Fall wissen wir bereits, um welche Datei es sich handelt. Aber nehmen wir an, wir wüssten es nicht. Wie würdest Du herausfinden, welche Datei (oder welche Dateien) so viel Platz verbrauchen? Wenn Du `git gc` laufen gelassen hast, werden sich alle Objekte in einem Packfile befinden. Du kannst dann große Objekte identifizieren, indem Du einen weiteren Plumbing-Befehl, nämlich `git verify-pack` ausführst und nach dem dritten Feld der Ausgabe sortierst, d.h. der Dateigröße. Du kannst sie außerdem durch den `tail` Befehl leiten, denn Du bist ja nur an den wenigen größten Objekten interessiert:

	$ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
	7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

<!--The big object is at the bottom: 2MB. To find out what file it is, you’ll use the `rev-list` command, which you used briefly in Chapter 7. If you pass `-\-objects` to `rev-list`, it lists all the commit SHAs and also the blob SHAs with the file paths associated with them. You can use this to find your blob’s name:-->

Das größte Objekt ist ganz klar das letzte: es ist 2 MB groß. Um herauszufinden, welche Datei das ist, kannst Du den `rev-list` Befehl verwenden, den wir in Kapitel 7 schon einmal kurz verwendet haben. Wenn Du die Optionen `--objects` und `rev-list` verwendest, werden alle Commit- und Blob-SHAs mit den jeweiligen Dateipfaden aufgelistet, die mit ihnen assoziiert sind. Auf diese Weise kannst Du den Namen des Blobs finden:

	$ git rev-list --objects --all | grep 7a9eb2fb
	7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

<!--Now, you need to remove this file from all trees in your past. You can easily see what commits modified this file:-->

Du musst diese Datei jetzt aus allen Trees entfernen, in denen sie sich befindet. Du kannst leicht herausfinden, welche Commits diese Datei verändert haben:

	$ git log --pretty=oneline --branches -- git.tbz2
	da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
	6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

<!--You must rewrite all the commits downstream from `6df76` to fully remove this file from your Git history. To do so, you use `filter-branch`, which you used in Chapter 6:-->

Es geht also darum, alle Commits angefangen bei `6df76` neu zu schreiben, sodass der Tarball nicht mehr in Deiner Git-Historie enthalten ist. Um das zu erreichen, verwendest Du den Befehl `git filter-branch`, den wir schon mal in Kapitel 6 verwendet haben:

	$ git filter-branch --index-filter \
	   'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
	Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
	Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
	Ref 'refs/heads/master' was rewritten

<!--The `-\-index-filter` option is similar to the `-\-tree-filter` option used in Chapter 6, except that instead of passing a command that modifies files checked out on disk, you’re modifying your staging area or index each time. Rather than remove a specific file with something like `rm file`, you have to remove it with `git rm -\-cached` — you must remove it from the index, not from disk. The reason to do it this way is speed — because Git doesn’t have to check out each revision to disk before running your filter, the process can be much, much faster. You can accomplish the same task with `-\-tree-filter` if you want. The `-\-ignore-unmatch` option to `git rm` tells it not to error out if the pattern you’re trying to remove isn’t there. Finally, you ask `filter-branch` to rewrite your history only from the `6df7640` commit up, because you know that is where this problem started. Otherwise, it will start from the beginning and will unnecessarily take longer.-->

Die Option  `--index-filter` ist ähnlich der Option `--tree-filter` aus Kapitel 6. Allerdings übergibt man in diesem Fall nicht einen Befehl, der die Dateien verändert, die sich jeweils ausgecheckt auf der Festplatte befinden. Stattdessen verändert man jeweils die Staging-Area bzw. den Index. Statt eine bestimmte Datei mit z.B: `rm file` zu entfernen, müssen wir also `git rm --cached` verwenden – denn wir wollen sie aus dem Index, nicht von der Festplatte löschen. Der Grund dafür ist einfach Geschwindigkeit: Git braucht nicht jede einzelne Revision auf die Festplatte auszuchecken, um den Filter anzuwenden. Auf diese Weise läuft der ganze Prozess sehr viel schneller. Man kann dieselbe Aufgabe aber auch mit `--tree-filter` erledigen, wenn man will. Die Option `--ignore-match` weist Git an, nicht mit einer Fehlermeldung abzubrechen, wenn die Datei, die wir löschen wollen, nicht vorhanden ist. Außerdem teilen wir `filter-branch` mit, die Historie nur von dem Commit `6df7640` an umzuschreiben. Andernfalls würde der Befehl von ganz vorn beginnen und unnötig länger brauchen.

<!--Your history no longer contains a reference to that file. However, your reflog and a new set of refs that Git added when you did the `filter-branch` under `.git/refs/original` still do, so you have to remove them and then repack the database. You need to get rid of anything that has a pointer to those old commits before you repack:-->

Deine Historie enthält jetzt nicht länger eine Referenz auf diese Datei. Dein Reflog und ein neues Set an Referenzen, die Git unter `.git/refs/original` angelegt hat, als Du `filter-branch` ausgeführt hast, tun das allerdings immer noch – also entfernen wir sie von dort und packen das Repository erneut. Bevor Du packst, musst Du zuerst alles entfernen, was noch Referenzen auf das alte Objekt enthält:

	$ rm -Rf .git/refs/original
	$ rm -Rf .git/logs/
	$ git gc
	Counting objects: 19, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (19/19), done.
	Total 19 (delta 3), reused 16 (delta 1)

<!--Let’s see how much space you saved.-->

Prüfen wir also, wieviel Platz wir damit eingespart haben:

	$ git count-objects -v
	count: 8
	size: 2040
	in-pack: 19
	packs: 1
	size-pack: 7
	prune-packable: 0
	garbage: 0

<!--The packed repository size is down to 7K, which is much better than 2MB. You can see from the size value that the big object is still in your loose objects, so it’s not gone; but it won’t be transferred on a push or subsequent clone, which is what is important. If you really wanted to, you could remove the object completely by running `git prune -\-expire`.-->

Das gepackte Repository umfasst jetzt nur noch 7K – sehr viel besser als die vorherigen 2MB. Du kannst an dem Wert `size` erkennen, dass sich die große Datei selbst jetzt immer noch in Deinen losen Objekten befindet. Aber sie wird bei einem `git push` oder anschließenden `git clone` nicht übermittelt werden – und das war unser Ziel. Wenn Du das wirklich willst, kannst Du sie jetzt vollständig und endgültig mit `git prune --expire` aus Deinem Repository löschen.

<!--# Summary-->