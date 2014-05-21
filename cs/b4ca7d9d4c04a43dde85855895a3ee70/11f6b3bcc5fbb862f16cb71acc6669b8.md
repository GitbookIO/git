# Objekty Git

Git je obsahově adresovatelný systém souborů. Výborně. A co to znamená?
Znamená to, že v jádru systému Git se nachází jednoduché úložiště dat, ke kterému lze přistupovat pomocí klíčů. Můžete do něj vložit jakýkoli obsah a na oplátku dostanete klíč, který můžete kdykoli v budoucnu použít k vyzvednutí obsahu. Můžete tak použít například nízkoúrovňový příkaz `hash-object`, který vezme určitá data, uloží je v adresáři `.git` a dá vám klíč, pod nímž jsou tato data uložena. Vytvořme nejprve nový repozitář Git. Můžeme se přesvědčit, že je adresář `objects` prázdný:

	$ mkdir test
	$ cd test
	$ git init
	Initialized empty Git repository in /tmp/test/.git/
	$ find .git/objects
	.git/objects
	.git/objects/info
	.git/objects/pack
	$ find .git/objects -type f
	$

Git inicializoval adresář `objects` a vytvořil v něm podadresáře `pack` a `info`, nenajdeme tu však žádné skutečné soubory. Nyní můžete uložit kousek textu do databáze Git:

	$ echo 'test content' | git hash-object -w --stdin
	d670460b4b4aece5915caf5c68d12f560a9fe3e4

Parametr `-w` sděluje příkazu `hash-object`, aby objekt uložil. Bez parametru by vám příkaz jen sdělil, jaký klíč by byl přidělen. Parametr `--stdin` zase příkazu sděluje, aby načetl obsah ze standardního vstupu. Pokud byste parametr nezadali, příkaz `hash-object` by očekával, že zadáte cestu k souboru. Výstupem příkazu je 40znakový otisk kontrolního součtu (checksum hash). Jedná se o otisk SHA-1 – kontrolní součet spojení ukládaného obsahu a záhlaví, o němž si povíme za okamžik. Nyní se můžete podívat, jak Git vaše data uložil:

	$ find .git/objects -type f
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Vidíte, že v adresáři `objects` přibyl nový soubor. Takto Git ukládá nejprve veškerý obsah – jeden soubor pro každý kus obsahu, nazvaný kontrolním součtem SHA-1 obsahu a záhlaví. Podadresář je pojmenován prvními dvěma znaky SHA, název souboru zbývajícími 38 znaky.

Obsah můžete ze systému Git zase vytáhnout, k tomu slouží příkaz `cat-file`. Tento příkaz je něco jako švýcarský nůž k prohlížení objektů Git. Přidáte-li k příkazu `cat-file` parametr `-p`, říkáte mu, aby zjistil typ obsahu a přehledně vám ho zobrazil:

	$ git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4
	test content

Nyní tedy umíte vložit do systému Git určitý obsah a ten poté zase vytáhnout. Totéž můžete udělat také s obsahem v souborech. Na souboru můžete například provádět jednoduché verzování. Vytvořte nový soubor a uložte jeho obsah do své databáze:

	$ echo 'version 1' > test.txt
	$ git hash-object -w test.txt
	83baae61804e65cc73a7201a7252750c76066a30

Poté do souboru zapište nový obsah a znovu ho uložte:

	$ echo 'version 2' > test.txt
	$ git hash-object -w test.txt
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a

Vaše databáze obsahuje dvě nové verze souboru a počáteční obsah, který jste do ní vložili:

	$ find .git/objects -type f
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Soubor nyní můžete vrátit do první verze:

	$ git cat-file -p 83baae61804e65cc73a7201a7252750c76066a30 > test.txt
	$ cat test.txt
	version 1

Nebo do druhé verze:

	$ git cat-file -p 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a > test.txt
	$ cat test.txt
	version 2

