# Migrando para o Git

Se você tem uma base de código existente em outro VCS mas você decidiu começar a usar o Git, você deve migrar seu projeto de um jeito ou outro. Esta seção vai mostrar alguns importadores que estão incluídos no Git para sistemas comuns e demonstra como desenvolver o seu importador personalizado.

## Importando

Você vai aprender como importar dados de dois dos maiores sistemas SCM utilizados profissionalmente — Subversion e Perforce — isso porque eles são usados pela maioria dos usuários que ouço falar, e porque ferramentas de alta qualidade para ambos os sistemas são distribuídos com Git.

## Subversion

Se você ler a seção anterior sobre o uso do `git svn`, você pode facilmente usar essas instruções para `git svn clone` um repositório; então, parar de usar o servidor Subversion, fazer um push para um servidor Git novo, e começar a usar ele. Se precisar do histórico, você pode conseguir isso tão rapidamente como extrair os dados do servidor Subversion (que pode demorar um pouco).

No entanto, a importação não é perfeita; e já que vai demorar tanto tempo, você pode fazer isso direito. O primeiro problema é a informação do autor. No Subversion, cada pessoa commitando tem um usuário no sistema que está registrado nas informações de commit. Os exemplos nas seções anteriores mostram `schacon` em alguns lugares, como a saída do `blame` e do `git svn log`. Se você deseja mapear isso para obter melhores dados de autor no Git, você precisa fazer um mapeamento dos usuários do Subversion para os autores Git. Crie um arquivo chamado `users.txt` que tem esse mapeamento em um formato como este:

    schacon = Scott Chacon <schacon@geemail.com>
    selse = Someo Nelse <selse@geemail.com>

Para obter uma lista dos nomes de autores que o SVN usa, você pode executar isto:

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

Isso te dá a saída do log em formato XML — você pode pesquisar pelos autores, criar uma lista única, e depois tirar o XML. (Obviamente isso só funciona em uma máquina com `grep`, `sort`, e `perl` instalados.) Em seguida, redirecione a saída em seu arquivo users.txt assim, você pode adicionar os dados de usuários do Git equivalentes ao lado de cada entrada.

Você pode fornecer esse arquivo para `git svn` para ajudar a mapear os dados do autor com mais precisão. Você também pode dizer ao `git svn` para não incluir os metadados que o Subversion normalmente importa, passando `--no-metadata` para o comando `clone` ou `init`. Isso faz com que o seu comando `import` fique parecido com este:

    $ git-svn clone http://my-project.googlecode.com/svn/ \
          --authors-file=users.txt --no-metadata -s my_project

Agora você deve ter uma importação Subversion mais agradável no seu diretório `my_project`. Em vez de commits ele se parece com isso

    commit 37efa680e8473b615de980fa935944215428a35a
    Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
    Date:   Sun May 3 00:12:22 2009 +0000

        fixed install - go to trunk

        git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
        be05-5f7a86268029
they look like this:

    commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
    Author: Scott Chacon <schacon@geemail.com>
    Date:   Sun May 3 00:12:22 2009 +0000

        fixed install - go to trunk

Não só o campo Author parece muito melhor, mas o `git-svn-id` não está mais lá também.

Você precisa fazer um pouco de limpeza `post-import`. Por um lado, você deve limpar as referências estranhas que `git svn` configura. Primeiro você vai migrar as tags para que sejam tags reais, em vez de estranhos branches remotos, e então você vai migrar o resto dos branches de modo que eles sejam locais.

