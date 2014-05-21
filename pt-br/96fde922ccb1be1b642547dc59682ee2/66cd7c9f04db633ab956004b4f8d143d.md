# Git Hospedado

Se você não quer passar por todo o trabalho envolvido na configuração de seu próprio servidor Git, você tem várias opções para hospedar seus projetos Git em um site externo de hospedagem dedicado. Estes sites oferecem uma série de vantagens: um site de hospedagem geralmente é rápido de configurar e facilita a criação de projetos e não envolve a manutenção do servidor ou monitoramento. Mesmo que você configure e execute seu próprio servidor internamente, você ainda pode querer usar um site público de hospedagem para o seu código fonte aberto — é geralmente mais fácil para a comunidade de código aberto encontrá-lo e ajudá-lo.

Nos dias de hoje, você tem um grande número de opções de hospedagem para escolher, cada um com diferentes vantagens e desvantagens. Para ver uma lista atualizada, veja a seguinte página:

    https://git.wiki.kernel.org/index.php/GitHosting

Como não podemos cobrir todos eles, e porque eu trabalho em um deles, vamos usar esta seção para ensiná-lo a criar uma conta e um novo projeto no GitHub. Isso lhe dará uma ideia do que está envolvido no processo.

GitHub é de longe o maior site open source de hospedagem Git e também é um dos poucos que oferecem hospedagens públicas e privadas para que você possa manter o seu código aberto ou privado no mesmo lugar. Na verdade, nós usamos o GitHub privado para colaborar com esse livro.

## GitHub

GitHub é um pouco diferente do que a maioria dos sites de hospedagem de código na maneira que gerencia projetos. Em vez de ser baseado principalmente no projeto, GitHub é centrado no usuário. Isso significa que quando eu hospedar meu projeto `grit` no GitHub, você não vai encontrá-lo em `github.com/grit` mas em `github.com/schacon/grit`. Não há versão canônica de qualquer projeto, o que permite que um projeto possa se deslocar de um usuário para outro se o primeiro autor abandonar o projeto.

GitHub também é uma empresa comercial que cobra para contas que mantêm repositórios privados, mas qualquer um pode rapidamente obter uma conta gratuita para hospedar tantos projetos de código aberto quanto quiser. Nós vamos passar rapidamente sobre como isso é feito.

## Criando uma Conta de Usuário

A primeira coisa que você precisa fazer é criar uma conta de usuário gratuita. Se você visitar a página de Preços e Inscrição em `http://github.com/plans` e clicar no botão "Sign Up" na conta gratuita (ver figura 4-2), você é levado à página de inscrição.


