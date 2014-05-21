# Migracja do Gita

<!-- # Migrating to Git -->

Jeżeli masz obecny kod projektu w innym systemie VCS, ale zdecydowałeś się na używanie Gita, musisz w jakiś sposób go zmigrować. Ta sekcja przedstawia kilka importerów które są dostarczane razem z Gitem dla najczęściej używanych systemów, a potem pokazuje jak stworzyć swój własny importer.

<!-- If you have an existing codebase in another VCS but you’ve decided to start using Git, you must migrate your project one way or another. This section goes over some importers that are included with Git for common systems and then demonstrates how to develop your own custom importer. -->

## Importowanie

<!-- ## Importing -->

Nauczysz się w jaki sposób zaimportować dane z dwóch największych produkcyjnych systemów SCM - Subversion i Perforce - ponieważ oba generują większość użytkowników o których słyszę, że się przenoszą, oraz ze względu na to, że dla nich Git posiada dopracowane narzędzia. 

<!-- You’ll learn how to import data from two of the bigger professionally used SCM systems — Subversion and Perforce — both because they make up the majority of users I hear of who are currently switching, and because high-quality tools for both systems are distributed with Git. -->

## Subversion

Jeżeli przeczytałeś poprzednią sekcję na temat używania `git svn`, możesz z łatwością użyć tamtych instrukcji aby sklonować za pomocą `git svn clone` repozytorium; następnie, przestań używać serwera Subversion, wypchaj zmiany do serwera Git i zacznij tylko na nim współpracować. Jeżeli potrzebujesz historii projektu, będziesz mógł to osiągnąć tak szybko, jak tylko możesz ściągnąć dana z serwera Subversion (co może chwilę zająć).

<!-- If you read the previous section about using `git svn`, you can easily use those instructions to `git svn clone` a repository; then, stop using the Subversion server, push to a new Git server, and start using that. If you want the history, you can accomplish that as quickly as you can pull the data out of the Subversion server (which may take a while). -->

Jednak, importowanie nie jest idealnym rozwiązaniem; a dlatego że zajmie to dużo czasu, powinieneś zrobić to raz a dobrze. Pierwszym problemem są informacje o autorze. W Subversion, każda osoba wgrywająca zmiany posiada konto systemowe na serwerze który zapisuje zmiany. Przykłady w poprzedniej sekcji, pokazują użytkownika `schacon` w kilku miejscach, takich jak wynik komendy `blame` czy `git svn log`. Jeżeli chciałbyś zamienić je na dane zgodne z Gitem, musisz stworzyć mapowania z użytkownika Subversion na autora w Git. Stwórz plik `users.txt`, który ma przypisane adresy w ten sposób:

<!-- However, the import isn’t perfect; and because it will take so long, you may as well do it right. The first problem is the author information. In Subversion, each person committing has a user on the system who is recorded in the commit information. The examples in the previous section show `schacon` in some places, such as the `blame` output and the `git svn log`. If you want to map this to better Git author data, you need a mapping from the Subversion users to the Git authors. Create a file called `users.txt` that has this mapping in a format like this: -->

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

Aby otrzymać listę autorów używanych przez SVN, uruchom komendę:

<!-- To get a list of the author names that SVN uses, you can run this: -->

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

Komenda ta da wynik w formacie XML - z którego możesz wyciągnąć autorów, stworzyć z nich unikalną listę i następnie usunąć XMLa (Oczywiście to zadziała tylko na komputerze z zainstalowanymi programami `grep`, `sort`, oraz `perl`). Następnie przekieruj wynik komendy do pliku users.txt, tak abyś mógł dodać odpowiednik użytkownika w Gitcie dla każdego wpisu.

<!-- That gives you the log output in XML format — you can look for the authors, create a unique list, and then strip out the XML. (Obviously this only works on a machine with `grep`, `sort`, and `perl` installed.) Then, redirect that output into your users.txt file so you can add the equivalent Git user data next to each entry. -->

Możesz przekazać ten plik do komendy `git svn`, aby pomóc jej lepiej zmapować dane przypisane do autorów. Możesz również wskazać `git svn`, aby nie zaciągał meta-danych, które normalnie Subversion importuje, poprzez dodanie opcji `--no-metadata` do komend `clone` lub `init`. Twoja wynikowa komenda do importu wygląda więc tak:

