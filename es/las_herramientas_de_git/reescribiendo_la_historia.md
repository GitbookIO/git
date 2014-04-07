# Reescribiendo la historia

Por razones varias, hay ocasiones en que se desea revisar el historial de confirmaciones de cambio. Una de las grandes caracteristicas de Git es su capacidad de postponer las decisiones hasta el último momento. Las decisiones sobre qué archivos van en qué confirmaciones de cambio se toman justo inmediatamente antes de confirmar, utilizando para ello el área de preparación (staging area). En cualquier momento se puede decidir dejar de trabajar en una cierta vía y arrancar en otra, utilizando el comando de guardado rápido (stash). Y también es posible reescribir confirmaciones de cambio ya realizadas, para que se muestren como si hubieran sido realizadas de otra forma. Así, es posible cambiar el orden de las confirmaciones, cambiar sus mensajes, modificar los archivos comprendidos en ellas, juntar varias confirmaciones en una sola, partir una en varias,o incluso borrar alguna completamente. --Aunque todo ello es siempre recomendable hacerlo solo antes de compartir nuestro trabajo con otros.--

En esta sección, se verá cómo realizar todas esas útiles tareas. De tal forma que se pueda dejar el historial de cambios exactamente tal y como se desee. Eso sí, siempre antes de compartirlo con otros desarrolladores.

## Modificar la última confirmación de cambios

Modificar la última confirmación de cambios (commit) es probablemente el arreglo realizado con más frecuencia. Dos suelen ser los cambios básicos a realizar: cambiar el mensaje o cambiar los archivos añadidos, modificados o borrados.

Cambiar el mensaje de la última confirmación de cambios, es muy sencillo:

	$ git commit --amend

Mediante este comando, el editor de textos arranca con el mensaje escrito en la última confirmación de cambios; listo para ser modificado. Al guardar y cerrar en el editor, este escribe una nueva confirmación de cambios y reemplaza con ella la última confirmación existente.

Si se desea cambiar la instantánea (snapshot) de archivos en la última confirmación de cambios, habitualmente por haber tenido algún descuido al añadir algún archivo de reciente creación. El proceso a seguir es básicamente el mismo. Se preparan en el área de preparación los archivos deseados; con los comandos `git add` o `git rm`, según corresponda. Y, a continuación, se lanza el comando `git commit --amend`. Este tendrá en cuenta dicha preparación para rehacer la instantánea de archivos en la nueva confirmación de cambios. 

Es importante ser cuidadoso con esta técnica. Porque al modifcar cualquier confirmación de cambios, cambia también su código SHA-1. Es como si se realizara una pequeña reorganización (rebase). Y, por tanto, aquí también se aplica la regla de no modificar nunca una confirmación de cambios que ya haya sido enviada (push) a otros.

## Modificar múltiples confirmaciones de cambios

Para modificar una confirmación de cambios situada bastante atrás en el historial, es necesario emplear herramientas más complejas. Git no dispone de herramientas directas para modifica el historial de confirmaciones de cambio. Pero es posible emplear la herramienta de reorganización (rebase) para modificar series de confirmaciones; en la propia cabeza (HEAD) donde estaban basadas originalmente, en lugar de moverlas a otra distinta. Dentro de la herramienta de reorganización interactiva, es posible detenerse justo tras cada confirmación de cambios a modificar. Para cambiar su mensaje, añadir archivos, o cualquier otra modificación. Este modo interactivo se activa utilizando la opción `-i` en el comando `git rebase`.  La profundidad en la historia a modificar vendrá dada por la confirmación de cambios (commit) que se indique al comando.

Por ejemplo, para modificar las tres últimas confirmaciones de cambios, se  indicara el padre de la última conformación a modificar, es decir habrá que escribir `HEAD~2^` or `HEAD~3` tras el comando `git rebase -i`. La nomenclatura  `~3` es la mas sencilla de recordar, porque lo que se desea es modificar las tres últimas confirmaciones. Pero sin perder de vista que realmente se está señalando a cuatro confirmaciones de cambio más atras, al padre de la última de las confirmaciones de cambio a modificar. 

	$ git rebase -i HEAD~3

