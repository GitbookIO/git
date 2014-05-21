# Submodule

<!--It often happens that while working on one project, you need to use another project from within it. Perhaps it’s a library that a third party developed or that you’re developing separately and using in multiple parent projects. A common issue arises in these scenarios: you want to be able to treat the two projects as separate yet still be able to use one from within the other.-->

Oft möchte man während der Arbeit an einem Projekt ein weiteres Projekt darin einbinden und verwenden. Das kann zum Beispiel eine Bibliothek von einer anderen Firma oder vielleicht auch eine selbstentwickelte Bibliothek sein. In einem solchen Szenario tritt dann meistens folgendes Problem auf: Die zwei Projekte sollen unabhängig voneinander entwickelt werden können, aber trotzdem soll es möglich sein, das eine Projekt im anderen zu verwenden.

<!--Here’s an example. Suppose you’re developing a web site and creating Atom feeds. Instead of writing your own Atom-generating code, you decide to use a library. You’re likely to have to either include this code from a shared library like a CPAN install or Ruby gem, or copy the source code into your own project tree. The issue with including the library is that it’s difficult to customize the library in any way and often more difficult to deploy it, because you need to make sure every client has that library available. The issue with vendoring the code into your own project is that any custom changes you make are difficult to merge when upstream changes become available.-->

Dazu ein Beispiel. Nehmen wir an, Du entwickelst gerade eine Webseite, die unter anderem einen Atom-Feed zur Verfügung stellen soll. Anstatt den notwendigen Code zur Auslieferung des Atom-Feeds selber zu schreiben, entscheidest Du Dich für eine geeignete Bibliothek. Dann wirst Du wahrscheinlich den Code in Dein Projekt einbinden müssen, zum Beispiel durch eine CPAN-Installation oder ein Ruby-Gem oder durch Kopieren des Quellcodes in das Arbeitsverzeichnis Deines Projekts. Das Problem beim Einbinden einer Bibliothek ist, dass es schwierig ist, diese an die eigene Bedürfnisse anzupassen. Noch schwieriger gestaltet sich dann die Veröffentlichung des Projekts, da man sicherstellen muss, dass jeder der die Software verwendet, auf die Bibliothek zugreifen kann. Wenn man die Bibliothek im eigenen Projekt projektspezifisch anpasst, hat man meist ein Problem, wenn man eine neue Version der Bibliothek einspielen will.

<!--Git addresses this issue using submodules. Submodules allow you to keep a Git repository as a subdirectory of another Git repository. This lets you clone another repository into your project and keep your commits separate.-->

Git löst dieses Problem mit Hilfe von Submodulen. Mit Hilfe von Submodulen kann man innerhalb eines Git-Repositorys ein weiteres Git-Repository in einem Unterverzeichnis verwalten. Daraus entsteht der Vorteil, dass man ein anderes Repository in das eigene Projekt klonen kann und die Commits der jeweiligen Projekte trennen kann.

<!--## Starting with Submodules-->
## Die ersten Schritte mit Submodulen

<!--Suppose you want to add the Rack library (a Ruby web server gateway interface) to your project, possibly maintain your own changes to it, but continue to merge in upstream changes. The first thing you should do is clone the external repository into your subdirectory. You add external projects as submodules with the `git submodule add` command:-->

Nehmen wir einmal an, dass Du die Rack-Bibliothek (eine Ruby-Gateway-Schnittstelle für Webserver) zu Deinem Projekt hinzufügen willst. Dabei möchtest Du Deine eigenen Änderungen an dieser Bibliothek nachverfolgen, aber auch weiterhin Änderungen von den Rack-Bibliothek-Entwicklern verwalten und zusammenmergen. Das erste was Du dazu tun musst, ist das Repository der Rack Bibliothek in ein Unterverzeichnis Deines Projekts zu klonen. Diesen Vorgang kannst Du mit Hilfe des Befehls `git submodule add` ausführen:

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.

<!--Now you have the Rack project under a subdirectory named `rack` within your project. You can go into that subdirectory, make changes, add your own writable remote repository to push your changes into, fetch and merge from the original repository, and more. If you run `git status` right after you add the submodule, you see two things:-->

