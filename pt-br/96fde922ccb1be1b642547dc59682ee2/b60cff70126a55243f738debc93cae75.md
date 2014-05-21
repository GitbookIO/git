# Gitolite

Nota: a última cópia desta seção do livro ProGit está sempre disponível na [documentação do gitolite][gldpg]. O autor também gostaria de humildemente informar que, embora esta seção seja precisa, e *pode* (e geralmente *tem*) sido usada para instalar gitolite sem necessidade de ler qualquer outra documentação, ela não é completa, e não pode substituir completamente a enorme quantidade de documentação que vem com o gitolite.

  [gldpg]: http://sitaramc.github.com/gitolite/progit.html

Git começou a se tornar muito popular em ambientes corporativos, que tendem a ter alguns requisitos adicionais em termos de controle de acesso. Gitolite foi originalmente criado para ajudar com esses requisitos, mas verifica-se que é igualmente útil no mundo do código aberto: o Projeto Fedora controla o acesso aos seus repositórios de gerenciamento de pacotes (mais de 10.000 deles!) usando gitolite, e essa é provavelmente a maior instalação do gitolite  que existe.

Gitolite permite que você especifique as permissões não apenas por repositório (como o Gitosis faz), mas também por branch ou nomes de tag dentro de cada repositório. Ou seja, você pode especificar que certas pessoas (ou grupos de pessoas) só podem fazer um push em certas "refs" (branchs ou tags), mas não em outros.

## Instalando

Instalar o Gitolite é muito fácil, mesmo se você não leu a extensa documentação que vem com ele. Você precisa de uma conta em um servidor Unix de algum tipo; vários tipos de Linux e Solaris 10, foram testados. Você não precisa de acesso root, assumindo que git, perl, e um servidor ssh openssh compatível já estejam instalados. Nos exemplos abaixo, vamos usar uma conta `gitolite` em um host chamado `gitserver`.

Gitolite é um pouco incomum, em relação a software "servidor" -- o acesso é via ssh, e por isso cada ID de usuário no servidor é um "host gitolite" em potencial. Como resultado, há uma noção de "instalar" o software em si, e em seguida "criar" um usuário como "host gitolite".

Gitolite tem 4 métodos de instalação. As pessoas que usam o Fedora ou sistemas Debian podem obter um RPM ou um DEB e instalá-lo. Pessoas com acesso root podem instalá-lo manualmente. Nesses dois métodos, qualquer usuário do sistema pode, então, tornar-se um "host gitolite".

Pessoas sem acesso root podem instalá-lo dentro de suas próprias userids. E, finalmente, gitolite pode ser instalado executando um script *na estação de trabalho*, a partir de um shell bash. (Mesmo o bash que vem com msysgit vai funcionar.)

Vamos descrever este último método neste artigo; para os outros métodos, por favor consulte a documentação.

Você começa pela obtenção de acesso baseado em chave pública para o servidor, de modo que você pode entrar a partir de sua estação de trabalho no servidor sem receber uma solicitação de senha. O método a seguir funciona em Linux; para outros sistemas operacionais, você pode ter que fazer isso manualmente. Nós assumimos que você já tinha um par de chaves gerado usando o `ssh-keygen`.

    $ ssh-copy-id -i ~/.ssh/id_rsa gitolite@gitserver

Isso irá pedir a senha para a conta gitolite, e depois configurar o acesso à chave pública. Isto é **essencial** para o script de instalação, então verifique para se certificar de que você pode executar um comando sem que seja pedida uma senha:

    $ ssh gitolite@gitserver pwd
    /home/gitolite

Em seguida, você clona o Gitolite do site principal do projeto e executa o script "easy install" (o terceiro argumento é o seu nome como você gostaria que ele aparecesse no repositório gitolite-admin resultante):

    $ git clone git://github.com/sitaramc/gitolite
    $ cd gitolite/src
    $ ./gl-easy-install -q gitolite gitserver sitaram

