# Git en Subversion

Op dit moment maakt het merendeel van open source ontwikkelprojecten en een groot aantal bedrijfsprojecten gebruik van Subversion om hun broncode te beheren. Het is het populairste open source VCS en bestaat al bijna tien jaar. Het lijkt ook in veel aspecten op CVS, wat daarvoor de grootste speler was in de code-beheer wereld.

Een van de beste features van Git is een bidirectionele brug naar Subversion genaamd `git svn`. Dit tool staat je toe om Git als een volwaardige client van een Subversion server te gebruiken, zodat je alle lokale eigenschappen van Git kunt gebruiken en daarna naar een Subversion server kunt pushen alsof je Subversion lokaal gebruikt. Dit houdt in dat je lokaal kunt branchen en mergen, het staging gebied gebruiken, kunt rebasen en cherry-picken enzovoorts, terwijl je medewerkers verder werken met de spreekwoordelijke griffel en leisteen. Het is een goede manier om Git in de bedrijfsomgeving binnen te smokkelen en je mede-ontwikkelaars te helpen efficiënter te worden terwijl jij lobbiet om de infrastructuur dusdanig te veranderen dat Git volledig gesupport kan worden. De Subversion brug is het uitwisselings-medicijn naar de DCVS wereld.

## git svn

Het basiscommando in Git voor alle Subversion brugcommando's is `git svn`. Je laat dit aan alles vooraf gaan. Je hebt best een aantal commando's nodig, dus je zult de meest gebruikte leren terwijl we een aantal kleine workflows behandelen.

Het is belangrijk om op te merken dat, terwijl je `git svn` gebruikt, je aan het communiceren bent met Subversion, wat een systeem is dat veel minder geavanceerd is dan Git. Alhoewel jij eenvoudig lokaal kunt branchen en mergen, is het over het algemeen het beste om je geschiedenis zo lineair als mogelijk te houden door je werk te rebasen en zaken te vermijden zoals tegelijkertijd communiceren met een Git remote repository.

Herschrijf je geschiedenis niet om daarna nogmaals te pushen, en ga niet Git repository ernaast gebruiken om tegelijkertijd met mede Git ontwikkelaars samen te werken. Subversion kan slechts één enkele lineaire geschiedenis aan, en het is heel eenvoudig om het in de war brengen. Als je met een team aan het werk bent en sommigen maken gebruik van Subversion en anderen van Git, zorg dan dat iedereen de SVN server gebruikt om samen te werken - het maakt je leven een stuk eenvoudiger.

## Instellen

Om deze functionaliteit te demonstreren heb je een normale SVN repository nodig waarop je schrijftoegang hebt. Als je deze voorbeelden wilt kopiëren, zal je een schrijfbare kopie moeten maken van mijn test repository. Om dat eenvoudig te kunnen doen, kun je een tool genaamd `svnsync` gebruiken dat bij de meer recente versies van Subversion geleverd wordt - het zou vanaf versie 1.4 meegeleverd moeten zijn. Voor deze tests heb ik een nieuwe Subversion repository op Google code gemaakt wat een gedeeltelijke kopie is van het `protobuf` project, wat een tool is dat gestructureerde data voor netwerk transmissie encodeert.

Om het te volgen zal je eerst een nieuw lokaal Subversion repository moeten maken:

	$ mkdir /tmp/test-svn
	$ svnadmin create /tmp/test-svn

Daarna sta je alle gebruikers toe om revprops te wijzigen - de makkelijke manier is om een pre-revprop-change script toe te voegen dat altijd met 0 afsluit:

	$ cat /tmp/test-svn/hooks/pre-revprop-change
	#!/bin/sh
	exit 0;
	$ chmod +x /tmp/test-svn/hooks/pre-revprop-change

Je kunt dit project nu syncen naar je lokale machine door `svnsync init` aan te roepen met de doel- en bronrepository.

	$ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

