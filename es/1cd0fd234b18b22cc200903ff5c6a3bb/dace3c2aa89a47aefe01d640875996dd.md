# Depuración con Git

Git dispone también de un par de herramientas muy útiles para tareas de depuración en los proyectos. Precisamente por estar Git diseñado para trabajar con casi cualquier tipo de proyecto, sus herramientas son bastante genéricas. Pero suelen ser de inestimable ayuda para cazar errores o las causas de los mismos cuando se detecta que algo va mal. 

## Anotaciones en los archivos

Cuando se está rastreando un error dentro del código buscando localizar cuándo se introdujo y por qué, el mejor auxiliar para hacerlo es la anotación de archivos. Esta suele mostrar la confirmación de cambios (commit) que modificó por última vez cada una de las líneas en cualquiera de los archivos. Así, cuando se está frente a una porción de código con problemas, se puede emplear el comando `git blame` para anotar ese archivo y ver así cuándo y por quién fue editada por última vez cada una de sus líneas. En este ejemplo, se ha utilizado la opción `-L` para limitar la salida a las líneas desde la 12 hasta la 22: 

	$ git blame -L 12,22 simplegit.rb 
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19) 
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

Merece destacar que el primer campo mostrado en cada línea es el código SHA-1 parcial de la confirmación de cambios en que se modificó dicha línea por última vez. Los dos siguientes campos son sendos valores extraidos de dicha confirmación de cambios --el nombre del autor y la fecha--, mostrando quien y cuándo modifico esa línea. Detras, vienen el número de línea y el contendido de la línea propiamente dicha. En el caso de las líneas con la confirmación de cambios  `^4832fe2`, merece comentar que son aquellas presentes en el archivo cuando se hizo la confirmación de cambios original;  (la confirmación en la que este archivo se incluyó en el proyecto por primera vez). No habiendo sufrido esas líneas ninguna modificación desde entonces. Puede ser un poco confuso, debido a que la marca `^` se utiliza también con otros significados diferentes dentro de Git. Pero este es el sentido en que se utiliza aquí: para señalar la confirmación de cambios original. 

Otro aspecto interesante de Git es la ausencia de un seguimiento explícito de archivos renombrados. Git simplemente se limita a almacenar instantáneas (snapshots) de los archivos, para después intentar deducir cuáles han podido ser renombrados. Esto permite preguntar a Git acerca de todo tipo de movimientos en el código. Indicando la opción `-C` en el comando `git blame`, Git analizará el archivo que se está anotando para intentar averiguar si alguno de sus fragmentos pudiera provenir de, o haber sido copiado de, algún otro archivo. Por ejemplo, si se estaba refactorizando un archivo llamado `GITServerHandler.m`, para trocearlo en múltiples archivos, siendo uno de estos `GITPackUpload.m`. Aplicando la opción `-C` de `git blame` sobre `GITPackUpload.m`, es posible ver de donde proviene cada sección del código: 

	$ git blame -C -L 141,153 GITPackUpload.m 
	f344f58d GITServerHandler.m (Scott 2009-01-04 141) 
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

Lo cual es realmente útil. Habitualmente suele mostrarse como confirmación de cambios original aquella confirmación de cambios desde la que se copió el código. Por ser esa la primera ocasión en que se han modificado las líneas en ese archivo. Git suele indicar la confirmación de cambios original donde se escribieron las líneas, incluso si estas fueron escritas originalmente en otro archivo.

## Búsqueda binaria

La anotación de archivos es útil si se conoce aproximadamente el punto dónde se localizan los problemas. Pero no siendo ese el caso, y habiendose realizado docenas o cientos de confirmaciones de cambio desde el último estado estable conocido, puede ser de utilidad el comando `git bisect`. Este comando `bisect` realiza una búsqueda binaria por todo el historial de confirmaciones de cambio, para intentar localizar lo más rápido posible aquella confirmación de cambios en la que se pudieron introducir los problemas.

Por ejemplo, en caso de aparecer problemas justo tras enviar a producción un cierto código que parecia funcionar bien en el entorno de desarrollo. Si, volviendo atras, resulta que se consigue reproducir el problema, pero cuesta identificar su causa. Se puede ir biseccionando el código para intentar localizar el punto del historial desde donde se presenta el problema. Primero se lanza el comando `git bisect start` para iniciar el proceso de búsqueda. Luego, con el comando `git bisect bad`, se le indica al sistema cual es la confirmación de cambios a partir de donde se han detectado los problemas. Y después, con el comando `git bisect good [good_commit]`, se le indica cual es la última confirmación de cambios conocida donde el código funcionaba bien:

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git averigua que se han dado 12 confirmaciones de cambio entre la confirmación marcada como buena y la marcada como mala.  Y extrae la confirmación central de la serie, para comenzar las comprobaciones a partir de ahí. En este punto, se pueden lanzar las pruebas pertinentes para ver si el problema existe en esa confirmación de cambios extraida. Si este es el caso, el problema se introdujo en algún punto anterior a esta confirmación de cambios intermedia. Si no, el problema se introdujo en un punto posterior. Por ejemplo, si resultara que no se detecta el problema aquí, se indicaria esta circunstancia a Git tecleando `git bisect good`; para continuar la búsqueda:

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

Git extraeria otra confirmación de cambios, aquella a medio camino entre la que se acaba de chequear y la que se habia indicado como erronea al principio. De nuevo, se pueden lanzar las pruebas para ver si el problema existe o no en ese punto. Si, por ejemplo, si existiera se indicaría ese hecho a Git tecleando `git bisect bad`:

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

Con esto el proceso de búsqueda se completa y Git tiene la información necesaria para determinar dónde comenzaron los problemas. Git reporta el código SHA-1 de la primera confirmación de cambios problemática y muestra una parte de la información relativa a esta y a los archivos modificados en ella. Así podemos irnos haciendo una idea de lo que ha podido suceder para que se haya introducido un error en el código:

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

Al terminar la revisión, es obligatorio teclear el comando `git bisect reset` para devolver HEAD al punto donde estaba antes de comenzar todo el proceso de búsqueda. So pena de dejar el sistema en un estado inconsistente.

	$ git bisect reset

Esta es una poderosa herramienta que permite chequear en minutos cientos de confirmaciones de cambio, para determinar rápidamente en que punto se pudo introducir el error. De hecho, si se dispone de un script que dé una salida 0 si el proyecto funciona correctamente y distinto de 0 si el proyecto tiene errores, todo este proceso de búsqueda con `git bisect` se puede automatizar completamente.  Primero, como siempre, se indica el alcance de la búsqueda indicando las aquellas confirmaciones de cambio conocidas donde el proyecto estaba mal y donde estaba bien. Se puede hacer en un solo paso. Indicando ambas confirmaciones de cambios al comando `bisect start`, primero la mala y luego la buena:

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

De esta forma, se irá ejecutando automáticamente `test-error.sh` en cada confirmación de cambios que se vaya extrayendo. Hasta que Git encuentre la primera donde se presenten problemas.  También se puede emplear algo como `make` o como `make tests` o cualquier otro método que se tenga para lanzar pruebas automatizadas sobre el sistema.
