# Installation de Git sur un serveur

Pour réaliser l'installation initiale d'un serveur Git, il faut exporter un dépôt existant dans un nouveau dépôt nu — un dépôt qui ne contient pas de copie de répertoire de travail.
C'est généralement simple à faire.
Pour cloner votre dépôt en créant un nouveau dépôt nu, lancez la commande clone avec l'option `--bare`.
Par convention, les répertoires de dépôt nu finissent en `.git`, de cette manière :

	$ git clone --bare mon_project mon_project.git
	Initialized empty Git repository in /opt/projets/mon_project.git/

La sortie de cette commande est un peu déroutante.
Comme `clone` est un `git init` de base, suivi d'un `git fetch`, nous voyons les messages du `git init` qui crée un répertoire vide.
Le transfert effectif d'objets ne fournit aucune sortie, mais il a tout de même lieu.
Vous devriez maintenant avoir une copie des données de Git dans votre répertoire `mon_project.git`.

C'est grossièrement équivalent à :

	$ cp -Rf mon_project/.git mon_project.git

Il y a quelques légères différences dans le fichier de configuration mais pour l'utilisation envisagée, c'est très proche.
La commande extrait le répertoire Git sans répertoire de travail et crée un répertoire spécifique pour l'accueillir.

## Copie du dépôt nu sur un serveur

À présent que vous avez une copie nue de votre dépôt, il ne reste plus qu'à la placer sur un serveur et à régler les protocoles.
Supposons que vous avez mis en place un serveur nommé `git.exemple.com` auquel vous avez accès par SSH et que vous souhaitez stocker vos dépôts Git dans le répertoire `/opt/git`.
Vous pouvez mettre en place votre dépôt en copiant le dépôt nu :

	$ scp -r mon_projet.git utilisateur@git.exemple.com:/opt/git

À partir de maintenant, tous les autres utilisateurs disposant d'un accès SSH au serveur et ayant un accès en lecture seule au répertoire `/opt/git` peuvent cloner votre dépôt en lançant la commande :

	$ git clone utilisateur@git.exemple.com:/opt/git/mon_projet.git

Si un utilisateur se connecte par SSH au serveur et a accès en lecture au répertoire `/opt/git/mon_projet.git`, il aura automatiquement accès pour tirer.
Git ajoutera automatiquement les droits de groupe en écriture à un dépôt si vous lancez la commande `git init` avec l'option `--shared`.

	$ ssh utilisateur@git.exemple.com
	$ cd /opt/git/mon_projet.git
	$ git init --bare --shared

Vous voyez comme il est simple de prendre un dépôt Git, créer une version nue et la placer sur un serveur auquel vous et vos collaborateurs avez accès en SSH.
Vous voilà prêts à collaborer sur le même projet.

Il faut noter que c'est littéralement tout ce dont vous avez besoin pour démarrer un serveur Git utile auquel plusieurs personnes ont accès — ajoutez des comptes SSH sur un serveur, et collez un dépôt nu quelque part où tous les utilisateurs ont accès en lecture et écriture.
Vous êtes prêts à travailler, vous n'avez besoin de rien d'autre.

Dans les chapitres à venir, nous traiterons de mises en place plus sophistiquées.
Ces sujets incluront l'élimination du besoin de créer un compte système pour chaque utilisateur, l'accès public aux dépôts, la mise en place d'interfaces utilisateur web, l'utilisation de l'outil Gitosis, etc.
Néanmoins, gardez à l'esprit que pour collaborer avec quelques personnes sur un projet privé, tout ce qu'il faut, c'est un serveur SSH et un dépôt nu.

## Petites installations

Si vous travaillez dans un petit groupe ou si vous n'êtes qu'en phase d'essai de Git au sein de votre société avec peu de développeurs, les choses peuvent rester simples.
Un des aspects les plus compliqués de la mise en place d'un serveur Git est la gestion des utilisateurs.
Si vous souhaitez que certains dépôts ne soient accessibles à certains utilisateurs qu'en lecture seule et en lecture/écriture pour d'autres, la gestion des accès et des permissions peut devenir difficile à régler.


### Accès SSH

Si vous disposez déjà d'un serveur auquel tous vos développeurs ont un accès SSH, il est généralement plus facile d'y mettre en place votre premier dépôt car vous n'aurez quasiment aucun réglage supplémentaire à faire (comme nous l'avons expliqué dans le chapitre précédent).
Si vous souhaitez des permissions d'accès plus complexes, vous pouvez les mettre en place par le jeu des permissions standards sur le système de fichiers du système d'exploitation de votre serveur.

Si vous souhaitez placer vos dépôts sur un serveur qui ne dispose pas déjà de comptes pour chacun des membres de votre équipe qui aurait accès en écriture, alors vous devrez mettre en place un accès SSH pour eux.
En supposant que pour vos dépôts, vous disposiez déjà d'un serveur SSH installé et sur lequel vous avez accès.

Il y a quelques moyens de donner un accès à tout le monde dans l'équipe.
Le premier est de créer des comptes pour tout le monde, ce qui est logique mais peut s'avérer lourd.
Vous ne souhaiteriez sûrement pas lancer `adduser` et entrer un mot de passe temporaire pour chaque utilisateur.

Une seconde méthode consiste à créer un seul utilisateur Git sur la machine, demander à chaque développeur nécessitant un accès en écriture de vous envoyer une clé publique SSH et d'ajouter la-dite clé au fichier `~/.ssh/authorized_keys` de votre utilisateur Git.
À partir de là, tout le monde sera capable d'accéder à la machine via l'utilisateur Git.
Cela n'affecte en rien les données de *commit* — les informations de l'utilisateur SSH par lequel on se connecte n'affectent pas les données de *commit* enregistrées.

Une dernière méthode consiste à faire une authentification SSH auprès d'un serveur LDAP ou tout autre système d'authentification centralisé que vous utiliseriez déjà.
Tant que chaque utilisateur peut accéder à un shell sur la machine, n'importe quel schéma d'authentification SSH devrait fonctionner.
