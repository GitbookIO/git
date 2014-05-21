# Git への移行

別の VCS で管理している既存のコードベースを Git で管理しようと思ったら、何らかの方法でそのプロジェクトを移行しなければなりません。この節では、一般的なシステム上の Git に含まれているインポートツールについて説明します。そして、インポートツールを自作する方法も扱います。

## インポート

ここでは、業務のソースコード管理に使われる2大ツールである Subversion と Perforce からデータをインポートする方法を説明します。現在 Git への移行を考えている人たちの多くがこれらを使っていると聞いています。そのため、これらからのインポート用に、Git には高品質のツールが付属しています。

## Subversion

先ほどの節で `git svn` の使い方を読んでいれば、話は簡単です。まず `git svn clone` でリポジトリを作り、そして Subversion サーバーを使うのをやめ、新しい Git サーバーにプッシュし、あとはそれを使い始めればいいのです。これまでの歴史が欲しいのなら、それも Subversion サーバーからプルすることができます (多少時間がかかります)。

しかし、インポートは完全ではありません。また時間もかかるので、正しくやるのがいいでしょう。まず最初に問題になるのが作者 (author) の情報です。Subversion ではコミットした人すべてがシステム上にユーザーを持っており、それがコミット情報として記録されます。たとえば先ほどの節のサンプルで言うと `schacon` がそれで、`blame` の出力や `git svn log` の出力に含まれています。これをうまく Git の作者データとしてマップするには、Subversion のユーザーと Git の作者のマッピングが必要です。`users.txt` という名前のファイルを作り、このような書式でマッピングを記述します。

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

SVN で使っている作者の一覧を取得するには、このようにします。

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

これは、まずログを XML フォーマットで出力します。その中から作者を捜して重複を省き、XML を除去します (ちょっと見ればわかりますが、これは `grep` や `sort`、そして `perl` といったコマンドが使える環境でないと動きません)。この出力を users.txt にリダイレクトし、そこに Git のユーザーデータを書き足していきます。

このファイルを `git svn` に渡せば、作者のデータをより正確にマッピングできるようになります。また、Subversion が通常インポートするメタデータを含めないよう `git svn` に指示することもできます。そのためには `--no-metadata` を `clone` コマンドあるいは `init` コマンドに渡します。そうすると、 `import` コマンドは次のようになります。

	$ git svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

これで、Subversion をちょっとマシにインポートした `my_project` ディレクトリができあがりました。コミットがこんなふうに記録されるのではなく、

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029

次のように記録されています。

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

Author フィールドの見た目がずっとよくなっただけではなく、`git-svn-id` もなくなっています。

インポートした後に、ちょっとした後始末が必要です。たとえば、`git svn` が準備した変な参照などです。まずはタグを移動して、奇妙なリモートブランチではなくちゃんとしたタグとして扱えるようにします。そして、残りのブランチを移動してローカルで扱えるようにします。

タグを Git のタグとして扱うには、次のコマンドを実行します。

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

これは、リモートブランチのうち `tag/` で始まる名前のものを、実際の (軽量な) タグに変えます。

次に、`refs/remotes` 以下にあるそれ以外の参照をローカルブランチに移動します。

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

これで、今まであった古いブランチはすべて Git のブランチとなり、古いタグもすべて Git のタグになりました。最後に残る作業は、新しい Git サーバーをリモートに追加してプッシュすることです。自分のサーバーをリモートとして追加するには以下のようにします｡

	$ git remote add origin git@my-git-server:myrepository.git

すべてのブランチやタグを一緒にプッシュするには、このようにします。

	$ git push origin --all
	$ git push origin --tags

これで、ブランチやタグも含めたすべてを、新しい Git サーバーにきれいにインポートできました。

## Perforce

次のインポート元としてとりあげるのは Perforce です。Perforce からのインポートツールも Git に同梱されています｡ただし､使用しているGitのバージョンが1.7.11より古い場合は同梱されておらず､Gitソースコードの `contrib` から取り出す必要があります。ソースコードは git.kernel.org からダウンロードできます。

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

この `fast-import` ディレクトリにある実行可能な Python スクリプト `git-p4` が、それです。このツールを使うには、Python と `p4` ツールがマシンにインストールされていなければなりません。たとえば、Jam プロジェクトを Perforce Public Depot からインポートします。クライアントをセットアップするには、環境変数 P4PORT をエクスポートして Perforce depot の場所を指すようにしなければなりません。

	$ export P4PORT=public.perforce.com:1666

