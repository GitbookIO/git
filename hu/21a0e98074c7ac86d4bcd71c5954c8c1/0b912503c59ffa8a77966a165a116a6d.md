# A verziókövetésről

Mi az a verziókövetés, és miért kellene vele törődnünk? A verziókövető rendszer nyílvántartja egy file vagy fájlok gyűjteményén időről-időre végzett módosításokat és bármelyik verzióhoz hozzáférhetünk a segítségével. A könyvben szereplő példában egy program forráskódot verziókövetünk, a való világban szinte bármilyen a számítógépen található fájlal meg tehető.

Ha grafikus vagy webdizájner vagy és meg akarod tartani az összes verzióját egy képnek vagy egy weboldal tervezetnek (amit mindenképp szeretnél), egy Verziókövető Rendszer (VR) legalkalmasabb dolog a feladatra. Lehetővé teszi fájlok visszaálítást egy előző verzióra, a teljes projekt visszaállítását egy előző verzióra, változatok összehasonlítását bármely idő intervalimra, rájöhetsz miért okoz az utolsó módsításod problémát, hogyan keletkezik egy esemény és miért és így tovább. A VR használata az is jelenti ha elrontasz valamit vagy elveszne egy fájl könnyedén visszavonhatod minimális erőforrás ráfordítással.

## Egyéni verziókövető rendszerek 

Sok ember választja verziókövető megoldásnak a fájlok különböző mappákba másolását (mappák neve egy időbélyeg ha értelmesen csinálják). Ez a legkönnyebben befogadható megoldás mert egyszerű, de hihetetlenül könnyű hibázni. Elfelejtik hogy melyik mappában vannak rossz fájlt írnak vagy írnakfelül olyat amit nem kellett volna.

Régebben a probléma megoldására a programozók egyéni VR-eket fejlesztettek, aminek volt egy egyszerű adatbázisa amiben követte a fájlok egyes verzióit (Lásd 1-1 ábra).


![](http://git-scm.com/figures/18333fig0101-tn.png)

1-1 ábra. Egyéni verziókövetés sematikus ábrája.

Az egyik legnébszerűbb VR a sok közül az rcs, ami még mindig sok számítógépen megtalálható. A népszerű Mac OS X operációs rendszer is tartalmazza, ha feltelpítjük a Fejlesztő Eszközöket. Ez az eszköz egyszerűen folt (patch) készleteket (a fájlok verziók közötti különbségégek összesége) tárol minden egyes változás egy speciális formátumban a merevlemezen; a fájlok bármely állapotra visszaállíthatóak a foltok segítségével.

## Központosított verziókövető rendszerek

Az embereknek szembesülnie kellet azzal a problémával, hogy együtt kell működniük más fejesztőkkel akik más-más rendszereket használták. A probléma megoldását a központosított verzióküvető rendszerek (KVR) kifejlesztése kívánta meg. Ezek a rendszerek, úgymint a CVS, a Subversion (SVN) és a Prefoce, egy darab központi szerveren tárolják az összes verziókövetett fájlt, a kliensek pedig ebből a központi tárolóból kérik le azokat. Sok évig ezt jelentette "A verziókövetést" (Lásd 1-2 ábra).


![](http://git-scm.com/figures/18333fig0102-tn.png)

1-2 ábra. Központi verziókövetés sematikus ábrája.

Ez az összeállítás rengeteg előnnyel rendelkezett, különös képpen az egyéni VR-kel szemben. Példának okáért, mindenki pontosan tudta ki mit csinál a projekten belül. Az adminisztrátorok teljes körüen irányítusk alatt tarthatják ki, mit és hogyan tehet meg; nagyságrendekkel könnyebb adminisztrálni egy KVR-t mint ha az összes kliens lokális adatbázisait kellene.

Ugyanakkor ez az összeállításnak van néhány komoly hátránya. A legnyílvánvalóbb "single point of faliure"-t a központi szerver jelenti. Ha a szerver nem működik egy órán keresztül, akkor senki sem tud együttműködni vagy verziókövetni a változásait amin éppen dolgozott. Ha a központi szerver lemezen adatvesztés lép fel és nincs megfelelő mentésróla, mindent elveszíthetsz a projekt teljes történetét kivéve persze az egyes emberek egyéni másolatait ami a saját gépeiken található. Az egyéni VR rendszereket is veszélyezteti ez a veszély mivel mindent lokálisan egyetlen helyen tárolnak, megvan a veszélye hogy mindent elvíthetsz.

## Elosztott verziókövető rendszerek

Ekkor jöttek az Elosztott Verziókövető Rendszerek (EVR). Az EVR-ekben, mint a Git, a Mercurical, a Bazaar vagy a Dracs, a kliensek nem csak a legutolsó állapotot kérik le, hanem a teljes repositorit. Ekéépen ha a szerver megáll, amin eddig folyt az együttműködés, bármelyik kliens repositoriból vissza állítható a teljes adatbázis. Minden adat lekérés tényleg teljes mentésnek felel meg (Lásd 1-3 ábra).


![](http://git-scm.com/figures/18333fig0103-tn.png)

1-3 ábra. Elosztott verziókövetés sematikus ábrája.

Ezenkívül, a legtöbb ilyen rendszer támogatja a több távoli repositori elérését, így lehetővé válik számunkra hogy több különböző csoportokkal különböző módun tudjanak együtműködni ugyaz azon a projekt keretein belül. Így lehetőség van több munkafolyamat (workflow) alkamazására, ami egy centralizát hiearchiskus modelben elképzelhetetlen.
