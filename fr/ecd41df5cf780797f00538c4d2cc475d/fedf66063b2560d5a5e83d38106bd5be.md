# Configuration de Git

Comme vous avez pu l'entrevoir au chapitre 1, vous pouvez spécifier les paramètres de configuration de Git avec la commande `git config`.
Une des premières choses que vous avez faites a été de paramétrer votre nom et votre adresse e-mail :

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

À présent, vous allez apprendre quelques unes des options similaires les plus intéressantes pour paramétrer votre usage de Git.

Vous avez vu des détails de configuration simple de Git au premier chapitre, mais nous allons les réviser.
Git utilise une série de fichiers de configuration pour déterminer son comportement selon votre personnalisation.
Le premier endroit que Git visite est le fichier `/etc/gitconfig` qui contient des valeurs pour tous les utilisateurs du système et tous leurs dépôts.
Si vous passez l'option `--system` à `git config`, il lit et écrit ce fichier.

L'endroit suivant visité par Git est le fichier `~/.gitconfig` qui est spécifique à chaque utilisateur.
Vous pouvez faire lire et écrire Git dans ce fichier au moyen de l'option `--global`.

Enfin, Git recherche des valeurs de configuration dans le fichier de configuration du répertoire Git (`.git/config`) du dépôt en cours d'utilisation.
Ces valeurs sont spécifiques à un unique dépôt.
Chaque niveau surcharge le niveau précédent, ce qui signifie que les valeurs dans `.git/config` écrasent celles dans `/etc/gitconfig`.
Vous pouvez positionner ces valeurs manuellement en éditant le fichier et en utilisant la syntaxe correcte, mais il reste généralement plus facile de lancer la commande `git config`.

## Configuration de base d'un client

Les options de configuration reconnues par Git tombent dans deux catégories : côté client et côté serveur.
La grande majorité se situe côté client pour coller à vos préférences personnelles de travail.
Parmi les tonnes d'options disponibles, seules les plus communes ou affectant significativement la manière de travailler seront couvertes.
De nombreuses options ne s'avèrent utiles qu'en de rares cas et ne seront pas traitées.
Pour voir la liste de toutes les options que votre version de Git reconnaît, vous pouvez lancer :

	$ git config --help

La page de manuel pour `git config` détaille aussi les options disponibles.

### core.editor

Par défaut, Git utilise votre éditeur par défaut ou se replie sur l'éditeur Vi pour la création et l'édition des messages de validation et d'étiquetage.
Pour modifier ce programme par défaut pour un autre, vous pouvez utiliser le paramètre `core.editor` :

	$ git config --global core.editor emacs

Maintenant, quel que soit votre éditeur par défaut, Git démarrera Emacs pour éditer les messages.

### commit.template

Si vous réglez ceci sur le chemin d'un fichier sur votre système, Git utilisera ce fichier comme message par défaut quand vous validez.
Par exemple, supposons que vous créiez un fichier modèle dans `$HOME/.gitmessage.txt` qui ressemble à ceci :

	ligne de sujet

	description

	[ticket: X]

Pour indiquer à Git de l'utiliser pour le message par défaut qui apparaîtra dans votre éditeur quand vous lancerez `git commit`, réglez le paramètre de configuration `commit.template` :

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

