# Bijdragen aan een project

Je weet wat de verschillende workflows zijn, en je zou het fundamentele gebruik van Git in de vingers moeten hebben. In dit gedeelte zul je leren over een aantal voorkomende patronen voor het bijdragen aan een project.

De grote moeilijkheid bij het beschrijven van dit proces is dat er een enorm aantal variaties mogelijk zijn in hoe het gebeurt. Om dat Git erg flexibel is, kunnen en zullen mensen op vele manieren samenwerken, en het is lastig om te beschrijven hoe je zou moeten bijdragen aan een project - ieder project is een beetje anders. Een aantal van de betrokken variabelen zijn de grote van actieve bijdragen, gekozen workflow, je commit toegang, en mogelijk de manier waarop externe bijdragen worden gedaan.

De eerste variabele is de grootte van actieve bijdrage. Hoeveel gebruikers dragen actief code bij aan dit project, en hoe vaak? In veel gevallen zal je twee of drie ontwikkelaars met een paar commits per dag hebben, of misschien minder voor wat meer slapende projecten. Voor zeer grote bedrijven of projecten kan het aantal ontwikkelaars in de duizenden lopen, met tientallen of zelfs honderden patches die iedere dag binnenkomen. Dit is belangrijk omdat met meer en meer ontwikkelaars, je meer en meer problemen tegenkomt bij het je verzekeren dat code netjes gepatched of eenvoudig gemerged kan worden. Wijzigingen die je indient kunnen verouderd of zwaar beschadigd raken door werk dat gemerged is terwijl je ermee aan het werken was, of terwijl je wijzigingen in de wacht stonden voor goedkeuring of toepassing. Hoe kun je jouw code consequent bij de tijd en je patches geldig houden?

De volgende variabele is de gebruikte workflow in het project. Is het gecentraliseerd, waarbij iedere ontwikkelaar gelijkwaardige schrijftoegang heeft tot de hoofd codebasis? Heeft het project een eigenaar of integrator die alle patches controleert? Worden alle patches gereviewed en goedgekeurd? Ben jij betrokken bij dat proces? Is er een luitenanten systeem neergezet, en moet je je werk eerst bij hen inleveren?

Het volgende probleem is je commit toegang. De benodigde workflow om bij te dragen aan een project is heel verschillend als je schrijftoegang hebt tot het project dan wanneer je dat niet hebt. Als je geen schrijftoegang hebt, wat is de voorkeur van het project om bijdragen te ontvangen? Is er überhaupt een beleid? Hoeveel werk draag je per keer bij? Hoe vaak draag je bij?

Al deze vragen kunnen van invloed zijn op hoe je effectief bijdraagt aan een project en welke workflows de voorkeur hebben of die beschikbaar zijn voor je. Ik zal een aantal van deze aspecten behandelen in een aantal voorbeelden, waarbij ik van eenvoudig tot complex zal gaan. Je zou in staat moeten zijn om de specifieke workflows die je in jouw praktijk nodig hebt te kunnen herleiden vanuit deze voorbeelden.

## Commit richtlijnen

Voordat je gaat kijken naar de specifieke gebruiksscenario's, volgt hier een kort stukje over commit berichten. Het hebben van een goede richtlijn voor het maken commits en je daar aan houden maakt het werken met Git en samenwerken met anderen een stuk makkelijker. Het Git project levert een document waarin een aantal goede tips staan voor het maken van commits waaruit je patches kunt indienen - je kunt het lezen in de Git broncode in het `Documentation/SubmittingPatches` bestand.

Als eerste wil je geen witruimte fouten indienen. Git geeft je een eenvoudige manier om hierop te controleren - voordat je commit, voer `git diff --check` uit, wat mogelijke witruimte fouten identificeert en ze voor je afdrukt. Hier is een voorbeeld, waarbij ik een rode terminal kleur hebt vervangen door `X`en:

	$ git diff --check
	lib/simplegit.rb:5: trailing whitespace.
	+    @git_dir = File.expand_path(git_dir)XX
	lib/simplegit.rb:7: trailing whitespace.
	+ XXXXXXXXXXX
	lib/simplegit.rb:26: trailing whitespace.
	+    def command(git_cmd)XXXX

Als je dat commando uitvoert alvorens te committen, kun je al zien of je op het punt staat witruimte problemen te committen waaraan andere ontwikkelaars zich zullen ergeren.

