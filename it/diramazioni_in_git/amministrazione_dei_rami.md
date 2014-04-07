# Amministrazione dei Rami

Ora che hai creato, fuso ed eliminato alcuni rami, diamo un'occhiata ad alcuni strumenti di amministrazione dei rami che risulteranno utili quando inizierai ad usare i rami di continuo.

Il comando `git branch` fa molto di più che creare ed eliminare rami. Se lo lanci senza argomenti, otterrai una semplice lista dei rami correnti:

	$ git branch
	  iss53
	* master
	  testing

Nota il carattere `*` che precede il ramo `master`: esso indica il ramo in cui ti trovi in questo momento. Significa che se esegui un commit a questo punto, il ramo `master` avanzerà con il tuo lavoro. Per vedere l'ultimo commit di ogni ramo, puoi lanciare `git branch -v`:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Un'altra opzione utile per vedere in che stato sono i tuoi rami è filtrare la lista dei rami stessi che hai e non hai ancora fuso nel ramo in cui ti trovi attualmente. Le opzioni utili `--merged` e `--no-merged` sono disponibili in Git dalla versione 1.5.6 per questo scopo. Per vedere quali rami sono già stati fusi nel ramo attuale, puoi lanciare `git branch --merged`:

	$ git branch --merged
	  iss53
	* master

Dato che già hai fuso precedentemente `iss53`, lo vedrai nella tua lista.  Rami in questa lista senza lo `*` davanti possono generalmente essere eliminati con `git branch -d`; hai già incorporato il loro lavoro in un altro ramo, quindi non perderai niente.

Per vedere tutti i rami che contengono un lavoro non ancora fuso nel ramo attuale, puoi lanciare `git branch --no-merged`:

	$ git branch --no-merged
	  testing

Questo mostrerà gli altri tuoi rami. Dato che contengono lavoro che non è stato ancora fuso, cercare di eliminarle con `git branch -d` fallirà:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Se vuoi realmente cancellare questo ramo e perdere il lavoro svolto, puoi forzare la cosa con `-D`, come l'utile messaggio ti fa notare.
