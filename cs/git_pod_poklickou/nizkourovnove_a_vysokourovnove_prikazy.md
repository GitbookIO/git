# Nízkoúrovňové a vysokoúrovňové příkazy

V této knize jsme dosud uvedli asi 30 příkazů, které se používají k ovládání systému Git, např. `checkout`, `branch` nebo `remote`. Protože však byl Git původně spíš soupravou nástrojů k verzování než plným, uživatelsky přívětivým systémem VCS, zná celou řadu příkazů pracujících na nižších úrovních, které byly původně spojovány ve stylu UNIXu nebo volány ze skriptů. Těmto příkazům většinou říkáme „nízkoúrovňové“ (angl. plumbing commands), zatímco uživatelsky přívětivější příkazy označujeme jako „vysokoúrovňové“ (porcelain commands).

Prvních osm kapitol této knihy se zabývá téměř výhradně vysokoúrovňovými příkazy. V této kapitole se však budeme věnovat převážně nízkoúrovňovým příkazům, protože ty vám umožní nahlédnout do vnitřního fungování systému Git a pochopit, jak a proč Git dělá to, co dělá. Nepředpokládám, že byste chtěli tyto příkazy používat osamoceně na příkazovém řádku. Podíváme se na ně spíše jako na stavební kameny pro nové nástroje a skripty.

Spustíte-li v novém nebo existujícím adresáři příkaz `git init`, Git vytvoří adresář `.git`, tj. místo, kde je umístěno téměř vše, co Git ukládá a s čím manipuluje. Chcete-li zazálohovat nebo naklonovat repozitář, zkopírování tohoto jediného adresáře do jiného umístění vám poskytne prakticky vše, co budete potřebovat. Celá tato kapitola se bude zabývat v podstatě jen obsahem tohoto adresáře. Ten má následující podobu:

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

Možná ve svém adresáři najdete i další soubory. Toto je však příkazem `git init` čerstvě vytvořený repozitář s výchozím obsahem. Adresář `branches` se už v novějších verzích systému Git nepoužívá a soubor `description` používá pouze program GitWeb, o tyto dvě položky se tedy nemusíte starat. Soubor `config` obsahuje jednotlivá nastavení pro konfiguraci vašeho projektu a v adresáři `info` je uchováván globální soubor .gitignore s maskami ignorovaných souborů a adresářů, které si nepřejete sledovat. Adresář `hooks` obsahuje skripty zásuvných modulů na straně klienta nebo serveru, které jsme podrobně popisovali v kapitole 6.

Zbývají čtyři důležité položky: soubory `HEAD` a `index` a adresáře `objects` a `refs`. To jsou ústřední součásti adresáře Git. V adresáři `objects` je uložen celý obsah vaší databáze, v adresáři `refs` jsou uloženy ukazatele na objekty revizí v datech (větve). Soubor `HEAD` ukazuje na větev, na níž se právě nacházíte, a soubor `index` je pro systém Git úložištěm informací o oblasti připravených změn. Na každou z těchto částí se teď podíváme podrobněji, abyste pochopili, jak Git pracuje.
