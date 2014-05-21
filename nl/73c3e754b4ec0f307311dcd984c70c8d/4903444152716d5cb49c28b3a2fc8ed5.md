# De basis van Git

Dus, wat is Git in een notendop? Dit is een belangrijke paragraaf om in je op te nemen, omdat, als je goed begrijpt wat Git is en de fundamenten van de interne werking begrijpt, het waarschijnlijk een stuk makkelijker wordt om Git effectief te gebruiken. Probeer, als je Git aan het leren bent, te vergeten wat je al weet over andere VCSen zoals Subversion en Perforce; zo kan je verwarring bij gebruik door de subtiele verschillen voorkomen. Git gaat op een hele andere manier met informatie om dan die andere systemen, ook al lijken de verschillende commando’s behoorlijk op elkaar. Als je die verschillen begrijpt, kan je voorkomen dat je verward raakt als je Git gebruikt.

## Momentopnames in plaats van verschillen

Een groot verschil tussen Git en elke andere VCS (inclusief Subversion en consorten) is hoe Git denkt over zijn data. Conceptueel bewaren de meeste andere systemen informatie als een lijst van veranderingen per bestand. Deze systemen (CVS, Subversion, Perforce, Bazaar, enzovoort) zien de informatie die ze bewaren als een aantal bestanden en de veranderingen die aan die bestanden zijn aangebracht over de tijd, zoals geïllustreerd in Figuur 1-4.


