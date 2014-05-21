# Workflows distribuiti

A differenza dei gestori di versione centralizzati (CVCS), la natura distribuita di Git ti permette di essere più flessibile nel gestire il modo in cui gli sviluppatori collaborano ai progetti. Nel sistemi centralizzati ogni sviluppatore è un nodo che lavora appoggiandosi ad un nucleo centrale più o meno ugualmente agli altri. Con Git, invece, ogni sviluppatore è potenzialmente sia un nodo che un nucleo: infatti ogni sviluppatore può contemporaneamente contribuire al codice di altri repository e mantenere un repository pubblico sul quale gli altri basino il proprio lavoro e verso il quale possano contribuire. Questo apre ad una vasta gamma di possibilità di workflow per il tuo progetto e/o il tuo gruppo. Tratterò quindi alcuni paradigmi che sfruttano questa flessibilità. Discuterò i punti di forza e le possibili debolezze di ogni design: potrai usarne uno o combinarli per adattarli alle tue necessità.

## Workflow centralizzato

Nei sistemi centralizzati, generalmente c'è un solo modo per collaborare: il flusso centralizzato. Un nucleo centrale, c.d. repository, può accettare il codice e tutti sincronizzano il proprio lavoro con questo nucleo. Un numero di sviluppatori sono nodi - utenti del nucleo - e restano sincronizzati con questo nucleo centrale (vedi Figura 5-1).


![](http://git-scm.com/figures/18333fig0501-tn.png)

Figura 5-1. Worlflow centralizzato

Questo significa che se due sviluppatori clonano dal nucleo ed entrambi fanno dei cambiamenti, il primo sviluppatore che trasmetterà le proprie modifiche al nucleo non avrà problemi. Il secondo, invece, dovrà prima unire al proprio lavoro quello del primo e quindi potrà inviare i suoi cambiamenti, per non sovrascrivere il lavoro del primo. Questo accade in Git come in Subversion (o un altro CVCS), e questo modello funziona tranquillamente in Git.

Se hai un piccolo gruppo, o nella tua azienda siete già abituati ad un workflow centralizzato, puoi facilmente continuare ad utilizzare questo metodo con Git. Crea un singolo repository e dai a ognuno del tuo gruppo la possibilità di effettuare una push; Git non lascerà agli utenti la possibilità di sovrascrivere il lavoro di un l'altro. Se uno sviluppatore clona, fa dei cambiamenti, e poi prova a fare una push delle proprie modifiche dopo che un altro utente abbia già inviato le proprie modifiche, il server rifiuterà le modifiche dell'ultimo. Questi sarà avvisato che sta cercando di fare la push di una copia non aggiornata e non potrà caricare le proprie modifiche finché non le unirà con quelle effettuate dagli altri.
Molti usano questo metodo perché sono abituati a lavorare con questo paradigma.

## Workflow con manager d'integrazione

Poiché Git permette di avere repository multipli, è possibile avere un workflow dove ogni sviluppatore ha accesso in scrittura al proprio repository pubblico e accesso in lettura a quello degli altri. Questo scenario spesso prevede anche un repository classico che rappresenta il progetto "ufficiale". Per contribuire a progetti di questo tipo, devi creare il tuo clone pubblico del progetto e inviarvi (con una push) le tue modifiche e successivamente chiedere al mantenitore del progetto di fare una pull delle stesse. Questi può aggiungere il tuo repository come remoto, testarlo localmente, unirlo al proprio branch e fare una push verso il proprio repository. Il processo funziona così (vedi Figura 5-2):

1.  Il mantenitore del progetto fa le push sul proprio repository pubblico.
2.  Un contributore clona il reposiory ed fa delle cambiamenti.
3.  Il contributore invia le modifiche al suo repository pubblico.
4.  Il contributore invia al mantenitore una e-mail chiedendo di fare una pull dei cambiamenti.
5.  Il mantenitore aggiunge il repository del contributore come remoto e fa un merge in locale dei cambiamenti.
6.  Il mantenitore fa una push dei cambiamenti (compresi quelli aggiunti dal contributore) verso il repository principale.


![](http://git-scm.com/figures/18333fig0502-tn.png)

Figura 5-2. Workflow con manager d'integrazione

Questo è un workflow comune con siti come GitHub, dove è facile eseguire un fork di un progetto e inviare le tue modifiche al tuo fork, in modo che tutti possano accedervi. Uno dei vantaggi principali di questo approccio è che puoi continuare il tuo lavoro mentre il mantenitore del repository principale può eseguire una pull dei tuoi cambiamenti in qualsiasi momento. I contributori non devono aspettare che il progetto incorpori le modifiche: ognuno può lavorare per conto suo.

## Workflow con Dittatore e Tenenti

Questa è una variante del workflow con repository multipli. Viene generalmente usata da grandi progetti con centinaia di collaboratori: un esempio famoso è il Kernel Linux. Molti manager d'integrazione sono responsabili di certe parti del repository e vengono chiamati tenenti. Tutti i tenenti hanno un manager d'integrazione conosciuto come "dittatore benevolo". Il repository del dittatore benevolo è il repository di riferimento dal quale tutti i collaboratori prendono il codice. Il flusso di lavoro è il seguente (vedi Figura 5-3):

1.  Sviluppatori normali lavorano sul loro branch ed eseguono un _rebase_ del proprio lavoro sul master. Il branch master è quello del dittatore.
2.  I tenenti uniscono il lavoro degli sviluppatori nel proprio branch master.
3.  Il dittatore esegue l'unione dei branch master dei tenenti nel proprio branch master.
4.  Il dittatore esegue una push del proprio ramo master nel repository di riferimento, cosicché gli sviluppatori possano accedervi.


![](http://git-scm.com/figures/18333fig0503-tn.png)

Figura 5.3. Workflow con dittatore benevolo.

Questo tipo di workflow non è comune ma può essere utile in progetti molto grandi o in ambienti con una gerarchia forte, perché consente al leader del progetto (il dittatore) di delegare molto del lavoro e raccogliere vasti sottoinsiemi di codice in punti diversi prima di integrarli.

Ci sono alcuni workflow utilizzati comunemente che sono possibili con un sistema distribuito come Git, ma esistono molte possibili varianti per adattarli al tuo caso specifico. Ora che hai (spero) determinato quale combinazione di workflow possa funzionare per te, illustrerò alcuni esempi sui ruoli principali dei diversi workflow.
