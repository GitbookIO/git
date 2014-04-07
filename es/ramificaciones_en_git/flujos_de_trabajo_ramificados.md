# Flujos de trabajo ramificados

Ahora que ya has visto los procedimientos básicos de ramificación y fusión, ¿qué puedes o qué debes hacer con ellos? En este apartado vamos a ver algunos de los flujos de trabajo más comunes, de tal forma que puedas decidir si te gustaría incorporar alguno de ellos a tu ciclo de desarrollo.

## Ramas de largo recorrido

Por la sencillez de la fusión a tres bandas de Git, el fusionar de una rama a otra multitud de veces a lo largo del tiempo es facil de hacer. Esto te posibilita tener varias ramas siempre abiertas, e irlas usando en diferentes etapas del ciclo de desarrollo; realizando frecuentes fusiones entre ellas.

Muchos desarrolladores que usan Git llevan un flujo de trabajo de esta naturaleza, manteniendo en la rama 'master' únicamente el código totalmente estable (el código que ha sido o que va a ser liberado). Teniendo otras ramas paralelas denominadas 'desarrollo' o 'siguiente', en las que trabajan y realizan pruebas. Estas ramas paralelas no suele estar siempre en un estado estable; pero cada vez que sí lo están, pueden ser fusionadas con la rama 'master'. También es habitual el incorporarle (pull) ramas puntuales (ramas temporales, como la rama 'iss53' del anterior ejemplo) cuando las completamos y estamos seguros de que no van a introducir errores.

En realidad, en todo momento estamos hablando simplemente de apuntadores moviendose por la línea temporal de confirmaciones de cambio (commit history). Las ramas estables apuntan hacia posiciones más antiguas en el registro de confirmaciones. Mientras que las ramas avanzadas, las que van abriendo camino, apuntan hacia posiciones más recientes.


![](http://git-scm.com/figures/18333fig0318-tn.png)
 
Figura 3-18. Las ramas más estables apuntan hacia posiciones más antiguas en el registro de cambios.

Podría ser más sencillo pensar en las ramas como si fueran silos de almacenamiento. Donde grupos de confirmaciones de cambio (commits) van promocionando hacia silos más estables a medida que son probados y depurados (ver Figura 3-19)


![](http://git-scm.com/figures/18333fig0319-tn.png)
 
Figura 3-19. Puede ayudar pensar en las ramas como silos de almacenamiento.

Este sistema de trabajo se puede ampliar para diversos grados de estabilidad. Algunos proyectos muy grandes suelen tener una rama denominada 'propuestas' o 'pu' (proposed updates). Donde suele estar todo aquello integrado desde otras ramas, pero que aún no está listo para ser incorporado a las ramas 'siguiente' o 'master'. La idea es mantener siempre diversas ramas en diversos grados de estabilidad; pero cuando alguna alcanza un estado más estable, la fusionamos con la rama inmediatamente superior a ella.
Aunque no es obligatorio el trabajar con ramas de larga duración, realmente es práctico y útil. Sobre todo en proyectos largos o complejos.

## Ramas puntuales

Las ramas puntuales, en cambio, son útiles en proyectos de cualquier tamaño. Una rama puntual es aquella de corta duración que abres para un tema o para una funcionalidad muy concretos. Es algo que nunca habrías hecho en otro sistema VCS, debido a los altos costos de crear y fusionar ramas que se suelen dar en esos sistemas. Pero en Git, por el contrario, es muy habitual el crear, trabajar con, fusionar y borrar ramas varias veces al día.

Tal y como has visto con las ramas 'iss53' y 'hotfix' que has creado en la sección anterior. Has hecho unas pocas confirmaciones de cambio en ellas, y luego las has borrado tras fusionarlas con la rama principal. Esta técnica te posibilita realizar rápidos y completos saltos de contexto. Y, debido a que el trabajo está claramente separado en silos, con todos los cambios de cada tema en su propia rama, te será mucho más sencillo revisar el código y seguir su evolución. Puedes mantener los cambios ahí durante minutos, dias o meses; y fusionarlos cuando realmente estén listos. En lugar de verte obligado a fusionarlos en el orden en que fueron creados y comenzaste a trabajar en ellos.

Por ejemplo, puedes realizar cierto trabajo en la rama 'master', ramificar para un problema concreto (rama 'iss91'), trabajar en él un rato, ramificar a una segunda rama para probar otra manera de resolverlo (rama 'iss92v2'), volver a la rama 'master' y trabajar un poco más, y, por último, ramificar temporalmente para probar algo de lo que no estás seguro (rama 'dumbidea'). El registro de confirmaciones (commit history) será algo parecido a la Figura 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)
 
Figura 3-20. El registro de confirmaciones con múltiples ramas puntuales.

En este momento, supongamos que te decides por la segunda solución al problema (rama 'iss92v2'); y que, tras mostrar la rama 'dumbidea' a tus compañeros, resulta que les parece una idea genial. Puedes descartar la rama 'iss91' (perdiendo las confirmaciones C5 y C6), y fusionar las otras dos. El registro será algo parecido a la Figura 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)
 
Figura 3-21. El registro tras fusionar 'dumbidea' e 'iss91v2'.

Es importante recordar que, mientras estás haciendo todo esto, todas las ramas son completamente locales. Cuando ramificas y fusionas, todo se realiza en tu propio repositório Git. No hay nigún tipo de tráfico con ningún servidor.
