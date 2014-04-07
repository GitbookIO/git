# Mantendo Um Projeto

Além de saber como contribuir efetivamente para um projeto, você pode precisar saber como manter um. Isso pode consistir em aceitar e aplicar patches gerados via `format-patch` e enviados por e-mail para você, ou integrar alterações em branches remotos para repositórios que você adicionou como remotes do seu projeto. Se você mantém um repositório canônico ou quer ajudar verificando ou aprovando patches, você precisa saber como aceitar trabalho de uma forma que é a mais clara para os outros contribuintes e aceitável para você a longo prazo.

## Trabalhando em Topic Branches

Quando você estiver pensando em integrar um novo trabalho, é geralmente uma boa ideia testá-lo em um topic branch — um branch temporário criado especificamente para testar o novo trabalho. Dessa forma, é fácil modificar um patch individualmente e deixá-lo se não tiver funcionando até que você tenha tempo de voltar para ele. Se você criar um nome de branch simples baseado no tema do trabalho que você irá testar, como `ruby_client` ou algo similarmente descritivo, você pode facilmente lembrar se você tem que abandoná-la por um tempo e voltar depois. O mantenedor do projeto Git tende a usar namespace nos branches — como `sc/ruby_client`, onde `sc` é uma forma reduzida para o nome da pessoa que contribui com o trabalho. Você deve lembrar que você pode criar um branch baseado no branch `master` assim:

    $ git branch sc/ruby_client master

Ou, se você quer também mudar para o branch imediatamente, você pode usar a opção `checkout -b`:

    $ git checkout -b sc/ruby_client master

Agora você está pronto para adicionar seu trabalho nesse topic branch e determinar se você quer mesclá-lo em seus branches de longa duração.

## Aplicando Patches por E-mail

Se você receber um patch por e-mail que você precisa integrar em seu projeto, você precisa aplicar o patch em seu topic branch para avaliá-lo. Há duas formas de aplicar um patch enviado por e-mail: com `git apply` ou com `git am`.

### Aplicando Um Patch Com apply

Se você recebeu o patch de alguém que o gerou com `git diff` ou o comando `diff` do Unix, você pode aplicá-lo com o comando `git apply`. Assumindo que você salvou o patch em `/tmp/patch-ruby-client.patch`, você pode aplicar o patch assim:

    $ git apply /tmp/patch-ruby-client.patch

Isso modifica os arquivos em seu diretório de trabalho. É quase igual a executar o comando `patch -p1` para aplicar o patch, mas ele aceita menos correspondências nebulosas do que patch. Ele também cuida de adições, remoções e mudanças de nome de arquivos se tiverem sido descritos no formato do `git diff`, o que `patch` não faz. Finalmente, `git apply` segue um modelo "aplica tudo ou aborta tudo", enquanto `patch` pode aplicar arquivos patch parcialmente, deixando seu diretório de trabalho em um estado estranho. `git apply` é no geral muito mais cauteloso que `patch`. Ele não cria um commit para você — depois de executá-lo, você deve adicionar e fazer commit das mudanças introduzidas manualmente.

Você pode também usar `git apply` para ver se um patch aplica corretamente antes de tentar aplicar ele de verdade — você pode executar `git apply --check` com o patch:

    $ git apply --check 0001-seeing-if-this-helps-the-gem.patch
    error: patch failed: ticgit.gemspec:1
    error: ticgit.gemspec: patch does not apply

Se não tiver nenhuma saída, então o patch deverá ser aplicado corretamente. O comando também sai com um status diferente de zero se a verificação falhar, então você pode usá-lo em scripts se você quiser.

### Aplicando um Patch com am

Se o contribuinte é um usuário Git e foi bondoso o suficiente para usar o comando `format-patch` para gerar seu patch, então seu trabalho é mais fácil porque o patch contém informação do autor e uma mensagem de commit para você. Se você puder, encoraje seus contribuintes a usar `format-patch` ao invés de `diff` para gerar patches para você. Você só deve ter que usar `git apply` para patches legados e coisas desse tipo.

Para aplicar o patch gerado por `format-patch`, você usa `git am`. Tecnicamente, `git am` foi feito para ler um arquivo mbox, que é um formato simples de texto puro para armazenar uma ou mais mensagens de e-mail em um único arquivo. Ele se parece com isso:

    From 330090432754092d704da8e76ca5c05c198e71a8 Mon Sep 17 00:00:00 2001
    From: Jessica Smith <jessica@example.com>
    Date: Sun, 6 Apr 2008 10:17:23 -0700
    Subject: [PATCH 1/2] add limit to log function

    Limit log functionality to the first 20

