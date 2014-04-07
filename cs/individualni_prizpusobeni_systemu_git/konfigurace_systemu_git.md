# Konfigurace systému Git

Jak jsme v krátkosti ukázali v kapitole 1, příkazem `git config` lze specifikovat konfigurační nastavení systému Git. Jednou z prvních věcí, kterou jsme udělali, bylo nastavení nastavení jména a e-mailové adresy:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Nyní se podíváme na pár dalších zajímavých možností, jež můžete tímto způsobem nastavit, a přizpůsobit tak systém Git svým individuálním potřebám.

V první kapitole jste se seznámili s několika detaily konfigurace, ještě jednou bych se k nim ale rád v rychlosti vrátil. Git používá sérii konfiguračních souborů, v nichž lze nastavit odlišnosti od výchozí konfigurace. Prvním místem, kde Git tyto hodnoty vyhledává, je soubor `/etc/gitconfig`, obsahující hodnoty pro každého uživatele v systému a všechny jejich repozitáře. Zadáte-li parametr `--system` do nástroje `git config`, bude Git načítat a zapisovat pouze do tohoto souboru.

Dalším místem, kde Git vyhledává, je soubor `~/.gitconfig`, který je specifický pro každého uživatele. Git bude načítat a zapisovat výhradně do tohoto souboru, jestliže zadáte parametr `--global`.

Nakonec vyhledává Git konfigurační hodnoty v konfiguračním souboru v adresáři Git (`.git/config`) v právě používaném repozitáři. Tyto hodnoty platí pouze pro tento konkrétní repozitář. Každá další úroveň přepisuje hodnoty z předchozí úrovně, a tak např. hodnoty v souboru `.git/config` mají přednost před hodnotami v souboru `/etc/gitconfig`. Tyto hodnoty můžete nastavit také ruční editací souboru a vložením příslušné syntaxe, většinou je však snazší spustit příkaz `git config`.

## Základní konfigurace klienta

Parametry konfigurace systému Git se dělí do dvou kategorií: strana klienta a strana serveru. Většina parametrů připadá na stranu klienta, neboť se jedná o konfiguraci osobního pracovního nastavení. Přestože parametrů je velmi mnoho, já se zaměřím jen na ty, které se využívají často nebo které mouhou výrazně ovlivnit váš pracovní postup. Mnoho parametrů je využitelných pouze ve specifických případech, jimž se nebudu v této knize věnovat. Pokud vás zajímá seznam parametrů, které vaše verze systému Git rozeznává, můžete si nechat jejich seznam vypsat příkazem:

	$ git config --help

Manuálová stránka pro `git config` zobrazí seznam všech dostupných parametrů i s celou řadou podrobností.

### core.editor

Git používá k vytváření a editaci zpráv k revizím a značkám standardně textový editor, který nastavíte jako výchozí, nebo použije editor Vi. Chcete-li změnit výchozí hodnotu, použijte nastavení `core.editor`:

	$ git config --global core.editor emacs

Nyní už nezáleží na tom, jaký editor máte v shellu nastaven jako výchozí, Git bude k editaci zpráv spouštět Emacs.

### commit.template

Nastavíte-li tuto hodnotu na konkrétní umístění ve svém systému, Git použije tento soubor jako výchozí zprávu pro revize. Řekněme, například, že vytvoříte soubor šablony `$HOME/.gitmessage.txt`, který bude vypadat takto:

	řádek předmětu

	co bylo provedeno

	[tiket: X]

Chcete-li systému Git zadat, aby soubor používal jako výchozí zprávu, která se zobrazí v textovém editoru po spuštění příkazu `git commit`, nastavte konfigurační hodnotu `commit.template`:

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

