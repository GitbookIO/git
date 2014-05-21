# 底層命令 (Plumbing) 和高層命令 (Porcelain)

本書講解了使用 `checkout`, `branch`, `remote` 等共約 30 個 Git 命令。然而由於 Git 一開始被設計成供 VCS 使用的工具集，而不是一整套 user-friendly 的 VCS，它還包含了許多底層命令，這些命令用於以 UNIX 風格使用或由腳本呼叫。這些命令一般被稱為 “plumbing” 命令（底層命令），其他的更友好的命令則被稱為 “porcelain” 命令（高層命令）。 

本書前八章主要專門討論高層命令。本章將主要討論底層命令以理解 Git 的內部工作機制、演示 Git 如何及為何要以這種方式工作。這些命令主要不是用來從命令列手工使用的，更多的是用來為其他工具和自訂腳本服務的。 

當你在一個新目錄或已有目錄內執行 `git init` 時，Git 會創建一個 `.git` 目錄，幾乎所有 Git 儲存和操作的內容都位於該目錄下。如果你要備份或複製一個倉庫，基本上將這一目錄拷貝至其他地方就可以了。本章基本上都討論該目錄下的內容。該目錄結構如下： 

	$ ls
	HEAD
	branches/
	config
	description
	hooks/
	index
	info/
	objects/
	refs/

該目錄下有可能還有其他檔，但這是一個全新的 `git init` 生成的倉庫，所以預設情況下這些就是你能看到的結構。新版本的 Git 不再使用 `branches` 目錄，`description` 檔僅供 GitWeb 程式使用，所以不用關心這些內容。`config` 檔包含了專案特有的配置選項，`info` 目錄保存了一份不希望在 .gitignore 檔中管理的忽略模式 (ignored patterns) 的全域可執行檔。`hooks` 目錄包含了第六章詳細介紹的用戶端或服務端鉤子腳本。 

另外還有四個重要的檔案或目錄：`HEAD` 及 `index` 檔，`objects` 及 `refs` 目錄。這些是 Git 的核心部分。`objects` 目錄存放所有資料內容，`refs` 目錄存放指向資料 (分支) 的提交物件的指標，`HEAD` 檔指向當前分支，`index` 檔保存了暫存區域資訊。馬上你將詳細瞭解 Git 是如何操縱這些內容的。
