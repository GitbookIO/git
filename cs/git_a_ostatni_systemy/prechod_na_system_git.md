# Přechod na systém Git

Máte-li existující základ kódu v jiném systému VCS, ale rádi byste začali používat Git, můžete do něj svůj projekt převést. Existuje přitom několik způsobů. V této části se seznámíte s několika importéry pro běžné systémy, které jsou součástí systému Git, a poté ukážeme, jak si můžete vytvořit importér vlastní.

## Import

Nyní se naučíte, jak importovat data ze dvou větších, profesionálně používaných systémů SCM – Subversion a Perforce. Oba tyto systémy jsem zvolil proto, že podle mých informací přechází na Git nejvíce uživatelů právě z nich, a také proto, že Git obsahuje vysoce kvalitní nástroje právě pro oba tyto systémy.

## Subversion

Pokud jste si přečetli předchozí část o používání nástrojů `git svn`, můžete získané informace použít. Příkazem `git svn clone` naklonujte repozitář, odešlete ho na nový server Git a začněte používat ten. Server Subversion můžete úplně přestat používat. Chcete-li získat historii projektu, dostanete ji tak rychle, jak jen dovedete stáhnout data ze serveru Subversion (což ovšem může chvíli trvat).

Takový import však není úplně dokonalý a vzhledem k tomu, jak dlouho může trvat, nabízí se ještě jiná cesta. Prvním problémem jsou informace o autorovi. V Subversion má každá osoba zapisující revize v systému přiděleného uživatele, který je u zaznamenán informací o revizi. V předchozí části se u některých příkladů (výstupy příkazů `blame` nebo `git svn log`) objevilo jméno `schacon`. Jestliže vyžadujete podrobnější informace ve stylu systému Git, budete potřebovat mapování z uživatelů Subversion na autory Git. Vytvořte soubor `users.txt`, který bude toto mapování obsahovat v následující podobě:

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

Chcete-li získat seznam jmen autorů používaných v SVN, spusťte tento příkaz:

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

Vytvoříte tím log ve formátu XML. Můžete v něm vyhledávat autory, vytvořit si vlastní seznam a XML zase vyjmout. (Tento příkaz pochopitelně funguje pouze na počítačích, v nichž je nainstalován `grep`, `sort` a `perl`.) Poté tento výstup přesměrujte do souboru users.txt, abyste mohli vedle každého záznamu přidat stejná data o uživatelích Git.

Tento soubor můžete dát k dispozici nástroji `git svn`, aby mohl přesněji zmapovat informace o autorech. Nástroji `git svn` můžete také zadat, aby ignoroval metadata, která systém Subversion normálně importuje: zadejte parametr `--no-metadata` k příkazu `clone` nebo `init`. Váš příkaz `import` pak bude mít tuto podobu:

	$ git-svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

Import ze systému Subversion v adresáři `my_project` by měl nyní vypadat o něco lépe. Revize už nebudou mít tuto podobu:

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029
they look like this:

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

Nejenže teď pole Author vypadá podstatně lépe, ale navíc jste se zbavili i záznamu `git-svn-id`.

Po importu bude nutné data trochu vyčistit. Zaprvé je nutné vyčistit nejasné reference, které vytvořil příkaz `git svn`. Nejprve přesunete značky tak, aby se z nich staly skutečné značky, a ne podivné vzdálené větve. V dalším kroku přesunete zbytek větví a uděláte z nich větve lokální.

Abyste značky upravili na korektní gitové značky, spusťte

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

Tím se reference, které označovaly vzdálené větve a začínaly `tag/`, převedou na skutečné (prosté) značky.

Ze zbytku referencí vytvořte v repozitáři `refs/remotes` lokální větve:

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

Všechny staré větve jsou nyní skutečnými větvemi Git a všechny staré značky jsou nyní skutečnými značkami Git. Poslední věcí, která ještě zbývá, je přidat nový server Git jako vzdálený repozitář a odeslat do něj revize. Tady je příklad, jak můžete váš server přidat jako vzdálený:

	$ git remote add origin git@my-git-server:myrepository.git

Protože do něj chcete odeslat všechny své větve a značky, můžete použít příkaz:

	$ git push origin --all
	$ git push origin --tags

Na novém serveru Git tak nyní máte v úhledném, čistém importu uloženy všechny větve a značky.

## Perforce

Dalším systémem, z nějž budeme importovat, bude Perforce. Také importér Perforce je distribuován se systémem Git. Pokud máte verzi Git starší než 1.7.11, pak importér naleznete jen v sekci `contrib` zdrojového kódu.  V takovém případě budete muset získat zdrojový text systému Git, který můžete stáhnout ze serveru git.kernel.org:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

