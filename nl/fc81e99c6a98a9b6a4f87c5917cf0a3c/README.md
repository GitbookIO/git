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
# Branchen in Git

Bijna elk versiebeheersysteem ondersteunt een bepaalde vorm van branchen. Branchen komt erop neer dat je een tak afsplitst van de hoofd-ontwikkellijn en daar verder mee gaat werken zonder aan de hoofdlijn te komen. Bij veel VCS'en is dat nogal een duur proces, vaak wordt er een nieuwe kopie gemaakt van de directory waar je broncode in staat, wat lang kan duren voor grote projecten.

Sommige mensen verwijzen naar het branch model in Git als de "killer eigenschap", en het onderscheidt Git zeker in de VCS-gemeenschap. Waarom is het zo bijzonder? De manier waarop Git brancht is ongelooflijk lichtgewicht, waardoor branch operaties vrijwel instant zijn en het wisselen tussen de branches over het algemeen net zo snel. In tegenstelling tot vele andere VCS's, moedigt Git juist een workflow aan waarbij vaak gebrancht en gemerged wordt, zelfs meerdere keren per dag. Deze eigenschap begrijpen en de techniek beheersen geeft je een krachtig en uniek gereedschap en kan letterlijk de manier waarop je ontwikkelt veranderen.
