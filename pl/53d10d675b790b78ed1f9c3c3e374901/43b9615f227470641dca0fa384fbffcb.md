# Zarządzanie gałęziami

Teraz, kiedy już stworzyłeś, scaliłeś i usunąłeś pierwsze gałęzie, spójrzmy na dodatkowe narzędzia do zarządzania gałęziami, które przydadzą się, gdy będziesz już używać gałęzi w swojej codziennej pracy.

Polecenie `git branch` robi coś więcej, poza tworzeniem i usuwaniem gałęzi. Jeśli uruchomisz je bez argumentów, otrzymasz prostą listę istniejących gałęzi:

	$ git branch
	  iss53
	* master
	  testing

Zauważ znak `*`, którym poprzedzona została gałąź `master`: wskazuje on aktywną gałąź. Oznacza to, że jeżeli w tym momencie zatwierdzisz zmiany, wskaźnik gałęzi `master` zostanie przesunięty do przodu wraz z nowo zatwierdzonymi zmianami. Aby obejrzeć ostatni zatwierdzony zestaw zmian na każdej z gałęzi, możesz użyć polecenia `git branch -v`:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Kolejna przydatna opcja pozwalająca na sprawdzenie stanu gałęzi to przefiltrowanie tej listy w celu wyświetlenia gałęzi, które już zostały lub jeszcze nie zostały scalone do aktywnej gałęzi. Przydatne opcje `--merged` i `--no-merged` służą właśnie do tego celu i są dostępne w Gicie począwszy od wersji 1.5.6. Aby zobaczyć, które gałęzie zostały już scalone z bieżącą, uruchom polecenie `git branch --merged`:

	$ git branch --merged
	  iss53
	* master

Ponieważ gałąź `iss53` została już scalona, znalazła się ona na Twojej liście. Gałęzie znajdujące się na tej liście a niepoprzedzone znakiem `*` można właściwie bez większego ryzyka usunąć poleceniem `git branch -d`; wykonana na nich praca została już scalona do innej gałęzi, więc niczego nie stracisz.

Aby zobaczyć wszystkie gałęzie zawierające zmiany, których jeszcze nie scaliłeś, możesz uruchomić polecenie `git branch --no-merged`:

	$ git branch --no-merged
	  testing

Pokazuje to Twoją drugą gałąź. Ponieważ zawiera ona zmiany, które nie zostały jeszcze scalone, próba usunięcia jej poleceniem `git branch -d` nie powiedzie się:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Jeśli naprawdę chcesz usunąć gałąź i stracić tę część pracy, możesz wymusić to opcją `-D` zgodnie z tym, co podpowiada komunikat na ekranie.