<!-- You can provide this file to `git svn` to help it map the author data more accurately. You can also tell `git svn` not to include the metadata that Subversion normally imports, by passing `-\-no-metadata` to the `clone` or `init` command. This makes your `import` command look like this: -->

	$ git-svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

Teraz powinieneś mieć lepiej wyglądający projekt z Subversion w swoim katalogu `my_project`. Zamiast commitów które wyglądają tak te:

<!-- Now you should have a nicer Subversion import in your `my_project` directory. Instead of commits that look like this -->

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029

masz takie:

<!-- they look like this: -->

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

Nie tylko dane autora wyglądają lepiej, ale nie ma również znaczników `git-svn-id`.

<!-- Not only does the Author field look a lot better, but the `git-svn-id` is no longer there, either. -->

Musisz jeszcze trochę posprzątać po imporcie. Na początek, powinieneś poprawić dziwne referencje które ustawił `git svn`. Najpierw przeniesiesz tagi, tak aby były normalnymi tagami, zamiast dziwnych zdalnych gałęzi, następnie przeniesiesz resztę gałęzi tak aby były lokalne.

<!-- You need to do a bit of `post-import` cleanup. For one thing, you should clean up the weird references that `git svn` set up. First you’ll move the tags so they’re actual tags rather than strange remote branches, and then you’ll move the rest of the branches so they’re local. -->

Aby przenieść etykiety i zrobić z nich prawidłowe tagi Gita, uruchom:

<!-- To move the tags to be proper Git tags, run -->

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

Pobierze to referencje które były zdalnymi gałęziami rozpoczynającymi się od `tag/` i zrobi z nich normalne (lekkie) etykiety.

<!-- This takes the references that were remote branches that started with `tag/` and makes them real (lightweight) tags. -->

Następnie, przenieś resztę referencji z `refs/remotes`, tak aby stały się lokalnymi gałęziami:

<!-- Next, move the rest of the references under `refs/remotes` to be local branches: -->

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

Teraz wszystkie stare gałęzie są prawdziwymi gałęziami Gita, a stare tagi prawdziwymi tagami w Git. Ostatnią rzeczą do zrobienia jest dodanie nowego serwera Git jako zdalnego i wypchnięcie danych do niego.

<!-- Now all the old branches are real Git branches and all the old tags are real Git tags. The last thing to do is add your new Git server as a remote and push to it. Here is an example of adding your server as a remote: -->

	$ git remote add origin git@my-git-server:myrepository.git

Ponieważ chcesz aby wszystkie gałęzie i tagi były na repozytorium, możesz uruchomić:

<!-- Because you want all your branches and tags to go up, you can now run this: -->

	$ git push origin --all
	$ git push origin --tags

Wszystkie gałęzie i tagi powinny być już na Twoim serwerze Gita, zaimportowane w czysty i zgrabny sposób.

<!-- All your branches and tags should be on your new Git server in a nice, clean import. -->

## Perforce

Następnym systemem z którego nauczysz się importować to Perforce. Program umożliwiający import z Perforce jest również dostarczany z Gitem. Jeżeli masz wersję Gita wcześniejszą niż 1.7.11, to program importujący jest dostępny jedynie w katalogu `contrib` w kodzie źródłowym. W takiej sytuacji musisz pobrać kod źródłowy Gita, który jest dostępny z git.kernel.org:

<!-- The next system you’ll look at importing from is Perforce. A Perforce importer is also distributed with Git. If you have a version of Git earlier than 1.7.11, then the importer is only available in the `contrib` section of the source code. In that case you must get the Git source code, which you can download from git.kernel.org: -->

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

W katalogu `fast-import` powinieneś znaleźć skrypt napisany w języku Python o nazwie `git-p4`. Aby import się powiódł, musisz mieć zainstalowane na swoim komputerze interpreter Pythona i program `p4`. Dla przykładu, zaimportujesz projekt Jam z publicznego serwera Perforce. Aby ustawić swój program, musisz wyeksportować zmienną środowiskową P4PORT wskazującą na serwer Perforce:

