# Reescrevendo o Histórico

Muitas vezes, trabalhando com o Git, você pode querer revisar seu histórico de commits por alguma razão. Uma das melhores funcionalidades do Git é que ele permite você tomar decisões no último momento possível. Você pode decidir quais arquivos vai em qual commit um pouco antes de fazer o commit da área de seleção, você pode decidir que não quer trabalhar em alguma coisa ainda com o comando stash, e você pode reescrever commits que já aconteceram para que eles pareçam ter acontecido de outra maneira. Isso pode envolver mudar a ordem dos commits, alterar mensagens ou arquivos em um commit, juntar ou separar commits, ou remover commits completamente — tudo isso antes de compartilhar seu trabalho com os outros.

Nesta seção, você verá como realizar essas tarefas muito úteis de modo que você pode fazer seu histórico de commits parecer da forma que você quiser antes de compartilhá-lo com outros.

## Alterando o Último Commit

Modificar o último commit é provavelmente a alteração de histórico mais comum que você irá fazer. Muitas vezes você vai querer fazer duas coisas básicas com seu último commit: mudar a mensagem do commit, ou mudar o snapshot que você acabou de salvar, adicionando, alterando e removendo arquivos.

Se você quer somente modificar a mensagem do seu último commit, é muito simples:

    $ git commit --amend

Isso abre seu editor de texto, com sua última mensagem de commit nele, pronto para você modificar a mensagem. Quando você salva e fecha o editor, ele salva um novo commit contendo essa mensagem e fazendo esse seu novo commit o mais recente.

Se você fez o commit e quer alterar o snapshot adicionando ou modificando arquivos, possivelmente porque você esqueceu de adicionar um arquivo novo quando fez o commit original, o processo funciona basicamente da mesma maneira. Você adiciona as alterações que deseja na área de seleção editando um arquivo e executando `git add` nele ou `git rm` em um arquivo rastreado, e depois `git commit --amend` pega sua área de seleção atual e faz o snapshot para o novo commit.

Você precisa ter cuidado com essa técnica porque isso muda o SHA-1 do commit. É como um rebase muito pequeno — não altere seu último commit se você já fez o push dele.

## Alterando Várias Mensagens de Commit

Para modificar um commit mais antigo em seu histórico, você deve usar ferramentas mais complexas. Git não tem uma ferramenta de modificação de histórico, mas você pode usar o rebase para alterar uma série de commits no HEAD onde eles estavam originalmente em vez de movê-los para um novo. Com a ferramenta de rebase interativo, você pode parar depois de cada commit que quer modificar e alterar a mensagem, adicionar arquivos, ou fazer o que quiser. Você pode executar o rebase de forma interativa adicionando a opção `-i` em `git rebase`. Você deve indicar quão longe você quer reescrever os commits informando ao comando qual commit quer fazer o rebase.

Por exemplo, se você quer alterar as mensagens dos últimos três commits, ou qualquer mensagem de commit nesse grupo, você informa como argumento para `git rebase -i` o pai do último commit que você quer editar, que é `HEAD~2^` ou `HEAD~3`. Pode ser mais fácil de lembrar o `~3` porque você está tentando editar os últimos três commits; mas lembre-se que você está indicando realmente quatro commits atrás, o pai do último que você deseja editar:

    $ git rebase -i HEAD~3

Lembre-se que isso é um comando rebase — todos os commits no intervalo `HEAD~3..HEAD` serão reescritos, quer você mude a mensagem ou não. Não inclua nenhum commit que você já enviou a um servidor central — fazer isso irá confudir outros desenvolvedores fornecendo uma versão alternativa da mesma alteração.

Executando esse comando dará a você uma lista de commits no seu editor de texto que se parece com isso:

    pick f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

    # Rebase 710f0f8..a5f4a0d onto 710f0f8
    #
    # Commands:
    #  p, pick = use commit
    #  e, edit = use commit, but stop for amending
    #  s, squash = use commit, but meld into previous commit
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    # However, if you remove everything, the rebase will be aborted.
    #

É importante notar que esses commits são listados na ordem inversa do que você normalmente vê usando o comando `log`. Se você executar um `log`, você vê algo como isto:

    $ git log --pretty=format:"%h %s" HEAD~3..HEAD
    a5f4a0d added cat-file
    310154e updated README formatting and added blame
    f7f3f6d changed my name a bit