`git-p4 clone` コマンドを実行して Jam プロジェクトを Perforce サーバーからインポートし、depot とプロジェクトそしてプロジェクトの取り込み先のパスを指定します。

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

`/opt/p4import` ディレクトリに移動して `git log` を実行すると、インポートされた内容を見ることができます。

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

`git-p4` という識別子が各コミットに含まれることがわかるでしょう。この識別子はそのままにしておいてもかまいません。後で万一 Perforce のチェンジ番号を参照しなければならなくなったときのために使えます。しかし、もし削除したいのならここで消しておきましょう。新しいリポジトリ上で何か作業を始める前のこの段階で。`git filter-branch` を使えば、この識別子を一括削除することができます。

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

`git log` を実行すれば各コミットの SHA-1 チェックサムがすべて変わったことがわかります。そして `git-p4` 文字列はコミットメッセージから消えました。

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

これで、インポートした内容を新しい Git サーバーにプッシュする準備がととのいました。

## カスタムインポーター

Subversion や Perforce 以外のシステムを使っている場合は、それ用のインポートツールを探さなければなりません。CVS、Clear Case、Visual Source Safe、あるいはアーカイブのディレクトリなどのためのツールはオンラインで公開されています。これらのツールがうまく動かなかったり手元で使っているバージョン管理ツールがもっとマイナーなものだったり、あるいはインポート処理で特殊な操作をしたりしたい場合は `git fast-import` を使います。このコマンドはシンプルな指示を標準入力から受け取って、特定の Git データを書き出します。生の Git コマンドを使ったり生のオブジェクトを書きだそうとしたりする (詳細は第 9 章を参照ください) よりもずっと簡単に Git オブジェクトを作ることができます。この方法を使えばインポートスクリプトを自作することができます。必要な情報を元のシステムから読み込み、単純な指示を標準出力に出せばよいのです。そして、このスクリプトの出力をパイプで `git fast-import` に送ります。

手軽に試してみるために、シンプルなインポーターを書いてみましょう。currentで作業をしており、プロジェクトのバックアップはディレクトリまるごとのコピーで行っているものとします。バックアップディレクトリの名前は、タイムスタンプをもとに `back_YYYY_MM_DD` としています。これらを Git にインポートしてみましょう。ディレクトリの構造は、このようになっています。

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

Git のディレクトリにインポートするにはまず、これらのデータをどのように Git に格納するかをレビューしなければなりません。Git は基本的にはコミットオブジェクトのリンクリストであり、コミットオブジェクトがコンテンツのスナップショットを指しています。`fast-import` に指示しなければならないのは、コンテンツのスナップショットが何でどのコミットデータがそれを指しているのかということと、コミットデータを取り込む順番だけです。ここでは、スナップショットをひとつずつたどって各ディレクトリの中身をさすコミットオブジェクトを作り、それらを日付順にリンクさせるものとします。

第 7 章の「Git ポリシーの実施例」同様、ここでも Ruby を使って書きます。ふだんから使いなれており、きっと他の方にも読みやすいであろうからです。このサンプルをあなたの使いなれた言語で書き換えるのも簡単でしょう。単に適切な情報を標準出力に送るだけなのだから。また、Windows を使っている場合は、行末にキャリッジリターンを含めないように注意が必要です。git fast-import が想定している行末は LF だけであり、Windows で使われている CRLF は想定していません。

まず最初に対象ディレクトリに移動し、コミットとしてインポートするスナップショットとしてサブディレクトリを識別します。基本的なメインループは、このようになります。

	last_mark = nil

	# 各ディレクトリをループ
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # 対象ディレクトリに移動
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

各ディレクトリ内で実行している `print_export` は、前のスナップショットの内容とマークを受け取ってこのディレクトリの内容とマークを返します。このようにして、それぞれを適切にリンクさせます。「マーク」とは `fast-import` 用語で、コミットに対する識別子を意味します。コミットを作成するときにマークをつけ、それを使って他のコミットとリンクさせます。つまり、`print_export` メソッドで最初にやることは、ディレクトリ名からマークを生成することです。

	mark = convert_dir_to_mark(dir)

これを行うには、まずディレクトリの配列を作り、そのインデックスの値をマークとして使います。マークは整数値でなければならないからです。メソッドの中身はこのようになります。

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

