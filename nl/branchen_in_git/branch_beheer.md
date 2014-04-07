# Branch beheer

Nu heb je wat branches aangemaakt, gemerged, en verwijderd. Laten we eens kijken naar wat branch beheer toepassingen die handig zijn als je vaker branches gaat gebruiken.

Het `git branch` commando doet meer dan alleen branches aanmaken en verwijderen. Als je het zonder argumenten uitvoert, dan krijg je een eenvoudige lijst van de huidige branches:

	$ git branch
	  iss53
	* master
	  testing

Merk op dat het `*` karakter vooraf gaat aan de `master` branch: het geeft de branch aan dat je op dit moment uitgecheckt hebt. Dit betekent dat als je op dit punt commit, de `master` branch vooruit zal gaan met je nieuwe werk. Om de laatste commit op iedere branch te zien, kun je `git branch -v` uitvoeren:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Een andere handige optie om uit te vinden in welke staat je branches zijn, is om deze lijst te filteren op branches die je wel of nog niet gemerged hebt in de branch waar je nu op zit. De handige `--merged` en `--no-merged` opties zijn voor dit doel beschikbaar in Git. Om te zien welke branches al gemerged zijn in de branch waar je nu op zit, kun je `git branch --merged` uitvoeren:


	$ git branch --merged
	  iss53
	* master

Omdat je `iss53` al eerder hebt gemerged, zie je het terug in je lijst. Branches op deze lijst zonder de `*` ervoor zijn over het algemeen zonder problemen te verwijderen met `git branch -d`; je hebt hun werk al in een andere branch zitten, dus je zult niets kwijtraken.

Om alle branches te zien die werk bevatten dat je nog niet gemerged hebt, kun je `git branch --no-merged` uitvoeren:

	$ git branch --no-merged
	  testing

Dit toont je andere branch. Omdat het werk bevat dat nog niet samengevoegd is, zal het proberen te verwijderen met `git branch -d` falen:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Als je de branch echt wilt verwijderen en dat werk wilt verliezen, dan kun je het forceren met `-D`, zoals het behulpzame bericht je al meldt.