Observe a ordem inversa. O rebase interativo lhe da um script que ele irá executar. Ele começará no commit que você especifica na linha de comando (`HEAD~3`) e repete as modificações introduzidas em cada um desses commits de cima para baixo. Ele lista o mais antigo primeiro, em vez do mais recente, porque ele vai ser o primeiro a ser alterado.

Você precisa editar o script para que ele pare no commit que você deseja editar. Para fazer isso, mude a palavra "pick" para a palavra "edit" para cada um dos commits que você deseja que o script pare. Por exemplo, para alterar somente a terceira mensagem de commit, você altera o arquivo para ficar assim:

    edit f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

Quando você salva e fecha o editor, Git retorna para o último commit na lista e deixa você na linha de comando com a seguinte mensagem:

    $ git rebase -i HEAD~3
    Stopped at 7482e0d... updated the gemspec to hopefully work better
    You can amend the commit now, with

           git commit --amend

    Once you’re satisfied with your changes, run

           git rebase --continue

Estas instruções lhe dizem exatamente o que fazer. Digite

    $ git commit --amend

Altere a mensagem do commit, e saia do editor. Depois execute

    $ git rebase --continue

Esse comando irá aplicar os outros dois commits automaticamente, e pronto. Se você alterar "pick" para "edit" em mais linhas, você pode repetir esses passos para cada commit que mudar para "edit". Cada vez, Git irá parar, permitir que você altere o commit, e continuar quando você tiver terminado.

## Reordenando Commits

Você também pode usar rebase interativo para reordenar ou remover commits completamente. Se você quer remover o commit "added cat-file" e mudar a ordem em que os outros dois commits foram feitos, você pode alterar o script do rebase disso

    pick f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

para isso:

    pick 310154e updated README formatting and added blame
    pick f7f3f6d changed my name a bit

Quando você salva e sai do editor, Git volta seu branch para o pai desses commits, altera o `310154e` e depois o `f7f3f6d`, e para. Você efetivamente alterou a ordem desses commits e removeu o commit "added cat-file" completamente.

## Achatando um Commit

Também é possível pegar uma série de commits e achatá-los em um único commit com a ferramenta de rebase interativo. O script coloca informações importantes na mensagem de rebase:

    #
    # Commands:
    #  p, pick = use commit
    #  e, edit = use commit, but stop for amending
    #  s, squash = use commit, but meld into previous commit
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    # However, if you remove everything, the rebase will be aborted.
    #

Se, em vez de "pick" ou "edit", você especifica "squash", Git modifica essa e a alteração imediatamente anterior a ela e faz com que você faça o merge das mensagens de commits. Então, se você quer fazer um único commit a partir desses três commits, você modifica o script para algo como isso:

    pick f7f3f6d changed my name a bit
    squash 310154e updated README formatting and added blame
    squash a5f4a0d added cat-file

Quando você salva e sai do editor, Git aplica as três modificações e coloca você de volta no editor para fazer o merge das três mensagens de commit:

    # This is a combination of 3 commits.
    # The first commit's message is:
    changed my name a bit

    # This is the 2nd commit message:

    updated README formatting and added blame

    # This is the 3rd commit message:

    added cat-file

Quando você salvar isso, você terá um único commit com as alterações dos três commits anteriores.

## Dividindo um Commit

Dividir um commit significa desfazer um commit e parcialmente adicionar a área de seleção e commits dependendo do número de commits que você quer. Por exemplo, digamos que você quer dividir o commit do meio daqueles seus três commits. Em vez de "updated README formatting and added blame", você quer dividí-lo em dois commits: "updated README formatting" no primeiro, e "added blame" no segundo. Você pode fazer isso no script `rebase -i` mudando a instrução para "edit" no commit que você quer dividir:

    pick f7f3f6d changed my name a bit
    edit 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

Depois, quando o script colocar retornar para a linha de comando, você faz o reset desse commit, pega as alterações desse reset, e cria vários commits delas. Quando você salvar e sai do editor, Git volta ao pai do primeiro commit da sua lista, altera o primeiro commit (`f7f3f6d`), altera o segundo (`310154e`), e retorna você ao console. Lá, você pode fazer um reset desse commit com `git reset HEAD^`, que efetivamente desfaz o commit e deixa os arquivos alterados fora da área de seleção. Agora você pode colocar na área de seleção e fazer vários commits, e executar `git rebase --continue` quando estiver pronto:

    $ git reset HEAD^
    $ git add README
    $ git commit -m 'updated README formatting'
    $ git add lib/simplegit.rb
    $ git commit -m 'added blame'
    $ git rebase --continue

