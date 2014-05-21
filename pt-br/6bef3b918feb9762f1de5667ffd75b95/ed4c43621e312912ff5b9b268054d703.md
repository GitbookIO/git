# Área de Seleção Interativa

Git vem com alguns scripts que facilitam algumas tarefas de linha de comando. Aqui, você verá alguns comandos interativos que podem ajudar você a facilmente escolher combinações ou partes de arquivos para incorporar em um commit. Essas ferramentas são muito úteis se você modificou vários arquivos e decidiu que quer essas modificações em commits separados em vez de um grande e bagunçado commit. Desta maneira, você pode ter certeza que seus commits estão logicamente separados e podem ser facilmente revisados pelos outros desenvolvedores trabalhando com você. Se você executar `git add` com a opção `-i` ou `--interactive`, Git entra em um modo interativo de shell, exibindo algo desse tipo:

    $ git add -i
               staged     unstaged path
      1:    unchanged        +0/-1 TODO
      2:    unchanged        +1/-1 index.html
      3:    unchanged        +5/-1 lib/simplegit.rb

    *** Commands ***
      1: status     2: update      3: revert     4: add untracked
      5: patch      6: diff        7: quit       8: help
    What now>

Você pode ver que esse comando lhe mostra uma visão muito diferente da sua área de seleção — basicamente a mesma informação que você recebe com `git status` mas um pouco mais sucinto e informativo. Ele lista as modificações que você colocou na área de seleção à esquerda e as modificações que estão fora à direita.

Depois disso vem a seção Commands. Aqui você pode fazer uma série de coisas, incluindo adicionar arquivos na área de seleção, retirar arquivos, adicionar partes de arquivos, adicionar arquivos não rastreados, e ver diffs de o que já foi adicionado.

## Adicionando e Retirando Arquivos

Se você digitar `2` ou `u` em `What now>`, o script perguntará quais arquivos você quer adicionar:

    What now> 2
               staged     unstaged path
      1:    unchanged        +0/-1 TODO
      2:    unchanged        +1/-1 index.html
      3:    unchanged        +5/-1 lib/simplegit.rb
    Update>>

Para adicionar os arquivos TODO e index.html, você pode digitar os números:

    Update>> 1,2
               staged     unstaged path
    * 1:    unchanged        +0/-1 TODO
    * 2:    unchanged        +1/-1 index.html
      3:    unchanged        +5/-1 lib/simplegit.rb
    Update>>

O `*` ao lado de cada arquivos significa que o arquivo está selecionado para ser adicionado. Se você pressionar Enter sem digitar nada em `Update>>`, Git pega tudo que esta selecionado e adiciona na área de seleção para você:

    Update>>
    updated 2 paths

    *** Commands ***
      1: status     2: update      3: revert     4: add untracked
      5: patch      6: diff        7: quit       8: help
    What now> 1
               staged     unstaged path
      1:        +0/-1      nothing TODO
      2:        +1/-1      nothing index.html
      3:    unchanged        +5/-1 lib/simplegit.rb

Agora você pode ver que os arquivos TODO e index.html estão na área de seleção e o arquivo simplegit.rb ainda está fora. Se você quer retirar o arquivo TODO nesse momento, você usa a opção `3` ou `r` (para reverter):

    *** Commands ***
      1: status     2: update      3: revert     4: add untracked
      5: patch      6: diff        7: quit       8: help
    What now> 3
               staged     unstaged path
      1:        +0/-1      nothing TODO
      2:        +1/-1      nothing index.html
      3:    unchanged        +5/-1 lib/simplegit.rb
    Revert>> 1
               staged     unstaged path
    * 1:        +0/-1      nothing TODO
      2:        +1/-1      nothing index.html
      3:    unchanged        +5/-1 lib/simplegit.rb
    Revert>> [enter]
    reverted one path

