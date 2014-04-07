# Fluxos de Trabalho Distribuídos

Ao contrário de Sistemas de Controle de Versão Centralizados (CVCSs), a natureza distribuída do Git lhe permite ser muito mais flexível na forma como os desenvolvedores podem colaborar em projetos. Nos sistemas centralizados, cada desenvolvedor é um nó trabalhando de forma mais ou menos igual em um hub (centralizador). No Git, no entanto, cada desenvolvedor é potencialmente nó e hub — ou seja, cada desenvolvedor pode contribuir com código para outros repositórios e ao mesmo tempo pode manter um repositório público em que outros podem basear seu trabalho e que eles podem contribuir. Isso abre uma vasta gama de possibilidades de fluxo de trabalho para o seu projeto e sua equipe, então eu vou cobrir alguns paradigmas mais comuns que se aproveitam dessa flexibilidade. Vou passar as vantagens e possíveis desvantagens de cada configuração, você pode escolher uma para usar ou combinar características de cada uma.

## Fluxo de Trabalho Centralizado

Com sistemas centralizados normalmente há apenas um modelo de colaboração, centralizado. Um hub central, ou repositório, pode aceitar o código, e todos sincronizam o seu trabalho com ele. Vários desenvolvedores são nós — consumidores do hub — e sincronizam em um lugar único (ver Figura 5-1).


![](http://git-scm.com/figures/18333fig0501-tn.png)

Figura 5-1. Fluxo de Trabalho Centralizado.

Isto significa que se dois desenvolvedores clonam o hub e ambos fazem alterações, o primeiro desenvolvedor a dar push de suas alterações pode fazê-lo sem problemas. O segundo desenvolvedor deve fazer merge do trabalho do primeiro antes de dar push, de modo a não substituir as alterações do primeiro desenvolvedor. Isso vale para o Git assim como o Subversion (ou qualquer CVCS), e este modelo funciona perfeitamente no Git.

Se você tem uma equipe pequena ou se já estão confortáveis com um fluxo de trabalho centralizado em sua empresa ou equipe, você pode facilmente continuar usando esse fluxo de trabalho com o Git. Basta criar um único repositório, e dar a todos em sua equipe acesso para dar push; o Git não deixará os usuários sobrescreverem uns aos outros. Se um desenvolvedor clona, faz alterações, e depois tenta dar push enquanto outro desenvolvedor já deu push com novas alterações nesse meio tempo, o servidor irá rejeitar as novas alterações. Ele será informado que está tentando dar push que não permite fast-forward (avanço rápido) e que não será capaz de fazê-lo até que baixe as últimas alterações e faça merge.
Esse fluxo de trabalho é atraente para muita gente porque é um paradigma que muitos estão familiarizados e confortáveis.

## Fluxo de Trabalho do Gerente de Integração

Como o Git permite que você tenha múltiplos repositórios remotos, é possível ter um fluxo de trabalho onde cada desenvolvedor tem acesso de escrita a seu próprio repositório público e acesso de leitura a todos os outros. Este cenário, muitas vezes inclui um repositório canônico que representa o projeto "oficial". Para contribuir com esse projeto, você cria o seu próprio clone público do projeto e guarda suas alterações nele. Depois, você pode enviar uma solicitação para o responsável do projeto principal para puxar as suas alterações. Eles podem adicionar o repositório como um repositório remoto, testar localmente as suas alterações, fazer merge em um branch e propagá-las para o repositório principal. O processa funciona da seguinte maneira (veja Figura 5-2):

1. O mantenedor do projeto propaga as alterações para seu repositório público.
2. O desenvolvedor clona o repositório e faz alterações.
3. O desenvolvedor dá push das alterações para sua própria cópia pública.
4. O desenvolvedor envia um e-mail pedindo para o mantenedor puxar as alterações (pull request).
5. O mantenedor adiciona o repositório do desenvolvedor como um repositório remoto e faz merge das alterações localmente.
6. O mantenedor dá push das alterações mescladas para o repositório principal.


![](http://git-scm.com/figures/18333fig0502-tn.png)

Figura 5-2. Fluxo de trabalho de Gerente de Integração.

Este é um fluxo de trabalho muito comum em sites como GitHub, onde é fácil de fazer uma fork (forquilha ou bifurcação, porque o histórico não-linear é uma árvore) de um projeto e dar push das suas alterações para que todos possam ver. Uma das principais vantagens desta abordagem é que você pode continuar a trabalhar, e o mantenedor do repositório principal pode puxar as alterações a qualquer momento. Desenvolvedores não tem que esperar o projeto incorporar as suas mudanças — cada um pode trabalhar em seu próprio ritmo.

## Fluxo de Trabalho de Ditador e Tenentes

Esta é uma variante de um fluxo de trabalho de múltiplos repositórios. É geralmente usado por grandes projetos com centenas de colaboradores. Um exemplo famoso é o kernel do Linux. Vários gerentes de integração são responsáveis ​​por certas partes do repositório, eles são chamados tenentes (liutenants). Todos os tenentes têm um gerente de integração conhecido como o ditador benevolente (benevolent dictator). O repositório do ditador benevolente serve como repositório de referência a partir do qual todos os colaboradores devem se basear. O processo funciona assim (veja Figura 5-3):

1. Desenvolvedores regulares trabalham em seu topic branch e baseiam seu trabalho sobre o `master`. O branch `master` é o do ditador.
2. Tenentes fazem merge dos topic branches dos desenvolvedores em seus `master`.
3. O ditador faz merge dos branches `master` dos tenentes em seu branch `master`.
4. O ditador dá push das alterações de seu `master` para o repositório de referência para que os desenvolvedores possam fazer rebase em cima dele.


![](http://git-scm.com/figures/18333fig0503-tn.png)

Figura 5-3. Fluxo de Trabalho do Ditador Benevolente.

Este tipo de fluxo de trabalho não é comum, mas pode ser útil em projetos muito grandes ou em ambientes altamente hierárquicos, porque ele permite ao líder do projeto (o ditador) delegar grande parte do trabalho e recolher grandes subconjuntos do código em vários pontos antes de integrar eles.

Estes são alguns fluxos de trabalho comumente utilizados que são possíveis com um sistema distribuído como Git, mas você pode ver que muitas variações são possíveis para se adequar ao seu fluxo de trabalho particular. Agora que você pode (espero eu) determinar qual a combinação de fluxo de trabalho pode funcionar para você, eu vou cobrir alguns exemplos mais específicos de como realizar os principais papéis que compõem os diferentes fluxos.
