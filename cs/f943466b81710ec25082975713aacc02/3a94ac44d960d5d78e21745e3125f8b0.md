# Submoduly

Často se stává, že pracujete na jednom projektu, ale na chvíli si potřebujete odskočit do jiného. Jedná se třeba o knihovnu, kterou vyvinula třetí strana, nebo kterou vyvíjíte odděleně a používáte ji v několika nadřazených projektech. V obou případech se budete potýkat se stejným problémem: oba projekty chcete zachovat samostatné, a přesto potřebujete používat jeden v rámci druhého.

Uveďme malý příklad. Programujete webové stránky a vytváříte kanály Atom. Místo abyste psali vlastní zdrojový kód ke kanálům Atom, rozhodnete se použít knihovnu. Pravděpodobně budete muset použít tento kód ze sdílené knihovny, jako CPAN install nebo Ruby gem, nebo zkopírovat zdrojový kód do vlastního stromu projektu. Problém s použitím knihovny je ten, že je obtížné knihovnu jakýmkoli způsobem upravit a často ještě těžší ji nasadit, protože se musíte ujistit, že ji má k dispozici každý klient. Problémem s převzetím zdrojového kódu do vlastního projektu bývá, že jakékoli uživatelské změny, které provedete, se obtížně začleňují, pokud se objeví novější změny.

Git nabízí jako řešení tohoto problému nástroj submodulů. Submoduly umožňují uchovávat repozitář Git jako podadresář jiného repozitáře Git. Do svého projektu tak můžete naklonovat jiný repozitář a uchovávat revize oddělené.

## Začátek práce se submoduly

Předpokládejme, že budete chtít vložit do svého projektu knihovnu Rack (rozhraní brány webového serveru Ruby), udržovat v ní vlastní změny, ale nadále začleňovat i změny ze serveru. První věcí, kterou byste měli udělat, je naklonovat externí repozitář do vlastního podadresáře. Externí projekty přidáte do svého projektu jako submoduly příkazem `git submodule add`:

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.

Nyní máte projekt Rack uložen ve svém projektu v podadresáři `rack`. Můžete přejít do tohoto podadresáře, provést změny, přidat vlastní vzdálený repozitář s oprávněním k zápisu, kam budete změny odesílat, vyzvednout a začlenit data z původního repozitáře atd. Pokud byste bezprostředně po přidání submodulu spustili příkaz `git status`, viděli byste dvě věci:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

Zaprvé si všimnete souboru `.gitmodules`. Jedná se o konfigurační soubor, v němž je uloženo mapování mezi adresou URL projektu a lokálním podadresářem, do nějž jste stáhli repozitář.

	$ cat .gitmodules
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

Máte-li submodulů více, bude v tomto souboru několik záznamů. Za zmínku stojí, že je tento soubor verzován spolu s ostatními soubory, podobně jako třeba soubor `.gitignore`. Soubor se odesílá a stahuje se zbytkem projektu. Ostatní uživatelé, kteří budou tento projekt klonovat, díky tomu zjistí, kde najdou projekty submodulů.

Tím dalším, co se objevuje ve výstupu příkazu `git status`, je položka rack. Pokud na ni použijete příkaz `git diff`, uvidíte zajímavou věc:

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Ačkoli je `rack` podadresářem ve vašem pracovním adresáři, Git ví, že se jedná o submodul, a dokud se v tomto adresáři nenacházíte, nesleduje jeho obsah. Místo toho zaznamenává Git konkrétní revizi z tohoto adresáře. Provedete-li v tomto podadresáři změny a zapíšete revizi, superprojekt (tedy celkový, nadřízený projekt) zjistí, že se tu ukazatel HEAD změnil, a zaznamená přesnou revizi, na níž právě pracujete. Pokud pak tento projekt naklonují jiní uživatelé, budou schopni přesně obnovit původní prostředí.

Toto je důležitá vlastnost submodulů: zaznamenáváte je jako přesné revize, na nichž se nacházejí. Submodul nelze zaznamenat na větvi `master` nebo na jiné symbolické referenci.

Jestliže zapíšete revizi, zobrazí se přibližně toto:

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

Všimněte si režimu (mode) 160000 u záznamu rack. Jedná se o speciální režim systému Git, který udává, že revizi zaznamenáváte jako adresář, ne jako podadresář nebo soubor.

S adresářem `rack` můžete pracovat jako se samostatným projektem a čas od času aktualizovat superprojekt ukazatelem na nejnovější revizi v tomto subprojektu. Všechny příkazy Git pracují v obou adresářích nezávisle:

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

## Klonování projektu se submoduly

Nyní naklonujeme projekt, jehož součástí je submodul. Pokud takový projekt obdržíte, získáte adresáře, které tyto submoduly obsahují, ale zatím žádný soubor:

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

Máte sice adresář `rack`, ten je však prázdný. Budete muset použít dva příkazy: `git submodule init` k inicializaci lokálního konfiguračního souboru a `git submodule update` k vyzvednutí všech dat z tohoto projektu a checkoutu příslušné revize uvedené ve vašem superprojektu:

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