Dit stelt de eigenschappen in om de sync uit te voeren. Je kunt de code daarna clonen door dit uit te voeren

	$ svnsync sync file:///tmp/test-svn
	Committed revision 1.
	Copied properties for revision 1.
	Committed revision 2.
	Copied properties for revision 2.
	Committed revision 3.
	...

Alhoewel deze operatie maar een paar minuten in beslag neemt, zal het kopiëren van de originele repository naar een andere remote repository in plaats van een lokale meer dan een uur duren, zelfs al zitten er maar minder dan 100 commits in. Subversion moet één revisie per keer clonen en dan terug pushen in een ander repository. Het is belachelijk inefficiënt - maar het is de enige makkelijke manier om dit te doen.

## Om te beginnen

Nu je een Subversion repository hebt met schrijftoegang, kun je door een typische workflow gaan. Je begint met het `git svn clone` commando, wat een volledig Subversion repository in een lokaal Git repository cloned. Onthoud dat als je van een echt beheerd Subversion repository importeert, je de `file:///tmp/test-svn` hier moet vervangen door de URL van jouw Subversion repository:

	$ git svn clone file:///tmp/test-svn -T trunk -b branches -t tags
	Initialized empty Git repository in /Users/schacon/projects/testsvnsync/svn/.git/
	r1 = b4e387bc68740b5af56c2a5faf4003ae42bd135c (trunk)
	      A    m4/acx_pthread.m4
	      A    m4/stl_hash.m4
	...
	r75 = d1957f3b307922124eec6314e15bcda59e3d9610 (trunk)
	Found possible branch point: file:///tmp/test-svn/trunk => \
	    file:///tmp/test-svn /branches/my-calc-branch, 75
	Found branch parent: (my-calc-branch) d1957f3b307922124eec6314e15bcda59e3d9610
	Following parent with do_switch
	Successfully followed parent
	r76 = 8624824ecc0badd73f40ea2f01fce51894189b01 (my-calc-branch)
	Checked out HEAD:
	 file:///tmp/test-svn/branches/my-calc-branch r76

Dit voert het equivalent uit van twee commando's: `git svn init` gevolgd door `git svn fetch`, op de URL die je aan hebt gegeven. Het kan een tijdje duren. Het testproject heeft slechts 75 commits en de hoeveelheid code is niet zo groot, dus het neemt maar een paar minuten in beslag. Maar Git moet iedere versie uitchecken, één voor één, en ze individueel committen. Voor een project met honderdduizenden commits kan dit letterlijk uren of zelfs dagen duren voor het klaar is.

Het `-T trunk -b branches -t tags` gedeelte vertelt Git dat binnen deze Subversion repository de basale branch en tag conventie gevolgd wordt. Als je trunk, branches of tags anders noemt, kan je deze opties aanpassen. Omdat dit zo normaal is, kun je dit hele gedeelte vervangen door `-s`, wat standaard indeling betekent en al die opties impliceert. Het volgende commando is gelijkwaardig:

	$ git svn clone file:///tmp/test-svn -s

Nu zou je een geldig Git repository moeten hebben, waar de branches en tags in geïmporteerd zijn:

	$ git branch -a
	* master
	  my-calc-branch
	  tags/2.0.2
	  tags/release-2.0.1
	  tags/release-2.0.2
	  tags/release-2.0.2rc1
	  trunk

Het is belangrijk om op te merken dat dit tool je remote references een andere namespace heeft toebedeeld. Als je normaal een Git repository cloned, krijg je alle branches op die remote server lokaal beschikbaar in de vorm van `origin/[branch]` - waarbij in de namespace de naam van de remote wordt gebruikt. Echter, `git svn` gaat er vanuit dat je niet meerdere remotes hebt en bewaart alle referentie naar punten op de remote server zonder gebruik te maken van namespaces. Je kunt het Git plumbing commando `show-ref` gebruiken om al je volledige referentie namen te zien:

	$ git show-ref
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
	aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
	03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
	50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
	4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
	1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

Een normale Git repository ziet er meer zo uit:

	$ git show-ref
	83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
	3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
	0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
	25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

