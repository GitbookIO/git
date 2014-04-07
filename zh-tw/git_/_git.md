# 遷移到 Git

如果在其他版本控制系統(VCS)中保存了某專案的代碼而後決定轉而使用 Git，那麼該專案必須經歷某種形式的遷移。本節將介紹 Git 中包含的一些針對常見系統的導入腳本(importer)，並將展示編寫自訂的導入腳本的方法。

## 導入

你將學習到如何從專業重量級的版本控制系統(SCM)中匯入資料—— Subversion 和 Perforce —— 因為據我所知這二者的用戶是（向 Git）轉換的主要群體，而且 Git 為此二者附帶了高品質的轉換工具。

## Subversion

讀過前一節有關 `git svn` 的內容以後，你應該能輕而易舉的根據其中的指導來 `git svn clone` 一個倉庫了；然後，停止 Subversion 的使用，向一個新 Git server 推送，並開始使用它。想保留歷史記錄，所花的時間應該不過就是從 Subversion 伺服器拉取資料的時間（可能要等上好一會就是了）。 

然而，這樣的匯入並不完美；而且還要花那麼多時間，不如乾脆一次把它做對！首當其衝的任務是作者資訊。在 Subversion，每個提交者都在主機上有一個用戶名，記錄在提交資訊中。上節例子中多處顯示了 schacon ，比如 `blame` 的輸出以及 `git svn log`。如果想讓這條資訊更好的映射到 Git 作者資料裡，則需要從 Subversion 用戶名到 Git 作者的一個映射關係。建立一個叫做 `user.txt` 的檔，用如下格式表示映射關係： 

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

通過以下命令可以獲得 SVN 作者的列表： 

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

它將輸出 XML 格式的日誌——你可以找到作者，建立一個單獨的列表，然後從 XML 中抽取出需要的資訊。（顯而易見，本方法要求主機上安裝了`grep`，`sort` 和 `perl`.）然後把輸出重定向到 user.txt 檔，然後就可以在每一項的後面添加相應的 Git 使用者資料。 

為 `git svn` 提供該檔可以讓它更精確的映射作者資料。你還可以在 `clone` 或者 `init` 後面添加 `--no-metadata` 來阻止 `git svn` 包含那些 Subversion 的附加資訊。這樣 `import` 命令就變成了：

	$ git svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

現在 `my_project` 目錄下導入的 Subversion 應該比原來整潔多了。原來的 commit 看上去是這樣： 

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029
現在是這樣： 

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

不僅作者一項乾淨了不少，`git-svn-id` 也就此消失了。 

你還需要一點 post-import（導入後） 清理工作。最起碼的，應該清理一下 `git svn` 創建的那些怪異的索引結構。首先要移動標籤，把它們從奇怪的遠端分支變成實際的標籤，然後把剩下的分支移動到本地。 

要把標籤變成合適的 Git 標籤，執行 

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

該命令將原本以 `tag/` 開頭的遠端分支的索引變成真正的 (lightweight) 標籤。 

接下來，把 `refs/remotes` 下面剩下的索引(reference)變成本地分支： 

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

現在所有的舊分支都變成真正的 Git 分支，所有的舊標籤也變成真正的 Git 標籤。最後一項工作就是把新建的 Git 伺服器添加為遠端伺服器並且向它推送。為了讓所有的分支和標籤都得到上傳，我們使用這條命令： 

	$ git remote add origin git@my-git-server:myrepository.git

Because you want all your branches and tags to go up, you can now run this:

	$ git push origin --all
	$ git push origin --tags

所有的分支和標籤現在都應該整齊乾淨的躺在新的 Git 伺服器裡了。 

## Perforce

你將瞭解到的下一個被導入的系統是 Perforce. Git 發行的時候同時也附帶了一個 Perforce 導入腳本，不過它是包含在源碼的 `contrib` 部分——而不像 `git svn` 那樣預設就可以使用。執行它之前必須獲取 Git 的源碼，可以在 git.kernel.org 下載： 

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

