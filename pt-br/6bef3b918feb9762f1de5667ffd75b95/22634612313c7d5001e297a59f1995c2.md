# Submódulos

Freqüentemente enquanto você está trabalhando em um projeto, você precisa usar um outro projeto dentro dele. Talvez seja uma biblioteca desenvolvida por terceiros ou que você está desenvolvendo separadamente e usando em vários projetos pai. Um problema comum surge nestes cenários: você quer tratar os dois projetos em separado mas ainda ser capaz de usar um dentro do outro.

Aqui vai um exemplo. Digamos que você está desenvolvendo um site e criando Atom feeds. Em vez de criar seu próprio gerador de Atom, você decide usar uma biblioteca. Provavelmente você terá que incluir esse código de uma biblioteca compartilhada, como um instalação CPAN ou Ruby gem, ou copiar o código fonte na árvore do seu projeto. O problema com a inclusão da biblioteca é que é difícil de personalizar livremente e muitas vezes difícil de fazer o deploy dela, porque você precisa ter certeza de que cada cliente tem essa biblioteca disponível. O problema com a inclusão do código no seu projeto é que é difícil de fazer o merge de qualquer alteração que você faz quando existem modificações do desenvolvedor da biblioteca.

Git resolve esses problemas usando submódulos. Submódulos permitem que você mantenha um repositório Git como um subdiretório de outro repositório Git. Isso permite que você faça o clone de outro repositório dentro do seu projeto e mantenha seus commits separados.

## Começando com Submódulos

Digamos que você quer adicionar a biblioteca Rack (um servidor de aplicação web em Ruby) ao seu projeto, manter suas próprias alterações nela, mas continuar fazendo o merge do branch principal. A primeira coisa que você deve fazer é fazer o clone do repositório externo dentro do seu subdiretório. Você adiciona projetos externos como submódulos com o comando `git submodule add`:

    $ git submodule add git://github.com/chneukirchen/rack.git rack
    Initialized empty Git repository in /opt/subtest/rack/.git/
    remote: Counting objects: 3181, done.
    remote: Compressing objects: 100% (1534/1534), done.
    remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
    Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
    Resolving deltas: 100% (1951/1951), done.

Agora você tem um projeto do Rack no subdiretório `rack` dentro do seu projeto. Você pode ir nesse subdiretório, fazer alterações, adicionar seus próprios repositórios remotos para fazer o push de suas modificações, fazer o fetch e o merge do repositório original, e outras coisas. Se você execurar `git status` logo depois de adicionar o submódulo, você verá duas coisas:

    $ git status
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #      new file:   .gitmodules
    #      new file:   rack
    #

Primeiro você percebe o arquivo `.gitmodules`. Esse é um arquivo de configuração que guarda o mapeamento entre a URL do projeto e o subdiretório local que você usou:

    $ cat .gitmodules
    [submodule "rack"]
          path = rack
          url = git://github.com/chneukirchen/rack.git

Se você tem vários submódulos, você terá várias entradas nesse arquivo. É importante notar que esse arquivo está no controle de versão como os outros, como o seu arquivo `.gitignore`. É feito o push e pull com o resto do seu projeto. É como as outras pessoas que fazem o clone do projeto sabem onde pegar os projetos dos submódulos.

O outro ítem na saída do `git status` é sobre o rack. Se você executar `git diff` nele, você vê uma coisa interessante:

    $ git diff --cached rack
    diff --git a/rack b/rack
    new file mode 160000
    index 0000000..08d709f
    --- /dev/null
    +++ b/rack
    @@ -0,0 +1 @@
    +Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Apesar de `rack` ser um subdiretório no seu diretório de trabalho, Git vê ele como um submódulo e não rastreia seu conteúdo quando você não está no diretório. Em vez disso, Git o grava como um commit especial desse repositório. Quando você altera e faz commit nesse subdiretório, o projeto-pai nota que o HEAD mudou e grava o commit que você está atualmente; dessa forma, quando outros fizerem o clone desse projeto, eles podem recriar o mesmo ambiente.

Esse é um ponto importante sobre submódulos: você os salva como o commit exato onde eles estão. Você não pode salvar um submódulo no `master` ou em outra referência simbólica.

Quando você faz o commit, você vê algo assim:

    $ git commit -m 'first commit with submodule rack'
    [master 0550271] first commit with submodule rack
     2 files changed, 4 insertions(+), 0 deletions(-)
     create mode 100644 .gitmodules
     create mode 160000 rack

