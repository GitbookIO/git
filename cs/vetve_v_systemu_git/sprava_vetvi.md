# Správa větví

Nyní, když jste vytvořili, sloučili a odstranili své první větve, můžeme se podívat na pár nástrojů ke správě větví, které se vám budou hodit, až začnete s větvemi pracovat pravidelně.

Příkaz `git branch` umí víc, než jen vytvářet a mazat větve. Pokud ho spustíte bez dalších parametrů, získáte prostý výpis všech aktuálních větví:

	$ git branch
	  iss53
	* master
	  testing

Všimněte si znaku `*`, který předchází větvi `master`. Označuje větev, na níž se právě nacházíte. Pokud tedy nyní zapíšete revizi, vaše nová práce posune vpřed větev `master`. Chcete-li zobrazit poslední revizi na každé větvi, spusťte příkaz `git branch -v`:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Další užitečnou funkcí ke zjištění stavu vašich větví je filtrování tohoto seznamu podle větví, které byly/nebyly začleněny do větve, na níž se právě nacházíte. K tomuto účelu slouží v systému Git od verze 1.5.6 užitečné příkazy `--merged` a `--no-merged`. Chcete-li zjistit, které větve už byly začleněny do větve, na níž se nacházíte, spusťte příkaz `git branch --merged`:

	$ git branch --merged
	  iss53
	* master

Jelikož už jste větev `iss53` začlenili, nyní se zobrazí ve výpisu. Větve v tomto seznamu, které nejsou označeny `*`, lze většinou snadno smazat příkazem `git branch -d`. Jejich obsah už jste převzali do jiné větve, a tak jejich odstraněním nepřijdete o žádnou práci.

Chcete-li zobrazit větve, které obsahují dosud nezačleněnou práci, spusťte příkaz `git branch --no-merged`:

	$ git branch --no-merged
	  testing

Nyní se zobrazila jiná větev. Jelikož obsahuje práci, která ještě nebyla začleněna, bude pokus o její smazání příkazem `git branch -d` neúspěšný:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Pokud chcete větev skutečně odstranit a zahodit práci, kterou obsahuje, můžete si to vynutit parametrem `-D` (jak napovídá užitečná zpráva pod řádkem s chybovým hlášením).
