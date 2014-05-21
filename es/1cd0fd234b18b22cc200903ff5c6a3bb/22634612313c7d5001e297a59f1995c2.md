# Submódulos

Suele ser frecuente encontrarse con la necesidad de utilizar otro proyecto desde dentro del que se está trabajando. En ocasiones como, por ejemplo, cuando se utiliza una biblioteca de terceros, o cuando se está desarrollando una biblioteca independiente para ser utilizada en múltiples proyectos. La preocupación típica en estos escenarios suele ser la de cómo conseguir tratar ambos proyectos separadamente. Pero conservando la habilidad de utilizar uno dentro del otro.

Un ejemplo concreto. Supongamos que se está desarrollando un site web y creando feeds Atom. En lugar de escribir código propio para generar los feeds Atom, se decide emplear una biblioteca ya existente. Y dicha biblioteca se incluye desde una biblioteca compartida tal como CPAN install o Ruby gem; o copiando directamente su código fuente en el árbol del propio proyecto. La problemática en el primer caso radica en la dificultad de personalizar la biblioteca compartida. Y en la dificultal para su despliegue; ya que es necesario que todos y cada uno de los clientes dispongan de ella.  La problemática en el segundo caso radica en las complicaciones para fusionar las personalizaciones realizadas por nosotros con futuras copias de la biblioteca original. 

Git resuelve estas problemáticas utilizando submódulos. Los submódulos permiten mantener un repositorio Git como una subcarpeta de otro repositorio Git. Esto permite clonar un segundo repositorio dentro del repositorio del proyecto en que se está trabajando, manteniendo separadamente las confirmaciones de cambios en ambos repositorios.

## Trabajando con submódulos

Suponiendo, por ejemplo, que se desea añadir la biblioteca Rack (un interface Ruby de pasarela de servidor web) al proyecto en que se está trabajando. Posiblemente con algunas personalizaciones, pero sin perder la capacidad de fusionar nuestros cambios con la evolución de la biblioteca original. La primera tarea a realizar es clonar el repositorio externo dento de una subcarpeta dentro del proyecto. Los proyectos externos se pueden incluir como submódulos mediante el comando `git submodule add`:

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.Resolving deltas: 100% (1951/1951), done.

A partir de este momento, el proyecto Rack está dentro de nuestro proyecto; bajo una subcarpeta denominada `rack`. En dicha subcarpeta es posible realizar cambios, añadir un repositorio propio a donde enviar (push) los cambios, recuperar (fetch) y fusionar (merge) desde el repositorio original, y mucho mas... Si se lanza `git status` nada mas añadir el submódulo, se aprecian dos cosas:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

Una: el archivo `.gitmodules`. un archivo de configuración para almacenar las relaciones entre la URL del proyecto y la subcarpeta local donde se ha colocado este.

	$ cat .gitmodules 
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

En caso de haber múltipes submódulos, habrá multiples entradas en este archivo. Merece destacar que este archivo está también bajo el control de versiones, como lo están otros archivos tal como `.gitignore`, por ejemplo. Y será enviado (push) y recibido (pull) junto con el resto del proyecto. Así es como otras personas que clonen el proyecto pueden saber dónde encontrar los submódulos del mismo.

Dos: la entrada `rack`. Si se lanza un `git diff` sobre ella, se puede apreciar algo muy interesante:

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Aunque `rack` es una subcarpeta de la carpeta de trabajo, git la contempla como un submódulo y no realiza seguimiento de sus contenidos si no se está situado directamente sobre ella.  En su lugar, Git realiza confirmaciones de cambio particulares en ese repositorio. Cuando se realizan y confirman cambios en esa subcarpeta, el proyecto padre detecta el cambio en HEAD y almacena la confirmación de cambios concreta en la que se esté trabajando en ese momento. De esta forma, cuando otras personas clonen este proyecto, sabrán cómo recrear exactamente el entorno.

Esto es importante al trabajar con submódulos: siempre son almacenados como la confirmación de cambios concreta en la que están. No es posible almacenar un submódulo en `master` o en cualquier otra referencia simbólica.

Cuando se realiza una confirmación de cambios, se suele ver algo así como:

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

Notese el modo 160000 para la entrada `rack`. Este es un modo especial de Git, un modo en el que la confirmación de cambio se almacena como una carpeta en lugar de como una subcarpeta o un archivo.

Se puede considerar la carpeta `rack` como si fuera un proyecto separado. Y, como tal, de vez en cuando se puede actualizar el proyecto padre con un puntero a la última confirmación de cambios en dicho subproyecto. Todos los comandos Git actuan independientemente en ambas carpetas:

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

## Clonando un proyecto con submódulos

Si se tiene un proyecto con submódulos dentro de él. Cuando se recibe, se reciben también las carpetas que contienen los submódulos; pero no se reciben ninguno de los archivos de dichos submódulos:

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

La carpeta `rack` está presente, pero vacia. Son necesarios otros dos comandos: `git submodule init` para inicializar el archivo de configuración local, y `git submodule update` para recuperar (fetch) todos los datos del proyecto y extraer (checkout) la confirmación de cambios adecuada desde el proyecto padre:

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

Tras esto, la carpeta `rack` sí que está exactamente en el estado que le corresponde estar tras la última confirmación de cambios que se realizó sobre ella. Si otra persona realiza cambios en el código de `rack`, los confirma y nosotros recuperamos (pull) dicha referencia y la fusionamos (merge), se obtendrá un resultado un tanto extraño:

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

