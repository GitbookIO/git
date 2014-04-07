# Gitin asennus

Ryhdytäänpä käyttämään Gitiä. Ensimmäiset asiat ensin - sinun täytyy asentaa se. Voit saada sen monella tavalla; kaksi yleisintä tapaa on asentaa se suoraan lähdekoodista tai asentaa jo olemassa oleva paketti sovellusalustallesi.

## Asennus suoraan lähdekoodista

Jos voit, on yleensä hyödyllistä asentaa Git suoraan lähdekoodista, koska näin saat kaikkein viimeisimmän version. Jokainen Gitin versio tapaa sisältää hyödyllisiä käyttöliittymäparannuksia, joten uusimman version hakeminen on yleensä paras reitti, jos tunnet olosi turvalliseksi kääntäessäsi ohjelmistoa sen lähdekoodista. On yleinen tilanne, että moni Linux-jakelu sisältää erittäin vanhoja paketteja; joten, jollet käytä erittäin päivitettyä jakelua tai backportteja, lähdekoodista asennus voi olla paras ratkaisu.

Asentaaksesi Gitin, tarvitset seuraavat kirjastot joista Git on riippuvainen: curl, zlib, openssl, expat, ja libiconv. Esimerkiksi, jos olet järjestelmässä, jossa on yum (kuten Fedora) tai apt-get (kuten Debian-pohjaiset järjestelmät), voit käyttää yhtä näistä komennoista asentaaksesi kaikki riippuvaisuudet:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev libssl-dev

Kun sinulla on kaikki tarvittavat riippuvuudet, voit mennä eteenpäin ja kiskaista uusimman tilannekuvan Gitin verkkosivuilta:

	http://git-scm.com/download

Tämän jälkeen käännä ja asenna:

	$ tar -zxf git-1.7.2.2.tar.gz
	$ cd git-1.7.2.2
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Kun tämä on tehty, voit myös ottaa Gitin päivitykset Gitin itsensä kautta:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Asennus Linuxissa

Jos haluat asentaa Gitin Linuxissa binääriasennusohjelman kautta, voit yleensä tehdä näin yksinkertaisella paketinhallintaohjelmalla, joka tulee julkaisusi mukana. Jos olet Fedorassa, voit käyttää yumia:

	$ yum install git-core

Tai jos olet Debian-pohjaisessa julkaisussa kuten Ubuntussa, kokeile apt-getiä:

	$ apt-get install git

## Asennus Macissä

On olemassa kaksi helppoa tapaa asentaa Git Macissä. Helpoin on käyttää graafista Git-asennusohjelmaa, jonka voit ladata Googlen Code -verkkosivuilta (katso Kuva 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Kuva 1-7. Git OS X -asennusohjelma.

Toinen pääasiallinen tapa on asentaa Git MacPortsin kautta (`http://www.macports.org`). Jos sinulla on MacPorts asennettuna, asenna Git näin:

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Sinun ei tarvitse asentaa kaikkia ekstroista, mutta varmaankin haluat sisältää +svn-ekstran tapauksessa, jossa sinun täytyy joskus käyttää Gitiä Subversion-tietolähteiden kanssa (katso Luku 8).

## Asennus Windowsissa

Gitin asennus Windowsissa on erittäin helppoa. MsysGit-projektilla on yksi helpoimmista asennusmenetelmistä. Yksinkertaisesti lataa asennus-exe-tiedosto GitHub-verkkosivulta ja suorita se:

	http://msysgit.github.com/

Asennuksen jälkeen sinulla on sekä komentoriviversio (sisältäen SSH-asiakasohjelman, joka osoittautuu hyödylliseksi myöhemmin) että standardi graafinen käyttöliittymä.

Huomioitavaa Windowsin käytössä: sinun tulisi käyttää Gitiä tarjotulla msysGitin komentorivillä (Unix-tyylinen). Se sallii käytettävän tässä kirjassa annettuja monirivisiä komentoja. Jos sinun täytyy jostakin syystä käyttää natiivia Windows-komentoriviä tai konsolia, sinun täytyy käyttää lainausmerkkejä heittomerkkien sijaan (parametreille, joissa on välejä) ja ympäröidä lainausmerkeillä sirkumfleksiaksenttiin (^) päättyvät parametrit, jos ne ovat rivillä viimeisinä, koska se on jatkumissymboli Windowsissa.
