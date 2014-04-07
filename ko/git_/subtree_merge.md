# Subtree Merge

서브모듈 시스템이 무엇이고 어디에 쓰는지 배웠다. 그런데 같은 문제를 해결하는 방법이 또 하나 있다. Git은 Merge하는 시점에 무엇을 Merge할지, 어떤 전략을 사용할지 결정해야 한다. Git은 브랜치 두 개를 Merge할 때에는 _Recursive_ 전략을 사용하고 세 개 이상의 브랜치를 Merge할 때에는 _Octopus_ 전략을 사용한다. 이 전략은 자동으로 선택된다. Merge할 브랜치가 두개면 _Recursive_ 전략이 선택된다. _Recursive_ 전략은 Merge하려는 두 커밋과 공통 조상 커밋을 이용하는 `three-way merge`를 사용하기 때문에 단 두 개의 브랜치에만 적용할 수 있다. Octopus 전략은 브랜치가 여러 개라도 Merge할 수 있지만 비교적 충돌이 쉽게 일어난다.

다른 전략도 있는데 그중 하나가 _Subtree_ Merge다. 이 Merge는 하위 프로젝트 문제를 해결하는 데에도 사용한다. 위에서 사용했던 Rack 예제를 적용해 보자.

Subtree Merge는 마치 하위 프로젝트가 아예 합쳐진 것처럼 보일 정도로 한 프로젝트를 다른 프로젝트의 하위 디렉토리에 연결해준다. 정말 놀라운 기능이다.

Rack 프로젝트를 리모트 저장소로 추가시키고 브랜치를 Checkout한다:

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

Checkout한 `rack_branch`의 루트 디렉토리와 origin 프로젝트의 `master` 브랜치의 루트 디렉토리는 다르다. 브랜치를 바꿔가며 어떻게 다른지 확인한다:

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

여기에서 Rack 프로젝트를 `master` 브랜치의 하위 디렉토리에 넣으려면 `git read-tree` 명령어를 사용한다. *9장*에서 `read-read` 류의 명령어를 좀 더 자세히 다룬다. 여기에서는 워킹 디렉토리와 Staging Area로 어떤 브랜치를 통째로 넣을 수 있다는 것만 알면 된다. `master` 브랜치로 되돌아가서 `rack_branch`를 `rack` 디렉토리에 넣는다:

	$ git read-tree --prefix=rack/ -u rack_branch

그리고 나서 커밋을 하면 rack 디렉토리는 rack 프로젝트의 파일들을 직접 복사해 넣은 것과 똑같다. 복사한 것과 다른 점은 브랜치를 자유롭게 바꿀 수 있고 최신 버전의 Rack 프로젝트의 코드를 쉽게 끌어 올 수 있다는 점이다:

	$ git checkout rack_branch
	$ git pull

그리고 `git merge -s subtree`라는 명령어를 사용하여 `master` 브랜치와 Merge할 수 있고 원하든 원하지 않든 간에 히스토리도 함께 Merge된다. 수정 내용만 Merge하거나 커밋 메시지를 다시 작성하려면 `-s subtree` 옵션에다가 `--squash`, `--no-commit`를 함께 사용해야 한다:

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

Rack 프로젝트의 최신 코드를 가져다가 Merge했고 이제 커밋하면 된다. 물론 반대로 하는 것도 가능하다. `rack` 디렉토리로 이동해서 코드를 수정하고 `rack_branch` 브랜치로 Merge한다. 그리고 Rack 프로젝트 저장소에 Push할 수 있다.

`rack` 디렉토리와 `rack_branch` 브랜치와의 차이점도 비교할 수 있다. 일반적인 `diff` 명령은 사용할 수 없고 `git diff-tree` 명령을 사용해야 한다:

	$ git diff-tree -p rack_branch

또 `rack` 디렉토리와 저장소의 `master` 브랜치와 비교할 수 있다:

	$ git diff-tree -p rack_remote/master