Probeer vervolgens om van elke commit een logische set wijzigingen te maken. Probeer, als het je lukt, om je wijzigingen verteerbaar te maken - ga niet het hele weekend zitten coderen op vijf verschillende problemen om dat vervolgens op maandag als een gigantische commit in te dienen. Zelfs als je gedurende het weekend niet commit, gebruik dan het staging gebied op maandag om je werk in ten minste één commit per probleem op te splitsen, met een bruikbaar bericht per commit. Als een paar van de wijzigingen één bestand veranderen, probeer dan `git add --patch` te gebruiken om bestanden gedeeltelijk te stagen (wordt in detail behandeld in Hoofdstuk 6). De snapshot aan de kop van het project is gelijk of je nu één commit doet of vijf, zolang alle wijzigingen op een gegeven moment maar toegevoegd zijn, dus probeer om het je mede-ontwikkelaars makkelijk te maken als ze je wijzigingen moeten bekijken. Deze aanpak maakt het ook makkelijker om één wijziging eruit te selecteren of terug te draaien, mocht dat later nodig zijn. Hoofdstuk 6 beschrijft een aantal handige Git trucs om geschiedenis te herschrijven en bestanden interactief te stagen - gebruik deze gereedschappen als hulp om een schone en begrijpelijke historie op te bouwen.

Het laatste om in gedachten te houden is het commit bericht. Als je er een gewoonte van maakt om een goede kwaliteit commit berichten aan te maken, dan maakt dat het gebruik van en samenwerken in Git een stuk eenvoudiger. In het algemeen zouden je berichten moeten beginnen met een enkele regel die niet langer is dan 50 karakters en die de wijzigingen beknopt omschrijft, gevolgd door een lege regel en daarna een meer gedetailleerde uitleg. Het Git project vereist dat de meer gedetailleerde omschrijving ook je motivatie voor de verandering bevat, en de nieuwe implementatie tegen het oude gedrag afzet. Dit is een goede richtlijn om te volgen. Het is ook een goed idee om de gebiedende wijs te gebruiken in deze berichten. Met andere woorden, gebruik commando's. In plaats van "Ik heb testen toegevoegd voor" of "Testen toegevoegd voor" gebruik je "Voeg testen toe voor".
Hier is een sjabloon dat origineel geschreven is door Tim Pope op tpope.net:

	Kort (50 karakters of minder) samenvatting van wijzigingen

	Gedetailleerdere beschrijvende tekst, indien nodig. Laat het na 
	ongeveer 72 karakters afbreken. In sommige contexten, wordt de 
	eerste regel behandeld als het onderwerp van een email en de rest
	als inhoud. De lege regel die de samenvatting scheidt van de 
	inhoud is essentieel (tenzij je de inhoud helemaal weglaat); 
	applicaties zoals rebase kunnen in de war raken als je ze 
	samenvoegt.

	Vervolg paragrafen komen na lege regels.

	 - Aandachtspunten zijn ook goed.

	 - Typisch wordt een streepje of sterretje gebruikt als "bullet",
	   voorafgegaan door een enkele spatie, met ertussen lege regels,
	   maar de conventies variëren hierin.

Als al je commit berichten er zo uit zien, dan zullen de dingen een stuk eenvoudiger zijn voor jou en de ontwikkelaars waar je mee samenwerkt. Het Git project heeft goed geformatteerde commit berichten - ik raad je aan om `git log --no-merges` uit te voeren om te zien hoe een goed geformatteerde project-commit historie eruit ziet.

In de volgende voorbeelden, en verder door de rest van dit boek, zal ik omwille van bondigheid de berichten niet zo netjes als dit formatteren; in plaats daarvan gebruik ik de `-m` optie voor `git commit`. Doe wat ik zeg, niet wat ik doe.

## Besloten klein team

De eenvoudigste opzet die je waarschijnlijk zult tegenkomen is een besloten project met één of twee andere ontwikkelaars. Met besloten bedoel ik gesloten broncode - zonder leestoegang voor de buitenwereld. Jij en de andere ontwikkelaars hebben allemaal push toegang op de repository.

In deze omgeving kan je een workflow aanhouden die vergelijkbaar is met wat je zou doen als je Subversion of een andere gecentraliseerd systeem zou gebruiken. Je hebt nog steeds de voordelen van zaken als offline committen en veel eenvoudiger branchen en mergen, maar de workflow kan erg vergelijkbaar zijn. Het grootste verschil is dat het mergen aan de client-kant gebeurt tijdens het committen in plaats van aan de server-kant.
Laten we eens kijken hoe het er uit zou kunnen zien als twee ontwikkelaars samen beginnen te werken met een gedeelde repository. De eerste ontwikkelaar, John, cloned de repository, maakt een wijziging, en commit lokaal. (Ik vervang de protocol berichten met `...` in deze voorbeelden om ze iets in te korten.)

	# John's Machine
	$ git clone john@githost:simplegit.git
	Initialized empty Git repository in /home/john/simplegit/.git/
	...
	$ cd simplegit/
	$ vim lib/simplegit.rb
	$ git commit -am 'removed invalid default value'
	[master 738ee87] removed invalid default value
	 1 files changed, 1 insertions(+), 1 deletions(-)