Es importante avisar de nuevo que se trata de un comando de reorganización: todas y cada una de las confirmaciones de cambios en el rango `HEAD~3..HEAD` van a ser reescritas, (cambia su código SHA-1), tanto si se modifica algo en ellas como si no. Por tanto, es importante no afectar a ninguna confirmación de cambios que haya sido ya enviada (push) a un servidor central. So pena de confundir a otros desarrolladores, a los cuales se estaria dando una versión alternativa de un mismo cambio.

Al lanzar este comando, se verán una lista de confirmaciones de cambio en la pantalla del editor de textos:

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-filepick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

	# Rebase 710f0f8..a5f4a0d onto 710f0f8
	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	###

Es importante destacar que esas confirmaciones de cambios se han listado en el orden opuesto al que normalmente son mostradas en el comando `log`.  En este último, se suele ver algo así como:

	$ git log --pretty=format:"%h %s" HEAD~3..HEAD
	a5f4a0d added cat-file
	310154e updated README formatting and added blame
	f7f3f6d changed my name a bit

Prestar atención al orden inverso. La reorganización interactiva lanza un script. Un script que, comenzando por la confirmación de cambios indicada en la línea del comando (`HEAD~3`), va a reaplicar los cambios introducidos en cada una de las confirmaciones, desde arriba hasta abajo. En la lista se ven las mas antiguas encima, en lugar de las más recientes, precisamente porque esas van a ser las primeras en reaplicarse.

Para que el script se detenga en cada confirmación de cambios a modificar, hay que editarlo. Y se ha de cambiar la palabra 'pick' por la palabra 'edit' en cada una de las confirmaciones de cambio donde se desee detener el script. Por ejemplo, para modificar solo el mensaje de la tercera confirmación de cambios, el script quedaria:

	edit f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Cuando se guarde y cierre en el editor, Git hará un rebobinado hacia atras hasta la última de las confirmaciones de cambios en la lista, y mostrará algo así como:

	$ git rebase -i HEAD~3
	Stopped at 7482e0d... updated the gemspec to hopefully work better
	You can amend the commit now, with

	       git commit --amend

	Once you’re satisfied with your changes, run

	       git rebase --continue

Estas instrucciones indican exactamente lo que se ha de realizar. Teclear

	$ git commit --amend

Cambiar el mensaje de la confirmación de cambios y salir del editor. Para luego lanzar

	$ git rebase --continue

Las otras dos confirmaciones de cambio serán reaplicadas automáticamene. Y ya estará completa la reorganización. Si se ha cambiado 'pick' por 'edit' en más de una línea, estos pasos se habrán de repetir por cada una de las confirmaciones de cambios a modificar. En cada una de ellas, Git se detendrá, permitiendo enmendar la confirmación de cambios y continuar tras la modificación.

## Reordenar confirmaciones de cambios

Las reorganizaciones interactivas también se pueden emplear para reordenar o para eliminar completamente ciertas confirmaciones de cambios (commits). Por ejemplo, si se desea eliminar la confirmación de "added cat-file" y cambiar el orden en que se han introducido las otras dos confirmaciones de cambios, el script de reorganización pasaría de ser:

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-filepick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

a quedar en algo como:

	pick 310154e updated README formatting and added blame
	pick f7f3f6d changed my name a bit

Cuando se guarde y salga en el editor, Git rebobinará la rama hasta el padre de las confirmaciones de cambio indicadas, reaplicará `310154e` y luego `f7f3f6d`, para finalmente detenerse. De esta forma se habrá cambiado el orden de las dos confirmaciones de cambio, y se habrá eliminado completamente la de "added cat-file".

## Combinar varias confirmaciones en una sola

Con la herramienta de reorganización interactiva, es posible recombinar una serie de confirmaciones de cambio y agruparlas todas en una sola. El propio script indica las instrucciones a seguir:

	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	###

