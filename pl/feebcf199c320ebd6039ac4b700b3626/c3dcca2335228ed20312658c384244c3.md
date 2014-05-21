# Konfiguracja serwera

Spróbujmy więc prześledzić proces ustawienia dostępu SSH po stronie serwera. Aby tego dokonać użyjesz metody 'authorized_keys' aby uwierzytelnić twoich użytkowników. Zakładamy również ze pracujesz na standardowej instalacji Linux (np. Ubuntu). Pierwszym krokiem będzie utworzenie użytkownika 'git' i lokalizacji '.ssh' dla tegoż użytkownika.

    $ sudo adduser git
    $ su git
    $ cd
    $ mkdir .ssh

Następnie potrzebujesz dodać klucz SSH programisty do pliku 'authorized_keys' dla tego użytkownika. Załóżmy ze otrzymałeś kilka kluczy mailem i zapisałeś je w pliku tymczasowym. Klucze publiczne wyglądać będą podobnie do tego:

    $ cat /tmp/id_rsa.john.pub
    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
    ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
    Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
    Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
    O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
    dAv8JggJICUvax2T9va5 gsg-keypair

Załączasz do nich twój plik 'authorized keys':

    $ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
    $ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
    $ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Od tego momentu możesz ustawić puste repozytorium poprzez komendę 'git init' z opcja '--bare', która zainicjuje repozytorium bez ścieżki roboczej:

    $ cd /opt/git
    $ mkdir project.git
    $ cd project.git
    $ git --bare init

Teraz John, Josie lub Jessica ma możliwość wykonania komendy push (wysłania) pierwszej wersji projektu do repozytorium poprzez dodanie go (projektu) jako zdalny (remote) oraz wysłanie całej gałęzi projektu. Aby tego dokonać należy połączyć się poprzez shell z maszyną i utworzyć nowe repozytorium za każdym razem kiedy chcemy dodać projekt. Użyjmy `gitserver` jako nazwę serwera, na którym ustawisz użytkownika `git` oraz repozytorium. Jeżeli odpalasz je lokalnie i ustawiasz DNS jako `gitserver` do połączenia z tym serwerem, wtedy będziesz mógł użyć poniższych komend:

    # on Johns computer
    $ cd myproject
    $ git init
    $ git add .
    $ git commit -m 'initial commit'
    $ git remote add origin git@gitserver:/opt/git/project.git
    $ git push origin master

W tym momencie użytkownicy mogą klonować (clone) projekt i wysyłać (push) zmiany w prosty sposób:

    $ git clone git@gitserver:/opt/git/project.git
    $ vim README
    $ git commit -am 'fix for the README file'
    $ git push origin master

Używając powyższej metody możesz łatwo utworzyć serwer Git (odczyt/zapis) dla grupki użytkowników.

Jako dodatkowy środek ostrożności możesz zastrzec dostęp do komend dla danego użytkownika `git` poprzez narzędzie `git-shell`, które dostępne jest wraz z Git. Jeżeli ustawisz je jako shell do logowania dla twojego danego użytkownika, to ten użytkownik nie będzie miał pełnego dostępu do twojego serwera. Aby użyć tej opcji ustaw `git-shell` zamiast bash lub csh dla shellu tegoż użytkownika. Aby to zrobić edytuj plik `/etc/passwd`:

    $ sudo vim /etc/passwd

Gdzieś na dole znajdziesz linie podobną do poniższej:

    git:x:1000:1000::/home/git:/bin/sh

Zamień `/bin/sh` na `/usr/bin/git-shell` (lub odpal  `which git-shell` aby znaleźć lokalizację). Linia powinna być podobna do poniższej:

    git:x:1000:1000::/home/git:/usr/bin/git-shell

Teraz użytkownik `git` może użyć połączenia SSH tylko do wysłania i odebrania repozytorium Git, nie możne natomiast uzyskać dostępu do powłoki serwera. Serwer odpowie informacją podobną do:

    $ ssh git@gitserver
    fatal: What do you think I am? A shell?
    Connection to gitserver closed.