Innerhalb Deines Projekts befindet sich nun im Unterverzeichnis `rack` das komplette Rack-Projekt. Man kann jetzt in diesem Verzeichnis Änderungen vornehmen und ein eigenes Remote-Repository mit Schreibrechten, zu welchem man pushen kann, hinzufügen. Ebenso ist es möglich, Änderungen von den Rack-Entwicklern in sein Repository zu laden und diese mit den eigenen Ergebnissen zu mergen. Im Prinzip kann man innerhalb eines Submoduls die gleichen Vorgänge, wie in einem normalen Repository ausführen. Vorher müssen wir aber noch ein paar weitere Dinge zu Submodulen besprechen. Wenn Du gleich nach dem Hinzufügen des Submoduls, den Befehl `git status` ausführst, wirst Du gleich zwei Dinge bemerken:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

<!--First you notice the `.gitmodules` file. This is a configuration file that stores the mapping between the project’s URL and the local subdirectory you’ve pulled it into:-->

Als erstes wird Dir die neue Datei `.gitmodules` auffallen. Das ist eine Konfigurationsdatei, welche die Zuordnung der URL des geklonten Projekts und dem lokalen Unterverzeichnis, in welches das Projekt geklont wurde, festlegt:

	$ cat .gitmodules
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

<!--If you have multiple submodules, you’ll have multiple entries in this file. It’s important to note that this file is version-controlled with your other files, like your `.gitignore` file. It’s pushed and pulled with the rest of your project. This is how other people who clone this project know where to get the submodule projects from.-->

Wenn Du mehrere Submodule in einem Projekt verwaltest, werden auch mehrere Einträge in dieser Datei auftauchen. Dabei ist es wichtig zu wissen, dass diese Datei zusammen mit all den anderen Dateien aus Deinem Projekt, ebenso in die Versionskontrolle aufgenommen wird, ähnlich wie die Datei `.gitignore`. Die Datei wird so wie der Rest Deines Projekts gepusht und gepullt. Dadurch wissen andere Personen, die Dein Projekt klonen, von welchem Ort sie die Submodule erhalten können.

<!--The other listing in the `git status` output is the rack entry. If you run `git diff` on that, you see something interesting:-->

Die zweite Auffälligkeit bei der Ausgabe von `git status` ist der Eintrag rack. Wenn Du auf diesen Eintrag ein `git diff` durchführst, erhält man in etwa die folgende, interessante Ausgabe:

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

<!--Although `rack` is a subdirectory in your working directory, Git sees it as a submodule and doesn’t track its contents when you’re not in that directory. Instead, Git records it as a particular commit from that repository. When you make changes and commit in that subdirectory, the superproject notices that the HEAD there has changed and records the exact commit you’re currently working off of; that way, when others clone this project, they can re-create the environment exactly.-->

Obwohl `rack` ein Unterverzeichnis in Deinem Arbeitsverzeichnis ist, erkennt Git dieses Verzeichnis als Submodul und verfolgt die Änderungen innerhalb dieses Verzeichnisses nicht, wenn Git nicht innerhalb dieses Verzeichnisses aufgerufen wird. Stattdessen erfässt Git, welcher Commit in diesem Repository ausgecheckt ist. Wenn Du also Änderungen in diesem Unterverzeichnis durchführst und eincheckst, kann das Superprojekt erkennen, dass sich der aktuelle HEAD von diesem Projekt geändert hat. Das Superprojekt kann sich jetzt diesen Commit merken. Auf diese Art und Weise ist es möglich, den kompletten Zustand des Projekts mit allen Projekten, die als Submodul hinzugefügt wurden, zu reproduzieren. In der Git-Terminologie wird das Projekt, welches eines oder mehrere Submodule enthält, als Superprojekt bezeichnet.

<!--This is an important point with submodules: you record them as the exact commit they’re at. You can’t record a submodule at `master` or some other symbolic reference.-->

Dabei muss man sich folgender Eigenschaft bewusst sein: Git verwaltet den exakten Commit, der gerade ausgecheckt ist und nicht etwa den Branch oder eine andere Referenz. Git kann also zum Beispiel nicht speichern, dass der aktuelle Stand im Branch `master` enthalten ist.

<!--When you commit, you see something like this:-->

Wenn Du Dein Projekt das erste Mal eincheckst, erhältst Du in etwa folgende Ausgabe:

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

<!--Notice the 160000 mode for the rack entry. That is a special mode in Git that basically means you’re recording a commit as a directory entry rather than a subdirectory or a file.-->

Der Mode 160000, der für den rack-Eintrag gilt, ist ein spezieller Mode in Git. Er bedeutet in etwa, dass man einen Commit als Verzeichnis-Eintrag in Git verwaltet und damit nicht wie normalerweise ein Verzeichnis oder eine Datei.

