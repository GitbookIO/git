# Geschiedenis herschrijven

Vaak zal je, als je met Git werkt, je commit geschiedenis om een of andere reden willen aanpassen. Één van de mooie dingen van Git is dat het je in staat stelt om beslissingen op het laatst mogelijke moment te maken. Je kunt bepalen welke bestanden in welke commits gaan vlak voordat je commit, door middel van de staging area, je kunt besluiten dat je toch nog niet aan iets had willen beginnen met het stash commando en je kunt commits herschrijven ook al zijn ze al gebeurd, waardoor het lijkt alsof ze op een andere manier gebeurd zijn. Dit kan bijvoorbeeld de volgorde van de commits zijn, berichten of bestanden in een commit wijzigen, commits samenpersen(squashen) of opsplitsen, of complete commits weghalen - en dat allemaal voordat je jouw werk met anderen deelt.

In deze paragraaf zal je leren hoe je deze handige taken uitvoert, zodat je jouw commit geschiedenis er uit kunt laten zien zoals jij dat wilt, voordat je het met anderen deelt.

## De laatste commit veranderen

De laatste commit veranderen is waarschijnlijk de meest voorkomende geschiedenis wijziging die je zult doen. Vaak wil je twee basale dingen aan je laatste commit wijzigen: het commit bericht, of de snapshot, dat je zojuist opgeslagen hebt, wijzigen door het toevoegen, wijzigen of weghalen van bestanden.

Als je alleen je laatste commit bericht wilt wijzigen, dan is dat heel eenvoudig:

	$ git commit --amend

Dat plaatst je in de teksteditor met je laatste commit bericht erin, klaar voor je om het bericht te wijzigen. Als je opslaat en de editor sluit, dan schrijft de editor een nieuwe commit met dat bericht en maakt dat je laatste commit.

Als je hebt gecommit en daarna wil je het snapshot dat je gecommit hebt wijzigen, door het toevoegen of wijzigen van bestanden, misschien omdat je vergeten was een nieuw bestand toe te voegen toen je committe, gaat het proces vergelijkbaar. Je staged de wijzigingen die je wilt door een bestand te wijzigen en `git add` er op uit te voeren, of `git rm` op een getrackt bestand, en de daaropvolgende `git commit --amend` pakt je huidige staging area en maakt dat het snapshot voor de nieuwe commit.

Je moet wel oppassen met deze techniek, omdat het amenden de SHA-1 van de commit wijzigt. Het is vergelijkbaar met een kleine rebase: niet je laatste commit wijzigen als je die al gepusht hebt.

## Meerdere commit berichten wijzigen

Om een commit te wijzigen die verder terug in je geschiedenis zit, moet je meer complexe tools gebruiken. Git heeft geen geschiedenis-wijzig tool, maar je kunt het rebase tool gebruiken om een serie commits op de HEAD te rebasen waarop ze origineel gebaseerd, in plaats van ze naar een andere te verhuizen. Met het interactieve rebase tool kun je dan na iedere commit die je wilt wijzigen stoppen en het bericht wijzigen, bestanden toevoegen, of doen wat je ook maar wilt. Je kunt rebase interactief uitvoeren door de `-i` optie aan `git rebase` toe te voegen. Je moet aangeven hoe ver terug je commits wilt herschrijven door het commando te vertellen op welke commit het moet rebasen.

Bijvoorbeeld, als je de laatste drie commit berichten wilt veranderen, of een van de commit berichten in die groep, dan geef je de ouder van de laatste commit die je wilt wijzigen mee als argument aan `git rebase -i`, wat `HEAD~2^` of `HEAD~3` is. Het kan makkelijker zijn om de `~3` te onthouden, omdat je de laatste drie commits probeert te wijzigen; maar houd in gedachten dat je eigenlijk vier commits terug aangeeft; de ouder van de laatste commit die je wilt veranderen:

	$ git rebase -i HEAD~3

Onthoud, nogmaals, dat dit een rebase commando is - iedere commit in de reeks `HEAD~3..HEAD` zal worden herschreven, of je het bericht nu wijzigt of niet. Voeg geen commit toe die je al naar een centrale server gepusht hebt; als je dit doet breng je andere gebruikers in de war omdat je ze een alternatieve versie van dezelfde wijziging te geeft.

Dit commando uitvoeren geeft je een lijst met commits in je tekst editor die er ongeveer zo uit ziet:

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

	# Rebase 710f0f8..a5f4a0d onto 710f0f8
	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Het is belangrijk om op te merken dat deze commits in de tegengestelde volgorde getoond worden dan hoe je ze normaliter ziet als je het `log` commando gebruikt. Als je een `log` uitvoert, zie je zoiets als dit:

	$ git log --pretty=format:"%h %s" HEAD~3..HEAD
	a5f4a0d added cat-file
	310154e updated README formatting and added blame
	f7f3f6d changed my name a bit

