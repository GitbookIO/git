# Git e Subversion

Atualmente, a maioria dos projetos de desenvolvimento de código aberto e um grande número de projetos corporativos usam o Subversion para gerenciar seu código fonte. É o VCS open source mais popular e tem sido assim por quase uma década. É também muito similar em muitos aspectos ao CVS, que foi muito utilizado antes disso.

Uma das grandes características do Git é uma ponte bidirecional para Subversion chamada `git svn`. Esta ferramenta permite que você use Git como um cliente válido para um servidor Subversion, então você pode usar todos os recursos locais do Git e fazer um push para um servidor Subversion, como se estivesse usando o Subversion localmente. Isto significa que você pode fazer ramificação (branching) local e fusão (merge), usar a área de teste (staging area), cherry-picking, e assim por diante, enquanto os seus colaboradores continuam a trabalhar em seus caminhos escuros e antigos. É uma boa maneira de utilizar o Git em ambiente corporativo e ajudar os seus colegas desenvolvedores a se tornarem mais eficientes enquanto você luta para obter a infra-estrutura para suportar Git completamente.

## git svn

O comando base no Git para todos os comandos de ponte do Subversion é `git svn`. Você inicia tudo com isso. São precisos alguns comandos, para que você aprenda sobre os mais comuns, indo através de um fluxo de trabalho pequeno.

É importante notar que quando você está usando `git svn`, você está interagindo com o Subversion, que é um sistema muito menos sofisticado do que Git. Embora você possa facilmente fazer ramificação local e fusão, é geralmente melhor manter seu histórico tão linear quanto possível usando rebasing no seu trabalho e evitar fazer coisas como, simultaneamente, interagir com um repositório Git remoto.

Não reescreva seu histórico e tente fazer um push de novo, e não faça um push para um repositório Git paralelo para colaborar com desenvolvedores Git ao mesmo tempo. Subversion pode ter apenas um histórico linear simples, e confundi-lo é muito fácil. Se você está trabalhando com uma equipe, e alguns estão usando SVN e outros estão usando Git, certifique-se que todo mundo está usando o servidor SVN para colaborar — isso vai facilitar a sua vida.

## Configurando

Para demonstrar essa funcionalidade, você precisa de um repositório SVN típico que você tenha acesso de gravação. Se você deseja copiar esses exemplos, você vai ter que fazer uma cópia gravável do meu repositório de teste. A fim de fazer isso facilmente, você pode usar uma ferramenta chamada `svnsync` que vem com as versões mais recentes do Subversion — ele deve ser distribuído a partir da versão 1.4. Para estes testes, eu criei um novo repositório Subversion no Google code que era uma cópia parcial do projeto `protobuf`, que é uma ferramenta que codifica dados estruturados para transmissão de rede.

Para acompanhar, primeiro você precisa criar um novo repositório Subversion local:

    $ mkdir /tmp/test-svn
    $ svnadmin create /tmp/test-svn

Então, permitir que todos os usuários possam alterar revprops — o caminho mais fácil é adicionar um script pre-revprop-change que sempre retorna 0:

    $ cat /tmp/test-svn/hooks/pre-revprop-change
    #!/bin/sh
    exit 0;
    $ chmod +x /tmp/test-svn/hooks/pre-revprop-change

Agora você pode sincronizar este projeto na sua máquina local chamando `svnsync init` com os repositórios to e from.

    $ svnsync init file:///tmp/test-svn http://progit-example.googlecode.com/svn/

Isso define as propriedades para executar a sincronização. Você pode, então, clonar o código executando

    $ svnsync sync file:///tmp/test-svn
    Committed revision 1.
    Copied properties for revision 1.
    Committed revision 2.
    Copied properties for revision 2.
    Committed revision 3.
    ...

Embora essa operação possa demorar apenas alguns minutos, se você tentar copiar o repositório original para outro repositório remoto em vez de um local, o processo vai demorar quase uma hora, mesmo que haja menos de 100 commits. Subversion tem que clonar uma revisão em um momento e em seguida, fazer um push de volta para outro repositório — é ridiculamente ineficientes, mas é a única maneira fácil de fazer isso.

## Primeiros Passos

