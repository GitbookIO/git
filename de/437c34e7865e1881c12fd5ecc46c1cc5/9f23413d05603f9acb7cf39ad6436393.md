# Einfaches Branching und Merging

<!--Let’s go through a simple example of branching and merging with a workflow that you might use in the real world. You’ll follow these steps:-->

Lass uns das Ganze an einem Beispiel durchgehen, dessen Workflow zum Thema Branching und Zusammenführen Du im echten Leben verwenden kannst. Folge einfach diesen Schritten:

<!--1. Do work on a web site.-->
<!--2. Create a branch for a new story you’re working on.-->
<!--3. Do some work in that branch.-->

1. Arbeite an einer Webseite.
2. Erstell einen Branch für irgendeine neue Geschichte, an der Du arbeitest.
3. Arbeite in dem Branch.

<!--At this stage, you’ll receive a call that another issue is critical and you need a hotfix. You’ll do the following:-->

In diesem Augenblick kommt ein Anruf, dass ein kritisches Problem aufgetreten ist und sofort gelöst werden muss. Du machst folgendes:

<!--1. Switch back to your production branch.-->
<!--2. Create a branch to add the hotfix.-->
<!--3. After it’s tested, merge the hotfix branch, and push to production.-->
<!--4. Switch back to your original story and continue working.-->

1. Schalte zurück zu Deinem „Produktiv“-Zweig.
2. Erstelle eine Branch für den Hotfix.
3. Nach dem Testen führst Du den Hotfix-Branch mit dem „Produktiv“-Branch zusammen.
4. Schalte wieder auf Deine alte Arbeit zurück und werkel weiter.

<!--## Basic Branching-->
## Branching Grundlagen

<!--First, let’s say you’re working on your project and have a couple of commits already (see Figure 3-10).-->

Sagen wir, Du arbeitest an Deinem Projekt und hast bereits einige Commits durchgeführt (siehe Abbildung 3-10).

<!--Figure 3-10. A short and simple commit history.-->


