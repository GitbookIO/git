# Zmiana bazy

W Git istnieją dwa podstawowe sposoby integrowania zmian z jednej gałęzi do drugiej: scalanie (polecenie `merge`) oraz zmiana bazy (polecenie `rebase`). W tym rozdziale dowiesz się, czym jest zmiana bazy, jak ją przeprowadzić, dlaczego jest to świetne narzędzie i w jakich przypadkach lepiej się powstrzymać od jego wykorzystania.

## Typowa zmiana bazy

Jeśli cofniesz się do poprzedniego przykładu z sekcji Scalanie (patrz Rysunek 3-27), zobaczysz, że rozszczepiłeś swoją pracę i wykonywałeś zmiany w dwóch różnych gałęziach.


![](http://git-scm.com/figures/18333fig0327-tn.png)
 
Figure 3-27. Początkowa historia po rozszczepieniu.

Najprostszym sposobem, aby zintegrować gałęzie - jak już napisaliśmy - jest polecenie `merge`. Przeprowadza ono trójstronne scalanie pomiędzy dwoma ostatnimi migawkami gałęzi (C3 i C4) oraz ich ostatnim wspólnym przodkiem (C2), tworząc nową migawkę (oraz rewizję), tak jak widać to na rysunku 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)
 
Figure 3-28. Scalanie gałęzi integrujące rozszczepioną historię zmian.

Jednakże istnieje inny sposób: możesz stworzyć łatkę ze zmianami wprowadzonymi w C3 i zaaplikować ją na rewizję C4. W Gicie nazywa się to zmianą bazy (ang. rebase). Dzięki poleceniu `rebase` możesz wziąć wszystkie zmiany, które zostały zatwierdzone w jednej gałęzi i zaaplikować je w innej.

W tym wypadku, mógłbyś uruchomić następujące polecenie:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

Polecenie to działa przesuwając się do ostatniego wspólnego przodka obu gałęzi (tej w której się znajdujesz oraz tej *do* której robisz zmianę bazy), pobierając różnice opisujące kolejne zmiany (ang. diffs) wprowadzane przez kolejne rewizje w gałęzi w której się znajdujesz, zapisując je w tymczasowych plikach, następnie resetuje bieżącą gałąź do tej samej rewizji *do* której wykonujesz operację zmiany bazy, po czym aplikuje po kolei zapisane zmiany. Ilustruje to rysunek 3-29.


