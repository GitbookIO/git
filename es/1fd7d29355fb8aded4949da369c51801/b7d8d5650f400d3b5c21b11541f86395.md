# Un ejemplo de implantación de una determinada política en Git

En esta sección, utilizarás lo aprendido para establecer un flujo de trabajo en Git que: compruebe si los mensajes de confirmación de cambios encajan en un determinado formato, obligue a realizar solo envios de avance directo, y permita solo a ciertos usuarios modificar ciertas carpetas del proyecto. Para ello, has de preparar los correspondientes scripts de cliente (para ayudar a los desarrolladores a saber de antemano si sus envios van a ser rechazados o no), y los correspondientes scripts de servidor (para obligar a cumplir esas políticas).

He usado Ruby para escribir los ejemplos, tanto porque es mi lenguaje preferido de scripting y porque creo que es el más parecido a pseudocódigo; de tal forma que puedas ser capaz de seguir el código, incluso si no conoces Ruby. Pero, puede ser igualmente válido cualquier otro lenguaje. Todos los script de ejemplo que vienen de serie con Git están escritos en Perl o en Bash shell, por lo que tienes bastantes ejemplos en esos lenguajes de scripting.

## Punto de enganche en el lado servidor

Todo el trabajo del lado servidor va en el script 'update' de la carpeta 'hooks'. El script 'update' se lanza una vez por cada rama que se envia (push) al servidor; y recibe la referencia de la rama a la que se envia, la antigua revisión en que estaba la rama y la nueva revisión que se está enviando. También puedes tener acceso al usuario que está enviando, si este los envia a través de SSH. Si has permitido a cualquiera conectarse con un mismo usuario (como "git", por ejemplo), has tenido que dar a dicho usuario una envoltura (shell wraper) que te permite determinar cual es el usuario que se conecta según sea su clave pública, permitiendote fijar una variable de entorno especificando dicho usuario. Aqui, asumiremos que el usuario conectado queda reflejado en la variable de entorno '$USER', de tal forma que el script 'update' comienza recogiendo toda la información que necesitas:

	#!/usr/bin/env ruby#!/usr/bin/env ruby#!/usr/bin/env ruby

	$refname = ARGV[0]
	$oldrev  = ARGV[1]
	$newrev  = ARGV[2]
	$user    = ENV['USER']

	puts "Enforcing Policies... \n(#{$refname}) (#{$oldrev[0,6]}) (#{$newrev[0,6]})"

Sí, estoy usando variables globales. No me juzgues por ello, --es más sencillo mostrarlo de esta manera--.

### Obligando a utilizar un formato específico en el mensaje de confirmación de cambios

Tu primer reto es asegurarte que todos y cada uno de los mensajes de confirmación de cambios se ajustan a un determinado formato. Simplemente por fijar algo concreto, supongamos que cada mensaje ha de incluir un texto tal como "ref: 1234", porque quieres enlazar cada confirmación de cambios con una determinada entrada de trabajo en un sistema de control. Has de mirar en cada confirmación de cambios (commit) recibida, para ver si contiene ese texto; y, si no lo trae, salir con un código distinto de cero, de tal forma que el envio (push) sea rechazado.

Puedes obtener la lista de las claves SHA-1 de todos las confirmaciones de cambios enviadas cogiendo los valores de '$newrev' y de '$oldrev', y pasandolos a comando de mantenimiento de Git llamado 'git rev-list'. Este comando es básicamente el mismo que 'git log', pero por defecto, imprime solo los valores SHA-1 y nada más. Con él, puedes obtener la lista de todas las claves SHA que se han introducido entre una clave SHA y otra clave SHA dadas; obtendrás algo así como esto:

	$ git rev-list 538c33..d14fc7
	d14fc7c847ab946ec39590d87783c69b031bdfb7
	9f585da4401b0a3999e84113824d15245c13f0be
	234071a1be950e2a8d078e6141f5cd20c1e61ad3
	dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
	17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

Puedes coger esta salida, establecer un bucle para recorrer cada una de esas confirmaciones de cambios, coger el mensaje de cada una y comprobarlo contra una expresión regular de búsqueda del patrón deseado.