<!--You can treat the `rack` directory as a separate project and then update your superproject from time to time with a pointer to the latest commit in that subproject. All the Git commands work independently in the two directories:-->

Das Verzeichnis `rack` kann man wie ein separates Projekt behandeln und verwenden. Und von Zeit zur Zeit aktualisiert man auch das Superprojekt und speichert damit die letzte Commit-ID des Unterprojekts. Jedes Git-Kommando arbeitet unabhängig in einem der beiden Unterverzeichnisse:

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

<!--## Cloning a Project with Submodules-->
## Klonen eines Projekts mit den dazugehörigen Submodulen

<!--Here you’ll clone a project with a submodule in it. When you receive such a project, you get the directories that contain submodules, but none of the files yet:-->

Als nächstes klonen wir ein Projekt, welches ein Submodul verwendet. Wenn man ein solches Projekt klont, werden die entsprechenden Verzeichnisse, welche ein Submodul enthalten, erstellt. Allerdings enthalten diese Verzeichnisse noch keinen Inhalt:

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

<!--The `rack` directory is there, but empty. You must run two commands: `git submodule init` to initialize your local configuration file, and `git submodule update` to fetch all the data from that project and check out the appropriate commit listed in your superproject:-->

Das Verzeichnis `rack` wurde zwar erzeugt, aber es ist leer. Deshalb musst Du zwei Dinge ausführen: `git submodule init`, damit wird die Datei für die lokale Konfiguration initialisiert. Und `git submodule update`, welches die gesamten Daten des Projekts von der im `.gitmodules` angegebenen Quelle holt und den entsprechenden Commit, welcher im Superprojekt hinterlegt ist, auscheckt:

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

<!--Now your `rack` subdirectory is at the exact state it was in when you committed earlier. If another developer makes changes to the rack code and commits, and you pull that reference down and merge it in, you get something a bit odd:-->

Nach Ausführung der beiden Befehle befindet sich das Verzeichnis `rack` in genau dem gleichen Zustand, wie wir es ursprünglich eingecheckt haben. Wenn ein anderer Entwickler Änderungen am Rack-Code durchführt, diese eincheckt und Du diese dann pullst und mergst, erhält man einen etwas seltsamen Zustand:

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

<!--You merged in what is basically a change to the pointer for your submodule; but it doesn’t update the code in the submodule directory, so it looks like you have a dirty state in your working directory:-->

Der Merge, der gerade durchgeführt worden ist, ist eigentlich nur eine Aktualisierung des Zeigers auf einen neuen Commit des Submoduls. Der eigentliche Inhalt des Submodul-Verzeichnis wurde allerdings nicht aktualisiert. Das sieht dann so aus, als gäbe es noch nicht eingecheckte Dateien innerhalb Deines Arbeitsverzeichnis:

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

<!--This is the case because the pointer you have for the submodule isn’t what is actually in the submodule directory. To fix this, you must run `git submodule update` again:-->

Dieser Zustand tritt auf, weil der Zeiger auf den Commit im Submodul derzeit nicht der Commit ist, welcher im Submodul ausgecheckt ist. Um dies zu beheben, muss man den Befehl `git submodule update` erneut ausführen:

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

<!--You have to do this every time you pull down a submodule change in the main project. It’s strange, but it works.-->

Dieser Update muss jedes Mal ausgeführt werden, wenn man das Superprojekt pullt und dort ein Änderung in einem Submodul enthalten ist. Es ist vielleicht ein wenig merkwürdig, aber es funktioniert.

<!--One common problem happens when a developer makes a change locally in a submodule but doesn’t push it to a public server. Then, they commit a pointer to that non-public state and push up the superproject. When other developers try to run `git submodule update`, the submodule system can’t find the commit that is referenced, because it exists only on the first developer’s system. If that happens, you see an error like this:-->

Häufig tritt beim Arbeiten mit Submodulen ein Problem bei folgendem Szenario auf: Ein Entwickler führt Änderungen in einem Submodul durch, checkt diese ein, vergisst aber diese Änderungen zum zentralen Server zu pushen. Wenn dann im Superprojekt die Änderung des Submoduls ebenso eingecheckt wird und dieses dann gepusht wird, tritt ein Problem auf. Wenn jetzt andere Entwickler den neuen Stand des Superprojekts holen und den Befehl `git submodule update` ausführen, erhalten sie eine Fehlermeldung, dass der entsprechend referenzierte Commit von dem Submodul nicht gefunden werden konnte. Das passiert weil dieser Commit bei dem zweiten Entwickler noch gar nicht existiert. Wenn ein solcher Fall auftritt, erhält man in etwa folgende Fehlermeldung:

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

