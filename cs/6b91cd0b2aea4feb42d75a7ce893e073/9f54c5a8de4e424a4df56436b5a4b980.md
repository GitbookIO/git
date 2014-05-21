# Práce se vzdálenými repozitáři

Abyste mohli spolupracovat na projektech v systému Git, je třeba vědět, jak manipulovat se vzdálenými repozitáři (remote repositories). Vzdálené repozitáře jsou verze vašeho projektu umístěné na internetu nebo kdekoli v síti. Vzdálených repozitářů můžete mít hned několik, každý pro vás přitom bude buď pouze ke čtení (read-only) nebo ke čtení a zápisu (read write). Spolupráce s ostatními uživateli zahrnuje také manipulaci s těmito vzdálenými repozitáři. Chcete-li svou práci sdílet, je nutné ji posílat do repozitářů a také ji z nich stahovat.
Při manipulaci se vzdálenými repozitáři je nutné vědět, jak lze přidat vzdálený repozitář, jak odstranit repozitář, který už není platný, jak spravovat různé vzdálené větve, jak je definovat jako sledované či nesledované apod. V této části se zaměříme právě na správu vzdálených repozitářů.

## Zobrazení vzdálených serverů

Chcete-li zjistit, jaké vzdálené servery máte nakonfigurovány, můžete použít příkaz `git remote`. Systém vypíše zkrácené názvy všech identifikátorů vzdálených repozitářů, jež máte zadány. Pokud byl váš repozitář vytvořen klonováním, měli byste vidět přinejmenším server origin. Origin je výchozí název, který Git dává serveru, z nějž jste repozitář klonovali.

	$ git clone git://github.com/schacon/ticgit.git
	Initialized empty Git repository in /private/tmp/ticgit/.git/
	remote: Counting objects: 595, done.
	remote: Compressing objects: 100% (269/269), done.
	remote: Total 595 (delta 255), reused 589 (delta 253)
	Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
	Resolving deltas: 100% (255/255), done.
	$ cd ticgit
	$ git remote
	origin

Můžete rovněž zadat parametr `-v`, jenž zobrazí adresu URL, kterou má Git uloženou pro zkrácený název, který si přejete rozepsat.

	$ git remote -v
	origin  git://github.com/schacon/ticgit.git (fetch)
	origin  git://github.com/schacon/ticgit.git (push)

Pokud máte více než jeden vzdálený repozitář, příkaz je vypíše všechny. Například můj repozitář Grit vypadá takto:

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

To znamená, že můžeme velmi snadno stáhnout příspěvky od kteréhokoli z těchto uživatelů. Nezapomeňte však, že pouze vzdálený server origin je SSH URL, a je tedy jediným repozitářem, kam lze posílat soubory (důvod objasníme v kapitole 4).

## Přidávání vzdálených repozitářů

V předchozích částech už jsem se letmo dotkl přidávání vzdálených repozitářů. V této části se dostávám k tomu, jak přesně při přidávání postupovat. Chcete-li přidat nový vzdálený repozitář Git ve formě zkráceného názvu, na nějž lze snadno odkazovat, spusťte příkaz `git remote add [zkrácený název] [url]`:

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Řetězec `pb` nyní můžete používat na příkazovém řádku místo kompletní adresy URL. Pokud například chcete vyzvednout (fetch) všechny informace, které má Paul, ale vy je ještě nemáte ve svém repozitáři, můžete spustit příkaz `git fetch pb`:

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

Paulova hlavní větev (master branch) je lokálně dostupná jako `pb/master`. Můžete ji začlenit do některé ze svých větví nebo tu můžete provést checkout lokální větve, jestliže si ji chcete prohlédnout.

## Vyzvedávání a stahování ze vzdálených repozitářů

Jak jste právě viděli, data ze vzdálených projektů můžete získat pomocí příkazu:

	$ git fetch [název vzdáleného repozitáře]

Příkaz zamíří do vzdáleného projektu a stáhne z něj všechna data, která ještě nevlastníte. Poté byste měli mít reference na všechny větve tohoto vzdáleného projektu. Nyní je můžete kdykoli slučovat nebo prohlížet. (Podrobněji se budeme větvím a jejich použití věnovat v kapitole 3.)

