# Gehoste Git

Als je niet al het werk wilt doen om je eigen Git server op te zetten, heb je meerdere opties om je Git project op een externe speciale hosting pagina te laten beheren. Dit biedt een aantal voordelen: een ge-hoste pagina is over het algemeen snel in te stellen, eenvoudig om projecten mee op te starten, en er komt geen serverbeheer en -onderhoud bij kijken. Zelfs als je je eigen server intern opgezet hebt, zul je misschien een publieke host pagina voor je open source broncode willen – dat is over het algemeen makkelijker voor de open source commune te vinden en je er mee te helpen.

Vandaag de dag heb je een enorm aantal beheer opties om uit te kiezen, elk met verschillende voor- en nadelen. Om een recente lijst te zien, ga dan kijken op de volgende pagina :

	https://git.wiki.kernel.org/index.php/GitHosting

Omdat we ze niet allemaal kunnen behandelen, en omdat ik toevallig bij een ervan werk, zullen we deze paragraaf gebruiken het instellen van een account en het opzetten van een project op GitHub te doorlopen. Dit geeft je een idee van het benodigde werk.

GitHub is verreweg de grootste open source Git beheer site en het is ook een van de weinige die zowel publieke als privé hosting opties biedt, zodat je je open source en commerciële privé code op dezelfde plaats kunt bewaren. Als voorbeeld: we hebben GitHub gebruikt om privé samen te werken aan dit boek.

## GitHub

GitHub verschilt een beetje van de meeste code-beheer pagina's in de manier waarop het de projecten een benoemt. In plaats dat het primair gebaseerd is op het project, stelt GitHub gebruikers centraal. Dat betekent dat als ik mijn `grit` project op GitHub beheer, je het niet zult vinden op `github.com/grit` maar in plaats daarvan op `github.com/schacon/grit`. Er is geen allesoverheersende versie van een project, wat een project in staat stelt om naadloos van de ene op de andere gebruiker over te gaan als de eerste auteur het project verlaat.

GitHub is ook een commercieel bedrijf dat geld vraagt voor accounts die privé repositories beheren, maar iedereen kan snel een gratis account krijgen om net zoveel open source projecten te beheren als ze willen. We zullen er snel doorheen lopen hoe je dat doet.

## Een gebruikersaccount instellen

Het eerste dat je moet doen is een gratis gebruikers account aanvragen. Als je de Pricing and Signup pagina op `http://github.com/plans` bezoekt en de "Sign Up" knop aanklikt op het Free account (zie figuur 4-2), dan wordt je naar de inteken pagina gebracht.


