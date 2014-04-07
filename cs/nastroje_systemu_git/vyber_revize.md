# Výběr revize

Systém Git umožňuje určit jednotlivé revize nebo interval revizí několika způsoby. Není nezbytně nutné, abyste je všechny znali, ale mohou být užitečné.

## Jednotlivé revize

Revizi můžete samozřejmě specifikovat na základě otisku SHA-1, jenž jí byl přidělen. Existují však i uživatelsky příjemnější způsoby, jak označit konkrétní revizi. Tato část uvede několik různých způsobů, jak lze určit jednu konkrétní revizi.

## Zkrácená hodnota SHA

Git je dostatečně chytrý na to, aby pochopil, jakou revizi jste měli na mysli, zadáte-li pouze prvních několik znaků. Tento neúplný otisk SHA-1 musí mít alespoň čtyři znaky a musí být jednoznačný, tj. žádný další objekt v aktuálním repozitáři nesmí začínat stejnou zkrácenou hodnotou SHA-1.

Pokud si chcete například prohlédnout konkrétní revizi, řekněme, že spustíte příkaz `git log` a určíte revizi, do níž jste vložili určitou funkci:

	$ git log
	commit 734713bc047d87bf7eac9674765ae793478c50d3
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Jan 2 18:32:33 2009 -0800

	    fixed refs handling, added gc auto, updated tests

	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Merge: 1c002dd... 35cfb2b...
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

	commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 14:58:32 2008 -0800

	    added some blame and merge stuff

V tomto případě vyberte `1c002dd....`. Pokud chcete na revizi použít příkaz `git show`, budou všechny následující příkazy ekvivalentní (za předpokladu, že jsou zkrácené verze jednoznačné):

	$ git show 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	$ git show 1c002dd4b536e7479f
	$ git show 1c002d

Git dokáže identifikovat krátkou, jednoznačnou zkratku hodnoty SHA-1. Zadáte-li k příkazu `git log` parametr `--abbrev-commit`, výstup bude používat kratší hodnoty, ale pouze v jednoznačném tvaru. Standardně se používá sedm znaků, avšak je-li to kvůli jednoznačnosti hodnoty SHA-1 nezbytné, bude použito znaků více:

	$ git log --abbrev-commit --pretty=oneline
	ca82a6d changed the version number
	085bb3b removed unnecessary test code
	a11bef0 first commit

Osm až deset znaků většinou bohatě stačí, aby byla hodnota v rámci projektu jednoznačná. V jednom z největších projektů Git, v jádru Linuxu, začíná být nutné zadávat pro jednoznačné určení už 12 znaků z celkových 40 možných.

## Krátká poznámka k hodnotě SHA-1

Někteří uživatelé bývají zmateni, že mohou mít v repozitáři – shodou okolností – dva objekty, které mají stejnou hodnotu SHA-1 otisku. Co teď?

Pokud náhodou zapíšete objekt, který má stejnou hodnotu SHA-1 otisku jako předchozí objekt ve vašem repozitáři, Git už uvidí předchozí objekt v databázi Git a bude předpokládat, že už byl zapsán. Pokud se někdy v budoucnosti pokusíte znovu provést checkout tohoto objektu, vždy dostanete data prvního objektu.

