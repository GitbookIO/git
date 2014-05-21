# Visualizando o Histórico de Commits

Depois que você tiver criado vários commits, ou se clonou um repositório com um histórico de commits existente, você provavelmente vai querer ver o que aconteceu. A ferramente mais básica e poderosa para fazer isso é o comando `git log`.

Estes exemplos usam um projeto muito simples chamado `simplegit`, que eu frequentemente uso para demonstrações. Para pegar o projeto, execute:

    git clone git://github.com/schacon/simplegit-progit.git

Quando você executar `git log` neste projeto, você deve ter uma saída como esta:

    $ git log
    commit ca82a6dff817ec66f44342007202690a93763949
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Mon Mar 17 21:52:11 2008 -0700

        changed the verison number

    commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sat Mar 15 16:40:33 2008 -0700

        removed unnecessary test code

    commit a11bef06a3f659402fe7563abf99ad00de2209e6
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sat Mar 15 10:31:28 2008 -0700

        first commit

Por padrão, sem argumentos, `git log` lista os commits feitos naquele repositório em ordem cronológica reversa. Isto é, os commits mais recentes primeiro. Como você pode ver, este comando lista cada commit com seu checksum SHA-1, o nome e e-mail do autor, a data e a mensagem do commit.

Um grande número e variedade de opções para o comando `git log` estão disponíveis para mostrá-lo exatamente o que você quer ver. Aqui, nós mostraremos algumas das opções mais usadas.

Uma das opções mais úteis é `-p`, que mostra o diff introduzido em cada commit. Você pode ainda usar `-2`, que limita a saída somente às duas últimas entradas.

    $ git log -p -2
    commit ca82a6dff817ec66f44342007202690a93763949
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Mon Mar 17 21:52:11 2008 -0700

        changed the verison number

    diff --git a/Rakefile b/Rakefile
    index a874b73..8f94139 100644
    --- a/Rakefile
    +++ b/Rakefile
    @@ -5,7 +5,7 @@ require 'rake/gempackagetask'
     spec = Gem::Specification.new do |s|
    -    s.version   =   "0.1.0"
    +    s.version   =   "0.1.1"
         s.author    =   "Scott Chacon"

    commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sat Mar 15 16:40:33 2008 -0700

        removed unnecessary test code

    diff --git a/lib/simplegit.rb b/lib/simplegit.rb
    index a0a60ae..47c6340 100644
    --- a/lib/simplegit.rb
    +++ b/lib/simplegit.rb
    @@ -18,8 +18,3 @@ class SimpleGit
         end

     end
    -
    -if $0 == __FILE__
    -  git = SimpleGit.new
    -  puts git.show
    -end
    \ No newline at end of file

Esta opção mostra a mesma informação, mas com um diff diretamente seguido de cada entrada. Isso é muito útil para revisão de código ou para navegar rapidamente e saber o que aconteceu durante uma série de commits que um colaborador adicionou.
Você pode ainda usar uma série de opções de sumarização com `git log`. Por exemplo, se você quiser ver algumas estatísticas abreviadas para cada commit, você pode usar a opção `--stat`

    $ git log --stat
    commit ca82a6dff817ec66f44342007202690a93763949
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Mon Mar 17 21:52:11 2008 -0700

        changed the verison number

     Rakefile |    2 +-
     1 files changed, 1 insertions(+), 1 deletions(-)

    commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sat Mar 15 16:40:33 2008 -0700

        removed unnecessary test code

     lib/simplegit.rb |    5 -----
     1 files changed, 0 insertions(+), 5 deletions(-)

    commit a11bef06a3f659402fe7563abf99ad00de2209e6
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sat Mar 15 10:31:28 2008 -0700

        first commit

     README           |    6 ++++++
     Rakefile         |   23 +++++++++++++++++++++++
     lib/simplegit.rb |   25 +++++++++++++++++++++++++
     3 files changed, 54 insertions(+), 0 deletions(-)

