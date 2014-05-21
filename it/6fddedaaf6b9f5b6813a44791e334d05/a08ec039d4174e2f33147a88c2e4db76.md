# Basi di Git

Quindi, cos'è Git in poche parole? Questa è una sezione importante da comprendere, perché se capisci che cos'è Git e gli elementi fondamentali di come funziona, allora sarà probabilmente molto più facile per te usare efficacemente Git. Mentre impari Git, cerca di liberare la tua mente dalle cose che eventualmente già conosci di altri VCS come Subversion e Perforce; ciò ti aiuterà a evitare di far confusione utilizzando lo strumento. Git immagazzina e tratta le informazioni in modo molto diverso dagli altri sistemi, anche se l'interfaccia utente è abbastanza simile; comprendere queste differenze aiuta a prevenire di sentirsi confusi mentre lo si usa.

## Istantanee, non Differenze

La principale differenza tra Git e gli altri VCS (inclusi Subversion e compagni), è come Git considera i suoi dati. Concettualmente la maggior parte degli altri sistemi salvano l'informazione come una lista di modifiche ai file. Questi sistemi (CVS, Subversion, Perforce, Bazaar e così via), considerano le informazioni che mantengono come un insieme di file, con le relative modifiche fatte ai file nel tempo, come illustrato in Figura 1-4.


