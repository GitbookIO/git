# Příklad standardů kontrolovaných systémem Git

V této části použijeme to, co jsme se naučili o vytváření pracovního postupu v systému Git. Systém může kontrolovat formát uživatelovy zprávy k revizi, dovolit pouze aktualizace „rychle vpřed“ a umožňovat změnu obsahu konkrétních podadresářů projektu pouze vybraným uživatelům. V této části vytvoříte skripty pro klienta, které vývojářům pomohou zjistit, zda budou jejich revize odmítnuty, a skripty na server, které si specifikované požadavky přímo vynutí.

Já jsem k napsání skriptů použil Ruby, zaprvé proto, že je to můj oblíbený skriptovací jazyk, zadruhé proto, že ho považuji za skriptovací jazyk, který nejvíce vypadá jako pseudokód. Díky tomu byste měli kód bez problému rozluštit, i když Ruby nepoužíváte. Stejně dobře však pochodíte i s jakýmkoli jiným jazykem. Všechny vzorové skripty zásuvných modulů distribuované se systémem Git jsou buď ve skriptování Perl, nebo Bash. Podíváte-li se tyto vzorové skripty, budete mít i spoustu příkladů zásuvných modulů v těchto jazycích.

## Zásuvný modul na straně serveru

Veškerá práce na straně serveru bude uložena do souboru update v adresáři hooks. Soubor update bude spuštěn jednou na každou odesílanou větev a jako parametr použije referenci, do níž se odesílá, starou revizi, kde byla tato větev umístěna, a novou, odesílanou revizi. Pokud jsou revize odesílány prostřednictvím SSH, budete mít přístup také k uživateli, který data odesílá. Pokud jste všem povolili připojení s jedním uživatelem (např. „git“) na základě ověření veřejného klíče, možná budete muset poskytnout těmto uživatelům shellový wrapper, který určuje, který uživatel se připojuje na základě veřejného klíče, a nastavit proměnnou prostředí, jež tyto uživatele stanoví. V tomto okamžiku předpokládám, že je připojující se uživatel v proměnné prostředí `$USER`, a skript update tak začne shromažďovat všechny potřebné informace:

	#!/usr/bin/env ruby

	$refname = ARGV[0]
	$oldrev  = ARGV[1]
	$newrev  = ARGV[2]
	$user    = ENV['USER']

	puts "Enforcing Policies... \n(#{$refname}) (#{$oldrev[0,6]}) (#{$newrev[0,6]})"

Ano, je to tak, používám globální proměnné. Ale neodsuzujte mne – náš příklad díky tomu bude názornější.

### Standardizovaná zpráva k revizi

Vaším prvním úkolem bude zajistit, aby všechny zprávy k revizím splňovaly předepsaný formát. Abychom si stanovili nějaký cíl, řekněme, že každá zpráva musí obsahovat řetězec ve tvaru „ref: 1234“, protože potřebujete, aby se každá revize vztahovala k jedné pracovní položce vašeho tiketovacího systému. Každou odesílanou revizi si musíte prohlédnout, zjistit, zda zpráva k revizi obsahuje daný řetězec, a pokud v některé z nich chybí, vrátit nenulovou hodnotu, čímž odesílanou revizi odmítnete.

Vezmete-li hodnoty `$newrev` a `$oldrev` a zadáte je k nízkoúrovňovému příkazu `git rev-list`, získáte seznam hodnot SHA-1 všech odesílaných revizí. Tento příkaz má v podstatě stejnou funkci jako `git log`, jeho výstupem jsou ale pouze hodnoty SHA-1 bez dalších informací. Pokud tedy chcete získat seznam všech hodnot SHA revizí provedených mezi dvěma konkrétními revizemi, můžete spustit zhruba toto:

	$ git rev-list 538c33..d14fc7
	d14fc7c847ab946ec39590d87783c69b031bdfb7
	9f585da4401b0a3999e84113824d15245c13f0be
	234071a1be950e2a8d078e6141f5cd20c1e61ad3
	dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
	17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

