# Um exemplo de Política Git Forçada

Nesta seção, você vai usar o que aprendeu para estabelecer um fluxo de trabalho Git que verifica um formato de mensagem personalizado para commit, e força o uso apenas de push fast-forward, e permite que apenas alguns usuários possam modificar determinados subdiretórios em um projeto. Você vai construir scripts cliente que ajudam ao desenvolvedor saber se seu push será rejeitado e scripts de servidor que fazem valer as políticas.

Eu usei Ruby para escrever estes, isso porque é a minha linguagem de script preferida e porque eu sinto que é a linguagem de script que mais parece com pseudocódigo; assim você deve ser capaz de seguir o código, mesmo que você não use Ruby. No entanto, qualquer linguagem funcionará bem. Todos os exemplos de scripts de hooks distribuídos com o Git são feitos em Perl ou Bash, então você também pode ver vários exemplos de hooks nessas linguagens olhando os exemplos.

## Hook do Lado Servidor

Todo o trabalho do lado servidor irá para o arquivo update no seu diretório de hooks. O arquivo update é executado uma vez por branch de cada push e leva a referência do push para a revisão antiga onde o branch estava, e a nova revisão do push. Você também terá acesso ao usuário que está realizando o push, se o push está sendo executado através de SSH. Se você permitiu que todos se conectem com um único usuário (como "git"), através de autenticação de chave pública, você pode ter que dar ao usuário um "shell wrapper" que determina qual usuário está se conectando com base na chave pública, e definir uma variável de ambiente especificando o usuário. Aqui eu assumo que o usuário de conexão está na variável de ambiente `$USER`, então, seu script de atualização começa reunindo todas as informações que você precisa:

    #!/usr/bin/env ruby

    $refname = ARGV[0]
    $oldrev  = ARGV[1]
    $newrev  = ARGV[2]
    $user    = ENV['USER']

    puts "Enforcing Policies... \n(#{$refname}) (#{$oldrev[0,6]}) (#{$newrev[0,6]})"

Sim, eu estou usando variáveis ​​globais. Não me julgue — é mais fácil para demonstrar desta maneira.

### Impondo um Formato Específico de Mensagens de Commit

Seu primeiro desafio é impor que cada mensagem de commit deve aderir a um formato específico. Só para se ter uma meta, vamos supor que cada mensagem tem de incluir uma string que parece com "ref: 1234" porque você quer que cada commit tenha um link para um item de trabalho no seu sistema de chamados. Você deve olhar para cada commit do push, ver se essa sequência está na mensagem de commit, e, se a string estiver ausente de qualquer um dos commits, retornar zero para que o push seja rejeitado.

Você pode obter uma lista dos valores SHA-1 de todos os commits de um push, através dos valores `$newrev` e `$oldrev` e passando-os para um comando Git plumbing chamado `git rev-list`. Este é basicamente o comando `git log`, mas por padrão ele mostra apenas os valores SHA-1 e nenhuma outra informação. Assim, para obter uma lista de todos os SHAs de commits introduzidos entre um commit SHA e outro, você pode executar algo como abaixo:

    $ git rev-list 538c33..d14fc7
    d14fc7c847ab946ec39590d87783c69b031bdfb7
    9f585da4401b0a3999e84113824d15245c13f0be
    234071a1be950e2a8d078e6141f5cd20c1e61ad3
    dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
    17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

Você pode pegar essa saída, percorrer cada um dos SHAs dos commits, pegar a mensagem para ele, e testar a mensagem contra uma expressão regular que procura um padrão.

Você tem que descobrir como pegar a mensagem de confirmação de cada um dos commits para testar. Para obter os dados brutos do commit, você pode usar um outro comando plumbing chamado `git cat-file`. Eu vou falar de todos estes comandos plumbing em detalhes no Capítulo 9; mas, por agora, aqui está o resultado do comando:

    $ git cat-file commit ca82a6
    tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
    parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    author Scott Chacon <schacon@gmail.com> 1205815931 -0700
    committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

    changed the verison number

