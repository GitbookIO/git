# Flujos de trabajo distribuidos

Al contrario de otros Sistemas Centralizados de Control de Versiones, (CVCSs, Centralized Version Control Systems), la naturaleza distribuida de Git permite mucha más flexibilidad en la manera de colaborar en proyectos. En los sistemas centralizados, cada desarrollador es un nodo de trabajo; trabajando todos ellos, en pie de igualdad, sobre un mismo repositorio central. En Git, en cambio, cada desarrollador es potencialmente tanto un nodo como un repositorio --es decir, cada desarrollador puede tanto contribuir a otros repositorios, como servir de repositorio público sobre el que otros desarrolladores pueden basar su trabajo y contribuir a él--. Esto abre un enorme rango de posibles formas de trabajo en tu proyecto y/o en tu equipo. Aquí vamos a revisar algunos de los paradigmas más comunes diseñados para sacar ventaja a esta gran flexibilidad. Vamos a repasar las fortalezas y posibles debilidades de cada paradigma. En tu trabajo, podrás elegir solo uno concreto, o podrás mezclar escogiendo funcionalidades concretas de cada uno.

## Flujo de trabajo centralizado

En los sistemas centralizados, tenemos una única forma de trabajar. Un repositorio o punto central guarda el código fuente; y todo el mundo sincroniza su trabajo con él. Unos cuantos desarrolladores son nodos de trabajo --consumidores de dicho repositorio-- y se sincronizan con dicho punto central. (ver Figura 5-1).


![](http://git-scm.com/figures/18333fig0501-tn.png)

Figura 5-1. Flujo de trabajo centralizado.

Esto significa que, si dos desarrolladores clonan desde el punto central, y ambos hacen cambios; tan solo el primero de ellos en enviar sus cambios de vuelta lo podrá hacer limpiamente. El segundo desarrollador deberá fusionar previamente su trabajo con el del primero, antes de enviarlo, para evitar el sobreescribir los cambios del primero. Este concepto es también válido en Git, tanto como en Subversion (o cualquier otro CVCS), y puede ser perfectamente utilizado en Git.

Si tienes un equipo pequeño o te sientes confortable con un flujo de trabajo centralizado, puedes continuar usando esa forma de trabajo con Git. Solo necesitas disponer un repositorio único, y dar acceso en envio (push) a todo tu equipo. Git se encargará de evitar el que se sobreescriban unos a otros. Si uno de los desarrolladores clona, hace cambios y luego intenta enviarlos; y otro desarrollador ha enviado otros cambios durante ese tiempo; el servidor rechazará los cambios del segundo desarrollador. El sistema le avisará de que está intentando enviar (push) cambios no directos (non-fast-forward changes), y de que no podrá hacerlo hasta que recupere (fetch) y fusione (merge) los cambios preexistentes.
Esta forma de trabajar es atractiva para mucha gente, por ser el paradigma con el que están familiarizados y se sienten confortables.

## Flujo de trabajo del Gestor-de-Integraciones

Al permitir multiples repositorios remotos, en Git es posible tener un flujo de trabajo donde cada desarrollador tenga acceso de escritura a su propio repositorio público y acceso de lectura a los repositorios de todos los demás. Habitualmente, este escenario suele incluir un repositorio canónico, representante "oficial" del proyecto.  Para contribuir en este tipo de proyecto, crearás tu propio clón público del mismo y enviarás (push) tus cambios a este. Después, enviarás una petición a la persona gestora del proyecto principal, para que recupere y consolide (pull) en él tus cambios. Ella podrá añadir tu repositorio como un remoto, chequear tus cambios localmente, fusionarlos (merge) con su rama y enviarlos (push) de vuelta a su repositorio. El proceso funciona de la siguiente manera (ver Figura 5-2):

1. La persona gestora del proyecto envia (push) a su repositorio público (repositorio principal).
2. Una persona que desea contribuir, clona dicho repositorio y hace algunos cambios.
3. La persona colaboradora envia (push) a su propia copia pública.
4. Esta persona colaboradora envia a la gestora un correo electronico solicitándole recupere e integre los cambios.
5. La gestora añade como remoto el repositorio de la colaboradora y fusiona (merge) los cambios localmente.
6. La gestora envia (push) los cambios fusionados al repositorio principal.


![](http://git-scm.com/figures/18333fig0502-tn.png)

Figura 5-2. Flujo de trabajo Gestor-de-Integración.

Esta es una forma de trabajo muy común en sitios tales como GitHub, donde es sencillo bifurcar (fork) un proyecto y enviar tus cambios a tu copia, donde cualquiera puede verlos. La principal ventaja de esta forma de trabajar es que puedes continuar trabajando, y la persona gestora del repositorio principal podrá recuperar (pull) tus cambios en cualquier momento. Las personas colaboradoras no tienen por qué esperar a que sus cambios sean incorporados al proyecto, --cada cual puede trabajar a su propio ritmo--.

## Flujo de trabajo con Dictador y Tenientes

Es una variante del flujo de trabajo con multiples repositorios. Se utiliza generalmente en proyectos muy grandes, con cientos de colaboradores. Un ejemplo muy conocido es el del kernel de Linux. Unos gestores de integración se encargan de partes concretas del repositorio; y se denominan tenientes. Todos los tenientes rinden cuentas a un gestor de integración; conocido como el dictador benevolente. El repositorio del dictador benevolente es el repositorio de referencia, del que recuperan (pull) todos los colaboradores. El proceso funciona como sigue (ver Figura 5-3):

1. Los desarrolladores habituales trabajan cada uno en su rama puntual y reorganizan (rebase) su trabajo sobre la rama master. La rama master es la del dictador benevolente.
2. Los tenienentes fusionan (merge) las ramas puntuales de los desarrolladores sobre su propia rama master.
3. El dictador fusiona las ramas master de los tenientes en su propia rama master.
4. El dictador envia (push) su rama master al repositorio de referencia, para permitir que los desarrolladores reorganicen (rebase) desde ella.


![](http://git-scm.com/figures/18333fig0503-tn.png)

Figura 5-3. Fujo de trabajo del dictador benevolente.

Esta manera de trabajar no es muy habitual, pero es muy util en proyectos muy grandes o en organizaciónes fuertemente jerarquizadas. Permite al lider o a la lider del proyecto (el/la dictador/a) delegar gran parte del trabajo; recolectando el fruto de multiples puntos de trabajo antes de integrarlo en el proyecto.

Hemos visto algunos de los flujos de trabajo mas comunes permitidos por un sistema distribuido como Git. Pero seguro que habrás comenzado a vislumbrar multiples variaciones que puedan encajar con tu particular forma de trabajar. Espero que a estas alturas estés en condiciones de reconocer la combinación de flujos de trabajo que puede serte util. Vamos a ver algunos ejemplos más específicos, ilustrativos de los roles principales que se presentan en las distintas maneras de trabajar.
