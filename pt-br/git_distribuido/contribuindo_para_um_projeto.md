# Contribuindo Para Um Projeto

Você conhece os diferentes fluxos de trabalho que existem, e você deve ter um conhecimento muito bom do uso essencial do Git. Nesta seção, você aprenderá sobre alguns protocolos comuns para contribuir para um projeto.

A principal dificuldade em descrever este processo é o grande número de variações sobre a forma como ele é feito. Porque Git é muito flexível, as pessoas podem e trabalham juntos de muitas maneiras diferentes, é problemático descrever como você deve contribuir com um projeto — cada projeto é um pouco diferente. Algumas das variáveis ​​envolvidas são o tamanho da base de contribuintes ativos, fluxo de trabalho escolhido, permissões e possivelmente o método de contribuição externa.

A primeira variável é o tamanho da base de contribuintes ativos. Quantos usuários estão ativamente contribuindo código para este projeto, e com que frequência? Em muitos casos, você tem dois ou três desenvolvedores com alguns commits por dia ou menos ainda em projetos mais adormecidos. Para as empresas ou projetos realmente grandes, o número de desenvolvedores poderia ser na casa dos milhares, com dezenas ou mesmo centenas de patches chegando todo dia. Isto é importante porque, com mais e mais desenvolvedores, você encontra mais problemas para assegurar que seu código se aplica corretamente ou pode ser facilmente incorporado. As alterações que você faz poderão se tornar obsoletas ou severamente danificadas pelo trabalho que foi incorporado enquanto você estava trabalhando ou quando as alterações estavam esperando para ser aprovadas e aplicadas. Como você pode manter o seu código consistentemente atualizado e suas correções válidas?

A próxima variável é o fluxo de trabalho em uso para o projeto. É centralizado, com cada desenvolvedor tendo acesso igual de escrita ao repositório principal? O projeto tem um mantenedor ou gerente de integração que verifica todos os patches? Todos os patches são revisados e aprovados? Você está envolvido nesse processo? Há um sistema de tenentes, e você tem que enviar o seu trabalho a eles?

A questão seguinte é o seu acesso de commit. O fluxo de trabalho necessário para contribuir para um projeto é muito diferente se você tiver acesso de gravação para o projeto do que se você não tiver. Se você não tem acesso de gravação, como é que o projeto prefere aceitar contribuições? Há uma política sobre essa questão? Quanto trabalho você contribui de cada vez? Com que frequência você contribui?

Todas estas questões podem afetar a forma que você contribui para um projeto e quais fluxos de trabalho são melhores para você. Falarei sobre os aspectos de cada um deles em uma série de casos de uso, movendo-se do mais simples ao mais complexo, você deve ser capaz de construir os fluxos de trabalho específicos que você precisa na prática a partir desses exemplos.

## Diretrizes de Commit

Antes de você começar a olhar para os casos de uso específicos, aqui está uma breve nota sobre as mensagens de commit. Ter uma boa orientação para a criação de commits e aderir a ela torna o trabalho com Git e a colaboração com os demais muito mais fácil. O projeto Git fornece um documento que estabelece uma série de boas dicas para a criação de commits para submeter patches — você pode lê-lo no código-fonte do Git no arquivo `Documentation/SubmittingPatches`.

Primeiro, você não quer submeter nenhum problema de espaços em branco (whitespace errors). Git oferece uma maneira fácil de verificar isso — antes de fazer commit, execute `git diff --check` para listar possíveis problemas de espaços em branco. Aqui está um exemplo, onde a cor vermelha no terminal foi substituída por `X`s:

    $ git diff --check
    lib/simplegit.rb:5: trailing whitespace.
    +    @git_dir = File.expand_path(git_dir)XX
    lib/simplegit.rb:7: trailing whitespace.
    + XXXXXXXXXXX
    lib/simplegit.rb:26: trailing whitespace.
    +    def command(git_cmd)XXXX

Se você executar esse comando antes de fazer commit, você pode dizer se você está prestes a fazer commit com problemas de espaços em branco que pode incomodar outros desenvolvedores.

