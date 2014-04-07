# Dingen ongedaan maken

Op enig moment wil je misschien iets ongedaan maken. Hier zullen we een aantal basis-tools laten zien om veranderingen die je gemaakt hebt weer ongedaan te maken. Maar pas op, je kunt niet altijd het ongedaan maken weer ongedaan maken. Dit is één van de weinige gedeeltes in Git waarbij je werk kwijt kunt raken als je het verkeerd doet.

## Je laatste commit veranderen

Een van de veel voorkomende acties die ongedaan gemaakt moeten worden vinden plaats als je te vroeg commit en misschien vergeet een aantal bestanden toe te voegen, of je verknalt je commit boodschap. Als je opnieuw wilt proberen te committen, dan kun je commit met de `--amend` optie uitvoeren:

	$ git commit --amend

Dit commando neemt je staging area en gebruikt dit voor de commit. Als je geen veranderingen sinds je laatste commit hebt gedaan (bijvoorbeeld, je voert dit commando meteen na je laatste commit uit), dan zal je snapshot er precies hetzelfde uitzien en zal je commit boodschap het enige zijn dat je verandert.

Dezelfde commit-boodschap editor start op, maar deze bevat meteen de boodschap van je vorige commit. Je kunt de boodschap net als andere keren aanpassen, maar het overschrijft je vorige commit.

Bijvoorbeeld, als je commit en je dan realiseert dat je vergeten bent de veranderingen in een bestand dat je wou toevoegen in deze commit te stagen, dan kun je zoiets als dit doen:

	$ git commit -m 'initial commit'
	$ git add vergeten_bestand
	$ git commit --amend

Na deze drie commando's eindig je met één commit; de tweede commit vervangt de resultaten van de eerste.

## Een staged bestand unstagen

De volgende twee paragrafen laten zien hoe je de staging area en veranderingen in je werkdirectories aanpakt. Het prettige hier is dat het commando dat je gebruikt om de status van die gebieden te bepalen, je er ook aan herinnert hoe je de veranderingen eraan weer ongedaan kunt maken. Bijvoorbeeld, stel dat je twee bestanden gewijzigd hebt en je wilt ze committen als twee aparte veranderingen, maar je typt per ongeluk `git add *` en staged ze allebei. Hoe kun je één van de twee nu unstagen? Het `git status` commando herinnert je eraan:

	$ git add .
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   README.txt
	        modified:   benchmarks.rb
	

Direct onder de "Changes to be committed" tekst, staat dat je `git reset HEAD <file>...` moet gebruiken om te unstagen. Laten we dat advies volgen om het `benchmarks.rb` bestand te unstagen:

	$ git reset HEAD benchmarks.rb
	Unstaged changes after reset:
	M       benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   README.txt
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

Het commando is een beetje vreemd, maar het werkt. Het benchmarks.rb bestand is gewijzigd maar weer geunstaged.

## Een gewijzigd bestand weer ongewijzigd maken

Wat als je je realiseert dat je de wijzigingen aan het `benchmarks.rb` bestand niet wilt behouden? Hoe kun je dit makkelijk ongedaan maken; terugbrengen in de staat waarin het was toen je voor het laatst gecommit hebt (of initieel gecloned, of hoe je het ook in je werkdirectory gekregen hebt)? Gelukkig vertelt `git status` je ook hoe je dat moet doen. In de laatste voorbeeld-output, ziet het unstaged gebied er zo uit:

	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

Het vertelt je behoorlijk expliciet hoe je je veranderingen moet weggooien (tenminste, de nieuwere versies van Git, 1.6.1 of nieuwer, doen dit. Als je een oudere versie hebt, raden we je ten zeerste aan om het te upgraden zodat je een aantal van deze fijne bruikbaarheidsopties krijgt). Laten we eens doen wat er staat:

	$ git checkout -- benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   README.txt
	

Je kunt zien dat de veranderingen teruggedraaid zijn. Je moet je ook beseffen dat dit een gevaarlijk commando is: alle veranderingen die je aan dat bestand gedaan hebt zijn weg; je hebt er zojuist een ander bestand overheen gezet. Gebruik dit commando dan ook nooit, tenzij je heel zeker weet dat je het bestand niet wilt. Als je het alleen maar uit de weg wilt hebben, gebruik dan branching of stashing wat we behandelen in het volgende hoofdstuk; dit zijn vaak de betere opties.

Onthoud, alles dat in Git gecommit is kan bijna altijd weer hersteld worden. Zelfs commits die op reeds verwijderde branches gedaan zijn, of commits die zijn overschreven door een `--amend` commit, kunnen weer hersteld worden (zie *Hoofdstuk 9* voor data herstel). Maar, alles wat je verliest dat nog nooit was gecommit is waarschijnlijk voor altijd verloren.
