# Protocolos de Transferência

Git pode transferir dados entre dois repositórios de duas maneiras principais: através de HTTP e através dos protocolos chamados inteligentes: `file://`, `ssh://` e `git://`. Esta seção irá mostrar rapidamente como esses dois principais protocolos operam.

## O Protocolo Burro

HTTP é muitas vezes referido como o protocolo burro, porque não requer código Git específico do lado servidor durante o processo de transporte. O processo de fetch é uma série de solicitações GET, onde o cliente pode assumir o layout do repositório Git no servidor. Vamos ver o processo `http-fetch` para obter a biblioteca simplegit:

    $ git clone http://github.com/schacon/simplegit-progit.git

A primeira coisa que este comando faz é obter o arquivo `info/refs`. Este arquivo é escrito pelo comando `update-server-info`, é por isso que você precisa ativar ele como um hook `post-receive` para que o transporte HTTP funcione corretamente:

    => GET info/refs
    ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

Agora você tem uma lista de referências remotas e os SHAs. Em seguida, você verifica qual é a referência HEAD para que você saiba o que deve ser obtido (check out) quando você terminar:

    => GET HEAD
    ref: refs/heads/master

Você precisa fazer o check out do branch `master` quando você tiver concluído o processo.
Neste momento, você está pronto para iniciar o processo de "caminhada". Como o seu ponto de partida é o objeto commit `ca82a6` que você viu no arquivo `info/refs`, você começa obtendo ele:

    => GET objects/ca/82a6dff817ec66f44342007202690a93763949
    (179 bytes of binary data)

Você obtêm um objeto — este objeto é um "loose format" no servidor, e você o obteu a partir de uma conexão HTTP GET estática. Você pode descompactá-lo, retirar o cabeçalho, e ver o conteúdo do commit:

    $ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
    tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
    parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    author Scott Chacon <schacon@gmail.com> 1205815931 -0700
    committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

    changed the version number

A seguir, você tem mais dois objetos para obter — `cfda3b`, que a árvore de conteúdo do commit que acabamos de obter referencia, e `085bb3`, que é o commit pai:

    => GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    (179 bytes of data)

Isso lhe dá o seu próximo objeto commit. Obtenha o objeto árvore:

    => GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
    (404 - Not Found)

Oops — parece que esse objeto árvore não está em "loose format" no servidor, então você recebe um erro 404. Há algumas razões para isso — o objeto pode estar em um repositório alternativo, ou poderia estar em um packfile neste repositório. Git verifica a existência de quaisquer alternativas listadas primeiro:

    => GET objects/info/http-alternates
    (empty file)

Se isso retornar uma lista de URLs alternativas, Git verifica a existência de "loose files" e packfiles lá — este é um mecanismo legal para projetos que são forks de um outro para compartilhar objetos no disco. No entanto, como não há substitutos listados neste caso, o objeto deve estar em um packfile. Para saber quais packfiles estão disponíveis neste servidor, você precisa obter o arquivo `objects/info/packs`, que contém uma lista deles (também gerado pelo `update-server-info`):

    => GET objects/info/packs
    P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Há apenas um packfile no servidor, então o seu objeto deve estar lá, mas você vai verificar o arquivo de índice para ter certeza. Isso também é útil se você tem vários packfiles no servidor, assim você pode ver qual packfile contém o objeto que você precisa:

    => GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
    (4k of binary data)

Agora que você tem o índice do packfile, você pode ver se o seu objeto esta nele — porque o índice lista os SHAs dos objetos contidos no packfile e os deslocamentos (offsets) desses objetos. Seu objeto está lá, então vá em frente e obtenha todo o packfile:

    => GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
    (13k of binary data)

Você tem o seu objeto árvore, então você continua navegando em seus commits. Eles todos estão dentro do packfile que você acabou de baixar, então você não precisa fazer mais solicitações para o servidor. Git faz o check out de uma cópia de trabalho do branch `master`, que foi apontada pela referência HEAD que você baixou no início.

Toda a saída deste processo é parecida com isto:

    $ git clone http://github.com/schacon/simplegit-progit.git
    Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
    got ca82a6dff817ec66f44342007202690a93763949
    walk ca82a6dff817ec66f44342007202690a93763949
    got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Getting alternates list for http://github.com/schacon/simplegit-progit.git
    Getting pack list for http://github.com/schacon/simplegit-progit.git
    Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
    Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
     which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
    walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    walk a11bef06a3f659402fe7563abf99ad00de2209e6

## O Protocolo Inteligente