Agora que você tem um repositório Subversion que você tem acesso de gravação, você pode usar um fluxo de trabalho típico. Você vai começar com o comando `git svn clone`, que importa um repositório Subversion inteiro em um repositório Git local. Lembre-se de que se você está importando de um repositório Subversion hospedado, você deve substituir o `file:///tmp/test-svn` aqui com a URL do seu repositório Subversion:

    $ git svn clone file:///tmp/test-svn -T trunk -b branches -t tags
    Initialized empty Git repository in /Users/schacon/projects/testsvnsync/svn/.git/
    r1 = b4e387bc68740b5af56c2a5faf4003ae42bd135c (trunk)
          A    m4/acx_pthread.m4
          A    m4/stl_hash.m4
    ...
    r75 = d1957f3b307922124eec6314e15bcda59e3d9610 (trunk)
    Found possible branch point: file:///tmp/test-svn/trunk => \
        file:///tmp/test-svn /branches/my-calc-branch, 75
    Found branch parent: (my-calc-branch) d1957f3b307922124eec6314e15bcda59e3d9610
    Following parent with do_switch
    Successfully followed parent
    r76 = 8624824ecc0badd73f40ea2f01fce51894189b01 (my-calc-branch)
    Checked out HEAD:
     file:///tmp/test-svn/branches/my-calc-branch r76

Isso executa o equivalente a dois comandos — `git svn init` seguido por `git svn fetch` — na URL que você fornecer. Isso pode demorar um pouco. O projeto de teste tem apenas cerca de 75 commits e a base de código não é tão grande, por isso leva apenas alguns minutos. No entanto, Git tem de verificar cada versão, uma de cada vez, e commitá-las individualmente. Para um projeto com centenas ou milhares de commits, isso pode literalmente levar horas ou até dias para terminar.

A parte `-T trunk -b branches -t tags` diz ao Git que este repositório Subversion segue a ramificação (branching) básica e convenções de tag. Se você nomeou seu trunk, branches, ou tags de maneira diferente, você pode alterar estas opções. Já que isso é muito comum, você pode substituir esta parte inteira com `-s`, o que significa layout padrão e implica todas essas opções. O comando a seguir é equivalente:

    $ git svn clone file:///tmp/test-svn -s

Neste ponto, você deve ter um repositório Git válido que importou seus branches e tags:

    $ git branch -a
    * master
      my-calc-branch
      tags/2.0.2
      tags/release-2.0.1
      tags/release-2.0.2
      tags/release-2.0.2rc1
      trunk

É importante observar como esta ferramenta nomeia (namespaces) suas referências remotas de forma diferente. Quando você está clonando de um repositório Git normal, você recebe todos os branches que estão disponíveis no servidor remoto localmente, algo como `origin/[branch]` — nomeados com o nome do remoto. No entanto, `git svn` assume que você não vai ter vários remotos e salva todas as suas referências em pontos no servidor remoto sem "namespacing". Você pode usar o comando Git plumbing `show-ref` para ver os seus nomes de referência completa:

    $ git show-ref
    1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/heads/master
    aee1ecc26318164f355a883f5d99cff0c852d3c4 refs/remotes/my-calc-branch
    03d09b0e2aad427e34a6d50ff147128e76c0e0f5 refs/remotes/tags/2.0.2
    50d02cc0adc9da4319eeba0900430ba219b9c376 refs/remotes/tags/release-2.0.1
    4caaa711a50c77879a91b8b90380060f672745cb refs/remotes/tags/release-2.0.2
    1c4cb508144c513ff1214c3488abe66dcb92916f refs/remotes/tags/release-2.0.2rc1
    1cbd4904d9982f386d87f88fce1c24ad7c0f0471 refs/remotes/trunk

Um repositório Git normal se parece com isto:

    $ git show-ref
    83e38c7a0af325a9722f2fdc56b10188806d83a1 refs/heads/master
    3e15e38c198baac84223acfc6224bb8b99ff2281 refs/remotes/gitserver/master
    0a30dd3b0c795b80212ae723640d4e5d48cabdff refs/remotes/origin/master
    25812380387fdd55f916652be4881c6f11600d6f refs/remotes/origin/testing

Você tem dois servidores remotos: um chamado `gitserver` com um branch `master`, e outro chamado `origin` com dois branches, `master` e `testing`.

