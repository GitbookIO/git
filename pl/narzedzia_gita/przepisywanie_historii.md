# Przepisywanie Historii

<!-- # Rewriting History -->

Często, pracując z Gitem możesz chcieć zmienić historię commitów z jakiegoś powodu. Jedną z najlepszych rzeczy w Gitcie jest to, że pozwala on podejmować decyzję w ostatnim możliwym momencie. Możesz zdecydować które pliki idą w których commitach, dokładnie przed commitem przy użyciu przechowalni, możesz zdecydować że nie chciałeś nad czymś teraz pracować przy pomocy schowka, możesz również nadpisać commity które już wprowadziłeś, tak aby wyglądały inaczej. Możesz w ten sposób zmienić kolejność commitów, treść komentarza lub zawartość plików, złączyć lub rozdzielić commity, lub je w całości usunąć - wszystko zanim podzielisz się swoją pracą z innymi.

<!-- Many times, when working with Git, you may want to revise your commit history for some reason. One of the great things about Git is that it allows you to make decisions at the last possible moment. You can decide what files go into which commits right before you commit with the staging area, you can decide that you didn’t mean to be working on something yet with the stash command, and you can rewrite commits that already happened so they look like they happened in a different way. This can involve changing the order of the commits, changing messages or modifying files in a commit, squashing together or splitting apart commits, or removing commits entirely — all before you share your work with others. -->

W tej sekcji, dowiesz się jak wykonać te zadania, tak abyś mógł zorganizować historię commitów w taki sposób w jaki chcesz, przed podzieleniem się tymi zmianami z innymi.

<!-- In this section, you’ll cover how to accomplish these very useful tasks so that you can make your commit history look the way you want before you share it with others. -->

## Zmienianie ostatniego commita

<!-- ## Changing the Last Commit -->

Zmienianie ostatniego commita jest chyba najczęstszą rzeczą którą będziesz robił. Często chcesz zrobić jedną z dwóch rzeczy: zmienić treść komentarza, lub zawartość migawki którą właśnie stworzyłeś, poprzez dodanie, zmianę lub usunięcie plików.

<!-- Changing your last commit is probably the most common rewriting of history that you’ll do. You’ll often want to do two basic things to your last commit: change the commit message, or change the snapshot you just recorded by adding, changing and removing files. -->

Jeżeli chcesz zmienić tylko treść ostatniego komentarza, najprościej wykonać:

<!-- If you only want to modify your last commit message, it’s very simple: -->

	$ git commit --amend

Ta komenda uruchomi edytor tekstowy, który będzie zawierał Twój ostatni komentarz gotowy do wprowadzenia zmian. Kiedy zapiszesz i zamkniesz edytor, nowy tekst komentarza nadpisze poprzedni, stając się tym samym Twoim nowym ostatnim commitem.

<!-- That drops you into your text editor, which has your last commit message in it, ready for you to modify the message. When you save and close the editor, the editor writes a new commit containing that message and makes it your new last commit. -->

Jeżeli wykonałeś komendę "commit", a potem chcesz zmienić ostatnio zapisaną migawkę przez dodanie lub zmianę plików, być może dlatego że zapomniałeś dodać plik który stworzyłeś, cały proces działa bardzo podobnie. Dodajesz do przechowalni zmiany lub pliki poprzez wykonanie komendy `git add` na nich, lub `git rm` na jakimś pliku, a następnie uruchamiasz komendę `git commit --ammend`, która pobiera obecną zawartość przechowalni i robi z niej nową migawkę do commitu.

<!-- If you’ve committed and then you want to change the snapshot you committed by adding or changing files, possibly because you forgot to add a newly created file when you originally committed, the process works basically the same way. You stage the changes you want by editing a file and running `git add` on it or `git rm` to a tracked file, and the subsequent `git commit -\-amend` takes your current staging area and makes it the snapshot for the new commit. -->

