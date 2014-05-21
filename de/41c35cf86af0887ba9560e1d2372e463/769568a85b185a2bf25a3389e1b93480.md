# Git und Subversion

<!--Currently, the majority of open source development projects and a large number of corporate projects use Subversion to manage their source code. It’s the most popular open source VCS and has been around for nearly a decade. It’s also very similar in many ways to CVS, which was the big boy of the source-control world before that.-->

Gegenwärtig verwenden die meisten Open-Source-Entwicklungsprojekte und eine große Anzahl von Projekten in Unternehmen Subversion, um ihren Quellcode zu verwalten. Es ist die populärste Open-Source-Versionsverwaltung und wird seit fast einem Jahrzehnt eingesetzt. In vielen Bereichen ähnelt es CVS, das vorher der König der Versionsverwaltungen war.

<!--One of Git’s great features is a bidirectional bridge to Subversion called `git svn`. This tool allows you to use Git as a valid client to a Subversion server, so you can use all the local features of Git and then push to a Subversion server as if you were using Subversion locally. This means you can do local branching and merging, use the staging area, use rebasing and cherry-picking, and so on, while your collaborators continue to work in their dark and ancient ways. It’s a good way to sneak Git into the corporate environment and help your fellow developers become more efficient while you lobby to get the infrastructure changed to support Git fully. The Subversion bridge is the gateway drug to the DVCS world.-->

Eines der großartigen Features von Git ist die bi-direktionale Brücke zu Subversion: `git svn`. Dieses Tool ermöglicht es, Git als ganz normalen Client für einen Subversion-Server zu benutzen, sodass Du alle lokalen Features von Git nutzen kannst und Deine Änderungen dann auf einen Subversion-Server pushen kannst, so als ob Du Subversion lokal nutzen würdest. Das bedeutet, dass Du lokale Branches anlegen kannst, mergen, die staging area, rebasing, cherry-picking etc. verwenden, während Deine Kollegen weiterhin auf ihre angestaubte Art und Weise arbeiten. Das ist eine gute Gelegenheit, um Git in einem Unternehmen einzuführen und Deinen Entwickler-Kollegen dabei zu helfen, effizienter zu werden während Du an der Unterstützung arbeitest, die Infrastruktur so umzubauen, dass Git voll unterstützt wird. Die Subversion-Bridge von Git ist quasi die Einstiegsdroge in die Welt der verteilten Versionsverwaltungssysteme (distributed version control systems, DVCS).

<!--## git svn-->
## git svn

<!--The base command in Git for all the Subversion bridging commands is `git svn`. You preface everything with that. It takes quite a few commands, so you’ll learn about the common ones while going through a few small workflows.-->

Das Haupt-Kommando in Git für alle Kommandos der Subversion Bridge ist `git svn`. Dieser Befehl wird allen anderen vorangestellt. Er kennt zahlreiche Optionen, daher werden wir jetzt die gebräuchlichsten zusammen anhand von ein paar Beispielen durchspielen.

<!--It’s important to note that when you’re using `git svn`, you’re interacting with Subversion, which is a system that is far less sophisticated than Git. Although you can easily do local branching and merging, it’s generally best to keep your history as linear as possible by rebasing your work and avoiding doing things like simultaneously interacting with a Git remote repository.-->

Es ist wichtig, dass Du im Hinterkopf behältst, dass Du mit dem Befehl `git svn` mit Subversion interagierst, einem System, das nicht ganz so fortschrittlich ist wie Git. Obwohl Du auch dort ganz einfach Branches erstellen und wieder zusammenführen kannst, ist es üblicherweise am einfachsten, wenn Du die History so geradlinig wie möglich gestaltest, indem Du ein rebase für Deine Arbeit durchfürst und es vermeidest, zum Beispiel mit einem entfernten Git-Repository zu interagieren.

<!--Don’t rewrite your history and try to push again, and don’t push to a parallel Git repository to collaborate with fellow Git developers at the same time. Subversion can have only a single linear history, and confusing it is very easy. If you’re working with a team, and some are using SVN and others are using Git, make sure everyone is using the SVN server to collaborate — doing so will make your life easier.-->

Du solltest auf keinen Fall Deine History neu schreiben und dann versuchen, die Änderungen zu publizieren. Bitte schicke Deine Änderungen auch nicht zeitgleich dazu an ein anderes Git-Repository, in dem Du mit Deinen Kollegen zusammenarbeitest, die bereits Git nutzen. Subversion kennt nur eine einzige lineare History für das gesamte Repository und da kommt man schnell mal durcheinander. Wenn Du in einem Team arbeitest, in dem manche Deiner Kollegen SVN und andere schon Git nutzen, dann solltest Du sicherstellen, dass Ihr alle einen SVN-Server zur Zusammenarbeit nutzt, das macht Dein Leben deutlich einfacher.

<!--## Setting Up-->
## Installation

<!--To demonstrate this functionality, you need a typical SVN repository that you have write access to. If you want to copy these examples, you’ll have to make a writeable copy of my test repository. In order to do that easily, you can use a tool called `svnsync` that comes with more recent versions of Subversion — it should be distributed with at least 1.4. For these tests, I created a new Subversion repository on Google code that was a partial copy of the `protobuf` project, which is a tool that encodes structured data for network transmission.-->

