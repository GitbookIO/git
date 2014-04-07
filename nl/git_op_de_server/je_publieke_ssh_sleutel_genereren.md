# Je publieke SSH sleutel genereren

Dat gezegd hebbende, zijn er vele Git servers die authenticeren met een publieke SSH sleutel. Om een publieke sleutel te kunnen aanleveren, zal iedere gebruiker in je systeem er een moeten genereren als ze er nog geen hebben. Dit proces is bij alle operating systemen vergelijkbaar. Als eerste moet je controleren of je er niet al een hebt. Standaard staan de SSH sleutels van de gebruikers in hun eigen `~/.ssh` directory. Je kunt makkelijk nagaan of je al een sleutel hebt door naar die directory te gaan en de inhoud te bekijken:

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

Je bent op zoek naar een aantal bestanden genaamd iets en iets.pub, waarbij het iets meestal zoiets is als `id_dsa` of `id_rsa`. Het `.pub` bestand is je publieke sleutel en het andere bestand is je private sleutel. Als je deze bestanden niet hebt (of als je zelfs geen `.ssh` directory hebt), dan kun je ze aanmaken door een applicatie genaamd `ssh-keygen` uit te voeren, deze wordt met het SSH pakket op Linux/Mac systemen meegeleverd en met het MSysGit pakket op Windows:

	$ ssh-keygen
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
	Enter passphrase (empty for no passphrase):
	Enter same passphrase again:
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

Eerst wordt de lokatie waar je de sleutel wordt opgeslagen (`.ssh/id_rsa`) aangegeven, en vervolgens vraagt het tweemaal om een wachtwoord, die je leeg kunt laten als je geen wachtwoord wilt intypen op het moment dat je de sleutel gebruikt.

Iedere gebruiker die dit doet, moet zijn sleutel sturen naar jou of degene die de Git server beheert (aangenomen dat je een SSH server gebruikt die publieke sleutels vereist). Het enige dat ze hoeven doen is de inhoud van het `.pub` bestand kopiëren en e-mailen. De publieke sleutel ziet er ongeveer zo uit:

	$ cat ~/.ssh/id_rsa.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

Voor een uitgebreidere tutorial over het aanmaken van een SSH sleutel op meerdere operating systemen, verwijzen we je naar de GitHub handleiding over SSH sleutels op `http://github.com/guides/providing-your-ssh-key`.
