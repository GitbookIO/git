# Konserwacja i Odzyskiwanie Danych

<!-- # Maintenance and Data Recovery -->

Czasami będziesz musiał zrobić jakieś porządki - sprawić, aby repozytorium zajmowało mniej miejsca, oczyścić zaimportowane repozytorium, lub odtworzyć utracone zmiany. Ten rozdział zawiera opis postępowania w tych scenariuszach.

<!-- Occasionally, you may have to do some cleanup — make a repository more compact, clean up an imported repository, or recover lost work. This section will cover some of these scenarios. -->

## Konserwacja

<!-- ## Maintenance -->

Sporadycznie Git uruchamia automatycznie komendę nazywaną "auto gc". Najczęściej ta komenda nic nie robi. Jednak, jeżeli istnieje za dużo luźnych obiektów (obiektów które nie są w plikach packfile), lub za dużo plików packfile, Git uruchamia pełną komendę `git gc`. Komenda `gc` (od ang. garbage collect) wykonuje różne operacje: gromadzi ona wszystkie luźne obiekty i umieszcza je w plikach packfile, łączy pliki packfile w jeden duży, oraz usuwa obiekty które nie są osiągalne przez żaden z commitów i są starsze niż kilka miesięcy.

<!-- Occasionally, Git automatically runs a command called "auto gc". Most of the time, this command does nothing. However, if there are too many loose objects (objects not in a packfile) or too many packfiles, Git launches a full-fledged `git gc` command. The `gc` stands for garbage collect, and the command does a number of things: it gathers up all the loose objects and places them in packfiles, it consolidates packfiles into one big packfile, and it removes objects that aren’t reachable from any commit and are a few months old. -->

Możesz uruchomić "auto gc" ręcznie w ten sposób:

<!-- You can run auto gc manually as follows: -->

    $ git gc --auto

I znowu, ona generalnie nic nie robi. Musisz mieć około 7000 luźnych obiektów, lub więcej niż 50 plików packfile, aby Git odpalił pełną komendę gc. Możesz zmienić te limity za pomocą ustawień konfiguracyjnych `gc.auto` oraz `gc.autopacklimit`.

<!-- Again, this generally does nothing. You must have around 7,000 loose objects or more than 50 packfiles for Git to fire up a real gc command. You can modify these limits with the `gc.auto` and `gc.autopacklimit` config settings, respectively. -->

Inną rzeczą którą komenda `gc` zrobi, jest spakowanie referencji do pojedynczego pliku. Załóżmy, że Twoje repozytorium zawiera następujące gałęzie i tagi:

<!-- The other thing `gc` will do is pack up your references into a single file. Suppose your repository contains the following branches and tags: -->

    $ find .git/refs -type f
    .git/refs/heads/experiment
    .git/refs/heads/master
    .git/refs/tags/v1.0
    .git/refs/tags/v1.1

jeżeli uruchomisz `git gc`, nie będziesz miał już tych plików w katalogu `refs`. Git przeniesie je, w celu poprawienia wydajności do pliku `.git/packed-refs`, który wygląda tak:

<!-- If you run `git gc`, you’ll no longer have these files in the `refs` directory. Git will move them for the sake of efficiency into a file named `.git/packed-refs` that looks like this: -->

    $ cat .git/packed-refs
    # pack-refs with: peeled
    cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
    ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
    cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
    9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
    ^1a410efbd13591db07496601ebc7a059dd55cfe9

Jeżeli zaktualizujesz referencje, Git nie będzie zmieniał tego pliku, ale zamiast tego stworzy nowy plik w `refs/heads`. Aby pobrać właściwą sumę SHA dla danej referencji, Git sprawdzi czy istnieje ona w katalogu `refs`, a następnie sprawdzi plik `packed-refs`. Jeżeli nie możesz znaleźć referencji w katalogu `refs`, jest ona prawdopodobnie w pliku `packed-refs`.

<!-- If you update a reference, Git doesn’t edit this file but instead writes a new file to `refs/heads`. To get the appropriate SHA for a given reference, Git checks for that reference in the `refs` directory and then checks the `packed-refs` file as a fallback. However, if you can’t find a reference in the `refs` directory, it’s probably in your `packed-refs` file. -->

Zauważ, że ostatnia linia w tym pliku zaczyna się od `^`. Oznacza to, że dana etykieta jest etykietą opisaną, a ta linia jest commit-em na który on wskazuje.

<!-- Notice the last line of the file, which begins with a `^`. This means the tag directly above is an annotated tag and that line is the commit that the annotated tag points to. -->

## Odzyskiwanie Danych

