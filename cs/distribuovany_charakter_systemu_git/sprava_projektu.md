# Správa projektu

Při práci na projektech Git možná nevystačíte jen s vědomostmi, jak do projektu efektivně přispívat. Pravděpodobně budete jednou potřebovat vědět něco i o správě projektů. Do této oblasti spadá přijímání a aplikace záplat vygenerovaných příkazem `format-patch`, které vám vývojáři poslali, nebo třeba integrace změn ve vzdálených větvích pro repozitáře, které jste do svého projektu přidali jako vzdálené repozitáře. Ať spravujete standardní repozitář, nebo pomáháte při ověřování či schvalování záplat, budete muset vědět, jak přijímat práci ostatních přispěvatelů, a to způsobem, který je pro ostatní co nejčistší a pro vás dlouhodobě udržitelný.

## Práce v tematických větvích

Pokud uvažujete o integraci nové práce do projektu, je většinou dobré zkusit si to v tematické větvi, tj. dočasné větvi, kterou vytvoříte konkrétně pro tento účel. Snadno tak můžete záplatu individuálně opravit, a pokud není funkční, opustit ji, dokud nebudete mít čas k její opravě. Pokud pro větev vytvoříte jednoduchý název spojený s tématem testované práce (např. `ruby_client` nebo něco obdobně popisného), snadno se na větev rozpomenete, jestliže se k ní musíte později vrátit. Správce projektů Git přiřazuje těmto větvím také jmenný prostor, např. `sc/ruby_client`, kde `sc` je zkratka pro osobu, která práci vytvořila.
Jak si vzpomínáte, můžete vytvořit větev založenou na své hlavní větvi:

	$ git branch sc/ruby_client master

Nebo pokud na ni chcete rovnou přepnout, můžete použít parametr `checkout -b`:

	$ git checkout -b sc/ruby_client master

Nyní tedy můžete vložit svůj příspěvek do této tematické větve a rozhodnout se, zda ho chcete začlenit do svých trvalejších větví.

## Aplikace záplat z e-mailu

Jestliže obdržíte e-mailem záplatu, kterou potřebujete integrovat do svého projektu, aplikujete ho nejprve do tematické větve, v níž ho vyhodnotíte. Existují dva způsoby aplikace záplaty z e-mailu: příkazem `git apply` nebo příkazem `git am`.

### Aplikace záplaty příkazem „apply“

Pokud dostanete záplatu od někoho, kdo ji vygeneroval příkazem `git diff` nebo unixovým příkazem `diff`, můžete ho aplikovat příkazem `git apply`. Předpokládejme, že jste záplatu uložili jako `/tmp/patch-ruby-client.patch`. Aplikaci pak provedete takto:

	$ git apply /tmp/patch-ruby-client.patch

Tím změníte soubory ve svém pracovním adresáři. Je to téměř stejné, jako byste k aplikaci záplaty použili příkaz `patch -p1`. Tento postup je však přísnější a nepřijímá tolik přibližných shod jako příkaz patch. Poradí si také s přidanými, odstraněnými a přejmenovanými soubory, jsou-li popsány ve formátu `git diff`, což příkaz `patch` nedělá. A konečně příkaz `git apply` pracuje na principu „aplikuj vše, nebo zruš vše“. Buď jsou tedy aplikovány všechny soubory, nebo žádný. Naproti tomu příkaz `patch` může aplikovat soubory záplaty jen částečně a zanechat váš pracovní adresář v neurčitém stavu. Příkaz `git apply` je tedy celkově víc paranoidní než příkaz `patch`. Tímto příkazem ostatně ani nezapíšete revizi, po jeho spuštění budete muset připravit a zapsat provedené změny ručně.

Příkaz git apply můžete použít také ke kontrole, zda bude záplata aplikována čistě. V takovém případě použijte na patch příkaz `git apply --check`:

	$ git apply --check 0001-seeing-if-this-helps-the-gem.patch
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply

Pokud se nezobrazí žádný výstup, záplata bude aplikována čistě. Jestliže kontrola selže, příkaz vrací nenulový návratový kód, a proto ho lze snadno používat ve skriptech.

### Aplikace záplaty příkazem „am“

