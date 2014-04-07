# Debugowanie z Gitem

<!-- # Debugging with Git -->

Git udostępnia również kilka narzędzi, które pomogą Ci znaleźć przyczyny problemów w projekcie. Ponieważ Git został zaprojektowany do działania z projektami niemal każdej wielkości, te narzędzia są całkiem podstawowe, ale często pomogą Ci znaleźć błąd, lub sprawcę kiedy sprawy nie idą po Twojej myśli. 

<!-- Git also provides a couple of tools to help you debug issues in your projects. Because Git is designed to work with nearly any type of project, these tools are pretty generic, but they can often help you hunt for a bug or culprit when things go wrong. -->

## Adnotacje plików

<!-- ## File Annotation -->

Jeżeli namierzasz błąd w swoim kodzie i chcesz wiedzieć kiedy został on wprowadzony i z jakiego powodu, adnotacje do plików są często najlepszym z narzędzi. Pokazuje ona który commit był tym który jako ostatni modyfikował dany każdą z linii w pliku. Jeżeli więc, zobaczysz że jakaś metoda w Twoim kodzie jest błędna, możesz zobaczyć adnotacje związane z tym plikiem za pomocą `git blame` i otrzymać wynik z listą osób które jako ostatnie modyfikowały daną linię. Ten przykład używa opcji `-L`, aby ograniczyć wynik do linii od 12 do 22:

<!-- If you track down a bug in your code and want to know when it was introduced and why, file annotation is often your best tool. It shows you what commit was the last to modify each line of any file. So, if you see that a method in your code is buggy, you can annotate the file with `git blame` to see when each line of the method was last edited and by whom. This example uses the `-L` option to limit the output to lines 12 through 22: -->

	$ git blame -L 12,22 simplegit.rb
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
	^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
	79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
	9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
	42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

Zauważ, że pierwszym polem jest częściowa suma SHA-1 commitu który jako ostatni modyfikował daną linię. Następne dwie wartości zostały pobrane z commita - nazwa autora i data - możesz więc z łatwością zobaczyć kto i kiedy modyfikował daną linię. Po tym pokazany jest numer linii i zawartość pliku. Zauważ również że commit `^4832fe2` oznacza linie które były w pierwotnym pliku. Ten commit to ten, który dodał jako pierwszy ten plik do projektu, a te linie nie zostały zmienione od tego czasu. Jest to troszkę mylące, ponieważ do teraz widziałeś przynajmniej trzy różne sposoby w jakich Git używa znaku `^` do zmiany sumy SHA, ale tutaj właśnie to to oznacza.

<!-- Notice that the first field is the partial SHA-1 of the commit that last modified that line. The next two fields are values extracted from that commit—the author name and the authored date of that commit — so you can easily see who modified that line and when. After that come the line number and the content of the file. Also note the `^4832fe2` commit lines, which designate that those lines were in this file’s original commit. That commit is when this file was first added to this project, and those lines have been unchanged since. This is a tad confusing, because now you’ve seen at least three different ways that Git uses the `^` to modify a commit SHA, but that is what it means here. -->

Inną świetną rzeczą w Gitcie jest to, że nie śledzi on zmian nazw plików jawnie. Zapisuje migawkę i następnie próbuje znaleźć pliki którym zmieniono nazwy. Interesujące jest również to, że możesz poprosić go, aby znalazł wszystkie zmiany nazw. Jeżeli dodasz opcję `-C` do `git blame`, Git przeanalizuje plik i spróbuje znaleźć z jakiego pliku dana linia pochodzi, jeżeli miał on skopiowany z innego miejsca. Ostatnio przepisywałem plik `GITServerHandler.m` do kilku osobnych plików, z których jednym był `GITPackUpload.m`. Wykonując "blame" na `GITPackUpload.m` z opcją `-C`, mogłem zobaczyć skąd pochodziły poszczególne części kodu:

<!-- Another cool thing about Git is that it doesn’t track file renames explicitly. It records the snapshots and then tries to figure out what was renamed implicitly, after the fact. One of the interesting features of this is that you can ask it to figure out all sorts of code movement as well. If you pass `-C` to `git blame`, Git analyzes the file you’re annotating and tries to figure out where snippets of code within it originally came from if they were copied from elsewhere. Recently, I was refactoring a file named `GITServerHandler.m` into multiple files, one of which was `GITPackUpload.m`. By blaming `GITPackUpload.m` with the `-C` option, I could see where sections of the code originally came from: -->

	$ git blame -C -L 141,153 GITPackUpload.m
	f344f58d GITServerHandler.m (Scott 2009-01-04 141)
	f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
	f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
	70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
	ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
	56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
	56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
	56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

Jest to bardzo pomocne. Normalnie otrzymasz jako commit źródłowy, commit z którego kopiowałeś plik, ponieważ była to pierwsza chwila w której zmieniałeś linie w nim. Git pokazuje oryginalny commit w którym stworzyłeś te linie, nawet jeżeli było to w innym pliku. 

<!-- This is really useful. Normally, you get as the original commit the commit where you copied the code over, because that is the first time you touched those lines in this file. Git tells you the original commit where you wrote those lines, even if it was in another file. -->

## Szukanie binarne

<!-- ## Binary Search -->

Adnotacje w pliku są pomocne w sytuacji, gdy wiesz od czego zacząć. Jeżeli nie wiesz co psuje, a było wprowadzonych kilkadziesiąt lub kilkaset zmian, od momentu gdy miałeś pewność z kod działał prawidłowo, z pewnością spojrzysz na `git bisect` po pomoc. Komenda `bisect` wykonuje binarne szukanie przez Twoją historię commitów, aby pomóc Ci zidentyfikować tak szybko jak się da, który commit wprowadził błąd.

<!-- Annotating a file helps if you know where the issue is to begin with. If you don’t know what is breaking, and there have been dozens or hundreds of commits since the last state where you know the code worked, you’ll likely turn to `git bisect` for help. The `bisect` command does a binary search through your commit history to help you identify as quickly as possible which commit introduced an issue. -->

Załóżmy, że właśnie wypchnąłeś wersję swojego kodu na środowisko produkcyjne i dostajesz zgłoszenia błędu, który nie występował w Twoim środowisku testowym, a na dodatek, nie wiesz czemu kod tak się zachowuje. Wracasz do weryfikacji kodu i okazuje się że możesz odtworzyć błąd, ale nie wiesz dlaczego tak się dzieje. Możesz wykonać komendę `bisect`, aby się dowiedzieć. Na początek uruchamiasz `git bisect start` aby rozpocząć, a potem `git bisect bad` aby powiedzieć systemowi że obecny commit na którym się znajdujesz jest popsuty. Następnie, wskazujesz kiedy ostatnia znana poprawna wersja była, przy użyciu `git bisect good [poprawna_wersja]`:

<!-- Let’s say you just pushed out a release of your code to a production environment, you’re getting bug reports about something that wasn’t happening in your development environment, and you can’t imagine why the code is doing that. You go back to your code, and it turns out you can reproduce the issue, but you can’t figure out what is going wrong. You can bisect the code to find out. First you run `git bisect start` to get things going, and then you use `git bisect bad` to tell the system that the current commit you’re on is broken. Then, you must tell bisect when the last known good state was, using `git bisect good [good_commit]`: -->

	$ git bisect start
	$ git bisect bad
	$ git bisect good v1.0
	Bisecting: 6 revisions left to test after this
	[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git zobaczył, że 12 zmian było wprowadzonych między commitem który uznałeś za ostatnio poprawny (v1.0), a obecną błędnie działającą wersję i pobrał środkową wersję za Ciebie. W tym momencie, możesz uruchomić ponownie test aby sprawdzić, czy błąd występuje nadal. Jeżeli występuje, oznacza to, że błąd został wprowadzony gdzieś przed tym środkowym commitem; jeżeli nie, to problem został wprowadzony gdzieś po nim. Okazuje się, że błąd już nie występuje, więc pokazujesz to Gitowi poprzez komendę `git bisect good` i kontynuujesz dalej:

<!-- Git figured out that about 12 commits came between the commit you marked as the last good commit (v1.0) and the current bad version, and it checked out the middle one for you. At this point, you can run your test to see if the issue exists as of this commit. If it does, then it was introduced sometime before this middle commit; if it doesn’t, then the problem was introduced sometime after the middle commit. It turns out there is no issue here, and you tell Git that by typing `git bisect good` and continue your journey: -->

	$ git bisect good
	Bisecting: 3 revisions left to test after this
	[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

Teraz jest na innym commicie, w połowie drogi między tym który właśnie przetestowałeś, a tym oznaczonym jako zły. Uruchamiasz swój test ponownie i widzisz, że obecna wersja zawiera błąd, więc wskazujesz to Gitowi za pomocą `git bisect bad`:

<!-- Now you’re on another commit, halfway between the one you just tested and your bad commit. You run your test again and find that this commit is broken, so you tell Git that with `git bisect bad`: -->

	$ git bisect bad
	Bisecting: 1 revisions left to test after this
	[f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

Ten commit jest dobry, więc teraz Git ma wszystkie informacje aby stwierdzić w którym miejscu błąd został wprowadzony. Pokazuje Ci sumę SHA-1 pierwszego błędnego commita, oraz trochę informacji z nim związanych, jak również listę plików które zostały zmodyfikowane, tak abyś mógł zidentyfikować co się stało że błąd został wprowadzony:

<!-- This commit is fine, and now Git has all the information it needs to determine where the issue was introduced. It tells you the SHA-1 of the first bad commit and show some of the commit information and which files were modified in that commit so you can figure out what happened that may have introduced this bug: -->

	$ git bisect good
	b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
	commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
	Author: PJ Hyett <pjhyett@example.com>
	Date:   Tue Jan 27 14:48:32 2009 -0800

	    secure this thing

	:040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
	f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

Kiedy skończysz, powinieneś uruchomić `git bisect reset`, aby zresetować swój HEAD do stanu w którym zacząłeś, lub inaczej skończysz z dziwnym stanem kodu: 

<!-- When you’re finished, you should run `git bisect reset` to reset your HEAD to where you were before you started, or you’ll end up in a weird state: -->

	$ git bisect reset

Jest to potężne narzędzie, które pomoże Ci sprawdzić setki zmian, w poszukiwaniu wprowadzonego błędu w ciągu minut. W rzeczywistości, jeżeli masz skrypt który zwraca wartość 0 jeżeli projekt działa (good) poprawnie, oraz wartość inną niż 0 jeżeli projekt nie działa (bad), możesz w całości zautomatyzować komendę `git bisect`. Na początek, wskazujesz zakres na którym będzie działał, poprzez wskazanie znanych błędnych i działających commitów. Możesz to zrobić, poprzez wypisanie ich za pomocą komendy `bisect start`, podając znany błędny commit jako pierwszy i znany działający jako drugi:

<!-- This is a powerful tool that can help you check hundreds of commits for an introduced bug in minutes. In fact, if you have a script that will exit 0 if the project is good or non-0 if the project is bad, you can fully automate `git bisect`. First, you again tell it the scope of the bisect by providing the known bad and good commits. You can do this by listing them with the `bisect start` command if you want, listing the known bad commit first and the known good commit second: -->

	$ git bisect start HEAD v1.0
	$ git bisect run test-error.sh

Robiąc w ten sposób, uruchomiony zostanie skrypt `test-error.sh` na każdym commitcie, do czasu aż Git znajdzie pierwszy błędy commit. Możesz również uruchomić coś komendy podobne do `make` lub `make tests` lub jakiekolwiek które uruchomią zautomatyzowane testy za Ciebie.

<!-- Doing so automatically runs `test-error.sh` on each checked-out commit until Git finds the first broken commit. You can also run something like `make` or `make tests` or whatever you have that runs automated tests for you. -->
