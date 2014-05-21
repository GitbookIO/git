# Trucs et astuces

Avant de clore ce chapitre sur les bases de Git, voici quelques trucs et astuces qui peuvent rendre votre apprentissage de Git plus simple, facile ou familier.
De nombreuses personnes utilisent parfaitement Git sans connaître aucun de ces trucs, et nous n'y ferons pas référence, ni ne considérerons leur connaissance comme des pré-requis pour la suite de ce livre, mais il est préférable de les connaître.


## Auto-Complétion

Si vous utilisez le shell Bash, Git est livré avec un script d'auto-complétion utile.
Téléchargez le code source de Git, et jetez un œil dans le répertoire `contrib/completion`.
Il devrait y avoir un fichier nommé `git-completion.bash`.
Copiez ce fichier dans votre répertoire personnel et ajoutez cette ligne à votre fichier `.bashrc` :

	source ~/.git-completion.bash

Si vous souhaitez paramétrer Bash pour activer la complétion automatique de Git pour tous les utilisateurs, copiez le script dans le répertoire `/opt/local/etc/bash_completion.d` sur les systèmes Mac ou dans le répertoire `/etc/bash_completion.d` sur les systèmes Linux.
C'est le répertoire dans lequel Bash lit pour fournir automatiquement la complétion en ligne de commande.

Si vous utilisez Windows avec le Bash Git, qui est installé par défaut avec Git en msysGit, l'auto-complétion est pré-configurée.

Pressez la touche Tab lorsque vous écrivez une commande Git, et le shell devrait vous indiquer une liste de suggestions pour continuer la commande :

	$ git co<tab><tab>
	commit config

Dans ce cas, taper `git co` et appuyer sur la touche Tab deux fois suggère `commit` et `config`.
Ajouter `m<tab>` complète `git commit` automatiquement.

Cela fonctionne aussi avec les options, ce qui est probablement plus utile.
Par exemple, si vous tapez la commande `git log` et ne vous souvenez plus d'une des options, vous pouvez commencer à la taper, et appuyer sur la touche Tab pour voir ce qui peut correspondre :

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

C'est une astuce qui peut clairement vous éviter de perdre du temps ou de lire de la documentation.

## Les alias Git

Git ne complète pas votre commande si vous ne la tapez que partiellement.
Si vous ne voulez pas avoir à taper l'intégralité du texte de chaque commande, vous pouvez facilement définir un alias pour chaque commande en utilisant `git config`.
Voici quelques exemples qui pourraient vous intéresser :

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Ceci signifie que, par exemple, au lieu de taper `git commit`, vous n'avez plus qu'à taper `git ci`.
Au fur et à mesure de votre utilisation de Git, vous utiliserez probablement d'autres commandes plus fréquemment.
Dans ce cas, n'hésitez pas à créer de nouveaux alias.

Cette technique peut aussi être utile pour créer des commandes qui vous manquent.
Par exemple, pour corriger le problème d'ergonomie que vous avez rencontré lors de la désindexation d'un fichier, vous pourriez créer un alias pour désindexer :

	$ git config --global alias.unstage 'reset HEAD --'

Cela rend les deux commandes suivantes équivalentes :

	$ git unstage fichierA
	$ git reset HEAD fichierA

Cela rend les choses plus claires.
Il est aussi commun d'ajouter un alias `last`, de la manière suivante :

	$ git config --global alias.last 'log -1 HEAD'

Ainsi, vous pouvez visualiser plus facilement le dernier *commit* :

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Pour explication, Git remplace simplement la nouvelle commande par tout ce que vous lui aurez demandé d'aliaser.
Si par contre vous souhaitez lancer une commande externe plutôt qu'une sous-commande Git, vous pouvez commencer votre commande par un caractère `!`.
C'est utile si vous écrivez vos propres outils pour travailler dans un dépôt Git.
On peut par exemple aliaser `git visual` pour lancer `gitk` :

	$ git config --global alias.visual '!gitk'
