# Mit externen Repositorys arbeiten

<!--To be able to collaborate on any Git project, you need to know how to manage your remote repositories. Remote repositories are versions of your project that are hosted on the Internet or network somewhere. You can have several of them, each of which generally is either read-only or read/write for you. Collaborating with others involves managing these remote repositories and pushing and pulling data to and from them when you need to share work.-->
<!--Managing remote repositories includes knowing how to add remote repositories, remove remotes that are no longer valid, manage various remote branches and define them as being tracked or not, and more. In this section, we’ll cover these remote-management skills.-->

Um mit anderen via Git zusammenzuarbeiten, musst Du wissen, wie Du auf externe (engl. „remote“) Repositorys zugreifen kannst. Remote Repositorys sind Versionen Deines Projektes, die im Internet oder irgendwo in einem anderen Netzwerk gespeichert sind. Du kannst mehrere solcher Repositorys haben und Du kannst jedes davon entweder nur lesen oder lesen und schreiben. Mit anderen via Git zusammenzuarbeiten impliziert, solche Repositorys zu verwalten und Daten aus ihnen herunter- oder heraufzuladen, um Deine Arbeit für andere verfügbar zu machen. Um Remote Repositorys zu verwalten, muss man wissen, wie man sie anlegt und wieder entfernt, wenn sie nicht mehr verwendet werden, wie man externe Branches verwalten und nachverfolgen kann, und mehr. In diesem Kapitel werden wir auf diese Aufgaben eingehen.

<!--## Showing Your Remotes-->
## Remote Repositorys anzeigen

<!--To see which remote servers you have configured, you can run the `git remote` command. It lists the shortnames of each remote handle you’ve specified. If you’ve cloned your repository, you should at least see *origin* — that is the default name Git gives to the server you cloned from:-->

Der `git remote` Befehl zeigt Dir an, welche externen Server Du für Dein Projekt lokal konfiguriert hast, und listet die Kurzbezeichnungen für diese Remote Repository auf. Wenn Du ein Repository geklont hast, solltest Du mindestens `origin` sehen – welches der Standardname ist, den Git für denjenigen Server vergibt, von dem Du geklont hast:

	$ git clone git://github.com/schacon/ticgit.git
	Cloning into 'ticgit'...
	remote: Reusing existing pack: 1857, done.
	remote: Total 1857 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (1857/1857), 374.35 KiB | 193.00 KiB/s, done.
	Resolving deltas: 100% (772/772), done.
	Checking connectivity... done.
	$ cd ticgit
	$ git remote
	origin

<!--You can also specify `-v`, which shows you the URL that Git has stored for the shortname to be expanded to:-->

Du kannst außerdem die Option `-v` verwenden, welche für jeden Kurznamen auch die jeweilige URL anzeigt, die Git gespeichert hat:

	$ git remote -v
	origin  git://github.com/schacon/ticgit.git (fetch)
	origin  git://github.com/schacon/ticgit.git (push)

<!--If you have more than one remote, the command lists them all. For example, my Grit repository looks something like this.-->

Wenn Du mehr als ein Remote Repository konfiguriert hast, zeigt der Befehl alle an. Für mein eigenes Grit Repository sieht das beispielsweise wie folgt aus:

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

<!--This means we can pull contributions from any of these users pretty easily. But notice that only the origin remote is an SSH URL, so it’s the only one I can push to (we’ll cover why this is in *Chapter 4*).-->

D.h., mein lokales Repository kennt die Repositorys von all diesen Leuten und ich kann ihre Beiträge zu meinem Projekt ganz einfach herunterladen und zum Projekt hinzufügen.

<!--## Adding Remote Repositories-->
## Remote Repositorys hinzufügen

<!--I’ve mentioned and given some demonstrations of adding remote repositories in previous sections, but here is how to do it explicitly. To add a new remote Git repository as a shortname you can reference easily, run `git remote add [shortname] [url]`:-->

Ich habe in vorangegangenen Kapiteln schon Beispiele dafür aufgezeigt, wie man ein Remote Repository hinzufügen kann, aber ich will noch einmal darauf eingehen. Um ein neues Remote Repository mit einem Kurznamen hinzuzufügen, den Du Dir leicht merken kannst, führst Du den Befehl `git remote add [shortname] [url]` aus:

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

<!--Now you can use the string `pb` on the command line in lieu of the whole URL. For example, if you want to fetch all the information that Paul has but that you don’t yet have in your repository, you can run `git fetch pb`:-->

Jetzt kannst Du den Namen `pb` anstelle der vollständingen URL in verschiedenen Befehlen verwenden. Wenn Du bespielsweise alle Informationen, die in Pauls, aber noch nicht in Deinem eigenen Repository verfügbar sind, herunterladen willst, kannst Du den Befehl `git fetch pb` verwenden:

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

