# Installare Git

Incominciamo ad usare un po' di Git! Per prima cosa devi installarlo. Puoi ottenere Git in diversi modi; i principali due sono: installarlo dai sorgenti o installarlo da un pacchetto pre-esistente per la tua piattaforma.

## Installare da Sorgenti

Se puoi, generalmente è vantaggioso installare Git dai sorgenti perché avrai la versione più recente. Ogni versione di Git tende ad includere utili miglioramenti all'interfaccia utente e avere quindi l'ultima versione disponibile è spesso la scelta migliore, se hai familiarità con la compilazione dei sorgenti. Inoltre capita anche, che molte distribuzioni Linux usino pacchetti molto vecchi; perciò, se non stai usando una distro aggiornata o dei backport, l'installazione da sorgente può essere la cosa migliore da fare.

Per installare Git, hai bisogno delle librerie da cui dipende Git che sono: curl, zlib, openssl, expat e libiconv. Per esempio, se sei su un sistema che usa yum (come Fedora), o apt-get (come nei sistemi Debian), puoi usare uno dei seguenti comandi per installare tutte le dipendenze:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev
	
Quando avrai tutte le dipendenze necessarie, puoi proseguire ed andare a recuperare l'ultimo snapshot dal sito web di Git:

	http://git-scm.com/download
	
Poi, compilalo ed installalo:

	$ tar -zxf git-1.7.2.2.tar.gz
	$ cd git-1.7.2.2
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Dopo aver fatto questo, puoi scaricare gli aggiornamenti di Git con lo stesso Git:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	
## Installare su Linux

Se vuoi installare Git su Linux, tramite una installazione da binario, generalmente puoi farlo con lo strumento base di amministrazione dei pacchetti della tua distribuzione. Se usi Fedora, puoi usare yum:

	$ yum install git-core

O se sei su una distribuzione basata su Debian, come Ubuntu, prova apt-get:

	$ apt-get install git

## Installazione su Mac

Ci sono due metodi per installare Git su Mac. Il più semplice è usare l'installer grafico di Git, che puoi scaricare dalla pagina di Google Code (vedi Figura 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)
 
Figura 1-7. Installer di Git per OS X.

L'altro metodo è installare Git con MacPorts (`http://www.macports.org`). Se hai MacPorts installato puoi farlo con:

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Non ti occorre aggiungere tutti i pacchetti extra, ma probabilmente vorrai includere +svn, nel caso tu debba usare Git con i repository di Subversion (vedi Capitolo 8).

## Installare su Windows

Installare Git su Windows è davvero facile. Il progetto msysGit ha una delle procedure di installazione più facili. Semplicemente scarica l'eseguibile dalla pagina di GitHub e lancialo:

	http://msysgit.github.com/

Una volta installato avrai a disposizione sia la versione da riga di comando (incluso un client SSH ti servirà in seguito) sia l'interfaccia grafica (_GUI_) standard.

Nota sull'uso su Windows: dovresti usare Git con la shell msysGit fornita (stile Unix) perché permette di usare le complesse linee di comando di questo libro. Se hai bisogno, per qualche ragione, di usare la shell nativa di Windows / la console a linea di comando, devi usare le doppie virgolette invece delle virgolette semplici (per i parametri con che contengono spazi) e devi virgolettare i parametri che terminano con l'accento circonflesso (^) se questi sono al termine della linea, poiché in Windows è uno dei simboli di proseguimento.
