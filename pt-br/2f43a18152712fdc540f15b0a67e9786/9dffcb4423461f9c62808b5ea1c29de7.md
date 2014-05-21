# Encanamento (Plumbing) e Porcelana (Porcelain)

Este livro aborda como usar o Git com 30 ou mais verbos como `checkout`, `branch`, `remote`, e assim por diante. Mas como o Git foi pensado inicialmente um conjunto de ferramentas para um VCS, em vez de apenas um VCS amigável, ele tem um grupo de verbos que fazem o trabalho de baixo nível e foram projetados para serem encadeados (usando pipe) no estilo UNIX ou chamados a partir de scripts. Estes comandos são geralmente referidos como comandos de "encanamento" (plumbing), e os comandos mais amigáveis ​​são chamados de comandos "porcelana" (porcelain).

Os oito primeiros capítulos do livro tratam quase que exclusivamente com comandos porcelana. Mas, neste capítulo, você estará lidando principalmente com os comandos de nível inferior de encanamento, porque eles te dão acesso aos trabalhos internos do Git e ajudam a demonstrar como e por que o Git faz o que faz. Estes comandos não são destinados a ser usados manualmente na linha de comando, mas sim para serem usados como blocos de construção para novas ferramentas e scripts personalizados.

Quando você executa `git init` em um diretório novo ou existente, Git cria o diretório `.git`, que é onde quase tudo que o Git armazena e manipula está localizado. Se você deseja fazer o backup ou clonar seu repositório, copiar este diretório para outro lugar lhe dará quase tudo o que você precisa. Este capítulo inteiro trata basicamente do conteúdo deste diretório. Eis o que ele contém:

    $ ls
    HEAD
    branches/
    config
    description
    hooks/
    index
    info/
    objects/
    refs/

Você pode ver alguns outros arquivos lá, mas este é um novo repositório `git init` — é o que você vê por padrão. O diretório `branches` não é usado por versões mais recentes do Git, e o arquivo `description` só é usado pelo programa gitweb, então não se preocupe com eles. O arquivo `config` contém as opções de configuração específicas do projeto, e o diretório `info` contém um arquivo de exclusão global com padrões ignorados que você não deseja rastrear em um arquivo .gitignore. O diretório `hooks` contém os "hook scripts" de cliente ou servidor, que são discutidos em detalhes no *Capítulo 7*.

Isso deixa quatro entradas importantes: os arquivos `HEAD` e `index` e diretórios `objects` e `refs`. Estas são as peças centrais do Git. O diretório `objects` armazena todo o conteúdo do seu banco de dados, o diretório `refs` armazena os ponteiros para objetos de commit (branches), o arquivo `HEAD` aponta para o branch atual, e o arquivo `index` é onde Git armazena suas informações da área de preparação (staging area). Você vai agora ver cada uma dessas seções em detalhes para saber como o Git opera.
