# Seleção de Revisão

Git permite que você escolha commits específicos ou uma série de commits de várias maneiras. Elas não são necessariamente óbvias mas é útil conhecê-las.

## Revisões Únicas

Obviamente você pode se referir a um commit pelo hash SHA-1 que é dado, mas também existem formas mais amigáveis para se referir a commits. Esta seção descreve as várias formas que você pode se referir a um único commit.

## SHA Curto

Git é inteligente o suficiente para descobrir qual commit você quis digitar se você fornecer os primeiros caracteres, desde que o SHA-1 parcial tenha pelo menos quatro caracteres e não seja ambíguo — ou seja, somente um objeto no repositório atual começe com esse código SHA-1 parcial.

Por exemplo, para ver um commit específico, digamos que você execute um comando `git log` e identifique o commit que adicionou uma certa funcionalidade:

    $ git log
    commit 734713bc047d87bf7eac9674765ae793478c50d3
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri Jan 2 18:32:33 2009 -0800

        fixed refs handling, added gc auto, updated tests

    commit d921970aadf03b3cf0e71becdaab3147ba71cdef
    Merge: 1c002dd... 35cfb2b...
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Dec 11 15:08:43 2008 -0800

        Merge commit 'phedders/rdocs'

    commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Dec 11 14:58:32 2008 -0800

        added some blame and merge stuff

Neste caso, escolho `1c002dd....` Se você executar `git show` nesse commit, os seguintes comandos são equivalentes (assumindo que as versões curtas não são ambíguas):

    $ git show 1c002dd4b536e7479fe34593e72e6c6c1819e53b
    $ git show 1c002dd4b536e7479f
    $ git show 1c002d

Git pode descobrir uma abreviação curta, única para seus valores SHA-1. Se você passasr a opção `--abbrev-commit` para o comando `git log`, a saída irá usar valores curtos mas os mantém únicos; por padrão ele usa sete caracteres mas, usa mais se necessário para manter o SHA-1 não ambíguo:

    $ git log --abbrev-commit --pretty=oneline
    ca82a6d changed the verison number
    085bb3b removed unnecessary test code
    a11bef0 first commit

Geralmente, entre oito e dez caracteres são mais que suficientes para ser único em um projeto. Um dos maiores projetos no Git, o kernel do Linux, está começando a ter a necessidade de 12 caracteres dos 40 possíveis para ser único.

## UMA NOTA SOBRE SHA-1

Muitas pessoas ficam preocupadas que em algum momento elas terão, por coincidência aleatória, dois objetos em seus repósitorios com hash com o mesmo valor de SHA-1. O que fazer?

Se acontecer de você fazer um commit de um objeto que tem o hash com o mesmo valor de SHA-1 de um objeto existente no seu repositório, GIt notará o primeiro objeto existente no seu banco de dados e assumirá que ele já foi gravado. Se você tentar fazer o checkout desse objeto novamente em algum momento, sempre receberá os dados do primeiro objeto.

