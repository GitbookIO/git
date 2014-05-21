# Contribuire a un Progetto

Conosci i diversi workflow e dovresti aver chiaro i fondamentali di Git. In questa sezione imparerai alcuni metodi comuni per contribuire a un progetto.

La difficoltà maggiore nel descrivere questo processo è che ci sono molte variazioni su come può venir fatto. Poiché Git è molto flessibile la gente può lavorare insieme in molti modi (ed effettivamente lo fa), ed è difficile descrivere come dovresti contribuire ad un progetto: ogni progetto è diverso. Alcune delle variabili coinvolte sono la quantità di contributori attivi, il workflow adottato, il tuo tipo di accesso, ed eventualmente il metodo di contribuzione esterno.

La prima variabile è il numero di contributori attivi. Quando utenti  contribuiscono attivamente al progetto con del codice e quanto spesso? In molte casi avrai due o tre sviluppatori con poche commit quotidiane, o anche meno per dei progetti semi dormienti. Per azienda o progetti molto grandi, il numero di sviluppatori potrebbe essere nell'ordine delle migliaia, con dozzine o addirittura di centinaia di patches rilasciate ogni giorno. Questa è importante perché con più sviluppatori vai incontro a molti problemi nell'applicare le modifiche in maniera pulita o che queste possano essere facilmente integrate. I cambiamenti che fai potrebbero essere stati resi obsoleti o corrotti da altri che sono stati integrati mentre lavoravi o mentre aspettavi che il tuo lavoro venisse approvato o applicato. Come puoi mantenere il tuo codice aggiornato e le tue modifiche valide?

La variabile successiva è il workflow usato nel progetto. È centralizzato, con ogni sviluppatore con lo stesso tipo di accesso in scrittura sul repository principale? Il progetto ha un manager d'integrazione che controlla tutte le modifiche? Tutte le modifiche sono riviste da più persone ed approvate? Sei coinvolto in questo processo? È un sistema con dei tenenti, e devi inviare a loro il tuo lavoro?

Il problema successivo riguarda i tuoi permessi per effettuare commit. Il workflow richiesto per poter contribuire al progetto è molto diverso a seconda del fatto che tua abbia accesso in scrittura o solo lettura. Se non hai accesso in scrittura, qual'è il modo preferito dal progetto per accettare il lavoro dei contributori? Esistono regole a riguardo? Quanto contribuisci? Quanto spesso?

Tutte queste domande possono influire sul modo in cui contribuisci al progetto e quale tipo di workflow sia quello preferito o disponibile. Illustrerò gli aspetti di ciascuno di questi in una serie di casi d'uso, dal più semplice al più complesso: dovresti essere capace di definire il workflow specifico per il tuo caso basandoti su questi esempi.

## Linee guida per le commit

Prima di vedere i casi specifici faccio una breve nota riguardo i messaggi delle commit. Avere una linea guida per le commit e aderirvi rende il lavoro con Git e la collaborazione con altri molto più semplice. Il progetto di Git fornisce un documento che da molti suggerimenti circa le commit per da cui creare patch: puoi trovarlo nel codice sorgente di Git nel file `Documentation/SubmittingPatches`.

Innanzitutto non è il caso di inviare errori con degli spazi. Git fornisce un modo semplice per verificarli: esegui, prima di un commit, `git diff --check`, che identifica possibili errori riguardanti gli spazi e li elenca per te. Qui c'è un esempio in cui ho sostituiro il colore rosso del terminale con delle `X`:

	$ git diff --check
	lib/simplegit.rb:5: trailing whitespace.
	+    @git_dir = File.expand_path(git_dir)XX
	lib/simplegit.rb:7: trailing whitespace.
	+ XXXXXXXXXXX
	lib/simplegit.rb:26: trailing whitespace.
	+    def command(git_cmd)XXXX

Se esegui il commando prima della commit, puoi vedere se stai per committare degli spazi bianchi che potrebbero infastidire altri sviluppatori.

