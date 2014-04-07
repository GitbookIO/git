# Instalarea Git

Să începem să folosim Git. Începând cu începutul - trebuie să îl instalăm. Puteți să îl obțineți în mai multe feluri; cele mai importante sunt să îl instalați din surse sau să instalați un pachet deja existent pentru platforma dumneavoastră.

## Instalarea din Fișiere Sursă

Dacă puteți, este uneori folositor să instalați Git din surse, deoarece veți obține cea mai nouă versiune. Fiecare nouă versiune tinde să conțină îmbunătațiri ale interfeței, așa că dacă doriți ultima apariție aceasta este cea mai bună metodă dacă sunteți confortabil în lucrul cu cod sursă. Uneori puteți întâlni cazul în care versiunea dumneavoastră de Linux conține pachete foarte vechi; așa că dacă nu aveți ultima apariție a distribuției sau folosiți backports, instalarea din surse poate fi cea mai sigură alegere.

Pentru a instala Git, aveți nevoie de următoarele biblioteci de care Git depinde: curl, zlib, openssl, expat, și libiconv. De exemplu, dacă sunteți într-un sistem care folosește yum (cum ar fi Fedora) sau apt-get (cum ar fi un sistem bazat pe Debian), puteți să folosiți una din aceste comenzi pentru a instala toate dependințele:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev libssl-dev

Când aveți toate dependințele cerute, puteți să treceți la pasul următor și să luați ultimul snapshot de pe site-ul Git:

	http://git-scm.com/download

Apoi, compilați și instalați:

	$ tar -zxf git-1.6.0.5.tar.gz
	$ cd git-1.6.0.5
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

După toți acești pași, puteți să luați Git prin intermediul lui însăși folosind update-uri:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Instalarea în sistemele Linux

Dacă doriți să instalați Git în Linux prin intermediul unui program de instalare, puteți de obicei să folosiți uneltele locale pentru administrarea pachetelor în funcție de distribuția utilizată. Dacă folosiți Fedora, puteți folosi yum:

	$ yum install git-core

Sau dacă folosiți o distribuție bazată pe Debian, de exemplu Ubuntu, încercați apt-get:

	$ apt-get install git

## Instalarea pe sistemele Mac

Sunt două moduri simple de a instala Git pe sistemele Mac. Cea mai simplă este să folosiți programul de instalare grafic pentru Git, pe care îl puteți descărca de la pagina Google Code ( vedeți Figura 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)
 
Figura 1-7. Programul de instalare Git în OS X.

Cealaltă posibilitate este să instalați Git prin intermediul MacPorts (`http://www.macports.org`). Dacă aveți instalat MacPorts, atunci instalați Git cu comanda

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Nu trebuie să adăugați toate extra-opțiunile, dar probabil veți dori să includeți +svn în caz că veți dori să folosiți Git cu repository-uri Subversion (vedeți Capitolul 8).

## Instalarea pe sistemele Windows

Instalarea Git în Windows este foarte simplă. Proiectul msysGit are una din procedurile cele mai simple de instalare. Pur și simplu descărcați programul de instalare de pe pagina GitHub, și rulați-l:

	http://msysgit.github.com/

După ce este instalat, veți avea atât o versiune în linie de comandă (inclusiv un client SSH care vă va fi util mai târziu) cât și o interfață grafică standard (GUI [en]).
