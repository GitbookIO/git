# Een Git repository verkrijgen

Je kunt op twee manieren een Git project verkrijgen. De eerste maakt gebruik van een bestaand project of directory en importeert dit in Git. De tweede maakt een kloon (clone) van een bestaande Git repository op een andere server.

## Een repository initialiseren in een bestaande directory

Als je een bestaand project in Git wilt volgen (tracken), dan moet je naar de projectdirectory gaan en het volgende typen

	$ git init

Dit maakt een nieuwe subdirectory met de naam `.git` aan, die alle noodzakelijke repository bestanden bevat, een Git repository raamwerk. Op dit moment wordt nog niets in je project gevolgd. (Zie *Hoofdstuk 9* voor meer informatie over welke bestanden er precies in de `.git` directory staan, die je zojuist gemaakt hebt.)

Als je de versies van bestaande bestanden wilt gaan beheren (in plaats van een lege directory), dan zul je die bestanden moeten beginnen te tracken en een eerste commit doen. Dit kun je bereiken door een paar `git add` commando's waarin je de te volgen bestanden specificeert, gevolgd door een commit:

	$ git add *.c
	$ git add README
	$ git commit –m 'initial project version'

We zullen zodadelijk beschrijven wat deze commando's doen. Op dit punt heb je een Git repository met gevolgde (tracked) bestanden en een initiële commit.

## Een bestaand repository clonen

Als je een kopie wilt van een bestaande Git repository, bijvoorbeeld een project waaraan je wilt bijdragen, dan is `git clone` het commando dat je nodig hebt. Als je bekend bent met andere versie-beheersystemen zoals Subversion, dan zal het je opvallen dat het commando `clone` is en niet `checkout`. Dit is een belangrijk verschil: Git ontvangt een kopie van bijna alle gegevens die de server heeft. Elke versie van ieder bestand in de hele geschiedenis van een project wordt binnengehaald als je `git clone` doet. In feite kun je als de schijf van de server kapot gaat, een clone van een willekeurige client gebruiken om de server terug in de status te brengen op het moment van clonen (al zou je wel wat hooks aan de kant van de server en dergelijke verliezen, maar alle versies van alle bestanden zullen er zijn; zie *Hoofdstuk 4* voor meer informatie).

Je clonet een repository met `git clone [url]`. Bijvoorbeeld, als je de Ruby Git bibliotheek genaamd Grit wilt clonen, kun je dit als volgt doen:

	$ git clone git://github.com/schacon/grit.git

Dat maakt een directory genaamd `grit` aan, initialiseert hierin een `.git` directory, haalt alle data voor die repository binnen en doet een checkout van een werkkopie van de laatste versie. Als je in de nieuwe `grit` directory gaat kijken zal je de projectbestanden vinden, klaar om gebruikt of aan gewerkt te worden. Als je de repository in een directory met een andere naam dan grit wilt clonen, dan kun je dit met het volgende commando specificeren:

	$ git clone git://github.com/schacon/grit.git mygrit

Dat commando doet hetzelfde als het vorige, maar dan heet de doeldirectory `mygrit`.

Git heeft een aantal verschillende transportprotocollen die je kunt gebruiken. Het vorige voorbeeld maakt gebruik van het `git://` protocol, maar je kunt ook `http(s)://` of `gebruiker@server:/pad.git` tegenkomen, dat het SSH transport protocol gebruikt. *Hoofdstuk 4* zal alle beschikbare opties introduceren die de server kan inrichten om je toegang tot de Git-repositories te geven, met daarbij de voors en tegens van elk.
