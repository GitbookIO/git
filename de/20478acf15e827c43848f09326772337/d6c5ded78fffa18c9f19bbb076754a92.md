# Distribuierte Workflows

<!--Unlike Centralized Version Control Systems (CVCSs), the distributed nature of Git allows you to be far more flexible in how developers collaborate on projects. In centralized systems, every developer is a node working more or less equally on a central hub. In Git, however, every developer is potentially both a node and a hub — that is, every developer can both contribute code to other repositories and maintain a public repository on which others can base their work and which they can contribute to. This opens a vast range of workflow possibilities for your project and/or your team, so I’ll cover a few common paradigms that take advantage of this flexibility. I’ll go over the strengths and possible weaknesses of each design; you can choose a single one to use, or you can mix and match features from each.-->

Anders als in zentralisierten Versionskontrollsystemen (CVCS) ermöglicht die Distribuiertheit von Git eine sehr viel flexiblere Zusammenarbeit von Entwicklern. In zentralisierten Systemen fungieren alle Beteiligten als gleichwertige Netzknoten, die in mehr oder weniger der gleichen Weise am zentralen Knotenpunkt (dem zentralen Repository) arbeiten. In Git dagegen ist jeder Beteiligten selbst potentiell zentraler Knotenpunkt. D.h. jeder Entwickler kann sowohl Code zu anderen Repositories beitragen und ein öffentliches Repository zur Verfügung stellen, an dem wiederum andere mitarbeiten. Das ermöglicht eine riesige Anzahl von Möglichkeiten, Arbeitsabläufe zu gestalten, die auf das jeweilige Projekt und/oder Team perfekt zugeschnitten sind. Wir werden auf einige übliche Paradigmen, die diese Flexibilität nutzen, und deren Vor- und Nachteile eingehen. Du kannst daraus ein Modell auswählen, oder Du kannst sie miteinander kombinieren, um sie an Deine eigenen Erfordernisse anzupassen.

<!--## Centralized Workflow-->
## Zentralisierter Workflow

<!--In centralized systems, there is generally a single collaboration model—the centralized workflow. One central hub, or repository, can accept code, and everyone synchronizes their work to it. A number of developers are nodes — consumers of that hub — and synchronize to that one place (see Figure 5-1).-->

In einem zentralisierten System gibt es grob gesagt ein einziges Modell der Zusammenarbeit. Ein zentraler Knotenpunkt (oder Repository) kann Code von anderen akzeptieren und übernehmen, und alle Beteiligten synchronisieren ihre Arbeit damit. Entwickler fungieren als Knoten, die ihre Arbeit an diesem einen, zentralen Punkt synchronisieren (siehe Bild 5-1).

<!--Figure 5-1. Centralized workflow.-->