<!--Paul’s master branch is accessible locally as `pb/master` — you can merge it into one of your branches, or you can check out a local branch at that point if you want to inspect it.-->

Pauls master Branch ist jetzt lokal auf Deinem Rechner als `pb/master` verfügbar – Du kannst ihn mit einem Deiner eigenen Branches zusammenführen oder auf einen lokalen Branch wechseln, um damit zu arbeiten.

<!--## Fetching and Pulling from Your Remotes-->
## Änderungen aus Remote Repositorys herunterladen und herunterladen inkl. zusammenführen

<!--As you just saw, to get data from your remote projects, you can run:-->

Wie Du gerade gesehen hast, kannst Du Daten aus Remote Repositorys herunterladen, indem Du den folgenden Befehl verwendest:

	$ git fetch [remote-name]

<!--The command goes out to that remote project and pulls down all the data from that remote project that you don’t have yet. After you do this, you should have references to all the branches from that remote, which you can merge in or inspect at any time. (We’ll go over what branches are and how to use them in much more detail in *Chapter 3*.)-->

Dieser Befehl lädt alle Daten aus dem Remote Repository herunter, die noch nicht auf Deinem Rechner verfügbar sind. Danach kennt Dein eigenes Repository Verweise auf alle Branches in dem Remote Repository, die Du jederzeit mit Deinen eigenen Branches zusammenführen oder durchschauen kannst. (Wir werden in Kapitel 3 detaillierter darauf eingehen, was genau Branches sind.)

<!--If you clone a repository, the command automatically adds that remote repository under the name *origin*. So, `git fetch origin` fetches any new work that has been pushed to that server since you cloned (or last fetched from) it. It’s important to note that the `fetch` command pulls the data to your local repository — it doesn’t automatically merge it with any of your work or modify what you’re currently working on. You have to merge it manually into your work when you’re ready.-->

Wenn Du ein Repository geklont hast, legt der Befehl automatisch einen Verweis auf dieses Repository unter dem Namen `origin` an. D.h. `git fetch origin` lädt alle Neuigkeiten herunter, die in dem Remote Repository von anderen hinzugefügt wurden, seit Du es geklont hast (oder zuletzt `git fetch` ausgeführt hast). Es ist wichtig, zu verstehen, dass der `git fetch` Befehl Daten lediglich in Dein lokales Repository lädt. Er führt sich mit Deinen eigenen Commits in keiner Weise zusammen (mergt) oder modifiziert, woran Du gerade arbeitest. D.h. Du musst die heruntergeladenen Änderungen anschließend selbst manuell mit Deinen eigenen zusammeführen, wenn Du das willst.

<!--If you have a branch set up to track a remote branch (see the next section and *Chapter 3* for more information), you can use the `git pull` command to automatically fetch and then merge a remote branch into your current branch. This may be an easier or more comfortable workflow for you; and by default, the `git clone` command automatically sets up your local master branch to track the remote master branch on the server you cloned from (assuming the remote has a master branch). Running `git pull` generally fetches data from the server you originally cloned from and automatically tries to merge it into the code you’re currently working on.-->

Wenn Du allerdings einen Branch so aufgesetzt hast, dass er einem Remote Branch „folgt“ (also einen „Tracking Branch“, wir werden im nächsten Abschnitt und in Kapitel 3 noch genauer darauf eingehen), dann kannst Du den Befehl `git pull` verwenden, um automatisch neue Daten herunterzuladen und den externen Branch gleichzeitig mit dem aktuellen, lokalen Branch zusammenzuführen. Das ist oft die bequemere Arbeitsweise. `git clone` setzt Deinen lokalen master Branch deshalb standardmäßig so auf, dass er dem Remote master Branch des geklonten Repositorys folgt (sofern das Remote Repository einen master Branch hat). Wenn Du dann `git pull` ausführst, wird Git die neuen Commits aus dem externen Repository holen und versuchen, sie automatisch mit dem Code zusammenzuführen, an dem Du gerade arbeitest.

<!--## Pushing to Your Remotes-->
## Änderungen in ein Remote Repository hochladen

<!--When you have your project at a point that you want to share, you have to push it upstream. The command for this is simple: `git push [remote-name] [branch-name]`. If you want to push your master branch to your `origin` server (again, cloning generally sets up both of those names for you automatically), then you can run this to push your work back up to the server:-->

Wenn Du mit Deinem Projekt an einen Punkt gekommen bist, an dem Du es anderen zur Verfügung stellen willst, kannst Du Deine Änderungen in ein gemeinsam genutztes Repository hochladen (engl. „push“). Der Befehl dafür ist einfach: `git push [remote-name] [branch-name]`. Wenn Du Deinen master Branch auf den `origin` Server hochladen willst (noch einmal, wenn Du ein Repository klonst, setzt Git diesen Namen automatisch für dich), dann kannst Du diesen Befehl verwenden:

	$ git push origin master

