# Rifondazione

In Git, ci sono due modi per integrare i cambiamenti da un ramo in un altro: il `merge` ed il `rebase`. In questa sezione imparerai cos'è la rifondazione, come farlo, perché è uno strumento così fantastico, ed in quali casi puoi non volerlo utilizzare.

## Le Basi del Rebase

Se torni indietro in un precedente esempio alla sezione sulla fusione (vedi Figura 3-27), puoi vedere che hai separato il tuo lavoro e hai fatto dei commit in rami differenti.


![](http://git-scm.com/figures/18333fig0327-tn.png)
 
Figura 3-27. L'inizio della divisione della storia dei commit.

Il modo più semplice per integrare i due rami, come abbiamo visto, è il comando `merge`. Lui avvia una fusione a tre vie con le ultime due istantanee dei rami (C3 e C4) ed il più recente progenitore comune dei due (C2), creando un nuovo snapshot (e commit), come visualizzato in Figura 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)
 
Figura 3-28. Fusione di un ramo per integrare una storia divisa.

Tuttavia, esiste un'altra possibilità: puoi prendere una patch del cambiamento che abbiamo introdotto in C3 ed applicarla all'inizio di C4. In Git, questo è chiamato _rifondazione_. E con il comando `rebase`, puoi prendere tutti i cambiamenti che sono stati inviati su un ramo ed applicarli su un altro.

In questo esempio, digita quanto segue:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

Questi comandi funzionano andando al progenitore comune dei due rami (uno è quello in cui ti trovi e uno è quello su cui stai facendo il rebase), ottiene il diff di ogni commit del ramo in cui ti trovi, salva le informazioni in un file temporaneo, reimposta il ramo corrente allo stesso commit del ramo su cui stai facendo il rebase, e alla fine applica ogni singolo cambiamento. La Figura 3-29 illustra questo processo.


