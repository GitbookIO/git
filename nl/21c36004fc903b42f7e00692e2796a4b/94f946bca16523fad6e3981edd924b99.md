# Git objecten

Git is een inhouds-adresseerbaar bestandssysteem. Mooi. Wat betekent dat?
Het betekent dat in de kern Git een eenvoudige sleutel-waarde gegevensopslagsysteem is. Je kunt er elk vorm van inhoud in stoppen, en het zal je een sleutel teruggeven die je kunt gebruiken om de inhoud op ieder moment terug te krijgen. Om te demonstreren kan je het plumbing commando `hash-object` gebruiken die wat gegevens aanneemt, het in je `.git` directory opslaat, en je de sleutel teruggeeft waarmee de gegevens zijn opgeslagen. Als eerste initialiseer je een nieuw Git repository en verifieer je dat er niets in de `objects` directory staat:

	$ mkdir test
	$ cd test
	$ git init
	Initialized empty Git repository in /tmp/test/.git/
	$ find .git/objects
	.git/objects
	.git/objects/info
	.git/objects/pack
	$ find .git/objects -type f
	$

Git heeft de `objects` directory geïnitialiseerd en de `pack` en `info` subdirectories erin aangemaakt, maar er zijn geen reguliere bestanden aanwezig. Nu sla je wat tekst in je Git databank op:

	$ echo 'test content' | git hash-object -w --stdin
	d670460b4b4aece5915caf5c68d12f560a9fe3e4

De `-w` vertelt `hash-object` dat het object opgeslagen moet worden; anders zal het commando je alleen vertellen wat de sleutel zou zijn geweest. Met `--stdin` vertel je het commando dat het de inhoud moet lezen van stdin; als je dit niet specificeert verwacht `hash-object` een pad naar een bestand. De uitvoer van het commando is een hash checksum van 40 karakters. Dit is de SHA-1 hash: een checksum van de inhoud die je opslaat plus een kop, waarover je straks meer zult leren. Nu kun je zien hoe Git je gegevens opgeslagen heeft:

	$ find .git/objects -type f
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Je kunt een bestand in de `objects` directory zien. Dit is hoe Git de inhoud initieel opslaat - als een enkel bestand per stuk inhoud, vernoemd met de SHA-1 checksum van de inhoud en z'n kop. De subdirectory is vernoemd naar de eerste 2 karakters van de SHA, en de bestandsnaam is de overige 38 karakters.

Je kunt de inhoud terug uit Git halen met het `cat-file` commando. Dit commando is een soort Zwitsers zakmes om Git objecten mee te inspecteren. Door de `-p` optie mee te geven, instrueer je het `cat-file` commando om uit te zoeken wat het type van de inhoud is en om het netjes aan je te tonen:

	$ git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4
	test content

Nu kun je inhoud aan Git toevoegen en het er weer uit halen. Je kunt dit ook doen met de inhoud van bestanden. Bijvoorbeeld, je kunt wat eenvoudig versie beheer op een bestand doen. Als eerste maak je een nieuw bestand en slaat de inhoud op in je databank:

	$ echo 'version 1' > test.txt
	$ git hash-object -w test.txt
	83baae61804e65cc73a7201a7252750c76066a30

Daarna schrijf je wat nieuwe inhoud in het bestand en slaat het opnieuw op:

	$ echo 'version 2' > test.txt
	$ git hash-object -w test.txt
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a

Je databank bevat de twee nieuwe versies van het bestand, samen met de eerste inhoud die je daar opgeslagen hebt:

	$ find .git/objects -type f
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Nu kun je het bestand terugdraaien naar de eerste versie

	$ git cat-file -p 83baae61804e65cc73a7201a7252750c76066a30 > test.txt
	$ cat test.txt
	version 1

of de tweede versie:

	$ git cat-file -p 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a > test.txt
	$ cat test.txt
	version 2

