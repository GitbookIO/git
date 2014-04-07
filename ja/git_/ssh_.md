# SSH 公開鍵の作成

多くの Git サーバーでは、SSH の公開鍵認証を使用しています。この方式を使用するには、各ユーザーが自分の公開鍵を作成しなければなりません。公開鍵のつくりかたは、OS が何であってもほぼ同じです。まず、自分がすでに公開鍵を持っていないかどうか確認します。デフォルトでは、各ユーザーの SSH 鍵はそのユーザーの `~/.ssh` ディレクトリに置かれています。自分が鍵を持っているかどうかを確認するには、このディレクトリに行ってその中身を調べます。

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

そして「○○」「○○.pub」というファイル名の組み合わせを探します。「○○」の部分は、通常は `id_dsa` あるいは `id_rsa` となります。もし見つかったら、`.pub` がついているほうのファイルがあなたの公開鍵で、もう一方があなたの秘密鍵です。そのようなファイルがない (あるいはそもそも `.ssh` ディレクトリがない) 場合は、`ssh-keygen` というプログラムを実行してそれを作成します。このプログラムは Linux/Mac なら SSH パッケージに含まれており、Windows では MSysGit パッケージに含まれています。

	$ ssh-keygen
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
	Enter passphrase (empty for no passphrase):
	Enter same passphrase again:
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

まず、鍵の保存先 (`.ssh/id_rsa`) を指定し、それからパスフレーズを二回入力するよう求められます。鍵を使うときにパスフレーズを入力したくない場合は、パスフレーズを空のままにしておきます。

さて、次に各ユーザーは自分の公開鍵をあなた (あるいは Git サーバーの管理者である誰か) に送らなければなりません (ここでは、すでに公開鍵認証を使用するように SSH サーバーが設定済みであると仮定します)。公開鍵を送るには、`.pub` ファイルの中身をコピーしてメールで送ります。公開鍵は、このようなファイルになります。

	$ cat ~/.ssh/id_rsa.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

各種 OS 上での SSH 鍵の作り方については、GitHub の `http://github.com/guides/providing-your-ssh-key` に詳しく説明されています。
