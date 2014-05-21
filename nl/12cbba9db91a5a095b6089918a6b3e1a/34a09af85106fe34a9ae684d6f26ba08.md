# Debuggen met Git

Git levert ook een paar tools om je problemen te helpen debuggen in je projecten. Omdat Git is ontworpen te werken met bijna elk type project zijn deze tools erg generiek, maar ze kunnen je vaak helpen een bug of schuldige te vinden als de dingen verkeerd gaan.

## Aantekenen van bestanden

Als je een bug in je code traceert en wilt weten wanneer het was geïntroduceerd en waarom, dan is bestands aantekenen vaak je beste methode. Het toont je welke commit de laatste was die iets wijzigde in een bepaald bestand. Dus als je ziet dat een methode in je code bugs bevat, dan kun je het bestand aantekenen met `git blame` om te zien wanneer een regel van de methode voor het laatst aangepast was en door wie. Dit voorbeeld gebruikt de `-L` optie om de output te beperken tot regel 12 tot en met 22:

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

Merk op dat het eerste veld de gedeeltelijke SHA-1 van de commit is die als laatste die regel gewijzigd heeft. De volgende twee velden zijn waarden die gehaald zijn uit die commit: de naam van de auteur en de datum van die commit, zodat je makkelijk kunt zien wie die regel aangepast heeft en wanneer. Daarna komt het regelnummer en de inhoud van dat bestand. Let ook op de `^4832fe2` commit regels, die aangeven dat die regels in de allereerste commit van dat bestand zaten. Die commit is gedaan toen dit bestand voor het eerst was toegevoegd aan dit project, en die regels zijn sindsdien ongewijzigd gebleven. Dit is ietwat wat verwarrend, want nu heb je minstens drie manieren gezien waarop Git het `^` symbool gebruikt om een SHA van een commit aan te passen, maar dit is wat het hier betekent.

Een ander gave ding van Git is dat het naamswijzigingen van bestanden niet expliciet bijhoudt. Het slaat de snapshots op en probeert dan impliciet uit te vogelen dat er iets hernoemd is, nadat dat gebeurd is. Een van de interessante gevolgen hiervan is dat je Git ook kunt vragen om allerlei soorten code verplaatsingen uit te zoeken. Als je `-C` aan `git blame` meegeeft, zal Git het bestand dat je aantekent analyseren en proberen uit te vinden waar stukjes code daarin oorspronkelijk vandaan kwamen als ze ergens vandaan gekopieerd zijn. Recentelijk was ik een bestand genaamd `GITServerHandler.m` aan het omschrijven naar meerdere bestanden, waarvan `GITPackUpload.m` er een was. Door `GITPackUpload.m` te blamen met de `-C` optie, kon ik zien waar delen van de code oorspronkelijk vandaan kwamen:

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

Dit is echt heel handig. Normaal krijg je als de originele commit de commit waar je de code naartoe gekopieerd hebt, omdat dat de eerste keer is dat je die regels aangeraakt hebt in dit bestand. Git vertelt je de oorspronkelijke commit waarin je deze regels geschreven hebt, zelfs als dat in een ander bestand was.

## Binair zoeken

Een bestand aantekenen helpt als je al weet waar het probleem zit. Als je niet weet waar de fout zit en er zijn dozijnen of honderden commits geweest sinds de laatste staat waarvan je weet dat de code werkte, dan zal je waarschijnlijk bij `git bisect` aankloppen voor hulp. Het `bisect` commando zoekt binair door je commit-geschiedenis om je zo snel als mogelijk te helpen identificeren welke commit het issue introduceerde.

Stel dat je zojuist een release van je code naar een productie omgeving gepusht hebt, en je krijgt bug rapporten dat er iets gebeurt wat niet in je development omgeving gebeurde en je kunt je niet voorstellen waarom de code dat aan het doen is. Je gaat terug naar je code, en het blijkt dat je het probleem kunt reproduceren maar je kunt niet zien wat er verkeerd gaat. Je kunt de code uitpluizen (bisecten) om het uit te vinden. Als eerste voer je `git bisect start` uit om aan de boel op te starten, en dan gebruik je `git bisect bad` om het systeem te vertellen dat de huidige commit waar je op zit kapot is. Dan moet je bisect vertellen wanneer de laatste goede status was, met `git bisect good [goede_commit]`:

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git heeft gezien dat er ongeveer 12 commits geweest zijn tussen de commit die je als laatste goede commit gemarkeerd hebt (v1.0) en de huidige slechte versie, en het heeft de middelste voor je uitgecheckt. Op dit punt kun je de test uitvoeren om te zien of het probleem op deze commit ook aanwezig is. Als dat zo is, dan was het probleem ergens voor deze middelste commit geïntroduceerd, zo niet dan is het probleem na deze commit geïntroduceerd. Het blijkt dat hier geen probleem is, dus vertel je Git dat door `git bisect good` te typen en je reis te vervolgen:

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

Nu zit je op een andere commit, halverwege degene die je zojuist getest hebt en je slechte commit. Je voert je test opnieuw uit, en stelt vast dat deze commit kapot is, dus vertel je dat Git met `git bisect bad`:

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

Deze commit is in orde, en nu heeft Git alle informatie die het nodig heeft om vast te stellen wanneer het probleem was geïntroduceerd. Het vertelt je de SHA-1 van de eerste slechte commit en toont een stukje commit informatie en welke bestanden aangepast waren in die commit, zodat je er achter kunt komen wat deze bug geïntroduceerd kan hebben:

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

Als je klaar bent, moet je `git bisect reset` uitvoeren om je HEAD terug te zetten naar het punt waar je was toen je startte, anders eindig je in een vreemde status:

	$ git bisect reset

Dit is een krachtige tool, die je kan helpen om in enkele minuten honderden commits te doorzoeken op zoek naar een fout. Sterker nog, als je een script hebt die eindigt met 0 als het project goed is of niet-0 als het fout is, kan je `git bisect` volledig automatiseren. Eerst vertel je het de scope van de bisect door het de goede en slechte commits te geven. Als je kan dit doen door ze op te geven bij het `bisect start` commando, waarbij je de slechte commit eerst en de laatst bekende goede commit als tweede geeft:

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

Door het zo te doen wordt `test-error.sh` uitgevoerd bij elke commit die uitgecheckt wordt, totdat Git de eerste kapotte commit vindt. Je kunt ook iets als `make` of `make tests` uitvoeren, of wat je ook hebt dat automatische tests voor je uitvoert.