Isso é o início da saída do comando `format-patch` que você viu na seção anterior. Isso é também um formato de e-mail mbox válido. Se alguém lhe enviou um patch por e-mail corretamente usando `git send-email` e você baixou no formato mbox, então você pode apontar aquele arquivo para o `git am` e ele irá começar a aplicar todos os patches que ele ver. Se você executar um cliente de e-mail que pode salvar vários e-mails em um formato mbox, você pode salvar uma série inteira de patches em um arquivo e então usar o `git am` para aplicar todos de uma vez.

Entretanto, se alguém fez upload de um arquivo patch gerado via `format-patch` para um sistema de chamados ou algo similar, você pode salvar o arquivo localmente e então passar o arquivo salvo no seu disco para `git am` aplicar:

    $ git am 0001-limit-log-function.patch
    Applying: add limit to log function

Você pode ver que ele foi aplicado corretamente e automaticamente criou um novo commit para você. O autor é retirado dos cabeçalhos `From`(`De`) e `Date`(`Data`) do e-mail e a mensagem do commit é retirada dos campos `Subject` (`Assunto`) e `Corpo` (`body`) (antes do path) do e-mail. Por exemplo, se esse patch foi aplicado do exemplo de mbox que eu acabei de mostrar, o commit gerado irá parecer com isso:

    $ git log --pretty=fuller -1
    commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
    Author:     Jessica Smith <jessica@example.com>
    AuthorDate: Sun Apr 6 10:17:23 2008 -0700
    Commit:     Scott Chacon <schacon@gmail.com>
    CommitDate: Thu Apr 9 09:19:06 2009 -0700

       add limit to log function

       Limit log functionality to the first 20

A informação `Commit` indica a pessoa que aplicou o patch e a hora que foi aplicado. A informação `Author`(autor) é o indivíduo que originalmente criou o patch e quanto ela foi originalmente criada.

Mas é possível que o patch não aplique corretamente. Talvez seu branch principal tenha divergido muito do branch a partir do qual o patch foi feito, ou o patch depende de outro patch que você ainda não aplicou. Nesse caso, o `git am` irá falhar e perguntar o que você quer fazer:

    $ git am 0001-seeing-if-this-helps-the-gem.patch
    Applying: seeing if this helps the gem
    error: patch failed: ticgit.gemspec:1
    error: ticgit.gemspec: patch does not apply
    Patch failed at 0001.
    When you have resolved this problem run "git am --resolved".
    If you would prefer to skip this patch, instead run "git am --skip".
    To restore the original branch and stop patching run "git am --abort".

Esse comando coloca marcadores de conflito em qualquer arquivo que tenha problemas, muito parecido com um conflito das operações de merge ou rebase. Você resolve esse problema, da mesma forma — edita o arquivo e resolve o conflito, adiciona para a "staging area" e então executa `git am --resolved` para continuar com o próximo patch:

    $ (fix the file)
    $ git add ticgit.gemspec
    $ git am --resolved
    Applying: seeing if this helps the gem

Se você quer que o Git tente ser um pouco mais inteligente para resolver o conflito, você pode passar a opção `-3` para ele, que faz o Git tentar um three-way merge. Essa opção não é padrão porque ela não funciona se o commit que o patch diz que foi baseado não estiver em seu repositório. Se você tiver o commit — se o patch foi baseado em commit público — então a opção `-3` é geralmente muito melhor para aplicar um patch conflituoso:

    $ git am -3 0001-seeing-if-this-helps-the-gem.patch
    Applying: seeing if this helps the gem
    error: patch failed: ticgit.gemspec:1
    error: ticgit.gemspec: patch does not apply
    Using index info to reconstruct a base tree...
    Falling back to patching base and 3-way merge...
    No changes -- Patch already applied.

Nesse caso, eu estava tentando aplicar um patch que eu já tinha aplicado. Sem a opção `-3`, ela parece como um conflito.

Se você estiver aplicando vários patches de uma mbox, você pode também executar o comando `am` com modo interativo, que para a cada patch que ele encontra ele pergunta se você quer aplicá-lo:

    $ git am -3 -i mbox
    Commit Body is:
    --------------------------
    seeing if this helps the gem
    --------------------------
    Apply? [y]es/[n]o/[e]dit/[v]iew patch/[a]ccept all

