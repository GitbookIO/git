# Přispívání do projektu

V tuto chvíli už znáte různé pracovní postupy a na velmi solidní úrovni byste měli ovládat základy systému Git. V této části ukážeme několik běžných schémat, podle nichž může přispívání do projektů probíhat.

Popsat tento proces není právě jednoduché, protože existuje obrovské množství variací, jak lze do projektů přispívat. Vzhledem k velké flexibilitě systému Git mohou uživatelé spolupracovat mnoha různými způsoby, a není proto snadné popsat, jak byste měli do projektu přispívat. Každý projekt je trochu jiný. Mezi proměnné patří v tomto procesu počet aktivních přispěvatelů, zvolený pracovní postup, vaše oprávnění pro odesílání revizí a případně i metoda externího přispívání.

První proměnnou je počet aktivních přispěvatelů. Kolik uživatelů aktivně přispívá kódem do projektu a jak často? V mnoha případech budete mít dva nebo tři vývojáře přispívající několika málo revizemi denně, u projektů s nízkou prioritou možná i méně. V opravdu velkých společnostech a u velkých projektů se může počet vývojářů vyšplhat do tisíců a počet revizí se může pohybovat v desítkách i stovkách záplat denně. To je důležité zejména z toho hlediska, že s rostoucím počtem vývojářů se také zvětšují starosti s tím, aby byl kód aplikován čistě a aby ho bylo možné snadno začlenit. U změn, které postoupíte vyšší instanci, může docházet k zastarávání nebo vážnému narušení jinými daty, která byla začleněna během vaší práce nebo ve chvíli, kdy vaše změny čekaly na schválení či aplikaci. Jak lze důsledně udržovat kód aktuální a záplaty vždy platné?

Další proměnnou je pracovní postup, který se u projektu využívá. Probíhá vývoj centralizovaně, má každý vývojář stejné oprávnění pro zápis do hlavní linie kódu? Má projekt svého správce nebo integračního manažera, který kontroluje všechny záplaty? Jsou všechny záplaty odborně posuzovány a schvalovány? Jste součástí tohoto procesu? Jsou součástí systému poručíci a musíte všechnu svou práci odesílat nejprve jim?

Další otázkou je vaše oprávnění k zapisování revizí. Pracovní postup při přispívání do projektu se velmi liší podle toho, zda máte, či nemáte oprávnění k zápisu do projektu. Pokud oprávnění k zápisu nemáte, jakou metodu projekt zvolí pro přijímání příspěvků? Má k tomu vůbec vyvinutou metodiku? Kolik práce představuje jeden váš příspěvek? A jak často přispíváte?

Všechny tyto otázky mohou mít vliv na efektivní přispívání do projektu a určují, jaký pracovní postup je vůbec možný a který bude upřednostněn. Všem těmto aspektům bych se teď chtěl věnovat na sérii praktických příkladů, od těch jednodušších až po složité. Z uvedených příkladů byste si pak měli být schopni odvodit vlastní pracovní postup, který budete v praxi využívat.

## Pravidla pro revize

Než se podíváme na konkrétní praktické příklady, přidávám malou poznámku o zprávách k revizím. Není od věci stanovit si a dodržovat kvalitní pravidla pro vytváření revizí. Výrazně vám mohou usnadnit práci v systému Git a spolupráci s kolegy. Projekt Git obsahuje dokument, v němž je navržena celá řada dobrých tipů pro vytváření revizí, z nichž se skládají jednotlivé záplaty. Dokument najdete ve zdrojovém kódu systému Git v souboru `Documentation/SubmittingPatches`.

Především nechcete, aby revize obsahovaly chyby způsobené prázdnými znaky. Git nabízí snadný způsob, jak tyto chyby zkontrolovat. Před zapsáním revize zadejte příkaz `git diff --check`, který zkontroluje prázdné znaky a vypíše vám jejich seznam. Zde uvádím jeden příklad, v němž jsem červenou barvu terminálu nahradil znaky `X`:

	$ git diff --check
	lib/simplegit.rb:5: trailing whitespace.
	+    @git_dir = File.expand_path(git_dir)XX
	lib/simplegit.rb:7: trailing whitespace.
	+ XXXXXXXXXXX
	lib/simplegit.rb:26: trailing whitespace.
	+    def command(git_cmd)XXXX

Spustíte-li tento příkaz před zapsáním revize, můžete se rozhodnout, zda chcete zapsat i problematické prázdné znaky, které mohou obtěžovat ostatní vývojáře.

