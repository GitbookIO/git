# GitWeb

프로젝트 저장소를 단순히 읽거나 쓰는 것에 대한 설정은 다뤘다. 이제는 웹 기반 인터페이스를 설정해보자. Git에는 GitWeb이라는 CGI 스크립트를 제공해서 쉽게 웹에서 저장소를 조회하도록 할 수 있다. `http://git.kernel.org`같은 사이트에서 GitWeb을 구경할 수 있다(그림 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)

그림 4-1. Git 웹용 UI, GitWeb

Git은 GitWeb을 쉽게 사용해 볼 수 있도록 서버를 잠시 띄우는 명령을 제공한다. 시스템에 `lighttpd`나 `webrick` 같은 경량 웹서버가 설치돼 있어야 이 명령을 사용할 수 있다. 리눅스에서는 `lighttpd`가 설치돼 있을 확률이 높고 프로젝트 디렉토리에서 그냥 `git instaweb`을 실행하면 바로 실행된다. Mac의 Leopard 버전은 Ruby가 미리 설치돼 있기 때문에 `webrick`이 더 낫다. lighttpd이 아니라면 아래와 같이 `--httpd` 옵션을 사용해야 한다:

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

1234 포트로 HTTPD 서버를 시작하고 이 페이지를 여는 웹브라우저를 자동으로 실행시킨다. 꽤 편리하다. 필요한 일을 모두 마치고 나서 같은 명령어에 `--stop` 옵션을 추가하여 서버를 중지한다:

	$ git instaweb --httpd=webrick --stop

항상 접속가능한 웹 인터페이스를 운영하려면 먼저 웹서버에 이 CGI 스크립트를 설치해야 한다. `apt`나 `yum`으로도 `gitweb`을 설치할 수 있지만, 여기에서는 수동으로 설치한다. 먼저 GitWeb이 포함된 Git 소스 코드를 구한 다음 CGI 스크립트를 빌드한다:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb/gitweb.cgi
	$ sudo cp -Rf gitweb /var/www/

빌드할 때 `GITWEB_PROJECTROOT` 변수로 Git 저장소의 위치를 알려줘야 한다. 이제 Apache가 이 스크립트를 사용하도록 VirtualHost 항목을 설정한다:

	<VirtualHost *:80>
	    ServerName gitserver
	    DocumentRoot /var/www/gitweb
	    <Directory /var/www/gitweb>
	        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
	        AllowOverride All
	        order allow,deny
	        Allow from all
	        AddHandler cgi-script cgi
	        DirectoryIndex gitweb.cgi
	    </Directory>
	</VirtualHost>

다시 말해서 GitWeb은 CGI를 지원하는 웹서버라면 아무거나 사용할 수 있다. 이제 `http://gitserver/`에 접속하여 온라인으로 저장소를 확인할 수 있을 뿐만 아니라 `http://git.gitserver`를 통해서 HTTP 프로토콜로 저장소를 Clone하고 Fetch할 수 있다.
