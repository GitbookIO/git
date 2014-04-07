# Podstawy rozgałęziania i scalania

Zajmijmy się prostym przykładem rozgałęziania i scalania używając schematu, jakiego mógłbyś użyć w rzeczywistej pracy. W tym celu wykonasz następujące czynności:

1. Wykonasz pracę nad stroną internetową.
2. Stworzysz gałąź dla nowej funkcji, nad którą pracujesz.
3. Wykonasz jakąś pracę w tej gałęzi.

Na tym etapie otrzymasz telefon, że inny problem jest obecnie priorytetem i potrzeba błyskawicznej poprawki. Oto, co robisz:

1. Powrócisz na gałąź produkcyjną.
2. Stworzysz nową gałąź, by dodać tam poprawkę.
3. Po przetestowaniu, scalisz gałąź z poprawką i wypchniesz zmiany na serwer produkcyjny.
4. Przełączysz się na powrót do gałęzi z nową funkcją i będziesz kontynuować pracę.

## Podstawy rozgałęziania

Na początek załóżmy, że pracujesz nad swoim projektem i masz już zatwierdzonych kilka zestawów zmian (patrz Rysunek 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)
 
Figure 3-10. Krótka i prosta historia zmian.

Zdecydowałeś się zająć problemem #53 z systemu śledzenia zgłoszeń, którego używa Twoja firma, czymkolwiek by on nie był. Dla ścisłości, Git nie jest powiązany z żadnym konkretnym systemem tego typu; tym niemniej ponieważ problem #53 to dość konkretny temat, utworzysz nową gałąź by się nim zająć. Aby utworzyć gałąź i jednocześnie się na nią przełączyć, możesz wykonać polecenie `git checkout` z przełącznikiem `-b`:

	$ git checkout -b iss53
	Switched to a new branch "iss53"

Jest to krótsza wersja:

	$ git branch iss53
	$ git checkout iss53

Figure 3-11 pokazuje wynik.


![](http://git-scm.com/figures/18333fig0311-tn.png)
 
Figure 3-11. Tworzenie wskaźnika nowej gałęzi.

Pracujesz nad swoim serwisem WWW i zatwierdzasz kolejne zmiany. Każdorazowo naprzód przesuwa się także gałąź `iss53`, ponieważ jest aktywna (to znaczy, że wskazuje na nią wskaźnik HEAD; patrz Rysunek 2-12):

	$ vim index.html
	$ git commit -a -m 'nowa stopka [#53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)
 
Figure 3-12. Gałąź iss53 przesunęła się do przodu wraz z postępami w Twojej pracy.

Teraz właśnie otrzymujesz telefon, że na stronie wykryto błąd i musisz go natychmiast poprawić. Z Gitem nie musisz wprowadzać poprawki razem ze zmianami wykonanymi w ramach pracy nad `iss35`. Co więcej, nie będzie cię również kosztować wiele wysiłku przywrócenie katalogu roboczego do stanu sprzed tych zmian, tak, by nanieść poprawki na kod, który używany jest na serwerze produkcyjnym. Wszystko, co musisz teraz zrobić, to przełączyć się z powrotem na gałąź master.

Jednakże, nim to zrobisz, zauważ, że, jeśli Twój katalog roboczy lub poczekalnia zawierają niezatwierdzone zmiany, które są w konflikcie z gałęzią, do której chcesz się teraz przełączyć, Git nie pozwoli ci zmienić gałęzi. Przed przełączeniem gałęzi najlepiej jest doprowadzić katalog roboczy do czystego stanu. Istnieją sposoby pozwalające obejść to ograniczenie (mianowicie schowek oraz poprawianie zatwierdzonych już zmian) i zajmiemy się nimi później. Póki co zatwierdziłeś wszystkie swoje zmiany, więc możesz przełączyć się na swoją gałąź master:

	$ git checkout master
	Switched to branch "master"

W tym momencie Twój katalog roboczy projektu jest dokładnie w takim stanie, w jakim był zanim zacząłeś pracę nad problemem #53, więc możesz skoncentrować się na swojej poprawce. Jest to ważna informacja do zapamiętania: Git resetuje katalog roboczy, by wyglądał dokładnie jak migawka zestawu zmian wskazywanego przez aktywną gałąź. Automatycznie dodaje, usuwa i modyfikuje pliki, by upewnić się, że kopia robocza wygląda tak, jak po ostatnich zatwierdzonych w niej zmianach.

Masz jednak teraz do wykonania ważną poprawkę. Stwórzmy zatem gałąź, na której będziesz pracował do momentu poprawienia błędu (patrz Rysunek 3-13):

	$ git checkout -b 'hotfix'
	Switched to a new branch "hotfix"
	$ vim index.html
	$ git commit -a -m 'poprawiony adres e-mail'
	[hotfix]: created 3a0874c: "poprawiony adres e-mail"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)
 
