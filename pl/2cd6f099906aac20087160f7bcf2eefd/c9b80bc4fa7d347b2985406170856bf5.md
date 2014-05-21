# Interaktywne używanie przechowali

<!-- # Interactive Staging -->

Git dostarcza kilku skryptów, które ułatwiają wykonywanie zadań z linii poleceń. Zobaczysz tutaj parę interaktywnych komend, które pomogą Ci z łatwością dopracować commity, aby zawierały tylko pewnie kombinacje i części plików. Narzędzia te są bardzo przydatne w sytuacji, gdy zmieniasz kilka plików i następnie decydujesz, że chciałbyś, aby te zmiany były w kilku mniejszych commitach, zamiast w jednym dużym. W ten sposób możesz mieć pewność, że Twoje commity są logicznie oddzielnymi zestawami zmian i mogą być łatwiej zweryfikowane przez innych programistów pracujących z Tobą.
Jeżeli uruchomisz `git add` z opcją `-i` lub `-interactive`, Git wejdzie w tryb interaktywny, pokazując coś podobnego do:

<!-- Git comes with a couple of scripts that make some command-line tasks easier. Here, you’ll look at a few interactive commands that can help you easily craft your commits to include only certain combinations and parts of files. These tools are very helpful if you modify a bunch of files and then decide that you want those changes to be in several focused commits rather than one big messy commit. This way, you can make sure your commits are logically separate changesets and can be easily reviewed by the developers working with you.
If you run `git add` with the `-i` or `-\-interactive` option, Git goes into an interactive shell mode, displaying something like this: -->

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now>

Możesz zauważyć, że ta komenda pokazuje zupełnie inny obraz przechowalni - właściwie są to te same informacje które możesz otrzymać przy pomocy `git status`, ale w bardziej zwięzłej formie. Listuje ona zmiany które dodałeś do przechowalni po lewej stronie, oraz te które nie są w niej jeszcze po prawej.

<!-- You can see that this command shows you a much different view of your staging area — basically the same information you get with `git status` but a bit more succinct and informative. It lists the changes you’ve staged on the left and unstaged changes on the right. -->

Po nich pokazana jest sekcja komend. Możesz w niej zrobić kilka rzeczy takich jak dodanie plików do przechowalni, usunięcie z niej, dodanie do przechowalni części plików, dodanie nieśledzonych plików, czy otrzymanie różnicy między tym co jest w przechowalni.

<!-- After this comes a Commands section. Here you can do a number of things, including staging files, unstaging files, staging parts of files, adding untracked files, and seeing diffs of what has been staged. -->

## Dodawanie i usuwanie plików z przechowalni

<!-- ## Staging and Unstaging Files -->

Jeżeli naciśniesz `2` lub `u` w linii `What now>`, skrypt dopyta Cię o to, które pliki chcesz dodać do przechowalni:

<!-- If you type `2` or `u` at the `What now>` prompt, the script prompts you for which files you want to stage: -->

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Aby dodać pliki TODO i index.html do przechowalni, możesz wpisać numery: 

<!-- To stage the TODO and index.html files, you can type the numbers: -->

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Znak `*` obok każdego pliku, oznacza że plik ten będzie dodany do przechowalni. Jeżeli naciśniesz Enter, bez wpisywania niczego w `Update>>`, Git weźmie wszystkie zaznaczone pliki i doda je do przechowalni:

<!-- The `*` next to each file means the file is selected to be staged. If you press Enter after typing nothing at the `Update>>` prompt, Git takes anything selected and stages it for you: -->

	Update>>
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Teraz możesz zauważyć, że pliki TODO i index.html są w przechowalni, a plik simplegit.rb nie. Jeżeli chcesz usunąć plik TODO z przechowalni, musisz użyć opcji `3` lub `r` (cofnij, od ang. revert):

<!-- Now you can see that the TODO and index.html files are staged and the simplegit.rb file is still unstaged. If you want to unstage the TODO file at this point, you use the `3` or `r` (for revert) option: -->

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path


Spójrz ponownie na status Gita, zobaczysz teraz, że usunąłeś z poczekalni plik TODO:

