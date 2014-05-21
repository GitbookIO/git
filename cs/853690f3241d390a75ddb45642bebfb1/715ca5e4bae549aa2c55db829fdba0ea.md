# Možnosti při práci s větvemi

Teď, když jste absolvovali základní seznámení s větvemi a jejich slučováním, nabízí se otázka, k čemu je to vlastně dobré. Proto se v této části podíváme na některé běžné pracovní postupy, které vám neobyčejně snadné větvení umožňuje, a můžete se zamyslet nad tím, zda větve při své vývojářské práci využijete, či nikoli.

## Dlouhé větve

Vzhledem k tomu, že Git používá jednoduché třícestné slučování, je velmi snadné začleňovat jednu větev do druhé i několikrát v rámci dlouhého časového intervalu. Můžete tak mít několik větví, které jsou stále otevřené a které používáte pro různé fáze vývojového cyklu. Pravidelně můžete začleňovat práci z jedné větve do ostatních.

Mnoho vývojářů systému Git používá pracovní postup, při němž je tato metoda zcela ideální. Ve větvi `master` mají pouze kód, který je stoprocentně stabilní — třeba jen kód, který byl nebo bude součástí vydání. Kromě ní mají další paralelní větev, pojmenovanou `develop` nebo `next`, v níž skutečně pracují nebo testují stabilitu kódu. Tato větev nemusí být nutně stabilní, ale jakmile se dostane do stabilního stavu, může být začleněna do větve `master`. Používá se k natahování tematických větví (těch dočasných, jako byla vaše větev `iss53`) ve chvíli, kdy je k tomu vše připraveno a nehrozí, že práce neprojde testy nebo bude způsobovat chyby.

Ve skutečnosti hovoříme o ukazatelích pohybujících se vzhůru po linii revizí, které zapisujete. Stabilní větve leží v linii historie revizí níže a nové, neověřené větve se nacházejí nad nimi (viz obrázek 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)

Obrázek 3-18. Stabilnější větve většinou leží v historii revizí níže.

Snáze si je můžeme představit jako pracovní zásobníky, v nichž se sada revizí dostává do stabilnějšího zásobníku, když úspěšně absolvovala testování (viz obrázek 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)

Obrázek 3-19. Větve si můžeme představit jako zásobníky

Tento postup lze použít hned pro několik úrovní stability. Některé větší projekty mají také větev `proposed` nebo `pu` (proposed updates, návrh aktualizací) s integrovanými větvemi, které nemusí být nutně způsobilé k začlenění do větve `next` nebo `master`. Idea je taková, že se větve nacházejí na různé úrovni stability. Jakmile dosáhnou stability o stupeň vyšší, jsou začleněny do větve nad nimi.
Není nutné používat při práci několik dlouhých větví, ale často to může být užitečné, zejména pokud pracujete ve velmi velkých nebo komplexních projektech.

## Tematické větve

Naproti tomu tematické větve se vám budou hodit v projektech jakékoli velikosti. Tematická větev (topic branch) je krátkodobá větev, kterou vytvoříte a používáte pro jediný konkrétní účel nebo práci. Je to záležitost, do které byste se ve VCS asi raději nikdy nepustili, protože vytvářet a slučovat větve je v něm opravdu složité. V systému Git naopak není výjimkou vytvářet, používat, slučovat a mazat větve i několikrát denně.

Viděli jste to v předchozí části, kdy jste si vytvořili větve `iss53` a `hotfix`. Provedli jste v nich pár revizí a smazali jste je hned po začlenění změn do hlavní větve. Tato technika umožňuje rychlé a kompletní kontextové přepínání. Protože je vaše práce rozdělena do zásobníků, kde všechny změny v jedné větvi souvisí s jedním tématem, je při kontrole kódu snazší dohledat, čeho se změny týkaly apod. Změny tu můžete uchovávat několik minut, dní i měsíců a začlenit je přesně ve vhodnou chvíli. Na pořadí, v jakém byly větve vytvořeny nebo vyvíjeny, nezáleží.

Uvažujme nyní následující situaci: pracujete na projektu v hlavní větvi (`master`), odbočíte z ní k vyřešení jednoho problému (`iss91`), chvíli na něm pracujete, ale vytvoříte ještě další větev, abyste zkusili jiné řešení stejné chyby (`iss91v2`). Pak se vrátíte zpět na hlavní větev, kde pokračujete v práci, než dostanete nápad, který by se možná mohl osvědčit, a tak pro něj vytvoříte další větev (`dumbidea`). Historie revizí bude vypadat zhruba jako na obrázku 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)

Obrázek 3-20. Historie revizí s několika tematickými větvemi

Řekněme, že se nyní rozhodnete, že druhé řešení vašeho problému bude vhodnější (`iss91v2`). Dále jste také ukázali svůj nápad ve větvi `dumbidea` kolegům a ti ho považují za geniální. Původní větev `iss91` tak nyní můžete zahodit (s ní i revize C5 a C6) a začlenit zbylé dvě větve. Vaši historii v tomto stavu znázorňuje obrázek 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)

Obrázek 3-21. Vaše historie po začlenění větví „dumbidea“ a „iss91v2“

Při tom všem, co nyní děláte, je důležité mít na paměti, že všechny tyto větve jsou čistě lokální. Veškeré větvení a slučování se odehrává pouze v repozitáři Git, neprobíhá žádná komunikace se serverem.
