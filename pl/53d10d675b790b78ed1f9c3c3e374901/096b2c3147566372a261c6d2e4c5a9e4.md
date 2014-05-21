# Gałęzie zdalne

Zdalne gałęzie są odnośnikami do stanu gałęzi w zdalnym repozytorium. Są to lokalne gałęzie, których nie można zmieniać; są one modyfikowane automatycznie za każdym razem, kiedy wykonujesz jakieś operacje zdalne. Zdalne gałęzie zachowują się jak zakładki przypominające ci, gdzie znajdowały się gałęzie w twoim zdalnym repozytorium ostatnim razem, kiedy się z nim łączyłeś.

Ich nazwy przybierają następującą formę: `(nazwa zdalnego repozytorium)/(nazwa gałęzi)`. Na przykład, gdybyś chciał zobaczyć, jak wygląda gałąź master w zdalnym repozytorium `origin` z chwili, kiedy po raz ostatni się z nim komunikowałeś, musiałbyś sprawdzić gałąź `origin/master`. Jeśli na przykład pracowałeś nad zmianą wraz z partnerem który wypchnął gałąź `iss53`, możesz mieć lokalną gałąź `iss53`, ale gałąź na serwerze będzie wskazywała rewizję znajdującą się pod `origin/iss53`.

Może być to nieco mylące, więc przyjrzyjmy się dokładniej przykładowi. Powiedzmy, że w swojej sieci masz serwer Git pod adresem `git.ourcompany.com`. Po sklonowaniu z niego repozytorium, Git automatycznie nazwie je jako `origin`, pobierze wszystkie dane, stworzy wskaźnik do miejsca gdzie znajduje się gałąź `master` i nazwie ją lokalnie `origin/master`; nie będziesz mógł jej przesuwać. Git da ci także do pracy Twoją własną gałąź `master` zaczynającą się w tym samym miejscu, co zdalna (zobacz Rysunek 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)

Figure 3-22. Po sklonowaniu otrzymasz własną gałąź główną oraz zdalną origin/master wskazującą na gałąź w zdalnym repozytorium.

Jeśli wykonasz jakąś pracę na gałęzi głównej, a w międzyczasie ktoś inny wypchnie zmiany na `git.ourcompany.com` i zaktualizuje jego gałąź główną, wówczas wasze historie przesuną się do przodu w różny sposób. Co więcej, dopóki nie skontaktujesz się z serwerem zdalnym, Twój wskaźnik `origin/master` nie przesunie się (Rysunek 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)
 
Figure 3-23. Kiedy pracujesz lokalnie, wypchnięcie przez kogoś zmian na serwer powoduje, że obie historie zaczynają przesuwać się do przodu w odmienny sposób.

Aby zsynchronizować zmiany uruchom polecenie `git fetch origin`. Polecenie to zajrzy na serwer, na który wskazuje nazwa origin (w tym wypadku `git.ourcompany.com`), pobierze z niego wszystkie dane, których jeszcze nie masz u siebie, i zaktualizuje Twoją lokalną bazę danych przesuwając jednocześnie wskaźnik `origin/master` do nowej, aktualniejszej pozycji (zobacz Rysunek 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)
 
Figure 3-24. Polecenie git fetch aktualizuje zdalne referencje.

Aby zaprezentować fakt posiadania kilku zdalnych serwerów oraz stan ich zdalnych gałęzi, załóżmy, że posiadasz jeszcze jeden firmowy serwer Git, który jest używany wyłącznie przez jeden z twoich zespołów sprintowych. Jest to serwer dostępny pod adresem `git.team1.ourcompany.com`. Możesz go dodać do projektu, nad którym pracujesz, jako nowy zdalny odnośnik uruchamiając polecenie `git remote add` tak, jak pokazaliśmy to w rozdziale 2. Nazwij go `teamone`, dzięki czemu później będziesz używał tej nazwy zamiast pełnego adresu URL (rysunek 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)
 
Figure 3-25. Dodanie kolejnego zdalnego serwera.

Możesz teraz uruchomić polecenie `git fetch teamone` aby pobrać wszystko, co znajduje się na serwerze, a czego jeszcze nie posiadasz lokalnie. Ponieważ serwer ten zawiera podzbiór danych które zawiera serwer `origin`, Git nie pobiera niczego ale tworzy zdalną gałąź `teamone/master` wskazującą na rewizję dostępną w repozytorium `teamone` i jej gałęzi `master` (rysunek 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)
 
Figure 3-26. Dostajesz lokalny odnośnik do gałęzi master w repozytorium teamone.

## Wypychanie zmian

Jeśli chcesz podzielić się swoją gałęzią ze światem, musisz wypchnąć zmiany na zdalny serwer, na którym posiadasz prawa zapisu. twoje lokalne gałęzie nie są automatycznie synchronizowane z serwerem, na którym zapisujesz - musisz jawnie określić gałęzie, których zmianami chcesz się podzielić. W ten sposób możesz używać prywatnych gałęzi do pracy, której nie chcesz dzielić, i wypychać jedynie gałęzie tematyczne, w ramach których współpracujesz.

