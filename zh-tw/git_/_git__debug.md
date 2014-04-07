# 使用 Git 做 Debug

Git 也提供了一些工具來幫助你 debug 專案中遇到的問題。由於 Git 被設計為可應用於幾乎任何類型的專案，這些工具是通用型的，但是在遇到問題時經常可以幫助你找到 bug 在哪裏。 

## 檔案標注 (File Annotation)

如果你在追查程式碼中的 bug，想要知道這是什麼時候、為什麼被引進來的，檔案標注會是你的最佳工具。它會顯示檔案中對每一行進行修改的最近一次提交。因此，如果你發現自己程式碼中的一個 method 有 bug，你可以用 `git blame` 來標注該檔案，查看那個 method 的每一行分別是由誰在哪一天修改的。下面這個例子使用了 `-L` 選項來限制輸出範圍在第12至22行：

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

請注意第一欄是最後一次修改該行的那次提交的 SHA-1 部份值。接下去的兩欄是從那次提交中取出的值——作者姓名和日期——所以你可以方便地獲知誰在什麼時候修改了這一行。在這後面是行號和檔案內容。請注意 `^4832fe2` 提交的那些行，這些指的是檔案最初提交(original commit)的那些行。那個提交是檔案第一次被加入這個專案時存在的，自那以後未被修改過。這會帶來小小的困惑，因為你已經至少看到了 Git 使用 `^` 來修飾一個提交的 SHA值 的三種不同的意義，但這裡確實就是這個意思。 

另一件很酷的事情是，Git 並不會明確地記錄對檔案所做的重命名(rename)動作。它會記錄快照，然後根據實際狀況嘗試找出隱藏在背後的重命名動作。這其中有一個很有意思的特性，就是你可以讓它找出所有的程式碼移動。如果你在 `git blame` 後加上 `-C`，Git 會分析你所標注的檔案，然後嘗試找出其中代碼片段的原始出處，如果它是從其他地方拷貝過來的話。最近，我在對 `GITServerHandler.m` 這個檔案做程式碼重構(code refactoring)，將它分解為多個檔案，其中一個是 `GITPackUpload.m`。通過對 `GITPackUpload.m` 執行帶 `-C` 參數的 blame 命令，我可以看到程式碼片段的原始出處： 

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

這真的非常有用。通常，你會把你拷貝代碼的那次提交作為原始提交，因為這是你在這個檔中第一次接觸到那幾行。Git可以告訴你編寫那些行的原始提交，即便是在另一個檔裡。

## 二分法查找 (Binary Search)

當你知道問題在哪裡的時候，標注檔案會有幫助。如果你不知道，並且自從上次程式碼可用的狀態之後已經經歷了上百次的提交，你可能就要求助於 `git bisect` 命令了。`bisect` 會在你的提交歷史中進行二分查找，來儘快地確定哪一次提交引入了錯誤。 

例如你剛剛推送了一個代碼發佈版本到產品環境中，得到一些在你開發環境中沒有發生的錯誤報告，而你對代碼為什麼會表現成那樣百思不得其解。你回到你的代碼中，還好你可以重現那個錯誤，但是找不到問題在哪裡。你可以對代碼執行 `bisect` 來尋找。首先你執行 `git bisect start` 啟動，然後你用 `git bisect bad` 來告訴系統當前的提交已經有問題了。然後你必須告訴 bisect 已知的最後一次正常狀態是哪次提交，使用 `git bisect good [good_commit]`： 

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git 發現在你標記為正常的提交(v1.0)和當前的錯誤版本之間有大約12次提交，於是它 check out 中間的一個。在這裡，你可以進行測試，檢查問題是否存在於這次提交。如果是，那麼它是在這個中間提交之前的某一次引入的；如果否，那麼問題是在中間提交之後引入的。假設這裡是沒有錯誤的，那麼你就通過 `git bisect good` 來告訴 Git 然後繼續你的旅程：

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

現在你在另外一個提交上了，在你剛剛測試通過的和一個錯誤提交的中點處。你再次執行測試然後發現這次提交是錯誤的，因此你通過 `git bisect bad` 來告訴 Git： 

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

這次提交是好的，那麼 Git 就獲得了確定問題引入位置所需的所有資訊。它告訴你第一個錯誤提交的 SHA-1 值，並且顯示一些提交說明，以及哪些檔在那次提交裡被修改過，這樣你可以找出 bug 被引入的根源： 

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

當你完成之後，你應該執行 `git bisect reset` 來重設你的 HEAD 到你開始前的地方，否則你會處於一個詭異的狀態： 

	$ git bisect reset

這是個強大的工具，可以幫助你檢查上百的提交，在幾分鐘內找出 bug 引入的位置。事實上，如果你有一個腳本程式會在專案工作正常時返回0，錯誤時返回非0的話，你可以完全自動地執行 `git bisect`。首先你需要提供已知的錯誤和正確提交來告訴它二分查找的範圍。你可以通過 `bisect start` 命令來列出它們，先列出已知的錯誤提交再列出已知的正確提交：

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

這樣會自動地在每一個 checked-out 提交裡執行 test-error.sh 直到 Git 找出第一個破損的提交。你也可以執行像 `make` 或者 `make tests`，或者任何你所能執行的自動化測試。 
