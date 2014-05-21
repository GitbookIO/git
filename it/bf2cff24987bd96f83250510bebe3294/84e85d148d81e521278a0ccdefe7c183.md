# Mantenere un Progetto

Oltre a sapere come contribuire ad un progetto in maniera effettiva, dovrai probabilmente sapere anche come mantenerne uno. Ciò consiste nell'accettare ed applicare le patch generate con il comando `format-patch` e ricevute tramite e-mail oppure nell'integrare le modifiche dei branch remoti che hai definito nel tuo progetto come remoti. Sia che mantenga un repository o che voglia contribuire verificando o approvando le patch, devi sapere come svolgere il tuo compito in modo che sia chiaro per gli altri contributori del progetto e sostenibile per te nel lungo periodo.

## Lavorare coi branch per argomento

Quando pensi di integrare un nuovo lavoro generalmente è una buona idea provarlo in un branch per argomento: un branch temporaneo, creato specificatamente per provare le modifiche dalla patch. In questo modo è semplice verificare la singola patch e, se questa non funziona, lasciarla intalterata fino a quando non avrai il tempo di ritornarci. Se crei un branch col nome dell'argomento della patch che proverai, per esempio `ruby_client` o qualcosa ugualmente descrittiva, ti sarà facile individuarlo nel caso tu debba temporaneamente lasciare il lavoro sulla patch per ritornarci più avanti. Il mantenitore del progetto Git  usa dare uno gerarchia ai nomi di questi branch: come `sc/ruby_client`, dove `sc` sono le iniziali della persona che ha realizzato la patch.
Come ricorderai, puoi creare un branch partendo dal tuo master così:

	$ git branch sc/ruby_client master

E, se vuoi passare immediatamente al nuovo branch, puoi usare il comando `checkout -b`:

	$ git checkout -b sc/ruby_client master

Ora sei pronto per aggiungere il lavoro a questo branch e decidere se vuoi unirlo a uno dei branch principali del tuo progetto.

## Applicare le patch da un'e-mail

Se ricevi le patch via e-mail e le vuoi integrarle nel tuo progetto, devi prima applicarle per poterle giudicare. Ci sono due modi per applicare una patch ricevuta via email: con `git apply` o con `git am`.

### Applicare una patch con apply

Se hai ricevuto la patch da qualcuno che l'ha generata usando il comando `git diff` o un qualsiasi comando Unix `diff`, puoi applicarla usando `git apply`. Se hai salvato la patch in `/tmp/patch-ruby-client.patch`, puoi applicarla così:

	$ git apply /tmp/patch-ruby-client.patch

Ciò modifica i file nella tua directory corrente. E' quasi uguale ad eseguire il comando `patch -p1` per applicare la patch, anche se questo comando è più paranoico e accetta meno corrispondenze di patch. Gstisce anche l'aggiunta, la rimozione e il cambio del nome dei file se ciò è descritto nel formato di `git diff`, cose che non fa `patch`. Infine `git apply` segue il modello "applica tutto o rigetta tutto" per cui o vengono applicato tutte le modifiche oppure nessuna, mentre `patch` può anche applicarne solo alcune, lasciando la tua directory corrente in uno stato intermedio. `git apply` è in generale molto più paranoico di `patch`. Non creerà una commit per te: una volta eseguito devi eseguire manualmente lo stage delle modifiche e farne la commit.

Puoi anche usare `git apply` per verificare se una patch può essere applicata in maniera pulita, prima di applicarla veramente eseguendo `git apply --check` sulla patch:

	$ git apply --check 0001-seeing-if-this-helps-the-gem.patch
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply

Se non viene visualizzato alcun output, allora la patch può essere applicata in maniera pulita. Questo comando restituisce un valore diverso da zero se la verifica fallisce, quindi puoi usarlo anche in uno script.

### Applicare una patch con am

Se il contributore è un utente Git ed è stato abbastanza bravo a usare il comando `format-patch` per generare la sua patch, allora il tuo lavoro sarà più facile perché la patch già contiene le informazioni sull'autore e un messaggio di commit. Se pouoi, per generare le patch per te, incoraggia i tuoi collaboratori ad utilizzare `format-patch` invece di `diff`. Dovresti dover usare solo `git apply` per le patch precedenti e altre cose del genere.

