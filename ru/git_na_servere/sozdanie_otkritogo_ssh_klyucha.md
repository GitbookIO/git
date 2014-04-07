# Создание открытого SSH-ключа

Как было уже сказано, многие Git-серверы используют аутентификацию по открытым SSH-ключам. Для того чтобы предоставить открытый ключ, пользователь должен его сгенерировать, если только это не было сделано ранее. Этот процесс похож во всех операционных системах.
Сначала вам стоит убедиться, что у вас ещё нет ключа. По умолчанию пользовательские SSH-ключи хранятся в каталоге `~/.ssh` этого пользователя. Вы можете легко проверить, есть ли у вас ключ, зайдя в этот каталог и посмотрев его содержимое:

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

Ищите пару файлов с именами "что-нибудь" и "что-нибудь.pub", где "что-нибудь" — обычно `id_dsa` или `id_rsa`. Файл с расширением `.pub` — это ваш открытый ключ, а второй файл — ваш секретный ключ. Если у вас нет этих файлов (или даже нет каталога `.ssh`), вы можете создать их, запустив программу `ssh-keygen`, которая входит в состав пакета SSH в системах Linux/Mac, а также поставляется в составе MSysGit для Windows:

	$ ssh-keygen 
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa): 
	Enter passphrase (empty for no passphrase): 
	Enter same passphrase again: 
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

Сначала необходимо указать расположение файла для сохранения ключа (`.ssh/id_rsa`), затем дважды ввести пароль, который вы можете оставить пустым, если не хотите его вводить каждый раз, когда используете ключ.

Теперь каждый пользователь должен послать свой открытый ключ вам или тому, кто администрирует Git-сервер (предположим, что ваш SSH-сервер уже настроен на работу с открытыми ключами). Для этого им нужно скопировать всё содержимое файла с расширением `.pub` и отправить его по электронной почте. Открытый ключ выглядит следующим образом:

	$ cat ~/.ssh/id_rsa.pub 
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

Более подробное руководство по созданию SSH-ключей на различных системах вы можете найти в руководстве GitHub по SSH-ключам на `http://github.com/guides/providing-your-ssh-key`.
