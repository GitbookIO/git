# Gitosis

ユーザーの公開鍵を `authorized_keys` にまとめてアクセス管理する方法は、しばらくの間はうまくいくでしょう。しかし、何百人ものユーザーを管理する段階になると、この方式はとても面倒になります。サーバーのシェルでの操作が毎回発生するわけですし、またアクセス制御が皆無な状態、つまり公開鍵を登録した人はすべてのプロジェクトのすべてのファイルを読み書きできる状態になってしまいます。

ここで、よく使われている Gitosis というソフトウェアについて紹介しましょう。Gitosis は、`authorized_keys` ファイルを管理したりちょっとしたアクセス制御を行ったりするためのスクリプト群です。ユーザーを追加したりアクセス権を定義したりするための UI に、ウェブではなく独自の Git リポジトリを採用しているというのが興味深い点です。プロジェクトに関する情報を準備してそれをプッシュすると、その情報に基づいて Gitosis がサーバーを設定するというクールな仕組みになっています。

Gitosis のインストールは簡単だとはいえませんが、それほど難しくもありません。Linux サーバー上で運用するのがいちばん簡単でしょう。今回の例では、ごく平凡な Ubuntu 8.10 サーバーを使います。

Gitosis は Python のツールを使います。まずは Python の setuptools パッケージをインストールしなければなりません。Ubuntu なら python-setuptools というパッケージがあります。

	$ apt-get install python-setuptools

次に、プロジェクトのメインサイトから Gitosis をクローンしてインストールします。

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

これで、Gitosis が使う実行ファイル群がインストールされました。Gitosis は、リポジトリが `/home/git` にあることが前提となっています。しかしここではすでに `/opt/git` にリポジトリが存在するので、いろいろ設定しなおすのではなくシンボリックリンクを作ってしまいましょう。

	$ ln -s /opt/git /home/git/repositories

Gitosis は鍵の管理も行うので、まず現在の鍵ファイルを削除してあとでもう一度鍵を追加し、Gitosis に `authorized_keys` を自動管理させなければなりません。ここではまず `authorized_keys` を別の場所に移動します。

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

次は 'git' ユーザーのシェルをもし `git-shell` コマンドに変更していたのなら、元に戻さなければなりません。人にログインさせるのではなく、かわりに Gitosis に管理してもらうのです。`/etc/passwd` ファイルにある

	git:x:1000:1000::/home/git:/usr/bin/git-shell

の行を、次のように戻しましょう。

	git:x:1000:1000::/home/git:/bin/sh

いよいよ Gitosis の初期設定です。自分の秘密鍵を使って `gitosis-init` コマンドを実行します。サーバー上に自分の公開鍵をおいていない場合は、まず公開鍵をコピーしましょう。

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

これで、指定した鍵を持つユーザーが Gitosis 用の Git リポジトリを変更できるようになりました。次に、新しいリポジトリの `post-update` スクリプトに実行ビットを設定します。

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

これで準備完了です。きちんと設定できていれば、Gitosis の初期設定時に登録した公開鍵を使って SSH でサーバーにログインできるはずです。結果はこのようになります。

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
    ERROR:gitosis.serve.main:Need SSH_ORIGINAL_COMMAND in environment.
	  Connection to gitserver closed.

これは「何も Git のコマンドを実行していないので、接続を拒否した」というメッセージです。では、実際に何か Git のコマンドを実行してみましょう。Gitosis 管理リポジトリをクローンします。

	# on your local computer
	$ git clone git@gitserver:gitosis-admin.git

`gitosis-admin` というディレクトリができました。次のような内容になっています。

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

`gitosis.conf` が、ユーザーやリポジトリそしてパーミッションを指定するためのファイルです。`keydir` ディレクトリには、リポジトリへの何らかのアクセス権を持つ全ユーザーの公開鍵ファイルを格納します。ユーザーごとにひとつのファイルとなります。`keydir` ディレクトリ内のファイル名 (この例では `scott.pub`) は人によって異なるでしょう。これは、`gitosis-init` スクリプトでインポートした公開鍵の最後にある説明をもとにして Gitosis がつけた名前です。

