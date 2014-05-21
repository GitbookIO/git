# Hosting Gita

Jeśli nie chcesz przechodzić przez wszystkie prace związane z tworzeniem własnego serwera Gita, masz do wyboru kilka opcji hostingu swojego projektu na zewnętrznej stronie hostingowej. Sposób ten oferuje szereg zalet: strony hostingowe są zazwyczaj szybkie w konfiguracji i łatwe do uruchomienia projektu, nie masz własnego zaangażowania w monitorowanie i obsługę serwerów. Nawet jeśli założysz swój własny wewnętrzny serwer to nadal możesz korzystać w publicznej witryny, gdzie dużo łatwiej znaleźć pomoc.

Na dzień dzisiejszy masz do wyboru bardzo dużo stron hostingowych. Każda z nich posiada swoje wady i zalety. Aby zobaczyć aktualną listę takich stron odwiedź adres:

	https://git.wiki.kernel.org/index.php/GitHosting

Ponieważ nie możemy opisać wszystkich z nich, a zdarza mi się na jednej z nich pracować, w tym rozdziale przejdziemy przez założenie konta i utworzenie nowego projektu w GitHubie. Da nam to wyobrażenie o tym co jest potrzebne.

GitHub jest zdecydowanie największą stroną hostingową Gita. Jako jedna z nielicznych oferuje zarówno publiczne, jak i prywatne opcje hostingu, dzięki czemu można przechowywać kod otwarty i prywatny w jednym miejscu. GitHub został prywatnie użyty do tworzenia tej właśnie książki.

## GitHub

GitHub jest nieco inny od reszty stron hostingowych ze względu na przestrzenie nazw projektów. Zamiast być w oparciu o projekt, GitHub jest głównie w oparciu o użytkownika. Oznacza to, że np. mój projekt `grit` na GitHubie nie znajduje się w `github.com/grit`, lecz w `github.com/schacon/grit`. Nie ma dzięki temu konieczności tworzenia wersji każdego projektu i pozwala na płynne przejście z jednego użytkownika na drugiego, jeśli któryś porzuca projekt.

GitHub jest również spółką handlową, która pobiera opłaty za utrzymanie prywatnych repozytoriów, lecz każdy może bez problemu dostać darmowe konto gościa dla darmowych projektów. Przejdziemy szybko przez ten proces.

## Konfigurowanie konta użytkownika

Pierwszą rzeczą jaką musisz zrobić jest założenie darmowego konta użytkownika. W tym celu wchodzisz na stronę rejestracji `http://github.com/plans` i klikasz przycisk "Zarejestruj się" na darmowe konto (patrz rysunek 4-2) i jesteś już przeniesiony na stronę rejestracji.


![](http://git-scm.com/figures/18333fig0402-tn.png)

Figure 4-2. Strona rejestracji GitHub.

Tutaj musisz wybrać nazwę użytkownika, taką która nie istnieje jeszcze w systemie, podać adres e-mail, który będzie powiązany z kontem i podać hasło Rysunek 4-3).