Merk de omgekeerde volgorde op. De interactieve rebase geeft je een script dat het gaat uitvoeren. Het zal beginnen met de commit die je specificeert op de commando regel (`HEAD~3`) en de wijzigingen in elk van deze commits van voor naar achter opnieuw afspelen. Het toont de oudste het eerst in plaats van de nieuwste, omdat dat deze de eerste is die zal worden afgespeeld.

Je moet het script zodanig aanpassen dat het stopt bij de commit die je wilt wijzigen. Om dat te doen moet je het woord "pick" veranderen in het woord "edit" voor elke commit waarbij je het script wilt laten stoppen. Bijvoorbeeld, om alleen het derde commit bericht te wijzigen verander je het bestand zodat het er zo uitziet:

	edit f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Als je dit opslaat en de editor sluit, spoelt Git terug naar de laatste commit van die lijst en zet je op de commando regel met de volgende boodschap:

	$ git rebase -i HEAD~3
	Stopped at 7482e0d... updated the gemspec to hopefully work better
	You can amend the commit now, with

	       git commit --amend

	Once you’re satisfied with your changes, run

	       git rebase --continue

Deze instructies vertellen je precies wat je moet doen. Type

	$ git commit --amend

Wijzig het commit bericht en verlaat de editor. Voer vervolgens dit uit

	$ git rebase --continue

Dit commando zal de andere twee commits automatisch toepassen, en je bent klaar. Als je "pick" op meerdere regels in "edit" verandert, dan kan je deze stappen herhalen voor iedere commit die je in "edit" veranderd hebt. Elke keer zal Git stoppen, je de commit laten wijzigen en verder gaan als je klaar bent.

## Commits opnieuw rangschikken

Je kunt een interactieve rebase ook gebruiken om commits opnieuw te rangschikken of zijn geheel te verwijderen. Als je de "added cat-file" commit wilt verwijderen en de volgorde waarin de andere twee commits zijn geïntroduceerd wilt veranderen, dan kun je het rebase script van dit

	pick f7f3f6d changed my name a bit
	pick 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

veranderen in dit:

	pick 310154e updated README formatting and added blame
	pick f7f3f6d changed my name a bit

Als je dan opslaat en de editor sluit, zal Git je branch terugzetten naar de ouder van deze commits, eerst `310154e` en dan `f7f3f6d` toepassen, en dan stoppen. Effectief verander je de volgorde van die commits en verwijder je de "added cat-file" commit volledig.

## Een commit samenpersen (squashing)

Het is ook mogelijk een serie commits te pakken en ze in één enkele commit samen te persen (squash) met het interactieve rebase tool. Het script stopt behulpzame instructies in het rebase bericht:

	#
	# Commands:
	#  p, pick = use commit
	#  e, edit = use commit, but stop for amending
	#  s, squash = use commit, but meld into previous commit
	#
	# If you remove a line here THAT COMMIT WILL BE LOST.
	# However, if you remove everything, the rebase will be aborted.
	#

Als je in plaats van "pick" of "edit", "squash" specificeert zal Git zowel die verandering als de verandering die er direct aan vooraf gaat toepassen, en je dwingen om de commit berichten samen te voegen. Dus als je een enkele commit van deze drie commits wil maken, laat je het script er zo uit zien:

	pick f7f3f6d changed my name a bit
	squash 310154e updated README formatting and added blame
	squash a5f4a0d added cat-file

Als je de editor opslaat en sluit, zal Git alle drie wijzigingen toepassen en je terug in de editor brengen om de drie commit berichten samen te voegen:

	# This is a combination of 3 commits.
	# The first commit's message is:
	changed my name a bit

	# This is the 2nd commit message:

	updated README formatting and added blame

	# This is the 3rd commit message:

	added cat-file

Als je dat opslaat, heb je een enkele commit die de veranderingen van alle drie vorige commits introduceert.

## Een commit splitsen

Een commit opsplitsen zal een commit ongedaan maken, en dan net zo vaak gedeeltelijk stagen en committen als het aantal commits waar je mee wilt eindigen. Bijvoorbeeld, stel dat je de middelste van je drie commits wilt splitsen. In plaats van "updated README formatting and added blame" wil je het splitsen in twee commits: "updated README formatting" als eerste, en "added blame" als tweede. Je kunt dat doen in het `rebase -i` script door de instructie van de commit die je wilt splitsen te veranderen in "edit":

	pick f7f3f6d changed my name a bit
	edit 310154e updated README formatting and added blame
	pick a5f4a0d added cat-file

Als je opslaat en de editor verlaat, spoelt Git terug naar de parent van de eerste commit in de lijst, past de eerste commit toe (`f7f3f6d`), past de tweede toe (`310154e`), en zet je dan in de console. Daar kan je een gemengde reset doen van die commit met `git reset HEAD^` , wat effectief de commit terugdraait en de gewijzigde bestanden unstaged laat. Nu kan je de wijzigingen die gereset zijn nemen en er meerdere commits van maken. Eenvoudigweg bestanden stagen en committen tot je meerdere commits hebt, en dan `git rebase --continue` uitvoeren zodra je klaar bent:

	$ git reset HEAD^
	$ git add README
	$ git commit -m 'updated README formatting'
	$ git add lib/simplegit.rb
	$ git commit -m 'added blame'
	$ git rebase --continue