Ainsi, votre éditeur ouvrira quelque chose ressemblant à ceci comme modèle de message de validation :

	ligne de sujet

	description

	[ticket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

Si vous avez une règle de messages de validation, placez un modèle de cette règle sur votre système et configurez Git pour qu'il l'utilise par défaut, cela améliorera les chances que cette règle soit effectivement suivie.

### core.pager

Le paramètre `core.pager` détermine quel *pager* est utilisé lorsque des pages de Git sont émises, par exemple lors d'un `log` ou d'un `diff`.
Vous pouvez le fixer à `more` ou à votre *pager* favori (par défaut, il vaut `less`) ou vous pouvez le désactiver en fixant sa valeur à une chaîne vide :

	$ git config --global core.pager ''

Si vous lancez cela, Git affichera la totalité du résultat de toutes les commandes d'une traite, quelle que soit sa longueur.

### user.signingkey

Si vous faîtes des étiquettes annotées signées (comme décrit au chapitre 2), simplifiez-vous la vie en définissant votre clé GPG de signature en paramètre de configuration.
Définissez votre ID de clé ainsi :

	$ git config --global user.signingkey <gpg-key-id>

Maintenant, vous pouvez signer vos étiquettes sans devoir spécifier votre clé à chaque fois que vous utilisez la commande `git tag` :

	$ git tag -s <nom-étiquette>

### core.excludesfile

Comme décrit au chapitre 2, vous pouvez ajouter des patrons dans le fichier `.gitignore` de votre projet pour indiquer à Git de ne pas considérer certains fichiers comme non suivis ou pour éviter de les indexer lorsque vous lancez `git add` sur eux.
Cependant, si vous souhaitez qu'un autre fichier à l'extérieur du projet contienne ces informations ou en avoir d'autres supplémentaires, vous pouvez indiquer à Git où ce fichier se trouve grâce au paramètre `core.excludesfile`.
Fixez-le simplement sur le chemin du fichier qui contient les informations similaires à celles de `.gitignore`.

### help.autocorrect

Si vous avez fait une faute de frappe en tapant une commande dans Git 1.6, il vous affichera une liste de commandes ressemblantes :

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

Si vous positionnez le paramètre `help.autocorrect` à 1, Git lancera automatiquement de lui-même la commande si une seule commande ressemblante a été trouvée.

## Couleurs dans Git

Git sait coloriser ses affichages dans votre terminal, ce qui peut faciliter le parcours visuel des résultats.
Un certain nombre d'options peuvent vous aider à régler la colorisation à votre goût.

### color.ui

Git colorise automatiquement la plupart de ses affichages si vous le lui demandez.
Vous pouvez néanmoins vouloir être plus précis sur ce que vous souhaitez voir colorisé et comment vous le souhaitez.
Pour activer toute la colorisation par défaut, fixez `color.ui` à `true` :

	$ git config --global color.ui true

Avec cette valeur du paramètre, Git colorise sa sortie si celle-ci est destinée à un terminal.
D'autres réglages possibles sont `false` qui désactive complètement la colorisation et `always` qui active la colorisation, même si vous envoyez la commande Git dans un fichier ou l'entrée d'une autre commande.
Ce réglage a été ajouté dans Git 1.5.5.
Si vous avez une version antérieure, vous devrez spécifier les règles de colorisation individuellement.

`color.ui = always` est rarement utile.
Dans la plupart des cas, si vous tenez vraiment à coloriser vos sorties redirigées, vous pourrez passer le drapeau `--color` à la commande Git pour la forcer à utiliser les codes de couleur.
Le réglage `color.ui = true` est donc le plus utilisé.

### `color.*`

Si vous souhaitez être plus spécifique concernant les commandes colorisées ou si vous avez une ancienne version, Git propose des paramètres de colorisation par action.
Chacun peut être fixé à `true`, `false` ou `always`.

	color.branch
	color.diff
	color.interactive
	color.status

De plus, chacun d'entre eux dispose d'un sous-ensemble de paramètres qui permettent de surcharger les couleurs pour des parties des affichages.
Par exemple, pour régler les couleurs de méta-informations du diff avec une écriture en bleu gras (*bold* en anglais) sur fond noir :

	$ git config --global color.diff.meta "blue black bold"

La couleur peut prendre les valeurs suivantes : *normal*, *black*, *red*, *green*, *yellow*, *blue*, *magenta*, *cyan* ou *white*.
Si vous souhaitez ajouter un attribut de casse, les valeurs disponibles sont *bold* (gras), *dim* (léger), *ul* (*underlined*, souligné), *blink* (clignotant) et *reverse* (inversé).

Référez-vous à la page du manuel de `git config` pour tous les sous-réglages disponibles.

## Outils externes de fusion et de différence

Bien que Git ait une implémentation interne de diff que vous avez déjà utilisée, vous pouvez sélectionner à la place un outil externe.
Vous pouvez aussi sélectionner un outil graphique pour la fusion et la résolution de conflit au lieu de devoir résoudre les conflits manuellement.
Je démontrerai le paramétrage avec Perforce Merge Tool (P4Merge) pour visualiser vos différences et résoudre vos fusions parce que c'est un outil graphique agréable et gratuit.

Si vous voulez l'essayer, P4Merge fonctionne sur tous les principaux systèmes d'exploitation.
Dans cet exemple, je vais utiliser la forme des chemins usitée sur Mac et Linux.
Pour Windows, vous devrez changer `/usr/local/bin` en un chemin d'exécution d'un programme de votre environnement.

Vous pouvez télécharger P4Merge ici :

	http://www.perforce.com/perforce/downloads/component.html

Pour commencer, créez un script d'appel externe pour lancer vos commandes.
Je vais utiliser le chemin Mac pour l'exécutable ; dans d'autres systèmes, il résidera où votre binaire `p4merge` a été installé.
Créez un script enveloppe nommé `extMerge` qui appelle votre binaire avec tous les arguments fournis :

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*

L'enveloppe diff s'assure que sept arguments ont été fournis et en passe deux à votre script de fusion.
Par défaut, Git passe au programme de diff les arguments suivants :

	chemin ancien-fichier ancien-hex ancien-mode nouveau-fichier nouveau-hex nouveau-mode

Comme seuls les arguments `ancien-fichier` et `nouveau-fichier` sont nécessaires, vous utilisez le script d'enveloppe pour passer ceux dont vous avez besoin.

	$ cat /usr/local/bin/extDiff
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

Vous devez aussi vous assurer que ces fichiers sont exécutables :

	$ sudo chmod +x /usr/local/bin/extMerge
	$ sudo chmod +x /usr/local/bin/extDiff

À présent, vous pouvez régler votre fichier de configuration pour utiliser vos outils personnalisés de résolution de fusion et de différence.
Pour cela, il faut un certain nombre de personnalisations : `merge.tool` pour indiquer à Git quelle stratégie utiliser, `mergetool.*.cmd` pour spécifier comment lancer cette commande, `mergetool.trustExitCode` pour indiquer à Git si le code de sortie du programme indique une résolution de fusion réussie ou non et `diff.external` pour indiquer à Git quelle commande lancer pour les différences.
Ainsi, vous pouvez lancer les quatre commandes :

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

ou vous pouvez éditer votre fichier `~/.gitconfig` pour y ajouter ces lignes :

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

Après avoir réglé tout ceci, si vous lancez des commandes de diff telles que celle-ci :

	$ git diff 32d1776b1^ 32d1776b1

Au lieu d'obtenir la sortie du diff dans le terminal, Git lance P4Merge, ce qui ressemble à la figure 7-1.


![](http://git-scm.com/figures/18333fig0701-tn.png)

Figure 7-1. L'outil de fusion P4Merge.

Si vous essayez de fusionner deux branches et créez des conflits de fusion, vous pouvez lancer la commande `git mergetool` qui démarrera P4Merge pour vous laisser résoudre les conflits au moyen d'un outil graphique.

Le point agréable avec cette méthode d'enveloppe est que vous pouvez changer facilement d'outils de diff et de fusion.
Par exemple, pour changer vos outils `extDiff` et `extMerge` pour une utilisation de l'outil KDiff3, il vous suffit d'éditer le fichier `extMerge` :

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

À présent, Git va utiliser l'outil KDiff3 pour visualiser les différences et résoudre les conflits de fusion.

Git est livré préréglé avec un certain nombre d'autres outils de résolution de fusion pour vous éviter d'avoir à gérer la configuration `cmd`.
Vous pouvez sélectionner votre outil de fusion parmi `kdiff3`, `opendiff`, `tkdiff`, `meld`, `xxdiff`, `emerge`, `vimdiff` ou `gvimdiff`.
Si KDiff3 ne vous intéresse pas pour gérer les différences mais seulement pour la résolution de fusion et qu'il est présent dans votre chemin d'exécution, vous pouvez lancer :

	$ git config --global merge.tool kdiff3

Si vous lancez ceci au lieu de modifier les fichiers `extMerge` ou `extDiff`, Git utilisera KDif3 pour les résolutions de fusion et l'outil diff normal de Git pour les différences.

## Formatage et espaces blancs

Les problèmes de formatage et de blancs sont parmi les plus subtils et frustrants que les développeurs rencontrent lorsqu'ils collaborent, spécifiquement d'une plate-forme à l'autre.
Il est très facile d'introduire des modifications subtiles de blancs lors de soumission de patchs ou d'autres modes de collaboration, car les éditeurs de textes les insèrent silencieusement ou les programmeurs Windows ajoutent des retours chariot à la fin des lignes qu'il modifient.
Git dispose de quelques options de configuration pour traiter ces problèmes.

### core.autocrlf

Si vous programmez vous-même sous Windows ou si vous utilisez un autre système d'exploitation mais devez travailler avec des personnes travaillant sous Windows, vous rencontrerez à un moment ou à un autre des problèmes de caractères de fin de ligne.
Ceci est dû au fait que Windows utilise pour marquer les fins de ligne dans ses fichiers  un caractère « retour chariot » (*carriage return*, CR) suivi d'un caractère « saut de ligne » (*line feed*, LF), tandis que Mac et Linux utilisent seulement le caractère « saut de ligne ».
C'est un cas subtil mais incroyablement ennuyeux de problème généré par la collaboration inter plate-forme.

Git peut gérer ce cas en convertissant automatiquement les fins de ligne CRLF en LF lorsque vous validez, et inversement lorsqu'il extrait des fichiers sur votre système.
Vous pouvez activer cette fonctionnalité au moyen du paramètre `core.autocrlf`.
Si vous avez une machine Windows, positionnez-le à `true`.
Git convertira les fins de ligne de LF en CRLF lorsque vous extrayerez votre code :

	$ git config --global core.autocrlf true

Si vous utilisez un système Linux ou Mac qui utilise les fins de ligne LF, vous ne souhaitez sûrement pas que Git les convertisse automatiquement lorsque vous extrayez des fichiers.
Cependant, si un fichier contenant des CRLF est accidentellement introduit en version, vous souhaitez que Git le corrige .
Vous pouvez indiquer à Git de convertir CRLF en LF lors de la validation mais pas dans l'autre sens en fixant `core.autocrlf` à `input` :

	$ git config --global core.autocrlf input

Ce réglage devrait donner des fins de ligne en CRLF lors d'extraction sous Windows mais en LF sous Mac et Linux et dans le dépôt.

Si vous êtes un programmeur Windows gérant un projet spécifique à Windows, vous pouvez désactiver cette fonctionnalité et forcer l'enregistrement des « retour chariot » dans le dépôt en réglant la valeur du paramètre à `false` :

	$ git config --global core.autocrlf false

### core.whitespace

Git est paramétré par défaut pour détecter et corriger certains problèmes de blancs.
Il peut rechercher quatre problèmes de blancs de base.
La correction de deux problèmes est activée par défaut et peut être désactivée et celle des deux autres n'est pas activée par défaut mais peut être activée.

Les deux activées par défaut sont `trailing-space` qui détecte les espaces en fin de ligne et `space-before-tab` qui recherche les espaces avant les tabulations au début d'une ligne.

Les deux autres qui sont désactivées par défaut mais peuvent être activées sont `indent-with-non-tab` qui recherche des lignes qui commencent par huit espaces ou plus au lieu de tabulations et `cr-at-eol` qui indique à Git que les « retour chariot » en fin de ligne sont acceptés.

Vous pouvez indiquer à Git quelle correction vous voulez activer en fixant `core.whitespace` avec les valeurs que vous voulez ou non, séparées par des virgules.
Vous pouvez désactiver des réglages en les éliminant de la chaîne de paramétrage ou en les préfixant avec un `-`.
Par exemple, si vous souhaitez activer tout sauf `cr-at-eol`, vous pouvez lancer ceci :

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

Git va détecter ces problèmes quand vous lancez une commande `git diff` et essayer de les coloriser pour vous permettre de les régler avant de valider.
Il utilisera aussi ces paramètres pour vous aider quand vous appliquerez des patchs avec `git apply`.
Quand vous appliquez des patchs, vous pouvez paramétrer Git pour qu'il vous avertisse s'il doit appliquer des patchs qui présentent les défauts de blancs :

	$ git apply --whitespace=warn <patch>

Ou vous pouvez indiquer à Git d'essayer de corriger automatiquement le problème avant d'appliquer le patch :

	$ git apply --whitespace=fix <patch>

Ces options s'appliquent aussi à `git rebase`.
Si vous avez validé avec des problèmes de blancs mais n'avez pas encore poussé en amont, vous pouvez lancer un `rebase` avec l'option `--whitespace=fix` pour faire corriger à Git les erreurs de blancs pendant qu'il réécrit les patchs.

## Configuration du serveur

Il n'y a pas autant d'options de configuration de Git côté serveur, mais en voici quelques unes intéressantes dont il est utile de prendre note.

### receive.fsckObjects

Par défaut, Git ne vérifie pas la cohérence entre les objets qu'on lui pousse.
Bien que Git puisse vérifier que chaque objet correspond bien à sa somme de contrôle et pointe vers des objets valides, il ne le fait pas par défaut sur chaque poussée.
C'est une opération relativement lourde qui peut énormément allonger les poussées selon la taille du dépôt ou de la poussée.
Si vous voulez que Git vérifie la cohérence des objets à chaque poussée, vous pouvez le forcer en fixant le paramètre `receive.fsckObjects` à true :

	$ git config --system receive.fsckObjects true

Maintenant, Git va vérifier l'intégrité de votre dépôt avant que chaque poussée ne soit acceptée pour s'assurer que des clients défectueux n'introduisent pas des données corrompues.

### receive.denyNonFastForwards

Si vous rebasez des *commits* que vous avez déjà poussés, puis essayez de pousser à nouveau, ou inversemement, si vous essayez de pousser un *commit* sur une branche distante qui ne contient pas le *commit* sur lequel la branche distante pointe, votre essai échouera.
C'est généralement une bonne politique, mais dans le cas d'un rebasage, vous pouvez décider que vous savez ce que vous faîtes et forcer la mise à jour de la branche distante en ajoutant l'option `-f` à votre commande.

Pour désactiver la possibilité de forcer la mise à jour des branches distantes autres qu'en avance rapide, réglez `receive.denyNonFastForwards` :

	$ git config --system receive.denyNonFastForwards true

L'autre moyen d'obtenir ce résultat réside dans les crochets de réception côté serveur, qui seront abordés en seconde partie.
Cette approche vous permet de faire des choses plus complexes tel qu'interdire les modifications sans avance rapide à un certain groupe d'utilisateurs.

### receive.denyDeletes

Un contournement possible de la politique `denyNonFastForwards` consiste à effacer la branche puis à la repousser avec ses nouvelles références.
Dans les versions  les plus récentes de Git (à partir de la version 1.6.1), vous pouvez régler `receive.denyDeletes` à true :

	$ git config --system receive.denyDeletes true

Cela interdit totalement l'effacement de branche et d'étiquette.
Aucun utilisateur n'en a le droit.
Pour pouvoir effacer des branches distantes, vous devez effacer manuellement les fichiers de référence sur le serveur.
Il existe aussi des moyens plus intéressants de gérer cette politique utilisateur par utilisateur au moyen des listes de contrôle d'accès, point qui sera abordé à la fin de ce chapitre.
