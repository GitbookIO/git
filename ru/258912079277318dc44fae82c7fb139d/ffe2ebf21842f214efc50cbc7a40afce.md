# Настраиваем сервер

Давайте рассмотрим настройку доступа по SSH на стороне сервера. В этом примере мы будем использовать метод `authorized_keys` для аутентификации пользователей. Мы подразумеваем, что вы используете стандартный дистрибутив Linux типа Ubuntu. Для начала создадим пользователя 'git' и каталог `.ssh` для этого пользователя:

	$ sudo adduser git
	$ su git
	$ cd
	$ mkdir .ssh

Затем нужно добавить открытый SSH-ключ какого-нибудь разработчика в файл `authorized_keys` этого пользователя. Предположим, вы уже получили несколько ключей по электронной почте и сохранили их во временные файлы. Напомню, открытые ключи выглядят вот так:

	$ cat /tmp/id_rsa.john.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
	ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
	Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
	Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
	O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
	dAv8JggJICUvax2T9va5 gsg-keypair

Вы просто добавляете их в свой файл `authorized_keys`:

	$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
	$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Теперь вы можете создать пустой репозиторий для них, запустив `git init` с параметром `--bare`, что инициализирует репозиторий без рабочего каталога:

	$ cd /opt/git
	$ mkdir project.git
	$ cd project.git
	$ git --bare init

Затем Джон, Джози или Джессика могут отправить первую версию своего проекта в этот репозиторий, добавив его как удалённый и отправив ветку. Заметьте, что кто-то должен заходить на сервер и создавать голый репозиторий каждый раз, когда вы хотите добавить проект. Пусть `gitserver` — имя хоста сервера, на котором вы создали пользователя 'git' и репозиторий. Если он находится в вашей внутренней сети, вы можете настроить DNS-запись для `gitserver`, ссылающуюся на этот сервер, и использовать эти команды:

	# на компьютере Джона 
	$ cd myproject
	$ git init
	$ git add .
	$ git commit -m 'initial commit'
	$ git remote add origin git@gitserver:/opt/git/project.git
	$ git push origin master

Теперь остальные могут склонировать его и отправлять (push) туда изменения так же легко:

	$ git clone git@gitserver:/opt/git/project.git
	$ cd project
	$ vim README
	$ git commit -am 'fix for the README file'
	$ git push origin master

Этим способом вы можете быстро получить Git-сервер с доступом на чтение/запись для небольшой группы разработчиков.

В качестве дополнительной меры предосторожности вы можете ограничить возможности пользователя 'git' только действиями, связанными с Git'ом, с помощью ограниченной оболочки `git-shell`, поставляемой вместе с Git'ом. Если вы выставите её в качестве командного интерпретатора пользователя 'git', то этот пользователь не сможет получить доступ к обычной командной оболочке на вашем сервере. Чтобы её использовать, укажите `git-shell` вместо bash или csh в качестве командной оболочки пользователя. Для этого вы должны отредактировать файл `/etc/passwd`:

	$ sudo vim /etc/passwd

В конце вы должны найти строку, похожую на эту:

	git:x:1000:1000::/home/git:/bin/sh

Замените `/bin/sh` на `/usr/bin/git-shell` (или запустите `which git-shell`, чтобы проверить, куда он установлен). Отредактированная строка должна выглядеть следующим образом:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

Теперь пользователь 'git' может использовать SSH-соединение только для работы с Git-репозиториями и не может зайти на машину. Вы можете попробовать и увидите, что вход в систему отклонён:

	$ ssh git@gitserver
	fatal: What do you think I am? A shell?
	Connection to gitserver closed.
