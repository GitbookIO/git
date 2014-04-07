<!-- Attentie heren en dames vertalers.
Ik zou het volgende willen voorstellen:
Er zijn bepaalde termen die voor de gemiddelde Nederlandse computer gebruiker 
veel beter klinken (of bekender voorkomen) als de orginele Engelse term. In het
begin zullen deze termen niet vaak voorkomen, maar in de meer diepgaandere 
hoofdstukken komen deze steeds meer voor. Termen als "Committen", "Mergen" 
en "Applyen" klinken beter dan "Plegen" of "Toepassen", "Samenvoegen" en 
"Toepassen" (wat bovendien slecht valt te onderscheiden van de 
commit-toepassing). De mensen die dit boek lezen zijn, naar mijn bescheiden 
inschatting, al redelijk op de hoogte van versiebeheer en passen (zie ik in 
de praktijk) deze termen al toe. Een nieuwe terminologie introduceren lijkt 
me dan ook niet noodzakelijk.
Verder blijven er altijd kreten over als "directory", wat vertaald zou kunnen 
worden als "map", maar bij het Engelse werkwoord to map krijgen we dan weer het
probleem: hoe dit weer te vertalen? Daarom zou ik willen voorstellen om deze 
basis-termen toch onvertaald te laten.

Twijfelgevallen zullen altijd blijven zoals de term "file", daarvan wordt in de
praktijk zowel de term file als bestand gebruikt. Ik denk dat we hier moeten 
kijken hoe het in de context past. 
Maar ook een term als "tool" en (ik zit zelf nog op een mooie Nederlandse term
te broeden) "plumbing", hierbij stel ik voor om eenmalig een Nederlandse 
vertaling te geven, tussen haakjes de Engelse term te geven en in het vervolg
de Engelse term te gebruiken. Wederom is de context hier belangrijk.

Verder stel ik ook voor om de regels op https://onzetaal.nl/taaladvies zoveel
mogelijk te volgen. Bijvoorbeeld de regels omtrent het spellen van Engelse 
werkwoorden die in het Nederlands gebruikt worden.

Let wel: ik wil niemand tot iets verplichten, maar ik denk dat we moeten 
streven naar een zo duidelijk mogelijke en best bij de praktijk aansluitende
vertaling moeten proberen te maken.

Veel succes en plezier bij het vertalen...
-->
<!-- SHA-1 of last checked en-version: fbf24105 -->
# Het binnenwerk van Git

Je zult misschien naar dit hoofdstuk gesprongen zijn vanuit een voorafgaand hoofdstuk, of je zult hier gekomen zijn nadat je de rest van het boek gelezen hebt; hoe dan ook, hier is waar het binnenwerk en implementatie van Git behandeld gaat worden. Ik heb gemerkt dat het leren van deze informatie van fundamenteel belang is om te begrijpen hoe bruikbaar en krachtig Git is, maar anderen hebben daar tegenin gebracht dat het erg verwarrend en onnodig complex kan zijn voor beginners. Daarom heb ik de behandeling hiervan het laatste hoofdstuk gemaakt in het boek, zodat je kunt besluiten om het het vroeg of later in je leerproces kunt lezen. Ik laat het aan jou over om dat te beslissen.

Maar, nu je hier bent, laten we beginnen. Ten eerste, mocht het nog niet duidelijk zijn geworden, Git is eigenlijk een inhouds-adresseerbaar bestandssysteem met een gebruikersinterface voor versiebeheer er bovenop geschreven. Je zult over een poosje meer leren wat dit inhoudt.

In de eerste dagen van Git (voornamelijk pre 1.5), was de gebruikersinterface veel complexer, omdat de nadruk lag op dit bestandssysteem aspect in plaats van een gepolijste VCS. De laatste paar jaren is de interface verfijnd totdat het zo netjes en eenvoudig te gebruiken is als een willekeurig ander systeem; maar vaak blijft het stereotype hangen van de vroegere Gitinterface die complex was en moeilijk te leren.

Deze laag met het inhouds-toegankelijke bestandssysteem is ongelofelijk gaaf, dus dat behandel ik dat als eerste dit hoofdstuk; daarna leer je over de transportmechanismen en het onderhoudentaken van repository's, iets waar je uiteindelijk mee te maken kunt krijgen.
