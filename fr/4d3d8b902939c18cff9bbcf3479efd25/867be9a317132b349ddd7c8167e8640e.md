# Git hébergé

Si vous ne vous ne voulez pas vous investir dans la mise en place de votre propre serveur Git, il reste quelques options pour héberger vos projets Git sur un site externe dédié à l'hébergement.
Cette méthode offre de nombreux avantages : un site en hébergement est généralement rapide à créer et facilite le démarrage de projets, et n'implique pas de maintenance et de surveillance de serveur.
Même si vous montez et faites fonctionner votre serveur en interne, vous souhaiterez surement utiliser un site d'hébergement public pour votre code open source — cela rend généralement plus facile l'accès et l'aide par la communauté.

Aujourd'hui, vous avez à disposition un nombre impressionnant d'options d'hébergement, chacune avec différents avantages et désavantages.
Pour une liste à jour, référez-vous à la page suivante :

	https://git.wiki.kernel.org/index.php/GitHosting

Comme nous ne pourrons pas les passer toutes en revue, et comme de plus, il s'avère que je travaille pour l'une d'entre elles, nous utiliserons ce chapitre pour détailler la création d'un compte et d'un nouveau projet sur GitHub.
Cela vous donnera une idée de ce qui est nécessaire.

GitHub est de loin le plus grand site d'hébergement open source sur Git et c'est aussi un des rares à offrir à la fois des options d'hébergement public et privé, ce qui vous permet de conserver vos codes open source et privés au même endroit.
En fait, nous avons utilisé GitHub pour collaborer en privé sur ce livre.

## GitHub

GitHub est légèrement différent de la plupart des sites d'hébergement de code dans le sens où il utilise un espace de noms pour les projets.
Au lieu d'être principalement orienté projet, GitHub est orienté utilisateur.
Cela signifie que lorsque j'héberge mon projet `grit` sur GitHub, vous ne le trouverez pas à `github.com/grit` mais plutôt à `github.com/schacon/grit`.
Il n'y a pas de dépôt canonique d'un projet, ce qui permet à un projet de se déplacer d'un utilisateur à l'autre sans transition si le premier auteur abandonne le projet.

GitHub est aussi une société commerciale qui facture les comptes qui utilisent des dépôts privés, mais tout le monde peut rapidement obtenir un compte gratuit pour héberger autant de projets libres que désiré.
Nous allons détailler comment faire.

## Création d'un compte utilisateur

