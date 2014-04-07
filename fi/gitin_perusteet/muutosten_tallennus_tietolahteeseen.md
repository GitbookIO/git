# Muutosten tallennus tietolähteeseen

Sinulla on oikea Git-tietolähde ja tiedonhaku (checkout) tai työkopio projektin tiedostoista. Sinun täytyy tehdä joitain muutoksia ja pysyviä tilannekuvia näistä muutoksista sinun tietolähteeseesi joka kerta, kun projekti saavuttaa tilan, jonka haluat tallentaa.

Muista, että jokainen tiedosto työhakemistossasi voi olla yhdessä kahdesta tilasta: *jäljitetty* tai *jäljittämätön*. *Jäljitetyt* tiedostot ovat tiedostoja, jotka olivat viimeisimmässä tilannekuvassa; ne voivat olla *muokkaamattomia*, *muokattuja* tai *lavastettuja*. *Jäljittämättömät* tiedostot ovat kaikkea muuta - mitkä tahansa tiedostoja työhakemistossasi, jotka eivät olleet viimeisimmässä tilannekuvassa ja jotka eivät ole lavastusalueella. Kun ensimmäisen kerran kloonaat tietolähteen, kaikki tiedostoistasi tulevat olemaan jäljitettyjä ja muokkaamattomia, koska sinä juuri hait ne etkä ole muokannut vielä mitään.

Editoidessasi tiedostoja Git näkee ne muokattuina, koska olet muuttanut niitä viimeisimmän pysyvän muutoksen jälkeen. *Lavastat* nämä muutetut tiedostot, jonka jälkeen muutat kaikki lavastetut muutokset pysyvästi, ja sykli toistuu. Tämä elämänsykli on kuvattu Kuvassa 2-1.


