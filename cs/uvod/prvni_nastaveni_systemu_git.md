# První nastavení systému Git

Nyní, když máte Git nainstalovaný, můžete provést některá uživatelská nastavení systému. Nastavení stačí provést pouze jednou — zůstanou zachována i po případných aktualizacích.

Nastavení konfiguračních proměnných systému, které ovlivňují jak vzhled systému Git, tak ostatní aspekty jeho práce, umožňuje příkaz git config. Tyto proměnné mohou být uloženy na třech různých místech:

*	Soubor `/etc/gitconfig` obsahuje údaje o všech uživatelích systému a jejich repozitářích. Pokud příkazu `git config` zadáme parametr `--system` bude číst a zapisovat jen do tohoto souboru.
*	Soubor `~/.gitconfig` je vázán na uživatelský účet. Čtení a zápis do tohoto souboru zajistíte zadáním parametru `--global`.
*	Konfigurační soubor v adresáři Git (tedy `.git/config`) jakéhokoliv užívaného repozitáře přísluší tomuto konkrétnímu repozitáři. Každá úroveň je nadřazená hodnotám úrovně předchozí, takže hodnoty  v `.git/config` přebíjejí hodnotami v `/etc/gitconfig`.

Ve Windows používá Git soubor `.gitconfig`, který je umístěný v adresáři `$HOME` (v prostředí Windows je to `%USERPROFILE%`), což je u většiny uživatelů `C:\Documents and Settings\$USER` nebo `C:\Users\$USER` (kde `$USER` se v prostředí Windows označuje `%USERNAME%`). I ve Windows se hledá soubor `/etc/gitconfig`, který je ale umístěn relativně v kořeni Msys, tedy vůči místu, do kterého jste se po spuštění instalačního programu rozhodli Git nainstalovat.

## Totožnost uživatele

První věcí, kterou byste měli po nainstalování systému Git udělat, je nastavení uživatelského jména (user name) a e-mailové adresy. Tyto údaje se totiž později využívají při všech revizích v systému Git a jsou nezměnitelnou složkou každé revize, kterou zapíšete:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Použijete-li parametr `--global`, pak také toto nastavení stačí provést pouze jednou. Git bude používat tyto údaje pro všechny operace, které v systému uděláte. Pokud chcete pro konkrétní projekty změnit uživatelské jméno nebo e-mailovou adresu, můžete příkaz spustit bez parametru `--global`. V takovém případě je nutné, abyste se nacházeli v adresáři daného projektu.

## Nastavení editoru

Nyní, když jste zadali své osobní údaje, můžete nastavit výchozí textový editor, který bude Git využívat pro psaní zpráv. Pokud toto nastavení nezměníte, bude Git používat výchozí editor vašeho systému, jímž je většinou Vi nebo Vim. Chcete-li používat jiný textový editor (např. Emacs), můžete použít následující příkaz:

	$ git config --global core.editor emacs

## Nastavení nástroje diff

Další proměnnou, jejíž nastavení můžete považovat za užitečné, je výchozí nástroj diff, jenž bude Git používat k řešení konfliktů při slučování. Řekněme, že jste se rozhodli používat vimdiff:

	$ git config --global merge.tool vimdiff

Jako platné nástroje slučování Git akceptuje: kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge a opendiff. Nastavit můžete ale i jiné uživatelské nástroje — více informací o této možnosti naleznete v kapitole 7.

## Kontrola provedeného nastavení

Chcete-li zkontrolovat provedené nastavení, použijte příkaz `git config --list`. Git vypíše všechna aktuálně dostupná nastavení:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Některé klíče se mohou objevit vícekrát, protože Git načítá stejný klíč z různých souborů (např. `/etc/gitconfig` a `~/.gitconfig`). V takovém případě použije Git poslední hodnotu pro každý unikátní klíč, který vidí.

Můžete také zkontrolovat, jakou hodnotu Git uchovává pro konkrétní položku. Zadejte příkaz `git config {key}`:

	$ git config user.name
	Scott Chacon