Musisz być ostrożny z tymi zmianami, ponieważ wykonywanie komendy "ammend", zmienia sumę SHA-1 dla commitu. Działa to podobnie do bardzo małej zmiany bazy (and. rebase) - nie wykonuj komendy "amend" na ostatnim commicie, jeżeli zdążyłeś go już udostępnić innym.

<!-- You need to be careful with this technique because amending changes the SHA-1 of the commit. It’s like a very small rebase — don’t amend your last commit if you’ve already pushed it. -->

## Zmiana kilku komentarzy jednocześnie

<!-- ## Changing Multiple Commit Messages -->

Aby zmienić zapisaną zmianę która jest głębiej w historii, musisz użyć bardziej zaawansowanych narzędzi. Git nie posiada narzędzia do modyfikowania historii, ale możesz użyć komendy "rebase", aby zmienić bazę kilku commitów do HEAD z których się wywodzą, zamiast przenosić je do innej. Przy pomocy interaktywnej komendy rebase, możesz zatrzymać się przy każdym commicie przeznaczonym do zmiany i zmienić treść komentarza, dodać pliki, lub cokolwiek zechcesz. Możesz uruchomić komendę "rebase" w trybie interaktywnym poprzez dodanie opcji `-i` do `git rebase`. Musisz wskazać jak daleko chcesz nadpisać zmiany, poprzez wskazanie do którego commitu zmienić bazę.

<!-- To modify a commit that is farther back in your history, you must move to more complex tools. Git doesn’t have a modify-history tool, but you can use the rebase tool to rebase a series of commits onto the HEAD they were originally based on instead of moving them to another one. With the interactive rebase tool, you can then stop after each commit you want to modify and change the message, add files, or do whatever you wish. You can run rebase interactively by adding the `-i` option to `git rebase`. You must indicate how far back you want to rewrite commits by telling the command which commit to rebase onto. -->

Na przykład, jeżeli chcesz zmienić 3 ostatnie komentarze, albo jakikolwiek z nich, podajesz jako argument do komendy `git rebase -i` rodzica ostatniego commita który chcesz zmienić, np. `HEAD~2^` lub `HEAD~3`. Łatwiejsze do zapamiętania może być `~3`, ponieważ próbujesz zmienić ostatnie trzy commity; ale zwróć uwagę na to, że tak naprawdę określiłeś cztery ostatnie commity, rodzica ostatniej zmiany którą chcesz zmienić: 

<!--  For example, if you want to change the last three commit messages, or any of the commit messages in that group, you supply as an argument to `git rebase -i` the parent of the last commit you want to edit, which is `HEAD~2^` or `HEAD~3`. It may be easier to remember the `~3` because you’re trying to edit the last three commits; but keep in mind that you’re actually designating four commits ago, the parent of the last commit you want to edit: -->

	$ git rebase -i HEAD~3

Postaraj się zapamiętać, że jest to komenda zmiany bazy - każdy commit znajdujący się w zakresie `HEAD~3..HEAD` będzie przepisany, bez względu na to, czy zmienisz treść komentarza czy nie. Nie zawieraj commitów które zdążyłeś już wgrać na centralny serwer - takie działanie będzie powodowało zamieszanie dla innych programistów, poprzez dostarczenie alternatywnej wersji tej samej zmiany.

<!-- Remember again that this is a rebasing command — every commit included in the range `HEAD~3..HEAD` will be rewritten, whether you change the message or not. Don’t include any commit you’ve already pushed to a central server — doing so will confuse other developers by providing an alternate version of the same change. -->

Uruchomienie tej komendy da Ci listę commitów w edytorze tekstowym, podobną do tej:

<!-- Running this command gives you a list of commits in your text editor that looks something like this: -->

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

	# Rebase 710f0f8..a5f4a0d onto 710f0f8
	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Warto zaznaczyć, że te zmiany są wypisane w odwrotnej kolejności, w stosunku do tej, którą widzisz po wydaniu komendy `log`. Jeżeli uruchomisz `log`, zobaczysz coś podobnego do:

<!-- It’s important to note that these commits are listed in the opposite order than you normally see them using the `log` command. If you run a `log`, you see something like this: -->

	$ git log --pretty=format:"%h %s" HEAD~3..HEAD
	a5f4a0d added cat-file
	310154e updated README formatting and added blame
	f7f3f6d changed my name a bit

Zauważ odwrotną kolejność. Interaktywny tryb "rebase" udostępnia Ci skrypt który będzie uruchamiany. Rozpocznie on działanie od zmiany, którą wskazałeś w linii komend (`HEAD~3`) i odtworzy zmiany wprowadzanie przez każdy z commitów od góry do dołu. Listuje najstarszy na górze, zamiast najnowszego, ponieważ będzie to pierwszy który zostanie odtworzony. 

<!-- Notice the reverse order. The interactive rebase gives you a script that it’s going to run. It will start at the commit you specify on the command line (`HEAD~3`) and replay the changes introduced in each of these commits from top to bottom. It lists the oldest at the top, rather than the newest, because that’s the first one it will replay. -->

Trzeba zmienić skrypt, aby ten zatrzymał się na zmianie którą chcesz wyedytować. Aby to zrobić, zmień słowo "pick" na "edit" przy każdym commicie po którym skrypt ma się zatrzymać. Dla przykładu, aby zmienić tylko trzecią treść komentarza, zmieniasz plik aby wygląda tak jak ten:

<!-- You need to edit the script so that it stops at the commit you want to edit. To do so, change the word pick to the word edit for each of the commits you want the script to stop after. For example, to modify only the third commit message, you change the file to look like this: -->

	edit f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Kiedy zapiszesz zmiany i wyjdziesz z edytora, Git cofnie Cię do ostatniego commita w liście i pokaże linię komend z następującym komunikatem:

<!-- When you save and exit the editor, Git rewinds you back to the last commit in that list and drops you on the command line with the following message: -->

	$ git rebase -i HEAD~3
	Stopped at 7482e0d... updated the gemspec to hopefully work better
	You can amend the commit now, with

	       git commit --amend

	Once you’re satisfied with your changes, run

	       git rebase --continue

Te instrukcje mówią dokładnie co zrobić. Napisz

<!-- These instructions tell you exactly what to do. Type -->

	$ git commit --amend

Zmień treść komentarza i zamknij edytor. Następnie uruchom

<!-- Change the commit message, and exit the editor. Then, run -->

	$ git rebase --continue

Ta komenda nałoży dwie pozostałe zmiany automatycznie i po wszystkim. Jeżeli zmienisz "pick" na "edit" w większej liczbie linii, możesz powtórzyć te kroki dla każdego commita który zmieniasz. Za każdym razem Git zatrzyma się, pozwoli Ci nadpisać treść za pomocą komendy "amend" i przejdzie dalej jak skończysz.

<!-- This command will apply the other two commits automatically, and then you’re done. If you change pick to edit on more lines, you can repeat these steps for each commit you change to edit. Each time, Git will stop, let you amend the commit, and continue when you’re finished. -->

## Zmiana kolejności commitów

<!-- ## Reordering Commits -->

Możesz również użyć interaktywnego trybu "rebase" aby zmienić kolejność lub usunąć commity w całości. Jeżeli chcesz usunąć zmianę opisaną jako "added cat-file", oraz zmienić kolejność w jakiej pozostałe dwie zmiany zostały wprowadzone, możesz zmienić zawartość skryptu rebase z takiego

<!-- You can also use interactive rebases to reorder or remove commits entirely. If you want to remove the "added cat-file" commit and change the order in which the other two commits are introduced, you can change the rebase script from this -->

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

na taki:

<!-- to this: -->

	pick 310154e updated README formatting and added blame
	pick f7f3f6d changed my name a bit

Kiedy zapiszesz zmiany i wyjdziesz z edytora, Git cofnie gałąź do rodzica tych commitów, nałoży `310154e` i potem `f7f3f6d`, a następnie się zatrzyma. W efekcie zmieniłeś kolejność tych commitów i usunąłeś "added cat-file" kompletnie.

