# Remote branches

Remote branches zijn referenties naar de staat van de branches op remote repositories. Ze zijn lokale branches die jij niet kunt verplaatsen; ze worden automatisch verplaatst zodra je er netwerk communicatie plaatsvindt. Remote branches gedragen zich als boekenleggers om je eraan te helpen herinneren wat de staat van de branches was op je remote repositories toen je voor het laatst met ze in contact was.

Ze hebben de vorm `(remote)/(branch)`. Bijvoorbeeld, als je wil zien hoe de `master` branch op je `origin` de laatste keer dat je er mee communiceerde er uit zag, dan zal je de `origin/master` branch moeten bekijken. Als je samen met een partner aan het werk bent met een probleem en zij heeft een `iss53` branch gepushed, zou je je een eigen lokale `iss53` kunnen hebben, maar de branch op de server zal wijzen naar de commit op `origin/iss53`.

Dit kan wat verwarrend zijn, dus laten we eens naar een voorbeeld kijken. Stel dat je een Git server op je netwerk hebt op `git.ourcompany.com`. Als je hiervan cloned dan wordt die door Git automatisch `origin` voor je genoemd, Git haalt alle gegevens binnen, maakt een verwijzing naar waar de `master` branch is en noemt dat lokaal `origin/master`, en deze kan je niet verplaatsen. Git geeft je ook een eigen `master` branch, beginnend op dezelfde plaats als de `master` branch van origin, zodat je iets hebt om vanaf te werken (zie Figuur 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)

Figuur 3-22. Een Git clone geeft je een eigen master branch en origin/master wijzend naar de master branch van origin.

Als je wat werk doet op je lokale master branch, en in de tussentijd pusht iemand anders iets naar `git.ourcompany.com` waardoor die master branch wordt vernieuwd, dan zijn jullie histories verschillend vooruit geschoven. En zolang je geen contact hebt met de origin server, zal jouw `origin/master` verwijzing niet verplaatsen (zie Figuur 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)

Figuur 3-23. Lokaal werken terwijl iemand anders naar je remote server pusht laat elke historie anders vooruit gaan.

Om je werk te synchroniseren, voer je een `git fetch origin` commando uit. Dit commando bekijkt welke server origin is (in dit geval is het `git.ourcompany.com`), haalt gegevens er vanaf die je nog niet hebt en vernieuwt je lokale database, waarbij je `origin/master` verwijzing naar zijn nieuwe positie verplaatst wordt die meer up-to-date is (zie Figuur 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)

Figuur 3-24. Het git fetch commando vernieuwt je remote referenties.

Om het hebben van meerdere remote servers te tonen en hoe remote branches voor die remote projecten er uit zien, zullen we aannemen dat je nog een interne Git server hebt die alleen wordt gebruikt voor ontwikkeling gedaan door een van je sprint teams. Deze server bevindt zich op `git.team1.ourcompany.com`. Je kunt het als een nieuwe remote referentie toevoegen aan het project waar je nu aan werkt door het `git remote add` commando uit te voeren, zoals we behandeld hebben in Hoofdstuk 2. Noem deze remote `teamone`, wat jouw afkorting voor die hele URL wordt (zie Figuur 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)

Figuur 3-25. Een andere server als een remote toevoegen.

Nu kun je `git fetch teamone` uitvoeren om alles op te halen dat wat de `teamone` remote server heeft en jij nog niet. Omdat die server een subset heeft van de gegevens die jouw `origin` server op dit moment heeft, haalt Git geen gegevens op maar maakt een remote branch genaamd `teamone/master` aan en laat die wijzen naar de commit die `teamone` heeft als zijn `master` branch (zie Figuur 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)

Figuur 3-26. Je krijgt lokaal een referentie naar de master branch positie van teamone.

## Pushen

Als je een branch wil delen met de rest van de wereld, dan moet je het naar een remote terugzetten waar je schrijftoegang op hebt. Je lokale branches worden niet automatisch gesynchroniseerd met de remotes waar je naar schrijft - je moet de branches die je wilt delen uitdrukkelijk pushen. Op die manier kun je privé branches gebruiken voor het werk dat je niet wil delen, en alleen die topic branches pushen waar je op wilt samenwerken.

