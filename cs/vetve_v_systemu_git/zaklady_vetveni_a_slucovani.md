# Základy větvení a slučování

Vytvořme si jednoduchý příklad větvení a slučování s pracovním postupem, který můžete využít i v reálném životě. Budete provádět tyto kroky:

1.  Pracujete na webových stránkách.
2.  Vytvoříte větev pro novou část stránek, v níž budete pracovat.
3.  Vytvoříte práci v této větvi.

V tomto okamžiku vám zavolají, že se vyskytla jiná kritická chyba, která vyžaduje hotfix. Uděláte následující:

1.  Vrátíte se zpět na produkční větev.
2.  Vytvoříte větev pro přidání hotfixu.
3.  Po úspěšném otestování začleníte větev s hotfixem a odešlete ji do produkce.
4.  Přepnete zpět na svou původní část a pokračujete v práci.

## Základní větvení

Řekněme, že pracujete na projektu a už jste vytvořili několik revizí (viz obrázek 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)

Obrázek 3-10. Krátká a jednoduchá historie revizí

Rozhodli jste se, že budete pracovat na chybě č. 53, ať už vaše společnost používá jakýkoli systém sledování chyb. Přesněji řečeno, Git není začleněn do žádného konkrétního systému sledování chyb, ale protože je chyba č. 53 významná a chcete na ní pracovat, vytvoříte si pro ni novou větev. Abyste vytvořili novou větev a rovnou na ni přepnuli, můžete spustit příkaz `git checkout` s přepínačem `-b`:

	$ git checkout -b iss53
	Switched to a new branch "iss53"

Tímto způsobem jste spojili dva příkazy:

	$ git branch iss53
	$ git checkout iss53

Obrázek 3-11 ukazuje výsledek.


![](http://git-scm.com/figures/18333fig0311-tn.png)

Obrázek 3-11. Vytvoření nového ukazatele na větev

Pracujete na webových stránkách a zapíšete několik revizí. S každou novou revizí se větev `iss53` posune vpřed, protože jste provedli její checkout (to znamená, že jste na ni přepnuli a ukazuje na ni soubor HEAD – viz obrázek 3-12):

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)

Obrázek 3-12. Větev iss53 se s vaší prací posouvá vpřed.

V tomto okamžiku vám zavolají, že se na webových stránkách vyskytl problém, který musíte okamžitě vyřešit. Jelikož pracujete v systému Git, nemusíte svou opravu vytvářet uprostřed změn, které jste provedli v části `iss53`, ani nemusíte dělat zbytečnou práci, abyste všechny tyto změny vrátili, než budete moci začít pracovat na opravě produkční verze stránek. Jediné, co teď musíte udělat, je přepnout zpět na hlavní větev.

Než tak učiníte, zkontrolujte, zda nemáte v pracovním adresáři nebo v oblasti připravených změn nezapsané změny, které kolidují s větví, jejíž checkout provádíte. V takovém případě by vám Git přepnutí větví nedovolil. Při přepínání větví je ideální, pokud máte čistý pracovní stav. Existují způsoby, jak toho docílit (jmenovitě odložení a doplnění revize), těm se však budeme věnovat až později. Pro tuto chvíli jste zapsali všechny provedené změny a můžete přepnout zpět na hlavní větev.

	$ git checkout master
	Switched to branch "master"

V tomto okamžiku vypadá váš pracovní adresář přesně tak, jak vypadal, než jste začali pracovat na chybě č. 53, a vy se nyní můžete soustředit na rychlou opravu. Na paměti byste však stále měli mít následující: Git vždy vrátí pracovní adresář do stejného stavu, jak vypadal snímek revize, na niž ukazuje větev, jejíž checkout nyní provádíte. Automaticky budou přidány, odstraněny a upraveny soubory tak, aby byla vaše pracovní kopie totožná se stavem větve v okamžiku, kdy jste na ni zapsali poslední revizi.

Nyní přichází na řadu hotfix. Vytvořme větev s hotfixem, v níž budeme pracovat, dokud nebude oprava hotová (viz obrázek 3-13):

	$ git checkout -b hotfix
	Switched to a new branch "hotfix"
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix]: created 3a0874c: "fixed the broken email address"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)

