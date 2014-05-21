# Jak umístit Git na server

Pro úvodní nastavení serveru Git je třeba exportovat existující repozitář do nového, holého repozitáře (bare repository), tj. do repozitáře, který neobsahuje pracovní adresář. S tím obvykle nebývá problém.
Chcete-li naklonovat stávající repozitář, a vytvořit tak nový a holý, zadejte příkaz clone s parametrem `--bare`. Je zvykem, že adresáře s holým repozitářem končí na `.git`, například:

	$ git clone --bare my_project my_project.git
	Initialized empty Git repository in /opt/projects/my_project.git/

Výstup tohoto příkazu je trochu nejasný. Protože příkaz `clone` znamená v podstatě `git init` a následně `git fetch`, vidíme z části `git init`, která vytvoří prázdný adresář, nějaký výstup. Následný přenos objektu neposkytuje žádný výstup, přesto však proběhl. V adresáři `my_project.git` byste nyní měli mít kopii dat z adresáře Git.

Je to přibližně stejné, jako byste zadali například:

	$ cp -Rf my_project/.git my_project.git

Bude tu sice pár menších rozdílů v konfiguračním souboru, ale pro náš účel můžeme příkazy považovat za ekvivalentní. Oba vezmou samotný repozitář Git (bez pracovního adresáře) a vytvoří pro něj samostatný adresář.

## Umístění holého repozitáře na server

Nyní, když máte vytvořenu holou kopii repozitáře, zbývá ji už jen umístit na server a nastavit protokoly. Řekněme, že jste nastavili server nazvaný `git.example.com`, k němuž máte SSH přístup, a všechny svoje repozitáře Git chcete uložit do adresáře `/opt/git`. Nový repozitář můžete nastavit zkopírováním holého repozitáře příkazem:

	$ scp -r my_project.git user@git.example.com:/opt/git

V tomto okamžiku mohou všichni ostatní, kdo mají SSH přístup k tomuto serveru s oprávněním pro čtení k adresáři `/opt/git`, naklonovat váš repozitář příkazem:

	$ git clone user@git.example.com:/opt/git/my_project.git

Pokud se uživatel dostane přes SSH na server a má oprávnění k zápisu do adresáře `/opt/git/my_project.git`, má automaticky také oprávnění k odesílání dat. Zadáte-li příkaz `git init` s parametrem `--shared`, Git automaticky nastaví příslušná oprávnění skupiny k zápisu.

	$ ssh user@git.example.com
	$ cd /opt/git/my_project.git
	$ git init --bare --shared

Vidíte, jak je jednoduché vzít repozitář Git, vytvořit jeho holou verzi a umístit ji na server, k níž máte vy i vaši spolupracovníci SSH přístup. Nic vám teď nebrání začít spolupracovat na projektu.

A to je skutečně vše, co je třeba ke spuštění serveru Git, k němuž bude mít přístup více lidí – na server stačí přidat SSH účty a umístit holý repozitář někam, kam budou mít všichni uživatelé oprávnění ke čtení i zápisu. Vše je připraveno, nic dalšího se od vás nevyžaduje.

V dalších částech se podíváme na některé pokročilé možnosti nastavení. Dozvíte se v nich, jak se vyhnout nutnosti vytvářet uživatelské účty pro všechny uživatele, jak k repozitářům přiřadit veřejné oprávnění pro čtení, jak nastavit webová rozhraní nebo k čemu se používá nástroj Gitosis. To však nemění nic na tom, že ke spolupráci se skupinou lidí na soukromém projektu vystačíte s jedním SSH serverem a holým repozitářem.

## Nastavení pro malou skupinu

Pokud provádíte nastavení jen pro malý okruh lidí nebo jen zkoušíte Git ve své organizaci a nemáte mnoho vývojářů, mnoho věcí pro vás bude jednodušších. Jedním z nejsložitějších aspektů nastavení serveru Git je totiž správa uživatelů. Pokud chcete, aby byly určité repozitáře pro některé uživatele pouze ke čtení a pro jiné i k zápisu, může být nastavení přístupu a oprávnění poměrně náročné.

### SSH přístup

Jestliže už máte server, k němuž mají všichni vaši vývojáři SSH přístup, bude většinou nejjednodušší nastavit první repozitář tam, protože celé nastavení už tím máte v podstatě hotové (jak jsme ukázali v předchozí části). Pokud chcete pro své repozitáře nastavit komplexnější správu oprávnění, můžete je opatřit běžnými oprávněními k systému souborů, které vám nabízí operační systém daného serveru.

Pokud chcete své repozitáře umístit na server, jenž nemá účty pro všechny členy vašeho týmu, kteří by měli mít oprávnění k zápisu, musíte pro ně nastavit SSH přístup. Předpokládáme, že pokud máte server, na němž to lze provést, máte už nainstalován server SSH. Tímto způsobem získáte přístup na server.

Existuje několik způsobů, jak umožnit přístup všem členům vašeho týmu. Prvním způsobem je nastavit účty pro všechny, což není složité, ale může být poněkud zdlouhavé. Možná nebudete mít chuť spouštět příkaz `adduser` (přidat uživatele) a nastavovat dočasná hesla pro každého uživatele zvlášť.

Druhým způsobem je vytvořit na počítači jediného uživatele 'git', požádat všechny uživatele, kteří mají mít oprávnění k zápisu, aby vám poslali veřejný SSH klíč, a přidat tento klíč do souboru `~/.ssh/authorized_keys` vašeho nového uživatele 'git'. Nyní budou mít všichni přístup k tomuto počítači prostřednictvím uživatele 'git'. Tento postup nemá žádný vliv na data vašich revizí – SSH uživatel, jehož účtem se přihlašujete, neovlivní revize, které jste nahráli.

Dalším možným způsobem je nechat ověřovat SSH přístupy LDAP serveru nebo jinému centralizovanému zdroji ověření, který už možná máte nastavený. Dokud má každý uživatel shellový přístup k počítači, měly by fungovat všechny mechanismy ověřování SSH, které vás jen napadnou.