Als je een branch genaamd `serverfix` hebt waar je met anderen aan wilt werken, dan kun je die op dezelfde manier pushen als waarop je dat voor de eerste branch hebt gedaan. Voer `git push (remote) (branch)` uit:

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Dit is een beetje de bocht afsnijden. Git zal de `serverfix` branchnaam automatisch expanderen naar `refs/heads/serverfix:refs/heads/serverfix`, wat staat voor "Neem mijn lokale serverfix branch en push die om de serverfix branch van de remote te vernieuwen.". We zullen het `refs/heads` gedeelte gedetaileerd behandelen in Hoofdstuk 9, maar je kunt het normaalgesproken weglaten. Je kun ook `git push origin serverfix:serverfix` doen, wat hetzelfde doet. Dit staat voor "Neem mijn serverfix en maak het de serverfix van de remote." Je kunt dit formaat gebruiken om een lokale branch te pushen naar een remote branch die anders heet. Als je niet wil dat het `serverfix` heet aan de remote kant, kan je in plaats daarvan `git push origin serverfix:awesomebranch` gebruiken om je lokale `serverfix` branch naar de `awesomebranch` op het remote project te pushen.

De volgende keer dat één van je medewerkers van de server fetched zal deze een referentie krijgen naar de versie van `serverfix` op de server, onder de remote branch `origin/serverfix`:

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

Het is belangrijk om op te merken dat wanneer je een fetch doet die nieuwe remote branches ophaalt, je niet automatisch lokale aanpasbare kopieën daarvan hebt. In andere woorden, in dit geval heb je geen nieuwe `serverfix` branch - je hebt alleen een `origin/serverfix` verwijzing die je niet kunt aanpassen.

Om dit werk in je huidige werk branch te mergen, kun je `git merge origin/serverfix` uitvoeren. Als je een eigen `serverfix` branch wilt waar je op kunt werken, dan kun je deze op je remote branch baseren:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch serverfix from origin.
	Switched to a new branch 'serverfix'

Dit maakt een lokale branch aan waar je op kunt werken, die begint met waar `origin/serverfix` is.

## Tracking branches

Een lokale branch uitchecken van een remote branch creëert automatisch een zogenaamde _tracking branch_ (_volg branch_). Tracking branches zijn lokale branches die een directe releatie met een remote branch hebben. Als je op een tracking branch zit en `git push` typt, dat weet Git automatisch naar welke server en branch hij moet pushen. En, als je op een van die branches zit zal het uitvoeren van `git pull` alle remote referenties ophalen en automatisch de corresponderende remote branch erin mergen.

Als je een repository cloned, zal het over het algemeen automatisch een `master` branch aanmaken die `origin/master` trackt. Daarom werken `git push` en `git pull` zo uit het doosje, zonder verdere argumenten. Maar je kan ook andere tracking branches aanmaken als je dat wilt, andere die niet branches tracken op `origin` en niet de `master` branch tracken. Een eenvoudig voorbeeld is wat je zojuist gezien hebt: `git checkout -b [branch] [remotenaam]/[branch]` uitvoeren. Als je Git versie 1.6.2 of nieuwer hebt, kun je ook de `--track` afkorting gebruiken:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch serverfix from origin.
	Switched to a new branch 'serverfix'

Om een lokale branch te maken met een andere naam dan de remote branch, kun je simpelweg de eerste variant met een andere lokale branch naam gebruiken:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch serverfix from origin.
	Switched to a new branch 'sf'

Nu zal je lokale `sf` branch automatisch pullen en pushen van origin/serverfix.

## Remote branches verwijderen

Stel dat je klaar bent met een remote branch - zeg maar, jij en je medewerkers zijn klaar met een feature en het hebben gemerged in de `master` branch van de remote (of welke branch jullie stabiele code ook in zit). Dan kun je een remote branch verwijderen door de nogal botte syntax `git push [remotenaam] :[branch]` te gebruiken. Als je de `serverfix` branch van de server wilt verwijderen, dan voer je het volgende uit:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Poef. Geen branch meer op je server. Je zult deze pagina wel een ezelsoortje willen geven, omdat je dat commando nodig gaat hebben en het waarschijnlijk zult vergeten. Een manier om dit commando te onthouden is door de `git push [remotenaam] [lokalebranch]:[remotebranch]` syntax te onthouden die we kortgeleden behandeld hebben. Als je het `[lokalebranch]` gedeelte weglaat dan zeg je in feite, "Neem niets aan mijn kant en maak dat de `[remotebranch]`."
