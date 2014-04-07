# SSH 공개키 만들기

이미 말했듯이 많은 Git 서버들은 SSH 공개키로 인증한다. 공개키를 사용하려면 일단 공개키를 만들어야 한다. 공개키를 만드는 방법은 모든 운영체제가 비슷하다. 먼저 키가 있는지부터 확인하자. 사용자의 SSH 키들은 기본적으로 사용자의 `~/.ssh` 디렉토리에 저장한다. 그래서 만약  디렉토리의 파일을 살펴보면 공개키가 있는지 확인할 수 있다:

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

something, something.pub이라는 형식으로 된 파일을 볼 수 있다. something은 보통 `id_dsa`나 `id_rsa`라고 돼 있다. 그중 `.pub`파일이 공개키이고 다른 파일은 개인키이다. 만약 이 파일이 없거나 `.ssh` 디렉토리도 없으면 `ssh-keygen`이라는 프로그램으로 키를 생성해야 한다. `ssh-keygen` 프로그램은 리눅스나 Mac의 SSH 패키지에 포함돼 있고 윈도는 MSysGit 패키지 안에 들어 있다:

	$ ssh-keygen
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
	Enter passphrase (empty for no passphrase):
	Enter same passphrase again:
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

먼저 키를 어디에 저장할지 경로를(`.ssh/id_rsa`) 입력하고 암호를 두 번 입력한다. 이때 암호를 비워두면 키를 사용할 때 암호를 묻지 않는다.

사용자는 그 다음에 자신의 공개기를 Git 서버 관리자에게 보내야 한다. 사용자는 `.pub` 파일의 내용을 복사하여 메일을 보내기만 하면 된다. 공개키는 아래와 같이 생겼다:

	$ cat ~/.ssh/id_rsa.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

다양한 운영 체제에서 SSH 키를 만드는 방법이 궁금하면 `http://github.com/guides/providing-your-ssh-key`에 있는 Github 설명서를 찾아보는 게 좋다.
