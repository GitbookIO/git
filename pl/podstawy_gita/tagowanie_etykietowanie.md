# Tagowanie (etykietowanie)

Podobnie jak większość systemów kontroli wersji, Git posiada możliwość etykietowania konkretnych, ważnych miejsc w historii. Ogólnie, większość użytkowników korzysta z tej możliwości do zaznaczania ważnych wersji kodu (np. wersja 1.0, itd.). Z tego rozdziału dowiesz się jak wyświetlać dostępne etykiety, jak tworzyć nowe oraz jakie rodzaje tagów rozróżniamy.

## Listowanie etykiet

Wyświetlanie wszystkich dostępnych tagów w Gitcie jest bardzo proste. Wystarczy uruchomić `git tag`:

	$ git tag
	v0.1
	v1.3

Polecenie wyświetla etykiety w porządku alfabetycznym; porządek w jakim się pojawią nie ma jednak faktycznego znaczenia.

Możesz także wyszukiwać etykiety za pomocą wzorca. Na przykład, repozytorium kodu źródłowego Gita zawiera ponad 240 tagów. Jeśli interesuje cię np. wyłącznie seria 1.4.2, możesz ją wyszukać w następujący sposób:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Tworzenie etykiet

Git używa 2 głównych rodzajów etykiet: lekkich i opisanych. Pierwsze z nich - lekkie - zachowują się mniej więcej tak jak gałąź, która się nie zmienia - jest to tylko wskaźnik do konkretnej rewizji. Z kolei, etykiety opisane są przechowywane jako pełne obiekty w bazie danych Gita. Są one opatrywane sumą kontrolną, zawierają nazwisko osoby etykietującej, jej adres e-mail oraz datę; ponadto, posiadają notkę etykiety, oraz mogą być podpisywane i weryfikowane za pomocą GNU Privacy Guard (GPG). Ogólnie zaleca się aby przy tworzeniu etykiet opisanych uwzględniać wszystkie te informacje; a jeżeli potrzebujesz jedynie etykiety tymczasowej albo z innych powodów nie potrzebujesz tych wszystkich danych, możesz po prostu użyć etykiety lekkiej.

## Etykiety opisane

Tworzenie etykiety opisanej, jak większość rzeczy w Gitcie, jest proste. Wystarczy podać parametr `-a` podczas uruchamiania polecenia `tag`:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

Parametr `-m` określa notkę etykiety, która jest wraz z nią przechowywania. Jeśli nie podasz treści notki dla etykiety opisowej, Git uruchomi twój edytor tekstu gdzie będziesz mógł ją dodać.

Dane etykiety wraz z tagowaną rewizją możesz zobaczyć używając polecenia `git show`:

	$ git show v1.4
	tag v1.4
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 14:45:11 2009 -0800

	my version 1.4
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Jak widać została wyświetlona informacja o osobie etykietującej, data stworzenia etykiety, oraz notka poprzedzająca informacje o rewizji:

## Podpisane etykiety

Swoją etykietę możesz podpisać prywatnym kluczem używając GPG. Wystarczy w tym celu użyć parametru `-s` zamiast `-a`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Po uruchomieniu na etykiecie polecenia `git show`, zobaczysz, że został dołączony do niej podpis GPG:

	$ git show v1.5
	tag v1.5
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:22:20 2009 -0800

	my signed 1.5 tag
	-----BEGIN PGP SIGNATURE-----
	Version: GnuPG v1.4.8 (Darwin)

	iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
	Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
	=WryJ
	-----END PGP SIGNATURE-----
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Nieco później, zobaczysz w jaki sposób można weryfikować podpisane etykiety.

## Etykiety lekkie

Innym sposobem na tagowanie rewizji są etykiety lekkie. Jest to w rzeczy samej suma kontrolna rewizji przechowywana w pliku - nie są przechowywane żadne inne, dodatkowe informacje. Aby stworzyć lekką etykietę, nie przekazuj do polecenia tag żadnego z parametrów `-a`, `-s` czy `-m`:

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Uruchamiając teraz na etykiecie `git show` nie zobaczysz żadnych dodatkowych informacji. Polecenie wyświetli jedynie:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Weryfikowanie etykiet

Do weryfikacji etykiety używa się polecenia `git tag -v [nazwa-etykiety]`. Polecenie używa GPG do zweryfikowania podpisu. Żeby mogło zadziałać poprawnie potrzebujesz oczywiście publicznego klucza osoby podpisującej w swoim keyring-u:

	$ git tag -v v1.4.2.1
	object 883653babd8ee7ea23e6a5c392bb739348b1eb61
	type commit
	tag v1.4.2.1
	tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

	GIT 1.4.2.1

	Minor fixes since 1.4.2, including git-mv and git-http with alternates.
	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
	gpg:                 aka "[jpeg image of size 1513]"
	Primary key fingerprint: 3565 2A26 2040 E066 C9A7  4A7D C0C6 D9A4 F311 9B9A

Jeśli nie posiadasz klucza publicznego osoby podpisującej, otrzymasz następujący komunikat:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Etykietowanie historii

Możesz także etykietować historyczne rewizje. Załóżmy, że historia zmian wygląda następująco:

	$ git log --pretty=oneline
	15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
	a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
	0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
	6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
	0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
	4682c3261057305bdd616e23b64b0857d832627b added a todo file
	166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
	9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
	964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
	8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme

Teraz, załóżmy, że zapomniałeś oznaczyć projektu jako wersja 1.2, do której przeszedł on wraz z rewizją "updated rakefile". Możesz dodać etykietę już po fakcie. W tym celu wystarczy na końcu polecenia `git tag` podać sumę kontrolną lub jej część wskazującą na odpowiednią rewizję:

	$ git tag -a v1.2 9fceb02

Aby sprawdzić czy etykieta została stworzona wpisz:

	$ git tag 
	v0.1
	v1.2
	v1.3
	v1.4
	v1.4-lw
	v1.5

	$ git show v1.2
	tag v1.2
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:32:16 2009 -0800

	version 1.2
	commit 9fceb02d0ae598e95dc970b74767f19372d61af8
	Author: Magnus Chacon <mchacon@gee-mail.com>
	Date:   Sun Apr 27 20:43:35 2008 -0700

	    updated rakefile
	...

## Współdzielenie etykiet

Domyślnie, polecenie `git push` nie przesyła twoich etykiet do zdalnego repozytorium. Będziesz musiał osobno wypchnąć na współdzielony serwer stworzone etykiety. Proces ten jest podobny do współdzielenia gałęzi i polega na uruchomieniu `git push origin [nazwa-etykiety]`.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Jeśli masz mnóstwo tagów, którymi chciałbyś się podzielić z innymi, możesz je wszystkie wypchnąć jednocześnie dodając do `git push` opcję `--tags`. W ten sposób zostaną przesłane wszystkie tagi, których nie ma jeszcze na serwerze.

	$ git push origin --tags
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	 * [new tag]         v0.1 -> v0.1
	 * [new tag]         v1.2 -> v1.2
	 * [new tag]         v1.4 -> v1.4
	 * [new tag]         v1.4-lw -> v1.4-lw
	 * [new tag]         v1.5 -> v1.5

Jeśli ktokolwiek inny sklonuje lub pobierze zmiany teraz z twojego repozytorium, dostanie także wszystkie twoje etykiety.
