# Branches Remotos

Branches remotos são referências ao estado de seus branches no seu repositório remoto. São branches locais que você não pode mover, eles se movem automaticamente sempre que você faz alguma comunicação via rede. Branches remotos agem como marcadores para lembrá-lo onde estavam seus branches no seu repositório remoto na última vez que você se conectou a eles.

Eles seguem o padrão `(remote)/(branch)`. Por exemplo, se você quer ver como o branch `master` estava no seu repositório remoto `origin` na última vez que você se comunicou com ele, você deve ver o branch `origin/master`. Se você estivesse trabalhando em um problema com um colega e eles colocassem o branch `iss53` no repositório, você poderia ter seu próprio branch `iss53`; mas o branch no servidor iria fazer referência ao commit em `origin/iss53`.

Isso pode parecer um pouco confuso, então vamos ver um exemplo. Digamos que você tem um servidor Git na sua rede em `git.ourcompany.com`. Se você cloná-lo, Git automaticamente dá o nome `origin` para ele, baixa todo o seu conteúdo, cria uma referência para onde o branch `master` dele está, e dá o nome `origin/master` para ele localmente; e você não pode movê-lo. O Git também dá seu próprio branch `master` como ponto de partida no mesmo local onde o branch `master` remoto está, a partir de onde você pode trabalhar (veja Figura 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)

Figura 3-22. Um comando clone do Git dá a você seu próprio branch master e origin/master faz referência ao branch master original.

Se você estiver trabalhando no seu branch master local, e, ao mesmo tempo, alguém envia algo para `git.ourcompany.com` atualizando o branch master, seu histórico avançará de forma diferente. Além disso, enquanto você não fizer contado com seu servidor original, seu `origin/master` não se moverá (veja Figura 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)

Figura 3-23. Ao trabalhar local e alguém enviar coisas para seu servidor remoto faz cada histórico avançar de forma diferente.

Para sincronizar suas coisas, você executa o comando `git fetch origin`. Esse comando verifica qual servidor "origin" representa (nesse caso, é `git.ourcompany.com`), obtém todos os dados que você ainda não tem e atualiza o seu banco de dados local, movendo o seu `origin/master` para a posição mais recente e atualizada (veja Figura 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)

Figura 3-24. O comando git fetch atualiza suas referências remotas.

Para demostrar o uso de múltiplos servidores remotos e como os branches remotos desses projetos remotos parecem, vamos assumir que você tem outro servidor Git interno que é usado somente para desenvolvimento por um de seus times. Este servidor está em `git.team1.ourcompany.com`. Você pode adicioná-lo como uma nova referência remota ao projeto que você está atualmente trabalhando executando o comando `git remote add` como discutimos no capítulo 2. Dê o nome de `teamone`, que será o apelido para aquela URL (veja Figura 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)

Figura 3-25. Adicionando outro servidor remoto.

Agora, você pode executar o comando `git fetch teamone` para obter tudo que o servidor `teamone` tem e você ainda não. Por esse servidor ter um subconjunto dos dados que seu servidor `origin` tem, Git não obtém nenhum dado, somente cria um branch chamado `teamone/master` que faz referência ao commit que `teamone` tem no `master` dele (veja Figura 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)

Figura 3-26. Você consegue uma referência local para a posição do branch master do teamone.

## Enviando (Pushing)

Quando você quer compartilhar um branch com o mundo, você precisa enviá-lo a um servidor remoto que você tem acesso. Seus branches locais não são automaticamente sincronizados com os remotos — você tem que explicitamente enviar (push) os branches que quer compartilhar. Desta maneira, você pode usar branches privados para o trabalho que não quer compartilhar, e enviar somente os branches tópicos em que quer colaborar.

Se você tem um branch chamado `serverfix` e quer trabalhar com outros, você pode enviá-lo da mesma forma que enviou seu primeiro branch. Execute o comando `git push (remote) (branch)`:

    $ git push origin serverfix
    Counting objects: 20, done.
    Compressing objects: 100% (14/14), done.
    Writing objects: 100% (15/15), 1.74 KiB, done.
    Total 15 (delta 5), reused 0 (delta 0)
    To git@github.com:schacon/simplegit.git
     * [new branch]      serverfix -> serverfix

