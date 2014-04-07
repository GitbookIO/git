# Atributos Git

Algumas dessas configurações também podem ser especificadas para um path, de modo que o Git aplique essas configurações só para um subdiretório ou conjunto de arquivos. Essas configurações de path específicas são chamadas atributos Git e são definidas em um arquivo `.gitattributes` ou em um de seus diretórios (normalmente a raiz de seu projeto) ou no arquivo `.git/info/attributes` se você não desejar que o arquivo de atributos seja commitado com o seu projeto.

Usando atributos, você pode fazer coisas como especificar estratégias de merge separadas para arquivos individuais ou pastas no seu projeto, dizer ao Git como fazer diff de arquivos não textuais, ou mandar o Git filtrar conteúdos antes de fazer o checkout para dentro ou fora do Git. Nesta seção, você vai aprender sobre alguns dos atributos que podem ser configurados em seus paths de seu projeto Git e ver alguns exemplos de como usar esse recurso na prática.

## Arquivos Binários

Um truque legal para o qual você pode usar atributos Git é dizendo ao Git quais arquivos são binários (em casos que de outra forma ele não pode ser capaz de descobrir) e dando ao Git instruções especiais sobre como lidar com esses arquivos. Por exemplo, alguns arquivos de texto podem ser gerados por máquina e não é possível usar diff neles, enquanto que em alguns arquivos binários pode ser usado o diff — você verá como dizer ao Git qual é qual.

### Identificando Arquivos Binários

Alguns arquivos parecem com arquivos de texto, mas para todos os efeitos devem ser tratados como dados binários. Por exemplo, projetos Xcode no Mac contém um arquivo que termina em `.pbxproj`, que é basicamente um conjunto de dados de JSON (formato de dados em texto simples JavaScript), escrito no disco pela IDE que registra as configurações de buils e assim por diante. Embora seja tecnicamente um arquivo de texto, porque é tudo ASCII, você não quer tratá-lo como tal, porque ele é na verdade um banco de dados leve — você não pode fazer um merge do conteúdo, se duas pessoas o mudaram, e diffs geralmente não são úteis. O arquivo é para ser lido pelo computador. Em essência, você quer tratá-lo como um arquivo binário.

Para dizer ao Git para tratar todos os arquivos `pbxproj` como dados binários, adicione a seguinte linha ao seu arquivo `.gitattributes`:

    *.pbxproj -crlf -diff

Agora, o Git não vai tentar converter ou corrigir problemas CRLF; nem vai tentar calcular ou imprimir um diff para mudanças nesse arquivo quando você executar show ou git diff em seu projeto. Na série 1.6 do Git, você também pode usar uma macro que significa `-crlf -diff`:

    *.pbxproj binary

### Diff de Arquivos Binários

Na série 1.6 do Git, você pode usar a funcionalidade de atributos do Git para fazer diff de arquivos binários. Você faz isso dizendo ao Git como converter os dados binários em um formato de texto que pode ser comparado através do diff normal.

#### Arquivos do MS Word

Como este é um recurso muito legal e não muito conhecido, eu vou mostrar alguns exemplos. Primeiro, você vai usar esta técnica para resolver um dos problemas mais irritantes conhecidos pela humanidade: controlar a versão de documentos Word. Todo mundo sabe que o Word é o editor mais horrível que existe, mas, estranhamente, todo mundo o usa. Se você quiser controlar a versão de documentos do Word, você pode colocá-los em um repositório Git e fazer um commit de vez em quando; mas o que de bom tem isso? Se você executar `git diff` normalmente, você só verá algo como isto:

    $ git diff
    diff --git a/chapter1.doc b/chapter1.doc
    index 88839c4..4afcb7c 100644
    Binary files a/chapter1.doc and b/chapter1.doc differ

Você não pode comparar diretamente duas versões, a menos que você verifique-as manualmente, certo? Acontece que você pode fazer isso muito bem usando atributos Git. Coloque a seguinte linha no seu arquivo `.gitattributes`:

    *.doc diff=word

Isto diz ao Git que qualquer arquivo que corresponde a esse padrão (.doc) deve usar o filtro "word" quando você tentar ver um diff que contém alterações. O que é o filtro "word"? Você tem que configurá-lo. Aqui você vai configurar o Git para usar o programa `strings` para converter documentos do Word em arquivos de texto legível, o que poderá ser visto corretamente no diff:

    $ git config diff.word.textconv strings

Este comando adiciona uma seção no seu `.git/config` que se parece com isto:
    [diff "word"]
      textconv = strings

