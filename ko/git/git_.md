# Git 훅

Git도 다른 버전 관리 시스템처럼 어떤 이벤트가 생겼을 때 자동으로 특정 스크립트를 실행하도록 할 수 있다. 이 훅은 클라이언트 훅과 서버 훅으로 나눌 수 있다. 클라이언트 훅은 커밋이나 Merge할 때 실행되고 서버 훅은 Push할 때 서버에서 실행된다. 이 절에서는 어떤 훅이 있고 어떻게 사용하는지 배운다.

## 훅 설치하기

훅은 Git 디렉토리 밑에 `hooks`라는 디렉토리에 저장한다. 기본 훅 디렉토리는 `.git/hooks`이다. 이 디렉토리에 가보면 Git이 자동으로 넣어준 매우 유용한 스크립트 예제가 몇 개 있다. 그리고 스크립트가 입력받는 값이 어떤 값인지 파일 안에 자세히 설명돼 있다. 모든 예제는 쉘과 Perl 스크립트로 작성돼 있지만 실행할 수만 있으면 되고 Ruby나 Python같은 다른 스크립트 언어로 만들어도 된다.예제 스크립트의 파일 이름에는 `.sample`이라는 확장자가 붙어 있다. 그래서 이름만 바꿔주면 그 훅을 사용할 수 있다.

실행할 수 있는 스크립트 파일을 저장소의 `hooks` 디렉토리에 넣으면 훅 스크립트가 켜진다. 이 스크립트는 앞으로 계속 호출된다. 중요한 훅은 여기서 모두 설명한다.

## 클라이언트 훅

클라이언트 훅은 매우 다양하다. 이 절에서는 클라이언트 훅을 커밋 Workflow 훅, E-mail Workflow 훅, 그리고 나머지로 분류해서 설명한다.

### 커밋 Workflow 훅

먼저 커밋과 관련된 훅을 살펴보자. 커밋과 관련된 훅은 모두 네 가지다. `pre-commit` 훅은 커밋할 때 가장 먼저 호출되는 훅으로 커밋 메시지를 작성하기 전에 호출된다. 이 훅에서 커밋하는 Snapshot을 점검한다. 빠트린 것은 없는지, 테스트는 확실히 했는지 등을 검사한다. 커밋할 때 꼭 확인해야 할 게 있으면 이 훅으로 확인한다. 그리고 이 훅의 Exit 코드가 0이 아니면 커밋은 취소된다. 물론 `git commit --no-verify`라고 실행하면 이 훅을 일시적으로 생략할 수 있다. lint 같은 프로그램으로 코드 스타일을 검사하거나, 줄 끝의 공백 문자를 검사하거나(예제로 들어 있는 `pre-commit` 훅이 하는 게 이 일이다), 코드에 주석을 달았는지 검사하는 일은 이 훅으로 하는 것이 좋다.

`prepare-commit-msg` 훅은 Git이 커밋 메시지를 생성하고 나서 편집기를 실행하기 전에 실행된다. 이 훅은 사람이 커밋 메시지를 수정하기 전에 먼저 프로그램으로 손보고 싶을 때 사용한다. 이 훅은 커밋 메시지가 들어 있는 파일의 경로, 커밋의 종류를 아규먼트로 받는다. 그리고 최근 커밋을 수정할 때에는(Amending 커밋) SHA-1 값을 추가 아규먼트로 더 받는다. 사실 이 훅은 일반 커밋에는 별로 필요 없고 커밋 메시지를 자동으로 생성하는 커밋에 좋다. 커밋 메시지에 템플릿을 적용하거나, Merge 커밋, Squash 커밋, Amend 커밋일 때 유용하다. 이 스크립트로 커밋 메시지 템플릿에 정보를 삽입할 수 있다.

`commit-msg` 훅은 커밋 메시지가 들어 있는 임시 파일의 경로를 아규먼트로 받는다. 그리고 이 스크립트가 0이 아닌 값을 반환하면 커밋되지 않는다. 이 훅에서 최종적으로 커밋이 완료되기 전에 프로젝트 상태나 커밋 메시지를 검증한다. 이 장의 마지막 절에서 이 훅을 사용하는 예제를 보여준다. 커밋 메시지가 정책에 맞는지 검사하는 스크립트를 만들어 보자.

커밋이 완료되면 `post-commit` 훅이 실행된다. 이 훅은 넘겨받는 아규먼트가 하나도 없지만 `git log -1 HEAD` 명령으로 정보를 쉽게 가져올 수 있다. 일반적으로 이 스크립트는 커밋된 것을 누군가에게 알릴 때 사용한다.

이 커밋 Workflow 스크립트는 어떤 Workflow에나 사용할 수 있다. 특히 정책을 강제할 때 유용하다. 클라이언트 훅은 개발자가 클라이언트에서 사용하는 훅이다. 모든 개발자에게 유용한 훅이지만 Clone할 때 복사되지 않는다. 그래서 직접 설치하고 관리해야 한다. 물론 정책을 서버 훅으로 만들고 정책을 잘 지키는지 Push할 때 검사해도 된다.

### E-mail Workflow 훅

E-mail Workflow에 해당하는 클라이언트 훅은 세 가지이다. 이 훅은 모두 `git am` 명령으로 실행된다. 이 명령어를 사용할 일이 없으면 이 절은 읽지 않아도 된다. 하지만, 언젠가는 `git format-patch` 명령으로 만든 Patch를 E-mail로 받는 날이 올지도 모른다.

