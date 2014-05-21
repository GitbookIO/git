# Git과 Subversion

현재도 많은 오픈소스 프로젝트와 수 많은 기업 프로젝트는 Subversion으로 소스코드를 관리한다. 10여년간 Subversion이 가장 인기있는 오픈소스 VCS 도구였다. Subversion은 그 이전 시대에서 가장 많이 사용하던 CVS와 많이 닮았다.

Git이 자랑하는 또 하나의 기능은 `git svn`이라는 양방향 Subversion 지원 도구이다. Git을 Subversion 클라이언트로 사용할 수 있기 때문에 로컬에서는 Git의 기능을 활용하고 Push 할 때는 Subversion 서버에 Push한다. 로컬 브랜치와 Merge, Staging Area, Rebase, Cherry-pick 등의 Git 기능을 충분히 사용할 수 있다. 같이 일하는 동료는 빛 한줄기 없는 선사시대 동굴에서 일하겠지만 말이다. `git svn`은 기업에서 git을 사용할 수 있도록 돕는 출발점이다. 우리가 Git을 도입하기 위해 기업내에서 노력하는 동안 동료가 효율적으로 환경을 바꿀 수 있도록 도움을 줄 수 잇다. Subversion 지원 도구는 우리를 DVCS 세상으로 인도하는 붉은 알약과 같은 것이다.

## git svn

Git과 Subversion을 이어주는 명령은 `git svn` 으로 시작한다. 이 명령 뒤에 추가하는 명령이 몇 가지 더 있으며 간단한 예제를 보여주고 설명한다.

`git svn` 명령을 사용할 때는 절름발이인 Subversion을 사용하고 있다는 점을 염두하자. 우리가 로컬 브랜치와 Merge를 맘대로 쓸 수 있다고 하더라도 최대한 일직선으로 히스토리를 유지하는것이 좋다. Git 저장소처럼 사용하지 않는다.

히스토리를 재작성해서 Push하지 말아야 한다. Git을 사용하는 동료들끼기 따로 Git 저장소에 Push하지도 말아야 한다. Subversion은 단순하게 일직선 히스토리만 가능하다. 팀원중 일부는 SVN을 사용하고 일부는 Git을 사용하는 팀이라면 SVN Server를 사용해서 협업하는 것이 좋다. 그래야 삶이 편해진다.

## 설정하기

`git svn`을 사용하려면 SVN 저장소가 하나 필요하다. 저장소에 쓰기 권한이 있어야 한다. 필자의 test 저장소를 복사한다. Subversion(1.4 이상)에 포함된 `svnsync`라는 도구를 사용하여 SVN 저장소를 복사한다. 테스트용 저장소가 필요해서 Google Code에 새로 Subversion 저장소를 하나 만들었다. `protobuf` 라는 프로젝트의 일부 코드를 복사했다. `protobuf`는 네트워크 전송에 필요한 구조화된 데이터(프로토콜 같은 것들)의 인코딩을 도와주는 도구이다.

로컬 Subversion 저장소를 하나 만든다:

	$ mkdir /tmp/test-svn
	$ svnadmin create /tmp/test-svn

그리고 모든 사용자가 revprops 속성을 변경할 수 있도록 항상 0을 반환하는 pre-revprop-change 스크립트를 준비한다(역주: 파일이 없거나, 다른 이름으로 되어있을 수 있다. 이 경우 아래 내용으로 새로 파일을 만들고 실행 권한을 준다):

	$ cat /tmp/test-svn/hooks/pre-revprop-change
	#!/bin/sh
	exit 0;
	$ chmod +x /tmp/test-svn/hooks/pre-revprop-change

이제 `svnsync init` 명령으로 다른 Subversion 저장소를 로컬로 복사할 수 있도록 지정한다:

	$ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

이렇게 다른 저장소의 주소를 설정하면 복사할 준비가 된다. 아래 명령으로 저장소를 실제로 복사한다:

	$ svnsync sync file:///tmp/test-svn
	Committed revision 1.
	Copied properties for revision 1.
	Committed revision 2.
	Copied properties for revision 2.
	Committed revision 3.
	...