Pokud je přispěvatel uživatelem systému Git a byl natolik dobrý, že k vygenerování záplaty použil příkaz `format-patch`, budete mít usnadněnou práci, protože záplata obsahuje informace o autorovi a zprávu k revizi. Můžete-li, doporučte svým přispěvatelům, aby místo příkazu `diff` používali příkaz `format-patch`. Příkaz `git apply` je dobré používat jen pro starší záplaty a podobně.

K aplikaci patche vygenerovaného příkazem `format-patch` použijte příkaz `git am`. Příkaz `git am` je technicky koncipován tak, aby přečetl soubor mbox, tj. formát prostého textu pro ukládání jedné či více e-mailových zpráv do jednoho textového souboru. Vypadá například takto:

	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] add limit to log function

	Limit log functionality to the first 20

Toto je začátek výstupu příkazu format-patch, s nímž jsme se setkali v předchozí části. Zároveň je to také platný e-mailový formát mbox. Jestliže vám přispěvatel řádně poslal záplatu e-mailem pomocí příkazu git send-email a vy záplatu stáhnete do formátu mbox, můžete na soubor mbox použít příkaz git am, který začne aplikovat všechny záplaty, které najde. Jestliže spustíte poštovního klienta, který dokáže uložit několik e-mailů ve formátu mbox, můžete do jednoho souboru uložit celou sérii záplat a příkazem git am je pak aplikovat všechny najednou.

Pokud však někdo nahrál soubor záplaty vygenerovaný příkazem `format-patch` do tiketového nebo podobného systému, můžete soubor uložit lokálně a poté na tento uložený soubor použít příkaz `git am`. Tímto způsobem záplatu aplikujete:

	$ git am 0001-limit-log-function.patch
	Applying: add limit to log function

Jak vidíte, záplata byla aplikována čistě a automaticky byla vytvořena nová revize. Informace o autorovi jsou převzaty z polí `From` a `Date` v e-mailu a zpráva k revizi je převzata z `Subject` a těla e-mailu (před samotnou záplatou). Pokud byl patch aplikován například ze souboru mbox v předchozím příkladu, vygenerovaná revize bude vypadat zhruba takto:

	$ git log --pretty=fuller -1
	commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Author:     Jessica Smith <jessica@example.com>
	AuthorDate: Sun Apr 6 10:17:23 2008 -0700
	Commit:     Scott Chacon <schacon@gmail.com>
	CommitDate: Thu Apr 9 09:19:06 2009 -0700

	   add limit to log function

	   Limit log functionality to the first 20

Informace `Commit` uvádí osobu, která patch aplikovala, a čas, kdy se tak stalo. Informace `Author` naproti tomu označuje jedince, který patch původně vytvořil, a kdy tak učinil.

Může se ale stát, že záplata nebude aplikována čistě. Vaše hlavní větev se mohla příliš odchýlit od větve, z níž byla záplata vytvořena, nebo je záplata závislá na jiné záplatě, kterou jste ještě neaplikovali. V takovém případě proces `git am` neproběhne a Git se vás zeptá, co chcete udělat dál:

	$ git am 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Patch failed at 0001.
	When you have resolved this problem run "git am --resolved".
	If you would prefer to skip this patch, instead run "git am --skip".
	To restore the original branch and stop patching run "git am --abort".

Tento příkaz vloží poznámku o konfliktu (conflict marker) do všech souborů, u nichž došlo k problémům, stejně jako u operací sloučení nebo přeskládání, při nichž došlo ke konfliktu. Problém se také řeší stejným způsobem. Úpravou souboru odstraňte konflikt, připravte nový soubor k zapsání a spusťte příkaz `git am --resolved`, jímž se přesunete k následující záplatě:

	$ (fix the file)
	$ git add ticgit.gemspec
	$ git am --resolved
	Applying: seeing if this helps the gem

Pokud chcete, aby se Git pokusil vyřešit konflikt inteligentněji, můžete zadat parametr `-3`. Git se pokusí o třícestné sloučení. Tato možnost není nastavena jako výchozí, protože ji nelze použít v situaci, kdy revize, o níž záplata říká, že je na ní založen, není obsažena ve vašem repozitáři. Pokud tuto revizi vlastníte – byla-li záplata založena na veřejné revizi – počíná si parametr `-3` při aplikaci kolidující záplaty většinou mnohem inteligentněji.

	$ git am -3 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Using index info to reconstruct a base tree...
	Falling back to patching base and 3-way merge...
	No changes -- Patch already applied.