Nota: Há diferentes tipos de arquivos `.doc`, alguns usam uma codificação UTF-16 ou outras "páginas de código" e `strings` não vão encontrar nada de útil lá. Seu resultado pode variar.

Agora o Git sabe que se tentar fazer uma comparação entre os dois snapshots, e qualquer um dos arquivos terminam em `.doc`, ele deve executar esses arquivos através do filtro "word", que é definido como o programa `strings`. Isso cria versões em texto de arquivos do Word antes de tentar o diff.

Aqui está um exemplo. Eu coloquei um capítulo deste livro em Git, acrescentei algum texto a um parágrafo, e salvei o documento. Então, eu executei `git diff` para ver o que mudou:

    $ git diff
    diff --git a/chapter1.doc b/chapter1.doc
    index c1c8a0a..b93c9e4 100644
    --- a/chapter1.doc
    +++ b/chapter1.doc
    @@ -8,7 +8,8 @@ re going to cover Version Control Systems (VCS) and Git basics
     re going to cover how to get it and set it up for the first time if you don
     t already have it on your system.
     In Chapter Two we will go over basic Git usage - how to use Git for the 80%
    -s going on, modify stuff and contribute changes. If the book spontaneously
    +s going on, modify stuff and contribute changes. If the book spontaneously
    +Let's see if this works.

Git com sucesso e de forma sucinta me diz que eu adicionei a string "Let’s see if this works", o que é correto. Não é perfeito — ele acrescenta um monte de coisas aleatórias no final — mas certamente funciona. Se você pode encontrar ou escrever um conversor de Word em texto simples que funciona bem o suficiente, esta solução provavelmente será incrivelmente eficaz. No entanto, `strings` está disponível na maioria dos sistemas Mac e Linux, por isso pode ser uma primeira boa tentativa para fazer isso com muitos formatos binários.

#### Documentos de Texto OpenDocument

A mesma abordagem que usamos para arquivos do MS Word (`*.doc`) pode ser usada para arquivos de texto OpenDocument (`*.odt`) criados pelo OpenOffice.org.

Adicione a seguinte linha ao seu arquivo `.gitattributes`:

    *.odt diff=odt

Agora configure o filtro diff `odt` em `.git/config`:

    [diff "odt"]
        binary = true
        textconv = /usr/local/bin/odt-to-txt

Arquivos OpenDocument são na verdade diretórios zipados contendo vários arquivos (o conteúdo em um formato XML, folhas de estilo, imagens, etc.) Vamos precisar escrever um script para extrair o conteúdo e devolvê-lo como texto simples. Crie o arquivo `/usr/local/bin/odt-to-txt` (você é pode colocá-lo em um diretório diferente) com o seguinte conteúdo:

    #! /usr/bin/env perl
    # Simplistic OpenDocument Text (.odt) to plain text converter.
    # Author: Philipp Kempgen
    
    if (! defined($ARGV[0])) {
        print STDERR "No filename given!\n";
        print STDERR "Usage: $0 filename\n";
        exit 1;
    }
    
    my $content = '';
    open my $fh, '-|', 'unzip', '-qq', '-p', $ARGV[0], 'content.xml' or die $!;
    {
        local $/ = undef;  # slurp mode
        $content = <$fh>;
    }
    close $fh;
    $_ = $content;
    s/<text:span\b[^>]*>//g;           # remove spans
    s/<text:h\b[^>]*>/\n\n*****  /g;   # headers
    s/<text:list-item\b[^>]*>\s*<text:p\b[^>]*>/\n    --  /g;  # list items
    s/<text:list\b[^>]*>/\n\n/g;       # lists
    s/<text:p\b[^>]*>/\n  /g;          # paragraphs
    s/<[^>]+>//g;                      # remove all XML tags
    s/\n{2,}/\n\n/g;                   # remove multiple blank lines
    s/\A\n+//;                         # remove leading blank lines
    print "\n", $_, "\n\n";

E torne-o executável

    chmod +x /usr/local/bin/odt-to-txt

Agora `git diff` será capaz de dizer o que mudou em arquivos `.odt`.

Outro problema interessante que você pode resolver desta forma envolve o diff de arquivos de imagem. Uma maneira de fazer isso é passar arquivos PNG através de um filtro que extrai suas informações EXIF — metadados que são gravados com a maioria dos formatos de imagem. Se você baixar e instalar o programa `exiftool`, você pode usá-lo para converter suas imagens em texto sobre os metadados, assim pelo menos o diff vai mostrar uma representação textual de todas as mudanças que aconteceram:

    $ echo '*.png diff=exif' >> .gitattributes
    $ git config diff.exif.textconv exiftool

