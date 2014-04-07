# Gitosis

Mantenere tutte le chiavi pubbliche degli utenti nel file `authorized_keys` funziona bene per un pochino. Quando hai centinaia di utenti, è molto più difficile amministrare questo processo. Devi collegarti al server ogni volta, e non c'è un controllo degli accessi — ognuno nei file ha un accesso in lettura e scrittura ad ogni progetto.

A questo punto, potresti voler passare ad un software maggiormente utilizzato chiamato Gitosis. Gitosis è fondamentalmente una serie di script che aiutano ad amministrare il file `authorized_keys` esattamente come implementare un sistema di controllo degli accessi. La parte davvero interessante è che l'UI di questo strumento per aggiungere utenti e determinare gli accessi non è un'interfaccia web ma uno speciale repository Git. Puoi impostare le informazioni in questo progetto; e quando le re-invii, Gitosis riconfigura il server basandosi su di esse, è fantastico.

Installare Gitosis non è un'operazione proprio semplice, ma non è così tanto difficile. É facilissimo usarlo su un server Linux — questo esempio usa un server Ubuntu 8.10.

Gitosis richiede alcuni strumenti Python, così prima devi installare il pacchetto di Python setuptools, che Ubuntu fornisce tramite python-setuptools:

	$ apt-get install python-setuptools

Poi, puoi clonare ed installare Gitosis dal progetto principale:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

Questo installerà una serie di eseguibili che Gitosis utilizzerà. Poi, Gitosis vuole i suoi repository in `/home/git`, che va bene. Ma hai già impostato i tuoi repository in `/opt/git`, così invece di riconfigurare tutto, puoi creare un link simbolico:

	$ ln -s /opt/git /home/git/repositories

Gitosis amministrerà le chiavi per te, così dovrai rimuovere il file corrente, ri-aggiungere le chiavi successivamente e permettere a Gitosis il controllo automatico del file `authorized_keys`. Per ora, spostiamo `authorized_keys` così:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

Poi devi reimpostare la shell del tuo utente 'git', se lo hai cambiato con il comandi `git-shell`. Le persone non sono ora in grado di fare il login, ma Gitosis controllerà questa cosa per te. Così, modifica questa linea nel tuo file `/etc/passwd`

	git:x:1000:1000::/home/git:/usr/bin/git-shell

in questa:

	git:x:1000:1000::/home/git:/bin/sh

Ora è tempo di inizializzare Gitosis. Puoi farlo avviando il comando `gitosis-init` con la tua chiave pubblica personale. Se la tua chiave pubblica non è sul server, devi copiarla:

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Questo permetterà all'utente con questa chiave di modificare il repository Git principale che controlla la configurazione di Gitosis. Poi, devi manualmente impostare il bit di esecuzione nello script `post-update` per il tuo nuovo repository di controllo.

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Sei pronto per partire. Se sei configurato correttamente, puoi provare ad entrare via SSH nel tuo server come utente che ha aggiunto la chiave pubblica iniziale in Gitosis. Dovresti vedere qualcosa di simile a:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	fatal: unrecognized command 'gitosis-serve schacon@quaternion'
	  Connection to gitserver closed.

Questo significa che Gitosis ti riconosce ma ti butta fuori perché stai cercando di fare un qualcosa che non è un comando Git. Allora, diamo un comando Git — cloniamo il repository di controllo Gitosis:

	# sul tuo computer locale
	$ git clone git@gitserver:gitosis-admin.git

Ora hai una directory chiamata `gitosis-admin`, formata da due parti principali:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

