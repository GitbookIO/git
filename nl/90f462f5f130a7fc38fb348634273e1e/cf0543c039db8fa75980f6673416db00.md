# GitWeb

Nu je gewone lees/schrijf en alleen-lezen toegang tot je project hebt, wil je misschien een eenvoudige web-gebaseerde visualisatie instellen. Git levert een CGI script genaamd GitWeb mee, dat normaalgesproken hiervoor gebruikt wordt. Je kunt GitWeb in actie zien bij sites zoals `http://git.kernel.org` (zie Figuur 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)

Figuur 4-1. De GitWeb web-gebaseerde gebruikers interface.

Als je wil zien hoe GitWeb er voor jouw project uitziet, dan heeft Git een commando waarmee je een tijdelijke instantie op kunt starten als je een lichtgewicht server op je systeem hebt zoals `lighttpd` of `webrick`. Op Linux machines is `lighttpd` vaak geïnstalleerd, dus je kunt het misschien draaiend krijgen door `git instaweb` in te typen in je project directory. Als je op een Mac werkt: Leopard heeft Ruby voorgeïnstalleerd, dus `webrick` zou je de meeste kans geven. Om `instaweb` met een server anders dan lighttpd te starten, moet je het uitvoeren met de `--httpd` optie.

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Dat start een HTTPD server op poort 1234 op en start automatisch een web browser die op die pagina opent. Het is dus makkelijk voor je. Als je klaar bent en de server wilt afsluiten, dan kun je hetzelfde commando uitvoeren met de `--stop` optie:

	$ git instaweb --httpd=webrick --stop

Als je de web interface doorlopend op een server wilt draaien voor je team of voor een open source project dat je verspreid, dan moet je het CGI script instellen zodat het door je normale web server geserveerd wordt. Sommige Linux distributies hebben een `gitweb` pakket dat je zou kunnen installeren via `apt` of `yum`, dus wellicht kan je dat eerst proberen. We zullen snel door een handmatige GitWeb installatie heen lopen. Eerst moet je de Git broncode pakken waar GitWeb bij zit, en het aangepaste CGI script genereren: 

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb/gitweb.cgi
	$ sudo cp -Rf gitweb /var/www/

Merk op dat je het commando moet vertellen waar het je Git repositories kan vinden met de `GITWEB_PROJECTROOT` variabele. Nu moet je zorgen dat de Apache server CGI gebruikt voor dat script, waarvoor je een VirtualHost kunt toevoegen:

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

Nogmaals, GitWeb kan geserveerd worden met iedere web server die in staat is CGI te verwerken. Als je iets anders prefereert zou het niet moeilijk moeten zijn dit in te stellen. Vanaf dit moment zou je in staat moeten zijn om `http://gitserver/` te bezoeken en je repositories online te zien, en kun je `http://git.gitserver` gebruiken om je repositories over HTTP te clonen en te fetchen.
