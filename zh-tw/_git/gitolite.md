# Gitolite

This section serves as a quick introduction to Gitolite, and provides basic installation and setup instructions.  不能完全替代隨 gitolite 自帶的大量文檔。 There may also be occasional changes to this section itself, so you may also want to look at the latest version [here][gldpg].

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

Gitolite is an authorization layer on top of Git, relying on `sshd` or `httpd` for authentication.  (Recap: authentication is identifying who the user is, authorization is deciding if he is allowed to do what he is attempting to).

Gitolite 允許你定義訪問許可而不只作用於倉庫，而同樣於倉庫中的每個branch和tag name。你可以定義確切的人 (或一組人) 只能push特定的 "refs" (或者branches或者tags)而不是其他人。

## 安裝

安裝 Gitolite非常簡單, 你甚至不用讀自帶的那一大堆文檔。你需要一個unix伺服器上的帳戶；許多linux變種和solaris 10都已經試過了。你不需要root訪問，假設git，perl，和一個openssh相容的ssh伺服器已經裝好了。在下面的例子裡，我們會用 `git` 帳戶在 `gitserver`上.

Gitolite 是不同於 "server" 的軟體 -- 通過ssh訪問, 而且每個在伺服器上的userid都是一個潛在的 "gitolite host". We will describe the simplest install method in this article; for the other methods please see the documentation.

