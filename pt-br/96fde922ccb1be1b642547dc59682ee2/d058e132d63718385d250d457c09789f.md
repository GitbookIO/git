# Configurando Git no Servidor

Antes de configurar qualquer servidor Git, você tem que exportar um repositório existente em um novo repositório limpo — um repositório que não contém um diretório sendo trabalhado. Isto é geralmente fácil de fazer. Para clonar seu repositório para criar um novo repositório limpo, você pode executar o comando clone com a opção `--bare`. Por convenção, diretórios de repositórios limpos terminam em `.git`, assim:

    $ git clone --bare my_project my_project.git
    Initialized empty Git repository in /opt/projects/my_project.git/

O resultado deste comando é um pouco confuso. Já que `clone` é basicamente um `git init` seguido de um `git fetch`, nós vemos um pouco do resultado de `git init`, que cria um diretório vazio. A transferência real de objetos não dá nenhum resultado, mas ocorre. Você deve ter agora uma cópia dos dados do diretório Git no seu diretório `my_project.git`.

Isto é mais ou menos equivalente a algo assim

    $ cp -Rf my_project/.git my_project.git

Existem algumas diferenças menores no arquivo de configuração caso você siga este caminho; mas para o propósito, isto é perto da mesma coisa. Ele copia o repositório Git, sem um diretório de trabalho, e cria um diretório especificamente para ele sozinho.

## Colocando o Repositório Limpo no Servidor

Agora que você tem uma cópia limpa do seu repositório, tudo o que você precisa fazer é colocá-lo num servidor e configurar os protocolos. Vamos dizer que você configurou um servidor chamado `git.example.com` que você tem acesso via SSH, e você quer armazenar todos os seus repositórios Git no diretório `/opt/git`. Você pode configurar o seu novo repositório apenas copiando o seu repositório limpo:

    $ scp -r my_project.git user@git.example.com:/opt/git

Neste ponto, outros usuários com acesso SSH para o mesmo servidor e que possuam acesso de leitura para o diretório `/opt/git` podem clonar o seu repositório executando

    $ git clone user@git.example.com:/opt/git/my_project.git

Se um usuário acessar um servidor via SSH e ele tiver acesso de escrita no diretório `/opt/git/my_project.git`, ele também terá acesso para envio (push) automaticamente. Git irá automaticamente adicionar permissões de escrita apropriadas para o grupo se o comando `git init` com a opção `--shared` for executada em um repositório.

    $ ssh user@git.example.com
    $ cd /opt/git/my_project.git
    $ git init --bare --shared

Você pode ver como é fácil pegar um repositório Git, criar uma versão limpa, e colocar num servidor onde você e seus colaboradores têm acesso SSH. Agora vocês estão prontos para colaborar no mesmo projeto.

É importante notar que isso é literalmente tudo que você precisa fazer para rodar um servidor Git útil no qual várias pessoas possam acessar — apenas adicione as contas com acesso SSH ao servidor, coloque um repositório Git em algum lugar do servidor no qual todos os usuários tenham acesso de leitura e escrita. Você está pronto — nada mais é necessário.

Nas próximas seções, você verá como expandir para configurações mais sofisticas. Essa discussão irá incluir a característica de não precisar criar contas para cada usuário, adicionar acesso de leitura pública para os seus repositórios, configurar Web UIs, usando a ferramenta Gitosis, e mais. Entretanto, mantenha em mente que para colaborar com algumas pessoas em um projeto privado, tudo o que você _precisa_ é um servidor SSH e um repositório limpo.

## Setups Pequenos

Se você for uma pequena empresa ou está apenas testando Git na sua organização e tem alguns desenvolvedores, as coisas podem ser simples para você. Um dos aspectos mais complicados de configurar um servidor Git é o gerenciamento de usuários. Se você quer que alguns repositórios sejam apenas de leitura para alguns usuários e leitura/escrita para outros, acesso e permissões podem ser um pouco difíceis de arranjar.

### Acesso SSH

Se você já tem um servidor ao qual todos os seus desenvolvedores tem acesso SSH, é geralmente mais fácil configurar o seu primeiro repositório lá, pelo fato de você não precisar fazer praticamente nenhum trabalho extra (como mostramos na última seção). Se você quiser um controle de acesso mais complexo nos seus repositórios, você pode gerenciá-los com o sistema de permissão de arquivos do sistema operacional que o seu servidor roda.

Se você quiser colocar seus repositórios num servidor que não possui contas para todos no seu time que você quer dar permissão de acesso, então você deve configurar acesso SSH para eles. Assumimos que se você tem um servidor com o qual fazer isso, você já tem um servidor SSH instalado, e é assim que você está acessando o servidor.

Existem algumas alternativas para dar acesso a todos no seu time. A primeira é configurar contas para todos, o que é simples mas pode se tornar complicado. Você provavelmente não quer executar `adduser` e definir senhas temporárias para cada usuário.

Um segundo método é criar um único usuário 'git' na máquina, pedir a cada usuário que deve possuir acesso de escrita para enviar a você uma chave pública SSH, e adicionar estas chaves no arquivo `~/.ssh/authorized_keys` do seu novo usuário 'git'. Depois disto, todos poderão acessar aquela máquina usando o usuário 'git'. Isto não afeta os dados de commit de maneira alguma — o usuário SSH que você usa para se conectar não afeta os commits que você gravou previamente.

Outro método é fazer o seu servidor SSH se autenticar a partir de um servidor LDAP ou outro autenticador central que você talvez já tenha previamente configurado. Contanto que cada usuário tenha acesso shell à máquina, qualquer mecanismo de autenticação SSH que você imaginar deve funcionar.