Se você substituir uma imagem em seu projeto e executar o `git diff`, você verá algo como isto:

    diff --git a/image.png b/image.png
    index 88839c4..4afcb7c 100644
    --- a/image.png
    +++ b/image.png
    @@ -1,12 +1,12 @@
     ExifTool Version Number         : 7.74
    -File Size                       : 70 kB
    -File Modification Date/Time     : 2009:04:21 07:02:45-07:00
    +File Size                       : 94 kB
    +File Modification Date/Time     : 2009:04:21 07:02:43-07:00
     File Type                       : PNG
     MIME Type                       : image/png
    -Image Width                     : 1058
    -Image Height                    : 889
    +Image Width                     : 1056
    +Image Height                    : 827
     Bit Depth                       : 8
     Color Type                      : RGB with Alpha

Você pode facilmente ver que o tamanho do arquivo e as dimensões da imagem sofreram alterações.

## Expansão de Palavra-chave

Expansão de Palavra-chave no estilo SVN ou CVS são frequentemente solicitados pelos desenvolvedores acostumados com estes sistemas. O principal problema disso no Git é que você não pode modificar um arquivo com informações sobre o commit depois que você já fez o commit, porque o Git cria os checksums dos arquivos primeiro. No entanto, você pode injetar texto em um arquivo quando é feito o checkout dele e removê-lo novamente antes de ser adicionado a um commit. Atributos Git oferecem duas maneiras de fazer isso.

Primeiro, você pode injetar o SHA-1 checksum de um blob em um campo `$Id$` no arquivo automaticamente. Se você definir esse atributo em um arquivo ou conjunto de arquivos, então da próxima vez que você fizer o checkout do branch, o Git irá substituir o campo com o SHA-1 do blob. É importante notar que não é o SHA do commit, mas do blob em si:

    $ echo '*.txt ident' >> .gitattributes
    $ echo '$Id$' > test.txt

Da próxima vez que você fizer o checkout desse arquivo, o Git injetará o SHA do blob:

    $ rm test.txt
    $ git checkout -- test.txt
    $ cat test.txt
    $Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $

No entanto, este resultado é de uso limitado. Se você já usou a substituição de palavras em CVS ou Subversion, você pode incluir uma datestamp — o SHA não é lá muito útil, porque é bastante aleatório e você não pode dizer se um SHA é mais velho ou mais novo que o outro.

Acontece que você pode escrever seus próprios filtros para fazer substituições em arquivos no commit/checkout. Estes são os filtros "clean" e "smudge". No arquivo `.gitattributes`, você pode definir um filtro para determinados paths e configurar os scripts que irão processar os arquivos antes que seja feito um checkout ("smudge", ver Figura 7-2) e pouco antes do commit ("clean", veja a Figura 7-3). Estes filtros podem ser configurados para fazer todo tipo de coisas divertidas.


