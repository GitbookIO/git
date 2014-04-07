# Protocolos de transferencia

Git puede transferir datos entre dos repositorios utilizando uno de sus dos principales mecanismos de transporte: sobre HTTP (protocolo tonto), o sobre los denominados protocolos inteligentes (utilizados en  `file://`, `ssh://` o `git://`).  En esta parte, se verán sucintamente cómo trabajan esos dos tipos de protocolo.

## El protocolo tonto (dumb)

El transporte de Git sobre protocolo HTTP es conocido también como protocolo tonto. Porque no requiere ningún tipo de codigo Git en la parte servidor. El proceso de recuperación (fetch) de datos se limita a una serie de peticiones GET, siendo el cliente quien ha de conocer la estructura del repositorio Git en el servidor. Vamos a revisar el proceso `http-fetch` para una libreria simple de Git: 

	$ git clone http://github.com/schacon/simplegit-progit.git

Lo primero que hace este comando es recuperar el archivo `info/refs`.  Este es un archivo escrito por el comando `update-server-info`, el que has de habilitar como enganche (hook)  `post-receive` para permitir funcionar correctamente al transporte HTTP: 

	=> GET info/refs
	ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

A partir de ahi, ya tienes una lista de las referencias remotas y sus SHAs. Lo siguiente es mirar cual es la referencia a HEAD, de tal forma que puedas saber el punto a activar (checkout) cuando termines:

	=> GET HEAD
	ref: refs/heads/master

Ves que es la rama`master` la que has de activar cuando el proceso esté completado.  
sus ramas al espacio de nombres `qa/`En este punto, ya estás preparado para seguir procesando el resto de los objetos. En el archivo `info/refs` se ve que el punto de partida es la confirmación de cambios (commit) `ca82a6`, y, por tanto, comenzaremos recuperandola: 

	=> GET objects/ca/82a6dff817ec66f44342007202690a93763949
	(179 bytes of binary data)

Cuando recuperas un objeto, dicho objeto se encuentra suelto (loose) en el servidor y lo traes mediante una petición estática HTTP GET. Puedes descomprimirlo, quitarle la cabecera y mirar el contenido:

	$ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Tras esto, ya tienes más objetos a recuperar --el árbol de contenido `cfda3b` al que apunta la confirmación de cambios; y la confirmación de cambios padre `085bb3`--. 

	=> GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	(179 bytes of data)

El siguiente objeto confirmación de cambio (commit). Y el árbol de contenido: 

	=> GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
	(404 - Not Found)

Pero... ¡Ay!... parece que el objeto árbol no está suelto en el servidor. Por lo que obtienes una respuesta 404 (objeto no encontrado). Puede haber un par de razones para que suceda esto: el objeto está en otro repositorio alternativo; o el objeto está en este repositorio, pero dentro de un objeto empaquetador (packfile). Git comprueba primero a ver si en el listado hay alguna alternativa:

	=> GET objects/info/http-alternates
	(empty file)

En el caso de que esto devolviera una lista de ubicaciones (URL) alternativas, Git busca en ellas. (Es un mecanismo muy adecuado en aquellos proyectos donde hay segmentos derivados uno de otro compartiendo objetos en disco.) Pero, en este caso, no hay altenativas. Por lo que el objeto debe encontrarse dentro de un empaquetado. Para ver que empaquetados hay disponibles en el servidor, has de recuperar el archivo `objects/info/packs`. Este contiene una lista de todos ellos: (que ha sido generada por `update-server-info`)

	=> GET objects/info/packs
	P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Vemos que hay un archivo empaquetado, y el objeto buscado ha de encontrarse dentro de él; pero merece comprobarlo revisando el archivo de índice, para asegurarse. Hacer la comprobacion es sobre todo util en aquellos casos donde existan multiples archivos empaquetados en el servidor, para determinar así en cual de ellos se encuentra el objeto que necesitas:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
	(4k of binary data)

Una vez tengas el índice del empaquetado, puedes mirar si el objeto buscado está en él, (Dicho índice contiene la lista de SHAs de los objetos dentro del empaquetado y las ubicaciones -offsets- de cada uno de llos dentro de él.) Una vez comprobada la presencia del objeto, adelante con la recuperación de todo el archivo empaquetado:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
	(13k of binary data)

Cuando tengas el objeto árbol, puedes continuar avanzando por las confirmaciones de cambio. Y, como estás también están dentro del archivo empaquetado que acabas de descargar, ya no necesitas hacer mas peticiones al servidor. Git activa una copia de trabajo de la rama  `master` señalada por la referencia HEAD que has descargado al principio.

La salida completa de todo el proceso es algo como esto:

	$ git clone http://github.com/schacon/simplegit-progit.git
	Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
	got ca82a6dff817ec66f44342007202690a93763949
	walk ca82a6dff817ec66f44342007202690a93763949
	got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Getting alternates list for http://github.com/schacon/simplegit-progit.git
	Getting pack list for http://github.com/schacon/simplegit-progit.git
	Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
	Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
	 which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	walk a11bef06a3f659402fe7563abf99ad00de2209e6

## El protocolo inteligente (smart)

