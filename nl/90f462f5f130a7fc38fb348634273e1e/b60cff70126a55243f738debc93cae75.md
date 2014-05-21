# Gitolite

Deze paragraaf fungeerrt als een snelle introductie tot Gitolite, en geeft korte installatie en setup instructies. Het kan echter niet de enoreme hoeveelheid [documentatie][gltoc] vervangen waar Gitolite mee wordt geleverd. Er kunnen ook af en toe wijzigingen in deze paragraaf worden gemaakt, dus je kunt wellicht ook [hier][gldpg] kijken voor de laatste versie.

[gldpg]: http://sitaramc.github.com/Gitolite/progit.html
[gltoc]: http://sitaramc.github.com/Gitolite/master-toc.html

Gitolite is een autorisatie-laag boven op Git, waar op ` sshd` of `httpd` wordt vertrouwd voor authenticatie. (Recapitulatie: authenticatie is het identificeren wie de gebruiker is, autoriseren is het besluiten of hetgeen wat deze gebruiker probeert te doen toegestaan is).

Gitolite stelt je in staat de permissies niet alleen per repository, maar ook per branch of tag naam binnen elke repository. Dus, je kunt aangeven dat bepaalde mensen (of groepen van mensen) alleen maar bepaalde "refs" (branches of tags) kunnen pushen maar niet andere.

## Installatie

Het installeren van Gitolite is zeer eenvoudig, zelfs als je de uitgebreide documentatie, dat erbij geleverd wordt, niet leest. Je hebt een account op een Unix(achtige) server nodig. Je hebt geen root toegang nodig, aangenomen dat Git, perl, en een OpenSSH compatible SSH server al zijn geïnstalleerd. In de onderstaande voorbeelden zullen we het `git` account gebruiken op een host genaamd `gitserver`.

Gitolite is nogal ongebruikelijk in de zin van "server" software - toegang gaat via SSH, en elke userid op de server is in potentie een "Gitolite host". We zullen de eenvoudigste installatie methode beschrijven in dit artikel. Voor de overige methodes verwijzen we je naar de documentatie.

Om te beginnen: maak een gebruiker genaamd `git` aan op je server en log met deze gebruiker in. Kopieer je SSH publieke sleutel (een bestand genaamd `~/.ssh/id_rsa.pub` als je een gewone `ssh-keygen` met alle standaardwaarden gedaan hebt) van je werkstation, en hernoem deze naar `<jouwnaam>.pub` (we zullen `scott.pub` gebruiken in onze voorbeelden). En voer dan deze commando's  uit:

	$ git clone git://github.com/sitaramc/Gitolite
	$ Gitolite/install -ln
	    # assumes $HOME/bin exists and is in your $PATH
	$ Gitolite setup -pk $HOME/scott.public

Dat laatste commando maakt een nieuwe Git repostory genaamd `Gitolite-admin` op de server aan.

Als laatste, terug op jouw werkstation, voer je het commando `git clone git@gitserver:Gitolite-admin` uit. En klaar is Kees! Gitolite is nu geinstalleerd op de server, en jij hebt nu een gloednieuwe repository genaamd `Gitolite-admin` op jouw werkstation. Jij beheert je Gitolite opstelling door veranderingen in deze repository te maken en die te pushen.

## De Installatie Aanpassen

Hoewel de standaard, snelle, installatie werkt voor de meeste mensen, zijn er een aantal manieren om de installatie aan te passen als dat nodig is. Sommige wijzigingen kunnen simpleweg gemaakt worden door het rc bestand te wijzigen, maar als dat niet volstaat is er documentatie over het aanpassen van Gitolite beschikbaar.

## Config bestand en Beheer van Toegangsregels

Zodra de installatie afgerond is, schakel je over naar de `Gitolite-admin` repository die je zojuist op je werkstation gemaakt hebt, en begin je rond te snuffelen om te zien wat je daar hebt:

	$ cd ~/Gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/Gitolite.conf
	keydir/scott.pub
	$ cat conf/Gitolite.conf

	repo Gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

Merk op dat "scott" (de naam van de pubkey in het `Gitolite setup` commando dat je eerder gebruikt hebt) lees- en schrijfrechten heeft op de `Gitolite-admin` repository en een publiek sleutelbestand met dezelfde naam.

