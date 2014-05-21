# Wstępna konfiguracja Git

Teraz, gdy Git jest już zainstalowany w Twoim systemie, istotne jest wykonanie pewnych czynności konfiguracyjnych. Wystarczy to zrobić raz; konfiguracja będzie obowiązywać także po aktualizacji Git. Ustawienia można zmienić w dowolnym momencie jeszcze raz wykonując odpowiednie polecenia.

Git posiada narzędzie zwane `git config`, które pozwala odczytać, bądź zmodyfikować zmienne, które kontrolują wszystkie aspekty działania i zachowania Git. Zmienne te mogą być przechowywane w trzech różnych miejscach:

*	plik `/etc/gitconfig`: Zawiera wartości zmiennych widoczne dla każdego użytkownika w systemie oraz dla każdego z ich repozytoriów. Jeśli dodasz opcję ` --system` do polecenia `git config`, odczytane bądź zapisane zostaną zmienne z tej właśnie lokalizacji. 
*	plik `~/.gitconfig`: Lokalizacja specyficzna dla danego użytkownika. Za pomocą opcji `--global` można uzyskać dostęp do tych właśnie zmiennych. 
*	plik konfiguracyjny w katalogu git (tzn. `.git/config`) bieżącego repozytorium: zawiera konfigurację charakterystyczną dla tego konkretnego repozytorium. Każdy poziom ma priorytet wyższy niż poziom poprzedni, zatem wartości zmiennych z pliku `.git/config` przesłaniają wartości zmiennych z pliku `/etc/gitconfig`.

W systemie Windows, Git poszukuje pliku `.gitconfig` w katalogu `%HOME%` (`C:\Documents and Settings\%USERNAME%` w większości przypadków). Sprawdza również istnienie pliku `/etc/gitconfig`, choć w tym wypadku katalog ten jest katalogiem względnym do katalogu instalacji MSysGit.

## Twoja tożsamość

Pierwszą rzeczą, którą warto wykonać po instalacji Git jest konfiguracja własnej nazwy użytkownika oraz adresu e-mail. Jest to ważne, ponieważ każda operacja zatwierdzenia w Git korzysta z tych informacji, które stają się integralną częścią zatwierdzeń przesyłanych i pobieranych później do i z serwera:

	$ git config --global user.name "Jan Nowak"
	$ git config --global user.email jannowak@example.com

Jeśli skorzystasz z opcji `--global` wystarczy, że taka konfiguracja zostanie dokonana jednorazowo. Git skorzysta z niej podczas każdej operacji wykonywanej przez Ciebie w danym systemie. Jeśli zaistnieje potrzeba zmiany tych informacji dla konkretnego projektu, można skorzystać z `git config` bez opcji `--global`.

## Edytor

Teraz, gdy ustaliłeś swą tożsamość, możesz skonfigurować domyślny edytor tekstu, który zostanie uruchomiony, gdy Git będzie wymagał wprowadzenia jakiejś informacji tekstowej. Domyślnie Git skorzysta z domyślnego edytora systemowego, którym zazwyczaj jest Vi lub Vim. Jeśli wolisz korzystać z innego edytora, np. z Emacsa, uruchom następujące polecenie:

	$ git config --global core.editor emacs
	
## Narzędzie obsługi różnic

Warto również skonfigurować domyślne narzędzie do rozstrzygania różnic i problemów podczas edycji konfliktów powstałych w czasie operacji łączenia (ang. merge). Jeśli chcesz wykorzystywać w tym celu narzędzie vimdiff, użyj polecenia:

	$ git config --global merge.tool vimdiff

Git zna narzędzia kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge, oraz opendiff. Możesz również użyć własnego narzędzia; rozdział 7 zawiera więcej informacji na ten temat.

## Sprawdzanie ustawień

Jeśli chcesz sprawdzić bieżące ustawienia, wykonaj polecenie `git config --list`. Git wyświetli pełną konfigurację:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Niektóre zmienne mogą pojawić się wiele razy, ponieważ Git odczytuje konfigurację z różnych plików (choćby z `/etc/gitconfig` oraz `~/.gitconfig`). W takim wypadku Git korzysta z ostatniej wartości dla każdej unikalnej zmiennej, którą znajdzie.

Można również sprawdzić jaka jest rzeczywista wartość zmiennej o konkretnej nazwie za pomocą polecenia `git config {zmienna}`:

	$ git config user.name
	Scott Chacon
