# Distribuované pracovní postupy

Na rozdíl od centralizovaných systémů správy verzí (CVCS) umožňuje distribuovaný charakter systému Git mnohem větší flexibilitu při spolupráci vývojářů na projektech. V centralizovaných systémech představuje každý vývojář samostatný uzel, pracující více či méně na stejné úrovni vůči centrálnímu úložišti. Naproti tomu je v systému Git každý vývojář potenciálním uzlem i úložištěm, každý vývojář může přispívat kódem do jiných repozitářů i spravovat veřejný repozitář, na němž mohou ostatní založit svou práci a do nějž mohou přispívat. Tím se otvírá široké spektrum možností organizace práce pro váš projekt a/nebo váš tým. Zkusíme se tedy podívat na pár častých postupů, které tato flexibilita umožňuje. Uvedeme přednosti i eventuální slabiny všech těchto postupů. Budete si moci vybrat některý z postupů nebo je navzájem kombinovat a spojovat jejich funkce.

## Centralizovaný pracovní postup

V centralizovaných systémech je většinou možný pouze jediný model spolupráce, tzv. centralizovaný pracovní postup. Jedno centrální úložiště (hub) nebo repozitář přijímá zdrojový kód a každý podle něj synchronizuje svou práci. Několik vývojářů představuje jednotlivé uzly (nodes) – uživatele centrálního místa – které se podle tohoto místa synchronizují (viz obrázek 5-1).


![](http://git-scm.com/figures/18333fig0501-tn.png)

Obrázek 5-1. Centralizovaný pracovní postup

To znamená, že pokud dva vývojáři klonují z centrálního úložiště a oba provedou změny, jen první z nich, který odešle své změny, to může provést bez komplikací. Druhý vývojář musí před odesláním svých změn začlenit práci prvního vývojáře do své, aby nepřepsal jeho změny. Tento koncept platí jak pro Git, tak pro Subversion (popř. jakýkoli CVCS). I v systému Git funguje bez problémů.

Pokud pracujete v malém týmu nebo už jste ve své společnosti nebo ve svém týmu zvyklí na centralizovaný pracovní postup, můžete v něm beze všeho pokračovat. Jednoduše vytvořte repozitář a přidělte všem ze svého týmu oprávnění k odesílání dat. Git neumožní uživatelům, aby se navzájem přepisovali. Pokud některý z vývojářů naklonuje data, provede změny a poté se je pokusí odeslat, a jiný vývojář mezitím odeslal svoje revize, server tyto změny odmítne. Git vývojáři při odmítnutí sdělí, že se pokouší odeslat změny, které nesměřují „rychle vpřed“, což není možné provést, dokud nevyzvedne a nezačlení stávající data z repozitáře.
Tento pracovní postup může být pro mnoho lidí zajímavý, protože je to schéma, které jsou zvyklí používat a jsou s ním spokojeni.

## Pracovní postup s integračním manažerem

Protože Git umožňuje, abyste měli několik vzdálených repozitářů, lze použít pracovní postup, kdy má každý vývojář oprávnění k zápisu do vlastního veřejného repozitáře a oprávnění pro čtení k repozitářům všech ostatních. Tento scénář často zahrnuje jeden standardní repozitář, který reprezentuje „oficiální“ projekt. Chcete-li do tohoto projektu přispívat, vytvořte vlastní veřejný klon projektu a odešlete do něj změny, které jste provedli. Poté odešlete správci hlavního projektu žádost, aby do projektu natáhl vaše změny. Váš repozitář může přidat jako vzdálený repozitář, lokálně otestovat vaše změny, začlenit je do své větve a odeslat zpět do svého repozitáře. Postup práce je následující (viz obrázek 5-2):

1. Správce projektu odešle data do svého veřejného repozitáře.
2. Přispěvatel naklonuje tento repozitář a provede změny.
3. Přispěvatel odešle změny do své vlastní veřejné kopie.
4. Přispěvatel pošle správci e-mail s žádostí, aby natáhl změny do projektu.
5. Správce přidá repozitář přispěvatele jako vzdálený repozitář a provede lokální začlenění.
6. Správce odešle začleněné změny do hlavního repozitáře.


![](http://git-scm.com/figures/18333fig0502-tn.png)

Obrázek 5-2. Pracovní postup s integračním manažerem

Tento pracovní postup je velmi rozšířený na stránkách jako GitHub, kde je snadné rozštěpit projekt a odeslat změny do své odštěpené části, kde jsou pro každého k nahlédnutí. Jednou z hlavních předností tohoto postupu je, že můžete pracovat bez přerušení a správce hlavního repozitáře může natáhnout vaše změny do projektu, kdykoli uzná za vhodné. Přispěvatelé nemusí čekat, až budou jejich změny začleněny do projektu – každá strana může pracovat svým tempem.

## Pracovní postup s diktátorem a poručíky

Jedná se o variantu pracovního postupu s více repozitáři. Většinou se používá u obřích projektů se stovkami spolupracovníků. Možná nejznámějším příkladem je vývoj jádra Linuxu. Několik různých integračních manažerů odpovídá za konkrétní části repozitáře – říká se jím poručíci (lieutenants). Všichni poručíci mají jednoho integračního manažera, kterému se říká „benevolentní diktátor“. Repozitář benevolentního diktátora slouží jako referenční repozitář, z nějž všichni spolupracovníci musí stahovat data. Postup práce je následující (viz obrázek 5-3):

1. Stálí vývojáři pracují na svých tematických větvích a přeskládávají svou práci na vrchol hlavní větve. Hlavní větev je větev diktátora.
2. Poručíci začleňují tematické větve vývojářů do svých hlavních větví.
3. Diktátor začleňuje hlavní větve poručíků do své hlavní větve.
4. Diktátor odesílá svou hlavní větev do referenčního repozitáře, aby si na jeho základě mohli ostatní vývojáři přeskládat data.


![](http://git-scm.com/figures/18333fig0503-tn.png)

Obrázek 5-3. Pracovní postup s benevolentním diktátorem

Tento typ pracovního postupu není sice obvyklý, ale může být užitečný u velmi velkých projektů nebo v silně hierarchizovaných prostředích, neboť umožňuje, aby vedoucí projektu (diktátor) velkou část práce delegoval. Pak sbírá velké kusy kódu, které integruje.

Toto jsou tedy některé z běžně používaných pracovních postupů, které můžete využít v distribuovaných systémech, jako je například Git. Uvidíte ale, že na pozadí vašich konkrétních potřeb v reálných situacích lze vytvořit celou řadu variací na tyto postupy. Nyní, když už se (jak doufám) dokážete rozhodnout, která kombinace postupů pro vás bude ta nejvhodnější, ukážeme si některé konkrétní příklady, jak lze rozdělit hlavní role, z nichž vyplývají jednotlivé postupy práce.
