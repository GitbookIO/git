# Gitolite

Git se stal hodně populárním v korporátním prostředí, které obvykle mívá další doplňující požadavky na kontrolu přístupu. Nástroj Gitolite byl vytvořen právě na řešení těchto požadavků.

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

Gitolite je autorizační vrstva nad gitem, která při autentizaci spoléhá na `sshd` nebo `httpd`. (Připomeňme si: autentizace spočívá v rozpoznání uživatele, autorizací rozumíme rozhodování, zda má povolení k provádění toho, co se provést pokouší.)

Gitolite umožňuje nastavit přístupová práva nejen na repozitáře (podobně jako Gitosis), ale také na větve a značky v každém repozitáři. To znamená, že lze nastavit, aby určití lidé mohli odesílat jen do určité reference (větve nebo značky) a do jiné ne.

## Instalace

Instalace Gitolite je velmi jednoduchá a to i když nebudete číst obsáhlou dokumentaci, která je k dispozici. Budete potřebovat účet na nějakém unixovém serveru (bylo testováno na různých distribucích Linuxu a na Solarisu 10), kde musí být nainstalovány git, Perl a SSH server kompatibilní s OpenSSH. V příkladech uvedených níže budeme používat účet `git` na serveru `gitserver`.

Nástroj Gitolite je ve smyslu „serverového“ softwaru poněkud neobvyklý. Přístup se realizuje přes ssh, takže každá serverová userid je potenciálně „hostitelem gitolite“ (gitolite host). Teď si popíšeme nejjednodušší způsob instalace. V dokumentaci naleznete další metody.

Začněte tím, že na serveru vytvoříte uživatele nazvaného `git` a přihlásíte se na něj. Z vaší pracovní stanice nakopírujte svůj veřejný ssh klíč (pokud jste spustili `ssh-keygen` s implicitními hodnotami, jde o soubor `~/.ssh/id_rsa.pub`) a přejmenujte jej na `VaseJmeno.pub`. Potom proveďte následující příkazy:

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	    # předpokládá existenci $HOME/bin a uvedení tohoto adresáře v $PATH
	$ gitolite setup -pk $HOME/scott.pub

Poslední příkaz vytvoří na serveru nový gitovský repozitář nazvaný `gitolite-admin`.

Nakonec přejděte zpět na pracovní stanici a spusťte `git clone git@gitserver:gitolite-admin`. To je všechno! Nyní máte Gitolite nainstalovaný na serveru a v domácím adresáři vaší pracovní stanice máte také úplně nový repozitář `gitolite-admin`. Své nastavení Gitolite spravujete pomocí provádění změn v tomto repozitáři jejich odesíláním (push).

## Přizpůsobení instalace

Základní rychlá metoda instalace bude většině lidí vyhovovoat. V případě potřeby existují další možnosti přizpůsobení. Něco můžete změnit jednoduše editací rc souboru. Pokud to ale nestačí, naleznete víc v dokumentaci věnované přizpůsobení Gitolite.

## Konfigurační soubor a pravidla přístupu

Přepněte se do repozitáře `gitolite-admin` (je umístěn ve vašem domácím adresáři), jakmile je instalace dokončena, a podívejte se co tam je:

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

Všimněte si, že „scott“ (jméno veřejného klíče v dříve použitém příkazu `gitolite setup`) má práva pro čtení i zápis k repozitáři `gitolite-admin` a také stejnojmenný veřejný klíč.

Přidávání dalších uživatelů je snadné. Pokud chceme přidat uživatele „alice“, získáme její veřejný klíč, pojmenujeme jej `alice.pub` a umístíme jej do adresáře `keydir`. Je součástí klonu repozitáře `gitolite-admin`, který jsme právě vytvořili na pracovní stanici. Přidáme, potvrdíme a odešleme změny (add, commit, push). Tím jsme dosáhli přidání uživatele.

Syntaxe konfiguračního souboru pro Gitolite je dobře dokumentovaná, takže zde uvedu jen pár zajímavých věcí.