이 명령은 몇 분 걸리지 않는다. 저장하는 위치가 로컬이 아니라 리모트 서버라면 오래 걸린다. 커밋이 100개 이하라고 해도 오래 걸린다. Subversion은 한번에 커밋을 하나씩 받아서 Push하기 때문에 엄청나게 비효율적이다. 하지만, 저장소를 복사하는 다른 방법은 없다.

## 시작하기

이제 갖고 놀 Subversion 저장소를 하나 준비했다. `git svn clone` 명령으로 Subversion 저장소 전체를 Git 저장소로 가져온다. 만약  Subversion 저장소가 로컬에 있는 것이 아니라 리모트 서버에 있으면 `file:///tmp/test-svn` 부분에 서버 저장소의 URL을 적어 준다.

	$ git svn clone file:///tmp/test-svn -T trunk -b branches -t tags
	Initialized empty Git repository in /Users/schacon/projects/testsvnsync/svn/.git/
	r1 = b4e387bc68740b5af56c2a5faf4003ae42bd135c (trunk)
	      A    m4/acx_pthread.m4
	      A    m4/stl_hash.m4
	...
	r75 = d1957f3b307922124eec6314e15bcda59e3d9610 (trunk)
	Found possible branch point: file:///tmp/test-svn/trunk => \
	    file:///tmp/test-svn /branches/my-calc-branch, 75
	Found branch parent: (my-calc-branch) d1957f3b307922124eec6314e15bcda59e3d9610
	Following parent with do_switch
	Successfully followed parent
	r76 = 8624824ecc0badd73f40ea2f01fce51894189b01 (my-calc-branch)
	Checked out HEAD:
	 file:///tmp/test-svn/branches/my-calc-branch r76

이 명령은 사실 SVN 저장소 주소를 주고 `git svn init`과 `git svn fetch` 명령을 순서대로 실행한 것과 같다. 이 명령은 시간이 좀 걸린다. 테스트용 프로젝트는 커밋이 75개 정도 밖에 안되서 시간이 많이 걸리지 않는다. Git은 커밋을 한번에 하나씩 일일이 기록해야 한다. 커밋이 수천개인 프로젝트라면 몇 시간 혹은 몇 일이 걸릴 수도 있다.

`-T trunk -b branches -t tags` 부분은 Subversion이 어떤 브랜치 구조를 가지고 있는지 Git에게 알려주는 부분이다. Subversion 표준 형식과 다르면 이 옵션 부분에서 알맞은 이름을 지정해준다. 표준 형식을 사용한다면 간단하게 `-s` 옵션을 사용한다. 즉 아래의 명령도 같은 의미이다.

	$ git svn clone file:///tmp/test-svn -s

Git에서 브랜치와 태그 정보가 제대로 보이는 것을 확인한다:

	$ git branch -a
	* master
	  my-calc-branch
	  tags/2.0.2
	  tags/release-2.0.1
	  tags/release-2.0.2
	  tags/release-2.0.2rc1
	  trunk

`git svn` 도구가 리모트 브랜치의 이름을 어떻게 짓는지 알아야 한다. Git 저장소를 Clone할 때는 보통 `origin/[branch]`처럼 리모트 저장소 이름이 들어간 브랜치 이름으로 만들어진다. `git svn`은 우리가 리모트 저장소를 딱 하나만 사용한다고 가정한다. 그래서 리모트 저장소의 이름을 붙여서 브랜치를 관리하지 않는다. Plumbing 명령어인 `show-ref` 명령으로 리모트 브랜치의 정확한 이름을 확인할 수 있다.

	$ git show-ref
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
	aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
	03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
	50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
	4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
	1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

일반적인 Git 저장소라면 아래와 비슷하다:

	$ git show-ref
	83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
	3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
	0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
	25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

이 결과를 보면 리모트 저장소가  두 개 있다. `gitserver`라는 리모트 저장소에 `master` 브랜치가 있고 `origin`이라는 리모트 저장소에 `master`, `testing` 브랜치가 있다.