E pronto! Gitolite já foi instalado no servidor, e agora você tem um repositório novo chamado `gitolite-admin` no diretório home de sua estação de trabalho. Você administra seu gitolite fazendo mudanças neste repositório e fazendo um push (como no Gitosis).

Esse último comando produz uma quantidade grande de informações, que pode ser interessante de ler. Além disso, a primeira vez que você executá-lo, um novo par de chaves é criado; você terá que escolher uma senha ou teclar enter para deixar em branco. Porque um segundo par de chaves é necessário, e como ele é usado, é explicado no documento "ssh troubleshooting" que vem com o Gitolite.

Repositórios chamados `gitolite-admin` e `testing` são criados no servidor por padrão. Se você deseja clonar um desses localmente (a partir de uma conta que tenha acesso SSH para a conta gitolite via *authorized_keys*) digite:

    $ git clone gitolite:gitolite-admin
    $ git clone gitolite:testing
    
Para clonar esses mesmos repositórios de qualquer outra conta:

    $ git clone gitolite@servername:gitolite-admin
    $ git clone gitolite@servername:testing

## Customizando a Instalação

Enquanto que o padrão, "quick install" (instalação rápida) funciona para a maioria das pessoas, existem algumas maneiras de personalizar a instalação se você precisar. Se você omitir o argumento `-q`, você entra em modo de instalação "verbose" -- mostra informações detalhadas sobre o que a instalação está fazendo em cada etapa. O modo verbose também permite que você altere alguns parâmetros do lado servidor, tais como a localização dos repositórios, através da edição de um arquivo "rc" que o servidor utiliza. Este arquivo "rc" é comentado, assim você deve ser capaz de fazer qualquer alteração que você precisar com bastante facilidade, salvá-lo, e continuar. Este arquivo também contém várias configurações que você pode mudar para ativar ou desativar alguns dos recursos avançados do gitolite.

## Arquivo de Configuração e Regras de Controle de Acesso

Uma vez que a instalação seja feita, você alterna para o repositório `gitolite-admin` (colocado no seu diretório HOME) e olha nele para ver o que você conseguiu:

    $ cd ~/gitolite-admin/
    $ ls
    conf/  keydir/
    $ find conf keydir -type f
    conf/gitolite.conf
    keydir/sitaram.pub
    $ cat conf/gitolite.conf
    #gitolite conf
    # please see conf/example.conf for details on syntax and features

    repo gitolite-admin
        RW+                 = sitaram

    repo testing
        RW+                 = @all

Observe que "sitaram" (o último argumento no comando `gl-easy-install` que você deu anteriormente) tem permissões completas sobre o repositório `gitolite-admin`, bem como um arquivo de chave pública com o mesmo nome.

A sintaxe do arquivo de configuração do Gitolite é muito bem documentada em `conf/example.conf`, por isso vamos apenas mencionar alguns destaques aqui.

Você pode agrupar usuários ou repositórios por conveniência. Os nomes dos grupos são como macros; ao defini-los, não importa nem mesmo se são projetos ou usuários; essa distinção só é feita quando você *usa* a "macro".

    @oss_repos      = linux perl rakudo git gitolite
    @secret_repos   = fenestra pear

    @admins         = scott     # Adams, not Chacon, sorry :)
    @interns        = ashok     # get the spelling right, Scott!
    @engineers      = sitaram dilbert wally alice
    @staff          = @admins @engineers @interns

Você pode controlar permissões no nível "ref". No exemplo a seguir, os estagiários só podem fazer o push do branch "int". Engenheiros podem fazer push de qualquer branch cujo nome começa com "eng-", e as tags que começam com "rc" seguido de um dígito. E os administradores podem fazer qualquer coisa (incluindo retroceder (rewind)) para qualquer ref.

    repo @oss_repos
        RW  int$                = @interns
        RW  eng-                = @engineers
        RW  refs/tags/rc[0-9]   = @engineers
        RW+                     = @admins

