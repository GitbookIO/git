# Git 與 Subversion

當前，大多數開發中的開源專案以及大量的商業專案都使用 Subversion 來管理源碼。作為最流行的開源版本控制系統，Subversion 已經存在了接近十年的時間。它在許多方面與 CVS 十分類似，後者是前者出現之前代碼控制世界的霸主。 

Git 最為重要的特性之一是名為 `git svn` 的 Subversion 雙向橋接工具。該工具把 Git 變成了 Subversion 服務的用戶端，從而讓你在本地享受到 Git 所有的功能，而後直接向 Subversion 伺服器推送內容，仿佛在本地使用了 Subversion 用戶端。也就是說，在其他人忍受古董的同時，你可以在本地享受分支合併，使用暫存區域，衍合以及單項挑揀(cherry-picking)等等。這是個讓 Git 偷偷潛入合作開發環境的好東西，在幫助你的開發同伴們提高效率的同時，它還能幫你勸說團隊讓整個專案框架轉向對 Git 的支持。這個 Subversion 之橋是通向分散式版本控制系統（DVCS, Distributed VCS ）世界的神奇隧道。 

## git svn

Git 中所有 Subversion 橋接命令的基礎是 `git svn` 。所有的命令都從它開始。相關的命令數目不少，你將通過幾個簡單的工作流程瞭解到其中常見的一些。

值得注意的是，在使用 `git svn` 的時候，你實際是在與 Subversion 互動，Git 比它要高級複雜的多。儘管可以在本地隨意的進行分支和合併，最好還是通過衍合保持線性的提交歷史，儘量避免類似「與遠端 Git 倉庫同步互動」這樣的操作。 

避免修改歷史再重新推送的做法，也不要同時推送到並行的 Git 倉庫來試圖與其他 Git 用戶合作。Subersion 只能保存單一的線性提交歷史，一不小心就會被搞糊塗。合作團隊中同時有人用 SVN 和 Git，一定要確保所有人都使用 SVN 服務來協作——這會讓生活輕鬆很多。 

## 初始設定

為了展示功能，先要一個具有寫入許可權的 SVN 倉庫。如果想嘗試這個範例，你必須複製一份其中的測試倉庫。比較簡單的做法是使用一個名為 `svnsync` 的工具。較新的 Subversion 版本中都帶有該工具，它將資料編碼為用於網路傳輸的格式。 

要嘗試本例，先在本地新建一個 Subversion 倉庫：

	$ mkdir /tmp/test-svn
	$ svnadmin create /tmp/test-svn

然後，允許所有用戶修改 revprop —— 簡單的做法是添加一個總是以 0 作為傳回值的 pre-revprop-change 腳本： 

	$ cat /tmp/test-svn/hooks/pre-revprop-change
	#!/bin/sh
	exit 0;
	$ chmod +x /tmp/test-svn/hooks/pre-revprop-change

現在可以呼叫 `svnsync init`，參數加目標倉庫，再加來源倉庫，就可以把該專案同步到本地了： 

	$ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

這將建立進行同步所需的屬性(property)。可以通過執行以下命令來 clone 程式碼：

	$ svnsync sync file:///tmp/test-svn
	Committed revision 1.
	Copied properties for revision 1.
	Committed revision 2.
	Copied properties for revision 2.
	Committed revision 3.
	...

別看這個操作只花掉幾分鐘，要是你想把源倉庫複製到另一個遠端倉庫，而不是本地倉庫，那將花掉接近一個小時，儘管專案中只有不到 100 次的提交。 Subversion 每次只複製一次修改，把它推送到另一個倉庫裡，然後周而復始——驚人的低效率，但是我們別無選擇。 

## 入門

有了可以寫入的 Subversion 倉庫以後，就可以嘗試一下典型的工作流程了。我們從 `git svn clone` 命令開始，它會把整個 Subversion 倉庫導入到一個本地的 Git 倉庫中。提醒一下，這裡導入的是一個貨真價實的 Subversion 倉庫，所以應該把下面的 `file:///tmp/test-svn` 換成你所用的 Subversion 倉庫的 URL： 

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

這相當於針對所提供的 URL 運行了兩條命令—— `git svn init` 加上 `gitsvn fetch` 。可能會花上一段時間。我們所用的測試專案僅僅包含 75 次提交並且它的代碼量不算大，所以只有幾分鐘而已。不過，Git 仍然需要提取每一個版本，每次一個，再逐個提交。對於一個包含成百上千次提交的專案，花掉的時間則可能是幾小時甚至數天。 

