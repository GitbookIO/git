# Sztuczki i kruczki

Zanim zamkniemy ten rozdział, pokażemy kilka sztuczek, które uczynią twoją pracę prostszą, łatwiejszą i przyjemniejszą. Wielu ludzi używa Gita nie korzystając z przytoczonych tutaj porad, ty też nie musisz, ale przynajmniej powinieneś o nich wiedzieć.

## Auto-uzupełnianie

Jeśli używasz powłoki Bash, Git jest wyposażony w poręczny skrypt auto-uzupełniania. Pobierz kod źródłowy Gita i zajrzyj do katalogu `contrib/completion`. Powinieneś znaleźć tam plik o nazwie `git-completion.bash`. Skopiuj go do swojego katalogu domowego i dodaj do `.bashrc` następującą linijkę:

	source ~/.git-completion.bash

Jeśli chcesz ustawić Gita tak, żeby automatycznie pozwalał na auto-uzupełnianie wszystkim użytkownikom, skopiuj wymieniony skrypt do katalogu `/opt/local/etc/bash_completion.d` na systemach Mac, lub do `/etc/bash_completion.d/` w Linuxie. Jest to katalog skryptów ładowanych automatycznie przez Basha, dzięki czemu opcja zostanie włączona wszystkim użytkownikom.

Jeśli używasz Windows wraz z narzędziem Git Bash, które jest domyślnie instalowane wraz wraz z msysGit, auto-uzupełnianie powinno być pre-konfigurowane i dostępne od razu.

Wciśnij klawisz Tab podczas wpisywania polecenia Gita, a powinieneś ujrzeć zestaw podpowiedzi do wyboru:

	$ git co<tab><tab>
	commit config

W tym wypadku wpisanie git co i wciśnięcie Tab dwukrotnie podpowiada operacje commit oraz config. Dodanie kolejnej literki m i wciśnięcie Tab uzupełni automatycznie polecenie do `git commit`.

Podobnie jest z opcjami, co pewnie przyda ci się znacznie częściej. Na przykład jeżeli chcesz uruchomić polecenie `git log` i nie pamiętasz jednej z opcji, zacznij ją wpisywać i wciśnij Tab aby zobaczyć sugestie:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Jest to bardzo przydatna możliwość pozwalająca na zaoszczędzenie mnóstwa czasu spędzonego na czytaniu dokumentacji.

## Aliasy

Git nie wydedukuje sam polecenia jeśli wpiszesz je częściowo i wciśniesz Enter. Jeśli nie chcesz w całości wpisywać całego tekstu polecenia możesz łatwo stworzyć dla niego alias używając `git config`. Oto kilka przykładów, które mogą ci się przydać: 

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Oznacza to, że na przykład, zamiast wpisywać `git commit`, wystarczy, że wpiszesz `git ci`. Z czasem zaczniesz też stosować także inne polecenia regularnie, nie wahaj się wówczas tworzyć sobie dla nich nowych aliasów.

Technika ta jest także bardzo przydatna do tworzenia poleceń, które uważasz, że powinny istnieć a których brakuje ci w zwięzłej formie. Na przykład, aby skorygować problem z intuicyjnością obsługi usuwania plików z poczekalni, możesz dodać do Gita własny, ułatwiający to alias:

	$ git config --global alias.unstage 'reset HEAD --'

W ten sposób dwa poniższe polecenia są sobie równoważne:

	$ git unstage fileA
	$ git reset HEAD fileA

Od razu polecenie wygląda lepiej. Dość częstą praktyką jest także dodawanie polecenia `last`:

	$ git config --global alias.last 'log -1 HEAD'

Możesz dzięki niemu łatwo zobaczyć ostatnią rewizję:
	
	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Jak można zauważyć, Git zastępuje nowe polecenie czymkolwiek co do niego przypiszesz. Jednakże, możesz chcieć także uruchomić zewnętrzne polecenie zamiast polecenia Gita. Rozpocznij je wówczas znakiem wykrzyknika `!`. Przydaje się to podczas tworzenia własnego narzędzia, które współpracuje z repozytorium Gita. Możemy pokazać to na przykładzie aliasu `git visual` uruchamiającego `gitk`:

	$ git config --global alias.visual "!gitzk"
