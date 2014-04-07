# Utrzymywanie projektu

Ponad to co musisz wiedzieć, aby efektywnie uczestniczyć w projekcie, powinieneś również wiedzieć jak go utrzymywać. Składa się na to akceptowanie i nakładanie łat wygenerowanych przez `format-patch` i wysłanych do Ciebie, lub łączenie zmian z zewnętrznych repozytoriów które dodałeś w projekcie. Nieważne czy prowadzisz zwykłe repozytorium, lub chcesz pomóc przy weryfikacji i integrowaniu łat, musisz wiedzieć w jaki sposób akceptować zmiany innych w taki sposób, który będzie przejrzysty dla innych i spójny w dłuższym okresie.

<!-- In addition to knowing how to effectively contribute to a project, you’ll likely need to know how to maintain one. This can consist of accepting and applying patches generated via `format-patch` and e-mailed to you, or integrating changes in remote branches for repositories you’ve added as remotes to your project. Whether you maintain a canonical repository or want to help by verifying or approving patches, you need to know how to accept work in a way that is clearest for other contributors and sustainable by you over the long run. -->

## Praca z gałęziami tematycznymi

Jeżeli zamierzasz włączyć nowe zmiany, dobrym pomysłem jest stworzenie do tego nowej tymczasowej gałęzi, specjalnie przygotowanej do tego, aby przetestować te zmiany. W ten sposób najłatwiej dostosować pojedyncze zmiany, lub zostawić je jeżeli nie działają, do czasu aż będziesz mógł się tym ponownie zająć. Jeżeli stworzysz nową gałąź bazując na głównym motywie wprowadzanych zmian które chcesz przetestować, np. `ruby_client` lub coś podobnego, możesz łatwo zapamiętać czy musiałeś ją zostawić aby później do niej wrócić. Opiekun projektu Git często tworzy oddzielną przestrzeń nazw dla nich - np. `sc/ruby_client`, gdzie `sc` jest skrótem od osoby która udostępniła zmianę.
Jak pamiętasz, możesz stworzyć nową gałąź bazując na swojej gałęzi master, w taki sposób:

<!-- When you’re thinking of integrating new work, it’s generally a good idea to try it out in a topic branch — a temporary branch specifically made to try out that new work. This way, it’s easy to tweak a patch individually and leave it if it’s not working until you have time to come back to it. If you create a simple branch name based on the theme of the work you’re going to try, such as `ruby_client` or something similarly descriptive, you can easily remember it if you have to abandon it for a while and come back later. The maintainer of the Git project tends to namespace these branches as well — such as `sc/ruby_client`, where `sc` is short for the person who contributed the work.
As you’ll remember, you can create the branch based off your master branch like this: -->

    $ git branch sc/ruby_client master

Lub, jeżeli chcesz się od razu na nią przełączyć, możesz użyć komendy `checkout -b`:

<!-- Or, if you want to also switch to it immediately, you can use the `checkout -b` command: -->

    $ git checkout -b sc/ruby_client master

Teraz jesteś gotowy do tego, aby dodać do niej udostępnione zmiany i zdecydować czy chcesz je włączyć do jednej ze swoich gałęzi.

<!-- Now you’re ready to add your contributed work into this topic branch and determine if you want to merge it into your longer-term branches. -->

## Aplikowanie łat przychodzących e-mailem

Jeżeli otrzymasz łatę poprzez wiadomość e-mail, którą musisz włączyć do swojego projektu, musisz zaaplikować ją do gałęzi tematycznej w celu przetestowania. Istnieją dwa sposoby aby włączyć takie zmiany: przy użyciu `git apply` lub `git am`.

<!-- If you receive a patch over e-mail that you need to integrate into your project, you need to apply the patch in your topic branch to evaluate it. There are two ways to apply an e-mailed patch: with `git apply` or with `git am`. -->

### Aplikowanie łaty za pomocą komendy apply

Jeżeli otrzymałeś łatę od kogoś kto wygenerował ją za pomocą komendy `git diff` lub uniksowej `diff`, możesz zaaplikować ją za pomocą komendy `git apply`. Zakładając, że zapisałeś plik w `/tmp/patch-ruby-client.patch`, możesz go nałożyć w taki sposób:

<!-- If you received the patch from someone who generated it with the `git diff` or a Unix `diff` command, you can apply it with the `git apply` command. Assuming you saved the patch at `/tmp/patch-ruby-client.patch`, you can apply the patch like this: -->

    $ git apply /tmp/patch-ruby-client.patch

Ta komenda zmodyfikuje pliki znajdujące się w obecnym katalogu. Jest ona prawie identyczna do komendy `patch -p1` w celu nałożenia łaty, ale jest bardziej restrykcyjna pod względem akceptowanych zmian. Obsługuje również dodawanie plików, usuwanie, oraz zmiany nazw jeżeli zostały zapisane w formacie `git diff`, czego komenda `patch` nie zrobi. Wreszcie, `git apply` ma zasadę "zaakceptuj lub odrzuć wszystko", gdzie albo wszystko jest zaakceptowane albo nic, a `patch` może częściowo nałożyć zmiany zostawiając projekt z niespójnym stanem. Komenda `git apply` jest z zasady bardziej restrykcyjna niż `patch`. Nie stworzy za Ciebie commita - po uruchomieniu, musisz zatwierdzić wprowadzone zmiany ręcznie.

<!-- This modifies the files in your working directory. It’s almost identical to running a `patch -p1` command to apply the patch, although it’s more paranoid and accepts fewer fuzzy matches than patch. It also handles file adds, deletes, and renames if they’re described in the `git diff` format, which `patch` won’t do. Finally, `git apply` is an "apply all or abort all" model where either everything is applied or nothing is, whereas `patch` can partially apply patchfiles, leaving your working directory in a weird state. `git apply` is overall much more paranoid than `patch`. It won’t create a commit for you — after running it, you must stage and commit the changes introduced manually. -->