![](http://git-scm.com/figures/18333fig0403-tn.png)
 
Figure 4-3. Rejestracja użytkownika GitHub.

Jeśli jest to możliwe to jest to dobry moment aby dodać swój publiczny klucz SSH. W rozdziale "Simple Setups" wyjaśniliśmy już jak wygenerować nowy klucz. Skopiuj zawartość klucza i wklej go w polu "SSH Public Key". Kliknięcie "explain ssh keys" przeniesie Cię do szczegółowych informacji jak zrobić to na poszczególnych systemach operacyjnych.
Kliknięcie "I agree, sign me up" powoduje przeniesienie do nowego panelu użytkownika (patrz rysunek 4-4).


![](http://git-scm.com/figures/18333fig0404-tn.png)
 
Figure 4-4. Panel użytkownika GitHub.

Następnie możesz utworzyć nowe repozytorium.

## Tworzenie nowego repozytorium

Zacznij klikając na link "create a new one" obok Twoich repozytoriów na panelu użytkownika. Jesteś na stronie do tworzenia nowego repozytorium (patrz rysunek 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)
 
Figure 4-5. Tworzenie nowego repozytorium na GitHubie.

Wszystko co tak naprawdę musisz zrobić to podać nazwę projektu. Możesz też podać dodatkowy opis. Kiedy to zrobisz klikasz przycisk "Create Repository". Masz już nowe repozytorium na GitHubie (patrz rysunek 4-6).


![](http://git-scm.com/figures/18333fig0406-tn.png)
 
Figure 4-6. Główne informacje o projekcie.

Ponieważ nie masz tam jeszcze kodu, GitHub pokaże instrukcje jak stworzyć zupełnie nowy projekt. Wciśnij istniejący już projekt, lub zaimportuj projekt z publicznego repozytorium Subversion (patrz rysunek 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)
 
Figure 4-7. Instrukcja tworzenia nowego repozytorium.

Instrukcje te są podobne do tego co już przeszedłeś. Aby zainicjować projekt, jeśli nie jest jeszcze projektem gita, możesz użyć:

	$ git init
	$ git add .
	$ git commit -m 'initial commit'

Kiedy masz już lokalne repozytorium Gita, dodaj GitHub jako zdalne repozytorium i wyślij swoją główną gałąź:

	$ git remote add origin git@github.com:testinguser/iphone_project.git
	$ git push origin master

Teraz Twój projekt jest już utrzymywany na GitHubie. Możesz każdemu udostępnić swój projekt wysyłając adres URL. W naszym przypadku jest to `http://github.com/testinguser/iphone_project`. Możesz także zobaczyć na nagłówku każdego z projektów, że masz dwa adresy URL (patrz rysunek 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)
 
Figure 4-8. Nagłówek projektu z prywatnym i publicznym adresem URL.

Publiczny adres URL służy tylko do pobierania repozytorium projektu. Zachęcamy do umieszczania go na stronach WWW.

Prywatny adres URL służy do pobierania i wysyłania repozytorium na serwer. Korzystać można z niego tylko wtedy, kiedy zostanie skojarzony z kluczem publicznym wysłanym do każdego użytkownika. Kiedy inni będą odwiedzać stronę projektu, będą widzieć tylko adres publiczny.

## Import z Subversion

Jeśli masz już projekt publiczny Subversion, który chcesz zaimportować do Gita, GitHub często może zrobić to dla Ciebie. Na dole strony instrukcji jest link służący do importu Subversion. Po kliknięciu na niego pojawi się formularz z informacjami o imporcie projektu i pole gdzie można wkleić adres swojego publicznego projektu Subversion (patrz rysunek 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)
 
Figure 4-9. Interfejs importowanie Subversion.

Jeśli Twój projekt jest bardzo duży, niestandardowy lub prywatny to proces ten najprawdopodobniej nie zadziała. W rozdziale 7 dowiesz się jak ręcznie przeprowadzić bardziej skomplikowany import.

## Dodawanie Współpracowników

Dodajmy więc resztę naszej drużyny. Jeśli John, Josie i Jessica zapiszą się do konta GitHub oraz jeśli chcesz dać im możliwość wykonywania komendy `push` do Twojego repozytorium, możesz dodać ich do projektu jako współpracowników. Takie postępowanie dopuści pushe z ich kluczy publicznych do pracy.

Naciśnij przycisk "edit" na nagłówku projektu lub w zakładce Admina na górze projektu aby uzyskać dostęp do strony Admina projektu GitHub (zobacz Rysunek 4-10).


![](http://git-scm.com/figures/18333fig0410-tn.png)
 
Figure 4-10. Strona administratora GitHub.

Aby dać dostęp do projektu kolejnej osobie, naciśnij link “Add another collaborator”. Pojawia się nowe pole tekstowe gdzie można wpisać nazwę użytkownika. Jak już wpiszesz nazwę użytkownika, wyskakujące okienko podpowie Ci pasujących do nazwy użytkowników. Kiedy znajdziesz prawidłowego użytkownika, naciśnij przycisk "Add" aby dodać użytkownika do współpracowników w Twoim projekcie (zobacz Rysunek 4-11).


![](http://git-scm.com/figures/18333fig0411-tn.png)
 
Figure 4-11. Dodawanie współpracowników do Twojego projektu.

Kiedy skończysz dodawanie współpracowników, powinieneś zobaczyć ich listę w okienku "Repository Collaborators" (zobacz Rysunek 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)
 
Figure 4-12. Lista współpracowników w Twoim projekcie.

Jeśli musisz zablokować dostęp poszczególnym osobom, możesz kliknąć link "revoke", w ten sposób usuniesz możliwość użycia komendy "push". Dla przyszłych projektów, możesz skopiować grupę współpracowników kopiując ich dane dostępowe w istniejącym projekcie.

## Twój projekt

Po tym jak wyślesz swój projekt lub zaimportujesz z Subversion, będziesz miał stronę główną projektu wyglądającą jak na Rysunku 4-13.


![](http://git-scm.com/figures/18333fig0413-tn.png)
 
Figure 4-13. Strona główna projektu GitHub.

Kiedy ludzie będą odwiedzali Twój projekt, zobaczą tę stronę. Zawiera ona kilka kart. Karta zatwierdzeń pokazuje zatwierdzenia w odwrotnej kolejności, tak samo jak w przypadku polecenia `git log`. Karta połączeń pokazuje wszystkich którzy zrobili rozwidlenie Twojego projektu i uzupełniają go. Karta ściągnięć pozwala ci załadować pliki binarne do projektu oraz linki do paczek z kodami i spakowane wersje wszystkich zaznaczonych punktów w projekcie. Karta Wiki pozwala na dodawanie dokumentacji oraz informacji do projektu. Karta Grafów pokazuje w graficzny sposób statystyki użytkowania projektu. Głowna karta z plikami źródłowymi, które lądują w projekcie pokazuje listę katalogów w projekcie i automatycznie renderuje plik README poniżej jeśli taki znajduje się w głównym katalogu projektu. Ta karta pokazuje również okno z zatwierdzeniami.

## Rozwidlanie projektu

Jeśli chcesz przyczynić się do rozwoju istniejącego projektu, w którym nie masz możliwości wysyłania, GitHub zachęca do rozwidlania projektu. Kiedy znajdziesz się na stronie która wydaje się interesująca i chcesz pogrzebać w niej trochę, możesz nacisnąć przycisk "fork" w nagłówku projektu aby GitHub skopiował projekt do Twojego użytkownika tak abyś mógł do niego wprowadzać zmiany.

W tego typu projektach nie musimy martwić się o dodawanie współpracowników aby nadać im prawo do wysyłania. Ludzie mogą rozwidlić projekt i swobodnie wysyłać do niego, a główny opiekun projektu może pobrać te zmiany dodając gałąź jako zdalną i połączyć go z głównym projektem.

Aby rozwidlić projekt, odwiedź stronę projektu (w tym przykładzie, mojombo/chronic) i naciśnij przycisk "fork" w nagłówku (zobacz Rysunek 4-14).


![](http://git-scm.com/figures/18333fig0414-tn.png)
 
Figure 4-14. Pozyskanie zapisywalnej wersji projektu poprzez użycie "fork".

Po kilku sekundach zostaniesz przeniesiony na swoją stronę projektu, która zawiera informacje, że dany projekt został rozwidlony (zobacz Rysunek 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)
 
Figure 4-15. Twoje rozwidlenie projektu.

## Podsumowanie GitHub

To już wszystko o GitHub, ale ważne jest aby zaznaczyć jak szybko można to wszystko zrobić. Możesz stworzyć konto, dodać nowy projekt i wysłać go w kilka minut. Jeśli Twój projekt jest typu open source, dodatkowo zyskujesz ogromną społeczność programistów, którzy mają teraz wgląd do twojego projektu i mogą pomóc w jego rozwoju tworząc rozwidlenie. W ostateczności, może to być sposób na zaznajomienie się i szybkie wypróbowanie Gita.
