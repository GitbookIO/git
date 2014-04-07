# Podgląd historii rewizji

Po kilku rewizjach, lub w przypadku sklonowanego repozytorium zawierającego już własną historię, przyjdzie czas, że będziesz chciał spojrzeć w przeszłość i sprawdzić dokonane zmiany. Najprostszym, a zarazem najsilniejszym, służącym do tego narzędziem jest `git log`.

Poniższe przykłady operują na moim, bardzo prostym, demonstracyjnym projekcie o nazwie simplegit. Aby go pobrać uruchom:

	git clone git://github.com/schacon/simplegit-progit.git

Jeśli teraz uruchomisz na sklonowanym repozytorium polecenie `git log`, uzyskasz mniej więcej coś takiego:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit


Domyślnie, polecenie `git log` uruchomione bez argumentów, listuje zmiany zatwierdzone w tym repozytorium w odwrotnej kolejności chronologicznej, czyli pokazując najnowsze zmiany w pierwszej kolejności. Jak widzisz polecenie wyświetliło zmiany wraz z ich sumą kontrolną SHA-1, nazwiskiem oraz e-mailem autora, datą zapisu oraz notką zmiany.

Duża liczba opcji polecenia `git log` oraz ich różnorodność pozwalają na dokładne wybranie interesujących nas informacji. Za chwilę przedstawimy najważniejsze i najczęściej używane spośród nich.

Jedną z najprzydatniejszych opcji jest `-p`. Pokazuje ona różnice wprowadzone z każdą rewizją. Dodatkowo możesz użyć opcji `-2` aby ograniczyć zbiór do dwóch ostatnich wpisów:

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,7 +5,7 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Opcja spowodowała wyświetlenie tych samych informacji z tą różnicą, że bezpośrednio po każdym wpisie został pokazywany tzw. diff, czyli różnica. Jest to szczególnie przydatne podczas recenzowania kodu albo szybkiego przeglądania zmian dokonanych przez twojego współpracownika.
Dodatkowo możesz skorzystać z całej serii opcji podsumowujących wynik działania `git log`. Na przykład, aby zobaczyć skrócone statystyki każdej z zatwierdzonych zmian, użyj opcji `--stat`:

	$ git log --stat 
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Jak widzisz, `--stat` wyświetlił pod każdym wpisem historii listę zmodyfikowanych plików, liczbę zmienionych plików oraz liczbę dodanych i usuniętych linii. Dodatkowo, opcja dołożyła podobne podsumowanie wszystkich informacji na samym końcu wyniku.
Kolejnym bardzo przydatnym parametrem jest `--pretty`. Pokazuje on wynik polecenia log w nowym, innym niż domyślny formacie. Możesz skorzystać z kilku pre-definiowanych wariantów. Opcja `oneline` wyświetla każdą zatwierdzoną zmianę w pojedynczej linii, co szczególnie przydaje się podczas wyszukiwania w całym gąszczu zmian. Dodatkowo, `short`, `full` oraz `fuller` pokazują wynik w mniej więcej tym samym formacie ale odpowiednio z odrobiną więcej lub mniej informacji:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

Najbardziej interesująca jest tutaj jednak opcja `format`. Pozwala ona określić własny wygląd i format informacji wyświetlanych poleceniem log. Funkcja przydaje się szczególnie podczas generowania tychże informacji do dalszego, maszynowego przetwarzania - ponieważ sam definiujesz ściśle format, wiesz, że nie zmieni się on wraz z kolejnymi wersjami Gita:

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Tabela 2-1 pokazuje najprzydatniejsze opcje akceptowane przez `format`.

	Opcja	Opis
	%H	Suma kontrolna zmiany
	%h	Skrócona suma kontrolna zmiany
	%T	Suma kontrolna drzewa
	%t	Skrócona suma kontrolna drzewa
	%P	Sumy kontrolne rodziców
	%p	Skrócone sumy kontrolne rodziców
	%an	Nazwisko autora
	%ae	Adres e-mail autora
	%ad	Data autora (format respektuje opcję -date=)
	%ar	Względna data autora
	%cn	Nazwisko zatwierdzającego zmiany
	%ce	Adres e-mail zatwierdzającego zmiany
	%cd	Data zatwierdzającego zmiany
	%cr	Data zatwierdzającego zmiany, względna
	%s	Temat

Pewnie zastanawiasz się jaka jest różnica pomiędzy _autorem_ a _zatwierdzającym_zmiany_. Autor to osoba, która oryginalnie stworzyła pracę a zatwierdzający zmiany to osoba, która ostatnia wprowadziła modyfikacje do drzewa. Jeśli zatem wysyłasz do projektu łatkę a następnie któryś z jego członków nanosi ją na projekt, oboje zastajecie zapisani w historii - ty jako autor, a członek zespołu jako osoba zatwierdzająca. Powiemy więcej o tym rozróżnieniu w rozdziale 5.

