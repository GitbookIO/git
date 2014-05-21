# Git Hooks

Come in molti altri Version Control Systems, in Git esiste un modo per eseguire alcuni script personalizzati quando si verificano determinate azioni. Questi hooks sono di due tipi: lato client e lato server. Gli hooks lato client sono per operazioni client come commit e merge. Per quanto riguarda gli hooks lato server, sono per operazioni lato server, come ricevere i commits di cui è stato eseguito il push. È possibile utilizzare questi hooks per molte ragioni, ora ne vedremo alcune.

## Configurare un Hook

Gli hooks sono salvati nella sottodirectory `hooks` all'interno della directory Git. In molti progetti è `.git/hooks`. Di default, Git inserisce in questa directory un mucchio di scripts di esempio, molti di essi sono utili; viene anche documentato l'input per ciascuno script. Tutti gli esempi sono scritti come shell scripts, con un po' di Perl, tuttavia ogni script eseguibile chiamato in modo appropriato andrà bene — è possibile scriverli in Ruby, Python... Per le versioni di Git successive alla 1.6, questi hook di esempio finiscono con .sample; è necessario rinominarli. Per le versioni precedenti alla 1.6 i files hanno nome corretto ma non sono eseguibili.

Per abilitare uno script hook, bisogna inserire il file nella sottodirectory `hooks` della directory Git, il file dovrà essere nominato in modo appropriato ed eseguibile. Da questo punto in poi dovrebbe essere chiamato. Vedremo ora i principali nomi di hook.

## Hooks Lato Client

Esistono molti hooks lato client. In questa sezione li divideremo in committing-workflow hooks, e-mail-workflow scripts, ed i restanti client-side scripts.

### Committing-Workflow Hooks