Dále se snažte provádět každou revizi jako logicky samostatný soubor změn. Pokud je to možné, snažte se provádět stravitelné změny. Není právě ideální pracovat celý víkend na pěti různých problémech a v pondělí je všechny najednou odeslat v jedné velké revizi. I pokud nebudete během víkendu zapisovat revize, využijte v pondělí oblasti připravených změn a rozdělte svou práci alespoň do stejného počtu revizí, kolik je řešených problémů, a přidejte k nim vysvětlující zprávy. Pokud některé změny modifikují tentýž soubor, zkuste použít příkaz `git add --patch` a připravit soubory k zapsání po částech (podrobnosti v kapitole 6). Snímek projektu na vrcholu větve bude stejný, ať zapíšete jednu revizi, nebo pět (za předpokladu, že vložíte všechny změny). Snažte se proto usnadnit práci svým kolegům, kteří – možná – budou vaše změny kontrolovat. Díky tomuto přístupu také později snáze vyjmete nebo vrátíte některou z provedených změn, bude-li to třeba. Kapitola 6 popisuje několik užitečných triků, jak v systému Git přepsat historii a jak interaktivně připravovat soubory k zapsání. Používejte tyto nástroje k udržení čisté a srozumitelné historie.

Poslední věcí, na niž se vyplatí soustředit pozornost, jsou zprávy k revizím. Pokud si zvyknete vytvářet k revizím kvalitní zprávy, bude pro vás práce a kooperace v systému Git mnohem jednodušší. Zpráva by měla obvykle začínat samostatným řádkem o maximálně 50 znacích, v níž stručně popíšete soubor provedených změn. Za ním by měl následovat prázdný řádek a za ním podrobnější popis revize. Projekt Git vyžaduje, aby podrobnější popis revize obsahoval vaši motivaci ke změnám a vymezil jejich implementaci na pozadí předchozích kroků. Tuto zásadu je dobré dodržovat. Vytváříte-li zprávy k revizím v angličtině, často se také doporučuje používat rozkazovací způsob, tj. příkazy. Místo „I added tests for“ nebo „Adding tests for“ používejte raději „Add tests for“.
Zde uvádíme vzor, jehož autorem je Tim Pope a v originále je k nalezení na stránkách tpope.net:

	Krátké (do 50 znaků) shrnutí změn

	Podrobnější popis revize, je-li třeba. Snažte se nepřesáhnout
	zhruba 72 znaků. V některých kontextech	je první řádek koncipován
	jako předmět e-mailu a zbytek textu jako jeho tělo. Prázdný řádek
	oddělující shrnutí od těla zprávy je nezbytně nutný (pokud
	nehodláte vypustit celé tělo). Spojení obou částí může zmást
	některé nástroje, např. přeskládání.

	Další odstavce následují za prázdným řádkem.

	 - Můžete používat i odrážky.

	 - Jako odrážka se nejčastěji používá pomlčka nebo hvězdička, před ně se vkládá
	   jedna mezera, mezi body výčtu prázdný řádek, avšak úzus tu není jednotný.

Budou-li takto vypadat všechny vaše zprávy k revizím, usnadníte tím práci sobě i svým spolupracovníkům. Projekt Git obsahuje kvalitně naformátované zprávy k revizím. Mohu vám doporučit, abyste v něm zkusili zadat příkaz `git log --no-merges` a podívali se, jak vypadá pěkně naformátovaná historie revizí projektu.

Já v následujících příkladech stejně jako ve většině případů v této knize v rámci zestručnění neformátuji zprávy podle uvedených zásad, naopak používám parametr `-m` za příkazem `git commit`. Řiďte se, prosím, podle toho, co říkám, ne podle toho, co dělám.

## Malý soukromý tým

Nejjednodušší sestavou, s níž se pravděpodobně setkáte, je soukromý projekt, na němž kromě vás pracují ještě jeden nebo dva vývojáři. Soukromým projektem myslím uzavřený zdrojový kód – okolní svět k němu nemá oprávnění pro čtení. Vy a vaši ostatní vývojáři máte všichni oprávnění odesílat změny do repozitáře.

V takovém prostředí můžete uplatnit podobný pracovní postup, na jaký jste možná zvyklí ze systému Subversion nebo jiného centralizovaného systému. Se systémem Git ale budete stále ještě ve výhodě v takových ohledech, jako je zapisování revizí offline a podstatně snazší větvení a slučování. Pracovní postup však bude velmi podobný. Hlavním rozdílem je to, že slučování probíhá na straně klienta, ne během zapisování revize na straně serveru.
Podívejme se, jak to může vypadat, když dva vývojáři začnou spolupracovat na projektu se sdíleným repozitářem. První vývojář, John, naklonuje repozitář, provede změny a zapíše lokální revizi. (V následujících příkladech nahrazuji zprávy protokolů třemi tečkami, abych je trochu zkrátil.)

	# John's Machine
	$ git clone john@githost:simplegit.git
	Initialized empty Git repository in /home/john/simplegit/.git/
	...
	$ cd simplegit/
	$ vim lib/simplegit.rb
	$ git commit -am 'removed invalid default value'
	[master 738ee87] removed invalid default value
	 1 files changed, 1 insertions(+), 1 deletions(-)