`gitosis.conf` ファイルを見ると、今のところは先ほどクローンした `gitosis-admin` プロジェクトについての情報しか書かれていません。

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	members = scott
	writable = gitosis-admin

これは、'scott' ユーザー（Gitosis の初期化時に公開鍵を指定したユーザー）だけが `gitosis-admin` プロジェクトにアクセスできるという意味です。

では、新しいプロジェクトを追加してみましょう。`mobile` という新しいセクションを作成し、モバイルチームのメンバーとモバイルチームがアクセスするプロジェクトを書き入れます。今のところ存在するユーザーは 'scott' だけなので、とりあえずは彼をメンバーとして追加します。そして、新しいプロジェクト `iphone_project` を作ることにしましょう。

	[group mobile]
	members = scott
	writable = iphone_project

`gitosis-admin` プロジェクトに手を入れたら、それをコミットしてサーバーにプッシュしないと変更が反映されません。

	$ git commit -am 'add iphone_project and mobile group'
    [master 8962da8] add iphone_project and mobile group
     1 file changed, 4 insertions(+)
    $ git push origin master
	Counting objects: 5, done.
    Compressing objects: 100% (3/3), done.
    Writing objects: 100% (3/3), 272 bytes | 0 bytes/s, done.
    Total 3 (delta 0), reused 0 (delta 0)
    To git@gitserver:gitosis-admin.git
	   fb27aec..8962da8  master -> master

新しい `iphone_project` プロジェクトにプッシュするには、ローカル側のプロジェクトに、このサーバーをリモートとして追加します。サーバー側でわざわざベアリポジトリを作る必要はありません。先ほどプッシュした地点で、Gitosis が自動的にベアリポジトリの作成を済ませています。

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
    Writing objects: 100% (3/3), 230 bytes | 0 bytes/s, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

パスを指定する必要がないことに注目しましょう (実際、パスを指定しても動作しません)。コロンの後にプロジェクト名を指定するだけで、Gitosis がプロジェクトを見つけてくれます。

このプロジェクトに新たなメンバーを迎え入れることになりました、公開鍵を追加しなければなりません。しかし、今までのようにサーバー上の `~/.ssh/authorized_keys` に追記する必要はありません。ユーザー単位の鍵ファイルを `keydir` ディレクトリ内に置くだけです。鍵ファイルにつけた名前が、`gitosis.conf` でその人を指定するときの名前となります。では、John と Josie そして Jessica の公開鍵を追加しましょう。

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

そして彼らを 'mobile' チームに追加し、`iphone_project` を読み書きできるようにします。

	[group mobile]
	members = scott john josie jessica
	writable = iphone_project

この変更をコミットしてプッシュすると、この四人のユーザーがプロジェクトへの読み書きをできるようになります。

Gitosis にはシンプルなアクセス制御機能もあります。John には読み込み専用のアクセス権を設定したいという場合は、このようにします。

	[group mobile]
	members = scott josie jessica
	writable = iphone_project

	[group mobile_ro]
	members = john
	readonly = iphone_project

John はプロジェクトをクローンして変更内容を受け取れます。しかし、手元での変更をプッシュしようとすると Gitosis に拒否されます。このようにして好きなだけのグループを作成し、それぞれに個別のユーザーとプロジェクトを含めることができます。また、グループのメンバーとして別のグループを指定し (その場合は先頭に `@` をつけます)、メンバーを自動的に継承することもできます。

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	members   = @mobile_committers
	writable  = iphone_project

	[group mobile_2]
	members   = @mobile_committers john
	writable  = another_iphone_project

何か問題が発生した場合には、`[gitosis]` セクションの下に `loglevel=DEBUG` を書いておくと便利です。設定ミスでプッシュ権限を奪われてしまった場合は、サーバー上の `/home/git/.gitosis.conf` を直接編集して元に戻します。Gitosis は、このファイルから情報を読み取っています。`gitosis.conf` ファイルへの変更がプッシュされてきたときに、その内容をこのファイルに書き出します。このファイルを手動で変更しても、次に `gitosis-admin` プロジェクトへのプッシュが成功した時点でその内容が書き換えられることになります。
