# Gitolite

이 절에서는 Gitolite가 뭐고 기본적으로 어떻게 설치하는 지를 살펴본다. 물론 Gitolite에 들어 있는 [Gitolite 문서][gltoc]는 양이 많아서 이 절에서 모두 다룰 수 없다. Gitolite는 계속 진화하고 있기 때문에 이 책의 내용과 다를 수 있다. 최신 내용은 [여기][gldpg]에서 확인해야 한다.

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

Gitolite은 간단히 말해 Git 위에서 운영하는 권한 제어(Authorization) 도구다. 사용자 인증(Authentication)은 `sshd`와 `httpd`를 사용한다. 접속한 접속하는 사용자가 누구인지 가려내는 것이 인증(Authentication)이고 리소스에 대한 접근 권한을 가려내는 일은 권한 제어(Authorization)이다.

Gitolite는 저장소뿐만 아니라 저장소의 브랜치나 태그에도 권한을 명시할 수 있다. 즉, 어떤 사람은 refs(브랜치나 태그)에 Push할 수 있고 어떤 사람은 할 수 없게 하는 것이 가능하다.

## 설치하기

별도 문서를 읽지 않아도 유닉스 계정만 하나 있으면 Gitolite를 쉽게 설치할 수 있다. 이 글은 여러 가지 리눅스들과 솔라리스 10에서 테스트를 마쳤다. Git, Perl, OpenSSH가 호환되는 SSH 서버가 설치돼 있으면 root 권한도 필요 없다. 앞서 사용했던 `gitserver`라는 서버와 그 서버에 `git` 계정을 만들어 사용한다.

Gitolite는 보통의 서버 소프트웨어와는 달리 SSH를 통해서 접근한다. 서버의 모든 계정은 근본적으로 "Gitolite 호스트"가 될 수 있다. 이 책에서는 가장 간단한 설치 방법으로 설명한다. 자세한 설명 문서는 Gitolite의 문서를 참고한다.

먼저 서버에 `git` 계정을 만들고 `git` 계정으로 로그인 한다. 사용자의 SSH 공개키(`ssh-keygen`으로 생성한 SSH 공개키는 기본적으로 `~/.ssh/id_rsa.pub`에 위치함)를 복사하여 `<이름>.pub` 파일로 저장한다(이 책의 예제에서는 `scott.pub`로 저장). 그리고 다음과 같은 명령을 실행한다:

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	    # $HOME/bin가 이미 $PATH에 등록돼있다고 가정
	$ gitolite setup -pk $HOME/scott.pub

마지막 명령은 `gitolite-admin`라는 새 Git 저장소를 서버에 만든다.

다시 작업하던 환경으로 돌아가서 `git clone git@gitserver:gitolite-admin` 명령으로 서버의 저장소를 Clone 했을 떄 문제없이 Clone 되면 Gitolite가 정상적으로 설치된 것이다. 이 `gitolite-admin` 저장소의 내용을 수정하고 Push하여 Gitolite을 설치를 마치도록 한다.

## 자신에게 맞게 설치하기

보통은 기본설정으로 빠르게 설치하는 것으로 충분하지만, 자신에게 맞게 고쳐서 설치할 수 있다. 일부 설정은 주석이 잘 달려있는 rc 파일을 간단히 고쳐서 쓸 수 있지만, 자세한 설정을 위해서는 Gitolite가 제공하는 문서를 살펴보도록 한다.

## 설정 파일과 접근제어 규칙

설치가 완료되면 홈 디렉토리에 Clone한 `gitolite-admin` 디렉토리로 이동해서 어떤 것들이 있는지 한번 살펴보자:

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

`gitolite setup` 명령을 실행했을 때 주었던 공개키 파일의 이름인 `scott`은 `gitolite-admin` 저장소에 대한 읽기와 쓰기 권한을 갖도록 공개키가 등록돼 있다.

사용자를 새로 추가하기도 쉽다. "alice"라는 사용자를 새로 등록하려면 우선 등록할 사람의 공개키 파일을 얻어서 `alice.pub`라는 이름으로 `gitolite-admin` 디렉토리 아래에 `keydir` 디렉토리에 저장한다. 새로 추가한 이 파일을 Add하고 커밋한 후 Push를 하면 `alice`라는 사용자가 등록된 것이다.