Obrázek 3-13. Větev „hotfix“ začleněná zpět v místě hlavní větve

Můžete provádět testování, ujistit se, že hotfix splňuje všechny požadavky, a pak můžete větev začlenit (merge) zpět do hlavní větve, aby byla připravena do produkce. Učiníte tak příkazem `git merge`:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast forward
	 README |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Při sloučení jste si možná všimli spojení „Fast forward“ (rychle vpřed). Jelikož revize, na niž ukazovala větev, do níž jste začleňovali, byla v přímé linii s revizí, na níž jste se nacházeli, Git přesunul ukazatel vpřed. Jinými slovy: pokud se pokoušíte sloučit jednu revizi s revizí druhou, k níž lze dospět následováním historie první revize, Git proces zjednoduší a přesune ukazatel vpřed, protože neexistuje žádná rozdílná práce, kterou by bylo třeba sloučit. Tomuto postupu se říká „rychle vpřed“.

Vaše změna je nyní obsažena ve snímku revize, na niž ukazuje hlavní větev `master`, a vy můžete pokračovat v provádění změn (viz obrázek 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)

Obrázek 3-14. Hlavní větev ukazuje po sloučení na stejné místo jako větev „hotfix“.

Poté, co jste dokončili práci na bezodkladné opravě, můžete přepnout zpět na práci, jíž jste se věnovali před telefonátem. Nejprve však smažete větev `hotfix`, kterou teď už nebudete potřebovat – větev `master` ukazuje na totéž místo. Větev smažete přidáním parametru `-d` k příkazu `git branch`:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Nyní můžete přepnout zpět na větev s rozdělanou prací a pokračovat na chybě č. 53 (viz obrázek 3-15):

	$ git checkout iss53
	Switched to branch "iss53"
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53]: created ad82d7a: "finished the new footer [issue 53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)

Obrázek 3-15. Větev iss53 může nezávisle postupovat vpřed.

Za zmínku stojí, že práce, kterou jste udělali ve větvi `hotfix`, není obsažena v souborech ve větvi `iss53`. Pokud potřebujete tyto změny do větve natáhnout, můžete začlenit větev `master` do větve `iss53` – použijte příkaz `git merge master`. Druhou možností je s integrací změn vyčkat a provést ji až ve chvíli, kdy budete chtít větev `iss53` natáhnout zpět do větve `master`.

## Základní slučování

Předpokládejme, že jste dokončili práci na chybě č. 53 a nyní byste ji rádi začlenili do větve `master`. Učiníte tak začleněním větve `iss53`, které bude probíhat velmi podobně jako předchozí začlenění větve `hotfix`. Jediné, co pro to musíte udělat, je přepnout na větev, do níž chcete tuto větev začlenit, a spustit příkaz `git merge`.

	$ git checkout master
	$ git merge iss53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Toto už se trochu liší od začlenění větve `hotfix`, které jste prováděli před chvílí. V tomto případě se historie vývoje od určitého bodu v minulosti rozbíhala. Vzhledem k tomu, že revize na větvi, na níž se nacházíte, není přímým předkem větve, kterou chcete začlenit, Git bude muset podniknout určité kroky. Git v tomto případě provádí jednoduché třícestné sloučení: vychází ze dvou snímků, na které ukazují větve, a jejich společného předka. Obrázek 3-16 označuje ony tři snímky, které Git v tomto případě použije ke sloučení.


