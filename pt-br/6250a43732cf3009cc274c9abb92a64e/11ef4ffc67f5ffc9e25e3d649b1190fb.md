# Configuração do Git

Como você viu brevemente no Capítulo 1, você pode configurar o Git com o comando `git config`. Uma das primeiras coisas que você fez foi configurar seu nome e endereço de email:

    $ git config --global user.name "John Doe"
    $ git config --global user.email johndoe@example.com

Agora você vai aprender algumas opções mais interessantes que você pode definir dessa maneira para customizar o uso do Git.

Você viu alguns detalhes simples de configuração do Git no primeiro capítulo, mas vou passar por eles de novo rapidamente. Git usa uma série de arquivos de configuração para determinar comportamentos não-padrão que você pode querer utilizar. O primeiro lugar que o Git procura por estes valores é no arquivo `/etc/gitconfig`, que contém os valores para todos os usuários do sistema e todos os seus repositórios. Se você passar a opção `--system` para `git config`, ele lê e escreve a partir deste arquivo especificamente.

O próximo lugar que o Git olha é no arquivo `~/.gitconfig`, que é específico para cada usuário. Você pode fazer o Git ler e escrever neste arquivo, passando a opção `--global`.

Finalmente, Git procura por valores de configuração no arquivo de configuração no diretório Git (`.git/config`) de qualquer repositório que você esteja usando atualmente. Estes valores são específicos para esse repositório. Cada nível substitui valores no nível anterior, então, valores em `.git/config` sobrepõem valores em `/etc/gitconfig`. Você também pode definir esses valores manualmente, editando o arquivo e inserindo a sintaxe correta mas, é geralmente mais fácil executar o comando `git config`.

## Configuração Básica do Cliente

As opções de configuração reconhecidas pelo Git se dividem em duas categorias: lado cliente e lado servidor. A maioria das opções são do lado cliente e utilizadas para configurar suas preferências pessoais de trabalho. Apesar de haverem muitas opções disponíveis, só cobrirei as que são comumente usadas ​​ou podem afetar significativamente o fluxo de trabalho. Muitas opções são úteis apenas em casos extremos que não mostraremos aqui. Se você quiser ver uma lista de todas as opções que a sua versão do Git reconhece, você pode executar

    $ git config --help

A página do manual do `git config` lista todas as opções disponíveis com um pouco de detalhe.

### core.editor

Por padrão, o Git usa o editor de texto que você definiu como padrão no Shell ou então reverte para o editor Vi para criar e editar suas mensagens de commit e tags. Para alterar esse padrão, você pode usar a opção `core.editor`:

    $ git config --global core.editor emacs

Agora, não importa o que esteja definido como seu editor padrão, o Git usará o editor Emacs.

### commit.template

Se você ajustar esta opção como um caminho de um arquivo em seu sistema, o Git vai usar esse arquivo como o padrão de mensagem quando você fizer um commit. Por exemplo, suponha que você crie um arquivo de modelo em `$HOME/.gitmessage.txt` que se parece com este:

    subject line

    what happened

    [ticket: X]

Para dizer ao Git para usá-lo como a mensagem padrão que aparece em seu editor quando você executar o `git commit`, defina o valor de configuração `commit.template`:

    $ git config --global commit.template $HOME/.gitmessage.txt
    $ git commit

Então, o editor irá abrir com algo parecido com isto quando você fizer um commit:

    subject line

    what happened

    [ticket: X]
    # Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    # modified:   lib/test.rb
    #
    ~
    ~
    ".git/COMMIT_EDITMSG" 14L, 297C

Se você tiver uma política de mensagens de commit, colocando um modelo para essa política em seu sistema e configurando o Git para usá-lo por padrão pode ajudar a aumentar a chance de que a política seja seguida regularmente.

### core.pager

A configuração core.pager determina qual pager é usado quando a saída do Git possui várias páginas, como quando são usados os comandos `log` e `diff`. Você pode configurá-lo para `more` ou para o seu pager favorito (por padrão, é `less`), ou você pode desativá-lo, definindo uma string em branco:

    $ git config --global core.pager ''

Se você executar isso, Git irá paginar toda a saída de todos os comandos, não importando quão longo eles sejam.

### user.signingkey

Se você estiver fazendo annotated tags assinadas (como discutido no Capítulo 2), definir a sua chave de assinatura GPG como uma configuração torna as coisas mais fáceis. Defina o ID da chave assim:

    $ git config --global user.signingkey <gpg-key-id>

Agora, você pode assinar tags sem ter de especificar a sua chave toda hora com o comando `git tag`:

    $ git tag -s <tag-name>

### core.excludesfile

