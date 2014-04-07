# Wskazywanie rewizji

<!-- # Revision Selection -->

Git umożliwia wskazanie konkretnej zmiany lub zakresu zmian na kilka sposobów. Nie koniecznie są one oczywiste, ale na pewno są warte uwagi.

<!-- Git allows you to specify specific commits or a range of commits in several ways. They aren’t necessarily obvious but are helpful to know. -->

## Pojedyncze rewizje

Jak wiesz, możesz odwoływać się do pojedynczej zmiany poprzez skrót SHA-1, istnieją jednak bardziej przyjazne sposoby. Ta sekcja opisuje kilka z nich.

<!-- You can obviously refer to a commit by the SHA-1 hash that it’s given, but there are more human-friendly ways to refer to commits as well. This section outlines the various ways you can refer to a single commit. -->

## Krótki SHA

Git jest na tyle inteligentny, że potrafi domyśleć się o którą zmianę Ci chodziło po dodaniu zaledwie kilku znaków, o ile ta część sumy SHA-1 ma przynajmniej 4 znaki i jest unikalna, co oznacza, że istnieje tylko jeden obiekt w repozytorium, który od nich się zaczyna.

<!-- Git is smart enough to figure out what commit you meant to type if you provide the first few characters, as long as your partial SHA-1 is at least four characters long and unambiguous — that is, only one object in the current repository begins with that partial SHA-1. -->

Dla przykładu, aby zobaczyć konkretną zmianę, uruchamiasz komendę `git log` i wybierasz zmianę w której dodałeś jakąś funkcjonalność:

<!-- For example, to see a specific commit, suppose you run a `git log` command and identify the commit where you added certain functionality: -->

	$ git log
	commit 734713bc047d87bf7eac9674765ae793478c50d3
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Jan 2 18:32:33 2009 -0800

	    fixed refs handling, added gc auto, updated tests

	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Merge: 1c002dd... 35cfb2b...
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

	commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 14:58:32 2008 -0800

	    added some blame and merge stuff

W tej sytuacji, wybierasz `1c002dd....` Jeżeli chcesz wykonać na nim `git show`, każda z poniższych komend da identyczny efekt (zakładając, że krótsze wersje są jednoznaczne):

<!-- In this case, choose `1c002dd....` If you `git show` that commit, the following commands are equivalent (assuming the shorter versions are unambiguous): -->

	$ git show 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	$ git show 1c002dd4b536e7479f
	$ git show 1c002d


Git może sam odnaleźć unikalne występowania wartości SHA-1. Jeżeli przekażesz parametr `--abbrev-commit` do komendy `git log`, jej wynik pokaże krótsze wartości SHA-1, przy zachowaniu ich unikalności; domyślnie stosuje długość 7 znaków, ale może ją zwiększyć, aby zachować unikalność sum kontrolnych:

<!-- Git can figure out a short, unique abbreviation for your SHA-1 values. If you pass `-\-abbrev-commit` to the `git log` command, the output will use shorter values but keep them unique; it defaults to using seven characters but makes them longer if necessary to keep the SHA-1 unambiguous: -->

	$ git log --abbrev-commit --pretty=oneline
	ca82a6d changed the version number
	085bb3b removed unnecessary test code
	a11bef0 first commit

Generalnie, 8 do 10 znaków to wystarczająca ilość, aby mieć unikalne wartości w projekcie. Jeden z największych projektów korzystających z Gita, jądro systemu linux, zaczyna używać 12 znaków z dostępnych 40. 

<!-- Generally, eight to ten characters are more than enough to be unique within a project. One of the largest Git projects, the Linux kernel, is beginning to need 12 characters out of the possible 40 to stay unique. -->

## KRÓTKA UWAGA NA TEMAT SHA-1

<!-- ## A SHORT NOTE ABOUT SHA-1 -->

Duża ilość osób zaniepokoiła się, gdy ze względu na jakiś szczęśliwy przypadek, mieli w swoim repozytorium dwa różne obiekty posiadające tą samą wartość SHA-1.

<!-- A lot of people become concerned at some point that they will, by random happenstance, have two objects in their repository that hash to the same SHA-1 value. What then? -->