<!-- When you save and exit the editor, Git rewinds your branch to the parent of these commits, applies `310154e` and then `f7f3f6d`, and then stops. You effectively change the order of those commits and remove the "added cat-file" commit completely. -->

## Łączenie commitów

<!-- ## Squashing Commits -->

Możliwe jest również pobranie kilku commitów i połączenie ich w jeden za pomocą interaktywnego trybu rebase. Skrypt ten pokazuje pomocne instrukcje w treści rebase:

<!-- It’s also possible to take a series of commits and squash them down into a single commit with the interactive rebasing tool. The script puts helpful instructions in the rebase message:-->

	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Jeżeli zamiast "pick" lub "edit", użyjesz "squash", Git nałoży obie te zmiany i tą znajdującą się przed nimi, i pozwoli Ci na scalenie treści komentarzy ze sobą. Więc, jeżeli chcesz zrobić jeden commit z tych trzech, robisz skrypt wyglądający tak jak ten:

<!-- If, instead of "pick" or "edit", you specify "squash", Git applies both that change and the change directly before it and makes you merge the commit messages together. So, if you want to make a single commit from these three commits, you make the script look like this: -->

	pick f7f3f6d changed my name a bit
	squash 310154e updated README formatting and added blame
	squash a5f4a0d added cat-file

Kiedy zapiszesz zmiany i opuścisz edytor, Git nałoży wszystkie trzy i przejdzie ponownie do edytora, tak abyś mógł połączyć treści komentarzy:

<!-- When you save and exit the editor, Git applies all three changes and then puts you back into the editor to merge the three commit messages: -->

	# This is a combination of 3 commits.
	# The first commit's message is:
	changed my name a bit

	# This is the 2nd commit message:

	updated README formatting and added blame

	# This is the 3rd commit message:

	added cat-file

Kiedy to zapiszesz, otrzymasz jeden commit, który wprowadza zmiany ze wszystkich trzech poprzednich.

<!-- When you save that, you have a single commit that introduces the changes of all three previous commits. -->

## Rozdzielanie commitów

<!-- ## Splitting a Commit -->

Rozdzielanie commitu cofa jego nałożenie, a następnie część po części dodaje do przechowalni i commituje, tyle razy ile chcesz otrzymać commitów. Na przykład, załóżmy że chcesz podzielić środkową zmianę ze swoich trzech. Zamiast zmiany "updated README formatting and added blame", chcesz otrzymać dwie: "updated README formatting" dla pierwszego, oraz "added blame" dla drugiego. Możesz to zrobić za pomocą komendy `rebase -i` i skryptu w którym zmienisz instrukcję przy commicie na "edit":

<!-- Splitting a commit undoes a commit and then partially stages and commits as many times as commits you want to end up with. For example, suppose you want to split the middle commit of your three commits. Instead of "updated README formatting and added blame", you want to split it into two commits: "updated README formatting" for the first, and "added blame" for the second. You can do that in the `rebase -i` script by changing the instruction on the commit you want to split to "edit": -->

	pick f7f3f6d changed my name a bit
	edit 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Kiedy zapiszesz zmiany i wyjdziesz z edytora, Git cofnie się do rodzica pierwszego commita z listy, nałoży pierwszą zmianę (`f7f3f6d`), nałoży kolejną (`310154e`) i uruchomi konsolę. Tam możesz zrobić "reset" na kolejnym commicie za pomocą `git reset HEAD^`, co w efekcie cofnie zmiany i zostawi zmodyfikowane pliki poza przechowalnią. Teraz możesz wskazać zmiany które zostały zresetowane i utworzyć kilka osobnych commitów z nich. Po prostu dodaj do przechowalni i zapisz zmiany, do czasu aż będziesz miał kilka commitów, a następnie uruchom `git rebase --continue` gdy skończysz:

<!-- When you save and exit the editor, Git rewinds to the parent of the first commit in your list, applies the first commit (`f7f3f6d`), applies the second (`310154e`), and drops you to the console. There, you can do a mixed reset of that commit with `git reset HEAD^`, which effectively undoes that commit and leaves the modified files unstaged. Now you can take the changes that have been reset, and create multiple commits out of them. Simply stage and commit files until you have several commits, and run `git rebase -\-continue` when you’re done: -->

	$ git reset HEAD^
	$ git add README
	$ git commit -m 'updated README formatting'
	$ git add lib/simplegit.rb
	$ git commit -m 'added blame'
	$ git rebase --continue

Git nałoży ostatnią zmianę w skrypcie (`a5f4a0d`), a historia będzie wyglądała tak:

<!-- Git applies the last commit (`a5f4a0d`) in the script, and your history looks like this: -->

	$ git log -4 --pretty=format:"%h %s"
	1c002dd added cat-file
	9b29157 added blame
	35cfb2b updated README formatting
	f3cc40e changed my name a bit

Ponownie warto zaznaczyć, że ta operacja zmienia sumy SHA wszystkich commitów z listy, upewnij się więc, że żadnego z tych commitów nie wypchnąłeś i nie udostępniłeś w wspólnym repozytorium.

<!-- Once again, this changes the SHAs of all the commits in your list, so make sure no commit shows up in that list that you’ve already pushed to a shared repository. -->

## Zabójcza opcja: filter-branch

<!-- ## The Nuclear Option: filter-branch -->

Istnieje jeszcze jedna opcja umożliwiająca nadpisanie historii, której możesz użyć, gdy chcesz nadpisać większą liczbę commitów w sposób który można oprogramować - przykładem tego może być zmiana Twojego adresu e-mail lub usunięcie pliku z każdego commita. Komenda ta to `filter-branch` i może ona zmodyfikować duże części Twojej historii, nie powinieneś jej prawdopodobnie używać, chyba że Twój projekt nie jest publiczny i inne osoby nie mają zmian bazujących na commitach które zamierzasz zmienić. Może oba być jednak przydatna. Nauczysz się kilku częstych przypadków użycia i zobaczysz co może ta komenda. 

<!-- There is another history-rewriting option that you can use if you need to rewrite a larger number of commits in some scriptable way — for instance, changing your e-mail address globally or removing a file from every commit. The command is `filter-branch`, and it can rewrite huge swaths of your history, so you probably shouldn’t use it unless your project isn’t yet public and other people haven’t based work off the commits you’re about to rewrite. However, it can be very useful. You’ll learn a few of the common uses so you can get an idea of some of the things it’s capable of. -->

### Usuwanie pliku z każdego commita

<!-- ### Removing a File from Every Commit -->

To często występująca sytuacja. Ktoś niechcący zapisać duży plik za pomocą pochopnie wydanej komendy `git add .`, a Ty chcesz usunąć ten plik z każdego commita. Być może przez pomyłkę zapisałeś plik zawierający hasła, a chcesz upublicznić swój projekt. Komenda `filter-branch` jest tą, którą prawdopodobnie będziesz chciał użyć, aby obrobić całą historię zmian. Aby usunąć plik nazywający się paddwords.txt z całej Twojej historii w projekcie, możesz użyć opcji `--tree-filter` dodanej do `filter-branch`:

<!-- This occurs fairly commonly. Someone accidentally commits a huge binary file with a thoughtless `git add .`, and you want to remove it everywhere. Perhaps you accidentally committed a file that contained a password, and you want to make your project open source. `filter-branch` is the tool you probably want to use to scrub your entire history. To remove a file named passwords.txt from your entire history, you can use the `-\-tree-filter` option to `filter-branch`: -->

	$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
	Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
	Ref 'refs/heads/master' was rewritten

Opcja `--tree-filter` umożliwia wykonanie jakiejś komendy po każdej zmianie i następnie ponownie zapisuje wynik. W tym przypadku, usuwasz plik passwords.txt z każdej migawki, bez względu na to czy on istnieje czy nie. Jeżeli chcesz usunąć wszystkie niechcący dodane kopie zapasowe plików stworzone przez edytor, możesz uruchomić coś podobnego do `git filter-branch --tree-filter "find * -type f -name '*~' -delete" HEAD`.

