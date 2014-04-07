# Git Attribute

디렉토리와 파일 단위로 다른 설정을 적용할 수도 있다. 이렇게 경로별로 설정하는 것을 'Git Attribute'라고 부른다. 이 설정은 `.gitattributes`라는 파일에 저장하고 아무 디렉토리에나 둘 수 있지만, 보통은 프로젝트 최상위 디렉토리에 둔다. 그리고 이 파일을 커밋하고 싶지 않으면 `.gitattributes`가 아니라 `.git/info/attributes`로 파일을 만든다.

이 Attribute로 Merge는 어떻게 할지, 텍스트가 아닌 파일은 어떻게 Diff할지, checkin/checkout할 때 어떻게 필터링할지 정해줄 수 있다. 이 절에서는 설정할 수 있는 Attribute가 어떤 것이 있는지, 그리고 어떻게 설정하는지 배우고 예제를 살펴본다.

## 바이너리 파일

이 Attribute로 어떤 파일이 바이너리 파일인지 Git에게 알려줄 수 있다. 기본적으로 Git은 어떤 파일이 바이너리 파일인지 알지 못한다. 하지만, Git에는 파일을 어떻게 다뤄야 하는지 알려주는 방법이 있다. 텍스트 파일 중에서 프로그램이 생성하는 파일에는 바이너리 파일과 진배없는 파일이 있다. 이런 파일은 diff할 수 없으니 바이너리 파일이라고 알려줘야 한다. 반대로 바이너리 파일 중에서 취급 방법을 Git에 알려주면 diff할 수 있는 파일도 있다.

### 바이너리 파일이라고 알려주기

사실 텍스트 파일이지만 만든 목적과 의도를 보면 바이너리 파일인 것이 있다. 예를 들어 Mac의 Xcode는 `.pbxproj` 파일을 만든다. 이 파일은 IDE 설정 등을 디스크에 저장하는 파일로 JSON 포맷이다. 모든 것이 ASCII인 텍스트 파일이지만 실제로는 간단한 데이터베이스이기 때문에 텍스트 파일처럼 취급할 수 없다. 그래서 여러 명이 이 파일을 동시에 수정하고 Merge할 때 diff가 도움이 안 된다. 이 파일은 프로그램이 읽고 쓰는 파일이기 때문에 바이너리 파일처럼 취급하는 것이 옳다.

모든 `pbxproj` 파일을 바이너리로 파일로 취급하는 설정은 아래와 같다. `.gitattributes` 파일에 넣으면 된다:

	*.pbxproj -crlf -diff

이제 `pbxproj` 파일은 CRLF 변환이 적용되지 않는다. `git show`나 `git diff` 같은 명령을 실행할 때에도 통계를 계산하거나 diff를 출력하지 않는다. Git 1.6부터는 `-crlf -diff`를 한 마디로 줄여서 표현할 수 있다:

	*.pbxproj binary

### 바이너리 파일 Diff하기

Git은 바이너리 파일도 diff할 수 있다. Git Attribute를 통해 Git이 바이너리 파일을 텍스트 포맷으로 변환하고 그 결과를 diff로 비교하도록 하는 것이다. 그래서 문제는 어떻게 *바이너리*를 텍스트로 변환해야 할까에 있다. 바이너리를 텍스트로 변환해 주는 도구 중에서 내가 필요한 바이너리 파일에 꼭 맞는 도구를 찾는게 가장 좋다. 사람이 읽을 수 있는 텍스트로 표현된 바이너리 포맷은 극히 드물다(오디오 데이터를 텍스트로 변환한다고 생각해보라). 파일 내용을 텍스트로 변환할 방법을 찾지 못했을 때는 파일의 설명이나 메타데이터를 텍스트로 변환하는 방법을 찾아보자. 이런 방법이 가능한 경우가 많다. 메타데이터는 파일 내용을 완벽하게 알려주지 않지만 전혀 비교하지 못하는 것보다 이렇게라도 하는 게 훨씬 낫다.