Il file `gitosis.conf` è il file di controllo in cui specifichi gli utenti, i repository e i permessi. La directory `keydir` è dove salvi le chiavi pubbliche di tutti gli utenti che hanno un qualsiasi accesso al repository — un file per utente. Il nome del file in `keydir` (dell'esempio precedente, `scott.pub`) è differente per te — Gitosis prende questo nome dalla descrizione alla fine della chiave pubblica che hai importato con lo script `gitosis-init`.

Se guardi nel file `gitosis.conf`, dovrebbe essere solo specificata l'informazione sul progetto `gitosis-admin` che hai già clonato:

	$ cat gitosis.conf 
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

Mostra che l'utente 'scott' — l'utente che ha inizializzato Gitosis con la sua chiave pubblica — è l'unico che ha l'accesso al progetto `gitosis-admin`.

Ora, aggiungiamo un nuovo progetto. Aggiungi una nuova sezione chiamata `mobile` dove elenchi gli sviluppatori del gruppo mobile ed i progetti in cui questi sviluppatori hanno bisogno dell'accesso. In quanto 'scott' è l'unico utente nel sistema al momento, aggiungerai solo lui come membro, creerai un nuovo progetto chiamato `iphone_project` su cui partire:

	[group mobile]
	writable = iphone_project
	members = scott

Ogni volta che fai una modifica al progetto `gitosis-admin`, devi fare un commit dei cambiamenti ed un push sul server in modo che abbiano effetto.

	$ git commit -am 'add iphone_project and mobile group'
	[master]: created 8962da8: "changed name"
	 1 files changed, 4 insertions(+), 0 deletions(-)
	$ git push
	Counting objects: 5, done.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 272 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	To git@gitserver:/opt/git/gitosis-admin.git
	   fb27aec..8962da8  master -> master

Puoi ora fare il tuo push al nuovo progetto `iphone_project` aggiungendo il tuo server come sorgente remota alla tua versione locale del progetto. Non hai bisogno di creare manualmente un repository base per nuovi progetti sul server — Gitosis li crea automaticamente quando vede il loro primo invio:

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Nota che non devi specificare il percorso (infatti, se lo si fa non funziona), basta solamente la colonna e poi il nome del progetto — Gitosis farà il resto.

Se vuoi lavorare sul progetto con i tuoi amici, devi riaggiungere le chiavi pubbliche. Ma invece di aggiungerle manualmente nel file `~/.ssh/authorized_keys` sul server, le devi aggiungere, un file per volta, nella directory `keydir`. Come nomini queste chiavi determinerà come fai riferimento agli utenti nel file `gitosis.conf`. Riaggiungiamo le chiavi pubbliche per John, Josie e Jessica:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Ora puoi aggiungerli al tuo team 'mobile' così avranno accesso in lettura e scrittura a `iphone_project`:

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

Dopo che hai fatto il commit ed l'invio delle modifiche, tutti e quattro gli utenti saranno in grado di leggere e scrivere nel progetto.

Gitosis ha un semplice controllo dell'accesso. Se vuoi che John abbia solo un accesso in lettura al progetto, devi fare così:

	[group mobile]
	writable = iphone_project
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_project
	members = john

Ora John può clonare il progetto ed ottenere gli aggiornamenti, ma Gitosis non gli permetterà di inviarli al progetto. Puoi creare tutti i gruppi che vuoi, ognuno contiene gruppi di utenti e progetti differenti. Puoi anche specificare un altro gruppo con i membri di un altro (usando `@` come prefisso), per ereditarli automaticamente:

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_project
	members   = @mobile_committers

	[group mobile_2]
	writable  = another_iphone_project
	members   = @mobile_committers john

Se hai un qualsiasi dubbio, può essere utile aggiungere `loglevel=DEBUG` nell sezione `[gitosis]`. Se hai perso l'accesso alla scrittura perché hai inviato una configurazione sbagliata, puoi risolvere la cosa manualmente sul server `/home/git/.gitosis.conf` — il file da dove Gitosis legge le informazioni. Un invio al progetto prende il file `gitosis.conf` che hai appena inviato e lo posiziona li. Se modifichi questo file manualmente, rimarrà come lo hai lasciato fino al prossimo invio andato a termine nel progetto `gitosis-admin`.
