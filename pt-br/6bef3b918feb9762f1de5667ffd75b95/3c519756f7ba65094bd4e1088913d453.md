# Depurando com Git

Git também fornece algumas ferramentas para lhe ajudar a depurar problemas em seus projetos. Pelo fato do Git ser projetado para funcionar com quase qualquer tipo de projeto, essas ferramentas são bastante genéricas, mas elas muitas vezes podem ajudá-lo a caçar um bug ou encontrar um culpado quando as coisas dão errado.

## Anotação de Arquivo

Se você encontrar um erro no seu código e deseja saber quando e por quê ele foi inserido, anotação de arquivo é muitas vezes a melhor ferramenta. Ele mostra qual commit foi o último a modificar cada linha de qualquer arquivo. Portanto, se você ver que um método no seu código está com problemas, você pode anotar o arquivo com `git blame` para ver quando cada linha do método foi editada por último e por quem. Esse exemplo usa a opção `-L` para limitar a saída entre as linhas 12 e 22:

    $ git blame -L 12,22 simplegit.rb
    ^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 12)  def show(tree = 'master')
    ^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 13)   command("git show #{tree}")
    ^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 14)  end
    ^4832fe2 (Scott Chacon  2008-03-15 10:31:28 -0700 15)
    9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 16)  def log(tree = 'master')
    79eaf55d (Scott Chacon  2008-04-06 10:15:08 -0700 17)   command("git log #{tree}")
    9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 18)  end
    9f6560e4 (Scott Chacon  2008-03-17 21:52:20 -0700 19)
    42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 20)  def blame(path)
    42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 21)   command("git blame #{path}")
    42cf2861 (Magnus Chacon 2008-04-13 10:45:01 -0700 22)  end

Observe que o primeiro campo é o SHA-1 parcial do commit que alterou a linha pela última vez. Os dois campos seguintes são valores extraídos do commit—o nome do autor e a data de autoria do commit — assim você pode ver facilmente quem alterou a linha e quando. Depois disso vem o número da linha e o conteúdo do arquivo. Observe também as linhas de commit com `^4832fe2`, elas dizem que essas linhas estavam no commit original do arquivo. Esse commit foi quando esse arquivo foi adicionado pela primeira vez nesse projeto, e essas linhas não foram alteradas desde então. Isso é um pouco confuso, porque agora você já viu pelo menos três maneiras diferentes de como Git usa o `^` para modificar um SHA de um commit, mas isso é o que ele significa neste caso.

