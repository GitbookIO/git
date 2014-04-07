# Naar Git migreren

Als je een bestaande hoeveelheid broncode in een ander VCS hebt, en je hebt besloten om Git te gaan gebruiken dan moet je het project onvermijdelijk migreren. Deze paragraaf behandelt een aantal importeerders die bij Git worden geleverd voor veel voorkomende systemen, en demonstreert daarna hoe je je eigen importeerder kunt ontwikkelen.

## Importeren

Je zult leren hoe je data uit twee van de grotere professioneel gebruikte SCM systemen kunt importeren, Subversion en Perforce. Dit omdat zij op dit moment de grootste gebruikersgroep hebben waarvan ik op dit moment hoor dat ze willen omschakelen, en omdat er tools van hoge kwaliteit voor beide systemen meegeleverd worden met Git.

## Subversion

Als je de vorige paragraaf over het gebruik van `git svn` heb gelezen, kun je die instructies eenvoudig gebruiken om een `git svn clone` te doen op een repository. Daarna stop je met het gebruik van de Subversion server, pusht naar de nieuwe Git server, en gaat die gebruiken. Als je de historie wilt hebben kan dat zo snel als dat je van de server kunt pullen voor elkaar krijgen (dat echter even duren).

Echter, de import is niet perfect; en omdat het zo veel tijd in beslag neemt kan je het maar beter meteen goed doen. Het eerste probleem is informatie over de auteurs. In Subversion heeft iedere persoon die commit een gebruikersaccount op het systeem, welke wordt opgenomen in de commit informatie. De voorbeelden in de voorgaande paragraaf laten `schacon` zien op bepaalde plaatsen zoals de `blame` output en bij `git svn log`. Als je dit naar betere Git auteur data wilt vertalen, dan heb je een vertaaltabel nodig van de Subversion gebruikers naar de Git auteurs. Maak een bestand genaamd `users.txt` die een tabel in dit formaat heeft:

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

Om een lijst te krijgen van de auteurnamen die in SVN gebruikt worden, kan je dit uitvoeren:

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

Daarmee krijg je de log output in XML formaat - je kunt hierin zoeken naar de auteurs, een lijst met unieke vermeldingen creëren en dan de XML eruit verwijderen. (Dit werkt uiteraard alleen op een machine waarop `grep`, `sort` en `Perl` geïnstalleerd is.) Daarna stuur je die output naar je users.txt bestand zodat je de overeenkomstige Git gebruiker gegevens naast iedere vermelding kunt zetten.

Je kunt dit bestand meegeven aan `git svn` om het te helpen de auteur gegevens juist te vertalen. Je kunt `git svn` ook vertellen dat het de metadata die Subversion normaal importeert niet te gebruiken, door de `--no-metadata` optie mee te geven aan het `clone` of `init` commando. Dit laat je `import` commando er zo uit zien:

	$ git-svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

Nu zou je een betere Subversion import moeten hebben in je `my_project` directory. In plaats van commits die er zo uit zien

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029
zien ze er zo uit:

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

Niet alleen het Author veld ziet er beter uit, maar het `git-svn-id` is ook niet meer aanwezig.

Je moet nog wat `post-import` schoonmaak doen. Je moet bijvoorbeeld nog de rare referenties die `git svn` opgezet heeft opruimen. Als eerste verplaats je de tags zodat het echte tags worden in plaats van vreemde remote branches, en dan verplaats je de rest van de branches zodat ze lokaal worden.

Om de tags goede Git tags te laten worden, voer je dit uit

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

Dit neemt de referenties die remote branches waren en met `tag/` beginnen, en maakt er echte (lichtgewicht) tags van.

Daarna verplaats je de rest van de referenties onder `refs/remotes` zodat het lokale branches worden:

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

Nu zijn alle oude branches echte Git branches en alle oude tags echte Git tags. Het laatste wat je moet doen is je nieuwe Git server als een remote toevoegen en er naar pushen. Hier is een voorbeeld van hoe je de server als een remote toevoegt:

	$ git remote add origin git@my-git-server:myrepository.git

Omdat je al jouw branches en tags naar de server wilt laten gaan, kun je dit uitvoeren:

	$ git push origin --all
	$ git push origin --tags

Al je branches en tags zouden op je Git server moeten staan in een mooie schone import.

## Perforce

Het volgende systeem waar je naar gaat kijken om vanuit te importeren is Perforce. Er zit ook een Perforce importeerder bij de Git distributie. Als je een Git versie vóór 1.7.11 hebt, zit deze alleen in het `contrib` gedeelte van de broncode. In dat geval, moet je de Git broncode ophalen, die je van git.kernel.org kunt downloaden:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

