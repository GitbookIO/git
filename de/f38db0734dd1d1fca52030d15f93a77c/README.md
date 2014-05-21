<!--# Git Internals-->
# Git Interna

<!--You may have skipped to this chapter from a previous chapter, or you may have gotten here after reading the rest of the book — in either case, this is where you’ll go over the inner workings and implementation of Git. I found that learning this information was fundamentally important to understanding how useful and powerful Git is, but others have argued to me that it can be confusing and unnecessarily complex for beginners. Thus, I’ve made this discussion the last chapter in the book so you could read it early or later in your learning process. I leave it up to you to decide.-->

Möglicherweise hast Du dieses Kapitel hier direkt aufgeschlagen, vorherige Kapitel ausgelassen, oder bist hierher gelangt, nachdem Du alle vorherigen Kapitel gelesen hast. Wie auch immer, in diesem Kapitel werden wir uns mit der internen Funktionsweise und der Implementierung von Git befassen. Meine eigene Erfahrung ist, dass das Lernen dieser Dinge unerlässlich ist, um zu verstehen, wie unheimlich mächtig und flexibel Git ist. Allerdings gibt es Leute, die der Ansicht sind, dass sie auch verwirrend und unnötig komplex für Anfänger sein können. Deshalb habe ich mich entschieden, dieses Kapitel an das Ende des Buches zu verlegen. Du kannst es, ganz wie es Dir beliebt, früher oder später einschieben.

<!--Now that you’re here, let’s get started. First, if it isn’t yet clear, Git is fundamentally a content-addressable filesystem with a VCS user interface written on top of it. You’ll learn more about what this means in a bit.-->

Lass uns also loslegen. Zunächst will ich betonen, falls das bisher noch nicht klargeworden ist, dass Git im seinen Grundzügen ein Dateisystem ist, dessen Inhalte addressierbar sind und auf dem eine VCS-Schnittstelle aufgesetzt ist. Wir werden gleich genauer darauf eingehen, was das heißt.

<!--In the early days of Git (mostly pre 1.5), the user interface was much more complex because it emphasized this filesystem rather than a polished VCS. In the last few years, the UI has been refined until it’s as clean and easy to use as any system out there; but often, the stereotype lingers about the early Git UI that was complex and difficult to learn.-->

In den frühen Tagen von Git (d.h. vor Version 1.5) war die Benutzerschnittstelle sehr viel komplexer, weil es die Dateisystem-Eigenschaften stark betonte – im Gegensatz zu einem herkömmlichen VCS. In den letzten Jahren wurde die Benutzerschnittstelle dann stückweise verbessert und verfeinert, sodass es heute so einfach verständlich und einfach zu verwenden ist, wie andere vergleichbare Systeme, die auf dem Markt erhältlich sind. Allerdings besteht scheinbar weiterhin das Vorurteil, das Git-Interface sei komplex und schwer zu erlernen.

<!--The content-addressable filesystem layer is amazingly cool, so I’ll cover that first in this chapter; then, you’ll learn about the transport mechanisms and the repository maintenance tasks that you may eventually have to deal with.-->

Die inhaltsbasiert adressierbare Dateisystem-Ebene ist erstaunlich cool, weshalb ich in diesem Kapitel zuerst darauf eingehen werde. Als Nächstes lernst Du etwas über die Transport-Mechanismen und Repository-Wartungsaufgaben, mit denen Du möglicherweise irgendwann zu tun bekommen wirst.

<!--# Plumbing and Porcelain-->