![](http://git-scm.com/figures/18333fig0104-tn.png)

Figuur 1-4. Andere systemen bewaren data meestal als veranderingen aan een basisversie van elk bestand.

Git ziet en bewaart zijn data heel anders. De kijk van Git op zijn data kan worden uitgelegd als een reeks momentopnames (snapshots) van een miniatuurbestandssysteem. Elke keer dat je ‘commit’ (de status van je project in Git opslaat) neemt het een soort van foto van hoe al je bestanden er op dat moment uitzien en slaat een verwijzing naar die foto op. Voor efficiëntie slaat Git ongewijzigde bestanden niet elke keer opnieuw op, alleen een verwijzing naar het eerdere identieke bestand dat het eerder al opgeslagen had. In Figuur 1-5 kan je zie hoe Git ongeveer over zijn data denkt.


![](http://git-scm.com/figures/18333fig0105-tn.png)

Figuur 1-5. Git bewaart data als momentopnames van het project.

Dat is een belangrijk onderscheid tussen Git en bijna alle overige VCSen. Hierdoor moet Git bijna elk aspect van versiebeheer heroverwegen, terwijl de meeste andere systemen het hebben overgenomen van voorgaande generaties. Dit maakt Git meer een soort mini-bestandssysteem met een paar ongelooflijk krachtige gereedschappen, in plaats van niets meer of minder dan een VCS. We zullen een paar van de voordelen die je krijgt als je op die manier over data denkt gaan onderzoeken, als we ‘branching’ (gesplitste ontwikkeling) toelichten in Hoofdstuk 3.

## Bijna alles is lokaal

De meeste handelingen in Git hebben alleen lokale bestanden en hulpmiddelen nodig. Normaalgesproken is geen informatie nodig van een andere computer in je netwerk. Als je gewend bent aan een CVCS, waar de meeste handelingen vertraagd worden door het netwerk, lijkt Git door de goden van snelheid begenadigd met onwereldse krachten. Omdat je de hele geschiedenis van het project op je lokale harde schijf hebt staan, lijken de meeste acties geen tijd in beslag te nemen.

Een voorbeeld: om de geschiedenis van je project te doorlopen hoeft Git niet bij een of andere server de geschiedenis van je project op te vragen; het leest simpelweg jouw lokale database. Dat betekent dat je de geschiedenis van het project bijna direct te zien krijgt. Als je de veranderingen wilt zien tussen de huidige versie van een bestand en de versie van een maand geleden kan Git het bestand van een maand geleden opzoeken en lokaal de verschillen berekenen, in plaats van aan een niet-lokale server te moeten vragen om het te doen, of de oudere versie van het bestand ophalen van een server om het vervolgens lokaal te doen.

Dit betekent dat er maar heel weinig is dat je niet kunt doen als je offline bent of zonder VPN zit. Als je in een vliegtuig of trein zit en je wilt nog even wat werken, kan je vrolijk doorgaan met commits maken tot je een netwerkverbinding hebt zodat je dat werk kunt uploaden. Als je naar huis gaat en je VPN client niet aan de praat krijgt kan je nog steeds doorwerken. Bij veel andere systemen is dat onmogelijk of zeer onaangenaam. Als je bijvoorbeeld Perforce gebruikt kun je niet zo veel doen als je niet verbonden bent met de server. Met Subversion en CVS kun je bestanden bewerken maar je kunt geen commits maken naar je database (omdat die offline is). Dat lijkt misschien niet zo belangrijk maar je zult nog versteld staan wat een verschil het kan maken.

## Git heeft integriteit

Alles in Git krijgt een controlegetal (‘checksum’) voordat het wordt opgeslagen en er wordt later met dat controlegetal ernaar gerefereerd. Dat betekent dat het onmogelijk is om de inhoud van een bestand of map te veranderen zonder dat Git er weet van heeft. Deze functionaliteit is in het diepste deel van Git ingebouwd en staat centraal in zijn filosofie. Je kunt geen informatie kwijtraken als het wordt verstuurd en bestanden kunnen niet corrupt raken zonder dat Git het kan opmerken.

Het mechanisme dat Git gebruikt voor deze controlegetallen heet een SHA-1-hash. Dat is een tekenreeks van 40 karakters lang, bestaande uit hexadecimale tekens (0–9 en a–f) en wordt berekend uit de inhoud van een bestand of directory-structuur in Git. Een SHA-1-hash ziet er ongeveer zo uit:

	24b9da6552252987aa493b52f8696cd6d3b00373

Je zult deze hashwaarden overal tegenkomen omdat Git er zoveel gebruik van maakt. Sterker nog, Git bewaart alles niet onder een bestandsnaam maar in de database van Git met de hash van de inhoud als sleutel.

## Git voegt normaal gesproken alleen data toe

Bijna alles wat je in Git doet, leidt tot toevoeging van data in de Git database. Het is erg moeilijk om het systeem iets te laten doen wat je niet ongedaan kan maken of het de gegevens te laten wissen op wat voor manier dan ook. Zoals met elke VCS kun je veranderingen verliezen of verhaspelen als je deze nog niet hebt gecommit; maar als je dat eenmaal hebt gedaan, is het erg moeilijk om die data te verliezen, zeker als je de lokale database regelmatig uploadt (‘push’) naar een andere repository.

Dit maakt het gebruik van Git zo plezierig omdat je weet dat je kunt experimenteren zonder het gevaar te lopen jezelf behoorlijk in de nesten te werken. Zie Hoofdstuk 9 voor een iets diepgaandere uitleg over hoe Git zijn data bewaart en hoe je de data die verloren lijkt kunt terughalen.

## De drie toestanden

Let nu goed op. Dit is het belangrijkste dat je over Git moet weten als je wilt dat de rest van het leerproces gladjes verloopt. Git heeft drie hoofdtoestanden waarin bestanden zich kunnen bevinden: gecommit (‘commited’), aangepast (‘modified’) en voorbereid voor een commit (‘staged’). Committed houdt in dat alle data veilig opgeslagen is in je lokale database. Modified betekent dat je het bestand hebt gewijzigd maar dat je nog niet naar je database gecommit hebt. Staged betekent dat je al hebt aangegeven dat de huidige versie van het aangepaste bestand in je volgende commit meegenomen moet worden.

Dit brengt ons tot de drie hoofdonderdelen van een Gitproject: de Git directory, de werk-directory, en de wachtrij voor een commit (‘staging area’)


![](http://git-scm.com/figures/18333fig0106-tn.png)
 
Figuur 1-6. Werk-directory, wachtrij en Git directory

De Git directory is waar Git de metadata en objectdatabase van je project opslaat. Dit is het belangrijkste deel van Git. Deze directory wordt gekopiëerd wanneer je een repository kloont vanaf een andere computer.

De werk directory is een checkout van een bepaalde versie van het project. Deze bestanden worden uit de gecomprimeerde database in de Git directory gehaald en op de harde schijf geplaatst waar jij ze kunt gebruiken of bewerken.

De wachtrij is een simpel bestand, dat zich normaalgesproken in je Git directory bevindt, waar informatie opgeslagen wordt over wat in de volgende commit meegaat. Het wordt soms de index genoemd, maar tegenwoordig wordt het de staging area genoemd.

De algemene workflow met Git gaat ongeveer zo:

1. Je bewerkt bestanden in je werk directory.
2. Je bereidt de bestanden voor (staged), waardoor momentopnames (snapshots) worden toegevoegd aan de staging area.
3. Je maakt een commit. Een commit neemt alle snapshots van de staging area en bewaart die voorgoed in je Git directory.

Als een bepaalde versie van een bestand in de Git directory staat, wordt het beschouwd als gecommit. Als het is aangepast, maar wel aan de staging area is toegevoegd, is het staged. En als het veranderd is sinds het was uitgechecked maar niet staged is, is het aangepast. In Hoofdstuk 2 leer je meer over deze toestanden en hoe je er je voordeel mee kunt doen, maar ook hoe je de staging area compleet over kunt slaan.