![](http://git-scm.com/figures/18333fig0402-tn.png)

Figuur 4-2. De GitHub plan pagina.

Hier moet je een gebruikersnaam kiezen die nog niet gebruikt is in het systeem, en een e-mail adres invullen dat bij het account hoort, en een wachtwoord (zie Figuur 4-3).


![](http://git-scm.com/figures/18333fig0403-tn.png)

Figuur 4-3. Het GitHub gebruikers inteken formulier.

Als je account beschikbaar is, is dit een goed moment om je publieke SSH sleutel ook toe te voegen. We hebben het genereren van een nieuwe sleutel eerder behandeld, in de "Je Publieke SSH Sleutel Genereren" paragraaf. Neem de inhoud van de publieke sleutel van dat paar, en plak het in het SSH publieke sleutel tekstveld. Door op de "explain ssh keys" link te klikken wordt je naar gedetaileerde instructies gebracht die je vertellen hoe dit te doen op alle veelvoorkomende besturingssystemen.
Door op de "I agree, sign me up" knop te klikken wordt je naar het dashboard van je nieuwe gebruikers gebracht (zie Figuur 4-4).


![](http://git-scm.com/figures/18333fig0404-tn.png)

Figuur 4-4. Het GitHub gebruikers dashboard.

Vervolgens kun je een nieuw repository aanmaken.

## Een nieuw repository aanmaken

Start door op de "create a new one" link te klikken naast Your Repositories op het gebruikers dashboard. Je wordt naar het Create a New Repository formulier gebracht (zie Figuur 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)

Figuur 4-5. Een nieuw repository aanmaken op GitHub.

Het enige dat je eigenlijk moet doen is een projectnaam opgeven, maar je kunt ook een beschrijving toevoegen. Wanneer je dat gedaan hebt, klik je op de "Create Repository" knop. Nu heb je een nieuw repository op GitHub (zie Figuur 4-6).


![](http://git-scm.com/figures/18333fig0406-tn.png)

Figuur 4-6. GitHub project hoofd informatie.

Omdat je er nog geen code hebt, zal GitHub je de instructies tonen hoe je een splinternieuw project moet aanmaken, een bestaand Git project moet pushen, of een project van een publieke Subversion repository moet importeren (zie Figuur 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)

Figuur 4-7. Instructies voor een nieuwe repository.

Deze instructies zijn vergelijkbaar met wat we al hebben laten zien. Om een project te initialiseren dat nog geen Git project is, gebruik je

	$ git init
	$ git add .
	$ git commit -m 'initial commit'

Als je een lokaal Git repository hebt, voeg dan GitHub als remote toe en push je master branch:

	$ git remote add origin git@github.com:testinguser/iphone_project.git
	$ git push origin master

Nu wordt je project gehost op GitHub, en kun je de URL aan iedereen geven waarmee je je project wilt delen. In dit geval is het `http://githup.com/testinguser/iphone_project`. Je kunt aan het begin van elk van je project pagina's zien dat je twee Git URLs hebt (zie Figuur 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)

Figuur 4-8. Project met een publieke URL en een privé URL.

De Public Clone URL is een publieke alleen-lezen Git URL, waarmee iedereen het project kan clonen. Deel deze URL door 'm op je website neer te zetten of welke manier dan ook.

De Your Clone URL is een lees/schrijf SSH-gebaseerde URL waar je alleen over kunt lezen of schrijven als je connectie maakt met de privé SSH sleutel die geassocieerd is met de publieke sleutel die je voor jouw gebruiker geüpload hebt. Wanneer andere gebruikers deze project pagina bezoeken, zullen ze die URL niet zien – alleen de publieke.

## Importeren vanuit Subversion

Als je een bestaande publiek Subversion project hebt dat je in Git wilt importeren, kan GitHub dat vaak voor je doen. Aan de onderkant van de instructies pagina staat een link naar een Subversion import. Als je die aanklikt, zie je een formulier met informatie over het importeer proces een een tekstveld waar je de URL van je publieke Subversion project in kan plakken (zie Figuur 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)

Figuur 4-9. Subversion importeer interface.

Als je project erg groot is, niet standaard, of privé, dan zal dit proces waarschijnlijk niet voor je werken. In Hoofdstuk 7 zul je leren om meer gecompliceerde handmatige project imports te doen.

## Medewerkers toevoegen

Laten we de rest van het team toevoegen. Als John, Josie en Jessica allemaal intekenen voor accounts op GitHub, en je wilt ze push toegang op je repository geven, kun je ze aan je project toevoegen als medewerkers. Door dat te doen zullen pushes vanaf hun publieke sleutels werken.

Klik de "edit" knop of de Admin tab aan de bovenkant van het project, om de Admin pagina te bereiken van je GitHub project (zie Figuur 4-10).


![](http://git-scm.com/figures/18333fig0410-tn.png)

Figuur 4-10. GitHub administratie pagina.

Om een andere gebruiker schrijftoegang tot je project te geven, klik dan de "Add another collaborator" link. Er verschijnt een nieuw tekstveld, waarin je een gebruikersnaam kunt invullen. Op het moment dat je typt, komt er een hulp tevoorschijn, waarin alle mogelijke overeenkomende gebruikersnamen staan. Als je de juiste gebruiker vindt, klik dan de Add knop om die gebruiker als een medewerker aan je project toe te voegen (zie Figuur 4-11). 


![](http://git-scm.com/figures/18333fig0411-tn.png)

Figuur 4-11. Een medewerker aan je project toevoegen.

Als je klaar bent met medewerkers toevoegen, dan zou je een lijst met de namen moeten zien in het Repository Collaborators veld (zie Figuur 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)

Figuur 4-12. Een lijst met medewerkers aan je project.

Als je toegang van individuen moet intrekken, dan kun je de "revoke" link klikken, en dan wordt hun push toegang ingetrokken. Voor toekomstige projecten, kun je ook groepen medewerker kopiëren door de permissies van een bestaand project te kopiëren.

## Je project

Nadat je je project gepusht hebt, of geïmporteerd vanuit Subversion, heb je een hoofd project pagina die er uitziet zoals Figuur 4-13.


![](http://git-scm.com/figures/18333fig0413-tn.png)

Figuur 4-13. Een GitHub project hoofdpagina.

Als mensen je project bezoeken, zien ze deze pagina. Het bevat tabs naar de verschillende aspecten van je projecten. De Commits tab laat een lijst van commits in omgekeerde chronologische volgorde zien, vergelijkbaar met de output van het `git log` commando. De Network tab toont alle mensen die je project hebben geforked en bijgedragen hebben. De Downloads tab staat je toe project binaries te uploaden en naar tarballs en gezipte versies van ieder getagged punt in je project te linken. De Wiki tab voorziet in een wiki waar je documentatie kunt schrijven of andere informatie over je project. De Graphs tab heeft wat contributie visualisaties en statistieken over je project. De hoofd Source tab waarop je binnen komt, toont de inhoud van de hoofddirectory van je project en toont automatisch het README bestand eronder als je er een hebt. Deze tab toont ook een veld met de laatste commit informatie.

## Projecten forken

Als je aan een bestaand project waarop je geen push toegang hebt wilt bijdragen, dan moedigt GitHub het forken van een project toe. Als je op een project pagina belandt die interessant lijkt en je wilt er een beetje op hacken, dan kun je de "fork" knop klikken aan de bovenkant van het project om GitHub dat project te laten kopiëren naar jouw gebruiker zodat je er naar kunt pushen.

Op deze manier hoeven projecten zich geen zorgen te maken over het toevoegen van medewerkers om ze push toegang te geven. Mensen kunnen een project forken en ernaar pushen, en de hoofdbeheerder van het project kan die wijzigingen pullen door ze als remotes toe te voegen en hun werk te mergen.

Om een project te forken, bezoek dan de project pagina (in dit geval, mojombo/chronic) en klik de "fork" knop aan de bovenkant (zie Figuur 4-14).


![](http://git-scm.com/figures/18333fig0414-tn.png)

Figuur 4-14. Een schrijfbare kopie van een project krijgen door de "fork" knop te klikken.

Na een paar seconden wordt je naar je nieuwe project pagina gebracht, wat aangeeft dat dit project een fork is van een ander (zie Figuur 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)

Figuur 4-15. Jouw fork van een project.

## GitHub samenvatting

Dat is alles wat we laten zien over GitHub, maar het is belangrijk om te zien hoe snel je dit allemaal kunt doen. Je kunt een nieuw account aanmaken, een nieuw project toevoegen en er binnen een paar minuten naar pushen. Als je project open source is, kun je ook een enorme ontwikkelaars gemeenschap krijgen die nu zicht hebben op je project en het misschien forken en eraan helpen bijdragen. Op z'n minst is dit een snelle manier om met Git aan de slag te gaan en het snel uit te proberen.
