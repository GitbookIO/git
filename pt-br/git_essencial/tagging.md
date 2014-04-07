# Tagging

Assim como a maioria dos VCS's, Git tem a habilidade de criar tags em pontos específicos na história do código como pontos importantes. Geralmente as pessoas usam esta funcionalidade para marcar pontos de release (`v1.0`, e por aí vai). Nesta seção, você aprenderá como listar as tags disponíveis, como criar novas tags, e quais são os tipos diferentes de tags.

## Listando Suas Tags

Listar as tags disponíveis em Git é fácil. Apenas execute o comando `git tag`:

    $ git tag
    v0.1
    v1.3

Este comando lista as tags em ordem alfabética; a ordem que elas aparecem não tem importância.

Você também pode procurar por tags com uma nomenclatura particular. O repositório de código do Git, por exemplo, contém mais de 240 tags. Se você está interessado em olhar apenas na série 1.4.2, você pode executar o seguinte:

    $ git tag -l 'v1.4.2.*'
    v1.4.2.1
    v1.4.2.2
    v1.4.2.3
    v1.4.2.4

## Criando Tags

Git têm dois tipos principais de tags: leve e anotada. Um tag leve é muito similar a uma branch que não muda — é um ponteiro para um commit específico. Tags anotadas, entretanto, são armazenadas como objetos inteiros no banco de dados do Git. Eles possuem uma chave de verificação; o nome da pessoa que criou a tag, email e data; uma mensagem relativa à tag; e podem ser assinadas e verificadas com o GNU Privacy Guard (GPG). É geralmente recomendado que você crie tags anotadas para que você tenha toda essa informação; mas se você quiser uma tag temporária ou por algum motivo você não queira armazenar toda essa informação, tags leves também estão disponíveis.

## Tags Anotadas

Criando uma tag anotada em Git é simples. O jeito mais fácil é especificar `-a` quando você executar o comando `tag`:

    $ git tag -a v1.4 -m 'my version 1.4'
    $ git tag
    v0.1
    v1.3
    v1.4

O parâmetro `-m` define uma mensagem, que é armazenada com a tag. Se você não especificar uma mensagem para uma tag anotada, o Git vai rodar seu editor de texto para você digitar alguma coisa.

Você pode ver os dados da tag junto com o commit que foi taggeado usando o comando `git show`:

    $ git show v1.4
    tag v1.4
    Tagger: Scott Chacon <schacon@gee-mail.com>
    Date:   Mon Feb 9 14:45:11 2009 -0800

    my version 1.4
    commit 15027957951b64cf874c3557a0f3547bd83b3ff6
    Merge: 4a447f7... a6b4c97...
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sun Feb 8 19:02:46 2009 -0800

        Merge branch 'experiment'

O comando mostra a informação da pessoa que criou a tag, a data de quando o commit foi taggeado, e a mensagem antes de mostrar a informação do commit.

## Tags Assinadas

Você também pode assinar suas tags com GPG, assumindo que você tenha uma chave privada. Tudo o que você precisa fazer é usar o parâmetro `-s` ao invés de `-a`:

    $ git tag -s v1.5 -m 'my signed 1.5 tag'
    You need a passphrase to unlock the secret key for
    user: "Scott Chacon <schacon@gee-mail.com>"
    1024-bit DSA key, ID F721C45A, created 2009-02-09

Se você rodar `git show` na tag, você poderá ver a sua assinatura GPG anexada:

    $ git show v1.5
    tag v1.5
    Tagger: Scott Chacon <schacon@gee-mail.com>
    Date:   Mon Feb 9 15:22:20 2009 -0800

    my signed 1.5 tag
    -----BEGIN PGP SIGNATURE-----
    Version: GnuPG v1.4.8 (Darwin)

    iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
    Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
    =WryJ
    -----END PGP SIGNATURE-----
    commit 15027957951b64cf874c3557a0f3547bd83b3ff6
    Merge: 4a447f7... a6b4c97...
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sun Feb 8 19:02:46 2009 -0800

        Merge branch 'experiment'

Um pouco mais pra frente você aprenderá como verificar tags assinadas.

## Tags Leves

