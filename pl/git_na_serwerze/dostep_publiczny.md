# Dostęp publiczny

Co jeśli chcesz anonimowego dostępu do odczytu z twojego projektu? Być może zamiast hostingu wewnętrznego, prywatnego projektu chcesz hostować projekt open source. Albo masz garść serwerów automatycznej budowy lub serwery ciągłej integracji, które często się zmieniają i nie chcesz generować cały czas kluczy SSH  - chcesz po prostu dodać prosty anonimowy dostęp odczytu.

Prawdopodobnie najprostszym sposobem dla niewielkich instalacji jest prowadzić statyczny serwer www z głównym dokumentem w miejscu gdzie są twoje repozytoria i umożliwić podpięcie `post-update`, o którym wspomnieliśmy w pierwszej sekcji tego rozdziału. Popracujmy z poprzednim przykładem. Powiedzmy, że masz swoje repozytoria w `/opt/git/` i serwer Apache działa na twoim sprzęcie. Ponownie, możesz użyć do tego każdego serwera www, ale jako przykład zaprezentujemy parę podstawowych konfiguracji Apache, które powinny dać ci obraz czego możesz potrzebować.

Na początku musisz umożliwić to podpięcie:

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Jeśli używasz Gita w wersji wcześniejszej niż 1.6, polecenie `mv` nie jest konieczne — tylko w ostatnich wersjach Gita przykłady podpięć posiadają w nazwie rozszerzenie `.sample`. 

Co robi to podpięcie `post-update`? Generalnie wygląda ono tak:

	$ cat .git/hooks/post-update 
	#!/bin/sh
	exec git-update-server-info

To oznacza, że kiedy wysyłasz do serwera przez SSH, Git uruchomi tę komendę, aby uaktualnić pliki potrzebne do ściągania przez HTTP.

Następnie do ustawień swojego serwera Apache musisz dodać pozycję VirtualHost z głównym dokumentem jako główny katalog twoich projektów Git. Tutaj zakładamy, ze masz ustawiony wildcard DNS do wysyłania `*.gitserver` do jakiegokolwiek pudła, którego używasz do uruchamiania tego wszystkiego:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

Będziesz tez musiał ustawić unixową grupę użytkowników do ścieżki `/opt/git` na `www-data` tak aby twój serwer www mógł dokonać odczytu z repozytoriów, ponieważ instancja serwera Apache uruchamiająca skrypt CGI (domyślnie) będzie go uruchamiać jako ten użytkownik:

	$ chgrp -R www-data /opt/git

Kiedy zrestartujesz serwer Apache powinieneś móc sklonować swoje repozytoria do tego katalogu określając URL dla swojego projektu.

	$ git clone http://git.gitserver/project.git

W ten sposób możesz ustawić oparty na HTTP dostęp odczytu do swoich projektów dla sporej liczby użytkowników w kilka minut. Inną prostą opcją dla publicznego nieautoryzowanego dostępu jest uruchomienie demona Git, jednakże to wymaga zdemonizowania tego procesu - zajmiemy się tą opcją w następnej sekcji, jeśli preferujesz tę drogę.

##GitWeb##

Teraz, gdy już podstawy odczytu i zapisu są dostępne tylko dla Twojego projektu, możesz założyć prostą internetową wizualizacje. Do tego celu Git wyposażony jest w skrypt CGI o nazwie GitWeb. Jak widać GitWeb stosowany jest w miejscach takich jak:`http://git.kernel.org` (patrz rys. 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)

Figure 4-1.GitWeb internetowy interfejs użytkownika.