Wspomniana już wcześniej opcja `oneline` jest szczególnie przydatna w parze z z inną, a mianowicie, `--graph`. Tworzy ona mały, śliczny graf ASCII pokazujący historię gałęzi oraz scaleń, co w pełnej krasie można zobaczyć na kopii repozytorium Grita:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\  
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/  
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Są to jedynie podstawowe opcje formatowania wyjścia polecenia `git log` - jest ich znacznie więcej. Tabela 2-2 uwzględnia zarówno te które już poznałeś oraz inne, często wykorzystywane, wraz ze opisem każdej z nich.

	Opcja	Opis
	-p	Pokaż pod każdą zmianą powiązaną łatkę
	--stat	Pokaż pod każdą zmianą statystyki zmodyfikowanych plików
	--shortstat	Pokaż wyłącznie zmienione/wstawione/usunięte linie z polecenia --stat
	--name-only	Pokaż pod każdą zmianą listę zmodyfikowanych plików
	--name-status	Pokaż listę plików o dodanych/zmodyfikowanych/usuniętych informacjach.
	--abbrev-commit	Pokaż tylko pierwsze kilka znaków (zamiast 40-tu) sumy kontrolnej SHA-1.
	--relative-date	Pokaż datę w formacie względnym (np. 2 tygodnie temu)
	--graph	Pokaż graf ASCII gałęzi oraz historię scaleń obok wyniku.
	--pretty	Pokaż zatwierdzone zmiany w poprawionym formacie. Dostępne opcje obejmują oneline, short, full, fuller oraz format (gdzie określa własny format)

## Ograniczanie wyniku historii

Jako dodatek do opcji formatowania, git log przyjmuje także zestaw parametrów ograniczających wynik do określonego podzbioru. Jeden z takich parametrów pokazaliśmy już wcześniej: opcja `-2`, która spowodowała pokazanie jedynie dwóch ostatnich rewizji. Oczywiście, możesz podać ich dowolną liczbę - `-<n>`, gdzie `n` jest liczbą całkowitą. Na co dzień raczej nie będziesz używał jej zbyt często, ponieważ Git domyślnie przekazuje wynik do narzędzia stronicującego, w skutek czego i tak jednocześnie widzisz tylko jedną jego stronę.

Inaczej jest z w przypadku opcji ograniczania w czasie takich jak `--since` (od) oraz `--until` (do) które są wyjątkowo przydatne. Na przykład, poniższe polecenie pobiera listę zmian dokonanych w ciągu ostatnich dwóch tygodni:

	$ git log --since=2.weeks

Polecenie to obsługuje mnóstwo formatów - możesz uściślić konkretną datę (np. "2008-01-15") lub podać datę względną jak np. 2 lata 1 dzień 3 minuty temu.

Możesz także odfiltrować listę pozostawiając jedynie rewizje spełniające odpowiednie kryteria wyszukiwania. Opcja `--author` pozwala wybierać po konkretnym autorze, a opcja `--grep` na wyszukiwanie po słowach kluczowych zawartych w notkach zmian. (Zauważ, że jeżeli potrzebujesz określić zarówno autora jak i słowa kluczowe, musisz dodać opcję `--all-match` - w przeciwnym razie polecenie dopasuje jedynie wg jednego z kryteriów).

Ostatnią, szczególnie przydatną opcją, akceptowaną przez `git log` jako filtr, jest ścieżka. Możesz dzięki niej ograniczyć wynik wyłącznie do rewizji, które modyfikują podane pliki. Jest to zawsze ostatnia w kolejności opcja i musi być poprzedzona podwójnym myślnikiem `--`, tak żeby oddzielić ścieżki od pozostałych opcji.

W tabeli 2-3 znajduje się ta jak i kilka innych często używanych opcji.

	Opcja	Opis
	-(n)	Pokaż tylko ostatnie n rewizji.
	--since, --after	Ogranicza rewizje do tych wykonanych po określonej dacie.
	--until, --before	Ogranicza rewizje do tych wykonanych przed określoną datą.
	--author	Pokazuje rewizje, których wpis autora pasuje do podanego.
	--committer	Pokazuje jedynie te rewizje w których osoba zatwierdzająca zmiany pasuje do podanej.

Na przykład, żeby zobaczyć wyłącznie rewizje modyfikujące pliki testowe w historii plików źródłowych Git-a zatwierdzonych przez Junio Hamano, ale nie zespolonych w październiku 2008, możesz użyć następującego polecenia:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Z prawie 20000 rewizji w historii kodu Gita, podane polecenie wyłowiło jedynie 6 spełniających zadane kryteria.

## Wizualizacja historii w interfejsie graficznym

Do wyświetlania historii rewizji możesz także użyć narzędzi okienkowych - być może spodoba ci się na przykład napisany w Tcl/Tk program o nazwie gitk, który jest dystrybuowany wraz z Gitem. Gitk to proste narzędzie do wizualizacji wyniku polecenia `git log` i akceptuje ono prawie wszystkie, wcześniej wymienione, opcje filtrowania. Po uruchomieniu gitk z linii poleceń powinieneś zobaczyć okno podobne do widocznego na ekranie 2-2.


![](http://git-scm.com/figures/18333fig0202-tn.png)
 
Figure 2-2. Graficzny interfejs programu gitk przedstawiający historię rewizji.

Historia wraz z grafem przodków znajduje się w górnej połówce okna. W dolnej części znajdziesz przeglądarkę różnic pokazującą zmiany wnoszone przez wybraną rewizję.
