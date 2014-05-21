# Een voorbeeld van Git-afgedwongen beleid

In deze paragraaf ga je gebruiken wat je geleerd hebt om een Git workflow te maken, die controleert op een aangepast commit boodschap formaat, afdwingt om alleen fast-forward pushes te accepteren en alleen bepaalde gebruikers toestaat om bepaalde subdirectories te wijzigen in een project. Je zult client scripts maken die de ontwikkelaar helpen te ontdekken of hun push geweigerd zal worden en server scripts die het beleid afdwingen.

Ik heb Ruby gebruikt om ze te schrijven, zowel omdat het mijn voorkeur script taal is, als omdat ik vind dat het de meest pseudo code uitziende taal is van de scripttalen; dus je zou in staat moeten zijn om de code redelijk te kunnen volgen zelfs als je geen Ruby gebruikt. Maar elke taal zou prima werken. Alle voorbeeld hook scripts die met Git meegeleverd worden zijn Perl of Bash scripts, dus je kunt ook genoeg voorbeelden van hooks in die talen vinden door naar die bestanden te kijken.

## Server-kant hook

Al het werk aan de server kant zal in het update bestand in je hooks directory gaan zitten. Het update bestand zal eens per gepushte branch uitgevoerd worden en accepteert de referentie waarnaar gepusht wordt, de oude revisie waar die branch was en de nieuwe gepushte revisie. Je hebt ook toegang tot de gebruiker die de push doet als de push via SSH gedaan wordt. Als je iedereen hebt toegestaan om connectie te maken als één gebruiker (zoals "git") via publieke sleutel authenticatie, dan moet je wellicht die gebruiker een shell wrapper geven die bepaalt welke gebruiker er connectie maakt op basis van de publieke sleutel, en dan een omgevingsvariabele instellen waarin die gebruiker wordt gespecificeerd. Ik ga er vanuit dat de gebruiker in de `$USER` omgevingsvariabele staat, dus begint je update script met het verzamelen van alle gegevens die het nodig heeft:

	#!/usr/bin/env ruby

	$refname = ARGV[0]
	$oldrev  = ARGV[1]
	$newrev  = ARGV[2]
	$user    = ENV['USER']

	puts "Enforcing Policies... \n(#{$refname}) (#{$oldrev[0,6]}) (#{$newrev[0,6]})"

Ja, ik gebruik globale variabelen. Schiet me niet af – het is makkelijker om het op deze manier te laten zien.

### Een specifiek commit-bericht formaat afdwingen

Je eerste uitdaging is afdwingen dat elke commit bericht moet voldoen aan een specifiek formaat. Laten we zeggen dat ieder bericht een stuk tekst moet bevatten dat eruit ziet als "ref: 1234", omdat je wilt dat iedere commit gekoppeld is aan een werkonderdeel in je ticket systeem. Je moet dus kijken naar iedere commit die gepusht wordt, zien of die tekst in de commit boodschap zit en als de tekst in één van de commits ontbreekt, met niet nul eindigen zodat de push geweigerd wordt.

Je kunt de lijst met alle SHA-1 waarden van alle commits die gepusht worden verkrijgen door de `$newrev` en `$oldrev` waarden te pakken en ze aan een Git plumbing commando genaamd `git rev-list` te geven. Dit is min of meer het `git log` commando, maar standaard voert het alleen de SHA-1 waarden uit en geen andere informatie. Dus, om een lijst te krijgen van alle commit SHA's die worden geïntroduceerd tussen één commit SHA en een andere, kun je zoiets als dit uitvoeren:

	$ git rev-list 538c33..d14fc7
	d14fc7c847ab946ec39590d87783c69b031bdfb7
	9f585da4401b0a3999e84113824d15245c13f0be
	234071a1be950e2a8d078e6141f5cd20c1e61ad3
	dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
	17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

Je kunt die uitvoer pakken, door elk van die commit SHA's heen lopen, de boodschap daarvan pakken en die boodschap testen tegen een reguliere expressie die op een bepaald patroon zoekt.

