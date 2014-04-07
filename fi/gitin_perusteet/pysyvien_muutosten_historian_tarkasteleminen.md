# Pysyvien muutosten historian tarkasteleminen

Kun olet luonut useita pysyviä muutoksia tai kloonannut tietovaraston, jonka historiassa on pysyviä muutoksia, haluat todennäköisesti katsoa taaksepäin nähdäksesi, mitä on tapahtunut. Yksinkertaisin ja tehokkain työkalu tähän on `git log` -komento.

Nämä esimerkit käyttävät erittäin yksinkertaista projektia nimeltä `simplegit`, jota käytän useasti havainnollistamisessa. Saadaksesi projektin, aja

	git clone git://github.com/schacon/simplegit-progit.git

Kun ajat `git log` tässä projektissa, sinun tulisi saada vastaavanlainen tuloste:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

Oletuksena, ilman argumentteja, `git log` listaa tietovarastoon tehdyt pysyvät muutokset käänteisessä aikajärjestyksessä. Se tarkoittaa, että uusin pysyvä muutos tulee ensimmäiseksi. Kuten voit nähdä, tämä komento listaa kustakin pysyvästä muutoksesta sen SHA-1-tarkisteen,  tekijän nimen ja sähköpostin, luontipäiväyksen sekä viestin.

`Git log` -komennolle on saatavilla valtava määrä ja lajitelma optioita näyttääkseen sinulle tarkalleen etsimäsi. Näytämme tässä sinulle joitakin käytetyimpiä optioita.

Yksi hyödyllisimmistä optioista on `-p`, joka näyttää kunkin pysyvän muutoksen eroavaisuuden. Voit myös käyttää `-2`, joka rajaa tulosteen ainoastaan kahteen viimeisimpään kirjaukseen:

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,5 +5,5 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	     s.name      =   "simplegit"
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"
	     s.email     =   "schacon@gee-mail.com

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Tämä optio näyttää saman informaation, mutta jokaista kirjausta seuraavalla eroavaisuudella. Tämä on erittäin hyödyllinen koodin katselmoinnissa tai nopeasti tarkistettaessa, mitä tapahtui pysyvien muutosten sarjassa, jonka työtoveri on lisännyt.

Joskus on helpompaa katselmoida muutoksia sanatasolla kuin rivitasolla. Gitissä on saatavilla `--word-diff`-optio, jonka voit lisätä `git log -p` -komentoon saadaksesi sanatason eroavaisuuden normaalin rivitasoisen eroavaisuuden sijaan. Sanatason eroavaisuuden formaatti on melko hyödytön käytettäessä sitä lähdekoodiin, mutta siitä tulee kätevä käytettäessä sitä isoihin tekstitiedostoihin, kuten kirjoihin tai väitöskirjaasi. Tässä on esimerkki:

	$ git log -U1 --word-diff
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -7,3 +7,3 @@ spec = Gem::Specification.new do |s|
	    s.name      =   "simplegit"
	    s.version   =   [-"0.1.0"-]{+"0.1.1"+}
	    s.author    =   "Scott Chacon"

Kuten voit nähdä, tässä tulosteessa ei ole lisättyjä ja poistettuja rivejä, kuten normaalissa eroavaisuudessa. Muutokset esitetään sen sijaan rivin sisällä. Voit nähdä lisätyn sanan ympäröitynä `{+ +}` -merkeillä ja poistetun ympäröitynä `[- -]` -merkeillä. Voit myös haluta vähentää tavallisen kolmen rivin kontekstin eroavaisuustulosteessa vain yhden rivin kontekstiksi, koska asiayhteys on nyt sanatasolla ei rivitasolla. Voit tehdä tämän `-U1`-optiolla, kuten teimme esimerkissä yläpuolella.

Voit myös käyttää yhteenveto-optioiden sarjaa `git log`in kanssa. Esimerkiksi, jos haluat nähdä hieman lyhennettyjä tilastoja kustakin pysyvästä muutoksesta, voit käyttää `--stat`-optiota:

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Kuten voit nähdä, `--stat`-optio tulostaa kunkin pysyvän muutoksen alapuolelle listan muokatuista tiedostoista, kuinka montaa tiedostoa muutettiin ja kuinka monta riviä lisättiin ja poistettiin näissä tiedostoissa. Se esittää myös lopuksi yhteenvedon tiedoista.
Toinen todella hyödyllinen optio on `--pretty`. Tämä optio muuttaa lokitulosteen oletuksesta poikkeaviin muotoihin. Saatavilla on muutama esikäännetty optio käytettäväksesi. `Oneline`-optio tulostaa kunkin pysyvän muutoksen yhdelle riville,  mikä on hyödyllistä, jos katselet monia pysyviä muutoksia. Lisäksi `short`-, `full`- ja `fuller`-optiot näyttävät tulosteen karkeasti ottaen alkuperäisessä muodossa, mutta vastaavasti vähemmillä tai enemmillä tiedoilla:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

