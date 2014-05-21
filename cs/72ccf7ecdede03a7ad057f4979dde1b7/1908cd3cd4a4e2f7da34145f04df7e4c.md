# Zásuvné moduly Git

Stejně jako jiné systémy správy verzí přistupuje i Git k tomu, že spouští uživatelské skripty, nastane-li určitá důležitá akce. Rozlišujeme dvě skupiny těchto zásuvných modulů (háčků, angl. hooks): na straně klienta a na straně serveru. Zásuvné moduly na straně klienta jsou určeny pro operace klienta, např. zapisování revizí či slučování. Zásuvné moduly na straně serveru se týkají operací serveru Git, např. přijímání odeslaných revizí. Zásuvné moduly se dají využívat k různým účelům. V krátkosti si tu některé z nich představíme.

## Instalace zásuvného modulu

Všechny zásuvné moduly jsou uloženy v podadresáři `hooks` adresáře Git. U většiny projektů to bude konkrétně `.git/hooks`. Git do tohoto adresáře standardně ukládá několik ukázkových skriptů, které jsou často užitečné nejen samy o sobě, ale navíc dokumentují vstupní hodnoty všech skriptů. Všechny zdejší příklady jsou napsány jako shellové skripty, tu a tam obsahující Perl, avšak všechny řádně pojmenované spustitelné skripty budou fungovat správně – můžete je napsat v Ruby, Pythonu nebo jiném jazyce. U verzí systému Git vyšších než 1.6 končí tyto soubory ukázkových zásuvných modulů na .sample, budete je muset přejmenovat. U verzí systému Git před 1.6 jsou tyto ukázkové soubory pojmenovány správně, ale nejsou spustitelné.

Chcete-li aktivovat skript zásuvného modulu, vložte správně pojmenovaný a spustitelný soubor do podadresáře `hooks` adresáře Git. Od tohoto okamžiku by měl být skript volán. V dalších částech se budeme věnovat většině nejvýznamnějších názvů souborů zásuvných modulů.

## Zásuvné moduly na straně klienta

Na straně klienta existuje mnoho zásuvných modulů. V této části je rozdělíme na zásuvné moduly k zapisování revizí, zásuvné moduly pro práci s e-maily a na ostatní zásuvné moduly.

### Zásuvné moduly k zapisování revizí

První čtyři zásuvné moduly se týkají zapisování revizí. Zásuvný modul `pre-commit` se spouští jako první, ještě než začnete psát zprávu k revizi. Slouží ke kontrole snímku, který hodláte zapsat. Může zjišťovat, zda jste na něco nezapomněli, spouštět kontrolní testy nebo prověřovat cokoli jiného, co potřebujete ve zdrojovém kódu zkontrolovat. Je-li výstup tohoto zásuvného modulu nenulový, zapisování bude přerušeno. Tomu se dá předejít zadáním příkazu `git commit --no-verify`. Můžete kontrolovat záležitosti jako styl kódu (spustit lint apod.), koncové mezery (výchozí zásuvný modul dělá právě toto) nebo správnou dokumentaci k novým metodám.

Zásuvný modul `prepare-commit-msg` se spouští ještě předtím, než se otevře editor pro vytvoření zprávy k revizi, ale poté, co byla vytvořena výchozí zpráva. Umožňuje upravit výchozí zprávu dřív, než se zobrazí autorovi revize. Tento zásuvný modul vyžaduje některá nastavení: cestu k souboru, v němž je zpráva k revizi uložena, typ revize, a jedná-li se o doplněnou revizi, také SHA-1 revize. Tento zásuvný modul většinou není pro normální revize využitelný. Hodí se spíše pro revize, u nichž je výchozí zpráva generována automaticky, např. zprávy k revizím ze šablony, revize sloučením, komprimované revize a doplněné revize. Zásuvný modul můžete v kombinaci se šablonou revize využívat k programovému vložení informací.

Zásuvný modul `commit-msg` používá jeden parametr, jímž je cesta k dočasnému souboru obsahujícímu aktuální zprávu k revizi. Je-li návratová hodnota skriptu nenulová, Git přeruší proces zapisování. Skript tak můžete používat k validaci stavu projektu nebo zprávy k revizi, než dovolíte, aby byla revize zapsána. V poslední části této kapitoly ukážeme, jak lze pomocí tohoto zásuvného modulu zkontrolovat, že zpráva k revizi odpovídá požadovanému vzoru.

Po dokončení celého procesu zapisování revize se spustí zásuvný modul `post-commit`. Nepoužívá žádné parametry, ale spuštěním příkazu `git log -1 HEAD` lze snadno zobrazit poslední revizi. Tento skript se tak většinou používá pro účely oznámení a podobně.

Skripty k zapisování revizí na straně klienta lze používat prakticky v každém pracovním postupu. Často se používají jako ujištění, že budou dodržovány stanovené standardy. Tady je však nutné upozornit, že se tyto skripty při klonování nepřenášejí. Standardy můžete kontrolovat na straně serveru a odmítnout odesílané revize, které neodpovídají požadavkům. Záleží však jen na samotném vývojáři, jestli bude tyto skripty využívat i na straně klienta. Toto jsou tedy skripty, které slouží jako pomůcka pro vývojáře. Uživatel je musí nastavit a spravovat, ale kdykoli je může také potlačit nebo upravit.

### Zásuvné moduly pro práci s e-maily

