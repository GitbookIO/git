# Les tripes de Git

Vous êtes peut-être arrivé à ce chapitre en en sautant certains ou après avoir parcouru tout le reste du livre.
Dans tous les cas, c'est ici que l'on parle du fonctionnement interne et de la mise en œuvre de Git.
Pour moi, leur apprentissage a été fondamental pour comprendre à quel point Git est utile et puissant, mais d'autres soutiennent que cela peut être source de confusion et être trop complexe pour les débutants.
J'en ai donc fait le dernier chapitre de ce livre pour que vous puissiez le lire tôt ou tard lors de votre apprentissage.
Je vous laisse le choix.

Maintenant que vous êtes ici, commençons.
Tout d'abord et même si ce n'est pas clair tout de suite, Git est fondamentalement un système de fichiers adressables par contenu (*content-addressable filesystem*) avec l'interface utilisateur d'un VCS au-dessus.
Vous en apprendrez plus à ce sujet dans quelques instants.

Aux premiers jours de Git (surtout avant la version 1.5), l'interface utilisateur était beaucoup plus complexe, car elle était centrée sur le système de fichier plutôt que sur l'aspect VCS.
Ces dernières années, l'interface utilisateur a été peaufinée jusqu'à devenir aussi cohérente et facile à utiliser que n'importe quel autre système.
Pour beaucoup, l'image du Git des débuts avec son interface utilisateur complexe et difficile à apprendre est toujours présente.
La couche système de fichiers adressables par contenu est vraiment géniale et j'en parlerai dans ce chapitre.
Ensuite, vous apprendrez les mécanismes de transport/transmission/communication ainsi que les tâches que vous serez amené à accomplir pour maintenir un dépôt.
