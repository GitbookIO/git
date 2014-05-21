# Brancher et fusionner : les bases

Suivons un exemple simple de branche et fusion dans une utilisation que vous feriez dans le monde réel.
Vous feriez les étapes suivantes :

1. travailler sur un site web ;
2. créer une branche pour un nouvel article sur lequel vous souhaiteriez travailler ;
3. réaliser quelques tâches sur cette branche.

À cette étape, vous recevez un appel pour vous dire qu'un problème critique a été découvert et qu'il faut le régler au plus tôt.
Vous feriez ce qui suit :

1. revenir à la branche de production ;
2. créer une branche et y développer le correctif ;
3. après un test, fusionner la branche de correctif et pousser le résultat à la production ;
4. rebasculer à la branche initiale et continuer le travail.

## Le branchement de base

Premièrement, supposons que vous travaillez sur votre projet et avez déjà quelques *commits* (voir figure 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)

Figure 3-10. Un historique simple et court.

Vous avez décidé de travailler sur le problème numéroté #53 dans le suivi de faits techniques que votre entreprise utilise.
Pour clarifier, Git n'est pas lié à un gestionnaire particulier de faits techniques.
Mais comme le problème #53 est un problème ciblé sur lequel vous voulez travailler, vous allez créer une nouvelle branche dédiée à sa résolution.
Pour créer une branche et y basculer tout de suite, vous pouvez lancer la commande `git checkout` avec l'option `-b` :

	$ git checkout -b prob53
	Switched to a new branch "prob53"

C'est un raccourci pour :

	$ git branch prob53
	$ git checkout prob53

La figure 3-11 illustre le résultat.


![](http://git-scm.com/figures/18333fig0311-tn.png)

Figure 3-11. Création d'un nouveau pointeur de branche.

Vous travaillez sur votre site web et validez des modifications.
Ce faisant, la branche `prob53` avance, parce que vous l'avez extraite (c'est-à-dire que votre pointeur `HEAD` pointe dessus, voir figure 3-12) :

	$ vim index.html
	$ git commit -a -m 'ajout d'un pied de page [problème 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)

Figure 3-12. La branche prob53 a avancé avec votre travail.

Maintenant vous recevez un appel qui vous apprend qu'il y a un problème sur le site web, un problème qu'il faut résoudre immédiatement.
Avec Git, vous n'avez pas besoin de déployer les modifications déjà validées pour `prob53` avec les correctifs du problème et vous n'avez pas non plus à suer pour éliminer ces modifications avant de pouvoir appliquer les correctifs du problème en production.
Tout ce que vous avez à faire, c'est simplement rebasculer sur la branche `master`.

Cependant, avant de le faire, notez que si votre copie de travail ou votre zone d'index contiennent des modifications non validées qui sont en conflit avec la branche que vous extrayez, Git ne vous laissera pas basculer de branche.
Le mieux est d'avoir votre copie de travail dans un état propre au moment de basculer de branche.
Il y a des moyens de contourner ceci (précisément par le remisage et l'amendement de *commit*) dont nous parlerons plus loin.
Pour l'instant, vous avez validé tous vos changements dans la branche `prob53` et vous pouvez donc rebasculer vers la branche `master` :

	$ git checkout master
	Switched to branch "master"

À présent, votre répertoire de copie de travail est exactement dans l'état précédent les modifications pour le problème #53 et vous pouvez vous consacrer à votre correctif.
C'est un point important : Git réinitialise le répertoire de travail pour qu'il ressemble à l'instantané de la validation sur laquelle la branche que vous extrayez pointe.
Il ajoute, retire et modifie les fichiers automatiquement pour assurer que la copie de travail soit identique à ce qu'elle était lors de votre dernière validation sur la branche.

Ensuite, vous avez un correctif à faire.
Créons une branche de correctif sur laquelle travailler jusqu'à ce que ce soit terminé (voir figure 3-13) :

	$ git checkout -b 'correctif'
	Switched to a new branch "correctif"
	$ vim index.html
	$ git commit -a -m "correction d'une adresse mail incorrecte"
	[correctif]: created 3a0874c: "correction d'une adresse mail incorrecte"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)

