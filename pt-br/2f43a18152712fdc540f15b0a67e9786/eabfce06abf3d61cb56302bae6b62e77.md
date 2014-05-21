# Objetos do Git

Git é um sistema de arquivos de conteúdo endereçável. O que significa isso?
Isso significa que o núcleo do Git armazena dados usando um simples mecanismo chave-valor. Você pode inserir qualquer tipo de conteúdo nele, e ele vai retornar uma chave que você pode usar para recuperar o conteúdo a qualquer momento. Para demonstrar, você pode usar o comando de encanamento `hash-object`, pega alguns dados, armazena eles em seu diretório `.git`, e retorna a chave dos dados armazenados. Primeiro, você inicializa um novo repositório Git e verifica se não há nada no diretório `objects`:

    $ mkdir test
    $ cd test
    $ git init
    Initialized empty Git repository in /tmp/test/.git/
    $ find .git/objects
    .git/objects
    .git/objects/info
    .git/objects/pack
    $ find .git/objects -type f
    $

Git inicializou o diretório `objects` e criou os subdiretórios `pack` e `info`, mas não existem arquivos comuns neles. Agora, armazene um texto em seu banco de dados Git:

    $ echo 'test content' | git hash-object -w --stdin
    d670460b4b4aece5915caf5c68d12f560a9fe3e4

O `-w` diz ao `hash-object` para armazenar o objeto; caso contrário, o comando simplesmente diz qual seria a chave. `--stdin` indica ao comando para ler o conteúdo da entrada padrão (stdin); se você não especificar isso, `hash-object` espera um caminho (path) para um arquivo. A saída do comando é uma soma hash de 40 caracteres. Este é o hash SHA-1 — uma soma de verificação do conteúdo que você está armazenando mais um cabeçalho, que você vai entender mais daqui a pouco. Agora você pode ver como o Git armazenou seus dados:

    $ find .git/objects -type f
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Você pode ver um arquivo no diretório `objects`. Isto é como o Git armazena o conteúdo inicialmente — como um único arquivo por parte de conteúdo, nomeado com o checksum SHA-1 do conteúdo e seu cabeçalho. O subdiretório é nomeado com os 2 primeiros caracteres do SHA, e o arquivo é nomeado com os 38 caracteres restantes.

Você pode fazer um pull do conteúdo com o comando `cat-file`. Este comando é uma espécie de canivete suíço para inspecionar objetos Git. Passando `-p` para ele instrui o comando `cat-file` a descobrir o tipo de conteúdo e exibi-lo para você:

    $ git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4
    test content

Agora, você pode adicionar conteúdo no Git e fazer pull dele. Você também pode fazer isso com o conteúdo de arquivos. Por exemplo, você pode fazer algum controle de versão simples em um arquivo. Primeiro, crie um novo arquivo e salve seu conteúdo em seu banco de dados:

    $ echo 'version 1' > test.txt
    $ git hash-object -w test.txt
    83baae61804e65cc73a7201a7252750c76066a30

Então, escreva algum conteúdo novo no arquivo e salve-o novamente:

    $ echo 'version 2' > test.txt
    $ git hash-object -w test.txt
    1f7a7a472abf3dd9643fd615f6da379c4acb3e3a

Seu banco de dados contém as duas novas versões do arquivo, assim como o primeiro conteúdo que você armazenou lá:

    $ find .git/objects -type f
    .git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a
    .git/objects/83/baae61804e65cc73a7201a7252750c76066a30
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4

Agora você pode reverter o arquivo de volta para a primeira versão

    $ git cat-file -p 83baae61804e65cc73a7201a7252750c76066a30 > test.txt
    $ cat test.txt
    version 1

ou a segunda versão:

    $ git cat-file -p 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a > test.txt
    $ cat test.txt
    version 2