Um dieses Feature zu demonstrieren, brauchst Du zunächst ein typisches SVN-Repository, in dem Du Schreibzugriff hast. Wenn Du die folgenden Beispiele selbst ausprobieren willst, brauchst Du eine beschreibbare Kopie meines Test-Repositories. Das geht ganz einfach mit einem kleinen Tool namens `svnsync`, das mit den letzten Subversion-Versionen (ab Version 1.4) mitgeliefert wird. Für diese Test habe ich ein neues Subversion Repository auf Google Code angelegt, das einen Teil aus dem `protobuf`-Projekts kopiert, einem Tool, das Datenstrukturen für die Übertragung über ein Netzwerk umwandelt.

<!--To follow along, you first need to create a new local Subversion repository:-->

Zunächst einmal musst Du ein neues lokales Subversion-Repository anlegen:

	$ mkdir /tmp/test-svn
	$ svnadmin create /tmp/test-svn

<!--Then, enable all users to change revprops — the easy way is to add a pre-revprop-change script that always exits 0:-->

Anschließend gibst Du allen Usern die Möglichkeit, die revprops zu ändern. Am einfachsten geht das, indem wir ein pre-revprop-change Skript erstellen, das immer 0 zurückgibt:

	$ cat /tmp/test-svn/hooks/pre-revprop-change
	#!/bin/sh
	exit 0;
	$ chmod +x /tmp/test-svn/hooks/pre-revprop-change

<!--You can now sync this project to your local machine by calling `svnsync init` with the to and from repositories.-->

Jetzt kannst Du dieses Projekt auf Deinen lokalen Rechner mit einem Aufruf von `svnsync init` synchronisieren. Als Optionen gibst Du das Ziel- und das Quell-Repository an.

	$ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

<!--This sets up the properties to run the sync. You can then clone the code by running-->

Das richtet die Properties ein, um die Synchronisierung laufen zu lassen. Nun kannst Du den Code klonen:

	$ svnsync sync file:///tmp/test-svn
	Committed revision 1.
	Copied properties for revision 1.
	Committed revision 2.
	Copied properties for revision 2.
	Committed revision 3.
	...

<!--Although this operation may take only a few minutes, if you try to copy the original repository to another remote repository instead of a local one, the process will take nearly an hour, even though there are fewer than 100 commits. Subversion has to clone one revision at a time and then push it back into another repository — it’s ridiculously inefficient, but it’s the only easy way to do this.-->

Obwohl diese Operation möglicherweise nur ein paar wenige Minuten in Anspruch nimmt, wird das Kopieren des Quell-Repositories von einem entfernten Repository in ein lokales fast eine Stunde dauern, auch wenn weniger als 100 Commits getätigt wurden. Subversion muss jede Revision einzeln klonen und sie dann in ein anderes Repository schieben – das ist zwar ziemlich ineffizient, aber für uns der einfachste Weg.

<!--## Getting Started-->
## Die ersten Schritte (Getting Started)

<!--Now that you have a Subversion repository to which you have write access, you can go through a typical workflow. You’ll start with the `git svn clone` command, which imports an entire Subversion repository into a local Git repository. Remember that if you’re importing from a real hosted Subversion repository, you should replace the `file:///tmp/test-svn` here with the URL of your Subversion repository:-->

Jetzt, da wir ein beschreibbares Subversion Repository haben, können wir mit einem typischen Workflow loslegen. Du beginnst mit dem `git svn clone`Kommando, das ein komplettes Subversion-Repository in ein lokales Git-Repository importiert. Denk daran, dass Du `file:///tmp/test-svn` im folgenden Beispiel mit der URL Deines eigenen Subversion-Repositorys ersetzt, wenn Du den Import für ein real existierendes Subversion-Repository durchführen willst.

	$ git svn clone file:///tmp/test-svn -T trunk -b branches -t tags
	Initialized empty Git repository in /Users/schacon/projects/testsvnsync/svn/.git/
	r1 = b4e387bc68740b5af56c2a5faf4003ae42bd135c (trunk)
	      A    m4/acx_pthread.m4
	      A    m4/stl_hash.m4
	...
	r75 = d1957f3b307922124eec6314e15bcda59e3d9610 (trunk)
	Found possible branch point: file:///tmp/test-svn/trunk => \
	    file:///tmp/test-svn /branches/my-calc-branch, 75
	Found branch parent: (my-calc-branch) d1957f3b307922124eec6314e15bcda59e3d9610
	Following parent with do_switch
	Successfully followed parent
	r76 = 8624824ecc0badd73f40ea2f01fce51894189b01 (my-calc-branch)
	Checked out HEAD:
	 file:///tmp/test-svn/branches/my-calc-branch r76

<!--This runs the equivalent of two commands — `git svn init` followed by `git svn fetch` — on the URL you provide. This can take a while. The test project has only about 75 commits and the codebase isn’t that big, so it takes just a few minutes. However, Git has to check out each version, one at a time, and commit it individually. For a project with hundreds or thousands of commits, this can literally take hours or even days to finish.-->

Hier werden für die angegebene URL eigentlich zwei Befehle ausgeführt, `git svn init` und anschließend `git svn fetch`. Das kann auch eine Weile dauern. Das Testprojekt hat nur etwa 75 Commits und die Codebase ist nicht so groß, daher benötigen wir nur ein paar Minuten. Da Git aber jede Version einzeln auschecken muss, kann es unter Umständen Stunden oder gar Tage dauern, bis die Ausführung des Befehls fertig ist.