![](http://git-scm.com/figures/18333fig0104-tn.png)
 
Figura 1-4. Gli altri sistemi tendono ad immagazzinare i dati come cambiamenti alla versione base di ogni file.

Git non considera i dati né li registra in questo modo. Git considera i propri dati più come una serie di istantanee (_snapshot_) di un mini filesystem.  Ogni volta che committi, o salvi lo stato del tuo progetto in Git, fondamentalmente lui fa un'immagine di tutti i file in quel momento, salvando un riferimento allo _snapshot_. Per essere efficiente, se alcuni file non sono cambiati, Git non li risalva, ma crea semplicemente un collegamento al file precedente già salvato. Git considera i propri dati più come in Figura 1-5.


![](http://git-scm.com/figures/18333fig0105-tn.png)
 
Figura 1-5.  Git immagazzina i dati come snapshot del progetto nel tempo.

Questa è una distinzione importante tra Git e pressocché tutti gli altri VCS. Git riconsidera quasi tutti gli aspetti del controllo di versione che la maggior parte degli altri sistemi ha copiato dalle generazioni precedenti. Questo rende Git più simile a un mini filesystem con a dispoizione strumenti incredibilmente potenti che un semplice VCS. Esploreremo alcuni benefici che ottieni pensando in questo modo ai tuoi dati vedremo le ramificazioni (i _branch_) in Git nel Capitolo 3.

## Quasi Tutte le Operazioni Sono Locali

La maggior parte delle operazioni in Git, necessitano solo di file e risorse locali per operare — generalmente non occorrono informazioni da altri computer della rete. Se sei abituato ad un CVCS in cui la maggior parte delle operazioni sono soggette alle latenze di rete, questo aspetto di Git ti farà pensare che gli Dei della velocità abbiano benedetto Git con poteri soprannaturali. Poiché hai l'intera storia del progetto sul tuo disco locale, molte operazioni sembrano quasi istantanee.

Per esempio, per scorrere la storia di un progetto, Git non ha bisogno di connettersi al server per scaricarla e per poi visualizzarla — la legge direttamente dal database locale. Questo significa che puoi vedere la storia del progetto quasi istantaneamente. Se vuoi vedere i cambiamenti introdotti tra la versione corrente di un file e la versione di un mese fa, Git può consultare il file di un mese fa e calcolare localmente le differenze, invece di richiedere di farlo ad un server remoto o di estrarre una precedente versione del file dal server remoto, per poi farlo in locale.

Questo significa anche che sono minime le cose che non si possono fare se si è offline o non connesso alla VPN. Se sei in aereo o sul treno e vuoi fare un po' di lavoro, puoi eseguire tranquillamente il commit, anche se non sei connesso alla rete per fare l'upload. Se tornando a casa, trovi che il tuo client VPN non funziona correttamente, puoi comunque lavorare. In molti altri sistemi, fare questo è quasi impossibile o penoso. Con Perforce, per esempio, puoi fare ben poco se non sei connesso al server; e con Subversion e CVS, puoi modificare i file, ma non puoi inviare i cambiamenti al tuo database (perché il database è offline). Tutto ciò non ti può sembrare una gran cosa, tuttavia potresti rimanere di stucco dalla differenza che Git può fare.

## Git Ha Integrità

Qualsiasi cosa in Git è controllata, tramite checksum, prima di essere salvata ed è referenziata da un checksum. Questo significa che è impossibile cambiare il contenuto di qualsiasi file o directory senza che Git lo sappia. Questa è una funzionalità interna di Git al più basso livello ed è intrinseco nella sua filosofia. Non puoi perdere informazioni nel transito o avere corruzioni di file senza che Git non sia in grado di accorgersene.

Il meccanismo che Git usa per fare questo checksum, è un hash, denominato SHA-1. Si tratta di una stringa di 40-caratteri, composta da caratteri esadecimali (0–9 ed a–f) e calcolata in base al contenuto di file o della struttura della directory in Git. Un hash SHA-1 assomiglia a qualcosa come:

	24b9da6552252987aa493b52f8696cd6d3b00373

in Git, questi valori di hash si vedono dappertutto, perché Git li usa tantissimo. Infatti, Git immagazzina ogni cosa, nel proprio database indirizzabile, non per nome di file, ma per il valore di hash del suo contenuto.

## Git Generalmente Aggiunge Solo Dati

Quando si fanno delle azioni in Git, quasi tutte aggiungono solo dati al database di Git. E' piuttosto difficile che si porti il sistema a fare qualcosa che non sia annullabile o a cancellare i dati in una qualche maniera. Come in altri VCS, si possono perdere o confondere le modifiche, di cui non si è ancora fatto il commit; ma dopo aver fatto il commit di uno snapshot in Git, è veramente difficile perderle, specialmente se si esegue regolarmente, il push del proprio database su di un altro repository.

Questo rende l'uso di Git un piacere perché sappiamo che possiamo sperimentare senza il pericolo di perdere seriamente le cose. Per un maggior approfondimento su come Git salva i dati e come puoi recuperare i dati che sembrano persi, vedi "Sotto il Cofano" nel Capitolo 9.

## I Tre Stati

Ora, presta attenzione. La prima cosa da ricordare sempre di Git se vuoi affrontare al meglio il processo di apprendimento. I tuoi file in Git possono essere in tre stati: _committed_ (committati), _modified_ (modificati) e _staged_ (in stage). Committato significa che il file è al sicuro nel database locale. Modificato significa che il file è stato modificato, ma non è ancora stato committato nel database. In stage significa che hai contrassegnato un file, modificato nella versione corrente, perché venga inserito nello snapshot alla prossima commit.

Questo ci porta alle tre sezioni principali di un progetto Git: la directory di Git, la directory di lavoro e l'area di stage.


![](http://git-scm.com/figures/18333fig0106-tn.png)
 
Figura 1-6. Directory di lavoro, area di stage e directory di Git.

La directory di Git è dove Git salva i metadati e il database degli oggetti del tuo progetto. Questa è la parte più importante di Git, ed è ciò che viene copiato quando si clona un repository da un altro computer.

La directory di lavoro è un checkout di una versione specifica del progetto. Questi file vengono estratti dal database compresso nella directory di Git, e salvati sul disco per essere usati o modificati.

L'area di stage è un file, contenuto generalmente nella directory di Git, con tutte le informazioni riguardanti la tua prossima commit. A volte viene indicato anche come 'indice', ma lo standard è definirlo come 'area di stage' (area di sosta, ndt).

Il flusso di lavoro (_workflow_) di base in Git funziona così:

1. Modifica i file nella tua directory di lavoro
2. Fanno lo stage, aggiungendone le istantanee all'area di stage
3. Committa, che salva i file nell'area di stage in un'istantanea (_snapshot_) permanente nella tua directory di Git.

Se una particolare versione di un file è nella directory git, viene considerata già committata. Se il file è stato modificato, ma è stato aggiunto all'area di staging, è _in stage_. E se è stato modificato da quando è stata estratto, ma non è _in stage_, è modificato.  Nel Capitolo 2, imparerai di più su questi stati e come trarne vantaggio o saltare la parte di staging.