Per applicare una patch generata con `format-patch`, userai `git am`. Tecnicamente `git am` è fatto per leggere un file mbox, che è un file piatto di puro testo per memorizzare uno o più messaggi email in un solo file. Assomiglia a questo:

	From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
	From: Jessica Smith <jessica@example.com>
	Date: Sun, 6 Apr 2008 10:17:23 -0700
	Subject: [PATCH 1/2] add limit to log function

	Limit log functionality to the first 20

Questo è l'inizio dell'output del comando 'format-patch' che hai visto nella sezione precedente, ma è anche un formato valido per mbox per le email. Se qualcuno ti ha inviato la patch usando 'git send-email' e l'hai scaricata nel formato mbox, allora puoi selezionare il file mbox in 'git am' che inizierà ad applicare tutte le patch che trovi. Se hai un client di posta elettronica che ti permette di salvare più messaggi in un file mbox allora puoi salvare tutta una serie di patch in un singolo file e usare `git am` per applicarle tutte assieme.

Se invece qualcuno ha caricato una patch generata con `format-patch` su un sistema di ticket e tracciamento, puoi salvare localmente il file e passarlo a `git am` perché lo applichi:

	$ git am 0001-limit-log-function.patch
	Applying: add limit to log function

Puoi vedere che ha applicato senza errori le modifiche e ha creato automaticamente una nuova commit per te. Le informazioni sull'autore e la data della commit vengono prese delle intestazioni `From`  e `Date` dell'email, mentre il messaggio della commit è preso dal `Subject` e dal corpo dell'email che precede la patch. Se questa patch fosse stata applicata dall'esempio dell'mbox appena mostrato, la commit generata apparirebbe così:

	$ git log --pretty=fuller -1
	commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Author:     Jessica Smith <jessica@example.com>
	AuthorDate: Sun Apr 6 10:17:23 2008 -0700
	Commit:     Scott Chacon <schacon@gmail.com>
	CommitDate: Thu Apr 9 09:19:06 2009 -0700

	   add limit to log function

	   Limit log functionality to the first 20

`Commit` indica chi ha applicato la patch e `CommitDate` quando. `Author` chi ha creato la patch originariamente e quando.

Ma è possibile che la patch non sia applicabile correttamente. Il tuo branch principale potrebbe essere cambiato troppo rispetto al branch da cui deriva la patch o che la patch dipenda da altre che non hai ancora applicato. In questo caso il processo di `git am` fallirà e ti chiederà cosa voglia fareprocess will fail and ask you what you want to do:

	$ git am 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Patch failed at 0001.
	When you have resolved this problem run "git am --resolved".
	If you would prefer to skip this patch, instead run "git am --skip".
	To restore the original branch and stop patching run "git am --abort".

Questo comando aggiunge dei marcatori di conflicco in ciascun file che presenti un problema, similmente a quanto avviene nelle operazioni di merge o rebase. E tu risolverai il problema allo stesso modo: modifica il file per risolvere il conflitto, mettilo nello stage ed esegui `git am --resolved` per continuare con la patch successiva:

	$ (fix the file)
	$ git add ticgit.gemspec
	$ git am --resolved
	Applying: seeing if this helps the gem

Se vuoi che Git provi a risolvere i conflitti più intelligentemente, puoi passargli l'opzione `-3`, e Git proverà a eseguire un merge a 3-vie. Quest'opzione non è attiva di default perché non funziona se la patch si basa su una commit che non hai nel tuo repository. Se invece hai quella commit (ovvero se la patch è basata su una commit pubblica) allora generalmente l'opzione `-3` è più intelligente nell'applicare una patch con conflitti:

	$ git am -3 0001-seeing-if-this-helps-the-gem.patch
	Applying: seeing if this helps the gem
	error: patch failed: ticgit.gemspec:1
	error: ticgit.gemspec: patch does not apply
	Using index info to reconstruct a base tree...
	Falling back to patching base and 3-way merge...
	No changes -- Patch already applied.

In questo caso sto cercando di applicare una patch che ho già applicato. Senza l'opzione `-3` sembrerebbe che ci sia un conflitto.

Se stai applicando una serie di patch da un file mbox puoi eseguire il comando `am` anche in modalità interattiva, che si ferma ogni volta che incontra una patch per chiederti se vuoi applicarla:

	$ git am -3 -i mbox
	Commit Body is:
	--------------------------
	seeing if this helps the gem
	--------------------------
	Apply? [y]es/[n]o/[e]dit/[v]iew patch/[a]ccept all

