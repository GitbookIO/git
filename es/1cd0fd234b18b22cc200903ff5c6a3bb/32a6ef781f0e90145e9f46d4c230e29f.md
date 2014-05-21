# Guardado rápido provisional

Según se está trabajando en un apartado de un proyecto, normalmente el espacio de trabajo suele estar en un estado inconsistente. Pero puede que se necesite cambiar de rama durante un breve tiempo para ponerse a trabajar en algún otro tema urgente. Esto plantea el problema de confirmar cambios en un trabajo medio hecho, simplemente para poder volver a ese punto más tarde. Y su solución es el comando 'git stash'.

Este comando de guardado rápido (stashing) toma el estado del espacio de trabajo, con todas las modificaciones en los archivos bajo control de cambios, y lo guarda en una pila provisional. Desde allí, se podrán recuperar posteriormente y volverlas a aplicar de nuevo sobre el espacio de trabajo.

## Guardando el trabajo temporalmente

Por ejemplo, si se está trabajando sobre un par de archivos e incluso uno de ellos está ya añadido al área de preparación para un futuro almacenamiento de sus cambios en el repositorio. Al lanzar el comando 'git status', se podría observar un estado inconsistente tal como:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

Si justo en este momento se desea cambiar de rama, pero sin confirmar los cambios realizados hasta entonces; la solución es un guardado rápido provisional de los cambios. Utilizando el comando 'git stash' y enviando un nuevo grupo de cambios a la pila de guardado rápido:

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

Con ello, se limpia el área de trabajo:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Y se permite cambiar de rama para ponerse a trabajar en cualquier otra parte. Con la tranquilidad de que los cambios a medio completar están guardados a buen recaudo en la pila de guardado rápido. Para ver el contenido de dicha pila, se emplea el comando 'git stash list':

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

En este ejemplo, se habian realizado dos guardados rápidos anteriores, por lo que se ven tres grupos de cambios guardados en la pila. Con el comando 'git stash apply', tal y como se indica en la salida del comando stash original, se pueden volver a aplicar los últimos cambios recien guardados. Si lo que se desea es reaplicar alguno de los grupos más antiguos de cambios, se ha de indicar expresamente: `git stash apply stash@{2}` Si no se indica ningún grupo concreto, Git asume que se desea reaplicar el grupo de cambios más reciente de entre los guardados en la pila.

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

Como se ve en la salida del comando, Git vueve a aplicar los correspondientes cambios en los archivos que estaban modificados. Pero no conserva la información de lo que estaba o no estaba añadido al área de preparación.  En este ejemplo se han aplicado los cambios de vuelta sobre un espacio de trabajo limpio, en la misma rama. Pero no es esta la única situación en la que se pueden reaplicar cambios. Es perfectamente posible guardar rápidamente (stash) el estado de una rama. Cambiar posteriormente a otra rama. Y proceder a aplicar sobre esta otra rama los cambios guardados, en lugar de sobre la rama original. Es posible incluso aplicar de vuelta cambios sobre un espacio de trabajo inconsistente, donde haya otros cambios o algunos archivos añadidos al área de preparación. (Git notificará de los correspondientes conflictos de fusión si todo ello no se puede aplicar limpiamente.)

Las modificaciones sobre los archivos serán aplicadas; pero no así el estado de preparación. Para conseguir esto último, es necesario emplear la opción `--index` del comando `git stash apply`. Con ella se le indica que debe intentar reaplicar también el estado de preparación de los archivos.  Y asi se puede conseguir volver exactamente al punto original:

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

Los comandos `git stash apply` tan solo recuperan cambios almacenados en la pila de guardado rápido, sin afectar al estado de la pila. Es decir, los cambios siguen estando guardados en la pila. Para quitarlos de ahí, es necesario lanzar expresamente el comando `git stash drop` e indicar el número de guardado a borrar de la pila:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

También es posible utilizar el comando `git stash pop`,  que aplica cambios de un guardado y lo retira inmediatamente de la pila.

## Creando una rama desde un guardado rápido temporal

Si se almacena rápidamente (stash) un cierto trabajo, se deja en la pila durante bastante tiempo, y se continua mientras tanto con otros trabajos sobre la misma rama. Es muy posible que se presenten problemas al tratar de reaplicar los cambios guardados tiempo atrás. Si  para recuperar esos cambios se ha de modificar un archivo que también haya sido modificado en los trabajos posteriores, se dará un conflicto de fusión (merge conflict) y será preciso resolverlo manualmente. Una forma más sencilla de reaplicar cambios es utilizando el comando `git stash branch`. Este comando crea una nueva rama, extrayendo (checkout) la confirmación de cambios original en la que se estaba cuando los cambios fueron guardados en la pila, reaplica estos sobre dicha rama y los borra de la pila si se consigue completar el proceso con éxito.

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

Este es un buen atajo para recuperar con facilidad un cierto trabajo desde la pila y continuar con él en una nueva rama.
