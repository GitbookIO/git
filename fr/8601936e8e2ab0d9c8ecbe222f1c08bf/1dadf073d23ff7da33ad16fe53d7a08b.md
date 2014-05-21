# Installation de Git

Commençons donc à utiliser Git.
La première chose à faire est de l'installer.
Vous pouvez l'obtenir par de nombreuses manières ;
les deux principales sont de l'installer à partir des sources ou d'installer un paquet existant sur votre plate-forme.

## Installation depuis les sources

Si vous le pouvez, il est généralement conseillé d'installer Git à partir des sources, car vous obtiendrez la version la plus récente.
Chaque nouvelle version de Git tend à inclure des améliorations utiles de l'interface utilisateur, donc récupérer la toute dernière version est souvent la meilleure option si vous savez compiler des logiciels à partir des sources.
De nombreuses distributions de Linux contiennent souvent des versions très anciennes de logiciels, donc à moins que vous ne travailliez sur une distribution
très récente ou que vous n'utilisiez des backports, une installation à partir des sources peut être le meilleur choix.

Pour installer Git, vous avez besoin des bibliothèques suivantes : curl, zlib, openssl, expat, libiconv.
Par exemple, si vous avez un système d'exploitation qui utilise yum (tel que Fedora) ou apt-get (tel qu'un système basé sur Debian), vous pouvez utiliser l'une des commandes suivantes pour installer les dépendances :

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev libssl-dev

Quand vous avez toutes les dépendances nécessaires, vous pouvez poursuivre et télécharger la dernière version de Git depuis le site :

	http://git-scm.com/download

Puis, compiler et installer :

	$ tar -zxf git-1.7.2.2.tar.gz
	$ cd git-1.7.2.2
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Après ceci, vous pouvez obtenir Git par Git lui-même pour les mises à jour :

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Installation sur Linux

Si vous souhaitez installer Git sur Linux via un installateur d'application, vous pouvez généralement le faire via le système de gestion de paquets de base fourni avec votre distribution.
Si vous êtes sur Fedora, vous pouvez utiliser yum :

	$ yum install git-core

Si vous êtes sur un système basé sur Debian, tel qu'Ubuntu, essayez apt-get :

	$ apt-get install git

## Installation sur Mac

Il y a deux moyens simples d'installer Git sur Mac.
Le plus simple et d'utiliser l'installateur graphique de Git que vous pouvez télécharger depuis les pages Google Code (voir figure 1-7) :

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Figure 1-7. Installateur OS X de Git.

L'autre méthode consiste à installer Git par les MacPorts (`http://www.macports.org`).
Si vous avez installé MacPorts, installez Git par :

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Vous n'avez pas à ajouter tous les extras, mais vous souhaiterez sûrement inclure +svn si vous êtes amené à utiliser Git avec des dépôts Subversion (voir chapitre 8).

## Installation sur Windows

Installer Git sur Windows est très facile.
Le projet msysGit fournit une des procédures d'installation les plus simples.
Téléchargez simplement le fichier exe d'installateur depuis la page GitHub, et lancez-le :

	http://msysgit.github.com/

Après son installation, vous avez à la fois la version en ligne de commande (avec un client SSH utile pour la suite) et l'interface graphique standard.

Note sur l'usage sous Windows :
vous devriez utiliser Git avec le shell `bash` fourni par msysGit (style Unix), car il permet d'utiliser les lignes de commandes complexes données dans ce livre.
Si vous devez, pour une raison quelconque, utiliser l'interpreteur de commande natif de Windows (console système), vous devez utiliser des guillemets au lieu des apostrophes pour délimiter les paramètres avec des espaces.
Vous devez aussi délimiter avec ces guillemets les paramètres finissant avec l'accent circonflexe (^) s'ils sont en fin de ligne, car c'est un symbole de continuation de Windows.
