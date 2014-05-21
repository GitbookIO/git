# Git i Subversion

<!-- # Git and Subversion -->

Obecnie, większość projektów open-source i duża ilość projektów korporacyjnych używają Subversion do zarządzania kodem źródłowym. Jest to najpopularniejszy system kontroli wersji i jest w użyciu od prawie dekady. Jest również bardzo podobny do CVS, który przed nim, był najczęściej na świecie używanym systemem kontroli wersji. 

<!-- Currently, the majority of open source development projects and a large number of corporate projects use Subversion to manage their source code. It’s the most popular open source VCS and has been around for nearly a decade. It’s also very similar in many ways to CVS, which was the big boy of the source-control world before that. -->

Jedną z świetnych funkcjonalności Gita jest dwukierunkowa bramka do Subversion, nazywana `git svn`. To narzędzie pozwala Ci na używanie Gita jak normalnego klienta do serwera Subversion, możesz więc używać wszystkich lokalnych funkcjonalności Gita, aby potem wypchnąć zmiany do Subversion, tak jakbyś używał go lokalnie. Oznacza to, że możesz lokalnie tworzyć gałęzie i łączyć je, używać przechowalni, używać zmiany bazy i wybiórczego pobierania zmian itd, w czasie gdy inni programiści będą kontynuowali swoją pracę po staremu. Jest to dobry sposób na wprowadzenie Gita do środowiska korporacyjnego, zwiększając w ten sposób wydajność pracy, w czasie gdy będziesz lobbował za przeniesieniem infrastruktury na Gita w całości. Bramka Subversion, jest świetnym wprowadzeniem do świata DVCS.

<!-- One of Git’s great features is a bidirectional bridge to Subversion called `git svn`. This tool allows you to use Git as a valid client to a Subversion server, so you can use all the local features of Git and then push to a Subversion server as if you were using Subversion locally. This means you can do local branching and merging, use the staging area, use rebasing and cherry-picking, and so on, while your collaborators continue to work in their dark and ancient ways. It’s a good way to sneak Git into the corporate environment and help your fellow developers become more efficient while you lobby to get the infrastructure changed to support Git fully. The Subversion bridge is the gateway drug to the DVCS world. -->

## Git svn

Podstawową komendą w Gitcie do wszystkich zadań łączących się z Subversion jest `git svn`. Wszystkie komendy je poprzedzasz. Przyjmuje ona sporo parametrów, nauczysz się więc tych najpopularniejszych na przykładach kilku małych przepływów pracy.

<!-- The base command in Git for all the Subversion bridging commands is `git svn`. You preface everything with that. It takes quite a few commands, so you’ll learn about the common ones while going through a few small workflows. -->

Warto zaznaczyć, że gdy używasz `git svn` współpracujesz z Subversion, który jest systemem mniej wyszukanym niż Git. Chociaż możesz z łatwością robić lokalne gałęzie i ich łączenie, generalnie najlepiej trzymać swoją historię zmian tak bardzo liniową jak to tylko możliwe, poprzez wykonywanie "rebase" i unikanie wykonywania rzeczy takich jak jednoczesne używanie zdalnego repozytorium Git.

<!-- It’s important to note that when you’re using `git svn`, you’re interacting with Subversion, which is a system that is far less sophisticated than Git. Although you can easily do local branching and merging, it’s generally best to keep your history as linear as possible by rebasing your work and avoiding doing things like simultaneously interacting with a Git remote repository. -->

Nie nadpisuj historii zmian i nie wypychaj zmian ponownie, nie wypychaj również jednocześnie do repozytorium Gita, aby współpracować z programistami. Subversion może mieć jedynie jedną liniową historię i bardzo łatwo wprowadzić go w błąd. Jeżeli pracujesz w zespole, w którym część osób używa SVN a inni Gita, upewnij się, że wszyscy używają serwera SVN do wymiany danych - w ten sposób życie będzie łatwiejsze.

<!-- Don’t rewrite your history and try to push again, and don’t push to a parallel Git repository to collaborate with fellow Git developers at the same time. Subversion can have only a single linear history, and confusing it is very easy. If you’re working with a team, and some are using SVN and others are using Git, make sure everyone is using the SVN server to collaborate — doing so will make your life easier. -->

## Konfiguracja

<!-- ## Setting Up -->

Aby zademonstrować tą funkcjonalność, potrzebujesz zwykłego repozytorium SVN z możliwością zapisu. Jeżeli chcesz skopiować te przykłady, będziesz musiał mieć kopię tego testowego repozytorium. Aby zrobić do jak najprościej, użyj narzędzia `svnsync`, które jest dostępne w nowszych wersjach Subversion - powinno być dystrybuowane od wersji 1.4. Dla naszych testów, stworzyłem nowe repozytorium Subversion na serwisie Google code, zawierające część projektu `protobuf`, które jest narzędziem umożliwiającym kodowanie ustrukturyzowanych danych na potrzeby transmisji w sieci.

