# Los Protocolos

Git puede usar cuatro protocolos principales para transferir datos: Local, Secure Shell (SSH), Git y HTTP. Vamos a ver en qué consisten y las circunstancias en que querrás (o no) utilizar cada uno de ellos.

Merece destacar que, con la excepción del protocolo HTTP, todos los demás protocolos requieren que Git esté instalado y operativo en el servidor.

## Protocolo Local

El más básico es el _Protocolo Local_, donde el repositorio remoto es simplemente otra carpeta en el disco. Se utiliza habitualmente cuando todos los miembros del equipo tienen acceso a un mismo sistema de archivos, como por ejemplo un punto de montaje NFS, o en los casos en que todos se conectan al mismo ordenador. Aunque este último caso no es precisamente el ideal, ya que todas las instancias del repositorio estarían en la misma máquina; aumentando las posibilidades de una pérdida catastrófica.

Si dispones de un sistema de archivos compartido, podrás clonar (clone), enviar (push) y recibir (pull) a/desde repositorios locales basado en archivos. Para clonar un repositorio como estos, o para añadirlo como remoto a un proyecto ya existente, usa el camino (path) del repositorio como su URL. Por ejemplo, para clonar un repositorio local, puedes usar algo como:

	$ git clone /opt/git/project.git

O como:

	$ git clone file:///opt/git/project.git

Git trabaja ligeramente distinto si indicas 'file://' de forma explícita al comienzo de la URL. Si escribes simplemente el camino, Git intentará usar enlaces rígidos (hardlinks) o copiar directamente los archivos que necesita. Si escribes con el prefijo 'file://', Git lanza el proceso que usa habitualmente para transferir datos sobre una red; proceso que suele ser mucho menos eficiente. La única razón que puedes tener para indicar expresamente el prefijo 'file://' puede ser el querer una copia limpia del repositorio, descartando referencias u objetos superfluos. Normalmente, tras haberlo importado desde otro sistema de control de versiones o algo similar (ver el Capítulo 9 sobre tareas de mantenimiento). Habitualmente, usaremos el camino (path) normal por ser casi siempre más rápido.

Para añadir un repositorio local a un proyecto Git existente, puedes usar algo como:

	$ git remote add local_proj /opt/git/project.git

Con lo que podrás enviar (push) y recibir (pull) desde dicho remoto exactamente de la misma forma a como lo harías a través de una red.

## Ventajas

Las ventajas de los repositorios basados en carpetas y archivos, son su simplicicidad y el aprovechamiento de los permisos preexistentes de acceso. Si tienes un sistema de archivo compartido que todo el equipo pueda usar, preparar un repositorio es muy sencillo. Simplemente pones el repositorio básico en algún lugar donde todos tengan acceso a él y ajustas los permisos de lectura/escritura según proceda, tal y como lo harías para preparar cualquier otra carpeta compartida. En la próxima sección, "Disponiendo Git en un servidor", veremos cómo exportar un repositorio básico para conseguir esto.

Este camino es también util para recuperar rápidamente el contenido del repositorio de trabajo de alguna otra persona. Si tu y otra persona estais trabajando en el mismo proyecto y ella quiere mostrarte algo, el usar un comando tal como 'git pull /home/john/project' suele ser más sencillo que el que esa persona te lo envie (push) a un servidor remoto y luego tú lo recojas (pull) desde allí.

## Desventajas

La principal desventaja de los repositorios basados en carpetas y archivos es su dificultad de acceso desde distintas ubicaciones. Por ejemplo, si quieres enviar (push) desde tu portátil cuando estás en casa, primero tienes que montar el disco remoto; lo cual puede ser dificil y lento, en comparación con un acceso basado en red.

Cabe destacar también que una carpeta compartida no es precisamente la opción más rápida. Un repositorio local es rápido solamente en aquellas ocasiones en que tienes un acceso rápido a él. Normalmente un repositorio sobre NFS es más lento que un repositorio SSH en el mismo servidor, asumiendo que las pruebas se hacen con Git sobre discos locales en ambos casos. 

## El Procotolo SSH