Druhý vývojář, Jessica, učiní totéž – naklonuje repozitář a zapíše provedené změny:

	# Jessica's Machine
	$ git clone jessica@githost:simplegit.git
	Initialized empty Git repository in /home/jessica/simplegit/.git/
	...
	$ cd simplegit/
	$ vim TODO
	$ git commit -am 'add reset task'
	[master fbff5bc] add reset task
	 1 files changed, 1 insertions(+), 0 deletions(-)

Jessica nyní odešle svou práci na server:

	# Jessica's Machine
	$ git push origin master
	...
	To jessica@githost:simplegit.git
	   1edee6b..fbff5bc  master -> master

Také John se pokusí odeslat své změny na server:

	# John's Machine
	$ git push origin master
	To john@githost:simplegit.git
	 ! [rejected]        master -> master (non-fast forward)
	error: failed to push some refs to 'john@githost:simplegit.git'

John nyní nesmí odeslat revize, protože mezitím odeslala své změny Jessica. To je třeba si uvědomit, zejména pokud jste zvyklí na systém Subversion. Oba vývojáři totiž neupravovali stejný soubor. Přestože Subversion provádí takové sloučení na serveru automaticky, pokud byly upraveny různé soubory, v systému Git musíte provést sloučení lokálně. John musí vyzvednout změny, které provedla Jessica, a začlenit je do své práce, než ji bude moci odeslat:

	$ git fetch origin
	...
	From john@githost:simplegit
	 + 049d078...fbff5bc master     -> origin/master

V tomto okamžiku vypadá Johnův lokální repozitář jako na obrázku 5-4.