Você pode colocar padrões em seu arquivo de projeto `.gitignore` para que o Git veja-os como arquivos untracked ou tentar coloca-los como stagged quando executar o `git add` sobre eles, como discutido no Capítulo 2. No entanto, se você quiser que outro arquivo fora do seu projeto mantenha esses valores ou tenham valores extras, você pode dizer ao Git onde o arquivo com a opção `core.excludesfile` está. Basta configurá-lo para o caminho de um arquivo que tem conteúdo semelhante ao que um arquivo `.gitignore` teria.

### help.autocorrect

Esta opção está disponível apenas no Git 1.6.1 e posteriores. Se você digitar um comando no Git 1.6, ele mostrará algo como isto:

    $ git com
    git: 'com' is not a git-command. See 'git --help'.

    Did you mean this?
         commit

Se você definir `help.autocorrect` para 1, Git automaticamente executará o comando se houver apenas uma possibilidade neste cenário.

## Cores no Git

Git pode colorir a sua saída para o terminal, o que pode ajudá-lo visualmente a analisar a saída mais rápido e facilmente. Um número de opções pode ajudar a definir a colorização de sua preferência.

### color.ui

Git automaticamente coloriza a maioria de sua saída, se você pedir para ele. Você pode ser muito específico sobre o que você quer e como colorir; mas para ativar a coloração padrão do terminal, defina `color.ui` para true:

    $ git config --global color.ui true

Quando esse valor é definido, Git coloriza a saída do terminal. Outras configurações possíveis são false, que nunca coloriza a saída, e always, que coloriza sempre, mesmo que você esteja redirecionando comandos do Git para um arquivo ou através de um pipe para outro comando. Esta configuração foi adicionado na versão 1.5.5 do Git, se você tem uma versão mais antiga, você terá que especificar todas as configurações de cores individualmente.

Você dificilmente vai querer usar `color.ui = always`. Na maioria dos cenários, se você quiser códigos coloridos em sua saída redirecionada, você pode passar a opção `--color` para forçar o comando Git a usar códigos de cores. O `color.ui = true` é o que provavelmente você vai querer usar.

### `color.*`

Se você quiser ser mais específico sobre quais e como os comandos são colorizados, ou se você tem uma versão mais antiga do Git, o Git oferece configurações específicas para colorir. Cada uma destas pode ser ajustada para `true`, `false`, ou `always`:

    color.branch
    color.diff
    color.interactive
    color.status

Além disso, cada uma delas tem sub-opções que você pode usar para definir cores específicas para partes da saída, se você quiser substituir cada cor. Por exemplo, para definir a informação meta na sua saída do diff para texto azul, fundo preto e texto em negrito, você pode executar

    $ git config --global color.diff.meta “blue black bold”

Você pode definir a cor para qualquer um dos seguintes valores: normal, black, red, green, yellow, blue, magenta, cyan, ou white. Se você quiser um atributo como negrito no exemplo anterior, você pode escolher entre bold, dim, ul, blink, e reverse.

Veja a página de manual (manpage) do `git config` para saber todas as sub-opções que você pode configurar.

## Ferramenta Externa de Merge e Diff

Embora o Git tenha uma implementação interna do diff, que é o que você estava usando, você pode configurar uma ferramenta externa. Você pode configurar uma ferramenta gráfica de merge para resolução de conflitos, em vez de ter de resolver conflitos manualmente. Vou demonstrar a configuração do Perforce Visual Merge Tool (P4Merge) para fazer suas diffs e fazer merge de resoluções, porque é uma boa ferramenta gráfica e é gratuita.

Se você quiser experimentar, P4Merge funciona em todas as principais plataformas, então você deve ser capaz de usá-lo. Vou usar nomes de caminho nos exemplos que funcionam em sistemas Mac e Linux; para Windows, você vai ter que mudar `/usr/local/bin` para um caminho executável em seu ambiente.

Você pode baixar P4Merge aqui:

    http://www.perforce.com/perforce/downloads/component.html

Para começar, você vai configurar um script para executar seus comandos. Vou usar o caminho para o executável Mac; em outros sistemas, este será onde o seu binário do `p4merge` está instalado. Configure um script chamado `extMerge` que chama seu binário com todos os argumentos necessários:

    $ cat /usr/local/bin/extMerge
    #!/bin/sh/Applications/p4merge.app/Contents/MacOS/p4merge $*

Um wrapper diff verifica se sete argumentos são fornecidos e passa dois deles para o seu script de merge. Por padrão, o Git passa os seguintes argumentos para o programa diff:

    path old-file old-hex old-mode new-file new-hex new-mode

