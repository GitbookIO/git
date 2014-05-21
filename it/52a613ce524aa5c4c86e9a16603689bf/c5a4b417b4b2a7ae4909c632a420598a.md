# Manutenzione e recupero dei dati

A volte può essere necessario fare un po’ di pulizia del repository per renderlo più compatto, per ripulire un repository importato o recuperare del lavoro che è andato perso. Questa sezione tratta alcuni di questi scenari.

## Manutenzione

Git, occasionalmente, esegue automaticamente il comando "auto gc". Il più delle volte questo comando non fa niente, ma se ci sono troppi oggetti sciolti (oggetti che non sono compressi in un pacchetto) o troppi pacchetti, Git esegue un vero e proprio `git gc`. `gc` sta per *garbage collect* (raccolta della spazzatura), e il comando fa una serie di cose:: raccoglie tutti gli oggetti sciolti e li compatta in un pacchetto, consolida i pacchetti in un pacchetto più grande e cancella gli oggetti che non sono raggiungibili da nessuna commit e siano più vecchi di qualche mese.

Puoi eseguire il comando “auto gc” così:

	$ git gc --auto

Questo, lo ripetiamo, generalmente non farà niente: dovrai avere circa 7.000 oggetti sciolti o più di 50 pacchetti perché Git esegua la garbage collection vera e propria. Puoi modificare questi limiti cambiando, rispettivamente, i valori di `gc.auto` e `gc.autopacklimit` delle tue configurazioni.

Un’altra cosa che fa `gc` è quella di impacchettare i tuoi riferimenti in un singolo file. Immagina che il tuo repository contenga i branch e i tag seguenti:

	$ find .git/refs -type f
	.git/refs/heads/experiment
	.git/refs/heads/master
	.git/refs/tags/v1.0
	.git/refs/tags/v1.1

Se esegui `git gc` non avrai più questi file nella directory `refs` perché Git li sposterà, in nome dell’efficienza, in un file chiamato `.git/packed-refs`, che apparirà così:

	$ cat .git/packed-refs
	# pack-refs with: peeled
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
	ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
	cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
	9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
	^1a410efbd13591db07496601ebc7a059dd55cfe9

Se aggiorni un riferimento, Git non modificherà questo file, ma scriverà un nuovo file nella directory `refs/heads`. Per conoscere l’hash SHA di uno specifico riferimento, Git controlla se è nella directory `refs` e poi nel file `packed-refs` se non lo trova. In ogni caso, se non trovi un riferimento nella directory `refs`, questo sarà probabilmente sarà nel file `packed-refs`.

Nota l’ultima riga del file, quella che inizia con un `^`. Questo indica che il tag immediatamente precedente è un tag annotato e che quella linea è la commit a cui punta il tag annotato.

## Recupero dei dati

Durante il tuo lavoro quotidiano può capitare che, accidentalmente, perda una commit. Questo generalmente succede quando forzi la cancellazione di un branch su cui hai lavorato e poi scopri di averne bisogno, o quando fai un hard-reset di un branch, abbandonando quindi delle commit da cui poi vorrai qualcosa. Ipotizzando che sia successo proprio questo: come fai a ripristinare le commit perse?

Qui c’è un esempio di un hard-resets del master nel tuo repository di test su una vecchia commit e recuperare poi le commit perse. Prima di tutto verifica lo stato del tuo repository:

	$ git log --pretty=oneline
	ab1afef80fac8e34258ff41fc1b867c702daa24b modificato un poco il repository
	484a59275031909e19aadb7c92262719cfcdf19a aggiunto repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 terza commit
	cac0cab538b970a37ea1e769cbbde608743bc96d seconda commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d prima commit

Muovi ora il branch `master` a una commit centrale:

	$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
	HEAD is now at 1a410ef terza commit
	$ git log --pretty=oneline
	1a410efbd13591db07496601ebc7a059dd55cfe9 terza commit
	cac0cab538b970a37ea1e769cbbde608743bc96d seconda commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d prima commit

Così facendo hai perso le due commit più recenti: questa commit non sono più raggiungibili in nessun modo. Devi scoprire l’hash SHA dell’ultima commit e aggiungere quindi un branch che vi punti. Il trucco è trovare l’hash SHA dell’ultima commit: non è come lo ricordavi, vero?

