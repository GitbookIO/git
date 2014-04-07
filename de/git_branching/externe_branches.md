# Externe Branches

<!--Remote branches are references to the state of branches on your remote repositories. They’re local branches that you can’t move; they’re moved automatically whenever you do any network communication. Remote branches act as bookmarks to remind you where the branches on your remote repositories were the last time you connected to them.-->

Externe (Remote) Branches sind Referenzen auf den Zustand der Branches in Deinen externen Repositorys. Es sind lokale Branches die Du nicht verändern kannst, sie werden automatisch verändert wann immer Du eine Netzwerkoperation durchführst. Externe Branches verhalten sich wie Lesezeichen, um Dich daran zu erinnern an welcher Position sich die Branches in Deinen externen Repositories befanden, als Du Dich zuletzt mit ihnen verbunden hattest.

<!--They take the form `(remote)/(branch)`. For instance, if you wanted to see what the `master` branch on your `origin` remote looked like as of the last time you communicated with it, you would check the `origin/master` branch. If you were working on an issue with a partner and they pushed up an `iss53` branch, you might have your own local `iss53` branch; but the branch on the server would point to the commit at `origin/iss53`.-->

Externe Branches besitzen die Schreibweise `(Repository)/(Branch)`. Wenn Du beispielsweise wissen möchtest wie der `master`-Branch in Deinem `origin`-Repository ausgesehen hat, als Du zuletzt Kontakt mit ihm hattest, dann würdest Du den `origin/master`-Branch überprüfen. Wenn Du mit einem Mitarbeiter an einer Fehlerbehebung gearbeitet hast, und dieser bereits einen `iss53`-Branch hochgeladen hat, besitzt Du möglicherweise Deinen eigenen lokalen `iss53`-Branch. Der Branch auf dem Server würde allerdings auf den Commit von `origin/iss53` zeigen.

<!--This may be a bit confusing, so let’s look at an example. Let’s say you have a Git server on your network at `git.ourcompany.com`. If you clone from this, Git automatically names it `origin` for you, pulls down all its data, creates a pointer to where its `master` branch is, and names it `origin/master` locally; and you can’t move it. Git also gives you your own `master` branch starting at the same place as origin’s `master` branch, so you have something to work from (see Figure 3-22).-->

Das kann ein wenig verwirrend sein, lass uns also ein Besipiel betrachten. Nehmen wir an Du hättest in Deinem Netzwerk einen Git-Server mit der Adresse `git.ourcompany.com`. Wenn Du von ihm klonst, nennt Git ihn automatisch `origin` für dich, lädt all seine Daten herunter, erstellt einen Zeiger an die Stelle wo sein `master`-Branch ist und benennt es lokal `origin/master`; und er ist unveränderbar für dich. Git gibt Dir auch einen eigenen `master`-Branch mit der gleichen Ausgangsposition wie origins `master`-Branch, damit Du einen Punkt für den Beginn Deiner Arbeiten hast (siehe Abbildung 3-22).

<!--Figure 3-22. A Git clone gives you your own master branch and origin/master pointing to origin’s master branch.-->