Měli bychom však také říci, jak moc je nepravděpodobné, že taková situace nastane. Otisk SHA-1 má 20 bytů, neboli 160 bitů. Počet objektů s náhodným otiskem, které bychom potřebovali k 50% pravděpodobnosti, že nastane jediná kolize, je asi 2^80 (vzorec k určení pravděpodobnosti kolize je `p = (n(n-1)/2) * (1/2^160))`. 2^80 je 1,2 * 10^24, neboli 1 milion miliard miliard. To je 1200násobek počtu všech zrnek písku na celé Zemi.

Abyste si udělali představu, jak je nepravděpodobné, že dojde ke kolizi hodnot SHA-1, připojujeme jeden malý příklad. Kdyby 6,5 miliardy lidí na zemi programovalo a každý by každou sekundu vytvořil kód odpovídající celé historii linuxového jádra (1 milion objektů Git) a odesílal ho do jednoho obřího repozitáře Git, trvalo by 5 let, než by repozitář obsahoval dost objektů na to, aby existovala 50% pravděpodobnost, že dojde ke kolizi jediného objektu SHA-1. To už je pravděpodobnější, že všichni členové vašeho programovacího týmu budou během jedné noci v navzájem nesouvisejících incidentech napadeni a zabiti smečkou vlků.

## Reference větví

Nejčistší způsob, jak určit konkrétní revizi, vyžaduje, aby měla revize referenci větve, která na ni ukazuje. V takovém případě můžete použít název větve v libovolném příkazu Git, který vyžaduje objekt revize nebo hodnotu SHA-1. Pokud chcete například zobrazit objekt poslední revize větve, můžete využít některý z následujících příkazů (za předpokladu, že větev `topic1` ukazuje na `ca82a6d`):

	$ git show ca82a6dff817ec66f44342007202690a93763949
	$ git show topic1

Jestliže vás zajímá, na kterou konkrétní hodnotu SHA větev ukazuje, nebo chcete-li zjistit, jak bude některý z těchto příkladů vypadat v podobě SHA, můžete použít jeden z nízkoúrovňových nástrojů systému Git: `rev-parse`. Více o nízkoúrovňových nástrojích najdete v kapitole 9. Nástroj `rev-parse` se používá v podstatě pouze pro operace na nižších úrovních a není koncipován pro každodenní používání. Může se však hodit, až budete jednou potřebovat zjistit, co se doopravdy odehrává. Tehdy můžete na svou větev spustit příkaz `rev-parse`:

	$ git rev-parse topic1
	ca82a6dff817ec66f44342007202690a93763949

## Zkrácené názvy v záznamu RefLog

Jednou z věcí, které probíhají na pozadí systému Git, zatímco vy pracujete, je uchovávání záznamu reflog, v němž se ukládají pozice referencí HEAD a všech vašich větví za několik posledních měsíců.

Svůj reflog si můžete nechat zobrazit příkazem `git reflog`:

	$ git reflog
	734713b... HEAD@{0}: commit: fixed refs handling, added gc auto, updated
	d921970... HEAD@{1}: merge phedders/rdocs: Merge made by recursive.
	1c002dd... HEAD@{2}: commit: added some blame and merge stuff
	1c36188... HEAD@{3}: rebase -i (squash): updating HEAD
	95df984... HEAD@{4}: commit: # This is a combination of two commits.
	1c36188... HEAD@{5}: rebase -i (squash): updating HEAD
	7e05da5... HEAD@{6}: rebase -i (pick): updating HEAD

Pokaždé, když je z nějakého důvodu aktualizován vrchol větve, Git tuto informaci uloží v dočasné historii reflog. Pomocí těchto dat lze rovněž specifikovat starší revize. Chcete-li zobrazit pátou poslední hodnotu ukazatele HEAD svého repozitáře, použijte referenci `@{n}` z výstupu reflog:

	$ git show HEAD@{5}

Tuto syntaxi můžete použít také k zobrazení pozice, na níž se větev nacházela před určitou dobou. Chcete-li například zjistit, kde byla vaše větev `master` včera (yesterday), můžete zadat příkaz:

	$ git show master@{yesterday}

Git vám ukáže, kde se vrchol větve nacházel včera. Tato možnost funguje pouze pro data, jež jsou dosud v záznamu reflog. Nemůžete ji proto použít pro revize starší než několik měsíců.

Chcete-li zobrazit informace záznamu reflog ve formátu výstupu `git log`, zadejte příkaz `git log -g`:

	$ git log -g master
	commit 734713bc047d87bf7eac9674765ae793478c50d3
	Reflog: master@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: commit: fixed refs handling, added gc auto, updated
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Jan 2 18:32:33 2009 -0800

	    fixed refs handling, added gc auto, updated tests

	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Reflog: master@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: merge phedders/rdocs: Merge made by recursive.
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

Měli bychom také doplnit, že informace záznamu reflog jsou čistě lokální, vztahují se pouze na to, co jste provedli ve svém repozitáři. V kopii repozitáře na počítači kohokoli jiného se budou tyto reference lišit. Bezprostředně poté, co poprvé naklonujete repozitář, bude váš reflog prázdný, protože ve vašem repozitáři ještě nebyla provedena žádná operace. Příkaz `git show HEAD@{2.months.ago}` bude fungovat, pouze pokud jste projekt naklonovali minimálně před dvěma měsíci (tedy „2 months ago“). Pokud jste jej naklonovali před pěti minutami, neobdržíte žádný výsledek.

## Reference podle původu

Další základní způsob, jak specifikovat konkrétní revizi, je na základě jejího původu. Umístíte-li na konec reference znak `^`, Git bude referenci chápat tak, že označuje rodiče dané revize.
Můžete mít například takovouto historii projektu:

	$ git log --pretty=format:'%h %s' --graph
	* 734713b fixed refs handling, added gc auto, updated tests
	*   d921970 Merge commit 'phedders/rdocs'
	|\
	| * 35cfb2b Some rdoc changes
	* | 1c002dd added some blame and merge stuff
	|/
	* 1c36188 ignore *.gem
	* 9b29157 add open3_detach to gemspec file list

Zobrazit předchozí revizi pak můžete pomocí `HEAD^`, což doslova znamená „rodič revize HEAD“:

	$ git show HEAD^
	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Merge: 1c002dd... 35cfb2b...
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

Za znakem `^` můžete zadat také číslo, např. `d921970^2` označuje „druhého rodiče revize d921970“. Tato syntaxe má význam pouze u revizí vzniklých sloučením, které mají více než jednoho rodiče. První rodič je větev, na níž jste se během začlenění nacházeli, druhým rodičem je větev, kterou jste začleňovali:

	$ git show d921970^
	commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 14:58:32 2008 -0800

	    added some blame and merge stuff

	$ git show d921970^2
	commit 35cfb2b795a55793d7cc56a6cc2060b4bb732548
	Author: Paul Hedderly <paul+git@mjr.org>
	Date:   Wed Dec 10 22:22:03 2008 +0000

	    Some rdoc changes

Další základní možností označení původu je znak `~`. Také tento znak označuje prvního rodiče, výrazy `HEAD~` a `HEAD^` jsou proto ekvivalentní. Rozdíl mezi nimi je patrný při zadání čísla. `HEAD~2` označuje „prvního rodiče prvního rodiče“, tedy „prarodiče“. Příkaz překročí prvního rodiče tolikrát, kolikrát udává číselná hodnota. Například v historii naznačené výše by `HEAD~3` znamenalo:

	$ git show HEAD~3
	commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
	Author: Tom Preston-Werner <tom@mojombo.com>
	Date:   Fri Nov 7 13:47:59 2008 -0500

	    ignore *.gem

Totéž by bylo možné označit výrazem `HEAD^^^`, který opět udává prvního rodiče prvního rodiče prvního rodiče:

	$ git show HEAD^^^
	commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
	Author: Tom Preston-Werner <tom@mojombo.com>
	Date:   Fri Nov 7 13:47:59 2008 -0500

	    ignore *.gem

Tyto syntaxe můžete také kombinovat. Druhého rodiče předchozí reference (jestliže se jednalo o revizi sloučením) lze získat výrazem `HEAD~3^2` atd.

## Intervaly revizí

Nyní, když umíte určit jednotlivé revize, podíváme se, jak lze určovat celé intervaly revizí. To využijete zejména při správě větví. Máte-li větší množství větví, pomůže vám označení intervalu revizí dohledat odpovědi na otázky typu: „Jaká práce je obsažena v této větvi, kterou jsem ještě nezačlenil do hlavní větve?“

### Dvě tečky

Nejčastěji se při označení intervalu používá dvojtečková syntaxe. Pomocí ní systému Git v podstatě říkáte, aby uvažoval celý interval revizí, které jsou dostupné z jedné revize, ale nejsou dostupné z jiné. Předpokládejme tedy, že máte historii revizí jako na obrázku 6-1.


![](http://git-scm.com/figures/18333fig0601-tn.png)

Obrázek 6-1. Příklad historie revizí pro výběr intervalu

Vy chcete vidět, co všechno obsahuje vaše experimentální větev, kterou jste ještě nezačlenili do hlavní větve. Pomocí výrazu `master..experiment` můžete systému Git zadat příkaz, aby vám zobrazil log právě s těmito revizemi, doslova „všemi revizemi dostupnými z větve experiment a nedostupnými z hlavní větve“. V zájmu stručnosti a názornosti použiji v těchto příkladech místo skutečného výstupu logu písmena objektů revizí z diagramu v pořadí, jak by se zobrazily:

	$ git log master..experiment
	D
	C

A samozřejmě si můžete nechat zobrazit i pravý opak, všechny revize ve větvi `master`, které nejsou ve větvi `experiment`. K tomu stačí obrátit pořadí názvů větví v příkazu. Výraz `experiment..master` zobrazí vše ve větvi `master`, co není dostupné ve větvi `experiment`:

	$ git log experiment..master
	F
	E

Tento log využijete, pokud chcete udržovat větev `experiment` stále aktuální a zjistit, co hodláte začlenit. Tato syntaxe se velmi často používá také ke zjištění, co hodláte odeslat do vzdálené větve:

	$ git log origin/master..HEAD

Tento příkaz zobrazí všechny revize ve vaší aktuální větvi, které nejsou obsaženy ve větvi `master` vzdáleného repozitáře `origin`. Spustíte-li příkaz `git push` a vaše aktuální větev sleduje větev `origin/master`, budou na server přesunuty revize, které lze zobrazit příkazem `git log origin/master..HEAD`.
Jednu stranu intervalu můžete zcela vynechat, Git na její místo automaticky dosadí HEAD. Stejné výsledky jako v předchozím příkladu dostanete zadáním příkazu `git log origin/master..` – Git dosadí na prázdnou stranu výraz HEAD.

### Několik bodů

Dvojtečková syntaxe je užitečná jako zkrácený výraz. Možná ale budete chtít k označení revize určit více než dvě větve, např. až budete chtít zjistit, které revize jsou obsaženy ve všech ostatních větvích a zároveň nejsou obsaženy ve větvi, na níž se právě nacházíte. V systému Git to můžete provést buď zadáním znaku `^` nebo parametru `--not` před referencí, jejíž dostupné revize si nepřejete zobrazit. Tyto tři příkazy jsou tedy ekvivalentní:

	$ git log refA..refB
	$ git log ^refA refB
	$ git log refB --not refA

Tato syntaxe je užitečná zejména proto, že pomocí ní můžete zadat více než dvě reference, což není pomocí dvojtečkové syntaxe možné. Pokud chcete zobrazit například všechny revize, které jsou dostupné ve větvi `refA` nebo `refB`, ale nikoli ve větvi `refC`, zadejte jeden z následujících příkazů:

	$ git log refA refB ^refC
	$ git log refA refB --not refC

Tím máte v rukou velmi efektivní systém vyhledávání revizí, který vám pomůže zjistit, co vaše větve obsahují.

### Tři tečky

Poslední významnou syntaxí k určení intervalu je trojtečková syntaxe, která vybere všechny revize dostupné ve dvou referencích, ale ne v obou zároveň. Podívejme se ještě jednou na příklad historie revizí na obrázku 6-1.
Chcete-li zjistit, co je ve větvi `master` nebo `experiment`, ale nechcete vidět jejich společné reference, zadejte příkaz:

	$ git log master...experiment
	F
	E
	D
	C

Výstupem příkazu bude běžný výpis příkazu `log`, ale zobrazí se pouze informace o těchto čtyřech revizích, uspořádané v tradičním pořadí podle data zapsání.

Přepínačem, který se v tomto případě běžně používá v kombinaci s příkazem `log`, je parametr `--left-right`. Příkaz pak zobrazí, na jaké straně intervalu se ta která revize nachází. Díky tomu získáte k datům další užitečné informace:

	$ git log --left-right master...experiment
	< F
	< E
	> D
	> C

Pomocí těchto nástrojů můžete v systému Git daleko snáze specifikovat, kterou revizi nebo které revize chcete zobrazit.
