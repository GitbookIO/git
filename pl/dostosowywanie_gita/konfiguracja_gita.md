# Konfiguracja Gita

<!-- # Git Configuration -->

Jak w skrócie zobaczyłeś w rozdziale 1, możesz zmieniać ustawienia konfiguracyjne za pomocą komendy `git config`. Jedną z pierwszych rzeczy którą zrobiłeś, było ustawienie imienia i adresu e-mail:

<!-- As you briefly saw in the Chapter 1, you can specify Git configuration settings with the `git config` command. One of the first things you did was set up your name and e-mail address: -->

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com


Teraz poznasz kilka bardziej interesujących opcji, które możesz ustawić w ten sposób, aby dostosować działanie Gita.

<!-- Now you’ll learn a few of the more interesting options that you can set in this manner to customize your Git usage. -->

Widziałeś już kilka przykładowych ustawień konfiguracyjnych w pierwszym rozdziale, ale przejdziemy przez nie szybko jeszcze raz. Git używa kilku plików konfiguracyjnych, aby odczytać niestandardowe ustawienia które możesz mieć ustawione. Pierwszym miejscem w którym Git sprawdzi te ustawienia jest plik `/etc/gitconfig`, który zawiera ustawienia dla wszystkich użytkowników znajdujących się w systemie, oraz dla ich wszystkich repozytoriów. Jeżeli dodasz opcję `--system` do `git config`, Git będzie zapisywał i odczytywał ustawienia właśnie z tego pliku.

<!-- You saw some simple Git configuration details in the first chapter, but I’ll go over them again quickly here. Git uses a series of configuration files to determine non-default behavior that you may want. The first place Git looks for these values is in an `/etc/gitconfig` file, which contains values for every user on the system and all of their repositories. If you pass the option `-\-system` to `git config`, it reads and writes from this file specifically. -->

Następnym miejscem w które Git zajrzy jest plik `~/.gitconfig`, wskazujący na ustawienia dla konkretnych użytkowników. Dodając opcję `--global`, zmusisz Gita to odczytywania i zapisywania ustawień z tego pliku.

<!-- The next place Git looks is the `~/.gitconfig` file, which is specific to each user. You can make Git read and write to this file by passing the `-\-global` option. -->

Na końcu, Git szuka ustawień w pliku konfiguracyjnym znajdującym się z katalogu Git (`.git/config`) w każdym repozytorium którego obecnie używasz. Ustawienia te są specyficzne dla tego konkretnego repozytorium. Każdy z poziomów nadpisuje ustawienia poprzedniego poziomu, więc na przykład ustawienia w `.git/config` nadpisują te z `/etc/gitconfig`. Możesz również ustawiać wartości ręcznie poprzez edycję i wprowadzenie danych w poprawnym formacie, ale generalnie dużo łatwiej jest użyć komendy `git config`.

<!-- Finally, Git looks for configuration values in the config file in the Git directory (`.git/config`) of whatever repository you’re currently using. These values are specific to that single repository. Each level overwrites values in the previous level, so values in `.git/config` trump those in `/etc/gitconfig`, for instance. You can also set these values by manually editing the file and inserting the correct syntax, but it’s generally easier to run the `git config` command. -->

## Podstawowa konfiguracja klienta

<!-- ## Basic Client Configuration -->

Opcje konfiguracyjne rozpoznawane przez Gita dzielą się na dwie kategorie: opcje klienta i serwera. Większość opcji dotyczy konfiguracji klienta - ustawień Twoich własnych preferencji. Chociaż jest dostępnych mnóstwo opcji, opiszę tylko kilka te z nich, które są albo często używane lub mogą w znaczący sposób wpłynąć na Twoją pracę. Duża ilość opcji jest użyteczna tylko w specyficznych sytuacjach, których nie opiszę tutaj. Jeżeli chcesz zobaczyć listę wszystkich opcji konfiguracyjnych które Twoja wersja Gita rozpoznaje, uruchom

<!-- The configuration options recognized by Git fall into two categories: client side and server side. The majority of the options are client side—configuring your personal working preferences. Although tons of options are available, I’ll only cover the few that either are commonly used or can significantly affect your workflow. Many options are useful only in edge cases that I won’t go over here. If you want to see a list of all the options your version of Git recognizes, you can run -->

	$ git config --help