Figure 3-13. Branche de correctif basée à partir de la branche `master`.

Vous pouvez lancer vos tests, vous assurer que la correction est efficace et la fusionner dans la branche `master` pour la déployer en production.
Vous réalisez ceci au moyen de la commande `git merge` :

	$ git checkout master
	$ git merge correctif
	Updating f42c576..3a0874c
	Fast forward
	 LISEZMOI |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Vous noterez la mention « Fast forward » qui signifie avance rapide dans cette fusion.
Comme le *commit* pointé par la branche que vous avez fusionnée était directement descendant du *commit* sur lequel vous vous trouvez, Git a avancé le pointeur en avant.
Autrement dit, lorsque l'on cherche à fusionner un *commit* qui peut être joint en suivant l'historique depuis le *commit* d'origine, Git avance simplement le pointeur car il n'y a pas de travaux divergents à réellement fusionner — ceci s'appelle l'avance rapide.

Votre modification est maintenant dans l'instantané du *commit* pointé par la branche `master` et vous pouvez déployer votre modification (voir figure 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)

Figure 3-14. Après la fusion, votre branche `master` pointe au même endroit que la correction.

Après le déploiement de votre correction super-importante, vous voilà de nouveau prêt à travailler sur votre sujet précédent l'interruption.
Cependant, vous allez avant tout effacer la branche `correctif` parce que vous n'en avez plus besoin et la branche `master` pointe au même endroit.
Vous pouvez l'effacer avec l'option `-d` de la commande `git branch` :

	$ git branch -d correctif
	Deleted branch correctif (3a0874c).

Maintenant, il est temps de basculer sur la branche « travaux en cours » sur le problème #53 et de continuer à travailler dessus (voir figure 3-15) :

	$ git checkout prob53
	Switched to branch "prob53"
	$ vim index.html
	$ git commit -a -m 'Nouveau pied de page terminé [problème 53]'
	[prob53]: created ad82d7a: "Nouveau pied de page terminé [problème 53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)

Figure 3-15. Votre branche prob53 peut avancer indépendamment de `master`.

Il est utile de noter que le travail réalisé dans `correctif` n'est pas contenu dans les fichiers de la branche `prob53`.
Si vous avez besoin de les y rapatrier, vous pouvez fusionner la branche `master` dans la branche `prob53` en lançant la commande `git merge master`, ou vous pouvez retarder l'intégration de ces modifications jusqu'à ce que vous décidiez plus tard de rapatrier la branche `prob53` dans `master`.

## Les bases de la fusion

Supposons que vous ayez décidé que le travail sur le problème #53 est terminé et se trouve donc prêt à être fusionné dans la branche `master`.
Pour ce faire, vous allez rapatrier votre branche `prob53` de la même manière que vous l'avez fait plus tôt pour la branche `correctif`.
Tout ce que vous avez à faire est d'extraire la branche dans laquelle vous souhaitez fusionner et lancer la commande `git merge` :

	$ git checkout master
	$ git merge prob53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Le comportement semble légèrement différent de celui observé pour la fusion précédente de `correctif`. Dans ce cas, l'historique de développement a divergé à un certain point.
Comme le *commit* sur la branche sur laquelle vous vous trouvez n'est plus un ancêtre direct de la branche que vous cherchez à fusionner, Git doit travailler.
Dans ce cas, Git réalise une simple fusion à trois sources, en utilisant les deux instantanés pointés par les sommets des branches et l'ancêtre commun des deux.
La figure 3-16 illustre les trois instantanés que Git utilise pour réaliser la fusion dans ce cas.


