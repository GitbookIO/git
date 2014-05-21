# 프로젝트 운영하기

효율적으로 기여하는 방법뿐만 아니라 효율적으로 운영하는 방법도 알아야 한다. 언젠가는 단순히 프로젝트에 기여하는 것이 아니라 프로젝트를 직접 운영해야 할 수도 있다. 프로젝트를 운영하는 것은 크게 두 가지로 이루어진다. 하나는 format-patch 명령으로 생성한 Patch를 이메일로 받아서 프로젝트에 Patch를 적용하는 것이다. 다른 하나는 프로젝트의 다른 리모트 저장소로부터 변경 내용을 Merge하는 것이다. 저장소를 아주 깔끔하고 정돈된 상태로 운영하고 Patch를 적용하거나 수정사항을 확인하기 쉬운 상태를 유지하려면 좋은 운영 방식을 터득해야 한다. 좋은 운영 방식은 다른 사람들이 이해하기 쉽고 프로젝트가 오랫동안 운영돼도 흐트러짐이 없어야 한다.

## 토픽 브랜치에서 일하기

메인 브랜치에 통합하기 전에 임시로 토픽 브랜치를 하나 만들고 거기에 통합해 보고 나서 다시 메인 브랜치에 통합하는 것이 좋다. 이렇게 하면 Patch를 적용할 때 이리저리 수정해 보기도 하고 좀 더 고민해 봐야 하면 Patch를 적용해둔 채로 나중으로 미룰 수도 있다. 무슨 Patch인지 브랜치 이름에 간단히 적어주면 다른 작업을 하다가 나중에 이 브랜치로 돌아왔을 때 기억해내기 훨씬 수월하다. 프로젝트의 관리자라면 이런 토픽 브랜치의 이름을 잘 지어야 한다. 예를 들어 sc라는 사람이 작업한 Patch라면 `sc/ruby_client` 처럼 앞에 닉네임을 붙여서 브랜치를 만들 수 있다. master 브랜치에서 새 토픽 브랜치를 아래와 같이 만든다:

	$ git branch sc/ruby_client master

`checkout -b` 명령으로 브랜치를 만들고 Checkout까지 한 번에 할 수 있다:

	$ git checkout -b sc/ruby_client master

이렇게 토픽 브랜치를 만들고 Patch를 적용해보고 적용한 내용을 다시 Long-Running 브랜치로 Merge한다.

## 이메일로 받은 Patch를 적용하기

이메일로 받은 Patch를 프로젝트에 적용하기 전에 우선 토픽 브랜치에 Patch를 적용해 본다. Patch를 적용하는 방법은 `git apply` 명령을 사용하는 것과 `git am` 명령을 사용하는 것 두 가지가 있다.

### apply 명령을 사용하는 방법

`git diff`나 Unix의 diff 명령으로 만든 Patch파일을 적용할 때에는 `git apply` 명령을 사용한다. Patch 파일이 `/tmp/patch-ruby-client.patch`라고 하면 아래와 같은 명령으로 Patch를 적용할 수 있다:

	$ git apply /tmp/patch-ruby-client.patch

위 명령을 실행하면 Patch 파일 내용에 따라 현재 디렉토리의 파일들을 변경한다. 위 명령은 `patch -p1` 명령과 거의 같다. 하지만, 이 명령이 patch 명령보다 훨씬 더 꼼꼼하게 비교한다. `git diff`로 생성한 Patch 파일에 파일을 추가하거나, 파일을 삭제하고, 파일의 이름을 변경하는 내용이 들어 있으면 그대로 적용된다. 이런 것은 patch 명령으로 할 수 없다.

그리고 `git apply`는 "모두 적용, 아니면 모두 취소" 모델을 사용하기 때문에 Patch를 적용하는 데 실패하면 Patch를 적용하기 이전 상태로 전부 되돌려 놓는다. Patch 명령은 여러 파일에 적용하다가 중간에 실패하면 거기서 그대로 중단하기 때문에 깔끔하지 못하다. `git apply`는 Patch보다 훨씬 결벽증적이다. 이 명령은 자동으로 커밋해 주지 않기 때문에 변경된 파일을 직접 Staging Area에 추가하고 커밋해야 한다.

