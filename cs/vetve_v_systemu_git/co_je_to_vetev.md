# Co je to větev

Abychom skutečně pochopili, jak funguje v systému Git větvení, budeme se muset vrátit o krok zpět a podívat se, jak Git ukládá data. Jak si možná vzpomínáte z kapitoly 1, Git neukládá data jako sérii změn nebo rozdílů, ale jako sérii snímků.

Zapíšete-li v systému Git revizi, Git uloží objekt revize, obsahující ukazatel na snímek obsahu, který jste určili k zapsání, metadata o autorovi a zprávě a nula nebo více ukazatelů na revizi nebo revize, které byly přímými rodiči této revize – žádné rodiče nemá první revize, jednoho rodiče má běžná revize a několik rodičů mají revize, které vznikly sloučením ze dvou či více větví.

Pro ilustraci předpokládejme, že máte adresář se třemi soubory, které připravíte k zapsání a následně zapíšete. S připravením souborů k zapsání proběhne u každého z nich kontrolní součet (o otisku SHA-1 jsme se zmínili v kapitole 1), daná verze souborů se uloží v repozitáři Git (Git na ně odkazuje jako na bloby) a přidá jejich kontrolní součet do oblasti připravených změn:

	$ git add README test.rb LICENSE
	$ git commit -m 'initial commit of my project'

Vytvoříte-li revizi příkazem `git commit`, provede Git kontrolní součet každého adresáře (v tomto případě pouze kořenového adresáře projektu) a uloží tyto objekty stromu v repozitáři Git. Poté vytvoří objekt revize s metadaty a ukazatelem na kořenový strom projektu, aby mohl v případě potřeby tento snímek obnovit.

Váš repozitář Git nyní obsahuje pět objektů: jeden blob pro obsah každého ze tří vašich souborů, jeden strom, který zaznamenává obsah adresáře a udává, které názvy souborů jsou uloženy jako který blob, a jednu revizi s ukazatelem na kořenový strom a se všemi metadaty revize. Data ve vašem repozitáři Git se dají schematicky znázornit jako na obrázku 3-1.