Spesso il modo più veloce è usare `git reflog`. Mentre lavori Git memorizza silenziosamente lo stato del tuo HEAD ogni volta che lo cambi. Il reflog viene aggiornato ogni volta che fai una commit o cambi un branch. Il reflog viene aggiornato anche dal comando `git update-ref`, che è un’altra buona ragione per usarlo, invece di scrivere direttamente il valore dell’SHA nei tuoi file ref, come abbiamo visto nella sezione “I Riferimenti di Git" in questo stesso capitolo. Eseguendo `git reflog` puoi vedere dov’eri in qualsiasi dato momento:

	$ git reflog
	1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
	ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Qui vediamo le due commit di cui abbiamo fatto il checkout, ma qui non ci sono poi tante informazioni. Per vedere le stesse informazioni, ma in una maniera più utile, possiamo eseguire il comando `git log -g`, che restituisce un output normale del tuo reflog.

	$ git log -g
	commit 1a410efbd13591db07496601ebc7a059dd55cfe9
	Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:22:37 2009 -0700

	    terza commit

	commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: updating HEAD
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri May 22 18:15:24 2009 -0700

	     modificato un poco il repository

It looks like the bottom commit is the one you lost, so you can recover it by creating a new branch at that commit. For example, you can start a branch named `recover-branch` at that commit (ab1afef):

	$ git branch recover-branch ab1afef
	$ git log --pretty=oneline recover-branch
	ab1afef80fac8e34258ff41fc1b867c702daa24b modificato un poco il repository
	484a59275031909e19aadb7c92262719cfcdf19a aggiunto repo.rb
	1a410efbd13591db07496601ebc7a059dd55cfe9 terza commit
	cac0cab538b970a37ea1e769cbbde608743bc96d seconda commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d prima commit

Bello: ora sembra che tu abbia un branch chiamato `recover-branch` dov’era il tuo branch `master` precedentemente, rendendo nuovamente raggiungibili le due commit.
Immagina che le commit perse, per qualche ragione, non appaiano nel reflog: puoi simularlo cancellando il branch `recover-branch` e il reflog. Ora le due commit non sono più raggiungibili da niente:

	$ git branch -D recover-branch
	$ rm -Rf .git/logs/

Poiché i dati del reflog è conservato nella directory `.git/logs/`, ora effettivamente non hai nessun reflog. A questo punto come possiamo recuperare la commit? Uno dei modi è usare l’utility `git fsck`, che verifica l’integrità del database del tuo repository. Se lo esegui con l’opzione `--full` ti mostrerà tutti gli oggetti che non sono collegati a nessun altro oggetto:

	$ git fsck --full
	dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
	dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
	dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
	dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

In questo caso rivediamo la commit scomparsa dopo la *dangling commit* e la puoi recuperare creando un branch che punti  al suo SHA.

## Eliminare oggetti

Ci sono un sacco di grandi cose in Git, ma una delle caratteristiche che può creare qualche problemi è che la `git clone` scarica l’intera storia di un progetto, inclusa ciascuna versione di ciascun file. Questo va bene se sono tutti sorgenti perché Git è super ottimizzato per comprimere questi dati in modo molto efficiente. Se però qualcuno in qualche momento ha aggiunto un file molto grande, ogni clone scaricherà quel file grande, anche se poi quel file è stato cancellato da una commit successiva. Poiché è raggiungibile nella cronologia, resterà sempre lì.

Questo è un grosso problema se stai convertendo a Git dei repository da Subversion o Perforce, perché in quei sistemi questo tipo di aggiunte non crea dei grandi problemi, perché non scarichi l’intera cronologia. Se hai importato i sorgenti da un altro sistema o ti rendi conto che il tuo repository è molto più grande di quello che dovrebbe, di seguito scoprirai come eliminare gli oggetti di grandi dimensioni.

Fai attenzione: questa tecnica è distruttiva per la cronologia delle tue commit. Riscrive tutte le commit a partire dal primo albero che devi modificare per rimuovere il riferimento a quel file. Se lo fai subito dopo una importazione, prima che chiunque altro inizi a lavorarci, non c’è nessun problema, altrimenti dovrai avvisare tutti i collaboratori perché ribasino il loro lavoro sulle nuove commit.

Come dimostrazioni aggiungerai un file grande nel tuo repository di test, lo rimuoverai con la commit successiva, lo cercherai e lo rimuoverai permanentemente dal repository. Prima di tutto aggiungi un file grande alla cronologia del tuo repository:

	$ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
	$ git add git.tbz2
	$ git commit -am 'added git tarball'
	[master 6df7640] added git tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 create mode 100644 git.tbz2

Oops: non volevi aggiungere questo archivio così grande al tuo progetto. Meglio rimediare:

	$ git rm git.tbz2
	rm 'git.tbz2'
	$ git commit -m 'oops - removed large tarball'
	[master da3f30d] oops - removed large tarball
	 1 files changed, 0 insertions(+), 0 deletions(-)
	 delete mode 100644 git.tbz2

Esegui ora `gc` sul tuo database e guarda quanto spazio stai usando:

	$ git gc
	Counting objects: 21, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (16/16), done.
	Writing objects: 100% (21/21), done.
	Total 21 (delta 3), reused 15 (delta 1)

