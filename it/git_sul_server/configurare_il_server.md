# Configurare il Server

Ora vediamo come configurare un accesso SSH lato server. In questo esempio, utilizzeremo il metodo `authorized_keys` per autenticare gli utenti. Supponiamo anche che stia utilizzando una distribuzione standard di Linux come Ubuntu. Prima, crea un utente 'git' e una directory `.ssh` per questo utente.

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

Poi, devi aggiungere alcune chiavi SSH pubbliche degli sviluppatori nel file `authorized_keys` di questo utente. Diciamo che hai ricevuto un po' di chiavi via email e le hai salvate in file temporanei. Ricorda che le chiavi pubbliche assomigliano a qualcosa tipo:

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

Devi solo aggiungerle al tuo file `authorized_keys`:

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Ora, puoi impostare un repository vuoto avviando `git init` con l'opzione `--bare`, che inizializza il repository senza la directory di lavoro:

	$ cd /opt/git
	$ mkdir project.git
	$ cd project.git
	$ git --bare init

Poi, John, Josie o Jessica possono inviare la prima versione del loro progetto nel repository aggiungendolo come ramo remoto ed inviandolo su di un ramo. Nota che qualcuno deve accedere via shell alla macchina e creare un repository base ogni volta che si vuole aggiungere un progetto. Usiamo il nome `gitserver` per il server dove hai impostato il tuo utente 'git' ed il repository. Se lo stai usando nella rete interna e hai impostato un DNS con il punto `gitserver` per puntare a questo server, allora puoi usare il comando:

	# sul computer di Johns
	$ cd myproject
	$ git init
	$ git add .
	$ git commit -m 'initial commit'
	$ git remote add origin git@gitserver:/opt/git/project.git
	$ git push origin master

A questo punto, gli altri possono clonare ed inviare dei cambiamenti molto facilmente:

	$ git clone git@gitserver:/opt/git/project.git
	$ cd project
	$ vim README
	$ git commit -am 'fix for the README file'
	$ git push origin master

Con questo metodo puoi avere velocemente un server Git con permessi di lettura e scrittura che serve molti sviluppatori.

Una precauzione extra, puoi restringere facilmente l'utente 'git' alle sole attività Git con uno strumento shell di limitazione chiamato `git-shell` che è fornito con Git. Se lo imposti come login shell per il tuo utente 'git', allora l'utente 'git' non avrà un accesso shell normale al tuo server. Per fare questo, specifica `git-shell` invece di bash o csh per il login shell del tuo utente. Per farlo, devi modificare il tuo file `/etc/passwd`:

	$ sudo vim /etc/passwd

Alla fine dovresti trovare una linea simile a questa:

	git:x:1000:1000::/home/git:/bin/sh

Modifica `/bin/sh` in `/usr/bin/git-shell` (o lancia `which git-shell` per vedere dove è installato). La linea deve assomigliare a:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

Ora, l'utente 'git' può solamente usare la connessione SSH per inviare e scaricare i repository Git e non può accedere alla shell della macchina. Se provi vedrai il rifiuto dell'autenticazione:

	$ ssh git@gitserver
	fatal: What do you think I am? A shell?
	Connection to gitserver closed.
