# Gitの参照

すべての履歴をひと通り見るには `git log 1a410e` のように実行します。しかしそれでも履歴を辿りながらそれらすべてのオブジェクトを見つけるためには、`1a410e` が最後のコミットであることを覚えていなければなりません。SHA-1ハッシュ値を格納できるファイルが必要です。ファイル名はシンプルなもので、未加工（raw）の SHA-1ハッシュ値ではなくポインタを使用することができます。

Git では、これらは "参照（references）" ないしは "refs" と呼ばれます。SHA-1のハッシュ値を含んでいるファイルは `.git/refs` ディレクトリ内に見つけることができます。現在のプロジェクトでは、このディレクトリに何もファイルはありませんが、シンプルな構成を持っています。

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

最後のコミットはどこにあるのかを覚えるのに役立つような参照を新しく作るには、これと同じぐらいシンプルなことを技術的にすることができます。

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

これであなたは、Git コマンドにある SHA-1のハッシュ値ではなく、たった今作成したヘッダの参照を使用することができます。

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

参照ファイルに対して直接、変更を行うことは推奨されません。Git はそれを行うためのより安全なコマンドを提供しています。もし参照を更新したければ `update-ref` というコマンドを呼びます。

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

Git にとって基本的にブランチとは何なのかをこれは示しているのです。すなわちそれはシンプルなポインタ、もしくは作業ライン（line of work）のヘッドへの参照なのです。二回目のコミット時にバックアップのブランチを作るには、次のようにします。

	$ git update-ref refs/heads/test cac0ca

これでブランチはそのコミットから下の作業のみを含むことになります。

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

いま、Git のデータベースは概念的には図9-4のように見えます。