Já que você só quer os argumentos `old-file` e `new-file`, você pode usar o script para passar o que você precisa.

    $ cat /usr/local/bin/extDiff
    #!/bin/sh
    [ $# -eq 7 ] && /usr/local/bin/extMerge "$2" "$5"

Você também precisa ter certeza de que essas ferramentas são executáveis:

    $ sudo chmod +x /usr/local/bin/extMerge
    $ sudo chmod +x /usr/local/bin/extDiff

Agora você pode configurar o arquivo de configuração para usar a sua ferramenta de diff customizada. Existem algumas configurações personalizadas: `merge.tool` para dizer ao Git qual a estratégia a utilizar, `mergetool.*.cmd` para especificar como executar o comando, `mergetool.trustExitCode` para dizer ao Git se o código de saída do programa indica uma resolução de merge com sucesso ou não, e `diff.external` para dizer ao Git o comando a ser executado para diffs. Assim, você pode executar quatro comandos de configuração

    $ git config --global merge.tool extMerge
    $ git config --global mergetool.extMerge.cmd \
        'extMerge "$BASE" "$LOCAL" "$REMOTE" "$MERGED"'
    $ git config --global mergetool.trustExitCode false
    $ git config --global diff.external extDiff

ou você pode editar o seu arquivo `~/.gitconfig` para adicionar estas linhas.:

    [merge]
      tool = extMerge
    [mergetool "extMerge"]
      cmd = extMerge \"$BASE\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
      trustExitCode = false
    [diff]
      external = extDiff

Depois que tudo isso seja definido, se você executar comandos diff como este:

    $ git diff 32d1776b1^ 32d1776b1

Em vez de ter a saída do diff na linha de comando, Git inicia o P4Merge, como mostra a Figura 7-1.


![](http://git-scm.com/figures/18333fig0701-tn.png)

Figura 7-1. P4Merge

Se você tentar mesclar dois branches e, posteriormente, ter conflitos de mesclagem, você pode executar o comando `git mergetool`, que iniciará o P4Merge para deixá-lo resolver os conflitos através dessa ferramenta gráfica.

A coisa boa sobre esta configuração é que você pode mudar o seu diff e ferramentas de merge facilmente. Por exemplo, para mudar suas ferramentas `extdiff` e `extMerge` para executar a ferramenta KDiff3 no lugar delas, tudo que você tem a fazer é editar seu arquivo `extMerge`:

    $ cat /usr/local/bin/extMerge
    #!/bin/sh/Applications/kdiff3.app/Contents/MacOS/kdiff3 $*

Agora, o Git irá utilizar a ferramenta KDiff3 para visualizar diffs e resolução de conflitos de merge.

O Git vem pré-configurado para usar uma série de outras ferramentas de resolução de merge sem ter que definir a configuração cmd. Você pode definir a sua ferramenta de mesclagem para kdiff3, opendiff, tkdiff, meld, xxdiff, emerge, vimdiff, ou gvimdiff. Se você não estiver interessado em usar o KDiff3 para diff mas quer usá-lo apenas para a resolução de merges, e o comando kdiff3 está no seu path, então você pode executar

    $ git config --global merge.tool kdiff3

Se você executar isto ao invés de configurar os arquivos `extMerge` e `extDiff`, Git irá usar o KDiff3 para resolução de merges e a ferramenta diff padrão do Git.

## Formatação e Espaços em Branco

Formatação e problemas de espaço em branco são alguns dos problemas mais frustrantes e sutis que muitos desenvolvedores encontram ao colaborar, especialmente em ambientes multi-plataforma. É muito fácil que patches ou outros trabalhos de colabores introduzam mudanças sutis como espaços em branco porque os editores os inserem silenciosamente ou programadores Windows adicionam quebras de linha em projetos multi-plataforma. Git tem algumas opções de configuração para ajudar com estas questões.

### core.autocrlf

Se você está programando no Windows ou outro sistema, mas trabalha com pessoas que estão programando em Windows, você provavelmente vai encontrar problemas de quebra de linha em algum momento. Isso porque o Windows usa tanto o caráter carriage-return e um carácter linefeed para novas linhas em seus arquivos, enquanto os sistemas Mac e Linux usam apenas o carácter linefeed. Este é um fato sutil, mas extremamente irritante em trabalhos multi-plataforma.

O Git pode lidar com isso auto-convertendo finais de linha CRLF para LF quando você faz um commit, e vice-versa, quando se faz um checkout de código em seu sistema de arquivos. Você pode ativar esta funcionalidade com a configuração `core.autocrlf`. Se você estiver em uma máquina Windows, defina-o `true` — este converte terminações LF em CRLF quando você faz um checkout do código:

    $ git config --global core.autocrlf true

Se você estiver em um sistema Linux ou Mac que usam os finais de linha LF, então você não irá querer que o Git automaticamente converta-os quando você fizer o check-out dos arquivos, no entanto, se um arquivo com terminações CRLF acidentalmente for introduzido, então você pode querer que o Git corrija-o. Você pode dizer ao Git para converter CRLF para LF no commit, mas não o contrário definindo `core.autocrlf` para entrada:

    $ git config --global core.autocrlf input

Esta configuração deve deixá-lo com terminações CRLF em checkouts Windows, mas terminações LF em sistemas Mac e Linux e no repositório.

Se você é um programador Windows fazendo um projeto somente para Windows, então você pode desativar essa funcionalidade, registrando os CRLF no repositório, definindo o valor de configuração para `false`:

    $ git config --global core.autocrlf false

### core.whitespace

Git vem pré-configurado para detectar e corrigir alguns problemas de espaço em branco. Ele pode olhar por quatro problemas principais relacionados a espaços em branco — duas são ativadas por padrão e podem ser desativadas, e duas não são ativadas por padrão, mas podem ser ativadas.

As duas que são ativadas por padrão são `trailing-space`, que procura por espaços no final de uma linha, e `space-before-tab`, que procura por espaços antes de tabulações no início de uma linha.

As duas que estão desativadas por padrão, mas podem ser ativadas são `indent-with-non-tab`, que procura por linhas que começam com oito ou mais espaços em vez de tabulações, e `cr-at-eol`, que diz ao Git que carriage returns no final das linhas estão OK.

Você pode dizer ao Git quais destes você quer habilitado alterando a opção `core.whitespace` para os valores que deseja on ou off, separados por vírgulas. Você pode desabilitar as configurações, quer deixando-as fora da string de definição ou adicionando um `-` na frente do valor. Por exemplo, se você quiser tudo, menos `cr-at-eol`, você pode fazer isso:

    $ git config --global core.whitespace \
        trailing-space,space-before-tab,indent-with-non-tab

Git irá detectar esses problemas quando você executar um comando `git diff` e tentar colori-los de modo que você pode, eventualmente, corrigi-los antes de fazer o commit. Ele também irá usar esses valores para ajudar quando você aplicar patches com `git apply`. Quando você estiver aplicando patches, você pode pedir ao Git para avisá-lo se estiver aplicando patches com problemas de espaço em branco:

    $ git apply --whitespace=warn <patch>

Ou você pode deixar o Git tentar corrigir automaticamente o problema antes de aplicar o patch:

    $ git apply --whitespace=fix <patch>

Essas opções se aplicam ao comando git rebase também. Se você commitou problemas de espaço em branco, mas ainda não fez um push, você pode executar um `rebase` com a opção `--whitespace=fix` para que o Git automaticamente corrija problemas de espaço em branco, como faz com os patches.

## Configuração do Servidor

Não existem muitas opções de configuração disponíveis para o lado servidor do Git, mas há algumas interessantes que você pode querer aprender.

### receive.fsckObjects

Por padrão, o Git não verifica a consistência de todos os objetos que ele recebe durante um push. Embora o Git possa certificar-se de que cada objeto ainda corresponde ao seu SHA-1 checksum e aponta para objetos válidos, ele não faz isso por padrão em cada push. Esta é uma operação relativamente custosa e pode adicionar uma grande quantidade de tempo para cada push, de acordo com o tamanho do repositório ou do push. Se você quiser que o Git verifique a consistência dos objetos em cada push, você pode forçá-lo a fazê-lo definindo `receive.fsckObjects` como true:

    $ git config --system receive.fsckObjects true

Agora, o Git irá verificar a integridade do seu repositório antes que cada push seja aceito para garantir que clientes defeituosos não estejam introduzindo dados corrompidos.

### receive.denyNonFastForwards

Se você fizer o rebase de commits já enviados com push e então tentar fazer outro push, ou tentar fazer um push de um commit para um branch remoto que não contenha o commit que o branch remoto atualmente aponta, sua ação será negada. Isso geralmente é uma boa política; mas, no caso do rebase, você pode determinar que você saiba o que está fazendo e pode forçar a atualização do branch remoto com um `-f` no seu comando push.

Para desativar a capacidade de forçar updates em branches remotos para referências não fast-forward, defina `receive.denyNonFastForwards`:

    $ git config --system receive.denyNonFastForwards true

A outra forma de fazer isso é através dos hooks em lado servidor, que eu vou falar daqui a pouco. Essa abordagem permite que você faça coisas mais complexas como negar não fast-forwards para um determinado conjunto de usuários.

### receive.denyDeletes

Uma das soluções para a política `denyNonFastForwards` é o usuário excluir o branch e depois fazer um push de volta com a nova referência. Nas versões mais recentes do Git (a partir da versão 1.6.1), você pode definir `receive.denyDeletes` como true:

    $ git config --system receive.denyDeletes true

Isto nega exclusão de branchs e tags em um push — nenhum usuário pode fazê-lo. Para remover branches remotas, você deve remover os arquivos ref do servidor manualmente. Existem também formas mais interessantes de fazer isso de acordo com o usuário através de ACLs, como você vai aprender no final deste capítulo.