Je moet uit zien te vinden hoe je de commit boodschap kunt krijgen van alle te testen commits. Om de echte commit gegevens te krijgen, kun je een andere plumbing commando genaamd `git cat-file` gebruiken. Ik zal al plumbing commando's in detail behandelen in Hoofdstuk 9, maar voor nu is dit wat het commando je geeft:

	$ git cat-file commit ca82a6
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Een simpele manier om de commit boodschap uit een commit waarvan je de SHA-1 waarde hebt te krijgen, is naar de eerste lege regel gaan en alles wat daarna komt pakken. Je kunt dat doen met het `sed` commando op Unix systemen:

	$ git cat-file commit ca82a6 | sed '1,/^$/d'
	changed the version number

Je kunt die toverspreuk gebruiken om de commit boodschap te pakken van iedere commit die geprobeerd wordt te pushen en eindigen als je ziet dat er iets is wat niet past. Om het script te eindigen en de push te weigeren, eindig je met niet nul. De hele methode ziet er zo uit:

	$regex = /\[ref: (\d+)\]/

	# eigen commit bericht formaat afgedwongen
	def check_message_format
	  missed_revs = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  missed_revs.each do |rev|
	    message = `git cat-file commit #{rev} | sed '1,/^$/d'`
	    if !$regex.match(message)
	      puts "[POLICY] Your message is not formatted correctly"
	      exit 1
	    end
	  end
	end
	check_message_format

Door dat in je `update` script te stoppen, zullen updates geweigerd worden die commits bevatten met berichten die niet aan jouw beleid voldoen.

### Een gebruiker-gebaseerd ACL systeem afdwingen

Stel dat je een mechanisme wil toevoegen dat gebruik maakt van een toegangscontrole lijst (ACL) die specificeert welke gebruikers zijn toegestaan om wijzigingen te pushen naar bepaalde delen van je project. Sommige mensen hebben volledige toegang, en anderen hebben alleen toestemming om wijzigingen te pushen naar bepaalde subdirectories of specifieke bestanden. Om dit af te dwingen zul je die regels schrijven in een bestand genaamd `acl` dat in je bare Git repository op de server zit. Je zult de `update` hook naar die regels laten kijken, zien welke bestanden worden geïntroduceerd voor elke commit die gepusht wordt en bepalen of de gebruiker die de push doet toestemming heeft om al die bestanden te wijzigen.

Het eerste dat je zult doen is de ACL schrijven. Hier zul je een formaat gebruiken wat erg lijkt op het CVS ACL mechanisme: het gebruikt een serie regels, waarbij het eerste veld `avail` of `unavail` is, het volgende veld een komma gescheiden lijst van de gebruikers is waarvoor de regel geldt en het laatste veld het pad is waarvoor deze regel geldt (leeg betekent open toegang). Alle velden worden gescheiden door een pipe (`|`) karakter.

In dit geval heb je een aantal beheerders, een aantal documentatie schrijvers met toegang tot de `doc` map, en één ontwikkelaar die alleen toegang heeft tot de `lib` en `test` mappen, en je ACL bestand ziet er zo uit:

	avail|nickh,pjhyett,defunkt,tpw
	avail|usinclair,cdickens,ebronte|doc
	avail|schacon|lib
	avail|schacon|tests

Je begint met deze gegevens in een structuur in te lezen die je kunt gebruiken. In dit geval, om het voorbeeld eenvoudig te houden, zul je alleen de `avail` richtlijnen handhaven. Hier is een methode die je een associatieve array teruggeeft, waarbij de sleutel de gebruikersnaam is en de waarde een array van paden waar die gebruiker toegang tot heeft:

	def get_acl_access_data(acl_file)
	  # lees ACL gegevens
	  acl_file = File.read(acl_file).split("\n").reject { |line| line == '' }
	  access = {}
	  acl_file.each do |line|
	    avail, users, path = line.split('|')
	    next unless avail == 'avail'
	    users.split(',').each do |user|
	      access[user] ||= []
	      access[user] << path
	    end
	  end
	  access
	end

Gegeven het ACL bestand dat je eerder bekeken hebt, zal deze `get_acl_access_data` methode een gegevensstructuur opleveren die er als volgt uit ziet:

	{"defunkt"=>[nil],
	 "tpw"=>[nil],
	 "nickh"=>[nil],
	 "pjhyett"=>[nil],
	 "schacon"=>["lib", "tests"],
	 "cdickens"=>["doc"],
	 "usinclair"=>["doc"],
	 "ebronte"=>["doc"]}