A expressão após o `RW` ou `RW+` é uma expressão regular (regex) que o refname (ref) do push é comparado. Então, nós a chamamos de "refex"! Naturalmente, uma refex pode ser muito mais poderosa do que o mostrado aqui, por isso não exagere, se você não está confortável com expressões regulares perl.

Além disso, como você provavelmente adivinhou, Gitolite prefixa `refs/heads/` como uma conveniência sintática se a refex não começar com `refs/`.

Uma característica importante da sintaxe do arquivo de configuração é que todas as regras para um repositório não precisam estar em um só lugar. Você pode manter todo o material comum em conjunto, como as regras para todos os `oss_repos` mostrados acima, e em seguida, adicionar regras específicas para casos específicos mais tarde, assim:

    repo gitolite
        RW+                     = sitaram

Esta regra só vai ser adicionada ao conjunto de regras para o repositório `gitolite`.

Neste ponto, você pode estar se perguntando como as regras de controle de acesso são realmente aplicadas, então vamos ver isso brevemente.

Existem dois níveis de controle de acesso no gitolite. O primeiro é ao nível do repositório; se você tem acesso de leitura (ou escrita) a *qualquer* ref no repositório, então você tem acesso de leitura (ou escrita) ao repositório.

O segundo nível, aplicável apenas a acesso de "gravação", é por branch ou tag dentro de um repositório. O nome de usuário, o acesso a ser tentado (`W` ou `+`), e o refname sendo atualizado são conhecidos. As regras de acesso são verificadas em ordem de aparição no arquivo de configuração, à procura de uma correspondência para esta combinação (mas lembre-se que o refname é combinado com regex, e não meramente string). Se for encontrada uma correspondência, o push é bem-sucedido. Um "fallthrough" resulta em acesso negado.

## Controle de Acesso Avançado com Regras "deny"

Até agora, só vimos que as permissões podem ser `R`, `RW`, ou `RW+`. No entanto, gitolite permite outra permissão: `-`, que significa "negar". Isso lhe dá muito mais flexibilidade, à custa de alguma complexidade, porque agora o fallthrough não é a *única* forma do acesso ser negado, então a *ordem das regras agora importa*!

Digamos que, na situação acima, queremos que os engenheiros sejam capazes de retroceder qualquer branch *exceto* o master e integ. Eis como:

        RW  master integ    = @engineers
        -   master integ    = @engineers
        RW+                 = @engineers

Mais uma vez, você simplesmente segue as regras do topo para baixo até atingir uma correspondência para o seu modo de acesso, ou uma negação. Um push sem retrocessos (rewind) no master ou integ é permitido pela primeira regra. Um "rewind push" a essas refs não coincide com a primeira regra, cai na segunda, e é, portanto, negada. Qualquer push (rewind ou não) para refs que não sejam integ ou master não coincidirão com as duas primeiras regras de qualquer maneira, e a terceira regra permite isso.

Se isso soar complicado, você pode querer brincar com ele para aumentar a sua compreensão. Além disso, na maioria das vezes você não precisa "negar" regras de qualquer maneira, então você pode optar por apenas evitá-las, se preferir.

## Restringindo Pushes Por Arquivos Alterados

Além de restringir a que branches um usuário pode fazer push com alterações, você também pode restringir quais arquivos estão autorizados a alterar. Por exemplo, talvez o Makefile (ou algum outro programa) não deveria ser alterado por qualquer um, porque um monte de coisas que dependem dele iriam parar de funcionar se as mudanças fossem feitas. Você pode dizer ao gitolite:

    repo foo
        RW                  =   @junior_devs @senior_devs

        RW  NAME/           =   @senior_devs
        -   NAME/Makefile   =   @junior_devs
        RW  NAME/           =   @junior_devs

Este poderoso recurso está documentado em `conf/example.conf`.

## Branches Pessoais

Gitolite também tem um recurso chamado "personal branches" (ou melhor, "personal branch namespace") que pode ser muito útil em um ambiente corporativo.