<!-- To demonstrate this functionality, you need a typical SVN repository that you have write access to. If you want to copy these examples, you’ll have to make a writeable copy of my test repository. In order to do that easily, you can use a tool called `svnsync` that comes with more recent versions of Subversion — it should be distributed with at least 1.4. For these tests, I created a new Subversion repository on Google code that was a partial copy of the `protobuf` project, which is a tool that encodes structured data for network transmission. -->

Na początek, musisz stworzyć nowe lokalne repozytorium Subversion:

<!-- To follow along, you first need to create a new local Subversion repository: -->

	$ mkdir /tmp/test-svn
	$ svnadmin create /tmp/test-svn

Następnie, umożliw wszystkim użytkownikom na zmianę revprops - najłatwiej dodać skrypt pre-revprop-change, który zawsze zwraca wartość 0:

<!-- Then, enable all users to change revprops — the easy way is to add a pre-revprop-change script that always exits 0: -->

	$ cat /tmp/test-svn/hooks/pre-revprop-change
	#!/bin/sh
	exit 0;
	$ chmod +x /tmp/test-svn/hooks/pre-revprop-change

Możesz teraz zsynchronizować ten projekt na lokalny komputer poprzez wywołanie `svnsync init` z podanym repozytorium źródłowym i docelowym.

<!-- You can now sync this project to your local machine by calling `svnsync init` with the to and from repositories. -->

	$ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

Ustawia to właściwości, tak aby można było uruchomić komendę "sync". Następnie możesz sklonować kod poprzez wywołanie

<!-- This sets up the properties to run the sync. You can then clone the code by running -->

	$ svnsync sync file:///tmp/test-svn
	Committed revision 1.
	Copied properties for revision 1.
	Committed revision 2.
	Copied properties for revision 2.
	Committed revision 3.
	...

Chociaż ta operacja może zająć zaledwie kilka minut, jeżeli będziesz próbował skopiować oryginalne repozytorium do innego zdalnego zamiast do lokalnego, cały proces może trwać nawet godzinę, bez względu na to, że jest tam mniej niż 100 commitów. Subversion musi sklonować każdą rewizję osobno i następnie wypchnąć ją ponownie do innego repozytorium - jest to strasznie nieefektywne, ale jest to jedyna łatwa droga aby to zrobić.

<!-- Although this operation may take only a few minutes, if you try to copy the original repository to another remote repository instead of a local one, the process will take nearly an hour, even though there are fewer than 100 commits. Subversion has to clone one revision at a time and then push it back into another repository — it’s ridiculously inefficient, but it’s the only easy way to do this. -->


## Pierwsze kroki

<!-- ## Getting Started -->

Teraz, gdy masz już lokalne repozytorium Subversion z uprawnieniami do zapisu, możesz zobaczyć jak się z nim pracuje. Rozpocznij za pomocą komendy `git svn clone`, która zaimportuje całe repozytorium Subversion do lokalnego repozytorium Gita. Pamiętaj że, jeżeli importujesz z prawdziwego zdalnego repozytorium, powinieneś podmienić `file:///tmp/test-svn` na adres URL tego repozytorium:

<!-- Now that you have a Subversion repository to which you have write access, you can go through a typical workflow. You’ll start with the `git svn clone` command, which imports an entire Subversion repository into a local Git repository. Remember that if you’re importing from a real hosted Subversion repository, you should replace the `file:///tmp/test-svn` here with the URL of your Subversion repository: -->

	$ git svn clone file:///tmp/test-svn -T trunk -b branches -t tags
	Initialized empty Git repository in /Users/schacon/projects/testsvnsync/svn/.git/
	r1 = b4e387bc68740b5af56c2a5faf4003ae42bd135c (trunk)
	      A    m4/acx_pthread.m4
	      A    m4/stl_hash.m4
	...
	r75 = d1957f3b307922124eec6314e15bcda59e3d9610 (trunk)
	Found possible branch point: file:///tmp/test-svn/trunk => \
	    file:///tmp/test-svn /branches/my-calc-branch, 75
	Found branch parent: (my-calc-branch) d1957f3b307922124eec6314e15bcda59e3d9610
	Following parent with do_switch
	Successfully followed parent
	r76 = 8624824ecc0badd73f40ea2f01fce51894189b01 (my-calc-branch)
	Checked out HEAD:
	 file:///tmp/test-svn/branches/my-calc-branch r76


Uruchomienie tej komendy jest równoznaczne z dwiema komendami - `git svn init` oraz `git svn fetch` - wykonanymi na adresie URL który podałeś. Może to chwilę zająć. Testowy projekt ma tylko około 75 commitów, a kod nie jest duży, więc nie potrwa to długo. Jednak Git musi sprawdzić każdą wersję, po kolei i zapisać ją osobno. W projektach które mają setki lub tysiące commitów, może to zająć kilka godzin, a nawet dni.

<!-- This runs the equivalent of two commands — `git svn init` followed by `git svn fetch` — on the URL you provide. This can take a while. The test project has only about 75 commits and the codebase isn’t that big, so it takes just a few minutes. However, Git has to check out each version, one at a time, and commit it individually. For a project with hundreds or thousands of commits, this can literally take hours or even days to finish. -->