Uma maneira simples de obter a mensagem de confirmação de um commit quando você tem o valor SHA-1 é ir para a primeira linha em branco e retirar tudo depois dela. Você pode fazer isso com o comando `sed` em sistemas Unix:

    $ git cat-file commit ca82a6 | sed '1,/^$/d'
    changed the verison number

Você pode usar isso para pegar a mensagem de cada commit do push e sair se você ver algo que não corresponde. Para sair do script e rejeitar o push, retorne um valor diferente de zero. Todo o método se parece com este:

    $regex = /\[ref: (\d+)\]/

    # enforced custom commit message format
    def check_message_format
      missed_revs = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
      missed_revs.each do |rev|
        message = `git cat-file commit #{rev} | sed '1,/^$/d'`
        if !$regex.match(message)
          puts "[POLICY] Your message is not formatted correctly"
          exit 1
        end
      end
    end
    check_message_format

Colocar isso no seu script `update` rejeitará atualizações que contenham commits que tem mensagens que não aderem à sua regra.

### Impondo um Sistema ACL Baseado em Usuário

Suponha que você queira adicionar um mecanismo que utiliza uma lista de controle de acesso (ACL) que especifica quais usuários têm permissão para fazer push com mudanças para partes de seus projetos. Algumas pessoas têm acesso total, e outras só têm acesso a alterar determinados subdiretórios ou arquivos específicos. Para impor isso, você vai escrever essas regras em um arquivo chamado `acl` que ficará em seu repositório Git no servidor. O hook `update` verificará essas regras, verá quais arquivos estão sendo introduzidos nos commits do push, e determinará se o usuário que está fazendo o push tem acesso para atualizar todos os arquivos.

A primeira coisa que você deve fazer é escrever o seu ACL. Aqui você vai usar um formato muito parecido com o mecanismo de ACL CVS: ele usa uma série de linhas, onde o primeiro campo é `avail` ou `unavail`, o próximo campo é uma lista delimitada por vírgula dos usuários para que a regra se aplica, e o último campo é o caminho para o qual a regra se aplica (branco significando acesso em  aberto). Todos esses campos são delimitados por um caractere pipe (`|`).

Neste caso, você tem alguns administradores, alguns escritores de documentação com acesso ao diretório `doc`, e um desenvolvedor que só tem acesso aos diretórios `lib` e `tests`, seu arquivo ACL fica assim:

    avail|nickh,pjhyett,defunkt,tpw
    avail|usinclair,cdickens,ebronte|doc
    avail|schacon|lib
    avail|schacon|tests

Você começa lendo esses dados em uma estrutura que você pode usar. Neste caso, para manter o exemplo simples, você só vai cumprir as diretrizes do `avail`. Aqui está um método que lhe dá um array associativo onde a chave é o nome do usuário e o valor é um conjunto de paths que o usuário tem acesso de escrita:

    def get_acl_access_data(acl_file)
      # read in ACL data
      acl_file = File.read(acl_file).split("\n").reject { |line| line == '' }
      access = {}
      acl_file.each do |line|
        avail, users, path = line.split('|')
        next unless avail == 'avail'
        users.split(',').each do |user|
          access[user] ||= []
          access[user] << path
        end
      end
      access
    end

No arquivo ACL que você viu anteriormente, o método `get_acl_access_data` retorna uma estrutura de dados que se parece com esta:

    {"defunkt"=>[nil],
     "tpw"=>[nil],
     "nickh"=>[nil],
     "pjhyett"=>[nil],
     "schacon"=>["lib", "tests"],
     "cdickens"=>["doc"],
     "usinclair"=>["doc"],
     "ebronte"=>["doc"]}

Agora que você tem as permissões organizadas, é preciso determinar quais os paths que os commits do push modificam, de modo que você pode ter certeza que o usuário que está fazendo o push tem acesso a todos eles.