V tomto případě jsem se pokoušel aplikovat záplatu, kterou už jsem jednou aplikoval. Bez parametru `-3` se celá situace tváří jako konflikt.

Pokud aplikujete několik záplat z jednoho souboru mbox, můžete příkaz `am` spustit také v interaktivním režimu, který zastaví před každou záplatou, kterou najde, a zeptá se vás, zda ji chcete aplikovat:

	$ git am -3 -i mbox
	Commit Body is:
	--------------------------
	seeing if this helps the gem
	--------------------------
	Apply? [y]es/[n]o/[e]dit/[v]iew patch/[a]ccept all

To oceníte v situaci, kdy máte uložených několik záplat. Pokud si nepamatujete, o co v dané záplatě šlo, můžete si ho před aplikací prohlédnout. Stejně tak vyloučíte záplaty, které jste už jednou aplikovali.

Až budete mít všechny záplaty aplikovány a zapsány do tematické větve, můžete se rozhodnout, zda a jak je chcete integrovat do některé z trvalejších větví.

## Checkout vzdálených větví

Pokud váš příspěvek pochází od uživatele systému Git, který založil vlastní repozitář, odeslal do něj sérii změn a následně vám poslal adresu URL k repozitáři a název vzdálené větve, v níž změny najdete, můžete je přidat jako vzdálené a lokálně je začlenit.

Pokud vám tedy například Jessica pošle e-mail, že vytvořila skvělou novou funkci ve větvi `ruby-client` ve svém repozitáři, můžete funkci otestovat tak, že přidáte větev jako vzdálenou a provedete její lokální checkout:

	$ git remote add jessica git://github.com/jessica/myproject.git
	$ git fetch jessica
	$ git checkout -b rubyclient jessica/ruby-client

Pokud vám později opět pošle e-mail, že jiná větev obsahuje další skvělou funkci, můžete tuto větev vyzvednout a provést její checkout, protože už máte nastaven tento repozitář jako vzdálený.

Tuto možnost využijete zejména tehdy, když s někým spolupracujete dlouhodobě. Má-li někdo jen jednu záplatu, jíž chce právě teď přispět, bude rychlejší, pokud vám záplatu doručí e-mailem, než abyste všechny vývojáře nutili provozovat kvůli pár záplatám vlastní servery a pravidelně přidávat a odstraňovat vzdálené repozitáře. Pravděpodobně také nebudete chtít mít nastaveny stovky vzdálených serverů, z nichž byste dostávali po jednom nebo dvou záplatách. Situaci vám mohou usnadnit skripty a hostované služby. Do velké míry tu záleží na tom, jak vy a vaši vývojáři k vývoji přistupujete.

Další výhodou tohoto postupu je, že získáte rovněž historii revizí. Přestože můžete mít oprávněné problémy se slučováním, víte, kde ve své historii můžete hledat příčiny. Řádné třícestné sloučení je vždy lepším řešením, než zadat parametr `-3` a doufat, že byl patch vygenerován z veřejné revize, k níž máte přístup.

Pokud s někým nespolupracujete dlouhodobě, ale přesto od něj chcete stáhnout data touto cestou, můžete zadat adresu URL vzdáleného repozitáře k příkazu `git pull`. Příkaz provede jednorázové stažení a nebude ukládat URL jako referenci na vzdálený repozitář:

	$ git pull git://github.com/onetimeguy/project.git
	From git://github.com/onetimeguy/project
	 * branch            HEAD       -> FETCH_HEAD
	Merge made by recursive.

## Jak zjistit provedené změny

Nyní máte tematickou větev s prací, kterou jste obdrželi od jiného vývojáře. V tomto okamžiku můžete určit, jak s ní chcete naložit. V této části zopakujeme některé příkazy a podíváme se, jak je můžete použít, chcete-li zjistit, co přesně se stane, pokud novou práci začleníte do své hlavní větve.

