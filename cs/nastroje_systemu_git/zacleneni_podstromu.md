# Začlenění podstromu

Nyní, když jsme poznali obtíže spojené se systémem submodulů, podívejme se na jedno alternativní řešení tohoto problému. Git se vždy při slučování nejprve podívá, co a kam začleňuje, a podle toho zvolí vhodnou strategii začlenění. Pokud slučujete dvě větve, používá Git rekurzivní strategii. Pokud slučujete více než dvě větve, zvolí Git tzv. strategii chobotnice (octopus strategy). Git vybírá tyto strategie automaticky. Rekurzivní strategie zvládá složité třícestné slučování (např. s více než jedním společným předkem), ale nedokáže sloučit více než dvě větve. Chobotnicové sloučení dokáže naproti tomu sloučit několik větví, ale je opatrnější při předcházení složitým konfliktům. Proto je ostatně nastaveno jako výchozí strategie při slučování více než dvou větví.

Existují však ještě další strategie. Jednou z nich je tzv. začlenění podstromu (subtree merge), které lze použít jako řešení problémů se subprojektem. Ukažme si, jak se dá začlenit stejný adresář rack jako v předchozí části, tentokrát však s využitím strategie začlenění podstromu.

Začlenění podstromu spočívá v tom, že máte dva projekty a jeden z projektů se promítá do podadresáře druhého projektu a naopak. Pokud určíte strategii začlenění podstromu, je Git natolik inteligentní, aby zjistil, že je jeden podstromem druhého, a provedl sloučení odpovídajícím způsobem – počíná si opravdu sofistikovaně.

Nejprve přidáte aplikaci Rack do svého projektu. Projekt Rack přidáte ve vlastním projektu jako vzdálenou referenci a provedete jeho checkout do vlastní větve:

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

Nyní máte kořenový adresář s projektem Rack ve větvi `rack_branch` a vlastní projekt ve větvi `master`. Provedete-li checkout jedné a posléze druhé větve, uvidíte, že mají jiné kořenové adresáře:

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

Projekt Rack chcete do projektu `master` natáhnout jako podadresář. V systému Git k tomu slouží příkaz `git read-tree`. O příkazu `read-tree` a jeho příbuzných se více dočtete v kapitole 9, nyní však vězte, že načte kořenový strom jedné větve do vaší aktuální oblasti připravených změn a do pracovního adresáře. Přepnuli jste zpět na větev `master` a větev `rack` natáhnete do podadresáře `rack` své větve `master` hlavního projektu:

	$ git read-tree --prefix=rack/ -u rack_branch

Až zapíšete revizi, bude to vypadat, jako byste měli všechny soubory Rack v tomto podadresáři, jako byste je zkopírovali z tarballu. Je zajímavé, že tak lze opravdu jednoduše začlenit změny z jedné větve do druhé. Pokud je proto projekt Rack aktualizován, můžete natáhnout novější změny přepnutím na tuto větev a jejím natažením:

	$ git checkout rack_branch
	$ git pull

Tyto změny pak můžete začlenit zpět do hlavní větve. Můžete použít příkaz `git merge -s subtree` a začlenění proběhne úspěšně. Git však sloučí také obě historie, což pravděpodobně nebylo vaším záměrem. Chcete-li natáhnout změny a předběžně vyplnit zprávu k revizi, použijte parametry `--squash`, `--no-commit` a také parametr strategie `-s subtree`:

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

Všechny změny z projektu Rack budou začleněny a budete je moci lokálně zapsat. Můžete ale postupovat také opačně – provést změny v podadresáři `rack` vaší hlavní větve, poté je začlenit do větve `rack_branch` a poslat je správcům nebo je odeslat do repozitáře.

Chcete-li se podívat na výpis „diff“ s rozdíly mezi tím, co máte v podadresáři `rack`, a kódem ve větvi `rack_branch` (abyste věděli, jestli je nutné je slučovat), nelze použít běžný příkaz `diff`. V tomto případě je třeba zadat příkaz `git diff-tree` a větev, s níž chcete srovnání provést:

	$ git diff-tree -p rack_branch

Popřípadě chcete-li porovnat, co je ve vašem podadresáři `rack`, s tím, co bylo ve větvi `master` na serveru v okamžiku, kdy jste naposledy vyzvedávali data, spusťte příkaz:

	$ git diff-tree -p rack_remote/master