<!--You have to see who last changed the submodule:-->

Dann kann man allerdings herausfinden, wer zum letzten Mal eine Änderung eingecheckt hat:

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

<!--Then, you e-mail that guy and yell at him.-->

Dann kannst Du diesem Entwickler eine E-Mail schreiben und ihn auf seinen Fehler aufmerksam machen.

<!--## Superprojects-->
## Superprojekte

<!--Sometimes, developers want to get a combination of a large project’s subdirectories, depending on what team they’re on. This is common if you’re coming from CVS or Subversion, where you’ve defined a module or collection of subdirectories, and you want to keep this type of workflow.-->

In manchen großen Projekten möchten die Entwickler die Arbeit in verschiedenen Verzeichnissen aufteilen, sodass das jeweilige Team in diesen Verzeichnissen arbeiten kann. Man trifft diese Vorgehensweise häufig an, wenn ein Team gerade von CVS oder Subversion nach Git gewechselt hat, im alten System ein Modul oder eine Sammlung von solchen Unterverzeichnissen gebildet hat und diesen Arbeitsablauf weiterhin verwenden möchte.

<!--A good way to do this in Git is to make each of the subdirectories a separate Git repository and then create superproject Git repositories that contain multiple submodules. A benefit of this approach is that you can more specifically define the relationships between the projects with tags and branches in the superprojects.-->

In Git kann man diese Vorgehensweise gut abbilden, indem man für jedes Unterverzeichnis ein neues Git-Repository erzeugt. Zusätzlich kann man dann ein Superprojekt erzeugen und die ganzen Git-Repositorys als Submodul hinzufügen. Ein Vorteil dabei ist, dass man mit Hilfe von Tags und Branches im Superprojekt das Verhältnis der einzelnen Submodule zueinander festhalten kann.

<!--## Issues with Submodules-->
## Häufige Probleme mit Submodulen

<!--Using submodules isn’t without hiccups, however. First, you must be relatively careful when working in the submodule directory. When you run `git submodule update`, it checks out the specific version of the project, but not within a branch. This is called having a detached HEAD — it means the HEAD file points directly to a commit, not to a symbolic reference. The issue is that you generally don’t want to work in a detached HEAD environment, because it’s easy to lose changes. If you do an initial `submodule update`, commit in that submodule directory without creating a branch to work in, and then run `git submodule update` again from the superproject without committing in the meantime, Git will overwrite your changes without telling you.  Technically you won’t lose the work, but you won’t have a branch pointing to it, so it will be somewhat difficult to retrieve.-->

Die Arbeit mit Submodulen verläuft jedoch nicht immer reibungslos. Man muss verhältnismäßig gut aufpassen, wenn man in einem Submodul-Verzeichnis arbeitet. Wenn man nämlich den Befehl `git submodule update` ausführt, checkt Git den entsprechenden Zustand des Commits aus, aber checkt dabei keinen Branch aus. Diesen Zustand nennt man auch `detached HEAD`. Das bedeutet, dass die Datei HEAD direkt auf einen Commit zeigt und nicht, wie sonst üblich, auf eine symbolische Referenz, also zum Beispiel auf einen Branch. Das Problem dabei ist, dass man normalerweise in einem solchen Zustand nicht weiterarbeiten möchte, weil es sehr leicht vorkommen kann, dass Änderungen verloren gehen. Wenn man also den Befehl `git submodule update` aufruft, dann einen Commit in dem entsprechenden Submodul-Verzeichnis ausführt, ohne davor einen Branch auszuchecken, und dann noch einmal `git submodule update` im Superprojekt aufruft, ohne dass man die Änderungen im Submodul im Superprojekt eingecheckt hat, verliert man die ganzen Änderungen, ohne dass Git einen darauf vorher hinweist. Tatsächlich ist es so, dass die Änderungen nicht verloren gehen, aber es gibt keinen Branch, der auf die entsprechenden Commits hinzeigt, und damit kann es schwierig werden, die entsprechenden Commits wiederherzustellen beziehungsweise sichtbar zu machen.