Isso é um atalho. O Git automaticamente expande o branch `serverfix` para `refs/heads/serverfix:refs/heads/serverfix`, que quer dizer, "pegue meu branch local serverfix e envie para atualizar o branch serverfix no servidor remoto". Nós vamos ver a parte de `refs/heads/` em detalhes no capítulo 9, mas em geral você pode deixar assim. Você pode executar também `git push origin serverfix:serverfix`, que faz a mesma coisa — é como, "pegue meu serverfix e o transforme no serverfix remoto". Você pode usar esse formato para enviar (push) um branch local para o branch remoto que tem nome diferente. Se você não quer chamá-lo de serverfix no remoto, você pode executar `git push origin serverfix:awesomebranch` para enviar seu branch local `serverfix` para o branch `awesomebranch` no projeto remoto.

Na próxima vez que um dos seus colaboradores obtiver dados do servidor, ele terá uma referência para onde a versão do servidor de serverfix está no branch remoto `origin/serverfix`:

    $ git fetch origin
    remote: Counting objects: 20, done.
    remote: Compressing objects: 100% (14/14), done.
    remote: Total 15 (delta 5), reused 0 (delta 0)
    Unpacking objects: 100% (15/15), done.
    From git@github.com:schacon/simplegit
     * [new branch]      serverfix    -> origin/serverfix

É importante notar que quando você obtém dados que traz novos branches remotos, você não tem automaticamente copias locais e editáveis. Em outras palavras, nesse caso, você não tem um novo branch `serverfix` — você tem somente uma referência a `origin/serverfix` que você não pode modificar.

Para fazer o merge desses dados no branch que você está trabalhando, você pode executar o comando `git merge origin/serverfix`. Se você quer seu próprio branch `serverfix` para trabalhar, você pode se basear no seu branch remoto:

    $ git checkout -b serverfix origin/serverfix
    Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
    Switched to a new branch "serverfix"

Isso dá a você um branch local para trabalhar que começa onde `origin/serverfix` está.

## Branches Rastreados (Tracking branches)

Baixar um branch local a partir de um branch remoto cria automaticamente o chamado _tracking branch_ (branches rastreados). Tracking branches são branches locais que tem uma relação direta com um branch remoto. Se você está em um tracking branch e digita `git push`, Git automaticamente sabe para que servidor e branch deve fazer o envio (push). Além disso, ao executar o comando `git pull` em um desses branches, é obtido todos os dados remotos e é automaticamente feito o merge do branch remoto correspondente.

Quando você faz o clone de um repositório, é automaticamente criado um branch `master` que segue `origin/master`. Esse é o motivo pelo qual `git push` e `git pull` funcionam sem argumentos. Entretanto, você pode criar outros tracking branches se quiser — outros que não seguem branches em `origin` e não seguem o branch `master`. Um caso simples é o exemplo que você acabou de ver, executando o comando `git checkout -b [branch] [nomeremoto]/[branch]`. Se você tem a versão do Git 1.6.2 ou mais recente, você pode usar também o atalho `--track`:

    $ git checkout --track origin/serverfix
    Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
    Switched to a new branch "serverfix"

Para criar um branch local com um nome diferente do branch remoto, você pode facilmente usar a primeira versão com um nome diferente para o branch local:

    $ git checkout -b sf origin/serverfix
    Branch sf set up to track remote branch refs/remotes/origin/serverfix.
    Switched to a new branch "sf"

Agora, seu branch local sf irá automaticamente enviar e obter dados de origin/serverfix.

## Apagando Branches Remotos

Imagine que você não precise mais de um branch remoto — digamos, você e seus colaboradores acabaram uma funcionalidade e fizeram o merge no branch `master` remoto (ou qualquer que seja seu branch estável). Você pode apagar um branch remoto usando a sintaxe `git push [nomeremoto] :[branch]`. Se você quer apagar seu branch `serverfix` do servidor, você executa o comando:

    $ git push origin :serverfix
    To git@github.com:schacon/simplegit.git
     - [deleted]         serverfix

Boom. O branch não existe mais no servidor. Talvez você queira marcar essa página, pois precisará desse comando, e provavelmente esquecerá a sintaxe. Uma maneira de lembrar desse comando é pensar na sintaxe de `git push [nomeremoto] [branchlocal]:[branchremoto]` que nós vimos antes. Se tirar a parte `[branchlocal]`, basicamente está dizendo, “Peque nada do meu lado e torne-o `[branchremoto]`.”