Como você pode ver, a opção `--stat` imprime abaixo de cada commit uma lista de arquivos modificados, quantos arquivos foram modificados, e quantas linhas nestes arquivos foram adicionadas e removidas. Ele ainda mostra um resumo destas informações no final.
Outra opção realmente útil é `--pretty`. Esta opção muda a saída do log para outro formato que não o padrão. Algumas opções pré-construídas estão disponíveis para você usar. A opção `oneline` mostra cada commit em uma única linha, o que é útil se você está olhando muitos commits. Em adição, as opções `short`, `full` e `fuller` mostram a saída aproximadamente com o mesmo formato, mas com menos ou mais informações, respectivamente:

    $ git log --pretty=oneline
    ca82a6dff817ec66f44342007202690a93763949 changed the verison number
    085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
    a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

A opção mais interessante é `format`, que permite que você especifique seu próprio formato de saída do log. Isto é especialmente útil quando você está gerando saída para análise automatizada (parsing) — porque você especifica o formato explicitamente, você sabe que ele não vai mudar junto com as atualizações do Git:

    $ git log --pretty=format:"%h - %an, %ar : %s"
    ca82a6d - Scott Chacon, 11 months ago : changed the verison number
    085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
    a11bef0 - Scott Chacon, 11 months ago : first commit

Tabela 2-1 lista algumas das opções mais importantes para formatação.

	Opção	Descrição da saída
	%H	Hash do commit
	%h	Hash do commit abreviado
	%T	Árvore hash
	%t	Árvore hash abreviada
	%P	Hashes pais
	%p	Hashes pais abreviados
	%an	Nome do autor
	%ae	Email do autor
	%ad	Data do autor (formato respeita a opção -date=)
	%ar	Data do autor, relativa
	%cn	Nome do committer
	%ce	Email do committer
	%cd	Data do committer
	%cr	Data do committer, relativa
	%s	Assunto

Você deve estar se perguntando qual a diferença entre _autor_ e _committer_. O _autor_ é a pessoa que originalmente escreveu o trabalho, enquanto o _commiter_ é a pessoa que por último aplicou o trabalho. Então, se você envia um patch para um projeto, e algum dos membros do núcleo o aplicam, ambos receberão créditos — você como o autor, e o membro do núcleo como o commiter. Nós cobriremos esta distinção um pouco mais no *Capítulo 5*.

As opções `oneline` e `format` são particularmente úteis com outra opção chamada `--graph`. Esta opção gera um agradável gráfico ASCII mostrando seu branch e histórico de merges, que nós podemos ver em nossa cópia do repositório do projeto Grit:

    $ git log --pretty=format:"%h %s" --graph
    * 2d3acf9 ignore errors from SIGCHLD on trap
    *  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
    |\
    | * 420eac9 Added a method for getting the current branch.
    * | 30e367c timeout code and tests
    * | 5a09431 add timeout protection to grit
    * | e1193f8 support for heads with slashes in them
    |/
    * d6016bc require time for xmlschema
    *  11d191e Merge branch 'defunkt' into local

Estas são apenas algumas opções de formatação de saída do `git log` — há muito mais. A tabela 2-2 lista as opções que nós cobrimos e algumas outras comuns que podem ser úteis, junto com a descrição de como elas mudam a saída do comando `log`.

	Opção	Descrição
	-p	Mostra o patch introduzido com cada commit.
	--stat	Mostra estatísticas de arquivos modificados em cada commit.
	--shortstat	Mostra somente as linhas modificadas/inseridas/excluídas do comando --stat.
	--name-only	Mostra a lista de arquivos modificados depois das informações do commit.
	--name-status	Mostra a lista de arquivos afetados com informações sobre adição/modificação/exclusão dos mesmos.
	--abbrev-commit	Mostra somente os primeiros caracteres do checksum SHA-1 em vez de todos os 40.
	--relative-date	Mostra a data em um formato relativo (por exemplo, “2 semanas atrás”) em vez de usar o formato de data completo.
	--graph	Mostra um gráfico ASCII do branch e histórico de merges ao lado da saída de log.
	--pretty	Mostra os commits em um formato alternativo. Opções incluem oneline, short, full, fuller, e format (onde você especifica seu próprio formato).

