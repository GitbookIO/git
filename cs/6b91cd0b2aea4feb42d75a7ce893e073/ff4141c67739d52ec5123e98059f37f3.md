# Zobrazení historie revizí

Až vytvoříte několik revizí nebo pokud naklonujete repozitář s existující historií revizí, možná budete chtít nahlédnout do historie projektu. Nejzákladnějším a nejmocnějším nástrojem je v tomto případě příkaz `git log`.

Následující příklady ukazují velmi jednoduchý projekt pojmenovaný `simplegit`, který pro názornost často používám. Chcete-li si projekt naklonovat, zadejte:

	git clone git://github.com/schacon/simplegit-progit.git

Po zadání příkazu `git log` v tomto projektu byste měli dostat výstup, který vypadá zhruba následovně:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

Ve výchozím nastavení a bez dalších parametrů vypíše příkaz `git log` revize provedené v daném repozitáři v obráceném chronologickém pořadí. Nejnovější revize tak budou uvedeny nahoře. Jak vidíte, tento příkaz vypíše všechny revize s jejich kontrolním součtem SHA-1, jménem a e-mailem autora, datem zápisu a zprávou k revizi.

K příkazu `git log` je k dispozici velké množství nejrůznějších parametrů, díky nimž můžete najít přesně to, co hledáte. Vyjmenujme některé z nejčastěji používaných parametrů.

Jedním z nejužitečnějších je parametr `-p`, který zobrazí rozdíly diff provedené v každé revizi. Můžete také použít parametr `-2`, který omezí výpis pouze na dva poslední záznamy:

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,7 +5,7 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Tento parametr zobrazí tytéž informace, ale za každým záznamem následuje informace o rozdílech. Tato funkce je velmi užitečná při kontrole kódu nebo k rychlému zjištění, co bylo obsahem série revizí, které přidal váš spolupracovník.
Ve spojení s příkazem `git log` můžete použít také celou řadu shrnujících parametrů. Pokud například chcete zobrazit některé stručné statistiky pro každou revizi, použijte parametr `--stat`:

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Jak vidíte, parametr `--stat` vypíše pod každým záznamem revize seznam změněných souborů, kolik souborů bylo změněno (changed) a kolik řádků bylo v těchto souborech vloženo (insertions) a smazáno (deletions). Zároveň vloží na konec výpisu shrnutí těchto informací.
Další opravdu užitečnou možností je parametr `--pretty`. Tento parametr změní výstup logu na jiný než výchozí formát. K dispozici máte několik přednastavených možností. Parametr `oneline` vypíše všechny revize na jednom řádku. Tuto možnost oceníte při velkém množství revizí. Dále se nabízejí parametry `short`, `full` a `fuller` (zkrácený, plný, úplný). Zobrazují výstup přibližně ve stejném formátu, avšak s více či méně podrobnými informacemi:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

Nejzajímavějším parametrem je pak `format`, který umožňuje definovat vlastní formát výstupu logu. Tato možnost je užitečná zejména v situaci, kdy vytváříte výpis pro strojovou analýzu. Jelikož specifikujete formát explicitně, máte jistotu, že se s aktualizací systému Git nezmění:

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Tabulka 2-1 uvádí některé užitečné parametry, které format akceptuje.

	Parametr	Popis výstupu
	%H	Otisk (hash) revize
	%h	Zkrácený otisk revize
	%T	Otisk stromu
	%t	Zkrácený otisk stromu
	%P	Nadřazené otisky
	%p	Zkrácené nadřazené otisky
	%an	Jméno autora
	%ae	E-mail autora
	%ad	Datum autora (formát je možné nastavit parametrem --date)
	%ar	Datum autora, relativní
	%cn	Jméno autora revize
	%ce	E-mail autora revize
	%cd	Datum autora revize
	%cr	Datum autora revize, relativní
	%s	Předmět

Možná se ptáte, jaký je rozdíl mezi autorem a autorem revize. Autor je osoba, která práci původně napsala, zatímco autor revize je osoba, která práci zapsala do repozitáře. Pokud tedy pošlete záplatu k projektu a některý z ústředních členů (core members) ji použije, do výpisu se dostanete oba – vy jako autor a core member jako autor revize. K tomuto rozlišení se blíže dostaneme v kapitole 5.

Parametry `oneline` a `format` jsou zvlášť užitečné ve spojení s další možností `log`u – parametrem `--graph`. Tento parametr vloží pěkný malý ASCII graf, znázorňující historii vaší větve a slučování, kterou si ukážeme na naší kopii repozitáře projektu Grit:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