여기서 설명한 두 가지 방법을 많이 사용하는 바이너리 파일에 적용해 볼 거다.

댓글: 전용 변환기는 없지만 텍스트가 들어 있는 바이너리 포맷들이 있다. 이런 포맷은 `strings` 프로그램으로 바이너리 파일에서 텍스트를 추출한다. 이런 종류의 바이너리 파일 중에서 UTF-16 인코딩이나 다른 "codepages"로 된 파일들도 있다. 그런 인코딩으로 된 파일에서 `strings`으로 추출할 수 있는 텍스트는 제한적이다. 상황에 따라 다르게 추출된다. 그래도 `strings`는 Mac과 Linux 시스템에서 쉽게 사용할 수 있기 때문에 다양한 바이너리 파일에 쉽게 적용할 수 있다.

#### MS Word 파일

먼저 이 기술을 인류에게 알려진 가장 귀찮은 문제 중 하나인 Word 문서를 버전 관리하는 상황을 살펴보자. 모든 사람이 Word가 가장 끔찍한 편집기라고 말하지만 애석하게도 모두 Word를 사용한다. Git 저장소에 넣고 이따금 커밋하는 것만으로도 Word 문서의 버전을 관리할 수 있다. 그렇지만 `git diff`를 실행하면 다음과 같은 메시지를 볼 수 있을 뿐이다:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index 88839c4..4afcb7c 100644
	Binary files a/chapter1.doc and b/chapter1.doc differ

직접 파일을 하나하나 까보지 않으면 두 버전이 뭐가 다른지 알 수 없다. Git Attribute를 사용하면 이를 더 좋게 개선할 수 있다. `.gitattributes` 파일에 아래와 같은 내용을 추가한다:

	*.doc diff=word

이것은 `*.doc` 파일의 두 버전이 무엇이 다른지 diff할 때 "word" 필터를 사용하라고 설정하는 것이다. 그럼 "word" 필터는 뭘까? 이 "word" 필터도 정의해야 한다. Word 문서에서 사람이 읽을 수 있는 텍스트를 추출해주는 `catdoc` 프로그램을 "word" 필터로 사용한다. 그러면 Word 문서를 diff할 수 있다. (catdoc 프로그램은 MS Word 문서에 특화된 텍스트 추출기다. `http://www.wagner.pp.ru/~vitus/software/catdoc/`에서 구할 수 있다):

	$ git config diff.word.textconv catdoc

위의 명령은 아래와 같은 내용을 `.git/config` 파일에 추가한다:

	[diff "word"]
	    textconv = catdoc

이제 Git은 확장자가 `.doc`인 파일의 스냅샷을 diff할 때 "word" 필터로 정의한 `catdoc` 프로그램을 사용한다. 이 프로그램은 Word 파일을 텍스트 파일로 변환해 주기 때문에 diff할 수 있다.

이 책의 *1장*을 Word 파일로 만들어서 Git에 넣고 나서 단락 하나를 수정하고 저장하는 예를 살펴보자. `git diff`를 실행하면 어디가 달려졌는지 확인할 수 있다:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index c1c8a0a..b93c9e4 100644
	--- a/chapter1.doc
	+++ b/chapter1.doc
	@@ -128,7 +128,7 @@ and data size)
	 Since its birth in 2005, Git has evolved and matured to be easy to use
	 and yet retain these initial qualities. It’s incredibly fast, it’s
	 very efficient with large projects, and it has an incredible branching
	-system for non-linear development.
	+system for non-linear development (See Chapter 3).

Git은 "(See Chapter 3)"가 추가됐다는 것을 정확하게 찾아 준다.

#### OpenDocument 파일

MS Word(`*.doc`) 파일에 사용한 방법은 OpenOffice.org(혹은 LibreOffice.org) 파일 형식인 OpenDocument(`*.odt`) 파일에도 적용할 수 있다.

아래의 내용을 `.gitattributes` 파일에 추가한다:

	*.odt diff=odt

