# Preparación interactiva

Git trae incluidos unos cuantos scripts para facilitar algunas de las tareas en la línea de comandos. Se van a mostrar unos pocos comandos interactivos que suelen ser de gran utilidad a la hora de recoger en una confirmación de cambios solo ciertas combinaciones y partes de archivos. Estas herramientas son útiles, por ejemplo, cuando se modifican unos cuantos archivos y luego se decide almacenar esos cambios en una serie de confirmaciones de cambio focalizadas en lugar de en una sola confirmación de cambio entremezclada.    Así, se consiguen unas confirmaciones de cambio con agrupaciones lógicas de modificaciones, facilitando su revisión por parte otros desarrolladores que trabajen con nosotros. 
Al lanzar el comando 'git add' con las opciones '-i' o '--interactive', Git entra en un modo interactivo y muestra algo así como:

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 

Según se ve, este comando muestra una vista bastante diferente del área de preparación (staging area). Básicamente se trata de la misma información dada por el comando 'git status', pero mas sucinta e informativa. Se ve una lista de cambios ya preparados, en la izquierda; y de los que están aún sin preparar, en la derecha. 

Tras esa lista, viene la sección de comandos. Aquí se pueden lanzar acciones tales como: añadir archivos en el area de preparación (staging), sacar archivos de ella (unstaging), poner solo parte de algún archivo, añadir archivos nuevos que estaban fuera del sistema de control o mostrar diferencias en aquello que se ha añadido.

## Introduciendo archivos en el area de preparación y sacandolos de ella

Tecleando '2' o 'u' (update) tras el indicador 'What now>', el script interactivo preguntará cuales son los archivos que se quieren añadir al área de preparación:

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Para añadir los archivos TODO e index.html, se teclearian los números:

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

El asterisco `*` al lado de cada archivo indica que dicho archivo ha sido seleccionado para ser preparado. Pulsando la tecla [Enter] tras el indicador 'Update>>', Git toma lo seleccionado y lo añade al área de preparación: 

	Update>> 
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

En estos momentos se ve que los archivos TODO e index.html están en el área de preparación y que el archivo simplegit.rb no está aún. Si se desea sacar el archivo TODO del área, se puede utilizar la opción '3' o 'r' (revert):

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path

Volviendo a mirar el estado de Git, se comprueba que se ha sacado el archivo TODO del área de preparación:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Para ver las diferencis entre lo que está preparado, se puede utilizar la opción '6' o 'd' (diff). Esta muestra una lista de los archivos preparados en el área de preparación, permitiendo la seleccion de aquellos sobre los que  se desean ver diferencias. Es muy parecido a lanzar el comando 'git diff --cached' directamente en la línea de comandos:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

Con estos comandos básicos, se ha visto cómo se puede emplear el modo interactivo para interactuar de forma más sencilla con el área de preparación.

## Parches en la preparación

También es posible añadir solo ciertas partes de algunos archivos y no otras. Por ejemplo, si se han realizado dos cambios en el archivo simplegit.rb y se desea pasar solo uno de ellos al área de preparación, pero no el otro. En el indicador interactivo se ha de teclear '5' o 'p' (patch). Git preguntará cual es el archivo a pasar parcialmente al área de preparación. Y después irá mostrando trozos de las distintas secciones modificadas en el archivo, preguntando por cada una si se desea pasar o no al área de preparación:

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? 

En estas preguntas, hay varias opciones de respuesta. Tecleando '?' se muestra una lista de las mismas:

	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
	y - stage this hunk
	n - do not stage this hunk
	a - stage this and all the remaining hunks in the file
	d - do not stage this hunk nor any of the remaining hunks in the file
	g - select a hunk to go to
	/ - search for a hunk matching the given regex
	j - leave this hunk undecided, see next undecided hunk
	J - leave this hunk undecided, see next hunk
	k - leave this hunk undecided, see previous undecided hunk
	K - leave this hunk undecided, see previous hunk
	s - split the current hunk into smaller hunks
	e - manually edit the current hunk
	? - print help

Habitualmente se tecleará 'y' o 'n' según se desee pasar o no cada trozo. Pero habrá ocasiones donde pueda ser útil pasar todos ellos conjuntamente, o el dejar para más tarde la decisión sobre un trozo concreto. Si se decide pasar solo una parte de un archivo y dejar sin pasar otra parte, la salida de estado mostrará algo así como:

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

La línea correspondiente al estado del archivo simplegit.rb es bastante interesante. Muestra que un par de líneas han sido preparadas (staged) en el área de preparación y otro par han sido dejadas fuera de dicho área (unstaged). Es decir, se ha pasado parcialmente ese archivo al área de preparación. En este punto, es posible salir del script interactivo y lanzar el comando 'git commit' para almacenar esa confirmación de cambios parciales en los archivos.

Por último, cabe comentar que no es necesario entrar expresamente en el modo interactivo para preparar archivos parcialmente. También se puede acceder a ese script con los comandos 'git add -p' o con 'git add --patch', directamente desde la línea de comandos. 
