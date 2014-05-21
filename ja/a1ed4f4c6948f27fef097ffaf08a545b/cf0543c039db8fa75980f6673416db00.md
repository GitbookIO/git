# GitWeb

これで、読み書き可能なアクセス方法と読み込み専用のアクセス方法を用意できるようになりました。次にほしくなるのは、ウェブベースでの閲覧方法でしょうか。Git には標準で GitWeb という CGI スクリプトが付属しており、これを使うことができます。GitWeb の使用例は、たとえば `http://git.kernel.org` で確認できます (図 4-1 を参照ください)。


![](http://git-scm.com/figures/18333fig0401-tn.png)

図 4-1. GitWeb のユーザーインターフェイス

自分のプロジェクトでためしに GitWeb を使ってみようという人のために、一時的なインスタンスを立ち上げるためのコマンドが Git に付属しています。これを実行するには `lighttpd` や `webrick` といった軽量なサーバーが必要です。Linux マシンなら、たいてい `lighttpd` がインストールされています。これを実行するには、プロジェクトのディレクトリで `git instaweb` と打ち込みます。Mac の場合なら、Leopard には Ruby がプレインストールされています。したがって `webrick` が一番よい選択肢でしょう。`instaweb` を lighttpd 以外で実行するには、`--httpd` オプションを指定します。

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

これは、HTTPD サーバーをポート 1234 で起動させ、自動的にウェブブラウザーを立ち上げてそのページを表示させます。非常にお手軽です。ひととおり見終えてサーバーを終了させたくなったら、同じコマンドに `--stop` オプションをつけて実行します。

	$ git instaweb --httpd=webrick --stop

ウェブインターフェイスをチーム内で常時立ち上げたりオープンソースプロジェクト用に公開したりする場合は、CGI スクリプトを設定して通常のウェブサーバーに配置しなければなりません。Linux のディストリビューションの中には、`apt` や `yum` などで `gitweb` パッケージが用意されているものもあります。まずはそれを探してみるとよいでしょう。手動での GitWeb のインストールについて、さっと流れを説明します。まずは Git のソースコードを取得しましょう。その中に GitWeb が含まれており、CGI スクリプトを作ることができます。

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb
	$ sudo cp -Rf gitweb /var/www/

コマンドを実行する際に、Git リポジトリの場所 `GITWEB_PROJECTROOT` 変数で指定しなければならないことに注意しましょう。さて、次は Apache にこのスクリプトを処理させるようにしなければなりません。VirtualHost に次のように追加しましょう。

	<VirtualHost *:80>
	    ServerName gitserver
	    DocumentRoot /var/www/gitweb
	    <Directory /var/www/gitweb>
	        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
	        AllowOverride All
	        order allow,deny
	        Allow from all
	        AddHandler cgi-script cgi
	        DirectoryIndex gitweb.cgi
	    </Directory>
	</VirtualHost>

GitWeb は、CGI に対応したウェブサーバーならどんなものを使っても動かすことができます。何か別のサーバーのほうがよいというのなら、そのサーバーで動かすのもたやすいことでしょう。これで、`http://gitserver/` にアクセスすればリポジトリをオンラインで見られるようになりました。また `http://git.gitserver` で、HTTP 越しのクローンやフェッチもできます。
