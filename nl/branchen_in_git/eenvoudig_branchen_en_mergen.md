# Eenvoudig branchen en mergen

Laten we eens door een eenvoudig voorbeeld van branchen en mergen stappen met een workflow die je zou kunnen gebruiken in de echte wereld. Je zult deze stappen volgen:

1. Werken aan een website.
2. Een branch aanmaken voor een nieuw verhaal waar je aan werkt.
3. Wat werk doen in die branch.

Dan ontvang je een telefoontje dat je een ander probleem direct moet repareren. Je zult het volgende doen:

1. Terugschakelen naar je productie-branch.
2. Een branch aanmaken om de snelle reparatie toe te voegen.
3. Nadat het getest is de snelle reparatie-branch mergen, en dat naar productie terugzetten.
4. Terugschakelen naar je originele verhaal en doorgaan met werken.

## Eenvoudig branchen

Als eerste, laten we zeggen dat je aan je project werkt en al een paar commits hebt staan (zie Figuur 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)

Figuur 3-10. Een korte en eenvoudige commit-historie.

Je hebt besloten dan je gaat werken aan probleem #53 in wat voor systeem je bedrijf ook gebruikt om problemen te registreren. Voor de duidelijkheid: Git is niet verbonden met een specifiek probleembeheersysteem. Omdat probleem #53 een onderwerp is waar je gericht aan gaat werken, maak je een nieuwe branch aan waarin je aan de slag gaat. Om een branch aan te maken en er meteen naartoe te schakelen, kun je het `git checkout` commando uitvoeren met de `-b` optie:

	$ git checkout -b iss53
	Switched to a new branch 'iss53'

Dit is een afkorting voor:

	$ git branch iss53
	$ git checkout iss53

Figuur 3-11 toont het resultaat.


![](http://git-scm.com/figures/18333fig0311-tn.png)

Figuur 3-11. Een nieuwe branch-verwijzing maken.

Je doet wat werk aan je website en doet wat commits. Door dat te doen beweegt de `iss53` branch vooruit, omdat je het uitgecheckt hebt (dat wil zeggen, je HEAD wijst ernaar; zie Figuur 3-12):

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)

Figuur 3-12. De iss53 branch is vooruit gegaan met je werk.

Nu krijg je het telefoontje dat er een probleem is met de website, en je moet het meteen repareren. Met Git hoef je de reparatie niet tegelijk uit te leveren met de `iss53` wijzigingen die je gemaakt hebt, en je hoeft ook niet veel moeite te doen om die wijzigingen terug te draaien voordat je kunt werken aan het toepassen van je reparatie in productie. Het enige wat je moet doen is terugschakelen naar je master-branch.

Maar voordat je dat doet, merk op dat als je werk-directory of staging area wijzigingen bevatten die nog niet gecommit zijn en conflicteren met de branch die je gaat uitchecken, Git je niet laat omschakelen. Het beste is om een schone werkstatus te hebben als je tussen branches gaat schakelen. Er zijn manieren om hier mee om te gaan (te weten, stashen en commit ammending) die we later gaan behandelen. Voor nu heb je alle wijzigingen gecommit, zodat je terug kunt schakelen naar je master-branch:

	$ git checkout master
	Switched to branch "master"

Hierna is je project-werk-directory precies zoals het was voordat je begon te werken aan probleem #53, en je kunt je concentreren op je snelle reparatie. Dit is een belangrijk punt om te onthouden: Git herstelt je werk-directory zodanig dat deze eruit ziet als het snapshot van de commit waar de branch die je uitcheckt naar wijst. Het voegt automatisch bestanden toe, verwijdert en wijzigt ze om er zeker van te zijn dat je werkkopie eruit ziet zoals de branch eruit zag toen je er voor het laatst op committe.

Vervolgens heb je een snelle reparatie (hotfix) te doen. Laten we een reparatie-branch maken om op te werken totdat het af is (zie Figuur 3-13):

	$ git checkout -b hotfix
	Switched to a new branch 'hotfix'
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix 3a0874c] fixed the broken email address
	 1 files changed, 1 deletion(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)

Figuur 3-13. snelle reparatie branch gebaseerd op de positie van je master branch.

Je kunt je tests draaien, jezelf ervan verzekeren dat de reparatie is wat je wil, en het mergen in je master-branch en het naar productie uitrollen. Je doet dit met het `git merge` commando:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast-forward
	 README | 1 -
	 1 file changed, 1 deletion(-)

