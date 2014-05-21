# Annullare le Cose

Ad ogni stadio potresti voler annullare qualcosa. Qui, vedremo alcuni strumenti fondamentali per annullare i cambiamenti che hai fatto. Attenzione, perché non sempre puoi invertire alcuni annullamenti. Questa è una delle aree in Git dove puoi perdere qualche lavoro se sbagli.

## Modificare il Tuo Ultimo Commit

Uno degli annullamenti comuni avviene quando invii troppo presto un commit e magari dimentichi di aggiungere alcuni file, o sbagli il messaggio di commit. Se vuoi provare nuovamente questo commit, puoi lanciare commit con l'opzione `--amend`:

	$ git commit --amend

Questo comando prende la tua area di stage e la usa per il commit. Se non hai fatto cambiamenti dal tuo ultimo commit (per esempio, lanci questo comando subito dopo il tuo commit precedente), allora il tuo snapshot sarà esattamente uguale e potrai cambiare il tuo messaggio di commit.

L'editor per il messaggio del commit apparirà, ma già contiene il messaggio del commit precedente. Puoi modificare il messaggio come sempre, ma sovrascriverà il commit precedente.

Come esempio, se fai il commit e poi realizzi di aver dimenticato un cambiamento nella tua area di stage di un file e vuoi aggiungerlo a questo commit, puoi farlo così:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend

Tutti e tre i comandi finisco in un singolo commit —  il secondo commit riscrive il risultato del primo.

## Disimpegnare un File Staged

Le prossime due sezioni mostrano come gestire le modifiche della tua area di stage e della directory di lavoro. La parte divertente è che il comando che usi per determinare lo stato di queste due aree ricorda come annullare i cambiamenti fatti. Per esempio, supponiamo che hai modificato due file e vuoi inviarli come modifiche separate, ma accidentalmente digiti `git add *` e li parcheggi entrambi. Come puoi disimpegnare uno dei due? Il comando `git status` ti ricorda:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

Ora il testo sotto “Changes to be committed”, dice di usare `git reset HEAD <file>...` per annullare. Così, usa questo avviso per disimpegnare il file benchmarks.rb dal parcheggio:

	$ git reset HEAD benchmarks.rb
	benchmarks.rb: locally modified
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Il comando è un po' strano, ma funziona. Il file benchmarks.rb è modificato ma non parcheggiato.

## Annullare le Modifiche di un File Modificato

Come fare se hai realizzato che non vuoi più tenere le modifiche che hai fatto al file `benchmarks.rb`? Come puoi annullarle facilmente — ritornare a come era al tuo ultimo commit (o alla clonazione iniziale, o come lo avevi nella tua directory di lavoro)? Fortunatamente, `git status` ci dice come farlo. Nell'ultimo output di esempio, l'area di unstage (file non parcheggiati) assomiglia a:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Ci dice abbastanza esplicitamente come annullare le modifiche fatte (al limite, le nuove versioni di Git, 1.6.1 e successive, lo fanno —  se hai una versione più vecchia è raccomandato aggiornarla per avere queste funzioni utili). Vediamo cosa ci dice:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Puoi vedere come le modifiche sono state annullate. Dovresti inoltre realizzare che è un comando pericoloso: ogni cambiamento fatto al file è sparito — semplicemente hai copiato un altro file su di esso. Non usare mai questo comando a meno che non sai assolutamente che non vuoi il file. Se hai bisogno solamente di toglierlo di torno, vedremo ripostigli e ramificazioni nei capitoli successivi ; queste sono generalmente le vie migliori da seguire.

Ricorda, qualsiasi cosa che è stata affidata a Git può quasi sempre essere recuperata. Tutti i commit che erano su rami che sono stati cancellati o sovrascritti tramite un commit `--amend` possono essere recuperati (vedi il *Capitolo 9* per il recupero dei dati). Tuttavia, qualsiasi cosa che perdi e che non è stata affidata a Git probabilmente non sarà mai più visto.
