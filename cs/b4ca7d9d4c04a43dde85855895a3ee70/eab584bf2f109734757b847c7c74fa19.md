# Refspec

V celé této knize jsme používali jednoduché mapování ze vzdálených větví do lokálních referencí. Mapování však může být i komplexnější.
Řekněme, že přidáte například tento vzdálený repozitář:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

Přidáte tím novou část do souboru `.git/config`, určíte název vzdáleného serveru (`origin`), URL vzdáleného repozitáře a refspec pro vyzvednutí dat:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

Refspec má následující formát: fakultativní znak `+`, za nímž následuje `<src>:<dst>`, kde `<src>` je vzor pro referenci na straně vzdáleného serveru a `<dst>` je lokální umístění, kam mají být tyto reference zapsány. Znak `+` systému Git říká, aby aktualizoval referenci i v případě, že nesměřuje „rychle vpřed“.

Ve výchozím případě, který se automaticky zapisuje příkazem `git remote add`, Git vyzvedne všechny reference z adresáře `refs/heads/` na serveru a zapíše je do lokálního adresáře `refs/remotes/origin/`. Je-li tedy na serveru hlavní větev `master`, lokálně lze získat přístup k jejímu logu některým z příkazů:

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

Všechny tři jsou přitom ekvivalentní, protože Git vždy rozšíří jejich podobu na `refs/remotes/origin/master`.

Pokud ale raději chcete, aby Git pokaždé stáhl pouze větev `master` a nestahoval žádné jiné větve na vzdáleném serveru, změňte řádek příkazu fetch na:

	fetch = +refs/heads/master:refs/remotes/origin/master

Toto je výchozí vzorec refspec pro příkaz `git fetch` pro tento vzdálený server. Chcete-li nějakou akci provést pouze jednou, můžete použít refspec také na příkazovém řádku. Chcete-li stáhnout větev `master` ze vzdáleného serveru do lokálního adresáře `origin/mymaster`, můžete zadat příkaz:

	$ git fetch origin master:refs/remotes/origin/mymaster

Použít lze také kombinaci několika vzorců refspec. Několik větví můžete přímo z příkazového řádku stáhnout například takto:

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

V tomto případě bylo odeslání hlavní větve odmítnuto, protože reference nesměřovala „rychle vpřed“. Odmítnutí serveru můžete potlačit zadáním znaku `+` před vzorec refspec.

V konfiguračním souboru můžete také použít více vzorců refspec pro vyzvedávání dat. Chcete-li pokaždé vyzvednout hlavní větev a větev „experiment“, vložte do něj tyto dva řádky:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Ve vzorci nelze použít částečné nahrazení, např. toto zadání by bylo neplatné:

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

Místo nich však můžete využít možností jmenného prostoru. Jestliže pracujete v QA týmu, který odesílá několik větví, a vy chcete stáhnout hlavní větev a všechny větve QA týmu, avšak žádné jiné, můžete použít například takovouto část konfigurace:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

Jestliže používáte komplexní pracovní proces, kdy QA tým odesílá větve, vývojáři odesílají větve a integrační týmy odesílají větve a spolupracují na nich, můžete takto jednoduše využít možností, jež vám jmenný prostor nabízí.

## Odesílání vzorců refspec

Je sice hezké, že můžete tímto způsobem vyzvedávat reference na základě jmenného prostoru, jenže jak vůbec QA tým dostane své větve do jmenného prostoru `qa/`? Tady vám při odesílání větví pomůže vzorec refspec.

Chce-li QA tým odeslat větev `master` do adresáře `qa/master` na vzdáleném serveru, může použít příkaz:

	$ git push origin master:refs/heads/qa/master

Chcete-li, aby toto Git provedl automaticky pokaždé, když spustíte příkaz `git push origin`, můžete do konfiguračního souboru vložit hodnotu `push`:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

Touto hodnotou zajistíte, že bude příkaz `git push origin` odesílat lokální větev `master` do vzdálené větve `qa/master`.

## Mazání referencí

Vzorce refspec můžete využít také k mazání referencí ze vzdáleného serveru. Spustit lze například příkaz následujícího znění:

	$ git push origin :topic

Vynecháte-li z původního vzorce refspec ve tvaru `<src>:<dst>` část `<src>`, říkáte v podstatě, aby byla větev „topic“ na vzdáleném serveru nahrazena ničím, čímž ji smažete.