Em seguida, tente fazer de cada commit um conjunto de mudanças (changeset) logicamente separado. Se você puder, tente fazer suas alterações fáceis de lidar — não fique programando um fim de semana inteiro para resolver cinco problemas diferentes e então fazer um commit maciço com todas as alterações na segunda-feira. Mesmo se você não faça commits durante o fim de semana, use a "staging area" na segunda-feira para dividir o seu trabalho em pelo menos um commit por problema, com uma mensagem útil em cada commit. Se algumas das alterações modificarem o mesmo arquivo, tente usar `git add --patch` para preparar partes de arquivos (coberto em detalhes no *Capítulo 6*). O snapshot do projeto no final do branch é idêntico se você fizer um ou cinco commits, desde que todas as mudanças tenham sido adicionadas em algum momento. Então tente tornar as coisas mais fáceis para seus colegas desenvolvedores quando eles tiverem que revisar as suas alterações. Essa abordagem também torna mais fácil puxar ou reverter algum dos changesets se você precisar mais tarde. O *Capítulo 6* descreve uma série de truques úteis do Git para reescrever o histórico e adicionar as alterações de forma interativa — use essas ferramentas para ajudar a construir um histórico limpo e compreensível.

Uma última coisa que precisamos ter em mente é a mensagem de commit. Adquirir o hábito de criar mensagens de commit de qualidade torna o uso e colaboração com Git muito mais fácil. Como regra geral, as suas mensagens devem começar com uma única linha com não mais que cerca de 50 caracteres e que descreve o changeset de forma concisa, seguido por uma linha em branco e uma explicação mais detalhada. O projeto Git exige que a explicação mais detalhada inclua a sua motivação para a mudança e que contraste a sua implementação com o comportamento anterior — esta é uma boa orientação a seguir. Também é uma boa ideia usar o tempo verbal presente da segunda pessoa nestas mensagens. Em outras palavras, utilizar comandos. Ao invés de "Eu adicionei testes para" ou "Adicionando testes para", usar "Adiciona testes para". Esse é um modelo originalmente escrito por Tim Pope em `tpope.net`:

    Breve (50 caracteres ou menos) resumo das mudanças

    Texto explicativo mais detalhado, se necessário. Separe em linhas de
    72 caracteres ou menos. Em alguns contextos a primeira linha é
    tratada como assunto do e-mail e o resto como corpo. A linha em branco
    separando o resumo do corpo é crítica (a não ser que o corpo não seja
    incluído); ferramentas como rebase podem ficar confusas se você usar
    os dois colados.

    Parágrafos adicionais vem após linhas em branco.

     - Tópicos também podem ser usados

     - Tipicamente um hífen ou asterisco é utilizado para marcar tópicos,
       precedidos de um espaço único, com linhas em branco entre eles, mas
       convenções variam nesse item

Se todas as suas mensagens de commit parecerem com essa, as coisas serão bem mais fáceis para você e para os desenvolvedores que trabalham com você. O projeto Git tem mensagens de commit bem formatadas — eu encorajo você a executar `git log --no-merges` lá para ver como um histórico de commits bem formatados se parece.

Nos exemplos a seguir e durante a maior parte desse livro, para ser breve eu não formatarei mensagens dessa forma; em vez disso eu usarei a opção `-m` em `git commit`. Faça como eu digo, não faça como eu faço.

## Pequena Equipe Privada

A configuração mais simples que você encontrará é um projeto privado com um ou dois desenvolvedores. Por privado, eu quero dizer código fechado — não acessível para o mundo de fora. Você e os outros desenvolvedores todos têm acesso para dar push de alterações para o repositório.

Nesse ambiente, você pode seguir um fluxo de trabalho similar ao que você usaria com Subversion ou outro sistema centralizado. Você ainda tem as vantagens de coisas como commit offline e facilidade de lidar com branches e merges, mas o fluxo de trabalho pode ser bastante similar; a principal diferença é que merges acontecem no lado do cliente ao invés de no servidor durante o commit. Vamos ver como isso fica quando dois desenvolvedores começam a trabalhar juntos com um repositório compartilhado. O primeiro desenvolvedor, John, clona o repositório, faz alterações e realiza o commit localmente. (Eu estou substituindo as mensagens de protocolo com `...` nesses exemplos para diminuí-los um pouco)

    # Máquina do John
    $ git clone john@githost:simplegit.git
    Initialized empty Git repository in /home/john/simplegit/.git/
    ...
    $ cd simplegit/
    $ vim lib/simplegit.rb
    $ git commit -am 'removed invalid default value'
    [master 738ee87] removed invalid default value
     1 files changed, 1 insertions(+), 1 deletions(-)

