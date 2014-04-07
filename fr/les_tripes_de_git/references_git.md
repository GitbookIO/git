# Références Git

On peut exécuter quelque chose comme `git log 1a410e` pour visualiser tout l'historique, mais il faut se souvenir que `1a410e` est le dernier *commit* afin de parcourir l'historique et trouver tous ces objets.
Vous avez besoin d'un fichier ayant un nom simple qui contient l'empreinte SHA-1 afin d'utiliser ce pointeur plutôt que l'empreinte SHA-1 elle-même.

Git appelle ces pointeurs des « références », ou « refs ».
On trouve les fichiers contenant des empreintes SHA-1 dans le répertoire `git/refs`.
Dans le projet actuel, ce répertoire ne contient aucun fichier, mais possède une structure simple :

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

Pour créer une nouvelle référence servant à se souvenir du dernier *commit*, vous pouvez simplement faire ceci :

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

Vous pouvez maintenant utiliser la référence principale que vous venez de créer à la place de l'empreinte SHA-1 dans vos commandes Git :

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Il n'est pas conseillé d'éditer directement les fichiers des références.
Git propose une manière sûre de mettre à jour une référence, c'est la commande `update-ref` :

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

C'est simplement ce qu'est une branche dans Git : un simple pointeur ou référence sur le dernier état d'une suite de travaux.
Pour créer une branche à partir du deuxième *commit*, vous pouvez faire ceci :

	$ git update-ref refs/heads/test cac0ca

Cette branche contiendra seulement le travail effectué jusqu'à ce *commit* :

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

La base de donnée Git ressemble maintenant à quelque chose comme la figure 9-4.


![](http://git-scm.com/figures/18333fig0904-tn.png)

Figure 9-4. Le répertoire d'objets de Git y compris la référence au dernier état de la branche.

Quand on exécute un commande comme  `git branch (nomdebranche)`, Git exécute simplement la commande `update-ref` pour ajouter l'empreinte SHA-1 du dernier *commit* dans la référence que l'on veut créer.

## La branche HEAD

On peut se poser la question : « Comment Git peut avoir connaissance de l'empreinte SHA-1 du dernier *commit* quand on exécute `git branch (branchname)` ? »
La réponse est dans le fichier HEAD (qui veut dire tête en français, soit, ici, l'état courant).
Le fichier HEAD est une référence symbolique à la branche courante.
Par référence symbolique, j'entends que contrairement à une référence normale, elle ne contient pas une empreinte SHA-1, mais plutôt un pointeur vers une autre référence.
Si vous regardez ce fichier, vous devriez voir quelque chose comme ceci :

	$ cat .git/HEAD
	ref: refs/heads/master

Si vous exécutez `git checkout test`, Git met à jour ce fichier, qui ressemblera à ceci :

	$ cat .git/HEAD
	ref: refs/heads/test

Quand vous exécutez `git commit`, il crée l'objet *commit* en spécifiant le parent du *commit* comme étant l'empreinte SHA-1 pointé par la référence du fichier HEAD :

On peut éditer manuellement ce fichier, mais encore une fois, il existe une commande supplémentaire pour le faire : `symbolic-ref`.
Vous pouvez lire le contenu de votre fichier HEAD avec cette commande :

	$ git symbolic-ref HEAD
	refs/heads/master

Vous pouvez aussi initialiser la valeur de HEAD :

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD
	ref: refs/heads/test

Vous ne pouvez pas initialiser une référence symbolique à une valeur non contenu dans refs :

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## Étiquettes

Nous venons de parcourir les trois types d'objets utilisés par Git, mais il existe un quatrième objet.
L'objet étiquette (*tag* en anglais) ressemble beaucoup à un objet *commit*.
Il contient un étiqueteur, une date, un message et un pointeur.
La principale différence est que l'étiquette pointe vers un *commit* plutôt qu'un arbre.
C'est comme une référence à une branche, mais elle ne bouge jamais : elle pointe toujours vers le même *commit*, lui donnant un nom plus sympathique.

Comme présenté au chapitre 2, il existe deux types d'étiquettes : annotée et légère.
Vous pouvez créer une étiquette légère comme ceci :

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

C'est tout ce qu'est une étiquette légère : une branche qui n'est jamais modifiée.
Une étiquette annotée est plus complexe.
Quand on crée une étiquette annotée, Git crée un objet étiquette, puis enregistre une référence qui pointe vers lui plutôt que directement vers le *commit*.
Vous pouvez voir ceci en créant une étiquette annotée (`-a` spécifie que c'est une étiquette annotée) :

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 –m 'test tag'

Voici l'empreinte SHA-1 de l'objet créé :

	$ cat .git/refs/tags/v1.1
	9585191f37f7b0fb9444f35a9bf50de191beadc2

Exécutez ensuite, la commande `cat-file` sur l'empreinte SHA-1 :

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

Remarquez que le contenu de l'objet pointe vers l'empreinte SHA-1 du *commit* que vous avez étiqueté.
Remarquez qu'il n'est pas nécessaire qu'il pointe vers un *commit*.
On peut étiqueter n'importe quel objet.
Par exemple, dans le code source de Git, le mainteneur a ajouté ses clés GPG dans un blob et l'a étiqueté.
Vous pouvez voir la clé publique en exécutant :

	$ git cat-file blob junio-gpg-pub

dans le code source de Git.
Le noyau Linux contient aussi une étiquette ne pointant pas vers un *commit* : la première étiquette créée pointe vers l'arbre initial lors de l'importation du code source.

## Références distantes

Le troisième type de références que l'on étudiera sont les références distantes (*remotes*).
Si l'on ajoute une référence distante et que l'on pousse des objets vers elle, Git stocke la valeur que vous avez poussée en dernière vers cette référence pour chaque branche dans le répertoire `refs/remotes`.
Vous pouvez par exemple, ajouter une référence distante nommée `origin` et y pousser votre branche `master` :

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

Ensuite, vous pouvez voir l'état de la branche `master` dans la référence distante `origin` la dernière fois que vous avez communiqué avec le serveur en regardant le fichier `refs/remotes/origin/master` :

	$ cat .git/refs/remotes/origin/master
	ca82a6dff817ec66f44342007202690a93763949

Les références distantes diffèrent des branches (références `refs/heads`) principalement parce qu'on ne peut pas les récupérer dans le répertoire de travail.
Git les modifie comme des marque-pages du dernier état de ces branches sur le serveur.
