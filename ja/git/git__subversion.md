# Git と Subversion

現在のところ、オープンソースや企業のプロジェクトの大多数が、ソースコードの管理に Subversion を利用しています。Subversion は最も人気のあるオープンソースのVCSで、10年近く前から使われています。Subversion 以前は CVS がソースコード管理に広く用いられていたのですが、多くの点で両者はよく似ています。

Git の素晴しい機能のひとつに、Git と Subversion を双方向にブリッジする `git svn` があります。このツールを使うと、Subversion のクライアントとして Git を使うことができます。つまり、ローカルの作業では Git の機能を十分に活用することができて、あたかも Subversion を使っているかのように Subversion サーバーに変更をコミットすることができます。共同作業をしている人達が古き良き方法を使っているのと
同時に、ローカルでのブランチ作成やマージ、ステージング・エリア、リベース、チェリーピックなどの Git の機能を使うことができるということです。共同の作業環境に Git を忍び込ませておいて、仲間の開発者たちが Git より効率良く作業できるように手助けをしつつ、Git の全面的な採用のための根回しをしてゆく、というのが賢いやり方です。Subversion ブリッジは、分散VCS の素晴しい世界へのゲートウェイ・ドラッグといえるでしょう。

## git svn

Git と Subversion の橋渡しをするコマンド群のベースとなるコマンドが `git svn` です。すべてはここから始めることができます。この後に続くコマンドはかなりたくさんあるので、いくつかのワークフローを通して一般的なものから身につけていきましょう。

注意すべきことは、`git svn` を使っているときは Subversion を相手にしているのだということです。これは、Git ほど洗練されてはいません。ローカルでのブランチ作成やマージは簡単にできますが、作業内容をリベースするなどして歴史をできるだけ一直線に保つようにし、Git リモートリポジトリを相手にするときのように考えるのは避けましょう。

歴史を書き換えてもう一度プッシュしようなどとしてはいけません。また、他の開発者との共同作業のために複数の Git リポジトリに並行してプッシュするのもいけません。Subversion が扱えるのは一本の直線上の歴史だけで、ちょっとしたことですぐに混乱してしまいます。チームのメンバーの中に SVN を使う人と Git を使う人がいる場合は、全員が SVN サーバーを使って共同作業するようにしましょう。そうすれば、少しは生きやすくなります。

## 準備

この機能を説明するには、書き込みアクセス権を持つ標準的な SVN リポジトリが必要です。もしこのサンプルをコピーして試したいのなら、私のテスト用リポジトリの書き込み可能なコピーを作らなければなりません。これを簡単に行うには、`svnsync` というツールを使います。最近のバージョンの Subversion、少なくとも 1.4 以降に付属しているツールです。テスト用として、新しい Subversion リポジトリを Google code 上に作りました。これは `protobuf` プロジェクトの一部で、`protobuf` は構造化されたデータを符号化してネットワーク上で転送するためのツールです。

まずはじめに、新しいローカル Subversion リポジトリを作ります。

	$ mkdir /tmp/test-svn
	$ svnadmin create /tmp/test-svn

そして、すべてのユーザーが revprop を変更できるようにします。簡単な方法は、常に 0 で終了する pre-revprop-change スクリプトを追加することです。

	$ cat /tmp/test-svn/hooks/pre-revprop-change
	#!/bin/sh
	exit 0;
	$ chmod +x /tmp/test-svn/hooks/pre-revprop-change

これで、ローカルマシンにこのプロジェクトを同期できるようになりました。同期元と同期先のリポジトリを指定して `svnsync init` を実行します。

	$ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

このコマンドは、同期を実行するためのプロパティを設定します。次に、このコマンドでコードをコピーします。

	$ svnsync sync file:///tmp/test-svn
	Committed revision 1.
	Copied properties for revision 1.
	Committed revision 2.
	Copied properties for revision 2.
	Committed revision 3.
	...

