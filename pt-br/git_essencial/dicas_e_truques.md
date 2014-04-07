# Dicas e Truques

Antes de terminarmos este capítulo em Git Essencial, algumas dicas e truques podem tornar a sua experiência com Git um pouco mais simples, fácil e familiar. Muitas pessoas usam Git sem nenhuma dessas dicas, e não iremos referir à elas ou assumir que você as usou mais tarde no livro; mas você deve ao menos saber como executá-las.

## Preenchimento Automático

Se você usa um shell Bash, você pode habilitar um script de preenchimento automático que vem com o Git. Faça download do código fonte, e olhe no diretório `contrib/completion`; lá deve existir um arquivo chamado `git-completion.bash`. Copie este arquivo para o seu diretório home, e adicione a linha abaixo ao seu arquivo `.bashrc`:

    source ~/.git-completion.bash

Se você quiser configurar Git para automaticamente ter preenchimento automático para todos os usuários, copie o script para o diretório `/opt/local/etc/bash_completion.d` em Mac ou para o diretório `/etc/bash_completion.d/` em Linux. Este é o diretório de scripts que o Bash automaticamente carregará para prover o preenchimento automático.

Se você estiver usando Windows com Git Bash, que é o padrão quando instalando Git no Windows com msysGit, o preenchimento automático deve estar pré-configurado.

Pressiona a tecla Tab quando estiver escrevendo um comando Git, e ele deve retornar uma lista de sugestões para você escolher:

    $ git co<tab><tab>
    commit config

Neste caso, escrevendo `git co` e pressionando a tecla Tab duas vezes, ele sugere commit e config. Adicionando `m<tab>` completa `git commit` automaticamente.

Isto também funciona com opções, o que é provavelmente mais útil. Por exemplo, se você estiver executando o comando `git log` e não consegue lembrar uma das opções, você pode começar a escrever e pressionar Tab para ver o que corresponde:

    $ git log --s<tab>
    --shortstat  --since=  --src-prefix=  --stat   --summary

Este é um truque bem bacana e irá te poupar tempo e leitura de documentação.

## Pseudônimos no Git

O Git não interfere em seu comando se você digitá-lo parcialmente. Se você não quiser digitar o texto todo de cada comando Git, você pode facilmente criar um pseudônimo para cada um usando `git config`. Abaixo alguns exemplos que você pode usar:

    $ git config --global alias.co checkout
    $ git config --global alias.br branch
    $ git config --global alias.ci commit
    $ git config --global alias.st status

Isto significa que, por exemplo, ao invés de digitar `git commit`, você só precisa digitar `git ci`. Quanto mais você usar Git, você provavelmente usará outros comandos com frequência também; neste caso, não hesite em criar novos pseudônimos.

Esta técnica também pode ser útil para criar comandos que você acha que devem existir. Por exemplo, para corrigir o problema de usabilidade que você encontrou durante o unstanging de um arquivo, você pode adicionar o seu próprio pseudônimo unstage para o Git:

    $ git config --global alias.unstage 'reset HEAD --'

Isto faz dos dois comandos abaixo equivalentes:

    $ git unstage fileA
    $ git reset HEAD fileA

Parece mais claro. É também comum adicionar um comando `last`, assim:

    $ git config --global alias.last 'log -1 HEAD'

Desse jeito, você pode ver o último comando mais facilmente:

    $ git last
    commit 66938dae3329c7aebe598c2246a8e6af90d04646
    Author: Josh Goebel <dreamer3@example.com>
    Date:   Tue Aug 26 19:48:51 2008 +0800

        test for current head

        Signed-off-by: Scott Chacon <schacon@example.com>

Como você pode ver, Git simplesmente substitui o novo comando com o pseudônimo que você deu à ele. Entretanto, talvez você queira rodar um comando externo ao invés de um sub comando do Git. Neste caso, você começa o comando com `!`. Isto é útil se você escreve suas próprias ferramentas que trabalham com um repositório Git. Podemos demonstrar criando o pseudônimo `git visual` para rodar `gitk`:

    $ git config --global alias.visual '!gitk'
