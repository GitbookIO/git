# Nahrávání změn do repozitáře

Nyní máte vytvořen repozitář Git a checkout nebo pracovní kopii souborů k projektu. Řekněme, že potřebujete udělat pár změn a zapsat snímky těchto změn do svého repozitáře pokaždé, kdy se projekt dostane do stavu, v němž ho chcete nahrát.

Nezapomeňte, že každý soubor ve vašem pracovním adresáři může být ve dvou různých stavech: sledován a nesledován. Za sledované jsou označovány soubory, které byly součástí posledního snímku. Mohou být ve stavu změněno (modified), nezměněno (unmodified) nebo připraveno k zapsání (staged). Nesledované soubory jsou všechny ostatní, tedy veškeré soubory ve vašem pracovním adresáři, které nebyly obsaženy ve vašem posledním snímku a nejsou v oblasti připravených změn. Po úvodním klonování repozitáře budou všechny vaše soubory sledované a nezměněné, protože jste právě provedli jejich checkout a dosud jste neudělali žádné změny.

Jakmile začnete soubory upravovat, Git je bude považovat za „změněné“, protože jste v nich od poslední revize provedli změny. Poté všechny tyto změněné soubory připravíte k zapsání a následně všechny připravené změny zapíšete. Cyklus může začít od začátku. Pracovní cyklus je znázorněn na obrázku 2-1.


