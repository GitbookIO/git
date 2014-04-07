# Gitin perusteet

Joten, mitä Git on pähkinänkuoressa? Tämä on tärkeä osa-alue omaksua, koska jos ymmärrät, mitä Git on, ja periaatteet kuinka se toimii, Gitin tehokas käyttö tulee mahdollisesti olemaan paljon helpompaa. Kun opettelet Gitin käyttöä, yritä tyhjentää mielesi asioista, joita mahdollisesti tiedät muista VCS:istä, kuten Subversionista ja Perforcesta; tämän tekeminen auttaa sinua välttämään hienoisen sekaantumisen kun käytät työkalua. Git säilyttää ja ajattelee informaatiota huomattavasti eri lailla kuin nämä muut järjestelmät, vaikkakin käyttöliittymä on melko samanlainen; näiden eroavaisuuksien ymmärtäminen auttaa sinua välttämään sekaantumisia käyttäessäsi Gitiä.

## Tilannekuvia, ei eroavaisuuksia

Suurin eroavaisuus Gitin ja minkä tahansa muun VCS:n (Subversion ja kumppanit mukaan lukien) välillä on tapa, jolla Git ajattelee dataansa. Käsitteellisesti moni muu järjestelmä varastoi informaatiotansa listana tiedostopohjaisista muutoksista. Nämä järjestelmät (CVS, Subversion, Perforce, Bazaar, ja niin edelleen) ajattelevat informaatiota jota ne varastoivat kokoelmana tiedostoja ja ajan kuluessa jokaiseen tiedostoon tehtyinä muutoksina, kuten on kuvattu Kuvassa 1-4.


