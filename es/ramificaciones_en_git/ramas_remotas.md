# Ramas Remotas

Las ramas remotas son referencias al estado de ramas en tus repositorios remotos. Son ramas locales que no puedes mover;  se mueven automáticamente cuando estableces comunicaciones en la red. Las ramas remotas funcionan como marcadores, para recordarte en qué estado se encontraban tus repositorios remotos la última vez que conectaste con ellos.

Suelen referenciarse como '(remoto)/(rama)'. Por ejemplo, si quieres saber cómo estaba la rama 'master' en el remoto 'origin'. Puedes revisar la rama 'origin/master'. O si estás trabajando en un problema con un compañero y este envia (push) una rama 'iss53', tu tendrás tu propia rama de trabajo local 'iss53'; pero la rama en el servidor apuntará a la última confirmación (commit) en la rama 'origin/iss53'.

Esto puede ser un tanto confuso, pero intentemos aclararlo con un ejemplo.  Supongamos que tienes un sevidor Git en tu red, en 'git.ourcompany.com'. Si haces un clón desde ahí, Git automáticamente lo denominará 'origin', traerá (pull) sus datos, creará un apuntador hacia donde esté en ese momento su rama 'master', denominará la copia local 'origin/master'; y será inamovible para tí.  Git te proporcionará también tu propia rama 'master', apuntando al mismo lugar que la rama 'master' de 'origin'; siendo en esta última donde podrás trabajar.


