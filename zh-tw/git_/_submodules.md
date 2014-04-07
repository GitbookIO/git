# 子模組 (Submodules)

經常有這樣的事情，當你在一個專案上工作時，你需要在其中使用另外一個專案。也許它是一個協力廠商開發的程式庫(Library)，或者是你另外開發給多個父專案使用的子專案。在這個情境下產生了一個常見的問題：你想將這兩個專案分開處理，但是又需要在其中一個中使用另外一個。 

這裡有一個例子。假設你在開發一個網站，並提供 Atom 訂閱(Atom feeds)。你不想自己編寫產生 Atom 的程式，而是決定使用一個 Library。你可能必須從 CPAN install 或者 Ruby gem 之類的共用庫(shared library)將那段程式 include 進來，或者將原始程式碼複製到你的專案樹中。如果採用包含程式庫的辦法，那麼不管用什麼辦法都很難對這個程式庫做客製化(customize)，部署它就更加困難了，因為你必須確保每個客戶都擁有那個程式庫。把程式碼包含到你自己的專案中帶來的問題是，當上游被修改時，任何你進行的客製化的修改都很難歸併(merge)。 

Git 通過子模組處理這個問題。子模組允許你將一個 Git 倉庫當作另外一個 Git 倉庫的子目錄。這允許你 clone 另外一個倉庫到你的專案中並且保持你的提交相對獨立。 

## 子模組初步

假設你想把 Rack library（一個 Ruby 的 web 伺服器閘道介面）加入到你的專案中，可能既要保持你自己的變更，又要延續上游的變更。首先你要把外部的倉庫 clone 到你的子目錄中。你通過 `git submodule add` 命令將外部專案加為子模組： 

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.

現在你就在專案裡的 `rack` 子目錄下有了一個 Rack 專案。你可以進入那個子目錄，進行變更，加入你自己的遠端可寫倉庫來推送你的變更，從原始倉庫拉取(pull)和歸併等等。如果你在加入子模組後立刻運行 `git status`，你會看到下面兩項： 

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

首先你注意到有一個 `.gitmodules` 文件。這是一個設定檔，保存了專案 URL 和你拉取到的本地子目錄 

	$ cat .gitmodules
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

如果你有多個子模組，這個檔裡會有多個條目。很重要的一點是這個文件跟其他文件一樣也是處於版本控制之下的，就像你的 `.gitignore` 檔一樣。它跟專案裡的其他檔一樣可以被推送和拉取。這是其他 clone 此專案的人獲知子模組專案來源的途徑。 

`git status` 的輸出裡所列的另一項 rack 。如果你在它上面執行 `git diff`，會發現一些有趣的東西： 

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

儘管 rack 是你工作目錄裡的子目錄，但 Git 把它視作一個子模組，當你不在那個目錄裡的時候，Git 並不會追蹤記錄它的內容。取而代之的是，Git 將它記錄成來自那個倉庫的一個特殊的提交。當你在那個子目錄裡修改並提交時，子專案會通知那裡的 HEAD 已經發生變更並記錄你當前正在工作的那個提交；通過那樣的方法，當其他人 clone 此專案，他們可以重新創建一致的環境。 

這是關於子模組的重要一點：你記錄他們當前確切所處的提交。你不能記錄一個子模組的 `master` 或者其他的符號引用(symbolic reference)。 

當你提交時，會看到類似如下： 

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

注意 rack 條目的 160000 模式。這在 Git 中是一個特殊模式，基本意思是你將一個提交記錄為一個目錄項而不是子目錄或者檔案。 

你可以將 `rack` 目錄當作一個獨立的專案，保持一個指向子目錄的最新提交的指標然後反復地更新上層專案。所有的 Git 命令都在兩個子目錄裡獨立工作： 

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

## Clone 一個帶子模組的專案

這裡你將 clone 一個帶子模組的專案。當你接收到這樣一個專案，你將得到了包含子專案的目錄，但裡面沒有檔案： 

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

`rack` 目錄存在了，但是是空的。你必須執行兩個命令：`git submodule init` 來初始化你的本地設定檔，`git submodule update` 來從那個專案拉取所有資料並 check out 你上層專案裡所列的合適的提交： 

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