Probablemente, SSH sea el protocolo más habitual para Git. Debido a disponibilidad en la mayor parte de los servidores; (pero, si no lo estuviera disponible, además es sencillo habilitarlo). Por otro lado, SSH es el único protocolo de red con el que puedes facilmente tanto leer como escribir. Los otros dos protocolos de red (HTTP y Git) suelen ser normalmente protocolos de solo-lectura; de tal forma que, aunque los tengas disponibles para el público en general, sigues necesitando SSH para tu propio uso en escritura. Otra ventaja de SSH es el su mecanismo de autentificación, sencillo de habilitar y de usar.

Para clonar un repositorio a través de SSH, puedes indicar una URL ssh:// tal como:

	$ git clone ssh://user@server/project.git

O puedes prescindir del protocolo; Git asume SSH si no indicas nada expresamente: $ git clone user@server:project.git

 Pudiendo asimismo prescindir del usuario; en cuyo caso Git asume el usuario con el que estés conectado en ese momento.

## Ventajas

El uso de SSH tiene múltiples ventajas. En primer lugar, necesitas usarlo si quieres un acceso de escritura autentificado a tu repositorio. En segundo lugar, SSH es sencillo de habilitar. Los demonios (daemons) SSH son de uso común, muchos administradores de red tienen experiencia con ellos y muchas distribuciones del SO los traen predefinidos o tienen herramientas para gestionarlos. Además, el acceso a través de SSH es seguro, estando todas las transferencias encriptadas y autentificadas. Y, por último, al igual que los procolos Git y Local, SSH es eficiente, comprimiendo los datos lo más posible antes de transferirlos.

## Desventajas

El aspecto negativo de SSH es su imposibilidad para dar acceso anónimo al repositorio. Todos han de tener configurado un acceso SSH al servidor, incluso aunque sea con permisos de solo lectura; lo que no lo hace recomendable para soportar proyectos abiertos. Si lo usas únicamente dentro de tu red corporativa, posiblemente sea SSH el único procolo que tengas que emplear. Pero si quieres también habilitar accesos anónimos de solo lectura, tendrás que reservar SSH para tus envios (push) y habilitar algún otro protocolo para las recuperaciones (pull) de los demás.

## El Protocolo Git

El protocolo Git  es un demonio (daemon) especial, que viene incorporado con Git. Escucha por un puerto dedicado (9418), y nos da un servicio similar al del protocolo SSH; pero sin ningún tipo de autentificación. Para que un repositorio pueda exponerse a través del protocolo Git, tienes que crear en él un archivo 'git-daemon-export-ok'; sin este archivo, el demonio no hará disponible el repositorio. Pero, aparte de esto, no hay ninguna otra medida de seguridad. O el repositorio está disponible para que cualquiera lo pueda clonar, o no lo está. Lo cual significa que, normalmente, no se podrá enviar (push) a través de este protocolo. Aunque realmente si que puedes habilitar el envio, si lo haces, dada la total falta de ningún mecanismo de autentificación, cualquiera que encuentre la URL a tu proyecto en Internet, podrá enviar (push) contenidos a él. Ni que decir tiene que esto solo lo necesitarás en contadas ocasiones.

## Ventajas

El protocolo Git es el más rápido de todos los disponibles. Si has de servir mucho tráfico de un proyecto público o servir un proyecto muy grande, que no requiera autentificación para leer de él, un demonio Git es la respuesta. Utiliza los mismos mecanismos de transmisión de datos que el protocolo SSH, pero sin la sobrecarga de la encriptación ni de la autentificación.

## Desventajas

La pega del protocolo Git, es su falta de autentificación. No es recomendable tenerlo como único protocolo de acceso a tus proyectos. Habitualmente, lo combinarás con un acceso SSH para los pocos desarrolladores con acceso de escritura que envien (push) material. Usando 'git://' para los accesos solo-lectura del resto de personas.
Por otro lado, es también el protocolo más complicado de implementar. Necesita activar su propio demonio, (tal y como se explica en la sección "Gitosis", más adelante, en este capítulo); y necesita configurar 'xinetd' o similar, lo cual no suele estar siempre disponible en el sistema donde estés trabajando. Requiere además abrir expresamente acceso al puerto 9418 en el cortafuegos, ya que este no es uno de los puertos estandares que suelen estar habitualmente permitidos en los cortafuegos corporativos. Normalmente, este oscuro puerto suele estar bloqueado detrás de los cortafuegos corporativos.