Pro pracovní postup založený na e-mailové komunikaci lze nastavit tři zásuvné moduly na straně klienta. Všechny tři se spouštějí spolu s příkazem `git am`, takže pokud tento příkaz nepoužíváte, můžete beze všeho přeskočit rovnou na následující část. Pokud přebíráte e-mailem záplaty vytvořené příkazem `git format-patch`, mohou pro vás být tyto zásuvné moduly užitečné.

První zásuvným modulem, který se spouští, je `applypatch-msg`. Používá jediný parametr: název dočasného souboru s požadovaným tvarem zprávy k revizi. Je-li výstup tohoto skriptu nenulový, Git přeruší záplatu. Zásuvný modul můžete použít k ujištění, že je zpráva k revizi ve správném formátu, nebo ke standardizaci zprávy – skript může zprávu rovnou upravit.

Další zásuvným modulem, který se může spouštět při aplikaci záplaty příkazem `git am`, je `pre-applypatch`. Nepoužívá žádné parametry a spouští se až po aplikaci záplaty, takže ho můžete využít k ověření snímku před zapsáním revize. Tímto skriptem lze spouštět různé testy nebo jinak kontrolovat pracovní strom. Jestliže je záplata neúplná nebo neprojde prováděnými testy, bude výstup skriptu nenulový, příkaz `git am` bude přerušen a revize nebude zapsána.

Posledním zásuvným modulem, který je během operace `git am` spuštěn, je `post-applypatch`. Můžete ho použít k tomu, abyste skupině uživatelů nebo autorovi záplaty oznámili, že byla záplata natažena. Tímto skriptem nelze proces aplikace záplaty a zapsání revizí zastavit.

### Ostatní zásuvné moduly na straně klienta

Zásuvný modul `pre-rebase` se spouští před každým přeskládáním a při nenulové hodnotě může tento proces zastavit. Zásuvný modul můžete využít i k zakázání přeskládání všech revizí, které už byly odeslány. Ukázkový zásuvný modul `pre-rebase`, který Git nainstaluje, dělá právě toto, ačkoli předpokládá, že následuje název větve, kterou publikujete. Pravděpodobně ho budete muset změnit na název stabilní, zveřejněné větve.

Po úspěšném spuštění příkazu `git checkout` se spustí zásuvný modul `post-checkout`. Ten slouží k nastavení pracovního adresáře podle potřeb prostředí vašeho projektu. Pod tím si můžete představit například přesouvání velkých binárních souborů, jejichž zdrojový kód si nepřejete verzovat, automatické generování dokumentace apod.

A konečně můžeme zmínit zásuvný modul `post-merge`, který se spouští po úspěšném provedení příkazu `merge`. Pomocí něj můžete obnovit data v pracovním stromě, které Git neumí sledovat, např. data oprávnění. Zásuvný modul může rovněž ověřit přítomnost souborů nezahrnutých do správy verzí systému Git, které možná budete chtít po změnách v pracovním stromě zkopírovat.

## Zásuvné moduly na straně serveru

Vedle zásuvných modulů na straně klienta můžete jako správce systému využívat také několik důležitých zásuvných modulů na straně serveru, které vám pomohou kontrolovat téměř jakýkoli typ standardů stanovených pro daný projekt. Tyto skripty se spouštějí před odesíláním revizí na server i po něm. Zásuvné moduly spouštěné před přijetím revizí mohou v případě nenulového výstupu odesílaná data kdykoli odmítnout a poslat klientovi chybové hlášení. Díky nim můžete nastavit libovolně komplexní požadavky na odesílané revize.

### pre-receive a post-receive

Prvním skriptem, který se při manipulaci s revizemi přijatými od klienta spustí, je `pre-receive`. Skript používá seznam referencí, které jsou odesílány ze standardního vstupu stdin. Je-li návratová hodnota nenulová, nebude ani jedna z nich přijata. Zásuvný modul můžete využít např. k ověření, že všechny aktualizované reference jsou „rychle vpřed“, nebo ke kontrole, že uživatel odesílající revize má oprávnění k vytváření, mazání nebo odesílání nebo oprávnění aktualizovat všechny soubory, které svými revizemi mění.

Zásuvný modul `post-receive` se spouští až poté, co je celý proces dokončen. Lze ho použít k aktualizaci jiných služeb nebo odeslání oznámení jiným uživatelům. Používá stejná data ze standardního vstupu jako zásuvný modul `pre-receive`. Ukázkové skripty obsahují odeslání seznamu e-mailem, oznámení serveru průběžné integrace nebo aktualizaci systému sledování tiketů. Možné je dokonce i analyzovat zprávy k revizím a zjistit, zda je některé tikety třeba otevřít, upravit nebo zavřít. Tento skript nedokáže zastavit proces odesílání, avšak klient se neodpojí, dokud není dokončen. Buďte proto opatrní, pokud se chystáte provést akci, která může dlouho trvat.

### update

Skript update je velice podobný skriptu `pre-receive`, avšak s tím rozdílem, že se spouští zvlášť pro každou větev, kterou chce odesílatel aktualizovat. Pokud se uživatel pokouší odeslat revize do více větví, skript `pre-receive` se spustí pouze jednou, zatímco update se spustí jednou pro každou větev, již se odesílatel pokouší aktualizovat. Tento skript nenačítá data ze standardního vstupu, místo nich používá tři jiné parametry: název reference (větve), hodnotu SHA-1, na niž reference ukazovala před odesláním, a hodnotu SHA-1, kterou se uživatel pokouší odeslat. Je-li výstup skriptu update nenulový, je zamítnuta pouze tato reference, ostatní mohou být aktualizovány.
