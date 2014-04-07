# Instalacja Git

Czas rozpocząć pracę z Git. Pierwszym krokiem jest instalacja. Można ją przeprowadzić na różne sposoby; po pierwsze można zainstalować Git ze źródeł, po drugie - można skorzystać z pakietu binarnego dla konkretnej platformy.

## Instalacja ze źródeł

Jeśli masz taką możliwość, korzystne jest zainstalowanie Git ze źródeł, ponieważ w ten sposób dostajesz najnowszą wersję. Każda wersja Git zawiera zwykle użyteczne zmiany w interfejsie, zatem chęć skorzystania z najnowszych funkcji stanowi zwykle najlepszy powód by skompilować samodzielnie własną wersję Git. Jest to istotne także z tego powodu, że wiele dystrybucji Linuksa posiada stare wersje pakietów; zatem jeśli nie korzystasz z najświeższej dystrybucji, albo nie aktualizujesz jej nowszymi pakietami, instalacja ze źródeł to najlepsza metoda.

Aby zainstalować Git, potrzebne są następujące biblioteki: curl, zlib, openssl, expat oraz libiconv. Przykładowo, jeśli korzystasz z systemu, który posiada narzędzie yum (np. Fedora) lub apt-get (np. system oparty na Debianie), możesz skorzystać z następujących poleceń w celu instalacji zależności:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev libssl-dev
	
Gdy wszystkie wymagane zależności zostaną zainstalowane, możesz pobrać najnowszą wersję Git ze strony:

	http://git-scm.com/download
	
A następnie skompilować i zainstalować Git:

	$ tar -zxf git-1.6.0.5.tar.gz
	$ cd git-1.6.0.5
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Po instalacji masz również możliwość pobrania Git za pomocą samego Git:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	
## Instalacja w systemie Linux

Jeśli chcesz zainstalować Git w systemie Linux z wykorzystaniem pakietów binarnych, możesz to zrobić w standardowy sposób przy użyciu narzędzi zarządzania pakietami, specyficznych dla danej dystrybucji. Jeśli korzystasz z Fedory, możesz użyć narzędzia yum:

	$ yum install git-core

Jeśli korzystasz z dystrybucji opartej na Debianie (np. Ubuntu), użyj apt-get:

	$ apt-get install git

## Instalacja na komputerze Mac

Istnieją dwa proste sposoby instalacji Git na komputerze Mac. Najprostszym z nich jest użycie graficznego instalatora, którego można pobrać z witryny Google Code (patrz Ekran 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)
 
Figure 1-7. Instalator Git dla OS X.

Innym prostym sposobem jest instalacja Git z wykorzystaniem MacPorts (`http://www.macports.org`). Jeśli masz zainstalowane MacPorts, zainstaluj Git za pomocą

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Nie musisz instalować wszystkich dodatków, ale dobrym pomysłem jest dołączenie +svn w razie konieczności skorzystania z Git podczas pracy z repozytoriami Subversion (patrz Rozdział 8).

## Instalacja w systemie Windows

Instalacja Git w systemie Windows jest bardzo prosta. Projekt msysGit posiada jedną z najprostszych procedur instalacji. Po prostu pobierz program instalatora z witryny GitHub i uruchom go:

	http://msysgit.github.com/

Po instalacji masz dostęp zarówno do wersji konsolowej, uruchamianej z linii poleceń (w tym do klienta SSH, który przyda się jeszcze później) oraz do standardowego GUI.