제일 먼저 실행하는 훅은 `applypatch-msg`이다. 이 훅의 아규먼트는 Author가 보내온 커밋 메시지 파일의 이름이다. 이 스크립트가 종료할 때 0이 아닌 값을 반환하면 Git은 Patch하지 않는다. 커밋 메시지가 규칙에 맞는지 확인하거나 자동으로 메시지를 수정할 때 이 훅을 사용한다.

`git am`으로 Patch할 때 두 번째로 실행되는 훅이 `pre-applypatch`이다. 이 훅은 아규먼트가 없고 단순히 Patch를 적용하고 나서 실행된다. 그래서 커밋할 스냅샷을 검사하는 데 사용한다. 이 스크립트로 테스트를 수행하고 파일을 검사할 수 있다. 테스트에 실패하거나 뭔가 부족하면 0이 아닌 값을 반환시켜서 `git am` 명령을 취소시킬 수 있다.

`git am` 명령에서 마지막으로 실행되는 훅은 `post-applypatch`다. 이 스크립트를 이용하면 자동으로 Patch를 보낸 사람이나 그룹에게 알림 메시지를 보낼 수 있다. 이 스크립트로는 Patch를 중단시킬 수 없다.

### 기타 훅

`pre-rebase` 훅은 Rebase하기 전에 실행된다. 이 훅이 0이 아닌 값을 반환하면 Rebase가 취소된다. 이 훅으로 이미 Push한 커밋을 Rebase하지 못하게 할 수 있다. Git이 자동으로 넣어주는 `pre-rebase` 예제가 바로 그 예제다. 이 예제에는 기준 브랜치가 `next`라고 돼 있다. 실제로 적용할 브랜치 이름으로 사용하면 된다.

그리고 `git checkout` 명령이 끝나면 `post-checkout` 훅이 실행된다. 이 훅은 Checkout할 때마다 작업하는 디렉토리에서 뭔가 할 일이 있을 때 사용한다. 그러니까 용량이 크거나 Git이 관리하지 않는 파일을 옮기거나, 문서를 자동으로 생성하는 데 쓴다.

마지막으로, `post-merge` 훅은 Merge가 끝나고 나서 실행된다. 이 훅은 파일 권한 같이 Git이 추적하지 않는 정보를 관리하는 데 사용한다. Merge로 Working Tree가 변경될 때 Git이 관리하지 않는 파일이 원하는 대로 잘 배치됐는지 검사할 때도 좋다.

## 서버 훅

클라이언트 훅으로도 어떤 정책을 강제할 수 있지만, 시스템 관리자에게는 서버 훅이 더 중요하다. 서버 훅은 모두 Push 전후에 실행된다. Push 전에 실행되는 훅이 0이 아닌 값을 반환하면 해당 Push는 거절되고 클라이언트는 에러 메시지를 출력한다. 이 훅으로 아주 복잡한 Push 정책도 가능하다.

### pre-receive와 post-receive

Push하면 가장 처음 실행되는 훅은 `pre-receive` 훅이다. 이 스크립트는 표준 입력(STDIN)으로 Push하는 레퍼런스의 목록을 입력받는다. 0이 아닌 값을 반환하면 해당 레퍼런스가 전부 거절된다. Fast-forward Push가 아니면 거절하거나, 브랜치 Push 권한을 제어하려면 이 훅에서 하는 것이 좋다. 관리자만 브랜치를 새로 Push하고 삭제할 수 있고 일반 개발자는 수정사항만 Push할 수 있게 할 수 있다.

`post-receive` 훅은 Push한 후에 실행된다. 이 훅으로 사용자나 서비스에 알림 메시지를 보낼 수 있다. 그리고 `pre-receive` 훅처럼 표준 입력(STDIN)으로 레퍼런스 목록이 넘어간다. 이 훅으로 메일링리스트에 메일을 보내거나, CI(Continuous Integration) 서버나 Ticket-tracking 시스템의 정보를 수정할 수 있다. 심지어 커밋 메시지도 파싱할 수 있기 때문에 이 훅으로 Ticket을 만들고, 수정하고, 닫을 수 있다. 이 스크립트가 완전히 종료할 때까지 클라이언트와의 연결은 유지되고 Push를 중단시킬 수 없다. 그래서 이 스크립트로 시간이 오래 걸릴만한 일을 할 때는 조심해야 한다.

### update

update 스크립트는 각 브랜치마다 한 번씩 실행된다는 것을 제외하면 `pre-receive` 스크립트와 거의 같다. 한 번에 브랜치를 여러 개 Push하면 `pre-receive`는 딱 한 번만 실행되지만, update는 브랜치마다 실행된다. 이 스크립트는 표준 입력으로 데이터를 입력받는 것이 아니라 아규먼트로 브랜치 이름, 원래 가리키던 SHA-1 값, 사용자가 Push하는 SHA-1 값을 입력받는다. update 스크립트가 0이 아닌 값을 반환하면 해당 레퍼런스만 거절되고 나머지 다른 레퍼런스는 상관없다.
�를 모두 추가한다. 설정해야 하는 옵션이 좀 많다. `merge.tool`로 무슨 Merge 도구를 사용할지, `mergetool.*.cmd`로 실제로 어떻게 명령어를 실행할지, `mergetool.trustExitCode`로 Merge 도구가 반환하는 exit 코드가 merge의 성공여부를 나타내는지, `diff.external`은 diff할 때 실행할 명령어가 무엇인지를 설정할 때 사용한다. 모두 `git config` 명령으로 설정한다:

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
