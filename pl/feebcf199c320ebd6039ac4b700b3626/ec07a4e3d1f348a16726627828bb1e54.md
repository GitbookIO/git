# Protokoły

Git potrafi korzystać z czterech podstawowych protokołów sieciowych do przesyłu danych: lokalnego, Secure Shell (SSH), Git, oraz HTTP. Poniżej opiszemy czym się charakteryzują i w jakich sytuacjach warto korzystać (lub wręcz przeciwnie) z jednego z nich.

Istotne jest, że z wyjątkiem protokołu HTTP, wszystkie pozostałe wymagają by na serwerze został zainstalowany Git.

## Protokół lokalny

Najbardziej podstawowym protokołem jest _protokół lokalny_, w którym zdalne repozytorium to po prostu inny katalog na dysku. Taką konfigurację często wykorzystuje się, gdy wszyscy z Twojego zespołu mają dostęp do jednego współdzielonego systemu plików, np. NFS lub, co mniej prawdopodobne, gdy wszyscy logują się do tego samego komputera. Ten drugi scenariusz nie jest zalecany z tego powodu, że wszystkie kopie repozytorium znajdują się na tej samej fizycznej maszynie, co może być katastrofalne w skutkach.

Jeśli posiadasz współdzielony, zamontowany system plików, możesz z niego klonować, pchać do niego własne zmiany oraz pobierać zmiany innych korzystając z plikowego repozytorium lokalnego. Aby sklonować takie repozytorium, albo wskazać jedno z takich repozytoriów jako repozytorium zdalne, skorzystaj ze ścieżki do katalogu jako adresu URL. Np. aby sklonować lokalne repozytorium możesz wywołać polecenie podobne do poniższego:

    $ git clone /opt/git/project.git

Możesz też użyć takiej formy:

    $ git clone file:///opt/git/project.git

Git działa odrobinę inaczej, gdy jawnie użyjesz przedrostka `file://` w adresie URL. Jeśli podasz samą ścieżkę, Git spróbuje użyć twardych linków albo po prostu skopiować potrzebne pliki. Jeśli podasz `file://`, Git uruchomi procesy normalnie wykorzystane do transferu sieciowego, co zwykle jest znacznie mniej efektywną metodą przesyłania danych. Głównym powodem podawania przedrostka `file://` jest chęć posiadania czystej kopii repozytorium bez niepotrzebnych referencji, czy obiektów, które zwykle powstają po zaimportowaniu repozytorium z innego systemu kontroli wersji (Rozdział 9 zawiera informacje na temat zadań administracyjnych). Tutaj skorzystamy ze zwykłej ścieżki do katalogu, ponieważ będzie szybciej.

Aby dodać do istniejącego projektu repozytorium plikowe jako repozytorium zdalne, wykonaj polecenie:

    $ git remote add local_proj /opt/git/project.git

Od tej chwili możesz pchać i pobierać z repozytorium zdalnego tak samo jakby repozytorium to istniało w sieci.

### Zalety

Zaletą plikowego repozytorium jest prostota i możliwość skorzystania z istniejących uprawnień plikowych i sieciowych. Jeśli już posiadasz współdzielony sieciowy system plików, do którego Twój zespół posiada dostęp, konfiguracja takiego repozytorium jest bardzo prosta. Umieszczasz kopię czystego repozytorium w miejscu, do którego każdy zainteresowany ma dostęp i ustawiasz prawa odczytu/zapisu tak samo jak do każdego innego współdzielonego zasobu. Informacja o tym jak w tym celu wyeksportować czyste repozytorium znajduje się w następnej części "Konfiguracja Git na serwerze".

Opcja ta jest interesująca także w przypadku, gdy chcemy szybko pobrać zmiany z czyjegoś repozytorium. Jeśli działasz z kimś w tym samym projekcie i ktoś chce pokazać Ci swoje zmiany, wykonanie polecenia `git pull /home/john/project` jest często prostsze od czekania aż ktoś wypchnie zmiany na serwer, aby później je stamtąd pobrać.

### Wady

Wadą tej metody jest to, że współdzielony dostęp plikowy dla wielu osób jest zwykle trudniejszy w konfiguracji niż prosty dostęp sieciowy. Jeśli chcesz pchać swoje zmiany z laptopa z domu, musisz zamontować zdalny dysk, co może być trudniejsze i wolniejsze niż dostęp sieciowy.

Warto również wspomnieć, że korzystanie z pewnego rodzaju sieciowego zasobu współdzielonego niekoniecznie jest najszybszą metodą dostępu. Lokalne repozytorium jest szybkie tylko wtedy, gdy masz szybki dostęp do danych. Repozytorium umieszczone w zasobie NFS jest często wolniejsze od repozytorium udostępnianego po SSH nawet jeśli znajduje się na tym samym serwerze, a jednocześnie pozwala na korzystanie z Git na lokalnych dyskach w każdym z systemów.