Si, en lugar de 'pick' o de 'edit', se indica 'squash' delante de alguna de las confirmaciones de cambio, Git aplicará simultáneamente dicha confirmación y la que esté inmediatamente delante de ella.  Permitiendo también combinar los mensajes de ambas. Por ejemplo, si se desea hacer una única confirmación de cambios fusionando las tres, el script quedaría en algo como:

	pick f7f3f6d changed my name a bit
	squash 310154e updated README formatting and added blame
	squash a5f4a0d added cat-file

Cuando se guarde y salga en el editor, Git rebobinará la historia, reaplicará las tres confirmaciones de cambio, y volverá al editor para fusionar también los mensajes de esas tres confirmaciones. 

	# This is a combination of 3 commits.
	# The first commit's message is:
	changed my name a bit

	# This is the 2nd commit message:

	updated README formatting and added blame

	# This is the 3rd commit message:

	added cat-file

Al guardar esto, se tendrá una sola confirmación de cambios que introducirá todos los cambios que estaban en las tres confirmaciones de cambios previamente existentes.

## Dividir una confirmación de cambios en varias

Dividir una confirmación de cambios (commit), implica deshacerla y luego volver a preparar y confirmar trozos de la misma tantas veces como nuevas confirmaciones se desean tener al final.  Por ejemplo, si se desea dividir la confirmación de cambios de enmedio de entre las tres citadas en ejemplos anteriores. Es decir, si en lugar de "updated README formatting and added blame", se desea separar esa confirmación en dos: "updated README formatting" y "added blame".  Se puede realizar cambiando la instrucción en el script de `rebase -i`, desde 'split' a 'edit': 

	pick f7f3f6d changed my name a bit
	edit 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Después, cuando el script devuelva la línea de comandos, se ha de deshacer (reset) esa confirmación de cambios, coger los cambios recién deshechos y crear multiples nuevas confirmaciones de cambios con ellos. Al guardar y salir en el editor, Git rebobinará la historia hasta el padre de la primera confirmación de cambios en la lista, reaplicará esa primera confirmación  (`f7f3f6d`), luego reaplicará la segunda (`310154e`) y luego devolverá la línea de comandos. En esta línea de comando, es donde se desharan los cambios tecleando el comando `git reset HEAD^` para dejar sin preparar (unstaged) los archivos cambiados. Para, seguidamente, elaborar tantas confirmaciones de cambios como se desee, a base de pasar archivos al área de preparación y confirmarlos. Y, finalmente, teclear el comando `git rebase --continue` para completar la tarea. 

	$ git reset HEAD^
	$ git add README
	$ git commit -m 'updated README formatting'
	$ git add lib/simplegit.rb
	$ git commit -m 'added blame'
	$ git rebase --continue

Tras esto, Git reaplicará la última de las confirmaciones de cambios  (`a5f4a0d`) en el script. Quedando la historia: 

	$ git log -4 --pretty=format:"%h %s"
	1c002dd added cat-file
	9b29157 added blame
	35cfb2b updated README formatting
	f3cc40e changed my name a bit

De nuevo, merece recalcar el hecho de que estas operaciones cambian los códigos SHA-1 de todas las confirmaciones de cambio afectadas. Y que, por tanto, no se deben hacer sobre confirmaciones de cambio enviadas(push) a algún repositorio compartido.

## La opción nuclear: filter-branch

Existe una opción de reescritura del historial que se puede utilizar si se necesita reescribir un gran número de confirmaciones de cambio de forma mas o menos automatizada. Por ejemplo, para cambiar una dirección de correo electrónico globalmente, o para quitar un archivo de todas y cada una de las confirmaciones de cambios en una determinada rama. El comando en cuestión es `filter-branch`, y permite reescribir automáticamente grandes porciones del historial. Precisamente por ello, no debería utilizarse a no ser que el proyecto aún no se haya hecho público (es decir, otras personas no han basado su trabajo en alguna de las confirmaciones de cambio que se van a modificar). De todas formas, allá donde sea aplicable, puede ser de gran utilidad. Se van a ilustrar unas cuantas de las ocasiones donde se podría utilizar,  para dar así una idea de sus capacidades.