V adresáři `fast-import` byste měli najít spustitelný skript napsaný v jazyce Python pojmenovaný `git-p4`. Aby vám import fungoval, musíte mít v počítači nainstalován Python a nástroj `p4`. Budete chtít například importovat projekt Jam z veřejného úložiště Perforce Public Depot. K nastavení svého klienta budete muset exportovat proměnnou prostředí P4PORT, která bude ukazovat na depot Perforce:

	$ export P4PORT=public.perforce.com:1666

Spusťte příkaz `git-p4 clone`, jímž importujete projekt Jam ze serveru Perforce. K příkazu zadejte depot a cestu k projektu, kromě toho také cestu, kam chcete projekt importovat:

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

Přejdete-li do adresáře `/opt/p4import` a spustíte příkaz `git log`, uvidíte, co jste importovali:

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

V každé revizi si můžete všimnout identifikátoru `git-p4`. Je dobré ponechat tu identifikátor pro případ, že budete někdy v budoucnu potřebovat odkázat na číslo změny Perforce. Pokud ale chcete identifikátor přesto odstranit, teď, dokud jste nezačali pracovat na novém repozitáři, je ta správná chvíle. K odstranění všech řetězců identifikátoru najednou můžete použít příkaz `git filter-branch`:

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

Spustíte-li příkaz `git log`, uvidíte, že se změnily všechny kontrolní součty revizí SHA-1, zato všechny řetězce `git-p4` ze zpráv k revizím zmizely:

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

Váš import je připraven k odeslání na nový server Git.

## Vlastní importér

Není-li vaším současným systémem ani Subversion, ani Perforce, zkuste vyhledat importér online. Kvalitní importéry se dají najít pro CVS, Clear Case, Visual Source Safe, dokonce i adresář s archivy. Pokud vám nefunguje ani jeden z těchto nástrojů, používáte méně častý nástroj nebo potřebujete speciální proces importu ještě z jiného důvodu, použijte `git fast-import`. Tento příkaz načítá ze vstupů stdin jednoduché instrukce k zapsáni specifických dat systému Git. Je podstatně jednodušší vytvořit objekty Git tímto způsobem než spouštět syrové příkazy Git či se pokoušet zapsat syrové objekty (podrobnější informace v kapitole 9). Tímto způsobem lze vytvořit importovací skript, který bude načítat potřebné informace ze systému, z nějž import provádíte, a vypíše jasné instrukce do výstupu stdout. Tento program můžete spustit a jeho výstup nechat zpracovat příkazem `git fast-import`.

Jako rychlou ukázku napíšeme jednoduchý importér. Řekněme, že pracujete na projektu, který příležitostně zálohujete zkopírováním pracovního adresáře do zálohového, datem označeného adresáře `back_YYYY_MM_DD`, a ten chcete nyní importovat do systému Git. Váš adresář má tuto strukturu:

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

Chcete-li importovat adresář Git, budeme se muset podívat na to, jak Git ukládá svá data. Jak si možná vzpomínáte, říkali jsme, že Git je v podstatě seznam odkazů na objekty revizí, které ukazují na určitý snímek obsahu. Jediné, co tedy musíte udělat, je sdělit příkazu `fast-import`, co je obsahem snímků, jaká data revizí na ně ukazují a pořadí, v němž budou převzaty. Vaše strategie tedy bude spočívat v tom, že postupně projdete jednotlivé snímky a vytvoříte revize s obsahem každého adresáře, přičemž každá revize bude odkazovat na revizi předchozí.

Stejně jako v části „Příklad systémem Git kontrolovaných standardů“ v kapitole 7 použijeme i tentokrát Ruby, s nímž většinou pracuji a který je srozumitelný. Tento příklad můžete ale beze všeho napsat v čemkoli, co vám vyhovuje. Jedinou podmínkou je, aby byly potřebné informace zapsány do výstupu stdout.

Na začátku přejdete do cílového adresáře a identifikujete všechny podadresáře, z nichž bude každý představovat jeden snímek, který chcete importovat jako revizi. Přejdete do každého podadresáře a zadáte příkazy potřebné k jeho exportu. Základní smyčka bude mít tuto podobu:

	last_mark = nil

	# loop through the directories
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # move into the target directory
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

V každém adresáři spustíte soubor `print_export`, který vezme manifest a známku předchozího snímku a poskytne manifest a označovač tohoto snímku. Tímto způsobem je lze řádně spojit. „Označovač“ (angl. mark) je termín používaný v souvislosti s metodou `fast-import`. Jedná se o identifikátor, který jednoznačně přiřadíte revizi a lze ho použít k odkazování na tuto revizi z revizí ostatních. Prvním krokem, který tak při metodě se souborem `print_export` uděláte, bude vygenerování označovače na základě názvu adresáře:

	mark = convert_dir_to_mark(dir)

Provedete to tak, že vytvoříte skupinu adresářů a jako označovač použijete hodnotu indexu, neboť označovač musí být celé číslo. Celý postup vypadá takto:

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

