# Réécrire l'historique

Bien souvent, lorsque vous travaillez avec Git, vous souhaitez modifier votre historique de validation pour une raison quelconque.
Une des choses merveilleuses de Git est qu'il vous permet de prendre des décisions le plus tard possible.
Vous pouvez décider quels fichiers vont dans quel *commit* avant que vous ne validiez l'index, vous pouvez décider que vous ne voulez pas encore montrer que vous travaillez sur quelque chose avec les remises, et vous pouvez réécrire les *commits* déjà sauvegardés pour qu'ils ressemblent à quelque chose d'autre.
Cela peut signifier changer l'ordre des *commits*, modifier les messages ou modifier les fichiers appartenant au *commit*, rassembler ou scinder des *commits*, ou supprimer complètement des *commits* ; tout ceci avant de les partager avec les autres.

Dans cette section, nous expliquerons comment accomplir ces tâches très utiles pour que vous puissiez remodeler votre historique de validation comme vous le souhaitez avant de le partager avec autrui.

## Modifier la dernière validation

Modifier votre dernière validation est probablement la réécriture de l'historique que vous allez utiliser le plus souvent.
Vous voudrez souvent faire deux choses basiques à votre dernier *commit* : modifier le message de validation ou changer le contenu que vous avez enregistré en ajoutant, modifiant ou supprimant des fichiers.

Si vous voulez seulement modifier votre dernier message de validation, c'est vraiment simple :

	$ git commit --amend

Cela ouvre votre éditeur de texte contenant votre dernier message, prêt à être modifié.
Lorsque vous sauvegardez et fermez l'éditeur, Git enregistre la nouvelle validation contenant le message et en fait votre dernier *commit*.

Si vous voulez modifier le contenu de votre validation en ajoutant ou modifiant des fichiers, sûrement parce que vous avez oublié d'ajouter les fichiers nouvellement créés quand vous avez validé la première fois, la procédure fonctionne grosso-modo de la même manière.
Vous indexez les modifications que vous voulez en exécutant `git add` ou `git rm`, et le prochain `git commit --amend` prendra votre index courant et en fera le contenu de votre nouvelle validation.

Vous devez être prudent avec cette technique car votre modification modifie également le SHA-1 du *commit*.
Cela ressemble à un tout petit `rebase`.
Ne modifiez pas votre dernière validation si vous l'avez déjà publiée !

## Modifier plusieurs messages de validation

Pour modifier une validation qui est plus loin dans votre historique, vous devez utiliser des outils plus complexes.
Git ne contient pas d'outil de modification d'historique, mais vous pouvez utiliser l'outil `rebase` pour rebaser une suite de *commits* depuis la branche HEAD plutôt que de les déplacer vers une autre branche.
Avec l'outil `rebase` interactif, vous pouvez vous arrêter après chaque *commit* que vous voulez modifier et changer le message, ajouter des fichiers ou quoique ce soit que vous voulez.
Vous pouvez exécuter `rebase` interactivement en ajoutant l'option `-i` à `git rebase`.
Vous devez indiquer jusqu'à quand remonter dans votre historique en donnant à la commande le *commit* sur lequel vous voulez vous rebaser.

Par exemple, si vous voulez modifier les 3 derniers messages de validation ou n'importe lequel des messages dans ce groupe, vous fournissez à `git rebase -i` le parent du dernier *commit* que vous voulez éditer, qui est `HEAD~2^` or `HEAD~3`.
Il peut être plus facile de se souvenir de `~3`, car vous essayez de modifier les 3 derniers *commits*, mais gardez à l'esprit que vous désignez le 4e, le parent du dernier *commit* que vous voulez modifier :

	$ git rebase -i HEAD~3

Souvenez-vous également que ceci est une commande de rebasage, chaque *commit* inclus dans l'intervalle `HEAD~3..HEAD` sera réécrit, que vous changiez le message ou non.
N'incluez pas, dans cette commande, de *commit* que vous avez déjà poussé sur un serveur central.
Le faire entraînera la confusion chez les autres développeurs en leur fournissant une version altérée des mêmes modifications.

Exécuter cette commande vous donne la liste des validations dans votre éditeur de texte, ce qui ressemble à :

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

	# Rebase 710f0f8..a5f4a0d onto 710f0f8
	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Il est important de signaler que les *commits* sont listés dans l'ordre inverse de celui que vous voyez normalement en utilisant la commande `log`.
Si vous exécutez la commande `log`, vous verrez quelque chose de ce genre :

	$ git log --pretty=format:"%h %s" HEAD~3..HEAD
	a5f4a0d added cat-file
	310154e updated README formatting and added blame
	f7f3f6d changed my name a bit