In deze `fast-import` directory, zou je een uitvoerbaar Python script genaamd `git-p4` moeten vinden. Je moet Python en het `p4` tool geïnstalleerd hebben op je machine om deze import te laten werken. Als voorbeeld ga je het Jam project van de Perforce Public Depot importeren. Om je client in te stellen, moet je de P4PORT omgevingsvariabele laten wijzen naar het Perforce depot:

	$ export P4PORT=public.perforce.com:1666

Voer het `git-p4-clone` commando uit om het Jam project van de Perforce server te importeren, waarbij je het pad naar het depot en het project en het pad waarnaar je wilt importeren mee geeft:

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

Als je naar de `/opt/p4import` directory gaat en `git log` uitvoert, kun je je geïmporteerde werk zien:

	$ git log -2
	commit 1fd4ec126171790efd2db83548b85b1bbbc07dc2
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	    [git-p4: depot-paths = "//public/jam/src/": change = 4409]

	commit ca8870db541a23ed867f38847eda65bf4363371d
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

	    [git-p4: depot-paths = "//public/jam/src/": change = 3108]

Je kunt de `git-p4` identificator in iedere commit zien. Het is prima om die identificator daar te laten, voor het geval je later naar het Perforce wijzigingsnummer moet refereren. Maar, als je de identificator wilt verwijderen is nu het geschikte moment om dat te doen - voordat je begint met werken op de nieuwe repository. Je kunt `git filter-branch` gebruiken om de identificatie tekst en masse te verwijderen:

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

Als je `git log` uitvoert, zal je zien dat alle SHA-1 checksums voor de commits gewijzigd zijn, maar de `git-p4` teksten staan niet langer in de commit berichten:

	$ git log -2
	commit 10a16d60cffca14d454a15c6164378f4082bc5b0
	Author: Perforce staff <support@perforce.com>
	Date:   Thu Aug 19 10:18:45 2004 -0800

	    Drop 'rc3' moniker of jam-2.5.  Folded rc2 and rc3 RELNOTES into
	    the main part of the document.  Built new tar/zip balls.

	    Only 16 months later.

	commit 2b6c6db311dd76c34c66ec1c40a49405e6b527b2
	Author: Richard Geiger <rmg@perforce.com>
	Date:   Tue Apr 22 20:51:34 2003 -0800

	    Update derived jamgram.c

Je import is nu klaar om naar je nieuwe Git server gepusht te worden.

## Een eigen importeerder

Als het door jou gebruikte systeem niet Subversion of Perforce is, zou je online voor een importeerder moeten zoeken. Er zijn importeerders van goede kwaliteit beschikbaar voor CVS, Clear Case, Visual Source Safe, en zelfs voor een directory met archieven. Als geen van deze tools voor jou geschikt is, je hebt een zeldzame tool of je hebt om een andere reden een eigen import proces nodig, dan zou je `git fast-import` moeten gebruiken. Dit commando leest eenvoudige instructies van stdin om specifieke Git data te schrijven. Het is veel eenvoudiger om op deze manier Git objecten te maken dan de kale Git commando's uit te voeren, of om te proberen de kale objecten te schrijven (zie hoofdstuk 9 voor meer informatie). Op deze manier kun je een import script schrijven dat de noodzakelijke data uit het systeem dat je aan het importeren bent leest en rechtstreeks instructies op stdout afdrukt. Je kunt dit programma dan uitvoeren en de output door `git fast-import` sluizen (pipen).

Voor een korte demonstratie ga je een eenvoudige importeerder schrijven. Stel dat je in current werkt, waarbij je eens in de zoveel tijd een backup maakt door de projectdirectory te kopiëren naar een backup directory die gelabeld is met de tijd `back_YYYY_MM_DD`, en je wil dit in Git importeren. Je directory-structuur ziet er zo uit:

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

Om naar een Git directory te importeren, moet je nalezen hoe Git zijn data opslaat. Je kunt je misschien herinneren dat Git eigenlijk een gelinkte lijst is met commit objecten die naar een snapshot van de inhoud wijzen. Het enige dat je hoeft te doen, is `fast-import` vertellen wat de inhoud snapshots zijn, welke commit data er naar wijst en de volgorde waarin ze moeten staan. Je strategie zal bestaan uit het doorlopen van de snapshots en commits te creëren met de inhoud van iedere directory, waarbij je iedere commit terug linkt met de vorige.