## Limitando a Saída de Log

Em adição às opções de formatação, `git log` tem inúmeras opções de limitações úteis — que são opções que lhe deixam mostrar somente um subconjunto de commits. Você já viu algumas — a opção `-2`, que mostra apenas os dois últimos commits. De fato, você pode fazer `-<n>`, onde `n` é qualquer inteiro para mostrar os últimos `n` commits. Na verdade, você provavelmente não usará isso frequentemente, porque por padrão o Git enfileira toda a saída em um paginador, e então você vê somente uma página da saída do log por vez.

No entanto, as opções de limites de tempo como `--since` e `--until` são muito úteis. Por exemplo, este comando pega a lista de commits feitos nas últimas duas semanas:

    $ git log --since=2.weeks

Este comando funciona com vários formatos — você pode especificar uma data específica(“2008-01-15”) ou uma data relativa como “2 years 1 day 3 minutes ago”.

Você pode ainda filtrar a lista de commits que casam com alguns critérios de busca. A opção `--author` permite que você filtre por algum autor específico, e a opção `--grep` deixa você buscar por palavras chave nas mensagens dos commits. (Note que se você quiser especificar ambas as opções author e grep simultâneamente, você deve adicionar `--all-match`, ou o comando considerará commits que casam com qualquer um.)

A última opção realmente útil para passar para `git log` como um filtro, é o caminho. Se você especificar um diretório ou um nome de arquivo, você pode limitar a saída a commits que modificaram aqueles arquivos. Essa é sempre a última opção, e geralmente é precedida por dois traços (`--`) para separar caminhos das opções.

Na Tabela 2-3 nós listamos estas e outras opções comuns para sua referência.

	Opção	Descrição
	-(n)	Mostra somente os últimos n commits.
	--since, --after	Limita aos commits feitos depois da data especificada.
	--until, --before	Limita aos commits feitos antes da data especificada.
	--author	Somente mostra commits que o autor casa com a string especificada.
	--committer	Somente mostra os commits em que a entrada do commiter bate com a string especificada.

Por exemplo, se você quer ver quais commits modificaram arquivos de teste no histórico do código fonte do Git que foram commitados por Julio Hamano em Outubro de 2008, e não foram merges, você pode executar algo como:

    $ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
       --before="2008-11-01" --no-merges -- t/
    5610e3b - Fix testcase failure when extended attribute
    acd3b9e - Enhance hold_lock_file_for_{update,append}()
    f563754 - demonstrate breakage of detached checkout wi
    d1a43f2 - reset --hard/read-tree --reset -u: remove un
    51a94af - Fix "checkout --track -b newbranch" on detac
    b0ad11e - pull: allow "git pull origin $something:$cur

Dos 20.000 commits mais novos no histórico do código fonte do Git, este comando mostra os 6 que casam com aqueles critérios.

## Usando Interface Gráfica para Visualizar o Histórico

Se você quiser usar uma ferramenta gráfica para visualizar seu histórico de commit, você pode querer dar uma olhada em um programa Tcl/Tk chamado `gitk` que é distribuído com o Git. Gitk é basicamente uma ferramenta visual para `git log`, e ele aceita aproximadamente todas as opções de filtros que `git log` aceita. Se você digitar `gitk` na linha de comando em seu projeto, você deve ver algo como a Figura 2-2.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Figura 2-2. O visualizador de histórico gitk.

Você pode ver o histórico de commit na metade de cima da janela juntamente com um agradável gráfico. O visualizador de diff na metade de baixo da janela mostra a você as mudanças introduzidas em qualquer commit que você clicar.