To begin, create a user called `git` on your server and login to this user.  Copy your SSH public key (a file called `~/.ssh/id_rsa.pub` if you did a plain `ssh-keygen` with all the defaults) from your workstation, renaming it to `<yourname>.pub` (we'll use `scott.pub` in our examples).  Then run these commands:

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	    # assumes $HOME/bin exists and is in your $PATH
	$ gitolite setup -pk $HOME/scott.pub

That last command creates new Git repository called `gitolite-admin` on the server.

Finally, back on your workstation, run `git clone git@gitserver:gitolite-admin`. And you’re done!  Gitolite has now been installed on the server, and you now have a brand new repository called `gitolite-admin` in your workstation.  You administer your Gitolite setup by making changes to this repository and pushing.

## 定制安裝

默認快速安裝對大多數人都管用，還有一些定制安裝方法如果你用的上的話。Some changes can be made simply by editing the rc file, but if that is not sufficient, there’s documentation on customising Gitolite.

## 設定檔和訪問規則

安裝結束後，你切換到 `gitolite-admin` 倉庫 (放在你的 HOME 目錄) 然後看看都有啥：

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

注意 "scott" ( 之前用`gl-setup` 命令時候的 pubkey 名稱) 有讀寫許可權而且在 `gitolite-admin` 倉庫裡有一個同名的公開金鑰檔。

Adding users is easy.  To add a user called "alice", obtain her public key, name it `alice.pub`, and put it in the `keydir` directory of the clone of the `gitolite-admin` repo you just made on your workstation.  Add, commit, and push the change, and the user has been added.

gitolite設定檔的語法在 `conf/example.conf`裡，我們只會提到一些主要的。

你可以給用戶或者倉庫分組。分組名就像一些宏；定義的時候，無所謂他們是工程還是使用者；區別在於你’使用‘“宏”的時候

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

你可以控制許可在 "ref" 級別。在下面的例子裡，實習生可以 push "int" branch.  工程師可以 push任何有 "eng-"開頭的branch，還有refs/tags下面用 "rc"開頭的後面跟數字的。而且管理員可以隨便改 (包括rewind) 對任何參考名.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

在 `RW` or `RW+`之後的運算式是規則運算式 (regex) 對應著後面的push用的參考名字 (ref) 。所以我們叫它 "參考正則"（refex）！當然，一個 refex 可以比這裡表現的更強大，所以如果你對perl的規則運算式不熟的話就不要改過頭。

同樣，你可能猜到了，Gitolite 字頭 `refs/heads/` 是一個便捷句法如果參考正則沒有用 `refs/`開頭。

一個這個設定檔語法的重要功能是，所有的倉庫的規則不需要在同一個位置。你能報所有普通的東西放在一起，就像上面的對所有 `oss_repos` 的規則那樣，然後建一個特殊的規則對後面的特殊案例，就像：

	repo gitolite
	    RW+                     = sitaram

那條規則剛剛加入規則集的 `gitolite` 倉庫.

這次你可能會想要知道存取控制規則是如何應用的，我們簡要介紹一下。

在gitolite裡有兩級存取控制。第一是在倉庫級別；如果你已經讀或者寫訪問過了任何在倉庫裡的參考，那麼你已經讀或者寫訪問倉庫了。

第二級，應用只能寫訪問，通過在倉庫裡的 branch或者 tag。用戶名如果嘗試過訪問 (`W` 或 `+`)，參考名被更新為已知。訪問規則檢查是否出現在設定檔裡，為這個聯合尋找匹配 (但是記得參考名是正則匹配的，不是字串匹配的)。如果匹配被找到了，push就成功了。不匹配的訪問會被拒絕。

## 帶'拒絕'的高級存取控制

目前，我們只看過了許可是 `R`, `RW`, 或者 `RW+`這樣子的。但是gitolite還允許另外一種許可：`-`，代表 "拒絕"。這個給了你更多的能力，當然也有一點複雜，因為不匹配並不是唯一的拒絕訪問的方法，因此規則的順序變得無關了！

這麼說好了，在前面的情況中，我們想要工程師可以 rewind 任意 branch 除了master和 integ。 這裡是如何做到的

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

你再一次簡單跟隨規則從上至下知道你找到一個匹配你的訪問模式的，或者拒絕。非rewind push到 master或者 integ 被第一條規則允許。一個 rewind push到那些 refs不匹配第一條規則，掉到第二條，因此被拒絕。任何 push (rewind 或非rewind) 到參考或者其他 master 或者 integ不會被前兩條規則匹配，即被第三條規則允許。

## 通過改變檔限制 push

此外限制用戶 push改變到哪條branch的，你也可以限制哪個檔他們可以碰的到。比如, 可能 Makefile (或者其他哪些程式) 真的不能被任何人做任何改動，因為好多東西都靠著它呢，或者如果某些改變剛好不對就會崩潰。你可以告訴 gitolite:

    repo foo
        RW                      =   @junior_devs @senior_devs

        -   VREF/NAME/Makefile  =   @junior_devs

這是一個強力的公能寫在 `conf/example.conf`裡。

## 個人分支

Gitolite 也支援一個叫 "個人分支"的功能 (或者叫, "個人分支命名空間") 在合作環境裡非常有用。

在 git世界裡許多代碼交換通過 "pull" 請求發生。然而在合作環境裡，委任制的訪問是‘絕不’，一個開發者工作站不能認證，你必須push到中心伺服器並且叫其他人從那裡pull。

這個通常會引起一些 branch 名稱簇變成像 VCS裡一樣集中化，加上設置許可變成管理員的苦差事。

Gitolite讓你定義一個 "個人的" 或者 "亂七八糟的" 命名空間字首給每個開發人員 (比如，`refs/personal/<devname>/*`)；看在 `doc/3-faq-tips-etc.mkd`裡的 "personal branches" 一段獲取細節。

## "萬用字元" 倉庫

Gitolite 允許你定義帶萬用字元的倉庫 (其實還是 perl正則式), 比如隨便整個例子的話 `assignments/s[0-9][0-9]/a[0-9][0-9]`。 這是一個非常有用的功能，需要通過設置 `$GL_WILDREPOS = 1;` 在 rc文件中啟用。允許你安排一個新許可模式 ("C") 允許用戶創建倉庫基於萬用字元，自動分配擁有權對特定用戶 - 創建者，允許他交出 R和 RW許可給其他合作用戶等等。這個功能在`doc/4-wildcard-repositories.mkd`文檔裡

## 其他功能

我們用一些其他功能的例子結束這段討論，這些以及其他功能都在 "faqs, tips, etc" 和其他文檔裡。

**記錄**: Gitolite 記錄所有成功的訪問。如果你太放鬆給了別人 rewind許可 (`RW+`) 和其他孩子弄沒了 "master"， 記錄檔會救你的命，如果其他簡單快速的找到SHA都不管用。

**訪問權報告**: 另一個方便的功能是你嘗試用ssh連接到伺服器的時候發生了什麼。Gitolite告訴你哪個 repos你訪問過，那個訪問可能是什麼。這裡是例子：

        hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4

             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**委託**：真正的大安裝，你可以把責任委託給一組倉庫給不同的人然後讓他們獨立管理那些部分。這個減少了主管理者的負擔，讓他瓶頸更小。這個功能在他自己的文檔目錄裡的 `doc/`下面。

**鏡像**: Gitolite可以幫助你維護多個鏡像，如果主要伺服器掛掉的話在他們之間很容易切換。