실제로 Patch를 적용하기 전에 Patch가 잘 적용되는지 한 번 시험해보려면 `git apply --check` 명령을 사용한다:

	$ git apply --check 0001-seeing-if-this-helps-the-gem.patch
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply

화면에 아무런 내용도 뜨지 않으면 Patch가 깔끔하게 적용된다는 것이다. 이 명령은 Patch를 적용해 보고 에러가 발생하면 0이 아닌 값을 반환하기 때문에 쉘 스크립트에서도 사용할 수 있다.

### am 명령을 사용하는 방법

프로젝트 기여자가 Git의 format-patch 명령을 잘 사용하면 관리자의 작업은 훨씬 쉬워진다. format-patch 명령으로 만든 Patch 파일은 기여자의 정보와 커밋 정보가 포함되어 있기 때문이다. 그래서 기여자가 diff보다 format-patch를 사용하도록 권해야 한다. `git apply`는 기존의 Patch파일에만 사용한다.

format-patch 명령으로 생성한 Patch 파일은 `git am` 명령으로 적용한다. `git am`은 메일 여러 통이 들어 있는 mbox파일을 읽어서 Patch한다. mbox파일은 간단한 텍스트 파일이고 그 내용은 아래와 같다:

	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] add limit to log function

	Limit log functionality to the first 20

이 내용은 format-patch 명령으로 생성한 파일의 앞부분이다. 이 파일은 mbox 형식이다. 받은 메일이 `git send-email`로 만든 메일이라면 mbox 형식으로 저장하고 이 mbox 파일을 `git am` 명령으로 적용한다. 사용하는 메일 클라이언트가 여러 메일을 하나의 mbox 파일로 저장할 수 있다면 메일 여러 개를 한 번에 Patch할 수 있다.

이메일로 받은 것이 아니라 이슈 트래킹 시스템 같은데 올라온 파일이라면 먼저 내려받고서 `git am` 명령으로 Patch한다:

	$ git am 0001-limit-log-function.patch
	Applying: add limit to log function

Patch가 성공하면 자동으로 새로운 커밋이 하나 만들어진다. Patch 파일에 들어 있는 기여자의 이메일, 작성시간, 커밋 메시지를 뽑아서 커밋에 함께 저장한다. 예를 들어 위의 mbox 예제 파일을 적용해서 생성되는 커밋은 아래와 같다:

	$ git log --pretty=fuller -1
	commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Author:     Jessica Smith <jessica@example.com>
	AuthorDate: Sun Apr 6 10:17:23 2008 -0700
	Commit:     Scott Chacon <schacon@gmail.com>
	CommitDate: Thu Apr 9 09:19:06 2009 -0700

	   add limit to log function

	   Limit log functionality to the first 20

커밋 정보는 누가 언제 Patch했는 지 알려 준다. Author 정보는 실제로 누가 언제 Patch파일을 만들었는지 알려 준다.

Patch에 실패할 수도 있다. 보통 Patch가 생성된 시점보다 해당 브랜치가 너무 업데이트 됐을 때나 아직 적용되지 않은 다른 Patch가 필요한 경우에 일어난다. 이러면 `git am` 명령은 Patch를 중단하고 사용자에게 어떻게 처리할지 물어온다:

	$ git am 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Patch failed at 0001.
	When you have resolved this problem run "git am --resolved".
	  (충돌을 해결하면 "git am --resolved" 입력)
	If you would prefer to skip this patch, instead run "git am --skip".
	  (Patch 적용을 생략하려면 "git am --skip" 입력)
	To restore the original branch and stop patching run "git am --abort".
	  (Patch 적용을 중단하려면 "git am --abort" 입력)

성공적으로 Patch하지 못하면 git은 Merge나 Rebase의 경우처럼 문제를 일으킨 파일에 충돌 표시를 해 놓는다. Merge나 Rebase할 때 충돌을 해결하는 것처럼 Patch의 충돌도 해결할 수 있다. 충돌한 파일을 열어서 충돌 부분을 수정하고 나서 Staging Area에 추가하고 `git am --resolved` 명령을 입력한다:

	$ (fix the file)
	$ git add ticgit.gemspec
	$ git am --resolved
	Applying: seeing if this helps the gem