Jeżeli zdarzy Ci się zapisać obiekt który ma sumę kontrolną SHA-1 taką samą jak inny obiekt będący już w repozytorium, Git zauważy, że obiekt taki już istnieje i założy, że został on już zapisany. Jeżeli spróbujesz pobrać jego zawartość, zawsze otrzymasz dane pierwszego obiektu.

<!-- If you do happen to commit an object that hashes to the same SHA-1 value as a previous object in your repository, Git will see the previous object already in your Git database and assume it was already written. If you try to check out that object again at some point, you’ll always get the data of the first object. -->

Powinieneś wiedzieć jednak, że taki scenariusz jest strasznie rzadki. Skrót SHA-1 ma długość 20 bajtów lub 160 bitów. Ilość losowych obiektów potrzebnych do zapewnienia 50% prawdopodobieństwa kolizji to około 2^80 (wzór na obliczenie prawdopodobieństwa kolizji to `p = (n(n-1)/2) * (1/2^160)`). 2^80 to 1.2 x 10^24 lub 1 milion miliardów miliardów. Jest to około 1200 razy ilość ziarenek piasku na kuli ziemskiej.

<!--However, you should be aware of how ridiculously unlikely this scenario is. The SHA-1 digest is 20 bytes or 160 bits. The number of randomly hashed objects needed to ensure a 50% probability of a single collision is about 2^80 (the formula for determining collision probability is `p = (n(n-1)/2) * (1/2^160))`. 2^80 is 1.2 x 10^24 or 1 million billion billion. That’s 1,200 times the number of grains of sand on the earth. -->

Weźmy przykład, aby zaprezentować Ci jak trudne jest wygenerowanie kolizji SHA-1. Jeżeli wszyscy z 6,5 miliarda osób na ziemi byłaby programistami i w każdej sekundzie, każdy z nich tworzyłby kod wielkości całego jądra Linuksa (1 milion obiektów Gita) i wgrywał go do ogromnego repozytorium Gita, zajęłoby około 5 lat, zanim w repozytorium byłoby tyle obiektów, aby mieć pewność 50% wystąpienia kolizji. Istnieje większe prawdopodobieństwo, że każdy z członków Twojego zespołu programistycznego zostanie zaatakowany i zabity przez wilki, w nie związanych ze sobą zdarzeniach, w ciągu tej samej nocy. 

<!-- Here’s an example to give you an idea of what it would take to get a SHA-1 collision. If all 6.5 billion humans on Earth were programming, and every second, each one was producing code that was the equivalent of the entire Linux kernel history (1 million Git objects) and pushing it into one enormous Git repository, it would take 5 years until that repository contained enough objects to have a 50% probability of a single SHA-1 object collision. A higher probability exists that every member of your programming team will be attacked and killed by wolves in unrelated incidents on the same night. -->

## Odniesienie do gałęzi

<!-- ## Branch References -->

Najprostszym sposobem na wskazanie konkretnej zmiany, jest stworzenie odniesienia do gałęzi wskazującej na nią. Następnie, będziesz mógł używać nazwy gałęzi we wszystkich komendach Gita które przyjmują jako parametr obiekt lub wartość SHA-1. Na przykład, jeżeli chcesz pokazać ostatni zmieniony obiekt w gałęzi, podane niżej komendy są identyczne, przy założeniu, że `topic1` wskazuje na `ca82a6d`:

<!-- The most straightforward way to specify a commit requires that it have a branch reference pointed at it. Then, you can use a branch name in any Git command that expects a commit object or SHA-1 value. For instance, if you want to show the last commit object on a branch, the following commands are equivalent, assuming that the `topic1` branch points to `ca82a6d`: -->

	$ git show ca82a6dff817ec66f44342007202690a93763949
	$ git show topic1

Jeżeli chciałbyś zobaczyć, na jaką sumę SHA-1 wskazuje dana gałąź, lub jeżeli chcesz zobaczyć na jaką sumę SHA-1 każdy z tych przykładów się rozwiązuje, możesz użyć komendy `rev-parse`. Możesz zobaczyć również rozdział 9, aby dowiedzieć się o tym narzędziu więcej; ale, `rev-parse` wykonuje operacje niskopoziomowo i nie jest stworzony do codziennej pracy. Jednakże potrafi być czasami przydatny, jeżeli musisz zobaczyć co tak naprawdę się dzieje. Możesz teraz wywołać `rev-parse` na swojej gałęzi.

<!-- If you want to see which specific SHA a branch points to, or if you want to see what any of these examples boils down to in terms of SHAs, you can use a Git plumbing tool called `rev-parse`. You can see Chapter 9 for more information about plumbing tools; basically, `rev-parse` exists for lower-level operations and isn’t designed to be used in day-to-day operations. However, it can be helpful sometimes when you need to see what’s really going on. Here you can run `rev-parse` on your branch. -->

	$ git rev-parse topic1
	ca82a6dff817ec66f44342007202690a93763949

## Skróty do RefLog

<!-- ## RefLog Shortnames -->

Jedną z rzeczy które Git robi w tle w czasie Twojej pracy, jest utrzymywanie reflog-a - zapisanych informacji o tym, jak wyglądały odwołania HEAD-a i innych gałęzi w ciągu ostatnich miesięcy.

<!-- One of the things Git does in the background while you’re working away is keep a reflog — a log of where your HEAD and branch references have been for the last few months. -->

Możesz zobaczyć reflog-a za pomocą komendy `git reflog`:

<!-- You can see your reflog by using `git reflog`: -->

	$ git reflog
	734713b... HEAD@{0}: commit: fixed refs handling, added gc auto, updated
	d921970... HEAD@{1}: merge phedders/rdocs: Merge made by recursive.
	1c002dd... HEAD@{2}: commit: added some blame and merge stuff
	1c36188... HEAD@{3}: rebase -i (squash): updating HEAD
	95df984... HEAD@{4}: commit: # This is a combination of two commits.
	1c36188... HEAD@{5}: rebase -i (squash): updating HEAD
	7e05da5... HEAD@{6}: rebase -i (pick): updating HEAD

Za każdym razem, gdy Twoja gałąź się przesuwa, Git przechowuje tą informację w tej tymczasowej historii. Za jej pomocą, możesz wskazać również starsze zmiany. Jeżeli chcesz zobaczyć zawartość HEAD-a sprzed 5 zmian, możesz użyć odwołania `@{n}`, które widać w wyniku komendy reflog: 

<!-- Every time your branch tip is updated for any reason, Git stores that information for you in this temporary history. And you can specify older commits with this data, as well. If you want to see the fifth prior value of the HEAD of your repository, you can use the `@{n}` reference that you see in the reflog output: -->

	$ git show HEAD@{5}

Możesz również użyć tej składni, aby dowiedzieć się, jak wyglądała dana gałąź jakiś czas temu. Na przykład, aby zobaczyć gdzie była gałąź `master` wczoraj, możesz wywołać

<!-- You can also use this syntax to see where a branch was some specific amount of time ago. For instance, to see where your `master` branch was yesterday, you can type -->

	$ git show master@{yesterday}

Co pokaże Ci, na jakim etapie znajdowała się ta gałąź wczoraj. Ta technika zadziała tylko dla danych które są jeszcze w Twoim reflog-u, nie możesz więc jej użyć do sprawdzenia zmian starszych niż kilka miesięcy.

<!-- That shows you where the branch tip was yesterday. This technique only works for data that’s still in your reflog, so you can’t use it to look for commits older than a few months. -->

Aby zobaczyć wynik reflog-a w formacie podobnym do wyniku `git log`, możesz uruchomić `git log -g`:

<!-- To see reflog information formatted like the `git log` output, you can run `git log -g`: -->

	$ git log -g master
	commit 734713bc047d87bf7eac9674765ae793478c50d3
	Reflog: master@{0} (Scott Chacon <schacon@gmail.com>)
	Reflog message: commit: fixed refs handling, added gc auto, updated
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Fri Jan 2 18:32:33 2009 -0800

	    fixed refs handling, added gc auto, updated tests

	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Reflog: master@{1} (Scott Chacon <schacon@gmail.com>)
	Reflog message: merge phedders/rdocs: Merge made by recursive.
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

Należy zaznaczyć, że informacje z reflog-a są wyłącznie lokalne - jest to zapis zmian które wprowadzałeś w swoim repozytorium. Referencje nie będą takie same na kopii repozytorium u kogoś innego; a od razu po pierwszym sklonowaniu repozytorium, będziesz miał pusty reflog, ze względu na to, że żadna aktywność nie została wykonana. Uruchomienie `git show HEAD{2.months.ago}` zadziała tylko wówczas, gdy sklonowałeś swoje repozytorium przynajmniej dwa miesiące temu - jeżeli sklonowałeś je pięć minut temu, otrzymasz pusty wynik.

<!-- It’s important to note that the reflog information is strictly local — it’s a log of what you’ve done in your repository. The references won’t be the same on someone else’s copy of the repository; and right after you initially clone a repository, you’ll have an empty reflog, as no activity has occurred yet in your repository. Running `git show HEAD@{2.months.ago}` will work only if you cloned the project at least two months ago — if you cloned it five minutes ago, you’ll get no results. -->


## Referencje przodków

<!-- ## Ancestry References -->

Innym często używanym sposobem na wskazanie konkretnego commit-a jest wskazanie przodka. Jeżeli umieścisz znak `^` na końcu referencji, Git rozwinie to do rodzica tego commit-a. Załóżmy, że spojrzałeś na historię zmian w swoim projekcie:

<!-- The other main way to specify a commit is via its ancestry. If you place a `^` at the end of a reference, Git resolves it to mean the parent of that commit.
Suppose you look at the history of your project: -->

	$ git log --pretty=format:'%h %s' --graph
	* 734713b fixed refs handling, added gc auto, updated tests
	*   d921970 Merge commit 'phedders/rdocs'
	|\
	| * 35cfb2b Some rdoc changes
	* | 1c002dd added some blame and merge stuff
	|/
	* 1c36188 ignore *.gem
	* 9b29157 add open3_detach to gemspec file list

Następne, możesz zobaczyć poprzednią zmianę, poprzez użycie `HEAD^`, co oznacza "rodzic HEAD-a":

<!-- Then, you can see the previous commit by specifying `HEAD^`, which means "the parent of HEAD": -->

	$ git show HEAD^
	commit d921970aadf03b3cf0e71becdaab3147ba71cdef
	Merge: 1c002dd... 35cfb2b...
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 15:08:43 2008 -0800

	    Merge commit 'phedders/rdocs'

Możesz również określić liczbę po `^` - na przykład, `d921970^2` oznacza "drugi rodzic d921970". Taka składnia jest użyteczna podczas łączenia zmian, które mają więcej niż jednego rodzica. Pierwszym rodzicem jest gałąź na której byłeś podczas łączenia zmian, a drugim jest zmiana w gałęzi którą łączyłeś:

<!-- You can also specify a number after the `^` — for example, `d921970^2` means "the second parent of d921970." This syntax is only useful for merge commits, which have more than one parent. The first parent is the branch you were on when you merged, and the second is the commit on the branch that you merged in: -->

	$ git show d921970^
	commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Dec 11 14:58:32 2008 -0800

	    added some blame and merge stuff

	$ git show d921970^2
	commit 35cfb2b795a55793d7cc56a6cc2060b4bb732548
	Author: Paul Hedderly <paul+git@mjr.org>
	Date:   Wed Dec 10 22:22:03 2008 +0000

	    Some rdoc changes

Kolejnym wskaźnikiem przodka jest `~`. On również wskazuje na pierwszego rodzica, więc `HEAD~` i `HEAD^` są równoznaczne. Różnica zaczyna być widoczna po sprecyzowaniu liczby. `HEAD~2` oznacza "pierwszy rodzic pierwszego rodzica", lub inaczej "dziadek" - przemierza to pierwszych rodziców ilość razy którą wskażesz. Na przykład, w historii pokazanej wcześniej, `HEAD~3` będzie:

<!-- The other main ancestry specification is the `~`. This also refers to the first parent, so `HEAD~` and `HEAD^` are equivalent. The difference becomes apparent when you specify a number. `HEAD~2` means "the first parent of the first parent," or "the grandparent" — it traverses the first parents the number of times you specify. For example, in the history listed earlier, `HEAD~3` would be -->

	$ git show HEAD~3
	commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
	Author: Tom Preston-Werner <tom@mojombo.com>
	Date:   Fri Nov 7 13:47:59 2008 -0500

	    ignore *.gem

Może to być również zapisane jako `HEAD^^^`, co znowu daje pierwszego rodzica, pierwszego rodzica, pierwszego rodzica:

<!-- This can also be written `HEAD^^^`, which again is the first parent of the first parent of the first parent: -->

	$ git show HEAD^^^
	commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
	Author: Tom Preston-Werner <tom@mojombo.com>
	Date:   Fri Nov 7 13:47:59 2008 -0500

	    ignore *.gem

Możesz również łączyć obie składnie - możesz dostać drugiego rodzica poprzedniej referencji (zakładając że było to łączenie zmian) przy użyciu `HEAD~3^2`, i tak dalej.

<!-- You can also combine these syntaxes — you can get the second parent of the previous reference (assuming it was a merge commit) by using `HEAD~3^2`, and so on. -->

## Zakresy zmian

<!-- ## Commit Ranges -->

Teraz gdy możesz już wskazywać pojedyncze zmiany, sprawdźmy jak wskazać ich zakres. Jest to szczególnie przydatne podczas zarządzania gałęziami - w sytuacji, gdy masz dużą ilość gałęzi, możesz użyć wskaźnika zakresu zmian, aby odpowiedzieć na pytanie, w stylu "Jakie są zmiany na obecnej gałęzi, których jeszcze nie włączyłem do gałęzi głównej?"

<!-- Now that you can specify individual commits, let’s see how to specify ranges of commits. This is particularly useful for managing your branches — if you have a lot of branches, you can use range specifications to answer questions such as, "What work is on this branch that I haven’t yet merged into my main branch?" -->

### Podwójna kropka

<!-- ### Double Dot -->

Najczęściej używaną składnią wskazywania zakresu zmian jest podwójna kropka. Mówi ona Gitowi, aby rozwinął zakres zmian które są osiągalne z pierwszego commitu, ale nie są z drugiego. Na przykład, załóżmy że masz historię zmian która wygląda tak jak na rysunku 6-1.

<!-- The most common range specification is the double-dot syntax. This basically asks Git to resolve a range of commits that are reachable from one commit but aren’t reachable from another. For example, say you have a commit history that looks like Figure 6-1. -->


![](http://git-scm.com/figures/18333fig0601-tn.png)

Figure 6-1. Przykładowa historia dla wskazania zakresu zmian.

<!-- Figure 6-1. Example history for range selection. -->

Chcesz zobaczyć co z tego co znajduje się w Twojej gałęzi "experiment" nie zostało jeszcze włączone do gałęzi "master". Możesz poprosić Gita, aby pokazał Ci logi z informacjami o tych zmianach przy pomocy `master..experiment` - co oznacza "wszystkie zmiany dostępne z experiment które nie są dostępne przez master". Dla zachowania zwięzłości i przejrzystości w tych przykładach, użyję liter ze zmian znajdujących się na wykresie zamiast pełnego wyniku komendy, w kolejności w jakiej się pokażą:

<!-- You want to see what is in your experiment branch that hasn’t yet been merged into your master branch. You can ask Git to show you a log of just those commits with `master..experiment` — that means "all commits reachable by experiment that aren’t reachable by master." For the sake of brevity and clarity in these examples, I’ll use the letters of the commit objects from the diagram in place of the actual log output in the order that they would display: -->


	$ git log master..experiment
	D
	C

Jeżeli, z drugiej strony, chcesz zobaczyć odwrotne działanie - wszystkie zmiany z `master` których nie ma w `experiment` - możesz odwrócić nazwy gałęzi. `experiment..master` pokaże wszystko to z `master`, co nie jest dostępne z `experiment`:

<!-- If, on the other hand, you want to see the opposite — all commits in `master` that aren’t in `experiment` — you can reverse the branch names. `experiment..master` shows you everything in `master` not reachable from `experiment`: -->

	$ git log experiment..master
	F
	E

Jest to przydatne, jeżeli zamierzasz utrzymywać gałąź `experiment` zaktualizowaną, oraz przeglądać co będziesz integrował. Innym bardzo często używanym przykładem użycia tej składni jest sprawdzenie, co zamierzasz wypchnąć do zdalnego repozytorium:
 
<!-- This is useful if you want to keep the `experiment` branch up to date and preview what you’re about to merge in. Another very frequent use of this syntax is to see what you’re about to push to a remote: -->

	$ git log origin/master..HEAD

Ta komenda pokaże wszystkie zmiany z Twojej obecnej gałęzi, których nie ma w zdalnej gałęzi `master` w repozytorium. Jeżeli uruchomisz `git push`, a Twoja obecna gałąź śledzi `origin/master`, zmiany pokazane przez `git log origin/master..HEAD` to te, które będą wysłane na serwer.
Możesz również pominąć jedną ze stron tej składni, aby Git założył HEAD. Dla przykładu, możesz otrzymać takie same wyniki jak w poprzednim przykładzie wywołując `git log origin/master..` - Git wstawi HEAD jeżeli jednej ze stron brakuje.

<!-- This command shows you any commits in your current branch that aren’t in the `master` branch on your `origin` remote. If you run a `git push` and your current branch is tracking `origin/master`, the commits listed by `git log origin/master..HEAD` are the commits that will be transferred to the server.
You can also leave off one side of the syntax to have Git assume HEAD. For example, you can get the same results as in the previous example by typing `git log origin/master..` — Git substitutes HEAD if one side is missing. -->

### Wielokrotne punkty

<!-- ### Multiple Points -->

Składnie z dwiema kropkami jest użyteczna jako skrót; ale możesz chcieć wskazać więcej niż dwie gałęzie, jak na przykład zobaczenie które zmiany są w obojętnie której z gałęzi, ale nie są w gałęzi w której się obecnie znajdujesz. Git pozwala Ci na zrobienie tego poprzez użycie znaku `^`, lub opcji `--not` podanej przed referencją z której nie chcesz widzieć zmian. Dlatego też, te trzy komendy są równoznaczne:

<!-- The double-dot syntax is useful as a shorthand; but perhaps you want to specify more than two branches to indicate your revision, such as seeing what commits are in any of several branches that aren’t in the branch you’re currently on. Git allows you to do this by using either the `^` character or `-\-not` before any reference from which you don’t want to see reachable commits. Thus these three commands are equivalent: -->

	$ git log refA..refB
	$ git log ^refA refB
	$ git log refB --not refA

Jest to bardzo fajne, ponieważ przy użyciu tej składni możesz wskazać więcej niż dwie referencje w swoim zapytaniu, czego nie możesz osiągnąć przy pomocy składni z dwiema kropkami. Dla przykładu, jeżeli chcesz zobaczyć zmiany które są dostępne z `refA` lub `refB`, ale nie z `refC`, możesz użyć:

<!-- This is nice because with this syntax you can specify more than two references in your query, which you cannot do with the double-dot syntax. For instance, if you want to see all commits that are reachable from `refA` or `refB` but not from `refC`, you can type one of these: -->

	$ git log refA refB ^refC
	$ git log refA refB --not refC

Tworzy to bardzo użyteczną składnię zapytań, która powinna Ci pomóc dowiedzieć się, co jest w Twoich gałęziach.

<!-- This makes for a very powerful revision query system that should help you figure out what is in your branches. -->

### Potrójna kropka

<!-- ### Triple Dot -->

Ostatnią z głównych składni zakresu jest składnia z trzema kropkami, która wskazuje na wszystkie zmiany które są dostępne z jednej z dwóch referencji, ale nie z obu. Spójrz ponownie na przykład z historią zmian na rysunku 6-1. 
Jeżeli chcesz zobaczyć co jest zmienione w `master` lub `experiment`, poza wspólnymi, możesz uruchomić

<!-- The last major range-selection syntax is the triple-dot syntax, which specifies all the commits that are reachable by either of two references but not by both of them. Look back at the example commit history in Figure 6-1.
If you want to see what is in `master` or `experiment` but not any common references, you can run -->

	$ git log master...experiment
	F
	E
	D
	C

Ponownie, otrzymasz normalny wynik `log`, ale pokazujący tylko informacje o czterech zmianach, występujących w normalnej kolejności.

<!-- Again, this gives you normal `log` output but shows you only the commit information for those four commits, appearing in the traditional commit date ordering. -->

Często używaną opcją do komendy `log` jest `--left-right`, która pokazuje po której stronie każda zmiana występuje. Pozwala to na uzyskanie użyteczniejszych informacji:

<!-- A common switch to use with the `log` command in this case is `-\-left-right`, which shows you which side of the range each commit is in. This helps make the data more useful: -->

	$ git log --left-right master...experiment
	< F
	< E
	> D
	> C

Przy pomocy tych narzędzi, możesz dużo łatwiej wskazać którą zmianę lub zmiany chcesz zobaczyć.

<!-- With these tools, you can much more easily let Git know what commit or commits you want to inspect. -->
