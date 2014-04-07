# Werken met remotes

Om samen te kunnen werken op eender welke Git project, moet je weten hoe je de remote repositories moet beheren. Remote repositories zijn versies van je project, die worden beheerd op het Internet of ergens op een netwerk. Je kunt er meerdere hebben, waarvan over het algemeen ieder ofwel alleen leesbaar, of lees- en schrijfbaar is voor jou. Samenwerken met anderen houdt in dat je deze remote repositories kunt beheren en data kunt pushen en pullen op het moment dat je werk moet delen.
Remote repositories beheren houdt ook in weten hoe je ze moet toevoegen, ongeldige repositories moet verwijderen, meerdere remote branches moet beheren en ze als tracked of niet kunt definiëren, en meer. In deze sectie zullen we deze remote-beheer vaardigheden behandelen.

## Laat je remotes zien

Om te zien welke remote servers je geconfigureerd hebt, kun je het `git remote` commando uitvoeren. Het laat de verkorte namen van iedere remote alias zien die je gespecificeerd hebt. Als je de repository gecloned hebt, dan zul je op z'n minst de *origin* zien; dat is de standaard naam die Git aan de server geeft waarvan je gecloned hebt:

	$ git clone git://github.com/schacon/ticgit.git
	Cloning into 'ticgit'...
	remote: Reusing existing pack: 1857, done.
	remote: Total 1857 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (1857/1857), 374.35 KiB | 193.00 KiB/s, done.
	Resolving deltas: 100% (772/772), done.
	Checking connectivity... done.
	$ cd ticgit
	$ git remote
	origin

Je kunt ook `-v` specificeren, wat je de URL laat zien die Git bij de verkorte naam heeft opgeslagen om naar geëxpandeerd te worden:

	$ git remote -v
	origin  git://github.com/schacon/ticgit.git (fetch)
	origin  git://github.com/schacon/ticgit.git (push)

Als je meer dan één remote hebt, dan laat het commando ze allemaal zien. Bijvoorbeeld, mijn Grit repository ziet er ongeveer zo uit.

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

Dit betekent dat we vrij gemakkelijk de bijdragen van ieder van deze gebruikers naar binnen kunnen pullen. Maar merk ook op dat alleen de origin een SSH URL is, dus dat is de enige waar ik naartoe kan pushen (we laten in *Hoofdstuk 4* zien waarom dat zo is).

## Remote repositories toevoegen

Ik heb het toevoegen van remote repositories al genoemd en getoond in vorige paragrafen, maar hier toon ik expliciet hoe dat gedaan wordt. Om een nieuw Git remote repository als een makkelijk te refereren alias toe te voegen, voer je `git remote add [verkorte naam] [url]` uit:

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Nu kun je de naam pb op de commandoregel gebruiken in plaats van de hele URL. Bijvoorbeeld, als je alle informatie die Paul wel, maar jij niet in je repository hebt wilt fetchen, dan kun je git fetch pb uitvoeren:

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

De master branch van Paul is lokaal toegankelijk als `pb/master`; je kunt het in een van jouw branches mergen, of je kunt een lokale branch uitchecken op dat punt als je het wil zien.

## Van je remotes fetchen en pullen

Zoals je zojuist gezien hebt, kun je om data van je remote projecten te halen dit uitvoeren:

	$ git fetch [remote-name]

Het commando gaat naar het remote project en haalt alle data van dat remote project dat jij nog niet hebt. Nadat je dit gedaan hebt, zou je references (referenties) naar alle branches van dat remote project moeten hebben, die je op ieder tijdstip kunt mergen en bekijken. (We zullen in meer detail zien wat branches precies zijn, en hoe je ze moet gebruiken in *Hoofdstuk 3*.)