Nu je de rechten bepaald hebt, moet je bepalen welke paden de commits die gepusht worden hebben aangepast, zodat je kunt controleren dat de gebruiker die de push doet daar ook toegang tot heeft.

Je kunt eenvoudig zien welke bestanden gewijzigd zijn in een enkele commit met de `--name-only` optie op het `git log` commando (kort besproken in Hoofdstuk 2):

	$ git log -1 --name-only --pretty=format:'' 9f585d

	README
	lib/test.rb

Als je gebruik maakt van de ACL structuur die wordt teruggegeven door de `get_acl_access_data` methode en dat gebruikt met de bestanden in elk van de commits, dan kun je bepalen of de gebruiker toegang heeft om al hun commits te pushen:

	# staat alleen bepaalde gebruikers toe om bepaalde subdirectories in een project te wijzigen
	def check_directory_perms
	  access = get_acl_access_data('acl')

	  # kijk of iemand iets probeert te pushen waar ze niet bij mogen komen
	  new_commits = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  new_commits.each do |rev|
	    files_modified = `git log -1 --name-only --pretty=format:'' #{rev}`.split("\n")
	    files_modified.each do |path|
	      next if path.size == 0
	      has_file_access = false
	      access[$user].each do |access_path|
	        if !access_path || # gebruiker heeft overal toegang tot
	          (path.index(access_path) == 0) # toegang tot dit pad
	          has_file_access = true
	        end
	      end
	      if !has_file_access
	        puts "[POLICY] You do not have access to push to #{path}"
	        exit 1
	      end
	    end
	  end
	end

	check_directory_perms

Het meeste hiervan zou makkelijk te volgen moeten zijn. Je krijgt een lijst met commits die gepusht worden naar je server met `git rev-list`. Daarna vind je, voor iedere commit, de bestanden die aangepast worden en stelt vast of de gebruiker die pusht toegang heeft tot alle paden die worden aangepast. Een Ruby-isme dat wellicht niet duidelijk is, is `path.index(access_path) == 0`, wat waar is als het pad begint met `access_path` – dit zorgt ervoor dat `access_path` niet slechts in één van de toegestane paden zit, maar dat het voorkomt in alle toegestane paden.

Nu kunnen je gebruikers geen commits pushen met slecht vormgegeven berichten of met aangepaste bestanden buiten hun toegewezen paden.

### Fast-forward-only pushes afdwingen

Het laatste om af te dwingen is fast-forward-only pushes. Om dit te regelen, kan je simpelweg de `receive.denyDeletes` en `receive.denyNonFastForwards` instellingen aanpassen. Maar dit afdwingen met behulp van een hook werkt ook, en je kunt het aanpassen zodat het alleen gebeurt bij bepaalde gebruikers of om elke reden die je later bedenkt.

De logica om dit te controleren, is te kijken of er een commit is die bereikbaar is vanuit de oudere revisie, maar niet bereikbaar is vanuit de nieuwere. Als er geen zijn dan was het een fast-forward push, anders weiger je het:

	# dwingt fast-forward-only pushes af
	def check_fast_forward
	  missed_refs = `git rev-list #{$newrev}..#{$oldrev}`
	  missed_ref_count = missed_refs.split("\n").size
	  if missed_ref_count > 0
	    puts "[POLICY] Cannot push a non fast-forward reference"
	    exit 1
	  end
	end

	check_fast_forward

Alles is ingesteld. Als je `chmod u+x .git/hooks/update` uitvoert, wat het bestand is waarin je al deze code gestopt hebt, en dan probeert een non-fast-forwarded referentie te pushen krijg je zoiets als dit:


	$ git push -f origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 323 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	Unpacking objects: 100% (3/3), done.
	Enforcing Policies...
	(refs/heads/master) (8338c5) (c5b616)
	[POLICY] Cannot push a non-fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master
	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Er zijn hier een aantal interessante dingen. Ten eerste, zie je dit als de hook start met uitvoeren.

	Enforcing Policies...
	(refs/heads/master) (fb8c72) (c56860)

