# De commit geschiedenis bekijken

Nadat je een aantal commits gemaakt hebt, of als je een repository met een bestaande commit-geschiedenis gecloned hebt, zul je waarschijnlijk terug willen zien wat er gebeurd is. Het meest basale en krachtige tool om dit te doen is het `git log` commando.

Deze voorbeelden maken gebruik van een eenvoudig project genaamd simplegit dat ik vaak voor demonstraties gebruikt. Om het project op te halen, voer dit uit

	git clone git://github.com/schacon/simplegit-progit.git

Als je `git log` in dit project uitvoert, zou je output moeten krijgen die er ongeveer zo uitziet:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

Zonder argumenten toont `git log` standaard de commits die gedaan zijn in die repository, in omgekeerde chronologische volgorde. Dat wil zeggen: de meest recente commits worden als eerste getoond. Zoals je kunt zien, toont dit commando iedere commit met zijn SHA-1 checksum, de naam van de auteur en zijn e-mail, de datum van opslaan, en de commit boodschap.

Een gigantisch aantal en variëteit aan opties zijn beschikbaar voor het `git log` commando om je precies te laten zien waar je naar op zoek bent. Hier laten we je de meest gebruikte opties zien.

Een van de meest behulpzame opties is `-p`, wat de diff laat zien van de dingen die in iedere commit geïntroduceerd zijn. Je kunt ook `-2` gebruiken, om alleen de laatste twee items te laten zien:

	$ git log –p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,7 +5,7 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Deze optie toont dezelfde informatie, maar dan met een diff volgend op ieder item. Dit is erg handig voor een code review, of om snel te zien wat er tijdens een reeks commits gebeurd is die een medewerker toegevoegd heeft.

Soms is het handiger om wijzigingen na te kijken op woordniveau in plaats van op regelniveau. Er is een `--word-diff` optie beschikbaar in Git, die je aan het `git log -p` commando kan toevoegen om een woord diff te krijgen inplaats van de reguliere regel voor regel diff. Woord diff formaat is nogal nutteloos als het wordt toegepast op broncode, maar is erg handig als het wordt toegepast op grote tekstbestanden, zoals boeken of een dissertatie. Hier is een voorbeeld.

	$ git log -U1 --word-diff
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -7,3 +7,3 @@ spec = Gem::Specification.new do |s|
	    s.name      =   "simplegit"
	    s.version   =   [-"0.1.0"-]{+"0.1.1"+}
	    s.author    =   "Scott Chacon"

Zoals je kunt zien zijn er geen toegevoegde of verwijderde regels in deze uitvoer zoals in een normale diff. Wijzigingen worden daarentegen binnen de regel getoond. Je kunt het toegevoegde woord zien binnen een `{+ +}` en verwijderde binnen een `[- -]`. Je kunt ook kiezen om de gebruikelijke 3 regels context in de diff uitvoer tot één regel te verminderen, omdat de context nu woorden is, en geen regels. Je kunt dit doen met `-U1` zoals hierboven in het voorbeeld.

Je kunt ook een serie samenvattende opties met `git log` gebruiken. Bijvoorbeeld, als je wat verkorte statistieken bij iedere commit wilt zien, kun je de `--stat` optie gebruiken:

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 file changed, 1 insertion(+), 1 deletion(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 file changed, 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+)

Zoals je ziet, drukt de `--stat` optie onder iedere commit een lijst gewijzigde bestanden af, hoeveel bestanden gewijzigd zijn, en hoeveel regels in die bestanden zijn toegevoegd en verwijderd. Het toont ook een samenvatting van de informatie aan het einde.
Een andere handige optie is `--pretty`. Deze optie verandert de log output naar een ander formaat dan de standaard. Er zijn al een paar voorgebouwde opties voor je beschikbaar. De `oneline` optie drukt iedere commit op een eigen regel af, wat handig is als je naar een hoop commits kijkt. Daarnaast tonen de `short`, `full` en `fuller` opties de output in grofweg hetzelfde formaat, maar met minder of meer informatie, respectievelijk:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

De meest interessante optie is `format`, waarmee je je eigen log-uitvoer-formaat kunt specificeren. Dit is in het bijzonder handig als je output aan het genereren bent voor automatische verwerking; omdat je expliciet het formaat kan specificeren, weet je dat het niet zal veranderen bij volgende versies van Git:

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Tabel 2-1 toont een aantal handige opties die aan format gegeven kunnen worden.

|Optie|Omschrijving van de Output|
|-----|--------------------------|
|%H|Commit hash|
|%h|Afgekorte commit hash|
|%T|Tree hash|
|%t|Afgekorte tree hash|
|%P|Parent hashes|
|%p|Afgekorte parent hashes|
|%an|Auteur naam|
|%ae|Auteur e-mail|
|%ad|Auteur datum (formaat respecteert de –date= optie)|
|%ar|Auteur datum, relatief|
|%cn|Committer naam|
|%ce|Committer e-mail|
|%cd|Committer datum|
|%cr|Committer datum, relatief|
|%s|Onderwerp|

Je zult je misschien afvragen wat het verschil is tussen _author_ en _committer_. De _author_ is de persoon die de patch oorspronkelijk geschreven heeft, en de _committer_ is de persoon die de patch als laatste heeft toegepast. Dus als je een patch naar een project stuurt en een van de kernleden past de patch toe, dan krijgen jullie beiden de eer, jij als de auteur en het kernlid als de committer. We gaan hier wat verder op in in *Hoofdstuk 5*.

