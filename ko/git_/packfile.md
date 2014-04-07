# Packfile

테스트용 Git 저장소의 개체 데이터베이스를 다시 살펴보자. 지금 개체는 모두 11개로 Blob 4개, Tree 3개, 커밋 3개, 태그 1개가 있다:

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git은 zlib으로 파일 내용을 압축하기 때문에 저장 공간이 많이 필요하지 않다. 그래서 이 데이터베이스에 저장된 파일은 겨우 925바이트밖에 되지 않는다. 크기가 큰 파일을 추가해서 이 기능의 효과를 좀 더 살펴보자. 앞 장에서 사용했던 Grit 라이브러리에 들어 있는 repo.rb 파일을 추가한다. 이 파일의 크기는 약 12K이다.

	$ curl https://raw.github.com/mojombo/grit/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb
	$ git commit -m 'added repo.rb'
	[master 484a592] added repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

추가한 Tree 개체를 보면 repo.rb 파일의 SHA-1 값이 무엇인지 확인할 수 있다:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

개체의 크기는 아래와 같이 확인한다:

	$ du -b .git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	4102	.git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e

피일을 수정하면 어떻게 되는지 살펴보자:

	$ echo '# testing' >> repo.rb
	$ git commit -am 'modified repo a bit'
	[master ab1afef] modified repo a bit
	 1 files changed, 1 insertions(+), 0 deletions(-)

수정한 커밋의 Tree 개체를 확인하면 흥미로운 점을 발견할 수 있다:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

이 Blob 개체는 다른 개체다. 새 Blob 개체는 400줄 이후에 한 줄을 더 추가한 새 개체이다. Git은 완전히 새로운 Blob 개체를 만들어 저장한다:

	$ du -b .git/objects/05/408d195263d853f09dca71d55116663690c27c
	4109	.git/objects/05/408d195263d853f09dca71d55116663690c27c

그럼 약 4K짜리 파일을 두 개 가지게 된다. 거의 같은 파일을 두 개나 가지게 되는 것이 못마땅할 수도 있다. 처음 것과 두 번째 것 사이의 차이점만 저장할 수 없을까?

가능하다. Git이 처음 개체를 저장하는 형식은 Loose 개체 포멧이라고 부른다. 하지만 나중에 이 개체를 파일 하나로 압축(Pack)할 수 있다. 그래서 공간을 절약하고 효율을 높일 수 있다. Git이 이렇게 압축하는 때는 Loose 개체가 너무 많거나, `git gc` 명령을 실행했을 때, 그리고 리모트 서버로 Push할 때 압축한다. `git gc` 명령을 실행해서 어떻게 압축하는지 살펴보자:

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

`objects` 디렉토리를 열어보면 개체 대부분이 사라졌고 한 쌍의 파일이 새로 생겼다:

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

압축되지 않은 Blob 개체는 어떤 커밋도 가리키지 않는 개체다. 즉, "what is up, doc?"과 "test content" 예제에서 만들었던 개체이다. 어떤 커밋에도 추가돼 있지 않으면 이 개체는 `dangling` 개체로 취급되고 Packfile에 추가되지 않는다.

새로 생긴 파일은 Packfile과 그 Index이다. 파일 시스템에서 삭제된 개체가 전부 이 Packfile에 저장된다. Index 파일은 빠르게 찾을 수 있도록 Packfile의 오프셋이 들어 있다. `git gc` 명령을 실행하기 전에 있던 파일 크기는 약 8K 정도였었는데 새로 만들어진 Packfile은 겨우 4K에 불과하다. 짱이다. 개체를 압축하면 디스크 사용량은 절반으로 줄었다.

어떻게 이런 일이 가능할까? 개체를 압축하면 Git은 먼저 이름이나 크기가 비슷한 파일을 찾는다. 그리고 두 파일을 비교해서 한 파일은 다른 부분만 저장한다. Git이 얼마나 공간을 절약해 주는지 Packfile을 열어 확인할 수 있다. `git verify-pack` 명령어는 압축한 내용을 보여준다:

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

`9bc1d` Blob이 처음 추가한 `repo.rb` 파일인데, 이 Blob은 두 번째 버전인 `05408` Blob을 가리킨다. 개체에서 세 번째 컬럼은 압축된 개체의 크기를 나타낸다. `05408`의 크기는 12K지만 `9bc1d`는 7바이트밖에 안 된다. 특이한 점은 원본을 그대로 저장하는 것이 첫 번째가 아니라 두 번째 버전이라는 것이다. 첫 번째 버전은 차이점만 저장된다. 최신 버전에 접근할 때가 더 많고 그래서 속도가 더 빨라야 하기 때문에 이렇게 한다.

언제나 다시 압축할 수 있기 때문에 이 기능은 정말 판타스틱하다. Git은 자동으로 데이터베이스를 재압축해서 공간을 절약한다. 그리고 `git gc` 명령으로 직접 다시 압축할 수도 있다.
