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
# Git op de server

Je zou nu de alledaagse taken waarvoor je Git zult gebruiken moeten kunnen uitvoeren. Echter, om enige vorm van samenwerking te hebben in Git is een remote Git repository nodig. Technisch gezien kun je wijzigingen pushen en pullen van individuele repositories, maar dat wordt afgeraden omdat je vrij gemakkelijk het werk waar anderen mee bezig zijn in de war kunt schoppen als je niet oppast. Daarnaast wil je dat je medewerkers de repository kunnen bereiken, zelfs als jouw computer van het netwerk is; het hebben van een betrouwbare gezamenlijke repository is vaak handig. De voorkeursmethode om met iemand samen te werken is om een tussenliggende repository in te richten waar beide partijen toegang tot hebben en om daar naartoe te pushen en vandaan te pullen. We zullen deze repository de "Git server" noemen, maar je zult zien dat het over het algemeen maar weinig systeembronnen kost om een Git repository te verzorgen, dus je zult er zelden een complete server voor nodig hebben.

Een Git server draaien is eenvoudig. Als eerste kies je met welke protocollen je de server wilt laten communiceren. In het eerste gedeelte van dit hoofdstuk zullen we de beschikbare protocollen bespreken met de voor- en nadelen van elk. De daarop volgende paragrafen zullen we een aantal veel voorkomende opstellingen bespreken die van die protocollen gebruik maken en hoe je je server ermee kunt opzetten. Als laatste laten we een paar servers van derden zien, als je het niet erg vindt om je code op de server van een ander te zetten en niet het gedoe wilt hebben van het opzetten en onderhouden van je eigen server.

Als je niet van plan bent om je eigen server te draaien, dan kun je de direct naar de laatste paragraaf van dit hoofdstuk gaan om wat mogelijkheden van online accounts te zien en dan door gaan naar het volgende hoofdstuk, waar we diverse zaken bespreken die komen kijken bij het werken met een gedistribueerde versiebeheer omgeving.

Een remote repository is over het algemeen een _bare repository_ (kale repository): een Git repository dat geen werkmap heeft. Omdat de repository alleen gebruikt wordt als een samenwerkingspunt, is er geen reden om een snapshot op de schijf te hebben; het is alleen de Git data. Een kale repository is eenvoudigweg de inhoud van de `.git` directory in je project, en niets meer.
