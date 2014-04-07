# Rebasing

No Git, existem duas maneiras principais de integrar mudanças de um branch em outro: o `merge` e o `rebase`. Nessa seção você aprenderá o que é rebase, como fazê-lo, por que é uma ferramenta sensacional, e em quais casos você não deve usá-la.

## O Rebase Básico

Se você voltar para o exemplo anterior na seção de merge (veja Figura 3-27), você pode ver que você criou uma divergência no seu trabalho e fez commits em dois branches diferentes.


![](http://git-scm.com/figures/18333fig0327-tn.png)

Figura 3-27. Divergência inicial no seu histórico de commits.

A maneira mais fácil de integrar os branches, como já falamos, é o comando `merge`. Ele executa um merge de três vias entre os dois últimos snapshots (cópias em um determinado ponto no tempo) dos branches (C3 e C4) e o mais recente ancestral comum aos dois (C2), criando um novo snapshot (e um commit), como é mostrado na Figura 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)

Figura 3-28. Fazendo o merge de um branch para integrar o trabalho divergente.

Porém, existe outro modo: você pode pegar o trecho da mudança que foi introduzido em C3 e reaplicá-lo em cima do C4. No Git, isso é chamado de _rebasing_. Com o comando `rebase`, você pode pegar todas as mudanças que foram commitadas em um branch e replicá-las em outro.

Nesse exemplo, se você executar o seguinte:

    $ git checkout experiment
    $ git rebase master
    First, rewinding head to replay your work on top of it...
    Applying: added staged command

Ele vai ao ancestral comum dos dois branches (no que você está e no qual será feito o rebase), pega a diferença (diff) de cada commit do branch que você está, salva elas em um arquivo temporário, restaura o brach atual para o mesmo commit do branch que está sendo feito o rebase e, finalmente, aplica uma mudança de cada vez. A Figura 3-29 ilustra esse processo.