![](http://git-scm.com/figures/18333fig0702-tn.png)

Figura 7-2. O filtro “smudge” é rodado no checkout.


![](http://git-scm.com/figures/18333fig0703-tn.png)

Figura 7-3. O filtro “clean” é rodado quando arquivos passam para o estado staged.

A mensagem original do commit para esta funcionalidade dá um exemplo simples de como passar todo o seu código fonte C através do programa `indent` antes de fazer o commit. Você pode configurá-lo, definindo o atributo de filtro no arquivo `.gitattributes` para filtrar arquivos `*.c` com o filtro "indent":

    *.c     filter=indent

Então, diga ao Git o que o filtro "indent" faz em smudge e clean:

    $ git config --global filter.indent.clean indent
    $ git config --global filter.indent.smudge cat

Neste caso, quando você commitar os arquivos que correspondem a `*.c`, Git irá passá-los através do programa indent antes de commmitá-los e depois passá-los através do programa `cat` antes de fazer o checkout de volta para o disco. O programa `cat` é basicamente um no-op: ele mostra os mesmos dados que ele recebe. Esta combinação efetivamente filtra todos os arquivos de código fonte C através do `indent` antes de fazer o commit.

Outro exemplo interessante é a expansão da palavra-chave `$Date$`, estilo RCS. Para fazer isso corretamente, você precisa de um pequeno script que recebe um nome de arquivo, descobre a última data de commit deste projeto, e insere a data no arquivo. Aqui há um pequeno script Ruby que faz isso:

    #! /usr/bin/env ruby
    data = STDIN.read
    last_date = `git log --pretty=format:"%ad" -1`
    puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')

Tudo o que o script faz é obter a última data de commit do comando `git log`, coloca ele em qualquer string `$Date$` que vê no stdin, e imprime os resultados — deve ser simples de fazer em qualquer linguagem que você esteja confortável. Você pode nomear este arquivo `expand_date` e colocá-lo em seu path. Agora, você precisa configurar um filtro no Git (chamaremos de `dater`) e diremos para usar o seu filtro `expand_date` para o smudge dos arquivos no checkout. Você vai usar uma expressão Perl para o clean no commit:

    $ git config filter.dater.smudge expand_date
    $ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'

Este trecho Perl retira qualquer coisa que vê em uma string `$Date$`, para voltar para onde você começou. Agora que o seu filtro está pronto, você pode testá-lo através da criação de um arquivo com a sua palavra-chave `$Date$` e então criar um atributo Git para esse arquivo que envolve o novo filtro:

    $ echo '# $Date$' > date_test.txt
    $ echo 'date*.txt filter=dater' >> .gitattributes

Se você fizer o commit dessas alterações e fizer o checkout do arquivo novamente, você verá a palavra-chave corretamente substituída:

    $ git add date_test.txt .gitattributes
    $ git commit -m "Testing date expansion in Git"
    $ rm date_test.txt
    $ git checkout date_test.txt
    $ cat date_test.txt
    # $Date: Tue Apr 21 07:26:52 2009 -0700$

Você pode ver o quão poderosa esta técnica pode ser para aplicações customizadas. Você tem que ter cuidado, porém, porque o arquivo `.gitattributes` está sendo commitado e mantido no projeto, mas o `dater` não é; assim, ele não vai funcionar em todos os lugares. Ao projetar esses filtros, eles devem ser capazes de falhar e ainda assim manter o projeto funcionando corretamente.

## Exportando Seu Repositório

Dados de atributo Git também permitem que você faça algumas coisas interessantes ao exportar um arquivo do seu projeto.

### export-ignore

Você pode dizer para o Git não exportar determinados arquivos ou diretórios ao gerar um arquivo. Se existe uma subpasta ou arquivo que você não deseja incluir em seu arquivo, mas que você quer dentro de seu projeto, você pode determinar estes arquivos através do atributo `export-ignore`.

Por exemplo, digamos que você tenha alguns arquivos de teste em um subdiretório `test/`, e não faz sentido incluí-los na exportação do tarball do seu projeto. Você pode adicionar a seguinte linha ao seu arquivo de atributos Git:

    test/ export-ignore

Agora, quando você executar git archive para criar um arquivo tar do seu projeto, aquele diretório não será incluído no arquivo.

### export-subst

Outra coisa que você pode fazer para seus arquivos é uma simples substituição de palavra. Git permite colocar a string `$Format:$` em qualquer arquivo com qualquer um dos códigos de formatação`--pretty=format`, muitos dos quais você viu no Capítulo 2. Por exemplo, se você quiser incluir um arquivo chamado `LAST_COMMIT` em seu projeto, e a última data de commit foi injetada automaticamente quando `git archive` foi executado, você pode configurar o arquivo como este:

    $ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
    $ echo "LAST_COMMIT export-subst" >> .gitattributes
    $ git add LAST_COMMIT .gitattributes
    $ git commit -am 'adding LAST_COMMIT file for archives'

Quando você executar `git archive`, o conteúdo do arquivo quando aberto será parecido com este:

    $ cat LAST_COMMIT
    Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$

## Estratégias de Merge

Você também pode usar atributos Git para dizer ao Git para utilizar estratégias diferentes para mesclar arquivos específicos em seu projeto. Uma opção muito útil é dizer ao Git para não tentar mesclar arquivos específicos quando eles têm conflitos, mas sim para usar o seu lado do merge ao invés do da outra pessoa.

Isso é útil se um branch em seu projeto divergiu ou é especializado, mas você quer ser capaz de fazer o merge de alterações de volta a partir dele, e você deseja ignorar determinados arquivos. Digamos que você tenha um arquivo de configurações de banco de dados chamado database.xml que é diferente em dois branches, e você deseja mesclar em seu outro branch sem bagunçar o arquivo de banco de dados. Você pode configurar um atributo como este:

    database.xml merge=ours

Se você fizer o merge em outro branch, em vez de ter conflitos de merge com o arquivo database.xml, você verá algo como isto:

    $ git merge topic
    Auto-merging database.xml
    Merge made by recursive.

Neste caso, database.xml fica em qualquer versão que você tinha originalmente.