Podręcznik pomocy systemowej dla `git config` pokazuje wszystkie dostępne opcje i opisuje je w dość szczegółowy sposób.

<!-- The manual page for `git config` lists all the available options in quite a bit of detail. -->

### core.editor

Domyślnie, Git używa edytora ustawionego domyślnie, lub wraca do edytora Vi podczas tworzenia i edycji commitów i treści komentarzy do zmiany. Aby zmienić domyślny edytor na jakiś inny, używasz ustawienia `core.editor`:

<!-- By default, Git uses whatever you’ve set as your default text editor or else falls back to the Vi editor to create and edit your commit and tag messages. To change that default to something else, you can use the `core.editor` setting: -->

	$ git config --global core.editor emacs

Od teraz, nie ważne na jaki edytor wskazuje zmienna konfiguracyjna w powłoce, Git będzie uruchamiał Emacs do edycji wiadomości.

<!-- Now, no matter what is set as your default shell editor variable, Git will fire up Emacs to edit messages. -->

### commit.template

Jeżeli ustawisz ją na ścieżkę wskazującą na plik w Twoim systemie, Git będzie używał tego pliku jako szablonu komentarza do commita. Na przykład, załóżmy że stworzyłeś plik `$HOME/.gitmessage.txt` zawierający:

<!-- If you set this to the path of a file on your system, Git will use that file as the default message when you commit. For instance, suppose you create a template file at `$HOME/.gitmessage.txt` that looks like this: -->

	subject line

	what happened

	[ticket: X]

Aby wskazać Gitowi, że chcesz używać go jako domyślnej treści komentarza pokazującej się w edytorze po uruchomieniu `git commit`, ustaw zmienną konfiguracyjną `commit.template` na:

<!-- To tell Git to use it as the default message that appears in your editor when you run `git commit`, set the `commit.template` configuration value: -->

	$ git config --global commit.template $HOME/.gitmessage.txt
	$ git commit

Potem, Twój edytor będzie ustawiał coś takiego jako domyślną treść komentarza po commicie:

<!-- Then, your editor will open to something like this for your placeholder commit message when you commit: -->

	subject line

	what happened

	[ticket: X]
	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	# modified:   lib/test.rb
	#
	~
	~
	".git/COMMIT_EDITMSG" 14L, 297C

Jeżeli masz specjalną politykę tworzenia treści komentarzy, to ustawienie takiego szablonu i skonfigurowanie Gita aby go używał zwiększy szanse na to, że będzie ona regularnie przestrzegana.

<!-- If you have a commit-message policy in place, then putting a template for that policy on your system and configuring Git to use it by default can help increase the chance of that policy being followed regularly. -->

### core.pager

Wartość core.pager określa jaki program do stronicowania jest używany przez Gita podczas pokazywania wyników komend `log` i `diff`. Możesz ustawić je na `more` lub inny ulubiony (domyślnie jest to `less`), lub możesz zupełnie je wyłączyć przez ustawienie pustej wartości:

<!-- The core.pager setting determines what pager is used when Git pages output such as `log` and `diff`. You can set it to `more` or to your favorite pager (by default, it’s `less`), or you can turn it off by setting it to a blank string: -->

	$ git config --global core.pager ''

Jeżeli to uruchomisz, Git będzie pokazywał pełne wyniki wszystkich komend, bez względu na to jak długie są.

<!-- If you run that, Git will page the entire output of all commands, no matter how long it is. -->

### user.signingkey

Jeżeli tworzysz opisane etykiety (jak opisano w rozdziale 2), ustawienie Twojego klucza GPG jako zmiennej konfiguracyjnej ułatwi trochę sprawę. Ustaw swój identyfikator klucza w ten sposób:

<!-- If you’re making signed annotated tags (as discussed in Chapter 2), setting your GPG signing key as a configuration setting makes things easier. Set your key ID like so: -->

	$ git config --global user.signingkey <gpg-key-id>

Teraz, możesz podpisywać tagi bez konieczności wskazywania za każdym razem klucza podczas uruchamiania komendy `git tag`:

<!-- Now, you can sign tags without having to specify your key every time with the `git tag` command: -->

	$ git tag -s <tag-name>

### core.excludesfile

