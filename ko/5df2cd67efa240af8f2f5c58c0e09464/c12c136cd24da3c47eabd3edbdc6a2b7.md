# Git 설정하기

1장에서 설명했지만, 제일 먼저 해야 하는 것은 `git config` 명령으로 이름과 e-mail 주소를 설정하는 것이다:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

이렇게 설정하는 것들 중에서 중요한 것을 몇 가지 설명한다.

아주 기초적인 설정은 1장에서도 설명했지만, 이번 장에서 다시 한 번 복습한다. Git은 내장된 기본 규칙 따르지만, 설정된 것이 있으면 그에 따른다. Git은 먼저 `/etc/gitconfig` 파일을 찾는다. 이 파일은 해당 시스템에 있는 모든 사용자와 모든 저장소에 적용되는 설정 파일이다. `git config` 명령에 `--system` 옵션을 주면 이 파일을 사용한다.

다음으로 `~/.gitconfig` 파일을 찾는다. 이 파일은 해당 사용자에게만 적용되는 설정 파일이다. `--global` 옵션을 주면 Git은 이 파일을 사용한다.

마지막으로 현재 작업 중인 저장소의 Git 디렉토리에 있는 `.git/config` 파일을 찾는다. 이 파일은 해당 저장소에만 적용된다. 각 설정 파일에 중복된 설정이 있으면 설명한 순서대로 덮어쓴다. 예를 들어 `.git/config`와 `/etc/gitconfig`에 같은 설정이 들어 있다면 `.git/config`에 있는 설정을 사용한다. 설정 파일은 손으로 직접 편집해도 되지만 보통 `git config` 명령을 사용하는 것이 더 편하다.

## 클라이언트 설정

설정은 클라이언트와 서버로 나뉜다. 대부분은 개인작업 환경과 관련된 클라이언트 설정이다. Git에는 설정거리가 매우 많은데, 여기서는 Workflow를 관리하는 데 필요한 것과 잘 사용하는 것만 설명한다. 한 번도 겪지 못할 상황에서나 유용한 옵션까지 다 포함하면 설정할 게 너무 많다. Git 버전마다 옵션이 조금씩 다른데, 아래와 같이 실행하면 설치한 버전에서 사용할 수 있는 옵션을 모두 보여준다:

	$ git config --help

어떤 옵션을 사용할 수 있는지 `git config`의 에 자세히 설명돼 있다.

### core.editor

Git은 편집기를 설정하지 않았거나 설정한 편집기를 찾을 수 없으면 Vi를 실행한다. 커밋할 때나 tag 메시지를 편집할 때 설정한 편집기를 실행한다. `code.editor` 설정으로 편집기를 설정한다:

	$ git config --global core.editor emacs

이렇게 설정하면 메시지를 편집할 때 환경변수에 설정한 편집기가 아니라 Emacs를 실행한다.

### commit.template

커밋할 때 Git이 보여주는 커밋 메시지는 이 옵션에 설정한 템플릿 파일이다. 예를 들어 `$HOME/.gitmessage.txt` 파일을 아래와 같이 만든다:

	subject line

	what happened

	[ticket: X]

이 파일을 `commit.template`에 설정하면 Git은 `git commit` 명령이 실행하는 편집기에 이 메시지를 기본으로 넣어준다:

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