この操作は数分で終わりますが、もし元のリポジトリのコピー先がローカルではなく別のリモートリポジトリだった場合、この処理には約一時間かかります。総コミット数はたかだか 100 にも満たないにもかかわらず。Subversion では、リビジョンごとにクローンを作ってコピー先のリポジトリに投入していかなければなりません。これはばかばかしいほど非効率的ですが、簡単に済ませるにはこの方法しかないのです。

## はじめましょう

書き込み可能な Subversion リポジトリが手に入ったので、一般的なワークフローに沿って進めましょう。まずは `git svn clone` コマンドを実行します。このコマンドは、Subversion リポジトリ全体をローカルの Git リポジトリにインポートします。どこかにホストされている実際の Subversion リポジトリから取り込む場合は `file:///tmp/test-svn` の部分を Subversion リポジトリの URL に変更しましょう。

	$ git svn clone file:///tmp/test-svn -T trunk -b branches -t tags
	Initialized empty Git repository in /Users/schacon/projects/testsvnsync/svn/.git/
	r1 = b4e387bc68740b5af56c2a5faf4003ae42bd135c (trunk)
	      A    m4/acx_pthread.m4
	      A    m4/stl_hash.m4
	...
	r75 = d1957f3b307922124eec6314e15bcda59e3d9610 (trunk)
	Found possible branch point: file:///tmp/test-svn/trunk => \
	    file:///tmp/test-svn /branches/my-calc-branch, 75
	Found branch parent: (my-calc-branch) d1957f3b307922124eec6314e15bcda59e3d9610
	Following parent with do_switch
	Successfully followed parent
	r76 = 8624824ecc0badd73f40ea2f01fce51894189b01 (my-calc-branch)
	Checked out HEAD:
	 file:///tmp/test-svn/branches/my-calc-branch r76

これは、指定した URL に対して `git svn init` に続けて `git svn fetch` を実行するのと同じ意味です。しばらく時間がかかります。test プロジェクトには 75 のコミットしかなくてコードベースもそれほど大きくないので、数分しかかかりません。しかし、Git は各バージョンをそれぞれチェックアウトしては個別にコミットしています。もし数百数千のコミットがあるプロジェクトで試すと、終わるまでには数時間から下手をすると数日かかってしまうかもしれません。

`-T trunk -b branches -t tags` の部分は、この Subversion リポジトリが標準的なブランチとタグの規約に従っていることを表しています。trunk、branches、tags にもし別の名前をつけているのなら、この部分を変更します。この規約は一般に使われているものなので、単に `-s` とだけ指定することもできます。これは、先の 3 つのオプションを指定したのと同じ標準のレイアウトを表します。つまり、次のようにしても同じ意味になるということです。

	$ git svn clone file:///tmp/test-svn -s

これで、ブランチやタグも取り込んだ Git リポジトリができあがりました。

	$ git branch -a
	* master
	  my-calc-branch
	  tags/2.0.2
	  tags/release-2.0.1
	  tags/release-2.0.2
	  tags/release-2.0.2rc1
	  trunk

このツールがリモート参照を取り込むときの名前空間が通常と異なることに注意しましょう。Git リポジトリのクローンを作成した場合は、リモートサーバー上のすべてのブランチが `origin/[branch]` のような形式で取り込まれます。つまりリモートの名前で名前空間が作られます。しかし、`git svn` はリモートが複数あることを想定しておらず、すべてのリモートサーバーを名前空間なしに保存します。Git のコマンド `show-ref` を使うと、すべての参照名を完全な形式で見ることができます。

	$ git show-ref
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
	aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
	03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
	50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
	4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
	1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

通常の Git リポジトリは、このようになります。

	$ git show-ref
	83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
	3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
	0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
	25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

2 つのリモートサーバーがあり、一方の `gitserver` には `master` ブランチが、そしてもう一方の `origin` には `master` と `testing` の 2 つのブランチがあります。

