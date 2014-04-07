# Manutenção e Recuperação de Dados

Ocasionalmente, você pode ter que fazer alguma limpeza — compactar um repositório, limpar um repositório importado, ou recuperar trabalhos perdidos. Esta seção irá mostrar alguns desses cenários.

## Manutenção

Ocasionalmente, Git automaticamente executa um comando chamado "auto gc". Na maioria das vezes, este comando não faz nada. No entanto, se houverem muitos objetos soltos (loose objects) (objetos que não estejam em um packfile) ou muitos packfiles, Git executa um verdadeiro comando `git gc`. O `gc` significa garbage collect (coleta de lixo), e o comando faz uma série de coisas: ele reúne todos os objetos soltos e os coloca em packfiles, consolida packfiles em um packfile maior, e remove objetos que não estejam ao alcance de qualquer commit e tem poucos meses de idade.

Você pode executar auto gc manualmente da seguinte forma:

    $ git gc --auto

Mais uma vez, isso geralmente não faz nada. Você deve ter cerca de 7.000 objetos soltos ou mais de 50 packfiles para que o Git execute um comando gc real. Você pode modificar esses limites com as opções de configuração `gc.auto` e `gc.autopacklimit`, respectivamente.

A outra coisa que `gc` irá fazer é arrumar suas referências em um único arquivo. Suponha que seu repositório contém os seguintes branches e tags:

    $ find .git/refs -type f
    .git/refs/heads/experiment
    .git/refs/heads/master
    .git/refs/tags/v1.0
    .git/refs/tags/v1.1

Se você executar `git gc`, você não terá mais esses arquivos no diretório `refs`. Git irá movê-los para um arquivo chamado `.git/packed-refs` que se parece com isto:

    $ cat .git/packed-refs
    # pack-refs with: peeled
    cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
    ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
    cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
    9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
    ^1a410efbd13591db07496601ebc7a059dd55cfe9

Se você atualizar uma referência, Git não edita esse arquivo, mas em vez disso, escreve um novo arquivo em `refs/heads`. Para obter o SHA apropriado para uma dada referência, Git checa a referência no diretório `refs` e então verifica o arquivo `packed-refs` como um último recurso. No entanto, se você não conseguir encontrar uma referência no diretório `refs`, ela está provavelmente em seu arquivo `packed-refs`.

Observe a última linha do arquivo, que começa com um `^`. Isto significa que a tag diretamente acima é uma tag anotada (annotated tag) e que a linha é o commit que a tag anotada aponta.

## Recuperação de Dados

Em algum ponto de sua jornada Git, você pode acidentalmente perder um commit. Geralmente, isso acontece porque você forçou a remoção (force-delete) de um branch que tinha informações nele, e depois se deu conta de que precisava do branch; ou você resetou (hard-reset) um branch, abandonando commits com informações importantes. Assumindo que isso aconteceu, como você pode obter o seu commit de volta?

Aqui está um exemplo que reseta (hard-resets) o branch master no seu repositório de teste para um commit antigo e depois recupera os commits perdidos. Primeiro, vamos rever onde seu repositório está neste momento:

    $ git log --pretty=oneline
    ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
    484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Agora, mova o branch `master` de volta para o commit do meio:

    $ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
    HEAD is now at 1a410ef third commit
    $ git log --pretty=oneline
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Você efetivamente perdeu os dois primeiros commits — você não tem um branch de onde os commits são alcançáveis. Você precisa encontrar o SHA do último commit e em seguida, adicionar um branch que aponta para ele. O truque é encontrar o SHA do commit mais recente — você não o memorizou, certo?

Muitas vezes, a maneira mais rápida é usar uma ferramenta chamada `git reflog`. Quando você está trabalhando, Git silenciosamente registra onde está o HEAD cada vez que você mudá-lo. Cada vez que você fizer um commit ou alterar branches, o reflog é atualizado. O reflog também é atualizado pelo comando `git update-ref`, o que é mais um motivo para usá-lo em vez de apenas escrever o valor SHA em seus arquivos ref, como abordado anteriormente na seção "Referências Git" deste capítulo. Você pode ver onde você está, a qualquer momento, executando `git reflog`:

    $ git reflog
    1a410ef HEAD@{0}: 1a410efbd13591db07496601ebc7a059dd55cfe9: updating HEAD
    ab1afef HEAD@{1}: ab1afef80fac8e34258ff41fc1b867c702daa24b: updating HEAD

Aqui podemos ver os dois commits que obtemos com check out, no entanto, não há muita informação aqui. Para ver a mesma informação de uma forma muito mais útil, podemos executar `git log -g`, que vai lhe dar uma saída de log normal do seu reflog.

    $ git log -g
    commit 1a410efbd13591db07496601ebc7a059dd55cfe9
    Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
    Reflog message: updating HEAD
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:22:37 2009 -0700

        third commit

    commit ab1afef80fac8e34258ff41fc1b867c702daa24b
    Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
    Reflog message: updating HEAD
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri May 22 18:15:24 2009 -0700

         modified repo a bit

