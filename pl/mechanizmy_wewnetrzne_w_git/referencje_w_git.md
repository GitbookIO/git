# Referencje w Git

<!-- # Git References -->

Za pomocą komendy `git log 1a410e` możesz również przejrzeć całą historię swojego projektu, ale musisz wiedzieć, że `1a410e` jest ostatnią zmianą (commitem) aby zobaczyć wszystkie modyfikacje. Potrzebujesz pliku w którym będziesz mógł zapisywać wartość SHA-1 pod łatwiejszą nazwą, tak abyś mógł jej używać zamiast sumy SHA-1. 

<!-- You can run something like `git log 1a410e` to look through your whole history, but you still have to remember that `1a410e` is the last commit in order to walk that history to find all those objects. You need a file in which you can store the SHA-1 value under a simple name so you can use that pointer rather than the raw SHA-1 value. -->

W Gitcie nazywane są one "referencjami" lub krócej "refs"; możesz znaleźć pliki zawierające wartość SHA-1 w katalogu `.git/refs`. W obecnym projekcie ten katalog nie zawiera żadnych plików, a jego struktura wygląda tak:

<!-- In Git, these are called "references" or "refs"; you can find the files that contain the SHA-1 values in the `.git/refs` directory. In the current project, this directory contains no files, but it does contain a simple structure: -->

    $ find .git/refs
    .git/refs
    .git/refs/heads
    .git/refs/tags
    $ find .git/refs -type f
    $

Aby stworzyć nową referencję, która pomocna będzie przy zapamiętywaniu który commit jest ostatni, możesz wykonać tę prostą komendę: 

<!-- To create a new reference that will help you remember where your latest commit is, you can technically do something as simple as this: -->

    $ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

Teraz, możesz używać referencji którą właśnie stworzyłeś zamiast sumy SHA-1 w komendach Gita:

<!-- Now, you can use the head reference you just created instead of the SHA-1 value in your Git commands: -->

    $ git log --pretty=oneline  master
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Nie musisz bezpośrednio zmieniać plików referencji. Git udostępnia bezpieczniejsze narzędzie do tego, gdy chcesz zaktualizować referencje wywołaj `update-ref`:

<!-- You aren’t encouraged to directly edit the reference files. Git provides a safer command to do this if you want to update a reference called `update-ref`: -->

    $ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

Praktycznie tym samym są gałęzie w Git: proste wskazanie lub referencja na najnowszą wprowadzoną zmianę. Aby stworzyć gałąź z poprzedniego commita, wykonaj to:

<!-- That’s basically what a branch in Git is: a simple pointer or reference to the head of a line of work. To create a branch back at the second commit, you can do this: -->

    $ git update-ref refs/heads/test cac0ca

Twoja gałąź będzie zawierała tylko zmiany starsze niż podany commit:

<!-- Your branch will contain only work from that commit down: -->

    $ git log --pretty=oneline test
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

W tej chwili, Twoja baza w Git wygląda podobnie do tej z rysunka 9-4.

<!-- Now, your Git database conceptually looks something like Figure 9-4. -->


