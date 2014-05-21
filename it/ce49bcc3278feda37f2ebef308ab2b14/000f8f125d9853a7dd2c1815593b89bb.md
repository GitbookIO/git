# I Protocolli

Git può utilizzare i maggiori quattro protocolli di rete per trasferire i dati: Locale, Secure Shell (SSH), Git e HTTP. Qui vedremo cosa sono e in quali circostanze di base si vogliono (o non si vogliono) usare.

É importante notare che, ad eccezione dei protocolli HTTP, tutti questi richiedono che Git sia installato e funzionante sul server.

## Il Protocollo Locale

Quello più semplice è il _protocollo locale_, in cui il repository remoto è in un'altra directory sul disco. Questo è spesso utilizzato se ciascuno nel tuo team ha un accesso ad un file system condiviso come NFS, o nel caso meno probabile tutti accedano allo stesso computer. Quest'ultimo caso non è l'ideale, perché tutte le istanze del codice nel repository risiederebbero sullo stesso computer, facendo diventare molto più probabile una perdita catastrofica dei dati.

Se disponi di un filesystem montato in comune, allora si può clonare, inviare e trarre da un repository locale basato su file. Per clonare un repository come questo o per aggiungerne uno da remoto per un progetto esistente, utilizza il percorso al repository come URL. Ad esempio, per clonare un repository locale, è possibile eseguire qualcosa di simile a questo:

	$ git clone /opt/git/project.git

O questo:

	$ git clone file:///opt/git/project.git

Git funziona in modo leggermente diverso se si specifica esplicitamente `file://` all'inizio dell'URL. Se si specifica il percorso, Git tenta di utilizzare gli hardlink o copia direttamente i file necessari. Se specifichi `file://`, Git abilita i processi che normalmente si usano per trasferire i dati su una rete che sono generalmente un metodo molto meno efficace per il trasferimento dei dati. La ragione principale per specificare il prefisso `file://`  è quella in cui si desidera una copia pulita del repository senza riferimenti od oggetti estranei — in genere dopo l'importazione da un altro sistema di controllo di versione o qualcosa di simile (vedi il Capitolo 9 relativo ai compiti per la manutenzione). Qui useremo il percorso normale, perché così facendo è quasi sempre più veloce.

Per aggiungere un repository locale a un progetto Git esistente, puoi eseguire qualcosa di simile a questo:

	$ git remote add local_proj /opt/git/project.git

Quindi, puoi fare inviare e trarre da quel remoto come se si stesse lavorando su una rete.

### I Pro

I pro dei repository basati su file sono che sono semplici e che utilizzano i permessi sui file e l'accesso alla rete già esistenti. Se hai già un filesystem condiviso a cui l'intero team ha accesso, la creazione di un repository è molto facile. Si mette la copia nuda del repository da qualche parte dove tutti hanno un accesso condiviso e si impostano i permessi di lettura/scrittura, come se si facesse per qualsiasi directory condivisa. Proprio per questo scopo vedremo come esportare una copia bare del repository nella prossima sezione, "Installare Git su un server."

Questa è anche una interessante possibilità per recuperare rapidamente il lavoro dal repository di qualcun altro. Se tu e un tuo collega state lavorando allo stesso progetto e volete recuperare qualcosa da fuori, lanciare un comando tipo `git pull /home/john/project` è spesso più facile che inviare prima su un server remoto e poi scaricarlo.

### I Contro

Il contro di questo metodo è che l'accesso condiviso è generalmente più difficile da impostare e da raggiungere da più postazioni rispetto ad un normale accesso di rete. Se vuoi fare un push dal computer quando sei a casa, devi montare il disco remoto, e può essere difficile e lento rispetto ad un accesso di rete.

É anche importante ricordare che questa non è necessariamente l'opzione più veloce, se utilizzi un mount condiviso di qualche tipo. Un repository locale è veloce solo se si dispone di un accesso veloce ai dati. Un repository su NFS è spesso più lento di un repository via SSH sullo stesso server, permettendo a Git di andare con dischi locali su ogni sistema.