`git svn`으로 저장소를 가져오면 Subversion 태그는 Git 태그가 아니라 리모트 브랜치로 등록되는 점을 잘 기억하자. `git svn`은 Subversion 태그를 tags라는 리모트 서버에 있는 브랜치처럼 만든다.

## Subversion 서버에 커밋하기

자 작업할 Git 저장소는 준비했다. 무엇인가 수정하고 서버로 고친 내용을 Push해야 할 때가 왔다. Git을 Subversion의 클라이언트로 사용해서 수정한 내용을 전송한다. 어떤 파일을 수정하고 커밋을 하면 그 수정한 내용은 Git의 로컬 저장소에 저장된다. Subversion 서버에는 아직 반영되지 않는다.

	$ git commit -am 'Adding git-svn instructions to the README'
	[master 97031e5] Adding git-svn instructions to the README
	 1 files changed, 1 insertions(+), 1 deletions(-)

이제 수정한 내용을 서버로 전송한다. Git 저장소에 여러개의 커밋을 쌓아놓고 한번에 Subversion 서버로 보낸다는 점을 잘 살펴보자. `git svn dcommit` 명령으로 서버에 Push한다.

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r79
	       M      README.txt
	r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

이 명령은 새로 추가한 커밋을 모두 Subversion에 커밋하고 로컬 Git 커밋을 다시 만든다. 커밋을 다시 만들기 때문에 이미 저장된 커밋의 SHA-1 체크섬이 바뀐다. 그래서 리모트 Git 저장소와 Subversion 저장소를 함께 사용하면 안된다. 새로 만들어진 커밋을 살펴보면 아래와 같이 `git-svn-id`가 추가된다:

	$ git log -1
	commit 938b1a547c2cc92033b74d32030e86468294a5c8
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sat May 2 22:06:44 2009 +0000

	    Adding git-svn instructions to the README

	    git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

원래 `97031e5`로 시작하는 SHA 체크섬이 지금은 `938b1a5`로 시작한다. 만약 Git 서버와 Subversion 서버에 함께 Push하고 싶으면 우선 Subversion 서버에 `dcommit`으로 Push를 하고 그 다음에 Git 서버에 Push해야 한다.

## 새로운 변경사항 받아오기

다른 개발자와 함께 일하는 과정에서 다른 개발자가 Push한 상태에서 Push를 하면 충돌이 날 수 있다. 충돌을 해결하지 않으면 서버로 Push할 수 없다. 충돌이 나면 `git svn` 명령은 아래와 같이 보여준다:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	Merge conflict during commit: Your file or directory 'README.txt' is probably \
	out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
	core/git-svn line 482

이런 상황에서는 `git svn rebase` 명령으로 이 문제를 해결한다. 이 명령은 변경사항을 서버에서 내려받고 그 다음에 로컬의 변경사항을 그 위에 적용한다:

	$ git svn rebase
	       M      README.txt
	r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
	First, rewinding head to replay your work on top of it...
	Applying: first user change

그러면 서버 코드 위에 변경사항을 적용하기 때문에 성공적으로 `dcommit` 명령을 마칠 수 있다:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r81
	       M      README.txt
	r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Push하기 전에 서버의 내용을 Merge하는 Git과 달리 `git svn`은 충돌이 날때에만 서버에 업데이트할 것이 있다고 알려 준다. 이 점을 꼭 기억해야 한다. 만약 다른 사람이 한 파일을 수정하고 내가 그 사람과 다른 파일을 수정한다면 `dcommit`은 성공적으로 수행된다:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      configure.ac
	Committed r84
	       M      autogen.sh
	r83 = 8aa54a74d452f82eee10076ab2584c1fc424853b (trunk)
	       M      configure.ac
	r84 = cdbac939211ccb18aa744e581e46563af5d962d0 (trunk)
	W: d2f23b80f67aaaa1f6f5aaef48fce3263ac71a92 and refs/remotes/trunk differ, \
	  using rebase:
	:100755 100755 efa5a59965fbbb5b2b0a12890f1b351bb5493c18 \
	  015e4c98c482f0fa71e4d5434338014530b37fa6 M   autogen.sh
	First, rewinding head to replay your work on top of it...
	Nothing to do.

