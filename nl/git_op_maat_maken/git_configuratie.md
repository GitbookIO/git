# Git configuratie

Zoals je kort in Hoofdstuk 1 gezien hebt, kun je Git configuratie instellingen specificeren met het `git config` commando. Een van de eerste dingen die je deed was je naam en e-mail adres instellen:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Hierna zal je een paar van de meer interessante opties gaan zien, die je op vergelijkbare manier kunt instellen om je Git op maat te maken.

Je zag al wat eenvoudige Git configuratie details in het eerste hoofdstuk, en die zal ik hier snel nog eens laten zien. Git gebruikt een aantal configuratie bestanden om het niet-standaard gedrag dat je wilt te bepalen. De eerste plek waar Git kijkt voor deze waarden is in een `/etc/gitconfig` bestand, deze bevat de waarden voor alle gebruikers op het systeem en al hun repositories. Als je de optie `--system` aan `git config` meegeeft, leest en schrijft Git naar dit bestand.

De volgende plaats waar Git kijkt is het `~/.gitconfig` bestand, wat specifiek is voor elke gebruiker. Je kunt er voor zorgen dat Git naar dit bestand leest en schrijft door de `--global` optie mee te geven.

Als laatste kijkt Git naar configuratie waarden in het config bestand in de Git directory (`.git/config`) van de repository dat op dat moment gebruikt wordt. Deze waarden zijn specifiek voor die ene repository. Ieder niveau overschrijft de waarden van de vorige, dus waarden in `.git/config` hebben voorrang op die in `/etc/gitconfig` bijvoorbeeld. Je kunt die waarden ook instellen door het bestand handmatig aan te passen en de correcte syntax te gebruiken, maar het is normaalgesproken eenvoudiger het `git config` commando uit te voeren.

## Basis client configuratie

De configuratie opties die herkend worden door Git vallen in twee categorieën: de client kant en de server kant. De meerderheid van de opties zijn voor de client kant: de configuratie van jouw persoonlijke voorkeuren. Alhoewel er massa's opties beschikbaar zijn, zal ik er maar een paar behandelen die ofwel veelgebruikt zijn ofwel je workflow significant kunnen beïnvloeden. Veel opties zijn alleen van toepassing in uitzonderlijke gevallen, die ik nu niet zal behandelen. Als je een lijst van alle opties wilt zien, die door jouw versie van Git worden herkend kan je dit uitvoeren

	$ git config --help

De gebruikershandleiding voor `git config` toont alle beschikbare opties in groot detail.

### core.editor

Standaard zal Git de tekst editor gebruiken die je zelf ingesteld hebt als standaard en anders valt Git terug op de Vi editor om je commit en tag boodschappen te maken of te wijzigen. Om die instelling naar iets anders om te zetten, kun je de `core.editor` instelling gebruiken:

	$ git config --global core.editor emacs

Vanaf nu maakt het niet meer uit wat je als je standaard shell editor waarde ingesteld hebt, Git zal Emacs starten om boodschappen aan te passen.

### commit.template

Als je hier het een pad instelt dat naar een bestand op je systeem wijst, zal Git dat bestand als de standaard boodschap gebruiken bij elke commit. Bijvoorbeeld, stel dat je een sjabloon bestand `$HOME/.gitmessage.txt` maakt die er zo uitziet:

	onderwerp regel

	wat er gebeurd is

	[ticket: X]

Om Git te vertellen dat het dit moet gebruiken als standaard boodschap dat in de editor moet verschijnen als je `git commit` uitvoert, stel je de `commit.template` configuratie waarde in:

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