![](http://git-scm.com/figures/18333fig0316-tn.png)

Obrázek 3-16. Git automaticky identifikuje nejvhodnějšího společného předka jako základnu pro sloučení větví.

Git tentokrát neposune ukazatel větve vpřed, ale vytvoří nový snímek jako výsledek tohoto třícestného sloučení a automaticky vytvoří novou revizi, která bude na snímek ukazovat (viz obrázek 3-17). Takové revizi se říká revize sloučením (merge commit) a její zvláštností je to, že má více než jednoho rodiče.

Na tomto místě bych chtěl zopakovat, že Git určuje nejvhodnějšího společného předka, který bude použit jako základna pro sloučení, automaticky. Liší se tím od systému CVS i Subversion (před verzí 1.5), kde musí vývojář při slučování najít nejvhodnější základnu pro sloučení sám. Slučování větví je tak v systému Git o poznání jednodušší než v těchto ostatních systémech.


![](http://git-scm.com/figures/18333fig0317-tn.png)

Obrázek 3-17. Git automaticky vytvoří nový objekt revize, který obsahuje sloučenou práci.

Nyní, když jste svou práci sloučili, větev `iss53` už nebudete potřebovat. Můžete ji smazat a poté ručně zavřít tiket v systému sledování tiketů:

	$ git branch -d iss53

## Základní konflikty při slučování

Může se stát, že sloučení neproběhne bez problémů. Pokud jste tutéž část jednoho souboru změnili odlišně ve dvou větvích, které chcete sloučit, Git je nebude umět sloučit čistě. Pokud se oprava chyby č. 53 týkala stejné části souboru jako větev `hotfix`, dojde ke konfliktu při slučování (merge conflict). Vypadá zhruba takto:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git nepřistoupil k automatickému vytvoření nové revize sloučením. Prozatím pozastavil celý proces do doby, než konflikt vyřešíte. Chcete-li kdykoli po konfliktu zjistit, které soubory zůstaly nesloučeny, spusťte příkaz `git status`:

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Vše, co při sloučení kolidovalo a nebylo vyřešeno, je označeno jako „unmerged“ (nesloučeno). Git přidává ke kolidujícím souborům standardní poznámky o řešení konfliktů (conflict-resolution markers), takže je můžete ručně otevřít a konflikty vyřešit. Jedna část vašeho souboru bude vypadat zhruba takto:

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53:index.html

To znamená, že verze ve větvi s ukazatelem HEAD (vaše hlavní větev – v té jste se nacházeli při provádění příkazu merge) je uvedena v horní části tohoto bloku (všechno nad oddělovačem `=======`), verze obsažená ve větvi `iss53` je vše, co se nachází v dolní části. Chcete-li vzniklý konflikt vyřešit, musíte buď vybrat jednu z obou stran, nebo konflikt sloučit sami. Tento konflikt můžete vyřešit například nahrazením celého bloku tímto textem:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

Toto řešení obsahuje trochu z každé části a zcela jsem odstranil řádky `<<<<<<<`, `=======` a `>>>>>>>`. Poté, co vyřešíte všechny tyto části ve všech kolidujících souborech, spusťte pro každý soubor příkaz `git add`, jímž ho označíte jako vyřešený. Připravení souboru k zápisu ho v systému Git označí jako vyřešený.
Chcete-li k vyřešení problémů použít grafický nástroj, můžete spustit příkaz `git mergetool`, kterým otevřete příslušný vizuální nástroj pro slučování, a ten vás všemi konflikty provede:

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

Chcete-li použít jiný než výchozí nástroj pro slučování (Git mi v tomto případě vybral `opendiff`, protože jsem příkaz zadal v systému Mac), všechny podporované nástroje jsou uvedeny na začátku výstupu v části „merge tool candidates“ (možné nástroje pro slučování). Zadejte název nástroje, který chcete použít. V kapitole 7 probereme, jak lze tuto výchozí hodnotu pro vaše prostředí změnit.

Až nástroj pro slučování zavřete, Git se vás zeptá, zda sloučení proběhlo úspěšně. Pokud skriptu oznámíte, že ano, připraví soubor k zapsání a tím ho označí jako vyřešený.

Ještě jednou můžete spustit příkaz `git status`, abyste si ověřili, že byly všechny konflikty vyřešeny:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

Pokud jste s výsledkem spokojeni a ujistili jste se, že všechny kolidující soubory jsou připraveny k zapsání, můžete zadat příkaz `git commit` a dokončit revizi sloučením. Zpráva revize má v takovém případě přednastavenu tuto podobu:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

Pokud myslíte, že to může být pro spolupracovníky, kteří si jednou budou toto sloučení prohlížet, užitečné, můžete tuto zprávu upravit a doplnit o podrobnosti, jak jste sloučení vyřešili – pokud to není zřejmé, můžete okomentovat, co jste udělali a proč právě takto.