Push하고 나면 프로젝트 상태가 달라진다는 점을 기억해야 한다. 충돌이 없으면 변경사항이 바램대로 적용되지 않아도 알려주지 않는다. 이 부분이 Git과 다른 점이다. Git에서는 서버로 보내기 전에 프로젝트 상태를 전부 테스트할 수 있다. SVN은 서버로 커밋하기 전과 후의 상태가 동일하다는 것이 보장되지 않는다.

`git svn rebase` 명령으로도 Subversion 서버의 변경사항을 가져올 수 있다. 커밋을 보낼 준비가 안됐어도 괞찮다. `git svn fetch` 명령을 사용해도 되지만 `git svn rebase` 명령은 변경사항을 가져오고 적용까지 한 번에 해준다.

	$ git svn rebase
	       M      generate_descriptor_proto.sh
	r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
	First, rewinding head to replay your work on top of it...
	Fast-forwarded master to refs/remotes/trunk.

수시로 `git svn rebase` 명령을 사용하면 로컬 코드를 항상 최신 버전으로 유지할 수 있다. 이 명령을 사용하기 전에 워킹 디렉토리를 깨끗하게 만드는 것이 좋다. 깨끗하지 못하면 Stash를 하거나 임시로 커밋하고 나서 `git svn rebase` 명령을 실행하는 것이 좋다. 깨끗하지 않으면 충돌이 나서 Rebase가 중지될 수 있다.

## Git 브랜치 문제

Git에 익숙한 사람이면 일을 할 때 먼저 토픽 브랜치를 만들고, 일을 끝낸 다음에, Merge하는 방식을 쓰려고 할 것이다. 하지만, `git svn`으로 Subversion 서버에 Push할 때에는 브랜치를 Merge하지 않고 Rebase해야 한다. Subversion은 일직선 히스토리 밖에 모르고 Git의 Merge도 알지 못한다. 그래서 `git svn`은 첫 번째 부모 정보만 사용해서 Git 커밋을 Subversion 커밋으로 변경한다.

