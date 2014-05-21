# Git haken (hooks)

Zoals vele andere Versie Beheer Systemen, heeft Git een manier om eigengemaakte scripts aan te roepen wanneer bepaalde belangrijke acties plaatsvinden. Er zijn twee groepen van dit soort hooks: aan de client kant en aan de server kant. De hooks aan de client kant zijn voor client operaties zoals committen en mergen. De hooks voor de server kant zijn voor Git server operaties zoals het ontvangen van gepushte commits. Je kunt deze hooks om allerlei redenen gebruiken, en je zult hier over een aantal ervan kunnen lezen.

## Een hook installeren

De hooks zijn allemaal opgeslagen in de `hooks` subdirectory van de Git directory. In de meeste projecten is dat `.git/hooks`. Standaard voorziet Git deze map van een aantal voorbeeld scripts, waarvan de meeste op zich al bruikbaar zijn, maar ze documenteren ook de invoer waarden van elke script. Alle scripts zijn als shell script geschreven met hier en daar wat Perl, maar iedere executable met de juiste naam zal prima werken – je kunt ze in Ruby of Python of wat je wilt schrijven. De namen van de scripts eindigen op .sample; je zult ze van naam moeten veranderen.

Om een hook script aan te zetten, zet je een bestand met de juiste naam en dat uitvoerbaar is in de `hooks` subdirectory van je Git directory. Vanaf dat moment zou het aangeroepen moeten worden. Ik zal de meestgebruikte hook bestandsnamen hier behandelen.

## Hooks aan de client-kant

Er zijn veel hooks aan de client-kant. Deze paragraaf verdeelt ze in commit-workflow hooks, e-mail-workflow scripts, en de rest van de client-kant scripts

### Commit-workflow hooks

De eerste vier hooks hebben te maken met het commit proces. De `pre-commit` hook wordt eerst uitgevoerd, nog voor je een commit boodschap intypt. Het wordt gebruikt om het snapshot dat op het punt staat gecommit te worden te inspecteren, om te zien of je iets bent vergeten, om er zeker van te zijn dat tests uitgevoerd worden of om wat je maar wilt te onderzoeken in de code. Als deze hook met een exit-waarde anders dan nul eindigt breekt de commit af, alhoewel je dit kunt omzeilen met `git commit --no-verify`. Je kunt dingen doen als op code stijl controleren (door lint of iets dergelijks uit te voeren), op 'trailing whitespaces' te controleren (de standaard hook doet precies dat), of om de juiste documentatie op nieuwe methodes te controleren.

De `prepare-commit-msg` hook wordt uitgevoerd voordat de commit boodschap editor gestart wordt, maar nadat de standaard boodschap aangemaakt is. Het stelt je in staat om de standaard boodschap aan te passen voordat de commit auteur het ziet. Deze hook accepteert een aantal opties: het pad naar het bestand dat de huidige commit boodschap bevat, het type van de commit, en de SHA-1 van de commit als het een verbeterde (amended) commit betreft. Deze hook is voor normale commits niet zo bruikbaar, maar het is juist bruikbaar voor commits waarbij de standaard boodschap automatisch gegenereerd wordt, zoals sjabloon commit boodschappen, merge commits, gesquashte commits en amended commits. Je kan het samen met een commit sjabloon gebruiken om informatie programmatisch in te voegen.

De `commit-msg` hook accepteert één parameter, wat, nogmaals, het pad naar een tijdelijk bestand is dat de huidige commit boodschap bevat. Als dit script eindigt met een waarde anders dan nul, dan zal Git het commit proces afbreken, je kunt deze gebruiken om je project-status of de commit boodschap te valideren alvorens een commit toe te staan. In het laatste gedeelte van dit hoofdstuk, zal ik met deze hook demonstreren hoe te controleren dat de commit boodschap aan een bepaald patroon voldoet.

Nadat het hele commit proces afgerond is, zal de `post-commit` hook uitgevoerd worden. Het accepteert geen parameters, maar je kunt de laatste commit eenvoudig ophalen door `git log -1 HEAD` uit te voeren. Over het algemeen wordt dit script gebruikt om notificaties of iets dergelijks uit te sturen.

De commit-workflow scripts aan de client-kant kunnen gebruikt worden in vrijwel iedere workflow. Ze worden vaak gebruikt om een bepaald beleid af te dwingen, maar het is belangrijk om op te merken dat deze scripts niet overgedragen worden bij het clonen. Je kunt beleid afdwingen aan de server kant door pushes of commits te weigeren die niet voldoen aan een bepaald beleid, maar het is aan de ontwikkelaar om deze scripts aan de client kant te gebruiken. Dus, deze scripts zijn er om ontwikkelaars te helpen en ze moeten door hen ingesteld en onderhouden worden, alhoewel ze door hen op elk moment aangepast of omzeild kunnen worden.

### E-mail workflow hooks

Je kunt drie client-kant hooks instellen voor een e-mail gebaseerde workflow. Ze worden allemaal aangeroepen door het `git am` commando dus als je dat commando niet gebruikt in je workflow, dan kun je gerust doorgaan naar de volgende paragraaf. Als je patches aanneemt via e-mail die door `git format-patch` geprepareerd zijn, dan zullen sommige van deze scripts nuttig zijn voor je.

