# Gitosis

처음에는 모든 사용자의 공개키를 `authorized_keys`에 저장하는 방법으로도 불편하지 않을 것이다. 하지만, 사용자가 수백 명이 넘으면 관리하기가 매우 고통스럽다. 사용자를 추가할 때마다 매번 서버에 접속할 수도 없고 권한 관리도 안된다. `authorized_keys`에 등록된 모든 사용자는 누구나 프로젝트를 읽고 쓸 수 있다.

이 문제는 매우 널리 사용되고 있는 Gitosis라는 소프트웨어로 해결할 수 있다. Gitosis는 기본적으로 `authorized_keys` 파일을 관리하고 접근제어를 돕는 스크립트 패키지다. 사용자를 추가하고 권한을 관리하는 UI가 웹 인터페이스가 아니라 일종의 Git 저장소라는 점이 재미있다. 프로젝트 설정을 Push하면 그 설정이 Gitosis에 적용된다. 신비롭다!

Gitosis를 설치하기가 쉽지는 않지만 그렇다고 어렵지도 않다. Gitosis는 리눅스에 설치하는 것이 가장 쉽다. 여기서는 Ubuntu 8.10 서버를 사용한다.

Gitosis는 Python이 필요하기 때문에 먼저 Python setuptools 패키지를 설치해야 한다. Ubuntu에서는 아래와 같이 설치한다:

	$ apt-get install python-setuptools

그리고 Gitosis 프로젝트 사이트에서 Gitosis를 Clone한 후 설치한다:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

Gitosis가 설치되면 Gitosis는 저장소 디렉토리로 `/home/git`를 사용하려고 한다. 이대로 사용해도 괜찮지만, 우리의 저장소는 이미 `/opt/git`에 있다. 다시 설정하지 말고 아래와 같이 간단하게 심볼릭 링크를 만들자:

	$ ln -s /opt/git /home/git/repositories

Gitosis가 키들을 관리할 것이기 때문에 현재 파일은 삭제하고 다시 추가해야 한다. 이제부터는 Gitosis가 `authorized_keys`파일을 자동으로 관리할 것이다. `authorized_keys` 파일을 백업해두자:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

그리고 `git` 계정의 쉘을 `git-shell`로 변경했었다면 원래대로 복원해야 한다. Gitosis가 대신 이 일을 맡아줄 것이기 때문에 복원해도 사람들은 여전히 로그인할 수 없다. `/etc/passwd` 파일의 다음 줄을:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

아래와 같이 변경한다:

	git:x:1000:1000::/home/git:/bin/sh

이제 Gitosis를 초기화할 차례다. `gitosis-init` 명령을 공개키와 함께 실행한다. 만약 공개키가 서버에 없으면 공개키를 서버로 복사해와야 한다:

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

이 명령으로 등록하는 키의 사용자는 Gitosis를 제어하는 파일들이 있는 Gitosis 설정 저장소를 수정할 수 있게 된다. 그리고 수동으로 `post-update` 스크립트에 실행권한을 부여한다:

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

모든 준비가 끝났다. 설정이 잘 됐으면 추가한 공개키의 사용자로 SSH 서버에 접속했을 때 아래와 같은 메시지를 보게 된다:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	fatal: unrecognized command 'gitosis-serve schacon@quaternion'
	  Connection to gitserver closed.

이것은 접속을 시도한 사용자가 누구인지 식별할 수는 있지만, Git 명령이 아니어서 거절한다는 뜻이다. 그러니까 실제 Git 명령어를 실행시켜보자. Gitosis 제어 저장소를 Clone한다:

	# on your local computer
	$ git clone git@gitserver:gitosis-admin.git

`gitosis-admin`이라는 디렉토리가 생긴다. 디렉토리 내용은 크게 두 가지로 나눌 수 있다:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

`gitoiss.conf` 파일은 사용자, 저장소, 권한 등을 명시하는 설정파일이다. `keydir` 디렉토리에는 저장소에 접근할 수 있는 사용자의 공개키가 저장된다. 사용자마다 공개키가 하나씩 있고 이 공개키로 서버에 접근한다. 이 예제에서는 `scott.pub`이지만 `keydir` 안에 있는 파일의 이름은 사용자마다 다르다. 파일 이름은 `gitosis-init` 스크립트로 공개키를 추가할 때 결정되는데 공개키 끝 부분에 있는 이름이 사용된다.