Observe como no exemplo de referências remotas importados com `git svn`, tags são adicionadas como branches remotos, não como tags Git reais. Sua importação do Subversion parece que tem um remoto chamado tags branches nele.

## Commitando de Volta no Subversion

Agora que você tem um repositório de trabalho, você pode fazer algum trabalho no projeto e fazer um push de seus commits de volta ao upstream, usando Git efetivamente como um cliente SVN. Se você editar um dos arquivos e fazer o commit, você tem um commit que existe no Git local que não existe no servidor Subversion:

    $ git commit -am 'Adding git-svn instructions to the README'
    [master 97031e5] Adding git-svn instructions to the README
     1 files changed, 1 insertions(+), 1 deletions(-)

Em seguida, você precisa fazer o push de suas mudanças ao upstream. Observe como isso muda a maneira de trabalhar com o Subversion — Você pode fazer vários commits offline e depois fazer um push com todos de uma vez para o servidor Subversion. Para fazer um push a um servidor Subversion, você executa o comando `git svn dcommit`:

    $ git svn dcommit
    Committing to file:///tmp/test-svn/trunk ...
           M      README.txt
    Committed r79
           M      README.txt
    r79 = 938b1a547c2cc92033b74d32030e86468294a5c8 (trunk)
    No changes between current HEAD and refs/remotes/trunk
    Resetting to the latest refs/remotes/trunk

Isso leva todos os commits que você fez em cima do código do servidor Subversion, faz um commit Subversion para cada um, e então reescreve seu commit Git local para incluir um identificador único. Isto é importante porque significa que todas as somas de verificação (checksums) SHA-1 dos seus commits mudam. Em parte por esta razão, trabalhar com Git em versões remotas de seus projetos ao mesmo tempo com um servidor Subversion não é uma boa ideia. Se você olhar para o último commit, você pode ver o novo `git-svn-id` que foi adicionado:

    $ git log -1
    commit 938b1a547c2cc92033b74d32030e86468294a5c8
    Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
    Date:   Sat May 2 22:06:44 2009 +0000

        Adding git-svn instructions to the README

        git-svn-id: file:///tmp/test-svn/trunk@79 4c93b258-373f-11de-be05-5f7a86268029

Observe que a soma de verificação SHA que inicialmente começou com `97031e5` quando você commitou agora começa com `938b1a5`. Se você quer fazer um push para tanto um servidor Git como um servidor Subversion, você tem que fazer um push (`dcommit`) para o servidor Subversion primeiro, porque essa ação altera os dados de commit.

## Fazendo Pull de Novas Mudanças

Se você está trabalhando com outros desenvolvedores, então em algum ponto um de vocês vai fazer um push, e depois o outro vai tentar fazer um push de uma mudança que conflita. Essa mudança será rejeitada até você mesclá-la em seu trabalho. No `git svn`, é parecido com isto:

    $ git svn dcommit
    Committing to file:///tmp/test-svn/trunk ...
    Merge conflict during commit: Your file or directory 'README.txt' is probably \
    out-of-date: resource out of date; try updating at /Users/schacon/libexec/git-\
    core/git-svn line 482

Para resolver essa situação, você pode executar `git svn rebase`, que puxa quaisquer alterações no servidor que você não tem ainda e faz um rebase de qualquer trabalho que você tem em cima do que está no servidor:

    $ git svn rebase
           M      README.txt
    r80 = ff829ab914e8775c7c025d741beb3d523ee30bc4 (trunk)
    First, rewinding head to replay your work on top of it...
    Applying: first user change

Agora, todo o seu trabalho está em cima do que está no servidor Subversion, para que você possa com sucesso usar `dcommit`:

    $ git svn dcommit
    Committing to file:///tmp/test-svn/trunk ...
           M      README.txt
    Committed r81
           M      README.txt
    r81 = 456cbe6337abe49154db70106d1836bc1332deed (trunk)
    No changes between current HEAD and refs/remotes/trunk
    Resetting to the latest refs/remotes/trunk