충돌이 났을 때 Git에게 좀 더 머리를 써서 Patch를 적용하도록 하려면 -3 옵션을 사용한다. 이 옵션은 Git에게 3-way Patch를 적용해 보라고 하는 것이다. Patch가 어느 시점에서 갈라져 나온 것인지 알 수 없기 때문에 이 옵션은 기본적으로 비활성화돼 있다. 하지만, 같은 프로젝트의 커밋이라면 기본옵션보다 훨씬 똑똑하게 충돌 상황을 해결한다.

	$ git am -3 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Using index info to reconstruct a base tree...
	Falling back to patching base and 3-way merge...
	No changes -- Patch already applied.

위의 경우는 이미 Patch한 것을 다시 Patch하는 상황이다. -3 옵션이 없었으면 충돌을 알아서 해결하지 못했을 것이다.

하나의 mbox 파일에 들어 있는 여러 Patch를 적용할 때 대화형 방식을 사용할 수 있다. 이 방식을 사용하면 Patch를 적용하기 전에 Patch를 적용할 때마다 묻는다:

	$ git am -3 -i mbox
	Commit Body is:
	--------------------------
	seeing if this helps the gem
	--------------------------
	Apply? [y]es/[n]o/[e]dit/[v]iew patch/[a]ccept all

이 옵션은 Patch를 여러 개 적용할 때 유용하다. 적용하려는 Patch의 내용을 미리 꼭 기억해두지 않아도 되고 적용하기 전에 이미 적용된 Patch인지 알 수 있다.

모든 Patch를 토픽 브랜치에 적용하고 커밋까지 마치면 Long-Running 브랜치에 어떻게 통합할지를 결정해야 한다.

## 리모트 브랜치로부터 통합하기

프로젝트 기여자가 자신의 저장소를 만들고 커밋을 몇 번 하고 저장소의 URL과 변경 내용을 메일로 보내왔다면 URL을 리모트 저장소로 등록하고 Merge할 수 있다.

예를 들어 Jessica씨는 ruby-client 브랜치에 엄청난 기능을 만들어 놨다고 메일을 보내왔다. 이 리모트 브랜치를 등록하고 Checkout해서 테스트한다:

	$ git remote add jessica git://github.com/jessica/myproject.git
	$ git fetch jessica
	$ git checkout -b rubyclient jessica/ruby-client

후에 Jessiaca씨가 이메일로 또 다른 엄청난 기능을 개발한 브랜치를 보내오면 이미 저장소를 등록했기 때문에 간단히 Fetch하고 Checkout할 수 있다.

다른 개발자들과 함께 지속적으로 개발할 때는 이 방식이 가장 사용하기 좋다. 물론 기여하는 사람이 간단한 Patch를 이따금씩만 만들어 내면 이메일로 Patch 파일을 받는 것이 낫다. 기여자가 저장소 서버를 만들어 커밋하고 관리자가 리모트 저장소로 등록해서 Patch를 합치는 작업보다 시간과 노력이 덜 든다. 물론 Patch 한두 개를 보내는 사람들까지도 모두 리모트 저장소로 등록해서 사용해도 된다. 스크립트나 호스팅 서비스를 사용하면 좀 더 쉽게 관리할 수 있다. 어쨌든 어떤 방식이 좋을지는 우리가 어떻게 개발하고 어떻게 기여할지에 달렸다.

리모트 저장소로 등록하면 커밋의 히스토리도 알 수 있다. Merge할 때 어디서 부터 커밋이 갈라졌는지 알 수 있기 때문에 -3 옵션을 주지 않아도 자동으로 3-way Merge가 적용된다.

리모트 저장소로 등록하지 않고도 Merge할 수 있다. 계속 함께 일할 개발자가 아닐 때 사용하면 좋다. 아래는 리모트 저장소로 등록하지 않고 URL을 직접 사용하여 Merge를 하는 예이다:

	$ git pull git://github.com/onetimeguy/project.git
	From git://github.com/onetimeguy/project
	 * branch            HEAD       -> FETCH_HEAD
	Merge made by recursive.