O método HTTP é simples, mas um pouco ineficiente. Usar protocolos inteligentes é um método mais comum de transferência de dados. Estes protocolos têm um processo no sistema remoto que é inteligente em relação ao Git — ele pode ler dados locais e descobrir o que o cliente tem ou precisa e gera dados personalizados para ele. Existem dois conjuntos de processos de transferência de dados: um par para enviar dados (upload) e um par para download de dados.

### Fazendo Upload de Dados

Para fazer upload de dados para um processo remoto, Git usa os processos `send-pack` e `receive-pack`. O processo `send-pack` é executado no cliente e se conecta a um processo `receive-pack` no lado remoto.

Por exemplo, digamos que você execute `git push origin master` em seu projeto, e `origin` é definido como uma URL que usa o protocolo SSH. Git executa o processo `send-pack`, que inicia uma conexão SSH ao seu servidor. Ele tenta executar um comando no servidor remoto através de uma chamada SSH que é parecida com isto:

    $ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
    005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
    003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
    0000

O comando `git-receive-pack` imediatamente responde com uma linha para cada referência que tem atualmente — neste caso, apenas o branch `master` e seu SHA. A primeira linha também tem uma lista de recursos do servidor (aqui, `report-status` e `delete-refs`).

Cada linha se inicia com um valor hexadecimal de 4 bytes especificando quão longo o resto da linha é. Sua primeira linha começa com 005B, que é 91 em hexadecimal, o que significa que 91 bytes permanecem nessa linha. A próxima linha começa com 003e, que é 62, então você leu os 62 bytes restantes. A próxima linha é 0000, ou seja, o servidor terminou com a sua lista de referências.

Agora que ele sabe o estado do servidor, o seu processo `send-pack` determina que commits ele tem mas que o servidor não tem. Para cada referência que este push irá atualizar, o processo `send-pack` diz essa informação ao processo `receive-pack`. Por exemplo, se você está atualizando o branch `master` e está adicionando um branch `experiment`, a resposta do `send-pack` pode ser parecida com esta:

    0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
    00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
    0000

O valor SHA-1 de todos os '0's significa que nada estava lá antes — porque você está adicionando a referência de experiment. Se você estivesse apagando uma referência, você veria o oposto: tudo '0' no lado direito.

Git envia uma linha para cada referência que você está atualizando com o SHA antigo, o SHA novo, e a referência que está sendo atualizada. A primeira linha também tem as capacidades do cliente. Em seguida, o cliente faz upload de um packfile com todos os objetos que o servidor não tem ainda. Finalmente, o servidor responde com uma indicação de sucesso (ou falha):

    000Aunpack ok

### Fazendo Download de Dados

Quando você baixa os dados, os processos `fetch-pack` e `upload-pack` são usados. O cliente inicia um processo `fetch-pack` que se conecta a um processo `upload-pack` no lado remoto para negociar os dados que serão transferidos para a máquina local.

Existem diferentes maneiras de iniciar o processo `upload-pack` no repositório remoto. Você pode fazê-lo via SSH da mesma forma que o processo `receive-pack`. Você também pode iniciar o processo, através do daemon Git, que escuta em um servidor na porta 9418 por padrão. O processo `fetch-pack` envia dados que se parecem com isso para o servidor após se conectar:

    003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Ele começa com os 4 bytes que especificam a quantidade de dados enviados, seguido pelo comando a ser executado, seguido por um byte nulo e, em seguida, o hostname do servidor seguido por um ultimo byte nulo. O daemon Git verifica que o comando pode ser executado e que o repositório existe e tem permissões públicas. Se tudo estiver certo, ele aciona o processo `upload-pack` e envia o pedido para ele.

Se você estiver fazendo o fetch através de SSH, `fetch-pack` executa algo como isto:

    $ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

Em todo caso, depois que `fetch-pack` conectar, `upload-pack` devolve algo como isto:

    0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
      side-band side-band-64k ofs-delta shallow no-progress include-tag
    003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
    003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
    0000

Isto é muito semelhante a resposta de `receive-pack`, mas as funcionalidades são diferentes. Além disso, ele envia de volta a referência de HEAD para que o cliente saiba o que  deve ser verificado (check out) se este for um clone.

Neste momento, o processo `fetch-pack` verifica quais objetos ele possui e responde com os objetos de que necessita através do envio de "want" e do SHA que quer. Ele envia todos os objetos que ele já tem com "have" e também o SHA. No final da lista, ele escreve "done" para iniciar o processo `upload-pack` para começar a enviar o packfile dos dados que ele precisa:

    0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
    0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    0000
    0009done

Isto é um caso muito simples dos protocolos de transferência. Em casos mais complexos, o cliente suporta funcionalidades `multi_ack` ou `side-band`; mas este exemplo mostra o funcionamento de upload e download básico utilizado pelos processos de protocolo inteligentes.