<!--To avoid this issue, create a branch when you work in a submodule directory with `git checkout -b work` or something equivalent. When you do the submodule update a second time, it will still revert your work, but at least you have a pointer to get back to.-->

Um dieses Problem zu vermeiden, sollte man also immer in dem Submodul-Verzeichnis einen neuen Branch mit `git checkout -b work` oder auf eine andere Art und Weise erzeugen. Wenn man dann wieder das Aktualisieren des Submoduls ausführt, wird Git wieder den ursprünglichen Commit auschecken, allerdings hat man jetzt mit dem Branch einen Zeiger auf die neuen Commits und man kann sie leicht wieder auschecken.

<!--Switching branches with submodules in them can also be tricky. If you create a new branch, add a submodule there, and then switch back to a branch without that submodule, you still have the submodule directory as an untracked directory:-->

Wenn ein Projekt ein Submodul enthält und man im Superprojekt zwischen einzelnen Branches hin und her wechseln möchte, kann sich das manchmal auch schwierig gestalten. Wenn man zum Beispiel einen neuen Branch erzeugt, in diesem dann ein Submodul hinzufügt und dann wieder in den ursprünglichen Branch, welcher das Submodul noch nicht enthält, zurückwechselt, hat man im Arbeitsverzeichnis immer noch das Submodul-Verzeichnis, welches auch so dargestellt wird, als ob es von Git noch nicht verfolgt wird:

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/

<!--You have to either move it out of the way or remove it, in which case you have to clone it again when you switch back—and you may lose local changes or branches that you didn’t push up.-->

In diesem Fall muss man das Verzeichnis entweder an einen anderen Ort verschieben oder löschen. Im letzteren Fall muss man aber wieder das Submodul komplett klonen, wenn man in den anderen Zweig zurückwechselt. Außerdem kann man dabei lokale Änderungen zunichte machen oder Zweige, welche man noch nicht gepusht hat, verlieren.

<!--The last main caveat that many people run into involves switching from subdirectories to submodules. If you’ve been tracking files in your project and you want to move them out into a submodule, you must be careful or Git will get angry at you. Assume that you have the rack files in a subdirectory of your project, and you want to switch it to a submodule. If you delete the subdirectory and then run `submodule add`, Git yells at you:-->

Die letzte Falle, in die viele Leute tappen, tritt auf, wenn man bereits vorhandene Verzeichnisse in Submodule umwandeln will. Wenn man also Dateien, die bereits von Git verwaltet werden, entfernen und in ein entsprechendes Submodul verschieben möchte, muss man vorsichtig sein. Ansonsten können schwer zu behebende Probleme mit Git auftreten. Nehmen wir zum Beispiel an, dass Du die Dateien vom Rack-Projekt in ein Unterverzeichnis Deines Projekts abgelegt hast und diese jetzt aber in ein Submodul verschieben möchtest. Wenn Du das Unterverzeichnis einfach löschst und dann den Befehl `submodule add` ausführst, zeigt Dir Git folgende Fehlermeldung an:

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

<!--You have to unstage the `rack` directory first. Then you can add the submodule:-->

Man muss dann das Verzeichnis `rack` erst aus der Staging-Area entfernen. Danach kann man dann das Submodul erzeugen:

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.

<!--Now suppose you did that in a branch. If you try to switch back to a branch where those files are still in the actual tree rather than a submodule — you get this error:-->

Wenn wir jetzt annehmen, dass Du diesen Vorgang innerhalb eines Zweigs durchgeführt hast und jetzt auf einen anderen Zweig, in dem das Submodul noch nicht existiert hat und damit die Dateien noch ganz normal im Repository enthalten waren, wechselst, erhält Du folgenden Fehler:

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

<!--You have to move the `rack` submodule directory out of the way before you can switch to a branch that doesn’t have it:-->

Dann musst Du das Submodul-Verzeichnis `rack` an einen anderen Ort verschieben, bevor Du diesen Branch auschecken kannst:

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

<!--Then, when you switch back, you get an empty `rack` directory. You can either run `git submodule update` to reclone, or you can move your `/tmp/rack` directory back into the empty directory.-->

Wenn man dann wieder in den Zweig mit dem Submodul zurückwechseln will, erhält man ein leeres Verzeichnis `rack`. Um dieses zu befüllen, kannst Du entweder `git submodule update` ausführen oder Du kannst Deine Kopie von `/tmp/rack` wieder an den ursprünglichen Ort wiederherstellen.

<!--# Subtree Merging-->