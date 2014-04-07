# Merge de Sub-árvore (Subtree Merging)

Agora que você viu as dificuldades do sistema de submódulos, vamos ver uma maneira alternativa de resolver o mesmo problema. Quando o Git faz o merge, ele olha para as partes que vão sofrer o merge e escolhe a estratégia adequada de merge para usar. Se você está fazendo o merge de dois branches, Git usa uma estratégia _recursiva_ (_recursive_ strategy). Se você está fazendo o merge de mais de dois branches, Git usa a estratégia do _polvo_ (_octopus_ strategy). Essas estratégias são automaticamente escolhidas para você, porque a estratégia recursiva pode lidar com situações complexas de merge de três vias — por exemplo, mais de um ancestral comum — mas ele só pode lidar com o merge de dois branches. O merge octopus pode lidar com vários branches mas é cauteloso para evitar conflitos difíceis, por isso ele é escolhido como estratégia padrão se você está tentando fazer o merge de mais de dois branches.

Porém, existem também outras estratégias que você pode escolher. Uma delas é o merge de _sub-árvore_, e você pode usá-lo para lidar com o problema do subprojeto. Aqui você vai ver como resolver o problema do "rack" da seção anterior, mas usando merge de sub-árvore.

A ideia do merge de sub-árvore é que você tem dois projetos, e um deles está mapeado para um subdiretório do outro e vice-versa. Quando você escolhe um merge de sub-árvore, Git é inteligente o bastante para descobrir que um é uma sub-árvore do outro e faz o merge adequado — é incrível.

Primeiro você adiciona a aplicação Rack em seu projeto. Você adiciona o projeto Rack como uma referência remota no seu projeto e então faz o checkout dele em um branch:

    $ git remote add rack_remote git@github.com:schacon/rack.git
    $ git fetch rack_remote
    warning: no common commits
    remote: Counting objects: 3184, done.
    remote: Compressing objects: 100% (1465/1465), done.
    remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
    Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
    Resolving deltas: 100% (1952/1952), done.
    From git@github.com:schacon/rack
     * [new branch]      build      -> rack_remote/build
     * [new branch]      master     -> rack_remote/master
     * [new branch]      rack-0.4   -> rack_remote/rack-0.4
     * [new branch]      rack-0.9   -> rack_remote/rack-0.9
    $ git checkout -b rack_branch rack_remote/master
    Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
    Switched to a new branch "rack_branch"

Agora você tem a raiz do projeto Rack no seu branch `rack_branch` e o seu projeto no branch `master`. Se você fizer o checkout de um e depois do outro, você pode ver que eles têm raízes de projeto diferentes:

    $ ls
    AUTHORS           KNOWN-ISSUES   Rakefile      contrib           lib
    COPYING           README         bin           example           test
    $ git checkout master
    Switched to branch "master"
    $ ls
    README

Você quer colocar o projeto Rack no seu projeto `master` como um subdiretório. Você pode fazer isso no Git com `git read-tree`. Você irá aprender mais sobre `read-tree` e seus companheiros no Capítulo 9, mas por enquanto saiba que ele escreve a raiz da árvore de um branch na sua área de seleção e diretório de trabalho. Você volta para o branch `master`, você coloca o branch `rack` no subdiretório `rack` no branch `master` do seu projeto principal:

    $ git read-tree --prefix=rack/ -u rack_branch

Quando você faz o commit, parece que você tem todos os arquivos do Rack nesse subdiretório — como se você tivesse copiado de um arquivo. O que é interessante é que você pode facilmente fazer merge de alterações de um branch para o outro. Assim, se o projeto Rack for atualizado, você pode fazer um pull das modificações mudando para o branch e fazendo o pull:

    $ git checkout rack_branch
    $ git pull

Em seguida, você pode fazer o merge dessas alterações no seu branch master. Você pode usar `git merge -s subtree` e ele irá funcionar normalmente; mas o Git também irá fazer o merge do histórico, coisa que você provavelmente não quer. Para trazer as alterações e preencher a mensagem de commit, use as opções `--squash` e `--no-commit` com a opção de estratégia `-s subtree`:

    $ git checkout master
    $ git merge --squash -s subtree --no-commit rack_branch
    Squash commit -- not updating HEAD
    Automatic merge went well; stopped before committing as requested

Foi feito o merge de todas suas alterações do projeto Rack e elas estão prontas para o commit local. Você também pode fazer o oposto — alterar o subdiretório `rack` do seu branch master e depois fazer o merge delas no seu branch `rack_branch` para enviá-las para os mantenedores do projeto ou para o projeto original.

Para ver o diff entre o que você tem no seu subdiretório `rack` e o código no seu branch `rack_branch` — para ver se você precisa fazer o merge deles — você não pode usar o comando `diff`. Em vez disso, você precisa executar `git diff-tree` com o branch que você quer comparar:

    $ git diff-tree -p rack_branch

Ou, para comparar o que tem no seu subdiretório `rack` com o que estava no branch `master` no servidor na última vez que você se conectou a ele, você pode executar

    $ git diff-tree -p rack_remote/master