`.git/config` 파일에 `odt` diff 필터를 설정한다:

	[diff "odt"]
	    binary = true
	    textconv = /usr/local/bin/odt-to-txt

OpenDocument 파일은 사실 여러 파일(XML, 스타일, 이미지 등등)을 Zip으로 압축한 형식이다. OpenDocument 파일에서 텍스트만 추출하는 스크립트를 하나 작성한다. 아래와 같은 내용을 `/usr/local/bin/odt-to-txt` 파일로(다른 위치에 저장해도 상관없다) 저장한다:

	#! /usr/bin/env perl
	# Simplistic OpenDocument Text (.odt) to plain text converter.
	# Author: Philipp Kempgen

	if (! defined($ARGV[0])) {
	    print STDERR "No filename given!\n";
	    print STDERR "Usage: $0 filename\n";
	    exit 1;
	}

	my $content = '';
	open my $fh, '-|', 'unzip', '-qq', '-p', $ARGV[0], 'content.xml' or die $!;
	{
	    local $/ = undef;  # slurp mode
	    $content = <$fh>;
	}
	close $fh;
	$_ = $content;
	s/<text:span\b[^>]*>//g;           # remove spans
	s/<text:h\b[^>]*>/\n\n*****  /g;   # headers
	s/<text:list-item\b[^>]*>\s*<text:p\b[^>]*>/\n    --  /g;  # list items
	s/<text:list\b[^>]*>/\n\n/g;       # lists
	s/<text:p\b[^>]*>/\n  /g;          # paragraphs
	s/<[^>]+>//g;                      # remove all XML tags
	s/\n{2,}/\n\n/g;                   # remove multiple blank lines
	s/\A\n+//;                         # remove leading blank lines
	print "\n", $_, "\n\n";

그리고 실행 가능하도록 만든다:

	chmod +x /usr/local/bin/odt-to-txt

이제 `git diff` 명령으로 `.odt` 파일에 대한 변화를 살펴볼 수 있다.

#### 이미지 파일

이 방법으로 이미지 파일도 diff할 수 있다. 필터로 EXIF 정보를 추출해서 PNG 파일을 비교한다. EXIF 정보는 대부분의 이미지 파일에 들어 있는 메타데이터다. `exiftool`이라는 프로그램을 설치하고 이미지 파일에서 메타데이터 텍스트를 추출한다. 그리고 그 결과를 diff해서 무엇이 달라졌는지 본다:

	$ echo '*.pngdiff=exif' >> .gitattributes
	$ git config diff.exif.textconv exiftool

프로젝트에 들어 있는 이미지 파일을 변경하고 `git diff`를 실행하면 아래와 같이 보여준다:

	diff --git a/image.pngb/image.png
	index 88839c4..4afcb7c 100644
	--- a/image.png
	+++ b/image.png
	@@ -1,12 +1,12 @@
	 ExifTool Version Number         : 7.74
	-File Size                       : 70 kB
	-File Modification Date/Time     : 2009:04:17 10:12:35-07:00
	+File Size                       : 94 kB
	+File Modification Date/Time     : 2009:04:21 07:02:43-07:00
	 File Type                       : PNG
	 MIME Type                       : image/png
	-Image Width                     : 1058
	-Image Height                    : 889
	+Image Width                     : 1056
	+Image Height                    : 827
	 Bit Depth                       : 8
	 Color Type                      : RGB with Alpha

이미지 파일의 크기와 해상도가 달라진 것을 쉽게 알 수 있다:

## 키워드 치환

SVN이나 CVS에 익숙한 사람들은 해당 시스템에서 사용하던 키워드 치환(Keyword Expansion) 기능을 찾는다. Git에서는 이것이 쉽지 않다. Git은 먼저 체크섬을 계산하고 커밋하기 때문에 그 커밋에 대한 정보를 가지고 파일을 수정할 수 없다. 하지만, Checkout할 때 그 정보가 자동으로 파일에 삽입되도록 했다가 다시 커밋할 때 삭제되도록 할 수 있다.