<!--This command works only if you cloned from a server to which you have write access and if nobody has pushed in the meantime. If you and someone else clone at the same time and they push upstream and then you push upstream, your push will rightly be rejected. You’ll have to pull down their work first and incorporate it into yours before you’ll be allowed to push. See *Chapter 3* for more detailed information on how to push to remote servers.-->

Das funktioniert nur dann, wenn Du Schreibrechte für das jeweilige Repository besitzt und niemand anders in der Zwischenzeit irgendwelche Änderungen hochgeladen hat. Wenn zwei Leute ein Repository zur gleichen Zeit klonen, dann zuerst der eine seine Änderungen hochlädt und der zweite anschließend versucht, das gleiche zu tun, dann wird sein Versuch korrekterweise abgewiesen. In dieser Situation muss man neue Änderungen zunächst herunterladen und mit seinen eigenen zusammenführen, um sie dann erst hochzuladen. In Kapitel 3 gehen wir noch einmal ausführlicher darauf ein.

<!--## Inspecting a Remote-->
## Ein Remote Repository durchstöbern

<!--If you want to see more information about a particular remote, you can use the `git remote show [remote-name]` command. If you run this command with a particular shortname, such as `origin`, you get something like this:-->

Wenn Du etwas über ein bestimmtes Remote Repository wissen willst, kannst Du den Befehl `git remote show [remote-name]` verwenden. Wenn Du diesen Befehl mit dem entsprechenden Kurznamen, z.B. `origin` verwendest, erhältst Du etwa folgende Ausgabe:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

<!--It lists the URL for the remote repository as well as the tracking branch information. The command helpfully tells you that if you’re on the master branch and you run `git pull`, it will automatically merge in the master branch on the remote after it fetches all the remote references. It also lists all the remote references it has pulled down.-->

Das zeigt Dir die URL für das Remote Repository, die Information welche Branches verfolgt werden und welcher Branch aus dem Remote Repository mit Deinem eigenen Master zusammengeführt wird, wenn Du `git pull` ausführst.

<!--That is a simple example you’re likely to encounter. When you’re using Git more heavily, however, you may see much more information from `git remote show`:-->

Dies ist ein eher einfaches Beispiel, das Dir früher oder später so ähnlich über den Weg laufen wird. Wenn Du Git aber täglich verwendest, erhältst Du mit `git remote show` sehr viel mehr Informationen:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

<!--This command shows which branch is automatically pushed when you run `git push` on certain branches. It also shows you which remote branches on the server you don’t yet have, which remote branches you have that have been removed from the server, and multiple branches that are automatically merged when you run `git pull`.-->

Dieser Befehl zeigt, welcher Branch automatisch hochgeladen werden wird, wenn Du `git push` auf bestimmten Branches ausführst. Er zeigt außerdem, welche Branches es im Remote Repository gibt, die Du selbst noch nicht hast, welche Branches dort gelöscht wurden, und Branches, die automatisch mit lokalen Branches zusammengeführt werden, wenn Du `git pull` ausführst.

<!--## Removing and Renaming Remotes-->
## Verweise auf externe Repositorys löschen und umbenennen

<!--If you want to rename a reference, in newer versions of Git you can run `git remote rename` to change a remote’s shortname. For instance, if you want to rename `pb` to `paul`, you can do so with `git remote rename`:-->

Wenn Du eine Referenz auf ein Remote Repository umbenennen willst, kannst Du in neueren Git Versionen den Befehl `git remote rename` verwenden, um den Kurznamen zu ändern. Wenn Du beispielsweise `pb` in `paul` umbenennen willst, lautet der Befehl:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

<!--It’s worth mentioning that this changes your remote branch names, too. What used to be referenced at `pb/master` is now at `paul/master`.-->

Beachte dabei, dass dies Deine Branch Namen für Remote Branches ebenfalls ändert. Der Branch, der zuvor mit `pb/master` referenziert werden konnte, heißt jetzt `paul/master`.

<!--If you want to remove a reference for some reason — you’ve moved the server or are no longer using a particular mirror, or perhaps a contributor isn’t contributing anymore — you can use `git remote rm`:-->

Wenn Du eine Referenz aus irgendeinem Grund entfernen willst (z.B. weil Du den Server umgezogen hast oder einen bestimmten Mirror nicht länger verwendest, oder weil jemand vielleicht nicht länger mitarbeitet), kannst Du `git remote rm` verwenden:

	$ git remote rm paul
	$ git remote
	origin

<!--# Tagging-->