Puoi eseguire anche il comando `count-objects` per vedere lo spazio che stai usando:

	$ git count-objects -v
	count: 4
	size: 16
	in-pack: 21
	packs: 1
	size-pack: 2016
	prune-packable: 0
	garbage: 0

Il valore di `size-pack` è la dimensione del packfiles in kilobytes e quindi stai usando 2MB mentre prima dell’ultima commit usavi circa 2K. Cancellando il file dell’ultima commit ovviamente non lo elimina dalla cronologia e ogni volta che qualcuno colmerà il repository, dovrà scaricare tutti i 2MB avere questo progettino, solamente perché hai aggiunto per errore questo file grande. Vediamo di risolverlo.

Prima di tutto devi trovare il file. In questo caso già sappiamo quale sia, ma supponiamo di non saperlo: come possiamo trovare quale file o quali file occupano tanto spazio? Se esegui `git gc` tutti gli oggetti saranno in un pacchetto e puoi trovare gli oggetti più grandi eseguendo un altro comando *plumbing*, `git verify-pack`, e ordinarli in base al terzo campo dell’output, che indica la dimensione. Puoi anche concatenarlo in *pipe* con `tail` perché siamo interessati solo agli file più grandi:

	$ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
	7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

L’oggetto grande è alla fine della lista: 2MB. Per scoprire di quale file si tratti useremo il comando `rev-list` che abbiamo già visto rapidamente nel Capitolo 7. Se usi l’opzione `--objects` a `rev-list`, elencherà tutti gli hash SHAs delle commit e dei blob SHAs che facciano riferimento al percorso del file. Puoi trovare il nome del blog così:

	$ git rev-list --objects --all | grep 7a9eb2fb
	7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Ora dobbiamo rimuovere questo file da tutti gli alberi della cronologia. Puoi vedere facilmente quali commit hanno modificato questo file:

	$ git log --pretty=oneline --branches -- git.tbz2
	da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
	6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Ora, per rimuovere completamente questo file dalla cronologia di Git, devi riscrivere tutte le commit successive la `6df76` e per farlo useremo `filter-branch`, che hai già usato nel Capitolo 6:

	$ git filter-branch --index-filter \
	   'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
	Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
	Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
	Ref 'refs/heads/master' was rewritten

L’opzione `--index-filter` è simile alla `--tree-filter` usata nel Capitolo 6, ad eccezione del fatto che invece di passare un comando che modifichi i file sul disco, modifichi la tua area di staging o l’indice ad ogni iterazione. Piuttosto che rimuovere un file con qualcosa simile a `rm file` dovrai rimuoverlo con `git rm --cached`, perché devi rimuoverlo dall’indice e non dal disco. Il motivo per farlo in questo modo è che è più veloce, perché Git non deve fare il checkout di ciascuna versione prima di eseguire il tuo filtro, e quindi tutto il processo è molto più veloce. Se preferisci, puoi ottenere lo stesso risultato con `--tree-filter`. L’opzione `--ignore-unmatch` di `git rm` serve a far si che non venga generato un errore se il file che stai cercando di eliminare non c’è in quella versione. Puoi, infine chiedere a `filter-branch` di riscrivere la cronologia solo a partire dalla commit `6df7640`, perché già sappiamo che è lì che ha avuto inizio il problema. Altrimenti inizierebbe dall’inizio e sarebbe inutilmente più lento.

La tua cronologia ora non ha più alcun riferimento a quel file, ma lo fanno il tuo reflog e un nuovo gruppo di riferimenti che Git ha aggiunto quando hai eseguito `filter-branch` in `.git/refs/original`, e quindi devi rimuovere anche questi e ricomprimere il database. Ma devi correggere qualsiasi cosa che ancora punti a quelle vecchie commit, prima di ricompattare il repository:

	$ rm -Rf .git/refs/original
	$ rm -Rf .git/logs/
	$ git gc
	Counting objects: 19, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (19/19), done.
	Total 19 (delta 3), reused 16 (delta 1)

Vediamo ora quanto spazio hai recuperato.

	$ git count-objects -v
	count: 8
	size: 2040
	in-pack: 19
	packs: 1
	size-pack: 7
	prune-packable: 0
	garbage: 0

Le dimensioni del repository compresso sono ora di 7K, che è molto meglio dei 2MB precedenti. Dalle dimensioni puoi vedere che l’oggetto è ancora presente tra gli oggetti sciolti, quindi non è ancora sparito, ma non verrà più trasferito quando farai una push o se qualcun altro farà un clone, che è la cosa più importante. Se vuoi comunque eliminare definitivamente l’oggetto potrai farlo eseguendo il comando `git prune --expire`.
