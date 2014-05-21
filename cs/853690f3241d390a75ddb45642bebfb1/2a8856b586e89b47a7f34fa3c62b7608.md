# Přeskládání

V systému Git existují dvě základní možnosti, jak integrovat změny z jedné větve do druhé: sloučení (neboli začlenění) příkazem `merge` a přeskládání příkazem `rebase`. V této části se dozvíte, co to je přeskládání, jak ho provést, v čem spočívají výhody tohoto nástroje a v jakých případech ho rozhodně nepoužívat.

## Základní přeskládání

Pokud se vrátíme k našemu dřívějšímu příkladu z části o slučování větví (viz obrázek 3-27), vidíme, že jsme svoji práci rozdělili a vytvářeli revize ve dvou různých větvích.


![](http://git-scm.com/figures/18333fig0327-tn.png)

Obrázek 3-27. Vaše původně rozdělená historie revizí

Víme, že nejjednodušším způsobem, jak integrovat větve, je příkaz `merge`. Ten provede třícestné sloučení mezi dvěma posledními snímky (C3 a C4) a jejich nejmladším společným předkem (C2), přičemž vytvoří nový snímek (a novou revizi) – viz obrázek 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)

Obrázek 3-28. Integrace rozdělené historie sloučením větví

Existuje však ještě jiný způsob. Můžete vzít záplatu se změnou, kterou jste provedli revizí C3, a aplikovat ji na vrcholu revize C4. V systému Git se tato metoda nazývá přeskládání (rebasing). Příkazem `rebase` vezmete všechny změny, které byly zapsány na jedné větvi, a necháte je znovu provést na jiné větvi.

V našem případě tedy provedete následující:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

Přeskládání funguje takto: systém najde společného předka obou větví (větve, na níž se nacházíte, a větve, na kterou přeskládáváte), provede příkaz diff pro všechny revize větve, na níž se nacházíte, uloží zjištěné rozdíly do dočasných souborů, vrátí aktuální větev na stejnou revizi jako větev, na kterou přeskládáváte, a nakonec po jedné aplikuje všechny změny. Tento proces je naznačen na obrázku 3-29.