Figure 3-13. Gałąź hotfix bazująca na gałęzi master.

Możesz uruchomić swoje testy, upewnić się, że poprawka w gałęzi hotfix jest tym, czego potrzebujesz i scalić ją na powrót z gałęzią master, by następnie przenieść zmiany na serwer produkcyjny. Robi się to poleceniem `git merge`:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast forward
	 README |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Rezultat polecenia scalenia zawiera frazę „Fast forward”. Ponieważ zestaw zmian wskazywany przez scalaną gałąź był bezpośrednim rodzicem aktualnego zestawu zmian, Git przesuwa wskaźnik do przodu. Innymi słowy, jeśli próbujesz scalić zestaw zmian z innym, do którego dotrzeć można podążając wzdłuż historii tego pierwszego, Git upraszcza wszystko poprzez przesunięcie wskaźnika do przodu, ponieważ nie ma po drodze żadnych rozwidleń do scalenia — stąd nazwa „fast forward” („przewijanie”).

Twoja zmiana jest teraz częścią migawki zestawu zmian wskazywanego przez gałąź `master` i możesz zaktualizować kod na serwerze produkcyjnym (zobacz Rysunek 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)
 
Figure 3-14. Po scaleniu Twoja gałąź master wskazuje to samo miejsce, co gałąź hotfix.

Po tym, jak Twoje niezwykle istotne poprawki trafią na serwer, jesteś gotowy powrócić do uprzednio przerwanej pracy. Najpierw jednak usuniesz gałąź hotfix, gdyż nie jest już ci potrzebna — gałąź `master` wskazuje to samo miejsce. Możesz ją usunąć używając opcji `-d` polecenia `git branch`:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Teraz możesz przełączyć się z powrotem do gałęzi z rozpoczętą wcześniej pracą nad problemem #53 i kontynuować pracę (patrz Rysunek 3-15):

	$ git checkout iss53
	Switched to branch "iss53"
	$ vim index.html
	$ git commit -a -m 'skończona nowa stopka [#53]'
	[iss53]: created ad82d7a: "skończona nowa stopka [#53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)
 
Figure 3-15. Twoja gałąź iss53 może przesuwać się do przodu niezależnie.

Warto tu zauważyć, że praca, jaką wykonałeś na gałęzi `hotfix` nie jest uwzględniona w plikach w gałęzi `iss53`. Jeśli jej potrzebujesz, możesz scalić zmiany z gałęzi `master` do gałęzi `iss53`, uruchamiając `git merge master`, możesz też zaczekać z integracją zmian na moment, kiedy zdecydujesz się przenieść zmiany z gałęzi `iss53` z powrotem do gałęzi `master`.

## Podstawy scalania

Załóżmy, że zdecydowałeś, że praca nad problemem #53 dobiegła końca i jest gotowa, by scalić ją do gałęzi `master`. Aby to zrobić, scalisz zmiany z gałęzi `iss53` tak samo, jak wcześniej zrobiłeś to z gałęzią `hotfix`. Wszystko, co musisz zrobić, to przełączyć się na gałąź, do której chcesz zmiany scalić, a następnie uruchomić polecenie `git merge`:

	$ git checkout master
	$ git merge iss53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Wygląda to odrobinę inaczej, niż w przypadku wcześniejszego scalenia gałęzi `hotfix`. W tym wypadku Twoja historia rozwoju została rozszczepiona na wcześniejszym etapie. Ponieważ zestaw zmian z gałęzi, na której obecnie jesteś, nie jest bezpośrednim potomkiem gałęzi, którą scalasz, Git musi w końcu popracować. W tym przypadku Git przeprowadza scalenie trójstronne (ang. three-way merge), używając dwóch migawek wskazywanych przez końcówki gałęzi oraz ich wspólnego przodka. Rysunek 3-16 pokazuje trzy migawki, których w tym przypadku Git używa do scalania.


