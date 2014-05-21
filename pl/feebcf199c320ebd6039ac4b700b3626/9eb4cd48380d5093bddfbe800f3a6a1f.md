# Uruchomienie Git na serwerze

Aby wstępnie skonfigurować dowolny serwer Git należy wyeksportować istniejące repozytorium jak repozytorium czyste - takie, które nie posiada katalogu roboczego. Można to zrobić w bardzo prosty sposób.
Aby sklonować repozytorium jako nowe, czyste repozytorium, należy uruchomić polecenie `clone` z opcją `--bare`. Zgodnie z przyjętą konwencję, czyste repozytorium przechowywane jest w katalogu, którego nazwa kończy się na `.git`, np:

    $ git clone --bare my_project my_project.git
    Initialized empty Git repository in /opt/projects/my_project.git/

Informacje wyświetlane przez to polecenie mogą być mylące. Ponieważ `clone` to tak naprawdę `git init` + `git fetch`, można zobaczyć informacje wyświetlane przez część związaną z `git init`, która powoduje utworzenie pustego katalogu. Ma miejsce rzeczywiste kopiowanie obiektów, ale nie powoduje to wyświetlenia jakiejkolwiek informacji. Teraz powinieneś mieć kopię katalogu Git w katalogu `my_project.git`.

Ogólnie rzecz biorąc odpowiada to następującemu poleceniu:

    $ cp -Rf my_project/.git my_project.git

Istnieje kilka różnic w pliku konfiguracyjnym; ale dla naszych celów polecenia te wykonują te same czynności. Biorą samo repozytorium Git, bez kopii roboczej i tworzą dedykowany dla niego katalog.

## Umieszczanie czystego repozytorium na serwerze

Teraz, gdy posiadasz już czystą kopię repozytorium, pozostaje jedynie umieścić ją na serwerze i odpowiednio skonfigurować wybrane protokoły. Powiedzmy, że masz serwer `git.example.com`, masz do niego dostęp po SSH i chcesz, żeby wszystkie repozytoria przechowywane były w katalogu `/opt/git`. Możesz dodać nowe repozytorium kopiując tam Twoje czyste repozytorium:

    $ scp -r my_project.git user@git.example.com:/opt/git

Od tej chwili inni użytkownicy, którzy mają do tego serwera dostęp SSH oraz uprawnienia do odczytu katalogu `/opt/git` mogą sklonować Twoje repozytorium za pomocą:

    $ git clone user@git.example.com:/opt/git/my_project.git

Jeśli użytkownik może łączyć się z serwerem za pomocą SSH i ma uprawnienia do zapisu dla katalogu `/opt/git/my_project.git`, automatycznie zyskuje możliwość pchania zmian do tego repozytorium. Git automatycznie doda do katalogu dostęp do zapisu dla grupy jeśli uruchomisz polecenie `git init` z opcją `--shared`.

    $ ssh user@git.example.com
    $ cd /opt/git/my_project.git
    $ git init --bare --shared

Widać zatem, że bardzo prosto jest wziąć repozytorium Git, utworzyć jego czystą kopię i umieścić na serwerze do którego posiadasz wraz ze współpracownikami dostęp SSH. Jesteś teraz przygotowany do wspólnej pracy nad danym projektem.

Warto zaznaczyć, że to właściwie wszystko czego potrzeba, aby utworzyć działający serwer Git, do którego dostęp ma kilka osób - wystarczy utworzyć dla nich konta SSH i wstawić czyste repozytorium gdzieś, gdzie osoby te mają dostęp i uprawnienia do zapisu i odczytu. Więcej nie trzeba - można działać.

W następnych sekcjach zobaczysz jak przeprowadzić bardziej zaawansowaną konfigurację. Sprawdzimy jak uniknąć konieczności tworzenia kont użytkowników dla każdej osoby, jak dodać publiczny dostęp tylko do odczytu, jak skonfigurować interfejs WWW, jak wykorzystać narzędzie Gitosis i inne. Miej jednak na uwadze, że do pracy nad prywatnym projektem w kilka osób, _wszystko_, czego potrzeba to serwer z dostępem SSH i czyste repozytorium.

## Prosta konfiguracja

Jeśli pracujesz w niewielkim zespole, albo testujesz Git w firmie i nie masz wielu programistów, wszystko jest proste. Jednym z najbardziej skomplikowanych aspektów konfiguracji serwera Git jest zarządzanie użytkownikami. Jeśli chcesz udostępnić niektóre repozytoria tylko do odczytu dla wybranych użytkowników, a pozwolić innym na zapis do nich, mogą pojawić się problemy z poprawną konfiguracją uprawnień.

### Dostęp SSH

Jeśli już masz serwer, do którego wszyscy programiści mają dostęp SSH najprościej jest właśnie na nim stworzyć pierwsze repozytorium, ponieważ nie wymaga to praktycznie żadnej pracy (jak opisaliśmy to w poprzedniej sekcji). Jeśli potrzebujesz bardziej wyrafinowanej konfiguracji uprawnień dla repozytoriów możesz skorzystać z normalnych uprawnień systemu plików Twojego systemu operacyjnego.

Jeśli zamierzasz umieścić Twoje repozytoria na serwerze, w którym nie istnieją konta użytkowników dla wszystkich osób z zespołu, którym chcesz nadać uprawnienia do zapisu, będziesz musiał dodać im możliwość dostępu po SSH. Zakładamy oczywiście, że na serwerze, na którym chcesz przechowywać repozytoria Git ma już zainstalowany serwer SSH i właśnie w ten sposób uzyskujesz do niego dostęp.

Istnieje kilka sposobów pozwolenia na dostęp osobom z zespołu. Pierwszym z nich jest utworzenie dla wszystkich kont użytkowników. Jest to prosta, ale żmudna czynność. Niekoniecznie możesz mieć ochotę wywoływania wiele razy `adduser` oraz ustawiania haseł tymczasowych dla każdego użytkownika.

Drugi sposób polega na utworzeniu jednego konta użytkownika `git` oraz poproszeniu każdego użytkownika, który ma mieć dostęp do zapisu, by przesłał Ci swój publiczny klucz SSH. Nadesłane klucze należy dodać do pliku `~/.ssh/authorized_keys` w katalogu domowym użytkownika `git`. Od tej chwili każda z osób będzie miała dostęp do serwera jako użytkownik `git`. Nie powoduje to bynajmniej problemów z danymi w commitach - użytkownik SSH, na którego się logujesz nie jest używany do generowania tych danych.

Można jeszcze skonfigurować serwer SSH tak, aby dane uwierzytelniające przechowywane były na serwerze LDAP, albo w innym miejscu do tego przeznaczonym, które możesz posiadać w firmie. Jeśli tylko użytkownik ma dostęp do powłoki systemu każdy mechanizm uwierzytelniania SSH powinien działać.
