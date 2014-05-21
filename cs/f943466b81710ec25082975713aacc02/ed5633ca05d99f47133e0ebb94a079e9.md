# Přepis historie

Při práci se systémem Git možná budete z nějakého důvodu čas od času potřebovat poopravit historii revizí. Jednou ze skvělých možností, které vám Git nabízí, jsou rozhodnutí na poslední chvíli. Jaké soubory budou součástí jaké revize? To můžete rozhodnout až těsně před tím, než soubory zapíšete z oblasti připravených změn. Můžete se rozmyslet, že jste na něčem ještě nechtěli pracovat, a použít možnost odložení. A stejně tak můžete přepsat už jednou zapsané revize. Budou vypadat, jako by byly zapsány v jiné podobě. K této možnosti patří změna pořadí revizí, změny ve zprávách nebo úprava souborů v revizích, komprimace i dělení revizí nebo třeba jejich úplné odstranění. Všechno toto můžete provést, dokud nezačnete sdílet revize s ostatními.

V této části se dozvíte, jak se tyto velmi užitečné úkony provádějí, abyste mohli svou historii revizí před zveřejněním upravit podle svých představ.

## Změna poslední revize

Změna poslední revize je pravděpodobně nejobvyklejším způsobem přepsání historie, který budete provádět. Na poslední revizi budete často chtít měnit dvě věci: zprávu k revizi nebo čerstvě zapsaný snímek, v němž budete chtít přidat, změnit nebo odstranit soubory.

Chcete-li pouze změnit zprávu k poslední revizi, je to velmi jednoduché:

	$ git commit --amend

Tím se přesunete do textového editoru, v němž bude otevřena vaše poslední zpráva k revizi. Nyní ji můžete upravit. Po uložení změn a zavření editoru zapíše editor novou revizi, která bude obsahovat upravenou zprávu a která bude vaší novou poslední revizí.

Pokud jste zapsali revizi a uvědomíte si, že jste např. zapomněli přidat nově vytvořený soubor, a proto byste chtěli zapsaný snímek změnit (tedy přidat nebo změnit soubory), je postup ke změně v podstatě stejný. Změny, které chcete zapsat, připravíte tím způsobem, že upravíte příslušné soubory a použijete na ně příkaz `git add`, resp. `git rm`. Příkaz `git commit --amend` poté vezme vaši oblast připravených změn v aktuální podobě a vytvoří snímek nové revize.

Tady byste měli být opatrní, protože oprava revize změní také její hodnotu SHA-1. Je to něco jako malé přeskládání – neopravujte poslední revizi, pokud jste ji už odeslali.

## Změna několika zpráv k revizím

Chcete-li změnit revizi, která leží hlouběji ve vaší historii, budete muset sáhnout po složitějších nástrojích. Git nemá zvláštní nástroj k úpravě historie, ale můžete využít nástroje přeskládání, jímž přeskládáte sérii revizí na revizi HEAD, na níž se původně zakládaly. Revize není třeba přesouvat jinam. S interaktivním nástrojem přeskládání pak můžete zastavit po každé revizi, kterou chcete upravit, a změnit u ní zprávu, přidat soubory nebo cokoli dalšího. Interaktivní režim přeskládání spustíte příkazem `git rebase` s parametrem `-i`. Musíte specifikovat, jak hluboko do historie se chcete vrátit a přepisovat revize. K příkazu proto musíte zadat, na jakou revizi si přejete přeskládání provést.

Pokud chcete například změnit zprávy u posledních tří revizí nebo jakoukoli zprávu k revizi z této skupiny, přidejte jako parametr k příkazu `git rebase -i` rodiče poslední revize, kterou chcete upravovat, v tomto případě tedy `HEAD~2^` nebo `HEAD~3`. Snazší k zapamatování je varianta s výrazem `~3`, neboť se pokoušíte upravit poslední tři revize. Nezapomeňte ale, že tím ve skutečnosti označujete čtvrtou revizi od konce, tedy rodiče poslední revize, kterou chcete upravit:

	$ git rebase -i HEAD~3

Mějte na paměti, že se stále jedná o příkaz přeskládání a každá revize zahrnutá v intervalu `HEAD~3..HEAD` bude přepsána, ať už její zprávu změníte, nebo ponecháte. Neměňte tímto způsobem žádné revize, které už jste odeslali na centrální server, způsobili byste tím problémy ostatním vývojářům, kteří by se museli potýkat s jinou verzí téže změny.

Spuštěním tohoto příkazu otevřete textový editor se seznamem revizí zhruba v této podobě:

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

	# Rebase 710f0f8..a5f4a0d onto 710f0f8
	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Tady bychom chtěli upozornit, že revize jsou uvedeny v opačném pořadí, než jste zvyklí v případě příkazu `log`. Po spuštění příkazu `log` by se zobrazilo následující:

	$ git log --pretty=format:"%h %s" HEAD~3..HEAD
	a5f4a0d added cat-file
	310154e updated README formatting and added blame
	f7f3f6d changed my name a bit