Daarna zal je editor zoiets als dit openen als je standaard commit boodschap bij een commit:

	onderwerp regel

	wat er gebeurd is

	[ticket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

Als je een beleid hebt voor commit boodschappen, dan vergroot het plaatsen van een sjabloon op je systeem en het configureren ervan als standaard te gebruiken binnen Git de kans dat het beleid ook daadwerkelijk wordt gevolgd.

### core.pager

De instelling voor 'core.pager' bepaalt welke pagineer tool gebruikt wordt door Git om de uitvoer van bijvoorbeeld `log` en `diff` weer te geven. Je kunt het instellen als `more` of als je favoriete pagineer tool (standaard is het `less`), of je kunt het uitzetten door het als een lege tekst in te stellen:

	$ git config --global core.pager ''

Als je dat uitvoert zal Git de gehele tekst van alle commando's ononderbroken tonen, ongeacht de lengte van die uitvoer.

### user.signingkey

Als je gebruik maakt van ondertekende tags (zoals besproken in Hoofdstuk 2), dan maakt het instellen van een GPG signeersleutel als configuratie instelling je leven een stuk eenvoudiger. Stel je sleutel ID zo in:

	$ git config --global user.signingkey <gpg-key-id>

Nu kun je tags signeren zonder steeds je sleutel op te hoeven geven bij het `git tag` commando:

	$ git tag -s <tag-name>

### core.excludesfile

Je kunt patronen in het `.gitignore` bestand van je project zetten zodat Git ze niet ziet als untracked bestanden en niet zal proberen ze te stagen als je `git add` op ze uitvoert, zoals besproken in Hoofdstuk 2. Maar als je wilt dat een ander bestand buiten je project die waarden bevat of additionele waarden wilt, kan je Git vertellen met de `core.excludesfile`-waarde waar dat bestand is. Stel het eenvoudigweg in als een pad naar een bestand met een inhoud dat vergelijkbaar is met wat in een `.gitignore` bestand zou staan.

### help.autocorrect

Deze optie is alleen beschikbaar in Git 1.6.1. en later. Als je in Git een commando verkeerd intypt, toont het je zoiets als dit:

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

Als je `het.autocorrect` op 1 instelt, zal Git automatisch het commando uitvoeren als het slechts één passend commando heeft in dit scenario.

## Kleuren in Git

Git kan zijn uitvoer op de terminal in kleur tonen, wat kan helpen om de uitvoer snel en eenvoudig visueel te verwerken. Er zijn een aantal opties die kunnen helpen om de kleuren naar jouw voorkeur in te stellen.

### color.ui

Git zal automatisch het meeste van zijn uitvoer in kleur tonen als je het vraagt. Je kunt erg specifiek worden in wat je gekleurd wilt hebben en hoe; maar om alle standaard kleuren in de terminal aan te zetten, stel dan `color.ui` in op true:

	$ git config --global color.ui true

Als deze waarde ingesteld is, zal Git zijn uitvoer in kleur tonen zodra deze naar een terminal gaat. Andere mogelijke opties zijn false wat de uitvoer nooit kleurt, en always, wat de kleuren altijd weergeeft zelfs als je Git commando's uitvoert naar een bestand of deze naar een ander commando doorsluist (zgn. piping).

Je zult zelden `color.ui = always` willen. In de meeste scenario's, als je kleuren in je omgeleide uitvoer wil, kan je een `--color` vlag aan het Git commando meegeven om het te forceren kleuren te gebruiken. De `color.ui = true` instelling is degene die je vrijwel altijd wilt gebruiken.

### `color.*`

Als je meer specifiek wil zijn welke commando's gekleurd moeten zijn en hoe, dan voorziet Git in woordspecifieke kleuren instellingen. Elk van deze kan worden ingesteld op `true`, `false` of `always`:

	color.branch
	color.diff
	color.interactive
	color.status

Daarnaast heeft elk van deze ook sub-instellingen die je kunt gebruiken om specifieke kleuren in te stellen voor delen van de uitvoer, als je iedere kleur wilt wijzigen. Bijvoorbeeld, om de meta-informatie in je diff uitvoer in blauwe voorgrond, zwarte achtergrond en vetgedrukt in te stellen, kun je dit uitvoeren

	$ git config --global color.diff.meta “blue black bold”

Je kunt de kleur instellen op een van de volgende waarden: ’normal’, ’black’, ’red’, ’green’, ’yellow’, ’blue’, ’magenta’, ’cyan’, of ’white’. Als je een attribuut wil hebben, zoals vetgedrukt in het vorige voorbeeld, kun je kiezen uit ’bold’, ’dim’, ’ul’, ’blink’ en ’reverse’.

Zie de manpage van `git config` voor alle sub-instellingen die je kunt instellen, als je dat wilt.

## Externe merge en diff tools

Alhoewel Git een interne implementatie van diff heeft, deze heb je tot nu toe gebruikt, kan je in plaats daarvan een extern tool instellen. Je kunt ook een grafisch merge conflict-oplossings tool instellen, in plaats van handmatig de conflicten op te moeten lossen. Ik zal nu demonstreren hoe je het Perforce Visuele Merge Tool (P4Merge) in moet stellen, om je diff en merge oplossingen te doen, omdat het een fijn grafisch tool is en omdat het gratis is.

Als je dit wilt proberen, P4Merge werkt op alle grote platformen, dus je zou het moeten kunnen doen. Ik zal in de voorbeelden paden gebruiken die op Mac en Linux systemen werken; voor Windows moet je `/usr/local/bin` veranderen in een pad naar een uitvoerbaar bestand op jouw machine.

Je kunt P4Merge hier downloaden:

	http://www.perforce.com/perforce/downloads/component.html

Om te beginnen ga je externe wrapper scripts instellen om de commando's uit te voeren. Ik zal het Mac pad gebruiken voor de applicatie; in andere systemen zal het moeten wijzen naar de plaats waar de `p4merge` binary geïnstalleerd is. Maak merge wrapper script, genaamd `extMerge`, die jouw applicatie met alle meegegeven argumenten aanroept:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*

De diff wrapper controleert dat er precies zeven argumenten meegegeven zijn, en geeft twee ervan aan het merge script. Standaard geeft Git de volgende argumenten aan het diff programma mee:

	pad oud-bestand oude-hex oude-modus nieuwe-bestand nieuwe-hex nieuwe-modus

Omdat je alleen de `oude-bestand` en `nieuwe-bestand` argumenten wilt, zul je het wrapper script gebruiken om de juiste parameters door te geven.

	$ cat /usr/local/bin/extDiff
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

Je moet er ook voor zorgen dat deze scripts uitvoerbaar zijn:

	$ sudo chmod +x /usr/local/bin/extMerge
	$ sudo chmod +x /usr/local/bin/extDiff

Nu kun je het config bestand instellen om de zelfgemaakte merge en diff tools te gebruiken. Dit wordt gedaan met een aantal instellingen: `merge.tool` om Git te vertellen welke strategie hij moet gebruiken, `mergetool.*.cmd` om te specificeren hoe het commando moet worden uitgevoerd, `mergetool.trustExitCode` om Git te vertellen of de exit code van dat programma een succesvolle merge betekent of niet, en `diff.external` om Git te vertellen welk commando het moet uitvoeren voor diffs. Dus, je kunt de vier configuratie commando's uitvoeren

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

of je kunt je `~/.gitconfig` bestand aanpassen en deze regels toevoegen:

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

Nadat dit alles gebeurd is, kan je diff commando's zoals deze uitvoeren:

	$ git diff 32d1776b1^ 32d1776b1

in plaats van de uitvoer van diff op de commando regel, wordt een instantie van P4Merge gestart door Git, en dat ziet er ongeveer uit als in Figuur 7-1.


![](http://git-scm.com/figures/18333fig0701-tn.png)

Figuur 7-1. P4Merge.

Als je twee branches probeert te mergen en je krijgt vervolgens merge conflicten, kan je het `git mergetool` commando uitvoeren. P4Merge wordt dan opgestart om je het conflict op te laten lossen met behulp van dat GUI tool.

Het aardige van deze wrapper opstelling is dat je de diff en merge tools eenvoudig aan kunt passen. Bijvoorbeeld, om je `extDiff` en `extMerge` tools in te stellen zodat ze bijvoorbeeld het KDiff3 tool uitvoeren, is het enige dat je moet doen het `extMerge` bestand aanpassen:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

Nu zal Git het KDiff3 tool gebruiken voor het tonen van diff en het oplossen van merge conflicten.

Git is 'af fabriek' al ingesteld om een aantal andere mergeconflict-oplossings tools te gebruiken zonder dat je de cmd configuratie op hoeft te zetten. Je kunt je merge tool op kdiff3 instellen, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff of gvimdiff. Als je niet geïnteresseerd bent in het gebruik van KDiff3 als diff, maar het liever alleen wilt gebruiken voor merge conflict oplossing, en het kdiff3 commando zit in je pad, dan kun je dit uitvoeren

	$ git config --global merge.tool kdiff3

Als je dit uitvoert in plaats van de `extMerge` en `extDiff` bestanden in te stellen, zal Git KDiff3 gebruiken voor conflict oplossing en het normale Git diff tool voor diffs.

## Opmaak en witruimten

Problemen met opmaak en witruimten zijn één van de meest frustrerende en subtiele problemen die veel ontwikkelaars tegenkomen bij het samenwerken, in het bijzonder over verschillende platformen. Het is heel eenvoudig voor patches en ander werk om subtiele witruimte veranderingen te introduceren, omdat editors ze stiekum introduceren of omdat Windows programmeurs carriage returns aan het eind van de regels toevoegen van bestanden die ze bewerken in gemengde platformprojecten. Git heeft een aantal configuratie opties om met deze problemen te helpen.

### core.autocrlf

Als je op Windows programmeert, of een ander systeem gebruikt maar samenwerkt met mensen die op Windows werken, zal je op enig moment tegen regeleinde problemen aanlopen. Dat komt omdat Windows zowel een carriage-return als een linefeed karakter gebruikt voor regeleindes in zijn bestanden, terwijl Mac en Linux systemen alleen het linefeed karakter gebruiken. Dit is een subtiel maar verschrikkelijk irritant feit van het werken met gemengde platformen.

Git kan hiermee omgaan door CRLF regeleinden automatisch om te zetten naar LF zodra je commit, en vice versa op het moment dat je code uitcheckt op je bestandssysteem. Je kunt deze functionaliteit aanzetten met de `core.autocrlf` instelling. Als je op een Windows machine zit, stel het dan in op `true` – dit verandert LF regeleinden in CRLF zodra je code uitcheckt:

	$ git config --global core.autocrlf true

Als je op een Linux of Mac systeem werkt (die LF regeleinden gebruiken) dan wil je niet dat Git ze automatisch verandert op het moment dat Git bestanden uitcheckt. Maar als een bestand met CRLF regeleinden onverhoopt toch geïntroduceerd wordt, dan wil je waarschijnlijk dat Git dit repareert. Je kunt Git vertellen dat je wilt dat hij CRLF in LF veranderd tijdens het committen, maar niet de andere kant op door het instellen van `core.autocrlf` op input:

	$ git config --global core.autocrlf input

Deze instelling zal CRLF regeleinden in Windows checkouts gebruiken, en LF regeleinden in Mac en Linux systemen en in de repository.

Als je een Windows programmeur bent die aan een project voor alleen Windows werkt dan kun je deze functionaliteit uitzetten, waardoor de carriage-returns in de repository worden opgeslagen door de configuratie waarde op `false` te zetten:

	$ git config --global core.autocrlf false

### core.whitespace

Git is standaard ingericht om een aantal witruimte problemen te detecteren en te repareren. Het kan op vier veelvoorkomende witruimte problemen letten – twee staan er standaard aan en kunnen uitgezet worden, en twee staan standaard uit, maar kunnen aangezet worden.

De twee die standaard aan staan zijn `trailing-space`, waarmee wordt gekeken of er spaties aan het eind van een regel staan, en `space-before-tab`, wat kijkt of er spaties voor tabs staan aan het begin van een regel.

De twee die standaard uit staan maar aangezet kunnen worden, zijn `indent-with-non-tab` die kijkt naar regels die met acht of meer spaties beginnen in plaats van tabs, en `cr-at-eol`, wat Git vertelt dat carriage-returns aan het eind van een regel geaccepteerd mogen worden.

Je kunt Git vertellen welke van deze je aan wilt zetten door `core.whitespace` de waardes te geven die je aan of uit wilt zetten, gescheiden door komma's. Je kunt waarden uitzetten door ze weg te laten uit de instelling tekst of door een `-` vooraf te laten gaan aan de waarde. Bijvoorbeeld, als je alles aan wil behalve `cr-ar-eol`, dan kan je dit doen:

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

Git zal deze problemen detecteren zodra je een `git diff` commando uitvoert en ze proberen in te kleuren zodat je ze mogelijk kunt repareren voordat je ze commit. Het zal deze waarden ook gebruiken om je te helpen met patches toe te passen met `git apply`. Als je patches gaat applyen, kan je Git vragen om je te waarschuwen als hij patches toepast waarin deze specifieke witruimte-problemen zitten:

	$ git apply --whitespace=warn <patch>

Of je kunt Git vragen om automatisch deze problemen te repareren alvorens de patch te applyen:

	$ git apply --whitespace=fix <patch>

Deze opties zijn ook op het `git rebase` commando van toepassing. Als je witruimte problemen gecommit hebt maar ze nog niet stroomopwaarts gepushed hebt, kun je een `rebase` uitvoeren met de `--whitespace=fix` optie om Git automatisch witruimte problemen te laten repareren terwijl het de patches herschrijft.

## Server configuratie

Er zijn lang niet zoveel configuratie opties beschikbaar voor de server kant van Git, maar er zijn er een paar interessante bij waar je misschien op gewezen wilt worden.

### receive.fsckObjects

Standaard zal Git niet alle objecten die tijdens een push ontvangen worden op consistentie controleren. Alhoewel Git kan controleren of ieder object nog steeds bij zijn SHA-1 checksum past en naar geldige objecten wijst, doet gebeurt dat niet standaard bij iedere push. Het is een relatief dure operatie en kan veel extra tijd kosten bij iedere push, afhankelijk van de grootte van het repository of de push. Als je wilt dat Git ieder object op consistentie controleert bij elke push, dan kun je dit afdwingen door `receive.fsckObjects` op true te zetten:

	$ git config --system receive.fsckObjects true

Nu zal Git de integriteit van de repository controleren voordat een push geaccepteerd wordt, om er zeker van te zijn dat defecte clients geen corrupte gegevens introduceren.

### receive.denyNonFastForwards

Als je commits rebased die je al gepusht hebt en dan nog eens pusht, of op een andere manier een commit probeert te pushen naar een remote branch die niet de commit bevat waarnaar de remote branch op dat moment wijst, dan wordt dat afgewezen. Dit is over het algemeen goed beleid, maar in het geval van de rebase kan je besluiten dat je weet waar je mee bezig bent en kan je de remote branch geforceerd vernieuwen door een `-f` vlag met je push commando mee te geven.

Om de mogelijkheid van het geforceerd vernieuwen van remote branches naar niet fast-forward referenties uit te schakelen, stel je `receive.denyNonFastForwards` in:

	$ git config --system receive.denyNonFastForwards true

Een andere manier waarop je dit kunt doen is het instellen van ontvangst hooks op de server wat we zo meteen gaan behandelen. Die aanpak stelt je in staat meer complexe dingen te doen, zoals het weigeren van niet fast-forwards afkomstig van een bepaalde groep gebruikers.

### receive.denyDeletes

Een van de manieren waarop een gebruiker het `denyNonFastForwards` beleid kan omzeilen is door de branch te verwijderen en het dan opnieuw terug pushen met de nieuwe referenties. In nieuwere versies van Git (beginnend bij versie 1.6.1), kun je `receive.denyDeletes` op true zetten:

	$ git config --system receive.denyDeletes true

Dit zal systeembreed branch en tag verwijdering door middel van een push weigeren - geen enkele gebruiker mag het meer. Om remote branches te verwijderen, moet je de ref bestanden handmatig verwijderen van de server. Er zijn ook interessantere manieren om dit per gebruiker af te dwingen door middel van ACL's, zoals je zult leren aan het eind van dit hoofdstuk.
