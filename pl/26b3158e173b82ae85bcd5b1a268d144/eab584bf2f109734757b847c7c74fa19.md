# Refspec

<!-- # The Refspec -->

W trakcie czytania tej książki, używałeś prostych mapowań ze zdalnych gałęzi do lokalnych referencji; jednak mogą one być znaczniej bardziej złożone.
Załóżmy, że dodajesz zdalne repozytorium w taki sposób:

<!-- Throughout this book, you’ve used simple mappings from remote branches to local references; but they can be more complex.
Suppose you add a remote like this: -->

    $ git remote add origin git@github.com:schacon/simplegit-progit.git

Doda to kolejną sekcję w pliku `.git/config`, określającą nazwę zdalnego repozytorium (`origin`), adres URL tego repozytorium, oraz refspec do pobierania:

<!-- It adds a section to your `.git/config` file, specifying the name of the remote (`origin`), the URL of the remote repository, and the refspec for fetching: -->

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/*:refs/remotes/origin/*

Refspec składa się z opcjonalnego znaku `+`, oraz wskazania ścieżki źródłowej i docelowej `<src>:<dst>`, gdzie `<src>` wskazuje referencję na zewnętrznym serwerze, a `<dst>` jest miejscem, w którym te referencje będą zapisywane lokalnie. Znak `+` wskazuje Gitowi, aby wykonywał aktualizację nawet wtedy, gdy ta referencja nie jest zwykłym przesunięciem (ang. fast-forward).

<!-- The format of the refspec is an optional `+`, followed by `<src>:<dst>`, where `<src>` is the pattern for references on the remote side and `<dst>` is where those references will be written locally. The `+` tells Git to update the reference even if it isn’t a fast-forward. -->

W zwyczajnym przypadku, jest to zapisywane automatycznie przez komendę `git remote add`, Git pobiera wszystkie referencje z `refs/heads/` na serwerze i zapisuje je do `refs/remotes/origin/` lokalnie. Więc, jeżeli istnieje gałąź `master` na serwerze, możesz uzyskać dostęp do logów tej gałęzi poprzez

<!-- In the default case that is automatically written by a `git remote add` command, Git fetches all the references under `refs/heads/` on the server and writes them to `refs/remotes/origin/` locally. So, if there is a `master` branch on the server, you can access the log of that branch locally via -->

    $ git log origin/master
    $ git log remotes/origin/master
    $ git log refs/remotes/origin/master

Wszystkie te komendy są równoważne, ponieważ Git rozwinie je wszystkie do `refs/remotes/origin/master`.

<!-- They’re all equivalent, because Git expands each of them to `refs/remotes/origin/master`. -->

Jeżeli chciałbyś, aby Git pobierał za każdym razem tylko gałąź `master`, a nie wszystkie inne gałęzie na zdalnym serwerze, możesz zmienić linię fetch na

<!-- If you want Git instead to pull down only the `master` branch each time, and not every other branch on the remote server, you can change the fetch line to -->

    fetch = +refs/heads/master:refs/remotes/origin/master

Jest to po prostu domyślna definicja refspec używana przez komendę `git fetch` podczas pobierania danych ze zdalnego repozytorium. Jeżeli chcesz wykonać coś jednorazowo, możesz podać definicję refspec również z linii komend. Aby pobrać gałąź `master` z zdalnego serwera, do `origin/mymaster` możesz uruchomić

<!-- This is just the default refspec for `git fetch` for that remote. If you want to do something one time, you can specify the refspec on the command line, too. To pull the `master` branch on the remote down to `origin/mymaster` locally, you can run -->

    $ git fetch origin master:refs/remotes/origin/mymaster

Możesz również ustawić kilka refspec. Z linii komend, możesz pobrać kilka gałęzi za pomocą:

<!-- You can also specify multiple refspecs. On the command line, you can pull down several branches like so: -->

    $ git fetch origin master:refs/remotes/origin/mymaster \
       topic:refs/remotes/origin/topic
    From git@github.com:schacon/simplegit
     ! [rejected]        master     -> origin/mymaster  (non fast forward)
     * [new branch]      topic      -> origin/topic

W tym wypadku, pobieranie gałęzi master zostało odrzucone, ponieważ nie była to gałąź fast-forward (tzn. nie było możliwe wykonanie prostego przesunięcia w celu włączenia zmian). Możesz to zmienić, poprzez ustawienie znaku `+` na początku definicji refspec.

<!-- In this case, the  master branch pull was rejected because it wasn’t a fast-forward reference. You can override that by specifying the `+` in front of the refspec. -->

Możesz również ustawić wiele definicji refspec w pliku konfiguracyjnym. Jeżeli zawsze chcesz pobierać gałęzie master i experiment, dodaj dwie linie:

<!-- You can also specify multiple refspecs for fetching in your configuration file. If you want to always fetch the master and experiment branches, add two lines: -->

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/master:refs/remotes/origin/master
           fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Nie możesz użyć masek na ścieżkach, więc takie ustawienie będzie błędne:

<!-- You can’t use partial globs in the pattern, so this would be invalid: -->

    fetch = +refs/heads/qa*:refs/remotes/origin/qa*

Możesz jednak użyć przestrzeni nazw aby osiągnąć podobny efekt. Jeżeli masz zespół QA, który wypycha nowe gałęzie, a Ty chcesz pobrać tylko gałąź master oraz wszystkie gałęzie stworzone przez zespół QA, możesz wpisać w pliku konfiguracyjnym coś takiego:

<!-- However, you can use namespacing to accomplish something like that. If you have a QA team that pushes a series of branches, and you want to get the master branch and any of the QA team’s branches but nothing else, you can use a config section like this: -->

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/master:refs/remotes/origin/master
           fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

Jeżeli masz bardziej złożony sposób współpracy, w którym zespół QA wypycha gałęzie, programiści wypychają gałęzie, oraz zespół integrujący również wypycha oraz współpracuje ze zdalnymi gałęziami, możesz stworzyć dla każdego z nich przestrzenie nazw w ten sposób. 

<!-- If you have a complex workflow process that has a QA team pushing branches, developers pushing branches, and integration teams pushing and collaborating on remote branches, you can namespace them easily this way. -->

## Wypychanie Refspecs

<!-- ## Pushing Refspecs -->

Fajnie, że w tym sposobem możesz pobrać referencje z konkretnych referencji, ale w jaki sposób zespół QA ma wstawiać swoje gałęzie do przestrzeni `qa/` w pierwszej kolejności? Możesz to osiągnąć, poprzez użycie refspec dla komendy push.

<!-- It’s nice that you can fetch namespaced references that way, but how does the QA team get their branches into a `qa/` namespace in the first place? You accomplish that by using refspecs to push. -->

Jeżeli zespół QA chce wypychać swoją gałąź `master` do `qa/master` na zdalnym serwerze, mogą oni uruchomić

<!-- If the QA team wants to push their `master` branch to `qa/master` on the remote server, they can run -->

    $ git push origin master:refs/heads/qa/master

Jeżeli zechcą, aby Git robił to automatycznie za każdym razem po uruchomieniu `git push origin`, mogą dodać definicję `push` do swojego pliku konfiguracyjnego:

<!-- If they want Git to do that automatically each time they run `git push origin`, they can add a `push` value to their config file: -->

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/*:refs/remotes/origin/*
           push = refs/heads/master:refs/heads/qa/master

I znowu, to spowoduje, że komenda `git push origin` będzie domyślnie wypychała lokalną gałąź `master` do zdalnej `qa/master`.

<!-- Again, this will cause a `git push origin` to push the local `master` branch to the remote `qa/master` branch by default. -->

## Usuwanie referencji

<!-- ## Deleting References -->

Możesz również używać definicji refspec do usuwania referencji ze zdalnego serwera, poprzez uruchomienie komendy podobnej do:

<!-- You can also use the refspec to delete references from the remote server by running something like this: -->

    $ git push origin :topic

Ponieważ refspec składa się z `<src>:<dst>`, przez opuszczenie części `<src>`, wskazujesz aby stworzyć nową pustą gałąź tematyczną, co ją kasuje.

<!-- Because the refspec is `<src>:<dst>`, by leaving off the `<src>` part, this basically says to make the topic branch on the remote nothing, which deletes it. -->