É importante lembrar que, ao contrário do Git, que exige que você mescle trabalhos do upstream que você ainda não tem localmente antes que você possa fazer um push, `git svn` faz você fazer isso somente se as alterações conflitarem. Se alguém fizer um push de uma alteração em um arquivo e então você fizer um push de uma mudança de outro arquivo, o seu `dcommit` vai funcionar:

    $ git svn dcommit
    Committing to file:///tmp/test-svn/trunk ...
           M      configure.ac
    Committed r84
           M      autogen.sh
    r83 = 8aa54a74d452f82eee10076ab2584c1fc424853b (trunk)
           M      configure.ac
    r84 = cdbac939211ccb18aa744e581e46563af5d962d0 (trunk)
    W: d2f23b80f67aaaa1f6f5aaef48fce3263ac71a92 and refs/remotes/trunk differ, \
      using rebase:
    :100755 100755 efa5a59965fbbb5b2b0a12890f1b351bb5493c18 \
      015e4c98c482f0fa71e4d5434338014530b37fa6 M   autogen.sh
    First, rewinding head to replay your work on top of it...
    Nothing to do.

É importante lembrar disto, porque o resultado é um estado de projeto que não existia em nenhum dos seus computadores quando você fez o push. Se as alterações forem incompatíveis, mas não entram em conflito, você pode ter problemas que são difíceis de diagnosticar. Isso é diferente de usar um servidor Git — no Git, você pode testar completamente o estado do sistema cliente antes de publicá-lo, enquanto que no SVN, você não pode nunca estar certo de que os estados imediatamente antes e depois do commit são idênticos.

Você também deve executar este comando para fazer o pull das alterações do servidor Subversion, mesmo que você não esteja pronto para commitar. Você pode executar `git svn fetch` para pegar os novos dados, mas `git svn rebase` faz a busca e atualiza seus commits locais.

    $ git svn rebase
           M      generate_descriptor_proto.sh
    r82 = bd16df9173e424c6f52c337ab6efa7f7643282f1 (trunk)
    First, rewinding head to replay your work on top of it...
    Fast-forwarded master to refs/remotes/trunk.

Executando `git svn rebase` de vez em quando irá manter seu código sempre atualizado. Você precisa ter certeza de que seu diretório de trabalho está limpo quando você executar isso. Se você tiver alterações locais, você deve guardar o seu trabalho (stash) ou temporariamente fazer o commit dele antes de executar `git svn rebase` — caso contrário, o comando irá parar se ver que o rebase irá resultar em um conflito de mesclagem.

## Problemas de Branching no Git

Quando você se sentir confortável com um fluxo de trabalho Git, é provável que você crie branches tópicos, trabalhe neles, e em seguida, faça um merge deles. Se você está fazendo um push para um servidor Subversion via git svn, você pode querer fazer o rebase de seu trabalho em um único branch de cada vez, em vez de fundir (merge) branches juntos. A razão para preferir rebasing é que o Subversion tem um histórico linear e não lida com fusões (merges), como Git faz, assim git svn segue apenas o primeiro pai ao converter os snapshots em commits Subversion.

Suponha que seu histórico se parece com o seguinte: você criou um branch `experiment`, fez dois commits, e depois fundiu-os de volta em `master`. Quando você executar `dcommit`, você verá uma saída como esta:

    $ git svn dcommit
    Committing to file:///tmp/test-svn/trunk ...
           M      CHANGES.txt
    Committed r85
           M      CHANGES.txt
    r85 = 4bfebeec434d156c36f2bcd18f4e3d97dc3269a2 (trunk)
    No changes between current HEAD and refs/remotes/trunk
    Resetting to the latest refs/remotes/trunk
    COPYING.txt: locally modified
    INSTALL.txt: locally modified
           M      COPYING.txt
           M      INSTALL.txt
    Committed r86
           M      INSTALL.txt
           M      COPYING.txt
    r86 = 2647f6b86ccfcaad4ec58c520e369ec81f7c283c (trunk)
    No changes between current HEAD and refs/remotes/trunk
    Resetting to the latest refs/remotes/trunk

Executando `dcommit` em um branch com histórico mesclado funcionará bem, exceto que quando você olhar no seu histórico de projeto Git, ele não reescreveu nenhum dos commits que você fez no branch `experiment` — em vez disso, todas essas alterações aparecem na versão SVN do único commit do merge.

