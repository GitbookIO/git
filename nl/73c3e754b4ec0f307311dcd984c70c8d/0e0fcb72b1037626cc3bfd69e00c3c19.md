# Git installeren

Laten we Git eens beginnen te gebruiken. Je kunt natuurlijk niet meteen beginnen, je moet het eerst installeren. Er zijn een aantal manieren om eraan te komen; de belangrijkste twee zijn installeren vanaf broncode of een bestaand pakket voor jouw platform gebruiken.

## Installeren vanaf de broncode

Als het mogelijk is, is het meestal nuttig om Git vanaf de broncode te installeren, omdat je dan de meest recente versie krijgt. Elke versie van Git brengt meestal nuttige verbeteringen aan de gebruikersinterface met zich mee, dus de laatste versie is vaak de beste manier als je het gewend bent software vanaf de broncode te compileren. Vaak hebben Linuxdistributies behoorlijk oude pakketen, dus tenzij je een hele up-to-date distro hebt of ‘backports’ (verbeteringen van een nieuwe versie op een oudere versie toepassen) gebruikt, is installeren vanaf broncode misschien wel het beste voor je.

Om Git te installeren heb je een aantal bibliotheken (‘libraries’) nodig waar Git van afhankelijk is: curl, zlib, openssl, expat, en libiconv. Als je bijvoorbeeld op een systeem werkt dat yum heeft (zoals Fedora) of apt-get (zoals systemen gebaseerd op Debian), kun je één van de volgende commando's gebruiken om alle bibliotheken waar Git van afhankelijk is te installeren:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev

Als je alle benodigde afhankelijkheden hebt, kun je de laatste snapshot van Git vanaf de officiële website downloaden:

	http://git-scm.com/download

Daarna compileren en installeren:

	$ tar -zxf git-1.7.10.4.tar.gz
	$ cd git-1.7.10.4
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Als dat allemaal klaar is, kun je de ook nieuwste versie van Git met Git ophalen met dit commando:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Op Linux installeren

Als je direct de uitvoerbare bestanden van Git op Linux wilt installeren, kun je dat over het algemeen doen via het standaard pakketbeheersysteem dat meegeleverd is met je distributie. Als je Fedora gebruikt kun je yum gebruiken:

	$ yum install git-core

Of als je een distributie hebt die op Debian gebaseerd is, zoals Ubuntu, kun je apt-get proberen:

	$ apt-get install git

## Op een Mac installeren

Er zijn twee makkelijke manieren om Git op een Mac te installeren. De simpelste is om het grafische Git installatieprogramma te gebruiken, dat je van de volgende pagina op Google Code kunt downloaden (zie Figuur 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Figuur 1-7. Gitinstallatieprogramma voor OS X.

De andere veelgebruikte manier is om Git via MacPorts (`http://www.macports.org`) te installeren. Als je MacPorts geïnstalleerd hebt, kun je Git installeren met

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Je hoeft niet alle extra’s toe te voegen, maar je wilt waarschijnlijk +svn erbij hebben voor het geval je ooit Git moet gebruiken met Subversion repositories (zie Hoofdstuk 8).

## Op Windows installeren

Git op Windows installeren is erg eenvoudig. Het msysGit project heeft één van de eenvoudigere installatieprocedures. Je hoeft alleen maar het installatieprogramma te downloaden van GitHub, en het uit te voeren:

	http://msysgit.github.com/

Nadat het geïnstalleerd is, kun je Git zowel vanaf de commando-regel gebruiken (waar ook een SSH client bijzit die later nog van pas zal komen) als via de standaard GUI.

Opmerking voor Windows gebruikers: je zou Git moeten gebruiken met de meegeleverde msysGit shell (Unix stijl), dit staat je toe de complexe commando's gegeven in dit boek te gebruiken. Als je om een of andere reden de Windows shell / commando-regel moet gebruiken, moet je dubbele quotes gebruiken in plaats van enkele quotes (voor parameters met spaties ertussen) en je moet quotes gebruiken bij parameters die eindigen met een circumflex (^) als ze als laatste op de regel staan, omdat dit een voortzettingssymbool is in Windows.