Gitolite의 설정 파일인 `conf/example.conf`에 대한 내용은 Gitolite 문서에 설명이 잘 되어 있다. 이 책에서는 주요 일부 설정에 대해서만 간단히 살펴본다.

저장소의 사용자 그룹을 쉽게 만들 수 있다. 이 그룹은 매크로와 비슷하다. 그룹을 만들 때는 그 그룹이 프로젝트의 그룹인지 사용자의 그룹인지 구분하지 않지만 *사용*할 때에는 다르다.

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

그리고 ref 단위로 권한을 제어한다. 다음 예제를 보자. 인턴(interns)은 int 브랜치만 Push할 수 있고 engineers는 eng-로 시작하는 브랜치와 rc 뒤에 숫자가 붙는 태그만 Push할 수 있다. 그리고 관리자는 모든 ref에 무엇이든지(되돌리기도 포함됨) 할 수 있다.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

`RW`나 `RW+` 뒤에 나오는 표현식은 정규표현식(regex)이고 Push하는 ref 이름의 패턴을 의미한다. 그래서 우리는 refex라고 부른다. 물론 refex는 여기에 보여준 것보다 훨씬 더 강력하다. 하지만, 펄의 정규표현식에 익숙하지 않은 독자도 있으니 여기서는 무리하지 않았다.

그리고 이미 예상했겠지만 Gitolite는 `refs/heads/`라고 시작하지 않는 refex에 대해서는 암묵적으로 `refs/heads/`가 생략된 것으로 판단한다.

특정 저장소에 사용하는 규칙을 한 곳에 모아 놓지 않아도 괜찮다. 위에 보여준 `oss_repos` 저장소 설정과 다른 저장소 설정이 마구 섞여 있어도 괜찮다. 아래와 같이 목적이 분명하고 제한적인 규칙을 아무 데나 추가해도 좋다:

	repo gitolite
	    RW+                     = sitaram

이 규칙은 `gitolite` 저장소를 위해 지금 막 추가한 규칙이다.

이제는 접근제어 규칙이 실제로 어떻게 적용되는지 설명한다. 이제부터 그 내용을 살펴보자.

Gitolite는 접근 제어를 두 단계로 한다. 첫 단계가 저장소 단계인데 접근하는 저장소의 ref 중에서 하나라도 읽고 쓸 수 있으면 실제로 그 저장소 전부에 대해 읽기, 쓰기 권한이 있는 것이다.

두 번째 단계는 브랜치나 태그 단위로 제어하는 것으로 오직 "쓰기" 접근만 제어할 수 있다. 어느 사용자가 특정 ref 이름으로 접근을 시도하면(`W`나 `+`같은) 설정 파일에 정의된 순서대로 접근 제어 규칙이 적용된다. 그 순서대로 사용자 이름과 ref 이름을 비교하는데 ref 이름의 경우 단순히 문자열을 비교하는 것이 아니라 정규 표현식으로 비교한다. 해당되는 것을 찾으면 정상적으로 Push되지만 찾지 못하면 거절된다.

## "deny" 규칙을 꼼꼼하게 제어하기

지금까지는 `R`, `RW`, `RW+` 권한에 대해서만 다뤘다. Gitolite는 "deny" 규칙을 위해서 `-` 권한도 지원한다. 이것으로 복잡도를 낮출 수 있다. `-`로 거절도 할 수 있기 때문에 *규칙의 순서가 중요하다*.

다시 말해서 engineers가 master와 integ 브랜치 *이외의* 모든 브랜치를 되돌릴 수 있게 하고 싶으면 아래와 같이 한다:

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

즉, 접근제어 규칙을 순서대로 찾기 때문에 순서대로 정의해야 한다. 첫 번째 규칙은 master나 integ 브랜치에 대해서 읽기, 쓰기만 허용하고 되돌리기는 허용하지 않는다. master나 integ 브랜치를 되돌리는 Push는 첫 번째 규칙에 어긋나기 때문에 바로 두 번째 규칙으로 넘어간다. 그리고 거기서 거절된다. master나 integ 브랜치 이외 다른 ref에 대한 Push는 첫 번째 규칙과 두 번째 규칙에는 만족하지 않고 마지막 규칙으로 허용된다.

## 파일 단위로 Push를 제어하기

