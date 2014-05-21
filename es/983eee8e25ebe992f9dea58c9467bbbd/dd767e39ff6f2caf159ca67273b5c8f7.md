# Gitosis

Mantener claves públicas, para todos los usuarios, en el archivo 'authorized_keys', puede ser una buena solución inicial. Pero, cuanto tengas cientos de usuarios, se hace bastante pesado gestionar así ese proceso. Tienes que iniciar sesión en el servidor cada vez. Y, ademas, no tienes control de acceso --todo el mundo presente en el archivo tiene permisos de lectura y escritura a todos y cada uno de los proyectos--.

En este punto, es posible que desees cambiar a un popular programa llamado Gitosis. Gitosis es básicamente un conjunto de scripts que te ayudarán a gestionar el archivo 'authorized_keys', así como a implementar algunos controles de acceso simples. Lo interesante de la interfaz de usuario para esta herramienta de gestión de usuarios y de control de accesos, es que, en lugar de un interface web, es un repositorio especial de Git. Preparas la información en ese proyecto especial, y cuando la envias (push), Gitosis reconfigura el servidor en base a ella. ¡Realmente interesante!.

Instalar Gitosis no es precisamente sencillo. Pero tampoco demasiado complicado. Es más sencillo hacerlo si utilizas un servidor Linux --estos ejemplos se han hecho sobre un servidor Ubuntu 8.10--.

Gitosis necesita de ciertas herramientas Python, por lo que la  primera tarea será instalar el paquete de herramientas Pyton. En Ubuntu viene como el paquete python-setuptools:

	$ sudo apt-get install python-setuptools

A continuación, has de clonar e instalar Gitosis desde el repositorio principal de su proyecto:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

Esto instala un par de ejecutables, que serán los que Gitosis utilice. Gitosis intentará instalar sus repositorios bajo la carpeta '/home/git', lo cual está bien. Pero si, en lugar de en esa, has instalado tus repositorios bajo la carpeta '/opt/git'. Sin necesidad de reconfigurarlo todo, tan solo has de crear un enlace virtual:

	$ ln -s /opt/git /home/git/repositories

Gitosis manejará tus claves por tí, por lo que tendrás que quitar el archivo actual, añadir de nuevo las claves más tarde, y dejar que Gitosis tome automáticamente el control del archivo 'authorized_keys'. Para empezar, mueve el archivo 'authorized_keys a otro lado:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

A continuación, restaura el inicio de sesión (shell) para el usuario 'git', (si es que lo habias cambiado al comando 'git-shell'). Los usuarios no podrán todavia iniciar sesión, pero Gitosis se encargará de ello. Así pues, cambia esta línea en tu archivo '/etc/passwd':

	git:x:1000:1000::/home/git:/usr/bin/git-shellgit:x:1000:1000::/home/git:/usr/bin/git-shell

de vuelta a:

	git:x:1000:1000::/home/git:/bin/shgit:x:1000:1000::/home/git:/bin/sh

Y, en este punto, ya podemos inicializar Gitosis. Lo puedes hacer lanzando el comando 'gitosis-init' con tu clave pública personal. Si tu clave pública personal no está en el servidor, la has de copiar a él:

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Esto habilita al usuario con dicha clave pública para que pueda modificar el repositorio principal de Git, y, con ello, pueda controlar la instalación de Gitosis. A continuanción, has de ajustar manualmente el bit de ejecución en el script 'post-update' de tu nuevo repositorio de contrrol:

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Y ya estás preparado para trabajar. Si lo has configurado todo correctamente, puedes intentar conectarte, vía SSH, a tu servidor como el usuario con cuya clave pública has inicializado Gitosis. Y deberás ver algo así como esto:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	fatal: unrecognized command 'gitosis-serve schacon@quaternion'
	  Connection to gitserver closed.

Indicandote que Gitosis te ha reconocido, pero te está hechando debido a que no estás intentando lanzar ningún comando Git. Por tanto, intentalo con un comando Git real --por ejemplo, clonar el propio repositorio de control de Gitosis a tu ordenador personal-- 
	
	$ git clone git@gitserver:gitosis-admin.git

Con ello, tendrás una carpeta denominada 'gitosis-admin', con dos partes principales dentro de ella:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

