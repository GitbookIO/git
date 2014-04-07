# El demonio Git

Para dar a tus proyectos un acceso público, sin autentificar, de solo lectura, querrás ir más allá del protocolo HTTP y comenzar a utilizar el protocolo Git. Principalmente, por razones de velocidad. El protocolo Git es mucho más eficiente y, por tanto, más rápido que el protocolo HTTP. Utilizándolo, ahorrarás mucho tiempo a tus usuarios.

Aunque, sigue siendo solo para acceso unicamente de lectura y sin autentificar. Si lo estás utilizando en un servidor fuera del perímetro de tu cortafuegos, se debe utilizar exclusivamente para proyectos que han de ser públicos, visibles para todo el mundo. Si lo estás utilizando en un servidor dentro del perímetro de tu cortafuegos, puedes utilizarlo para proyectos donde un gran número de personas o de ordenadores (integración contínua o servidores de desarrollo) necesiten acceso de solo lectura. Y donde quieras evitar la gestión de claves SSH para cada una de ellas.

En cualquier caso, el protocolo Git es relativamente sencillo de configurar. Tan solo necesitas lanzar este comando de forma demonizada:

	git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

El parámetro '--reuseaddr' permite al servidor reiniciarse sin esperar a que se liberen viejas conexiones; el parámetro '--base-path' permite a los usuarios clonar proyectos sin necesidad de indicar su camino completo; y el camino indicado al final del comando mostrará al demonio Git dónde buscar los repositorios a exportar. Si tienes un cortafuegos activo, necesitarás abrir el puerto 9418 para la máquina donde estás configurando el demónio Git.

Este proceso se puede demonizar de diferentes maneras, dependiendo del sistema operativo con el que trabajas. En una máquina Ubuntu, puedes usar un script de arranque. Poniendo en el siguiente archivo: 

	/etc/event.d/local-git-daemon

un script tal como: 

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

Por razones de seguridad, es recomendable lanzar este demonio con un usuario que tenga unicamente permisos de lectura en los repositorios --lo puedes hacer creando un nuevo usuario 'git-ro' y lanzando el demonio con él--.  Para simplificar, en estos ejemplos vamos a lanzar el demonio Git bajo el mismo usuario 'git' con el que hemos lanzado Gitosis.

Tras reiniciar tu máquina, el demonio Git arrancará automáticamente y se reiniciará cuando se caiga. Para arrancarlo sin necesidad de reiniciar la máquina, puedes utilizar el comando:

	initctl start local-git-daemon

En otros sistemas operativos, puedes utilizar 'xinetd', un script en el sistema 'sysvinit', o alguna otra manera --siempre y cuando demonizes el comando y puedas monitorizarlo--.

A continuación, has de indicar en tu servidor Gitosis a cuales de tus repositorios ha de permitir acceso sin autentificar por parte del servidor Git. Añadiendo una sección por cada repositorio, puedes indicar a cuáles permitirá leer el demonio Git. Por ejemplo, si quieres permitir acceso a tu 'proyecto iphone', puedes añadir lo siguiente al archivo 'gitosis.conf':

	[repo iphone_project]
	daemon = yes

Cuando confirmes (commit) y envies (push) estos cambios, el demonio que está en marcha en el servidor comenzará a responder a peticiones de cualquiera que solicite dicho proyecto a través del puerto 9418 de tu servidor.

Si decides no utilizar Gitosis, pero sigues queriendo utilizar un demonio Git, has de lanzar este comando en cada proyecto que desees servír vía el demonio Git:

	$ cd /path/to/project.git
	$ touch git-daemon-export-ok

La presencia de este archivo, indica a Git que está permitido el servir este proyecto sin necesidad de autentificación.

También podemos controlar a través de Gitosis los proyectos a ser mostrados por GitWeb. Previamente, has de añadir algo como esto al archivo '/etc/gitweb.conf':

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

Los proyectos a ser mostrados por GitWeb se controlarán añadiendo o quitando parámetros 'gitweb' en el archivo de configuración de Gitosis. Por ejemplo, si quieres mostrar el proyecto iphone, has de poner algo así como:

	[repo iphone_project]
	daemon = yes
	gitweb = yes

A partir de ese momento, cuando confirmes cambios (commit) y envies (push) el proyecto, GitWeb comenzará a mostrar tu proyecto iphone.
