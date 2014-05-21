# Hosting Git

Se non vuoi svolgere tutto il lavoro di configurazione di un tuo server Git, hai varie opzioni per ospitare i tuoi progetti Git su un sito esterno e dedicato. Fare questo offre un numero di vantaggi: un sito di hosting è generalmente veloce da configurare ed è facile avviare un progetto su questo, e non sono necessari spese di mantenimento o controllo del server. Se imposti e avvi il tuo server interno, puoi comunque voler utilizzare un hosting pubblico per i progetti a codice aperto — è generalmente più facile per una comunità open source trovarti ed aiutarti.

Oggi, hai un'enorme quantità di opzioni di hosting tra cui scegliere, ognuna con differenti vantaggi e svantaggi. Per vedere una lista aggiornata, controlla la pagina GitHosting sul wiki principale di Git:

	https://git.wiki.kernel.org/index.php/GitHosting

Dato che non possiamo vederli tutti, e dato che lavoro principalmente su uno di questi, in questa sezione vedremo come impostare un account e creare un nuovo progetto su GitHub. Questo ti darà una idea di come funzionano.

GitHub è di gran lunga il più grande hosting Git di progetti open source ed è anche uno dei pochi che offre sia un hosting pubblico sia privato così puoi mantenere il tuo codice open source o il codice commerciale privato nello stesso posto. Infatti, noi usiamo GitHub per collaborare a questo libro.

## GitHub

GitHub è leggermente differente nello spazio dei nomi che usa per i progetti rispetto agli altri siti di hosting di codice. Invece di essere principalmente basato sul progetto, GitHub è utente centrico. Questo significa che quando metto il mio progetto `grit` su GitHub, non troverai `github.com/grit` ma invece lo trovi in `github.com/shacon/grit`. Non c'è una versione canonica di un progetto, ciò permette ad un progetto di essere mosso da un utente ad un altro senza soluzione di continuità se il primo autore abbandona il progetto.

GitHub è inoltre una organizzazione commerciale che addebita gli account che mantengono repository privati, ma chiunque può avere un account libero per ospitare qualsiasi progetto open source come preferisce. Vedremo velocemente come ottenere ciò.

## Configurare un Account Utente

La prima cosa di cui hai bisogno è configurare un account utente gratuito. Se visiti la pagina "Pricing and Signup" all'inidirizzo `http://github.com/plans` e fai click sul pulsante "Sign Up" per un account gratuito (vedi figura 4-2), sarai portato alla pagina di iscrizione.


