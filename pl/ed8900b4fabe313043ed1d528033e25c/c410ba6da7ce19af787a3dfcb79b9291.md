# Wgrywanie zmian do projektu

Znasz już różne sposoby pracy, oraz powinieneś posiadać solidne podstawy używania Gita. W tej sekcji, nauczysz się kilku najczęstszych sposobów aby uczestniczyć w projekcie.

<!-- You know what the different workflows are, and you should have a pretty good grasp of fundamental Git usage. In this section, you’ll learn about a few common patterns for contributing to a project. -->

Główną trudnością podczas opisywania tego procesu, jest bardzo duża różnorodność sposobów w jaki jest to realizowane. Ponieważ Git jest bardzo elastycznym narzędziem, ludzie mogą i współpracują ze sobą na różne sposoby, dlatego też trudne jest pokazanie w jaki sposób Ty powinieneś  - każdy projekt jest inny. Niektóre ze zmiennych które warto wziąć pod uwagę to ilość aktywnych współpracowników, wybrany sposób przepływów pracy, uprawnienia, oraz prawdopodobnie sposób współpracy z zewnętrznymi programistami.

<!-- The main difficulty with describing this process is that there are a huge number of variations on how it’s done. Because Git is very flexible, people can and do work together many ways, and it’s problematic to describe how you should contribute to a project — every project is a bit different. Some of the variables involved are active contributor size, chosen workflow, your commit access, and possibly the external contribution method. -->

Pierwszą zmienną jest ilość aktywnych współpracowników. Ilu aktywnych współpracowników/programistów aktywnie wgrywa zmiany do projektu, oraz jak często? Najczęściej będzie to sytuacja, w której uczestniczy dwóch lub trzech programistów, wgrywających kilka razy na dzień zmiany (lub nawet mniej, przy projektach nie rozwijanych aktywnie). Dla bardzo dużych firm lub projektów, ilość programistów może wynieść nawet tysiące, z dziesiątkami lub nawet setkami zmian wgrywanych każdego dnia. Jest to bardzo ważne, ponieważ przy zwiększającej się liczbie programistów, wypływa coraz więcej problemów podczas włączania efektów ich prac. Zmiany które próbujesz wgrać, mogą stać się nieużyteczne, lub niepotrzebne ze względu na zmiany innych osób z zespołu. Tylko w jaki sposób zachować spójność kodu i poprawność wszystkich przygotowanych łatek?

<!-- The first variable is active contributor size. How many users are actively contributing code to this project, and how often? In many instances, you’ll have two or three developers with a few commits a day, or possibly less for somewhat dormant projects. For really large companies or projects, the number of developers could be in the thousands, with dozens or even hundreds of patches coming in each day. This is important because with more and more developers, you run into more issues with making sure your code applies cleanly or can be easily merged. Changes you submit may be rendered obsolete or severely broken by work that is merged in while you were working or while your changes were waiting to be approved or applied. How can you keep your code consistently up to date and your patches valid? -->

Następną zmienną jest sposób przepływu pracy w projekcie. Czy jest scentralizowany, w którym każdy programista ma równy dostęp do wgrywania kodu? Czy projekt posiada głównego opiekuna, lub osobę integrującą, która sprawdza wszystkie łatki? Czy wszystkie łatki są wzajemnie zatwierdzane? Czy uczestniczysz w tym procesie? Czy funkcjonuje porucznik, do którego musisz najpierw przekazać swoje zmiany?

<!-- The next variable is the workflow in use for the project. Is it centralized, with each developer having equal write access to the main codeline? Does the project have a maintainer or integration manager who checks all the patches? Are all the patches peer-reviewed and approved? Are you involved in that process? Is a lieutenant system in place, and do you have to submit your work to them first? -->

Następnym elementem są uprawnienia do repozytorium. Sposób pracy z repozytorium do którego możesz wgrywać zmiany bezpośrednio, jest zupełnie inny, od tego w którym masz dostęp tylko do odczytu. Jeżeli nie masz uprawnień do zapisu, w jaki sposób w projekcie akceptowane są zmiany? Czy ma on określoną politykę? Jak duże zmiany wgrywasz za jednym razem? Jak często je wgrywasz?

<!-- The next issue is your commit access. The workflow required in order to contribute to a project is much different if you have write access to the project than if you don’t. If you don’t have write access, how does the project prefer to accept contributed work? Does it even have a policy? How much work are you contributing at a time? How often do you contribute? -->

Odpowiedzi na wszystkie te pytania, mogą wpływać na to w jaki sposób będziesz wgrywał zmiany do repozytorium, oraz jaki rodzaj przepływu pracy jest najlepszy lub nawet dostępny dla Ciebie. Omówię aspekty każdej z nich w serii przypadków użycia, przechodząc od prostych do bardziej złożonych, powinieneś móc skonstruować konkretny przepływ pracy który możesz zastosować w praktyce z tych przykładów.

<!-- All these questions can affect how you contribute effectively to a project and what workflows are preferred or available to you. I’ll cover aspects of each of these in a series of use cases, moving from simple to more complex; you should be able to construct the specific workflows you need in practice from these examples. -->

## Wskazówki wgrywania zmian

Zanim spojrzysz na poszczególne przypadki użycia, najpierw szybka informacja o treści komentarzy do zmian ("commit messages"). Dobre wytyczne do tworzenia commitów, oraz związanych z nią treścią komentarzy pozwala na łatwiejszą pracę z Gitem oraz innymi współpracownikami. Projekt Git dostarcza dokumentację która pokazuje kilka dobrych rad dotyczących tworzenia commit-ów i łat - możesz ją znaleźć w kodzie źródłowym Gita w pliku `Documentation/SubmittingPatches`.

<!-- Before you start looking at the specific use cases, here’s a quick note about commit messages. Having a good guideline for creating commits and sticking to it makes working with Git and collaborating with others a lot easier. The Git project provides a document that lays out a number of good tips for creating commits from which to submit patches — you can read it in the Git source code in the `Documentation/SubmittingPatches` file. -->

Po pierwsze, nie chcesz wgrywać żadnych błędów związanych z poprawkami pustych znaków (np. spacji). Git dostarcza łatwy sposób do tego - zanim wgrasz zmiany, uruchom `git diff --check`, komenda ta pokaże możliwe nadmiarowe spacje. Poniżej mamy przykład takiej sytuacji, zamieniłem kolor czerwony na terminalu znakami `X`:

<!-- First, you don’t want to submit any whitespace errors. Git provides an easy way to check for this — before you commit, run `git diff -\-check`, which identifies possible whitespace errors and lists them for you. Here is an example, where I’ve replaced a red terminal color with `X`s: -->

    $ git diff --check
    lib/simplegit.rb:5: trailing whitespace.
    +    @git_dir = File.expand_path(git_dir)XX
    lib/simplegit.rb:7: trailing whitespace.
    + XXXXXXXXXXX
    lib/simplegit.rb:26: trailing whitespace.
    +    def command(git_cmd)XXXX


Jeżeli uruchomisz tę komendę przed commit-em, dowiesz się czy zamierzasz wgrać zmiany które mogą zdenerwować innych programistów.

