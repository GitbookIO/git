# Mantenimiento y recuperación de datos

De vez en cuando, es posible que necesites hacer algo de limpieza, (compactar un repositorio, adecuar un repositorio importado, recuperar trabajo perdido,...). En ese apartado vamos a ver algunos de esos escenarios.

## Mantenimiento

De cuando en cuando, Git lanza automáticamente un comando llamado "auto gc". La mayor parte de las veces, este comando no hace nada. Pero, cuando hay demasiados objetos sueltos, (objetos fuera de un archivo empaquetador), o demasiados archivos empaquetadores, Git lanza un comando `git gc` completo. `gc` corresponde a "recogida de basura" (garbage collect), y este comando realiza toda una serie de acciones: recoge los objetos sueltos y los agrupa en archivos empaquetadores; consolida los archivos empaquetadores pequeños en un solo gran archivo empaquetador; retira los objetos antiguos no incorporados a ninguna confirmación de cambios.

También puedes lanzar "auto gc" manualmente:

	$ git gc --auto

Y, habitualmente, no hará nada. Ya que es necesaria la presencia de unos 7.000 objetos sueltos o más de 50 archivos empaquetadores para que Git termine lanzando realmente un comando "gc". Estos límites pueden configurarse con las opciones de configuración  `gc.auto` y `gc.autopacklimit`, respectivamente. 

Otra tarea realizada por `gc` es el empaquetar referencias en un solo archivo. Por ejemplo, suponiendo que tienes las siguientes ramas y etiquetas en tu repositorio:

	$ find .git/refs -type f
	.git/refs/heads/experiment
	.git/refs/heads/master
	.git/refs/tags/v1.0
	.git/refs/tags/v1.1

Lanzando el comando `git gc`, dejarás de tener esos archivos en la carpeta `refs`. En aras de la eficiencia, Git los moverá a un archivo denominado `.git/packed-refs`: 

	$ cat .git/packed-refs 
	# pack-refs with: peeled 
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
	ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
	9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
	^1a410efbd13591db07496601ebc7a059dd55cfe9

Si actualizas alguna de las referencias, Git no modificará este archivo. Sino que, en cambio, escribirá uno nuevo en `refs/heads`. Para obtener la clave SHA correspondiente a una determinada referencia, Git comprobará primero en la carpeta `refs` y luego en el archivo `packed-refs`.  Cualquier referencia que no puedas encontrar en la carpeta `refs`, es muy posible que la encuentres en el archivo `packed-refs`.

Merece destacar que la última línea de este archivo comenzaba con  `^`-  Esto nos indica que la etiqueta inmediatamente anterior es una etiqueta anotada y que esa línea es la confirmación de cambios a la que apunta dicha etiqueta anotada.

## Recuperación de datos

En algún momento de tu trabajo con Git, perderás por error una confirmación de cambios. Normalmente, esto suele suceder porque has forzado el borrado de una rama con trabajos no confirmados en ella, y luego te has dado cuenta de que realmente necesitabas dicha rama; o porque has reculado (hard-reset) una rama, abandonando todas sus confirmaciones de cambio, y luego te has dado cuenta que necesitabas alguna de ellas. Asumiendo que estas cosas pasan, ¿cómo podrías recuperar tus confirmaciones de cambio perdidas?

Vamos a ver un ejemplo de un retroceso a una confirmación (commit) antigua en la rama principal de tu repositorio de pruebas, y cómo podriamos recuperar las confirmaciones perdidas en este caso. Lo primero es revisar el estado de tu repositorio en ese momento:

	$ git log --pretty=oneline
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Después, al mover la rama  `master` de vuelta a la confirmación de cambios intermedia:

	$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
	HEAD is now at 1a410ef third commit
	$ git log --pretty=oneline
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Vemos que se han perdido las dos últimas confirmaciones de cambios, --no tienes ninguna rama que te permita acceder a ellas--. Necesitas localizar el SHA de la última confirmación de cambios y luego añadir una rama que apunte hacia ella. El problema es cómo localizarla, --porque, ¿no te la sabrás de memoria, no?--.

El método más rápido para conseguirlo suele ser utilizar una herramienta denominada `git reflog`. Según trabajas, Git suele guardar un silencioso registro de donde está HEAD en cada momento. Cada vez que confirmas cambios o cambias de rama, el registro (reflog) es actualizado. El registro reflog se actualiza incluso cuando utilizas el comando `git update-ref`. Siendo esta otra de las razones por las que es recomendable utilizar ese comando en lugar de escribir manualmente los valores SHA en los archivos de referencia, tal y como hemos visto anteriormente en la sección "Referencias Git".  Con el comando `git reflog` puedes revisar donde has estado en cualquier momento pasado:

	$ git reflog
	1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
	ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Se pueden ver las dos confirmaciones de cambios que hemos activado, pero no hay mucha más información al respecto.  Para ver la misma información de manera mucho más amigable, podemos utilizar el comando `git log -g`. Este nos muestra una salida normal de registro:

	$ git log -g
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:22:37 2009 -0700

	    third commit

	commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	     modified repo a bit