<!--The `-T trunk -b branches -t tags` part tells Git that this Subversion repository follows the basic branching and tagging conventions. If you name your trunk, branches, or tags differently, you can change these options. Because this is so common, you can replace this entire part with `-s`, which means standard layout and implies all those options. The following command is equivalent:-->

Die Parameter `-T trunk -b branches -t tags` teilen Git mit, dass das Subversion-Repository den normalen Konventionen bezüglich Branching und Tagging folgt. Wenn Du Deinen Trunk, Deine Branches oder Deine Tags anders benannt hast, kannst Du diese hier anpassen. Da die Angabe aus dem Beispiel für die meisten Repositories gängig ist, kannst Du das ganze auch mit `-s` abkürzen. Diese Option steht für das Standard-Repository-Layount und umfasst die oben genannten Parameter. Der folgende Befehl ist äquivalent zum zuvor genannten:

	$ git svn clone file:///tmp/test-svn -s

<!--At this point, you should have a valid Git repository that has imported your branches and tags:-->

Jetzt solltest Du ein Git-Repository erzeugt haben, in das Deine Branches und Tags übernommen wurden:

	$ git branch -a
	* master
	  my-calc-branch
	  tags/2.0.2
	  tags/release-2.0.1
	  tags/release-2.0.2
	  tags/release-2.0.2rc1
	  trunk

<!--It’s important to note how this tool namespaces your remote references differently. When you’re cloning a normal Git repository, you get all the branches on that remote server available locally as something like `origin/[branch]` - namespaced by the name of the remote. However, `git svn` assumes that you won’t have multiple remotes and saves all its references to points on the remote server with no namespacing. You can use the Git plumbing command `show-ref` to look at all your full reference names:-->

An dieser Stelle soll die wichtige Anmerkung nicht fehlen, dass dieses Tool die Namespaces Deiner entfernten Referenzen unterschiedlich behandelt. Wenn Du ein normales Git-Repository klonst, werden alle Branches auf jenem entfernten Server für Dich lokal verfügbar gemacht, zum Beispiel als `origin/[branch]`, der Namespace entspricht dem Namen des entfernten Branches. `git svn` get allerdings davon aus, dass es nicht mehrere entfernte Repositorys gibt und speichert daher seie Referenzen auf die Bereiche entfernter Server ohne Namespaces. Du kannst das Git-Kommando `show-ref` verwenden, um Dir die vollständigen Namen aller Referenzen anzeigen zu lassen:

	$ git show-ref
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
	aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
	03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
	50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
	4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
	1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

<!--A normal Git repository looks more like this:-->

Ein normales Git-Repository sieht dagegen eher so aus:

	$ git show-ref
	83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
	3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
	0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
	25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

<!--You have two remote servers: one named `gitserver` with a `master` branch; and another named `origin` with two branches, `master` and `testing`.-->

Du hast zwei entfernte Server: einen, der `gitserver` heißt und einen `master`-Branch beinhaltet, und einen weiteren, der `origin` heißt und zwei Branches (`master` und `testing`) enthält.

<!--Notice how in the example of remote references imported from `git svn`, tags are added as remote branches, not as real Git tags. Your Subversion import looks like it has a remote named tags with branches under it.-->

Hast Du bemerkt, dass die entfernten Referenzen, die von `git svn` im Beispiel importiert wurden, nicht als echte Git-Tags importiert wurden, sondern als entfernte Branches? Dein Subversion-Import sieht aus als besäße er einen eigenen Remote-Bereich namens `tags` und unterhalb davon einzelne Branches.

<!--## Committing Back to Subversion-->
## Änderungen ins Subversion-Repository committen

<!--Now that you have a working repository, you can do some work on the project and push your commits back upstream, using Git effectively as a SVN client. If you edit one of the files and commit it, you have a commit that exists in Git locally that doesn’t exist on the Subversion server:-->

Mit unserem funktionierenden Repository können wir nun am Projekt arbeiten und unsere Änderungen commiten; dabei nutzen wir Git als SVN-Client. Wenn Du eine der Dateien bearbeitest und sie commitest, hast Du lokal einen Commit in Git, der auf dem Subversion-Server (noch) nicht vorhanden ist:

	$ git commit -am 'Adding git-svn instructions to the README'
	[master 97031e5] Adding git-svn instructions to the README
	 1 files changed, 1 insertions(+), 1 deletions(-)

<!--Next, you need to push your change upstream. Notice how this changes the way you work with Subversion — you can do several commits offline and then push them all at once to the Subversion server. To push to a Subversion server, you run the `git svn dcommit` command:-->

Als nächsten Schritt wirst Du Deine Änderungen einchecken wollen. Dein Umgang mit Subversion wird sich dabei verändern -- Du kannst eine Vielzahl an Commits lokal durchführen und dann alle zusammen an den Subversion-Server schicken. Um Deine Änderungen auf den Subversion-Server zu pushen, verwendest Du das `git svn dcommit` Kommando:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r79
	       M      README.txt
	r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

