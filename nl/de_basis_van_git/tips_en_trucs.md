# Tips en trucs

Voordat we dit hoofdstuk over de basis van Git afsluiten laten we je nog wat kleine tips en trucs zien die je Git ervaring een beetje eenvoudiger, makkelijker of bekender maken. Veel mensen gebruiken Git zonder deze tips, en we refereren er niet meer aan of gaan er niet vanuit dat je ze gebruikt verderop in dit boek; maar je zult waarschijnlijk willen weten hoe je ze moet doen.

## Auto-aanvulling

Als je de Bash shell gebruikt, heeft Git een prettige auto-aanvulling script dat je aan kunt zetten. Download het direct van de Git broncode op https://github.com/git/git/blob/master/contrib/completion/git-completion.bash. Kopieer dit bestand naar je home directory, en voeg dit aan je `.bashrc` bestand toe:

	source ~/.git-completion.bash

Als je Git wilt instellen dat het automatische Bash shell aanvulling heeft voor alle gebruikers, kopieer dit script dan naar de `/opt/local/etc/bash_completion.d` directory op Mac systemen, of naar de `/etc/bash_completion.d/` directory op Linux systemen. Dit is een directory met scripts dat Bash automatisch zal laden om shell aanvullingen aan te bieden.

Als je Windows gebruikt met Git Bash, wat de standaard is als je Git op Windows installeert met msysGit, dan zou auto-aanvulling voorgeconfigureerd moeten zijn.

Druk de Tab toets als je een Git commando aan het typen bent, en het zou een lijstje suggesties voor je moeten teruggeven:

	$ git co<tab><tab>
	commit config

In dit geval zal `git co` en dan de Tab toets twee keer indrukken git commit en config voorstellen. Als je daarna `m<tab>` toevoegt, wordt het automatisch tot `git commit` gecompleteerd.

Dit werkt ook met opties, wat nog bruikbaarder is. Bijvoorbeeld, als je een `git log` commando uitvoert en je een van de opties niet meer kunt herinneren, dan kun je beginnen met het te typen en Tab indrukken om te zien wat er past:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Dat is een erg handig trucje en zal je misschien wat tijd en documentatie lezen besparen.

## Git aliassen

Git zal geen commando's afleiden uit wat je gedeeltelijk intypt. Als je niet de hele tekst van ieder Git commando wilt intypen, kun je gemakkelijk een alias voor ieder commando configureren door `git config` te gebruiken. Hier zijn een aantal voorbeelden die je misschien wilt instellen:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Dit betekent dat je, bijvoorbeeld, in plaats van `git commit` je alleen `git ci` hoeft in te typen. Als je verder gaat met Git, zul je waarschijnlijk andere commando's ook vaker gaan gebruiken; in dat geval: schroom niet om nieuwe aliassen te maken.

Deze techniek kan ook makkelijk zijn om commando's te maken waarvan je vindt dat ze zouden moeten bestaan. Bijvoorbeeld, om het bruikbaarheidsprobleem wat je met het unstagen van een bestand tegenkwam op te lossen, kun je jouw eigen unstage alias aan Git toevoegen:

	$ git config --global alias.unstage 'reset HEAD --'

Dit maakt de volgende twee commando's equivalent:

	$ git unstage fileA
	$ git reset HEAD fileA

Het lijkt wat duidelijker. Het is ook gebruikelijk om een `last` commando toe te voegen:

	$ git config --global alias.last 'log -1 HEAD'

Op deze manier kun je de laatste commit makkelijk zien:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Zoals je kunt zien, vervangt Git eenvoudigweg het nieuwe commando met hetgeen waarvoor je het gealiassed hebt. Maar, misschien wil je een extern commando uitvoeren, in plaats van een Git subcommando. In dat geval begin je het commando met een `!` karakter. Dit is handig als je je eigen applicaties maakt die met een Git repository werken. We kunnen dit demonstreren door `git visual` een `gitk` te laten uitvoeren:

	$ git config --global alias.visual '!gitk'
