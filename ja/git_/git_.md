# Git ポリシーの実施例

このセクションでは、これまでに学んだ内容を使って実際に Git のワークフローを確立してみます。コミットメッセージの書式をチェックし、プッシュは fast-forward 限定にし、そしてプロジェクト内の各サブディレクトリに対して特定のユーザーだけが変更を加えられるようにするというものです。開発者に対して「なぜプッシュが却下されたのか」を伝えるためのクライアントスクリプト、そして実際にそのポリシーを実施するためのサーバースクリプトを作成します。

スクリプトは Ruby を使って書きます。その理由のひとつは私が Ruby を好きなこと、そしてもうひとつの理由はその他のスクリプト言語の疑似コードとしてもそれっぽく見えるであろうということです。Ruby 使いじゃなくても、きっとコードの大まかな流れは追えるはずです。しかし、Ruby 以外の言語であってもきちんと動作します。Git に同梱されているサンプルスクリプトはすべて Perl あるいは Bash で書かれているので、それらの言語のサンプルも大量に見ることができます。

## サーバーサイドフック

サーバーサイドの作業は、すべて hooks ディレクトリの update ファイルにまとめます。update ファイルはプッシュされるブランチごとに実行されるもので、プッシュされる参照と操作前のブランチのリビジョン、そしてプッシュされる新しいリビジョンを受け取ります。また、SSH 経由でのプッシュの場合は、プッシュしたユーザーを知ることもできます。全員に共通のユーザー ("git" など) を使って公開鍵認証をさせている場合は、公開鍵の情報に基づいて実際のユーザーを判断して環境変数を設定するというラッパーが必要です。ここでは、接続しているユーザー名が環境変数 `$USER` に格納されているものとします。スクリプトは、まずこれらの情報を取得するところから始まります。

	#!/usr/bin/env ruby

	$refname = ARGV[0]
	$oldrev  = ARGV[1]
	$newrev  = ARGV[2]
	$user    = ENV['USER']

	puts "Enforcing Policies... \n(#{$refname}) (#{$oldrev[0,6]}) (#{$newrev[0,6]})"

ああ、グローバル変数を使ってるとかいうツッコミは勘弁してください。このほうが説明が楽なので。

### 特定のコミットメッセージ書式の強制

まずは、コミットメッセージを特定の書式に従わせることに挑戦してみましょう。ここでは、コミットメッセージには必ず "ref: 1234" 形式の文字列を含むこと、というルールにします。個々のコミットをチケットシステムとリンクさせたいという意図です。やらなければならないことは、プッシュされてきた各コミットのコミットメッセージにその文字列があるかどうかを調べ、もしなければゼロ以外の値で終了してプッシュを却下することです。

プッシュされたすべてのコミットの SHA-1 値を取得するには、`$newrev` と `$oldrev` の内容を `git rev-list` という低レベル Git コマンドに渡します。これは基本的には `git log` コマンドのようなものですが、デフォルトでは SHA-1 値だけを表示してそれ以外の情報は出力しません。ふたつのコミットの間のすべてのコミットの SHA を得るには、次のようなコマンドを実行します。

	$ git rev-list 538c33..d14fc7
	d14fc7c847ab946ec39590d87783c69b031bdfb7
	9f585da4401b0a3999e84113824d15245c13f0be
	234071a1be950e2a8d078e6141f5cd20c1e61ad3
	dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
	17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

この出力を受け取ってループさせて各コミットの SHA を取得し、個々のメッセージを取り出し、正規表現でそのメッセージを調べることができます。

さて、これらのコミットからコミットメッセージを取り出す方法を見つけなければなりません。生のコミットデータを取得するには、別の低レベルコマンド `git cat-file` を使います。低レベルコマンドについては第 9 章で詳しく説明しますが、とりあえずはこのコマンドがどんな結果を返すのだけを示します。

	$ git cat-file commit ca82a6
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

SHA-1 値がわかっているときにコミットからコミットメッセージを得るシンプルな方法は、空行を探してそれ以降をすべて取得するというものです。これには、Unix システムの `sed` コマンドが使えます。

	$ git cat-file commit ca82a6 | sed '1,/^$/d'
	changed the version number

この呪文を使ってコミットメッセージを取得し、もし条件にマッチしないものがあれば終了させればよいのです。スクリプトを抜けてプッシュを却下するには、ゼロ以外の値で終了させます。以上を踏まえると、このメソッドは次のようになります。

	$regex = /\[ref: (\d+)\]/

	# enforced custom commit message format
	def check_message_format
	  missed_revs = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  missed_revs.each do |rev|
	    message = `git cat-file commit #{rev} | sed '1,/^$/d'`
	    if !$regex.match(message)
	      puts "[POLICY] Your message is not formatted correctly"
	      exit 1
	    end
	  end
	end
	check_message_format

