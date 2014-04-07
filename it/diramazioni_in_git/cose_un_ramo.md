# Cos'è un Ramo

Per capire realmente come Git sfrutta le diramazioni, dobbiamo tornare un attimo indietro ed esaminare come Git immagazzina i dati. Come ricorderai dal Capitolo 1, Git non salva i dati come una serie di cambiamenti o codifiche delta, ma come una serie di istantanee.

Quando fai un commit con Git, Git immagazzina un oggetto commit che contiene un puntatore all'istantanea del contenuto di ciò che hai parcheggiato, l'autore ed il messaggio, e zero o più puntatori al o ai commit che sono i diretti genitori del commit: zero genitori per il primo commit, un genitore per un commit normale, e più genitori per un commit che risulta da una fusione di due o più rami.

Per visualizzarli, assumiamo che tu abbia una directory con tre file, li parcheggi ed esegui il commit. Parcheggiando il checksum di ogni singolo file (abbiamo parlato dell'hash SHA-1 nel Capitolo 1), salviamo la versione del file nel repository Git (Git fa riferimento ad essi come blob), e aggiunge questi checksum all'area di staging, o di parcheggio:

	$ git add README test.rb LICENSE
	$ git commit -m 'initial commit of my project'

Quando crei il commit lanciado `git commit`, Git calcola il checksum di ogni directory (in questo caso, solamente la directory radice del progetto) e salva questi tre oggetti nel repository Git. Git poi crea un commit dell'oggetto che ha i metadati ed un puntatore alla radice dell'albero del progetto in maniera da ricreare l'istantanea quando si vuole.

Il tuo repository Git ora contiene cinque oggetti: un blob per i contenuti di ogni singolo file nell'albero, un albero che elenca i contenuti della directory e specifica i nomi dei file che devono essere salvati come blob, e un commit con il puntatore alla radice dell'albero e a tutti i metadati del commit. Concettualmente, i dati nel tuo repository Git assomigliano alla Figura 3-1. 


![](http://git-scm.com/figures/18333fig0301-tn.png)
 
Figura 3-1. Dati di un singolo commit nel repository.

Se fai dei cambiamenti ed esegui il commit nuovamente, il commit successivo immagazzinerà un puntatore al commit che lo precede. Dopo due o più invii, la tua storia assomiglierà a qualcosa di simile alla Figura 3-2.


![](http://git-scm.com/figures/18333fig0302-tn.png)
 
Figura 3-2. Dati di Git per commit multipli.

In Git un ramo è semplicemente un puntatore ad uno di questi commit. Il nome del ramo principale in Git è master. Quando inizi a fare dei commit, li stai dando al ramo master che punterà all'ultimo commit che hai eseguito. Ogni volta che invierai un commit, lui si sposterà in avanti automaticamente.


![](http://git-scm.com/figures/18333fig0303-tn.png)
 
Figura 3-3. Ramo che punta alla storia dei commit dei dati.

Cosa succede se crei un nuovo ramo? Beh, farlo crea un nuovo puntatore che tu puoi muovere. Diciamo che crei un ramo chiamato testing. Lo farai con il comando `git branch`:

	$ git branch testing

Questo creerà un nuovo puntatore al commit in cui tu ti trovi correntemente (vedi Figura 3-4).


![](http://git-scm.com/figures/18333fig0304-tn.png)
 
Figura 3-4. Rami multipli che puntano alla storia dei commit dei dati.

Come fa Git a sapere in quale ramo ti trovi ora? Lui mantiene uno speciale puntatore chiamato HEAD. Nota che questo è differente dal concetto di HEAD di altri VCSs che potresti aver usato in passato, come Subversion o CVS. In Git, è un puntatore al ramo locale su cui ti trovi. In questo caso sei ancora sul ramo master. Il comando git branch ha solamente creato un nuovo ramo — non si è spostato in questo ramo (vedi Figura 3-5).


![](http://git-scm.com/figures/18333fig0305-tn.png)
 
Figura 3-5. Il file HEAD punta al ramo in cui ti trovi ora.

Per spostarsi in un ramo preesistente, devi usare il comando `git checkout`. Dunque spostati nel ramo testing:

	$ git checkout testing

Questo sposterà il puntatore HEAD al ramo testing (vedi Figura 3-6).


![](http://git-scm.com/figures/18333fig0306-tn.png)

Figura 3-6. HEAD punta ad un altro ramo dopo che ti sei spostato.

Qual'è il significato di tutto questo? Beh, facciamo un altro commit:

	$ vim test.rb
	$ git commit -a -m 'made a change'

La Figura 3-7 illustra il risultato.


![](http://git-scm.com/figures/18333fig0307-tn.png)
 
Figura 3-7. Il ramo a cui punta HEAD si muoverà avanti ad ogni commit.

Questo è interessante, perché ora il tuo ramo testing è stato spostato in avanti, ma il tuo ramo master punta ancora al commit in cui ti trovavi prima di spostarti di ramo con `git checkout`. Ora torna indietro al ramo master:

	$ git checkout master

La Figura 3-8 mostra il risultato.

insert 18333fig0308.png 
Figura 3-8. HEAD si è spostato ad un altro ramo con un checkout.

Questo comando ha fatto due cose. Ha spostato il puntatore HEAD indietro per puntare al ramo master e ha riportato i file nella tua directory di lavoro allo stato in cui si trovavano in quel momento. Questo significa anche che i cambiamenti che farai da questo punto in poi saranno separati da una versione più vecchia del progetto. Essenzialmente riavvolge temporaneamente il lavoro che hai fatto nel tuo ramo testing così puoi muoverti in una direzione differente.

Fai ora un po' di modifiche ed esegui ancora un commit:

	$ vim test.rb
	$ git commit -a -m 'made other changes'

Ora la storia del tuo progetto è separata (vedi Figura 3-9). Hai creato e ti sei spostato in un ramo, hai fatto un lavoro in esso e poi sei tornato sul ramo principale e hai fatto dell'altro lavoro. Entrambi questi cambiamenti sono isolati in rami separati: puoi spostarti indietro o in avanti fra i rami e poi fonderli assieme quando sarai pronto. E puoi farlo semplicemente con i comandi `branch` e `checkout`.


![](http://git-scm.com/figures/18333fig0309-tn.png)
 
Figura 3-9. Le storie dei rami sono separate.

Dato che un ramo in Git è semplicemente un file che contiene 40 caratteri di un checksum SHA-1 del commit al quale punta, i rami si possono creare e distruggere facilmente. Creare un nuovo ramo è semplice e veloce quanto scrivere 41 byte in un file (40 caratteri ed il fine riga).

Questo è in netto contrasto con il sistema utilizzato da molti altri VCS, che comporta la copia di tutti i file di un progetto in una seconda directory. Questo può richiedere diversi secondi o minuti, a seconda delle dimensioni del progetto, mentre in Git è un processo sempre istantaneo.  Inoltre, dato che registreremo i genitori dei commit, trovare la base adatta per la fusione è fatto automaticamente per noi ed è generalmente molto semplice da fare. Questa funzionalità aiuta ed incoraggia gli sviluppatori a creare e fare uso dei rami di sviluppo.

Andiamo a vedere perché dovresti usarli.
