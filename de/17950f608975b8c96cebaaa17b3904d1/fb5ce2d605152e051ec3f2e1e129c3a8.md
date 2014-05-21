# Git Hosting

<!--If you don’t want to go through all of the work involved in setting up your own Git server, you have several options for hosting your Git projects on an external dedicated hosting site. Doing so offers a number of advantages: a hosting site is generally quick to set up and easy to start projects on, and no server maintenance or monitoring is involved. Even if you set up and run your own server internally, you may still want to use a public hosting site for your open source code — it’s generally easier for the open source community to find and help you with.-->

Wenn Du Dir die ganze Arbeit sparen willst, die beim Einrichten eines eigenen Git Servers so anfällt, kannst Du auch einen der vielen Hosting-Anbieter benutzen, um Deine Git Projekte zu verwalten. Wenn Du Dich für diese Option entscheidest, hat das gewisse Vorteile: Die Konfiguration bei den Hosting-Anbietern ist meist sehr schnell durchgeführt und Du kannst sofort mit Deinen Projekten loslegen. Zusätzlich ersparst Du Dir die Wartung und Überwachung Deines eigenen Servers. Auch wenn Du für Deine privaten oder firmeninternen Projekte einen eigenen Server betreibst, sind solche Hosting-Anbieter nützlich, da Du diese dann für Deine Open-Source Projekte verwenden kannst. Dadurch wirst Du innerhalb der Open-Source Community leichter gefunden und es ist einfacher Dir bei Deinen Projekten zu helfen.

<!--These days, you have a huge number of hosting options to choose from, each with different advantages and disadvantages. To see an up-to-date list, check out the following page:-->

Heutzutage stehen Dir viele Anbieter zur Auswahl. Jeder hat seine Vor- und Nachteile. Eine aktuelle Liste von Anbietern findest Du auf der folgenden Seite:

	https://git.wiki.kernel.org/index.php/GitHosting

<!--Because we can’t cover all of them, and because I happen to work at one of them, we’ll use this section to walk through setting up an account and creating a new project at GitHub. This will give you an idea of what is involved.-->

Da wir nicht alle Anbieter vorstellen können und ich zufälligerweise bei einem der Anbieter, nämlich GitHub,  arbeite, werde ich in diesem Kapitel auf diese Plattform näher eingehen. Wir werden die Erstellung eines Accounts und die Erzeugung eines Projekts auf GitHub besprechen. Das sollte Dir einen leichten Einstieg in die Welt von GitHub ermöglichen.

<!--GitHub is by far the largest open source Git hosting site and it’s also one of the very few that offers both public and private hosting options so you can keep your open source and private commercial code in the same place. In fact, we used GitHub to privately collaborate on this book.-->

GitHub ist die mit Abstand größte Open-Source Git Hosting Plattform und bietet als einer der wenigen, sowohl öffentliche und private Hosting-Optionen. Das erlaubt es Dir, Deine Open-Source Projekte und proprietären Code in einer einzelnen Plattform zu verwalten. Sogar für dieses Buch haben wir GitHub benutzt, um gemeinsam unter Ausschluss der Öffentlichkeit daran zu arbeiten.

<!--## GitHub-->
## GitHub

<!--GitHub is slightly different than most code-hosting sites in the way that it namespaces projects. Instead of being primarily based on the project, GitHub is user centric. That means when I host my `grit` project on GitHub, you won’t find it at `github.com/grit` but instead at `github.com/schacon/grit`. There is no canonical version of any project, which allows a project to move from one user to another seamlessly if the first author abandons the project.-->

GitHub verwaltet und gruppiert Projekte ein wenig anders ein, als andere Code-Hosting Webseiten. GitHub fokussiert sich dabei nicht speziell auf die Projekte, sondern eher auf den Anwender. Dazu ein Beispiel. Wenn ich mein Projekt `grit` auf GitHub einstelle, dann findet man dieses nicht unter `github.com/grit`, sondern unter `github.com/schacon/grit`. Es gibt in diesem Sinne, keine in Stein gemeißelte Stelle an dem das Projekt verwaltet wird. Das bedeutet, man kann ein Projekt nahtlos von einem Benutzer zu einem anderen Benutzer übertragen, wenn dieser zum Beispiel das Projekt aufgibt.

<!--GitHub is also a commercial company that charges for accounts that maintain private repositories, but anyone can quickly get a free account to host as many open source projects as they want. We’ll quickly go over how that is done.-->

Wenn ein Anwender ein geschützes, nicht öffentliches Repository auf GitHub verwalten will, so muss er dafür bezahlen. Damit verdient die Firma GitHub ihr Geld. Aber die Verwaltung und Nutzung für Open-Source Projekte ist kostenlos. Die Anzahl der Projekte ist dabei nicht beschränkt. Der Nutzer muss dazu lediglich einen Account erstellen. Wie das geht, möchte ich hier kurz vorstellen.

<!--## Setting Up a User Account-->