파일 안에 `$Id$` 필드를 넣으면 Blob의 SHA-1 체크섬을 자동으로 삽입한다. 이 필드를 파일에 넣으면 Git은 앞으로 Checkout할 때 해당 Blob의 SHA-1 값으로 교체한다. 여기서 꼭 기억해야 할 것이 있다. 교체되는 체크섬은 커밋의 것이 아니라 Blob 그 자체의 SHA-1 체크섬이다:

	$ echo '*.txt ident' >> .gitattributes
	$ echo '$Id$' > test.txt

Git은 이 파일을 Checkout할 때마다 SHA 값을 삽입해준다:

	$ rm test.txt
	$ git checkout -- test.txt
	$ cat test.txt
	$Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $

하지만 이것은 별로 유용하지 않다. CVS나 SVN의 키워드 치환(Keyword Substitution)을 써봤으면 날짜(Datestamp)도 가능했다는 것을 알고 있을 것이다. SHA는 그냥 해시이고 식별할 수 있을 뿐이지 다른 것을 알려주진 않는다. SHA만으로는 예전 것보다 새 것인지 오래된 것인지는 알 수 없다.

Commit/Checkout할 때 사용하는 필터를 직접 만들어 쓸 수 있다. 방향에 따라 "clean" 필터와 "smudge" 필터라고 부른다. ".gitattributes" 파일에 설정하고 파일 경로마다 다른 필터를 설정할 수 있다. Checkout할 때 파일을 처리하는 것이 "smudge" 필터이고(그림 7-2) 커밋할 때 처리하는 필터가 "clean" 필터이다. 이 필터로 할 수 있는 일은 무궁무진하다.


