# Hooks do Git

Como muitos outros sistemas de controle de versão, Git tem uma maneira para disparar scripts personalizados quando certas ações importantes ocorrerem. Existem dois grupos desses hooks: lado cliente e lado servidor. Os hooks do lado cliente são para operações do cliente, tais como commit e merge. Os hooks do lado servidor são para operações de servidor, como recebimento de um push. Você pode usar estes hooks para todo tipo de coisa, e você vai aprender sobre alguns deles aqui.

## Instalando um Hook

Os hooks são todos armazenados no subdiretório `hooks` do diretório Git. Na maioria dos projetos, é em `.git/hooks`. Por padrão, o Git preenche este diretório com um monte de scripts de exemplo, muitos dos quais são úteis por si só, mas eles também documentam os valores de entrada de cada script. Todos os exemplos são escritos como shell scripts, com um pouco de Perl, mas todos os scripts executáveis ​​devidamente nomeados irão funcionar bem — você pode escrevê-los em Ruby ou Python ou em que você quiser. Para as versões do Git superiores a 1.6, esses hooks de exemplo terminam com .sample; você precisa renomeá-los. Para versões anteriores a 1.6 do Git, os arquivos de exemplo são nomeados corretamente, mas não são executáveis.

Para ativar um script de hook, coloque um arquivo no subdiretório `hooks` do seu diretório Git que é nomeado de forma adequada e é executável. A partir desse ponto, ele deve ser chamado. Eu vou cobrir a maior parte dos nomes dos arquivos de hook importantes aqui.

## Hooks do Lado Cliente

Há um monte de hooks do lado do cliente. Esta seção divide eles em committing-workflow hooks, e-mail-workflow scripts, e o resto dos scripts do lado cliente.

### Committing-Workflow Hooks

Os primeiros quatro hooks têm a ver com o processo de commit. O hook `pre-commit` é executado primeiro, antes mesmo de digitar uma mensagem de confirmação. É usado para inspecionar o snapshot que está prestes a ser commitado, para ver se você se esqueceu de alguma coisa, para ter certeza que os testes rodem, ou para analisar o que você precisa inspecionar no código. Retornando um valor diferente de zero a partir deste hook aborta o commit, mas você pode ignorá-lo com `git commit --no-verify`. Você pode fazer coisas como checar o estilo do código (executar lint ou algo equivalente), verificar o espaço em branco (o hook padrão faz exatamente isso), ou verificar a documentação apropriada sobre novos métodos.

O hook `prepare-commit-msg` é executado antes que o editor de mensagem de commit seja iniciado, mas depois que a mensagem padrão seja criada. Ele permite que você edite a mensagem padrão antes que autor do commit a veja. Este hook tem algumas opções: o caminho para o arquivo que contém a mensagem de confirmação até agora, o tipo de commit, e o SHA-1 do commit se este é um commit amended. Este hook geralmente não é útil para o commit normal, mas sim, para commits onde a mensagem padrão é gerada automaticamente, tal como um template de mensagem de commit, commits de merge, squashed commits, e amended commits. Você pode usá-lo em conjunto com um modelo de commit para inserir informações programaticamente.

O hook `commit-msg` tem um parâmetro, que novamente, é o caminho para um arquivo temporário que contém a mensagem atual de commit. Se este script não retornar zero, Git aborta o processo de commit, de modo que você pode usá-lo para validar o seu estado de projeto ou mensagem de commit antes de permitir que um commit prossiga. Na última seção deste capítulo, vou demonstrar usando este hook como verificar se a sua mensagem de commit está em conformidade com um padrão desejado.

Depois que todo o processo de commit esteja concluído, o hook `post-commit` é executado. Ele não recebe nenhum parâmetro, mas você pode facilmente obter o último commit executando `git log -1 HEAD`. Geralmente, esse script é usado para notificação ou algo similar.

Os scripts committing-workflow do lado cliente podem ser usados ​​em praticamente qualquer fluxo de trabalho. Eles são muitas vezes utilizados para reforçar certas políticas, embora seja importante notar que estes scripts não são transferidos durante um clone. Você pode aplicar a política do lado servidor para rejeitar um push de um commit que não corresponda a alguma política, mas é inteiramente de responsabilidade do desenvolvedor usar esses scripts no lado cliente. Portanto, estes são scripts para ajudar os desenvolvedores, e eles devem ser criados e mantidos por eles, embora eles possam ser substituídos ou modificados por eles a qualquer momento.

### E-mail Workflow Hooks

