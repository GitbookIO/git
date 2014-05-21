# Basi di Diramazione e Fusione

Ora vediamo un semplice esempio di diramazione e fusione in un flusso di lavoro che potresti seguire nella vita reale. Supponiamo questi passaggi:

1.	Lavori su un sito web.
2.	Crei un ramo per una nuova storia su cui stai lavorando.
3.	Fai un po' di lavoro in questo nuovo ramo.

A questo punto, ricevi una chiamata per un problema critico e hai bisogno subito di risolvere il problema. Farai in questo modo:

1.	Tornerai indietro nel tuo ramo di produzione.
2.	Creerai un ramo in cui aggiungere la soluzione.
3.	Dopo aver testato il tutto, unirai il ramo con la soluzione e lo metterai in produzione.
4.	Salterai indietro alla tua storia originaria e continuerai con il tuo lavoro.

## Basi di Diramazione

Primo, diciamo che stai lavorando sul tuo progetto e hai già un po' di commit (vedi Figura 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)
 
Figura 3-10. Una storia di commit corta e semplice.

Hai deciso che lavorerai alla richiesta #53 di un qualsiasi sistema di tracciamento dei problemi che la tua compagnia utilizza. Per essere chiari, Git non si allaccia a nessun particolare sistema di tracciamento; ma dato che il problema #53 è un argomento specifico su cui vuoi lavorare, creerai un nuovo ramo su cui lavorare. Per creare un ramo e spostarsi direttamente in esso, puoi lanciare il comando `git checkout` con `-b`:

	$ git checkout -b iss53
	Switched to a new branch "iss53"

Questa è la scorciatoia per:

	$ git branch iss53
	$ git checkout iss53

La Figura 3-11 illustra il risultato.


![](http://git-scm.com/figures/18333fig0311-tn.png)
 
Figura 3-11. É stato creato un nuovo ramo.

Lavori sul tuo sito web e fai alcuni commit. Facendo questo muoverai il ramo `iss53` avanti, perché ti sei spostato in esso (infatti, il puntatore HEAD rimanda ad esso, vedi Figura 3-12):

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)
 
Figura 3-12. Il ramo iss53 è stato spostato in avanti con il tuo lavoro.

Ora ricevi la telefonata che ti avverte c'è un problema con il sito web, e devi risolverlo immediatamente. Con Git, non devi fare un deploy della tua soluzione con i cambiamenti del ramo `iss53` e non devi fare alcuno sforzo per riavvolgere le modifiche che hai fatto prima di applicare il fix a quello che è in produzione. Tutto ciò che devi fare è spostarti nel ramo master.

Ovviamente, prima di fare questo, nota che se hai delle modifiche nella tua directory di lavoro o nell'area di parcheggio (staging) che vanno in conflitto con il ramo su cui ti vuoi spostare, Git non ti permetterà lo spostamento. E' meglio avere uno stato di lavoro pulito quando ci si sposta nei vari rami. Ci sono dei modi per aggirare questa cosa (cioè, riporre e modificare i commit) che vedremo in seguito. Per ora, ha inviato tutte le tue modifiche, così puoi spostarti nel ramo master:

	$ git checkout master
	Switched to branch "master"

A questo punto, la directory di lavoro del tuo progetto è esattamente come era prima che tu iniziassi a lavorare alla richiesta #53, e puoi concentrarti sulla soluzione al problema. Questo è un punto importante da ricordare: Git reimposta la tua directory di lavoro all'istantanea del commit a cui punta il checkout. Lui aggiunge, rimuove e modifica i file automaticamente per essere sicuro che la tua copia di lavoro sia identica al tuo ultimo commit in quel ramo.

Successivamente, hai un hotfix da creare. Crea un ramo hotfix su cui lavorare fin quando non è completo (vedi Figura 3-13): 

	$ git checkout -b 'hotfix'
	Switched to a new branch "hotfix"
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix]: created 3a0874c: "fixed the broken email address"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)
 
Figura 3-13. Ramo hotfix basato sul ramo master.

Puoi avviare il tuo test, essere sicuro che la tua soluzione sia ciò che vuoi ottenere, e fonderla nel ramo master per inserirla nella fase di produzione. Puoi fare questo con il comando `git merge`:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast forward
	 README |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Avrai notato la frase "Fast forward" nella fusione. Dato che il commit a cui puntava il ramo unito era direttamente a monte rispetto al commit in cui ci ti trovi, Git muove il puntatore in avanti. Per dirla in un altro modo, quando provi ad unire un commit con un commit che può essere portato al primo commit della storia, Git semplifica le cose muovendo il puntatore in avanti perché non c'è un lavoro differente da fondere insieme — questo sistema è chiamato "fast forward".

I tuoi cambiamenti sono ora nell'istantanea del commit che punta al ramo `master`, e puoi utilizzare la tua modifica (vedi Figura 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)
 
Figura 3-14. Il tuo ramo master punta allo stesso punto del ramo hotfix dopo l'unione.

Dopo che il tuo fix super-importante è disponibile, sei pronto per tornare al lavoro che stavi eseguendo precedentemente all'interruzione. Ovviamente, prima devi eliminare il ramo `hotfix`, perché non ne avrai più bisogno — il ramo `master` punta allo stesso posto. Puoi eliminarlo con l'opzione `-d` di `git branch`:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Ora puoi tornare al tuo lavoro precedente sul problema #53 (vedi Figura 3-15):

	$ git checkout iss53
	Switched to branch "iss53"
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53]: created ad82d7a: "finished the new footer [issue 53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)
 