Tento výstup můžete vzít, projít všechny hodnoty SHA jednotlivých revizí, vzít jejich zprávy a otestovat je proti regulárnímu výrazu, který vyhledává vzor.

Budete muset najít postup, jak získat zprávy všech těchto revizí, které mají být otestovány. Chcete-li získat syrová data revizí, můžete použít další nízkoúrovňový příkaz: `git cat-file`. Všem těmto nízkoúrovňovým příkazům se budu podrobněji věnovat v kapitole 9. Pro tuto chvíli se jen podívejme, co příkazem získáme:

	$ git cat-file commit ca82a6
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Jednoduchým způsobem, jak z revize, k níž máte hodnotu SHA-1, extrahovat její zprávu, je přejít k prvnímu prázdnému řádku a vzít vše, co následuje za ním. V systémech Unix to lze provést příkazem `sed`:

	$ git cat-file commit ca82a6 | sed '1,/^$/d'
	changed the version number

Tento výraz můžete použít k extrakci zpráv ze všech odesílaných revizí a skript ukončit, jestliže najdete něco, co neodpovídá požadavkům. Chcete-li skript ukončit a odesílaná data odmítnout, návratová hodnota musí být nenulová. Celá metoda vypadá takto:

	$regex = /\[ref: (\d+)\]/

	# enforced custom commit message format
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

Pokud toto vložíte do skriptu `update`, budou odmítnuty všechny aktualizace s revizemi, které mají zprávu neodpovídající zadanému pravidlu.

### Systém ACL podle uživatelů

Předpokládejme, že chcete přidat mechanismus, který bude používat seznam oprávnění ACL (access control list), v němž bude stanoveno, kteří uživatelé smějí do které části vašeho projektu odesílat změny. Někteří uživatelé budou mít plný přístup, jiní budou mít přístup jen do některých podadresářů nebo ke konkrétním souborům. Základ tohoto systému bude představovat soubor `acl`, který bude uložen v adresáři repozitáře na serveru a do nějž zapíšete všechna příslušná pravidla. Zásuvný modul `update` se podívá na tato pravidla, zjistí, jaké soubory byly ve všech odesílaných revizích doručeny, a určí, zda má odesílatel oprávnění aktualizovat všechny tyto soubory.

Prvním krokem, který budete muset udělat, je vytvoření seznamu ACL. Tady budete používat formát velmi podobný mechanismu CVS ACL. Využívá posloupnosti řádků, kdy v prvním poli stojí `avail` nebo `unavail`, v dalším poli je čárkami oddělený seznam uživatelů, jichž se pravidlo týká, a v posledním poli je uvedeno umístění, na něž se pravidlo vztahuje (prázdné pole označuje otevřený přístup). Všechna tato pole jsou oddělena svislicí (`|`).

V našem příkladu máte několik správců, několik tvůrců dokumentace s přístupem do adresáře `doc` a jednoho vývojáře, který má jako jediný přístup do adresářů `lib` a `tests`. Soubor ACL proto bude vypadat následovně:

	avail|nickh,pjhyett,defunkt,tpw
	avail|usinclair,cdickens,ebronte|doc
	avail|schacon|lib
	avail|schacon|tests

Začnete načtením těchto dat do struktury, kterou můžete použít. Abychom příklad nekomplikovali, budete vyžadovat pouze direktivy `avail` (využít). Používá se tu metoda asociativních polí, kdy klíč představuje jméno uživatele a hodnotu tvoří sada umístění, k nimž má uživatel oprávnění pro zápis:

	def get_acl_access_data(acl_file)
	  # read in ACL data
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

V kombinaci se souborem ACL, který jsme si ukázali před chvílí, poskytne tato metoda `get_acl_access_data` datovou strukturu v této podobě:

	{"defunkt"=>[nil],
	 "tpw"=>[nil],
	 "nickh"=>[nil],
	 "pjhyett"=>[nil],
	 "schacon"=>["lib", "tests"],
	 "cdickens"=>["doc"],
	 "usinclair"=>["doc"],
	 "ebronte"=>["doc"]}

