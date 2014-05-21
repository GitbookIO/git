# Impianto e sanitari (*Plumbing* e *Porcelain*)

Questo libro parla di come usare Git utilizzando più di 30 termini come `checkout`, `branch`, `remote` e così via. Poiché Git è stato inizialmente sviluppato come un insieme di strumenti per un VCS, piuttosto che un completo VCS user-friendly, ha un mucchio di termini per fare lavori di basso livello e progettati per essere concatenati insieme nello stile UNIX o invocati da script. Di solito ci si riferisce a questi comandi come "plumbing" (impianto), mentre i comandi più user-friendly sono detti comandi "porcelain" (sanitari).

I primi otto capitoli del libro hanno a che fare quasi esclusivamente con comandi *porcelain*. In questo capitolo vedremo invece i comandi *plumbing* di basso livello, perché permettono di accedere al funzionamento interno di Git ed aiutano a dimostrare come e perché Git fa quello che fa. Questi comandi non sono pensati per essere lanciati manualmente dalla linea di comando ma sono da considerare piuttosto come mattoni con i quali costruire nuovi strumenti e script personalizzati.

Eseguendo `git init` in una directory nuova o esistente Git provvederà a creare la directory `.git` che contiene praticamente tutto ciò di cui ha bisogno Git. Se vuoi fare un backup o un clone del tuo repository ti basta copiare questa directory da qualche altra parte per avere praticamente tutto quello che ti serve. Tutto questo capitolo tratta il contenuto di questa directory. La sua struttura di default è la seguente:

	$ ls 
	HEAD
	branches/
	config
	description
	hooks/
	index
	info/
	objects/
	refs/

Potresti trovare altri file, ma quello che vedi sopra è il risultato di `git init` appena eseguito. La directory `branches` non è utilizzata dalle versioni più recenti di Git e il file `description` è utilizzato solamente dal programma GitWeb, quindi puoi pure ignorarli.
Il file `config` contiene le configurazioni specifiche per il progetto e la directory `info` mantiene 
un file di exclude globale per ignorare i pattern dei quali non volete tenere traccia un in file .gitignore. La directory `hooks` contiene i tuoi script di hook client/server, che vengono discussi in dettaglio nel capitolo 7.

Non abbiamo ancora parlato di quattro cose importanti: i file `HEAD` e `index` e le directory `objects` e `refs`, che fanno parte del nucleo di Git. La directory `objects` contiene tutto il contenuto del tuo database, la directory `refs` contiene i puntatori agli oggetti delle commit nei diversi branch, il file `HEAD` punta al branch di cui hai fatto il checkout e nel file `index` Git registra la informazioni della tua area di staging. Vedremo in dettaglio ognuna di queste sezioni per capire come opera Git.