Parece que la confirmación de cambios perdida es esta última. Puedes recuperarla creando una nueva rama apuntando a ella. Por ejemplo, puedes iniciar una rama llamada `recover-branch` con dicha confirmación de cambios (ab1afef):

	$ git branch recover-branch ab1afef
	$ git log --pretty=oneline recover-branch
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

¡Bravo!, acabas de añadir una rama denominada `recover-branch` al punto donde estaba originalmente tu rama `master`; permitiendo así recuperar el acceso a las dos primeras confirmaciones de cambios.  
A continuación, supongamos que la pérdida se ha producido por alguna razón que no se refleja en el registro (reflog). Puedes simularlo borrando la rama `recover-branch` y borrando asimismo el registro. Con eso, perdemos completamente el acceso a las dos primeras confirmaciones de cambio:

	$ git branch –D recover-branch
	$ rm -Rf .git/logs/

La información de registro (reflog) se guarda en la carpeta `.git/logs/`; por lo que, borrandola, nos quedamos efectivamente sin registro.  ¿Cómo podriamos ahora recuperar esas confirmaciones de cambio? Un camino es utilizando el comando de chequeo de integridad de la base de datos: `git fsck`. Si lo lanzas con la opción `--full`, te mostrará todos los objetos sin referencias a ningún otro objeto:

	$ git fsck --full
	dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
	dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
	dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

En este caso, puedes ver la confirmación de cambios perdida en la línea 'dangling commit.....'. Y la puedes recuperar del mismo modo, añadiendo una rama que apunte a esa clave SHA.

## Borrando objetos

Git tiene grandes cosas. Pero el hecho de que un  `git clone` siempre descarge la historia completa del proyecto (incluyendo todas y cada una de las versiones de todos y cada uno de los archivos). Puede casusar problemas.  Todo suele ir bien si el contenido es únicamente código fuente. Ya que Git está tremendamente optimizado para comprimir eficientemente ese tipo de datos. Pero, si alguien, en cualquier momento de tu proyecto, ha añadido un solo archivo enorme. A partir de ese momento, todos los clones, siempre, se verán obligados a copiar ese enorme archivo. Incluso si ya ha sido borrado del proyecto en la siguiente confirmación de cambios realizada inmediatamente tras la que lo añadió. Porque en algún momento formó parte del proyecto, siempre permanecerá ahí.

Esto suele dar bastantes problemas cuando estás convirtiendo repositorios de Subversion o de Perforce a Git. En esos sistemas, uno no se suele descargar la historia completa. Y, por tanto, los archivos enormes no tienen mayores consecuencias. Si, tras una importación de otro sistema, o por otras razones, descubres que tu repositorio es mucho mayor de lo que deberia ser. Es momento de buscar y borrar objetos enormes en él.

Una advertencia importante: estas técnicas son destructivas y alteran el historia de confirmaciones de cambio. Se basan en reescribir todos los objetos confirmados aguas abajo desde el árbol más reciente modificado para borrar la referencia a un archivo enorme. No tendrás problemas si lo haces inmediatamente despues de una importación; o justo antes de que alguien haya comenzado a trabajar con la confirmación de cambios modificada. Pero si no es el caso, tendrás que avisar a todas las personas que hayan contribuido. Porque se verán obligadas a reorganizar su trabajo en base a tus nuevas confirmaciones de cambio.

Para probarlo por tí mismo, puedes añadir un archivo enorme a tu repositorio de pruebas y retirarlo en la siguiente confirmación de cambios. Así podrás practicar la busqueda y borrado permanente del repositorio. Para emprezar, añade un objeto enorme a tu historial:

	$ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
	$ git add git.tbz2
	$ git commit -am 'added git tarball'
	[master 6df7640] added git tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 create mode 100644 git.tbz2

!Ouch!, --no querias añadir un archivo tan grande a tu proyecto--. Mejor si lo quitas:

	$ git rm git.tbz2 
	rm 'git.tbz2'
	$ git commit -m 'oops - removed large tarball'
	[master da3f30d] oops - removed large tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 delete mode 100644 git.tbz2

Ahora, puedes limpiar `gc` tu base de datos y comprobar cuánto espacio estás ocupando:

	$ git gc
	Counting objects: 21, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (16/16), done.
	Writing objects: 100% (21/21), done.
	Total 21 (delta 3), reused 15 (delta 1)

Puedes utilizar el comando `count-objects` para revisar rápidamente el espacio utilizado:

	$ git count-objects -v
	count: 4
	size: 16
	in-pack: 21
	packs: 1
	size-pack: 2016
	prune-packable: 0
	garbage: 0