![](http://git-scm.com/figures/18333fig0322-tn.png)
 
Figura 3-22. Un clón Git te proporciona tu propia rama 'master' y otra rama 'origin/master' apuntando a la rama 'master' original.

Si haces algún trabajo en tu rama 'master' local, y al mismo tiempo, alguna otra persona lleva (push) su trabajo al servidor 'git.ourcompany.com', actualizando la rama 'master' de allí, te encontrarás con que ambos registros avanzan de forma diferente. Además, mientras no tengas contacto con el servidor, tu apuntador a tu rama 'origin/master' no se moverá (ver Figura 3/23).


![](http://git-scm.com/figures/18333fig0323-tn.png)
 
Figura 3-23. Trabajando localmente y que otra persona esté llevando (push) algo al servidor remoto, hace que cada registro avance de forma distinta.

Para sincronizarte, puedes utilizar el comando 'git fetch origin'. Este comando localiza en qué servidor está el origen (en este caso 'git.ourcompany.com'), recupera cualquier dato presente allí que tu no tengas, y actualiza tu base de datos local, moviendo tu rama 'origin/master' para que apunte a esta nueva y más reciente posición (ver Figura 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)
 
Figura 3-24. El comando 'git fetch' actualiza tus referencias remotas.

Para ilustrar mejor el caso de tener múltiples servidores y cómo van las ramas remotas para esos proyectos remotos. Supongamos que tienes otro servidor Git; utilizado solamente para desarrollo, por uno de tus equipos sprint. Un servidor en 'git.team1.ourcompany.com'. Puedes incluirlo como una nueva referencia remota a tu proyecto actual, mediante el comando 'git remote add', tal y como vimos en el capítulo 2. Puedes denominar 'teamone' a este remoto, poniendo este nombre abreviado para la URL (ver Figura 3-25)


![](http://git-scm.com/figures/18333fig0325-tn.png)
 
Figura 3-25. Añadiendo otro servidor como remoto.

Ahora, puedes usar el comando 'git fetch teamone' para recuperar todo el contenido del servidor que tu no tenias. Debido a que dicho servidor es un subconjunto de de los datos del servidor 'origin' que tienes actualmente, Git no recupera (fetch) ningún  dato; simplemente prepara una rama remota llamada 'teamone/master' para apuntar a la confirmación (commit) que 'teamone' tiene en su rama 'master'.


![](http://git-scm.com/figures/18333fig0326-tn.png)
 
Figura 3-26. Obtienes una referencia local a la posición en la rama 'master' de 'teamone'.

## Publicando

Cuando quieres compartir una rama con el resto del mundo, has de llevarla (push) a un remoto donde tengas permisos de escritura. Tus ramas locales no se sincronizan automáticamente con los remotos en los que escribes. Sino que tienes que llevar (push) expresamente, cada vez, al remoto las ramas que desees compartir. De esta forma, puedes usar ramas privadas para el trabajo que no deseas compartir. Llevando a un remoto tan solo aquellas partes que deseas aportar a los demás.

Si tienes una rama llamada 'serverfix', con la que vas a trabajar en colaboración; puedes llevarla al remoto de la misma forma que llevaste tu primera rama. Con el comando 'git push (remoto) (rama)':

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Esto es un poco como un atajo. Git expande automáticamente el nombre de rama 'serverfix' a 'refs/heads/serverfix:refs/heads/serverfix', que significa: "coge mi rama local 'serverfix' y actualiza con ella la rama 'serverfix' del remoto". Volveremos más tarde sobre el tema de 'refs/heads/', viendolo en detalle en el capítulo 9; aunque puedes ignorarlo por ahora. También puedes hacer 'git push origin serverfix:serverfix', que hace lo mismo; es decir: "coge mi 'serverfix' y hazlo el 'serverfix' remoto". Puedes utilizar este último formato para llevar una rama local a una rama remota con otro nombre distinto. Si no quieres que se llame 'serverfix' en el remoto, puedes lanzar, por ejemplo, 'git push origin serverfix:awesomebranch'; para llevar tu rama 'serverfix' local a la rama 'awesomebranch' en el proyecto remoto.

La próxima vez que tus colaboradores recuperen desde el servidor, obtendrán una referencia a donde la versión de 'serverfix' en el servidor esté bajo la rama remota 'origin/serverfix':

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

Es importante destacar que cuando recuperas (fetch) nuevas ramas remotas, no obtienes automáticamente una copia editable local de las mismas. En otras palabras, en este caso, no tienes una nueva rama 'serverfix'. Sino que únicamente tienes un puntero no editable a 'origin/serverfix'.

Para integrar (merge) esto en tu actual rama de trabajo, puedes usar el comando 'git merge origin/serverfix'. Y si quieres tener tu propia rama 'serverfix', donde puedas trabajar, puedes crearla directamente basandote en rama remota:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"Switched to a new branch "serverfix"

Esto sí te da una rama local donde puedes trabajar, comenzando donde 'origin/serverfix' estaba en ese momento.

## Haciendo seguimiento a las ramas

Activando (checkout) una rama local a partir de una rama remota, se crea automáticamente lo que podríamos denominar "una rama de seguimiento" (tracking branch). Las ramas de seguimiento son ramas locales que tienen una relación directa con alguna rama remota. Si estás en una rama de seguimiento y tecleas el comando 'git push', Git sabe automáticamente a qué servidor y a qué rama ha de llevar los contenidos. Igualmente, tecleando 'git pull' mientras estamos en una de esas ramas, recupera (fetch) todas las referencias remotas y las consolida (merge) automáticamente en la correspondiente rama remota.

Cuando clonas un repositorio, este suele crear automáticamente una rama 'master' que hace seguimiento de 'origin/master'. Y es por eso que 'git push' y 'git pull' trabajan directamente, sin necesidad de más argumentos. Sin embargo, puedes preparar otras ramas de seguimiento si deseas tener unas que no hagan seguimiento de ramas en 'origin' y que no sigan a la rama 'master'. El ejemplo más simple, es el que acabas de ver al lanzar el comando 'git checkout -b [rama] [nombreremoto]/[rama]'. Si tienes la versión 1.6.2 de Git, o superior, puedes utilizar también el parámetro '--track':

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"Switched to a new branch "serverfix"

Para preparar una rama local con un nombre distinto a la del remoto, puedes utilizar:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "sf"

Así, tu rama local 'sf' va a llevar (push) y traer (pull) hacia o desde 'origin/serverfix'.

## Borrando ramas remotas

Imagina que ya has terminado con una rama remota. Es decir, tanto tu como tus colaboradores habeis completado una determinada funcionalidad y la habeis incorporado (merge) a la rama 'master' en el remoto (o donde quiera que tengais la rama de código estable). Puedes borrar la rama remota utilizando la un tanto confusa sintaxis:  'git push [nombreremoto] :[rama]'. Por ejemplo, si quieres borrar la rama 'serverfix' del servidor, puedes utilizar:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Y....Boom!. La rama en el servidor ha desaparecido. Puedes grabarte a fuego esta página, porque necesitarás ese comando y, lo más probable es que hayas olvidado su sintaxis. Una manera de recordar este comando es dándonos cuenta de que proviene de la sintaxis 'git push [nombreremoto] [ramalocal]:[ramaremota]'. Si omites la parte '[ramalocal]', lo que estás diciendo es: "no cojas nada de mi lado y haz con ello [ramaremota]".
