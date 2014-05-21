# Git installieren

<!--Let’s get into using some Git. First things first—you have to install it. You can get it a number of ways; the two major ones are to install it from source or to install an existing package for your platform.-->

Lass uns damit anfangen, Git tatsächlich zu verwenden. Der erste Schritt besteht natürlich darin, Git zu installieren und das kann, wie üblich, auf unterschiedliche Weisen geschehen. Die beiden wichtigsten bestehen darin, entweder den Quellcode herunterzuladen und selbst zu kompilieren oder ein fertiges Paket für Dein Betriebssystem zu installieren.

<!--## Installing from Source-->
## Vom Quellcode aus installieren

<!--If you can, it’s generally useful to install Git from source, because you’ll get the most recent version. Each version of Git tends to include useful UI enhancements, so getting the latest version is often the best route if you feel comfortable compiling software from source. It is also the case that many Linux distributions contain very old packages; so unless you’re on a very up-to-date distro or are using backports, installing from source may be the best bet.-->

Wenn es Dir möglich ist, empfehlen wir, Git vom Quellcode aus zu installieren, weil Du die jeweils neueste Version erhältst. In der Regel bringt jede Version nützliche Verbesserungen (z.B. am Interface), sodass es sich lohnt die jeweils neueste Version zu verwenden – sofern Du natürlich damit klarkommst, Software aus dem Quellcode zu kompilieren. Viele Linux Distributionen umfassen sehr alte Git Versionen. Wenn Du also keine sehr aktuelle Distribution oder Backports (xxx) verwendest, empfehlen wir, diesen Weg in Erwägung ziehen.

<!--To install Git, you need to have the following libraries that Git depends on: curl, zlib, openssl, expat, and libiconv. For example, if you’re on a system that has yum (such as Fedora) or apt-get (such as a Debian based system), you can use one of these commands to install all of the dependencies:-->

Um Git zu installieren, benötigst Du die folgenden Bibliotheken, die von Git verwendet werden: curl, zlib, openssl, expat und libiconv. Wenn Dir auf Deinem System yum (z.B. auf Fedora) oder apt-get (z.B. auf Debian-basierten Systemen) zur Verfügung steht, kannst Du einen der folgenden Befehle verwenden, um diese Abhängigkeiten zu installieren:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ sudo apt-get install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

<!--When you have all the necessary dependencies, you can go ahead and grab the latest snapshot from the Git web site:-->

Nachdem Du die genannten Bibliotheken installiert hast, besorge Dir die aktuelle Version des Git Quellcodes von der Git Webseite:

	http://git-scm.com/download

<!--Then, compile and install:-->

Danach kannst Du dann Git kompilieren und installieren:

	$ tar -zxf git-1.7.2.2.tar.gz
	$ cd git-1.7.2.2
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

<!--After this is done, you can also get Git via Git itself for updates:-->

Von nun an kannst Du Git mit Hilfe von Git selbst aktualisieren:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

<!--## Installing on Linux-->
## Installation unter Linux

<!--If you want to install Git on Linux via a binary installer, you can generally do so through the basic package-management tool that comes with your distribution. If you’re on Fedora, you can use yum:-->

Wenn Du Git unter Linux mit einem Installationsprogramm installieren willst, kannst Du das normalerweise mit dem Paketmanager tun, der von Deinem Betriebssystem verwendet wird. Unter Fedora zum Beispiel kannst Du yum verwenden:

	$ yum install git-core

<!--Or if you’re on a Debian-based distribution like Ubuntu, try apt-get:-->

Auf einem Debian-basierten System wie Ubuntu steht Dir apt-get zur Verfügung:

	$ sudo apt-get install git

<!--## Installing on Mac-->
## Installation unter Mac OS X

<!--There are two easy ways to install Git on a Mac. The easiest is to use the graphical Git installer, which you can download from the Google Code page (see Figure 1-7):-->

Auf einem Mac kann man Git auf zwei Arten installieren. Der einfachste ist, das grafische Git Installationsprogramm zu verwenden, den man von der Google Code Webseite herunterladen kann (siehe Bild 1-7)

	http://code.google.com/p/git-osx-installer

<!--Figure 1-7. Git OS X installer.-->


![](http://git-scm.com/figures/18333fig0107-tn.png)

Bild 1-7. Git OS X Installationsprogramm

<!--The other major way is to install Git via MacPorts (`http://www.macports.org`). If you have MacPorts installed, install Git via-->

Die andere Möglichkeit ist, Git via MacPorts (http://www.macports.org) zu installieren. Wenn Du MacPorts auf Deinem System hast, installiert der folgende Befehl Git:

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

<!--You don’t have to add all the extras, but you’ll probably want to include +svn in case you ever have to use Git with Subversion repositories (see Chapter 8).-->

Du brauchst die optionalen Features natürlich nicht mit zu installieren, aber es macht Sinn `+svn` zu verwenden, falls Du jemals Git mit einem Subversion Repository verwenden willst.

<!--## Installing on Windows-->
## Installation unter Windows

<!--Installing Git on Windows is very easy. The msysGit project has one of the easier installation procedures. Simply download the installer exe file from the GitHub page, and run it:-->

Das msysGit Projekt macht die Installation von Git unter Windows sehr einfach. Lade einfach das Installationsprogramm für Windows von der GitHub Webseite herunter und führe es aus:

	http://msysgit.github.com/

<!--After it’s installed, you have both a command-line version (including an SSH client that will come in handy later) and the standard GUI.-->

Danach hast Du sowohl eine Kommandozeilenversion (inklusive eines SSH Clients, der sich später noch als nützlich erweisen wird) als auch die Standard GUI installiert.

<!--Note on Windows usage: you should use Git with the provided msysGit shell (Unix style), it allows to use the complex lines of command given in this book. If you need, for some reason, to use the native Windows shell / command line console, you have to use double quotes instead of simple quotes (for parameters with spaces in them) and you must quote the parameters ending with the circumflex accent (^) if they are last on the line, as it is a continuation symbol in Windows.-->

Hinweis für Windows Benutzer: Du solltest Git mit der in msysGit enthaltenen Shell (Unix Style) ausführen. Dies erlaubt es Dir auch die komplexen Kommandozeilenbefehle aus diesem Buch auszuführen. Wenn Du aus irgendeinem Grund die native Windows Shell, also die Eingabeaufforderung, verwenden musst, müssen Gänsefüßchen, statt einzelnen Anführungszeichen verwendet werden (für Parameter, die ein Leerzeichen enthalten). Außerdem müssen alle Parameter, die mit einem Zirkumflex (^) enden und am Ende einer Zeile stehen, mit Gänsefüßchen umschlossen werden. Der Zirkumflex am Ende einer Zeile teilt Windows sonst mit, dass diese Zeile noch nicht beendet ist und in der nächsten Zeile fortgesetzt werden soll.

<!--# First-Time Git Setup-->