Outro jeito para taggear commits é com a tag leve. Esta é basicamente a chave de verificação armazenada num arquivo — nenhuma outra informação é armazenada. Para criar uma tag leve, não informe os parâmetros `-a`, `-s`, ou `-m`:

    $ git tag v1.4-lw
    $ git tag
    v0.1
    v1.3
    v1.4
    v1.4-lw
    v1.5

Desta vez, se você executar `git show` na tag, você não verá nenhuma informação extra. O comando apenas mostra o commit:

    $ git show v1.4-lw
    commit 15027957951b64cf874c3557a0f3547bd83b3ff6
    Merge: 4a447f7... a6b4c97...
    Author: Scott Chacon <schacon@gee-mail.com>
    Date:   Sun Feb 8 19:02:46 2009 -0800

        Merge branch 'experiment'

## Verificando Tags

Para verificar uma tag assinada, você usa `git tag -v [nome-tag]`. Este comando usa GPG para verificar a sua assinatura. Você precisa da chave pública do assinador no seu chaveiro para este comando funcionar corretamente:

    $ git tag -v v1.4.2.1
    object 883653babd8ee7ea23e6a5c392bb739348b1eb61
    type commit
    tag v1.4.2.1
    tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

    GIT 1.4.2.1

    Minor fixes since 1.4.2, including git-mv and git-http with alternates.
    gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
    gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
    gpg:                 aka "[jpeg image of size 1513]"
    Primary key fingerprint: 3565 2A26 2040 E066 C9A7  4A7D C0C6 D9A4 F311 9B9A

Se você não tiver a chave pública, você receberá algo parecido com a resposta abaixo:

    gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
    gpg: Can't check signature: public key not found
    error: could not verify the tag 'v1.4.2.1'

## Taggeando Mais Tarde

Você também pode taggear commits mais tarde. Vamos assumir que o seu histórico de commits seja assim:

    $ git log --pretty=oneline
    15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
    a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
    0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
    6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
    0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
    4682c3261057305bdd616e23b64b0857d832627b added a todo file
    166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
    9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
    964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
    8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme

Agora, assuma que você esqueceu de criar uma tag para o seu projeto na versão 1.2 (`v1.2`), que foi no commit "updated rakefile". Você pode adicioná-la depois. Para criar a tag no commit, você especifica a chave de verificação (ou parte dela) no final do comando:

    $ git tag -a v1.2 9fceb02

Você pode confirmar que você criou uma tag para o seu commit:

    $ git tag
    v0.1
    v1.2
    v1.3
    v1.4
    v1.4-lw
    v1.5

    $ git show v1.2
    tag v1.2
    Tagger: Scott Chacon <schacon@gee-mail.com>
    Date:   Mon Feb 9 15:32:16 2009 -0800

    version 1.2
    commit 9fceb02d0ae598e95dc970b74767f19372d61af8
    Author: Magnus Chacon <mchacon@gee-mail.com>
    Date:   Sun Apr 27 20:43:35 2008 -0700

        updated rakefile
    ...

## Compartilhando Tags

Por padrão, o comando `git push` não transfere tags para os servidores remotos. Você deve enviar as tags explicitamente para um servidor compartilhado após tê-las criado. Este processo é igual ao compartilhamento de branches remotos – você executa `git push origin [nome-tag]`.

    $ git push origin v1.5
    Counting objects: 50, done.
    Compressing objects: 100% (38/38), done.
    Writing objects: 100% (44/44), 4.56 KiB, done.
    Total 44 (delta 18), reused 8 (delta 1)
    To git@github.com:schacon/simplegit.git
    * [new tag]         v1.5 -> v1.5

Se você tem muitas tags que você deseja enviar ao mesmo tempo, você pode usar a opção `--tags` no comando `git push`. Ele irá transferir todas as suas tags que ainda não estão no servidor remoto.

    $ git push origin --tags
    Counting objects: 50, done.
    Compressing objects: 100% (38/38), done.
    Writing objects: 100% (44/44), 4.56 KiB, done.
    Total 44 (delta 18), reused 8 (delta 1)
    To git@github.com:schacon/simplegit.git
     * [new tag]         v0.1 -> v0.1
     * [new tag]         v1.2 -> v1.2
     * [new tag]         v1.4 -> v1.4
     * [new tag]         v1.4-lw -> v1.4-lw
     * [new tag]         v1.5 -> v1.5

Agora, quando alguém clonar ou fizer um pull do seu repositório, eles irão ter todas as suas tags também.
