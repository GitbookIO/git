# Reorganizando el trabajo realizado

En Git tenemos dos formas de integrar cambios de una rama en otra: la fusión (merge) y la reorganización (rebase). En esta sección vas a aprender en qué consiste la reorganización, como utilizarla, por qué es una herramienta sorprendente y en qué casos no es conveniente utilizarla.

## Reorganización básica

Volviendo al ejemplo anterior, en la sección sobre fusiones (ver Figura 3-27), puedes ver que has separado  tu trabajo y realizado confirmaciones (commit) en dos ramas diferentes.


![](http://git-scm.com/figures/18333fig0327-tn.png)
 
Figura 3-27. El registro de confirmaciones inicial.

La manera más sencilla de integrar ramas, tal y como hemos visto, es el comando 'git merge'. Realiza una fusión a tres bandas entre las dos últimas instantáneas de cada rama (C3 y C4) y el ancestro común a ambas (C2); creando una nueva instantánea (snapshot)  y la correspondiente confirmación (commit), según se muestra en la Figura 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)
 
Figura 3-28. Fusionando una rama para integrar el registro de trabajos divergentes.

Aunque también hay otra forma de hacerlo: puedes coger los cambios introducidos en C3 y reaplicarlos encima de C4. Esto es lo que en Git llamamos _reorganizar_. Con el comando 'git rebase', puedes coger todos los cambios confirmados en una rama, y reaplicarlos sobre otra.

Por ejemplo, puedes lanzar los comandos:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

Haciendo que Git: vaya al ancestro común de ambas ramas (donde estás actualmente y de donde quieres reorganizar), saque las diferencias introducidas por cada confirmación en la rama donde estás, guarde esas diferencias en archivos temporales, reinicie (reset) la rama actual hasta llevarla a la misma confirmación en la rama de donde quieres reorganizar, y, finalmente, vuelva a aplicar ordenadamente los cambios. El proceso se muestra en la Figura 3-29.


