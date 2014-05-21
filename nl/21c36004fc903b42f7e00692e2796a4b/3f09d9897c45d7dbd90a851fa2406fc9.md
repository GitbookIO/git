# De refspec

Door dit boek heen heb je eenvoudige verwijzingen van remote branches naar lokale referenties gebruikt, maar ze kunnen ingewikkelder zijn.
Stel dat je een remote als deze toevoegt:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

Dit voegt een sectie toe aan je `.git/config` bestand, met de naam van de remote (`origin`), de URL van de remote repository, en de refspec die nodig is om te fetchen:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

Het formaat van de refspec is een optionele `+`, gevolgd door `<src>:<dst>`, waarbij `<src>` het patroon voor referenties aan de remote kant is, en `<dst>` de locatie is waar die referenties lokaal geschreven zullen worden. De `+` vertelt Git om de referentie zelfs te vernieuwen als het geen fast-forward is.

In het standaard geval dat automatisch geschreven wordt door een `git remote add` commando, haalt Git alle referenties onder `refs/heads/` van de server op en schrijft ze lokaal naar `refs/remotes/origin/`. Dus als er een `master` branch op de server bestaat, kan je de log van die branch lokaal benaderen via

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

Ze zijn allemaal gelijk, omdat Git elk expandeert naar `refs/remotes/origin/master`.

Als je wilt dat Git alleen de `master` branch pulled, en niet alle andere branches op de remote server, kun je de fetch regel veranderen in

	fetch = +refs/heads/master:refs/remotes/origin/master

Dit is alleen de standaard refspec voor `git fetch` voor die remote. Als je iets eenmalig wilt doen, kan je de refspec ook op de commandoregel specificeren. Om de `master` branch op de remote naar de lokale `origin/mymaster` te pullen, kun je dit uitvoeren

	$ git fetch origin master:refs/remotes/origin/mymaster

Je kunt ook meerdere refspecs specificeren. Met de commandoregel kan je meerdere branches op deze manier pullen:

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

In dit geval werd de pull van de master branch geweigerd, omdat het geen fast-forward referentie is. Je kunt dat teniet doen door de `+` voor de refspec te zetten.

Je kun ook meerdere refspecs voor het fetchen specificeren in je configuratie bestand. Als je altijd de master en experiment branches wilt fetchen, voeg je twee regels toe:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Je kunt geen gedeeltelijke globs in het patroon gebruiken, dus het volgende zou ongeldig zijn:

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

Maar je kunt wel namespaces (naamruimtes) gebruiken om zoiets voor elkaar te krijgen. Als je een QA team hebt dat naar een bepaalde reeks branches pusht, en je wilt de master branch en alle QA team branches hebben, maar niets anders, kun je een configuratie sectie zoals dit gebruiken:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

Als je een ingewikkelde workflow hebt waarbij het QA team branches pusht, ontwikkelaars branches pushen, en integratie teams op remote branches pushen en samenwerken, kun je ze op deze manier eenvoudig in namespaces onderverdelen.

## Refspecs pushen

Het is prettig dat je op die manier referenties met namespaces kunt fetchen, maar hoe krijgt het QA team om te beginnen al hun branches in een `qa/` namespace? Je krijgt dat voor elkaar door refspecs te gebruiken voor het pushen.

Als het QA team hun `master` branch naar `qa/master` op de remote server wil pushen, kunnen ze dit uitvoeren

	$ git push origin master:refs/heads/qa/master

Als ze willen dat Git dat automatisch doet iedere keer als ze `git push origin` uitvoeren, dan kunnen ze een `push` waarde aan hun configuratie bestand toevoegen:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

Nogmaals, dit zal zorgen dat `git push origin` de lokale `master` branch standaard naar de remote `qa/master` branch zal pushen.

## Referenties verwijderen

Je kunt de refspec ook gebruiken om referenties te verwijderen van de remote server door zoiets als dit uit te voeren:

	$ git push origin :topic

Omdat de refspec `<src>:<dst>` is, wordt door het weglaten van het `<src>` gedeelte in feite verteld dat de onderwerp branch op de remote niets is, waardoor het verwijderd wordt.