![](http://git-scm.com/figures/18333fig0201-tn.png)

Obrázek 2-1. Cyklus stavů vašich souborů

## Kontrola stavu souborů

Hlavním nástrojem na zjišťování stavu jednotlivých souborů je příkaz `git status`. Spustíte-li tento příkaz bezprostředně po klonování, objeví se zhruba následující:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

To znamená, že žádné soubory nejsou připraveny k zapsání a pracovní adresář je čistý. Jinými slovy žádné sledované soubory nebyly změněny. Git také neví o žádných nesledovaných souborech, jinak by byly ve výčtu uvedeny. Příkaz vám dále sděluje, na jaké větvi (branch) se nacházíte. Pro tuto chvíli nebudeme situaci komplikovat a výchozí bude vždy hlavní větev (`master` branch). Větve a reference budou podrobně popsány v následující kapitole.

Řekněme, že nyní přidáte do projektu nový soubor, například soubor `README`. Pokud soubor neexistoval dříve a vy spustíte příkaz `git status`, bude nesledovaný soubor uveden takto:

	$ vim README
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#	README
	nothing added to commit but untracked files present (use "git add" to track)

Vidíte, že nový soubor `README` není sledován, protože je ve výpisu stavů uveden v části „Untracked files“. Není-li soubor sledován, obecně to znamená, že Git ví o souboru, který nebyl v předchozím snímku (v předchozí revizi), a nezařadí ho ani do dalších snímků, dokud mu k tomu nedáte výslovný příkaz. Díky tomu se nemůže stát, že budou do revizí nedopatřením zahrnuty vygenerované binární soubory nebo jiné soubory, které si nepřejete zahrnout. Vy si ale přejete soubor README zahrnout, a proto spusťme jeho sledování.

## Sledování nových souborů

K zahájení sledování nových souborů se používá příkaz `git add`. Chcete-li zahájit sledování souboru `README`, můžete zadat příkaz:

	$ git add README

Když nyní znovu provedete příkaz k výpisu stavů (git status), uvidíte, že je nyní soubor `README` sledován a připraven k zapsání:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#

Můžeme říci, že je připraven k zapsání, protože je uveden v části „Changes to be committed“, tedy „Změny k zapsání“. Pokud v tomto okamžiku zapíšete revizi, v historickém snímku bude verze souboru z okamžiku, kdy jste spustili příkaz `git add`. Možná si vzpomínáte, že když jste před časem spustili příkaz `git init`, provedli jste potom příkaz `git add (soubory)`. Příkaz jste zadávali kvůli zahájení sledování souborů ve vašem adresáři. Příkaz `git add` je doplněn uvedením cesty buď k souboru, nebo k adresáři. Pokud se jedná o adresář, příkaz přidá rekurzivně všechny soubory v tomto adresáři.

## Připravení změněných souborů

Nyní provedeme změny v souboru, který už byl sledován. Pokud změníte už dříve sledovaný soubor s názvem `benchmarks.rb` a poté znovu spustíte příkaz `status`, zobrazí se výpis podobného obsahu:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Soubor `benchmarks.rb` je uveden v části „Changes not staged for commit“ (Změněno, ale neaktualizováno). Znamená to, že soubor, který je sledován, byl v pracovním adresáři změněn, avšak ještě nebyl připraven k zapsání. Chcete-li ho připravit, spusťte příkaz `git add` (jedná se o univerzální příkaz – používá se k zahájení sledování nových souborů, k připravení souborů a k dalším operacím, jako např. k označení souborů, které kolidovaly při sloučení, za vyřešené). Spusťme nyní příkaz `git add` k připravení souboru `benchmarks.rb` k zapsání a následně znovu příkaz `git status`:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

Oba soubory jsou nyní připraveny k zapsání a budou zahrnuty do příští revize. Nyní předpokládejme, že jste si vzpomněli na jednu malou změnu, kterou chcete ještě před zapsáním revize provést v souboru `benchmarks.rb`. Soubor znovu otevřete a provedete změnu. Soubor je připraven k zapsání. Spusťme však ještě jednou příkaz `git status`:

	$ vim benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Co to má být? Soubor `benchmarks.rb` je nyní uveden jak v části připraveno k zapsání (Changes to be committed), tak v části nepřipraveno k zapsání (Changes not staged for commit). Jak je tohle možné? Věc se má tak, že Git po spuštění příkazu `git add` připraví soubor přesně tak, jak je. Pokud nyní revizi zapíšete, bude obsahovat soubor `benchmarks.rb` tak, jak vypadal když jste naposledy spustili příkaz `git add`, nikoli v té podobě, kterou měl v pracovním adresáři v okamžiku, když jste spustili příkaz `git commit`. Pokud upravíte soubor po provedení příkazu `git add`, je třeba spustit `git add` ještě jednou, aby byla připravena aktuální verze souboru:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

## Ignorované soubory

Často se ve vašem adresáři vyskytne skupina souborů, u nichž nebudete chtít, aby je Git automaticky přidával nebo aby je vůbec uváděl jako nesledované. Jedná se většinou o automaticky vygenerované soubory, jako soubory log nebo soubory vytvořené sestavovacím systémem. V takovém případě můžete vytvořit soubor `.gitignore`, který specifikuje ignorované soubory. Tady je malý příklad souboru `.gitignore`:

	$ cat .gitignore
	*.[oa]
	*~

První řádek říká systému Git, že má ignorovat všechny soubory končící na `.o` nebo `.a` – objektové a archivní soubory, které mohou být výsledkem vytváření kódu. Druhý řádek systému Git říká, aby ignoroval všechny soubory končící vlnovkou (`~`), již mnoho textových editorů (např. Emacs) používá k označení dočasných souborů. Můžete rovněž přidat adresář `log`, `tmp` nebo `pid`, automaticky vygenerovanou dokumentaci apod. Nastavit soubor `.gitignore`, ještě než se pustíte do práce, bývá většinou dobrý nápad. Alespoň se vám nestane, že byste nedopatřením zapsali také soubory, o které v repozitáři Git nestojíte.

Toto jsou pravidla pro masky, které můžete použít v souboru `.gitignore`:

*	Prázdné řádky nebo řádky začínající znakem `#` budou ignorovány.
*	Standardní masku souborů.
*	Chcete-li označit adresář, můžete masku zakončit lomítkem (`/`).
*	Pokud řádek začíná vykřičníkem (`!`), maska na něm je negována.

Masky souborů jsou jako zjednodušené regulární výrazy, které používá shell. Hvězdička (`*`) označuje žádný nebo více znaků; `[abc]` označuje jakýkoli znak uvedený v závorkách (v tomto případě `a`, `b` nebo `c`); otazník (`?`) označuje jeden znak; znaky v závorkách oddělené pomlčkou (`[0-9]`) označují jakýkoli znak v daném rozmezí (v našem případě 0 až 9).

Tady je další příklad souboru `.gitignore`:

	# komentář – ignoruje se
	# žádné soubory s příponou .a
	*.a
	# ale sleduj soubor lib.a, přestože máš ignorovat soubory s příponou .a
	!lib.a
	# ignoruj soubor TODO pouze v kořenovém adresáři, ne v podadresářích
	/TODO
	# ignoruj všechny soubory v adresáři build/
	build/
	# ignoruj doc/notes.txt, ale nikoli doc/server/arch.txt
	doc/*.txt

## Zobrazení připravených a nepřipravených změn

Je-li pro vaše potřeby příkaz `git status` příliš neurčitý – chcete přesně vědět, co jste změnili, nejen které soubory – můžete použít příkaz `git diff`. Podrobněji se budeme příkazu `git diff` věnovat později. Vy ho však nejspíš budete nejčastěji využívat k zodpovězení těchto dvou otázek: Co jste změnili, ale ještě nepřipravili k zapsání? A co jste připravili a nyní může být zapsáno? Zatímco příkaz `git status` vám tyto otázky zodpoví velmi obecně, příkaz `git diff` přesně zobrazí přidané a odstraněné řádky – tedy samotná záplata.

Řekněme, že znovu upravíte a připravíte soubor `README` a poté bez připravení upravíte soubor `benchmarks.rb`. Po spuštění příkazu `status` se zobrazí zhruba toto:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Chcete-li vidět, co jste změnili, avšak ještě nepřipravili k zapsání, zadejte příkaz `git diff` bez dalších parametrů:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

Tento příkaz srovná obsah vašeho pracovního adresáře a oblasti připravených změn. Výsledek vám ukáže provedené změny, které jste dosud nepřipravili k zapsání.

Chcete-li vidět, co jste připravili a co bude součástí příští revize, použijte příkaz `git diff --cached`. (Ve verzích Git 1.6.1 a novějších můžete použít také příkaz `git diff --staged`, který se možná snáze pamatuje.) Tento příkaz srovná připravené změny s poslední revizí:

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

K tomu je třeba poznamenat, že příkaz `git diff` sám o sobě nezobrazí všechny změny provedené od poslední revize, ale jen změny, které zatím nejsou připraveny. To může být občas matoucí, protože pokud jste připravili všechny provedené změny, výstup příkazu `git diff` bude prázdný.

V dalším příkladu ukážeme situaci, kdy jste připravili soubor `benchmarks.rb` a poté ho znovu upravili. Příkaz `git diff` můžete nyní použít k zobrazení změn v souboru, které byly připraveny, a změn, které nejsou připraveny:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#

Příkaz `git diff` nyní můžete použít k zobrazení změn, které dosud nejsou připraveny:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats
	+# test line

A příkaz `git diff --cached` ukáže změny, které už připraveny jsou:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Zapisování změn

Nyní, když jste seznam připravených změn nastavili podle svých představ, můžete začít zapisovat změny. Nezapomeňte, že všechno, co dosud nebylo připraveno k zapsání – všechny soubory, které jste vytvořili nebo změnili a na které jste po úpravách nepoužili příkaz `git add` – nebudou do revize zahrnuty. Zůstanou na vašem disku ve stavu „změněno“.
Když jsme v našem případě naposledy spustili příkaz `git status`, viděli jste, že všechny soubory byly připraveny k zapsání. Nyní může proběhnout samotné zapsání změn. Nejjednodušším způsobem zapsání je zadat příkaz `git commit`:

	$ git commit

Po zadání příkazu se otevře zvolený editor. (Ten je nastaven proměnnou prostředí `$EDITOR` vašeho shellu. Většinou se bude jednat o editor vim nebo emacs, ale pomocí příkazu `git config --global core.editor` můžete nastavit i jakýkoli jiný – viz kapitola 1.)

Editor zobrazí následující text (tento příklad je z editoru Vim):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       new file:   README
	#       modified:   benchmarks.rb
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

Jak vidíte, výchozí zpráva k revizi (commit message) obsahuje zakomentovaný aktuální výstup příkazu `git status` a nahoře jeden prázdný řádek. Tyto komentáře můžete odstranit a napsat vlastní zprávu k revizi, nebo je můžete v souboru ponechat, abyste si lépe vzpomněli, co bylo obsahem dané revize. (Chcete-li zařadit ještě podrobnější informace o tom, co jste měnili, můžete k příkazu `git commit` přidat parametr `-v`. V editoru se pak zobrazí také výstup „diff“ ke konkrétním změnám a vy přesně uvidíte, co bylo změněno.) Jakmile editor zavřete, Git vytvoří revizi se zprávou, kterou jste napsali (s odstraněnými komentáři a rozdíly).

Zprávu k revizi můžete rovněž napsat do řádku k příkazu `commit`. Jako zprávu ji označíte tak, že před ni vložíte příznak `-m`:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master]: created 463dc4f: "Fix benchmarks for speed"
	 2 files changed, 3 insertions(+), 0 deletions(-)
	 create mode 100644 README

Nyní jste vytvořili svou první revizi! Vidíte, že se po zapsání revize zobrazil výpis s informacemi: do jaké větve jste revizi zapsali (hlavní, `master`), jaký kontrolní součet SHA-1 revize dostala (`463dc4f`), kolik souborů bylo změněno a statistiku přidaných a odstraněných řádků revize.

Nezapomeňte, že revize zaznamená snímek projektu, jak je obsažen v oblasti připravených změn. Vše, co jste nepřipravili k zapsání, zůstane ve stavu „změněno“ na vašem disku. Chcete-li i tyto soubory přidat do své historie, zapište další revizi. Pokaždé, když zapíšete revizi, nahrajete snímek svého projektu, k němuž se můžete později vrátit nebo ho můžete použít k srovnání.

## Přeskočení oblasti připravených změn

Přestože může být oblast připravených změn opravdu užitečným nástrojem pro přesné vytváření revizí, je někdy při daném pracovním postupu zbytečným mezikrokem. Chcete-li oblast připravených změn úplně přeskočit, nabízí Git jednoduchou zkratku. Přidáte-li k příkazu `git commit` parametr `-a`, Git do revize automaticky zahrne každý soubor, který je sledován. Zcela tak odpadá potřeba zadávat příkaz `git add`:

	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+), 0 deletions(-)

Tímto způsobem není nutné provádět před zapsáním revize příkaz `git add` pro soubor `benchmarks.rb`.

## Odstraňování souborů

Chcete-li odstranit soubor ze systému Git, musíte ho odstranit ze sledovaných souborů (přesněji řečeno odstranit z oblasti připravených změn) a zapsat revizi. Odstranění provedete příkazem `git rm`, který odstraní soubor zároveň z vašeho pracovního adresáře, a proto ho už příště neuvidíte mezi nesledovanými soubory.

Pokud soubor jednoduše odstraníte z pracovního adresáře, zobrazí se ve výpisu `git status` v části „Changes not staged for commit“ (tedy nepřipraveno):

	$ rm grit.gemspec
	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#   (use "git add/rm <file>..." to update what will be committed)
	#
	#       deleted:    grit.gemspec
	#

Pokud nyní provedete příkaz `git rm`, bude k zapsání připraveno odstranění souboru:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       deleted:    grit.gemspec
	#

Po příštím zapsání revize soubor zmizí a nebude sledován. Pokud už jste soubor upravili a přidali do indexu, musíte odstranění provést pomocí parametru `-f`. Jedná se o bezpečnostní funkci, jež má zabránit nechtěnému odstranění dat, která ještě nebyla nahrána do snímku, a nemohou proto být ze systému Git obnovena.

Další užitečnou možností, která se vám může hodit, je zachování souboru v pracovním stromě a odstranění z oblasti připravených změn. Soubor tak ponecháte na svém pevném disku, ale ukončíte jeho sledování systémem Git. To může být užitečné zejména v situaci, kdy něco zapomenete přidat do souboru `.gitignore`, a omylem to tak zahrnete do revize, např. velký log soubor nebo pár zkompilovaných souborů s příponou `.a`. V takovém případě použijte parametr `--cached`:

	$ git rm --cached readme.txt

Příkaz `git rm` lze používat v kombinaci se soubory, adresáři a maskami souborů. Můžete tak zadat například příkaz ve tvaru:

	$ git rm log/\*.log

Všimněte si tu zpětného lomítka (`\`) před znakem `*`. Je tu proto, že Git provádí své vlastní nahrazování masek souborů nad to, které provádí váš shell. Tímto příkazem odstraníte všechny soubory s příponou `.log` z adresáře `log/`. Provést můžete také tento příkaz:

	$ git rm \*~

Tento příkaz odstraní všechny soubory, které končí vlnovkou (`~`).

## Přesouvání souborů

Na rozdíl od ostatních systémů VCS nesleduje Git explicitně přesouvání souborů. Pokud přejmenujete v systému Git soubor, neuloží se žádná metadata s informací, že jste soubor přejmenovali. Git však používá jinou fintu, aby zjistil, že byl soubor přejmenován. Na ni se podíváme později.

Může se zdát zvláštní, že Git přesto používá příkaz `mv`. Chcete-li v systému Git přejmenovat soubor, můžete spustit třeba příkaz

	$ git mv původní_název nový_název

a vše funguje na výbornou. A skutečně, pokud takový příkaz provedete a podíváte se na stav souboru, uvidíte, že ho Git považuje za přejmenovaný (renamed):

	$ git mv README.txt README
	$ git status
	# On branch master
	# Your branch is ahead of 'origin/master' by 1 commit.
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       renamed:    README.txt -> README
	#

Výsledek je však stejný, jako byste provedli následující:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git implicitně zjistí, že se jedná o přejmenování, a proto nehraje roli, zda přejmenujete soubor tímto způsobem, nebo pomocí příkazu `mv`. Jediným skutečným rozdílem je, že `mv` je jediný příkaz, zatímco u druhého způsobu potřebujete příkazy tři — příkaz `mv` je pouze zjednodušením. Důležitější je, že můžete použít jakýkoli způsob přejmenování a příkaz add/rm provést později, před zapsáním revize.