## 무슨 내용인지 확인하기

기여물이 포함된 토픽 브랜치가 있으니 이제 그 기여물을 Merge할지 말지 결정야 한다. 이번 절에서는 메인 브랜치에 Merge할 때 필요한 명령어를 살펴본다. 주로 토픽 브랜치를 검토하는데 필요한 명령이다.

먼저 지금 작업하는 브랜치에서 master 브랜치에 속하지 않는 커밋만 살펴보는 것이 좋다. --not 옵션으로 히스토리에서 master 브랜치에 속한 커밋은 제외하고 살펴본다. 예를 들어 contrib 브랜치에 Patch를 두 개 Merge했으면 아래와 같은 명령어로 그 결과를 살펴볼 수 있다:

	$ git log contrib --not master
	commit 5b6235bd297351589efc4d73316f0a68d484f118
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Oct 24 09:53:59 2008 -0700

	    seeing if this helps the gem

	commit 7482e0d16d04bea79d0dba8988cc78df655f16a0
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Mon Oct 22 19:38:36 2008 -0700

	    updated the gemspec to hopefully work better

`git log` 명령에 -p 옵션을 주면 각 커밋에서 실제로 무슨 내용이 변경됐는지 살펴볼 수 있다. 이 옵션은 각 commit의 뒤에 diff의 내용을 출력해 준다.

토픽 브랜치를 다른 브랜치에 Merge하기 전에 어떤 부분이 변경될지 미리 살펴볼 수 있다. 이때는 색다른 명령을 사용해야 한다. 물론 아래와 같은 명령을 사용할 수도 있다:

	$ git diff master

이 명령은 diff 내용을 보여주긴 하지만 잘못된 것을 보여줄 수도 있다. 토픽 브랜치에서 작업하는 동안 master 브랜치에 새로운 커밋이 추가될 수도 있다. 그래서 기대하는 diff 결과가 아닐 수 있다. 지금 이 명령은 각 브랜치의 마지막 스냅샷을 비교한다. master 브랜치에 한 줄을 추가되면 토픽 브랜치에서 한 줄 삭제한 것으로 보여 준다.

master 브랜치가 가리키는 커밋이 토픽 브랜치의 조상이라면 아무 문제 없다. 하지만, 그렇지 않은 경우라면 이 diff 도구는 토픽 브랜치에만 있는 내용은 추가하는 것이고 master 브랜치에만 있는 내용은 삭제하는 것으로 간주한다.

정말 보고 싶은 것은 토픽 브랜치에 추가한 것이고 결국에는 이것을 master 브랜치에 추가하려는 것이다. 그러니까 master 브랜치와 토픽 브랜치의 공통 조상인 커밋을 찾아서 토픽 브랜치가 현재 가리키는 커밋과 비교해야 한다.

아래와 같은 명령으로 공통 조상인 커밋을 찾고 이 조상 커밋에서 변경된 내용을 살펴본다:

	$ git merge-base contrib master
	36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
	$ git diff 36c7db

이 방법으로 원하는 결과를 얻을 수 있지만, 사용법이 불편하다. Git은 Triple-Dot으로 간단하게 위와 같이 비교하는 방법을 지원한다. diff 명령을 사용할 때 두 브랜치 사이에 ...를 쓰면, 두 브랜치의 공통 조상과 브랜치의 마지막 커밋을 비교한다:

	$ git diff master...contrib

이 명령은 master 브랜치로부터 현재 토픽 브랜치의 다른 것들만 보여주기 때문에 기억해두면 매우 유용하게 사용할 수 있을 것이다.

## 기여물 통합하기

기여물을 토픽 브랜치에 다 적용하고 Long-Running 브랜치나 master 브랜치로 통합할 준비가 되었다면 이제 어떻게 해야 할까? 프로젝트를 운영하는 데 쓰는 작업 방식은 어떤 것이 있을까? 앞으로 그 예제 몇 가지를 살펴본다.

### Merge Workflow

