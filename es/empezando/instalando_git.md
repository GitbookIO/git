# Instalando Git

Vamos a empezar a usar un poco de Git. Lo primero es lo primero: tienes que instalarlo. Puedes obtenerlo de varias maneras; las dos principales son instalarlo desde código fuente, o instalar un paquete existente para tu plataforma.

## Instalando desde código fuente

Si puedes, en general es útil instalar Git desde código fuente, porque obtendrás la versión más reciente. Cada versión de Git tiende a incluir útiles mejoras en la interfaz de usuario, por lo que utilizar la última versión es a menudo el camino más adecuado si te sientes cómodo compilando software desde código fuente. También ocurre que muchas distribuciones de Linux contienen paquetes muy antiguos; así que a menos que estés en una distribución muy actualizada o estés usando backports, instalar desde código fuente puede ser la mejor opción.

Para instalar Git, necesitas tener las siguientes librerías de las que Git depende: curl, zlib, openssl, expat, y libiconv. Por ejemplo, si estás en un sistema que tiene yum (como Fedora) o apt-get (como un sistema basado en Debian), puedes usar estos comandos para instalar todas las dependencias:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev

Cuando tengas todas las dependencias necesarias, puedes descargar la versión más reciente de Git desde su página web:

	http://git-scm.com/download

Luego compila e instala:

	$ tar -zxf git-1.6.0.5.tar.gz
	$ cd git-1.6.0.5
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Una vez hecho esto, también puedes obtener Git, a través del propio Git, para futuras actualizaciones:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Instalando en Linux

Si quieres instalar Git en Linux a través de un instalador binario, en general puedes hacerlo a través de la herramienta básica de gestión de paquetes que trae tu distribución. Si estás en Fedora, puedes usar yum:

	$ yum install git-core

O si estás en una distribución basada en Debian como Ubuntu, prueba con apt-get:

	$ apt-get install git

## Instalando en Mac

Hay dos maneras fáciles de instalar Git en un Mac. La más sencilla es usar el instalador gráfico de Git, que puedes descargar desde la página de Google Code (véase Figura 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Figura 1-7. Instalador de Git para OS X.

La otra manera es instalar Git a través de MacPorts (`http://www.macports.org`). Si tienes MacPorts instalado, instala Git con:

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

No necesitas añadir todos los extras, pero probablemente quieras incluir +svn en caso de que alguna vez necesites usar Git con repositorios Subversion (véase el Capítulo 8).

## Instalando en Windows

Instalar Git en Windows es muy fácil. El proyecto msysGit tiene uno de los procesos de instalación más sencillos. Simplemente descarga el archivo exe del instalador desde la página de GitHub, y ejecútalo:

	http://msysgit.github.com/

Una vez instalado, tendrás tanto la versión de línea de comandos (incluido un cliente SSH que nos será útil más adelante) como la interfaz gráfica de usuario estándar.
