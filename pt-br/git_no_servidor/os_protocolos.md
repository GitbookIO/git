# Os Protocolos

O Git pode usar quatro protocolos principais para transferir dados: Local, Secure Shell (SSH), Git e HTTP. Aqui discutiremos o que eles são e em quais circunstâncias básicas você gostaria (ou não) de utilizá-los.

É importante perceber que com exceção dos protocolos HTTP, todos estes requerem que o Git esteja instalado e rodando no servidor.

## Protocolo Local

O protocolo mais básico é o _Protocolo local_ (Local protocol), em que o repositório remoto está em outro diretório no disco. Isto é frequentemente utilizado se todos no seu time tem acesso a um sistema de arquivos compartilhados como um NFS montado, ou no caso menos provável de que todos acessem o mesmo computador. Este último caso não seria ideal, porque todas as instâncias do seu repositório de código estariam no mesmo computador, fazendo com que uma perda catastrófica seja muito mais provável.

Se você tem um sistema de arquivos compartilhado, então você pode clonar, enviar para e receber de um repositório local baseado em arquivos. Para clonar um repositório desses ou para adicionar um como remoto de um projeto existente, use o caminho para o repositório como a URL. Por exemplo, para clonar um diretório local, você pode rodar algo como:

    $ git clone /opt/git/project.git

Ou você pode fazer isso:

    $ git clone file:///opt/git/project.git

O Git opera de forma ligeiramente diferente se você explicitar `file://` no começo da URL. Se você apenas especificar o caminho, o Git tenta usar hardlinks ou copiar diretamente os arquivos que necessita. Se você especificar `file://`, o Git aciona os processos que normalmente utiliza para transferir dados através de uma rede, o que é geralmente uma forma de transferência bem menos eficiente. A principal razão para especificar o prefixo `file://` é se você quer uma cópia limpa do repositório com referências e objetos estranhos deixados de lado — geralmente depois de importar de outro sistema de controle de versões ou algo similar (ver Capítulo 9 para tarefas de manutenção). Usaremos o caminho normal aqui pois isto é quase sempre mais rápido.

Para adicionar um repositório local para um projeto Git existente, você pode rodar algo assim:

    $ git remote add local_proj /opt/git/project.git

Então você pode enviar para e receber deste remoto como se você estivesse fazendo isto através de uma rede.

### Os Prós

Os prós de repositórios baseados em arquivos são que eles são simples e usam permissões de arquivo e acessos de rede existentes. Se você já tem um sistema de arquivos compartilhados ao qual todo o seu time tem acesso, configurar um repositório é muito fácil. Você coloca o repositório vazio em algum lugar onde todos tem acesso compartilhado e configura as permissões de leitura/escrita como você faria para qualquer outro diretório compartilhado. Discutiremos como exportar uma cópia de repositório vazio com este objetivo na próxima seção, “Colocando Git em um Servidor.”

Esta é também uma boa opção para rapidamente pegar trabalhos do diretório em que outra pessoa estiver trabalhando. Se você e seu colega estiverem trabalhando no mesmo projeto e ele quiser que você olhe alguma coisa, rodar um comando como `git pull /home/john/project` é frequentemente mais fácil do que ele enviar para um servidor remoto e você pegar de lá.

### Os Contras

Os contras deste método são que o acesso compartilhado é geralmente mais difícil de configurar e acessar de múltiplos lugares do que via conexão básica de rede. Se você quiser enviar do seu laptop quando você está em casa, você tem que montar um disco remoto, o que pode ser difícil e lento comparado com acesso via rede.

É também importante mencionar que isto não é necessariamente a opção mais rápida se você está usando uma montagem compartilhada de algum tipo. Um repositório local é rápido apenas se você tem acesso rápido aos dados. Um repositório em NFS é frequentemente mais lento do que acessar um repositório com SSH no mesmo servidor, permitindo ao Git rodar discos locais em cada sistema.

## O Protocolo SSH

