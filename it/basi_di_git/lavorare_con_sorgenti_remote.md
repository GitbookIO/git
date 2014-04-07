# Lavorare con Sorgenti Remote

Per essere in grado di collaborare con un qualsiasi progetto Git, hai bisogno di sapere come amministrare il tuo repository remoto. I repository remoti sono versioni di progetti che sono ospitati in Internet o su una rete da qualche parte. Puoi averne più di uno, molti dei quali possono essere di sola lettura o di scrittura e lettura per te. Collaborare con altri implica di sapere amministrare questi repository remoti e mettere e togliere i dati a e da questi quando hai necessità di condividerli per lavoro.
Amministrare repository remoti include il sapere aggiungere repository remoti, rimuovere quelli che non sono validi, amministrare vari rami remoti e definire quando sono tracciati o meno, e altro. In questa sezione, vedremo le tecniche di amministrazione remota.

## Visualizzare la Sorgente Remota

Per vedere quale server remoto hai configurato, puoi lanciare il comando git remote. Questo elenca i soprannomi di ogni nodo specificato. Se hai clonato il tuo repository, dovresti al limite vedere origin —  che è il nome predefinito che Git da al server che hai clonato:

	$ git clone git://github.com/schacon/ticgit.git
	Initialized empty Git repository in /private/tmp/ticgit/.git/
	remote: Counting objects: 595, done.
	remote: Compressing objects: 100% (269/269), done.
	remote: Total 595 (delta 255), reused 589 (delta 253)
	Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
	Resolving deltas: 100% (255/255), done.
	$ cd ticgit
	$ git remote
	origin

Puoi anche specificare `-v`, che mostra l'URL che Git ha salvato per il soprannome:

	$ git remote -v
	origin  git://github.com/schacon/ticgit.git (fetch)
	origin  git://github.com/schacon/ticgit.git (push)

Se hai più di un repository remoto, il comando li elenca tutti. Per esempio, il mio repository Grit assomiglia a questo.

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

Questo significa che possiamo prendere i contributi da qualsiasi di questi utenti in modo facile. Ma nota che solo origin è un URL SSH, è l'unico dove posso fare il push (vedremo questa cosa nel Capitolo 4).

## Aggiungere un Repository Remoto

Ho menzionato e fornito alcune dimostrazioni, nelle sezioni precedenti, sull'aggiunta di repository remoti, ma qui scendo nello specifico. Per aggiungere un nuovo repository Git con un soprannome per riconoscerlo velocemente, avvia `git remote add [soprannome] [url]`:

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Ora puoi usare la stringa pb dalla linea di comando al posto dell'intero URL. Per esempio, se vuoi prelevare tutte le informazioni che Paul ha ma che ancora non hai nel tuo repository, puoi lanciare git fetch pb:

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

Il ramo master di Paul è accessibile localmente come `pb/master` —  puoi unirlo in uno dei tuoi rami, o puoi caricare un tuo ramo locale a questo punto per ispezionarlo.

## Prelevare e Trarre da Sorgenti in Remoto

Come già visto, per ottenere i dati da un progetto remoto, puoi farlo:

	$ git fetch [nome-remoto]

Il comando va sul progetto remoto e si tira giù tutti i dati dal progetto remoto che ancora non hai. Dopo aver fatto questo, dovresti avere tutti i riferimenti ai rami da questa sorgente remota, che poi potrai fondere o ispezionare in ogni momento. (Vedremo cosa sono i rami e come usarli in maggior dettaglio al *Capitolo 3*).

