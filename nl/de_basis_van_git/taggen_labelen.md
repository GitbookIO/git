# Taggen (Labelen)

Zoals de meeste VCS'en, heeft git de mogelijkheid om specifieke punten in de history als belangrijk te taggen (labelen). Over het algemeen gebruiken mensen deze functionaliteit om versie-punten te markeren (`v1.0`, en zo). In deze paragraaf zul je leren hoe de beschikbare tags te tonen, hoe nieuwe tags te creëren, en wat de verschillende typen tags zijn.

## Jouw tags laten zien

De beschikbare tags in Git laten zien is rechttoe rechtaan. Type gewoon `git tag`:

	$ git tag
	v0.1
	v1.3

Dit commando toont de tags in alfabetische volgorde; de volgorde waarin ze verschijnen heeft geen echte betekenis.

Je kunt ook zoeken op tags met een bepaald patroon. De Git bron-repository, bijvoorbeeld, bevat meer dan 240 tags. Als je alleen geïnteresseerd bent om naar de 1.4.2 serie te kijken, kun je dit uitvoeren:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Tags creëren

Git gebruikt twee soorten tags: lightweight (lichtgewicht) en annotated (beschreven). Een lightweight tag komt overeen met een branch die niet verandert: het is slechts een wijzer naar een specifieke commit. Annotated tags daarentegen, zijn als volwaardige objecten in de Git database opgeslagen. Ze worden gechecksummed, bevatten de naam van de tagger, e-mail en datum, hebben een tag boodschap, en kunnen gesigneerd en geverifieerd worden met GNU Privacy Guard (GPG). Het wordt over het algemeen aangeraden om annotated tags te maken zodat je deze informatie hebt; maar als je een tijdelijke tag wilt of om een of andere reden de andere informatie niet wilt houden, dan zijn er ook lichtgewicht tags.

## Annotated tags

Een annotated tag in Git maken is eenvoudig. Het makkelijkst is om de `-a` optie te specificeren als je het `tag` commando uitvoert:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

De `-m` specificeert een tag boodschap, die bij de tag opgeslagen wordt. Als je geen boodschap voor een beschreven tag opgeeft, dan opent Git je editor zodat je hem in kunt typen.

Je kunt de tag data zien, samen met de commit die getagged was, door het `git show` commando te gebruiken:

	$ git show v1.4
	tag v1.4
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 14:45:11 2009 -0800

	my version 1.4
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Dat toont de tagger informatie, de datum waarop de commit getagged was, en de beschrijvende boodschap alvorens de commit boodschap te laten zien.

## Ondertekende tags

Je kunt je tags ook ondertekenen met GPG, aangenomen dat je een privésleutel hebt. Het enige dat je moet doen is de `-s` optie gebruiken in plaats van de `-a`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Als je `git show` op die tag uitvoert, dan kun je jouw GPG handtekening eraan vast zien zitten:

	$ git show v1.5
	tag v1.5
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:22:20 2009 -0800

	my signed 1.5 tag
	-----BEGIN PGP SIGNATURE-----
	Version: GnuPG v1.4.8 (Darwin)

	iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
	Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
	=WryJ
	-----END PGP SIGNATURE-----
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Verderop zul je leren hoe je ondertekende tags kunt verifiëren.

## Lightweight tags

Een andere manier om een tag te committen is met behulp van een lightweight tag. Dit is in principe de commit checksum in een bestand opgeslagen; er wordt geen andere informatie bijgehouden. Om een lightweight tag te maken voeg je niet de `-a`, `-s` noch de `-m` optie toe:

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Als je deze keer `git show` op de tag doet, zie je niet de extra tag informatie. Het commando toont alleen de commit:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Tags verifiëren

Om een ondertekende tag te verifiëren, gebruik je `git tag -v [tag-naam]`. Dit commando gebruikt GPG om de handtekening te verifiëren. Je moet de publieke sleutel van degene die getekend heeft wel in je sleutelbos hebben staan om het goed te laten werken:

	$ git tag -v v1.4.2.1
	object 883653babd8ee7ea23e6a5c392bb739348b1eb61
	type commit
	tag v1.4.2.1
	tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

	GIT 1.4.2.1

	Minor fixes since 1.4.2, including git-mv and git-http with alternates.
	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
	gpg:                 aka "[jpeg image of size 1513]"
	Primary key fingerprint: 3565 2A26 2040 E066 C9A7  4A7D C0C6 D9A4 F311 9B9A

Als je de publieke sleutel van degene die getekend heeft niet hebt, dan krijg je in plaats daarvan zoiets:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Later taggen

Je kunt ook commits taggen waar je al voorbij bent. Stel dat je commit historie er zo uitziet:

	$ git log --pretty=oneline
	15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
	a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
	0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
	6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
	0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
	4682c3261057305bdd616e23b64b0857d832627b added a todo file
	166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
	9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
	964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
	8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme

Stel nu dat je vergeten bent het project op v1.2 te taggen, daar waar de "updated rakefile" commit was. Je kunt dit nadien toevoegen. Om die commit te taggen, specificeer je de commit boodschap (of een gedeelte daarvan) aan het einde van het commando:

	$ git tag -a v1.2 9fceb02

Je kunt zien dat je de commit getagged hebt:

	$ git tag
	v0.1
	v1.2
	v1.3
	v1.4
	v1.4-lw
	v1.5

	$ git show v1.2
	tag v1.2
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:32:16 2009 -0800

	version 1.2
	commit 9fceb02d0ae598e95dc970b74767f19372d61af8
	Author: Magnus Chacon <mchacon@gee-mail.com>
	Date:   Sun Apr 27 20:43:35 2008 -0700

	    updated rakefile
	...

## Tags delen

Standaard zal het `git push` commando geen tags naar remote servers versturen. Je zult expliciet tags naar een gedeelde server moeten pushen, nadat je ze gemaakt hebt. Dit proces is hetzelfde als remote branches delen — je kunt `git push origin [tagnaam]` uitvoeren.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Als je veel tags hebt die je ineens wilt pushen, kun je ook de `--tags` optie aan het `git push` commando toevoegen. Dit zal al je tags, die nog niet op de remote server zijn, in één keer er naartoe sturen.

	$ git push origin --tags
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	 * [new tag]         v0.1 -> v0.1
	 * [new tag]         v1.2 -> v1.2
	 * [new tag]         v1.4 -> v1.4
	 * [new tag]         v1.4-lw -> v1.4-lw
	 * [new tag]         v1.5 -> v1.5

Als nu iemand anders van jouw repository clonet of pullt, dan zullen zij al jouw tags ook krijgen.
