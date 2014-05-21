# Subtree Merging

Ora che hai visto quali sono le difficoltà del sistema dei moduli vediamo un’alternativa per risolvere lo stesso problema. Quando Git fa dei merge vede prima quello di cui deve fare il merge e poi decide quale sia la strategia migliore da usare. Se stai facendo il merge due branch Git userà la strategia _ricorsiva_ (*recursive* in inglese). Se stai facendo il merge di più di due branch Git userà la strategia del polpo (*octopus* in inglese). Queste strategie sono scelte automaticamente, perché la strategia ricorsiva può gestire situazioni complesse di merge a tre vie (quando ci sono per esempio più antenati), ma può gestire solamente due branch alla volta. La strategia del polpo può gestire branch multipli ma agisce con più cautela per evitare conflitti difficili da risolvere, ed è quindi scelta come strategia predefinita se stai facendo il merge di più di due branch.

Ci sono comunque altre strategie tra cui scegliere. Una di questa è il merge *subtree* e la puoi usare per risolvere i problemi dei subprogetti. Vedremo ora come includere lo stesso rack come abbiamo fatto nella sezione precedente, usando però il merge subtree.

L’idea del merge subtree è che tu hai due progetti e uno di questi è mappato su una subdirectory dell’altro e viceversa. Quando specifichi il merge subtree Git è abbastanza intelligente da capire che uno è un albero dell’altro e farne il merge nel migliore dei modi: è piuttosto incredibile.

Aggiungi prima l’applicazione Rack al tuo progetto e aggiungi il progetto Rack come un riferimento remoto al tuo progetto, quindi fanne il checkout in un suo branch:

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

Ora hai la root del progetto Rack nel tuo branch `rack_branch` e il tuo progetto nel branch `master`. Se scarichi prima uno e poi l’altro vedrai che avranno due progetti sorgenti:

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

Ora vuoi inviare il progetto Rack nel tuo progetto `master` come una sottodirectory e in Git puoi farlo con `git read-tree`. Conoscerai meglio `read-tree` e i suoi amici nel Capitolo 9, ma per ora sappi che legge la radice di un branch nella tua area di staging della tua directory di lavoro. Sei appena ritornato nel tuo branch `master` e hai scaricato il branch `rack` nella directory `rack` del branch `master` del tuo progetto principale:

	$ git read-tree --prefix=rack/ -u rack_branch

Quando fai la commit sembra che tutti i file di Rack siano nella directory, come se li avessi copiati da un archivio. La cosa interessante è che può fare facilmente il merge da un branch all’altro, così che puoi importare gli aggiornamenti del progetto Rack passando a quel branch e facendo la pull:

	$ git checkout rack_branch
	$ git pull

Tutte le modifiche del progetto Rack project vengono incorporate e sono pronte per essere committate in locale. Puoi fare anche l’opposto: modificare la directory `rack` e poi fare il merge nel branch `rack_branch` per inviarlo al mantenitore o farne la push al server remoto.

Per fare un confronto tra quello che hai nella directory `rack` e il codice nel branch `rack_branch` (e vedere se devi fare un merge o meno) non puoi usare il normale comando `diff`: devi usare invece `git diff-tree` con il branch con cui vuoi fare il confronto:

	$ git diff-tree -p rack_branch

O confrontare quello che c’è nella directory `rack` con quello che c’era nel branch `master` l’ultima volta che l’hai scaricato, col comando

	$ git diff-tree -p rack_remote/master
