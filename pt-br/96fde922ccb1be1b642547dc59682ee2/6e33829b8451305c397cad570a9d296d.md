# Gerando Sua Chave Pública SSH

Vários servidores Git autenticam usando chaves públicas SSH. Para fornecer uma chave pública, cada usuário no seu sistema deve gerar uma se eles ainda não a possuem. Este processo é similar entre os vários sistemas operacionais. Primeiro, você deve checar para ter certeza que você ainda não possui uma chave. Por padrão, as chaves SSH de um usuário são armazenadas no diretório `~/.ssh`. Você pode facilmente verificar se você tem uma chave indo para esse diretório e listando o seu conteúdo:

    $ cd ~/.ssh
    $ ls
    authorized_keys2  id_dsa       known_hosts
    config            id_dsa.pub

Você está procurando por um par de arquivos chamados _algo_ e _algo.pub_, onde _algo_ é normalmente `id_dsa` ou `id_rsa`. O arquivo `.pub` é a sua chave pública, e o outro arquivo é a sua chave privada. Se você não tem estes arquivos (ou não tem nem mesmo o diretório `.ssh`), você pode criá-los executando um programa chamado `ssh-keygen`, que é fornecido com o pacote SSH em sistemas Linux/Mac e vem com o pacote MSysGit no Windows:

    $ ssh-keygen
    Generating public/private rsa key pair.
    Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /Users/schacon/.ssh/id_rsa.
    Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
    The key fingerprint is:
    43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local

Primeiro ele confirma onde você quer salvar a chave (`.ssh/id_rsa`), e então pergunta duas vezes por uma senha, que você pode deixar em branco se você não quiser digitar uma senha quando usar a chave.

Agora, cada usuário que executar o comando acima precisa enviar a chave pública para você ou para o administrador do seu servidor Git (assumindo que você está usando um servidor SSH cuja configuração necessita de chaves públicas). Tudo o que eles precisam fazer é copiar o conteúdo do arquivo `.pub` e enviar para você via e-mail. As chaves públicas são parecidas com isso.

    $ cat ~/.ssh/id_rsa.pub
    ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
    GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
    Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
    t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
    mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
    NrRFi9wrf+M7Q== schacon@agadorlaptop.local

Para um tutorial mais detalhado sobre criação de chaves SSH em vários sistemas operacionais, veja o guia do GitHub sobre chaves SSH no endereço `http://github.com/guides/providing-your-ssh-key`.