Note o modo 160000 para a entrada do rack. Esse é um modo especial no Git que basicamente significa que você está salvando um commit como um diretório em vez de um subdiretório ou um arquivo.

Você pode tratar o diretório `rack` como um projeto separado e atualizar seu projeto-pai de vez em quando com uma referência para o último commit nesse subprojeto. Todos os comandos do Git funcionam independente nos dois diretórios:

    $ git log -1
    commit 0550271328a0038865aad6331e620cd7238601bb
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Apr 9 09:03:56 2009 -0700

        first commit with submodule rack
    $ cd rack/
    $ git log -1
    commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
    Author: Christian Neukirchen <chneukirchen@gmail.com>
    Date:   Wed Mar 25 14:49:04 2009 +0100

        Document version change

## Fazendo Clone de um Projeto com Submódulos

Aqui você vai fazer o clone de um projeto com um submódulo dentro. Quando você recebe um projeto como este, você tem os diretórios que contêm os submódulos, mas nenhum dos arquivos ainda:

    $ git clone git://github.com/schacon/myproject.git
    Initialized empty Git repository in /opt/myproject/.git/
    remote: Counting objects: 6, done.
    remote: Compressing objects: 100% (4/4), done.
    remote: Total 6 (delta 0), reused 0 (delta 0)
    Receiving objects: 100% (6/6), done.
    $ cd myproject
    $ ls -l
    total 8
    -rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
    drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
    $ ls rack/
    $

O diretório `rack` está lá, mas vazio. Você precisa executar dois comandos: `git submodule init` para inicializar seu arquivo local de configuração, e `git submodule update` para buscar todos os dados do projeto e recuperar o commit apropriado conforme descrito em seu projeto-pai:

    $ git submodule init
    Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
    $ git submodule update
    Initialized empty Git repository in /opt/myproject/rack/.git/
    remote: Counting objects: 3181, done.
    remote: Compressing objects: 100% (1534/1534), done.
    remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
    Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
    Resolving deltas: 100% (1951/1951), done.
    Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

Agora seu subdiretório `rack` está na mesma situação que estava quando você fez o commit antes. Se outro desenvolvedor alterar o código de "rack" e fizer o commit, e você faz o pull e o merge, você vê algo um pouco estranho:

    $ git merge origin/master
    Updating 0550271..85a3eee
    Fast forward
     rack |    2 +-
     1 files changed, 1 insertions(+), 1 deletions(-)
    [master*]$ git status
    # On branch master
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #      modified:   rack
    #

Você fez o merge do que é basicamente um mudança para a referência do seu submódulo; mas isso não atualiza o código no diretório do submódulo, parece que você tem um estado sujo no seu diretório de trabalho:

    $ git diff
    diff --git a/rack b/rack
    index 6c5e70b..08d709f 160000
    --- a/rack
    +++ b/rack
    @@ -1 +1 @@
    -Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
    +Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

A causa disso é que a referência que você tem para o submódulo não é exatamente o que está no diretório do submódulo. Para corrigir isso, você precisa executar `git submodule update` novamente:

    $ git submodule update
    remote: Counting objects: 5, done.
    remote: Compressing objects: 100% (3/3), done.
    remote: Total 3 (delta 1), reused 2 (delta 0)
    Unpacking objects: 100% (3/3), done.
    From git@github.com:schacon/rack
       08d709f..6c5e70b  master     -> origin/master
    Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

Você tem que fazer isso toda as vezes que pegar uma alteração de um submódulo no projeto principal. É estranho, mas funciona.

Um problema comum acontece quando um desenvolvedor faz uma alteração local em submódulo mas não a envia para um servidor público. Em seguida, ele faz o commit de uma referência para esse estado que não é publico e faz o push do projeto-pai. Quando outros desenvolvedores tentam executar `git submodule update`, o sistema do submódulo não consegue achar o commit para essa referência, porque ela só existe no sistema daquele primeiro desenvolvedor. Se isso acontecer, você verá um erro como este:

    $ git submodule update
    fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
    Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

Você tem que ver quem alterou o submódulo pela última vez:

    $ git log -1 rack
    commit 85a3eee996800fcfa91e2119372dd4172bf76678
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Apr 9 09:19:14 2009 -0700

        added a submodule reference I will never make public. hahahahaha!

Em seguida, você envia um e-mail para esse cara e grita com ele.

## Superprojetos