Para migrar as tags para que sejam tags Git adequadas, execute

    $ cp -Rf .git/refs/remotes/tags/* .git/refs/tags/
    $ rm -Rf .git/refs/remotes/tags

Isso leva as referências que eram branches remotos que começavam com `tag/` e torna-os tags (leves) reais.

Em seguida, importamos o resto das referências em `refs/remotes` para serem branches locais:

    $ cp -Rf .git/refs/remotes/* .git/refs/heads/
    $ rm -Rf .git/refs/remotes

Agora todos os branches velhos são branches Git reais e todas as tags antigas são tags Git reais. A última coisa a fazer é adicionar seu servidor Git novo como um remoto e fazer um push nele. Aqui está um exemplo de como adicionar o servidor como um remoto:

    $ git remote add origin git@my-git-server:myrepository.git

Já que você quer que todos os seus branches e tags sejam enviados, você pode executar isto:

    $ git push origin --all

Todos os seus branches e tags devem estar em seu servidor Git novo em uma agradável importação limpa.

## Perforce

O sistema seguinte de que importaremos é o Perforce. Um importador Perforce também é distribuído com Git, mas apenas na seção `contrib` do código fonte — que não está disponível por padrão como `git svn`. Para executá-lo, você deve obter o código fonte Git, que você pode baixar a partir de git.kernel.org:

    $ git clone git://git.kernel.org/pub/scm/git/git.git
    $ cd git/contrib/fast-import

Neste diretório `fast-import`, você deve encontrar um script Python executável chamado `git-p4`. Você deve ter o Python e a ferramenta `p4` instalados em sua máquina para esta importação funcionar. Por exemplo, você vai importar o projeto Jam do depósito público Perforce. Para configurar o seu cliente, você deve exportar a variável de ambiente P4PORT para apontar para o depósito Perforce:

    $ export P4PORT=public.perforce.com:1666

Execute o comando `git-p4 clone` para importar o projeto Jam do servidor Perforce, fornecendo o caminho do depósito e do projeto e o caminho no qual você deseja importar o projeto:

    $ git-p4 clone //public/jam/src@all /opt/p4import
    Importing from //public/jam/src@all into /opt/p4import
    Reinitialized existing Git repository in /opt/p4import/.git/
    Import destination: refs/remotes/p4/master
    Importing revision 4409 (100%)

Se você for para o diretório `/opt/p4import` e executar `git log`, você pode ver o seu trabalho importado:

    $ git log -2
    commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
    Author: Perforce staff <support@perforce.com>
    Date:   Thu Aug 19 10:18:45 2004 -0800

        Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
        the main part of the document.  Built new tar/zip balls.

        Only 16 months later.

        [git-p4: depot-paths = "//public/jam/src/": change = 4409]

    commit ca8870db541a23ed867f38847eda65bf4363371d
    Author: Richard Geiger <rmg@perforce.com>
    Date:   Tue Apr 22 20:51:34 2003 -0800

        Update derived jamgram.c

        [git-p4: depot-paths = "//public/jam/src/": change = 3108]

Você pode ver o identificador do `git-p4` em cada commit. É bom manter esse identificador lá, caso haja necessidade de referenciar o número de mudança Perforce mais tarde. No entanto, se você gostaria de remover o identificador, agora é a hora de fazê-lo — antes de você começar a trabalhar no novo repositório. Você pode usar `git filter-branch` para remover as strings identificadoras em massa:

    $ git filter-branch --msg-filter '
            sed -e "/^\[git-p4:/d"
    '
    Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
    Ref 'refs/heads/master' was rewritten

Se você executar o `git log`, você pode ver que todas as checksums SHA-1 dos commits mudaram, mas as strings do `git-p4` não estão mais nas mensagens de commit:

    $ git log -2
    commit 10a16d60cffca14d454a15c6164378f4082bc5b0
    Author: Perforce staff <support@perforce.com>
    Date:   Thu Aug 19 10:18:45 2004 -0800

        Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
        the main part of the document.  Built new tar/zip balls.

        Only 16 months later.

    commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
    Author: Richard Geiger <rmg@perforce.com>
    Date:   Tue Apr 22 20:51:34 2003 -0800

        Update derived jamgram.c

Sua importação está pronta para ser enviada (push) para o seu novo servidor Git.

## Um Importador Customizado

Se o sistema não é o Subversion ou Perforce, você deve procurar um importador online — importadores de qualidade estão disponíveis para CVS, Clear Case, Visual Source Safe, e até mesmo um diretório de arquivos. Se nenhuma destas ferramentas funcionar para você, você tem uma ferramenta mais rara, ou você precisa de um processo de importação personalizado, você deve usar `git fast-import`. Este comando lê instruções simples da stdin para gravar dados Git específicos. É muito mais fácil criar objetos Git desta forma do que executar os comandos crús do Git ou tentar escrever os objetos crús (ver *Capítulo 9* para mais informações). Dessa forma, você pode escrever um script de importação que lê as informações necessárias do sistema de que está importando e imprimir instruções simples no stdout. Você pode então executar este programa e redirecionar sua saída através do `git fast-import`.

Para demonstrar rapidamente, você vai escrever um importador simples. Suponha que você faz backup do seu projeto de vez em quando copiando o diretório em um diretório de backup nomeado por data `back_YYYY_MM_DD`, e você deseja importar ele no Git. Sua estrutura de diretórios fica assim:

    $ ls /opt/import_from
    back_2009_01_02
    back_2009_01_04
    back_2009_01_14
    back_2009_02_03
    current

Para importar um diretório Git, você precisa rever como o Git armazena seus dados. Como você pode lembrar, Git é fundamentalmente uma lista encadeada de objetos commit que apontam para um snapshot de um conteúdo. Tudo que você tem a fazer é dizer ao `fast-import` quais são os snapshots de conteúdo, que dados de commit apontam para eles, e a ordem em que estão dispostos. Sua estratégia será a de passar pelos snapshots um de cada vez e criar commits com o conteúdo de cada diretório, ligando cada commit de volta para a anterior.

Como você fez na seção "Um exemplo de Política Git Forçada" do *Capítulo 7*, vamos escrever isso em Ruby, porque é o que eu geralmente uso e tende a ser fácil de ler. Você pode escrever este exemplo muito facilmente em qualquer linguagem que você esteja familiarizado — ele só precisa imprimir a informação apropriada para o stdout. E, se você estiver rodando no Windows, isso significa que você terá que tomar cuidados especiais para não introduzir carriage returns no final de suas linhas — git fast-import só aceita line feeds (LF) e não aceita carriage return line feeds (CRLF) que o Windows usa.

Para começar, você vai mudar para o diretório de destino e identificar cada subdiretório, cada um dos quais é um instantâneo que você deseja importar como um commit. Você vai entrar em cada subdiretório e imprimir os comandos necessários para exportá-los. Seu loop básico principal fica assim:

    last_mark = nil

    # loop through the directories
    Dir.chdir(ARGV[0]) do
      Dir.glob("*").each do |dir|
        next if File.file?(dir)

        # move into the target directory
        Dir.chdir(dir) do
          last_mark = print_export(dir, last_mark)
        end
      end
    end

Você executa o `print_export` dentro de cada diretório, o que pega o manifest e marca do snapshot anterior e retorna o manifest e marca deste; dessa forma, você pode ligá-los corretamente. "Mark" é o termo `fast-import` para um identificador que você dá a um commit; como você cria commits, você dá a cada um uma marca que você pode usar para ligar ele a outros commits. Então, a primeira coisa a fazer em seu método `print_export` é gerar uma mark do nome do diretório:

    mark = convert_dir_to_mark(dir)

Você vai fazer isso criando uma matriz de diretórios e usar o valor do índice como a marca, porque uma marca deve ser um inteiro. Seu método deve se parecer com este:

    $marks = []
    def convert_dir_to_mark(dir)
      if !$marks.include?(dir)
        $marks << dir
      end
      ($marks.index(dir) + 1).to_s
    end

Agora que você tem uma representação usando um número inteiro de seu commit, você precisa de uma data para os metadados do commit. Como a data está expressa no nome do diretório, você vai utilizá-la. A próxima linha em seu arquivo `print_export` é

    date = convert_dir_to_date(dir)

where `convert_dir_to_date` is defined as

    def convert_dir_to_date(dir)
      if dir == 'current'
        return Time.now().to_i
      else
        dir = dir.gsub('back_', '')
        (year, month, day) = dir.split('_')
        return Time.local(year, month, day).to_i
      end
    end

Que retorna um valor inteiro para a data de cada diretório. A última peça de meta-dado que você precisa para cada commit são os dados do committer (autor do commit), que você codificar em uma variável global:

    $author = 'Scott Chacon <schacon@example.com>'

Agora você está pronto para começar a imprimir os dados de commit para o seu importador. As primeiras informações indicam que você está definindo um objeto commit e que branch ele está, seguido pela mark que você gerou, a informação do committer e mensagem de commit, e o commit anterior, se houver. O código fica assim:

    # print the import information
    puts 'commit refs/heads/master'
    puts 'mark :' + mark
    puts "committer #{$author} #{date} -0700"
    export_data('imported from ' + dir)
    puts 'from :' + last_mark if last_mark

Você coloca um valor estático (hardcode) do fuso horário (-0700), porque é mais fácil. Se estiver importando de outro sistema, você deve especificar o fuso horário como um offset.
A mensagem de confirmação deve ser expressa em um formato especial:

    data (size)\n(contents)

O formato consiste dos dados de texto, o tamanho dos dados a serem lidos, uma quebra de linha, e finalmente os dados. Como você precisa utilizar o mesmo formato para especificar o conteúdo de arquivos mais tarde, você pode criar um método auxiliar, `export_data`:

    def export_data(string)
      print "data #{string.size}\n#{string}"
    end

Tudo o que resta é especificar o conteúdo do arquivo para cada snapshot. Isso é fácil, porque você tem cada um em um diretório — você pode imprimir o comando `deleteall` seguido do conteúdo de cada arquivo no diretório. Git, então, grava cada instantâneo apropriadamente:

    puts 'deleteall'
    Dir.glob("**/*").each do |file|
      next if !File.file?(file)
      inline_data(file)
    end

