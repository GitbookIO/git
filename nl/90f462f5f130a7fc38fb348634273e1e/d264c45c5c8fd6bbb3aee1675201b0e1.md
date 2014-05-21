# De protocollen

Git kan vier veel voorkomende netwerk protocollen gebruiken om data te transporteren: Lokaal, Beveiligde Shell (Secure Shell, SSH), Git en HTTP. Hier bespreken we wat deze zijn, en in welke omstandigheden je ze zou willen gebruiken (of juist niet).

Het is belangrijk om op te merken dat, met uitzondering van de HTTP protocollen, ze allemaal een werkende Git versie op de server geïnstalleerd moeten hebben.

## Lokaal protocol

Het simpelste is het _Lokale protocol_, waarbij de remote repository in een andere directory op de schijf staat. Deze opzet wordt vaak gebruikt als iedereen in het team toegang heeft op een gedeeld bestandssyteem zoals een NFS mount, of in het weinig voorkomende geval dat iedereen op dezelfde computer werkt. Het laatste zou niet ideaal zijn, want dan zouden alle repositories op dezelfde computer staan, zodat de kans op een fataal verlies van gegevens veel groter wordt.

Als je een gedeeld bestandssyteem hebt, dan kun je clonen, pushen en pullen van een op een lokaal bestand aanwezige repository. Om een dergelijk repository te clonen, of om er een als een remote aan een bestaand project toe te voegen, moet je het pad naar het repository als URL gebruiken. Bijvoorbeeld, om een lokaal repository te clonen, kun je zoiets als het volgende uitvoeren:

	$ git clone /opt/git/project.git

Of je kunt dit doen:

	$ git clone file:///opt/git/project.git

Git werkt iets anders als je expliciet `file://` aan het begin van de URL zet. Als je alleen het pad specificeert, probeert Git hardlinks te gebruiken naar de bestanden die het nodig heeft. Als ze niet op hetzelfde bestandssysteem staan zal Git de objecten die het nodig heeft kopiëren, gebruikmakend van het standaard kopieer mechanisme van het besturingssysteem. Als je `file://` specificeert, dan start Git de processen die het normaal gesproken gebruikt om data te transporteren over een netwerk, wat over het algemeen een minder efficiënte methode is om gegevens over te dragen. De belangrijkste reden om `file://` wel te specificeren is als je een schone kopie van de repository wilt met de vreemde referenties of objecten eruit gelaten; over het algemeen na een import uit een ander versiebeheer systeem of iets dergelijks (zie Hoofdstuk 9 voor onderhoudstaken). We zullen het normale pad hier gebruiken, omdat het bijna altijd sneller is om het zo te doen.

Om een lokale repository aan een bestaand Git project toe te voegen, kun je iets als het volgende uitvoeren:

	$ git remote add local_proj /opt/git/project.git

Daarna kun je op gelijke wijze pushen naar, en pullen van die remote als je over een netwerk zou doen.

### De voordelen

De voordelen van bestands-gebaseerde repositories zijn dat ze eenvoudig zijn en ze maken gebruik van bestaande bestandspermissies en netwerk toegang. Als je al een gedeeld bestandssysteem hebt waar het hele team al toegang toe heeft, dan is een repository opzetten heel gemakkelijk. Je stopt de kale repository ergens waar iedereen gedeelde toegang tot heeft, en stelt de lees- en schrijfrechten in zoals je dat bij iedere andere gedeelde directory zou doen. In de volgende paragraaf "Git op een Server Krijgen" bespreken we hoe je een kopie van een kale repository kunt exporteren voor dit doeleinde.

Dit is ook een prettige optie om snel werk uit een repository van iemand anders te pakken. Als jij en een collega aan hetzelfde project werken, en hij wil dat je iets bekijkt, dan is het uitvoeren van een commando zoals `git pull /home/john/project` vaak makkelijker dan wanneer hij naar een remote server moet pushen, en jij er van moet pullen.

### De nadelen

Één van de nadelen van deze methode is dat gedeelde toegang over het algemeen moeilijker op te zetten en te bereiken is vanaf meerdere lokaties dan simpele netwerk toegang. Als je wilt pushen van je laptop als je thuis bent, dan moet je de remote schijf aankoppelen, wat moeilijk en langzaam kan zijn in vergelijking met met netwerk gebaseerde toegang.

Het is ook belangrijk om te vermelden dat het niet altijd de snelste optie is als je een gedeeld koppelpunt (mount) of iets dergelijks gebruikt. Een lokale repository is alleen snel als je snelle toegang tot de data hebt. Een repository op NFS is vaak langzamer dan een repository via SSH op dezelfde server omdat dit Git in staat stelt om op lokale schijven te werken op elk van de betrokken systemen.