Je zult de uitdrukking "Fast forward" zien in die merge. Omdat de commit van de branch waar je mee mergede direct stroomopwaarts is van de commit waar je op zit, zal Git de verwijzing vooruit verplaatsen. Om het op een andere manier te zeggen, als je een commit probeert te mergen met een commit die bereikt kan worden door de historie van eerste commit te volgen, zal Git de dingen vereenvoudigen door de verwijzing vooruit te verplaatsen omdat er geen afwijkend werk is om te mergen; dit wordt een "fast forward" genoemd.

Je wijziging zit nu in het snapshot van de commit waar de `master` branch naar wijst, en je kunt je wijziging uitrollen (zie Figuur 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)

Figuur 3-14. Je master branch wijst na de merge naar dezelfde plek als de hotfix branch.

Nadat je super-belangrijke reparatie uitgerold is, ben je klaar om terug te schakelen naar het werk dat je deed voordat je onderbroken werd. Maar, eerst ga je de hotfix branch verwijderen, omdat je die niet langer nodig hebt - de `master` branch wijst naar dezelfde plek. Je kunt het verwijderen met de `-d` optie op `git branch`:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Nu kun je terugschakelen naar je werk in uitvoering branch voor probleem #53 en doorgaan met daar aan te werken (zie Figuur 3-15):

	$ git checkout iss53
	Switched to branch 'iss53'
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53 ad82d7a] finished the new footer [issue 53]
	 1 file changed, 1 insertion(+)