![](http://git-scm.com/figures/18333fig0329-tn.png)
 
Figura 3-29. Rifondazione dei cambiamenti introdotti in C3 in C4.

A questo punto, puoi tornare indietro sul ramo principale e fare una fusione veloce (vedi Figura 3-30).


![](http://git-scm.com/figures/18333fig0330-tn.png)
 
Figura 3-30. Avanzamento veloce del ramo principale.

Ora, lo snapshot puntato da C3' è esattamente lo stesso del puntatore nell'esempio di fusione. Non c'è differenza nel prodotto finale dell'integrazione, ma la rifondazione crea una storia più pulita. Se esamini il log del ramo su cui è stato fatto il rebase, assomiglia ad una storia lineare: appare come se tutto il lavoro fosse stato fatto in serie, invece è stato fatto in parallelo.

A volte, farai questa cosa per essere sicuro che i tuoi commit appaiano puliti nel ramo remoto — probabilmente in un progetto a cui stai cercando di contribuire ma che non mantieni. In questo caso, fai il tuo lavoro in  un ramo e poi fai il rebase in `origin/master` quando sei pronto per inviare le tue patch al progetto principale. In questo modo, gli amministratori non hanno da integrare niente — semplicemente applicano la fusione o fanno una fusione veloce.

Nota che lo snapshot punta al commit finale, che è l'ultimo dei commit su cui è stato fatto il rebase per un rebase o il commit finale di fusione dopo un merge, è lo stesso snapshot — è solo la storia che è differente. La rifondazione applica i cambiamenti su una linea di lavoro in un'altra nell'ordine con cui sono stati introdotti, dove la fusione prende lo stato finale e fa un'unione di essi.

## Rebase Più Interessanti

Puoi anche avere il tuo rebase su qualcosa che non è il ramo di rebase. Prendi la storia della Figura 3-31, per esempio. Hai un ramo a tema (`server`) per aggiungere delle funzioni lato server al tuo progetto, e fai un commit. Poi, ti sposti su un altro ramo per creare dei cambiamenti sul lato client (`client`) e fai dei commit. Alla fine, torni sul tuo ramo server e fai degli altri commit.


![](http://git-scm.com/figures/18333fig0331-tn.png)
 
Figura 3-31. Una storia con un ramo a tema ed un altro ramo a tema da questo.

Supponiamo che tu decida di voler unire i tuoi cambiamenti lato client nella linea principale per un rilascio, ma non vuoi unire le modifiche lato server per testarle ulteriormente. Puoi prendere le modifiche sul client che non sono sul server (C8 e C9) ed applicarle nel ramo master usano l'opzione `--onto` di `git rebase`:

	$ git rebase --onto master server client

Questo dice, “Prendi il ramo client, fai le patch a partire dall'ancora comune dei rami `client` e `server`, ed applicali in `master`.“ É un po' complesso; ma il risultato, mostrato in Figura 3-32, è davvero interessante.


![](http://git-scm.com/figures/18333fig0332-tn.png)
 
Figura 3-32. Rifondazione di un ramo a tema con un altro ramo a tema.

Ora puoi fare una fusione veloce con il ramo master (vedi Figura 3-33):

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)
 
Figura 3-33. Fusione ad avanzamento veloce con il ramo master per includere i cambiamenti del ramo client.

Diciamo che hai deciso di inviare il tutto nel ramo server. Puoi fare un rebase del ramo server in quello master senza dover controllarlo prima lanciando `git rebase [basebranch] [topicbranch]` — che controlla il ramo a tema (in questo caso, `server`) per te e gli applica il ramo base (`master`):

	$ git rebase master server

Questo applica il tuo lavoro `server` sopra al tuo lavoro `master`, come in Figura 3-34.


![](http://git-scm.com/figures/18333fig0334-tn.png)
 
Figura 3-34. Rifondazione del ramo server sopra al ramo master.

Poi, puoi fare una fusione veloce con il ramo base (`master`):

	$ git checkout master
	$ git merge server

Puoi rimuovere i rami `client` e `server` perché tutto il lavoro è integrato e non ne hai più bisogno, lasciando così la storia dell'intero processo come in Figura 3-35:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)
 
Figura 3-35. Storia finale dei commit.

## I Rischio della Rifondazione

Ahh, ma la bellezza della rifondazione non è senza macchia, che può essere riassunta in una singola frase:

**Non fare il rebase dei commit che hai inviato in un repository pubblico.**

Se segui queste linea guida è ok. Se non lo farai, le persone ti odieranno e sarai disprezzato dagli amici e dalla famiglia.

Quando fai il rebase di qualcosa, stai abbandonando i commit esistenti per crearne di nuovi che sono simili ma differenti. Se invii i commit da qualche parte e altri li hanno scaricati hanno basato il loro lavoro su questi, e tu riscrivi questi commit con `git rebase` e poi li invii nuovamente, i tuoi collaboratori dovranno fare una nuova fusione del loro lavoro e le cose saranno disordinate quando cercherai di scaricare il loro lavoro nel tuo.

Vedi l'esempio su come funziona il rebase che hai reso pubblico e cosa può causare. Supponiamo che abbia clonato un repository da un server centrale e poi abbia fatto dei lavori. La storia dei tuoi commit assomiglierà alla Figura 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)
 
Figura 3-36. Repository clonato e del lavoro basato su questo.

Ora, qualcuno ha fatto molto lavoro che include una fusione, e ha inviato questo lavoro al server centrale. Tu scarichi questo e lo unisci con un nuovo ramo remoto nel tuo lavoro, rendendo la tua storia come qualcosa in Figura 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)
 
Figura 3-37. Scarichi più commit, e li fondi assieme nel tuo lavoro.

Poi, la persona che ha inviato il suo lavoro decide di tornare indietro e fa un rebase del suo lavoro; e da un `git push --force` per sovrascrivere la storia del server. Puoi poi scaricare nuovamente dal server i nuovi commit.


![](http://git-scm.com/figures/18333fig0338-tn.png)
 
Figura 3-38. Qualcuno ha inviato dei commit su cui è stato fatto il rebase, abbandonando i commit che su cui avevi basato il tuo lavoro.

A questo punto devi fondere di nuovo il tuo lavoro, e tu lo avevi già fatto. La rifondazione modifica gli hash SHA-1 di questi commit così per Git sono come dei nuovi commit, mentre di fatto hai già il lavoro C4 nel tuo repository (vedi Figura 3-39).


![](http://git-scm.com/figures/18333fig0339-tn.png)
 
Figura 3-39. Fai la fusione nello stesso lavoro con un nuovo commit di unione.

Devi fondere questo lavoro in ogni punto così puoi rimanere aggiornato con l'altro sviluppatore in futuro. Dopo che hai fatto questo, la storia dei tuoi commit contiene sia i commit C4 e C4', che hanno un hash SHA-1 differente ma introducono lo stesso lavoro e hanno lo stesso messaggio per il commit. Se lanci `git log` quando la tua storia assomiglia a questo, vedrai i due commit che hanno lo stesso autore data e messaggio, e ciò confonde. Inoltre, Se invii questa storia al server, tu reinserisci nel server centrale questi commit che hanno subito un rebase, ciò confonde ulteriormente le persone.

Se tratti la rifondazione com un modo per essere pulito e lavorare con i commit prima di inviarli, e se fai il rebase solamente dei commit che non sono mai diventati pubblici, allora la cosa è ok. Se fai il rebase dei commit che sono già stati inviati e sono pubblici, e le persone hanno basato il loro lavoro su questi commit, allora potresti creare dei problemi di frustazione.