## Het SSH protocol

Waarschijnlijk het meest voorkomende protocol voor Git is SSH. De reden hiervoor is dat toegang met SSH tot servers in veel plaatsen al geconfigureerd is; en als dat niet het geval is, dan is het eenvoudig om dat te doen. SSH is ook het enige netwerk gebaseerde protocol waarvan je makkelijk kunt lezen en naartoe kunt schrijven. De andere twee netwerk protocollen (HTTP en Git) zijn over het algemeen alleen-lezen, dus zelfs als je ze al beschikbaar hebt voor de ongeïnitieerde massa, dan heb je nog steeds SSH nodig voor je eigen schrijfcommandos. SSH is ook een geauthenticieerd protocol; en omdat het alom aanwezig is, is het over het algemeen eenvoudig om in te stellen en te gebruiken.

Om een Git repository via SSH te clonen, kun je een ssh:// URL opgeven zoals:

	$ git clone ssh://user@server/project.git

Of je gebruikt de kortere scp-achtige syntax voor het SSH protocol:

	$ git clone user@server:project.git

Je kunt ook de gebruiker weglaten, en Git gebruikt de gegevens van de gebruiker waarmee je op dat moment bent ingelogd.

### De voordelen

Er zijn vele voordelen om SSH te gebruiken. Ten eerste moet je het eigenlijk wel gebruiken als je geauthenticeerde schrijftoegang op je repository via een netwerk wilt. Ten tweede is het relatief eenvoudig in te stellen: SSH daemons komen veel voor, veel systeembeheerders hebben er ervaring mee, en veel operating systemen zijn er mee uitgerust of hebben applicaties om ze te beheren. Daarnaast is toegang via SSH veilig: alle data transporten zijn versleuteld en geauthenticeerd. En als laatste is SSH efficiënt, net zoals bij het Git en lokale protocol worden de gegevens zo compact mogelijk gemaakt voordat het getransporteerd wordt.

### De nadelen

Het negatieve aspect van SSH is dat je er geen anonieme toegang naar je repository over kunt geven. Mensen moeten via SSH toegang hebben om er gebruik van te kunnen maken zelfs als het alleen lezen is, dit maakt dat SSH toegang niet echt bevordelijk is voor open source projecten. Als je het alleen binnen je bedrijfsnetwerk gebruikt, is SSH wellicht het enige protocol waar je mee in aanraking komt. Als je anonieme alleen-lezen toegang wilt toestaan tot je projecten, dan moet je SSH voor jezelf instellen om over te pushen, maar iets anders voor anderen om over te pullen.

## Het Git protocol

Het volgende is het Git protocol. Dit is een specifieke daemon, die met Git meegeleverd wordt. Het luistert op een toegewezen poort (9418), en verleent een vergelijkbare dienst als het SSH protocol, maar dan zonder enige vorm van authenticatie. Om een repository beschikbaar te stellen over het Git protocol, moet je een `git-export-daemon-ok` bestand aanmaken – de daemon zal een repository zonder dit bestand erin niet verspreiden – maar daarbuiten is er geen beveiliging. De Git repository is beschikbaar om gecloned te kunnen worden door iedereen, of het is het niet. Dit betekent dat er over het algemeen geen pushing is via dit protocol. Je kunt push toegang aanzetten maar gegeven het gebrek aan authenticatie kan, als je de push toegang aan zet, iedereen die de URL van jouw project op het internet vindt pushen naar jouw project. We volstaan met te zeggen dat dit zelden de bedoeling kan zijn.

### De voordelen

Het Git protocol is het snelste dat beschikbaar is. Als je veel verkeer verwerkt voor een publiek project, of een zeer groot project dat geen gebruikersauthenticatie nodig heeft voor leestoegang, dan is het waarschijnlijk dat je een Git daemon wilt inrichten om je project te verspreiden. Het maakt van hetzelfde data-transport mechanisme gebruik als het SSH protocol, maar dan zonder de extra belasting van versleuteling en authenticatie.

### De nadelen

Het nadeel van het Git protocol is het gebrek aan authenticatie. Het is over het algemeen onwenselijk dat het Git protocol de enige toegang tot je project is. Meestal zul je het samen met SSH toegang gebruiken voor de paar ontwikkelaars die push (schrijf-)toegang hebben en de rest laat je `git://` voor alleen leestoegang gebruiken.
Het is waarschijnlijk ook het meest ingewikkelde protocol om in te richten. Het moet een eigen daemon hebben, die speciaal voor die situatie ingericht is – we zullen er een instellen in de "Gitosis" paragraaf van dit hoofdstuk – het gebruikt `xinetd` configuratie of iets vergelijkbaars, wat ook niet altijd eenvoudig is op te zetten. Daarbij is ook firewall toegang tot poort 9418 nodig, wat geen standaard poort is dat in bedrijfsfirewalls is opengezet. Bij firewalls van grote bedrijven, is deze ongebruikelijke poort meestal dichtgezet.