![](http://git-scm.com/figures/18333fig0329-tn.png)
 
Figure 3-29. Zmiana bazy dla zmian wprowadzonych w C3 do C4.

W tym momencie możesz wrócić do gałęzi `master` i scalić zmiany wykonując proste przesunięcie wskaźnika (co przesunie wskaźnik master na koniec) (rysunek 3-30).


![](http://git-scm.com/figures/18333fig0330-tn.png)
 
Figure 3-30. Przesunięcie gałęzi master po operacji zmiany bazy.

Teraz migawka wskazywana przez C3' jest dokładnie taka sama jak ta, na którą wskazuje C5 w przykładzie ze scalaniem. Nie ma różnicy w produkcie końcowym integracji. Zmiana bazy tworzy jednak czystszą historię. Jeśli przejrzysz historię gałęzi po operacji `rebase`, wygląda ona na liniową: wygląda jakby cała praca była wykonywana stopniowo, nawet jeśli oryginalnie odbywała się równolegle.

Warto korzystać z tej funkcji, by mieć pewność, że rewizje zaaplikują się w bezproblemowy sposób do zdalnej gałęzi - być może w projekcie w którym próbujesz się udzielać, a którym nie zarządzasz. W takim wypadku będziesz wykonywał swoją pracę we własnej gałęzi, a następnie zmieniał jej bazę na `origin/master`, jak tylko będziesz gotowy do przesłania własnych poprawek do głównego projektu. W ten sposób osoba utrzymująca projekt nie będzie musiała dodatkowo wykonywać integracji - jedynie prostolinijne scalenie lub czyste zastosowanie zmian.

Zauważ, że migawka wskazywana przez wynikową rewizję bez względu na to, czy jest to ostatnia rewizja po zmianie bazy lub ostatnia rewizja scalająca po operacji scalania, to taka sama migawka - różnica istnieje jedynie w historii. Zmiana bazy nanosi zmiany z jednej linii pracy do innej w kolejności, w jakiej były one wprowadzane, w odróżnieniu od scalania, które bierze dwie końcówki i integruje je ze sobą.

## Ciekawsze operacje zmiany bazy

Poleceniem `rebase` możesz także zastosować zmiany na innej gałęzi niż ta, której zmieniasz bazę. Dla przykładu - weź historię taką jak na rysunku 3-31. Utworzyłeś gałąź tematyczną (`server`), żeby dodać nowe funkcje do kodu serwerowego, po czym utworzyłeś rewizję. Następnie utworzyłeś gałąź, żeby wykonać zmiany w kliencie (`client`) i kilkukrotnie zatwierdziłeś zmiany. W końcu wróciłeś do gałęzi `server` i wykonałeś kilka kolejnych rewizji.


![](http://git-scm.com/figures/18333fig0331-tn.png)
 
Figure 3-31. Historia z gałęzią tematyczną utworzoną na podstawie innej gałęzi tematycznej.

Załóżmy, że zdecydowałeś się scalić zmiany w kliencie do kodu głównego, ale chcesz się jeszcze wstrzymać ze zmianami po stronie serwera, dopóki nie zostaną one dokładniej przetestowane. Możesz wziąć zmiany w kodzie klienta, których nie ma w kodzie serwera (C8 i C9) i zastosować je na gałęzi głównej używając opcji `--onto` polecenia `git rebase`:

	$ git rebase --onto master server client

Oznacza to mniej więcej "Przełącz się do gałęzi klienta, określ zmiany wprowadzone od wspólnego przodka gałęzi `client` i `server`, a następnie nanieś te zmiany na gałąź główną `master`. Jest to nieco skomplikowane, ale wynik (pokazany na rysunku 3-32) całkiem niezły.


![](http://git-scm.com/figures/18333fig0332-tn.png)
 
Figure 3-32. Zmiana bazy gałęzi tematycznej odbitej z innej gałęzi tematycznej.

Teraz możesz zwyczajnie przesunąć wskaźnik gałęzi głównej do przodu (rysunek 3-33):

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)
 
Figure 3-33. Przesunięcie do przodu gałęzi master w celu uwzględnienia zmian z gałęzi klienta.

Powiedzmy, że zdecydujesz się pobrać i scalić zmiany z gałęzi `server`. Możesz zmienić bazę gałęzi `server` na wskazywaną przez `master` bez konieczności przełączania się do gałęzi `server` używając `git rebase [gałąź bazowa] [gałąź tematyczna]` - w ten sposób zmiany z gałęzi `server` zostaną zaaplikowane do gałęzi bazowej `master`:

	$ git rebase master server

Polecenie odtwarza zmiany z gałęzi `server` na gałęzi `master` tak, jak pokazuje to rysunek 3-34.


![](http://git-scm.com/figures/18333fig0334-tn.png)
 
Figure 3-34. Zmiana bazy gałęzi `serwer` na koniec gałęzi głównej.

Następnie możesz przesunąć gałąź bazową (`master`):

	$ git checkout master
	$ git merge server

Możesz teraz usunąć gałęzie `client` i `server`, ponieważ cała praca jest już zintegrowana i więcej ich nie potrzebujesz pozostawiając historię w stanie takim, jaki obrazuje rysunek 3-35:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)
 
Figure 3-35. Ostateczna historia rewizji.

## Zagrożenia operacji zmiany bazy

Błogosławieństwo, jakie daje możliwość zmiany bazy, ma swoją mroczną stronę. Można ją podsumować jednym zdaniem:

**Nie zmieniaj bazy rewizji, które wypchnąłeś już do publicznego repozytorium.**

Jeśli będziesz się stosował do tej reguły, wszystko będzie dobrze. W przeciwnym razie ludzie cię znienawidzą, a rodzina i przyjaciele zaczną omijać szerokim łukiem.

Stosując operację zmiany bazy porzucasz istniejące rewizje i tworzysz nowe, które są podobne, ale inne. Wypychasz gdzieś swoje zmiany, inni je pobierają, scalają i pracują na nich, a następnie nadpisujesz te zmiany poleceniem `git rebase` i wypychasz ponownie na serwer. Twoi współpracownicy będą musieli scalić swoją pracę raz jeszcze i zrobi się bałagan, kiedy spróbujesz pobrać i scalić ich zmiany z powrotem z twoimi.

Spójrzmy na przykład obrazujący, jak operacja zmiany bazy może spowodować problemy. Załóżmy, że sklonujesz repozytorium z centralnego serwera, a następnie wykonasz bazując na tym nowe zmiany. Twoja historia rewizji wygląda tak jak na rysunku 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)
 
Figure 3-36. Sklonowane repozytorium i dokonane zmiany.

Teraz ktoś inny wykonuje inną pracę, która obejmuje scalenie, i wypycha ją na centralny serwer. Pobierasz zmiany, scalasz nową, zdalną gałąź z własną pracą, w wyniku czego historia wygląda mniej więcej tak, jak na rysunku 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)
 
Figure 3-37. Pobranie kolejnych rewizji i scalenie ich z własnymi zmianami.

Następnie osoba, która wypchnęła scalone zmiany, rozmyśliła się i zdecydowała zamiast scalenia zmienić bazę swoich zmian; wykonuje `git push --force`, żeby zastąpić historię na serwerze. Następnie ty pobierasz dane z serwera ściągając nowe rewizje.


![](http://git-scm.com/figures/18333fig0338-tn.png)
 
Figure 3-38. Ktoś wypycha rewizje po operacji zmiany bazy porzucając rewizje, na których ty oparłeś swoje zmiany.

W tym momencie musisz raz jeszcze scalać tę pracę mimo tego, że już to wcześniej raz zrobiłeś. Operacja zmiany bazy zmienia sumy kontrolne SHA-1 tych rewizji, więc dla Gita wyglądają one jak zupełnie nowe, choć w rzeczywistości masz już zmiany wprowadzone w C4 w swojej historii (rysunek 3-39).


![](http://git-scm.com/figures/18333fig0339-tn.png)
 
Figure 3-39. Scalasz tą samą pracę raz jeszcze tworząc nową rewizję scalającą.

Musisz scalić swoją pracę w pewnym momencie po to, żeby dotrzymywać kroku innym programistom. Kiedy już to zrobisz, Twoja historia zmian będzie zawierać zarówno rewizje C4 jak i C4', które mają różne sumy SHA-1, ale zawierają te same zmiany i mają ten sam komentarz. Jeśli uruchomisz `git log` dla takiej historii, zobaczysz dwie rewizje mające tego samego autora, datę oraz komentarz, co będzie mylące. Co więcej, jeśli wypchniesz tę historię z powrotem na serwer, raz jeszcze wprowadzisz wszystkie rewizje powstałe w wyniku operacji zmiany bazy na serwer centralny, co może dalej mylić i denerwować ludzi.

Jeśli traktujesz zmianę bazy jako sposób na porządkowanie historii i sposób pracy z rewizjami przed wypchnięciem ich na serwer oraz jeśli zmieniasz bazę tylko tym rewizjom, które nigdy wcześniej nie były dostępne publicznie, wówczas wszystko będzie w porządku. Jeśli zaczniesz zmieniać bazę rewizjom, które były już publicznie dostępne, a ludzie mogą na nich bazować swoje zmiany, wówczas możesz wpaść w naprawdę frustrujące tarapaty.
