# De Server Opzetten

Laten we het opzetten van SSH toegang aan de server kant eens doorlopen. In dit voorbeeld zul je de `authorized_keys` methode gebruiken om je gebruikers te authenticeren. We gaan er ook vanuit dat je een standaard Linux distributie gebruikt zoals Ubuntu. Als eerste maak je een 'git' gebruiker aan en een `.ssh` directory voor die gebruiker.

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

Vervolgens moet je een aantal publieke SSH sleutels van ontwikkelaars aan het `authorized_keys` bestand toevoegen voor die gebruiker. Laten we aannemen dat je een aantal sleutels per e-mail ontvangen hebt en ze hebt opgeslagen in tijdelijke bestanden. Nogmaals, de sleutels zien er ongeveer zo uit:

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

Je voegt ze eenvoudigweg toe aan je `authorized_keys` bestand:

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Nu kun je een lege repository voor ze instellen door `git init` uit te voeren met de `--bare` optie, wat de repository initialiseert zonder een werkmap:

	$ cd /opt/git
	$ mkdir project.git
	$ cd project.git
	$ git --bare init

Daarna kunnen John, Josie of Jessica de eerste versie van hun project in de repository pushen door het als een remote toe te voegen en een branch te pushen. Merk op dat iemand met een shell op de machine zal moeten inloggen en een kale repository moet creëren voor elke keer dat je een project wilt toevoegen. Laten we `gitserver` als hostnaam gebruiken voor de server waar je de 'git' gebruiker en repository hebt aangemaakt. Als je het binnenshuis draait, en je de DNS instelt zodat `gitserver` naar die server wijst, dan kun je de commando's vrijwel ongewijzigd gebruiken:

	# op Johns computer
	$ cd myproject
	$ git init
	$ git add .
	$ git commit -m 'initial commit'
	$ git remote add origin git@gitserver:/opt/git/project.git
	$ git push origin master

Vanaf dat moment kunnen de anderen het clonen en wijzigingen even gemakkelijk terug pushen:

	$ git clone git@gitserver:/opt/git/project.git
	$ vim README
	$ git commit -am 'fix for the README file'
	$ git push origin master

Op deze manier kun je snel een lees/schrijf Git server draaiend krijgen voor een handjevol ontwikkelaars.

Als een extra voorzorgsmaatregel kun je de 'git' gebruiker makkelijk beperken tot het doen van alleen Git activiteiten, met een gelimiteerde shell tool genaamd `git-shell` die bij Git geleverd wordt.
Als je dit als login shell voor je 'git' gebruiker instelt, dan kan de 'git' gebruiker geen normale shell toegang hebben op je server. Specificeer `git-shell` in plaats van bash of csh voor je gebruikers login shell om dit te gebruiken. Om dit te doen zul je waarschijnlijk het `/etc/passwd` bestand aan moeten passen:

	$ sudo vim /etc/passwd

Aan het einde zou je een regel moeten vinden die er ongeveer zo uit ziet:

	git:x:1000:1000::/home/git:/bin/sh

Verander `/bin/sh` in `/usr/bin/git-shell` (of voer `which git-shell` uit om te zien waar het geïnstalleerd is). De regel moet er ongeveer zo uit zien:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

Nu kan de 'git' gebruiker de SSH connectie alleen gebruiken om Git repositories te pushen en te pullen, en niet om in te loggen in de machine. Als je het probeert zul je een login weigering zoals deze zien:

	$ ssh git@gitserver
	fatal: What do you think I am? A shell?
	Connection to gitserver closed.
