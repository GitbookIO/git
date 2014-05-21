# Selección de confirmaciones de cambios concretas

Git tiene varios modos de seleccionar confirmaciones de cambio o grupos de confirmaciones de cambio. Algunos de estos modos no son precisamente obvios, pero conviene conocerlos.

## Confirmaciones puntuales

La forma canónica de referirse a una confirmación de cambios es indicando su código-resumen criptográfico SHA-1. Pero también existen otras maneras más sencillas. En esta sección se verán las diversas formas existentes para referirse a una determinada confirmación de cambios (commit).

## SHA corto

Simplemente dándole los primeros caracteres del código SHA-1, Git es lo suficientemente inteligente como para figurarse cual es la confirmación de cambios (commit) deseada. Es necesario teclear por lo menos 4 caracteres y estos han de ser no ambiguos --es decir, debe existir un solo objeto en el repositorio cuyo código comience por dicho trozo inicial del SHA--.

Por ejemplo, a la hora de localizar una confirmación de cambios, supongamos que se lanza el comando 'git log' e intentamos localizar la confirmación de cambios concreta donde se añadió una cierta funcionalidad: 

	$ git log
	commit 734713bc047d87bf7eac9674765ae793478c50d3
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Jan 2 18:32:33 2009 -0800

	    fixed refs handling, added gc auto, updated tests

	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Merge: 1c002dd... 35cfb2b...
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

	commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 14:58:32 2008 -0800

	    added some blame and merge stuff

En este caso, escogiendo '1c002dd....', para lanzar el comando 'git show' sobre esa confirmación de cambios concreta, serían equivalentes todos estos comandos (asumiendo la no ambiguedad de todas las versiones cortas indicadas):

	$ git show 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	$ git show 1c002dd4b536e7479f
	$ git show 1c002d

En todos estos casos, Git puede deducir el resto del valor SHA-1. Con la opción '--abbrev-commit' del comando 'git log', en su salida se mostrarán valores acortados, pero únicos de SHA. Habitualmente suelen resultar valores de siete caracteres, pero alguno puede ser más largo si es necesario para preservar la unicidad de todos los valores SHA-1 mostrados:

	$ git log --abbrev-commit --pretty=oneline
	ca82a6d changed the version number
	085bb3b removed unnecessary test code
	a11bef0 first commit

Normalmente, entre ocho y diez caracteres suelen ser más que suficientes para garantizar la unicidad de  todos los objetos dentro de cualquier proyecto. Aunque, en uno de los más grandes proyectos gestionados con Git, el kernel de Linux, están siendo necesarios unos 12 caracteres (de los 40 posibles) para garantizar la unicidad.

## Un breve comentario sobre los códigos SHA-1

Mucha gente se suele preocupar por si, por casualidad, dos objetos en su repositorio reciben el mismo código SHA-1 para identificarlos. ¿Y qué sucederia si se diera ese caso?

Si se da la casualidad de confirmar cambios en un objeto y que a este se le asigne el mismo código SHA-1 que otro ya existente en el repositorio. Al ver  el objeto previamente almacenado en la base de datos, Git asumirá que este ya existía. Al intentar recuperar (check-out) el objeto más tarde, siempre se obtendrán los datos del primer objeto. 

No obstante, hemos de ser conscientes de lo altamente improbable de un suceso así. Los códigos SHA-1 son de 20 bytes, (160 bits). El número de objetos, codificados aleatóriamente, necesarios para asegurar un 50% de probabilidad de darse una sola colisión es cercano a 2^80 (la fórmula para determinar la probabilidad de colisión es `p = (n(n-1)/2) * (1/2^160))`). 2^80 es 1'2 x 10^24, o lo que es lo mismo, 1 billón de billones. Es decir, unas 1.200 veces el número de granos de arena en la Tierra.