## Il Protocollo SSH

Probabilmente il protocollo più utilizzato per Git è SSH. Questo perché un accesso via SSH ad un server è già impostato in molti posti — e se non c'è, è facile crearlo. SSH inoltre è l'unico protocollo di rete in cui puoi facilmente leggere e scrivere. Gli altri due protocolli (HTTP e Git) sono generalmente solo di lettura, quindi se li hai a disposizione per la massa generica, hai comunque bisogno di SSH per i tuoi comandi di scrittura. SSH è inoltre un protocollo di rete con autenticazione; e dato che è dappertutto, è generalmente facile da configurare e usare.

Per clonare un repository Git via SSH, puoi specificare un URL ssh:// come questo:

	$ git clone ssh://user@server/project.git

O non specificare proprio il protocollo — Git utilizza SSH non lo specifichi:
	
	$ git clone user@server:project.git

Puoi anche non specificare l'utente, e Git utilizzerà l'utente con il quale sei ora connesso.

### I Pro

I pro nell'usare SSH sono tanti. Primo, se vuoi avere un'autenticazione con l'accesso in scrittura al tuo repository su una rete devi usarlo. Secondo, SSH è relativamente semplice da impostare — il demone SSH è ovunque, molti amministratori di rete hanno esperienza con lui e molte distribuzioni di OS sono impostate con lui o hanno dei strumenti per amministrarlo. Poi, l'accesso via SSH è sicuro — tutti i dati trasferiti sono criptati ed autenticati. Infine, come i protocolli Git e Local, SSH è efficiente, rende i dati il più compressi possibile prima di trasferirli.

### I Contro

L'aspetto negativo di SSH è che non puoi dare accesso anonimo al tuo repository tramite lui. Le persone devono avere un accesso alla macchina tramite SSH, anche per la sola lettura, ciò rende SSH poco appetibile per i progetti open source. Se lo stai usando solo con la rete della tua azienda, SSH può essere l'unico protocollo con cui avrai a che fare. Se vuoi fornire un accesso anonimo di sola lettura al tuo progetto, devi impostare un SSH per i tuoi invii ma qualcos'altro per per permettere ad altri di trarre i dati.

## Il Protocollo Git

Poi c'è il protocollo Git. Questo è un demone speciale che è incluso nel pacchetto Git; è in ascolto su una porta dedicata (9418) e fornisce un servizio simile al protocollo SSH, ma assolutamente senza autenticazione. Per permettere ad un repository di essere servito tramite il protocollo Git, devi creare un file `git-daemon-export-ok` — il demone non serve il repository senza l'inserimento di questo file — altrimenti non ci sarebbe sicurezza. O il repository Git è disponibile per chiunque voglia copiarlo o altrimenti niente. Questo significa che generalmente non si invia tramite questo protocollo. Puoi abilitare l'accesso all'invio; ma data la mancanza di autenticazione, se abiliti l'accesso di scrittura, chiunque trovi su internet l'URL al progetto può inviare dati. Basti dire che questo è raro.

### I Pro

Il protocollo Git è il protocollo disponibile più veloce. Se hai un grande traffico per un tuo progetto pubblico o hai un progetto molto grande che non richiede un'autenticazione per l'accesso in lettura, è probabile che vorrai impostare per un demone Git per servire il progetto. Usa lo stesso meccanismo di trasferimento dei dati del protocollo SSH ma senza criptazione e autenticazione.

### I Contro

Il rovescio della medaglia è che al protocollo Git manca l'autenticazione.  É generalmente non desiderabile avere l'accesso al progetto solo tramite il protocollo Git. Generalmente, si utilizzano insieme un accesso SSH per gli sviluppatori che hanno permessi di scrittura e per tutti gli altri si usa l'accesso in sola lettura `git://`.
Inoltre è probabilmente il protocollo più difficile da configurare. Deve avviare un proprio demone, che è particolare — vedremo le impostazioni nella sezione “Gitosis” di questo capitolo — richiede la configurazione di `xinetd` o simili, il che non è una passeggiata. Inoltre richiede un accesso tramite il firewall alla porta 9418, che non è una porta standard che i firewall delle aziende permettono di usare sempre. Un firewall di una grande azienda spesso blocca questa sconosciuta porta.

