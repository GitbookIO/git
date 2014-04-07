# Git op een server krijgen

Om een Git server initieel op te zetten, moet je een bestaande repository naar een kale repository exporteren – een repository dat geen werkmap bevat. Dit is over het algemeen eenvoudig te doen.
Om je repository te clonen met als doel het maken van een kale repository, voer je het clone commando uit met de `--bare` optie. Als conventie eindigen de namen van kale repository directories met `.git`, zoals hier:

	$ git clone --bare my_project my_project.git
	Cloning into bare repository 'my_project.git'...
	done.

De output van dit commando is een beetje verwarrend. Het commando `clone` is eigenlijk een `git init` en dan een `git fetch`, wat we hier zien is de output van het `git init` gedeelte wat een lege directory aanmaakt. De eigenlijke object overdracht geeft geen output, maar het gebeurt wel. Nu zou je een kopie van de Git directory data in je `my_project.git` directory moeten hebben.

Dit is grofweg gelijk aan dit

	$ cp -Rf my_project/.git my_project.git

Er zijn een paar kleine verschillen in het configuratie bestand, maar het komt op hetzelfde neer. Het neemt de Git repository zelf, zonder een werkdirectory, en maakt een directory specifiek hiervoor aan.

## De Kale Repository op een Server Zetten

Nu je een kale kopie van je repository hebt, is het enige dat je moet doen het op een server zetten en je protocollen instellen. Laten we aannemen dat je een server ingericht hebt die `git.example.com` heet, waar je SSH toegang op hebt, en waar je al je Git repositories wilt opslaan onder de `/opt/git` directory. Je kunt je nieuwe repository beschikbaar stellen door je kale repository ernaartoe te kopiëren:

	$ scp -r my_project.git user@git.example.com:/opt/git

Vanaf dat moment kunnen andere gebruikers, die SSH toegang hebben tot dezelfde server en lees-toegang hebben tot de `/opt/git` directory, jouw repository clonen door dit uit te voeren:

	$ git clone user@git.example.com:/opt/git/my_project.git

Als een gebruiker met SSH op een server inlogt en schrijftoegang heeft tot de `/opt/git/my_project.git` directory, dan hebben ze automatisch ook push toegang. Git zal automatisch de correcte groep schrijfrechten aan een repository toekennen als je het `git init` commando met de `--shared` optie uitvoert.

	$ ssh user@git.example.com
	$ cd /opt/git/my_project.git
	$ git init --bare --shared

Je ziet hoe eenvoudig het is om een Git repository te nemen, een kale versie aan te maken, en het op een server plaatsen waar jij en je medewerkers SSH toegang tot hebben. Nu zijn jullie klaar om aan hetzelfde project samen te werken.

Het is belangrijk om op te merken dat dit letterlijk alles is wat je moet doen om een bruikbare Git server te draaien waarop meerdere mensen toegang hebben: maak alleen een paar accounts met SSH toegang aan op een server, en stop een kale repository ergens waar al die gebruikers lees- en schrijftoegang toe hebben. Je bent er klaar voor – je hebt niets anders nodig.

In de volgende paragrafen zul je zien hoe je meer ingewikkelde opstellingen kunt maken. Deze bespreking zal het niet hoeven aanmaken van gebruikers accounts voor elke gebruiker, publieke leestoegang tot repositories, grafische web interfaces, het gebruik van de Gitosis applicatie en meer omvatten. Maar, hou in gedachten dat om samen te kunnen werken met mensen op een privé project, alles wat je _nodig_ hebt een SSH server is en een kale repository.

## Kleine opstellingen

Als je met een kleine groep bent of net begint met Git in je organisatie en slechts een paar ontwikkelaars hebt, dan kunnen de dingen eenvoudig voor je zijn. Een van de meest gecompliceerde aspecten van een Git server instellen is het beheren van gebruikers. Als je sommige repositories alleen-lezen voor bepaalde gebruikers wilt hebben, en lezen/schrijven voor anderen, dan kunnen toegang en permissies een beetje lastig in te stellen zijn.

### SSH toegang

Als je al een server hebt waar al je ontwikkelaars SSH toegang op hebben, dan is het over het algemeen het eenvoudigste om je eerste repository daar op te zetten, omdat je dan bijna niets hoeft te doen (zoals beschreven in de vorige paragraaf). Als je meer complexe toegangscontrole wilt op je repositories, dan kun je ze instellen met de normale bestandssysteem permissies van het operating systeem dat op je server draait.

Als je je repositories op een server wilt zetten, die geen accounts heeft voor iedereen in je team die je schrijftoegang wilt geven, dan moet je SSH toegang voor ze opzetten. We gaan er vanuit dat je een server hebt waarmee je dit kunt doen, dat je reeds een SSH server geïnstalleerd hebt, en dat de manier is waarop je toegang hebt tot de server.

Er zijn een paar manieren waarop je iedereen in je team toegang kunt geven. De eerste is voor iedereen accounts aanmaken, wat rechttoe rechtaan is maar bewerkelijk kan zijn. Je wilt vermoedelijk niet `adduser` uitvoeren en tijdelijke wachtwoorden instellen voor iedere gebruiker.

Een tweede methode is een enkele 'git' gebruiker aan te maken op de machine, aan iedere gebruiker die schijftoegang moet hebben vragen of ze je een publieke SSH sleutel sturen, en die sleutel toevoegen aan het `~/.ssh/authorized_keys` bestand van die nieuwe 'git' gebruiker. Vanaf dat moment zal iedereen toegang hebben op die machine via de 'git' gebruiker. Dit tast de commit data op geen enkele manier aan – de SSH gebruiker waarmee je inlogt zal de commits die je opgeslagen hebt niet beïnvloeden.

Een andere manier waarop je het kunt doen is je SSH server laten authenticeren middels een LDAP server of een andere gecentraliseerde authenticatie bron, die misschien al ingericht is. Zolang iedere gebruiker shell toegang kan krijgen op de machine, zou ieder SSH authenticatie mechanisme dat je kunt bedenken moeten werken.
