# Plumbing und Porcelain

<!--This book covers how to use Git with 30 or so verbs such as `checkout`, `branch`, `remote`, and so on. But because Git was initially a toolkit for a VCS rather than a full user-friendly VCS, it has a bunch of verbs that do low-level work and were designed to be chained together UNIX style or called from scripts. These commands are generally referred to as "plumbing" commands, and the more user-friendly commands are called "porcelain" commands.-->

In diesem Buch haben wir Git besprochen, indem wir vielleicht 30 Befehle wie `checkout`, `branch`, `remote` und so weiter verwendet haben. Weil Git aber ursprünglich als ein Werkzeugkasten konzipiert war und nicht so sehr als ein komplettes, anwenderfreundliches VCS, gibt es auch eine Reihe von Befehlen, die ihre Arbeit auf einer sehr viel grundlegenderen Ebene verrichten. Viele davon sind ursprünglich entwickelt worden, um als UNIX-Befehle miteinander verkettet zu werden oder aus Skripten heraus aufgerufen zu werden. Diese Befehle werden oft als „plumbing“-Befehle (Klempner-Befehle) zusammengefasst, während die eher anwenderfreundlichen Befehle „porcelain“ (d.h. Porzellan) genannt werden.

<!--The book’s first eight chapters deal almost exclusively with porcelain commands. But in this chapter, you’ll be dealing mostly with the lower-level plumbing commands, because they give you access to the inner workings of Git and help demonstrate how and why Git does what it does. These commands aren’t meant to be used manually on the command line, but rather to be used as building blocks for new tools and custom scripts.-->

Die ersten acht Kapitel dieses Buches haben sich fast ausschließlich mit „Porcelain“-Befehlen befasst. In diesem Kapitel gehen wir dagegen auf die zugrundeliegenden „Plumbing“-Befehle ein, u.a. weil sie Dir den Zugriff auf die inneren Abläufe von Git ermöglichen, und weil sie dabei helfen, zu verstehen, warum Git tut, was es tut. Diese Befehle sind nicht dazu gedacht, manuell in der Eingabeaufforderung ausgeführt zu werden, sondern sind als Bausteine für Werkzeuge und Skripts gemeint.

<!--When you run `git init` in a new or existing directory, Git creates the `.git` directory, which is where almost everything that Git stores and manipulates is located. If you want to back up or clone your repository, copying this single directory elsewhere gives you nearly everything you need. This entire chapter basically deals with the stuff in this directory. Here’s what it looks like:-->

Wenn Du `git init` in einem neuen oder bereits bestehenden Verzeichnis ausführst, erzeugt Git das `.git`-Verzeichnis, das fast alle Dateien enthält, die Git intern speichert und ändert. Wenn Du eine Sicherheitskopie Deines Repositorys anlegen oder es duplizieren willst, dann reicht es aus, dieses Verzeichnis zu kopieren. Dieses ganze Kapitel handelt praktisch nur von den Inhalten dieses Verzeichnisses. Schauen wir es uns einmal an:

	$ ls
	HEAD
	branches/
	config
	description
	hooks/
	index
	info/
	objects/
	refs/

<!--You may see some other files in there, but this is a fresh `git init` repository — it’s what you see by default. The `branches` directory isn’t used by newer Git versions, and the `description` file is only used by the GitWeb program, so don’t worry about those. The `config` file contains your project-specific configuration options, and the `info` directory keeps a global exclude file for ignored patterns that you don’t want to track in a .gitignore file. The `hooks` directory contains your client- or server-side hook scripts, which are discussed in detail in Chapter 7.-->

Möglicherweise findest Du darin weitere Dateien. Obiges stammt aus einem mit `git init` neu angelegten Repository – das sind also die Standardinhalte. Der Ordner `branches` wird von neueren Git-Versionen nicht mehr verwendet, und die Datei `descriptions` wird nur vom Programm GitWeb benötigt. Du kannst sie also ignorieren. Die Datei `config` enthält Deine projekt-spezifischen Konfigurationsoptionen, und im Ordner `info` befindet sich eine Datei, die globale Dateiausschlussmuster enthält, die Du nicht in jeder .gitignore-Datei neu spezifizieren willst. Das `hooks`-Verzeichnis enthält die client- oder serverseitigen Hook-Skripte, die wir in Kapitel 7 besprochen haben.

<!--This leaves four important entries: the `HEAD` and `index` files and the `objects` and `refs` directories. These are the core parts of Git. The `objects` directory stores all the content for your database, the `refs` directory stores pointers into commit objects in that data (branches), the `HEAD` file points to the branch you currently have checked out, and the `index` file is where Git stores your staging area information. You’ll now look at each of these sections in detail to see how Git operates.-->

Damit bleiben vier wichtige Einträge übrig: die Dateien `HEAD` und `index` und die Verzeichnisse `objects` und `refs`. Dies sind die Kernkomponenten eines Git-Repositorys. Im `objects`-Verzeichnis befinden sich die Inhalte der Datenbank. Das `refs`-Verzeichnis enthält Referenzen auf Commit-Objekte (Branches) in dieser Datenbank. Die Datei `HEAD` zeigt auf denjeningen Branch, den Du gegenwärtig ausgecheckt hast, und in der Datei `index` verwaltet Git die Informationen der Staging-Area. Wir werden auf diese Elemente jetzt im einzelnen darauf eingehen, sodass Du nachvollziehen kannst, wie Git intern arbeitet.

<!--# Git Objects-->