Tienes que imaginarte cómo puedes obtener el mensaj ede cada una de esas confirmaciones de cambios a comprobar. Para obtener los datos "en crudo"  de una confirmación de cambios, puedes utilizar otro comando de mantenimiento de Git denominado 'git cat-file'. En el capítulo 9 volveremos en detalle sobre estos comandos de mantenimiento; pero, por ahora, esto es lo que obtienes con dicho comando:

	$ git cat-file commit ca82a6
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Una vía sencilla para obtener el mensaje, es la de ir hasta la primera línea en blanco y luego coger todo lo que siga a esta. En los sistemas Unix, lo puedes realizar con el comando 'sed':

	$ git cat-file commit ca82a6 | sed '1,/^$/d'
	changed the version number

Puedes usar este "hechizo mágico" para coger el mensaje de cada confirmación de cambios que se está enviando y salir si localizas algo que no cuadra en alguno de ellos. Para salir del script y rechazar el envio, recuerda que debes salir con un código distinto de cero. El método completo será algo así como:

	$regex = /\[ref: (\d+)\]/$regex = /\[ref: (\d+)\]/

	# enforced custom commit message format
	def check_message_format
	  missed_revs = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  missed_revs.each do |rev|
	    message = `git cat-file commit #{rev} | sed '1,/^$/d'`
	    if !$regex.match(message)
	      puts "[POLICY] Your message is not formatted correctly"
	      exit 1
	    end
	  end
	end
	check_message_format

Poniendo esto en tu script 'update', serán rechazadas todas las actualizaciones que contengan cambios con mensajes que no se ajusten a tus reglas.

### Implementando un sistema de control de accesos basado en usuario

Imaginemos que deseas implementar un sistema de control de accesos (Access Control List, ACL). Para vigilar qué usuarios pueden enviar (push) cambios a qué partes de tus proyectos. Algunas personas tendrán acceso completo, y otras tan solo acceso a ciertas carpetas o a ciertos archivos. Para implementar esto, has de escribir esas reglas de acceso en un archivo denominado 'acl' ubicado en tu repositorio git básico en el servidor. Y tienes que preparar el enganche 'update' para hacerle consultar esas reglas, mirar los archivos que están siendo subidos en las confirmaciones de cambio (commit) enviadas (push), y determinar así si el usuario emisor del  envio tiene o no permiso para actualizar esos archivos.

Como hemos dicho, el primer paso es escribir tu lista de control de accesos (ACL). Su formato es muy parecido al del mecanismo CVS ACL: utiliza una serie de líneas donde el primer campo es 'avail' o 'unavail' (permitido o no permitido), el segundo campo es una lista de usuarios separados por comas, y el último campo es la ubicación (path) sobre el que aplicar la regla (dejarlo en blanco equivale a un acceso abierto). Cada uno de esos campos se separan entre sí con el caracter barra vertical ('|').

Por ejemplo, si tienes un par de administradores, algunos redactores técnicos con acceso a la carpeta 'doc', y un desarrollador que únicamente accede a las carpetas 'lib' y 'test', el archivo ACL resultante seria:

	avail|nickh,pjhyett,defunkt,tpw
	avail|usinclair,cdickens,ebronte|doc
	avail|schacon|lib
	avail|schacon|tests

Para implementarlo, hemos de leer previamente estos datos en una estructura que podamos emplear. En este caso, por razones de simplicidad, vamos a mostrar únicamente la forma de implementar las directivas 'avail' (permitir). Este es un método que te devuelve un array asociativo cuya clave es el nombre del usuario y su valor es un array de ubicaciones (paths) donde ese usuario tiene acceso de escritura:

	def get_acl_access_data(acl_file)
	  # read in ACL data
	  acl_file = File.read(acl_file).split("\n").reject { |line| line == '' }
	  access = {}
	  acl_file.each do |line|
	    avail, users, path = line.split('|')
	    next unless avail == 'avail'
	    users.split(',').each do |user|
	      access[user] ||= []
	      access[user] << path
	    end
	  end
	  access
	end

Si lo aplicamos sobre la lista ACL descrita anteriormente, este método 'get acl access_data' devolverá una estructura de datos similar a esta:

	{"defunkt"=>[nil],
	 "tpw"=>[nil],
	 "nickh"=>[nil],
	 "pjhyett"=>[nil],
	 "schacon"=>["lib", "tests"],
	 "cdickens"=>["doc"],
	 "usinclair"=>["doc"],
	 "ebronte"=>["doc"]}