![](http://git-scm.com/figures/18333fig0402-tn.png)

Figure 4-2. A página de planos do GitHub.

Aqui você deve escolher um nome de usuário que ainda não foi utilizada no sistema e digitar um endereço de e-mail que será associado com a conta e uma senha (veja a Figura 4-3).


![](http://git-scm.com/figures/18333fig0403-tn.png)

Figure 4-3. O formulário de inscrição do GitHub.

Este é um bom momento para adicionar sua chave pública SSH também. Mostramos como gerar uma nova chave antes, na seção "Gerando Sua Chave Pública SSH". Copie o conteúdo da chave pública, e cole-o na caixa de texto "SSH Public Key". Clicando no link "explain ssh keys" irá mostrar instruções detalhadas sobre como fazê-lo em todos os principais sistemas operacionais. Clicando no botão "I agree, sign me up" levará você ao painel principal de seu novo usuário (ver Figura 4-4).


![](http://git-scm.com/figures/18333fig0404-tn.png)

Figure 4-4. O painel principal do usuário do GitHub.

Em seguida, você pode criar um novo repositório.

## Criando um Novo Repositório

Comece clicando no link "create a new one" ao lado de seus repositórios no painel do usuário. Você é levado para um formulário para criação de um novo repositório (ver Figura 4-5).


![](http://git-scm.com/figures/18333fig0405-tn.png)

Figure 4-5. Criando um novo repositório no GitHub.

Tudo o que você realmente tem que fazer é fornecer um nome de projeto, mas você também pode adicionar uma descrição. Quando terminar, clique no botão "Create Repository". Agora você tem um novo repositório no GitHub (ver Figura 4-6).


![](http://git-scm.com/figures/18333fig0406-tn.png)

Figure 4-6. Informações de um projeto do GitHub.

Já que você não tem nenhum código ainda, GitHub irá mostrar-lhe instruções de como criar um novo projeto, fazer um push de um projeto Git existente, ou importar um projeto de um repositório Subversion público (ver Figura 4-7).


![](http://git-scm.com/figures/18333fig0407-tn.png)

Figure 4-7. Instrução para novos repositórios.

Estas instruções são semelhantes ao que nós já vimos. Para inicializar um projeto se já não é um projeto Git, você usa

    $ git init
    $ git add .
    $ git commit -m 'initial commit'

Quando você tem um repositório Git local, adicione GitHub como um remoto e faça um push do branch master:

    $ git remote add origin git@github.com:testinguser/iphone_project.git
    $ git push origin master

Agora seu projeto está hospedado no GitHub, e você pode dar a URL para quem você quiser compartilhar seu projeto. Neste caso, é `http://github.com/testinguser/iphone_project`. Você também pode ver a partir do cabeçalho em cada uma das páginas do seu projeto que você tem duas URLs Git (ver Figura 4-8).


![](http://git-scm.com/figures/18333fig0408-tn.png)

Figure 4-8. Cabeçalho do projeto com uma URL pública e outra privada.

A URL pública é uma URL Git somente leitura sobre a qual qualquer um pode clonar o projeto. Sinta-se a vontade para dar essa URL e postá-la em seu site ou qualquer outro lugar.

A URL privada é uma URL para leitura/gravação baseada em SSH que você pode usar para ler ou escrever apenas se tiver a chave SSH privada associada a chave pública que você carregou para o seu usuário. Quando outros usuários visitarem esta página do projeto, eles não vão ver a URL privada.

## Importando do Subversion

Se você tem um projeto Subversion público existente que você deseja importar para o Git, GitHub muitas vezes pode fazer isso por você. Na parte inferior da página de instruções há um link para importação do Subversion. Se você clicar nele, você verá um formulário com informações sobre o processo de importação e uma caixa de texto onde você pode colar a URL do seu projeto Subversion público (ver Figura 4-9).


![](http://git-scm.com/figures/18333fig0409-tn.png)

Figure 4-9. Interface de importação do Subversion.

Se o seu projeto é muito grande, fora do padrão, ou privado, esse processo provavelmente não vai funcionar para você. No Capítulo 7, você vai aprender como fazer a importação de projetos mais complicados manualmente.

## Adicionando Colaboradores

Vamos adicionar o resto da equipe. Se John, Josie, e Jessica se inscreverem no GitHub, e você quer dar a eles permissão de escrita em seu repositório, você pode adicioná-los ao seu projeto como colaboradores. Isso permitirá que eles façam pushes a partir de suas chaves públicas.

Clique no botão "editar" no cabeçalho do projeto ou na guia Admin no topo do projeto para chegar à página de administração do seu projeto GitHub (ver Figura 4-10).


![](http://git-scm.com/figures/18333fig0410-tn.png)

Figure 4-10. Página de administração do GitHub.

Para dar a outro usuário acesso de escrita ao seu projeto, clique no link “Add another collaborator”. Uma nova caixa de texto aparece, no qual você pode digitar um nome de usuário. Conforme você digita, um ajudante aparece, mostrando a você nomes de usuários possíveis. Quando você encontrar o usuário correto, clique no botão "Add" para adicionar o usuário como colaborador em seu projeto (ver Figura 4-11).


![](http://git-scm.com/figures/18333fig0411-tn.png)

Figure 4-11. Adicionando um colaborador a seu projeto.

Quando você terminar de adicionar colaboradores, você deve ver uma lista deles na caixa de colaboradores do repositório (ver Figura 4-12).


![](http://git-scm.com/figures/18333fig0412-tn.png)

Figure 4-12. Uma lista de colaboradores em seu projeto.

Se você precisar revogar acesso às pessoas, você pode clicar no link "revoke", e seus acessos de escrita serão removidos. Para projetos futuros, você também pode copiar grupos de colaboradores ao copiar as permissões de um projeto existente.

## Seu Projeto

Depois de fazer um push no seu projeto ou tê-lo importado do Subversion, você tem uma página principal do projeto que é algo como Figura 4-13.


![](http://git-scm.com/figures/18333fig0413-tn.png)

Figure 4-13. A página principal do projeto no GitHub.

Quando as pessoas visitam o seu projeto, elas veem esta página. Ela contém guias para diferentes aspectos de seus projetos. A guia Commits mostra uma lista de commits em ordem cronológica inversa, semelhante à saída do comando `git log`. A guia Network mostra todas as pessoas que criaram um fork do seu projeto e contribuíram para nele. A guia Downloads permite que você faça upload de arquivos binários e crie links para tarballs e versões compactadas de todas as versões de seu projeto. A guia Wiki fornece uma wiki onde você pode escrever documentação ou outras informações sobre o projeto. A guia Graphs tem algumas visualizações e estatísticas de contribuições sobre o seu projeto. A guia Source mostra uma listagem de diretório principal de seu projeto e processa automaticamente o arquivo README abaixo se você tiver um. Essa guia também mostra uma caixa com a informação do commit mais recente.

## Criando Forks de Projetos

Se você quiser contribuir para um projeto existente para o qual você não tem permissão de push, GitHub incentiva a utilização de forks do projeto. Quando você acessar uma página de um projeto que parece interessante e você quiser fazer alguma mudança nele, você pode clicar no botão "fork" no cabeçalho do projeto para que o GitHub copie o projeto para o seu usuário para que você possa editá-lo.

Dessa forma, os projetos não têm que se preocupar com a adição de usuários como colaboradores para dar-lhes acesso de escrita. As pessoas podem criar um fork de um projeto e fazer um push nele, e o mantenedor do projeto principal pode fazer um pull dessas mudanças, adicionando-as como remotos e fazendo um merge no seu projeto.

Para fazer um fork de um projeto, visite a página do projeto (neste caso, mojombo/chronic) e clique no botão "fork" no cabeçalho (ver Figura 4-14).


![](http://git-scm.com/figures/18333fig0414-tn.png)

Figure 4-14. Obtenha uma cópia de um projeto, que pode ser modificado, clicando no botão "fork".

Depois de alguns segundos, você é levado à página do seu novo projeto, o que indica que este projeto é um fork de outro (ver Figura 4-15).


![](http://git-scm.com/figures/18333fig0415-tn.png)

Figure 4-15. Seu fork de um projeto.

## Sumário do GitHub

Isso é tudo o que nós vamos falar acerca do GitHub, mas é importante notar o quão rápido você pode fazer tudo isso. Você pode criar uma conta, adicionar um novo projeto, e fazer um push nele em questão de minutos. Se o seu projeto é de código aberto, você também terá uma grande comunidade de desenvolvedores, que agora têm visibilidade de seu projeto e podem fazer forks e ajudar contribuindo. No mínimo, isso pode ser uma maneira de usar o Git e experimentá-lo rapidamente.
