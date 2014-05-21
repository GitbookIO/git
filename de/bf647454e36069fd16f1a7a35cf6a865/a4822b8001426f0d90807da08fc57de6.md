# Git Grundlagen

<!--So, what is Git in a nutshell? This is an important section to absorb, because if you understand what Git is and the fundamentals of how it works, then using Git effectively will probably be much easier for you. As you learn Git, try to clear your mind of the things you may know about other VCSs, such as Subversion and Perforce; doing so will help you avoid subtle confusion when using the tool. Git stores and thinks about information much differently than these other systems, even though the user interface is fairly similar; understanding those differences will help prevent you from becoming confused while using it.-->

Was also ist Git, in kurzen Worten? Es ist wichtig, den folgenden Abschnitt zu verstehen, in dem es um die grundlegenden Konzepte von Git geht. Das wird Dich in die Lage versetzen, Git einfacher und effektiver anzuwenden. Versuche Dein vorhandenes Wissen über andere Versionskontrollsysteme, wie Subversion oder Perforce, zu ignorieren, während Du Git kennen lernst. Git speichert und konzipiert Information anders als andere Systeme, auch wenn das Interface relativ ähnlich wirkt. Diese Unterschiede zu verstehen wird Dir helfen, Verwirrung bei der Anwendung von Git zu vermeiden.

<!--## Snapshots, Not Differences-->
## Snapshots, nicht Diffs

<!--The major difference between Git and any other VCS (Subversion and friends included) is the way Git thinks about its data. Conceptually, most other systems store information as a list of file-based changes. These systems (CVS, Subversion, Perforce, Bazaar, and so on) think of the information they keep as a set of files and the changes made to each file over time, as illustrated in Figure 1-4.-->

Der Hauptunterschied zwischen Git und anderen Versionskontrollsystemen (auch Subversion und vergleichbaren Systemen) besteht in der Art und Weise wie Git Daten betrachtet. Die meisten anderen Systeme speichern Information als eine fortlaufende Liste von Änderungen an Dateien („Diffs“). Diese Systeme (CVS, Subversion, Perforce, Bazaar usw.) betrachten die Informationen, die sie verwalten, als eine Menge von Dateien und die Änderungen, die über die Zeit hinweg an einzelnen Dateien vorgenommen werden. (Siehe Bild 1-4.)

<!--Figure 1-4. Other systems tend to store data as changes to a base version of each file.-->