<!-- ## Data Recovery -->

W pewnym momencie swojej pracy z Git, możesz czasami przez przypadek stracić commit. Zazwyczaj dzieje się tak dlatego, ponieważ wymusisz usunięcie gałęzi która miała w sobie zmiany, a okazuje się że jednak ją potrzebowałeś; lub wykonujesz na gałęzi hard-reset, porzucając zmiany które teraz potrzebujesz. Zakładając że tak się stało, w jaki sposób możesz odzyskać swoje zmiany?

<!-- At some point in your Git journey, you may accidentally lose a commit. Generally, this happens because you force-delete a branch that had work on it, and it turns out you wanted the branch after all; or you hard-reset a branch, thus abandoning commits that you wanted something from. Assuming this happens, how can you get your commits back? -->

Mamy tutaj przykład, na którym zobaczymy odzyskiwanie danych z testowego repozytorium na którym wykonano hard-reset na gałęzi master. Na początek, zobaczmy jak wygląda repozytorium w takiej sytuacji:

<!-- Here’s an example that hard-resets the master branch in your test repository to an older commit and then recovers the lost commits. First, let’s review where your repository is at this point: -->

    $ git log --pretty=oneline
    ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
    484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Teraz cofnij gałąź `master` do środkowej zmiany:

<!-- Now, move the `master` branch back to the middle commit: -->

    $ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
    HEAD is now at 1a410ef third commit
    $ git log --pretty=oneline
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

W ten sposób, skutecznie utraciłeś dwa najnowsze commity - nie masz gałęzi z której można by się dostać do nich. Musisz znaleźć najnowszą sumę SHA, a potem dodać gałąź wskazującą na nią. Najtrudniejsze jest znalezienie ostatniej sumy SHA - przecież nie zapamiętałeś jej, prawda?

<!-- You’ve effectively lost the top two commits — you have no branch from which those commits are reachable. You need to find the latest commit SHA and then add a branch that points to it. The trick is finding that latest commit SHA — it’s not like you’ve memorized it, right? -->

Często, najszybszym sposobem jest użycie narzędzia `git reflog`. W czasie pracy, Git w tle zapisuje na co wskazuje HEAD po każdej zmianie. Za każdym razem gdy wykonujesz commit lub zmieniasz gałęzie, reflog jest aktualizowany. Reflog jest również aktualizowany przez komendę `git update-ref`, co jest kolejnym argumentem za tym, aby jej używać zamiast zapisywać bezpośrednio wartości SHA do plików ref, tak jak zostało to opisane wcześniej w sekcji "Referencje w Git". Możesz zobaczyć na jakim etapie był projekt w każdym momencie za pomocą komendy `git reflog`:

<!-- Often, the quickest way is to use a tool called `git reflog`. As you’re working, Git silently records what your HEAD is every time you change it. Each time you commit or change branches, the reflog is updated. The reflog is also updated by the `git update-ref` command, which is another reason to use it instead of just writing the SHA value to your ref files, as we covered in the "Git References" section of this chapter earlier.  You can see where you’ve been at any time by running `git reflog`: -->

    $ git reflog
    1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
    ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Widzimy tutaj dwa commity które pobraliśmy, jednak nie mamy za dużo informacji. Aby zobaczyć te same informacje w bardziej użytecznej formie, możemy uruchomić `git log -g`, która pokaże normalny wynik działania komendy log dla refloga:

<!-- Here we can see the two commits that we have had checked out, however there is not much information here.  To see the same information in a much more useful way, we can run `git log -g`, which will give you a normal log output for your reflog. -->

    $ git log -g
    commit 1a410efbd13591db07496601ebc7a059dd55cfe9
    Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
    Reflog message: updating HEAD
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:22:37 2009 -0700

        third commit

    commit ab1afef80fac8e34258ff41fc1b867c702daa24b
    Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
    Reflog message: updating HEAD
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:15:24 2009 -0700

         modified repo a bit

Wygląda na to, że dolny commit to jeden z tych które utraciłeś, możesz go odzyskać przez stworzenie nowej gałęzi wskazującej na niego. Na przykład, możesz dodać gałąź `recover-branch` wskazującą na ten commit (ab1afef):

<!-- It looks like the bottom commit is the one you lost, so you can recover it by creating a new branch at that commit. For example, you can start a branch named `recover-branch` at that commit (ab1afef): -->

    $ git branch recover-branch ab1afef
    $ git log --pretty=oneline recover-branch
    ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
    484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Świetnie - masz teraz gałąź `recover-branch`, która wskazuje na miejsce w którym był `master`, pozwalając tym samym na dostęp do pierwszych dwóch commitów. 
