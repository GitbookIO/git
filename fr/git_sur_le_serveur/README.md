# Git sur le serveur

À présent, vous devriez être capable de réaliser la plupart des tâches quotidiennes impliquant Git.
Néanmoins, pour pouvoir collaborer avec d'autres personnes au moyen de Git, vous allez devoir disposer d'un dépôt distant Git.
Bien que vous puissiez techniquement tirer et pousser des modifications depuis et vers des dépôts personnels, cette pratique est déconseillée parce qu'elle introduit très facilement une confusion avec votre travail actuel.
De plus, vous souhaitez que vos collaborateurs puissent accéder à votre dépôt de sources, y compris si vous n'êtes pas connecté — disposer d'un dépôt accessible en permanence peut s'avérer utile.
De ce fait, la méthode canonique pour collaborer consiste à instancier un dépôt intermédiaire auquel tous ont accès, que ce soit pour pousser ou tirer.
Nous nommerons ce dépôt le « serveur Git » mais vous vous apercevrez qu'héberger un serveur de dépôt Git ne consomme que peu de ressources et qu'en conséquence, on n'utilise que rarement une machine dédiée à cette tâche.

Un serveur Git est simple à lancer.
Premièrement, vous devez choisir quels protocoles seront supportés.
La première partie de ce chapitre traite des protocoles disponibles et de leurs avantages et inconvénients.
La partie suivante explique certaines configurations typiques avec ces protocoles et comment les mettre en œuvre.
Enfin, nous traiterons de quelques types d'hébergement, si vous souhaitez héberger votre code sur un serveur tiers, sans avoir à installer et maintenir un serveur par vous-même.

Si vous ne voyez pas d'intérêt à gérer votre propre serveur, vous pouvez sauter directement à la dernière partie de ce chapitre pour détailler les options pour mettre en place un compte hébergé, avant de continuer dans le chapitre suivant où les problématiques de développement distribué sont abordées.

Un dépôt distant est généralement un _dépôt nu_ (*bare repository*), un dépôt Git qui n'a pas de copie de travail.
Comme ce dépôt n'est utilisé que comme centralisateur de collaboration, il n'y a aucune raison d'extraire un instantané sur le disque ; seules les données Git sont nécessaires.
Pour simplifier, un dépôt nu est le contenu du répertoire `.git` sans fioriture.