Maar de SHA-1 sleutel voor iedere versie van je bestand onthouden is niet erg praktisch; daarbij bewaar je de bestandsnaam niet in je systeem, alleen de inhoud. Dit objecttype heet een blob. Je kunt Git het objecttype van ieder object in Git laten vertellen, gegeven de SHA-1 sleutel, met `cat-file -t`:

	$ git cat-file -t 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
	blob

## Tree (boom) objecten

Het volgende type waar je naar gaat kijken is het tree object, wat het probleem van het opslaan van de bestandsnaam oplost en het ook mogelijk maakt om een groep bestanden bij elkaar op te slaan. Git bewaart inhoud op vergelijkbare wijze als een UNIX bestandssysteem, maar dan wat vereenvoudigd. Alle inhoud wordt opgeslagen als tree- en blob-objecten, waarbij trees corresponderen met UNIX directory vermeldingen en blobs min of meer corresponderen met inodes of bestandsinhoud. Een enkel treeobject bevat één of meer tree vermeldingen, waarvan ieder een SHA-1 pointer naar een blob of subtree bevat met zijn geassocieerde mode, type en bestandsnaam. Bijvoorbeeld, de meest recente tree in het simplegit project zou er zo uit kunnen zien:

	$ git cat-file -p master^{tree}
	100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
	100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
	040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib

De `master^{tree}` syntax specificeert het tree object waarnaar gewezen wordt door de laatste commit op je `master` branch. Merk op dat de `lib` subdirectory geen blob is, maar een pointer naar een andere tree:

	$ git cat-file -p 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0
	100644 blob 47c6340d6459e05787f644c2447d2595f5d3a54b      simplegit.rb

Conceptueel zijn de gegevens die Git opslaat zoiets als in Figuur 9-1.