これを `update` スクリプトに追加すると、ルールを守らないコミットメッセージが含まれるコミットのプッシュを却下するようになります。

### ユーザーベースのアクセス制御

アクセス制御リスト (ACL) を使って、ユーザーごとにプロジェクトのどの部分を変更できるのかを指定できるようにしてみましょう。全体にアクセスできるユーザーもいれば、特定のサブディレクトリやファイルだけにしか変更をプッシュできないユーザーもいる、といった仕組みです。これを実施するには、ルールを書いたファイル `acl` をサーバー上のベア Git リポジトリに置きます。`update` フックにこのファイルを読ませ、プッシュされたコミットにどのファイルが含まれているのかを調べ、そしてプッシュしたユーザーがそれらのファイルを変更する権限があるのかどうかを判断します。

まずは ACL を作るところから始めましょう。ここでは、CVS の ACL と似た書式を使います。これは各項目を一行で表すもので、最初のフィールドは `avail` あるいは `unavail`、そして次の行がそのルールを適用するユーザーの一覧 (カンマ区切り)、そして最後のフィールドがそのルールを適用するパス (ブランクは全体へのアクセスを意味します) です。フィールドの区切りには、パイプ文字 (`|`) を使います。

ここでは、全体にアクセスする管理者と `doc` ディレクトリにアクセスするドキュメント担当者、そして `lib` と `tests` サブディレクトリだけにアクセスできる開発者を設定します。ACL ファイルは次のようになります。

	avail|nickh,pjhyett,defunkt,tpw
	avail|usinclair,cdickens,ebronte|doc
	avail|schacon|lib
	avail|schacon|tests

まずはこのデータを読み込んで、スクリプト内で使えるデータ構造にしてみましょう。例をシンプルにするために、ここでは `avail` ディレクティブだけを使います。次のメソッドは連想配列を返すものです。ユーザー名が配列のキー、そのユーザーが書き込み権を持つパスの配列が対応する値となります。

	def get_acl_access_data(acl_file)
	  # read in ACL data
	  acl_file = File.read(acl_file).split("\n").reject { |line| line == '' }
	  access = {}
	  acl_file.each do |line|
	    avail, users, path = line.split('|')
	    next unless avail == 'avail'
	    users.split(',').each do |user|
	      access[user] ||= []
	      access[user] << path
	    end
	  end
	  access
	end

先ほどの ACL ファイルをこの `get_acl_access_data` メソッドに渡すと、このようなデータ構造を返します。

	{"defunkt"=>[nil],
	 "tpw"=>[nil],
	 "nickh"=>[nil],
	 "pjhyett"=>[nil],
	 "schacon"=>["lib", "tests"],
	 "cdickens"=>["doc"],
	 "usinclair"=>["doc"],
	 "ebronte"=>["doc"]}

これで権限がわかったので、あとはプッシュされた各コミットがどのパスを変更しようとしているのかを調べれば、そのユーザーがプッシュすることができるのかどうかを判断できます。

あるコミットでどのファイルが変更されるのかを知るのはとても簡単で、`git log` コマンドに `--name-only` オプションを指定するだけです (第 2 章で簡単に説明しました)。

	$ git log -1 --name-only --pretty=format:'' 9f585d

	README
	lib/test.rb

`get_acl_access_data` メソッドが返す ACL のデータとこのファイルリストを付き合わせれば、そのユーザーがコミットをプッシュする権限があるかどうかを判断できます。

	# only allows certain users to modify certain subdirectories in a project
	def check_directory_perms
	  access = get_acl_access_data('acl')

	  # see if anyone is trying to push something they can't
	  new_commits = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  new_commits.each do |rev|
	    files_modified = `git log -1 --name-only --pretty=format:'' #{rev}`.split("\n")
	    files_modified.each do |path|
	      next if path.size == 0
	      has_file_access = false
	      access[$user].each do |access_path|
	        if !access_path || # user has access to everything
	          (path.index(access_path) == 0) # access to this path
	          has_file_access = true
	        end
	      end
	      if !has_file_access
	        puts "[POLICY] You do not have access to push to #{path}"
	        exit 1
	      end
	    end
	  end
	end

	check_directory_perms

それほど難しい処理ではありません。まず最初に `git rev-list` でコミットの一覧を取得し、それぞれに対してどのファイルが変更されるのかを調べ、ユーザーがそのファイルを変更する権限があることを確かめています。Ruby を知らない人にはわかりにくいところがあるとすれば `path.index(access_path) == 0` でしょうか。これは、パスが `access_path` で始まるときに真となります。つまり、`access_path` がパスの一部に含まれるのではなく、パスがそれで始まっているということを確認しています。

