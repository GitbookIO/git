# Atributy Git

Některá z těchto nastavení lze také provést pouze pro určité umístění, a Git je tak aplikuje pouze na jeden podadresář nebo skupinu souborů. Tomuto nastavení konkrétního umístění se říká atributy Git. Nastavují se buď v souboru `.gitattributes` v jednom z vašich adresářů (většinou kořenový adresář vašeho projektu), nebo v souboru `.git/info/attributes`, pokud nechcete, aby byl soubor s atributy zapsán spolu s projektem.

Pomocí atributů lze například určit odlišnou strategii slučování pro konkrétní soubory nebo adresáře projektu, zadat systému Git nástroj diff pro netextové soubory nebo jak filtrovat obsah před načtením dat do systému Git nebo jejich odesláním. V této části se podíváme na některé atributy, jež můžete pro různá umístění v projektu Git nastavit, a uvedeme pár příkladů, jak lze tuto funkci využít v praxi.

## Binární soubory

Jedním ze skvělých triků, který vás možná přesvědčí o užitečnosti atributů, je označení souborů jako binárních (v případech, kdy je Git není schopen identifikovat sám) a zadání speciálních instrukcí, jak s těmito soubory nakládat. Některé textové soubory mohou být například vygenerovány strojově a nelze na ně aplikovat nástroj diff, zatímco na jiné binární soubory lze. Ukážeme si, jak systému Git sdělit, které jsou které.

### Identifikace binárních souborů

Některé soubory se tváří jako textové, ale v podstatě je s nimi třeba zacházet jako s binárními daty. Například projekty Xcode v systémech Mac obsahují soubory končící na `.pbxproj`, což je v podstatě sada dat JSON (datový formát prostého textu javascript) zapsaná na disk nástrojem IDE, který zaznamenává vaše nastavení atd. Ačkoli se technicky jedná o textový soubor, který je celý tvořen znaky ASCII, nechcete s ním nakládat jako s textovým souborem, protože se ve skutečnosti jedná o neohrabanou databázi. Pokud ji dva lidé změní, její obsah nemůžete sloučit a většinou nepochodíte ani s nástroji diff. Soubor je určen ke strojovému zpracování. Z těchto důvodů s ním budete chtít zacházet jako s binárním souborem.

Chcete-li systému Git zadat, aby nakládal se všemi soubory `pbxproj` jako s binárními daty, vložte do souboru `.gitattributes` následující řádek:

	*.pbxproj -crlf -diff

Až v projektu spustíte příkaz git show nebo git diff, Git se nebude pokoušet konvertovat nebo opravovat chyby CRLF ani vypočítat ani zobrazit rozdíly v tomto souboru pomocí nástroje diff. V systému Git verze 1.6 můžete také použít existující makro s významem `-crlf -diff`:

	*.pbxproj binary

### Nástroj diff pro binární soubory

Ve verzi 1.6 systému Git můžete použít funkci atributů Git k efektivnímu zpracování binárních souborů nástrojem diff. Systému Git přitom sdělíte, jak má konvertovat binární data do textového formátu, který lze zpracovávat běžným nástrojem diff.

### Soubory MS Word

Protože se jedná o opravdu šikovnou a nepříliš známou funkci, uvedu několik příkladů. Tuto metodu budete využívat především k řešení jednoho z nejpalčivějších problémů, s nímž se lidstvo potýká: verzování dokumentů Word. Je všeobecně známo, že Word je nejpříšejnější editor na světě, přesto ho však – bůhví proč – všichni používají. Chcete-li verzovat dokumenty Word, můžete je uložit do repozitáře Git a všechny hned zapsat do revize. K čemu to však bude? Spustíte-li příkaz `git diff` normálně, zobrazí se zhruba toto:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index 88839c4..4afcb7c 100644
	Binary files a/chapter1.doc and b/chapter1.doc differ

Srovnávat dvě verze přímo nelze, můžete je tak nanejvýš otevřít a ručně je projít, že? Nezapomínejme však na atributy Git, v této situaci vám odvedou nanahraditelnou službu. Do souboru `.gitattributes` vložte následující řádek:

	*.doc diff=word

Systému Git tím sdělíte, že pro všechny soubory, které odpovídají této masce (.doc), by měl být při zobrazení rozdílů použít filter word. Co je to filtr „word“? To budete muset nastavit. V našem případě nastavíme Git tak, aby ke konverzi dokumentů Word do čitelných textových souborů, způsobilých ke zpracování nástrojem diff, používal program `strings`:

	$ git config diff.word.textconv strings

Tento příkaz do vašeho `.git/config` přidá sekci, která vypadá následovně:

	[diff "word"]
		textconv = strings