Una vez tienes los permisos en orden, necesitas averiguar las ubicaciones modificadas por las confirmaciones de cambios enviadas; de tal forma que puedas asegurarte de que el usuario que las está enviando tiene realmente permiso para modificarlas.

Puedes comprobar facilmente qué archivos han sido modificados en cada confirmación de cambios, utilizando la opción '--name-only' del comando 'git log' (citado brevemente en el capítulo 2):

	$ git log -1 --name-only --pretty=format:'' 9f585d

	README
	lib/test.rb

Utilizando la estructura ACL devuelta por el método 'get_acl_access_data' y comprobandola sobre la lista de archivos de cada confirmación de cambios, puedes determinar si el usuario tiene o no permiso para enviar dichos cambios:

	# only allows certain users to modify certain subdirectories in a project
	def check_directory_perms
	  access = get_acl_access_data('acl')

	  # see if anyone is trying to push something they can't
	  new_commits = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  new_commits.each do |rev|
	    files_modified = `git log -1 --name-only --pretty=format:'' #{rev}`.split("\n")
	    files_modified.each do |path|
	      next if path.size == 0
	      has_file_access = false
	      access[$user].each do |access_path|
	        if !access_path || # user has access to everything
	          (path.index(access_path) == 0) # access to this path
	          has_file_access = true 
	        end
	      end
	      if !has_file_access
	        puts "[POLICY] You do not have access to push to #{path}"
	        exit 1
	      end
	    end
	  end  
	end

	check_directory_permscheck_directory_perms

La mayor parte de este código debería de ser sencillo de leer. Con 'git rev-list', obtienes una lista de las nuevas confirmaciones de cambio enviadas a tu servidor. Luego, para cada una de ellas, localizas los archivos modificados y te aseguras de que el usuario que las envia tiene realmente acceso a todas las ubicaciones que pretende modificar. Un "rubysmo" que posiblemente sea un tanto oscuro puede ser 'path.index(access_path) == 0' . Simplemente devuelve verdadero en el caso de que la ubicacion comience por 'access_path' ; de esta forma, nos aseguramos de que 'access_path' no esté solo contenido en una de las ubicaciones permitidas, sino sea una ubicación permitida la que comience con la ubicación accedida. 

Una vez implementado todo esto, tus usuarios no podrán enviar confirmaciones de cambios con mensajes mal formados o con modificaciones sobre archivos fuera de las ubicaciones que les hayas designado.

### Obligando a realizar envios solo-de-avance-rapido (Fast-Forward-Only pushes)

Lo único que nos queda por implementar es un mecanismo para limitar los envios a envios de avance rápido (Fast-Forward-Only pushes). En las versiones a partir de la 1.6, puedes ajustar las opciones 'receive.denyDeletes' (prohibir borrados) y 'receive.denyNonFastForwards' (prohibir envios que no sean avances-rápidos). Pero haciendolo a través de un enganche (hook), podrá funcionar también en versiones anteriores de Git, podrás modificarlo para que actue únicamente sobre ciertos usuarios, o podrás realizar cualquier otra acción que estimes oportuna.

La lógica para hacer así la comprobación es la de mirar por si alguna confirmación de cambios se puede alcanzar desde la versión más antigua pero no desde la más reciente. Si hay alguna, entonces es un envio de avance-rápido (fast-forward push); sino hay ninguna, es un envio a prohibir:

	# enforces fast-forward only pushes 
	def check_fast_forward
	  missed_refs = `git rev-list #{$newrev}..#{$oldrev}`
	  missed_ref_count = missed_refs.split("\n").size
	  if missed_ref_count > 0
	    puts "[POLICY] Cannot push a non fast-forward reference"
	    exit 1
	  end
	end

	check_fast_forward

Una vez esté todo listo. Si lanzas el comando 'chmod u+x .git/hooks/update', siendo este el archivo donde has puesto todo este código; y luego intentas enviar una referencia que no sea de avance-rápido, obtendrás algo como esto:

	$ git push -f origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 323 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	Unpacking objects: 100% (3/3), done.
	Enforcing Policies... 
	(refs/heads/master) (8338c5) (c5b616)
	[POLICY] Cannot push a non-fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master
	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'[remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Tenemos un para de aspectos interesantes aquí. Lo primero observado cuando el enganche (hook) arranca es:

	Enforcing Policies... 
	(refs/heads/master) (fb8c72) (c56860)