Provavelmente o protocolo mais comum de transporte para o Git é o SSH. Isto porque o acesso SSH aos servidores já está configurado na maior parte dos lugares — e se não está, é fácil fazê-lo. O SSH é também o único protocolo para redes em que você pode facilmente ler (do servidor) e escrever (no servidor). Os outros dois protocolos de rede (HTTP e Git) são geralmente somente leitura, então mesmo se você os tiver disponíveis para as massas, você ainda precisa do SSH para seus próprios comandos de escrita. O SSH é também um protocolo de rede autenticado; e já que ele é ubíquo, é geralmente fácil de configurar e usar.

Para clonar um repositório Git através de SSH, você pode especificar uma URL ssh:// deste jeito:

    $ git clone ssh://user@server/project.git

Ou você pode deixar de especificar o protocolo — O Git assume SSH se você não for explicito:
    
    $ git clone user@server:project.git

Você também pode deixar de especificar um usuário, e o Git assume o usuário que você estiver usando atualmente.

### Os Prós

Os prós de usar SSH são muitos. Primeiro, você basicamente tem que usá-lo se você quer acesso de escrita autenticado através de uma rede. Segundo, o SSH é relativamente simples de configurar — Serviços (Daemons) SSH são muito comuns, muitos administradores de rede tem experiência com eles, e muitas distribuições de SOs estão configuradas com eles ou tem ferramentas para gerenciá-los. Em seguida, o acesso através de SSH é seguro — toda transferência de dados é criptografada e autenticada. Por último, como os protocolos Git e Local, o SSH é eficiente, compactando os dados da melhor forma possível antes de transferi-los.

### Os Contras

O aspecto negativo do SSH é que você não pode permitir acesso anônimo do seu repositório através dele. As pessoas tem que acessar o seu computador através de SSH para acessá-lo, mesmo que apenas para leitura, o que não faz com que o acesso por SSH seja encorajador para projetos de código aberto. Se você o está usando apenas dentro de sua rede corporativa, o SSH pode ser o único protocolo com o qual você terá que lidar. Se você quiser permitir acesso anônimo somente leitura para seus projetos, você terá que configurar o SSH para envio (push over) mas configurar outra coisa para que as pessoas possam receber (pull over).

## O Protocolo Git

O próximo é o protocolo Git. Este é um daemon especial que vem no mesmo pacote que o Git; ele escuta em uma porta dedicada (9418) que provê um serviço similar ao do protocolo SSH, mas absolutamente sem nenhuma autenticação. Para que um repositório seja disponibilizado via protocolo Git, você tem que criar o arquivo `git-daemon-export-ok` — o daemon não disponibilizará um repositório sem este arquivo dentro — mas além disso não há nenhuma segurança. Ou o repositório Git está disponível para todos clonarem ou não. Isto significa que geralmente não existe envio (push) sobre este protocolo. Você pode habilitar o acesso a envio; mas dada a falta de autenticação, se você ativar o acesso de envio, qualquer um na internet que encontre a URL do seu projeto poderia enviar (push) para o seu projeto. É suficiente dizer que isto é raro.

### Os Prós

O protocolo Git é o mais rápido entre os disponíveis. Se você está servindo muito tráfego para um projeto público ou servindo um projeto muito grande que não requer autenticação para acesso de leitura, é provável que você vai querer configurar um daemon Git para servir o seu projeto. Ele usa o mesmo mecanismo de transmissão de dados que o protocolo SSH, mas sem o tempo gasto na criptografia e autenticação.

### Os Contras

O lado ruim do protocolo Git é a falta de autenticação. É geralmente indesejável que o protocolo Git seja o único acesso ao seu projeto. Geralmente, você o usará em par com um acesso SSH para os poucos desenvolvedores com acesso de envio (push) e todos os outros usariam `git://` para acesso somente leitura. É também provavelmente o protocolo mais difícil de configurar. Ele precisa rodar seu próprio daemon, que é específico — iremos olhar como configurar um na seção “Gitosis” deste capítulo — ele requer a configuração do `xinetd` ou algo similar, o que não é sempre fácil. Ele requer também acesso a porta 9418 via firewall, o que não é uma porta padrão que firewalls corporativos sempre permitem. Por trás de grandes firewalls corporativos, esta porta obscura está comumente bloqueada.