サンプルのリモート参照が `git svn` でどのように取り込まれたかに注目しましょう。タグはリモートブランチとして取り込まれており、Git のタグにはなっていません。Subversion から取り込んだ内容は、まるで tags という名前のリモートからブランチを取り込んだように見えます。

## Subversion へのコミットの書き戻し

作業リポジトリを手に入れたあなたはプロジェクト上で何らかの作業を終え、コミットを上流に書き戻すことになりました。Git を SVN クライアントとして使います。どれかひとつのファイルを変更してコミットした時点では、Git上でローカルに存在するそのコミットはSubversionサーバー上には存在しません。

	$ git commit -am 'Adding git-svn instructions to the README'
	[master 97031e5] Adding git-svn instructions to the README
	 1 files changed, 1 insertions(+), 1 deletions(-)

次に、これをプッシュして上流を変更しなければなりません。この変更が Subversion に対してどのように作用するのかに注意しましょう。オフラインで行った複数のコミットを、すべて一度に Subversion サーバーにプッシュすることができます。Subversion サーバーにプッシュするには `git svn dcommit` コマンドを使います。

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r79
	       M      README.txt
	r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

このコマンドは、Subversionサーバーからのコード上で行われたすべてのコミットに対して個別に Subversion 上にコミットし、ローカルの Git のコミットを書き換えて一意な識別子を含むようにします。ここで重要なのは、書き換えによってすべてのローカルコミットの SHA-1 チェックサムが変化するということです。この理由もあって、Git ベースのリモートリポジトリにあるプロジェクトと Subversion サーバーを同時に使うことはおすすめできません。直近のコミットを調べれば、新たに `git-svn-id` が追記されたことがわかります。

	$ git log -1
	commit 938b1a547c2cc92033b74d32030e86468294a5c8
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sat May 2 22:06:44 2009 +0000

	    Adding git-svn instructions to the README

	    git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

元のコミットの SHA チェックサムが `97031e5` で始まっていたのに対して今は `938b1a5` に変わっていることに注目しましょう。Git と Subversion の両方のサーバーにプッシュしたい場合は、まず Subversion サーバーにプッシュ (`dcommit`) してから Git のほうにプッシュしなければなりません。dcommit でコミットデータが書き換わるからです。

## 新しい変更の取り込み

複数の開発者と作業をしていると、遅かれ早かれ、誰かがプッシュしたあとに他の人がプッシュしようとして衝突を起こすということが発生します。他の人の作業をマージするまで、その変更は却下されます。`git svn` では、このようになります。

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	Merge conflict during commit: Your file or directory 'README.txt' is probably \
	out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
	core/git-svn line 482

この状態を解決するには `git svn rebase` を実行します。これは、サーバー上の変更のうちまだ取り込んでいない変更をすべて取り込んでから、自分の作業をリベースします。

	$ git svn rebase
	       M      README.txt
	r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
	First, rewinding head to replay your work on top of it...
	Applying: first user change

これで手元の作業が Subversion サーバー上の最新状態の上でなされたことになったので、無事に `dcommit` することができます。

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r81
	       M      README.txt
	r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

ここで注意すべき点は、Git の場合は上流での変更をすべてマージしてからでなければプッシュできないけれど、`git svn` の場合は衝突さえしなければマージしなくてもプッシュできるということです。だれかがあるファイルを変更した後で自分が別のファイルを変更してプッシュしても、`dcommit` は正しく動作します。

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      configure.ac
	Committed r84
	       M      autogen.sh
	r83 = 8aa54a74d452f82eee10076ab2584c1fc424853b (trunk)
	       M      configure.ac
	r84 = cdbac939211ccb18aa744e581e46563af5d962d0 (trunk)
	W: d2f23b80f67aaaa1f6f5aaef48fce3263ac71a92 and refs/remotes/trunk differ, \
	  using rebase:
	:100755 100755 efa5a59965fbbb5b2b0a12890f1b351bb5493c18 \
	  015e4c98c482f0fa71e4d5434338014530b37fa6 M   autogen.sh
	First, rewinding head to replay your work on top of it...
	Nothing to do.