Nyní, když jste uspořádali příslušná oprávnění, zbývá zjistit, která umístění odesílané revize změnily, abyste měli jistotu, že k nim ke všem má odesílající uživatel přístup.

Zjistit, které soubory byly v jedné revizi změněny, lze velmi snadno pomocí příkazu `git log` s parametrem `--name-only` (stručně popsáno v kapitole 2):

	$ git log -1 --name-only --pretty=format:'' 9f585d

	README
	lib/test.rb

Jestliže používáte strukturu ACL získanou metodou `get_acl_access_data` a kontrolujete ji proti seznamu souborů v každé revizi, můžete určit, zda bude mít uživatel oprávnění odesílat všechny své revize:

	# only allows certain users to modify certain subdirectories in a project
	def check_directory_perms
	  access = get_acl_access_data('acl')

	  # see if anyone is trying to push something they can't
	  new_commits = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")
	  new_commits.each do |rev|
	    files_modified = `git log -1 --name-only --pretty=format:'' #{rev}`.split("\n")
	    files_modified.each do |path|
	      next if path.size == 0
	      has_file_access = false
	      access[$user].each do |access_path|
	        if !access_path || # user has access to everything
	          (path.index(access_path) == 0) # access to this path
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

Většina uvedeného by měla být jasná. Příkazem `git rev-list` získáte výpis nových revizí odesílaných na váš server. U každé z revizí uvidíte také soubory, které byly změněny, a budete se moci přesvědčit, zda má odesílající uživatel přístup ke všem umístěním, která svými daty mění. Snad jediným specifickým Ruby výrazem, který nemusí být jasný, je `path.index(access_path) == 0`, který je pravdivý, pokud kontrolovaná cesta začíná řetězcem `access_path` (cesta oprávnění) – díky tomu nepovoluje cesta v `access_path` jen konkrétní místo na disku (soubor nebo adresář), ale také všechny soubory nebo adresáře, které začínají tímto řetězcem.

Vaši uživatelé tak už teď nebudou moci odesílat revize se zprávami v nepatřičném tvaru nebo se soubory změněnými mimo umístění jim vyhrazená.

### Pouze „rychle vpřed“

Poslední věcí, která nám ještě zbývá, je povolit pouze odeslání směřující „rychle vpřed“ (fast forward). Ve verzi 1.6 systému Git a novějších lze nastavit možnosti `receive.denyDeletes` a `receive.denyNonFastForwards`. Pokud však totéž nastavíte pomocí zásuvného modulu, pochodíte i ve starších verzích systému Git a navíc ho můžete nastavit pouze pro konkrétní uživatele nebo na cokoli jiného, s čím se kdy setkáte.

Kontrolu můžete provést tak, že se podíváte, zda jsou některé revize dostupné ze starších verzí, ale nejsou dostupné z novějších. Pokud žádná taková revize neexistuje, směřovalo odeslání rychle vpřed. V opačném případě můžete odeslané revize odmítnout:

	# enforces fast-forward only pushes
	def check_fast_forward
	  missed_refs = `git rev-list #{$newrev}..#{$oldrev}`
	  missed_ref_count = missed_refs.split("\n").size
	  if missed_ref_count > 0
	    puts "[POLICY] Cannot push a non fast-forward reference"
	    exit 1
	  end
	end

	check_fast_forward

Nyní je vše nastaveno. Spustíte-li příkaz `chmod u+x .git/hooks/update`, což je soubor, do nějž byste měli celý tento kód vložit a poté zkusit odeslat referenci, která nesměřuje rychle vpřed, dostanete následující výstup:

	$ git push -f origin master
	Counting objects: 5, done.
	Compressing objects: 100% (3/3), done.
	Writing objects: 100% (3/3), 323 bytes, done.
	Total 3 (delta 1), reused 0 (delta 0)
	Unpacking objects: 100% (3/3), done.
	Enforcing Policies...
	(refs/heads/master) (8338c5) (c5b616)
	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master
	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Výstup obsahuje řadu zajímavých informací. Zaprvé si všimněte místa, kde byl spuštěn zásuvný modul.

	Enforcing Policies...
	(refs/heads/master) (8338c5) (c5b616)

