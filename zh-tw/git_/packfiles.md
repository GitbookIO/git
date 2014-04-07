# Packfiles

我們再來看一下 test Git 倉庫。目前為止，有 11 個物件 ── 4 個 blob，3 個 tree，3 個 commit 以及一個 tag： 

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git 用 zlib 壓縮檔案內容，因此這些檔並沒有佔用太多空間，所有檔加起來總共僅用了 925 位元組。接下去你將添加一些大檔以演示 Git 的一個很有意思的功能。將你之前用到過的 Grit 庫中的 repo.rb 檔加進去 ── 這個原始程式碼檔大小約為 12K： 

	$ curl https://raw.github.com/mojombo/grit/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb
	$ git commit -m 'added repo.rb'
	[master 484a592] added repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

如果查看一下生成的 tree，可以看到 repo.rb 檔的 blob 物件的 SHA-1 值： 

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

然後可以用 `git cat-file` 命令查看這個物件有多大： 

	$ du -b .git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	4102	.git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e

稍微修改一下些檔，看會發生些什麼： 

	$ echo '# testing' >> repo.rb 
	$ git commit -am 'modified repo a bit'
	[master ab1afef] modified repo a bit
	 1 files changed, 1 insertions(+), 0 deletions(-)

查看這個 commit 生成的 tree，可以看到一些有趣的東西： 

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

blob 物件與之前的已經不同了。這說明雖然只是往一個 400 行的檔最後加入了一行內容，Git 卻用一個全新的物件來保存新的檔案內容： 

	$ du -b .git/objects/05/408d195263d853f09dca71d55116663690c27c
	4109	.git/objects/05/408d195263d853f09dca71d55116663690c27c

你的磁片上有了兩個幾乎完全相同的 12K 的物件。如果 Git 只完整保存其中一個，並保存另一個物件的差異內容，豈不更好？ 

事實上 Git 可以那樣做。Git 往磁片保存物件時預設使用的格式叫鬆散物件 (loose object) 格式。Git 時不時地將這些物件打包至一個叫 packfile 的二進位檔案以節省空間並提高效率。當倉庫中有太多的鬆散物件，或是手動執行 `git gc` 命令，或推送至遠端伺服器時，Git 都會這樣做。手動執行 `git gc` 命令讓 Git 將倉庫中的物件打包，並看看會發生些什麼： 

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

查看一下 objects 目錄，會發現大部分物件都不在了，與此同時出現了兩個新檔： 

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

仍保留著的幾個物件是未被任何 commit 引用的 blob ── 在此例中是你之前創建的 “what is up, doc?” 和 “test content” 這兩個示例 blob。你從沒將他們添加至任何 commit，所以 Git 認為它們是懸而未決的，不會將它們打包進 packfile 。 

剩下的檔是新創建的 packfile 以及一個索引。packfile 檔包含了剛才從檔案系統中移除的所有物件。索引檔包含了 packfile 的偏移資訊(offset)，這樣就可以快速定位任意一個指定物件。有意思的是執行 `gc` 命令前磁片上的物件大小約為 8K ，而這個新生成的 packfile 僅為 4K 大小。通過打包物件減少了一半磁片使用空間。 

Git 是如何做到這點的？Git 打包物件時，會查找命名及尺寸相近的檔，並只保存檔案不同版本之間的差異內容。可以查看一下 packfile ，觀察它是如何節省空間的。`git verify-pack` 命令用於顯示已打包的內容： 

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

如果你還記得的話, `9bc1d` 這個 blob 是 repo.rb 檔的第一個版本，這個 blob 引用了 `05408` 這個 blob，即該檔的第二個版本。命令輸出內容的第三欄顯示的是物件大小，可以看到 `05408` 佔用了 12K 空間，而 `9bc1d` 僅為 7 位元組。非常有趣的是第二個版本才是完整保存檔案內容的物件，而第一個版本是以差異方式保存的 ── 這是因為大部分情況下需要快速訪問的是檔案的最新版本。 

最妙的是可以隨時進行重新封包。Git 自動定期對倉庫進行重新封包以節省空間。當然也可以手動執行 `git gc` 命令來這麼做。 
