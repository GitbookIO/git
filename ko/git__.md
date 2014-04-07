# Git 최초 설정

Git을 설치하고 나면 Git의 사용 환경을 적절하게 설정해 주어야 한다. 한 번만 설정하면 된다. 설정한 내용은 Git을 업그레이드해도 유지된다. 언제든지 다시 바꿀 수 있는 명령어가 있다.

'git config'라는 도구로 설정 내용을 확인하고 변경할 수 있다. Git은 이 설정에 따라 동작한다. 이때 사용하는 설정 파일은 세 가지나 된다.

* `/etc/gitconfig` 파일: 시스템의 모든 사용자와 모든 저장소에 적용되는 설정이다. `git config --system` 옵션으로 이 파일을 읽고 쓸 수 있다.
* `~/.gitconfig` 파일: 특정 사용자에게만 적용되는 설정이다. `git config --global` 옵션으로 이 파일을 읽고 쓸 수 있다.
* `.git/config`: 이 파일은 Git 디렉토리에 있고 특정 저장소(혹은 현재 작업 중인 프로젝트)에만 적용된다. 각 설정은 역순으로 우선시 된다. 그래서 `.git/config`가 `/etc/gitconfig`보다 우선한다.

윈도용 Git은 `$HOME` 디렉토리(`%USERPROFILE%` 환경변수)에 있는 `.gitconfig` 파일을 찾는다. 보통 `C:\Documents and Settings\$USER` 또는 `C:\Users\$USER` 이다(윈도우에서는 `$USER` 대신 `%USERNAME%`를 사용한다). 그리고 msysGit도 /etc/gitconfig를 가지고 있다. 경로는 MSys 루트에 따른 상대 경로다. 인스톨러로 msysGit을 설치할 때 설치 경로를 선택할 수 있다.

## 사용자 정보

Git을 설치하고 나서 가장 먼저 해야 하는 것은 사용자 이름과 이메일 주소를 설정하는 것이다. Git은 커밋할 때마다 이 정보를 사용한다. 한 번 커밋한 후에는 정보를 변경할 수 없다:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

다시 말하자면 `--global` 옵션으로 설정한 것은 딱 한 번만 하면 된다. 해당 시스템에서 해당 사용자가 사용할 때에는 이 정보를 사용한다. 만약 프로젝트마다 다른 이름과 이메일 주소를 사용하고 싶으면 `--global` 옵션을 빼고 명령을 실행한다.

## 편집기

사용자 정보를 설정하고 나면 Git에서 사용할 텍스트 편집기를 고른다. 기본적으로 Git은 시스템의 기본 편집기를 사용하고 보통 Vi나 Vim이다. 하지만, Emacs 같은 다른 텍스트 편집기를 사용할 수 있고 아래와 같이 실행하면 된다:

	$ git config --global core.editor emacs

## Diff 도구

Merge 충돌을 해결하기 위해 사용하는 Diff 도구를 설정할 수 있다. vimdiff를 사용하고 싶으면 아래와 같이 실행한다:

	$ git config --global merge.tool vimdiff

이렇게 kdiff3, tkdiff, meld, xxdif, emerge, vimdiff, gvimdiff, ecmerge, opendiff를 사용할 수 있다. 물론 다른 도구도 사용할 수 있다. 자세한 내용은 *7장*에서 다룬다.

## 설정 확인

`git config --list` 명령을 실행하면 설정한 모든 것을 보여준다:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Git은 같은 키를 여러 파일(`/etc/gitconfig`와 `~/.gitconfig` 같은)에서 읽기 때문에 같은 키가 여러개 있을 수도 있다. 이러면 Git은 나중 값을 사용한다.

`git config {key}` 명령으로 Git이 특정 Key에 대해 어떤 값을 사용하는지 확인할 수 있다:

	$ git config user.name
	Scott Chacon
