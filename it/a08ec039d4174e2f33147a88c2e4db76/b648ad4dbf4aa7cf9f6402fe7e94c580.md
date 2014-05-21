# Vedere la Storia dei Commit

Dopo che hai creato un po' di commit, o se hai clonato un repository che contiene una storia di commit, probabilmente vuoi guardare indietro per vedere cosa è successo. Lo strumento base e più potente per farlo è il comando `git log`.

Questi esempi usano un progetto veramente semplice chiamato simplegit che è spesso usato per le dimostrazioni. Per ottenere il progetto, lancia:

	git clone git://github.com/schacon/simplegit-progit.git

Quando lanci `git log` in questo progetto, dovresti avere un output che assomiglia a questo:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

In modo predefinito, senza argomenti, `git log` mostra i commit fatti nel repository in ordine cronologico inverso. Così, il commit più recente è mostrato all'inizio. Come puoi vedere, questo comando elenca ogni commit con il suo codice SHA-1, il nome dell'autore e la sua e-mail, la data di scrittura ed il messaggio di invio.

Un enorme numero e varietà di opzioni da passare al comando `git log` sono disponibili per vedere esattamente cosa si sta cercando. Qui, vedremo alcune opzioni più usate.

Una delle opzioni più utili è `-p`, che mostra l'introduzione del diff di ogni commit. Puoi anche usare `-2`, che limita l'output solamente agli ultimi due ingressi: 

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,7 +5,7 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Questa opzione visualizza le stessi informazioni ma direttamente seguita dal diff di ogni voce. Questo è veramente utile per la revisione del codice o per sfogliare velocemente cosa è successo in una serie di commit che un collaboratore ha aggiunto.

Qualche volta è più semplice controllare i cambiamenti per parole piuttosto che per linee. Esiste un'opzione `--word-diff` disponibile in Git, che puoi aggiungere al comando `git log -p` per ottenere un word diff (differenza per parole, ndt) invece del normale diff linea per linea. Il formato Word diff è piuttosto inutile quando applicato al codice sorgente, ma diviene utile quando applicato a grandi file di testo, come libri o la tua dissertazione. Ecco un esempio:

	$ git log -U1 --word-diff
	commit da734f4151c0bf92798edd67fb571f86ab4179e6
	Author: Jed Hartman <jhartman@google.com>
	Date:   Tue Mar 19 18:00:35 2013 -0700

	    Added a missing "in" to a sentence.

	diff --git a/en/01-chapter2.markdown b/en/01-chapter2.markdown
	index 879e48c..a992ff3 100644
	--- a/en/01-chapter2.markdown
	+++ b/en/01-chapter2.markdown
	@@ -553,3 +553,3 @@ You may be wondering what the difference is

	This option adds a nice little ASCII graph showing your branch and merge history, which we can see {+in+} our copy of the Grit project repository:

Come puoi vedere, non ci sono linee aggiunte o rimosse in questo output come in un normale diff. Invece i cambiamenti sono mostrati sulla linea. Puoi vedere la parola racchiusa in `{+ +}` (parole rimosse sarebbe state mostrate come `[-removed-]`). Potresti anche volere ridurre le solite tre linee di contesto nell'output di diff a solo una linea, dato che il contesto è ora costituito da parole, non linee. Puoi farlo con `-U1` come abbiamo fatto nell'esempio qui sopra.

Puoi anche usare una serie di opzioni di riassunto con `git log`. Per esempio, se vuoi vedere alcune statistiche brevi per ogni commit, puoi usare l'opzione `--stat`:

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Come puoi vedere, l'opzione `--stat` stampa sotto ogni voce di commit una lista dei file modificati, quanti file sono stati modificati, e quante linee in questi file sono state aggiunte o rimosse. Inoltre aggiunge un resoconto delle informazioni alla fine.
Un'altra opzione veramente utile è `--pretty`. Questa opzione modifica gli output di log per la formattazione rispetto a quella predefinita. Alcune opzioni pre-costruite sono pronte all'uso. L'opzione  `oneline` stampa ogni commit in una singola linea, che è utile se stai guardando una lunga serie di commit. In aggiunta le opzioni `sort`, `full` e `fuller` mostrano l'output pressapoco nello stesso modo ma con più o meno informazioni, rispettivamente:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

L'opzione più interessante è `format`, che ti permette di specificare la tua formattazione dell'output di log. Questa è specialmente utile quando stai generando un output da analizzare su una macchina —  perché specifichi in modo preciso il formato, sai che non cambierà con gli aggiornamenti di Git:

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

