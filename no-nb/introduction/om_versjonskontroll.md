# Om versjonskontroll

Hva er versjonskontroll, og hvorfor burde du bry deg? Versjonskontroll er et system som holder styr på forandringer i en fil, eller et sett av filer, over tid, slik at du kan finne tilbake til spesifikke versjoner senere. Selv om eksemplene i denne boka viser kildekodefiler under versjonskontroll, kan man i realiteten bruke det på alle typer filer på en datamaskin.

Er du en grafisk designer eller arbeider med webdesign og ønsker å beholde alle versjoner av et bilde eller en layout (som du sannsynligvis vil), så er det lurt å bruke et Version Control System (VCS). Et VCS gjør det mulig for deg å: tilbakestille filer til en tidligere utgave, tilbakestille hele prosjektet til en tidligere utgave, sjekke forandringer over tid, se hvem som sist forandret noe som muligens forårsaker et problem, hvem som introduserte en sak og når, osv. Å benytte seg av et VCS betyr også at dersom du roter det til eller mister filer, kan du vanligvis komme tilbake opp å kjøre raskt og enkelt. I tillegg, så får du alt dette uten at det krever noe videre av deg eller systemet ditt.

## Lokalt versjonsstyringssystem

Mange folks valgte versjonskontrollmetode innebærer å kopiere filer til en annen mappe (kanskje med datomerking hvis de er smarte). Denne tilnærmingen er vanlig, fordi den er enkel, men det kan også fort gå galt. Det er lett å glemme hvilken mappe man befinner seg i og så ved et uhell skrive til feil fil, eller kopiere over filer man ikke mente.

For å hanskes med dette problemet utviklet programmerere, for lenge siden, lokale VCSer der en enkel database holdt alle forandringer i filer som var under revisjonskontroll (se Figure 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)

Figure 1-1. Lokalt versjonskontrolldiagram.

Et av de mer populære VCS-verktøyene var et system kalt rcs, som fremdeles distribueres med mange datamaskiner i dag. Selv det populære Mac OS X-operativsystemet inkluderer rcs-kommandoen når en installerer utviklerverktøyene. Dette verktøyet virker, enkelt fortalt, ved å beholde et sett av patcher (dvs, forskjellen mellom filene) fra en revisjon til en annen, i et spesielt format på disken; det kan så gjenskape hvordan enhver fil så ut på et hvilket som helst tidspunkt, ved å legge sammen alle patchene.

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
