# Protokoły transferu

<!-- # Transfer Protocols -->

Git może przesyłać dane między repozytoriami na dwa główne sposoby: poprzez protokół HTTP oraz poprzez tak zwane inteligentne protokoły, używane transportach `file://`, `ssh://` oraz `git://`. Ten rodział szybko pokaże w jaki sposób te protokoły działają.

<!-- Git can transfer data between two repositories in two major ways: over HTTP and via the so-called smart protocols used in the `file://`, `ssh://`, and `git://` transports. This section will quickly cover how these two main protocols operate. -->

## Protokół prosty

<!-- ## The Dumb Protocol -->

Transfer danych za pomocą protokołu HTTP jest często określany jako transfer prosty, ponieważ do jego działania nie jest wymagana obsługa Git na serwerze. Podczas pobierania danych za pomocą komendy "fetch", wykonywane są kolejno zapytania GET, z których program kliencki może odnaleźć strukturę repozytorium Git. Prześledźmy proces `http-fetch` dla biblioteki simplegit:

<!-- Git transport over HTTP is often referred to as the dumb protocol because it requires no Git-specific code on the server side during the transport process. The fetch process is a series of GET requests, where the client can assume the layout of the Git repository on the server. Let’s follow the `http-fetch` process for the simplegit library: -->

    $ git clone http://github.com/schacon/simplegit-progit.git

Pierwszą rzeczą jaką wykonuje ta komenda, jest pobranie pliku `info/refs`. Plik ten jest zapisywany przez komendę `update-server-info`, dlatego też musisz włączyć komendę `post-receive`, aby przesyłanie danych przez HTTP działało poprawnie:

<!-- The first thing this command does is pull down the `info/refs` file. This file is written by the `update-server-info` command, which is why you need to enable that as a `post-receive` hook in order for the HTTP transport to work properly: -->

    => GET info/refs
    ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

Masz teraz listę zdalnych referencji oraz ich sumy SHA. Następnie sprawdzasz co znajduje się w HEAD, tak aby było wiadomo jaką gałąź pobrać po zakończeniu:

<!-- Now you have a list of the remote references and SHAs. Next, you look for what the HEAD reference is so you know what to check out when you’re finished: -->

    => GET HEAD
    ref: refs/heads/master

Musisz pobrać gałąź `master` po ukończeniu całego procesu.
W tym momencie możesz rozpocząć proces odnajdowania struktury repozytorium. Elementem początkowym jest commit `ca82a6`, który zobaczyłeś w pliku `info/refs`, pobierz go jako pierwszego:

<!-- You need to check out the `master` branch when you’ve completed the process.
At this point, you’re ready to start the walking process. Because your starting point is the `ca82a6` commit object you saw in the `info/refs` file, you start by fetching that: -->

    => GET objects/ca/82a6dff817ec66f44342007202690a93763949
    (179 bytes of binary data)

Otrzymujesz w odpowiedzi obiekt - pobrany z serwera obiekt jest w luźnym formacie i został pobrany poprzez zapytanie HTTP GET. Możesz rozpakować ten plik, usunąć nagłówki i odczytać jego zawartość:

<!-- You get an object back — that object is in loose format on the server, and you fetched it over a static HTTP GET request. You can zlib-uncompress it, strip off the header, and look at the commit content: -->

    $ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
    tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
    parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    author Scott Chacon <schacon@gmail.com> 1205815931 -0700
    committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

    changed the version number

W następnej kolejności masz dwa obiekty do pobrania - `cfda3b`, który jest obiektem tree z zawartością na którą wskazuje pobrany commit; oraz `085bb3`, który jest poprzednim commitem:

<!-- Next, you have two more objects to retrieve — `cfda3b`, which is the tree of content that the commit we just retrieved points to; and `085bb3`, which is the parent commit: -->

    => GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    (179 bytes of data)

Otrzymałeś więc kolejny obiekt commit. Pobierz zawartość obiektu tree:

<!-- That gives you your next commit object. Grab the tree object: -->

    => GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
    (404 - Not Found)

Oops - wygląda na to, że obiekt tree nie jest w luźnym formacie na serwerze, dlatego otrzymałeś odpowiedź 404. Przyczyn takiego stanu rzeczy może być kilka - obiekt może być w alternatywnym repozytorium, lub może być w pliku packfile w tym samym repozytorium. Git najpierw sprawdza czy są jakieś alternatywne repozytoria dodane:

<!-- Oops — it looks like that tree object isn’t in loose format on the server, so you get a 404 response back. There are a couple of reasons for this — the object could be in an alternate repository, or it could be in a packfile in this repository. Git checks for any listed alternates first: -->

    => GET objects/info/http-alternates
    (empty file)

Jeżeli zwrócona zostanie lista alternatywnych adresów URL, Git sprawdzi czy istnieją w nich szukane pliki w luźnym formacie lub spakowane pliki packfile - jest to bardzo fajny mechanizm umożliwiający współdzielenie plików dla projektów które rozwidlają się (ang. fork) jeden od drugiego. Jednak, ze względu na to, że nie ma żadnych alternatywnych plików w tym przykładzie, szukany obiekt musi być w spakowanym pliku packfile. Aby zobaczyć jakie pliki packfile są dostępne na serwerze, musisz pobrać plik `objects/info/packs` zawierający ich listę (ten plik jest również tworzony przez `update-server-info`):

<!-- If this comes back with a list of alternate URLs, Git checks for loose files and packfiles there — this is a nice mechanism for projects that are forks of one another to share objects on disk. However, because no alternates are listed in this case, your object must be in a packfile. To see what packfiles are available on this server, you need to get the `objects/info/packs` file, which contains a listing of them (also generated by `update-server-info`): -->

    => GET objects/info/packs
    P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Jest tylko jeden plik packfile na serwerze, więc szukany obiekt jest na pewno w nim, sprawdź jednak plik indeks aby mieć pewność. Jest to również przydatne, gdy masz wiele plików packfile na serwerze, tak abyś mógł zobaczyć który z nich zawiera obiekt którego szukasz:

<!-- There is only one packfile on the server, so your object is obviously in there, but you’ll check the index file to make sure. This is also useful if you have multiple packfiles on the server, so you can see which packfile contains the object you need: -->

    => GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
    (4k of binary data)

Teraz, gdy pobrałeś już indeks pliku packfile, możesz zobaczyć jakie obiekty się w nim znajdują - ponieważ zawiera on listę sum SHA obiektów oraz informacje o tym w którym miejscu w pliku packfile ten obiekt się znajduje. Twój obiekt w nim jest, pobierz więc cały plik packfile:

<!-- Now that you have the packfile index, you can see if your object is in it — because the index lists the SHAs of the objects contained in the packfile and the offsets to those objects. Your object is there, so go ahead and get the whole packfile: -->

    => GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
    (13k of binary data)

Masz już obiekt tree, możesz więc kontynuować przechodzenie przez wszystkie zmiany. Wszystkie one zawarte są również w pliku packfile który właśnie pobrałeś, nie musisz więc wykonywać żadnych dodatkowych zapytań do serwera. Git pobierze kopię roboczą z gałęzi `master`, na którą wskazywała referencja pobrana z HEAD na początku całego procesu.

<!-- You have your tree object, so you continue walking your commits. They’re all also within the packfile you just downloaded, so you don’t have to do any more requests to your server. Git checks out a working copy of the `master` branch that was pointed to by the HEAD reference you downloaded at the beginning. -->

Wynik działania całego procesu wygląda tak:

<!-- The entire output of this process looks like this: -->

    $ git clone http://github.com/schacon/simplegit-progit.git
    Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
    got ca82a6dff817ec66f44342007202690a93763949
    walk ca82a6dff817ec66f44342007202690a93763949
    got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Getting alternates list for http://github.com/schacon/simplegit-progit.git
    Getting pack list for http://github.com/schacon/simplegit-progit.git
    Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
    Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
     which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
    walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    walk a11bef06a3f659402fe7563abf99ad00de2209e6

## Protokół Inteligentny

<!-- ## The Smart Protocol -->

Metoda pobierania za pomocą HTTP jest prosta, ale nieefektywna. Używanie protokołów inteligentnych jest znacznie częstszym sposobem do transferu danych. Te protokołu posiadają uruchomiony program na drugim końcu połączenia, który zna działanie Gita - może on odczytywać lokalne dane, oraz może wygenerować dane dla konkretnego klienta na podstawie tego jakie informacje on już posiada. Są dwa rodzaje procesów do przesyłania danych: para procesów do wgrywania danych, oraz para do pobierania.