<!-- If you run that command before committing, you can tell if you’re about to commit whitespace issues that may annoy other developers. -->

Następnie spróbuj w każdym commit-ie zawrzeć logicznie odrębny zestaw zmian. Jeżeli możesz, twórz nie za duże łatki - nie programuj cały weekend poprawiając pięć różnych błędów, aby następnie wszystkie je wypuścić w jednym dużym commit-cie w poniedziałek. Nawet jeżeli nie zatwierdzasz zmian w ciągu weekendu, użyj przechowalni ("stage"), aby w poniedziałek rozdzielić zmiany na przynajmniej jeden commit dla każdego błędu, dodając użyteczny komentarz do każdego commitu. Jeżeli niektóre ze zmian modyfikują ten sam plik, spróbuj użyć komendy `git add --patch`, aby częściowo dodać zmiany do przechowalni (dokładniej opisane to jest w rozdziale 6). Końcowa migawka projektu w gałęzi jest identyczna, nieważne czy zrobisz jeden czy pięć commitów, więc spróbuj ułatwić życie swoim współpracownikom kiedy będą musieli przeglądać Twoje zmiany. Takie podejście ułatwia również pobranie lub przywrócenie pojedynczych zestawów zmian w razie potrzeby. Rozdział 6 opisuje kilka ciekawych trików dotyczących nadpisywania historii zmian i interaktywnego dodawania plików do przechowalni - używaj ich do utrzymania czystej i przejrzystej historii.

<!-- Next, try to make each commit a logically separate changeset. If you can, try to make your changes digestible — don’t code for a whole weekend on five different issues and then submit them all as one massive commit on Monday. Even if you don’t commit during the weekend, use the staging area on Monday to split your work into at least one commit per issue, with a useful message per commit. If some of the changes modify the same file, try to use `git add -\-patch` to partially stage files (covered in detail in Chapter 6). The project snapshot at the tip of the branch is identical whether you do one commit or five, as long as all the changes are added at some point, so try to make things easier on your fellow developers when they have to review your changes. This approach also makes it easier to pull out or revert one of the changesets if you need to later. Chapter 6 describes a number of useful Git tricks for rewriting history and interactively staging files — use these tools to help craft a clean and understandable history. -->

Ostatnią rzeczą na którą należy zwrócić uwagę są komentarze do zmian. Tworzenie dobrych komentarzy pozwala na łatwiejsze używanie i współpracę za pomocą Gita. Generalną zasadą powinno być to, że treść komentarza rozpoczyna się od pojedynczej linii nie dłuższej niż 50 znaków, która zwięźle opisuje zmianę, następnie powinna znaleźć się pusta linia, a poniżej niej szczegółowy opis zmiany. Projekt Git wymaga bardzo dokładnych wyjaśnień motywujących twoją zmianę w stosunku do poprzedniej implementacji - jest to dobra wskazówka do naśladowania. Dobrym pomysłem jest używania czasu teraźniejszego w trybie rozkazującym. Innymi słowy, używaj komend. Zamiast "Dodałem testy dla" lub "Dodawania testów dla", użyj "Dodaj testy do".
Poniżej znajduje się szablon komentarza przygotowany przez Tima Pope z tpope.net:

<!-- The last thing to keep in mind is the commit message. Getting in the habit of creating quality commit messages makes using and collaborating with Git a lot easier. As a general rule, your messages should start with a single line that’s no more than about 50 characters and that describes the changeset concisely, followed by a blank line, followed by a more detailed explanation. The Git project requires that the more detailed explanation include your motivation for the change and contrast its implementation with previous behavior — this is a good guideline to follow. It’s also a good idea to use the imperative present tense in these messages. In other words, use commands. Instead of "I added tests for" or "Adding tests for," use "Add tests for."
Here is a template originally written by Tim Pope at tpope.net: -->

    Krótki (50 znaków lub mniej) opis zmiany

    Bardziej szczegółowy tekst jeżeli jest taka konieczność. Zawijaj
    wiersze po około 72 znakach. Czasami pierwsza linia jest traktowana
    jako temat wiadomości email, a reszta komentarza jako treść. Pusta
    linia oddzielająca opis od streszczenia jest konieczna (chyba że
    ominiesz szczegółowy opis kompletnie); narzędzia takie jak `rebase`
    mogą się pogubić jeżeli nie oddzielisz ich.

    Kolejne paragrafy przychodzą po pustej linii.

     - wypunktowania są poprawne, również

     - zazwyczaj łącznik lub gwiazdka jest używana do punktowania,
       poprzedzona pojedynczym znakiem spacji, z pustą linią pomiędzy,
       jednak zwyczaje mogą się tutaj różnić.


Jeżeli wszystkie Twoje komentarz do zmian będą wyglądały jak ten, współpraca będzie dużo łatwiejsza dla Ciebie i twoich współpracowników. Projekt Git ma poprawnie sformatowane komentarze, uruchom polecenie `git log --no-merges` na tym projekcie, aby zobaczyć jak wygląda ładnie sformatowana i prowadzona historia zmian.

<!-- If all your commit messages look like this, things will be a lot easier for you and the developers you work with. The Git project has well-formatted commit messages — I encourage you to run `git log -\-no-merges` there to see what a nicely formatted project-commit history looks like. -->

W poniższych przykładach, i przez większość tej książki, ze względu na zwięzłość nie sformatowałem treści komentarzy tak ładnie; używam opcji `-m` do `git commit`. Rób tak jak mówię, nie tak jak robię.

<!-- In the following examples, and throughout most of this book, for the sake of brevity I don’t format messages nicely like this; instead, I use the `-m` option to `git commit`. Do as I say, not as I do. -->

## Małe prywatne zespoły

Najprostszym przykładem który możesz spotkać, to prywatne repozytorium z jednym lub dwoma innymi współpracownikami. Jako prywatne, mam na myśli repozytorium z zamkniętym kodem źródłowym - nie dostępnym do odczytu dla innych.Ty i inny deweloperzy mają uprawniania do wgrywania ("push") swoich zmian.

<!-- The simplest setup you’re likely to encounter is a private project with one or two other developers. By private, I mean closed source — not read-accessible to the outside world. You and the other developers all have push access to the repository. -->

W takim środowisku możesz naśladować sposób pracy znany z Subversion czy innego scentralizowanego systemu kontroli wersji. Nadal masz wszystkie zalety takie jak commitowanie bez dostępu do centralnego serwera, oraz prostsze tworzenie gałęzi i łączenie zmian, ale przepływ pracy jest bardzo podobny; główną różnicą jest to, że łączenie zmian wykonywane jest po stronie klienta a nie serwera podczas commitu.
Zobaczmy jak to może wyglądać, w sytuacji w której dwóch programistów rozpocznie prace z współdzielonym repozytorium. Pierwszy programista, John, klonuje repozytorium, wprowadza zmiany i zatwierdza je lokalnie. (Zamieniłem część informacji znakami `...` aby skrócić przykłady.)

