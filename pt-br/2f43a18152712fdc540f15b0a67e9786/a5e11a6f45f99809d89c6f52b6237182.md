# O Refspec

Ao longo deste livro, você usou um simples mapeamento de branches remotos para referências locais; mas eles podem ser mais complexos.
Suponha que você adicione um remoto como este:

    $ git remote add origin git@github.com:schacon/simplegit-progit.git

Ele adiciona uma seção em seu arquivo `.git/config`, especificando o nome do remoto (`origin`), a URL do repositório remoto, e o refspec a ser buscado:

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/*:refs/remotes/origin/*

O formato do refspec é um `+` opcional, seguido por `<src>:<dst>`, onde `<src>` é o padrão para referências no lado remoto e `<dst>` é onde essas referências serão escritas localmente. O `+` diz ao Git para atualizar a referência, mesmo que não seja um fast-forward.

No caso padrão que é automaticamente escrito por um comando `git remote add`, Git busca todas as referências em `refs/heads/` no servidor e grava-os em `refs/remotes/origin/` localmente. Então, se há um branch `master` no servidor, você pode acessar o log desse branch localmente através de

    $ git log origin/master
    $ git log remotes/origin/master
    $ git log refs/remotes/origin/master

Eles são todos equivalentes, porque Git expande cada um deles em `refs/remotes/origin/master`.

Se você quiser que o Git só faça o pull do branch `master` toda vez, e não qualquer outro branch do servidor remoto, você pode alterar a linha fetch para

    fetch = +refs/heads/master:refs/remotes/origin/master

Este é apenas o refspec padrão do `git fetch` para esse remoto. Se você quiser fazer algo apenas uma vez, você pode especificar o refspec na linha de comando também. Para fazer o pull do branch `master` do remoto até `origin/mymaster` localmente, você pode executar

    $ git fetch origin master:refs/remotes/origin/mymaster

Você também pode especificar múltiplos refspecs. Na linha de comando, você pode fazer pull de vários branches assim:

    $ git fetch origin master:refs/remotes/origin/mymaster \
       topic:refs/remotes/origin/topic
    From git@github.com:schacon/simplegit
     ! [rejected]        master     -> origin/mymaster  (non fast forward)
     * [new branch]      topic      -> origin/topic

Neste caso, o pull do branch master foi rejeitado, porque não era uma referência fast-forward. Você pode evitar isso especificando o `+` na frente do refspec.

Você também pode especificar múltiplos refspecs em seu arquivo de configuração. Se você quer sempre buscar os branches master e experiment, adicione duas linhas:

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/master:refs/remotes/origin/master
           fetch = +refs/heads/experiment:refs/remotes/origin/experiment

Você não pode usar globs parciais no padrão, então isto seria inválido:

    fetch = +refs/heads/qa*:refs/remotes/origin/qa*

No entanto, você pode usar namespacing para realizar algo assim. Se você tem uma equipe de QA que faz push de uma série de branches, e você deseja obter o branch master e qualquer um dos branches da equipe de QA, mas nada mais, você pode usar uma seção de configuração como esta:

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/master:refs/remotes/origin/master
           fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

Se você tem um fluxo de trabalho complexo que tem uma equipe de QA fazendo push de branches, desenvolvedores fazendo push de branches, e equipes de integração fazendo push e colaborando em branches remotos, você pode nomeá-los (namespace) facilmente desta forma.

## Fazendo Push de Refspecs

É legal que você possa buscar referências nomeadas dessa maneira, mas como é que a equipe de QA obtêm os seus branches em um namespace `qa/`? Você consegue fazer isso utilizando refspecs para fazer o push.

Se a equipe de QA quer fazer push de seu branch `master` em `qa/master` no servidor remoto, eles podem executar

    $ git push origin master:refs/heads/qa/master

Se eles querem que o Git faça isso automaticamente toda vez que executar `git push origin`, eles podem adicionar o valor `push` ao seu arquivo de configuração:

    [remote "origin"]
           url = git@github.com:schacon/simplegit-progit.git
           fetch = +refs/heads/*:refs/remotes/origin/*
           push = refs/heads/master:refs/heads/qa/master

Novamente, isso vai fazer com que `git push origin` faça um push do branch `master` local para o branch remoto `qa/master` por padrão.

## Deletando Referencias

Você também pode usar o refspec para apagar referências do servidor remoto executando algo como isto:

    $ git push origin :topic

Já que o refspec é `<src>:<dst>`, ao remover `<src>`, basicamente diz para enviar nada para o branch tópico no remoto, o que o exclui.
