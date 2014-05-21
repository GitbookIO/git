# Crochets Git

Comme de nombreux autres systèmes de gestion de version, Git dispose d'un moyen de lancer des scripts personnalisés quand certaines actions importantes ont lieu.
Il y a deux groupes de crochets : ceux côté client et ceux côté serveur.
Les crochets côté client concernent les opérations de client telles que la validation et la fusion.
Les crochets côté serveur concernent les opérations de serveur Git telles que la réception de *commits*.
Vous pouvez utiliser ces crochets pour toutes sortes de raisons dont nous allons détailler quelques unes.

## Installation d'un crochet

Les crochets sont tous stockés dans le sous-répertoire `hooks` du répertoire Git.
Dans la plupart des projets, c'est `.git/hooks`.
Par défaut, Git popule ce répertoire avec quelques scripts d'exemple déjà utiles par eux-mêmes ; mais ils servent aussi de documentation sur les paramètres de chaque script.
Tous les exemples sont des scripts shell avec un peu de Perl mais n'importe quel script exécutable nommé correctement fonctionnera. Vous pouvez les écrire en Ruby ou Python ou ce que vous voudrez.
Pour les versions de Git postérieures à 1.6, ces fichiers crochet d'exemple se terminent en `.sample` et il faudra les renommer.
Pour les versions de Git antérieures à 1.6, les fichiers d'exemple sont nommés correctement mais ne sont pas exécutables.

Pour activer un script de crochet, placez un fichier dans le sous-répertoire `hook` de votre répertoire Git, nommé correctement et exécutable.
À partir de ce moment, il devrait être appelé.
Abordons donc les noms de fichiers de crochet les plus importants.

## Crochets côté client

Il y a de nombreux crochets côté client.
Ce chapitre les classe entre crochets de traitement de validation, scripts de traitement par e-mail et le reste des scripts côté client.

### Crochets de traitement de validation

Les quatre premiers crochets ont trait au processus de validation.
Le crochet `pre-commit` est lancé en premier, avant même que vous ne saisissiez le message de validation.
Il est utilisé pour inspecter l'instantané qui est sur le point d'être validé, pour vérifier si vous avez oublié quelque chose, pour s'assurer que les tests passent ou pour examiner ce que vous souhaitez inspecter dans le code.
Un code de sortie non nul de ce crochet annule la validation, bien que vous puissiez le contourner avec `git commit --no-verify`.
Vous pouvez réaliser des actions telles qu'une vérification de style (en utilisant lint ou un équivalent), d'absence de blancs en fin de ligne (le crochet par défaut fait exactement cela) ou de documentation des nouvelles méthodes.

Le crochet `prepare-commit-msg` est appelé avant que l'éditeur de message de validation ne soit lancé après que le message par défaut a été créé.
Il vous permet d'éditer le message par défaut avant que l'auteur ne le voit.
Ce crochet accepte quelques options : le chemin du fichier qui contient le message de validation actuel, le type de validation et le SHA-1 du *commit* si c'est un *commit* amendé.
Ce crochet ne sert généralement à rien pour les validations normales.
Par contre, il est utile pour les validations où le message par défaut est généré, tel que les modèles de message de validation, les validations de fusion, les *commits* écrasés ou amendés.
Vous pouvez l'utiliser en conjonction avec un modèle de messages pour insérer de l'information par programme.

Le crochet `commit-msg` accepte un paramètre qui est encore le chemin du fichier temporaire qui contient le message de validation actuel.
Si ce script rend un code de sortie non nul, Git abandonne le processus de validation, ce qui vous permet de vérifier l'état de votre projet ou du message de validation avant de laisser passer un *commit*.
Dans la dernière section de ce chapitre, l'utilisation de ce crochet permettra de vérifier que le message de validation est conforme à un format obligatoire.

Après l'exécution du processus complet de validation, le crochet `post-commit` est appelé.
Il n'accepte aucun argument mais vous pouvez facilement accéder au dernier *commit* grâce à `git log -1 HEAD`.
Généralement, ce script sert à réaliser des notifications ou des choses similaires.

Les scripts de gestion de validation côté client peuvent être utilisés pour n'importe quelle méthode de travail.
Ils sont souvent utilisés pour mettre en œuvre certaines politiques, bien qu'il faille noter que ces scripts ne sont pas transférés lors d'un clonage.
Vous pouvez faire appliquer les politiques de gestion au niveau serveur pour rejeter les poussées de *commits* qui ne sont pas conformes à certaines règles, mais il reste complètement du ressort du développeur de les utiliser côté client.
Ce sont des scripts destinés à aider les développeurs et ils doivent être mis en place et maintenus par ces derniers qui peuvent tout aussi bien les outrepasser ou les modifier à tout moment.

### Crochets de gestion e-mail

Vous pouvez régler trois crochets côté client pour la gestion à base d'e-mail.
Ils sont tous invoqués par la commande `git am`, donc si vous n'êtes pas habitués à utiliser cette commande dans votre mode de gestion, vous pouvez simplement passer la prochaine section.
Si vous acceptez des patchs préparés par `git format-patch` par e-mail, alors certains de ces crochets peuvent vous être très utiles.