![](http://git-scm.com/figures/18333fig0904-tn.png)

Figure 9-4. Obiekty w katalogach Git z uwzględnieniem referencji do gałęzi.

<!-- Figure 9-4. Git directory objects with branch head references included. -->

Gdy uruchamiasz komendę taką jak `git branch (nazwagałęzi)`, Git po prostu uruchamia komendę `update-ref`, w celu dodania sumy SHA-1 ostatniego commita w gałęzi na której się obecnie znajdujesz, do referencji którą chcesz stworzyć. 

<!-- When you run commands like `git branch (branchname)`, Git basically runs that `update-ref` command to add the SHA-1 of the last commit of the branch you’re on into whatever new reference you want to create. -->

## HEAD

<!-- ## The HEAD -->

Powstaje pytanie, po uruchomieniu `git branch (nazwagałęzi)`, skąd Git wie jaka jest suma SHA-1 ostatniego commita? Odpowiedź to plik HEAD. W tym pliku znajduje się symboliczne dowiązanie do gałęzi w której się obecnie znajdujesz. Poprzez symboliczne dowiązanie, mam na myśli to, że inaczej niż w przypadku normalnego dowiązania, nie zawiera ono sumy SHA-1, ale wskaźnik na inną referencję. Jak zobaczysz na zawartość tego pliku, zazwyczaj zobaczysz coś w stylu:

<!-- The question now is, when you run `git branch (branchname)`, how does Git know the SHA-1 of the last commit? The answer is the HEAD file. The HEAD file is a symbolic reference to the branch you’re currently on. By symbolic reference, I mean that unlike a normal reference, it doesn’t generally contain a SHA-1 value but rather a pointer to another reference. If you look at the file, you’ll normally see something like this: -->

    $ cat .git/HEAD
    ref: refs/heads/master

Po uruchomieniu `git checkout test`, Git zaktualizuje ten plik, aby zawierał:

<!-- If you run `git checkout test`, Git updates the file to look like this: -->

    $ cat .git/HEAD
    ref: refs/heads/test

Gdy uruchomisz `git commit`, zostanie stworzony obiekt commit, określając rodzica tego obiektu na podstawie wartość SHA-1 na którą wskazuje HEAD.

<!-- When you run `git commit`, it creates the commit object, specifying the parent of that commit object to be whatever SHA-1 value the reference in HEAD points to. -->

Możesz również ręcznie zmodyfikować ten plik, ale bezpieczniej będzie użyć komendy `symbilic-ref`. Możesz odczytać wartość która jest w HEAD przy jej pomocy:

<!-- You can also manually edit this file, but again a safer command exists to do so: `symbolic-ref`. You can read the value of your HEAD via this command: -->

    $ git symbolic-ref HEAD
    refs/heads/master

Możesz również ustawić nową wartość HEAD:

<!-- You can also set the value of HEAD: -->

    $ git symbolic-ref HEAD refs/heads/test
    $ cat .git/HEAD
    ref: refs/heads/test

Nie możesz jednak wstawić symbolicznego dowiązania które jest poza katalogiem refs:

<!-- You can’t set a symbolic reference outside of the refs style: -->

    $ git symbolic-ref HEAD test
    fatal: Refusing to point HEAD outside of refs/

## Tagi

<!-- ## Tags -->

Poznałeś już trzy główne obiekty Gita, ale istnieje jeszcze czwarty. Obiekt tag, jest bardzo podobny do obiektu commit - zawiera informacje o osobie, dacie, treści komentarza i wskaźnik. Główną różnicą jest to, że obiekt tag wskazuje na commit, a nie na obiekt tree. Jest podobny do referencji gałęzi, ale nigdy się nie zmienia - zawsze wskazuje na ten sam commit, ale z łatwiejszą nazwą.

<!-- You’ve just gone over Git’s three main object types, but there is a fourth. The tag object is very much like a commit object — it contains a tagger, a date, a message, and a pointer. The main difference is that a tag object points to a commit rather than a tree. It’s like a branch reference, but it never moves — it always points to the same commit but gives it a friendlier name. -->

Jak opisałem w rozdziale 2, istnieją dwa typy tagów: opisanych i lekkich. Możesz stworzyć lekką etykietę poprzez uruchomienie:

<!-- As discussed in Chapter 2, there are two types of tags: annotated and lightweight. You can make a lightweight tag by running something like this: -->

    $ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

Właśnie tym jest lekka etykieta - gałęzią która nigdy się nie zmienia. Opisana etykieta jest jednak bardziej skomplikowana. Gdy tworzysz opisaną etykietę, Git stworzy obiekt tag, a następnie zapisze referencję wskazująca na niego, zamiast na obiekt commit. Możesz to zauważyć, po stworzeniu opisanej etykiety (`-a` wskazuje że będzie to opisana etykieta):

<!-- That is all a lightweight tag is — a branch that never moves. An annotated tag is more complex, however. If you create an annotated tag, Git creates a tag object and then writes a reference to point to it rather than directly to the commit. You can see this by creating an annotated tag (`-a` specifies that it’s an annotated tag): -->

    $ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 -m 'test tag'

Stworzona została następująca wartość SHA-1:

<!-- Here’s the object SHA-1 value it created: -->

    $ cat .git/refs/tags/v1.1
    9585191f37f7b0fb9444f35a9bf50de191beadc2

Teraz, uruchom komendę `cat-file` na tej wartość SHA-1:

<!-- Now, run the `cat-file` command on that SHA-1 value: -->

    $ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
    object 1a410efbd13591db07496601ebc7a059dd55cfe9
    type commit
    tag v1.1
    tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

    test tag

Zauważ, że wpis rozpoczynający się od "object" wskazuje na sumą SHA-1 commitu który zatagowałeś. Zauważ również, że nie musi on wskazywać na commit; możesz stworzyć etykietę dla każdego obiektu w Git. Na przykład, w kodzie źródłowym Gita, opiekun projektu zamieścił publiczny klucz GPG, jako obiekt blob i następnie go otagował. Możesz zobaczyć zawartość tego klucz, po wykonaniu

<!-- Notice that the object entry points to the commit SHA-1 value that you tagged. Also notice that it doesn’t need to point to a commit; you can tag any Git object. In the Git source code, for example, the maintainer has added their GPG public key as a blob object and then tagged it. You can view the public key by running -->

    $ git cat-file blob junio-gpg-pub

w kodzie źródłowym Gita. Repozytorium ze źródłami projektu Linux ma również taki tag - pierwszy tag stworzony z początkowego stanu kodu źródłowego.

<!-- in the Git source code repository. The Linux kernel repository also has a non-commit-pointing tag object — the first tag created points to the initial tree of the import of the source code. -->

## Zdalne repozytoria

<!-- ## Remotes -->

Trzecim typem referencji który poznasz, są referencje zdalne. Jeżeli dodasz zdalne repozytorium i wypchniesz do niego kod, Git przechowa wartość którą ostatnio wypchnąłeś do niego, dla każdej gałęzi w katalogu `refs/remotes`. Na przykład, możesz dodać zdalne repozytorium o nazwie `origin` i wypchnąć gałąź `master` do niego:

<!-- The third type of reference that you’ll see is a remote reference. If you add a remote and push to it, Git stores the value you last pushed to that remote for each branch in the `refs/remotes` directory. For instance, you can add a remote called `origin` and push your `master` branch to it: -->

    $ git remote add origin git@github.com:schacon/simplegit-progit.git
    $ git push origin master
    Counting objects: 11, done.
    Compressing objects: 100% (5/5), done.
    Writing objects: 100% (7/7), 716 bytes, done.
    Total 7 (delta 2), reused 4 (delta 1)
    To git@github.com:schacon/simplegit-progit.git
       a11bef0..ca82a6d  master -> master

Następnie możesz zobaczyć w którym miejscu była gałąź `master` na zdalnym repozytorium `origin` w czasie gdy wysyłałeś zmiany, przez sprawdzenie pliku `refs/remotes/origin/master`:

<!-- Then, you can see what the `master` branch on the `origin` remote was the last time you communicated with the server, by checking the `refs/remotes/origin/master` file: -->

    $ cat .git/refs/remotes/origin/master
    ca82a6dff817ec66f44342007202690a93763949

Zdalne referencje różnią się od gałęzi (referencji w `refs/heads`) głównie tym, że nie mogą być pobrane (przez komendę "checkout"). Git zapisuje jest rodzaj zakładek wskazujących na ostatni znany stan w którym te gałęzi były na serwerze.

<!-- Remote references differ from branches (`refs/heads` references) mainly in that they can’t be checked out. Git moves them around as bookmarks to the last known state of where those branches were on those servers. -->