![](http://git-scm.com/figures/18333fig0402-tn.png)

Figura 4-2. La pagina dei piani di GitHub.

Qui devi scegliere un nome utente che non è già stato scelto nel sistema ed inserire un indirizzo e-mail che verrà associato all'account e una password (vedi Figura 4-3).


![](http://git-scm.com/figures/18333fig0403-tn.png)
 
Figura 4-3. Il form di iscrizione di GitHub.

Se ne hai una, è buona cosa aggiungere la propria chiave pubblica SSH. Abbiamo già visto come generare una nuova chiave, nella sezione "Piccole Configurazioni". Prendi il contenuto della chiave pubblica della tua coppia di chiavi, ed incollala nel box SSH Public Key. Facendo click sul link "explain ssh keys" otterrai le istruzioni dettagliate su come fare questa cosa sui maggiori sistemi operativi.
Cliccare il pulsante "I agree, sign me up" ti porta al tuo nuovo pannello utente (vedi Figura 4-4).


![](http://git-scm.com/figures/18333fig0404-tn.png)
 
Figura 4-4. Pannello utente GitHub.

Poi puoi creare un nuovo repository.

## Creare un Nuovo Repository

Inizia cliccando il link "create a new one" vicino a Your Repositories nel pannello utente. Sarai portato al modulo Create a New Repository (vedi Figura 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)
 
Figura 4-5. Creare un nuovo repository GitHub.

Tutto quello che devi fare è in realtà fornire un nome per il progetto, ma puoi aggiungere anche una descrizione. Quando questo è fatto, clicca sul pulsante "Create Repository". Ora hai un nuovo repository su GitHub (vedi Figura 4-6).


![](http://git-scm.com/figures/18333fig0406-tn.png)
 
Figura 4-6. Informazioni del progetto su GitHub.

Dato che non hai ancora nessun codice, GitHub ti mostrerà le istruzioni su come creare un nuovo progetto, inviare un progetto Git esistente, od importare un progetto da un repository Subversion pubblico (vedi Figura 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)
 
Figura 4-7. Istruzioni per un nuovo repository.

Queste istruzioni sono simili a quello che già avevamo dato precedentemente. Per inizializzare un progetto che non è già un progetto Git, devi usare

	$ git init
	$ git add .
	$ git commit -m 'initial commit'

Quando hai un repository Git in locale, aggiungi GitHub come remoto ed invia il tuo ramo master:

	$ git remote add origin git@github.com:testinguser/iphone_project.git
	$ git push origin master

Ora il tuo progetto è ospitato su GitHub, e puoi fornire l'URL a chiunque tu voglia per condividere il progetto. In questo caso, è `http://github.com/testinguser/iphone_project` . Puoi inoltre vedere dalla parte superiore di ogni pagina del progetto che hai due URL Git (vedi Figura 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)
 
Figura 4-8. Parte superiore del progetto con un URL pubblico ed uno URL privato.

Il Public Clone URL è un URL Git di sola lettura, pubblico, con cui chiunque può clonare il progetto. Sentiti libero di dare questo URL ed inserirlo sul tuo sito web o dove preferisci.

Il Your Clone URL è un URL basato su SSH di scrittura/lettura che puoi leggere o scrivere solamente se ti sei connesso con la tua chiave SSH privata associata alla chiave pubblica che hai caricato per il tuo utente. Quando altri utenti visitano la pagina del tuo progetto, vedranno solamente l'URL pubblico.

## Importare da Subversion

Se hai un progetto pubblico esistente su Subversion che vuoi importare in Git, GitHub può farlo per te. Alla fine della pagina delle istruzioni c'è un link per l'importazione di un Subversion. Se fai click su di esso, vedrai un modulo con le informazioni per il processo di importazione ed un campo dove incollare l'URL del tuo progetto Subversion pubblico (vedi Figura 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)
 
Figura 4-9. Interfaccia importazione Subversion.

Se il tuo progetto è molto grande, non standard, o privato, questo processo probabilmente non funzionerà. Nel Capitolo 7, vedrai come fare importazioni più complicate manualmente.

## Aggiungere Collaboratori

Aggiungiamo il resto della squadre. Se John, Joise e Jessica hanno sottoscritto un account su GitHub e vuoi dare loro un accesso per il push al tuo progetto, puoi aggiungerli al tuo progetto come collaboratori. Facendo questo gli dai il permesso di inviare dati tramite le loro chiavi pubbliche.

Clicca sul pulsante "edit" nella parte superiore della pagina del progetto o sulla linguetta Admin all'inizio del progetto per vedere la pagina di Admin del tuo progetto GitHub (vedi Figura 4-10).


![](http://git-scm.com/figures/18333fig0410-tn.png)
 
Figura 4-10. Pagina amministrazione GitHub.

Per dare ad un altro utente l'accesso in scrittura al tuo progetto, clicca sul link “Add another collaborator”. Un nuovo riquadro di testo apparirà, in cui puoi inserire il nome utente. Quando scrivi, un pop up di aiuto, ti mostrerà i nomi utenti possibili. Quando hai trovato l'utente corretto, fai click sul bottone Add per aggiungerlo come collaboratore del progetto (vedi Figura 4-11).


![](http://git-scm.com/figures/18333fig0411-tn.png)
 
Figura 4-11. Aggiungere un collaboratore al tuo progetto.

Quando hai finito di aggiungere collaboratori, dovresti vedere una lista di questi nel riquadro dei collaboratori del repository (vedi Figura 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)
 
Figura 4-12. Una lista di collaboratori al tuo progetto.

Se hai bisogno di revocare l'accesso a qualcuno, puoi cliccare sul link "revoke", ed il loro accesso all'invio è rimosso. Per progetti futuri, puoi anche copiare il gruppo dei collaboratori copiando i permessi di un progetto esistente.

## Il tuo Progetto

Dopo che hai inviato il tuo progetto o hai fatto l'importazione da Subversion, hai la pagina del progetto principale che assomiglia alla Figura 4-13.


![](http://git-scm.com/figures/18333fig0413-tn.png)
 
Figura 4-13. La pagina principale del progetto su GitHub.

Quando le persone visiteranno il tuo progetto, vedranno questa pagina. Essa contiene linguette per differenti aspetti del progetto. La linguetta Commits mostra una lista dei commit in ordine cronologico inversi, simile all'output del comando `git log`. La linguetta Network mostra tutte le persone che hanno eseguito il fork del progetto e hanno contribuito ad esso. La linguetta Downloads permette di caricare il binario del progetto e di avere il link alla versione tarball o zip di ogni punto del progetto con una etichetta. La linguetta Wiki fornisce un wiki dove puoi scrivere la documentazione o altre informazioni sul progetto. La linguetta Graphs mostra alcuni contributi e statistiche sul progetto. La linguetta principale Source su cui approdi mostra l'elenco di directory principale del tuo progetto e automaticamente visualizza il file di README mostrandolo di sotto, se ne hai uno. Questa linguetta mostra anche le informazioni dell'ultimo commit.

## Biforcare i Progetti

Se vuoi contribuire ad un progetto esistente a cui non hai un accesso per l'invio, GitHub incoraggia la biforcazione del progetto. Quando vai sulla pagina di un progetto che credi interessante e vuoi lavorarci un po' su, puoi cliccare sul pulsante "fork" nella parte superiore del progetto per avere una copia su GitHub nel tuo utente a cui puoi inviare le modifiche.

In questo modo, i progetti non devono preoccuparsi di aggiungere utenti come collaboratori per dare loro accesso per inviare. Le persone possono biforcare il progetto ed inviare a questo, ed il progetto principale può scaricare questi cambiamenti aggiungendoli come sorgenti remote e fondendo il loro lavoro.

Per biforcare un progetto, visita la pagina del progetto (in questo caso, mojombo/chronic) e clicca sul pulsante "fork" in alto (vedi Figura 4-14).


![](http://git-scm.com/figures/18333fig0414-tn.png)
 
Figura 4-14. Ottenere una copia scrivibile di un qualsiasi repository facendo click sul bottone "fork".

Dopo qualche secondo, otterrai la pagina del tuo nuovo repository, che indica che questo progetto è la biforcazione di un altro (vedi Figura 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)
 
Figura 4-15. La tua biforcazione di un progetto.

## Riassunto GitHub

Questo è quanto su GitHub, ma è importante notare quanto è veloce fare tutto questo. Puoi creare un account, aggiungere un nuovo progetto, e inviare dati a questo in pochi minuti. Se il tuo progetto è open source, puoi avere un'ampia comunità di sviluppatori che possono vedere nel tuo progetto e biforcarlo ed aiutarti. Ed infine, questo è un modo per iniziare ad usare Git ed imparare ad usarlo velocemente.
