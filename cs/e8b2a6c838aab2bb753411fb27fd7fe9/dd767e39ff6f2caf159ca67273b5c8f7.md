# Gitosis

Uchovávat veřejné klíče všech uživatelů v souboru `authorized_keys` není uspokojivým řešením na věčné časy. Musíte-li spravovat stovky uživatelů, je tento proces příliš náročný. Pokaždé se musíte přihlásit na server a k dispozici nemáte žádnou správu přístupu – všichni, kdo jsou uvedeni v souboru, mají ke každému projektu oprávnění pro čtení i pro zápis.

Proto možná rádi přejdete na rozšířený softwarový projekt „Gitosis“. Gitosis je v podstatě sada skriptů usnadňující správu souboru `authorized_keys` a implementaci jednoduché správy přístupu. Nejzajímavější je na nástroji Gitosis jeho uživatelské rozhraní pro přidávání uživatelů a specifikaci přístupu – nejedná se totiž o webové rozhraní, ale o speciální repozitář Git. V tomto projektu nastavíte všechny informace, a až ho odešlete, Gitosis překonfiguruje server, který je na něm založen. To je jistě příjemné řešení.

Instalace nástroje Gitosis sice nepatří mezi nejsnazší, ale není ani příliš složitá. Nejjednodušší je k ní použít linuxový server – tyto příklady používají běžný Ubuntu server 8.10.

Gitosis vyžaduje některé nástroje v jazyce Python, a proto první, co musíte udělat, je nainstalovat balíček nástrojů nastavení Python, který je v Ubuntu dostupný jako python-setuptools:

	$ apt-get install python-setuptools

Dále naklonujte a nainstalujte Gitosis z hlavní stránky projektu:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

Tímto příkazem nainstalujete několik spustitelných souborů, které bude Gitosis používat. Gitosis dále vyžaduje, abyste jeho repozitáře uložili do adresáře `/home/git`. Vy už však máte repozitáře vytvořeny ve složce `/opt/git`, a tak místo toho, abyste museli vše překonfigurovat, vytvoříte symbolický odkaz:

	$ ln -s /opt/git /home/git/repositories

Gitosis teď bude spravovat klíče za vás. Proto je třeba, abyste odstranili aktuální soubor, klíče znovu přidali později a nechali Gitosis automaticky spravovat soubor `authorized_keys`. Pro tuto chvíli tedy odstraňte soubor `authorized_keys`:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

Dále musíte znovu zapnout shell na uživatele 'git', jestliže jste ho změnili na příkaz `git-shell`. Uživatelé se stále ještě nebudou moci přihlásit, ale Gitosis za vás bude provádět správu. V souboru `/etc/passwd` tak nyní změníme řádek:

	git:x:1000:1000::/home/git:/usr/bin/git-shell

zpět na

	git:x:1000:1000::/home/git:/bin/sh

V tomto okamžiku můžeme inicializovat nástroj Gitosis. Učiníte tak spuštěním příkazu `gitosis-init` se svým osobním veřejným klíčem. Není-li váš veřejný klíč na serveru, bude ho tam nutné zkopírovat:

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Uživatel s tímto klíčem poté bude moci měnit hlavní repozitář Git, který kontroluje nastavení nástroje Gitosis. Dále je třeba ručně nastavit právo spuštění na skriptu `post-update` pro nový řídicí repozitář.

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Nyní máte vše hotovo. Pokud jste nastavení provedli správně, můžete vyzkoušet SSH přístup na server jako uživatel, pro kterého jste přidali veřejný klíč při inicializaci nástroje Gitosis. Mělo by se zobrazit asi následující:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	fatal: unrecognized command 'gitosis-serve schacon@quaternion'
	  Connection to gitserver closed.

To znamená, že vás Gitosis sice rozpoznal, ale nedovolí vám přístup, protože se nepokoušíte zadat žádný příkaz Git. Provedeme tedy skutečný příkaz systému Git a naklonujeme řídicí repozitář Gitosis:

	# on your local computer
	$ git clone git@gitserver:gitosis-admin.git

Nyní máte adresář s názvem `gitosis-admin`, sestávající ze dvou hlavních částí:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