Hier zijn er twee remote servers: een genaamd `gitserver` met een `master` branch, en een andere genaamd `origin` met twee branches, `master` en `testing`.

Zie hoe in het voorbeeld van met `git svn` geïmporteerde remote referenties, de tags toegevoegd zijn als remote branches, niet als echte Git tags. De Subversion import ziet eruit alsof het een remote heeft dat tags heet waaronder branches zitten.

## Terug naar Subversion committen

Nu je een werkende repository hebt, kun je wat werken aan het project en je commits stroomopwaarts pushen, waarbij je Git effectief als een SVN client gebruikt. Als je een van de bestanden aanpast en deze commit, heb je een lokale commit in Git die nog niet bestaat op de Subversion server:

	$ git commit -am 'Adding git-svn instructions to the README'
	[master 97031e5] Adding git-svn instructions to the README
	 1 files changed, 1 insertions(+), 1 deletions(-)

Vervolgens moet je de verandering stroomopwaarts pushen. Merk op hoe dit de manier verandert waarop je met Subversion werkt: je kunt een paar commits offline doen en ze dan als één blok naar de Subversion server pushen. Om naar een Subversion server te pushen, voer je het `git svn dcommit` commando uit:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r79
	       M      README.txt
	r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Dit neemt alle commits die je gedaan hebt op de Subversion server code, doet voor elk een Subversion commit, en herschrijft je lokale Git commit zodat het een unieke identificatie heeft. Dit is belangrijk omdat het betekent dat alle SHA-1 checksums voor je commits gaan veranderen. Dit is een van de redenen dat het werken met Git-gebaseerde remote versies van je projecten in parallel met een Subversion server geen goed idee is. Als je kijkt naar de laatste commit, kun je het nieuwe `git-svn-id` zien dat is toegevoegd:

	$ git log -1
	commit 938b1a547c2cc92033b74d32030e86468294a5c8
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sat May 2 22:06:44 2009 +0000

	    Adding git-svn instructions to the README

	    git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

Merk op dat de SHA checksum die origineel begon met `97031e5` toen je committe, nu begint met `938b1a5`. Als je wilt pushen naar zowel een Git server als een Subversion server, moet je eerst naar de Subversion server pushen (`dcommit`) omdat die actie je commit data verandert.

## Nieuwe wijzigingen pullen

Als je met andere developers samenwerkt, dan zal op een bepaald moment één van jullie willen pushen en een ander zal wijziging willen pushen die conflicteert. Die wijziging zal worden geweigerd totdat je hun werk gemerged hebt. In `git svn` ziet het er zo uit:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	Merge conflict during commit: Your file or directory 'README.txt' is probably \
	out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
	core/git-svn line 482

Om deze situatie op te lossen moet je `git svn rebase` uitvoeren waardoor alle wijzigingen op de server die je nog niet hebt worden gepullt, en daarna al het werk dat je hebt bovenop wat op de server staat rebased:

	$ git svn rebase
	       M      README.txt
	r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
	First, rewinding head to replay your work on top of it...
	Applying: first user change

Nu is al jouw werk bovenop hetgeen wat op de Subversion server staat gebaseerd, en kan je een succesvolle `dcommit` doen:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r81
	       M      README.txt
	r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Het is belangrijk te onthouden dat in tegenstelling tot Git, die van je verlangt dat je werk van stroomopwaarts wat je nog niet lokaal hebt staan eerst merged voordat je mag pushen, `git svn` je dit alleen laat doen als de wijzigingen conflicteren. Als iemand anders een verandering naar een bestand pusht en daarna push jij een verandering op een ander bestand, dan zal het `commit` commando prima werken:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      configure.ac
	Committed r84
	       M      autogen.sh
	r83 = 8aa54a74d452f82eee10076ab2584c1fc424853b (trunk)
	       M      configure.ac
	r84 = cdbac939211ccb18aa744e581e46563af5d962d0 (trunk)
	W: d2f23b80f67aaaa1f6f5aaef48fce3263ac71a92 and refs/remotes/trunk differ, \
	  using rebase:
	:100755 100755 efa5a59965fbbb5b2b0a12890f1b351bb5493c18 \
	  015e4c98c482f0fa71e4d5434338014530b37fa6 M   autogen.sh
	First, rewinding head to replay your work on top of it...
	Nothing to do.