Questo è utile se hai una serie di patch salvate, perché se non ti ricordi cosa sia puoi rivedere la patch, o non applicarla se l'hai già applicata.

Quando tutte la patch per l'orgomento sono state applicate e committate nel tuo branch, puoi decidere se e come integrarle in un branch principale.

## Scaricare branch remoti

Se la contribuzione viene da un utente Git che ha un proprio repository su cui ha pubblicato una serie di modifiche e ti ha mandato l'indirizzo del repository e il nome del branch remoto in cui sono le stesse, puoi aggiungerlo come remoto e unirle localmente.

Se, per esempio, Jessica ti invia un'email dicendoti che nel branch `ruby-client` del suo repository ha sviluppato un'interessante funzionalità, tu puoi testarla aggiungendo il branch remoto e scaricarlo come uno localmente:

	$ git remote add jessica git://github.com/jessica/myproject.git
	$ git fetch jessica
	$ git checkout -b rubyclient jessica/ruby-client

Se successivamente t'invia un'altra email con un altro branch che contenga un'altra funzionalità interessante tu puoi scaricarla più velocemente perché hai già configurato il repository remoto.

Questa configurazione è molto utile se lavori molto con una persona. Se qualcuno produce una sola patch di tanto in tanto può essere più rapido accettarle per email, invece di chiedere a tutti di avere un proprio server pubblico e aggiungere in continuazione dei repository remoti per poche modifiche. Allo stesso tempo non vorrai centinaia di repository remoti per qualcuno che contribuisce solo con una patch o due. In ogni caso degli script o servizi di hostin possono rendere il tutto più semplice e principalmente dipende da come sviluppate tu e i tuoi contributori.

L'altro vantaggio di questo approccio è che in aggiunta ricevi la cronologia delle commit. Sebbene tu possa avere problemi coi merge saprai su quale parte della tua cronologia si basi il lavoro dei contributori, il merge a 3-vie è il default e non richiede di specificare l'opzione `-3` e la patch potrebbe essere generata da una commit pubblica a cui tu abbia accesso.

Se non lavori spesso con una persona ma vuoi comunque prendere le modifiche in questo modo puoi sempre passare l'URL del repository remoto al comando `git pull`. Questo farà una pull una tantum senza salvare l'URL come un riferimento remoto:

	$ git pull git://github.com/onetimeguy/project.git
	From git://github.com/onetimeguy/project
	 * branch            HEAD       -> FETCH_HEAD
	Merge made by recursive.

## Determinare cos'è stato introdotto

Hai un branch che contiene il lavoro di un contributore. A questo punto puoi decidere cosa farne. Questa sezione rivisita un paio di comandi così che tu possa vedere come usarli per revisionare con precisione cosa introdurrai se unissi queste modifiche al tuo branch principale.

Spesso è utile revisionare le commit del branch che non sono ancora nel tuo master. Puoi escludere le commit di un branch aggiungendo l'opzione `--not` prima del nome del branch. Se un tuo contributore ti manda due patch e tu crei un branch chiamato `contrib` dove applichi le patch, puoi eseguire:

	$ git log contrib --not master
	commit 5b6235bd297351589efc4d73316f0a68d484f118
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Oct 24 09:53:59 2008 -0700

	    seeing if this helps the gem

	commit 7482e0d16d04bea79d0dba8988cc78df655f16a0
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Mon Oct 22 19:38:36 2008 -0700

	    updated the gemspec to hopefully work better

Ricorda che puoi passare l'opzione `-p` a `git log` per vedere le modifiche di ciascuna commit, così che all'output aggiungerà le differenze introdotte da ciascuna commit.

Per vedere tutte le differenze che verrebbero applicate se unissi il branch attuale con un altro dovrai usare un trucchetto per vedere il risultato corretto. Potresti pensare di usare:

	$ git diff master

Ed effettivamente questo comando esegue una differenza, ma può essere causa di errori. Se il tuo branch `master` si fosse spostato in avanti rispetto a quando hai creato il branch vedrai risultati strani. Questo succede perché Git confronta direttamente l'istantanea ('snapshots') dell'ultima commit del branch con l'istantanea dell'ultima commit di `master`. Se, per esempio, hai aggiunto una riga in un file su `master` branch, un confronto diretto delle istantanee sembrerà indicare che il branch rimuova quella riga.

Se `master` è un antenato diretto del branch allora non sarà un problema, ma se le due cronologie si sono biforcate ti apparirà che stai aggiungendo tutte le cose nuove del tuo branch e rimuovendo tutto ciò che è solo in `master`.