Você pode configurar três hooks do lado cliente para um fluxo de trabalho baseado em e-mail. Eles são todos invocados pelo comando `git am`, por isso, se você não está usando este comando em seu fluxo de trabalho, você pode pular para a próxima seção. Se você estiver recebendo patches por e-mail preparados por `git format-patch`, então alguns deles podem ser úteis para você.

O primeiro hook que é executado é `applypatch msg`. Ele recebe um único argumento: o nome do arquivo temporário que contém a mensagem de commit. Git aborta o patch se este script retornar valor diferente de zero. Você pode usar isso para se certificar de que uma mensagem de commit está formatada corretamente ou para normalizar a mensagem através do script.

O próximo hook a ser executado durante a aplicação de patches via `git am` é `pre-applypatch`. Ele não tem argumentos e é executado após a aplicação do patch, então, você pode usá-lo para inspecionar o snapshot antes de fazer o commit. Você pode executar testes ou inspecionar a árvore de trabalho com esse script. Se algo estiver faltando ou os testes não passarem, retornando um valor diferente de zero também aborta o script `git am` sem commmitar o patch.

O último hook a ser executado durante um `git am` é `post-applypatch`. Você pode usá-lo para notificar um grupo ou o autor do patch que você aplicou em relação ao que você fez. Você não pode parar o processo de patch com esse script.

### Outros Hooks de Cliente

O hook `pre-rebase` é executado antes de um rebase e pode interromper o processo terminando com valor diferente de zero. Você pode usar esse hook para não permitir rebasing de commits que já foram atualizados com um push. O hook `pre-rebase` de exemplo que o Git instala faz isso, embora ele assuma que o próximo é o nome do branch que você publicar. É provável que você precise mudar isso para seu branch estável ou publicado.

Depois de executar um `git checkout` com sucesso, o hook `post-checkout` é executado, você pode usá-lo para configurar o diretório de trabalho adequadamente para o seu ambiente de projeto. Isso pode significar mover arquivos binários grandes que você não quer controlar a versão, documentação auto-gerada, ou algo parecido.

Finalmente, o hook `post-merge` roda depois de um `merge` executado com sucesso. Você pode usá-lo para restaurar dados na árvore de trabalho que o GIT não pode rastrear, como dados de permissões. Este hook pode igualmente validar a presença de arquivos externos ao controle do Git que você pode querer copiado quando a árvore de trabalho mudar.

## Hooks do Lado Servidor

Além dos Hooks do lado do cliente, você pode usar alguns hooks importantes do lado servidor como administrador do sistema para aplicar quase qualquer tipo de política para o seu projeto. Esses scripts são executados antes e depois um push para o servidor. Os "pre hooks" podem retornar valor diferente de zero em qualquer momento para rejeitar um push, assim como imprimir uma mensagem de erro para o cliente, você pode configurar uma política de push tão complexa quanto você queira.

### pre-receive e post-receive

O primeiro script a ser executado ao tratar um push de um cliente é o `pre-receive`. É preciso uma lista de referências que estão no push a partir do stdin; se ele não retornar zero, nenhum deles são aceitos. Você pode usar esse hook para fazer coisas como verificar se nenhuma das referências atualizadas não são fast-forwards; ou para verificar se o usuário que está fazendo o push tem acesso para criar, apagar, ou fazer push de atualizações para todos os arquivos que ele está modificando com o push.

O hook `post-receive` roda depois que todo o processo esteja concluído e pode ser usado para atualizar outros serviços ou notificar os usuários. Ele recebe os mesmos dados do stdin que o hook `pre-receive`. Exemplos incluem envio de e-mails, notificar um servidor de integração contínua, ou atualização de um sistema de ticket-tracking — você pode até analisar as mensagens de confirmação para ver se algum ticket precisa ser aberto, modificado ou fechado. Este script não pode parar o processo de push, mas o cliente não se disconecta até que tenha concluído; por isso, tenha cuidado quando você tentar fazer algo que possa levar muito tempo.

### update

O script update é muito semelhante ao script `pre-receive`, exceto que ele é executado uma vez para cada branch que o usuário está tentando atualizar. Se o usuário está tentando fazer um push para vários branchs, `pre-receive` é executado apenas uma vez, enquanto que update é executado uma vez por branch do push. Em vez de ler do stdin, este script recebe três argumentos: o nome da referência (branch), o SHA-1, que apontava para a referência antes do push, e o SHA-1 do push que o usuário está tentando fazer. Se o script update retornar um valor diferente de zero, apenas a referência é rejeitada; outras referências ainda podem ser atualizadas.