<!--This takes all the commits you’ve made on top of the Subversion server code, does a Subversion commit for each, and then rewrites your local Git commit to include a unique identifier. This is important because it means that all the SHA-1 checksums for your commits change. Partly for this reason, working with Git-based remote versions of your projects concurrently with a Subversion server isn’t a good idea. If you look at the last commit, you can see the new `git-svn-id` that was added:-->

Das bündelt alle Commits, die Du auf Basis des Codes im Subversion-Server durchgeführt hast und und führt für jede Änderung ein Subversion-Commit durch. Anschließend werden Deine lokalen Git-Commits angepasst und jeder von ihnen bekommt einen eindeutigen Identifier. Das bedeutet, dass alle SHA-1 Checksums Deiner Commits verändert werden. Dies ist einer der Gründe, warum das Arbeiten mit Git-basierten entfernten Versionen Deines Projekts und zeitgleich mit einem Subversion-Server keine gute Idee ist. Wenn Du Dir den letzten Commit ansiehst, wirst Du feststellen, dass eine neue `git-svn-id` hinzugefügt wurde.

	$ git log -1
	commit 938b1a547c2cc92033b74d32030e86468294a5c8
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sat May 2 22:06:44 2009 +0000

	    Adding git-svn instructions to the README

	    git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

<!--Notice that the SHA checksum that originally started with `97031e5` when you committed now begins with `938b1a5`. If you want to push to both a Git server and a Subversion server, you have to push (`dcommit`) to the Subversion server first, because that action changes your commit data.-->

Die SHA-Checksum Deines ursprünglichen Commits begann mit `97031e5`, jetzt fängt sie mit `938b1a5` an. Wenn Du zugleich auf einen Git- und einen Subversion-Server pushen willst, solltest Du zunächst an den Subversion-Server pushen (`dcommit`), da diese Aktion Deine Commit-Daten verändert.

<!--## Pulling in New Changes-->
## Änderungen ins lokale Repository übernehmen

<!--If you’re working with other developers, then at some point one of you will push, and then the other one will try to push a change that conflicts. That change will be rejected until you merge in their work. In `git svn`, it looks like this:-->

Wenn Du mit anderen Entwicklern zusammenarbeitest, wirst Du irgendwann an den Punkt gelangen an dem einer von Euch Änderungen ins Repository pusht und jemand anderes versuchen wird, ebenfalls seine Änderungen zu pushen und damit einen Konflikt erzeugt. Diese Änderung wird solange zurückgewiesen bis Du die Arbeit des anderen Entwicklers mergt. Mit `git svn` sieht das so aus:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	Merge conflict during commit: Your file or directory 'README.txt' is probably \
	out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
	core/git-svn line 482

<!--To resolve this situation, you can run `git svn rebase`, which pulls down any changes on the server that you don’t have yet and rebases any work you have on top of what is on the server:-->

Um diese Situation zu lösen, kannst Du `git svn rebase` laufen lassen. Das zieht alle Änderungen vom Server, die Dir noch fehlen und führt ein rebase Deiner lokalen Kopie durch (auf Basis dessen, was auf dem Server vorhanden ist).

	$ git svn rebase
	       M      README.txt
	r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
	First, rewinding head to replay your work on top of it...
	Applying: first user change

<!--Now, all your work is on top of what is on the Subversion server, so you can successfully `dcommit`:-->

Jetzt sind alle Deine Arbeiten auf der gleichen Ebene wie die auf dem Subversion-Server und nun kannst Du erfolgreich ein `dcommit` absetzen:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r81
	       M      README.txt
	r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

<!--It’s important to remember that unlike Git, which requires you to merge upstream work you don’t yet have locally before you can push, `git svn` makes you do that only if the changes conflict. If someone else pushes a change to one file and then you push a change to another file, your `dcommit` will work fine:-->

Es ist wichtig, im Hinterkopf zu behalten, dass `git svn` sich an dieser Stelle anders als Git verhält. Git erwartet von Dir, dass Du upstream-Arbeiten, die Du lokal noch nicht hast, zunächst mergst, bevor Du pushen kannst. Dieses Vorgehen ist bei `git svn` nur nötig, wenn es Konflikte bei den Änderungen gibt. Wenn jemand anderes eine geänderte Datei gepusht hat und Du eine andere geänderte Datei pushst, wird Dein `dcommit` problemlos funktionieren:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      configure.ac
	Committed r84
	       M      autogen.sh
	r83 = 8aa54a74d452f82eee10076ab2584c1fc424853b (trunk)
	       M      configure.ac
	r84 = cdbac939211ccb18aa744e581e46563af5d962d0 (trunk)
	W: d2f23b80f67aaaa1f6f5aaef48fce3263ac71a92 and refs/remotes/trunk differ, \
	  using rebase:
	:100755 100755 efa5a59965fbbb5b2b0a12890f1b351bb5493c18 \
	  015e4c98c482f0fa71e4d5434338014530b37fa6 M   autogen.sh
	First, rewinding head to replay your work on top of it...
	Nothing to do.

<!--This is important to remember, because the outcome is a project state that didn’t exist on either of your computers when you pushed. If the changes are incompatible but don’t conflict, you may get issues that are difficult to diagnose. This is different than using a Git server — in Git, you can fully test the state on your client system before publishing it, whereas in SVN, you can’t ever be certain that the states immediately before commit and after commit are identical.-->