Všimněte si, že toto bylo posláno na standardní výstup „stdout“ na samém začátku skriptu update. Měli bychom také upozornit, že všechno, co váš skript vypíše do standardního výstupu stdout, bude přeneseno také klientovi.

Další věcí, jíž si všimnete, je chybové hlášení.

	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master

První řádek jste vytvořili vy, dalšími dvěma řádky vám Git sděluje, že je výstup skriptu update nenulový, a proto bude odeslání odmítnuto. A na konci stojí následující:

	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

Pro každou referenci, kterou váš zásuvný modul odmítne, se zobrazí jedna zpráva o odmítnutí vzdálené reference. Ze zprávy vyčtete, že byla reference odmítnuta kvůli chybě zásuvného modulu.

Pokud navíc není ukazatel reference v některé z vašich revizí, zobrazí se chybové hlášení, které jste pro tento účel určili.

	[POLICY] Your message is not formatted correctly

Nebo pokud se někdo pokusí upravit soubor, k němuž nemá přístup, a odešle revizi, jejíž součástí bude tento soubor, zobrazí se podobná zpráva. Pokud se například autor dokumentace pokusí odeslat revizi, která mění obsah adresáře `lib`, zobrazí se mu upozornění:

	[POLICY] You do not have access to push to lib/test.rb

A to je vše. Od této chvíle budete mít k dispozici skript `update` ve spustitelné podobě, váš repozitář nikdy nebude převinut zpět a nikdy nepřijme zprávu k revizi, která by neodpovídala předepsanému vzoru. Uživatelé se navíc budou moci pohybovat jen ve vymezeném prostoru.

## Zásuvné moduly na straně klienta

Nevýhodou uvedeného postupu jsou nářky vašich uživatelů, které vás nevyhnutelně čekají jako výsledek odmítnutí jejich revizí. Odmítnete-li na poslední chvíli práci, na níž si dávali záležet, budou vaši uživatelé zmatení a otrávení, nemluvě o tom, že budou muset kvůli opravě měnit svou historii, což může bázlivější povahy odradit.

Problém vám mohou pomoci vyřešit zásuvné moduly na straně klienta. Poskytněte je svým uživatelům a ti budou upozorněni pokaždé, až provedou něco, co by server s největší pravděpodobností odmítl. Všechny problémy tak budou moci opravit, dokud to ještě není příliš složité a dokud je nezapsali do revize. Jelikož se zásuvné moduly při naklonování projektu nekopírují, musíte tyto skripty distribuovat jinak a uživatelům zadat instrukce, aby je zkopírovali do svého adresáře `.git/hooks` a zajistili, že budou spustitelné. Zásuvné moduly můžete distribuovat v rámci projektu nebo v samostatném projektu, nelze je však nastavit automaticky.

Pro začátek byste měli zkontrolovat zprávy k revizi, než tyto revize nahrajete, abyste měli jistotu, že server vaše změny neodmítne jen kvůli zprávám v nesprávném formátu. K tomuto účelu můžete použít zásuvný modul `commit-msg`. Necháte-li zásuvný modul přečíst zprávu k revizi ze souboru, který zadáte jako první parametr, a srovnat se vzorem, můžete systému Git uložit, aby odmítl revize, které vzoru neodpovídají:

	#!/usr/bin/env ruby
	message_file = ARGV[0]
	message = File.read(message_file)

	$regex = /\[ref: (\d+)\]/

	if !$regex.match(message)
	  puts "[POLICY] Your message is not formatted correctly"
	  exit 1
	end

Je-li skript na svém místě (`.git/hooks/commit-msg`) a je spustitelný, pak v případě, že zapíšete revizi se zprávou v nedovoleném formátu, zobrazí se následující:

	$ git commit -am 'test'
	[POLICY] Your message is not formatted correctly

