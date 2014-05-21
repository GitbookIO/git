# Tipy a triky

Než ukončíme tuto kapitolu o základech práce se systémem Git, přidáme ještě pár tipů a triků, které vám mohou usnadnit či zpříjemnit práci. Mnoho uživatelů pracuje se systémem Git, aniž by tyto triky znali a používali. V dalších částech knihy se už o nich nebudeme zmiňovat ani nebudeme předpokládat, že je používáte. Přesto pro vás mohou být užitečné.

## Automatické dokončování

Jestliže používáte shell Bash, nabízí vám Git možnost zapnout si skript automatického dokončování. Stáhněte si zdrojový kód Git a podívejte se do adresáře `contrib/completion`. Měli byste tam najít soubor s názvem `git-completion.bash`. Zkopírujte tento soubor do svého domovského adresáře a přidejte ho do souboru `.bashrc`:

	source ~/.git-completion.bash

Chcete-li nastavit Git tak, aby měl automaticky dokončování pro shell Bash pro všechny uživatele, zkopírujte tento skript do adresáře `/opt/local/etc/bash_completion.d` v systémech Mac nebo do adresáře `/etc/bash_completion.d/` v systémech Linux. Toto je adresář skriptů, z nějž Bash automaticky načítá pro shellové dokončování.

Pokud používáte Git Bash v systému Windows (Git Bash je výchozím programem při instalaci systému Git v OS Windows pomocí msysGit), mělo by být automatické dokončování přednastaveno.

Při zadávání příkazu Git stiskněte klávesu Tab a měla by se objevit nabídka, z níž můžete zvolit příslušné dokončení:

	$ git co<tab><tab>
	commit config

Pokud zadáte – stejně jako v našem příkladu nahoře – `git co` a dvakrát stisknete klávesu Tab, systém vám navrhne „commit“ a „config“. Doplníte-li ještě `m<tab>`, skript automaticky dokončí příkaz na `git commit`.

Automatické dokončování pravděpodobně více využijete v případě parametrů. Pokud například zadáváte příkaz `git log` a nemůžete si vzpomenout na některý z parametrů, můžete zadat jeho začátek a stisknout klávesu Tab, aby vám systém navrhl možná dokončení.

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Jedná se o užitečný trik, který vám může ušetřit čas a pročítání dokumentace.

## Aliasy Git

Jestliže zadáte systému Git neúplný příkaz, systém ho neakceptuje. Pokud nechcete zadávat celý text příkazů Git, můžete pomocí `git config` jednoduše nastavit pro každý příkaz tzv. alias. Uveďme několik příkladů možného nastavení:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

To znamená, že například místo kompletního příkazu `git commit` stačí zadat pouze zkrácené `git ci`. Budete-li pracovat v systému Git častěji, pravděpodobně budete hojně využívat i jiné příkazy. V takovém případě neváhejte a vytvořte si nové aliasy.

Tato metoda může být velmi užitečná také k vytváření příkazů, které by podle vás měly existovat. Pokud jste například narazili na problém s používáním příkazu pro vrácení souboru z oblasti připravených změn, můžete ho vyřešit zadáním vlastního aliasu:

	$ git config --global alias.unstage 'reset HEAD --'

Po zadání takového příkazu budete mít k dispozici dva ekvivalentní příkazy:

	$ git unstage fileA
	$ git reset HEAD fileA

Příkaz unstage je o něco jasnější. Běžně se také přidává příkaz `last`:

	$ git config --global alias.last 'log -1 HEAD'

Tímto způsobem snadno zobrazíte poslední revizi:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Chtělo by se tedy říci, že Git jednoduše nahradí nový příkaz jakýmkoli aliasem, který vytvoříte. Může se však stát, že budete chtít spustit externí příkaz, a ne dílčí příkaz Git. V takovém případě zadejte na začátek příkazu znak `!`. Tuto možnost využijete, pokud si píšete své vlastní nástroje, které fungují s repozitářem Git. Jako příklad můžeme uvést situaci, kdy nahradíte příkaz `git visual` aliasem `gitk`:

	$ git config --global alias.visual '!gitk'