これは忘れずに覚えておきましょう。というのも、プッシュした後の結果はどの開発者の作業環境にも存在しない状態になっているからです。たまたま衝突しなかっただけで互換性のない変更をプッシュしてしまったときに、その問題を見つけるのが難しくなります。これが、Git サーバーを使う場合と異なる点です。Git の場合はクライアントの状態をチェックしてからでないと変更を公開できませんが、SVN の場合はコミットの直前とコミット後の状態が同等であるかどうかすら確かめられないのです。

もし自分のコミット準備がまだできていなくても、Subversion から変更を取り込むときにもこのコマンドを使わなければなりません。`git svn fetch` でも新しいデータを取得することはできますが、`git svn rebase` はデータを取得するだけでなくローカルのコミットの更新も行います。

	$ git svn rebase
	       M      generate_descriptor_proto.sh
	r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
	First, rewinding head to replay your work on top of it...
	Fast-forwarded master to refs/remotes/trunk.

`git svn rebase` をときどき実行しておけば、手元のコードを常に最新の状態に保っておけます。しかし、このコマンドを実行するときには作業ディレクトリがクリーンな状態であることを確認しておく必要があります。手元で変更をしている場合は、stash で作業を退避させるか一時的にコミットしてからでないと `git svn rebase` を実行してはいけません。さもないと、もしリベースの結果としてマージが衝突すればコマンドの実行が止まってしまいます。

## Git でのブランチに関する問題

Git のワークフローに慣れてくると、トピックブランチを作ってそこで作業を行い、それをマージすることもあるでしょう。git svn を使って Subversion サーバーにプッシュする場合は、それらのブランチをまとめてプッシュするのではなく一つのブランチ上にリベースしてからプッシュしたくなるかもしれません。リベースしたほうがよい理由は、Subversion はリニアに歴史を管理していて Git のようなマージができないからです。git svn がスナップショットを Subversion のコミットに変換するときには、最初の親だけに続けます。

