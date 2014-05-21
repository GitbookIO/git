# Gedistribueerde workflows

In tegenstelling tot gecentraliseerde versiebeheersystemen (CVCSen), stelt de gedistribueerde aard van Git je in staat om veel flexibeler te zijn in de manier waarop ontwikkelaars samenwerken in projecten. Bij gecentraliseerde systemen is iedere ontwikkelaar een knooppunt dat min of meer gelijkwaardig werkt op een centraal punt. In Git is iedere ontwikkelaar zowel een knooppunt als een spil - dat wil zeggen, iedere ontwikkelaar kan zowel code bijdragen aan andere repositories, als ook een publiek repository beheren waarop andere ontwikkelaars hun werk baseren en waaraan zij kunnen bijdragen. Dit stelt je project en/of je team in staat om een enorm aantal workflows er op na te houden, dus ik zal een aantal veel voorkomende manieren behandelen die gebruik maken van deze flexibiliteit. Ik zal de sterke en mogelijke zwakke punten van ieder ontwerp behandelen; je kunt er een kiezen om te gebruiken, of je kunt van iedere wijze een paar eigenschappen overnemen en mengen.

## Gecentraliseerde workflow

In gecentraliseerde systemen is er over het algemeen een enkel samenwerkingsmodel - de gecentraliseerde workflow. Één centraal punt, of repository, kan code aanvaarden, en iedereen synchroniseert zijn werk daarmee. Een aantal ontwikkelaars zijn knopen - gebruikers van dat centrale punt - en synchroniseren met die plaats (zie Figuur 5-1).


![](http://git-scm.com/figures/18333fig0501-tn.png)

Figuur 5-1. Gecentraliseerde workflow.

Dit betekent dat als twee ontwikkelaars clonen van het gecentraliseerde punt en beiden wijzigingen doen, de eerste ontwikkelaar zijn wijzigingen zonder problemen kan pushen. De tweede ontwikkelaar zal het werk van de eerste in het zijne moeten mergen voordat hij het zijne kan pushen, om zo niet het werk van de eerste te overschrijven. Dit concept werkt in Git zoals het ook werkt in Subversion (of ieder ander CVCS), en dit model werkt prima in Git.

Als je een klein team hebt, of al vertrouwd bent met een gecentraliseerde workflow in je bedrijf of team, dan kun je eenvoudig doorgaan met het gebruiken van die workflow met Git. Stel eenvoudigweg een enkele repository in, en geef iedereen in je team  push-toegang; Git zal gebruikers niet toestaan om elkaars wijzigingen te overschrijven. Als een ontwikkelaar cloned, wijzigingen maakt, en dan probeert zijn wijzigingen te pushen terwijl een andere ontwikkelaar de zijne in de tussentijd heeft gepusht, dan zal de server de wijzigingen van die ontwikkelaar weigeren. Ze zullen verteld worden dat ze een "non-fast-forward-wijziging" proberen te pushen en dat ze dat niet wordt toegestaan totdat ze hebben gefetched en gemerged.
Deze workflow is voor een hoop mensen aantrekkelijk omdat het er een is waarmee veel mensen bekend zijn en zich op hun gemak bij voelen.

## Integratie-manager workflow

Omdat Git je toestaat om meerdere remote repositories te hebben, is het mogelijk om een workflow te hebben waarbij iedere ontwikkelaar schrijftoegang heeft tot zijn eigen publieke repository en leestoegang op de andere. Dit scenario heeft vaak een gezagdragend (canonical) repository dat het "officiële" project voorstelt. Om bij te kunnen dragen tot dat project, maak je je eigen publieke clone van het project en pusht je wijzigingen daarin terug. Daarna stuur je een verzoek naar de eigenaar van het hoofdproject om jouw wijzigingen binnen te halen (pull request). Hij kan je repository toevoegen als een remote, je wijzigingen lokaal testen, ze in zijn branch mergen, en dan naar zijn repository pushen. Het proces werkt als volgt (zie Figuur 5-2):

1. De projecteigenaar pusht naar de publieke repository.
2. Een bijdrager cloned die repository en maakt wijzigingen.
3. De bijdrager pusht naar zijn eigen publieke kopie.
4. De bijdrager stuurt de eigenaar een e-mail met de vraag om de wijzigingen binnen te halen (pull request).
5. De eigenaar voegt de repo van de bijdrager toe als een remote en merged lokaal.
6. De eigenaar pusht de gemergde wijzigingen terug in de hoofdrepository.


![](http://git-scm.com/figures/18333fig0502-tn.png)

Figuur 5-2. Integratie-manager workflow.

Dit is een veel voorkomende workflow bij websites zoals GitHub, waarbij het eenvoudig is om een project af te splitsen (fork) en je wijzigingen te pushen in jouw afgesplitste project waar iedereen ze kan zien. Een van de grote voordelen van deze aanpak is dat je door kunt gaan met werken, en de eigenaar van de hoofdrepository jouw wijzigingen op ieder moment kan pullen. Bijdragers hoeven niet te wachten tot het project hun bijdragen invoegt - iedere partij kan op zijn eigen tempo werken.

## Dictator en luitenanten workflow

Dit is een variant op de multi-repository workflow. Het wordt over het algemeen gebruikt bij enorme grote projecten met honderden bijdragers; een bekend voorbeeld is de Linux-kernel. Een aantal integrators geven de leiding over bepaalde delen van de repository, zij worden luitenanten genoemd. Alle luitenanten hebben één integrator die bekend staat als de welwillende dictator. De repository van de welwillende dictator dient als het referentierepository vanwaar alle bijdragers dienen binnen te halen. Het proces werkt als volgt (zie Figuur 5-3):

1. Reguliere ontwikkelaars werken op hun eigen onderwerp (topic) branch en rebasen hun werk op de master. De masterbranch is die van de dictator.
2. Luitenanten mergen de topic branches van de ontwikkelaars in hun masterbranch.
3. De dictator merged de masterbranches van de luitenanten in de masterbranch van de dictator.
4. De dictator pusht zijn masterbranch terug naar het referentierepository zodat de andere ontwikkelaars kunnen rebasen.


![](http://git-scm.com/figures/18333fig0503-tn.png)

Figuur 5-3. Welwillende-dictatorwerkwijze.

Deze manier van werken is niet gewoon, maar kan handig zijn in hele grote projecten of in zeer hiërarchische omgevingen, omdat het de projectleider (de dictator) in staat stelt om het meeste werk te delegeren en grote subsets van code te verzamelen op meerdere punten alvorens ze te integreren.

Dit zijn veel voorkomende workflows die mogelijk zijn met een gedistribueerd systeem als Git, maar je kunt zien dat er veel variaties mogelijk zijn om ze te laten passen bij jouw specifieke workflow. Nu dat je (naar ik hoop) in staat bent om te bepalen welke combinatie van workflows voor jou werkt, zal ik wat specifiekere voorbeelden behandelen hoe je de belangrijkste rollen kunt vervullen die in de verschillende workflows voorkomen.