Um monte de troca de código no mundo git acontece por um pedido de pull (pull request). Em um ambiente corporativo, no entanto, o acesso não autenticado é pouco usado, e uma estação de trabalho de desenvolvedor não pode fazer autenticação, por isso você tem que fazer o push para o servidor central e pedir para alguém fazer um pull a partir dali.

Isso normalmente causa uma confusão no branch de mesmo nome, como acontece em VCS centralizados, além de que configurar permissões para isso torna-se uma tarefa árdua para o administrador.

Gitolite permite definir um prefixo de namespace "personal" ou "scratch" para cada desenvolvedor (por exemplo, `refs/personal/<devname>/*`); veja a seção "personal branches" em `doc/3-faq-tips-etc.mkd` para mais detalhes.

## Repositórios "Wildcard"

Gitolite permite especificar repositórios com wildcards (regexes realmente Perl), como, por exemplo `assignments/s[0-9][0-9]/a[0-9][0-9]`. Esta é uma característica *muito* poderosa, que tem que ser ativada pela opção `$GL_WILDREPOS = 1;` no arquivo rc. Isso permite que você atribua um modo de permissão novo ("C"), que permite aos usuários criar repositórios baseados em tais coringas, automaticamente atribui a propriedade para o usuário específico que o criou, permite que ele/ela dê permissões de R e RW para outros usuários colaborarem, etc. Este recurso está documentado em `doc/4-wildcard-repositories.mkd`.

## Outras Funcionalidades

Vamos terminar essa discussão com exemplos de outros recursos, os quais são descritos em detalhes nas "faqs, tips, etc" e outros documentos.

**Log**: Gitolite registra todos os acessos com sucesso. Se você foi um pouco preguiçoso ao dar permissões de retrocesso (rewind) (`RW+`) às pessoas e alguém estragou o branch "master", o arquivo de log é um salva-vidas, permitindo de forma fácil e rápida encontrar o SHA que foi estragado.

**Git fora do PATH normal**: Um recurso extremamente conveniente no gitolite é suportar instalações do git fora do `$PATH` normal (isso é mais comum do que você pensa; alguns ambientes corporativos ou mesmo alguns provedores de hospedagem se recusam a instalar coisas em todo o sistema e você acaba colocando-os em seus próprios diretórios). Normalmente, você é forçado a fazer com que o git do *lado cliente* fique ciente de que os binários git estão neste local não-padrão de alguma forma. Com gitolite, basta escolher uma instalação detalhada (verbose) e definir `$GIT_PATH` nos arquivos "RC". Não serão necessárias alterações do lado cliente depois disso.

**Reportar direitos de Accesso**: Outro recurso conveniente é o que acontece quando você apenas acessa o servidor via ssh. Gitolite mostra que repositórios você tem acesso, e quais permissões de acesso você tem. Aqui está um exemplo:

    hello sitaram, the gitolite version here is v1.5.4-19-ga3397d4
    the gitolite config gives you the following access:
      R     anu-wsd
      R     entrans
      R  W  git-notes
      R  W  gitolite
      R  W  gitolite-admin
      R     indic_web_input
      R     shreelipi_converter

**Delegação**: Para instalações realmente grandes, você pode delegar a responsabilidade de grupos de repositórios para várias pessoas e tê-los gerenciando essas peças de forma independente. Isso reduz a carga sobre o administrador principal. Este recurso tem seu próprio arquivo de documentação no diretório `doc/`.

**Suporte a Gitweb**: Gitolite suporta gitweb de várias maneiras. Você pode especificar quais repositórios são visíveis através do gitweb. Você pode definir o "dono" e "Descrição" do gitweb a partir do arquivo de configuração do gitolite. Gitweb tem um mecanismo para que você possa implementar o controle de acesso baseado em autenticação HTTP, você pode fazê-lo usar o arquivo de configuração "compilado" que o gitolite produz, o que significa que as mesmas regras de acesso de controle (para acesso de leitura) se aplicam para gitweb e gitolite.

**Mirroring**: Gitolite pode ajudar a manter múltiplos mirrors (espelhos), e alternar entre eles facilmente se o servidor principal falhar.