Jeśli chcesz zobaczyć jak GitWeb będzie wyglądał dla Twojego projektu, Git posiada polecenie do uruchamiania tymczasowej instancji, pod warunkiem, że posiadasz lekki serwer taki jak `lighttpd` lub `webrick`. Na komputerach z zainstalowanym linuxem `lighttpd` jest bardzo często instalowany więc należy go uruchomić wpisując `git instaweb` w katalogu projektu. Jeśli używasz komputera Mac, Leopard jest automatycznie instalowany z Ruby więc `webrick` może być najlepszym rozwiązaniem. Aby rozpocząć `instaweb` bez tymczasowej instancji, należy uruchomić go z opcją `--httpd`.

	$git instaweb --httpd=webrick
	[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
	[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Powyższe polecenie uruchamia serwer HTTPD na porcie 1234, a następnie automatycznie uruchamia przeglądarkę internetową, która otwiera się na tej stronie. Kiedy skończysz i chcesz wyłączyć serwer, użyj tego samego polecenia z opcją `--stop`

	$ git instaweb --httpd=webrick --stop

Jeśli chcesz aby uruchomiony interfejs WWW był cały czas dostępny dla Twojego zespołu lub projektu open source, będziesz musiał skonfigurować skrypt CGI dla normalnego serwera WWW. Niektóre dystrybucje linuxa mają pakiet `gitweb`, który można zainstalować przez `apt` lub `yum`, więc warto spróbować tego w pierwszej kolejności. Jeśli się nie uda to musimy zainstalować GitWeb ręcznie, co trwa tylko chwile. Najpierw musimy pobrać kod źródłowy GitWeb i wygenerować własny skrypt CGI:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
 	$ cd git/
 	$ make GITWEB_PROJECTROOT="/opt/git" \
        prefix=/usr gitweb/gitweb.cgi
 	$ sudo cp -Rf gitweb /var/www/

Zwróć uwagę że musisz ręcznie podać lokalizacje swoich repozytoriów gita w zmiennej `GITWEB_PROJECTROOT`. Następnie należy stworzyć serwer Apache używający skryptu CGI, na którym można dodać wirtualnego hosta:

	$<VirtualHost *:80>
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

GitWeb można używać z dowolnym serwerem CGI. Jeśli wolisz korzystać z czegoś innego to nie powinno być trudne do skonfigurowania. W tym momencie powinieneś być w stanie odwiedzić `http://gitserver/` w celu przeglądania repozytoriów online, a także używać `http://git.gitserver` w celu klonowania i pobierania repozytoriów HTTP.

##Gitosis##

Gdy będziemy trzymać klucze publiczne wszystkich użytkowników w pliku `authorized_keys` trzeba się liczyć, iż takie repozytorium będzie działać bardzo niestabilnie. Kiedy będziesz miał setki użytkowników, możesz napotkać pewne problemy przy zarządzaniu nimi. Za każdym razem musisz skonfigurować powłokę na serwerze w której nie masz kontroli dostępu - każdy użytkownik może zmieniać prawa dostępu do projektów.

Warto więc jednak przedstawić projekt oprogramowania wykorzystywanego na szeroką skalę o nazwie Gitosis. Gitosis to w zasadzie zestaw skryptów, który nie tylko pomoże Ci zarządzać plikiem `authorized_keys`, ale udostępnia również kilka prostych narzędzie kontroli dostępu. Ciekawostką jest fakt, iż narzędzie odpowiedzialne za dodawanie użytkowników oraz zarządzanie ich prawami nie jest aplikacją www lecz specjalnym repozytorium. Po wprowadzeniu zmian oraz ich zatwierdzeniu, Gitosis konfiguruje samodzielnie serwer, co jest bardzo wielkim udogodnieniem.

Instalacja Gitosis nie należy do najłatwiejszych, lecz nie jest skomplikowana. Jest najłatwiejsza przy wykorzystaniu systemu Linux - poniższe przykłady zostały zaimplementowane w Ubuntu ver. 8.10.

Gitosis wymaga pewnych pakietów Pythona, więc najpierw trzeba uruchomić pakiet instalacyjny Pythona:

	$ apt-get install python-setuptools

Następnie musisz skopiować oraz zainstalować pakiet Gitosis z głównej strony projektu:

	$ git clone https://github.com/tv42/gitosis.git
	$ cd gitosis
	$ sudo python setup.py install

Co zainstaluje kilka plików wykonywalnych, których to Gitosis potrzebuje do poprawnego działania. Gitosis będzie proponował umieścić repozytoria w `/home/git`, co jest poprawne. Lecz Twoje repozytoria są w `/opt/git`, więc zamiast konfigurować wszystko od początku najlepszym posunięciem będzie stworzenie dowiązania:

	$ ln -s /opt/git /home/git/repositories

Gitosis będzie teraz zarządzać Twoimi kluczami, więc musisz usunąć bieżący plik, następnie dodać ponownie klucze i pozwolić Gitosis na kontrole pliku `authorized_keys`. Teraz musimy przenieść plik `authorized_keys`:

	$ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak 

Kolejnym krokiem będzie zmiana powłoki na powłokę użytkownika, jeżeli zmienisz ją poleceniem `git-shell`. Ludzie wciąż nie będą mogli się zalogować, ale Gitosis będzie już ją kontrolował. Więc zmieńmy tą konkretną linię w pliku `/etc/passwd`

	git:x:1000:1000::/home/git:/usr/bin/git-shell

wróćmy do tego:

	git:x:1000:1000::/home/git:/bin/sh

Nadszedł czas, aby zainicjować Gitosis. Można to zrobić poprzez polecenie `gitosis-init` z użyciem klucza publicznego. Jeśli Twojego klucza publicznego nie ma na serwerze, musisz go tam skopiować.

	$ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
	Initialized empty Git repository in /opt/git/gitosis-admin.git/
	Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Dzięki temu użytkownik z kluczem publicznym może modyfikować repozytorium. Następnie musisz ustawić ręcznie atrybut wykonywalności w skrypcie `post-update` w celu kontroli nowego repozytorium. 

	$ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Jeśli serwer został poprawnie skonfigurowany, możesz spróbować zalogować się jako użytkownik, do którego przypisałeś klucze publiczne dla zainicjowania Gitosis. Powinieneś zobaczyć coś takiego:

	$ ssh git@gitserver
	PTY allocation request failed on channel 0
	fatal: unrecognized command 'gitosis-serve schacon@quaternion'
	Connection to gitserver closed.

Co oznacza, że system rozpoznał Cię lecz zamknął połączenie z powodu braku poleceń dla repozytorium. Więc spróbujmy skopiować repozytorium Gitosis:

	# on your local computer
	$ git clone git@gitserver:gitosis-admin.git

Teraz masz katalog o nazwie `gitosis-admin`, który zawiera dwa podkatalogi:

	$ cd gitosis-admin
	$ find .
	./gitosis.conf
	./keydir
	./keydir/scott.pub

Plik `gitosis.conf` jest odpowiedzialny za określanie użytkowników, repozytorium oraz praw dostępu. W katalogu `keydir` można przechowywać klucze publiczne dla wszystkich użytkowników, którzy mają jakikolwiek dostęp do Twojego repozytorium - jeden plik na użytkownika. Nazwa pliku w katalogu `keydir` (w poprzednim przykładzie, `scott.pub`) będzie inna w Twoim przypadku - Gitosis tworzy nazwę z dopisku na końcu klucza publicznego, który został zaimportowany razem z `gitosis-init`.

Jeżeli spojrzymy na plik `gitosis.conf`, powinien zawierać on informację o projekcie  `gitosis-admin` którego właśnie skopiowaliśmy:

	$ cat gitosis.conf
	[gitosis]

	[group gitosis-admin]
	writable = gitosis-admin
	members = scott

To pokazuje, że użytkownik 'scott' - użytkownik posiadający ten sam klucz publiczny z którego został zainicjowany Gitosis jest jedynym, który posiada dostęp do projektu `gitosis-admin`.

Teraz, dodajmy nowy projekt dla Ciebie. Dodamy nową sekcję o nazwie `mobile` w której umieścisz listę programistów swojego zespołu oraz całego projektu. Ponieważ 'scott' jest tylko zwykłym użytkownikiem, musimy dodać "scotta" jako jedynego członka zespołu, następnie tworzymy nowe repozytorium o nazwie `iphone_project`:

	[group mobile]
	writable = iphone_project
	members = scott

Ilekroć dokonasz zmian w projekcie `gitosis-admin`, musisz zatwierdzić oraz przesłać je z powrotem na serwer w celu aktualizacji zmian:

	$ git commit -am 'add iphone_project and mobile group'
	[master]: created 8962da8: "changed name"
 	1 files changed, 4 insertions(+), 0 deletions(-)
	$ git push
	Counting objects: 5, done.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 272 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	To git@gitserver:/opt/git/gitosis-admin.git
 	  fb27aec..8962da8  master -> master

Możemy wykonać pierwszą akcję dla nowego projektu `iphone_project` poprzez dodanie swojego serwera jako zdalnego, do lokalnej wersji projektu. Nie trzeba będzie już tworzyć ręcznie pustych repozytoriów dla nowych projektów na serwerze - Gitosis będzie tworzyć je automatycznie.

	$ git remote add origin git@gitserver:iphone_project.git
	$ git push origin master
	Initialized empty Git repository in /opt/git/iphone_project.git/
	Counting objects: 3, done.
	Writing objects: 100% (3/3), 230 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	To git@gitserver:iphone_project.git
	 * [new branch]      master -> master

Zauważ, że nie musimy określać ścieżek (w rzeczywistości, ten sposób by nie zadziałał), po prostu użyj dwukropka, następnie nazwy projektu - Gitosis znajdzie projekt automatycznie.

Jeżeli chcesz pracować nad tym projektem wraz ze swoimi przyjaciółmi, będziesz musiał ponownie dodać ich klucze publiczne. Ale zamiast dołączać je ręcznie do pliku `~/.ssh/authorized_keys` na serwerze, dodaj je do katalogu `keydir`, każdy klucz w osobnym pliku. Spróbujmy dodać klucze publiczne dla nowych użytkowników:

	$ cp /tmp/id_rsa.john.pub keydir/john.pub
	$ cp /tmp/id_rsa.josie.pub keydir/josie.pub
	$ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Teraz możemy dodać ich wszystkich do naszego zespołu o nazwie 'mobile', w którym będą mieli prawa do zapisu jak i odczytu.

	iphone_project:

	[group mobile]
	writable = iphone_project
	members = scott john josie jessica

Po zatwierdzeniu i wysłaniu zmian, wszyscy czterej użytkownicy będą mieli prawa odczytu a także zapisu w tym projekcie.

Gitosis posiada bardzo łatwy i sprawny system kontroli dostępu. Jeżeli chcesz aby John posiadał tylko prawa do odczytu w zakresie tego projektu, możesz posłużyć się poniższym przykładem:

	[group mobile]
	writable = iphone_project
	members = scott josie jessica

	[group mobile_ro]
	readonly = iphone_project
	members = john

Teraz John może kopiować projekt oraz pobierać aktualizacje, ale Gitosis nie pozwoli mu cofnąć wcześniej wprowadzonych zmian. Można tworzyć wiele podobnych grup zawierających różnych użytkowników i różne projekty. Można również określić grupę dla zbioru użytkowników innej grupy (używając `@` jako prefiksu), poprzez dziedziczenie.

	[group mobile_committers]
	members = scott josie jessica

	[group mobile]
	writable  = iphone_project
	members   = @mobile_committers

	[group mobile_2]
	writable  = another_iphone_project
	members   = @mobile_committers john

Jeśli masz jakieś problemy, pomocnym może się okazać ustawienie `loglevel=DEBUG` w sekcji `[gitosis]`. Jeżeli straciłeś poprzednią konfigurację poprzez podmianę jej na niewłaściwą, możesz ręcznie naprawić plik na serwerze `/home/git/.gitosis.conf` - plik konfiguracyjny Gitosis. Wyślij plik `gitosis.conf` do wyżej wymienionego katalogu. Jeżeli chcesz edytować ten plik ręcznie, pamiętaj że pozostanie on do następnej zmiany w projekcie `gitosis-admin`.