Git zal de laatste commit (`a5f4a0d`) in het script toepassen, en je geschiedenis zal er zo uitzien:

	$ git log -4 --pretty=format:"%h %s"
	1c002dd added cat-file
	9b29157 added blame
	35cfb2b updated README formatting
	f3cc40e changed my name a bit

Nogmaals, dit verandert alle SHA's van alle commits in de lijst, dus zorg er voor dat er geen commit in die lijst zit die je al naar een gedeelde repository gepusht hebt.

## De optie met atoomkracht: filter-branch

Er is nog een geschiedenis-herschrijvende optie, die je kunt gebruiken als je een groter aantal commits moet herschrijven op een gescripte manier. Bijvoorbeeld, het globaal veranderen van je e-mail adres of een bestand uit iedere commit verwijderen. Het commando heet `filter-branch` en het kan grote gedeelten van je geschiedenis herschrijven, dus je moet het niet gebruiken tenzij je project nog niet publiekelijk is gemaakt, en andere mensen nog geen werk hebben gebaseerd op jouw commits die je op het punt staat te herschrijven. Maar het kan heel handig zijn. Je zult een paar gebruikelijke toepassingen zien zodat je een idee krijgt waar het toe in staat is.

### Een bestand uit iedere commit verwijderen

Dit gebeurt vrij regelmatig. Iemand voegt per ongeluk een enorm binair bestand toe met een achteloze `git add .`, en je wilt het overal weghalen. Misschien heb je per ongeluk een bestand dat een wachtwoord bevat gecommit, en je wilt dat project open source maken. `filter-branch` is dan de tool dat je wilt gebruiken om je hele geschiedenis schoon te poetsen. Om een bestand met de naam passwords.txt uit je hele geschiedenis weg te halen, kun je de `--tree-filter` optie toevoegen aan `filter-branch`:

	$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
	Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
	Ref 'refs/heads/master' was rewritten

De `--tree-filter` optie voert het gegeven commando uit na elke checkout van het project, en commit de resultaten weer. In dit geval verwijder je een bestand genaamd passwords.txt van elke snapshot, of het bestaat of niet. Als je alle per ongeluk toegevoegde editor backup bestanden wilt verwijderen, kun je bijvoorbeeld dit uitvoeren `git filter-branch --tree-filter "rm -f *~" HEAD`.

Je zult Git objectbomen en commits zien herschrijven en op het eind de branch wijzer zien verplaatsen. Het is over het algemeen een goed idee om dit in een test branch te doen, en dan je master branch te hard-resetten nadat je gecontroleerd hebt dat de uitkomst echt is als je het wilt hebben. Om `filter-branch` op al je branches uit te voeren, moet je `--all` aan het commando meegeven.

### Een subdirectory de nieuwe root maken

Stel dat je een import vanuit een ander versiebeheersysteem hebt gedaan, en subdirectories hebt die niet zinnig zijn (trunk, tags, enzovoort). Als je de `trunk` subdirectory de nieuwe root van het project wilt maken voor elke commit, kan `filter-branch` je daar ook mee helpen:

	$ git filter-branch --subdirectory-filter trunk HEAD
	Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
	Ref 'refs/heads/master' was rewritten

Nu is de nieuwe project root elke keer de inhoud van de `trunk` subdirectory. Git zal ook automatisch commits verwijderen die geen betrekking hadden op die subdirectory.

### E-mail adressen globaal veranderen

Een ander veel voorkomend geval is dat je vergeten bent om `git config` uit te voeren om je naam en e-mail adres in te stellen voordat je begon met werken, of misschien wil je een project op het werk open source maken en al je werk e-mail adressen veranderen naar je persoonlijke adres. Hoe dan ook, je kunt e-mail adressen in meerdere commits ook in één klap veranderen met `filter-branch`. Je moet wel oppassen dat je alleen die e-mail adressen aanpast die van jou zijn, dus gebruik je `--commit-filter`:

	$ git filter-branch --commit-filter '
	        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
	        then
	                GIT_AUTHOR_NAME="Scott Chacon";
	                GIT_AUTHOR_EMAIL="schacon@example.com";
	                git commit-tree "$@";
	        else
	                git commit-tree "$@";
	        fi' HEAD

Dit gaat alle commits door en herschrijft ze zodat het jouw nieuwe adres bevat. Om dat commits de SHA-1 waarde van hun ouders bevatten, zal dit commando iedere commit SHA in jouw geschiedenis veranderen, niet alleen diegene die het gezochte e-mailadres bevatten.
