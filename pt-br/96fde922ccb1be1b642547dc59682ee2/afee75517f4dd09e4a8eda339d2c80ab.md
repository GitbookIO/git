# Configurando o Servidor

Vamos agora configurar o acesso SSH no lado servidor. Neste exemplo, você irá autenticar seus usuários pelo método das `authorized_keys`. Também assumimos que você esteja rodando uma distribuição padrão do Linux como o Ubuntu. Primeiramente, crie um usuário 'git' e um diretório `.ssh` para ele.

    $ sudo adduser git
    $ su git
    $ cd
    $ mkdir .ssh

A seguir, você precisará adicionar uma chave pública de algum desenvolvedor no arquivo `authorized_keys` do usuário 'git'. Vamos assumir que você recebeu algumas chaves por e-mail e as salvou em arquivos temporários. Novamente, as chaves públicas são algo parecido com isso aqui:

    $ cat /tmp/id_rsa.john.pub
    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
    ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
    Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
    Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
    O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
    dAv8JggJICUvax2T9va5 gsg-keypair

Você tem apenas que salvá-las no arquivo `authorized_keys`:

    $ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
    $ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
    $ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys

Agora, você pode configurar um repositório vazio para eles executando o comando `git init` com a opção `--bare`, que inicializa o repositório sem um diretório de trabalho:

    $ cd /opt/git
    $ mkdir project.git
    $ cd project.git
    $ git --bare init

Assim, John, Josie ou Jessica podem enviar a primeira versão dos seus projetos para o repositório simplesmente adicionado-o como um remoto e enviando (push) uma branch. Atente que alguém deve acessar o servidor e criar um repositório limpo toda vez que eles queiram adicionar um projeto. Vamos usar `gitserver` como o nome do servidor no qual você configurou o usuário 'git' e o repositório. Se você estiver rodando ele internamente, e você configurou uma entrada DNS para `gitserver` apontando para esta máquina, então você pode simplesmente seguir os comandos abaixo:

    # on Johns computer
    $ cd myproject
    $ git init
    $ git add .
    $ git commit -m 'initial commit'
    $ git remote add origin git@gitserver:/opt/git/project.git
    $ git push origin master

Neste momento, os outros podem clonar e enviar as mudanças facilmente:

    $ git clone git@gitserver:/opt/git/project.git
    $ vim README
    $ git commit -am 'fix for the README file'
    $ git push origin master

Com este método, você pode rapidamente ter um servidor com acesso de leitura e escrita rodando para os desenvolvedores.

Como uma precaução extra, você pode facilmente restringir o usuário 'git' para executar apenas atividades Git com uma shell limitada chamada `git-shell` que vem com o Git. Se você configurar ela como a shell do seu usuário 'git', o usuário não poderá ter acesso shell normal ao seu servidor. Para usar esta característica, especifique `git-shell` ao invés de bash ou csh no login shell do usuário. Para fazê-lo, você provavelmente vai ter que editar o arquivo `/etc/passwd`:

    $ sudo vim /etc/passwd

No final, você deve encontrar uma linha parecida com essa:

    git:x:1000:1000::/home/git:/bin/sh

Modifique `/bin/sh` para `/usr/bin/git-shell` (ou execute `which git-shell` para ver onde ele está instalado). A linha modificada deve se parecer com a de abaixo:

    git:x:1000:1000::/home/git:/usr/bin/git-shell

Agora, o usuário 'git' pode apenas usar a conexão SSH para enviar e puxar repositórios Git e não pode se conectar via SSH na máquina. Se você tentar, você verá uma mensagem de rejeição parecida com a seguinte:

    $ ssh git@gitserver
    fatal: What do you think I am? A shell?
    Connection to gitserver closed.
