# Poniendo Git en un Servidor

El primer paso para preparar un servidor Git, es exportar un repositorio existente a un nuevo repositorio básico, a un repositorio sin carpeta de trabajo. Normalmente suele ser sencillo.
Tan solo has de utilizar el comando 'clone' con la opción '--bare'. Por convenio, los nombres de los repositorios básicos suelen terminar en '.git', por lo que lanzaremos:

	$ git clone --bare my_project my_project.git
	Initialized empty Git repository in /opt/projects/my_project.git/

El resultado de este comando es un poco confuso. Como 'clone' es fundamentalmente un 'git init' seguido de un 'git fetch', veremos algunos de los mensajes de la parte 'init', concretamente de la parte en que se crea una carpeta vacia. La copia de objetos no da ningún mensaje, pero también se realiza. Tras esto, tendrás una copia de los datos en tu carpeta 'my_project.git'.

Siendo el proceso mas o menos equivalente a haber realizado:

	$ cp -Rf my_project/.git my_project.git

Realmente hay un par de pequeñas diferencias en el archivo de configuración; pero, a efectos prácticos es casi lo mismo. Se coge el repositorio Git en sí mismo, sin la carpeta de trabajo, y se crea una copia en una nueva carpeta específica para él solo.

## Poniendo el repositorio básico en un servidor

Ahora que ya tienes una copia básica de tu repositorio, todo lo que te resta por hacer es colocarlo en un servidor y ajustar los protocolos. Supongamos que has preparado un servidor denominado 'git.example.com', con acceso SSH. Y que quieres guardar todos los repositorios Git bajo la carpeta '/opt/git'. Puedes colocar tu nuevo repositorio simplemente copiandolo:

	$ scp -r my_project.git user@git.example.com:/opt/git

A partir de entonces, cualquier otro usuario con acceso de lectura SSH a la carpeta '/opt/git' del servidor, podrá clonar el repositorio con la orden:

	$ git clone user@git.example.com:/opt/git/my_project.git

Y cualquier usuario SSH que tenga acceso de escritura a la carpeta '/opt/git/my_project.git', tendrá también automáticamente acceso de volcado (push).  Git añadirá automáticamente permisos de escritura al grupo sobre cualquier repositorio donde lances el comando 'git init' con la opción '--shared'.

	$ ssh user@git.example.com
	$ cd /opt/git/my_project.git
	$ git init --bare --shared

Como se vé, es sencillo crear un repositorio básico a partir de un repositorio Git, y ponerlo en un servidor donde tanto tú como tus colaboradores tengais acceso SSH. Ahora ya estás preparado para trabajar con ellos en el proyecto común.

Es importante destacar que esto es, literalmente, todo lo necesario para preparar un servidor Git compartido. Habilitar unas cuantas cuentas SSH en un servidor; colocar un repositorio básico en algún lugar donde esos usuarios tengan acceso de lectura/escritura; y.... ¡listo!, eso es todo lo que necesitas.

En los siguientes apartados, se mostrará como ir más allá y preparar disposiciones más sofisticadas. Incluyendo temas tales como el evitar crear cuentas para cada usuario, el añadir acceso público de lectura, el disponer interfaces de usuario web, el usar la herramienta Gitosis, y mucho más. Pero, ten presente que para colaborar con un pequeño grupo de personas en un proyecto privado, todo lo que necesitas es un servidor SSH y un repositorio básico.

## Pequeños despliegues

Si tienes un proyecto reducido o estás simplemente probando Git en tu empresa y sois unos pocos desarrolladores, el despliegue será sencillo. Porque la gestión de usuarios es precisamente uno de los aspectos más complicados de preparar un servidor Git. En caso de requerir varios repositorios de solo lectura para ciertos usuarios y de lectura/escritura para otros, preparar el acceso y los permisos puede dar bastante trabajo.

### Acceso SSH

Si ya dispones de un servidor donde todos los desarrolladores tengan acceso SSH, te será facil colocar los repositorios en él (tal y como se verá en el próximo apartado). En caso de que necesites un control más complejo y fino sobre cada repositorio, puedes manejarlos a través de los permisos estandar del sistema de archivos.

Si deseas colocar los repositorios en un servidor donde no todas las personas de tu equipo tengan cuentas de acceso, tendrás que dar acceso SSH a aquellas que no lo tengan. Suponiendo que ya tengas el servidor, que el servicio SSH esté instalado y que sea esa la vía de acceso que tú estés utilizando para acceder a él.

Tienes varias maneras para dar acceso a todos los miembros de tu equipo. La primera forma es el habilitar cuentas para todos; es la manera más directa, pero también la más laboriosa. Ya que tendrias que lanzar el comando 'adduser' e inventarte contraseñas temporales para cada uno.

La segunda forma es el crear un solo usuario 'git' en la máquina y solicitar a cada persona que te envie una clave pública SSH, para que puedas añadirlas al archivo  `~/.ssh/authorized_keys` de dicho usuario 'git'. De esta forma, todos pueden acceder a la máquina a través del usuario 'git'. Esto no afecta a los datos de las confirmaciones (commit), ya que el usuario SSH con el que te conectes no es relevante para las confirmaciones de cambios que registres.

Y una tercera forma es el preparar un servidor SSH autenficado desde un servidor LDAP o desde alguna otra fuente de autenficación externa ya disponible. Tan solo con que cada usuario pueda tener acceso al shell de la máquina, es válido cualquier mecanismo de autentificación SSH que se emplee para ello.