Isso é legal se você tem vário patches salvos, porque você pode ver o patch primeiro se você não lembra o que ele é, ou não aplicar o patch se você já tinha feito isso antes.

Quando todos os patches para seu tópico são aplicados e feitos commits em seu branch, você pode escolher se e como integrá-los em um branch de longa duração.

## Fazendo Checkout Em Branches Remotos

Se sua contribuição veio de um usuário Git que configurou seu próprio repositório, deu push de várias alterações nele e então enviou uma URL para o repositório e o nome do branch remoto que as alterações estão, você pode adicioná-las como um remote e fazer merges localmente.

Por exemplo, se Jessica envia um e-mail dizendo que ela tem um nova funcionalidade no branch `ruby-client` do repositório dela, você pode testá-la adicionando o remote e fazendo checkout do branch localmente:

    $ git remote add jessica git://github.com/jessica/myproject.git
    $ git fetch jessica
    $ git checkout -b rubyclient jessica/ruby-client

Se ela manda outro e-mail mais tarde com outro branch contendo outra nova funcionalidade, você pode fazer fetch e checkout porque você já tem o remote configurado.

Isso é mais importante se você estiver trabalhando com uma pessoa regularmente. Se alguém só tem um patch para contribuir de vez em quando, então aceitá-lo por e-mail gastaria menos tempo do que exigir que todo mundo rode seu próprio servidor e tenha que continuamente adicionar e remover remotes para pegar poucos patches. Você também provavelmente não vai querer ter centenas de remotes, cada um para alguém que contribuiu um ou dois patches. Entretanto, scripts e serviços de hospedagem podem tornar isso mais fácil — depende bastante de como você desenvolve e como os contribuintes desenvolvem.

A outra vantagem dessa abordagem é que você terá o histórico dos commits também. Embora você possa ter problemas de merge legítimos, você sabe onde eles são baseados em seu histórico; um three-way merge é padrão ao invés de ter que fornecer opção `-3` e esperar que o patch tenha sido gerado de um commit público que você tenha acesso.

Se você estiver trabalhando com a pessoa regularmente, mas ainda quer puxar deles dessa forma, você pode fornecer a URL do repositório remoto para o comando `git pull`. Isso faz um pull uma vez e não salva a URL como um remote:

    $ git pull git://github.com/onetimeguy/project.git
    From git://github.com/onetimeguy/project
     * branch            HEAD       -> FETCH_HEAD
    Merge made by recursive.

## Determinando O Que É Introduzido

Agora você tem um topic branch que contém trabalho contribuído. Nesse ponto, você pode determinar o que você gostaria de fazer com isso. Essa seção revê alguns comandos para que você possa usá-los para revisar exatamente o que você estará introduzindo se você fizer merge em seu branch principal.

Geralmente ajuda conseguir uma revisão de todos os commits que estão nesse branch, mas que não estão em seu branch principal. Você pode excluir commits em seu branch `master` adicionando a opção `--not` antes do nome do branch. Por exemplo, se o contribuinte lhe envia dois patches, você cria um branch chamado `contrib` e aplica esses patches lá, você pode executar isso:

    $ git log contrib --not master
    commit 5b6235bd297351589efc4d73316f0a68d484f118
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Fri Oct 24 09:53:59 2008 -0700

        seeing if this helps the gem

    commit 7482e0d16d04bea79d0dba8988cc78df655f16a0
    Author: Scott Chacon <schacon@gmail.com>
    Date:   Mon Oct 22 19:38:36 2008 -0700

        updated the gemspec to hopefully work better

Para ver quais mudanças cada commit introduz lembre que você pode passar a opção `-p` no `git log` e ele irá adicionar o diff introduzido em cada commit.

Para ver um diff completo do que irá acontecer se você fizer merge desse topic branch com outro branch, você pode ter que usar um truque estranho que consegue os resultados corretos. Você pode pensar em executar isso:

    $ git diff master

Esse comando lhe dá um diff, mas é enganoso. Se seu branch `master` avançou desde que foi criado o topic branch a partir dele, então você terá resultados aparentemente estranhos. Isso acontece porque o Git compara diretamente o snapshot do último commit do topic branch que você está e o snapshot do último commit do branch `master`. Por exemplo, se você tiver adicionado uma linha em um arquivo no branch `master`, uma comparação direta dos snapshots irá parecer que o topic branch irá remover aquela linha.

Se `master` é ancestral direto de seu topic branch, isso não é um problema; mas se os dois históricos estiverem divergido, o diff irá parecer que está adicionando todas as coisas novas em seu topic branch e removendo tudo único do branch `master`.

