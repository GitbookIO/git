# Serviço Git

Para acesso público e não autenticado para leitura de seus projetos, você irá querer utilizar o protocolo Git ao invés do protocolo HTTP. A razão principal é a velocidade. O protocolo Git é muito mais eficiente e, portanto, mais rápido do que o protocolo HTTP, de modo que usá-lo irá poupar tempo de seus usuários.

Novamente, isso é para acesso não autenticado e somente leitura. Se seu servidor estiver fora da proteção de seu firewall, utilize o protocolo Git apenas para projetos que são publicamente visíveis na internet. Se o servidor estiver dentro de seu firewall, você pode usá-lo para projetos em que um grande número de pessoas ou computadores (integração contínua ou servidores de compilação) têm acesso somente leitura, e você não quer adicionar uma chave SSH para cada pessoa ou computador.

Em todo caso, o protocolo Git é relativamente fácil de configurar. Basicamente, você precisa executar este comando:

    git daemon --reuseaddr --base-path=/opt/git/ /opt/git/

`--reuseaddr` permite que o servidor reinicie sem esperar que conexões antigas atinjam um tempo limite, a opção `--base-path` permite que as pessoas clonem projetos sem especificar o caminho inteiro, e o caminho no final (`/opt/git/`) diz ao serviço Git onde procurar os repositórios para exportar. Se você estiver protegido por um firewall, você também vai precisar liberar a porta 9418 no computador em que estiver rodando o serviço Git.

Você pode iniciar este processo de diversas maneiras, dependendo do sistema operacional que você estiver usando. Em uma máquina Ubuntu, você pode usar um script Upstart. Por exemplo, neste arquivo

    /etc/event.d/local-git-daemon

você pode colocar este script:

    start on startup
    stop on shutdown
    exec /usr/bin/git daemon \
        --user=git --group=git \
        --reuseaddr \
        --base-path=/opt/git/ \
        /opt/git/
    respawn

Por razões de segurança, é altamente recomendável ter este serviço executado com um usuário com permissões de somente leitura para os repositórios – você pode fazer isso criando um novo usuário 'git-ro' e executar o serviço com ele. Por uma questão de simplicidade, vamos executá-lo com o usuário 'git', o mesmo que o Gitosis utiliza.

Quando você reiniciar sua máquina, seu serviço Git será iniciado automaticamente e reiniciará automaticamente se ele parar por algum motivo. Para executá-lo sem ter que reiniciar sua máquina, você pode usar este comando:

    initctl start local-git-daemon

Em outro Sistema Operacional, talvez você queira usar o `xinetd`, um script em seu sistema `sysvinit`, ou qualquer outra solução — contanto que você tenha o serviço Git rodando e monitorado de alguma forma.

A seguir, você tem que configurar seu servidor Gitosis para permitir o acesso não autenticado aos repositórios Git. Se você adicionar uma seção para cada repositório, você pode especificar quais você quer que seu serviço Git tenha permissão de leitura. Se quiser permitir o acesso para o seu projeto iphone usando o protocolo Git, acrescente no final do arquivo `gitosis.conf`:

    [repo iphone_project]
    daemon = yes

Quando você fizer um commit e um push neste projeto, seu serviço em execução deve começar a servir os pedidos para o projeto a qualquer um que tenha acesso à porta 9418 em seu servidor.

Se você decidir não usar Gitosis, mas quer configurar um servidor Git, você terá que executar isso em cada projeto que você deseje que o serviço Git disponibilize:

    $ cd /path/to/project.git
    $ touch git-daemon-export-ok

A presença desse arquivo diz ao Git que ele pode servir esse projeto sem autenticação.

Gitosis também pode controlar que projetos o GitWeb irá mostrar. Primeiro, você precisa adicionar algo como o seguinte no arquivo `/etc/gitweb.conf`:

    $projects_list = "/home/git/gitosis/projects.list";
    $projectroot = "/home/git/repositories";
    $export_ok = "git-daemon-export-ok";
    @git_base_url_list = ('git://gitserver');

Você pode controlar quais projetos GitWeb permite aos usuários navegar, adicionando ou removendo uma configuração `gitweb` no arquivo de configuração Gitosis. Por exemplo, se você deseja que o projeto do iPhone apareça no GitWeb, você pode definir a opção `repo` como abaixo:

    [repo iphone_project]
    daemon = yes
    gitweb = yes

Agora, se você fizer um commit e um push neste projeto, GitWeb automaticamente começará a mostrar seu projeto iphone.