Často může být užitečné získat přehled o všech revizích, které jsou obsaženy v určité větvi, ale dosud nejsou ve vaší hlavní větvi. Revize v hlavní větvi lze vyloučit vložením parametru `--not` před název větve. Pokud vám například přispěvatel pošle dvě záplaty a vy vytvoříte větev s názvem `contrib`, do níž tyto záplaty aplikujete, můžete použít tento příkaz:

	$ git log contrib --not master
	commit 5b6235bd297351589efc4d73316f0a68d484f118
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Oct 24 09:53:59 2008 -0700

	    seeing if this helps the gem

	commit 7482e0d16d04bea79d0dba8988cc78df655f16a0
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Mon Oct 22 19:38:36 2008 -0700

	    updated the gemspec to hopefully work better

Chcete-li zjistit, jaké změny byly v jednotlivých revizích provedeny, můžete k příkazu `git log` přidat parametr `-p`, který ke každé revizi připojí rozdíly ve formátu diff.

Chcete-li vidět plný výpis diff, jak by vypadaly rozdíly, kdybyste tuto tematickou větev začlenili do jiné větve, můžete použít speciální trik, který vám zobrazí požadované informace. Můžete zadat následující příkaz:

	$ git diff master

Výstupem tohoto příkazu bude výpis diff, který však může být lehce matoucí. Jestliže se vaše větev `master` posunula vpřed od chvíle, kdy jste z ní vytvořili tematickou větev, budou výstupem příkazu zdánlivě nesmyslné výsledky. Je to z toho důvodu, že Git přímo srovnává snímky poslední revize v tematické větvi, na níž se nacházíte, se snímky poslední revize ve větvi `master`. Pokud jste například do souboru ve větvi `master` přidali jeden řádek, přímé srovnání snímků bude vypadat, jako by měla tematická větev tento řádek odstranit.

Pokud je větev `master` přímým předkem vaší tematické větve, nebude s příkazem žádný problém. Pokud se však obě historie v nějakém bodě rozdělily, bude výpis diff vypadat, jako byste chtěli přidat všechna nová data v tematické větvi a odstranit vše, co je pouze ve větvi `master`.

To, co chcete vidět ve skutečnosti, jsou změny přidané do tematické větve, práci, kterou provedete začleněním této větve do větve hlavní. Tohoto srovnání dosáhnete tak, že necháte Git porovnat poslední revizi ve vaší tematické větvi s prvním předkem, kterého má společného s hlavní větví.

Můžete tedy explicitně najít společného předka obou větví a spustit na něm příkaz diff:

	$ git merge-base contrib master
	36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
	$ git diff 36c7db

To však není příliš pohodlný způsob, a proto Git nabízí jinou možnost, jak lze provést stejnou věc: trojtečkovou syntaxi. V kontextu příkazu `diff` můžete vložit tři tečky za druhou větev – získáte výpis `diff` mezi poslední revizí větve, na níž se nacházíte, a společným předkem s druhou větví:

	$ git diff master...contrib

Tento příkaz zobrazí pouze práci, která byla ve vaší aktuální tematické větvi provedena od chvíle, kdy se oddělila od hlavní větve. Určitě uděláte dobře, pokud si tuto syntaxi zapamatujete.

## Integrace příspěvků

Když už je práce v tematické větvi připravena a může být integrována do některé z významnějších větví, vyvstává otázka, jak to provést. A vůbec, jaký celkový pracovní postup zvolíte ke správě projektu? Existuje hned několik možností. Na některé z nich se můžeme podívat.

### Pracovní postupy založené na slučování

Jeden jednoduchý pracovní postup začlení vaší práci do větve `master`. V tomto scénáři obsahuje vaše větev `master` převážně jen stabilní kód. Máte-li v tematické větvi práci, kterou jste vytvořili nebo kterou vám někdo doručil a vy jste ji schválili, začleníte ji do své hlavní větve, smažete tematickou větev a proces může pokračovat. Máme-li repozitář s prací ve dvou větvích pojmenovaných `ruby_client` a `php_client`, který vypadá jako na obrázku 5-19, a začleníme nejprve větev `ruby_client` a poté `php_client`, bude naše historie vypadat jako na obrázku 5-20.


