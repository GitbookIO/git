# Atributos de Git

Algunos de los ajustes que hemos vistos, pueden ser especificados para un camino (path) concreto, de tal forma que Git los aplicará unicamente para una carpeta o para un grupo de archivos determinado. Estos ajustes específicos relacionados con un camino, se denominan atributos en Git. Y se pueden fijar, bien mediante un archivo '.gitattribute' en uno de los directorios de tu proyecto (normalmente en la raiz del proyecto), o bien mediante el archivo 'git/info/attributes en el caso de no querer guardar el archivo de atributos dentro de tu proyecto.

Por medio de los atributos, puedes hacer cosas tales como indicar diferentes estrategias de fusión para archivos o carpetas concretas de tu proyecto, decirle a Git cómo comparar archivos no textuales, o indicar a Git que filtre ciertos contenidos antes de guardarlos o de extraerlos del repositorio Git. En esta sección, aprenderas acerca de algunos atributos que puedes asignar a ciertos caminos (paths) dentro de tu proyecto Git, viendo algunos ejemplos de cómo utilizar sus funcionalidades de manera práctica.

## Archivos binarios

Un buen truco donde utilizar los atributos Git es para indicarle cuales de los archivos son binarios, (en los casos en que Git no podría llegar a determinarlo por sí mismo), dandole a Git instruciones especiales sobre cómo tratar estos archivos. Por ejemplo, algunos archivos de texto se generan automáticamente y no tiene sentido compararlos; mientras que algunos archivos binarios sí que pueden ser comparados --vamos a ver cómo indicar a Git cual es cual--.

### Identificando archivos binarios

Algunos archivos aparentan ser textuales, pero a efectos prácticos merece más la pena tratarlos como binarios. Por ejemplo, los proyectos Xcode en un Mac contienen un archivo terminado en '.pbxproj'. Este archivo es básicamente una base de datos JSON (datos javascript en formato de texto plano), escrita directamente por el IDE para almacenar aspectos tales como tus ajustes de compilación. Aunque técnicamente es un archivo de texto, porque su contenido son caracteres ASCII. Realmente nunca lo tratarás como tal, porque en realidad es una base de datos ligera --y no puedes fusionar sus contenidos si dos personas lo cambian, porque las comparaciones no son de utilidad--. Estos son archivos destinados a ser tratados de forma automatizada. Y es preferible tratarlos como si fueran archivos binarios.

Para indicar a Git que trate todos los archivos 'pbxproj' como binarios, puedes añadir esta línea a tu archivo '.gitattriutes':

	*.pbxproj -crlf -diff

A partir de ahora, Git no intentará convertir ni corregir problemas CRLF en los finales de línea; ni intentará hacer comparaciones ni mostar diferencias de este archivo cuando lances comandos 'git show' o 'git diff' en tu proyecto. A partir de la versión 1.6 de Git, puedes utilizar una macro en lugar de las dos opciones '-crlf -diff':

	*.pbxproj binary

### Comparando archivos binarios

A partir de la versión 1.6, puedes utilizar los atributos Git para comparar archivos binarios. Se consigue diciendole a Git la forma de convertir los datos binarios en texto, consiguiendo así que puedan ser comparado con la herramienta habitual de comparación textual.

Esta es una funcionalidad muy util, pero bastante desconocida. Por lo que la ilustraré con unos ejemplos. En el primero de ellos, utilizarás esta técnica para resolver uno de los problemas más engorrosos conocidos por la humanidad: el control de versiones en documentos Word. Todo el mundo conoce el hecho de que Word es el editor más horroroso de cuantos hay; pero, desgraciadamente, todo el mundo lo usa. Si deseas controlar versiones en documentos Word, puedes añadirlos a un repositorio Git e ir realizando confirmaciones de cambio (commit) cada vez. Pero, ¿qué ganas con ello?. Si lanzas un comando 'git diff', lo único que verás será algo tal como:

	$ git diff 
	diff --git a/chapter1.doc b/chapter1.doc
	index 88839c4..4afcb7c 100644
	Binary files a/chapter1.doc and b/chapter1.doc differ

