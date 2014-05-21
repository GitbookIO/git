# Moduli

Capita spesso che, mentre stai lavorando a un progetto, debba includerne un altro. Potrebbe essere una libreria sviluppata da terze parti o che tu stai sviluppando separatamente e lo stai usando in vari super-progetti. In questi casi si pone un problema comune: si vuole essere in grado di trattare i due progetti separatamente ma essere tuttavia in grado di utilizzarne uno all'interno dell'altro.

Vediamo un esempio. Immagina di stare sviluppando un sito web creando dei feed Atom e, invece di scrivere da zero il codice per generare il contenuto Atom, decidi di utilizzare una libreria. Molto probabilmente dovrai includere del codice da una libreria condivisa come un’installazione di CPAN o una gem di Ruby, o copiare il sorgente nel tuo progetto. Il problema dell’includere la libreria è che è difficile personalizzarla e spesso più difficile da distribuire, perché è necessario assicurarsi che ogni client abbia a disposizione quella libreria. Il problema di includere il codice nel tuo progetto è che è difficile incorporare le modifiche eventualmente fatte nel progetto iniziale quando questo venisse aggiornato.

Git risolve questo problema utilizzando i moduli. I moduli consentono di avere un repository Git come una directory di un altro repository Git, che ti permette di clonare un altro repository nel tuo progetto e mantenere le commit separate.

## Lavorare con i moduli

Si supponga di voler aggiungere la libreria Rack (un’interfaccia gateway per server web in Ruby) al progetto, mantenendo le tue modifiche alla libreria e continuando a integrare le modifiche fatte a monte alla libreria. La prima cosa da fare è clonare il repository esterno nella subdirectory: aggiungi i progetti esterni come moduli col comando `git modulo aggiungono`:

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.

Ora, all'interno del tuo progetto, hai la directory `rack` che contiene il progetto Rack. Puoi andare in questa directory, fare le tue modifiche e aggiungere il tuo repository remoto per fare la push delle tue modifiche e prendere quelle disponibili, così come incorporare le modifiche del repository originale, e molto altro. Se esegui `git status` subito dopo aver aggiunto il modulo, vedrai due cose:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

Prima di tutto nota il file `.gitmodules`: è un file di configurazione che memorizza la mappatura tra l’URL del progetto e la directory locale dove lo hai scaricato:

	$ cat .gitmodules
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

Se hai più di un modulo, avrei più voci in questo file. È importante notare che anche questo file è versionato con tutti gli altri file, come il tuo `.gitignore` e viene trasferito con tutto il resto del tuo progetto. Questo è il modo in cui gli altri che clonano questo progetto sanno dove trovare i progetti dei moduli.

L'altro elenco in stato git uscita `git status` è la voce rack. Se si esegue `git diff` su questo, si vede qualcosa di interessante:

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Sebbene `rack` sia una subdirectory della tua directory di lavoro, Git lo vede come un modulo e non tiene traccia del suo contenuto quando non sei in quella directory. Git invece lo memorizza come una commit particolare da quel repository. Quando committi delle modifiche in quella directory, il super-project nota che l’HEAD è cambiato e registra la commit esatta dove sei; In questo modo, quando altri clonano questo progetto, possono ricreare esattamente l'ambiente.

Questo è un punto importante con i moduli: li memorizzi come la commit esatta dove sono. Non puoi memorizzare un modulo su `master` o qualche altro riferimento simbolico.

Quando committi vedi una cosa simile:

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

Nota il modo 160000 di ogni voce di rack. Questo è un modo speciale di Git che significa che stai memorizzando una commit per una directory piuttosto che una subdirectory o un file.

Puoi trattare la directory `rack` come un progetto separato e puoi aggiornare occasionalmente il tuo super-project con un puntatore all’ultima commit del sotto-project. Tutti i comandi di Git lavorano indipendentemente nelle due directories:

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

## Clonare un progetto con moduli

Cloneremo ora un progetto con dei moduli. Quando ne ricevi uno, avrai una directory che contiene i moduli, ma nessun file:

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

La directory `rack` c’è, ma è vuota. Devi eseguire due comandi: `git submodule init` per inizializzare il tuo file di configurazione locale e `git submodule update` per scaricare tutti i dati del progetto e scaricare le commit opportune elencate nel tuo super-progetto:

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

Ora la tua directory `rack` è nello stesso stato in cui era quando hai committal precedentemente. Se qualche altro sviluppatore facesse delle modifiche a rack e le committasse, quando tu scaricherai quel riferimento e lo integrerai nel tuo repository vedrai qualcosa di strano:

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