![](http://git-scm.com/figures/18333fig0329-tn.png)

Obrázek 3-29. Přeskládání změny provedené v revizi C3 na revizi C4

Nyní můžete přejít zpět na hlavní větev a provést sloučení „rychle vpřed“ (viz obrázek 3-30).


![](http://git-scm.com/figures/18333fig0330-tn.png)

Obrázek 3-30. „Rychle vpřed“ po hlavní větvi

Snímek, na který nyní ukazuje revize C3', je zcela totožný se snímkem, na který v příkladu v části o slučování ukazovala C5. V koncových produktech integrace není žádný rozdíl, výsledkem přeskládání je však čistší historie. Pokud si prohlížíte log přeskládané větve, vypadá jako lineární historie – zdá se, jako by veškerá práce probíhala v jedné linii, ačkoli původně byla paralelní.

Tuto metodu budete často používat v situaci, kdy chcete mít jistotu, že byly vaše revize čistě aplikovány na vzdálenou větev – např. v projektu, do nějž chcete přidat příspěvek, který ale nespravujete. V takovém případě budete pracovat ve své větvi, a až budete mít připraveny záplaty k odeslání do hlavního projektu, přeskládáte svou práci na větev `origin/master`. Správce v tomto případě nemusí provádět žádnou integraci, provede pouze posun „rychle vpřed“ nebo čistou aplikaci.

Ještě jednou bychom chtěli upozornit, že snímek, na který ukazuje závěrečná revize – ať už se jedná o poslední z přeskládaných revizí po přeskládání, nebo poslední revizi sloučením jako výsledek začlenění – je vždy stejný. Jediné, co se liší, je historie. Přeskládání provede změny učiněné v jedné linii práce ještě jednou v jiné linii, a to v pořadí, v jakém byly provedeny. Sloučení naproti tomu vezme koncové body větví a sloučí je dohromady.

## Zajímavější možnosti přeskládání

Opětovné provedení změn pomocí příkazu rebase můžete využít i jiným účelům než jen k přeskládání větve. Vezměme například historii na obrázku 3-31. Vytvořili jste novou tematickou větev (`server`), pomocí níž chcete do svého projektu přidat funkci na straně serveru, a zapsali jste revizi. Poté jste tuto větev opustili a začali pracovat na změnách na straně klienta (`client`). I tady jste zapsali několik revizí. Nakonec jste se vrátili na větev `server` a zapsali tu další revize.


![](http://git-scm.com/figures/18333fig0331-tn.png)

Obrázek 3-31. Historie s tematickou větví obsahující další tematickou větev.

Předpokládejme, že nyní chcete začlenit změny provedené na straně klienta do své hlavní linie k vydání, ale prozatím chcete počkat se změnami na straně serveru, dokud nebudou pečlivě otestovány. Můžete vzít změny na větvi client, které nejsou na větvi server (C8 a C9), a nechat je znovu provést na hlavní větvi. Použijte k tomu příkaz `git rebase` v kombinaci s parametrem `--onto`:

	$ git rebase --onto master server client

Tím v podstatě říkáte: „Proveď checkout větve `client`, zjisti záplaty ze společného předka větví `client` a `server` a znovu je aplikuj na hlavní větev `master`.“ Postup je možná trochu složitý, ale výsledek, znázorněný na obrázku 3-32, stojí opravdu za to.


![](http://git-scm.com/figures/18333fig0332-tn.png)

Obrázek 3-32. Přeskládání tematické větve, která byla součástí jiné tematické větve 72.

Nyní můžete posunout hlavní větev „rychle vpřed“ (viz obrázek 3-33):

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)

Obrázek 3-33. Posun hlavní větve rychle vpřed na konec změn přeskládaných z větve client

Řekněme, že se později rozhodnete natáhnout i větev server. Větev server můžete přeskládat na hlavní větev příkazem `git rebase [základna] [tematická větev]`. Příkaz provede checkout tematické větve (v tomto případě větve `server`) a přeskládá její změny na základnu (angl. base branch, v tomto případě `master`):

	$ git rebase master server

Příkaz provede změny obsažené ve větvi `server` ještě jednou na vrcholu větve `master`, jak je znázorněno na obrázku 3-34.


![](http://git-scm.com/figures/18333fig0334-tn.png)

Obrázek 3-34. Přeskládání větve server na vrcholu hlavní větve.

Poté se můžete přesunout „rychle vpřed“ po základně (větev `master`):

	$ git checkout master
	$ git merge server

Poté můžete větev `client` i `server` smazat, protože všechna práce z nich je integrována a tyto větve už nebudete potřebovat. Vaše historie pak bude vypadat jako na obrázku 3-35:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)

Obrázek 3-35. Konečná historie revizí

## Rizika spojená s přeskládáním

Přeskládání sice nabízí určité výhody, má však také svá úskalí. Ta se dají shrnout do jedné věty:

Neprovádějte přeskládání u revizí, které jste odeslali do veřejného repozitáře.

Budete-li se touto zásadou řídit, nemusíte se přeskládání obávat. V opačném případě vás čeká opovržení ostatních, rodina a přátelé vás zapřou.

Při přeskládání dat zahodíte existující revize a vytvoříte nové, které jsou jim podobné, ale přesto jiné. Pokud odešlete svou práci, ostatní si ji stáhnou a založí na nich svou práci. A vy potom tyto revize přepíšete příkazem `git rebase` a znovu je odešlete, vaši spolupracovníci do ní budou muset znovu začlenit svou práci a ve všem nastane chaos, až se pokusíte natáhnout jejich práci zpět do své.

Podívejme se na malý příklad, jaké problémy může přeskládání již zveřejněných dat způsobit. Představme si situaci, kdy jste naklonovali repozitář z centrálního serveru a provedli jste v něm několik změn. Vaše historie revizí bude vypadat jako na obrázku 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)

Obrázek 3-36. Naklonovali jste repozitář a provedli v něm změny.

Někdo jiný teď provede jiné úpravy, jejichž součástí bude i začlenění, a odešle svou práci na centrální server. Vy tyto změny vyzvednete a začleníte novou vzdálenou větev do své práce – vaše historie teď vypadá jako na obrázku 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)

Obrázek 3-37. Vyzvedli jste další revize a začlenili je do své práce.

Jenže osoba, která odeslala a začlenila své změny, se rozhodne vrátit a svou práci raději přeskládat. Provede příkaz `git push --force` a přepíše historii na serveru. Vy poté znovu vyzvednete data ze serveru a stáhnete nové revize.


![](http://git-scm.com/figures/18333fig0338-tn.png)

Obrázek 3-38. Kdosi odeslal přeskládané revize a zahodil ty, na nichž jste založili svou práci.

V tuto chvíli vám nezbývá, než změny znovu začlenit do své práce, ačkoli už jste je jednou začlenili. Přeskládáním se změnily otisky SHA-1 těchto revizí, a Git je proto považuje za nové revize, přestože změny označené jako C4 už jsou ve skutečnosti ve vaší historii obsaženy (viz obrázek 3-39).


![](http://git-scm.com/figures/18333fig0339-tn.png)

Obrázek 3-39. Znovu jste začlenili stejnou práci do nové revize sloučením.

Vy musíte tyto změny ve vhodném okamžiku začlenit do své práce, abyste do budoucna neztratili kontakt s ostatními vývojáři. Vaše historie pak bude obsahovat revize C4 i C4’, které mají obě jiný otisk SHA-1, ale představují stejnou práci a nesou i stejnou zprávu k revizi. Pokud s takovouto historií spustíte příkaz `git log`, nastane zmatečná situace, kdy se zobrazí dvě revize se stejným datem autora i stejnou zprávou k revizi. Pokud pak tuto historii odešlete zpět na server, znovu provedete všechny tyto přeskládané revize na centrálním serveru, což bude zmatečné i pro vaše spolupracovníky.

Budete-li používat přeskládání jako metodu vyčištění a práce s revizemi předtím, než je odešlete, a budete-li přeskládávat pouze revize, které dosud nikdy nebyly zveřejněny, nemusíte se žádných problémů obávat. Jestliže ale přeskládáte revize, které už byly zveřejněny a někdo na nich mohl založit svou práci, můžete si tím nepěkně zavařit.
