# I riferimenti di Git

Puoi eseguire un comando come `git log 1a410e` per vedere la cronologia completa, ma devi
comunque ricordarti che quel `1a410e` è l'ultima commit, per poter essere in grado di vedere la cronologia e trovare quegli oggetti. Hai bisogno di un file nel quale potete salvare il valore dello SHA-1 attribuendogli un semplice nome in modo da poter usare quel nome al posto del valore SHA-1 grezzo.

In Git questi sono chiamati "riferimenti" o "refs”: puoi trovare i file che contengono gli hash SHA-1
nella directory `.git/refs`. Nel nostro progetto questa directory non contiene files ma una semplice struttura:

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

Per creare un nuovo riferimento che ti aiuterà a ricordare dov'è la tua ultima commit, tecnicamente puoi una cosa molto semplice come questo:

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

Ora puoi usare il riferimento appena creato al posto del valore SHA-1 nei tuoi comandi Git:

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 terza commit
	cac0cab538b970a37ea1e769cbbde608743bc96d seconda commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d prima commit

Questo però non ti incoraggia a modificare direttamente i file di riferimento. Git fornisce un comando sicuro per farlo se vuoi aggiornare un riferimento, chiamato `update-ref`:

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

Questo è quello che si definisce branch in Git: un semplice puntatore o riferimento all’intestazione di un flusso di lavoro. Per creare un branch con la seconda commit, così:

	$ git update-ref refs/heads/test cac0ca

Il tuo branch conterrà solo il lavoro da quella commit in poi:

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d seconda commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d prima commit

Ora, il tuo database Git assomiglia concettualmente alla Figura 9-4.


![](http://git-scm.com/figures/18333fig0904-tn.png)
 
Figura 9-4. La directory degli oggetti Git directory con inclusi i riferimenti branch e head.

Quando esegui comandi come `git branch (branchname)`, Git in realtà esegue il comando `update-ref` per
aggiungere lo SHA-1 dell'ultima commit del branch nel quale siete, in qualsiasi nuovo riferimento vogliate creare.

## Intestazione

La questione ora è questa: quando esegui `git branch (branchname)`, come fa Git a conoscere lo SHA-1 dell'ultima commit?  La risposta è nel file HEAD. Il file HEAD è un riferimento simbolico al branch corrente. Per riferimento simbolico intendo che, a differenza di un normale riferimento, normalmente non contiene un valore SHA-1 quanto piuttosto un puntatore a un altro riferimento. Se esamini il file vedrai qualcosa come questa:

	$ cat .git/HEAD 
	ref: refs/heads/master

Se esegui `git checkout test`, Git aggiorna il file così:

	$ cat .git/HEAD 
	ref: refs/heads/test

Quando esegui `git commit`, questo crea l'oggetto commit specificando il padre dell'oggetto commit in modo che sia un hash SHA-1 a cui fa riferimento l’HEAD.

Puoi modificare manualmente questo file, ma, di nuovo, esiste un comando più sicuro per farlo: `symbolic-ref`. Puoi leggere il valore del tuo HEAD tramite questo comando:

	$ git symbolic-ref HEAD
	refs/heads/master

Puoi anche impostare il valore di HEAD:

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD 
	ref: refs/heads/test

Non puoi impostare un riferimento simbolico al di fuori dei refs:

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## Tag

Hai appena visto i tre tipi principali di oggetti in Git, ma ce n'è anche un quarto. L'oggetto tag è molto simile a un oggetto commit: contiene un tag, una data, un messaggio ed un puntatore. La differenza principale sta nel fatto che un tag punta a una commit piuttosto che a un albero. E' come un riferimento a un branch, ma non si muove mai: punta sempre alla stessa commit e gli da un nome più amichevole.

Come discusso nel Capitolo 2, ci sono due tipi di tag: annotati (*annotated*) e leggeri (*lightweight*). Puoi creare un tag *lightweight* eseguendo un comando come questo:

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

Questo è tag *lightweight*: un branch che non si muove mai. Un tag annotato è però più complesso. Se crei un tag annotato, Git crea un oggetto tag e scrive un riferimento a cui puntare, piuttosto di puntare direttamente alla commit. Puoi vederlo creando un tag annotato (`-a` specifica che si tratta di un tag annotato):

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 –m 'test tag'

Questo è il valore SHA-1 dell'oggetto creato:

	$ cat .git/refs/tags/v1.1 
	9585191f37f7b0fb9444f35a9bf50de191beadc2

Ora, esegui il comando `cat-file` su questo hash SHA-1:

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

Noterai che l'oggetto punta all’hash SHA-1 della commit che hai taggato. Nota anche che non ha bisogno di puntare ad una commit: puoi taggare qualsiasi oggetto di Git. Nei sorgenti di Git, per esempio, il mantenitore ha aggiunto la sua chiave pubblica GPG come oggetto blob e lo ha taggato. Puoi vedere la chiave pubblica eseguendo

	$ git cat-file blob junio-gpg-pub

nei sorgenti di Git. Anche il kernel di Linux ha un oggetto tag che non punta ad una commit: il primo tag creato punta all'albero iniziale dell'import dei sorgenti.

## Riferimenti remoti

Il terzo tipo di riferimento che vedremo è il riferimento remoto. Se aggiungi un repository remoto e poi fai una push, Git salva il valore del quale avete fatto la push, per ogni branch, nella directory `refs/remotes`. Puoi per esempio aggiungere un repository remote di nome `origin`e fare la push del tuo branch `master`:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

E puoi vedere quale era il branch `master` del repository remoto `origin` l'ultima volta che hai comunicato con il server esaminando il file `refs/remotes/origin/master`:

	$ cat .git/refs/remotes/origin/master 
	ca82a6dff817ec66f44342007202690a93763949

I riferimenti remoti differiscono dai branch (riferimenti in `refs/heads`) principalmente per il fatto
che non è possibile fare il checkout di quest'ultimi. Git li sposta come segnalibri affinché corrispondano all'ultimo stato conosciuto di quei branch sul server.