그러면 commit할 때 아래와 같은 메시지를 편집기에 자동으로 채워준다:

	subject line

	what happened

	[ticket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

소속 팀에 커밋 메시지 규칙이 있으면 그 규칙에 맞는 템플릿 파일을 만든다. Git이 그 파일을 사용하도록 설정하면 규칙을 따르기가 쉬워진다.

### core.pager

Git은 `log`나 `diff`같은 명령의 메시지를 출력할 때 페이지로 나누어 보여준다. 기본으로 사용하는 명령은 `less`다. `more`를 더 좋아하면 `more`라고 설정한다. 페이지를 나누고 싶지 않으면 빈 문자열로 설정한다:

	$ git config --global core.pager ''

이 명령을 실행하면 Git은 길든지 짧든지 결과를 한 번에 다 보여 준다.

### user.signingkey

*2장*에서 설명했던 Annotated Tag를 만들 때 유용하다. 사용할 GPG 키를 설정해 둘 수 있다. 아래 처럼 GPG 키를 설정하면 서명할 때 편리하다:

	$ git config --global user.signingkey <gpg-key-id>

`git tag` 명령을 실행할 때 키를 생략하고 서명할 수 있다:

	$ git tag -s <tag-name>

### core.excludesfile

Git이 무시하는 untracked 파일은 `.gitignore`에 해당 패턴을 적으면 된다고 *2장*에서 설명했다. 해당 패턴의 파일은 `git add` 명령으로 추가해도 Stage되지 않는다. `.gitignore` 파일을 저장소 밖에 두고 관리하고 싶으면 `core.excludesfile`에 해당 파일의 경로를 설정한다. 이 파일을 작성하는 방법은 `.gitignore` 파일을 작성하는 방법과 같다. 그리고 `core.excludesfile`에 설정한 파일과 저장소 안에 있는 `.gitignore` 파일은 둘 다 사용된다.

### help.autocorrect

이 옵션은 Git 1.6.1 버전부터 사용할 수 있다. 명령어를 잘못 입력하면 Git은 메시지를 아래와 같이 보여 준다:

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

그러나 `help.autocorrect`를 1로 설정하면 명령어를 잘못 입력해도 Git이 자동으로 해당 명령어를 찾아서 실행해준다. 단, 해당 명령어가 딱 하나 찾았을 때에만 실행한다.

## 컬러 터미널

사람이 쉽게 인식할 수 있도록 터미널에 결과를 컬러로 출력할 수 있다. 터미널 컬러와 관련된 옵션은 매우 다양하기 때문에 꼼꼼하게 설정할 수 있다.

### color.ui

`color.ui`를 true로 설정하면 Git이 알아서 결과에 색칠한다. 물론 무엇을 어떤 색으로 칠할지 꼼꼼하게 설정할 수 있지만, 이 옵션을 켜면 터미널을 그냥 기본 컬러로 칠한다.

	$ git config --global color.ui true

이 옵션을 켜면 Git은 터미널에 컬러로 결과를 출력한다. 이 값을 false로 설정하면 절대 컬러로 출력하지 않는다. 결과를 파일로 리다이렉트하거나 다른 프로그램으로 보낼(Piping. 파이프라인)때도 그렇다.

`color.ui = always`라고 설정하면 결과를 리다이렉트할 때에도 컬러 코드가 출력된다. 이렇게까지 설정해야 하는 경우는 매우 드물다. 대신 Git 명령에는 `--color` 옵션이 있어서 어떻게 출력할지 그때그때 정해줄 수 있다. 보통은 `color.ui = true` 만으로도 충분하다.

### `color.*`

Git은 좀 더 꼼꼼하게 컬러를 설정하는 방법을 제공한다. 아래와 같은 설정들이 있다. 모두 `true`, `false`, `always` 중 하나를 고를 수 있다:

	color.branch
	color.diff
	color.interactive
	color.status

또한, 각 옵션의 컬러를 직접 지정할 수도 있다. 아래처럼 설정하면 diff 명령에서 meta 정보의 포그라운드는 blue, 백그라운드는 black, 테스트는 bold로 바뀐다:

	$ git config --global color.diff.meta "blue black bold"

컬러는 normal, black, red, green, yellow, blue, magenta, cyan, white 중에서 고를 수 있고 텍스트 속성은 bold, dim, ul, blink, reverse 중에서 고를 수 있다.

`git config` 맨페이지를 보면 어떤 설정거리가 있는지 자세히 나온다.

## 다른 Merge, Diff 도구 사용하기

Git에 들어 있는 diff 말고 다른 도구로 바꿀 수 있다. 화려한 GUI 도구로 바꿔서 좀 더 편리하게 충돌을 해결할 수 있다. 여기서는 Perforce의 Merge 도구인 P4Merge로 설정하는 것을 보여준다. P4Merge는 무료인데다 꽤 괜찮다.

P4Merge는 중요 플랫폼을 모두 지원하기 때문에 웬만한 환경이면 사용할 수 있다. 여기서는 Mac과 Linux 시스템에 설치하는 것을 보여준다. 윈도에서 사용하려면 `/usr/local/bin` 경로만 윈도 경로로 바꿔준다.

다음 페이지에서 P4Merge를 내려받는다:

	http://www.perforce.com/perforce/downloads/component.html

먼저 P4Merge에 쓸 Wrapper 스크립트를 만든다. 필자는 Mac 사용자라서 Mac 경로를 사용한다. 어떤 시스템이든 `p4merge`가 설치된 경로를 사용하면 된다. extMerge라는 Merge용 Wrapper 스크립트를 만들고 이 스크립트로 넘어오는 모든 아규먼트를 p4merge 프로그램으로 넘긴다:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*

그리고 diff용 Wrapper도 만든다. 이 스크립트로 넘어오는 아규먼트는 총 7개지만 그 중 2개만 Merge Wrapper로 넘긴다. Git이 diff 프로그램에 넘겨주는 아규먼트는 아래와 같다:

	path old-file old-hex old-mode new-file new-hex new-mode

이 중에서 `old-file`과 `new-file` 만 사용하는 wrapper script를 만든다:

	$ cat /usr/local/bin/extDiff
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

이 두 스크립트에 실행 권한을 부여한다:

	$ sudo chmod +x /usr/local/bin/extMerge
	$ sudo chmod +x /usr/local/bin/extDiff

Git config 파일에 이 스크립트를 모두 추가한다. 설정해야 하는 옵션이 좀 많다. `merge.tool`로 무슨 Merge 도구를 사용할지, `mergetool.*.cmd`로 실제로 어떻게 명령어를 실행할지, `mergetool.trustExitCode`로 Merge 도구가 반환하는 exit 코드가 merge의 성공여부를 나타내는지, `diff.external`은 diff할 때 실행할 명령어가 무엇인지를 설정할 때 사용한다. 모두 `git config` 명령으로 설정한다:

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

`~/.gitconfig/` 파일을 직접 편집해도 된다:

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

설정을 완료하고 나서 아래와 같이 diff 명령어를 실행한다: 

	$ git diff 32d1776b1^ 32d1776b1

diff 결과가 터미널에 출력되는 대신 P4Merge가 실행된다. 그리고 그림 7-1처럼 그 프로그램 안에서 보여준다:


![](http://git-scm.com/figures/18333fig0701-tn.png)

그림 7-1. P4Merge

브랜치를 Merge할 때 충돌이 나면 `git mergetool` 명령을 실행한다. 이 명령을 실행하면 GUI 도구로 충돌을 해결할 수 있도록 P4Merge를 실행해준다.

Wrapper를 만들어 설정해두면 다른 diff, Merge 도구로 바꾸기도 쉽다. 예를 들어, KDiff3를 사용하도록 extDiff와 extMerge 스크립트를 수정한다:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

이제부터 Git은 diff 결과를 보여주거나 충돌을 해결할 때 KDiff3 도구를 사용한다.

어떤 Merge 도구는 Git에 미리 cmd 설정이 들어 있다. 그래서 cmd 설정 없이 사용할 수 있는 것도 있다. kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff는 cmd 설정 없이 Merge 도구로 사용할 수 있다. diff 도구로는 다른 것을 사용하지만, Merge 도구로는 KDiff3를 사용하고 싶은 경우에는 kdiff3 명령을 실행경로로 넣고 아래와 같이 설정하기만 하면 된다:

	$ git config --global merge.tool kdiff3

extMerge와 extDiff 파일을 사용하지 않고 이렇게 Merge 도구만 kdiff3로 설정하고 diff 도구는 Git에 원래 들어 있는 것을 사용할 수 있다.

## 소스 포맷과 공백

협업할 때 겪는 소스 포맷(Formatting)과 공백 문제는 미묘하고 난해하다. 동료 사이에 사용하는 플랫폼이 다를 때는 특히 더 심하다. 다른 사람이 보내온 Patch는 공백 문자 패턴이 미묘하게 다를 확률이 높다. 편집기가 몰래 공백문자를 추가해 버릴 수도 있고 크로스-플랫폼 프로젝트에서 윈도 개발자가 줄 끝에 CR(Carriage-Return) 문자를 추가해 버렸을 수도 있다. Git에는 이 이슈를 돕는 몇 가지 설정이 있다.

### core.autocrlf

윈도에서 개발하는 동료와 함께 일하면 줄 바꿈(New Line) 문자에 문제가 생긴다. 윈도는 줄 바꿈 문자로 CR(Carriage-Return)과 LF(Line Feed) 문자를 둘 다 사용하지만, Mac과 Linux는 LF 문자만 사용한다. 아무것도 아닌 것 같지만, 크로스 플랫폼 프로젝트에서는 꽤 성가신 문제다.

Git은 커밋할 때 자동으로 CRLF를 LF로 변환해주고 반대로 Checkout할 때 LF를 CRLF로 변환해 주는 기능이 있다. `core.autocrlf` 설정으로 이 기능을 켤 수 있다. 윈도에서 이 값을 true로 설정하면 Checkout할 때 LF 문자가 CRLR 문자로 변환된다:

	$ git config --global core.autocrlf true

줄 바꿈 문자로 LF를 사용하는 Linux와 Mac에서는 Checkout할 때 Git이 LF를 CRLF로 변환할 필요가 없다. 게다가 우연히 CRLF가 들어간 파일이 저장소에 들어 있어도 Git이 알아서 고쳐주면 좋을 것이다. `core.autocrlf` 값을 input으로 설정하면 커밋할 때만 CRLF를 LF로 변환한다:

	$ git config --global core.autocrlf input

이 설정을 이용하면 윈도에서는 CRLF를 사용하고 Mac, Linux, 저장소에서는 LF를 사용할 수 있다.

윈도 플랫폼에서만 개발하면 이 기능이 필요 없다. 이 옵션을 `false`라고 설정하면 이 기능이 꺼지고 CR 문자도 저장소에도 저장된다:

	$ git config --global core.autocrlf false

### core.whitespace

Git에는 공백 문자를 다루는 방법으로 네 가지가 미리 정의돼 있다. 두 가지는 기본적으로 켜져 있지만 끌 수 있고 나머지 두 가지는 꺼져 있지만 켤 수 있다.

먼저 기본적으로 켜져 있는 것을 살펴보자. `trailing-space`는 각 줄 끝에 공백이 있는지 찾고 `space-before-tab`은 모든 줄 처음에 tab보다 공백이 먼저 나오는지 찾는다.

기본적으로 꺼져 있는 나머지 두 개는 `indent-with-non-tab`과 `cr-at-eol`이다. `intent-with-non-tab`은 tab이 아니라 공백 8자 이상으로 시작하는 줄이 있는지 찾고 `cr-at-eol`은 줄 끝에 CR 문자가 있어도 괜찮다고 Git에 알리는 것이다.

`core.whitespace` 옵션으로 이 네 가지 방법을 켜고 끌 수 있다. 설정에서 해당 옵션을 빼버리거나 이름이 `-`로 시작하면 기능이 꺼진다. 예를 들어, 다른 건 다 켜고 `cr-at-eol` 옵션만 끄려면 아래와 같이 설정한다:

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

`git diff` 명령을 실행하면 Git은 이 설정에 따라 검사해서 컬러로 표시해준다. 그래서 좀 더 쉽게 검토해서 커밋할 수 있다. `git apply` 명령으로 Patch를 적용할 때도 이 설정을 이용할 수 있다. 아래처럼 명령어를 실행하면 해당 Patch가 공백문자 정책에 들어맞는지 확인할 수 있다:

	$ git apply --whitespace=warn <patch>

아니면 Git이 자동으로 고치도록 할 수 있다:

	$ git apply --whitespace=fix <patch>

이 옵션은 `git rebase` 명령에서도 사용할 수 있다. 공백 문제가 있는 커밋을 서버로 Push하기 전에  `--whitespace=fix` 옵션을 주고 Rebase하면 Git은 다시 Patch를 적용하면서 공백을 설정한 대로 고친다.

## 서버 설정

서버 설정은 많지 않지만, 꼭 짚고 넘어가야 하는 것이 몇 개 있다.

### receive.fsckObjects

Git은 Push할 때 기본적으로 개체를 검증하지(check for consistency) 않는다. 하지만, Push할 때마다 각 개체가 SHA-1 체크섬에 맞는지, 잘못된 개체가 가리키고 있는지 검사하게 할 수 있다. 개체를 점검하는 것은 상대적으로 느려서 Push하는 시간이 늘어난다. 얼마나 늘어나는지는 저장소 크기와 Push하는 양에 달렸다. `receive.fsckOBjects` 값을 true로 설정하면 Git이 Push할 때마다 검증한다.

	$ git config --system receive.fsckObjects true

이렇게 설정하면 Push할 때마다 검증하기 때문에 클라이언트는 잘못된 데이터를 Push하지 못한다.

### receive.denyNonFastForwards

이미 Push한 커밋을 Rebase해서 다시 Push하지 못하게 할 수 있다. 브랜치를 Push할 때 해당 리모트 브랜치가 가리키는 커밋이 Push하려는 브랜치에 없을 때 Push하지 못하게 할 수 있다. 보통은 이런 정책이 좋고 `git push` 명령에 `-f` 옵션을 주면 강제로 Push할 수 있다.

하지만, 강제로 Push하지 못하게 할 수도 있다. `receive.denyNonFastForwards` 옵션을 켜면 Fast-forward로 Push할 수 없는 브랜치는 아예 Push하지 못한다:

	$ git config --system receive.denyNonFastForwards true

사용자마다 다른 정책을 적용하고 싶으면 서버 훅을 사용해야 한다. 서버의 receive 훅으로 할 수 있고 이 훅도 이 장에서 설명한다.

### receive.denyDeletes

`receive.denyNonFastForwards`와 비슷한 정책으로 `receive.denyDeletes`라는 것이 있다. 이 설정을 켜면 브랜치를 삭제하는 Push가 거절된다. Git 1.6.1부터 receive.denyDeletes를 사용할 수 있다:

	$ git config --system receive.denyDeletes true

이제 브랜치나 Tag를 삭제하는 Push는 거절된다. 아무도 삭제할 수 없다. 리모트 브랜치를 삭제하려면 직접 손으로 server의 ref 파일을 삭제해야 한다. 그리고 사용자마다 다른 정책을 적용시키는 ACL을 만드는 방법도 있다. 이 방법은 이 장 끝 부분에서 다룬다.
