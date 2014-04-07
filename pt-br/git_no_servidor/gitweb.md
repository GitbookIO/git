# GitWeb

Agora que você tem acesso de leitura/escrita e apenas leitura para o seu projeto, você pode querer configurar um visualizador simples baseado em web. Git vem com um script CGI chamado GitWeb que normalmente é usado para isso. Você pode ver o GitWeb em uso em sites como `http://git.kernel.org` (veja a Figura 4-1).


![](http://git-scm.com/figures/18333fig0401-tn.png)

Figure 4-1. A interface de usuário baseada em web GitWeb.

Se você quiser ver como GitWeb aparecerá para o seu projeto, Git vem com um comando para disparar uma instância temporária se você tem um servidor leve no seu sistema como `lighttpd` ou `webrick`. Em máquinas Linux, `lighttpd` normalmente está instalado, então você deve conseguir fazê-lo funcionar digitando `git instaweb` no diretório do seu projeto. Se você está usando um Mac, Leopard vem com Ruby pré-instalado, então `webrick` é sua melhor aposta. Para iniciar `instaweb` com um manipulador diferente de lighttpd, você pode rodá-lo com a opção `--httpd`.

    $ git instaweb --httpd=webrick
    [2009-02-21 10:02:21] INFO  WEBrick 1.3.1
    [2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]

Isso inicia um servidor HTTPD na porta 1234 e então automaticamente inicia um navegador web que abre naquela página. Quando você tiver terminado e quiser desligar o servidor, você pode rodar o mesmo comando com a opção `--stop`:

    $ git instaweb --httpd=webrick --stop

Se você quer rodar a interface web num servidor o tempo inteiro para a sua equipe ou para um projeto open source que você esteja hospedando, você vai precisar configurar o script CGI para ser servido pelo seu servidor web normal. Algumas distribuições Linux têm um pacote `gitweb` que você deve ser capaz de instalar via `apt` ou `yum`, então você pode tentar isso primeiro. Nós procederemos na instalação do GitWeb manualmente bem rápido. Primeiro, você precisa pegar o código-fonte do Git, o qual o GitWeb acompanha, e gerar o script CGI personalizado:

    $ git clone git://git.kernel.org/pub/scm/git/git.git
    $ cd git/
    $ make GITWEB_PROJECTROOT="/opt/git" \
            prefix=/usr gitweb
    $ sudo cp -Rf gitweb /var/www/

Note que você precisa avisar ao comando onde encontrar os seus repositórios Git com a variável `GITWEB_PROJECTROOT`. Agora, você precisa fazer o Apache usar CGI para aquele script, para o qual você pode adicionar um VirtualHost:

    <VirtualHost *:80>
        ServerName gitserver
        DocumentRoot /var/www/gitweb
        <Directory /var/www/gitweb>
            Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
            AllowOverride All
            order allow,deny
            Allow from all
            AddHandler cgi-script cgi
            DirectoryIndex gitweb.cgi
        </Directory>
    </VirtualHost>

Novamente, GitWeb pode ser servido com qualquer servidor CGI. Agora, você poderá visitar `http://gitserver/` para visualizar seus repositórios online, e você pode usar `http://git.gitserver` para efetuar clone e fetch nos seus repositórios via HTTP.
