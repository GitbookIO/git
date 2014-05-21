# Branching Workflows

<!--Now that you have the basics of branching and merging down, what can or should you do with them? In this section, we’ll cover some common workflows that this lightweight branching makes possible, so you can decide if you would like to incorporate it into your own development cycle.-->

Jetzt da Du die Grundlagen von 'branching' und 'merging' kennst, fragst Du Dich sicher, was Du damit anfangen kannst. In diesem Abschnitt werden wir uns typische Workflows anschauen, die dieses leichtgewichtige 'branching' möglich macht. Und Du kannst dann entscheiden, ob Du es in Deinem eigene Entwicklungszyklus verwenden willst.

<!--## Long-Running Branches-->
## Langfristige Branches

<!--Because Git uses a simple three-way merge, merging from one branch into another multiple times over a long period is generally easy to do. This means you can have several branches that are always open and that you use for different stages of your development cycle; you can merge regularly from some of them into others.-->

Da Git das einfachen 3-Wege-'merge' verwendet, ist häufiges Zusammenführen von einer Branch in eine andere über einen langen Zeitraum generell einfach zu bewerkstelligen. Das heisst, Du kannst mehrere Branches haben, die alle offen sind und auf unterschiedlichen Ebenen Deines Entwicklungszyklus verwendung finden, und diese regelmäßig ineinander zusammenführen.

<!--Many Git developers have a workflow that embraces this approach, such as having only code that is entirely stable in their `master` branch — possibly only code that has been or will be released. They have another parallel branch named develop or next that they work from or use to test stability — it isn’t necessarily always stable, but whenever it gets to a stable state, it can be merged into `master`. It’s used to pull in topic branches (short-lived branches, like your earlier `iss53` branch) when they’re ready, to make sure they pass all the tests and don’t introduce bugs.-->

Viele Git Entwickler verfolgen mit ihrem Workflow den Ansatz nur den stabilen Code in dem `master`-Branch zu halten – möglicherweise auch nur Code, der released wurde oder werden kann. Sie betreiben parallel einen anderen Branch zum Arbeiten oder Testen. Wenn dieser paralelle Zweig einen stabilen Status erreicht, kann er mit dem `master`-Branch zusammengeführt werden. Dies findet bei Themen bezogenen Branches (kurzfristigen Branches, wie der zuvor genante `iss53`-Branch) Anwendung, um sicherzustellen, dass dieser die Tests besteht und keine Fehler verursacht.

<!--In reality, we’re talking about pointers moving up the line of commits you’re making. The stable branches are farther down the line in your commit history, and the bleeding-edge branches are farther up the history (see Figure 3-18).-->

In Realität reden wir über sich bewegende Zeiger, die den Commit-Verlauf weiterwandern. Die stabilen Branches liegen unten und die bleeding-edge Branches weiter oben in der Zeitlinie (siehe Abbildung 3-18).

<!--Figure 3-18. More stable branches are generally farther down the commit history.-->