![](http://git-scm.com/figures/18333fig0104-tn.png)

Bild 1-4. Andere Systeme speichern Daten als Änderungen an einzelnen Dateien einer Datenbasis

<!--Git doesn’t think of or store its data this way. Instead, Git thinks of its data more like a set of snapshots of a mini filesystem. Every time you commit, or save the state of your project in Git, it basically takes a picture of what all your files look like at that moment and stores a reference to that snapshot. To be efficient, if files have not changed, Git doesn’t store the file again—just a link to the previous identical file it has already stored. Git thinks about its data more like Figure 1-5.-->

Git sieht Daten nicht in dieser Weise. Stattdessen betrachtet Git seine Daten eher als eine Reihe von Snapshots eines Mini-Dateisystems. Jedes Mal, wenn Du committest (d.h. den gegenwärtigen Status Deines Projektes als eine Version in Git speicherst), sichert Git den Zustand sämtlicher Dateien in diesem Moment („Snapshot“) und speichert eine Referenz auf diesen Snapshot. Um dies möglichst effizient und schnell tun zu können, kopiert Git unveränderte Dateien nicht, sondern legt lediglich eine Verknüpfung zu der vorherigen Version der Datei an. Git betrachtet Daten also wie in Bild 1-5 dargestellt.

<!--Figure 1-5. Git stores data as snapshots of the project over time.-->


![](http://git-scm.com/figures/18333fig0105-tn.png)

Bild 1-5. Git speichert Daten als eine Historie von Snapshots des Projektes.

<!--This is an important distinction between Git and nearly all other VCSs. It makes Git reconsider almost every aspect of version control that most other systems copied from the previous generation. This makes Git more like a mini filesystem with some incredibly powerful tools built on top of it, rather than simply a VCS. We’ll explore some of the benefits you gain by thinking of your data this way when we cover Git branching in Chapter 3.-->

Dies ist ein wichtiger Unterschied zwischen Git und praktisch allen anderen Versionskontrollsystemen. In Git wurden daher fast alle Aspekte der Versionskontrolle neu überdacht, die in anderen Systemen mehr oder weniger von ihren jeweiligen Vorgängergeneration übernommen worden waren. Git arbeitet im Großen und Ganzen eher wie ein (mit einigen unglaublich mächtigen Werkezeugen ausgerüstetes) Mini-Dateisystem, als wie ein gängiges Versionskontrollsystem. Auf einige der Vorteile, die es mit sich bringt, Daten in dieser Weise zu betrachten, werden wir in Kapitel 3 eingehen, wenn wir das Git Branching Konzept diskutieren.

<!--## Nearly Every Operation Is Local-->
## Fast jede Operation ist lokal

<!--Most operations in Git only need local files and resources to operate — generally no information is needed from another computer on your network.  If you’re used to a CVCS where most operations have that network latency overhead, this aspect of Git will make you think that the gods of speed have blessed Git with unworldly powers. Because you have the entire history of the project right there on your local disk, most operations seem almost instantaneous.-->

Die meisten Operationen in Git benötigen nur die lokalen Dateien und Ressourcen auf Deinem Rechner, um zu funktionieren. D.h. im Allgemeinen werden keine Informationen von einem anderen Rechner im Netzwerk benötigt. Wenn Du mit einem CVCS gearbeitet hast, das für die meisten Operationen einen Network Latency Overhead (also Wartezeiten, die das Netzwerk benötigt werden) hat, dann wirst Du den Eindruck haben, dass die Götter der Geschwindigkeit Git mit unaussprechlichen Fähigkeiten ausgestattet haben. Weil man die vollständige Historie lokal auf dem Rechner hat, werden die allermeisten Operationen ohne jede Verzögerung ausgeführt und sind sehr schnell.

<!--For example, to browse the history of the project, Git doesn’t need to go out to the server to get the history and display it for you—it simply reads it directly from your local database. This means you see the project history almost instantly. If you want to see the changes introduced between the current version of a file and the file a month ago, Git can look up the file a month ago and do a local difference calculation, instead of having to either ask a remote server to do it or pull an older version of the file from the remote server to do it locally.-->

Um beispielsweise die Historie des Projektes zu durchsuchen, braucht Git sie nicht von einem externen Server zu holen – es liest sie einfach aus der lokalen Datenbank. Das heißt, Du siehst die vollständige Projekthistorie ohne jede Verzögerung. Wenn Du sehen willst, worin sich die aktuelle Version einer Datei von einer Version von vor einem Monat unterscheidet, dann kann Git diese Versionen lokal nachschlagen und ihre Unterschiede lokal bestimmen. Es braucht dazu keinen externen Server – weder um Dateien dort nachzuschlagen, noch um Unterschiede dort bestimmen zu lassen.

<!--This also means that there is very little you can’t do if you’re offline or off VPN. If you get on an airplane or a train and want to do a little work, you can commit happily until you get to a network connection to upload. If you go home and can’t get your VPN client working properly, you can still work. In many other systems, doing so is either impossible or painful. In Perforce, for example, you can’t do much when you aren’t connected to the server; and in Subversion and CVS, you can edit files, but you can’t commit changes to your database (because your database is offline). This may not seem like a huge deal, but you may be surprised what a big difference it can make.-->

Dies bedeutet natürlich außerdem, dass es fast nichts gibt, was Du nicht tun kannst, bloß weil Du gerade offline bist oder keinen Zugriff auf ein VPN hast. Wenn Du im Flugzeug oder Zug ein wenig arbeiten willst, kannst Du problemlos Deine Arbeit committen und Deine Arbeit erst auf den Server pushen (hochladen), wenn Du wieder mit dem Internet verbunden bist. Wenn Du zu Hause bist aber nicht auf das VPN zugreifen kannst, kannst Du dennoch arbeiten. Perforce z.B. erlaubt Dir dagegen nicht sonderlich viel zu tun, solange Du nicht mit dem Server verbunden bist. Und in Subversion und CVS kannst Du Dateien zwar ändern, die Änderungen aber nicht in der Datenbank sichern (weil die Datenbank offline ist). Das mag auf den ersten Blick nicht nach einem großen Problem aussehen, aber Du wirst überrascht sein, was für einen großen Unterschied das ausmachen kann.

<!--## Git Has Integrity-->
## Git stellt Integrität sicher

<!--Everything in Git is check-summed before it is stored and is then referred to by that checksum. This means it’s impossible to change the contents of any file or directory without Git knowing about it. This functionality is built into Git at the lowest levels and is integral to its philosophy. You can’t lose information in transit or get file corruption without Git being able to detect it.-->

In Git werden Änderungen in Checksummen umgerechnet, bevor sie gespeichert werden. Anschließend werden sie mit dieser Checksumme referenziert. Das macht es unmöglich, dass sich die Inhalte von Dateien oder Verzeichnissen ändern, ohne dass Git das mitbekommt. Git basiert auf dieser Funktionalität und sie ist ein integraler Teil von Gits Philosophie. Man kann Informationen deshalb z.B. nicht während der Übermittlung verlieren oder unwissentlich beschädigte Dateien verwenden, ohne dass Git in der Lage wäre, dies festzustellen.

<!--The mechanism that Git uses for this checksumming is called a SHA-1 hash. This is a 40-character string composed of hexadecimal characters (0–9 and a–f) and calculated based on the contents of a file or directory structure in Git. A SHA-1 hash looks something like this:-->

Der Mechanismus, den Git verwendet, um diese Checksummen zu erstellen, heißt SHA-1 Hash. Eine solche Checksumme ist eine 40 Zeichen lange Zeichenkette, die aus hexadezimalen Zeichen besteht und diese wird von Git aus den Inhalten einer Datei oder Verzeichnisstruktur kalkuliert. Ein SHA-1 Hash sieht wie folgt aus:

	24b9da6552252987aa493b52f8696cd6d3b00373

<!--You will see these hash values all over the place in Git because it uses them so much. In fact, Git stores everything not by file name but in the Git database addressable by the hash value of its contents.-->

Dir werden solche Hash Werte überall in Git begegnen, weil es sie so ausgiebig benutzt. Tatsächlich speichert und referenziert Git Informationen über Dateien in der Datenbank nicht nach ihren Dateinamen sondern nach den Hash Werten ihrer Inhalte.

<!--## Git Generally Only Adds Data-->
## Git verwaltet fast ausschließlich Daten

<!--When you do actions in Git, nearly all of them only add data to the Git database. It is very difficult to get the system to do anything that is not undoable or to make it erase data in any way. As in any VCS, you can lose or mess up changes you haven’t committed yet; but after you commit a snapshot into Git, it is very difficult to lose, especially if you regularly push your database to another repository.-->

Fast alle Operationen, die Du in der täglichen Arbeit mit Git verwendest, fügen Daten jeweils nur zur internen Git Datenbank hinzu. Deshalb ist es sehr schwer, das System dazu zu bewegen, irgendetwas zu tun, das nicht wieder rückgängig zu machen ist, oder dazu, Daten in irgendeiner Form zu löschen. In jedem anderen VCS ist es leicht, Änderungen, die man noch nicht gespeichert hat, zu verlieren oder unbrauchbar zu machen. In Git dagegen ist es schwierig, einen einmal gespeicherten Snapshot zu verlieren, insbesondere wenn man regelmäßig in ein anderes Repository pusht.

<!--This makes using Git a joy because we know we can experiment without the danger of severely screwing things up. For a more in-depth look at how Git stores its data and how you can recover data that seems lost, see Chapter 9.-->

U.a. deshalb macht es so viel Spaß, mit Git zu arbeiten. Man kann mit Änderungen experimentieren, ohne befürchten zu müssen, irgendetwas zu zerstören oder durcheinander zu bringen. Einen tieferen Einblick in die Art, wie Git Daten speichert und wie man Daten, die scheinbar verloren sind, wieder herstellen kann, wird Kapitel 9 gewähren.

<!--## The Three States-->
## Die drei Zustände

<!--Now, pay attention. This is the main thing to remember about Git if you want the rest of your learning process to go smoothly. Git has three main states that your files can reside in: committed, modified, and staged. Committed means that the data is safely stored in your local database. Modified means that you have changed the file but have not committed it to your database yet. Staged means that you have marked a modified file in its current version to go into your next commit snapshot.-->

Jetzt aufgepasst. Es folgt die wichtigste Information, die Du Dir merken musst, wenn Du Git kennen lernen willst und Fallstricke vermeiden willst. Git definiert drei Haupt-Zustände, in denen sich eine Datei befinden kann: committed, modified („geändert“) und staged („vorgemerkt“). „Committed“ bedeutet, dass die Daten in der lokalen Datenbank gesichert sind. „Modified“ bedeutet, dass die Datei geändert, diese Änderung aber noch nicht committed wurde. „Staged“ bedeutet, dass Du eine geänderte Datei in ihrem gegenwärtigen Zustand für den nächsten Commit vorgemerkt hast.

<!--This leads us to the three main sections of a Git project: the Git directory, the working directory, and the staging area.-->

Das führt uns zu den drei Hauptbereichen eines Git Projektes: das Git Verzeichnis, das Arbeitsverzeichnis und die Staging Area.

<!--Figure 1-6. Working directory, staging area, and git directory.-->


![](http://git-scm.com/figures/18333fig0106-tn.png)

Bild 1-6. Arbeitsverzeichnis, Staging Area (xxx) und Git Verzeichnis

<!--The Git directory is where Git stores the metadata and object database for your project. This is the most important part of Git, and it is what is copied when you clone a repository from another computer.-->

Das Git Verzeichnis ist der Ort, an dem Git Metadaten und die lokale Datenbank für Dein Projekt speichert. Dies ist der wichtigste Teil von Git, und dieser Teil wird kopiert, wenn Du ein Repository von einem anderen Rechner klonst.

<!--The working directory is a single checkout of one version of the project. These files are pulled out of the compressed database in the Git directory and placed on disk for you to use or modify.-->

Dein Arbeitsverzeichnis ist ein Checkout („Abbild“ xxx) einer spezifischen Version des Projektes. Diese Dateien werden aus der komprimierten Datenbank geholt und auf der Festplatte in einer Form gespeichert, die Du bearbeiten und modifizieren kannst.

<!--The staging area is a simple file, generally contained in your Git directory, that stores information about what will go into your next commit. It’s sometimes referred to as the index, but it’s becoming standard to refer to it as the staging area.-->

Die Staging Area ist einfach eine Datei (normalerweise im Git Verzeichnis), in der vorgemerkt wird, welche Änderungen Dein nächster Commit umfassen soll. Sie wird manchmal auch als „Index“ bezeichnet, aber der Begriff „Staging Area“ ist der gängigere.

<!--The basic Git workflow goes something like this:-->

Der grundlegend Git Arbeitsprozess sieht in etwa so aus:

<!--1. You modify files in your working directory.-->
<!--2. You stage the files, adding snapshots of them to your staging area.-->
<!--3. You do a commit, which takes the files as they are in the staging area and stores that snapshot permanently to your Git directory.-->

1. Du bearbeitest Dateien in Deinem Arbeitsverzeichnis.
2. Du markierst Dateien für den nächsten Commit, indem Du Snapshots zur Staging Area hinzufügst.
3. Du legst den Commit an, wodurch die in der Staging Area vorgemerkten Snapshots dauerhaft im Git Verzeichnis (d.h. der lokalen Datenbank) gespeichert werden.

<!--If a particular version of a file is in the git directory, it’s considered committed. If it’s modified but has been added to the staging area, it is staged. And if it was changed since it was checked out but has not been staged, it is modified. In Chapter 2, you’ll learn more about these states and how you can either take advantage of them or skip the staged part entirely.-->

Wenn eine bestimmte Version einer Datei im Git Verzeichnis liegt, gilt sie als „committed“. Wenn sie geändert und in der Staging Area vorgemerkt ist, gilt sie als „staged“. Und wenn sie geändert, aber noch nicht zur Staging Area hinzugefügt wurde, gilt sie als „modified“. In Kapitel 2 wirst Du mehr über diese Zustände lernen und darüber, wie Du sie sinnvoll einsetzen und wie Du den Zwischenschritt der Staging Area auch einfach überspringen kannst.

<!--# Installing Git-->