これで各コミットを整数値で表せるようになりました。次に必要なのは、コミットのメタデータ用の日付です。日付はディレクトリ名で表されているので、ここから取得します。`print_export` ファイルで次にすることは、これです。

	date = convert_dir_to_date(dir)

`convert_dir_to_date` の定義は次のようになります。

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

これは、各ディレクトリの日付に対応する整数値を返します。コミットのメタ情報として必要な最後の情報はコミッターのデータで、これはグローバル変数にハードコードします。

	$author = 'Scott Chacon <schacon@example.com>'

これで、コミットのデータをインポーターに流せるようになりました。最初の情報で示しているのは、今定義しているのがコミットオブジェクトであることとどのブランチにいるのかを表す宣言です。その後に先ほど生成したマークが続き、さらにコミッターの情報とコミットメッセージが続いた後にひとつ前のコミットが (もし存在すれば) 続きます。コードはこのようになります。

	# インポート情報の表示
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

タイムゾーン (-0700) をハードコードしているのは、そのほうがお手軽だったからです。別のシステムからインポートする場合は、タイムゾーンを適切に指定しなければなりません。コミットメッセージは、次のような特殊な書式にする必要があります。

	data (size)\n(contents)

まず最初に「data」という単語、そして読み込むデータのサイズ、改行、最後にデータがきます。同じ書式は後でファイルのコンテンツを指定するときにも使うので、ヘルパーメソッド `export_data` を作ります。

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

残っているのは、各スナップショットが持つファイルのコンテンツを指定することです。今回の場合はどれも一つのディレクトリにまとまっているので簡単です。`deleteall` コマンドを表示し、それに続けてディレクトリ内の各ファイルの中身を表示すればよいのです。そうすれば、Git が各スナップショットを適切に記録します。

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

注意:	多くのシステムではリビジョンを「あるコミットと別のコミットの差分」と考えているので、fast-importでもその形式でコマンドを受け取ることができます。つまりコミットを指定するときに、追加/削除/変更されたファイルと新しいコンテンツの中身で指定できるということです。各スナップショットの差分を算出してそのデータだけを渡すこともできますが、処理が複雑になります。すべてのデータを渡して、Git に差分を算出させたほうがよいでしょう。もし差分を渡すほうが手元のデータに適しているようなら、`fast-import` のマニュアルで詳細な方法を調べましょう。

新しいファイルの内容、あるいは変更されたファイルと変更後の内容を表す書式は次のようになります。

	M 644 inline path/to/file
	data (size)
	(file contents)

この 644 はモード (実行可能ファイルがある場合は、そのファイルについては 755 を指定する必要があります) を表し、inline とはファイルの内容をこの次の行に続けて指定するという意味です。`inline_data` メソッドは、このようになります。

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

先ほど定義した `export_data` メソッドを再利用することができます。この書式はコミットメッセージの書式と同じだからです。

最後に必要となるのは、現在のマークを返して次の処理に渡せるようにすることです。

	return mark

注意: Windows 上で動かす場合はさらにもう一手間必要です。先述したように、Windows の改行文字は CRLF ですが git fast-import は LF にしか対応していません。この問題に対応して git fast-import をうまく動作させるには、CRLF ではなく LF を使うよう ruby に指示しなければなりません。

	$stdout.binmode

これで終わりです。このスクリプトを実行すれば、次のような結果が得られます。

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

インポーターを動かすには、インポート先の Git レポジトリにおいて､インポーターの出力をパイプで `git fast-import` に渡す必要があります。インポート先に新しいディレクトリを作成したら､以下のように `git init` を実行し、そしてスクリプトを実行してみましょう｡

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

ご覧のとおり、処理が正常に完了すると、処理内容に関する統計情報が表示されます。この場合は、全部で 18 のオブジェクトからなる 5 つのコミットが 1 つのブランチにインポートされたことがわかります。では、`git log` で新しい歴史を確認しましょう。

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

きれいな Git リポジトリができていますね。ここで重要なのは、この時点ではまだ何もチェックアウトされていないということです。作業ディレクトリには何もファイルがありません。ファイルを取得するには、ブランチをリセットして `master` の現在の状態にしなければなりません。

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

`fast-import` ツールにはさらに多くの機能があります。さまざまなモードを処理したりバイナリデータを扱ったり、複数のブランチやそのマージ、タグ、進捗状況表示などです。より複雑なシナリオのサンプルは Git のソースコードの `contrib/fast-import` ディレクトリにあります。先ほど取り上げた `git-p4` スクリプトがよい例となるでしょう。