Pro usnadnění můžete dávat uživatele i repozitáře do skupin. Jména skupin jsou podobná jako makra; když je definujete, je úplně jedno jestli jde o projekty nebo uživatele; rozdíl to je až v momentu, kdy „makro“ použijete.

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

Můžete nastavovat přístupová práva na úrovni referencí. Skupina interns může v následujícím případě odesílat pouze větev „int“. Skupina engineers mohou odesílat větve, jejichž názvy začínají na „eng-“ a značky, které začínají na „rc“ a pak následuje číslo. A skupina admins může dělat cokoliv (včetně vracení změn) v kterékoliv referenci.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

Výraz za `RW` nebo `RW+` je regulární výraz (regex), se kterým se porovnává jméno odesílané reference. Nazvěme jej tedy „refex“! Refex může mít samozřejmě mnohem více použití než je tady ukázáno, takže si dejte pozor ať to nepřeženete, zvláště pokud se necítíte experty na regulární výrazy.

Gitolite přidává prefix `refs/heads/` jako usnadnění syntaxe, pokud refex nezačíná na `refs/`, jak jste mohli odhadnout z příkladu.

Důležitou vlastností syntaxe konfiguračního souboru je to, že všechna pravidla pro repozitáře nemusí být na jednom místě. Můžete nechat obecná nastavení, jako třeba pravidla pro všechny `oss_repos` z příkladu, a potom později přidávat pravidla pro více specifické případy. Např.:

	repo gitolite
	    RW+                     = sitaram

Toto pravidlo se pak přidá do skupiny pravidel `gitolite` repozitáře.

Teď by vás mohlo zajímat, jak jsou vlastně pravidla pro přístup aplikována, pojďme se na to tedy krátce podívat.

V gitolite jsou dvě úrovně kontroly přístupů. První je úroveň repozitářů; jestliže máte práva na čtení (nebo zápis) k jakékoliv referenci v repozitáři, máte tím práva na čtení (nebo zápis) k tomuto repozitáři. Tohle je jediná možnost jakou měl nástroj Gitosis.

Druhá úroveň je pouze pro práva pro „zápis“ a je podle větve nebo značky v repozitáři. Uživatelské jméno uživatele snažícího se o přístup (`W` nebo `+`) a jméno reference, kterou uživatel chce aktualizovat, jsou dané. Pravidla pro přístup jsou procházena postupně v pořadí, tak jak jsou uvedena v konfiguračním souboru a hledají se záznamy odpovídající této kombinaci uživatelského jména a reference (nezapomeňte ale, že refname se porovnává jako regulární výraz nikoliv jako pouhý řetězec). Jestliže je nalezen odpovídající záznam, odesílání je povoleno. Pokud není nalezeno nic, je přístup zamítnut.

## Rozšířená kontrola přístupu ve větvi „rebel“

Jak můžete vidět výše, práva musí být jedno z nastavení `R`, `RW` nebo `RW+`. Dříve zmíněná větev „rebel“ přidává ještě jedno další právo: `-`, znamenající „odmítnutí“. To dává mnohem více možností za cenu zvýšení složitosti, protože nyní už není nenalezení odpovídajícího záznamu při procházení pravidel jedinou možností, jak může být přístup zamítnut. Takže nyní už na pořadí pravidel záleží!

Řekněme, že ve výše uvedené situaci budeme chtít, aby skupina engineers mohla vracet změny v jakékoliv větvi s výjimkou větvě „hlavní“ a větve „integ“. To se nedá nastavit pomocí normální syntaxe, ale s pomocí větve „rebel“ podle následujícího postupu:

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

Pravidla se znovu budou procházet postupně až do momentu, kdy bude nalezeno odpovídají pravidlo nebo bude přístup zamítnut. Odeslání do hlavní větve nebo větve „integ“, která nevracejí zpět změny, jsou povolena prvním pravidlem. Odeslání, která vracejí změny do těchto větví, neodpovídají prvnímu pravidlu. Porovnají se tedy s druhým pravidlem a na jeho základě budou zamítnuty. Odeslání (bez ohledu na to zda se jedná o vracení změn nebo ne) do jiných referencí než hlavní a „integ“ nebudou odpovídat ani prvnímu ani druhému pravidlu a budou tedy díky třetímu pravidlu povolena.