Figura 3-15. Il ramo iss53 può andare avanti indipendentemente.

Non è un problema non avere il lavoro svolto nel ramo `hotfix` nei file del ramo `iss53`. Se hai bisogno di inserire le modifiche, puoi fondere il ramo `master` nel ramo `iss53` lanciando `git merge master`, o puoi aspettare di integrare queste modifiche quando deciderai ti inserire il ramo `iss53` nel ramo `master`.

## Basi di Fusione

Supponiamo tu abbia deciso che il lavoro sul problema #53 sia completo e pronto per la fusione con il ramo `master`. Per fare questo, unirai il ramo `iss53`, esattamente come la fusione precedente del ramo `hotfix`. Tutto ciò che devi fare è spostarti nel ramo in cui vuoi fare la fusione e lanciare il comando `git merge`:

	$ git checkout master
	$ git merge iss53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Il risultato è leggermente differente rispetto alla fusione precedente di `hotfix`. In questo caso, Git ha eseguito la fusione in tre punti, usando le due istantanee che puntano all'estremità del ramo e al progenitore comune dei due. La Figura 3-16 evidenza i tre snapshot che Git usa per fare la fusione di questo caso.


![](http://git-scm.com/figures/18333fig0316-tn.png)
 
Figura 3-16. Git automaticamente identifica il miglior progenitore comune su cui basare la fusione dei rami.

Invece di muovere il puntatore del ramo in avanti, Git crea una nuova istantanea che risulta da questa fusione e automaticamente crea un nuovo commit che punta ad essa (vedi Figura 3-17). Questo si chiama commit di fusione ed è speciale perché ha più di un genitore.

Vale la pena sottolineare che Git determina il migliore progenitore comune da utilizzare per la sua unione di base, questo è diverso da CVS o Subversion (prima della versione 1.5), in cui lo sviluppatore facendo la fusione doveva capire la base migliore di unione. Questo rende la fusione dannatamente semplice rispetto ad altri sistemi.


![](http://git-scm.com/figures/18333fig0317-tn.png)
 
Figura 3-17. Git automaticamente crea un nuovo commit che contiene la fusione dei lavori.

Ora che il tuo lavoro è fuso, non hai più bisogno del ramo `iss53`. Puoi eliminarlo e chiudere manualmente il ticket nel tuo sistema di tracciamento:

	$ git branch -d iss53

## Basi sui Conflitti di Fusione

Occasionalmente, questo processo non è così semplice. Se modifichi la stessa parte di uno stesso file in modo differente nei due rami che stai fondendo assieme, Git non è in grado di unirli in modo pulito. Se il tuo fix per il problema #53 modifica la stessa parte di un file di `hotfix`, avrai un conflitto di fusione che assomiglierà a qualcosa di simile a questo:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git non ha creato automaticamente un commit di fusione. Lui ferma il processo fino a quando non risolverai il conflitto. Se vuoi vedere quali file non sono stati fusi in qualsiasi punto dell'unione, puoi avviare `git status`:

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changed but not updated:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Qualsiasi cosa che ha un conflitto di fusione e non è stato risolto è elencato come unmerged. Git aggiunge dei marcatori standard di conflitto-risoluzione ai file che hanno conflitti, così puoi aprirli manualmente e risolvere i conflitti. I tuoi file conterranno una sezione che assomiglierà a qualcosa tipo:

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53:index.html

Questo significa che la versione in HEAD (del ramo principale, perché è dove ti sei spostato precedentemente quando hai avviato il comando di fusione) è la parte superiore del blocco (tutto quello che sta sopra a `=======`), mentre la versione nel ramo `iss53` sarà la parte sottostante. Per risolvere il conflitto, dovrai scegliere una parte o l'altra oppure fondere i contenuti di persona. Per esempio, puoi risolvere il conflitto sostituendo l'intero blocco con questo:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

Questa soluzione ha un po' tutte le sezioni, e ho rimosso completamente le linee `<<<<<<<`, `=======` e `>>>>>>>`. Dopo che hai risolto ogni singola sezione di conflitto del file, avvia `git add` su ogni file per marcarlo come risolto. Mettere in stage il file è come marcarlo risolto in Git. 
Se vuoi usare uno strumento grafico per risolvere i problemi, puoi lanciare `git mergetool`, che avvierà uno strumento visuale di fusione appropriato e ti guiderà attraverso i conflitti: 

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

Se vuoi usare uno strumento di fusione differente dal predefinito (Git usa `opendiff` in questo caso perché ho lanciato il comando su un Mac), puoi vedere tutti gli strumenti supportati all'inizio dopo “merge tool candidates”. Scrivi il nome dello strumento che vorresti usare. Nel Capitolo 7, discuteremo su come puoi modificare i valori predefiniti del tuo ambiente.

Dopo che sei uscito dallo strumento di fusione, Git ti chiederà se la fusione è avvenuta con successo. Se gli dirai allo script che è così, parcheggerà i file in modo da segnarli come risolti per te.

Puoi avviare `git status` nuovamente per verificare che tutti i conflitti sono stati risolti:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

Se sei soddisfatto di questo, e hai verificato che tutti i conflitti sono stati messi in stage, puoi dare `git commit` per terminare la fusione. Il messaggio del commit predefinito assomiglierà a qualcosa tipo:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

Puoi modificare questo messaggio con i dettagli su come hai risolto la fusione se pensi possa tornare utile ad altri che vedranno questa unione in futuro — perché hai fatto quel che hai fatto, se non era ovvio.