Gebruikers toevoegen is eenvoudig. Om een gebruiker genaamd "alice" toe te voegen, verkrijg haar publieke sleutel, noem deze `alice.pub`, en zet deze in de `keyir` directory van de clone van de `Gitolite-admin` repositroy die je zojuist op je werkstation gemaakt hebt. Voeg de wijziging toe, commit en push de wijziging en de gebruiker is toegevoegd.

De syntax van het config bestand voor Gitolite is ruimhartig van documentatie voorzien in, dus we zullen ons beperken tot wat hoofdpunten.

Je kunt voor het gemak gebruikers of repositories groeperen. De groepnamen zijn vergelijkbaar met macros: als je ze definieert maakt het niet uit of het projecten of gebruikers zijn. Dat onderscheid wordt pas gemaakt als je de "macro" gaat *gebruiken*.

	@oss_repos      = linux perl rakudo git Gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

Je kunt de permissies beheren op het "ref" niveau. In het volgende voorbeeld kunnen stagieres (interns) alleen maar naar de "int" branch pushen. Techneuten (engineers) kunnen naar elke branch pushen waarvan de naam begint met "eng-", en tags die beginnen met "rc" gevolgd door een getal. En de admins kunnen alles (inclusief terugdraaien) naar elke ref.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

De expressie achter de `RW` of `RW+` is een zgn. regular expression (regex) waartegen de refname (ref) die wordt gepusht wordt vergeleken. Dus we gaan we deze uiteraard een "refex" noemen! En natuurlijk kan een refex veel krachtiger zijn dan hier wordt getoond, dus ga het niet overdrijven als je niet al te goed in de Perl regexen zit.

Zoals je wellicht al geraden hebt, gebruikt Gitolite de prefix `refs/heads/` als een syntactische handigheid indien de refex niet begint met `refs/`.

Een belangrijke eigenschap van de syntax van het config bestand is dat alle regels van een repository niet op één plek hoeft te staan. Je kunt al het generieke spul bij elkaar houden, zoals de regels voor alle `oss_repos` zoals ze hier boven staan, en dan op een latere plaats specifieke regels voor specifieke gevallen, zoals hier:

	repo Gitolite
	    RW+                     = sitaram

Deze regel wordt gewoon toegevoegd aan de set met regels voor de `Gitolite` repository.

Je zou je op dit punt kunnen afvragen hoe de toegangsregels eigenlijk worden toegepast, laten we dat kort behandelen.

Er zijn twee niveaus van toegangsbeheer in Gitolite. De eerste is op repository niveau. Als je lees- of schrijfrechten hebt tot *enige* ref in de repository, dan heb je lees (of schrijf)rechten tot de repository. Dit is de enige toegangsbeheer dat Gitosis had.

Het tweede niveau, alleen van toepassing voor "schrijf" toegang, is per branch of tag binnen een repository. De gebruikersnaam, het type toegang wat wordt gevraagd (`W` of '+'), en de refname dat wordt gewijzigd (geüpdate) zijn bekend. De toegangsregels worden gecontroleerd in volgorde van voorkomst in het config bestand, en er wordt gekeken naar een treffer voor deze combinatie (maar onthoudt dat de refname middels een regex wordt vergeleken, niet een simpele string-vergelijking). Als er een treffer is, dan slaagt de push. Als er geen treffer wordt gevonden (fallthrough) dan wordt toegang geweigerd.

## Geavanceerde Toegangs Controle met "deny" regels

Tot zover hebben we alleen permissies gezien uit het rijtje `R`, `RW` of `RW+`. Echter, Gitolite kent een andere permissie: `-`, wat staat voor "deny" (ontken). Dit geeft je veel meer macht, tegen kosten van wat hogere complexiteit omdat een fallthrough nu niet de *enige* manier is waarop toegang kan worden geweigerd; nu wordt *de volgorde van regels belangrijk*!

Stel dat, in de onderstaande situatie, we de techneuten in staat willen stellen elke branch te laten terugdraaien *behalve* master en integ. Dit is de manier om dat te doen:

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