<!-- In this `fast-import` directory, you should find an executable Python script named `git-p4`. You must have Python and the `p4` tool installed on your machine for this import to work. For example, you’ll import the Jam project from the Perforce Public Depot. To set up your client, you must export the P4PORT environment variable to point to the Perforce depot: -->

	$ export P4PORT=public.perforce.com:1666

Uruchom komendę `git-p4 clone`, aby zaimportować projekt Jam z serwera Perforce wskazując adres i ścieżkę projektu, oraz katalog do którego chcesz go zaimportować:

<!-- Run the `git-p4 clone` command to import the Jam project from the Perforce server, supplying the depot and project path and the path into which you want to import the project: -->

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

Jeżeli przejdziesz do katalogu `/opt/p4import`i uruchomisz `git log`, zobaczysz zaimportowane dane:

<!-- If you go to the `/opt/p4import` directory and run `git log`, you can see your imported work: -->

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

Możesz zauważyć, że każdy commit posiada identyfikator `git-p4`. Może on zostać, w razie gdybyś potrzebował dotrzeć do informacji o numerze zmiany zapisanym w Perforce. Jednak, gdybyś chciał usunąć ten identyfikator, teraz jest dobry moment aby to zrobić - przed wprowadzeniem jakichkolwiek zmian w nowym repozytorium. Możesz użyć `git filter-branch` aby usunąć wszystkie identyfikatory:

<!-- You can see the `git-p4` identifier in each commit. It’s fine to keep that identifier there, in case you need to reference the Perforce change number later. However, if you’d like to remove the identifier, now is the time to do so — before you start doing work on the new repository. You can use `git filter-branch` to remove the identifier strings en masse: -->

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

Jeżeli uruchomisz `git log`, zobaczysz że wszystkie sumy SHA-1 dla commitów zostały zmienione i nie ma już identyfikatorów pozostawionych przez `git-p4` w treściach komentarzy:

<!-- If you run `git log`, you can see that all the SHA-1 checksums for the commits have changed, but the `git-p4` strings are no longer in the commit messages: -->

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

Twój kod jest teraz gotowy do wypchnięcia na nowy serwer Gita.

<!-- Your import is ready to push up to your new Git server. -->

## Własny skrypt importujący

<!-- ## A Custom Importer -->

Jeżeli Twój system to nie Subversion lub Perforce, powinieneś spojrzeć na importery dostępne w sieci - dobrej jakości importery dostępne są dla CVS, Clear Case, Visual Source Safe, a nawet zwykłego katalogu z archiwami. Jeżeli żadne z tych narzędzi nie zadziała, lub używasz mniej popularnego systemu, lub jeżeli potrzebujesz bardziej dostosowanego importu, powinieneś użyć `git fast-import`. Ta komenda odczytuje instrukcje przekazane na standardowe wejście programu i zapisuje dane w Git. Dużo łatwiej w ten sposób tworzyć obiekty Gita, niż uruchamiać jego niskopoziomowe komendy czy zapisywać surowe obiekty (zobacz rozdział 9 po więcej informacji). W ten sposób możesz napisać skrypt importujący, który odczyta wszystkie potrzebne informacje z systemu z którego importujesz i wypisze instrukcje do wykonania na ekran. Możesz następnie uruchomić ten program i przekazać wynik do `git fast-import`.

<!-- If your system isn’t Subversion or Perforce, you should look for an importer online — quality importers are available for CVS, Clear Case, Visual Source Safe, even a directory of archives. If none of these tools works for you, you have a rarer tool, or you otherwise need a more custom importing process, you should use `git fast-import`. This command reads simple instructions from stdin to write specific Git data. It’s much easier to create Git objects this way than to run the raw Git commands or try to write the raw objects (see Chapter 9 for more information). This way, you can write an import script that reads the necessary information out of the system you’re importing from and prints straightforward instructions to stdout. You can then run this program and pipe its output through `git fast-import`. -->

W celach demonstracyjnych, napiszesz prosty skrypt importujący. Załóżmy, że pracujesz na najnowszej kopii kodu źródłowego i wykonujesz czasami kopie zapasowe poprzez skopiowanie danych do katalogu z datą w formacie `back_YYYY_MM_DD` i chciałbyś je zaimportować do Gita. Twoja struktura katalogów wygląda następująco:

