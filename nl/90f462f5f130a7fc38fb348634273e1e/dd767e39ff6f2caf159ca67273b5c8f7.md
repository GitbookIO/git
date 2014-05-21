# Gitosis

De publieke sleutels van alle gebruikers in een `authorized_keys` bestand bewaren voor toegang werkt slechts korte tijd goed. Als je honderden gebruikers hebt, dan is het te bewerkelijk om dat proces te blijven volgen. Je moet iedere keer in de server inloggen, en er is geen toegangscontrole – iedereen in het bestand heeft lees- en schrijftoegang op ieder project.

Op dat moment zou je kunnen overwegen een veelgebruikt software project genaamd Gitosis te gaan gebruiken. Gitosis is in feite een verzameling scripts die je helpen het `authorized_keys` bestand te beheren alsmede eenvoudig toegangscontrole te implementeren. Het interessante hieraan is dat de gebruikers interface voor deze applicatie om mensen toe te voegen en toegang te bepalen, geen web interface is maar een speciale Git repository. Je beheert de informatie in dat project en als je het pusht, dan herconfigureert Gitosis de server op basis van dat project, wat best wel slim bedacht is.

Gitosis installeren is niet de makkelijkste taak ooit, maar het is ook niet al te moeilijk. Het is het makkelijkste om er een Linux server voor te gebruiken – deze voorbeelden gebruiken een standaard Ubuntu 8.10 server.

Gitosis vereist enkele Python tools, dus moet je eerst het Python setuptools pakket installeren, wat Ubuntu beschikbaar stelt als python-setuptools:

	$ apt-get install python-setuptools

Vervolgens kloon en installeer je Gitosis van de hoofdpagina van het project:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

Daarmee worden een aantal executables geïnstalleerd, die Gitosis zal gebruiken. Daarna wil Gitosis zijn repositories onder `/home/git` stoppen, wat prima is. Maar je hebt je repositories al in `/opt/git` geconfigureerd, dus in plaats van alles te herconfigureren maken we een symbolische link aan:

	$ ln -s /opt/git /home/git/repositories

Gitosis zal de sleutels voor je beheren, dus je moet het huidige bestand verwijderen, om de sleutels later opnieuw toe te voegen en Gitosis het `authorized_keys` bestand automatisch laten beheren. Voor nu verplaatsen we het `authorized_keys` bestand:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

Nu moet je de shell terugzetten voor de 'git' gebruiker, als je het veranderd hebt naar het `git-shell` commando. Mensen zullen nog steeds niet in staat zijn in te loggen, Gitosis zal dat voor je beheren. Dus, laten we deze regel veranderen in je `/etc/passwd` bestand

	git:x:1000:1000::/home/git:/usr/bin/git-shell

terug naar dit:

	git:x:1000:1000::/home/git:/bin/sh

Nu wordt het tijd om Gitosis te initialiseren. Je doet dit door het `gitosis-init` commando met je eigen publieke sleutel uit te voeren. Als je publieke sleutel niet op de server staat zul je het daar naartoe moeten kopiëren:

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Dit staat de gebruiker met die sleutel toe de hoofd Git repository die de Gitosis setup regelt, aan te passen. Daarna zul je met de hand het execute bit op het `post-update` script moeten aanzetten voor je nieuwe beheer repository.

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Je bent nu klaar voor de start. Als je alles juist hebt ingesteld, kun je nu met SSH in je server loggen als de gebruiker waarvoor je de publieke sleutel hebt toegevoegd om Gitosis te initialiseren. Je zou dan zoiets als dit moeten zien:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	ERROR:gitosis.serve.main:Need SSH_ORIGINAL_COMMAND in environment.
	  Connection to gitserver closed.

Dat betekent dat Gitosis je herkend heeft, maar je buitensluit omdat je geen Git commando's aan het doen bent. Dus, laten we een echt Git commando doen; je gaat de Gitosis beheer repository clonen:

	# op je locale computer
	$ git clone git@gitserver:gitosis-admin.git

Nu heb je een directory genaamd `gitosis-admin`, die twee hoofd gedeeltes heeft:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

