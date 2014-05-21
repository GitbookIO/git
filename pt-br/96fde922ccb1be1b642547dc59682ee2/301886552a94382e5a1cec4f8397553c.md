# Acesso Público

E se você quiser acesso anônimo de leitura ao seu projeto? Talvez ao invés de armazenar um projeto privado interno, você queira armazenar um projeto de código aberto. Ou talvez você tenha alguns servidores de compilação automatizados ou servidores de integração contínua que estão sempre sendo modificados, e você não queira gerar chaves SSH o tempo todo — você simplesmente quer permitir acesso de leitura anônimo.

Provavelmente o jeito mais fácil para pequenas configurações é rodar um servidor web estático com o documento raiz onde os seus repositórios Git estão, e então ativar o gancho (hook) `post-update` que mencionamos na primeira seção deste capítulo. Vamos trabalhar a partir do exemplo anterior. Vamos dizer que você tenha seus repositórios no diretório `/opt/git`, e um servidor Apache rodando na máquina. Novamente, você pode usar qualquer servidor web para fazer isso; mas para esse exemplo, vamos demonstrar algumas configurações básicas do Apache para te dar uma ideia do que você vai precisar:

Primeiro você tem que habilitar o gancho:

    $ cd project.git
    $ mv hooks/post-update.sample hooks/post-update
    $ chmod a+x hooks/post-update

Se você estiver usando uma versão do Git anterior à 1.6, o comando `mv` não é necessário — o Git começou a nomear os exemplos de gancho com o sufixo .sample apenas recentemente.

O que este gancho `post-update` faz? Ele se parece basicamente com isso aqui:

    $ cat .git/hooks/post-update
    #!/bin/sh
    exec git-update-server-info

Isto significa que quando você enviar para o servidor via SSH, o Git irá executar este comando para atualizar os arquivos necessários para fetch via HTTP.

Em seguida, você precisa adicionar uma entrada VirtualHost na sua configuração do Apache com a opção DocumentRoot apontando para o diretório raiz dos seus projetos Git. Aqui, assumimos que você tem uma entrada DNS para enviar `*.gitserver` para a máquina que você está usando para rodar tudo isso:

    <VirtualHost *:80>
        ServerName git.gitserver
        DocumentRoot /opt/git
        <Directory /opt/git/>
            Order allow, deny
            allow from all
        </Directory>
    </VirtualHost>

Você também precisará configurar o grupo de usuários dos diretórios em `/opt/git` para `www-data` para que o seu servidor web possa ler os repositórios, pelo fato do script CGI do Apache rodar (padrão) como este usuário:

    $ chgrp -R www-data /opt/git

Quando você reiniciar o Apache, você deve poder clonar os repositórios dentro daquele diretório especificando a URL para o projeto:

    $ git clone http://git.gitserver/project.git

Deste jeito, você pode configurar um servidor HTTP com acesso de leitura para os seus projetos para vários usuários em minutos. Outra opção simples para acesso público sem autenticação é iniciar um daemon Git, embora isso necessite que você daemonize o processo - iremos cobrir esta opção na próxima seção, se você preferir esta rota.
