# Správa a obnova dat

Občas budete patrně nuceni přistoupit k menšímu úklidu – uvést repozitář do kompaktnější podoby, vyčistit importovaný repozitář nebo obnovit ztracenou práci. Tato část se na některé z těchto scénářů zaměří.

## Správa

Git čas od času automaticky spustí příkaz „auto gc“. Ve většině případů neprovede tento příkaz vůbec nic. Pokud však identifikuje příliš mnoho volných objektů (objektů nezabalených do balíčkového souboru) nebo balíčkových souborů, spustí Git plnou verzi příkazu `git gc`. Písmena `gc` jsou zkratkou anglického výrazu „garbage collect“ (sběr odpadků). Příkaz provádí hned několik věcí: sbírá všechny volné objekty a umisťuje je do balíčkových souborů, spojuje balíčkové soubory do jednoho velkého a odstraňuje objekty, jež nejsou dostupné z žádné revize a jsou starší několika měsíců.

Příkaz auto gc můžete spustit také ručně:

	$ git gc --auto

I tentokrát platí, že příkaz většinou neprovede nic. Aby Git spustil skutečný příkaz gc, musíte mít kolem 7000 volných objektů nebo více než 50 balíčkových souborů. Tyto hodnoty můžete změnit podle svých potřeb v konfiguračním nastavení `gc.auto` a `gc.autopacklimit`.

Další operací, kterou `gc` provede, je zabalení referencí do jediného souboru. Řekněme, že váš repozitář obsahuje tyto větve a značky:

	$ find .git/refs -type f
	.git/refs/heads/experiment
	.git/refs/heads/master
	.git/refs/tags/v1.0
	.git/refs/tags/v1.1

Spustíte-li příkaz `git gc`, tyto soubory z adresáře `refs` zmizí. Git je pro zvýšení účinnosti přesune do souboru `.git/packed-refs`, jenž má následující podobu:

	$ cat .git/packed-refs
	# pack-refs with: peeled
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
	ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
	9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
	^1a410efbd13591db07496601ebc7a059dd55cfe9

Pokud některou referenci aktualizujete, Git nebude tento soubor upravovat, ale zapíše nový soubor do adresáře `refs/heads`. Je-li třeba získat hodnotu SHA pro konkrétní referenci, Git se tuto referenci pokusí vyhledat nejprve v adresáři `refs` a poté, jako záložní možnost, v souboru `packed-refs`. Pokud však nemůžete najít některou z referencí v adresáři `refs`, bude patrně v souboru `packed-refs`.

Všimněte si také posledního řádku souboru, který začíná znakem `^`. Tento řádek znamená, že značka bezprostředně nad ním je anotovaná a tento řádek je revize, na niž tato anotovaná značka ukazuje.

## Obnova dat

Někdy se může stát, že nedopatřením přijdete o revizi Git. Většinou k tomu dochází tak, že násilím smažete větev, která uchovávala část vaší práce, a vy po čase zjistíte, že byste tuto větev přece jen potřebovali. Stejně tak jste mohli provést tvrdý reset větve a tím zavrhnout revize, z nichž nyní něco potřebujete. Pokud se už něco takového stane, jak dostanete své revize zpět?

Uvedeme příklad, při němž resetujeme hlavní větev v testovacím repozitáři na jednu ze starších revizí a poté ztracené revize obnovíme. Nejprve se podíváme, kde se váš repozitář v současnosti nachází:

	$ git log --pretty=oneline
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Nyní vrátíme větev `master` zpět na prostřední revizi:

	$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
	HEAD is now at 1a410ef third commit
	$ git log --pretty=oneline
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Účinně jsme se zbavili horních dvou revizí. Neexistuje žádná větev, z níž by byly tyto revize dostupné. Budete muset najít hodnotu SHA nejnovější revize a přidat větev, která na ni bude ukazovat. Problém tedy spočívá v určení hodnoty SHA nejnovější revize, protože nepředpokládáme, že si ji pamatujete.

Nejrychlejší cestou často bývá použít nástroj `git reflog`. Git během vaší práce v tichosti zaznamenává, kde se nachází ukazatel HEAD (pokaždé, když se změní jeho pozice). Vždy když zapíšete revizi nebo změníte větve, je reflog aktualizován. Reflog se také aktualizuje s každým spuštěním příkazu `git update-ref` – o důvod víc používat tento příkaz a nezapisovat hodnotu SHA přímo do souborů referencí, jak už jsme uváděli v části „Reference Git“ v této kapitole. Spuštěním příkazu `git reflog` zjistíte, kde jste se nacházeli v libovolném okamžiku:

	$ git reflog
	1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
	ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Vidíme tu obě revize, jichž jsme se zbavili, ale není tu k nim mnoho informací. Chcete-li zobrazit stejné informace v užitečnějším formátu, můžete spustit příkaz `git log -g`, jímž získáte normální výstup příkazu log pro reflog.

	$ git log -g
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:22:37 2009 -0700

	    third commit

	commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	     modified repo a bit