I primi quattro hooks sono correlati con il processo di commit. L'hook `pre-commit` è eseguito per primo, prima che venga richiesto l'inserimento del messaggio di commit. È usato per controllare lo snapshot di cui si vuole eseguire il commit, per vedere se ci si è dimenticati di qualcosa, per assicurarsi che i test funzionino, o per esaminare qualsiasi cosa si voglia nel codice. Se il valore di uscita di questo hook è un non-zero il commit viene annullato, in alternativa può essere bypassato tramite il comando `git commit --no-veriy`. È possibile eseguire operazioni come controllare lo stile del codice (eseguendo lint o qualcosa di simile), cercare whitespace alla fine (l'hook di default fa esattamente questo), cercare documentazione appropriata su nuovi metodi.

L'hook `prepare-commit-msg` è eseguito prima che venga invocato il message editor del commit, ma dopo che il messaggio di default sia stato creato. Permette di modificare il messaggio di default prima che l'autore del commit lo veda. Questo hook riceve qualche parametro: il path del file che contiene il messaggio del commit, il tipo di commit, lo SHA-1 del commit nel caso sia un amend commit. Questo hook solitamente non è utile per i commit normali; tuttavia va bene per commit dove il messaggio di default è generato in maniera automatica, come templated commit messages, merge commits, squashed commits ed amend commits. È utilizzabile insieme ad un commit template per inserire informazioni in modo programmato.

L'hook `commit-msg` riceve un parametro: il path del file temporaneo contenete il messaggio commit. Se lo script termina con non-zero, Git annulla il procedimento, quindi è possibile utilizzarlo per validare lo stato del progetto o un messaggio del commit prima di consentire al commit di proseguire. Nell'ultima sezione di questo capitolo, Vedremo come verificare che un messaggio del commit sia conforme ad un certo pattern utilizzando un hook.

Al termine dell'intero processo di commit, viene eseguito l'hook `post-commit`. Non riceve alcun parametro, tuttavia è possibile recuperare l'ultimo commit semplicemente tramite il comando `git log -1 HEAD`. Solitamente, questo script è utilizzato per notificazioni o simili.

Gli script client-side per il committing-workflow possono essere utilizzati in ogni flusso di lavoro. Sono spesso utilizzati per rafforzare alcune norme, è comunque importante notare che questi scripts non sono trasferiti durante un clone. È possibile rafforzare le norme lato server per rifiutare push di commits che non siano conformi a qualche norma, ma è responsabilità dello sviluppatore utilizzare questi script lato client. Quindi, questi sono scripts che aiutano gli sviluppatori, devono essere impostati e mantenuti da loro, possono essere modificati o sovrascritti da loro in ogni momento.

### E-mail Workflow Hooks

È possibile impostare tre hooks lato client per un flusso di lavoro basato sulle e-mail. Sono tutti invocati dal comando `git am`, quindi se non si utilizza il detto comando, questa sezione può essere tranquillamente saltata. Se si prendono patches via e-mail preparate tramite `git format-patch`, allora alcuni di questi hooks potrebbero risultare utili.

Il primo hook che viene eseguito è `applypatch-msg`. Riceve un unico argomento: il nome del file temporaneo che contiene il messaggio di commit proposto. Git annulla la patch nel caso lo script termini con valore d'uscita non-zero. È possibile utilizzare questo hook per assicurarsi che il messaggio di un commit sia formattato in modo appropriato o per normalizzare il messaggio facendolo editare allo script.

Il prossimo hook che viene eseguito è `pre-applypatch`. Non riceve argomenti e viene eseguito dopo che la patch viene applicata, quindi è possibile utilizzarlo per esaminare lo snapshot prima di eseguire il commit. È possibile eseguire tests o, in alternativa, esaminare l'albero di lavoro con questo script. Se manca qualcosa o non passano i tests, ritornando non-zero viene annullato `git am` senza che venga eseguito il commit della patch.

L'ultimo hook che viene eseguito è `post-applypatch`. È possibile utilizzarlo per notificare ad un gruppo o all'autore della patch che è stato eseguito il pull nel quale si è lavorato. È possibile fermare il patching tramite questo script.

### Altri Client Hooks

L'hook `pre-rebase` viene eseguito prima di un rebase e può fermare il processo ritornando un non-zero. È possibile utilizzare questo hook per negare il rebasing di qualsiasi commit di cui sia stato già effettuato un push. Lo script `pre-rebase` di esempio esegue quanto detto, in alternativa assume che next sia il nome del branch che si vuole pubblicare. Dovresti cambiarlo nel branch stabile.

Dopo aver eseguito con successp `git checkout`, viene eseguito l'hook `post-checkout`; è possibile utilizzarlo per configurare in modo appropriato la directory di lavoro per il progetto. Questo potrebbe significare spostare all'interno grossi file binari di cui non si vuole conrollare il codice, generare in modo automatico la documentazione...


Infine, l'hook `post-merge` viene eseguito dopo un comando `merge` terminato con successo. È possibile utilizzarlo per ripristinare informazioni dell'albero che Git non riesce a tracciare (come informazioni di permessi). Questo hook può allo stesso modo validare la presenza di files esterni al controllo di Git che potresti voler copiare all'interno quando l'albero di lavoro cambia.

## Hooks Lato Server

In aggiunta agli hooks lato client, è possibile utilizzare un paio di hooks lato server come amministrazione di sistema per rafforzare praticamente ogni tipo di norma per il progetto. Questi scripts vengono eseguiti prima e dopo i push verso il server. I pre hooks possono ritornare non-zero in ogni momento per rifiutare il push inviando un messaggio di errore al client; è possibile configurare una politica di push che sia complessa quanto si desidera.

### pre-receive e post-receive

Il primo script da eseguire nella gestione di un push da client è `pre-receive`. Riceve in ingresso una lista di riferimenti di cui si esegue il push da stdin; se ritorna non-zero, nessuno di essi sarà accettato. È possibile utilizzare questo hook per eseguire azioni come assicurarsi che nessuno dei riferimenti aggiornati sia non-fast-forwards; o di controllare che l'utente esegua il push che ha creato, cancellato, 
The first script to run when handling a push from a client is `pre-receive`. It takes a list of references that are being pushed from stdin; if it exits non-zero, none of them are accepted. You can use this hook to do things like make sure none of the updated references are non-fast-forwards; or to check that the user doing the pushing has create, delete, or push access or access to push updates to all the files they’re modifying with the push.

L'hook `post-receive` viene eseguito al termine dell'intero processo, può essere usato per aggiornare altri servizi o notificare agli utenti. Riceve in ingresso gli stessi dati stdin del `pre-receive` hook. Gli esempi includono inviare via mail un elenco, notificare una continua integrazione con il server, aggiornare un sistema ticket-tracking — è possibile anche eseguire un parse dei messaggi commit per vedere se deve essere aperto, chiuso o modificato, qualche ticket. Questo script non può interrompere il processo di push, tuttavia il client non si disconnette fino a che non è completato; quindi, è necessario fare attenzione ogni volta che si cerca di fare qualcosa che potrebbe richiedere lunghi tempi.
### update

Lo script update è molto simile allo script `pre-receive`, a parte per il fatto che è eseguito una volta per ogni branch che chi esegue push stia cercando di aggiornare. Se si vogliono aggiornare molti rami, `pre-receive` viene eseguiro una volta, mentre update viene eseguito una volta per ogni ramo. Invece di leggere informazioni da stdin, questo script contiene tre argomenti: il nome del riferimento (ramo), lo SHA-1 a cui si riferisce all'elemento puntato prima del push, lo SHA-1 di cui l'utente sta cercando di eseguire un push. Nel caso lo script di update ritorni non-zero, solo il riferimento in questione verrà rifiutato; gli altri riferimenti possono comunque essere caricati.