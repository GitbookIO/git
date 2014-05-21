# Gitosis

Manter as chaves públicas de todos os usuários no arquivo `authorized_keys` para acesso funciona bem somente por um tempo. Quando você tem centenas de usuários, gerenciar esse processo se torna bastante difícil. Você precisa acessar o servidor via shell toda vez, e não existe controle de acesso - todos no arquivo têm acesso de leitura e escrita para cada projeto.

Nessa hora, talvez você queira passar a usar um software largamente utilizado chamado Gitosis. Gitosis é basicamente um conjunto de scripts que te ajudam a gerenciar o arquivo `authorized_keys`, bem como implementar alguns controles de acesso simples. A parte realmente interessante é que a Interface
de Usuário dessa ferramenta utilizada para adicionar pessoas e determinar o controle de acessos não é uma interface web, e sim um repositório Git especial. Você configura a informação naquele projeto; e quando você executa um push nele, Gitosis reconfigura o servidor baseado nas configurações que você fez, o que é bem legal.

Instalar o Gitosis não é a tarefa mais simples do mundo, mas também não é tão difícil. É mais fácil utilizar um servidor Linux para fazer isso — os exemplos a seguir utilizam um servidor com Ubuntu 8.10.

Gitosis requer algumas ferramentas Python, então antes de tudo você precisa instalar o pacote Python setuptools, o qual Ubuntu provê sob o nome de python-setuptools:

    $ apt-get install python-setuptools

Depois, você clona e instala Gitosis do site principal do projeto:

    $ git clone https://github.com/tv42/gitosis.git
    $ cd gitosis
    $ sudo python setup.py install

Ao fazer isso, você instala alguns executáveis que Gitosis vai utilizar. A seguir, Gitosis vai querer colocar seus repositórios em `/home/git`, o que não tem nenhum problema. Mas você já configurou os seus repositórios em `/opt/git`, então, ao invés de reconfigurar tudo, você simplesmente cria um link simbólico:

    $ ln -s /opt/git /home/git/repositories

Gitosis vai gerenciar as suas chaves por você, então você precisa remover o arquivo atual, adicionar as chaves novamente, e deixar Gitosis controlar o arquivo `authorized_keys` automaticamente. Por enquanto, tire o arquivo `authorized_keys`:

    $ mv /home/git/.ssh/authorized_keys /home/git/.ssh/ak.bak

Em seguida, você precisa ativar o seu shell novamente para o usuário 'git', caso você o tenha mudado para o comando `git-shell`. As pessoas ainda não vão conseguir logar no servidor, porém Gitosis vai controlar isso para você. Então, vamos alterar essa linha no seu arquivo `/etc/passwd`

    git:x:1000:1000::/home/git:/usr/bin/git-shell

de volta para isso:

    git:x:1000:1000::/home/git:/bin/sh

Agora é a hora de inicializar o Gitosis. Você faz isso executando o comando `gitosis-init` com a sua chave pública pessoal. Se a sua chave pública não está no servidor, você vai ter que copiá-la para lá:

    $ sudo -H -u git gitosis-init < /tmp/id_dsa.pub
    Initialized empty Git repository in /opt/git/gitosis-admin.git/
    Reinitialized existing Git repository in /opt/git/gitosis-admin.git/

Isso permite ao usuário com aquela chave modificar o repositório Git principal que controla o Gitosis. Em seguida, você precisa configurar manualmente o bit de execução no script `post-update` para o seu novo repositório de controle.

    $ sudo chmod 755 /opt/git/gitosis-admin.git/hooks/post-update

Sua configuração está pronta. Se as configurações estão todas corretas, você pode tentar acessar o seu servidor via SSH com o usuário cuja chave pública você adicionou para inicializar o Gitosis. Você deve ver algo assim:

    $ ssh git@gitserver
    PTY allocation request failed on channel 0
    fatal: unrecognized command 'gitosis-serve schacon@quaternion'
      Connection to gitserver closed.

Essa mensagem significa que o Gitosis reconhece você mas te desconectou porque você não está tentando fazer nenhum comando Git. Então, vamos fazer um comando do Git — você vai clonar o repositório central do Gitosis:

    # on your local computer
    $ git clone git@gitserver:gitosis-admin.git

Agora, você tem um diretório chamado `gitosis-admin`, o qual tem duas grandes partes:

    $ cd gitosis-admin
    $ find .
    ./gitosis.conf
    ./keydir
    ./keydir/scott.pub

O arquivo `gitosis.conf` é o arquivo de controle a ser usado para especificar usuários, repositórios e permissões. O diretório `keydir` é onde você armazena as chaves públicas de todos os usuários que têm algum tipo de acesso aos seus repositórios — um arquivo por usiário. O nome do arquivo em `key_dir` (no exemplo anterir, `scott.pub`) será diferente para você — Gitosis pega o nome da descrição no final da chave pública que foi importada com o script `gitosis-init`.

