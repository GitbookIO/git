# Desfazendo Coisas

Em qualquer fase, você pode querer desfazer alguma coisa. Aqui, veremos algumas ferramentas básicas para desfazer modificações que você fez. Cuidado, porque você não pode desfazer algumas dessas mudanças. Essa é uma das poucas áreas no Git onde você pode perder algum trabalho se fizer errado.

## Modificando Seu Último Commit

Uma das situações mais comuns para desfazer algo, acontece quando você faz o commit muito cedo e possivelmente esqueceu de adicionar alguns arquivos, ou você bagunçou sua mensagem de commit. Se você quiser tentar fazer novamente esse commit, você pode executá-lo com a opção `--amend`:

    $ git commit --amend

Esse comando pega sua área de seleção e a utiliza no commit. Se você não fez nenhuma modificação desde seu último commit (por exemplo, você rodou esse comando imediatamente após seu commit anterior), seu snapshot será exatamente o mesmo e tudo que você mudou foi sua mensagem de commit.

O mesmo editor de mensagem de commits abre, mas ele já tem a mensagem do seu commit anterior. Você pode editar a mensagem como sempre, mas ela substituirá seu último commit.

Por exemplo, se você fez um commit e esqueceu de adicionar na área de seleção as modificações de um arquivo que gostaria de ter adicionado nesse commit, você pode fazer algo como isso:

    $ git commit -m 'initial commit'
    $ git add forgotten_file
    $ git commit --amend

Depois desses três comandos você obterá um único commit — o segundo commit substitui os resultados do primeiro.

## Tirando um arquivo da área de seleção

As duas próximas seções mostram como trabalhar nas suas modificações na área de seleção e diretório de trabalho. A parte boa é que o comando que você usa para ver a situação nessas duas áreas também lembra como desfazer suas alterações. Por exemplo, vamos dizer que você alterou dois arquivos e quer fazer o commit deles como duas modificações separadas, mas você acidentalmente digitou `git add *` e colocou os dois na área de seleção. Como você pode retirar um deles? O comando `git status` lembra você:

    $ git add .
    $ git status
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #       modified:   README.txt
    #       modified:   benchmarks.rb
    #

Logo abaixo do texto “Changes to be committed”, ele diz `use git reset HEAD <file>... to unstage` ("use `git reset HEAD <file>...` para retirá-los do estado unstaged"). Então, vamos usar esse conselho para retirar o arquivo `benchmarks.rb`:

    $ git reset HEAD benchmarks.rb
    benchmarks.rb: locally modified
    $ git status
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #       modified:   README.txt
    #
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #       modified:   benchmarks.rb
    #

O comando é um pouco estranho, mas funciona. O arquivo `benchmarks.rb` está modificado, mas, novamente fora da área de seleção.

## Desfazendo um Arquivo Modificado

E se você perceber que não quer manter suas modificações no arquivo `benchmarks.rb`? Como você pode facilmente desfazer isso — revertê-lo para o que era antes de fazer o último commit (ou do inicio do clone, ou seja la como você o conseguiu no seu diretório de trabalho)? Felizmente, `git status` diz a você como fazer isso, também. Na saída do último exemplo, a área de trabalho se parecia com isto:

    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #       modified:   benchmarks.rb
    #

Ele diz explicitamente como descartar as modificações que você fez (pelo menos, as novas versões do Git, 1.6.1 em diante, fazem isso — se você tem uma versão mais antiga, uma atualização é altamente recomendável para ter alguns desses bons recursos de usabilidade). Vamos fazer o que ele diz:

    $ git checkout -- benchmarks.rb
    $ git status
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #       modified:   README.txt
    #

Você pode ver que as alterações foram revertidas. Perceba também que esse comando é perigoso: qualquer alteração que você fez nesse arquivo foi desfeita — você acabou de copiar outro arquivo sobre ele. Nunca use esse comando a menos que você tenha certeza absoluta que não quer o arquivo. Se você só precisa tirá-lo do caminho, vamos falar sobre stash e branch no próximo capítulo; geralmente essas são maneiras melhores de agir.

Lembre-se, qualquer coisa que foi incluída com um commit no Git quase sempre pode ser recuperada. Até mesmo commits que estavam em branches que foram apagados ou commits que foram sobrescritos com um commit `--amend` podem ser recuperados (consulte o *Capítulo 9* para recuperação de dados). No entanto, qualquer coisa que você perder que nunca foi commitada, provavelmente nunca mais será vista novamente.