Parece que o commit de baixo é o que você perdeu, então você pode recuperá-lo através da criação de um novo branch neste commit. Por exemplo, você pode criar um branch chamado `recover-branch` naquele commit (ab1afef):

    $ git branch recover-branch ab1afef
    $ git log --pretty=oneline recover-branch
    ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
    484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Agora você tem um branch chamado `recover-branch` que é onde o seu branch `master` costumava estar, fazendo os dois primeiros commits acessíveis novamente.
Em seguida, suponha que a sua perda por algum motivo não está no reflog — você pode simular isso ao remover `recover-branch` e apagar o reflog. Agora os dois primeiros commits  não são acessíveis por qualquer coisa:

    $ git branch -D recover-branch
    $ rm -Rf .git/logs/

Como os dados do reflog são mantidos no diretório `.git/logs/`, você efetivamente não têm reflog. Como você pode recuperar aquele commit agora? Uma maneira é usar o utilitário `git fsck`, que verifica a integridade de seu banco de dados. Se você executá-lo com a opção `--full`, ele mostra todos os objetos que não são apontadas por outro objeto:

    $ git fsck --full
    dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
    dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
    dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
    dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293

Neste caso, você pode ver o seu commit desaparecido após o commit pendente (dangling). Você pode recuperá-lo da mesma forma, adicionando um branch que aponta para seu SHA.

## Removendo Objetos

Há um monte de coisas boas em relação ao Git, mas um recurso que pode causar problemas é o fato de que o `git clone` baixa todo o histórico do projeto, incluindo todas as versões de cada arquivo. Isso é bom se a coisa toda for código fonte, porque Git é altamente otimizado para comprimir os dados de forma eficiente. No entanto, se alguém, em algum momento adicionou um arquivo enorme, todo clone será forçado a baixar o arquivo grande, mesmo que ele tenha sido retirado do projeto no commit seguinte. Como ele é acessível a partir do histórico, ele sempre estará lá.

Isso pode ser um grande problema quando você está convertendo repositórios do Subversion ou Perforce para Git. Como você não baixa todo o histórico nesses sistemas, este tipo de adição traz poucas consequências. Se você fez uma importação de outro sistema ou descobriu que seu repositório é muito maior do que deveria ser, eis aqui como você pode encontrar e remover objetos grandes.

Esteja avisado: esta técnica é destrutiva para o seu histórico de commits. Ele reescreve a cada objeto commit da primeira árvore que você tem que modificar para remover uma referência de arquivo grande. Se você fizer isso, imediatamente após uma importação, antes que alguém tenha começado usar o commit, você ficará bem — caso contrário, você tem que notificar todos os contribuidores para que eles façam um rebase do trabalho deles em seus novos commits.

Para demonstrar, você vai adicionar um arquivo grande em seu repositório, removê-lo no próximo commit, encontrá-lo e removê-lo permanentemente a partir do repositório. Primeiro, adicione um objeto grande no seu histórico:

    $ curl http://kernel.org/pub/software/scm/git/git-1.6.3.1.tar.bz2 > git.tbz2
    $ git add git.tbz2
    $ git commit -am 'added git tarball'
    [master 6df7640] added git tarball
     1 files changed, 0 insertions(+), 0 deletions(-)
     create mode 100644 git.tbz2

Oops - você não queria adicionar um tarball enorme no seu projeto. Melhor se livrar dele:

    $ git rm git.tbz2
    rm 'git.tbz2'
    $ git commit -m 'oops - removed large tarball'
    [master da3f30d] oops - removed large tarball
     1 files changed, 0 insertions(+), 0 deletions(-)
     delete mode 100644 git.tbz2

Agora, use `gc` no seu banco de dados e veja quanto espaço você está usando:

    $ git gc
    Counting objects: 21, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (16/16), done.
    Writing objects: 100% (21/21), done.
    Total 21 (delta 3), reused 15 (delta 1)

Você pode executar o comando `count-objects` para ver rapidamente quanto espaço você está usando:

    $ git count-objects -v
    count: 4
    size: 16
    in-pack: 21
    packs: 1
    size-pack: 2016
    prune-packable: 0
    garbage: 0

A entrada `size-pack` é do tamanho de seus packfiles em kilobytes, então você está usando 2MB. Antes do último commit, você estava usando quase 2K — claramente, removendo o arquivo do commit anterior não remove-o de seu histórico. Toda vez que alguém clonar este repositório, eles vão ter que clonar os 2MB para obter este projeto, porque você acidentalmente acrescentou um arquivo grande. Vamos nos livrar dele.