<!-- In this environment, you can follow a workflow similar to what you might do when using Subversion or another centralized system. You still get the advantages of things like offline committing and vastly simpler branching and merging, but the workflow can be very similar; the main difference is that merges happen client-side rather than on the server at commit time.
    Let’s see what it might look like when two developers start to work together with a shared repository. The first developer, John, clones the repository, makes a change, and commits locally. (I’m replacing the protocol messages with `...` in these examples to shorten them somewhat.) -->

    # Komputer Johna
    $ git clone john@githost:simplegit.git
    Initialized empty Git repository in /home/john/simplegit/.git/
    ...
    $ cd simplegit/
    $ vim lib/simplegit.rb
    $ git commit -am 'removed invalid default value'
    [master 738ee87] removed invalid default value
     1 files changed, 1 insertions(+), 1 deletions(-)

Drugi programista, Jessica, robi to samo — klonuje repozytorium i commituje zmianę:

    # Komputer Jessici
    $ git clone jessica@githost:simplegit.git
    Initialized empty Git repository in /home/jessica/simplegit/.git/
    ...
    $ cd simplegit/
    $ vim TODO
    $ git commit -am 'add reset task'
    [master fbff5bc] add reset task
     1 files changed, 1 insertions(+), 0 deletions(-)

Następnie, Jessica wypycha swoje zmiany na serwer:

    # Komputer Jessici
    $ git push origin master
    ...
    To jessica@githost:simplegit.git
       1edee6b..fbff5bc  master -> master

John próbuje również wypchnąć swoje zmiany:

    # Komputer Johna
    $ git push origin master
    To john@githost:simplegit.git
     ! [rejected]        master -> master (non-fast forward)
    error: failed to push some refs to 'john@githost:simplegit.git'

John nie może wypchnąć swoich zmian, ponieważ w międzyczasie Jessica wypchnęła swoje. To jest szczególnie ważne do zrozumienia, jeżeli przywykłeś do Subversion, ponieważ zauważysz że każdy z deweloperów zmieniał inne pliki. Chociaż Subversion automatycznie połączy zmiany po stronie serwera jeżeli zmieniane były inne pliki, w Git musisz połączyć zmiany lokalnie. John musi pobrać zmiany Jessici oraz włączyć je do swojego repozytorium zanim będzie wypychał swoje zmiany:

<!-- John isn’t allowed to push because Jessica has pushed in the meantime. This is especially important to understand if you’re used to Subversion, because you’ll notice that the two developers didn’t edit the same file. Although Subversion automatically does such a merge on the server if different files are edited, in Git you must merge the commits locally. John has to fetch Jessica’s changes and merge them in before he will be allowed to push: -->

    $ git fetch origin
    ...
    From john@githost:simplegit
     + 049d078...fbff5bc master     -> origin/master

W tym momencie lokalne repozytorium Johna wygląda podobnie do tego z rys. 5-4.

<!-- At this point, John’s local repository looks something like Figure 5-4. -->