![](http://git-scm.com/figures/18333fig0310-tn.png)

Abbildung 3-10. Eine kurze, einfache Commit-Historie

<!--You’ve decided that you’re going to work on issue #53 in whatever issue-tracking system your company uses. To be clear, Git isn’t tied into any particular issue-tracking system; but because issue #53 is a focused topic that you want to work on, you’ll create a new branch in which to work. To create a branch and switch to it at the same time, you can run the `git checkout` command with the `-b` switch:-->

Du hast Dich dafür entschieden an dem Issue #53, des Issue-Trackers XY, zu arbeiten. Um eines klarzustellen, Git ist an kein Issue-Tracking-System gebunden. Da der Issue #53 allerdings ein Schwerpunktthema betrifft, wirst Du einen neuen Branch erstellen um daran zu arbeiten. Um in einem Arbeitsschritt einen neuen Branch zu erstellen und zu aktivieren kannst Du das Kommando `git checkout` mit der Option `-b` verwenden:

	$ git checkout -b iss53
	Switched to a new branch 'iss53'

<!--This is shorthand for:-->

Das ist die Kurzform von

	$ git branch iss53
	$ git checkout iss53

<!--Figure 3-11 illustrates the result.-->

Abbildung 3-11 verdeutlicht das Ergebnis.

<!--Figure 3-11. Creating a new branch pointer.-->


![](http://git-scm.com/figures/18333fig0311-tn.png)

Abbildung 3-11. Erstellung eines neuen Branch-Zeigers

<!--You work on your web site and do some commits. Doing so moves the `iss53` branch forward, because you have it checked out (that is, your HEAD is pointing to it; see Figure 3-12):-->

Du arbeitest an Deiner Web-Seite und machst ein paar Commits. Das bewegt den `iss53`-Branch vorwärts, da Du ihn ausgebucht hast (das heißt, dass Dein HEAD-Zeiger darauf verweist; siehe Abbildung 3-12):

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'

<!--Figure 3-12. The iss53 branch has moved forward with your work.-->


![](http://git-scm.com/figures/18333fig0312-tn.png)

Abbildung 3-12. Der `iss53`-Branch hat mit Deiner Arbeit Schritt gehalten.

<!--Now you get the call that there is an issue with the web site, and you need to fix it immediately. With Git, you don’t have to deploy your fix along with the `iss53` changes you’ve made, and you don’t have to put a lot of effort into reverting those changes before you can work on applying your fix to what is in production. All you have to do is switch back to your master branch.-->

Nun bekommst Du einen Anruf, in dem Dir mitgeteilt wird, dass es ein Problem mit der Internet-Seite gibt, das Du umgehend beheben sollst. Mit Git musst Du Deine Fehlerkorrektur nicht zusammen mit den `iss53`-Änderungen einbringen. Und Du musst keine Zeit damit verschwenden Deine bisherigen Änderungen rückgängig zu machen, bevor Du mit der Fehlerbehebung an der Produktionsumgebung beginnen kannst. Alles was Du tun musst, ist zu Deinem MASTER-Branch wechseln.

<!--However, before you do that, note that if your working directory or staging area has uncommitted changes that conflict with the branch you’re checking out, Git won’t let you switch branches. It’s best to have a clean working state when you switch branches. There are ways to get around this (namely, stashing and commit amending) that we’ll cover later. For now, you’ve committed all your changes, so you can switch back to your master branch:-->

Beachte jedoch, dass Dich Git den Branch nur wechseln lässt, wenn bisherige Änderungen in Deinem Arbeitsverzeichnis oder Deiner Staging-Area nicht in Konflikt mit dem Zweig stehen, zu dem Du nun wechseln möchtest. Am besten es liegt ein sauberer Status vor wenn man den Branch wechselt. Wir werden uns später mit Wegen befassen, dieses Verhalten zu umgehen (namentlich „Stashing“ und „Commit Ammending“). Vorerst aber hast Du Deine Änderungen bereits comitted, sodass Du zu Deinem MASTER-Branch zurückwechseln kannst.

	$ git checkout master
	Switched to branch 'master'

<!--At this point, your project working directory is exactly the way it was before you started working on issue #53, and you can concentrate on your hotfix. This is an important point to remember: Git resets your working directory to look like the snapshot of the commit that the branch you check out points to. It adds, removes, and modifies files automatically to make sure your working copy is what the branch looked like on your last commit to it.-->

Zu diesem Zeitpunkt befindet sich das Arbeitsverzeichnis des Projektes in exakt dem gleichen Zustand, in dem es sich befand, als Du mit der Arbeit an Issue #53 begonnen hast und Du kannst Dich direkt auf Deinen Hotfix konzentrieren. Dies ist ein wichtiger Moment um sich vor Augen zu halten, dass Git Dein Arbeitsverzeichnis auf den Zustand des Commits, auf den dieser Branch zeigt, zurücksetzt. Es erstellt, entfernt und verändert Dateien automatisch, um sicherzustellen, dass Deine Arbeitskopie haargenau so aussieht wie der Zweig nach Deinem letzten Commit.

<!--Next, you have a hotfix to make. Let’s create a hotfix branch on which to work until it’s completed (see Figure 3-13):-->

Nun hast Du einen Hotfix zu erstellen. Lass uns dazu einen Hotfix-Branch erstellen, an dem Du bis zu dessen Fertigstellung arbeitest (siehe Abbildung 3-13):

	$ git checkout -b hotfix
	Switched to a new branch 'hotfix'
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix 3a0874c] fixed the broken email address
	 1 files changed, 1 deletion(-)

<!--Figure 3-13. hotfix branch based back at your master branch point.-->


![](http://git-scm.com/figures/18333fig0313-tn.png)

Abbildung 3-13. Der Hotfix-Branch basiert auf dem zurückliegenden Master-Branch.

<!--You can run your tests, make sure the hotfix is what you want, and merge it back into your master branch to deploy to production. You do this with the `git merge` command:-->

Mach Deine Tests, stell sicher das sich der Hotfix verhält wie erwartet und führe ihn mit dem Master-Branch zusammen, um ihn in die Produktionsumgebung zu integrieren. Das machst Du mit dem `git merge`-Kommando:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast-forward
	 README | 1 -
	 1 file changed, 1 deletion(-)

<!--You’ll notice the phrase "Fast forward" in that merge. Because the commit pointed to by the branch you merged in was directly upstream of the commit you’re on, Git moves the pointer forward. To phrase that another way, when you try to merge one commit with a commit that can be reached by following the first commit’s history, Git simplifies things by moving the pointer forward because there is no divergent work to merge together — this is called a "fast forward".-->

Du wirst die Mitteilung „Fast Forward“ während des Zusammenführens bemerken. Da der neue Commit direkt von dem ursprünglichen Commit, auf den sich der nun eingebrachte Zweig bezieht, abstammt, bewegt Git einfach den Zeiger weiter. Mit anderen Worten kann Git den neuen Commit, durch verfolgen der Commitabfolge, direkt erreichen, dann bewegt es ausschließlich den Branch-Zeiger. Zu einer tatsächlichen Kombination der Commits besteht ja kein Anlass. Dieses Vorgehen wird „Fast Forward“ genannt.

<!--Your change is now in the snapshot of the commit pointed to by the `master` branch, and you can deploy your change (see Figure 3-14).-->

Deine Modifikationen befinden sich nun als Schnappschuss in dem Commit, auf den der `master`-Branch zeigt, diese lassen sich nun veröffentlichen (siehe Abbildung 3-14).

<!--Figure 3-14. Your master branch points to the same place as your hotfix branch after the merge.-->


![](http://git-scm.com/figures/18333fig0314-tn.png)

Abbildung 3-14. Der Master-Branch zeigt nach der Zusammenführung auf den gleichen Commit wie der Hotfix-Branch.

<!--After your super-important fix is deployed, you’re ready to switch back to the work you were doing before you were interrupted. However, first you’ll delete the `hotfix` branch, because you no longer need it — the `master` branch points at the same place. You can delete it with the `-d` option to `git branch`:-->

Nachdem Dein superwichtiger Hotfix veröffentlicht wurde, kannst Du Dich wieder Deiner ursprünglichen Arbeit zuwenden. Vorher wird sich allerdings des nun nutzlosen Hotfix-Zweiges entledigt, schließlich zeigt der Master-Branch ebenfalls auf die aktuelle Version. Du kannst ihn mit der `-d`-Option von `git branch` entfernen:

	$ git branch -d hotfix
	Deleted branch hotfix (was 3a0874c).

<!--Now you can switch back to your work-in-progress branch on issue #53 and continue working on it (see Figure 3-15):-->

Nun kannst Du zu Deinem Issue #53-Branch zurückwechseln und mit Deiner Arbeit fortfahren (Abbildung 3-15):

	$ git checkout iss53
	Switched to branch 'iss53'
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53 ad82d7a] finished the new footer [issue 53]
	 1 file changed, 1 insertion(+)

<!--Figure 3-15. Your iss53 branch can move forward independently.-->


![](http://git-scm.com/figures/18333fig0315-tn.png)

Abbildung 3-15. Dein `iss53`-Branch kann sich unabhängig weiterentwickeln.

<!--It’s worth noting here that the work you did in your `hotfix` branch is not contained in the files in your `iss53` branch. If you need to pull it in, you can merge your `master` branch into your `iss53` branch by running `git merge master`, or you can wait to integrate those changes until you decide to pull the `iss53` branch back into `master` later.-->

An dieser Stelle ist anzumerken, dass die Änderungen an dem `hotfix`-Branch nicht in Deinen `iss53`-Zweig eingeflossen sind. Falls nötig kannst Du den `master`-Branch allerdings mit dem Kommando `git merge master` mit Deinem Zweig kombinieren. Oder Du wartest, bis Du den `iss53`-Branch später in den Master-Zweig zurückführst.

<!--## Basic Merging-->

## Die Grundlagen des Zusammenführens (Mergen)

<!--Suppose you’ve decided that your issue #53 work is complete and ready to be merged into your `master` branch. In order to do that, you’ll merge in your `iss53` branch, much like you merged in your `hotfix` branch earlier. All you have to do is check out the branch you wish to merge into and then run the `git merge` command:-->

Angenommen Du entscheidest dich, dass Deine Arbeit an issue #53 getan ist und Du diese mit der `master` Branch zusammenführen möchtest. Das passiert, indem Du ein `merge` in die `iss53` Branch machst, ähnlich dem `merge` mit der `hotfix` Branch von vorhin. Alles was Du machen musst, ist ein `checkout` der Branch, in die Du das `merge` machen willst und das Ausführen des Kommandos `git merge`:

	$ git checkout master
	$ git merge iss53
	Auto-merging README
	Merge made by the 'recursive' strategy.
	 README | 1 +
	 1 file changed, 1 insertion(+)

<!--This looks a bit different than the `hotfix` merge you did earlier. In this case, your development history has diverged from some older point. Because the commit on the branch you’re on isn’t a direct ancestor of the branch you’re merging in, Git has to do some work. In this case, Git does a simple three-way merge, using the two snapshots pointed to by the branch tips and the common ancestor of the two. Figure 3-16 highlights the three snapshots that Git uses to do its merge in this case.-->

Das sieht ein bisschen anders aus als das `hotfix merge` von vorhin. Hier läuft Deine Entwicklungshistorie auseinander. Ein `commit` auf Deine Arbeits-Branch ist kein direkter Nachfolger der Branch in die Du das `merge` gemacht hast, Git hat da einiges zu tun, es macht einen 3-Wege `merge`: es geht von den beiden `snapshots` der Branches und dem allgemeinen Nachfolger der beiden aus. Abbildung 3-16 zeigt die drei `snapshots`, die Git in diesem Fall für das `merge` verwendet.

<!--Figure 3-16. Git automatically identifies the best common-ancestor merge base for branch merging.-->


![](http://git-scm.com/figures/18333fig0316-tn.png)

Abbildung 3-16. Git ermittelt automatisch die beste Nachfolgebasis für die Branchzusammenführung.

<!--Instead of just moving the branch pointer forward, Git creates a new snapshot that results from this three-way merge and automatically creates a new commit that points to it (see Figure 3-17). This is referred to as a merge commit and is special in that it has more than one parent.-->

Anstatt einfach den 'pointer' weiterzubewegen, erstellt Git einen neuen `snapshot`, der aus dem 3-Wege 'merge' resultiert und erzeugt einen neuen 'commit', der darauf verweist (siehe Abbildung 3-17). Dies wird auch als 'merge commit' bezeichnet und ist ein Spezialfall, weil es mehr als nur ein Elternteil hat.

<!--It’s worth pointing out that Git determines the best common ancestor to use for its merge base; this is different than CVS or Subversion (before version 1.5), where the developer doing the merge has to figure out the best merge base for themselves. This makes merging a heck of a lot easier in Git than in these other systems.-->

Es ist wichtig herauszustellen, dass Git den besten Nachfolger für die 'merge' Basis ermittelt, denn hierin unterscheidet es sich von CVS und Subversion (vor Version 1.5), wo der Entwickler die 'merge' Basis selbst ermitteln muss. Damit wird das Zusammenführen in Git um einiges leichter, als in anderen Systemen.

<!--Figure 3-17. Git automatically creates a new commit object that contains the merged work.-->


![](http://git-scm.com/figures/18333fig0317-tn.png)

Abbildung 3-17. Git erstellt automatisch ein 'commit', dass die zusammengeführte Arbeit enthält.

<!--Now that your work is merged in, you have no further need for the `iss53` branch. You can delete it and then manually close the ticket in your ticket-tracking system:-->

Jetzt da wir die Arbeit zusammengeführt haben, ist der `iss53`-Branch nicht mehr notwendig. Du kannst ihn löschen und das Ticket im Ticket-Tracking-System schliessen.

	$ git branch -d iss53

<!--## Basic Merge Conflicts-->
## Grundlegende Merge-Konflikte

<!--Occasionally, this process doesn’t go smoothly. If you changed the same part of the same file differently in the two branches you’re merging together, Git won’t be able to merge them cleanly. If your fix for issue #53 modified the same part of a file as the `hotfix`, you’ll get a merge conflict that looks something like this:-->

Gelegentlich verläuft der Prozess nicht ganz so glatt. Wenn Du an den selben Stellen in den selben Dateien unterschiedlicher Branches etwas geändert hast, kann Git diese nicht sauber zusammenführen. Wenn Dein Fix an 'issue #53' die selbe Stelle in einer Datei verändert hat, die Du auch mit `hotfix` angefasst hast, wirst Du einen 'merge'-Konflikt erhalten, der ungefähr so aussehen könnte:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

<!--Git hasn’t automatically created a new merge commit. It has paused the process while you resolve the conflict. If you want to see which files are unmerged at any point after a merge conflict, you can run `git status`:-->

Git hat hier keinen 'merge commit' erstellt. Es hat den Prozess gestoppt, damit Du den Konflikt beseitigen kannst. Wenn Du sehen willst, welche Dateien 'unmerged' aufgrund eines 'merge' Konflikts sind, benutze einfach `git status`:

	$ git status
	On branch master
	You have unmerged paths.
	  (fix conflicts and run "git commit")

	Unmerged paths:
	  (use "git add <file>..." to mark resolution)

	        both modified:      index.html

	no changes added to commit (use "git add" and/or "git commit -a")

<!--Anything that has merge conflicts and hasn’t been resolved is listed as unmerged. Git adds standard conflict-resolution markers to the files that have conflicts, so you can open them manually and resolve those conflicts. Your file contains a section that looks something like this:-->

Alles, was einen 'merge' Konflikt aufweist und nicht gelöst werden konnte, wird als 'unmerged' aufgeführt. Git fügt den betroffenen Dateien Standard-Konfliktlösungsmarker hinzu, sodass Du diese öffnen und den Konflikt manuell lösen kannst. Deine Datei enthält einen Bereich, der so aussehen könnte:

	<<<<<<< HEAD
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53

<!--This means the version in HEAD (your master branch, because that was what you had checked out when you ran your merge command) is the top part of that block (everything above the `=======`), while the version in your `iss53` branch looks like everything in the bottom part. In order to resolve the conflict, you have to either choose one side or the other or merge the contents yourself. For instance, you might resolve this conflict by replacing the entire block with this:-->

Das heisst, die Version in HEAD (Deines 'master'-Branches, denn der wurde per 'checkout' aktiviert als Du das 'merge' gemacht hast) ist der obere Teil des Blocks (alles oberhalb von '======='), und die Version aus dem `iss53`-Branch sieht wie der darunter befindliche Teil aus. Um den Konflikt zu lösen, musst Du Dich entweder für einen der beiden Teile entscheiden oder Du ersetzt den Teil komplett:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

<!--This resolution has a little of each section, and I’ve fully removed the `<<<<<<<`, `=======`, and `>>>>>>>` lines. After you’ve resolved each of these sections in each conflicted file, run `git add` on each file to mark it as resolved. Staging the file marks it as resolved in Git.-->
<!--If you want to use a graphical tool to resolve these issues, you can run `git mergetool`, which fires up an appropriate visual merge tool and walks you through the conflicts:-->

Diese Lösung hat von beiden Teilen etwas und ich habe die Zeilen mit `<<<<<<<`, `=======`, und `>>>>>>>` komplett gelöscht. Nachdem Du alle problematischen Bereiche, in allen durch den Konflikt betroffenen Dateien, beseitigt hast, führe einfach `git add` für alle betroffenen Dateien aus und markieren sie damit als bereinigt. Dieses 'staging' der Dateien markiert sie für Git als bereinigt.
Wenn Du ein grafischen Tool zur Bereinigung benutzen willst, dann verwende `git mergetool`. Das welches ein passendes grafisches 'merge'-Tool startet und Dich durch die Konfliktbereiche führt:

	$ git mergetool

	This message is displayed because 'merge.tool' is not configured.
	See 'git mergetool --tool-help' or 'git help config' for more details.
	'git mergetool' will now attempt to use one of the following tools:
	opendiff kdiff3 tkdiff xxdiff meld tortoisemerge gvimdiff diffuse diffmerge ecmerge p4merge araxis bc3 codecompare vimdiff emerge
	Merging:
	index.html

	Normal merge conflict for 'index.html':
	  {local}: modified file
	  {remote}: modified file
	Hit return to start merge resolution tool (opendiff):

<!--If you want to use a merge tool other than the default (Git chose `opendiff` for me in this case because I ran the command on a Mac), you can see all the supported tools listed at the top after “... one of the following tools:”. Type the name of the tool you’d rather use. In Chapter 7, we’ll discuss how you can change this default value for your environment.-->

Wenn Du ein anderes Tool anstelle des Standardwerkzeug für ein 'merge' verwenden möchtest (Git verwendet in meinem Fall `opendiff`, da ich auf einem Mac arbeite), dann kannst Du alle unterstützten Werkzeuge oben – unter „one of the following tools“ – aufgelistet sehen. Tippe einfach den Namen Deines gewünschten Werkzeugs ein. In Kapitel 7 besprechen wir, wie Du diesen Standardwert in Deiner Umgebung dauerhaft ändern kannst.

<!--After you exit the merge tool, Git asks you if the merge was successful. If you tell the script that it was, it stages the file to mark it as resolved for you.-->

Wenn Du das 'merge' Werkzeug beendest, fragt Dich Git, ob das Zusammenführen erfolgreich war. Wenn Du mit 'Ja' antwortest, wird das Skript diese Dateien als gelöst markieren.

<!--You can run `git status` again to verify that all conflicts have been resolved:-->

Du kannst `git status` erneut ausführen, um zu sehen, ob alle Konflikte gelöst sind:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)

	        modified:   index.html


<!--If you’re happy with that, and you verify that everything that had conflicts has been staged, you can type `git commit` to finalize the merge commit. The commit message by default looks something like this:-->

Wenn Du zufrieden bist und Du geprüft hast, dass alle Konflikte beseitigt wurden, kannst Du `git commit` ausführen um den 'merge commit' abzuschliessen. Die Standardbeschreibung für diese Art 'commit' sieht wie folgt aus:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a merge.
	# If this is not correct, please remove the file
	#       .git/MERGE_HEAD
	# and try again.
	#

<!--You can modify that message with details about how you resolved the merge if you think it would be helpful to others looking at this merge in the future — why you did what you did, if it’s not obvious.-->

Wenn Du glaubst für zukünftige Betrachter des Commits könnte interessant sein warum Du getan hast, was Du getan hast, dann kannst Du der Commit-Beschreibung noch zusätzliche Informationen hinzufügen – sofern das nicht trivial erscheint.

<!--# Branch Management-->