`-T trunk -b branches -t tags` 告訴 Git 該 Subversion 倉庫遵循了基本的分支和標籤命名法則。如果你的主幹(譯注：trunk，相當於非分散式版本控制裡的 master 分支，代表開發的主線）分支或者標籤以不同的方式命名，則應做出相應改變。由於該法則的常見性，可以使用 `-s` 來代替整條命令，它意味著標準佈局（s 是 Standard layout 的首字母），也就是前面選項的內容。下面的命令有相同的效果： 

	$ git svn clone file:///tmp/test-svn -s

現在，你有了一個有效的 Git 倉庫，包含著導入的分支和標籤： 

	$ git branch -a
	* master
	  my-calc-branch
	  tags/2.0.2
	  tags/release-2.0.1
	  tags/release-2.0.2
	  tags/release-2.0.2rc1
	  trunk

值得注意的是，該工具分配命名空間時和遠端參照的方式不盡相同。clone 普通的 Git 倉庫時，可以用 `origin/[branch]` 的形式獲取遠端伺服器上所有可用的分支——分配到遠端服務的名稱下。然而 `git svn` 假定不存在多個遠端伺服器，所以把所有指向遠端服務的引用不加區分(no namespacing)的保存下來。可以用 Git 底層(plumbing)命令 `show-ref` 來查看所有引用的全名：

	$ git show-ref
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
	aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
	03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
	50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
	4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
	1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

而普通的 Git 倉庫應該是這個模樣：

	$ git show-ref
	83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
	3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
	0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
	25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

這裡有兩個遠端伺服器：一個名為 `gitserver` ，具有一個 `master` 分支；另一個叫 `origin`，具有 `master` 和 `testing` 兩個分支。 

注意本例中通過 `git svn` 導入的遠端參照，（Subversion 的)標籤是當作遠端分支添加的，而不是真正的 Git 標籤。導入的 Subversion 倉庫仿佛是有一個帶有不同分支的 tags 遠端伺服器。

## 提交到 Subversion

有了可以開展工作的（本地）倉庫以後，你可以開始對該專案做出貢獻並向上游倉庫提交內容了，Git 這時相當於一個 SVN 用戶端。假如編輯了一個檔並進行提交，那麼這次提交僅存在於本地的 Git 而非 Subversion 伺服器上：

	$ git commit -am 'Adding git-svn instructions to the README'
	[master 97031e5] Adding git-svn instructions to the README
	 1 files changed, 1 insertions(+), 1 deletions(-)

接下來，可以將作出的修改推送到上游。值得注意的是，Subversion 的使用流程也因此改變了——你可以在離線狀態下進行多次提交然後一次性的推送到 Subversion 的伺服器上。向 Subversion 伺服器推送的命令是 `git svn dcommit`： 

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r79
	       M      README.txt
	r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

所有在原 Subversion 資料基礎上提交的 commit 會一一提交到 Subversion，然後你本地 Git 的 commit 將被重寫，加入一個特別標識。這一步很重要，因為它意味著所有 commit 的 SHA-1 指都會發生變化。這也是同時使用 Git 和 Subversion 兩種服務作為遠端服務不是個好主意的原因之一。檢視以下最後一個 commit，你會找到新添加的 `git-svn-id` （譯注：即本段開頭所說的特別標識）： 

	$ git log -1
	commit 938b1a547c2cc92033b74d32030e86468294a5c8
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sat May 2 22:06:44 2009 +0000

	    Adding git-svn instructions to the README

	    git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

注意看，原本以 `97031e5` 開頭的 SHA-1 校驗值在提交完成以後變成了 `938b1a5` 。如果既要向 Git 遠端伺服器推送內容，又要推送到 Subversion 遠端伺服器，則必須先向 Subversion 推送（`dcommit`），因為該操作會改變所提交的資料內容。 

## 拉取最新進展

如果要與其他開發者協作，總有那麼一天你推送完畢之後，其他人發現他們推送自己修改的時候（與你推送的內容）產生衝突。這些修改在你合併之前將一直被拒絕。在 `git svn` 裡這種情況像這樣： 

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	Merge conflict during commit: Your file or directory 'README.txt' is probably \
	out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
	core/git-svn line 482

為了解決該問題，可以執行 `git svn rebase` ，它會拉取伺服器上所有最新的改變，再於此基礎上衍合你的修改： 

	$ git svn rebase
	       M      README.txt
	r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
	First, rewinding head to replay your work on top of it...
	Applying: first user change

