# Wijzigingen aan het repository vastleggen

Je hebt een eersteklas Git-repository en een checkout of werkkopie van de bestanden binnen dat project. Als je wijzigingen maakt dan moet je deze committen in je repository op elk moment dat het project een status bereikt die je wilt vastleggen.

Onthoud dat elk bestand in je werkdirectory in een van twee statussen kan verkeren: *gevolgd (tracked)* of *niet gevolgd (untracked)*. *Tracked* bestanden zijn bestanden die in het laatste snapshot zaten; ze kunnen *ongewijzigd (unmodified)*, *gewijzigd (modified)* of *staged* zijn. *untracked* bestanden zijn al het andere; elk bestand in je werkdirectory dat niet in je laatste snapshot en niet in je staging area zit. Als je een repository voor het eerst clonet, zullen alle bestanden tracked en unmodified zijn, omdat je ze zojuist uitgechecked hebt en nog niets gewijzigd hebt.

Zodra je bestanden wijzigt, ziet Git ze als modified omdat je ze veranderd hebt sinds je laatste commit. Je *staget* deze gewijzigde bestanden en commit al je gestagede wijzigingen, en de cyclus begint weer van voor af aan. Deze cyclus wordt in Figuur 2-1 geïllustreerd.


![](http://git-scm.com/figures/18333fig0201-tn.png)

Figuur 2-1. De levenscyclus van de status van je bestanden.

## De status van je bestanden controleren

Het commando dat je voornamelijk zult gebruiken om te bepalen welk bestand zich in welke status bevindt is `git status`. Als je dit commando direct na het clonen uitvoert, dan zal je zoiets als het volgende zien:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Dit betekent dat je een schone werkdirectory hebt, met andere woorden er zijn geen tracked bestanden die gewijzigd zijn. Git ziet ook geen untracked bestanden, anders zouden ze hier getoond worden. Als laatste vertelt het commando op welke tak (branch) je nu zit. Voor nu is dit altijd `master`, dat is de standaard; besteed daar voor nu nog geen aandacht aan. In het volgende hoofdstuk wordt gedetaileerd ingegaan op branches en referenties.

Stel dat je een nieuw bestand toevoegt aan je project, een simpel README bestand. Als het bestand voorheen nog niet bestond, en je doet `git status`, dan zul je het niet getrackte bestand op deze manier zien:

	$ vim README
	$ git status
	On branch master
	Untracked files:
	  (use "git add <file>..." to include in what will be committed)
	
	        README

	nothing added to commit but untracked files present (use "git add" to track)

Je kunt zien dat het nieuwe README bestand untrackt is, omdat het onder de “Untracked files” kop staat in je status output. Untrackt betekent eigenlijk dat Git een bestand ziet dat je niet in het vorige snapshot (commit) had; Git zal het niet in je commit snapshots toevoegen totdat jij dit expliciet aangeeft. Dit wordt zo gedaan zodat je niet per ongeluk gegenereerde binaire bestanden toevoegt, of andere bestanden die je niet wilt toevoegen. Je wilt dit README bestand wel meenemen, dus laten we het gaan tracken.

## Nieuwe bestanden volgen (tracking)

Om een nieuw bestand te beginnen te tracken, gebruik je het commando `git add`. Om de README te tracken, voer je dit uit:

	$ git add README

Als je het `status` commando nogmaals uitvoert, zie je dat je README bestand nu getrackt en ge-staged is:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	

Je kunt zien dat het gestaged is, omdat het onder de kop “Changes to be committed” staat. Als je nu een commit doet, zal de versie van het bestand zoals het was ten tijde van je `git add` commando in de historische snapshot toegevoegd worden. Je zult je misschien herinneren dat, toen je `git init` eerder uitvoerde, je daarna `git add (bestanden)` uitvoerde; dat was om bestanden in je directory te beginnen te tracken. Het `git add` commando beschouwt een padnaam als een bestand of een directory. Als de padnaam een directory is, dan voegt het commando alle bestanden in die directory recursief toe.

## Gewijzigde bestanden stagen

Laten we een getrackt bestand wijzigen. Als je een reeds getrackt bestand genaamd `benchmarks.rb` wijzigt, en dan je `status` commando nog eens uitvoert, krijg je iets dat er zo uitziet:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README

	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

Het `benchmarks.rb` bestand verschijnt onder een sectie genaamd “Changes not staged for commit”, wat inhoudt dat een bestand dat wordt getrackt is gewijzigd in de werkdirectory, maar nog niet is gestaged. Om het te stagen, voer je het `git add` commando uit (het is een veelzijdig commando: je gebruikt het om bestanden te laten tracken, om bestanden te stagen, en om andere dingen zoals een bestand met een mergeconflict als opgelost te markeren). Laten we nu `git add` uitvoeren om het `benchmarks.rb` bestand te stagen, en dan nog eens `git status` uitvoeren:

	$ git add benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	        modified:   benchmarks.rb
	

Beide bestanden zijn gestaged en zullen met je volgende commit meegaan. Stel nu dat je je herinnert dat je nog een kleine wijziging in `benchmarks.rb` wilt maken voordat je het commit. Je kunt het opnieuw openen en die wijziging maken, en dan ben je klaar voor de commit. Alhoewel, laten we `git status` nog een keer uitvoeren:

	$ vim benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	        modified:   benchmarks.rb
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

Asjemenou?! Nu staat `benchmarks.rb` zowel bij de staged en unstaged genoemd. Hoe is dat mogelijk? Het blijkt dat Git een bestand precies zoals het is staget wanneer je het `git add` commando uitvoert. Als je nu commit, dan zal de versie van `benchmarks.rb` zoals het was toen je voor 't laatst `git add` uitvoerde worden toegevoegd in de commit, en niet de versie van het bestand zoals het eruit ziet in je werkdirectory toen je `git commit` uitvoerde. Als je een bestand wijzigt nadat je `git add` uitvoert, dan moet je `git add` nogmaals uitvoeren om de laatste versie van het bestand te stagen:

	$ git add benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	        modified:   benchmarks.rb
	

## Bestanden negeren

Vaak zul je een klasse bestanden hebben waarvan je niet wilt dat Git deze automatisch toevoegt of zelfs maar als untracked toont. Dit zijn doorgaans automatisch gegenereerde bestanden zoals logbestanden of bestanden die geproduceerd worden door je bouwsysteem. In die gevallen kun je een bestand genaamd `.gitignore` maken, waarin patronen staan die die bestanden passen. Hier is een voorbeeld van een `.gitignore` bestand:

	$ cat .gitignore
	*.[oa]
	*~

De eerste regel vertelt Git om ieder bestand te negeren waarvan de naam eindigt op een `.o` of `.a` (*object* en *archief* bestanden die het product kunnen zijn van het bouwen van je code). De tweede regel vertelt Git dat ze alle bestanden moet negeren die eindigen op een tilde (`~`), wat gebruikt wordt door editors zoals Emacs om tijdelijke bestanden aan te geven. Je mag ook `log`, `tmp` of een `pid` directory toevoegen, automatisch gegenereerde documentatie, enzovoort. Een `.gitignore` bestand aanmaken voordat je gaat beginnen is over 't algemeen een goed idee, zodat je niet per ongeluk bestanden commit die je echt niet in je repository wilt hebben.

De regels voor patronen die je in het `.gitignore` bestand kunt zetten zijn als volgt:

*	Lege regels of regels die beginnen met een `#` worden genegeerd.
*	Standaard expansie (glob) patronen werken.
*	Je mag patronen laten eindigen op een schuine streep (`/`) om een directory te specificeren.
*	Je mag een patroon ontkennend maken door het te laten beginnen met een uitroepteken (`!`).

Expansie (`glob`) patronen zijn vereenvoudigde reguliere expressies die in shell-omgevingen gebruikt worden. Een asterisk (`*`) komt overeen met nul of meer karakters, `[abc]` komt overeen met ieder karakter dat tussen de blokhaken staat (in dit geval `a`, `b` of `c`), een vraagteken (`?`) komt overeen met een enkel karakter en blokhaken waartussen karakters staan die gescheiden zijn door een streepje (`[0-9]`) komen overeen met ieder karakter wat tussen die karakters zit (in dit geval 0 tot en met 9).

Hier is nog een voorbeeld van een `.gitignore` bestand:

	# een commentaar – dit wordt genegeerd
	# geen .a files
	*.a
	# maar track lib.a wel, ook al negeer je hierboven .a files
	!lib.a
	# negeer alleen de file TODO in de root, niet de subdirectory /TODO
	/TODO
	# negeer alle bestanden in de build/ directory
	build/
	# negeer doc/notes.txt, maar niet doc/server/arch.txt
	doc/*.txt

Een `**/` patroon is sinds versie 1.8.2 beschikbaar in Git.

## Je staged en unstaged wijzigingen zien

Als het `git status` commando te vaag is voor je, je wilt precies weten wat je veranderd hebt en niet alleen welke bestanden veranderd zijn, dan kun je het `git diff` commando gebruiken. We zullen `git diff` later in meer detail bespreken, maar je zult dit commando het meest gebruiken om deze twee vragen te beantwoorden: Wat heb je veranderd maar nog niet gestaged? En wat heb je gestaged en sta je op het punt te committen? Waar `git status` deze vragen heel algemeen beantwoordt, laat `git diff` je de exacte toegevoegde en verwijderde regels zien, de patch, als het ware.

Stel dat je het `README` bestand opnieuw verandert en staget, en dan het `benchmarks.rb` bestand verandert zonder het te stagen. Als je je `status` commando uitvoert, dan zie je nogmaals zoiets als dit:

	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        new file:   README
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

Om te zien wat je gewijzigd maar nog niet gestaged hebt, typ `git diff` in zonder verdere argumenten:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

Dat commando vergelijkt wat er in je werkdirectory zit met wat er in je staging area zit. Het resultaat laat je zien welke wijzigingen je gedaan hebt, die je nog niet gestaged hebt.

Als je wilt zien wat je gestaged hebt en in je volgende commit zal zitten, dan kun je `git diff –-cached` gebruiken. (In Git versie 1.6.1 en nieuwer kun je ook `git diff --staged` gebruiken, wat misschien beter te onthouden is.) Dit commando vergelijkt je staged wijzigingen met je laatste commit:

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

Het is belangrijk om te zien dat `git diff` zelf niet alle wijzigingen sinds je laatste commit laat zien, alleen wijzigingen die nog niet gestaged zijn. Dit kan verwarrend zijn, omdat als je al je wijzigingen gestaged hebt, `git diff` geen output zal geven.

Nog een voorbeeld. Als je het `benchmarks.rb` bestand staget en vervolgens verandert, dan kun je `git diff` gebruiken om de wijzigingen in het bestand te zien dat gestaged is en de wijzigingen die niet gestaged zijn:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        modified:   benchmarks.rb
	
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	

Nu kun je `git diff` gebruiken om te zien wat nog niet gestaged is

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats
	+# test line

en `git diff --cached` om te zien wat je tot nog toe gestaged hebt:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Je wijzigingen committen

Nu je staging area gevuld is zoals jij het wilt, kun je de wijzigingen committen. Onthoud dat alles wat niet gestaged is, dus ieder bestand dat je gemaakt of gewijzigd hebt en waarop je nog geen `git add` uitgevoerd hebt, niet in deze commit mee zal gaan. Ze zullen als gewijzigde bestanden op je schijf blijven staan.
In dit geval zag je de laatste keer dat je `git status` uitvoerde, dat alles gestaged was. Dus je bent er klaar voor om je wijzigingen te committen. De makkelijkste manier om te committen is om `git commit` in te typen:

	$ git commit

Dit start de door jou gekozen editor op. (Dit wordt bepaald door de `$EDITOR` omgevingsvariabele in je shell, meestal vim of emacs, alhoewel je dit kunt instellen op welke editor je wilt gebruiken met het `git config --global core.editor` commando zoals je in *Hoofdstuk 1* gezien hebt).

De editor laat de volgende tekst zien (dit voorbeeld is een Vim scherm):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#       new file:   README
	#       modified:   benchmarks.rb
	#
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

Je kunt zien dat de standaard commit boodschap de laatste output van het `git status` commando als commentaar bevat en een lege regel bovenaan. Je kunt deze commentaren verwijderen en je eigen commit boodschap intypen, of je kunt ze laten staan om je eraan te helpen herinneren wat je aan het committen bent. (Om een meer expliciete herinnering van je wijzigingen te zien kun je de `-v` optie meegeven aan `git commit`. Als je dit doet zet Git de diff van je veranderingen in je editor zodat je precies kunt zien wat je gedaan hebt.) Als je de editor verlaat, creëert Git je commit boodschap (zonder de commentaren of de diff).

Als alternatief kun je de commit boodschap met het `commit` commando meegeven door hem achter de `-m` optie te specificeren, zoals hier:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master 463dc4f] Fix benchmarks for speed
	 2 files changed, 3 insertions(+)
	 create mode 100644 README

Nu heb je je eerste commit gemaakt! Je kunt zien dat de commit je wat output over zichzelf heeft gegeven: op welke branch je gecommit hebt (`master`), welke SHA-1 checksum de commit heeft (`463dc4f`), hoeveel bestanden er veranderd zijn, en statistieken over toegevoegde en verwijderde regels in de commit.

Onthoud dat de commit de snapshot, die je in je staging area ingesteld hebt, opslaat. Alles wat je niet gestaged hebt staat nog steeds gewijzigd; je kunt een volgende commit doen om het aan je geschiedenis toe te voegen. Iedere keer dat je een commit doet, leg je een snapshot van je project vast dat je later terug kunt draaien of waarmee je kunt vergelijken.

## De staging area overslaan

Alhoewel het ontzettend makkelijk kan zijn om commits precies zoals je wilt te maken, is de staging area soms iets ingewikkelder dan je in je workflow nodig hebt. Als je de staging area wilt overslaan, dan kan je met Git makkelijk de route inkorten. Door de `-a` optie aan het `git commit` commando mee te geven zal Git automatisch ieder bestand dat al getrackt wordt voor de commit stagen, zodat je het `git add` gedeelte kunt overslaan:

	$ git status
	On branch master
	Changes not staged for commit:
	  (use "git add <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        modified:   benchmarks.rb
	
	no changes added to commit (use "git add" and/or "git commit -a")
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+)

Merk op dat je nu geen `git add` op het `benchmarks.rb` bestand hoeft te doen voordat je commit.

## Bestanden verwijderen

Om een bestand van Git te verwijderen, moet je het van de getrackte bestanden verwijderen (of om precies te zijn: verwijderen van je staging area) en dan een commit doen. Het `git rm` commando doet dat, en verwijdert het bestand ook van je werkdirectory zodat je het de volgende keer niet als een untrackt bestand ziet.

Als je het bestand simpelweg verwijdert uit je werkdirectory, zal het te zien zijn onder het “Changes not staged for commit” (dat wil zeggen, _unstaged_) gedeelte van je `git status` output:

	$ rm grit.gemspec
	$ git status
	On branch master
	Changes not staged for commit:
	  (use "git add/rm <file>..." to update what will be committed)
	  (use "git checkout -- <file>..." to discard changes in working directory)
	
	        deleted:    grit.gemspec
	
	no changes added to commit (use "git add" and/or "git commit -a")

Als je daarna `git rm` uitvoert, zal de verwijdering van het bestand gestaged worden:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        deleted:    grit.gemspec
	

Als je de volgende keer een commit doet, zal het bestand verdwenen zijn en niet meer getrackt worden. Als je het bestand veranderd hebt en al aan de index toegevoegd, dan zul je de verwijdering moeten forceren met de `-f` optie. Dit is een veiligheidsmaatregel om te voorkomen dat je per ongeluk data die nog niet in een snapshot zit, en dus niet teruggehaald kan worden uit Git, weggooit.

Een ander handigheidje wat je misschien wilt gebruiken is het bestand in je werkdirectory houden, maar van je staging area verwijderen. Met andere woorden, je wilt het bestand misschien op je harde schijf bewaren, maar niet dat Git het bestand nog trackt. Dit is erg handig als je iets vergeten bent aan je `.gitignore` bestand toe te voegen, en het per ongeluk toegevoegd hebt. Zoals een groot logbestand, of een serie `.a` gecompileerde bestanden. Gebruik de `--cached` optie om dit te doen:

	$ git rm --cached readme.txt

Je kunt bestanden, directories en bestandspatronen aan het `git rm` commando meegeven. Dat betekent dat je zoiets als dit kunt doen

	$ git rm log/\*.log

Let op de backslash (`\`) voor de `*`. Dit is nodig omdat Git zijn eigen bestandsnaam-expansie doet, naast die van je shell. In de Windows systeemconsole moet de backslash worden weggelaten. Dit commando verwijdert alle bestanden die de `.log` extensie hebben in de `log/` directory. Of, je kunt zoiets als dit doen:

	$ git rm \*~

Dit commando verwijdert alle bestanden die eindigen met `~`.

## Bestanden verplaatsen

Anders dan vele andere VCS systemen, traceert Git niet expliciet verplaatsingen van bestanden. Als je een bestand een nieuwe naam geeft in Git, is er geen metadata opgeslagen in Git die vertelt dat je het bestand hernoemd hebt. Maar Git is slim genoeg om dit alsnog te zien, we zullen bestandsverplaatsing-detectie wat later behandelen.

Het is daarom een beetje verwarrend dat Git een `mv` commando heeft. Als je een bestand wilt hernoemen in Git, kun je zoiets als dit doen

	$ git mv file_from file_to

en dat werkt prima. Sterker nog, als je zoiets als dit uitvoert en naar de status kijkt, zul je zien dat Git het als een hernoemd bestand beschouwt:

	$ git mv README.txt README
	$ git status
	On branch master
	Changes to be committed:
	  (use "git reset HEAD <file>..." to unstage)
	
	        renamed:    README.txt -> README
	

Maar dat is gelijk aan het uitvoeren van het volgende:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git komt er impliciet achter dat het om een hernoemd bestand gaat, dus het maakt niet uit of je een bestand op deze manier hernoemt of met het `mv` commando. Het enige echte verschil is dat het `mv` commando slechts één commando is in plaats van drie. En belangrijker nog is dat je iedere applicatie kunt gebruiken om een bestand te hernoemen, en de add/rm later kunt afhandelen voordat je commit.
