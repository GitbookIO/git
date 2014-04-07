# Rebasen

In Git zijn er twee hoofdmanieren om wijzigingen te integreren van de ene branch in een andere: de `merge` en de `rebase`. In deze paragraaf ga je leren wat rebasen is, hoe je dat moet doen, waarom het een zeer bijzondere stukje gereedschap is en in welke gevallen je het niet wilt gebruiken.

## De simpele rebase

Als je het eerdere voorbeeld van de Merge-paragraaf erop terugslaat (zie Figuur 3-27), dan zul je zien dat je werk is uiteengelopen en dat je commits hebt gedaan op de twee verschillende branches.


![](http://git-scm.com/figures/18333fig0327-tn.png)

Figuur 3-27. Je initiële uiteengelopen historie.

De simpelste manier om de branches te integreren, zoals we al hebben besproken, is het `merge` commando. Het voert een drieweg merge uit tussen de twee laatste snapshots van de branches (C3 en C4), en de meest recente gezamenlijke voorouder van die twee (C2), en maakt een nieuw snapshot (en commit) zoals getoond in Figuur 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)

Figuur 3-28. Een branch mergen om de uiteengelopen werk histories te integreren.

Maar, er is nog een manier: je kunt de patch van de wijziging die werd geïntroduceerd in C3 pakken en die opnieuw toepassen op C4. In Git, wordt dit _rebasen_ genoemd. Met het `rebase` commando kan je alle wijzigingen pakken die zijn gecommit op de ene branch, en ze opnieuw afspelen op een andere.

In dit voorbeeld, zou je het volgende uitvoeren:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

Het gebeurt door naar de gezamenlijke voorouder van de twee branches te gaan (degene waar je op zit en degene waar je op rebased), de diff te nemen die geïntroduceerd is voor elke losse commit op de branch waar je op zit, die diffs in tijdelijke bestanden te bewaren, de huidige branch terug te zetten naar dezelfde commit als de branch waar je op rebased, en uiteindelijk elke diff om de beurt te applyen, Figuur 3-29 toont dit proces.