Das ist darum wichtig, weil der daraus resultierende Projekt-Status auf keinem der Computer existierte als Du die Änderungen gepusht hast. Wenn die Änderungen nicht zueinander kompatibel sind aber keinen Konflikt ergeben, wirst Du Probleme bekommen, die schwer zu diagnostizieren sind. Das ist der Unterschied zu einem Git-Server — mit Git kannst Du den Zustand Deines Client-Systems komplett testen bevor Du ihn veröffentlichst, während Du bei Subversion nie sicher sein kannst, dass der Zustand direkt vor und direkt nach dem Commit identisch sind.

<!--You should also run this command to pull in changes from the Subversion server, even if you’re not ready to commit yourself. You can run `git svn fetch` to grab the new data, but `git svn rebase` does the fetch and then updates your local commits.-->

Du solltest Dieses Kommando auch ausführen um Änderungen vom Subversion-Server zu ziehen, selbst wenn Du noch nicht so weit bist, einen Commit durchzuführen. Du kannst `git svn fetch` ausführen um die neuen Daten zu besorgen aber `git svn rebase` zieht die Daten ebenfalls und aktualisiert Deine lokalen Commits.

	$ git svn rebase
	       M      generate_descriptor_proto.sh
	r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
	First, rewinding head to replay your work on top of it...
	Fast-forwarded master to refs/remotes/trunk.

<!--Running `git svn rebase` every once in a while makes sure your code is always up to date. You need to be sure your working directory is clean when you run this, though. If you have local changes, you must either stash your work or temporarily commit it before running `git svn rebase` — otherwise, the command will stop if it sees that the rebase will result in a merge conflict.-->

Wenn Du `git svn rebase`ab und an ausführst, stellst Du sicher, dass Dein Code immer up-to-date ist. Du musst Dir aber sicher sein, dass Dein Arbeitsverzeichnis „sauber“ ist, bevor Du den Befehl ausführst. Wenn Du lokale Änderungen hast, musst Du Deine Arbeit vor dem `git svn rebase` entweder stashen oder temporär commiten. Anderenfalls wird die Ausführung des Befehls angehalten, wenn das Rebase in einem Merge-Konflikt enden würde.

<!--## Git Branching Issues-->
## Probleme beim Benutzen von Branches

<!--When you’ve become comfortable with a Git workflow, you’ll likely create topic branches, do work on them, and then merge them in. If you’re pushing to a Subversion server via git svn, you may want to rebase your work onto a single branch each time instead of merging branches together. The reason to prefer rebasing is that Subversion has a linear history and doesn’t deal with merges like Git does, so git svn follows only the first parent when converting the snapshots into Subversion commits.-->

Wenn Du Dich an den Git-Workflow gewöhnt hast, wirst Du höchstwahrscheinlich Zweige für Deine Arbeitspakete anlegen, mit ihnen arbeiten und sie anschließend wieder mergen. Wenn Du mit `git svn` auf einen Subversion-Server pushst, führst Du am besten eine Rebase-Operation in einen einzigen Zweig durch anstatt alle Zweige zusammenzufügen. Der Grund dafür, das Rebase zu bevorzugen, liegt darin, dass Subversion eine lineare Historie hat und mit dem Merge-Operationen nicht wie Git es tut. Daher folgt `git svn` nur dem ersten Elternelement, wenn es Snapshots in Subversion-Commits umwandelt.

<!--Suppose your history looks like the following: you created an `experiment` branch, did two commits, and then merged them back into `master`. When you `dcommit`, you see output like this:-->