Você pode muito facilmente ver quais arquivos foram modificados em um único commit com a opção `--name-only` do comando `git log` (mencionado brevemente no Capítulo 2):

    $ git log -1 --name-only --pretty=format:'' 9f585d

    README
    lib/test.rb

Se você usar a estrutura ACL retornada pelo método `get_acl_access_data` e verificar a relação dos arquivos listados em cada um dos commits, você pode determinar se o usuário tem acesso ao push de todos os seus commits:

    # only allows certain users to modify certain subdirectories in a project
    def check_directory_perms
      access = get_acl_access_data('acl')


      # see if anyone is trying to push something they can't
      new_commits = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
      new_commits.each do |rev|
        files_modified = `git log -1 --name-only --pretty=format:'' #{rev}`.split("\n")
        files_modified.each do |path|
          next if path.size == 0
          has_file_access = false
          access[$user].each do |access_path|
            if !access_path || # user has access to everything
              (path.index(access_path) == 0) # access to this path
              has_file_access = true
            end
          end
          if !has_file_access
            puts "[POLICY] You do not have access to push to #{path}"
            exit 1
          end
        end
      end
    end

    check_directory_perms

A maior parte do código deve ser fácil de acompanhar. Você receberá uma lista de novos commits do push com `git rev-list`. Então, para cada um desses, você acha quais arquivos são modificados e verifica se o usuário que está fazendo o push tem acesso a todos os paths sendo modificados. Um Rubyism que pode não ser claro é `path.index(access_path) == 0`, que é verdadeiro se o caminho começa com `access_path` — isso garante que `access_path` não esta apenas em um dos caminhos permitidos, mas um path permitido começa com cada path acessado.

Agora seus usuários não podem fazer o push de qualquer commit com mensagens mal formadas ou com arquivos modificados fora de seus paths designados.

### Impondo Apenas Fast-Forward Pushes

A única coisa que resta é impor apenas fast-forward pushes. Nas versões Git 1.6 ou mais recentes, você pode definir as configurações `receive.denyDeletes` e `receive.denyNonFastForwards`. Mas utilizar um hook irá funcionar em versões mais antigas do Git, e você pode modificá-lo para impor a diretiva apenas para determinados usuários ou fazer qualquer outra coisa que você queira.

A lógica para verificar isso é ver se algum commit é acessível a partir da revisão mais antiga que não é acessível a partir da versão mais recente. Se não houver nenhum, então foi um push Fast-Forward; caso contrário, você nega ele:

    # enforces fast-forward only pushes
    def check_fast_forward
      missed_refs = `git rev-list #{$newrev}..#{$oldrev}`
      missed_ref_count = missed_refs.split("\n").size
      if missed_ref_count > 0
        puts "[POLICY] Cannot push a non fast-forward reference"
        exit 1
      end
    end

    check_fast_forward

Tudo está configurado. Se você executar `chmod u+x .git/hooks/update`, que é o arquivo no qual você deve ter colocado todo este código, e então tentar fazer um push de uma referência não fast-forwarded, você verá algo como isto:

    $ git push -f origin master
    Counting objects: 5, done.
    Compressing objects: 100% (3/3), done.
    Writing objects: 100% (3/3), 323 bytes, done.
    Total 3 (delta 1), reused 0 (delta 0)
    Unpacking objects: 100% (3/3), done.
    Enforcing Policies...
    (refs/heads/master) (8338c5) (c5b616)
    [POLICY] Cannot push a non fast-forward reference
    error: hooks/update exited with error code 1
    error: hook declined to update refs/heads/master
    To git@gitserver:project.git
     ! [remote rejected] master -> master (hook declined)
    error: failed to push some refs to 'git@gitserver:project.git'

Há algumas coisas interessantes aqui. Primeiro, você vê quando o hook começa a funcionar.

    Enforcing Policies...
    (refs/heads/master) (8338c5) (c5b616)

Observe que você imprimiu aquilo no stdout no início do seu script de atualização. É importante notar que qualquer coisa que seu script imprima no stdout será transferido para o cliente.