<!-- To quickly demonstrate, you’ll write a simple importer. Suppose you work in current, you back up your project by occasionally copying the directory into a time-stamped `back_YYYY_MM_DD` backup directory, and you want to import this into Git. Your directory structure looks like this: -->

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

Aby zaimportować katalog do Gita, musisz przypomnieć sobie w jaki sposób Git przechowuje dane. Być może pamiętasz, Git z założenia jest zbiorem połączonych obiektów dotyczących commitów, które wskazują na ostatnią migawkę z zawartością. Wszystko co musisz zrobić, to wskazać `fast-import` jaka jest zawartość migawek, który commit na nie wskazuje, oraz kolejność w której występują. Twoją strategią będzie przejście kolejno przez wszystkie migawki, oraz stworzenie commitów z zawartością dla każdego z nich, łącząc każdy commit z poprzednim.

<!-- In order to import a Git directory, you need to review how Git stores its data. As you may remember, Git is fundamentally a linked list of commit objects that point to a snapshot of content. All you have to do is tell `fast-import` what the content snapshots are, what commit data points to them, and the order they go in. Your strategy will be to go through the snapshots one at a time and create commits with the contents of each directory, linking each commit back to the previous one. -->

Jak robiłeś już to w sekcji "Przykładowa polityka wymuszająca Gita" w rozdziale 7, również napiszemy to w Ruby, ponieważ to na nim zazwyczaj pracuję, a jego kod jest dość czytelny. Możesz stworzyć ten przykład bardzo szybko, w praktycznie każdym innym języku który dobrze znasz - musi on wypisać na ekran właściwe informacje. A jeżeli pracujesz na systemie Windows, będziesz musiał zwrócić szczególną uwagę, aby nie wprowadzić znaków powrotu karetki na końcach linii - `git fast-import` potrzebuje linie zakończone znakami nowej linii (LF), a nie powrotem karetki (CRLF) których używa Windows.

<!-- As you did in the "An Example Git Enforced Policy" section of Chapter 7, we’ll write this in Ruby, because it’s what I generally work with and it tends to be easy to read. You can write this example pretty easily in anything you’re familiar with — it just needs to print the appropriate information to stdout. And, if you are running on Windows, this means you’ll need to take special care to not introduce carriage returns at the end your lines — git fast-import is very particular about just wanting line feeds (LF) not the carriage return line feeds (CRLF) that Windows uses. -->

Aby rozpocząć, przejdziesz do docelowego katalogu i znajdziesz wszystkie podkatalogi, z których znajdują się migawki które chcesz zaimportować. Następnie wejdziesz do każdego podkatalogu i wypiszesz komendy konieczne do eksportu. Twoja pętla główna w programie wygląda tak:

<!-- To begin, you’ll change into the target directory and identify every subdirectory, each of which is a snapshot that you want to import as a commit. You’ll change into each subdirectory and print the commands necessary to export it. Your basic main loop looks like this: -->

	last_mark = nil

	# loop through the directories
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # move into the target directory
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

Uruchamiasz `print_export` w każdym katalogu, która przyjmuje jako parametry nazwę katalogu oraz znacznik poprzedniej migawki, a zwraca znacznik obecnej; w ten sposób możesz połączyć je poprawnie ze sobą. "Znacznik" jest terminem używanym przez `fast-import`, dla identyfikatora który przypisujesz do commita; podczas tworzenia kolejnych commitów, nadajesz każdemu z nich znacznik, który będzie użyty do połączenia go z innymi commitami. Dlatego pierwszą rzeczą którą robisz w metodzie `print_export` jest wygenerowanie znacznika pobranego z nazwy katalogu:

<!-- You run `print_export` inside each directory, which takes the manifest and mark of the previous snapshot and returns the manifest and mark of this one; that way, you can link them properly. "Mark" is the `fast-import` term for an identifier you give to a commit; as you create commits, you give each one a mark that you can use to link to it from other commits. So, the first thing to do in your `print_export` method is generate a mark from the directory name: -->

	mark = convert_dir_to_mark(dir)

Zrobisz to poprzez wygenerowanie tablicy z nazwami katalogów, która używa jako indeksu znacznika będącego liczbą całkowitą. Twoja metoda wygląda więc tak:

<!-- You’ll do this by creating an array of directories and using the index value as the mark, because a mark must be an integer. Your method looks like this: -->

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