Mas, lembrar a chave SHA-1 para cada versão de seu arquivo não é prático; mais ainda, você não está armazenando o nome do arquivo em seu sistema — apenas o conteúdo. Esse tipo de objeto é chamado de blob. Você pode fazer o Git informar o tipo de objeto de qualquer objeto no Git, dada a sua chave SHA-1, com `cat-file -t`:

    $ git cat-file -t 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
    blob

## Objetos Árvore

O próximo tipo que você verá é o objeto árvore, que resolve o problema de armazenar o nome do arquivo e também permite que você armazene um grupo de arquivos juntos. Git armazena o conteúdo de uma maneira semelhante a um sistema de arquivos UNIX, mas de forma um pouco simplificada. Todo o conteúdo é armazenado como árvore e objetos blob, com árvores correspondendo às entradas de diretório do UNIX e os blobs correspondendo mais ou menos a inodes ou conteúdo de arquivos. Um único objeto árvore contém uma ou mais entradas de árvores, cada uma das quais contém um ponteiro SHA-1 para um blob ou subárvore com seu modo associado, tipo e o nome do arquivo. Por exemplo, a árvore mais recente no projeto simplegit pode parecer algo como isto:

    $ git cat-file -p master^{tree}
    100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
    100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
    040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib

A sintaxe `master^{tree}` especifica o objeto árvore que é apontado pelo último commit em seu branch `master`. Observe que o subdiretório `lib` não é um blob, mas sim, um ponteiro para outra árvore:

    $ git cat-file -p 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0
    100644 blob 47c6340d6459e05787f644c2447d2595f5d3a54b      simplegit.rb

Conceitualmente, os dados que o Git está armazenando são algo como mostra a Figura 9-1.


