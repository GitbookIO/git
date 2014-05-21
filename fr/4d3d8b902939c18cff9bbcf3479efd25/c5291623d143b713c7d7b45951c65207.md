# Protocoles

Git peut utiliser quatre protocoles réseau majeurs pour transporter des données : local, *Secure Shell* (SSH), Git et HTTP.
Nous allons voir leur nature et dans quelles circonstances ils peuvent (ou ne peuvent pas) être utilisés.

Il est à noter que mis à part HTTP, tous les protocoles nécessitent l'installation de Git sur le serveur.

## Protocole local

Le protocole de base est le protocole _local_ pour lequel le dépôt distant est un autre répertoire dans le système de fichiers.
Il est souvent utilisé si tous les membres de l'équipe ont accès à un répertoire partagé via NFS par exemple ou dans le cas moins probable où tous les développeurs travaillent sur le même ordinateur.
Ce dernier cas n'est pas optimum car tous les dépôts seraient hébergés de fait sur le même ordinateur, rendant ainsi toute défaillance catastrophique.

Si vous disposez d'un système de fichiers partagé, vous pouvez cloner, pousser et tirer avec un dépôt local.
Pour cloner un dépôt ou pour l'utiliser comme dépôt distant d'un projet existant, utilisez le chemin vers le dépôt comme URL.
Par exemple, pour cloner un dépôt local, vous pouvez lancer ceci :

	$ git clone /opt/git/projet.git

Ou bien cela :

	$ git clone file:///opt/git/projet.git

Git opère légèrement différemment si vous spécifiez explicitement le protocole `file://` au début de l'URL.
Si vous spécifiez simplement le chemin, Git tente d'utiliser des liens durs ou une copie des fichiers nécessaires.
Si vous spécifiez le protocole `file://`, Git lance un processus d'accès au travers du réseau, ce qui est généralement moins efficace.
La raison d'utiliser spécifiquement le préfixe `file://` est la volonté d'obtenir une copie propre du dépôt, sans aucune référence ou aucun objet supplémentaire qui pourraient résulter d'un import depuis un autre système de gestion de version ou d'une action similaire (voir chapitre 9 pour les tâches de maintenance).
Nous utiliserons les chemins normaux par la suite car c'est la méthode la plus efficace.

Pour ajouter un dépôt local à un projet Git existant, lancez ceci :

	$ git remote add proj_local /opt/git/projet.git

Ensuite, vous pouvez pousser vers et tirer depuis ce dépôt distant de la même manière que vous le feriez pour un dépôt accessible sur le réseau.

### Avantages

Les avantages des dépôts accessibles sur le système de fichiers sont qu'ils sont simples et qu'ils utilisent les permissions du système de fichiers.
Si vous avez déjà un montage partagé auquel toute votre équipe a accès, déployer un dépôt est extrêmement facile.
Vous placez la copie du dépôt nu à un endroit accessible de tous et positionnez correctement les droits de lecture/écriture de la même manière que pour tout autre partage.
Nous aborderons la méthode pour exporter une copie de dépôt nu à cette fin dans la section suivante « Déployer Git sur un serveur ».

C'est un choix satisfaisant pour partager rapidement le travail.
Si vous et votre coéquipier travaillez sur le même projet et qu'il souhaite partager son travail, lancer une commande telle que `git pull /home/john/project` est certainement plus simple que de passer par un serveur intermédiaire.

### Inconvénients

Les inconvénients de cette méthode sont qu'il est généralement plus difficile de rendre disponible un partage réseau depuis de nombreux endroits que de simplement gérer des accès réseau.
Si vous souhaitez pousser depuis votre portable à la maison, vous devez monter le partage distant, ce qui peut s'avérer plus difficile et plus lent que d'y accéder directement via un protocole réseau.

Il est aussi à mentionner que ce n'est pas nécessairement l'option la plus rapide à l'utilisation si un partage réseau est utilisé.
Un dépôt local n'est rapide que si l'accès aux fichiers est rapide.
Un dépôt accessible sur un montage NFS est souvent plus lent qu'un dépôt accessible via SSH sur le même serveur qui ferait tourner Git avec un accès aux disques locaux.

## Protocole SSH