Precisamente, lo enviado a la salida estandar stdout justo al principio del script de actualización. Cabe destacar que todo lo que se envie a la salida estandar stdout, será transferido al cliente.

Lo segundo que se puede apreciar es el mensaje de error:

	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master

La primera línea la has enviado tú, pero las otras dos son de Git. Indicando que el script de actualización ha terminado con código no-cero y, por tanto, ha rechazado la modificación. Y, por último, se ve:

	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'[remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Un mensaje por cada referencia rechazada por el enganche (hook) de actualización, especificando que ha sido rechazada precisamente por un fallo en el enganche.

Es más, si la referencia (ref marker) no se encuentra presente para alguna de las confirmaciones de cambio, verás el mensaje de error previsto para ello:

	[POLICY] Your message is not formatted correctly

O si alguien intenta editar un archivo sobre el que no tiene acceso y luego envia una confirmación de cambios con ello, verá también algo similar. Por ejemplo, si un editor técnico intenta enviar una confirmación de cambios donde se haya modificado algo de la carpeta 'lib', verá:

	[POLICY] You do not have access to push to lib/test.rb

Y eso es todo. De ahora en adelante, en tanto en cuando el script 'update' este presente y sea ejecutable, tu repositorio nunca se verá perjudicado, nunca tendrá un mensaje de confirmación de cambios sin tu plantilla y tus usuarios estarán controlados.

## Puntos de enganche del lado cliente

Lo malo del sistema descrito en la sección anterior pueden ser los lamentos que inevitablemente se van a producir cuando los envios de tus usuarios sean rechazados. Ver rechazado en el último minuto su tan cuidadosamente preparado trabajo, puede ser realmente frustrante. Y, aún peor, tener que reescribir su histórico para corregirlo puede ser un auténtico calvario.

La solución a este dilema es el proporcionarles algunos enganches (hook) del lado cliente, para que les avisen cuando están trabajando en algo que el servidor va a rechazarles. De esta forma, pueden corregir los problemas antes de confirmar cambios y antes de que se conviertan en algo realmente complicado de arreglar. Debido a que estos enganches no se transfieren junto con el clonado de un proyecto, tendrás que distribuirlos de alguna otra manera. Y luego pedir a tus usuarios que se los copien a sus carpetas '.git/hooks' y los hagan ejecutables. Puedes distribuir esos enganches dentro del mismo proyecto o en un proyecto separado. Pero no hay modo de implementarlos automáticamente.

Para empezar, se necesita chequear el mensaje de confirmación inmediatamente antes de cada confirmación de cambios, para segurarse de que el servidor no los rechazará debido a un mensaje mal formateado. Para ello, se añade el enganche 'commit-msg'. Comparando el mensaje del archivo pasado como primer argumento con el mensaje patrón, puedes obligar a Git a abortar la confirmación de cambios (commit) en caso de no coincidir ambos:

	#!/usr/bin/env ruby
	message_file = ARGV[0]
	message = File.read(message_file)

	$regex = /\[ref: (\d+)\]/$regex = /\[ref: (\d+)\]/

	if !$regex.match(message)
	  puts "[POLICY] Your message is not formatted correctly"
	  exit 1
	end

Si este script está en su sitio (el archivo '.git/hooks/commit-msg') y es ejecutable, al confirmar cambios con un mensaje inapropiado, verás algo asi como:

	$ git commit -am 'test'
	[POLICY] Your message is not formatted correctly

Y la confirmación no se llevará a cabo. Sin embargo, si el mensaje está formateado adecuadamente, Git te permitirá confirmar cambios:

	$ git commit -am 'test [ref: 132]'
	[master e05c914] test [ref: 132]
	 1 files changed, 1 insertions(+), 0 deletions(-)

