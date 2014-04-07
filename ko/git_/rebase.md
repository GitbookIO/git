# Rebase하기

Git에서 한 브랜치에서 다른 브랜치로 합치는 방법은 두 가지가 있다. 하나는 Merge이고 다른 하나는 Rebase다. 이 절에서는 Rebase가 무엇인지, 어떻게 사용하는지, 좋은 점은 뭐고, 어떤 상황에서 사용하고 어떤 상황에서 사용하지 말아야 하는지 알아 본다.

## Rebase의 기초

앞의 Merge 절에서 살펴본 예제로 다시 돌아가 보자(그림 3-27). 두 개의 나누어진 브랜치의 모습을 볼 수 있다.


![](http://git-scm.com/figures/18333fig0327-tn.png)

그림 3-27. 두 개의 브랜치로 나누어진 커밋 히스토리

이 두 브랜치를 합치는 가장 쉬운 방법은 앞에서 살펴본 대로 Merge 명령을 사용하는 것이다. 두 브랜치의 마지막 커밋 두 개(C3, C4)와 공통 조상(C2)을 사용하는 3-way Merge로 그림 3-28처럼 새로운 커밋을 만들어 낸다.


![](http://git-scm.com/figures/18333fig0328-tn.png)

그림 3-28. 나뉜 브랜치를 Merge하기

비슷한 결과를 만드는 다른 방식으로, C3에서 변경된 사항을 패치(Patch)로 만들고 이를 다시 C4에 적용시키는 방법이 있다. Git에서는 이런 방식을 _Rebase_ 라고 한다. Rebase 명령으로 한 브랜치에서 변경된 사항을 다른 브랜치에 적용할 수 있다.

위의 예제는 다음과 같은 명령으로 Rebase한다:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

실제로 일어나는 일을 설명하자면 일단 두 브랜치가 나뉘기 전인 공통 커밋으로 이동하고 나서 그 커밋부터 지금 Checkout한 브랜치가 가리키는 커밋까지 diff를 차례로 만들어 어딘가에 임시로 저장해 놓는다. Rebase할 브랜치(역주 - experiment)가 합칠 브랜치(역주 - master)가 가리키는 커밋을 가리키게 하고 아까 저장해 놓았던 변경사항을 차례대로 적용한다. 그림 3-29는 이러한 과정을 나타내고 있다.


![](http://git-scm.com/figures/18333fig0329-tn.png)

그림 3-29. C3의 변경사항을 C4에 적용하는 Rebase 과정

그리고 나서 master 브랜치를 Fast-forward 시킨다.


![](http://git-scm.com/figures/18333fig0330-tn.png)

그림 3-30. master 브랜치를 Fast-forward시키기

C3'로 표시된 커밋에서의 내용은 Merge 예제에서 살펴본 C5 커밋에서의 내용과 같을 것이다. Merge이든 Rebase든 둘 다 합치는 관점에서는 서로 다를 게 없다. 하지만, Rebase가 좀 더 깨끗한 히스토리를 만든다. Rebase한 브랜치의 Log를 살펴보면 히스토리가 선형적이다. 일을 병렬로 동시에 진행해도 Rebase하고 나면 모든 작업이 차례대로 수행된 것처럼 보인다.

Rebase는 보통 리모트 브랜치에 커밋을 깔끔하게 적용하고 싶을 때 사용한다. 아마 이렇게 Rebase하는 리모트 브랜치는 직접 관리하는 것이 아니라 그냥 참여하는 브랜치일 것이다. 메인 프로젝트에 패치를 보낼 준비가 되면 하는 것이 Rebase이니까 브랜치에서 하던 일을 완전히 마치고 origin/master로 Rebase한다. 프로젝트 관리자는 어떠한 통합작업도 필요 없다. 그냥 master 브랜치를 Fast-forward 시키면 된다.

Rebase를 하든지, Merge를 하든지 최종 결과물은 같고 커밋 히스토리만 다르다는 것이 중요하다. Rebase의 경우는 브랜치의 변경사항을 순서대로 다른 브랜치에 적용하면서 합치고 Merge의 경우는 두 브랜치의 최종결과만을 가지고 합친다.

## 좀 더 Rebase

Rebase는 단순히 브랜치를 합치는 것만 아니라 다른 용도로도 사용할 수 있다. 그림 3-31과 같은 히스토리가 있다고 하자. server 브랜치를 만들어서 서버 기능을 추가하고 그 브랜치에서 다시 client 브랜치를 만들어 클라이언트 기능을 추가한다. 마지막으로 server 브랜치로 돌아가서 몇 가지 기능을 더 추가한다.


![](http://git-scm.com/figures/18333fig0331-tn.png)

그림 3-31. 다른 토픽 브랜치에서 갈라져 나온 토픽 브랜치

이때 테스트가 덜 된 server 브랜치는 그대로 두고 client 브랜치만 master로 합치려는 상황을 생각해보자. server와는 아무 관련이 없는 client 커밋은 C8, C9이다. 이 두 커밋을 master 브랜치에 적용하기 위해서 `--onto` 옵션을 사용하여 아래와 같은 명령을 실행한다:

	$ git rebase --onto master server client

이 명령은 client 브랜치를 Checkout하고 server와 client의 공통조상 이후의 패치를 만들어 master에 적용한다. 조금 복잡하긴 해도 꽤 쓸모 있다. 그림 3-32를 보자.


![](http://git-scm.com/figures/18333fig0332-tn.png)

그림 3-32. 다른 토픽 브랜치에서 갈라져 나온 토픽 브랜치를 Rebase하기

이제 master 브랜치로 돌아가서 Fast-forward 시킬 수 있다:

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)

그림 3-33. master 브랜치를 client 브랜치 위치로 진행 시키기

server 브랜치의 일이 다 끝나면 `git rebase [basebranch] [topicbranch]`라는 명령으로 Checkout하지 않고 바로 server 브랜치를 master 브랜치로 rebase할 수 있다. 이 명령은 토픽(server) 브랜치를 Checkout하고 베이스(master) 브랜치에 Rebase한다:

	$ git rebase master server

server 브랜치의 수정사항을 master 브랜치에 적용했다. 그 결과는 그림 3-34와 같다.


![](http://git-scm.com/figures/18333fig0334-tn.png)

그림 3-34. master 브랜치에 server 브랜치의 수정 사항을 적용

그리고 나서 master 브랜치를 Fast-forward 시킨다:

	$ git checkout master
	$ git merge server

모든 것이 master 브랜치에 통합됐기 때문에 더 필요하지 않다면 client나 server 브랜치는 삭제해도 된다. 브랜치를 삭제해도 커밋 히스토리는 그림 3-35와 같이 여전히 남아 있다:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)

그림 3-35. 최종 커밋 히스토리

## Rebase의 위험성

Rebase가 장점이 많은 기능이지만 단점이 없는 것은 아니니 조심해야 한다. 그 주의사항은 다음 한 문장으로 표현할 수 있다:

**이미 공개 저장소에 Push한 커밋을 Rebase하지 마라**

이 지침만 지키면 Rebase를 하는 데 문제 될 게 없다. 하지만, 이 주의사항을 지키지 않으면 사람들에게 욕을 먹을 것이다(역주 - 아마도 가카의 호연지기가 필요해질 것이다).

Rebase는 기존의 커밋을 그대로 사용하는 것이 아니라 내용은 같지만 다른 커밋을 새로 만든다. 새 커밋을 서버에 Push하고 동료 중 누군가가 그 커밋을 Pull해서 작업을 한다고 하자. 그런데 그 커밋을 `git rebase`로 바꿔서 Push해버리면 동료가 다시 Push했을 때 동료는 다시 Merge해야 한다. 그리고 동료가 다시 Merge한 내용을 Pull하면 내 코드는 정말 엉망이 된다.

이미 공개 저장소에 Push한 커밋을 Rebase하면 어떤 결과가 초래되는지 예제를 통해 알아보자. 중앙 저장소에서 Clone하고 일부 수정을 하면 커밋 히스토리는 그림 3-36과 같아 진다.


![](http://git-scm.com/figures/18333fig0336-tn.png)

그림 3-36. 저장소를 Clone하고 일부 수정함

이제 팀원 중 누군가 커밋, Merge하고 나서 서버에 Push 한다. 이 리모트 브랜치를 Fetch, Merge하면 그림 3-37과 같이 된다.


![](http://git-scm.com/figures/18333fig0337-tn.png)

그림 3-37. Fetch한 후 Merge함

그런데 Push했던 팀원은 Merge한 일을 되돌리고 다시 Rebase한다. 서버의 히스토리를 새로 덮어씌우려면 `git push --force` 명령을 사용해야 한다. 이후에 저장소에서 Fetch하고 나면 아래 그림과 같은 상태가 된다:


![](http://git-scm.com/figures/18333fig0338-tn.png)

그림 3-38. 한 팀원이 다른 팀원이 의존하는 커밋을 없애고 Rebase한 커밋을 다시 Push함

기존 커밋이 사라졌기 때문에 이미 처리한 일이라고 해도 다시 Merge해야 한다. Rebase는 커밋의 SHA-1 해시를 바꾸기 때문에 Git은 새로운 커밋으로 생각한다. 사실 C4는 이미 히스토리에 적용되어 있지만, Git은 모른다.


![](http://git-scm.com/figures/18333fig0339-tn.png)

그림 3-39. 같은 Merge를 다시 한다

다른 개발자와 계속 같이 일하려면 이런 Merge도 해야만 한다. Merge하면 C4와 C4' 커밋 둘 다 히스토리에 남게 된다. 실제 내용과 메시지가 같지만 SHA-1 해시 값이 전혀 다르다. `git log`로 히스토리를 확인해보면 저자, 커밋 날짜, 메시지가 같은 커밋이 두 개 있을 것이다. 이렇게 되면 혼란스럽다. 게다가 이 히스토리를 서버에 Push하면 같은 커밋이 두 개 있기 때문에 다른 사람들도 혼란스러워한다.

Push하기 전에 정리하려고 Rebase하는 것은 괜찮다. 또 절대 공개하지 않고 혼자 Rebase하는 경우도 괜찮다. 하지만, 이미 공개하여 사람들이 사용하는 커밋을 Rebase하면 틀림없이 문제가 생길 것이다.
