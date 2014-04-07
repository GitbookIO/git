# Vzdálené větve

Vzdálené větve jsou reference (tj. odkazy) na stav větví ve vašich vzdálených repozitářích. Jsou to lokální větve, které nemůžete přesouvat. Přesouvají se automaticky při síťové komunikaci. Vzdálené větve slouží jako záložky, které vám připomínají, kde byly větve ve vzdálených repozitářích, když jste se k nim naposledy připojili.

Vzdálené větve mají podobu `(vzdálený repozitář)/(větev)`. Například: Chcete-li zjistit, jak vypadala větev `master` na vašem vzdáleném serveru `origin`, když jste s ní naposledy komunikovali, budete hledat větev `origin/master`. Pokud pracujete s kolegou na stejném problému a on odešle na server větev s názvem `iss53`, může se stát, že i vy máte jednu z lokálních větví pojmenovanou jako `iss53`. Větev na serveru však ukazuje na revizi označenou jako `origin/iss53`.

Mohlo by to být trochu matoucí, takže si uveďme příklad. Řekněme, že máte v síti server Git označený `git.ourcompany.com`. Pokud provedete klonování z tohoto serveru, Git ho automaticky pojmenuje `origin`, stáhne z něj všechna data, vytvoří ukazatel, který bude označovat jeho větev `master`, a lokálně ji pojmenuje `origin/master`. Tuto větev nemůžete přesouvat. Git vám rovněž vytvoří vaši vlastní větev `master`, která bude začínat ve stejném místě jako větev `master` serveru `origin`. Máte tak definován výchozí bod pro svoji práci (viz obrázek 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)

Obrázek 3-22. Příkaz git clone vám vytvoří vlastní hlavní větev a větev origin/master, ukazující na hlavní větev serveru origin.

Pokud nyní budete pracovat na své lokální hlavní větvi a někdo z kolegů mezitím pošle svou práci na server `git.ourcompany.com` a aktualizuje jeho hlavní větev, budou se vaše historie vyvíjet odlišně. A dokud zůstanete od serveru origin odpojeni, váš ukazatel `origin/master` se nemůže přemístit (viz obrázek 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)

Obrázek 3-23. Pokud pracujete lokálně a někdo jiný odešle svou práci na vzdálený server, obě historie se rozejdou.

K synchronizaci své práce použijte příkaz `git fetch origin`. Tento příkaz zjistí, který server je „origin“ (v našem případě je to `git.ourcompany.com`), vyzvedne z něj všechna data, která ještě nemáte, a aktualizuje vaši lokální databázi. Při tom přemístí ukazatel `origin/master` na novou, aktuálnější pozici (viz obrázek 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)

Obrázek 3-24. Příkaz git fetch aktualizuje vaše reference na vzdálený server.

Abychom si mohli ukázat, jak se pracuje s několika vzdálenými servery a jak vypadají vzdálené větve takových vzdálených projektů, předpokládejme, že máte ještě další interní server Git, který při vývoji používá pouze jeden z vašich sprint teamů. Tento server se nachází na `git.team1.ourcompany.com`. Můžete ho přidat jako novou vzdálenou referenci k projektu, na němž právě pracujete – spusťte příkaz `git remote add` (viz kapitola 2). Pojmenujte tento vzdálený server jako `teamone`, což bude zkrácený název pro celou URL adresu (viz obrázek 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)

Obrázek 3-25. Přidání dalšího vzdáleného serveru.

Nyní můžete spustit příkaz `git fetch teamone`, který ze vzdáleného serveru `teamone` vyzvedne vše, co ještě nemáte. Protože je tento server podmnožinou dat, která jsou právě na serveru `origin`, Git nevyzvedne žádná data, ale nastaví vzdálenou větev nazvanou `teamone/master` tak, aby ukazovala na revizi, kterou má server `teamone` nastavenou jako větev `master` (viz obrázek 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)

Obrázek 3-26. Lokálně získáte referenci na pozici hlavní větve serveru teamone.

## Odesílání

Chcete-li svou větev sdílet s okolním světem, musíte ji odeslat na vzdálený server, k němuž máte oprávnění pro zápis. Vaše lokální větve nejsou automaticky synchronizovány se vzdálenými servery, na něž zapisujete – ty, které chcete sdílet, musíte explicitně odeslat. Tímto způsobem si můžete zachovat soukromé větve pro práci, kterou nehodláte sdílet, a odesílat pouze tematické větve, na nichž chcete spolupracovat.

