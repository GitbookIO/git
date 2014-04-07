# GitWeb

現在我們的項目已經有了可讀可寫和唯讀的連接方式，不過如果能有一個簡單的 web 介面訪問就更好了。Git 自帶一個叫做 GitWeb 的 CGI 腳本，運行效果可以到 `http://git.kernel.org` 這樣的網站體驗下（見圖 4-1）。


![](http://git-scm.com/figures/18333fig0401-tn.png)

Figure 4-1. 基於網頁的 GitWeb 使用者介面

如果想看看自己項目的效果，不妨用 Git 自帶的一個命令，可以使用類似 `lighttpd` 或 `webrick` 這樣羽量級的伺服器啟動一個臨時進程。如果是在 Linux 主機上，通常都預裝了 `lighttpd` ，可以到專案目錄中鍵入 `git instaweb` 來啟動。如果用的是 Mac ，Leopard 預裝了 Ruby，所以 `webrick` 應該是最好的選擇。如果要用 lighttpd 以外的程式來啟動 `git instaweb`，可以通過 `--httpd` 選項指定：

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

這會在 1234 埠開啟一個 HTTPD 服務，隨之在流覽器中顯示該頁，十分簡單。關閉服務時，只需在原來的命令後面加上 `--stop` 選項就可以了：

	$ git instaweb --httpd=webrick --stop

如果需要為團隊或者某個開源專案長期運行 GitWeb，那麼 CGI 腳本就要由正常的網頁服務來運行。一些 Linux 發行版本可以通過 `apt` 或 `yum` 安裝一個叫做 `gitweb` 的套裝軟體，不妨首先嘗試一下。我們將快速介紹一下手動安裝 GitWeb 的流程。首先，你需要 Git 的源碼，其中帶有 GitWeb，並能生成定制的 CGI 腳本：

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb
	$ sudo cp -Rf gitweb /var/www/

注意，通過指定 `GITWEB_PROJECTROOT` 變數告訴編譯命令 Git 倉庫的位置。然後，設置 Apache 以 CGI 方式運行該腳本，添加一個 VirtualHost 配置：

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

不難想像，GitWeb 可以使用任何相容 CGI 的網頁服務來運行；如果偏向使用其他 web 伺服器，配置也不會很麻煩。現在，通過 `http://gitserver` 就可以線上訪問倉庫了，在 `http://git.server` 上還可以通過 HTTP 克隆和獲取倉庫的內容。