Następnie, załóżmy że utracone zmiany z jakiegoś powodu nie były w reflogu - możesz to zasymulować poprzez usunięcie `recover-branch` i usunięcie refloga. Teraz pierwsze dwa commity nie są dostępne w żaden sposób:

<!-- Cool — now you have a branch named `recover-branch` that is where your `master` branch used to be, making the first two commits reachable again.
Next, suppose your loss was for some reason not in the reflog — you can simulate that by removing `recover-branch` and deleting the reflog. Now the first two commits aren’t reachable by anything: -->

    $ git branch -D recover-branch
    $ rm -Rf .git/logs/

Ponieważ dane reflog są przechowywane w katalogu `.git/logs/`, w rzeczywistości nie masz refloga. W jaki sposób odtworzyć ten commit w tym momencie? Jednym ze sposobów jest użycie narzędzia `git fsck`, które sprawdza zawartość bazy pod względem integralności danych. Jeżeli uruchomisz go z opcją `--full`, pokaże on wszystkie obiekty do których nie da się dotrzeć przez inne:

<!-- Because the reflog data is kept in the `.git/logs/` directory, you effectively have no reflog. How can you recover that commit at this point? One way is to use the `git fsck` utility, which checks your database for integrity. If you run it with the `-\-full` option, it shows you all objects that aren’t pointed to by another object: -->

    $ git fsck --full
    dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
    dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
    dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
    dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

W tym przypadku, możesz zobaczyć brakujący commit oznaczony jako opuszczony (ang. dangling). Możesz odtworzyć go w ten sam sposób, poprzez dodanie gałęzi wskazującej na jego SHA.

<!-- In this case, you can see your missing commit after the dangling commit. You can recover it the same way, by adding a branch that points to that SHA. -->

## Usuwanie obiektów

<!-- ## Removing Objects -->

Można powiedzieć dużo dobrego o Gitcie, ale jedną z funkcjonalności która może powodować problemy jest fakt, że `git clone` pobiera całą historię projektu, włącznie z każdą wersją wszystkich plików. Jest to dobre rozwiązanie, jeżeli całość to kod źródłowy, ponieważ Git został przygotowany do tego aby efektywnie kompresować takie dane. Jednak, jeżeli w jakimś momencie trwania projektu, ktoś dodał pojedynczy duży plik, podczas klonowania repozytorium zawsze będzie on pobierany, nawet jeżeli został usunięty z projektu w następnym commicie. Ze względu na to, że można do niego dostać się przez historię projektu, zawsze tam będzie.

<!-- There are a lot of great things about Git, but one feature that can cause issues is the fact that a `git clone` downloads the entire history of the project, including every version of every file. This is fine if the whole thing is source code, because Git is highly optimized to compress that data efficiently. However, if someone at any point in the history of your project added a single huge file, every clone for all time will be forced to download that large file, even if it was removed from the project in the very next commit. Because it’s reachable from the history, it will always be there. -->

Może to być dużym problemem podczas konwersji repozytoriów Subversion lub Perforce do Gita. Ponieważ nie pobierasz w nich całej historii projektu, dodanie tak dużego pliku będzie powodowało pewne konsekwencje. Jeżeli wykonałeś import z innego systemu lub zobaczyłeś, że Twoje repozytorium jest dużo większej niż być powinno, poniżej prezentuję sposób na usunięcie dużych obiektów.

<!-- This can be a huge problem when you’re converting Subversion or Perforce repositories into Git. Because you don’t download the whole history in those systems, this type of addition carries few consequences. If you did an import from another system or otherwise find that your repository is much larger than it should be, here is how you can find and remove large objects. -->

Ale uwaga: ta technika działa destrukcyjnie na Twoją historię zmian. Nadpisuje ona każdy obiekt, począwszy od najwcześniejszego który trzeba zmodyfikować aby usunąć odwołanie do pliku. Jeżeli wykonasz to od razu po zaimportowaniu, zanim ktokolwiek rozpoczął pracę bazującą na nich, wszystko będzie w porządku - w przeciwnym wypadku, będziesz musiał poinformować wszystkich współpracowników o tym, że muszą wykonać "rebase" na nowe commity.

<!-- Be warned: this technique is destructive to your commit history. It rewrites every commit object downstream from the earliest tree you have to modify to remove a large file reference. If you do this immediately after an import, before anyone has started to base work on the commit, you’re fine — otherwise, you have to notify all contributors that they must rebase their work onto your new commits. -->