Quando alguém clona esse trabalho, tudo o que vêem é o commit do merge com todo o trabalho comprimido nele; eles não veem os dados de commit sobre de onde veio ou quando ele foi commitado.

## Branching no Subversion

Ramificação no Subversion não é o mesmo que ramificação no Git; se você puder evitar usá-lo muito, é provavelmente melhor. No entanto, você pode criar e commitar em branches no Subversion usando svn git.

### Criando um Novo Branch SVN

Para criar um novo branch no Subversion, você executa `git svn branch [branchname]`:

    $ git svn branch opera
    Copying file:///tmp/test-svn/trunk at r87 to file:///tmp/test-svn/branches/opera...
    Found possible branch point: file:///tmp/test-svn/trunk => \
      file:///tmp/test-svn/branches/opera, 87
    Found branch parent: (opera) 1f6bfe471083cbca06ac8d4176f7ad4de0d62e5f
    Following parent with do_switch
    Successfully followed parent
    r89 = 9b6fe0b90c5c9adf9165f700897518dbc54a7cbf (opera)

Isso faz o equivalente ao comando `svn copy trunk branches/opera` no Subversion e funciona no servidor Subversion. É importante notar que ele não faz um checkout nesse branch; se você commitar neste momento, este commit irá para `trunk` no servidor, em vez de `opera`.

## Mudar Branches Ativos

Git descobre para que branch seus dcommits irão olhando para a extremidade de qualquer branch Subversion no seu histórico — você deve ter apenas um, e ele deve ser o último com um `git-svn-id` em seu histórico atual de branch.

Se você quiser trabalhar em mais de um branch ao mesmo tempo, você pode criar branches locais para `dcommit` para branches Subversion específicos iniciando-os no commit Subversion importado para esse branch. Se você quiser um branch `opera` em que você possa trabalhar em separado, você pode executar

    $ git branch opera remotes/opera

Agora, se você deseja mesclar seu branch `opera` em `trunk` (seu branch `master`), você pode fazer isso com `git merge`. Mas você precisa fornecer uma mensagem descritiva do commit (via `-m`), ou o merge vai dizer "Merge branch opera" em vez de algo útil.

Lembre-se que, apesar de você estar usando `git merge` para fazer esta operação, e provavelmente o merge será muito mais fácil do que seria no Subversion (porque Git irá detectar automaticamente a base de mesclagem apropriada para você), este não é um commit git merge normal. Você tem que fazer o push desses dados para um servidor Subversion que não pode lidar com um commit que rastreia mais de um pai; por isso, depois de fazer o push dele, ele vai parecer como um único commit que contém todo o trabalho de outro branch em um único commit. Depois que você mesclar um branch em outro, você não pode facilmente voltar e continuar a trabalhar nesse branch, como você normalmente faz no Git. O comando `dcommit` que você executa apaga qualquer informação que diz qual branch foi incorporado, então cálculos merge-base posteriores estarão errados — o dcommit faz os resultados do seu `git merge` parecerem que você executou `git merge --squash`. Infelizmente, não há nenhuma boa maneira de evitar esta situação — Subversion não pode armazenar essa informação, assim, você vai ser sempre prejudicado por essas limitações enquanto você estiver usando-o como seu servidor. Para evitar problemas, você deve excluir o branch local (neste caso, `opera`), depois de mesclá-lo em trunk.

## Comandos do Subversion

O conjunto de ferramentas `git svn` fornece um número de comandos para ajudar a facilitar a transição para o Git, fornecendo uma funcionalidade que é semelhante ao que você tinha no Subversion. Aqui estão alguns comandos parecidos com o Subversion.

### Estilo de Histórico do SVN

Se você está acostumado a usar o Subversion e quer ver seu histórico no estilo do SVN, você pode executar `git svn log` para ver o seu histórico de commits na formatação SVN:

    $ git svn log
    ------------------------------------------------------------------------
    r87 | schacon | 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009) | 2 lines

    autogen change

    ------------------------------------------------------------------------
    r86 | schacon | 2009-05-02 16:00:21 -0700 (Sat, 02 May 2009) | 2 lines

    Merge branch 'experiment'

    ------------------------------------------------------------------------
    r85 | schacon | 2009-05-02 16:00:09 -0700 (Sat, 02 May 2009) | 2 lines
    
    updated the changelog

