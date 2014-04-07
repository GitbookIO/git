# Mise en place du serveur

Parcourons les étapes de la mise en place d'un accès SSH côté serveur.
Dans cet exemple, vous utiliserez la méthode des `authorized_keys` pour authentifier vos utilisateurs.
Nous supposerons également que vous utilisez une distribution Linux standard telle qu'Ubuntu.
Premièrement, créez un utilisateur 'git' et un répertoire `.ssh` pour cet utilisateur.

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

Ensuite, vous devez ajouter la clé publique d'un développeur au fichier `authorized_keys` de l'utilisateur Git.
Supposons que vous avez reçu quelques clés par e-mail et les avez sauvées dans des fichiers temporaires.
Pour rappel, une clé publique ressemble à ceci :

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

Il suffit de les ajouter au fichier `authorized_keys` :

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys


Maintenant, vous pouvez créer un dépôt vide nu en lançant la commande `git init` avec l'option `--bare`, ce qui initialise un dépôt sans répertoire de travail :

	$ cd /opt/git
	$ mkdir projet.git
	$ cd projet.git
	$ git --bare init

Alors, John, Josie ou Jessica peuvent pousser la première version de leur projet vers ce dépôt en l'ajoutant en tant que dépôt distant et en lui poussant une branche.
Notons que quelqu'un doit se connecter au serveur et créer un dépôt nu pour chaque ajout de projet.
Supposons que le nom du serveur soit `gitserveur`.
Si vous l'hébergez en interne et avez réglé le DNS pour faire pointer `gitserver` sur ce serveur, alors vous pouvez utiliser les commandes suivantes telles quelles :

	# Sur l'ordinateur de John
	$ cd monproject
	$ git init
	$ git add .
	$ git commit -m 'premiere validation'
	$ git remote add origin git@gitserveur:/opt/git/projet.git
	$ git push origin master

À présent, les autres utilisateurs peuvent cloner le dépôt et y pousser leurs modifications aussi simplement :

	$ git clone git@gitserveur:/opt/git/projet.git
	$ cd projet
	$ vim LISEZMOI
	$ git commit -am 'correction fichier LISEZMOI'
	$ git push origin master

De cette manière, vous pouvez rapidement mettre en place un serveur Git en lecture/écriture pour une poignée de développeurs.

En précaution supplémentaire, vous pouvez simplement restreindre l'utilisateur 'git' à des actions Git avec un shell limité appelé `git-shell` qui est fourni avec Git.
Si vous positionnez ce shell comme shell de login de l'utilisateur 'git', l'utilisateur 'git' ne peut pas avoir de shell normal sur ce serveur.
Pour utiliser cette fonction, spécifiez `git-shell` en lieu et place de bash ou csh pour shell de l'utilisateur.
Cela se réalise généralement en éditant le fichier `/etc/passwd` :

	$ sudo vim /etc/passwd

Tout au bas, vous devriez trouver une ligne qui ressemble à ceci :

	git:x:1000:1000::/home/git:/bin/sh

Modifiez `/bin/sh` en `/usr/bin/git-shell` (ou le résultat de la commande `which git-shell` qui indique où il est installé).
La ligne devrait maintenant ressembler à ceci :

	git:x:1000:1000::/home/git:/usr/bin/git-shell

À présent, l'utilisateur 'git' ne peut plus utiliser la connexion SSH que pour pousser et tirer sur des dépôts Git, il ne peut plus ouvrir un shell.
Si vous essayez, vous verrez un rejet de login :

	$ ssh git@gitserveur
	fatal: What do you think I am? A shell?
	Connection to gitserveur closed.