Při zapisování revize váš editor otevře následující šablonu zprávy k revizi:

	řádek předmětu

	co bylo provedeno

	[tiket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

Máte-li stanoveny standardy pro vytváření zpráv k revizím, může vám vytvoření šablony podle těchto standardů a nastavení systému Git na její používání pomoci k dodržování těchto standardů.

### core.pager

Nastavení core.pager určuje, jaký stránkovač bude použit, musí-li Git rozdělit výpis na stránky (např. výstup příkazu `log` nebo `diff`). Můžete jej nastavit na `more` nebo na nějaký jiný oblíbený (výchozím stránkovačem je `less`). Můžete jej také vypnout zadáním prázdného řetězce:

	$ git config --global core.pager ''

Spustíte-li tento příkaz, Git nebude stránkovat celý výstup všech příkazů, bez ohledu na to, jak jsou dlouhé.

### user.signingkey

Vytváříte-li podepsané anotované značky (jak je popsáno v kapitole 2), celou věc vám usnadní nastavení GPG podpisového klíče v konfiguraci. ID svého klíče nastavíte takto:

	$ git config --global user.signingkey <gpg-key-id>

Nyní můžete podepisovat značky, aniž byste museli pokaždé znovu zadávat svůj klíč příkazem `git tag`:

	$ git tag -s <tag-name>

### core.excludesfile

Do souboru `.gitignore` ve svém projektu můžete vložit masky souborů, které Git neuvidí jakožto nesledované soubory ani se je nepokusí připravit k zapsání, až na ně spustíte příkaz `git add`, jak jsme popisovali v kapitole 2. Pokud však chcete, aby tyto hodnoty obsahoval jiný soubor mimo projekt, nebo chcete určit dodatečné hodnoty, parametrem `core.excludesfile` můžete systému Git sdělit, kde má tento soubor hledat. Jednoduše nastavte cestu k souboru s obsahem podobným souboru `.gitignore`.

### help.autocorrect

Tato možnost je dostupná ve verzi systému Git 1.6.1 a novějších. Pokud ve verzi 1.6 uděláte překlep v příkazu, zobrazí se asi toto:

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

Nastavíte-li parametr `help.autocorrect` na hodnotu 1, Git automaticky spustí příkaz, který by v tomto dialogu vypsal, najde-li právě jediný takový.

## Barvy systému Git

Git může výstup na vašem terminálu barevně zvýraznit a pomoci vám tak snadno a rychle se ve výpisu zorientovat. S individuálním nastavením barev vám pomůže celá řada možností.

### color.ui

Git na přání automaticky barevně zvýrazňuje většinu svých výstupů. Lze přitom velmi podrobně určit, co chcete barevně označit a jak. Chcete-li zapnout výchozí barvy terminálu, nastavte parametr `color.ui` na hodnotu true:

	$ git config --global color.ui true

Je-li tato hodnota nastavena, Git barevně zvýrazní výstup přicházející na terminál. Dalšími možnostmi nastavení jsou false, které výstup nevybarví nikdy, a always, které použije barvy pokaždé, a to i když jste přesměrovali příkazy Git do souboru nebo k jinému příkazu. Toto nastavení bylo přidáno ve verzi systému Git 1.5.5. Máte-li starší verzi, budete muset zadat veškerá barevná nastavení individuálně.

Možnost `color.ui = always` využijete zřídka. Chcete-li použít barevné kódy v přesměrovaném výstupu, můžete většinou místo toho přidat k příkazu Git příznak `--color`. Po jeho zadání příkaz použije barevné kódy. Téměř vždy vystačíte s příkazem `color.ui = true`.

### `color.*`

Pokud byste rádi nastavili přesněji jak budou zvýrazněny různé příkazy nebo máte starší verzi, nabízí Git nastavení barev pro jednotlivé příkazy. Každý z příslušných parametrů může nabývat hodnoty na `true` (pravda), `false` (nepravda) nebo `always` (vždy):

	color.branch
	color.diff
	color.interactive
	color.status

Chcete-li sami nastavit jednotlivé barvy, mají všechny tyto parametry navíc dílčí nastavení, které můžete použít k určení konkrétních barev pro jednotlivé části výstupu. Budete-li chtít nastavit například meta informace ve výpisu příkazu diff tak, aby měly modré popředí, černé pozadí a tučné písmo, můžete použít příkaz:

	$ git config --global color.diff.meta "blue black bold"

U barev lze zadávat tyto hodnoty: normal (normální), black (černá), red (červená), green (zelená), yellow (žlutá), blue (modrá), magenta (purpurová), cyan (azurová) nebo white (bílá). Pokud chcete použít atribut, jakým bylo v předchozím příkladu například tučné písmo, můžete vybírat mezi bold (tučné), dim (tlumené), ul (podtržené), blink (blikající) a reverse (obrácené).

Chcete-li použít dílčí nastavení, podrobnější informace naleznete na manuálové stránce `git config`.

## Externí nástroje pro diff a slučování

Ačkoli Git disponuje vlastním nástrojem diff, který jste dosud používali, můžete místo něj nastavit i libovolný externí nástroj. Stejně tak můžete nastavit vlastní grafický nástroj k řešení konfliktů při slučování, nechcete-li řešit konflikty ručně. Já na tomto místě ukážu, jak nastavit Perforce Visual Merge Tool (P4Merge), protože se jedná o příjemný grafický nástroj pro řešení konfliktů a práci s výstupy nástroje diff. P4Merge je navíc dostupný zdarma.

Pokud ho chcete vyzkoušet, nemělo by vám v tom nic bránit, P4Merge funguje na všech hlavních platformách. V příkladech budu používat označení cest platné pro systémy Mac a Linux; pro systémy Windows budete muset cestu `/usr/local/bin` nahradit cestou ke spustitelnému souboru ve vašem prostředí.

P4Merge můžete stáhnout na této adrese:

	http://www.perforce.com/perforce/downloads/component.html

Pro začátek je třeba nastavit kvůli spouštění příkazů externí skripty wrapperu. Jako cestu ke spustitelnému souboru používám cestu v systému Mac. V ostatních systémech použijte cestu k umístění, kde máte nainstalován binární soubor `p4merge`. Nastavte wrapperový skript pro slučování `extMerge`, který bude volat binární soubor všemi dostupnými parametry:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*

Wrapper nástroje diff zkontroluje zda je skutečně zadáno sedm parametrů a předá dva z nich do skriptu pro slučování. Standardně Git předává do nástoje diff tyto parametry:

	path old-file old-hex old-mode new-file new-hex new-mode

Protože chcete pouze parametry `old-file` a `new-file`, použijete wrapperový skript k zadání těch, které potřebujete.

	$ cat /usr/local/bin/extDiff
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

Dále se potřebujete také ujistit, že lze tyto nástroje spustit:

	$ sudo chmod +x /usr/local/bin/extMerge
	$ sudo chmod +x /usr/local/bin/extDiff

Nyní můžete nastavit konfigurační soubor k používání vlastních nástrojů diff a nástrojů k řešení slučování. S tím souvisí celá řada uživatelských nastavení: `merge.tool`, jímž systému Git sdělíte, kterou strategii slučování má používat, `mergetool.*.cmd`, jímž určíte, jak příkaz spustit, `mergetool.trustExitCode`, který systému Git sdělí, zda návratový kód tohoto programu oznamuje, nebo neoznamuje úspěšné vyřešení sloučení, a `diff.external`, který systému Git říká, jakým příkazem se zjišťují rozdíly. Můžete tedy spustit kterýkoli ze čtyř konfiguračních příkazů:

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

nebo můžete upravit soubor `~/.gitconfig` a vložit následující řádky:

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

Až dokončíte celé nastavení, můžete spustit příkaz diff, např.:

	$ git diff 32d1776b1^ 32d1776b1

Výstup příkazu diff se nezobrazí na příkazovém řádku, ale Git spustí program P4Merge v podobě, jak je zachycen na obrázku 7-1.


![](http://git-scm.com/figures/18333fig0701-tn.png)

Obrázek 7-1. P4Merge

Jestliže se pokusíte sloučit dvě větve a dojde při tom ke konfliktu, můžete spustit příkaz `git mergetool`. Příkaz spustí program P4Merge, v němž budete moci v grafickém uživatelském rozhraní konflikt vyřešit.

Příjemné na tomto wrapperovém nastavení je, že lze snadno změnit nástroj diff i nástroj pro slučování. Chcete-li například změnit nástroje `extDiff` a `extMerge`, aby se místo nich spouštěl nástroj KDiff3, jediné, co musíte udělat, je upravit soubor `extMerge`:

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

Git bude nyní k zobrazení výstupů nástoje diff a k řešení konfliktů při slučování používat nástroj KDiff3.

Git je standardně přednastaven tak, aby dokázal používat celou řadu různých nástrojů k řešení konfliktů při slučování, aniž byste museli nastavovat konfiguraci příkazu. Jako nástroj slučování můžete nastavit kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff nebo gvimdiff. Pokud nestojíte o to, aby systém Git používal nástroj KDiff3 pro nástroj diff, ale používal ho jen k řešení konfliktů při slučování, a příkaz kdiff3 je ve vašem umístění, spusťte příkaz:

	$ git config --global merge.tool kdiff3

Pokud spustíte tento příkaz místo nastavení souborů `extMerge` a `extDiff`, Git bude používat KDiff3 k řešení konfliktů při slučování a interní nástroj diff systému Git pro výpisy nástroje diff.

## Formátování a prázdné znaky

Chyby způsobené formátováním a prázdnými znaky jsou jedny z nejtitěrnějších a nejotravnějších problémů, s nimiž se vývojáři potýkají při vzájemné spolupráci, zvláště mezi různými platformami. U záplat nebo jiné společné práce dochází u prázdných znaků velmi snadno k nepatrným změnám, které v tichosti vytvářejí editory nebo programátoři pracující ve Windows, jež vkládají v projektech z jiných platforem na konce řádků znak pro návrat vozíku (CR, http://cs.wikipedia.org/wiki/Carriage_return). Git disponuje několika konfiguračními parametry, které vám pomohou tyto problémy vyřešit.

### core.autocrlf

Pokud programujete v OS Windows nebo používáte jiný systém, ale spolupracujete s lidmi, kteří ve Windows programují, pravděpodobně se jednou budete potýkat s problémy způsobené konci řádků. Windows ve svých souborech používá pro nové řádky jak znak pro návrat vozíku (carriage return), tak znak pro posun o řádek (linefeed), zatímco systémy Mac a Linux používají pouze znak posun o řádek. Je to sice malý, ale neuvěřitelně obtěžující průvodní jev spolupráce mezi různými platformami.

Git může tento problém vyřešit automatickou konverzí konců řádků CRLF na konce LF, jestliže zapisujete revizi, nebo obráceně, jestliže provádíte checkout zdrojového kódu do svého systému souborů. Tato funkce se zapíná pomocí parametru `core.autocrlf`. Pracujete-li v systému Windows, nastavte hodnotu `true` – při checkoutu zdrojového kódu tím konvertujete konce řádků LF na CRLF:

	$ git config --global core.autocrlf true

Jestliže pracujete v systému Linux nebo Mac, který používá konce řádků LF, nebudete chtít, aby Git při checkoutu souborů automaticky konvertoval konce řádků. Pokud se však náhodou vyskytne soubor s konci řádků CRLF, budete chtít, aby Git tento problém vyřešil. Systému Git tak můžete zadat, aby při zapisování souborů konvertoval znaky CRLF na LF, avšak nikoli obráceně. Nastavte možnost `core.autocrlf` na hodnotu input:

	$ git config --global core.autocrlf input

Toto nastavení by vám mělo pomoci zachovat zakončení CRLF při checkoutu v systému Windows a zakončení LF v systémech Mac a Linux a v repozitářích.

Pokud programujete ve Windows a vytváříte projekt pouze pro Windows, můžete tuto funkci vypnout. Nastavíte-li hodnotu konfigurace na `false`, v repozitáři se budou zaznamenávat i návraty vozíku.

	$ git config --global core.autocrlf false

### core.whitespace

Git je standardně nastaven na vyhledávání a opravu chyb způsobených prázdnými znaky. Může vyhledávat čtyři základní chyby tohoto typu – dvě funkce jsou ve výchozím nastavení zapnuty a lze je vypnout, dvě nejsou zapnuty, avšak lze je aktivovat.

Funkce, které jsou standardně zapnuté, jsou `trailing-space`, která vyhledává mezery na koncích řádků, a `space-before-tab`, která vyhledává mezery před tabulátory na začátcích řádků.

Funkce, které jsou standardně vypnuté, ale lze je zapnout, jsou `indent-with-non-tab`, která vyhledává řádky začínající osmi nebo více mezerami místo tabulátoru, a `cr-at-eol`, která systému Git sděluje, že návraty vozíku na koncích řádků jsou v pořádku.

Které z těchto funkcí si přejete zapnout a které vypnout, to můžete systému Git sdělit zadáním čárkami oddělených hodnot do parametru `core.whitespace`. Funkci vypnete buď tím, že ji z řetězce nastavení zcela vynecháte, nebo tím, že před hodnotu vložíte znak `-`. Chcete-li například zapnout všechny funkce kromě `cr-at-eol`, zadejte příkaz v tomto tvaru:

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

Až spustíte příkaz `git diff`, Git se pokusí tyto problémy vyhledat a barevně označit, abyste je mohli případně ještě před zapsáním revize opravit. Git se těmito hodnotami řídí také při aplikaci záplat příkazem `git apply`. Jestliže aplikujete záplaty, můžete Git požádat, aby vás varoval, pokud je aplikována záplata s některým ze specifikovaných problémů:

	$ git apply --whitespace=warn <patch>

Git se může také pokusit automaticky daný problém vyřešit, ještě než bude záplata aplikována:

	$ git apply --whitespace=fix <patch>

A toto nastavení platí také pro příkaz `git rebase`. Pokud jste zapsali revize s chybami způsobenými prázdnými znaky, ale zatím jste je neodeslali na server, můžete spustit příkaz `rebase` s parametrem `--whitespace=fix`. Git automaticky opraví tyto chyby přepsáním záplat.

## Konfigurace serveru

Na straně serveru není ani zdaleka tolik parametrů konfigurace jako na straně klienta, avšak několik zajímavých si jistě zaslouží vaši pozornost.

### receive.fsckObjects

Git ve výchozím nastavení nekontroluje konzistenci všech objektů, které přijímá při odesílání dat. Ačkoli může při každém odesílání ověřit, že všechny objekty stále souhlasí se svým kontrolním součtem SHA-1 a ukazují k platným objektům, standardně to nedělá. Jedná se o poměrně náročnou operaci, která může každé odesílání výrazně zpomalit. Závisí přitom na velikosti repozitáře nebo odesílaných dat. Pokud chcete, aby Git kontroloval konzistenci objektů při každém odeslání dat, můžete mu to zadat nastavením možnosti `receive.fsckObjects` na hodnotu true:

	$ git config --system receive.fsckObjects true

Git nyní bude kontrolovat integritu vašeho repozitáře před přijetím odeslaných souborů, aby zajistil, že defektní klienti nedodávají data s chybami.

### receive.denyNonFastForwards

Pokud přeskládáte revize, které jste již odeslali, a poté se je pokusíte odeslat ještě jednou nebo pokud se pokusíte odeslat revizi do vzdálené větve, která neobsahuje revizi, na niž právě vzdálená větev ukazuje, bude váš požadavek zamítnut. Toto jsou většinou užitečná pravidla. V případě přeskládání však můžete oznámit, že víte, co děláte, a příznakem `-f` v kombinaci s příkazem push můžete donutit vzdálenou větev k aktualizaci.

Chcete-li vypnout možnost násilné aktualizace vzdálených větví na jiné reference než „rychle vpřed“, zadejte `receive.denyNonFastForwards`:

	$ git config --system receive.denyNonFastForwards true

Druhou možností, jak to provést, jsou přijímací zásuvné moduly (receive hooks) na straně serveru, jimž se budu věnovat později. Tato metoda umožňuje pokročilejší nastavení, jako zamítnutí jiných aktualizací než „rychle vpřed“ určité skupině uživatelů.

### receive.denyDeletes

Jednou z možností, jak může uživatel obejít pravidlo `denyNonFastForwards`, je odstranit větev a odeslat ji zpět s novou referencí. V novějších verzích systému Git (počínaje verzí 1.6.1) lze nastavit možnost `receive.denyDeletes` na hodnotu true:

	$ git config --system receive.denyDeletes true

Paušálně tím zamezíte možnému smazání větve a značek při odesílání, žádný z uživatelů je nebude moci odstranit. Budete-li chtít odstranit vzdálenou větev, budete muset ručně smazat referenční soubory ze serveru. A jak uvidíte na konci kapitoly, existují ještě další zajímavé způsoby, jak provést stejné nastavení na bázi jednotlivých uživatelů prostřednictvím ACL.
