# Ottenere Git su di un Server

Per inizializzare un qualsiasi server Git, devi esportare un repository esistente in un nuovo repository di soli dati — cioè un repository che non contiene la directory di lavoro. Questo è generalmente molto semplice da fare.
Per clonare il tuo repository per creare un nuovo repository di soli dati, devi avviare il comando clone con l'opzione `--bare`. Convenzionalmente, un repository di soli dati in finisce in `.git`, ad esempio:

	$ git clone --bare my_project my_project.git
	Initialized empty Git repository in /opt/projects/my_project.git/

L'output di questo comando confonde un pochino. Dato che `clone` è un `git init` quindi un `git fetch`, vediamo parte dell'output dalla parte `git init`, il quale crea una directory vuota. L'effecttivo trasferimento dell'oggetto non fornisce output, ma avviene. Ora dovresti avere una copia della directory dei dati di Git nella directory `my_project.git`.

La stessa cosa la si può ottenere con

	$ cp -Rf my_project/.git my_project.git

Ci sono solo un paio di differenze minori nel file di configurazione; ma per il tuo scopo, è quasi la stessa cosa. Lui prende il repository Git da solo, senza la directory di lavoro e crea una directory specifica per i soli dati.

## Mettere il Repository Soli Dati su un Server

Ora che hai la copia dei soli dati del tuo repository, tutto quello che devi fare è metterli su un server e configurare il protocollo. Diciamo che hai impostato un server chiamato `git.example.com` su cui hai anche un accesso SSH e vuoi salvare tutti i tuoi repository Git nella directory `/opt/git`. Puoi impostare il tuo nuovo repository copiandoci sopra i dati del repository:

	$ scp -r my_project.git user@git.example.com:/opt/git

A questo punto, gli altri utenti che hanno un accesso SSH allo stesso server con i permessi di sola lettura nella directory `/opt/git` possono clonare il repository lanciando

	$ git clone user@git.example.com:/opt/git/my_project.git

Se gli utenti entrano in SSH su di un server ed hanno l'accesso in scrittura alla directory `/opt/git/my_project.git`, avranno automaticamente la possibilità di inviare dati. Git automaticamente aggiunge al repository i permessi di scrittura al gruppo se darai il comando `git init` con l'opzione `--shared`.

	$ ssh user@git.example.com
	$ cd /opt/git/my_project.git
	$ git init --bare --shared

Hai visto quanto è semplice creare un repository Git, creare una versione di soli dati e posizionarlo su un server dove tu e i tuoi collaboratori avete un accesso SSH. Ora siete pronti per collaborare sullo stesso progetto.

É importante notare che questo è letteralmente tutto ciò di cui hai bisogno per avviare un server Git dove vari utenti hanno accesso — semplicemente aggiungi un account SSH sul server e metti un repository di dati da qualche parte dove i tuoi utenti hanno un accesso in lettura e anche in scrittura. Sei pronto per procedere — non hai bisogno di niente altro.

Nelle prossime sezioni, vedrai come adattarsi ad un'installazione più sofisticata. Questa discussione includerà non dover creare account utente per ogni utente, l'aggiunta di un accesso in lettura pubblico ai repository, configurare delle interfaccie web, usare Gitosis e molto altro. Comunque, tieni in mente che per collaborare con altre persone su un progetto privato, tutto quello di cui hai bisogno è un server SSH e i dati del repository.

## Piccole Configurazioni

Se hai poche risorse o stai provando Git nella tua organizzazione e hai pochi sviluppatori, le cose possono essere semplici per te. Una delle cose più complicate del configurare un server Git è l'amministrazione degli utenti. Se vuoi alcuni repository in sola lettura per alcuni utenti e l'accesso in lettura e scrittura per altri, accessi e permessi possono essere un po' complicati da configurare.

### Accesso SSH

Se hai già un server dove tutti i tuoi sviluppatori hanno un accesso SSH, è generalmente facile impostare qui il tuo primo repository, perché la gran parte del lavoro è già stato fatto (come abbiamo visto nell'ultima sezione). Se vuoi un controllo più articolato sugli accessi e suoi permessi sul tuo repository, puoi ottenerli con i normali permessi del filesystem del sistema operativo del server che stai utilizzando.

Se vuoi mettere i tuoi repository su un server che non ha account per ogni persona del tuo team che tu vuoi abbia l'accesso in scrittura, allora devi impostare un accesso SSH per loro. Noiu supponiamo che se tu hai un server con cui fare questo, tu abbia già un server SSH installato, ed è con esso che stati accedendo al server.

Ci sono vari modi con cui puoi dare accesso a tutto il tuo team. Il primo è impostare degli account per ognuno, è semplice ma porta via molto tempo. Probabilmente non hai voglia di lanciare `adduser` ed impostare una password temporanea per ciascun utente.

Un secondo metodo è creare un singolo utente 'git' sulla macchina, chiedendo a ciascun utente che deve avere l'accesso in scrittura di inviarti la loro chiave pubblica SSH e dunque aggiungere questa chiave nel file `~/.ssh/authorized_keys` del tuo nuovo utente 'git'. A questo punto, tutti hanno la possibilità di accedere alla macchina tramite l'utente 'git'. Questo non tocca in alcun modo i commit dei dati — l'utente SSH che si connette non modifica i commit che sono già stati registrati.

Un altro modo è avere un'autenticazione al tuo server SSH via server LDAP o un altro sistema centralizzato di autenticazione che hai già configurato. Così ogni utente può avere un accesso shell sulla macchina, qualsiasi meccanismo di autenticazione SSH a cui puoi pensare dovrebbe funzionare.