O segundo desenvolvedor, Jessica, faz a mesma coisa — clona o repositório e faz um commit:

    # Máquina da Jessica
    $ git clone jessica@githost:simplegit.git
    Initialized empty Git repository in /home/jessica/simplegit/.git/
    ...
    $ cd simplegit/
    $ vim TODO
    $ git commit -am 'add reset task'
    [master fbff5bc] add reset task
     1 files changed, 1 insertions(+), 0 deletions(-)

Agora, Jessica dá push do trabalho dela para o servidor:

    # Máquina da Jessica
    $ git push origin master
    ...
    To jessica@githost:simplegit.git
       1edee6b..fbff5bc  master -> master

John tenta dar push de suas alterações também:

    # Máquina do John
    $ git push origin master
    To john@githost:simplegit.git
     ! [rejected]        master -> master (non-fast forward)
    error: failed to push some refs to 'john@githost:simplegit.git'

John não consegue dar push porque Jessica deu push de outras alterações nesse meio tempo. Isso é especialmente importante de entender se você está acostumado com Subversion porque você irá perceber que dois desenvolvedores não editaram o mesmo arquivo. Enquanto o Subversion faz merge automaticamente no servidor se duas pessoas não editarem o mesmo arquivo, no Git você deve sempre fazer merge dos commits localmente. John tem que baixar as alterações de Jessica e fazer merge antes de poder dar push das alterações:

    $ git fetch origin
    ...
    From john@githost:simplegit
     + 049d078...fbff5bc master     -> origin/master

Nesse ponto, o repositório local de John se parece com a Figura 5-4.


