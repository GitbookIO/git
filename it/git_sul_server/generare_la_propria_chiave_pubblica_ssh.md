# Generare la Propria Chiave Pubblica SSH

Come detto precedentemente, molti server Git usano l'autenticazione con la chiave pubblica SSH. Per poter avere una chiave pubblica, ogni utente del tuo sistema deve generarne una se già non la possiede. Questo processo è simile per tutti i sistemi operativi.
Primo, devi controllare di non avere già una chiave. Di base, le chiavi SSH degli utenti sono salvate nella directory `~/.ssh`. Puoi facilmente controllare spostandoti nella directory e controllandone il contenuto:

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

Devi cercare una coppia di chiavi dal nome simile a qualcosa e qualcosa.pub, dove quel qualcosa in genere è `id_dsa` o `id_rsa`. Il file `.pub` è la tua chiave pubblica e l'altro file è la chiave privata. Se non hai questi file (o non hai una directory `.ssh`), puoi crearle avviando un programma chiamato `ssh-keygen`, che è fornito assieme al pacchetto SSH sui sistemi Linux/Mac ed è fornito dal pacchetto MSysGit su Windows:

	$ ssh-keygen 
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa): 
	Enter passphrase (empty for no passphrase): 
	Enter same passphrase again: 
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

Prima chiede la conferma dove vuoi salvare la chiave (`.ssh/id_rsa`) e poi chiede due volte la passphrase, che puoi lasciare vuota se non vuoi inserire una password quando usi la chiave.

Ora, ogni utente che ha fatto questo deve inviare la propria chiave pubblica a te o a chi amministra il server Git (supponiamo che tu stia usando un server SSH impostato in modo da richiedere le chiavi pubbliche). Tutto quello che devono fare è copiare il contenuto del file `.pub` ed inviarlo via e-mail. La chiave pubblica è qualcosa di simile a questo:

	$ cat ~/.ssh/id_rsa.pub 
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

Per una guida più specifica sulla creazione di una chiave SSH su sistemi operativi multipli, vedi la guida GitHub sulle chiavi SSH `http://github.com/guides/providing-your-ssh-key`.