Angenommen, Deine Historie sieht wie folgt aus: Du hast einen Zweig mit dem Namen `experiment` angelegt, zwei Commits durchgeführt und diese dann anschließen mit `master`zusammengeführt. Führst Du nun ein `dcommit` durch, sieht die Ausgabe wie folgt aus:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      CHANGES.txt
	Committed r85
	       M      CHANGES.txt
	r85 = 4bfebeec434d156c36f2bcd18f4e3d97dc3269a2 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk
	COPYING.txt: locally modified
	INSTALL.txt: locally modified
	       M      COPYING.txt
	       M      INSTALL.txt
	Committed r86
	       M      INSTALL.txt
	       M      COPYING.txt
	r86 = 2647f6b86ccfcaad4ec58c520e369ec81f7c283c (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

<!--Running `dcommit` on a branch with merged history works fine, except that when you look at your Git project history, it hasn’t rewritten either of the commits you made on the `experiment` branch — instead, all those changes appear in the SVN version of the single merge commit.-->

Das Ausführen von `dcommit` in einem Zweig mit zusammengeführter Historie funktioniert wunderbar, mit der folgenden Ausnahme: wenn Du Deinen Git-Projekthistorie anschaust, wurden die Commits, die Du im `experiment`-Zweig gemacht hast, nicht neu geschrieben — stattdessen tauchen alle diese Änderungen in der SVN-Version des einzelnen Merge-Commits auf.

<!--When someone else clones that work, all they see is the merge commit with all the work squashed into it; they don’t see the commit data about where it came from or when it was committed.-->

Wenn nun jemand anderes Deine Arbeit klont, ist alles, was er oder sie sieht, der Merge-Commit mit all Deinen Änderungen insgesamt; die Daten zu den einzelnen Commits (den Urpsrung und die Zeit, wann die Commits stattfanden) sehen sie nicht.

<!--## Subversion Branching-->
## Subversion-Zweige

<!--Branching in Subversion isn’t the same as branching in Git; if you can avoid using it much, that’s probably best. However, you can create and commit to branches in Subversion using git svn.-->

Das Arbeiten mit Zweigen in Subversion ist nicht das gleiche wie mit Zweigen in Git arbeiten; es ist wohl das beste, wenn Du es vermeiden kannst, viel damit zu arbeiten. Dennoch kannst Du mit `git svn` Zweige in Subversion anlegen und Commits darin durchführen.

<!--### Creating a New SVN Branch-->
### Einen neuen SVN-Zweig anlegen

<!--To create a new branch in Subversion, you run `git svn branch [branchname]`:-->

Um einen neuen Zweig in Subversion anzulegen, führst Du `git svn branch [branchname]` aus:

	$ git svn branch opera
	Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
	Found possible branch point: file:///tmp/test-svn/trunk => \
	  file:///tmp/test-svn/branches/opera, 87
	Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
	Following parent with do_switch
	Successfully followed parent
	r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

<!--This does the equivalent of the `svn copy trunk branches/opera` command in Subversion and operates on the Subversion server. It’s important to note that it doesn’t check you out into that branch; if you commit at this point, that commit will go to `trunk` on the server, not `opera`.-->

Dieser Befehl macht genau das gleiche wie das `svn copy trunk branches/opera`-Kommando in Subversion und arbeitet auf dem Subversion-Server. Wichtig hierbei ist, dass Du mit Deiner Arbeit nicht automatisch in diesen Zweig wechselst: wenn Du zu diesem Zeitpunkt einen Commit durchführst, wird dieser in `trunk` auf dem Server landen, nicht im `opera`-Zweig.

<!--## Switching Active Branches-->
## Den aktiven Zweig wechseln

<!--Git figures out what branch your dcommits go to by looking for the tip of any of your Subversion branches in your history — you should have only one, and it should be the last one with a `git-svn-id` in your current branch history.-->

Git findet heraus, in welchem Zweig Deine `dcommits` abgelegt werden, indem es den tip jedes Subversion-Zweiges in Deiner Historie untersucht — Du solltest nur einen einzigen haben und es sollte der letzte mit einer `git-svn-id` in der aktuellen Historie des Zweiges sein.

<!--If you want to work on more than one branch simultaneously, you can set up local branches to `dcommit` to specific Subversion branches by starting them at the imported Subversion commit for that branch. If you want an `opera` branch that you can work on separately, you can run-->

Wenn Du gleichzeitig mit mehr als einem Zweig arbeiten willst, kannst Du lokale Zweige derart anlegen, dass ein `dcommit` für sie in bestimmte Subversion-Zweige durchgeführt wird. Dazu startest Du diese beim importierten Subversion-Commit für diesen Zweig. Wenn Du einen `opera`-Zweig haben willst, an dem Du separat arbeiten kannst, führst Du

	$ git branch opera remotes/opera

<!--Now, if you want to merge your `opera` branch into `trunk` (your `master` branch), you can do so with a normal `git merge`. But you need to provide a descriptive commit message (via `-m`), or the merge will say "Merge branch opera" instead of something useful.-->

aus. Wenn Du jetzt Deinen `opera`-Zweig in `trunk` (Deinen `master`-Zweig) zusammenführen willst , kannst Du das mit einem normalen `git merge` machen. Du solltest allerdings eine aussagekräftige Commit-Beschreibung angeben (mit `-m`) oder sie wird statt etwas Sinnvollem „Merge branch opera“ lauten.

<!--Remember that although you’re using `git merge` to do this operation, and the merge likely will be much easier than it would be in Subversion (because Git will automatically detect the appropriate merge base for you), this isn’t a normal Git merge commit. You have to push this data back to a Subversion server that can’t handle a commit that tracks more than one parent; so, after you push it up, it will look like a single commit that squashed in all the work of another branch under a single commit. After you merge one branch into another, you can’t easily go back and continue working on that branch, as you normally can in Git. The `dcommit` command that you run erases any information that says what branch was merged in, so subsequent merge-base calculations will be wrong — the dcommit makes your `git merge` result look like you ran `git merge -\-squash`. Unfortunately, there’s no good way to avoid this situation — Subversion can’t store this information, so you’ll always be crippled by its limitations while you’re using it as your server. To avoid issues, you should delete the local branch (in this case, `opera`) after you merge it into trunk.-->

Behalte im Hinterkopf, dass dieses Vorgehen kein normaler Git-Merge-Commit ist, auch wenn Du den `git merge`-Befehl verwendes und das Zusammenführen wahrscheinlich wesentlich einfacher ist als es in Subversion gewesen wäre (weil Git automatisch die passende Basis für das Zusammenführen der Zweige für Dich herausfindet=. Du musst diese Daten  zurück auf den Subversion-Server schieben, der nicht mit Commits umgehen kann, die mehr als ein Elternelement haben; all Deine Änderungen aus einem anderen Zweig werden in diesem einen Commit zusammengepresst, wenn Du die Änderungen hochschiebst. Nachdem Du einen Zweig mit einem anderen zusammengefügt hast, kannst Du nicht einfach zurückgehen und mit der Arbeit an diesem Zweig weitermachen, wie Du das normalerweise in Git machen würdest. Wenn Du das `dcommit`-Kommando ausführst, löscht es jegliche Information darüber, welcher Zweig hier hineingefügt wurde und als Folge dessen werden künftige merge-base-Berechnungen falsche sein — die `dcommit`-Operation lässt Dein `git merge`-Ergebnis so aussehen als ob Du `git merge --squash` verwendet hättest.
Unglücklicherweise gibt es kein ideales Mittel, diese Situation zu vermeiden — Subversion kann diese Information einfach nicht speichern, daher wirst Du immer unter seinen beschränkten Möglichkeiten zu leiden haben, so lange Du es als Server verwendest. Um diese Probleme zu vermeiden, solltest Du den lokalen Zweig (in unserem Beispiel `opera`) löschen, nachdem Du ihn mit dem `trunk` zusammengeführt hast.

<!--## Subversion Commands-->
## Subversion Befehle

<!--The `git svn` toolset provides a number of commands to help ease the transition to Git by providing some functionality that’s similar to what you had in Subversion. Here are a few commands that give you what Subversion used to.-->

Das `git svn`-Werkzeug bietet eine ganze Reihe von Befehlen an, die Dir helfen, den Übergang zu Git zu vereinfachen, indem sie einige Funktionen bereitstellen, die jeden ähneln, die Du bereits in Subversion kanntest. Hier sind ein paar Befehle, die Dir solche Funktionen bereitstellen wie das Subversion früher für Dich tat:

<!--### SVN Style History-->
### Historie im SVN-Stil

<!--If you’re used to Subversion and want to see your history in SVN output style, you can run `git svn log` to view your commit history in SVN formatting:-->

Wenn Du an Subversion gewöhnt bist und Deine Historie so sehen möchtest, wie SVN sie ausgeben würde, kannst Du `git svn log` ausführen, um Deine Commit-Historie in der SVN-Formatierung anzusehen:

	$ git svn log
	------------------------------------------------------------------------
	r87 | schacon | 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009) | 2 lines

	autogen change

	------------------------------------------------------------------------
	r86 | schacon | 2009-05-02 16:00:21 -0700 (Sat, 02 May 2009) | 2 lines

	Merge branch 'experiment'

	------------------------------------------------------------------------
	r85 | schacon | 2009-05-02 16:00:09 -0700 (Sat, 02 May 2009) | 2 lines

	updated the changelog

<!--You should know two important things about `git svn log`. First, it works offline, unlike the real `svn log` command, which asks the Subversion server for the data. Second, it only shows you commits that have been committed up to the Subversion server. Local Git commits that you haven’t dcommited don’t show up; neither do commits that people have made to the Subversion server in the meantime. It’s more like the last known state of the commits on the Subversion server.-->

Du solltest zwei wichtige Dinge über `git svn log` wissen. Erstens: es arbeitet offline, im Gegensatz zum echten `svn log`-Befehl, der den Subversion-Server nach den Daten fragt. Zweitens: es zeigt Dir nur Commits an, die auf den Subversion-Server committet wurden. Lokale Git-Commits die Du nicht mit `dcommit` bestätigt hast, werden nicht aufgeführt, genausowenig wie Commits, die andere in der Zwischenzeit auf dem Subversion-Server gemacht haben. Die Ausgabe zeigt Dir eher den letzten bekannten Zustand der Commits auf dem Subversion-Server.

<!--### SVN Annotation-->
### SVN Vermerke (SVN Annotation)

<!--Much as the `git svn log` command simulates the `svn log` command offline, you can get the equivalent of `svn annotate` by running `git svn blame [FILE]`. The output looks like this:-->

Genauso wie das Kommando `git svn log` den `svn log`-Befehl offline simuliert kannst Du das Pendant zu `svn annotate` mit dem Befehl `git svn blame [FILE]` ausführen. Die Ausgabe sieht so aus:

	$ git svn blame README.txt
	 2   temporal Protocol Buffers - Google's data interchange format
	 2   temporal Copyright 2008 Google Inc.
	 2   temporal http://code.google.com/apis/protocolbuffers/
	 2   temporal
	22   temporal C++ Installation - Unix
	22   temporal =======================
	 2   temporal
	79    schacon Committing in git-svn.
	78    schacon
	 2   temporal To build and install the C++ Protocol Buffer runtime and the Protocol
	 2   temporal Buffer compiler (protoc) execute the following:
	 2   temporal

<!--Again, it doesn’t show commits that you did locally in Git or that have been pushed to Subversion in the meantime.-->

Auch dieser Befehl zeigt die Commits nicht an, die Du lokal getätigt hast, genauso wenig wie jene, die in der Zwischenzeit zum Subversion-Server übertragen wurden.

<!--### SVN Server Information-->
### SVN-Server-Informationen

<!--You can also get the same sort of information that `svn info` gives you by running `git svn info`:-->

Die selben Informationen wie bei `svn info` bekommst Du, wenn Du `git svn info` ausführst:

	$ git svn info
	Path: .
	URL: https://schacon-test.googlecode.com/svn/trunk
	Repository Root: https://schacon-test.googlecode.com/svn
	Repository UUID: 4c93b258-373f-11de-be05-5f7a86268029
	Revision: 87
	Node Kind: directory
	Schedule: normal
	Last Changed Author: schacon
	Last Changed Rev: 87
	Last Changed Date: 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009)

