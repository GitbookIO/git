# Správa verzí

Co je to správa verzí a proč by vás měla zajímat? Správa verzí je systém, který zaznamenává změny souboru nebo sady souborů v průběhu času, a uživatel tak může kdykoli obnovit jeho/jejich konkrétní verzi (tzv. verzování). Příklady verzovaných souborů jsou v této knize ilustrovány na zdrojovém kódu softwaru, avšak ve skutečnosti lze verzování provádět téměř se všemi typy souborů v počítači.

Pokud jste grafik nebo webdesigner a chcete uchovávat všechny verze obrázku nebo všechna rozložení stránky (což jistě není k zahození), je pro vás systém správy verzí (zkráceně VCS z angl. Version Control System) ideálním nástrojem. VCS umožňuje vrátit jednotlivé soubory nebo celý projekt do předchozího stavu, porovnávat změny provedené v průběhu času, zjistit, kdo naposledy upravil něco, co nyní možná způsobuje problémy, kdo vložil jakou verzi a kdy a mnoho dalšího. Používáte-li verzovací systém, většinou to také znamená, že snadno obnovíte soubory, které jste ztratili nebo v nichž byly provedeny nežádoucí změny. Všechny funkcionality verzovacího systému můžete navíc používat velice jednoduchým způsobem.

## Lokální systémy správy verzí

Uživatelé často provádějí správu verzí tím způsobem, že zkopírují soubory do jiného adresáře (pokud jsou chytří, označí adresář i příslušným datem). Takový přístup je velmi častý, protože je jednoduchý. Je s ním však spojeno také velké riziko omylů a chyb. Člověk snadno zapomene, ve kterém adresáři se právě nachází, a nedopatřením začne zapisovat do nesprávného souboru nebo přepíše nesprávné soubory.

Aby se uživatelé tomuto riziku vyhnuli, vyvinuli programátoři už před dlouhou dobou lokální systémy VCS s jednoduchou databází, která uchovávala všechny změny souborů s nastavenou správou revizí (viz obrázek 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)

Obrázek 1-1. Diagram lokální správy verzí

Jedním z velmi oblíbených nástrojů VCS byl systém s názvem rcs, který je ještě dnes distribuován s mnoha počítači. Dokonce i populární operační systém Mac OS X obsahuje po nainstalování vývojářských nástrojů (Developer Tools) příkaz rcs. Tento nástroj pracuje na tom principu, že na disku uchovává ve speciálním formátu seznam změn mezi jednotlivými verzemi. Systém později může díky porovnání těchto změn vrátit jakýkoli soubor do podoby, v níž byl v libovolném okamžiku.

## Centralizované systémy správy verzí

Dalším velkým problémem, s nímž se uživatelé potýkají, je potřeba spolupráce s dalšími pracovníky týmu. Řešení tohoto problému nabízejí tzv. centralizované systémy správy verzí (CVCS z angl. Centralized Version Control System). Tyto systémy, jmenovitě např. CVS, Subversion či Perforce, obsahují serverovou část, která uchovává všechny verzované soubory. Z tohoto centrálního úložiště si potom soubory stahují jednotliví klienti. Tento koncept byl dlouhá léta standardem pro správu verzí (viz obrázek 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)

Obrázek 1-2. Diagram centralizované správy verzí

Nabízí ostatně mnoho výhod, zejména v porovnání s lokálními systémy VCS. Každý například — do určité míry — ví, co dělají ostatní účastníci projektu a administrátoři mají přesnou kontrolu nad jednotlivými právy. Kromě toho je podstatně jednodušší spravovat CVCS, než pracovat s lokálními databázemi na jednotlivých klientech.

Avšak i tato koncepce má závažné nedostatky. Tímto nejkřiklavějším je riziko kolapsu celého projektu po výpadku jediného místa — centrálního serveru. Pokud takový server na hodinu vypadne, pak během této hodiny buď nelze pracovat vůbec, nebo přinejmenším není možné ukládat změny ve verzích souborů, na nichž uživatelé právě pracují. A dojde-li k poruše pevného disku, na němž je uložena centrální databáze, a disk nebyl předem zálohován, dojde ke ztrátě všech dat, celé historie projektu, s výjimkou souborů aktuálních verzí, jež mají uživatelé v lokálních počítačích. Ke stejnému riziku jsou náchylné také lokální systémy VCS. Jestliže máte celou historii projektu uloženou na jednom místě, hrozí, že přijdete o vše.

## Distribuované systémy správy verzí

V tomto místě přicházejí ke slovu tzv. distribuované systémy správy verzí (DVCS z angl. Distributed Version Control System). V systémech DVCS (např. Git, Mercurial, Bazaar nebo Darcs) uživatelé pouze nestahují nejnovější verzi souborů (tzv. snímek, anglicky snapshot), ale uchovávají kompletní kopii repozitáře (repository). Pokud v takové situaci dojde ke kolapsu serveru, lze jej obnovit zkopírováním repozitáře od libovolného uživatele. Každá lokální kopie (checkout) je plnohodnotnou zálohou všech dat (viz obrázek 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)

Obrázek 1-3. Diagram distribuované správy verzí

Mnoho z těchto systémů navíc bez větších obtíží pracuje i s několika vzdálenými repozitáři, a vy tak můžete v rámci jednoho projektu spolupracovat na různých úrovních s rozdílnými skupinami lidí. Díky tomu si můžete vytvořit několik typů pracovních postupů, což není v centralizovaných systémech (např. v hierarchických modelech) možné.