Możesz również użyć `git apply` aby zobaczyć, czy łata nałoży się czysto zanim ją zaaplikujesz - jeżeli uruchomiesz `git apply --check` z łatą:

<!-- You can also use git apply to see if a patch applies cleanly before you try actually applying it — you can run `git apply -\-check` with the patch: -->

    $ git apply --check 0001-seeing-if-this-helps-the-gem.patch
    error: patch failed: ticgit.gemspec:1
    error: ticgit.gemspec: patch does not apply

Jeżeli nie zostanie wygenerowany żaden komunikat, to łata nałoży się poprawnie. Ta komenda również kończy działanie z niezerowym statusem w przypadku błędu, możesz więc użyć jej w skryptach jeżeli tylko chcesz.

<!-- If there is no output, then the patch should apply cleanly. This command also exits with a non-zero status if the check fails, so you can use it in scripts if you want. -->

### Aplikowanie łaty za pomocą am

Jeżeli otrzymałeś łatę wygenerowaną przez użytkownika używającego Gita, który stworzył go za pomocą `format-patch`, twoja praca będzie prostsza ponieważ łatka zawiera już informacje o autorze oraz komentarz do zmiany. Jeżeli możesz, namawiaj swoich współpracowników aby używali `format-patch` zamiast `diff` do generowania dla Ciebie łat. Powinieneś móc użyć jedynie `git apply` dla takich łat.

<!-- If the contributor is a Git user and was good enough to use the `format-patch` command to generate their patch, then your job is easier because the patch contains author information and a commit message for you. If you can, encourage your contributors to use `format-patch` instead of `diff` to generate patches for you. You should only have to use `git apply` for legacy patches and things like that. -->

Aby zaaplikować łatę wygenerowaną przez `format-patch`, użyj `git am`. Technicznie rzecz biorąc, `git am` został stworzony, aby odczytywać plik w formacie mbox, który jest prostym, tekstowym formatem zawierającym jedną lub więcej wiadomości e-mail w jednym pliku. Wygląda on podobnie do:

<!-- To apply a patch generated by `format-patch`, you use `git am`. Technically, `git am` is built to read an mbox file, which is a simple, plain-text format for storing one or more e-mail messages in one text file. It looks something like this: -->

    From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
    From: Jessica Smith <jessica@example.com>
    Date: Sun, 6 Apr 2008 10:17:23 -0700
    Subject: [PATCH 1/2] add limit to log function

    Limit log functionality to the first 20

To są pierwsze linie z wyniku komendy format-patch którą zobaczyłeś w poprzedniej sekcji. Jest to również poprawny plik w formacie mbox. Jeżeli ktoś poprawnie przesłał do Ciebie łatkę za pomocą `git send-email`, możesz ją zapisać w formacie mbox, następnie wskazać `git am` ten plik, a git zacznie aplikować wszystkie łatki które znajdzie. Jeżeli używasz klienta pocztowego, który potrafi zapisać kilka wiadomości e-mail w formacie mbox, możesz zapisać serię łatek do pliku i uzyć `git am` aby jest wszystkie nałożyć za jednym zamachem.

<!-- This is the beginning of the output of the format-patch command that you saw in the previous section. This is also a valid mbox e-mail format. If someone has e-mailed you the patch properly using git send-email, and you download that into an mbox format, then you can point git am to that mbox file, and it will start applying all the patches it sees. If you run a mail client that can save several e-mails out in mbox format, you can save entire patch series into a file and then use git am to apply them one at a time. -->

Również, jeżeli ktoś wgrał łatkę wygenerowaną poprzez `format-patch` do systemy rejestracji błędów lub czegoś podobnego, możesz zapisać lokalnie ten plik i potem przekazać go do `git am` aby zaaplikować go:

<!-- However, if someone uploaded a patch file generated via `format-patch` to a ticketing system or something similar, you can save the file locally and then pass that file saved on your disk to `git am` to apply it: -->

    $ git am 0001-limit-log-function.patch
    Applying: add limit to log function

Możesz zobaczyć, że został czysto nałożony i automatycznie zatwierdzony. Informacje o autorze zostały pobrane z wiadomości e-mail z nagłówków `From` i `Date`, a treść komentarz została pobrana z tematu i treści (przed łatką) e-maila. Na przykład, jeżeli ta łatka została zaaplikowana z pliku mbox który przed chwilą pokazałem, wygenerowany commit będzie wygląda podobnie do:

<!-- You can see that it applied cleanly and automatically created the new commit for you. The author information is taken from the e-mail’s `From` and `Date` headers, and the message of the commit is taken from the `Subject` and body (before the patch) of the e-mail. For example, if this patch was applied from the mbox example I just showed, the commit generated would look something like this: -->

    $ git log --pretty=fuller -1
    commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
    Author:     Jessica Smith <jessica@example.com>
    AuthorDate: Sun Apr 6 10:17:23 2008 -0700
    Commit:     Scott Chacon <schacon@gmail.com>
    CommitDate: Thu Apr 9 09:19:06 2009 -0700

       add limit to log function

       Limit log functionality to the first 20


Linie zaczynające się od `Commit` pokazują osobę która zaaplikowała łatkę oraz czas kiedy to zrobiła. Linie rozpoczynające się od `Author` pokazują osobę która stworzyła łatę wraz z dokładną datę.

<!-- The `Commit` information indicates the person who applied the patch and the time it was applied. The `Author` information is the individual who originally created the patch and when it was originally created. -->

Jednak możliwa jest również sytuacja, w której łatka nie zostanie bez problemów nałożona. Być może twoja gałąź zbyt mocno się zmieniła, w stosunku do gałęzi na której łatka została stworzona, albo zależna jest ona od innej łatki której jeszcze nie nałożyłeś. W takiej sytuacji `git am` zakończy się błędem i zapyta co robić dalej:

<!-- But it’s possible that the patch won’t apply cleanly. Perhaps your main branch has diverged too far from the branch the patch was built from, or the patch depends on another patch you haven’t applied yet. In that case, the `git am` process will fail and ask you what you want to do: -->

    $ git am 0001-seeing-if-this-helps-the-gem.patch
    Applying: seeing if this helps the gem
    error: patch failed: ticgit.gemspec:1
    error: ticgit.gemspec: patch does not apply
    Patch failed at 0001.
    When you have resolved this problem run "git am --resolved".
    If you would prefer to skip this patch, instead run "git am --skip".
    To restore the original branch and stop patching run "git am --abort".

Ta komenda zaznacza pliku z którymi miała problemy, podobnie do konfliktów występujących podczas komend `merge` lub `rebase`. Rozwiązujesz takie sytuacja również analogicznie - zmień plik w celu rozwiązania konfliktu, dodaj do przechowalni nowe pliki i następnie uruchom `git am --resolved` aby kontynuować działanie do następnej łatki:

<!-- This command puts conflict markers in any files it has issues with, much like a conflicted merge or rebase operation. You solve this issue much the same way — edit the file to resolve the conflict, stage the new file, and then run `git am -\-resolved` to continue to the next patch: -->

    $ (fix the file)
    $ git add ticgit.gemspec
    $ git am --resolved
    Applying: seeing if this helps the gem

Jeżeli chcesz aby Git spróbował w bardziej inteligentny sposób rozwiązać konflikty, dodaj opcję `-3` do komendy, która daje Gitowi możliwość spróbowania trójstronnego łączenia. Opcja ta nie jest domyślnie włączona, ponieważ nie działa poprawnie w sytuacji gdy w twoim repozytorium nie ma commitu na którym bazuje łata. Jeżeli go masz - jeżeli łatka bazowała na publicznym commit-cie - to dodanie `-3` zazwyczaj pozwala na dużo mądrzejsze zaaplikowanie konfliktującej łatki:

<!-- If you want Git to try a bit more intelligently to resolve the conflict, you can pass a `-3` option to it, which makes Git attempt a three-way merge. This option isn’t on by default because it doesn’t work if the commit the patch says it was based on isn’t in your repository. If you do have that commit — if the patch was based on a public commit — then the `-3` option is generally much smarter about applying a conflicting patch: -->

    $ git am -3 0001-seeing-if-this-helps-the-gem.patch
    Applying: seeing if this helps the gem
    error: patch failed: ticgit.gemspec:1
    error: ticgit.gemspec: patch does not apply
    Using index info to reconstruct a base tree...
    Falling back to patching base and 3-way merge...
    No changes -- Patch already applied.

W tej sytuacji, próbowałem zaaplikować łatkę którą już wcześniej włączyłem. Bez podanej opcji `-3` wyglądało to na konflikt.

<!-- In this case, I was trying to apply a patch I had already applied. Without the `-3` option, it looks like a conflict. -->

Jeżeli włączasz większą liczbę łat z pliku mbox, możesz użyć komendy `am` w trybie interaktywnym, który zatrzymuje się na każdej łacie którą znajdzie i pyta czy chcesz ją zaaplikować:

<!-- If you’re applying a number of patches from an mbox, you can also run the `am` command in interactive mode, which stops at each patch it finds and asks if you want to apply it: -->

    $ git am -3 -i mbox
    Commit Body is:
    --------------------------
    seeing if this helps the gem
    --------------------------
    Apply? [y]es/[n]o/[e]dit/[v]iew patch/[a]ccept all

Jest to całkiem dobre jeżeli masz zapisaną większą liczbę łat, ponieważ możesz najpierw zobaczyć łatę jeżeli nie pamiętasz do czego była, lub nie aplikować jej jeżeli już to zrobiłeś.

<!-- This is nice if you have a number of patches saved, because you can view the patch first if you don’t remember what it is, or not apply the patch if you’ve already done so. -->

Kiedy wszystkie łatki zostaną wgrane i commitnięte w Twojej gałęzi, możesz zastanowić się w jaki sposób i czy chcesz integrować je do jednej z głównych gałęzi.

<!-- When all the patches for your topic are applied and committed into your branch, you can choose whether and how to integrate them into a longer-running branch. -->

## Sprawdzanie zdalnych gałęzi

Jeżeli zmiana przyszła od użytkownika Gita który ma skonfigurowane własne repozytorium, wgrał do niego już jakąś liczbę zmian i następnie wysłał do Ciebie adres URL repozytorium oraz nazwę zdalnej gałęzi zawierającej zmiany, możesz ją dodać jako zdalną i połączyć zmiany lokalnie.

<!-- If your contribution came from a Git user who set up their own repository, pushed a number of changes into it, and then sent you the URL to the repository and the name of the remote branch the changes are in, you can add them as a remote and do merges locally. -->

Na przykład, jeżeli Jessica wysyła Ci wiadomość e-mail w której pisze, że ma nową funkcjonalność w gałęzi `ruby-client` w swoim repozytorium, możesz je przetestować dodając zdalne repozytorium i sprawdzając tą gałąź lokalnie:

<!-- For instance, if Jessica sends you an e-mail saying that she has a great new feature in the `ruby-client` branch of her repository, you can test it by adding the remote and checking out that branch locally: -->

    $ git remote add jessica git://github.com/jessica/myproject.git
    $ git fetch jessica
    $ git checkout -b rubyclient jessica/ruby-client

Jeżeli napisze do Ciebie ponownie z nową gałęzią która zawiera kolejną funkcjonalność, możesz ją pobrać i sprawdzić ponieważ masz już dodane zdalne repozytorium.

<!-- If she e-mails you again later with another branch containing another great feature, you can fetch and check out because you already have the remote setup. -->