W celach demonstracyjnych, dodasz duży plik do swojego testowego repozytorium, usuniesz go w kolejnym commicie, odszukasz go i następnie usuniesz na stałe z repozytorium. Najpierw dodaj duży plik do repozytorium:

<!-- To demonstrate, you’ll add a large file into your test repository, remove it in the next commit, find it, and remove it permanently from the repository. First, add a large object to your history: -->

    $ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
    $ git add git.tbz2
    $ git commit -am 'added git tarball'
    [master 6df7640] added git tarball
     1 files changed, 0 insertions(+), 0 deletions(-)
     create mode 100644 git.tbz2

Oops - nie chciałeś dodać tego dużego pliku do projekt. Najlepiej usuń go:

<!-- Oops — you didn’t want to add a huge tarball to your project. Better get rid of it: -->

    $ git rm git.tbz2
    rm 'git.tbz2'
    $ git commit -m 'oops - removed large tarball'
    [master da3f30d] oops - removed large tarball
     1 files changed, 0 insertions(+), 0 deletions(-)
     delete mode 100644 git.tbz2

Teraz, uruchom `gc` na bazie danych i zobacz jak dużo miejsca jest zajmowane:

<!-- Now, `gc` your database and see how much space you’re using: -->

    $ git gc
    Counting objects: 21, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (16/16), done.
    Writing objects: 100% (21/21), done.
    Total 21 (delta 3), reused 15 (delta 1)

Możesz uruchomić komendę `count-objects`, aby szybko zobaczyć jak dużo miejsca jest zajmowane:

<!-- You can run the `count-objects` command to quickly see how much space you’re using: -->

    $ git count-objects -v
    count: 4
    size: 16
    in-pack: 21
    packs: 1
    size-pack: 2016
    prune-packable: 0
    garbage: 0

Wpis `size-pack` pokazuje wielkość plików packfile wyrażonych w kilobajtach, więc używasz 2MB. Przed ostatnim commitem, używałeś blisko 2K - a więc jasno widać, że usunięcie pliku w poprzednim commitcie nie usunęło go z historii. Za każdym razem, gdy ktoś sklonuje to repozytorium, będzie musiał pobrać całe 2MB aby pobrać ten malutki projekt, tylko dlatego że pochopnie dodałeś duży plik. Naprawmy to.

<!-- The `size-pack` entry is the size of your packfiles in kilobytes, so you’re using 2MB. Before the last commit, you were using closer to 2K — clearly, removing the file from the previous commit didn’t remove it from your history. Every time anyone clones this repository, they will have to clone all 2MB just to get this tiny project, because you accidentally added a big file. Let’s get rid of it. -->

Najpierw będzie musiał go znaleźć. W naszym wypadku, wiesz jaki plik to był. Ale załóżmy że nie wiesz; w jaki sposób dowiesz się jaki plik lub pliki zajmują tyle miejsca? Po uruchomieniu `git gc`, wszystkie obiekty są w plikach packfile; ale możesz zidentyfikować duże obiekty przez uruchomienie komendy `git verify-pack` i posortowanie wyniku po trzeciej kolumnie, oznaczającej rozmiar pliku. Możesz również przekazać wynik do komendy `tail` ponieważ jesteś zainteresowany tylko kilkoma największymi plikami:

<!-- First you have to find it. In this case, you already know what file it is. But suppose you didn’t; how would you identify what file or files were taking up so much space? If you run `git gc`, all the objects are in a packfile; you can identify the big objects by running another plumbing command called `git verify-pack` and sorting on the third field in the output, which is file size. You can also pipe it through the `tail` command because you’re only interested in the last few largest files: -->

    $ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
    e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
    05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
    7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

Duży obiekt jest na samym dole: 2MB. Aby dowiedzieć się jaki to jest plik, użyjesz komendy `rev-list`, której miałeś okazję już poznać w rozdziale 7. Jeżeli przekażesz opcję `--objects` do `rev-list`, w wyniku pokazane zostaną sumy SHA commitów oraz obiektów blob z przyporządkowanymi do nich nazwami plików. Możesz użyć tej komendy, aby odnaleźć nazwę obiektu blob:

<!-- The big object is at the bottom: 2MB. To find out what file it is, you’ll use the `rev-list` command, which you used briefly in Chapter 7. If you pass `-\-objects` to `rev-list`, it lists all the commit SHAs and also the blob SHAs with the file paths associated with them. You can use this to find your blob’s name: -->

    $ git rev-list --objects --all | grep 7a9eb2fb
    7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Teraz, musisz usunąć ten plik ze wszystkich starszych rewizji. W łaty sposób możesz zobaczyć jakie commity modyfikowały ten plik:

<!-- Now, you need to remove this file from all trees in your past. You can easily see what commits modified this file: -->

    $ git log --pretty=oneline --branches -- git.tbz2
    da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
    6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Musisz nadpisać wszystkie commity starsze niż `6df76`, aby w pełni usunąć ten plik z historii projektu w Git. Aby to zrobić, użyjesz komendy `filter-branch`, poznanej w rozdziale 6.

<!-- You must rewrite all the commits downstream from `6df76` to fully remove this file from your Git history. To do so, you use `filter-branch`, which you used in Chapter 6: -->

    $ git filter-branch --index-filter \
       'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
    Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
    Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
    Ref 'refs/heads/master' was rewritten

Opcja `--index-filter` jest podobna do opcji `--tree-filter` opisanej w rozdziale 6, z tą różnicą, że zamiast przekazywać komendę, która modyfikuje pobrane pliki na dysku, modyfikuje przechowalnię lub indeks za każdym razem. Zamiast usuwać konkretny plik za pomocą `rm file`, musisz usunąć go za pomocą `git rm --cached` - musisz usunąć go z indeksu, nie z dysku. Powodem do takiego zachowania jest prędkość - ponieważ Git nie musi pobrać każdej rewizji na dysk przed uruchomieniem filtra, cały proces może być dużo szybszy. Możesz osiągnąć taki sam efekt za pomocą `--tree-filter`, jeżeli chcesz. Opcja `--ignore-unmatch` do `git rm` wskazuje, aby nie pokazywać błędu w przypadku, gdy szukana ścieżka nie istnieje. Na koniec, wskazujesz `filter-branch`, aby przepisana została historia począwszy od `6df7640`, ponieważ wiesz że właśnie tam problem powstał. W przeciwnym razie, rozpocznie ona działanie od początku i przez to będzie trwała niepotrzebnie dłużej.

<!-- The `-\-index-filter` option is similar to the `-\-tree-filter` option used in Chapter 6, except that instead of passing a command that modifies files checked out on disk, you’re modifying your staging area or index each time. Rather than remove a specific file with something like `rm file`, you have to remove it with `git rm -\-cached` — you must remove it from the index, not from disk. The reason to do it this way is speed — because Git doesn’t have to check out each revision to disk before running your filter, the process can be much, much faster. You can accomplish the same task with `-\-tree-filter` if you want. The `-\-ignore-unmatch` option to `git rm` tells it not to error out if the pattern you’re trying to remove isn’t there. Finally, you ask `filter-branch` to rewrite your history only from the `6df7640` commit up, because you know that is where this problem started. Otherwise, it will start from the beginning and will unnecessarily take longer. -->

Twoja historia nie zawiera już odwołań do tego pliku. Ale reflog i nowe referencje które zostały dodane, wtedy gdy uruchomiłeś `filter-branch` w `.git/refs/original` nadal tak, musisz więc je usunąć i przepakować bazę danych. Musisz pozbyć się wszystkiego co wskazuje na te stare commity przed przepakowaniem:

<!-- Your history no longer contains a reference to that file. However, your reflog and a new set of refs that Git added when you did the `filter-branch` under `.git/refs/original` still do, so you have to remove them and then repack the database. You need to get rid of anything that has a pointer to those old commits before you repack: -->

    $ rm -Rf .git/refs/original
    $ rm -Rf .git/logs/
    $ git gc
    Counting objects: 19, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (14/14), done.
    Writing objects: 100% (19/19), done.
    Total 19 (delta 3), reused 16 (delta 1)

Zobaczmy ile miejsce udało się zaoszczędzić.

<!-- Let’s see how much space you saved. -->

    $ git count-objects -v
    count: 8
    size: 2040
    in-pack: 19
    packs: 1
    size-pack: 7
    prune-packable: 0
    garbage: 0

Wielkość spakowanego repozytorium to teraz 7K, co jest dużo lepszym wynikiem niż 2MB. Możesz odczytać z wartości "size", że ten duży obiekt nadal znajduje się w repozytorium, nie został więc całkowicie usunięty; jednak co najważniejsze, nie będzie już przesyłany podczas wykonywania push lub klonowania. Jeżeli mocno chcesz, możesz usunąć ten obiekt całkowicie przez uruchomienie komendy `git prune --expire`.

<!-- The packed repository size is down to 7K, which is much better than 2MB. You can see from the size value that the big object is still in your loose objects, so it’s not gone; but it won’t be transferred on a push or subsequent clone, which is what is important. If you really wanted to, you could remove the object completely by running `git prune -\-expire`. -->