Dit is belangrijk om te onthouden, omdat de uitkomst een project status is die niet bestond op één van jullie beider computers toen je pushte. Als de veranderingen incompatibel zijn maar niet conflicteren, dan kun je problemen krijgen die lastig te diagnosticeren zijn. Het verschilt van het gebruik van een Git server; in Git kan je de status volledig op je gebruikerssysteem testen voordat je het publiceert, terwijl je met SVN je nooit zeker kunt zijn dat de statussen vlak voor je commit en na je commit gelijk zijn.

Je moet dit commando ook moeten uitvoeren om wijzigingen te pullen van de Subversion server, zelfs als je zelf nog niet klaar bent om te committen. Je kunt `git svn fetch` uitvoeren om de nieuwe data binnen te halen, maar `git svn rebase` doet de fetch en vernieuwt je lokale commits.

	$ git svn rebase
	       M      generate_descriptor_proto.sh
	r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
	First, rewinding head to replay your work on top of it...
	Fast-forwarded master to refs/remotes/trunk.

Regelmatig `git svn rebase` uitvoeren zorgt er voor dat je code altijd up to date is. Je moet er echter wel zeker van zijn dat je werkdirectory schoon is voor je dit uitvoert. Als je lokale wijzigingen hebt, moet je of eerst je werk stashen, of tijdelijk committen voordat je `git svn rebase` uitvoert - anders zal het commando stoppen zodra het ziet dat de rebase zal resulteren in een mergeconflict.

## Git branch problemen

Als je gewend geraakt bent aan een Git workflow, zal je waarschijnlijk topic branches gaan maken, er werk op doen en ze dan terug mergen. Als je naar een Subversion server pusht via git svn, zou je kunnen overwegen je werk iedere keer op een enkele branch rebasen in plaats van de branches samen te mergen. De reden om rebasen te prefereren is dat Subversion een lineaire geschiedenis heeft, en niet met merges omgaat op de manier zoals Git dat doet, dus git svn volgt alleen de eerste ouder op het moment dat de snapshots naar Subversion commits omgezet worden.

