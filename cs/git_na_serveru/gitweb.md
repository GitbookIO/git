# GitWeb

Nyní, když máte ke svému projektu nastavena základní oprávnění pro čtení/zápis a pouze pro čtení, možná budete chtít nastavit jednoduchou online vizualizaci. Git vám nabízí CGI skript s názvem GitWeb, který slouží k tomuto účelu. Jak GitWeb funguje, na to se můžete podívat např. na stránkách `http://git.kernel.org` (viz obrázek 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)

Obrázek 4-1. Online uživatelské rozhraní GitWeb

Pokud vás zajímá, jak by GitWeb vypadal pro váš projekt, nabízí Git příkaz, jímž lze spustit dočasnou instanci. V systému je třeba mít lehký server typu `lighttpd` nebo `webrick`. V počítačích se systémem Linux je často nainstalován `lighttpd`. Spustit ho lze zadáním příkazu `git instaweb` v adresáři vašeho projektu. Pokud používáte OS Mac, v systému Leopard je předinstalován jazyk Ruby, a proto pro vás bude nejlepší variantou zřejmě server `webrick`. Chcete-li spustit `instaweb` s jiným správcem než `lighttpd`, použijte parametr `--httpd`:

	$ git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Tím spustíte HTTPD server na portu 1234 a automaticky se spustí webový prohlížeč, který otevře tuto stránku. Není to nic obtížného. Až skončíte a budete chtít server vypnout, spusťte stejný příkaz s parametrem `--stop`:

	$ git instaweb --httpd=webrick --stop

Chcete-li trvale spustit webové rozhraní na serveru pro svůj tým nebo nebo pro open-source projekt, který hostujete, musíte nastavit CGI skript tak, aby byl obsluhován vaším běžným webovým serverem. Některé linuxové distribuce mají balíček `gitweb`, který by mělo být možné nainstalovat pomocí nástrojů `apt` nebo `yum`. Zkuste proto tuto možnost jako první. Ruční instalaci skriptu probereme velmi rychle. Nejprve je třeba získat zdrojový kód systému Git, s nímž je GitWeb distribuován, a vygenerovat uživatelský CGI skript:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/
	$ make GITWEB_PROJECTROOT="/opt/git" \
	        prefix=/usr gitweb
	$ sudo cp -Rf gitweb /var/www/

Všimněte si, že musíte příkazu pomocí proměnné `GITWEB_PROJECTROOT` sdělit, kde najde repozitáře Git. Nyní musíte zajistit, aby server Apache používal CGI pro skript, pro který můžete přidat VirtualHost:

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

Také GitWeb může být obsluhován jakýmkoli webovým serverem umožňujícím CGI. Chcete-li používat jakýkoli jiný server, nemělo by být nastavení obtížné. V tomto okamžiku byste měli být schopni prohlížet své repozitáře online na adrese `http://gitserver/` a používat `http://git.gitserver` ke klonování a vyzvedávání repozitářů prostřednictvím protokolu HTTP.