HTTP es un protocolo simple, pero ineficiente. Es mucho más común utilizar protocolos inteligentes para transferir datos. Estos protocolos suelen tener procesos en el lado remoto y conocen acerca de la estructura de datos Git en ese lado, --pueden leer datos localmente y determinar lo que el cliente tiene ya o necesita a continuación, para generar automáticamente datos expresamente preparados para él--. Existen dos conjuntos de procesos para transferir datos: uno para para enviar y otro par para recibir.

### Enviando datos, (Uploading)

Para enviar datos a un proceso remoto, Git utliza  `send-pack` (enviar paquete) y `receive-pack` (recibir paquete).  El proceso `send-pack`  corre en el cliente y conecta con el proceso `receive-pack` corriendo en el lado remoto. 

Por ejemplo, si lanzas el comando `git push origin master` en tu proyecto y `origin` está definida como una ubicación que utiliza el protocolo SSH.  Git lanzará el proceso `send-pack` , con el que establece conexión SSH con tu servidor.  En el servidor remoto, a través de una llamada SSH, intentará lanzar un comando tal como:

	$ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
	005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
	003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
	0000

El comando `git-receive-pack` responde con una linea por cada una de las referencias que tenga, --en este caso, la rama  `master` y su SHA--.  La primera linea suele indicar también una lista con las capacidades del servidor, (en este caso `report-status` --dar situación-- y `delete-refs` --borrar referencias--). 

Cada linea comienza con un valor de 4 bytes, en hexadecimal, indicando la longitud del resto de la linea. La primera de las lineas comienza con 005b, 91 en decimal, indicandonos que hay 91 bytes más en esa línea. La siguiente línea comienza con 003e, 62 en decimal, por lo que has de leer otros 62 bytes hasta el final de la linea. Y la última linea comienza con 0000, indicando así que la lista de referencias ha terminado.

Con esta información, el proceso `send-pack` ya puede determnar las confirmaciones de cambios (commits) presentes en el servidor.  Para cada una de las referencias que se van a actualizar, el proceso `send-pack` llama al proceso `receive-pack` con la información pertinente.   Por ejemplo, si estás actualizando la rama `master` y añadiendo otra rama `experiment`, la respuesta del proceso `send-pack` será algo así como: 

	0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
	00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
	0000

Una clave SHA-1 con todo '0's, nos indica que no habia nada anteriormente, y que, por tanto, estamos añadiendo una nueva referencia. Si estuvieras borrando una referencia existente, verias lo contrario: una clave todo '0's en el lado derecho.

Git envia una linea por cada referencia a actualizar, indicando el viejo SHA, el nuevo SHA y la referencia a actualizar. La primera linea indica también las capacidades disponibles en el cliente. A continuación, el cliente envia un archivo empaquetado con todos los objetos que faltan en el servidor. Y, por ultimo, el servidor responde con un indicador de éxito (o fracaso) de la operación:

	000Aunpack ok

### Descargando datos, (Downloading)

Cuando descargas datos, los procesos que se ven envueltos son `fetch-pack` (recuperar paquete) y `upload-pack` (enviar paquete).  El cliente arranca un proceso `fetch-pack`, para conectar con un proceso `upload-pack` en el lado servidor y negociar con él los datos a transferir. 

Hay varias maneras de iniciar un proceso `upload-pack` en el repositorio remoto.  Se puede lanzar a través de SSH, de la misma forma que se arrancaba el proceso `receive-pack`.  O se puede arrancar a traves del demonio Git, que suele estar escuchando por el puerto 9418. Tras la conexión, el proceso `fetch-pack` envia datos de una forma parecida a esta: 

	003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Como siempre, comienza con 4 bytes indicadores de cuantos datos siguen a continuación, siguiendo con el comando a lanzar, y terminando con un byte nulo, el nombre del servidor y otro byte nulo más. El demonio Git realizará las comprobaciones de si el comando se puede lanzar, si el repositorio existe y si tenemos permisos. Siendo todo correcto, el demonio lanzará el proceso `upload-pack` y procesara nuestra petición. 

Si en lugar de utilizar el demonio Git, estás utilizando el protocolo SSH. `fetch-pack` lanzará algo como esto: 

	$ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

En cualquier caso, después de establecer conexión, `upload-pack` responderá: 

	0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
	  side-band side-band-64k ofs-delta shallow no-progress include-tag
	003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
	003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
	0000

La respuesta es muy similar a la dada por `receive-pack`, pero las capacidades que se indican son diferentes.  Además, nos indica la referencia HEAD, para que el cliente pueda saber qué ha de activar (check out) en el caso de estar requiriendo un clon.

En este punto, el proceso `fetch-pack` revisa los objetos que tiene y responde indicando los objetos que necesita. Enviando "want" (quiero) y la clave SHA que necesita. Los objetos que ya tiene, los envia con "have" (tengo) y la correspondiente clave SHA. Llegando al final de la lista, escribe "done" (hecho). Para indicar al proceso `upload-pack` que ya puede comenzar a enviar el archivo empaquetado con los datos requeridos: 

	0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
	0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	0000
	0009done

Este es un caso muy sencillo para ilustrar los protocolos de trasferencia. En casos más complejos, el cliente explota las capacidades de `multi_ack` (multiples confirmaciones) o `side-band` (banda lateral). Pero este ejemplo muestra los intercambios básicos empleados en los protocolos inteligentes.
