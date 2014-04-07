# Git klaarmaken voor eerste gebruik

Nu je Git op je computer hebt staan, is het handig dat je een paar dingen doet om je Gitomgeving aan je voorkeuren aan te passen. Je hoeft deze instellingen normaliter maar één keer te doen, ze blijven hetzelfde als je een nieuwe versie van Git installeert. Je kunt ze ook op elk moment weer veranderen door de commando’s opnieuw uit te voeren.

Git bevat standaard een stuk gereedschap genaamd `git config`, waarmee je de configuratie-eigenschappen kunt bekijken en veranderen, die alle aspecten van het uiterlijk en gedrag van Git regelen. Deze eigenschappen kunnen op drie verschillende plaatsen worden bewaard:

*	Het bestand `/etc/gitconfig`: Bevat eigenschappen voor elk account op de computer en al hun repositories. Als je de optie `--system` meegeeft aan `git config`, zal het de configuratiegegevens in dit bestand lezen en schrijven.
*	Het bestand `~/.gitconfig`: Eigenschappen voor jouw account. Je kunt Git dit bestand laten lezen en schrijven door de optie `--global` mee te geven.
*	Het configuratiebestand in de Gitdirectory (dus `.git/config`) van de repository die je op het moment gebruikt: Specifiek voor die ene repository. Elk niveau neemt voorrang boven het voorgaande, dus waarden die in `.git/config` zijn gebruikt zullen worden gebruikt in plaats van die in `/etc/gitconfig`.

Op systemen met Windows zoekt Git naar het `.gitconfig`-bestand in de `$HOME` directory (`%USERPROFILE%` in een Windows omgeving) wat zich vertaalt in `C:\Documents and Settings\$USER` of `C:\Users\$USER` voor de meesten, afhankelijk van de versie (`$USER` is `%USERNAME%` in Windows omgevingen). Het zoekt ook nog steeds naar `/etc/gitconfig`, maar dan gerelateerd aan de plek waar je MSys hebt staan, en dat is de plek is waar je Git op je Windowscomputer geïnstalleerd hebt.

## Jouw identiteit

Het eerste wat je zou moeten doen nadat je Git geïnstalleerd hebt, is je gebruikersnaam en e-mail adres opgeven. Dat is belangrijk omdat elke commit in Git deze informatie gebruikt, en het onveranderlijk ingebed zit in de commits die je ronddeelt:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Nogmaals, dit hoef je maar één keer te doen als je de `--global` optie erbij opgeeft, omdat Git die informatie zal gebruiken voor alles wat je doet op dat systeem. Als je een andere naam of e-mail wilt gebruiken voor specifieke projecten, kun je het commando uitvoeren zonder de `--global` optie als je in de directory van dat project zit.

## Je tekstverwerker

Nu Git weet wie je bent, kun je de standaard tekstverwerker instellen die gebruikt zal worden als Git je een bericht in wil laten typen. Normaliter gebruikt Git de standaardtekstverwerker van je systeem, wat meestal Vi of Vim is. Als je een andere tekstverwerker wilt gebruiken, zoals Emacs, kun je het volgende doen:

	$ git config --global core.editor emacs

## Je diffprogramma

Een andere nuttige optie die je misschien wel wilt instellen is het standaard diffprogramma om mergeconflicten op te lossen. Stel dat je vimdiff wilt gebruiken:

	$ git config --global merge.tool vimdiff

Git accepteert kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge en opendiff als geldige merge tools. Je kunt ook een ander programma gebruiken, zie Hoofdstuk 7 voor meer informatie daarover.

## Je instellingen controleren

Als je je instellingen wilt controleren, kan je het `git config --list` commando gebruiken voor een lijst met alle instellingen die Git vanaf die locatie kan vinden:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Je zult sommige sleutels misschien meerdere keren langs zien komen, omdat Git dezelfde sleutel uit verschillende bestanden heeft gelezen (bijvoorbeeld `/etc/gitconfig` en `~/.gitconfig`). In dit geval gebruikt Git de laatste waarde van elke unieke sleutel die het tegenkomt.

Je kan ook bekijken wat Git als instelling heeft bij een specifieke sleutel door `git config {sleutel}` in te voeren:

	$ git config user.name
	Scott Chacon