現在，你做出的修改都在 Subversion 伺服器上，所以可以順利的運行 `dcommit` ：

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r81
	       M      README.txt
	r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

需要牢記的一點是，Git 要求我們在推送之前先合併上游倉庫中最新的內容，而 `git svn` 只要求存在衝突的時候才這樣做。假如有人向一個檔推送了一些修改，這時你要向另一個文件推送一些修改，那麼 `dcommit` 將正常工作：

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

這一點需要牢記，因為它的結果是推送之後專案處於一個不完整存在於任何主機上的狀態。如果做出的修改無法相容但沒有產生衝突，則可能造成一些很難確診的難題。這和使用 Git 伺服器是不同的——在 Git 世界裡，發佈之前，你可以在用戶端系統裡完整的測試專案的狀態，而在 SVN 永遠都沒法確保提交前後專案的狀態完全一樣。 

即使還沒打算進行提交，你也應該用這個命令從 Subversion 伺服器拉取最新修改。你可以執行 `git svn fetch` 獲取最新的資料，不過 `git svn rebase` 才會在獲取之後在本地進行更新 。 

	$ git svn rebase
	       M      generate_descriptor_proto.sh
	r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
	First, rewinding head to replay your work on top of it...
	Fast-forwarded master to refs/remotes/trunk.

不時地執行一下 `git svn rebase` 可以確保你的代碼沒有過時。不過，執行該命令時需要確保工作目錄的整潔。如果在本地做了修改，則必須在執行 `git svn rebase` 之前暫存工作、或暫時提交內容——否則，該命令會發現衍合的結果包含著衝突因而終止。 

## Git 分支問題

習慣了 Git 的工作流程以後，你可能會創建一些特性分支，完成相關的開發工作，然後合併他們。如果要用 git svn 向 Subversion 推送內容，那麼最好是每次用衍合來併入一個單一分支，而不是直接合併。使用衍合的原因是 Subversion 只有一個線性的歷史而不像 Git 那樣處理合併，所以 Git svn 在把快照轉換為 Subversion 的 commit 時只能包含第一個祖先。 

假設分支歷史如下：創建一個 `experiment` 分支，進行兩次提交，然後合併到 `master` 。在 `dcommit` 的時候會得到如下輸出： 

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

在一個包含了合併歷史的分支上使用 `dcommit` 可以成功運行，不過在 Git 專案的歷史中，它沒有重寫你在 `experiment` 分支中的兩個 commit ——取而代之的是，這些改變出現在了 SVN 版本中同一個合併 commit 中。 

在別人 clone 該專案的時候，只能看到這個合併 commit 包含了所有發生過的修改；他們無法獲知修改的作者和時間等提交資訊。 

## Subversion 分支

Subversion 的分支和 Git 中的不盡相同；避免過多的使用可能是最好方案。不過，用 git svn 創建和提交不同的 Subversion 分支仍是可行的。 

### 創建新的 SVN 分支

要在 Subversion 中建立一個新分支，可以執行 `git svn branch [分支名]`: 

	$ git svn branch opera
	Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
	Found possible branch point: file:///tmp/test-svn/trunk => \
	  file:///tmp/test-svn/branches/opera, 87
	Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
	Following parent with do_switch
	Successfully followed parent
	r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

這相當於在 Subversion 中的 `svn copy trunk branches/opera` 命令並且對 Subversion 伺服器進行了相關操作。值得提醒的是它沒有檢出(check out)並轉換到那個分支；如果現在進行提交，將提交到伺服器上的 `trunk`， 而非 `opera`。 

## 切換當前分支

Git 通過搜尋提交歷史中 Subversion 分支的頭部(tip)來決定 dcommit 的目的地——而它應該只有一個，那就是當前分支歷史中最近一次包含 `git-svn-id` 的提交。 

如果需要同時在多個分支上提交，可以通過導入 Subversion 上某個其他分支的 commit 來建立以該分支為 `dcommit` 目的地的本地分支。比如你想擁有一個並行維護的 `opera` 分支，可以執行

	$ git branch opera remotes/opera

然後，如果要把 `opera` 分支併入 `trunk` （本地的 `master` 分支），可以使用普通的 `git merge`。不過最好提供一條描述提交的資訊（通過 `-m`），否則這次合併的記錄會是「Merge branch opera」，而不是任何有用的東西。 

