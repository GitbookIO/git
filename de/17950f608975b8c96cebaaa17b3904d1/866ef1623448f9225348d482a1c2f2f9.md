# Generiere Deinen öffentlichen SSH-Schlüssel

<!--That being said, many Git servers authenticate using SSH public keys. In order to provide a public key, each user in your system must generate one if they don’t already have one. This process is similar across all operating systems.-->
<!--First, you should check to make sure you don’t already have a key. By default, a user’s SSH keys are stored in that user’s `~/.ssh` directory. You can easily check to see if you have a key already by going to that directory and listing the contents:-->

Darüber hinaus benutzen viele Git-Server öffentliche SSH-Schlüssel zur Authentifizierung. Um einen öffentlichen Schlüssel bereitzustellen muss jeder Benutzer Deines Systems einen solchen Schlüssel generieren, falls sie noch keinen haben. Dieser Prozess ist bei allen Betriebssystemen ähnlich.
Als erstes solltest Du überprüfen, ob Du nicht schon einen Schlüssel hast. Standardmäßig werden die SSH-Schlüssel der Benutzer in ihrem `~/.ssh`-Verzeichnis gespeichert. Du kannst einfach überprüfen, ob Du einen Schlüssel hast, indem Du in das Verzeichnis gehst und den Inhalt auflistest:

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

<!--You’re looking for a pair of files named something and something.pub, where the something is usually `id_dsa` or `id_rsa`. The `.pub` file is your public key, and the other file is your private key. If you don’t have these files (or you don’t even have a `.ssh` directory), you can create them by running a program called `ssh-keygen`, which is provided with the SSH package on Linux/Mac systems and comes with the MSysGit package on Windows:-->

Du suchst nach Paar Dateien namens `irgendetwas` und `irgendetwas.pub`, die Datei `irgendetwas` heißt normalerweise `id_dsa` oder `id_rsa`. Die `.pub`-Datei ist Dein öffentlicher Schlüssel und die andere Datei ist Dein privater Schlüssel. Wenn Du diese Dateien nicht hast (oder gar kein `.ssh`-Verzeichnis hast), kannst Du sie mit dem Ausführen des Programms `ssh-keygen` erzeugen. Das Programm wird mit dem SSH-Paket auf Linux/Mac-Systemen mitgeliefert und kommt mit dem MSysGit-Paket unter Windows:

	$ ssh-keygen
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
	Enter passphrase (empty for no passphrase):
	Enter same passphrase again:
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

<!--First it confirms where you want to save the key (`.ssh/id_rsa`), and then it asks twice for a passphrase, which you can leave empty if you don’t want to type a password when you use the key.-->

Zunächst wird bestätigt, wo Du den Schlüssel speichern möchtest (`.ssh/id_rsa`) und dann wird zweimal nach der Passphrase gefragt, die Du leer lassen kannst, wenn Du kein Passwort bei der Benutzung des Schlüssels eintippen möchtest.

<!--Now, each user that does this has to send their public key to you or whoever is administrating the Git server (assuming you’re using an SSH server setup that requires public keys). All they have to do is copy the contents of the `.pub` file and e-mail it. The public keys look something like this:-->

Jeder Benutzer der dies macht, muss seinen öffentlichen Schlüssel an sich senden oder wer auch immer den Git-Server administriert (angenommen Du benutzt eine SSH-Server Konfiguration, die öffentliche Schlüssel benötigt). Alles was die Benutzer tun müssen ist, den Inhalt der `.pub`-Datei zu kopieren und an Dich per E-Mail zu schicken. Der öffentliche Schlüssel sieht etwa wie folgt aus:

	$ cat ~/.ssh/id_rsa.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

<!--For a more in-depth tutorial on creating an SSH key on multiple operating systems, see the GitHub guide on SSH keys at `http://github.com/guides/providing-your-ssh-key`.-->

Eine detailliertere Anleitung zur Erstellung eines SSH-Schlüssels unter den verschiedenen Betriebssystemen ist der GitHub-Leitfaden für SSH-Schlüssel unter `http://github.com/guides/providing-your-ssh-key`.

<!--# Setting Up the Server-->