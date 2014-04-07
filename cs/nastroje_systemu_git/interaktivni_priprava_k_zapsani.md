# Interaktivní příprava k zapsání

Git nabízí také celou řadu skriptů, které vám mohou usnadnit provádění příkazů zadávaných v příkazovém řádku. V této části se podíváme na několik interaktivních příkazů, které vám mohou pomoci snadno určit, na jaké kombinace a části souborů má být omezena konkrétní revize. Tyto nástroje se vám mohou velmi hodit, jestliže upravujete několik souborů a rozhodnete se, že tyto změny zapíšete raději do několika specializovaných revizí než do jedné velké nepřehledné. Tímto způsobem zajistíte, že budou vaše revize logicky oddělenými sadami změn, jež mohou vaši spolupracovníci snadno zkontrolovat.
Spustíte-li příkaz `git add` s parametrem `-i` nebo `--interactive`, přejde Git do interaktivního režimu shellu a zobrazí zhruba následující:

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now>

Vidíte, že tento příkaz vám poskytne podstatně odlišný pohled na vaši oblast připravených změn. Stejné informace, i když o něco stručnější a hutnější, získáte také příkazem `git status`. Tento příkaz vypíše všechny změny, které jste připravili k zapsání, na levé straně, nepřipravené změny na pravé.

Za seznamem změn následuje část Commands (Příkazy). Tady můžete provádět celou řadu věcí, včetně přípravy souborů k zapsání, vracení připravených souborů, přípravy částí souborů, přidávání nesledovaných souborů a prohlížení změn v připravených souborech.

## Příprava souborů k zapsání a jejich vracení

Zadáte-li na výzvu `What now>` (Co teď) odpověď `2` nebo `u`, skript se vás zeptá, které soubory chcete připravit k zapsání:

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Jestliže chcete připravit k zapsání soubory TODO a index.html, zadejte příslušná čísla:

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Znak `*` vedle souborů znamená, že je soubor vybrán jako připravený k zapsání. Jestliže na výzvu `Update>>` nic nezadáte a stisknete klávesu Enter, Git vezme všechny vybrané soubory a připraví je k zapsání:

	Update>>
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Jak vidíte, soubory TODO a index.html jsou připraveny k zapsání, soubor simplegit.rb nikoli. Chcete-li v tuto chvíli vrátit soubor TODO z oblasti připravených změn, použijte parametr `3` nebo `r` (jako „revert“ neboli „vrátit“):

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path

Pokud se nyní znovu podíváte na stav Git souboru TODO, uvidíte, že už není připraven k zapsání:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Chcete-li zobrazit výpis diff připravených souborů, použijte příkaz `6` nebo `d` (jako „diff“). Příkaz zobrazí seznam připravených souborů. Můžete vybrat ty soubory, pro něž chcete zobrazit rozdíly připravených změn. Je to prakticky totéž, jako byste na příkazovém řádku zadali příkaz `git diff --cached`:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

Pomocí těchto základních příkazů můžete použít režim interaktivního přidávání, a snáze tak ovládat svou oblast připravených změn.

## Příprava záplat

Git také může připravit k zapsání pouze určité části souborů a ignorovat jejich zbytek. Pokud například provedete dvě změny v souboru simplegit.rb a chcete k zapsání připravit pouze jednu z nich, není to v systému Git žádný problém. Na interaktivní výzvu zadejte příkaz `5` nebo `p` (jako „patch“ – tedy záplata). Git se vás zeptá, které soubory chcete částečně připravit. Pro každou část vybraných souborů pak zobrazí komplexy (hunks) rozdílů diff daného souboru a u každého z nich se vás zeptá, jestli si ho přejete připravit k zapsání:

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]?

V tomto se nabízí celá řada možností. Zadáte-li znak `?`, zobrazí se seznam možností, které máte k dispozici.

	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
	y - stage this hunk
	n - do not stage this hunk
	a - stage this and all the remaining hunks in the file
	d - do not stage this hunk nor any of the remaining hunks in the file
	g - select a hunk to go to
	/ - search for a hunk matching the given regex
	j - leave this hunk undecided, see next undecided hunk
	J - leave this hunk undecided, see next hunk
	k - leave this hunk undecided, see previous undecided hunk
	K - leave this hunk undecided, see previous hunk
	s - split the current hunk into smaller hunks
	e - manually edit the current hunk
	? - print help

V českém překladu:

	Připravit tento soubor změn [y,n,a,d,/,j,J,g,e,?]? ?
	y - připravit soubor změn k zapsání
	n - nepřipravovat soubor změn k zapsání
	a - připravit tento soubor změn i všechny ostatní komplexy v souboru
	d - nepřipravovat tento soubor změn ani žádné další komplexy v souboru
	g - vybrat soubor změn, k němuž má systém přejít
	/ - najít soubor změn odpovídající danému regulárnímu výrazu
	j - nechat tento soubor změn nerozhodnutý, zobrazit další nerozhodnutý
	J - nechat tento soubor změn nerozhodnutý, zobrazit další komplex
	j - nechat tento soubor změn nerozhodnutý, zobrazit předchozí nerozhodnutý
	J - nechat tento soubor změn nerozhodnutý, zobrazit předchozí komplex
	s - rozdělit aktuální soubor změn do menších komplexů
	e - ručně editovat aktuální soubor změn
	? - nápověda

Chcete-li připravit k zapsání jednotlivé komplexy, většinou zadáte `y` nebo `n`. Přesto se vám může někdy hodit i možnost připravit všechny komplexy v určitých souborech nebo přeskočení komplexu, k němuž se vrátíte později. Připravíte-li k zapsání jednu část souboru a druhou nikoli, bude výstup příkazu status vypadat asi takto:

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

Zajímavý je stav souboru simplegit.rb. Oznamuje vám, že několik řádků je připravených k zapsání a několik není. Soubor je částečně připraven k zapsání. V tomto okamžiku můžete ukončit skript interaktivního přidávání a spustit příkaz `git commit`, jímž zapíšete částečně připravené soubory.

K částečné přípravě souboru ostatně nemusíte být nutně v režimu interaktivního přidávání. Stejný skript spustíte také příkazem `git add -p` nebo `git add --patch` z příkazového řádku.
