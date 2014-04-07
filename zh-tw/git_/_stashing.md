# 儲藏 (Stashing)

經常有這樣的事情發生，當你正在進行專案中某一部分的工作，裡面的東西處於一個比較雜亂的狀態，而你想轉到其他分支上進行一些工作。問題是，你不想只為了待會要回到這個工作點，就把做到一半的工作進行提交。解決這個問題的辦法就是 `git stash` 命令。 

「儲藏」可以獲取你工作目錄的 dirty state——也就是你修改過的被追蹤檔和暫存的變更——並將它保存到一個未完成變更的堆疊(stack)中，隨時可以重新應用。 

## 儲藏你的工作

為了演示這一功能，你可以進入你的專案，在一些檔上進行工作，有可能還暫存其中一個變更。如果你執行 `git status`，你可以看到你的 dirty state： 

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

現在你想切換分支，但是你還不想提交你正在進行中的工作；所以你儲藏這些變更。為了往堆疊推送一個新的儲藏，執行 `git stash`： 

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

你的工作目錄就乾淨了： 

	$ git status
	# On branch master
	nothing to commit (working directory clean)

這時，你可以方便地切換到其他分支工作；你的變更都保存在堆疊上。要查看現有的儲藏，你可以使用 `git stash list`： 

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

在這個案例中，之前已經進行了兩次儲藏，所以你可以取得三個不同的儲藏。你可以重新應用你剛剛的儲藏，所採用的命令就是原本 stash 命令輸出的輔助訊息裡提示的：`git stash apply`。如果你想應用較舊的儲藏，你可以通過名字指定它，像這樣：`git stash apply stash@{2}`。如果你不指明，Git 預設使用最近的儲藏並嘗試應用它： 

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

你可以看到 Git 重新修改了你所儲藏的那些當時尚未提交的檔。在這個案例裡，你嘗試應用儲藏的工作目錄是乾淨的，並且屬於同一分支；但是一個乾淨的工作目錄和應用到相同的分支上並不是應用儲藏的必要條件。你可以在其中一個分支上保留一份儲藏，隨後切換到另外一個分支，再重新應用這些變更。在工作目錄裡包含已修改、未提交的檔時，你也可以應用儲藏——Git 會給出合併衝突，如果有任何變更無法乾淨地被應用。 

對檔案的變更被重新應用，但是被暫存的檔沒有重新被暫存。想那樣的話，你必須在執行 `git stash apply` 命令時帶上一個 `--index` 的選項來重新應用被暫存的變更。如果你是這麼做的，你應該已經回到你原來的位置：

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

apply 選項只嘗試應用儲藏的工作——儲藏的內容仍然在堆疊上。要移除它，你可以執行 `git stash drop`，加上你希望移除的儲藏的名字： 

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

你也可以執行 `git stash pop` 來重新應用儲藏，同時立刻將其從堆疊中移走。 

## 取消儲藏 (Un-applying a Stash)

在某些使用情境下，你可能想要應用儲藏的變更，做一些工作，然後又要把來自原儲藏的變更取消。Git 並未提供類似 `stash unapply` 的命令，但是達成相同效果是可能的，只要取得該儲藏關連的補丁然後反向應用它就行了：

    $ git stash show -p stash@{0} | git apply -R

同樣的，如果你沒有指定某個儲藏，Git 會預設為最近的儲藏：

    $ git stash show -p | git apply -R

你可能會想要新建一個別名，在你的 git 增加一個 `stash-unapply` 命令，這樣更有效率。例如：

    $ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
    $ git stash
    $ #... work work work
    $ git stash-unapply

## 從儲藏中創建分支

如果你儲藏了一些工作，暫時不去理會，然後繼續在你儲藏工作的分支上工作，你在重新應用工作時可能會碰到一些問題。如果嘗試應用的變更是針對一個你那之後修改過的檔，你會碰到一個合併衝突並且必須去化解它。如果你想用更方便的方法來重新檢驗你儲藏的變更，你可以執行 `git stash branch`，這會創建一個新的分支，檢出你儲藏工作時所處的提交，重新應用你的工作，如果成功，將會丟棄儲藏。 

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

這是一個很棒的捷徑來恢復儲藏的工作然後在新的分支上繼續當時的工作。 