## Protokół SSH

SSH to prawdopodobnie najczęściej wykorzystywany protokół transportowy dla Git. Powodem jest fakt, że większość serwerów posiada już istniejącą konfigurację SSH, a jeśli nie, nie jest problemem utworzenie takiej konfiguracji. SSH to także jedyny sieciowy protokół, który pozwala na równie łatwy odczyt jak i zapis. Pozostałe protokoły sieciowe (HTTP i Git) są generalnie tylko do odczytu danych, zatem jeśli masz je skonfigurowane dla szarych użytkowników, nadal będzie Ci potrzebny protokół SSH, abyś mógł cokolwiek zapisać w zdalnym repozytorium. SSH posiada także wbudowane mechanizmy uwierzytelnienia; a ponieważ jest powszechnie wykorzystywany, jest prosty w konfiguracji i użyciu.

Aby sklonować repozytorium Git po SSH, użyj przedrostka `ssh://` jak poniżej:

    $ git clone ssh://user@server/project.git

Możesz także nie określać protokołu - Git zakłada właśnie SSH, jeśli go nie określisz:
   
    $ git clone user@server:project.git

Możesz także określić użytkownika - Git zakłada użytkownika na którego jesteś aktualnie zalogowany.

### Zalety

Istnieje wiele zalet korzystania z SSH. Po pierwsze, w zasadzie nie ma innego wyjścia, jeśli wymagany jest uwierzytelniony dostęp podczas zapisu do repozytorium przez sieć. Po drugie - demony SSH są powszechnie wykorzystywane, wielu administratorów sieciowych jest doświadczonych w ich administracji, a wiele systemów operacyjnych posiada je zainstalowane standardowo, bądź zawiera niezbędne do ich zarządzania narzędzia. Dodatkowo, dostęp po SSH jest bezpieczny - cała transmisja jest szyfrowana i uwierzytelniona. Wreszcie, podobnie jak w protokołach Git i lokalnym, SSH jest protokołem efektywnym i pozwalającym na najbardziej optymalny transfer danych z punktu widzenia przepustowości.

### Wady

Wadą dostępu po SSH jest to, że nie istnieje dostęp anonimowy do repozytorium. Programiści muszą posiadać dostęp do serwera po SSH nawet gdy chcą jedynie odczytać dane z repozytorium, co sprawia, że taki rodzaj dostępu nie jest interesujący z punktu widzenia projektów Open Source. Jeśli korzystasz z SSH wyłącznie w sieci korporacyjnej firmy, SSH z powodzeniem może być jedynym protokołem dostępu. Jeśli konieczny jest anonimowy dostęp do projektów tylko do odczytu, SSH jest potrzebny by pchać do nich zmiany, ale do pobierania danych przez innych wymagany jest inny rodzaj dostępu.

## Protokół Git

Następnie mamy protokół Git. To specjalny rodzaj procesu demona, który dostępny jest w pakiecie z Gitem; słucha na dedykowanym porcie (9418) i udostępnia usługi podobne do protokołu SSH, ale całkowicie bez obsługi uwierzytelnienia. Aby repozytorium mogło być udostępnione po protokole Git konieczne jest utworzenie pliku `git-daemon-export-ok` - bez niego demon nie udostępni repozytorium - ale to jedyne zabezpieczenie. Albo wszyscy mogą klonować dane repozytorium, albo nikt. Generalnie oznacza to że nie można pchać zmian po tym protokole. Można włączyć taką możliwość; ale biorąc pod uwagę brak mechanizmów uwierzytelniania, jeśli włączysz możliwość zapisu, każdy w Internecie, kto odkryje adres Twojego projektu może pchać do niego zmiany. Wystarczy powiedzieć, że nie spotyka się często takich sytuacji.

### Zalety

Protokół Git to najszybszy dostępny protokół dostępu. Jeśli obsługujesz duży ruch sieciowy w publicznie dostępnych projektach, albo udostępniasz spory projekt, który nie wymaga uwierzytelniania dla dostępu tylko do odczytu, bardzo prawdopodobne jest, że skorzystasz w tym celu z demona Git. Korzysta on z tych samych mechanizmów transferu danych jak protokół SSH, ale bez narzutów związanych z szyfrowaniem i uwierzytelnieniem.

### Wady

Wadą protokołu Git jest brak mechanizmów uwierzytelniania. Zwykle nie jest wskazane, by był to jedyny protokół dostępu do repozytoriów Git. Najczęściej stosuje się go wraz z protokołem SSH, który obsługuje zapis (pchanie zmian), podczas gdy odczyt przez wszystkich odbywa się z wykorzystaniem `git://`.
Prawdopodobnie jest to także protokół najtrudniejszy w konfiguracji. Musi działać w procesie dedykowanego demona - przyjrzymy się takiej konfiguracji w części "Gitosis" niniejszego rozdziału - wymaga konfiguracji `xinetd` lub analogicznej, co nie zawsze jest trywialne. Wymaga również osobnej reguły dla firewalla, który musi pozwalać na dostęp po niestandardowym porcie 9418, co zwykle nie jest proste do wymuszenia na korporacyjnych administratorach.

