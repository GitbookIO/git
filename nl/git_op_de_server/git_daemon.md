# Git daemon

Voor publieke ongeauthenticeerde leestoegang tot je projecten zul je het HTTP protocol achter je willen laten, en overstappen op het Git protocol. De belangrijkste reden is snelheid. Het Git protocol is veel efficiënter en daarmee sneller dan het HTTP protocol, dus het zal je gebruikers tijd besparen.

Nogmaals, dit is voor ongeauthenticeerde alleen-lezen toegang. Als je dit op een server buiten je firewall draait, zul je het alleen moeten gebruiken voor projecten die voor de hele wereld toegankelijk moeten zijn. Als de server waarop je het draait binnen je firewall staat, zou je het kunnen gebruiken voor projecten waarbij een groot aantal mensen of computers (continue integratie of bouwservers) alleen-lezen toegang moeten hebben, waarbij je niet voor iedereen een SSH sleutel wilt toevoegen.

In ieder geval is het Git protocol relatief eenvoudig in te stellen. Eigenlijk is het enige dat je moet doen dit commando op een daemon manier uitvoeren:

	git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

`--reuseaddr` staat de server toe om te herstarten zonder te wachten tot oude connecties een time-out krijgen, de `--base-path` optie staat mensen toe om projecten te clonen zonder het volledige pad te specificeren, en het pad aan het einde vertelt de Git daemon waar hij moet kijken voor de te exporteren repositories. Als je een firewall draait, zul je er poort 9418 open moeten zetten op de machine waar je dit op gaat doen.

Je kunt dit proces op een aantal manieren daemoniseren, afhankelijk van het besturingssystem waarop je draait. Op een Ubuntu machine, zul je een Upstart script gebruiken. Dus in het volgende bestand

	/etc/event.d/local-git-daemon

stop je dit script:

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

Omwille van veiligheidsredenen, wordt sterk aangeraden om deze daemon uit te voeren als gebruiker met alleen-lezen toegang op de repositories – je kunt dit makkelijk doen door een nieuwe gebruiker 'git-ro' aan te maken en de daemon als deze uit te voeren. Om het eenvoudig te houden voeren we het als dezelfde 'git' gebruiker uit, als waarin Gitosis draait.

Als je de machine herstart, zal de Git daemon automatisch opstarten en herstarten als de server onderuit gaat. Om het te laten draaien zonder te herstarten, kun je dit uitvoeren:

	initctl start local-git-daemon

Op andere systemen zul je misschien `xinetd` willen gebruiken, een script in je `sysvinit` systeem, of iets anders – zolang je dat commando maar ge-daemoniseerd krijgt en deze op een of andere manier in de gaten gehouden wordt.

Vervolgens zul je je Gitosis server moeten vertellen welke repositories je onauthenticeerde Gitserver gebaseerde toegang toestaat. Als je een sectie toevoegt voor iedere repository, dan kun je die repositories specificeren waarop je je Git daemon wilt laten lezen. Als je Git protocol toegang tot je iphone project wilt toestaan, dan voeg je dit toe aan het eind van het `gitosis.conf` bestand:

	[repo iphone_project]
	daemon = yes

Als dat gecommit en gepusht is, dan zou de draaiende daemon verzoeken moeten serveren aan iedereen die toegang heeft op poort 9418 van je server.

Als je besluit om Gitosis niet te gebruiken, maar je wilt toch een Git daemon instellen, dan moet je dit op ieder project uitvoeren waarvoor je de Git daemon wilt laten serveren:

	$ cd /path/to/project.git
	$ touch git-daemon-export-ok

De aanwezigheid van dat bestand vertelt Git dat het OK is om dit project zonder authenticatie te serveren.

Gitosis kan ook de projecten die GitWeb toont beheren. Eerst moet je zoiets als het volgende aan het `/etc/gitweb.conf` bestand toevoegen:

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

Je kunt instellen welke projecten GitWeb gebruikers laat bladeren door een `gitweb` instelling in het Gitosis configuratie bestand toe te voegen, of te verwijderen. Bijvoorbeeld, als je het iphone project op GitWeb wilt tonen, zorg je dat de `repo` instelling er zo uitziet:

	[repo iphone_project]
	daemon = yes
	gitweb = yes

Als je nu het project commit en pusht, begint GitWeb automatisch je `iphone_project` te tonen.
