# Onderhoud en het herstellen van gegevens

Soms moet je wat opruimen - een repository compacter maken, een geïmporteerde repository opruimen of verloren werk terughalen. In deze paragraaf zal een aantal van deze scenario's behandeld worden.

## Onderhoud

Geregeld voert Git automatisch een commando genaamd "auto gc" uit. Het merendeel van de tijd doet dit commando niets. Maar, als je teveel loose objecten (objecten die niet in een packfile zitten) of teveel packfiles hebt, lanceert Git een uitgebreid `git gc` commando. Het `gc` staat voor garbage collect (afval ophalen), en het commando doet een aantal zaken: het haalt alle loose objecten op en stopt ze in packfiles, het consolideert packfiles tot één grote packfile, en het verwijdert objecten die niet bereikbaar zijn vanuit een commit en een paar maanden oud zijn.

Je kunt auto gc als volgt handmatig uitvoeren:

	$ git gc --auto

Nogmaals, over het algemeen doet dit commando niets. Je moet ongeveer 7.000 losse objecten of meer dan 50 packfiles hebben voordat Git een echt gc commando start. Je kunt deze grenzen aanpassen met respectievelijk de `gc.auto` en `gc.autopacklimit` configuratie instellingen.

Het andere dat `gc` zal doen is je referenties in een enkel bestand inpakken. Stel dat je repository de volgende branches en tags bevat:

	$ find .git/refs -type f
	.git/refs/heads/experiment
	.git/refs/heads/master
	.git/refs/tags/v1.0
	.git/refs/tags/v1.1

Als je `git gc` uitvoert, zal je deze bestanden niet langer in de `refs` directory hebben. Git zal ze omwille van efficiëntie in een bestand genaamd `.git/packed-refs` stoppen, dat er zo uitziet:

	$ cat .git/packed-refs
	# pack-refs with: peeled
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
	ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
	9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
	^1a410efbd13591db07496601ebc7a059dd55cfe9

Als je een referentie vernieuwt, zal Git dit bestand niet aanpassen maar een nieuw bestand in `refs/heads` schrijven. Om de juiste SHA voor een gegeven referentie te krijgen, kijkt Git voor die referentie in de `refs` directory en kijkt in het `packed-res` bestand als terugval optie. Hoe dan ook, als je een referentie niet in de `refs` directory kunt vinden zit het waarschijnlijk in je `packed-refs` bestand.

Let op de laatste regel van het bestand, die begint met een `^`. Dit betekent dat de tag die er direct boven staat een beschreven tag is, en dat die regel de commit is waar de beschreven tag naar wijst.

## Gegevens herstellen

Op een gegeven moment tijdens je reis met Git, is het mogelijk dat je per ongeluk een commit kwijtraakt. Meestal gebeurt dit omdat je een branch waar werk op zat geforceerd verwijdert, en je komt erachter dat je de branch achteraf toch had willen houden. Of je hard-reset een branch, waarmee je commits verliest waar je iets uit wilde hebben. Stel dat dit gebeurt, hoe kun je dan je commits terug halen?

Hier is een voorbeeld dat de master branch hard-reset naar een oudere commit in je test repository, en daarna verloren commits terug haalt. Laten we eerst eens bekijken waar je repository op dit punt staat:

	$ git log --pretty=oneline
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Nu verplaats je de `master` branch terug naar de middelste commit:

	$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
	HEAD is now at 1a410ef third commit
	$ git log --pretty=oneline
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Je bent nu effectief de twee bovenste commits kwijt - je hebt geen branch van waaruit deze commits bereikbaar zijn. Je moet de SHA van de laatste commit vinden en dan een branch toevoegen die daar naar wijst. De truuk is om de SHA van de laatste commit te vinden, het is niet waarschijnlijk dat je die uit je hoofd geleerd hebt, toch?

Vaak is de snelste manier een tool genaamd `git reflog` te gebruiken. Terwijl je werkt slaat Git stilletjes op wat je HEAD is, iedere keer als je die wijzigt. Elke keer als je commit, of van branch verandert wordt de reflog vernieuwd. Het reflog wordt ook vernieuwd door het `git update-ref` commando, wat nog een reden is om het te gebruiken in plaats van gewoon de SHA's naar je ref bestanden te schrijven, zoals we beschreven hebben in de "Git Referenties" paragraaf eerder in dit hoofdstuk. Je kunt op ieder moment zien waar je geweest bent, door `git reflog` uit te voeren.

	$ git reflog
	1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
	ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Hier kunnen we de twee commits zien die we uitgechecked hadden, maar er is hier niet veel informatie aanwezig. Om dezelfde informatie op een veel bruikbaarder manier te zien kunnen we `git log -g` uitvoeren, wat je een normale log uitvoer geeft voor je reflog.

	$ git log -g
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:22:37 2009 -0700

	    third commit

	commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	     modified repo a bit