Merk op dat je dat afgedrukt hebt naar stdout aan het begin van je update script. Het is belangrijk om te zien dat alles dat je script naar stdout uitvoert, naar de client overgebracht wordt.

Het volgende dat je op zal vallen is de foutmelding.

	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master

De eerste regel was door jou afgedrukt, de andere twee komen van Git die je vertelt dat het update script met niet nul geëindigd is en dat die degene is die je push weigerde. Tot slot heb je dit:

	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Je zult een remote afwijs bericht zien voor elke referentie die door de hook wordt geweigerd, en het vertelt je dat het specifiek was geweigerd wegens een hook fout.

Daarnaast zal je een foutmelding zien als in één van je commits de referentie markering ontbreekt.

	[POLICY] Your message is not formatted correctly

Of als iemand een bestand probeert aan te passen waar ze geen toegang tot hebben en een commit proberen te pushen waar het in zit, dan zullen ze iets vergelijkbaars zien. Bijvoorbeeld, als een documentatie schrijver een commit probeert te pushen dat iets wijzigt dat in de `lib` map zit, dan zien ze

	[POLICY] You do not have access to push to lib/test.rb

Dat is alles. Vanaf nu, zolang als het `update` script aanwezig en uitvoerbaar is, zal je repository nooit teruggedraaid worden en zal nooit een commit bericht bevatten waar het patroon niet in zit, en je gebruikers zullen in hun bewegingsruimte beperkt zijn.

## Hooks aan de client-kant

Het nadeel van deze aanpak is het zeuren dat geheid zal beginnen zodra de commits van je gebruikers geweigerd worden. Het feit dat hun zorgzaam vervaardigde werk op het laatste moment pas geweigerd wordt kan enorm frustrerend en verwarrend zijn en daarnaast zullen ze hun geschiedenis moeten aanpassen om het te corrigeren, wat niet altijd geschikt is voor de wat zwakkeren van hart.

Het antwoord op dit dilemma is een aantal client-kant hooks te leveren, die gebruikers kunnen gebruiken om hen te waarschuwen dat ze iets doen dat de server waarschijnlijk gaat weigeren. Op die manier kunnen ze alle problemen corrigeren voordat ze gaan committen en voordat die problemen lastiger te herstellen zijn. Omdat haken niet overgebracht worden bij het klonen van een project, moet je deze scripts op een andere manier distribueren en je gebruikers ze in hun `.git/hooks` map laten zetten en ze uitvoerbaar maken. Je kunt deze hooks in je project of in een apart project distribueren, maar er is geen manier om ze automatisch in te laten stellen.

Om te beginnen zou je de commit boodschap moeten controleren vlak voordat iedere commit opgeslagen wordt, zodat je weet dat de server je wijzigingen niet gaat weigeren omdat de commit boodschap een verkeerd formaat heeft. Om dit te doen, kun je de `commit-msg` hook toevoegen. Als je dat de commit boodschap laat lezen uit het bestand dat als eerste argument opgegeven wordt, en dat vergelijkt met het patroon dan kun je Git dwingen om de commit af te breken als het niet juist is:

	#!/usr/bin/env ruby
	message_file = ARGV[0]
	message = File.read(message_file)

	$regex = /\[ref: (\d+)\]/

	if !$regex.match(message)
	  puts "[POLICY] Your message is not formatted correctly"
	  exit 1
	end

Als dat script op z'n plaats staat (in `.git/hooks/commit-msg`), uitvoerbaar is en je commit met een verkeerd geformateerd bericht, dan zie je dit:

	$ git commit -am 'test'
	[POLICY] Your message is not formatted correctly

In dat geval is er geen commit gedaan. Maar als je bericht het juiste patroon bevat, dan staat Git je toe te committen:

	$ git commit -am 'test [ref: 132]'
	[master e05c914] test [ref: 132]
	 1 files changed, 1 insertions(+), 0 deletions(-)

