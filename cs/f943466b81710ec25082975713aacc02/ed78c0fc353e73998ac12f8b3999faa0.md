# Ladění v systému Git

Git také nabízí několik nástrojů, které vám pomohou ladit problémy v projektech. Protože je Git navržen tak, aby pracoval téměř s jakýmkoli typem projektu, jsou tyto nástroje velmi univerzální. Často vám mohou pomoci odhalit vzniklou chybu nebo problém.

## Anotace souboru

Zjistíte-li ve svém zdrojovém kódu chybu a chcete vědět, kdy a jak vznikla, je často nejlepším nástrojem anotace souboru (file annotation). Ukáže vám, při které revizi byly jednotlivé řádky každého souboru naposledy změněny. Pokud zjistíte, že některá metoda ve vašem kódu obsahuje chybu, můžete soubor anotovat příkazem `git blame`, který u každého řádku metody zobrazí, kdo a kdy ho naposledy upravil. Následující příklad používá parametr `-L`, který omezí výstup na řádky 12 až 22:

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

Všimněte si, že první pole je část hodnoty SHA-1 revize, v níž byl řádek naposled změněn. Další dvě pole jsou hodnoty získané z revize: jméno autora a datum, zapsané u této revize. Z toho vyčtete, kdo a kdy tento řádek upravil. Za tímto údajem následuje číslo řádku a obsah souboru. Všimněte si také řádků revize `^4832fe2`, které oznamují, že tyto řádky byly obsaženy v originální revizi tohoto souboru. Tato revize vznikla prvním přidáním tohoto souboru do projektu a tyto řádky zůstaly od té doby nezměněny. Je to trochu matoucí, protože jsme před chvílí viděli minimálně tři různé způsoby, jak Git používá znak `^` k modifikaci hodnoty SHA revize. Tady má tento znak jiný význam.

Další skvělou věcí na systému Git je, že explicitně nesleduje přejmenování souboru. Zaznamenává snímky a poté se snaží zjistit, co bylo později implicitně přejmenováno. Zajímavou funkcí je také to, že můžete systému Git zadat, aby zjistil všechny druhy přesouvání kódu. Zadáte-li k příkazu `git blame` parametr `-C`, Git zanalyzuje soubor, který anotujete, a pokud jednotlivé kousky kódu v něm obsažené pocházejí původně odjinud, pokusí se Git zjistit odkud. Nedávno jsem refaktoroval soubor s názvem `GITServerHandler.m` do několika jiných souborů, jeden z nich se jmenoval `GITPackUpload.m`. Když jsem zadal příkaz `GITPackUpload.m` s parametrem `-C`, dostal jsem informace, odkud původně pocházejí jednotlivé kousky kódu:

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

Tato funkce je opravdu užitečná. Normálně se jako původní revize zobrazí ta, kam jste kód zkopírovali, protože to bylo poprvé, kdy jste v daném souboru sáhli do těchto řádků. Git vám vyhledá původní revizi, kde jste tyto řádky napsali, dokonce i když jsou v jiném souboru.

## Binární vyhledávání

Anotace souboru má smysl, pokud víte, kde problém hledat. Pokud nemáte ponětí, co může chybu způsobovat, a od posledního zaručeně funkčního stavu kódu byly zapsány desítky nebo stovky revizí, možná budete pomoc hledat raději u příkazu `git bisect`. Příkaz `bisect` zahájí binární vyhledávání ve vaší historii revizí a pomůže vám co nejrychleji identifikovat, která revize je původcem problému.

Řekněme, že jste právě odeslali vydání svého zdrojového kódu do produkčního prostředí, ale dostanete hlášení o chybě, která se ve vašem vývojovém prostředí nevyskytovala, a nemáte tušení, proč kód takto zlobí. Vrátíte se zpět ke svému kódu, a ukáže se, že dokážete problém reprodukovat, ne však identifikovat. K odhalení problému můžete použít příkaz bisect (tedy „rozpůlit“). Nejprve spustíte příkaz `git bisect start`, jímž celý proces zahájíte, a poté použijete příkaz `git bisect bad`, jímž systému oznámíte, že aktuální revize, na níž se právě nacházíte, obsahuje chybu. Poté musíte nástroji bisect sdělit, kdy byl kód naposled nepochybně funkční. K tomu použijete příkaz `git bisect good [good_commit]`:

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git zjistil, že mezi revizí, kterou jste označili jako poslední dobrou (v1.0), a aktuální problémovou verzí je asi 12 revizí, a provedl checkout prostřední revize. Nyní můžete provést testování a vyzkoušet, zda problém existuje i v této revizi. Pokud ano, vznikla chyba někdy před touto prostřední revizí; pokud ne, pak je problém záležitostí revizí zapsaných až po této prostřední revizi. Ukáže se, že na této revizi k problému nedochází, a tak to systému Git sdělíte příkazem `git bisect good` a budete v hledání pokračovat:

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

Nyní jste na jiné revizi, na půl cesty mezi revizí, kterou jste právě otestovali, a problémovou revizí. Znovu provedete svůj test a zjistíte, že tato revize vykazuje chybu. Systému Git to sdělíte příkazem `git bisect bad`:

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

Tato revize je v pořádku, a Git tak má nyní všechny informace, které potřebuje k určení, kde problém vznikl. Sdělí vám SHA-1 první revize s chybou a zobrazí některé další informace o revizi a o tom, které soubory byly v této revizi změněny. Zjistíte tak, co bylo součástí revize a co může způsobovat hledanou chybu:

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

Až vyhledávání dokončíte, měli byste použít příkaz `git bisect reset`, abyste se vrátili do jednoznačného stavu. Příkaz vrátí váš ukazatel HEAD na pozici, z níž jste vyhledávání zahajovali:

	$ git bisect reset

bisect je výkonný nástroj, který vám může pomoci zkontrolovat za pár minut i stovky revizí s neurčitou chybou. A máte-li skript, jehož výstupem bude 0, pokud je projekt v pořádku, nebo nenulovou hodnotu, pokud je v projektu chyba, můžete příkaz `git bisect` dokonce plně automatizovat. Nejprve opět zadáte poslední známé revize s chybou a bez ní, jimiž vytyčíte cílovou oblast pro příkaz bisect. Chcete-li, můžete to provést příkazem `bisect start` – jako první uvedete známou revizi s chybou, jako druhá bude následovat poslední známá dobrá revize:

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

Automaticky se spustí `test-error.sh` na všech načtených revizích, dokud Git nenajde první revizi s chybou. Podobně můžete spustit také příkaz `make` nebo `make tests` či cokoli jiného, čím spouštíte automatické testování.