La Tabella 2-1 elenca alcune delle opzioni più utili da usare.

	Opzione	Descrizione dell'output
	%H	Hash commit
	%h	Hash commit abbreviato
	%T	Hash tree
	%t	Hash tree abbreviato
	%P	Hash genitore
	%p	Hash genitore abbreviati
	%an	Nome autore
	%ae	E-mail autore
	%ad	Data autore (rispetta il formato dell'opzione –date= )
	%ar	Data autore, relativa
	%cn	Nome di chi ha fatto il commit
	%ce	E-mail di chi ha fatto il commit
	%cd	Data di chi ha fatto il commit
	%cr	Data di chi ha fatto il commit, relativa
	%s	Oggetto

Sarai sorpreso dalla differenza tra _author_ (l'autore) e _committer_ (chi ha eseguito il commit). L'autore è la persona che ha scritto originariamente il lavoro, mentre chi ha eseguito il commit è la persona che per ultima ha applicato il lavoro. Così, se invii una patch ad un progetto ed uno dei membri del progetto applica la patch, entrambi sarete riconosciuti — tu come l'autore ed il membro del progetto come colui il quale ha eseguito il commit. Scopriremo meglio questa distinzione nel Capitolo 5.

Le opzioni oneline e format sono particolarmente utili con un'altra opzione `log` chiamata `--graph`. Questa opzione aggiunge un grafico ASCII carino che mostra le diramazioni e le unioni della storia, che possiamo vedere nella copia del repository del progetto Grit:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Queste sono solo alcune opzioni semplici per la formattazione dell'output di `git log` — ce ne sono altre. La tabella 2-2 elenca le opzioni che abbiamo visto prima e altre opzioni comunemente usate che possono essere utili per cambiare l'output del comando log.

	Opzione	Descrizione
	-p	Mostra la patch introdotta per ogni commit.
	--word-diff	Mostra la patch nel formato word diff.
	--stat	Mostra le statistiche per i file modificati in ogni commit.
	--shortstat	Mostra solo le linee cambiate/inserite/cancellate dal comando --stat.
	--name-only	Mostra la lista dei file modificati dopo le informazione del commit.
	--name-status	Mostra la lista dei file con le informazioni di aggiunte/modifiche/rimozioni.
	--abbrev-commit	Mostra solo i primi caratteri del codice checksum SHA-1 invece di tutti e 40.
	--relative-date	Mostra la data in un formato relativo (per esempio, "2 week ago", "2 settimane fa") invece di usare l'intero formato della data.
	--graph	Mostra un grafico ASCII dei rami e delle unioni della storia accando all'output di log.
	--pretty	Mostra i commit in un formato alternativo. L'opzione include oneline, short, full, fuller, e format (dove hai specificato la tua formattazione).
	--oneline	Un'opzione di convenienza abbreviazione per `--pretty=oneline --abbrev-commit`.

## Limitare l'Output di Log

Oltre alle opzioni per la formattazione dell'output, git log accetta un numero di opzioni di limitazione — cioè, opzioni che ti permettono di vedere solo alcuni commit. Hai già visto una opzione del genere — l'opzione `-2`, che mostra solamente gli ultimi due commit. Infatti, puoi fare `-<n>`, dove `n` è un intero per vedere gli ultimi `n` commit. In realtà, non userai spesso questa possibilità, perché Git di base veicola tutti gli output attraverso un impaginatore così vedrai solamente una pagina di log alla volta.

Ovviamente, le opzioni di limitazione temporali come `--since` e `--until` sono molto utili. Per esempio, questo comando prende la lista dei commit fatti nelle ultime due settimane:

	$ git log --since=2.weeks

Questo comando funziona con molti formati —  puoi specificare una data (“2008-01-15”) o una data relativa come “2 years 1 day 3 minutes ago”.

Puoi inoltre filtrare l'elenco dei commit che corrispondono a dei criteri di ricerca. L'opzione `--author` ti permette di filtrare uno specifico autore e l'opzione `--grep` permette di cercare delle parole chiave nei messaggi dei commit. (Nota che se vuoi specificare sia le opzioni author e grep, devi aggiungere `--all-match` o il comando ricercherà i commit sia di uno sia di quell'altro.)

L'ultima opzione di filtro veramente utile da passare a `git log` è un percorso.  Se specifichi una directory o un nome di file, puoi limitare l'output del log ai commit che introducono modifiche a questi file. E' sempre l'ultima opzione fornita ed è generalmente preceduta dal doppio meno (`--`) per separare i path dalle opzioni.

Nella tabella 2-3 vediamo una lista di riferimento di queste e di altre opzioni comuni.

	Opzioni	Descrizione
	-(n)	Vedi solo gli ultimi n commit
	--since, --after	Limita ai commit fatti prima o dopo una data specificata.
	--until, --before	Limita ai commit fatti prima o fino ad una specifica data.
	--author	Visualizza solo i commit in cui l'autore corrisponde alla stringa specificata.
	--committer	Visualizza solo i commit dove chi ha eseguito il commit corrisponde alla stringa specificata.

Per esempio, se vuoi vedere quali commit modificano i file nella storia del codice sorgente di Git dove Junio Hamano ha eseguito i commit  e non sono stati unificati nel mese di Ottobre del 2008, puoi lanciare qualcosa di simile a:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Ci sono circa 20,000 commit nella storia del codice sorgente di git, questo comando mostra 6 righe corrispondenti ai termini di ricerca.

## Usare una GUI per Visualizzare la Storia

Se vuoi usare uno strumento più grafico per visualizzare la storia dei tuoi commit, puoi vedere un programma in Tck/Tk chiamato gitk che è distribuito con Git. Gitk è fondamentalmente uno strumento visuale come `git log`, e accetta circa tutte le opzioni di filtro che `git log` ha. Se digiti gitk dalla riga di comando del tuo progetto, dovresti vedere qualcosa di simile alla Figura 2-2.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Figura 2-2. Il visualizzatore della storia gitk.

Puoi vedere la storia dei commit nella metà alta della finestra con un grafico genealogico. La finestra di diff nella metà inferiore mostra i cambiamenti introdotti ad ogni commit che selezioni.