Nota: Como muitos sistemas tratam suas revisões, como mudanças de um commit para outro, fast-import também pode receber comandos com cada commit para especificar quais arquivos foram adicionados, removidos ou modificados e o que os novos conteúdos são. Você poderia calcular as diferenças entre os snapshots e fornecer apenas estes dados, mas isso é mais complexo — assim como você pode dar ao Git todos os dados e deixá-lo descobrir. Se isto for mais adequado aos seus dados, verifique a man page (manual) do `fast-import` para obter detalhes sobre como fornecer seus dados desta forma.

O formato para listar o conteúdo de arquivos novos ou especificar um arquivo modificado com o novo conteúdo é o seguinte:

    M 644 inline path/to/file
    data (size)
    (file contents)

Aqui, 644 é o modo (se você tiver arquivos executáveis, é preciso detectá-los e especificar 755), e inline diz que você vai listar o conteúdo imediatamente após esta linha. O seu método `inline_data` deve se parecer com este:

    def inline_data(file, code = 'M', mode = '644')
      content = File.read(file)
      puts "#{code} #{mode} inline #{file}"
      export_data(content)
    end

Você reutiliza o método `export_data` definido anteriormente, porque é da mesma forma que você especificou os seus dados de mensagem de commit.

A última coisa que você precisa fazer é retornar a mark atual para que possa ser passada para a próxima iteração:

    return mark