## El protocolo HTTP/S

Por último, tenemos el protocolo HTTP.   Cuya belleza radica en la simplicidad para habilitarlo. Basta con situar el repositorio Git bajo la raiz de los documentos HTTP y preparar el enganche (hook) 'post-update' adecuado. (Ver el Capítulo 7 para detalles sobre los enganches Git.) A partir de ese momento, cualquiera con acceso al servidor web podrá clonar tu repositorio. Para permitir acceso a tu repositorio a través de HTTP, puedes hacer algo como esto:

	$ cd /var/www/htdocs/
	$ git clone --bare /path/to/git_project gitproject.git
	$ cd gitproject.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Y eso es todo. El enganche 'post-update' que viene de serie con Git se encarga de lanzar el comando adecuado ('git update-server-info') para hacer funcionar la recuperación (fetching) y el clonado (cloning) vía HTTP. Este comando se lanza automáticamente cuando envias (push) a este repositorio vía SSh; de tal forma que otras personas puedan clonarlo usando un comando tal que:

	$ git clone http://example.com/gitproject.git

En este caso particular, estamos usando el camino '/var/www/htdocs', habitual en las configuraciones de Apache. Pero puedes utilizar cualquier servidor web estático, sin más que poner el repositorio en su camino. Los contenidos Git se sirven como archivos estáticos básicos (ver el Capitulo 9 para más detalles sobre servicios).

Es posible hacer que Git envie (push) a través de HTTP. Pero no se suele usar demasiado, ya que requiere lidiar con los complejos requerimientos de WebDAV. Y precisamente porque se usa raramente, no lo vamos a cubrir en este libro. Si estás interesado en utilizar los protocolos HTTP-push, puedes encotrar más información en  `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`. La utilidad de habilitar Git para enviar (push) a través de HTTP es la posibilidad de utilizar cualquier servidor WebDAV para ello, sin necesidad de requerimientos específicos para Git. De tal forma que puedes hacerlo incluso a través de tu proveedor de albergue web, si este soporta WebDAV para escribir actualizaciones en tu sitio web.

## Ventajas

La mejor parte del protocolo HTTP es su sencillez de preparación. Simplemente lanzando unos cuantos comandos, dispones de un método sencillo de dar al mundo entero acceso a tu repositorio Git. En tan solo unos minutos. Además, el procolo HTTP no requiere de grandes recursos en tu servidor. Por utilizar normalmente un servidor HTTP estático, un servidor Apache estandar puede con un tráfico de miles de archivos por segundo; siendo dificil de sobrecargar incluso con el más pequeño de los servidores.

Puedes también servir tus repositorios de solo lectura a través de HTTPS, teniendo así las transferencias encriptadas. O puedes ir más lejos aún, requiriendo el uso de certificados SSL específicos para cada cliente. Aunque, si pretendes ir tan lejos, es más sencillo utilizar claves públicas SSH; pero ahí está la posibilidad, por si en algún caso concreto sea mejor solución el uso de certificados SSL u otros medios de autentificación HTTP para el acceso de solo-lectura a través de HTTPS.

Otro detalle muy util de emplear HTTP, es que, al ser un protocolo de uso común, la mayoría de los cortafuegos corporativos suelen tener habilitado el tráfico a traves de este puerto.

## Desventajas

La pega de servir un repositorio a través de HTTP es su relativa ineficiencia para el cliente. Suele requerir mucho más tiempo el clonar o el recuperar (fetch), debido a la mayor carga de procesamiento y  al mayor volumen de transferencia que se da sobre HTTP respecto de otros protocolos de red. Y precisamente por esto, porque no es tan inteligente y no transfiere solamente los datos imprescindibles, (no hay un trabajo dinámico por parte del servidor), el protocolo HTTP suele ser conocido como el protocolo _estúpido_. Para más información sobre diferencias de eficiencia entre el protocolo HTTP y los otros protocolos, ver el Capítulo 9.