歴史が次のような状態になっているものとしましょう。`experiment` ブランチを作ってそこで 2 回のコミットを済ませ、それを `master` にマージしたところです。ここで `dcommit` すると、出力はこのようになります。

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      CHANGES.txt
	Committed r85
	       M      CHANGES.txt
	r85 = 4bfebeec434d156c36f2bcd18f4e3d97dc3269a2 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk
	COPYING.txt: locally modified
	INSTALL.txt: locally modified
	       M      COPYING.txt
	       M      INSTALL.txt
	Committed r86
	       M      INSTALL.txt
	       M      COPYING.txt
	r86 = 2647f6b86ccfcaad4ec58c520e369ec81f7c283c (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

歴史をマージしたブランチで `dcommit` を実行してもうまく動作します。ただし、Git プロジェクト上での歴史を見ると、`experiment` ブランチ上でのコミットは書き換えられていません。そこでのすべての変更は、SVN 上での単一のマージコミットとなっています。

他の人がその作業をクローンしたときには、すべての作業をひとまとめにしたマージコミットしか見ることができません。そのコミットがどこから来たのか、そしていつコミットされたのかを知ることができないのです。

## Subversion のブランチ

Subversion のブランチは Git のブランチとは異なります。可能ならば、Subversion のブランチは使わないようにするのがベストでしょう。しかし、Subversion のブランチの作成やコミットも、git svn を使ってすることができます。

### 新しい SVN ブランチの作成

Subversion に新たなブランチを作るには `git svn branch [branchname]` を実行します。

	$ git svn branch opera
	Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
	Found possible branch point: file:///tmp/test-svn/trunk => \
	  file:///tmp/test-svn/branches/opera, 87
	Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
	Following parent with do_switch
	Successfully followed parent
	r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

これは Subversion の `svn copy trunk branches/opera` コマンドと同じ意味で、Subversion サーバー上で実行されます。ここで注意すべき点は、このコマンドを実行しても新しいブランチに入ったことにはならないということです。この後コミットをすると、そのコミットはサーバーの `trunk` に対して行われます。`opera` ではありません。

## アクティブなブランチの切り替え

Git が dcommit の行き先のブランチを決めるときには、あなたの手元の歴史上にある Subversion ブランチのいずれかのヒントを使います。手元にはひとつしかないはずで、それは現在のブランチの歴史上の直近のコミットにある `git-svn-id` です。

複数のブランチを同時に操作するときは、ローカルブランチを `dcommit` でその Subversion ブランチにコミットするのかを設定することができます。そのためには、Subversion のブランチをインポートしてローカルブランチを作ります。`opera` ブランチを個別に操作したい場合は、このようなコマンドを実行します。

	$ git branch opera remotes/opera

これで、`opera` ブランチを `trunk` (手元の `master` ブランチ) にマージするときに通常の `git merge` が使えるようになりました。しかし、そのときには適切なコミットメッセージを (`-m` で) 指定しなければなりません。さもないと、有用な情報ではなく単なる "Merge branch opera" というメッセージになってしまいます。

`git merge` を使ってこの操作を行ったとしても、そしてそれが Subversion でのマージよりもずっと簡単だったとしても (Git は自動的に適切なマージベースを検出してくれるからね)、これは通常の Git のマージコミットとは違うということを覚えておきましょう。このデータを Subversion に書き戻すことになりますが Subversion では複数の親を持つコミットは処理できません。そのため、プッシュした後は、別のブランチ上で行ったすべての操作をひとまとめにした単一のコミットに見えてしまいます。あるブランチを別のブランチにマージしたら、元のブランチに戻って作業を続けるのは困難です。Git なら簡単なのですが。`dcommit` コマンドを実行すると、どのブランチからマージしたのかという情報はすべて消えてしまいます。そのため、それ以降のマージ元の算出は間違ったものとなります。dcommit は、`git merge` の結果をまるで `git merge --squash` を実行したのと同じ状態にしてしまうのです。残念ながら、これを回避するよい方法はありません。Subversion 側にこの情報を保持する方法がないからです。Subversion をサーバーに使う以上は、常にこの制約に縛られることになります。問題を回避するには、trunk にマージしたらローカルブランチ (この場合は `opera`) を削除しなければなりません。

## Subversion コマンド

`git svn` ツールセットには、Git への移行をしやすくするための多くのコマンドが用意されています。Subversion で使い慣れていたのと同等の機能を提供するコマンド群です。その中からいくつかを紹介します。

### SVN 形式のログ

Subversion に慣れているので SVN が出力する形式で歴史を見たい、という場合は `git svn log` を実行しましょう。すると、コミットの歴史が SVN 形式で表示されます。

	$ git svn log
	------------------------------------------------------------------------
	r87 | schacon | 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009) | 2 lines

	autogen change

	------------------------------------------------------------------------
	r86 | schacon | 2009-05-02 16:00:21 -0700 (Sat, 02 May 2009) | 2 lines

	Merge branch 'experiment'

	------------------------------------------------------------------------
	r85 | schacon | 2009-05-02 16:00:09 -0700 (Sat, 02 May 2009) | 2 lines

	updated the changelog

`git svn log` に関して知っておくべき重要なことがふたつあります。まず。このコマンドはオフラインで動作します。実際の `svn log` コマンドのように Subversion サーバーにデータを問い合わせたりしません。次に、すでに Subversion サーバーにコミット済みのコミットしか表示されません。つまり、ローカルの Git へのコミットのうちまだ dcommit していないものは表示されないし、その間に他の人が Subversion サーバーにコミットした内容も表示されません。最後に Subversion サーバーの状態を調べたときのログが表示されると考えればよいでしょう。