Se ha fusionado en algo que es básicamente un cambio en el puntero al submódulo. Pero no se ha actualizado el código en la carpeta del submódulo propiamente dicha. Por lo que se muestra un estado inconsistente en la misma:

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Siendo esto debido a que el puntero al submódulo que se tiene en este momento  no corresponde a lo que realmente hay en carpeta del submódulo. Para arreglarlo, es necesario lanzar de nuevo el comando `git submodule update`: 

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

Se necesita realizar este paso cada vez que se recupere (pull) un cambio del submódulo en el proyecto padre. Es algo extraño, pero ¡funciona!.

Un problema típico se suele dar cuando un desarrollador realiza y confirma (commit) un cambio local en el submódulo, pero no lo envia (push) a un servidor público. Pero, sin embargo, sí que confirma (commit) y envia (push) un puntero a dicho estado dentro del proyecto padre. Cuando otros desarrolladores intenten lanzar un `git submodule update`, será imposible encontrar la confirmación de cambios a la que se refiere el submódulo, ya que esta tan solo existe en el sistema del desarrollador original. En estos casos, se suele ver un error tal como:

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

Forzandonos a mirar quién ha sido la persona que ha realizado los últimos cambios en el submódulo:

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

Para enviarle un correo-e y avisarle de su despiste.

## Proyectos padre

Algunas veces, dependiendo del equipo de trabajo en que se encuentren, los desarrolladores suelen necesitar mantener una combinación de grandes carpetas de proyecto. Se da frecuentemente en equipos procedentes de CVS o de Subversion (donde se define una colección de módulos o carpetas), cuando desean mantener ese mismo tipo de flujo de trabajo.

La manera más apropiada de hacer esto en Git, es la de crear diferentes repositorios, cada uno en su carpeta; para luego crear un repositorio padre que englobe múltiples submódulos, uno por cada carpeta. Un beneficio que se obtiene de esta manera de trabajar es la mayor especificidad en las relaciones entre proyectos, definidas mediante etiquetas (tag) y ramas (branch) en el proyecto padre.

## Posibles problemáticas al usar submódulos

El uso de submódulos tiene también sus contratiempos. El primero de los cuales es la necesidad de ser bastante cuidadoso cuando se trabaja en la carpeta de un submódulo. Al lanzar `git submodule update`, este comando comprueba la versión específica del proyecto, pero sin tener en cuenta la rama. Es lo que se conoce como "trabajar con cabecera desconectada" --es decir, el archivo HEAD apunta directamente a una confirmación de cambios (commit), y no a una referencia simbólica--. Este método de trabajo suele tenderse a evitar, ya que trabajando en un entorno de cabecera desconectada es bastante facil despistarse y perder cambios ya realizados. Si se realiza un `submodule update` inicial, se hacen cambios y se confirman en esa carpeta de submódulo sin haber creado antes una rama en la que trabajar. Y si, tras esto, se realiza de nuevo un `git submodule update` desde el proyecto padre, sin haber confirmado cambios en este, Git sobreescribirá cambios sin aviso previo.  Técnicamente, no se pierde nada del trabajo. Simplemente, nos quedamos sin ninguna rama apuntando a él. Con lo que resulta problemático recuperar el acceso a los cambios.

Para evitarlo, siempre se ha de crear una rama cuando se trabaje en la carpeta de un submódulo; usando  `git checkout -b trabajo` o algo similar. Cuando se realice una actualización (update) del submódulo por segunda vez, se seguirá sobreescribiendo el trabajo; pero al menos se tendrá un apuntador para volver hasta los cambios realizados.

Intercambiar ramas con submódulos tiene también sus peculiaridades. Si se crea una rama, se añade un submódulo en ella y luego se retorna a una rama donde dicho submódulo no exista. La carpeta del submódulo sigue existiendo, solo que ahora queda como una carpeta sin seguimiento.

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.Resolving deltas: 100% (1952/1952), done.Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/

Forzandonos a removerla del camino. Lo cual obliga a volver a clonarla cuando se retome la rama inicial --con la consiguiente pérdida de los cambios locales si estos no habian sido enviados previamente al servidor--.

Y una última problemática en que se suelen encontrar quienes intercambian de carpetas a submódulos. Si se ha estado trabajando en archivos de un proyecto al que luego se desea convertir en un submódulo, hay que ser muy cuidadoso o Git se resentirá. Asumiendo que se tenian archivos en una carpeta 'rack' del proyecto, y que se desea intercambiarla por un submódulo. Si se borra la carpeta y luego se lanza un comando `submodule add`, Git avisará de "carpeta ya existente en el índice":

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

Para evitarlo, se debe sacar la carpeta 'rack' del área de preparación. Después, Git permitirá la adicción del submódulo sin problemas:

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.Resolving deltas: 100% (1952/1952), done.Resolving deltas: 100% (1952/1952), done.

Tras esto, y suponiendo que ese paso ha sido realizado en una rama. Si se intenta retornar a dicha rama, cuyos archivos están aún en el árbol actual en lugar de en el submódulo, se obtendrá el siguiente error:

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

Antes de cambiar a cualquier rama que no lo contenga, es necesario quitar de enmedio la carpeta del submódulo 'rack'.

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

Y, cuando se retorne a la rama anterior, se tendrá una carpeta 'rack' vacia. Ante lo cual, será necesario lanzar`git submodule update` para volver a clonarla; o, si no,  volver a restaurar la carpeta  `/tmp/rack` de vuelta sobre la carpeta vacia.
