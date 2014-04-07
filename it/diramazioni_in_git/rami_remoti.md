# Rami Remoti

I rami remoti sono riferimenti allo stato dei rami sui tuoi repository remoti. Sono rami locali che non puoi muovere; sono spostate automaticamente ogni volta che fai una comunicazione di rete.  I rami remoti sono come dei segnalibri per ricordarti dove i rami sui tuoi repository remoti erano quando ti sei connesso l'ultima volta.

Prendono la forma di `(remote)/(branch)`. Per esempio, se vuoi vedere come appariva il ramo `master` sul tuo ramo `origin` l'ultima volta che hai comunicato con esso, puoi controllare il ramo `origin/master`. Se stavi lavorando su un problema con un compagno ed hanno inviato un ramo `iss53`, potresti avere il ramo `iss53` in locale; ma il ramo sul server punta al commit `origin/iss53`.

Questo può un po' confondere, quindi vediamo un esempio. Diciamo che hai un server Git nella tua rete raggiungibile a `git.ourcompany.com`. Se fai una clonazione da qui, Git automaticamente lo nomina `origin` per te, effettua il pull di tutti i dati, crea un puntatore dove si trova il ramo `master` e lo nomina localmente `origin/master`; e non puoi spostarlo. Git inoltre ti da il tuo ramo `master` che parte dallo stesso punto del ramo originario `master`, così hai qualcosa da cui puoi iniziare a lavorare (vedi Figura 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)
 
Figura 3-22. Un clone con Git fornisce un proprio ramo principale e un puntatore origin/master al ramo principale di origine.

Se fai del lavoro sul tuo ramo principale locale, e, allo stesso temo, qualcuno ha inviato degli aggiornamenti al ramo principale di `git.ourcompany.com`, allora la tua storia si muoverà in avanti in modo differente. Inoltre, mentre non hai contatti con il tuo server di partenza, il tuo puntatore `origin/master` non si sposterà (vedi Figura 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)
 
Figura 3-23. Lavorando in locale ed avendo qualcuno che ha inviato al server remoto qualcosa rende l'avanzamento delle storie differente.

Per sincronizzare il tuo lavoro, devi avviare il comando `git fetch origin`. Questo comando guarda qual'è il server di origine (in questo caso, è `git.ourcompany.com`), preleva qualsiasi dato che ancora non possiedi, e aggiorna il tuo database locale, spostando il puntatore `origin/master` alla sua nuova, più aggiornata posizione (vedi Figura 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)
 
Figura 3-24. Il comando git fetch aggiorna i tuoi riferimenti remoti.

Avendo più server remoti e volendo vedere come sono i rami remoti per questi progetti esterni, assumiamo che abbia un altro server Git interno che è usato solamente per lo sviluppo di un tuo team. Questo server è `git.team1.ourcompany.com`. Puoi aggiungerlo come una nuova referenza remoto al tuo progetto su cui stai lavorando avviando il comando `git remote add` come visto al Capitolo 2. Nominalo `teamone`, che sarà l'abbreviazione per tutto l'URL (vedi Figura 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)
 
Figura 3-25. Aggiungere un altro server remoto.

Ora, puoi lanciare `git fetch teamone` per prelevare tutto quello che non possiedi dal server remoto `teamone`. Dato che il server ha un sottoinsieme dei dati del server `origin` che già possiedi, Git non va a prendere nessun dato ma imposta un ramo remoto chiamato `teamone/master` a puntare al commit che `teamone` ha come suo ramo `master` (vedi Figura 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)
 
Figura 3-26. Hai un riferimento al ramo principale di teamone posizionato localmente.

## Invio

Quando vuoi condividere un ramo con il mondo, hai bisogno di inviarlo su di un server remoto su cui hai accesso in scrittura. I tuoi rami locali non sono automaticamente sincronizzati sul remoto in cui scrivi — devi esplicitamente dire di inviare il ramo che vuoi condividere. In questo modo, puoi usare rami privati per il lavoro che non vuoi condividere ed inviare solamente i rami su cui vuoi collaborare.