![](http://git-scm.com/figures/18333fig0504-tn.png)

Figure 5-4. Lokalne repozytorium Johna.

John ma już odniesienie do zmian które wypchnęła Jessica, ale musi je lokalnie połączyć ze swoimi zmianami, zanim będzie w stanie wypchnąć je:

<!-- John has a reference to the changes Jessica pushed up, but he has to merge them into his own work before he is allowed to push: -->

    $ git merge origin/master
    Merge made by recursive.
     TODO |    1 +
     1 files changed, 1 insertions(+), 0 deletions(-)

Łączenie zmian poszło bez problemów - historia zmian u Johna wygląda tak jak na rys. 5-5.

<!-- The merge goes smoothly — John’s commit history now looks like Figure 5-5. -->


![](http://git-scm.com/figures/18333fig0505-tn.png)

Figure 5-5. Repozytorium Johna po połączeniu z origin/master.

Teraz, John może przetestować swój kod aby upewnić się że nadal działa poprawnie, oraz następnie wypchnąć swoje zmiany na serwer:

<!-- Now, John can test his code to make sure it still works properly, and then he can push his new merged work up to the server: -->

    $ git push origin master
    ...
    To john@githost:simplegit.git
       fbff5bc..72bbc59  master -> master

Ostatecznie, historia zmian u Johna wygląda tak jak na rys. 5-6.

<!-- Finally, John’s commit history looks like Figure 5-6. -->


![](http://git-scm.com/figures/18333fig0506-tn.png)

Figure 5-6. Historia zmian Johna po wypchnięciu ich na serwer "origin".

<!-- Figure 5-6. John’s history after pushing to the origin server. -->

W tym samym czasie, Jessica pracowała na swojej tematycznej gałęzi. Stworzyła gałąź `issue54` oraz wprowadziła trzy zmiany w niej. Nie pobrała jeszcze zmian Johna, więc jej historia zmian wygląda tak jak na rys. 5-7.

<!-- In the meantime, Jessica has been working on a topic branch. She’s created a topic branch called `issue54` and done three commits on that branch. She hasn’t fetched John’s changes yet, so her commit history looks like Figure 5-7. -->


![](http://git-scm.com/figures/18333fig0507-tn.png)

Figure 5-7. Początkowa historia zmian u Jessici.

Jessica chce zsynchronizować się ze zmianami Johna, więc pobiera ("fetch"):

<!-- Jessica wants to sync up with John, so she fetches: -->

    # Jessica's Machine
    $ git fetch origin
    ...
    From jessica@githost:simplegit
       fbff5bc..72bbc59  master     -> origin/master

Ta komenda pobiera zmiany Johna, które wprowadził w międzyczasie. Historia zmian u Jessici wygląda tak jak na rys. 5-8.

<!-- That pulls down the work John has pushed up in the meantime. Jessica’s history now looks like Figure 5-8. -->


![](http://git-scm.com/figures/18333fig0508-tn.png)

Figure 5-8. Historia zmian u Jessici po pobraniu zmian Johna.

<!-- Figure 5-8. Jessica’s history after fetching John’s changes. -->

Jessica uważa swoje prace w tej gałęzi za zakończone, ale chciałaby wiedzieć jakie zmiany musi włączyć aby mogła wypchnąć swoje. Uruchamia komendę `git log` aby się tego dowiedzieć:

<!-- Jessica thinks her topic branch is ready, but she wants to know what she has to merge her work into so that she can push. She runs `git log` to find out: -->

    $ git log --no-merges origin/master ^issue54
    commit 738ee872852dfaa9d6634e0dea7a324040193016
    Author: John Smith <jsmith@example.com>
    Date:   Fri May 29 16:01:27 2009 -0700

        removed invalid default value

Teraz Jessica może połączyć zmiany ze swojej gałęzi z gałęzią "master", włączyć zmiany Johna (`origin/master`) do swojej gałęzi `master`, oraz następnie wypchnąć zmiany ponownie na serwer.

<!-- Now, Jessica can merge her topic work into her master branch, merge John’s work (`origin/master`) into her `master` branch, and then push back to the server again. First, she switches back to her master branch to integrate all this work: -->

    $ git checkout master
    Switched to branch "master"
    Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

Może ona włączyć `origin/master` lub `issue54` jako pierwszą, obie są nadrzędne więc kolejność nie ma znaczenia. Końcowa wersja plików powinna być identyczna bez względu na kolejność którą wybierze; tylko historia będzie się lekko różniła. Wybiera pierwszą do włączenia gałąź `issue54`:

<!-- She can merge either `origin/master` or `issue54` first — they’re both upstream, so the order doesn’t matter. The end snapshot should be identical no matter which order she chooses; only the history will be slightly different. She chooses to merge in `issue54` first: -->

    $ git merge issue54
    Updating fbff5bc..4af4298
    Fast forward
     README           |    1 +
     lib/simplegit.rb |    6 +++++-
     2 files changed, 6 insertions(+), 1 deletions(-)

Nie było problemów; jak widzisz był to proste połączenie tzw. fast-forward. Teraz Jessica może włączyć zmiany Johna (`origin/master`):

<!-- No problems occur; as you can see, it was a simple fast-forward. Now Jessica merges in John’s work (`origin/master`): -->

    $ git merge origin/master
    Auto-merging lib/simplegit.rb
    Merge made by recursive.
     lib/simplegit.rb |    2 +-
     1 files changed, 1 insertions(+), 1 deletions(-)

Wszystko połączyło się bez problemów, więc historia zmian u Jessici wygląda tak jak na rys. 5-9.

<!-- Everything merges cleanly, and Jessica’s history looks like Figure 5-9. -->


![](http://git-scm.com/figures/18333fig0509-tn.png)

Figure 5-9. Historia zmian u Jessici po włączeniu zmian Johna.

<!-- Figure 5-9. Jessica’s history after merging John’s changes. -->

Teraz `origin/master` jest dostępny z gałęzi `master` u Jessici, więc powinna bez problemów móc wypchnąć swoje zmiany (zakładając że w międzyczasie John nie wypchnął nic):

<!-- Now `origin/master` is reachable from Jessica’s `master` branch, so she should be able to successfully push (assuming John hasn’t pushed again in the meantime): -->

    $ git push origin master
    ...
    To jessica@githost:simplegit.git
       72bbc59..8059c15  master -> master

Każdy programista wprowadził zmiany kilkukrotnie, oraz połączył zmiany drugiego bez problemów; zobacz rys. 5-10.

<!-- Each developer has committed a few times and merged each other’s work successfully; see Figure 5-10. -->


![](http://git-scm.com/figures/18333fig0510-tn.png)

Figure 5-10. Historia zmian u Jessici po wypchnięciu zmian na serwer.

<!-- Figure 5-10. Jessica’s history after pushing all changes back to the server. -->

To jest jeden z najprostszych przepływów pracy. Pracujesz przez chwilę, generalnie na tematycznych gałęziach i włączasz je do gałęzi master kiedy są gotowe. Kiedy chcesz podzielić się swoją pracą, włączasz je do swojej gałęzi master, pobierasz i włączasz zmiany z `origin/master` jeżeli jakieś były, a następnie wypychasz gałąź `master` na serwer. Zazwyczaj sekwencja będzie wyglądała podobnie do tej pokazanej na rys. 5-11.

<!-- That is one of the simplest workflows. You work for a while, generally in a topic branch, and merge into your master branch when it’s ready to be integrated. When you want to share that work, you merge it into your own master branch, then fetch and merge `origin/master` if it has changed, and finally push to the `master` branch on the server. The general sequence is something like that shown in Figure 5-11. -->


![](http://git-scm.com/figures/18333fig0511-tn.png)

Figure 5-11. Sekwencja zdarzeń dla prostego przepływu zmian między programistami.

<!-- Figure 5-11. General sequence of events for a simple multiple-developer Git workflow. -->

## Prywatne zarządzane zespoły

W tym scenariuszu, zobaczysz jak działa współpraca w większych prywatnych grupach. Nauczysz się jak pracować w środowisku w którym małe grupy współpracują ze sobą nad funkcjonalnościami, a następnie stworzone przez nich zmiany są integrowane przez inną osobę.

<!-- In this next scenario, you’ll look at contributor roles in a larger private group. You’ll learn how to work in an environment where small groups collaborate on features and then those team-based contributions are integrated by another party. -->

Załóżmy że John i Jessica wspólnie pracują nad jedną funkcjonalnością, a Jessica i Josie nad drugą. W tej sytuacji, organizacja używa przepływu pracy z osobą integrującą zmiany, w której wyniki pracy poszczególnych grup są integrowane przez wyznaczone osoby, a gałąź `master` może być jedynie przez nie aktualizowana. W tym scenariuszu, cała praca wykonywana jest w osobnych gałęziach zespołów, a następnie zaciągana przez osoby integrujące.

<!-- Let’s say that John and Jessica are working together on one feature, while Jessica and Josie are working on a second. In this case, the company is using a type of integration-manager workflow where the work of the individual groups is integrated only by certain engineers, and the `master` branch of the main repo can be updated only by those engineers. In this scenario, all work is done in team-based branches and pulled together by the integrators later. -->

Prześledźmy sposób pracy Jessici w czasie gdy pracuje ona nad obiema funkcjonalnościami, współpracując jednocześnie z dwoma niezależnymi programistami. Zakładając że ma już sklonowane repozytorium, rozpoczyna pracę nad funkcjonalnością `featureA`. Tworzy nową gałąź dla niej i wprowadza w niej zmiany:

<!-- Let’s follow Jessica’s workflow as she works on her two features, collaborating in parallel with two different developers in this environment. Assuming she already has her repository cloned, she decides to work on `featureA` first. She creates a new branch for the feature and does some work on it there: -->

    # Jessica's Machine
    $ git checkout -b featureA
    Switched to a new branch "featureA"
    $ vim lib/simplegit.rb
    $ git commit -am 'add limit to log function'
    [featureA 3300904] add limit to log function
     1 files changed, 1 insertions(+), 1 deletions(-)

Teraz musi podzielić się swoją pracę z Johnem, więc wypycha zmiany z gałęzi `featureA` na serwer. Jessica nie ma uprawnień do zapisywania w gałęzi `master` - tylko osoby integrujące mają - musi więc wysłać osobną gałąź aby współpracować z Johnem:

<!-- At this point, she needs to share her work with John, so she pushes her `featureA` branch commits up to the server. Jessica doesn’t have push access to the `master` branch — only the integrators do — so she has to push to another branch in order to collaborate with John: -->

    $ git push origin featureA
    ...
    To jessica@githost:simplegit.git
     * [new branch]      featureA -> featureA

Jessica powiadamia Johna przez wiadomość e-mail, że wysłała swoje zmiany w gałęzi `featureA` i on może je zweryfikować. W czasie gdy czeka na informację zwrotną od Johna, Jessica rozpoczyna pracę nad `featureB` z Josie. Na początku, tworzy nową gałąź przeznaczoną dla nowej funkcjonalności, podając jako gałąź źródłową gałąź `master` na serwerze.

<!-- Jessica e-mails John to tell him that she’s pushed some work into a branch named `featureA` and he can look at it now. While she waits for feedback from John, Jessica decides to start working on `featureB` with Josie. To begin, she starts a new feature branch, basing it off the server’s `master` branch: -->

    # Jessica's Machine
    $ git fetch origin
    $ git checkout -b featureB origin/master
    Switched to a new branch "featureB"

Następnie, Jessica wprowadza kilka zmian i zapisuje je w gałęzi `featureB`:

<!-- Now, Jessica makes a couple of commits on the `featureB` branch: -->

    $ vim lib/simplegit.rb
    $ git commit -am 'made the ls-tree function recursive'
    [featureB e5b0fdc] made the ls-tree function recursive
     1 files changed, 1 insertions(+), 1 deletions(-)
    $ vim lib/simplegit.rb
    $ git commit -am 'add ls-files'
    [featureB 8512791] add ls-files
     1 files changed, 5 insertions(+), 0 deletions(-)

Repozytorium Jessici wygląda tak jak na rys. 5-12.

<!-- Jessica’s repository looks like Figure 5-12. -->


![](http://git-scm.com/figures/18333fig0512-tn.png)

Figure 5-12. Początkowa historia zmian u Jessici.

<!-- Figure 5-12. Jessica’s initial commit history. -->

Jest gotowa do wypchnięcia swoich zmian, ale dostaje wiadomość e-mail od Josie, że gałąź z pierwszymi zmianami została już udostępniona na serwerze jako `featureBee`. Jessica najpierw musi połączyć te zmiany ze swoimi, zanim będzie mogła wysłać je na serwer. Może więc pobrać zmiany Jose za pomocą komendy `git fetch`:

<!-- She’s ready to push up her work, but gets an e-mail from Josie that a branch with some initial work on it was already pushed to the server as `featureBee`. Jessica first needs to merge those changes in with her own before she can push to the server. She can then fetch Josie’s changes down with `git fetch`: -->

    $ git fetch origin
    ...
    From jessica@githost:simplegit
     * [new branch]      featureBee -> origin/featureBee


Jessica może teraz połączyć zmiany ze swoimi za pomocą `git merge`:

<!-- Jessica can now merge this into the work she did with `git merge`: -->

    $ git merge origin/featureBee
    Auto-merging lib/simplegit.rb
    Merge made by recursive.
     lib/simplegit.rb |    4 ++++
     1 files changed, 4 insertions(+), 0 deletions(-)

Powstał drobny problem - musi wysłać połączone zmiany ze swojej gałęzi `featureB` do `featureBee` na serwerze. Może to zrobić poprzez wskazanie lokalnej i zdalnej gałęzi oddzielonej dwukropkiem (:), jako parametr do komendy `git push`:

<!-- There is a bit of a problem — she needs to push the merged work in her `featureB` branch to the `featureBee` branch on the server. She can do so by specifying the local branch followed by a colon (:) followed by the remote branch to the `git push` command: -->

    $ git push origin featureB:featureBee
    ...
    To jessica@githost:simplegit.git
       fba9af8..cd685d1  featureB -> featureBee

jest to nazywane _refspec_. Zobacz rozdział 9, aby dowiedzieć się więcej o refspecs i rzeczami które można z nimi zrobić.

<!-- This is called a _refspec_. See Chapter 9 for a more detailed discussion of Git refspecs and different things you can do with them. -->

Następnie John wysyła wiadomość do Jessici z informacją że wgrał swoje zmiany do gałęzi `featureA` i prosi ją o ich weryfikację. Uruchamia więc ona `git fetch` aby je pobrać:

<!-- Next, John e-mails Jessica to say he’s pushed some changes to the `featureA` branch and ask her to verify them. She runs a `git fetch` to pull down those changes: -->

    $ git fetch origin
    ...
    From jessica@githost:simplegit
       3300904..aad881d  featureA   -> origin/featureA

Następnie, może ona zobaczyć co zostało zmienione za pomocą komendy `git log`:

<!-- Then, she can see what has been changed with `git log`: -->

    $ git log origin/featureA ^featureA
    commit aad881d154acdaeb2b6b18ea0e827ed8a6d671e6
    Author: John Smith <jsmith@example.com>
    Date:   Fri May 29 19:57:33 2009 -0700

        changed log output to 30 from 25

Na końcu, integruje ona zmiany Johna ze swoimi znajdującymi się w gałęzi `featureA`:

<!-- Finally, she merges John’s work into her own `featureA` branch: -->

    $ git checkout featureA
    Switched to branch "featureA"
    $ git merge origin/featureA
    Updating 3300904..aad881d
    Fast forward
     lib/simplegit.rb |   10 +++++++++-
    1 files changed, 9 insertions(+), 1 deletions(-)

Jessica postanawia jednak wprowadzić jeszcze jakieś zmiany, więc commituje je ponownie i wysyła je z powrotem na serwer:

<!-- Jessica wants to tweak something, so she commits again and then pushes this back up to the server: -->

    $ git commit -am 'small tweak'
    [featureA 774b3ed] small tweak
     1 files changed, 1 insertions(+), 1 deletions(-)
    $ git push origin featureA
    ...
    To jessica@githost:simplegit.git
       3300904..774b3ed  featureA -> featureA

Historia zmian u Jessici wygląda teraz tak jak na rys. 5-13.

<!-- Jessica’s commit history now looks something like Figure 5-13. -->


![](http://git-scm.com/figures/18333fig0513-tn.png)

Figure 5-13. Historia zmian Jessici po wprowadzeniu zmian w gałęzi.

<!-- Figure 5-13. Jessica’s history after committing on a feature branch. -->

Jessica, Josie i John powiadamiają osoby zajmujące się integracją, że gałęzie `featureA` i `featureBee` na serwerze są gotowe do integracji z głównym kodem. Po włączeniu tych gałęzi do głównej, zostaną pobrane zmiany, tworząc historię zmian podobną do tej na rys. 5-14.

<!-- Jessica, Josie, and John inform the integrators that the `featureA` and `featureBee` branches on the server are ready for integration into the mainline. After they integrate these branches into the mainline, a fetch will bring down the new merge commits, making the commit history look like Figure 5-14. -->


![](http://git-scm.com/figures/18333fig0514-tn.png)

Figure 5-14. Historia zmian u Jessici po włączeniu jej obu gałęzi.

<!-- Figure 5-14. Jessica’s history after merging both her topic branches. -->

Duża ilość grup przechodzi na Gita ze względu na możliwość jednoczesnej współpracy kilku zespołów, oraz możliwości włączania efektów ich prac w późniejszym terminie. Możliwość tworzenie małych grup współpracujących przy pomocy zdalnych gałęzi bez konieczności angażowania pozostałych członków zespołu jest bardzo dużą zaletą Gita. Sekwencja przepływu pracy którą tutaj zobaczyłeś, jest podobna do tej na rys. 5-15.

<!-- Many groups switch to Git because of this ability to have multiple teams working in parallel, merging the different lines of work late in the process. The ability of smaller subgroups of a team to collaborate via remote branches without necessarily having to involve or impede the entire team is a huge benefit of Git. The sequence for the workflow you saw here is something like Figure 5-15. -->


![](http://git-scm.com/figures/18333fig0515-tn.png)

Figure 5-15. Przebieg zdarzeń w takim przepływie.

<!-- Figure 5-15. Basic sequence of this managed-team workflow. -->

## Publiczny mały projekt

Uczestniczenie w publicznym projekcie trochę się różni. Ponieważ nie masz uprawnień do bezpośredniego wgrywania zmian w projekcie, musisz przekazać swoje zmiany do opiekunów w inny sposób. Pierwszy przykład opisuje udział w projekcie poprzez rozwidlenie poprzez serwis który to umożliwia. Obie strony repo.or.cz oraz GitHub umożliwiają takie działanie, a wielu opiekunów projektów oczekuje takiego stylu współpracy. Następny rozdział opisuje współpracę w projektach, które preferują otrzymywanie łat poprzez wiadomość e-mail.

<!-- Contributing to public projects is a bit different. Because you don’t have the permissions to directly update branches on the project, you have to get the work to the maintainers some other way. This first example describes contributing via forking on Git hosts that support easy forking. The repo.or.cz and GitHub hosting sites both support this, and many project maintainers expect this style of contribution. The next section deals with projects that prefer to accept contributed patches via e-mail. -->

Po pierwsze, na początku musisz sklonować główne repozytorium, stworzyć gałąź tematyczną dla zmian które planujesz wprowadzić, oraz zmiany te zrobić. Sekwencja komend wygląda tak:

<!-- First, you’ll probably want to clone the main repository, create a topic branch for the patch or patch series you’re planning to contribute, and do your work there. The sequence looks basically like this: -->

    $ git clone (url)
    $ cd project
    $ git checkout -b featureA
    $ (work)
    $ git commit
    $ (work)
    $ git commit

Możesz chcieć użyć `rebase -i`, aby złączyć swoje zmiany do jednego commita, lub przeorganizować je, tak aby łata była łatwiejsza do opiekuna do przeglądu - zobacz rozdział 6, aby dowiedzieć się więcej o tego typu operacjach.

<!-- You may want to use `rebase -i` to squash your work down to a single commit, or rearrange the work in the commits to make the patch easier for the maintainer to review — see Chapter 6 for more information about interactive rebasing. -->

Kiedy zmiany w Twojej gałęzi zostaną zakończone i jesteś gotowy do przekazania ich do opiekunów projektu, wejdź na stronę projektu i kliknij przycisk "Fork", tworząc w ten sposób swoją własną kopię projektu z uprawnieniami do zapisu. Następnie musisz dodać nowe zdalne repozytorium, w tym przykładzie nazwane `myfork`:

<!-- When your branch work is finished and you’re ready to contribute it back to the maintainers, go to the original project page and click the "Fork" button, creating your own writable fork of the project. You then need to add in this new repository URL as a second remote, in this case named `myfork`: -->

    $ git remote add myfork (url)

Musisz wysłać swoje zmiany do niego. Najprościej będzie wypchnąć lokalną gałąź na której pracujesz do zdalnego repozytorium, zamiast włączać zmiany do gałęzi master i je wysyłać. Warto zrobić tak dlatego, że w sytuacji w której Twoje zmiany nie zostaną zaakceptowane, lub zostaną zaakceptowane tylko w części, nie będziesz musiał cofać swojej gałęzi master. Jeżeli opiekun włączy, zmieni bazę lub pobierze część twoich zmian, będziesz mógł je otrzymać zaciągając je z ich repozytorium:

<!-- You need to push your work up to it. It’s easiest to push the remote branch you’re working on up to your repository, rather than merging into your master branch and pushing that up. The reason is that if the work isn’t accepted or is cherry picked, you don’t have to rewind your master branch. If the maintainers merge, rebase, or cherry-pick your work, you’ll eventually get it back via pulling from their repository anyhow: -->

    $ git push myfork featureA

Kiedy wgrasz wprowadzone zmiany do swojego rozwidlenia projektu, powinieneś powiadomić o tym opiekuna. Jest to często nazywane `pull request`, i możesz je wygenerować poprzez stronę - GitHub ma przycisk "pull request", który automatycznie generuje wiadomość do opiekuna - lub wykonaj komendę `git request-pull` i wyślij jej wynik do opiekuna projektu samodzielnie.

<!-- When your work has been pushed up to your fork, you need to notify the maintainer. This is often called a pull request, and you can either generate it via the website — GitHub has a "pull request" button that automatically messages the maintainer — or run the `git request-pull` command and e-mail the output to the project maintainer manually. -->

Komenda `request-pull` pobiera docelową gałąź do której chcesz wysłać zmiany, oraz adres URL repozytorium Gita z którego chcesz pobrać zmiany, oraz generuje podsumowanie zmian które będziesz wysyłał. Na przykład, jeżeli Jessica chce wysłać do Johna `pull request`, a wykonała dwie zmiany na swojej gałęzi którą właśnie wypchnęła, powinna uruchomić:

<!-- The `request-pull` command takes the base branch into which you want your topic branch pulled and the Git repository URL you want them to pull from, and outputs a summary of all the changes you’re asking to be pulled in. For instance, if Jessica wants to send John a pull request, and she’s done two commits on the topic branch she just pushed up, she can run this: -->

    $ git request-pull origin/master myfork
    The following changes since commit 1edee6b1d61823a2de3b09c160d7080b8d1b3a40:
      John Smith (1):
            added a new function

    are available in the git repository at:

      git://githost/simplegit.git featureA

    Jessica Smith (2):
          add limit to log function
          change log output to 30 from 25

     lib/simplegit.rb |   10 +++++++++-
     1 files changed, 9 insertions(+), 1 deletions(-)


Wynik tej komendy może być wysłany do opiekuna - mówi on z której wersji została stworzona gałąź, podsumowuje zmiany, oraz pokazuje skąd można je pobrać.

<!-- The output can be sent to the maintainer—it tells them where the work was branched from, summarizes the commits, and tells where to pull this work from. -->

W projekcie w którym nie jesteś opiekunem, najprostszym sposobem jest utrzymywanie gałęzi `master` która śledzi `origin/master`, a wprowadzać zmiany w tematycznych gałęziach, które możesz łatwo usunąć jeżeli zostaną odrzucone. Posiadanie oddzielnych gałęzi dla różnych funkcjonalności, ułatwia również tobie zmianę bazy ("rebase") jeżeli główna gałąź zostanie zmieniona i przygotowana łata nie może się poprawnie nałożyć. Na przykład, jeżeli chcesz wysłać drugi zestaw zmian do projektu, nie kontynuuj pracy na gałęzi którą właśnie wypchnąłeś - rozpocznij nową z gałąź `master`:

<!-- On a project for which you’re not the maintainer, it’s generally easier to have a branch like `master` always track `origin/master` and to do your work in topic branches that you can easily discard if they’re rejected.  Having work themes isolated into topic branches also makes it easier for you to rebase your work if the tip of the main repository has moved in the meantime and your commits no longer apply cleanly. For example, if you want to submit a second topic of work to the project, don’t continue working on the topic branch you just pushed up — start over from the main repository’s `master` branch: -->

    $ git checkout -b featureB origin/master
    $ (work)
    $ git commit
    $ git push myfork featureB
    $ (email maintainer)
    $ git fetch origin

Teraz, każdy z zestawów zmian przechowywany jest w formie silosu - podobnego do kolejki z łatami - które możesz nadpisać, zmienić, bez konieczności nachodzenia na siebie, tak jak przedstawiono to na rys. 5-16.

<!-- Now, each of your topics is contained within a silo — similar to a patch queue — that you can rewrite, rebase, and modify without the topics interfering or interdepending on each other as in Figure 5-16. -->


![](http://git-scm.com/figures/18333fig0516-tn.png)

Figure 5-16. Początkowa historia ze zmianami featureB.

<!-- Figure 5-16. Initial commit history with featureB work. -->

Załóżmy, że opiekun projektu pobrał Twoje zmiany i sprawdził twoją pierwszą gałąź, ale niestety nie aplikuje się ona czysto. W takiej sytuacji, możesz spróbować wykonać `rebase` na gałęzi `origin/master`, rozwiązać konflikty i ponownie wysłać zmiany:

<!-- Let’s say the project maintainer has pulled in a bunch of other patches and tried your first branch, but it no longer cleanly merges. In this case, you can try to rebase that branch on top of `origin/master`, resolve the conflicts for the maintainer, and then resubmit your changes: -->

    $ git checkout featureA
    $ git rebase origin/master
    $ git push -f myfork featureA

To przepisuje twoją historię, która wygląda teraz tak jak na rys. 5-17.

<!-- This rewrites your history to now look like Figure 5-17. -->


![](http://git-scm.com/figures/18333fig0517-tn.png)

Figure 5-17. Historia zmian po pracach na featureA.

<!-- Figure 5-17. Commit history after featureA work. -->

Z powodu zmiany bazy ("rebase") na gałęzi, musisz użyć przełącznika `-f` do komendy push, tak abyś mógł nadpisać gałąź `featureA` na serwerze, commitem który nie jest jej potomkiem. Alternatywą może być wysłanie tych zmian do nowej gałęzi na serwerze (np. nazwanej `featureAv2`).

<!-- Because you rebased the branch, you have to specify the `-f` to your push command in order to be able to replace the `featureA` branch on the server with a commit that isn’t a descendant of it. An alternative would be to push this new work to a different branch on the server (perhaps called `featureAv2`). -->

Spójrzmy na jeszcze jeden scenariusz: opiekun spojrzał na zmiany w Twojej drugiej gałęzi i spodobał mu się pomysł, ale chciałby abyś zmienił sposób w jaki je zaimplementowałeś. Wykorzystasz to również do tego, aby przenieść zmiany do obecnej gałęzi `master`. Tworzysz więc nową gałąź bazując na `origin/master`, złączasz zmiany z gałęzi `featureB` tam, rozwiązujesz ewentualne konflikty, wprowadzasz zmiany w implementacji i następnie wypychasz zmiany do nowej gałęzi:

<!-- Let’s look at one more possible scenario: the maintainer has looked at work in your second branch and likes the concept but would like you to change an implementation detail. You’ll also take this opportunity to move the work to be based off the project’s current `master` branch. You start a new branch based off the current `origin/master` branch, squash the `featureB` changes there, resolve any conflicts, make the implementation change, and then push that up as a new branch: -->

    $ git checkout -b featureBv2 origin/master
    $ git merge --no-commit --squash featureB
    $ (change implementation)
    $ git commit
    $ git push myfork featureBv2


Opcja `--squash` pobiera wszystkie zmiany z gałęzi, oraz łączy je w jedną nie włączoną na gałęzi na której obecnie jesteś. Opcja `--no-commit` mówi Git aby nie zapisywał informacji o commit-cie. Pozwala to na zaimportowanie wszystkich zmian z innej gałęzi oraz wprowadzenie nowych przed ostatecznym zatwierdzeniem ich.

<!-- The `-\-squash` option takes all the work on the merged branch and squashes it into one non-merge commit on top of the branch you’re on. The `-\-no-commit` option tells Git not to automatically record a commit. This allows you to introduce all the changes from another branch and then make more changes before recording the new commit. -->

Teraz możesz wysłać do opiekuna wiadomość, że wprowadziłeś wszystkie wymagane zmiany, które może znaleźć w gałęzi `featureBv2` (zob. rys. 5-18).

<!-- Now you can send the maintainer a message that you’ve made the requested changes and they can find those changes in your `featureBv2` branch (see Figure 5-18). -->


![](http://git-scm.com/figures/18333fig0518-tn.png)

Figure 5-18. Historia zmian po zmianach w featureBv2.

<!-- Figure 5-18. Commit history after featureBv2 work. -->

## Duży publiczny projekt

Duża ilość większych projektów ma ustalone reguły dotyczące akceptowania łat - będziesz musiał sprawdzić konkretne zasady dla każdego z projektów, ponieważ będą się różniły. Jednak sporo większych projektów akceptuje łatki poprzez listy dyskusyjne przeznaczone dla programistów, dlatego też opiszę ten przykład teraz.

<!-- Many larger projects have established procedures for accepting patches — you’ll need to check the specific rules for each project, because they will differ. However, many larger public projects accept patches via a developer mailing list, so I’ll go over an example of that now. -->

Przepływ pracy jest podobny do poprzedniego - tworzysz tematyczne gałęzie dla każdej grupy zmian nad którymi pracujesz. Różnica polega na tym, w jaki sposób wysyłasz je do projektu. Zamiast tworzyć rozwidlenie i wypychać do niego zmiany, tworzysz wiadomość e-mail dla każdego zestawu zmian i wysyłasz je na listę dyskusyjną:

<!-- The workflow is similar to the previous use case — you create topic branches for each patch series you work on. The difference is how you submit them to the project. Instead of forking the project and pushing to your own writable version, you generate e-mail versions of each commit series and e-mail them to the developer mailing list: -->

    $ git checkout -b topicA
    $ (work)
    $ git commit
    $ (work)
    $ git commit

Teraz masz dwa commity, które chcesz wysłać na listę dyskusyjną. Uzyj `git format-patch` do wygenerowania plików w formacie mbox, które możesz wysłać na listę - zamieni to każdy commit w osobną wiadomość, z pierwszą linią komentarza ("commit message") jako tematem, jego pozostałą częścią w treści, dołączając jednoczenie zawartość wprowadzanej zmiany. Fajną rzeczą jest to, że aplikowanie łatki przesłanej przez e-mail i wygenerowanej za pomocą `format-patch` zachowuje wszystkie informacje o commit-cie, co zobaczysz w kolejnej sekcji kiedy zaaplikujesz te zmiany:

<!-- Now you have two commits that you want to send to the mailing list. You use `git format-patch` to generate the mbox-formatted files that you can e-mail to the list — it turns each commit into an e-mail message with the first line of the commit message as the subject and the rest of the message plus the patch that the commit introduces as the body. The nice thing about this is that applying a patch from an e-mail generated with `format-patch` preserves all the commit information properly, as you’ll see more of in the next section when you apply these patches: -->

    $ git format-patch -M origin/master
    0001-add-limit-to-log-function.patch
    0002-changed-log-output-to-30-from-25.patch

Komenda `format-patch` wypisuje nazwy plików które stworzyła. Opcja `-M` mówi Git, aby brał pod uwagę również zmiany nazw plików. Zawartość plików w efekcie końcowym wygląda tak:

<!-- The `format-patch` command prints out the names of the patch files it creates. The `-M` switch tells Git to look for renames. The files end up looking like this: -->

    $ cat 0001-add-limit-to-log-function.patch
    From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
    From: Jessica Smith <jessica@example.com>
    Date: Sun, 6 Apr 2008 10:17:23 -0700
    Subject: [PATCH 1/2] add limit to log function

    Limit log functionality to the first 20

    ---
     lib/simplegit.rb |    2 +-
     1 files changed, 1 insertions(+), 1 deletions(-)

    diff --git a/lib/simplegit.rb b/lib/simplegit.rb
    index 76f47bc..f9815f1 100644
    --- a/lib/simplegit.rb
    +++ b/lib/simplegit.rb
    @@ -14,7 +14,7 @@ class SimpleGit
       end

       def log(treeish = 'master')
    -    command("git log #{treeish}")
    +    command("git log -n 20 #{treeish}")
       end

       def ls_tree(treeish = 'master')
    --
    1.6.2.rc1.20.g8c5b.dirty

Możesz oczywiście zmienić te pliki i dodać większą ilość informacji w mailu, których nie chciałeś pokazywać w komentarzu do zmiany. Jeżeli dodasz tekst miedzy linię z `---`, oraz początkiem łaty (linia z `lib/simplegit.rb`), programiści będą mogli to przeczytać; ale podczas nakładania łaty zostanie do pominięte.

<!-- You can also edit these patch files to add more information for the e-mail list that you don’t want to show up in the commit message. If you add text between the `-\-\-` line and the beginning of the patch (the `lib/simplegit.rb` line), then developers can read it; but applying the patch excludes it. -->

Aby wysłać to na listę dyskusyjną, możesz albo wkleić zawartość plików w programie e-mail lub użyć programu uruchamianego z linii komend. Wklejanie tekstu często wprowadza problemy z zachowaniem formatowania, szczególnie przy użyciu tych "mądrzejszych" programów pocztowych, które nie zachowują poprawnie znaków nowej linii i spacji. Na szczęście Git udostępnia narzędzie, które pomoże Ci wysłać poprawnie sformatowane łaty poprzez protokół IMAP, może to być łatwiejsze dla Ciebie. Pokażę w jaki sposób wysyłać łaty przy pomocy Gmaila, którego używam; możesz znaleźć bardziej szczegółowe instrukcje dla różnych programów pocztowych na końcu wcześniej wymienionego pliku `Documentation/SubmittingPatches`, który znajduje się w kodzie źródłowym Gita.

<!-- To e-mail this to a mailing list, you can either paste the file into your e-mail program or send it via a command-line program. Pasting the text often causes formatting issues, especially with "smarter" clients that don’t preserve newlines and other whitespace appropriately. Luckily, Git provides a tool to help you send properly formatted patches via IMAP, which may be easier for you. I’ll demonstrate how to send a patch via Gmail, which happens to be the e-mail agent I use; you can read detailed instructions for a number of mail programs at the end of the aforementioned `Documentation/SubmittingPatches` file in the Git source code. -->

Najpierw musisz ustawić sekcję imap w swoim pliku `~/.gitconfig`. Możesz ustawić każdą wartość oddzielnie przy pomocy kilku komend `git config`, lub możesz je dodać ręcznie; jednak w efekcie twój plik konfiguracyjny powinien wyglądać podobnie do:

<!-- First, you need to set up the imap section in your `~/.gitconfig` file. You can set each value separately with a series of `git config` commands, or you can add them manually; but in the end, your config file should look something like this: -->

    [imap]
      folder = "[Gmail]/Drafts"
      host = imaps://imap.gmail.com
      user = user@gmail.com
      pass = p4ssw0rd
      port = 993
      sslverify = false

Jeżeli twój serwer IMAP nie używa SSL, dwie ostatnie linie prawdopodobnie nie są potrzebne, a wartość host będzie `imap://` zamiast `imaps://`. Po ustawieniu tego, możesz używać komendy `git send-email` aby umieścić łatki w folderze Draft na serwerze IMAP:

<!-- If your IMAP server doesn’t use SSL, the last two lines probably aren’t necessary, and the host value will be `imap://` instead of `imaps://`.
When that is set up, you can use `git send-email` to place the patch series in the Drafts folder of the specified IMAP server: -->

    $ git send-email *.patch
    0001-added-limit-to-log-function.patch
    0002-changed-log-output-to-30-from-25.patch
    Who should the emails appear to be from? [Jessica Smith <jessica@example.com>]
    Emails will be sent from: Jessica Smith <jessica@example.com>
    Who should the emails be sent to? jessica@example.com
    Message-ID to be used as In-Reply-To for the first email? y

Następnie, Git pokaże garść informacji podobnych tych, dla każdej łaty którą wysyłasz:

<!-- Then, Git spits out a bunch of log information looking something like this for each patch you’re sending: -->

    (mbox) Adding cc: Jessica Smith <jessica@example.com> from
      \line 'From: Jessica Smith <jessica@example.com>'
    OK. Log says:
    Sendmail: /usr/sbin/sendmail -i jessica@example.com
    From: Jessica Smith <jessica@example.com>
    To: jessica@example.com
    Subject: [PATCH 1/2] added limit to log function
    Date: Sat, 30 May 2009 13:29:15 -0700
    Message-Id: <1243715356-61726-1-git-send-email-jessica@example.com>
    X-Mailer: git-send-email 1.6.2.rc1.20.g8c5b.dirty
    In-Reply-To: <y>
    References: <y>

    Result: OK

Od tego momentu powinieneś móc przejść do folderu Draft, zmienić pole odbiorcy wiadomości na adres listy dyskusyjnej do której wysyłasz łatę, ewentualnie dodać adres osób zainteresowanych tym tematem w kopii i wysłać.

<!-- At this point, you should be able to go to your Drafts folder, change the To field to the mailing list you’re sending the patch to, possibly CC the maintainer or person responsible for that section, and send it off. -->

## Podsumowanie

Ten rozdział opisywał kilka z najczęściej używanych sposobów przepływu pracy z różnymi projektami Git które możesz spotkać, oraz wprowadził kilka nowych narzędzi które ułatwiają ten proces. W następnych sekcjach zobaczysz jak pracować z drugiej strony: prowadząc projekt Gita. Nauczysz się jak być miłosiernym dyktatorem oraz osobą integrującą zmiany innych.

<!-- This section has covered a number of common workflows for dealing with several very different types of Git projects you’re likely to encounter and introduced a couple of new tools to help you manage this process. Next, you’ll see how to work the other side of the coin: maintaining a Git project. You’ll learn how to be a benevolent dictator or integration manager. -->
