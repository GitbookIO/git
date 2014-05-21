# 参照仕様（Refspec）

本書の全体に渡って、リモートブランチからローカルの参照へのシンプルなマッピングを使用してきました。しかし、それらはもっと複雑なものです。以下のようにリモートを追加したとしましょう。

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

`.git/config` ファイルにセクションを追加して、リモート（`origin`）の名前、リモートレポジトリのURL、そしてフェッチするための参照仕様（refspec）を指定します。

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

参照仕様はコロン（:）で分割した `<src>:<dst>` の形式で、オプションとして先頭に `+` を付けます。`<src>` はリモート側への参照に対するパターンで、`<dst>` はそれらの参照がローカル上で書かれる場所を示します。`+` の記号は Git にそれが早送り（fast-forward）でない場合でも参照を更新することを伝えます。

デフォルトのケースでは `git remote add` コマンドを実行することで自動的に書かれます。このコマンドを実行すると、Git はサーバ上の `refs/heads/` 以下にあるすべての参照をフェッチして、ローカル上の `refs/remotes/origin/` にそれらを書きます。そのため、もしもサーバ上に `master` ブランチがあると、ローカルからそのブランチのログにアクセスすることができます。

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

これらはすべて同じ意味を持ちます。なぜなら、Git はそれら各々を `refs/remotes/origin/master` に拡張するからです。

その代わりに、Git に毎回 `master` ブランチのみを引き出して、リモートサーバ上のそれ以外のすべてのブランチは引き出さないようにしたい場合は、フェッチラインを以下のように変更します。

	fetch = +refs/heads/master:refs/remotes/origin/master

これはまさにリモートへの `git fetch` に対する参照仕様のデフォルトの振る舞いです。
もし何かを一度実行したければ、コマンドライン上の参照仕様を指定することもできます。
リモート上の `master` ブランチをプルして、ローカル上の `origin/mymaster` に落とすには、以下のように実行します。

	$ git fetch origin master:refs/remotes/origin/mymaster

複数の参照仕様を指定することも可能です。コマンドライン上で、幾つかのブランチをこのように引き落とす（pull down）ことができます。

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

このケースでは、master ブランチのプルは早送りの参照ではなかったため拒否されました。`+` の記号を参照仕様の先頭に指定することで、それを上書きすることができます。

さらに設定ファイルの中のフェッチ設定に複数の参照仕様を指定することができます。もし master と実験用のブランチを常にフェッチしたいならば、二行を追加します。

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

ブロブの一部をパターンに使用することはできません。これは無効となります。

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

しかし、似たようなことを達成するのに名前空間を使用することができます。もし一連のブランチをプッシュしてくれる QAチームがいて、master ブランチと QAチームのブランチのみを取得したいならば、設定ファイルのセクションを以下のように使用することができます。

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

QAチームと開発チームがローカルのブランチにプッシュして、結合チームがリモートのブランチ上でプッシュして、共同で開発するような、複雑なワークフローのプロセスであるならば、このように、名前空間によってそれらを簡単に分類することができます。

## 参照仕様へのプッシュ

その方法で名前空間で分類された参照をフェッチできることは素晴らしいことです。しかし、そもそもどうやって QAチームは、彼らのブランチを `qa/` という名前空間の中で取得できるのでしょうか?
参照仕様にプッシュすることによってそれが可能です。

QAチームが彼らの `master` ブランチをリモートサーバ上の `qa/master` にプッシュしたい場合、以下のように実行します。

	$ git push origin master:refs/heads/qa/master

もし彼らが `git push origin` を実行する都度、Git に自動的にそれを行なってほしいならば、設定ファイルに `push` の値を追加することで目的が達成されます。

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

再度、これは `git push origin` の実行をローカルの `master` ブランチに、リモートの `qa/master` ブランチに、デフォルトで引き起こします。

## 参照の削除

また、リモートサーバから以下のように実行することによって、参照仕様を参照を削除する目的で使用することもできます。

	$ git push origin :topic

参照仕様は `<src>:<dst>` という形式であり、`<src>` の部分を取り除くことは、要するに何もないブランチをリモート上に作ることであり、それを削除することになるのです。