El siguiente ejemplo puede ser bastante ilustrativo, para hacernos una idea de lo que podría tardarse en darse una colisión en el código SHA-1: Si todos los 6'5 billones de humanos en el planeta Tierra estuvieran programando y, cada segundo, cada uno de ellos escribiera código equivalente a todo el histórico del kernel de Linux (cerca de 1 millón de objetos Git), enviandolo todo a un enorme repositorio Git. Serían necesarios unos 5 años antes de que dicho repositorio contuviera suficientes objetos como para tener una probabilidad del 50% de darse una sola colisión en el código SHA-1. Es mucho más probable que todos los miembros de nuestro equipo de programación fuesen atacados y matados por lobos, en incidentes no relacionados entre sí, acaecidos todos ellos en una misma noche.

## Referencias a ramas

La manera más directa de referirse a una confirmación de cambios es teniendo una rama apuntando a ella. De esta forma, se puede emplear el nombre de la rama en cualquier comando Git que espere un objeto de confirmación de cambios o un código SHA-1. Por ejemplo, si se desea mostrar la última confirmación de cambios en una rama, y suponiendo que la rama 'topic1' apunta a 'ca82a6d', los tres comandos siguientes son equivalentes: 

	$ git show ca82a6dff817ec66f44342007202690a93763949
	$ git show topic1

Para ver a qué código SHA apunta una determinada rama, o si se desea conocer cómo se comportarian cualquiera de los ejemplos anteriores en términos de SHAs, se puede emplear el comando de fontaneria 'rev-parse'. En el capítulo 9 se verá más información sobre las herramientas de fontaneria. Herramientas estas que son utilizadas para operaciones a muy bajo nivel, y que no estan pensadas para ser utilizadas en el trabajo habitual del día a día. Pero que, sin embargo, pueden ser muy útiles cuando se desea ver lo que realmente sucede "tras las bambalinas", en el interior de Git. Por ejemplo, lanzando el comando 'rev-parse' sobre una rama, esta muestra el código SHA-1 de la última confirmación de cambios en ella:

	$ git rev-parse topic1
	ca82a6dff817ec66f44342007202690a93763949

## Nombres cortos en RefLog

Una de las tareas realizadas por Git continuamente en segundo plano, mientras nosotros trabajamos, es el mantenimiento de un registro de referencia (reflog). En este registro queda traza de dónde han estado las referencias a HEAD y a las distintas ramas durante los últimos meses.

Este registro de referencia se puede consultar con el comando 'git reflog':

	$ git reflog
	734713b... HEAD@{0}: commit: fixed refs handling, added gc auto, updated
	d921970... HEAD@{1}: merge phedders/rdocs: Merge made by recursive.
	1c002dd... HEAD@{2}: commit: added some blame and merge stuff
	1c36188... HEAD@{3}: rebase -i (squash): updating HEAD
	95df984... HEAD@{4}: commit: # This is a combination of two commits.
	1c36188... HEAD@{5}: rebase -i (squash): updating HEAD
	7e05da5... HEAD@{6}: rebase -i (pick): updating HEAD

Cada vez que se actualiza una rama por cualquier razón, Git almacena esa información en este histórico temporal. Y esta información se puede utilizar para referirse a confirmaciones de cambio pasadas. Por ejemplo, si se desea ver el quinto anterior valor de HEAD en el repositorio, se puede emplear la referencia '@{n}' mostrada por la salida de reflog:

	$ git show HEAD@{5}

Esta misma sintaxis puede emplearse cuando se desea ver dónde estaba una rama en un momento específico en el tiempo. Por ejemplo, para ver dónde apuntaba la rama 'master' en el día de ayer, se puede teclear:

	$ git show master@{yesterday}

Este comando mostrará a dónde apuntaba ayer la rama. Esta técnica tan solo funciona para información presente en el registro de referencia. No se puede emplear para confirmaciones de cambio de antiguedad superior a unos pocos meses.

Si se desea ver la información del registro de referencia, formateada de forma similar a la salida del comando 'git log', se puede lanzar el comando 'git log -g':

	$ git log -g master
	commit 734713bc047d87bf7eac9674765ae793478c50d3
	Reflog: master@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: commit: fixed refs handling, added gc auto, updated 
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Jan 2 18:32:33 2009 -0800

	    fixed refs handling, added gc auto, updated tests

	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Reflog: master@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: merge phedders/rdocs: Merge made by recursive.
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

