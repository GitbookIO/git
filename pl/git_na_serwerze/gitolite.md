# Gitolite

Uwaga: najnowsza wersja tego podrozdziału książki ProGit jest zawsze dostępna na [gitolite documentation][gldpg]. Autor pragnie również pokornie stwierdzić, że chociaż ta część jest dokładna i *może być* (i często *jest*) użyta do instalacji gitolite bez czytania jakiejkolwiek innej dokumentacji, to nie jest kompletna i nie może całkowicie zastąpić ogromnej ilości dokumentacji dołączonej do gitolite.

[gldpg]: http://github.com/sitaramc/gitolite/blob/pu/doc/progit-article.mkd

Git zaczął się stawać bardzo popularny w środowiskach korporacyjnych, które wydają się mieć pewne dodatkowe wymagania w zakresie kontroli dostępu. Gitolite został stworzony aby zaspokoić te wymagania, ale okazuje się, że jest równie przydatny w świecie open source: Fedora Project kontroluje dostęp do swoich repozytoriów dotyczących zarządzania pakietami (ponad 10.000 z nich!) za pomocą gitolite i jest to też prawdopodobnie największa instalacja gitolite gdziekolwiek.

Gitolite pozwala określać uprawnienia nie tylko poprzez repozytorium, ale także przez nazwy gałęzi lub etykiet wewnątrz każdego repozytorium. Oznacza to, że można określić czy niektóre osoby (albo grupy) mogą dodawać tylko ustalone "refs" (gałęzi lub etykiet), a innych już nie.

## Instalacja

Instalacja Gitolite jest bardzo prosta, nawet jeśli nie przeczyta się jego obszernej dokumentacji. Potrzebne będzie konto na jakimś Uniksowym serwerze; przetestowane zostały różne wersje Linuksa i Solaris 10. Uprawnienia administratora nie są potrzebne, zakładając, że git, perl i serwer ssh kompatybilny z openssh są już zainstalowane. W poniższych przykładach będziemy używali konta `gitolite` na serwerze o nazwie `gitserver`.

Gitolite jest dość niezwykły jak na oprogramowanie "serwerowe" -- dostęp odbywa się przez ssh, dzięki czemu każdy użytkownik na serwerze jest potencjalnym "hostem gitolite".  W rezultacie, istnieje pojęcie "instalacji" samego oprogramowania, a następnie "stworzenie" użytkownika jako "hosta gitolite".

Gitolite posiada 4 metody instalacji. Osoby korzystające z systemów Fedora czy Debian mogą go zainstalować z pakietów RPM lub DEB. Osoby z uprawnieniami administratora mogą zainstalować go ręcznie. W tych dwóch przypadkach, każdy użytkownik systemu może stać się "hostem gitolite".

Osoby bez uprawnień administratora mogą go zainstalować we własnym identyfikatorze użytkownika. I wreszcie, gitolite może być instalowany przez uruchomienie skryptu *na stacji roboczej*, z powłoki basha. (Jeśli się nad tym zastanawiasz, to nawet bash pochodzący z msysgit da radę).

W tym artykule opiszemy tą ostatnią metodę; o pozostałych metodach można poczytać w dokumentacji.

Zaczynasz od uzyskania dostępu do serwera w oparciu o klucz publiczny, dzięki czemu ze swojego komputera zalogujesz się do serwera bez podawania hasła. Poniższa metoda działa na Linuksie; na innych systemach możliwe, że trzeba będzie zrobić to ręcznie. Zakładamy, że masz już parę kluczy wygenerowanych przy użyciu `ssh-keygen`.

	$ ssh-copy-id -i ~/.ssh/id_rsa gitolite@gitserver

Zostaniesz poproszony o podanie hasła do konta gitolite, po czym ustawiony zostanie dostęp z klucza publicznego. Jest to **kluczowe** dla skryptu instalacyjnego, więc upewnij się, że możesz uruchomić jakieś polecenie bez monitu o podanie hasła:

	$ ssh gitolite@gitserver pwd
	/home/gitolite

Następnie, trzeba sklonować Gitolite z głównej strony projektu i uruchomić skrypt "easy install" (trzeci argument to twoja nazwa w nowo powstałym repozytorium gitolite-admin):

	$ git clone git://github.com/sitaramc/gitolite
	$ cd gitolite/src
	$ ./gl-easy-install -q gitolite gitserver sitaram