Okrajová poznámka: Existují různé druhy `.doc` souborů. Některé používají kódování UTF-16 nebo jiné kódové stránky a `strings` v nich nic rozumného nenajde. Záleží na okolnostech.

Git nyní ví, že až se bude pokoušet vypočítat rozdíl mezi dvěma snímky a jeden ze souborů bude končit na `.doc`, má tyto soubory spustit přes filtr word, který je definován jako program `strings`. Než se Git pokusí porovnat soubory Word nástrojem diff, efektivně vytvoří hezké textové verze souborů.

Uveďme malý příklad. Kapitolu 1 této knihy jsem vložil do systému Git, do jednoho odstavce jsem přidal kousek textu a dokument jsem uložil. Poté jsem spustil příkaz `git diff`, abych se podíval, co se změnilo:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index c1c8a0a..b93c9e4 100644
	--- a/chapter1.doc
	+++ b/chapter1.doc
	@@ -8,7 +8,8 @@ re going to cover Version Control Systems (VCS) and Git basics
	 re going to cover how to get it and set it up for the first time if you don
	 t already have it on your system.
	 In Chapter Two we will go over basic Git usage - how to use Git for the 80%
	-s going on, modify stuff and contribute changes. If the book spontaneously
	+s going on, modify stuff and contribute changes. If the book spontaneously
	+Let's see if this works.

Git mi stroze, ale pravdivě sděluje, že jsem přidal řetězec „Let’s see if this works“. Není to sice dokonalé – na konci je přidáno několik náhodných znaků – ale evidentně to funguje. Pokud se vám podaří najít či vytvořit dobře fungující převaděč dokumentů Word na prostý text, bude toto řešení bezpochyby velmi účinné. Program `strings` je však k dispozici ve většině systémů Mac i Linux, a tak možná nejprve vyzkoušejte tento program s různými binárními formáty.

#### OpenDocument Text files

Stejný postup, který jsme použili pro soubory MS Word (`*.doc`), můžeme použít i pro soubory ve formátu OpenDocument Text (`*.odt`), kter vytváří OpenOffice.org.

Do souboru `.gitattributes` přidejte následující řádek:

	*.odt diff=odt

A teď v `.git/config` nastavte diff filtr pro `odt`:

	[diff "odt"]
		binary = true
		textconv = /usr/local/bin/odt-to-txt

OpenDocument soubory jsou ve skutečnosti zazipované adresáře, které obsahují více souborů (obsah ve formátu XML, styly, obrázky atd.). Potřebujeme napsat skript, který by extrahoval obsah a vrátil jej jako prostý text. Vytvořte soubor `/usr/local/bin/odt-to-txt` (můžete jej umístit i do jiného adresáře) s následujícím obsahem:

	#! /usr/bin/env perl
	# Simplistic OpenDocument Text (.odt) to plain text converter.
	# Author: Philipp Kempgen

	if (! defined($ARGV[0])) {
		print STDERR "No filename given!\n";
		print STDERR "Usage: $0 filename\n";
		exit 1;
	}

	my $content = '';
	open my $fh, '-|', 'unzip', '-qq', '-p', $ARGV[0], 'content.xml' or die $!;
	{
		local $/ = undef;  # slurp mode
		$content = <$fh>;
	}
	close $fh;
	$_ = $content;
	s/<text:span\b[^>]*>//g;           # remove spans
	s/<text:h\b[^>]*>/\n\n*****  /g;   # headers
	s/<text:list-item\b[^>]*>\s*<text:p\b[^>]*>/\n    --  /g;  # list items
	s/<text:list\b[^>]*>/\n\n/g;       # lists
	s/<text:p\b[^>]*>/\n  /g;          # paragraphs
	s/<[^>]+>//g;                      # remove all XML tags
	s/\n{2,}/\n\n/g;                   # remove multiple blank lines
	s/\A\n+//;                         # remove leading blank lines
	print "\n", $_, "\n\n";

Učiňte jej spustitelným:

	chmod +x /usr/local/bin/odt-to-txt

Teď už bude `git diff` schopen říci, co se v `.odt` souborech změnilo.


### Soubory s obrázky

Dalším zajímavým problémem, který lze tímto způsobem řešit, je výpočet rozdílů u obrázkových souborů. Jedním způsobem, jak to udělat, je spustit soubory JPEG přes filtr, který extrahuje jejich informace EXIF – metadata, která se zaznamenávají s většinou obrázkových souborů. Pokud stáhnete a nainstalujete program `exiftool`, můžete ho použít ke konverzi obrázků na text prostřednictvím metadat, a nástroj diff vám tak přinejmenším zobrazí textovou verzi všech provedených změn.

	$ echo '*.png diff=exif' >> .gitattributes
	$ git config diff.exif.textconv exiftool

