# Obiekty Gita

<!-- # Git Objects -->

Git to tak naprawdę system plików zorientowany na treść. Super. Ale co to oznacza?
Oznacza to, że Git u podstaw, to baza danych w której znajdują się dane i przypisane do nich klucze (ang. key-value datastore). Możesz zapisać w niej każdy rodzaj danych, a w odpowiedzi otrzymasz klucz, dzięki któremu będziesz mógł dostać się do tych danych w każdej chwili. Aby zademonstrować jak to działa, możesz użyć komendy `hash-object`, która pobiera jakieś dane, zapisuje je w katalogu `.git` i zwraca klucz pod którym te dane zostały zapisane. Najpierw zainicjujesz nowe repozytorium Gita i sprawdzisz, że katalog `objects` jest pusty:

<!-- Git is a content-addressable filesystem. Great. What does that mean?
It means that at the core of Git is a simple key-value data store. You can insert any kind of content into it, and it will give you back a key that you can use to retrieve the content again at any time. To demonstrate, you can use the plumbing command `hash-object`, which takes some data, stores it in your `.git` directory, and gives you back the key the data is stored as. First, you initialize a new Git repository and verify that there is nothing in the `objects` directory: -->

    $ mkdir test
    $ cd test
    $ git init
    Initialized empty Git repository in /tmp/test/.git/
    $ find .git/objects
    .git/objects
    .git/objects/info
    .git/objects/pack
    $ find .git/objects -type f
    $

Git zainicjował katalog `objects` oraz stworzył w nim dwa katalogi `pack` i `info`, jednak nie ma w nich żadnych plików. Teraz zapisz jakieś dane w bazie danych Gita:

<!-- Git has initialized the `objects` directory and created `pack` and `info` subdirectories in it, but there are no regular files. Now, store some text in your Git database: -->

    $ echo 'test content' | git hash-object -w --stdin
    d670460b4b4aece5915caf5c68d12f560a9fe3e4

Opcja `-w` wskazuje komendzie `hash-object` aby zapisała obiekt, w przeciwnym wypadku pokazała by tylko jaki klucz byłby użyty. Opcja `--stdin` wskazuje, aby dane zostały odczytane ze standardowego wejścia; jeżeli nie podasz tej opcji, `hash-object` będzie wymagał podania ścieżki do pliku. Wynikiem działania tej komendy jest 40 znakowa suma kontrolna. Jest to skrót SHA-1 - suma kontrolna zawartości którą zapisujesz, oraz nagłówków, o których dowiesz się za chwilę. Teraz możesz zobaczyć w jaki sposób Git zachował dane:

<!-- The `-w` tells `hash-object` to store the object; otherwise, the command simply tells you what the key would be. `-\-stdin` tells the command to read the content from stdin; if you don’t specify this, `hash-object` expects the path to a file. The output from the command is a 40-character checksum hash. This is the SHA-1 hash — a checksum of the content you’re storing plus a header, which you’ll learn about in a bit. Now you can see how Git has stored your data: -->

    $ find .git/objects -type f
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Możesz zobaczyć nowy plik w katalogu `objects`. W ten sposób Git początkowo zapisuje dane - jako pojedynczy plik dla każdej części danych, nazwany tak jak wyliczony skrót SHA-1 z treści danych i nagłówka. Podkatalog jest nazwany od 2 pierwszych znaków SHA, a nazwa pliku to pozostałe 38 znaków.

<!-- You can see a file in the `objects` directory. This is how Git stores the content initially — as a single file per piece of content, named with the SHA-1 checksum of the content and its header. The subdirectory is named with the first 2 characters of the SHA, and the filename is the remaining 38 characters. -->

Możesz pobrać dane z Gita za pomocą komendy `cat-file`. Polecenie to, to coś w rodzaju szwajcarskiego scyzoryka dla inspekcji obiektów Gita. Przekazanie opcji `-p` mówi `cat-file`, aby rozpoznała ona rodzaj przechowywanych danych i wypisała je na ekran:

<!-- You can pull the content back out of Git with the `cat-file` command. This command is sort of a Swiss army knife for inspecting Git objects. Passing `-p` to it instructs the `cat-file` command to figure out the type of content and display it nicely for you: -->

    $ git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4
    test content