A próxima coisa que você vai notar é a mensagem de erro.

    [POLICY] Cannot push a non fast-forward reference
    error: hooks/update exited with error code 1
    error: hook declined to update refs/heads/master

A primeira linha foi impressa por você, as outras duas foram pelo Git dizendo que o script de atualização não retornou zero e é isso que está impedindo seu push. Por último, você verá isso:

    To git@gitserver:project.git
     ! [remote rejected] master -> master (hook declined)
    error: failed to push some refs to 'git@gitserver:project.git'

Você verá uma mensagem de rejeição remota para cada referência que o seu hook impediu, e ele diz que ele foi recusado especificamente por causa de uma falha de hook.

Além disso, se o marcador ref não existir em nenhum dos seus commits, você verá a mensagem de erro que você está imprimindo para ele.

    [POLICY] Your message is not formatted correctly

Ou se alguém tentar editar um arquivo que não têm acesso e fazer um push de um commit que o contém, ele verá algo semelhante. Por exemplo, se um autor de documentação tenta fazer um push de um commit modificando algo no diretório `lib`, ele verá

    [POLICY] You do not have access to push to lib/test.rb

Isto é tudo. A partir de agora, desde que o script `update` esteja lá e seja executável, seu repositório nunca será rebobinado e nunca terá uma mensagem de commit sem o seu padrão nela, e os usuários terão restrições.

## Hooks do Lado Cliente 

A desvantagem desta abordagem é a choraminga que resultará inevitavelmente quando os pushes de commits de seus usuários forem rejeitados. Tendo seu trabalho cuidadosamente elaborada rejeitado no último minuto pode ser extremamente frustrante e confuso; e, além disso, eles vão ter que editar seu histórico para corrigi-lo, o que nem sempre é para os fracos de coração.

A resposta para este dilema é fornecer alguns hooks do lado cliente que os usuários possam usar para notificá-los quando eles estão fazendo algo que o servidor provavelmente rejeitará. Dessa forma, eles podem corrigir quaisquer problemas antes de fazer o commit e antes desses problemas se tornarem mais difíceis de corrigir. Já que hooks não são transferidos com um clone de um projeto, você deve distribuir esses scripts de alguma outra forma e, então, usuários devem copiá-los para seu diretório `.git/hooks` e torná-los executáveis. Você pode distribuir esses hooks dentro do projeto ou em um projeto separado, mas não há maneiras de configurá-los automaticamente.

Para começar, você deve verificar a sua mensagem de confirmação antes que cada commit seja gravado, então você saberá que o servidor não irá rejeitar as alterações devido a mensagens de commit mal formatadas. Para fazer isso, você pode adicionar o hook `commit-msg`. Se fizer ele ler as mensagens do arquivo passado como o primeiro argumento e comparar ele com o padrão, você pode forçar o Git a abortar o commit se eles não corresponderem:

    #!/usr/bin/env ruby
    message_file = ARGV[0]
    message = File.read(message_file)

    $regex = /\[ref: (\d+)\]/

    if !$regex.match(message)
      puts "[POLICY] Your message is not formatted correctly"
      exit 1
    end

Se esse script está no lugar correto (em `.git/hooks/commit-msg`) e é executável, e você fizer um commit com uma mensagem que não está formatada corretamente, você verá isso:

    $ git commit -am 'test'
    [POLICY] Your message is not formatted correctly

Nenhum commit foi concluído nessa instância. No entanto, se a mensagem conter o padrão adequado, o Git permite o commit:

    $ git commit -am 'test [ref: 132]'
    [master e05c914] test [ref: 132]
     1 files changed, 1 insertions(+), 0 deletions(-)

