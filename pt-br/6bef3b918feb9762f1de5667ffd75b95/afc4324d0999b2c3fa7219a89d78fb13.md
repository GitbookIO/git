# Fazendo Stash

Muitas vezes, quando você está trabalhando em uma parte do seu projeto, as coisas estão em um estado confuso e você quer mudar de branch por um tempo para trabalhar em outra coisa. O problema é, você não quer fazer o commit de um trabalho incompleto somente para voltar a ele mais tarde. A resposta para esse problema é o comando `git stash`.

Fazer Stash é tirar o estado sujo do seu diretório de trabalho — isto é, seus arquivos modificados que estão sendo rastreados e mudanças na área de seleção — e o salva em uma pilha de modificações inacabadas que você pode voltar a qualquer momento.

## Fazendo Stash do Seu Trabalho

Para demonstrar, você entra no seu projeto e começa a trabalhar em alguns arquivos e adiciona alguma modificação na área de seleção. Se você executar `git status`, você pode ver seu estado sujo:

    $ git status
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #      modified:   index.html
    #
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #
    #      modified:   lib/simplegit.rb
    #

Agora você quer mudar de branch, mas não quer fazer o commit do que você ainda está trabalhando; você irá fazer o stash das modificações. Para fazer um novo stash na sua pilha, execute `git stash`:

    $ git stash
    Saved working directory and index state \
      "WIP on master: 049d078 added the index file"
    HEAD is now at 049d078 added the index file
    (To restore them type "git stash apply")

Seu diretório de trabalho está limpo:

    $ git status
    # On branch master
    nothing to commit (working directory clean)

Neste momento, você pode facilmente mudar de branch e trabalhar em outra coisa; suas alterações estão armazenadas na sua pilha. Para ver as stashes que você guardou, você pode usar `git stash list`:

    $ git stash list
    stash@{0}: WIP on master: 049d078 added the index file
    stash@{1}: WIP on master: c264051... Revert "added file_size"
    stash@{2}: WIP on master: 21d80a5... added number to log

Nesse caso, duas stashes tinham sido feitas anteriormente, então você tem acesso a três trabalhos stashed diferentes. Você pode aplicar aquele que acabou de fazer o stash com o comando mostrado na saída de ajuda do comando stash original: `git stash apply`. Se você quer aplicar um dos stashes mais antigos, você pode especificá-lo, assim: `git stash apply stash@{2}`. Se você não especificar um stash, Git assume que é o stash mais recente e tenta aplicá-lo:

    $ git stash apply
    # On branch master
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #
    #      modified:   index.html
    #      modified:   lib/simplegit.rb
    #

Você pode ver que o Git altera novamente os arquivos que você reverteu quando salvou o stash. Neste caso, você tinha um diretório de trabalho limpo quando tentou aplicar o stash, e você tentou aplicá-lo no mesmo branch de onde tinha guardado; mas ter um diretório de trabalho limpo e aplicá-lo no mesmo branch não é necessario para usar um stash com sucesso. Você pode salvar um stash em um branch, depois mudar para outro branch, e tentar reaplicar as alterações. Você também pode ter arquivos alterados e sem commits no seu diretório de trabalho quando aplicar um stash — Git informa conflitos de merge se alguma coisa não aplicar de forma limpa.

As alterações em seus arquivos foram reaplicadas, mas o arquivo que você colocou na área de seleção antes não foi adicionado novamente. Para fazer isso, você deve executar o comando `git stash apply` com a opção `--index` para informar ao comando para tentar reaplicar as modificações da área de seleção. Se você tivesse executado isso, você teria conseguido voltar à sua posição original:

    $ git stash apply --index
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #      modified:   index.html
    #
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #
    #      modified:   lib/simplegit.rb
    #

A opção apply somente tenta aplicar o stash armazenado — ele continua na sua pilha. Para removê-lo, você pode executar `git stash drop` com o nome do stash que quer remover:

    $ git stash list
    stash@{0}: WIP on master: 049d078 added the index file
    stash@{1}: WIP on master: c264051... Revert "added file_size"
    stash@{2}: WIP on master: 21d80a5... added number to log
    $ git stash drop stash@{0}
    Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

Você também pode executar `git stash pop` para aplicar o stash e logo em seguida apagá-lo da sua pilha.

## Revertendo um Stash

Em alguns cenários você pode querer aplicar alterações de um stash, trabalhar, mas desfazer essas alterações que originalmente vieram do stash. Git não fornece um comando como `stash unapply`, mas é possível fazer o mesmo simplesmente recuperando o patch associado com um stash e aplicá-lo em sentido inverso:

    $ git stash show -p stash@{0} | git apply -R

Novamente, se você não especificar um stash, Git assume que é o stash mais recente:

    $ git stash show -p | git apply -R

Você pode querer criar um alias e adicionar explicitamente um comando `stash-unapply` no seu git. Por exemplo:

    $ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
    $ git stash
    $ #... work work work
    $ git stash-unapply

## Criando um Branch de um Stash

Se você criar um stash, deixá-lo lá por um tempo, e continuar no branch de onde criou o stash, você pode ter problemas em reaplicar o trabalho. Se o apply tentar modificar um arquivo que você alterou, você vai ter um conflito de merge e terá que tentar resolvê-lo. Se você quer uma forma mais fácil de testar as modificações do stash novamente, você pode executar `git stash branch`, que cria um novo branch para você, faz o checkout do commit que você estava quando criou o stash, reaplica seu trabalho nele, e então apaga o stash se ele é aplicado com sucesso:

    $ git stash branch testchanges
    Switched to a new branch "testchanges"
    # On branch testchanges
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #      modified:   index.html
    #
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #
    #      modified:   lib/simplegit.rb
    #
    Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

Este é um bom atalho para recuperar facilmente as modificações em um stash e trabalhar nele em um novo branch.