Część `-T trunk -b branches -t tags` mówi Gitowi, że to repozytorium Subversion jest zgodne z przyjętymi konwencjami tworzenia gałęzi i tagów. Jeżeli inaczej nazwiesz swoje katalogi trunk, branches i tags, powinieneś zmienić te opcje. Ze względu na to, że jest to bardzo popularne podejście, możesz całą tą cześć zamienić opcją `-s`, która oznacza standardowy układ projektu i zakłada wszystkie te opcje. Poniższa komenda jest równoważna z poprzednią:

<!-- The `-T trunk -b branches -t tags` part tells Git that this Subversion repository follows the basic branching and tagging conventions. If you name your trunk, branches, or tags differently, you can change these options. Because this is so common, you can replace this entire part with `-s`, which means standard layout and implies all those options. The following command is equivalent: -->

	$ git svn clone file:///tmp/test-svn -s

W tym momencie, powinieneś mieć poprawne repozytorium Gita, które ma zaimportowane wszystkie gałęzie i tagi:

<!-- At this point, you should have a valid Git repository that has imported your branches and tags: -->

	$ git branch -a
	* master
	  my-calc-branch
	  tags/2.0.2
	  tags/release-2.0.1
	  tags/release-2.0.2
	  tags/release-2.0.2rc1
	  trunk

Warto zaznaczyć, że to narzędzie używa innego schematu nazw do zdalnych gałęzi. Kiedy klonujesz tradycyjne repozytorium Gita, otrzymujesz wszystkie gałęzie które były na tym zdalnym serwerze dostępne lokalnie, pod nazwami takimi jak `origin/[gałąź]` - poprzedzone nazwą zdalnego repozytorium. Jednakże, `git svn` zakłada że nie masz wielu zdalnych repozytoriów i zapisuje wszystkie swoje referencje wskazujące na zdalny serwer bez poprzedzania ich nazwą. Możesz użyć komendy `show-ref`, aby zobaczyć wszystkie referencje:

<!-- It’s important to note how this tool namespaces your remote references differently. When you’re cloning a normal Git repository, you get all the branches on that remote server available locally as something like `origin/[branch]` - namespaced by the name of the remote. However, `git svn` assumes that you won’t have multiple remotes and saves all its references to points on the remote server with no namespacing. You can use the Git plumbing command `show-ref` to look at all your full reference names: -->

	$ git show-ref
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
	aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
	03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
	50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
	4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
	1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
	1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

Normalne repozytorium Gita wygląda tak jak to:

<!-- A normal Git repository looks more like this: -->

	$ git show-ref
	83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
	3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
	0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
	25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

Masz dwa zdalne serwery: jeden nazwany `gitserver` z gałęzią `master`; oraz drugi nazwany `origin` z dwiema gałęziami, `master` i `testing`.

<!-- You have two remote servers: one named `gitserver` with a `master` branch; and another named `origin` with two branches, `master` and `testing`. -->

Zauważ, jak w przykładowym imporcie stworzonym przez `git svn` wyglądają zdalne referencje, tagi zostały dodane jako zdalne gałęzie, a nie normalne tagi. Twój import Subversion wygląda tak, jakby miał dodany zdalny serwer pod nazwą "tags", który zawiera gałęzie.

<!-- Notice how in the example of remote references imported from `git svn`, tags are added as remote branches, not as real Git tags. Your Subversion import looks like it has a remote named tags with branches under it. -->

## Wgrywanie zmian do Subversion

<!-- ## Committing Back to Subversion -->

Teraz gdy masz już działające repozytorium, możesz wprowadzić zmiany w projekcie i wypchnąć swoje commity do zdalnego serwera, używając Gita jako klienta SVN. Jeżeli zmodyfikujesz jeden z plików i commitniesz zmiany, będziesz miał je widoczne w lokalnym repozytorium Gita, ale nie istniejące na serwerze Subversion:

<!-- Now that you have a working repository, you can do some work on the project and push your commits back upstream, using Git effectively as a SVN client. If you edit one of the files and commit it, you have a commit that exists in Git locally that doesn’t exist on the Subversion server: -->

	$ git commit -am 'Adding git-svn instructions to the README'
	[master 97031e5] Adding git-svn instructions to the README
	 1 files changed, 1 insertions(+), 1 deletions(-)

Następnie, powinieneś wypchnąć zmiany. Zauważ jak to zmienia sposób w jaki pracujesz w Subversion - możesz wprowadzić kilka commitów bez dostępu do sieci, a potem wypchnąć je wszystkie w jednym momencie do serwera Subversion. Aby wypchnąć na serwer Subversion, uruchamiasz komendę `git svn dcommit`:

<!-- Next, you need to push your change upstream. Notice how this changes the way you work with Subversion — you can do several commits offline and then push them all at once to the Subversion server. To push to a Subversion server, you run the `git svn dcommit` command: -->

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r79
	       M      README.txt
	r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Pobierze ona wszystkie commity które wprowadziłeś do kodu w stosunku do wersji znajdującej się na serwerze Subversion, wykona dla każdego z nich commit, a następnie przepisze Twój lokalny commit, tak aby zawierał unikalny identyfikator. Jest to bardzo ważne, ponieważ oznacza to, że wszystkie sumy SHA-1 dla tych commitów zostaną zmienione. Częściowo z tego względu, używanie zdalnych repozytoriów Gita jednocześnie z serwerem Subversion nie jest dobrym pomysłem. Jeżeli spojrzysz na ostatni commit, zauważysz dodaną nową informację `git-svn-id`:

<!-- This takes all the commits you’ve made on top of the Subversion server code, does a Subversion commit for each, and then rewrites your local Git commit to include a unique identifier. This is important because it means that all the SHA-1 checksums for your commits change. Partly for this reason, working with Git-based remote versions of your projects concurrently with a Subversion server isn’t a good idea. If you look at the last commit, you can see the new `git-svn-id` that was added: -->

	$ git log -1
	commit 938b1a547c2cc92033b74d32030e86468294a5c8
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sat May 2 22:06:44 2009 +0000

	    Adding git-svn instructions to the README

	    git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

Widać również, że suma SHA która oryginalnie rozpoczynała się od `97031e5`, po commicie zaczyna się od `938b1a5`. Jeżeli chcesz wypchnąć zmiany zarówno do serwera Git jak i Subversion, musisz najpierw wykonać `dcommit` do serwera Subversion, ponieważ ta akcja zmieni dane commitów. 

<!-- Notice that the SHA checksum that originally started with `97031e5` when you committed now begins with `938b1a5`. If you want to push to both a Git server and a Subversion server, you have to push (`dcommit`) to the Subversion server first, because that action changes your commit data. -->

## Pobieranie nowych zmian

<!-- ## Pulling in New Changes -->

Jeżeli współpracujesz z innymi programistami, a jeden z Was w pewnym momencie wypchnie jakieś zmiany, drugi może napotkać konflikt podczas próby wypchnięcia swoich zmian. Ta zmiana będzie odrzucona, do czasu włączenia tamtych. W `git svn`, wygląda to tak: 

<!-- If you’re working with other developers, then at some point one of you will push, and then the other one will try to push a change that conflicts. That change will be rejected until you merge in their work. In `git svn`, it looks like this: -->

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	Merge conflict during commit: Your file or directory 'README.txt' is probably \
	out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
	core/git-svn line 482

Aby rozwiązać tą sytuację, możesz uruchomić `git svn rebase`, która pobiera z serwera wszystkie zmiany których jeszcze nie masz, a następnie nakłada Twoje zmiany na te który były na serwerze:

<!-- To resolve this situation, you can run `git svn rebase`, which pulls down any changes on the server that you don’t have yet and rebases any work you have on top of what is on the server: -->

	$ git svn rebase
	       M      README.txt
	r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
	First, rewinding head to replay your work on top of it...
	Applying: first user change

Teraz, wszystkie Twoje zmiany są nałożone na górze tego co jest na serwerze Subversion, możesz więc z powodzeniem wykonać `dcommit`:

<!-- Now, all your work is on top of what is on the Subversion server, so you can successfully `dcommit`: -->

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      README.txt
	Committed r81
	       M      README.txt
	r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Warto zapamiętać, że inaczej niż w Gitcie, który wymaga abyś włączył zmiany z serwera których nie masz lokalnie przez każdym ich wypchnięciem, `git svn` wymaga abyś to zrobił, tylko w sytuacji gdy zmiana powoduje konflikt. Jeżeli ktoś inny wypchnie zmiany wprowadzone w jednym pliku, a Ty w innym, komenda `dcommit` zadziała poprawnie:

<!-- It’s important to remember that unlike Git, which requires you to merge upstream work you don’t yet have locally before you can push, `git svn` makes you do that only if the changes conflict. If someone else pushes a change to one file and then you push a change to another file, your `dcommit` will work fine: -->

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      configure.ac
	Committed r84
	       M      autogen.sh
	r83 = 8aa54a74d452f82eee10076ab2584c1fc424853b (trunk)
	       M      configure.ac
	r84 = cdbac939211ccb18aa744e581e46563af5d962d0 (trunk)
	W: d2f23b80f67aaaa1f6f5aaef48fce3263ac71a92 and refs/remotes/trunk differ, \
	  using rebase:
	:100755 100755 efa5a59965fbbb5b2b0a12890f1b351bb5493c18 \
	  015e4c98c482f0fa71e4d5434338014530b37fa6 M   autogen.sh
	First, rewinding head to replay your work on top of it...
	Nothing to do.

Warto to zapamiętać, że wynikiem będzie projekt w stanie, w którym nie istniał on na żadnym z Twoich komputerów w czasie wypychania zmian. Jeżeli zmiany nie są kompatybilne, ale nie powodują konfliktu, możesz otrzymać błędy trudne do zdiagnozowania. Jest to inne podejście, niż to znane z Gita - w nim, możesz w pełni przetestować projekt lokalnie, przed upublicznieniem zmian, podczas gdy w SVN, nigdy nie możesz być pewien czy stan projektu przed commitem i po nim są identyczne. 

