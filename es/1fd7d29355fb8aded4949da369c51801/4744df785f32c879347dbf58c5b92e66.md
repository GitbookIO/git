# Configuración de Git

Como se ha visto brevemente en el capítulo 1, podemos acceder a los ajustes de configuración de Git a través del comando 'git config'. Una de las primeras acciones que has realizado con Git ha sido el configurar tu nombre y tu dirección de correo-e.

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Ahora vas a aprender un puñado de nuevas e interesantes opciones que puedes utilizar para personalizar el uso de Git.

Primeramente, vamos a repasar brevemente los detalles de configuración de Git que ya has visto en el primer capítulo. Para determinar su comportamiento no estandar, Git emplea una serie de archivos de configuración. El primero de ellos es el archivo '/etc/gitconfig', que contiene valores para todos y cada uno de los usuarios en el sistema y para todos sus repositorios. Con la opción '--system' del comando 'git config', puedes leer y escribir de/a este archivo. 

El segundo es el archivo '~/.gitconfig', específico para cada usuario. Con la opción '--global', 'git config' lee y escribe en este archivo. 

Y por último, Git también puede considerar valores de configuración presentes en el archivo '.git/config' de cada repositorio que estés utilizando. Estos valores se aplicarán únicamente a dicho repositorio. Cada nivel sobreescribe los valores del nivel anterior; es decir lo configurado en '.git/config' tiene primacia con respecto a lo configurado en '/etc/gitconfig', por ejemplo. También puedes ajustar estas configuraciones manualmente, editando directamente los archivos correspondientes y escribiendo en ellos con la sintaxis correspondiente; pero suele ser más sencillo hacerlo siempre a través del comando 'git config'.

## Configuración básica del cliente Git

Las opciones de configuración reconocidas por Git pueden distribuirse en dos grandes categorias: las del lado cliente y las del lado servidor. La mayoria de las opciones están en el lado cliente, --configurando tus preferencias personales de trabajo--. Aunque hay multitud de ellas, aquí vamos a ver solamente unas pocas. Las mas comunmente utilizadas o las que afectan significativamente a tu forma de trabajar. No vamos a revisar aquellas opciones utilizadas solo en casos muy especiales. Si quieres consultar una lista completa, con todas las opciones contempladas en tu versión de Git, puedes lanzar el comando:

	$ git config --help

La página de manual sobre 'git config' contiene una lista bastante detallada de todas las opciones disponibles.

### core.editor

Por defecto, Git utiliza cualquier editor que hayas configurado como editor de texto por defecto de tu sistema. O, si no lo has configurado, utilizará Vi como editor para crear y editar las etiquetas y mensajes de tus confirmaciones de cambio (commit). Para cambiar ese comportamiento, puedes utilizar el ajuste 'core.editor':

	$ git config --global core.editor emacs

A partir de ese comando, por ejemplo, git lanzará Emacs cada vez que vaya a editar mensajes; indistintamente del editor configurado en la línea de comandos (shell) del sistema.

### commit.template

Si preparas este ajuste para apuntar a un archivo concreto de tu sistema, Git lo utilizará como mensaje por defecto cuando hagas confirmaciones de cambio. Por ejemplo, imagina que creas una plantilla en '$HOME/.gitmessage.txt'; con un contenido tal como:

	subject line

	what happened

	[ticket: X]

Para indicar a Git que lo utilice como mensaje por defecto y que aparezca en tu editor cuando lances el comando 'git commit', tan solo has de ajustar 'commit.template':

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