![](http://git-scm.com/figures/18333fig0329-tn.png)
 
Figura 3-29. Reorganizando sobre C4 los cambios introducidos en C3.

En este momento, puedes volver a la rama 'master' y hacer una fusión con avance rápido (fast-forward merge). (ver Figura 3-30)


![](http://git-scm.com/figures/18333fig0330-tn.png)
 
Figura 3-30. Avance rápido de la rama 'master'.

Así, la instantánea apuntada por C3' aquí es exactamente la misma apuntada por C5 en el ejemplo de la fusión. No hay ninguna diferencia en el resultado final de la integración, pero el haberla hecho reorganizando nos deja un registro más claro. Si examinas el registro de una rama reorganizada, este aparece siempre como un registro lineal: como si todo el trabajo se hubiera realizado en series, aunque realmente se haya hecho en paralelo.

Habitualmente, optarás por esta vía cuando quieras estar seguro de que tus confirmaciones de cambio (commits) se pueden aplicar limpiamente sobre una rama remota; posiblemente, en un proyecto donde estés intentando colaborar, pero lleves tu el mantenimiento. En casos como esos, puedes trabajar sobre una rama y luego reorgainzar lo realizado en la rama 'origin/master' cuando lo tengas todo listo para enviarlo al proyecto principal. De esta forma, la persona que mantiene el proyecto no necesitará hacer ninguna integración con tu trabajo; le bastará con un avance rápido o una incorporación limpia.

Cabe destacar que la instantánea (snapshot) apuntada por la confirmación (commit) final, tanto si es producto de una regorganización (rebase) como si lo es de una fusión (merge), es exactamente la misma instantánea. Lo único diferente es el registro. La reorganización vuelve a aplicar cambios de una rama de trabajo sobre otra rama, en el mismo orden en que fueron introducidos en la primera. Mientras que la fusión combina entre sí los dos puntos finales de ambas ramas.

## Algunas otras reorganizaciones interesantes

También puedes aplicar una reorganización (rebase) sobre otra cosa además de sobre la rama de reorganización. Por ejemplo, sea un registro como el de la Figura 3-31. Has ramificado a una rama puntual ('server') para añadir algunas funcionalidades al proyecto, y luego has confirmado los cambios. Despues, vuelves a la rama original para hacer algunos cambios en la parte cliente (rama 'client'), y confirmas también esos cambios. Por último, vuelves sobre la rama 'server' y haces algunos cambios más.


![](http://git-scm.com/figures/18333fig0331-tn.png)
 
Figura 3-31. Un registro con una rama puntual sobre otra rama puntual.

Imagina que decides incorporar tus cambios de la parte cliente sobre el proyecto principal, para hacer un lanzamiento de versión; pero no quieres lanzar aún los cambios de la parte server porque no están aún suficientemente probados. Puedes coger los cambios del cliente que no estan en server (C8 y C9), y reaplicarlos sobre tu rama principal usando la opción '--onto' del comando 'git rebase':

	$ git rebase --onto master server client

Esto viene a decir: "Activa la rama 'client', averigua los cambios desde el ancestro común entre las ramas 'client' y 'server', y aplicalos en la rama 'master'. Puede parecer un poco complicado, pero los resultados, mostrados en la Figura 3-32, son realmente interesantes.


![](http://git-scm.com/figures/18333fig0332-tn.png)
 
Figura 3-32. Reorganizando una rama puntual fuera de otra rama puntual.

Y, tras esto, ya puedes avanzar la rama principal (ver Figura 3-33):

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)
 
Figura 3-33. Avance rápido de tu rama 'master', para incluir los cambios de la rama 'client'.

Ahora supongamos que decides traerlos (pull) también sobre tu rama 'server'. Puedes reorganizar (rebase) la rama 'server' sobre la rama 'master' sin necesidad siquiera de comprobarlo previamente, usando el comando 'git rebase [ramabase] [ramapuntual]'. El cual activa la rama puntual ('server' en este caso) y la aplica sobre la rama base ('master' en este caso):

	$ git rebase master server

Esto vuelca el trabajo de 'server' sobre el de 'master', tal y como se muestra en la Figura 3-34.


![](http://git-scm.com/figures/18333fig0334-tn.png)
 
Figura 3-34. Reorganizando la rama 'server' sobre la rama 'branch'.

Después, puedes avanzar rápidamente la rama base ('master'):

	$ git checkout master
	$ git merge server

Y por último puedes eliminar las ramas 'client' y 'server' porque ya todo su contenido ha sido integrado y no las vas a necesitar más. Dejando tu registro tras todo este proceso tal y como se muestra en la Figura 3-35:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)
 
Figura 3-35. Registro final de confirmaciones de cambio.

## Los peligros de la reorganización

Ahh...., pero la dicha de la reorganización no la alcanzamos sin sus contrapartidas: 

**Nunca reorganices confirmaciones de cambio (commits) que hayas enviado (push) a un repositorio público.**

Siguiendo esta recomendación, no tendrás problemas. Pero si no la sigues, la gente te odiará y serás despreciado por tus familiares y amigos.

Cuando reorganizas algo, estás abandonando las confirmaciones de cambio ya creadas y estás creando unas nuevas; que son similares, pero diferentes. Si envias (push) confirmaciones (commits) a alguna parte, y otros las recogen (pull) de allí. Y después vas tu y las reescribes con 'git rebase' y las vuelves a enviar (push) de nuevo. Tus colaboradores tendrán que refusionar (re-merge) su trabajo  y todo se volverá tremendamente complicado cuando intentes recoger (pull) su trabajo de vuelta sobre el tuyo.

Vamos a verlo con un ejemplo. Imaginate que haces un clon desde un servidor central, y luego trabajas sobre él. Tu registro de cambios puede ser algo como lo de la Figura 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)
 
Figura 3-36. Clonar un repositorio y trabajar sobre él.

Ahora, otra persona trabaja también sobre ello, realiza una fusión (merge) y lleva (push) su trabajo al servidor central. Tu te traes (fetch) sus trabajos y los fusionas (merge) sobre una nueva rama en tu trabajo. Quedando tu registro de confirmaciones como en la Figura 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)
 
Figura 3-37. Traer (fetch) algunas confirmaciones de cambio (commits) y fusionarlas (merge) sobre tu trabajo.

A continuación, la persona que habia llevado cambios al servidor central decide retroceder y reorganizar su trabajo; haciendo un 'git push --force' para sobreescribir el registro en el servidor. Tu te traes (fetch) esos nuevos cambios desde el servidor.


![](http://git-scm.com/figures/18333fig0338-tn.png)
 
Figura 3-38. Alguien envia (push) confirmaciones (commits) reorganizadas, abandonando las confirmaciones en las que tu habias basado tu trabajo.

En ese momento, tu te ves obligado a fusionar (merge) tu trabajo de nuevo, aunque creias que ya lo habias hecho antes. La reorganización cambia los resumenes (hash) SHA-1 de esas confirmaciones (commits), haciendo que Git se crea que son nuevas confirmaciones. Cuando realmente tu ya tenias el trabajo de C4 en tu registro.


![](http://git-scm.com/figures/18333fig0339-tn.png)
 
Figura 3-39. Vuelves a fusionar el mismo trabajo en una nueva fusión confirmada.

Te ves obligado a fusionar (merge) ese trabajo en algún punto, para poder seguir adelante con otros desarrollos en el futuro. Tras todo esto, tu registro de confirmaciones de cambio (commit history) contendrá tanto la confirmación C4 como la C4'; teniendo ambas el mismo contenido y el mismo mensaje de confirmación. Si lanzas un 'git log' en un registro como este, verás dos confirmaciones  con el mismo autor, misma fecha y mismo mensaje. Lo que puede llevar a confusiones. Es más, si luego tu envias (push) ese registro de vuelta al servidor, vas a introducir todas esas confirmaciones reorganizadas en el servidor central. Lo que puede confundir aún más a la gente.

Si solo usas la reorganización como una vía para hacer limpieza y organizar confirmaciones de cambio antes de enviarlas, y si únicamente reorganizas confirmaciones que nunca han sido públicas. Entonces no tendrás problemas. Si, por el contrario, reorganizas confirmaciones que alguna vez han sido públicas y otra gente ha basado su trabajo  en ellas. Entonces estarás en un aprieto.