예제를 하나 살펴보자. `experiment` 브랜치를 하나 만들고 2개의 변경사항을 커밋한다. 그리고 `master` 브랜치로 Merge하고 나서 `dcommit` 명령을 수행하면 아래와 같은 모양이 된다:

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      CHANGES.txt
	Committed r85
	       M      CHANGES.txt
	r85 = 4bfebeec434d156c36f2bcd18f4e3d97dc3269a2 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk
	COPYING.txt: locally modified
	INSTALL.txt: locally modified
	       M      COPYING.txt
	       M      INSTALL.txt
	Committed r86
	       M      INSTALL.txt
	       M      COPYING.txt
	r86 = 2647f6b86ccfcaad4ec58c520e369ec81f7c283c (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Merge 커밋이 들어 있는 히스토리에서 `dcommit` 명령을 실행한다. 그리고 나서 Git 히스토리를 살펴보면 `experiment` 브랜치의 커밋은 재작성되지 않았다. 대신 Merge 커밋만 SVN 서버로 전송됐을 뿐이다.

누군가 이 것을 내려 받으면 결과가 합쳐진 Merge 커밋 하나만 볼 수 있다. 다른 사람은 언제 어디서 커밋한 것인지 알 수 없다.

## Subversion의 브랜치

Subversion의 브랜치는 Git의 브랜치와 달라서 가능한 사용을 하지 않는 것이 좋다. 하지만 `git svn`으로도 Subversion 브랜치를 관리할 수 있다.

### SVN 브랜치 만들기

Subversion 브랜치를 만들려면 `git svn branch [branchname]` 명령을 사용한다:

	$ git svn branch opera
	Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
	Found possible branch point: file:///tmp/test-svn/trunk => \
	  file:///tmp/test-svn/branches/opera, 87
	Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
	Following parent with do_switch
	Successfully followed parent
	r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

이 명령은 Subversion의 `svn copy trunk branches/opera` 명령과 동일하다. 이 명령은 브랜치를 Checkout해주지 않는다는 것을 주의해야 한다. 여기서 커밋하면 `opera` 브랜치가 아니라 `trunk` 브랜치에 커밋된다.

## Subversion 브랜치 넘나들기

`dcommit` 명령은 어떻게 커밋 할 브랜치를 결정할까? Git은 히스토리에 있는 커밋중에서 가장 마지막으로 기록된 Subversion 브랜치를 찾는다. 즉, 현 브랜치 히스토리의 커밋 메시지에 있는 `git-svn-id` 항목을 읽는 것이기 때문에 오직 한 브랜치에만 전송할 수 있다.

동시에 여러 브랜치에서 작업하려면 Subversion 브랜치에 `dcommit`할 수 있는 로컬 브랜치가 필요하다. 이 브랜치는 Subversion 커밋에서 시작하는 브랜치다. 아래와 같이 `opera` 브랜치를 만들면 독립적으로 일 할 수 있다:

	$ git branch opera remotes/opera

`git merge` 명령으로 `opera` 브랜치를 `trunk` 브랜치(`master` 브랜치 역할)에 Merge한다. 하지만 `-m` 옵션을 주고 적절한 커밋 메시지를 작성하지 않으면 아무짝에 쓸모없는 "Merge branch opera" 같은 메시지가 커밋된다.

`git merge` 명령으로 Merge한다는 것에 주목하자. Git은 자동으로 공통 커밋을 찾아서 Merge에 참고하기 때문에 Subversion에서 하는 것보다 Merge가 더 잘된다. 여기서 생성되는 Merge 커밋은 일반적인 Merge 커밋과 다르다. 이 커밋을 Subversion 서버에 Push해야 하지만 Subversion에서는 부모가 2개인 커밋이 있을 수 없다. 그래서 Push하면 브랜치에서 만들었던 커밋 여러개가 하나로 합쳐진(squash된) 것처럼 Push된다. 그래서 일단 Merge하면 취소하거나 해당 브랜치에서 계속 작업하기 어렵다. `dcommit` 명령을 수행하면 Merge한 브랜치의 정보를 어쩔 수 없이 잃어버리게 된다. Merge Base도 찾을 수 없게 된다. `dcommit` 명령은 Merge한 것을 `git merge --squash`로 Merge한 것과 똑 같이 만들어 버린다. Branch를 Merge한 정보는 저장되지 않기 때문에 이 문제를 해결할 방법이 없다. 문제를 최소화하려면 trunk에 Merge하자마자 해당 브랜치를(여기서는 `opera`) 삭제하는 것이 좋다.

## Subversion 명령

`git svn` 명령은 Git으로 전향하기 쉽도록 Subversion에 있는 것과 비슷한 명령어를 지원한다. 아마 여기서 설명하는 명령은 익숙할 것이다.

### SVN 형식의 히스토리

Subversion에 익숙한 사람은 Git 히스토리를 SVN 형식으로 보고 싶을 수도 있다. `git svn log` 명령은 SVN 형식으로 히스토리를 보여준다:

	$ git svn log
	------------------------------------------------------------------------
	r87 | schacon | 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009) | 2 lines

	autogen change

	------------------------------------------------------------------------
	r86 | schacon | 2009-05-02 16:00:21 -0700 (Sat, 02 May 2009) | 2 lines

	Merge branch 'experiment'

	------------------------------------------------------------------------
	r85 | schacon | 2009-05-02 16:00:09 -0700 (Sat, 02 May 2009) | 2 lines

	updated the changelog

`git svn log`명령에서 기억해야 할 것은 두 가지다. 우선 오프라인에서 동작한다는 점이다. SVN의 `svn log` 명령어는 히스토리 데이터를 조회할 때 서버가 필요하다. 둘째로 이미 서버로 전송한 커밋만 출력해준다. 아직 `dcommit` 명령으로 서버에 전송하지 않은 로컬 Git 커밋은 보여주지 않는다. Subversion 서버에는 있지만 아직 내려받지 않은 변경사항도 보여주지 않는다. 즉, 현재 알고있는 Subversion 서버의 상태만 보여준다.