Em seguida, você quer ter certeza de que você não está modificando os arquivos que estão fora do seu escopo ACL. Se o seu diretório de projeto `.git` contém uma cópia do arquivo ACL que você usou anteriormente, então o seguinte script `pre-commit` irá impor essas restrições para você:

    #!/usr/bin/env ruby

    $user = ENV['USER']

    # [ insert acl_access_data method from above ]

    # only allows certain users to modify certain subdirectories in a project
    def check_directory_perms
      access = get_acl_access_data('.git/acl')

      files_modified = `git diff-index --cached --name-only HEAD`.split("\n")
      files_modified.each do |path|
        next if path.size == 0
        has_file_access = false
        access[$user].each do |access_path|
        if !access_path || (path.index(access_path) == 0)
          has_file_access = true
        end
        if !has_file_access
          puts "[POLICY] You do not have access to push to #{path}"
          exit 1
        end
      end
    end

    check_directory_perms

Este é aproximadamente o mesmo script da parte do lado servidor, mas com duas diferenças importantes. Primeiro, o arquivo ACL está em um lugar diferente, porque este script é executado a partir do seu diretório de trabalho, e não de seu diretório Git. Você tem que mudar o path para o arquivo ACL, disso

    access = get_acl_access_data('acl')

para isso:

    access = get_acl_access_data('.git/acl')

A outra diferença importante é a forma como você obtem uma lista dos arquivos que foram alterados. Como o método do lado servidor olha no log de ​​commits e, neste momento, o commit não foi gravado ainda, você deve pegar sua lista de arquivos da área staging. Em vez de

    files_modified = `git log -1 --name-only --pretty=format:'' #{ref}`

você deve usar

    files_modified = `git diff-index --cached --name-only HEAD`

Mas essas são as duas únicas diferenças — caso contrário, o script funciona da mesma maneira. Uma ressalva é que ele espera que você esteja executando localmente como o mesmo usuário que você fez o push para a máquina remota. Se ele for diferente, você deve definir a variável `$user` manualmente.

A última coisa que você tem que fazer é verificar se você não está tentando fazer o push de referências não fast-forwarded, mas isso é um pouco menos comum. Para obter uma referência que não é um fast-forward, você tem que fazer um rebase depois de um commit que já foi enviado por um push ou tentar fazer o push de um branch local diferente até o mesmo branch remoto.

Como o servidor vai dizer que você não pode fazer um push não fast-forward de qualquer maneira, e o hook impede pushes forçados, a única coisa acidental que você pode tentar deter são commits de rebase que já foram enviados por um push.

Aqui está um exemplo de script pré-rebase que verifica isso. Ele recebe uma lista de todos os commits que você está prestes a reescrever e verifica se eles existem em qualquer uma das suas referências remotas. Se ele vê um que é acessível a partir de uma de suas referências remotas, ele aborta o rebase:

    #!/usr/bin/env ruby

    base_branch = ARGV[0]
    if ARGV[1]
      topic_branch = ARGV[1]
    else
      topic_branch = "HEAD"
    end

    target_shas = `git rev-list #{base_branch}..#{topic_branch}`.split("\n")
    remote_refs = `git branch -r`.split("\n").map { |r| r.strip }

    target_shas.each do |sha|
      remote_refs.each do |remote_ref|
        shas_pushed = `git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}`
        if shas_pushed.split(“\n”).include?(sha)
          puts "[POLICY] Commit #{sha} has already been pushed to #{remote_ref}"
          exit 1
        end
      end
    end

Este script utiliza uma sintaxe que não foi coberta na seção Seleção de Revisão do Capítulo 6. Você obterá uma lista de commits que já foram foram enviados em um push executando isto:

    git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}

A sintaxe `SHA^@` resolve para todos os pais daquele commit. Você está à procura de qualquer commit que é acessível a partir do último commit no remoto e que não é acessível a partir de qualquer pai de qualquer um dos SHAs que você está tentando fazer o push — o que significa que é um fast-forward.

A principal desvantagem desta abordagem é que ela pode ser muito lenta e muitas vezes é desnecessária — se você não tentar forçar o push com `-f`, o servidor irá avisá-lo e não aceitará o push. No entanto, é um exercício interessante e pode, em teoria, ajudar a evitar um rebase que você possa mais tarde ter que voltar atrás e corrigir.
