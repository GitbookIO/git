# Pri versikontrolo

Kio estas versikontrolo, kaj kial vi okupiĝu pri tio? Versikontrolo estas sistemo kiu registras ŝanĝojn pri dosiero aŭ dosieraro dumtempe por ke vi povu revoki specifajn versiojn poste. Por la ekzemploj en ĉi tiu libro vi uzos programaran fontkodon kiel la dosierojn versikontrolataj, sed vere vi povas fari ĉi tion pri ĉiaj dosieroj komputilaj.

Se vi estas grafika aŭ retpaĝa dizajnisto kaj vi volas manteni ĉiujn versiojn de bildo aŭ aspekto (kion vi nepre volu), versikontrola sistemo (VCS, version control system en la angla) estas tre uzinda. Ĝi permesas al vi remeti dosierojn al antaŭa stato, kompari ŝanĝojn laŭ la tempo, vidi kiu ŝanĝis ion kio povus kaŭzi problemon, kiu enmetis problemon kaj kiam, kaj pli. Uzante VCSon kutime ankaŭ signifas ke se vi ion fuŝigis aŭ se vi perdis dosierojn, vi facile povas reiri. Aldone, vi ĉion tion havas kun malmulta superŝarĝo.

## Lokaj versikontrolaj sistemoj

La preferata versikontrola metodo de multaj homoj estas kopii dosierojn al alia dosierujo (se ili prudentas, kun hormarko en la nomo). Ĉi tiu maniero estas tre komuna ĉar ĝi estas tiom simpla, sed ĝi ankaŭ malfermas la pordon al multaj problemoj. Facilas forgesi en kiu dosierujo vi estas kaj akcidente skribi al la malĝusta dosiero aŭ kopii super dosierojn pri kiuj vi tion ne volis.

Por ataki tiun problemon, programistoj antaŭlonge disvolvis lokajn VCSojn kiuj havis simplan datumbazon kiu mantenis ĉiujn ŝanĝojn al dosieroj sub kontrolo (vidu bildon 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)
 
Bildo 1-1. Diagramo pri loka versikontrolo.

One of the more popular VCS tools was a system called rcs, which is still distributed with many computers today. Even the popular Mac OS X operating system includes the  rcs command when you install the Developer Tools. This tool basically works by keeping patch sets (that is, the differences between files) from one change to another in a special format on disk; it can then re-create what any file looked like at any point in time by adding up all the patches.

## Centralized Version Control Systems

The next major issue that people encounter is that they need to collaborate with developers on other systems. To deal with this problem, Centralized Version Control Systems (CVCSs) were developed. These systems, such as CVS, Subversion, and Perforce, have a single server that contains all the versioned files, and a number of clients that check out files from that central place. For many years, this has been the standard for version control (see Figure 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)
 
Figure 1-2. Centralized version control diagram.

This setup offers many advantages, especially over local VCSs. For example, everyone knows to a certain degree what everyone else on the project is doing. Administrators have fine-grained control over who can do what; and it’s far easier to administer a CVCS than it is to deal with local databases on every client.

However, this setup also has some serious downsides. The most obvious is the single point of failure that the centralized server represents. If that server goes down for an hour, then during that hour nobody can collaborate at all or save versioned changes to anything they’re working on. If the hard disk the central database is on becomes corrupted, and proper backups haven’t been kept, you lose absolutely everything—the entire history of the project except whatever single snapshots people happen to have on their local machines. Local VCS systems suffer from this same problem—whenever you have the entire history of the project in a single place, you risk losing everything.

## Distributed Version Control Systems

This is where Distributed Version Control Systems (DVCSs) step in. In a DVCS (such as Git, Mercurial, Bazaar or Darcs), clients don’t just check out the latest snapshot of the files: they fully mirror the repository. Thus if any server dies, and these systems were collaborating via it, any of the client repositories can be copied back up to the server to restore it. Every checkout is really a full backup of all the data (see Figure 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)
 
Figure 1-3. Distributed version control diagram.

Furthermore, many of these systems deal pretty well with having several remote repositories they can work with, so you can collaborate with different groups of people in different ways simultaneously within the same project. This allows you to set up several types of workflows that aren’t possible in centralized systems, such as hierarchical models.