<!--This is like `blame` and `log` in that it runs offline and is up to date only as of the last time you communicated with the Subversion server.-->

Genauso wie `blame` und `log` läuft die Ausführung dieses Befehls offline ab und ist nur so aktuell wie zu dem Zeitpunkt, zu dem Du das letzte Mal mit dem Subversion-Server verbunden warst.

<!--### Ignoring What Subversion Ignores-->
### Ignorieren, was Subversion ignoriert

<!--If you clone a Subversion repository that has `svn:ignore` properties set anywhere, you’ll likely want to set corresponding `.gitignore` files so you don’t accidentally commit files that you shouldn’t. `git svn` has two commands to help with this issue. The first is `git svn create-ignore`, which automatically creates corresponding `.gitignore` files for you so your next commit can include them.-->

Wenn Du ein Subversion-Repository klonst, das irgendwo `svn:ignore` Eigenschaften definiert hat, wirst Du die `.gitignore`-Dateien wahrscheinlich entsprechend setzen, damit Du nicht aus Versehen Dateien committest, bei denen Du das besser nicht tun solltest. `git svn` kennt zwei Befehle, um Dir bei diesem Problem zu helfen. Der erste ist `git svn create-ignore`, der automatisch entsprechende `.gitignore`-Dateien für Dich anlegt, sodass Dein nächster Commit diese beinhalten kann.

