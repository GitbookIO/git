# Stashing

당신이 어떤 프로젝트에서 한 부분을 담당하고 있다고 하자. 그리고 여기에서 뭔가 작업하던 일이 있고 다른 요청이 들어와서 잠시 브랜치를 변경해야 할 일이 생겼다고 치자. 아직 완료하지 않은 일을 커밋하는 것은 좀 껄끄럽다. 이런 상황에서는 커밋하지 않고 나중에 다시 돌아와서 작업을 다시 하고 싶을 것이다. 이 문제는 `git stash`라는 명령으로 해결할 수 있다.

Stash 명령을 사용하면 워킹 디렉토리에서 수정한 파일만 저장한다. Stash는 Modified이면서 Tracked 상태인 파일과 Staging Area에 있는 파일들을 보관해두는 장소다. 아직 끝나지 않은 수정사항을 스택에 잠시 저장했다가 나중에 다시 적용할 수 있다.

## 하던 일을 Stash하기

예제 프로젝트를 하나 살펴보자. 파일을 두 개 수정하고 그 중 하나는 Staging Area에 추가한다. 그리고 `git status` 명령을 실행하면 아래와 같은 결과를 볼 수 있다:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

이제 브랜치를 변경한다. 아직 작업 중인 파일은 커밋할 게 아니라서 모두 Stash한다. `git stash`를 실행하면 스택에 새로운 Stash가 만들어진다:

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

대신 워킹 디렉토리는 깨끗해졌다:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

이제 아무 브랜치나 골라서 바꿀 수 있다. 수정하던 것은 스택에 저장했다. 아래와 같이 `git stash list`를 사용하여 저장한 Stash를 확인한다:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

Stash 두 개는 원래 있었던 것이다. 그래서 현재 총 세 개의 Stash를 사용할 수 있다. 이제 `git stash apply`를 사용하여 Stash를 적용할 수 있다. `git stash` 명령을 실행하면 이 명령에 대한 도움말을 보여주기 때문에 편리하다. 다른 Stash를 고르고 싶으면 Stash 이름을 입력해야 한다. 이름이 없으면 Git은 가장 최근의 Stash를 적용한다:

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

Git은 Stash에 저장할 때 수정하던 파일을 복원해준다. 복원할 때의 워킹 디렉토리는 Stash할 때의 그 브랜치이고 워킹 디렉토리도 깨끗한 상태였다. 하지만, 꼭 깨끗한 워킹 디렉토리나 Stash할 때와 같은 브랜치에 적용해야 하는 것은 아니다. 어떤 브랜치에서 Stash하고 다른 브랜치로 옮기고서 거기에 Stash를 복원할 수 있다. 그리고 꼭 워킹 디렉토리가 깨끗한 상태일 필요도 없다. 워킹 디렉토리에 수정하고 커밋하지 않은 파일들이 있을 때에도 Stash를 적용할 수 있다. 만약 충돌이 나면 알려준다.

Git은 Stash를 적용할 때 Staged 상태였던 파일을 자동으로 다시 Staged 상태로 만들어 주지 않는다. 그래서 `git stash apply` 명령을 실행할 때 `--index` 옵션을 주어야 Staged 상태까지 복원한다. 그럼 원래 작업하던 상태로 돌아올 수 있다:

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

`apply` 옵션은 단순히 Stash를 적용하는 것뿐이다. Stash는 여전히 스택에 남아 있다. `git stash drop` 명령을 사용하여 해당 Stash를 제거한다:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

그리고 `git stash pop`이라는 명령도 있는데 이 명령은 Stash를 적용하고 나서 바로 스택에서 제거해준다.

## Stash 되돌리기

Stash를 적용하고 나서 아차 싶을 때에는 다시 되돌려 놓아야 한다. Git은 `stash unapply` 같은 명령을 제공하지는 않는다. 하지만, Stash를 이용해서 패치를 만들고 그것을 거꾸로 적용할 수 있다:

	$ git stash show -p stash@{0} | git apply -R

Stash를 명시하지 않으면 Git은 가장 최근의 Stash를 사용한다:

	$ git stash show -p | git apply -R

`stash-unapply`라는 alias를 만들고 편리하게 할 수도 있다:

	$ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
	$ git stash
	$ #... work work work
	$ git stash-unapply

## Stash를 적용한 브랜치 만들기

보통 Stash에 저장하면 한동안 그대로 유지하고 그 브랜치에서는 계속 새로운 일을 한다. 그러면 저장한 Stash를 적용하는 것이 문제가 될 수 있다. 수정한 파일에 Stash를 적용하면 충돌이 날 수 있다. 충돌이 나면 충돌을 해결해야 한다. 그리고 Stash한 것은 다시 테스트해야 한다. `git stash branch` 명령을 실행하면 Stash할 당시의 커밋을 Checkout한 후 새로운 브랜치를 만들고 여기에 적용한다. 이 모든 것이 성공하면 Stash를 삭제한다:

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

이 명령은 브랜치를 새로 만들고 Stash를 복원해주는 매우 편리한 도구다.
