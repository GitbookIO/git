# Recording Changes to the Repository

You have a bona fide Git repository and a checkout or working copy of the files for that project. You need to make some changes and commit snapshots of those changes into your repository each time the project reaches a state you want to record.

Remember that each file in your working directory can be in one of two states: tracked or untracked. Tracked files are files that were in the last snapshot; they can be unmodified, modified, or staged. Untracked files are everything else - any files in your working directory that were not in your last snapshot and are not in your staging area.  When you first clone a repository, all of your files will be tracked and unmodified because you just checked them out and haven’t edited anything. 

As you edit files, Git sees them as modified, because you’ve changed them since your last commit. You stage these modified files and then commit all your staged changes, and the cycle repeats. This lifecycle is illustrated in Figure 2-1.


![](http://git-scm.com/figures/18333fig0201-tn.png)
 
Fig 2-1. The lifecycle of the status of your files

## Revisando el Estado de Tus Archivos

La herramienta principal que se utiliza para determinar qué archivos están en qué estados es el comando git status. Si ejecutas este comando inmediatamente después de realizar una clonación, deberías visualizar una salida similar a la siguiente:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Esto significa que tienes una copia de trabajo limpia, en otras palabras, que no hay ningún archivo versionado que haya sido modificado. Git tampoco detectó ningún archivo sin versionar, de otra manera debería estar listado aquí. Por último, el comando indica en qué branch estás trabajando. Por ahora, siempre será master, que es el branch por defecto; no hace falta que te preocupes por saber qué significa en este punto aún. En el próximo capítulo analizaremos los branches y referencias en detalle.

Supongamos que agregas un nuevo archivo al proyecto, uno simple que se llame README. Si el archivo no existía con anterioridad, al ejecutar el comando `git status`, verás los archivos sin versionar de la siguiente forma:

	$ vim README
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#	README
	nothing added to commit but untracked files present (use "git add" to track)

Podemos saber que el nuevo archivo llamado README aún no ha sido versionado gracias que aparece listado debajo de la cabecera "Untracked files" en la salida del comando. Sin versionar significa que Git notó que el archivo no existía en el snapshot previo (commit); Git no comenzará a incluirlo hasta que explícitamente le digamos que debe hacerlo. Lo hace de esta forma para evitar que accidentalmente comiencen a ser versionados archivos binarios generados por otros procesos u otros tipos de archivos que no deberían ser incluidos. Nosotros sí queremos que el archivo README sea versionado, así que le indicaremos q Git que comience el seguimiento del mismo.

## Versionando Archivos Nuevos

Para versionar un archivo nuevo, puedes utilizar el comando `git add`. Para comenzar a versionar el archivo llamado README, puede ejecutar el siguiente comando:

	$ git add README

Si ejecutas el comando de estado nuevamente, podrás notar que el archivo README ahora está versionado y 'estacionado':

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#

Se puede decir que el archivo está estacionado debido a que está debajo de la cabecera “Changes to be committed” (“Cambios que será commiteados”). Si realizas un commit en este punto, la versión del archivo al momento en que ejecutaste el comando git add estará en el snapshot histórico. Si recuerdas el momento en que ejecutaste git init en las secciones anteriores, podrás recordas que también ejecutaste git add (nombre de los archivos), esto se realizo de esa manera para versionar todos los archivos que estaban dentro del directorio. El comando git add puede aceptar como parámetro tanto el nombre de un archivo como el nombre de un directorio; si es un directorio, el comando agregará todos los archivos dentro del mismo de forma recursiva.

## Estacionando Archivos Modificados

Vamos a modificar el contenido de algunos archivos que ya han sido versionados. Si realizar una modificación en el archivo versionado con anterioridad que se llama 'benchmarks.rb' y luego ejecutas el comando de estado nuevamente, obtendrás algo similar a lo siguiente:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

The benchmarks.rb file appears under a section named “Changes not staged for commit” — which means that a file that is tracked has been modified in the working directory but not yet staged. To stage it, you run the `git add` command (it’s a multipurpose command — you use it to begin tracking new files, to stage files, and to do other things like marking merge-conflicted files as resolved). Let’s run `git add` now to stage the benchmarks.rb file, and then run `git status` again:
El archivo benchmarks.rb aparece debajo de una sección denominada “Changes not staged for commit” (“Modificada pero no actualizada”), que significa que el archivo versionado ha sido modificado en el directorio de trabajo pero todavía no ha sido estacionado.

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

Ambos archivos están estacionados y serán enviados en el próximo commit. En este punto, supongamos que recuerdas realizar una pequeña modificación que querías realizar al archivo benchmarks.rb antes de commitearlo. Abres de nuevo el archivo y realizas la modificación, y estás listo para commitear. Sin embargo, antes corramos el comando `git status` una vez más:

	$ vim benchmarks.rb 
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

¿Qué es lo que ha sucedido? Ahora el archivo benchmarks.rb está marcado como estacionado y no estacionado. ¿Cómo es esto posible? Resulta que Git estaciona el archivo exactamente como lo encuentra cuando ejecutas el comando git add. Si realizas el commit en este momento, la versión que Git encontré cuando ejecutaste el comando git add es lo que irá en el contenido del commit, no la versión que como aparece en tu copia de trabajo luego de que realizaras la última modificación. Si modificas un archivo luego de ejecutar el comando `git add`, tendrás que volver a ejecutarlo para estacionar los cambios de la última versión del archivo:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

## Ignorando Archivos

A menudo, habrá determinado tipo de archivos que no querrás que Git automáticamente agregue o siquiera que te los muestre como no versionados. Estos archivos son generalmente generados automáticamente, como suelen ser archivos de log o archivos generados por procesos de compilación. En estos casos, puedes crear un archivo listando los patrones de nombre que quieren que sean ignorados y nombrar este archivo .gitignor. A continuación encontrarás un ejemplo de un archivot .gitignore:

	$ cat .gitignore
	*.[oa]
	*~

La primer línea le indica a Git que ignore cualquier archivo que finalice con .o o .a, archivos objeto que suelen ser el producto de procesos de compilación de código fuente. La segunda línea le indica a Git que ignore todos los archivos que finalizan con una tild (`~`), como los que son utilizados por muchos editores de textos como archivos temporales; y demás. Configurar un archivo .gitignore antes de comenzar a trabajar suele ser por lo general una buena idea para evitar que accidentalmente commitees archivos que realmente no quieres que estén en tu repositorio Git.

Las reglas para los patrones que pueden ser incluidos en el archivo .gitignore son:

*	Las líneas en blanco o que comienzan con # son ignoradas.
*	Standard glob patterns work.
*	You can end patterns with a forward slash (`/`) to specify a directory.
*	Puedes especificar un directorio agregando un barra (`/`) al final del patrón.
*	You can negate a pattern by starting it with an exclamation point (`!`).
*	Puedes negar un patrón anteponiéndole un signo de exclamación (`!`) al principio.

Los patrones globales son expresiones regulares simplificadas que pueden ser utilizadas por el shell. Un asterisco (`*`) reconoce creo o más caracteres; `[abc]` reconoce cualquier caracter que se encuentre entre los corchetes; un signo de pregunta cerrado (`?`) reconoce un caracter y caracteres separados por un guión encerrados entres corchetes (`[0-9]`) reconoce cualquier caracter que se encuentre entre ellos (en este caso de 0 a 9).

Aquí hay otro ejemplo de un archivo .gitignore:

	# un comentario - es ignorado
	# ningún archivo .a
	*.a
	# pero si queremos versionar el archivo lib.a, incluse aunque estemos ignorando los archivos .a más arriba
	!lib.a
	# solo ignorar el archivo TODO del directorio raíz, no de los subdirectorios
	/TODO
	# ignorar todos los archivos dentro del directorio build/
	build/
	# ignorar el archivo doc/notes.txt, pero no doc/server/arch.txt
	doc/*.txt

## Visualizando Archivos Versionados y No Versionados

Si el comando `git status` es demasiado vago para tí (quieres saber exactamente qué es lo que has cambiado, no solo los archivos que han cambiado) puede utilizar el comando `git diff`. Cubriremos el comando `git diff` en más detalle luego, pero lo más probable es que generalmente lo utilicemos para responder estas dos preguntas: ¿Qué es lo que has cambiado pero aún no has estacionado? y ¿Qué has estacionado que está a punto de ser commiteado? Aunque el comando `git status` responde esta pregunta de forma bastante general, `git diff` muestra exactamente qué línea ha sido añadida o removida, el parche, como se lo suele llamar.

Supongamos que quieres editar y estacionar el archivo README de nuevo y luego editar el archivo benchmarks.rb sin salvarlo. Si ejecutas el comando `status`, de nuevo verás algo como lo siguiente:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Para ver qué es lo que has cambiado pero aún no has estacionado, tipea `git diff` sin más argumentos:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

Este comando compara qué se encuentra en tu copia de trabajo con lo que se encuentra en tu área de estacionamiento. El resultado muestra los cambios que has realizado pero aún no has estacionado.

Si quisieras ver qué es lo que está estacionado y será enviado en el próximo commit, puedes utilizar el comando `git diff --cached`. (En versiones de Git posteriores a la 1.6.1 también puedes utilizar el comando `git diff --staged`, que es más fácil de recordar.) Este comando compara los cambios estacionados con tu último commit:

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

Es importante notar que `git diff` por si mismo no muestra todos los cambios realizados desde tu último commit, solo los cambios que aún no han sido estacionados. Esto puede resultar confuso, ya que si has estacionado todos los cambio, `git diff` no mostrará ninguna información en su salida.

Para poner otro ejemplo, si estacionas el archivo benchmarks.rb y luego lo editas, puedes utilizar el comando `git diff` para ver los cambios en el archivo que están estacionados y los cambios que no están estacionados:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#

Ahora puedes utilizar `git diff` para ver qué es lo que no ha sido estacionado aún

	$ git diff 
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats 
	+# test line
	and git diff --cached to see what you’ve staged so far:
	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+              
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Enviando Los Cambios

Ahora que el area de estacionado está lista en la forma en que uno lo deseaba, puedes enviar tus cambios. Recuerdo que cualquier cosa que aún no esté estacionada (cualquier archivo que hayas creado o editado pero sobre los cuáles aún no hayas ejecutado `git add` sobre ellos desde que los editaste) no irán en el siguiente envio. Se mantendrán como archivos modificados en tu disco.
En este caso, la última vez que ejecutaste `git status`, viste qué es lo que estaba estacionado, así que ya estás listo para enviar los cambios. La forma más simple de enviar los cambios es tipear `git commit`:

	$ git commit

Al hacerlo, se iniciará un editor de textos de tu gusto. (Esto se logra configurando la variable de entorno `$EDITOR` de tu shell, usualmente es vim o emacs, aunque puedes configurar su valor utilizando el comando `git config --global core.editor` como lo vimos en el Capítulo 1).

El editor presentará el siguiente texto (este es un ejemplo tomado de una pantalla de Vim):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       new file:   README
	#       modified:   benchmarks.rb 
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

Como puedes ver, el mensaje de envio por defecto contiene la última salida del comando `git status` como comentario y una línea vacía arriba de todo. Puedes remover los comentarios y tipear tu propio mensaje para este envio, o puedes dejarlos para recordar qué es lo que estás enviando. (Para un mensaje recordatorio aún más explícito de qué es lo que has modificado, puedes añadir el argumento `-v` al comando `git commit`. Al hacelo también se agregará a los cambios presentes en el editor las diferencias de los cambios de manera que puedas saber exactamente qué cambiaste.) Cuando salgas del editor, Git creará un envio con el mensaje que acabas de redactar (junto con los comentarios y las diferencias).

También existe otra alternativa, puedes tipear el mensaje del envio junto con el comando `commit` especificando el parámetro -m, como se muestra a continuación:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master]: created 463dc4f: "Fix benchmarks for speed"
	 2 files changed, 3 insertions(+), 0 deletions(-)
	 create mode 100644 README

¡Acabas de crear tu primer envio! Notarás que el comando `commit` generó cierta información como salida: a qué rama ha sido enviada (master), cuál es la verificación SHA-1 del envio (`463dc4f`), cuántos archivos han cambiado, y las estadísticas acerca de cuántas líneas han sido añadidas o removidas en el envio.

Recuerda que un envio registra la instantánea que preparaste en el área de estacionado. Nada que no hayas estacionado aún estará ahí, modificado; puedes hacer otro envio para agregarlo al historial. Cada vez que realizas un envío, estás generando una instantánea del proyecto que luego podrás utilizar para volver atrás o comparar.

## Skipping the Staging Area

Although it can be amazingly useful for crafting commits exactly how you want them, the staging area is sometimes a bit more complex than you need in your workflow. If you want to skip the staging area, Git provides a simple shortcut. Providing the `-a` option to the `git commit` command makes Git automatically stage every file that is already tracked before doing the commit, letting you skip the `git add` part:

	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+), 0 deletions(-)

Notice how you don’t have to run `git add` on the benchmarks.rb file in this case before you commit.

## Eliminando Archivos

Para remover un archivo del repositorio Git, es necesario removerlo de los archivos versionados (para ser más exacto, removerlo del área de estacionado) y luego realizar un envío. El comando `git rm` hace exactamente esto y también remueve el archivo de tu copia de trabajo para que no esté presente como no versionado en el futuro.

Si simplemente eliminas el archivo de tu copia de trabajo, aparecerá bajo la sección "Changes not staged for commit" ("Modificado pero no actualizado", es decir, _no versionado_) cuando ejecutes el comando `git status`:

	$ rm grit.gemspec
	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#   (use "git add/rm <file>..." to update what will be committed)
	#
	#       deleted:    grit.gemspec
	#

Si entonces ejecutas el comando `git rm`, añade la eliminación del archivo al área de estacionado:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       deleted:    grit.gemspec
	#

En el próximo envio, el archivo desaparecerá y no dejará de estar versionado. Si has modificado el archivo y lo has añadido al índice, deberás forzar la eliminación con el argumento `-f`. Esta es una medida de seguridad para prevenir la eliminación accidental de información que aún no ha sido versionada y que no podrá ser recuperada del repositorio Git.

Otro dato que te podrá resultar útil conocer es que puedes mantener un archivo en tu copia de trabajo pero puedes eliminarlo del área de estacionado. En otras palabras, puedes dejar el archivo en el disco dura pero evitar que Git lo versione. Esta funcionalidad es muy útil si olvidás añadir algo al archivo `.gitignore` y accidentalmente lo versionas, como podría ser un archivo de log muy extenso o un montón de archivo `.a` generados por un compilador. Para hacer uso de esta función, debes utilizar la opción `--cached` junto con el comando para eliminar un archivo:

	$ git rm --cached readme.txt

El comando `git rm` también acepta tanto archivos como directorios o patrones globales. Esto signfica que puedes hacer cosas como las siguientes

	$ git rm log/\*.log

Presta atención a la barra invertida (`\`) que está delante del `*`. Esta es necesaria debido a que Git realiza su propia expansión en los nombres de los archivo en adición a la que realiza el shell. Este comando elimina todos los archivos que tengan la extensión `.log` en el directorio `log/`. O puedes hacer algo como lo siguiente:

	$ git rm \*~

Este comando elimina todos los archivos que finalizan en `~`.

## Moving Files

Unlike many other VCS systems, Git doesn’t explicitly track file movement. If you rename a file in Git, no metadata is stored in Git that tells it you renamed the file. However, Git is pretty smart about figuring that out after the fact — we’ll deal with detecting file movement a bit later.

Thus it’s a bit confusing that Git has a `mv` command. If you want to rename a file in Git, you can run something like

	$ git mv file_from file_to

and it works fine. In fact, if you run something like this and look at the status, you’ll see that Git considers it a renamed file:

	$ git mv README.txt README
	$ git status
	# On branch master
	# Your branch is ahead of 'origin/master' by 1 commit.
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       renamed:    README.txt -> README
	#

However, this is equivalent to running something like this:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git figures out that it’s a rename implicitly, so it doesn’t matter if you rename a file that way or with the `mv` command. The only real difference is that `mv` is one command instead of three — it’s a convenience function. More important, you can use any tool you like to rename a file, and address the add/rm later, before you commit.
