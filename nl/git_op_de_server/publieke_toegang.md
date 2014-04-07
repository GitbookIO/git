# Publieke toegang

Wat als je anonieme leestoegang op je project wil? Misschien wil je geen intern privé project beheren, maar een open source project. Of misschien heb je een aantal geautomatiseerde bouwservers of continue integratie servers die vaak wisselen, en wil je niet doorlopend SSH sleutels hoeven genereren – je wil gewoon eenvoudige anonieme leestoegang toevoegen.

Waarschijnlijk is de eenvoudigste manier voor kleinschalige opstellingen om een statische webserver in te stellen, waarbij de document root naar de plaats van je Git repositories wijst, en dan de `post-update` hook aanzetten waar we het in de eerste paragraaf van dit hoofdstuk over gehad hebben. Laten we eens uitgaan van het voorgaande voorbeeld. Stel dat je je repositories in de `/opt/git` directory hebt staan, en er draait een Apache server op je machine. Nogmaals, je kunt hiervoor iedere web server gebruiken: maar als voorbeeld zullen we wat simpele Apache configuraties laten zien, die je het idee weergeven van wat je nodig hebt.

Eerst moet je de haak inschakelen:

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Wat doet deze `post-update` haak? Het ziet er eigenlijk als volgt uit:

	$ cat .git/hooks/post-update
	#!/bin/sh
	#
	# An example hook script to prepare a packed repository for use over
	# dumb transports.
	#
	# To enable this hook, rename this file to "post-update".
	#
	
	exec git-update-server-info

Dit betekent dat wanneer je naar de server via SSH pusht, Git dit commando uitvoert om de benodigde bestanden voor HTTP fetching te verversen.

Vervolgens moet je een VirtualHost regel in je Apache configuratie aanmaken, met de document root als de hoofddirectory van je Git projecten. Hier nemen we aan dat je wildcard DNS ingesteld hebt om `*.gitserver` door te sturen naar de machine waar je dit alles draait:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

Je zult ook de Unix gebruikers groep van de `/opt/git` directories moeten zetten op `www-data` zodat je web server leestoegang hebt op de repositories, omdat de Apache instantie het CGI script (standaard) uitvoert als die gebruiker draait:

	$ chgrp -R www-data /opt/git

Als je Apache herstart, dan zou je je repositories onder die directory moeten kunnen clonen door de URL van je project te specificeren:

	$ git clone http://git.gitserver/project.git

Op deze manier kun je HTTP-gebaseerde toegang voor elk van je projecten voor een groot aantal gebruikers in slechts een paar minuten regelen. Een andere eenvoudige optie om publieke ongeauthenticeerde toegang in te stellen is een Git daemon te starten, alhoewel dat vereist dat je het proces als daemon uitvoert – we beschrijven deze optie in de volgende paragraaf als je een voorkeur hebt voor deze variant.