Nogmaals, je hoeft slechts de regels van boven naar beneden af te lopen tot je een treffer hebt voor je gevraagde toegangswijze, of een afwijzing. Een push die niets terugdraait naar master of integ wordt door de eerste regel toegestaan. Een terugdraai-push naar deze refs geeft geen treffer op de eerste regel en valt door naar de tweede regel en wordt daarom geweigerd. Elke push (terugdraaiend of niet) naar refs anders dan master of integ zullen op de eerste twee regels zowiezo niet treffen en de derde regel staat dit toe.

## Beperken van pushes bij gewijzigde bestanden

Bovenop het beperken van pushrechten op branches voor een gebruiker, kan je ook de rechten van gebruikers beperken op bestanden. Als voorbeeld, misschien is de Makefile (of een ander programma) niet echt bedoeld om door iedereen te worden gewijzigd, omdat een groot aantal dingen afhankelijk ervan zijn of omdat het stuk loopt als de wijzigingen niet *precies goed* gebeuren. Je kunt het Gitolite duidelijk maken:

    repo foo
        RW                      =   @junior_devs @senior_devs

        -   VREF/NAME/Makefile  =   @junior_devs

Gebruikers die migreren van de oudere versie van Gitolite moeten opmerken dat er een significant verschil in het gedrag wat betreft deze eigenschap; zie de migratiegids voor meer details.

## Persoonlijke branches

Gitolite heeft ook een mogelijkheid van "persoonlijke branches" (of liever gezegd "persoonlijke branch namespace") wat erg nuttig kan zijn in een bedrijfssituatie.

Veel van de code-uitwisselingen in de Git-wereld verlopen via zgn. "please pull" aanvragen. In een bedrijfsomgeving echter is ongeauthoriseerde toegang taboe, en het werkstation van een ontwikkelaar kan geen authenticatie doen, dus je moet naar de centrale server pushen en iemand vragen daarvandaan te pullen.

Dit zou normaalgesproken een gelijksoortige branch-brij veroorzaken als in een gecentraliseerde versiebeheersysteem, en daarbij wordt het opzetten van permissies een vervelende klus voor de administrator.

Gitolite stelt je in staat een "personal" of "scratch" namespace prefix voor elke ontwikkelaar te definiëren (bijvoorbeeld `refs/personal/<devname>/*`); we verwijzen naar de documentatie voor details.

## "Wildcard" repositores

Gitolite laat je repositories specificeren met wildcards (eigenlijk Perl regex expressies), zoals bijvoorbeeld `assignments/s[0-9][0-9]/a[0-9][0-9]`, om maar een willekeurig voorbeeld te nemen. Dit stelt je in staat om een nieuwe permissie modus (`C`) toe te wijzen die gebruikers in staat stelt repositories te maken op basis van zulk wildcards, automatisch eigenaarschap toe te wijzen aan de gebruiker die hem heeft aangemaakt, staat deze gebruiker toe om "R" en "RW" permissies aan anderen toe te wijzen om samen te werken, etc. Nogmaals: zie de documentatie voor meer details.

## Andere eigenschappen

We ronden deze uiteenzetting af met een passe partout van andere eigenschappen, welke alle (en nog vele andere) tot in de kleinste detail zijn beschreven in de documentatie.

**Logging**: Gitolite logt alle succesvolle toegangspogingen. Als je wat te los bent geweest in het toekennen van terugdraai permissies (`RW+`) en een of andere bijdehand heeft "master" vernaggelt, is de log-file een redder in de nood in de zin van snel en eenvoudig achterhalen van de SHA die verdwenen is.

**Rapportage van toegangsrechten**: Nog zo'n handige eigenschap is wat er gebeurt als je gewoon met ssh naar de server gaat. Gitolite laat zien welke repositories je toegang toe hebt en welke soort toegang dat dan is. Hier is een voorbeeld:

        hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4

             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**Delegeren**: Voor extreem grote installaties kan je de verantwoordelijkheid voor groepen van repositories delegeren aan verschillende mensen en hen het beheer van die delen onafhankelijk laten regelen. Dit vermindert de werkdruk van de hoofd-beheerder, en maakt van hem minder een faalpunt. 

**Mirroring**: Gitolite kan je ondersteunen bij het beheren van meerdere mirrors, en het eenvoudig daartussen overschakelen als de primaire server uitvalt.