Pokud jste naklonovali repozitář, příkaz automaticky přiřadí tento vzdálený repozitář pod název „origin“. Příkaz `git fetch origin` tak vyzvedne veškerou novou práci, která byla na server poslána (push) od okamžiku, kdy jste odsud klonovali (popř. odsud naposledy vyzvedávali práci). Měli bychom zmínit, že příkaz `fetch` stáhne data do vašeho lokálního repozitáře, v žádném případě ale data automaticky nesloučí s vaší prací ani jinak nezmění nic z toho, na čem právě pracujete. Data ručně sloučíte se svou prací, až to uznáte za vhodné.

Pokud máte větev nastavenou ke sledování vzdálené větve (více informací naleznete v následující části a v kapitole 3), můžete použít příkaz `git pull`, který automaticky vyzvedne a poté začlení vzdálenou větev do vaší aktuální větve. Tento postup pro vás může být snazší a pohodlnější. Standardně přitom příkaz `git clone` automaticky nastaví vaši lokální hlavní větev, aby sledovala vzdálenou hlavní větev na serveru, z nějž jste klonovali (za předpokladu, že má vzdálený server hlavní větev). Příkaz `git pull` většinou vyzvedne data ze serveru, z nějž jste původně klonovali, a automaticky se pokusí začlenit je do kódu, na němž právě pracujete.

## Posílání do vzdálených repozitářů

Pokud se váš projekt nachází ve fázi, kdy ho chcete sdílet s ostatními, můžete ho odeslat (push) na vzdálený server. Příkaz pro tuto akci je jednoduchý: `git push [název vzdáleného repozitáře] [název větve]`. Pokud chcete poslat svou hlavní větev na server `origin` (i tady platí, že proces klonování vám nastaví názvy `master` i `origin` automaticky), můžete k odeslání své práce na server použít tento příkaz:

	$ git push origin master

Tento příkaz bude funkční, pouze pokud jste klonovali ze serveru, k němuž máte oprávnění pro zápis, a pokud sem od vašeho klonování nikdo neposílal svou práci. Pokud spolu s vámi provádí současně klonování ještě někdo další a ten poté svou práci odešle na server, vaše později odesílaná práce bude oprávněně odmítnuta. Nejprve musíte stáhnout práci ostatních a začlenit ji do své, teprve potom vám server umožní odeslání. Více informací o odesílání na vzdálené servery najdete v kapitole 3.

## Prohlížení vzdálených repozitářů

Jestliže chcete získat více informací o konkrétním vzdáleném repozitáři, můžete použít příkaz `git remote show [název vzdáleného repozitáře]`. Pokud použijete tento příkaz v kombinaci s konkrétním zkráceným názvem (např. `origin`), bude výstup vypadat zhruba následovně:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

Bude obsahovat adresu URL vzdáleného repozitáře a informace ke sledování větví. Příkaz vám mimo jiné sděluje, že pokud se nacházíte na hlavní větvi (branch master) a spustíte příkaz `git pull`, automaticky začlení (merge) práci do hlavní větve na vzdáleném serveru, jakmile vyzvedne všechny vzdálené reference. Součástí výpisu jsou také všechny vzdálené reference, které příkaz stáhl.

Toto je jednoduchý příklad, s nímž se můžete setkat. Pokud však Git používáte na pokročilé bázi, příkaz `git remote show` vám patrně zobrazí podstatně více informací:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Tento příkaz vám ukáže, která větev bude automaticky odeslána, pokud spustíte příkaz `git push` na určitých větvích. Příkaz vám také oznámí, které vzdálené větve na serveru ještě nemáte, které vzdálené větve máte, jež už byly ze serveru odstraněny, a několik větví, které budou automaticky sloučeny, jestliže spustíte příkaz `git pull`.

## Přesouvání a přejmenovávání vzdálených repozitářů

Chcete-li přejmenovat vzdálený repozitář, můžete v novějších verzích systému Git spustit příkaz `git remote rename`. Příkazem lze změnit zkrácený název vzdáleného repozitáře. Pokud například chcete přejmenovat repozitář z `pb` na `paul`, můžete tak učinit pomocí příkazu `git remote rename`:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Za zmínku stojí, že tímto příkazem změníte zároveň i názvy vzdálených větví. Z původní reference `pb/master` se tak nyní stává `paul/master`.

Chcete-li, ať už z jakéhokoli důvodu, odstranit referenci (např. jste přesunuli server nebo už nepoužíváte dané zrcadlo, popř. přispěvatel přestal přispívat), můžete využít příkaz `git remote rm`:

	$ git remote rm paul
	$ git remote
	origin