Teraz, gdy masz już liczbę reprezentującą Twój commit, potrzebujesz daty do zamieszczenia w meta-danych commita. Ponieważ data jest użyta w nazwie katalogu, pobierzesz ją z nazwy. Następną linią w pliku `print_export` jest

<!-- Now that you have an integer representation of your commit, you need a date for the commit metadata. Because the date is expressed in the name of the directory, you’ll parse it out. The next line in your `print_export` file is -->

	date = convert_dir_to_date(dir)

gdzie `convert_dir_to_date` jest zdefiniowana jako 

<!-- where `convert_dir_to_date` is defined as -->

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

Zwraca ona liczbę całkowitą dla daty z katalogu. Ostatnią rzeczą potrzebną do zapisania meta-danych są informacje o osobie wprowadzającej zmiany, którą zapisujesz na stałe w zmiennej globalnej:

<!-- That returns an integer value for the date of each directory. The last piece of meta-information you need for each commit is the committer data, which you hardcode in a global variable: -->

	$author = 'Scott Chacon <schacon@example.com>'

Teraz możesz rozpocząć wypisywanie danych dotyczących commitów dla swojego programu importującego. Początkowe informacje wskazują, że definiujesz nowy obiekt commit, oraz nazwę gałęzi do której będzie on przypisany, następnie podajesz znaczki który wygenerowałeś, informacje o osobie wprowadzającej zmiany oraz treść komentarza do zmiany, a na końcu poprzedni znacznik commita. Kod wygląda tak:

<!-- Now you’re ready to begin printing out the commit data for your importer. The initial information states that you’re defining a commit object and what branch it’s on, followed by the mark you’ve generated, the committer information and commit message, and then the previous commit, if any. The code looks like this: -->

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

Wpisujesz na sztywno strefę czasową (-0700), ponieważ jest to najprostsze podejście. Jeżeli importujesz z innego systemu, musisz wskazać strefę czasową jako różnicę (ang. offset). Treść komentarza do zmiany musi być wyrażona w specjalnym formacie:

<!-- You hardcode the time zone (-0700) because doing so is easy. If you’re importing from another system, you must specify the time zone as an offset.
The commit message must be expressed in a special format: -->

	data (size)\n(contents)

Format składa się z słowa kluczowego data, długości danych do wczytania, znaku nowej linii, oraz na końcu samych danych. Ponieważ musisz używać tego samego formatu, do przekazania zawartości plików w dalszych etapach, stwórz metodę pomocniczą, `export_data`: 

<!-- The format consists of the word data, the size of the data to be read, a newline, and finally the data. Because you need to use the same format to specify the file contents later, you create a helper method, `export_data`: -->

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

Jedyne co pozostało, to wskazanie zawartości pliku dla każdej migawki. Jest to proste, ponieważ masz wszystkie pliki w katalogu - możesz wypisać komendę `deleteall`, a następnie zawartość wszystkich plików w katalogu. Następnie Git zapisze każdą migawkę:

<!-- All that’s left is to specify the file contents for each snapshot. This is easy, because you have each one in a directory — you can print out the `deleteall` command followed by the contents of each file in the directory. Git will then record each snapshot appropriately: -->

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

Uwaga:	Ponieważ spora część systemów (SCM przyp. tłum.) myśli o kolejnych rewizjach jako o zmianach z jednego commita do drugiego, fast-import może również pobrać komendy dla każdego commita, w których można wskazać jakie pliki zostały dodane, usunięte, lub zmodyfikowane i jaka jest ich nowa zawartość. Mógłbyś obliczyć różnice między migawkami i dostarczyć tylko te dane, ale działanie w ten sposób jest bardziej skomplikowane - łatwiej wskazać Gitowi wszystkie dane, a on sam się zajmie obliczaniem różnic. Jeżeli jednak uważasz, że ten sposób jest bardziej dopasowany do danych które posiadasz, sprawdź podręcznik systemowy dla komendy `fast-import`, aby dowiedzieć się w jaki sposób przekazać jej dane.

<!-- Note:	Because many systems think of their revisions as changes from one commit to another, fast-import can also take commands with each commit to specify which files have been added, removed, or modified and what the new contents are. You could calculate the differences between snapshots and provide only this data, but doing so is more complex — you may as well give Git all the data and let it figure it out. If this is better suited to your data, check the `fast-import` man page for details about how to provide your data in this manner. -->