![](http://git-scm.com/figures/18333fig0501-tn.png)

Bild 5-1. Zentralisierter Workflow

<!--This means that if two developers clone from the hub and both make changes, the first developer to push their changes back up can do so with no problems. The second developer must merge in the first one’s work before pushing changes up, so as not to overwrite the first developer’s changes. This concept is true in Git as it is in Subversion (or any CVCS), and this model works perfectly in Git.-->

Das heißt: wenn zwei Entwickler Code aus dem zentralen Repository abholen und beide Änderungen vornehmen, dann kann der erste Entwickler seine Änderungen ohne Probleme im zentralen Repository abliefern. Der zweite Entwickler muss sie zunächst mit den Änderungen des ersten Entwicklers zusammenführen, damit er dessen Arbeit nicht überschreibt. Dieses Konzept trifft sowohl auf Git als auch auf Subversion (und jedes andere CVCS) zu, und es funktioniert in Git perfekt.

<!--If you have a small team or are already comfortable with a centralized workflow in your company or team, you can easily continue using that workflow with Git. Simply set up a single repository, and give everyone on your team push access; Git won’t let users overwrite each other. If one developer clones, makes changes, and then tries to push their changes while another developer has pushed in the meantime, the server will reject that developer’s changes. They will be told that they’re trying to push non-fast-forward changes and that they won’t be able to do so until they fetch and merge.-->
<!--This workflow is attractive to a lot of people because it’s a paradigm that many are familiar and comfortable with.-->

In einem kleinen Team oder einem Team, das mit einem zentralisierten Workflow zufrieden ist, kann man diesen Workflow ohne weiteres mit Git realisieren. Man setzt einfach ein einziges Repository auf und gibt jedem im Team Schreibzugriff („push access“). Git sorgt dann dafür, dass niemand die Arbeit von anderen überschreiben kann. Wenn ein Entwickler das Repository klont, Änderungen vornimmt und dann versucht ins zentrale Repository zu pushen, obwohl jemand anders in der Zwischenzeit Änderungen gepusht hat, dann wird der Server das zurückweisen. Dem Entwickler wird dann mitgeteilt, dass er versucht hat, sogeannte „non-fast-forward“ Änderungen hochzuladen und dass er zuvor die Änderungen des anderen Entwicklers herunterladen und mit seinen zusammenführen muss. Viele Leute mögen diesen Arbeitsablauf, weil sie mit dem Paradigma bereits vertraut sind und sich damit wohl fühlen.


<!--## Integration-Manager Workflow-->
## Integration-Manager Workflow

<!--Because Git allows you to have multiple remote repositories, it’s possible to have a workflow where each developer has write access to their own public repository and read access to everyone else’s. This scenario often includes a canonical repository that represents the "official" project. To contribute to that project, you create your own public clone of the project and push your changes to it. Then, you can send a request to the maintainer of the main project to pull in your changes. They can add your repository as a remote, test your changes locally, merge them into their branch, and push back to their repository. The process works as follow (see Figure 5-2):-->

Weil Git ermöglicht, eine Vielzahl von externen Repositories zu betreiben, ist es außerdem möglich, einen Arbeitsprozess zu gestalten, in dem jeder Entwickler Schreibzugriff auf sein eigenes öffentliches Repository hat, aber nur Lesezugriff auf die Repositories von allen anderen Beteiligten. In diesem Szenario stellt jedes Repository ein eigenes „offizielles“ Projekt dar. Um zu einem solchen distribuierten Projekt Änderungen beizusteuern, kannst Du einen eigenen, öffentlichen Klon des Projektes anlegen und Deine Änderungen dort publizieren. Anschließend kannst Du den Betreiber des Haupt-Repositories bitten, Deine Änderungen in sein Repository zu übernehmen. Er kann dann Dein Repository als ein externes Repository auf seinem Rechner einrichten, Deine Änderungen lokal testen, sie in einen seiner Branches (z.B. master) mergen und dann in sein öffentliches Repository pushen. Dieser Prozess läuft wie folgt ab (siehe Bild 5-2):

<!--1. The project maintainer pushes to their public repository.-->
<!--2. A contributor clones that repository and makes changes.-->
<!--3. The contributor pushes to their own public copy.-->
<!--4. The contributor sends the maintainer an e-mail asking them to pull changes.-->
<!--5. The maintainer adds the contributor’s repo as a remote and merges locally.-->
<!--6. The maintainer pushes merged changes to the main repository.-->

1.  Der Projekt Betreiber pusht in ein öffentliches Repository.
2.  Ein Mitarbeiter klont das Repository und nimmt Änderungen daran vor.
3.  Der Mitarbeiter pusht diese in sein eigenes öffentliches Repository.
4.  Der Mitarbeiter schickt dem Betreiber eine E-Mail und bittet darum, die Änderungen zu übernehmen.
5.  Der Betreiber richtet das Repository des Mitarbeiters als ein externes Repository ein und führt die Änderungen mit einem seiner eigenen Branches zusammen.
6.  Der Betreiber pusht die zusammengeführten Änderungen in sein öffentliches Repository.

<!--Figure 5-2. Integration-manager workflow.-->


![](http://git-scm.com/figures/18333fig0502-tn.png)

Bild 5-2. Integration-Manager Workflow

<!--This is a very common workflow with sites like GitHub, where it’s easy to fork a project and push your changes into your fork for everyone to see. One of the main advantages of this approach is that you can continue to work, and the maintainer of the main repository can pull in your changes at any time. Contributors don’t have to wait for the project to incorporate their changes — each party can work at their own pace.-->

Dies ist ein weit verbreiteter Arbeitsablauf wie ihn z.B. auch GitHub ermöglicht, wo man ein Projekt auf sehr einfache Weise forken und seine Änderungen in seinen eigenen Fork pushen kann, um sie anderen zur Verfügung zu stellen. Einer der Hauptvorteile dieser Vorgehensweise ist, dass man an seinem Fork jederzeit weiterarbeiten, der Betreiber des Projektes Änderungen aber auch jederzeit übernehmen kann. Mitarbieter müssen nicht darauf warten, dass der Betreiber Änderungen übernimmt – und jeder Beteiligte kann in seinem eigenen Rhythmus und Tempo arbeiten.

<!--## Dictator and Lieutenants Workflow-->
## Diktator und Leutnants Workflow

<!--This is a variant of a multiple-repository workflow. It’s generally used by huge projects with hundreds of collaborators; one famous example is the Linux kernel. Various integration managers are in charge of certain parts of the repository; they’re called lieutenants. All the lieutenants have one integration manager known as the benevolent dictator. The benevolent dictator’s repository serves as the reference repository from which all the collaborators need to pull. The process works like this (see Figure 5-3):-->

Dies ist Variante eines Workflows mit zahlreichen Repositories, die normalerweise von sehr großen Projekten mit hunderten von Mitarbeitern verwendet wird. Das bekannteste Beispiel ist wahrscheinlich der Linux Kernel. In diesem Projekt sind zahlreiche Integration Manager, die „Leutnants“, für verschiedene Bereiche des Repositories zuständig. Für sämtliche Leutnants gibt es wiederum einen Integration Manager, der als der „wohlwollende Diktator“ („benevolent dictator“) bezeichnet wird. Das Repository des wohlwollenden Diktators fungiert als das Referenz-Repository aus dem alle Beteiligten ihre eigenen Repositories aktualisieren müssen. Dieser Prozess funktioniert also wie folgt (siehe Bild 5-3)

<!--1. Regular developers work on their topic branch and rebase their work on top of master. The master branch is that of the dictator.-->
<!--2. Lieutenants merge the developers’ topic branches into their master branch.-->
<!--3. The dictator merges the lieutenants’ master branches into the dictator’s master branch.-->
<!--4. The dictator pushes their master to the reference repository so the other developers can rebase on it.-->

1.  Normale Entwickler arbeiten in ihren Arbeitsbranches (xxx) und rebasen (xxx) ihre Änderungen auf der Basis des Master Branches. Der Master Branch ist derjenige des Diktators.
2.  Die Leutnants mergen die Arbeitsbranches der Entwickler in ihre Master Branches.
3.  Der Diktator merged die Master Branches der Leutnants mit seinem eigenen Master Branch zusammen.
4.  Der Diktator pusht seinen Master Branch ins Referenz-Repository, sodass alle ihre Arbeit wiederum damit synchronisieren (rebasen) können.

<!--Figure 5-3. Benevolent dictator workflow.-->


![](http://git-scm.com/figures/18333fig0503-tn.png)

Bild 5-3. Wohlwollender Diktator Workflow

<!--This kind of workflow isn’t common but can be useful in very big projects or in highly hierarchical environments, as it allows the project leader (the dictator) to delegate much of the work and collect large subsets of code at multiple points before integrating them.-->

Diese Art Workflow ist nicht unbedingt weit verbreitet, aber für große Projekte oder Projekte mit strikten hierarchischen Rollen sehr nützlich, weil der Projektleiter (der Diktator) Arbeit in großem Umfang delegieren und ganze Teilbereiche von Code von verschiedenen Endpunkten zusammensammeln und integrieren kann.

<!--These are some commonly used workflows that are possible with a distributed system like Git, but you can see that many variations are possible to suit your particular real-world workflow. Now that you can (I hope) determine which workflow combination may work for you, I’ll cover some more specific examples of how to accomplish the main roles that make up the different flows.-->

Wir haben jetzt einige übliche Workflows besprochen, die in einem distribuierten System wie Git möglich sind. Natürlich kann man sie mannigfaltig abwandeln und miteinander kombinieren, um sie an ein spezielles reales Projekt und Team anzupassen. Nachdem Du jetzt hoffentlich in der Lage bist, Dir einen Workflow vorzustellen, der für Dich selbst Sinn macht, gehen wir auf einige etwas spezifischere Beispiele ein und darauf, wie man die verschiedenen Rollen umsetzen kann, die die Workflows ausmachen.

<!--# Contributing to a Project-->