Git altera o último commit (`a5f4a0d`) no script, e seu histórico fica assim:

    $ git log -4 --pretty=format:"%h %s"
    1c002dd added cat-file
    9b29157 added blame
    35cfb2b updated README formatting
    f3cc40e changed my name a bit

Mais uma vez, isso altera os SHAs de todos os commits na sua lista, então certifique-se que você não fez o push de nenhum commit dessa lista para um repositório compartilhado.

## A Opção Nuclear: filter-branch

Existe uma outra opção de reescrita de histórico que você pode usar se precisa reescrever um grande número de commits em forma de script — por exemplo, mudar seu endereço de e-mail globalmente ou remover um arquivo de cada commit. O camando é `filter-branch`, e ele pode reescrever uma grande parte do seu histórico, então você não deve usá-lo a menos que seu projeto ainda não seja público e outras pessoas não se basearam nos commits que você está para reescrever. Porém, ele pode ser muito útil. Você irá aprender alguns usos comuns para ter uma idéia do que ele é capaz.

### Removendo um Arquivo de Cada Commit

Isso é bastante comum de acontecer. Alguém acidentalmente faz um commit sem pensar de um arquivo binário gigante com `git add .`, e você quer removê-lo de todos os lugares. Talvez você tenha feito o commit de um arquivo que continha uma senha, e você quer liberar o código fonte do seu projeto. `filter-branch` é a ferramenta que você pode usar para limpar completamente seu histórico. Para remover um arquivo chamado passwords.txt completamente do seu histórico, você pode usar a opção `--tree-filter` em `filter-branch`:

    $ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
    Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
    Ref 'refs/heads/master' was rewritten

A opção `--tree-filter` executa o comando especificado depois de cada checkout do projeto e faz o commit do resultado novamente. Neste caso, você está removendo um arquivo chamado passwords.txt de cada snapshot, quer ele exista ou não. Se você quer remover todos os arquivos de backup do editor que entraram em commits acidentalmente, você pode executar algo como `git filter-branch --tree-filter "find * -type f -name '*~' -delete" HEAD`.

Você irá assistir o Git reescrever árvores e commits e, em seguida, no final, mover a referência do branch. Geralmente é uma boa idéia fazer isso em um branch de teste e depois fazer um hard-reset do seu branch master depois que você viu que isso era realmente o que queria fazer. Para executar `filter-branch` em todos os seus branches, você pode informar `--all` ao comando.

### Fazendo um Subdiretório o Novo Raiz

Digamos que você importou arquivos de outro sistema de controle de versão e ele tem subdiretórios que não fazem sentido (trunk, tags, e outros). Se você quer fazer o subdiretório `trunk` ser a nova raiz do projeto para todos os commits, `filter-branch` pode ajudar a fazer isso, também:

    $ git filter-branch --subdirectory-filter trunk HEAD
    Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
    Ref 'refs/heads/master' was rewritten

Agora a sua nova raiz do projeto é o que estava no subdiretório `trunk`. Git também apagará automaticamente os commits que não afetaram o subdiretório.

### Alterando o Endereço de E-Mail Globalmente

Outro caso comum é quando você esqueceu de executar `git config` para configurar seu nome e endereço de e-mail antes de começar a trabalhar, ou talvez você queira liberar o código fonte de um projeto do trabalho e quer mudar o endereço de e-mail profissional para seu endereço pessoal. Em todo caso, você também pode alterar o endereço de e-mail em vários commits com um script `filter-branch`. Você precisa ter cuidado para alterar somente o seu endereço de e-mail, use `--commit-filter`:

    $ git filter-branch --commit-filter '
            if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
            then
                    GIT_AUTHOR_NAME="Scott Chacon";
                    GIT_AUTHOR_EMAIL="schacon@example.com";
                    git commit-tree "$@";
            else
                    git commit-tree "$@";
            fi' HEAD

Isso reescreve cada commit com seu novo endereço. Pelo fato dos commits terem os valores SHA-1 dos pais deles, esse comando altera todos os SHAs dos commits no seu histórico, não apenas aqueles que têm o endereço de e-mail correspondente.