Jest to bardzo pomocne w sytuacji, w której współpracujesz z jakąś osobą na stałe. Jeżeli ktoś ma tylko pojedyncze łatki które udostępnia raz na jakiś czas, to akceptowanie ich poprzez e-mail może być szybsze, niż zmuszanie wszystkich do tego aby mieli własny serwer, jak również dodawanie i usuwanie zdalnych repozytoriów aby otrzymać jedną lub dwie łatki. Jednakże, skrypty oraz usługi udostępniane mogą uczynić to prostszym - zależy od tego w taki sposób pracujesz, oraz jak pracują Twoi współpracownicy.

<!-- This is most useful if you’re working with a person consistently. If someone only has a single patch to contribute once in a while, then accepting it over e-mail may be less time consuming than requiring everyone to run their own server and having to continually add and remove remotes to get a few patches. You’re also unlikely to want to have hundreds of remotes, each for someone who contributes only a patch or two. However, scripts and hosted services may make this easier — it depends largely on how you develop and how your contributors develop. -->

Kolejną zaletą takiego podejścia jest to, że otrzymujesz również całą historię zmian. Chociaż mogą zdarzyć się uzasadnione problemy ze scalaniem zmian, wiesz na którym etapie historii ich praca bazowała; prawidłowe trójstronne scalenie jest domyślne, nie musisz więc podawać `-3` i mieć nadzieję że łatka została wygenerowana z publicznie dostępnego commitu/zmiany.

<!-- The other advantage of this approach is that you get the history of the commits as well. Although you may have legitimate merge issues, you know where in your history their work is based; a proper three-way merge is the default rather than having to supply a `-3` and hope the patch was generated off a public commit to which you have access. -->

Jeżeli nie współpracujesz z jakąś osobą na stałe, ale mimo wszystko chcesz pobrać od niej zmiany w ten sposób, możesz podać URL repozytorium do komendy `git pull`. Wykona ona jednokrotne zaciągnięcie zmian i nie zapisze URL repozytorium jako zdalnego:

<!-- If you aren’t working with a person consistently but still want to pull from them in this way, you can provide the URL of the remote repository to the `git pull` command. This does a one-time pull and doesn’t save the URL as a remote reference: -->

    $ git pull git://github.com/onetimeguy/project.git
    From git://github.com/onetimeguy/project
     * branch            HEAD       -> FETCH_HEAD
    Merge made by recursive.

## Ustalenie co zostało wprowadzone

Teraz posiadać gałąź tematyczną która zawiera otrzymane zmiany. W tym momencie możesz zdecydować co chcesz z nimi zrobić. Ta sekcja przywołuje kilka komend, tak abyś mógł zobaczyć w jaki sposób ich użyć, aby przejrzeć dokładnie co będziesz włączał do głównej gałęzi.

<!-- Now you have a topic branch that contains contributed work. At this point, you can determine what you’d like to do with it. This section revisits a couple of commands so you can see how you can use them to review exactly what you’ll be introducing if you merge this into your main branch. -->

Często pomocne jest przejrzenie wszystkich zmian które są w tej gałęzi, ale nie ma ich w gałęzi master. Możesz wyłączyć zmiany z gałęzi master poprzez dodanie opcji `--not` przed jej nazwą. Na przykład, jeżeli twój współpracownik prześle ci dwie łaty, a ty stworzysz nową gałąź `contrib` i włączysz te łatki tam, możesz uruchomić:

<!-- It’s often helpful to get a review of all the commits that are in this branch but that aren’t in your master branch. You can exclude commits in the master branch by adding the `-\-not` option before the branch name. For example, if your contributor sends you two patches and you create a branch called `contrib` and applied those patches there, you can run this: -->

    $ git log contrib --not master
    commit 5b6235bd297351589efc4d73316f0a68d484f118
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri Oct 24 09:53:59 2008 -0700

        seeing if this helps the gem

    commit 7482e0d16d04bea79d0dba8988cc78df655f16a0
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Mon Oct 22 19:38:36 2008 -0700

        updated the gemspec to hopefully work better

Aby zobaczyć jakie zmiany każdy z commitów wniósł, zapamiętaj że możesz dodać opcję `-p` do `git log`, a otrzymasz również w wyniku różnice w kodzie.

<!-- To see what changes each commit introduces, remember that you can pass the `-p` option to `git log` and it will append the diff introduced to each commit. -->

Aby zobaczyć różnice tego co się stanie, jeżeli chciałbyś połączyć tą gałąź z inną, będziesz musiał użyć całkiem ciekawych sztuczek aby otrzymać poprawne wyniki. Możesz pomyśleć, aby uruchomić:

<!-- To see a full diff of what would happen if you were to merge this topic branch with another branch, you may have to use a weird trick to get the correct results. You may think to run this: -->

    $ git diff master

Ta komenda pokaże ci różnice w kodzie, ale może to być mylące. Jeżeli twoja gałąź `master` zmieniła się od czasu stworzenia gałęzi tematycznej, otrzymasz dziwne wyniki. Tak dzieje się dlatego, ponieważ Git porównuje bezpośrednio ostatnią migawkę z gałęzi tematycznej, z ostatnią migawkę w gałęzi `master`. Na przykład, jeżeli dodasz linię w pliku w gałęzi `master`, bezpośrednie porównanie pokaże, że gałąź tematyczna zamierza usunąć tą linię.

<!-- This command gives you a diff, but it may be misleading. If your `master` branch has moved forward since you created the topic branch from it, then you’ll get seemingly strange results. This happens because Git directly compares the snapshots of the last commit of the topic branch you’re on and the snapshot of the last commit on the `master` branch. For example, if you’ve added a line in a file on the `master` branch, a direct comparison of the snapshots will look like the topic branch is going to remove that line. -->

Jeżeli `master` jest bezpośrednim przodkiem Twojej gałęzi tematycznej, nie stanowi to problemu; jeżeli jednak obie linie się rozjechały, wynik `diff` pokaże dodawane wszystkie zmiany z gałęzi tematycznej, a usuwane wszystkie unikalne z `master`.

<!-- If `master` is a direct ancestor of your topic branch, this isn’t a problem; but if the two histories have diverged, the diff will look like you’re adding all the new stuff in your topic branch and removing everything unique to the `master` branch. -->

