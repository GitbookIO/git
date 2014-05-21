# 生成 SSH 公開金鑰

大多數 Git 伺服器都會選擇使用 SSH 公開金鑰來進行授權。系統中的每個使用者都必須提供一個公開金鑰用於授權，沒有的話就要生成一個。生成公開金鑰的過程在所有作業系統上都差不多。
首先先確認一下是否已經有一個公開金鑰了。SSH 公開金鑰預設儲存在帳戶的主目錄下的 `~/.ssh` 目錄。進去看看：

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

關鍵是看有沒有用 `something` 和 `something.pub` 來命名的一對檔，這個 `something` 通常就是 `id_dsa` 或 `id_rsa`。有 `.pub` 尾碼的檔就是公開金鑰，另一個檔則是金鑰。假如沒有這些檔，或者乾脆連 `.ssh` 目錄都沒有，可以用 `ssh-keygen` 來創建。該程式在 Linux/Mac 系統上由 SSH 包提供，而在 Windows 上則包含在 MSysGit 包裡：

	$ ssh-keygen
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
	Enter passphrase (empty for no passphrase):
	Enter same passphrase again:
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

它先要求你確認保存公開金鑰的位置（`.ssh/id_rsa`），然後它會讓你重複一個密碼兩次，如果不想在使用公開金鑰的時候輸入密碼，可以留空。

現在，所有做過這一步的用戶都得把它們的公開金鑰給你或者 Git 伺服器的管理員（假設 SSH 服務被設定為使用公開金鑰機制）。他們只需要複製 `.pub` 檔的內容然後發郵件給管理員。公開金鑰的樣子大致如下：

	$ cat ~/.ssh/id_rsa.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

關於在多個作業系統上設立相同 SSH 公開金鑰的教程，可以查閱 GitHub 上有關 SSH 公開金鑰的嚮導：`http://github.com/guides/providing-your-ssh-key`。
