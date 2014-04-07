# Git References

你可以執行像 `git log 1a410e` 這樣的命令來查看完整的歷史，但是這樣你就要記得 `1a410e` 是你最後一次提交，這樣才能在提交歷史中找到這些物件。你需要一個檔來用一個簡單的名字來記錄這些 SHA-1 值，這樣你就可以用這些指標而不是原來的 SHA-1 值去檢索了。 

在 Git 中，這些我們稱之為「引用」（references 或者 refs，譯者注）。你可以在 `.git/refs` 目錄下面找到這些包含 SHA-1 值的檔。在這個專案裡，這個目錄還沒不包含任何檔，但是包含這樣一個簡單的結構： 

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

如果想要創建一個新的引用幫助你記住最後一次提交，技術上你可以這樣做： 

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

現在，你就可以在 Git 命令中使用你剛才創建的引用而不是 SHA-1 值： 

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

當然，我們並不鼓勵你直接修改這些引用檔。如果你確實需要更新一個引用，Git 提供了一個比較安全的命令 `update-ref`： 

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

基本上 Git 中的一個分支其實就是一個指向某個工作版本一條 HEAD 記錄的指標或引用。你可以用這條命令創建一個指向第二次提交的分支： 

	$ git update-ref refs/heads/test cac0ca

這樣你的分支將會只包含那次提交以及之前的工作： 

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

現在，你的 Git 資料庫應該看起來像圖 9-4 一樣。 


![](http://git-scm.com/figures/18333fig0904-tn.png)

Figure 9-4. 包含分支引用的 Git 目錄物件 

每當你執行 `git branch (分支名稱)` 這樣的命令，Git 基本上就是執行 `update-ref` 命令，把你現在所在分支中最後一次提交的 SHA-1 值，添加到你要創建的分支的引用。 

## HEAD 標記

現在的問題是，當你執行 `git branch (分支名稱)` 這條命令的時候，Git 怎麼知道最後一次提交的 SHA-1 值呢？答案就是 HEAD 檔。HEAD 檔是一個指向你當前所在分支的引用識別字。這樣的引用識別字——它看起來並不像一個普通的引用——其實並不包含 SHA-1 值，而是一個指向另外一個引用的指標。如果你看一下這個檔，通常你將會看到這樣的內容： 

	$ cat .git/HEAD
	ref: refs/heads/master

如果你執行 `git checkout test`，Git 就會更新這個檔，看起來像這樣： 

	$ cat .git/HEAD
	ref: refs/heads/test

當你再執行 `git commit` 命令，它就創建了一個 commit 物件，把這個 commit 物件的父級設置為 HEAD 指向的引用的 SHA-1 值。 

你也可以手動編輯這個檔，但是同樣有一個更安全的方法可以這樣做：`symbolic-ref`。你可以用下面這條命令讀取 HEAD 的值： 

	$ git symbolic-ref HEAD
	refs/heads/master

你也可以設置 HEAD 的值： 

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD
	ref: refs/heads/test

但是你不能設置成 refs 以外的形式： 

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## Tags

你剛剛已經重溫過了 Git 的三個主要物件類型，現在這是第四種。Tag 物件非常像一個 commit 物件——包含一個標籤，一組資料，一個消息和一個指標。最主要的區別就是 Tag 物件指向一個 commit 而不是一個 tree。它就像是一個分支引用，但是不會變化——永遠指向同一個 commit，僅僅是提供一個更加友好的名字。 

正如我們在第二章所討論的，Tag 有兩種類型：annotated 和 lightweight 。你可以類似下面這樣的命令建立一個 lightweight tag： 

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

這就是 lightweight tag 的全部 —— 一個永遠不會發生變化的分支。 annotated tag 要更複雜一點。如果你創建一個 annotated tag，Git 會創建一個 tag 物件，然後寫入一個 reference 指向這個 tag，而不是直接指向 commit。你可以這樣創建一個 annotated tag（`-a` 參數表明這是一個 annotated tag）： 

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 –m 'test tag'

這是所創建物件的 SHA-1 值：

	$ cat .git/refs/tags/v1.1
	9585191f37f7b0fb9444f35a9bf50de191beadc2

現在你可以執行 `cat-file` 命令檢查這個 SHA-1 值： 

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

值得注意的是這個物件指向你所標記的 commit 物件的 SHA-1 值。同時需要注意的是它並不是必須要指向一個 commit 物件；你可以標記任何 Git 物件。例如，在 Git 的原始程式碼裡，管理者添加了一個 GPG 公開金鑰（這是一個 blob 物件）對它做了一個標籤。你可以執行以下命令來查看 

	$ git cat-file blob junio-gpg-pub

Git 原始程式碼裡的公開金鑰. Linux kernel 也有一個不是指向 commit 物件的 tag —— 第一個 tag 是在導入原始程式碼的時候創建的，它指向初始 tree （initial tree，譯者注）。

## Remotes

你將會看到的第三種 reference 是 remote reference（遠端參照，譯者注）。如果你添加了一個 remote 然後推送代碼過去，Git 會把你最後一次推送到這個 remote 的每個分支的值都記錄在 `refs/remotes` 目錄下。例如，你可以添加一個叫做 `origin` 的 remote 然後把你的 `master` 分支推送上去： 

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

然後查看 `refs/remotes/origin/master` 這個檔，你就會發現 `origin` remote 中的 `master` 分支就是你最後一次和伺服器的通信。 

	$ cat .git/refs/remotes/origin/master
	ca82a6dff817ec66f44342007202690a93763949

Remote references 和分支(`refs/heads` references)的主要區別在於他們是不能被 check out 的。Git 把他們當作是標記了這些分支在伺服器上最後狀態的一種書簽。 