La première chose à faire, c'est de créer un compte utilisateur gratuit.
Visitez la page « Plans & Pricing » (plans et prix) à `http://github.com/plans` et cliquez sur le bouton « Create a free account » (créer un compte gratuit) de la zone  « Free for open source » (gratuit pour l'open source) (voir figure 4-2) qui vous amène à la page d'enregistrement.


![](http://git-scm.com/figures/18333fig0402-tn.png)

Figure 4-2. La page des différents plans de GitHub.

Vous devez choisir un nom d'utilisateur qui n'est pas déjà utilisé dans le système et saisir une adresse e-mail qui sera associée au compte et un mot de passe (voir figure 4-3).


![](http://git-scm.com/figures/18333fig0403-tn.png)

Figure 4-3. La page d'enregistrement de GitHub.

Si vous l'avez, c'est le bon moment pour ajouter votre clé publique SSH.
Nous avons détaillé comment en générer précédemment au chapitre « Petites installations ».
Copiez le contenu de la clé publique et collez-le dans la boîte à texte « SSH Public Keys » (clés SSH publiques).
En cliquant sur le lien « Need help with public keys? » (besoin d'aide avec les clés publiques ?), vous aurez accès aux instructions (en anglais) pour créer des clés sur la majorité des systèmes d'exploitation.
Cliquez sur le bouton « I agree, sign me up » (j'accepte, enregistrez-moi) pour avoir accès à votre tableau de bord de nouvel utilisateur (voir figure 4-4).


![](http://git-scm.com/figures/18333fig0404-tn.png)

Figure 4-4. Le tableau de bord d'utilisateur de GitHub.

Vous pouvez ensuite procéder à la création d'un nouveau dépôt.

## Création d'un nouveau dépôt

Commencez en cliquant sur le bouton gris « New Repository » juste à côté de « Your Repositories » (vos dépôts) sur le tableau de bord utilisateur.
Un formulaire « Create a New Repository » (créer un nouveau dépôt) apparaît pour vous guider dans la création d'un nouveau dépôt (voir figure 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)

Figure 4-5. Création d'un nouveau dépôt sur GitHub.

Le strict nécessaire consiste à fournir un nom au projet, mais vous pouvez aussi ajouter une description.
Ensuite, cliquez sur le bouton « Create Repository » (créer un dépôt).
Voilà un nouveau dépôt sur GitHub (voir figure 4-6).


![](http://git-scm.com/figures/18333fig0406-tn.png)

Figure 4-6. Information principale d'un projet GitHub.

Comme il n'y a pas encore de code, GitHub affiche les instructions permettant de créer un nouveau projet, de pousser un projet Git existant ou d'importer un projet depuis un dépôt Subversion public (voir figure 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)

Figure 4-7. Instructions pour un nouveau dépôt.

Ces instructions sont similaires à ce que nous avons déjà décrit.
Pour initialiser un projet qui n'est pas déjà dans Git, tapez :

	$ git init
	$ git add .
	$ git commit -m 'premiere validation'

Dans le cas d'un projet Git local, ajoutez GitHub comme dépôt distant et poussez-y votre branche master :

	$ git remote add origin git@github.com:testinguser/iphone_projet.git
	$ git push origin master

Votre projet est à présent hébergé sur GitHub et vous pouvez fournir l'URL à toute personne avec qui vous souhaitez le partager.
Dans notre cas, il s'agit de `http://github.com/testinguser/iphone_projet`.
Vous pouvez aussi voir dans l'en-tête de la page de chaque projet qu'il y a deux URL Git (voir figure 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)

Figure 4-8. En-tête de projet avec une URL publique et une URL privée.

L'URL « Git Read-Only » (Git en lecture seule) est une URL Git publique en lecture seule que tout le monde peut cloner.
Utilisez cette URL pour publier et partager votre dépôt sur un site web ou autre.

Votre URL « SSH » est une URL SSH en lecture/écriture qui ne vous permet de lire et écrire que si vous possédez la clé privée associée à la clé publique téléchargée pour votre utilisateur.
Quand d'autres utilisateurs visiteront cette page de projet, ils ne verront pas cette URL, ils ne verront que l'URL publique.

## Import depuis Subversion

Si vous souhaitez importer un projet public sous Subversion dans Git, GitHub peut vous faciliter la tâche.
Il y a un lien  « Importing a SVN Repo? Click here » (Vous importez un dépôt Subversion ? Cliquez ici) au bas de la page d'instructions.
En le cliquant, vous accédez à un formulaire contenant des informations sur le processus d'import et une boîte à texte où vous pouvez coller l'URL de votre dépôt public Subversion (voir figure 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)

Figure 4-9. Interface d'import depuis Subversion.

Si votre projet est très gros, ne suit pas les standards de nommage ou est privé, cette méthode risque de ne pas fonctionner.
Au chapitre 7, nous traiterons des imports manuels plus compliqués de projets.

## Ajout des collaborateurs

Ajoutons le reste de l'équipe.
Si John, Josie et Jessica ouvrent tous un compte sur GitHub, et que vous souhaitez leur donner un accès en écriture à votre dépôt, vous pouvez les ajouter à votre projet comme collaborateurs.
Cela leur permettra de pousser leur travail sur le dépôt avec leurs clés privées.

Cliquez sur le bouton « Admin » dans l'en-tête du projet pour accéder à la page d'administration de votre projet GitHub (voir figure 4-10).


![](http://git-scm.com/figures/18333fig0410-tn.png)

Figure 4-10. Page d'administration GitHub.

Pour accorder à un autre utilisateur l'accès en écriture au projet, cliquez sur l'onglet « Collaborators » (Collaborateurs).
Vous pouvez entrer le nom de l'utilisateur dans la boîte à texte qui apparaît.
Au fur et à mesure de votre frappe, une liste déroulante affiche les noms qui correspondent aux caractères tapés.
Lorsque vous avez trouvé l'utilisateur correct, cliquez sur le bouton « Add » (Ajouter) pour ajouter l'utilisateur comme collaborateur au projet (voir figure 4-11).


![](http://git-scm.com/figures/18333fig0411-tn.png)

Figure 4-11. Ajout d'un collaborateur à votre projet.

Lorsque vous avez fini d'ajouter des collaborateurs, vous devriez les voir en liste dans la boîte « Repository Collaborators » (voir figure 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)

Figure 4-12. Une liste des collaborateurs sur votre projet.

Si vous devez révoquer l'accès à certaines personnes, vous pouvez cliquer sur la croix rouge leur correspondant et leur accès en écriture sera effacé.
Pour des projets futurs vous pouvez aussi copier des groupes de collaborateurs en copiant les permissions d'un projet existant.

## Votre projet

Une fois que vous avez poussé votre projet ou l'avez importé depuis Subversion, votre page principale de projet ressemble à la figure 4-13.


![](http://git-scm.com/figures/18333fig0413-tn.png)

Figure 4-13. Un page principale de projet GitHub.

Lorsqu'on visite votre projet, on voit cette page.
Elle contient des onglets vers différentes vues des projets.
L'onglet « Commits » (validations) affiche une liste des validations dans l'ordre chronologique inverse, similaire à ce qu'afficherait la commande `git log`.
L'onglet « Network » (réseau) affiche tous les utilisateurs ayant dupliqué votre projet et contribué.
L'onglet « Downloads » (téléchargements) vous permet de télécharger les exécutables du projet ou de fournir des archives des sources aux points étiquetés de votre projet.
L'onglet « Wiki » fournit un wiki où vous pouvez commencer à écrire la documentation ou d'autres informations du projet.
L'onglet « Graphs » permet de visualiser les contributions et les statistiques.
L'onglet principal « Source » sur lequel vous arrivez par défaut affiche le contenu du répertoire principal du projet et met en forme dessous le fichier README s'il en contient un.
Cet onglet affiche aussi une boîte contenant les informations de la dernière validation.

## Duplication de projets

Si vous souhaitez contribuer à un projet auquel vous n'avez pas accès en écriture, GitHub encourage à dupliquer le projet.
Si le projet vous semble intéressant et que vous souhaitez le modifier, vous pouvez cliquer sur le bouton « Fork » (dupliquer) visible dans l'en-tête du projet pour faire copier ce projet par GitHub vers votre utilisateur pour que vous puissiez pousser dessus.

De cette manière, les administrateurs de projet n'ont pas à se soucier d'ajouter des utilisateurs comme collaborateurs pour leur donner un accès en écriture.
On peut dupliquer un projet et pousser dessus, et le mainteneur principal du projet peut tirer ces modifications en ajoutant les projets dupliqués comme dépôts distants et en fusionnant les changements.

Pour dupliquer un projet, visitez la page du projet (par exemple mojombo/chronic), et cliquez sur le bouton « Fork » (dupliquer) dans l'en-tête (voir figure 4-14).


![](http://git-scm.com/figures/18333fig0414-tn.png)

Figure 4-14. Obtenir un copie modifiable et publiable d'un dépôt en cliquant sur le bouton « Fork ».

Quelques secondes plus tard, vous êtes redirigé vers une nouvelle page de projet qui indique que ce projet est un duplicata d'un autre (voir figure 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)

Figure 4-15. Votre duplicata d'un projet.

## Résumé sur GitHub

C'est tout ce que nous dirons de GitHub, mais il faut souligner que tous ces processus sont très rapides.
Vous pouvez créer un compte, ajouter un nouveau projet et commencer à pousser dessus en quelques minutes.
Si votre projet est libre, vous pouvez aussi construire une importante communauté de développeurs qui ont à présent la visibilité sur votre projet et peuvent à tout moment le dupliquer et commencer à contribuer.
Tout au moins, cela peut s'avérer une manière rapide de démarrer avec Git et de l'essayer.
