# Interactief stagen

Bij Git worden een aantal scripts geleverd, die sommige commandline taken makkelijker maken. Hier zul je een aantal interactieve commando's zien, die je kunnen helpen om je commits zo samen te stellen dat ze alleen bepaalde combinaties en delen van bestanden bevatten. Deze tools zijn erg nuttig als je een reeks bestanden aanpast en dan besluit dat je deze wijzigingen in een aantal gefocuste commits wilt hebben in plaats van één grote rommelige commit. Op deze manier ben je er zeker van dat je commits logische aparte wijzigingensets zijn en makkelijk gereviewed kunnen worden door je mede-ontwikkelaars.
Als je `git add` uitvoert met de `-i` of `--interactive` optie, dan schakelt Git over naar een interactieve shell modus, waarbij zoiets als dit getoond wordt:

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now>

Je kunt zien dat dit commando je een heel andere kijk op je staging area geeft - eigenlijk dezelfde informatie die je krijgt met het `git status` commando, maar dan compacter en meer informatief. Het toont links de wijzigingen die je gestaged hebt, en de niet gestagede wijzigingen rechts.

Hierna volgt een commando-sectie. Hier kun je een aantal dingen doen waaronder bestanden stagen, bestanden unstagen, delen van bestanden stagen, ungetrackte bestanden toevoegen, en diffs zien van wat gestaged is.

## Bestanden stagen en unstagen

Als je `2` of `u` op de `What now>` prompt typt, dan vraagt het script welke bestanden je wilt stagen:

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Om de TODO en index.html bestanden te stagen, kun je de getallen typen:

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

De `*` naast ieder bestand geeft aan dat het bestand geselecteerd is om gestaged te worden. Als je Enter indrukt na niets getypt te hebben op de `Update>>` prompt, dan zal Git alles wat geselecteerd staat pakken en voor je stagen:

	Update>>
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Nu kun je zien dat de TODO en index.html bestanden gestaged zijn, en het simplegit.rb bestand nog steeds unstaged is. Als je het TODO bestand nu wilt unstagen, dan gebruik je de `3` of `r` (voor revert) optie:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path

Als je nu nog eens naar je Git status kijkt, kun je zien dat je het TODO bestand ge-unstaged hebt:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Om de diff te zien van wat je gestaged hebt, kun je het `6` of `d` (voor diff) commando gebruiken. Het toont je een lijst van je gestagede bestanden, en je kunt de bestanden selecteren waarvan je de gestagede diff wilt zien. Dit is vergelijkbaar met het specificeren van `git diff --cached` op de commando regel:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

Met deze simpele commando's kun je de interactieve toevoegmodus gebruiken om op een iets eenvoudigere manier met je staging area om te gaan.

## Patches stagen

Het is met Git ook mogelijk om bepaalde delen van bestanden te stagen en de rest niet. Bijvoorbeeld, als je twee wijzigingen maakt in je simplegit.rb bestand en één van die twee wilt stagen en de andere niet, dan is dat eenvoudig in Git. Vanaf de interactieve prompt, type `5` of `p` (voor patch). Git zal je vragen welke bestanden je deels wilt stagen en daarna, voor iedere sectie van de geselecteerde bestanden, zal het stukken van de bestandsdiff tonen en je vragen of je ze wilt stagen, één voor één:

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]?

Hier heb je erg veel opties. Door `?` te typen krijg je een lijst met wat je kunt doen:

	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
	y - stage this hunk
	n - do not stage this hunk
	a - stage this and all the remaining hunks in the file
	d - do not stage this hunk nor any of the remaining hunks in the file
	g - select a hunk to go to
	/ - search for a hunk matching the given regex
	j - leave this hunk undecided, see next undecided hunk
	J - leave this hunk undecided, see next hunk
	k - leave this hunk undecided, see previous undecided hunk
	K - leave this hunk undecided, see previous hunk
	s - split the current hunk into smaller hunks
	e - manually edit the current hunk
	? - print help

Over het algemeen zal je `y` of `n` typen als je elke homp (hunk) wilt stagen, maar voor bepaalde bestanden ze allemaal stagen, of voor een bepaalde hunk de beslissing uit stellen kan ook behulpzaam zijn. Als je een gedeelte van het bestand wilt stagen en een ander gedeelte unstaged wilt laten, dan zal je status output er zo uitzien:

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

De status van het simplegit.rb bestand is interessant. Het laat zien dat een paar regels gestaged zijn, en een paar niet. Je hebt dit bestand deels gestaged. Nu kan je het interactieve toevoeg script verlaten en het `git commit` commando uitvoeren om de gedeeltelijk gestagede bestanden te committen.

Tot slot hoef je niet in de interactieve toevoeg modus te zijn om het gedeeltelijke bestands-stagen te doen, je kunt hetzelfde script starten door `git add -p` of `git add --patch` op de commando regel te gebruiken.