Teraz, możesz dodać dane do Gita i pobrać je z powrotem. Możesz również to zrobić z danymi znajdującymi się w plikach. Dla przykładu, dodajmy plik do systemu kontroli wersji. Najpierw stwórzmy nowy plik i zapiszmy jego zawartość w bazie danych:

<!-- Now, you can add content to Git and pull it back out again. You can also do this with content in files. For example, you can do some simple version control on a file. First, create a new file and save its contents in your database: -->

    $ echo 'version 1' > test.txt
    $ git hash-object -w test.txt
    83baae61804e65cc73a7201a7252750c76066a30

Następnie wprowadź nowe dane do tego pliku i zapisz ponownie:

<!-- Then, write some new content to the file, and save it again: -->

    $ echo 'version 2' > test.txt
    $ git hash-object -w test.txt
    1f7a7a472abf3dd9643fd615f6da379c4acb3e3a

Twoja baza danych zawiera teraz dwie nowe wersje pliku, jak również początkową jego zawartość którą zapisałeś:

<!-- Your database contains the two new versions of the file as well as the first content you stored there: -->

    $ find .git/objects -type f
    .git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a
    .git/objects/83/baae61804e65cc73a7201a7252750c76066a30
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Teraz możesz cofnąć zawartość pliku do pierwszej wersji:

<!-- Now you can revert the file back to the first version -->

    $ git cat-file -p 83baae61804e65cc73a7201a7252750c76066a30 > test.txt
    $ cat test.txt
    version 1

lub drugiej:

<!-- or the second version: -->

    $ git cat-file -p 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a > test.txt
    $ cat test.txt
    version 2

Ale zapamiętywanie kluczy SHA-1 dla każdej wersji nie jest praktyczne; dodatkowo nie zachowujesz nazwy pliku - tylko treść. Ten rodzaj obiektu nazywa się "blob". Możesz uzyskać informacje o tym jaki typ obiektu kryje się pod danym skrótem SHA-1 za pomocą `cat-file -t`:

<!-- But remembering the SHA-1 key for each version of your file isn’t practical; plus, you aren’t storing the filename in your system — just the content. This object type is called a blob. You can have Git tell you the object type of any object in Git, given its SHA-1 key, with `cat-file -t`: -->

    $ git cat-file -t 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
    blob

## Obiekty drzew

<!-- ## Tree Objects -->

Następnym typem obiektów który poznasz są obiekty drzew (ang. tree), które rozwiązują problem przechowywania nazw plików oraz pozwalają na przechowywanie grupy plików razem. Git przechowuje treść w sposób podobny do systemu plików UNIX, lecz z pewnymi uproszczeniami. Wszystkie dane przechowywane są jako obiekty tree i blob, obiektami tree odpowiadającymi strukturze katalogów w systemie UNIX, oraz obiektami blob, które w mniejszym lub większym stopniu odpowiadają inodom lub treści plików. Pojedynczy obiekt tree zawiera jeden lub więcej wpisów dotyczących ścieżki, z których każdy zawiera skrót SHA-1 wskazujący na obiekt blob lub poddrzewem (ang. subtree) z przypisanym trybem, typem i nazwą pliku. Na przykład, najnowsze drzewo w projekcie simplegit może wygląda tak:

<!-- The next type you’ll look at is the tree object, which solves the problem of storing the filename and also allows you to store a group of files together. Git stores content in a manner similar to a UNIX filesystem, but a bit simplified. All the content is stored as tree and blob objects, with trees corresponding to UNIX directory entries and blobs corresponding more or less to inodes or file contents. A single tree object contains one or more tree entries, each of which contains a SHA-1 pointer to a blob or subtree with its associated mode, type, and filename. For example, the most recent tree in the simplegit project may look something like this: -->

    $ git cat-file -p master^{tree}
    100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
    100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
    040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib

Składnia `master^{tree}` wskazuje na obiekt tree na który wskazuje ostatni commit w Twojej gałęzi `master`. Zauważ, że podkatalog `lib` nie jest blobem, ale wskaźnikiem na inny obiekt tree.

<!-- The `master^{tree}` syntax specifies the tree object that is pointed to by the last commit on your `master` branch. Notice that the `lib` subdirectory isn’t a blob but a pointer to another tree: -->

    $ git cat-file -p 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0
    100644 blob 47c6340d6459e05787f644c2447d2595f5d3a54b      simplegit.rb