![](http://git-scm.com/figures/18333fig0504-tn.png)

Obrázek 5-4. Johnův výchozí repozitář

John má referenci ke změnám, které odeslala Jessica, ale než bude moci sám odeslat svá data, bude muset začlenit její práci:

	$ git merge origin/master
	Merge made by recursive.
	 TODO |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Sloučení probíhá hladce, Johnova historie revizí teď vypadá jako na obrázku 5-5.


![](http://git-scm.com/figures/18333fig0505-tn.png)

Obrázek 5-5. Johnův repozitář po začlenění větve origin/master

John nyní může otestovat svůj kód, aby se ujistil, že stále pracuje správně, a pak může odeslat svou novou sloučenou práci na server:

	$ git push origin master
	...
	To john@githost:simplegit.git
	   fbff5bc..72bbc59  master -> master

Johnova historie revizí bude nakonec vypadat jako na obrázku 5-6.


![](http://git-scm.com/figures/18333fig0506-tn.png)

Obrázek 5-6. Johnova historie po odeslání revize na server origin

Jessica mezitím pracovala na tematické větvi. Vytvořila tematickou větev s názvem `issue54` a zapsala do ní tři revize. Zatím ještě nevyzvedla Johnovy změny, a proto její historie revizí vypadá jako na obrázku 5-7.


![](http://git-scm.com/figures/18333fig0507-tn.png)

Obrázek 5-7. Výchozí historie revizí – Jessica

Jessica chce synchronizovat svou práci s Johnem, a proto vyzvedne jeho data:

	# Jessica's Machine
	$ git fetch origin
	...
	From jessica@githost:simplegit
	   fbff5bc..72bbc59  master     -> origin/master

Tím stáhne práci, kterou mezitím odeslal John. Historie revizí Jessicy teď vypadá jako na obrázku 5-8.


![](http://git-scm.com/figures/18333fig0508-tn.png)

Obrázek 5-8. Historie Jessicy po vyzvednutí Johnových změn

Jessica považuje svou tematickou větev za dokončenou, ale chce vědět, do čeho má svou práci začlenit, aby mohla změny odeslat. Spustí proto příkaz `git log`:

	$ git log --no-merges origin/master ^issue54
	commit 738ee872852dfaa9d6634e0dea7a324040193016
	Author: John Smith <jsmith@example.com>
	Date:   Fri May 29 16:01:27 2009 -0700

	    removed invalid default value

Jessica nyní může začlenit tematickou větev do své hlavní větve, tamtéž začlenit i Johnovu práci (`origin/master`) do své větve `master` a vše odeslat zpět na server. Nejprve se přepne zpět na svou hlavní větev, aby do ní mohla vše integrovat:

	$ git checkout master
	Switched to branch "master"
	Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

Jako první může začlenit buď větev `origin/master` nebo `issue54`. Obě směřují vpřed, a tak jejich pořadí nehraje žádnou roli. Konečný snímek bude stejný, ať zvolí jakékoli pořadí, mírně se bude lišit jen historie revizí. Jessica se rozhodne začlenit jako první větev `issue54`:

	$ git merge issue54
	Updating fbff5bc..4af4298
	Fast forward
	 README           |    1 +
	 lib/simplegit.rb |    6 +++++-
	 2 files changed, 6 insertions(+), 1 deletions(-)

Tento postup je bezproblémový. Jak vidíte, šlo o jednoduchý posun „rychle vpřed“. Nyní Jessica začlení Johnovu práci (`origin/master`):

	$ git merge origin/master
	Auto-merging lib/simplegit.rb
	Merge made by recursive.
	 lib/simplegit.rb |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

Začlenění proběhne čistě a historie Jessicy bude vypadat jako na obrázku 5-9.


![](http://git-scm.com/figures/18333fig0509-tn.png)

Obrázek 5-9. Historie Jessicy po začlenění Johnových změn

Větev `origin/master` teď má Jessica dostupnou ze své větve `master`, takže může svou práci úspěšně odeslat (za předpokladu, že John mezitím neodeslal další revize):

	$ git push origin master
	...
	To jessica@githost:simplegit.git
	   72bbc59..8059c15  master -> master

Všichni vývojáři zapsali několik revizí a úspěšně začlenili práci ostatních do své – viz obrázek 5-10.


![](http://git-scm.com/figures/18333fig0510-tn.png)

Obrázek 5-10. Historie Jessicy po odeslání všech změn zpět na server

Toto je jeden z nejjednodušších pracovních postupů. Po určitou dobu pracujete, obvykle na nějaké tematické větvi, a když je připravena k integraci, začleníte ji do hlavní větve. Chcete-li tuto práci sdílet, začleníte ji do své hlavní větve. Poté vyzvednete a začleníte větev `origin/master`, jestliže se změnila. Nakonec odešlete všechna data do větve `master` na serveru. Obecná posloupnost kroků je naznačena na obrázku 5-11.


![](http://git-scm.com/figures/18333fig0511-tn.png)

Obrázek 5-11. Obecná posloupnost kroků u jednoduchého pracovního postupu s více vývojáři v systému Git

## Soukromý řízený tým

V následujícím scénáři se podíváme na role přispěvatelů ve větší soukromé skupině. Naučíte se, jak pracovat v prostředí, v němž na jednotlivých úkolech spolupracují malé skupiny a tyto týmové příspěvky jsou poté integrovány druhou stranou.

Řekněme, že John a Jessica spolupracují na jednom úkolu a Jessica a Josie spolupracují na jiném. Společnost v tomto případě používá typ pracovního postupu s integračním manažerem, kdy práci jednotlivých skupin integrují pouze někteří technici a větev `master` hlavního repozitáře mohou aktualizovat pouze oni. V tomto scénáři se veškerá práce provádí ve větvích jednotlivých týmů a později je spojována zprostředkovateli integrace.

Sledujme pracovní postup Jessicy pracující na dvou úkolech a spolupracující v tomto prostředí paralelně s dvěma různými vývojáři. Protože už má naklonovaný repozitář, rozhodne se pracovat nejprve na úkolu A – `featureA`. Vytvoří si pro něj novou větev a udělá v ní určité penzum práce.

	# Jessica's Machine
	$ git checkout -b featureA
	Switched to a new branch "featureA"
	$ vim lib/simplegit.rb
	$ git commit -am 'add limit to log function'
	[featureA 3300904] add limit to log function
	 1 files changed, 1 insertions(+), 1 deletions(-)

V tomto okamžiku potřebuje sdílet svou práci s Johnem, a tak odešle revize své větve `featureA` na server. Jessica nemá oprávnění pro odesílání dat do větve `master` (ten mají pouze zprostředkovatelé integrace), a proto musí své revize odeslat do jiné větve, aby mohla s Johnem spolupracovat:

	$ git push origin featureA
	...
	To jessica@githost:simplegit.git
	 * [new branch]      featureA -> featureA

Jessica pošle Johnovi e-mail s informací, že odeslala svou práci do větve pojmenované `featureA` a že se na ni může podívat. Zatímco čeká na zpětnou vazbu od Johna, rozhodne se, že začne pracovat spolu s Josie na úkolu `featureB`. Začne tím, že založí novou větev, která bude založena na větvi `master` ze serveru:

	# Jessica's Machine
	$ git fetch origin
	$ git checkout -b featureB origin/master
	Switched to a new branch "featureB"

Jessica nyní vytvoří několik revizí ve větvi `featureB`:

	$ vim lib/simplegit.rb
	$ git commit -am 'made the ls-tree function recursive'
	[featureB e5b0fdc] made the ls-tree function recursive
	 1 files changed, 1 insertions(+), 1 deletions(-)
	$ vim lib/simplegit.rb
	$ git commit -am 'add ls-files'
	[featureB 8512791] add ls-files
	 1 files changed, 5 insertions(+), 0 deletions(-)

Repozitář Jessicy vypadá jako na obrázku 5-12.


![](http://git-scm.com/figures/18333fig0512-tn.png)

Obrázek 5-12. Výchozí historie revizí – Jessica

Jessica je připravena odeslat svou práci, ale dostane e-mail od Josie, že již na server odeslala větev `featureBee`, v níž už je část práce hotová. Než bude Jessica moci odeslat svou práci na server, bude do ní nejprve muset začlenit práci Josie. Změny, které Josie provedla, vyzvedne příkazem `git fetch`:

	$ git fetch origin
	...
	From jessica@githost:simplegit
	 * [new branch]      featureBee -> origin/featureBee

Nyní může Jessica začlenit tyto změny do své práce pomocí příkazu `git merge`:

	$ git merge origin/featureBee
	Auto-merging lib/simplegit.rb
	Merge made by recursive.
	 lib/simplegit.rb |    4 ++++
	 1 files changed, 4 insertions(+), 0 deletions(-)

Tady nastává určitý problém. Musí odeslat práci začleněnou ve své větvi `featureB` do větve `featureBee` na serveru. Může tak učinit příkazem `git push` s určením lokální větve, za níž bude následovat dvojtečka (:) a za ní vzdálená větev:

	$ git push origin featureB:featureBee
	...
	To jessica@githost:simplegit.git
	   fba9af8..cd685d1  featureB -> featureBee

Říká se tomu refspec. Více o vzorcích refspec systému Git a různých možnostech, k nimž je lze využít, najdete v kapitole 9.

Poté pošle John Jessice e-mail, že odeslal několik změn do větve `featureA`, a poprosí ji, aby je ověřila. Jessica spustí příkaz `git fetch`, jímž tyto změny stáhne.

	$ git fetch origin
	...
	From jessica@githost:simplegit
	   3300904..aad881d  featureA   -> origin/featureA

Poté si může příkazem `git log` prohlédnout, co všechno bylo změněno:

	$ git log origin/featureA ^featureA
	commit aad881d154acdaeb2b6b18ea0e827ed8a6d671e6
	Author: John Smith <jsmith@example.com>
	Date:   Fri May 29 19:57:33 2009 -0700

	    changed log output to 30 from 25

Nakonec začlení Johnovu práci do své vlastní větve `featureA`:

	$ git checkout featureA
	Switched to branch "featureA"
	$ git merge origin/featureA
	Updating 3300904..aad881d
	Fast forward
	 lib/simplegit.rb |   10 +++++++++-
	1 files changed, 9 insertions(+), 1 deletions(-)

Jessica by ráda něco vylepšila, a proto vytvoří novou revizi a odešle ji zpět na server:

	$ git commit -am 'small tweak'
	[featureA 774b3ed] small tweak
	 1 files changed, 1 insertions(+), 1 deletions(-)
	$ git push origin featureA
	...
	To jessica@githost:simplegit.git
	   3300904..774b3ed  featureA -> featureA

Historie revizí Jessicy bude nyní vypadat jako na obrázku 5-13.


![](http://git-scm.com/figures/18333fig0513-tn.png)

Obrázek 5-13. Historie Jessicy po zapsání revizí do větve s úkolem

Jessica, Josie a John pošlou zprávu zprostředkovatelům integrace, že větve `featureA` a `featureBee` jsou na serveru připraveny k integraci do hlavní linie. Poté, co budou tyto větve do hlavní linie integrovány, vyzvednutím dat bude možné stáhnout nové revize vzniklé začleněním změn a historie revizí bude vypadat jako na obrázku 5-14.


![](http://git-scm.com/figures/18333fig0514-tn.png)

Obrázek 5-14. Historie Jessicy po začlenění obou jejích tematických větví

Mnoho skupin přechází na systém Git právě kvůli této možnosti paralelní spolupráce několika týmů a následného slučování různých linií práce. Možnost, aby několik menších podskupin jednoho týmu spolupracovalo prostřednictvím vzdálených větví a aby si práce nevyžádala účast celého týmu nebo nebránila ostatním v jiné práci, je velkou devízou systému Git. Posloupnost kroků vypadá v případě pracovního postupu, který jsme si právě ukázali, jako na obrázku 5-15.


![](http://git-scm.com/figures/18333fig0515-tn.png)

Obrázek 5-15. Základní posloupnost kroků u pracovního postupu v řízeném týmu

## Malý veřejný projekt

Přispívání do veřejných projektů se poněkud liší. Protože nemáte oprávnění aktualizovat větve projektu přímo, musíte svou práci doručit správcům jinak. První příklad popisuje, jak se přispívá s využitím rozštěpení na hostitelských serverech Git, které podporují snadné štěpení. Jak server repo.or.cz, tak místa pro hostování podporují štěpení a mnoho správců projektů tento styl přispívání vyžaduje. Další část se pak zabývá projekty, u nichž je upřednostňováno doručování záplat e-mailem.

Nejprve patrně bude nutné, abyste naklonovali hlavní repozitář, vytvořili tematickou větev pro záplatu nebo sérii záplat, které hodláte vytvořit, a udělali v nich zamýšlenou práci. Posloupnost příkazů bude tedy následující:

	$ git clone (url)
	$ cd project
	$ git checkout -b featureA
	$ (work)
	$ git commit
	$ (work)
	$ git commit

Možná budete chtít využít příkaz `rebase -i` a zkomprimovat svou práci do jediné revize nebo přeorganizovat práci v revizích tak, aby byla kontrola záplaty pro správce jednodušší – další informace o interaktivním přeskládání najdete v kapitole 6.

Až budete s prací ve větvi hotovi a budete ji chtít poslat zpět správcům, přejděte na původní stránku projektu a klikněte na tlačítko „Fork“, jímž vytvoříte vlastní odštěpenou větev projektu, do níž budete moci zapisovat. Poté bude třeba, abyste tuto novou adresu URL repozitáře přidali jako druhý vzdálený repozitář, v tomto případě pojmenovaný `myfork`:

	$ git remote add myfork (url)

Do něj teď musíte odeslat svou práci. Lepším řešením bude odeslat vzdálenou větev, na níž pracujete, do svého repozitáře, než ji začlenit do hlavní větve a tu pak celou odeslat. Důvod je prostý: pokud nebude vaše práce přijata nebo bude převzata částečně, nebudete muset vracet změny začleněné do vaší hlavní větve. Pokud správci začlení či přeskládají vaši práci (nebo její část), získáte ji zpět stažením z repozitáře:

	$ git push myfork featureA

Až svou práci odešlete do odštěpené větve, budete na ni muset upozornit správce. Tomu se říká „žádost o natažení“ (angl. pull request). Můžete ji vygenerovat buď na webové stránce – server GitHub má tlačítko „pull request“, které automaticky odešle správci upozornění – nebo můžete zadat příkaz `git request-pull` a jeho výstup e-mailem ručně odeslat správci projektu.

Příkaz `request-pull` vezme základní větev (základnu), do níž chcete natáhnout svou tematickou větev, a adresu URL repozitáře Git, z nějž chcete práci natáhnout, a vytvoří shrnutí všech změn, které by měl správce podle vaší žádosti natáhnout. Pokud chce například Jessica poslat Johnovi žádost o natažení a vytvořila předtím dvě revize v tematické větvi, kterou právě odeslala, může zadat tento příkaz:

	$ git request-pull origin/master myfork
	The following changes since commit 1edee6b1d61823a2de3b09c160d7080b8d1b3a40:
	  John Smith (1):
	        added a new function

	are available in the git repository at:

	  git://githost/simplegit.git featureA

	Jessica Smith (2):
	      add limit to log function
	      change log output to 30 from 25

	 lib/simplegit.rb |   10 +++++++++-
	 1 files changed, 9 insertions(+), 1 deletions(-)

Výstup příkazu lze odeslat správci. Sdělí mu, odkud daná větev pochází, podá mu přehled o revizích a řekne mu, odkud lze práci stáhnout.

U projektů, u nichž nejste v roli správce, je většinou jednodušší, aby vaše větev `master` stále sledovala větev `origin/master` a abyste práci prováděli v tematických větvích, jichž se můžete beze všeho vzdát v případě, že budou odmítnuty. Jednotlivé úkoly izolované v tematických větvích mají také tu výhodu, že snáze přeskládáte svou práci, jestliže se průběžně posouvá konec hlavního repozitáře a vaše revize už nelze aplikovat čistě. Pokud například chcete do projektu přispět druhým tématem, nerozvíjejte svou práci v tematické větvi, kterou jste právě odeslali. Začněte znovu od začátku z větve `master` hlavního repozitáře:

	$ git checkout -b featureB origin/master
	$ (work)
	$ git commit
	$ git push myfork featureB
	$ (email maintainer)
	$ git fetch origin

Nyní mají obě vaše témata samostatný zásobník – podobně jako řada záplat – které můžete přepsat, přeskládat a upravit, aniž by se tím obě témata navzájem ovlivňovala nebo omezovala (viz obrázek 5-16).


![](http://git-scm.com/figures/18333fig0516-tn.png)

Obrázek 5-16. Výchozí historie revizí s větví featureB

Řekněme, že správce projektu natáhl do projektu několik jiných záplat a nyní vyzkoušel vaši první větev, jenže tu už nelze čistě začlenit. V takovém případě můžete zkusit přeskládat tuto větev na vrcholu větve `origin/master`, vyřešit za správce vzniklé konflikty a poté své změny ještě jednou odeslat:

	$ git checkout featureA
	$ git rebase origin/master
	$ git push -f myfork featureA

Tím přepíšete svou historii, která teď bude vypadat jako na obrázku 5-17.


![](http://git-scm.com/figures/18333fig0517-tn.png)

Obrázek 5-17. Historie revizí s větví featureA

Protože jste větev přeskládali, musíte k příkazu git push přidat parametr `-f`, abyste mohli větev `featureA` na serveru nahradit revizí, která není jejím potomkem. Druhou možností je odeslat tuto novou práci do jiné větve na serveru (nazvané např. `featureAv2`).

Podívejme se ještě na jeden pravděpodobnější scénář: Správce se podíval na práci ve vaší druhé větvi, váš koncept se mu líbí, ale rád by, abyste změnili jeden implementační detail. Vy tuto příležitost využijete zároveň k tomu, abyste práci přesunuli tak, aby byla založena na aktuálním stavu projektu ve větvi `master`. Začnete vytvořením nové větve z aktuální větve `origin/master`, zkomprimujete do ní změny z větve `featureB`, vyřešíte všechny konflikty, provedete změnu v implementaci a to vše odešlete jako novou větev:

	$ git checkout -b featureBv2 origin/master
	$ git merge --no-commit --squash featureB
	$ (change implementation)
	$ git commit
	$ git push myfork featureBv2

Parametr `--squash` (komprimovat) vezme všechnu vaši práci v začleněné větvi a zkomprimuje ji do jedné revize, která nevznikla jako výsledek sloučení a leží na vrcholu větve, na níž se právě nacházíte. Parametr `--no-commit` říká systému Git, aby revizi automaticky nezaznamenával. To vám umožní provést všechny změny z jiné větve a poté udělat více změn, než zaznamenáte novou revizi.

Nyní můžete správci oznámit, že jste provedli požadované změny a že je najde ve vaší větvi `featureBv2` (viz obrázek 5-18).


![](http://git-scm.com/figures/18333fig0518-tn.png)

Obrázek 5-18. Historie revizí s větví featureBv2

## Velký veřejný projekt

Mnoho větších projektů si vytvořilo vlastní, odlišné procedury k doručování záplat. U každého projektu se tak budete muset informovat o konkrétních pravidlech. U mnoha větších veřejných projektů se však záplaty doručují na základě poštovní konference vývojářů, a proto se teď zaměřím na tento případ.

Pracovní postup je podobný jako v předchozím případě. Pro každou sérii záplat, na níž pracujete, vytvoříte samostatnou tematickou větev. Liší se to, jak je budete doručovat do projektu. Místo toho, abyste rozštěpili projekt a odeslali své změny do vlastní zapisovatelné verze, vygenerujete e-mailovou verzi každé série revizí a pošlete je e-mailem do poštovní konference vývojářů:

	$ git checkout -b topicA
	$ (work)
	$ git commit
	$ (work)
	$ git commit

Nyní máte dvě revize, které chcete odeslat do poštovní konference. Pro vygenerování emailových zpráv ve formátu mbox použijte příkaz `git format-patch`. Každá revize se přetransformuje na e-mailovou zprávu, jejíž předmět bude tvořit první řádek zprávy k revizi a tělo e-mailu bude tvořeno zbytkem zprávy a samotnou záplatou. Výhodou tohoto postupu je, že aplikace záplaty z e-mailu, který byl vygenerován příkazem `format-patch`, v pořádku uchová všechny informace o revizi. Podrobněji si to ukážeme v následující části, až budeme aplikovat tyto revize:

	$ git format-patch -M origin/master
	0001-add-limit-to-log-function.patch
	0002-changed-log-output-to-30-from-25.patch

Příkaz `format-patch` vypíše názvy souborů záplaty, kterou vytváří. Přepínač `-M` řekne systému Git, aby zkontroloval případné přejmenování. Soubory nakonec vypadají takto:

	$ cat 0001-add-limit-to-log-function.patch
	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] add limit to log function

	Limit log functionality to the first 20

	---
	 lib/simplegit.rb |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index 76f47bc..f9815f1 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -14,7 +14,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log #{treeish}")
	+    command("git log -n 20 #{treeish}")
	   end

	   def ls_tree(treeish = 'master')
	--
	1.6.2.rc1.20.g8c5b.dirty

Tyto soubory záplaty můžete také upravit a přidat k nim další informace určené pro seznam příjemců e-mailu, u nichž nechcete, aby byly obsaženy ve zprávě k revizi. Přidáte-li text mezi řádek `---` a začátek záplaty (řádek `lib/simplegit.rb`), vývojářům se zobrazí, ale aplikace záplaty ho obsahovat nebude.

Chcete-li e-mail odeslat do poštovní konference, můžete soubor buď vložit do svého e-mailového programu, nebo ho odeslat pomocí příkazového řádku. Vložení textu může často způsobovat problémy s formátováním, zvlášť v případě některých „chytřejších“ klientů, kteří správně nezachovávají nové řádky a jiné prázdné znaky. Git naštěstí nabízí nástroj, který vám pomůže odeslat správně formátované patche pomocí protokolu IMAP. Já budu dokumentovat odeslání záplaty na příkladu Gmailu, který používám jako svého e-mailového agenta. Podrobné instrukce pro celou řadu poštovních programů najdete na konci již dříve zmíněného souboru `Documentation/SubmittingPatches` ve zdrojovém kódu systému Git.

Nejprve je třeba nastavit sekci „imap“ v souboru `~/.gitconfig`. Každou hodnotu můžete nastavit zvlášť pomocí série příkazů `git config` nebo můžete vložit hodnoty ručně. Na konci by ale měl váš soubor config vypadat přibližně takto:

	[imap]
	  folder = "[Gmail]/Drafts"
	  host = imaps://imap.gmail.com
	  user = user@gmail.com
	  pass = p4ssw0rd
	  port = 993
	  sslverify = false

Pokud váš server IMAP nepoužívá SSL, dva poslední řádky zřejmě nebudou vůbec třeba a hodnota hostitele bude `imap://`, a nikoli `imaps://`.
Až toto nastavení dokončíte, můžete použít příkaz `git send-email`, jímž umístíte sérii patchů do složky Koncepty (Drafts) zadaného serveru IMAP:

	$ git send-email *.patch
	0001-added-limit-to-log-function.patch
	0002-changed-log-output-to-30-from-25.patch
	Who should the emails appear to be from? [Jessica Smith <jessica@example.com>]
	Emails will be sent from: Jessica Smith <jessica@example.com>
	Who should the emails be sent to? jessica@example.com
	Message-ID to be used as In-Reply-To for the first email? y

Git poté vytvoří log s určitými informacemi, který bude pro každou záplatu, kterou posíláte, vypadat asi takto:

	(mbox) Adding cc: Jessica Smith <jessica@example.com> from
	  \line 'From: Jessica Smith <jessica@example.com>'
	OK. Log says:
	Sendmail: /usr/sbin/sendmail -i jessica@example.com
	From: Jessica Smith <jessica@example.com>
	To: jessica@example.com
	Subject: [PATCH 1/2] added limit to log function
	Date: Sat, 30 May 2009 13:29:15 -0700
	Message-Id: <1243715356-61726-1-git-send-email-jessica@example.com>
	X-Mailer: git-send-email 1.6.2.rc1.20.g8c5b.dirty
	In-Reply-To: <y>
	References: <y>

	Result: OK

V tomto okamžiku můžete přejít do své složky Koncepty, změnit pole Komu na adresáty z poštovní konference, jimž chcete záplatu odeslat, případně přidat kopii na správce nebo osobu odpovědnou za tuto část a e-mail odeslat.

## Shrnutí

V této části jsme popsali několik obvyklých pracovních postupů při přispívání do velmi odlišných typů projektů Git, s nimiž se můžete setkat. Představili jsme k nim také nové nástroje, které vám mohou v těchto procesech pomoci. V další části se na projekty podíváme z té druhé strany – ukážeme, jak může vypadat jejich správa. Dozvíte se, jak být benevolentním diktátorem nebo integračním manažerem.