Às vezes, desenvolvedores querem obter uma combinação de subdiretórios de um grande projeto, dependendo de qual equipe eles estão. Isso é comum se você está vindo do CVS ou Subversion, onde você define um módulo ou uma coleção de subdiretórios, e você quer manter esse tipo de fluxo de trabalho.

Uma boa maneira de fazer isso no Git é fazer cada subpasta um repositório Git separado e em seguida criar um repositório para um projeto-pai que contêm vários submódulos. A vantagem desse modo é que você pode definir mais especificamente os relacionamentos entre os projetos com tags e branches no projeto-pai.

## Problemas com Submódulos

Usar submódulos tem seus problemas. Primeiro, você tem que ser relativamente cuidadoso quando estiver trabalhando no diretório do submódulo. Quando você executa `git submodule update`, ele faz o checkout de uma versão específica do projeto, mas fora de um branch. Isso é chamado ter uma cabeça separada (detached HEAD) — isso significa que o HEAD aponta diretamente para um commit, não para uma referência simbólica. O problema é que geralmente você não quer trabalhar em um ambiente com o HEAD separado, porque é fácil perder alterações. Se você executar `submodule update`, fizer o commit no diretório do submódulo sem criar um branch para trabalhar, e em seguida executar `git submodule update` novamente no projeto-pai sem fazer commit nesse meio tempo, Git irá sobrescrever as alterações sem lhe informar. Tecnicamente você não irá perder o trabalho, mas você não terá um branch apontando para ele, por isso vai ser um pouco difícil de recuperá-lo.

Para evitar esse problema, crie um branch quando for trabalhar em um diretório de um submódulo com `git checkout -b work` ou algo equivalente. Quando você atualizar o submódulo pela segunda vez, ele ainda irá reverter seu trabalho, mas pelo menos você terá uma referência para retornar.

Mudar de branches que contêm submódulos também pode ser complicado. Se você criar um novo branch, adicionar um submódulo nele, e mudar para um branch que não tem o submódulo, você ainda terá o diretório do submódulo como um diretório que não está sendo rastreado:

    $ git checkout -b rack
    Switched to a new branch "rack"
    $ git submodule add git@github.com:schacon/rack.git rack
    Initialized empty Git repository in /opt/myproj/rack/.git/
    ...
    Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
    Resolving deltas: 100% (1952/1952), done.
    $ git commit -am 'added rack submodule'
    [rack cc49a69] added rack submodule
     2 files changed, 4 insertions(+), 0 deletions(-)
     create mode 100644 .gitmodules
     create mode 160000 rack
    $ git checkout master
    Switched to branch "master"
    $ git status
    # On branch master
    # Untracked files:
    #   (use "git add <file>..." to include in what will be committed)
    #
    #      rack/

Você tem que tirá-lo de lá ou removê-lo, em todo caso você tem que fazer o clone novamente quando você voltar — e você pode perder alterações ou branches locais que não foram enviados com um push.

O último problema que muitas pessoas encontram envolve mudar de subdiretórios para submódulos. Se você está rastreando arquivos no seu projeto e quer movê-los para um submódulo, você deve ser cuidadoso ou "o Git vai ficar com raiva de você". Digamos que você tem os arquivos do "rack" em um subdiretório do seu projeto, e você quer transformá-los em um submódulo. Se você apagar o subdiretório e em seguida executar `submodule add`, Git exibe isto:

    $ rm -Rf rack/
    $ git submodule add git@github.com:schacon/rack.git rack
    'rack' already exists in the index

Você tem que retirar o diretório `rack` da área de seleção primeiro. Depois, você pode adicionar o submódulo:

    $ git rm -r rack
    $ git submodule add git@github.com:schacon/rack.git rack
    Initialized empty Git repository in /opt/testsub/rack/.git/
    remote: Counting objects: 3184, done.
    remote: Compressing objects: 100% (1465/1465), done.
    remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
    Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
    Resolving deltas: 100% (1952/1952), done.

Agora digamos que você fez isso em um branch. Se você tentar mudar para um branch onde esses arquivos ainda estão na árvore em vez de um submódulo — você recebe esse erro:

    $ git checkout master
    error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

Você tem que mover o diretório do submódulo do `rack` de lá antes de mudar para um branch que não tem ele:

    $ mv rack /tmp/
    $ git checkout master
    Switched to branch "master"
    $ ls
    README    rack

Em seguida, quando você voltar, você terá um diretório `rack` vazio. Você pode executar `git submodule update` para fazer o clone novamente, ou mover seu diretório `/tmp/rack` de volta para o diretório vazio.
