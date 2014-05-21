# Hostování projektů Git

Pokud nemáte chuť absolvovat celý proces nastavování vlastního serveru Git, existuje několik možností hostování vašich projektů Git na externím specializovaném hostingovém místě. Toto řešení vám nabízí celou řadu výhod. Hostingové místo má většinou velmi rychlé nastavení, snadno se na něm spouštějí projekty a nevyžaduje od vás správu ani monitoring serveru. Dokonce i když budete nastavovat a spouštět interně svůj vlastní server, budete možná přesto chtít použít veřejné hostingové místo pro otevřený zdrojový kód – komunita open source vývojářů si vás tak snáze najde a pomůže vám.

V dnešní době můžete vybírat z velkého počtu možností hostingu. Každá má jiné klady a zápory. Aktuální seznam těchto míst najdete na stránce GitHosting, dostupné z hlavní stránky GitWiki:

	https://git.wiki.kernel.org/index.php/GitHosting

Protože se tu nemůžeme věnovat všem možnostem a protože shodou okolností na jednom hostingovém místě pracuji, využijeme tuto část k tomu, abychom ukázali nastavení účtu a vytvoření nového projektu na serveru GitHub. Získáte tak představu, co všechno vás čeká.

GitHub je zdaleka největším hostingovým místem pro projekty Git s otevřeným zdrojovým kódem a je zároveň jedním z velmi mála těch, která nabízejí možnosti jak veřejného, tak soukromého hostingu. Na jednom místě tak můžete mít uložen jak otevřený zdrojový kód, tak soukromý komerční kód. GitHub se ostatně soukromě podílel i na vzniku této knihy.

## GitHub

GitHub se nepatrně liší od většiny míst hostujících zdrojový kód ve způsobu, jak zachází se jmenným prostorem projektů. Ten tu není založen primárně na názvu projektu, ale na uživateli. To znamená, že pokud budu hostovat svůj projekt `grit` na serveru GitHub, nenajdete ho na adrese `github.com/grit`, ale jako `github.com/schacon/grit`. Neexistuje tu žádná standardní verze projektu, která by umožňovala kompletní přechod projektu z jednoho uživatele na druhého, jestliže první autor projekt ukončí.

GitHub je zároveň komerční společnost, jejíž finanční příjmy plynou z účtů spravujících soukromé repozitáře. Kdokoli si však může rychle založit bezplatný účet k hostování libovolného počtu projektů s otevřeným kódem. A právě u účtů se teď na chvíli zastavíme.

## Založení uživatelského účtu

První věcí, kterou budete muset udělat, je vytvoření bezplatného uživatelské účtu. Jestliže na stránce „Pricing and Signup“ (`http://github.com/plans`) kliknete u bezplatného účtu (Free) na tlačítko „Sign Up“ (viz obrázek 4-2), přejdete na registrační stránku.


