# Referencias Git

Você pode executar algo como `git log 1a410e` para ver seu histórico inteiro, mas você ainda tem que lembrar que `1a410e` é o último commit, a fim de que o você possa navegar no histórico para encontrar todos os objetos. Você precisa de um arquivo no qual você possa armazenar o valor SHA-1 em um nome simples para que você possa usar esse ponteiro em vez do valor SHA-1.

No Git, eles são chamados de "referências" (references) ou "refs"; você pode encontrar os arquivos que contêm os valores SHA-1 no diretório `.git/refs`. No projeto atual, esse diretório não contém arquivos, mas contém uma estrutura simples:

    $ find .git/refs
    .git/refs
    .git/refs/heads
    .git/refs/tags
    $ find .git/refs -type f
    $

Para criar uma nova referência que irá ajudá-lo a se lembrar onde seu último commit está, você pode tecnicamente fazer algo tão simples como isto:

    $ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

Agora, você pode usar a referência head que você acabou de criar em vez do valor SHA-1 em seus comandos do Git:

    $ git log --pretty=oneline  master
    1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Você não deve editar diretamente os arquivos de referência. Git oferece um comando mais seguro para fazer isso, se você deseja atualizar uma referência chamada `update-ref`:

    $ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

Isso é basicamente o que um branch em Git: um simples ponteiro ou referência para o head de uma linha de trabalho. Para criar um branch de volta ao segundo commit, você pode fazer isso:

    $ git update-ref refs/heads/test cac0ca

Seu branch irá conter apenas o trabalho do commit abaixo:

    $ git log --pretty=oneline test
    cac0cab538b970a37ea1e769cbbde608743bc96d second commit
    fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Agora, seu banco de dados Git conceitualmente é algo como a Figura 9-4.


![](http://git-scm.com/figures/18333fig0904-tn.png)

Figura 9-4. Objetos de diretório Git com referências ao branch head incluídas.

Quando você executar comandos como `git branch (branchname)`, Git basicamente executa o comando `update-ref` para adicionar o SHA-1 do último commit do branch em que você está em qualquer nova referência que deseja criar.

## O HEAD

A questão agora é, quando você executar `git branch (branchname)`, como é que o Git sabe o SHA-1 do último commit? A resposta é o arquivo HEAD. O arquivo HEAD é uma referência simbólica para o branch em que você está no momento. Por referência simbólica, quer dizer que, ao contrário de uma referência normal, ele geralmente não contêm um valor SHA-1 mas sim um apontador para uma outra referência. Se você olhar no arquivo, você normalmente verá algo como isto:

    $ cat .git/HEAD
    ref: refs/heads/master

Se você executar `git checkout test`, Git atualiza o arquivo para ficar assim:

    $ cat .git/HEAD
    ref: refs/heads/test

Quando você executar `git commit`, ele crirá o objeto commit, especificando o pai desse objeto commit para ser o valor SHA-1 de referência apontada por HEAD.

Você também pode editar manualmente esse arquivo, mas um comando mais seguro existe para fazer isso: `symbolic-ref`. Você pode ler o valor de seu HEAD através deste comando:

    $ git symbolic-ref HEAD
    refs/heads/master

Você também pode definir o valor de HEAD:

    $ git symbolic-ref HEAD refs/heads/test
    $ cat .git/HEAD
    ref: refs/heads/test

Você não pode definir uma referência simbólica fora do estilo refs:

    $ git symbolic-ref HEAD test
    fatal: Refusing to point HEAD outside of refs/

## Tags

Você acabou de ver os três tipos de objetos principais do Git, mas há um quarto. O objeto tag é muito parecido com um objeto commit — contém um tagger (pessoa que cria a tag), uma data, uma mensagem e um ponteiro. A principal diferença é que um objeto tag aponta para um commit em vez de uma árvore. É como uma referência de branch, mas nunca se move — ele sempre aponta para o mesmo commit, mas te dá um nome mais amigável para ele.

Como discutido no Capítulo 2, existem dois tipos de tags: anotadas (annotated) e leves (lightweight). Você pode fazer uma tag leve executando algo como isto:

    $ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

Isso é tudo que uma tag leve é — um branch que nunca se move. Uma tag anotada é mais complexa. Se você criar uma tag anotada, Git cria um objeto tag e depois escreve uma referência para apontar para ela em vez de diretamente para um commit. Você pode ver isso através da criação de uma tag anotada (`-a` especifica que é uma tag anotada):

    $ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 -m 'test tag'

Aqui está o valor SHA-1 do objeto que ele criou:

    $ cat .git/refs/tags/v1.1
    9585191f37f7b0fb9444f35a9bf50de191beadc2

Agora, execute o comando `cat-file` com este valor SHA-1:

    $ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
    object 1a410efbd13591db07496601ebc7a059dd55cfe9
    type commit
    tag v1.1
    tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

    test tag

Observe que a entrada do objeto aponta para o valor SHA-1 do commit que você taggeou. Também observe que ele não precisa apontar para um commit; você pode taggear qualquer objeto Git. No código-fonte Git, por exemplo, o mantenedor adicionou sua chave pública GPG como um objeto blob e depois taggeou ele. Você pode ver a chave pública, executando

    $ git cat-file blob junio-gpg-pub

no repositório de código-fonte Git. O repositório do kernel Linux também tem um objeto tag que não aponta para um commit — a primeira tag criada aponta para a árvore inicial da importação do código fonte.

## Remotos

O terceiro tipo de referência que você vai ver é uma referência remota. Se você adicionar um remoto e fazer um push para ele, Git armazena o valor de seu último push para esse remoto para cada branch no diretório refs `refs/remotes`. Por exemplo, você pode adicionar um remoto chamado `origin` e fazer um push do seu branch `master` nele:

    $ git remote add origin git@github.com:schacon/simplegit-progit.git
    $ git push origin master
    Counting objects: 11, done.
    Compressing objects: 100% (5/5), done.
    Writing objects: 100% (7/7), 716 bytes, done.
    Total 7 (delta 2), reused 4 (delta 1)
    To git@github.com:schacon/simplegit-progit.git
       a11bef0..ca82a6d  master -> master

Então, você pode ver como era o branch `master` no remoto `origin` da última vez que você se comunicou com o servidor, verificando o arquivo `refs/remotes/origin/master`:

    $ cat .git/refs/remotes/origin/master
    ca82a6dff817ec66f44342007202690a93763949

Referências remotas diferem dos branches (referências `refs/heads`), principalmente no sentido de que não pode ser feito o checkout delas. Git move elas como indicadores para o último estado conhecido de onde os branches estavam nesses servidores.