![](http://git-scm.com/figures/18333fig0301-tn.png)

Obrázek 3-1. Repozitář s daty jedné revize

Jestliže v souborech provedete změny a zapíšete je, další revize uloží ukazatel na revizi, jež jí bezprostředně předcházela. Po dalších dvou revizích bude vaše historie vypadat jako na obrázku 3-2.


![](http://git-scm.com/figures/18333fig0302-tn.png)

Obrázek 3-2. Data objektů Git pro několik revizí

Větev je v systému Git jen snadno přemístitelným ukazatelem na jednu z těchto revizí. Výchozím názvem větve v systému Git je `master` (hlavní větev). Při prvním zapisování revizí dostanete hlavní větev, jež bude ukazovat na poslední revizi, kterou jste zapsali. Pokaždé, když zapíšete novou revizi, větev se automaticky posune vpřed.


![](http://git-scm.com/figures/18333fig0303-tn.png)

Obrázek 3-3. Větev ukazující do historie dat revizí

Co se stane, když vytvoříte novou větev? Ano, nová větev znamená vytvoření nového ukazatele, s nímž můžete pohybovat. Řekněme, že vytvoříte novou větev a nazvete ji testing. Učiníte tak příkazem `git branch`:

	$ git branch testing

Tento příkaz vytvoří nový ukazatel na stejné revizi, na níž se právě nacházíte (viz obrázek 3-4).


![](http://git-scm.com/figures/18333fig0304-tn.png)

Obrázek 3-4. Několik větví ukazujících do historie dat revizí

Jak Git pozná, na jaké větvi se právě nacházíte? Používá speciální ukazatel zvaný HEAD. Nenechte se mást, tento HEAD je velmi odlišný od všech koncepcí v ostatních systémech VCS, na něž jste možná zvyklí, jako Subversion nebo CVS. V systému Git se jedná o ukazatel na lokální větev, na níž se právě nacházíte. V našem případě jste však stále ještě na hlavní větvi. Příkazem git branch jste pouze vytvořili novou větev, zatím jste na ni nepřepnuli (viz obrázek 3-5).


![](http://git-scm.com/figures/18333fig0305-tn.png)

Obrázek 3-5. Soubor HEAD ukazující na větev, na níž se nacházíte.

Chcete-li přepnout na existující větev, spusťte příkaz `git checkout`. My můžeme přepnout na novou větev testing:

	$ git checkout testing

Tímto příkazem přesunete ukazatel HEAD tak, že ukazuje na větev testing (viz obrázek 3-6).


![](http://git-scm.com/figures/18333fig0306-tn.png)

Obrázek 3-6. Soubor HEAD ukazuje po přepnutí na jinou větev.

A jaký to má smysl? Dobře, proveďme další revizi:

	$ vim test.rb
	$ git commit -a -m 'made a change'

Obrázek 3-7 ukazuje výsledek.


![](http://git-scm.com/figures/18333fig0307-tn.png)

Obrázek 3-7. Větev, na niž ukazuje soubor HEAD, se posouvá vpřed s každou revizí.

Výsledek je zajímavý z toho důvodu, že se větev `testing` posunula vpřed, zatímco větev `master` stále ukazuje na revizi, na níž jste se nacházeli v okamžiku, kdy jste spustili příkaz `git checkout` a přepnuli tím větve. Přepněme zpět na větev `master`.

	$ git checkout master

Výsledek ukazuje obrázek 3-8.


![](http://git-scm.com/figures/18333fig0308-tn.png)

Obrázek 3-8. Ukazatel HEAD se po příkazu git checkout přesune na jinou větev.

Tento příkaz provedl dvě věci. Přemístil ukazatel `HEAD` zpět, takže nyní ukazuje na větev `master`, a vrátil soubory ve vašem pracovním adresáři zpět ke snímku, na nějž větev `master` ukazuje. To také znamená, že změny, které od teď provedete, se odštěpí od starší verze projektu. V podstatě dočasně vrátíte všechny změny, které jste provedli ve větvi testing, a vydáte se jiným směrem.

Proveďme pár změn a zapišme další revizi:

	$ vim test.rb
	$ git commit -a -m 'made other changes'

Nyní se historie vašeho projektu rozdělila (viz obrázek 3-9). Vytvořili jste novou větev, přepnuli jste na ni, provedli jste v ní změny a poté jste přepnuli zpět na hlavní větev, v níž jste rovněž provedli změny. Oboje tyto změny jsou oddělené na samostatných větvích. Můžete mezi nimi přepínat tam a zpět, a až uznáte za vhodné, můžete je sloučit. To vše jste provedli pomocí jednoduchých příkazů `branch` a `checkout`.


![](http://git-scm.com/figures/18333fig0309-tn.png)

Obrázek 3-9. Historie větví se rozdělila.

Vzhledem k tomu, že větev v systému Git tvoří jeden jednoduchý soubor, obsahující 40 znaků kontrolního součtu SHA-1 revize, na niž ukazuje, je snadné větve vytvářet i odstraňovat. Vytvořit novou větev je právě tak snadné a rychlé jako zapsat 41 bytů do souboru (40 znaků a jeden nový řádek).

Tato metoda se výrazně liší od způsobu, jakým probíhá větvení v ostatních nástrojích VCS, kde je nutné zkopírovat všechny soubory projektu do jiného adresáře. To může zabrat – podle velikosti projektu – několik sekund i minut, zatímco v systému Git probíhá tento proces vždy okamžitě. A protože při zapisování revize zaznamenáváme její rodiče, probíhá vyhledávání příslušné základny pro sloučení automaticky a je většinou velmi snadné. Tyto funkce slouží k tomu, aby se vývojáři nebáli vytvářet a používat nové větve.

Podívejme se, jaké výhody jim z toho plynou.
