# Fluxos de Trabalho com Branches

Agora que você sabe o básico sobre criação e merge de branches, o que você pode ou deve fazer com eles? Nessa seção, nós vamos abordar alguns fluxos de trabalhos comuns que esse tipo de criação fácil de branches torna possível, então você pode decidir se você quer incorporá-lo no seu próprio ciclo de desenvolvimento.

## Branches de Longa Duração

Devido ao Git usar um merge de três vias, fazer o merge de um branch em outro várias vezes em um período longo é geralmente fácil de fazer. Isto significa que você pode ter vários branches que ficam sempre abertos e que são usados em diferentes estágios do seu ciclo de desenvolvimento; você pode regularmente fazer o merge de alguns deles em outros.

Muitos desenvolvedores Git tem um fluxo de trabalho que adotam essa abordagem, como ter somente código completamente estável em seus branches `master` — possivelmente somente código que já foi ou será liberado. Eles têm outro branch paralelo chamado develop ou algo parecido em que eles trabalham ou usam para testar estabilidade — ele não é necessariamente sempre estável, mas quando ele chega a tal estágio, pode ser feito o merge com o branch `master`. Ele é usado para puxar (pull) branches tópicos (topic, branches de curta duração, como o seu branch `iss53` anteriormente) quando eles estão prontos, para ter certeza que eles passam em todos os testes e não acrescentam erros.

Na realidade, nós estamos falando de ponteiros avançando na linha de commits que você está fazendo. Os branches estáveis estão muito atrás na linha histórica de commits, e os branches de ponta (que estão sendo trabalhados) estão a frente no histórico (veja Figura 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)

Figura 3-18. Branches mais estáveis geralmente ficam atrás no histórico de commits.

Normalmente é mais fácil pensar neles como um contêiner de trabalho, onde conjuntos de commits são promovidos a um contêiner mais estável quando eles são completamente testados (veja figura 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)

Figura 3-19. Pode ser mais útil pensar em seus branches como contêineres.

Você pode continuar fazendo isso em vários níveis de estabilidade. Alguns projetos grandes podem ter um branch 'sugerido' (`proposed`) ou 'sugestões atualizadas' (`pu`, proposed updates) que contém outros branches integrados que podem não estar prontos para ir para o próximo (`next`) ou branch `master`. A ideia é que seus branches estejam em vários níveis de estabilidade; quando eles atingem um nível mais estável, é feito o merge no branch acima deles. Repetindo, ter muitos branches de longa duração não é necessário, mas geralmente é útil, especialmente quando você está lidando com projetos muito grandes ou complexos.

## Branches Tópicos (topic)

Branches tópicos, entretanto, são úteis em projetos de qualquer tamanho. Um branch tópico é um branch de curta duração que você cria e usa para uma funcionalidade ou trabalho relacionado. Isso é algo que você provavelmente nunca fez com um controle de versão antes porque é geralmente muito custoso criar e fazer merge de branches. Mas no Git é comum criar, trabalhar, mesclar e apagar branches muitas vezes ao dia.

Você viu isso na seção anterior com os branches `iss53` e `hotfix` que você criou. Você fez commits neles e os apagou depois que fez o merge com seu branch principal. Tecnicamente, isso lhe permite mudar completamente e rapidamente o contexto — em razão de seu trabalho estar separado em contêineres onde todas as modificações naquele branch estarem relacionadas ao tópico, é fácil ver o que aconteceu durante a revisão de código. Você pode manter as mudanças lá por minutos, dias, ou meses, e mesclá-las quando estivem prontas, não importando a ordem que foram criadas ou trabalhadas.

Considere um exemplo onde você está fazendo um trabalho (no `master`), cria um branch para um erro (`iss91`), trabalha nele um pouco, cria um segundo branch para testar uma nova maneira de resolver o mesmo problema (`iss91v2`), volta ao seu branch principal e trabalha nele por um tempo, e cria um novo branch para trabalhar em algo que você não tem certeza se é uma boa ideia (`dumbidea`). Seu histórico de commits irá se parecer com a Figura 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)

Figura 3-20. Seu histórico de commits com multiplos branches tópicos.

Agora, vamos dizer que você decidiu que sua segunda solução é a melhor para resolver o erro (`iss91v2`); e você mostrou seu branch `dumbidea` para seus colegas de trabalho, e ele é genial. Agora você pode jogar fora o branch original `iss91` (perdendo os commits C5 e C6) e fazer o merge dos dois restantes. Seu histórico irá se parecer com a Figura 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)

Figura 3-21. Seu histórico depois de fazer o merge de dumbidea e iss91v2.

É importante lembrar que você esta fazendo tudo isso com seus branches localmente. Quando você cria e faz o merge de branches, tudo está sendo feito somente no seu repositório Git — nenhuma comunicação com o servidor esta sendo feita.