## Il Protocollo HTTP/S

Infine abbiamo il protocollo HTTP. Il bello del protocollo HTTP o HTTPS è la semplicità nel configurarlo. Fondamentalmente, tutto quello che devi fare è mettere solo il repository Git sulla document root HTTP ed impostare uno specifico gancio `post-update` ed il gioco è fatto (vedi il Capitolo 7 per i dettagli sui ganci Git). A questo punto, chiunque in grado di accedere al server web sotto cui hai messo il repository può clonare il repository. Per permettere l'accesso in lettura al repository via HTTP, fai una cosa simile:

	$ cd /var/www/htdocs/
	$ git clone --bare /path/to/git_project gitproject.git
	$ cd gitproject.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Questo è quanto. L'aggancio `post-update` che è messo assieme a Git di default avvia il comando appropriato (`git update-server-info`) per far lavorare correttamente il prelievo e la clonazione HTTP. Questo comando è avviato quando lanci un invio al tuo repository via SSH; poi, altre persone possono clonarlo con una cosa simile:

	$ git clone http://example.com/gitproject.git

In questo caso particolare, stiamo usando il percorso `/var/www/htdocs` che è comunemente presente nelle installazioni di Apache, ma puoi usare un qualsiasi altro server web — basta mettere la base del repository nel percorso. I dati di Git sono forniti come file statici (vedi Capitolo 9 per dettagli su come sono esattamente forniti).

É anche possibile fare l'invio con Git via HTTP, la tecnica non è molto utilizzata e richiede di impostare un complesso WebDAV. Dato che è raramente utilizzato, non lo vedremo in questo libro. Se sei interessato ad usare i protocolli HTTP-push, puoi leggere su come preparare un repository a questo scopo a `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`. Una cosa carina dell'invio con Git via HTTP è utilizzare un qualsiasi server WebDAV, senza alcune specifiche funzionalità di Git; così, puoi usare questa funzionalità se il tuo hosting web fornisce un supporto WebDAV per scrivere aggiornamenti al tuo sito web.

### I Pro

Il bello di usare il protocollo HTTP è che è facile da configurare. Con pochi comandi si può dare facilmente al mondo un accesso in lettura al tuo repository Git. Porta via solo pochi minuti. Inoltre il protocollo HTTP non richiede tante risorse al tuo server. Perché in genere è utilizzato un server statico HTTP per fornire i dati, un server Apache in media può servire migliaia di file al secondo — è difficile sovraccaricare anche un piccolo server.

Puoi anche fornire un accesso in sola lettura via HTTPS, il che significa che puoi criptare il contenuto trasferito; o puoi arrivare al punto di rendere un certificato SSL specifico per i client. Generalmente, se andrai a fare queste cose, è più facile usare una chiave SSH pubblica; ma potrebbe essere una soluzione migliore usare un certificato SSL firmato o un altro tipo di autenticazione HTTP per un accesso in lettura via HTTPS.

Un'altra cosa carina è che l'HTTP è un protocollo comunissimo che i firewall delle aziende in genere configurano per permettere il traffico tramite la sua porta.

### I Contro

L'altra faccia della medaglia nel fornire il tuo repository via HTTP è che è relativamente inefficiente per il client. In genere porta via molto tempo per clonare o scaricare dal repository, e si ha spesso un sovraccarico della rete tramite il trasferimento di volumi via HTTP rispetto ad altri protocolli di rete. Non essendo abbastanza intelligente da trasferire solo i dati di cui hai bisogno — non c'è un lavoro dinamico dalla parte del server in questa transazione — il protocollo HTTP viene spesso definito un protocollo _stupido_. Per maggiori informazioni sulle differenze nell'efficienza tra il protocollo HTTP e gli altri, vedi il Capitolo 9.