Všimněte si, že se pořadí obrátilo. V interaktivním režimu přeskládání se nyní spustí skript. Začne na revizi, kterou jste označili na příkazovém řádku (`HEAD~3`), a přehraje změny provedené v každé z těchto revizí od shora dolů. Seznam uvádí nejstarší revizi nahoře z toho důvodu, že to bude první revize, kterou příkaz přehraje.

Skript je třeba upravit tak, aby zastavil na revizi, v níž chcete provést změny. Změňte proto slovo pick na edit pro každou z revizí, po níž má skript zastavit. Chcete-li například změnit pouze zprávu ke třetí revizi, změňte soubor následovně:

	edit f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Po uložení změn a zavření editoru vás Git vrátí zpět na poslední revizi v seznamu a zobrazí vám příkazový řádek s touto zprávou:

	$ git rebase -i HEAD~3
	Stopped at 7482e0d... updated the gemspec to hopefully work better
	You can amend the commit now, with

	       git commit --amend

	Once you’re satisfied with your changes, run

	       git rebase --continue

Tyto instrukce vám sdělují, že nyní můžete upravit revizi příkazem git commit --amend, a až budete se změnami hotovi, spustit příkaz git rebase --continue. Zadejme tedy:

	$ git commit --amend

Změňte zprávu k revizi a zavřete textový editor. Poté spusťte příkaz:

	$ git rebase --continue

Tento příkaz automaticky aplikuje zbývající dvě revize. Tím je celý proces dokončen. Změníte-li výraz pick na edit na více řádcích, můžete tyto kroky opakovat pro každou revizi, u níž jste změnu provedli. Git pokaždé zastaví, nechá vás revizi upravit, a až budete hotovi, bude pokračovat.

## Změna pořadí revizí

Interaktivní přeskládání můžete použít rovněž ke změně pořadí revizí nebo k jejich odstranění. Budete-li chtít odstranit revizi „added cat-file“ a současně změnit pořadí, v němž se vyskytují zbývající dvě revize, změňte skript přeskládání z podoby:

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

na:

	pick 310154e updated README formatting and added blame
	pick f7f3f6d changed my name a bit

Jakmile uložíte změny a zavřete editor, Git vrátí vaši větev zpět na rodiče těchto revizí, aplikuje revizi `310154e`, po ní revizi `f7f3f6d` a zastaví. Jednoduše jste změnili pořadí těchto revizí a zároveň jste zcela odstranili revizi „added cat-file“.

## Komprimace revize

Další možností, jak lze využít interaktivního nástroje přeskládání, je komprimace série revizí do jediné revize. Skript vám ve zprávě k přeskládání podává užitečné instrukce:

	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Zadáte-li místo pick nebo edit instrukci pro komprimaci squash, Git aplikuje změnu na tomto řádku a změnu těsně před ní a zároveň sloučí dohromady obě zprávy k revizím. Chcete-li tedy vytvořit jedinou revizi z těchto tří revizí, bude skript vypadat takto:

	pick f7f3f6d changed my name a bit
	squash 310154e updated README formatting and added blame
	squash a5f4a0d added cat-file

Po uložení změn a zavření editoru aplikuje Git všechny tři změny a znovu otevře textový editor, abyste sloučili všechny zprávy k revizím:

	# This is a combination of 3 commits.
	# The first commit's message is:
	changed my name a bit

	# This is the 2nd commit message:

	updated README formatting and added blame

	# This is the 3rd commit message:

	added cat-file

Po uložení zprávy budete mít jedinou revizi, která bude obsahovat všechny změny předchozích tří revizí.

## Rozdělení revize

Rozdělení revize vrátí všechny změny v revizi obsažené a po částech je znovu připraví a zapíše do tolika revizí, kolik určíte jako konečný počet. Řekněme, že chcete rozdělit třeba prostřední ze svých tří revizí. Revizi „updated README formatting and added blame“ chcete rozdělit do dvou jiných: „updated README formatting“ jako první a „added blame“ jako druhou. Můžete to provést pomocí skriptu `rebase -i`. U revize, kterou si přejete rozdělit, změňte instrukci na edit:

	pick f7f3f6d changed my name a bit
	edit 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Až vás poté skript přesune na příkazový řádek, resetujete revizi, vezmete změny, které jste resetovali, a vytvoříte z nich několik dílčích revizí. Až uložíte změny a zavřete editor, Git se vrátí na rodiče první revize ve vašem seznamu, aplikuje první revizi (`f7f3f6d`), aplikuje druhou revizi (`310154e`) a přesune vás na konzoli. Tam můžete vytvořit smíšený reset této revize pomocí příkazu `git reset HEAD^`, který efektivně vrátí všechny změny v revizi a ponechá změněné soubory nepřipraveny k zapsání. Nyní můžete připravit a zapsat soubory. Až budete mít jednotlivé revize hotové a budete spokojeni s jejich podobou, zadejte příkaz `git rebase --continue`:

	$ git reset HEAD^
	$ git add README
	$ git commit -m 'updated README formatting'
	$ git add lib/simplegit.rb
	$ git commit -m 'added blame'
	$ git rebase --continue