<!-- The HTTP method is simple but a bit inefficient. Using smart protocols is a more common method of transferring data. These protocols have a process on the remote end that is intelligent about Git — it can read local data and figure out what the client has or needs and generate custom data for it. There are two sets of processes for transferring data: a pair for uploading data and a pair for downloading data. -->

### Wgrywanie Danych

<!-- ### Uploading Data -->

Aby wgrać dane do zdalnego repozytorium, Git używa procesów `send-pack` oraz `receive-pack`. Proces `send-pack` uruchomiony jest po stronie klienta i łączy się do procesu `receive-pack` uruchomionego na zdalnym serwerze.

<!-- To upload data to a remote process, Git uses the `send-pack` and `receive-pack` processes. The `send-pack` process runs on the client and connects to a `receive-pack` process on the remote side. -->

Na przykład, załóżmy że uruchamiasz `git push origin master` w swoim projekcie, a `origin` jest zdefiniowany jako URL używający protokołu ssh. Git uruchamia proces `send-pack`, który zainicjuje połączenie przez SSH do Twojego serwera. Uruchamia on komendę na zdalnym serwerze przez SSH, podobną do:

<!-- For example, say you run `git push origin master` in your project, and `origin` is defined as a URL that uses the SSH protocol. Git fires up the `send-pack` process, which initiates a connection over SSH to your server. It tries to run a command on the remote server via an SSH call that looks something like this: -->

    $ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
    005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
    003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
    0000

Komenda `git-receive-pack` od razu odpowiada jedną linią dla każdej referencji którą aktualnie zawiera - w tym przypadku, tylko gałąź `master` oraz jej SHA. Pierwsza linia zawiera również listę funkcji serwera (tutaj `report-status` i `delete-refs`).

<!-- The `git-receive-pack` command immediately responds with one line for each reference it currently has — in this case, just the `master` branch and its SHA. The first line also has a list of the server’s capabilities (here, `report-status` and `delete-refs`). -->

Każda linia rozpoczyna się 4-bajtową wartością hex wskazującą na to, jak długa jest reszta linii. Pierwsza linia rozpoczyna się 005b, co daje 91 w hex, co oznacza że 91 bajtów pozostało w tej linii. Następna linia rozpoczyna się od 003e, czyli 62, odczytujesz więc pozostałe 62 bajty. Kolejna linia to 0000, oznaczająca że serwer zakończył listowanie referencji.

<!-- Each line starts with a 4-byte hex value specifying how long the rest of the line is. Your first line starts with 005b, which is 91 in hex, meaning that 91 bytes remain on that line. The next line starts with 003e, which is 62, so you read the remaining 62 bytes. The next line is 0000, meaning the server is done with its references listing. -->

Teraz, gdy zna on już stan który jest na serwerze, Twój proces `send-pack` ustala które z posiadanych commitów nie istnieją na serwerze. Dla każdej referencji która zostanie zaktualizowana podczas tego pusha, proces `send-pack` przekazuje `receive-pack` te informacje. Na przykład, jeżeli aktualizujesz gałąź `master` oraz dodajesz gałąź `experiment`, odpowiedź `send-pack` może wyglądać tak:

<!-- Now that it knows the server’s state, your `send-pack` process determines what commits it has that the server doesn’t. For each reference that this push will update, the `send-pack` process tells the `receive-pack` process that information. For instance, if you’re updating the `master` branch and adding an `experiment` branch, the `send-pack` response may look something like this: -->

    0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
    00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
    0000

Wartość SHA-1 składająca się z samych '0' oznacza że nic nie było wcześniej - ponieważ dodajesz referencję experiment. Jeżeli usuwasz referencję, zobaczyć sytuację odwrotną: same zera po prawej stronie.

<!-- The SHA-1 value of all '0's means that nothing was there before — because you’re adding the experiment reference. If you were deleting a reference, you would see the opposite: all '0's on the right side. -->

Git wysyła linię dla każdej referencji którą aktualizujesz z starą sumą SHA, nową sumą SHA, oraz referencję. Pierwsza linia zawiera również funkcje obsługiwane prze klienta. Następnie, program kliencki wysyła plik packfile zawierający wszystkie obiekty których nie ma na serwerze. Na końcu, serwer wysyła odpowiedź wskazująca na poprawne lub błędne zakończenie: 