Le premier crochet lancé est `applypatch-msg`.
Il accepte un seul argument : le nom du fichier temporaire qui contient le message de validation proposé.
Git abandonne le patch si ce script sort avec un code non nul.
Vous pouvez l'utiliser pour vérifier que la message de validation est correctement formaté ou pour normaliser le message en l'éditant sur place par script.

Le crochet lancé ensuite lors de l'application de patchs via `git am` s'appelle `pre-applypatch`.
Il n'accepte aucun argument et est lancé après que le patch a été appliqué, ce qui vous permet d'inspecter l'instantané avant de réaliser la validation.
Vous pouvez lancer des tests ou inspecter l'arborescence active avec ce script.
S'il manque quelque chose ou que les tests ne passent pas, un code de sortie non nul annule la commande `git am` sans valider le patch.

Le dernier crochet lancé pendant l'opération `git am` s'appelle `post-applypatch`.
Vous pouvez l'utiliser pour notifier un groupe ou l'auteur du patch que vous venez de l'appliquer.
Vous ne pouvez plus arrêter le processus de validation avec ce script.

### Autres crochets côté client

Le crochet `pre-rebase` est invoqué avant que vous ne rebasiez et peut interrompre le processus s'il sort avec un code d'erreur non nul.
Vous pouvez utiliser ce crochet pour empêcher de rebaser tout *commit* qui a déjà été poussé.
C'est ce que fait le crochet d'exemple `pre-rebase` que Git installe, même s'il considère que la branche cible de publication s'appelle `next`.
Il est très probable que vous ayez à changer ce nom pour celui que vous utilisez réellement en branche publique stable.

Après avoir effectué avec succès un `git checkout`, la crochet `post-chechout` est lancé.
Vous pouvez l'utiliser pour paramétrer correctement votre environnement projet dans votre copie de travail.
Cela peut signifier y déplacer des gros fichiers binaires que vous ne souhaitez pas voir en gestion de source, générer automatiquement la documentation ou quelque chose dans le genre.

Enfin, le crochet `post-merge` s'exécute à la suite d'une commande `merge` réussie.
Vous pouvez l'utiliser pour restaurer certaines données non gérées par Git dans le copie de travail telles que les informations de permission.
Ce crochet permet même de valider la présence de fichiers externes au contrôle de Git que vous souhaitez voir recopiés lorsque la copie de travail change.

## Crochets côté serveur

En complément des crochets côté client, vous pouvez utiliser comme administrateur système quelques crochets côté serveur pour appliquer quasiment toutes les règles de votre projet.
Ces scripts s'exécutent avant et après chaque poussée sur le serveur.
Les crochets `pre` peuvent rendre un code d'erreur non nul à tout moment pour rejeter la poussée et afficher un message d'erreur au client.
Vous pouvez mettre en place des règles aussi complexes que nécessaire.

### pre-receive et post-receive

Le premier script lancé lors de la gestion d'une poussée depuis un client est `pre-receive`.
Il accepte une liste de références lues sur *stdin*.
S'il sort avec un code d'erreur non nul, aucune n'est acceptée.
Vous pouvez utiliser ce crochet pour réaliser des tests tels que s'assurer que toutes les références mises à jour le sont en avance rapide ou pour s'assurer que l'utilisateur dispose bien des droits de création, poussée, destruction ou de lecture des mises à jour pour tous les fichiers qu'il cherche à mettre à jour dans cette poussée.

Le crochet `post-receive` est lancé après l'exécution complète du processus et peut être utilisé pour mettre à jour d'autres services ou pour notifier des utilisateurs.
Il accepte les mêmes données sur *stdin* que `pre-receive`.
Il peut par exemple envoyer un e-mail à une liste de diffusion, notifier un serveur d'intégration continue ou mettre à jour un système de suivi de tickets.
Il peut aussi analyser les messages de validation à la recherche d'ordres de mise à jour de l'état des tickets.
Ce script ne peut pas arrêter le processus de poussée mais le client n'est pas déconnecté tant qu'il n'a pas terminé.
Il faut donc être prudent à ne pas essayer de lui faire réaliser des actions qui peuvent durer longtemps.

### update

Le script `update` est très similaire au script `pre-receive`, à la différence qu'il est lancé une fois par branche qui doit être modifiée lors de la poussée.
Si la poussée s'applique à plusieurs branches, `pre-receive` n'est lancé qu'une fois, tandis qu'`update` est lancé une fois par branche impactée.
Au lieu de lire à partir de stdin, ce script accepte trois arguments : le nom de la référence (branche), le SHA-1 du *commit* pointé par la référence avant la poussée et le SHA-1 que l'utilisateur est en train de pousser.
Si le script `update` se termine avec un code d'erreur non nul, seule la référence est rejetée.
Les autres références pourront être mises à jour.