<!--The second command is `git svn show-ignore`, which prints to stdout the lines you need to put in a `.gitignore` file so you can redirect the output into your project exclude file:-->

Der zweite Befehl ist `git svn show-ignore`, der Dir diejenigen Zeilen auf stdout ausgibt, die Du in eine `.gitignore`-Datei einfügen musst. So kannst Du die Ausgabe des Befehls direkt in die Ausnahmedatei umleiten:

	$ git svn show-ignore > .git/info/exclude

<!--That way, you don’t litter the project with `.gitignore` files. This is a good option if you’re the only Git user on a Subversion team, and your teammates don’t want `.gitignore` files in the project.-->

Auf diese Weise müllst Du Dein Projekt nicht mit `.gitignore`-Dateien zu. Das ist eine gute Wahl wenn Du der einzige Git-Benutzer in Deinem Team bist (alle anderen benutzen Subversion) und Deine Kollegen keine `.gitignore`-Dateien im Projekt haben wollen.

<!--## Git-Svn Summary-->
## Zusammenfassung von Git-Svn

<!--The `git svn` tools are useful if you’re stuck with a Subversion server for now or are otherwise in a development environment that necessitates running a Subversion server. You should consider it crippled Git, however, or you’ll hit issues in translation that may confuse you and your collaborators. To stay out of trouble, try to follow these guidelines:-->

Die `git svn`-Werkzeuge sind sehr nützlich, wenn Du derzeit (noch) an einen Subversion-Server gebunden bist oder Dich anderweitig in einer Entwicklungsumgebung befindest, die nicht auf einen Subversion-Server verzichten kann. Wie auch immer: Du solltest es als eine Art gestutztes Git ansehen. Anderenfalls läufst Du Gefahr, Dich und Deine Kollegen durcheinander zu bringen. Um dieses Kliff zu umschiffen, solltest Du folgende Richtlinien befolgen:

<!--* Keep a linear Git history that doesn’t contain merge commits made by `git merge`. Rebase any work you do outside of your mainline branch back onto it; don’t merge it in.-->
<!--* Don’t set up and collaborate on a separate Git server. Possibly have one to speed up clones for new developers, but don’t push anything to it that doesn’t have a `git-svn-id` entry. You may even want to add a `pre-receive` hook that checks each commit message for a `git-svn-id` and rejects pushes that contain commits without it.-->

* Versuch, eine „geradlinige“ Git-Historie zu führen, die keine von `git merge` durchgeführten Merges enthält. Alle Arbeiten, die Du außerhalb des Hauptzweiges durchführst, solltest Du mit `rebase` in ihn aufnehmen anstatt sie zu mit `merge` zusammenzuführen.
* Setz keinen zusätzlichen, externen Git-Server auf, mit dem Du arbeiten möchtest. Du kannst einen aufsetzen um die Klone für neue Entwickler zu beschleunigen, aber Du solltest keine Änderungen dorthin pushen, die keine `git-svn-id`-Einträge haben. Du solltest vielleicht sogar darüber nachdenken, einen `pre-receive`-Hook einzusetzen, der jede Commit-Nachricht auf eine `git-svn-id` prüft und bestimmte Pushes ablehnt, bei denen diese IDs fehlt.

<!--If you follow those guidelines, working with a Subversion server can be more bearable. However, if it’s possible to move to a real Git server, doing so can gain your team a lot more.-->

Wenn Du diese Ratschläge befolgst, werden sie die Arbeit mit dem Subversion-Server erträglich machen. Wenn es Dir irgendwie möglich ist, solltest Du trotzdem zu einem echten Git-Server umziehen, denn davon profitiert Dein Team wesentlich deutlicher.

<!--# Migrating to Git-->