Jeśli posiadasz gałąź o nazwie `serverfix`, w której chcesz współpracować z innymi, możesz wypchnąć swoje zmiany w taki sam sposób jak wypychałeś je w przypadku pierwszej gałęzi. Uruchom `git push (nazwa zdalnego repozytorium) (nazwa gałęzi)`:

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Posłużyłem się pewnym skrótem. Git automatycznie sam rozwija nazwę `serverfix` do pełnej `refs/heads/serverfix:refs/heads/serverfix`, co oznacza "Weź moją lokalną gałąź serverfix i wypchnij zmiany, aktualizując zdalną gałąź serverfix". Zajmiemy się szczegółowo częścią `refs/heads/` w rozdziale 9, ale ogólnie nie powinieneś się tym przejmować. Możesz także wykonać `git push origin serverfix:serverfix` co przyniesie ten sam efekt - dla Gita znaczy to "Weź moją gałąź serverfix i uaktualnij nią zdalną gałąź serverfix". Możesz używać tego formatu do wypychania lokalnych gałęzi do zdalnych o innej nazwie. Gdybyś nie chciał żeby gałąź na serwerze nazywała się `serverfix` mógłbyś uruchomić polecenie w formie `git push origin serverfix:innanazwagałęzi` co spowodowałoby wypchnięcie gałęzi `serverfix` do `innanazwagałęzi` w zdalnym repozytorium.

Następnym razem kiedy twoi współpracownicy pobiorą dane z serwera, uzyskają referencję do miejsca, w którym została zapisana Twoja wersja `serverfix` pod zdalną gałęzią `origin/serverfix`:

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

Warto zauważyć, że kiedy podczas pobierania ściągasz nową, zdalną gałąź, nie uzyskujesz automatycznie lokalnej, edytowalnej jej wersji. Inaczej mówiąc, w tym przypadku, nie masz nowej gałęzi `serverfix` na której możesz do razu pracować - masz jedynie wskaźnik `origin/serverfix` którego nie można modyfikować.

Aby scalić pobraną pracę z bieżącą gałęzią roboczą uruchom polecenie `git merge origin/serverfix`. Jeśli potrzebujesz własnej gałęzi `serverfix` na której będziesz mógł pracować dalej, możesz ją stworzyć bazując na zdalnej gałęzi w następujący sposób:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Otrzymasz lokalną gałąź, w której będziesz mógł rozpocząć pracę od momentu, w którym znajduje się ona w zdalnej gałązi `origin/serverfix`.

## Gałęzie śledzące

Przełączenie do lokalnej gałęzi ze zdalnej automatycznie tworzy coś, co określa się jako _gałąź śledzącą_. Gałęzie śledzące są gałęziami lokalnymi, które posiadają bezpośrednią relację z gałęzią zdalną. Jeśli znajdujesz się w gałęzi śledzącej, po wpisaniu `git push` Git automatycznie wie, na który serwer wypchnąć zmiany. Podobnie uruchomienie `git pull` w jednej z takich gałęzi pobiera wszystkie dane i odnośniki ze zdalnego repozytorium i automatycznie scala zmiany z gałęzi zdalnej do odpowiedniej gałęzi zdalnej.

Po sklonowaniu repozytorium automatycznie tworzona jest gałąź `master`, która śledzi `origin/master`. Z tego właśnie powodu polecenia `git push` i `git pull` działają od razu, bez dodatkowych argumentów. Jednakże, możesz skonfigurować inne gałęzie tak, żeby śledziły zdalne odpowiedniki. Prosty przypadek to przywołany już wcześniej przykład polecenia `git checkout -b [gałąź] [nazwa zdalnego repozytorium]/[gałąź]`. Jeśli pracujesz z Gitem nowszym niż 1.6.2, możesz także użyć skrótu `--track`:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Żeby skonfigurować lokalną gałąź z inną nazwą niż zdalna, możesz korzystać z pierwszej wersji polecenia podając własną nazwę:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "sf"

Teraz Twoja lokalna gałąź sf będzie pozawalała na automatyczne wypychanie zmian jak i ich pobieranie z origin/serverfix.

## Usuwanie zdalnych gałęzi

Załóżmy, że skończyłeś pracę ze zdalną gałęzią - powiedzmy, że ty i twoi współpracownicy zakończyliście pracę nad nową funkcją i scaliliście zmiany ze zdalną gałęzią główną `master` (czy gdziekolwiek indziej, gdzie znajduje się stabilna wersja kodu). Możesz usunąć zdalną gałąź używając raczej niezbyt intuicyjnej składni `git push [nazwa zdalnego repozytorium] :[gałąź]`. Aby np. usunąć z serwera gałąź `serverfix` uruchom polecenie:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Bum. Nie ma już na serwerze tej gałęzi. Jeśli chcesz, zaznacz sobie tę stronę, ponieważ będziesz potrzebował tego polecenia, a najprawdopodobniej zapomnisz jego składni. Polecenie to można spróbować zapamiętać przypominając sobie składnię `git push [nazwa zdalnego repozytorium] [gałąź lokalna]:[gałąź zdalna]`, którą omówiliśmy odrobinę wcześniej. Pozbywając się części [gałąź lokalna], mówisz mniej więcej "Weź nic z mojej strony i zrób z tego [gałąź zdalną]".
