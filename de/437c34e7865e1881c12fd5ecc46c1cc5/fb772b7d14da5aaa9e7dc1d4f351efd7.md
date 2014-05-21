# Rebasing

<!--In Git, there are two main ways to integrate changes from one branch into another: the `merge` and the `rebase`. In this section you’ll learn what rebasing is, how to do it, why it’s a pretty amazing tool, and in what cases you won’t want to use it.-->

Es gibt in Git zwei Wege um Änderungen von einem Branch in einen anderen zu überführen: das `merge` und das `rebase`-Kommando. In diesem Abschnitt wirst Du kennenlernen was Rebasing ist, wie Du es anwendest, warum es ein verdammt abgefahrenes Werkzeug ist und wann Du es lieber nicht einsetzen möchtest.

<!--## The Basic Rebase-->
## Der einfache Rebase

<!--If you go back to an earlier example from the Merge section (see Figure 3-27), you can see that you diverged your work and made commits on two different branches.-->

Wenn Du zu einem früheren Beispiel aus dem Merge-Kapitel zurückkehrst (siehe Abbildung 3-27), wirst Du sehen, dass Du Deine Arbeit auf zwei unterschiedliche Branches aufgeteilt hast.

<!--Figure 3-27. Your initial diverged commit history.-->


![](http://git-scm.com/figures/18333fig0327-tn.png)

Abbildung 3-27. Deine initiale Commit-Historie zum Zeitpunkt der Aufteilung.

<!--The easiest way to integrate the branches, as we’ve already covered, is the `merge` command. It performs a three-way merge between the two latest branch snapshots (C3 and C4) and the most recent common ancestor of the two (C2), creating a new snapshot (and commit), as shown in Figure 3-28.-->

Der einfachste Weg um Zweige zusammenzuführen ist, wie bereits behandelt, das `merge`-Kommando. Es produziert einen Drei-Wege-Merge zwischen den beiden letzten Branch-Zuständen (C3 und C4) und ihrem wahrscheinlichsten Vorgänger (C2). Es produziert seinerseits einen Schnappschuss des Projektes (und einen Commit), wie in Abbildung 3-28 dargestellt.

<!--Figure 3-28. Merging a branch to integrate the diverged work history.-->


![](http://git-scm.com/figures/18333fig0328-tn.png)

Abbildung 3-28. Das Zusammenführen eines Branches um die verschiedenen Arbeitsfortschritte zu integrieren.

<!--However, there is another way: you can take the patch of the change that was introduced in C3 and reapply it on top of C4. In Git, this is called _rebasing_. With the `rebase` command, you can take all the changes that were committed on one branch and replay them on another one.-->

Wie auch immer, es gibt noch einen anderen Weg: Du kannst den Patch der Änderungen – den wir in C3 eingeführt haben –  über C4 anwenden. Dieses Vorgehen nennt man in Git _rebasing_. Mit dem `rebase`-Kommando kannst Du alle Änderungen die auf einem Branch angewendet wurden auf einen anderen Branch erneut anwenden.

<!--In this example, you’d run the following:-->

In unserem Beispiel würdest Du folgendes ausführen:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

<!--It works by going to the common ancestor of the two branches (the one you’re on and the one you’re rebasing onto), getting the diff introduced by each commit of the branch you’re on, saving those diffs to temporary files, resetting the current branch to the same commit as the branch you are rebasing onto, and finally applying each change in turn. Figure 3-29 illustrates this process.-->

Dies funktioniert, indem Git zu dem gemeinsamen/allgemeinen Vorfahren [gemeinsamer Vorfahr oder der Ursprung der beiden Branches?] der beiden Branches (des Zweiges auf dem Du arbeitest und des Zweiges auf den Du _rebasen_ möchtest) geht, die Differenzen jedes Commits des aktuellen Branches ermittelt und temporär in einer Datei ablegt. Danach wird der aktuelle Branch auf den Schnittpunkt der beiden Zweige zurückgesetzt und alle zwischengespeicherte Commits nacheinander auf den Zielbranch angewendet. Die Abbildung 3-29 bildet diesen Prozess ab.

<!--Figure 3-29. Rebasing the change introduced in C3 onto C4.-->


![](http://git-scm.com/figures/18333fig0329-tn.png)

Abbildung 3-29. Rebasen der Änderungen durch C3 auf den Zweig C4.

<!--At this point, you can go back to the master branch and do a fast-forward merge (see Figure 3-30).-->

An diesem Punkt kannst Du zurück zum Master-Branch wechseln und einen fast-forward Merge durchführen (siehe Abbildung 3-30).

<!--Figure 3-30. Fast-forwarding the master branch.-->


![](http://git-scm.com/figures/18333fig0330-tn.png)

Abbildung 3-30. Fast-forward des Master-Branches.

<!--Now, the snapshot pointed to by C3' is exactly the same as the one that was pointed to by C5 in the merge example. There is no difference in the end product of the integration, but rebasing makes for a cleaner history. If you examine the log of a rebased branch, it looks like a linear history: it appears that all the work happened in series, even when it originally happened in parallel.-->

Nun ist der Schnappschuss, auf den C3' zeigt, exakt der gleiche, wie der auf den C5 in dem Merge-Beispiel gezeigt hat. Bei dieser Zusammenführung entsteht kein unterschiedliches Produkt, durch Rebasing ensteht allerdings ein sauberer Verlauf. Bei genauerer Betrachtung der Historie entpuppt sich der Rebased-Branch als linearer Verlauf – es scheint als sei die ganze Arbeit in einer Serie entstanden, auch wenn sie in Wirklichkeit parallel stattfand.

<!--Often, you’ll do this to make sure your commits apply cleanly on a remote branch — perhaps in a project to which you’re trying to contribute but that you don’t maintain. In this case, you’d do your work in a branch and then rebase your work onto `origin/master` when you were ready to submit your patches to the main project. That way, the maintainer doesn’t have to do any integration work — just a fast-forward or a clean apply.-->

Du wirst das häufig anwenden um sicherzustellen, dass sich Deine Commits sauber in einen Remote-Branch integrieren – möglicherweise in einem Projekt bei dem Du Dich beteiligen möchtest, Du jedoch nicht der Verantwortliche bist. In diesem Fall würdest Du Deine Arbeiten in einem eigenen Branch erledigen und im Anschluss Deine Änderungen auf `origin/master` rebasen. Dann hätte der Verantwortliche nämliche keinen Aufwand mit der Integration – nur einen Fast-Forward oder eine saubere Integration (= Rebase?).

<!--Note that the snapshot pointed to by the final commit you end up with, whether it’s the last of the rebased commits for a rebase or the final merge commit after a merge, is the same snapshot — it’s only the history that is different. Rebasing replays changes from one line of work onto another in the order they were introduced, whereas merging takes the endpoints and merges them together.-->

Beachte, dass der Schnappschuss nach dem letzten Commit, ob es der letzte der Rebase-Commits nach einem Rebase oder der finale Merge-Commit nach einem Merge ist, exakt gleich ist. Sie unterscheiden sich nur in ihrem Verlauf. Rebasing wiederholt einfach die Änderungen einer Arbeitslinie auf einer anderen, in der Reihenfolge in der sie entstanden sind. Im Gegensatz hierzu nimmt Merging die beiden Endpunkte der Arbeitslinien und führt diese zusammen.

<!--## More Interesting Rebases-->
## Mehr interessante Rebases

<!--You can also have your rebase replay on something other than the rebase branch. Take a history like Figure 3-31, for example. You branched a topic branch (`server`) to add some server-side functionality to your project, and made a commit. Then, you branched off that to make the client-side changes (`client`) and committed a few times. Finally, you went back to your server branch and did a few more commits.-->

Du kannst Deinen Rebase auch auf einem anderen Branch als dem Rebase-Branch anwenden lassen. Nimm zum Beispiel den Verlauf in Abbildung 3-31. Du hattest einen Themen-Branch (`server`) eröffnet um ein paar serverseitige Funktionalitäten zu Deinem Projekt hinzuzufügen und einen Commit gemacht. Dann hast Du einen weiteren Branch abgezweigt um clientseitige Änderungen (`client`) vorzunehmen und dort ein paarmal committed. Zum Schluss hast Du wieder zu Deinem Server-Branch gewechselt und ein paar weitere Commits gebaut.

<!--Figure 3-31. A history with a topic branch off another topic branch.-->


![](http://git-scm.com/figures/18333fig0331-tn.png)

Abbildung 3-31. Ein Verlauf mit einem Themen-Branch basierend auf einem weiteren Themen-Branch.

<!--Suppose you decide that you want to merge your client-side changes into your mainline for a release, but you want to hold off on the server-side changes until it’s tested further. You can take the changes on client that aren’t on server (C8 and C9) and replay them on your master branch by using the `-\-onto` option of `git rebase`:-->

Stell Dir vor, Du entscheidest Dich Deine clientseitigen Änderungen für einen Release in die Hauptlinie zu mergen, die serverseitigen Änderungen möchtest Du aber noch zurückhalten bis sie besser getestet wurden. Du kannst einfach die Änderungen am Client, die den Server nicht betreffen, (C8 und C9) mit der `--onto`-Option von `git rebase` erneut auf den Master-Branch anwenden:

	$ git rebase --onto master server client

<!--This basically says, “Check out the client branch, figure out the patches from the common ancestor of the `client` and `server` branches, and then replay them onto `master`.” It’s a bit complex; but the result, shown in Figure 3-32, is pretty cool.-->

Das bedeutet einfach “Checke den Client-Branch aus, finde die Patches heraus die auf dem gemeinsamen Vorfahr der `client`- und `server`-Branches basieren und wende sie erneut auf dem `master`-Branch an.” Das ist ein bisschen komplex, aber das Ergebnis – wie in Abbildung 3-32 – ist richtig cool.

<!--Figure 3-32. Rebasing a topic branch off another topic branch.-->


![](http://git-scm.com/figures/18333fig0332-tn.png)

Abbildung 3-32. Rebasing eines Themen-Branches von einem anderen Themen-Branch.

<!--Now you can fast-forward your master branch (see Figure 3-33):-->

Jetzt kannst Du Deinen Master-Branch fast-forwarden (siehe Abbildung 3-33):

	$ git checkout master
	$ git merge client

<!--Figure 3-33. Fast-forwarding your master branch to include the client branch changes.-->


![](http://git-scm.com/figures/18333fig0333-tn.png)

Abbildung 3-33. Fast-forwarding Deines Master-Branches um die Client-Branch-Änderungen zu integrieren.

<!--Let’s say you decide to pull in your server branch as well. You can rebase the server branch onto the master branch without having to check it out first by running `git rebase [basebranch] [topicbranch]` — which checks out the topic branch (in this case, `server`) for you and replays it onto the base branch (`master`):-->

Lass uns annehmen, Du entscheidest Dich Deinen Server-Branch ebenfalls einzupflegen. Du kannst den Server-Branch auf den Master-Branch rebasen ohne diesen vorher auschecken zu müssen, indem Du das Kommando `git rebase [Basis-Branch] [Themen-Branch]` ausführst. Es macht für Dich den Checkout des Themen-Branches (in diesem Fall `server`) und wiederholt ihn auf dem Basis-Branch (`master`):

	$ git rebase master server

<!--This replays your `server` work on top of your `master` work, as shown in Figure 3-34.-->

Das wiederholt Deine `server`-Arbeit auf der Basis der `server`-Arbeit, wie in Abbildung 3-34 ersichtlich.

<!--Figure 3-34. Rebasing your server branch on top of your master branch.-->


![](http://git-scm.com/figures/18333fig0334-tn.png)

Abbildung 3-34. Rebasing Deines Server-Branches auf Deinen Master-Branch.

<!--Then, you can fast-forward the base branch (`master`):-->

Dann kannst Du den Basis-Branch (`master`) fast-forwarden:

	$ git checkout master
	$ git merge server

<!--You can remove the `client` and `server` branches because all the work is integrated and you don’t need them anymore, leaving your history for this entire process looking like Figure 3-35:-->

Du kannst den `client`- und `server`-Branch nun entfernen, da Du die ganze Arbeit bereits integriert wurde und Sie nicht mehr benötigst. Du hinterlässt den Verlauf für den ganzen Prozess wie in Abbildung 3-35:

	$ git branch -d client
	$ git branch -d server

<!--Figure 3-35. Final commit history.-->


![](http://git-scm.com/figures/18333fig0335-tn.png)

Abbildung 3-35: Endgültiger Commit-Verlauf.

<!--## The Perils of Rebasing-->
## Die Gefahren des Rebasings

<!--Ahh, but the bliss of rebasing isn’t without its drawbacks, which can be summed up in a single line:-->

Ahh, aber der ganze Spaß mit dem Rebasing kommt nicht ohne seine Schattenseiten, welche in einer einzigen Zeile zusammengefasst werden können:

<!--**Do not rebase commits that you have pushed to a public repository.**-->

**Rebase keine Commits die Du in ein öffentliches Repository hochgeladen hast.**

<!--If you follow that guideline, you’ll be fine. If you don’t, people will hate you, and you’ll be scorned by friends and family.-->

Wenn Du diesem Ratschlag folgst ist alles in Ordnung. Falls nicht, werden die Leute Dich hassen und Du wirst von Deinen Freunden und Deiner Familie verachtet.

<!--When you rebase stuff, you’re abandoning existing commits and creating new ones that are similar but different. If you push commits somewhere and others pull them down and base work on them, and then you rewrite those commits with `git rebase` and push them up again, your collaborators will have to re-merge their work and things will get messy when you try to pull their work back into yours.-->

Wenn Du Zeug rebased, hebst Du bestehende Commits auf und erstellst stattdessen welche, die zwar ähnlich aber unterschiedlich sind. Wenn Du Commits irgendwohin hochlädst und andere ziehen sich diese herunter und nehmen sie als Grundlage für ihre Arbeit, dann müssen Deine Mitwirkenden ihre Arbeit jedesmal re-mergen, sobald Du Deine Commits mit einem `git rebase` überschreibst und verteilst. Und richtig chaotisch wird's wenn Du versuchst deren Arbeit in Deine Commits zu integrieren.

<!--Let’s look at an example of how rebasing work that you’ve made public can cause problems. Suppose you clone from a central server and then do some work off that. Your commit history looks like Figure 3-36.-->

Lass uns mal ein Beispiel betrachten wie das Rebasen veröffentlichter Arbeit Probleme verursachen kann. Angenommen Du klonst von einem zentralen Server und werkelst ein bisschen daran rum. Dein Commit-Verlauf sieht wie in Abbildung 3-36 aus.

<!--Figure 3-36. Clone a repository, and base some work on it.-->


![](http://git-scm.com/figures/18333fig0336-tn.png)

Abbildung 3-36. Klon ein Repository und baue etwas darauf auf.

<!--Now, someone else does more work that includes a merge, and pushes that work to the central server. You fetch them and merge the new remote branch into your work, making your history look something like Figure 3-37.-->

Ein anderer arbeitet unterdessen weiter, macht einen Merge und lädt seine Arbeit auf den zentralen Server. Du fetchst die Änderungen und mergest den neuen Remote-Branch in Deine Arbeit, sodass Dein Verlauf wie in Abbildung 3-37 aussieht.

<!--Figure 3-37. Fetch more commits, and merge them into your work.-->


![](http://git-scm.com/figures/18333fig0337-tn.png)

Abbildung 3-37. Fetche mehrere Commits und merge sie in Deine Arbeit.

<!--Next, the person who pushed the merged work decides to go back and rebase their work instead; they do a `git push -\-force` to overwrite the history on the server. You then fetch from that server, bringing down the new commits.-->

Als nächstes entscheidet sich die Person, welche den Merge hochgeladen hat diesen rückgängig zu machen und stattdessen die Commits zu rebasen. Sie macht einen `git push --force` um den Verlauf auf dem Server zu überschreiben. Du lädst Dir das Ganze dann mit den neuen Commits herunter.

<!--Figure 3-38. Someone pushes rebased commits, abandoning commits you’ve based your work on.-->


![](http://git-scm.com/figures/18333fig0338-tn.png)

Abbildung 3-38. Jemand pusht rebased Commits und verwirft damit Commitd auf denen Deine Arbeit basiert.

<!--At this point, you have to merge this work in again, even though you’ve already done so. Rebasing changes the SHA-1 hashes of these commits so to Git they look like new commits, when in fact you already have the C4 work in your history (see Figure 3-39).-->

Nun musst Du seine Arbeit erneut in Deine Arbeitslinie mergen, obwohl Du das bereits einmal gemacht hast. Rebasing ändert die SHA-1-Hashes der Commits, weshalb sie für Git wie neue Commits aussehen. In Wirklichkeit hast Du die C4-Arbeit bereits in Deinem Verlauf (siehe Abbildung 3-39).

<!--Figure 3-39. You merge in the same work again into a new merge commit.-->


![](http://git-scm.com/figures/18333fig0339-tn.png)

Abbildung 3-39. Du mergst die gleiche Arbeit nochmals in einen neuen Merge-Commit.

<!--You have to merge that work in at some point so you can keep up with the other developer in the future. After you do that, your commit history will contain both the C4 and C4' commits, which have different SHA-1 hashes but introduce the same work and have the same commit message. If you run a `git log` when your history looks like this, you’ll see two commits that have the same author date and message, which will be confusing. Furthermore, if you push this history back up to the server, you’ll reintroduce all those rebased commits to the central server, which can further confuse people.-->

Irgendwann musst Du seine Arbeit einmergen, damit Du auch zukünftig mit dem anderen Entwickler zusammenarbeiten kannst. Danach wird Dein Commit-Verlauf sowohl den C4 als auch den C4'-Commit enthalten, weche zwar verschiedene SHA-1-Hashes besitzen aber die gleichen Änderungen und die gleiche Commit-Beschreibung enthalten. Wenn Du so einen Verlauf mit `git log` betrachtest, wirst Du immer zwei Commits des gleichen Autors, zur gleichen Zeit und mit der gleichen Commit-Nachricht sehen. Was ganz schön verwirrend ist. Wenn Du diesen Verlauf außerdem auf den Server hochlädst, wirst Du dort alle rebasierten Commits einführen, was auch noch andere verwirren kann.

<!--If you treat rebasing as a way to clean up and work with commits before you push them, and if you only rebase commits that have never been available publicly, then you’ll be fine. If you rebase commits that have already been pushed publicly, and people may have based work on those commits, then you may be in for some frustrating trouble.-->

Wenn Du rebasing als Weg behandelst um aufzuräumen und mit Commits zu arbeiten, bevor Du sie hochlädst und wenn Du nur Commits rebased, die noch nie publiziert wurden, dann fährst Du goldrichtig. Wenn Du Commits rebased die bereits veröffentlicht wurden und Leute vielleicht schon ihre Arbeit darauf aufgebaut haben, dann bist Du vielleicht für frustrierenden Ärger verantwortlich.

<!--# Summary-->