![](http://git-scm.com/figures/18333fig0329-tn.png)

Figura 3-29. Fazendo o rebase em C4 de mudanças feitas em C3.

Nesse ponto, você pode ir ao branch master e fazer um merge fast-forward (Figura 3-30).


![](http://git-scm.com/figures/18333fig0330-tn.png)

Figura 3-30. Fazendo um fast-forward no branch master.

Agora, o snapshot apontado por C3' é exatamente o mesmo apontado por C5 no exemplo do merge. Não há diferença no produto final dessas integrações, mas o rebase monta um histórico mais limpo. Se você examinar um log de um branch com rebase, ele parece um histórico linear: como se todo o trabalho tivesse sido feito em série, mesmo que originalmente tenha sido feito em paralelo.

Constantemente você fará isso para garantir que seus commits sejam feitos de forma limpa em um branch remoto — talvez em um projeto em que você está tentando contribuir mas não mantém. Nesse caso, você faz seu trabalho em um branch e então faz o rebase em `origin/master` quando está pronto pra enviar suas correções para o projeto principal. Desta maneira, o mantenedor não precisa fazer nenhum trabalho de integração — somente um merge ou uma inserção limpa.

Note que o snapshot apontado pelo o commit final, o último commit dos que vieram no rebase ou o último commit depois do merge, são o mesmo snapshot — somente o histórico é diferente. Fazer o rebase reproduz mudanças de uma linha de trabalho para outra na ordem em que foram feitas, já que o merge pega os pontos e os une.

## Rebases Mais Interessantes

Você também pode fazer o rebase em um local diferente do branch de rebase. Veja o histórico na Figura 3-31, por exemplo. Você criou um branch tópico (`server`) no seu projeto para adicionar uma funcionalidade no lado servidor e fez o commit. Então, você criou outro branch para fazer mudanças no lado cliente (`client`) e fez alguns commits. Finalmente, você voltou ao ser branch server e fez mais alguns commits.


![](http://git-scm.com/figures/18333fig0331-tn.png)

Figura 3-31. Histórico com um branch tópico a partir de outro.

Digamos que você decide fazer um merge das mudanças entre seu branch com mudanças do lado cliente na linha de trabalho principal para lançar uma versão, mas quer segurar as mudanças do lado servidor até que elas sejam testadas melhor. Você pode pegar as mudanças que não estão no servidor (C8 e C9) e incluí-las no seu branch master usando a opção `--onto` do `git rebase`:

    $ git rebase --onto master server client

Isto basicamente diz, "Faça o checkout do branch client, verifique as mudanças a partir do ancestral em comum aos branches `client` e `server`, e coloque-as no `master`.” É um pouco complexo, mas o resultado, mostrado na Figura 3-32, é muito legal:


![](http://git-scm.com/figures/18333fig0332-tn.png)

Figura 3-32. Fazendo o rebase de um branch tópico em outro.

Agora você pode avançar (fast-forward) seu branch master (veja Figura 3-33):

    $ git checkout master
    $ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)

Figura 3-33. Avançando o seu branch master para incluir as mudanças do branch client.

Digamos que você decidiu obter o branch do seu servidor também. Você pode fazer o rebase do branch do servidor no seu branch master sem ter que fazer o checkout primeiro com o comando `git rebase [branchbase] [branchtopico]` — que faz o checkout do branch tópico (nesse caso, `server`) pra você e aplica-o no branch base (`master`):

    $ git rebase master server

Isso aplica o seu trabalho em `server` após aquele existente em `master`, como é mostrado na Figura 3-34:


![](http://git-scm.com/figures/18333fig0334-tn.png)

Figura 3-34. Fazendo o rebase do seu branch server após seu branch master.

Em seguida, você pode avançar seu branch base (`master`):

    $ git checkout master
    $ git merge server

Você pode apagar os branches `client` e `server` pois todo o trabalho já foi integrado e você não precisa mais deles, deixando seu histórico de todo esse processo parecendo com a Figura 3-35:

    $ git branch -d client
    $ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)

Figura 3-35. Histórico final de commits.

## Os Perigos do Rebase

Ahh, mas apesar dos benefícios do rebase existem os inconvenientes, que podem ser resumidos em um linha:

**Não faça rebase de commits que você enviou para um repositório público.**

Se você seguir essa regra você ficará bem. Se não seguir, as pessoas te odiarão e você será desprezado por amigos e familiares.

Quando você faz o rebase, você está abandonando commits existentes e criando novos que são similares, mas diferentes. Se fizer o push de commits em algum lugar e outros pegarem e fizerem trabalhos baseado neles e você reescrever esses commits com `git rebase` e fizer o push novamente, seus colaboradores terão que fazer o merge de seus trabalhos novamente e as coisas ficarão bagunçadas quando você tentar trazer o trabalho deles de volta para o seu.

Vamos ver um exemplo de como o rebase funciona e dos problemas que podem ser causados quando você torna algo público. Digamos que você faça o clone de um servidor central e faça algum trabalho em cima dele. Seu histórico de commits parece com a Figura 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)

Figura 3-36. Clone de um repositório e trabalho a partir dele.

Agora, outra pessoa faz modificações que inclui um merge e envia (push) esse trabalho para o servidor central. Você o obtêm e faz o merge do novo branch remoto no seu trabalho, fazendo com que seu histórico fique como na Figura 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)

Figura 3-37. Obtêm mais commits e faz o merge deles no seu trabalho.

Em seguida, a pessoa que enviou o merge voltou atrás e fez o rebase do seu trabalho; eles executam `git push --force` para sobrescrever o histórico no servidor. Você então obtêm os dados do servidor, trazendo os novos commits.


![](http://git-scm.com/figures/18333fig0338-tn.png)

Figura 3-38. Alguém envia commits com rebase, abandonando os commits que você usou como base para o seu trabalho.

Nesse ponto, você tem que fazer o merge dessas modificações novamente, mesmo que você já o tenha feito. Fazer o rebase muda o código hash SHA-1 desses commits, então para o Git eles são commits novos, embora você já tenha as modificações de C4 no seu histórico (veja Figura 3-39).


![](http://git-scm.com/figures/18333fig0339-tn.png)

Figura 3-39. Você faz o merge novamente das mesmas coisas em um novo commit.

Você tem que fazer o merge desse trabalho em algum momento para se manter atualizado em relação ao outro desenvolvedor no futuro. Depois de fazer isso, seu histórico de commits terá tanto o commit C4 quanto C4', que tem códigos hash SHA-1 diferentes mas tem as mesmas modificações e a mesma mensagem de commit. Se você executar `git log` quando seu histórico está dessa forma, você verá dois commits que terão o mesmo autor, data e mensagem, o que será confuso. Além disso, se você enviar (push) esses histórico de volta ao servidor, você irá inserir novamente todos esses commits com rebase no servidor central, o que pode mais tarde confundir as pessoas.

Se você tratar o rebase como uma maneira de manter limpo e trabalhar com commits antes de enviá-los, e se você faz somente rebase de commits que nunca foram disponíveis publicamente, você ficará bem. Se você faz o rebase de commits que já foram enviados publicamente, e as pessoas podem ter se baseado neles para o trabalho delas, então você poderá ter problemas frustrantes.