<!-- This is important to remember, because the outcome is a project state that didn’t exist on either of your computers when you pushed. If the changes are incompatible but don’t conflict, you may get issues that are difficult to diagnose. This is different than using a Git server — in Git, you can fully test the state on your client system before publishing it, whereas in SVN, you can’t ever be certain that the states immediately before commit and after commit are identical. -->

Powinieneś również uruchamiać tę komendę, aby pobierać zmiany z serwera Subversion, nawet jeżeli nie jesteś jeszcze gotowy do zapisania swoich. Możesz uruchomić `git svn fetch`, aby pobrać nowe dane, `git svn rebase` zrobi to samo, jednak również nałoży Twoje lokalne modyfikacje.

<!-- You should also run this command to pull in changes from the Subversion server, even if you’re not ready to commit yourself. You can run `git svn fetch` to grab the new data, but `git svn rebase` does the fetch and then updates your local commits. -->

	$ git svn rebase
	       M      generate_descriptor_proto.sh
	r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
	First, rewinding head to replay your work on top of it...
	Fast-forwarded master to refs/remotes/trunk.

Uruchamianie `git svn rebase` co jakiś czas, pozwoli Ci upewnić się, że masz aktualną wersję projektu. Musisz jednak być pewien, że masz niezmodyfikowany katalog roboczy w czasie uruchamiania tej komendy. Jeżeli masz jakieś lokalne zmiany, musisz albo użyć schowka w celu ich zapisania, albo tymczasowo commitnąć je zanim uruchomisz `git svn rebase` - w przeciwnym wypadku, komenda zatrzyma się, jeżeli zobaczy że wykonanie "rebase" będzie skutkowało konfliktem.

<!-- Running `git svn rebase` every once in a while makes sure your code is always up to date. You need to be sure your working directory is clean when you run this, though. If you have local changes, you must either stash your work or temporarily commit it before running `git svn rebase` — otherwise, the command will stop if it sees that the rebase will result in a merge conflict. -->


## Problemy z gałęziami Gita

<!-- ## Git Branching Issues -->

Jak już przyzwyczaisz się do pracy z Gitem, z pewnością będziesz tworzył gałęzie tematyczne, pracował na nich, a następnie włączał je. Jeżeli wypychasz zmiany do serwera Subversion za pomocą komendy `git svn`, możesz chcieć wykonać "rebase" na wszystkich swoich zmianach włączając je do jednej gałęzi, zamiast łączyć gałęzie razem. Powodem takiego sposobu działania jest to, że Subversion ma liniową historię i nie obsługuje łączenia zmian w taki sposób jak Git, więc `git svn` będzie podążał tylko za pierwszym rodzicem podczas konwertowania migawki do commitu Subversion.

<!-- When you’ve become comfortable with a Git workflow, you’ll likely create topic branches, do work on them, and then merge them in. If you’re pushing to a Subversion server via git svn, you may want to rebase your work onto a single branch each time instead of merging branches together. The reason to prefer rebasing is that Subversion has a linear history and doesn’t deal with merges like Git does, so git svn follows only the first parent when converting the snapshots into Subversion commits. -->

Załóżmy, że Twoja historia wygląda tak: stworzyłeś gałąź `experiment`, wykonałeś dwa commity, a następnie włączyłeś je do `master`. Kiedy wykonasz `dcommit`, zobaczysz wynik taki jak:

<!-- Suppose your history looks like the following: you created an `experiment` branch, did two commits, and then merged them back into `master`. When you `dcommit`, you see output like this: -->

	$ git svn dcommit
	Committing to file:///tmp/test-svn/trunk ...
	       M      CHANGES.txt
	Committed r85
	       M      CHANGES.txt
	r85 = 4bfebeec434d156c36f2bcd18f4e3d97dc3269a2 (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk
	COPYING.txt: locally modified
	INSTALL.txt: locally modified
	       M      COPYING.txt
	       M      INSTALL.txt
	Committed r86
	       M      INSTALL.txt
	       M      COPYING.txt
	r86 = 2647f6b86ccfcaad4ec58c520e369ec81f7c283c (trunk)
	No changes between current HEAD and refs/remotes/trunk
	Resetting to the latest refs/remotes/trunk

Uruchamianie `dcommit` na gałęzi z połączoną historią działa poprawnie, z wyjątkiem tego, że patrząc na historię w Gitcie, zobaczysz że nie nadpisał on żadnego commitów które wykonałeś w gałęzi `experiment` - zamiast tego, wszystkie te zmiany pojawiły się w pojedynczym commicie SVN.

<!-- Running `dcommit` on a branch with merged history works fine, except that when you look at your Git project history, it hasn’t rewritten either of the commits you made on the `experiment` branch — instead, all those changes appear in the SVN version of the single merge commit. -->

Kiedy ktoś inny sklonuje te zmiany, zobaczy tylko jeden commit z włączonymi do niego wszystkimi zmianami; nie zobaczy danych wskazujących na to, skąd dany commit przyszedł, ani kiedy został wprowadzony.

<!-- When someone else clones that work, all they see is the merge commit with all the work squashed into it; they don’t see the commit data about where it came from or when it was committed. -->

## Gałęzie w Subversion

<!-- ## Subversion Branching -->

Tworzenie gałęzi w Subversion nie działa tak samo jak w Gitcie; jeżeli możesz postaraj się unikać ich, będzie to najlepsze. Możesz jednak stworzyć i zapisać zmiany do gałęzi w Subversion za pomocą `git svn`.

<!-- Branching in Subversion isn’t the same as branching in Git; if you can avoid using it much, that’s probably best. However, you can create and commit to branches in Subversion using git svn. -->

### Tworzenie nowej gałęzi w SVN

<!-- ### Creating a New SVN Branch -->

Aby stworzyć nową gałąź w Subversion, uruchom komendę `git svn branch [nazwagałęzi]`:

<!-- To create a new branch in Subversion, you run `git svn branch [branchname]`: -->

	$ git svn branch opera
	Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
	Found possible branch point: file:///tmp/test-svn/trunk => \
	  file:///tmp/test-svn/branches/opera, 87
	Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
	Following parent with do_switch
	Successfully followed parent
	r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

Jest to odpowiednik komendy `svn copy trunk branches/opera` z Subversion, która wykonywana jest po stronie serwera Subversion. Trzeba zauważyć, że nie przełączy ona Cię na tą gałąź; jeżeli wykonasz commit w tym momencie, pójdzie on do `trunk` na serwerze, a nie `opera`.

<!-- This does the equivalent of the `svn copy trunk branches/opera` command in Subversion and operates on the Subversion server. It’s important to note that it doesn’t check you out into that branch; if you commit at this point, that commit will go to `trunk` on the server, not `opera`. -->

## Zmienianie aktywnych gałęzi

<!-- ## Switching Active Branches -->

Git znajduje gałąź do której idą dane z dcommit, poprzez sprawdzenie ostatniej zmiany w każdej z gałęzi Subversion w Twojej historii - powinieneś mieć tylko jedną i powinna ona być tą ostatnią, zawierającą `git-svn-id` w historii obecnej gałęzi.

<!-- Git figures out what branch your dcommits go to by looking for the tip of any of your Subversion branches in your history — you should have only one, and it should be the last one with a `git-svn-id` in your current branch history. -->

Jeżeli chcesz pracować na więcej niż jednej gałęzi jednocześnie, możesz ustawić lokalne gałęzie dla `dcommit` na konkretne gałęzie Subversion poprzez utworzenie ich z pierwszego commita Subversion dla tej gałęzi. Jeżeli chcesz stworzyć gałąź `opera` na której będziesz mógł oddzielnie pracować, uruchom:

<!-- If you want to work on more than one branch simultaneously, you can set up local branches to `dcommit` to specific Subversion branches by starting them at the imported Subversion commit for that branch. If you want an `opera` branch that you can work on separately, you can run -->

	$ git branch opera remotes/opera

Teraz, gdy zechcesz włączyć gałąź `opera` do `trunk` (czyli swojej gałęzi `master`), możesz to zrobić za pomocą zwykłego `git merge`. Ale musisz podać opisową treść komentarza (za pomocą `-m`), lub komentarz zostanie ustawiony na "Merge branch opera", co nie jest zbyt użyteczne.

<!-- Now, if you want to merge your `opera` branch into `trunk` (your `master` branch), you can do so with a normal `git merge`. But you need to provide a descriptive commit message (via `-m`), or the merge will say "Merge branch opera" instead of something useful. -->

Zapamiętaj, że pomimo tego, że używasz `git merge` do tej operacji, a łączenie będzie prostsze niż byłoby w Subversion (ponieważ Git automatycznie wykryje prawidłowy punkt wyjściowy podczas łączenia), nie jest to zwykłe zatwierdzenie Git merge. Musisz wypchnąć te dane z powrotem do serwera Subversion, który nie potrafi obsłużyć zmian mających więcej niż jednego rodzica; więc, po wypchnięciu, będzie on wyglądał jak pojedynczy commit z złączonymi wszystkimi zmianami z tej gałęzi. Po włączeniu zmian z jednej gałęzi do drugiej, nie możesz w łatwy sposób wrócić i kontynuować pracy, jak przywykłeś to robić w Gitcie. Komenda `dcommit` którą uruchamiasz, kasuje wszystkie informacje mówiące o tym, którą gałąź włączyłeś, więc kolejne próby włączenie zmian będę błędne - komenda `dcommit` sprawia, że `git merge` wygląda tak, jakbyś uruchomił `git merge --squash`. Niestety, nie ma dobrego sposobu na ominięcie tego problemu - Subversion nie może zachować tych informacji, więc zawsze będziesz ograniczony tym co Subversion może zaoferować, w projektach w których używasz go jako swojego serwera. Aby uniknąć tych problemów, powinieneś usunąć lokalną gałąź (w tym wypadku `opera`) po włączeniu jej do trunka. 

<!-- Remember that although you’re using `git merge` to do this operation, and the merge likely will be much easier than it would be in Subversion (because Git will automatically detect the appropriate merge base for you), this isn’t a normal Git merge commit. You have to push this data back to a Subversion server that can’t handle a commit that tracks more than one parent; so, after you push it up, it will look like a single commit that squashed in all the work of another branch under a single commit. After you merge one branch into another, you can’t easily go back and continue working on that branch, as you normally can in Git. The `dcommit` command that you run erases any information that says what branch was merged in, so subsequent merge-base calculations will be wrong — the dcommit makes your `git merge` result look like you ran `git merge -\-squash`. Unfortunately, there’s no good way to avoid this situation — Subversion can’t store this information, so you’ll always be crippled by its limitations while you’re using it as your server. To avoid issues, you should delete the local branch (in this case, `opera`) after you merge it into trunk. -->

## Komendy Subversion

<!-- ## Subversion Commands -->

`git svn` dodaje kilka komend ułatwiających przejście na Gita, poprzez umożliwienie używania funkcjonalności podobnych do tych, do których przywykłeś w Subversion. Poniżej zobaczysz kilka komend, które umożliwią Ci pracę z Subversion po staremu.

<!-- The `git svn` toolset provides a number of commands to help ease the transition to Git by providing some functionality that’s similar to what you had in Subversion. Here are a few commands that give you what Subversion used to. -->

### Historia zmian taka jak w SVN

<!-- ### SVN Style History -->

Jeżeli przywykłeś do Subversion i chciałbyś zobaczyć historię projektu w takim samym stylu jak SVN ją pokazuje, możesz uruchomić komendę `git svn log`, aby przedstawić ją w ten sposób:

<!-- If you’re used to Subversion and want to see your history in SVN output style, you can run `git svn log` to view your commit history in SVN formatting: -->

	$ git svn log
	------------------------------------------------------------------------
	r87 | schacon | 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009) | 2 lines

	autogen change

	------------------------------------------------------------------------
	r86 | schacon | 2009-05-02 16:00:21 -0700 (Sat, 02 May 2009) | 2 lines

	Merge branch 'experiment'

	------------------------------------------------------------------------
	r85 | schacon | 2009-05-02 16:00:09 -0700 (Sat, 02 May 2009) | 2 lines

	updated the changelog

