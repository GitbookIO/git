# Stările Git Pentru Prima Rulare

Acum că aveți Git instalat pe sistemul dumneavoastră, veți dori să faceți câteva schimbări în mediul dumneavoastră Git. Ar trebui să faceți aceste lucruri o singură dată; ele se vor păstra între diverse actualizări. Puteți de asemenea să le schimbați în orice moment rulând din nou comenzile.

Git vine cu un utilitar denumit git config care vă permite să setați variabile de configurare care controlează toate aspectele legate de funcționarea Git și interfața sa. Aceste variabile pot fi păstrate în diverse locuri:

*	fișierul `/etc/gitconfig`: Conține valuroi pentru fiecare utilizator al unui sistem și pentru toate repository-urile sale. Dacă introduceți opțiunea ` --system` pentru `git config`, va citi și scrie din fișierul menționat anterior. 
*	fișierul `~/.gitconfig`: Specific utilizatorului dumneavoastră. Puteți de asemenea să instruiți Git să citească și să scrie în acest fișier dacă introduceți opțiunea `--global`. 
*	fișierul de configurare pentru configurația git (adică, `.git/config`) sau specific repository-ului curent: Specific doar pentru acel repository. Fiecare nivel suprascrie valorile din celălalt nivel, deci valorile din `.git/config` le suprascriu pe cele din `/etc/gitconfig`.

În sistemele Windows, Git caută fișierul `.gitconfig` din directorul `$HOME` (`C:\Documents and Settings\$USER` (utilizator [ro])). De asemenea se va uita în /etc/gitconfig, chiar dacă este relativ la rădăcin MSys, care este dată de locul unde v-ați decis să instalați Git pe sistemul dumneavoastră Windows la instalare.

## Identitatea Dumneavoastră

Primul lucru care ar trebui să îl faceți atunci când instalați Git este să vă stabiliți numele și adresa de email. Acest aspect este important deoarece fiecare commit în Git va folosi aceste informații, și acestea vor fi conținute în commit-urile care le veți distribui:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Din nou, va fi necesar să efectuați acești pași o singură dată dacă introduceți opțiunea `--global`, deoarece atunci Git va folosi întotdeauna aceste informații pentru toate operațiile efectuate pe acel sistem. Dacă doriți să suprascrieți aceste informații cu un nume sau email diferite pentru anumite proiecte, atunci puteți executa comanda fără opțiunea `--global` atunci când vă aflați în acel proiect.

## Editorul Dumneavoastră

Acum că v-ați setat identitatea, puteți configura editorul de text ce va fi folosit implicit atunci când Git are nevoie să introduceți mesaje. Implicit, Git va folosi editorul definit în sistem, cel mai des acesta va fi Vi sau Vim. Dacă doriți să folosiți un editor text diferit, cum ar fi Emacs, puteți să faceți următoarele:

	$ git config --global core.editor emacs
	
## Utilitatorul Pentru Diferențe

O altă configurare utilă pe care o puteți face este utilitarul folosit în aflarea diferențelor (diff [en]) folosit pentru rezolvarea conflictelor. Să presupunem că doriți să folosiți vimdiff:

	$ git config --global merge.tool vimdiff

Git acceptă ca și unelte valide pentru diferențe următoarele: kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge, și opendiff. Puteți de asemenea să configurați un utlitar personalizat; vedeți Capitolul 7 pentru mai multe informații despre această procedură.

## Verificarea Setărilor

Dacă doriți să vă verificați setările, puteți folosi comanda `git config --list` pentru a afișa toate setările pe care Git le poate utiliza în prezent:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Puteți vedea și mai multe chei de mai multe ori, deoarece Git citește aceeași cheie din fișiere diferite (`/etc/gitconfig` și `~/.gitconfig`, de exemplu). În acest caz, Git folosește ultima valoare pentru fiecare cheie unică întâlnită.

Puteți de asemenea să vedeți ceea ce Git crede despre valoarea unei anumite chei dacă scrieți `git config {cheie}`:

	$ git config user.name
	Scott Chacon
