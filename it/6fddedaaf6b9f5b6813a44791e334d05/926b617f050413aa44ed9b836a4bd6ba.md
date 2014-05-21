# Il Controllo di Versione

Cos'è il controllo di versione, e perché dovresti usarlo? Il controllo di versione è un sistema che registra, nel tempo, i cambiamenti ad un file o ad una serie di file, così da poter richiamare una specifica versione in un secondo momento. Sebbene gli esempi di questo libro usino i sorgenti di un software per controllarne la versione, qualsiasi file di un computer può essere posto sotto controllo di versione.

Se sei un grafico o un webdesigner e vuoi tenere tutte le versioni di un'immagine o di un layout (e sicuramente lo vorrai fare), sarebbe saggio usare un Sistema per il Controllo di Versione (_Version Control System_ - VCS). Un VCS ti permette di ripristinare i file ad una versione precedente, ripristinare l'intero progetto a uno stato precedente, revisionare le modifiche fatte nel tempo, vedere chi ha cambiato qualcosa che può aver causato un problema, chi ha introdotto un problema e quando, e molto altro ancora. Usare un VCS significa anche che se fai un pasticcio o perdi qualche file, puoi facilmente recuperare la situazione. E ottieni tutto questo con poca fatica.

## Sistema di Controllo di Versione Locale

Molte persone gestiscono le diverse versioni copiando i file in un'altra directory (magari una directory denominata con la data, se sono furbi). Questo approccio è molto comune perché è molto semplice, ma è anche incredibilmente soggetto ad errori. É facile dimenticare in quale directory sei e modificare il file sbagliato o copiare dei file che non intendevi copiare.

Per far fronte a questo problema, i programmatori svilupparono VCS locali che avevano un database semplice che manteneva tutti i cambiamenti dei file sotto controllo di revisione (vedi Figura 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)
 
Figura 1-1. Diagramma di controllo di un sistema locale.

Uno dei più popolari strumenti VCS era un sistema chiamato rcs, che è ancora oggi distribuito con molti computer. Anche il popolare sistema operativo Mac OS X include il comando rcs quando si installano gli Strumenti di Sviluppo. Questo strumento funziona salvando sul disco una serie di patch (ovvero le differenze tra i file) tra una versione e l'altra, in un formato specifico; può quindi ricreare lo stato di qualsiasi file in qualsiasi momento determinato momento, aggiungendo le varie patch.

## Sistemi di Controllo di Versione Centralizzati

Successivamente queste persone dovettero affrontare il problema del collaborare con altri sviluppatori su altri sistemi. Per far fronte a questo problema, vennero sviluppati sistemi di controllo di versione centralizzati (_Centralized Version Control Systems_ - CVCS). Questi sistemi, come CVS, Subversion e Perforce, hanno un unico server che contiene tutte le versioni dei file e un numero di utenti che scaricano i file dal server centrale. Questo è stato lo standard del controllo di versione per molti anni (vedi Figura 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)
 
Figura 1-2. Diagramma controllo di versione centralizzato.

Questa impostazione offre molti vantaggi, specialmente rispetto ai VCS locali.  Per esempio, chiunque sa, con una certa approssimazione, cosa stia facendo un'altra persona del progetto. Gli amministratori hanno un controllo preciso su chi può fare cosa, ed è molto più facile amministrare un CVCS che un database locale su ogni client.

Questa configurazione ha tuttavia alcune gravi controindicazioni. La più ovvia è che il server centralizzato rappresenta il singolo punto di rottura del sistema. Se questo va giù per un'ora, in quel periodo nessuno può collaborare o salvare una nuova versione di qualsiasi cosa su cui sta lavorando. Se il disco rigido del database centrale si danneggia, e non ci sono i backup, perdi assolutamente tutto: tutta la storia del progetto ad eccezione dei singoli snapshot (istantanee) che le persone possono avere in locale sulle loro macchine. Anche i sistemi locali di VCS soffrono di questo problema: ogni volta che tutta la storia del progetto è in un unico posto, si rischia di perdere tutto.

## Sistemi di Controllo di Versione Distribuiti

E qui entrano in gioco i Sistemi di Controllo di Versione Distribuiti (_Distributed Version Control Systems_ - DVCS). In un DVCS (come Git, Mercurial, Bazaar o Darcs), i client non solo controllano lo _snapshot_ più recente dei file, ma fanno una copia completa del repository. In questo modo se un server morisse e i sistemi interagiscono tramite il DVCS, il repository di un qualsiasi client può essere copiato sul server per ripristinarlo. Ogni checkout è un backup completo di tutti i dati (vedi Figura 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)
 
Figura 1-3. Diagramma del controllo di versione distribuito.

Inoltre, molti di questi sistemi trattano bene l'avere più repository remoti su cui poter lavorare, così puoi collaborare con gruppi differenti di persone in modi differenti, simultaneamente sullo stesso progetto. Questo ti permette di impostare diversi tipi di flussi di lavoro che non sono possibili in sistemi centralizzati, come i modelli gerarchici.
