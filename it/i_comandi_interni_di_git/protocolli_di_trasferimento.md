# Protocolli di trasferimento

Git può trasferire i dati tra i repository principalmente in due modi: attraverso l’HTTP e i c.d. protocolli intelligenti come usati da `file://`, `ssh://`, e `git://`. Questa sezione mostra rapidamente come funzionano questi protocolli.

## Il protocollo muto

Il trasferimento di Git attraverso l’HTTP viene spesso anche definito come protocollo muto perché non richiede di eseguire nessun codice specifico di Git durante il processo di trasferimento. Il processo per prendere gli aggiornamenti consiste in una serie di richieste GET, con il client che presuppone la struttura del repository Git sul server. Seguiamo il processo `http-fetch` per la libreria simplegit:

	$ git clone http://github.com/schacon/simplegit-progit.git

La prima cosa che fa questo comando è scaricare il file `info/refs` che viene scritto dal comando `update-server-info`, che è il motivo per cui hai bisogno di abilitare l’hook `post-receive` perché il trasferimento su HTTP funzioni bene:

	=> GET info/refs
	ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

Ora hai una lista dei riferimenti remoti e dei vari hash SHA e cerchi quindi a cosa fa riferimento l’HEAD per sapere di cosa devi fare il check out quando avrai finito:

	=> GET HEAD
	ref: refs/heads/master

Dovrai quindi fare il check out del `master` quando avrai finito di scaricare tutto.
A questo punto sei pronti per iniziare il processo. Poiché il tuo punto di partenza è la commit `ca82a6`, che abbiamo trovato nel file `info/refs`, inizierai scaricandola così:

	=> GET objects/ca/82a6dff817ec66f44342007202690a93763949
	(179 bytes of binary data)

Riceverai un oggetto, che sul server è in formato sciolto, attraverso una richiesta GET del protocollo HTTP. Puoi decomprimere l’oggetto con zlib, rimuovere l’intestazione e vedere il contenuto della commit:

	$ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Ora hai altri due oggetti da scaricare: `cfda3b`, che è l’albero a cui fa riferimento la commit che abbiamo appena scaricato, e `085bb3`, che è la commit precedente:

	=> GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	(179 bytes of data)

Che ti restituisce il seguente oggetto commit e scarica l’albero:

	=> GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
	(404 - Non trovato)

Oops: sembra che l’oggetto sul server non sia in formato sciolto, e per questo hai ricevuto un errore 404. Ci sono un paio di ragioni per cui questo possa accadere: l’oggetto potrebbe essere in un altro repository o potrebbe essere in un pacchetto (*packfile*). Git cerca prima la lista dei repository alternativi:

	=> GET objects/info/http-alternates
	(file vuoto)

E se questa restituisce una lista di URL alternativi, Git cerca sui repository elencati i file sciolti e i pacchetti: questo è un buon meccanismo per progetti che sono uno la biforcazione dell’altro per condividere gli oggetti sul disco. Poiché però nel nostro caso  non c’è nessun repository alternativo, l’oggetto che cerchiamo dev’essere in un pacchetto. Per sapere quali pacchetti sono disponibili sul server, devi scaricare il file `objects/info/packs`, che contiene la lista di tutti i pacchetti (questo file viene generato anche da `update-server-info`):

	=> GET objects/info/packs
	P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Sul nostro server c’è un solo pacchetto, quindi il nostro oggetto è ovviamente lì, ma cercheremo l’indice per esserne sicuri. Questo è utile nel caso abbia più pacchetti sul server, così puoi scoprire quale pacchetto contiene l’oggetto di cui hai bisogno:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
	(4k of binary data)

Ora che hai l’indice del pacchetto, puoi vedere quali oggetti contiene perché questo contiene tutti gli hash SHA degli oggetti contenuti nel pacchetto e gli offset degli oggetti. L’oggetto è lì e quindi scaricheremo l’intero pacchetto:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
	(13k of binary data)

Hai tre oggetti albero e puoi quindi continuare a percorrere le commit. Sono tutte nello stesso pacchetto che hai appena scaricato, così non devi fare ulteriori richieste al tuo server. Git crea una copia di lavoro con un check out del branch `master` riferito dal puntatore HEAD che hai scaricato all’inizio.

L’intero output di questo processo appare così:

	$ git clone http://github.com/schacon/simplegit-progit.git
	Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
	got ca82a6dff817ec66f44342007202690a93763949
	walk ca82a6dff817ec66f44342007202690a93763949
	got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Getting alternates list for http://github.com/schacon/simplegit-progit.git
	Getting pack list for http://github.com/schacon/simplegit-progit.git
	Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
	Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
	 which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	walk a11bef06a3f659402fe7563abf99ad00de2209e6

## Protocolli intelligenti

