# Referencias Git

Puedes utilizar algo así como `git log 1a410e` para hechar un vistazo a lo largo de toda tu historia, recorriendola y encontrando todos tus objetos. Pero para ello has necesitado recordar que la última confirmación de cambios es `1a410e`. Necesitarias un archivo donde almacenar los valores de las sumas de comprobación SHA-1, junto con sus respectivos nombres simples que puedas utilizar como enlaces en lugar de la propia suma de comprobación.

En Git, estp es lo que se conoce como "referencias" o "refs". En la carpeta `.git/refs` puedes encontrar esos archivos con valores SHA-1 y nombres . En el proyecto actual, la carpeta aún no contiene archivos, pero sí contiene una estructura simple:

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

Para crear una nueva referencia que te sirva de ayuda para recordar cual es tu última confirmación de cambios,  puedes realizar técnicamente algo tan simple como:

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

A partir de ese momento, puedes utilizar esa referencia principal que acabas de crear, en lugar del valor SHA-1, en todos tus comandos:

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

No es conveniente editar directamente los archivos de referencia. Git suministra un comando mucho más seguro para hacer esto. Si necesitas actualizar una referencia, puedes utilizar el comando `update-ref`:

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

Esto es lo que es básicamente una rama en Git: un simple apuntador o referencia a la cabeza de una línea de trabajo. Para crear una rama hacia la segunda confirmación de cambios, puedes hacer:

	$ git update-ref refs/heads/test cac0ca

Y la rama contendrá únicamente trabajo desde esa confirmación de cambios hacia atrás.

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

En estos momentos, tu base de datos Git se parecerá conceptualmente a la figura 9-4.


![](http://git-scm.com/figures/18333fig0904-tn.png)
 
Figura 9-4. Objetos en la carpeta Git, con referencias a las cabeceras de las ramas.

Cuando lanzas comandos como `git branch (nombrederama)`. Lo que hace Git es añadir, a cualquier nueva referencia que vayas a crear, el valor SHA-1 de la última confirmación de cambios en esa rama.

## La CABEZA (HEAD)

Y ahora nos preguntamos, al lanzar el comando `git branch (nombrederama)`, ¿cómo sabe Git cuál es el valor SHA-1 de la última confirmación de cambios?. La respuesta a esta pregunta es el archivo HEAD (CABEZA). El archivo HEAD es una referencia simbólica a la rama donde te encuentras en cada momento. Por referencia simbólica me refiero a que, a diferencia de una referencia normal, esta contiene un enlace a otra referencia en lugar de un valor SHA-1. Si miras dentro del archivo, podrás observar algo como:

	$ cat .git/HEAD 
	ref: refs/heads/master

Si lanzas el comando `git checkout test`, Git actualiza el contenido del archivo:

	$ cat .git/HEAD 
	ref: refs/heads/test

Cuando lanzas una orden `git commit`, se crea un nuevo objeto de confirmación de cambios teniendo como padre la confirmación con valor SHA-1 a la que en ese momento esté apuntando la referencia en HEAD.

Puedes editar manualmente este archivo. Pero, también para esta tarea existe un comando más seguro: `symbolic-ref`. Puedes leer el valor de HEAD a través de él:

	$ git symbolic-ref HEAD
	refs/heads/master

Y también puedes cambiar el valor de HEAD a través de él:

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD 
	ref: refs/heads/test

Pero no puedes fijar una referencia simbólica fuera de "refs":

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## Etiquetas

Acabas de conocer los tres principales tipos de objetos Git, pero hay un cuarto. El objeto tipo etiqueta es muy parecido al tipo confirmación de cambios, --contiene un marcador, una fecha, un mensaje y un enlace--. Su principal diferencia reside en que apunta a una confirmación de cambios (commit) en lugar de a un árbol (tree). Es como una referencia a una rama, pero permaneciendo siempre inmovil, --apuntando siempre a la misma confirmación de cambios--, dándo un nombre mas amigable a esta.

Tal y como se ha comentado en el capítulo 2, hay dos tipos de etiquetas: las anotativas y las ligeras. Puedes crear una etiqueta ligera lanzando un comando tal como:

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

Una etiqueta ligera es simplemente eso: una rama que nunca se mueve. Sin embargo, una etiqueta anotativa es más compleja. Al crear una etiqueta anotativa, Git crea un objeto tipo etiqueta y luego escribe una referencia apuntando a él en lugar de apuntar directamente a una confirmación de cambios. Puedes comprobarlo creando una: (la opción `-a` indica que la etiqueta es anotativa)

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 –m 'test tag'

Este es el objeto SHA-1 creado:

	$ cat .git/refs/tags/v1.1 
	9585191f37f7b0fb9444f35a9bf50de191beadc2

Ahora, lanzando el comando `cat-file` para ese valor SHA-1: 

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

Merece destacar que el inicio del objeto apunta al SHA-1 de la confirmación de cambios recién etiquetada. Y también el que no ha sido necesario apuntar directamente a una confirmación de cambios. Realmente puedes etiquetar cualquier tipo de objeto Git. Por ejemplo, en el código fuente de Git los gestores han añadido su clave GPG pública como un objeto binario (blob) y lo han etiquetado. Puedes ver esta clave pública con el comando

	$ git cat-file blob junio-gpg-pub

lanzado sobre el código fuente de Git. El kernel de Linux tiene también un objeto tipo etiqueta apuntando a un objeto que no es una confirmación de cambios (commit). La primera etiqueta que se creó es la que apunta al árbol (tree) inicial donde se importó el código fuente.

## Remotos

El tercer tipo de referencia que puedes observar es la referencia remota. Si añades un remoto y envias algo a él, Git almacenará en dicho remoto el último valor para cada rama presente en la carpeta `refs/remotes`.  Por ejemplo, puedes añadir un remoto denominado `origin` y enviar a él tu rama  `master`:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

Tras lo cual puedes confirmar cual era la rama `master` en el remoto `origin` la última vez que comunicase con el servidor. Comprobando el archivo `refs/remotes/origin/master`: 

	$ cat .git/refs/remotes/origin/master 
	ca82a6dff817ec66f44342007202690a93763949

Las referencias remotas son distintas de las ramas normales, (referencias en `refs/heads`); y no se pueden recuperar (checkout) al espacio de trabajo.  Git las utiliza solamente como marcadores al último estado conocido de cada rama en cada servidor remoto declarado.
