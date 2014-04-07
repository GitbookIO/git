# Acerca del Control de Versiones

¿Qué es control de versiones, y por qué debería importarte? El control de versiones es un sistema que registra los cambios realizado a un archivo o conjunto de archivos a través del tiempo, de manera que puedas llamar una versión específica tiempo después. Para los ejemplos en este libro utilizaremos el código fuente del software como los archivos a ser controlados por versiones, aunque en realidad puedes hacer esto con casi cualquier tipo de archivo en una computadora.

Si eres diseñador gráfico o diseñador web y quieres mantener cada versión de una imagen o de un diseño (que seguramente lo querrás hacer), usar un Sistema de Control de Versiones (VCS por su siglas en inglés) es una sabia decisión. Te permite revertir archivos a un estado previo, revertir el proyecto completo a un estado anterior, comparar cambios en el tiempo, ver quien modificó algo por última vez que pudo estar causando un problema, quien introdujo un problema y cuando, y más. Usar un VCS también significa que si dañas algo o pierdes archivos, generalmente podrás recuperarlos con facilidad. Adicionalmente, obtienes todo esto por muy poco trabajo extra. 

## Local Version Control Systems

Many people’s version-control method of choice is to copy files into another directory (perhaps a time-stamped directory, if they’re clever). This approach is very common because it is so simple, but it is also incredibly error prone. It is easy to forget which directory you’re in and accidentally write to the wrong file or copy over files you don’t mean to.

To deal with this issue, programmers long ago developed local VCSs that had a simple database that kept all the changes to files under revision control (see Figure 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)
 
Figure 1-1. Local version control diagram

One of the more popular VCS tools was a system called rcs, which is still distributed with many computers today. Even the popular Mac OS X operating system includes the  rcs command when you install the Developer Tools. This tool basically works by keeping patch sets (that is, the differences between files) from one change to another in a special format on disk; it can then re-create what any file looked like at any point in time by adding up all the patches.

## Centralized Version Control Systems

The next major issue that people encounter is that they need to collaborate with developers on other systems. To deal with this problem, Centralized Version Control Systems (CVCSs) were developed. These systems, such as CVS, Subversion, and Perforce, have a single server that contains all the versioned files, and a number of clients that check out files from that central place. For many years, this has been the standard for version control (see Figure 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)
 
Figure 1-2. Centralized version control diagram

This setup offers many advantages, especially over local VCSs. For example, everyone knows to a certain degree what everyone else on the project is doing. Administrators have fine-grained control over who can do what; and it’s far easier to administer a CVCS than it is to deal with local databases on every client.

However, this setup also has some serious downsides. The most obvious is the single point of failure that the centralized server represents. If that server goes down for an hour, then during that hour nobody can collaborate at all or save versioned changes to anything they’re working on. If the hard disk the central database is on becomes corrupted, and proper backups haven’t been kept, you lose absolutely everything—the entire history of the project except whatever single snapshots people happen to have on their local machines. Local VCS systems suffer from this same problem—whenever you have the entire history of the project in a single place, you risk losing everything.

## Distributed Version Control Systems

This is where Distributed Version Control Systems (DVCSs) step in. In a DVCS (such as Git, Mercurial, Bazaar or Darcs), clients don’t just check out the latest snapshot of the files: they fully mirror the repository. Thus if any server dies, and these systems were collaborating via it, any of the client repositories can be copied back up to the server to restore it. Every checkout is really a full backup of all the data (see Figure 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)
 
Figure 1-3. Distributed version control diagram

Furthermore, many of these systems deal pretty well with having several remote repositories they can work with, so you can collaborate with different groups of people in different ways simultaneously within the same project. This allows you to set up several types of workflows that aren’t possible in centralized systems, such as hierarchical models.
