# Git Internamente

Você pode ter pulado para este capítulo a partir de um capítulo anterior, ou você pode ter chegado aqui depois de ler o resto do livro — em ambos os casos, este é o lugar onde você vai conhecer o funcionamento interno e implementação do Git. Descobri que aprender esta informação era de fundamental importância para a compreensão de quanto o Git é útil e poderoso, mas outros argumentaram que pode ser confuso e desnecessariamente complexo para iniciantes. Assim, eu fiz essa discussão o último capítulo do livro para que você possa lê-lo mais cedo ou mais tarde, em seu processo de aprendizagem. Deixo isso para você decidir.

Agora que você está aqui, vamos começar. Primeiro, se ainda não for claro, o Git é fundamentalmente um sistema de arquivos de conteúdo endereçavel com uma interface de usuário VCS escrito em cima dele. Você vai aprender mais sobre o que isto significa daqui a pouco.

Nos primeiros dias do Git (principalmente antes da versão 1.5), a interface de usuário era muito mais complexa, pois enfatizou este sistema de arquivos, em vez de um VCS. Nos últimos anos, a interface do usuário tem sido aperfeiçoada até que ela se torne tão limpa e fácil de usar como qualquer outro sistema; mas, muitas vezes, o estereótipo persiste sobre a UI antiga do Git que era complexa e difícil de aprender.

A camada de sistema de arquivos de conteúdo endereçável é incrivelmente interessante, então eu vou falar dela primeiro neste capítulo; então, você vai aprender sobre os mecanismos de transporte e as tarefas de manutenção do repositório.