![](http://git-scm.com/figures/18333fig0904-tn.png)

図9-4. ブランチのヘッドへの参照を含むGitディレクトリオブジェクト

`git branch (ブランチ名)` のようにコマンドを実行すると基本的に Git は `update-ref` コマンドを実行します。そして、あなたが作りたいと思っている新しい参照は何であれ、いま自分が作業しているブランチ上のブランチの最後のコミットの SHA-1ハッシュを追加します。

## HEADブランチ

では、`git branch (ブランチ名)` を実行したときに、どこから Git は最後のコミットの SHA-1ハッシュを知ることができるでしょうか？ 答えは、HEADファイルです。HEADファイルは、あなたが現在作業中のブランチに対するシンボリック参照（symbolic reference）です。通常の参照と区別する意図でシンボリック参照と呼びますが、それは、一般的にSHA-1ハッシュ値を持たずに他の参照へのポインタを持ちます。通常は以下のファイルが見えるでしょう。

	$ cat .git/HEAD
	ref: refs/heads/master

`git checkout test` を実行すると、Git はこのようにファイルを更新します。

	$ cat .git/HEAD
	ref: refs/heads/test

`git commit` を実行すると、コミットオブジェクトが作られます。HEADにある参照先の SHA-1ハッシュ値が何であれ、そのコミットオブジェクトの親が参照先に指定されます。

このファイルを直に編集することもできますが、`symbolic-ref` と呼ばれる、それを安全に行うためのコマンドが存在します。このコマンドを使ってHEADの値を読み取ることができます。

	$ git symbolic-ref HEAD
	refs/heads/master

HEADの値を設定することもできます。

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD
	ref: refs/heads/test

`refs` の形式以外では、シンボリック参照を設定することはできません。

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## タグ

これまで Git の主要な三つのオブジェクトを見てきましたが、タグという四つ目のオブジェクトがあります。タグオブジェクトはコミットオブジェクトにとても似ています。それには、タガー（tagger）、日付、メッセージ、そしてポインタが含まれます。主な違いは、タグオブジェクトはツリーではなくコミットを指し示すことです。タグオブジェクトはブランチの参照に似ていますが、決して変動しません。そのため常に同じコミットを示しますが、より親しみのある名前が与えられます。

2章で述べましたが、タグには二つのタイプがあります。軽量 (lightweight) 版と注釈付き (annotated) 版です。あなたは、次のように実行して軽量 (lightweight) 版のタグを作ることができます。

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

これが軽量版のタグのすべてです。つまり決して変動しないブランチなのです。一方、注釈付き版のタグはもっと複雑です。注釈付き版のタグを作ろうとすると、Git はタグオブジェクトを作り、そして、コミットに対する直接的な参照ではなく、そのタグをポイントする参照を書き込みます。注釈付き版のタグを作ることで、これを見ることができます。（注釈付き版のタグを作るには `-a` オプションを指定して実行します）

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 -m 'test tag'

これで、作られたオブジェクトの SHA-1ハッシュ値を見ることができます。

	$ cat .git/refs/tags/v1.1
	9585191f37f7b0fb9444f35a9bf50de191beadc2

ここで、そのSHA-1ハッシュ値に対して `cat-file` コマンドを実行します。

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

オブジェクトエントリはあなたがタグ付けしたコミットの SHA-1 ハッシュ値をポイントすることに注意してください。またそれがコミットをポイントする必要がないことに注意してください。あらゆる Git オブジェクトに対してタグ付けをすることができます。例えば、Git のソースコードの保守では GPG 公開鍵をブロブオブジェクトとして追加して、それからタグ付けをします。Git ソースコードレポジトリで、以下のように実行することで公開鍵を閲覧することができます。

	$ git cat-file blob junio-gpg-pub

Linuxカーネルのリポジトリは、さらに、非コミットポインティング（non-commit-pointing）タグオブジェクトを持っています。このタグオブジェクトは、最初のタグが作られるとソースコードのインポートの最初のツリーをポイントします。

## リモート

これから見ていく三つ目の参照のタイプはリモート参照です。リモートを追加してそれにプッシュを実行すると、Git は追加したリモートにあなたが最後にプッシュした値をを格納します。そのリモートは `refs/remotes` ディレクトリにある各ブランチを参照します。例えば、`origin` と呼ばれるリモートを追加して、それを `master` ブランチにプッシュすることができます。

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

そして、`origin` リモートに対してどの `master` ブランチが最後にサーバと通信したのかを、`refs/remotes/origin/master` ファイルをチェックすることで知ることができます。

	$ cat .git/refs/remotes/origin/master
	ca82a6dff817ec66f44342007202690a93763949

リモート参照は主にそれらがチェックアウトされ得ないという点において、ブランチ（`refs/heads` への参照）とは異なります。Git はそれらをブックマークとして、それらのブランチがかつてサーバー上に存在していた場所の最後に知られている状態に移し変えます。
を呼ぶことで、ツリーがまだ存在しない場合に、自動的にインデックスの状態からツリーオブジェクトを作ります。

	$ git write-tree
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	$ git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	100644 blob 83baae61804e65cc73a7201a7252750c76066a30      test.txt

また、これがツリーオブジェクトであることを検証することができます。

	$ git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	tree

これから、二つ目のバージョンの test.txt に新しいファイルを加えて新しくツリーを作ります。

	$ echo 'new file' > new.txt
	$ git update-index test.txt
	$ git update-index --add new.txt

これでステージングエリアには、new.txt という新しいファイルに加えて、新しいバージョンの test.txt を持つようになります。（ステージングエリアまたはインデックスの状態を記録している）そのツリーを書き出してみると、以下のように見えます。

	$ git write-tree
	0155eb4229851634a0f03eb265b69f5a2d56f341
	$ git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

このツリーは両方のファイルエントリを持っていて、さらに、test.txt の SHA-1ハッシュは最初の文字（`1f7a7a`）から "バージョン2" の SHA-1ハッシュとなっていることに注意してください。ちょっと試しに、最初のツリーをサブディレクトリとしてこの中の1つに追加してみましょう。`read-tree` を呼ぶことで、ステージングエリアの中にツリーを読み込むことができます。このケースでは、`--prefix` オプションを付けて `read-tree` コマンド使用することで、ステージングエリアの中に既存のツリーを、サブツリーとして読み込むことができます。

	$ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	$ git write-tree
	3c4e9cd789d88d8d89c1073707c3585e41b0e614
	$ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
	040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

先ほど書き込んだ新しいツリーから作業ディレクトリを作っていれば、二つのファイルが作業ディレクトリのトップレベルに見つかり、また、最初のバージョンの test.txt ファイルが含まれている `bak` という名前のサブディレクトリが見つかります。これらの構造のために Git がデータをどのように含めているかは、図9-2のようにイメージすることができます。


![](http://git-scm.com/figures/18333fig0902-tn.png)

図9-2. 現在のGitデータのコンテンツ構造

## コミットオブジェクト

追跡（track）したいと思うプロジェクトの異なるスナップショットを特定するためのツリーが三つありますが、前の問題が残っています。スナップショットを呼び戻すためには3つすべての SHA-1 の値を覚えなければならない、という問題です。さらに、あなたはそれらのスナップショットがいつ、どのような理由で、誰が保存したのかについての情報を一切持っておりません。これはコミットオブジェクトがあなたのために保持する基本的な情報です。

コミットオブジェクトを作成するには、単一ツリーの SHA-1 と、もしそれに直に先行して作成されたコミットオブジェクトがあれば、それらを指定して `commit-tree` を呼びます。あなたが書き込んだ最初のツリーから始めましょう。

	$ echo 'first commit' | git commit-tree d8329f
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d

これで `cat-file` コマンドを呼んで新しいコミットオブジェクトを見ることができます。

	$ git cat-file -p fdf4fc3
	tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	author Scott Chacon <schacon@gmail.com> 1243040974 -0700
	committer Scott Chacon <schacon@gmail.com> 1243040974 -0700

	first commit

コミットオブジェクトの形式はシンプルです。それはプロジェクトのその時点のスナップショットに対して、トップレベルのツリーを指定します。その時点のスナップショットには、現在のタイムスタンプと共に `user.name` と `user.email` の設定から引き出された作者（author）／コミッター（committer）の情報、ブランクライン、そしてコミットメッセージが含まれます。

次に、あなたは二つのコミットオブジェクトを書き込みます。各コミットオブジェクトはその直前に来たコミットを参照しています。

	$ echo 'second commit' | git commit-tree 0155eb -p fdf4fc3
	cac0cab538b970a37ea1e769cbbde608743bc96d
	$ echo 'third commit'  | git commit-tree 3c4e9c -p cac0cab
	1a410efbd13591db07496601ebc7a059dd55cfe9

三つのコミットオブジェクトは、それぞれ、あなたが作成した三つのスナップショットのツリーのひとつを指し示しています。面白いことに、あなたは本物のGitヒストリーを持っており、`git log` コマンドによってログをみることができます。もしも最後のコミットの SHA-1ハッシュを指定して実行すると、

	$ git log --stat 1a410e
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	    third commit

	 bak/test.txt |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

	commit cac0cab538b970a37ea1e769cbbde608743bc96d
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:14:29 2009 -0700

	    second commit

	 new.txt  |    1 +
	 test.txt |    2 +-
	 2 files changed, 2 insertions(+), 1 deletions(-)

	commit fdf4fc3344e67ab068f836878b6c4951e3b15f3d
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:09:34 2009 -0700

	    first commit

	 test.txt |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

驚くべきことです。あなたは Git ヒストリーを形成するために、フロントエンドにある何かを利用することせずに、ただ下位レベルのオペレーションを行っただけなのです。これは `git add` コマンドと `git commit` コマンドを実行するときに Git が行う本質的なことなのです。それは変更されたファイルに対応して、ブロブを格納し、インデックスを更新し、ツリーを書き出します。そして、トップレベルのツリーとそれらの直前に来たコミットを参照するコミットオブジェクトを書きます。これらの三つの主要な Git オブジェクト - ブロブとツリーとコミットは、`.git/object` ディレクトリに分割されたファイルとして最初に格納されます。こちらは、例のディレクトリに今あるすべてのオブジェクトであり、それらが何を格納しているのかコメントされています。

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

もしすべての内部のポインタを辿ってゆけば、図9-3のようなオブジェクトグラフを得られます。


![](http://git-scm.com/figures/18333fig0903-tn.png)

図9-3. Gitレポジトリ内のすべてのオブジェクト

## オブジェクトストレージ

ヘッダはコンテンツと一緒に格納されることを、以前に述べました。少し時間を割いて、Git がどのようにしてオブジェクトを格納するのかを見ていきましょう。あなたはブロブオブジェクトがどのように格納されるのかを見ることになるでしょう。このケースでは "what is up, doc?" という文字列が Rubyスクリプト言語の中で対話的に格納されます。`irb` コマンドを使って対話的な Rubyモードを開始します。

	$ irb
	>> content = "what is up, doc?"
	=> "what is up, doc?"

Git はオブジェクトタイプで開始するヘッダを構成します。このケースではブロブのタイプです。そして、コンテンツのサイズに従ってスペースを追加して、最後にヌルバイトを追加します。

	>> header = "blob #{content.length}\0"
	=> "blob 16\000"

Git はヘッダとオリジナルのコンテンツとを結合して、その新しいコンテンツの SHA-1チェックサムを計算します。Rubyスクリプト内に書かれた文字列のSHA-1のハッシュ値は、`require` を使用して SHA1ダイジェストライブラリをインクルードし、文字列を引数にして `Digest::SHA1.hexdigest()` 関数を呼ぶことで求めることができます。

	>> store = header + content
	=> "blob 16\000what is up, doc?"
	>> require 'digest/sha1'
	=> true
	>> sha1 = Digest::SHA1.hexdigest(store)
	=> "bd9dbf5aae1a3862dd1526723246b20206e5fc37"

Gitは zlib を用いて新しいコンテンツを圧縮します。Rubyにある zlibライブラリをインクルードして使用します。まず、require を使用して zlib ライブラリをインクルードし、コンテンツに対して `Zlib::Deflate.deflate()` を実行します。

	>> require 'zlib'
	=> true
	>> zlib_content = Zlib::Deflate.deflate(store)
	=> "x\234K\312\311OR04c(\317H,Q\310,V(-\320QH\311O\266\a\000_\034\a\235"

最後に、zlibで圧縮された（zlib-deflated）コンテンツをディスク上のオブジェクトに書き込みます。オブジェクトの書き込み先のパスを決定します（SHA-1ハッシュ値の最初の2文字はサブディレクトリの名前で、残りの38文字はそのディレクトリ内のファイル名になります）。Rubyでは、`FileUtils.mkdir_p()` 関数を使用して（存在しない場合に）サブディレクトリを作成することができます。そして、`File.open()` によってファイルを開いて、前に zlib で圧縮された（zlib-compressed）コンテンツをファイルに書き出します。ファイルへの書き出しは、開いたファイルのハンドルに対して `write()` を呼ぶことで行います。

	>> path = '.git/objects/' + sha1[0,2] + '/' + sha1[2,38]
	=> ".git/objects/bd/9dbf5aae1a3862dd1526723246b20206e5fc37"
	>> require 'fileutils'
	=> true
	>> FileUtils.mkdir_p(File.dirname(path))
	=> ".git/objects/bd"
	>> File.open(path, 'w') { |f| f.write zlib_content }
	=> 32

これで終わりです。あなたは妥当な Git ブロブオブジェクトを作りました。ただタイプが異なるだけで、Git オブジェクトはすべて同じ方法で格納されます。ブロブの文字列ではない場合には、ヘッダはコミットまたはツリーから始まります。また、ブロブのコンテンツはほぼ何にでもなれるのに対して、コミットとツリーのコンテンツはかなり特定的に形式付けられています。