Pamatovat si klíč SHA-1 každé verze souboru ale není praktické, navíc v systému neukládáte název souboru, pouze jeho obsah. Tento typ objektu se nazývá blob. Zadáte-li příkaz `cat-file -t` v kombinaci s klíčem SHA-1 objektu, Git vám sdělí jeho typ, ať se jedná o jakýkoli objekt Git.

	$ git cat-file -t 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
	blob

## Objekty stromu

Dalším typem objektu, na který se podíváme, je objekt stromu (tree object), jenž řeší problém ukládání názvu souboru a zároveň umožňuje uložit skupinu souborů dohromady. Git ukládá obsah podobným způsobem jako systém souborů UNIX, jen trochu jednodušeji. Veškerý obsah se ukládá v podobě blobů a objektů stromu. Stromy odpovídají položkám v adresáři UNIX a bloby víceméně odpovídají inodům neboli obsahům souborů. Jeden objekt stromu obsahuje jednu nebo více položek stromu, z nichž každá obsahuje ukazatel SHA-1 na blob nebo podstrom s asociovaným režimem, typem a názvem souboru. Nejnovější strom v projektu „simplegit“ může vypadat například takto:

	$ git cat-file -p master^{tree}
	100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
	100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
	040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib

Syntaxe `master^{tree}` určuje objekt stromu, na nějž ukazuje poslední revize větve `master`. Všimněte si, že podadresář `lib` není blob, ale ukazatel na jiný strom:

	$ git cat-file -p 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0
	100644 blob 47c6340d6459e05787f644c2447d2595f5d3a54b      simplegit.rb

Data, která Git ukládá, vypadají v principu jako na obrázku 9-1.


