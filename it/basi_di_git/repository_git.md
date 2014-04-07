# Repository Git

Puoi creare un progetto Git principalmente con due approcci. Il primo prende un progetto esistente o una directory e la importa in Git. Il secondo clona un repository Git esistente, su un altro server.

## Creare un repository in una directory preesistente

Se vuoi iniziare a tenere traccia con Git di un progetto esistente, devi andare nella directory del progetto e digitare:

	$ git init

Questo creerà una nuova sottodirectory chiamata .git che conterrà tutti i file necessari per il tuo repository: una struttura del repository Git. A questo punto non è ancora stato tracciato niente del tuo progetto. (Vedi il *Capitolo 9* per sapere quali file sono contenuti nella directory `.git` che hai appena creato.)

Se vuoi iniziare a tracciare i file esistenti (a differenza di una directory vuota), dovresti iniziare a monitorare questi file con una commit iniziale. Lo puoi fare con pochi comandi `git add`, che specificano quali file vuoi tracciare, seguiti da un commit: 

	$ git add *.c
	$ git add README
	$ git commit -m 'initial project version'

Tra un minuto vedremo cosa fanno questi comandi. A questo punto hai un repository Git con dei file tracciati e una commit iniziale.

## Clonare un Repository Esistente

Se vuoi avere la copia di un repository Git esistente — per esempio, un progetto a cui vuoi contribuire — il comando di cui hai bisogno è git clone. Se hai familiarità con altri sistemi VCS come Subversion, noterai che il comando è clone e non checkout. Questa è una distinzione importante — Git riceve una copia di circa tutti i dati che un server possiede. Ogni versione di ogni file della storia del progetto sono scaricate quando lanci `git clone`. Infatti, se il disco del tuo server è corrotto, puoi usare qualsiasi copia di qualsiasi client per ripristinare il server allo stato in cui era quando è stato clonato (puoi perdere alcuni agganci server, ma tutte le versioni dei dati saranno presenti — vedi il Capitolo 4 per maggiori dettagli).

Clona un repository con `git clone [url]`. Per esempio, se vuoi clonare la libreria Ruby Git chiamata Grit, puoi farlo così:

	$ git clone git://github.com/schacon/grit.git

Questo comando crea un directory "grit", inizializza una directory `.git` dentro di essa, scarica tutti i dati per questo repository ed imposta la copia di lavoro dell'ultima versione. Se entri nella nuova directory `grit`, vedrai i file del progetto, pronti per essere modificati o usati. Se vuoi clonare il repository in una directory con un nome diverso da grit, puoi specificarlo come opzione successiva al comando da terminale:

	$ git clone git://github.com/schacon/grit.git mygrit

Questo comando fa la stessa cosa del precedente, ma la directory di destinazione è chiamata mygrit.

Git può usare differenti protocolli di trasferimento. L'esempio precedente usa il protocollo `git://`, ma puoi anche vedere `http(s)://` o `user@server:/path.git`, che usa il protocollo di trasferimento SSH. Il Capitolo 4 introdurrà tutte le opzioni disponibili che il server può impostare per farti accedere al repository Git ed i pro e i contro di ognuna.