### SVN アノテーション

`git svn log` コマンドが `svn log` コマンドをオフラインでシミュレートしているのと同様に、`svn annotate` と同様のことを `git svn blame [FILE]` で実現できます。出力は、このようになります。

	$ git svn blame README.txt
	 2   temporal Protocol Buffers - Google's data interchange format
	 2   temporal Copyright 2008 Google Inc.
	 2   temporal http://code.google.com/apis/protocolbuffers/
	 2   temporal
	22   temporal C++ Installation - Unix
	22   temporal =======================
	 2   temporal
	79    schacon Committing in git-svn.
	78    schacon
	 2   temporal To build and install the C++ Protocol Buffer runtime and the Protocol
	 2   temporal Buffer compiler (protoc) execute the following:
	 2   temporal

先ほどと同様、このコマンドも Git にローカルにコミットした内容や他から Subversion にプッシュされていたコミットは表示できません。

### SVN サーバ情報

`svn info` と同様のサーバー情報を取得するには `git svn info` を実行します。

	$ git svn info
	Path: .
	URL: https://schacon-test.googlecode.com/svn/trunk
	Repository Root: https://schacon-test.googlecode.com/svn
	Repository UUID: 4c93b258-373f-11de-be05-5f7a86268029
	Revision: 87
	Node Kind: directory
	Schedule: normal
	Last Changed Author: schacon
	Last Changed Rev: 87
	Last Changed Date: 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009)

`blame` や `log` と同様にこれもオフラインで動作し、最後に Subversion サーバーと通信した時点での情報しか表示されません。

### Subversion が無視するものを無視する

どこかに `svn:ignore` プロパティが設定されている Subversion リポジトリをクローンした場合は、対応する `.gitignore` ファイルを用意したくなることでしょう。コミットすべきではないファイルを誤ってコミットしてしまうことを防ぐためにです。`git svn` には、この問題に対応するためのコマンドが二つ用意されています。まず最初が `git svn create-ignore` で、これは、対応する `.gitignore` ファイルを自動生成して次のコミットに含めます。

もうひとつは `git svn show-ignore` で、これは `.gitignore` に書き込む内容を標準出力に送ります。この出力を、プロジェクトの exclude ファイルにリダイレクトしましょう。

	$ git svn show-ignore > .git/info/exclude

これで、プロジェクトに `.gitignore` ファイルを散らかさなくてもよくなります。Subversion 使いのチームの中で Git を使うのが自分だけだという場合、他のメンバーにとっては `.gitignore` ファイルは目障りでしょう。そのような場合はこの方法が使えます。

## Git-Svn のまとめ

`git svn` ツール群は、Subversion サーバーに行き詰まっている場合や使っている開発環境が Subversion サーバー前提になっている場合などに便利です。Git のできそこないだと感じるかもしれません。また、他のメンバーとの間で混乱が起こるかもしれません。トラブルを避けるために、次のガイドラインに従いましょう。

* Git の歴史をリニアに保ち続け、`git merge` によるマージコミットを含めないようにする。本流以外のブランチでの作業を書き戻すときは、マージではなくリベースすること。
* Git サーバーを別途用意したりしないこと、新しい開発者がクローンするときのスピードをあげるためにサーバーを用意することはあるでしょうが、そこに `git-svn-id` エントリを持たないコミットをプッシュしてはいけません。`pre-receive` フックを追加してコミットメッセージをチェックし、`git-svn-id` がなければプッシュを拒否するようにしてもよいでしょう。

これらのガイドラインを守れば、Subversion サーバーでの作業にも耐えられることでしょう。しかし、もし本物の Git サーバーに移行できるのなら、そうしたほうがチームにとってずっと利益になります。