Le protocole SSH est probablement le protocole de transport de Git le plus utilisé.
Cela est dû au fait que l'accès SSH est déjà en place à de nombreux endroits et que si ce n'est pas le cas, cela reste très facile à faire.
Cela est aussi dû au fait que SSH est le seul protocole permettant facilement de lire et d'écrire à distance.
Les deux autres protocoles réseau (HTTP et Git) sont généralement en lecture seule et s'ils peuvent être utiles pour la publication, le protocole SSH est nécessaire pour les mises à jour.
SSH est un protocole authentifié ; et comme il est très répandu, il est généralement facile à mettre en œuvre et à utiliser.

Pour cloner un dépôt Git à travers SSH, spécifiez le préfixe `ssh://` dans l'URL comme ceci :

	$ git clone ssh://utilisateur@serveur/projet.git

ou vous pouvez utiliser la syntaxe scp habituelle avec le protocole SSH :

	$ git clone utilisateur@serveur:projet.git

Vous pouvez aussi ne pas spécifier de nom d'utilisateur et Git utilisera par défaut le nom de login.

### Avantages

Les avantages liés à l'utilisation de SSH sont nombreux.
Primo, vous ne pourrez pas faire autrement si vous souhaitez gérer un accès authentifié en écriture à votre dépôt à travers le réseau.
Secundo, SSH est relativement simple à mettre en place, les *daemons* SSH sont facilement disponibles, les administrateurs réseaux sont habitués à les gérer et de nombreuses distributions de systèmes d'exploitation en disposent ou proposent des outils pour les gérer.
Ensuite, l'accès distant à travers SSH est sécurisé, toutes les données sont chiffrées et authentifiées.
Enfin, comme les protocoles Git et local, SSH est efficace et permet de comprimer autant que possible les données avant de les transférer.

### Inconvénients

Le point négatif avec SSH est qu'il est impossible de proposer un accès anonyme au dépôt.
Les accès sont régis par les permissions SSH, même pour un accès en lecture seule, ce qui s'oppose à une optique open source.
Si vous souhaitez utiliser Git dans un environnement d'entreprise, SSH peut bien être le seul protocole nécessaire.
Si vous souhaitez proposer de l'accès anonyme en lecture seule à vos projets, vous aurez besoin de SSH pour vous permettre de pousser mais un autre protocole sera nécessaire pour permettre à d'autres de tirer.

## Protocole Git

Vient ensuite le protocole Git. Celui-ci est géré par un *daemon* spécial livré avec Git. Ce *daemon* (démon, processus en arrière plan) écoute sur un port dédié (9418) et propose un service similaire au protocole SSH, mais sans aucune sécurisation.
Pour qu'un dépôt soit publié via le protocole Git, le fichier `git-daemon-export-ok` doit exister mais mise à part cette condition sans laquelle le *daemon* refuse de publier un projet, il n'y a aucune sécurité.
Soit le dépôt Git est disponible sans restriction en lecture, soit il n'est pas publié.
Cela signifie qu'il ne permet pas de pousser des modifications.
Vous pouvez activer la capacité à pousser mais étant donné l'absence d'authentification, n'importe qui sur Internet ayant trouvé l'URL du projet peut pousser sur le dépôt.
Autant dire que ce mode est rarement recherché.

### Avantages

Le protocole Git est le protocole le plus rapide.
Si vous devez servir un gros trafic pour un projet public ou un très gros projet qui ne nécessite pas d'authentification en lecture, il est très probable que vous devriez installer un *daemon* Git.
Il utilise le même mécanisme de transfert de données que SSH, la surcharge du chiffrement et de l'authentification en moins.

### Inconvénients

Le défaut du protocole Git est le manque d'authentification.
N'utiliser que le protocole Git pour accéder à un projet n'est généralement pas suffisant.
Il faut le coupler avec un accès SSH pour quelques développeurs qui auront le droit de pousser (écrire) et le garder pour un accès `git://` en lecture seule.
C'est aussi le protocole le plus difficile à mettre en place.
Il doit être géré par son propre *daemon* qui est spécifique.
Nous traiterons de cette installation dans la section « Gitosis » de ce chapitre — elle nécessite la configuration d'un *daemon* `xinetd` ou apparenté, ce qui est loin d'être simple.
Il nécessite aussi un accès à travers le pare-feu au port 9418 qui n'est pas un port ouvert en standard dans les pare-feux professionnels.
Derrière les gros pare-feux professionnels, ce port obscur est tout simplement bloqué.