<!-- Looking at your Git status again, you can see that you’ve unstaged the TODO file: -->

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Aby zobaczyć porównanie tego co jest w przechowalni, możesz użyć komendy `6` lub `d` (ang. diff). Pokaże ona listę plików, które możesz wybrać aby zobaczyć wprowadzone zmiany. Jest to podobne do działania komendy `git diff --cached`:

<!-- To see the diff of what you’ve staged, you can use the `6` or `d` (for diff) command. It shows you a list of your staged files, and you can select the ones for which you would like to see the staged diff. This is much like specifying `git diff -\-cached` on the command line: -->

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

Przy użyciu tych prostych komend, możesz używać trybu interaktywnego do łatwiejszej obsługi przechowalni.

<!-- With these basic commands, you can use the interactive add mode to deal with your staging area a little more easily. -->

## Dodawanie łat do przechowalni

<!-- ## Staging Patches -->

Dla Gita możliwe jest również, aby dodać do przechowalni tylko część plików, a nie całość. Na przykład, jeżeli zrobisz dwie zmiany w swoim pliku simplegit.rb, ale chcesz dodać do przechowalni tylko jedną z nich, a drugą nie. Z interaktywnej linii poleceń, wybierz `5` lub `p` (ang. patch). Git zapyta Cię, które pliki chciałbyś tylko w części dodać do przechowalni; następnie dla każdego zaznaczonego pliku, wyświetli kawałek różnicy na plikach i zapyta czy chcesz je dodać do przechowalni po kolei: 

<!-- It’s also possible for Git to stage certain parts of files and not the rest. For example, if you make two changes to your simplegit.rb file and want to stage one of them and not the other, doing so is very easy in Git. From the interactive prompt, type `5` or `p` (for patch). Git will ask you which files you would like to partially stage; then, for each section of the selected files, it will display hunks of the file diff and ask if you would like to stage them, one by one: -->

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]?

Masz teraz dużą ilość opcji. Pisząc `?` otrzymasz listę rzeczy które możesz zrobić:

<!-- You have a lot of options at this point. Typing `?` shows a list of what you can do: -->

	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
	y - stage this hunk
	n - do not stage this hunk
	a - stage this and all the remaining hunks in the file
	d - do not stage this hunk nor any of the remaining hunks in the file
	g - select a hunk to go to
	/ - search for a hunk matching the given regex
	j - leave this hunk undecided, see next undecided hunk
	J - leave this hunk undecided, see next hunk
	k - leave this hunk undecided, see previous undecided hunk
	K - leave this hunk undecided, see previous hunk
	s - split the current hunk into smaller hunks
	e - manually edit the current hunk
	? - print help

Zazwyczaj, będziesz wybierał `y` lub `n` jeżeli chcesz dodać do przechowalni dany kawałek, ale zapisanie wszystkich które chcesz dodać do przechowalni w plikach, lub pominięcie decyzji również może być przydatne. Jeżeli dodasz część pliku do przechowalni, a pozostałej części nie, wynik komendy status będzie podobny do:

<!-- Generally, you’ll type `y` or `n` if you want to stage each hunk, but staging all of them in certain files or skipping a hunk decision until later can be helpful too. If you stage one part of the file and leave another part unstaged, your status output will look like this: -->

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

Wynik komendy status dla pliku simplegit.rb jest interesujący. Pokazuje on, że kilka linii jest dodanych do przechowalni, a kilka nie. Masz plik, który jest tylko w części w przechowalni. W tym momencie, możesz zakończyć działanie trybu interaktywnego i uruchomić `git commit` w celu zatwierdzenia zmian.

<!-- The status of the simplegit.rb file is interesting. It shows you that a couple of lines are staged and a couple are unstaged. You’ve partially staged this file. At this point, you can exit the interactive adding script and run `git commit` to commit the partially staged files. -->

Wreszcie, nie musisz być w trybie interaktywnym aby dodać część pliku do przechowalni - możesz wywołać to samo menu, poprzez uruchomienie `git add -p` lub `git add --patch` z linii komend.

<!-- Finally, you don’t need to be in interactive add mode to do the partial-file staging — you can start the same script by using `git add -p` or `git add -\-patch` on the command line. -->
