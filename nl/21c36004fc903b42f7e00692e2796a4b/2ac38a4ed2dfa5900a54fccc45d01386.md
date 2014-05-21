# Git referenties

Je kunt zoiets als `git log 1a410e` uitvoeren om door je hele geschiedenis te kijken, maar je moet nog steeds onthouden dat `1a410e` de laatste commit is om die geschiedenis te kunnen doorlopen en alle objecten te vinden. Je hebt een bestand nodig waarin je de SHA-1 waarde als een eenvoudige naam kunt opslaan, zodat je die als wijzer kunt gebruiken in plaats van de kale SHA-1 waarde.

In Git worden deze "referenties" of "refs" genoemd; je kunt de bestanden die de SHA-1 waarden bevatten vinden in de `.git/refs` directory. In het huidige project bevat deze directory geen bestanden, maar het bevat wel een eenvoudige structuur:

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

Om een nieuwe referentie aan te maken, die je zal helpen herinneren waar je laatste commit is, kun je technisch zoiets eenvoudigs als dit doen:

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

Nu kan je de head referentie die je zojuist hebt aangemaakt gebruiken in je Git commando's, in plaats van de SHA-1 waarde:

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Het wordt niet aangeraden om de referentie bestanden direct aan te passen. Git levert een veiliger commando mee om dit te doen als je een referentie wilt aanpassen, genaamd `update-ref`:

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

Dat is eigenlijk wat een branch in Git is: een eenvoudige wijzer of referentie naar de head van een bepaald stuk werk. Om een branch te maken terug bij de tweede commit, kun je dit doen:

	$ git update-ref refs/heads/test cac0ca

Je branch zal alleen werk bevatten vanaf die commit en eerder:

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Nu ziet je Git gegevensbank er conceptueel ongeveer uit zoals in Figuur 9-4.


![](http://git-scm.com/figures/18333fig0904-tn.png)

Figuur 9-4. Git directory objecten met branch head referenties erbij.

Als je commando's zoals `git branch (branchnaam)` uitvoert, voert Git eigenlijk dat `update-ref` commando uit om de SHA-1 van de laatste commit van de branch waarop je zit toe te voegen aan een door jou te benoemen nieuwe referentie.

## De HEAD

De vraag is nu: als je `git branch (branchnaam)` uitvoert, hoe weet Git de SHA-1 van de laatste commit? Het antwoord is het HEAD bestand. Het HEAD bestand is een symbolische referentie naar de branch waar je momenteel op zit. Met symbolische referentie bedoel ik dat deze, in tegenstelling tot een normale referentie, over het algemeen geen SHA-1 waarde bevat maar een verwijzing naar een andere referentie. Als je naar het bestand kijkt, zal je normaal gesproken zoiets als dit zien:

	$ cat .git/HEAD
	ref: refs/heads/master

Als je `git checkout test` uitvoert, zal Git het bestand wijzigen zodat het er zo uit ziet:

	$ cat .git/HEAD
	ref: refs/heads/test

Als je `git commit` uitvoert wordt het commit object gecreëerd, waarbij de ouder van die commit object gezet wordt op de SHA-1 waarde van de referentie waar de HEAD op dat moment naar verwijst.

Je kunt dit bestand ook handmatig aanpassen, maar ook daar bestaat weer een veiliger commando voor: `symbolic-ref`. Je kunt de waarde van je HEAD lezen via dit commando:

	$ git symbolic-ref HEAD
	refs/heads/master

Je kunt de waarde van HEAD ook instellen:

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD
	ref: refs/heads/test

Je kunt geen symbolische referentie instellen die buiten de refs stijl valt:

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## Tags

We hebben zojuist de drie hoofdobject types van Git behandeld, maar er bestaat een vierde. Het tag object lijkt erg op een commit object - het bevat een tagger, een datum, een bericht en een pointer. Het grootste verschil is dat een tag object naar een commit wijst in plaats van een tree. Het is vergelijkbaar met een branch referentie, maar het zal nooit verplaatst worden - het zal altijd naar dezelfde commit wijzen, maar geeft het een vriendelijker naam.

Zoals besproken in hoofdstuk 2, zijn er twee soorten tags: beschreven en lichtgewicht. Je kunt een lichtgewicht tag maken door zoiets als dit uit te voeren:

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

Dat is wat een lichtgewicht tag is - een branch die nooit beweegt. Een beschreven tag is echter ingewikkelder. Als je een beschreven tag aanmaakt, creëert Git een tag object en schrijft dan een referentie die daar naar wijst in plaats van direct naar de commit. Je kunt dit zien door een beschreven tag aan te maken (`-a` specificeert dat het een beschreven tag is):

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 –m 'test tag'

Hier is de object SHA-1 waarde die het creëerde:

	$ cat .git/refs/tags/v1.1
	9585191f37f7b0fb9444f35a9bf50de191beadc2

Voer nu het `cat-file` commando uit op die SHA-1 waarde:

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

Merk op dat de object regel wijst naar de SHA-1 waarde die je getagged hebt. Merk ook op dat het niet naar een commit hoeft te wijzen; je kunt ieder Git object een tag geven. In de Git broncode bijvoorbeeld, heeft de maintainer zijn publieke GPG sleutel als een blob object toegevoegd en het een tag gegeven. Je kunt de publieke sleutel bekijken door dit uit te voeren

	$ git cat-file blob junio-gpg-pub

in de Git broncode. De Linux kernel heeft ook een non-commit-verwijzend tag object – het eerste tag object wijst naar de initiële tree van de import van de broncode.

## Remotes

Het derde soort referentie dat je zult zien is een remote referentie. Als je een remote toevoegt en er naar pusht, slaat Git de laatste waarde op die je gepusht hebt naar die remote voor iedere branch in de `refs/remotes` directory. Bijvoorbeeld, je kunt een remote genaamd `origin` toevoegen en je master branch hier naar pushen:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

Daarna kun je zien wat de `master` branch op de `origin` remote was toen je voor 't laatst met de server communiceerde, door het `refs/remotes/origin/master` bestand te bekijken:

	$ cat .git/refs/remotes/origin/master
	ca82a6dff817ec66f44342007202690a93763949

Remote referenties verschillen van branches (`refs/heads` referenties) voornamelijk in het feit dat ze niet uitgechecked kunnen worden. Git verplaatst ze als boekenleggers naar de laatste status van die branches op de servers.
