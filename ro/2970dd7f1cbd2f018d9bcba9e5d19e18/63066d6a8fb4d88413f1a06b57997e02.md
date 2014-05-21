# Despre Controlul Versiunilor

Ce este de fapt controlul versiunilor, și de ce ar trebui să ne pese? Controlul versiunilor este un sistem care înregistrează schimbările dintr-un fișier sau o mulțime de fișiere de-a lungul timpului astfel încât putem reveni la anumite versiuni mai târziu. Pentru exemplele din acestă carte veți folosi cod sursă ca și fișiere ce se află în sistemul de versionare, cu toate că în realitate puteți face asta pentru aproape orice tip de fișier de pe un calculator.

Dacă sunteți un designer web sau de grafică și doriți să vă păstrați fiecare versiune a unei imagini sau fiecare paginare creată (pe care mai mult ca sigur o doriți), un Sistem de Control al Versiunilor (SCV, VCS [en]) este un lucru foarte util în munca zilnică. Acesta vă va permite să reveniți la o stare anterioară, să comparați schimbările de-a lungul timpului, să vedeți cine a făcut ultima modificare ce poate cauza o problemă, cine a introdus o anumită problemă și când, și multe altele. Folosind un VCS mai înseamnă în general că dacă reușiți totuși să stricați lucruri sau să pierdeți fișiere, veți putea recupera cu ușurință datele inițiale. În plus, obțineți toate acestea cu un minim de resurse suplimentare.

## Sisteme Locale pentru Controlul Versiunilor

Metoda aleasă de mulți pentru controlul versiunilor este de a copia fișierele în alt director (poate chiar un director care conține data în nume, dacă sunt isteți). Această abordare este foarte comună pentru că este atât de simplă, dar în același timp este foarte susceptibilă la erori. Este atât de ușor să uitați în care director lucrați în prezent și din neatenție să scrieți în fișierul incorect sau să suprascrieți fișiere ce nu intenționați să schimbați.

Pentru a trata această problemă, programatorii au dezvoltat cu mult timp în urmă sisteme locale pentru controlul versiunilor (VCS locale) care conțineau o bază de date simplă ce ținea toate schimbările fișierelor aflate sub controlul versiunilor (vezi Figura 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)
 
Figura 1-1. Diagramă pentru controlul versiunilor local.

Unul dintre cele mai populare unelte VCS era un sistem denumit rcs, care este încă distribuit cu multe calculatoare și astăzi. Până și popularul sistem de operare Mac OS X include comanda rcs atunci când instalați Uneltele de Dezvoltare. Acest utilitar practic funcționează prin menținerea mai multor mulțimi de patch-uri ("petice" [ro], care reprezintă de fapt diferențele dintre fișiere) de la schimbare la alta într-un format special pe disc; apoi utilitarul poate recrea cum arăta un anumit fișier la un anumit moment de timp prin adăugarea tuturor patch-urilor.

## Sisteme Centralizate pentru Controlul Versiunilor

Următoarea mare problemă pe care oamenii o au este necesitatea de a colabora cu alți dezvoltatori din alte sisteme. Pentru a face față acestei probleme, au fost dezvoltate Sisteme Centralizate de Controlul Versiunilor (SCCV, CVCS [en]). Aceste sisteme, cum ar fi CVS, Subversion, și Perforce, au un singur server care conține toate fișierele aflate sub controlul versiunilor, și un număr de clienți care preiau (check out [en]) fișiere din acea locație centrală. Timp de mulți ani, acesta a reprezentat standardul sistemele pentru controlul versiunilor (vezi Figura 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)
 
Figura 1-2. Diagramă pentru controlul versiunilor centralizat.

Acest model oferă multe avantaje, în special pentru sistemele locale de versionare. De exemplu, oricine știe până la un anumit punct ce face într-un proiect orice altcineva. Administratorii au un control foarte exact asupra ce poate face un anumit utilizator; în același timp fiind mult mai ușor de administrat un CVCS decât lucrul cu baze de date locale fiecărui client.

Totuși, acest model are și niște dezavantaje serioase. Cel mai evident este legat de un singur punct slab care este reprezentat de serverul central. Dacă acel server se oprește timp de o oră, în acea perioadă nimeni nu mai poate colabora cu nimeni altcineva sau nu poate salva schimbările făcute în cadrul proiectului la care lucrează. Dacă hard discul bazei de date centrale se defectează, și nu există un back-up consistent, se poate ajunge la situația de a pierde totul - întreaga istorie a proiectului cu excepția lucrurilor curente pe care unii membrii ai proiectului le pot avea pe stațiile de lucru locale. Sistemele locale de versionare suferă de aceleași probleme - oricând avem întreaga istorie a unui proiect într-un singur loc, riști să pierzi totul.

## Sisteme Distribuite pentru Controlul Versiunilor

Acum este momentul în care Sistemele Distribuite pentru Controlul Versiunilor (DVCS [en]) își fac apariția. Într-un DVCS (cum ar fi Git, Mercurial, Bazaar sau Darcs), clienții nu doar preiau ultima versiune a fișierelor: ei descarcă o copie completă a repository-ului. Deci chiar dacă orice server se defectează, și aceste sisteme colaborau prin intermediul lui, oricare din repository-urile de la client pot fi copiate înapoi pe server pentru a-l aduce la starea inițială. Fiecare checkout este efectiv un backup complet a tuturor datelor (vezi Figura 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)
 
Figura 1-3. Diagramă cu sistemul distribuit al versiunilor.

Mai mult, multe din aceste sisteme se descurcă suficient de bine cu lucrul simultan cu mai multe repository-uri, așă că putem colabora cu diferite grupuri de oameni în diverse moduri în același timp în cadrul aceluiași proiect. Aceasta ne permite să ne configurăm diverse modele de lucru care nu sunt posibile în sistemele centralizate, de exemplu un model ierarhic.
Furthermore, many of these systems deal pretty well with having several remote repositories they can work with, so you can collaborate with different groups of people in different ways simultaneously within the same project. This allows you to set up several types of workflows that aren’t possible in centralized systems, such as hierarchical models.