## Omezení odesílání změn vázané na soubory

K omezení odesílání do určitých větví a určitými uživateli můžete přidat také omezení určující, které soubory mohou uživatelé měnit. Například  soubor Makefile (a možná některé programy) by asi neměl kdokoliv měnit, protože je na něm závislá řada dalších věcí. Pokud se neupraví *správným způsobem*, něco by se pokazilo. Nástroji gitolite můžeme říct:

    repo foo
        RW                      =   @junior_devs @senior_devs

        -   VREF/NAME/Makefile  =   @junior_devs

Uživatelé, kteří přecházejí ze starší verze gitolite by si měli dát pozor na to, že v souvislosti s uvedeným rysem došlo k výrazné změně chování. Věnujte prosím pozornost detailům, které jsou uvedeny v příručce pro přechod k nové verzi.

## Osobní větve

Konečně Gitolite má také funkci, která se nazývá „osobní větve“ (nebo raději „jmenný prostor osobních větví“) a může být velmi užitečná v korporátním prostředí.

Hodně výměny kódu probíhá v otevřeném git světě metodou „prosím stáhněte si“. V korporátním prostředí ovšem nebývá jakýkoliv neautorizovaný přístup vítán a pracovní stanice vývojáře nemůže provádět autentizaci, takže můžete na centrální server odesílat, ale musíte požádat někoho jiného, když odtud chcete stahovat.

To by za normálních okolností způsobilo stejný zmatek ve jménech větví jako v centralizovaných systémech správy verzí a navíc nastavování přístupových práv by se stalo noční můrou pro administrátory.

Gitolite vám umožní nadefinovat pro každého vývojáře jmenné prostory s prefixy „personal“ nebo „scratch“ (např. `refs/personal/<devname>/*`). Podrobnosti hledejte v dokumentaci.

## „Wildcard“ repozitáře

Gitolite vám umožní určit repozitáře zástupnými znaky (wildcards; ve skutečnosti jde o perlovské regulární výrazy) -- například k náhodnému výběru zadání příkladu můžeme použít `assignments/s[0-9][0-9]/a[0-9][0-9]`. Umožní nám též přidělit nový režim oprávnění (`C`), který uživatelům povoluje vytvářet repozitáře popsané zástupnými znaky, automaticky přidělí vlastnictví konkrétnímu uživateli, který jej vytvořil, umožní mu přidělit oprávnění `R` a `RW` dalším spolupracovníkům atd. Podrobnosti opět hledejte v dokumentaci.

## Další vlastnosti

Vysvětlení Gitolite završíme přehledem několika vlastností, které jsou detailně popsány v dokumentaci.

**Logování:** Gitolite loguje všechny úspěšné přístupy. Jestliže máte volná pravidla pro přidělování oprávnění vracet změny (práva `RW+`) a stane se, že někdo takto „zkazí“ větev `master`, je tu ještě log soubor, který vám zachrání život, protože v něm můžete postižené SHA najít.

**Přehledy uživatelských oprávnění:** Další příjemnou vlastností je to, co se stane, pokud se pouze pokusíte připojit pomocí SSH na server. Gitolite vám ukáže, ke kterým repozitářům máte přístup a s jakoými oprávněními. Příklad:

        hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4

             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**Delegace:** Pro opravdu velké instalace můžete delegovat zodpovědnost za skupiny a repozitáře dalším lidem a nechat je samotné spravovat jednotlivé části. To snižuje vytížení hlavního administrátora, který tím přestává být úským místem správy.

**Zrcadlení:** Gitolite vám pomůže se správou více zrcadel a při výpadku hlavního serveru můžete snadno přepnout na jiný.
