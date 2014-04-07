# Bazele Git

Pe scurt, ce este Git? Această secțiune este important de urmărit, deoarece dacă ințelegeți ceea ce este Git și bazele funcționării acestuia, atunci folosirea lui eficientă va fi mult ușurată pentru dumneavoastră. Pe măsură ce învățați Git, încercați să vă mențineți o minte limpede cu privire la lucrurile deja cunoscute de la alte sisteme de versionare, cum ar fi Subversion și Perforce; făcând asta vă va ajuta să evitați confuziile subtile cauzate de folosirea inițială a sa. Git stochează informațiile și lucrează cu ele mult diferit comparativ cu oricare din acele sisteme, chiar dacă interfața cu utilizatorul este destul de asemănătoare; înțelegerea acelor diferențe vă va ajuta să nu fiți confuz în timpul folosirii.

## Instantanee, nu Diferențe
Principala diferență dintre Git și oricare alte sisteme de versionare (Subversion și prietenii săi inclusiv) este modul în care Git își gestionează datele. Conceptual, majoritatea celorlalte sisteme își stochează informațiile ca o listă de schimbări asupra fișierelor. Aceste sisteme (CVS, Subversion, Perforce, Bazaar și altele) văd informațiile ca o mulțime de fișiere și schimbările asupra fișierelor în timp, după cum este ilustrat în Figura 1-4.


