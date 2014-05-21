# Refspec

이 책에서 리모트 브랜치가 어떻게 로컬 레퍼런스로 연결하는 것인지 간단하게 배웠지만 실제로는 좀 더 복잡하다. 아래처럼 리모트 저장소를 추가해보자:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

이 명령은 `origin` 이라는 저장소 이름, 그 URL, Fetch할 Refspec를 `.git/config` 파일에 추가한다:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

Refspec 형식은 `+`와 `<src>:<dest>`로 돼 있다. `+`는 생략 가능하고, `<src>`은 리모트 저장소의 레퍼런스고 `<dst>`는 매핑되는 로컬 저장소의 레퍼런스이다. `+`가 없으면 Fast-forward가 아니라도 업데이트된다.

`git remote add` 명령은 알아서 생성한 설정대로 서버의 `refs/heads/`에 있는 레퍼런스를 가져다 로컬의 `refs/remotes/origin/`에 만든다. 로컬에서 서버에 있는 `master` 브랜치에 접근할 때는 아래와 같이 한다:

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

이 세 개를 모두 같다. Git은 모두 `refs/remotes/origin/master`라고 해석한다.

`master` 브랜치만 가져올 수 있게 하려면 `fetch` 부분을 아래와 같이 바꿔준다. 그러면 다른 브랜치는 가져올 수 없다:

	fetch = +refs/heads/master:refs/remotes/origin/master

이것은 해당 리모트 저장소에서 `git fetch` 명령을 실행할 때 자동으로 사용되는 Refspec이다. 다른 Refspec이 필요하면 그냥 아규먼트로 넘긴다. 리모트 브랜치 `master`를 로컬 브랜치 `origin/mymaster`로 가져오려면 아래와 같이 실행한다.

	$ git fetch origin master:refs/remotes/origin/mymaster

Refspec을 여러개 넘겨도 된다. 한꺼번에 브랜치를 여러개 가져온다:

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

여기서 `master` 브랜치는 Fast-forward가 아니라서 거절된다. 하지만, Refspec 앞에 `+`를 추가하면 강제로 덮어쓴다.

설정 파일에도 Refspec을 여러 개 적을 수 있다. `master`와 `experiment` 브랜치를 둘다 적으면 항상 함께 가져온다:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

하지만, Glob 패턴은 사용할 수 없다:

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

그 대신 네임스페이스 형식으로는 사용할 수 있다. 만약 QA 팀이 Push하는 브랜치가 있고 이 브랜치를 가져오고 싶으면 아래와 같이 설정한다. 다음은 `master` 브랜치와 QA 팀의 브랜치만 가져오는 설정이다:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

좀 더 복잡한 것도 가능하다. QA 팀뿐만 아니라, 일반 개발자, 통합 팀 등이 사용하는 브랜치를 네임스페이스 별로 구분해 놓으면 좀 더 Git을 편리하게 사용할 수 있다.

## Refspec Push하기

네임스페이스 별로 가져오는 방법은 매우 편리하다. 하지만 Push할 땐 어떨까? QA 팀이 `qa/` 네임스페이스에 자신의 브랜치를 Push할 때도 Refspec을 사용할 수 있을까?

QA 팀은 `master` 브랜치를 리모트 저장소에 `qa/master`로 Push할 수 있다:

	$ git push origin master:refs/heads/qa/master

`git push origin`을 실행할 때마다 Git이 자동으로 Push하게 하려면 아래와 같이 설정 파일에 `push` 항목을 추가한다:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

다시 말하지만 `git push origin`을 실행하면 로컬 브랜치 `master`를 리모트 브랜치 `qa/master`로 Push한다.

## 레퍼런스 삭제하기

Refspec으로 서버에 있는 레퍼런스를 삭제할 수 있다:

	$ git push origin :topic

Refspec의 형식은 `<src>:<dst>`이니까 `<src>`를 비우고 실행하면 `<dst>`를 비우라는 명령이 된다. 그래서 `<dst>`는 삭제된다.
