# Acceso público

¿Qué hacer si necesitas acceso anónimo de lectura a tu proyecto? Por ejemplo, si en lugar de albergar un proyecto privado interno, quieres albergar un proyecto de código abierto. O si tienes un grupo de servidores de integración automatizados o servidores de integración continua que cambian muy a menudo, y no quieres estar todo el rato generando claves SSH. Es posible que desees añadirles un simple acceso anónimo de lectura.

La manera más sencilla de hacerlo para pequeños despliegues, es el preparar un servidor web estático cuya raiz de documentos sea la ubicación donde tengas tus repositorios Git; y luego activar el anclaje (hook) 'post-update' que se ha mencionado en la primera parte de este capítulo. Si utilizamos el mismo ejemplo usado anteriormente, suponiendo que tengas los repositorios en la carpeta '/opt/git', y que hay un servidor Apache en marcha en tu máquina. Veremos algunas configuraciones básicas de Apache, para que puedas hacerte una idea de lo que puedes necesitar. (Recordar que esto es solo un ejemplo, y que puedes utilizar cualquier otro servidor web.)

Lo primero, es activar el anclaje (hook):

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Si utilizas una versión de Git anterior a la 1.6, el comando 'mv' no es necesario, ya que solo recientemente lleva Git los anclajes de ejemplo con el sufijo .sample 

¿Que hace este anclaje 'post-update'? Pues tiene una pinta tal como:

	$ cat .git/hooks/post-update 
	#!/bin/sh
	exec git-update-server-info

Lo que significa que cada vez que envias (push) algo al servidor vía SSH, Git lanzará este comando y actualizará así los archivos necesarios para HTTP fetching. (_i_pendientedetraducir) 

A continuación, has de añadir una entrada VirtualHost al archivo de configuración de Apache, fijando su raiz de documentos a la ubicación donde tengas tus proyectos Git. Aquí, estamos asumiendo que tienes un DNS comodin para redirigir `*.gitserver` hacia cualquier máquina que estés utilizando para todo esto:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

Asimismo, has de ajustar el grupo Unix de las carpetas bajo '/opt/git' a 'www-data', para que tu servidor web tenga acceso de lectura a los repositorios contenidos en ellas; porque la instancia de Apache que maneja los scripts CGI trabaja bajo dicho usuario:

	$ chgrp -R www-data /opt/git

Una vez reinicies Apache, ya deberias ser capaz de clonar tus repositorios bajo dicha carpeta, simplemente indicando la URL de tu projecto:

	$ git clone http://git.gitserver/project.git

De esta manera, puedes preparar en cuestión de minutos accesos de lectura basados en HTTP a tus proyectos, para grandes cantidades de usuarios. Otra opción simple para habilitar accesos públicos sin autentificar, es arrancar el demonio Git, aunque esto supone demonizar el proceso. (Se verá esta opción en la siguiente sección.)
