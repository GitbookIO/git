# Accesso Pubblico

E se vuoi un accesso in lettura anonimo al tuo progetto? Probabilmente invece di ospitare un progetto privato interno, vuoi ospitare un progetto open source. O magari hai un gruppo di server automatizzati o server in continua integrazione che cambiano, e non vuoi generare chiavi SSH tutte le volte — vuoi solamente dare un semplice accesso anonimo in lettura.

Probabilmente il modo più semplice per una piccola installazione è avviare un server web statico con il suo document root dove si trovano i repository Git, e poi abilitare l'aggancio `post-update` che abbiamo visto nella prima sezione di questo capitolo. Partiamo dall'esempio precedente. Diciamo che hai i tuoi repository nella directory `/opt/git`, ed un server Apache sulla macchina. Ancora, puoi usare un qualsiasi server web per questo; ma come esempio, vediamo alcune configurazioni basi di Apache che ti dovrebbero dare una idea di cosa hai bisogno.

Prima devi abilitare l'aggancio:

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Cosa fa questo aggancio `post-update`? Fondamentalmente una cosa del genere:

	$ cat .git/hooks/post-update 
	#!/bin/sh
	exec git-update-server-info

Questo significa che quando invii dati al server via SSH, Git automaticamente avvia questo comando per aggiornare i file necessari per il prelievo via HTTP.

Poi, hai bisogno di aggiungere una voce VirtualHost alla configurazione del tuo Apache con la document root che è la directory dei tuoi progetti Git. Qui, supponiamo che abbia un wildcard DNS impostato per inviare `*.gitserver` ad ogni box che stai usando:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

Devi inoltre impostare il gruppo utente Unix della directory `/opt/git` in `www-data` così il tuo server web può avere un accesso di lettura ai repository, perché l'istanza Apache lancia lo script CGI (di default) quando è eseguito come questo utente:

	$ chgrp -R www-data /opt/git

Quando riavvii Apache, dovresti essere in grado di clonare i tuoi repository presenti in questa directory specificando l'URL del tuo progetto:

	$ git clone http://git.gitserver/project.git

In questo modo, puoi impostare  in pochi minuti un accesso in lettura HTTP per ogni progetto per un numero indefinito di utenti. Un'altra opzione semplice per un accesso pubblico senza autenticazione è avviare un demone Git, ovviamente questo richiede l'avvio di un processo - vedremo questa opzione nelle prossime sezioni, se preferisci questa cosa.
