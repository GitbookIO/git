# Demone Git

Per un accesso pubblico, senza autenticazione al tuo progetto, vorrai muoverti dal vecchio protocollo HTTP ed iniziare ad usare il protocollo Git. Il motivo principale è la velocità. Il protocollo Git è più efficiente e veloce del protocollo HTTP, quindi usarlo risparmierà tempo agli utenti.

Questo è solo per un accesso senza autenticazione in sola lettura. Se lo stai usando su un server al di fuori del tuo firewall, dovrebbe essere usato solamente per progetti che hanno una visibilità pubblica al mondo. Se il server che stai usando è all'interno del tuo firewall, lo puoi usare per i progetti con un gran numero di persone o computer (integrazione continua o server di build) con accesso in sola lettura, quando non vuoi aggiungere una chiave SSH per ciascuno.

In ogni caso, il protocollo Git è relativamente facile da impostare. Fondamentalmente, devi lanciare il comando in modo da renderlo un demone:

	git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

`--reuseaddr` permette al server di riavviarsi senza aspettare che la vecchia connessione concluda, l'opzione `--base-path` permette alle persone di clonare il progetto senza specificare l'intera path, e la path alla fine dice al demone Git dove cercare i repository da esportare. Se stai utilizzando un firewall, devi aprire l'accesso alla porta 9418 della macchina che hai configurato.

Puoi creare il demone di questo processo in vari modi, in base al sistema operativo che usi. Su una macchina Ubuntu, usa uno script Upstart. Così, nel seguente file

	/etc/event.d/local-git-daemon

devi mettere questo script:

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

Per motivi di sicurezza, è strettamente raccomandato avere questo demone avviato come utente con permessi di sola lettura al repository — puoi farlo facilmente creando un nuovo utente 'git-ro' e lanciando il demone con questo. Per semplicità lo lanciamo con lo stesso utente 'git' che usa Gitosis.

Quando riavvi la macchina, il tuo demone Git si avvierà automaticamente e si riavvierà se cade. Per averlo in funziona senza dover fare il reboot, puoi lanciare questo:

	initctl start local-git-daemon

Su altri sistemi, potresti usare `xinetd`, uno script nel tuo sistema `sysvinit`, o altro — insomma un comando che lancia il demone e lo controlla in qualche modo.

Poi, devi dire al tuo server Gitosis quali repository hanno un accesso al server Git senza autenticazione. Se aggiungi una sezione per ogni repository, puoi specificare quelli per cui vuoi il demone Git permetta la scrittura. Se vuoi permettere un accesso al protocollo Git al progetto del tuo iphone, puoi aggiungere alla fine del file `gitosis.conf`:

	[repo iphone_project]
	daemon = yes

Quando hai effettuato il commit ed inviatolo, il tuo demone dovrebbe iniziare a servire le richieste per il progetto a chiunque abbia un accesso alla porta 9418 del tuo server.

Se decidi di non usare Gitosis, ma vuoi configurare un demone Git, devi avviare quanto segue su ogni singolo progetto che il demone Git deve servire:

	$ cd /path/to/project.git
	$ touch git-daemon-export-ok

La presenza di questo file dice a Git che è OK per essere servito senza autenticazione.

Gitosis può inoltre controllare quali progetti GitWeb mostra. Primo, devi aggiungere qualcosa del genere al file `/etc/gitweb.conf`:

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

Puoi controllare quali progetti GitWeb lascia sfogliare agli utenti via browser aggiungendo o rimuovendo impostazioni `gitweb` nel file di configurazione Gitosis. Per esempio, se vuoi che il progetto iphone sia visto con GitWeb, devi impostare il `repo` come segue:

	[repo iphone_project]
	daemon = yes
	gitweb = yes

Ora, se fai il commit ed il push del progetto, GitWeb automaticamente inizierà a mostrare il progetto iphone.
