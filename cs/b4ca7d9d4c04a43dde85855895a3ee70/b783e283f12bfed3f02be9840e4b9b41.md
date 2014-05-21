# Balíčkové soubory

Vraťme se zpět do databáze objektů vašeho testovacího repozitáře Git. V současné chvíli máte 11 objektů: 4 bloby, 3 stromy, 3 revize a 1 značku.

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git komprimuje obsah těchto souborů metodou zlib a uložená data tak nejsou příliš velká. Všechny tyto soubory zabírají dohromady pouhých 925 bytů. Do repozitáře tak nyní přidáme větší objem dat, na němž si budeme moci ukázat jednu zajímavou funkci systému Git. Z knihovny Grit, s níž jsme pracovali před časem, přidejte soubor „repo.rb“. Je to soubor se zdrojovým kódem o velikosti asi 12 kB:

	$ curl https://raw.github.com/mojombo/grit/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb
	$ git commit -m 'added repo.rb'
	[master 484a592] added repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

Pokud se podíváte na výsledný strom, uvidíte hodnotu SHA-1, kterou soubor repo.rb dostal pro objekt blobu:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Pomocí příkazu git cat-file zjistíte aktuální velikost objektu:

	$ du -b .git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	4102	.git/objects/9b/c1dc421dcd51b4ac296e3e5b6e2a99cf44391e

Nyní soubor trochu upravíme a uvidíme, co se stane:

	$ echo '# testing' >> repo.rb
	$ git commit -am 'modified repo a bit'
	[master ab1afef] modified repo a bit
	 1 files changed, 1 insertions(+), 0 deletions(-)

Prohlédněte si strom vytvořený touto revizí a uvidíte jednu zajímavou věc:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Nyní jde o úplně jiný blob. Přestože jste na konec 400řádkového souboru vložili jen jeden jediný řádek, Git uložil nový obsah jako úplně nový objekt:

	$ du -b .git/objects/05/408d195263d853f09dca71d55116663690c27c
	4109	.git/objects/05/408d195263d853f09dca71d55116663690c27c

Na disku teď máte dva téměř identické 12kB objekty. Nebylo by krásné, kdyby Git mohl uložit jeden z nich v plné velikosti, ale druhý už jen jako rozdíl mezi oběma těmito objekty?

A podívejme, ono to jde. Prvotní formát, v němž Git ukládá objekty na disku, se nazývá volný formát objektů (loose object format). Při vhodných příležitostech však Git sbalí několik těchto objektů do jediného binárního souboru, jemuž se říká „balíčkový“ (packfile). Tento soubor šetří místo na disku a zvyšuje výkon. Git k tomuto kroku přistoupí, pokud máte příliš mnoho volných objektů, pokud ručně spustíte příkaz `git gc` nebo jestliže odesíláte revize na vzdálený server. Chcete-li vidět, jak proces probíhá, můžete systému Git ručně zadat, aby objekty zabalil. Zadejte příkaz `git gc`:

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

Podíváte-li se do adresáře s objekty, zjistíte, že většina objektů zmizela. Zato se objevily dva nové:

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

Objekty, které zůstaly, jsou bloby, na něž neukazuje žádná revize, v našem případě bloby z příkladů „what is up, doc?“ a „test content“, které jsme vytvořili před časem. Jelikož jste je nikdy nevložili do žádné z revizí, Git je považuje za volné a nezabalil je do nového balíčkového souboru.

Ostatní soubory jsou v novém balíčkovém souboru a indexu. Balíčkový soubor je jediný soubor, v němž je zabalen obsah všech objektů odstraněných ze systému souborů. Index je soubor, který obsahuje ofsety do tohoto balíčkového souboru, díky nimž lze rychle vyhledat konkrétní objekt. Hlavní předností balíčkového souboru je jeho velikost. Přestože objekty na disku zabíraly před spuštěním příkazu `gc` celkem asi 12 kB, nový soubor má pouze 6 kB. Zabalením objektů jste zredukovali nároky na místo na polovinu.

Jak to Git dělá? Při balení objektů vyhledá Git soubory, které mají podobný název a podobnou velikost, a uloží pouze rozdíly mezi jednotlivými verzemi souboru. Do balíčkového souboru můžete ostatně nahlédnout a přesvědčit se, čím Git ušetřil místo. Nízkoúrovňový příkaz `git verify-pack` umožňuje prohlížet, co bylo zabaleno:

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

Blob `9bc1d`, který, jak si možná vzpomínáte, byl první verzí souboru repo.rb, odkazuje na blob `05408`, který byl druhou verzí tohoto souboru. Třetí sloupec výpisu udává velikost objektu v balíčku. Můžete si tak všimnout, že blob `05408` zabírá 12 kB z celkové velikosti souboru, zatímco blob `9bc1d` pouze 7 bytů. Za povšimnutí dále stojí, že byla v plné velikosti ponechána druhá verze souboru, původní verze byla uložena ve formě rozdílů. Je to z toho důvodu, že rychlejší přístup budete pravděpodobně potřebovat spíš k aktuálnější verzi souboru.

Na celém balíčku je navíc příjemné, že ho můžete kdykoli znovu zabalit do nové podoby. Git čas od času „přebalí“ celou vaši databázi automaticky a pokusí se tím ušetřit další místo. Totéž lze kdykoli provést i ručně spuštěním příkazu `git gc`.