Porém, você deve estar ciente de quão ridiculamente improvável é esse cenário. O código SHA-1 tem 20 bytes ou 160 bits. O número de objetos com hashes aleatórios necessários para garantir a probabilidade de 50% de uma única colisão é cerca de 2^80 (a fórmula para determinar a probabilidade de colisão é `p = (n(n-1)/2) * (1/2^160))`. 2^80 é 1.2 x 10^24 ou 1 milhão de bilhões de bilhões. Isso é 1.200 vezes o número de grãos de areia na Terra.

Aqui está um exemplo para lhe dar uma idéia do que seria necessário para obter uma colisão de SHA-1. Se todos os 6,5 bilhões de humanos na Terra estivessem programando, e a cada segundo, cada um estivesse produzindo código que é equivalente ao histórico inteiro do kernel do Linux (1 milhão de objetos Git) e fazendo o push para um enorme repositório Git, levaria 5 anos até que esse repositório tenha objetos suficientes para ter uma probabilidade de 50% de uma única colisão de objetos SHA-1. Existe uma probabilidade maior de cada membro do seu time de programação ser atacado e morto por lobos na mesma noite em incidentes sem relação.

## Referências de Branch

A maneira mais simples de especificar um commit requer que ele tenha uma referência de um branch apontando para ele. Então, você pode usar um nome de branch em qualquer comando no Git que espera um objeto commit ou valor SHA-1. Por exemplo, se você quer mostrar o último objeto commit em um branch, os seguintes comandos são equivalentes, assumindo que o branch `topic1` aponta para `ca82a6d`:

    $ git show ca82a6dff817ec66f44342007202690a93763949
    $ git show topic1

Se você quer ver para qual SHA específico um branch aponta, ou se você quer ver o que qualquer desses exemplos se resumem em termos de SHAs, você pode usar uma ferramenta de Git plumbing chamada `rev-parse`. Você pode ver o *Capítulo 9* para mais informações sobre ferramentas de plumbing (canalização); basicamente, `rev-parse` existe para operações de baixo nível e não é projetada para ser usada em operações do dia-a-dia. Entretanto, ela as vezes pode ser útil quando você precisa ver o que realmente está acontecendo. Aqui você pode executar `rev-parse` no seu branch.

    $ git rev-parse topic1
    ca82a6dff817ec66f44342007202690a93763949

## Abreviações do RefLog

Uma das coisas que o Git faz em segundo plano enquanto você está fora é manter um reflog — um log de onde suas referências de HEAD e branches estiveram nos últimos meses.

Você poder ver o reflog usando `git reflog`:

    $ git reflog
    734713b... HEAD@{0}: commit: fixed refs handling, added gc auto, updated
    d921970... HEAD@{1}: merge phedders/rdocs: Merge made by recursive.
    1c002dd... HEAD@{2}: commit: added some blame and merge stuff
    1c36188... HEAD@{3}: rebase -i (squash): updating HEAD
    95df984... HEAD@{4}: commit: # This is a combination of two commits.
    1c36188... HEAD@{5}: rebase -i (squash): updating HEAD
    7e05da5... HEAD@{6}: rebase -i (pick): updating HEAD

Cada vez que a extremidade do seu branch é atualizada por qualquer motivo, Git guarda essa informação para você nesse histórico temporário. E você pode especificar commits mais antigos com esses dados, também. Se você quer ver o quinto valor anterior ao HEAD do seu repositório, você pode usar a referência `@{n}` que você vê na saída do reflog:

    $ git show HEAD@{5}

Você também pode usar essa sintaxe para ver onde um branch estava há um período de tempo anterior. Por exemplo, para ver onde seu branch `master` estava ontem, você pode digitar

    $ git show master@{yesterday}

Isso mostra onde a extremidade do branch estava ontem. Essa técnica funciona somente para dados que ainda estão no seu reflog, você não pode usá-la para procurar commits feitos há muitos meses atrás.

Para ver a informação do reflog formatada como a saída do `git log`, você pode executar `git log -g`:

    $ git log -g master
    commit 734713bc047d87bf7eac9674765ae793478c50d3
    Reflog: master@{0} (Scott Chacon <schacon@gmail.com>)
    Reflog message: commit: fixed refs handling, added gc auto, updated
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri Jan 2 18:32:33 2009 -0800

        fixed refs handling, added gc auto, updated tests

    commit d921970aadf03b3cf0e71becdaab3147ba71cdef
    Reflog: master@{1} (Scott Chacon <schacon@gmail.com>)
    Reflog message: merge phedders/rdocs: Merge made by recursive.
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Dec 11 15:08:43 2008 -0800

        Merge commit 'phedders/rdocs'

É importante notar que a informação do reflog é estritamente local — é um log do que você fez no seu repositório. As referências não serão as mesmas na cópia do repositório de outra pessoa; e logo depois que você fez o clone inicial de um repositório, você terá um reflog vazio, pois nenhuma atividade aconteceu no seu repositório. Executar `git show HEAD@{2.months.ago}` funcionará somente se você fez o clone do projeto há pelo menos dois meses atrás — se você fez o clone dele há cinco minutos, você não terá resultados.

## Referências Ancestrais

A outra principal maneira de especificar um commit é através de seu ancestral. Se você colocar um `^` no final da referência, Git interpreta isso como sendo o pai do commit. Suponha que você veja o histórico do seu projeto:

    $ git log --pretty=format:'%h %s' --graph
    * 734713b fixed refs handling, added gc auto, updated tests
    *   d921970 Merge commit 'phedders/rdocs'
    |\
    | * 35cfb2b Some rdoc changes
    * | 1c002dd added some blame and merge stuff
    |/
    * 1c36188 ignore *.gem
    * 9b29157 add open3_detach to gemspec file list

Em seguinda, você pode ver o commit anterior especificando `HEAD^`, que significa "o pai do HEAD":

    $ git show HEAD^
    commit d921970aadf03b3cf0e71becdaab3147ba71cdef
    Merge: 1c002dd... 35cfb2b...
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Dec 11 15:08:43 2008 -0800

        Merge commit 'phedders/rdocs'

Você também pode informar um número depois do `^` — por exemplo, `d921970^2` significa "o segundo pai de d921970." Essa sintaxe só é útil para commits com merge, que têm mais de um pai. O primeiro pai é o branch que você estava quando fez o merge, e o segundo é o commit no branch que você fez o merge:

    $ git show d921970^
    commit 1c002dd4b536e7479fe34593e72e6c6c1819e53b
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Thu Dec 11 14:58:32 2008 -0800

        added some blame and merge stuff

    $ git show d921970^2
    commit 35cfb2b795a55793d7cc56a6cc2060b4bb732548
    Author: Paul Hedderly <paul+git@mjr.org>
    Date:   Wed Dec 10 22:22:03 2008 +0000

        Some rdoc changes

A outra forma de especificar ancestrais é o `~`. Isso também faz referência ao primeiro pai, assim `HEAD~` e `HEAD^` são equivalentes. A diferença se torna aparente quando você informa um número. `HEAD~2` significa "o primeiro pai do primeiro pai," ou "o avô" — passa pelos primeiros pais a quantidade de vezes que você informa. Por exemplo, no histórico listado antes, `HEAD~3` seria

    $ git show HEAD~3
    commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
    Author: Tom Preston-Werner <tom@mojombo.com>
    Date:   Fri Nov 7 13:47:59 2008 -0500

        ignore *.gem

Isso também pode ser escrito `HEAD^^^`, que novamente, é o primeiro pai do primeiro pai do primeiro pai:

    $ git show HEAD^^^
    commit 1c3618887afb5fbcbea25b7c013f4e2114448b8d
    Author: Tom Preston-Werner <tom@mojombo.com>
    Date:   Fri Nov 7 13:47:59 2008 -0500

        ignore *.gem

Você também pode combinar essas sintaxes — você pode obter o segundo pai da referência anterior (assumindo que ele era um commit com merge) usando `HEAD~3^2`, e assim por diante.

## Intervalos de Commits

Agora que você pode especificar commits individuais, vamos ver como especificar intervalos de commits. Isso é particularmente útil para gerenciar seus branches — se você tem muitos branches, você pode usar especificações de intervalos para responder perguntas como, "Que modificações existem nesse branch que ainda não foram mescladas (merge) no meu branch principal?".

### Ponto Duplo

A especificação de intervalo mais comum é a sintaxe de ponto-duplo. Isso basicamente pede ao Git para encontrar um intervalo de commits que é acessível a partir de um commit, mas não são acessíveis a partir de outro. Por exemplo, digamos que você tem um histórico de commits como a Figure 6-1.


![](http://git-scm.com/figures/18333fig0601-tn.png)

Figura 6-1. Exemplo de histórico de seleção de intervalo.

Você quer ver o que existe no seu branch mas não existe no branch master. Você pede ao Git para mostrar um log apenas desses commits com `master..experiment` — isso significa "todos os commits acessíveis por experiment que não são acessíveis por master." Para deixar os exemplos mais breves e claros, vou usar as letras dos objetos dos commits do diagrama no lugar da saída real do log na ordem que eles seriam mostrados:

    $ git log master..experiment
    D
    C

Se, por outro lado, você quer ver o oposto — todos os commits em `master` que não estão em `experiment` — você pode inverter os nomes dos branches. `experiment..master` exibe tudo em `master` que não é acessível em `experiment`:

    $ git log experiment..master
    F
    E

Isso é útil se você quer manter o branch `experiment` atualizado e visualizar que merge você está prestes a fazer. Outro uso muito freqüente desta sintaxe é para ver o que você está prestes a enviar para um remoto:

    $ git log origin/master..HEAD

Esse comando lhe mostra qualquer commit no seu branch atual que não está no branch `master` no seu remoto `origin`. Se você executar um `git push` e seu branch atual está rastreando `origin/master`, os commits listados por `git log origin/master..HEAD` são os commits que serão transferidos para o servidor. Você também pode não informar um lado da sintaxe que o Git assumirá ser HEAD. Por exemplo, você pode obter os mesmos resultados que no exemplo anterior digitando `git log origin/master..` — Git substitui por HEAD o lado que está faltando.

### Múltiplos Pontos

A sintaxe ponto-duplo é útil como um atalho; mas talvez você queira especificar mais de dois branches para indicar suar revisão, como ver quais commits estão em qualquer um dos branches mas não estão no branch que você está atualmente. Git permite que você faça isso usando o caractere `^` ou `--not` antes de qualquer referência a partir do qual você não quer ver commits acessíveis. Assim, estes três comandos são equivalentes:

    $ git log refA..refB
    $ git log ^refA refB
    $ git log refB --not refA

Isso é bom porque com essa sintaxe você pode especificar mais de duas referências em sua consulta, o que você não pode fazer com a sintaxe ponto-duplo. Por exemplo, se você quer ver todos os commits que são acessíveis de `refA` ou `refB` mas não de `refC`, você pode digitar um desses:

    $ git log refA refB ^refC
    $ git log refA refB --not refC

Este é um sistema de consulta de revisão muito poderoso que deve ajudá-lo a descobrir o que existe nos seus branches.

### Ponto Triplo

A última grande sintaxe de intervalo de seleção é a sintaxe ponto-triplo, que especifica todos os commits que são acessíveis por qualquer uma das duas referências mas não por ambas. Veja novamente o exemplo de histórico de commits na Figure 6-1. Se você quer ver o que tem em `master` ou `experiment` mas sem referências comuns, você pode executar

    $ git log master...experiment
    F
    E
    D
    C

Novamente, isso lhe da uma saída de `log` normal mas mostra somente as informações desses quatro commits, aparecendo na ordem de data de commit tradicional.

Uma opção comum para usar com o comando `log` nesse caso é `--left-right`, que mostra qual lado do intervalo está cada commit. Isso ajuda a tornar os dados mais úteis:

    $ git log --left-right master...experiment
    < F
    < E
    > D
    > C

Com essas ferramentas, você pode informar ao Git mais facilmente qual ou quais commits você quer inspecionar.