Nyní jste označili revizi celým číslem a zbývá stanovit datum pro metadata revize. Protože je datum obsaženo v názvu adresáře, lze ho vyčíst odtud. Dalším řádkem v souboru `print_export` bude

	date = convert_dir_to_date(dir)

kde `convert_dir_to_date` je definováno jako:

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

Tím dostanete celé číslo pro data každého adresáře. Posledními metadaty, jež budete pro všechny revize potřebovat, jsou informace o autorovi revize, které zadáte v globální proměnné:

	$author = 'Scott Chacon <schacon@example.com>'

Nyní je už vše připraveno k vygenerování dat revizí pro váš importér. Úvodní informace sděluje, že definujete objekt revize a na jaké větvi se nachází. Následuje vygenerovaný označovač, informace o autorovi revize a zpráva k revizi, po ní následuje eventuální předchozí revize. Kód má tuto podobu:

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

Časové pásmo definujete napevno (--0700), protože je to jednoduché. Pokud importujete z jiného systému, musíte zadat časové pásmo jako posun.
Zpráva k revizi musí být ve speciálním formátu:

	data (size)\n(contents)

Tento formát tedy obsahuje slovo data, velikost načítaných dat (size), nový řádek a konečně data samotná (contents). Protože budete stejný formát potřebovat i později, k určení obsahu souboru vytvoříte pomocnou metodu – `export_data`:

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

Teď už zbývá jen určit obsah souborů všech snímků. To bude snadné, protože máte všechny v jednom adresáři. Zadejte příkaz `deleteall` a k němu přidejte obsah každého souboru v adresáři. Git pak odpovídajícím způsobem nahraje všechny snímky:

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

Poznámka: Vzhledem k tomu, že mnoho systémů chápe revize jako změny od jednoho zapsání k druhému, přijímá fast-import také příkazy s každým zapsáním a zjišťuje, které soubory byly přidány, odstraněny nebo změněny a co je jejich novým obsahem. Mohli byste také vypočítat rozdíly mezi snímky a poskytnout pouze tato data. To je však o něco složitější. Stejně tak můžete systému Git zadat všechna data a přenechat výpočet na něm. Pokud je pro vaše data tato metoda vhodnější, odkážeme vás na manuálovou stránku `fast-import`, kde najdete podrobnosti o tom, jak zadat data tímto způsobem.

Formát pro výpis obsahu nového souboru nebo určení změněného souboru s novým obsahem je následující:

	M 644 inline path/to/file
	data (size)
	(file contents)

644 je v tomto případě režim (jde-li o spustitelné soubory, budete je muset vyhledat a zadat režim 755) a výraz inline říká, že obsah uvedete bezprostředně po tomto řádku. Metoda `inline_data` má tuto podobu:

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

Znovu tu využijete metodu `export_data`, kterou jste aplikovali před chvílí. Jedná se totiž o stejný způsob, jakým jste specifikovali data zprávy k revizi.

Poslední věcí, kterou musíte udělat, je vrátit aktuální označovač, aby mohl být zadán do příští iterace:

	return mark

Poznámka: Pokud používáte Windows, budete muset provést jeden krok navíc. Jak už jsem se zmínil, Windows používají nahrazují znak konce řádku posloupností CRLF, zatímco git fast-import očekává pouze LF. Abychom tento problém obešli a aby si git fast-import nestěžoval, musíte ruby říct, aby místo LF používal CRLF:

	$stdout.binmode

A to je celé. Spustíte-li tento skript, získáte obsah v následující podobě:

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

Pro spuštění importéru přesměrujte tento výstup do příkazu `git fast-import`. Příkaz spouštějte v adresáři Gitu, do nějž chcete data importovat. Můžete vytvořit nový adresář a spustit v něm příkaz `git init`, jímž si vytvoříte nový výchozí bod. Poté spusťte svůj skript:

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

Proběhne-li proces úspěšně, podá vám obsáhlou statistiku o tom, co bylo provedeno. V tomto případě jsme importovali celkem 18 objektů 5 revizí do 1 větve. Nyní si můžete nechat příkazem `git log` zobrazit svoji novou historii:

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

A máme to tu — krásný, čistý repozitář Git. Měli bychom také dodat, že nejsou načtena žádná data, zatím neproběhl checkout žádných souborů do pracovního adresáře. Chcete-li je získat, musíte vaši větev resetovat do místa, kde se nyní nachází větev `master`:

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

Nástroj `fast-import` vám nabízí ještě spoustu dalších možností – nastavení různých režimů, práci s binárními daty, manipulaci s několika větvemi a jejich slučování, značky, ukazatele postupu atd. Několik příkladů složitějších scénářů si můžete prohlédnout v adresáři `contrib/fast-import` ve zdrojovém kódu Git. Jedním z těch nejlepších je už zmíněný skript`git-p4`.
