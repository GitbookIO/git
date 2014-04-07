# GitWeb

Ora che hai un accesso base in lettura e scrittura e sola lettura al tuo progetto, puoi configurare un visualizzatore web base. Git è rilasciato con uno script CGI chiamato GitWeb che è comunemente utilizzato per questo. Puoi vedere GitWeb in uso su siti come `http://git.kernel.org` (vedi Figura 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)
 
Figura 4-1. Interfaccia web di GitWeb.

Se vuoi verificare come GitWeb presenta il tuo progetto, Git è dotato di un comando per avviare un'istanza temporanea se hai un server leggero sul sistema come `lighttpd` o `webrick`. Su macchine Linux, `lighttpd` è spesso installato, quindi dovresti essere in grado di farlo funzionare con `git instaweb` nella directory del progetto. Se stai usando un Mac, Leopard viene fornito con preinstallato Ruby, così `webrick` è la soluzione migliore. Per avviare `instaweb` senza un server lighttpd, lo puoi lanciare con l'opzione `--httpd`.

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Questo avvia un server HTTPD sulla porta 1234 e automaticamente avvia un browser web che apre questa pagina. É davvero molto semplice. Quando hai fatto e vuoi chiudere il server, puoi usare lo stesso comando con l'opzione `--stop`:

	$ git instaweb --httpd=webrick --stop

Se vuoi lanciare l'interfaccia web continua sul tuo server per il tuo team o per un progetto open source di cui fai l'hosting, avrai bisogno di impostare lo script CGI per essere servito dal tuo normale server web. Alcune distribuzioni Linux hanno un pacchetto `gitweb` che probabilmente sei in grado di installare via `apt` o `yum`, così potrai provare questo prima. Ora vedremo molto velocemente come installare manualmente GitWeb. Prima, hai bisogno di ottenere il codice sorgente di Git, in cui è presente GitWeb, e generare uno script CGI personalizzato:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb/gitweb.cgi
	$ sudo cp -Rf gitweb /var/www/

Nota che devi dire al comando dove trovare i tuoi repository Git con la variabile `GITWEB_PROJECTROOT`. Ora hai bisogno di impostare Apache per usare il CGI per questo script, aggiungendo un VirtualHost:

	<VirtualHost *:80>
	    ServerName gitserver
	    DocumentRoot /var/www/gitweb
	    <Directory /var/www/gitweb>
	        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
	        AllowOverride All
	        order allow,deny
	        Allow from all
	        AddHandler cgi-script cgi
	        DirectoryIndex gitweb.cgi
	    </Directory>
	</VirtualHost>

Ancora, GitWeb può essere utilizzato con qualsiasi server web che supporta CGI; se preferisci usare qualcos'altro, non dovresti avere difficoltà nella configurazione. A questo punto, dovresti essere ingrado di vedere in `http://gitserver/` i tuoi repository online, e puoi usare `http://git.gitserver/` per clonare e controllare i tuoi repository via HTTP.
