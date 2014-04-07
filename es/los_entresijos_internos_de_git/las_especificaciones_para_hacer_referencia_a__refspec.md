# Las especificaciones para hacer referencia a...  (refspec)

A lo largo del libro has utilizado sencillos mapeados entre ramas remotas y referencias locales; pero las cosas pueden ser bastante más complejas.
Supón que añades un remoto tal que:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

Esto añade una nueva sección a tu archivo `.git/config`, indicando el nombre del remoto (`origin`), la ubicación (URL) del repositorio remoto y la referencia para recuperar (fench) desde él: 

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

El formato para esta referencia es un signo `+` opcional, seguido de una sentencia `<orig>:<dest>`; donde  `<orig>` es la plantilla para referencias en el lado remoto y `<dest>` el lugar donde esas referencias se escribirán en el lado local. El  `+`, si está presente, indica a Git que debe actualizar la referencia incluso en los casos en que no se dé un avance rápido (fast-forward). 

En el caso por defecto en que es escrito por un comando `git remote add`, Git recupera del servidor todas las referencias bajo `refs/heads/`, y las escribe localmente en `refs/remotes/origin/`. De tal forma que, si existe una rama `master` en el servidor, puedes acceder a ella localmente a través de  

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

Todas estas sentencias son equivalentes, ya que Git expande cada una de ellas a `refs/remotes/origin/master`. 

Si, en cambio, quisieras hacer que Git recupere únicamente la rama `master` y no cualquier otra rama en el servidor remoto. Puedes cambiar la linea de recuperación a 

	fetch = +refs/heads/master:refs/remotes/origin/master

Quedando así esta referencia como la referencia por defecto para el comando `git fetch` para ese remoto.  Para hacerlo puntualmente en un momento concreto, puedes especificar la referencia directamente en la linea de comando. Para recuperar la rama `master` del servidor remoto a tu rama `origin/mymaster` local, puedes lanzar el comando  

	$ git fetch origin master:refs/remotes/origin/mymaster

Puedes incluso indicar multiples referencias en un solo comando. Escribiendo algo asi como:

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

En este ejemplo, se ha rechazado la recuperación de la rama master porque no era una referencia de avance rápido (fast-forward). Puedes forzarlo indicando el signo `+` delante de la referencia. 

Es posible asimismo indicar referencias multiples en el archivo de configuración. Si, por ejemplo, siempre recuperas las ramas 'master' y 'experiment', puedes poner dos lineas:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Pero, en ningún caso puedes poner referencias genéricas parciales; por ejemplo, algo como esto sería erroneo:

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

Aunque, para conseguir algo similar, puedes utilizar los espacios de nombres . Si tienes un equipo QA que envia al servidor una serie de ramas. Y deseas recuperar la rama master y cualquiera otra de las ramas del equipo; pero no recuperar ninguna rama de otro equipo. Puedes utilizar una sección de configuración como esta:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

De esta forma, puedes asignar facilmente espacios de nombres. Y resolver así complejos flujos de trabajo donde tengas simultáneamente , por ejemplo, un equipo QA enviando ramas, varios desarrolladores enviando ramas también y equipos integradores enviando y colaborando en ramas remotas.

## Enviando (push) referencias

Es util poder recuperar (fetch) referencias relativas en espacios de nombres, tal y como hemos visto. Pero, ¿cómo pueden enviar (push) sus ramas al espacio de nombres `qa/` los miembros de equipo QA ?.  Pues utilizando las referencias (refspecs) para enviar.

Si alguien del equipo QA quiere enviar su rama  `master` a la ubicación `qa/master` en el servidor remoto, puede lanzar algo asi como: 

	$ git push origin master:refs/heads/qa/master

Y, para que se haga de forma automática cada vez que ejecute `git push origin`, puede añadir una entrada `push` a su archivo de configuración:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

Esto hará que un simple comando `git push origin` envie por defecto la rama local  `master` a la rama remota `qa/master`,

## Borrando referencias

Se pueden utilizar las referencias (refspec) para borrar en el servidor remoto. Por ejemplo, lanzando algo como:

	$ git push origin :topic

Se elimina la rama 'topic' del servidor remoto, ya que la sustituimos or nada. (Al ser la referencia `<origen>:<destino>`, si no indicamos la parte  `<origen>`, realmente estamos diciendo que enviamos 'nada' a `<destino>`.) 