De tweede ontwikkelaar, Jessica, doet hetzelfde - cloned de repository en commit een wijziging:

	# Jessica's Machine
	$ git clone jessica@githost:simplegit.git
	Initialized empty Git repository in /home/jessica/simplegit/.git/
	...
	$ cd simplegit/
	$ vim TODO
	$ git commit -am 'add reset task'
	[master fbff5bc] add reset task
	 1 files changed, 1 insertions(+), 0 deletions(-)

Nu pusht Jessica haar werk naar de server:

	# Jessica's Machine
	$ git push origin master
	...
	To jessica@githost:simplegit.git
	   1edee6b..fbff5bc  master -> master

John probeert ook zijn werk te pushen:

	# John's Machine
	$ git push origin master
	To john@githost:simplegit.git
	 ! [rejected]        master -> master (non-fast forward)
	error: failed to push some refs to 'john@githost:simplegit.git'

John mag niet pushen omdat Jessica in de tussentijd gepusht heeft. Dit is belangrijk om te begrijpen als je gewend bent aan Subversion, omdat het je zal opvallen dat de twee ontwikkelaars niet hetzelfde bestand hebben aangepast. Waar Subversion automatisch zo'n merge op de server doet als verschillende bestanden zijn aangepast, moet je in Git de commits lokaal mergen. John moet Jessica's wijzigingen ophalen (fetch) en ze mergen voor hij mag pushen:

	$ git fetch origin
	...
	From john@githost:simplegit
	 + 049d078...fbff5bc master     -> origin/master

Hierna ziet John's lokale repository er ongeveer uit zoals Figuur 5-4.


