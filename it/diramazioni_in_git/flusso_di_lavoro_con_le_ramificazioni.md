# Flusso di Lavoro con le Ramificazioni

Ora che hai le basi sui rami e sulle fusioni, cosa puoi o dovresti fare con loro? In questa sezione, vedremo il modo di lavorare comune che questo sistema leggero di ramificazioni rende possibile, così puoi decidere se incorporarlo nel tuo ciclo di sviluppo questo sistema di sviluppo.

## Rami di Lunga Durata

Dato che Git usa un sistema semplice di fusione a tre vie, unire un ramo con un altro più volte dopo un lungo periodo è generalmente facile da fare.  Questo significa che puoi avere molti rami che sono sempre aperti e che puoi usare per differenti fasi del tuo ciclo di sviluppo; puoi fare fusioni regolarmente da alcune di esse in altre.

Alcuni sviluppatori Git hanno un flusso di lavoro che abbraccia questo approccio, come avere un unico codice che è interamente stabile nel loro ramo `master` — possibilmente solo codice che è o sarà rilasciato. Essi hanno poi un altro ramo parallelo chiamato sviluppo o successivo su cui lavorano o usano per i test di stabilità — non necessariamente sempre stabile, ma ogni volta che è in uno stato stabile, può essere fuso in `master`. É usato per inserire rami a tema (rami di breve durata, come il precedente ramo `iss53`) nei rami principali quando sono pronti, per essere sicuri di aver passato tutti i test e non introdurre bug.

In realtà, stiamo parlando dello spostamento dei puntatori sulla linea dei commit eseguiti. I rami stabili saranno alla base della storia dei tuoi commit e i rami di sviluppo saranno al di sopra della storia (vedi Figura 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)
 
Figura 3-18. I rami più stabili sono generalmente all'inizio della storia dei commit.

É generalmente facile pensare come un sistema di silos, dove una serie di commit gradualmente vanno in un contenitore più stabile quando sono bene testati (vedi Figura 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)
 
Figura 3-19. Può essere di aiuto pensare ai rami come dei silos.

Puoi mantenere questa cosa per svariati livelli di stabilità. Alcuni progetti molto grandi hanno inoltre un ramo `proposte` o `ap` (aggiornamenti proposti) che integrano rami che non sono pronti per entrare nel ramo `master` o `successivo`. L'idea è che i tuoi rami sono a vari livelli di stabilità; quando raggiungono un maggior livello di stabilità, sono fusi nel ramo superiore.
Ancora, avere rami di lunga durata non è necessario, ma a volte può essere utile, specialmente quando si ha a che fare con progetti molto grandi e complessi.

## Rami a Tema

I rami a tema, tuttavia, sono utili in progetti di ogni dimensione. Un ramo a tema è un ramo di breve durata che crei e usi per una singola funzionalità particolare o per un lavoro collegato. Questo è qualcosa che non hai mai fatto con un VCS prima perché è generalmente troppo dispendioso creare e fondere rami di sviluppo. Ma con Git è facile creare, lavorare, unire ed eliminare rami più volte al giorno.

Lo hai visto nell'ultima sezione per i rami `iss53` e `hotfix`. Hai fatto alcuni commit in essi, li hai eliminati direttamente dopo averli fusi nel ramo principale. Questa tecnica ti permette di cambiare contenuto velocemente e completamente — perché il tuo lavoro è separato in silos dove tutti i cambiamenti in quei rami avverranno li, è più facile vedere cosa è successo durante una revisione del codice o altro. Puoi lasciare lì i cambiamenti per minuti, giorni o mesi e fonderli assieme quando sono pronti, indipendentemente dall'ordine con cui sono stati creati o su come si è lavorato.

Considera un esempio di lavoro (su `master`), ti sposti in un altro ramo per un problema (`iss91`), lavori su questo per un po', ti sposti in una seconda branca per provare un altro modo per risolvere il problema (`iss91v2`), torni al ramo principale e lavori su questo per un poco, e poi vai in un altro ramo per fare un lavoro che non sei sicuro sia proprio una buona idea (ramo `dumbidea`). La storia dei tuoi commit assomiglierà a qualcosa come la Figura 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)
 
Figura 3-20. La storia dei tuoi commit con più rami.

Ora, diciamo che hai deciso che ti piace la seconda soluzione per risolvere il problema (`iss91v2`); e hai mostrato il ramo `dumbidea` ai tuoi collaboratori, e si scopre una genialata. Puoi gettare via il ramo `iss91` (perdendo i commit C5 e C6) e fondere gli altri due. La tua storia assomiglierà alla Figura 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)
 
Figura 3-21. La tua storia dopo che hai fatto la fusione di dumbidea e iss91v2.

É importante ricordare che ogni volta che si fa una cosa simile i rami sono completamente separate. Quando crei rami o fai fusioni, tutto è eseguito nel tuo repository Git — nessuna comunicazione con il server è avvenuta.