I gotowe! Gitolite został zainstalowany na serwerze, a nowe repozytorium o nazwie `gitolite-admin` zostało utworzone w katalogu domowym twojej stacji roboczej. Zarządzanie gitolite odbywa się poprzez dokonywanie zmian w repozytorium i wysyłanie ich na serwer (jak w Gitosis).

Ostatnie polecenie powoduje pojawienie się sporej ilości danych wyjściowych, które mogą być ciekawe do poczytania. Ponadto, pierwsze uruchomienie tego skryptu powoduje stworzenie nowej pary kluczy; trzeba będzie wybrać hasło (passphrase) lub wcisnąć enter aby nic nie wybrać. Do czego potrzebna jest druga para kluczy i jak jest ona wykorzystywana wyjaśniono w dokumencie "ssh troubleshooting" dołączonym do Gitolite. (W końcu dokumentacja musi się do *czegoś* przydać!)

Repozytoria o nazwach `gitolite-admin` i `testing` są tworzone na serwerze domyślnie. Jeśli chcesz sklonować któreś z nich lokalnie (z konta posiadającego dostęp przez konsolę SSH, do konta gitolite, przy użyciu *authorized_keys*), wpisz:

	$ git clone gitolite:gitolite-admin
	$ git clone gitolite:testing
	
Aby sklonować te same repozytoria z jakiegokolwiek innego konta:

	$ git clone gitolite@servername:gitolite-admin
	$ git clone gitolite@servername:testing


## Dostosowywanie procesu instalacji

Podczas gdy domyślna szybka instalacja działa dla większości osób jest kilka sposobów na dostosowanie jej do naszych potrzeb. Jeżeli pominiesz argument `-q` przejdziesz w tryb instalacji "verbose" -- są to szczegółowe informacje krok po kroku co wykonuje instalator. Tryb "verbose" pozwala również na zmianę pewnych parametrów po stronie serwera, takich jak lokalizacja aktualnego repozytorium, poprzez edytowanie pliku "rc" który jest używany przez serwer. Ten plik jest obficie zakomentowany wiec powinieneś w prosty sposób dokonywać różnych zmian, zapisywać i kontynuować. Plik ten zawiera też różne ustawienia które pozwolą Ci na włączanie i wyłączanie niektórych zaawansowanych możliwości gitolite.

## Plik konfiguracyjny i Kontrola Praw Dostępu

Gdy instalacja jest ukończona przełącz się na repozytorium `gitolite-admin` (znajduję się ono w twoim katalogu HOME) i przejrzyj je aby zobaczyć co otrzymałeś.

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/sitaram.pub
	$ cat conf/gitolite.conf
	#gitolite conf
	# please see conf/example.conf for details on syntax and features

	repo gitolite-admin

	    RW+                 = sitaram

	repo testing

	    RW+                 = @all

Zauważ że "sitaram" (ostatni argument w komendzie `gl-easy-install` którą podałeś wcześniej) posiada prawa odczyt-zapis na repozytorium `gitolite-admin` tak samo jak klucz publiczny z tą samą nazwą.

Składnia pliku konfiguracyjnego dla gitolite jest udokumentowana w `conf/example.conf`, więc omówimy tutaj tylko najważniejsze punkty.  
Dla wygody możesz połączyć użytkowników repozytorium w grupy. Nazwy grup są jak makra: kiedy je definiujesz nie ma znaczenia czy to są użytkownicy czy projekty; to rozróżnienie jest tylko robione gdy *używasz* "macro".

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott     # Adams, not Chacon, sorry :)
	@interns        = ashok     # get the spelling right, Scott!
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

Możesz kontrolować uprawnienia na poziomie "ref". W poniższym przykładzie stażyści mogą wysyłać tylko gałęzie "int". Inżynierowie mogą wysyłać każdą gałąź której nazwa zaczyna się od znaków "eng-", i kończy etykietą zaczynającą się od znaków "rc" za którymi występują liczby dziesiętne.   

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers

	    RW+                     = @admins

Wyrażenie po `RW` lub `RW+` jest wyrażeniem regularnym (regex), według którego sprawdzane jest wysyłane "refname" (ref). Dlatego nazywamy je "refex"! Oczywiście refex jest potężniejsze niż ukazany tutaj przykład. Dlatego nie nadużywaj tego jeżeli nie czujesz się wystarczająco pewnie z wyrażeniami regularnymi w perlu.

