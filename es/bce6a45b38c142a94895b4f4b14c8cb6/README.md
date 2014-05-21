# Los entresijos internos de Git

Puedes que hayas llegado a este capítulo saltando desde alguno previo o puede que hayas llegado tras leer todo el resto del libro. --En uno u otro caso, aquí es donde aprenderás acerca del funcionamiento interno y la implementación de Git--. Me parece que esta información es realmente importante para entender cúan util y potente es Git. Pero algunas personas opinan que puede ser confuso e innecesariamente complejo para novatos. Por ello, lo he puesto al final del libro; de tal forma que puedas leerlo antes o después, en cualquier momento, a lo largo de tu proceso de aprendizaje. Lo dejo en tus manos.

Y, ahora que estamos aquí, comencemos con el tema. Ante todo, por si no estuviera suficientemente claro ya, Git es fundamentalmente un sistema de archivo (filesystem) con un interface de usuario (VCS) escrito sobre él. En breve lo veremos con más detalle.

En los primeros tiempos de Git (principalmente antes de la versión 1.5), el interface de usuario era mucho más complejo, ya que se centraba en el sistema de archivos en lugar de en el VCS. En los últimos años, el IU se ha refinado hasta llegar a ser tan limpio y sencillo de usar como el de cualquier otro sistema; pero frecuentemente, el estereotipo sigue mostrando a Git como complejo y dificil de aprender. 

La capa del sistema de archivos que almacena el contenido es increiblemente interesante; por ello, es lo primero que voy a desarrollar en este capítulo. A continuación mostraré los mecanismos de transporte y las tareas de mantenimiento del repositorio que posiblemente necesites usar alguna vez.