これで、まずい形式のコミットメッセージや権利のないファイルの変更を含むコミットはプッシュできなくなりました。

### Fast-Forward なプッシュへの限定

最後は、fast-forward なプッシュに限るという仕組みです。 `receive.denyDeletes` および `receive.denyNonFastForwards` という設定項目で設定できます｡また､フックを用いてこの制限を課すこともできますし､特定のユーザーにだけこの制約を加えたいなどといった変更にも対応できます。

これを調べるには、旧リビジョンからたどれるすべてのコミットについて、新リビジョンから到達できないものがないかどうかを探します。もしひとつもなければ、それは fast-forward なプッシュです。ひとつでも見つかれば、却下することになります。

	# enforces fast-forward only pushes
	def check_fast_forward
	  missed_refs = `git rev-list #{$newrev}..#{$oldrev}`
	  missed_ref_count = missed_refs.split("\n").size
	  if missed_ref_count > 0
	    puts "[POLICY] Cannot push a non fast-forward reference"
	    exit 1
	  end
	end

	check_fast_forward

これですべてがととのいました。これまでのコードを書き込んだファイルに対して `chmod u+x .git/hooks/update` を実行し、fast-forward ではない参照をプッシュしてみましょう。すると、こんなメッセージが表示されるでしょう。

	$ git push -f origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 323 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	Unpacking objects: 100% (3/3), done.
	Enforcing Policies...
	(refs/heads/master) (8338c5) (c5b616)
	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master
	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

この中には、いくつか興味深い点があります。まず、フックの実行が始まったときの次の表示に注目しましょう。

	Enforcing Policies...
	(refs/heads/master) (8338c5) (c5b616)

これは、スクリプトの先頭で標準出力に表示した内容でした。ここで重要なのは「スクリプトから標準出力に送った内容は、すべてクライアントにも送られる」ということです。

次に注目するのは、エラーメッセージです。

	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master

最初の行はスクリプトから出力したもので、その他の 2 行は Git が出力したものです。この 2 行では、スクリプトがゼロ以外の値で終了したためにプッシュが却下されたということを説明しています。最後に、次の部分に注目します。

	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

フックで却下したすべての参照について、remote rejected メッセージが表示されます。これを見れば、フック内での処理のせいで却下されたのだということがわかります。

さらに、もしコミットメッセージに適切な ref が含まれていなければ、それを示す次のようなエラーメッセージが表示されるでしょう。

	[POLICY] Your message is not formatted correctly

また、変更権限のないファイルを変更してそれを含むコミットをプッシュしようとしたときも、同様にエラーが表示されます。たとえば、ドキュメント担当者が `lib` ディレクトリ内の何かを変更しようとした場合のメッセージは次のようになります。

	[POLICY] You do not have access to push to lib/test.rb

以上です。この `update` スクリプトが動いてさえいれば、もう二度とリポジトリが汚されることはありません。コミットメッセージは決まりどおりのきちんとしたものになるし、ユーザーに変なところをさわられる心配もなくなります。

## クライアントサイドフック

この方式の弱点は、プッシュが却下されたときにユーザーが泣き寝入りせざるを得なくなるということです。手間暇かけて仕上げた作業が最後の最後で却下されるというのは、非常にストレスがたまるし不可解です。プッシュするためには歴史を修正しなければならないのですが、気弱な人にとってそれはかなりつらいことです。

このジレンマに対する答えとして、サーバーが却下するであろう作業をするときにそれをユーザーに伝えるためのクライアントサイドフックを用意します。そうすれば、何か問題があるときにそれをコミットする前に知ることができるので、取り返しのつかなくなる前に問題を修正することができます。プロジェクトをクローンしてもフックはコピーされないので、別の何らかの方法で各ユーザーにスクリプトを配布しなければなりません。各ユーザーはそれを `.git/hooks` にコピーし、実行可能にします。フックスクリプト自体をプロジェクトに含めたり別のプロジェクトにしたりすることはできますが、各自の環境でそれをフックとして自動的に設定することはできないのです。

はじめに、コミットを書き込む直前にコミットメッセージをチェックしなければなりません。そして、サーバーに却下されないようにコミットメッセージの書式を調べるのです。そのためには `commit-msg` フックを使います。最初の引数で渡されたファイルからコミットメッセージを読み込んでパターンと比較し、もしマッチしなければ Git の処理を中断させます。

	#!/usr/bin/env ruby
	message_file = ARGV[0]
	message = File.read(message_file)

	$regex = /\[ref: (\d+)\]/

	if !$regex.match(message)
	  puts "[POLICY] Your message is not formatted correctly"
	  exit 1
	end