### Quitar un archivo de cada confirmación de cambios

Es algo que frecuentemente suele ser necesario. Alguien confirma cambios y almacena accidentalmente un enorme archivo binario cuando lanza un `git add .` sin pensarlo demasiado. Y es necesario quitarlo del repositorio. O podria suceder que se haya confirmado y almacenado accidentalmente un archivo que contiene una contraseña importante, Y el proyecto se va a hacer de código abierto. En estos casos, la mejor opción es utilizar la herramienta `filter-branch` para limpiar todo el historial.  Por ejemplo, para quitar un archivo llamado passwords.txt del repositorio, se puede emplear la opción `--tree-filter` del comando `filter-branch`:

	$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
	Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
	Ref 'refs/heads/master' was rewritten

Esta opción `--tree-filter`, tras cada extracción (checkout) del proyecto, lanzará el comando especificado y reconfirmará los cambios resultantes(recommit). En esta ocasión, se eliminará un archivo llamado passwords.txt de todas y cada una de las instantáneas (snapshot) almacenadas, tanto si este existe como si no. Otro ejemplo: si se desean eliminar todos los archivos de respaldo del editor que han sido almacenados por error, se podría lanzar algo así como  `git filter-branch --tree-filter "find * -type f -name '*~' -delete" HEAD`.

Y se iria viendo como Git reescribe árboles y confirmaciones de cambio, hasta que el apuntador de la rama llegue al final. Una recomendación: en general, suele ser buena idea lanzar cualquiera de estas operaciones primero sobre una rama de pruebas y luego reinicializar (hard-reset) la rama maestra (master), una vez se haya comprobado que el resultado de las operaciones es el esperado. Si se desea lanzar `filter-branch` sobre todas las ramas del repositorio, se ha de pasar la opción `--all` al comando. 

### Haciendo que una subcarpeta sea la nueva carpeta raiz

Por ejemplo, en el caso de que se haya importado trabajo desde otro sistema de control de versiones, y se tengan algunas subcarpetas sin sentido (trunk, tags,...). `filter-branch` puede ser de utilidad para que, por ejemplo, la subcarpeta `trunk` sea la nueva carpeta raiz del proyecto en todas y cada una de las confirmaciones de cambios:

	$ git filter-branch --subdirectory-filter trunk HEAD
	Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
	Ref 'refs/heads/master' was rewritten

Tras este comando, la nueva raiz del proyecto pasa a ser el contenido de la carpeta `trunk`. Y, además, Git elimina automáticamente todas las confirmaciones de cambio (commits) que no afectaban a  dicha subcarpeta. 

### Cambiando direcciones de correo-e de forma global

Otra utilidad típica para utilizar `filter-branch` es cuando alguien ha olvidado ejecutar `git config` para configurar su nombre y dirección de correo electrónico antes de comenzar a trabajar. O cuando se va a pasar a código abierto un proyecto, pero previamente se desea cambiar todas las direcciones de correo empresariales por direcciones personales. En cualquier caso, se pueden cambiar de un golpe las direcciones de correo en multiples confirmaciones de cambio. Aunque es necesario ser cuidadoso para actuar solo sobre aquellas direcciones que se deseen cambiar, utilizando para ello la opción `--commit-filter`: 

	$ git filter-branch --commit-filter '
	        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
	        then
	                GIT_AUTHOR_NAME="Scott Chacon";
	                GIT_AUTHOR_EMAIL="schacon@example.com";
	                git commit-tree "$@";
	        else
	                git commit-tree "$@";
	        fi' HEAD

Este comando pasa por todo el repositorio y reescribe cada confirmación de cambios donde detecte la dirección de correo indicada, para reemplazarla por la nueva. Y, debido a que cada confirmación de cambios contiene el código SHA-1 de sus ancestros, este comando cambia también todos los códigos SHA del historial; no solamente los de las confirmaciones de cambio que contenian la dirección indicada.
