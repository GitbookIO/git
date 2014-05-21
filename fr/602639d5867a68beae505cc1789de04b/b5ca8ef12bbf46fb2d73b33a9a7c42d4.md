# Développements distribués

À la différence des systèmes de gestion de version centralisés (CVCS), la nature distribuée de Git permet une bien plus grande flexibilité dans la manière dont les développeurs collaborent sur un projet.
Dans les systèmes centralisés, tout développeur est un nœud travaillant de manière plus ou moins égale sur un concentrateur central.
Dans Git par contre, tout développeur est potentiellement un nœud et un concentrateur, c'est-à-dire que chaque développeur peut à la fois contribuer du code vers les autres dépôts et maintenir un dépôt public sur lequel d'autres vont baser leur travail et auquel ils vont contribuer.
Cette capacité ouvre une perspective de modes de développement pour votre projet ou votre équipe dont certains archétypes tirant parti de cette flexibilité seront traités dans les sections qui suivent.
Les avantages et inconvénients éventuels de chaque mode seront traités.
Vous pouvez choisir d'en utiliser un seul ou de mélanger les fonctions de chacun.

## Gestion centralisée

Dans les systèmes centralisés, il n'y a généralement qu'un seul modèle de collaboration, la gestion centralisée.
Un concentrateur ou dépôt central accepte le code et tout le monde doit synchroniser son travail avec.
Les développeurs sont des nœuds, des consommateurs du concentrateur, seul endroit où ils se synchronisent (voir figure 5-1).


![](http://git-scm.com/figures/18333fig0501-tn.png)

Figure 5-1. La gestion centralisée.

Cela signifie que si deux développeurs clonent depuis le concentrateur et qu'ils introduisent tous les deux des modifications, le premier à pousser ses modifications le fera sans encombre.
Le second développeur doit fusionner les modifications du premier dans son dépôt local avant de pousser ses modifications pour ne pas écraser les modifications du premier.
Ce concept reste aussi vrai avec Git qu'il l'est avec Subversion (ou tout autre CVCS) et le modèle fonctionne parfaitement dans Git.

Si votre équipe est petite et que vous êtes déjà habitués à une gestion centralisée dans votre société ou votre équipe, vous pouvez simplement continuer à utiliser cette méthode avec Git.
Mettez en place un dépôt unique et donnez à tous l'accès en poussée.
Git empêchera les utilisateurs d'écraser le travail des autres.
Si un développeur clone le dépôt central, fait des modifications et essaie de les pousser alors qu'un autre développeur à poussé ses modifications dans le même temps, le serveur rejettera les modifications du premier.
Il lui sera indiqué qu'il cherche à pousser des modifications sans mode avance rapide et qu'il ne pourra pas le faire tant qu'il n'aura pas récupéré et fusionné les nouvelles modifications depuis le serveur.
Cette méthode est très intéressante pour de nombreuses personnes car c'est un paradigme avec lequel beaucoup sont familiarisés et à l'aise.

## Mode du gestionnaire d'intégration

Comme Git permet une multiplicité de dépôts distants, il est possible d'envisager un mode de fonctionnement où chaque développeur a un accès en écriture à son propre dépôt public et en lecture à tous ceux des autres.
Ce scénario inclut souvent un dépôt canonique qui représente le projet « officiel ».
Pour commencer à contribuer au projet, vous créez votre propre clone public du projet et poussez vos modifications dessus.
Après, il suffit d'envoyer une demande au mainteneur de projet pour qu'il tire vos modifications dans le dépôt canonique.
Il peut ajouter votre dépôt comme dépôt distant, tester vos modifications localement, les fusionner dans sa branche et les pousser vers le dépôt public.
Le processus se passe comme ceci (voir figure 5-2) :

1. Le mainteneur du projet pousse vers son dépôt public.
2. Un contributeur clone ce dépôt et introduit des modifications.
3. Le contributeur pousse son travail sur son dépôt public.
4. Le contributeur envoie au mainteneur un e-mail de demande pour tirer depuis son dépôt.
5. Le mainteneur ajoute le dépôt du contributeur comme dépôt distant et fusionne localement.
6. Le mainteneur pousse les modifications fusionnées sur le dépôt principal.


![](http://git-scm.com/figures/18333fig0502-tn.png)

Figure 5-2. Le mode du gestionnaire d'intégration.

C'est une gestion très commune sur des sites tels que GitHub où il est aisé de dupliquer un projet et de pousser ses modifications pour les rendre publiques.
Un avantage distinctif de cette approche est qu'il devient possible de continuer à travailler et que le mainteneur du dépôt principal peut tirer les modifications à tout moment.
Les contributeurs n'ont pas à attendre le bon vouloir du mainteneur pour incorporer leurs modifications.
Chaque acteur peut travailler à son rythme.

## Mode dictateur et ses lieutenants

C'est une variante de la gestion multi-dépôt.
En général, ce mode est utilisé sur des projets immenses comprenant des centaines de collaborateurs.
Un exemple connu en est le noyau Linux.
Des gestionnaires d'intégration gèrent certaines parties du projet.
Ce sont les lieutenants.
Tous les lieutenants ont un unique gestionnaire d'intégration, le dictateur bienveillant.
Le dépôt du dictateur sert de dépôt de référence à partir duquel tous les collaborateurs doivent tirer.
Le processus se déroule comme suit (voir figure 5-3) :

1. Les développeurs de base travaillent sur la branche thématique et rebasent leur travail sur master. La branche `master` est celle du dictateur.
2. Les lieutenants fusionnent les branches thématiques des développeurs dans leur propre branche `master`.
3. Le dictateur fusionne les branches master de ses lieutenants dans sa propre branche `master`.
4. Le dictateur pousse sa branche `master` sur le dépôt de référence pour que les développeurs se rebasent dessus.


![](http://git-scm.com/figures/18333fig0503-tn.png)

Figure 5-3. Le processus du dictateur bienveillant.

Ce schéma de processus n'est pas très utilisé mais s'avère utile dans des projets très gros ou pour lesquels un ordre hiérarchique existe, car il permet au chef de projet (le dictateur) de déléguer une grande partie du travail et de collecter de grands sous-ensembles de codes à différents points avant de les intégrer.

Ce sont des schémas de processus rendus possibles et généralement utilisés avec des systèmes distribués tels que Git, mais de nombreuses variations restent possibles pour coller à un flux de modifications donné.
En espérant vous avoir aidé à choisir le meilleur mode de gestion pour votre cas, je vais traiter des exemples plus spécifiques de méthode de réalisation des rôles principaux constituant les différents flux.
