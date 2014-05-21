# Preparando el servidor

Vamos a avanzar en los ajustes de los accesos SSH en el lado del servidor. En este ejemplo, usarás el método de las 'claves autorizadas' para autentificar a tus usuarios. Se asume que tienes un servidor en marcha, con una distribución estandar de Linux, tal como Ubuntu. Comienzas creando un usuario 'git' y una carpeta '.ssh' para él.

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

Y a continuación añades las claves públicas de los desarrolladores al archivo 'autorized_keys' del usuario 'git' que has creado. Suponiendo que hayas recibido las claves por correo electrónico y que las has guardado en archivos temporales. Y recordando que las claves públicas son algo así como:

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

No tienes más que añadirlas al archivo 'authorized_keys':

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Tras esto, puedes preparar un repositorio básico vacio para ellos, usando el comando 'git init' con la opción '--bare' para inicializar el repositorio sin carpeta de trabajo:

	$ cd /opt/git
	$ mkdir project.git
	$ cd project.git
	$ git --bare init

Y John, Josie o Jessica podrán enviar (push) la primera versión de su proyecto a dicho repositorio, añadiendolo como remoto y enviando (push) una rama (branch). Cabe indicar que alguien tendrá que iniciar sesión en la máquina y crear un repositorio básico, cada vez que se desee añadir un nuevo proyecto. Suponiendo, por ejemplo, que se llame 'gitserver' el servidor donde has puesto el usuario 'git' y los repositorios; que dicho servidor es interno a vuestra red y que está asignado el nombre 'gitserver' en vuestro DNS.  Podrás utlizar comandos tales como:

	# en la máquina de John
	$ cd myproject
	$ git init
	$ git add .
	$ git commit -m 'initial commit'
	$ git remote add origin git@gitserver:/opt/git/project.git
	$ git push origin master

Tras lo cual, otros podrán clonarlo y enviar cambios de vuelta:

	$ git clone git@gitserver:/opt/git/project.git
	$ vim README
	$ git commit -am 'fix for the README file'
	$ git push origin master

Con este método, puedes preparar rápidamente un servidor Git con acceso de lectura/escritura para un grupo de desarrolladores.

Para una mayor protección, puedes restringir facilmente el usuario 'git' a realizar solamente actividades relacionadas con Git. Utilizando un shell limitado llamado 'git-shell', que viene incluido en Git. Si lo configuras como el shell de inicio de sesión de tu usuario 'git', dicho usuario no tendrá acceso al shell normal del servidor. Para especificar el 'git-shell' en lugar de bash o de csh como el shell de inicio de sesión de un usuario, Has de editar el archivo '/etc/passwd':

	$ sudo vim /etc/passwd

Localizar, al fondo, una línea parecida a:

	git:x:1000:1000::/home/git:/bin/shgit:x:1000:1000::/home/git:/bin/sh

Y cambiar '/bin/sh' por '/usr/bin/git-shell' (nota: puedes utilizar el comando 'which git-shell' para ver dónde está instalado dicho shell). Quedará una linea algo así como:

	git:x:1000:1000::/home/git:/usr/bin/git-shellgit:x:1000:1000::/home/git:/usr/bin/git-shell

De esta forma dejamos al usuario 'git' limitado a utilizar la conexión SSH solamente para enviar (push) y recibir (pull) repositorios, sin posibilidad de iniciar una sesión normal en el servidor. Si pruebas a hacerlo, recibiras un rechazo de inicio de sesión:

	$ ssh git@gitserver
	fatal: What do you think I am? A shell?
	Connection to gitserver closed.