To je jen několik základních parametrů k formátování výstupu pro příkaz `git log`, celkově jich je mnohem více. Tabulka 2-2 uvádí parametry, které jsme už zmínili, a některé další běžné parametry formátování, které mohou být užitečné. Pravý sloupec popisuje, jak který parametr změní výstup `log`u.

	Parametr	Popis
	-p	Zobrazí záplatu vytvořenou s každou revizí.
	--stat	Zobrazí statistiku pro změněné soubory v každé revizi.
	--shortstat	Zobrazí pouze řádek změněno/vloženo/smazáno z příkazu --stat.
	--name-only	Za informacemi o revizi zobrazí seznam změněných souborů.
	--name-status	Zobrazí seznam dotčených souborů spolu s informací přidáno/změněno/smazáno.
	--abbrev-commit	Zobrazí pouze prvních několik znaků kontrolního součtu SHA-1 místo všech 40.
	--relative-date	Zobrazí datum v relativním formátu (např. "2 weeks ago", tj. před 2 týdny) místo formátu s úplným datem.
	--graph	Zobrazí vedle výstupu logu ASCII graf k historii větve a slučování.
	--pretty	Zobrazí revize v alternativním formátu. Parametry příkazu jsou oneline, short, full, fuller a format (lze zadat vlastní formát).
	--oneline	Užitečná zkratka pro `--pretty=oneline --abbrev-commit`.

## Omezení výstupu logu

Kromě parametrů k formátování výstupu lze pro `git log` použít také celou řadu omezujících parametrů, tj. takových, které zobrazí jen definovanou podmnožinu revizí. My už jsme se s jedním takovým parametrem setkali. Byl to parametr `-2`, který zobrazí pouze dvě poslední revize. Obecně lze tedy říci, že můžete zadat parametr `-<n>`, kde `n` je libovolné celé číslo pro zobrazení posledních `n` revizí. Je však třeba dodat, že tuto funkci asi nebudete využívat příliš často. Git totiž standardně redukuje všechny výpisy stránkovačem, a proto se vždy najednou zobrazí pouze jedna stránka logu.

Velmi užitečné jsou naproti tomu časově omezující parametry, jako `--since` a `--until` („od“ a „do“). Například tento příkaz zobrazí seznam všech revizí pořízených za poslední dva týdny (2 weeks):

	$ git log --since=2.weeks

Tento příkaz pracuje s velkým množstvím formátů. Můžete zadat konkrétní datum („2008-01-15“) nebo relativní datum, např. „2 years 1 day 3 minutes ago“ (před 2 roky, 1 dnem a 3 minutami).

Z výpisu rovněž můžete filtrovat pouze revize, které odpovídají určitým kritériím. Parametr `--author` umožňuje filtrovat výpisy podle konkrétního autora, pomocí parametru `--grep` můžete ve zprávách k revizím vyhledávat klíčová slova. Chcete-li hledat současný výskyt parametrů author i grep, musíte přidat výraz `--all-match`, jinak se bude hledat kterýkoli z nich.

Posledním opravdu užitečným parametrem, který lze přidat k příkazu `git log` , je zadání cesty. Jestliže zadáte název adresáře nebo souboru, výstup logu tím omezíte na revize, které provedly změnu v těchto souborech. Cesta je vždy posledním parametrem a většinou jí předcházejí dvě pomlčky (`--`) , jimiž je oddělena od ostatních parametrů.

Tabulka 2-3 uvádí pro přehlednost zmíněné parametry a několik málo dalších. Tabulka 2.2

	Parametr	Popis
	-(n)	Zobrazí pouze posledních n revizí.
	--since, --after	Omezí výpis na revize provedené po zadaném datu.
	--until, --before	Omezí výpis na revize provedené před zadaným datem.
	--author	Zobrazí pouze revize, v nichž autor odpovídá zadanému řetězci.
	--committer	Zobrazí pouze revize, v nichž autor revize odpovídá zadanému řetězci.

Pokud chcete například zjistit, které revize upravující testovací soubory byly v historii zdrojového kódu Git zapsány v říjnu 2008 Juniem Hamanem a nebyly sloučením, můžete zadat následující příkaz:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Z téměř 20 000 revizí v historii zdrojového kódu Git zobrazí tento příkaz 6 záznamů, které odpovídají zadaným kritériím.

## Grafické uživatelské rozhraní pro procházení historie

Chcete-li použít graficky výrazněji zpracovaný nástroj k procházení historie revizí, možná oceníte Tcl/Tk program nazvaný `gitk`, který je distribuován spolu se systémem Git. Gitk je v zásadě grafická verze příkazu `git log` a umožňuje téměř všechny možnosti filtrování jako `git log`. Pokud do příkazového řádku ve svém projektu zadáte příkaz `gitk`, otevře se okno podobné jako na obrázku 2-2.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Obrázek 2-2. Graficky zpracovaná historie v nástroji „gitk“

V horní polovině okna vidíte historii revizí, doplněnou názorným hierarchickým grafem. Prohlížeč rozdílů v dolní polovině okna zobrazuje změny provedené v každé revizi, na niž kliknete.
