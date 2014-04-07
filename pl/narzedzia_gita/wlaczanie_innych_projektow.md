# Włączanie innych projektów

<!-- # Subtree Merging -->

Teraz, gdy znasz już trudności związane z modułami zależnymi, spójrzmy na alternatywny sposób rozwiązania tego problemu. Kiedy Git ma włączyć zmiany, najpierw sprawdza jakie zmiany ma włączyć, a następnie wybiera najlepszą strategię do wykonania tego zadania. Jeżeli łączysz dwie gałęzie, Git użyje strategii _rekurencyjnej_. Jeżeli łączysz więcej niż dwie gałęzie, Git wybierze strategię _ośmiornicy_. Te strategie są automatycznie wybierane za Ciebie, ponieważ rekurencyjna strategia może obsłużyć sytuacje łączenia trójstronnego - na przykład, w przypadku więcej niż jednego wspólnego przodka - ale może obsłużyć tylko łączenie dwóch gałęzi. Strategia ośmiornicy może obsłużyć większą ilość gałęzi, ale jest bardziej ostrożna, aby uniknąć trudnych do rozwiązania konfliktów, dlatego jest domyślną strategią w przypadku gdy łączysz więcej niż dwie gałęzie.

<!-- Now that you’ve seen the difficulties of the submodule system, let’s look at an alternate way to solve the same problem. When Git merges, it looks at what it has to merge together and then chooses an appropriate merging strategy to use. If you’re merging two branches, Git uses a _recursive_ strategy. If you’re merging more than two branches, Git picks the _octopus_ strategy. These strategies are automatically chosen for you because the recursive strategy can handle complex three-way merge situations — for example, more than one common ancestor — but it can only handle merging two branches. The octopus merge can handle multiple branches but is more cautious to avoid difficult conflicts, so it’s chosen as the default strategy if you’re trying to merge more than two branches. -->

Natomiast, są również inne strategie które możesz wybrać. Jedną z nich jest łączenie _subtree_ i możesz go używać z podprojektami. Zobaczysz tutaj jak włączyć do projektu projekt rack opisany w poprzedniej sekcji, ale przy użyciu łączenia _subtree_.

<!-- However, there are other strategies you can choose as well. One of them is the _subtree_ merge, and you can use it to deal with the subproject issue. Here you’ll see how to do the same rack embedding as in the last section, but using subtree merges instead. -->

W zamyśle, łącznie "subtree" jest wtedy, gdy masz dwa projekty w których jeden mapuje się do podkatalogu w drugim i na odwrót. Kiedy użyjesz łączenia "subtree", Git jest na tyle mądry, aby dowiedzieć się, że jeden z nich jest włączany do drugiego i odpowiednio jest złączyć - jest to całkiem ciekawe. 

<!-- The idea of the subtree merge is that you have two projects, and one of the projects maps to a subdirectory of the other one and vice versa. When you specify a subtree merge, Git is smart enough to figure out that one is a subtree of the other and merge appropriately — it’s pretty amazing. -->

Najpierw dodajesz aplikację Rack do swojego projektu. Dodajesz projekt Rack, jako zdalny i następnie pobierasz go do dedykowanej gałęzi.

<!-- You first add the Rack application to your project. You add the Rack project as a remote reference in your own project and then check it out into its own branch: -->

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

Masz teraz zawartość projektu Rack w gałęzi `rack_branch`, a swój projekt w gałęzi `master`. Jeżeli pobierzesz najpierw jedną, a potem drugą gałąź, zobaczysz że mają one inną zawartość:

<!-- Now you have the root of the Rack project in your `rack_branch` branch and your own project in the `master` branch. If you check out one and then the other, you can see that they have different project roots: -->

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

Chcesz jednak, pobrać projekt Rack do swojej gałęzi `master` jako podkatalog. Możesz to zrobić, za pomocą komendy Gita `git read-tree`. Dowiesz się więcej na temat komendy `read-tree` i jej podobnych w rozdziale 9, ale na teraz wiedz, że odczytuje ona drzewo projektu w jednej gałęzi i włącza je do obecnego katalogu i przechowalni. Ponownie zmieniasz gałąź na `master` i pobierasz gałąź `rack` do podkatalogu `rack` w gałęzi `master` w projekcie:

<!-- You want to pull the Rack project into your `master` project as a subdirectory. You can do that in Git with `git read-tree`. You’ll learn more about `read-tree` and its friends in Chapter 9, but for now know that it reads the root tree of one branch into your current staging area and working directory. You just switched back to your `master` branch, and you pull the `rack` branch into the `rack` subdirectory of your `master` branch of your main project: -->

	$ git read-tree --prefix=rack/ -u rack_branch

Kiedy wykonasz commit, będzie wyglądało że masz wszystkie pliki Rack w podkatalogu - tak jakbyś skopiował je z spakowanego archiwum. To co jest interesujące, to to, że możesz bardzo łatwo włączać zmiany z jednej gałęzi do drugiej. Więc, jeżeli projekt Rack zostanie zaktualizowany, możesz pobrać te zmiany poprzez przełączenie się na gałąź i wydanie komend:

<!-- When you commit, it looks like you have all the Rack files under that subdirectory — as though you copied them in from a tarball. What gets interesting is that you can fairly easily merge changes from one of the branches to the other. So, if the Rack project updates, you can pull in upstream changes by switching to that branch and pulling: -->

	$ git checkout rack_branch
	$ git pull

Następnie, możesz włączyć te zmiany do swojej gałęzi master. Możesz użyć `git merge -s subtree` i ta zadziała poprawnie; ale Git również połączy historię zmian ze sobą, czego prawdopodobnie nie chcesz. Aby pobrać zmiany i samemu wypełnił treść komentarza, użyj opcji `--squash` oraz `--no-commit` do opcji `-s subtree`:

<!-- Then, you can merge those changes back into your master branch. You can use `git merge -s subtree` and it will work fine; but Git will also merge the histories together, which you probably don’t want. To pull in the changes and prepopulate the commit message, use the `-\-squash` and `-\-no-commit` options as well as the `-s subtree` strategy option: -->

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

Wszystkie zmiany z Twojego projektu Rack są włączone i gotowe do zatwierdzenia lokalnie. Możesz zrobić to również na odwrót - wprowadź zmiany w podkatalogu `rack` w gałęzi master, a potem włącz je do gałęzi `rack_branch`, aby wysłać je do opiekunów projektu.

<!-- All the changes from your Rack project are merged in and ready to be committed locally. You can also do the opposite — make changes in the `rack` subdirectory of your master branch and then merge them into your `rack_branch` branch later to submit them to the maintainers or push them upstream. -->

Aby zobaczyć różnicę w zmianach które masz w swoim podkatalogu `rack` i gałęzi `rack_branch` - aby zobaczyć czy trzeba je włączyć - nie możesz użyć normalnie komendy `diff`. Zamiast tego musisz użyć komendy `git diff-tree` z nazwą gałęzi do której chcesz przywrównać kod:

<!-- To get a diff between what you have in your `rack` subdirectory and the code in your `rack_branch` branch — to see if you need to merge them — you can’t use the normal `diff` command. Instead, you must run `git diff-tree` with the branch you want to compare to: -->

	$ git diff-tree -p rack_branch

Lub, aby porównać zawartość Twojego podkatalogu `rack` z tym co jak wyglądała gałąź `master` na serwerze w momencie, gdy ją pobierałeś możesz uruchomić

<!-- Or, to compare what is in your `rack` subdirectory with what the `master` branch on the server was the last time you fetched, you can run -->

	$ git diff-tree -p rack_remote/master