No puedes comparar directamente dos versiones, a no ser que extraigas ambas y las compares manualmente, ¿no?. Pero resulta que puedes hacerlo bastante mejor utilizando los atributos Git. Poniendo lo siguiente en tu archivo '.gitattributes':

	*.doc diff=word

Así decimos a Git que sobre cualquier archivo coincidente con el patrón indicado, (.doc), ha de utilizar el filtro "word" cuando intentente hacer una comparación con él. ¿Qué es el filtro "word"? Tienes que configurarlo tú mismo. Por ejemplo, puedes configurar Git para que utilice el programa 'strings' para convertir los documentos Word en archivos de texto planos, archivos sobre los que poder realizar comparaciones sin problemas:

	$ git config diff.word.textconv strings

A partir de ahora, Git sabe que si intenta realizar una comparación entre dos momentos determinados (snapshots), y si cualquiera de los archivos a comparar termina en '.doc', tiene que pasar antes esos archivos por el filtro "word", es decir, por el programa 'strings'. Esto prepara versiones texto de los archivos Word, antes de intentar compararlos.

Un ejemplo. He puesto el capítulo 1 de este libro en Git, le he añadido algo de texto a un párrafo y he guardado el documento. Tras lo cual he lanzando el comando 'git diff' para ver lo que ha cambiado:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index c1c8a0a..b93c9e4 100644
	--- a/chapter1.doc
	+++ b/chapter1.doc
	@@ -8,7 +8,8 @@ re going to cover Version Control Systems (VCS) and Git basics
	 re going to cover how to get it and set it up for the first time if you don
	 t already have it on your system.
	 In Chapter Two we will go over basic Git usage - how to use Git for the 80% 
	-s going on, modify stuff and contribute changes. If the book spontaneously 
	+s going on, modify stuff and contribute changes. If the book spontaneously 
	+Let's see if this works.

Git me indica correctamente que he añadido la frase "Let's see if this works". No es perfecto, --añade bastante basura aleatoria al final--, pero realmente funciona. Si pudieras encontrar o escribir un conversor suficientemente bueno de-Word-a-texto-plano, esta solución sería terriblemente efectiva. Sin embargo, ya que 'strings' está disponible para la mayor parte de los sistemas Mac y Linux, es buena idea probar primero con él para trabajar con formatos binarios.

Otro problema donde puede ser util esta técnica, es en la comparación de imágenes. Un camino puede ser pasar los archivos JPEG a través de un filtro para extraer su información EXIF --los metadatos que se graban dentro de la mayoria de formatos gráficos--. Si te descargas e instalas el programa 'exiftool', puedes utilizarlo para convertir tus imagenes a textos (metadatos), de tal forma que diff podrá al menos mostrarte algo útil de cualquier cambio que se produzca:

	$ echo '*.png diff=exif' >> .gitattributes
	$ git config diff.exif.textconv exiftool

Si sustituyes alguna de las imagenes en tu proyecto, y lanzas el comando 'git diff' obtendrás algo como:

	diff --git a/image.png b/image.png
	index 88839c4..4afcb7c 100644
	--- a/image.png
	+++ b/image.png
	@@ -1,12 +1,12 @@
	 ExifTool Version Number         : 7.74
	-File Size                       : 70 kB
	-File Modification Date/Time     : 2009:04:21 07:02:45-07:00
	+File Size                       : 94 kB
	+File Modification Date/Time     : 2009:04:21 07:02:43-07:00
	 File Type                       : PNG
	 MIME Type                       : image/png
	-Image Width                     : 1058
	-Image Height                    : 889
	+Image Width                     : 1056
	+Image Height                    : 827
	 Bit Depth                       : 8
	 Color Type                      : RGB with Alpha

Aquí se vé claramente que ha cambiado el tamaño del archivo y las dimensiones de la imagen.

## Expansión de palabras clave

Algunos usuarios de sistemas SVN o CVS, hechan de menos el disponer de expansiones de palabras clave al estilo de las que dichos sistemas tienen. El principal problema para hacerlo en Git reside en la imposibilidad de modificar los ficheros con información relativa a la confirmación de cambios (commit). Debido a que Git calcula sus sumas de comprobación antes de las confirmaciones. De todas formas, es posible inyectar textos en un archivo cuando lo extraemos del repositorio (checkout) y quitarlos de nuevo antes de devolverlo al repositorio (commit). Los atributos Git admiten dos maneras de realizarlo.