Wynik którego naprawdę oczekujesz, to ten, pokazujący zmiany będące w gałęzi tematycznej - zmiany które wprowadzisz jeżeli scalisz tą gałąź z master. Możesz to zrobić, poprzez porównanie ostatniego commitu z gałęzi tematycznej, z pierwszym wspólnym przodkiem z gałęzi master.

<!-- What you really want to see are the changes added to the topic branch — the work you’ll introduce if you merge this branch with master. You do that by having Git compare the last commit on your topic branch with the first common ancestor it has with the master branch. -->

Technicznie rzecz ujmując, możesz to zrobić poprzez wskazanie wspólnego przodka i uruchomienie na nim diff:

<!-- Technically, you can do that by explicitly figuring out the common ancestor and then running your diff on it: -->

    $ git merge-base contrib master
    36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
    $ git diff 36c7db


Jednak to nie jest wygodne rozwiązanie, dlatego Git udostępnia krótszą metodę aby to osiągnąć: składnie z potrójną kropką. W kontekście komendy `diff`, możesz wstawić trzy kropki po nazwie gałęzi z którą chcesz porównać, aby otrzymać różnice z ostatniej zmiany z gałęzi na której się znajdujesz a wspólnym przodkiem tej drugiej.

<!-- However, that isn’t convenient, so Git provides another shorthand for doing the same thing: the triple-dot syntax. In the context of the `diff` command, you can put three periods after another branch to do a `diff` between the last commit of the branch you’re on and its common ancestor with another branch: -->

    $ git diff master...contrib

Ta komenda pokaże zmiany wprowadzone tylko w gałęzi tematycznej, od czasu jej stworzenia. Jest to bardzo użyteczna składnia warta zapamiętania.

<!-- This command shows you only the work your current topic branch has introduced since its common ancestor with master. That is a very useful syntax to remember. -->

## Integrowanie otrzymanych zmian

Kiedy zakończysz prace nad zmianami w gałęzi tematycznej i będą one gotowe do włączenia do głównej, pozostaje pytanie w jaki sposób to zrobić. Ponadto, jaki rodzaj przepływu pracy chcesz stosować w swoim projekcie? Masz różne możliwości, opiszę więc kilka z nich.

<!-- When all the work in your topic branch is ready to be integrated into a more mainline branch, the question is how to do it. Furthermore, what overall workflow do you want to use to maintain your project? You have a number of choices, so I’ll cover a few of them. -->

### Przepływ pracy podczas scalania zmian

Jednym z prostszych przepływów pracy jest scalenie zmian z twoją gałęzią `master`. W tym scenariuszu, posiadasz gałąź `master` która zawiera stabilny kod. Kiedy masz zmiany w jednej z gałęzi tematycznych które wykonałeś, lub ktoś Ci przesłał a Ty je zweryfikowałeś, scalasz je z gałęzią `master`, usuwasz gałąź i kontynuujesz pracę. Jeżeli mielibyśmy repozytorium ze zmianami w dwóch gałęziach `ruby_client` oraz `php_client` (zob. rys. 5-19) i mielibyśmy scalić najpierw `ruby_client`, a w następnej kolejności `php_client`, to twoja historia zmian wyglądała by podobnie do rys. 5-20.

<!-- One simple workflow merges your work into your `master` branch. In this scenario, you have a `master` branch that contains basically stable code. When you have work in a topic branch that you’ve done or that someone has contributed and you’ve verified, you merge it into your master branch, delete the topic branch, and then continue the process.  If we have a repository with work in two branches named `ruby_client` and `php_client` that looks like Figure 5-19 and merge `ruby_client` first and then `php_client` next, then your history will end up looking like Figure 5-20. -->