El valor de  `size-pack` nos da el tamaño de tus archivos empaquetadores, en kilobytes, y, por lo que se ve, estás usando 2 MB.  Antes de la última confirmación de cambios, estabas usando algo así como 2 KB. Resulta claro que esa última confirmación de cambios no ha borrado el archivo enorme del historial. A partir de este momento, cada vez que alguien haga un clón de este repositorio, se verá obligado a copiar 2 MB para un proyecto tan simple. Y todo porque tu añadiste accidentalmente un archivo enorme en algún momento. Para arreglar la situación.

Lo primero es localizar el archivo enorme. En este caso, ya sabes de antemano cual es. Pero suponiendo que no lo supieras, ¿cómo podrías identificar el archivo o archivos que están ocupando tanto espacio?. Tras lanzar el comando `git gc`, todos los objetos estarán guardados en un archivo empaquetador. Puedes identifcar los objetos enormes en su interior, utilizando otro comando de fontanería denominado `git verify-pack` y ordenando su salida por su tercera columna, la que nos informa de los tamaños de cada objeto.  Puedes también redirigir su salida a través del comando `tail`. Porque realmente solo nos interesan las últimas líneas, las correspondientes a los archivos más grandes. 

	$ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
	7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

El archivo enorme es el último: 2 MB  (2056716 Bytes para ser exactos). Para concretar cual es el archivo, puedes utilizar el comando `rev-list` que ya vimos brevemente en el capítulo 7.  Con la opción `--objects`, obtendrás la lista de todas las SHA de todas las confirmaciones de cambio, junto a las SHA de los objetos binarios y las ubicaciones (paths) de cada uno de ellos. Puedes usar esta información para localizar el nombre del objeto binario:

	$ git rev-list --objects --all | grep 7a9eb2fb
	7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Una vez tengas ese dato, lo puedes utilizar para borrar ese archivo en todos los árboles pasados. Es sencillo revisar cuales son las confirmaciones de cambios donde interviene ese archivo:

	$ git log --pretty=oneline --branches -- git.tbz2
	da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
	6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Para borrar realmente ese archivo de tu historial Git, has de reescribir todas las confirmaciones de cambio aguas abajo de `6df76`.  Y, para ello, puedes emplear el comando  `filter-branch` que se vió en el capítulo 6.

	$ git filter-branch --index-filter \
	   'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
	Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
	Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
	Ref 'refs/heads/master' was rewritten

La opción `--index-filter` es similar a la `--tree-filter` vista en el capítulo 6. Se diferencia porque, en lugar de modificar archivos activados (checked out) en el disco, se modifica el área de preparación (staging area) o índice. En lugar de borrar un archivo concreto con una orden tal como `rm archivo`, has de borrarlo con `git rm --cached` (es decir, tienes que borrarlo del índice, en lugar de del disco). Con eso conseguimos aumentar la velocidad. El proceso es mucho más rápido, porque Git no ha de activar cada revisión a disco antes de procesar tu filtro. Aunque también puedes hacer lo mismo con la opción`--tree-filter`, si así lo prefieres.  La opción `--ignore-unmatch` indica a `git rm` que evite lanzar errores en caso de no encontrar el patrón que le has ordenado buscar. Y por último, se indica a `filter-branch` que reescriba la historia a partir de la confirmación de cambios `6df7640`, porque ya conocemos que es a partir de ahí donde comenzaba el problema.  De otro modo, el comando comenzaria desde el principio, asumiendo un proceso inecesariamente más largo.

Tras esto, el historial ya no contiene ninguna referencia a ese archivo. Pero, sin embargo, quedan referencias en el registro (reflog) y en el nuevo conjunto de referencias en `.git/refs/original` que Git ha añadido al procesar  `filter-branch`. Por lo que has de borrar también estás y reempaquetar la base de datos. Antes de reempaquetar, asegurate de acabar completamente con cualquier elemento que apunte a las viejas confirmaciones de cambios:

	$ rm -Rf .git/refs/original
	$ rm -Rf .git/logs/
	$ git gc
	Counting objects: 19, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (19/19), done.
	Total 19 (delta 3), reused 16 (delta 1)

Y ahora, vamos a ver cuanto espacio hemos ahorrado.

	$ git count-objects -v
	count: 8
	size: 2040
	in-pack: 19
	packs: 1
	size-pack: 7
	prune-packable: 0
	garbage: 0

El tamaño del repositorio ahora es de 7 KB, mucho mejor que los 2 MB anteriores. Por el valor de "size", puedes ver que el objeto enorme sigue estando entre tus objetos sueltos; es decir, no hemos acabado completamente con él. Pero lo importante es que ya no será considerado al transferir o clonar el proyecto. Si realmente quieres acabar del todo, puedes lanzar la orden  `git prune --expire` para retirar incluso ese archivo suelto. 
