# Cofanie zmian

Każdą z wcześniej wprowadzonych zmian możesz cofnąć w dowolnym momencie. Poniżej przyjrzymy się kilku podstawowym funkcjom cofającym modyfikacje. Musisz być jednak ostrożny ponieważ nie zawsze można cofnąć niektóre z tych cofnięć [FIXME]. Jest to jedno z niewielu miejsc w Gitcie, w których należy być naprawdę ostrożnym, gdyż można stracić bezpowrotnie część pracy.

## Poprawka do ostatniej rewizji

Jeden z częstych przypadków to zbyt pochopne wykonanie rewizji i pominięcie w niej części plików, lub też pomyłka w notce do zmian. Jeśli chcesz poprawić wcześniejszą, błędną rewizję, wystarczy uruchomić git commit raz jeszcze, tym razem, z opcją `--amend` (popraw):

	$ git commit --amend

Polecenie bierze zawartość poczekalni i zatwierdza jako dodatkowe zmiany. Jeśli niczego nie zmieniłeś od ostatniej rewizji (np. uruchomiłeś polecenie zaraz po poprzednim zatwierdzeniu zmian) wówczas twoja migawka się nie zmieni ale będziesz miał możliwość modyfikacji notki.

Jak zwykle zostanie uruchomiony edytor z załadowaną treścią poprzedniego komentarza. Edycja przebiega dokładnie tak samo jak zawsze, z tą różnicą, że na końcu zostanie nadpisana oryginalna treść notki.

Czas na przykład. Zatwierdziłeś zmiany a następnie zdałeś sobie sprawę, że zapomniałeś dodać do poczekalni pliku, który chciałeś oryginalnie umieścić w wykonanej rewizji. Wystarczy, że wykonasz następujące polecenie:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend 

Wszystkie trzy polecenia zakończą się jedną rewizją - druga operacja commit zastąpi wynik pierwszej.

## Usuwanie pliku z poczekalni

Następne dwie sekcje pokazują jak zarządzać poczekalnią i zmianami w katalogu roboczym. Dobra wiadomość jest taka, że polecenie używane do określenia stanu obu obszarów przypomina samo jak cofnąć wprowadzone w nich zmiany. Na przykład, powiedzmy, że zmieniłeś dwa pliki i chcesz teraz zatwierdzić je jako dwie osobne rewizje, ale odruchowo wpisałeś `git add *` co spowodowało umieszczenie obu plików w poczekalni. Jak w takiej sytuacji usunąć stamtąd jeden z nich? Polecenie `git status` przypomni ci, że:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

Tekst znajdujący się zaraz pod nagłówkiem zmian do zatwierdzenia mówi "użyj `git reset HEAD <plik>...` żeby usunąć plik z poczekalni. Nie pozostaje więc nic innego jak zastosować się do porady i zastosować ją na pliku benchmarks.rb:

	$ git reset HEAD benchmarks.rb 
	benchmarks.rb: locally modified
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Polecenie wygląda odrobinę dziwacznie, ale działa. Plik benchmarks.rb ciągle zawiera wprowadzone modyfikacje ale nie znajduje się już w poczekalni.

## Cofanie zmian w zmodyfikowanym pliku

Co jeśli okaże się, że nie chcesz jednak zatrzymać zmian wykonanych w pliku benchmarks.rb? W jaki sposób łatwo cofnąć wprowadzone modyfikacje czyli przywrócić plik do stanu w jakim był po ostatniej rewizji (lub początkowym sklonowaniu, lub jakkolwiek dostał się do katalogu roboczego)? Z pomocą przybywa raz jeszcze polecenie `git status`. W ostatnim przykładzie, pliki będące poza poczekalnią wyglądają następująco:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Git konkretnie wskazuje jak pozbyć się dokonanych zmian (w każdym bądź razie robią to wersje Gita 1.6.1 i nowsze - jeśli posiadasz starszą, bardzo zalecamy aktualizację, która ułatwi ci korzystanie z programu). Zróbmy zatem co każe Git:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Możesz teraz przeczytać, że zmiany zostały cofnięte. Powinieneś sobie już także zdawać sprawę, że jest to dość niebezpieczne polecenie: wszelkie zmiany jakie wykonałeś w pliku przepadają - w rzeczy samej został on nadpisany poprzednią wersją. Nigdy nie używaj tego polecenia dopóki nie jesteś absolutnie pewny, że nie chcesz i nie potrzebujesz już danego pliku. Jeśli jedynie chcesz się go chwilowo pozbyć przyjrzymy się specjalnemu poleceniu schowka (stash) oraz gałęziom w kolejnych rozdziałach - są to generalnie znacznie lepsze sposoby.

Pamiętaj, że wszystko co zatwierdzasz do repozytorium Gita może zostać w niemalże dowolnym momencie odtworzone. Nawet rewizje, które znajdowały się w usuniętych gałęziach, albo rewizje nadpisane zatwierdzeniem poprawiającym `--amend` mogą być odtworzone (odzyskiwanie danych opisujemy w rozdziale 9). Jednakże, cokolwiek utraciłeś a nie było to nigdy wcześniej zatwierdzane do repozytorium, prawdopodobnie odeszło na zawsze.