![](http://git-scm.com/figures/18333fig0402-tn.png)

Obrázek 4-2. Výběr typu účtu na serveru GitHub

Tady si budete muset zvolit uživatelské jméno, které zatím není v systému obsazeno, a zadat e-mailovou adresu, která bude přiřazena k účtu a heslu (viz obrázek 4-3).


![](http://git-scm.com/figures/18333fig0403-tn.png)

Obrázek 4-3. Registrační formulář na serveru GitHub

Po vyplnění osobních údajů nadešel vhodný čas k vložení vašeho veřejného klíče SSH. Jak vygenerovat nový klíč, jsme popsali výše, v části 4.3. Vezměte obsah veřejného klíče z daného páru a vložte ho do textového pole „SSH Public Key“. Kliknutím na odkaz „explain ssh keys“ přejdete na stránku s podrobnými instrukcemi, jak klíč vložit ve všech hlavních operačních systémech.
Kliknutím na tlačítko „I agree, sign me up“ přejdete na svůj nový uživatelský ovládací panel (viz obrázek 4-4).


![](http://git-scm.com/figures/18333fig0404-tn.png)

Obrázek 4-4. Uživatelský ovládací panel na serveru GitHub

Jako další krok následuje vytvoření nového repozitáře.

## Vytvoření nového repozitáře

Začněte kliknutím na odkaz „create a new one“ (vytvořit nový) vedle nadpisu „Your Repositories“ na ovládacím panelu. Přejdete tím na formulář „Create a New Repository“ (viz obrázek 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)

Obrázek 4-5. Vytvoření nového repozitáře na serveru GitHub

Vše, co tu bezpodmínečně musíte udělat, je zadat název projektu. Kromě toho můžete přidat i jeho popis. Poté klikněte na tlačítko „Create Repository“ (Vytvořit repozitář). Nyní máte na serveru GitHub vytvořen nový repozitář (viz obrázek 4-6).


![](http://git-scm.com/figures/18333fig0406-tn.png)

Obrázek 4-6. Záhlaví s informacemi o projektu na serveru GitHub

Protože v něm ještě nemáte uložen žádný kód, GitHub vám nabízí instrukce, jak vytvořit zcela nový projekt, odeslat sem existující projekt Git nebo naimportovat projekt z veřejného repozitáře Subversion (viz obrázek 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)

Obrázek 4-7. Instrukce k novému repozitáři

Tyto instrukce jsou podobné těm, které jsme už uváděli. K inicializaci projektu, pokud to ještě není projekt Git, použijte příkaz:

	$ git init
	$ git add .
	$ git commit -m 'initial commit'

Pokud už máte lokální repozitář Git, přidejte GitHub jako vzdálený server a odešlete na něj svou hlavní větev:

	$ git remote add origin git@github.com:testinguser/iphone_project.git
	$ git push origin master

Nyní je váš projekt hostován na serveru GitHub a vy můžete dát adresu URL komukoli, s kým chcete svůj projekt sdílet. V tomto případě je adresa `http://github.com/testinguser/iphone_project`. V záhlaví na stránce všech vašich projektů si můžete všimnout, že máte dvě adresy URL (viz obrázek 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)

Obrázek 4-8. Záhlaví projektu s veřejnou a soukromou adresou URL

„Public Clone URL“ je veřejná adresa Git pouze pro čtení, na níž si může váš projekt kdokoli naklonovat. Nemusíte se bát poskytnout tuto adresu ostatním nebo ji třeba zveřejnit na svých webových stránkách.

„Your Clone URL“ je SSH adresa ke čtení a zápisu, přes níž můžete číst a zapisovat. To však pouze v případě, že se připojíte se soukromým klíčem SSH asociovaným s veřejným klíčem, který jste zadali pro svého uživatele. Navštíví-li tuto stránku projektu ostatní uživatelé, tuto adresu URL neuvidí, zobrazí se jim pouze veřejná adresa.

## Import ze systému Subversion

Máte-li existující veřejný projekt Subversion, který byste rádi importovali do systému Git, GitHub vám s tím často ochotně pomůže. Dole na stránce s instrukcemi najdete odkaz na import ze systému Subversion. Pokud na něj kliknete, zobrazí se formulář s informacemi o importu a textové pole, kam můžete vložit adresu URL svého veřejného projektu Subversion (viz obrázek 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)

Obrázek 4-9. Rozhraní importu ze systému Subversion

Proces nejspíš nebude fungovat, pokud je váš projekt příliš velký, nestandardní nebo soukromý. V kapitole 7 se dostaneme k tomu, jak lze ručně importovat složitější projekty.

## Přidávání spolupracovníků

Nyní přidáme zbytek vašeho týmu. Pokud si John, Josie i Jessica zaregistrují účty na serveru GitHub a vy jim chcete udělit oprávnění k odesílání dat do svého repozitáře, můžete je do svého projektu přidat jako spolupracovníky. Spolupracovníci mohou odesílat data i na základě svých veřejných klíčů.

Kliknutím na tlačítko „edit“ v záhlaví projektu nebo na záložce „Admin“ v horní části projektu se dostanete na stránku správy vašeho projektu na serveru GitHub (viz obrázek 4-10).


![](http://git-scm.com/figures/18333fig0410-tn.png)

Obrázek 4-10. Stránka správy na serveru GitHub

Chcete-li k svému projektu poskytnout oprávnění pro zápis ještě dalším uživatelům, klikněte na odkaz „Add another collaborator“ (Přidat dalšího spolupracovníka). Zobrazí se nové textové pole, do nějž můžete zadat jméno uživatele. Během psaní se zobrazuje pomocník, který vám navrhuje možná dokončení uživatelského jména. Poté, co najdete správného uživatele, klikněte na tlačítko „Add“. Tím uživatele přidáte jako spolupracovníka na svém projektu (viz obrázek 4-11).


![](http://git-scm.com/figures/18333fig0411-tn.png)

Obrázek 4-11. Přidání spolupracovníka do projektu

Po přidání všech spolupracovníků byste měli vidět jejich seznam v poli „Repository Collaborators“ (viz obrázek 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)

Obrázek 4-12. Seznam spolupracovníků na projektu

Pokud potřebujete oprávnění pro některého z uživatelů zrušit, klikněte na odkaz „revoke“. Tím odstraníte jeho oprávnění k odesílání dat. U budoucích projektů budete také moci zkopírovat skupinu spolupracovníků zkopírováním oprávnění z existujícího projektu.

## Váš projekt

Po odeslání projektu nebo jeho naimportování ze systému Subversion budete mít hlavní stránku projektu, která bude vypadat přibližně jako na obrázku 4-13.


![](http://git-scm.com/figures/18333fig0413-tn.png)

Obrázek 4-13. Hlavní stránka projektu na serveru GitHub

Navštíví-li váš projekt ostatní uživatelé, tuto stránku uvidí. Obsahuje několik záložek k různým aspektům vašich projektů. Záložka „Commits“ zobrazuje seznam revizí v obráceném chronologickém pořadí, podobně jako výstup příkazu `git log`. Záložka „Network“ zobrazuje všechny uživatele, kteří rozštěpili váš projekt a přispěli do něj. Záložka „Downloads“ umožňuje nahrávat binární soubory k projektu a přidávat odkazy na tarbally a komprimované verze všech míst ve vašem projektu, které jsou označeny značkou (tagem). Záložka „Wiki“ vám nabízí stránku wiki, kam můžete napsat dokumentaci nebo jiné informace ke svému projektu. Záložka „Graphs“ graficky zobrazuje některé příspěvky a statistiky k vašemu projektu. Hlavní záložka „Source“, na níž se stránka otvírá, zobrazuje hlavní adresář vašeho projektu, a máte-li soubor README, automaticky ho zařadí na konec seznamu. Tato záložka obsahuje rovněž pole s informacemi o poslední zapsané revizi.

## Štěpení projektů

Chcete-li přispět do existujícího projektu, k němuž nemáte oprávnění pro odesílání, umožňuje GitHub rozštěpení projektu. Pokud se dostanete na zajímavou stránku projektu a chtěli byste se do projektu zapojit, můžete kliknout na tlačítko „fork“ (rozštěpit) v záhlaví projektu a GitHub vytvoří kopii projektu pro vašeho uživatele. Do ní pak můžete odesílat revize.

Díky tomu se projekty nemusí starat o přidávání uživatelů do role spolupracovníků, aby mohli odesílat své příspěvky. Uživatelé mohou projekt rozštěpit a odesílat do něj revize. Hlavní správce projektu tyto změny natáhne tím, že je přidá jako vzdálené repozitáře a začlení jejich data.

Chcete-li projekt rozštěpit, přejděte na stránku projektu (v tomto případě mojombo/chronic) a klikněte na tlačítko „fork“ v záhlaví (viz obrázek 4-14).


![](http://git-scm.com/figures/18333fig0414-tn.png)

Obrázek 4-14. Zapisovatelnou kopii jakéhokoli repozitáře získáte kliknutím na tlačítko „fork“.

Po několika sekundách přejdete na novou stránku svého projektu, která oznamuje, že je tento projekt rozštěpením (fork) jiného projektu (viz obrázek 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)

Obrázek 4-15. Vaše rozštěpení projektu

## Shrnutí k serveru GitHub

O serveru GitHub je to vše. Ještě jednou bych rád zdůraznil, že všechny tyto kroky lze provést opravdu velmi rychle. Vytvoření účtu, přidání nového projektu a odeslání prvních revizí je záležitostí několika minut. Je-li váš projekt otevřený zdrojový kód, získáte také obrovskou komunitu vývojářů, kteří nyní váš projekt uvidí, mohou ho rozštěpit a pomoci vám svými příspěvky. V neposlední řadě může být toto způsob, jak rychle zprovoznit a vyzkoušet systém Git.