Quello che vuoi realmente vedere sono le modifiche aggiunte nel branch: il lavoro che effettivamente introdurrai se le unissi al master. Potrai ottenerlo facendo si che Git confronti l'ultima commit del branch col primo antenato comune con il branch master.

Tecnicamente puoi farlo tu scoprendo l'antenato comune ed eseguendo quindi la diff:

	$ git merge-base contrib master
	36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
	$ git diff 36c7db

Questo però è scomodo e Git fornisce un modo più veloce per farlo: i tre punti. Nel contesto del comando `diff`, puoi usare tre punti dopo il nome di un branch per eseguire una `diff` tra l'ultima commit del branch in cui sei e l'antenato comune con un altro branch:

	$ git diff master...contrib

Questo comando ti mostra solo le modifiche introdotte dal branch attuale a partire dall'antenato comune con master. Questa sintassi è molto utile da ricordare.

## Integrare il lavoro dei contributori

Quando tutto il lavoro del tuo branch è pronto per essere integrato in un branch principale nasce il prblema di come farlo. Inoltre, quale workflow vuoi usare per mantenere il tuo progetto? Hai una serie di scelte e ne tratterò alcune.

### I workflow per il merge

Un workflow semplice unisce le modifiche nel branch `master`. In questo scenario hai un `master` che contiene del codice stabile. Quando hai del lavoro in un branch funzionale che sia tuo o di un contributore e di cui tu abbia già verificato il buon funzionamento, lo unisci al master, cancelli il branch e così via. Se abbiamo un repository che abbia delle modifiche in due branch  funzionali chiamati `ruby_client` e `php_client` questo apparirà come in Figura 5-19 e se unissimo prima `ruby_client` e poi `php_client` allora la nostra cronologia apparirà come quella in Figura 5-20.