![](http://git-scm.com/figures/18333fig0504-tn.png)

Figuur 5-4. John's initiële repository.

John heeft een referentie naar de wijzigingen die Jessica gepusht heeft, maar hij moet ze mergen met zijn eigen werk voordat hij het mag pushen:

	$ git merge origin/master
	Merge made by recursive.
	 TODO |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Het mergen gaat soepeltjes - de commit historie van John ziet er nu uit als Figuur 5-5.


![](http://git-scm.com/figures/18333fig0505-tn.png)

Figuur 5-5. John's repository na het mergen van `origin/master`.

Nu kan John zijn code testen om er zeker van te zijn dat alles nog steeds goed werkt, en dan kan hij zijn nieuwe gemergede werk pushen naar de server:

	$ git push origin master
	...
	To john@githost:simplegit.git
	   fbff5bc..72bbc59  master -> master

Tenslotte ziet John's commit historie eruit als Figuur 5-6.


![](http://git-scm.com/figures/18333fig0506-tn.png)

Figuur 5-6. John's historie na gepusht te hebben naar de origin server.

In de tussentijd heeft Jessica gewerkt op een topic branch. Ze heeft een topic branch genaamd `issue54` aangemaakt en daar drie commits op gedaan. Ze heeft John's wijzigingen nog niet opgehaald, dus haar commit historie ziet er uit als Figuur 5-7.


![](http://git-scm.com/figures/18333fig0507-tn.png)

Figuur 5-7. Jessica's initiële commit historie.

Jessica wil met John synchroniseren, dus ze haalt de wijzigingen op:

	# Jessica's Machine
	$ git fetch origin
	...
	From jessica@githost:simplegit
	   fbff5bc..72bbc59  master     -> origin/master

Dit haalt het werk op dat John in de tussentijd gepusht heeft. Jessica's historie ziet er nu uit als Figuur 5-8.


![](http://git-scm.com/figures/18333fig0508-tn.png)

Figuur 5-8. Jessica's historie na het fetchen van John's wijzigingen.

Jessica denkt dat haar topic branch nu klaar is, maar ze wil weten wat ze in haar werk moet mergen zodat ze kan pushen. Ze voert `git log` uit om dat uit te zoeken:

	$ git log --no-merges origin/master ^issue54
	commit 738ee872852dfaa9d6634e0dea7a324040193016
	Author: John Smith <jsmith@example.com>
	Date:   Fri May 29 16:01:27 2009 -0700

	    removed invalid default value

Nu kan Jessica het werk van haar onderwerp mergen in haar `master` branch, John's werk (`origin/master`) in haar `master` branch mergen, en dan naar de server pushen. Eerst schakelt ze terug naar haar `master` branch om al dit werk te integreren:

	$ git checkout master
	Switched to branch "master"
	Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

Ze kan `origin/master` of `issue54` als eerste mergen - ze zijn beide stroomopwaarts dus de volgorde maakt niet uit. Uiteindelijk zou de snapshot gelijk moeten zijn ongeacht welke volgorde ze kiest; alleen de geschiedenis zal iets verschillen. Ze kiest ervoor om `issue54` eerst samen te voegen:

	$ git merge issue54
	Updating fbff5bc..4af4298
	Fast forward
	 README           |    1 +
	 lib/simplegit.rb |    6 +++++-
	 2 files changed, 6 insertions(+), 1 deletions(-)

Er doen zich geen problemen voor, zoals je kunt zien was het een eenvoudige fast-forward. Nu merged Jessica John's werk (`origin/master`):

	$ git merge origin/master
	Auto-merging lib/simplegit.rb
	Merge made by recursive.
	 lib/simplegit.rb |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

Alles merged netjes, en Jessica's historie ziet er uit als Figuur 5-9.


![](http://git-scm.com/figures/18333fig0509-tn.png)

Figuur 5-9. Jessica's historie na het mergen van John's wijzigingen.

Nu is `origin/master` bereikbaar vanuit Jessica's `master` branch, dus ze zou in staat moeten zijn om succesvol te pushen (even aangenomen dat John in de tussentijd niets gepusht heeft):

	$ git push origin master
	...
	To jessica@githost:simplegit.git
	   72bbc59..8059c15  master -> master

Iedere ontwikkelaar heeft een paar keer gecommit en elkaars werk succesvol samengevoegd, zie Figuur 5-10.


![](http://git-scm.com/figures/18333fig0510-tn.png)

Figuur 5-10. Jessica's historie na alle wijzigingen teruggezet te hebben op de server.

Dit is één van de eenvoudigste workflows. Je werkt een tijdje, over het algemeen in een topic branch, en merged dit in je `master` branch als het klaar is om te worden geïntegreerd. Als je dat werk wilt delen, dan merge je het in je eigen `master` branch, en vervolgens fetch je `origin/master` en merge je deze als het gewijzigd is, en als laatste push je deze naar de `master` branch op de server. De algemene volgorde is zoiets als die getoond in Figuur 5-11.


![](http://git-scm.com/figures/18333fig0511-tn.png)

Figuur 5-11. Algemene volgorde van gebeurtenissen voor een eenvoudige multi-ontwikkelaar Git workflow.

## Besloten aangestuurd team

In het volgende scenario zul je kijken naar de rol van de bijdragers in een grotere besloten groep. Je zult leren hoe te werken in een omgeving waar kleine groepen samenwerken aan functies, waarna die team-gebaseerde bijdragen worden geïntegreerd door een andere partij.

Stel dat John en Jessica samen werken aan een functie, terwijl Jessica en Josie aan een tweede aan het werken zijn. In dit geval gebruikt het bedrijf een integratie-manager achtige workflow, waarbij het werk van de individuele groepen alleen wordt geïntegreerd door bepaalde ontwikkelaars, en de `master` branch van het hoofd repo alleen kan worden vernieuwd door die ontwikkelaars. In dit scenario wordt al het werk gedaan in team-gebaseerde branches en later door de integrators samengevoegd.

Laten we Jessica's workflow volgen terwijl ze aan haar twee features werkt, in parallel met twee verschillende ontwikkelaars in deze omgeving. We nemen even aan dat ze haar repository al gecloned heeft, en dat ze besloten heeft als eerste te werken aan `featureA`. Ze maakt een nieuwe branch aan voor de functie en doet daar wat werk:

	# Jessica's Machine
	$ git checkout -b featureA
	Switched to a new branch "featureA"
	$ vim lib/simplegit.rb
	$ git commit -am 'add limit to log function'
	[featureA 3300904] add limit to log function
	 1 files changed, 1 insertions(+), 1 deletions(-)

Op dit punt, moet ze haar werk delen met John, dus ze pusht haar commits naar de `featureA` branch op de server. Jessica heeft geen push toegang op de `master` branch - alleen de integratoren hebben dat - dus ze moet naar een andere branch pushen om samen te kunnen werken met John:

	$ git push origin featureA
	...
	To jessica@githost:simplegit.git
	 * [new branch]      featureA -> featureA

Jessica mailt John om hem te zeggen dat ze wat werk gepusht heeft in een branch genaamd `featureA` en dat hij er nu naar kan kijken. Terwijl ze op terugkoppeling van John wacht, besluit Jessica te beginnen met het werken aan `featureB` met Josie. Om te beginnen start ze een nieuwe functie branch, gebaseerd op de `master` branch van de server:

	# Jessica's Machine
	$ git fetch origin
	$ git checkout -b featureB origin/master
	Switched to a new branch "featureB"

Nu doet Jessica een paar commits op de `featureB` branch:

	$ vim lib/simplegit.rb
	$ git commit -am 'made the ls-tree function recursive'
	[featureB e5b0fdc] made the ls-tree function recursive
	 1 files changed, 1 insertions(+), 1 deletions(-)
	$ vim lib/simplegit.rb
	$ git commit -am 'add ls-files'
	[featureB 8512791] add ls-files
	 1 files changed, 5 insertions(+), 0 deletions(-)

Jessica's repository ziet eruit als Figuur 5-12.


![](http://git-scm.com/figures/18333fig0512-tn.png)

Figuur 5-12. Jessica's initiële commit historie.

Ze is klaar om haar werk te pushen, maar ze krijgt een mail van Josie dat een branch met wat initieel werk erin al gepusht is naar de server in de `featureBee` branch. Jessica moet die wijzigingen eerst mergen met die van haar voordat ze kan pushen naar de server. Ze kan dan Josie's wijzigingen ophalen met `git fetch`:

	$ git fetch origin
	...
	From jessica@githost:simplegit
	 * [new branch]      featureBee -> origin/featureBee

Jessica kan dit nu mergen in het werk wat zij gedaan heeft met `git merge`:

	$ git merge origin/featureBee
	Auto-merging lib/simplegit.rb
	Merge made by recursive.
	 lib/simplegit.rb |    4 ++++
	 1 files changed, 4 insertions(+), 0 deletions(-)

Er is wel een klein probleempje - ze moet het gemergde werk in haar `featureB` branch naar de `featureBee` branch op de server zetten. Ze kan dat doen door de lokale branch door te geven aan het `git push` commando, gevolgd door een dubbele punt (:), gevolgd door de remote branch:

	$ git push origin featureB:featureBee
	...
	To jessica@githost:simplegit.git
	   fba9af8..cd685d1  featureB -> featureBee

Dit wordt een _refspec_ genoemd. Zie Hoofdstuk 9 voor een gedetailleerdere behandeling van Git refspecs en de verschillende dingen die je daarmee kan doen.

Vervolgens mailt John naar Jessica om te zeggen dat hij wat wijzigingen naar de `featureA` branch gepusht heeft, en om haar te vragen die te verifiëren. Ze voert een `git fetch` uit om die wijzigingen op te halen:

	$ git fetch origin
	...
	From jessica@githost:simplegit
	   3300904..aad881d  featureA   -> origin/featureA

Daarna kan ze zien wat er veranderd is met `git log`:

	$ git log origin/featureA ^featureA
	commit aad881d154acdaeb2b6b18ea0e827ed8a6d671e6
	Author: John Smith <jsmith@example.com>
	Date:   Fri May 29 19:57:33 2009 -0700

	    changed log output to 30 from 25

Uiteindelijk merged ze John's werk in haar eigen `featureA` branch:

	$ git checkout featureA
	Switched to branch "featureA"
	$ git merge origin/featureA
	Updating 3300904..aad881d
	Fast forward
	 lib/simplegit.rb |   10 +++++++++-
	1 files changed, 9 insertions(+), 1 deletions(-)

Jessica wil iets kleins wijzigen, dus doet ze nog een commit en pusht dit naar de server:

	$ git commit -am 'small tweak'
	[featureA ed774b3] small tweak
	 1 files changed, 1 insertions(+), 1 deletions(-)
	$ git push origin featureA
	...
	To jessica@githost:simplegit.git
	   3300904..ed774b3  featureA -> featureA

Jessica's commit historie ziet er nu uit zoals Figuur 5-13.


![](http://git-scm.com/figures/18333fig0513-tn.png)

Figuur 5-13. Jessica's historie na het committen op een feature branch.

Jessica, Josie en John informeren de integrators nu dat de `featureA` en `featureBee` branches op de server klaar zijn voor integratie in de hoofdlijn. Nadat zij die branches in de hoofdlijn geïntegreerd hebben, zal een fetch de nieuwe merge commits ophalen, waardoor de commit historie er uit ziet zoals Figuur 5-14.



![](http://git-scm.com/figures/18333fig0514-tn.png)

Figuur 5-14. Jessica's historie na het mergen van allebei haar onderwerp branches.

Veel groepen schakelen om naar Git juist vanwege de mogelijkheid om meerdere teams in parallel te kunnen laten werken, waarbij de verschillende lijnen van werk laat in het proces gemerged worden. De mogelijkheid van kleinere subgroepen of een team om samen te werken via remote branches zonder het hele team erin te betrekken of te hinderen is een enorm voordeel van Git. De volgorde van de workflow die je hier zag is ongeveer zoals Figuur 5-15.


![](http://git-scm.com/figures/18333fig0515-tn.png)

Figuur 5-15. Eenvoudige volgorde in de workflow van dit aangestuurde team.

## Klein openbaar project

Het bijdragen aan openbare, of publieke, projecten gaat op een iets andere manier. Omdat je niet de toestemming hebt om de branches van het project rechtstreeks te updaten, moet je het werk op een andere manier naar de beheerders krijgen. Dit eerste voorbeeld beschrijft het bijdragen via afsplitsen (forken) op Git hosts die het eenvoudig aanmaken van forks ondersteunen. De repo.or.cz en GitHub hosting sites ondersteunen dit beide, en veel project beheerders verwachten deze manier van bijdragen. De volgende paragraaf behandelt projecten die de voorkeur hebben om bijdragen in de vorm van patches via e-mail te ontvangen.

Eerst zal je waarschijnlijk de hoofdrepository clonen, een topic branch maken voor de patch of reeks patches die je van plan bent bij te dragen, en je werk daarop doen. De te volgen stappen zien er zo uit:

	$ git clone (url)
	$ cd project
	$ git checkout -b featureA
	$ (work)
	$ git commit
	$ (work)
	$ git commit

Je kunt eventueel besluiten `rebase -i` te gebruiken om je werk in één enkele commit samen te persen (squash), of het werk in de commits te herschikken om de patch eenvoudiger te kunnen laten reviewen door de beheerders - zie Hoofdstuk 6 voor meer informatie over het interactief rebasen.

Als je werk op de branch af is, en je klaar bent om het over te dragen aan de beheerders, ga je naar de originele project pagina en klik op de "Fork" knop. Hiermee maak je een eigen overschrijfbare fork van het project. Je moet de URL van deze nieuwe repository URL toevoegen als een tweede remote, in dit geval `myfork` genaamd:

	$ git remote add myfork (url)

Je wilt je werk daar naartoe pushen. Het is het makkelijkst om de remote branch waar je op zit te werken te pushen naar je repository, in plaats van het te mergen in je master branch en die te pushen. De reden hiervan is, dat als het werk niet wordt geaccepteerd of alleen ge-cherry picked (deels overgenomen), je jouw master branch niet hoeft terug te draaien. Als de beheerders je werk mergen, rebasen of cherry picken, dan krijg je het uiteindelijk toch binnen door hun repository te pullen:

	$ git push myfork featureA

Als jouw werk gepusht is naar jouw fork, dan moet je de beheerder inlichten. Dit wordt een pull request (haal-binnen-verzoek) genoemd, en je kunt deze via de website genereren - GitHub heeft een "pull request" knop die de beheerder automatisch een bericht stuurt - of het `git request-pull` commando uitvoeren en de uitvoer handmatig naar de projectbeheerder mailen.

Het `request-pull` commando neemt de basis branch waarin je de topic branch gepulled wil hebben, en de URL van de Git repository waar je ze uit wil laten pullen, en maakt een samenvatting van alle wijzigingen die je gepulled wenst te hebben. Bijvoorbeeld, als Jessica John een pull request wil sturen, en ze heeft twee commits gedaan op de topic branch die ze zojuist gepusht heeft, dan kan ze dit uitvoeren:

	$ git request-pull origin/master myfork
	The following changes since commit 1edee6b1d61823a2de3b09c160d7080b8d1b3a40:
	  John Smith (1):
	        added a new function

	are available in the git repository at:

	  git://githost/simplegit.git featureA

	Jessica Smith (2):
	      add limit to log function
	      change log output to 30 from 25

	 lib/simplegit.rb |   10 +++++++++-
	 1 files changed, 9 insertions(+), 1 deletions(-)

De uitvoer kan naar de beheerders gestuurd worden: het vertelt ze waar het werk vanaf gebranched is, vat de commits samen en vertelt waar vandaan ze dit werk kunnen pullen.

Bij een project waarvan je niet de beheerder bent, is het over het algemeen eenvoudiger om een branch zoals `master` altijd de `origin/master` te laten tracken, en je werk te doen in topic branches die je eenvoudig weg kunt gooien als ze geweigerd worden. Als je je werkthema's gescheiden houdt in topic branches maakt dat het ook eenvoudiger voor jou om je werk te rebasen als de punt van de hoofd-repository in de tussentijd verschoven is en je commits niet langer netjes toegepast kunnen worden. Bijvoorbeeld, als je een tweede onderwerp wilt bijdragen aan een project, ga dan niet verder werken op de topic branch die je zojuist gepusht hebt - begin opnieuw vanaf de `master` branch van het hoofd repository:

	$ git checkout -b featureB origin/master
	$ (work)
	$ git commit
	$ git push myfork featureB
	$ (email maintainer)
	$ git fetch origin

Nu zijn al je onderwerpen opgeslagen in een silo - vergelijkbaar met een patch reeks (queue) - die je kunt herschrijven, rebasen en wijzigen zonder dat de onderwerpen elkaar beïnvloeden of van elkaar afhankelijk zijn zoals in Figuur 5-16.


![](http://git-scm.com/figures/18333fig0516-tn.png)

Figuur 5-16. Initiële commit historie met werk van featureB.

Stel dat de project-beheerder een verzameling andere patches binnengehaald heeft en jouw eerste branch geprobeerd heeft, maar dat die niet meer netjes merged. In dat geval kun je proberen die branch te rebasen op `origin/master`, de conflicten op te lossen voor de beheerder, en dan je wijzigingen opnieuw aanbieden:

	$ git checkout featureA
	$ git rebase origin/master
	$ git push -f myfork featureA

Dit herschrijft je geschiedenis zodat die eruit ziet als in Figuur 5-17.


![](http://git-scm.com/figures/18333fig0517-tn.png)

Figuur 5-17. Commit historie na werk van featureA.

Omdat je de branch gerebased hebt, moet je de `-f` specificeren met je push commando om in staat te zijn de `featureA` branch op de server te vervangen met een commit die er geen afstammeling van is. Een alternatief zou zijn dit nieuwe werk naar een andere branch op de server te pushen (misschien `featureAv2` genaamd).

Laten we eens kijken naar nog een mogelijk scenario: de beheerder heeft je werk bekeken in je tweede branch en vind het concept goed, maar zou willen dat je een implementatie detail verandert. Je moet deze gelegenheid meteen gebruiken om het werk te baseren op de huidige `master` branch van het project. Je begint een nieuwe branch gebaseerd op de huidige `origin/master` branch, squashed de `featureB` wijzigingen er naartoe, lost conflicten op, doet de implementatie wijziging en pusht deze terug als een nieuwe branch:

	$ git checkout -b featureBv2 origin/master
	$ git merge --no-commit --squash featureB
	$ (change implementation)
	$ git commit
	$ git push myfork featureBv2

De `--squash` optie pakt al het werk op de gemergde branch en perst dat samen in één non-merge commit bovenop de branch waar je op zit. De `--no-commit` optie vertelt Git dat hij niet automatisch een commit moet doen. Dit stelt je in staat om alle wijzigingen van een andere branch te introduceren en dan meer wijzigingen te doen, alvorens de nieuwe commit te doen.

Je kunt de beheerder nu een bericht sturen dat je de gevraagde wijzigingen gemaakt hebt en dat ze die wijzigingen kunnen vinden in je `featureBv2` branch (zie Figuur 5-18).


![](http://git-scm.com/figures/18333fig0518-tn.png)

Figuur 5-18. Commit historie na het featureBv2 werk.

## Openbaar groot project

Veel grote projecten hebben vastgestelde procedures voor het accepteren van patches - je zult de specifieke regels voor ieder project goed moeten bekijken, omdat ze verschillend zullen zijn. Veel grote projecten accepteren patches veelal via ontwikkelaar-maillijsten, daarom zal ik zo'n voorbeeld nu laten zien.

De workflow is vergelijkbaar met het vorige geval - je maakt topic branches voor iedere patch waar je aan werkt. Het verschil is hoe je die aanlevert bij het project. In plaats van het project te forken en naar je eigen schrijfbare versie te pushen, genereer je e-mail versies van iedere reeks commits en mailt die naar de ontwikkelaar-maillijst:

	$ git checkout -b topicA
	$ (work)
	$ git commit
	$ (work)
	$ git commit

Nu heb je twee commits die je wil sturen naar de maillijst. Je gebruikt `git format-patch` om de mbox-geformatteerde bestanden te genereren die je kunt mailen naar de lijst. Dit vormt iedere commit om naar een e-mail bericht met de eerste regel van het commit bericht als het onderwerp, en de rest van het bericht plus de patch die door de commit wordt geïntroduceerd als de inhoud. Het prettige hieraan is dat met het toepassen van een patch uit een mail die gegenereerd is met `format-patch` alle commit informatie blijft behouden. In de volgende paragraaf zal je hiervan meer zien, als je deze commits gaat toepassen:

	$ git format-patch -M origin/master
	0001-add-limit-to-log-function.patch
	0002-changed-log-output-to-30-from-25.patch

Het `format-patch` commando drukt de namen af van de patch bestanden die het maakt. De `-M` optie vertelt Git te kijken naar hernoemingen. De bestanden komen er uiteindelijk zo uit te zien:

	$ cat 0001-add-limit-to-log-function.patch
	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] add limit to log function

	Limit log functionality to the first 20

	---
	 lib/simplegit.rb |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index 76f47bc..f9815f1 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -14,7 +14,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log #{treeish}")
	+    command("git log -n 20 #{treeish}")
	   end

	   def ls_tree(treeish = 'master')
	--
	1.6.2.rc1.20.g8c5b.dirty

Je kunt deze patch bestanden ook aanpassen om meer informatie, die je niet in het commit bericht wilt laten verschijnen, voor de maillijst toe te voegen . Als je tekst toevoegt tussen de `---` regel en het begin van de patch (de `lib/simplegit.rb` regel), dan kunnen ontwikkelaars dit lezen, maar tijdens het toepassen van de patch wordt dit weggelaten.

Om dit te mailen naar een maillijst, kan je het bestand in je mail-applicatie plakken of het sturen via een commandoregel programma. Het plakken van de tekst veroorzaakt vaak formaterings problemen, in het bijzonder bij "slimmere" clients die de newlines en andere witruimte niet juist behouden. Gelukkig levert Git een gereedschap die je helpt om juist geformatteerde patches via IMAP te versturen, wat het alweer een stuk makkelijker voor je maakt. Ik zal zal je laten zien hoe je een patch via Gmail stuurt, wat de mail-applicatie is die ik toevallig gebruik. Je kunt gedetailleerde instructies voor een aantal mail programma's vinden aan het eind van het voornoemde `Documentation/SubmittingPatches` bestand in de Git broncode.

Eerst moet je de imap sectie in je `~/.gitconfig` bestand instellen. Je kunt iedere waarde apart instellen met een serie `git config` commando's, of je kunt ze handmatig toevoegen, maar uiteindelijk moet je config bestand er ongeveer zo uitzien:

	[imap]
	  folder = "[Gmail]/Drafts"
	  host = imaps://imap.gmail.com
	  user = user@gmail.com
	  pass = p4ssw0rd
	  port = 993
	  sslverify = false

Als je IMAP server geen SSL gebruikt, zijn de laatste twee regels waarschijnlijk niet nodig, en de waarde voor host zal `imap://` zijn in plaats van `imaps://`.
Als dat ingesteld is, kun je `git send-email` gebruiken om de patch reeks in de Drafts map van de gespecificeerde IMAP server te zetten:

	$ cat *.patch |git imap-send
	Resolving imap.gmail.com... ok
	Connecting to [74.125.142.109]:993... ok
	Logging in...
	sending 2 messages
	100% (2/2) done

Nu kan je naar jouw Drafts folder gaan, het To veld wijzigen naar de maillijst waar je de patch naartoe stuurt en misschien de beheerder of verantwoordelijke voor dat deel in de CC zetten en dan versturen.

Je kunt de patches ook via een SMTP server sturen. Zoals eerder kan je elke waarde apart instellen met een serie `git config` commando's, of je kunt ze handmatig in de sendmail sectie in je `~/.gitconfig` bestand zetten:

	[sendemail]
	  smtpencryption = tls
	  smtpserver = smtp.gmail.com
	  smtpuser = user@gmail.com
	  smtpserverport = 587

Als dit gedaan is, kan je `git send-email` gebruiken om je patches te sturen:

	$ git send-email *.patch
	0001-added-limit-to-log-function.patch
	0002-changed-log-output-to-30-from-25.patch
	Who should the emails appear to be from? [Jessica Smith <jessica@example.com>]
	Emails will be sent from: Jessica Smith <jessica@example.com>
	Who should the emails be sent to? jessica@example.com
	Message-ID to be used as In-Reply-To for the first email? y

Dan spuuwt Git een bergje log-informatie uit voor elke patch die je stuurt, wat er ongeveer zo uitziet:

	(mbox) Adding cc: Jessica Smith <jessica@example.com> from
	  \line 'From: Jessica Smith <jessica@example.com>'
	OK. Log says:
	Sendmail: /usr/sbin/sendmail -i jessica@example.com
	From: Jessica Smith <jessica@example.com>
	To: jessica@example.com
	Subject: [PATCH 1/2] added limit to log function
	Date: Sat, 30 May 2009 13:29:15 -0700
	Message-Id: <1243715356-61726-1-git-send-email-jessica@example.com>
	X-Mailer: git-send-email 1.6.2.rc1.20.g8c5b.dirty
	In-Reply-To: <y>
	References: <y>

	Result: OK

## Samenvatting

In dit hoofdstuk is een aantal veel voorkomende workflows behandeld, die je kunt gebruiken om te kunnen werken in een aantal zeer verschillende typen Git projecten die je misschien zult tegenkomen. En er zijn een aantal nieuwe gereedschappen geïntroduceerd die je helpen om dit proces te beheren. Wat hierna volgt zal je laten zien hoe je aan de andere kant van de tafel werkt: een Git project beheren. Je zult leren hoe een welwillende dictator of integratie manager te zijn.