O que você realmente quer ver são as mudanças adicionadas no topic branch — o trabalho que você irá introduzir se fizer merge com `master`. Você faz isso mandando o Git comparar o último commit do seu topic branch com o primeiro ancestral comum que ele tem como o branch `master`.

Tecnicamente, você pode fazer isso descobrindo explicitamente qual é o ancestral comum e então executando seu diff nele:

    $ git merge-base contrib master
    36c7dba2c95e6bbb78dfa822519ecfec6e1ca649
    $ git diff 36c7db

Entretanto, isso não é conveniente, então o Git fornece outro atalho para fazer a mesma coisa: a sintaxe dos três pontos. No contexto do comando `diff`, você pode usar três pontos depois de outro branch para fazer um `diff` entre o último commit do branch que você está e seu ancestral comum com outro branch:

    $ git diff master...contrib

Esse comando lhe mostra apenas o trabalho que o topic branch introduziu desde seu ancestral em comum com `master`. Essa é uma sintaxe muito útil de se lembrar.

## Integrando Trabalho Contribuído

Quando todo o trabalho em seu topic branch estiver pronto para ser integrado em um branch mais importante, a questão é como fazê-lo. Além disso, que fluxo de trabalho você quer usar para manter seu projeto? Você tem várias opções, então eu cobrirei algumas delas.

### Fluxos de Trabalho para Merge

Um fluxo de trabalho simples faz merge de seu trabalho em seu branch `master`. Nesse cenário, você tem um branch `master` que contém código estável. Quando você tiver trabalho em um topic branch que você fez ou que alguém contribuiu e você verificou, você faz merge no branch `master`, remove o topic branch e continua o processo. Se você tem um repositório com trabalho em dois branches chamados `ruby_client` e `php_client` que se parecem com a Figura 5-19 e faz primeiro merge de `ruby_client` e então de `php_client`, então seu histórico se parecerá como na Figura 5-20.