Cerca quindi di aver per ciascuna commit un insieme logico di modifiche. Se puoi, cerca di rendere i cambiamenti "digeribili": non lavorare per un intero fine settimana su cinque diversi problemi per fare poi una commit massiva il lunedì. Anche se non fai commit nel weekend, il lunedì usa l'area di staging per suddividere il tuo lavoro in almeno un commit per problema con un messaggio utile per ciascuna. Se modifiche diverse coinvolgono lo stesso file, usa `git add --patch` per aggiungere parti del file all'area di staging (trattato in dettaglio nel capitolo 6). Il risultato finale sarà lo stesso che tu faccia una o cinque commit quando queste vengano integrate in un punto, per cui cerca di rendere le cose più semplici ai tuoi colleghi sviluppatori quando devono controllare le tue modifiche. Questo approccio inoltre rende più semplice includere o escludere alcuni dei cambiamenti, nel caso ti serva successivamente. Il capitolo 6 descrive una serie di trucchi di Git utili per riscrivere la storia e aggiungere interattivamente file all'area di staging: usa questi strumenti per mantenere la cronologia pulita e comprensibile.

L'ultima cosa da tenere a mente è il messaggio di commit. Prendere l'abitudine di creare messaggi di commit di qualità rende l'uso e la collaborazione tramite Git molto più semplice. Come regola generale, i tuoi messaggi dovrebbero iniziare con una sola linea di massimo 50 caratteri che descriva sinteticamente l'insieme delle modifiche seguito da una linea bianca e quindi una spiegazione dettagliata. Il progetto di Git prevede che una spiegazione molto dettagliata includa il motivo della modifica e confrontare l'implementazione committata con la precedente: questa è una buona linea guida da seguire. È una buona idea anche usare l'imperativo presente in questi messaggi. In altre parole, usa dei comandi. Al posto di "Ho aggiunto dei test per" o "Aggiungendo test per", usa "Aggiungi dei test per".
Questo modello è stato originariamente scritto da Tim Pope su tpope.net:

  Breve (50 caratteri o meno) riassunto delle modifiche

  Spiegazione più dettagliata, se necessario. Manda a capo ogni 72 caratteri 
  circa. In alcuni contesti, la prima linea è trattata come l'oggetto di
  un'email, ed il resto come il contenuto. La linea vuota che separa l'oggetto
  dal testo è importante (a meno che tu non ometta il testo del tutto):
  strumenti come rebase possono confondersi se non dovesse esserci.

  Ulteriori paragrafi vanno dopo altre linee vuote.

   - Le liste puntate sono concesse

   - Di solito viene usato un trattino o un asterisco come separatore,
     preceduto da uno spazio singolo, con delle linee vuote tra i punti,
     ma le convenzioni possono essere diverse

Se tutti i tuoi messaggi di commit fossero così, per te e gli altri sviluppatori con cui lavori le cose saranno molto più semplici per te e per gli sviluppatore con cui lavori. Il progetto di Git ha dei messaggi di commit ben formattati: ti incoraggio a eseguire `git log --no-merges` per vedere qual è l'aspetto di una cronologia ben leggibile.

Nei esempi che seguono e nella maggior parte di questo libro, per brevità, non formatterò i messaggi accuratamente come descritto: userò invece l'opzione `-m` di `git commit`. Fa' come dico, non come faccio.

## Piccoli gruppi privati

La configurazione più semplice che è più facile che incontrerai è quella del progetto privato con uno o due sviluppatori. Con privato intendo codice a sorgente chiuso: non accessibile al resto del mondo. Tu e gli altri sviluppatori avete accesso in scrittura al repository.

Con questa configurazione, puoi utilizzare un workflow simile a quello che magari stai già usando con Subversion o un altro sistema centralizzato. Hai comunque i vantaggi (ad esempio) di poter eseguire commit da offline e la creazione di rami (ed unione degli stessi) molto più semplici, ma il workflow può restare simile; la differenza principale è che, nel momento del commit, l'unione avviene nel tuo repository piuttosto che in quello sul server.
Vediamo come potrebbe essere la situazione quando due sviluppatori iniziano a lavorare insieme con un repository condiviso. Il primo sviluppatore, John, clona in repository, fa dei cambiamenti ed esegue il commit localmente. (In questi esempi sostituirò, per brevità, il messaggio del protocollo con `...`)

	# Computer di John
	$ git clone john@githost:simplegit.git
	Initialized empty Git repository in /home/john/simplegit/.git/
	...
	$ cd simplegit/
	$ vim lib/simplegit.rb
	$ git commit -am 'rimosso valore di default non valido'
	[master 738ee87] rimosso valore di default non valido
	 1 files changed, 1 insertions(+), 1 deletions(-)

