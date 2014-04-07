# Branch workflows

Nu je de basis van het branchen en mergen onder de knie hebt, wat kan of zou je daarmee kunnen doen? In deze paragraaf gaan we een aantal veel voorkomende workflows die deze lichtgewicht branches mogelijk maken behandelen, zodat je kunt besluiten of je ze wilt toepassen in je eigen ontwikkel cyclus.

## Lang-lopende branches

Omdat Git gebruik maakt van een eenvoudige drieweg merge, is het meerdere keren mergen vanuit een branch in een andere gedurende een langere periode over het algemeen eenvoudig te doen. Dit betekent dat je meerdere branches kunt hebben, die altijd open staan en die je voor verschillende delen van je ontwikkel cyclus gebruikt; je kunt regelmatig vanuit een aantal mergen in andere.

Veel Git ontwikkelaars hebben een workflow die deze aanpak omarmt, zoals het hebben van alleen volledig stabiele code in hun `master` branch — mogelijk alleen code die is of zal worden vrijgegeven. Ze hebben een andere parallelle branch "develop" of "next" genaamd waarop ze werken of die ze gebruiken om stabiliteit te testen — het is niet noodzakelijkerwijs altijd stabiel, maar zodra het in een stabiele status verkeert, kan het worden gemerged in `master`. Deze wordt gebruikt om topic branches (branches met een korte levensduur, zoals jou eerdere `iss53` branch) te pullen zodra die klaar zijn, om er zich ervan te overtuigen dat alle testen slagen en er geen fouten worden geïntroduceerd.

Feitelijk praten we over verwijzingen die worden verplaatst over de lijn van de commits die je maakt. De stabiele branches zijn verder naar achterop in je commit historie, en de splinternieuwe branches zijn verder naar voren in de historie (zie Figuur 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)

Figuur 3-18. Meer stabiele branches zijn over het algemeen verder naar achter in de commit historie.

Ze zijn misschien makkelijker voor te stellen als werk silo's, waar sets van commits stapsgewijs naar een meer stabiele silo worden gepromoveerd als ze volledig getest zijn (zie Figuur 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)

Figuur 3-19. Het kan handig zijn om je branches voor te stellen als silo's.

Je kunt dit blijven doen voor elk niveau van stabiliteit. Sommige grotere projecten hebben ook een `proposed` of `pu` (proposed updates) branch die branches geïntegreerd heeft die wellicht nog niet klaar zijn om in de `next` of `master` branch te gaan. Het idee erachter is dat de branches op verschillende niveaus van stabiliteit zitten. Zodra ze een meer stabiel niveau bereiken, worden ze in de branch boven hen gemerged.
Nogmaals, het hebben van langlopende branches is niet noodzakelijk, maar het helpt vaak wel; in het bijzonder als je te maken hebt met zeer grote of complexe projecten.

## Topic branches

Topic branches zijn nuttig in projecten van elke grootte. Een topic branch is een kortlopende branch die je maakt en gebruikt om een specifieke functie te realiseren of daaraan gerelateerd werk te doen. Dit is iets wat je waarschijnlijk nooit eerder met een VCS gedaan hebt, omdat het over het algemeen te duur is om branches aan te maken en te mergen. Maar in Git is het niet ongebruikelijk om meerdere keren per dag branches aan te maken, daarop te werken, en ze te verwijderen.

Je zag dit in de vorige paragraaf met de `iss53` en `hotfix` branches die je gemaakt had. Je hebt een aantal commits op ze gedaan en ze meteen verwijderd nadat je ze gemerged had in je hoofd branch. Deze techniek stelt je in staat om snel en volledig van context te veranderen — omdat je werk is onderverdeeld in silo's waar alle wijzigingen in die branch te maken hebben met dat onderwerp, is het makkelijker te zien wat er is gebeurd tijdens een code review en dergelijke. Je kunt de wijzigingen daar minuten-, dagen- of maandenlang bewaren, en ze mergen als ze er klaar voor zijn, ongeacht de volgorde waarin ze gemaakt of aan gewerkt zijn.

Neem als voorbeeld een situatie waarbij wat werk gedaan wordt (op `master`), er wordt een branche gemaakt voor een probleem (`iss91`) en daar wordt wat aan gewerkt, er wordt een tweede branch gemaakt om op een andere manier te proberen hetzelfde op te lossen (`iss91v2`); weer even wordt teruggegaan naar de master branch om daar een tijdje te werken, en dan vanaf daar wordt gebrancht om wat werk te doen waarvan je niet zeker weet of het wel zo'n slim idee is (`dumbidea` branch). Je commit historie zal er uit zien als Figuur 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)

Figuur 3-20. Je commit geschiedenis met meerdere topic branches.

Laten we zeggen dat je besluit dat je de tweede oplossing voor je probleem het beste vindt (`iss91v2`), en je hebt de `dumbidea` branch aan je collega's laten zien en het blijkt geniaal te zijn. Je kunt dan de oorspronkelijke `iss91` weggooien (waardoor je commits C5 en C6 kwijt raakt), en de andere twee mergen. Je historie ziet er dan uit als Figuur 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)

Figuur 3-21. Je historie na het mergen van dumbidea en iss91v2.

Het is belangrijk om te beseffen dat tijdens al deze handelingen, al deze branches volledig lokaal zijn. Als je aan het branchen of mergen bent, dan wordt alles alleen in jouw Git repository gedaan - dus er vindt geen server communicatie plaats.