Usare l’HTTP è un metodo semplice ma inefficiente. È molto più comune usare i protocolli intelligenti per il trasferimento dei dati. Questi protocolli usano un processo sul server remoto che conosce Git intelligentemente: possono leggere i dati locali e capire quali dati sono già sul client e quali devono invece essere trasferiti e generare quindi un flusso di dati personalizzato. Ci sono due gruppi di processi per trasferire i dati: una coppia per inviarli e una per scaricarli.

### Inviare dati

Per inviare dati a un server remoto, Git usa i processi `send-pack` e `receive-pack`. Il processo `send-pack` viene eseguito sul client e lo connette al processo `receive-pack` sul server remoto.

Diciamo, per esempio, che esegui il comando `git push origin master` nel tuo progetto, e `origin` è un URL che usa il protocollo SSH. Git avvia il processo `send-pack` che stabilisce una connessione al server con SSH e cerca di eseguire un comando sul server attraverso SSH:

	$ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
	005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
	003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
	0000

Il comando `git-receive-pack` risponde immediatamente con una riga per ogni riferimento che memorizza (in questo caso solo il branch `master` e i suoi hash SHA). La prima riga indica anche quali sono le operazioni possibili sul server (nel nostro caso `report-status` e `delete-refs`).

Ogni riga inizia con un valore esadecimale da 4 byte che specifica la lunghezza del resto della riga. La nostra prima riga inizia con 005b, ovvero 91 in esadecimale, che significa che su questa riga restano altri 91 bytes. La riga successiva inizia con 003e, ovvero 62, e quindi leggerai gli altri 62 bytes. La riga successiva è 0000, che significa che la lista dei riferimenti sul server è finita.

Ora che conosce lo stato del server, il tuo processo `send-pack` determina quali commit hai in locale e quali no. Per ogni riferimento che verrà aggiornato con questa push, il processo `send-pack` invia le informazioni al processo `receive-pack`. Per esempio, se stai aggiornando il branch `master` e aggiungendo il branch `experiment`, la risposta del `send-pack` sarà più o meno così:

	0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
	00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
	0000

L’hash SHA-1 di tutti '0' significa che prima non c’era niente, perché stiamo aggiungendo il riferimento al branch sperimentale. Se invece stai cancellando un riferimento, vedrai l’opposto: gli ‘0’ saranno sul lato destro.

Git invia una riga per ogni riferimento che si sta aggiornando con l’SHA precedente, il nuovo e il riferimento che si sta aggiornando. La prima riga indica anche le operazioni possibili sul client. Il client invia al server un pacchetto con tutti gli oggetti che non ci sono ancora sul server e il server conclude il trasferimento indicando che il trasferimento è andato a buon fine o è fallito):

	000Aunpack ok

### Scaricare dati

Quando scarichi dei dati vengono invocati i processi `fetch-pack` e `upload-pack`. Il client avvia il processo `fetch-pack` che si connette al processo `upload-pack`, sul server remoto, per definire i dati che dovranno essere scaricati.

Ci sono diversi modi per avviare il processo `upload-pack` sul repository remote. Puoi eseguirlo con SSH, come abbiamo fatto per il processo `receive-pack`, ma puoi anche avviarlo con il demone Git, che si mette in ascolto sulla porta 9418. Una volta connesso, il processo `fetch-pack` invia al demone remoto una serie di dati che assomigliano a questi:

	003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Inizia con 4 byte che indicano la quantità dei dati che seguiranno, quindi il comando da eseguire seguito da un byte *null* quindi il nome del server seguito da un altro byte *null*. Il demone Git verifica che il comando richiesto possa essere eseguito, che il repository esista e che sia accessibile pubblicamente. Se tutto va bene, avvia processo `upload-pack` e gli passa il controllo della request.

Se stai prendendo i dati con l’SSH, `fetch-pack` eseguirà qualcosa del genere:

	$ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

In entrambi i casi, dopo la connessione di `fetch-pack`, `upload-pack` restituisce qualcosa del genere:

	0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
	  side-band side-band-64k ofs-delta shallow no-progress include-tag
	003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
	003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
	0000

Questa risposta è simile a quella di `receive-pack`, ma ha delle caratteristiche diverse. Invia, in aggiunta, il riferimento all’HEAD così che se si sta facendo un clone, il client sappia di cosa debba fare il checkout.

A questo punto il processo `fetch-pack` cerca quali oggetti ha già e risponde indicando gli oggetti di cui ha bisogno, inviando un "want" (voglio) e gli SHA che vuole. Invia anche gli hash degli oggetti che ha già, preceduti da "have" (ho). Alla fine di questa lista scrive "done" (fatto), per invitare il processo `upload-pack` a inviare il pacchetto con i dati di cui hai bisogno:

	0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
	0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	0000
	0009done

Questo è il caso più semplice del protocollo di trasferimento. Nei casi più complessi il client supporta anche i metodi `multi_ack` o `side-band`, ma questo esempio mostra l’andirivieni dei processi del protocollo intelligente.