![](http://git-scm.com/figures/18333fig0104-tn.png)

Kuva 1-4. Muut järjestelmät tapaavat varastoida dataa muutoksina, jokaisen tiedoston alkuperäiseen versioon.

Git ei ajattele tai varastoi dataansa tällä tavalla. Sen sijaan Git ajattelee dataansa enemmän kokoelmana tilannekuvia pikkuruisesta tiedostojärjestelmästä. Joka kerta, kun sinä teet pysyvän muutoksen (commitin), tai tallennat projektisi tilan Gitissä, Git ottaa periaatteessa kuvan siitä, miltä sinun tiedostosi näyttävät kyseisellä hetkellä, ja varastoi viitteen tähän tilannekuvaan. Ollakseen tehokas, jos tiedostoa ei ole muutettu, Git ei varastoi sitä uudestaan - vaan linkittää sen edelliseen identtiseen tiedostoon, jonka se on jo varastoinut. Git ajattelee dataansa enemmän kuten Kuva 1-5 osoittaa.


![](http://git-scm.com/figures/18333fig0105-tn.png)

Kuva 1-5. Git varastoi dataa projektin tilannekuvina ajan kuluessa.

Tämä on tärkeä ero Gitin ja melkein minkä tahansa muun VCS:n välillä. Se laittaa Gitin harkitsemaan uudelleen melkein jokaista versionhallinnan aspektia, jotka monet muut järjestelmät kopioivat edeltäneestä sukupolvesta. Tämä tekee Gitistä kuin pikkuruisen tiedostojärjestelmän, jolla on muutamia uskomattoman tehokkaita työkaluja päälle rakennettuna, ennemmin kuin simppelin VCS:n. Me tutkimme joitain hyötyjä, joita saavutat ajattelemalla datastasi tällä tavoin, kun käsittelemme Gitin haarautumista Luvussa 3.

## Lähes jokainen operaatio on paikallinen

Monet operaatiot Gitissä tarvitsevat ainoastaan paikallisia tiedostoja ja resursseja operoidakseen - yleensä mitään informaatiota toiselta koneelta tietoverkostasi ei tarvita. Jos olet tottunut CVCS:ään, joissa suurin osa operaatioista sisältää tietoverkon viiveen, tämä Gitin aspekti laittaa sinut ajattelemaan, että nopeuden jumalat ovat siunanneet Gitin sanoinkuvaamattomilla voimilla. Koska sinulla on projektisi koko historia paikallisella levylläsi, suurin osa operaatioista näyttää melkein välittömiltä.

Esimerkiksi, selataksesi projektisi historiaa, Gitin ei tarvitse mennä ulkoiselle palvelimelle ottaakseen historian ja näyttääkseen sen sinulle - se yksinkertaisesti lukee sen suoraan sinun paikallisesta tietokannastasi. Tämä tarkoittaa sitä, että näet projektin historian melkein välittömästi. Jos haluat nähdä muutokset tiedoston nykyisen version ja kuukausi sitten olleen version välillä, Git voi katsoa tiedoston tilannekuvan kuukausi sitten ja tehdä paikallisen muutoslaskelman, sen sijaan, että sen pitäisi joko kysyä etäpalvelimelta sitä tai että sen tarvitsisi vetää vanhempi versio etäpalvelimelta, jotta se voisi tehdä sen paikallisesti.

Tämä myös tarkoittaa sitä, että on hyvin vähän asioita joita et voi tehdä, jos olet yhteydetön tai poissa VPN:stä. Jos nouset lentokoneeseen tai junaan ja haluat tehdä vähän töitä, voit iloisesti tehdä pysyviä muutoksia kunnes saat tietoverkon takaisin ja voit lähettää muutoksesi. Jos menet kotiin etkä saa VPN-asiakasohjelmaasi toimimaan oikein, voit yhä työskennellä. Monissa muissa järjestelmissä tämän tekeminen on joko mahdotonta tai kivuliasta. Esimerkiksi Perforcessa et voi tehdä paljoa mitään, silloin kun et ole yhteydessä palvelimeen; Subversionissa ja CVS:ssä voit editoida tiedostojasi, mutta et voi tehdä pysyviä muutoksia tietokantaasi (koska tietokantasi on yhteydetön). Tämä kaikki saattaa vaikuttaa siltä, ettei se ole nyt niin suuri juttu, mutta saatat yllättyä kuinka suuren muutoksen se voi tehdä.

## Git on eheä

Kaikki Gitissä tarkistussummataan ennen kuin se varastoidaan ja tämän jälkeen viitataan tällä tarkistussummalla. Tämä tarkoittaa, että on mahdotonta muuttaa minkään tiedoston sisältöä tai kansiota ilman, ettei Git tietäisi siitä. Tämä toiminnallisuus on rakennettu Gitiin alimmalla tasolla ja se on kiinteä osa sen filosofiaa. Et voi menettää informaatiota tiedonsiirrossa tai saada tiedostoihisi korruptiota ilman, ettei Git pystyisi sitä huomaamaan.

Mekanismi, jota Git käyttää tarkistussummaan, on kutsuttu SHA-1-tarkisteeksi. Tämä on 40-merkkinen merkkijono, joka koostuu heksadesimaalimerkeistä (0-9 ja a-f) ja joka on Gitissä laskettu tiedoston sisältöön tai hakemisto rakenteeseen pohjautuen. SHA-1-tarkiste voi näyttää tällaiselta:

	24b9da6552252987aa493b52f8696cd6d3b00373

Voit nähdä nämä tarkistearvot joka puolella Gitissä, koska se käyttää niitä niin paljon. Itse asiassa, Git varastoi kaiken, ei pohjautuen tiedoston nimeen, vaan Gitin tietokantaan osoitteistavaan sisällön tarkistearvoon.

## Git yleensä vain lisää dataa

Kun teet toimintoja Gitissä, melkein kaikki niistä ainoastaan lisäävät dataa Gitin tietokantaan. On erittäin vaikea saada järjestelmä tekemään mitään, mikä olisi kumoamaton, tai saada se poistamaan dataa millään tavoin. Kuten missä tahansa VCS:ssä, voit menettää tai sotkea muutoksia, joita ei ole vielä tehty pysyviksi; mutta sen jälkeen, kun teet pysyvän tilannekuvan muutoksen Gitiin, se on erittäin vaikeaa hävittää etenkin, jos sinä säännöllisesti työnnät tietokantasi toiseen tietolähteeseen.

Tämä tekee Gitin käyttämisestä hauskaa, koska me tiedämme, että voimme kokeilla erilaisia asioita ilman vaaraa, että sotkisimme vakavasti versionhallintamme. Syväluotaavamman tarkastelun siihen, miten Git varastoi dataansa ja kuinka voit palauttaa datan, joka näyttää hävinneeltä, katso Luku 9.

## Kolme tilaa

Lue nyt huolellisesti. Tämä on pääasia muistaa Gitistä, jos sinä haluat lopun opiskeluprosessistasi menevän sulavasti. Gitillä on kolme pääasiallista tilaa, joissa tiedostosi voivat olla: pysyvästi muutettu (commited), muutettu (modified), ja lavastettu (staged). Pysyvästi muutettu tarkoittaa, että data on turvallisesti varastoitu sinun paikalliseen tietokantaasi. Muutettu tarkoittaa, että olet muuttanut tiedostoa, mutta et ole tehnyt vielä pysyvää muutosta tietokantaasi. Lavastettu tarkoittaa, että olet merkannut muutetun tiedoston nykyisessä versiossaan menemään seuraavaan pysyvään tilannekuvaan.

Tämä johdattaa meidät kolmeen seuraavaan osaan Git-projektia: Git-hakemisto, työskentelyhakemisto, ja lavastusalue.


![](http://git-scm.com/figures/18333fig0106-tn.png)

Kuva 1-6. Työskentelyhakemisto, lavastusalue, ja Git-hakemisto.

Git-hakemisto on paikka, johon Git varastoi metadatan ja oliotietokannan projektillesi. Tämä on kaikkein tärkein osa Gitiä, ja se sisältää sen, mitä kopioidaan, kun kloonaat tietovaraston toiselta tietokoneelta.

Työskentelyhakemisto on yksittäinen tiedonhaku yhdestä projektin versiosta. Nämä tiedostot vedetään ulos pakatusta tietokannasta Git-hakemistosta ja sijoitetaan levylle sinun käytettäväksesi tai muokattavaksesi.

Lavastusalue on yksinkertainen tiedosto, yleensä se sisältyy Git-hakemistoosi, joka varastoi informaatiota siitä, mitä menee seuraavaan pysyvään muutokseen. Sitä viitataan joskus indeksiksi, mutta on tulossa standardiksi viitata sitä lavastusalueeksi.

Normaali Git-työnkulku menee jokseenkin näin:

1. Muokkaat tiedostoja työskentelyhakemistossasi.
2. Lavastat tiedostosi, lisäten niistä tilannekuvia lavastusalueellesi.
3. Teet pysyvän muutoksen, joka ottaa tiedostot sellaisina, kuin ne ovat lavastusalueella, ja varastoi tämän tilannekuvan pysyvästi sinun Git-tietolähteeseesi.

Jos tietty versio tiedostosta on Git-hakemistossa, se on yhtä kuin pysyvä muutos. Jos sitä on muokattu, mutta se on lisätty lavastusalueelle, se on lavastettu. Ja jos se on muuttunut siitä, kun se on haettu, mutta sitä ei ole lavastettu, se on muutettu. Luvussa 2 opit enemmän näistä tiloista ja kuinka voit hyödyntää niitä tai ohittaa lavastusosan kokonaan.
