# Les branches distantes

Les branches distantes sont des références à l'état des branches sur votre dépôt distant.
Ce sont des branches locales qu'on ne peut pas modifier ; elles sont modifiées automatiquement lors de communications réseau.
Les branches distantes agissent comme des marques-pages pour vous aider à vous souvenir de l'état de votre dépôt distant lorsque vous vous y êtes connecté.

Elles prennent la forme de `(distant)/(branche)`.
Par exemple, si vous souhaitiez visualiser l'état de votre branche `master` sur le dépôt distant `origin` lors de votre dernière communication, il vous suffit de vérifier la branche `origin/master`.
Si vous étiez en train de travailler avec un collègue et qu'il a mis à jour la branche `prob53`, vous pourriez avoir votre propre branche `prob53` ; mais la branche sur le serveur pointerait sur le *commit* de `origin/prob53`.

Cela peut paraître déconcertant, alors éclaircissons les choses par un exemple.
Supposons que vous avez un serveur Git sur le réseau à l'adresse `git.notresociete.com`.
Si vous clonez à partir de ce serveur, Git le nomme automatiquement `origin` et en tire tout l'historique, crée un pointeur sur l'état actuel de la branche `master` et l'appelle localement `origin/master` ; vous ne pouvez pas la modifier.
Git vous crée votre propre branche `master` qui démarre au même *commit* que la branche `master` d'origine, pour que vous puissiez commencer à travailler (voir figure 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)

Figure 3-22. Un clonage Git vous fournit une branche `master` et une branche `origin/master` pointant sur la branche `master` de l'origine.

Si vous travaillez sur votre branche locale `master` et que dans le même temps, quelqu'un pousse vers `git.notresociete.com` et met à jour cette branche, alors vos deux historiques divergent.
Tant que vous restez sans contact avec votre serveur distant, votre pointeur `origin/master` n'avance pas (voir figure 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)

Figure 3-23. Les travaux locaux et les modifications poussées sur le serveur distant font diverger les deux historiques.

Lancez la commande `git fetch origin` pour synchroniser votre travail.
Cette commande recherche le serveur hébergeant origin (dans notre cas, `git.notresociete.com`), en récupère toutes les nouvelles données et met à jour votre base de donnée locale en déplaçant votre pointeur `origin/master` à sa valeur nouvelle à jour avec le serveur distant (voir figure 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)

Figure 3-24. La commande `git fetch` met à jour vos références distantes.

Pour démontrer l'usage de multiples serveurs distants et le fonctionnement avec des branches multiples, supposons que vous avez un autre serveur Git interne qui n'est utilisé pour le développement que par une équipe.
Ce serveur se trouve sur `git.equipe1.notresociete.com`.
Vous pouvez l'ajouter aux références distantes de votre projet actuel en lançant la commande `git remote add` comme nous l'avons décrit au chapitre 2.
Nommez ce serveur distant `equipeun` qui sera le raccourci pour l'URL complète (voir figure 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)

Figure 3-25. Ajouter un autre serveur comme accès distant.

Maintenant, lancez `git fetch equipeun` pour récupérer l'ensemble des informations du serveur distant `equipeun` que vous ne possédez pas.
Comme ce serveur contient déjà un sous-ensemble des données du serveur `origin`, Git ne récupère aucune donnée mais positionne une branche distante appelée `equipeun/master` qui pointe sur le *commit* que `equipeun` a comme branche `master` (voir figure 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)

Figure 3-26. Vous récupérez une référence locale à la branche `master` de equipeun.

## Pousser vers un serveur

Lorsque vous souhaitez partager une branche avec le reste du monde, vous devez la pousser sur le serveur distant sur lequel vous avez accès en écriture.
Vos branches locales ne sont pas automatiquement synchronisées sur les serveurs distants — vous devez pousser explicitement les branches que vous souhaitez partager.
De cette manière, vous pouvez utiliser des branches privées pour le travail que vous ne souhaitez pas partager et ne pousser que les branches sur lesquelles vous souhaitez collaborer.

Si vous possédez une branche nommée `correctionserveur` sur laquelle vous souhaitez travailler avec des tiers, vous pouvez la pousser de la même manière que vous avez poussé votre première branche.
Lancez `git push [serveur distant] [branche]` :

	$ git push origin correctionserveur
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      correctionserveur -> correctionserveur

