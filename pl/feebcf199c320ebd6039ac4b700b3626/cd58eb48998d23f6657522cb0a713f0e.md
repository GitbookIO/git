# Git Demon

Dla dostępu publicznego, nieautoryzowanego do Twojego projektu, możesz pominąć protokół HTTP i zacząć używać protokołu Git. Główną przyczyną użycia protokołu Git jest jego szybkość działania. Protokół Git jest znacznie bardziej wydajny i szybszy niż protokół HTTP, więc użycie go zaoszczędzi czas użytkowników.

Idąc dalej, dla dostępu nieautoryzowanego i tylko do odczytu. Jeśli używasz projektu na serwerze poza zaporą, powinieneś stosować ten protokół jedynie do projektów, które są publicznie widoczne dla świata. Jeśli serwer, którego używasz znajduje się wewnątrz sieci z zaporą, możesz również użyć go do projektów używanych przez wiele ludzi i komputerów (ciągła integracja lub budowa serwera) mających dostęp tylko do odczytu, jeśli nie chcesz dodawać klucza SSH dla każdego.

W każdym bądź razie, protokół Git jest stosunkowo prosty w konfiguracji. Po prostu, musisz uruchomić komendę poprzez demona:

	  git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

`--reuseaddr` pozwala serwerowi na restart bez konieczności czekania na zakończenie starych połączeń, natomiast opcja `--base-path` pozwala ludziom na klonowanie bez konieczności podawania całej ścieżki, a ścieżka na końcu mówi Git demonowi, które repozytorium mają zostać eksportowane. Jeśli używasz zapory, będziesz musiał dodać regułę otwarcia portu 9418 w oknie ustawień swojej zapory.

Możesz demonizować ten proces na wiele sposobów, w zależności od używanego systemu. Na maszynie z Ubuntu, używamy Upstart script. Więc, w podanym pliku

	/etc/event.d/local-git-daemon

zamieszczasz ten skrypt:

	start on startup
	stop on shutdown
	exec /usr/bin/git daemon \
	    --user=git --group=git \
	    --reuseaddr \
	    --base-path=/opt/git/ \
	    /opt/git/
	respawn

Ze względów bezpieczeństwa, zachęcam do korzystania z demona jako użytkownik z uprawnieniami 'tylko do odczytu' dla repozytorium — możesz łatwo to zrobić tworząc nowego użytkownika 'git-ro' i użycie go do demona. Dla uproszczenia będziemy używać tego samego konta 'git', na którym uruchomiony jest Gitosis.

Kiedy zrestartujesz maszynę, Twój Git demon wystartuje automatycznie jeśli był wyłączony. Aby uruchomić go bez restartu, możesz użyć polecenia:

	initctl start local-git-daemon

Na innych systemach, możesz użyć `xinetd`, skryptu w folderze systemowym `sysvinit`, lub inaczej — tak długo jak będziesz demonizował to polecenie i obserwował jakoś.

Następnie, musisz powiedzieć swojemu serwerowi Gitosis które repozytorium Git pozwala na dostęp 'tylko do odczytu'. Jeśli dodasz wpis dla każdego repozytorium, możesz określić, które ma być czytane przez Git demona. Jeśli chcesz aby protokół Git był dostępny dla Twojego projektu iphone, musisz dodać to na końcu pliku `gitosis.conf` :

	[repo iphone_project]
	daemon = yes

Kiedy to zostanie zatwierdzone i wysłane na serwer, Twój uruchomiony demon powinien zacząć dawać odpowiedzi dla projektu każdemu kto ma dostęp do portu 9418 na Twoim serwerze.

Jeśli zdecydujesz się nie używać Gitosis, ale chcesz ustawić Git demona, musisz uruchomić go dla każdego projektu, który chcesz aby demon obsługiwał:

	$ cd /path/to/project.git
	$ touch git-daemon-export-ok

Obecność tego pliku mówi Gitowi, że można serwować ten projekt bez autoryzacji.

Gitosis może także kontrolować, który projekt GitWeb ma pokazywać. Najpierw, musisz dodać coś takiego do pliku `/etc/gitweb.conf`:

	$projects_list = "/home/git/gitosis/projects.list";
	$projectroot = "/home/git/repositories";
	$export_ok = "git-daemon-export-ok";
	@git_base_url_list = ('git://gitserver');

Możesz kontrolować, który projekt jest widoczny w GitWeb, poprzez dodanie lub usunięcie ustawienia `gitweb` w pliku konfiguracyjnym Gitosis. Na przykład, jeśli chcesz pokazać projekt iphone w GitWeb, musisz zmienić ustawienia `repo` aby wyglądały jak to:

	[repo iphone_project]
	daemon = yes
	gitweb = yes

Teraz, jeśli zatwierdzisz i wyślesz projekt, GitWeb automatycznie zacznie pokazywać projekt iphone.