![](http://git-scm.com/figures/18333fig0201-tn.png)
 
Kuva 2-1. Tiedostojesi tilan elämänsykli.

## Tiedostojesi tilan tarkistaminen

Päätyökalu tiedostojesi eri tilojen selvittämiseen on `git status` -komento. Jos suoritat tämän komennon suoraan kloonauksen jälkeen, sinun tulisi nähdä jotain vastaavaa:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Tämä tarkoittaa, että sinulla on puhdas työhakemisto - toisin sanoen, jäljitettyjä tiedostoja ei ole muutettu. Git ei myöskään näe yhtään jäljittämätöntä tiedostoa, muuten ne olisi listattu näkymään. Lopuksi komento kertoo sinulle missä haarassa olet. Tällä hetkellä se on aina `master`-haara, joka on oletusarvo; sinun ei tarvitse huolehtia siitä nyt. Seuraava luku käy läpi haarautumiset ja viittaukset yksityiskohtaisesti.

Sanotaan vaikka, että lisäät uuden tiedoston projektiin, vaikka yksinkertaisen `README`-tiedoston. Jos tiedosto ei ollut olemassa ennen, ja ajat `git status` -komennon, näet jäljittämättömän tiedoston tällä tavoin:

	$ vim README
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#	README
	nothing added to commit but untracked files present (use "git add" to track)

Voit nähdä, että juuri luomasi `README`-tiedosto on jäljittämätön, koska se on otsikon ”Untracked files” alla tilatulosteessa. Jäljittämätön tarkoittaa periaatteessa sitä, että Git näkee tiedoston, jota ei ollut edellisessä tilannekuvassa (pysyvässä muutoksessa); Git ei aloita sisällyttämään sitä sinun pysyviin muutostilannekuviisi, ennen kuin sinä varta vasten käsket sen tehdä niin. Se tekee tämän, että et vahingossa alkaisi lisätä generoituja binaaritiedostoja tai muita tiedostoja, joita et tarkoittanut lisätä. Haluat lisätä READMEn, joten aloitetaan jäljittämään tiedostoa.

## Uusien tiedostojen jäljitys

Jotta voisit jäljittää uusia tiedostoja, sinun täytyy käyttää `git add` -komentoa. Aloittaaksesi `README`-tiedoston jäljittämisen, voit ajaa tämän:

	$ git add README

Jos ajat status-komennon uudestaan, näet että `README`-tiedostosi on nyt jäljitetty ja lavastettu:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#

Voit nähdä, että se on lavastettu, koska se on otsikon ”Changes to be committed” alla. Jos teet pysyvän muutoksen tässä kohtaa, versio tiedostosta sillä hetkellä kun ajoit `git add` -komennon on se, joka tulee olemaan historian tilannekuvassa. Voit palauttaa mieleen hetken, jolloin ajoit `git init` -komennon aikaisemmin, ajoit sen jälkeen `git add (tiedostot)` -komennon - tämä komento aloitti tiedostojen jäljittämisen hakemistossa. `Git add` -komento ottaa polun nimen joko tiedostolle tai hakemistolle; jos se on hakemisto, komento lisää kaikki tiedostot hakemiston alta rekursiivisesti.

## Muutettujen tiedostojen lavastus

Muutetaanpa tiedostoa, joka on jo jäljitetty. Jos muutat aikaisemmin jäljitettyä `benchmarks.rb`-tiedostoa ja sen jälkeen ajat `status`-komennon uudestaan, saat suunnilleen tämän näköisen tulosteen:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

`Benchmarks.rb`-tiedosto näkyy kohdan ”Changes not staged for commit” alla - mikä tarkoittaa, että tiedostoa, jota jäljitetään, on muokattu työskentelyhakemistossa, mutta sitä ei vielä ole lavastettu. Lavastaaksesi sen, ajat `git add` -komennon (se on monitoimikomento - käytät sitä aloittaaksesi uusien tiedostojen jäljittämisen, lavastaaksesi tiedostoja, ja tehdäksesi muita asioita, kuten merkataksesi liitoskonfliktitiedostot ratkaistuksi). Ajetaanpa nyt `git add` -komento lavastaaksemme `benchmarks.rb`-tiedoston, ja ajetaan sitten `git status` -komento uudestaan:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

Kummatkin tiedostot ovat lavastettuja ja tulevat menemään seuraavaan pysyvään muutokseen. Oletetaan, että tässä kohdassa muistat pienen muutoksen, jonka haluat tehdä `benchmarks.rb`-tiedostoon, ennen kuin teet pysyvää muutosta. Avaat tiedoston uudestaan ja muutat sitä, jonka jälkeen olet valmis tekemään pysyvän muutoksen. Ajetaan silti `git status` -komento vielä kerran:

	$ vim benchmarks.rb 
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Mitä ihmettä? Nyt `benchmarks.rb` on listattu sekä lavastettuna että lavastamattomana. Miten se on mahdollista? Tapahtuu niin, että Git lavastaa tiedoston juuri sellaisena kuin se on, kun ajat `git add` -komennon. Jos teet pysyvän muutoksen nyt, `benchmark.rb`-tiedoston versio sillä hetkellä, kun ajoit `git add` -komennon, on se, joka menee tähän pysyvään muutokseen, eikä se tiedoston versio, joka on työskentelyhakemistossasi sillä hetkellä, kun ajat `git commit` -komennon. Jos muutat tiedostoa sen jälkeen, kun olet ajanut `git add` -komennon, sinun täytyy ajaa `git add` uudestaan lavastaaksesi uusimman version tiedostosta:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

## Tiedostojen sivuuttaminen

Usein sinulla on luokka tiedostoja, joita et halua Gitin automaattisesti lisäävän tai edes näyttävän, että ne ovat jäljittämättömiä. Näitä ovat yleensä automaattisesti generoidut tiedostot, kuten lokitiedostot tai tiedostot, jotka sinun rakennejärjestelmä on luonut. Tällaisissa tapauksissa, voit luoda tiedostonlistausmalleja löytääksesi ne, `.gitignore`-tiedostoon. Tässä on esimerkki `.gitignore`-tiedostosta:

	$ cat .gitignore
	*.[oa]
	*~

Ensimmäinen rivi kertoo Gitille, että jokainen tiedosto, joka loppuu `.o`- tai `.a`- päätteeseen, sivuutetaan - näitä ovat mm. *olio-* ja *arkistotiedostot*, jotka voivat olla ohjelmakoodisi rakennuksen tulos. Toinen rivi kertoo Gitille, että kaikki tiedostot, jotka loppuvat tildeen (`~`), jotka ovat yleensä monen tekstieditorin, kuten Emacsin tapa merkata väliaikaisia tiedostoja, sivuutetaan. Voit myös sisällyttää `log`-, `tmp`-, tai `pid`-hakemiston; automaattisesti generoidun dokumentaation; ja niin edelleen. Välttääksesi sellaisten tiedostojen joutumisten Git-tietolähteeseen, joita et sinne alunperinkään halua menevän, on `.gitignore`-tiedoston asettaminen ennen varsinaisen työskentelyn aloittamista yleensä hyvä idea.

Säännöt malleille, joita voit laittaa `.gitignore`-tiedostoon ovat seuraavanlaiset:

*	Tyhjät rivit ja rivit, jotka alkavat `#`-merkillä, sivuutetaan.
*	Yleiset keräysmallit toimivat.
*	Voit päättää malleja kauttaviivalla (`/`) määrittääksesi hakemiston.
*	Voit kieltää mallin aloittamalla sen huutomerkillä (`!`).

Keräysmallit ovat kuin yksinkertaistettuja säännöllisiä lausekkeita, joita komentorivit käyttävät. Asteriski (`*`) löytää nolla tai enemmän merkkiä; `[abc]` löytää jokaisen merkin, joka on hakasulkujen sisällä (tässä tapauksessa a:n, b:n tai c:n); kysymysmerkki (`?`) löytää yksittäisen merkin; hakasulut, jotka ovat väliviivalla erotettujen merkkien ympärillä (`[0-9]`) löytävät jokaisen merkin, joka on merkkien välissä, tai on itse merkki (tässä tapauksessa merkit 0:sta 9:ään).

Tässä toinen esimerkki .gitignore-tiedostosta:

	# kommentti – tämä sivuutetaan
	# ei .a tiedostoja
	*.a
	# mutta jäljitä lib.a, vaikka sivuutatkin .a tiedostot yllä
	!lib.a
	# sivuttaa vain juuren TODO-tiedosto, ei subdir/TODO-tiedostoa
	/TODO
	# sivuttaa kaikki tiedostot build/-hakemistosta
	build/
	# sivuttaa doc/notes.txt, mutta ei doc/server/arch.txt
	doc/*.txt
	# sivuuttaa kaikki .txt-tiedostot doc/-hakemistosta
	doc/**/*.txt

`**/`-malli on saatavilla Gitin versiosta 1.8.2 lähtien.

## Lavastettujen ja lavastamattomien muutosten tarkastelu

Jos `git status` -komento on liian epämääräinen sinulle - haluat tietää tarkalleen mitä on muutettu, et ainoastaan sitä, mitkä tiedostot ovat muuttuneet - voit käyttää `git diff` -komentoa. Me käsittelemme `git diff` -kommenon yksityiskohtaisesti myöhemmin; mutta sinä tulet mahdollisesti käyttämään sitä useasti, vastataksesi näihin kahteen kysymykseen: Mitä olet muuttanut, mutta et ole vielä lavastanut? Ja mitä sellaista olet lavastanut, josta olet tekemässä pysyvän muutoksen? Vaikkakin `git status` vastaa näihin kysymyksiin yleisesti, `git diff` näyttää sinulle tarkalleen ne rivit, jotka on lisätty ja poistettu - vähän niin kuin pätsi.

Sanotaan vaikka, että muokkaat ja lavastat `README`-tiedostoa uudestaan, jonka jälkeen muokkaat `benchmarks.rb`-tiedostoa, ilman että lavastat sitä. Jos ajat `status`-komennon, näet jälleen kerran jotain tällaista:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Nähdäksesi, mitä olet muuttanut, mutta et vielä lavastanut, kirjoita `git diff` ilman mitään muita argumentteja:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

Tämä komento vertailee sitä, mitä sinun työskentelyhakemistossa on verrattuna siihen, mitä sinun lavastusalueellasi on. Tulos kertoo tekemäsi muutokset, joita et ole vielä lavastanut.

Jos haluat nähdä, mitä sellaista olet lavastanut, joka menee seuraavaan pysyvään muutokseen, voit käyttää `git diff --cached` -komentoa. (Gitin versiosta 1.6.1 lähtien voit käyttää myös `git diff --staged` -komentoa, joka on helpompi muistaa.) Tämä komento vertailee lavastettuja muutoksia viimeisimpään pysyvään muutokseen.

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

On tärkeää ottaa huomioon, että `git diff` itsessään ei näytä kaikkia muutoksia viimeisimmästä pysyvästä muutoksesta lähtien - vain muutokset, jotka ovat yhä lavastamattomia. Tämä voi olla sekavaa, koska kun olet lavastanut kaikki muutoksesi, `git diff` ei anna ollenkaan tulostetta.

Toisena esimerkkinä, jos lavastat `benchmarks.rb`-tiedoston ja sitten muokkaat sitä, voit käyttää `git diff` -komentoa nähdäksesi tiedoston lavastetut muutokset ja lavastamattomat muutokset:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#

Nyt voit käyttää `git diff` -komentoa nähdäksesi, mitä on yhä lavastamatta:

	$ git diff 
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats 
	+# test line

Ja `git diff --cached` -komentoa nähdäksesi, mitä olet lavastanut tähän mennessä:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+              
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Pysyvien muutoksien tekeminen

Nyt, kun lavastusalueesi on asetettu niin kuin sen haluat, voit tehdä muutoksistasi pysyviä. Muista, että kaikki, mikä vielä on lavastamatta - mitkä tahansa tiedostot, jotka olet luonut tai joita olet muokannut, joihin et ole ajanut `git add` -komentoa editoinnin jälkeen - eivät mene pysyvään muutokseen. Ne pysyvät muokattuina tiedostoina levylläsi.
Tässä tapauksessa oletamme, että viime kerran, kun ajoit `git status` -komennon, näit, että kaikki oli lavastettu, joten olet valmis tekemään pysyvän muutoksen. Helpoin tapa pysyvän muutoksen tekoon on kirjoittaa `git commit`:

	$ git commit

Tämän suorittaminen aukaisee editorisi. (Tämä on asetettu komentorivisi `$EDITOR` ympäristömuuttujalla - yleensä vim tai emacs, kuitenkin voit konfiguroida sen käyttämään mitä haluat, käyttäen `git config --global core.editor` -komentoa, kuten *Luvussa 1* näit).

Editori näyttää seuraavanlaisen tekstin (tämä esimerkki on Vimistä):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       new file:   README
	#       modified:   benchmarks.rb 
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

Voit nähdä, että oletuksena pysyvän muutoksen viesti sisältää viimeisimmän `git status` -komennon tulosteen kommentoituna ja yhden tyhjän rivin ylhäällä. Voit poistaa nämä kommentit ja kirjoittaa pysyvän muutoksen viestisi, tai voit jättää kommentit viestiin auttamaan sinua muistamaan mihin olet pysyvää muutosta tekemässä. (Saadaksesi vieläkin tarkemman muistutukseen muutoksistasi, voit antaa `-v`-option `git commit` -komennolle. Tämä optio laittaa myös diff-muutostulosteen editoriin, jotta näet tarkalleen mitä teit.) Kun poistut editorista, Git luo pysyvän muutoksesi viestilläsi (kommentit ja diff pois lukien).

Vaihtoehtoisesti, voit kirjoittaa pysyvän muutoksen viestin suoraan `commit`-kommennolla antamalla sen `-m`-lipun jälkeen, näin:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master]: created 463dc4f: "Fix benchmarks for speed"
	 2 files changed, 3 insertions(+), 0 deletions(-)
	 create mode 100644 README