![](http://git-scm.com/figures/18333fig0702-tn.png)

그림 7-2. "smudge" 필터는 Checkout할 때 실행된다


![](http://git-scm.com/figures/18333fig0703-tn.png)

그림 7-3. "clean" 필터는 파일을 Stage할 때 실행된다

커밋하기 전에 `indent` 프로그램으로 C 코드 전부를 필터링하지만 커밋 메시지는 단순한 예제를 보자. `*.c` 파일은 indent 필터를 사용하도록 `.gitattributes` 파일에 설정한다:

	*.c     filter=indent

아래처럼 "indent" 필터의 smudge와 clean이 무엇인지 설정한다:

	$ git config --global filter.indent.clean indent
	$ git config --global filter.indent.smudge cat

`*.c` 파일을 커밋하면 `indent` 프로그램을 통해서 커밋되고 Checkout하면 `cat` 프로그램을 통해 Checkout된다. `cat`은 입력된 데이터를 그대로 다시 내보내는, 사실 아무것도 안 하는 프로그램이다. 이렇게 설정하면 모든 C 소스 파일은 `indent` 프로그램을 통해 커밋된다.

이제 RCS 처럼 `$Date$`를 치환하는 예제을 살펴보자. 이것를 하려면 간단한 스크립트가 하나 필요하다. 이 스크립트는 `$Date$` 필드를 프로젝트의 마지막 커밋 일자로 치환한다. 표준 입력을 읽어서 `$Date$` 필드를 치환한다. 아래는 Ruby로 구현한 스크립트다:

	#! /usr/bin/env ruby
	data = STDIN.read
	last_date = `git log --pretty=format:"%ad" -1`
	puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')

`git log` 명령으로 마지막 커밋 정보를 얻고 표준 입력(STDIN)에서 `$Date$` 스트링을 찾아서 치환한다. 스크립트는 자신이 편한 언어로 만든다. 이 스크립트의 이름을 `expand_date`라고 짓고 실행 경로에 넣는다. 그리고 `dater`라는 Git 필터를 정의한다. Checkout시 실행하는 smudge 필터로 `expand_date`를 사용하고 커밋할 때 실행하는 clean 필터는 Perl을 사용한다:

	$ git config filter.dater.smudge expand_date
	$ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'

이 Perl 코드는 `$Date$` 스트링에 있는 문자를 제거해서 원래대로 복원한다. 이제 필터가 준비됐으니 `$Date$` 키워드가 들어 있는 파일을 만들고 Git Attribute를 설정한다. 새 필터를 시험해보자:

	$ echo '# $Date$' > date_test.txt
	$ echo 'date*.txt filter=dater' >> .gitattributes

커밋하고 파일을 다시 Checkout 하면 해당 키워드가 적절히 치환된 것을 볼 수 있다:

	$ git add date_test.txt .gitattributes
	$ git commit -m "Testing date expansion in Git"
	$ rm date_test.txt
	$ git checkout date_test.txt
	$ cat date_test.txt
	# $Date: Tue Apr 21 07:26:52 2009 -0700$

이것은 매우 강력해서 두루두루 사용할 수 있다. `.gitattributes` 파일은 커밋하는 파일이기 때문에 드라이버(여기서는 `dater`)가 없는 사람에게도 배포된다. 그리고 `dater`가 없으면 에러가 난다. 필터를 만들 때 이런 예외 상황도 고려해서 항상 잘 동작하게 해야 한다.

## 저장소 익스포트하기

프로젝트를 익스포트해서 아카이브를 만들 때에도 Git Attribute가 유용하다.

### export-ignore

아카이브를 만들 때 제외할 파일이나 디렉토리가 무엇인지 설정할 수 있다. 특정 디렉토리나 파일을 프로젝트에는 포함하고 아카이브에는 포함하고 싶지 않을 때 `export-ignore` Attribute를 사용한다.

예를 들어 `test/` 디렉토리에 테스트 파일이 있다고 하자. 보통 tar 파일로 묶어서 익스포트할 때 테스트 파일은 포함하지 않는다. Git Attribute 파일에 다음 라인을 추가하면 테스트 파일은 무시된다:

	test/ export-ignore

`git archive` 명령으로 tar 파일을 만들면 test 디렉토리는 아카이브에 포함되지 않는다.

### export-subst

아카이브를 만들 때에도 키워드 치환을 할 수 있다. 파일을 하나 만들고 거기에 `$Format:$` 스트링을 넣으면 Git이 치환해준다. 이 스트링에 `--pretty=format` 옵션에 사용하는 것과 같은 포맷 코드를 넣을 수 있다. `--pretty=format`은 *2장*에서 배웠다. 예를 들어 `LAST_COMMIT`이라는 파일을 만들고 `git archive` 명령을 실행할 때 자동으로 이 파일에 마지막 커밋 날짜가 삽입되게 하려면 아래와 같이 해야 한다:

	$ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
	$ echo "LAST_COMMIT export-subst" >> .gitattributes
	$ git add LAST_COMMIT .gitattributes
	$ git commit -am 'adding LAST_COMMIT file for archives'

`git archive` 명령으로 아카이브를 만들고 나서 이 파일을 열어보면 아래와 같이 보인다:

	$ cat LAST_COMMIT
	Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$

## Merge 전략

파일마다 다른 Merge 전략을 사용하도록 설정할 수 있다. Merge할 때 충돌이 날 것 같은 파일이 있다고 하자. Git Attrbute로 이 파일만 항상 타인의 코드 말고 내 코드를 사용하도록 설정할 수 있다.

이 설정은 다양한 환경에서 운영하려고 만든 환경 브랜치를 Merge할 때 좋다. 이때는 환경 설정과 관련된 파일은 Merge하지 않고 무시하는 게 편리하다. 브랜치에 `database.xml`이라는 데이터베이스 설정파일이 있는데 이 파일은 브랜치마다 다르다. Database 설정 파일은 Merge하면 안된다. Attribute를 아래와 같이 설정하면 이 파일은 그냥 두고 Merge한다.

	database.xml merge=ours

이제 Merge해도 `database.xml` 파일은 충돌하지 않는다:

	$ git merge topic
	Auto-merging database.xml
	Merge made by recursive.

Merge했지만 `database.xml`은 원래 가지고 있던 파일 그대로다.