Stel dat je geschiedenis er zoals volgt uitziet: je hebt een `experiment` branch gemaakt, twee commits gedaan en ze dan terug in `master` gemerged. Als je dan `dcommit` zie je output zoals dit:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      CHANGES.txt
	Committed r85
	       M      CHANGES.txt
	r85 = 4bfebeec434d156c36f2bcd18f4e3d97dc3269a2 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk
	COPYING.txt: locally modified
	INSTALL.txt: locally modified
	       M      COPYING.txt
	       M      INSTALL.txt
	Committed r86
	       M      INSTALL.txt
	       M      COPYING.txt
	r86 = 2647f6b86ccfcaad4ec58c520e369ec81f7c283c (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Het uitvoeren van `dcommit` op een branch met gemergede historie werkt prima, maar wanneer je naar je Git project historie kijkt zie je dat geen van beide commits die je op de `experiment` branch gedaan hebt herschreven is. In plaats daarvan verschijnen al die wijzigingen in de SVN versie van de enkele merge commit.

Als iemand anders dat werk cloned, is alles wat ze zien de merge commit met al het werk erin gesquashed; ze zien niet de commit gegevens met waar het vandaan kwam of wanneer het was gecommit.

## Subversion branchen

Branchen in Subversion is niet hetzelfde als branchen in Git; het is waarschijnlijk het beste om het zoveel mogelijk te vermijden. Maar, je kunt Subversion branches maken en daarnaar committen met git svn.

### Een nieuwe SVN branch maken

Om een nieuwe branch te maken in Subversion, voer je `git svn branch [branchnaam]` uit:

	$ git svn branch opera
	Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
	Found possible branch point: file:///tmp/test-svn/trunk => \
	  file:///tmp/test-svn/branches/opera, 87
	Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
	Following parent with do_switch
	Successfully followed parent
	r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

Dit doet hetzelfde als het `svn copy trunk branches/opera` commando in Subversion en wordt op de Subversion server uitegevoerd. Het is belangrijk om op te merken dat het je niet uitchecked in die branch; als je op dit punt commit, dan zal die commit naar de `trunk` op de server gaan en niet in `opera`.

## Actieve branches wisselen

Git zoekt uit naar welke branch de dcommits horen te gaan door te kijken naar de punt van elk van je Subversion branches in je geschiedenis; je zou er slechts één moeten hebben, en het zou de laatste moeten zijn met een `git-svn-id` in je huidige branch historie.

Als je wilt werken op meer dan één branch, dan moet je lokale branches aanmaken om te `dcommit`-en naar specifieke Subversion branches door ze te beginnen bij de geïmporteerde Subversion commit voor die branch. Als je een `opera` branch wilt hebben waar je apart op kunt werken, kun je dit uitvoeren

	$ git branch opera remotes/opera

Als je de `opera` branch nu in `trunk` (jouw `master` branch) wilt mergen, kan je dit doen met een normale `git merge`. Maar je moet een beschrijvend commit bericht meegeven (via `-m`), omdat de merge anders "Merge branch opera" zal bevatten in plaats van iets bruikbaars.

Onthoud dat alhoewel je `git merge` gebruikt voor deze operatie, en de merge waarschijnlijk veel makkelijker gaat dan het in Subversion zou gaan (omdat Git automatisch de merge basis voor je zal detecteren), dit geen normale Git merge commit is. Je moet deze data terug pushen naar een Subversion server die geen commit aan kan die meer dan één ouder trackt; dus nadat je het gepusht hebt, zal het eruit zien als een enkele commit waarbij al het werk van een andere branch erin gesquashed zit onder één enkele commit. Nadat je een branch in een andere gemerged hebt, kan je niet eenvoudig terug gaan en op die branch verder werken zoals je dat normaal in Git zou doen. Het `dcommit` commando dat je uitvoert wist alle informatie die kan vertellen welke branch erin gemerged was, dus daarop volgende merge-basis berekeningen zullen fout gaan. De `dcommit` zal je `git merge` resultaat eruit laten zien alsof je `git merge --squash` uitgevoerd hebt. Helaas is er geen manier om deze situatie te vermijden: Subversion kan deze informatie niet opslaan, dus je zult altijd beperkt zijn door zijn tekortkomingen zolang als je het als server gebruikt. Om problemen te vermijden zou je de lokale branch moeten verwijderen (in dit geval `opera`), nadat je hem in trunk gemerged hebt.

## Subversion commando's

De `git svn` toolset levert een aantal commando's om de overgang naar Git te vergemakkelijken, door functionaliteit te leveren die vergelijkbaar is met wat je in Subversion had. Hier zijn een paar commando's die je geven wat Subversion voorheen deed.

### SVN achtige historie

Als je gewend bent aan Subversion en je wil de historie in SVN achtige output zien, kun je `git svn log` uitvoeren om je commit historie in SVN formattering te zien:

	$ git svn log
	------------------------------------------------------------------------
	r87 | schacon | 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009) | 2 lines

	autogen change

	------------------------------------------------------------------------
	r86 | schacon | 2009-05-02 16:00:21 -0700 (Sat, 02 May 2009) | 2 lines

	Merge branch 'experiment'

	------------------------------------------------------------------------
	r85 | schacon | 2009-05-02 16:00:09 -0700 (Sat, 02 May 2009) | 2 lines

	updated the changelog

Je moet twee belangrijke zaken onthouden over `git svn log`. Ten eerste: het werkt offline en niet zoals het echte `svn log` commando waarbij de Subversion server vraagt om de data. Ten tweede: het toont je alleen commits die zijn gecommit naar de Subversion server. Lokale Git commits, die je nog niet ge-dcommit hebt worden niet getoond; een ook commits die mensen in de tussentijd gedaan hebben naar de Subversion server. Het is meer de laatst bekende status van de commits op de Subversion server.