Remarquez l'ordre inverse.
Le rebasage interactif va créer un script à exécuter.
Il commencera au *commit* que vous spécifiez sur la ligne de commande (`HEAD~3`) et refera les modifications introduites dans chacun des *commits* du début à la fin.
Il ordonne donc le plus vieux au début, plutôt que le plus récent, car c'est celui qu'il refera en premier.

Vous devez éditer le script afin qu'il s'arrête au *commit* que vous voulez modifier.
Pour cela, remplacer le mot « pick » par le mot « edit » pour chaque *commit* après lequel vous voulez que le script s'arrête.
Par exemple, pour modifier uniquement le message du troisième *commit*, vous modifiez le fichier pour ressembler à :

	edit f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Au moment où vous sauvegardez et quittez l'éditeur, Git revient au dernier *commit* de cette liste et vous laisse sur une ligne de commande avec le message suivant :

	$ git rebase -i HEAD~3
	Stopped at 7482e0d... updated the gemspec to hopefully work better
	You can amend the commit now, with

	       git commit --amend

	Once you’re satisfied with your changes, run

	       git rebase --continue

Ces instructions vous disent exactement quoi faire.
Entrez :

	$ git commit --amend

Modifiez le message de *commit* et quittez l'éditeur.
Puis exécutez :

	$ git rebase --continue

Cette commande appliquera les deux autres *commits* automatiquement.
Si vous remplacez « pick » en « edit » sur plusieurs lignes, vous pouvez répéter ces étapes pour chaque *commit* que vous avez marqué pour modification.
Chaque fois, Git s'arrêtera, vous laissant modifier le *commit* et continuera lorsque vous aurez fini.

## Réordonner les *commits*

Vous pouvez également utiliser les rebasages interactifs afin de réordonner ou supprimer entièrement des *commits*.
Si vous voulez supprimer le *commit* « added cat-file » et modifier l'ordre dans lequel les deux autres *commits* se trouvent dans l'historique, vous pouvez modifier le script de rebasage :

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

afin qu'il ressemble à ceci :

	pick 310154e updated README formatting and added blame
	pick f7f3f6d changed my name a bit

Lorsque vous sauvegardez et quittez l'éditeur, Git remet votre branche au niveau du parent de ces *commits*, applique `310154e` puis `f7f3f6d` et s'arrête.
Vous venez de modifier l'ordre de ces *commits* et de supprimer entièrement le *commit* « added cat-file ».

## Rassembler des *commits*

Il est également possible de prendre une série de *commits* et de les rassembler en un seul avec l'outil de rebasage interactif.
Le script affiche des instructions utiles dans le message de rebasage :

	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Si, à la place de « pick » ou « edit », vous spécifiez « squash », Git applique cette modification et la modification juste précédente et fusionne les messages de validation.
Donc, si vous voulez faire un seul *commit* de ces trois validations, vous faites en sorte que le script ressemble à ceci :

	pick f7f3f6d changed my name a bit
	squash 310154e updated README formatting and added blame
	squash a5f4a0d added cat-file

Lorsque vous sauvegardez et quittez l'éditeur, Git applique ces trois modifications et vous remontre l'éditeur contenant maintenant la fusion des 3 messages de validation :

	# This is a combination of 3 commits.
	# The first commit's message is:
	changed my name a bit

	# This is the 2nd commit message:

	updated README formatting and added blame

	# This is the 3rd commit message:

	added cat-file

Lorsque vous sauvegardez cela, vous obtenez un seul *commit* amenant les modifications des trois *commits* précédents.

## Diviser un *commit*

Pour diviser un *commit*, il doit être défait, puis partiellement indexé et validé autant de fois que vous voulez pour en finir avec lui.
Par exemple, supposons que vous voulez diviser le *commit* du milieu dans l'exemple des trois *commits* précédents.
Plutôt que « updated README formatting and added blame », vous voulez le diviser en deux *commits* : « updated README formatting » pour le premier, et « added blame » pour le deuxième.
Vous pouvez le faire avec le script `rebase -i` en remplaçant l'instruction sur le *commit* que vous voulez diviser en « edit » :

	pick f7f3f6d changed my name a bit
	edit 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Puis, lorsque le script vous laissera accès à la ligne de commande, vous annulerez (*reset*) ce *commit*, vous reprendrez les modifications que vous voulez pour créer plusieurs *commits*.
En reprenant l'exemple, lorsque vous sauvegardez et quittez l'éditeur, Git revient au parent de votre premier *commit* de votre liste, applique le premier *commit* (`f7f3f6d`), applique le deuxième (`310154e`), et vous laisse accès à la console.
Là, vous pouvez faire une réinitialisation mélangée (*mixed reset*) de ce *commit* avec `git reset HEAD^`, qui défait ce *commit* et laisse les fichiers modifiés non indexés.
Maintenant, vous pouvez indexer et valider les fichiers sur plusieurs validations, et exécuter `git rebase --continue` quand vous avez fini :

	$ git reset HEAD^
	$ git add README
	$ git commit -m 'updated README formatting'
	$ git add lib/simplegit.rb
	$ git commit -m 'added blame'
	$ git rebase --continue