## Het HTTP/S protocol

Als laatste hebben we het HTTP protocol. Het mooie aan het HTTP of HTTPS protocol is dat het simpel in te stellen is. Eigenlijk is alles wat je moet doen de kale Git repository in je HTTP document root zetten, en een specifieke `post-update` hook (haak) instellen en je bent klaar (zie hoofdstuk 7 voor details over Git hooks). Vanaf dat moment kan iedereen die toegang heeft tot de webserver waar je de repository op gezet hebt ook je repository clonen. Om leestoegang tot je repository over HTTP toe te staan, doe je zoiets als het volgende:

	$ cd /var/www/htdocs/
	$ git clone --bare /path/to/git_project gitproject.git
	$ cd gitproject.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Dat is alles. De `post-update` hook, die standaard bij Git geleverd wordt, voert het noodzakelijke commando (`git update-server-info`) uit om HTTP fetching en cloning goed werkend te krijgen en houden. Dit commando wordt uitgevoerd als je via SSH naar deze repository pusht, en andere mensen kunnen clonen met behulp van zoiets als

	$ git clone http://example.com/gitproject.git

In dit specifieke voorbeeld gebruiken we het `/var/www/htdocs` pad wat gebruikelijk is voor Apache opstellingen, maar je kunt iedere statische webserver gebruiken – gewoon de kale repository in het betreffende pad neerzetten. De Git data wordt geserveerd als standaard statische bestanden (zie hoofdstuk 9 voor details over hoe het precies geserveerd wordt).

Het is mogelijk om Git ook over HTTP te laten pushen, alhoewel dat geen veelgebruikte techniek is en het vereist dat je complexe WebDAV instellingen inricht. Omdat het zelden gebruikt wordt, zullen we het niet in dit boek behandelen. Als je geïnteresseerd bent om de HTTP-push protocollen te gebruiken, dan kun je op `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt` lezen hoe je een repository kunt maken. Het aardige van Git laten pushen over HTTP is dat je iedere WebDAV server kunt gebruiken zonder specifieke Git funtionaliteit. Dus je kunt deze optie gebruiken als je web-hosting provider WebDAV ondersteunt voor het maken van wijzigingen aan je webpagina.

### De voordelen

Het voordeel van het gebruik van het HTTP protocol is dat het eenvoudig in te stellen is. Een handvol benodigde commando's uitvoeren is alles wat er moet gebeuren om de wereld leestoegang te geven tot je Git repository. Het neemt maar een paar minuten van je tijd. Het HTTP protocol is niet erg belastend voor de systeembronnen van je server. Omdat het over het algemeen een statische webserver gebruikt om alle data te verspreiden is het moeilijk om zelfs een kleine server te overbelasten - een normale Apache server kan gemiddeld duizenden bestanden zenden per seconde.

Je kunt ook je repositories alleen-lezen serveren via HTTPS, wat inhoudt dat je het gegevenstransport kunt versleutelen. Je kunt zelfs zover gaan dat je clients een specifiek gesigneerd SSL certificaat laat gebruiken. Normaal gesproken als je je deze moeite wilt getroosten, dan is het makkelijker om publieke SSH sleutels te gebruiken; maar het kan in jouw specifieke geval een betere oplossing zijn om gesigneerde SSL certificaten of andere HTTP-gebaseerde authenticatie methoden te gebruiken voor alleen-lezen toegang via HTTPS.

Een andere prettige bijkomstigheid is dat HTTP een dusdanig veel voorkomend protocol is dat bedrijfsfirewalls vaak zo ingesteld zijn dat ze verkeer via deze poort toestaan.

### De nadelen

Het nadeel van je repository verspreiden via HTTP is dat het relatief inefficiënt voor de client is. Over het algemeen duurt het een stuk langer om te clonen en te fetchen van de repository, en je hebt vaak een veel hogere netwerk belasting en transport volume via HTTP dan met elk van de andere netwerk protocollen. Omdat het niet zo slim is om eerst te bepalen van welke gegevens het nodig is te versturen – er wordt geen dynamisch werk door de server gedaan in deze uitwisselingen – wordt vaak naar het HTTP protocol gerefereerd als het _domme_ protocol. Voor meer informatie over de verschillen in efficiëntie tussen het HTTP protocol en andere protocollen, zie Hoofdstuk 9.