![](http://git-scm.com/figures/18333fig0519-tn.png)

Figura 5-19. Cronologia con branch funzionali multipli.


![](http://git-scm.com/figures/18333fig0520-tn.png)

Figura 5-20. Dopo l'unione dei branch funzionali.

Probabilmente questo è il workflow più semplice, ma è anche problematico se stai lavorando con repository o progetti grandi.

Se hai più sviluppatori o lavori in un progetto grande, probabilmente vorrai usare un ciclo d'unione a due fasi. In questo scenario hai due branch principali, `master` e `develop`, e hai deciso che `master` viene aggiornato esclusivamente con un rilascio molto stabile e tutto il codice nuovo viene integrato nel branch `develop`. Condividi regolarmente entrambi i branch su un repository pubblico e ogni volta che hai un nuovo branch funzionale da integrare (Figura 5-21) lo fai in `develop` (Figura 5-22), quindi taggi il rilascio e fai un `fast-forward` di `master` al punto in cui `develop` è stabile (Figura 5-23).


![](http://git-scm.com/figures/18333fig0521-tn.png)

Figura 5-21. Prima dell'unione del branch funzionale.


![](http://git-scm.com/figures/18333fig0522-tn.png)

Figura 5-22. Dopo l'unione del branch funzionale.


![](http://git-scm.com/figures/18333fig0523-tn.png)

Figura 5-23. Dopo il rilascio di un branch funzionale.

In questo modo quando qualcuno clona il repository del tuo progetto, questi può scaricare il master per avere l'ultima versione stabile e tenersi aggiornato, o scaricare la versione di sviluppo che contiene le ultime cose.
Puoi estendere questo concetto avendo un branch in cui integri tutto il nuovo lavoro. Quando il codice di questo branch è stabile e ha passato tutti i test lo unisci al branch di sviluppo e quando questo ha dimostrato di essere stabile per un po', fai un _fast-forward_ del tuo master.

### Workflow per unioni grandi

Il progetto Git ha quattro branch principali: `master`, `next`, e `pu` (aggiornamenti suggeriti - `proposed updates`) per il nuovo lavoro, e `maint` per la manutenzione dei backport. Quando un contributore introduce una modifica, questa viene raccolta nei branch funzionali del repository del mantenitore in modo simile a quanto ho già descritto (vedi Figura 5-24). A questo punto le modifiche vengono valutate per deteminare se sono sicure e pronte per essere utilizzate o se hanno bisogno di ulteriore lavoro. Se sono sicure vengono unite in `next` e questo branch viene condiviso perché chiunque possa provarle tutte assieme.


![](http://git-scm.com/figures/18333fig0524-tn.png)

Figura 5-24. Gestire una serie complessa di branch funzionali paralleli.

Se la funzione ha bisogno di ulteriori modifiche viene unita invece in `pu` e quando viene ritenuta realmente stabile viene unita di nuovo su `master` e viene ricostruita dal codice che era in `next`, ma non è ancora promossa su `master`. Questo significa che `master` va quasi sempre avanti, `next` raramente è ribasato e `pu` viene ribasato molto spesso (see Figura 5-25).


![](http://git-scm.com/figures/18333fig0525-tn.png)

Figura 5-25. Unire branch di contribuzione nei branch principali.

Quando un branch funzionale viene finalmente unito in `master` viene anche rimosso dal repository. Il progetto Git ha anche un branch `maint` che è un fork dell'ultima release per fornire patch a versioni precedenti nel caso sia necessaria un rilascio di manutenzione. Quindi, quando cloni il repository di Git puoi usare quattro branch per valutare il progetto in stadi diversi dello sviluppo, a seconda che tu voglia le ultime funzionalità o voglia contribuire, e il mantenitore ha strutturato il workflow in modo da favorire nuove contribuzioni.

### Workflow per il rebase e lo _cherry pick_

Altri mantenitori preferiscono ribasare o usare lo _cherry-pick_ aggiungere i contributi nel loro branch master, piuttosto che unirli, per mantenere una cronologia il più lineare possibile. Quando hai delle modifiche in un branch funzionale e hai deciso che vuoi integrarle, ti sposti su quel branch ed esegui il comando _rebase_ per replicare le modifiche del tuo master attuale (o `develop` e così via). Se queste funzionano, allora fai un _fast-forward_ del tuo `master` e ti ritroverai con un progetto dalla cronologia lineare.

L'altro modo per spostare il lavoro dei contributori da un branch all'altro è di usare lo _cherry-pick_. Lo _cherry-pick_ in Git è come una rebase per una commit singola. Prende la patch introdotta nella commit e prova a riapplicarla sul branch dove sei. Questo è utile se hai molte commit in un branch funzionale e vuoi integrarne solo alcune o se hai un'unica commit in un branch funzionale e preferisci usare lo `cherry-pick` piuttosto che ribasare. Immagina di avere un progetto che sembri quello di Figura 5-26.


![](http://git-scm.com/figures/18333fig0526-tn.png)

Figura 5-26. Cronologia prima dello _cherry pick_.

Se vuoi introdurre la commit `e43a6` nel tuo master puoi eseguire

	$ git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
	Finished one cherry-pick.
	[master]: created a0a41a9: "More friendly message when locking the index fails."
	 3 files changed, 17 insertions(+), 3 deletions(-)

Che replica le stesse modifiche introdotte in `e43a6`, ma produce una nuova commit con un suo SHA-1 differente perché le date sono diverse. La tua cronologia ora assomiglia a quella in Figura 5-27.


![](http://git-scm.com/figures/18333fig0527-tn.png)

Figura 5-27. Cronologia dopo lo _cherry-picking_ dal branch funzionale.

Puoi ora eliminare il branch funzionale e cancellare le commit che non vuoi integrare.

## Tagga i tuoi rilasci

Quando hai deciso di eseguire un rilascio probabilmente vorrai anche taggarla, così che tu possa ricrearla in qualsiasi momento nel futuro. Puoi aggiungere un nuovo tag come discusso nel Capitolo 2. Se vuoi firmare il tag in quanto mantenitore, il tag potrebbe apparire come il seguente:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gmail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Se firmi il tuo tag potresti avere il problema di distribuire la chiave PGP usata per firmarlo. Il mantenitore del progetto Git lo ha risolto includendo le chiavi dei mantenitori come un blob sul repository e aggiungendo quindi un tag che vi punti direttamente. Per farlo dovrai identificare la chiave che vuoi esportare eseguendo `gpg --list-keys`:

	$ gpg --list-keys
	/Users/schacon/.gnupg/pubring.gpg
	---------------------------------
	pub   1024D/F721C45A 2009-02-09 [expires: 2010-02-09]
	uid                  Scott Chacon <schacon@gmail.com>
	sub   2048g/45D02282 2009-02-09 [expires: 2010-02-09]

Potrai quindi importare la chiave direttamente nel database di Git esportandola e mettendola in pipe con `git hash-object`, che scrive in Git un nuovo blob con il suo contenuto e ti restituisce l'hash SHA-1:

	$ gpg -a --export F721C45A | git hash-object -w --stdin
	659ef797d181633c87ec71ac3f9ba29fe5775b92

Ora che hai importato il contenuto della tua chiave in Git puoi creare un tag che vi punti direttamente, specificando l'SHA-1 appena ottenuto:

	$ git tag -a maintainer-pgp-pub 659ef797d181633c87ec71ac3f9ba29fe5775b92

Se esegui `git push --tags` verrà condiviso con tutti il tag `maintainer-pgp-pub`. Se qualcuno volesse verificare il tag potrà farlo importando la tua chiave PGP scaricando il blob dal database e importandolo in GPG:

	$ git show maintainer-pgp-pub | gpg --import

Può quindi usare la chiave per verificare tutti i tag che hai firmato. Inoltre, se aggiungi delle istruzioni nel messaggio del tag, eseguendo `git show <tag>` darai all'utente finale maggiori informazioni specifiche su come verificare il tag.

## Generare un numero di build

Poiché Git non usa una numerazione incrementale come 'v123' o un equivalente associato a ciascuna commit, se vuoi un nome per una commit che sia intellegibile, puoi usare il comando `git describe` su quella commit. Git restituirà il nome del tag più vicino assieme al numero di commit successivi e una parte dell'SHA-1 della commit che vuoi descrivere:

	$ git describe master
	v1.6.2-rc1-20-g8c5b85c

In questo modo puoi esportare un'istantanea o una build  echiamarla in modo che le persone possano capire. Se infatti fai una build di Git dai sorgenti clonati dal repository di Git repository, `git --version` ti restituirà qualcosa che gli assomigli. Se vuoi descrivere una commit che hai taggato, Git ti darà il nome del tag.

Il comando `git describe` predilige i tag annotati (i tags creati con`-a` o `-s`) e quindi i tag dei rilasci dovrebbero essere creati in questo modo se usi `git describe`, per assicurarsi che le commit vengano denominate correttamente quando vengono descritte. Puoi usare questa stringa per i comandi `checkout` o `show`, sebbene il basarsi sull'SHA-1 abbreviato potrebbe renderla non valida per sempre. Per esempio, recentemente il kernel di Linux è passato recentemente da 8 a 10 caratteri per garantire l'unicità degli SHA-1 abbreviati, e quindi gli output precedenti di `git describe` non sono più validi.

## Pronti per il rilascio

Vuoi ora rilasciare una build. Una delle cose che vorrai fare sarà creare un archivio con l'ultima istantanea del tuo codice per quelle anime dannate che non usano Git. Il comando è `git archive`:

	$ git archive master --prefix='project/' | gzip > `git describe master`.tar.gz
	$ ls *.tar.gz
	v1.6.2-rc1-20-g8c5b85c.tar.gz

Quando qualcuno aprirà questo  tarball, troverà l'ultima versione del tuo progetto nella directory `project`. Allo stesso modo puoi creare un archivio zip passando l'opzione `--format=zip` a `git archive`:

	$ git archive master --prefix='project/' --format=zip > `git describe master`.zip

Ora hai un tarball e uno zip del rilascio del tuo progetto che puoi caricare sul tuo sito o inviare per email.

## Lo Shortlog

È il momento di inviare un'email alla lista di persone che vogliono sapere cosa succede nel tuo progetto. Un modo piacevole per produrre una specie di changelog delle modifiche dall'ultimo rilascio o dall'ultima email è usando il comando `git shortlog`, che riassume tutte le commit nell'intervallo dato. L'esempio seguente produce il sommario di tutte le commit dall'ultimo rilascio, assumento che lo abbia chiamato v1.0.1:

	$ git shortlog --no-merges master --not v1.0.1
	Chris Wanstrath (8):
	      Add support for annotated tags to Grit::Tag
	      Add packed-refs annotated tag support.
	      Add Grit::Commit#to_patch
	      Update version and History.txt
	      Remove stray `puts`
	      Make ls_tree ignore nils

	Tom Preston-Werner (4):
	      fix dates in history
	      dynamic version method
	      Version bump to 1.0.2
	      Regenerated gemspec for version 1.0.2

Ottieni un sommario pulito di tutte le commit dalla v1.0.1, raggruppate per autore che puoi quindi inviare per email alla tua lista.
