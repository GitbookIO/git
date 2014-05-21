# Archivos empaquetadores

Volviendo a los objetos en la base de datos de tu repositorio Git de pruebas. En este momento, tienes 11 objetos --4 binarios, 3 árboles, 3 confirmaciones de cambios y 1 etiqueta--. 

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git comprime todos esos archivos con zlib, por lo que ocupan más bien poco. Entre todos suponen solamente 925 bytes. Puedes añadir algún otro archivo de gran contenido al repositorio. Y verás una interesante funcionalidad de Git. Añadiendo el archivo repo.rb de la libreria Grit con la que has estado trabajando anteriormente, supondrá añadir un achivo con unos 12 Kbytes de código fuente.

	$ curl http://github.com/mojombo/grit/raw/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb 
	$ git commit -m 'added repo.rb'
	[master 484a592] added repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

Si hechas un vistazo al árbol resultante, podrás observar el valor SHA-1 del objeto binario correspondiente a dicho archivo repo.rb:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Y ver su tamaño con el comando `git cat-file`:

	$ git cat-file -s 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	12898

Ahora, modifica un poco dicho archivo y comprueba lo que sucede:

	$ echo '# testing' >> repo.rb 
	$ git commit -am 'modified repo a bit'
	[master ab1afef] modified repo a bit
	 1 files changed, 1 insertions(+), 0 deletions(-)

Revisando el árbol creado por esta última confirmación de cambios, verás algo interesante:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

El objeto binario es ahora un binario completamente diferente. Aunque solo has añadido una única línea al final de un archivo que ya contenia 400 líneas, Git ha almacenado el resultado como un objeto completamente nuevo.

	$ git cat-file -s 05408d195263d853f09dca71d55116663690c27c
	12908

Y, así, tienes en tu disco dos objetos de 12 Kbytes prácticamente idénticos. ¿No seria práctico si Git pudiera almacenar uno de ellos completo y luego solo las diferencias del segundo con respecto al primero?

Pues bien, Git lo puede hacer. El formato inicial como Git guarda sus objetos en disco es el formato conocido como "relajado" (loose). Pero, sin embargo, de vez en cuando, Git suele agrupar varios de esos objetos en un único binario denominado archivo "empaquetador". Para ahorrar espacio y hacer así más eficiente su almacenamiento. Esto sucede cada vez que tiene demasiados objetos en formato "relajado"; o cuando tu invocas manualmente al comando `git gc`; o justo antes de enviar cualquier cosa a un servidor remoto.  Puedes comprobar el proceso pidiendole expresamente a Git que empaquete objetos, utilizando el comando `git gc`: 

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

Tras esto, si miras los objetos presentes en la carpeta, veras que han desaparecido la mayoria de los que habia anteriormente. Apareciendo un par de objetos nuevos:

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

Solo han quedado aquellos objetos binarios no referenciados por ninguna confirmación de cambios --en este caso, el ejemplo de "¿que hay de nuevo, viejo?" y el ejemplo de "contenido de pruebas"-- Porque nunca los has llegado a incluir en ninguna confirmación de cambios, no se han considerado como objetos definitivos y, por tanto, no han sido empaquetados.

Los otros archivos presentes son el nuevo archivo empaquetador y un índice. El archivo empaquetador es un único archivo conteniendo dentro de él todos los objetos sueltos eliminados del sistema de archivo. El índice es un archivo que contiene las posiciones de cada uno de esos objetos dentro del archivo empaquetador. Permitiendonos así buscarlos y extraer rápidamente cualquiera de ellos. Lo que es interesante es el hecho de que, aunque los objetos originales presentes en el disco antes del `gc` ocupaban unos 12 Kbytes, el nuevo archivo empaquetador apenas ocupa 6 Kbytes.  Empaquetando los objetos, has conseguido reducir a la mitad el uso de disco.

¿Cómo consigue Git esto? Cuando Git empaqueta objetos, va buscando archivos de igual nombre y tamaño similar. Almacenando únicamente las diferencias entre una versión de cada archivo y la siguiente. Puedes comprobarlo mirando en el interior del archivo empaquetador. Y, para eso, has de utilizar el comando "de fontaneria" `git verify-pack`:

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

Puedes observar que el objeto binario `9bc1d`, (correspondiente a la primera versión de tu archivo repo.rb), tiene una referencia al binario `05408` (la segunda versión de ese archivo). La tercera columna refleja el tamaño de cada objeto dentro del paquete. Observandose que `05408` ocupa unos 12 Kbytes; pero `9bc1d` solo ocupa 7 bytes.  Resulta curioso que se almacene completa la segunda versión del archivo, mientras que la versión original es donde se almacena solo la diferencia. Esto se debe a la mayor probabilidad de que vayamos a recuperar rápidamente la versión mas reciente del archivo.

Lo verdaderamente interesante de todo este proceso es que podemos reempaquetar en cualquier momento De vez en cuando, Git, en su empeño por optimizar la ocupación de espacio, reempaqueta automaticamente toda la base de datos Pero, también tu mismo puedes reempaquetar en cualquier momento, lanzando manualmente el comando `git gc`.
