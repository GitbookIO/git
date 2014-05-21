# Gestion de branches

Après avoir créé, fusionné et effacé des branches, regardons de plus près les outils de gestion de branche qui s'avèreront utiles lors d'une utilisation intensive des branches.

La commande `git branch` fait plus que créer et effacer des branches.
Si vous la lancez sans argument, vous obtenez la liste des branches courantes :

	$ git branch
	  prob53
	* master
	  test

Notez le caractère `*` qui préfixe la branche `master`.
Ce caractère indique la branche qui est actuellement extraite.
Ceci signifie que si vous validez des modifications, la branche `master` avancera avec votre travail.
Pour visualiser les dernières validations sur chaque branche, vous pouvez lancer le commande `git branch -v` :

	$ git branch -v
	  prob53   93b412c fix javascript issue
	* master   7a98805 Merge branch 'prob53'
	  test     782fd34 add scott to the author list in the readmes

D'autres options permettent de voir l'état des branches en filtrant cette liste par les branches qui ont ou n'ont pas encore été fusionnées dans la branche courante.
Ce sont les options `--merged` et `--no-merged`.
Pour voir quelles branches ont déjà été fusionnées dans votre branche actuelle, lancez `git branch --merged` :

	$ git branch --merged
	  prob53
	* master

Comme vous avez déjà fusionné `prob53` auparavant, vous la voyez dans votre liste.
Les branches de cette liste qui ne comportent pas l'étoile en préfixe peuvent généralement être effacées sans risque au moyen de `git branch -d` ; vous avez déjà incorporé leurs modifications dans une autre branche et n'allez donc rien perdre.

Lancez `git branch --no-merged` pour visualiser les branches qui contiennent des travaux qui n'ont pas encore été fusionnés :

	$ git branch --no-merged
	  test

Ceci montre votre autre branche.
Comme elle contient des modifications qui n'ont pas encore été fusionnées, un essai d'effacement par `git branch -d` se solde par un échec :

	$ git branch -d test
	error: The branch 'test' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D test'.

Si vous souhaitez réellement effacer cette branche et perdre ainsi le travail réalisé, vous pouvez forcer l'effacement avec l'option `-D`, comme l'indique justement le message.