### SVN 어노테이션

`git svn log` 명령이 `svn log` 명령을 흉내내는 것처럼 `git svn blame [FILE]` 명령으로 `svn annotate` 명령을 흉내낼 수 있다. 실행한 결과는 아래와 같다:

	$ git svn blame README.txt
	 2   temporal Protocol Buffers - Google's data interchange format
	 2   temporal Copyright 2008 Google Inc.
	 2   temporal http://code.google.com/apis/protocolbuffers/
	 2   temporal
	22   temporal C++ Installation - Unix
	22   temporal =======================
	 2   temporal
	79    schacon Committing in git-svn.
	78    schacon
	 2   temporal To build and install the C++ Protocol Buffer runtime and the Protocol
	 2   temporal Buffer compiler (protoc) execute the following:
	 2   temporal

다시 한번 말하지만 이 명령도 아직 서버로 전송하지 않은 커밋은 보여주지 않는다.

### SVN 서버 정보

`svn info` 명령은 `git svn info` 명령으로 대신할 수 있다:

	$ git svn info
	Path: .
	URL: https://schacon-test.googlecode.com/svn/trunk
	Repository Root: https://schacon-test.googlecode.com/svn
	Repository UUID: 4c93b258-373f-11de-be05-5f7a86268029
	Revision: 87
	Node Kind: directory
	Schedule: normal
	Last Changed Author: schacon
	Last Changed Rev: 87
	Last Changed Date: 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009)

`blame`이나 `log`명령이 오프라인으로 동작하듯이 이 명령도 오프라인으로 동작한다. 서버에서 가장 최근에 내려받은 정보를 출력한다.

### Subversion에서 무시하는것 무시하기

Subversion 저장소를 클론하면 쓸데 없는 파일을 커밋하지 않도록 `svn:ignore` 속성을 `.gitignore` 파일로 만들고 싶을 것이다. `git svn`에는 이 문제와 관련된 명령이 두 가지 있다. 하나는 `git svn create-ignore` 명령이다. 해당 위치에 커밋할 수 있는 `.gitignore` 파일을 생성해준다.

두 번째 방법은 `git svn show-ignore` 명령이다. `.gitignore`에 추가할 목록을 출력해 준다. 프로젝트의 exclude 파일로 결과를 리다이렉트할 수 있다:

	$ git svn show-ignore > .git/info/exclude

이렇게 하면 `.gitignore` 파일로 프로젝트를 더럽히지 않아도 된다. 혼자서만 Git을 사용하는 거라면 다른 팀원들은 프로젝트에 `.gitignore` 파일이 있는 것을 싫어 할 수 있다.

## Git-Svn 요약

`git svn` 도구는 여러가지 이유로 Subversion 서버를 사용해야만 하는 상황에서 빛을 발한다. 하지만 Git의 모든 장점을 이용할 수는 없다. Git과 Subversion은 다르기 때문에 혼란이 빚어질 수도 있다. 이런 문제에 빠지지 않기 위해서 다음 가이드라인을 지켜야 한다:

* Git 히스토리를 일직선으로 유지하라. `git merge`로 Merge 커밋이 생기지 않도록 하라. Merge 말고 Rebase로 변경사항을 Master 브랜치에 적용하라.
* 따로 Git 저장소 서버를 두지 말라. 클론을 빨리 하기 위해서 잠깐 하나 만들어 쓰는 것은 무방하나 절대로 Git 서버에 Push하지는 말아야 한다. `pre-receive` 훅에서 `git-svn-id`가 들어 있는 커밋 메시지는 거절하는 방법도 괜찮다.

이러한 가이드라인을 잘 지키면 Subversion 서버도 쓸만하다. 그래도 Git 서버를 사용할 수 있으면 Git 서버를 사용하는 것이 훨씬 좋다.