Quello di cui hai fatto il merge è fondamentalmente un cambiamento al puntatore del tuo modulo, ma non aggiorna il codice nella directory del modulo e sembra quindi che la tua directory di lavoro sia in uno stato ‘sporco’:

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Questo succede perché il tuo puntatore del modulo non è lo stesso della directory del modulo. Per correggerlo devi eseguire di nuovo `git submodule update` again:

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

E devi farlo ogni volta che scarichi delle modifiche al modulo nel progetto principale: è strano, ma funziona.

Un problema comune si verifica quando uno sviluppatore fa delle modifiche in un modulo ma non le trasmette al server pubblico, ma committa il puntatore a questo stato quando fa la pusg del superproject. Quando altri sviluppatori provano ad eseguire `git submodule update`, il sistema del modulo non riesce a trovare la commit a cui fa riferimento perché esiste solo sul sistema del primo sviluppatore. Quando ciò accade, viene visualizzato un errore come questo:

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

Devi quindi vedere chi è stato l’ultimo a cambiare il modulo:

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

e mandarmi un’email e cazziarlo.

## Super-progetto

A volte gli sviluppatori vogliono scaricare una combinazione di subdirectory di un progetto grande, a seconda del team in cui lavorano. Questo è comune se vieni da CVS o Subversion, dove hai definito un modulo o un insieme di subdirectory e vuoi mantenere questo tipo di flusso di lavoro.

Un buon modo per farlo in Git è quello di rendere ciascuna sottodirectory un repository Git separato e creare quindi un repository Git con il super-progetto che contenga più moduli. Un vantaggio di questo approccio è che puoi definire meglio i rapporti tra i progetti con tag e branch nei super-progetti.

## Issues with Submodules

Usare i moduli può comunque presentare qualche intoppo. Prima di tutto devi fare molta attenzione quando lavori nella directory del modulo. Quando esegui `git submodule update`, viene fatto il checkout della versione specifica del progetto, ma non del branch. Questo viene detto “avere l’HEAD separato: significa che il file HEAD punta direttamente alla commit, e non un riferimento simbolico. Il problema è che generalmente non vuoi lavorare in un ambiente separato perché è facile perdere commit, e non un riferimento simbolico. Il problema è che generalmente non vuoi lavorare in un ambiente separato perché è facile perdere le tue modifiche. Se inizi col comando `submodule update` e poi fai una commit nella directory del modulo senza aver creato prima un branch per lavorarci e quindi esegui una `git submodule update` dal super-progetto senz’aver committato nel frattempo, Git sovrascriverà le tue modifiche senza dirti nulla.  Tecnicamente non hai perso il tuo lavoro, ma non avendo nessun branch che vi punti sarà difficile da recuperare.

Per evitare questo problema ti basta creare un branch quando lavori nella directory del modulo con `git checkout -b work` o qualcosa di equivalente. Quando successivamente aggiorni il modulo il tuo lavoro sarà di nuovo sovrascritto, ma avrai un puntatore per poterlo recuperare.

Cambiare branch in progetti con dei moduli può essere difficile. Se crei un nuovo branch, vi aggiungi un modulo e torni a un branch che non abbia il modulo, ti ritroverai la directory del modulo non ancora tracciata:

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/

Devi rimuoverla o spostarla e in entrambi i casi dovrai riclonarla quando torni al branch precedente e puoi quindi perdere le modifiche locali o i branch di cui non hai ancora fatto una push.

L'ultima avvertimento riguarda il passaggio da subdirectory a moduli. Se stai versionando dei file tuo nel progetto e vuoi spostarli in un modulo, è necessario devi fare attenzione, altrimenti Git si arrabbierà. Supponi di avere i file di rack in una directory del tuo progetto e decidi di trasformarla in un modulo. Se elimini la directory ed esegui il comando `submodule add`, Git ti strillerà:

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

Devi prima rimuovere la directory `rack` dalla tua area di staging per poter quindi aggiungerla come modulo:

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.

Immagina ora di averlo fatto in un branch. Se ora torni a un branch dove quei file sono ancora nell’albero corrente piuttosto che nel modulo vedrai questo errore:

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.
	(errore: il file 'rack/AUTHORS' non è versionato e sarà sovrascritto)

Devi quindi spostare la directory del modulo `rack` prima di poter tornare al branch che non ce l’aveva:

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

Ora, quando tornerai indietro, troverai la directory `rack` vuota. Ora puoi eseguire `git submodule update` per ripopolarla o rispostare la directory `/tmp/rack` nella directory vuota.
