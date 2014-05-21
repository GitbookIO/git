# Gerenciamento de Branches

Agora que você criou, fez merge e apagou alguns branches, vamos ver algumas ferramentas de gerenciamento de branches que serão úteis quando você começar a usá-los o tempo todo.

O comando `git branch` faz mais do que criar e apagar branches. Se você executá-lo sem argumentos, você verá uma lista simples dos seus branches atuais:

    $ git branch
      iss53
    * master
      testing

Note o caractere `*` que vem antes do branch `master`: ele indica o branch que você está atualmente (fez o checkout). Isso significa que se você fizer um commit nesse momento, o branch `master` irá se mover adiante com seu novo trabalho. Para ver o último commit em cada branch, você pode executar o comando `git branch -v`:

    $ git branch -v
      iss53   93b412c concertar problema em javascript
    * master  7a98805 Merge branch 'iss53'
      testing 782fd34 adicionar scott para a lista de autores nos readmes

Outra opção útil para saber em que estado estão seus branches é filtrar na lista somente branches que você já fez ou não o merge no branch que você está atualmente. As opções `--merged` e `--no-merged` estão disponíveis no Git desde a versão 1.5.6 para esse propósito. Para ver quais branches já foram mesclados no branch que você está, você pode executar `git branch --merged`:

    $ git branch --merged
      iss53
    * master

Por você já ter feito o merge do branch `iss53` antes, você o verá na sua lista. Os branches nesta lista sem o `*` na frente em geral podem ser apagados com `git branch -d`; você já incorporou o trabalho que existia neles em outro branch, sendo assim você não perderá nada.

Para ver todos os branches que contém trabalho que você ainda não fez o merge, você pode executar `git branch --no-merged`:

    $ git branch --no-merged
      testing

Isso mostra seu outro branch. Por ele conter trabalho que ainda não foi feito o merge, tentar apagá-lo com `git branch -d` irá falhar:

    $ git branch -d testing
    error: The branch 'testing' is not an ancestor of your current HEAD.
    If you are sure you want to delete it, run `git branch -D testing`.

Se você quer realmente apagar o branch e perder o trabalho que existe nele, você pode forçar com `-D`, como a útil mensagem aponta.
