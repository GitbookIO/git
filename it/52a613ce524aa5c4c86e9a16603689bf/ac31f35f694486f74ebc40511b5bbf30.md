# Le specifiche di riferimento (*refspec*)

In questo libro abbiamo sempre usato delle semplici mappature, dai branch remoti ai riferimenti locali, ma possono essere anche molto più complessi.
Immagina di aggiungere un repository remoto:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

Questo aggiunge una sezione al tuo `.git/config` specificando, del repository remoto, il nome (`origin`), l’URL e le specifiche di riferimento per ottenere le modifiche remote:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

Il formato delle specifiche di riferimento è un `+` (opzionale) seguito da `<src>:<dst>`, dove `<src>` è lo schema per i riferimenti remoti e `<dst>` per gli stessi salvati in locale. Il `+` dice a Git di aggiornare i riferimenti anche se non si tratta di un avanti-veloce (*fast-forward*).

Nel caso predefinito, che viene scritto da git quando si usa il comando `git remote add`, Git recupera tutti i riferimenti sul server di `refs/heads/` e li scrive localmente in `refs/remotes/origin/`. Quindi, se hai un branch `master` sul server, puoi accedere localmente al log di questo branch così:

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

Sono tutti equivalenti perché Git li espande tutti a `refs/remotes/origin/master`.

Se vuoi, invece di scaricare tutti i branch dal server, Git può scaricare solo il `master` cambiando la riga del fetch così

	fetch = +refs/heads/master:refs/remotes/origin/master

Questa è la specifica di riferimento predefinito per questo repository remoto quando si esegue il comando `git fetch`. Se vuoi fare qualcosa una sola volta, puoi sempre specificare le specifiche di riferimento alla riga di comando. Per fare un *pull* del `master` sul repository remoto dal branch locale `origin/mymaster`, puoi eseguire

	$ git fetch origin master:refs/remotes/origin/mymaster

Puoi anche specificare più specifiche di riferimento alla riga di comando, per fare una *pull* di più branch allo stesso tempo:

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

In questo caso la *pull* verso il master è stata rifiutata perché non era un riferimento *fast-forward*. Puoi modificare questo comportamento aggiungendo un `+` prima delle specifiche di riferimento.

Puoi anche specificare più specifiche di riferimento nel tuo file di configurazione. Se vuoi prendere sempre il master e il branch sperimentale puoi aggiungere queste due righe:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Non puoi usare schemi parziali, e quindi l’impostazione seguente non è valida:

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

Ma puoi usare la nomenclatura per ottenere lo stesso risultato. Se hai un gruppo di QA che faccia la *push* di una serie di branch e tu vuoi prendere il master e qualsiasi branch del gruppo di QA e nient’altro, puoi usare questa configurazione:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

Se hai un flusso di lavoro complesso, dove il gruppo di QA e gli sviluppatori fanno la *push* di branch e il gruppo d’integrazione che fa la push e collabora su branch remoti, puoi enumerarli facilmente come abbiamo appena visto.

## Le push con le specifiche di riferimento

È bello che tu possa nominare i riferimenti in questo modo, ma come fanno, in primo luogo, i membri del gruppo di QA a mettere i loro branch in `qa/`? Puoi farlo usando le specifiche di riferimento anche per la *push*.

Se il gruppo di QA vuole fare la *push* del loro `master` in `qa/master` sul server remoto, possono eseguire

	$ git push origin master:refs/heads/qa/master

Se vogliono che Git lo faccia automaticamente ogni volta che eseguano `git push origin` basta che aggiungano una riga `push` al loro file di configurazione:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

Questo fa si che eseguendo `git push origin`, Git faccia sempre una *push* del `master` locale in `qa/master` del server remoto.

## Eliminare i riferimenti

Puoi usare le specifiche di riferimento anche per eliminare dei riferimenti ai server remoti:

	$ git push origin :topic

Poiché il formato delle specifiche è `<src>:<dst>`, omettendo la parte `<src>` è come dire che il branch remoto è “niente” e quindi lo si cancella.