Il secondo sviluppatore, Jessica, fa la stessa cosa - clona il repository e committa le modifiche:

	# Computer di Jessica
	$ git clone jessica@githost:simplegit.git
	Initialized empty Git repository in /home/jessica/simplegit/.git/
	...
	$ cd simplegit/
	$ vim TODO
	$ git commit -am 'aggiunto il processo di reset'
	[master fbff5bc] aggiunto il processo di reset
	 1 files changed, 1 insertions(+), 0 deletions(-)

Ora, Jessica invia il suo lavoro al server con una push:

	# Computer di Jessica
	$ git push origin master
	...
	To jessica@githost:simplegit.git
	   1edee6b..fbff5bc  master -> master

Anche John cerca di eseguire una push:

	# Computer di John
	$ git push origin master
	To john@githost:simplegit.git
	 ! [rejected]        master -> master (non-fast forward)
	error: failed to push some refs to 'john@githost:simplegit.git'

A John non è permesso fare un push perché nel frattempo lo ha già fatto Jessica. Questo è particolarmente importante se sei abituato a Subversion, perché vedrai che i due sviluppatori non hanno modificato lo stesso file. Sebbene Subversion unisca automaticamente sul server queste commit se i file modificati sono diversi, in Git sei tu che devi farlo localmente. John deve quindi scaricare le modifiche di Jessica e unirle alle sue prima di poter fare una push:

	$ git fetch origin
	...
	From john@githost:simplegit
	 + 049d078...fbff5bc master     -> origin/master

A questo punto, il repository locale di John somiglia a quello di figura 5-4.