El archivo 'gitosis.conf' es el archivo de control que usarás para especificar usuarios, repositorios y permisos. La carpeta 'keydir' es donde almacenarás las claves públicas para los usuarios con acceso a tus repositorios --un archivo por usuario--. El nombre del archivo en la carpeta 'keydir' ('scott.pub' en el ejemplo), puede ser diferente en tu instalación, (Gitosis lo obtiene a partir de la descripción existente al final de la clave pública que haya sido importada con el script 'gitosis-init').

Si miras dentro del archivo 'gitosis.conf', encontrarás únicamente información sobre el proyecto 'gitosis-admin' que acabas de clonar:

	$ cat gitosis.conf 
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

Indicando que el usuario 'scott' --el usuario con cuya clave pública se ha inicializado Gitosis-- es el único con acceso al proyecto 'gitosis-admin'.

A partir de ahora, puedes añadir nuevos proyectos. Por ejemplo, puedes añadir una nueva sección denominada 'mobile', donde poner la lista de los desarrolladores en tu equipo movil y los proyectos donde estos vayan a trabajar. Por ser 'scott' el único usuario que tienes definido por ahora, lo añadirás como el único miembro. Y puedes crear además un proyecto llamado 'iphone_project' para empezar:

	[group mobile]
	writable = iphone_project
	members = scott

Cada cambio en el proyecto 'gitosis-admin', lo has de confirmar (commit) y enviar (push) de vuelta al servidor, para que tenga efecto sobre él:

	$ git commit -am 'add iphone_project and mobile group'
	[master]: created 8962da8: "changed name"
	 1 files changed, 4 insertions(+), 0 deletions(-)
	$ git push
	Counting objects: 5, done.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 272 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	To git@gitserver:/opt/git/gitosis-admin.git
	   fb27aec..8962da8  master -> master

Puedes crear tu nuevo proyecto 'iphone_project' simplemente añadiendo tu servidor como un remoto a tu versión local del proyecto de control y enviando (push). Ya no necesitarás crear manualmente repositorios básicos vacios para los nuevos proyectos en el servidor. Gitosis se encargará de hacerlo por tí, en cuanto realices el primer envio (push) de un nuevo proyecto:

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Ten en cuenta que no es necesario indicar expresamente un camino (path), --de hecho, si lo haces, no funcionará--. Simplemente, has de poner un punto y el nombre del proyecto, --Gitosis se encargará de encontrarlo--.

Si deseas compartir el proyecto con tus compañeros, tienes que añadir de nuevo sus claves públicas. Pero en lugar de hacerlo manualmente sobre el archivo `~/.ssh/authorized_keys` de tu servidor, has de hacerlo --un archivo por clave-- en la carpeta 'keydir' del proyecto de control. Según pongas los nombres a estos archivos, así tendrás que referirte a los usuarios en el archivo 'gitosis.conf'. Por ejemplo, para añadir las claves públicas de John, Josie y Jessica:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Y para añadirlos al equipo 'mobile', dándoles permisos de lectura y escritura sobre el proyecto 'phone_project':

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

Tras confirmar (commit) y enviar (push) estos cambios, los cuatro usuarios podrán acceder a leer y escribir sobre el proyecto.

Gitosis permite también sencillos controles de acceso. Por ejemplo, si quieres que John tenga únicamente acceso de lectura sobre el proyecto, puedes hacer:

	[group mobile]
	writable = iphone_project
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_project
	members = john

Habilitandole así para clonar y recibir actualizaciónes desde el servidor; pero impidiendole enviar de vuelta cambios al proyecto. Puedes crear tantos grupos como desees, para diferentes usuarios y proyectos. También puedes indicar un grupo como miembro de otro (utilizado el prefijo '@'), para incluir todos sus miembros automáticamente:

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_project
	members   = @mobile_committers

	[group mobile_2]
	writable  = another_iphone_project
	members   = @mobile_committers john

Si tienes problemas, puede ser util añadir `loglevel=DEBUG` en la sección `[gitosis]`. Si, por lo que sea, pierdes acceso de envio (push) de nuevos cambios, (por ejemplo, tras haber enviado una configuración problemática); siempre puedes arreglar manualmente ,en el propio servidor, el archivo '/home/git/.gitosis.conf', (el archivo del que Gitosis lee su configuración). Un envio (push) de cambios al proyecto, coge el archivo 'gitosis.conf' enviado y sobreescribe con él el del servidor. Si lo editas manualmente, permanecerá como lo dejes; hasta el próximo envio (push) al proyecto 'gitosis-admin'.