Soubor `gitosis.conf` je řídicí soubor, který slouží ke specifikaci uživatelů, repozitářů a oprávnění. V adresáři `keydir` jsou pak uloženy veřejné klíče pro všechny uživatele, kteří mají (ať už jakýkoli) přístup k vašim repozitářům – jeden soubor pro každého uživatele. Název souboru v adresáři `keydir` (v předchozím příkladu `scott.pub`) bude ve vašem případě jiný. Gitosis převezme tento název z popisu na konci veřejného klíče, který byl importován spolu se skriptem `gitosis-init`.

Pokud se podíváte na soubor `gitosis.conf`, měl by udávat pouze informace o projektu `gitosis-admin`, který jste právě naklonovali:

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

Tato informace znamená, že uživatel 'scott' – ten, jehož veřejným klíčem jste inicializovali Gitosis – je jediným uživatelem, který má přístup k projektu `gitosis-admin`.

Nyní přidáme nový projekt. Přidáte novou část s názvem `mobile`, která bude obsahovat seznam vývojářů vašeho mobilního týmu a projektů, k nimž tito vývojáři potřebují přístup. Protože je v tuto chvíli jediným uživatelem v systému 'scott', přidáte ho jako jediného člena a vytvoříte pro něj nový projekt s názvem `iphone_project`:

	[group mobile]
	writable = iphone_project
	members = scott

Pokaždé, když provedete změny v projektu `gitosis-admin`, musíte tyto změny zapsat a odeslat je zpět na server, aby nabyly účinnosti:

	$ git commit -am 'add iphone_project and mobile group'
	[master]: created 8962da8: "changed name"
	 1 files changed, 4 insertions(+), 0 deletions(-)
	$ git push
	Counting objects: 5, done.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 272 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	To git@gitserver:/opt/git/gitosis-admin.git
	   fb27aec..8962da8  master -> master

Do nového projektu `iphone_project` teď můžete odeslat svá první data: přidejte do lokální verze projektu svůj server jako vzdálený repozitář a odešlete změny. Od této chvíle už nebudete muset ručně vytvářet holé repozitáře pro nové projekty na serveru. Gitosis je vytvoří automaticky, jakmile zjistí první odeslání dat:

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Všimněte si, že není třeba zadávat cestu (naopak, příkaz by pak nefungoval), pouze dvojtečku a za ní název projektu. Gitosis už projekt vyhledá.

Na tomto projektu chcete spolupracovat s přáteli, a proto budete muset znovu přidat jejich veřejné klíče. Ale místo toho, abyste je vkládali ručně do souboru `~/.ssh/authorized_keys` na serveru, přidáte je do adresáře `keydir`, jeden soubor pro každý klíč. Jak tyto klíče pojmenujete, závisí na tom, jak jsou uživatelé označeni v souboru `gitosis.conf`. Přidejme znovu veřejné klíče pro uživatele Johna, Josie a Jessicu:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Nyní je můžete všechny přidat do týmu 'mobile', čímž získají oprávnění pro čtení i pro zápis k `iphone_project`:

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

Až tuto změnu zapíšete a odešlete, všichni čtyři uživatelé budou moci z tohoto projektu číst a zapisovat do něj.

Gitosis nabízí také jednoduchou správu přístupu. Pokud chcete, aby měl John u projektu pouze oprávnění pro čtení, můžete provést následující:

	[group mobile]
	writable = iphone_project
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_project
	members = john

John nyní může naklonovat projekt a stahovat jeho aktualizace, ale Gitosis mu neumožní, aby odesílal data zpět do projektu. Takových skupin můžete vytvořit libovolně mnoho. Každá může obsahovat různé uživatele a projekty. Jako jednoho ze členů skupiny můžete zadat také celou jinou skupinu (použijete pro ni předponu `@`). Všichni její členové se tím automaticky zdědí.

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_project
	members   = @mobile_committers

	[group mobile_2]
	writable  = another_iphone_project
	members   = @mobile_committers john

Máte-li jakékoli problémy, může vám pomoci zadání `loglevel=DEBUG` do části `[gitosis]`. Pokud jste odesláním nesprávné konfigurace ztratili oprávnění k odesílání dat, můžete ručně opravit soubor na serveru v adresáři `/home/git/.gitosis.conf` – jedná se o soubor, z nějž Gitosis načítá data. Po odeslání dat do projektu bude soubor `gitosis.conf`, který jste právě odeslali, umístěn do tohoto adresáře. Pokud soubor ručně upravíte, zůstane v této podobě až do dalšího úspěšného odeslání do projektu `gitosis-admin`.