![](http://git-scm.com/figures/18333fig0322-tn.png)

Abbildung 3-22. Ein 'git clone' gibt Dir Deinen eigenen `master`-Branch und `origin/master`, welcher auf origins 'master'-Branch zeigt.

<!--If you do some work on your local master branch, and, in the meantime, someone else pushes to `git.ourcompany.com` and updates its master branch, then your histories move forward differently. Also, as long as you stay out of contact with your origin server, your `origin/master` pointer doesn’t move (see Figure 3-23).-->

Wenn Du ein wenig an Deinem lokalen `master`-Branch arbeitest und unterdessen jemand etwas zu `git.ourcompany.com` herauflädt, verändert er damit dessen `master`-Branch und eure Arbeitsverläufe entwickeln sich unterschiedlich. Indes bewegt sich Dein `origin/master`-Zeiger nicht, solange Du keinen Kontakt mit Deinem `origin`-Server aufnimmst (siehe Abbildung 3-23).

<!--Figure 3-23. Working locally and having someone push to your remote server makes each history move forward differently.-->


![](http://git-scm.com/figures/18333fig0323-tn.png)

Abbildung 3-23. Lokales Arbeiten, während jemand auf Deinen externen Server hochlädt, lässt jeden Änderungsverlauf unterschiedlich weiterentwickeln.

<!--To synchronize your work, you run a `git fetch origin` command. This command looks up which server origin is (in this case, it’s `git.ourcompany.com`), fetches any data from it that you don’t yet have, and updates your local database, moving your `origin/master` pointer to its new, more up-to-date position (see Figure 3-24).-->

Um Deine Arbeit abzugleichen, führe ein `git fetch origin`-Kommando aus. Das Kommando schlägt nach welcher Server `orgin` ist (in diesem Fall `git.ourcompany.com`), holt alle Daten die Dir bisher fehlen und aktualisiert Deine lokale Datenbank, indem es Deinen `orgin/master`-Zeiger auf seine neue aktuellere Position bewegt (siehe Abbildung 3-24).

<!--Figure 3-24. The git fetch command updates your remote references.-->


![](http://git-scm.com/figures/18333fig0324-tn.png)

Abbildung 3-24. Das `git fetch`-Kommando aktualisiert Deine externen Referenzen.

<!--To demonstrate having multiple remote servers and what remote branches for those remote projects look like, let’s assume you have another internal Git server that is used only for development by one of your sprint teams. This server is at `git.team1.ourcompany.com`. You can add it as a new remote reference to the project you’re currently working on by running the `git remote add` command as we covered in Chapter 2. Name this remote `teamone`, which will be your shortname for that whole URL (see Figure 3-25).-->

Um zu demonstrieren wie Branches auf verschiedenen Remote-Servern aussehen, stellen wir uns vor, dass Du einen weiteren internen Git-Server besitzt, welcher nur von einem Deiner Sprint-Teams zur Entwicklung genutzt wird. Diesen Server erreichen wir unter `git.team1.ourcompany.com`. Du kannst ihn, mit dem Git-Kommando `git remote add` – wie in Kapitel 2 beschrieben, Deinem derzeitigen Arbeitsprojekt als weiteren Quell-Server hinzufügen. Gib dem Remote-Server den Namen `teamone`, welcher nun als Synonym für die ausgeschriebene Internetadresse dient (siehe Abbildung 3-25).

<!--Figure 3-25. Adding another server as a remote.-->


![](http://git-scm.com/figures/18333fig0325-tn.png)

Abbildung 3-25. Einen weiteren Server als Quelle hinzufügen.

<!--Now, you can run `git fetch teamone` to fetch everything the remote `teamone` server has that you don’t have yet. Because that server has a subset of the data your `origin` server has right now, Git fetches no data but sets a remote branch called `teamone/master` to point to the commit that `teamone` has as its `master` branch (see Figure 3-26).-->

Nun kannst Du einfach `git fetch teamone` ausführen um alles vom Server zu holen was Du noch nicht hast. Da der Datenbestand auf dem Teamserver ein Teil der Informationen auf Deinem `origin`-Server ist, holt Git keine Daten, erstellt allerdings einen Remote-Branch namens `teamone/master`, der auf den gleichen Commit wie `teamone`s `master`-Branch zeigt (siehe Abbildung 3-26).

<!--Figure 3-26. You get a reference to teamone’s master branch position locally.-->


![](http://git-scm.com/figures/18333fig0326-tn.png)

Abbildung 3-26. Du bekommst eine lokale Referenz auf `teamone`s `master`-Branch.

<!--## Pushing-->
## Hochladen

<!--When you want to share a branch with the world, you need to push it up to a remote that you have write access to. Your local branches aren’t automatically synchronized to the remotes you write to — you have to explicitly push the branches you want to share. That way, you can use private branches for work you don’t want to share, and push up only the topic branches you want to collaborate on.-->

Wenn Du einen Branch mit der Welt teilen möchtest, musst Du ihn auf einen externen Server laden, auf dem Du Schreibrechte besitzt. Deine lokalen Zweige werden nicht automatisch mit den Remote-Servern synchronisiert wenn Du etwas änderst – Du musst die zu veröffentlichenden Branches explizit hochladen (pushen). Auf diesem Weg kannst Du an privaten Zweigen arbeiten die Du nicht veröffentlichen möchtest, und nur die Themen-Branches replizieren an denen Du gemeinsam mit anderen entwickeln möchtest.

<!--If you have a branch named `serverfix` that you want to work on with others, you can push it up the same way you pushed your first branch. Run `git push (remote) (branch)`:-->

Wenn Du einen Zweig namens `serverfix` besitzt, an dem Du mit anderen arbeiten möchtest, dann kannst Du diesen auf dieselbe Weise hochladen wie Deinen ersten Branch. Führe `git push (remote) (branch)` aus:

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

<!--This is a bit of a shortcut. Git automatically expands the `serverfix` branchname out to `refs/heads/serverfix:refs/heads/serverfix`, which means, “Take my serverfix local branch and push it to update the remote’s serverfix branch.” We’ll go over the `refs/heads/` part in detail in Chapter 9, but you can generally leave it off. You can also do `git push origin serverfix:serverfix`, which does the same thing — it says, “Take my serverfix and make it the remote’s serverfix.” You can use this format to push a local branch into a remote branch that is named differently. If you didn’t want it to be called `serverfix` on the remote, you could instead run `git push origin serverfix:awesomebranch` to push your local `serverfix` branch to the `awesomebranch` branch on the remote project.-->

Hierbei handelt es sich um eine Abkürzung. Git erweitert die `serverfix`-Branchbezeichnung automatisch zu `refs/heads/serverfix:refs/heads/serverfix`, was soviel bedeutet wie “Nimm meinen lokalen `serverfix`-Branch und aktualisiere damit den `serverfix`-Branch auf meinem externen Server”. Wir werden den `refs/heads/`-Teil in Kapitel 9 noch näher beleuchten, Du kannst ihn aber in der Regel weglassen. Du kannst auch `git push origin serverfix:serverfix` ausführen, was das gleiche bewirkt – es bedeutet “Nimm meinen `serverfix` und mach ihn zum externen `serverfix`”. Du kannst dieses Format auch benutzen um einen lokalen Zweig in einen externen Branch mit anderem Namen zu laden. Wenn Du ihn auf dem externen Server nicht `serverfix` nennen möchtest, könntest Du stattdessen `git push origin serverfix:awesomebranch` ausführen um Deinen lokalen `serverfix`-Branch in den `awesomebranch`-Zweig in Deinem externen Projekt zu laden.

<!--The next time one of your collaborators fetches from the server, they will get a reference to where the server’s version of `serverfix` is under the remote branch `origin/serverfix`:-->

Das nächste Mal wenn einer Deiner Mitarbeiter den aktuellen Status des Git-Projektes vom Server abruft, wird er eine Referenz, auf den externen Branch `origin/serverfix`, unter dem Namen `serverfix` erhalten:

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

<!--It’s important to note that when you do a fetch that brings down new remote branches, you don’t automatically have local, editable copies of them. In other words, in this case, you don’t have a new `serverfix` branch — you only have an `origin/serverfix` pointer that you can’t modify.-->

Es ist wichtig festzuhalten, dass Du mit Abrufen eines neuen externen Branches nicht automatisch eine lokale, bearbeitbare Kopie derselben erhältst. Mit anderen Worten, in diesem Fall bekommst Du keinen neuen `serverfix`-Branch – sondern nur einen `origin/serverfix`-Zeiger den Du nicht verändern kannst.

<!--To merge this work into your current working branch, you can run `git merge origin/serverfix`. If you want your own `serverfix` branch that you can work on, you can base it off your remote branch:-->

Um diese referenzierte Arbeit mit Deinem derzeitigen Arbeitsbranch zusammenzuführen kannst Du `git merge origin/serverfix` ausführen. Wenn Du allerdings Deine eigene Arbeitskopie des `serverfix`-Branches erstellen möchtest, dann kannst Du diesen auf Grundlage des externen Zweiges erstellen:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

<!--This gives you a local branch that you can work on that starts where `origin/serverfix` is.-->

Dies erstellt Dir einen lokalen bearbeitbaren Branch mit der Grundlage des `origin/serverfix`-Zweiges.

<!--## Tracking Branches-->
## Tracking Branches

<!--Checking out a local branch from a remote branch automatically creates what is called a _tracking branch_. Tracking branches are local branches that have a direct relationship to a remote branch. If you’re on a tracking branch and type `git push`, Git automatically knows which server and branch to push to. Also, running `git pull` while on one of these branches fetches all the remote references and then automatically merges in the corresponding remote branch.-->

Das Auschecken eines lokalen Branches von einem Remote-Branch erzeugt automatisch einen sogenannten _Tracking-Branch_. Tracking Branches sind lokale Branches mit einer direkten Beziehung zu dem Remote-Zweig. Wenn Du Dich in einem Tracking-Branch befindest und `git push` eingibst, weiß Git automatisch zu welchem Server und Repository es pushen soll. Ebenso führt `git pull` in einem dieser Branches dazu, dass alle entfernten Referenzen gefetched und automatisch in den Zweig gemerged werden.

<!--When you clone a repository, it generally automatically creates a `master` branch that tracks `origin/master`. That’s why `git push` and `git pull` work out of the box with no other arguments. However, you can set up other tracking branches if you wish — ones that don’t track branches on `origin` and don’t track the `master` branch. The simple case is the example you just saw, running `git checkout -b [branch] [remotename]/[branch]`. If you have Git version 1.6.2 or later, you can also use the `-\-track` shorthand:-->

Wenn Du ein Repository klonst, wird automatisch ein `master`-Branch erzeugt, welcher `origin/master` verfolgt. Deshalb können `git push` und `git pull` ohne weitere Argumente aufgerufen werden. Du kannst natürlich auch eigene Tracking-Branches erzeugen – welche die nicht Zweige auf `origin` und dessen `master`-Branch verfolgen. Der einfachste Fall ist das bereits gesehene Beispiel in welchem Du `git checkout -b [branch] [remotename]/[branch]` ausführst. Mit der Git-Version 1.6.2 oder später kannst Du auch die `--track`-Kurzvariante nutzen:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch serverfix from origin.
	Switched to a new branch 'serverfix'

<!--To set up a local branch with a different name than the remote branch, you can easily use the first version with a different local branch name:-->

Um einen lokalen Branch mit einem anderem Namen als der Remote-Branch, kannst Du einfach die erste Varianten mit einem neuen lokalen Branch-Namen:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch serverfix from origin.
	Switched to a new branch 'sf'

<!--Now, your local branch `sf` will automatically push to and pull from `origin/serverfix`.-->

Nun wird Dein lokaler Branch `sf` automatisch push und pull auf `origin/serverfix` durchführen.

<!--## Deleting Remote Branches-->
## Löschen entfernter Branches

<!--Suppose you’re done with a remote branch — say, you and your collaborators are finished with a feature and have merged it into your remote’s `master` branch (or whatever branch your stable codeline is in). You can delete a remote branch using the rather obtuse syntax `git push [remotename] :[branch]`. If you want to delete your `serverfix` branch from the server, you run the following:-->

Stellen wir uns Du bist fertig mit Deinem Remote-Branch – sagen wir Deine Mitarbeiter und Du, Ihr seid fertig mit einer neuen Funktion und habt sie in den entfernten `master`-Branch (oder in welchem Zweig Ihr sonst den stabilen Code ablegt) gemerged. Du kannst einen Remote-Branch mit der unlogischen Syntax `git push [remotename] :[branch]` löschen. Wenn Du Deinen `serverfix`-Branch vom Server löschen möchtest, führe folgendes aus:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

<!--Boom. No more branch on your server. You may want to dog-ear this page, because you’ll need that command, and you’ll likely forget the syntax. A way to remember this command is by recalling the `git push [remotename] [localbranch]:[remotebranch]` syntax that we went over a bit earlier. If you leave off the `[localbranch]` portion, then you’re basically saying, “Take nothing on my side and make it be `[remotebranch]`.”-->

Boom. Kein Zweig mehr auf Deinem Server. Du möchtest Dir diese Seite vielleicht markieren, weil Du dieses Kommando noch benötigen wirst und man leicht dessen Syntax vergisst. Ein Weg sich an dieses Kommando zu erinnern führt über die `git push [remotename] [localbranch]:[remotebranch]`-Snytax, welche wir bereits behandelt haben. Wenn Du den `[localbranch]`-Teil weglässt, dann sagst Du einfach „Nimm nichts von meiner Seite und mach es zu `[remotebranch]`“.

<!--# Rebasing-->