바로 master 브랜치에 Merge하는 것이 가장 간단하다. 이 Workflow에서는 master 브랜치가 안전한 코드라고 가정한다. 토픽 브랜치를 검증하고 master 브랜치로 Merge할 때마다 토픽 브랜치를 삭제한다. 그림 5-19처럼 `ruby_client` 브랜치와 `php_client` 브랜치가 있을 때 `ruby_client` 브랜치를 master 브랜치로 Merge한 후 `php_client` 브랜치를 Merge하면 그림 5-20과 같아진다:


![](http://git-scm.com/figures/18333fig0519-tn.png)

그림 5-19. 저장소의 두 브랜치


![](http://git-scm.com/figures/18333fig0520-tn.png)

그림 5-20. Merge한 후의 저장소

이 Workflow은 간단하지만, 프로젝트의 규모가 커지면 문제가 생길 수 있다.

개발자가 많고 규모가 큰 프로젝트에서는 두 단계로 Merge하는 것이 좋다. 그래서 Long-Running 브랜치를 두 개로 유지해야 한다. master 브랜치는 아주 안정적인 버전을 릴리즈하기 위해서 사용한다. develop 브랜치는 새로 수정된 코드를 통합할 때 사용한다. 그리고 두 브랜치를 모두 저장소에 Push한다. 우선 develop 브랜치에 토픽 브랜치(그림 5-21)를 그림 5-22과 같이 Merge한다. 그 후에 릴리즈해도 될만한 수준이 되면 master 브랜치를 develop 브랜치까지 Fast-forward시킨다(그림 5-23).


![](http://git-scm.com/figures/18333fig0521-tn.png)

그림 5-21. 토픽 브랜치를 Merge하기 전


![](http://git-scm.com/figures/18333fig0522-tn.png)

그림 5-22. 토픽 브랜치를 Merge한 후


![](http://git-scm.com/figures/18333fig0523-tn.png)

그림 5-23. 토픽 브랜치를 릴리즈한 후

이 Workflow을 사용하면 프로젝트 저장소를 Clone하고 나서 개발자가 안정 버전이 필요하면 master 브랜치를 빌드하고 안정적이지 않더라도 좀 더 최신 버전이 필요하면 develop 브랜치를 Checkout하여 빌드한다. 이 개념을 좀 더 확장해서 사용할 수 있다. 토픽 브랜치를 검증하기 위한 integrate 브랜치를 만들어 Merge하고 토픽 브랜치가 검증되면 develop 브랜치에 머지한다. 그리고 develop 브랜치에서 충분히 안정하다는 것이 증명되면 그때 master 브랜치에 Merge한다.

### 대규모 Merge Workflow

Git을 개발하는 프로젝트는 Long-Running의 브랜치를 4개 운영한다. 각 브랜치 이름은 master, next, pu (Proposed Updates), maint 이다. maint는 마지막으로 릴리즈한 버전을 지원하는 브랜치다. 기여자가 새로운 기능을 제안하면 관리자는 그림 5-24처럼 자신의 저장소에 토픽 브랜치를 만들어 관리한다. 그리고 토픽에 부족한 점은 없는지, 안정적인지 계속 테스트한다. 안정화되면 next로 Merge하고 저장소에 Push한다. 그러면 모두가 잘 통합됐는지 확인할 수 있다.


![](http://git-scm.com/figures/18333fig0524-tn.png)

그림 5-24. 토픽 브랜치를 동시에 여러 개 관리하는 것은 복잡하다

토픽 브랜치가 좀 더 개선돼야 하면 next가 아니라 pu에 Merge한다. 그 후에 충분히 검증을 마치면 pu에서 next로 옮기고 next를 기반으로 pu를 다시 만든다. next에는 아직 master에 넣기에 모자라 보이는 것들이 들어 있다. 즉 next 브랜치는 정말 가끔 Rebase하고 pu는 자주 Rebase하지만 master는 항상 Fast-forward한다(그림 5-25).


![](http://git-scm.com/figures/18333fig0525-tn.png)

그림 5-25. 토픽 브랜치를 Long-Running 브랜치로 Merge하기

토픽 브랜치가 결국 master 브랜치로 Merge되면 저장소에서 삭제한다. 그리고 이전 릴리즈 버전에 Patch가 필요하면 maint 브랜치를 이용해 대응한다. Git을 개발하는 프로젝트를 Clone하면 브랜치가 4개 있고 각 브랜치를 이용하여 진행사항을 확인해볼 수 있다. 그래서 새로운 기능을 추가하려면 적당한 브랜치를 보고 고른다. 이 Workflow는 잘 구조화돼 있어서 코드가 새로 추가돼도 테스트하기 쉽다.

### Rebase와 Cherry-Pick Workflow

히스토리를 평평하게 관리하려고 Merge보다 Rebase나 Cherry-Pick을 더 선호하는 관리자들도 있다. 토픽 브랜치에서 작업을 마친 후 master에 통합할 때 master 브랜치를 기반으로 Rebase한다. 그러면 커밋이 다시 만들어 진다. master 대신 develop 등의 브랜치에도 가능하다. 문제가 없으면 master 브랜치를 Fast-forward시킨다. 이렇게 평평한 히스토리를 유지할 수 있다.

한 브랜치에서 다른 브랜치로 작업한 내용을 옮기는 또 다른 방식으로 Cherry-pick이란 것도 있다. Git의 Cherry-pick은 커밋 하나만 Rebase하는 것이다. 커밋 하나로 Patch 내용을 만들어 현재 브랜치에 적용을 하는 것이다. 토픽 브랜치에 있는 커밋중에서 하나만 고르거나 토픽 브랜치에 커밋이 하나밖에 없을 때 Rebase보다 유용하다. 그림 5-26의 예를 들어보자.


![](http://git-scm.com/figures/18333fig0526-tn.png)

그림 5-26. Cherry-pick을 실행하기 전의 저장소

e43a6 커밋 하나만 현재 브랜치에 적용하려면 아래와 같은 명령을 실행한다:

	$ git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
	Finished one cherry-pick.
	[master]: created a0a41a9: "More friendly message when locking the index fails."
	 3 files changed, 17 insertions(+), 3 deletions(-)

위 명령을 실행하면 e43a6 커밋에서 변경된 내용을 현재 브랜치에 똑같이 적용을 한다. 하지만, 변경을 적용한 시점이 다르므로 새 커밋의 SHA-1 해시 값은 달라진다. 명령을 실행하고 나면 그림 5-27과 같이 될 것이다.


![](http://git-scm.com/figures/18333fig0527-tn.png)

그림 5-27. Cherry-pick 방식으로 커밋 하나를 적용한 후의 저장소

Rebase나 Cherry-pick 방식으로 토픽 브랜치를 합치고 나면 필요없는 토픽 브랜치나 커밋은 삭제한다.

## 릴리즈 버전에 태그 달기

적당한 때가 되면 릴리즈해야 한다. 그리고 언제든지 그 시점으로 되돌릴 수 있게 태그를 다는 것이 좋다. *2장*에서 살펴본 대로 태그를 달면 된다. 서명된 태그를 달면 아래와 같이 출력된다:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gmail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

태그에 서명하면 서명에 사용한 PGP 공개키도 배포해야 한다. Git 개발 프로젝트는 관리자의 PGP 공개키를 Blob 형식으로 Git 저장소에 함께 배포한다. 이 Blob파일을 사용하여 태그에 서명했다. 아래와 같은 명령으로 어떤 PGP 공개키를 포함할지 확인한다:

	$ gpg --list-keys
	/Users/schacon/.gnupg/pubring.gpg
	---------------------------------
	pub   1024D/F721C45A 2009-02-09 [expires: 2010-02-09]
	uid                  Scott Chacon <schacon@gmail.com>
	sub   2048g/45D02282 2009-02-09 [expires: 2010-02-09]

`git hash-object`라는 명령으로 공개키를 바로 Git 저장소에 넣을 수 있다. 이 명령은 Git 저장소 안에 Blob 형식으로 공개키를 저장해주고 그 Blob의 SHA-1 값을 알려준다:

	$ gpg -a --export F721C45A | git hash-object -w --stdin
	659ef797d181633c87ec71ac3f9ba29fe5775b92

이 SHA-1 해시 값으로 PGP 공개키를 가리키는 태그를 만든다:

	$ git tag -a maintainer-pgp-pub 659ef797d181633c87ec71ac3f9ba29fe5775b92

`git push --tags` 명령으로 앞서 만든 maintainer-pgp-pub 태그를 공유한다. 다른 사람이 태그의 서명을 확인하려면 우선 Git 저장소에 저장된 PGP 공개키를 꺼내서 GPG키 데이터베이스에 저장해야 한다:

	$ git show maintainer-pgp-pub | gpg --import

사람들은 이렇게 공개키를 얻어서 서명된 태그를 확인한다. 또한, 관리자가 태그 메시지에 서명을 확인하는 방법을 적어 놓으면 좋다. `git show <tag>`으로 어떻게 서명된 태그를 확인하는지 설명한다.

## 빌드넘버 만들기

Git은 'v123' 처럼 숫자 형태로 커밋 이름을 만들지 않기 때문에 사람이 기억하기 어렵다. 하지만 `git describe` 명령으로 좀 더 사람이 기억하기 쉬운 이름을 얻을 수 있다. Git은 가장 가까운 태그의 이름과, 태그에서 얼마나 더 커밋이 쌓였는지, 그리고 해당 커밋의 SHA-1 값을 조금 가져다가 이름을 만든다:

	$ git describe master
	v1.6.2-rc1-20-g8c5b85c

이렇게 사람이 읽을 수 있는 이름으로 스냅샷이나 빌드를 만든다. 만약 저장소에서 Clone한 후 소스코드로 Git을 설치하면 `git --version` 명령은 이렇게 생긴 빌드넘버를 보여준다. 태그가 달린 커밋에 `git describe`명령을 사용하면 다른 정보 없이 태그 이름만 사용한다.

`git describe` 명령은 -a나 -s 옵션을 주고 만든 Annotated 태그가 필요하다. 릴리즈 태그는 `git describe` 명령으로 만드니까 꼭 이름이 적당한지 사전에 확인해야 한다. 그리고 이 값은 Checkout이나 Show 명령에도 사용할 수 있지만, 전적으로 이름 뒤에 붙은 SHA-1 값을 사용한다. 그래서 이 값으로는 해당 커밋을 못 찾을 수도 있다. 최근 Linux Kernel은 충돌 때문에 축약된 SHA-1를 8자에서 10자로 늘렸다. 이제는 8자일 때 생성한 값은 사용할 수 없다.

## 릴리즈 준비하기

먼저 Git을 사용하지 않는 사람을 위해 소스코드 스냅샷을 압축한다. 쉽게 압축할 수 있도록 Git은 `git archive` 명령을 지원한다:

	$ git archive master --prefix='project/' | gzip > `git describe master`.tar.gz
	$ ls *.tar.gz
	v1.6.2-rc1-20-g8c5b85c.tar.gz

이 압축 파일을 풀면 프로젝트의 가장 마지막 스냅샷이 나온다. ZIP 형식으로 압축파일을 만들려면 `--format=zip` 옵션을 사용한다:

	$ git archive master --prefix='project/' --format=zip > `git describe master`.zip

이렇게 압축한 스냅샷 파일은 Website나 이메일로 사람들에게 배포할 수 있다.

## Shortlog 보기

이메일로 프로젝트의 변경 사항을 사람들에게 알려야 할 때, `git shortlog` 명령을 사용하면 지난 릴리즈 이후의 변경 사항 목록을 쉽게 얻어올 수 있다. `git shortlog` 명령은 주어진 범위에 있는 커밋을 요약해준다. 아래는 최근 릴리즈 버전인 v1.0.1 이후의 커밋을 요약해 주는 예제이다:

	$ git shortlog --no-merges master --not v1.0.1
	Chris Wanstrath (8):
	      Add support for annotated tags to Grit::Tag
	      Add packed-refs annotated tag support.
	      Add Grit::Commit#to_patch
	      Update version and History.txt
	      Remove stray `puts`
	      Make ls_tree ignore nils

	Tom Preston-Werner (4):
	      fix dates in history
	      dynamic version method
	      Version bump to 1.0.2
	      Regenerated gemspec for version 1.0.2

이렇게 Author를 기준으로 정리한 커밋을 이메일로 전송한다.