![](http://git-scm.com/figures/18333fig0504-tn.png)

Figura 5-4. Repositório inicial de John.

John tem uma referência para as alterações que Jessica fez, mas ele tem que fazer merge com seu próprio trabalho para poder dar push das suas próprias alterações:

    $ git merge origin/master
    Merge made by recursive.
     TODO |    1 +
     1 files changed, 1 insertions(+), 0 deletions(-)

O merge funciona — o histórico de commits do John agora se parece com a Figura 5-5.


![](http://git-scm.com/figures/18333fig0505-tn.png)

Figura 5-5. Repositório do John depois de fazer merge em `origin/master`.

Agora John pode testar seu código para ter certeza que ele ainda funciona, e então ele pode dar push de seu novo trabalho mesclado para o servidor:

    $ git push origin master
    ...
    To john@githost:simplegit.git
       fbff5bc..72bbc59  master -> master

Finalmente, o histórico de commits de John se parece com a Figura 5-6.


![](http://git-scm.com/figures/18333fig0506-tn.png)

Figura 5-6. O histórico de John depois de ter dado push para o servidor de origem (remote `origin`).

Nesse meio tempo, Jessica tem trabalhado em um "topic branch". Ela criou um "topic branch" chamado `issue54` e fez três commits naquele branch. Ela não baixou as alterações de John ainda, então o histórico de commits dela se parece com a Figura 5-7.


![](http://git-scm.com/figures/18333fig0507-tn.png)

Figura 5-7. Histórico inicial de commits de Jessica.

Jessica quer sincronizar com John, então ela faz fetch:

    # Máquina da Jessica
    $ git fetch origin
    ...
    From jessica@githost:simplegit
       fbff5bc..72bbc59  master     -> origin/master

Isso baixa o trabalho que John tinha empurrado (push). o histórico de Jessica agora se parece com a Figura 5-8.


![](http://git-scm.com/figures/18333fig0508-tn.png)

Figura 5-8. O histórico de Jessica depois de baixar as alterações de John.

Jessica pensa que seu "topic branch" está pronto, mas ela quer saber com o que ela precisa fazer merge para poder dar push de seu trabalho. Ela executa `git log` para descobrir:

    $ git log --no-merges origin/master ^issue54
    commit 738ee872852dfaa9d6634e0dea7a324040193016
    Author: John Smith <jsmith@example.com>
    Date:   Fri May 29 16:01:27 2009 -0700

        removed invalid default value

Agora, Jessica pode fazer merge de seu topic branch no branch `master`, fazer merge do trabalho de John (`origin/master`) em seu branch `master` e finalmente dar push para o servidor. Primeiro, ela troca para o seu branch `master` para integrar todo esse trabalho:

    $ git checkout master
    Switched to branch "master"
    Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

Ela pode fazer merge de `origin/master` ou `issue54` primeiro — ambos são upstream (atualizados), então a ordem não importa. O snapshot final deve ser idêntico, não importa a ordem que ela escolher; apenas o histórico será levemente diferente. Ela escolhe fazer merge de `issue54` primeiro:

    $ git merge issue54
    Updating fbff5bc..4af4298
    Fast forward
     README           |    1 +
     lib/simplegit.rb |    6 +++++-
     2 files changed, 6 insertions(+), 1 deletions(-)

Não acontece nenhum problema; como você pode ver, foi um simples fast-forward. Agora Jessica faz merge do trabalho de John (`origin/master`):

    $ git merge origin/master
    Auto-merging lib/simplegit.rb
    Merge made by recursive.
     lib/simplegit.rb |    2 +-
     1 files changed, 1 insertions(+), 1 deletions(-)

Tudo mesclou perfeitamente, e o histórico de Jessica agora se parece com a Figura 5-9.


![](http://git-scm.com/figures/18333fig0509-tn.png)

Figura 5-9. O histórico de Jessica depois de mesclar as alterações de John.

Agora `origin/master` é acessível através do branch `master` de Jessica, então ela pode perfeitamente dar push (assumindo que John não deu push com novas alterações nesse meio tempo):

    $ git push origin master
    ...
    To jessica@githost:simplegit.git
       72bbc59..8059c15  master -> master

Cada desenvolvedor fez alguns commits e integrou o trabalho do outro com sucesso; veja Figura 5-10.


![](http://git-scm.com/figures/18333fig0510-tn.png)

Figura 5-10. O histórico de Jessica depois de dar push para o servidor.

Esse é um dos fluxos de trabalho mais simples. Você trabalha um pouco, geralmente em um topic branch, e faz merge em seu branch `master` quando ele estiver pronto para ser integrado. Quando você quiser compartilhar seu trabalho, você faz merge em seu próprio branch `master`, baixa as últimas alterações do servidor com fetch e faz merge de `origin/master` se tiver sido alterado, e então dá push para o branch `master` no servidor. A ordem é semelhante ao mostrado na Figura 5-11.


![](http://git-scm.com/figures/18333fig0511-tn.png)

Figura 5-11. Sequencia geral dos eventos para um fluxo de trabalho simples para Git com múltiplos desenvolvedores.

## Equipe Privada Gerenciada

Nesse cenário, você verá os papéis de contribuinte em grupo privado maior. Você aprenderá como trabalhar em um ambiente onde pequenos grupos colaboram em funcionalidades e então essas contribuições por equipe são integradas por outro grupo.

Vamos dizer que John e Jessica estão trabalhando juntos em uma funcionalidade, enquanto Jessica e Josie estão trabalhando em outra. Nesse caso a empresa está usando um fluxo de trabalho com um gerente de integração onde o trabalho de cada grupo é integrado por apenas alguns engenheiros e o branch `master` do repositório principal pode ser atualizado apenas por esses engenheiros. Nesse cenário, todo o trabalho é feito em equipe e atualizado junto pelos integradores.

Vamos seguir o fluxo de trabalho de Jessica enquanto ela trabalha em suas duas funcionalidades, colaborando em paralelo com dois desenvolvedores diferentes nesse ambiente. Assumindo que ela já clonou seu repositório, ela decide trabalhar no `featureA` primeiro. Ela cria o novo branch para a funcionalidade e faz algum trabalho lá:

    # Máquina da Jessica
    $ git checkout -b featureA
    Switched to a new branch "featureA"
    $ vim lib/simplegit.rb
    $ git commit -am 'add limit to log function'
    [featureA 3300904] add limit to log function
     1 files changed, 1 insertions(+), 1 deletions(-)

Nesse ponto, ela precisa compartilhar seu trabalho com John, então ela dá push dos commits de seu branch `featureA` para o servidor. Jessica não tem acesso para dar push no branch `master` — apenas os integradores tem — então ela dá push das alterações para outro branch para poder colaborar com John:

    $ git push origin featureA
    ...
    To jessica@githost:simplegit.git
     * [new branch]      featureA -> featureA

Jessica avisa John por e-mail que ela deu push de algum trabalho em um branch chamado `featureA` e ele pode olhar ele agora. Enquanto ela espera pelo retorno de John, Jessica decide começar a trabalhar no `featureB` com Josie. Para começar, ela inicia um novo feature branch (branch de funcionalidade), baseando-se no branch `master` do servidor:

    # Máquina da Jessica
    $ git fetch origin
    $ git checkout -b featureB origin/master
    Switched to a new branch "featureB"

Agora, Jessica faz dois commits para o branch `featureB`:

    $ vim lib/simplegit.rb
    $ git commit -am 'made the ls-tree function recursive'
    [featureB e5b0fdc] made the ls-tree function recursive
     1 files changed, 1 insertions(+), 1 deletions(-)
    $ vim lib/simplegit.rb
    $ git commit -am 'add ls-files'
    [featureB 8512791] add ls-files
     1 files changed, 5 insertions(+), 0 deletions(-)

O repositório de Jessica se parece com a Figura 5-12.


![](http://git-scm.com/figures/18333fig0512-tn.png)

Figura 5-12. O histórico de commits inicial de Jessica.

Ela está pronta para fazer push de seu trabalho, mas recebe um e-mail de Josie avisando que ela já fez um trabalho inicial e que está no servidor no branch `featureBee`. Primeiro Jessica precisa mesclar essas alterações com suas próprias para que ela possa dar push de suas alterações para o servidor. Ela pode então baixar as alterações de Josie com `git fetch`:

    $ git fetch origin
    ...
    From jessica@githost:simplegit
     * [new branch]      featureBee -> origin/featureBee

Jessica pode agora fazer merge em seu trabalho com `git merge`:

    $ git merge origin/featureBee
    Auto-merging lib/simplegit.rb
    Merge made by recursive.
     lib/simplegit.rb |    4 ++++
     1 files changed, 4 insertions(+), 0 deletions(-)

Há um pequeno problema — ela precisa dar push do trabalho mesclado em seu branch `featureB` para o branch `featureBee` no servidor. Ela pode fazer isso especificando o branch local seguido de dois pontos (:) seguido pelo branch remoto para o comando `git push`:

    $ git push origin featureB:featureBee
    ...
    To jessica@githost:simplegit.git
       fba9af8..cd685d1  featureB -> featureBee

Isso é chamado _refspec_. Veja o *Capítulo 9* para uma discussão mais detalhada dos refspecs do Git e coisas diferentes que você pode fazer com eles.

Depois, John diz para Jessica que ele deu push de algumas alterações para o branch `featureA` e pede para ela verificá-las. Ela executa um `git fetch` para puxar essas alterações:

    $ git fetch origin
    ...
    From jessica@githost:simplegit
       3300904..aad881d  featureA   -> origin/featureA

Então, ela pode ver que essas alterações foram modificadas com `git log`:

    $ git log origin/featureA ^featureA
    commit aad881d154acdaeb2b6b18ea0e827ed8a6d671e6
    Author: John Smith <jsmith@example.com>
    Date:   Fri May 29 19:57:33 2009 -0700

        changed log output to 30 from 25

Finalmente, ela faz merge do trabalho de John em seu próprio branch `featureA`:

    $ git checkout featureA
    Switched to branch "featureA"
    $ git merge origin/featureA
    Updating 3300904..aad881d
    Fast forward
     lib/simplegit.rb |   10 +++++++++-
    1 files changed, 9 insertions(+), 1 deletions(-)

Jessica quer melhorar uma coisa, então ela faz um novo commit e dá push de volta para o servidor:

    $ git commit -am 'small tweak'
    [featureA ed774b3] small tweak
     1 files changed, 1 insertions(+), 1 deletions(-)
    $ git push origin featureA
    ...
    To jessica@githost:simplegit.git
       3300904..ed774b3  featureA -> featureA

O histórico de commit de Jessica agora parece com a Figura 5-13.


![](http://git-scm.com/figures/18333fig0513-tn.png)

Figura 5-13. O histórico de Jessica depois do commit no feature branch.

Jessica, Josie e John informam os integradores que os branches `featureA` e `featureBee` no servidor estão prontos para integração na linha principal. Depois que eles integrarem esses branches na linha principal, baixar (fetch) irá trazer os novos commits mesclados, fazendo o histórico de commit ficar como na Figura 5-14.


![](http://git-scm.com/figures/18333fig0514-tn.png)

Figura 5-14. O histórico de Jessica depois de mesclar ambos topic branches.

Muitos grupos mudam para Git por causa da habilidade de ter múltiplas equipes trabalhando em paralelo, mesclando diferentes linhas de trabalho mais tarde. A habilidade de partes menores de uma equipe colaborar via branches remotos sem necessariamente ter que envolver ou impedir a equipe inteira é um grande benefício do Git. A sequencia para o fluxo de trabalho que você viu aqui é como mostrado na Figura 5-15.


![](http://git-scm.com/figures/18333fig0515-tn.png)

Figure 5-15. Sequencia básica desse fluxo de trabalho de equipe gerenciada.

## Pequeno Projeto Público

Contribuindo para projetos públicos é um pouco diferente. Você tem que ter permissões para atualizar diretamente branches no projeto, você tem que passar o trabalho para os mantenedores de uma outra forma. O primeiro exemplo descreve como contribuir via forks em hosts Git que suportam criação simples de forks. Os sites de hospedagem repo.or.cz e Github ambos suportam isso, e muitos mantenedores de projetos esperam esse tipo de contribuição. A próxima seção lida com projetos que preferem aceitar patches contribuídos por e-mail.

Primeiro, você provavelmente irá querer clonar o repositório principal, criar um topic branch para o patch ou séries de patch que você planeja contribuir e você fará seu trabalho lá. A sequencia se parece com isso:

    $ git clone (url)
    $ cd project
    $ git checkout -b featureA
    $ (trabalho)
    $ git commit
    $ (trabalho)
    $ git commit

Você pode querer usar `rebase -i` para espremer seu trabalho em um único commit, ou reorganizar o trabalho nos commits para fazer o patch mais fácil de revisar para os mantenedores — veja o *Capítulo 6* para mais informações sobre rebase interativo.

Quando seu trabalho no branch for finalizado e você está pronto para contribuir para os mantenedores, vá até a página do projeto original e clique no botão "Fork", criando seu próprio fork gravável do projeto. Você então precisa adicionar a URL desse novo repositório como um segundo remoto (remote), nesse caso chamado `myfork`:

    $ git remote add myfork (url)

Você precisa dar push de seu trabalho para ele. É mais fácil dar push do branch remoto que você está trabalhando para seu repositório, ao invés de fazer merge em seu branch `master` e dar push dele. A razão é que se o trabalho não for aceito ou é selecionado em parte, você não tem que rebobinar seu branch `master`. Se os mantenedores mesclam, fazem rebase ou "cherry-pick" (escolhem pequenos pedaços) do seu trabalho, você terá que eventualmente puxar de novo de qualquer forma:

    $ git push myfork featureA

Quando seu trabalho tiver na sua fork, você precisa notificar o mantenedor. Isso é geralmente chamado pull request (requisição para ele puxar), e você pode gerar isso pelo website — GitHub tem um "pull request" que notifica automaticamente o mantenedor — ou executar `git request-pull` e enviar por e-mail a saída desse comando para o mantenedor do projeto manualmente.

O comando `request-pull` recebe como argumento um branch base no qual você quer que suas alterações sejam puxadas e a URL do repositório Git que você quer que eles puxem. Por exemplo, se Jessica quer enviar John um pull request e ela fez dois commits no topic branch que ela deu push, ela pode executar isso:

    $ git request-pull origin/master myfork
    The following changes since commit 1edee6b1d61823a2de3b09c160d7080b8d1b3a40:
      John Smith (1):
            added a new function

    are available in the git repository at:

      git://githost/simplegit.git featureA

    Jessica Smith (2):
          add limit to log function
          change log output to 30 from 25

     lib/simplegit.rb |   10 +++++++++-
     1 files changed, 9 insertions(+), 1 deletions(-)

O resultado pode ser enviado para o mantenedor - ele fala para eles de onde o trabalho foi baseado, resume os commits e mostra de onde puxar esse trabalho.

Em um projeto que você não é o mantenedor, é geralmente mais fácil ter um branch como `master` sempre sincronizar com `origin/master` e fazer seu trabalho em topic branches que você pode facilmente descartar se rejeitados. Tendo temas de trabalho isolados em topic branches também torna mais fácil fazer rebase de seu trabalho se o seu repositório principal tiver sido atualizado nesse meio tempo e seus commits não puderem ser aplicados de forma limpa. Por exemplo, se você quiser submeter um segundo tópico de trabalho para o projeto, não continue trabalhando no topic branch que você deu push por último — inicie de novo a partir do branch `master` do repositório principal:

    $ git checkout -b featureB origin/master
    $ (work)
    $ git commit
    $ git push myfork featureB
    $ (email maintainer)
    $ git fetch origin

Agora, cada um de seus tópicos é contido em um silo — similar a uma fila de patchs — que você pode reescrever, fazer rebase e modificar sem os tópicos interferirem ou interdepender um do outro como na Figura 5-16.


![](http://git-scm.com/figures/18333fig0516-tn.png)

Figura 5-16. Histórico de commits inicial com trabalho do featureB.

Vamos dizer que o mantenedor do projeto tenha puxado um punhado de outros patches e testou seu primeiro branch, mas ele não mescla mais. Nesse caso, você pode tentar fazer rebase daquele branch em cima de `origin/master`, resolver os conflitos para o mantenedor e então submeter novamente suas alterações:

    $ git checkout featureA
    $ git rebase origin/master
    $ git push -f myfork featureA

Isso sobrescreve seu histórico para parecer com a Figura 5-17.


![](http://git-scm.com/figures/18333fig0517-tn.png)

Figura 5-17. Histórico de commits depois do trabalho em featureA.

Já que você fez rebase de seu trabalho, você tem que especificar a opção `-f` para seu comando `push` poder substituir o branch `featureA` no servidor com um commit que não é descendente dele. Uma alternativa seria dar push desse novo trabalho para um branch diferente no servidor (talvez chamado `featureAv2`).

Vamos ver mais um cenário possível: o mantenedor olhou o trabalho em seu segundo branch e gostou do conceito, mas gostaria que você alterasse um detalhe de implementação. Você irá também tomar essa oportunidade para mover seu trabalhar para ser baseado no branch `master` atual do projeto. Você inicia um novo branch baseado no branch `origin/master` atual, coloca as mudanças de `featureB` lá, resolve qualquer conflito, faz a alteração na implementação e então dá push para o servidor como um novo branch:

    $ git checkout -b featureBv2 origin/master
    $ git merge --no-commit --squash featureB
    $ (change implementation)
    $ git commit
    $ git push myfork featureBv2

A opção `--squash` pega todo o trabalho feito no branch mesclado e espreme ele em um non-merge commit em cima do branch que você está. A opção `--no-commit` fala para o Git não registrar um commit automaticamente. Isso permite a você introduzir as alterações de outro branch e então fazer mais alterações antes de registrar um novo commit.

Agora você pode enviar ao mantenedor uma mensagem informando que você fez as alterações requisitadas e eles podem encontrar essas mudanças em seu branch `featureBv2` (veja Figura 5-18).


![](http://git-scm.com/figures/18333fig0518-tn.png)

Figura 5-18. Histórico de commit depois do trabalho em featureBv2.

## Grande Projeto Público

Muitos projetos maiores tem procedimentos estabelecidos para aceitar patches — você irá precisar verificar as regras específicas para cada projeto, porque eles irão diferir. Contudo, muitos projetos maiores aceitam patches via lista de discussão para desenvolvedores, então eu irei falar sobre esse exemplo agora.

O fluxo de trabalho é similar ao caso de uso anterior — você cria topic branches para cada série de patches que você trabalhar. A diferença é como você irá submeter eles para o projeto. Ao invés de fazer um fork do projeto e dar push das alterações para sua própria versão gravável, você gera versões em e-mail de cada série de commits e envia para a lista de discussão para desenvolvedores:

    $ git checkout -b topicA
    $ (work)
    $ git commit
    $ (work)
    $ git commit

Agora você tem dois commits que você quer enviar para a lista de discussão. Você usa `git format-patch` para gerar os arquivos em formato mbox que você pode enviar por e-mail para a lista — transforma cada commit em uma mensagem de e-mail com a primeira linha da mensagem do commit como o assunto e o resto da mensagem mais o patch que o commit introduz como corpo. A coisa legal sobre isso é que aplicando um patch de um e-mail gerado com `format-patch` preserva todas as informações do commit, como você irá ver mais nas próximas seções quando você aplica esses commits:

    $ git format-patch -M origin/master
    0001-add-limit-to-log-function.patch
    0002-changed-log-output-to-30-from-25.patch

O comando `format-patch` imprime o nome dos arquivos patch que ele cria. A opção `-M` fala para o Git verificar se há mudanças de nome. Os arquivos vão acabar parecendo assim:

    $ cat 0001-add-limit-to-log-function.patch
    From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
    From: Jessica Smith <jessica@example.com>
    Date: Sun, 6 Apr 2008 10:17:23 -0700
    Subject: [PATCH 1/2] add limit to log function

    Limit log functionality to the first 20

    ---
     lib/simplegit.rb |    2 +-
     1 files changed, 1 insertions(+), 1 deletions(-)

    diff --git a/lib/simplegit.rb b/lib/simplegit.rb
    index 76f47bc..f9815f1 100644
    --- a/lib/simplegit.rb
    +++ b/lib/simplegit.rb
    @@ -14,7 +14,7 @@ class SimpleGit
       end

       def log(treeish = 'master')
    -    command("git log #{treeish}")
    +    command("git log -n 20 #{treeish}")
       end

       def ls_tree(treeish = 'master')
    --
    1.6.2.rc1.20.g8c5b.dirty

Você pode também editar esses arquivos de patch para adicionar mais informação para a lista de e-mail que você não quer que apareça na mensagem do commit. Se você adicionar o texto entre a linha com `---` e o início do patch (a linha `lib/simplegit.rb`), então desenvolvedores podem lê-la; mas aplicar o patch a exclui.

Para enviar por e-mail a uma lista de discussão, você pode ou colar o arquivo em seu programa de e-mails ou enviar por um programa em linha de comando. Colando o texto geralmente causa problemas de formatação, especialmente com clientes "expertos" que não preservam linhas em branco e espaços em branco de forma apropriada. Por sorte, Git fornece uma ferramenta que lhe ajuda a enviar um patch via Gmail, que por acaso é o agente de e-mail que eu uso; você pode ler instruções detalhadas para vários programas de e-mail no final do arquivo previamente mencionado `Documentation/SubmittingPatched` no código fonte do Git.

Primeiramente, você precisa configurar a seção imap em seu arquivo `~/.gitconfig`. Você pode definir cada valor separadamente com uma série de comandos `git config` ou você pode adicioná-los manualmente; mas no final, seu arquivo de configuração deve parecer mais ou menos assim:

    [imap]
      folder = "[Gmail]/Drafts"
      host = imaps://imap.gmail.com
      user = user@gmail.com
      pass = p4ssw0rd
      port = 993
      sslverify = false

Se seu servidor IMAP não usa SSL, as últimas duas linhas provavelmente não serão necessárias e o valor do host será `imap://` ao invés de `imaps://`.
Quando isso estiver configurado, você pode usar `git send-email` para colocar a série de patches em sua pasta Drafts (Rascunhos) no seu servidor IMAP:

    $ git send-email *.patch
    0001-added-limit-to-log-function.patch
    0002-changed-log-output-to-30-from-25.patch
    Who should the emails appear to be from? [Jessica Smith <jessica@example.com>]
    Emails will be sent from: Jessica Smith <jessica@example.com>
    Who should the emails be sent to? jessica@example.com
    Message-ID to be used as In-Reply-To for the first email? y

Então, Git imprime um bocado de informação de log parecendo com isso para cada patch que você estiver enviando:

    (mbox) Adding cc: Jessica Smith <jessica@example.com> from
      \line 'From: Jessica Smith <jessica@example.com>'
    OK. Log says:
    Sendmail: /usr/sbin/sendmail -i jessica@example.com
    From: Jessica Smith <jessica@example.com>
    To: jessica@example.com
    Subject: [PATCH 1/2] added limit to log function
    Date: Sat, 30 May 2009 13:29:15 -0700
    Message-Id: <1243715356-61726-1-git-send-email-jessica@example.com>
    X-Mailer: git-send-email 1.6.2.rc1.20.g8c5b.dirty
    In-Reply-To: <y>
    References: <y>

    Result: OK

Nesse ponto, você deve poder ir a sua pasta de rascunhos, modificar o campo "Para" (To) para a lista de discussões que você está enviando o patch, possivelmente o campo CC para o mantenedor ou pessoa responsável por aquela seção, e enviar.

## Resumo

Essa seção cobriu uma grande quantidade de fluxos de trabalho comuns para lidar com vários tipos bem diferentes de projetos Git que você provavelmente encontrará e introduziu algumas novas ferramentas para lhe ajudar a gerenciar esse processo. Nas seções seguintes, você irá ver como trabalhar no outro lado da moeda: mantendo um projeto Git. Você irá aprender como ser um ditador benevolente ou gerente de integração.
