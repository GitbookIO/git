# Gitosis

把所有用戶的公開金鑰保存在 `authorized_keys` 檔的做法，只能湊和一陣子，當用戶數量達到幾百人的規模時，管理起來就會十分痛苦。每次改刪用戶都必須登錄伺服器不去說，這種做法還缺少必要的許可權管理 — 每個人都對所有專案擁有完整的讀寫許可權。

幸好我們還可以選擇應用廣泛的 Gitosis 項目。簡單地說，Gitosis 就是一套用來管理 `authorized_keys` 檔和實現簡單連接限制的腳本。有趣的是，用來添加用戶和設定許可權的並非通過網頁程式，而只是管理一個特殊的 Git 倉庫。你只需要在這個特殊倉庫內做好相應的設定，然後推送到伺服器上，Gitosis 就會隨之改變運行策略，聽起來就很酷，對吧？

Gitosis 的安裝算不上傻瓜化，但也不算太難。用 Linux 伺服器架設起來最簡單 — 以下例子中，我們使用裝有 Ubuntu 8.10 系統的伺服器。

Gitosis 的工作依賴於某些 Python 工具，所以首先要安裝 Python 的 setuptools 包，在 Ubuntu 上稱為 python-setuptools：

	$ apt-get install python-setuptools

接下來，從 Gitosis 項目主頁克隆並安裝：

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

這會安裝幾個供 Gitosis 使用的工具。預設 Gitosis 會把 `/home/git` 作為存儲所有 Git 倉庫的根目錄，這沒什麼不好，不過我們之前已經把項目倉庫都放在 `/opt/git` 裡面了，所以為方便起見，我們可以做一個符號連接，直接劃轉過去，而不必重新配置：

	$ ln -s /opt/git /home/git/repositories

Gitosis 將會幫我們管理用戶公開金鑰，所以先把當前控制檔改名備份，以便稍後重新添加，準備好讓 Gitosis 自動管理 `authorized_keys` 文件：

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

接下來，如果之前把 `git` 用戶的登錄 shell 改為 `git-shell` 命令的話，先恢復 'git' 用戶的登錄 shell。改過之後，大家仍然無法通過該帳號登錄（譯注：因為 `authorized_keys` 檔已經沒有了。），不過不用擔心，這會交給 Gitosis 來實現。所以現在先打開 `/etc/passwd` 檔，把這行：

	git:x:1000:1000::/home/git:/usr/bin/git-shell

改回:

	git:x:1000:1000::/home/git:/bin/sh

好了，現在可以初始化 Gitosis 了。你可以用自己的公開金鑰執行 `gitosis-init` 命令，要是公開金鑰不在伺服器上，先臨時複製一份：

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

這樣該公開金鑰的擁有者就能修改用於配置 Gitosis 的那個特殊 Git 倉庫了。接下來，需要手工對該倉庫中的 `post-update` 腳本加上可執行許可權：

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

基本上就算是好了。如果設定過程沒出什麼差錯，現在可以試一下用初始化 Gitosis 的公開金鑰的擁有者身份 SSH 登錄伺服器，應該會看到類似下面這樣：

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	ERROR:gitosis.serve.main:Need SSH_ORIGINAL_COMMAND in environment.
	  Connection to gitserver closed.

說明 Gitosis 認出了該用戶的身份，但由於沒有運行任何 Git 命令，所以它切斷了連接。那麼，現在運行一個實際的 Git 命令 — 克隆 Gitosis 的控制倉庫：

	# 在你本地電腦上
	$ git clone git@gitserver:gitosis-admin.git

這會得到一個名為 `gitosis-admin` 的工作目錄，主要由兩部分組成：

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

`gitosis.conf` 檔是用來設置用戶、倉庫和許可權的控制檔。`keydir` 目錄則是保存所有具有存取權限用戶公開金鑰的地方— 每人一個。在 `keydir` 裡的檔案名（比如上面的 `scott.pub`）應該跟你的不一樣 — Gitosis 會自動從使用 `gitosis-init` 腳本導入的公開金鑰尾部的描述中獲取該名字。

看一下 `gitosis.conf` 檔的內容，它應該只包含與剛剛克隆的 `gitosis-admin` 相關的資訊：

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	members = scott
	writable = gitosis-admin

它顯示使用者 `scott` — 初始化 Gitosis 公開金鑰的擁有者 — 是唯一能管理 `gitosis-admin` 專案的人。

現在我們來添加一個新項目。為此我們要建立一個名為 `mobile` 的新段落，在其中羅列手機開發團隊的開發者，以及他們擁有寫許可權的專案。由於 'scott' 是系統中的唯一使用者，我們把他設為唯一用戶，並允許他讀寫名為 `iphone_project` 的新項目：

	[group mobile]
	members = scott
	writable = iphone_project

修改完之後，提交 `gitosis-admin` 裡的改動，並推送到伺服器使其生效：

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

在新工程 `iphone_project` 裡首次推送資料到伺服器前，得先設定該伺服器地址為遠端倉庫。但你不用事先到伺服器上手工創建該項目的裸倉庫— Gitosis 會在第一次遇到推送時自動創建：

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes | 0 bytes/s, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

請注意，這裡不用指明完整路徑（實際上，如果加上反而沒用），只需要一個冒號加項目名字即可 — Gitosis 會自動幫你映射到實際位置。

要和朋友們在一個專案上協同工作，就得重新添加他們的公開金鑰。不過這次不用在伺服器上一個一個手工添加到 `~/.ssh/authorized_keys` 檔末端，而只需管理 `keydir` 目錄中的公開金鑰檔。文件的命名將決定在 `gitosis.conf` 中對使用者的標識。現在我們為 John，Josie 和 Jessica 添加公開金鑰：

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

然後把他們都加進 'mobile' 團隊，讓他們對 `iphone_project` 具有讀寫許可權：

	[group mobile]
	members = scott john josie jessica
	writable = iphone_project

如果你提交並推送這個修改，四個用戶將同時具有該項目的讀寫許可權。

Gitosis 也具有簡單的存取控制功能。如果想讓 John 只有讀許可權，可以這樣做：

	[group mobile]
	members = scott josie jessica
	writable = iphone_project

	[group mobile_ro]
	members = john
	readonly = iphone_project

現在 John 可以克隆和獲取更新，但 Gitosis 不會允許他向專案推送任何內容。像這樣的組可以隨意創建，多少不限，每個都可以包含若干不同的用戶和項目。甚至還可以指定某個組為成員之一（在組名前加上 `@` 首碼），自動繼承該組的成員：

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	members   = @mobile_committers
	writable  = iphone_project

	[group mobile_2]
	members   = @mobile_committers john
	writable  = another_iphone_project

如果遇到意外問題，試試看把 `loglevel=DEBUG` 加到 `[gitosis]` 的段落（譯注：把日誌設置為調試級別，記錄更詳細的運行資訊。）。如果一不小心搞錯了配置，失去了推送許可權，也可以手工修改伺服器上的 `/home/git/.gitosis.conf` 檔 — Gitosis 實際是從該檔讀取資訊的。它在得到推送資料時，會把新的 `gitosis.conf` 存到該路徑上。所以如果你手工編輯該檔的話，它會一直保持到下次向 `gitosis-admin` 推送新版本的配置內容為止。