이제 `gitosis.conf` 파일을 열어보자. 지금 막 Clone한 `gitosis-admin` 프로젝트에 대한 정보만 들어 있다:

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

scott이라는 사용자는 Gitosis를 초기화할 때 사용한 공개키의 사용자이다. 이 사용자만 `gitosis-admin` 프로젝트에 접근할 수 있다.

이제 프로젝트를 새로 추가해보자. `mobile` 단락을 추가하고 그 프로젝트에 속한 개발자나 프로젝트에 접근해야 하는 사용자를 추가한다. 현재는 scott이외에 다른 사용자가 없으니 `scott`만 추가한다. 그리고 `iphone_project` 프로젝트를 새로 추가한다:

	[group mobile]
	writable = iphone_project
	members = scott

`gitosis-admin` 프로젝트를 수정하면 커밋하고 서버에 Push해야 수정한 설정이 적용된다:

	$ git commit -am 'add iphone_project and mobile group'
	[master]: created 8962da8: "changed name"
	 1 files changed, 4 insertions(+), 0 deletions(-)
	$ git push
	Counting objects: 5, done.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 272 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	To git@gitserver:/opt/git/gitosis-admin.git
	   fb27aec..8962da8  master -> master

로컬에 있는 `iphone_project` 프로젝트에 이 서버를 리모트 저장소로 추가하고 Push하면 서버에 새로운 저장소가 추가된다. 서버에 프로젝트를 새로 만들 때 이제는 수동으로 Bare 저장소를 만들 필요가 없다. 처음 Push할 때 Gitosis가 알아서 생성해 준다:

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Gitosis를 이용할 때에는 저장소 경로를 명시할 필요도 없고 사용할 수도 없다. 단지 콜론 뒤에 프로젝트 이름만 적어도 Gitosis가 알아서 찾아 준다.

동료와 이 프로젝트를 공유하려면 동료의 공개키도 모두 추가해야 한다. `~/.ssh/authorized_keys` 파일에 수동으로 추가하는 게 아니라 `keydir` 디렉토리에 하나의 공개키를 하나의 파일로 추가한다. 이 공개키의 파일이름이 `gitosis.conf` 파일에서 사용하는 사용자 이름을 결정한다. John, Josie, Jessica의 공개키를 추가해 보자:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

이 세 사람을 모두 mobile 팀으로 추가하여 `iphone_project` 에 대한 읽기, 쓰기를 허용한다:

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

이 파일을 커밋하고 Push하고 나면 네 명 모두 `iphone_project`를 읽고 쓸 수 있게 된다.

Gitosis의 접근제어 방법은 매우 단순하다. 만약 이 프로젝트에 대해서 John은 읽기만 가능하도록 설정하려면 아래와 같이 한다:

	[group mobile]
	writable = iphone_project
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_project
	members = john

이제 John은 프로젝트를 Clone하거나 Fetch할 수는 있지만, 프로젝트에 Push할 수는 없다. 다양한 사용자와 프로젝트가 있어도 필요한 만큼 그룹을 만들어 사용하면 된다. 그리고 members 항목에 사용자 대신 그룹명을 사용할 수도 있다. 그룹명 앞에 `@`를 붙이면 그 그룹의 사용자을 그대로 상속한다:

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_project
	members   = @mobile_committers

	[group mobile_2]
	writable  = another_iphone_project
	members   = @mobile_committers john

`[gitosis]` 절에 `loglevel=DEBUG`라고 적으면 문제가 생겼을 때 해결하는데 도움이 된다. 그리고 설정이 꼬여버려서 Push할 수 없게 되면 서버에 있는 파일을 수동으로 고쳐도 된다. Gitosis는 `/home/git/.gitosis.conf` 파일의 정보를 읽기 때문에 이 파일을 고친다. `gitosis.conf`는 Push할 때 그 위치로 복사되기 때문에 수동으로 고친 파일은 `gitosis-admin` 프로젝트가 다음에 Push될 때까지 유지된다.