Powinieneś wiedzieć o dwóch ważnych rzeczach związanych z `git svn log`. Po pierwsze, działa on w trybie offline, inaczej niż prawdziwa komenda `svn log`, która odpytuje się serwera Subversion o dane. Po drugie, pokazuje ona tylko zmiany które zostały zapisane na serwerze Subversion. Lokalne commity, których nie wypchnąłeś przez dcommit nie pokażą się; jak również commity które inne osoby w międzyczasie wprowadziły. Pokazuje ona ostatnio znany stan, który jest na serwerze Subversion.

<!-- You should know two important things about `git svn log`. First, it works offline, unlike the real `svn log` command, which asks the Subversion server for the data. Second, it only shows you commits that have been committed up to the Subversion server. Local Git commits that you haven’t dcommited don’t show up; neither do commits that people have made to the Subversion server in the meantime. It’s more like the last known state of the commits on the Subversion server. -->

### Adnotacje SVN

<!-- ### SVN Annotation -->

Tak jak komenda `git svn log` symuluje działanie `svn log` w trybie bez dostępu do sieci, możesz otrzymać równoważny wynik `svn annotate` poprzez uruchomienie `git svn blame [PLIK]`. Wygląda on tak:

<!-- Much as the `git svn log` command simulates the `svn log` command offline, you can get the equivalent of `svn annotate` by running `git svn blame [FILE]`. The output looks like this: -->

	$ git svn blame README.txt
	 2   temporal Protocol Buffers - Google's data interchange format
	 2   temporal Copyright 2008 Google Inc.
	 2   temporal http://code.google.com/apis/protocolbuffers/
	 2   temporal
	22   temporal C++ Installation - Unix
	22   temporal =======================
	 2   temporal
	79    schacon Committing in git-svn.
	78    schacon
	 2   temporal To build and install the C++ Protocol Buffer runtime and the Protocol
	 2   temporal Buffer compiler (protoc) execute the following:
	 2   temporal

Znowu, nie pokaże on zmian które zrobiłeś lokalnie w Gitcie, lub które zostały wypchnięte na serwer Subversion w międzyczasie.

<!-- Again, it doesn’t show commits that you did locally in Git or that have been pushed to Subversion in the meantime. -->

### Informacje o serwerze SVN

<!-- ### SVN Server Information -->

Możesz również otrzymać takie same informacje jak te pokazywane przez `svn info`, po uruchomieniu `git svn info`:

<!-- You can also get the same sort of information that `svn info` gives you by running `git svn info`: -->

	$ git svn info
	Path: .
	URL: https://schacon-test.googlecode.com/svn/trunk
	Repository Root: https://schacon-test.googlecode.com/svn
	Repository UUID: 4c93b258-373f-11de-be05-5f7a86268029
	Revision: 87
	Node Kind: directory
	Schedule: normal
	Last Changed Author: schacon
	Last Changed Rev: 87
	Last Changed Date: 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009)

Ta komenda, tak samo jak `blame` i `log` działa w trybie offline, pokazuje również tylko dane, które są zgodne ze stanem otrzymanym podczas ostatniej komunikacji z serwerem Subversion.

<!-- This is like `blame` and `log` in that it runs offline and is up to date only as of the last time you communicated with the Subversion server.-->

### Ignorowanie tego co ignoruje Subversion

<!-- ### Ignoring What Subversion Ignores -->

Gdy sklonujesz repozytorium Subversion, które ma ustawione właściwości `svn:ignore`, będziesz chciał ustawić analogiczne wpisy w `.gitignore`, tak abyś nie zatwierdzał plików których nie powinieneś. `git svn` ma dwie komendy które są przy tym pomocne. Pierwszą z nich jest `git svn create-ignore`, która automatycznie tworzy odpowiednie pliki `.gitignore` za Ciebie, tak aby Twój kolejny commit mógł je uwzględniać:

<!-- If you clone a Subversion repository that has `svn:ignore` properties set anywhere, you’ll likely want to set corresponding `.gitignore` files so you don’t accidentally commit files that you shouldn’t. `git svn` has two commands to help with this issue. The first is `git svn create-ignore`, which automatically creates corresponding `.gitignore` files for you so your next commit can include them. -->

Drugą komendą jest `git svn show-ignore`, wypisująca na ekran linie które musisz umieścić w pliku `.gitignore`, możesz więc przekierować jej wynik do pliku zawierającego wykluczenia:

<!-- The second command is `git svn show-ignore`, which prints to stdout the lines you need to put in a `.gitignore` file so you can redirect the output into your project exclude file: -->

	$ git svn show-ignore > .git/info/exclude

W ten sposób, nie zaśmiecasz swojego projektu plikami `.gitignore`. Jest to dobra opcja, jeżeli jesteś jedyną osobą korzystającą z Gita w zespole używającym Subversion, a Twoi koledzy nie chcą mieć plików `.gitignore` w kodzie projektu.

<!-- That way, you don’t litter the project with `.gitignore` files. This is a good option if you’re the only Git user on a Subversion team, and your teammates don’t want `.gitignore` files in the project. -->

## Podsumowanie Git-Svn

<!-- ## Git-Svn Summary -->

Narzędzia dostarczane przez `git svn` są przydatne, jeżeli musisz używać serwera Subversion, lub jeżeli są inne przesłanki, które zmuszają Cię do tego. Powinieneś patrzeć na tę komendę jak na ograniczonego Gita, lub inaczej będziesz natrafiał na kłopotliwe dla innych programistów problemy. Aby napotykać ich jak najmniej, trzymaj się tych zasad:

<!-- The `git svn` tools are useful if you’re stuck with a Subversion server for now or are otherwise in a development environment that necessitates running a Subversion server. You should consider it crippled Git, however, or you’ll hit issues in translation that may confuse you and your collaborators. To stay out of trouble, try to follow these guidelines: -->

* Utrzymuj liniową historię projektu Git, która nie zawiera zmian łączących wprowadzonych przez `git merge`. Zmieniaj bazę (ang. "rebase") dla prac które były wykonywane poza główną linią projektu podczas włączania; nie wykonuj "merge" na nich.
* Nie ustawiaj i nie współpracuj na oddzielnym serwerze Gita. Przyśpieszy to klonowanie projektu dla nowych programistów, jednak pamiętaj, aby nie wypychać do niego zmian które nie mają ustawionego `git-svn-id`. Możesz dodać skrypt `pre-receive`, który będzie sprawdzał każdą treść komentarza czy posiada ona `git-svn-id` i w przeciwnym wypadku odrzucał zmiany które go nie mają.

<!--
* Keep a linear Git history that doesn’t contain merge commits made by `git merge`. Rebase any work you do outside of your mainline branch back onto it; don’t merge it in.
* Don’t set up and collaborate on a separate Git server. Possibly have one to speed up clones for new developers, but don’t push anything to it that doesn’t have a `git-svn-id` entry. You may even want to add a `pre-receive` hook that checks each commit message for a `git-svn-id` and rejects pushes that contain commits without it. -->

Jeżeli będziesz postępował zgodnie z tymi wskazówkami, praca z repozytoriami Subversion będzie bardziej znośna. Jednak, jeżeli możliwe jest przeniesienie się na prawdziwy serwer Gita, powinieneś to zrobić, a cały zespół jeszcze więcej na tym skorzysta.

<!-- If you follow those guidelines, working with a Subversion server can be more bearable. However, if it’s possible to move to a real Git server, doing so can gain your team a lot more. -->