Format przekazywania zawartości nowego pliku lub wskazywania zmodyfikowanego z nową zawartością jest następujący:

<!-- The format for listing the new file contents or specifying a modified file with the new contents is as follows: -->

	M 644 inline path/to/file
	data (size)
	(file contents)

W tym przykładzie, 644 oznacza uprawnienia do pliku (jeżeli masz pliki wykonywalne, musisz wskazać 755), a inline mówi o tym, że będziesz przekazywał dane zaraz po tej linii. Twoja metoda `inline_data` wygląda tak:

<!-- Here, 644 is the mode (if you have executable files, you need to detect and specify 755 instead), and inline says you’ll list the contents immediately after this line. Your `inline_data` method looks like this: -->

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

Używasz ponownie metody `export_data`, którą zdefiniowałeś wcześniej, ponieważ działa to tak samo jak podczas wskazywania treści komentarza do commita.

<!-- You reuse the `export_data` method you defined earlier, because it’s the same as the way you specified your commit message data. -->

<!-- The last thing you need to do is to return the current mark so it can be passed to the next iteration: -->

	return mark

UWAGA: Jeżeli pracujesz na systemie Windows, musisz upewnić się, że dodajesz jeszcze jeden krok. Jak wspomniałem wcześniej, system Windows używa znaków CRLF jak znaczników końca linii, a `git fast-import` oczekuje tylko LF. Aby obejść ten problem i uszczęśliwić `git fast-import`, musisz wskazać ruby, aby używał znaków LF zamiast CRLF:

<!-- NOTE: If you are running on Windows you’ll need to make sure that you add one extra step. As mentioned before, Windows uses CRLF for new line characters while git fast-import expects only LF. To get around this problem and make git fast-import happy, you need to tell ruby to use LF instead of CRLF: -->

	$stdout.binmode

Tylko tyle. Jeżeli uruchomisz ten skrypt, otrzymasz wynik podobny do tego:

<!-- That’s it. If you run this script, you’ll get content that looks something like this: -->

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

Aby uruchomić importer, przekaż wynik do `git fast-import` będąc w katalogu z repozytorium Gita do którego chcesz zaimportować dane. Możesz stworzyć nowy katalog, następnie uruchomić `git init` w nim, a potem uruchomić skrypt:

<!-- To run the importer, pipe this output through `git fast-import` while in the Git repository you want to import into. You can create a new directory and then run `git init` in it for a starting point, and then run your script: -->

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

Jak widzisz, jeżeli zakończy się powodzeniem, pokaże Ci trochę statystyk na temat tego co zdziałał. W tym przypadku, zaimportowałeś łącznie 18 obiektów, dla 5 commitów w jednej gałęzi. Teraz możesz uruchomić `git log`, aby zobaczyć swoją nową historię projektu:

<!-- As you can see, when it completes successfully, it gives you a bunch of statistics about what it accomplished. In this case, you imported 18 objects total for 5 commits into 1 branch. Now, you can run `git log` to see your new history: -->

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

Proszę - ładne, czyste repozytorium Gita. Warto zauważyć, że żadne dane nie zostały pobrane - nie masz żadnych plików w swoim katalogu roboczym. Aby je pobrać, musisz wykonać reset do momentu w którym `master` jest teraz:

<!-- There you go — a nice, clean Git repository. It’s important to note that nothing is checked out — you don’t have any files in your working directory at first. To get them, you must reset your branch to where `master` is now: -->

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

Możesz zrobić dużo więcej przy pomocy narzędzia `fast-import` - obsłużyć różne tryby, dane binarne, gałęzie i ich łączenie, etykiety, wskaźniki postępu i inne. Trochę przykładów bardziej skomplikowanych scenariuszy jest dostępnych w katalogu `contrib/fast-import` w kodzie źródłowym Gita; jednym z lepszych jest skrypt `git-p4` który wcześniej opisałem.

<!-- You can do a lot more with the `fast-import` tool — handle different modes, binary data, multiple branches and merging, tags, progress indicators, and more. A number of examples of more complex scenarios are available in the `contrib/fast-import` directory of the Git source code; one of the better ones is the `git-p4` script I just covered. -->
