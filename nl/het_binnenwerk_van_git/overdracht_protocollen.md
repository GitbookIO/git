# Overdracht protocollen

Git kan gegevens tussen twee repositories hoofdzakelijk op twee manieren overdragen: via HTTP en via de zogenaamde slimme protocollen die in de `file://`, `ssh://` en `git://` overdrachten gebruikt worden. Deze paragraaf zal laten zien hoe deze twee hoofdprotocollen werken.

## Het domme Protocol

Naar Git-overdracht via HTTP wordt vaak gerefereerd als het domme protocol, omdat het geen Git-specifieke code vereist op de server tijdens het overdrachtsproces. Het fetch proces is een reeks van GET verzoeken, waarbij de client de indeling van het Git repository van de server kent. Laten we het `http-fetch` proces eens volgen voor de simplegit bibliotheek:

	$ git clone http://github.com/schacon/simplegit-progit.git

Het eerste wat dit commando doet is het `info/refs` bestand pullen. Dit bestand wordt geschreven door het `update-server-info` commando, en dat is de reden waarom je dat als een `post-recieve` hook moet activeren voordat de HTTP overdracht naar behoren werkt:

	=> GET info/refs
	ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

Nu heb je een lijst met de remote referenties en SHA's. Daarna kijk je naar de waarde van de HEAD referentie, zodat je weet wat je uit moet checken zodra je klaar bent:

	=> GET HEAD
	ref: refs/heads/master

Je moet de `master` branch uitchecken zodra je het proces afgerond hebt.
Op dit punt kan je beginnen met het doorloop proces. Omdat je startpunt het `ca82a6` commit object is dat je in het `info/refs` bestand zag, begin je met dit op te halen:

	=> GET objects/ca/82a6dff817ec66f44342007202690a93763949
	(179 bytes of binary data)

Je krijgt een object terug - dat object staat in los formaat op de server, en je hebt het gehaald met een statisch HTTP GET verzoek. Je kunt het met zlib decomprimeren, de kop eraf halen en naar de commit inhoud kijken:

	$ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Daarna heb je nog twee objecten op te halen - `cfda3b`, wat de tree is met inhoud waar de commit die je zojuist hebt opgehaald naar wijst, en `085bb3`, wat de ouder commit is:

	=> GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	(179 bytes of data)

Dat geeft je het volgende commit object. Pak het tree object:

	=> GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
	(404 - Not Found)

Oeps, het ziet ernaar uit dat die tree object niet in het loose formaat op de server bestaat, dus krijg je een 404 antwoord. Er zijn hiervoor een aantal redenen: het object zou in een ander repository kunnen staan, of het kan in een packfile in deze repository staan. Git gaat eerst naar de benoemde alternatieven kijken:

	=> GET objects/info/http-alternates
	(empty file)

Als dit een lijst met alternatieve URL's bevat, zal Git daar voor loose bestanden en packfiles gaan kijken. Dit is een prettig mechanisme voor projecten die forks zijn van een ander zodat ze objecten kunnen delen op de schijf. Maar omdat er in dit geval geen alternatieven vermeld staan, moet het object in een packfile zitten. Om te zien welke packfiles beschikbaar zijn op deze server moet je het `objects/info/packs` bestand ophalen, wat een lijst hiervan bevat (ook gegenereerd door `update-server-info`):

	=> GET objects/info/packs
	P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Er is slechts één packfile op de server dus dat object zit daar natuurlijk in, maar je controleert het index bestand om er zeker van te zijn. Dit is ook handig als je meerdere packfiles op de server hebt, zodat je kunt zien welke packfile het object dat je nodig hebt bevat:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
	(4k of binary data)

Nu je de packfile index hebt kun je zien of het object hier in zit - omdat de index de SHA's van de objecten in de packfile toont en de offsets naar die objecten. Het gezochte object is aanwezig, dus ga je verder en haalt de hele packfile op:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
	(13k of binary data)

Je hebt de tree object te pakken, dus je kunt verder gaan met het doorlopen van de commits. Ze zitten ook allemaal in de packfile die je zojuist gedownload hebt, dus je hoeft geen verzoeken meer te doen aan je server. Git checked een werkkopie uit van de `master` branch waarnaar gewezen werd door de HEAD referentie, die je aan het begin gedownload hebt.

Het gehele uitvoer van dit proces ziet er zo uit:

	$ git clone http://github.com/schacon/simplegit-progit.git
	Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
	got ca82a6dff817ec66f44342007202690a93763949
	walk ca82a6dff817ec66f44342007202690a93763949
	got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Getting alternates list for http://github.com/schacon/simplegit-progit.git
	Getting pack list for http://github.com/schacon/simplegit-progit.git
	Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
	Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
	 which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	walk a11bef06a3f659402fe7563abf99ad00de2209e6

## Het slimme protocol

De HTTP methode is eenvoudig, maar een beetje inefficiënt. Slimme protocollen gebruiken is een meer gebruikelijke manier van gegevensoverdracht. Deze protocollen hebben een proces aan de remote kant dat bewust is van Git - het kan lokale gegevens lezen en uitvinden wat de client heeft of nodig heeft en hier specifieke gegevens voor genereren. Er zijn twee paar processen voor gegevensoverdracht: één paar voor het uploaden van gegevens en één paar voor het downloaden van gegevens.