Se hai clonato un repository, il comando automaticamente aggiunge un repository remoto sotto il nome origin. Così, `git fetch origin` preleva ogni lavoro che è stato inserito su quel server da quando hai fatto la clonazione (o dall'ultimo prelievo). E' importante notare che il comando `fetch` mette i dati nel tuo repository locale — non unisce automaticamente e non modifica alcun file su cui tu stai lavorando. Devi eseguire la fusione manualmente nel tuo lavoro, quando sei pronto.

Se hai un ramo impostato per tracciare un ramo remoto (vedi la prossima sezione e il Capitolo 3 per maggiori informazioni), puoi usare il comando `git pull` per prelevare automaticamente e poi fondere un ramo remoto nel ramo corrente. Questo è un modo più facile e comodo di lavorare; e in modo predefinito, il comando `git clone` automaticamente imposta il tuo ramo locale master per tracciare il ramo remoto master del server che hai clonato (assumendo che il sorgente remoto abbia un ramo master). Lanciare `git pull` generalmente preleva i dati dal server di origine clonato e automaticamente prova a fondere il codice con il codice su cui stai lavorando.

## Inserire nella Sorgente Remota

Quando hai il tuo progetto al punto in cui lo vuoi condividere, devi inviarlo a monte (push upstream). Il comando per fare questo è semplice: `git push [nome-remoto] [nome-ramo]`. Se vuoi fare il push del tuo ramo master al tuo server `origin` (ancora, generalmente con la clonazione sono impostati entrambi questi nomi automaticamente), puoi lanciare il push per mettere il tuo lavoro sul server:

	$ git push origin master

Questo comando funziona solamente se hai fatto una clonazione da un server in cui hai i permessi di scrittura e se nessuno ha inviato dati nel mentre. Se tu e qualcun altro clonate un repository nello stesso momento ed essi inviano i dati, e poi tu invii i dati, il tuo invio verrà gustamente rifiutato. Devi prima scaricare il loro lavoro ed incorporarlo nel tuo per poter inviare le tue modifiche. Vedi il *Capitolo 3* per maggiori dettagli ed informazioni su come fare il push su server remoti.

## Ispezionare una Sorgente Remota

Se vuoi vedere più informazioni su di una sorgente remota in particolare, puoi usare il comando `git remote show [nome-remoto]`. Se lanci il comando con un soprannome particolare, come `origin`, avrai qualcosa di simile a questo:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

Questo elenca tutti gli URL del repository remoto oltre che alle informazioni sui rami tracciati. Il comando utilmente ti dirà che sei sul ramo principale e se lanci `git pull`, questo automaticamente unirà il ramo master sul server remoto dopo aver prelevato tutte i riferimenti remoti. Inoltre elencherà i riferimenti che ha scaricato.

Questo è un semplice esempio che potrai incontrare. Quando usi moltissimo Git, tuttavia, potrai vedere molte più informazioni da `git remote show`:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Questo comando mostra quale ramo è automaticamente caricato quando lanci `git push` su certe diramazioni. Inoltre ti mostrerà quali rami remoti sul server che ancora non possiedi, quali rami remoti possiedi e che saranno rimossi dal server, e le diramazioni che saranno automaticamente unite quando lancerai `git pull`.

## Rimuovere e Rinominare Sorgenti Remote

Se vuoi rinominare un riferimento, nelle nuove versioni di Git, puoi lanciare `git remote rename` per cambiare il soprannome di una sorgente remota. Per esempio, se vuoi rinominare `pb` in `paul`, puoi farlo con `git remote rename`:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Vale la pena ricordare che questo cambia anche i nomi dei rami remoti. Quello che prima era riferito a `pb/master` ora è `paul/master`.

Se vuoi rimuovere un riferimento per una qualche ragione — hai spostato il server o non stai più usando un mirror particolare, o magari un collaboratore non collabora più — puoi usare `git remote rm`:

	$ git remote rm paul
	$ git remote
	origin

## Etichettare

Come la maggior parte dei VCS, Git ha la possibilità di contrassegnare (tag, ndt) dei punti specifici della storia come importanti. Generalmente, le persone usano questa funzionalità per marcare i punti di rilascio (v1.0, e così via). In questa sezione, imparerai come elencare le etichette disponibili, come crearne di nuove, ed i differenti tipi di etichette esistenti.

## Elencare le Proprie Etichette

Elencare le etichette disponibili in Git è facilissimo. Semplicemente digita `git tag`:

	$ git tag
	v0.1
	v1.3

Questo comando elenca le etichette in ordine alfabetico; l'ordine con il quale compaiono non è realmente importante.

Puoi inoltre cercare le etichette con uno schema specifico. Il repository sorgente di Git, per esempio, contiene più di 240 etichette. Se sei solo interessato a vedere quelli della serie 1.4.2, puoi lanciare:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Creare Etichette

Git usa due principali tipi di etichette: lightweight (semplificate, ndt) e annotated (commentate, ndt). Un'etichetta lightweight è molto simile ad un ramo che non è cambiato —  è semplicemente un riferimento ad uno specifico commit. Le etichette annotated, tuttavia, sono salvate come oggetti nel database Git. Ne viene calcolato il checksum; contengono il nome, l'e-mail e la data di chi ha inserito l'etichetta; hanno un messaggio; e possono essere firmati e verificati con GNU Privacy Guard (GPG). É generalmente raccomandato creare etichette annotated così puoi avere tutte queste informazioni; ma se vuoi temporaneamente inserire un'etichetta e per qualche ragione non vuoi avere queste informazioni, le etichette lightweight sono ancora disponibili.

## Etichette Annotated

Creare un'etichetta annotated in Git è semplice. La via più facile è specificare `-a` quando si lancia il comando `tag`:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

`-m` specifica il messaggio, che è salvato con l'etichetta. Se non specifichi un messaggio per una etichetta annotated, Git lancerà il tuo editor così potrai inserirlo.

Puoi vedere i dati dell'etichetta assieme al commit in cui è stato inserito l'etichetta con il comando `git show`:

	$ git show v1.4
	tag v1.4
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 14:45:11 2009 -0800

	my version 1.4
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Questo mostra le informazioni di chi ha eseguito l'etichetta, la data del commit della stessa, ed il messaggio prima di mostrare le informazioni del commit.

## Firmare le Etichette

Puoi anche firmare le tue etichette con GPG, assumendo che tu abbia una chiave privata. Tutto quello che devi fare è usare `-s` invece di `-a`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Se lanci `git show` su questa etichetta, potrai vedere la tua firma GPG in allegato ad essa:

	$ git show v1.5
	tag v1.5
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:22:20 2009 -0800

	my signed 1.5 tag
	-----BEGIN PGP SIGNATURE-----
	Version: GnuPG v1.4.8 (Darwin)

	iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
	Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
	=WryJ
	-----END PGP SIGNATURE-----
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Più avanti, imparerai come verificare le etichette firmate.

## Etichette Lightweight

Un altro modo per marcare i commit è usare le etichette lightweight. Questo è semplicemente fare il checksum del commit salvato in un file — nessun'altra informazione è mantenuta. Per creare un'etichetta semplificata, non fornire l'opzione `-a`, `s` o `-m`:

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

A questo punto, se lanci `git show` sulla tua etichetta, non vedrai altre informazioni aggiuntive. Il comando semplicemente mostra il commit:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Verificare le Etichette

Per verificarele etichetta firmate, usa `git tag -v [nome-tag]`. Questo comando usa la verifica GPG della firma. Avrai bisogno della chiave pubblica del firmatario nel tuo portachiavi affinché funzioni correttamente:

	$ git tag -v v1.4.2.1
	object 883653babd8ee7ea23e6a5c392bb739348b1eb61
	type commit
	tag v1.4.2.1
	tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

	GIT 1.4.2.1

	Minor fixes since 1.4.2, including git-mv and git-http with alternates.
	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
	gpg:                 aka "[jpeg image of size 1513]"
	Primary key fingerprint: 3565 2A26 2040 E066 C9A7  4A7D C0C6 D9A4 F311 9B9A

Se non hai la chiave pubblica del firmatario, otterrai qualche cosa di simile a questo invece:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Inserire una Etichetta Successivamente

Puoi anche etichettare i commit che hai già superato. Supponiamo che la storia dei tuoi commit sia come questa: 

	$ git log --pretty=oneline
	15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
	a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
	0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
	6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
	0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
	4682c3261057305bdd616e23b64b0857d832627b added a todo file
	166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
	9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
	964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
	8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme

Ora, supponiamo che ti sia dimenticato di mettere l'etichetta v1.2 al tuo progetto, che è al commit "updated rakefile". Puoi aggiungerlo successivamente. Per marcare questo commit, devi specificare il checksum (o parte di esso) del commit alla fine del comando:

	$ git tag -a v1.2 9fceb02

Puoi vedere che hai marcato il commit:

	$ git tag
	v0.1
	v1.2
	v1.3
	v1.4
	v1.4-lw
	v1.5

	$ git show v1.2
	tag v1.2
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:32:16 2009 -0800

	version 1.2
	commit 9fceb02d0ae598e95dc970b74767f19372d61af8
	Author: Magnus Chacon <mchacon@gee-mail.com>
	Date:   Sun Apr 27 20:43:35 2008 -0700

	    updated rakefile
	...

## Condividere le Etichette

Di base, il comando `git push` non trasferisce le etichette sui server remoti. Devi esplicitamente inviare le etichette da condividere con il server dopo averle create. Questo processo è come condividere rami remoti — puoi lanciare `git push origin [nometag]`.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Se hai molte etichetta che vuoi inviare tutte assieme, puoi farlo usando l'opzione `--tags` del comando `git push`. Questo trasferirà tutti le tue etichette sul server remoto che non sono ancora presenti.

	$ git push origin --tags
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	 * [new tag]         v0.1 -> v0.1
	 * [new tag]         v1.2 -> v1.2
	 * [new tag]         v1.4 -> v1.4
	 * [new tag]         v1.4-lw -> v1.4-lw
	 * [new tag]         v1.5 -> v1.5

Ora, quando qualcun altro clona o scarica dal tuo repository, avrà anche tutti le tue etichette.
