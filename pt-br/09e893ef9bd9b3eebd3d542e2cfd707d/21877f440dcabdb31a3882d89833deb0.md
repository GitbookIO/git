# Trabalhando com Remotos

Para ser capaz de colaborar com qualquer projeto no Git, você precisa saber como gerenciar seus repositórios remotos. Repositórios remotos são versões do seu projeto que estão hospedados na Internet ou em uma rede em algum lugar. Você pode ter vários deles, geralmente cada um é somente leitura ou leitura/escrita pra você. Colaborar com outros envolve gerenciar esses repositórios remotos e fazer o push e pull de dados neles quando você precisa compartilhar trabalho.
Gerenciar repositórios remotos inclui saber como adicionar repositório remoto, remover remotos que não são mais válidos, gerenciar vários branches remotos e defini-los como monitorados ou não, e mais. Nesta seção, vamos cobrir essas habilidades de gerenciamento remoto.

## Exibindo Seus Remotos

Para ver quais servidores remotos você configurou, você pode executar o comando `git remote`. Ele lista o nome de cada remoto que você especificou. Se você tiver clonado seu repositório, você deve pelo menos ver um chamado *origin* — esse é o nome padrão que o Git dá ao servidor de onde você fez o clone:

    $ git clone git://github.com/schacon/ticgit.git
    Initialized empty Git repository in /private/tmp/ticgit/.git/
    remote: Counting objects: 595, done.
    remote: Compressing objects: 100% (269/269), done.
    remote: Total 595 (delta 255), reused 589 (delta 253)
    Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
    Resolving deltas: 100% (255/255), done.
    $ cd ticgit
    $ git remote
    origin

Você também pode especificar `-v`, que mostra a URL que o Git armazenou para o nome do remoto:

    $ git remote -v
    origin  git://github.com/schacon/ticgit.git (fetch)
    origin  git://github.com/schacon/ticgit.git (push)

Se você tem mais de um remoto, o comando lista todos. Por exemplo, meu repositório Grit se parece com isso.

    $ cd grit
    $ git remote -v
    bakkdoor  git://github.com/bakkdoor/grit.git
    cho45     git://github.com/cho45/grit.git
    defunkt   git://github.com/defunkt/grit.git
    koke      git://github.com/koke/grit.git
    origin    git@github.com:mojombo/grit.git

Isso significa que podemos puxar contribuições de qualquer um desses usuários muito facilmente. Mas note que somente o remoto origin é uma URL SSH, sendo o único pra onde eu posso fazer o push (vamos ver o motivo disso no *Capítulo 4*).

## Adicionando Repositórios Remotos

Eu mencionei e dei algumas demonstrações de adição de repositórios remotos nas seções anteriores, mas aqui está como fazê-lo explicitamente. Para adicionar um novo repositório remoto no Git com um nome curto, para que você possa fazer referência facilmente, execute `git remote add [nomecurto] [url]`:

    $ git remote
    origin
    $ git remote add pb git://github.com/paulboone/ticgit.git
    $ git remote -v
    origin    git://github.com/schacon/ticgit.git
    pb    git://github.com/paulboone/ticgit.git

Agora você pode usar a string `pb` na linha de comando em lugar da URL completa. Por exemplo, se você quer fazer o fetch de todos os dados de Paul que você ainda não tem no seu repositório, você pode executar git fetch pb:

    $ git fetch pb
    remote: Counting objects: 58, done.
    remote: Compressing objects: 100% (41/41), done.
    remote: Total 44 (delta 24), reused 1 (delta 0)
    Unpacking objects: 100% (44/44), done.
    From git://github.com/paulboone/ticgit
     * [new branch]      master     -> pb/master
     * [new branch]      ticgit     -> pb/ticgit

O branch master de Paul é localmente acessível como `pb/master` — você pode fazer o merge dele em um de seus branches, ou fazer o check out de um branch local a partir deste ponto se você quiser inspecioná-lo.

## Fazendo o Fetch e Pull de Seus Remotos

Como você acabou de ver, para pegar dados dos seus projetos remotos, você pode executar:

    $ git fetch [nome-remoto]

Esse comando vai até o projeto remoto e pega todos os dados que você ainda não tem. Depois de fazer isso, você deve ter referências para todos os branches desse remoto, onde você pode fazer o merge ou inspecionar a qualquer momento. (Vamos ver o que são branches e como usá-los mais detalhadamente no *Capítulo 3*.)

