# Obteniendo un Repositorio Git

Tu puedes obtener un proyecto basado en Git utilizando dos métodos principales. El primero consiste en tomar un proyecto existente e importarlo dentro de Git. El segundo se basa en clonar un repositorio Git desde otro servidor.

## Inicializando un Repositorio Dentro de un Directorio Preexistente

Si quisieramos comenzar a realizar un seguimiento de un proyecto con Git, lo que necesitamos es ir al directorio del proyecto y tipear

	$ git init

Esta acción creará un nuevo subdirectorio llamado .git que contendrá todos los archivos necesarios por el repositorio (el esqueleto básico de un repositorio Git). En este punto, nada en el proyecto está siendo rastreado aún. (Revisa el Capítulo 9 para mayor información acerca de qué archivo son contenidos exáctamente dentro del directorio `.git` que acaba de ser creado.)

Si quisieramos comenzar a llevar un control de versiones de los archivos existentes (en contraposición con un directorio vacío), entonces probablemente queramos comenzar a realizar un seguimiento de los archivos del directorio y realizar un commit inicial de los mismos. Puedes lograr esto con unos pocos comandos de git que especifican los archivos sobre los que quieres realizar un seguimientos, seguidos por un commit:

	$ git add *.c
	$ git add README
	$ git commit –m 'initial project version'

Volveremos sobre estos mismos comandos en solo un minuto. En este punto, ya tienes un repositorio Git con archivos versionados en el mismo y un commit inicial.

## Clonando un Repositorio Existente

Si quisieras obtener una copia de un repositorio Git existente (por ejemplo, de un projecto con el cuál quieres contribuir) el comando que estás buscando es git clone. Si eres familiar con otros sistemas VCS como Subversion, notarás que el comando se llama clone y no checkout. Esta es una distinción muy importante, Git recibe una copia de casi todos los datos que el servidor posee. Cada version de cada archivo de la historia del proyecto es descargado cuando ejecutas `git clone`. De hecho, si el disco del servidor se corrompiera, puede usar cualquiera de los clones de cualquiera de los clientes para restaurar el estado del servidor de nuevo al estado en que estaba cuando fue clonado (es posible que se pierdan algunos de los hooks ubicados en el servidor y configuraciones por el estilo, pero toda la información versionada estará ahí; revisa el Capítulo 4 para más detalles.)

Clonarás un repositorio con el comando `git clone [url]`. Por ejemplo, si quisieras clonar la librería de Git en Ruby llamada Grit, puedes hacer lo siguiente:

	$ git clone git://github.com/schacon/grit.git

Esta acción creará un directorio llamado "grit", inicializará el directorio `.git` dentro del mismo, descargará toda la información del repositorio, y generará una copia de trabajo de la última versión. Si ingresas al nuevo directorio recién creado `grit`, verás que se encuentran dentro del mismo todos los archivos, listos para ser trabajados o utilizados. Si quieres clonar un repositorio en un directorio que se llama de otra forma en lugar de grit, puedes especificar el comando de la siguiente forma:

	$ git clone git://github.com/schacon/grit.git mygrit

Este comando hace lo mismo que el comando anterior pero el nombre del directorio destino será mygrit.

Git tiene un número de protocoles diferentes que pueden ser utilizados. En los ejemplos previos utilizamos el protocolo `git://` pero también será normal observar los protocolos `http(s)://` or `usuario@servidor:/path.git`, que utiliza el protocolo SSH de transferencia. En el Capítulo 4 se introducirán todas las opciones disponibles con las cuáles un servidor puede ser configurado para el acceso al repositorio Git y las ventajas y las desventajas de cada una de ellas.
