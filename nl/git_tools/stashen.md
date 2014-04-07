# Stashen

Vaak, als je aan een deel van je project hebt zitten werken, zijn de dingen in een rommelige staat en wil je van branch veranderen om aan iets anders te werken. Het probleem is dat je geen halfklaar werk wilt committen, alleen maar om later verder te kunnen gaan vanaf hetzelfde punt. Het oplossing voor dit probleem is het `git stash` commando.

Stashen (wegstoppen) pakt de vervuilde status van je werkdirectory - dat wil zeggen: je gewijzigde getrackte bestanden en gestagede wijzigingen, en bewaart het op een stapel onafgemaakte wijzigingen die je op ieder tijdstip opnieuw kunt toepassen.

## Je werk stashen

Om dit te demonstreren, ga je project in en begin met werken aan een paar bestanden en misschien stage je een van de wijzigingen. Als je `git status` uitvoert, kun je de vervuilde status zien:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

Nu wil je van branch veranderen, maar je wilt hetgeen je aan hebt zitten werken nog niet committen, dus je gaat de wijzigingen stashen. Om een nieuwe stash op de stapel te zetten, voer je `git stash` uit:

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

Je werkdirectory is schoon:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Nu kan je eenvoudig van branch wisselen en ergens anders aan werken, je wijzigingen zijn opgeslagen op de stapel. Om te zien welke stashes je opgeslagen hebt, kun je `git stash list` gebruiken:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

In dit geval waren er twee stashes al eerder opgeslagen, dus heb je toegang tot drie verschillende gestashede werken. Je kunt degene die je zojuist gestashed hebt opnieuw toepassen, door het commando uit te voeren dat in de help output van het originele stash commando stond: `git stash apply`. Als je een van de oudere stashes wilt toepassen, dan kun je die specificeren door hem te benoemen, zoals hier: `git apply stash stash@{2}`. Als je geen stash specificeert, neemt Git aan dat je de meest recente stash bedoelt en probeert die toe te passen:

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

Je kunt zien dat Git opnieuw de bestanden wijzigt die je uncommitte toen je de stash opsloeg. In dit geval had je een schone werkdirectory toen je de stash probeerde toe te passen, en dat je probeerde deze op dezelfde branch toe te passen als waar je hem van opgeslagen hebt. Maar het hebben van een schone werkdirectory en het toepassen op dezelfde branch zijn niet noodzakelijk om een stash succesvol toe te kunnen passen. Je kunt een stash op één branch opslaan, later naar een andere branch omschakelen, en daar opnieuw de wijzigingen toe proberen te passen. Je kunt ook gewijzigde en uncommitted bestanden in je werkdirectory hebben wanneer je een stash probeert toe te passen, Git geeft merge conflicten aan als iets niet meer netjes toe te passen is.

De wijzigingen aan je bestanden zijn opnieuw toegepast, maar het bestand dat je eerder gestaged had is niet opnieuw gestaged. Om dat te doen moet je het `git stash apply` commando met de `--index` optie uitvoeren om het commando te vertellen de gestagede wijzigingen opnieuw proberen toe te passen. Als je dat had uitgevoerd, dan zou je weer op je originele uitgangspunt zijn uitgekomen:

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

De apply optie probeert alleen het gestashete werk toe te passen - je blijft op de stapel behouden. Om het te verwijderen kun je `git stash drop` uitvoeren, met de naam van de stash die je wilt verwijderen:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

Je kunt ook `git stash pop` uitvoeren om de stash toe te passen en deze direct van de stapel te verwijderen.

## Een stash ont-toepassen

In sommige situaties zou het kunnen voorkomen dat je gestashde wijzigingen wilt toepassen, wat werk doen en dan de wijzigingen die van de stash waren gekomen ont-toepassen. Git heeft niet zoiets als een `stash unapply` commando, maar het is mogelijk om het effect te bereiken door simpelweg de patch op te halen die bij een stash hoort, en deze in zijn achteruit toe te passen:

    $ git stash show -p stash@{0} | git apply -R

Nogmaals: als je geen stash specificeert gaat Git van de meest recente stash uit:

    $ git stash show -p | git apply -R

Wellicht wil je een alias maken en effectief een `stash-unapply` commando aan je Git toevoegen. Bijvoorbeeld:

    $ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
    $ git stash
    $ #... work work work
    $ git stash-unapply

## Een branch van een stash maken

Als je wat werk stashed, het daar poosje laat liggen, en doorwerkt op de branch waarvan je het werk gestashed hebt, dan kun je een probleem krijgen met het opnieuw toe passen van dat werk. Als het toepassen een bestand probeert te wijzigen dat je sindsdien gewijzigd hebt krijg je een merge conflict en zul je dat moeten proberen oplossen. Als je een eenvoudiger manier wilt hebben om je gestashde wijzigingen opnieuw te testen, kun je `git stash branch` uitvoeren. Dit zal een nieuwe branch voor je aanmaken, de commit waar je op zat toen je het werk stashte uitchecken, je werk opnieuw toepassen en dan de stash droppen als het succesvol is toegepast:

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

Dit is een prettige manier om gestashed werk eenvoudig terug te halen en eraan te werken in een nieuwe branch.