![](http://git-scm.com/figures/18333fig0519-tn.png)

Obrázek 5-19. Historie s několika tematickými větvemi


![](http://git-scm.com/figures/18333fig0520-tn.png)

Obrázek 5-20. Po začlenění tematické větve

Jedná se patrně o nejjednodušší pracovní postup. Je však problematický, pokud ho používáme u velkých repozitářů nebo projektů.

Máte-li více vývojářů nebo větší projekt, pravděpodobně budete chtít použít přinejmenším dvoufázový cyklus začlenění. V tomto scénáři máte dvě dlouhodobé větve, hlavní větev `master` a větev `develop`. Určíte, že větev `master` bude aktualizována, pouze když je k dispozici velmi stabilní verze a do větve `develop` je integrován veškerý nový kód. Obě tyto větve pravidelně odesíláte do veřejného repozitáře. Pokaždé, když máte novou tematickou větev k začlenění (obrázek 5-21), začleníte ji do větve `develop` (obrázek 5-22). Když poté označujete vydání, posunete větev `master` rychle vpřed do místa, kde je nyní větev `develop` stabilní (obrázek 5-23).


![](http://git-scm.com/figures/18333fig0521-tn.png)

Obrázek 5-21. Před začleněním tematické větve


![](http://git-scm.com/figures/18333fig0522-tn.png)

Obrázek 5-22. Po začlenění tematické větve


![](http://git-scm.com/figures/18333fig0523-tn.png)

Obrázek 5-23. Po vydání tematické větve

Pokud někdo při tomto postupu klonuje repozitář vašeho projektu, může provést buď checkout hlavní větve, aby získal nejnovější stabilní verzi a udržoval ji aktuální, nebo checkout větve develop, která může být ještě o něco napřed.
Tento koncept můžete dále rozšířit o integrační větev, v níž budete veškerou práci slučovat. Teprve pokud je kód v této větvi stabilní a projde testováním, začleníte ho do větve develop. A až se větev develop ukáže v některém okamžiku jako stabilní, posunete rychle vpřed i svou hlavní větev.

### Pracovní postupy se začleňováním velkého objemu dat

Váš projekt Git má čtyři trvalé větve: `master`, `next` a `pu` (proposed updates, tj. návrh aktualizací) pro novou práci a `maint` pro backporty správy. Pokud přispěvatelé vytvoří novou práci, je shromažďována v tematických větvích v repozitáři správce podobným způsobem, jaký už jsem popisoval (viz obrázek 5-24). Nyní budou tematické větve vyhodnoceny, zda jsou bezpečné a mohou být aplikovány, nebo zda potřebují další úpravy. Jsou-li vyhodnoceny jako bezpečné, budou začleněny do větve `next` a ta bude následně odeslána do repozitáře, aby mohli všichni vyzkoušet, jak fungují tematické větve po sloučení.


![](http://git-scm.com/figures/18333fig0524-tn.png)

Obrázek 5-24. Správa komplexní série současně zpracovávaných příspěvků v tematických větvích

Pokud ale tematické větve vyžadují další úpravy, budou začleněny do větve `pu`. Pokud se ukáže, že jsou tyto tematické větve naprosto stabilní, budou začleněny do větve `master` a poté budou znovu sestaveny z tematických větví, které byly ve větvi `next`, ale ještě se nedostaly do větve `master`. To znamená, že se větev `master` téměř neustále posouvá vpřed, větev `next` je čas od času přeskládána a větev `pu` je přeskládávána ještě o něco častěji (viz obrázek 5-25).


![](http://git-scm.com/figures/18333fig0525-tn.png)

Obrázek 5-25. Začlenění tematických větví s příspěvky do dlouhodobých integračních větví

Byla-li tematická větev konečně začleněna do větve `master`, může být odstraněna z repozitáře. Projekt Git má kromě toho větev `maint`, která byla odštěpena z posledního vydání a představuje záplaty backportované pro případ, že by bylo třeba vydat opravnou verzi. Pokud tedy klonujete repozitář Git, můžete stáhnout až čtyři větve, a hodnotit tak projekt na čtyřech různých úrovních vývoje. Záleží na vás, do jaké hloubky chcete proniknout nebo jak chcete přispívat. A správce projektu má k dispozici strukturovaný pracovní postup k evaluaci nových příspěvků.

### Pracovní postupy s přeskládáním a částečným převzetím

Jiní správci dávají před začleněním práce z příspěvků přednost jejímu přeskládání nebo částečnému převzetí na vrchol hlavní větve, čímž udržují historii co nejlineárnější. Máte-li určitou práci v tematické větvi a rozhodli jste se, že ji integrujete, přejdete na tuto větev a spustíte příkaz rebase, jímž znovu sestavíte příslušné změny na vrcholu svojí aktuální hlavní větve (příp. větve `develop` apod.). Pokud vše funguje, můžete větev `master` posunout rychle vpřed a výsledkem procesu bude lineární historie projektu.

Druhým způsobem, jak přesunout práci z jedné větve do druhé, je tzv. částečné převzetí (angl. cherry picking, tedy něco jako „vyzobání třešniček“). Částečné převzetí lze v systému Git přirovnat k přeskládání jedné revize. Při této operaci vezme systém záplatu, která byla provedena v dané revizi, a pokusí se ji znovu aplikovat na větev, na níž se právě nacházíte. To využijete například v situaci, kdy máte několik revizí v tematické větvi, ale chcete integrovat pouze jednu z nich. Částečné převzetí však můžete použít i místo přeskládání, pokud máte v tematické větvi pouze jednu revizi. Uvažujme tedy projekt, který vypadá jako na obrázku 5-26.


![](http://git-scm.com/figures/18333fig0526-tn.png)

Obrázek 5-26. Uvažovaná historie před částečným převzetím

Chcete-li do hlavní větve natáhnout revizi `e43a6`, můžete zadat následující příkaz:

	$ git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
	Finished one cherry-pick.
	[master]: created a0a41a9: "More friendly message when locking the index fails."
	 3 files changed, 17 insertions(+), 3 deletions(-)

Tímto natáhnete stejnou změnu, která byla provedena revizí `e43a6`, avšak hodnota SHA-1 obou revizí se bude lišit, neboť bude rozdílné datum aplikace. Vaše historie revizí bude nyní vypadat jako na obrázku 5-27.


![](http://git-scm.com/figures/18333fig0527-tn.png)

Obrázek 5-27. Historie po částečném převzetí revize z tematické větve

Nyní můžete tematickou větev odstranit a zahodit revize, které nehodláte natáhnout do jiné větve.

## Označení vydání značkou

Až se rozhodnete vydat určitou verzi, pravděpodobně ji budete chtít označit značkou, abyste mohli toto vydání v kterémkoli okamžiku v budoucnosti obnovit. Novou značku vytvoříte podle návodu v kapitole 2. Pokud se rozhodnete podepsat značku jako správce, bude označení probíhat takto:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gmail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Pokud své značky podepisujete, můžete mít problémy s distribucí veřejného klíče PGP použitého k podepsání značky. Správce projektu Git vyřešil tento problém tak, že přidal svůj veřejný klíč jako blob do repozitáře a poté vložil značku, která ukazuje přímo na tento obsah. Pomocí příkazu `gpg --list-keys` můžete určit, jaký klíč chcete:

	$ gpg --list-keys
	/Users/schacon/.gnupg/pubring.gpg
	---------------------------------
	pub   1024D/F721C45A 2009-02-09 [expires: 2010-02-09]
	uid                  Scott Chacon <schacon@gmail.com>
	sub   2048g/45D02282 2009-02-09 [expires: 2010-02-09]

Poté můžete klíč přímo importovat do databáze Git: vyexportujte ho a použijte příkaz `git hash-object`, který zapíše nový blob s tímto obsahem do systému Git a vrátí vám otisk SHA-1 tohoto blobu:

	$ gpg -a --export F721C45A | git hash-object -w --stdin
	659ef797d181633c87ec71ac3f9ba29fe5775b92

Nyní máte obsah svého klíče v systému Git a můžete vytvořit značku, která bude ukazovat přímo na něj. Zadejte proto novou hodnotu SHA-1, kterou jste získali příkazem `hash-object`:

	$ git tag -a maintainer-pgp-pub 659ef797d181633c87ec71ac3f9ba29fe5775b92

Zadáte-li příkaz `git push --tags`, začnete značku `maintainer-pgp-pub` sdílet s ostatními. Bude-li chtít značku kdokoli ověřit, může přímo importovat váš klíč PGP tak, že stáhne blob z databáze a naimportuje ho do programu GPG:

	$ git show maintainer-pgp-pub | gpg --import

Klíč pak může použít k ověření všech vašich podepsaných značek. Pokud navíc zadáte do zprávy značky další instrukce k jejímu ověření, může si je koncový uživatel zobrazit příkazem `git show <tag>`.

## Vygenerování čísla sestavení

Git nepoužívá pro jednotlivé revize monotónně rostoucí čísla („v123“ apod.), a proto možná rádi využijete příkaz `git describe`, jímž lze každé revizi přiřadit běžně zpracovatelný název. Git vám poskytne název nejbližší značky s počtem revizí na vrcholu této značky a část hodnoty SHA-1 revize, k níž se popis vztahuje:

	$ git describe master
	v1.6.2-rc1-20-g8c5b85c

Díky tomu lze snímek nebo sestavení (build) vyexportovat a přiřadit mu pro člověka srozumitelný název. Pokud sestavujete Git ze zdrojového kódu naklonovaného z repozitáře Git, získáte po spuštění příkazu `git --version` něco, co vypadá zhruba podobně. Zadáváte-li popis revize, kterou jste právě opatřili značkou, dostanete název této značky.

Příkaz `git describe` upřednostňuje anotované značky (značky vytvořené s příznakem `-a` nebo `-s`). Pokud tedy používáte příkaz `git describe`, abyste se při vytváření popisu ujistili, že je revize pojmenována správně, měli byste značky jednotlivých vydání vytvářet tímto způsobem. Tento řetězec můžete také použít jako cíl příkazu checkout nebo show, ačkoli ty pracují se zkrácenou hodnotou SHA-1, a tak nebudou platné navždy. Například jádro Linuxu nyní přešlo z 8 na 10 znaků, aby byla zajištěna jedinečnost objektů SHA-1. Starší výstupy příkazu `git describe` proto už nebudou platné.

## Příprava vydání

Nyní budete chtít sestavení vydat. Jednou z věcí, kterou budete chtít udělat, je vytvoření archivu nejnovějšího snímku vašeho kódu pro všechny nebohé duše, které nepoužívají systém Git. Příkaz pro vytvoření archivu zní `git archive`:

	$ git archive master --prefix='project/' | gzip > `git describe master`.tar.gz
	$ ls *.tar.gz
	v1.6.2-rc1-20-g8c5b85c.tar.gz

Až někdo tento tarball otevře, získá nejnovější snímek vašeho projektu v projektovém adresáři. Stejným způsobem můžete vytvořit také archiv zip. K příkazu `git archive` stačí přidat parametr `--format=zip`:

	$ git archive master --prefix='project/' --format=zip > `git describe master`.zip

Nyní máte vytvořen tarball a archiv zip k vydání svého projektu, které můžete nahrát na svou webovou stránku nebo rozeslat e-mailem.

## Příkaz „shortlog“

Nyní je na čase obeslat e-mailem poštovní konferenci lidí, kteří chtějí vědět, co je ve vašem projektu nového. Elegantním způsobem, jak rychle získat určitý druh záznamu o změnách (changelog), které byly do projektu přidány od posledního vydání nebo e-mailu, je použít příkaz `git shortlog`. Příkaz shrne všechny revize v zadaném rozmezí. Například následující příkaz zobrazí shrnutí všech revizí od posledního vydání (pokud bylo vaše poslední vydání pojmenováno v1.0.1):

	$ git shortlog --no-merges master --not v1.0.1
	Chris Wanstrath (8):
	      Add support for annotated tags to Grit::Tag
	      Add packed-refs annotated tag support.
	      Add Grit::Commit#to_patch
	      Update version and History.txt
	      Remove stray `puts`
	      Make ls_tree ignore nils

	Tom Preston-Werner (4):
	      fix dates in history
	      dynamic version method
	      Version bump to 1.0.2
	      Regenerated gemspec for version 1.0.2

Výstupem příkazu je čisté shrnutí všech revizí od v1.0.1, seskupené podle autora, kterého můžete přidat do e-mailu své konference.
