# Gitolite

Questa sezione serve come veloce introduzione a Gitolite, e fornisce basilari istruzioni di installazione e setup. Non può, tuttavia, sostituire l'enorme quantità di [documentazionee][gltoc] che è fornita con Gitolite. Potrebbero anche esserci occasionali cambiamenti a questa stessa sezione, pertanto potresti volere guardare l'ultima versione [qui][gldpg].

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

Gitolite è un livello di autorizzazione sopra Git, affidandosi su `sshd` o `httpd` per l'autenticazione. (Riepilogo: autenticazione significa identificare chi sia l'utente, autorizzazione significa decidere se ad egli è consentito di fare ciò che sta provando a fare).

Gitolite ti permette di specificare non solo i permessi per un repository, ma anche per i rami o le etichette di ogni repository. Così si può specificare che certe persone (o gruppi di persone) possono solo inviare ad alcuni "refs" (rami o etichette) ma non su altri.

## Installazione

Installare Gitolite è davvero molto semplice, anche se non hai letto tutta la documentazione con cui è rilasciato. Quello di cui hai bisogno è un account su un server Unix di qualche tipo. Non hai bisogno di un accesso root, supponendo che Git, Perl ed un server SSH compatibile con OpenSSH siano già installati. Nell'esempio di seguito, utilizzeremo l'account `git` sull'host chiamato `gitserver`.

Gitolite è qualche cosa di inusuale rispetto ai conosciuti software "server" — l'accesso è via SSH, e pertanto ogni userid sul server è potenzialmente un "host gitolite". Descriveremo il metodo di installazione più semplice in questo articolo; per gli altri metodi vedi la documentazione.

Per iniziare, crea un utente chiamato `git` sul tuo server ed entra come questo utente. Copia la tua chiave pubblica SSH (un file chiamato `~/.ssh/id_rsa.pub` se hai eseguito un semplice `ssh-keygen` con tutti i valori predefiniti) dalla tua postazione di lavoro, rinominala come `<tuonome>.pub` (useremo `scott.pub` in questi esempi). Quindi esegui questi comandi:

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	    # presuppone che $HOME/bin esista e sia nel tuo $PATH
	$ gitolite setup -pk $HOME/scott.pub
	
L'ultimo comando crea un nuovo repository Git chiamato `gitolite-admin` sul server.

Infine, torna alla tua postazione di lavoro, esegui `git clone git@gitserver:gitolite-admin`. Ed è fatta! Gitolite adesso è installato sul server, e tu ora hai un nuovo repository chiamato `gitolite-admin` nella tua postazione di lavoro.  Amministri il tuo setup Gitolite facendo cambiamenti a questo repository ed inviandoli.

## Personalizzare l'Installazione

Mentre di base, l'installazione veloce va bene per la maggior parte delle persone, ci sono alcuni modi per personalizzare l'installazione se ne hai bisogno. Alcuni cambiamenti possono essere fatti semplicemente modificando il file rc, ma se questo non è sufficiente, c'è la documentazione su come personalizzare Gitolite.

## File di Configurazione e Regole per il Controllo dell'Accesso

Una volta che l'installazione è fatta, puoi spostarti nel repository `gitolite-admin` (posizionato nella tua directory HOME) e curiosare in giro per vedere cosa c'è:

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

Osserva che "scott" (il nome della pubkey nel comando `gitolite setup` che hai usato precedentemente) ha permessi di scrittura-lettura per la repository `gitolite-admin` così come un file con la chiave pubblica con lo stesso nome.

Aggiungere utenti è semplice. Per aggiungere un utente chiamato "alice", procurati la sua chiave pubblica, chiamala `alice.pub`, e mettila nella directory `keydir` del clone della repository `gitolite-admin` che hai appena fatto sulla tua postazione di lavoro. Aggiungi, affida, ed invia la modifica, e l'utente è stato aggiunto.

La sintassi del file di configurazione di Gitolite è ben documentata, pertanto qui menzioneremo solo alcuni aspetti importanti.

Puoi raggruppare utenti o i repo per convenienza. Il nome del gruppo è come una macro; quando le definisci, non importa nemmeno se sono progetti o utenti; la distinzione è fatta solamente quando tu *usi* la "macro".

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

Puoi controllare i permessi a livello "ref". Nel seguente esempio, gli interni possono solo fare il push al ramo "int". Gli ingegneri possono fare il push ad ogni ramo che inizia con "eng-", e i tag che iniziano con "rc" e finiscono con un numero. E gli amministratori possono fare tutto (incluso il rewind) per ogni ref.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

L'espressione dopo `RW` o `RW+` è una espressione regolare (regex) contro cui il nome di riferimento (refname) che viene inviato viene controllato. Così la chiameremo "refex"! Certamente, una refex può essere più complessa di quella mostrata, quindi non strafare se non sei pratico con le regex perl.

Inoltre, come avrai supposto, i prefissi Gitolite `refs/heads/` sono convenienze sintattiche se la refex non inizia con `refs/`.

Una funzione importante nella sintassi di configurazione è che tutte le regole per un repository non necessariamente devono essere in un unico posto. Puoi tenere tutte le regole comuni insieme, come le regole per tutti `oss_repos` mostrati di seguito, e poi aggiungere specifiche regole per specifici casi successivamente, come segue:

	repo gitolite
	    RW+                     = sitaram

