# Komendy Plumbing i Porcelain

<!-- # Plumbing and Porcelain -->

Ta książka opisuje jak używać Gita przy użyciu około 30 komend, takich jak `checkout`, `branch`, `remote` itd. Ale ponieważ Git był początkowo tylko zestawem narzędzi do obsługi VCS, a nie pełnoprawnym systemem VCS, ma garść komend które wykonują niskopoziomowe czynności i zostały zaprojektowane do łączenia ich w łańcuchy komend w stylu UNIX lub wywoływania z skryptów. Te komendy generalnie nazywane są komendami "plumbing", a te bardziej przyjazne dla użytkownika to komendy "porcelain".

<!-- This book covers how to use Git with 30 or so verbs such as `checkout`, `branch`, `remote`, and so on. But because Git was initially a toolkit for a VCS rather than a full user-friendly VCS, it has a bunch of verbs that do low-level work and were designed to be chained together UNIX style or called from scripts. These commands are generally referred to as "plumbing" commands, and the more user-friendly commands are called "porcelain" commands. -->

Pierwsze osiem rozdziałów książki opisywało praktycznie wyłącznie komendy "porcelain". Ale w tym rozdziale, będziesz używał głównie komend niskopoziomowych "plumbing", ponieważ daje one dostęp do wewnętrznych mechanizmów Gita i pomagają pokazać jak i dlaczego Git robi to co robi. Te komendy nie zostały stworzone do ręcznego uruchamiania z linii komend, ale raczej aby mogły być użyte do budowania nowych narzędzi lub niestandardowych skryptów.

<!-- The book’s first eight chapters deal almost exclusively with porcelain commands. But in this chapter, you’ll be dealing mostly with the lower-level plumbing commands, because they give you access to the inner workings of Git and help demonstrate how and why Git does what it does. These commands aren’t meant to be used manually on the command line, but rather to be used as building blocks for new tools and custom scripts. -->

Kiedy uruchomisz `git init` w nowym lub istniejącym katalogu, Git stworzy katalog `.git`, w którym praktycznie wszystko czego używa Git jest umieszczone. Kiedy chcesz wykonać kopię zapasową lub sklonować repozytorium, skopiowanie tylko tego katalogu da Ci praktycznie wszystko czego potrzebujesz. Praktycznie cały ten rozdział dotyczy rzeczy które są umieszczone w tym katalogu. Wygląda on tak:

<!-- When you run `git init` in a new or existing directory, Git creates the `.git` directory, which is where almost everything that Git stores and manipulates is located. If you want to back up or clone your repository, copying this single directory elsewhere gives you nearly everything you need. This entire chapter basically deals with the stuff in this directory. Here’s what it looks like: -->

    $ ls
    HEAD
    branches/
    config
    description
    hooks/
    index
    info/
    objects/
    refs/

Możesz zobaczyć tam inne pliki, ale jest to nowy katalog zainicjowany przez `git init` - standardowo właśnie to widzisz. Katalog `branches` nie jest używany przez nowsze wersje Gita, a plik `description` jest używany tylko przez program GitWeb, więc nie zwracaj na nie uwagi na razie. Plik `config` zawiera ustawienia konfiguracyjne dotyczące danego projektu, a katalog `info` przechowuje globalny plik wykluczeń, który przechowuje ignorowane wzorce których nie chcesz mieć w pliku .gitignore. Katalog `hooks` zawiera komendy uruchamiane po stronie klienta lub serwera, które były omawiane w rozdziale 7.

<!-- You may see some other files in there, but this is a fresh `git init` repository — it’s what you see by default. The `branches` directory isn’t used by newer Git versions, and the `description` file is only used by the GitWeb program, so don’t worry about those. The `config` file contains your project-specific configuration options, and the `info` directory keeps a global exclude file for ignored patterns that you don’t want to track in a .gitignore file. The `hooks` directory contains your client- or server-side hook scripts, which are discussed in detail in Chapter 7. -->

Pozostały bardzo istotne wpisy: pliki `HEAD` i `index`, oraz katalogi `objects` i `refs`. Są one podstawowymi częściami Gita. Katalog `objects` przechowuje całą zawartość bazy danych, katalog `refs` przechowuje wskaźniki do obiektów commitów w danych (branches), plik `HEAD` wskazuje gałąź na której się znajdujesz, a plik `index` jest miejscem w którym przechowywane są informacje na temat przechowalni. W kolejnych częściach tego rozdziału dokładnie zobaczysz jak Git funkcjonuje.

<!-- This leaves four important entries: the `HEAD` and `index` files and the `objects` and `refs` directories. These are the core parts of Git. The `objects` directory stores all the content for your database, the `refs` directory stores pointers into commit objects in that data (branches), the `HEAD` file points to the branch you currently have checked out, and the `index` file is where Git stores your staging area information. You’ll now look at each of these sections in detail to see how Git operates. -->