![](http://git-scm.com/figures/18333fig0901-tn.png)

Figuur 9-1. Eenvoudige versie van het Git data model.

Je kunt je eigen tree maken. Normaal gesproken maakt Git een tree door de status van je staging area of index te pakken en daar een tree object mee te schrijven. Dus, om een treeobject te maken moet je eerst een index opzetten door een paar bestanden te stagen. Om een index te maken met een enkele vermelding - de eerste versie van je test.txt bestand - kun je het plumbing commando `update-index` gebruiken. Je gebruikt dit commando om kunstmatig de eerdere versie van het test.txt bestand toe te voegen aan een nieuwe staging area. Je moet het de `--add` optie meegeven omdat het bestand nog niet bestaat in je staging area (je hebt zelfs nog geen staging area ingesteld) en `--cacheinfo` omdat het bestand dat je toevoegt niet in je directory staat maar in je databank. Daarna specificeer je de modus, SHA-1 en bestandsnaam:

	$ git update-index --add --cacheinfo 100644 \
	  83baae61804e65cc73a7201a7252750c76066a30 test.txt

In dit geval specificeer je een modus `100644`, wat aangeeft dat het een normaal bestand is. Andere opties zijn `100755`, wat aangeeft dat het een uitvoerbaar bestand is, en `120000` wat een symbolische link specificeert. De modus is afgekeken van normale UNIX modi, maar is veel minder flexibel; deze drie modi zijn de enige die geldig zijn voor bestanden (blobs) in Git (alhoewel andere modi worden gebruikt voor directories en submodules).

Nu kun je het `write-tree` commando gebruiken om het staging area naar een treeobject te schrijven. Er is geen `-w` optie nodig, `write-tree` aanroepen zorgt er automatisch voor dat een treeobject gecreëerd wordt van de status van de index als die tree nog niet bestaat:

	$ git write-tree
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	$ git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	100644 blob 83baae61804e65cc73a7201a7252750c76066a30      test.txt

Je kunt ook verifiëren dat dit een treeobject is:

	$ git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	tree

Je gaat nu een nieuwe tree aanmaken met de tweede versie van het test.txt bestand en ook een nieuw bestand:

	$ echo 'new file' > new.txt
	$ git update-index test.txt
	$ git update-index --add new.txt

Je staging area heeft nu een nieuwe versie van test.txt, als ook het nieuwe new.txt bestand. Schrijf de tree (wat de status van het staging area of index opslaat als tree object) en kijk hoe het er uit ziet:

	$ git write-tree
	0155eb4229851634a0f03eb265b69f5a2d56f341
	$ git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Merk op dat deze tree beide bestandsvermeldingen bevat en ook dat de SHA van test.txt de "versie 2" SHA is van eerder (`1f7a7a`). Je gaat nu voor de lol de eerste tree als een subtree toevoegen aan deze. Je kunt trees in je staging area lezen door `read-tree` aan te roepen. In dit geval kun je een bestaande tree in je staging area lezen als een subtree met de `--prefix` optie aan `read-tree`:

	$ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	$ git write-tree
	3c4e9cd789d88d8d89c1073707c3585e41b0e614
	$ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
	040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Als je een werkdirectory zou hebben gemaakt van de nieuwe tree die je zojuist geschreven hebt, zou je de twee bestanden in het hoogste niveau van de werkdirectory krijgen en een subdirectory genaamd `bak` die de eerste versie van het test.txt bestand bevat. Je kunt de gegevens die Git bevat voor deze structuren zien zoals getoond in Figuur 9-2.


![](http://git-scm.com/figures/18333fig0902-tn.png)

Figuur 9-2. De inhoud structuur van je huidige Git gegevens.

## Commit objecten

Je hebt drie trees die de verschillende snapshots weergeven die je wilt tracken, maar het eerdere probleem blijft: je moet alledrie SHA-1 waarden onthouden om de snapshots weer op te halen. Je hebt ook geen informatie over wie de snapshots opgeslagen heeft, wanneer ze opgeslagen zijn of waarom ze opgeslagen zijn. Dit is de basis informatie die het commit object voor je bevat.

Om een commit object te creëren moet je `commit-tree` aanroepen en één tree SHA-1 specificeren en welke commit objecten, als er die zijn, er direct aan vooraf gingen. Begin met de eerste tree die je geschreven hebt:

	$ echo 'first commit' | git commit-tree d8329f
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d

Nu kun je je nieuwe commit object bekijken met `cat-file`:

	$ git cat-file -p fdf4fc3
	tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	author Scott Chacon <schacon@gmail.com> 1243040974 -0700
	committer Scott Chacon <schacon@gmail.com> 1243040974 -0700

	first commit

Het formaat van een commit object is simpel: het specificeert de hoogste tree voor de snapshot van het project op dat punt: de auteur/committer informatie die uit de `user.name` en `user.email` configuratie instellingen gehaald is, met de huidige tijd, een lege regel en dan de commit boodschap.

Vervolgens ga je de twee andere commit objecten schrijven, waarbij ze elk naar het commit object dat er direct aan vooraf gaat verwijzen:

	$ echo 'second commit' | git commit-tree 0155eb -p fdf4fc3
	cac0cab538b970a37ea1e769cbbde608743bc96d
	$ echo 'third commit'  | git commit-tree 3c4e9c -p cac0cab
	1a410efbd13591db07496601ebc7a059dd55cfe9

Elk van de drie commit objecten wijst naar één van de drie snapshots die je gemaakt hebt. Grappig genoeg heb je nu een echte Git historie die je kunt bekijken met het `git log` commando, als je dat op de SHA-1 van de laatste commit uitvoert:

	$ git log --stat 1a410e
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	    third commit

	 bak/test.txt |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

	commit cac0cab538b970a37ea1e769cbbde608743bc96d
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:14:29 2009 -0700

	    second commit

	 new.txt  |    1 +
	 test.txt |    2 +-
	 2 files changed, 2 insertions(+), 1 deletions(-)

	commit fdf4fc3344e67ab068f836878b6c4951e3b15f3d
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:09:34 2009 -0700

	    first commit

	 test.txt |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Verbazingwekkend. Je hebt zojuist de lagere operaties uitgevoerd om een Git history op te bouwen, zonder één van de front ends te gebruiken. Dit is in essentie wat Git doet als je de `git add` en `git commit` commando's uitvoert: het slaat de blobs voor de gewijzigde bestanden op, ververst de index, schrijft de trees weg, en schrijft commit objecten die de bovenste trees en commits refereren die direct voor ze kwamen. Deze drie hoofd Git-objecten – de blob, de tree en de commit – worden in eerste instantie als aparte bestanden opgeslagen in je `.git/objects` directory. Hier zijn alle objecten die nu in de voorbeeld directory staan, voorzien van commentaar met wat ze bevatten:

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Als je alle interne verwijzingen volgt, krijg je een object-graaf die er uitzien zoals Figuur 9-3.


![](http://git-scm.com/figures/18333fig0903-tn.png)

Figuur 9-3. Alle objecten in je Git directory.

## Object opslag

Ik vertelde eerder dat er een kop wordt opgeslagen bij de inhoud. Laten we eens kijken naar hoe Git zijn objecten opslaat. Je zult zien hoe je een blob object opslaat, in dit geval de tekst "what is up, doc?", op een interactieve manier in de Ruby scripttaal. Je kunt Ruby in de interactieve modus starten met het `irb` commando:

	$ irb
	>> content = "what is up, doc?"
	=> "what is up, doc?"

Git stelt een kop samen die begint met het type van het object, in dit geval een blob. Daarna voegt het een spatie toe, gevolgd door de grootte van de inhoud en als laatste een null byte:

	>> header = "blob #{content.length}\0"
	=> "blob 16\000"

Git voegt de kop en de originele inhoud samen en berekent vervolgens de SHA-1 checksum van die nieuwe inhoud. Je kunt de SHA-1 waarde van een regel tekst in Ruby berekenen door de SHA1 verwerkingsbibliotheek op te nemen met het `require` commando en dan `Digest::SHA1.hexdigest()` aan te roepen met de tekst:

	>> store = header + content
	=> "blob 16\000what is up, doc?"
	>> require 'digest/sha1'
	=> true
	>> sha1 = Digest::SHA1.hexdigest(store)
	=> "bd9dbf5aae1a3862dd1526723246b20206e5fc37"

Git comprimeert de nieuwe inhoud met zlib, wat je in Ruby kunt doen met de zlib bibliotheek. Als eerste moet je de bibliotheek opnemen, en dan `Zlib::Deflate.deflate()` op de inhoud uitvoeren:

	>> require 'zlib'
	=> true
	>> zlib_content = Zlib::Deflate.deflate(store)
	=> "x\234K\312\311OR04c(\317H,Q\310,V(-\320QH\311O\266\a\000_\034\a\235"

Als laatste schrijf je de zlib-gecomprimeerde inhoud naar een object op de schijf. Je bepaalt het pad van het object dat je wilt wegschrijven (de eerste twee karakters van de SHA-1 waarde zijn de subdirectory naam, en de laatste 38 karakters zijn de bestandsnaam in die directory). In Ruby kun je de `FileUtils.mkdir_p()` functie gebruiken om de subdirectory aan te maken als hij nog niet bestaat. Daarna open je het bestand met `File.open()` en schrijft de eerder met zlib gecomprimeerde inhoud in het bestand met een aanroep van `write()` op het resulterende file handle (bestands-aangrijpingspunt).

	>> path = '.git/objects/' + sha1[0,2] + '/' + sha1[2,38]
	=> ".git/objects/bd/9dbf5aae1a3862dd1526723246b20206e5fc37"
	>> require 'fileutils'
	=> true
	>> FileUtils.mkdir_p(File.dirname(path))
	=> ".git/objects/bd"
	>> File.open(path, 'w') { |f| f.write zlib_content }
	=> 32

Dat is alles - je hebt nu een geldig Git blob object aangemaakt. Alle Git objecten zijn op dezelfde manier opgeslagen, alleen de types verschillen - in plaats van de tekst blob, zal de kop beginnen met commit of tree. En alhoewel de inhoud van een blob vrijwel alles kan zijn, is de inhoud van een commit en tree zeer specifiek geformatteerd.