Primeiro você tem que encontrá-lo. Neste caso, você já sabe qual é o arquivo. Mas suponha que você não saiba; como você identifica o arquivo ou arquivos que estão ocupando tanto espaço? Se você executar `git gc`, todos os objetos estarão em um packfile; você pode identificar os objetos grandes, executando outro comando encanamento (plumbing) chamado `git verify-pack` e classificar pelo terceiro campo da saída, que é o tamanho do arquivo. Você também pode direcionar a saída (pipe) através do comando `tail` porque você está interessado apenas nos últimos poucos arquivos maiores:

    $ git verify-pack -v .git/objects/pack/pack-3f8c0...bb.idx | sort -k 3 -n | tail -3
    e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4667
    05408d195263d853f09dca71d55116663690c27c blob   12908 3478 1189
    7a9eb2fba2b1811321254ac360970fc169ba2330 blob   2056716 2056872 5401

O objeto grande está na parte inferior: 2MB. Para saber qual é o arquivo, você vai usar o comando `rev-list`, que você usou brevemente no *Capítulo 7*. Se você passar `--objects` para `rev-list`, ele lista todos os SHAs dos commits e também os SHAs dos blob com os caminhos de arquivos (paths) associados a eles. Você pode usar isso para encontrar o nome do blob:

    $ git rev-list --objects --all | grep 7a9eb2fb
    7a9eb2fba2b1811321254ac360970fc169ba2330 git.tbz2

Agora, você precisa remover o arquivo de todas as árvores em que ele estiver. Você pode facilmente ver quais commits modificaram este arquivo:

    $ git log --pretty=oneline --branches -- git.tbz2
    da3f30d019005479c99eb4c3406225613985a1db oops - removed large tarball
    6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 added git tarball

Você deve reescrever todos os commits desde `6df76` para remover completamente este arquivo do seu histórico Git. Para fazer isso, você usa `filter-branch`, que você já usou no *capítulo 6*:

    $ git filter-branch --index-filter \
       'git rm --cached --ignore-unmatch git.tbz2' -- 6df7640^..
    Rewrite 6df764092f3e7c8f5f94cbe08ee5cf42e92a0289 (1/2)rm 'git.tbz2'
    Rewrite da3f30d019005479c99eb4c3406225613985a1db (2/2)
    Ref 'refs/heads/master' was rewritten

A opção`--index-filter` é semelhante a opção `--tree-filter` utilizada no *Capítulo 6*, exceto que em vez de passar um comando que modifica os arquivos que você fez check-out no disco, você está modificando sua área de seleção (staging area) ou índice. Em vez de remover um arquivo específico com algo como `rm file`, você tem que removê-lo com `git rm --cached` — você deve removê-lo do índice, não do disco. A razão para fazê-lo desta maneira é a velocidade — porque o Git não precisa fazer o check out de cada revisão no disco antes de executar o seu filtro, o processo pode ser muito mais rápido. Você pode realizar a mesma tarefa com `--tree-filter` se você quiser. A opção `--ignore-unmatch` do `git rm` diz a ele para não mostrar erros se o padrão que você está tentando remover não estiver lá. Finalmente, você pede a `filter-branch` para reescrever seu histórico apenas a partir do commit `6df7640`, porque você sabe que é onde o problema começou. Caso contrário, ele vai começar desde o início e vai demorar mais tempo desnecessariamente.

Seu histórico já não contém uma referência para o arquivo. No entanto, seu reflog e um novo conjunto de refs que o git adicionou quando você fez o `filter-branch` em `.git/refs/original` ainda não, então você tem que removê-los e, em seguida, fazer um repack do banco de dados. Você precisa se ​​livrar de qualquer coisa que tenha um ponteiro para aqueles commits antigos antes de fazer o repack:

    $ rm -Rf .git/refs/original
    $ rm -Rf .git/logs/
    $ git gc
    Counting objects: 19, done.
    Delta compression using 2 threads.
    Compressing objects: 100% (14/14), done.
    Writing objects: 100% (19/19), done.
    Total 19 (delta 3), reused 16 (delta 1)

Vamos ver quanto espaço você economizou.

    $ git count-objects -v
    count: 8
    size: 2040
    in-pack: 19
    packs: 1
    size-pack: 7
    prune-packable: 0
    garbage: 0

O tamanho do repositório compactado reduziu para 7K, que é muito melhor do que 2MB. Pelo tamanho você pode ver que o grande objeto ainda está em seus objetos soltos, portanto não foi eliminado; mas ele não será transferido em um clone ou push posterior, e isso é o que importa. Se você realmente quiser, você pode remover o objeto completamente executando `git prune --expire`.