Pokud nahradíte některý z obrázků ve svém projektu a spustíte příkaz `git diff`, zobrazí se asi toto:

	diff --git a/image.png b/image.png
	index 88839c4..4afcb7c 100644
	--- a/image.png
	+++ b/image.png
	@@ -1,12 +1,12 @@
	 ExifTool Version Number         : 7.74
	-File Size                       : 70 kB
	-File Modification Date/Time     : 2009:04:17 10:12:35-07:00
	+File Size                       : 94 kB
	+File Modification Date/Time     : 2009:04:21 07:02:43-07:00
	 File Type                       : PNG
	 MIME Type                       : image/png
	-Image Width                     : 1058
	-Image Height                    : 889
	+Image Width                     : 1056
	+Image Height                    : 827
	 Bit Depth                       : 8
	 Color Type                      : RGB with Alpha

Jasně vidíte, že se změnila jak velikost souboru, tak rozměry obrázku.

## Rozšíření klíčového slova

Vývojáři, kteří jsou zvyklí na jiné systémy, mohou požadovat nahrazení klíčového slova pro SVN nebo CVS. Hlavním problémem v systému Git je, že nelze upravit soubor s informacemi o revizi poté, co jste revizi zapsali, protože Git nejprve provede kontrolní součet souboru. Můžete však vložit text do souboru po jeho checkoutu a opět ho odstranit, než bude přidán do revize. Atributy Git nabízejí dvě možnosti, jak to provést.

První možností je automaticky vložit kontrolní součet SHA-1 blobu do pole `$Id$` v souboru. Pokud tento atribut nastavíte pro soubor nebo sadu souborů, při příštím checkoutu této větve Git nahradí toto pole kontrolním součtem SHA-1 blobu. Je tedy důležité si uvědomit, že se nejedná o SHA revize, ale SHA samotného blobu:

	$ echo '*.txt ident' >> .gitattributes
	$ echo '$Id$' > test.txt

Při příštím checkoutu tohoto souboru Git vloží SHA blobu:

	$ rm test.txt
	$ git checkout -- test.txt
	$ cat test.txt
	$Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $

Tento výsledek má však omezené použití. Pokud nahradíte klíčové slovo v systému CVS nebo Subversion, můžete přidat časový údaj (datestamp) – SHA tu není moc platné, protože je generováno náhodně a nelze podle něj určit, zda je jedna revize starší než jiná.

Jak zjistíte, můžete pro substituce v souborech určených k zapsání/checkoutu napsat i vlastní filtry. Jedná se o filtry clean a smudge. V souboru `.gitattributes` můžete určit filtr pro konkrétní umístění a nastavit skripty, jimiž budou zpracovány soubory těsně před jejich zapsáním („clean“ – viz obrázek 7-2) a těsně před checkoutem („smudge“ – viz obrázek 7-3). Tyto filtry lze nastavit k různým šikovným úkonům.