### Gegevens uploaden

Om gegevens te uploaden naar een remote proces, gebruikt Git de `send-pack` en `receive-pack` processen. Het `send-pack` proces draait op de client en maakt contact met een `receive-pack` proces aan de remote kant.

Bijvoorbeeld, stel dat je `git push origin master` uitvoert in je project en `origin` is gedefinieerd als een URL dat het SSH protocol gebruikt. Git start het `send-pack` proces, wat een SSH verbinding initieert naar de server. Het probeert een commando op de remote server uit te voeren met behulp van een SSH aanroep die er ongeveer zo uit ziet:

	$ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
	005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
	003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
	0000

Het `git-receive-pack` commando antwoordt direct met één regel voor iedere referentie die het momenteel heeft - in dit geval alleen de `master` branch en zijn SHA. De eerste regel bevat ook een lijst van de mogelijkheden van de server (hier: `report-status` en `delete-refs`).

Iedere regel begint met een hexadecimale waarde van 4 bytes, die specificeert hoe lang de rest van de regel is. Je eerste regel begint met 005b, wat 91 in hex is, wat betekent dat er nog 91 bytes over zijn op deze regel. De volgende regel begint met 003e, wat 62 is, waarna je de overgebleven 62 bytes leest. De volgende regel is 0000, wat betekent dat de server klaar is met het tonen van zijn referenties.

Nu de status van de server bekend is, bepaalt het `send-pack` proces welke commits het heeft die de server nog niet heeft. Voor iedere referentie die deze push zal vernieuwen, geeft het `send-pack` die informatie aan het `receive-pack` door. Bijvoorbeeld, als je de `master` branch vernieuwt en een `experiment` branch toevoegt, zou het `send-pack` antwoord er zo uit kunnen zien:

	0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
	00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
	0000

De SHA-1 waarde met alleen '0' betekent dat er nog niets was - omdat je de experiment referentie toevoegt. Als je een referentie aan het verwijderen was, zou je het tegenovergestelde zien: allemaal '0'en aan de rechterkant.

Git stuurt een regel voor iedere referentie die je vernieuwt met de oude SHA, de nieuwe SHA en de referentie die vernieuwd wordt. De eerste regel bevat ook de mogelijkheden van de client. Vervolgens uploadt de client een packfile met alle objecten die de server nog niet heeft. Als laatste antwoordt de server met een indicatie van succes (of mislukking):

	000Aunpack ok

### Gegevens downloaden

Zodra je gegevens downloadt zijn de `fetch-pack` en `upload-pack` processen erbij betrokken. De client start een `fetch-pack` proces dat verbinding maakt met een `upload-pack` proces aan de remote kant om te onderhandelen welke gegevens opgehaald moeten worden.

Er zijn verschillende manieren om het `upload-pack` proces op de remote repository te starten. Je kunt het uitvoeren via SSH, zoals bij het `receive-pack` proces. Je kunt het proces ook starten via de Git daemon, die standaard op poort 9418 luistert. Het `fetch-pack` proces stuurt gegevens, naar de daemon na het maken van de verbinding die er zo uitzien:

	003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Het begint met de 4 bytes die specificeren hoeveel gegevens er volgen, daarna het commando gevolgd door een null byte, en dan de hostname van de server gevolgd door een laatste null byte. De Git daemon controleert of dat commando uitgevoerd kan worden, dat de repository bestaat en dat het publieke permissies heeft. Als alles in orde is, dan start het het `upload-pack` proces en geeft het verzoek hier aan door.

Als je de fetch via SSH doet, voert het `fetch-pack` in plaats daarvan zoiets als dit uit:

	$ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

In beide gevallen wordt, nadat `fetch-pack` verbinding gemaakt heeft, door `upload-pack` zoiets als het volgende gestuurd:

	0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
	  side-band side-band-64k ofs-delta shallow no-progress include-tag
	003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
	003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
	0000

Dit komt sterk overeen met hoe `receive-pack` antwoordt, maar de mogelijkheden zijn verschillend. Daarnaast stuurt het de HEAD referentie zodat de client weet wat er uitgechecked moet worden als dit een clone is.

Op dit punt kijkt het `fetch-pack` proces naar welke objecten het heeft en antwoordt met de objecten die het nodig heeft door "want" te sturen, gevolgd door de SHA die het wil hebben. Het stuurt al de objecten die het al heeft met "have" en dan de SHA. Aan het einde van deze lijst schrijft het "done" om het `upload-pack` proces te laten beginnen met het sturen van de packfile met de gegevens die het nodig heeft:

	0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
	0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	0000
	0009done

Dat is een erg basaal geval van de overdrachtsprotocollen. In meer complexe gevallen ondersteunt de client `multi_ack` of `side-band` mogelijkheden; maar dit voorbeeld toont je het basale over en weer dat plaatsvindt bij de slimme protocol processen.