現在你的 `rack` 子目錄就處於你先前提交的確切狀態了。如果另外一個開發者變更了 rack 的代碼並提交，你拉取那個引用然後歸併之，你會得到有點怪怪的東西： 

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

你歸併進來的僅僅是一個指向你的子模組的指標；但是它並不更新你子模組目錄裡的代碼，所以看起來你的工作目錄處於一個臨時狀態(dirty state)： 

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

事情就是這樣，因為你所擁有的子模組的指標，並沒有對應到子模組目錄的真實狀態。為了修復這一點，你必須再次運行 `git submodule update`： 

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

每次你從主專案中拉取一個子模組的變更都必須這樣做。看起來很怪但是管用。 

一個常見問題是當開發者對子模組做了一個本地的變更但是並沒有推送到公共伺服器。然後他們提交了一個指向那個非公開狀態的指標然後推送上層專案。當其他開發者試圖運行 `git submodule update`，那個子模組系統會找不到所引用的提交，因為它只存在于第一個開發者的系統中。如果發生那種情況，你會看到類似這樣的錯誤： 

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

你不得不去查看誰最後變更了子模組：

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

然後，你給那個傢伙發電子郵件說他一通。 

## 上層專案

有時候，開發者想按照他們的分組獲取一個大專案的子目錄的子集。如果你是從 CVS 或者 Subversion 遷移過來的話這個很常見，在那些系統中你已經定義了一個模組或者子目錄的集合，而你想延續這種類型的工作流程。

在 Git 中實現這個的一個好辦法是你將每一個子目錄都做成獨立的 Git 倉庫，然後創建一個上層專案的 Git 倉庫包含多個子模組。這個辦法的一個優勢是，你可以在上層專案中通過標籤和分支更為明確地定義專案之間的關係。 

## 子模組的問題

使用子模組並非沒有任何缺點。首先，你在子模組目錄中工作時必須相對小心。當你執行 `git submodule update`，它會 check out 專案的指定版本，但是不在分支內。這叫做獲得一個分離的頭(detached head)——這意味著 HEAD 檔直接指向一次提交，而不是一個符號引用(symbolic reference)。問題在於你通常並不想在一個分離的頭的環境下工作，因為太容易丟失變更了。如果你先執行了一次 `submodule update`，然後在那個子模組目錄裡不創建分支就進行提交，然後再次從上層專案裡執行 `git submodule update` 同時不進行提交，Git 會毫無提示地覆蓋你的變更。技術上講你不會丟失工作，但是你將失去指向它的分支，因此會很難取得。 

為了避免這個問題，當你在子模組目錄裡工作時應使用 `git checkout -b work` 或類似的命令來 創建一個分支。當你再次在子模組裡更新的時候，它仍然會覆蓋你的工作，但是至少你擁有一個可以回溯的指標。 

切換帶有子模組的分支同樣也很有技巧。如果你創建一個新的分支，增加了一個子模組，然後切換回不帶該子模組的分支，你仍然會擁有一個未被追蹤的子模組的目錄 ：

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/

你將不得不將它移走或者刪除，這樣的話當你切換回去的時候必須重新 clone 它——你可能會丟失你未推送的本地的變更或分支。 

最後一個需要注意的是關於從子目錄切換到子模組。如果你已經追蹤了你專案中的一些檔案，但是想把它們移到子模組去，你必須非常小心，否則 Git 會生你的氣。假設你的專案中有一個子目錄裡放了 rack 的檔，然後你想將它轉換為子模組。如果你刪除子目錄然後執行 `submodule add`，Git 會向你大吼： 

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

你必須先將 `rack` 目錄撤回(unstage)。然後你才能加入子模組： 

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.

現在假設你在一個分支裡那樣做了。如果你嘗試切換回一個仍然在目錄裡保留那些檔而不是子模組的分支時——你會得到下面的錯誤： 

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

你必須先移除 `rack` 子模組的目錄才能切換到不包含它的分支：

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

然後，當你切換回來，你會得到一個空的 `rack` 目錄。你可以執行 `git submodule update` 重新 clone，也可以將 `/tmp/rack` 目錄重新移回空目錄。