### SVN annotatie

Zoals het `git svn log` commando het `svn log` commando offline simuleert, kan je het equivalent van `svn annotate` krijgen door `git svn blame [BESTAND]` uit te voeren. De output ziet er zo uit:

	$ git svn blame README.txt
	 2   temporal Protocol Buffers - Google's data interchange format
	 2   temporal Copyright 2008 Google Inc.
	 2   temporal http://code.google.com/apis/protocolbuffers/
	 2   temporal
	22   temporal C++ Installation - Unix
	22   temporal =======================
	 2   temporal
	79    schacon Committing in git-svn.
	78    schacon
	 2   temporal To build and install the C++ Protocol Buffer runtime and the Protocol
	 2   temporal Buffer compiler (protoc) execute the following:
	 2   temporal

Nogmaals, het toont geen commits die je lokaal in Git gedaan hebt of die in de tussentijd naar Subversion gepusht zijn.

### SVN server informatie

Je kunt ook het soort informatie krijgen dat `svn info` je geeft door `git svn info` uit te voeren:

	$ git svn info
	Path: .
	URL: https://schacon-test.googlecode.com/svn/trunk
	Repository Root: https://schacon-test.googlecode.com/svn
	Repository UUID: 4c93b258-373f-11de-be05-5f7a86268029
	Revision: 87
	Node Kind: directory
	Schedule: normal
	Last Changed Author: schacon
	Last Changed Rev: 87
	Last Changed Date: 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009)

Dit is vergelijkbaar met `blame` en `log` in dat het offline draait en alleen up to date is vanaf de laatste keer dat je met de Subversion server gecommuniceerd hebt.

### Negeren wat Subversion negeert

Als je een Subversion repository cloned die ergens `svn:ignore` eigenschappen bevat, dan zul je waarschijnlijk overeenkomstige `.gitignore` bestanden in willen richten zodat je niet per ongeluk bestanden commit die niet hadden gemogen. `git svn` heeft twee commando's die met dit probleem helpen. De eerste is `git svn create-ignore` wat automatisch `.gitignore` bestanden voor je genereert zodat je het bij je volgende commit kan gebruiken.

Het tweede commando is `git svn show-ignore` wat op stdout de regels afdrukt die je in een `.gitignore` bestand moet stoppen zodat je de output in het exclude bestand van je project kunt stoppen:

	$ git svn show-ignore > .git/info/exclude

Op die manier vervuil je het project niet met `.gitignore` bestanden. Dit is een goeie optie als je de enige Git gebruiker in een Subversion team bent, en je teamgenoten geen `.gitignore` bestanden in het project willen hebben.

## Git-Svn samenvatting

De `git svn` tools zijn nuttig als je voorlopig vast zit aan een Subversion server, of op een andere manier in een ontwikkelomgeving zit waar het draaien van een Subversion server noodzakelijk is. Je moet het echter beschouwen als een gemankteerde Git, anders loop je tegen problemen in de vertaling aan, die jou en je medewerkers in verwarring kunnen brengen. Om uit de problemen te blijven moet je deze regels volgen:

* Houdt een lineaire Git historie aan die geen merge commits bevat die gedaan zijn door `git merge`. Rebase al het werk dat je buiten je hoofd branch doet daarop; niet erin mergen.
* Geen aparte Git server inrichten en daar op samenwerken. Je kunt er een hebben om het maken van clones voor nieuwe developers te versnellen, maar push er niets terug in dat geen `git-svn-id` vermelding heeft. Je zou zelfs een `pre-receive` hook kunnen toevoegen, die elk commit bericht controleert op een `git-svn-id` en pushes weigert die commits zonder bevatten.

Als je deze regels volgt dan kan werken met een Subversion server dragelijker zijn. Maar als het mogelijk is om over te gaan naar een echte Git server, dan kan dat je team een hoop meer profijt geven.