C'est un raccourci.
En fait, Git étend le nom de branche `correctionserveur` en `refs/heads/correctionserveur:refs/heads/correctionserveur`, ce qui signifie « Prendre ma branche locale `correctionserveur` et la pousser pour mettre à jour la branche distante `correctionserveur` ».
Nous traiterons plus en détail la partie `refs/heads/` au chapitre 9, mais vous pouvez généralement l'oublier.
Vous pouvez aussi lancer `git push origin correctionserveur:correctionserveur`, qui réalise la même chose — ce qui signifie « Prendre ma branche `correctionserveur` et en faire la branche `correctionserveur` distante ».
Vous pouvez utiliser ce format pour pousser une branche locale vers une branche distante nommée différemment.
Si vous ne souhaitez pas l'appeler `correctionserveur` sur le serveur distant, vous pouvez lancer à la place `git push origin correctionserveur:branchegeniale` pour pousser votre branche locale `correctionserveur` sur la branche `branchegeniale` sur le dépôt distant.

La prochaine fois qu'un de vos collaborateurs récupère les données depuis le serveur, il récupérera une référence à l'état de la branche distante `origin/correctionserveur` :

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      correctionserveur    -> origin/correctionserveur

Important : lorsque l'on récupère une nouvelle branche depuis un serveur distant, il n'y a pas de création automatique d'une copie locale éditable.
En d'autres termes, il n'y a pas de branche `correctionserveur`, seulement un pointeur sur la branche `origin/correctionserveur` qui n'est pas modifiable.

Pour fusionner ce travail dans votre branche actuelle de travail, vous pouvez lancer `git merge origin/correctionserveur`.
Si vous souhaitez créer votre propre branche `correctionserveur` pour pouvoir y travailler, vous pouvez la baser sur le pointeur distant :

	$ git checkout -b correctionserveur origin/correctionserveur
	Branch correctionserveur set up to track remote branch refs/remotes/origin/correctionserveur.
	Switched to a new branch "correctionserveur"

Cette commande vous fournit une branche locale modifiable basée sur l'état actuel de `origin/correctionserveur`.

## Suivre les branches

L'extraction d'une branche locale à partir d'une branche distante crée automatiquement ce qu'on appelle une _branche de suivi_.
Les branches de suivi sont des branches locales qui sont en relation directe avec une branche distante.
Si vous vous trouvez sur une branche de suivi et que vous tapez `git push`, Git sélectionne automatiquement le serveur vers lequel pousser vos modifications.
De même, `git pull` sur une de ces branches récupère toutes les références distantes et les fusionne automatiquement dans la branche distante correspondante.

Lorsque vous clonez un dépôt, il crée généralement automatiquement une branche `master` qui suit `origin/master`.
C'est pourquoi les commandes `git push` et `git pull` fonctionnent directement sans plus de paramétrage.
Vous pouvez néanmoins créer d'autres branches de suivi si vous le souhaitez, qui ne suivront pas `origin` ni la branche `master`.
Un cas d'utilisation simple est l'exemple précédent, en lançant `git checkout -b [branche] [nomdistant]/[branche]`.
Si vous avez Git version 1.6.2 ou plus, vous pouvez aussi utiliser l'option courte `--track` :

	$ git checkout --track origin/correctionserveur
	Branch correctionserveur set up to track remote branch refs/remotes/origin/correctionserveur.
	Switched to a new branch "correctionserveur"

Pour créer une branche locale avec un nom différent de celui de la branche distante, vous pouvez simplement utiliser la première version avec un nom de branche locale différent :

	$ git checkout -b sf origin/correctionserveur
	Branch sf set up to track remote branch refs/remotes/origin/correctionserveur.
	Switched to a new branch "sf"

À présent, votre branche locale sf poussera vers et tirera automatiquement depuis origin/correctionserveur.

## Effacer des branches distantes

Supposons que vous en avez terminé avec une branche distante.
Vous et vos collaborateurs avez terminé une fonctionnalité et l'avez fusionnée dans la branche `master` du serveur distant (ou la branche correspondant à votre code stable).
Vous pouvez effacer une branche distante en utilisant la syntaxe plutôt obtuse `git push [nomdistant] :[branch]`.
Si vous souhaitez effacer votre branche `correctionserveur` du serveur, vous pouvez lancer ceci :

	$ git push origin :correctionserveur
	To git@github.com:schacon/simplegit.git
	 - [deleted]         correctionserveur

Boum !
Plus de branche sur le serveur.
Vous souhaiterez sûrement corner cette page parce que vous aurez besoin de cette commande et il y a de fortes chances que vous en oubliiez la syntaxe.
Un moyen mnémotechnique est de l'associer à la syntaxe de la commande `git push [nomdistant] [branchelocale]:[branchedistante]` que nous avons utilisée précédemment.
Si vous éliminez la partie `[branchelocale]`, cela signifie « ne rien prendre de mon côté et en faire `[branchedistante]` ».