Nyt olet luonut ensimmäisen pysyvän muutoksen! Voit nähdä, että pysyvä muutos on antanut sinulle tulosteen itsestään: kertoen mihin haaraan teit pysyvän muutoksen (`master`), mikä SHA-1 tarkistussumma pysyvällä muutoksella on (`463dc4f`), kuinka monta tiedostoa muutettiin ja tilastoja pysyvän muutoksen rivien lisäyksistä ja poistoista.

Muista, että pysyvä muutos tallentaa tilannekuvan lavastusalueestasi. Kaikki, mitä et lavastanut on yhä istumassa projektissasi muokattuna; voit tehdä toisen pysyvän muutoksen lisätäksesi ne historiaasi. Joka kerta, kun teet pysyvän muutoksen, olet tallentamassa tilannekuvaa projektistasi. Tilannekuvaa, johon voit palata tai jota voit vertailla myöhemmin. 

## Lavastusalueen ohittaminen

Vaikka lavastusalue voi olla uskomattoman hyödyllinen pysyvien muutoksien tekoon tarkalleen niin kuin ne haluat, on lavastusalue joskus hieman liian monimutkainen, kuin mitä työnkulussasi tarvitsisit. Jos haluat ohittaa lavastusalueen, Git tarjoaa siihen helpon oikoreitin. Antamalla `-a`-option `git commit` -komennolle, asettaa Gitin automaattisesti lavastamaan jokaisen jo jäljitetyn tiedoston ennen pysyvää muutosta, antaen sinun ohittaa `git add` -osan:

	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+), 0 deletions(-)