Es importante destacar la estricta localidad de la información en el registro de referencia. Es un registro que se va componiendo en cada repositorio según se va trabajando en él. Las referencias de una cierta persona en su repositorio nunca seran las mismas que las de cualquier otra persona en su copia local del repositorio. Es más, justo tras terminar de clonar un repositorio lo que se tiene es un registro de referencia vacio, puesto que  aún no se ha realizado ningún trabajo sobre dicho repositorio recién clonado. Así, un comando tal como `git show HEAD@{2.months.ago}` solo será válido en caso de haber clonado el proyecto como mínimo dos meses antes. Si se acaba de clonar hace cinco minutos, ese comando dará un resultado vacio.

## Referencias a ancestros

Otra forma de especificar una confirmación de cambios es utilizando sus ancestros. Colocando un '^' al final de una referencia, Git interpreta que se refiere al padre de dicha referencia.
Suponiendo que sea esta la historia de un proyecto:

	$ git log --pretty=format:'%h %s' --graph
	* 734713b fixed refs handling, added gc auto, updated tests
	*   d921970 Merge commit 'phedders/rdocs'
	|\  
	| * 35cfb2b Some rdoc changes
	* | 1c002dd added some blame and merge stuff
	|/  
	* 1c36188 ignore *.gem
	* 9b29157 add open3_detach to gemspec file list

Se puede visualizar la anteúltima confirmación de cambios indicando 'HEAD^', que significa "el padre de HEAD":

	$ git show HEAD^
	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Merge: 1c002dd... 35cfb2b...
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

También es posible indicar un número detras de '^'. Por ejemplo `d921970^2`, para indicar "el segundo padre de d921970" . Aunque esta sentencia es útil tan solo en confirmaciones de fusiones (merge), los únicos tipos de confirmación de cambios que pueden tener más de un padre. El primer padre es el proveniente de la rama activa al realizar la fusión, y el segundo es la confirmación de cambios en la rama desde la que se fusiona.

	$ git show d921970^
	commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 14:58:32 2008 -0800

	    added some blame and merge stuff

	$ git show d921970^2
	commit 35cfb2b795a55793d7cc56a6cc2060b4bb732548
	Author: Paul Hedderly <paul+git@mjr.org>
	Date:   Wed Dec 10 22:22:03 2008 +0000

	    Some rdoc changes

Otra forma de referirse a los ancestros es la marca `~`. Utilizada tal cual, también se refiere al padre. Por lo tanto, `HEAD~` y `HEAD^` son equivalentes. Pero la diferencia comienza al indicar un número tras ella. `HEAD~2` significa "el primer padre del primer padre", es decir, "el abuelo". Y así según el número de veces que se indique. Por ejemplo, en la historia de proyecto citada anteriormente, `HEAD~3` sería: 

	$ git show HEAD~3
	commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
	Author: Tom Preston-Werner <tom@mojombo.com>
	Date:   Fri Nov 7 13:47:59 2008 -0500

	    ignore *.gem

Igualmente, se podría haber escrito `HEAD^^^`, que también se refiere al "primer padre del primer padre del primer padre":

	$ git show HEAD^^^
	commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
	Author: Tom Preston-Werner <tom@mojombo.com>
	Date:   Fri Nov 7 13:47:59 2008 -0500

	    ignore *.gem

E incluso también es posible combinar las dos sintaxis. Por ejemplo, para referirse al "segundo padre de la referencia previa" (asumiendo que es una confirmación de cambios de fusión -merge-), se pude escribir algo como `HEAD~3^2`.

## Referecias a un rango de confirmaciones de cambios

Una vez vistas las formas de referirse a confirmaciones concretas de cambios. Vamos a ver cómo referirse a un grupo de confirmaciones. Esto es especialmente útil en la gestión de ramas. Si se tienen multitud de ramas, se pueden emplear las espeficicaciones de rango para responder a cuestiones tales como "¿cual es el trabajo de esta rama que aún no se ha fusionado con la rama principal?".

### Doble punto

La especificación de rango más común es la sintaxis doble-punto. Básicamente, se trata de pedir a Git que resuelva un rango de confirmaciones de cambio alcanzables desde una confirmación determinada, pero no desde otra. Por ejemplo, teniendo un historial de confirmaciones de cambio tal como el de la figura 6-1.