![](http://git-scm.com/figures/18333fig0901-tn.png)

Obrázek 9-1. Zjednodušený model dat v systému Git

Můžete si vytvořit i vlastní strom. Git běžně vytváří strom tak, že vezme stav oblasti připravených změn nebo-li indexu a zapíše z nich objekt stromu. Proto chcete-li vytvořit objekt stromu, musíte ze všeho nejdříve připravit soubory k zapsání, a vytvořit tak index. Chcete-li vytvořit index s jediným záznamem – první verzí souboru text.txt – můžete k tomu použít nízkoúrovňový příkaz `update-index`. Tento příkaz lze použít, jestliže chcete uměle přidat starší verzi souboru test.txt do nové oblasti připravených změn. K příkazu je třeba zadat parametr `--add`, neboť tento soubor ve vaší oblasti připravených změn ještě neexistuje (dokonce ještě nemáte ani vytvořenou oblast připravených změn), a parametr `--cacheinfo`, protože soubor, který přidáváte, není ve vašem adresáři, je ale ve vaší databázi. K tomu všemu přidáte režim, SHA-1 a název souboru:

	$ git update-index --add --cacheinfo 100644 \
	  83baae61804e65cc73a7201a7252750c76066a30 test.txt

V tomto případě jste zadali režim `100644`, který znamená, že se jedná o běžný soubor. Dalšími možnostmi režimu jsou `100755`, který označuje spustitelný soubor, a `120000`, který znamená symbolický odkaz. Režim (mode) je převzat z normálních režimů UNIX, jen je podstatně méně flexibilní. Tyto tři režimy jsou jediné platné pro soubory (bloby) v systému Git (ačkoli se pro adresáře a submoduly používají ještě další režimy).

Nyní můžete použít příkaz `write-tree`, jímž zapíšete stav oblasti připravovaných změn neboli indexu do objektu stromu. Tentokrát se obejdete bez parametru `-w`. Příkaz `write-tree` automaticky vytvoří objekt stromu ze stavu indexu, pokud tento strom ještě neexistuje:

	$ git write-tree
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	$ git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	100644 blob 83baae61804e65cc73a7201a7252750c76066a30      test.txt

Můžete si také ověřit, že jde skutečně o objekt stromu:

	$ git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	tree

Nyní vytvoříte nový strom s druhou verzí souboru test.txt a jedním novým souborem (new.txt):

	$ echo 'new file' > new.txt
	$ git update-index test.txt
	$ git update-index --add new.txt

V oblasti připravených změn nyní máte jak novou verzi souboru test.txt, tak nový soubor new.txt. Uložte tento strom (zaznamenáním stavu oblasti připravených změn neboli indexu do objektu stromu) a prohlédněte si výsledek:

	$ git write-tree
	0155eb4229851634a0f03eb265b69f5a2d56f341
	$ git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Všimněte si, že tento strom má oba záznamy souborů a že hodnota SHA souboru test.txt je SHA původní „verze 2“ (`1f7a7a`). Jen pro zábavu nyní můžete přidat první strom jako podadresář do tohoto stromu. Stromy můžete do oblasti připravených změn načíst příkazem `read-tree`. V tomto případě můžete načíst existující strom jako podstrom do oblasti připravených změn pomocí parametru `--prefix`, který zadáte k příkazu `read-tree`:

	$ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	$ git write-tree
	3c4e9cd789d88d8d89c1073707c3585e41b0e614
	$ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
	040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Pokud byste vytvořili pracovní adresář z nového stromu, který jste právě zapsali, dostali byste dva soubory na nejvyšší úrovni pracovního adresáře a podadresář `bak`, obsahující první verzi souboru test.txt. Data, která Git pro tyto struktury obsahuje, si můžete představit jako ilustraci na obrázku 9-2.


![](http://git-scm.com/figures/18333fig0902-tn.png)

Obrázek 9-2. Struktura obsahu vašich současných dat Git

## Objekty revize

Máte vytvořeny tři stromy označující různé snímky vašeho projektu, jež chcete sledovat. Původního problému jsme se však stále nezbavili: musíte si pamatovat všechny tři hodnoty SHA-1, abyste mohli snímky znovu vyvolat. Nemáte také žádné informace o tom, kdo snímky uložil, kdy byly uloženy a proč se tak stalo. Toto jsou základní informace, které obsahuje objekt revize.

Pro vytvoření objektu revize zavolejte příkaz `commit-tree` a zadejte jeden SHA-1 stromu a eventuální objekty revize, které mu bezprostředně předcházely. Začněte prvním stromem, který jste zapsali:

	$ echo 'first commit' | git commit-tree d8329f
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d

Nyní se můžete podívat na nově vytvořený objekt revize. Použijte příkaz `cat-file`:

	$ git cat-file -p fdf4fc3
	tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
	author Scott Chacon <schacon@gmail.com> 1243040974 -0700
	committer Scott Chacon <schacon@gmail.com> 1243040974 -0700

	first commit

Formát objektu revize je prostý. Udává strom nejvyšší úrovně pro snímek projektu v tomto místě; informace o autorovi řešení/autorovi změny revize získané z konfiguračního nastavení `user.name` a `user.email`, spolu s aktuálním časovým údajem; poté následuje prázdný řádek a za ním zpráva k revizi.

Dále zapíšete i zbylé dva objekty revize. Oba budou odkazovat na revizi, která jim bezprostředně předcházela:

	$ echo 'second commit' | git commit-tree 0155eb -p fdf4fc3
	cac0cab538b970a37ea1e769cbbde608743bc96d
	$ echo 'third commit'  | git commit-tree 3c4e9c -p cac0cab
	1a410efbd13591db07496601ebc7a059dd55cfe9

Všechny tři tyto objekty revizí ukazují na jeden ze tří stromů snímku, který jste vytvořili. Může se to zdát zvláštní, ale nyní máte vytvořenu skutečnou historii revizí Git, kterou lze zobrazit příkazem `git log` spuštěným pro hodnotu SHA-1 poslední revize:

	$ git log --stat 1a410e
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	    third commit

	 bak/test.txt |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

	commit cac0cab538b970a37ea1e769cbbde608743bc96d
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:14:29 2009 -0700

	    second commit

	 new.txt  |    1 +
	 test.txt |    2 +-
	 2 files changed, 2 insertions(+), 1 deletions(-)

	commit fdf4fc3344e67ab068f836878b6c4951e3b15f3d
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:09:34 2009 -0700

	    first commit

	 test.txt |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Úžasné! Právě jste vytvořili historii Git jen na základě nízkoúrovňových operací, bez použití front-endů. To je v podstatě také to, co se odehrává, když zadáte příkazy jako `git add` nebo `git commit` – Git uloží bloby souborů, které byly změněny, akutalizuje index, uloží stromy a zapíše objekty revize, které referencí odkazují na stromy nejvyšší úrovně a revize, které jim bezprostředně předcházely. Tyto tři základní objekty Git – bloby, stromy a revize – jsou nejprve uloženy jako samostatné soubory do adresáře `.git/objects`. Toto jsou všechny objekty v ukázkovém adresáři spolu s komentářem k tomu co obsahují:

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Pokud byste hledali vztahy mezi všemi interními ukazateli, vyšel by vám celý diagram objektů – viz obrázek 9-3.


![](http://git-scm.com/figures/18333fig0903-tn.png)

Obrázek 9-3. Všechny objekty v adresáři Git

## Ukládání objektů

Už jsem zmínil, že se spolu s obsahem ukládá také záhlaví (header). Zaměřme se teď chvíli na to, jak Git ukládá své objekty. Uvidíte, jak lze uložit objekt blobu – v našem případě řetězec „what is up, doc?“ – interaktivně v skriptovacím jazyce Ruby. Interaktivní režim Ruby spustíte příkazem `irb`:

	$ irb
	>> content = "what is up, doc?"
	=> "what is up, doc?"

Git vytvoří záhlaví, které bude začínat typem objektu, jímž je v našem případě blob. Poté vloží mezeru, za níž bude následovat velikost obsahu a na konec nulový byte:

	>> header = "blob #{content.length}\0"
	=> "blob 16\000"

Git vytvoří řetězec ze záhlaví a původního obsahu a vypočítá kontrolní součet SHA-1 tohoto nového obsahu. V Ruby můžete hodnotu SHA-1 daného řetězce spočítat tak, že příkazem `require` připojíte knihovnu pro počítání SHA1 a zavoláte `Digest::SHA1.hexdigest()` s daným řetězcem:

	>> store = header + content
	=> "blob 16\000what is up, doc?"
	>> require 'digest/sha1'
	=> true
	>> sha1 = Digest::SHA1.hexdigest(store)
	=> "bd9dbf5aae1a3862dd1526723246b20206e5fc37"

Git zkomprimuje nový obsah metodou zlib, která je obsažena v knihovně zlib. Nejprve je třeba vyžádat si knihovnu a poté na obsah spustit příkaz `Zlib::Deflate.deflate()`:

	>> require 'zlib'
	=> true
	>> zlib_content = Zlib::Deflate.deflate(store)
	=> "x\234K\312\311OR04c(\317H,Q\310,V(-\320QH\311O\266\a\000_\034\a\235"

Na závěr zapíšete obsah zkomprimovaný metodou zlib do objektu na disku. Musíte tu určit cestu k objektu, který chcete zapsat (první dva znaky hodnoty SHA-1 budou název podadresáře, zbývajících 38 znaků bude tvořit název souboru v tomto adresáři). Pokud podadresář neexistuje, můžete ho v jazyce Ruby vytvořit pomocí funkce `FileUtils.mkdir_p()`. Poté zadejte `File.open()` pro otevření souboru a voláním `write()` na vzniklý identifikátor souboru zapište do souboru právě zkomprimovaný (zlib) obsah:

	>> path = '.git/objects/' + sha1[0,2] + '/' + sha1[2,38]
	=> ".git/objects/bd/9dbf5aae1a3862dd1526723246b20206e5fc37"
	>> require 'fileutils'
	=> true
	>> FileUtils.mkdir_p(File.dirname(path))
	=> ".git/objects/bd"
	>> File.open(path, 'w') { |f| f.write zlib_content }
	=> 32

A je hotovo. Právě jste vytvořili platný objekt blobu Git. Všechny objekty Git se ukládají stejným způsobem, jen s odlišným typem. Místo řetězce blob bude záhlaví začínat řetězcem „commit“ (u revize) nebo „tree“ (u stromu). A navíc, zatímco obsahem blobu může být téměř cokoliv, obsah revize nebo stromu má velmi specifický formát.