De `oneline` en `format` opties zijn erg handig in combinatie met een andere `log` optie genaamd `--graph`. Deze optie maakt een mooie ASCII grafiek waarin je branch- en merge-geschiedenis getoond worden, die we kunnen zien in onze kopie van het Grit project repository:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Dat zijn slechts een paar simpele output formaat opties voor `git log`; er zijn er nog veel meer. Tabel 2-2 toont de opties waarover we het tot nog toe gehad hebben, en wat veel voorkomende formaat-opties die je misschien handig vindt, samen met hoe ze de output van het `log` commando veranderen.

|Optie|Omschrijving|
|-----|------------|
|-p|Toon de patch geïntroduceerd bij iedere commit.|
|--word-diff|Toon de patch in een woord diff formaat.|
|--stat|Toon statistieken voor gewijzigde bestanden per commit.|
|--shortstat|Toon alleen de gewijzigde/ingevoegde/verwijderde regel van het --stat commando.|
|--name-only|Toon de lijst van bestanden die gewijzigd zijn na de commit-informatie.|
|--name-status|Toon ook de lijst van bestanden die beïnvloed zijn door de toegevoegde/gewijzigde/verwijderde informatie.|
|--abbrev-commit|Toon alleen de eerste paar karakters van de SHA-1 checksum in plaats van alle 40.|
|--relative-date|Toon de datum in een relatief formaat (bijvoorbeeld, "2 weken geleden"), in plaats van het volledige datum formaat.|
|--graph||Toon een ASCII grafiek van de branch- en merge-geschiedenis naast de log output.|
|--pretty|Toon commits in een alternatief formaat. De opties bevatten oneline, short, full, fuller, en format (waarbij je je eigen formaat specificeert).|
|--oneline|Een gemaks-optie, staat voor `--pretty=oneline --abbrev-commit`.|

## Log output limiteren

Naast het formatteren van de output, heeft `git log` nog een aantal bruikbare limiterende opties; dat wil zeggen, opties die je een subset van de commits tonen. Je hebt zo'n optie al gezien: de `-2` optie, die slechts de laatste twee commits laat zien. Sterker nog: je kunt `-<n>` doen, waarbij `n` een heel getal is om de laatste `n` commits te laten zien. In feite zul je deze vorm weinig gebruiken, omdat Git standaard alle output door een pager (pagineer applicatie) stuurt zodat je de log-uitvoer pagina voor pagina ziet.

Dat gezegd hebbende, zijn de tijd-limiterende opties zoals `--since` en `--until` erg handig. Dit commando bijvoorbeeld, geeft een lijst met commits die gedaan zijn gedurende de laatste twee weken:

	$ git log --since=2.weeks

Dit commando werkt met veel formaten: je kunt een specifieke datum kiezen ("2008-01-15”) of een relatieve datum zoals "2 jaar 1 dag en 3 minuten geleden".

Je kunt ook de lijst met commits filteren op bepaalde criteria. De `--author` optie laat je filteren op een specifieke auteur, en de `--grep` optie laat je op bepaalde zoekwoorden filteren in de commit boodschappen. (Let op dat als je zowel auteur als grep opties wilt specificeren, je `--all-match` moet toevoegen of anders zal het commando ook commits met één van de twee criteria selecteren.)

De laatste echt handige optie om aan `git log` als filter mee te geven is een pad. Als je een directory of bestandsnaam opgeeft, kun je de log output limiteren tot commits die een verandering introduceren op die bestanden. Dit is altijd de laatste optie en wordt over het algemeen vooraf gegaan door dubbele streepjes (`--`) om de paden van de opties te scheiden.

In Tabel 2-3 laten we deze en een paar andere veel voorkomende opties zien als referentie.

|Optie|Omschrijving|
|-----|------------|
|-(n)|Laat alleen de laatste n commits zien|
|--since, --after|Limiteer de commits tot degenen na de gegeven datum.|
|--until, --before|Limiteer de commits tot degenen voor de gegeven datum.|
|--author|Laat alleen de commits zien waarvan de auteur bij de gegeven tekst past.|
|--committer|Laat alleen de commits zien waarvan de committer bij de gegeven tekst past.|

Bijvoorbeeld, als je wilt zien welke commits test bestanden in de Git broncode geschiedenis aanpasten waarvan de committer Junio Hamano is en die in de maand oktober van 2008 gemerged zijn, kun je zoiets als dit uitvoeren:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Van de bijna 20.000 commits in de Git broncode historie, laat dit commando de 6 zien die bij die criteria passen.

## Een grafische interface gebruiken om de historie te visualiseren

Als je een meer grafische applicatie wilt gebruiken om je commit historie te visualiseren, wil je misschien een kijkje nemen naar het Tcl/Tk programma genaamd `gitk` dat met Git meegeleverd wordt. Gitk is eigenlijk een visuele `git log` tool, en het accepteert bijna alle filter opties die `git log` ook accepteert. Als je `gitk` in op de commandoregel in je project typt, zou je zoiets als in Figuur 2-2 moeten zien.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Figuur 2-2. De gitk historie-visualiseerder.

Je kunt de commit-historie in de bovenste helft van het scherm zien, samen met een afkomst graaf. De diff in de onderste helft van het scherm laat je de veranderingen zien die geïntroduceerd zijn bij iedere commit die je aanklikt.