W ogólnym zarysie, dane które Git przechowuje wyglądają podobnie do tych pokazanych na rysunku 9-1.

<!-- Conceptually, the data that Git is storing is something like Figure 9-1. -->


![](http://git-scm.com/figures/18333fig0901-tn.png)

Figure 9-1. Prosty przykład modelu danych w Git.

<!-- Figure 9-1. Simple version of the Git data model. -->

Możesz stworzyć swój własny obiekt tree. Git zazwyczaj tworzy taki obiekt poprzez pobranie stanu przechowalni lub indeksu i zapisanie obiektu tree z tych danych. A więc, aby stworzyć obiekt tree, na początek musisz ustawić indeks poprzez dodanie do przechowalni plików. Indeks z jednym elementem - z pierwszą wersją Twojego pliku test.txt - możesz stworzyć używając komendy `update-index`. Możesz jej również do sztucznego dodania poprzedniej wersji pliku test.txt do przechowalni. Musisz podać jej opcje `--add` ponieważ plik nie istnieje jeszcze w przechowalni (nie masz jeszcze nawet ustawionej przechowalni) oraz `--cacheinfo` ponieważ plik który dodajesz nie istnieje w katalogu, a tylko w bazie danych. Następnie wskazujesz tryb, sumę SHA-1 oraz nazwę pliku:

<!-- You can create your own tree. Git normally creates a tree by taking the state of your staging area or index and writing a tree object from it. So, to create a tree object, you first have to set up an index by staging some files. To create an index with a single entry — the first version of your test.txt file — you can use the plumbing command `update-index`. You use this command to artificially add the earlier version of the test.txt file to a new staging area. You must pass it the `-\-add` option because the file doesn’t yet exist in your staging area (you don’t even have a staging area set up yet) and `-\-cacheinfo` because the file you’re adding isn’t in your directory but is in your database. Then, you specify the mode, SHA-1, and filename: -->

    $ git update-index --add --cacheinfo 100644 \
      83baae61804e65cc73a7201a7252750c76066a30 test.txt

W tym przykładzie, podałeś tryb `100644`, który wskazuje na normalny plik. Inne dostępne tryby to `100755`, który wskazuje na plik wykonywalny; oraz `120000`, który wskazuje na dowiązanie symboliczne. Tryby bazują na normalnych uprawnieniach w systemie UNIX, ale mają znacznie mniej opcji - te trzy tryby są jedynymi, które mogą być stosowane do plików (blob-ów) w Gitcie (chociaż inne tryby mogą być użyte dla katalogów i podmodułów).

<!-- In this case, you’re specifying a mode of `100644`, which means it’s a normal file. Other options are `100755`, which means it’s an executable file; and `120000`, which specifies a symbolic link. The mode is taken from normal UNIX modes but is much less flexible — these three modes are the only ones that are valid for files (blobs) in Git (although other modes are used for directories and submodules). -->

Teraz, możesz użyć komendy `write-tree`, w celu zapisania zawartości przechowani do obiektu tree. Opcja `-w` nie jest potrzebna - wywołanie `write-tree` automatycznie tworzy obiekt tree ze stanu indeksu, jeżeli ten obiekt jeszcze nie istnieje.

<!-- Now, you can use the `write-tree` command to write the staging area out to a tree object. No `-w` option is needed — calling `write-tree` automatically creates a tree object from the state of the index if that tree doesn’t yet exist: -->

    $ git write-tree
    d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    $ git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    100644 blob 83baae61804e65cc73a7201a7252750c76066a30      test.txt

Możesz również zweryfikować, że to jest obiekt tree:

<!-- You can also verify that this is a tree object: -->

    $ git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    tree

Stworzysz teraz nowy obiekt tree, zawierający drugą wersję pliku test.txt oraz nowy plik:

<!-- You’ll now create a new tree with the second version of test.txt and a new file as well: -->

    $ echo 'new file' > new.txt
    $ git update-index test.txt
    $ git update-index --add new.txt


W Twojej przechowalni znajduje się teraz nowa wersja pliku test.txt oraz nowy plik new.txt. Zapisz ten stan (pobierając stan z przechowalni lub indeksu do obiektu tree) i sprawdź jak on teraz wygląda:

<!-- Your staging area now has the new version of test.txt as well as the new file new.txt. Write out that tree (recording the state of the staging area or index to a tree object) and see what it looks like: -->

    $ git write-tree
    0155eb4229851634a0f03eb265b69f5a2d56f341
    $ git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
    100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
    100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Zauważ, że to drzewo posiada oba wpisy dotyczące plików, oraz że suma SHA w pliku test.txt jest sumą przypisaną do "wersji 2" (`1f7a7a`). Dla zabawy, dodasz pierwszy obiekt tree jako podkatalog w obecnym. Możesz wczytać obiekt tree do swojej przechowalni poprzez wywołanie `read-tree`. W takim wypadku, możesz wczytać obecne drzewo do swojej przechowalni i umieścić je w podkatalogu za pomocą opcji `--prefix` dodanej do `read-tree`:

<!-- Notice that this tree has both file entries and also that the test.txt SHA is the "version 2" SHA from earlier (`1f7a7a`). Just for fun, you’ll add the first tree as a subdirectory into this one. You can read trees into your staging area by calling `read-tree`. In this case, you can read an existing tree into your staging area as a subtree by using the `-\-prefix` option to `read-tree`: -->

    $ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    $ git write-tree
    3c4e9cd789d88d8d89c1073707c3585e41b0e614
    $ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
    040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
    100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
    100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Jeżeli odtworzyłeś katalog roboczy z drzewa które właśnie zapisałeś, otrzymałeś dwa pliki na najwyższym poziomie w tym katalogu, oraz podkatalog `bak`, który zawiera pierwszą wersję pliku test.txt. Możesz myśleć o danych przechowywanych w Gitcie z tymi strukturami, tak jak przedstawiono na rysunku 9-2.

<!-- If you created a working directory from the new tree you just wrote, you would get the two files in the top level of the working directory and a subdirectory named `bak` that contained the first version of the test.txt file. You can think of the data that Git contains for these structures as being like Figure 9-2. -->


![](http://git-scm.com/figures/18333fig0902-tn.png)

Figure 9-2. Zawartość struktury obecnych danych Git.

<!-- Figure 9-2. The content structure of your current Git data. -->

## Obiekty Commit

<!-- ## Commit Objects -->

Masz teraz trzy obiekty tree, które wskazują na różne migawki śledzonego projektu, ale poprzedni problem pozostał: musisz pamiętasz wszystkie trzy wartości SHA-1 aby przywrócić migawkę. Nie masz również żadnych informacji o tym kto zapisał migawkę, kiedy była zapisana, ani dlaczego. To są podstawowe informacje, które przechowywane są w obiektach typu commit.

<!-- You have three trees that specify the different snapshots of your project that you want to track, but the earlier problem remains: you must remember all three SHA-1 values in order to recall the snapshots. You also don’t have any information about who saved the snapshots, when they were saved, or why they were saved. This is the basic information that the commit object stores for you. -->

Aby stworzyć obiekt commit, wywołaj `commit-tree` i podaj jedną sumę SHA-1 wskazującą na obiekt tree oraz obiekty commit, o ile były jakieś, które bezpośrednio go poprzedziły.

<!-- To create a commit object, you call `commit-tree` and specify a single tree SHA-1 and which commit objects, if any, directly preceded it. Start with the first tree you wrote: -->

    $ echo 'first commit' | git commit-tree d8329f
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d

Możesz teraz zobaczyć jak wygląda nowy obiekt commit za pomocą `cat-file`:

<!-- Now you can look at your new commit object with `cat-file`: -->

    $ git cat-file -p fdf4fc3
    tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    author Scott Chacon <schacon@gmail.com> 1243040974 -0700
    committer Scott Chacon <schacon@gmail.com> 1243040974 -0700

    first commit

Format obiektu commit jest prosty: wskazuje on najnowszy obiekt tree dla migawki projektu w momencie tworzenia; informacje o autorze/integratorze zmiany pobrane z są ustawień konfiguracyjnych `user.name` i `user.email` wraz z obecnym znacznikiem czasu; pustą linię i potem treść komentarza do zmiany.

<!-- The format for a commit object is simple: it specifies the top-level tree for the snapshot of the project at that point; the author/committer information pulled from your `user.name` and `user.email` configuration settings, with the current timestamp; a blank line, and then the commit message. -->

Następnie, zapiszesz dwa inne obiekty commit, z których każdy odwołuje się do commit-a który był bezpośrednio przed nim:

<!-- Next, you’ll write the other two commit objects, each referencing the commit that came directly before it: -->

    $ echo 'second commit' | git commit-tree 0155eb -p fdf4fc3
    cac0cab538b970a37ea1e769cbbde608743bc96d
    $ echo 'third commit'  | git commit-tree 3c4e9c -p cac0cab
    1a410efbd13591db07496601ebc7a059dd55cfe9

Każdy z trzech obiektów commit wskazuje na jedną z trzech migawek które stworzyłeś. Co ciekawe, masz teraz prawdziwą historię w Git, którą możesz obejrzeć za pomocą komendy `git log`, jeżeli uruchomisz ją na ostatniej sumą SHA-1 obiektu commit:

<!-- Each of the three commit objects points to one of the three snapshot trees you created. Oddly enough, you have a real Git history now that you can view with the `git log` command, if you run it on the last commit SHA-1: -->

    $ git log --stat 1a410e
    commit 1a410efbd13591db07496601ebc7a059dd55cfe9
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:15:24 2009 -0700

        third commit

     bak/test.txt |    1 +
     1 files changed, 1 insertions(+), 0 deletions(-)

    commit cac0cab538b970a37ea1e769cbbde608743bc96d
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:14:29 2009 -0700

        second commit

     new.txt  |    1 +
     test.txt |    2 +-
     2 files changed, 2 insertions(+), 1 deletions(-)

    commit fdf4fc3344e67ab068f836878b6c4951e3b15f3d
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:09:34 2009 -0700

        first commit

     test.txt |    1 +
     1 files changed, 1 insertions(+), 0 deletions(-)

Niesamowite. Wykonałeś właśnie niskopoziomowe operacje i stworzyłeś historię w Git bez używania żadnej z komend użytkownika. Jest to w zasadzie to, co Git robi kiedy uruchomisz komendy `git add` oraz `git commit` - zapisuje obiekty blob dla plików które zmieniłeś, aktualizuje indeks, zapisuje obiekt tree, oraz tworzy obiekt commit odnoszący się do obiektu tree oraz obiektów commit które wystąpiły bezpośrednio przed nim. Te trzy główne obiekty Gita - blob, tree oraz commit - są na początku zapisywane jako pojedyncze pliki w katalogu `.git/objects`. Poniżej widać wszystkie obiekty z naszego przykładu, z komentarzami wskazującymi na to co było w nich zapisane:

<!-- Amazing. You’ve just done the low-level operations to build up a Git history without using any of the front ends. This is essentially what Git does when you run the `git add` and `git commit` commands — it stores blobs for the files that have changed, updates the index, writes out trees, and writes commit objects that reference the top-level trees and the commits that came immediately before them. These three main Git objects — the blob, the tree, and the commit — are initially stored as separate files in your `.git/objects` directory. Here are all the objects in the example directory now, commented with what they store: -->

    $ find .git/objects -type f
    .git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
    .git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
    .git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
    .git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
    .git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
    .git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
    .git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
    .git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
    .git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Jeżeli prześledzisz wszystkie wskaźniki, dostaniesz widok obiektów podobny do rysunku 9-3.

<!-- If you follow all the internal pointers, you get an object graph something like Figure 9-3. -->


![](http://git-scm.com/figures/18333fig0903-tn.png)

Figure 9-3. Wszystkie obiekty w Twoim repozytorium Gita.

<!-- Figure 9-3. All the objects in your Git directory. -->

## Zapisywanie obiektów

<!-- ## Object Storage -->

Wcześniej wspomniałem, że nagłówek jest zapisywanie wraz z treścią. Spójrzmy przez chwilę w jaki sposób Git zapisuje swoje obiekty. Zobaczysz jak zapisać obiekt blob - na przykładzie treści "what is up, doc?" - interaktywnie w języku skryptowym Ruby. Możesz uruchomić tryb interaktywny w Ruby, za pomocą komendy `irb`:

<!-- I mentioned earlier that a header is stored with the content. Let’s take a minute to look at how Git stores its objects. You’ll see how to store a blob object — in this case, the string "what is up, doc?" — interactively in the Ruby scripting language. You can start up interactive Ruby mode with the `irb` command: -->

    $ irb
    >> content = "what is up, doc?"
    => "what is up, doc?"

Git tworząc nagłówek na początku wskazuje jakiego typu jest obiekt, w tym wypadku blob. Następnie, dodaje spację i wielkość treści, oraz na końcu znak null:

<!-- Git constructs a header that starts with the type of the object, in this case a blob. Then, it adds a space followed by the size of the content and finally a null byte: -->

    >> header = "blob #{content.length}\0"
    => "blob 16\000"

Git łączy nagłówek z treścią, a potem oblicza sumę SHA-1 całości. Możesz obliczyć sumę SHA-1 dla treści w Ruby, po włączeniu biblioteki "SHA1 digest" za pomocą komendy `require`, oraz po wywołaniu `Digest::SHA1.hexdigest()` na nim:

<!-- Git concatenates the header and the original content and then calculates the SHA-1 checksum of that new content. You can calculate the SHA-1 value of a string in Ruby by including the SHA1 digest library with the `require` command and then calling `Digest::SHA1.hexdigest()` with the string: -->

    >> store = header + content
    => "blob 16\000what is up, doc?"
    >> require 'digest/sha1'
    => true
    >> sha1 = Digest::SHA1.hexdigest(store)
    => "bd9dbf5aae1a3862dd1526723246b20206e5fc37"

Git kompresuje nową treść za pomocą zlib, co możesz wykonać w Ruby przy użyciu biblioteki zlib. Najpierw, musisz dodać wpis `require`, a potem uruchomić na treści `Zlib::Deflate.deflate()`:

<!-- Git compresses the new content with zlib, which you can do in Ruby with the zlib library. First, you need to require the library and then run `Zlib::Deflate.deflate()` on the content: -->

    >> require 'zlib'
    => true
    >> zlib_content = Zlib::Deflate.deflate(store)
    => "x\234K\312\311OR04c(\317H,Q\310,V(-\320QH\311O\266\a\000_\034\a\235"

Na koniec, zapiszesz spakowaną treść jako obiektu na dysku. Ustalisz ścieżkę dla obiektu który zapisujesz (pierwsze dwa znaki z sumy SHA-1 są nazwą podkatalogu, a pozostałe 38 znaków są nazwą pliku w tym katalogu). W Ruby możesz użyć funkcji `FileUtils.mkdir_p()`, aby stworzyć podkatalog w przypadku gdy on nie istnieje. Następnie otwórz plik za pomocą `File.open()` i zapisz otrzymaną skompresowaną zawartość do pliku za pomocą funkcji `write()` wywołanej na otrzymanym uchwycie pliku:

<!-- Finally, you’ll write your zlib-deflated content to an object on disk. You’ll determine the path of the object you want to write out (the first two characters of the SHA-1 value being the subdirectory name, and the last 38 characters being the filename within that directory). In Ruby, you can use the `FileUtils.mkdir_p()` function to create the subdirectory if it doesn’t exist. Then, open the file with `File.open()` and write out the previously zlib-compressed content to the file with a `write()` call on the resulting file handle: -->

    >> path = '.git/objects/' + sha1[0,2] + '/' + sha1[2,38]
    => ".git/objects/bd/9dbf5aae1a3862dd1526723246b20206e5fc37"
    >> require 'fileutils'
    => true
    >> FileUtils.mkdir_p(File.dirname(path))
    => ".git/objects/bd"
    >> File.open(path, 'w') { |f| f.write zlib_content }
    => 32

To tyle - stworzyłeś poprawny obiekt blog w Gitcie. Wszystkie obiekty w Git przechowywane są w taki sam sposób, tylko z innymi typami - zamiast ciągu znaków blob, nagłówek będzie rozpoczynał się od commit lub tree. Choć obiekt blob może zawierać praktycznie dowolne dane, to jednak obiekty commit i tree są bardzo specyficznie sformatowane.

<!-- That’s it — you’ve created a valid Git blob object. All Git objects are stored the same way, just with different types — instead of the string blob, the header will begin with commit or tree. Also, although the blob content can be nearly anything, the commit and tree content are very specifically formatted. -->