Het ziet er naar uit dat de onderste commit degene is die je kwijt bent geraakt, dus je kunt hem herstellen door een nieuwe branch te maken op die commit. Bijvoorbeeld, je kunt een branch genaamd `recover-branch` beginnen op die commit (ab1afef):

	$ git branch recover-branch ab1afef
	$ git log --pretty=oneline recover-branch
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Vet – nu heb je een branch genaamd `recover-branch` die staat op het punt waar je `master` branch vroeger op stond, waarmee de eerste twee commits weer bereikbaar zijn.
Vervolgens, stel dat je verloren commit om een of andere reden niet in de reflog stond; je kunt dat simuleren door `recover-branch` te verwijderen en het reflog te wissen. Nu zijn de eerste twee commits nergens meer mee te bereiken:

	$ git branch –D recover-branch
	$ rm -Rf .git/logs/

Omdat de reflog gegevens bewaard worden in de `.git/logs/` directory, heb je nu effectief geen reflog meer. Hoe kun je die commit nu herstellen? Één manier is om gebruik te maken van het `git fsck` tool, wat de integriteit van je gegevensbank controleert. Als je het met de `--full` optie uitvoert, dan toont het je alle objecten waarnaar niet gewezen wordt door een ander object:

	$ git fsck --full
	dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
	dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
	dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

In dit geval, kun je de vermiste commit zien na de dangling commit (rondslingerende commit). Je kunt het op dezelfde manier herstellen, door een branch te maken die naar die SHA wijst.

## Objecten verwijderen

Er zijn een hoop geweldige dingen aan Git, maar één eigenschap die problemen kan geven is het feit dat `git clone` de hele historie van het project download, inclusief alle versies van alle bestanden. Dat is geen probleem als het hele project broncode is, omdat Git zeer geoptimaliseerd is om die gegevens optimaal te comprimeren. Maar, als iemand op een bepaald punt in de geschiedenis een enorm bestand heeft toegevoegd, zal iedere clone voor altijd gedwongen worden om dat grote bestand te downloaden, zelfs als het uit het project wordt verwijderd in de eerstvolgende commit. Omdat het bereikbaar is vanuit de geschiedenis, zal het er altijd zijn.

Dit kan een groot probleem zijn als je Subversion of Perforce repositories converteert naar Git. Omdat je niet de hele geschiedenis downloadt in die systemen, zal dit soort toevoeging weinig consequenties met zich meebrengen. Als je een import vanuit een ander systeem deed, of om een andere reden vindt dat je repository veel groter is dan het zou moeten zijn, kun je hier zien hoe je grote objecten kunt vinden en verwijderen.

Let op: deze techniek is destructief voor je commit geschiedenis. Het herschrijft ieder commit object stroomafwaarts vanaf de eerste tree die je moet aanpassen om een referentie naar een groot bestand te verwijderen. Als je dit meteen na een import doet, voordat iemand werk is gaan baseren op de commit, dan is er niets aan de hand - anders moet je alle bijdragers waarschuwen dat ze hun werk op je nieuwe commits moeten rebasen.

Om het te demonstreren, voeg je een groot bestand in je test repository toe, verwijdert het in de volgende commit, vindt het, en verwijdert het daarna permanent uit de repository. Als eerste, voeg je een groot object toe aan je geschiedenis:

	$ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
	$ git add git.tbz2
	$ git commit -am 'added git tarball'
	[master 6df7640] added git tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 create mode 100644 git.tbz2

Oeps — je wilde geen enorme tarball toevoegen aan je project. Laten we het maar snel verwijderen:

	$ git rm git.tbz2
	rm 'git.tbz2'
	$ git commit -m 'oops - removed large tarball'
	[master da3f30d] oops - removed large tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 delete mode 100644 git.tbz2

Nu `gc` je je gegevensbank en zie hoeveel ruimte je gebruikt:

	$ git gc
	Counting objects: 21, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (16/16), done.
	Writing objects: 100% (21/21), done.
	Total 21 (delta 3), reused 15 (delta 1)

Je kunt het `count-objects` commando gebruiken om snel te zien hoeveel ruimte je gebruikt:

	$ git count-objects -v
	count: 4
	size: 16
	in-pack: 21
	packs: 1
	size-pack: 2016
	prune-packable: 0
	garbage: 0