![](http://git-scm.com/figures/18333fig0519-tn.png)

Figura 5-19. histórico com vários topic branches.


![](http://git-scm.com/figures/18333fig0520-tn.png)

Figura 5-20. Depois de um merge de topic branches.

Isso é provavelmente o fluxo de trabalho mais simples, mas é problemático se você estiver lidando com repositórios ou projetos maiores.

Se você tiver mais desenvolvedores ou um projeto maior, você irá provavelmente querer usar pelo menos um ciclo de merge de duas fases. Nesse cenário você tem dois branches de longa duração, `master` e `develop`, dos quais você determina que `master` é atualizado só quando uma liberação bem estável é atingida e todo novo trabalho é integrado no branch `develop`. Você dá push regularmente de ambos os branches para o repositório público. Cada vez que você tiver um novo topic branch para fazer merge (Figura 5-21), você faz merge em `develop` (Figura 5-22); então, quando você criar uma tag o release, você avança (fast-forward) `master` para onde o agora estável branch `develop` estiver (Figura 5-23).



![](http://git-scm.com/figures/18333fig0521-tn.png)

Figura 5-21. Antes do merge do topic branch.


![](http://git-scm.com/figures/18333fig0522-tn.png)

Figura 5-22. Depois do merge do topic branch.


![](http://git-scm.com/figures/18333fig0523-tn.png)

Figura 5-23. Depois da liberação do topic branch.

Dessa forma, quando as pessoas clonarem seu repositório do projeto, eles podem fazer checkout ou do `master` para fazer build da última versão estável e se manter atualizado facilmente, ou eles pode fazer checkout do develop para conseguir coisas mais de ponta.
Você pode também continuar esse conceito, tendo um branch de integração onde é feito merge de todo o trabalho de uma vez. Então, quando a base de código daquele branch for estável e passar nos testes, você faz merge no branch develop; e quando este tiver comprovadamente estável por um tempo, você avança seu branch `master`.

### Fluxo de Trabalho de Merges Grandes

O projeto Git tem quatro branches de longa duração: `master`, `next` e `pu` (proposed updates, atualizações propostas) para trabalho novo e `maint` para manutenção de versões legadas. Quando trabalho novo é introduzido por contribuintes, ele é coletado em topic branches no repositório do mantenedor em uma maneira similar ao que já foi descrito (veja Figura 5-24). Nesse ponto, os tópicos são avaliados para determinar se eles são seguros e prontos para consumo ou se eles precisam de mais trabalho. Se eles são seguros, é feito merge em `next` e é dado push do branch para que todo mundo possa testar os tópicos integrados juntos.


![](http://git-scm.com/figures/18333fig0524-tn.png)

Figura 5-24. Gerenciando uma série complexa de topic branches contribuídos em paralelo.

Se os tópicos ainda precisam de trabalho, é feito merge em `pu`. Quando é determinado que eles estão totalmente estáveis, é feito novamente merge dos tópicos em `master` e os branches refeitos com os tópicos que estavam em `next`, mas não graduaram para `master` ainda. Isso significa que `master` quase sempre avança, `next` passa por rebase de vez em quando e `pu` ainda mais frequentemente (veja Figura 5-25).


![](http://git-scm.com/figures/18333fig0525-tn.png)

Figura 5-25. Fazendo merge de topic branches contribuídos em branches de integração de longa duração.

Quando finalmente tiver sido feito merge do topic branch em `master`, ele é removido do repositório. O projeto Git também tem um branch `maint` que é copiado (fork) da última versãp a fornecer patches legados no caso de uma versão de manutenção ser requerida. Assim, quando você clona o repositório do Git, você tem quatro branches que você pode fazer checkout para avaliar o projeto em diferentes estágios de desenvolvimento, dependendo em quão atualizado você quer estar ou como você quer contribuir; e o mantenedor tem um fluxo de trabalho estruturado para ajudá-lo a vetar novas contribuições.

### Fluxos de Trabalho para Rebase e Cherry Pick

Outros mantenedores preferem fazer rebase ou cherry-pick do trabalho contribuído em cima do branch `master` deles ao invés de fazer merge, para manter um histórico mais linear. Quando você tem trabalho em um topic branch e você determinou que você quer integrá-lo, você muda para aquele branch e executa o comando rebase para reconstruir as alterações em cima do branch `master` atual (ou `develop`, e por ai vai). Se isso funcionar bem, você pode avançar seu branch `master` e você irá terminar com um histórico de projeto linear.

A outra forma de mover trabalho introduzido de um branch para outro é cherry-pick. Um cherry-pick no Git é como um rebase para um único commit. Ele pega o patch que foi introduzido em um commit e tenta reaplicar no branch que você está. Isso é útil se você tem vários commits em um topic branch e quer integrar só um deles, ou se você tem um commit em um topic branch que você prefere usar cherry-pick ao invés de rebase. Por exemplo, vamos supor que você tem um projeto que se parece com a Figura 5-26.


![](http://git-scm.com/figures/18333fig0526-tn.png)

Figura 5-26. Histórico do exemplo antes de um cherry pick.

Se você quer puxar o commit `e43a6` no branch `master`, você pode executar

    $ git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
    Finished one cherry-pick.
    [master]: created a0a41a9: "More friendly message when locking the index fails."
     3 files changed, 17 insertions(+), 3 deletions(-)

Isso puxa as mesmas alterações introduzidas em `e43a6`, mas o commit tem um novo valor SHA-1, porque a data de aplicação é diferente. Agora seu histórico se parece com a Figura 5-27.


![](http://git-scm.com/figures/18333fig0527-tn.png)

Figura 5-27. Histórico depois de fazer cherry-pick de um commit no topic branch.

Agora você pode remover seu topic branch e se livrar dos commits que você não quer puxar.

## Gerando Tag de Suas Liberações (Releases)

Quando você decidir fazer uma release, você provavelmente irá querer fazer uma tag para que você possa recriar aquela liberação em qualquer ponto no futuro. Você pode criar uma nova tag como discutimos no capítulo 2. Se você decidir assinar a tag como mantenedor, o processo parecerá com isso:

    $ git tag -s v1.5 -m 'my signed 1.5 tag'
    You need a passphrase to unlock the secret key for
    user: "Scott Chacon <schacon@gmail.com>"
    1024-bit DSA key, ID F721C45A, created 2009-02-09

Se você assinar suas tags, você pode ter o problema de distribuir as chaves PGP públicas usadas para assinar suas tags. O mantenedor do projeto Git tem resolvido esse problema incluindo a chave pública como um blob no repositório e então adicionando a tag que aponta diretamente para o conteúdo. Para fazer isso, você pode descobrir qual a chave que você quer executando `gpg --list-keys`:

    $ gpg --list-keys
    /Users/schacon/.gnupg/pubring.gpg
    ---------------------------------
    pub   1024D/F721C45A 2009-02-09 [expires: 2010-02-09]
    uid                  Scott Chacon <schacon@gmail.com>
    sub   2048g/45D02282 2009-02-09 [expires: 2010-02-09]

Então, você pode importar diretamente a chave no banco de dados Git exportando ela passando por pipe com `git hash-object`, que escreve um novo blob com esse conteúdo no Git e lhe devolve o SHA-1 do blob:

    $ gpg -a --export F721C45A | git hash-object -w --stdin
    659ef797d181633c87ec71ac3f9ba29fe5775b92

Agora que você tem os conteúdos da sua chave no Git, você pode criar uma tag que aponta diretamente para ela especificando o novo valor SHA-1 que o comando `hash-object` lhe deu:

    $ git tag -a maintainer-pgp-pub 659ef797d181633c87ec71ac3f9ba29fe5775b92

Se você executar `git push --tags`, a tag `maintainer-pgp-pub` será compartilhada com todo mundo. Se alguém quiser verificar a tag, ele pode importar diretamente sua chave PGP puxando o blob diretamente do banco de dados e importando no GPG:

    $ git show maintainer-pgp-pub | gpg --import

Eles podem usar essa chave para verificar todas as tags assinadas. E se você incluir instruções na mensagem da tag, executar `git show <tag>` irá dar ao usuário final instruções mais detalhadas sobre a verificação da tag.

## Gerando um Número de Build

Como o Git não tem um número que incrementa monotonicamente como 'v123' ou equivalente associado com cada commit, se você quer ter um nome legível que vá com cada commit você pode executar `git describe` naquele commit. Git lhe dá o nome da tag mais próxima com o número de commits em cima da tag e um SHA-1 parcial do commit que você está descrevendo:

    $ git describe master
    v1.6.2-rc1-20-g8c5b85c

Dessa forma, você pode exportar um snapshot ou build e nomeá-lo com algo compreensível para pessoas. De fato, se você compilar Git do código fonte clonado do repositório do Git, `git --version` lhe dará algo que se parece com isso. Se você estiver descrevendo um commit em que você adicionou uma tag, isso lhe dará o nome da tag.

O comando `git describe` favorece annotated tags (tags criadas com as opções `-a` ou `-s`), então tags de liberação devem ser criadas dessa forma se você estiver usando `git describe`, para assegurar que o commit seja nomeado corretamente quando feito o describe. Você pode também usar essa string como alvo do checkout, embora ele dependa do SHA-1 abreviado no final, então ele pode não ser válido para sempre. Por exemplo, o kernel do Linux recentemente mudou de 8 para 10 caracteres para assegurar que os SHA-1 sejam únicos, então saídas antigas do `git describe` foram invalidadas.

## Preparando Uma Liberação

Agora você quer liberar uma build. Uma das coisas que você irá querer fazer é criar um arquivo do último snapshot de seu código para aquelas almas perdidas que não usam Git. O comando para fazer isso é `git archive`:

    $ git archive master --prefix='project/' | gzip > `git describe master`.tar.gz
    $ ls *.tar.gz
    v1.6.2-rc1-20-g8c5b85c.tar.gz

Se alguém abre o tarball, eles obtêm o último snapshot do projeto dentro de um diretório 'project'. Você pode também criar um arquivo zip quase da mesma forma, mas passando `--format=zip` para `git archive`:

    $ git archive master --prefix='project/' --format=zip > `git describe master`.zip

Você agora tem uma tarball e um arquivo zip da sua liberação que você pode disponibilizar em seu website ou enviar por e-mail para outras pessoas.

## O Shortlog

É hora de enviar e-mail para a lista de e-mails das pessoas que querem saber o que está acontecendo no seu projeto. Uma forma legal de conseguir rapidamente um tipo de changelog do que foi adicionado ao seu projeto desde sua última liberação ou e-mail é usar o comando `git shortlog`. Ele resume todos os commits no intervalo que você passar; por exemplo, o seguinte lhe dá um resumo de todos os commits desde a sua última liberação, se sua última liberação foi chamada v1.0.1:

    $ git shortlog --no-merges master --not v1.0.1
    Chris Wanstrath (8):
          Add support for annotated tags to Grit::Tag
          Add packed-refs annotated tag support.
          Add Grit::Commit#to_patch
          Update version and History.txt
          Remove stray `puts`
          Make ls_tree ignore nils

    Tom Preston-Werner (4):
          fix dates in history
          dynamic version method
          Version bump to 1.0.2
          Regenerated gemspec for version 1.0.2

Você obtém um resumo sucinto de todos os commits desde v1.0.1 agrupados por autor que você pode enviar por e-mail para a sua lista.
