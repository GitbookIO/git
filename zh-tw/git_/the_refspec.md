# The Refspec

這本書讀到這裡，你已經使用過一些簡單的遠端分支到本地引用的映射方式了，這種映射可以更為複雜。
假設你像這樣添加了一項遠端倉庫： 

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

它在你的 `.git/config` 檔中添加了一節，指定了遠程的名稱 (`origin`), 遠程倉庫的 URL 地址，和用於獲取(fetch)操作的 Refspec: 

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

Refspec 的格式是一個可選的 `+` 號，接著是 `<src>:<dst>` 的格式，這裡 `<src>` 是遠端上的引用格式， `<dst>` 是將要記錄在本地的引用格式。可選的 `+` 號告訴 Git 在即使不能快速演進(fast-forward)的情況下，也去強制更新它。 

預設情況下 refspec 會被 `git remote add` 命令所自動產生，Git 會獲取遠端伺服器上 `refs/heads/` 下面的所有引用，並將它寫入到本地的 `refs/remotes/origin/`. 所以，如果遠端伺服器上有一個 `master` 分支，你在本地可以通過下面這種方式來取得它的歷史記錄： 

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

它們的作用都是相同的，因為 Git 把它們都擴展成 `refs/remotes/origin/master`. 

如果你想讓 Git 每次只拉取遠端的 `master` 分支，而不是遠端的所有分支，你可以把 fetch 這一行修改成這樣： 

	fetch = +refs/heads/master:refs/remotes/origin/master

這是 `git fetch` 操作對這個遠端的預設 refspec 值。而如果你只想做一次該操作，也可以在命令列上指定這個 refspec. 例如可以這樣拉取遠端的 `master` 分支到本地的 `origin/mymaster` 分支：

	$ git fetch origin master:refs/remotes/origin/mymaster

你也可以在命令列上指定多個 refspec. 像這樣可以一次獲取遠端的多個分支： 

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

在這個例子中， master 分支因為不是一個可以快速演進的引用而拉取操作被拒絕。你可以在 refspec 之前使用一個 `+` 號來 override 這種行為。 

你也可以在設定檔中指定多個 refspec. 如你想在每次獲取時都獲取 master 和 experiment 分支，就添加兩行： 

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

但是這裡不能使用部分萬用字元，像這樣就是不合法的： 

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

但是你可以使用命名空間來達到這個目的。如果你有一個 QA 團隊，他們推送一系列分支，你想每次獲取 master 分支和 QA 團隊 的所有分支，你可以使用這樣的配置段落(config section)： 

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

如果你的工作流程很複雜，有QA團隊推送的分支、開發人員推送的分支、和集成人員推送的分支，並且他們在遠端分支上協作，你可以採用這種方式為他們創建各自的命名空間。 

## 推送 Refspecs

採用命名空間的方式確實很棒，但QA團隊第一次是如何將他們的分支推送到 `qa/` 空間裡面的呢？答案是你可以使用 refspec 來推送。 

如果QA團隊想把他們的 `master` 分支推送到遠端的 `qa/master` 分支上，可以這樣執行： 

	$ git push origin master:refs/heads/qa/master

如果他們想讓 Git 每次運行 `git push origin` 時都這樣自動推送，他們可以在設定檔中添加 `push` 值： 

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

這樣，就會讓 `git push origin` 預設就把本地的 `master` 分支推送到遠端的 `qa/master` 分支上。 

## 刪除 References

你也可以使用 refspec 來刪除遠端的引用(references)，是通過執行這樣的命令： 

	$ git push origin :topic

因為 refspec 的格式是 `<src>:<dst>`, 通過把 `<src>` 部分留空的方式，這個意思是是把遠端的 topic 分支變成空，也就是刪除它。 