Máte-li větev s názvem `serverfix`, na níž chcete spolupracovat s ostatními, můžete ji odeslat stejným způsobem, jakým jste odesílali svou první větev. Spusťte příkaz `git push (server) (větev)`:

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Toto je zkrácená verze příkazu. Git automaticky rozšíří název větve `serverfix` na `refs/heads/serverfix:refs/heads/serverfix`, což znamená: „Vezmi mou lokální větev `serverfix` a odešli ji na vzdálený server, kde aktualizuje tamní větev `serverfix`.“ Části `refs/heads/` se budeme podrobněji věnovat v kapitole 9, pro většinu uživatelů však nebude zajímavá. Můžete rovněž zadat příkaz `git push origin serverfix:serverfix`, který provede totéž. Systému Git říká: „Vezmi mou větev `serverfix` a udělej z ní `serverfix` na vzdáleném serveru.“ Tento formát můžete použít k odeslání lokální větve do vzdálené větve, která se jmenuje jinak. Pokud jste nechtěli, aby se větev na vzdáleném serveru jmenovala `serverfix`, mohli jste zadat příkaz ve tvaru `git push origin serverfix:awesomebranch`. Vaše lokální větev `serverfix` by byla odeslána do větve `awesomebranch` ve vzdáleném projektu.

Až bude příště některý z vašich spolupracovníků vyzvedávat data ze serveru, obdrží referenci o tom, kde se nachází serverová verze větve `serverfix` ve vzdálené větvi `origin/serverfix`:

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

Tady je důležité upozornit, že pokud vyzvedáváte data a stáhnete s nimi i nové vzdálené větve, nemáte automaticky jejich lokální, editovatelné kopie. Jinak řečeno: v tomto případě nebudete mít novou větev `serverfix`, budete mít pouze ukazatel `origin/serverfix`, který nemůžete měnit.

Chcete-li začlenit tato data do své aktuální pracovní větve, spusťte příkaz `git merge origin/serverfix`. Chcete-li mít vlastní větev `serverfix`, na níž budete pracovat, můžete ji ze vzdálené větve vyvázat:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Tímto způsobem získáte lokální větev, na níž můžete pracovat a která začíná na pozici `origin/serverfix`.

## Sledující větve

Checkoutem lokální větve ze vzdálené větve automaticky vytvoříte tzv. Sledující větev (angl. tracking branch). Sledující větve jsou lokální větve s přímým vztahem ke vzdálené větvi. Pokud se nacházíte na Sledující větvi a zadáte příkaz `git push`, Git automaticky ví, na který server a do které větve má data odeslat. Také příkazem `git pull` zadaným na sledovací větvi vyzvednete všechny vzdálené reference a Git poté odpovídající vzdálenou větev automaticky začlení.

Pokud klonujete repozitář, většinou se vytvoří větev `master`, která bude sledovat větev `origin/master`. To je také důvod, proč příkazy `git push` a `git pull` fungují i bez dalších parametrů. Pokud chcete, můžete nastavit i jiné sledující větve – takové, které nebudou sledovat větve na serveru `origin` a nebudou sledovat hlavní větev `master`. Jednoduchým případem je příklad, který jste právě viděli: spuštění příkazu `git checkout -b [větev] [vzdálený server]/[větev]`. Máte-li Git ve verzi 1.6.2 nebo novější, můžete použít také zkrácenou variantu `--track`:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Chcete-li nastavit lokální větev s jiným názvem, než má vzdálená větev, můžete jednoduše použít první variantu s odlišným názvem lokální větve:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "sf"

Vaše lokální větev „sf“ bude nyní automaticky stahovat data ze vzdálené větve origin/serverfix a bude do ní i odesílat.

## Mazání vzdálených větví

Předpokládejme, že už nepotřebujete jednu ze vzdálených větví. Spolu se svými spolupracovníky jste dokončili určitou funkci a začlenili jste ji do větve `master` na vzdáleném serveru (nebo do jakékoli jiné větve, kterou používáte pro stabilní kód). Vzdálenou větev nyní můžete smazat pomocí poněkud neohrabané syntaxe `git push [vzdálený server] :[větev]`. Chcete-li ze serveru odstranit větev `serverfix`, můžete to provést takto:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Šup! A větev je ze serveru pryč. Na této stránce si možná chcete ohnout rožek, protože tento příkaz budete určitě potřebovat, ale jeho syntaxi pravděpodobně zapomenete. Zapamatovat si jej ale můžete tak, že si vybavíte příkaz `git push [vzdálený server] [lokální větev]:[vzdálená větev]`, o kterém jsme se zmínili před chvílí. Pokud vynecháte složku `[lokální větev]`, pak v podstatě říkáte: „Neber na mé straně nic a toto nic teď bude `[vzdálená větev]`.“
