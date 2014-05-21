# Die Geschichte von Git

<!--As with many great things in life, Git began with a bit of creative destruction and fiery controversy. The Linux kernel is an open source software project of fairly large scope. For most of the lifetime of the Linux kernel maintenance (1991–2002), changes to the software were passed around as patches and archived files. In 2002, the Linux kernel project began using a proprietary DVCS system called BitKeeper.-->

Wie viele großartige Dinge im Leben entstand Git aus kreativem Chaos und hitziger Diskussion. Der Linux Kernel ist ein Open Source Software Projekt von erheblichem Umfang. Während der gesamten Entwicklungszeit des Linux Kernels von 1991 bis 2002 wurden Änderungen an der Software in Form von Patches (d.h. Änderungen an bestehendem Code) und archivierten Dateien herumgereicht. 2002 began man dann, ein proprietäres DVCS System mit dem Namen „Bitkeeper“ zu verwenden.

<!--In 2005, the relationship between the community that developed the Linux kernel and the commercial company that developed BitKeeper broke down, and the tool’s free-of-charge status was revoked. This prompted the Linux development community (and in particular Linus Torvalds, the creator of Linux) to develop their own tool based on some of the lessons they learned while using BitKeeper. Some of the goals of the new system were as follows:-->

2005 ging die Beziehung zwischen der Community, die den Linux Kernel entwickelte, und des kommerziell ausgerichteten Unternehmens, das BitKeeper entwickelte, kaputt. Die zuvor ausgesprochene Erlaubnis, BitKeeper kostenlos zu verwenden, wurde widerrufen. Dies war für die Linux Entwickler Community (und besonders für Linus Torvald, der Erfinder von Linux) der Auslöser dafür, ein eigenes Tool zu entwickeln, das auf den Erfahrungen mit BitKeeper basierte. Ziele des neuen Systems waren unter anderem:

<!--*	Speed-->
<!--*	Simple design-->
<!--*	Strong support for non-linear development (thousands of parallel branches)-->
<!--*	Fully distributed-->
<!--*	Able to handle large projects like the Linux kernel efficiently (speed and data size)-->

* Geschwindigkeit
* Einfaches Design
* Gute Unterstützung von nicht-linearer Entwicklung (tausende paralleler Branches, d.h. verschiedener Verzweigungen der Versionen)
* Vollständig verteilt
* Fähig, große Projekte wie den Linux Kernel effektiv zu verwalten (Geschwindigkeit und Datenumfang)

<!--Since its birth in 2005, Git has evolved and matured to be easy to use and yet retain these initial qualities. It’s incredibly fast, it’s very efficient with large projects, and it has an incredible branching system for non-linear development (See Chapter 3).-->

Seit seiner Geburt 2005 entwickelte sich Git kontinuierlich weiter und reifte zu einem System heran, das einfach zu bedienen ist, die ursprünglichen Ziele dabei aber weiter beibehält. Es ist unglaublich schnell, äußerst effizient, wenn es um große Projekte geht, und es hat ein fantastisches Branching Konzept für nicht-lineare Entwicklung (mehr dazu in Kapitel 3).

<!--# Git Basics-->