## Protokół HTTP/S

W końcu mamy protokół HTTP. Piękno protokołów HTTP i HTTPS tkwi w prostocie ich konfiguracji. Zwykle wystarczy umieścić czyste repozytorium Git poniżej katalogu głównego WWW oraz skonfigurować specjalny hook `post-update` i Voila! (Rozdział 7 zawiera szczegóły dotyczące hooków Git). Od tej chwili każdy, kto posiada dostęp do serwera WWW, w którym umieściłeś repozytorium może je sklonować. Aby umożliwić dostęp tylko do odczytu przez HTTP, wykonaj coś takiego:

    $ cd /var/www/htdocs/
    $ git clone --bare /path/to/git_project gitproject.git
    $ cd gitproject.git
    $ mv hooks/post-update.sample hooks/post-update
    $ chmod a+x hooks/post-update

I tyle. Hook `post-update`, który jest częścią Git uruchamia odpowiednie polecenie (`git update-server-info`) po to, aby pobieranie i klonowanie po HTTP działało poprawnie. To polecenie wykonywane jest, gdy do repozytorium pchasz dane po SSH; potem inni mogą sklonować je za pomocą:

    $ git clone http://example.com/gitproject.git

W tym konkretnym przypadku korzystamy ze ścieżki `/var/www/htdocs`, która jest standardowa dla serwera Apache, ale można skorzystać z dowolnego statycznego serwera WWW - wystarczy umieścić w nim czyste repozytorium. Dane Git udostępniane są jako proste pliki statyczne (Rozdział 9 zawiera więcej szczegółów na temat udostępniania danych w ten sposób).

Można również skonfigurować Git tak, by dało się pchać dane przez HTTP, choć ta technika nie jest tak często wykorzystywana i wymaga zaawansowanej konfiguracji WebDAV. Ponieważ nie spotyka się tego za często nie będziemy opisywać takiej konfiguracji w niniejszej książce. Jeśli ciekawi Cię wykorzystanie protokołów HTTP-push, możesz sprawdzić dokument znajdujący się pod adresem `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`. Korzyścią płynącą z udostępnienia możliwości pchania zmian po HTTP jest to, że można wykorzystać w tym celu dowolny serwer WebDAV bez specyficznych funkcji Git; zatem możesz skorzystać z tej opcji, jeśli Twój dostawca pozwala na aktualizację Twojej witryny po WebDAV.

### Zalety

Zaletą korzystania z HTTP jest prostota jego konfiguracji. Wystarczy wykonać kilka prostych poleceń i świat uzyskuje dostęp do odczytu do Twojego repozytorium Git. Potrzeba na to tylko kilku minut. Protokół HTTP nie pochłania także wielu zasobów systemowych serwera. Ponieważ zwykle wykorzystywany jest statyczny serwer HTTP, zwyczajny serwer Apache może udostępniać tysiące plików na sekundę - trudno jest przeciążyć nawet nieduży serwer.

Możesz także udostępniać repozytoria tylko do odczytu przez HTTPS, co oznacza, że możesz szyfrować dane w transmisji; możesz wręcz wymusić na klientach uwierzytelnienie za pomocą certyfikatów SSL. Jeśli jednak dojdzie aż do tego, łatwiej wykorzystać klucze publiczne SSH; ale w Twoim przypadku lepsze może się okazać wykorzystanie podpisanych certyfikatów SSL lub innej metody uwierzytelniania opartej na HTTP w celu udostępniania danych tylko do odczytu po HTTPS.

Inną korzystną cechą jest to, że HTTP jest tak powszechny, że zwykle korporacyjne firewalle nie blokują dostępu do tego portu.

### Wady

Wadą udostępniania repozytorium po HTTP jest to, że ta metoda nie jest zbyt efektywna z punktu widzenia klienta. Zwykle znacznie dłużej trwa sklonowanie lub pobieranie danych z takiego repozytorium i w protokole HTTP istnieje zwykle znacznie większy narzut sieciowy oraz całkowity rozmiar przesyłanych danych niż w każdym innym protokole sieciowym. Ponieważ HTTP nie jest tak inteligentny w kwestii ograniczania przesyłania danych do tych niezbędnych, serwer HTTP nie musi wykonywać żadnych specjalnych czynności poza klasycznym udostępnianiem danych - z tego powodu protokół HTTP zwany jest _głupim_ protokołem. Więcej szczegółów na temat różnic w wydajności między protokołem HTTP i innymi protokołami znajduje się w rozdziale 9.