La primera, es inyectando automáticamente la suma de comprobación SHA-1 de un gran objeto binario (blob) en un campo '$Id$' dentro del archivo. Si colocas este attributo en un archivo o conjunto de archivos, Git lo sustituirá por la suma de comprobación SHA-1 la próxima vez que lo/s extraiga/s. Es importante destacar que no se trata de la suma SHA de la confirmación de cambios (commit), sino del propio objeto binario (blob):

	$ echo '*.txt ident' >> .gitattributes
	$ echo '$Id$' > test.txt

La próxima vez que extraigas el archivo, Git le habrá inyectado el SHA del objeto binario (blob):

	$ rm text.txt
	$ git checkout -- text.txt
	$ cat test.txt 
	$Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $

Pero esto tiene un uso bastante limitado. Si has utilizado alguna vez las sustituciones de CVS o de Subversion, sabrás que pueden incluir una marca de fecha, --la suma de comprobación SHA no es igual de util, ya que, por ser bastante aleatoria, es imposible deducir si una suma SHA es anterior o posterior a otra--.

Auque resulta que también puedes escribir tus propios filtros para realizar sustituciones en los archivos al guardar o recuperar (commit/checkout). Esos son los filtros "clean" y "smudge". En el archivo '.gitattibutes', puedes indicar filtros para carpetas o archivos determinados y luego preparar tus propios scripts para procesarlos justo antes de confirmar cambios en ellos ("clean", ver Figura 7-2), o justo antes de recuperarlos ("smudge", ver Figura 7-3). Estos filtros pueden utilizarse para realizar todo tipo de acciones útiles.


