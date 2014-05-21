# Obtendo um Repositório Git

Você pode obter um projeto Git utilizando duas formas principais. A primeira faz uso de um projeto ou diretório existente e o importa para o Git. A segunda clona um repositório Git existente a partir de outro servidor.

## Inicializando um Repositório em um Diretório Existente

Caso você esteja iniciando o monitoramento de um projeto existente com Git, você precisa ir para o diretório do projeto e digitar

    $ git init

Isso cria um novo subdiretório chamado `.git` que contem todos os arquivos necessários de seu repositório — um esqueleto de repositório Git. Neste ponto, nada em seu projeto é monitorado. (Veja o *Capítulo 9* para maiores informações sobre quais arquivos estão contidos no diretório `.git` que foi criado.)

Caso você queira começar a controlar o versionamento dos arquivos existentes (diferente de um diretório vazio), você provavelmente deve começar a monitorar esses arquivos e fazer um commit inicial. Você pode realizar isso com poucos comandos `git add` que especificam quais arquivos você quer monitorar, seguido de um commit:

    $ git add *.c
    $ git add README
    $ git commit -m 'initial project version'

Bem, nós iremos repassar esses comandos em um momento. Neste ponto, você tem um repositório Git com arquivos monitorados e um commit inicial.

## Clonando um Repositório Existente

Caso você queira copiar um repositório Git já existente — por exemplo, um projeto que você queira contribuir — o comando necessário é `git clone`. Caso você esteja familiarizado com outros sistemas VCS, tais como Subversion, você perceberá que o comando é `clone` e não `checkout`. Essa é uma diferença importante — Git recebe uma cópia de quase todos os dados que o servidor possui. Cada versão de cada arquivo no histórico do projeto é obtida quando você roda `git clone`. De fato, se o disco do servidor ficar corrompido, é possível utilizar um dos clones em qualquer cliente para reaver o servidor no estado em que estava quando foi clonado (você pode perder algumas características do servidor, mas todos os dados versionados estarão lá — veja o *Capítulo 4* para maiores detalhes).

Você clona um repositório com `git clone [url]`. Por exemplo, caso você queria clonar a biblioteca Git do Ruby chamada Grit, você pode fazê-lo da seguinte forma:

    $ git clone git://github.com/schacon/grit.git

Isso cria um diretório chamado `grit`, inicializa um diretório `.git`dentro deste, obtém todos os dados do repositório e verifica a cópia atual da última versão. Se você entrar no novo diretório `grit`, você verá todos os arquivos do projeto nele, pronto para serem editados ou utilizados. Caso você queira clonar o repositório em um diretório diferente de grit, é possível especificar esse diretório utilizando a opção abaixo:

    $ git clone git://github.com/schacon/grit.git mygrit

Este comando faz exatamente a mesma coisa que o anterior, mas o diretório alvo será chamado `mygrit`.

O Git possui diversos protocolos de transferência que você pode utilizar. O exemplo anterior utiliza o protocolo `git://`, mas você também pode ver `http(s)://` ou `user@server:/path.git`, que utilizam o protocolo de transferência SSH. No *Capítulo 4*, introduziremos todas as opções disponíveis com as quais o servidor pode ser configurado para acessar o seu repositório Git, e os prós e contras de cada uma.
