# Suggerimenti e Trucchi

Prima di finire questo capitolo sulle basi di Git, ecco alcuni suggerimenti e trucchi per rendere l'esperienza nell'uso di Git più semplice, facile e familiare. Molte persone usano Git senza usare questi suggerimenti e non ci riferiremo ad essi o presumeremo che tu li abbia usati successivamente nel libro; ma probabilmente dovresti sapere come realizzarli.

## Auto-Completamento

Se usi una shell Bash, Git fornisce un piacevole script di auto completamento che può essere usato. Scarica il codice sorgente di Git, e guarda nella directory `contrib/completation`; dovrebbe esserci un file chiamato `git-completation.bash`. Copia questo file nella tua directory di home e aggiungila al tuo file `.bashrc`:

	source ~/.git-completion.bash

Se vuoi impostare Git per avere l'auto completamento della shell Bash per tutti gli utenti, copia lo script nella directory `/opt/local/etc/bash_completion.d` sui sistemi Mac o in `/etc/bash_completion.d/` sui sistemi Linux. Questa è una directory degli script che Bash automaticamente carica per fornire l'auto completamento da shell.

Se stai usando Windows con Git Bash, che è l'installazione di base per Git su Windows con msysGit, l'auto completamento dovrebbe essere preconfigurato.

Premi il tasto Tab quando stai scrivendo un comando Git, e dovresti avere una serie di suggerimenti da selezionare:

	$ git co<tab><tab>
	commit config

In questo caso, scrivendo git co e poi premendo il tasto Tab due volte compaiono i suggerimenti commit e config. Aggiungendo `m<tab>` si completa `git commit` automaticamente.

Questo funziona anche con le opzioni, cosa che forse è molto più utile. Per esempio, se si lancia il comando `git log` e non si ricorda una opzione, si può iniziare a pigiare il tasto Tab per vedere le corrispondenze:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Questo è un trucco davvero utile e permette di risparmiare molto tempo e lettura della documentazione.

## Alias con Git

Git non deduce il comando se si digita solo in parte. Se non si vuole scrivere l'intero testo di qualsiasi comando Git, puoi facilmente scegliere un alias per ogni comando, usando `git config`. Qui ci sono un po' di esempi su alcune configurazioni che potresti volere impostare:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Questo significa che, per esempio, invece di digitare `git commit`, hai solamente bisogno di scrivere `git ci`. Andando avanti con l'uso di Git, probabilmente ci saranno altri comandi che userai di frequente; in questi casi, non esitare a creare nuovi alias.

Questa tecnica può anche essere molto utile per creare comandi che ritieni dovrebbero esistere. Per esempio, per correggere un problema comune in cui si incorre quando si vuole disimpegnare un file dall'area di stage, puoi aggiungere il tuo alias unstage a Git:

	$ git config --global alias.unstage 'reset HEAD --'

Questo rende i seguenti due comandi equivalenti:

	$ git unstage fileA
	$ git reset HEAD fileA

Questo sembra più pulito. É anche comodo aggiungere il comando `last`, come:

	$ git config --global alias.last 'log -1 HEAD'

In questo modo puoi vedere l'ultimo commit facilmente:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Git semplicemente sostituisce il nuovo comando con quello che corrisponde all'alias. Magari, vuoi avviare un comando esterno, invece dei sotto comandi Git. In questo caso, devi avviare il comando con il carattere "!". Questo è utile se stai scrivendo i tuoi strumenti di lavoro con un repository Git. Per esempio creiamo un alias `git visual` per lanciare `gitk`:

	$ git config --global alias.visual '!gitk'