![](http://git-scm.com/figures/18333fig0315-tn.png)

Figuur 3-15. Je iss53 branch kan onafhankelijk vooruit bewegen.

Het is nuttig om hier op te merken dat het werk dat je in de hotfix branch gedaan hebt, niet in de bestanden van je `iss53` branch zit. Als je dat binnen moet halen, dan kun je de `master` branch in de `iss53` branch mergen door `git merge master` uit te voeren, of je kunt wachten met die wijzigingen te integreren tot het moment dat je het besluit neemt de `iss53` branch in de `master` te trekken.

## Eenvoudig samenvoegen

Stel dat je besloten hebt dat je probleem #53 werk gereed is en klaar bent om het te mergen in de `master` branch. Om dat te doen, zul je de `iss53` branch mergen zoals je die hotfix branch eerder hebt gemerged. Het enige dat je hoeft te doen is de branch uit te checken waar je in wenst te mergen en dan het `git merge` commando uit te voeren:

	$ git checkout master
	$ git merge iss53
	Auto-merging README
	Merge made by the 'recursive' strategy.
	 README | 1 +
	 1 file changed, 1 insertion(+)

Dit ziet er iets anders uit dan de `hotfix` merge die je eerder gedaan hebt. In dit geval is je ontwikkelhistorie afgeweken van een eerder punt. Omdat de commit op de branch waar je op zit geen directe voorouder is van de branch waar je in merged, moet Git wat werk doen. In dit geval, doet Git een eenvoudige drieweg merge, gebruikmakend van de twee snapshots waarnaar gewezen wordt door de uiteinden van de branch en de gezamenlijke voorouder van die twee. Figuur 3-16 markeert de drie snapshots die Git gebruikt om de merge te doen in dit geval te doen.


![](http://git-scm.com/figures/18333fig0316-tn.png)

Figuur 3-16. Git identificeert automatisch de meest geschikte gezamenlijke voorouder als basis voor het mergen van de branches.

In plaats van de branch verwijzing vooruit te verplaatsen, maakt Git een nieuw snapshot dat het resultaat is van deze drieweg merge en maakt automatisch een nieuwe commit die daar naar wijst (zie Figuur 3-17). Dit wordt een merge-commit genoemd, en is bijzonder in die zin dat het meer dan één ouder heeft.

Het is belangrijk om erop te wijzen dat Git de meest geschikte gezamenlijke voorouder bepaalt om te gebruiken als merge basis; dit is anders dan CVS of Subversion (voor versie 1.5), waar het de ontwikkelaar die de merge doet ook degene is die de beste merge basis moest uitzoeken. Dit maakt het mergen in Git een behoorlijk stuk eenvoudiger in vergelijking met deze andere systemen.


![](http://git-scm.com/figures/18333fig0317-tn.png)

Figuur 3-17. Git maakt automatisch een nieuw commit object aan die het gemergede werk bevat.

Nu dat je werk gemerged is, is er geen verdere noodzaak meer voor de `iss53` branch. Je kunt het verwijderen en daarna handmatig de ticket in het ticket-volg systeem sluiten:

	$ git branch -d iss53

## Eenvoudige merge conflicten

Af en toe verloopt dit proces niet zo soepel. Als je hetzelfde gedeelte van hetzelfde bestand op een andere manier hebt gewijzigd in twee branches die je merged, dan zal Git niet in staat zijn om ze netjes te mergen. Als je reparatie voor probleem #53 hetzelfde gedeelte van een bestand heeft gewijzigd als de `hotfix`, dan krijg je een merge conflict dat er ongeveer zo uit ziet:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git heeft geen nieuwe merge commit gemaakt. Het heeft het proces gepauzeerd zolang jij het conflict aan het oplossen bent. Als je wilt zien welke bestanden nog niet zijn gemerged op enig punt na een merge conflict, dan kun je `git status` uitvoeren:

	$ git status
	On branch master
	You have unmerged paths.
	  (fix conflicts and run "git commit")
	
	Unmerged paths:
	  (use "git add <file>..." to mark resolution)
	
	        both modified:      index.html
	
	no changes added to commit (use "git add" and/or "git commit -a")

Alles wat merge conflicten heeft en wat nog niet is opgelost wordt getoond als unmerged. Git voegt standaard conflict-oplossings markeringen toe aan de bestanden die conflicten hebben, zodat je ze handmatig kunt openen en die conflicten kunt oplossen. Je bestand bevat een sectie die er zo ongeveer uit ziet:

	<<<<<<< HEAD
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53

Dit betekent dat de versie in HEAD (jouw master branch, omdat dat degene was dat je uitgecheckt had toen je het merge commando uitvoerde) is het bovenste gedeelte van dat blok (alles boven de `======`), terwijl de versie in je `iss53` branch eruit ziet zoals alles in het onderste gedeelte. Om het conflict op te lossen, moet je één van de twee gedeeltes kiezen of de inhoud zelf mergen. Je zou bijvoorbeeld dit conflict op kunnen lossen door het hele blok met dit te vervangen:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

Deze oplossing bevat een stukje uit beide secties, en ik heb de `<<<<<<<`, `=======`, en `>>>>>>>` regels volledig verwijderd. Nadat je elk van deze secties opgelost hebt in elk conflicterend bestand, voer dan `git add` uit voor elk van die bestanden om het als opgelost te markeren. Het bestand stagen markeert het als opgelost in Git.
Als je een grafische applicatie wil gebruiken om deze problemen op te lossen, kun je `git mergetool` uitvoeren, wat een toepasselijk grafische merge applicatie opstart dat je door de conflicten heen leidt:

	$ git mergetool

	This message is displayed because 'merge.tool' is not configured.
	See 'git mergetool --tool-help' or 'git help config' for more details.
	'git mergetool' will now attempt to use one of the following tools:
	opendiff kdiff3 tkdiff xxdiff meld tortoisemerge gvimdiff diffuse diffmerge ecmerge p4merge araxis bc3 codecompare vimdiff emerge
	Merging:
	index.html

	Normal merge conflict for 'index.html':
	  {local}: modified file
	  {remote}: modified file
	Hit return to start merge resolution tool (opendiff):

Als je een andere dan de standaard merge tool wilt gebruiken (Git koos `opendiff` voor me in dit geval, omdat ik het commando uitvoerde op een Mac), dan kun je alle ondersteunde applicaties opgenoemd zien na "... one of the following tools:". Type de naam van de applicatie die je liever gebruikt. In Hoofdstuk 7 zullen we bespreken hoe je deze standaard waarde voor jouw omgeving kunt wijzigen.

Nadat je de merge applicatie afsluit, vraagt Git je of de merge succesvol was. Als je het script vertelt dat dit het geval is, dan staged dit script het bestand voor je om het als opgelost te markeren.

Je kunt `git status` nogmaals uitvoeren om er zeker van te zijn dat alle conflicten opgelost zijn:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   index.html
	
Als je het daar mee eens bent, en je gecontroleerd hebt dat alles waar conflicten in zat gestaged is, dan kun je `git commit` typen om de merge commit af te ronden. Het commit bericht ziet er standaard ongeveer zo uit:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

Je kunt dat bericht aanpassen met details over hoe je het conflict opgelost hebt, als je denkt dat dat behulpzaam zal zijn voor anderen die in de toekomst naar deze merge kijken - waarom je hebt gedaan wat je gedaan hebt, als dat niet vanzelfsprekend is.
