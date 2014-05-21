# Generacja pary kluczy SSH

Jak wspomniano wcześniej, wiele serwerów Git korzysta z uwierzytelnienia za pomocą kluczy publicznych SSH. Aby dostarczyć na serwer klucz publiczny SSH, każdy z użytkowników musi go wygenerować jeśli jeszcze takiego nie posiada. W każdym z systemów operacyjnych proces ten wygląda podobnie.
Po pierwsze należy sprawdzić, czy już nie posiadasz takiego klucza. Domyślnie klucze SSH użytkownika przechowywane są w katalogu domowym, w podkatalogu `.ssh`. Łatwo sprawdzić, czy masz już taki klucz wyświetlając zawartość tego katalogu:

    $ cd ~/.ssh
    $ ls
    authorized_keys2  id_dsa       known_hosts
    config            id_dsa.pub

Interesuje Cię para plików nazwanych `coś` oraz `coś.pub`, gdzie to `coś` to zwykle `id_dsa` albo `id_rsa`. Plik z rozszerzeniem `.pub` to klucz publiczny, a ten drugi to klucz prywatny. Jeśli nie masz tych plików (albo w ogóle katalogu `.ssh`) możesz utworzyć parę kluczy za pomocą programu `ssh-keygen`, który jest częścią pakietu narzędzi SSH w systemach Linux albo Mac. W systemie Windows program ten jest częścią dystrybucji MSysGit:

    $ ssh-keygen
    Generating public/private rsa key pair.
    Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /Users/schacon/.ssh/id_rsa.
    Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
    The key fingerprint is:
    43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

Najpierw program pyta gdzie zapisać klucze (`.ssh/id_rsa`), a potem dwukrotnie prosi o podanie hasła, które nie jest obowiązkowe, jeśli nie masz zamiaru za każdym razem go podawać, gdy chcesz użyć klucza.

Następnie każdy użytkownik powinien wysłać Ci albo komukolwiek, kto podaje się za administratora serwera Git swój klucz publiczny (wciąż zakładając, że korzystasz z serwera SSH, który wymaga korzystania z kluczy publicznych). Aby wysłać klucz wystarczy skopiować zawartość pliku `.pub` i wkleić go do e-maila. Klucz publiczny wygląda mniej więcej tak:

    $ cat ~/.ssh/id_rsa.pub
    ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
    GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
    Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
    t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
    mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
    NrRFi9wrf+M7Q== schacon@agadorlaptop.local

Więcej szczegółów i porad dotyczących tworzenia kluczy SSH w różnych systemach operacyjnych znajduje się w witrynie GitHub w podręczniku dotyczącym kluczy SSH pod adresem `http://github.com/guides/providing-your-ssh-key`.