Kiinnostavin optio on `format`, joka antaa sinun määritellä oman formaatin lokitulosteelle. Tämä on hyödyllinen varsinkin, kun  luot tulostetta koneellista parsimista varten — koska sinä määrittelet formaatin eksplisiittisesti, tiedät, ettei se muutu Gitin päivitysten myötä:

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Taulukko 2-1 listaa joitakin hyödyllisempiä optioita, joita format hyväksyy.

|Optio|Tulosteen kuvaus|
|-----|----------------|
|%H|Pysyvän muutoksen tarkiste|
|%h|Lyhennetty pysyvän muutoksen tarkiste|
|%T|Puun tarkiste|
|%t|Lyhennetty puun tarkiste|
|%P|Vanhempien tarkisteet|
|%p|Lyhennetyt vanhempien tarkisteet|
|%an|Tekijän nimi|
|%ae|Tekijän sähköpostiosoite|
|%ad|Tekijän päiväys (muoto riippuu --date=-optiosta)|
|%ar|Tekijän päiväys, suhteellinen|
|%cn|Hyväksyjän nimi|
|%ce|Hyväksyjän sähköpostiosoite|
|%cd|Hyväksyjän päiväys|
|%cr|Hyväksyjän päiväys, suhteellinen|
|%s|Aihe|

Saatat ihmetellä, mitä eroa on _tekijällä_ ja _hyväksyjällä_. _Tekijä_ on henkilö, joka alunperin kirjoitti muutoksen, kun taas _hyväksyjä_ on henkilö, joka lopulta otti muutoksen käyttöön. Joten, jos sinä lähetät muutoksen projektiin ja joku ydinjäsenistä ottaa muutoksen käyttöön, te saatte molemmat kunniaa — sinä tekijänä ja ydinjäsen hyväksyjänä. Käsittelemme tätä eroa enemmän *Luvussa 5*.

`Oneline`- ja `format`-optiot ovat  erityisen hyödyllisiä yhdessä toisen `--graph`-nimisen `log`-komennon option kanssa. Tämä optio lisää kivan pienen ASCII-kaavion esittämään haarasi ja yhdistämisten historiaa, jonka voimme nähdä Grit-projektin tietovaraston kopiossamme:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Ne ovat vain joitakin yksinkertaisia tulosteenmuotoiluoptioita `git log`ille — monia muitakin on olemassa. Taulukko 2-2 listaa optiot, jotka olemme käsitelleet tähän mennessä sekä joitakin muita yleisiä muotoiluoptioita, jotka voivat olla hyödyllisiä, yhdessä sen kanssa, miten ne muuttavat `log`-komennon tulostetta.

|Optio|Kuvaus|
|-----|------|
|-p|Näyttää tehdyt muutokset kunkin pysyvän muutoksen yhteydessä.|
|--word-diff|Näyttää tehdyt muutokset sanatason eroavaisuuksina.|
|--stat|Näyttää kussakin pysyvässä muutoksessa muutetuista tiedostoista tilaston.|
|--shortstat|Näyttää vain muuttuneet/lisätyt/poistetut-rivin –stat-komennosta.|
|--name-only|Näyttää muutettujen tiedostojen listan pysyvän muutoksen tietojen jälkeen.|
|--name-status|Näyttää lisäksi listan vaikutetuista tiedostoista lisätty/muokattu/poistettu-tiedon kera.|
|--abbrev-commit|Näyttää vain muutaman ensimmäisen merkin SHA-1-tarkistesummasta kaikkien 40 merkin sijaan.|
|--relative-date|Näyttää päiväykset suhteellisessa muodossa (esimerkiksi, ”2 viikkoa sitten”) täyden päiväysmuotoilun käyttämisen sijaan.|
|--graph|Näyttää ASCII-kaavion haarasi ja yhdistämisten historiasta lokitulosteen vieressä.|
|--pretty|Näyttää pysyvät muutokset vaihtoehtoisessa muodossa. Vaihtoehtoihin kuuluu oneline, short, full, fuller ja format (jossa voit määritellä oman muotoilusi).|
|--oneline|Helppokäyttöoptio `--pretty=oneline –abbrev-commit`ille.|