Git applique le dernier *commit* (`a5f4a0d`) de votre script, et votre historique ressemblera alors à :

	$ git log -4 --pretty=format:"%h %s"
	1c002dd added cat-file
	9b29157 added blame
	35cfb2b updated README formatting
	f3cc40e changed my name a bit

Une fois encore, ceci modifie les empreintes SHA de tous les *commits* dans votre liste, soyez donc sûr qu'aucun *commit* de cette liste n'ait été poussé dans un dépôt partagé.

## L'option nucléaire : `filter-branch`

Il existe une autre option de la réécriture d'historique que vous pouvez utiliser si vous avez besoin de réécrire un grand nombre de *commits* d'une manière scriptable ; par exemple, modifier globalement votre adresse mail ou supprimer un fichier de tous les *commits*.
La commande est `filter-branch`, et elle peut réécrire des pans entiers de votre historique, vous ne devriez donc pas l'utiliser à moins que votre projet ne soit pas encore public ou que personne n'ait encore travaillé sur les *commits* que vous allez réécrire.
Cependant, cela peut être très utile.
Vous allez maintenant apprendre quelques usages communs pour vous donner une idée de ses capacités.

### Supprimer un fichier de chaque *commit*

Cela arrive assez fréquemment.
Quelqu'un a accidentellement validé un énorme fichier binaire avec une commande `git add .` irréfléchie, et vous voulez le supprimer partout.
Vous avez peut-être validé un fichier contenant un mot de passe et vous voulez rendre votre projet open source.
`filter-branch` est l'outil que vous voulez probablement utiliser pour nettoyer votre historique entier.
Pour supprimer un fichier nommé « passwords.txt » de tout votre historique, vous pouvez utiliser l'option `--tree-filter` de `filter-branch` :

	$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
	Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
	Ref 'refs/heads/master' was rewritten

L'option `--tree-filter` exécute la commande spécifiée pour chaque *commit* et le revalide ensuite.
Dans le cas présent, vous supprimez le fichier nommé « passwords.txt » de chaque contenu, qu'il existait ou non.
Si vous voulez supprimer tous les fichiers temporaires des éditeurs validés accidentellement, vous pouvez exécuter une commande telle que `git filter-branch --tree-filter "find * -type f -name '*~' -delete" HEAD`.

Vous pourrez alors regarder Git réécrire l'arbre des *commits* et revalider à chaque fois, pour finir en modifiant la référence de la branche.
C'est généralement une bonne idée de le faire dans un branche de test puis de faire une réinitialisation forte (*hard-reset*) de votre branche `master` si le résultat vous convient.
Pour exécuter `filter-branch` sur toutes vos branches, vous pouvez ajouter `--all` à la commande.

### Faire d'un sous-répertoire la nouvelle racine

Supposons que vous avez importé votre projet depuis un autre système de gestion de configuration et que vous avez des sous-répertoires qui n'ont aucun sens (trunk, tags, etc.).
Si vous voulez faire en sorte que le sous-répertoire `trunk` soit la nouvelle racine de votre projet pour tous les *commits*, `filter-branch` peut aussi vous aider à le faire :

	$ git filter-branch --subdirectory-filter trunk HEAD
	Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
	Ref 'refs/heads/master' was rewritten

Maintenant votre nouvelle racine est remplacée par le contenu du répertoire `trunk`.
De plus, Git supprimera automatiquement les *commits* qui n'affectent pas ce sous-répertoire.

### Modifier globalement l'adresse mail

Un autre cas habituel est que vous oubliez d'exécuter `git config` pour configurer votre nom et votre adresse mail avant de commencer à travailler, ou vous voulez peut-être rendre un projet du boulot open source et donc changer votre adresse professionnelle pour celle personnelle.
Dans tous les cas, vous pouvez modifier l'adresse mail dans plusieurs *commits* avec un script `filter-branch`.
Vous devez faire attention de ne changer que votre adresse mail, utilisez donc `--commit-filter` :

	$ git filter-branch --commit-filter '
	        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
	        then
	                GIT_AUTHOR_NAME="Scott Chacon";
	                GIT_AUTHOR_EMAIL="schacon@example.com";
	                git commit-tree "$@";
	        else
	                git commit-tree "$@";
	        fi' HEAD

Cela passe sur chaque *commit* et le réécrit pour avoir votre nouvelle adresse.
Mais puisque les *commits* contiennent l'empreinte SHA-1 de leur parent, cette commande modifie tous les *commits* dans votre historique, pas seulement ceux correspondant à votre adresse mail.