![](http://git-scm.com/figures/18333fig0329-tn.png)

Figuur 3-29. De wijzigingen die geïntroduceerd zijn in C3 rebasen op C4.

Hierna kan je terug gaan naar de master branch en een fast-forward merge doen (zie Figuur 3-30).


![](http://git-scm.com/figures/18333fig0330-tn.png)

Figuur 3-30. De master branch Fast-forwarden.

Nu is het snapshot waar C3' naar wijst precies dezelfde als degene waar C5 naar wees in het merge voorbeeld. Er zit geen verschil in het eindresultaat van de integratie, maar rebasen zorgt voor een duidelijkere historie. Als je de log van een branch die gerebased is bekijkt, ziet het eruit als een lineaire historie: het lijkt alsof al het werk in serie heeft plaatsgevonden, zelfs wanneer het in werkelijkheid parallel eraan gedaan is.

Vaak zal je dit doen om er zeker van te zijn dat je commits netjes toegepast kunnen worden op een remote branch - misschien in een project waar je aan probeert bij te dragen, maar dat je niet beheert. In dit geval zou je het werk in een branch uitvoeren en dan je werk rebasen op `origin/master` als je klaar ben om je patches in te sturen naar het hoofd project. Op die manier hoeft de beheerder geen integratie werk te doen - gewoon een fast-forward of een schone apply.

Merk op dat de snapshot waar de laatste commit op het eind naar wijst, of het de laatste van de gerebasede commits voor een rebase is of de laatste merge commit na een merge, detzelfde snapshot is - alleen de historie is verschillend. Rebasen speelt veranderingen van een werklijn opnieuw af op een andere, in de volgorde waarin ze gemaakt zijn, terwijl mergen de eindresultaten pakt en die samenvoegt.

## Interessantere rebases

Je kunt je rebase ook opnieuw laten afspelen op iets anders dan de rebase branch. Pak een historie zoals in Figuur 3-31, bijvoorbeeld. Je hebt een topic branch afgesplitst (`server`) om wat server-kant functionaliteit toe te voegen aan je project en toen een gecommit. Daarna heb je daar vanaf gebranched om de client-kant wijzigingen te doen (`client`) en een paar keer gecommit. Als laatste, ben je teruggegaan naar je server branch en hebt nog een paar commits gedaan.


![](http://git-scm.com/figures/18333fig0331-tn.png)

Figuur 3-31. Een historie met een topic branch vanaf een andere topic branch.

Stel nu, je besluit dat je de client-kant wijzigingen wilt mergen in je hoofdlijn voor een release, maar je wilt de server-kant wijzigingen nog vasthouden totdat het verder getest is. Je kunt de wijzigingen van client pakken, die nog niet op server zitten (C8 en C9) en die opnieuw afspelen op je master branch door de `--onto` optie te gebruiken van `git rebase`:

	$ git rebase --onto master server client

Dit zegt in feite, "Check de client branch uit, verzamel de patches van de gezamenlijke voorouder van de `client` en de `server` branches, en speel die opnieuw af op `master`." Het is een beetje ingewikkeld, maar het resultaat, getoond in Figuur 3-32, is erg prettig.


![](http://git-scm.com/figures/18333fig0332-tn.png)

Figuur 3-32. Een topic branch rebasen vanaf een andere topic branch.

Nu kun je een fast-forward doen van je master branch (zie Figuur 3-33):

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)

Figuur 3-33. Je master branch fast-forwarden om de client branch wijzigingen mee te nemen.

Stel dat je besluit om de server branch ook te pullen. Je kunt de server branch rebasen op de master branch zonder het eerst te hoeven uitchecken door `git rebase [basisbranch] [topicbranch]` uit te voeren - wat de topic branch voor je uitcheckt (in dit geval, `server`) en het opnieuw afspeelt om de basis branch (`master`):

	$ git rebase master server

Dit speelt het `server` werk opnieuw af op het `master` werk, zoals getoond in Figuur 3-34.


![](http://git-scm.com/figures/18333fig0334-tn.png)

Figuur 3-34. Je server branch op je master branch rebasen.

Daarna kan je de basis branch (`master`) fast-forwarden:

	$ git checkout master
	$ git merge server

Je kunt de `client` en `server` branches verwijderen, omdat al het werk geïntegreerd is en je ze niet meer nodig hebt, en de historie voor het hele proces ziet eruit zoals in Figuur 3-35:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)

Figuur 3-35. Uiteindelijke commit historie.

## De gevaren van rebasen

Ahh, maar de zegeningen van rebasen zijn niet geheel zonder nadelen, samengevat in één enkele regel:

**Rebase geen commits die je gepusht hebt naar een publiek repository.**

Als je die richtlijn volgt, kan je weinig gebeuren. Als je dat niet doet, zullen mensen je haten en je zult door vrienden en familie uitgehoond worden.

Als je spullen rebased, zet je bestaande commits buitenspel en maak je nieuwe aan die vergelijkbaar zijn maar anders. Als je commits ergens pusht en andere pullen deze en baseren daar werk op, en vervolgens herschrijf je die commits met `git rebase` en pusht deze weer, dan zullen je medewerkers hun werk opnieuw moeten mergen en zal het allemaal erg vervelend worden als je hun werk probeert te pullen in het jouwe.

Laten we eens kijken naar een voorbeeld hoe werk rebasen dat je publiek gemaakt hebt problemen kan veroorzaken. Stel dat je van een centrale server cloned en dan daar wat werk aan doet. Je commit historie ziet er uit als Figuur 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)

Figuur 3-36. Clone een repository, en doe wat werk daarop.

Nu doet iemand anders wat meer werk wat een merge bevat, en pusht dat werk naar de centrale server. Je fetcht dat en merged de nieuwe remote branch in jouw werk, zodat je historie er uit ziet zoals Figuur 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)

Figuur 3-37. Haal meer commits op, en merge ze in je werk.

Daarna, beslist de persoon die het werk gepusht heeft om erop terug te komen en in plaats daarvan zijn werk te gaan rebasen; hij voeren een `git push --force` uit om de historie op de server te herschrijven. Je pullt daarna van die server, waarbij je de nieuwe commits binnen krijgt.


![](http://git-scm.com/figures/18333fig0338-tn.png)

Figuur 3-38. Iemand pusht gerebasede commits, daarbij commits buitenspel zettend waar jij werk op gebaseerd hebt.

Nu moet je dit werk opnieuw mergen, terwijl je dat al gedaan hebt. Rebasen verandert de SHA-1 hashes van deze commits, dus voor Git zien ze er uit als nieuwe commits, terwijl je in feite het C4 werk al in je historie hebt (zie Figuur 3-39).


![](http://git-scm.com/figures/18333fig0339-tn.png)

Figuur 3-39. Je merget hetzelfde werk opnieuw in een nieuwe merge commit.

Je moet dat werk op een gegeven moment mergen, zodat je in de toekomst bij kunt blijven met de andere ontwikkelaar. Nadat je dat gedaan hebt, zal je history zowel de C4 als de C4' commits bevatten, die verschillende SHA-1 hashes hebben, maar die hetzelfde werk introduceren en hetzelfde commit bericht hebben. Wanneer je een `git log` uitvoert als je historie er zo uitziet, dan zul je twee commits zien die dezelfde auteur, datum en bericht hebben, wat alleen maar verwarring geeft. Daarnaast zal je, als je deze historie pusht naar de server, al die gerebasede commits opnieuw introduceren op de centrale server, wat mensen nog meer kan verwarren.

Als je rebasen behandelt als een manier om commits op te ruimen en ze te bewerken voordat je ze pusht, en als je alleen commits rebaset die nog nooit publiekelijk beschikbaar zijn geweest, dan zal er niets aan de hand zijn. Als je commits rebaset die al publiekelijk gepusht zijn, en mensen kunnen werk gebaseerd hebben op die commits, bereid je dan maar voor op een aantal frustrerende problemen.