![](http://git-scm.com/figures/18333fig0519-tn.png)

Figure 5-19. Historia zmian z kilkoma gałęziami tematycznymi.

<!-- Figure 5-19. History with several topic branches. -->


![](http://git-scm.com/figures/18333fig0520-tn.png)

Figure 5-20. Po scaleniu gałęzi.

<!-- Figure 5-20. After a topic branch merge. -->

To jest prawdopodobnie najprostszy schemat pracy, ale jest on również problematyczny jeżeli masz do czynienia z dużymi repozytoriami lub projektami.

<!-- That is probably the simplest workflow, but it’s problematic if you’re dealing with larger repositories or projects. -->

Jeżeli masz większą ilość deweloperów lub większy projekt, będziesz chciał pewnie używał przynajmniej dwufazowego cyklu scalania. W tym scenariuszu, posiadasz dwie długodystansowe gałęzie `master` oraz `develop`, z których `master` jest aktualizowana tylko z bardzo stabilnymi zmianami, a cały nowy kod jest włączany do gałęzi `develop`. Regularnie wysyłasz ("push") obie te gałęzie do publicznego repozytorium. Za każdym razem gdy masz nową gałąź tematyczną do zintegrowania (rys. 5-21), włączasz ją do `develop` (rys. 5-22); a kiedy tagujesz kolejną wersję, przesuwasz `master` za pomocą fast-forward o punktu w którym jest gałąź `develop`(rys. 5-23).

<!-- If you have more developers or a larger project, you’ll probably want to use at least a two-phase merge cycle. In this scenario, you have two long-running branches, `master` and `develop`, in which you determine that `master` is updated only when a very stable release is cut and all new code is integrated into the `develop` branch. You regularly push both of these branches to the public repository. Each time you have a new topic branch to merge in (Figure 5-21), you merge it into `develop` (Figure 5-22); then, when you tag a release, you fast-forward `master` to wherever the now-stable `develop` branch is (Figure 5-23). -->


![](http://git-scm.com/figures/18333fig0521-tn.png)

Figure 5-21. Przed scaleniem gałęzi tematycznej.

<!-- Figure 5-21. Before a topic branch merge. -->


![](http://git-scm.com/figures/18333fig0522-tn.png)

Figure 5-22. Po scaleniu gałęzi tematycznej.

<!-- Figure 5-22. After a topic branch merge. -->


![](http://git-scm.com/figures/18333fig0523-tn.png)

Figure 5-23. Po utworzeniu kolejnej wersji.

<!-- Figure 5-23. After a topic branch release. -->

W ten sposób, kiedy ludzie klonują Twoje repozytorium, mogą albo pobrać `master` aby zbudować najnowszą stabilną wersję i utrzymywać ją uaktualnioną, lub mogą pobrać `develop` która zawiera mniej stabilne zmiany.
Możesz rozbudować tą koncepcję, poprzez dodanie gałęzi służącej do integracji. Wtedy jeżeli kod w znajdujący się w niej jest stabilny i przechodzi wszystkie testy, scalasz ją do gałęzi `develop`; a jeżeli ta okaże się również stabilna, przesuwasz `master` za pomocą fast-forward.

<!-- This way, when people clone your project’s repository, they can either check out master to build the latest stable version and keep up to date on that easily, or they can check out develop, which is the more cutting-edge stuff.
You can also continue this concept, having an integrate branch where all the work is merged together. Then, when the codebase on that branch is stable and passes tests, you merge it into a develop branch; and when that has proven itself stable for a while, you fast-forward your master branch. -->

### Large-Merging Workflows

Projekt Gita ma cztery długodystansowe gałęzie: `master`, `next`, `pu` (proponowane zmiany) dla nowych funkcjonalności, oraz `maint` do wprowadzania zmian wstecznych. Kiedy nowe zmiany są dostarczone przez deweloperów, zbierane są do gałęzi tematycznych w repozytorium opiekuna, w sposób podobny do tego który opisałem (zob. rys. 5-24). W tym momencie, są one weryfikowane i sprawdzane czy mogą być użyte, lub czy nadal wymagają dalszych prac. Jeżeli są gotowe, są włączona do `next`, a ta gałąź jest wypychana dalej, tak aby każdy mógł wypróbować nowe funkcjonalności.

<!-- The Git project has four long-running branches: `master`, `next`, and `pu` (proposed updates) for new work, and `maint` for maintenance backports. When new work is introduced by contributors, it’s collected into topic branches in the maintainer’s repository in a manner similar to what I’ve described (see Figure 5-24). At this point, the topics are evaluated to determine whether they’re safe and ready for consumption or whether they need more work. If they’re safe, they’re merged into `next`, and that branch is pushed up so everyone can try the topics integrated together. -->


![](http://git-scm.com/figures/18333fig0524-tn.png)

Figure 5-24. Zarządzanie złożoną serią równoczesnych zmian w gałęziach tematycznych.

<!-- Figure 5-24. Managing a complex series of parallel contributed topic branches. -->

Jeżeli funkcjonalność potrzebuje jeszcze kolejnych zmian, są one włączane do gałęzi `pu`. Kiedy okaże się, że cały kod działa już poprawnie, zmiany są włączane do `master` oraz przebudowywane włącznie ze zmianami z gałęzi `next`, które nie znalazły się jeszcze w `master`. Oznacza to, że `master` praktycznie zawsze przesuwa się do przodu, `next` tylko czasami ma zmienianą bazę poprzez "rebase", a `pu` najczęściej z nich może się przesunąć w innym kierunku (zob. rys. 5-25).

<!-- If the topics still need work, they’re merged into `pu` instead. When it’s determined that they’re totally stable, the topics are re-merged into `master` and are then rebuilt from the topics that were in `next` but didn’t yet graduate to `master`. This means `master` almost always moves forward, `next` is rebased occasionally, and `pu` is rebased even more often (see Figure 5-25). -->


![](http://git-scm.com/figures/18333fig0525-tn.png)

Figure 5-25. Włączanie gałęzi tematycznych do gałęzi długodystansowych.

<!-- Figure 5-25. Merging contributed topic branches into long-term integration branches. -->

Z chwilą, gdy gałąź tematycznie zostanie włączona do `master`, jest usuwana z repozytorium. Projekt Gita ma również gałąź `maint`, która jest tworzona z ostatniej wersji, w celu dostarczania zmian w sytuacji gdy trzeba wydać wersję poprawkową. Dlatego kopiując repozytorium Gita masz cztery gałęzie, w których możesz zobaczyć projekt w różnych stadiach rozwoju, w zależności od tego jak stabilny kod chcesz używać, lub nad którym pracować; a opiekun ma ułatwiony przepływ zmian pomagający panować nad nowymi zmianami.

<!-- When a topic branch has finally been merged into `master`, it’s removed from the repository. The Git project also has a `maint` branch that is forked off from the last release to provide backported patches in case a maintenance release is required. Thus, when you clone the Git repository, you have four branches that you can check out to evaluate the project in different stages of development, depending on how cutting edge you want to be or how you want to contribute; and the maintainer has a structured workflow to help them vet new contributions. -->

### Zmiana bazy oraz wybiórcze pobieranie zmian

Część opiekunów woli używać "rebase" lub "cherry-pick" w celu włączania zmian w gałęzi master, zamiast przy użyciu "merge", aby zachować bardziej liniową historię. Kiedy masz zmiany w gałęzi tematycznej i decydujesz się zintegrować je, przenosisz gałąź i uruchamiasz "rebase" aby nałożyć zmiany na górze swojej gałęzi master (lub `develop`, czy innej). Jeżeli to zadziała poprawnie, możesz przesunąć swoją gałąź `master` i otrzymasz praktycznie liniową historię.

<!-- Other maintainers prefer to rebase or cherry-pick contributed work on top of their master branch, rather than merging it in, to keep a mostly linear history. When you have work in a topic branch and have determined that you want to integrate it, you move to that branch and run the rebase command to rebuild the changes on top of your current master (or `develop`, and so on) branch. If that works well, you can fast-forward your `master` branch, and you’ll end up with a linear project history. -->

Drugim sposobem na przeniesienie zmian z jednej gałęzi do drugiej jest zrobienie tego za pomocą komendy `cherry-pick`. Komenda ta jest podobna do `rebase`, ale dla pojedynczej zmiany. Pobiera ona zmianę która została wprowadzona i próbuje ją ponownie nałożyć na gałąź na której obecnie pracujesz. Jest to całkiem przydatne, w sytuacji gdy masz większą ilość zmian w gałęzi tematycznej, a chcesz zintegrować tylko jedną z nich, lub jeżeli masz tylko jedną zmianę w gałęzi i wolisz używać cherry-pick zamiast rebase. Dla przykładu, załóżmy że masz projekt który wygląda podobnie do rys. 5-26.

<!-- The other way to move introduced work from one branch to another is to cherry-pick it. A cherry-pick in Git is like a rebase for a single commit. It takes the patch that was introduced in a commit and tries to reapply it on the branch you’re currently on. This is useful if you have a number of commits on a topic branch and you want to integrate only one of them, or if you only have one commit on a topic branch and you’d prefer to cherry-pick it rather than run rebase. For example, suppose you have a project that looks like Figure 5-26. -->


![](http://git-scm.com/figures/18333fig0526-tn.png)

Figure 5-26. Przykładowa historia przez wybiórczym zaciąganiem zmian.

<!-- Figure 5-26. Example history before a cherry pick. -->

Jeżeli chcesz pobrać zmianę `e43a6` do swojej gałęzi master, możesz uruchomić:

<!-- If you want to pull commit `e43a6` into your master branch, you can run -->

    $ git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
    Finished one cherry-pick.
    [master]: created a0a41a9: "More friendly message when locking the index fails."
     3 files changed, 17 insertions(+), 3 deletions(-)

To pobierze tylko zmiany z commita `e43a6`, ale otrzyma nową sumę SHA-1, ze względu na nową datę nałożenia. Teraz Twoja historia wygląda podobnie do rysunku 5-27.

<!--  This pulls the same change introduced in `e43a6`, but you get a new commit SHA-1 value, because the date applied is different. Now your history looks like Figure 5-27. -->


![](http://git-scm.com/figures/18333fig0527-tn.png)

Figure 5-27. Historia po wybiórczym zaciągnięciu zmiany z gałęzi tematycznej.

<!-- Figure 5-27. History after cherry-picking a commit on a topic branch. -->

Teraz możesz usunąć swoją gałąź tematyczną, oraz zmiany których nie chciałeś pobierać.

<!-- Now you can remove your topic branch and drop the commits you didn’t want to pull in. -->

## Tagowanie Twoich Wersji

Kiedy zdecydowałeś, że wydasz nową wersję, najprawdopodobniej będziesz chciał stworzyć taga, tak abyś mógł odtworzyć tą wersję w każdym momencie. Możesz stworzyć nowego taga, tak jak zostało to opisane w rozdziale 2. Jeżeli zdecydujesz się na utworzenie taga jako opiekun, komenda powinna wyglądać podobnie do:

<!-- When you’ve decided to cut a release, you’ll probably want to drop a tag so you can re-create that release at any point going forward. You can create a new tag as I discussed in Chapter 2. If you decide to sign the tag as the maintainer, the tagging may look something like this: -->

    $ git tag -s v1.5 -m 'my signed 1.5 tag'
    You need a passphrase to unlock the secret key for
    user: "Scott Chacon <schacon@gmail.com>"
    1024-bit DSA key, ID F721C45A, created 2009-02-09

Jeżeli podpisujesz swoje tagi, możesz mieć problem z dystrybucją swojego publicznego klucza PGP, który został użyty. Można rozwiązać ten problem poprzez dodanie obiektu binarnego (ang. blob) w repozytorium, a następnie stworzenie taga kierującego dokładnie na jego zawartość. Aby to zrobić, musisz wybrać klucz za pomocą komendy `gpg --list-keys`:

<!-- If you do sign your tags, you may have the problem of distributing the public PGP key used to sign your tags. The maintainer of the Git project has solved this issue by including their public key as a blob in the repository and then adding a tag that points directly to that content. To do this, you can figure out which key you want by running `gpg -\-list-keys`: -->

    $ gpg --list-keys
    /Users/schacon/.gnupg/pubring.gpg
    ---------------------------------
    pub   1024D/F721C45A 2009-02-09 [expires: 2010-02-09]
    uid                  Scott Chacon <schacon@gmail.com>
    sub   2048g/45D02282 2009-02-09 [expires: 2010-02-09]


Następnie, możesz bezpośrednio zaimportować wybrany klucz do Gita, poprzez eksport i przekazanie go do `git hash-object`, który zapisuje nowy obiekt binarny i zwraca jego sumę SHA-1:

<!-- Then, you can directly import the key into the Git database by exporting it and piping that through `git hash-object`, which writes a new blob with those contents into Git and gives you back the SHA-1 of the blob: -->

    $ gpg -a --export F721C45A | git hash-object -w --stdin
    659ef797d181633c87ec71ac3f9ba29fe5775b92

Teraz, gdy masz zawartość swojego klucza w Gitcie, możesz utworzyć taga wskazującego bezpośrednio na ten klucz, poprzez podanie sumy SHA-1 zwróconej przez `hash-object`:

<!-- Now that you have the contents of your key in Git, you can create a tag that points directly to it by specifying the new SHA-1 value that the `hash-object` command gave you: -->

    $ git tag -a maintainer-pgp-pub 659ef797d181633c87ec71ac3f9ba29fe5775b92

Po uruchomieniu `git push --tags`, etykieta `maintainer-pgp-pub` zostanie udostępniona dla wszystkich. Jeżeli ktoś chciałby zweryfikować etykietę, może bezpośrednio zaimportować twój klucz PGP poprzez pobranie zawartości z gita i import do GPG:

<!-- If you run `git push -\-tags`, the `maintainer-pgp-pub` tag will be shared with everyone. If anyone wants to verify a tag, they can directly import your PGP key by pulling the blob directly out of the database and importing it into GPG: -->

    $ git show maintainer-pgp-pub | gpg --import

Możesz używać tego klucza do weryfikacji wszystkich podpisanych etykiet. Możesz również dodać do komentarza do etykiety dodatkowe informacje, które będą możliwe do odczytania po uruchomieniu `git show <tag>` i pozwolą na prostszą weryfikację.

<!-- They can use that key to verify all your signed tags. Also, if you include instructions in the tag message, running `git show <tag>` will let you give the end user more specific instructions about tag verification. -->

## Generowanie numeru kompilacji

<!-- ## Generating a Build Number -->

Ponieważ Git nie zwiększa stale numerów, np. 'v123' lub w podobny sposób, jeżeli chcesz mieć łatwiejszą do używania nazwę dla konkretnej zmiany, możesz uruchomić `git describe` na commitcie. Git poda Ci nazwę najbliższej etykiety, wraz z ilością zmian, oraz skróconą sumą SHA-1:

<!-- Because Git doesn’t have monotonically increasing numbers like 'v123' or the equivalent to go with each commit, if you want to have a human-readable name to go with a commit, you can run `git describe` on that commit. Git gives you the name of the nearest tag with the number of commits on top of that tag and a partial SHA-1 value of the commit you’re describing: -->

    $ git describe master
    v1.6.2-rc1-20-g8c5b85c

W ten sposób, możesz udostępnić konkretną wersję lub kompilację pod nazwą łatwiejszą do użycia przez ludzi. W rzeczywistości, jeżeli masz Gita zbudowanego ze źródeł pobranych z jego repozytorium, komenda `git --version` pokaże wynik podobny do powyższego. Jeżeli zamierzasz opisać zmianę którą bezpośrednio zatagowałeś, pokaże ona nazwę taga.

<!-- This way, you can export a snapshot or build and name it something understandable to people. In fact, if you build Git from source code cloned from the Git repository, `git -\-version` gives you something that looks like this. If you’re describing a commit that you have directly tagged, it gives you the tag name. -->

Komenda `git describe` faworyzuje etykiety stworzone przy użyciu opcji `-a` lub `-s`, więc etykiety dotyczące konkretnych wersji powinny być tworzone w ten sposób, jeżeli używasz `git describe` w celu zapewnienia poprawnych nazw commitów. Możesz również używać tej nazwy do komend "checkout" lub "show", choć polegają one na skróconej wartości SHA-1, mogą więc nie być wiecznie poprawne. Na przykład, projekt jądra Linuksa przeszedł ostatnio z 8 na 10 znaków aby zapewnić unikalność sum SHA-1, więc poprzednie nazwy wygenerowane za pomocą `git describe` zostały unieważnione.

<!-- The `git describe` command favors annotated tags (tags created with the `-a` or `-s` flag), so release tags should be created this way if you’re using `git describe`, to ensure the commit is named properly when described. You can also use this string as the target of a checkout or show command, although it relies on the abbreviated SHA-1 value at the end, so it may not be valid forever. For instance, the Linux kernel recently jumped from 8 to 10 characters to ensure SHA-1 object uniqueness, so older `git describe` output names were invalidated. -->

## Przygotowywanie nowej wersji

<!--## Preparing a Release -->

Teraz chcesz stworzyć nową wersję. Jedną z rzeczy które będziesz musiał zrobić, jest przygotowanie spakowanego archiwum z ostatnią zawartością kodu, dla tych, którzy nie używają Gita. Komenda która to umożliwia to `git archive`:

<!-- Now you want to release a build. One of the things you’ll want to do is create an archive of the latest snapshot of your code for those poor souls who don’t use Git. The command to do this is `git archive`: -->

    $ git archive master --prefix='project/' | gzip > `git describe master`.tar.gz
    $ ls *.tar.gz
    v1.6.2-rc1-20-g8c5b85c.tar.gz

Jeżeli ktoś otworzy spakowany plik, otrzyma ostatnią wersję kodu w podkatalogu z nazwą projektu. Możesz również stworzyć archiwum zip w podobny sposób, dodając parametr `--format=zip` do `git archive`:

<!-- If someone opens that tarball, they get the latest snapshot of your project under a project directory. You can also create a zip archive in much the same way, but by passing the `-\-format=zip` option to `git archive`: -->

    $ git archive master --prefix='project/' --format=zip > `git describe master`.zip

Masz teraz spakowane pliki projektu w formatach tar i zip, które możesz łatwo wgrać na serwer lub wysłać do ludzi.

<!-- You now have a nice tarball and a zip archive of your project release that you can upload to your website or e-mail to people. -->

## Komenda Shortlog

Nadszedł czas aby wysłać na listę dyskusyjną

<!-- It’s time to e-mail your mailing list of people who want to know what’s happening in your project. A nice way of quickly getting a sort of changelog of what has been added to your project since your last release or e-mail is to use the `git shortlog` command. It summarizes all the commits in the range you give it; for example, the following gives you a summary of all the commits since your last release, if your last release was named v1.0.1: -->

    $ git shortlog --no-merges master --not v1.0.1
    Chris Wanstrath (8):
          Add support for annotated tags to Grit::Tag
          Add packed-refs annotated tag support.
          Add Grit::Commit#to_patch
          Update version and History.txt
          Remove stray `puts`
          Make ls_tree ignore nils

    Tom Preston-Werner (4):
          fix dates in history
          dynamic version method
          Version bump to 1.0.2
          Regenerated gemspec for version 1.0.2

Możesz pobrać podsumowanie wszystkich zmian począwszy od wersji v1.0.1 pogrupowanych po autorze, które jest gotowe do wysłania na listę.

<!-- You get a clean summary of all the commits since v1.0.1, grouped by author, that you can e-mail to your list. -->