Możesz umieścić wzorce w pliku `.gitignore` w swoim projekcie, aby Git nie śledził ich i nie próbował dodawać do przechowalni po wykonaniu komendy `git add`, jak wspomniałem już w rozdziale 2. Możesz jednak przechowywać te informacje w innym pliku, znajdującym się poza drzewem projektu, możesz wskazać Gitowi lokalizację tego pliku za pomocą ustawienia `core.excludesfile`. Po prostu ustaw ją na ścieżkę wskazującą na plik, który ma zawartość podobną do tej, którą ma `.gitignore`.

<!-- You can put patterns in your project’s `.gitignore` file to have Git not see them as untracked files or try to stage them when you run `git add` on them, as discussed in Chapter 2. However, if you want another file outside of your project to hold those values or have extra values, you can tell Git where that file is with the `core.excludesfile` setting. Simply set it to the path of a file that has content similar to what a `.gitignore` file would have. -->

### help.autocorrect

Ta opcja jest dostępna w wersjach Gita 1.6.1 i późniejszych. Jeżeli błędnie wpiszesz komendę w Git, zostanie Ci pokazany wynik podobny do:

<!-- This option is available only in Git 1.6.1 and later. If you mistype a command in Git, it shows you something like this: -->

	$ git com
	git: 'com' is not a git-command. See 'git --help'.

	Did you mean this?
	     commit

Jeżeli ustawisz `help.autocorrect` na 1, Git automatycznie uruchomi komendę, jeżeli będzie mógł ją dopasować tylko do jednego wyniku.

<!-- If you set `help.autocorrect` to 1, Git will automatically run the command if it has only one match under this scenario. -->


## Kolory w Git

<!-- ## Colors in Git -->

Git może również pokazywać wyniki swojego działania w kolorze, co ułatwi Ci ich odczytanie w szybszy i łatwiejszy sposób. Liczne opcje pozwalają na dostosowanie kolorowania do Twoich preferencji.

<!-- Git can color its output to your terminal, which can help you visually parse the output quickly and easily. A number of options can help you set the coloring to your preference. -->

### color.ui

Git może automatycznie pokazywać w kolorze większość wyników swojego działania. Możesz bardzo dokładnie ustawić to co ma być pokazywane w kolorze, oraz w jaki sposób; ale aby włączyć wszystkie domyślne ustawienia dotyczące kolorowania, ustaw `color.ui` na true:

<!-- Git automatically colors most of its output if you ask it to. You can get very specific about what you want colored and how; but to turn on all the default terminal coloring, set `color.ui` to true: -->

	$ git config --global color.ui true

Gdy ta wartość jest ustawiona, Git będzie pokazywał w kolorze wyniki swojego działania na terminalu. Inne możliwe ustawienia to "false", które nigdy nie będzie pokazywało w kolorze wyników działania, oraz "always", które zawsze ustawi kolory, nawet w przypadku gdy będziesz chciał zapisać wyniki do pliku lub przekazać do innej komendy.

<!-- When that value is set, Git colors its output if the output goes to a terminal. Other possible settings are false, which never colors the output, and always, which sets colors all the time, even if you’re redirecting Git commands to a file or piping them to another command. -->

Bardzo rzadko będziesz potrzebował `color.ui = always`. Najczęściej, jeżeli będziesz chciał kolory w wynik działania Gita, użyjesz opcji `--color` do komendy Gita, aby wymusić na nim użycie kolorów. Ustawienie `color.ui = true` jest najczęściej tym, które będziesz chciał użyć.

<!-- You’ll rarely want `color.ui = always`. In most scenarios, if you want color codes in your redirected output, you can instead pass a `-\-color` flag to the Git command to force it to use color codes. The `color.ui = true` setting is almost always what you’ll want to use. -->

### `color.*`

Jeżeli chciałbyś móc bardziej dokładnie ustalać co i w jaki sposób jest pokazywane w kolorze, Git dostarcza odpowiednie ustawienia. Każde z nich może mieć wartość `true`, `false` lub `always`:

<!-- If you want to be more specific about which commands are colored and how, Git provides verb-specific coloring settings. Each of these can be set to `true`, `false`, or `always`: -->

	color.branch
	color.diff
	color.interactive
	color.status