Você deve saber duas coisas importantes sobre `git svn log`. Primeiro, ele funciona offline, ao contrário do comando `svn log` verdadeiro, que pede os dados ao servidor Subversion. Segundo, ele só mostra commits que foram commitados ao servidor Subversion. Commits Git locais que você não tenha dcommited não aparecem; nem commits que as pessoas fizeram no servidor Subversion neste meio tempo. É mais como o último estado conhecido dos commits no servidor Subversion.

### SVN Annotation

Assim como o comando `git svn log` simula o comando `svn log` off-line, você pode obter o equivalente a `svn annotate` executando `git svn blame [FILE]`. A saída se parece com isto:

    $ git svn blame README.txt
     2   temporal Protocol Buffers - Google's data interchange format
     2   temporal Copyright 2008 Google Inc.
     2   temporal http://code.google.com/apis/protocolbuffers/
     2   temporal
    22   temporal C++ Installation - Unix
    22   temporal =======================
     2   temporal
    79    schacon Committing in git-svn.
    78    schacon
     2   temporal To build and install the C++ Protocol Buffer runtime and the Protocol
     2   temporal Buffer compiler (protoc) execute the following:
     2   temporal

Novamente, ele não mostra commits que você fez localmente no Git ou que foram adicionados no Subversion neste meio tempo.

### Informações do Servidor SVN

Você também pode obter o mesmo tipo de informação que `svn info` lhe dá executando `git svn info`:

    $ git svn info
    Path: .
    URL: https://schacon-test.googlecode.com/svn/trunk
    Repository Root: https://schacon-test.googlecode.com/svn
    Repository UUID: 4c93b258-373f-11de-be05-5f7a86268029
    Revision: 87
    Node Kind: directory
    Schedule: normal
    Last Changed Author: schacon
    Last Changed Rev: 87
    Last Changed Date: 2009-05-02 16:07:37 -0700 (Sat, 02 May 2009)

Ele é paracido com `blame`e `log` eles são executados offline e é atualizado só a partir da última vez que você se comunicou com o servidor Subversion.

### Ignorando o Que o Subversion Ignora

Se você clonar um repositório Subversion que tem propriedades `svn:ignore` definidas em qualquer lugar, é provável que você deseje definir arquivos `.gitignore` correspondentes para que você não possa fazer o commit de arquivos acidentalmente. `git svn` tem dois comandos para ajudar com este problema. O primeiro é `git svn create-ignore`, que cria automaticamente arquivos `.gitignore` correspondentes para você, assim seu próximo commit pode incluí-los.

O segundo comando é `git svn show-ignore`, que imprime em stdout as linhas que você precisa para colocar em um arquivo `.gitignore` para que você possa redirecionar a saída do arquivo de exclusão de seu projeto:

    $ git svn show-ignore > .git/info/exclude

Dessa forma, você não suja o projeto com arquivos `.gitignore`. Esta é uma boa opção se você é o único usuário Git em uma equipe Subversion, e seus companheiros de equipe não querem arquivos `.gitignore` no projeto.

## Resumo do Git-Svn

As ferramentas do `git svn` são úteis se você está preso com um servidor Subversion por agora ou está em um ambiente de desenvolvimento que necessita executar um servidor Subversion. No entanto, você deve considerá-lo um Git "aleijado", ou você vai encontrar problemas na tradução que pode confundir você e seus colaboradores. Para ficar fora de problemas, tente seguir estas orientações:

* Mantenha um histórico Git linear que não contém merge de commits realizados por `git merge`. Rebase qualquer trabalho que você fizer fora de seu branch principal (mainline) de volta para ele; não faça merge dele
* Não colabore em um servidor Git separado. Eventualmente, tenha um para acelerar clones para novos desenvolvedores, mas não faça push de nada para ele que não tenha uma entrada `git-svn-id`. Você pode até querer adicionar um hook `pre-receive` que verifica cada mensagem de confirmação para encontrar um `git-svn-id` e rejeitar pushes que contenham commits sem ele.

Se você seguir essas orientações, trabalhar com um servidor Subversion pode ser mais fácil. No entanto, se for possível migrar para um servidor Git real, isso pode melhorar muito o ciclo de trabalho de sua equipe.
