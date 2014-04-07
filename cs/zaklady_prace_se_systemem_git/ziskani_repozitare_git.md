# Získání repozitáře Git

Projekt v systému Git lze získat dvěma základními způsoby. První vezme existující projekt nebo adresář a importuje ho do systému Git. Druhý naklonuje existující repozitář Git z jiného serveru.

## Inicializace repozitáře v existujícím adresáři

Chcete-li zahájit sledování existujícího projektu v systému Git, přejděte do adresáře projektu a zadejte příkaz:

	$ git init

Příkaz vytvoří nový podadresář s názvem `.git`, který bude obsahovat všechny soubory nezbytné pro repozitář, tzv. kostru repozitáře Git. V tomto okamžiku ještě není nic z vašeho projektu sledováno. (Více informací o tom, jaké soubory obsahuje právě vytvořený adresář `.git`, naleznete v kapitole 9.)

Chcete-li spustit verzování existujících souborů (na rozdíl od prázdného adresáře), měli byste pravděpodobně zahájit sledování (tracking) těchto souborů a provést první revizi (commit). Můžete tak učinit pomocí několika příkazů `git add`, jimiž určíte soubory, které chcete sledovat, a provedete revizi:

	$ git add *.c
	$ git add README
	$ git commit -m 'initial project version'

K tomu, co přesně tyto příkazy provedou, se dostaneme za okamžik. V této chvíli máte vytvořen repozitář Git se sledovanými soubory a úvodní revizí.

## Klonování existujícího repozitáře

Chcete-li vytvořit kopii existujícího repozitáře Git (například u projektu, do nějž chcete začít přispívat), pak příkazem, který hledáte, je `git clone`. Pokud jste zvyklí pracovat s jinými systémy VCS, např. se systémem Subversion, jistě jste si všimli, že příkaz zní `clone`, a nikoli `checkout`. Souvisí to s jedním podstatným rozdílem: Git stáhne kopii téměř všech dat na serveru. Po spuštění příkazu `git clone` budou k historii projektu staženy všechny verze všech souborů. Pokud by někdy poté došlo k poruše disku serveru, lze použít libovolný z těchto klonů na kterémkoli klientovi a obnovit pomocí něj server zpět do stavu, v němž byl v okamžiku klonování (může dojít ke ztrátě některých zásuvných modulů na straně serveru apod., ale všechna verzovaná dat budou obnovena – další podrobnosti v kapitole 4).

Repozitář naklonujete příkazem `git clone [url]`. Pokud například chcete naklonovat knihovnu Ruby Git nazvanou Grit, můžete to provést následovně:

	$ git clone git://github.com/schacon/grit.git

Tímto příkazem vytvoříte adresář s názvem `grit`, inicializujete v něm adresář `.git`, stáhnete všechna data pro tento repozitář a systém rovněž stáhne pracovní kopii nejnovější verze. Přejdete-li do nového adresáře `grit`, uvidíte v něm soubory projektu připravené ke zpracování nebo jinému použití. Pokud chcete naklonovat repozitář do adresáře pojmenovaného jinak než grit, můžete název zadat jako další parametr na příkazovém řádku:

	$ git clone git://github.com/schacon/grit.git mygrit

Tento příkaz učiní totéž co příkaz předchozí, jen cílový adresář se bude jmenovat `mygrit`.

Git nabízí celou řadu různých přenosových protokolů. Předchozí příklad využívá protokol `git://`, můžete se ale setkat také s protokolem `http(s)://` nebo `user@server:/path.git`, který používá přenosový protokol SSH. V kapitole 4 budou představeny všechny dostupné parametry pro nastavení serveru pro přístup do repozitáře Git, včetně jejich předností a nevýhod.