Również jak już prawdopodobnie zgadłeś, prefiksy Gitolite `refs/heads/` są składniowym udogodnieniem jeżeli refex nie rozpoczyna się od `refs/`.

Ważną możliwością składni plików konfiguracyjnych jest to że nie ma potrzeby aby wszystkie prawa dla repozytoriów przebywały w jednym miejscu. Możesz trzymać wszystko razem tak jak prawa dla wszystkich `oss_repos` pokazane powyżej. Lub możesz dodać wyszczególnione prawa dla wybranych przypadków później na przykład : 

	repo gitolite
        
        RW+                     = sitaram

Ta reguła zostanie dodana do zbioru reguł dla repozytorium `gitolite`.

W tym punkcie możesz zastanawiać się jak kontrola praw dostępu jest stosowana, omówimy to pokrótce.

Wyróżniamy dwa poziomy dostępu w gitolite. Pierwszy to poziom repozytorium; jeżeli posiadasz dostęp do odczytu (lub zapisu) do każdego ref w repozytorium, wtedy posiadasz prawo do odczytu lub zapisu dla repozytorium. 

Drugi poziom dostępu odnosi się tylko do "zapisu", występuje on przez gałąź lub etykietę w repozytorium. Nazwa użytkownika, usiłowanie dostępu (`W` or `+`), i aktualizowana lub znana 'refname'. Poziomy dostępu są zaznaczane w porządku w jakim pojawiły się w pliku konfiguracyjnym, poszukując dopasowania do tej kombinacji (ale pamiętaj że refname jest dopasowane na podstawie wyrażeń regex nie całkowicie na podstawie łańcucha znaków). Jeżeli znajdziemy dopasowanie operacja wysyłania zakończona jest sukcesem. W przeciwnym wypadku otrzymamy brak dostępu.

## Zaawansowana kontrola dostępu z regułą "odmowy"

Do tej pory uprawnienia widzieliśmy tylko jako jedno z `R`, `RW`, lub `RW+`. Jednakże gitolite pozwala na ustalanie innych uprawnień: `-`odnosi się to do "odmów". Daje Ci to dużo więcej możliwości w zamian za trochę złożoności, ponieważ "fallthrough" nie jest *jedynym* sposobem na odmówienie dostępu. Dlatego *porządek reguł teraz ma znaczenie*!  

Powiedzmy, w sytuacji powyżej chcemy żeby wszyscy inżynierowie byli w stanie "rewind" każdą gałąź *za wyjątkiem* master i integ. Dokonamy tego w ten sposób.

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

Ponownie, po prostu podążasz za regułami od góry do dołu dopóki nie natrafisz na pasującą dla twojego rodzaju dostępu lub odrzucenia. Nie przewijalne (non-rewind) wysyłanie do gałęzi master lub integ jest dozwolone przez pierwszą regułę. "Rewind" (przewijalne) wysyłanie do tamtych "refs" (gałęzi lub etykiet) nie pasuje do pierwszej reguły, przechodzi do drugiej i dlatego jest odrzucone. Każde wysłanie "rewind lub non-rewind" (przewijalne lub nie) do "refs" (gałęzi lub etykiet) innej niż master lub integ nie będzie pasowało do dwóch pierwszych reguł a trzecia reguła pozwoli na to. 

## Ograniczenie wysyłania na podstawie zmian na plikach

Dodatkowo do ograniczeń na gałęzie na które użytkownik może wysyłać zmiany. Możesz również nakładać ograniczenia do których plików jest możliwość dostania się. Na przykład, być może Makefile (czy jakiś inny program) nie jest pożądane aby był zmieniany przez kogokolwiek. Bardzo dużo rzeczy jest od niego zależnych jeżeli zmiany wykonane na tym programie nie będą *poprawne* może to doprowadzić do uszkodzenia. Możesz powiedzieć gitolite: 


    repo foo
        RW                  =   @junior_devs @senior_devs

        RW  NAME/           =   @senior_devs
        -   NAME/Makefile   =   @junior_devs
        RW  NAME/           =   @junior_devs

To wszechstronna możliwość jest udokumentowana w `conf/example.conf`

## Osobiste Gałęzie

Gitolite posiada funkcje zwaną "osobiste gałęzie" (lub raczej, "przestrzeń nazw osobistych gałęzi") może być to bardzo użyteczne w korporacyjnych środowiskach.