このスクリプトを適切な場所 (`.git/hooks/commit-msg`) に置いて実行可能にしておくと、不適切なメッセージを書いてコミットしようとしたときに次のような結果となります。

	$ git commit -am 'test'
	[POLICY] Your message is not formatted correctly

このとき、実際にはコミットされません。もしメッセージが適切な書式になっていれば、Git はコミットを許可します。

	$ git commit -am 'test [ref: 132]'
	[master e05c914] test [ref: 132]
	 1 files changed, 1 insertions(+), 0 deletions(-)

次に、ACL で決められた範囲以外のファイルを変更していないことを確認しましょう。先ほど使った ACL ファイルのコピーがプロジェクトの `.git` ディレクトリにあれば、次のような `pre-commit` スクリプトでチェックすることができます。

	#!/usr/bin/env ruby

	$user    = ENV['USER']

	# [ insert acl_access_data method from above ]

	# only allows certain users to modify certain subdirectories in a project
	def check_directory_perms
	  access = get_acl_access_data('.git/acl')

	  files_modified = `git diff-index --cached --name-only HEAD`.split("\n")
	  files_modified.each do |path|
	    next if path.size == 0
	    has_file_access = false
	    access[$user].each do |access_path|
	    if !access_path || (path.index(access_path) == 0)
	      has_file_access = true
	    end
	    if !has_file_access
	      puts "[POLICY] You do not have access to push to #{path}"
	      exit 1
	    end
	  end
	end

	check_directory_perms

大まかにはサーバーサイドのスクリプトと同じですが、重要な違いがふたつあります。まず、ACL ファイルの場所が違います。このスクリプトは作業ディレクトリから実行するものであり、Git ディレクトリから実行するものではないからです。ACL ファイルの場所を、先ほどの

	access = get_acl_access_data('acl')

から次のように変更しなければなりません。

	access = get_acl_access_data('.git/acl')

もうひとつの違いは、変更されたファイルの一覧を取得する方法です。サーバーサイドのメソッドではコミットログを調べていました。しかしこの時点ではまだコミットが記録されていないので、ファイルの一覧はステージング・エリアから取得しなければなりません。つまり、先ほどの

	files_modified = `git log -1 --name-only --pretty=format:'' #{ref}`

は次のようになります。

	files_modified = `git diff-index --cached --name-only HEAD`

しかし、違うのはこの二点だけ。それ以外はまったく同じように動作します。ただ、このスクリプトは、ローカルで実行しているユーザーとリモートマシンにプッシュするときのユーザーが同じであることを前提にしています。もし異なる場合は、変数 `$user` を手動で設定しなければなりません。

最後に残ったのは fast-forward でないプッシュを止めることですが、これは多少特殊です。fast-forward でない参照を取得するには、すでにプッシュした過去のコミットにリベースするか、別のローカルブランチにリモートブランチと同じところまでプッシュしなければなりません。

サーバーサイドでは fast-forward ではないプッシュをできないようにしているので、それ以外にあり得るのは、すでにプッシュ済みのコミットをリベースしようとするときくらいです。

それをチェックする pre-rebase スクリプトの例を示します。これは書き換えようとしているコミットの一覧を取得し、それがリモート参照の中に存在するかどうかを調べます。リモート参照から到達可能なコミットがひとつでもあれば、リベースを中断します。

	#!/usr/bin/env ruby

	base_branch = ARGV[0]
	if ARGV[1]
	  topic_branch = ARGV[1]
	else
	  topic_branch = "HEAD"
	end

	target_shas = `git rev-list #{base_branch}..#{topic_branch}`.split("\n")
	remote_refs = `git branch -r`.split("\n").map { |r| r.strip }

	target_shas.each do |sha|
	  remote_refs.each do |remote_ref|
	    shas_pushed = `git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}`
	    if shas_pushed.split("\n").include?(sha)
	      puts "[POLICY] Commit #{sha} has already been pushed to #{remote_ref}"
	      exit 1
	    end
	  end
	end

このスクリプトでは、第 6 章の「リビジョンの選択」ではカバーしていない構文を使っています。既にプッシュ済みのコミットの一覧を得るために、次のコマンドを実行します。

	git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}

`SHA^@` 構文は、そのコミットのすべての親を解決します。リモートの最後のコミットから到達可能で、これからプッシュしようとするコミットの親のいずれかからアクセスできないコミットを探します。

この方式の弱点は非常に時間がかかることで、多くの場合このチェックは不要です。`-f` つきで強制的にプッシュしようとしない限り、サーバーが警告を出してプッシュできないからです。しかし練習用の課題としてはおもしろいもので、あとでリベースを取り消してやりなおすはめになることを理屈上は防げるようになります。