V takovém případě nebyla zapsána žádná revize. Pokud však zpráva obsahuje správný vzor, Git vám umožní revizi zapsat:

	$ git commit -am 'test [ref: 132]'
	[master e05c914] test [ref: 132]
	 1 files changed, 1 insertions(+), 0 deletions(-)

Dále se budete chtít ujistit, že neměníte soubory, jejichž úpravu vám zakazuje seznam ACL. Pokud adresář `.git` vašeho projektu obsahuje kopii souboru ACL, který jsme používali naposledy, příslušná omezení přístupu pro vás ohlídá tento skript `pre-commit`:

	#!/usr/bin/env ruby

	$user    = ENV['USER']

	# [ insert acl_access_data method from above ]

	# only allows certain users to modify certain subdirectories in a project
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

Jedná se o přibližně stejný skript, jaký funguje na serveru, avšak se dvěma podstatnými rozdíly. Zaprvé je soubor ACL na jiném místě, protože se tento skript spouští z vašeho pracovního adresáře, a ne z adresáře Git. Cestu k souboru ACL budete muset změnit z

	access = get_acl_access_data('acl')

na:

	access = get_acl_access_data('.git/acl')

Druhým důležitým rozdílem je způsob, jak se zobrazí seznam změněných souborů. Protože serverová metoda využívá záznam revizí, ale ve vašem případě ještě nebyla revize zaznamenána, musí být seznam souborů pořízen na základě oblasti připravených změn. Místo

	files_modified = `git log -1 --name-only --pretty=format:'' #{ref}`

budete muset použít:

	files_modified = `git diff-index --cached --name-only HEAD`

Toto jsou však jediné dvě změny, v ostatních ohledech pracuje skript stejně. Je však třeba upozornit, že skript očekává, že lokálně pracujete v roli stejného uživatele jako odesíláte data na vzdálený server. Pokud nejsou uživatelé stejní, budete muset ručně nastavit proměnnou `$user`.

Posledním krokem, který budete muset provést, je ověření, že nebudete odesílat reference nesměřující rychle vpřed. Tento krok však už není tak jednoduchý. Chcete-li vyhledat reference nesměřující rychle vpřed, budete muset buď provést přeskládání po revizi, kterou jste již odeslali, nebo se do stejné vzdálené větve pokusit odeslat jinou lokální větev.

Vzhledem k tomu, že vám server sdělí, že nelze odesílat revize nesměřující rychle vpřed, a zásuvný modul neumožní odeslat revize nesplňující dané požadavky, je vaší poslední možností přeskládat revize, které jste již odeslali.

Jako příklad uvedeme skript pre-rebase, který bude toto pravidlo kontrolovat. Použije seznam všech revizí, které hodláte přepsat, a ověří, zda neexistují už v některé z vašich vzdálených referencí. Pokud najde revizi, která je dostupná z některé z vašich vzdálených referencí, proces přeskládání přeruší:

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
	    if shas_pushed.split("\n").include?(sha)
	      puts "[POLICY] Commit #{sha} has already been pushed to #{remote_ref}"
	      exit 1
	    end
	  end
	end

Tento skript používá syntaxi, které jsme se v části Výběr revize v kapitole 6 nevěnovali. Seznam revizí, které už byly odeslány, získáte takto:

	git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}

Syntaxe `SHA^@` se vztahuje na všechny rodiče této revize. Vyhledáváte všechny revize, které jsou dostupné z poslední revize na vzdáleném serveru a nejsou dostupné z žádného rodiče jakékoli hodnoty SHA, kterou se pokoušíte odeslat. Tímto způsobem lze označit odeslání „rychle vpřed“.

Největší nevýhodou tohoto postupu je, že může být velmi pomalý a není vždy nutný. Pokud se nesnažíte vynutit si odeslání parametrem `-f`, server vás sám upozorní a odesílané revize nepřijme. Skript je však zajímavým cvičením a teoreticky vám může pomoci předejít nutnosti vracet se v historii a přeskládávat revize kvůli opravě chyby.
