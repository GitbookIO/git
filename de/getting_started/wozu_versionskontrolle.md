# Wozu Versionskontrolle?

<!--What is version control, and why should you care? Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. Even though the examples in this book show software source code as the files under version control, in reality any type of file on a computer can be placed under version control.-->

Was ist  die Versionskontrolle, und warum solltest Du Dich dafür interessieren? Versionskontrollsysteme (VCS) protokollieren Änderungen an einer Datei oder einer Anzahl von Dateien über die Zeit hinweg, so dass man zu jedem Zeitpunkt auf Versionen und Änderungen zugreifen kann. Die Beispiele in diesem Buch verwenden Software Quellcode, tatsächlich aber kannst Du Änderungen an praktisch jeder Art von Datei per Versionskontrolle nachverfolgen.

<!--If you are a graphic or web designer and want to keep every version of an image or layout (which you certainly would), it is very wise to use a Version Control System (VCS). A VCS allows you to: revert files back to a previous state, revert the entire project back to a previous state, review changes made over time, see who last modified something that might be causing a problem, who introduced an issue and when, and more. Using a VCS also means that if you screw things up or lose files, you can generally recover easily. In addition, you get all this for very little overhead.-->

Als ein Grafik- oder Webdesigner zum Beispiel willst Du in der Lage sein, jede Version eines Bildes oder Layouts zurückverfolgen zu können. Es wäre daher sehr ratsam, ein Versionskontrollsystem zu verwenden. Ein solches System erlaubt Dir, einzelne Dateien oder auch ein ganzes Projekt in einen früheren Zustand zurückzuversetzen, nachzuvollziehen, wer zuletzt welche Änderungen vorgenommen hat, die möglicherweise Probleme verursachen, wer eine Änderung ursprünglich vorgenommen hat usw. Ein Versionskontrollsystem für Deine Arbeit zu verwenden, versetzt Dich in die Lage jederzeit zu einem vorherigen, funktionierenden Zustand zurückzugehen, wenn Du vielleicht Mist gebaut oder aus irgendeinem Grunde Dateien verloren hast. All diese Vorteile erhältst Du für einen nur sehr geringen, zusätzlichen Aufwand.

<!--## Local Version Control Systems-->
## Lokale Versionskontrollsysteme

<!--Many people’s version-control method of choice is to copy files into another directory (perhaps a time-stamped directory, if they’re clever). This approach is very common because it is so simple, but it is also incredibly error prone. It is easy to forget which directory you’re in and accidentally write to the wrong file or copy over files you don’t mean to.-->

Viele Leute kontrollieren Versionen ihrer Arbeit, indem sie einfach Dateien in ein anderes Verzeichnis kopieren (wenn sie clever sind: ein Verzeichnis mit einem Zeitstempel im Namen). Diese Vorgehensweise ist üblich, weil sie so einfach ist. Aber sie ist auch unglaublich fehleranfällig. Man vergisst sehr leicht, in welchem Verzeichnis man sich gerade befindet und kopiert die falschen Dateien oder überschreibt Dateien, die man eigentlich nicht überschreiben wollte.

<!--To deal with this issue, programmers long ago developed local VCSs that had a simple database that kept all the changes to files under revision control (see Figure 1-1).-->

Um diese Arbeit zu erleichtern und sicherer zu machen, haben Programmierer vor langer Zeit Versionskontrollsysteme entwickelt, die alle Änderungen an allen relevanten Dateien in einer lokalen Datenbank verfolgten (siehe Bild 1-1).

<!--Figure 1-1. Local version control diagram.-->