<!-- The `-\-tree-filter` option runs the specified command after each checkout of the project and then recommits the results. In this case, you remove a file called passwords.txt from every snapshot, whether it exists or not. If you want to remove all accidentally committed editor backup files, you can run something like `git filter-branch -\-tree-filter "rm -f *~" HEAD`. -->

Będziesz mógł obserwować jak Git nadpisuje strukturę projektu i zmiany, a następnie przesuwa wskaźnik gałęzi. Jest to generalnie całkiem dobrym pomysłem, aby wykonać to na testowej gałęzi, a następnie zresetować na twardo (ang. hard reset) gałąź master, po tym jak stwierdzisz że wynik jest tym czego oczekiwałeś. Aby uruchomić `filter-branch` an wszystkich gałęziach, dodajesz opcję `--all`.

<!-- You’ll be able to watch Git rewriting trees and commits and then move the branch pointer at the end. It’s generally a good idea to do this in a testing branch and then hard-reset your master branch after you’ve determined the outcome is what you really want. To run `filter-branch` on all your branches, you can pass `-\-all` to the command. -->

### Wskazywanie podkatalogu jako katalogu głównego

<!-- ### Making a Subdirectory the New Root -->

Założymy że zaimportowałeś projekt z innego systemu kontroli wersji, zawierającego niepotrzebne podkatalogu (trunk, tags, itd). Jeżeli chcesz, aby katalog `trunk` był nowym głównym katalogiem dla wszystkich commitów, komenda `filter-branch` również to umożliwi:

<!-- Suppose you’ve done an import from another source control system and have subdirectories that make no sense (trunk, tags, and so on). If you want to make the `trunk` subdirectory be the new project root for every commit, `filter-branch` can help you do that, too: -->

	$ git filter-branch --subdirectory-filter trunk HEAD
	Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
	Ref 'refs/heads/master' was rewritten

Teraz Twoim nowym katalogiem głównym w projekcie, jest to, na co wskazywał podkatalog `trunk`. Git również automatycznie usunie commity, które nie dotyczyły podkatalogu.

<!-- Now your new project root is what was in the `trunk` subdirectory each time. Git will also automatically remove commits that did not affect the subdirectory. -->

### Zmienianie adresu e-mail globalnie

<!-- ### Changing E-Mail Addresses Globally -->

Innym częstym przypadkiem jest ten, w którym zapomniałeś uruchomić `git config` aby ustawić imię i adres e-mail przed rozpoczęciem prac, lub chcesz udostępnić projekt jako open-source i zmienić swój adres e-mail na adres prywatny. W każdym przypadku, możesz zmienić adres e-mail w wielu commitach również za pomocą `filter-branch`. Musisz uważać, aby zmienić adresy e-mail które należą do Ciebie, użyjesz więc `--commit-filter`:

<!-- Another common case is that you forgot to run `git config` to set your name and e-mail address before you started working, or perhaps you want to open-source a project at work and change all your work e-mail addresses to your personal address. In any case, you can change e-mail addresses in multiple commits in a batch with `filter-branch` as well. You need to be careful to change only the e-mail addresses that are yours, so you use `-\-commit-filter`: -->

	$ git filter-branch --commit-filter '
	        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
	        then
	                GIT_AUTHOR_NAME="Scott Chacon";
	                GIT_AUTHOR_EMAIL="schacon@example.com";
	                git commit-tree "$@";
	        else
	                git commit-tree "$@";
	        fi' HEAD

To obrobi i nadpisze każdy commit, aby zawierał Twój nowy adres. Ze względu na to, że commity zawierają sumę SHA-1 swoich rodziców, ta komenda zmieni wszystkie sumy SHA-1 dla commitów z historii, a nie tylko tych które zawierały zmieniany adres.

<!-- This goes through and rewrites every commit to have your new address. Because commits contain the SHA-1 values of their parents, this command changes every commit SHA in your history, not just those that have the matching e-mail address. -->