在這個 `fast-import` 目錄下，應該有一個叫做 `git-p4` 的 Python 可執行腳本。主機上必須裝有 Python 和 `p4` 工具該導入才能正常進行。例如，你要從 Perforce 公共代碼倉庫（譯注： Perforce Public Depot，Perforce 官方提供的代碼寄存服務）導入 Jam 專案。為了設定用戶端，我們要把 P4PORT 環境變數 export 到 Perforce 倉庫： 

	$ export P4PORT=public.perforce.com:1666

執行 `git-p4 clone` 命令將從 Perforce 伺服器導入 Jam 專案，我們需要給出倉庫和專案的路徑以及導入的目標路徑： 

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

現在去 `/opt/p4import` 目錄執行一下 `git log` ，就能看到導入的成果： 

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

每一個 commit 裡都有一個 `git-p4` 識別字。這個識別字可以保留，以防以後需要引用 Perforce 的修改版本號。然而，如果想刪除這些識別字，現在正是時候——開始在新倉庫上工作之前。可以通過 `git filter-branch` 來批量刪除這些識別字： 

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

現在執行一下 `git log`，你會發現這些 commit 的 SHA-1 校驗值都發生了改變，而那些 `git-p4` 字串則從提交資訊裡消失了： 

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

至此導入已經完成，可以開始向新的 Git 伺服器推送了。 

## 自定導入腳本

如果你的系統不是 Subversion 或 Perforce 之一，先上網找一下有沒有與之對應的導入腳本——導入 CVS，Clear Case，Visual Source Safe，甚至存檔目錄的導入腳本已經存在。假如這些工具都不適用，或者使用的工具很少見，抑或你需要導入過程具有更多可制定性，則應該使用 `git fast-import`。該命令從標準輸入讀取簡單的指令來寫入具體的 Git 資料。這樣創建 Git 物件比執行純 Git 命令或者手動寫物件要簡單的多（更多相關內容見第九章）。通過它，你可以編寫一個導入腳本來從導入來源讀取必要的資訊，同時在標準輸出直接輸出相關指令(instructions)。你可以執行該腳本並把它的輸出管道連接(pipe)到 `git fast-import`。 

下面演示一下如何編寫一個簡單的導入腳本。假設你在進行一項工作，並且按時通過把工作目錄複寫為以時間戳記 back_YY_MM_DD 命名的目錄來進行備份，現在你需要把它們導入 Git 。目錄結構如下： 

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

為了導入到一個 Git 目錄，我們首先回顧一下 Git 儲存資料的方式。你可能還記得，Git 本質上是一個 commit 物件的鏈表，每一個物件指向一個內容的快照。而這裡需要做的工作就是告訴 `fast-import` 內容快照的位置，什麼樣的 commit 資料指向它們，以及它們的順序。我們採取一次處理一個快照的策略，為每一個內容目錄建立對應的 commit ，每一個 commit 與前一個 commit 建立連結。 

正如在第七章 “Git 執行策略一例” 一節中一樣，我們將使用 Ruby 來編寫這個腳本，因為它是我日常使用的語言而且閱讀起來簡單一些。你可以用任何其他熟悉的語言來重寫這個例子——它僅需要把必要的資訊列印到標準輸出而已。同時，如果你在使用 Windows，這意味著你要特別留意不要在換行的時候引入回車符（譯注：carriage returns，Windows 換行時加入的符號，通常說的 \r ）—— Git 的 fast-import 對僅使用分行符號（LF）而非 Windows 的回車符（CRLF）要求非常嚴格。 

首先，進入目標目錄並且找到所有子目錄，每一個子目錄將作為一個快照被導入為一個 commit。我們將依次進入每一個子目錄並列印所需的命令來匯出它們。腳本的主迴圈大致是這樣： 

	last_mark = nil

	# loop through the directories
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # move into the target directory
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

我們在每一個目錄裡執行 `print_export`，它會取出上一個快照的索引和標記並返回本次快照的索引和標記；由此我們就可以正確的把二者連接起來。”標記（mark）” 是 `fast-import` 中對 commit 識別字的叫法；在創建 commit 的同時，我們逐一賦予一個標記以便以後在把它連接到其他 commit 時使用。因此，在 `print_export` 方法中要做的第一件事就是根據目錄名產生一個標記： 

	mark = convert_dir_to_mark(dir)