## Tulosteen rajaaminen

Lisäyksenä tulosteen muotoiluoptioihin, `git log` hyväksyy useita hyödyllisiä rajaamisoptioita — optioita, jotka antavat sinun näyttää vain osajoukon pysyvistä muutoksista. Olet nähnyt yhden sellaisen option ennestään — `-2`-option, joka näyttää vain kaksi viimeisintä pysyvää muutosta. Itse asiassa, voit käyttää `-<n>`:tä, jossa `n` on mikä tahansa kokonaisluku näyttääksesi viimeiset `n` pysyvää muutosta. Todellisuudessa käytät sitä epätodennäköisesti usein, koska oletuksena Git putkittaa kaiken tulosteen sivuttajan läpi, joten näet vain yhden sivun lokitulosteesta kerralla.

Aikarajausoptiot, kuten `--since` ja `--until`, ovat kuitenkin erittäin hyödyllisiä. Esimerkiksi tämä komento hakee listan pysyvistä muutoksista, jotka on tehty kahden viimeisen viikon aikana.

	$ git log --since=2.weeks

Tämä komento toimii useilla muodoilla — voit määritellä tietyn päivämäärän (”15. 1. 2008”) tai suhteellisen päiväyksen, kuten ”2 vuotta 1 päivä ja 3 minuuttia sitten”.

Voit myös suodattaa listan pysyviin muutoksiin, joihin sopii  jokin hakukriteeri. `--author`-optio antaa sinun suodattaa tietyllä tekijällä ja `--grep`-optio etsiä avainsanoja pysyvän muutoksen viestistä (Huomaa, että jos haluat määritellä sekä tekijä- että grep-optiot, täytyy sinun lisätä `--all-match` tai komento sopii pysyviin muutoksiin, jotka täyttävät vain toisen ehdon.)

Viimeinen todella hyödyllinen `git log`ille suodattimena annettava optio on hakemistopolku (path). Jos määrittelet hakemiston tai tiedoston nimen, voit rajata lokitulosteen pysyviin muutoksiin, jotka esittelivät muutokset niihin tiedostoihin. Tämä on aina viimeinen optio ja yleensä varustettu kahden viivan (`--`) etuliitteellä, jotta hakemistopolut erotettaisiin optioista.

Taulukossa 2-3 listaamme nämä ja muutaman muun yleisen option referenssiksesi.

|Optio|Kuvaus|
|-----|------|
|-(n)|Näyttää vain viimeisimmät n pysyvää muutosta|
|--since, --after|Rajaa pysyvät muutokset tietyn päivämäärän jälkeen tehtyihin.|
|--until, --before|Rajaa pysyvät muutokset tiettyä päivämäärää ennen tehtyihin.|
|--author|Näyttää vain pysyvät muutokset, joiden tekijämerkintä sopii tiettyyn merkkijonoon.|
|--committer|Näyttää vain pysyvät muutokset, joiden hyväksyjämerkintä sopii tiettyyn merkkijonoon.|

Esimerkiksi, jos haluat nähdä, mitkä testitiedostoja muokanneet pysyvät muutokset Gitin lähdekoodihistoriassa Junio Hamano teki lokakuussa 2008, joita ei ole yhdistetty, voit ajaa jotakuinkin seuraavasti:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Tämä komento näyttää melkein 20 000 pysyvän muutoksen Gitin lähdekoodihistoriasta 6 näihin ehtoihin sopivaa pysyvää muutosta.

## GUI:n käyttäminen historian visualisointiin

Jos haluat käyttää graafisempaa työkalua visualisoidaksesi pysyvien muutosten historiaasi, voit haluta katsoa `gitk`:ksi kutsuttua Tcl/Tk-ohjelmaa, jota levitetään Gitin kanssa. Gitk on periaatteessa visuaalinen `git log` -työkalu ja se hyväksyy lähes kaikki suodatusoptiot, joita `git log`kin hyväksyy. Jos kirjoitat projektissasi komentoriville `gitk`, sinun pitäisi saada Kuvaa 2-2 vastaava tulos.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Kuva 2-2. Gitk -historian visualisoija.

Voit nähdä pysyvien muutosten historian ikkunan ylemmässä puoliskossa yhdessä kivan syntyperäkaavion kanssa. Vertailuohjelma ikkunan alemmassa puoliskossa näyttää sinulle napsauttamassasi pysyvässä muutoksessa esitellyt muutokset.