## O Protocolo HTTP/S Protocol

Por último temos o protocolo HTTP. A beleza do protocolo HTTP ou HTTPS é a simplicidade em configurar. Basicamente, tudo o que você precisa fazer é colocar o repositório Git do jeito que ele é em uma pasta acessível pelo Servidor HTTP e configurar o gancho (hook) `post-update`, e estará pronto (veja o *Capítulo 7* para detalhes dos hooks do Git). Neste momento, qualquer um com acesso ao servidor web no qual você colocou o repositório também pode clonar o repositório. Para permitir acesso de leitura ao seu repositório usando HTTP, execute o seguinte:

    $ cd /var/www/htdocs/
    $ git clone --bare /path/to/git_project gitproject.git
    $ cd gitproject.git
    $ mv hooks/post-update.sample hooks/post-update
    $ chmod a+x hooks/post-update

E pronto. O gancho `post-update` que vem com o Git executa o comando apropriado (`git update-server-info`) para que fetch e clone via HTTP funcionem corretamente. Este comando é executado quando você envia para o repositório usando `push` via SSH; então, outros podem clonar via algo como

    $ git clone http://example.com/gitproject.git

Neste caso particular, estamos usando o caminho `/var/www/htdocs` que é comum para configurações Apache, mas você pode usar qualquer servidor web estático — apenas coloque o caminho do repositório. Os dados no Git são servidos como arquivos estáticos básicos (veja o *Capítulo 9* para mais detalhes sobre como exatamente eles são servidos).

É possível fazer o Git enviar via HTTP também, embora esta técnica não seja muito usada e requer que você configure WebDav com parâmetros complexos. Pelo fato de ser usado raramente, não mostraremos isto neste livro. Se você está interessado em usar os protocolos HTTP-push, você pode ler sobre preparação de um repositório para este propósito em `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`. Uma coisa legal sobre fazer o Git enviar via HTTP é que você pode usar qualquer servidor WebDAV, sem quaisquer características Git; então, você pode usar esta funcionalidade se o seu provedor web suporta WebDAV com permissão de escrita para o seu web site.

### Os Prós

O lado bom de usar protocolo HTTP é que ele é fácil de configurar. Executar o punhado de comandos obrigatórios lhe provê um jeito simples de fornecer ao mundo acesso ao seu repositório Git. Você só precisa de alguns minutos. O protocolo HTTP também não consome muitos recursos no servidor. Pelo fato de usar apenas um servidor HTTP estático para todo o dado, um servidor Apache normal pode servir em média milhares de arquivos por segundo — é difícil sobrecarregar até mesmo um servidor pequeno.

Você também pode servir seus repositórios com apenas acesso de leitura via HTTPS, o que significa que você pode criptografar o conteúdo transferido; ou pode ir até o ponto de fazer seus usuários usarem certificados SSL assinados. Geralmente, se você está indo até este ponto, é mais fácil usar as chaves públicas SSH; mas pode ser uma solução melhor em casos específicos usar certificados SSL assinados ou outro método de autenticação HTTP para acesso de leitura via HTTPS.

Outra coisa legal é que HTTP é um protocolo tão comumente usado que firewalls corporativos são normalmente configurados para permitir tráfego por esta porta.

### Os Contras

O lado ruim de servir seu repositório via HTTP é que ele é relativamente ineficiente para o usuário. Geralmente demora muito mais para clonar ou fazer um fetch do repositório, e você frequentemente tem mais sobrecarga de rede e volume de transferência via HTTP do que com outros protocolos de rede. Pelo fato de não ser inteligente sobre os dados que você precisa — não tem um trabalho dinâmico por parte do servidor nestas transações — o protocolo HTTP é frequentemente referido como o protocolo _burro_. Para mais informações sobre as diferenças em eficiência entre o protocolo HTTP e outros protocolos, veja o *Capítulo 9*.