記住，雖然使用了 `git merge` 來進行這次操作，並且合併過程可能比使用 Subversion 簡單一些（因為 Git 會自動找到適合的合併基礎），這並不是一次普通的 Git 合併提交。最終它將被推送回Subversion 伺服器上，而 Subversion 伺服器上無法處理包含多個祖先的 commit；因而在推送之後，它將變成一個包含了所有在其他分支上做出的改變的單一 commit。把一個分支合併到另一個分支以後，你沒法像在 Git 中那樣輕易的回到那個分支上繼續工作。提交時執行的 `dcommit` 命令擦掉了所有關於哪個分支被併入的資訊，因而以後的合併基礎計算將是不正確的—— dcommit 讓 `git merge` 的結果變得類似於 `git merge --squash`。不幸的是，我們沒有什麼好辦法來避免該情況—— Subversion 無法儲存這個資訊，所以在使用它作為伺服器的時候你將永遠為這個缺陷所困。為了不出現這種問題，在把本地分支（本例中的 `opera`）併入 trunk 以後應該立即將其刪除。 

## 對應 Subversion 的命令

`git svn` 工具集合了若干個與 Subversion 類似的功能，對應的命令可以簡化向 Git 的轉化過程。下面這些命令能實現 Subversion 的這些功能。 

### SVN 風格的歷史紀錄

習慣了 Subversion 的人可能想以 SVN 的風格顯示歷史，運行 `git svn log` 可以讓提交歷史顯示為 SVN 格式： 

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

關於 `git svn log` ，有兩點需要注意。首先，它可以離線工作，不像 `svn log 命令`，需要向 Subversion 伺服器索取資料。其次，它僅僅顯示已經提交到 Subversion 伺服器上的 commit。在本地尚未 dcommit 的 Git 資料不會出現在這裡；其他人向 Subversion 伺服器新提交的資料也不會顯示。等於說是顯示了最近已知 Subversion 伺服器上的狀態。 

### SVN Annotation

類似 `git svn log` 命令模擬了 `svn log` 命令的離線操作，`svn annotate` 的等效命令是 `git svn blame [檔案名]`。其輸出如下： 

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

同樣，它不顯示本地的 Git 提交以及 Subversion 上後來更新的內容。

### SVN 伺服器資訊

還可以使用 `git svn info` 來獲取與執行 `svn info` 類似的資訊： 

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

它與 blame 和 log 的相同點在於離線運行以及只更新到最後一次與 Subversion 伺服器通信的狀態。 

### 忽略 Subversion 所忽略的

假如 clone 了一個包含了 `svn:ignore` 屬性的 Subversion 倉庫，就有必要建立對應的 `.gitignore` 文件來防止意外提交一些不應該提交的文件。`git svn` 有兩個有助於改善該問題的命令。第一個是 `git svn create-ignore`，它自動建立對應的 `.gitignore` 檔，以便下次提交的時候可以包含它。 

第二個命令是 `git svn show-ignore`，它把需要放進 `.gitignore` 檔中的內容列印到標準輸出，方便我們把輸出重定向到專案的黑名單檔(exclude file)： 

	$ git svn show-ignore > .git/info/exclude

這樣一來，避免了 `.gitignore` 對專案的干擾。如果你是一個 Subversion 團隊裡唯一的 Git 用戶，而其他隊友不喜歡專案裏出現 `.gitignore` 檔案，該方法是你的不二之選。 

## Git-Svn 總結

`git svn` 工具集在當前不得不使用 Subversion 伺服器或者開發環境要求使用 Subversion 伺服器的時候格外有用。不妨把它看成一個跛腳的 Git，然而，你還是有可能在轉換過程中碰到一些困惑你和合作者們的謎題。為了避免麻煩，試著遵守如下守則： 

* 保持一個不包含由 `git merge` 產生的 commit 的線性提交歷史。將在主線分支外進行的開發通通衍合回主線；避免直接合併。 
* 不要單獨建立和使用一個 Git 服務來搞合作。可以為了加速新開發者的 clone 進程建立一個，但是不要向它提供任何不包含 `git-svn-id` 條目的內容。甚至可以添加一個 `pre-receive` 掛鉤，在每一個提交資訊中檢查 `git-svn-id`，並拒絕提交那些不包含它的 commit。 

如果遵循這些守則，在 Subversion 上工作還可以接受。然而，如果能遷徙到真正的 Git 伺服器，則能為團隊帶來更多好處。 