Dodatkowo, każde z nich ma dodatkowe ustawienia, których możesz użyć, aby zmienić konkretne kolory dla części z wyświetlanego wyniku, jeżeli chciałbyś nadpisać jakiś z kolorów. Na przykład, aby pokazać w kolorze wynik komendy diff z niebieskim kolorem pierwszoplanowym, czarnym tłem i pogrubioną czcionką, uruchom:

<!-- In addition, each of these has subsettings you can use to set specific colors for parts of the output, if you want to override each color. For example, to set the meta information in your diff output to blue foreground, black background, and bold text, you can run -->

	$ git config --global color.diff.meta "blue black bold"

Możesz ustawić kolor na wartość jedną z: normal, black, red, green, yellow, blue, magenta, cyan lub white. Jeżeli chciałbyś użyć dodatkowego atrybutu takiego jak pogrubienie z poprzedniego przykładu, możesz wykorzystać bold, dim, ul, blink oraz reverse.

<!-- You can set the color to any of the following values: normal, black, red, green, yellow, blue, magenta, cyan, or white. If you want an attribute like bold in the previous example, you can choose from bold, dim, ul, blink, and reverse. -->

Zobacz podręcznik systemowy do komendy `git config`, aby poznać wszystkie ustawienia których możesz użyć podczas zmiany tych ustawień.

<!-- See the `git config` manpage for all the subsettings you can configure, if you want to do that. -->

## Zewnętrzne narzędzia do łączenia i pokazywania różnic

<!-- ## External Merge and Diff Tools -->

Chociaż Git posiada wbudowaną obsługę narzędzia diff, którego dotychczas używałeś, możesz ustawić inny zewnętrzny program zamiast niego. Możesz również ustawić graficzny program pozwalający na łączenie zmian i rozwiązywanie konfliktów, bez konieczności robienia tego ręcznie. Zaprezentuję na przykładzie Perforce Visual Merge Tool (P4Merge) w jaki sposób ustawić do obsługi łączenia i pokazywania różnic zewnętrzny program, ponieważ ma on prosty graficzny interfejs i jest darmowy.

<!-- Although Git has an internal implementation of diff, which is what you’ve been using, you can set up an external tool instead. You can also set up a graphical merge conflict-resolution tool instead of having to resolve conflicts manually. I’ll demonstrate setting up the Perforce Visual Merge Tool (P4Merge) to do your diffs and merge resolutions, because it’s a nice graphical tool and it’s free. -->

Jeżeli chcesz tego również spróbować, P4Merge działa na wszystkich głównych platformach, więc prawdopodobnie będziesz mógł to zrobić. Będę używał nazw ścieżek w przykładach które działają na systemach Mac i Linux; dla systemu Windows będziesz musiał zmienić `/usr/local/bin` na odpowiednią ścieżkę w Twoim środowisku.

<!-- If you want to try this out, P4Merge works on all major platforms, so you should be able to do so. I’ll use path names in the examples that work on Mac and Linux systems; for Windows, you’ll have to change `/usr/local/bin` to an executable path in your environment. -->

Możesz pobrać P4Merge stąd:

<!-- You can download P4Merge here: -->

	http://www.perforce.com/perforce/downloads/component.html

Na początek, ustawimy zewnętrzny skrypt do uruchamiania komend. Użyję ścieżki z systemu Mac wskazującej na program; w innych systemach, będzie ona musiała wskazywać na miejsce w którym program `p4merge` został zainstalowany. Stwórz skrypt o nazwie `extMerge`, który będzie przyjmował wszystkie podane parametry i uruchamiał program:

<!-- To begin, you’ll set up external wrapper scripts to run your commands. I’ll use the Mac path for the executable; in other systems, it will be where your `p4merge` binary is installed. Set up a merge wrapper script named `extMerge` that calls your binary with all the arguments provided: -->

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/p4merge.app/Contents/MacOS/p4merge $*


Skrypt do obsługi diff sprawdza czy zostało podanych 7 argumentów i przekazuje dwa z nich do skryptu obsługującego merge. Domyślnie, Git przekazuje te argumenty do programu obsługującego pokazywanie różnic:

<!-- The diff wrapper checks to make sure seven arguments are provided and passes two of them to your merge script. By default, Git passes the following arguments to the diff program: -->

	ścieżka stary-plik stara-wartość-hex stary-tryb nowy-plik nowa-wartość-hex nowy-tryb

