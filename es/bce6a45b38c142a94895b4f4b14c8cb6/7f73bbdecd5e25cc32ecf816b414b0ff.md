# Fontaneria y porcelana

Este libro habla acerca de como utilizar Git con más o menos 30 verbos, tales como 'checkout', 'branch', 'remote', etc. Pero, debido al origen de Git como una caja de herramientas para un VCS en lugar de como un completo y amigable sistema VCS, existen unos cuantos verbos para realizar tareas de bajo nivel y que se diseñaron para poder ser utilizados de forma encadenada al estilo UNIX o para ser utilizados en scripts. Estos comandos son conocidos como los "comandos de fontanería", mientras que los comandos más amigables son conocidos como los "comandos de porcelana".

Los primeros ocho capítulos de este libro se encargan casi exclusivamente de los comandos de porcelana. Pero en este capítulo trataremos sobre todo con los comandos de fontaneria; comandos que te darán acceso a los entresijos internos de Git y que te ayudarán a comprender cómo y por qué hace Git lo que hace como lo hace. Estos comando no están pensados para ser utilizados manualmente desde la línea de comandos; sino más bien para ser utilizados como bloques de construcción para nuevas herramientas y scripts de usuario personalizados.

Cuando lanzas 'git init' sobre una carpeta nueva o sobre una ya existente, Git crea la carpeta auxiliar '.git'; la carpeta  donde se ubica prácticamente todo lo almacenado y manipulado por Git. Si deseas hacer una copia de seguridad de tu repositorio, con tan solo copiar esta carpeta a cualquier otro lugar ya tienes tu copia completa. Todo este capítulo se encarga de repasar el contenido en dicha carpeta. Tiene un aspecto como este:

	$ ls 
	HEAD
	branches/
	config
	description
	hooks/
	index
	info/
	objects/
	refs/

Puede que veas algunos otros archivos en tu carpeta '.git', pero este es el contenido de un repositorio recién creado tras ejecutar 'git init', --es la estructura por defecto--. La carpeta 'branches' no se utiliza en las últimas versiones de Git, y el archivo 'description' se utiliza solo en el programa GitWeb; por lo que no necesitas preocuparte por ellos. El archivo 'config' contiene las opciones de configuración específicas de este proyecto concreto, y la carpeta 'info' guarda un archivo global de exclusión con los patrones a ignorar ademas de los presentes en el archivo .gitignore. La carpeta 'hooks' contiene tus scripts, tanto de la parte cliente como de la parte servidor, tal y como se ha visto a detalle en el capítulo 6.

Esto nos deja con cuatro entradas importantes: los archivos 'HEAD' e 'index' y las carpetas 'objects' y 'refs'. Estos elementos forman el núcleo de Git. La carpeta 'objects' guarda el contenido de tu base de datos, la carpeta 'refs' guarda los apuntadores a las confirmaciones de cambios (commits), el archivo 'HEAD' apunta a la rama que tengas activa (checked out) en este momento, y el archivo 'index' es donde Git almacena la información sobre tu area de preparación (staging area). Vamos a mirar en detalle cada una de esas secciones, para ver cómo trabaja Git.