![](http://git-scm.com/figures/18333fig0702-tn.png)

Obrázek 7-2. Filtr smudge spuštěný při checkoutu – git checkout


![](http://git-scm.com/figures/18333fig0703-tn.png)

Obrázek 7-3. Filtr clean spuštěný při přípravě souborů k zapsání – git add

Původní zpráva k revizi s touto funkcí uvádí jednoduchý příklad, jak můžete před zapsáním prohnat veškeré vaše céčkové zdrojové texty programem `indent`. Tuto možnost lze aplikovat nastavením atributu `filter` v souboru `.gitattributes` tak, aby přefiltroval soubory `*.c` filtrem pro úpravu odsazování:

	*.c     filter=indent

Poté řekněte systému Git, co má filter indent dělat v situacích smudge a clean:

	$ git config --global filter.indent.clean indent
	$ git config --global filter.indent.smudge cat

Pokud v tomto případě zapíšete soubory odpovídající masce `*.c`, Git je ještě před zapsáním prožene programem pro úpravu odsazování a poté, před checkoutem zpět na disk, i programem `cat`. Program `cat` ve své podstatě nic neudělá: jeho výstupem jsou stejná data, která tvořila vstup. Tato kombinace ještě před zapsáním účinně přefiltruje veškeré zdrojové soubory pro jazyk C přes program `indent`.

Další zajímavý příklad se týká rozšíření klíčového slova `$Date$` ve stylu RCS. Ke správnému postupu budete potřebovat malý skript, který vezme název souboru, zjistí datum poslední revize v tomto projektu a vloží datum do souboru. Tady je malý Ruby skript, který to umí:

	#! /usr/bin/env ruby
	data = STDIN.read
	last_date = `git log --pretty=format:"%ad" -1`
	puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')

Skript pouze získá datum nejnovější revize z příkazu `git log` a rozšíří jím řetezce `$Date$`, které nalezne v standardním vstupu (stdin), a vrátí výsledek – snadno by to mělo jít provést v jakémkoli jazyce, který používáte. Tento soubor můžete pojmenovat `expand_date` a vložit ho do svého umístění. Nyní budete muset nastavit filtr v systému Git (pojmenujte ho `dater`) a určit, aby k operaci smudge při checkoutu souborů používal filtr `expand_date`. Při operaci clean během zapsání pak budete používat výraz Perlu:

	$ git config filter.dater.smudge expand_date
	$ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'

Tento fragment Perl vyjme vše, co najde v řetězci `$Date$`, čímž se vrátí zpět do stavu, kde jste začali. Nyní, když máte filtr hotový, můžete ho otestovat vytvořením souboru s klíčovým slovem `$Date$` a nastavením atributu Git pro tento soubor, jímž nový filtr aktivujete:

	$ echo '# $Date$' > date_test.txt
	$ echo 'date*.txt filter=dater' >> .gitattributes

Pokud tyto změny zapíšete a provedete nový checkout souboru, uvidíte, že bylo klíčové slovo správně substituováno:

	$ git add date_test.txt .gitattributes
	$ git commit -m "Testing date expansion in Git"
	$ rm date_test.txt
	$ git checkout date_test.txt
	$ cat date_test.txt
	# $Date: Tue Apr 21 07:26:52 2009 -0700$

Zde vidíte, jak může být tato metoda účinná pro uživatelsky nastavené aplikace. Přesto je na místě opatrnost. Soubor `.gitattributes` je zapisován a předáván spolu s projektem, avšak ovladač (v tomto případě je to `dater`) nikoli. Soubor tak nebude fungovat všude. Při navrhování těchto filtrů byste tedy měli myslet i na to, aby projekt pracoval správně, i když filtr selže.

## Export repozitáře

Data atributů Git umožňují rovněž některé zajímavé úkony při exportu archivů z vašeho projektu.

### export-ignore

Systému Git můžete zadat, aby při generování archivu neexportoval určité soubory nebo adresáře. Obsahuje-li projekt podadresář nebo soubor, který nechcete zahrnout do souboru archivu, ale který chcete ponechat jako součást projektu, můžete tyto soubory specifikovat atributem `export-ignore`.

Řekněme například, že máte v podadresáři `test/` několik testovacích souborů, které by nemělo smysl zahrnovat do exportu tarballu vašeho projektu. Do souboru s atributy Git můžete přidat následující řádek:

	test/ export-ignore

Až nyní spustíte příkaz git archive k vytvoření tarballu projektu, nebude tento adresář součástí archivu.

### export-subst

Další možností pro archivy je jednoduchá substituce klíčového slova. Git umožňuje vložit řetězec `$Format:$` do libovolného souboru s kterýmkoli ze zkrácených kódů formátování `--pretty=format`, z nichž jsme několik poznali v kapitole 2. Chcete-li do projektu zahrnout například soubor s názvem `LAST_COMMIT` a při spuštění příkazu `git archive` do něj bylo automaticky vloženo datum poslední revize, můžete nastavit tento soubor takto:

	$ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
	$ echo "LAST_COMMIT export-subst" >> .gitattributes
	$ git add LAST_COMMIT .gitattributes
	$ git commit -am 'adding LAST_COMMIT file for archives'

Spustíte-li příkaz `git archive`, bude po otevření soubor archivu vypadat obsah tohoto souboru takto:

	$ cat LAST_COMMIT
	Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$

## Strategie slučování

Atributy Git lze použít také k nastavení různých strategií slučování pro různé soubory v projektu. Velmi užitečnou možností je například nastavení, aby se Git nepokoušel sloučit konkrétní soubory, pokud u nich dojde ke konfliktu, a raději použil vaši verzi souboru než jinou.

Tuto možnost využijete, pokud se rozdělila nebo specializovala některá z větví vašeho projektu, avšak vy z ní budete chtít začlenit změny zpět a ignorovat přitom určité soubory. Řekněme, že máte soubor s nastavením databáze database.xml, který se ve dvou větvích liší, a vy sem chcete začlenit jinou svoji větev, aniž byste tento soubor změnili. V tom případě můžete nastavit tento atribut:

	database.xml merge=ours

Pokud začleníte druhou větev, místo řešení konfliktů u souboru database.xml se zobrazí následující:

	$ git merge topic
	Auto-merging database.xml
	Merge made by recursive.

V tomto případě zůstane soubor database.xml ve své původní podobě.