Huomaa, miten sinun ei tarvitse ajaa `git add` -komentoa `benchmarks.rb`-tiedostolle tässä tapauksessa pysyvää muutosta tehdessäsi.

## Tiedostojen poistaminen

Poistaaksesi tiedoston Gitistä, sinun täytyy poistaa se sinun jäljitetyistä tiedostoistasi (tarkemmin sanoen, poistaa se lavastusalueeltasi) ja sitten tehdä pysyvä muutos. Komento `git rm` tekee tämän ja myös poistaa tiedoston työskentelyhakemistostasi, joten et näe sitä enää jäljittämättömänä tiedostona.

Jos yksinkertaisesti poistat tiedoston työskentelyhakemistostasi, näkyy se ”Changes not staged for commit” otsikon alla (se on, _lavastamaton_) `git status` -tulosteessasi:

	$ rm grit.gemspec
	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#   (use "git add/rm <file>..." to update what will be committed)
	#
	#       deleted:    grit.gemspec
	#

Jos ajat tämän jälkeen `git rm` -komennon, se lavastaa tiedostot poistoon:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       deleted:    grit.gemspec
	#

Seuraavan kerran, kun teet pysyvän muutoksen, tiedosto katoaa ja sitä ei jäljitetä enää. Jos muokkasit tiedostoa ja lisäsit sen jo indeksiin, täytyy sinun pakottaa poisto `-f`-optiolla. Tämä on turvallisuusominaisuus, joka estää vahingossa tapahtuvan datan poistamisen, datan, jota ei ole vielä tallennettu tilannekuvaksi ja jota ei voida palauttaa Gitistä.