Wiele wymiany kodu w świecie gita zdarza się jako żądania pobrania zmian "please pull". W środowisku korporacyjnym jednakże nieautoryzowany dostęp jest nie do przyjęcia, a stanowiska developerskie nie mogą wykonywać uwierzytelniania. Dlatego musisz wysłać wszystko na centralny serwer a następnie poprosić kogoś żeby wysłał to stamtąd.

Takie podejście spowodowałoby takie samo zamieszanie z gałęziami jak w scentralizowanych systemach VCS, dodatkowo ustawianie uprawnień jest harówką dla administratora.

Gitolite pozwala nam na zdefiniowanie prefiksów "osobistych" lub "scratch" przestrzeni nazw dla każdego developera (na przykład `refs/personal/<devname>/*`); zobacz sekcję "osobiste gałęzie" w `doc/3-faq-tips-etc.mkd`.

## Repozytoria "Wildcard"

Gitolite pozwala na wyszczególnienie repozytoriów z "wildcards" (właściwie są to perlowe wyrażenia regexes) jak na przykład `assignments/s[0-9][0-9]/a[0-9][0-9]`, losowy przykład. Jest to *bardzo* wszechstronna możliwość, która musi być aktywowana poprzez ustawienie `$GL_WILDREPOS = 1;` w pliku rc. Umożliwia Ci to przypisywanie nowego typu uprawnień ("C") który pozwala użytkownikowi: stworzyć repozytorium bazując na dzikich kartach, automatycznie przypisać posiadanie dla użytkownika który je stworzył, etc. Ta właściwość jest udokumentowana w `doc/4-wildcard-repositories.mkd`.

## Inne właściwości

Zakończymy tą dyskusje na przykładach innych właściwości. Wszystkie z nich i wiele innych jest świetnie opisana ze szczegółami w "faqs, tips, etc" oraz innych dokumentach.

**Logging** Gitolite zapisuje każdy udany dostęp. Jeżeli zawsze bardzo łatwo nadawałeś ludziom uprawnienia "rewind" (`RW+`) a jakiś dzieciak zniszczy gałąź "master" plik dziennika uratuje Ci życie, jeśli chodzi o łatwe i szybkie znalezienie SHA które zostało zniszczone.

**Git poza normalną ścieżką**: Jednym ekstremalne użytecznym udogodnieniem w gitolite jest wsparcie dla gita zainstalowanego poza normalną ścieżką `$PATH` (jest to bardziej powszechne niż Ci się wydaje, niektóre środowiska korporacyjne lub nawet dostarczyciele hostingu odmawiają instalowania rzeczy na całym systemie. Dlatego często kończysz instalując je w swojej własnej ścieżce). Normalnie jesteś zmuszony do zapewnienia po stronie klienta aby git znał to nie standardowe położenie binarek. Z gitolite wybierz tylko instalacje 'verbose' i ustaw `$GIT_PATH` w plikach "rc". Nie musisz już nic zmieniać po stronie klienta. 

**Raportowanie praw dostępu**: Kolejną wygodną funkcją jest to co się dzieje kiedy po prostu spróbujemy i zalogujemy się do serwera. Gitolite pokazuje nam do jakich repozytoriów i jakiego typu mamy dostęp. Oto przykład:

        hello sitaram, the gitolite version here is v1.5.4-19-ga3397d4
    
        the gitolite config gives you the following access:
             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**Delegacja**: Dla naprawdę dużych instalacji, odpowiedzialność za grupy repozytoriów można oddelegować do różnych osób, aby niezależnie nimi zarządzały. Zmniejsza to obciążenie głównego administratora i czyni go mniej wąskim gardłem. Ta funkcja posiada własny plik dokumentacji w katalogu `doc/`.

**Wsparcie Gitweb**: Gitolite obsługuje gitweb na kilka sposobów. Można określić które repozytoria są widoczne poprzez gitweb. Z pliku konfiguracyjnego gitolite można ustawić "właściciela" i "opis" dla gitweb. Gitweb posiada mechanizm umożliwiający implementację kontroli dostępu opartej na uwierzytelnieniu HTTP, dzięki czemu można użyć "skompilowanego" pliku konfiguracyjnego stworzonego przez gitolite, co oznacza te same zasady kontroli dostępu (do odczytu) dla gitweb oraz gitolite.

**Mirroring**: Gitolite pomaga w utrzymaniu wielu mirrorów i łatwym przełączaniu się między nimi, kiedy główny serwer przestanie działać.