A partir de entonces, cada vez que confirmes cambios (commit), tu editor se abrirá con algo como esto:

	subject line

	what happened

	[ticket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

Si tienes una política concreta con respecto a los mensajes de confirmación de cambios, puedes aumentar las posibilidades de que sea respetada si creas una plantilla acorde a dicha política y la pones como plantilla por defecto de Git.

### core.pager

El parámetro core.pager selecciona el paginador utilizado por Git cuando muestra resultados de comandos tales como 'log' o 'diff'. Puedes ajustarlo para que utilice 'more' o tu paginador favorito, (por defecto, se utiliza 'less'); o puedes anular la paginación si le asignas una cadena vacia.

	$ git config --global core.pager ''

Si lanzas esto, Git mostrará siempre el resultado completo de todos los comandos, independientemente de lo largo que sea este.

### user.signingkey

Si tienes costumbre de firmar tus etiquetas (tal y como se ha visto en el capítulo 2), configurar tu clave de firma GPG puede facilitarte la labor. Configurando tu clave ID de esta forma: 

	$ git config --global user.signingkey <gpg-key-id>

Puedes firmar etiquetas sin necesidad de indicar tu clave cada vez en el comando 'git tag'.

	$ git tag -s <tag-name>

### core.excludesfile

Se pueden indicar expresiones en el archivo '.gitignore' de tu proyecto para indicar a Git lo que debe considerar o no como archivos sin seguimiento, o lo que interará o no seleccionar cuando lances el comando 'git add', tal y como se indicó en el capítulo 2.  Sin embargo, si quieres disponer de otro archivo fuera de tus proyectos o tener expresiones extra, puedes indicarselo a Git con el parámetro 'core.excludesfile'. Simplemente, configuralo para que apunte a un archivo con contenido similar al que tendría cualquier archivo '.gitignore'.

### help.autocorrect

Este parámetro solo está disponible a partir de la versión 1.6.1 de Git. Cada vez que tienes un error de tecleo en un comando, Git 1.6 te muestra algo como:

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

Si ajustas 'help.autocorrect' a 1, Git lanzará automáticamente el comando corregido, (pero solo cuando haya únicamente uno que pueda encajar).

## Colores en Git

Git puede marcar con colores los resultados que muestra en tu terminal, ayudandote así a leerlos más facilmente. Hay unos cuantos parámetros que te pueden ayudar a configurar tus colores favoritos.

### color.ui

Si se lo pides, Git coloreará automáticamente la mayor parte de los resultados que muestre. Puedes ajustar con precisión cada una de las partes a colorear; pero si deseas activar de un golpe todos los colores por defecto, no tienes más que poner a "true" el parámetro 'color.ui'.

	$ git config --global color.ui true

Ajustando así este parámetro, Git colorea sus resultados cuando estos se muestran en un terminal. Otros ajustes posibles son "false", para indicar a Git no colorear nunca ninguno de sus resultados; y "always", para indicar colorear siempre, incluso cuando se redirija la salida a un archivo o a otro comando. Este parámetro se añadió en la versión 1.5.5 de Git. Si tienes una versión más antigua, tendrás que indicar especificamente todos y cada uno de los colores individualmente.

Será muy raro ajustar 'color.ui = always'. En la mayor parte de las ocasiones, cuando necesites códigos de color en los resultados, es mejor indicar puntualmente la opción '--color' en el comando concreto, para obligarle a utilizar códigos de color. Habitualmente, se trabajará con el ajuste 'color.ui = true'.

### `color.*`

Cuando quieras ajustar específicamente, comando a comando, donde colorear y cómo colorear, (o cuando tengas una versión antigua de Git), puedes emplear los ajustes particulares de color. Cada uno de ellos puede fijarse a 'true' (verdadero), 'false' (falso) o 'always' (siempre):

	color.branch
	color.diff
	color.interactive
	color.status

Además, cada uno de ellos tiene parámetros adiccionales para asignar colores a partes específicas, por si quieres precisar aún más. Por ejemplo, para mostrar la meta-información del comando 'diff' con letra azul sobre fondo negro y con caracteres en negrita, puedes indicar:

	$ git config --global color.diff.meta “blue black bold”

Puedes ajustar un color a cualquiera de los siguientes valores: 'normal' (normal), 'black' (negro), 'green' (verde), 'yellow' (amarillo), 'blue' (azul oscuro), 'magenta' (rojo oscuro), 'cyan' (azul claro) o 'white' (blanco). También puedes aplicar atributos tales como 'bold' (negrita), 'dim' (tenue), 'ul' ( ), 'blink' (parpadeante) y 'reverse (video inverso).

Mira en la página man de 'git config' si deseas tener explicaciones más detalladas.

## Herramientas externas para fusionar y para comparar

Aunque Git lleva una implementación interna de diff, la que se utiliza habitualmente, se puede sustituir por una herramienta externa. Puedes incluso configurar una herramienta gráfica para la resolución de conflictos, en lugar de resolverlos manualmente. Lo voy a demostrar configurando Perforce Visual Merge como herramienta para realizar las comparaciones y resolver conflictos; ya que es una buena herramienta gráfica y es libre.

Si lo quieres probar, P4Merge funciona en todas las principales plataformas. Los nombres de carpetas que utilizaré en los ejemplos funcionan en sistemas Mac y Linux; para Windows, tendrás que sustituir '/usr/local/bin' por el correspondiente camino al ejecutable en tu sistema.

P4Merge se puede descargar desde:

	http://www.perforce.com/perforce/downloads/component.html

Para empezar, tienes que preparar los correspondientes scripts para lanzar tus comandos. En estos ejemplos, voy a utilizar caminos y nombres Mac para los ejecutables; en otros sistemas, tendrás que sustituirlos por los correspondientes donde tengas instalado 'p4merge'. El primer script a preparar es uno al que denominaremos 'extMerge', para llamar al ejecutable con los correspodientes argumentos:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*

El script para el comparador, ha de asegurarse de recibir siete argumentos y de pasar dos de ellos al script de fusion (merge). Por defecto, Git pasa los siguientes argumentos al programa diff (comparador):

	path old-file old-hex old-mode new-file new-hex new-mode

Ya que solo necesitarás 'old-file' y 'new-file', puedes utilizar el siguiente script para extraerlos:

	$ cat /usr/local/bin/extDiff 
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

Además has de asegurarte de que estas herramientas son ejecutables:

	$ sudo chmod +x /usr/local/bin/extMerge 
	$ sudo chmod +x /usr/local/bin/extDiff

Una vez preparado todo esto, puedes ajustar el archivo de configuración para utilizar tus herramientas personalizadas de comparación y resolución de conflictos. Tenemos varios parámetros a ajustar: 'merge.tool' para indicar a Git la estrategia que ha de usar, `mergetool.*.cmd` para especificar como lanzar el comando, 'mergetool.trustExitCode' para decir a Git si el código de salida del programa indica una fusión con éxito o no, y 'diff.external' para decir a Git qué comando lanzar para realizar comparaciones.  Es decir, has de ejecutar cuatro comandos de configuración:

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

o puedes editar tu archivo '~/.gitconfig' para añadirle las siguientes lineas:

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

Tras ajustar todo esto, si lanzas comandos tales como:  $ git diff 32d1776b1 ^ 32d1776b1

En lugar de mostrar las diferencias por línea de comandos, Git lanzará P4Merge, que tiene una pinta como la de la Figura 7-1.


![](http://git-scm.com/figures/18333fig0701-tn.png)
 
Figura 7-1. P4Merge.

Si intentas fusionar (merge) dos ramas y tienes los consabidos conflictos de integración, puedes lanzar el comando 'git mergetool'; lanzará P4Merge para ayudarte a resolver los conflictos por medio de su interfaz gráfica.

Lo bonito de estos ajustes con scripts, es que puedes cambiar facilmente tus herramientas de comparación (diff) y de fusión (merge). Por ejemplo, para cambiar tus scripts 'extDiff' y 'extMerge' para utilizar KDiff3, tan solo has de editar el archivo 'extMerge:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh	
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

A partir de ahora, Git utilizará la herramienta KDiff3 para mostrar y resolver conflictos de integración.

Git viene preparado para utilizar bastantes otras herramientas de resolución de conflictos, sin necesidad de andar ajustando la configuración de cdm. Puedes utilizar kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff, o gvimdiff como herramientas de fusionado. Por ejemplo, si no te interesa utilizar KDiff3 para comparaciones, sino que tan solo te interesa utilizarlo para resolver conflictos de integración; teniendo kdiff3 en el path de ejecución, solo has de lanzar el comando:

	$ git config --global merge.tool kdiff3

Si utilizas este comando en lugar de preparar los archivos 'extMerge' y 'extDiff' antes comentados, Git utilizará KDiff3 para resolución de conflictos de integración y la herramienta estandar diff para las comparaciones.

## Formato y espacios en blanco

El formato y los espacios en blanco son la fuente de los problemas más sutiles y frustrantes que muchos desarrolladores se pueden encontrar en entornos colaborativos, especialmente si son multi-plataforma. Es muy facil que algunos parches u otro trabajo recibido introduzcan sutiles cambios de espaciado, porque los editores suelen hacerlo inadvertidamente o, trabajando en entornos multi-plataforma, porque programadores Windows suelen añadir retornos de carro al final de las lineas que tocan. Git dispone de algunas opciones de configuración para ayudarnos con estos problemas.

### core.autocrlf

Si estás programando en Windows o utilizando algún otro sistema, pero colaborando con gente que programa en Windows. Es muy posible que alguna vez te topes con problemas de finales de línea. Esto se debe a que Windows utiliza retorno-de-carro y salto-de-linea para marcar los finales de línea de sus archivos. Mientras que Mac y Linux utilizan solamente el caracter de salto-de-linea. Esta es una sutil, pero molesta, diferencia cuando se trabaja en entornos multi-plataforma. 

Git la maneja autoconvirtiendo los finales CRLF en LF al hacer confirmaciones de cambios (commit); y, viceversa, al extraer código (checkout) a la carpeta de trabajo. Puedes activar esta funcionalidad con el parámetro 'core.autocrlf'. Si estás trabajando en una máquina Windows, ajustalo a 'true', --para convertir finales LF en CRLF cuando extraigas código (checkout)--.

	$ git config --global core.autocrlf true

Si estás trabajando en una máquina Linux o Mac, entonces no te interesa convertir automáticamente los finales de línea al extraer código. Sino que te interesa arreglar los posibles CRLF que pudieran aparecer accidentalmente. Puedes indicar a Git que convierta CRLF en LF al confirmar cambios (commit), pero no en el otro sentido; utilizando también el parámetro 'core.autocrlf':

	$ git config --global core.autocrlf input

Este ajuste dejará los finales de línea CRLF en las extraciones de código (checkout), pero los finales LF en sistemas Mac o Linux y en el repositorio.

Si eres un programador Windows, trabajando en un entorno donde solo haya máquinas Windows, puedes desconectar esta funcionalidad. Para almacenar CRLFs en el repositorio. Ajustando el parámero a 'false':

	$ git config --global core.autocrlf false

### core.whitespace

Git viene preajustado para detectar y resolver algunos de los problemas más tipicos relacionados con los espacios en blanco. Puede vigilar acerca de cuatro tipos de problemas de espaciado --dos los tiene activados por defecto, pero se pueden desactivar; y dos vienen desactivados por defecto, pero se pueden activar--.

Los dos activos por defecto son 'trailing-space' (espaciado de relleno), que vigila por si hay espacios al final de las líneas, y 'space-before-tab' (espaciado delante de un tabulador), que mira por si hay espacios al principio de las lineas o por delante de los tabuladores.

Los dos inactivos por defecto son 'indent-with-non-tab' (indentado sin tabuladores), que vigila por si alguna línea empieza con ocho o mas espacios en lugar de con tabuladores; y 'cr-at-eol' (retorno de carro al final de línea), que vigila para que haya retornos de carro en todas las líneas.

Puedes decir a Git cuales de ellos deseas activar o desactivar, ajustando el parámetro 'core.whitespace' con los valores on/off separados por comas. Puedes desactivarlos tanto dejandolos fuera de la cadena de ajustes, como añadiendo el prefijo '-' delante del valor. Por ejemplo, si deseas activar todos menos 'cr-at-eol' puedes lanzar:

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

Git detectará posibles problemas cuando lance un comando 'git diff', e intentará destacarlos en otro color para que puedas corregirlos antes de confirmar cambios (commit). También pueden ser útiles estos ajustes cuando estás incorporando parches con 'git apply'. Al incorporar parches, puedes pedirle a Git que te avise específicamente sobre determinados problemas de espaciado:

	$ git apply --whitespace=warn <patch>

O puedes pedirle que intente corregir automáticamente los problemas antes de aplicar el parche:

	$ git apply --whitespace=fix <patch>

Estas opciones se pueden aplicar también al comando 'git rebase'. Si has confirmado cambios con problemas de espaciado, pero no los has enviado (push) aún "aguas arriba". Puedes realizar una reorganización (rebase) con la opción '--whitespace=fix' para que Git corrija automáticamente los problemas según va reescribiendo los parches.

## Configuración de Servidor

No hay tantas opciones de configuración en el lado servidor de Git. Pero hay unas pocas interesantes que merecen ser tenidas en cuenta.

### receive.fsckObjects

Por defecto, Git no suele comprobar la consistencia de todos los objetos que recibe durante un envio (push). Aunque Git tiene la capacidad para asegurarse de que cada objeto sigue casando con su suma de control SHA-1 y sigue apuntando a objetos válidos. No lo suele hacer en todos y cada uno de los envios (push). Es una operación costosa, que, dependiendo del tamaño del repositorio, puede llegar a añadir mucho tiempo a cada operación de envio (push). De todas formas, si deseas que Git compruebe la consistencia de todos los objetos en todos los envios, puedes forzarle a hacerlo ajustando a 'true' el parámetro 'receive.fsckObjects':

	$ git config --system receive.fsckObjects true

A partir de ese momento, Git comprobará la integridad del repositorio antes de aceptar ningún envio (push), para asegurarse de que no está introduciendo datos corruptos.

### receive.denyNonFastForwards

Si reorganizas (rebase) confirmaciones de cambio (commit) que ya habias enviado y tratas de enviarlas (push) de nuevo. O si intentas enviar una confirmación a una rama remota que no contiene la confirmación actualmente apuntada por la rama. Normalmente, la operación te será denegada por la rama remota sobre la que pretendias realizarla. Habitualmente, este es el comportamiento más adecuado. Pero, en el caso de las reorganizaciones, cuando estás totalmente seguro de lo que haces, puedes forzar el envio, utilizando la opción '-f' en el comando 'git push' a la rama remota.

Para impedir estos envios forzados de referencias de avance no directo (no fast-forward) a ramas remotas, es para lo que se emplea el parámetro 'receive.denyNonFastForwards':

	$ git config --system receive.denyNonFastForwards true

Otra manera de obtener el mismo resultado, es a través de los enganches (hooks) en el lado servidor. Enganches de los que hablaremos en breve. Esta otra vía te permite realizar ajustes más finos, tales como denegar refencias de avance no directo, (non-fast-forwards), unicamente a un grupo de usuarios.

### receive.denyDeletes

Uno de los cortocircuitos que suelen utilizar los usuarios para saltarse la politica de 'denyNonFastForwards', suele ser el borrar la rama y luego volver a enviarla de vuelta con la nueva referencia. En las últimas versiones de Git (a partir de la 1.6.1), se puede evitar poniendo a 'true' el parámetro 'receive.denyDeletes':

	$ git config --system receive.denyDeletes true

Esto impide el borrado de ramas o de etiquetas por medio de un envio a través de la mesa (push across the board), --ningún usuario lo podrá hacer--. Para borrar ramas remotas, tendrás que borrar los archivos de referencia manualmente sobre el propio servidor. Existen también algunas otras maneras más interesantes de hacer esto mismo, pero para usuarios concretos, a través de permisos (ACLs); tal y como veremos al final de este capítulo.
