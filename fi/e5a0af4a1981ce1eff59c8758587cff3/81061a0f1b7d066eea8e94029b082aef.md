# Git-tietolähteen hankinta

Voit hankkia itsellesi Git-projektin käyttäen kahta yleistä lähestymistapaa. Ensimmäinen ottaa jo olemassa olevan projektin tai hakemiston ja tuo sen Gitiin. Toinen kloonaa olemassa olevan Git tietolähteen toiselta palvelimelta.

## Tietolähteen alustaminen jo olemassa olevalle hakemistolle

Jos aloitat jo olemassa olevan projektin jäljittämisen Gitillä, sinun täytyy mennä projektisi hakemistoon ja kirjoittaa

	$ git init

Tämä luo uuden alihakemiston nimeltä `.git`, joka sisältää kaikki tarvittavat tietolähdetiedostot - luurangon Git-tietolähteelle. Tällä hetkellä mitään projektissasi ei vielä jäljitetä. (Katso *Luku 9* saadaksesi enemmän tietoa siitä, mitä tiedostoja tarkalleen ottaen juuri luomasi `.git`-hakemisto sisältää.)

Jos haluat aloittaa versionhallinnan jo olemassa oleville tiedostoille (tyhjän kansion sijaan), sinun täytyy mitä luultavammin aloittaa näiden tiedostojen jäljittäminen ja tehdä alustava pysyvä muutos. Sinä saavutat tämän muutamalla `git add` -komennolla, joista ensimmäiset määrittävät, mitä tiedostoja haluat jäljittää, ja joita seuraa pysyvän muutoksen luonti:

	$ git add *.c
	$ git add README
	$ git commit –m 'initial project version'

Me käymme pian läpi mitä nämä komennot tekevät. Tällä hetkellä sinulla on Git-tietolähde, joka jäljittää tiedostoja sekä alustava pysyvä muutos.

## Olemassa olevan tietolähteen kloonaus

Jos haluat kopion olemassa olevasta tietolähteestä - esimerkiksi projektista, johon haluat olla osallisena - komento, jonka tarvitset, on `git clone`. Jos muut VCS-järjestelmät, kuten Subversion, ovat sinulle tuttuja, huomaat, että komento on `clone` eikä `checkout`. Tämä on tärkeä ero - Git saa kopion melkein kaikesta datasta mitä palvelimella on. Jokainen versio jokaisesta tiedostosta projektin historiassa tulee vedetyksi, kun suoritat `git clone` -komennon. Itse asiassa, jos palvelimesi levy korruptoituu, voit käyttää mitä tahansa klooneista, miltä tahansa asiakassovellukselta, asettaaksesi palvelimen takaisin tilaan, jossa se oli, kun se kloonattiin (voit menettää jotain palvelinpuolen sovelluskoukkuja ja muuta, mutta kaikki versioitu data on tallessa - katso *Luku 4* tarkempia yksityiskohtia varten).

Kloonaat tietolähteen `git clone [url]` -komennolla. Esimerkiksi, jos haluat kloonata Gritiksi kutsutun Ruby Git -kirjaston, voit tehdä sen näin:

	$ git clone git://github.com/schacon/grit.git

Tämä luo hakemiston nimeltä `grit`, alustaa `.git`-hakemiston sen sisään, vetää kaiken datan tietolähteestä, ja hakee viimeisimmän version työkopion. Jos menet uuteen `grit`-hakemistoon, näet projektin tiedostot valmiina työtä varten tai käytettäväksi. Jos haluat kloonata tietolähteen hakemistoon, joka on nimetty joksikin muuksi kuin grit, voit antaa nimen seuraavanlaisella komentorivioptiolla:

	$ git clone git://github.com/schacon/grit.git mygrit

Tämä komento tekee saman asian kuin edellinenkin, mutta kohdehakemisto on nimeltään `mygrit`.

Gitissä on monta erilaista siirtoprotokollaa, joita voit käyttää. Edellinen esimerkki käyttää `git://`-protokollaa, mutta voit myös nähdä `http(s)://` tai `user@server:/path.git`, joka käyttää SSH-siirtoprotokollaa. *Luku 4* esittelee kaikki saatavilla olevat optiot, joilla palvelin voidaan asettaa päästämään Git-tietolähteen, sekä jokaisin hyvät ja huonot puolet.