브랜치 단위로 Push를 제어할 수 있지만 수정된 파일 단위로도 제어할 수 있다. 예를 들어 Makefile을 보자. Makefile 파일에 의존하는 파일은 매우 많고 보통 *꼼꼼하게* 수정하지 않으면 문제가 생긴다. 그래서 아무나 Makefile을 수정하게 둘 수 없다. 그러면 아래와 같이 설정한다:

	repo foo
	    RW                      =   @junior_devs @senior_devs

	    -   VREF/NAME/Makefile  =   @junior_devs

예전 버전의 Gitolite에서 버전을 올리려는 사용자는 설정이 많이 달라진 것을 알게 될 것이다. Gitolite의 버전업 가이드를 필히 참고하자.

## Personal 브랜치

Gitolite는 또 "Personal 브랜치"라고 부르는 기능을 지원한다. 이 기능은 실제로 "Personal 브랜치 네임스페이스"라고 부르는 것이 더 적절하다. 이 기능은 기업에서 매우 유용하다.

Git을 사용하다 보면 코드를 공유하려고 "Pull 해주세요"라고 말해야 하는 일이 자주 생긴다. 그런데 기업에서는 인증하지 않은 접근을 절대 허용하지도 않는 데다가 아예 다른 사람의 컴퓨터에 접근할 수 없다. 그래서 공유하려면 중앙 서버에 Push하고 나서 Pull해야 한다고 다른 사람에게 말해야만 한다.

중앙집중식 VCS에서 이렇게 마구 사용하면 브랜치 이름이 충돌할 확률이 높다. 그때마다 관리자는 추가로 권한을 관리해줘야 하기 때문에 관리자의 노력이 쓸데없이 낭비된다.

Gitolite는 모든 개발자가 "personal"이나 "scratch" 네임스페이스를 가질 수 있도록 허용한다. 이 네임스페이스는 `refs/personal/<devname>/*` 라고 표현한다. 자세한 내용은 Gitolite 문서를 참고한다.

## "와일드카드" 저장소

Gitolite는 펄 정규표현식으로 저장소 이름을 표현하기 때문에 와일드카드를 사용할 수 있다. 그래서 `assignments/s[0-9][0-9]/a[0-9][0-9]` 같은 정규표현식을 사용할 수 있다. 사용자가 새로운 저장소를 만들 수 있는 새로운 권한 모드인 `C` 모드를 사용할 수도 있다. 저장소를 새로 만든 사람에게는 자동으로 접근 권한이 부여된다. 다른 사용자에게 접근 권한을 주려면 `R` 또는 `RW` 권한을 설정한다. 다시 한번 말하지만 문서에 모든 내용이 다 있으므로 꼭 보기를 바란다.

## 그 밖의 기능들

마지막으로 알고 있으면 유용한 것들이 있다. Gitolite에는 많은 기능이 있고 자세한 내용은 "Faq, Tip, 등등"의 다른 문서에 잘 설명돼 있다.

**로깅**: 누군가 성공적으로 접근하면 Gitolite는 무조건 로그를 남긴다. 관리자가 한눈파는 사이에 되돌리기(`RW+`) 권한을 가진 망나니가 `master` 브랜치를 날려버릴 수 있다. 이 경우 로그 파일이 구원해준다. 이 로그 파일을 참고하여 버려진 SHA를 빠르고 쉽게 찾을 수 있다.

**접근 권한 보여주기**: 만약 어떤 서버에서 작업을 시작하려고 할 때 필요한 것이 무엇일까? Gitolite는 해당 서버에 대해 접근할 수 있는 저장소가 무엇인지, 어떤 권한을 가졌는지 보여준다:

	    hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4

	         R     anu-wsd
	         R     entrans
	         R  W  git-notes
	         R  W  gitolite
	         R  W  gitolite-admin
	         R     indic_web_input
	         R     shreelipi_converter

**권한 위임**: 조직 규모가 크면 저장소에 대한 책임을 여러 사람이 나눠 가지는 게 좋다. 여러 사람이 각자 맡은 바를 관리하도록 한다. 그래서 주요 관리자의 업무가 줄어들기에 병목현상이 적어진다. 이 기능에 대해서는 `doc/` 디렉토리에 포함된 Gitolite 문서를 참고하라.

**미러링**: Gitolite의 미러는 여러 개 만들 수 있어서 주 서버가 다운 돼도 변경하면 된다.