Zoals je dat ook gedaan hebt in de "Een Voorbeeld van Git-Afgedwongen Beleid" paragraaf van Hoofdstuk 7 gaan we dit in Ruby schrijven, omdat ik daar over normaalgesproken mee werk en het relatief eenvoudig is te lezen. Je kunt dit voorbeeld vrij eenvoudig schrijven in hetgeen waar je bekend mee bent, het hoeft alleen de juiste informatie naar stdout te schrijven. En dat betekent dat als je op Windows werkt je erg voorzichtig moet zijn om geen carriage returns te introduceren aan het einde van je regels. Want git fast-import is erg kieskeurig wat dat betreft: hij wil slechts line feeds (LF) hebben en niet de cariage return line feeds (CRLF) die Windows gebruikt.

Om te beginnen ga je naar de doeldirectory en identificeert iedere subdirectory, waarvan elk een snapshot is dat je als commit wil importeren. Dan ga je in iedere subdirectory en print de noodzakelijke commando's om ze te exporteren. Je basis hoofdlus ziet er zo uit:

	last_mark = nil

	# loop through the directories
	Dir.chdir(ARGV[0]) do
	  Dir.glob("*").each do |dir|
	    next if File.file?(dir)

	    # move into the target directory
	    Dir.chdir(dir) do
	      last_mark = print_export(dir, last_mark)
	    end
	  end
	end

Je voert `print_export` uit binnen iedere directory, welke het manifest en het kenmerk van de vorige snapshot neemt, en het manifest en kenmerk van de huidige retourneert; op die manier kun je ze goed linken. "Mark" is de `fast-import` term voor een identificatie die je aan een commit geeft; terwijl je commits maakt geef je ze een kenmerk ("Mark") die je kunt gebruiken om vanuit andere commits naar te linken. Dus, het eerste wat je moet doen in je `print_export` functie is een kenmerk genereren van de directorynaam:

	mark = convert_dir_to_mark(dir)

Je zult dit doen door een lijst van directories te maken en de index waarde als kenmerk te gebruiken omdat een kenmerk een geheel getal moet zijn. Je functie ziet er zo uit:

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

Nu dat je een geheel getal hebt als representatie van de commit, moet je een datum hebben voor de commit metadata. Omdat de datum is uitgedrukt in de naam van de directory, haal je het daar uit. De volgende regel in het `print_export` bestand is

	date = convert_dir_to_date(dir)

waarbij `convert_dir_to_date` als volgt gedefinieerd is

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

Dat geeft een geheel getal terug als waarde voor de datum van iedere directory. Het laatste stukje meta-informatie dat je voor iedere commit nodig hebt zijn de gegevens van de committer, die je in een globale variabele stopt:

	$author = 'Scott Chacon <schacon@example.com>'

Nu ben je klaar om te beginnen met de commit data af te drukken voor je importeerder. De initiële informatie vraagt van je dat je een commit object definieert en op welke branch het zit, gevolgd door het kenmerk dat je gegenereerd hebt, de committer gegevens en het commit bericht en de vorige commit, als die er is. De code ziet er zo uit:

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

Je stelt de tijdzone (-0700) hardgecodeerd in omdat dat gemakkelijk is. Als je vanuit een ander systeem importeert, moet je de tijdzone als een compensatiewaarde (offset) specificeren.
Het commit bericht moet uitgedrukt worden in een speciaal formaat:

	data (size)\n(contents)

Het formaat bestaat uit het woord data, de grootte van de gegevens die gelezen moeten worden, een newline en als laatste de gegevens. Omdat je hetzelfde formaat nodig hebt om later de bestandsinhoud te specificeren, zul je een hulpfunctie creëren, `export_data`:

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

Het enige dat nog gespecificeerd moet worden is de bestandsinhoud voor ieder snapshot. Dit is eenvoudig, omdat je ze allemaal in een directory hebt, je kunt het `deleteall` commando afdruken, gevolgd door de inhoud van ieder bestand in de directory. Git zal dan elk snapshot op de juiste manier opslaan:

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

Let op: Omdat veel systemen hun revisies zien als veranderingen van de ene naar de andere commit, kan fast-import ook commando's aan waar bij iedere commit is gespecificeerd welke bestanden zijn toegevoegd, verwijderd, of aangepast en wat de nieuwe inhoud is. Je kunt de verschillen tussen snapshots berekenen en alleen deze data geven, maar om het zo te doen is complexer, Je kunt net zo goed Git alle data geven en hem het uit laten zoeken. Als dit beter geschikt is voor jouw situatie, bekijk dan de `fast-import` man pagina voor details over hoe je jouw gegevens op deze manier kunt aanleveren.