Outra coisa legal sobre Git é que ele não rastreia mudança de nome explicitamente. Ele grava os snapshots e então tenta descobrir o que foi renomeado implicitamente, após o fato. Uma das características interessantes disso é que você também pode pedir que ele descubra qualquer tipo de mudança de código. Se você informar `-C` para `git blame`, Git analisa o arquivo que você está anotando e tenta descobrir de onde vieram originalmente os trechos de código, se eles foram copiados de outro lugar. Recentemente, eu estava refatorando um arquivo chamado `GITServerHandler.m` em vários arquivos, um deles era `GITPackUpload.m`. Ao usar "blame" `GITPackUpload.m` com a opção `-C`, eu podia ver de onde vinham os trechos de código originalmente:

    $ git blame -C -L 141,153 GITPackUpload.m
    f344f58d GITServerHandler.m (Scott 2009-01-04 141)
    f344f58d GITServerHandler.m (Scott 2009-01-04 142) - (void) gatherObjectShasFromC
    f344f58d GITServerHandler.m (Scott 2009-01-04 143) {
    70befddd GITServerHandler.m (Scott 2009-03-22 144)         //NSLog(@"GATHER COMMI
    ad11ac80 GITPackUpload.m    (Scott 2009-03-24 145)
    ad11ac80 GITPackUpload.m    (Scott 2009-03-24 146)         NSString *parentSha;
    ad11ac80 GITPackUpload.m    (Scott 2009-03-24 147)         GITCommit *commit = [g
    ad11ac80 GITPackUpload.m    (Scott 2009-03-24 148)
    ad11ac80 GITPackUpload.m    (Scott 2009-03-24 149)         //NSLog(@"GATHER COMMI
    ad11ac80 GITPackUpload.m    (Scott 2009-03-24 150)
    56ef2caf GITServerHandler.m (Scott 2009-01-05 151)         if(commit) {
    56ef2caf GITServerHandler.m (Scott 2009-01-05 152)                 [refDict setOb
    56ef2caf GITServerHandler.m (Scott 2009-01-05 153)

Isto é realmente útil. Normalmente, você recebe como commit original, o commit de onde o código foi copiado, porque essa foi a primeira vez que você mecheu nessas linhas do arquivo. Git lhe informa o commit original onde você escreveu aquelas linhas, mesmo que seja em outro arquivo.

## Pesquisa Binária

Anotar um arquivo ajuda se você sabe onde está o problema. Se você não sabe o que está o problema, e houveram dezenas ou centenas de commits desde a última vez que você sabe que o código estava funcionando, você provavelmente vai usar `git bisect` para ajudá-lo. O comando `bisect` faz uma pesquisa binária em seu histórico de commits para ajudar você a indentificar o mais rápido possível qual commit inseriu o erro.

Digamos que você acabou de enviar seu código para um ambiente de produção, você recebe relatos de erros sobre algo que não estava acontecendo no seu ambiente de desenvolvimento, e você não tem ideia do motivo do código estar fazendo isso. Você volta para seu código e consegue reproduzir o problema, mas não consegue descobrir o que está errado. Você pode usar o "bisect" para descobrir. Primeiro você executa `git bisect start` para começar, e depois você usa `git bisect bad` para informar ao sistema que o commit atual está quebrado. Em seguida, você deve informar ao "bisect" quando foi a última vez que estava correto, usando `git bisect good [good_commit]`:

    $ git bisect start
    $ git bisect bad
    $ git bisect good v1.0
    Bisecting: 6 revisions left to test after this
    [ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo

Git descobre que cerca de 12 commits estão entre o commit que você informou como o commit correto (v1.0) e a versão atual incorreta, e ele faz o um check out do commit do meio para você. Neste momento, você pode executar seus testes para ver se o problema existe neste commit. Se existir, então ele foi inserido em algum momento antes desse commit do meio; se não existir, então o problema foi inserido algum momento após o commit do meio. Acontece que não há nenhum problema aqui, e você informa isso ao Git digitando `git bisect good` e continua sua jornada:

    $ git bisect good
    Bisecting: 3 revisions left to test after this
    [b047b02ea83310a70fd603dc8cd7a6cd13d15c04] secure this thing

Agora você está em outro commit, na metade do caminho entre aquele que você acabou de testar e o commit incorreto. Você executa os testes novamente e descobre que esse commit está quebrado, você informa isso ao Git com `git bisect bad`:

    $ git bisect bad
    Bisecting: 1 revisions left to test after this
    [f71ce38690acf49c1f3c9bea38e09d82a5ce6014] drop exceptions table

Este commit está correto, e agora Git tem todas as informações que precisa para determinar quando o problema foi inserido. Ele lhe informa o SHA-1 do primeiro commit incorreto e mostra algumas informações do commit e quais arquivos foram alterados nesse commit para que você possa descobrir o que aconteceu que pode ter inserido esse erro:

    $ git bisect good
    b047b02ea83310a70fd603dc8cd7a6cd13d15c04 is first bad commit
    commit b047b02ea83310a70fd603dc8cd7a6cd13d15c04
    Author: PJ Hyett <pjhyett@example.com>
    Date:   Tue Jan 27 14:48:32 2009 -0800

        secure this thing

    :040000 040000 40ee3e7821b895e52c1695092db9bdc4c61d1730
    f24d3c6ebcfc639b1a3814550e62d60b8e68a8e4 M  config

Quando você terminar, você deve executar `git bisect reset` para fazer o "reset" do seu HEAD para onde você estava antes de começar, ou você vai acabar em uma situação estranha:

    $ git bisect reset

Essa é uma ferramenta poderosa que pode ajudar você a verificar centenas de commits em minutos para encontrar um erro. Na verdade, se você tiver um script que retorna 0 se o projeto está correto ou algo diferente de 0 se o projeto está incorreto, você pode automatizar totalmente `git bisect`. Primeiro, novamente você informa o escopo fornecendo o commit incorreto e o correto. Você pode fazer isso listando eles com o comando `bisect start` se você quiser, primeiro o commit incorreto e o correto em seguida:

    $ git bisect start HEAD v1.0
    $ git bisect run test-error.sh

Ao fazer isso, é executado automaticamente `test-error.sh` em cada commit até o Git encontrar o primeiro commit quebrado. Você também pode executar algo como `make` ou `make tests` ou qualquer coisa que executa testes automatizados para você.