![](http://git-scm.com/figures/18333fig0318-tn.png)

Abbildung 3-18. Stabilere Branches sind generell weiter unten im Entwicklungsverlauf.

<!--It’s generally easier to think about them as work silos, where sets of commits graduate to a more stable silo when they’re fully tested (see Figure 3-19).-->

Es ist leichter sich die verschiedenen Branches als Arbeitsdepots vorzustellen, in denen Sätze von Commits in stabilere Depots aufsteigen, sobald sie ausreichend getestet wurden (siehe Abbildung 3-19).

<!--Figure 3-19. It may be helpful to think of your branches as silos.-->


![](http://git-scm.com/figures/18333fig0319-tn.png)

Abbildung 3-19. Es könnte hilfreich sein, sich die Branches als Depots vorzustellen.

<!--You can keep doing this for several levels of stability. Some larger projects also have a `proposed` or `pu` (proposed updates) branch that has integrated branches that may not be ready to go into the `next` or `master` branch. The idea is that your branches are at various levels of stability; when they reach a more stable level, they’re merged into the branch above them.-->
<!--Again, having multiple long-running branches isn’t necessary, but it’s often helpful, especially when you’re dealing with very large or complex projects.-->

Das lässt sich für beliebig viele Stabilitätsabstufungen umsetzen. Manche größeren Projekte haben auch einen `proposed` (Vorgeschlagen) oder `pu` (proposed updates – vorgeschlagene Updates) Zweig mit Branches die vielleicht noch nicht bereit sind in den `next`- oder `master`-Branch integriert zu werden. Die Idee dahinter ist, dass Deine Branches verschiedene Stabilitätsabstufungen repräsentieren. Sobald sie eine stabilere Stufe erreichen, werden sie in den nächsthöheren Branch vereinigt.

Nochmal, langfristig verschiedene Branches paralell laufen zu lassen ist nicht notwendig, aber oft hilfreich. Insbesondere wenn man es mit sehr großen oder komplexen Projekten zu tun hat.

<!--## Topic Branches-->
## Themen-Branches

<!--Topic branches, however, are useful in projects of any size. A topic branch is a short-lived branch that you create and use for a single particular feature or related work. This is something you’ve likely never done with a VCS before because it’s generally too expensive to create and merge branches. But in Git it’s common to create, work on, merge, and delete branches several times a day.-->

Themen-Branches sind in jedem Projekt nützlich, egal bei welcher Größe. Ein Themen-Branch ist ein kurzlebiger Zweig der für eine spezielle Aufgabe oder ähnliche Arbeiten erstellt und benutzt wird. Das ist vielleicht etwas was Du noch nie zuvor mit einem Versionierungssystem gemacht hast, weil es normalerweise zu aufwändig und mühsam ist Branches zu erstellen und zusammenzuführen. Mit Git ist es allerdings vollkommen geläufig mehrmals am Tag Branches zu erstellen, an ihnen zu arbeiten, sie zusammenzuführen und sie anschließend wieder zu löschen.

<!--You saw this in the last section with the `iss53` and `hotfix` branches you created. You did a few commits on them and deleted them directly after merging them into your main branch. This technique allows you to context-switch quickly and completely — because your work is separated into silos where all the changes in that branch have to do with that topic, it’s easier to see what has happened during code review and such. You can keep the changes there for minutes, days, or months, and merge them in when they’re ready, regardless of the order in which they were created or worked on.-->

Du hast das im letzten Abschnitt an den von Dir erstellten `iss53`- und `hotfix`-Branches gesehen. Du hast mehrere Commits auf sie angewendet und sie unmittelbar nach Zusammenführung mit Deinem Hauptzweig gelöscht. Diese Technik erlaubt es Dir schnell und vollständig den Kontext zu wechseln. Da Deine Arbeit in verschiedene Depots aufgeteilt ist, in denen alle Änderungen unter die Thematik dieses Branches fallen, ist es leichter nachzuvollziehen was bei Code-Überprüfungen und ähnlichem geschehen ist.

<!--Consider an example of doing some work (on `master`), branching off for an issue (`iss91`), working on it for a bit, branching off the second branch to try another way of handling the same thing (`iss91v2`), going back to your master branch and working there for a while, and then branching off there to do some work that you’re not sure is a good idea (`dumbidea` branch). Your commit history will look something like Figure 3-20.-->

Stell Dir vor, Du arbeitest ein bisschen (in `master`), erstellst mal eben einen Branch für einen Fehler (`iss91`), arbeitest an dem für eine Weile, erstellst einen zweiten Branch um eine andere Problemlösung für den selben Fehler auszuprobieren (`iss91v2`), wechselst zurück zu Deinem MASTER-Branch, arbeitest dort ein bisschen und machst dann einen neuen Branch für etwas, wovon Du nicht weißt ob's eine gute Idee ist (`dumbidea`-Branch). Dein Commit-Verlauf wird wie in Abbildung 3-20 aussehen.

<!--Figure 3-20. Your commit history with multiple topic branches.-->


![](http://git-scm.com/figures/18333fig0320-tn.png)

Abbildung 3-20. Dein Commit-Verlauf mit verschiedenen Themen-Branches.

<!--Now, let’s say you decide you like the second solution to your issue best (`iss91v2`); and you showed the `dumbidea` branch to your coworkers, and it turns out to be genius. You can throw away the original `iss91` branch (losing commits C5 and C6) and merge in the other two. Your history then looks like Figure 3-21.-->

Nun, sagen wir Du hast Dich entschieden die zweite Lösung des Fehlers (`iss91v2`) zu bevorzugen, außerdem hast den `dumbidea`-Branch Deinen Mitarbeitern gezeigt und es hat sich herausgestellt das er genial ist. Du kannst also den ursprünglichen `iss91`-Branch (unter Verlust der Commits C5 und C6) wegschmeißen und die anderen Beiden vereinen. Dein Verlauf sieht dann aus wie in Abbildung 3-21.

<!--Figure 3-21. Your history after merging in dumbidea and iss91v2.-->


![](http://git-scm.com/figures/18333fig0321-tn.png)

Abbildung 3-21. Dein Verlauf nach Zusammenführung von `dumbidea` und `iss91v2`.

<!--It’s important to remember when you’re doing all this that these branches are completely local. When you’re branching and merging, everything is being done only in your Git repository — no server communication is happening.-->

Es ist wichtig sich daran zu erinnern, dass alle diese Branches nur lokal existieren. Wenn Du Verzweigungen schaffst (branchst) und wieder zusammenführst (mergest), findet dies nur in Deinem Git-Repository statt – es findet keine Server-Kommunikation statt.

<!--# Remote Branches-->