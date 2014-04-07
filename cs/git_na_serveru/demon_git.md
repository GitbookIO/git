# Démon Git

Jestliže potřebujete ke svým projektům veřejný, neověřovaný přístup pro čtení, budete muset překročit hranice vymezené protokolem HTTP a začít používat protokol Git. Mluví pro něj především rychlost. Protokol Git je daleko výkonnější, a proto také rychlejší než protokol HTTP a svým uživatelů tím ušetří spoustu času.

I v tomto případě se jedná o neověřený přístup pouze pro čtení. Pokud protokol používáte na serveru mimo firewall, mělo by to být pouze u projektů, které jsou veřejně viditelné okolnímu světu. Pokud je server, na kterém protokol spouštíte, uvnitř firewallu, můžete ho používat u projektů, k nimž má přístup pro čtení velký počet lidí nebo počítačů (servery průběžné integrace nebo servery sestavení), jimž nechcete jednotlivě přiřazovat SSH klíče.

Ať tak či tak, na protokolu Git jistě oceníte jeho snadné nastavení. V podstatě je třeba spustit tento příkaz:

	git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

`--reuseaddr` umožňuje serveru restartování bez nutnosti čekat na vypršení časového limitu pro stará spojení, parametr `--base-path` umožňuje uživatelům klonovat projekty, aniž by museli zadávat celou cestu, a cesta na konci příkazu říká démonovi Git, kde má hledat repozitáře určené k exportu. Jestliže používáte bránu firewall, budete rovněž muset na ní povolit port 9418.

Podle toho, jaký operační systém používáte, můžete přejít do režimu démon mnoha způsoby. U počítačů s Ubuntu můžete použít skript Upstart. Do souboru

	/etc/event.d/local-git-daemon

vložte tento skript:

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

Z bezpečnostních důvodů důrazně doporučujeme, aby byl tento démon spuštěn jako uživatel, který má k repozitářům oprávnění pouze pro čtení. To lze snadno zajistit vytvořením nového uživatele 'git-ro' a spuštěním démona v jeho roli. My ho pro zjednodušení spustíme jako uživatele 'git', kterého už využívá nástroj Gitosis.

Při restartování počítače se démon Git spustí automaticky. V případě pádu démona bude jeho činnost automaticky obnovena. Pokud nechcete počítač restartovat, spusťte tento příkaz:

	initctl start local-git-daemon

V jiných systémech možná budete chtít použít `xinetd`, skript systému `sysvinit`, nebo podobný skript – můžete-li spouštět příkaz démonizovaný a sledovaný.

Dále budete muset svému serveru Gitosis sdělit, k jakým repozitářům si přejete povolit neověřený serverový přístup Git. Pokud přidáte jednu část pro každý repozitář, můžete určit repozitáře, z nichž si přejete dovolit démonovi Git načítat data. Chcete-li povolit přístup přes protokol Git k projektu `iphone_project`, přidejte ho na konec souboru `gitosis.conf`:

	[repo iphone_project]
	daemon = yes

Po zapsání a odeslání této revize by měl váš spuštěný démon začít obsluhovat požadavky k projektu pro všechny, kdo mají přístup k portu 9418 na vašem serveru.

Pokud nechcete používat Gitosis, ale chcete nastavit démona Git, budete muset u každého projektu, který chcete obsluhovat démonem Git, provést následující:

	$ cd /path/to/project.git
	$ touch git-daemon-export-ok

Přítomnost tohoto souboru systému Git sděluje, že si přejete obsluhovat tento projekt bez ověřování.

Gitosis může také určovat, jaké projekty bude zobrazovat GitWeb. Nejprve budete muset do souboru `/etc/gitweb.conf` vložit následující:

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

Vložením nebo odstraněním nastavení `gitweb` z konfiguračního souboru Gitosis můžete určit, které projekty dovolí GitWeb uživatelům procházet. Pokud například chcete, aby GitWeb zobrazoval `iphone_project`, upravíte nastavení `repo` do této podoby:

	[repo iphone_project]
	daemon = yes
	gitweb = yes

Pokud teď zapíšete a odešlete projekt, GitWeb začne automaticky zobrazovat `iphone_project`.