Zdá se, že revize úplně dole je hledanou ztracenou revizí. Můžete ji obnovit tak, že na ní vytvoříte novou větev. Na revizi můžete vytvořit například větev `recover-branch` (ab1afef):

	$ git branch recover-branch ab1afef
	$ git log --pretty=oneline recover-branch
	ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
	484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Výborně, nyní máte větev s názvem `recover-branch`, která se nachází na bývalé pozici větve `master`. První dvě revize jsou opět dostupné.
Můžeme ale také uvažovat situaci, že ztracené revize nebyly ve výpisu reflog k nalezení. Tento stav můžeme simulovat tak, že odstraníme větev `recover-branch` a smažeme reflog. První dvě revize tak nejsou odnikud dostupné:

	$ git branch -D recover-branch
	$ rm -Rf .git/logs/

Protože se data pro reflog uchovávají v adresáři `.git/logs/`, nemáte evidentně žádný reflog. Jak lze tedy v tuto chvíli ztracenou revizi obnovit? Jednou z možností je použít nástroj `git fsck`, který zkontroluje integritu vaší databáze. Pokud příkaz spustíte s parametrem `--full`, zobrazí vám všechny objekty, na něž neukazuje žádný jiný objekt:

	$ git fsck --full
	dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
	dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
	dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

V tomto případě je vaše ztracená revize uvedena výrazem „dangling commit“. Nyní ji můžete obnovit stejným způsobem: přidejte novou větev, která bude ukazovat na její SHA.

## Odstraňování objektů

Systém Git nabízí velké množství úžasných funkcí a možností. Je však jedna věc, která vám může způsobovat problém. Je jí fakt, že příkaz `git clone` stáhne vždy celou historii projektu, všechny verze všech souborů.

To je v pořádku, je-li projektem zdrojový kód, neboť Git je vysoce optimalizován ke kompresi těchto dat. Pokud však někdo v kterémkoli místě historie projektu přidal jeden obrovský soubor, bude se stahovat při každém dalším klonování repozitáře. Nic na tom nezmění, ani pokud tento velký soubor hned v příští revizi z projektu odstraníte. Protože se nachází v historii, stále bude součástí všech klonů. To může způsobovat velké problémy, pokud konvertujete repozitáře Subversion nebo Perforce do systému Git. Protože v těchto systémech nestahujete celou historii, nebývá s vkládáním velkých souborů problém. Pokud provedete import do systému Git z jiného systému nebo jiným způsobem, zjistíte, že je váš repozitář výrazně větší, než by měl být. Nabízím návod, jak vyhledat a odstranit velké objekty.

Dejte však pozor, tento postup může být pro vaši historii revizí katastrofický. Přepíše všechny objekty revizí směrem dolů od nejstaršího stromu, který musíte pro odstranění reference na velký soubor upravit. Pokud po této metodě sáhnete hned po importu, než mohl kdokoli založit na revizi svou práci, nemusíte se ničeho obávat. V opačném případě budete muset upozornit všechny přispěvatele, že musí přeskládat svou práci na vaše nové revize.

Vyzkoušíme to na situaci, kdy do svého testovacího repozitáře vložíte velký soubor, v následující revizi ho odstraníte, vyhledáte ho a trvale ho z repozitáře odstraníte. Nejprve do historie přidejte velký objekt:

	$ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
	$ git add git.tbz2
	$ git commit -am 'added git tarball'
	[master 6df7640] added git tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 create mode 100644 git.tbz2

Ale ne! Vlastně jste nechtěli do projektu vložit tak velký tarball. Raději se ho zbavme:

	$ git rm git.tbz2
	rm 'git.tbz2'
	$ git commit -m 'oops - removed large tarball'
	[master da3f30d] oops - removed large tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 delete mode 100644 git.tbz2

Teď provedete `gc` své databáze, protože chcete zjistit, kolik místa je obsazeno:

	$ git gc
	Counting objects: 21, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (16/16), done.
	Writing objects: 100% (21/21), done.
	Total 21 (delta 3), reused 15 (delta 1)

Chcete-li rychle zjistit, kolik místa je obsazeno, můžete použít příkaz `count-objects`:

	$ git count-objects -v
	count: 4
	size: 16
	in-pack: 21
	packs: 1
	size-pack: 2016
	prune-packable: 0
	garbage: 0