Het `gitosis.conf` bestand is het beheer bestand dat je zult gebruiken om gebruikers, repositories en permissies te specificeren. De `keydir` directory is de plaats waar je de publieke sleutels opslaat van alle gebruikers die een vorm van toegang tot de repositories hebben – één bestand per gebruiker. De naam van het bestand in `keydir` (in het vorige voorbeeld, `scott.pub`) zal anders zijn in jouw geval – Gitosis haalt de naam uit de beschrijving aan het einde van de publieke sleutel die was geïmporteerd met het `gitosis-init` script.

Als je naar het `gitosis.conf` bestand kijkt, zou het alleen informatie over het zojuist gekloonde `gitosis-admin` project mogen bevatten:

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

Het laat je zien dat de gebruiker 'scott' – de gebruiker met wiens publieke sleutel je Gitosis geïnitialiseerd hebt – de enige is die toegang heeft tot het `gitosis-admin` project.

Laten we nu een nieuw project voor je toevoegen. Je voegt een nieuwe sectie genaamd `mobile` toe, waar je de ontwikkelaars in het mobile team neerzet, en de projecten waar deze ontwikkelaars toegang tot moeten hebben. Omdat 'scott' op het moment de enige gebruiker in het systeem is, zul je hem als enig lid toevoegen en voeg je een nieuw project genaamd `iphone_project` toe om mee te beginnen:

	[group mobile]
	writable = iphone_project
	members = scott

Wanneer je wijzigingen aan het `gitosis-admin` project maakt, moet je de veranderingen committen en terug pushen naar de server voordat ze effect hebben:

	$ git commit -am 'add iphone_project and mobile group'
	[master 8962da8] add iphone_project and mobile group
	 1 file changed, 4 insertions(+)
	$ git push origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 272 bytes | 0 bytes/s, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:gitosis-admin.git
	   fb27aec..8962da8  master -> master

Je kunt je eerste push naar het nieuwe `iphone_project` doen door je server als een remote aan je locale versie van je project toe te voegen en te pushen. Je hoeft geen bare repositories handmatig meer te maken voor nieuwe projecten op de server — Gitosis maakt ze automatisch als het de eerste push ziet:

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes | 0 bytes/s, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Merk op dat je geen pad hoeft te specificeren (sterker nog, het wel doen zal niet werken), alleen een dubbele punt en dan de naam van het project — Gitosis zal het voor je vinden.

Je wil samen met je vrienden aan dit project werken, dus je zult hun publieke sleutels weer toe moeten voegen. Maar in plaats van ze handmatig aan het `~/.ssh/authorized_keys` bestand op je server toe te voegen, voeg je ze één sleutel per bestand, aan de `keydir` directory toe. Hoe je de sleutels noemt bepaalt hoe je aan de gebruikers refereert in het `gitosis.conf` bestand. Laten we de publieke sleutels voor John, Josie en Jessica toevoegen:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Nu kun je ze allemaal aan je 'mobile' team toevoegen zodat ze lees- en schrijftoegang hebben tot het `iphone_project`:

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

Daarna commit en push je de wijziging, waarna vier gebruikers in staat zullen zijn te lezen en te schrijven van en naar dat project.

Gitosis heeft ook eenvoudige toegangscontrole. Als je wilt dat John alleen lees toegang tot dit project heeft, dan kun je in plaats daarvan dit doen:

	[group mobile]
	writable = iphone_project
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_project
	members = john

Nu kan John het project clonen en updates krijgen, maar Gitosis zal hem niet toestaan om terug naar het project te pushen. Je kunt zoveel van deze groepen maken als je wilt, waarbij ze alle verschillende gebruikers en projecten mogen bevatten. Je kunt ook een andere groep als een van de leden specificeren (met @ als voorvoegsel), waarmee de groepsleden automatisch worden overerfd:

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_project
	members   = @mobile_committers

	[group mobile_2]
	writable  = another_iphone_project
	members   = @mobile_committers john

Als je problemen hebt, kan het handig zijn om `loglevel=DEBUG` onder de `[gitosis]` sectie te zetten. Als je je push-toegang bent verloren door een kapotte configuratie te pushen, kun je het handmatig repareren in het bestand `/home/git/.gitosis.conf` op de server – het bestand waar Gitosis zijn informatie vandaan haalt. Een push naar het project neemt het `gitosis.conf` bestand dat je zojuist gepusht hebt en stopt het daar. Als je het bestand handmatig aanpast, zal het zo blijven totdat de volgende succesvolle push gedaan wordt naar het `gitosis-admin` project.