Váš podadresář `rack` je nyní přesně ve stejném stavu, jako když jste předtím zapisovali revizi. Jestliže jiný vývojář provede změny v kódu adresáře rack a zapíše je do revize a vy poté tuto referenci stáhnete a začleníte, dostanete něco, co bude vypadat poněkud zvláštně:

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

Začlenili jste něco, co je v podstatě změna ukazatele vašeho submodulu. Neaktualizovali jste tím však zdrojový kód v adresáři submodulu, takže to vypadá, jako že je váš pracovní adresář v chaotickém stavu:

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

A tak to opravdu je. Ukazatel, který máte pro submodul, není to, co máte skutečně v adresáři submodulu. Abyste tento problém vyřešili, spusťte ještě jednou příkaz `git submodule update`:

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

To budete muset udělat pokaždé, když stáhnete změnu v submodulu v hlavním projektu. Je to sice trochu zvláštní, ale opravdu to tak funguje.

K tradičním problémům dochází, jestliže vývojář provede lokální změnu v submodulu, ale neodešle ji na veřejný server. Poté zapíše ukazatel do tohoto neveřejného stavu a superprojekt odešle na server. Když se pak ostatní vývojáři pokusí spustit příkaz `git submodule update`, systém submodulu nemůže najít revizi, k níž se vztahuje jedna z referencí, protože existuje pouze v prvním systému vývojáře. Pokud dojde k něčemu takovému, zobrazí se následující chyba:

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

Musíte zjistit, kdo změnil submodul jako poslední:

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

Nyní znáte provinilcovu e-mailovou adresu a můžete mu vyčinit.

## Superprojekty

Vývojáři někdy chtějí získat kombinaci podadresářů velkého projektu podle toho, v jakém týmu pracují. K tomu může dojít, pokud přecházíte ze systému CVS nebo Subversion, kde jste definovali modul nebo několik podadresářů, a chcete v tomto typu pracovního postupu pokračovat.

Dobrým způsobem, jak to v systému Git provést, je učinit ze všech podsložek oddělené repozitáře Git a vytvořit repozitáře superprojektu Git, které budou obsahovat několik submodulů. Výhodou tohoto postupu je, že můžete podrobněji definovat vztah mezi projekty se značkami a větvemi v superprojektech.

## Problémy se submoduly

Používání submodulů se však vždy neobejde bez zádrhelů. Zaprvé je třeba, abyste si v adresáři submodulu počínali opatrně. Spustíte-li příkaz `git submodule update`, provedete tím checkout konkrétní verze projektu, avšak nikoli v rámci větve. Říká se tomu oddělená hlava (detached head) – znamená to, že soubor HEAD ukazuje přímo na revizi, ne na symbolickou referenci. Problém je, že většinou nechcete pracovat v prostředí oddělené hlavy, protože byste tak velmi snadno mohli přijít o provedené změny. Jestliže nejprve spustíte příkaz `submodule update`, zapíšete v adresáři tohoto submodulu revizi, aniž byste na tuto práci vytvořili novou větev, a poté ze superprojektu znovu spustíte příkaz `git submodule update`, aniž byste mezitím zapisovali revize, Git vaše revize bez varování přepíše. Technicky vzato práci neztratíte, ale nebude žádná větev, která by na ni ukazovala, a tak bude poněkud obtížené získat práci zpět.

Aby ve vašem projektu k tomuto problému nedošlo, vytvořte během práce v adresáři submodulu příkazem `git checkout -b work` nebo podobným novou větev. Až budete podruhé provádět příkaz submodule update, i tentokrát sice vrátí vaši práci, ale přinejmenším budete mít ukazatel, k němuž se budete moci vrátit.

Problematické může být také přepínání větví obsahujících submoduly. Vytvoříte-li novou větev, přidáte do ní submodul a poté přepnete zpět na větev bez tohoto submodulu, není adresář submodulu stále ještě sledován:

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/

Budete ho muset buď přemístit, nebo odstranit. V druhém případě ho budete muset znovu naklonovat, až přepnete zpět, navíc hrozí, že ztratíte lokální změny nebo větve, které jste neodeslali.

Poslední velký problém s nímž se uživatelé často setkávají, souvisí s přepínáním z podadresářů na submoduly. Pokud jste ve svém projektu sledovali soubory a chcete je přesunout do submodulu, musíte být velmi opatrní, abyste si Git proti sobě nepoštvali. Řekněme, že máte soubory rack v podadresáři svého projektu a chcete ho přepnout do submodulu. Jestliže odstraníte podadresář a spustíte příkaz `submodule add`, Git vám vynadá:

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

Adresář `rack` už byl připraven k zapsání. Proto ho musíte nejprve vrátit, až potom můžete přidat submodul:

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.

Nyní předpokládejme, že toto vše se odehrálo ve větvi. Pokud se pokusíte přepnout zpět do větve, kde jsou tyto soubory v aktuálním stromu, a ne v submodulu, zobrazí se tato chyba:

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

Nejprve budete muset přemístit adresář submodulu `rack`, než vám Git dovolí přepnout na větev, která adresář neobsahuje:

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

Až poté přepnete zpět, bude adresář `rack` prázdný. Buď můžete spustit příkaz `git submodule update` a provést nové klonování, nebo můžete přesunout adresář `/tmp/rack` zpět do prázdného adresáře.