Řádek `size-pack` uvádí velikost vašich balíčkových souborů v kilobytech, využity jsou tedy 2 MB. Před zapsáním poslední revize jste využívali přibližně 2 kB. Je tedy jasné, že odstranění souboru z předchozí revize ho neodstranilo z historie. Pokaždé, když bude někdo tento repozitář klonovat, bude muset pro získání malinkého projektu naklonovat celé 2 MB jen proto, že jste jednou omylem přidali velký soubor. Proto ho raději odstraníme.

Nejprve ho budete muset najít. V tomto případě víte, o jaký soubor se jedná. Můžeme ale předpokládat, že to nevíte. Jak se dá zjistit, který soubor nebo soubory zabírají tolik místa? Spustíte-li příkaz `git gc`, všechny objekty jsou v balíčkovém souboru. Velké objekty lze identifikovat spuštěním jiného nízkoúrovňového příkazu, `git verify-pack`, a seřazením podle třetího pole ve výpisu, v němž je uvedena velikost souboru. Na výpis můžete rovněž použít příkaz `tail`, neboť vás beztak zajímá pouze několik posledních (největších) souborů:

	$ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
	7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

Hledaný velký objekt se nachází úplně dole: 2 MB. Chcete-li zjistit, o jaký soubor se jedná, můžete použít příkaz `rev-list`, který jsme používali už v kapitole 7. Zadáte-li k příkazu `rev-list` parametr `--objects`, výpis bude obsahovat všechny hodnoty SHA revizí a blobů s cestami k souborům, které jsou s nimi asociovány. Tuto kombinaci můžete použít k nalezení názvu hledaného blobu:

	$ git rev-list --objects --all | grep 7a9eb2fb
	7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Nyní potřebujete odstranit tento soubor ze všech minulých stromů. Pomocí snadného příkazu lze zjistit, jaké revize tento soubor změnil:

	$ git log --pretty=oneline --branches -- git.tbz2
	da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
	6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Chcete-li tento soubor kompletně odstranit z historie Git, budete muset přepsat všechny revize od `6df76` směrem dolů. Použijte k tomu příkaz `filter-branch`, s nímž jsme se seznámili v kapitole 6:

	$ git filter-branch --index-filter \
	   'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
	Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
	Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
	Ref 'refs/heads/master' was rewritten

Parametr `--index-filter` je podobný parametru `--tree-filter`, který jsme používali v kapitole 6, jen s tím rozdílem, že příkazem nezměníte soubory načtené na disku, ale oblast připravených změn nebo-li index. Nepomůže odstranit konkrétní soubor příkazem `rm file` nebo podobným. Odstraňte ho raději příkazem `git rm --cached` – soubor musíte odstranit z indexu, ne z disku. Důvodem je rychlost. Git nemusí před spuštěním filtru provádět checkout každé jednotlivé revize na disk a celý proces je tak mnohem, mnohem rychlejší. Pokud chcete, můžete provést stejný úkon i pomocí parametru `--tree-filter`. Zadáte-li k příkazu `git rm` parametr `--ignore-unmatch`, nařídíte systému Git, aby nepovažoval za chybu, jestliže nenajde vzor, který se snažíte odstranit. A konečně požádáte příkaz `filter-branch`, aby přepsal historii až od revize `6df7640` dále, neboť víte, že tady problém začíná. Bez této konkretizace začne proces od začátku a bude trvat zbytečně dlouho.

Vaše historie už neobsahuje referenci na problémový soubor. Obsahuje ho však stále ještě reflog a v adresáři `.git/refs/original` také nová sada referencí, které Git přidal při spuštění příkazu `filter-branch`. Budete je proto muset odstranit a databázi znovu zabalit. Před novým zabalením je třeba odstranit vše, co na tyto staré revize ukazuje:

	$ rm -Rf .git/refs/original
	$ rm -Rf .git/logs/
	$ git gc
	Counting objects: 19, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (19/19), done.
	Total 19 (delta 3), reused 16 (delta 1)

Podívejme se, kolik místa jste ušetřili.

	$ git count-objects -v
	count: 8
	size: 2040
	in-pack: 19
	packs: 1
	size-pack: 7
	prune-packable: 0
	garbage: 0

Velikost zabaleného repozitáře byla zredukována na 7 kB, což je jistě lepší než 2 MB. Podle hodnoty velikosti je vidět, že se velký objekt stále ještě nachází mezi volnými objekty, a nebyl tedy odstraněn. Nebude ale součástí přenášených dat při odesílání nebo následném klonování, což je pro nás rozhodující. Pokud jste chtěli, mohli jste objekt zcela odstranit příkazem `git prune --expire`.
