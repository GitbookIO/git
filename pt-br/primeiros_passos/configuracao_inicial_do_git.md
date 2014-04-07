# Configuração Inicial do Git

Agora que você tem o Git em seu sistema, você pode querer fazer algumas coisas para customizar seu ambiente Git. Você só precisa fazer uma vez; as configurações serão mantidas entre atualizações. Você também poderá alterá-las a qualquer momento executando os comandos novamente.

Git vem com uma ferramenta chamada git config que permite a você ler e definir variáveis de configuração que controlam todos os aspectos de como o Git parece e opera. Essas variáveis podem ser armazenadas em três lugares diferentes:

* arquivo `/etc/gitconfig`: Contém valores para todos usuários do sistema e todos os seus repositórios. Se você passar a opção `--system` para `git config`, ele lerá e escreverá a partir deste arquivo especificamente.
* arquivo `~/.gitconfig`: É específico para seu usuário. Você pode fazer o Git ler e escrever a partir deste arquivo especificamente passando a opção `--global`.
* arquivo de configuração no diretório git (ou seja, `.git/config`) de qualquer repositório que você está utilizando no momento: Específico para aquele único repositório. Cada nível sobrepõem o valor do nível anterior, sendo assim valores em `.git/config` sobrepõem aqueles em `/etc/gitconfig`.

Em sistemas Windows, Git procura pelo arquivo `.gitconfig` no diretório `$HOME` (`C:\Documents and Settins\$USER` para a maioria das pessoas). Também procura por /etc/gitconfig, apesar de que é relativo à raiz de MSys, que é o local onde você escolheu instalar o Git no seu sistema Windows quando executou o instalador.

## Sua Identidade

A primeira coisa que você deve fazer quando instalar o Git é definir o seu nome de usuário e endereço de e-mail. Isso é importante porque todos os commits no Git utilizam essas informações, e está imutavelmente anexado nos commits que você realiza:

    $ git config --global user.name "John Doe"
    $ git config --global user.email johndoe@example.com

Relembrando, você só precisará fazer isso uma vez caso passe a opção `--global`, pois o Git sempre usará essa informação para qualquer coisa que você faça nesse sistema. Caso você queira sobrepor estas com um nome ou endereço de e-mail diferentes para projetos específicos, você pode executar o comando sem a opção `--global` quando estiver no próprio projeto.

## Seu Editor

Agora que sua identidade está configurada, você pode configurar o editor de texto padrão que será utilizado quando o Git precisar que você digite uma mensagem. Por padrão, Git usa o editor padrão do sistema, que é geralmente Vi ou Vim. Caso você queira utilizar um editor diferente, tal como o Emacs, você pode executar o seguinte:

    $ git config --global core.editor emacs
    
## Sua Ferramenta de Diff

Outra opção útil que você pode querer configurar é a ferramente padrão de diff utilizada para resolver conflitos de merge (fusão). Digamos que você queira utilizar o vimdiff:

    $ git config --global merge.tool vimdiff

Git aceita kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge e opendiff como ferramentas válidas para merge. Você também pode configurar uma ferramenta personalizada; veja o Capítulo 7 para maiores informações em como fazê-lo.

## Verificando Suas Configurações

Caso você queira verificar suas configurações, você pode utilizar o comando `git config --list` para listar todas as configurações que o Git encontrar naquele momento:

    $ git config --list
    user.name=Scott Chacon
    user.email=schacon@gmail.com
    color.status=auto
    color.branch=auto
    color.interactive=auto
    color.diff=auto
    ...

Você pode ver algumas chaves mais de uma vez, porque o Git lê as mesmas chaves em diferentes arquivos (`/etc/gitconfig` e `~/.gitconfig`, por exemplo). Neste caso, Git usa o último valor para cada chave única que é obtida.

Você também pode verificar qual o valor que uma determinada chave tem para o Git digitando `git config {key}`:

    $ git config user.name
    Scott Chacon