## Protocole HTTP/S

Enfin, il reste le protocole HTTP.
La beauté d'HTTP ou HTTPS tient dans la simplicité à le mettre en place.
Tout ce qu'il y a à faire, c'est de simplement copier un dépôt Git nu sous votre racine de document HTTP et de paramétrer un crochet `post-update` et c'est prêt (voir chapitre 7 pour les détails sur les crochets de Git).
À partir de ceci, toute personne possédant un accès au serveur web sur lequel vous avez copié votre dépôt peut le cloner.
Pour autoriser un accès en lecture à votre dépôt sur HTTP, faites ceci :

	$ cd /var/www/htdocs/
	$ git clone --bare /chemin/vers/git_projet projetgit.git
	$ cd projetgit.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

C'est tout.
Le crochet `post-update` qui est livré avec Git par défaut lance la commande appropriée (`git update-server-info`) pour permettre un fonctionnement correct du clonage et de la récupération par HTTP.
Cette commande est lancée lorsque vous poussez vers ce dépôt par SSH ; ainsi, les autres personnes peuvent cloner via la commande :

	$ git clone http://exemple.com/projetgit.git

Dans ce cas particulier, nous utilisons le chemin `/var/www/htdocs` qui est commun pour les installations d'Apache, mais vous pouvez utiliser n'importe quel serveur web de pages statiques — il suffit de placer le dépôt nu dans le chemin d'accès.
Les données Git sont servies comme des simples fichiers statiques (voir chapitre 9 pour la manière détaillée dont ils sont servis).

Il est possible de faire pousser Git à travers HTTP, bien que cette technique ne soit pas utilisée et nécessite de gérer les exigences complexes de WebDAV.
Comme elle est rarement utilisée, nous ne la détaillerons pas dans ce livre.
Si vous êtes tout de même intéressé par l'utilisation des protocoles de push-HTTP, vous pouvez vous référer à `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`.
Un des intérêts à permettre de pousser par HTTP est que vous pouvez utiliser n'importe quel serveur WebDAV, sans liaison avec Git.
Il est donc possible d'utiliser cette fonctionnalité si votre fournisseur d'hébergement web supporte WebDAV pour la mise à jour de vos sites.

### Avantages

L'avantage d'utiliser le protocole HTTP est qu'il est très simple à mettre en œuvre.
Donner un accès public en lecture à votre dépôt Git ne nécessite que quelques commandes.
Cela ne prend que quelques minutes.
De plus, le protocole HTTP n'est pas très demandeur en ressources système.
Les besoins étant limités à servir des données statiques, un serveur Apache standard peut servir des milliers de fichiers par seconde en moyenne et il est très difficile de surcharger même un ordinateur moyen.

Vous pouvez aussi publier votre dépôt par HTTPS, ce qui signifie que vous pouvez chiffrer le contenu transféré.
Vous pouvez même obliger les clients à utiliser des certificats SSL spécifiques.
Généralement, si vous souhaitez pousser jusque là, il est préférable de passer par des clés SSH publiques.
Cependant, certains cas nécessitent l'utilisation de certificats SSL signés ou d'autres méthodes d'authentification basées sur HTTP pour les accès en lecture seule sur HTTPS.

Un autre avantage indéniable de HTTP est que c'est un protocole si commun que les pare-feux d'entreprise sont souvent paramétrés pour le laisser passer.

### Inconvénients

L'inconvénient majeur de servir votre dépôt sur HTTP est que c'est relativement inefficace pour le client.
Cela prend généralement beaucoup plus longtemps de cloner ou tirer depuis le dépôt et il en résulte un plus grand trafic réseau et de plus gros volumes de transfert que pour les autres protocoles.
Le protocole HTTP est souvent appelé le protocole _idiot_ parce qu'il n'a pas l'intelligence de sélectionner seulement les données nécessaires à transférer du fait du manque de traitement dynamique côté serveur.
Pour plus d'information sur les différences d'efficacité entre le protocole HTTP et les autres, référez-vous au chapitre 9.