Als je een repository clonet, voegt dat commando die remote repository automatisch toe onder de naam *origin*. Dus `git fetch origin` fetcht (haalt) ieder nieuw werk dat gepusht is naar die server sinds je gecloned hebt (of voor het laatst gefetcht hebt). Het is belangrijk om te weten dat het fetch commando de data naar je locale repository haalt; het merget niet automatisch met je werk of verandert waar je momenteel aan zit te werken. Je moet het handmatig in je werk mergen wanneer je er klaar voor bent.

Als je een branch geconfigureerd hebt om een remote branch te volgen (tracken) (zie de volgende paragraaf en *Hoofdstuk 3* voor meer informatie), dan kun je het `git pull` commando gebruiken om automatisch een remote branch te fetchen en mergen in je huidige branch. Dit kan makkelijker of meer comfortabele workflow zijn voor je; en standaard stelt het `git clone` commando je lokale master branch zo in dat het de remote master branch van de server waarvan je gecloned hebt volgt (aangenomen dat de remote een master branch heeft). Over het algemeen zal een `git pull` dat van de server waarvan je origineel gecloned hebt halen en proberen het automatisch in de code waar je op dat moment aan zit te werken te mergen.

## Naar je remotes pushen

Wanneer je jouw project op een punt hebt dat je het wilt delen, dan moet je het stroomopwaarts pushen. Het commando hiervoor is simpel: `git push [remote-name] [branch-name]`. Als je de master branch naar je `origin` server wilt pushen (nogmaals, over het algemeen zet clonen beide namen automatisch goed voor je), dan kun je dit uitvoeren om je werk terug op de server te pushen:

	$ git push origin master

Dit commando werkt alleen als je gecloned hebt van een server waarop je schrijfrechten hebt, en als niemand in de tussentijd gepusht heeft. Als jij en iemand anders op hetzelfde tijdstip gecloned hebben en zij pushen eerder stroomopwaarts dan jij, dan zal je push terecht geweigerd worden. Je zult eerst hun werk moeten pullen en in jouw werk verwerken voordat je toegestaan wordt te pushen. Zie *Hoofdstuk 3* voor meer gedetailleerde informatie over hoe je naar remote servers moet pushen.

## Een remote inspecteren

Als je meer informatie over een bepaalde remote wilt zien, kun je het `git remote show [remote-name]` commando gebruiken. Als je dit commando met een bepaalde alias uitvoert, zoals `origin`, dan krijg je zoiets als dit:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

Het toont de URL voor de remote repository samen met de tracking branch informatie. Het commando vertelt je behulpzaam dat als je op de master branch zit en je voert `git pull` uit, dat Git dan automatisch de master branch van de remote zal mergen nadat het alle remote references opgehaald heeft. Het toont ook alle remote referenties die het gepulled heeft.

Dat is een eenvoudig voorbeeld dat je vaak zult tegenkomen. Als je Git echter intensiever gebruikt, zul je veel meer informatie van `git remote show` krijgen:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Dit commando toont welke branch automatisch gepusht wordt als je `git push` uitvoert op bepaalde branches. Het toont je ook welke remote branches op de server je nog niet hebt, welke remote branches je hebt die verwijderd zijn van de server, en meerdere branches die automatisch gemerged worden als je `git pull` uitvoert.

## Remotes verwijderen en hernoemen

Als je een referentie wilt hernoemen, dan kun je in nieuwere versie van Git `git remote rename` uitvoeren om een alias van een remote te wijzigen. Bijvoorbeeld, als je `pb` wilt hernoemen naar `paul`, dan kun je dat doen met `git remote rename`:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Het is de moeite waard om te melden dat dit ook je remote branch naam verandert. Wat voorheen gerefereerd werd als `pb/master` is nu `paul/master`.

Als je om een of andere reden een referentie wilt verwijderen, je hebt de server verplaatst of je gebruikt een bepaalde mirror niet meer, of een medewerker doet niet meer mee, dan kun je `git remote rm` gebruiken:

	$ git remote rm paul
	$ git remote
	origin