<!-- 	path old-file old-hex old-mode new-file new-hex new-mode -->

Ponieważ chcesz tylko argumentów `stary-plik` i `nowy-plik`, w skrypcie przekazujesz tylko te które potrzebujesz.

<!-- Because you only want the `old-file` and `new-file` arguments, you use the wrapper script to pass the ones you need. -->

	$ cat /usr/local/bin/extDiff
	#!/bin/sh
	[ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

Musisz zwrócić uwagę, czy te skrypty mają poprawne uprawnienia:

<!-- You also need to make sure these tools are executable: -->

	$ sudo chmod +x /usr/local/bin/extMerge
	$ sudo chmod +x /usr/local/bin/extDiff

Teraz możesz ustawić swój plik konfiguracyjny, aby korzystał z innych niż domyślne programów do łączenia i rozwiązywania konfliktów. Dostępnych jest kilka opcji konfiguracyjnych: `merge.tool` wskazująca jaką strategię TODO

<!-- Now you can set up your config file to use your custom merge resolution and diff tools. This takes a number of custom settings: `merge.tool` to tell Git what strategy to use, `mergetool.*.cmd` to specify how to run the command, `mergetool.trustExitCode` to tell Git if the exit code of that program indicates a successful merge resolution or not, and `diff.external` to tell Git what command to run for diffs. So, you can either run four config commands -->

	$ git config --global merge.tool extMerge
	$ git config --global mergetool.extMerge.cmd \
	    'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
	$ git config --global mergetool.trustExitCode false
	$ git config --global diff.external extDiff

lub możesz wyedytować swój plik `~/.gitconfig` i dodać następujące linie:

<!-- or you can edit your `~/.gitconfig` file to add these lines: -->

	[merge]
	  tool = extMerge
	[mergetool "extMerge"]
	  cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
	  trustExitCode = false
	[diff]
	  external = extDiff

Po wprowadzeniu tych ustawień, jeżeli uruchomisz komendę diff w ten sposób:

<!-- After all this is set, if you run diff commands such as this: -->

	$ git diff 32d1776b1^ 32d1776b1

Zamiast wyniku pokazanego w wierszu poleceń, Git uruchomi P4Merge, pokazując wynik podobny do tego zamieszczonego na Rysunku 7-1.

<!-- Instead of getting the diff output on the command line, Git fires up P4Merge, which looks something like Figure 7-1. -->


![](http://git-scm.com/figures/18333fig0701-tn.png)

Figure 7-1. P4Merge.

Jeżeli spróbujesz wykonać łączenie (ang. merge) na dwóch gałęziach, które zakończy się konfliktem, możesz uruchomić komendę `git mergetool`; zostanie uruchomiony skrypt P4Merge, pozwalający na rozwiązanie konfliktów poprzez interfejs graficzny GUI.

<!-- If you try to merge two branches and subsequently have merge conflicts, you can run the command `git mergetool`; it starts P4Merge to let you resolve the conflicts through that GUI tool. -->

Zaletą tej konfiguracji jest to, że możesz zmienić łatwo zmienić narzędzia służące do porównywania (diff), oraz łączenia (merge). Na przykład, aby skrypty `extDiff` i `extMerge` uruchamiały KDiff3, musisz tylko zmienić plik `extMerge`:

<!-- The nice thing about this wrapper setup is that you can change your diff and merge tools easily. For example, to change your `extDiff` and `extMerge` tools to run the KDiff3 tool instead, all you have to do is edit your `extMerge` file: -->

	$ cat /usr/local/bin/extMerge
	#!/bin/sh
	/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

teraz, Git będzie używał programu KDiff3 podczas pokazywania różnic oraz rozwiązywania konfliktów.

<!-- Now, Git will use the KDiff3 tool for diff viewing and merge conflict resolution. -->

Git jest wstępnie skonfigurowany do używania wielu innych narzędzi do łączenia i rozwiązywania konfliktów, bez konieczności wprowadzania konfiguracji odpowiednich komend. Możesz wybrać narzędzia takie jak  kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff, oraz gvimdiff. Jeżeli nie chcesz używać KDiff3 do pokazywania różnic, ale chcesz aby dalej służył do rozwiązywania konfliktów, w przypadku gdy kdiff3 znajduje się w zmiennej środowiskowej PATH, możesz uruchomić

<!-- Git comes preset to use a number of other merge-resolution tools without your having to set up the cmd configuration. You can set your merge tool to kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff, or gvimdiff. If you’re not interested in using KDiff3 for diff but rather want to use it just for merge resolution, and the kdiff3 command is in your path, then you can run -->

	$ git config --global merge.tool kdiff3

Jeżeli uruchomić tę komendę, zamiast ustawienia plików `extMerge` i `extDiff`, Git będzie używał KDiff3 do rozwiązywania konfliktów i standardowego narzędzia Git diff do pokazywania różnic.

<!-- If you run this instead of setting up the `extMerge` and `extDiff` files, Git will use KDiff3 for merge resolution and the normal Git diff tool for diffs. -->

## Formatowanie i białe znaki

<!-- ## Formatting and Whitespace -->

Problemy związane z formatowaniem i białymi znakami są jednymi z bardziej uciążliwych i wyrafinowanych, które wielu deweloperów mogą spotkać podczas pracy, szczególnie jeżeli korzystają z różnych systemów operacyjnych. Bardzo łatwo można je wprowadzić w łatach lub modyfikacjach, poprzez samoistne dodanie ich przez edytor tekstowy, lub dodanie znaku powrotu karetki na końcach linii przez programistów korzystających z systemu Windows. Git posiada kilka opcji konfiguracyjnych, które pomagają rozwiązać te problemy.

<!-- Formatting and whitespace issues are some of the more frustrating and subtle problems that many developers encounter when collaborating, especially cross-platform. It’s very easy for patches or other collaborated work to introduce subtle whitespace changes because editors silently introduce them or Windows programmers add carriage returns at the end of lines they touch in cross-platform projects. Git has a few configuration options to help with these issues. -->

### core.autocrlf


Jeżeli programujesz na systemie Windows, lub używasz innego systemu, ale współpracujesz z osobami które programują na tym systemie, prawdopodobnie będziesz miał w pewnym momencie problemy związane ze znakami końca linii. Dzieje się tak dlatego, ponieważ system Windows używa obu znaków powrotu karetki i nowej linii w celu oznaczenia końca wiersza w swoich plikach, a tymczasem w systemach Mac i Linux użwany jest jedynie znak nowej linii. To jest subtelny, ale bardzo irytujący fakt przy współpracy na wielu platformach.

<!-- If you’re programming on Windows or using another system but working with people who are programming on Windows, you’ll probably run into line-ending issues at some point. This is because Windows uses both a carriage-return character and a linefeed character for newlines in its files, whereas Mac and Linux systems use only the linefeed character. This is a subtle but incredibly annoying fact of cross-platform work. -->

Git może to obsłużyć poprzez automatyczną konwersję linii CRLF na LF, gdy wykonujesz commit, i odwrotnie podczas pobierania kodu na dysk. Możesz włączyć tą funkcjonalność za pomocą ustawienia `core.autocrlf`. Jeżeli pracujesz na systemie Windows, ustaw jej wartość na `true` - zamieni to znaki LF na CRLS podczas pobierania kodu.

<!-- Git can handle this by auto-converting CRLF line endings into LF when you commit, and vice versa when it checks out code onto your filesystem. You can turn on this functionality with the `core.autocrlf` setting. If you’re on a Windows machine, set it to `true` — this converts LF endings into CRLF when you check out code: -->

	$ git config --global core.autocrlf true

Jeżeli pracujesz na systemie Linux lub Mac, który używa znaków LF oznaczających koniec wiersza, nie będziesz chciał, aby Git automatycznie konwertował je podczas pobierania kodu; jednakże, jeżeli zostanie przez pomyłkę wgrany plik z zakończeniami CRLF, możesz chcieć aby Git je poprawił. Możesz wskazać Git, aby konwertował znaki CRLF na LF podczas commita, ale nie w odwrotną stronę ustawiając `core.autocrlf` na input:

<!-- If you’re on a Linux or Mac system that uses LF line endings, then you don’t want Git to automatically convert them when you check out files; however, if a file with CRLF endings accidentally gets introduced, then you may want Git to fix it. You can tell Git to convert CRLF to LF on commit but not the other way around by setting `core.autocrlf` to input: -->

	$ git config --global core.autocrlf input

Takie ustawienia powinny zachować znaki CRLF na systemach Windows, oraz LF na systemach Mac i Linux, oraz w repozytorium.

<!-- This setup should leave you with CRLF endings in Windows checkouts but LF endings on Mac and Linux systems and in the repository. -->

Jeżeli jesteś programistą tworzącym aplikację przeznaczoną wyłącznie na systemy Windows, możesz zupełnie wyłączyć tą funkcjonalność przez ustawienie wartości false, przez co znaki powrotu karetki również będą zapisywanie w repozytorium.

<!-- If you’re a Windows programmer doing a Windows-only project, then you can turn off this functionality, recording the carriage returns in the repository by setting the config value to `false`: -->

	$ git config --global core.autocrlf false

### core.whitespace

Git comes preset to detect and fix some whitespace issues. It can look for four primary whitespace issues — two are enabled by default and can be turned off, and two aren’t enabled by default but can be activated.

The two that are turned on by default are `trailing-space`, which looks for spaces at the end of a line, and `space-before-tab`, which looks for spaces before tabs at the beginning of a line.

The two that are disabled by default but can be turned on are `indent-with-non-tab`, which looks for lines that begin with eight or more spaces instead of tabs, and `cr-at-eol`, which tells Git that carriage returns at the end of lines are OK.

You can tell Git which of these you want enabled by setting `core.whitespace` to the values you want on or off, separated by commas. You can disable settings by either leaving them out of the setting string or prepending a `-` in front of the value. For example, if you want all but `cr-at-eol` to be set, you can do this:

	$ git config --global core.whitespace \
	    trailing-space,space-before-tab,indent-with-non-tab

Git will detect these issues when you run a `git diff` command and try to color them so you can possibly fix them before you commit. It will also use these values to help you when you apply patches with `git apply`. When you’re applying patches, you can ask Git to warn you if it’s applying patches with the specified whitespace issues:

	$ git apply --whitespace=warn <patch>

Or you can have Git try to automatically fix the issue before applying the patch:

	$ git apply --whitespace=fix <patch>

These options apply to the `git rebase` command as well. If you’ve committed whitespace issues but haven’t yet pushed upstream, you can run a `rebase` with the `--whitespace=fix` option to have Git automatically fix whitespace issues as it’s rewriting the patches.

## Server Configuration

Not nearly as many configuration options are available for the server side of Git, but there are a few interesting ones you may want to take note of.

### receive.fsckObjects

By default, Git doesn’t check for consistency all the objects it receives during a push. Although Git can check to make sure each object still matches its SHA-1 checksum and points to valid objects, it doesn’t do that by default on every push. This is a relatively expensive operation and may add a lot of time to each push, depending on the size of the repository or the push. If you want Git to check object consistency on every push, you can force it to do so by setting `receive.fsckObjects` to true:

	$ git config --system receive.fsckObjects true

Now, Git will check the integrity of your repository before each push is accepted to make sure faulty clients aren’t introducing corrupt data.

### receive.denyNonFastForwards

If you rebase commits that you’ve already pushed and then try to push again, or otherwise try to push a commit to a remote branch that doesn’t contain the commit that the remote branch currently points to, you’ll be denied. This is generally good policy; but in the case of the rebase, you may determine that you know what you’re doing and can force-update the remote branch with a `-f` flag to your push command.

To disable the ability to force-update remote branches to non-fast-forward references, set `receive.denyNonFastForwards`:

	$ git config --system receive.denyNonFastForwards true

The other way you can do this is via server-side receive hooks, which I’ll cover in a bit. That approach lets you do more complex things like deny non-fast-forwards to a certain subset of users.

### receive.denyDeletes

One of the workarounds to the `denyNonFastForwards` policy is for the user to delete the branch and then push it back up with the new reference. In newer versions of Git (beginning with version 1.6.1), you can set `receive.denyDeletes` to true:

	$ git config --system receive.denyDeletes true

This denies branch and tag deletion over a push across the board — no user can do it. To remove remote branches, you must remove the ref files from the server manually. There are also more interesting ways to do this on a per-user basis via ACLs, as you’ll learn at the end of this chapter.