Se hai un ramo chiamato `serverfix` su cui vuoi lavorare con altri, puoi inviarlo nello stesso modo con cui hai inviato il primo ramo. Lancia `git push (remote) (branch)`:

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Questa è una piccola abbreviazione. Git automaticamente espande il nome del ramo `serverfix` to `refs/heads/serverfix:refs/heads/serverfix`, questo significa, “Prendi il mio ramo locale serverfix ed invialo per aggiornare il ramo remoto serverfix.“ Vedremo in modo più approfondito la parte `refs/heads/` nel Capitolo 9, ma puoi generalmente lasciare perdere. Puoi anche fare `git push origin serverfix:serverfix`, che fa la stessa cosa — questo dice, “Prendi il mio serverfix e crea il serverfix remoto.“ Puoi usare questo formato per inviare rami locali in rami remoti che hanno nomi differenti. Se non vuoi chiamare il ramo remoto `serverfix`, puoi avviare `git push origin serverfix:awesomebranch` per inviare il tuo ramo locale `serverfix` in `awesomebranch` sul progetto remoto.

La prossima volta che i tuoi collaboratori preleveranno dal server, avranno un riferimento di dove si trova la versione del server di `serverfix` nel ramo `origin/serverfix`:

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

É importante notare che quando fai un prelievo di un nuovo ramo, non hai automaticamente un ramo locale modificabile. In altre parole, in questo caso, non hai un nuovo ramo `serverfix` — hai solamente il puntatore `origin/serverfix` che non puoi modificare.

Per fondere questo lavoro nel ramo corrente, puoi avviare `git merge origin/serverfix`. Se vuoi il tuo ramo `serverfix` su cui poter lavorare, puoi basarlo sul ramo remoto:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Questo ti fornirà un ramo locale da dove si trovava `origin/serverfix` su cui tu puoi iniziare a lavorare.

## Rami di Monitoraggio

Quando crei e ti sposti in un ramo locale partendo da un ramo remoto crei quello che viene chiamato _ramo di monitoraggio_. Questi sono rami locali che hanno una relazione diretta con il ramo remoto. Se ti trovi su uno di questi rami e dai `git push`, Git automaticamente sa a quale server e ramo inviare i dati. Inoltre, avviando `git pull` mentre si è su uno di questi rami si prelevano tutte le referenze remote ed automaticamente si fa la fusione dei corrispondenti rami remoti.

Quando cloni un repository, generalmente crea automaticamente un ramo `master` che traccia `origin/master`. Questa è la ragione per cui `git push` e `git pull` lavorano senza argomenti dall'inizio. Tuttavia, puoi impostare altri rami di monitoraggio se vuoi — che non monitorano i rami su `origin` e non monitorano il ramo `master`. Il caso più semplice è l'esempio che hai già visto, lancia `git checkout -b [branch] [remotename]/[branch]`. Se hai una versione 1.6.2 o successiva di Git, puoi inoltre usare l'abbreviazione `--track`:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Per impostare un ramo locale con un nome differente rispetto al remoto, puoi facilmente usare la prima versione con un nome locale diverso:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "sf"

Ora il tuo ramo locale sf verrà automaticamente collegato a origin/serverfix.

## Eliminazione di Rami Remoti

Supponiamo che tu stia lavorando con un ramo remoto — diciamo che tu e i tuoi collaboratori avete finito con una funzionalità e l'avete fusa nel ramo remoto `master` (o qualsiasi ramo stabile del progetto). Puoi eliminare un ramo remoto con una sintassi abbastanza ottusa `git push [remotename] :[branch]`. Se vuoi eliminare il ramo `serverfix`, lancia il seguente comando:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Boom. Non c'è più il ramo sul server. Tieni d'occhio questa pagina perché avrai bisogno di questo comando e dimenticherai facilmente la sintassi. Un modo per ricordare questo comando è richiamare la sintassi `git push [remotename] [localbranch]:[remotebranch]` che abbiamo visto precedentemente. Se lasci bianca la porzione `[localbranch]`, stai dicendo, “Non prendere niente dalla mia parte e rendila `[remotebranch]`.“