![](http://git-scm.com/figures/18333fig0601-tn.png)
 
Figura 6-1. Ejemplo de historial para selección de rangos.

Si se desea ver qué partes de la rama experiment están sin fusionar aún con la rama master. Se puede pedir a Git que muestre un registro con las confirmaciones de cambio en `master..experiment`. Es decir, "todas las confirmaciones de cambio alcanzables desde experiment que no se pueden alcanzar desde master". Por razones de brevedad y claridad en los ejemplos, para representar los objetos confirmación de cambios (commit) se utilizarán las letras mostradas en el diagrama en lugar de todo el registro propiamente dicho: 

	$ git log master..experiment
	D
	C

Si, por el contrario, se desea ver lo opuesto (todas las confirmaciones en 'master' que no están en 'experiment'). Simplemente hay que invertir los nombres de las ramas. `experiment..master` muestra todo lo que haya en 'master' pero que no es alcanzable desde 'experiment':

	$ git log experiment..master
	F
	E

Esto es útil si se desea mantener actualizada la rama 'experiment' y previsualizar lo que se está a punto de fusionar en ella. Otra utilidad habitual de estas sentencias es la de ver lo que se está a punto de enviar a un repositorio remoto:

	$ git log origin/master..HEAD

Este comando muestra las confirmaciones de cambio de la rama activa que no están aún en la rama 'master' del repositorio remoto 'origin'. Si se lanza el comando 'git push' (y la rama activa actual esta relacionada con 'origin/master'), las confirmaciones de cambio mostradas por `git log origin/master..HEAD` serán las que serán transferidas al servidor. 
Es posible también omitir la parte final de la sentencia y dejar que Git asuma HEAD. Por ejemplo, se pueden obtener los mismos resultados tecleando `git log origin/master..`, ya que git sustituye HEAD en la parte faltante. 

### Puntos multiples

La sintaxis del doble-punto es util como atajo. Pero en algunas ocasiones interesa indicar mas de dos ramas para precisar la revisión. Como cuando se desea ver las confirmaciones de cambio presentes en cualquiera de varias ramas y no en la rama activa. Git permite realizar esto utilizando o bien el caracter `^` o bien la opción `--not` por delante de aquellas referencias de las que se desea no ver las confirmaciones de cambio.  Así, estos tres comandos son equivalentes:

	$ git log refA..refB
	$ git log ^refA refB
	$ git log refB --not refA

Esto nos permite indicar más de dos referencias en una misma consulta. Algo imposible con la sintaxis dos-puntos. Por ejemplo, si se deseean ver todas las confirmaciones de cambio alcanzables desde la 'refA' o la 'refB', pero no desde la 'refC', se puede teclear algo como esto:

	$ git log refA refB ^refC
	$ git log refA refB --not refC

Esto da una enorme versatilidad al sistema de consultas y permite revisar el contenido de todas las ramas  en el repositorio.

### Triple-punto

La última de las opciones principales para seleccionar rangos es la sintaxis triple-punto. Utilizada para especificar todas las confirmaciones de cambio alcanzables separadamente desde cualquiera de dos referencias, pero no desde ambas a la vez. Volviendo sobre la historia de proyecto mostrada en la figura 6-1.
Si se desea ver lo que está o bien en 'master' o bien en 'experiment', pero no en ambas simultáneamente, se puede emplear el comando:

	$ git log master...experiment
	F
	E
	D
	C

De nuevo, esto da una salida normal de 'log', pero mostrando tan solo información sobre las cuatro confirmaciones de cambio, dadas en la tradicional secuencia ordenada por fechas.

Una opción habitual a utilizar en estos casos con el comando 'log' suele ser 'left-right'. Haciendo así que en la salida se muestre cual es el lado al que pertenece cada una de las confirmaciones de cambio. Esto hace más util la información mostrada:

	$ git log --left-right master...experiment
	< F
	< E
	> D
	> C

Con estas herramientas, es mucho más sencillo indicar con precisión cual o cuales son las confirmaciones de cambios que se desean revisar. 