<!-- Git sends a line for each reference you’re updating with the old SHA, the new SHA, and the reference that is being updated. The first line also has the client’s capabilities. Next, the client uploads a packfile of all the objects the server doesn’t have yet. Finally, the server responds with a success (or failure) indication: -->

    000Aunpack ok

### Pobieranie Danych

<!-- ### Downloading Data -->

Podczas pobierania danych, procesy `fetch-pack` oraz `upload-pack` są używane. Po stronie klienta uruchamiany jest proces `fetch-pack`, łączący się do `upload-pack` na drugim końcu, w celu ustalenia które dane mają być pobrane.

<!-- When you download data, the `fetch-pack` and `upload-pack` processes are involved. The client initiates a `fetch-pack` process that connects to an `upload-pack` process on the remote side to negotiate what data will be transferred down. -->

Istnieją różne sposoby na zainicjowanie procesu `upload-pack` na zdalnym repozytorium. Możesz uruchomić przez SSH, w sposób podobny do procesu `receive-pack`. Możesz również zainicjować ten proces przez demona Git, który domyślnie nasłuchuje na serwerze na porcie 9418. Proces `fetch-pack` wysyła dane, które wyglądają tak jak te, po połączeniu:

<!-- There are different ways to initiate the `upload-pack` process on the remote repository. You can run via SSH in the same manner as the `receive-pack` process. You can also initiate the process via the Git daemon, which listens on a server on port 9418 by default. The `fetch-pack` process sends data that looks like this to the daemon after connecting: -->

    003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Rozpoczyna się ona 4 bajtami wskazującymi na to, ile danych będzie przesłanych, następnie komenda do uruchomienia zakończona znakiem null, a następnie nazwa domenowa serwera zakończona końcowym znakiem null. Demon Git sprawdza czy komenda może zostać uruchomiona, oraz czy repozytorium istnieje i ma publiczne uprawnienia. Jeżeli wszystko jest poprawnie, uruchamia proces `upload-pack` i przekazuje do niego zapytanie.

<!-- It starts with the 4 bytes specifying how much data is following, then the command to run followed by a null byte, and then the server’s hostname followed by a final null byte. The Git daemon checks that the command can be run and that the repository exists and has public permissions. If everything is cool, it fires up the `upload-pack` process and hands off the request to it. -->

jeżeli wykonujesz komendę fetch przez SSH, `fetch-pack` uruchamia komendę podobną do:

<!-- If you’re doing the fetch over SSH, `fetch-pack` instead runs something like this: -->

    $ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

W każdym z tym przypadków, po połączeniu `fetch-pack`, `upload-pack` zwraca wyniki podobny do:

<!-- In either case, after `fetch-pack` connects, `upload-pack` sends back something like this: -->

    0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
      side-band side-band-64k ofs-delta shallow no-progress include-tag
    003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
    003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
    0000

jest to bardzo podobna odpowiedź to tej którą zwrócił `receive-pack`, ale z innymi obsługiwanymi funkcjami. Dodatkowo, zwracana jest referencja HEAD, tak aby klient wiedział co ma pobrać w przypadku klonowania repozytorium.

<!-- This is very similar to what `receive-pack` responds with, but the capabilities are different. In addition, it sends back the HEAD reference so the client knows what to check out if this is a clone. -->

W tym momencie, proces `fetch-pack` sprawdza jakie obiekty posiada i wysyła odpowiedź z obiektami które potrzebuje za pomocą "want" oraz sumy SHA. Wysyła informację o tym jakie obiekty już posiada za pomocą "have" oraz SHA. Na końcu listy, wypisuje "done", aby proces `upload-pack` wiedział że ma rozpocząć wysyłanie spakowanych plików packfile z danymi które są potrzebne:

<!-- At this point, the `fetch-pack` process looks at what objects it has and responds with the objects that it needs by sending "want" and then the SHA it wants. It sends all the objects it already has with "have" and then the SHA. At the end of this list, it writes "done" to initiate the `upload-pack` process to begin sending the packfile of the data it needs: -->

    0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
    0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    0000
    0009done

To są bardzo proste przykłady protokołów przesyłania danych. W bardziej skomplikowanych, program kliencki wspiera funkcje `multi_pack` lub `side-band`; ale ten przykład pokazuje Ci podstawowe działanie inteligentnych protokołów.

<!-- That is a very basic case of the transfer protocols. In more complex cases, the client supports `multi_ack` or `side-band` capabilities; but this example shows you the basic back and forth used by the smart protocol processes. -->
