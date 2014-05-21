# Packfiles

Laten we eens terug gaan naar de object-databank van je test Git repository. Op dit punt heb je 11 objecten – 4 blobs, 3 trees, 3 commits en 1 tag:

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git comprimeert de inhoud van deze bestanden met zlib en je slaat maar weinig op, dus nemen deze bestanden samen maar 925 bytes in beslag. Je zult nu wat grotere inhoud toevoegen aan het repository om een interessante eigenschap van Git te demonstreren. Voeg het repo.rb bestand toe van de Grit bibliotheek waaraan je eerder gewerkt hebt, dit is een broncode bestand van ongeveer 12K groot:

	$ curl http://github.com/mojombo/grit/raw/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb
	$ git commit -m 'added repo.rb'
	[master 484a592] added repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

Als je naar de resulterende tree kijkt, kun je zien welke SHA-1 waarde repo.rb gekregen heeft voor het blob object:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Dan controleer je hoe groot het object is op jouw schijf:

	$ du -b .git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	4102	.git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e

Pas dat bestand nu eens een beetje aan, en kijk wat er gebeurt:

	$ echo '# testing' >> repo.rb
	$ git commit -am 'modified repo a bit'
	[master ab1afef] modified repo a bit
	 1 files changed, 1 insertions(+), 0 deletions(-)

Bekijk de tree die door de commit gemaakt is, en je zult iets interessants zien:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

De blob is nu een andere blob, wat betekent dat, alhoewel je slechts een enkele regel aan het eind van een bestand van 400 regels toegevoegd hebt, Git die nieuwe inhoud als een compleet nieuw object opgeslagen heeft:

	$ du -b .git/objects/05/408d195263d853f09dca71d55116663690c27c
	4109	.git/objects/05/408d195263d853f09dca71d55116663690c27c

Je hebt nu twee vrijwel identieke 12K grote objecten op je harde schijf. Zou het niet prettig zijn als Git één van de twee volledig op kon slaan, en het tweede object slechts als delta tussen die en de eerste?

Dat kan dus. Het initiële formaat waarin Git objecten opslaat op de harde schijf wordt een loose (losse) object formaat genoemd. Maar, eens in de zoveel tijd pakt Git een aantal van die objecten samen in een enkel binair bestand wat een packfile genoemd wordt, om ruimte te besparen en efficiënter te zijn. Git doet dit als je teveel loose objecten rond hebt slingeren, als je het `git gc` commando handmatig uitvoert, of als je naar een remote server pusht. Om te zien wat er gebeurt, kun je Git handmatig vragen om de objecten in te pakken met het `git gc` commando:

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

Als je in je objecten directory kijkt, zul je zien dat de meeste objecten verdwenen zijn, en er een aantal nieuwe bestanden verschenen zijn:

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

De objecten die overgebleven zijn, zijn de blobs waarnaar geen enkel commit wijst - in dit geval zijn het de "what is up, doc?" en de "test content" voorbeeld-blobs die je eerder aangemaakt hebt. Omdat je ze nooit aan een commit toegevoegd hebt, worden ze beschouwd als dangling (rondslingerend) en worden niet in je nieuwe packfile ingepakt.

De andere bestanden zijn het nieuwe packbestand en een index. Het packbestand is een enkel bestand dat de inhoud bevat van alle objecten die van je bestandssysteem verwijderd zijn. De index is een bestand dat offsets binnen de packfile bevat, zodat je snel naar een specifiek object kunt zoeken. Wat stoer is, is dat waar de objecten op de harde schijf voordat je `gc` aanriep samen zo'n 8K groot waren, de nieuwe packfile slechts 4K groot is. Je hebt je schijfgebruik gehalveerd door je bestanden in te pakken.

Hoe doet Git dit? Als Git objecten inpakt, zoekt het naar bestanden die qua naam en grootte gelijk zijn, en slaat slechts de delta's van de ene versie van het bestand naar de volgende op. Je kunt in de packfile kijken en zien wat Git gedaan heeft om ruimte te besparen. Het `git verify-pack` plumbing commando stelt je in staat om te zien wat er ingepakt is:

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

Hier refereert de `9bc1d` blob wat, als je dat nog kunt herinneren, de eerste versie is van je repo.rb bestand, aan de `05408` blob, wat de tweede versie is van het bestand. De derde kolom in de uitvoer is de grootte van het object in het pakket, zodat je kunt zien dat `05408` 12K van het bestand in beslag neemt maar dat `9bc1d` slechts 7 bytes in beslag neemt. Wat ook interessant is, is dat de tweede versie van het bestand degene is die intact opgeslagen wordt, terwijl de originele versie als delta opgeslagen wordt - dit is zo gedaan omdat het aannemelijk is dat je snellere toegang nodig hebt tot de meest recente versie van het bestand.

Het echt prettige van dit alles is, dat het op ieder gewenst moment opnieuw ingepakt kan worden. Git zal op gezette tijden je databank automatisch opnieuw inpakken, omdat het altijd meer ruimte wil besparen. Je kunt ook handmatig opnieuw inpakken op elk gewenst tijdstip, door `git gc` met de hand uit te voeren.
