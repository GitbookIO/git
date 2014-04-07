# Fusión de subárboles

Ahora que se han visto las dificultades que se pueden presentar utilizando el sistema de submódulos, es momento de hechar un vistazo a una vía alternativa de atacar esa misma problemática. Cuando Git realiza una fusión, suele revisar lo que ha de fusiónar entre sí y, tras ese análisis, elige la estratégia mas adecuada para hacerlo. Si se están fusionando dos ramas, Git suele utilizar la _estategia_recursiva_ (_recursive_ strategy). Si se están fusionando más de dos ramas, Git suele escoger la _estrategia_del_pulpo_ (_octopus_ strategy). Estas son las estrategias escogidas por defecto, ya que la estrategia recursiva puede manejar complejas fusiones-de-tres-vias --por ejemplo, con más de un antecesor común-- pero tan solo puede fusionar dos ramas. La fusión-tipo-pulpo puede manejar multiples ramas, pero es mucho mas cuidadosa para evitar incurrir en complejos conflictos; y es por eso que se utiliza en los intentos de fusionar más de dos ramas.

Pero existen también otras estratégias que se pueden escoger según se necesiten. Una de ellas, la _fusión_subárbol_ (_subtree_ merge), es precisamente la más adecuada para tratar con subproyectos. En este caso se va a mostrar cómo se haria el mismo empotramiento del módulo rack tomado como ejemplo anteriormente, pero utilizando fusiones de subarbol en lugar de submódulos.

La idea subyacente tras toda fusión subarborea es la de que se tienen dos proyectos; y uno de ellos está relacionado con una subcarpeta en el otro, y viceversa. Cuando se solicita una fusión subarborea, Git es lo suficientemente inteligente como para imaginarse por si solo que uno de los proyectos es un subárbol del otro y obrar en consecuencia. Es realmente sorprendente.

Se comienza añadiendo la aplicación Rack al proyecto. Se añade como una referencia remota en el propio proyecto, y luego se extrae (checkout) en su propia rama:

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.Resolving deltas: 100% (1952/1952), done.Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

En este punto, se tiene la raiz del proyecto Rack en la rama `rack_branch` y la del propio proyecto padre en la rama `master`. Si se comprueban una o la otra, se puede observar que ambos proyectos tienen distintas raices:

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

Si se desea situar el proyecto Rack como una subcarpeta del proyecto `master`. Se ha de lanzar el comando `git read-tree`. Se verá más en detalle el comando `read-tree` y sus acompañantes en el capítulo 9. Pero por ahora, basta con saber que este comando se encarga de leer el árbol raiz de una rama en el área de preparación (staging area) y carpeta de trabajo (working directory) actuales. Con ello, se retorna sobre la rama `master` y se recupera (pull) la rama `rack_branch` en la subcarpeta `rack` de la rama `master` del proyecto principal: 

	$ git read-tree --prefix=rack/ -u rack_branch

Cuando se confirman estos cambios, es como si se tuvieran todos los archivos Rack bajo esa carpeta --como si se hubieran copiado desde un archivo comprimido tarball-- Lo que hace interesante este método es la posibilidad que brinda de fusionar cambios de una rama sobre la otra de forma sencilla. De tal forma que, si se actualiza el proyecto Rack, se pueden integrar los cambios aguas arriba simplemente cambiando a esa rama y recuperando:

	$ git checkout rack_branch
	$ git pull

Tras lo cual, es posible fusionar esos cambios de vuelta a la rama 'master'. Utilizando el comando `git merge -s subtree`, que funciona correctamente; pero fusionando también los historiales entre sí. Un efecto secundario que posiblemente no interese. Para recuperar los cambios y rellenar el mensaje de la confirmación, se pueden emplear las opciones `--squash` y `--no-commit`, junto con la opción de estrategia `-s subtree`: 

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

Con esto, todos los cambios en el proyecto Rack se encontrarán fusionados y listos para ser confirmados localmente. También es posible hacer el camino contrario: realizar los cambios en la subcarpeta `rack` de la rama 'master', para posteriormente fusionarlos en la rama `rack_branch` y remitirlos a los encargados del mantenimiento o enviarlos aguas arriba.

Para ver las diferencias entre el contenido de la subcarpeta `rack` y el código en la rama `rack_branch` --para comprobar si es necesario fusionarlas--, no se puede emplear el comando `diff` habitual.  En su lugar, se ha de emplear el comando `git diff-tree` con la rama que se desea comparar: 

	$ git diff-tree -p rack_branch

O, otro ejemplo: para comparar el contenido de la subcarpeta `rack` con la rama `master` en el servidor: 

	$ git diff-tree -p rack_remote/master
