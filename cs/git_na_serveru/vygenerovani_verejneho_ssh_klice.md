# Vygenerování veřejného SSH klíče

Mnoho serverů Git provádí ověřování pomocí veřejných SSH klíčů. Aby vám mohli všichni uživatelé ve vašem systému poskytnout veřejný klíč, musí si ho nechat vygenerovat (pokud klíč ještě nemají). Tento proces se napříč operačními systémy téměř neliší.
Nejprve byste se měli ujistit, že ještě žádný klíč nemáte. Uživatelské SSH klíče jsou standardně uloženy v adresáři `~/.ssh` daného uživatele. Nejsnazší způsob kontroly, zda už klíč vlastníte, je přejít do tohoto adresáře a zjistit jeho obsah:

	$ cd ~/.ssh
	$ ls
	authorized_keys2  id_dsa       known_hosts
	config            id_dsa.pub

Zobrazí se několik souborů s názvem `xxx` a `xxx.pub`, kde `xxx` je většinou `id_dsa` nebo `id_rsa`. Soubor `.pub` je váš veřejný klíč, druhý soubor je soukromý klíč. Pokud tyto soubory nemáte (nebo dokonce vůbec nemáte adresář `.ssh`), můžete si je vytvořit. Spusťte program `ssh-keygen`, který je v systémech Linux/Mac součástí balíčku SSH a v systému Windows součástí balíčku MSysGit:

	$ ssh-keygen
	Generating public/private rsa key pair.
	Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
	Enter passphrase (empty for no passphrase):
	Enter same passphrase again:
	Your identification has been saved in /Users/schacon/.ssh/id_rsa.
	Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
	The key fingerprint is:
	43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

Program nejprve potvrdí, kam chcete klíč uložit (`.ssh/id_rsa`), a poté se dvakrát zeptá na přístupové heslo. Pokud nechcete při používání klíče zadávat heslo, nemusíte ho nyní vyplňovat.

Každý uživatel, který si tímto způsobem nechá vygenerovat veřejný klíč, ho nyní pošle vám nebo jinému správci serveru Git (za předpokladu, že používáte nastavení SSH serveru vyžadující veřejné klíče). Stačí přitom zkopírovat obsah souboru `.pub` a odeslat ho e-mailem. Veřejné klíče mají zhruba tuto podobu:

	$ cat ~/.ssh/id_rsa.pub
	ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
	GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
	Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
	t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
	mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
	NrRFi9wrf+M7Q== schacon@agadorlaptop.local

Budete-li potřebovat podrobnější návod k vytvoření SSH klíče v různých operačních systémech, můžete se na vytváření SSH klíčů podívat do příručky GitHub: `http://github.com/guides/providing-your-ssh-key` (anglicky).
