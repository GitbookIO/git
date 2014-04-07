# Git으로 버그 찾기

Git은 굉장히 유연해서 어떤 프로젝트에나 사용할 수 있다. 게다가 문제를 일으킨 범인이나 버그도 쉽게 찾을 수 있도록 도와준다.

## 파일 어노테이션

버그를 찾을 때 먼저 그 코드가 왜, 언제 추가했는지 알고 싶을 것이다. 이때는 파일 어노테이션을 활용한다. 한줄한줄 마지막으로 커밋한 사람이 누구인지, 언제 마지막으로 커밋했는지 볼 수 있다. 어떤 메소드에 버그가 있으면 `git blame` 명령으로 그 메소드의 각 줄을 누가 언제 마지막으로 고쳤는지 찾아낼 수 있다:

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

첫 항목은 그 줄을 마지막에 수정한 커밋의 SHA-1 값이다. 그다음 두 항목은 누가, 언제 그 줄을 커밋했는지 보여준다. 그래서 누가, 언제 커밋했는지 쉽게 찾을 수 있다. 그 뒤에 파일의 줄 번호와 내용을 보여준다. 그리고 `^4832fe2` 커밋이 궁금할 텐데 이 표시가 붙어 있으면 해당 줄이 처음 커밋한 것을 의미한다. 그러니까 해당 줄은 `4832fe2`에서 커밋된 후 변경된 적이 없다. 지금까지 커밋을 수정하는 것을 배우면서 `^`을 적어도 세 곳에서 사용한다고 배웠기 때문에 약간 헷갈릴 수 있으니 혼동하지 말자.

Git은 파일 이름을 변경한 이력을 별도로 기록해두지 않는다. 하지만, 원래 이 정보들은 각 스냅샷에 저장되고 이 정보를 이용하여 변경 이력을 만들어 낼 수 있다. 그러니까 파일에 생긴 변화는 무엇이든지 알아낼 수 있다. Git은 파일 어노테이션을 분석하여 코드들이 원래 어떤 파일에서 커밋된 것인지 찾아준다. 예를 들어보자. `GITServerHandler.m`을 여러 개의 파일로 리팩토링했는데 그 중 한 파일이 `GITPackUpload.m`이라는 파일이라고 하자. `-C` 옵션으로 `GITPackUpload.m` 파일을 추적해보면 각 코드가 원래 어떤 파일로 커밋된 것인지 알 수 있다:

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

언제나 코드가 커밋될 당시의 파일이름을 알 수 있기 때문에 코드를 어떻게 리팩토링해도 추적할 수 있다. 그리고 어떤 파일에 적용해봐도 각 줄을 커밋할 당시의 파일이름을 알 수 있다. 버그를 찾을 때 정말 유용하다.

## 이진 탐색

파일 어노테이션은 특정 이슈와 관련된 커밋을 찾는 데에도 좋다. 문제가 생겼을 때 의심스러운 커밋이 수십, 수백 개에 이르면 도대체 어디서부터 시작해야 할지 모를 수 있다. 이때는 `git bisect` 명령이 유용하다. `bisect` 명령은 커밋 히스토리를 이진 탐색 방법으로 좁혀 주기 때문에 이슈와 관련된 커밋을 최대한 빠르게 찾아낼 수 있도록 도와준다.

코드를 운용 환경에 배포하고 난 후에 개발할 때 발견하지 못한 버그가 있다고 보고받았다. 그런데 왜 그런 현상이 발생하는지 아직 이해하지 못하는 상황을 가정해보자. 해당 이슈를 다시 만들고 작업하기 시작했는데 뭐가 잘못됐는지 알아낼 수 없다. 이럴 때 bisect를 사용하여 코드를 뒤져 보는 게 좋다. 먼저 `git bisect start` 명령으로 이진 탐색을 시작하고 `git bisect bad`를 실행하여 현재 커밋에 문제가 있다고 표시를 남기고 나서 문제가 없는 마지막 커밋을 `git bisect good [good_commit]` 명령으로 표시한다.

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

이 예제에서 마지막으로 괜찮았던 커밋(v1.0)과 현재 문제가 있는 커밋 사이에 있는 커밋은 전부 12개이고 Git은 그 중간에 있는 커밋을 Checkout해준다. 여기에서 해당 이슈가 구현됐는지 테스트해보고 만약 이슈가 있으면 그 중간 커밋 이전으로 범위를 좁히고 이슈가 없으면 그 중간 커밋 이후로 범위를 좁힌다. 이슈를 발견하지 못했으면 `git bisect good`으로 이슈가 아직 없음을 알리고 계속 진행한다:

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

현재 문제가 있는 커밋과 지금 테스트한 커밋 사이에서 중간에 있는 커밋이 Checkout됐다. 다시 테스트해보고 이슈가 있으면 `git bisect bad`로 이슈가 있다고 알린다:

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

이제 이슈를 처음 구현한 커밋을 찾았다. 이 SHA-1 값을 포함한 이 커밋의 정보를 확인하고 수정된 파일이 무엇인지 확인한다. 이 문제가 발생한 시점에 도대체 무슨 일이 있었는지 아래와 같이 살펴본다:

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

이제 찾았으니까 `git bisect reset` 명령을 실행시켜서 이진 탐색을 시작하기 전으로 HEAD를 돌려놓는다:

	$ git bisect reset

수백 개의 커밋들 중에서 버그가 만들어진 커밋을 찾는 데 몇 분밖에 걸리지 않는다. 프로젝트가 정상적으로 수행되면 0을 반환하고 문제가 있을 경우 1을 반환하는 스크립트를 만들면 이 `git bisect` 과정을 완전히 자동화 할 수 있다. 먼저 `bisect start` 명령으로 bisect를 사용할 범위를 알려준다. 위에서 한 것처럼 문제가 있다고 아는 커밋과 문제가 없다고 아는 커밋을 넘기면 된다:

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

문제가 생긴 첫 커밋을 찾을 때까지 Checkout할 때마다 `test-error.sh`를 실행한다. `make`든지 `make tests`든지 어쨌든 이슈를 찾는 테스트를 실행하여 찾는다.