Vervolgens wil je er zeker van zijn dat je geen bestanden buiten je ACL scope aanpast. Als de `.git` directory van je project een kopie van het ACL bestand bevat dat je eerder gebruikte, dan zal het volgende `pre-commit` script die beperkingen voor je controleren:

	#!/usr/bin/env ruby

	$user    = ENV['USER']

	# [ insert acl_access_data method from above ]

	# staat alleen bepaalde gebruikers toe bepaalde mappen aan te passen
	def check_directory_perms
	  access = get_acl_access_data('.git/acl')

	  files_modified = `git diff-index --cached --name-only HEAD`.split("\n")
	  files_modified.each do |path|
	    next if path.size == 0
	    has_file_access = false
	    access[$user].each do |access_path|
	    if !access_path || (path.index(access_path) == 0)
	      has_file_access = true
	    end
	    if !has_file_access
	      puts "[POLICY] You do not have access to push to #{path}"
	      exit 1
	    end
	  end
	end

	check_directory_perms

Dit is grofweg hetzelfde script als aan de server kant, maar met twee belangrijke verschillen. Als eerste staat het ACL bestand op een andere plek, omdat dit script vanuit je werkdirectory draait, en niet vanuit je Git directory. Je moet het pad naar het ACL bestand wijzigen van dit

	access = get_acl_access_data('acl')

naar dit:

	access = get_acl_access_data('.git/acl')

Het andere belangrijke verschil is de manier waarop je een lijst krijgt met bestanden die gewijzigd is. Omdat de server kant methode naar de log van commits kijkt en nu je commit nog niet opgeslagen is, moet je de bestandslijst in plaats daarvan uit het staging area halen. In plaats van

	files_modified = `git log -1 --name-only --pretty=format:'' #{ref}`

moet je dit gebruiken

	files_modified = `git diff-index --cached --name-only HEAD`

Maar dat zijn de enige twee verschillen - verder werkt het script op dezelfde manier. Een aandachtspunt is dat het van je verlangt dat je lokaal werkt als dezelfde gebruiker die pusht naar de remote machine. Als dat anders is, moet je de `$user` variabele handmatig instellen.

Het laatste wat je moet doen is het controleren dat je niet probeert non-fast-forward referenties te pushen, maar dat komt minder voor. Om een referentie te krijgen dat non-fast-forward is, moet je voorbij een commit rebasen die je al gepusht hebt, of een andere lokale branch naar dezelfde remote branch proberen te pushen.

Omdat de server je zal vertellen dat je geen non-fast-forward push kunt doen, en de hook de push tegenhoudt, is het enige ding wat je kunt proberen af te vangen het abusievelijk rebasen van commits die je al gepusht hebt.

Hier is een voorbeeld pre-rebase script dat daarop controleert. Het haalt een lijst met alle commits die je op het punt staat te herschrijven, en controleert of ze al ergens bestaan in één van je remote referenties. Als het er een ziet die bereikbaar is vanuit een van je remote referenties, dan stopt het de rebase:

	#!/usr/bin/env ruby

	base_branch = ARGV[0]
	if ARGV[1]
	  topic_branch = ARGV[1]
	else
	  topic_branch = "HEAD"
	end

	target_shas = `git rev-list #{base_branch}..#{topic_branch}`.split("\n")
	remote_refs = `git branch -r`.split("\n").map { |r| r.strip }

	target_shas.each do |sha|
	  remote_refs.each do |remote_ref|
	    shas_pushed = `git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}`
	    if shas_pushed.split(“\n”).include?(sha)
	      puts "[POLICY] Commit #{sha} has already been pushed to #{remote_ref}"
	      exit 1
	    end
	  end
	end

Dit script gebruikt een syntax dat niet behandeld is in de Revisie Selectie paragraaf van Hoofdstuk 6. Je krijgt een lijst van commits die al gepusht zijn door dit uit te voeren:

	git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}

De `SHA^@` syntax wordt vervangen door alle ouders van die commit. Je bent op zoek naar een commit die bereikbaar is vanuit de laatste commit op de remote en die niet bereikbaar is vanuit enige ouder van alle SHA's die je probeert te pushen – wat betekent dat het een fast-forward is.

Het grote nadeel van deze aanpak is dat het erg traag kan zijn en vaak onnodig is, als je de push niet probeert te forceren met de `-f` optie, dan zal de server je al waarschuwen en de push niet accepteren. Maar, het is een aardige oefening en kan je in theorie helpen om een rebase te voorkomen die je later zult moeten herstellen.