![](http://git-scm.com/figures/18333fig0104-tn.png)
 
Figura 1-4. Alte sisteme tind să stocheze datele ca schimbări relative la versiune de bază a fiecărui fișier.

Git nu vede și nici nu stochează datele în acest mod. În schimb, Git consideră datele sale mai mult ca o mulțime de instantanee (snapshots [en]) ale unu mini sistem de fișiere. De fiecare dată când faceți commit, sau salvați starea proiectului dumneavoastră în Git, acesta practic salvează o poză a stării curente a tuturor fișierelor din acel moment și stochează o referință la acel instantaneu. Pentru a fi eficient, dacă există fișiere care nu s-au schimbat, Git nu stochează fișierul iarași ci doar o legătură către fișierul anterior stocat identic cu cel din prezent. Git vede datele stocate similar cu Figura 1-5.


![](http://git-scm.com/figures/18333fig0105-tn.png)
 
Figura 1-5. Git stochează datele ca și instantanee ale proiectului de-a lungul timpului.

Aceasta este o distincție importantă dintre Git și aproape toate celelalte VCS. Aceasta face ca Git să reconsidere fiecare aspect al controlului versiunilor pe care majoritatea sistemelor le-au copiat de la generația anterioară. Acest aspect face ca Git să fie mult asemănător cu un mini sistem de fișiere cu niște unelte incredibil de utile adăugate peste el, comparativ cu un simplu VCS, Vom analiza unele dintre benefiicle câștigate prin a vedea datele voastre în acest fel atunci când ne vom ocupa de crearea ramurilor (branches [en]) in Capitolul 3.

## Aproape Orice Operație Este Locală

Majoritatea operațiilor în Git necesită doar fișiere locale și resurse locale pentru a funcționa - în general nu sunt necesare informații de la un alt calculator din rețea. Dacă sunteți obișnuit cu un CVCS în care majoritatea operațiilor au o extra latență dată de rețea, aceste aspect al Git vă va face să credeți că zeii vitezei au binecuvântat Git cu puteri din alte lumi. Deoarece aveți întreaga istorie a proiectului chiar aici pe discul local, majoritatea operațiilor par aproape instantanee.

De exemplu, pentru a răsfoi istoria proiectului, Git nu necesită să acceseze serverul pentru a prelua istoria și să o afișeze pentru dumneavoastră - pur și simplu o citește direct din baza de date locală. Aceasta înseamnă că vedeți istoria proiectului aproape instant. Dacă doriți să vedeți schimbările introduse între versiunea curentă a fișierului și cea de acum o lună, Git poate căuta fișierul de acum o lună și să facă un calcul față de diferența locală, în loc de a cere unui server să o facă sau să descarce o versiune mai veche a fișierului de la un server și apoi să facă operația local.

Aceasta înseamnă de asemenea că sunt foarte puține lucruri care nu le puteți face atunci când nu sunteți conectat la rețea sau prin VPN. Dacă sunteți într-un avion sau într-un tren și doriți să munciți putin, puteți adăuga schimbări proiectului iar când ajungeți la o rețea să le încărcați. Dacă ajungeți acasă și nu vă puteți porni clientul VPN, încă puteți lucra. În multe alte sisteme, aceste activități sunt fie imposibile fie foarte greoaie de gestionat. În Perforce, nu puteți face mare lucru atunci când nu sunteți conectat la server; și în Subversion și CVS, puteți edita fișiere, dar nu le puteți face commit în baza de date (deoarece baza de date nu poate fi accesată). Aceasta poate părea o mică îmbunătațire, dar veți fi surprins ce diferență imensă poate face.

## Git Are Integritate

Totul in Git are o sumă de control (checksum [en]) înainte de a fi stocat și este apoi referit de către acea sumă de control. Aceasta înseamnă că este imposibil de schimbat conținutul oricărui fișier sau director fără ca Git să știe de el. Aceast funcționalitate este inclusă în Git la cele mai de jos nivele și este o parte integrantă a filosofiei sale. Nu puteți pierde informații în tranzit sau să întâlniți corupere de fișiere fără ca Git să le detecteze.

Mecanismul folosit de Git pentru sumele de control este denumit hash SHA-1. Acesta este un șir de 40 de caractere compus din caractere hexazecimale (toate cifrele, 0 la 9 și caracterele de la a la f) și este calculat pe baza conținutului unui fișier sau a structurii de directoare din Git. Un hash SHA-1 arată similar cu următorul șir:

	24b9da6552252987aa493b52f8696cd6d3b00373

Veți vedea aceste șiruri peste tot în cadrul Git deoarece Git le folosește foarte mult. De fapt, Git stochează orice nu bazându-se pe numele fișierului ci în baza de date Git adresabilă prin intermediul valorii hash a conținutului său. 

## Git Adaugă Date în General

Când efectuați anumite operații în Git, aproape toate din ele doar adaugă date în baza de date Git. Este foarte dificil să constrângem sistemul să facă orice operații care sunt permanente sau să șteargă date în vreun fel. Dar ca în orice VCS, puteți pierde sau strica informații datorată schimbărilor care nu sunt deja adăugate; dar după ce faceți commit unui snapshot în Git, este foarte dificil să pierdeți date, mai ales dacă vă împingeți (push [en]) repository-ul către un alt repository.

Acest fapt face Git foarte ușor de folosit deoarece știm că putem experimenta fără a fi în pericol de a strica lucrurile într-un mod grav. Pentru o privire mai atentă la cum stochează Git datele și cum puteți recupera date care par pierdute, vedeți "Sub Capota Git" din Capitolul 9.

## Cele Trei Stări

Acum, fiți atenți. Acesta este lucrul principal care trebuie să vi-l amintiți despre Git dacă doriți ca restul procesului de învățare să se desfășoare lin. Git are trei stări principale în care se pot afla fișierele: comise, modificate, și în așteptare (commited, modified, staged [en]). Comise (commited [en]) presupune că datele sunt în siguranță în baza de date locală. Modificate presupune că ați schimbat fișierul dar nu l-ați comis încă în baza de date. În așteptare (staged [en]) înseamnă că ați marcat un fișier în forma curentă să fie inclus în următorul instantaneu comis (commited snapshot [en]).

Aceasta ne duce la principalele trei secțiuni ale unui proiect Git: directorul Git, directorul curent, și zona de așteptare (staging area [en]).


![](http://git-scm.com/figures/18333fig0106-tn.png)
 
Figura 1-6. Directorul de lucru, zona de așteptare, și directorul git.

Directorul Git este locația unde Git își stochează metadate și baza de date cu obiecte a proiectului dumneavoastră. Aceasta este partea cea mai importantă a Git, și reprezintă ceea ce este copiat atunci când clonați un repository de la un alt calculator.

Directorul de lucru reprezintă un singur checkout al unei versiuni a proiectului. Aceste fișiere sunt preluate din baza de date comprimată din directorul Git și plasate pe discul dumneavoastră pentru a le putea modifica.

Zona de așteptare (staging [en]) este un simplu fișier, de obicei conținut in directorul Git, și stochează informații despre ce va fi folosit pentru urmatorul commit. Este uneori denumit și index, dar devine obișnuit să i se spună zona de așteptare.

Modelul de lucru a Git poate arată ceva similar cu:

1. Modificați fișierele din directorul de lucru.
2. Puneți fișierele în așteptare, adăugând instantanee ale lor în zona de așteptare.
3. Faceți un commit, care preia fișierele în starea curentă din zona de așteptare și stochează acel instantaneu permanent în directorul dumneavoastră Git.

Dacă o anumită versiune a unui fișier este în directorul Git, este considerat ca și adăugat (commited [en]). Dacă este modificat dar a fost adăugat în zona de așteptare, este în așteptare. Si dacă a fost schimbat de la ultimul moment în care a fost comis dar nu este în așteptare, este modificat. În Capitolul 2, veți învăța mai multe despre aceste stări și cum puteți fie să le folosiți în avantajul dumneavoastră sau să le omiteți complet.