![](http://git-scm.com/figures/18333fig0101-tn.png)

Bild 1-1. Diagramm: Lokale Versionskontrolle

<!--One of the more popular VCS tools was a system called rcs, which is still distributed with many computers today. Even the popular Mac OS X operating system includes the rcs command when you install the Developer Tools. This tool basically works by keeping patch sets (that is, the differences between files) from one revision to another in a special format on disk; it can then recreate what any file looked like at any point in time by adding up all the patches.-->

Eines der populärsten Versionskontrollsysteme war rcs, und es wird heute immer noch mit vielen Computern ausgeliefert. Z.B. umfasst auch das Betriebssystem Mac OS X den Befehl rcs, wenn Du die Developer Tools installierst. Dieser Befehl arbeitet nach dem Prinzip, dass er für jede Änderung einen Patch (d.h. eine Kodierung der Unterschiede, die eine Änderung an einer oder mehreren Dateien umfasst) in einem speziellen Format in einer Datei auf der Festplatte speichert.

<!--## Centralized Version Control Systems-->
## Zentralisierte Versionskontrollsysteme

<!--The next major issue that people encounter is that they need to collaborate with developers on other systems. To deal with this problem, Centralized Version Control Systems (CVCSs) were developed. These systems, such as CVS, Subversion, and Perforce, have a single server that contains all the versioned files, and a number of clients that check out files from that central place. For many years, this has been the standard for version control (see Figure 1-2).-->

Das nächste Problem, mit dem Programmierer sich dann konfrontiert sahen, bestand in der Zusammenarbeit mit anderen: Änderungen an dem gleichen Projekt mussten auf verschiedenen Computern, möglicherweise verschiedenen Betriebssystemen vorgenommen werden können. Um dieses Problem zu lösen, wurden Zentralisierte Versionskontrollsysteme (CVCS) entwickelt. Diese Systeme, beispielsweise CVS, Subversion und Perforce, basieren auf einem zentralen Server, der alle versionierten Dateien verwaltet. Wer an diesen Dateien arbeiten will, kann sie von diesem Server abholen („check out“ xxx), auf seinem eigenen Computer bearbeiten und dann wieder auf dem Server abliefern. Diese Art von System war über viele Jahre hinweg der Standard für Versionskontrollsysteme (siehe Bild 1-2).

<!--Figure 1-2. Centralized version control diagram.-->


![](http://git-scm.com/figures/18333fig0102-tn.png)

Bild 1-2. Diagramm: Zentralisierte Versionskontrollsysteme

<!--This setup offers many advantages, especially over local VCSs. For example, everyone knows to a certain degree what everyone else on the project is doing. Administrators have fine-grained control over who can do what; and it’s far easier to administer a CVCS than it is to deal with local databases on every client.-->

Dieser Aufbau hat viele Vorteile gegenüber Lokalen Versionskontrollsystemen. Zum Beispiel weiß jeder mehr oder weniger genau darüber Bescheid, was andere, an einem Projekt Beteiligte gerade tun. Administratoren haben die Möglichkeit, detailliert festzulegen, wer was tun kann. Und es ist sehr viel einfacher, ein CVCS zu administrieren als lokale Datenbanken auf jedem einzelnen Anwenderrechner zu verwalten.

<!--However, this setup also has some serious downsides. The most obvious is the single point of failure that the centralized server represents. If that server goes down for an hour, then during that hour nobody can collaborate at all or save versioned changes to anything they’re working on. If the hard disk the central database is on becomes corrupted, and proper backups haven’t been kept, you lose absolutely everything—the entire history of the project except whatever single snapshots people happen to have on their local machines. Local VCS systems suffer from this same problem—whenever you have the entire history of the project in a single place, you risk losing everything.-->

Allerdings hat dieser Aufbau auch einige erhebliche Nachteile. Der offensichtlichste Nachteil ist der „Single Point of Failure“, den der zentralisierte Server darstellt. Wenn dieser Server für nur eine Stunde nicht verfügbar ist, dann kann in dieser Stunde niemand in irgendeiner Form mit anderen arbeiten oder versionierte Änderungen an den Dateien speichern, an denen sie momentan arbeiten. Wenn die auf dem zentralen Server verwendete Festplatte beschädigt wird und keine Sicherheitskopien erstellt wurden, dann sind all diese Daten unwiederbringlich verloren – die komplette Historie des Projektes, abgesehen natürlich von dem jeweiligen Zustand, den Mitarbeiter gerade zufällig auf ihrem Rechner haben. Lokale Versionskontrollsysteme haben natürlich dasselbe Problem: wenn man die Historie eines Projektes an einer einzigen, zentralen Stelle verwaltet, riskiert man, sie vollständig zu verlieren, wenn irgendetwas an dieser zentralen Stelle ernsthaft schief läuft.

<!--## Distributed Version Control Systems-->
## Verteilte Versionskontrollsysteme

<!--This is where Distributed Version Control Systems (DVCSs) step in. In a DVCS (such as Git, Mercurial, Bazaar or Darcs), clients don’t just check out the latest snapshot of the files: they fully mirror the repository. Thus if any server dies, and these systems were collaborating via it, any of the client repositories can be copied back up to the server to restore it. Every checkout is really a full backup of all the data (see Figure 1-3).-->

Und an dieser Stelle kommen verteilte Versionskontrollsysteme (DVCS) ins Spiel. In einem DVCS (wie z.B. Git, Mercurial, Bazaar oder Darcs) erhalten Anwender nicht einfach den jeweils letzten Snapshot des Projektes von einem Server: sie erhalten statt dessen eine vollständige Kopie des Repositories. Auf diese Weise kann, wenn ein Server beschädigt wird, jedes beliebige Repository von jedem beliebigen Anwenderrechner zurück kopiert werden und der Server so wieder hergestellt werden.

<!--Figure 1-3. Distributed version control diagram.-->


![](http://git-scm.com/figures/18333fig0103-tn.png)

Bild 1-3. Diagramm: Distribuierte Versionskontrolle

<!--Furthermore, many of these systems deal pretty well with having several remote repositories they can work with, so you can collaborate with different groups of people in different ways simultaneously within the same project. This allows you to set up several types of workflows that aren’t possible in centralized systems, such as hierarchical models.-->

Darüber hinaus können derartige Systeme hervorragend mit verschiedenen externen („remote“) Repositories umgehen, sodass man mit verschiedenen Gruppen von Leuten simultan in verschiedenen Weisen zusammenarbeiten kann. Das macht es möglich, verschiedene Arten von Arbeitsabläufen (wie Hierarchien) zu integrieren, was mit zentralisierten Systemen nicht möglich ist.

<!--# A Short History of Git-->