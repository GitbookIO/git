# Versionhallinnasta

Mitä on versionhallinta ja miksi sinun pitäisi välittää siitä? Versionhallinta on järjestelmä, joka ajan kuluessa tallentaa muutoksia tiedostoon tai joukkoon tiedostoja, jotta sinä voit palata tiettyihin versioihin myöhemmin. Vaikka esimerkit tässä kirjassa näyttävät ohjelmiston lähdekoodia versiohallittavina tiedostoina, todellisuudessa mikä tahansa tiedosto tietokoneellasi voidaan asettaa versiohallittavaksi.

Jos sinä olet graafinen tai web suunnittelija ja haluat säilyttää jokaisen version kuvasta tai leiskasta (minkä sinä varmasti haluat), on erittäin viisasta käyttää versionhallintajärjestelmää (VCS). Se mahdollistaa sen, että voit palauttaa tiedoston takaisin edelliseen tilaan, palauttaa koko projektin takaisin edelliseen tilaan, katselmoida ajan kuluessa tehtyjä muutoksia, nähdä kuka viimeksi muokkasi jotain, mikä voi olla ongelman aiheuttaja, kuka esitteli ongelman ja milloin, ja muuta. VCS:n käyttö tarkoittaa pääasiassa sitä, että jos sinä sotket jotain tai menetät tiedostoja, voit helposti palautua edelliseen toimivaan tilaan. Lisäksi saat kaiken tämän erittäin vähällä ylläpidolla.

## Paikalliset versionhallintajärjestelmät

Monen ihmisen versionhallintaratkaisu on kopioida tiedostoja toiseen kansioon (ehkäpä aikaleimattu kansio, jos he ovat fiksuja). Tämä lähestymistapa on erittäin yleinen, koska se on niin yksinkertainen, mutta se on myös erittäin virhealtis. On helppo unohtaa missä hakemistossa olet ja epähuomiossa kirjoittaa väärään tiedostoon tai kopioida sellaisten tiedostojen päälle, joihin et tarkoittanut koskea.

Tämän ongelman ratkaisemiksi ohjelmoijat kehittivät kauan sitten paikallisen VCS:n, jolla oli yksinkertainen tietokanta, joka piti kaikki tiedostojen muutokset muutostenhallinnan alla (katso Kuva 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)

Kuva 1-1. Paikallinen versionhallinta -diagrammi.

Yksi suosituimmista VCS-työkaluista oli rcs:ksi kutsuttu järjestelmä, joka yhä tänä päivänä toimitetaan monen tietokoneen mukana. Jopa suosittu Mac OS X -käyttöjärjestelmä sisältää rcs-komennon Developer Tools -paketin asennuksen jälkeen. Tämä työkalu toimii periaatteessa pitämällä pätsikokoelmia (muutoksia tiedostojen välillä) yhdestä korjauksesta toiseen erikoisformaatissa kiintolevyllä; se voi täten luoda uudelleen sen, miltä mikä tahansa tiedosto näytti millä tahansa ajanhetkellä lisäämällä kaikki tarvittavat pätsit.

## Keskitetyt versionhallintajärjestelmät

Seuraava suuri ongelma, mihin ihmiset törmäävät, on, että heillä on tarve tehdä yhteistyötä muissa järjestelmissä olevien kehittäjien kanssa. Tämän ongelman ratkaisemiseksi luotiin keskitetyt versionhallintajärjestelmät (CVCS). Nämä järjestelmät, kuten CVS, Subversion ja Perforce, omaavat yksittäisen palvelimen, joka sisältää kaikki versioidut tiedostot, ja asiakkaita, jotka hakevat tiedostot tästä keskitetystä paikasta. Monet vuodet tämä on ollut versionhallinnan standardi (katso Kuva 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)

Kuva 1-2. Keskitetty versionhallinta -diagrammi.

Tämä asetelma tarjoaa monta etua, erityisesti paikalliseen VCS:n verrattuna. Esimerkiksi, jokainen tietää jossain määrin, mitä kukin projektissa oleva tekee. Järjestelmänvalvojilla on hienosäädetty kontrolli siihen, mitä kukin voi tehdä; ja on paljon helpompi valvoa CVCS:ää, kuin toimia jokaisen asiakkaan paikallisen tietokannan kanssa.

Tässä asetelmassa on kuitenkin myös muutama vakava haittapuoli. Kaikkein selvin on keskitetty vikapiste, jota keskitetty palvelin edustaa. Jos kyseessä oleva palvelin ajetaan alas tunniksi, tämän tunnin aikana kukaan ei pysty tekemään yhteistyötä keskenään tai tallentamaan versioituja muutoksia mihinkään, mitä he työstävät. Jos kiintolevy - jolla keskitetty tietokanta sijaitsee - korruptoituu, ja kunnollisia varmuuskopioita ei ole hallussa, menetät täysin kaiken - koko projektin historian, paitsi ne yksittäiset tilannekuvat, joita ihmisillä sattuu olemaan heidän paikallisilla koneillaan. Paikalliset VCS-järjestelmät kärsivät tästä samasta ongelmasta - milloin tahansa sinulla on koko projektin historia yhdessä paikassa, sinulla on riski menettää se kaikki.

## Hajautetut versionhallintajärjestelmät

Tässä kohdassa hajautetut versionhallintajärjestelmät (DVCS) astuvat mukaan. DVCS:ssä (kuten Git, Mercurial, Bazaar tai Darcs) asiakkaat eivät vain hae viimeisintä tilannekuvaa tiedostoista: ne peilaavat täysin koko tietolähteen. Täten, jos mikä tahansa palvelin kuolee, ja nämä järjestelmät tekivät yhteistyötä sen kautta, mikä tahansa asiakastietolähde pystytään kopioimaan takaisin palvelimelle tiedon palauttamiseksi. Jokainen tiedonhaku on todellisuudessa täysi varmuuskopio kaikesta datasta (katso Kuva 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)

Kuva 1-3. Hajautettu versionhallinta -diagrammi.

Lisäksi monet näistä järjestelmistä selviytyvät melko hyvin siitä, että niillä on monia etätietolähteitä, joiden kanssa ne voivat työskennellä, joten sinä voit tehdä monenlaista yhteistyötä monenlaisien ihmisryhmien kanssa samaan aikaan samassa projektissa. Tämä mahdollistaa sen, että voit aloittaa monenlaisia työnkulkuja, jotka eivät ole mahdollisia keskitetyissä järjestelmissä, kuten hierarkkiset mallit.