De eerste hook die uitgevoerd wordt is `applypatch-msg`. Het accepteert één enkel argument: de naam van het tijdelijke bestand dat de voorgedragen commit boodschap bevat. Git breekt de patch als dit script met een waarde ongelijk aan nul eindigt. Je kunt dit gebruiken om je ervan te verzekeren dat een commit boodschap juist geformatteerd is, of om de boodschap te normaliseren door het script de boodschap aan te laten passen.

De volgende hook die wordt uitgevoerd tijdens het toepassen van patches via `git am` is `pre-applypatch`. Dit neemt geen argumenten aan en wordt uitgevoerd nadat de patch is ge-applyed, zodat je het kunt gebruiken om het snapshot te inspecteren alvorens de commit te doen. Je kunt tests uitvoeren of de werkdirectory op een andere manier inspecteren met behulp van dit script. Als er iets mist of één van de tests faalt, dan zal eindigen met niet nul het `git am` script afbreken zonder de patch te committen.

De laatste hook die uitgevoerd wordt tijdens een `git am` operatie is de `post-applypatch`. Je kunt dat gebruiken om een groep te notificeren of de auteur van de patch die je zojuist gepulled hebt. Je kunt het patch proces niet stoppen met behulp van dit script.

### Andere client hooks

De `pre-rebase` hook wordt uitgevoerd voordat je ook maar iets rebased, en kan het proces afbreken door met een waarde anders dan nul te eindigen. Je kunt deze hook gebruiken om te voorkomen dat commits die al gepusht zijn gerebased worden. De voorbeeld `pre-rebase` hook die Git installeert doet dit, alhoewel deze er vanuit gaat dat "next" de naam is van de branch die je publiceert. Je zult dat waarschijnlijk moeten veranderen in de naam van je stabiele gepubliceerde branch.

Nadat je een succesvolle `git checkout` uitgevoerd hebt, wordt de `post-checkout` hook uitgevoerd; je kunt het gebruiken om je werkdirectory goed in te stellen voor je project omgeving. Dit kan het invoegen van grote binaire bestanden die je niet in versie beheer wil hebben inhouden, of het automatisch genereren van documentatie of iets in die geest.

Als laatste wordt de `post-merge` hook uitgevoerd na een succesvolle `merge` commando. Je kunt deze gebruiken om gegevens in de werkstructuur terug te zetten die Git niet kan ophalen, bijvoorbeeld permissie gegevens. Ook kan deze hook gebruikt worden om te valideren of bestanden, die buiten het beheer van Git liggen, in je werkstructuur zitten die je wellicht erin wilt kopiëren als de werk-tree wijzigt.

## Hooks aan de server-kant

Naast de hooks aan de client-kant, kun je als systeem beheerder ook een paar belangrijke hooks aan de server-kant gebruiken om vrijwel elk beleid op het project af te dwingen. Deze scripts worden voor en na de pushes op de server uitgevoerd. De pre hooks kunnen op elk gewenst moment met een getal anders dan nul eindigen om de push te weigeren en een foutmelding naar de client te sturen; je kunt een push beleid instellen dat zo complex is als je zelf wenst.

### pre-receive en post-receive

Het eerste script dat uitgevoerd wordt tijdens het afhandelen van een push van een client is `pre-receive`. Het leest een lijst van referenties die worden gepusht van stdin; als het eindigt met een andere waarde dan nul, worden ze geen van allen geaccepteerd. Je kunt deze hook gebruiken om dingen te doen als valideren dat geen van de vernieuwde referenties een non-fast-forward is, of om te controleren dat de gebruiker die de push uitvoert creatie, verwijder, of push toegang heeft, of toegang om wijzigingen te pushen voor alle bestanden die ze proberen aan te passen met de push.

De `post-receive` hook wordt uitgevoerd nadat het hele proces afgerond is, en het kan gebruikt worden om andere services te vernieuwen of gebruikers te notificeren. Het leest dezelfde stdin gegevens als de `pre-receive` hook. Voorbeelden zijn een e-mail sturen naar een lijst, een continue integratie server notificeren of het vernieuwen van een ticket-volg systeem. Je kunt zelfs de commit boodschappen doorlopen om te zien of er nog tickets zijn die moeten worden geopend, aangepast of afgesloten worden. Dit script kan het push proces niet stoppen, maar de client verbreekt de connectie niet totdat het afgerond is, wees dus een voorzichtig als je iets probeert te doen dat een lange tijd in beslag kan nemen.

### update

Het update script is vergelijkbaar met het `pre-receive` script, behalve dat het uitgevoerd wordt voor iedere branch die de pusher probeert te vernieuwen. Als de pusher naar meerdere branches probeert te pushen wordt `pre-receive` slechts één keer uitgevoerd, daarentegen loopt update bij iedere branch waar ze naar pushen. In plaats van stdin te lezen, accepteert dit script drie argumenten: de naam van de referentie (branch), de SHA-1 waar die referentie naar wees vóór de push, en de SHA-1 die de gebruiker probeert te pushen. Als het update script met een andere waarde dan nul eindigt, wordt alleen die referentie geweigerd; andere referenties kunnen nog steeds vernieuwd worden.