![](http://git-scm.com/figures/18333fig0702-tn.png)
 
Figura 7-2. El filtro "smudge" se usa al extraer (checkout).


![](http://git-scm.com/figures/18333fig0703-tn.png)
 
Figura 7-3. El filtro "clean" se usa al almacenar (staged).

El mensaje de confirmación para esta funcionalidad nos da un ejemplo simple: el de pasar todo tu código fuente C por el programa'indent' antes de almacenarlo. Puedes hacerlo poniendo los atributos adecuados en tu archivo '.gitattributes', para filtrar los archivos `*.c` a través de "indent":

	*.c     filter=indent

E indicando después que el filtro "indent" actuará al manchar (smudge) y al limpiar (clean):

	$ git config --global filter.indent.clean indent
	$ git config --global filter.indent.smudge cat

En este ejemplo, cuando confirmes cambios (commit) en archivos con extensión `*.c`, Git los pasará previamente a través del programa 'indent' antes de confirmarlos, y los pasará a través del programa 'cat' antes de extraerlos de vuelta al disco. El programa 'cat' es básicamente transparente: de él salen los mismos datos que entran. El efecto final de esta combinación es el de filtrar todo el código fuente C a través de 'indent' antes de confirmar cambios en él.

Otro ejemplo interesante es el de poder conseguir una expansión de la clave '$Date$' del estilo de RCS. Para hacerlo, necesitas un pequeño script que coja el nombre de un archivo, localice la fecha de la última confirmación de cambios en el proyecto, e inserte dicha información en el archivo. Este podria ser un pequeño script Ruby para hacerlo:

	#! /usr/bin/env ruby
	data = STDIN.read
	last_date = `git log --pretty=format:"%ad" -1`
	puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')

Simplemente, utiliza el comando 'git log' para obtener la fecha de la última confirmación de cambios, y  sustituye con ella todas las cadenas '$Date$' que encuentre en el flujo de entrada stdin; imprimiendo luego los resultados. --Debería de ser sencillo de implementarlo en cualquier otro lenguaje que domines.-- Puedes llamar 'expand_date' a este archivo y ponerlo en el path de ejecución. Tras ello, has de poner un filtro en Git (podemos llamarle 'dater'), e indicarle que use el filtro 'expand_date' para manchar (smudge) los archivos al extraerlos (checkout). Puedes utilizar una expresión Perl para limpiarlos (clean) al almacenarlos (commit):

	$ git config filter.dater.smudge expand_date
	$ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'

Esta expresión Perl extrae cualquier cosa que vea dentro de una cadena '$Date$', para devolverla a como era en un principio. Una vez preparado el filtro, puedes comprobar su funcionamiento preparando un archivo que contenga la clave '$Date$' e indicando a Git cual es el atributo para reconocer ese tipo de archivo:

	$ echo '# $Date$' > date_test.txt
	$ echo 'date*.txt filter=dater' >> .gitattributes

Al confirmar cambios (commit) y luego extraer (checkout) el archivo de vuelta, verás la clave sutituida:

	$ git add date_test.txt .gitattributes
	$ git commit -m "Testing date expansion in Git"
	$ rm date_test.txt
	$ git checkout date_test.txt
	$ cat date_test.txt
	# $Date: Tue Apr 21 07:26:52 2009 -0700$

Esta es una muestra de lo poderosa que puede resultar esta técnica para aplicaciones personalizadas. No obstante, debes de ser cuidadoso, ya que el archivo '.gitattibutes' se almacena y se transmite junto con el proyecto; pero no así el propio filtro, (en este caso, 'dater'), sin el cual no puede funcionar. Cuando diseñes este tipo de filtros, han de estar pensados para que el proyecto continue funcionando correctamente incluso cuando fallen.

## Exportación del repositorio

Los atributos de Git permiten realizar algunas cosas interesantes cuando exportas un archivo de tu proyecto.

### export-ignore

Puedes indicar a Git que ignore y no exporte ciertos archivos o carpetas cuando genera un archivo de almacenamiento. Cuando tienes alguna carpeta o archivo que no deseas incluir en tus registros, pero quieras tener controlado en tu proyecto, puedes marcarlos a través del atributo 'export-ignore'.

Por ejemplo, digamos que tienes algunos archivos de pruebas en la carpeta 'test/', y que no tiene sentido incluirlos en los archivos comprimidos (tarball) al exportar tu proyecto. Puedes añadir la siguiente línea al archivo de atributos de Git:

	test/ export-ignore

A partir de ese momento, cada vez que lances el comando 'git archive' para crear un archivo comprimido de tu proyecto, esa carpeta no se incluirá en él.

### export-subst

Otra cosa que puedes realizar sobre tus archivos es algún tipo de sustitución simple de claves. Git te permite poner la cadena '$Format:$' en cualquier archivo, con cualquiera de las claves de formateo de '--pretty=format' que vimos en el capítulo 2. Por ejemplo, si deseas incluir un archivo llamado 'LAST COMMIT' en tu proyecto, y poner en él automáticamente la fecha de la última confirmación de cambios cada vez que lances el comando 'git archive':

	$ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
	$ echo "LAST_COMMIT export-subst" >> .gitattributes
	$ git add LAST_COMMIT .gitattributes
	$ git commit -am 'adding LAST_COMMIT file for archives'

Cuando lances la orden 'git archive', lo que la gente verá en ese archivo cuando lo abra será:

	$ cat LAST_COMMIT
	Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$

## Estrategias de fusión

También puedes utilizar los atributos Git para indicar distintas estrategias de fusión para archivos específicos de tu proyecto. Una opción muy util es la que nos permite indicar a Git que no intente fusionar ciertos archivos concretos cuando tengan conflictos, manteniendo en su lugar tus archivos sobre los de cualquier otro.

Puede ser interesante si una rama de tu proyecto es divergente o esta especializada, pero deseas seguir siendo capaz de fusionar cambios de vuelta desde ella, e ignorar ciertos archivos. Digamos que tienes un archivo de datos denominado database.xml, distinto en las dos ramas, y que deseas fusionar en la otra rama sin perturbarlo. Puedes ajustar un atributo tal como:

	database.xml merge=ours

Al fusionar con otra rama, en lugar de tener conflictos de fusión con el archivo database.xml, obtendrás algo como:

	$ git merge topic
	Auto-merging database.xml
	Merge made by recursive.

Y el archivo database.xml permanecerá inalterado en cualquier que fuera la versión que tú tenias originalmente.