Se você olhar no arquivo `gitosis.conf`, ele deveria apenas especificar informações sobre o projeto `gitosis-admin` que você acabou de clonar:

    $ cat gitosis.conf
    [gitosis]

    [group gitosis-admin]
    writable = gitosis-admin
    members = scott

Ele mostra que o usuário 'scott' — o usuário cuja chave pública foi usada para inicializar o Gitosis — é o único que tem acesso ao projeto `gitosis-admin`.

Agora, vamos adicionar um novo projeto para você. Você vai adicionar uma nova seção chamada `mobile` onde você vai listar os desenvolvedores na sua equipe de desenvolvimento mobile e projetos que esses desenvolvedores precisam ter acesso. Já que 'scott' é o único usuário no sistema nesse momento, você vai adicioná-lo como o único membro, e você vai criar um novo projeto chamado `iphone_project` para começar:

    [group mobile]
    writable = iphone_project
    members = scott

Sempre qur você fizer alterações no projeto `gitosis-admin`, você vai precisar commitar as mudanças e enviá-las (push) de volta para o servidor, para que elas tenham efeito:

    $ git commit -am 'add iphone_project and mobile group'
    [master]: created 8962da8: "changed name"
     1 files changed, 4 insertions(+), 0 deletions(-)
    $ git push
    Counting objects: 5, done.
    Compressing objects: 100% (2/2), done.
    Writing objects: 100% (3/3), 272 bytes, done.
    Total 3 (delta 1), reused 0 (delta 0)
    To git@gitserver:/opt/git/gitosis-admin.git
       fb27aec..8962da8  master -> master

Você pode fazer o seu primeiro push para o novo projeto `iphone_project` adicionando o seu servidor como um repositório remoto da sua versão local do projeto e fazendo um push. Você não precisa mais criar um repositório vazio (bare) manualmente para novos projetos no servidor — Gitosis os cria automaticamente quando ele vê o seu primeiro push:

    $ git remote add origin git@gitserver:iphone_project.git
    $ git push origin master
    Initialized empty Git repository in /opt/git/iphone_project.git/
    Counting objects: 3, done.
    Writing objects: 100% (3/3), 230 bytes, done.
    Total 3 (delta 0), reused 0 (delta 0)
    To git@gitserver:iphone_project.git
     * [new branch]      master -> master

Note que você não precisa especificar o caminho (na verdade, fazer isso não vai funcionar), apenas uma vírgula e o nome do projeto — Gitosis o encontra para você.

Você quer trabalhar nesse projeto com os seus amigos, então você vai ter que adicionar novamente as chaves públicas deles. Mas, ao invés de acrescentá-las manualmente ao arquivo `~/.ssh/authorized_keys` no seu servidor, você vai adicioná-las, uma chave por arquivo, no diretório `keydir`. A forma com que você nomeia as chaves determina como você se refere aos usuários no arquivo `gitosis.conf`. Vamos adicionar novamente as chaves públicas para John, Josie e Jessica:

    $ cp /tmp/id_rsa.john.pub keydir/john.pub
    $ cp /tmp/id_rsa.josie.pub keydir/josie.pub
    $ cp /tmp/id_rsa.jessica.pub keydir/jessica.pub

Agora você pode adicioná-los à sua equipe 'mobile' para que eles possam ter acesso de leitura e escrita no projeto `iphone_project`:

    [group mobile]
    writable = iphone_project
    members = scott john josie jessica

Depois que você commitar e enviar essa mudança, todos os quatro usuários serão capazes de ler e escrever naquele projeto.

Gitosis também tem um simples controles de acesso. Se você quer que John tenha apenas acesso de leitura para esse projeto, você pode fazer desta forma:

    [group mobile]
    writable = iphone_project
    members = scott josie jessica

    [group mobile_ro]
    readonly = iphone_project
    members = john

Agora John pode clonar o projeto e receber atualizações, porém o Gitosis não vai deixá-lo enviar as suas atualizações ao projeto. Você pode criar quantos desses grupos você queira, cada um contendo usuários e projetos diferentes. Você também pode especificar outro grupo como membro (usando `@` como prefixo), para herdar todos os seus membros automaticamente.

    [group mobile_committers]
    members = scott josie jessica

    [group mobile]
    writable  = iphone_project
    members   = @mobile_committers

    [group mobile_2]
    writable  = another_iphone_project
    members   = @mobile_committers john

Se você tiver quaisquer problemas, pode ser útil adicionar `loglevel=DEBUG` abaixo da seção `[gitosis]`. Se você perdeu o acesso de push por enviar uma configuração errada, você pode consertar o arquivo manualmente no servidor em`/home/git/.gitosis.conf` — o arquivo do qual Gitosis lê suas informações. Um push para o projeto pega o arquivo `gitosis.conf` que você acabou de enviar e o coloca lá. Se você editar esse arquivo manualmente, ele permanece dessa forma até o próximo push bem sucedido para o projeto `gitosis.conf`.