Het formaat om de nieuwe bestandsinhoud te tonen of een aangepast bestand met de nieuwe inhoud te specificeren is als volgt:

	M 644 inline path/to/file
	data (size)
	(file contents)

Hierbij is 644 de modus (als je uitvoerbare bestanden hebt, moet je dit detecteren en in plaats daarvan 755 specificeren), en inline geeft aan dat je de inhoud onmiddelijk na deze regel toont. Je `inline_data` functie ziet er zo uit:

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

Je hergebruikt de `export_data` data functie die je eerder gedefinieerd hebt, omdat dezelfde manier gebruikt wordt als waarme je de commit bericht data te specificeert.

Het laatste wat je moet doen is het huidige kenmerk teruggeven, zodat het meegegeven kan worden aan de volgende iteratie:

	return mark

LET OP: Als je op Windows werkt moet je er zeker van zijn dat je nog één extra stap toevoegt. Zoals eerder gemeld is, gebruikt Windows CRLF als new line karakters, terwijl git fast-import alleen LF verwacht. Om dit probleem te omzeilen en git fast-import blij te maken, moet je ruby vertellen om LF in plaats van CRLF te gebruiken:

	$stdout.binmode

Dat is alles. Als je dit script uitvoert, zal je inhoud krijgen die er ongeveer zo uit ziet:

	$ ruby import.rb /opt/import_from
	commit refs/heads/master
	mark :1
	committer Scott Chacon <schacon@geemail.com> 1230883200 -0700
	data 29
	imported from back_2009_01_02deleteall
	M 644 inline file.rb
	data 12
	version two
	commit refs/heads/master
	mark :2
	committer Scott Chacon <schacon@geemail.com> 1231056000 -0700
	data 29
	imported from back_2009_01_04from :1
	deleteall
	M 644 inline file.rb
	data 14
	version three
	M 644 inline new.rb
	data 16
	new version one
	(...)

Om de importeerder uit te voeren, sluis (pipe) je deze uitvoer door `git fast-import` terwijl je in de Git directory staat waar je naar toe wilt importeren. Je kunt een nieuwe directory aanmaken en er dan `git init` in uitvoeren om een startpunt te maken, en dan kun je het script uitvoeren:

	$ git init
	Initialized empty Git repository in /opt/import_to/.git/
	$ ruby import.rb /opt/import_from | git fast-import
	git-fast-import statistics:
	---------------------------------------------------------------------
	Alloc'd objects:       5000
	Total objects:           18 (         1 duplicates                  )
	      blobs  :            7 (         1 duplicates          0 deltas)
	      trees  :            6 (         0 duplicates          1 deltas)
	      commits:            5 (         0 duplicates          0 deltas)
	      tags   :            0 (         0 duplicates          0 deltas)
	Total branches:           1 (         1 loads     )
	      marks:           1024 (         5 unique    )
	      atoms:              3
	Memory total:          2255 KiB
	       pools:          2098 KiB
	     objects:           156 KiB
	---------------------------------------------------------------------
	pack_report: getpagesize()            =       4096
	pack_report: core.packedGitWindowSize =   33554432
	pack_report: core.packedGitLimit      =  268435456
	pack_report: pack_used_ctr            =          9
	pack_report: pack_mmap_calls          =          5
	pack_report: pack_open_windows        =          1 /          1
	pack_report: pack_mapped              =       1356 /       1356
	---------------------------------------------------------------------

Zoals je kunt zien geeft het je een berg statistieken over wat het heeft bereikt, als het succesvol heeft kunnen afronden. In dit geval heb je in totaal 18 objecten geïmporteerd, voor 5 commits naar 1 branch. Nu kun je `git log` uitvoeren en je nieuwe historie zien:

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

Hier heb je 't, een mooie, schone Git repository. Het is belangrijk om te op te merken dat nog niks uitgecheckt is, je hebt om te beginnen geen bestanden in je werkdirectory. Om ze te krijgen moet je de branch resetten tot het punt waar `master` nu is:

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

Je kunt nog veel meer doen met het `fast-import` tool: verschillende bestandsmodi verwerken, binaire gegevens, meerdere branches en mergen, tags, voortgangsindicatoren, enzovoorts. Een aantal voorbeelden voor complexe scenario's zijn voorhanden in de `contrib/fast-import` directory van de Git broncode, een van de betere is het `git-p4` script dat ik zojuist behandeld heb.