A continuación, se necesita también asegurarse de no estar modificando archivos fuera del alcance de tus permisos. Si la carpeta '.git' de tu proyecto contiene una copia del archivo de control de accesos (ACL) utilizada previamente, este script 'pre-commit' podrá comprobar los límites:

	#!/usr/bin/env ruby#!/usr/bin/env ruby#!/usr/bin/env ruby

	$user    = ENV['USER']

	# [ insert acl_access_data method from above ]

	# only allows certain users to modify certain subdirectories in a project
	def check_directory_perms
	  access = get_acl_access_data('.git/acl')

	  files_modified = `git diff-index --cached --name-only HEAD`.split("\n")
	  files_modified.each do |path|
	    next if path.size == 0
	    has_file_access = false
	    access[$user].each do |access_path|
	    if !access_path || (path.index(access_path) == 0)
	      has_file_access = true
	    end
	    if !has_file_access
	      puts "[POLICY] You do not have access to push to #{path}"
	      exit 1
	    end
	  end
	end

	check_directory_permscheck_directory_perms

Este es un script prácticamente igual al del lado servidor. Pero con dos importantes diferencias. La primera es que el archivo ACL está en otra ubicación, debido a que el script corre desde tu carpeta de trabajo y no desde la carpeta de Git. Esto obliga a cambiar la ubicación del archivo ACL de

	access = get_acl_access_data('acl')

a 

	access = get_acl_access_data('.git/acl')

La segunda diferencia es la forma de listar los archivos modificados. Debido a que el metodo del lado servidor utiliza el registro de confirmaciones de cambio, pero, sin embargo, aquí la confirmación no se ha registrado aún, la lista de archivos se ha de obtener desde el área de preparación (staging area). En lugar de 

	files_modified = `git log -1 --name-only --pretty=format:'' #{ref}`

tenemos que utilizar 

	files_modified = `git diff-index --cached --name-only HEAD`

Estas dos son las únicas diferencias; en todo lo demás, el script funciona de la misma manera. Es necesario advertir de que se espera que trabajes localmente con el mismo usuario con el que enviarás (push) a la máquina remota. Si no fuera así, tendrás que ajustar manualmente la variable '$user'.

El último aspecto a comprobar es el de no intentar enviar referencias que no sean de avance-rápido. Pero esto es algo más raro que suceda. Para tener una referencia que no sea de avance-rápido, tienes que haber reorganizado (rebase) una confirmación de cambios (commit) ya enviada anteriormente, o tienes que estar tratando de enviar una rama local distinta sobre la misma rama remota.

De todas formas, el único aspecto accidental que puede interesante capturar son los intentos de reorganizar confirmaciones de cambios ya enviadas. El servidor te avisará de que no puedes enviar ningún no-avance-rapido, y el enganche te impedirá cualquier envio forzado

Este es un ejemplo de script previo a reorganización que lo puede comprobar. Con la lista de confirmaciones de cambio que estás a punto de reescribir, las comprueba por si alguna de ellas existe en alguna de tus referencias remotas. Si encuentra alguna, aborta la reorganización:

	#!/usr/bin/env ruby#!/usr/bin/env ruby#!/usr/bin/env ruby

	base_branch = ARGV[0]
	if ARGV[1]
	  topic_branch = ARGV[1]
	else
	  topic_branch = "HEAD"
	end

	target_shas = `git rev-list #{base_branch}..#{topic_branch}`.split("\n")
	remote_refs = `git branch -r`.split("\n").map { |r| r.strip }

	target_shas.each do |sha|
	  remote_refs.each do |remote_ref|
	    shas_pushed = `git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}`
	    if shas_pushed.split(“\n”).include?(sha)
	      puts "[POLICY] Commit #{sha} has already been pushed to #{remote_ref}"
	      exit 1
	    end
	  end
	end

Este script utiliza una sintaxis no contemplada en la sección de Selección de Revisiones del capítulo 6. La lista de confirmaciones de cambio previamente enviadas, se comprueba con:

	git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}

La sintaxis 'SHA^@' recupera todos los padres de esa confirmación de cambios (commit). Estas mirando por cualquier confirmación que se pueda alcanzar desde la última en la parte remota, pero que no se pueda alcanzar desde ninguno de los padres de cualquiera de las claves SHA que estás intentando enviar. Es decir, confirmaciones de avance-rápido.

La mayor pega de este sistema es el que puede llegar a ser muy lento; y muchas veces es innecesario, ya que el propio servidor te va a avisar y te impedirá el envio, siempre y cuando no intentes forzar dicho envio con la opción '-f'. De todas formas, es un ejercicio interesante. Y, en teoria al menos, pude ayudarte a evitar reorganizaciones que luego tengas de hechar para atras y arreglarlas.
