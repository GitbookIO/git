# Packfiles

Vamos voltar para o banco de dados de objetos do seu repositório de testes Git. Neste momento, você tem 11 objetos — 4 blobs, 3 árvores, 3 commits, e 1 tag:

    $ find .git/objects -type f
    .git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
    .git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
    .git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
    .git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
    .git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
    .git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
    .git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
    .git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
    .git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
    .git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git comprime o conteúdo desses arquivos com zlib, então todos estes arquivos ocupam coletivamente apenas 925 bytes. Você vai adicionar um conteúdo um pouco maior no repositório para demonstrar uma característica interessante do Git. Adicione o arquivo repo.rb da biblioteca Grit em que você trabalhou anteriormente — trata-se de um arquivo de código fonte de 12K:

    $ curl http://github.com/mojombo/grit/raw/master/lib/grit/repo.rb > repo.rb
    $ git add repo.rb
    $ git commit -m 'added repo.rb'
    [master 484a592] added repo.rb
     3 files changed, 459 insertions(+), 2 deletions(-)
     delete mode 100644 bak/test.txt
     create mode 100644 repo.rb
     rewrite test.txt (100%)

Se você olhar para a árvore resultante, você pode ver o valor SHA-1 que o arquivo repo.rb tem no objeto blob:

    $ git cat-file -p master^{tree}
    100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
    100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
    100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Você pode então usar `git cat-file` para ver o quão grande esse objeto é:

    $ git cat-file -s 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e
    12898

Agora, modifique o arquivo um pouco, e veja o que acontece:

    $ echo '# testing' >> repo.rb
    $ git commit -am 'modified repo a bit'
    [master ab1afef] modified repo a bit
     1 files changed, 1 insertions(+), 0 deletions(-)

Verifique a árvore criada por este commit, e você verá algo interessante:

    $ git cat-file -p master^{tree}
    100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
    100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
    100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

O blob agora é um blob diferente, o que significa que, embora você tenha adicionado apenas uma única linha ao final de um arquivo de 400 linhas, Git armazenou esse novo conteúdo como um objeto completamente novo:

    $ git cat-file -s 05408d195263d853f09dca71d55116663690c27c
    12908

Você tem dois objetos de 12K quase idênticos em seu disco. Não seria bom se o Git pudesse armazenar um deles na íntegra, mas, o segundo objeto apenas como o delta entre ele e o primeiro?

Acontece que ele pode. O formato inicial em que Git salva objetos em disco é chamado de formato de objeto solto (loose object format). No entanto, ocasionalmente Git empacota vários desses objetos em um único arquivo binário chamado de packfile, a fim de economizar espaço e ser mais eficiente. Git faz isso, se você tem muitos objetos soltos, se você executar o comando `git gc` manualmente, ou se você fizer push para um servidor remoto. Para ver o que acontece, você pode manualmente pedir ao Git para arrumar os objetos chamando o comando `git gc`:

    $ git gc
    Counting objects: 17, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (13/13), done.
    Writing objects: 100% (17/17), done.
    Total 17 (delta 1), reused 10 (delta 0)

Se você olhar em seu diretório de objetos, você vai descobrir que a maioria de seus objetos sumiram, e um novo par de arquivos apareceu:

    $ find .git/objects -type f
    .git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
    .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
    .git/objects/info/packs
    .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
    .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

Os objetos que permanecem são os blobs que não são apontados por qualquer commit — neste caso, os blobs de exemplo "what is up, doc?" e o exemplo "test content" que você criou anteriormente. Como você nunca adicionou eles a qualquer commit, eles são considerados pendentes e não são embalados em sua nova packfile.

Os outros arquivos são o seu novo packfile e um índice. O packfile é um arquivo único contendo o conteúdo de todos os objetos que foram removidos do seu sistema de arquivos. O índice é um arquivo que contém offsets deste packfile assim você pode rapidamente buscar um objeto específico. O que é legal é que, embora os objetos em disco antes de executar o `gc` tinham coletivamente cerca de 12K de tamanho, o packfile novo tem apenas 6K. Você reduziu a utilização do disco pela metade empacotando seus objetos.

Como o Git faz isso? Quando Git empacota objetos, ele procura por arquivos que são nomeados e dimensionados de forma semelhante, e armazena apenas os deltas de uma versão do arquivo para a próxima. Você pode olhar dentro do packfile e ver o que o Git fez para economizar espaço. O comando plumbing `git verify-pack` permite que você veja o que foi empacotado:

    $ git verify-pack -v \
      .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
    0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
    05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
    09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
    1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
    1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
    3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
    484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
    83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
    9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
    9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
      05408d195263d853f09dca71d55116663690c27c
    ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
    cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
    d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
    e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
    f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
    fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
    chain length = 1: 1 object
    pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

Aqui, o blob `9bc1d`, que se você se lembrar foi a primeira versão do seu arquivo repo.rb, faz referência ao blob `05408`, que foi a segunda versão do arquivo. A terceira coluna da saída é o tamanho do objeto no pacote, assim você pode ver que `05408` ocupa 12K do arquivo, mas que `9bc1d` ocupa apenas 7 bytes. O que também é interessante é que a segunda versão do arquivo é a que é armazenada intacta, enquanto que a versão original é armazenada como um delta — isso porque é mais provável a necessidade de acesso mais rápido para a versão mais recente do arquivo.

A coisa realmente interessante sobre isso é que ele pode ser reembalado a qualquer momento. Git irá ocasionalmente reembalar seu banco de dados automaticamente, sempre tentando economizar mais espaço. Você pode também manualmente reembalar a qualquer momento executando `git gc`.