![](http://git-scm.com/figures/18333fig0901-tn.png)

Figura 9-1. Versão simples do modelo de dados Git.

Você pode criar sua própria árvore. Git normalmente cria uma árvore, a partir do estado de sua área de seleção ou índice e escreve um objeto árvore a partir dele. Assim, para criar um objeto árvore, primeiro você tem que criar um índice colocando alguns arquivos na área de seleção (staging area). Para criar um índice com uma única entrada — a primeira versão do seu arquivo text.txt — você pode usar o comando plumbing `update-index`. Você pode usar este comando para adicionar artificialmente a versão anterior do arquivo test.txt em uma nova área de seleção. Você deve passar a opção `--add` porque o arquivo ainda não existe na sua área de seleção (você não tem sequer uma área de seleção criada ainda) e `--cacheinfo` porque o arquivo que você está adicionando não está em seu diretório, mas está em seu banco de dados. Então, você especifica o modo, o SHA-1, e o nome do arquivo:

    $ git update-index --add --cacheinfo 100644 \
      83baae61804e65cc73a7201a7252750c76066a30 test.txt

Neste caso, você está especificando um modo `100644`, que significa que é um arquivo normal. Outras opções são `100755`, que significa que é um arquivo executável, e `120000`, que especifica um link simbólico. O modo é obtido a partir de modos normais do Unix, mas é muito menos flexível — estes três modos são os únicos que são válidas para arquivos (blobs) no Git (embora outros modos sejam usados ​​para diretórios e submódulos).

Agora, você pode usar o comando `write-tree` para escrever a área de seleção em um objeto árvore. Nenhuma opção `-w` é necessária — chamando `write-tree` cria automaticamente um objeto árvore a partir do estado do índice se a árvore ainda não existe:

    $ git write-tree
    d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    $ git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    100644 blob 83baae61804e65cc73a7201a7252750c76066a30      test.txt

Você também pode verificar que este é um objeto árvore:

    $ git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    tree

Você vai agora criar uma nova árvore com a segunda versão do test.txt e um novo arquivo também:

    $ echo 'new file' > new.txt
    $ git update-index test.txt
    $ git update-index --add new.txt

Sua área de seleção agora tem a nova versão do test.txt bem como o novo arquivo new.txt. Escreva aquela árvore (grave o estado da área de seleção ou índice em um objeto árvore) e veja o que aparece:

    $ git write-tree
    0155eb4229851634a0f03eb265b69f5a2d56f341
    $ git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
    100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
    100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Note que esta árvore tem entradas de arquivos e também que o SHA de test.txt é a "versão 2" do SHA de antes (`1f7a7a`). Apenas por diversão, você vai adicionar a primeira árvore como um subdiretório nesta árvore. Você pode ler as árvores em sua área de seleção chamando `read-tree`. Neste caso, você pode ler uma árvore existente em sua área de seleção como uma subárvore usando a opção `--prefix` em `read-tree`:

    $ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    $ git write-tree
    3c4e9cd789d88d8d89c1073707c3585e41b0e614
    $ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
    040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
    100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
    100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt

Se você criou um diretório de trabalho da nova árvore que acabou de escrever, você teria os dois arquivos no nível mais alto do diretório de trabalho e um subdiretório chamado `bak`, que continha a primeira versão do arquivo teste.txt. Você pode pensar nos dados que o Git contém para estas estruturas como sendo parecidas com a Figura 9-2.


![](http://git-scm.com/figures/18333fig0902-tn.png)

Figura 9-2. A estrutura de conteúdo de seus dados Git atuais.

## Objetos de Commit

Você tem três árvores que especificam os diferentes snapshots de seu projeto que você deseja acompanhar, mas o problema anterior mantém-se: você deve se lembrar de todos os três valores SHA-1, a fim de recuperar os snapshots. Você também não tem qualquer informação sobre quem salvou os snapshots, quando eles foram salvos, ou por que eles foram salvos. Esta é a informação básica que os objetos commit armazenam para você.

Para criar um objeto commit, você chama `commit-tree` e especifica uma única árvore SHA-1 e quais objetos commit, se houverem, diretamente precederam ele. Comece com a primeira árvore que você escreveu:

    $ echo 'first commit' | git commit-tree d8329f
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d

Agora você pode ver o seu novo objeto commit com `cat-file`:

    $ git cat-file -p fdf4fc3
    tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
    author Scott Chacon <schacon@gmail.com> 1243040974 -0700
    committer Scott Chacon <schacon@gmail.com> 1243040974 -0700

    first commit

O formato de um objeto commit é simples: ele especifica a árvore de nível superior para o snapshot do projeto nesse momento; a informação do author/committer (autor do commit) obtido de suas opções de configuração `user.name` e `user.email`, com a timestamp atual; uma linha em branco, e em seguida, a mensagem de commit.

Em seguida, você vai escrever os outros dois objetos commit, cada um referenciando o commit que veio diretamente antes dele:

    $ echo 'second commit' | git commit-tree 0155eb -p fdf4fc3
    cac0cab538b970a37ea1e769cbbde608743bc96d
    $ echo 'third commit'  | git commit-tree 3c4e9c -p cac0cab
    1a410efbd13591db07496601ebc7a059dd55cfe9

Cada um dos três objetos commit apontam para uma das três árvores de snapshot criadas. Curiosamente, agora você tem um histórico Git real que você pode ver com o comando `git log`, se você executá-lo no último commit SHA-1:

    $ git log --stat 1a410e
    commit 1a410efbd13591db07496601ebc7a059dd55cfe9
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:15:24 2009 -0700

        third commit

     bak/test.txt |    1 +
     1 files changed, 1 insertions(+), 0 deletions(-)

    commit cac0cab538b970a37ea1e769cbbde608743bc96d
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:14:29 2009 -0700

        second commit

     new.txt  |    1 +
     test.txt |    2 +-
     2 files changed, 2 insertions(+), 1 deletions(-)

    commit fdf4fc3344e67ab068f836878b6c4951e3b15f3d
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:09:34 2009 -0700

        first commit

     test.txt |    1 +
     1 files changed, 1 insertions(+), 0 deletions(-)

Incrível. Você acabou de fazer as operações de baixo nível para construir um histórico Git sem usar qualquer um dos front ends. Isso é essencialmente o que o Git faz quando você executa os comandos `git add` e `git commit` — ele armazena blobs dos arquivos que foram alterados, atualiza o índice, escreve árvores, e escreve objetos commit que fazem referência às árvores de nível superior e os commits que vieram imediatamente antes deles. Esses três objetos Git principais — o blob, a árvore, e o commit — são inicialmente armazenados como arquivos separados no seu diretório `.git/objects`. Aqui estão todos os objetos no diretório de exemplo agora, comentado com o que eles armazenam:

    $ find .git/objects -type f
    .git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
    .git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
    .git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
    .git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
    .git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
    .git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
    .git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
    .git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
    .git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Se você seguir todos os ponteiros internos, você tem um gráfico como o da Figura 9-3.


![](http://git-scm.com/figures/18333fig0903-tn.png)

Figura 9-3. Todos os objetos em seu diretório Git.

## Armazenamento de Objetos

Eu mencionei anteriormente que um cabeçalho é armazenado com o conteúdo. Vamos ver como Git armazena seus objetos. Você vai ver como armazenar um objeto blob — neste caso, a string "what is up, doc?" — interativamente na linguagem de script Ruby. Você pode iniciar o modo interativo Ruby com o comando `irb`:

    $ irb
    >> content = "what is up, doc?"
    => "what is up, doc?"

Git constrói um cabeçalho que começa com o tipo do objeto, neste caso um blob. Em seguida, é adicionado um espaço seguindo-se a dimensão do conteúdo e, finalmente, um byte nulo:

    >> header = "blob #{content.length}\0"
    => "blob 16\000"

Git concatena o cabeçalho e o conteúdo original e, em seguida, calcula o checksum SHA-1 do novo conteúdo. Você pode calcular o valor SHA-1 em Ruby, incluindo a biblioteca SHA1 digest com o comando `require` e então chamar `Digest::SHA1.hexdigest()` passando a string:

    >> store = header + content
    => "blob 16\000what is up, doc?"
    >> require 'digest/sha1'
    => true
    >> sha1 = Digest::SHA1.hexdigest(store)
    => "bd9dbf5aae1a3862dd1526723246b20206e5fc37"

Git comprime o conteúdo novo com zlib, o que você pode fazer em Ruby com a biblioteca zlib. Primeiro, você precisa incluir a biblioteca e, em seguida, executar  `Zlib::Deflate.deflate()` no conteúdo:

    >> require 'zlib'
    => true
    >> zlib_content = Zlib::Deflate.deflate(store)
    => "x\234K\312\311OR04c(\317H,Q\310,V(-\320QH\311O\266\a\000_\034\a\235"

Finalmente, você vai escrever o seu conteúdo "zlib-deflated" em um objeto no disco. Você vai determinar o caminho do objeto que você deseja escrever (os dois primeiros caracteres do valor SHA-1 serão o nome do subdiretório, e os últimos 38 caracteres serão o nome do arquivo dentro desse diretório). Em Ruby, você pode usar a função `FileUtils.mkdir_p()` para criar o subdiretório se ele não existir. Em seguida, abra o arquivo com `File.open()` e escreva o conteúdo anteriormente comprimido com zlib no arquivo com uma chamada a `write()` no identificador de arquivo resultante:

    >> path = '.git/objects/' + sha1[0,2] + '/' + sha1[2,38]
    => ".git/objects/bd/9dbf5aae1a3862dd1526723246b20206e5fc37"
    >> require 'fileutils'
    => true
    >> FileUtils.mkdir_p(File.dirname(path))
    => ".git/objects/bd"
    >> File.open(path, 'w') { |f| f.write zlib_content }
    => 32

Isso é tudo — você criou um objeto Git blob válido. Todos os objetos do Git são armazenados da mesma maneira, só que com diferentes tipos — em vez da string blob, o cabeçalho vai começar com commit ou tree. Além disso, embora o conteúdo do blob possa ser pequeno, o commit e conteúdo da árvore são formatados muito especificamente.