Questa regola sarà aggiunta nella serie delle regole per il solo repository `gitolite`.

A questo punto ti starai chiedendo come le regole di controllo degli accessi sono impostate, le vediamo brevemente.

Ci sono due livelli di controllo degli accessi in gitolite. Il primo è a livello di repository; se hai un accesso in lettura (o scrittura) a *qualsiasi* ref del repository, allora hai accesso in lettura (o scrittura) al repository.

Il secondo livello, applica gli accessi di sola "scrittura", è per i rami o le etichette del repository. Il nome utente, l'accesso (`W` o `+`), e il refname in fase di aggiornamento è noto. Le regole dell'accesso sono impostate in ordine di apparizione nel file di configurazione, per cercare un controllo per questa combinazione (ma ricorda che il refname è una espressione regolare, non una semplice stringa). Se un controllo è stato trovato, l'invio avviene. Tutto il resto non ha alcun tipo di accesso.

## Controllo Avanzato degli Accessi con le Regole "deny"

Finora abbiamo visto solo che i permessi possono essere `R`, `RW` o`RW+`. Ovviamente, gitolite permette altri permessi: `-`, che sta per "deny". Questo ti da molto più potere, a scapito di una certa complessità, perché non è l'*unico* modo per negare l'accesso, quindi *l'ordine delle regole ora conta*!

Diciamo, nella situazione seguente, vogliamo gli ingegneri in grado di fare il rewind di ogni ramo *eccetto* master ed integ. Qui vediamo come:

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

Ancora, devi semplicemente seguire le regole da cima a fondo fino a quando non inserisci una corrispondenza per il tipo di accesso, o di negazione. Un invio non-rewind non corrisponde alla prima regola, scende alla seconda, ed è quindi negato. Qualsiasi invio (rewind o non-rewind) ad un ref diverso da master o integ non corrisponde alle prime due regole comunque, e la terza regola lo permette.

## Restringere Invii in Base ai File Modificati

In aggiunta alle restrizioni per l'invio a specifici rami, puoi restringere ulteriormente a quali file sono permesse le modifiche. Per esempio, probabilmente il Makefile (o altri programmi) non dovrebbe essere modificato da nessuno, perché molte cose dipendono da esso e potrebbero esserci problemi se le modifiche non sono fatte *correttamente*. Puoi dire a gitolite:

    repo foo
        RW                      =   @junior_devs @senior_devs

        -   VREF/NAME/Makefile  =   @junior_devs

L'utente che sta migrando dal vecchio Gitolite dovrebbe osservare che c'è un significativo cambiamento nel comportamento di questa caratteristica; guardare la guida alla migrazione per i dettagli.

## Rami Personali

Gitolite ha anche una funzionalità che è chiamata "rami personali" (o piuttosto, "spazio dei nomi dei rami personali") che è molto utile in un ambiente aziendale.

Moltissimo codice nel mondo git è scambiato per mezzo di richieste "please pull". In un ambiente aziendale, comunque, un accesso non autenticato è un no-no, e una macchina di sviluppo non può fare autenticazioni, così devi inviare al server centrale e poi chiedere a qualcuno di scaricarsi le modifiche da lì.

Questo normalmente causa lo stesso disordine nel ramo come in un VCS centralizzato, inoltre impostare le autorizzazioni per questo diventa un fastidio per l'amministratore.

Gitolite ti permette di definire un prefisso per lo spazio dei nomi "personale" e "nuovo" per ogni sviluppatore (per esempio, `refs/personal/<devname>/*`); vedi la sezione "personal branches" in `doc/3-faq-tips-etc.mkd` per i dettagli.

## Repository "Wildcard"

Gitolite ti permette di specificare repository con il wildcard (nei fatti espressioni regolari perl), come, per esempio `assignments/s[0-9][0-9]/a[0-9][0-9]`, per prendere un esempio a caso. Ti permette anche di assegnare un nuovo modo di permesso ("C") per permettere agli utenti di creare repository basati su questi schemi, assegnando automaticamente il proprietario allo specifico utente che lo ha creato, permettendogli di gestire i permessi di R e RW per gli altri utenti per collaborazione, etc. Di nuovo, vedi la documentazione per i dettagli.

## Altre funzionalità

Concludiamo questa discussione con un elenco di altre funzioni, ognuna delle quali, e molte altre, sono descritte in grande dettagli nella documentazione.

**Logging**: Gitolite registra tutti gli accessi riusciti. Se hai dato tranquillamente il permesso di rewind (`RW+`) alle persone e qualcuno ha spazzato via il "master", il log è un toccasana per ritrovare lo SHA di chi ha fatto il casino.

**Rapporto sui diritti di accesso**: Un'altra funzione conveniente è quando provi ad entrare via ssh sul server. Gitolite ti mostrerà a quali repo hai accesso, e che tipo di accesso hai. Ecco un esempio:

        hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4
        
             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**Delega**: Per un'istallazione davvero grande, puoi delegare la responsabilità di alcuni gruppi di repository a varie persone e dare a loro l'amministrazione di questi pezzi in modo indipendente. Questo riduce il carico dell'amministrazione centrale, e lo rende meno il collo di bottiglia. 

**Mirroring**: Gitolite può aiutarti a mantenere mirror multipli, e spostarti fra di loro facilmente se il server primario va giù.