Toinen hyödyllinen asia, jonka saatat haluta tehdä, on tiedoston pitäminen työskentelypuussa, mutta samalla sen poistaminen lavastusalueelta. Toisin sanoen, voit haluta pitää tiedoston kovalevylläsi, mutta et halua, että Git jäljittää sitä enää. Tämä on erityisesti hyödyllinen, jos unohdit lisätä jotain `.gitignore`-tiedostoosi ja vahingossa lavastit sellaisen, kuten suuri lokitiedosto tai joukko `.a`-muotoon käännettyjä tiedostoja. Tehdäksesi tämän, käytä `--cached`-optiota:

	$ git rm --cached readme.txt

Voit antaa tiedostoja, hakemistoja tai tiedoston keräysmalleja `git rm` -komennolle. Tämä tarkoittaa sitä, että voit tehdä asioita kuten:

	$ git rm log/\*.log

Huomaa kenoviiva (`\`) `*`-merkin edessä. Windowsin järjestelmäkonsolissa kenoviiva täytyy jättää pois. Tämä on tarpeellinen, koska Git tekee oman tiedostonimilaajennuksensa komentorivisi tiedostonimilaajennuksen lisänä. Tämä komento poistaa kaikki tiedostot, joilla on `.log`-liite, `log/`-hakemistosta. Voit myös tehdä näin:

	$ git rm \*~

Tämä komento poistaa kaikki tiedostot, jotka loppuvat `~`-merkkiin.

## Tiedostojen siirtäminen

Toisin kuin monet muut VCS-järjestelmät, Git ei jäljitä suoranaisesti tiedostojen siirtämistä. Jos nimeät tiedoston uudelleen Gitissä, Gitiin ei tallenneta metadataa, joka kertoo, että nimesit tiedoston uudelleen. Git on kuitenkin melko älykäs selvittämään sen myöhemmin — käsittelemme tiedostojen siirtämisen havaitsemista hieman myöhemmin.

Siksi on hieman sekavaa, että Gitissä on `mv`-komento. Jos haluat nimetä tiedoston uudelleen Gitissä, voit ajaa jotakuinkin seuraavasti

	$ git mv lähdetiedosto kohdetiedosto

ja se toimii hienosti. Itse asiassa, jos ajat jotakuinkin tällä tavalla ja katsot tilaa, näet Gitin pitävän sitä uudelleennimettynä tiedostona:

	$ git mv README.txt README
	$ git status
	# On branch master
	# Your branch is ahead of 'origin/master' by 1 commit.
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       renamed:    README.txt -> README
	#

Tämä on kuitenkin sama, kuin ajaisit seuraavasti:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git ymmärtää sen olevan uudelleennimeäminen epäsuorasti, joten ei ole väliä, nimeätkö tiedoston uudelleen tällä tavalla vai `mv`-komennolla. Ainoa todellinen ero on, että `mv` on yksi komento kolmen sijaan — se on helppokäyttötoiminto. Tärkeämpää, voit käyttää tiedoston uudelleennimeämiseen mitä työkalua haluat ja käsitellä add/rm myöhemmin, ennen kuin teet pysyvän muutoksen.
