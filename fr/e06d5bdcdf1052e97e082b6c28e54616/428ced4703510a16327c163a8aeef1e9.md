# Plomberie et porcelaine

Ce livre couvre l'utilisation de Git avec une trentaine de verbes comme `checkout`, `branch`, `remote`...
Mais, puisque Git était initialement une boîte à outils (*toolkit*) pour VCS, plutôt qu'un VCS complet et convivial, il dispose de tout un ensemble d'actions pour les tâches bas niveau qui étaient conçues pour être liées dans le style UNIX ou appelées depuis des scripts.
Ces commandes sont dites commandes de « plomberie » (*plumbing*) et les autres, plus conviviales sont appelées « porcelaines » (*porcelain*).

Les huit premiers chapitres du livre concernent presque exclusivement les commandes porcelaine.
Par contre, dans ce chapitre, vous serez principalement confronté aux commandes de plomberie bas niveau, car elles vous donnent accès au fonctionnement interne de Git et aident à montrer comment et pourquoi Git fonctionne comme il le fait.
Ces commandes ne sont pas faites pour être utilisées à la main sur une ligne de commande, mais sont plutôt utilisées comme briques de base pour écrire de nouveaux outils et scripts personnalisés.

Quand vous exécutez `git init` dans un nouveau répertoire ou un répertoire existant, Git crée un répertoire `.git` qui contient presque tout ce que Git stocke et manipule.
Si vous voulez sauvegarder ou cloner votre dépôt, copier ce seul répertoire suffirait presque.
Ce chapitre traite principalement de ce que contient ce répertoire.
Voici à quoi il ressemble :

	$ ls
	HEAD
	branches/
	config
	description
	hooks/
	index
	info/
	objects/
	refs/

Vous y verrez sans doute d'autres fichiers, mais ceci est un dépôt qui vient d'être crée avec `git init` et c'est ce que vous verrez par défaut.
Le répertoire `branches` n'est pas utilisé par les versions récentes de Git et le fichier `description` est utilisé uniquement par le programme GitWeb, il ne faut donc pas s'en soucier.
Le fichier `config` contient les options de configuration spécifiques à votre projet et le répertoire `info` contient un fichier listant les motifs que vous souhaitez ignorer et que vous ne voulez pas mettre dans un fichier `.gitignore`.
Le répertoire `hooks` contient les scripts de procédures automatiques côté client ou serveur, ils sont décrits en détail dans le chapitre 7.

Il reste quatre éléments importants : les fichiers `HEAD` et `index`, ainsi que les répertoires `objects` et `refs`.
Ce sont les composants principaux d'un dépôt Git.
Le répertoire `objects` stocke le contenu de votre base de données, le répertoire `refs` stocke les pointeurs vers les objets *commit* de ces données (branches), le fichier `HEAD` pointe sur la branche qui est en cours dans votre répertoire de travail (*checkout*) et le fichier `index` est l'endroit où Git stocke les informations sur la zone d'attente.
Vous allez maintenant plonger en détail dans chacune de ces sections et voir comment Git fonctionne.
