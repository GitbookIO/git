# Instalando Git

Vamos entender como utilizar o Git. Primeiramente você deve instalá-lo. Você pode obtê-lo de diversas formas; as duas mais comuns são instalá-lo a partir do fonte ou instalar um package (pacote) existente para sua plataforma.

## Instalando a Partir do Fonte

Caso você possa, é geralmente útil instalar o Git a partir do fonte, porque será obtida a versão mais recente. Cada versão do Git tende a incluir melhoras na UI, sendo assim, obter a última versão é geralmente o melhor caminho caso você sinta-se confortável em compilar o software a partir do fonte. Também acontece que diversas distribuições Linux contêm pacotes muito antigos; sendo assim, a não ser que você tenha uma distro (distribuição) muito atualizada ou está utilizando backports, instalar a partir do fonte pode ser a melhor aposta.

Para instalar o Git, você precisa ter as seguintes bibliotecas que o Git depende: curl, zlib, openssl, expat e libiconv. Por exemplo, se você usa um sistema que tem yum (tal como o Fedora) ou apt-get (tais como os sistemas baseados no Debian), você pode utilizar um desses comandos para instalar todas as dependências:

    $ yum install curl-devel expat-devel gettext-devel \
      openssl-devel zlib-devel

    $ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
      libz-dev libssl-dev
    
Quando você tiver todas as dependências necessárias, você pode continuar e baixar o snapshot mais recente a partir do web site do Git:

    http://git-scm.com/download
    
Então, compilá-lo e instalá-lo:

    $ tar -zxf git-1.7.2.2.tar.gz
    $ cd git-1.7.2.2
    $ make prefix=/usr/local all
    $ sudo make prefix=/usr/local install

Após a conclusão, você também pode obter o Git via o próprio Git para atualizações:

    $ git clone git://git.kernel.org/pub/scm/git/git.git
    
## Instalando no Linux

Se você quiser instalar o Git no Linux via um instalador binário, você pode fazê-lo com a ferramenta de gerenciamento de pacotes (packages) disponível na sua distribuição. Caso você esteja no Fedora, você pode usar o yum:

    $ yum install git-core

Ou se você estiver em uma distribuição baseada no Debian, como o Ubuntu, use o apt-get:

    $ apt-get install git

## Instalando no Mac

Existem duas formas fáceis de se instalar Git em um Mac. A mais fácil delas é usar o instalador gráfico do Git, que você pode baixar da página do Google Code (veja Figura 1-7):

    http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Figura 1-7. Instalador Git OS X.

A outra forma comum é instalar o Git via MacPorts (`http://www.macports.org`). Se você tem o MacPOrts instalado, instale o Git via

    $ sudo port install git-core +svn +doc +bash_completion +gitweb

Você não precisa adicionar todos os extras, mas você provavelmente irá querer incluir o +svn caso você tenha que usar o Git com repositórios Subversion (veja Capítulo 8).

## Instalando no Windows

Instalar o Git no Windows é muito fácil. O projeto msysgit tem um dos procedimentos mais simples de instalação. Simplesmente baixe o arquivo exe do instalador a partir da página do GitHub e execute-o:

    http://msysgit.github.com

Após concluir a instalação, você terá tanto uma versão command line (linha de comando, incluindo um cliente SSH que será útil depois) e uma GUI padrão.
