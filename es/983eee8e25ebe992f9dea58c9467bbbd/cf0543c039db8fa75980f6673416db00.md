# GitWeb

Ahora que ya tienes acceso básico de lectura/escritura y de solo-lectura a tu proyecto, puedes querer instalar un visualizador web. Git trae un script CGI, denominado GitWeb, que es el que usaremos para este propósito. Puedes ver a GitWeb en acción en sitios como `http://git.kernel.org` (ver figura 4-1)


![](http://git-scm.com/figures/18333fig0401-tn.png)
 
Figura 4-1. El interface web GitWeb.

Si quieres comprobar cómo podría quedar GitWeb con tu proyecto, Git dispone de un comando para activar una instancia temporal, si en tu sistema tienes un servidor web ligero, como por ejemplo 'lighttup' o 'webrick'. En las máquinas Linux, 'lighttpd' suele estar habitualmente instalado. Por lo que tan solo has de activarlo lanzando el comando 'git instaweb', estando en la carpeta de tu proyecto. Si tienes una máquina Mac, Leopard trae preinstalado Ruby, por lo que 'webrick' puede ser tu mejor apuesta. Para instalar 'instaweb' disponiendo de un controlador no-lighttpd, puedes lanzarlo con la opción '--httpd'.  

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Esto arranca un servidor HTTPD en el puerto 1234, y luego arranca un navegador que abre esa página. Es realmente sencillo. Cuando ya has terminado y quieras apagar el servidor, puedes lanzar el mismo comando con la opción '--stop'.

	$ git instaweb --httpd=webrick --stop

Si quieres disponer permanentemente de un interface web para tu equipo o para un proyecto de código abierto que alberges, necesitarás ajustar el script CGI para ser servido por tu servidor web habitual. Algunas distribuciones Linux suelen incluir el paquete 'gitweb', y podrás instalarlo a través de las utilidades 'apt' o 'yum'; merece la pena probarlo en primer lugar. Enseguida vamos a revisar el proceso de instalar GitWeb manualmente. Primero, necesitas el código fuente de Git, que viene con GitWeb, para generar un script CGI personalizado:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb/gitweb.cgi
	$ sudo cp -Rf gitweb /var/www/

Fijate que es necesario indicar la ubicación donde se encuentran los repositorios Git, utilizando la variable 'GITWEB_PROJECTROOT'. A continuación, tienes que preparar Apache para que utilice dicho script, Para ello, puedes añadir un VirtualHost:

	<VirtualHost *:80>
	    ServerName gitserver
	    DocumentRoot /var/www/gitweb
	    <Directory /var/www/gitweb>
	        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
	        AllowOverride All
	        order allow,deny
	        Allow from all
	        AddHandler cgi-script cgi
	        DirectoryIndex gitweb.cgi
	    </Directory>
	</VirtualHost>

Recordar una vez más que GitWeb puede servirse desde cualquier servidor web con capacidades CGI. Por lo que si prefieres utilizar algún otro, no debería ser dificil de configurarlo. En este momento, deberias poder visitar 'http://gitserver/' para ver tus repositorios online. Y utilizar 'http://git.gitserver' para clonar (clone) y recuperar (fetch) tus repositorios a través de HTTP.