NOTA: Se você estiver usando Windows, você vai precisar se certificar de que você adiciona um passo extra. Como já relatado anteriormente, o Windows usa CRLF para quebras de linha enquanto git fast-import aceita apenas LF. Para contornar este problema e usar git fast-import, você precisa dizer ao ruby para usar LF em vez de CRLF:

    $stdout.binmode

Isso é tudo. Se você executar este script, você vai ter um conteúdo parecido com isto:

    $ ruby import.rb /opt/import_from
    commit refs/heads/master
    mark :1
    committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
    data 29
    imported from back_2009_01_02deleteall
    M 644 inline file.rb
    data 12
    version two
    commit refs/heads/master
    mark :2
    committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
    data 29
    imported from back_2009_01_04from :1
    deleteall
    M 644 inline file.rb
    data 14
    version three
    M 644 inline new.rb
    data 16
    new version one
    (...)

Para executar o importador, redirecione a saída através do `git fast-import` enquanto estiver no diretório Git que você quer importar. Você pode criar um novo diretório e executar `git init` nele para iniciar, e depois executar o script:

    $ git init
    Initialized empty Git repository in /opt/import_to/.git/
    $ ruby import.rb /opt/import_from | git fast-import
    git-fast-import statistics:
    ---------------------------------------------------------------------
    Alloc'd objects:       5000
    Total objects:           18 (         1 duplicates                  )
          blobs  :            7 (         1 duplicates          0 deltas)
          trees  :            6 (         0 duplicates          1 deltas)
          commits:            5 (         0 duplicates          0 deltas)
          tags   :            0 (         0 duplicates          0 deltas)
    Total branches:           1 (         1 loads     )
          marks:           1024 (         5 unique    )
          atoms:              3
    Memory total:          2255 KiB
           pools:          2098 KiB
         objects:           156 KiB
    ---------------------------------------------------------------------
    pack_report: getpagesize()            =       4096
    pack_report: core.packedGitWindowSize =   33554432
    pack_report: core.packedGitLimit      =  268435456
    pack_report: pack_used_ctr            =          9
    pack_report: pack_mmap_calls          =          5
    pack_report: pack_open_windows        =          1 /          1
    pack_report: pack_mapped              =       1356 /       1356
    ---------------------------------------------------------------------

Como você pode ver, quando for concluído com êxito, ele mostra um monte de estatísticas sobre o que ele realizou. Neste caso, você importou um total de 18 objetos para 5 commits em 1 branch. Agora, você pode executar `git log` para ver seu novo hostórico:

    $ git log -2
    commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
    Author: Scott Chacon <schacon@example.com>
    Date:   Sun May 3 12:57:39 2009 -0700

        imported from current

    commit 7e519590de754d079dd73b44d695a42c9d2df452
    Author: Scott Chacon <schacon@example.com>
    Date:   Tue Feb 3 01:00:00 2009 -0700

        imported from back_2009_02_03

Ai está — um repositório Git limpo. É importante notar que não é feito check-out de nada — você não tem arquivos em seu diretório de trabalho no início. Para obtê-los, você deve redefinir o seu branch para `master`:

    $ ls
    $ git reset --hard master
    HEAD is now at 10bfe7d imported from current
    $ ls
    file.rb  lib

Você pode fazer muito mais com a ferramenta `fast-import` — lidar com diferentes modos, dados binários, múltiplos branches e mesclagem (merging), tags, indicadores de progresso, e muito mais. Uma série de exemplos de cenários mais complexos estão disponíveis no diretório `contrib/fast-import` do código-fonte Git, um dos melhores é o script `git-p4` que acabei de mostrar.