實現該函數的方法是建立一個目錄的陣列序列並使用陣列的索引值作為標記，因為標記必須是一個整數。這個方法大致是這樣的： 

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

有了整數來代表每個 commit，我們現在需要提交附加資訊中的日期。由於日期是用目錄名表示的，我們就從中解析出來。`print_export` 文件的下一行將是： 

	date = convert_dir_to_date(dir)

而 `convert_dir_to_date` 則定義為 

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

它為每個目錄回傳一個 integer。提交附加資訊裡最後一項所需的是提交者資料，我們在一個全域變數中直接定義之： 

	$author = 'Scott Chacon <schacon@example.com>'

我們差不多可以開始為導入腳本輸出提交資料了。第一項資訊指明我們定義的是一個 commit 物件以及它所在的分支，隨後是我們產生的標記、提交者資訊以及提交備註，然後是前一個 commit 的索引，如果有的話。程式碼大致像這樣： 

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

為了簡化，時區寫死(hardcode)為（-0700）。如果是從其他版本控制系統導入，則必須以變數的形式指明時區。
提交訊息必須以特定格式給出： 

	data (size)\n(contents)

該格式包含了「data」這個字、所讀取資料的大小、一個分行符號，最後是資料本身。由於隨後指明檔案內容的時候要用到相同的格式，我們寫一個輔助方法，`export_data`： 

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

唯一剩下的就是每一個快照的內容了。這簡單的很，因為它們分別處於一個目錄——你可以輸出 `deleeall` 命令，隨後是目錄中每個檔的內容。Git 會正確的記錄每一個快照： 

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

注意：由於很多系統把每次修訂看作一個 commit 到另一個 commit 的變化量，fast-import 也可以依據每次提交獲取一個命令來指出哪些檔被添加，刪除或者修改過，以及修改的內容。我們將需要計算快照之間的差別並且僅僅給出這項資料，不過該做法要複雜很多——還不如直接把所有資料丟給 Git 讓它自己搞清楚。假如前面這個方法更適用於你的資料，參考 `fast-import` 的 man 説明頁面來瞭解如何以這種方式提供資料。 

列舉新檔內容或者指明帶有新內容的已修改檔的格式如下： 

	M 644 inline path/to/file
	data (size)
	(file contents)

這裡，644 是許可權模式（如果有執行檔，則需要偵測之並設定為 755），而 inline 說明我們在本行結束之後立即列出檔的內容。我們的 `inline_data` 方法大致是： 

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

我們再次使用了前面定義過的 `export_data`，因為這裡和指明提交注釋的格式如出一轍。 

最後一項工作是回傳當前的標記以便下次迴圈的使用。 

	return mark

注意：如果你是在 Windows 上執行，一定記得添加一項額外的步驟。前面提過，Windows 使用 CRLF 作為換行字元而 Git fast-import 只接受 LF。為了避開這個問題來滿足 git fast-import，你需要讓 ruby 用 LF 取代 CRLF： 

	$stdout.binmode

搞定了。現在執行該腳本，你將得到如下內容： 

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

要執行導入腳本，在需要導入的目錄把該內容用管道定向(pipe)到 `git fast-import`。你可以建立一個空目錄然後執行 `git init` 作為起點，然後執行該腳本： 

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

你會發現，在它成功執行完畢以後，會給出一堆有關已完成工作的資料。上例在一個分支導入了5次提交資料，包含了18個物件。現在可以執行 `git log` 來檢視新的歷史： 

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

就這樣——一個乾淨整潔的 Git 倉庫。需要注意的是此時沒有任何內容被檢出(checked out)——剛開始目前的目錄裡沒有任何檔。要獲取它們，你得轉到 `master` 分支的所在： 

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

`fast-import` 還可以做更多——處理不同的檔案模式、二進位檔案、多重分支與合併、標籤、進展標識(progress indicators)等等。一些更加複雜的實例可以在 Git 源碼的 `contib/fast-import` 目錄裡找到；較佳的其中之一是前面提過的 `git-p4` 腳本。 
