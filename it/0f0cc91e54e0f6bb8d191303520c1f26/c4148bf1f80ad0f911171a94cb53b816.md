# Migrare a Git

Se hai un repository esistente con i tuoi sorgenti su un altro VCS ma hai deciso di iniziare a usare Git, devi migrare il tuo progetto. Questa sezione descrive prima alcuni strumenti inclusi in Git per i sistemi più comuni e poi spiega come sviluppare un tuo strumento personalizzato per l'importazione.

## Importare

Imparerai ad importare i dati dai due principali sistemi professionali di SCM (Subversion e Perforce) sia perché rappresentano la maggioranza dei sistemi da cui gli utenti stanno migrando a Git, sia per l'alta qualità degli strumenti distribuiti con Git per entrambi i sistemi.

## Subversion

Se hai letto la sezione precedente `git svn`, puoi facilmente usare quelle istruzioni per clonare un repository con `git svn clone` e smettere di usare il server Subversion, iniziando a usare il nuovo server Git facendo le push direttamente su quel server. Puoi ottenere la cronologia completa di SVN con una semplice pull dal server Subversion (che può però richiedere un po' di tempo).

L'importazione però non è perfetta, ma poiché ci vorrà del tempo la si può fare nel modo giusto. In Subversion, ogni persona che committa qualcosa ha un utente nel sistema, e questa informazione è registrata nella commit stessa. Gli esempi della sezione precedente mostrano in alcune parti `schacon`, come per gli output di `blame` e `git svn log`. Se vuoi mappare le informazioni degli utenti Subversion sugli autori in Git devi creare un file chiamato `users.txt` che esegue la mappatura secondo il formato seguente:

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

Per ottenere la lista usata da SVN per gli autori puoi eseguire il comando seguente:

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

Che ti restituisce in output una lista in XML dove puoi cercare gli autori e crearne una lista univoca, eliminando il resto dell'XML (ovviamente questo comando funziona solo su una macchina che abbia installato `grep`, `sort` e `perl`) e quindi redigendo l'output nel file users.txt, così che puoi aggiungere le informazioni sugli autori per ogni commit.

Puoi fornire questo file a `git svn` per aiutarlo a mappare gli autori con maggiore precisione. Ma puoi anche dire a `git svn` di non includere i metadata che normalmente Subversion importa, con l'opzione `--no-metadata` ai comandi `clone` o `init`. Il che risulterà in un comando di `import` come il seguente:

	$ git svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

Dovresti ora avere un import di Subversion, nella cartella `my_project`, più carino. Invece di avere delle commit che appaiono così

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029

appariranno così:

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

Non solo il campo dell'autore avrà delle informazioni migliori, ma non ci sarà più nemmeno `git-svn-id`.

C'è bisogno di fare un po' di pulizia `post-import`. Da una parte dovrai eliminare i riferimenti strani che `git svn` crea. Prima di tutto dovrai spostare i tag in modo che siano davvero dei tag e non degli strani branch remoti, e poi sposterai il resto dei branch, così che siano locali e non appaiano più come remoti.

Per spostare i tag perché siano dei veri e propri tag di Git devi eseguire:

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

Questo comando prende i riferimenti ai branch remoti che inizino per `tag/` e li rende veri (lightweight) tags.

Quindi sposta il resto dei riferimenti sotto `refs/remotes` perché siano branch locali:

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

Ora tutti i branch precedenti sono veri branch di Git, e tutti i tag sono veri tag di Git. L'ultima cosa da fare è aggiungere il nuovo server Git come un server remoto e fare il push delle modifiche. Qui di seguito c'è l'esempio per definire il server come un server remoto:

	$ git remote add origin git@my-git-server:myrepository.git

Poiché vuoi che tutti i tuoi branch e i tag siano inviati al server, devi eseguire questi comandi:

	$ git push origin --all
	$ git push origin --tags

Ora tutti i tuoi branch e i tag dovrebbero essere sul tuo server Git, con una importazione pulita e funzionale.

## Perforce

Il successivo strumento analizzato è Perforce. Una importazione da Perforce viene anche distribuita con Git. Se stai usando una versione di Git precedente alla 1.7.11, lo strumento per l’importazione è disponibile esclusivamente nella sezione `contrib` dei sorgenti di Git. In questo caso dovrai ottenere i sorgenti di git che puoi scaricare da git.kernel.org:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

Nella directory `fast-import` dovresti trovare uno script Python chiamato `git-p4`. Dovrai avere Python e l’applicazione `p4` installati sulla tua macchina perché questa importazioni funzioni. Per esempio importeremo il progetto Jam dal repository pubblico di Perforce. Per configurare il tuo client, devi esportare la variabile ambientale P4PORT perché punti al Perforce Public Depot:

	$ export P4PORT=public.perforce.com:1666

Esegui quindi il comando `git-p4 clone` per importare il progetto Jam dal server di Perforce, fornendo i percorsi del repository, del progetto e della directory locale dove vuoi che venga importato il progetto:

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

Se ora vai nella cartella `/opt/p4import` ed esegui `git log`, vedrai che la tua importazione è completa:

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

Puoi vedere l’identification `git-p4` in ogni commit. Va bene mantenere questo identificativo nel caso servisse fare riferimento al numero di versione di Perforce in un secondo momento. Ma se vuoi rimuovere questo identification questo è il momento giusto per farlo, ovvero prima che iniziate a lavorare col nuovo repository. Per farlo puoi usare il comando `git filter-branch` per rimuovere le righe identificative in un solo passaggio:

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

Se esegui ora il comando `git log` vedrai che i checksum SHA-1 per le commit sono cambiati, questo perché le stringhe di `git-p4` non ci sono più nei messaggi delle commit:

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

La tua importazione è ora pronta per essere inviata al server Git con una push.

## Un’importazione personalizzata

Se non usi né Subversion né Perforce dovresti cercare online se esista uno strumento d’importazione per il tuo sistema. Ce ne sono di buona qualità per CVS, Clear Case, Visual Source Safe e perfino per una directory di archivi. Se nessuno di questi strumenti funzionasse per il tuo caso significa che hai uno strumento abbastanza raro o se necessiti di una maggiore personalizzazione per l’importazione, dovresti usare `git fast-import`. Questo comando legge delle semplici istruzioni dallo standard input per scrivere dati di Git specifici. È molto più semplice creare degli oggetti di Git con questo strumento piuttosto che usare comandi raw di Git (v. Capitolo 9 per maggiori informazioni). In questo modo potrai scrivere uno script d’importazione che legga le informazioni necessarie dal sistema da cui vuoi importare i dati e le scriva sullo standard output, in modo che Git le legga attraverso `git fast-import`.

Per dimostrare velocemente quanto detto, scriveremo uno semplice script d’importazione. Supponiamo di lavorare in current e che di tanto in tanto fai il backup del progetto copiando la directory in una di backup con il timestamp nel nome (per esempio: `back_YYYY_MM_DD`), e vuoi importare il tutto in Git. La struttura delle tue directory sarà simile a questa:

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

Per importare la directory in Git, devi rivedere come Git gestisce i suoi dati. Come ricorderai, Git è fondamentalmente una lista collegata di oggetti commit che puntano a una versione istantanea del progetto. Tutto quello che devi fare è dire a `fast-import` quali sono le istantanee, quale commit punta alle istantanee e il loro ordine. La strategia che adotteremo sarà andare da un’istantanea all’altra e creare tante commit con il contenuto di ciascuna directory, collegando ciascuna commit alla precedente.

Come hai fatto nell’esempio del Capitolo 7, scriveremo questo script in Ruby, perché è lo strumento con cui io generalmente lavoro e tende ad essere semplice da leggere. Puoi comunque scrivere questo esempio facilmente in qualsiasi linguaggio con cui tu abbia familiarità: deve solamente scrivere le informazioni corrette sullo standard output. Se lavori su Windows devi fare attenzione che non aggiunga un ritorno (CR) alla fine delle righe, perché `git fast-import` richiede specificatamente che ci sia solo un ritorno unix standard (LF) e non il ritorno a capo che usa Windows (CRLF).

Per iniziare, andiamo nella directory di destinazione e identifichiamo ciascuna subdirectory, ognuna contenente una istantanea di quello che vogliamo importare come una commit. Andrai in ciascuna subdirectory e stamperai i comandi necessari per esportarne il contenuto. Il tuo ciclo di base assomiglierà a questo::

	last_mark = nil

	# loop through the directories
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # move into the target directory
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

Esegui `print_export` in ciascuna directory, che prende in input il manifesto e il contrassegno dell’istantanea precedente e restituisce in output il manifesto e il contrassegno di quella corrente. In questo modo si possono collegare facilmente. "Mark" (contrassegno) è una chiave identificativa che tu dai a ciascuna commit. Man mano che creerai commit, darai a ciascuna un nuovo contrassegno che userai per collegarla alle altre commit. La prima cosa quindi che dovrai fare nel tuo `print_export` sarà generare questo contrassegno dal nome della directory:

	mark = convert_dir_to_mark(dir)

Creerai un array di directory e userai l’indice di questo array, perché il contrassegno dev’essere un intero. Il tuo metodo sarà più o meno così::

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

Ora che hai un intero a rappresentare ciascuna commit, hai bisogno di una data per il metadata della commit. Poiché la data è contenuta nel nome della directory ti basterà processarla.
La riga successiva del tuo `print_export` sarà quindi

	date = convert_dir_to_date(dir)

dove `convert_dir_to_date` è definito come

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

Questo restituisce un intero per la data di ciascuna directory. L’ultimo metadata di cui hai bisogno è il nome di chi ha eseguito la commit, che scriverai in una variabile globale:

	$author = 'Scott Chacon <schacon@example.com>'

Sei ora pronto per scrivere i dati delle commit per la tua importazione. L’informazione iniziale descrive che stai definendo una commit e a quale branch appartiene, seguita dal contrassegno che hai generato, le informazioni sull’autore e il messaggio della commit, infine la commit precedente, se esiste. Il codice assomiglierà a questo:

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

Definisci hardcoded il fuso orario (-0700 nell’esempio) perché è più facile farlo così. Ma se stai importando i dati da un altro sistema dovrai specificare l’orario come differenza di ore.
Il messaggio della commit dovrà essere espresso in un formato particolare:

	data (size)\n(contents)

Il formato consiste nella parola “data”, la dimensione dei dati da leggere, un ritorno a capo e quindi i dati veri e propri. Poiché hai bisogno dello stesso formato per specificare anche il contenuto dei file, creeremo un metodo `export_data`:

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

Tutto ciò che manca è solo specificare i file contenuti in ciascuna istantanea. Questo è semplice perché ognuna è una directory, e puoi scrivere il comando `deleteall` seguito dal contenuto di ciascun file nella directory. Git registrerà ogni istantanea nel modo corretto:

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

NB:	Poiché molti sistemi pensano le revisioni come cambiamenti tra una commit e l’altra, fast-import può anche prendere in input con ciascuna commit la descrizione di ciascun file aggiunto, rimosso o modificato e quale sia il contenuto attuale. Puoi calcolare tu stesso le differenze tra le varie istantanee e fornire queste informazioni, ma farlo è molto più complesso, e puoi così dare a Git tutte le informazioni e lasciare che Git ricavi quelle di cui ha bisogno. Se questo fosse il tuo caso, controlla la pagina man di `fast-import` per maggiori dettagli su come fornire queste informazioni in questo modo.

Il formato per l’elenco del contenuto aggiornato dei file o per specificare i file modificati con i contenuti aggiornati è quello seguente:

	M 644 inline path/to/file
	data (size)
	(file contents)

In questo caso 644 è il modo (devi individuare i file eseguibili ed usare invece il modo 755), e inline dice che indicherai il contenuto immediatamente dalla riga successiva. Il metodo `inline_data` sarà più o meno così:

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

Puoi riusare il metodo `export_data` definito precedentemente perché l’output è lo stesso di quando abbiamo specificato le informazioni per la commit.

L’ultima cosa che dovrai fare è restituire il contrassegno attuale, così che possa essere passato all’iterazione seguente:

	return mark

NB: Se sei su Windows devi aggiungere un ulteriore passaggio. Come già specificato prima, Windows usa il ritorno CRLF mentre git fast-import si aspetta solo un LF. Per risolvere questo problema e fare felice git fast-import, dovrai dire a ruby di usare LF invece di CRLF:

	$stdout.binmode

Questo è tutto: se esegui questo script otterrai un output simile al seguente:

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

Per eseguire l’importazione, attacca (con pipe) questo output a `git fast-import` dal repository di Git in cui vuoi importare i dati. Puoi creare una nuova directory e quindi eseguire `git init` nella nuova directory per iniziare, e quindi eseguire il tuo script:

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

Come puoi vedere, quando l’importazione avviene con sussesso, restituisce una serie di statistiche sulle attività svolte con successo. In questo caso abbiamo importato complessivamente 18 oggetti in 5 commit su 1 branch. Puoi ora quindi eseguire `git log` per vedere la cronologia:

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

E ora hai un repository Git pulito e ben strutturato. È importante notare che non c’è nessun file nella directory perché non è stato fatto nessun checkout. Per avere i file che ti aspetteresti di avere, devi resettare il tuo branch alla posizione attuale del `master`:

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

Puoi fare un sacco di altre cose con lo strumento `fast-import`, come gestire modalità diverse, dati binari, branch multipli, fare il merge di branch e tag, aggiungere degli indicatori di avanzamento e molto ancora. Numerosi esempi per scenari più complessi sono disponibili nella directory `contrib/fast-import` dei sorgenti di Git. Il migliore è lo script `git-p4` di cui abbiamo parlato prima.