![](http://git-scm.com/figures/18333fig0316-tn.png)

Figure 3-16. Git identifie automatiquement la meilleure base d'ancêtre commun pour réaliser la fusion.

Au lieu d'avancer simplement le pointeur de branche, Git crée un nouvel instantané qui résulte de la fusion à trois branches et crée automatiquement un nouveau *commit* qui pointe dessus (voir figure 3-17).
On appelle ceci un *commit* de fusion, qui est spécial en ce qu'il comporte plus d'un parent.

Il est à noter que Git détermine par lui-même le meilleur ancêtre commun à utiliser comme base de fusion ; ce comportement est très différent de celui de CVS ou Subversion (antérieur à la version 1.5), où le développeur en charge de la fusion doit trouver par lui-même la meilleure base de fusion.
Cela rend la fusion beaucoup plus facile dans Git que dans les autres systèmes.


![](http://git-scm.com/figures/18333fig0317-tn.png)

Figure 3-17. Git crée automatiquement un nouvel objet *commit* qui contient le travail fusionné.

À présent que votre travail a été fusionné, vous n'avez plus besoin de la branche `prob53`.
Vous pouvez l'effacer et fermer manuellement le ticket dans votre outil de suivi de faits techniques :

	$ git branch -d prob53

## Conflits de fusion

Quelquefois, le processus ci-dessus ne se passe pas sans accroc.
Si vous avez modifié différemment la même partie du même fichier dans les deux branches que vous souhaitez fusionner, Git ne sera pas capable de réaliser proprement la fusion.
Si votre résolution du problème #53 a modifié la même section de fichier que le `correctif`, vous obtiendrez une conflit de fusion qui ressemblera à ceci :

	$ git merge prob53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git n'a pas automatiquement créé le *commit* du fusion.
Il a arrêté le processus le temps que vous résolviez le conflit.
Lancez `git status`  pour voir à tout moment  après l'apparition du conflit de fusion quels fichiers n'ont pas été fusionnés :

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Tout ce qui comporte des conflits de fusion et n'a pas été résolu est listé comme `unmerged`.
Git ajoute des marques de conflit standard dans les fichiers qui comportent des conflits, pour que vous puissiez les ouvrir et résoudre les conflits manuellement.
Votre fichier contient des sections qui ressemblent à ceci :

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> prob53:index.html

Cela signifie que la version dans `HEAD` (votre branche `master`, parce que c'est celle que vous aviez extraite quand vous avez lancé votre commande de fusion) est la partie supérieure de ce bloc (tout ce qui se trouve au dessus de la ligne `=======`), tandis que la version de la branche `prob53` se trouve en dessous.
Pour résoudre le conflit, vous devez choisir une partie ou l'autre ou bien fusionner leurs contenus par vous-même.
Par exemple, vous pourriez choisir de résoudre ce conflit en remplaçant tout le bloc par ceci :

	<div id="footer">
	please contact us at email.support@github.com
	</div>

Cette résolution comporte des parties de chaque section et les lignes `<<<<<<<`, `=======` et `>>>>>>>` ont été complètement effacées.
Après avoir résolu chacune de ces sections dans chaque fichier comportant un conflit, lancez `git add` sur chaque fichier pour le marquer comme résolu.
Placer le fichier dans l'index marque le conflit comme résolu pour Git.
Si vous souhaitez utiliser un outil graphique pour résoudre ces problèmes, vous pouvez lancer `git mergetool` qui démarre l'outil graphique de fusion approprié et vous permet de naviguer dans les conflits :

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

Si vous souhaitez utiliser un outil de fusion autre que celui par défaut (Git a choisi `opendiff` pour moi dans ce cas car j'utilise la commande sous Mac), vous pouvez voir tous les outils supportés après l'indication « merge tool candidates ».
Tapez le nom de l'outil que vous préfèreriez utiliser.
Au chapitre 7, nous expliquerons comment changer cette valeur par défaut dans votre environnement.

Après avoir quitté l'outil de fusion, Git vous demande si la fusion a été réussie.
Si vous répondez par la positive à l'outil, il indexe le fichier pour le marquer comme résolu.

Vous pouvez lancer à nouveau la commande `git status` pour vérifier que tous les conflits ont été résolus :

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

Si cela vous convient et que vous avez vérifié que tout ce qui comportait un conflit a été indexé, vous pouvez taper la commande `git commit` pour finaliser le *commit* de fusion.
Le message de validation ressemble d'habitude à ceci :

	Merge branch 'prob53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

Vous pouvez modifier ce message pour inclure les détails sur la résolution du conflit si vous pensez que cela peut être utile lors d'une revue ultérieure — pourquoi vous avez fait ceci, si ce n'est pas clair.
