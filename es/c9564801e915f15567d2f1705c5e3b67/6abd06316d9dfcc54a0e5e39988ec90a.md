# Gestión de ramificaciones

Ahora que ya has creado, fusionado y borrado algunas ramas, vamos a dar un vistazo a algunas herramientas de gestión muy útiles cuando comienzas a utilizar ramas profusamente.

El comando 'git branch' tiene más funciones que las de crear y borrar ramas. Si lo lanzas sin argumentos, obtienes una lista de las ramas presentes en tu proyecto:

	$ git branch
	  iss53
	* master
	  testing

Fijate en el carácter `*` delante de la rama 'master': nos indica la rama  activa en este momento. Si hacemos una confirmación de cambios (commit), esa será la rama que avance. Para ver la última confirmación de cambios en cada rama, puedes usar el comando 'git branch -v':

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Otra opción útil para averiguar el estado de las ramas, es filtrarlas y mostrar solo aquellas que han sido fusionadas (o que no lo han sido) con la rama actualmente activa. Para ello, Git dispone, desde la versión 1.5.6, las opciones '--merged' y '--no-merged'. Si deseas ver las ramas que han sido fusionadas en la rama activa, puedes lanzar el comando 'git branch --merged':

	$ git branch --merged
	  iss53
	* master

Aparece la rama 'iss53' porque ya ha sido fusionada.  Y no lleva por delante el caracter `*` porque todo su contenido ya ha sido incorporado a otras ramas. Podemos borrarla tranquilamente con 'git branch -d', sin miedo a perder nada.

Para mostrar todas las ramas que contienen trabajos sin fusionar aún, puedes utilizar el comando 'git branch --no-merged':

	$ git branch --no-merged
	  testing

Esto nos muestra la otra rama en el proyecto. Debido a que contiene trabajos sin fusionar aún, al intentarla borrar con 'git branch -d', el comando nos dará un error:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Si realmente deseas borrar la rama, y perder el trabajo contenido en ella, puedes forzar el borrado con la opción '-D'; tal y como lo indica el mensaje de ayuda.