Olhando o seu Git status novamente, você pode ver que você retirou o arquivo TODO:

    *** Commands ***
      1: status     2: update      3: revert     4: add untracked
      5: patch      6: diff        7: quit       8: help
    What now> 1
               staged     unstaged path
      1:    unchanged        +0/-1 TODO
      2:        +1/-1      nothing index.html
      3:    unchanged        +5/-1 lib/simplegit.rb

Para ver o diff do que você adicionou, você pode usar o comando `6` ou `d` (para diff). Ele exibe uma lista dos seus arquivos adicionados, e você pode selecionar aqueles que você gostaria de ver a diferença. Isso é muito parecido com informar o comando `git diff --cached`:

    *** Commands ***
      1: status     2: update      3: revert     4: add untracked
      5: patch      6: diff        7: quit       8: help
    What now> 6
               staged     unstaged path
      1:        +1/-1      nothing index.html
    Review diff>> 1
    diff --git a/index.html b/index.html
    index 4d07108..4335f49 100644
    --- a/index.html
    +++ b/index.html
    @@ -16,7 +16,7 @@ Date Finder

     <p id="out">...</p>

    -<div id="footer">contact : support@github.com</div>
    +<div id="footer">contact : email.support@github.com</div>

     <script type="text/javascript">

Com esses comandos básicos, você pode usar o modo interativo para lidar com sua área de seleção um pouco mais facilmente.

## Adicionando Patches

No Git também é possível adicionar certas partes de arquivos e deixar o resto de fora. Por exemplo, se você faz duas mudanças no seu arquivo simplegit.rb e quer adicionar uma delas mas não a outra, fazer isso é muito fácil no Git. A partir do prompt interativo, digite `5` ou `p` (para patch). Git irá perguntar quais arquivos você gostaria de adicionar parcialmente; então, para cada seção dos arquivos selecionados, ele irá exibir partes do diff do arquivo e perguntar se você gostaria de adicioná-los, um por um:

    diff --git a/lib/simplegit.rb b/lib/simplegit.rb
    index dd5ecc4..57399e0 100644
    --- a/lib/simplegit.rb
    +++ b/lib/simplegit.rb
    @@ -22,7 +22,7 @@ class SimpleGit
       end

       def log(treeish = 'master')
    -    command("git log -n 25 #{treeish}")
    +    command("git log -n 30 #{treeish}")
       end

       def blame(path)
    Stage this hunk [y,n,a,d,/,j,J,g,e,?]?

Você tem várias opções neste momento. Digitando `?` exibe uma lista do que você pode fazer:

    Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
    y - stage this hunk
    n - do not stage this hunk
    a - stage this and all the remaining hunks in the file
    d - do not stage this hunk nor any of the remaining hunks in the file
    g - select a hunk to go to
    / - search for a hunk matching the given regex
    j - leave this hunk undecided, see next undecided hunk
    J - leave this hunk undecided, see next hunk
    k - leave this hunk undecided, see previous undecided hunk
    K - leave this hunk undecided, see previous hunk
    s - split the current hunk into smaller hunks
    e - manually edit the current hunk
    ? - print help

Geralmente, você informará `y` ou `n` se você quer adicionar cada parte, mas adicionar todos eles em determinados arquivos ou deixar a decisão de uma parte para depois pode ser útil também. Se você adiconar uma parte do arquivo e deixar outra parte de fora, a saída do status será parecido com isso:

    What now> 1
               staged     unstaged path
      1:    unchanged        +0/-1 TODO
      2:        +1/-1      nothing index.html
      3:        +1/-1        +4/-0 lib/simplegit.rb

O status do arquivo simplegit.rb é interessante. Ele lhe mostra que algumas linhas foram adicionadas e algumas estão fora. Você adicionou esse arquivo parcialmente. Neste momento, você pode sair do script de modo interativo e executar `git commit` para fazer o commit parcial dos arquivos adicionados.

Finalmente, você não precisa estar no modo interativo para adicionar um arquivo parcialmente — você pode executar o mesmo script usando `git add -p` ou `git add --patch` na linha de comando.