Git aplikuje poslední revizi (`a5f4a0d`) ve skriptu. Vaše historie bude vypadat takto:

	$ git log -4 --pretty=format:"%h %s"
	1c002dd added cat-file
	9b29157 added blame
	35cfb2b updated README formatting
	f3cc40e changed my name a bit

Také v tomto případě se změní hodnoty SHA všech revizí v seznamu, a proto se nejprve ujistěte, že seznam neobsahuje žádné revize, které jste už odeslali do sdíleného repozitáře.

## Pitbul mezi příkazy: filter-branch

Existuje ještě další možnost přepisu historie, kterou vám Git nabízí pro případy, kdy potřebujete skriptovatelným způsobem přepsat větší počet revizí, např. globálně změnit e-mailovou adresu nebo odstranit jeden soubor ze všech revizí. Příkaz pro tento případ je `filter-branch`. Dokáže přepsat velké části vaší historie, a proto byste ho určitě neměli používat, pokud už byl váš projekt zveřejněn a ostatní uživatelé už založili svou práci na revizích, které hodláte přepsat. Příkaz přesto může být velmi užitečný. Dále poznáte několik běžných situací, v nichž ho lze použít, a získáte tak představu, co všechno příkaz dovede.

### Odstranění souboru ze všech revizí

Toto je opravdu velmi častá situace. Někdo příkazem `git add .` bezmyšlenkovitě zapsal obří binární soubor a vy ho chcete odstranit ze všech revizí. Nebo jste omylem zapsali soubor obsahující vaše heslo, ale chcete, aby byl váš projekt veřejný. Nástrojem, který hledáte k opravení celé historie, je `filter-branch`. Pro odstranění souboru s názvem passwords.txt z celé historie můžete použít parametr `--tree-filter`, který přidáte k příkazu `filter-branch`:

	$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
	Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
	Ref 'refs/heads/master' was rewritten

Parametr `--tree-filter` spustí zadaný příkaz po každém checkoutu projektu a znovu zapíše jeho výsledky. V tomto případě odstraníte soubor s názvem passwords.txt ze všech snímků, ať v nich existuje, nebo neexistuje. Chcete-li odstranit všechny nedopatřením zapsané záložní soubory editoru, můžete spustit zhruba toto: `git filter-branch --tree-filter "rm -f *~" HEAD`.

Uvidíte, jak Git přepisuje stromy a revize a poté přemístí ukazatel větve na konec. Většinou se vyplatí provádět toto všechno v testovací větvi a k tvrdému resetu hlavní větve přistoupit až poté, co se ujistíte, že výsledek odpovídá vašim očekáváním. Chcete-li spustit příkaz `filter-branch` na všech větvích, zadejte k příkazu parametr `--all`.

### Povýšení podadresáře na nový kořenový adresář

Předpokládejme, že jste dokončili import z jiného systému ke správě zdrojového kódu a máte podadresáře, které nedávají žádný smysl (trunk, tags apod.). Chcete-li udělat z podadresáře `trunk` nový kořenový adresář projektu pro všechny revize, i s tím vám pomůže příkaz `filter-branch`:

	$ git filter-branch --subdirectory-filter trunk HEAD
	Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
	Ref 'refs/heads/master' was rewritten

Vaším nový kořenovým adresářem je nyní obsah podadresáře `trunk`. Git také automaticky odstraní revize, které nemají na podadresář žádný vliv.

### Globální změna e-mailové adresy

Dalším častým případem bývá, že uživatel zapomene spustit příkaz `git config` a nastavit své jméno a e-mailovou adresu, než začne se systémem Git pracovat. Stejně tak se může stát, že budete chtít převést pracovní projekt na otevřený zdrojový kód a změnit všechny své pracovní e-mailové adresy na soukromé. V obou těchto případech můžete změnit e-mailové adresy v několika revizích hromadně příkazem `filter-branch`. Měli byste být opatrní, abyste změnili jen e-mailové adresy, které jsou opravdu vaše. Použijte proto parametr `--commit-filter`:

	$ git filter-branch --commit-filter '
	        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
	        then
	                GIT_AUTHOR_NAME="Scott Chacon";
	                GIT_AUTHOR_EMAIL="schacon@example.com";
	                git commit-tree "$@";
	        else
	                git commit-tree "$@";
	        fi' HEAD

Příkaz projde a přepíše všechny revize tak, aby obsahovaly novou adresu. Protože revize obsahují hodnoty SHA-1 svých rodičů, změní tento příkaz SHA všech revizí ve vaší historii, ne pouze těch, které mají odpovídající e-mailovou adresu.