Op de `size-pack` regel staat de grootte van je packfiles in kilobytes, dus je gebruikt 2Mb. Voor de laatste commit gebruikte je bijna 2K - het is duidelijk dat het verwijderen van het bestand uit de vorige commit, het niet uit je geschiedenis verwijderd heeft. Iedere keer als iemand dit repository cloned, zullen ze de volle 2Mb moeten clonen alleen maar om dit kleine project te krijgen, omdat jij per ongeluk een groot bestand toegevoegd hebt. Laten we het echt verwijderen.

Eerst moet je het vinden. In dit geval weet je al welk bestand het is. Maar stel dat je het niet zou weten; hoe zou je kunnen ontdekken welk bestand of bestanden zoveel ruimte in beslag nemen? Als je `git gc` uitvoert zitten alle objecten in een packfile; je kunt de grote bestanden identificeren door een ander plumbing commando genaamd `git verify-pack` uit te voeren en te sorteren op het derde veld in de uitvoer, wat de bestandsgrootte is. Je kunt het ook door het `tail` commando leiden omdat je alleen geïnteresseerd bent in het laatste paar grote bestanden.

	$ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
	7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

Het grote object staat aan het einde: 2 Mb. Om uit te vinden welk bestand het is, kan je het `rev-list` commando gebruiken, wat je eventjes gebruikt hebt in Hoofdstuk 7. Als je `--objects` meegeeft aan `ref-list`, toont het alle commit SHA's en ook de blob SHA's met de bestandspaden die er mee geassocieerd zijn. Je kunt dit gebruiken om de naam van je blob te vinden:

	$ git rev-list --objects --all | grep 7a9eb2fb
	7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Nu moet je dit bestand verwijderen uit alle trees in het verleden. Je kunt eenvoudig zien welke commits dit bestand aangepast hebben:

	$ git log --pretty=oneline --branches -- git.tbz2
	da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
	6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Je moet alle commits die stroomafwaarts van `6df76` liggen herschrijven om dit bestand volledig uit je Git geschiedenis te verwijderen. Omdat te doen gebuik je `filter-branch`, wat je in Hoofdstuk 6 gebruikt hebt:

	$ git filter-branch --index-filter \
	   'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
	Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
	Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
	Ref 'refs/heads/master' was rewritten

De `--index-filter` optie is vergelijkbaar met de `--tree-filter` optie, die gebruikt is in Hoofdstuk 6, met het verschil dat in plaats van het doorgeven van een commando dat bestanden aanpast die uitgecheckt staan op je schijf, je de staging area of index iedere keer aanpast. In plaats van een specifiek bestand steeds te verwijderen met zoiets als `rm file`, moet je het met `git rm --cached` verwijderen - je moet het uit de index verwijderen, niet van de schijf. Reden om het zo te doen is snelheid - omdat Git niet iedere versie hoeft uit te checken op je schijf voordat het je filter uitvoert, kan het proces vele, vele malen sneller gaan. Je kunt dezelfde taak uitvoeren met `--tree-filter` als je dat wilt. De `--ignore-unmatch` optie op `git rm` vertelt het niet te stoppen op een fout als het patroon dat je probeert te verwijderen niet aanwezig is. Als laatste zal je `filter-branch` vragen om je geschiedenis alleen vanaf de `6df7640` commit te herschrijven, omdat je weet dat dat de plaats is waar het probleem begon. Anders start het vanaf het begin en duurt het onnodig langer.

Je geschiedenis zal niet langer een referentie bevatten naar dat bestand. Maar, je reflog en een nieuwe verzameling refs die Git toevoegde toen je de `filter-branch` deed onder `.git/refs/original` bevatten het nog steeds, dus je moet die ook verwijderen en dan je gegevensbank opnieuw inpakken. Je moet alles wat een pointer naar die oude commits bevat kwijtraken voordat je opnieuw inpakt:

	$ rm -Rf .git/refs/original
	$ rm -Rf .git/logs/
	$ git gc
	Counting objects: 19, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (19/19), done.
	Total 19 (delta 3), reused 16 (delta 1)

Laten we eens zien hoeveel ruimte je bespaard hebt.

	$ git count-objects -v
	count: 8
	size: 2040
	in-pack: 19
	packs: 1
	size-pack: 7
	prune-packable: 0
	garbage: 0

De grootte van je ingepakte repository is omlaag gegaan naar 7 K, wat veel beter is dan 2 Mb. Je kunt aan de waarde van size zien dat het grote object nog steeds in je loose objecten staat, dus het is niet weg; maar het zal niet meer overgedragen worden bij een push of opvolgende clone, wat het belangrijkste is. Als je het echt zou willen, kun je het object volledig verwijderen door `git prune --expire` uit te voeren.