![](http://git-scm.com/figures/18333fig0316-tn.png)
 
Figure 3-16. Git automatycznie odnajduje najlepszego wspólnego przodka, który będzie punktem wyjściowym do scalenia gałęzi.

Zamiast zwykłego przeniesienia wskaźnika gałęzi do przodu, Git tworzy nową migawkę, która jest wynikiem wspomnianego scalenia trójstronnego i automatycznie tworzy nowy zestaw zmian, wskazujący na ową migawkę (patrz Rysunek 3-17). Określane jest to mianem zmiany scalającej (ang. merge commit), która jest o tyle wyjątkowa, że posiada więcej niż jednego rodzica.

Warto zaznaczyć, że Git sam określa najlepszego wspólnego przodka do wykorzystania jako punkt wyjściowy scalenia; różni się to od zachowania CVS czy Subversion (przed wersją 1.5), gdzie osoba scalająca zmiany musi punkt wyjściowy scalania znaleźć samodzielnie. Czyni to scalanie w Gicie znacznie łatwiejszym, niż w przypadku tamtych systemów.


![](http://git-scm.com/figures/18333fig0317-tn.png)
 
Figure 3-17. Git automatycznie tworzy nowy zestaw zmian zawierający scaloną pracę.

Teraz, kiedy Twoja praca jest już scalona, nie potrzebujesz dłużej gałęzi `iss53`. Możesz ją usunąć, a następnie ręcznie zamknąć zgłoszenie w swoim systemie śledzenia zadań:

	$ git branch -d iss53

## Podstawowe konflikty scalania

Od czasu do czasu proces scalania nie przebiega tak gładko. Jeśli ten sam plik zmieniłeś w różny sposób w obu scalanych gałęziach, Git nie będzie w stanie scalić ich samodzielnie. Jeśli Twoja poprawka problemu #53 zmieniła tę samą część pliku, co zmiana w gałęzi `hotfix`, podczas scalania otrzymasz komunikat o konflikcie, wyglądający jak poniżej:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git nie zatwierdził automatycznie zmiany scalającej. Wstrzymał on cały proces do czasu rozwiązania konfliktu przez Ciebie. Jeśli chcesz zobaczyć, które pliki pozostałe niescalone w dowolnym momencie po wystąpieniu konfliktu, możesz uruchomić `git status`:

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Cokolwiek spowodowało konflikty i nie zostało automatycznie rozstrzygnięte, jest tutaj wymienione jako „unmerged” (niescalone). Git dodaje do problematycznych plików standardowe znaczniki rozwiązania konfliktu, możesz więc owe pliki otworzyć i samodzielnie rozwiązać konflikty. Twój plik zawiera teraz sekcję, która wygląda mniej więcej tak:

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53:index.html

Oznacza to, że wersja wskazywana przez HEAD (Twoja gałąź master, ponieważ tam właśnie byłeś podczas uruchamiania polecenia scalania) znajduje się w górnej części bloku (wszystko powyżej `======`), a wersja z gałęzi `iss53` to wszystko poniżej. Aby rozwiązać konflikt, musisz wybrać jedną lub druga wersję albo własnoręcznie połączyć zawartość obu. Dla przykładu możesz rozwiązać konflikt, zastępując cały blok poniższą zawartością: 

	<div id="footer">
	please contact us at email.support@github.com
	</div>

To rozwiązanie ma po trochu z obu części, całkowicie usunąłem także linie `<<<<<<<`, `=======` i `>>>>>>>`. Po rozstrzygnięciu wszystkich takich sekcji w każdym z problematycznych plików, uruchom `git add` na każdym z nich, aby oznaczyć go jako rozwiązany. Przeniesienie do poczekalni oznacza w Gicie rozwiązanie konfliktu.
Jeśli chcesz do rozwiązania tych problemów użyć narzędzia graficznego, możesz wydać polecenie `git mergetool`. Uruchomi ono odpowiednie narzędzie graficzne, które przeprowadzi cię przez wszystkie konflikty:

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

Jeśli chcesz użyć narzędzia innego niż domyślne (Git w tym przypadku wybrał dla mnie `opendiff`, ponieważ pracuję na Maku), możesz zobaczyć wszystkie wspierane narzędzia wymienione na samej górze, zaraz za „merge tool candidates”. Wpisz nazwę narzędzia, którego wolałbyś użyć. W Rozdziale 7 dowiemy się, jak zmienić domyślną wartość dla twojego środowiska pracy.

Po opuszczeniu narzędzia do scalania, Git zapyta, czy wszystko przebiegło pomyślnie. Jeśli odpowiesz skryptowi, że tak właśnie było, plik zostanie umieszczony w poczekalni, by konflikt oznaczyć jako rozwiązany.

Możesz uruchomić polecenie `git status` ponownie, by upewnić się, że wszystkie konflikty zostały rozwiązane:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

Jeśli jesteś zadowolony i potwierdziłeś, że wszystkie problematyczne pliki zostały umieszczone w poczekalni, możesz wpisać `git commit`, by tym samym zatwierdzić zestaw zmian scalających. Jego domyślny opis wygląda jak poniżej:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

Możesz go zmodyfikować, dodając szczegółowy opis sposobu scalenia zmian, jeśli tylko uważasz, że taka informacja będzie pomocna innym, gdy przyjdzie im oglądać efekt scalenia w przyszłości — dlaczego zrobiłeś to w taki, a nie inny sposób, jeśli nie jest to oczywiste.