Se você clonar um repositório, o comando automaticamente adiciona o remoto com o nome *origin*. Então, `git fetch origin` busca qualquer novo trabalho que foi enviado para esse servidor desde que você o clonou (ou fez a última busca). É importante notar que o comando `fetch` traz os dados para o seu repositório local — ele não faz o merge automaticamente com o seus dados ou modifica o que você está trabalhando atualmente. Você terá que fazer o merge manualmente no seu trabalho quando estiver pronto.

Se você tem um branch configurado para acompanhar um branch remoto (veja a próxima seção e o *Capítulo 3* para mais informações), você pode usar o comando `git pull` para automaticamente fazer o fetch e o merge de um branch remoto no seu branch atual. Essa pode ser uma maneira mais fácil ou confortável pra você; e por padrão, o comando `git clone` automaticamente configura seu branch local master para acompanhar o branch remoto master do servidor de onde você clonou (desde que o remoto tenha um branch master). Executar `git pull` geralmente busca os dados do servidor de onde você fez o clone originalmente e automaticamente tenta fazer o merge dele no código que você está trabalhando atualmente.

## Pushing Para Seus Remotos

Quando o seu projeto estiver pronto para ser compartilhado, você tem que enviá-lo para a fonte. O comando para isso é simples: `git push [nome-remoto] [branch]`. Se você quer enviar o seu branch master para o servidor `origin` (novamente, clonando normalmente define estes dois nomes para você automaticamente), então você pode rodar o comando abaixo para enviar o seu trabalho para o sevidor:

    $ git push origin master

Este comando funciona apenas se você clonou de um servidor que você têm permissão para escrita, e se mais ninguém enviou dados no meio tempo. Se você e mais alguém clonarem ao mesmo tempo, e você enviar suas modificações após a pessoa ter enviado as dela, o seu push será rejeitado. Antes, você terá que fazer um pull das modificações deste outro alguém, e incorporá-las às suas para que você tenha permissão para enviá-las. Veja o *Capítulo 3* para mais detalhes sobre como enviar suas modificações para servidores remotos.

## Inspecionando um Remoto

Se você quer ver mais informação sobre algum remoto em particular, você pode usar o comando `git remote show [nome-remoto]`. Se você rodar este comando com um nome específico, como `origin`, você verá algo assim:

    $ git remote show origin
    * remote origin
      URL: git://github.com/schacon/ticgit.git
      Remote branch merged with 'git pull' while on branch master
        master
      Tracked remote branches
        master
        ticgit

Ele lista a URL do repositório remoto assim como as branches sendo rastreadas. O resultado deste comando lhe diz que se você está na branch master e rodar `git pull`, ele automaticamente fará um merge na branch master no remoto depois que ele fizer o fetch de todas as referências remotas. Ele também lista todas as referências remotas que foram puxadas.

Este é um simples exemplo que você talvez encontre por aí. Entretanto, quando se usa o Git pra valer, você pode ver muito mais informação vindo de `git remote show`:

    $ git remote show origin
    * remote origin
      URL: git@github.com:defunkt/github.git
      Remote branch merged with 'git pull' while on branch issues
        issues
      Remote branch merged with 'git pull' while on branch master
        master
      New remote branches (next fetch will store in remotes/origin)
        caching
      Stale tracking branches (use 'git remote prune')
        libwalker
        walker2
      Tracked remote branches
        acl
        apiv2
        dashboard2
        issues
        master
        postgres
      Local branch pushed with 'git push'
        master:master

Este comando mostra qual branch é automaticamente enviado (pushed) quando você roda `git push` em determinados branches. Ele também mostra quais branches remotos que estão no servidor e você não tem, quais branches remotos você tem e que foram removidos do servidor, e múltiplos branches que são automaticamente mesclados (merged) quando você roda `git pull`.

## Removendo e Renomeando Remotos

Se você quiser renomear uma referência, em versões novas do Git você pode rodar `git remote rename` para modificar um apelido de um remoto. Por exemplo, se você quiser renomear `pb` para `paul`, você pode com `git remote rename`:

    $ git remote rename pb paul
    $ git remote
    origin
    paul

É válido mencionar que isso modifica também os nomes dos branches no servidor remoto. O que costumava ser referenciado como `pb/master` agora é `paul/master`.

Se você quiser remover uma referência por qualquer razão — você moveu o servidor ou não está mais usando um mirror específico, ou talvez um contribuidor não está mais contribuindo — você usa `git remote rm`:

    $ git remote rm paul
    $ git remote
    origin