![](http://git-scm.com/figures/18333fig0504-tn.png)

Figura 5-4. Il repository iniziale di John.

John sa quali sono le modifiche di Jessica, ma deve unirle alle sue prima poter fare una push:

	$ git merge origin/master
	Merge made by recursive.
	 TODO |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

L'unione fila liscia e ora la cronologia delle commit di John sarà come quella di Figura 5-5.


![](http://git-scm.com/figures/18333fig0505-tn.png)

Figura 5-5. Il repository di John dopo aver unito origin/master.

John ora può testare il suo codice per essere sicuro che continui a funzionare correttamente e può quindi eseguire la push del tutto sul server:

	$ git push origin master
	...
	To john@githost:simplegit.git
	   fbff5bc..72bbc59  master -> master

La cronologia dei commit di John somiglierà quindi a quella di figura 5-6.


![](http://git-scm.com/figures/18333fig0506-tn.png)

Figura 5-6. La cronologia di John dopo avere eseguito la push verso il server.

Jessica nel frattempo sta lavorando a un altro ramo. Ha creato un branch chiamato `problema54` e ha eseguito tre commit su quel branch. Poiché non ha ancora recuperato le modifiche di John la sua cronologia è quella della Figura 5-7.


![](http://git-scm.com/figures/18333fig0507-tn.png)

Figura 5-7. La cronologia iniziale di Jessica.

Jessica vuole sincronizzarsi con John, quindi esegue:

	# Computer di Jessica
	$ git fetch origin
	...
	From jessica@githost:simplegit
	   fbff5bc..72bbc59  master     -> origin/master

Con cui recupera il lavoro che nel frattempo John ha eseguito. La cronologia di Jessica ora è quella di Figura 5-8.


![](http://git-scm.com/figures/18333fig0508-tn.png)

Figura 5-8. La cronologia di Jessica dopo aver recuperato i cambiamenti di John.

Jessica pensa che il suo ramo sia pronto, però vuole sapere con cosa deve unire il suo lavoro prima di eseguire la push. Esegue quindi `git log` per scoprirlo:

	$ git log --no-merges origin/master ^problema54
	commit 738ee872852dfaa9d6634e0dea7a324040193016
	Author: John Smith <jsmith@example.com>
	Date:   Fri May 29 16:01:27 2009 -0700

	    rimosso valore di default non valido

Ora, Jessica può unire il lavoro del suo branch nel suo master, quindi le modifiche di John (`origin/master`) nel suo branch `master`, e ritrasmettere il tutto al server con una push. Per prima cosa torna al suo branch master per integrare il lavoro svolto nell'altro branch:

	$ git checkout master
	Switched to branch "master"
	Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

Può decidere di unire prima `origin/master` o `problema54`: entrambi sono flussi principali, per cui non conta l'ordine. Il risultato finale sarà lo stesso a prescindere dall'ordine scelto, ma la cronologia sarà leggermente differente. Lei sceglie di fare il merge prima di `problema54`:

	$ git merge problema54
	Updating fbff5bc..4af4298
	Fast forward
	 README           |    1 +
	 lib/simplegit.rb |    6 +++++-
	 2 files changed, 6 insertions(+), 1 deletions(-)

Non ci sono stati problemi: come puoi vedere tutto è stato molto semplice. Quindi Jessica unisce il lavoro di John (`origin/master`):

	$ git merge origin/master
	Auto-merging lib/simplegit.rb
	Merge made by recursive.
	 lib/simplegit.rb |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

Tutto viene unito correttamente, e la cronologia di Jessica è come quella di Figura 5-9.


![](http://git-scm.com/figures/18333fig0509-tn.png)

Figura 5-9. La cronologia di Jessica dopo aver unito i cambiamenti di John.

Ora `origin/master` è raggiungibile dal ramo `master` di Jessica, cosicché lei sia capace di eseguire delle push con successo (supponendo che John non abbia fatto altre push nel frattempo):

	$ git push origin master
	...
	To jessica@githost:simplegit.git
	   72bbc59..8059c15  master -> master

Ogni sviluppatore ha eseguito alcune commit ed unito con successo il proprio lavoro con quello degli altri; vedi Figura 5-10.


![](http://git-scm.com/figures/18333fig0510-tn.png)

Figura 5-10. La cronologia di Jessica dopo aver eseguito il push dei cambiamenti verso il server.

Questo è uno dei workflow più semplici. Lavori per un po', generalmente in un branch, ed unisci il tutto al branch master quando è pronto per essere integrato. Quando vuoi condividere questo lavoro lo unisci al tuo branch master e poi scarichi ed unisci `origin/master`, se è cambiato, e infine esegui la push verso il branch `master` nel server. La sequenza è simile a quella in Figura 5-11.


![](http://git-scm.com/figures/18333fig0511-tn.png)

Figura 5-11. La sequenza generale di eventi per un workflow semplice con Git a più sviluppatori.

## Team privato con manager

In questo scenario, scoprirai i ruoli di contributore in un gruppo privato più grande. Imparerai come lavorare in un ambiente dove gruppi piccoli collaborano a delle funzionalità e poi queste contribuzioni sono integrate da un altra persona.

Supponiamo che John e Jessica stiano lavorando insieme a una funzionalità, mentre Jessica e Josie si stiano concentrando a una seconda. In questo caso l'azienda sta usando un workflow con manager d'integrazione dove il lavoro di ogni gruppo è integrato solo da alcuni ingegneri, ed il branch `master` del repository principale può essere aggiornato solo da questi. In questo scenario, tutto il lavoro è eseguito sui rami suddivisi per team, e unito successivamente dagli integratori.

Seguiamo il workflow di Jessica mentre lavora sulle due funzionalità, collaborando parallelamente con due diversi sviluppatori in questo ambiente. Assumendo che lei abbia già clonato il suo repository, decide di lavorare prima alla `funzionalitaA`. Crea un nuovo branch per la funzionalità e ci lavora.

	# Computer di Jessica
	$ git checkout -b featureA
	Switched to a new branch "funzionalitaA"
	$ vim lib/simplegit.rb
	$ git commit -am 'aggiunto il limite alla funzione di log'
	[featureA 3300904] aggiunto il limite alla funzione di log
	 1 files changed, 1 insertions(+), 1 deletions(-)

A questo punto lei deve condividere il suo lavoro con John, così fa la push sul server del branch `funzionalitaA`. Poiché Jessica non ha permessi per fare la push sul ramo `master` (solo gli integratori ce l'hanno) deve perciò eseguire la push su un altro branch per poter collaborare con John:

	$ git push origin funzionalitaA
	...
	To jessica@githost:simplegit.git
	 * [new branch]      featureA -> featureA

Jessica manda una e-mail a John dicendogli che fatto la push del suo lavoro su un branch chiamato `funzioanlitaA` chiedendogli se lui può dargli un'occhiata. Mentre aspetta una risposta da John, Jessica decide di iniziare a lavorare su `funzionalitaB` con Josie. Per iniziare, crea un nuovo branch basandosi sul branch `master` del server:

  # Computer di Jessica
	$ git fetch origin
	$ git checkout -b featureB origin/master
	Switched to a new branch "featureB"

Quindi Jessica esegue un paio di commit sul branch `funzionalitaB`:

	$ vim lib/simplegit.rb
	$ git commit -am 'resa la funzione ls-tree ricorsiva'
	[featureB e5b0fdc] resa la funziona ls-tree ricorsiva
	 1 files changed, 1 insertions(+), 1 deletions(-)
	$ vim lib/simplegit.rb
	$ git commit -am 'aggiunto ls-files'
	[featureB 8512791] aggiunto ls-files
	 1 files changed, 5 insertions(+), 0 deletions(-)

Il repository di Jessica è come quello di Figura 5-12.


![](http://git-scm.com/figures/18333fig0512-tn.png)

Figura 5.12. La cronologia iniziale delle commit di Jessica

Quando è pronta a eseguire una push del proprio lavoro riceve una e-mail da Josie che le dice che una parte del lavoro era già stato caricato sul server nel branch chiamato `funzionalitaBee`. Jessica deve unire prima le modifiche al server alle sue per poter fare la push verso il server. Può recuperare il lavoro di Josie usando `git fetch`:

	$ git fetch origin
	...
	From jessica@githost:simplegit
	 * [new branch]      featureBee -> origin/featureBee

Jessica ora può unire il suo lavoro a quello di Josie con `git merge`:

	$ git merge origin/featureBee
	Auto-merging lib/simplegit.rb
	Merge made by recursive.
	 lib/simplegit.rb |    4 ++++
	 1 files changed, 4 insertions(+), 0 deletions(-)

C'è un piccolo problema: deve fare la push del suo branch `funzionalitaB` sul branch `funzionalitaBee` del server. Può farlo specificando il branch locale seguito da due punti (:) seguito a sua volta dal nome del branch remoto di destinazione al comando `git push`:

	$ git push origin funzionalitaB:funzionalitaBee
	...
	To jessica@githost:simplegit.git
	   fba9af8..cd685d1  featureB -> featureBee

Questo è detto _refSpec_. Vedi il capitolo 9 per una discussione più dettagliata sui refspec di Git e cosa ci puoi fare.

John manda una mail a Jessica dicendole che ha fatto la push di alcune modifiche sul branch `funzionalitaA` e le chiede di controllarle. Lei esegue `git fetch` per scaricarle:

	$ git fetch origin
	...
	From jessica@githost:simplegit
	   3300904..aad881d  featureA   -> origin/featureA

E può vederle con `git log`:

	$ git log origin/funzionalitaA ^funzionalitaA
	commit aad881d154acdaeb2b6b18ea0e827ed8a6d671e6
	Author: John Smith <jsmith@example.com>
	Date:   Fri May 29 19:57:33 2009 -0700

	    cambiato l'output del log da 25 a 30

Infine unisce il lavoro di John al suo nel branch `funzionalitaA`:

	$ git checkout funzionalitaA
	Switched to branch "funzionalitaA"
	$ git merge origin/funzionalitaA
	Updating 3300904..aad881d
	Fast forward
	 lib/simplegit.rb |   10 +++++++++-
	1 files changed, 9 insertions(+), 1 deletions(-)

Jessica vuole aggiustare qualcosa e fa un'altro commit ed una push verso il server:

	$ git commit -am 'leggero aggiustamento'
	[featureA ed774b3] leggero aggiustamento
	 1 files changed, 1 insertions(+), 1 deletions(-)
	$ git push origin featureA
	...
	To jessica@githost:simplegit.git
	   3300904..ed774b3  featureA -> featureA

La cronologia delle commit di Jessica ora sarà come quella della Figura 5-13.


![](http://git-scm.com/figures/18333fig0513-tn.png)

Figura 5-13. La cronologia di Jessica dopo aver eseguito la commit sul branch.

Jessica, Josie e John informano gli integratori che i rami `funzionalitaA` e `funzionalitaB` che sono sul server sono pronti per l'integrazione nel `master`. Dopo l'integrazione di questi branch nel `master`, una fetch scaricherà tutte queste nuove commit, rendendo la cronologia delle commit come quella della Figura 5.14.


![](http://git-scm.com/figures/18333fig0514-tn.png)

Figura 5.14. La cronologia di Jessica dopo aver unito entrambi i rami.

Molti gruppi migrano a Git per la sua capacità di avere gruppi che lavorino in parallelo, unendo le differenti righe di lavoro alla fine del processo. La possibilità che piccoli sottogruppi del team possano collaborare con branch remoti senza dover necessariamente coinvolgere o ostacolare l'intero team è un grande beneficio di Git. La sequenza del workflow che hai appena visto è rappresentata nella Figura 5-15.


![](http://git-scm.com/figures/18333fig0515-tn.png)

Figura 5-15. Sequenza base di questo workflow con team separati.

## Piccolo progetto pubblico

Contribuire ad un progetto pubblico è leggermente differente. Poiché non hai il permesso di aggiornare direttamente i rami del progetto, devi far avere il tuo lavoro ai mantenitori in qualche altro modo. Questo primo esempio descrive come contribuire con i fork su host Git che lo supportano in maniera semplice. I siti di repo.or.cz e GitHub lo supportano, e molti mantenitori di progetti si aspettano questo tipo di contribuzione. La sezione successiva tratta i progetti che preferiscono ricevere le patch per e-mail

Per iniziare probabilemnte dovrai clonare il repository principale, creare un branch per le modifiche che programmi di fare, quindi lavorarci. La sequenza è grosso modo questa:

	$ git clone (url)
	$ cd project
	$ git checkout -b funzionalitaA
	$ (lavoro)
	$ git commit
	$ (lavoro)
	$ git commit

Potresti voler usare `rebase -i` per ridurre il tuo lavoro a una singola commit, o riorganizzare il lavoro delle commit per facilitare il lavoro di revisione dei mantenitori - vedi il Capitolo 6 per altre informazioni sul rebase interattivo.

Quando il lavoro sul tuo branch è completato e sei pronto per condividerlo con i mantenitori, vai alla pagina principale del progetto e clicca sul pulsante "Fork", creando la tua copia modificabile del progetto. Dovrai quindi aggiungere l'URL di questo nuovo repository come un secondo remoto, chiamato in questo caso `miofork`:

	$ git remote add miofork (url)

E dovrai eseguire una push del tuo lavoro verso il nuovo repository. È più semplice fare la push del branch a cui stai lavorando piuttosto che unirlo al tuo master e fare la push di quest'ultimo. La ragione è che se il tuo lavoro non verrà accettato, oppure lo sarà solo in parte, non dovrai ripristinare il tuo master. Se i mantenitori uniscono, fanno un rebase, o prendono pezzi dal tuo lavoro col cherry-pick, otterrai il nuovo master alla prossima pull dal loro repository:

	$ git push myfork funzionalitaA

Quando avrai eseguito la push del tuo lavoro sul tuo fork, devi avvisare i mantenitori. Questo passaggio viene spesso definito "richiesta di pull" (pull request), e puoi farlo tramite lo stesso sito - GitHub ha un pulsante "pull request" che automaticamente notifica i mantenitori - o eseguire il comando `git request-pull` e inviare manualmente via email l'output ai mantenitori.

Il comando `request-pull` riceve come parametri il branch di base sul quale vuoi far applicare le modifiche e l'URL del repository Git da cui vuoi che le prendano, e produce il sommario di tutte queste modifiche in output. Se, per esempio, Jessica volesse inviare a John una richiesta di pull, e avesse eseguito due commit sul branch di cui ha appena effettuato il push, può eseguire questo:

	$ git request-pull origin/master miofork
	The following changes since commit 1edee6b1d61823a2de3b09c160d7080b8d1b3a40:
	  John Smith (1):
	        aggiunta una nuova funzione

	are available in the git repository at:

	  git://githost/simplegit.git funzionalitaA

	Jessica Smith (2):
	      aggiunto limite alla funzione di log
	      cambiato l'output del log da 30 a 25

	 lib/simplegit.rb |   10 +++++++++-
	 1 files changed, 9 insertions(+), 1 deletions(-)

L'output può essere inviato ai mantenitori: riporta da dove è stato creato il nuovo branch, un riassunto delle commit e da dove si possono scaricare.

In un progetto dove non sei il mantenitore normalmente è comodo avere un branch come `master` sempre collegato a `origin/master` e lavorare su altri branch che puoi eliminare nel caso non venissero accettati. Suddividere il lavoro in branch per argomento ti rende più semplice ribasare il tuo lavoro se il repository principale è stato modificato e le tue commit non possono venire applicate in maniera pulita. Se per esempio vuoi aggiungere un'altra caratteristica al progetto, invece di continuare a lavorare sul branch di cui hai appena fatto la push, creane un altro partendo dal `master` del repository:

	$ git checkout -b funzionalitaB origin/master
	$ (lavoro)
	$ git commit
	$ git push miofork funzionalitaB
	$ (email al mantenitore)
	$ git fetch origin

Ora ognuno dei tuoi lavori è separato come in una coda di modifiche che puoi riscrivere, ribasare e modificare senza che gli argomenti interferiscano o dipendano dagli altri, come in Figura 5-16.


![](http://git-scm.com/figures/18333fig0516-tn.png)

Figura 5-16. Conologia iniziale col lavoro su funzionalitaB.

Supponiamo che il mantenitore del progetto ha inserito una manciata di altre modifiche e provato il tuo primo branch ma non riesce più ad applicare tali modifiche in maniera pulita. In questo caso puoi provare a ribasare il nuovo `origin/master` su quel branch, risolvere i conflitti per poi inviare di nuovo le tue modifiche:

	$ git checkout funzionalitaA
	$ git rebase origin/master
	$ git push –f miofork featureA

Questo riscrive la tua cronologia per essere come quella di Figura 5-17.


![](http://git-scm.com/figures/18333fig0517-tn.png)

Fgiura 5-17. La cronologia ddopo il lavoro su funzionalitaA.

Poiché hai eseguito un rebase del branch, per poter sostituire il branch `funzionalitaA` sul server con una commit che non discenda dallo stesso, devi usare l'opzione `-f` perché la push funzioni. Un'alternativa sarebbe fare una push di questo nuovo lavoro su un branch diverso (chiamato per esempio `funzionalitaAv2`).

Diamo un'occhiata a un altro scenario possibile: il mantenitore ha visto tuo lavoro nel secondo branch e gli piace il concetto ma vorrebbe che tu cambiassi un dettaglio dell'implementazione. Potresti cogliere l'occasione per ribasarti sul `master` corrente. Crea un nuovo branch basato sull'`origin/master` attuale, sposta lì le modifiche di `funzionalitaB`, risolvi gli eventuali conflitti, fai la modifica all'implementazione ed esegui la push del tutto su un nuovo branch:

	$ git checkout -b funzionalitaBv2 origin/master
	$ git merge --no-commit --squash funzionalitaB
	$ (cambia implementazione)
	$ git commit
	$ git push miofork funzionalitaBv2

L'opzione `--squash` prende tutto il lavoro dal branch da unire e lo aggiunge come una singola commit nel branch dove sei. L'opzione `--no-commit` dice a Git di non fare la commit automaticamente. Questo ti permette di aggiungere le modifiche di un altro branch e fare ulteriori modifiche prima di effettuare la nuovo commit.

Ora puoi avvisare i mantenitori che hai effettuato le modifiche richieste e che possono trovarle nel branch `funzionalitaBv2` (vedi Figura 5-18).


![](http://git-scm.com/figures/18333fig0518-tn.png)

Figura 5-18. La cronologia dopo il lavoro su funzionalitaBv2.

## Grande Progetto Pubblico

Molti grandi progetti hanno definito delle procedure per l'invio delle patch: dovrai leggere le specifiche di ciascun progetto, perchè saranno diverse. Tuttavia molti grandi progetti pubblici accettano patch tramite la mailing list degli sviluppatori, quindi tratterò ora questo caso.

Il flusso di lavoro è simile al caso precedente: crei un branch per ognuna delle modifiche sulle quali intendi lavorare. La differenza sta nel modo in cui invii tali modifiche al progetto. Invece di fare un tuo fork del progetto e di inviare le tue modifiche con una push, crei una versione e-mail di ogni commit e invii il tutto per email alla mailing list degli sviluppatori:

	$ git checkout -b topicA
	$ (work)
	$ git commit
	$ (work)
	$ git commit

Ora hai due commit che vuoi inviare alla mailing list. Usi `git format-patch` per generare un file formato mbox che possa inviare via e-mail alla lista: questo trasforma ogni commit in un messaggio email il cui oggetto è la prima linea del messaggio della commit e il contenuto è dato dal resto del messaggio della commit più la patch delle modifiche. La cosa bella di tutto ciò è che, applicando le commit da un'email, vengono mantenute le informazioni delle commit, come vedrai meglio nella prossima sezione:

	$ git format-patch -M origin/master
	0001-add-limit-to-log-function.patch
	0002-changed-log-output-to-30-from-25.patch

Il comando `format-patch` visualizza i nomi dei file delle patch che crea. Il parametro `-M` indica a Git di tener traccia dei file rinominati. I file alla fine avranno questo aspetto:

	$ cat 0001-add-limit-to-log-function.patch
	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] add limit to log function

	Limit log functionality to the first 20

	---
	 lib/simplegit.rb |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index 76f47bc..f9815f1 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -14,7 +14,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log #{treeish}")
	+    command("git log -n 20 #{treeish}")
	   end

	   def ls_tree(treeish = 'master')
	--
	1.6.2.rc1.20.g8c5b.dirty

Puoi anche modificare questi file per aggiungere maggiori informazioni per la mailing list che però non vuoi che vengano visualizzate all'interno del messaggio della commit. Se aggiungi del testo tra la riga con `---` e l'inizio della patch (ad esempio la riga `lib/simplegit.rb`), gli sviluppatori potranno leggerlo ma verrà escluso dal messaggio della commit una volta che la patch sarà applicata.

Per inviare le patch alla mailing list, puoi copiare ed incollare il file nel tuo programma di posta o inviare il tutto dalla riga di comando. Incollare il testo è spesso causa di problemi di formattazione, sopratutto con i client di posta "intelligenti" che non mantengono correttamente i caratteri di a-capo e altri caratteri di spaziatura. Fortunatamente Git fornisce uno strumento che ti aiuta a inviare correttamente le patch tramite IMAP, che potrebbe facilitarti il compito. Ti mostrerò come mandare una patch con Gmail perché è il client di posta che utilizzo, ma troverai istruzioni dettagliate per molti client di posta alla fine del documento `Documention/SubmittingPatches`, che trovi nel codice sorgente di Git.

Prima di tutto devi configurare la sezione imap nel tuo file `~/.gitconfig`. Puoi configurare ogni parametro separatamente con una serie di comandi `git config` o scriverli direttamente con un editor di testo. Alla fine il tuo file di configurazione dovrebbe comunque essere più o meno così:

	[imap]
	  folder = "[Gmail]/Drafts"
	  host = imaps://imap.gmail.com
	  user = user@gmail.com
	  pass = p4ssw0rd
	  port = 993
	  sslverify = false

Se il tuo server IMAP non usa SSL, probabilmente le ultime due righe non ti saranno necessarie e il valore del campo host sarà `imap://` invece di `imaps://`.
Quando avrai configurato tutto, potrai usare `git send-email` per inviare la serie di patch alla cartella "Bozze" del tuo server IMAP:

	$ git send-email *.patch
	0001-added-limit-to-log-function.patch
	0002-changed-log-output-to-30-from-25.patch
	Who should the emails appear to be from? [Jessica Smith <jessica@example.com>]
	Emails will be sent from: Jessica Smith <jessica@example.com>
	Who should the emails be sent to? jessica@example.com
	Message-ID to be used as In-Reply-To for the first email? y

Per ciascuna patch che stai per inviare, Git produce alcune informazioni di log che appariranno più o meno così:

	(mbox) Adding cc: Jessica Smith <jessica@example.com> from
	  \line 'From: Jessica Smith <jessica@example.com>'
	OK. Log says:
	Sendmail: /usr/sbin/sendmail -i jessica@example.com
	From: Jessica Smith <jessica@example.com>
	To: jessica@example.com
	Subject: [PATCH 1/2] added limit to log function
	Date: Sat, 30 May 2009 13:29:15 -0700
	Message-Id: <1243715356-61726-1-git-send-email-jessica@example.com>
	X-Mailer: git-send-email 1.6.2.rc1.20.g8c5b.dirty
	In-Reply-To: <y>
	References: <y>

	Result: OK

A questo punto, dovresti essere in grado di andare nella cartella bozze del tuo account, inserire nel campo "A:" la mailing list alla quale vuoi inviare la patch, magari aggiungendo in copia il mantenitore del progetto o la persona responsabile per quella determinata sezione e manda l'email.

## Sommario

Questa sezione ha trattato alcuni workflow comuni che è facile incontrare quando si ha a che fare con progetti Git diversi e ha introdotto un paio di strumenti nuovi per aiutarti a gestire questo processo. Vedremo ora l'altra faccia della medaglia: mantenere un progetto Git. Imparerai ad essere un dittatore benevolo (_benevolent dictator_) o un manager d'integrazione (_integration manager_).
