# Nastavení serveru

Podívejme se nyní na nastavení SSH přístupu na straně serveru. V tomto příkladu použijeme k ověření uživatelů metodu `authorized_keys`. Předpokládáme také, že pracujete se standardní linuxovou distribucí, jako je např. Ubuntu. Nejprve vytvoříte uživatele 'git' a adresář `.ssh` pro tohoto uživatele.

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

V dalším kroku musíte vložit veřejné SSH klíče od svých vývojářů do souboru `authorized_keys` pro tohoto uživatele. Předpokládejme, že jste e-mailem dostali několik klíčů a uložili jste je do dočasných souborů. Veřejné klíče vypadají opět nějak takto:

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

Vy nyní klíče vložíte do souboru `authorized_keys`:

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Nyní pro ně můžete nastavit prázdný repozitář. Spusťte příkaz `git init` s parametrem `--bare`, který inicializuje repozitář bez pracovního adresáře:

	$ cd /opt/git
	$ mkdir project.git
	$ cd project.git
	$ git --bare init

John, Josie a Jessica pak mohou do tohoto repozitáře odeslat první verzi svého projektu: přidají si ho jako vzdálený repozitář a odešlou do něj svou větev. Nezapomeňte, že pokaždé, když chcete přidat projekt, se musí k počítači někdo přihlásit a vytvořit holý repozitář. Pro server, na kterém jste nastavili uživatele 'git' a repozitář, můžeme použít název hostitele `gitserver`. Pokud server provozujete interně a nastavíte DNS pro `gitserver` tak, aby ukazovalo na tento server, můžete používat i takovéto příkazy:

	# on Johns computer
	$ cd myproject
	$ git init
	$ git add .
	$ git commit -m 'initial commit'
	$ git remote add origin git@gitserver:/opt/git/project.git
	$ git push origin master

Ostatní nyní mohou velmi snadno repozitář naklonovat i do něj odesílat změny:

	$ git clone git@gitserver:/opt/git/project.git
	$ cd project
	$ vim README
	$ git commit -am 'fix for the README file'
	$ git push origin master

Tímto způsobem lze rychle vytvořit a spustit server Git ke čtení i zápisu pro menší počet vývojářů.

Pro větší bezpečnost máte možnost využít nástroj `git-shell`, který je distribuován se systémem Git. Pomocí něj lze snadno nastavit, aby uživatel 'git' prováděl pouze operace systému Git. Pokud ho nastavíte jako přihlašovací shell uživatele 'git', pak nebude mít uživatel 'git' normální shellový přístup k vašemu serveru. Chcete-li nástroj použít, zadejte pro přihlašovací shell vašeho uživatele `git-shell` místo bash nebo csh. V takovém případě pravděpodobně budete muset upravit soubor `/etc/passwd`:

	$ sudo vim /etc/passwd

Dole byste měli najít řádek, který vypadá asi takto:

	git:x:1000:1000::/home/git:/bin/sh

Změňte `/bin/sh` na `/usr/bin/git-shell` (nebo spusťte příkaz `which git-shell`, abyste viděli, kde je nainstalován). Řádek by měl vypadat takto:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

Uživatel 'git' nyní může používat SSH připojení k odesílání a stahování repozitářů Git, ale nemůže se přihlásit k počítači. Pokud to zkusíte, zobrazí se zamítnutí přihlášení:

	$ ssh git@gitserver
	fatal: What do you think I am? A shell?
	Connection to gitserver closed.
