# Het wat en waarom van versiebeheer

Wat is versiebeheer, en wat heeft dat met jou te maken? Versiebeheer is het systeem waarbij veranderingen in een bestand of groep van bestanden over de tijd wordt bijgehouden, zodat je later specifieke versies kan opvragen. In de voorbeelden in dit boek is het broncode van computersoftware waarvan de versies beheerd worden maar in principe kan elk soort bestand op een computer aan versiebeheer worden onderworpen.

Als je een grafisch ontwerper bent of websites ontwerpt en elke versie van een afbeelding of opmaak wilt bewaren (wat je vrijwel zeker zult willen), is het verstandig een versiebeheersysteem (Version Control System in het Engels, afgekort tot VCS) te gebruiken. Als je dat gebruikt kan je eerdere versies van bestanden of het hele project terughalen, wijzigingen tussen twee momententen in tijd bekijken, zien wie het laatst iets aangepast heeft wat een probleem zou kunnen veroorzaken, wie een probleem heeft veroorzaakt en wanneer en nog veel meer. Een VCS gebruiken betekent meestal ook dat je de situatie gemakkelijk terug kan draaien als je een fout maakt of bestanden kwijtraakt. Daarbij komt nog dat dit allemaal heel weinig extra belasting met zich mee brengt.

## Lokale versiebeheersystemen

Veel mensen hebben hun eigen versiebeheer methode: ze kopiëren bestanden naar een andere map (en als ze slim zijn, geven ze die map ook een datum). Deze methode wordt veel gebruikt omdat het zo simpel is, maar het is ook ongelofelijk foutgevoelig. Het is makkelijk te vergeten in welke map je zit en naar het verkeerde bestand te schrijven, of onbedoeld over bestanden heen te kopiëren.

Om met dit probleem om te gaan hebben programmeurs lang geleden lokale VCSen ontwikkeld die een simpele database gebruikten om alle veranderingen aan bestanden te beheren (zie Figuur 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)

Figuur 1-1. Een diagram van een lokaal versiebeheersysteem.

Een populair gereedschap voor VCS was een systeem genaamd rcs, wat vandaag de dag nog steeds met veel computers wordt meegeleverd. Zelfs het populaire besturingssysteem Mac OS X heeft rcs als je de Developer Tools installeert. Dit gereedschap werkt in principe door verzamelingen van ‘patches’ (de verschillen tussen bestanden) van de opvolgende bestandsversies in een speciaal formaat op de harde schijf op te slaan. Zo kan je een bestand reproduceren zoals deze er uitzag op enig moment in tijd door alle patches bij elkaar op te tellen.

## Gecentraliseerde versiebeheersystemen

De volgende belangrijke uitdaging waar mensen tegenaan lopen is dat ze samen moeten werken met ontwikkelaars op andere computers. Om deze uitdaging aan te gaan ontwikkelde men Gecentraliseerde Versiebeheersystemen (Centralized Version Control Systems, afgekort CVCSs). Deze systemen, zoals CVS, Subversion en Perforce, hebben één centrale server waarop alle versies van de bestanden staan en een aantal clients die de bestanden daar van ophalen (‘check out’). Vele jaren was dit de standaard voor versiebeheer (zie Figuur 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)

Figuur 1-2. Een diagram van een gecentraliseerd versiebeheersysteem.

Deze manier van versiebeheer biedt veel voordelen, zeker ten opzichte van lokale VCSen. Bijvoorbeeld weet iedereen, tot op zekere hoogte, wat de overige project-medewerkers aan het doen zijn. Beheerders hebben een hoge mate van controle over wie wat kan doen, en het is veel eenvoudiger om een CVCS te beheren dan te moeten werken met lokale databases op elke client.

Maar helaas, deze methode heeft ook behoorlijke nadelen. De duidelijkste is de ‘single point of failure’: als de centrale server plat gaat en een uur later weer terug online komt kan niemand in dat uur samenwerken of versies bewaren van de dingen waar ze aan werken. Als de harde schrijf waar de centrale database op staat corrupt raakt en er geen backups van zijn verlies je echt alles; de hele geschiedenis van het project, behalve de momentopnames die mensen op hun eigen computers hebben staan. Lokale VCSen hebben hetzelfde probleem: als je de hele geschiedenis van het project op één enkele plaats bewaart, loop je ook kans alles te verliezen.

## Gedistribueerde versiebeheersystemen

En hier verschijnen Gedistribueerde versiebeheersystemen (Distributed Version Control Systems, DVCSs) ten tonele. In een DVCS (zoals Git, Mercurial, Bazaar en Darcs) downloaden clients niet simpelweg de laatste momentopnames van de bestanden: de hele opslagplaats (de ‘repository’) wordt gekopiëerd. Dus als een server neergaat en deze systemen werkten via die server samen dan kan de repository van elke willekeurige client terug worden gekopiëerd naar de server om deze te herstellen. Elke checkout is dus in feite een complete backup van alle data (zie Figuur 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)

Figuur 1-3. Diagram van een gedistribueerd versiebeheersysteem

Bovendien kunnen veel van deze systemen behoorlijk goed omgaan met meerdere (niet-lokale) repositories tegelijk, zodat je met verschillende groepen mensen op verschillende manieren tegelijk aan hetzelfde project kan werken. Hierdoor kan je verschillende werkprocessen (‘workflows’) opzetten die niet mogelijk waren geweest met gecentraliseerde systemen zoals hiërarchische modellen.
