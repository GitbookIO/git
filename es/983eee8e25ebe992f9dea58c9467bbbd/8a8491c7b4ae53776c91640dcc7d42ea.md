# Git en un alojamiento externo

Si no quieres realizar todo el trabajo de preparar tu propio servidor Git, tienes varias opciones para alojar tus proyectos Git en una ubicación externa dedicada. Esta forma de trabajar tiene varias ventajas: un alberge externo suele ser rápido de configurar y sencillo de iniciar proyectos en él; además de no ser necesario preocuparte de su mantenimiento ni de su monitorización. Incluso en el caso de que tengas tu propio servidor interno, puede resultar interesante utilizar también un lugar público; para albergar tu código abierto --normalmente, ahí suele ser más sencillo de localizar por parte de la comunidad--

Actualmente tienes un gran número de opciones del alojamiento, cada una con sus ventajas y desventajas. Para obtener una lista actualizada, puedes mirar en la página GitHosting del wiki principal de Git:

	https://git.wiki.kernel.org/index.php/GitHosting

Por ser imposible el cubrir todos ellos, y porque da la casualidad de que trabajo en uno de ellos, concretamente, en esta sección veremos cómo crear una cuenta y nuevos proyectos albergados en 'GitHub'. Así podrás hacerte una idea de cómo suelen funcionar estos alberges externos. 

GitHub es, de lejos, el mayor sitio de alberge público de proyectos Git de código abierto. Y es también uno de los pocos que ofrece asimismo opciones de alberge privado; de tal forma que puedes tener tanto tus proyectos de código abierto y como los de código comercial cerrado en un mismo emplazamiento. De hecho, nosotros utilizamos también GitHub para colaborar privadamente en este libro.

## GitHub

GitHub es ligeramente distinto a otros sitios de alberge, en tanto en cuanto que contempla espacios de nombres para los proyectos. En lugar de estar focalizado en los proyectos, GitHub gira en torno a los usuarios. Esto significa que, cuando alojo mi proyecto 'grit' en GitHub, no lo encontraras bajo 'github.com/grit', sino bajo 'github.com/schacon/grit'. No existe una versión canónica de ningún proyecto, lo que permite a cualquiera de ellos ser movido facilmente de un usuario a otro en el caso de que el primer autor lo abandone.

GitHub es también una compañia comercial, que cobra por las cuentas que tienen repositorios privados. Pero, para albergar proyectos públicos de código abierto, cualquiera puede crear una cuenta gratuita. Vamos a ver cómo hacerlo.

## Configurando una cuenta de usuario

El primer paso es dar de alta una cuenta gratuita. Si visitas la página de Precios e Inicio de Sesión, en 'http://github.com/plans', y clicas sobre el botón "Registro" ("Sign Up") de las cuentas gratuitas, verás una página de registro:


![](http://git-scm.com/figures/18333fig0402-tn.png)

Figura 4-2. La página de planes GitHub.

En ella, has de elegir un nombre de usuario que esté libre, indicar una cuenta de correo electrónico y poner una contraseña.


![](http://git-scm.com/figures/18333fig0403-tn.png)
 
Figura 4-3. El formulario de registro en GitHub.

Si la tuvieras, es también un buen momento para añadir tu clave pública SSH. Veremos cómo generar una de estas claves, más adelante, en la sección "Ajustes Simples". Pero, si ya tienes un par de claves SSH, puedes coger el contenido correspondiente a la clave pública y pegarlo en la caja de texto preparada para tal fin. El enlace "explicar claves ssh" ("explain ssh keys") te llevará a unas detalladas instrucciones de cómo generarlas en la mayor parte de los principales sistemas operativos.
Clicando sobre el botón de "Estoy de acuerdo, registramé" ("I agree, sign me up"), irás al panel de control de tu recién creado usuario.


![](http://git-scm.com/figures/18333fig0404-tn.png)
 
Figura 4-4. El panel de control del usuario GitHub.

A continuación, puedes crear nuevos repositorios. 

## Creando un nuevo repositório

Puedes empezar clicando sobre el enlace "crear uno nuevo" ("create a new one"), en la zona 'Tus repositorios' ('Your Repositories') del panel de control. Irás al formulario de Crear un Nuevo Repositório (ver Figura 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)
 
Figura 4-5. Creando un nuevo repositório en GitHub.

Es suficiente con dar un nombre al proyecto, pero también puedes añadirle una descripción. Cuando lo hayas escrito, clica sobre el botón "Crear Repositório" ("Create Repository"). Y ya tienes un nuevo repositório en GitHub (ver Figura 4-6)


![](http://git-scm.com/figures/18333fig0406-tn.png)
 
Figura 4-6. Información de cabecera de un proyecto GitHub.

Como aún no tienes código, GitHub mostrará instrucciones sobre cómo iniciar un nuevo proyecto, cómo enviar (push) un proyecto Git preexistente, o cómo importar un proyecto desde un repositório público Subversion (ver Figura 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)
 
Figura 4-7. Instrucciones para un nuevo repositório.

Estas instrucciones son similares a las que ya hemos visto. Para inicializar un proyecto, no siendo aún un proyecto Git, sueles utilizar:

	$ git init
	$ git add .
	$ git commit -m 'initial commit'

Una vez tengas un repositorio local Git, añadele el sitio GitHub como un remoto y envia (push) allí tu rama principal:

	$ git remote add origin git@github.com:testinguser/iphone_project.git
	$ git push origin master

Así, tu proyecto estará alojado en GitHub; y podrás dar su URL a cualquiera con quien desees compartirlo. En este ejemplo, la URL es `http://github.com/testinguser/iphone_project`. En la página de cabecera de cada uno de tus proyectos, podrás ver dos URLs (ver Figura 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)
 
Figura 4-8. Cabecera de proyecto, con una URL pública y otra URL privada.

El enlace "Public Clone URL", es un enlace público, de solo lectura; a través del cual cualquiera puede clonar el proyecto. Puedes comunicar libremente ese URL o puedes publicarlo en tu sitio web o en cualquier otro médio que desees.

El enlace "Your Clone URL", es un enlace de lectura/escritura basado en SSH; a través del cual puedes leer y escribir, pero solo si te conectas con la clave SSH privada correspondiente a la clave pública que has cargado para tu usuario. Cuando otros usuarios visiten la página del proyecto, no verán esta segunda URL --solo verán la URL pública--.

## Importación desde Subversion

Si tienes un proyecto público Subversion que deseas pasar a Git, GitHub suele poder realizar la importación. All fondo de la página de instrucciones, tienes un enlace "Subversion import". Si clicas sobre dicho enlace, verás un formulario con información sobre el proceso de importación y un cuadro de texto donde puedes pegar la URL de tu proyecto Subversion (ver Figura 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)
 
Figura 4-9. El interface de importación desde Subversion.

Si tu proyecto es muy grande, no-estandar o privado, es muy posible que no se pueda importar. En el capítulo 7, aprenderás cómo realizar importaciones manuales de proyectos complejos.

## Añadiendo colaboradores

Vamos a añadir al resto del equipo. Si tanto John, como Josie, como Jessica, todos ellos registran sus respectivas cuentas en GitHub. Y deseas darles acceso de escritura a tu repositorio. Puedes incluirlos en tu proyecto como colaboradores. De esta forma, funcionarán los envios (push) desde sus respectivas claves públicas.

Has de hacer clic sobre el botón "edit" en la cabecera del proyecto o en la pestaña Admin de la parte superior del proyecto; yendo así a la página de administración del proyecto GitHub.


![](http://git-scm.com/figures/18333fig0410-tn.png)
 
Figura 4-10. Página de administración GitHub.

Para dar acceso de escritura a otro usuario, clica sobre el enlace "Add another collaborator". Aparecerá un cuadro de texto, donde podrás teclear un nombre. Según  tecleas, aparecerá un cuadro de ayuda, mostrando posibles nombres de usuario que encajen con lo tecleado. Cuando localices al usuario deseado, clica sobre el botón "Add" para añadirlo como colaborador en tu proyecto (ver Figura 4-11).


![](http://git-scm.com/figures/18333fig0411-tn.png)
 
Figura 4-11. Añadirendo un colaborador a tu proyecto.

Cuando termines de añadir colaboradores, podrás ver a todos ellos en la lista "Repository Collaborators" (ver Figura 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)
 
Figura 4-12. Lista de colaboradores en tu proyecto.

Si deseas revocar el acceso a alguno de ellos, puedes clicar sobre el enlace "revoke", y sus permisos de envio (push) serán revocados. En proyectos futuros, podras incluir también a tu grupo de colaboradores copiando los permisos desde otro proyecto ya existente.

## Tu proyecto

Una vez hayas enviado (push) tu proyecto, o lo hayas importado desde Subversion, tendrás una página principal de proyecto tal como:


![](http://git-scm.com/figures/18333fig0413-tn.png)
 
Figura 4-13. Una página principal de proyecto GitHub.

Cuando la gente visite tu proyecto, verá esta página. Tiene pestañas que llevan a distintos aspectos del proyecto. La pestaña "Commits" muestra una lista de confirmaciones de cambio, en orden cronológico inverso, de forma similar a la salida del comando 'git log'. La pestaña "Network" muestra una lista de toda la gente que ha bifurcado (forked) tu proyecto y ha contribuido a él. La pestaña "Downloads" permite cargar binarios del proyecto y enlaza con tarballs o versiones comprimidas de cualquier punto marcado (tagged) en tu proyecto. La pestaña "Wiki" enlaza con un espacio wiki donde puedes escribir documentación o cualquier otra información relevante sobre tu proyecto. La pestaña "Graphs" muestra diversas visualizaciones sobre contribuciones y estadísticas de tu proyecto. La pestaña principal "Source" en la que aterrizas cuando llegas al proyecto, muestra un listado de la carpeta principal; y muestra también el contenido del archivo README, si tienes uno en ella. Esta pestaña muestra también un cuadro con información sobre la última confirmación de cambio (commit) realizada en el proyecto.

## Bifurcando proyectos

Si deseas contribuir a un proyecto ya existente, en el que no tengas permisos de envio (push). GitHub recomienda bifurcar el proyecto. Cuando aterrizas en la página de un proyecto que te parece interesante y con el que deseas trastear un poco, puedes clicar sobre el botón "fork" de la cabecera del proyecto; de tal forma que GitHub haga una copia del proyecto a tu cuenta de usuario y puedas así enviar (push) cambios sobre él.

De esta forma, los proyectos no han de preocuparse de añadir usuarios como colaboradores para darles acceso de envio (push). La gente puede bifurcar (fork) un proyecto y enviar (push) sobre su propia copia. El gestor del proyecto principal, puede recuperar (pull) esos cambios añadiendo las copias como remotos y fusionando (merge) el trabajo en ellas contenido.

Para bifurcar un proyecto, visita su página (en el ejemplo, mojombo/chronic) y clica sobre el botón "fork" de su cabecera (ver Figura 4-14) 


![](http://git-scm.com/figures/18333fig0414-tn.png)
 
Figura 4-14. Obtener una copia sobre la que escribir, clicando sobre el botón "fork" de un repositorio.

Tras unos segundos, serás redirigido a la página del nuevo proyecto; y en ella se verá que este proyecto es una bifuración (fork) de otro existente (ver Figura 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)
 
Figura 4-15. Tu bifurcación (fork) de un proyecto.

## Resumen de GitHub

Esto es todo lo que vamos a ver aquí sobre GitHub, pero merece la pena destacar lo rápido que puedes hacer todo esto. Puedes crear una cuenta, añadir un nuevo proyecto y contribuir a él en cuestión de minutos. Si tu proyecto es de código abierto, puedes tener también una amplia comunidad de desarrolladores que podrán ver tu proyecto, bifurcarlo (fork) y ayudar contribuyendo a él. Y, por último, comentar que esta puede ser una buena manera de iniciarte y comenzar rápidamente a trabajar con Git.
