# Travailler avec les branches

Après avoir acquis les bases pour brancher et fusionner, que pouvons-nous ou devons-nous en faire ?
Ce chapitre traite des différents styles de développement que cette gestion de branche légère permet de mettre en place, pour vous aider à décider d'en incorporer une dans votre cycle de développement.

## Branches au long cours

Comme Git utilise une fusion à 3 branches, fusionner une branche dans une autre plusieurs fois sur une longue période est généralement facile.
Cela signifie que vous pouvez travailler sur plusieurs branches ouvertes en permanence pendant plusieurs étapes de votre cycle de développement ; vous pouvez fusionner régulièrement certaines dans d'autres.

De nombreux développeurs utilisent Git avec une méthode qui utilise cette approche, telle que n'avoir que du code entièrement stable et testé dans la branche `master`, voire seulement du code qui a été ou sera publié.
Ils ont une autre branche en parallèle appelée develop ou suite, sur laquelle ils travaillent ou utilisent pour en tester la stabilité — elle n'est pas nécessairement toujours stable, mais quand elle le devient, elle peut être fusionnée dans `master`.
Cette branche est utilisée pour tirer des branches spécifiques à un sujet (branches avec une faible durée de vie, telles que notre branche `prob53`) quand elles sont prêtes, pour s'assurer qu'elles passent l'integralité des tests et n'introduisent pas de bugs.

En réalité, nous parlons de pointeurs qui se déplacent le long des lignes des *commits* réalisés.
Les branches stables sont plus en profondeur dans la ligne de l'historique des *commits* tandis que les branches des derniers développements sont plus en hauteur dans l'historique (voir figure 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)

Figure 3-18. Les branches les plus stables sont généralement plus bas dans l'historique des *commits*.

C'est généralement plus simple d'y penser en terme de silos de tâches, où un ensemble de *commits* évolue vers un silo plus stable quand il a été complètement testé (voir figure 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)

Figure 3-19. Représentation des branches comme des silos.

Vous pouvez reproduire ce schéma sur plusieurs niveaux de stabilité.
Des projets plus gros ont aussi une branche `proposed` ou `pu` (proposed updates) qui permet d'intégrer des branches qui ne sont pas encore prêtes pour la prochaine version ou pour `master`.
L'idée reste que les branches évoluent à différents niveaux de stabilité ; quand elles atteignent un niveau plus stable, elles peuvent être fusionnées dans la branche de stabilité supérieure.
Une fois encore, les branches au long cours ne sont pas nécessaires, mais s'avèrent souvent utiles, spécialement dans le cadre de projets gros ou complexes.

## Les branches thématiques

Les branches thématiques sont tout de même utiles quelle que soit la taille du projet.
Une branche thématique est une branche de courte durée de vie créée et utilisée pour une fonctionnalité ou une tâche particulière.
C'est une manière d'opérer que vous n'avez vraisemblablement jamais utilisée avec un autre VCS parce qu'il est généralement trop lourd de créer et fusionner des branches.
Mais dans Git, créer, développer, fusionner et effacer des branches plusieurs fois par jour est monnaie courante.

Vous l'avez remarqué dans la section précédente avec les branches `prob53` et `correctif` que vous avez créées.
Vous avez réalisé quelques validations sur elles et vous les avez effacées juste après les avoir fusionnées dans votre branche principale.
Cette technique vous permet de basculer de contexte complètement et immédiatement.
Il est beaucoup plus simple de réaliser des revues de code parce que votre travail est isolé dans des silos où toutes les modifications sont liées au sujet .
Vous pouvez entreposer vos modifications ici pendant des minutes, des jours ou des mois, puis les fusionner quand elles sont prêtes, indépendamment de l'ordre dans lequel elles ont été créées ou développées.

Supposons un exemple où pendant un travail (sur `master`), vous branchiez pour un problème (`prob91`), travailliez un peu dessus, vous branchiez une seconde branche pour essayer de trouver une autre manière de le résoudre (`prob91v2`), vous retourniez sur la branche `master` pour y travailler pendant un moment, pour finalement brancher sur une dernière branche (`ideeidiote`) contenant une idée dont vous doutez.
Votre historique de *commit* pourrait ressembler à la figure 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)

Figure 3-20. Votre historique de *commit* avec de multiples branches thématiques.

Maintenant, supposons que vous décidiez que vous préférez la seconde solution pour le problème (`prob91v2`) et que vous ayez montré la branche `ideeidiote` à vos collègues qui vous ont dit qu'elle était géniale.
Vous pouvez jeter la branche `prob91` originale (en effaçant les *commits* C5 et C6) et fusionner les deux autres.
Votre historique ressemble à présent à la figure 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)

Figure 3-21. Votre historique après la fusion de `ideeidiote` et `prob91v2`.

Souvenez-vous que lors de la réalisation de ces actions, toutes ces branches sont complètement locales.
Lorsque vous branchez et fusionnez, tout est réalisé dans votre dépôt Git.
Aucune communication avec un serveur n'a lieu.
