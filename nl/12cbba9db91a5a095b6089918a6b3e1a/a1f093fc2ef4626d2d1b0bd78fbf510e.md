# Submodules

Het komt vaak voor dat terwijl je zit te werken aan het ene project, je een ander project daarbinnen moet gebruiken. Bijvoorbeeld een library die een derde partij ontwikkeld heeft, of die je separaat aan het ontwikkelen bent en gebruikt in meerdere projecten. Een veel voorkomend probleem komt in deze scenario's naar voren: je wilt de twee projecten apart behandelen, maar wel binnen de andere kunnen gebruiken.

Hier is een voorbeeld. Stel dat je een website aan het ontwikkelen bent en Atom feeds aan het maken bent. In plaats van je eigen Atom-genererende code te schrijven, besluit je een library te gebruiken. Je zult deze code dan moeten includen van een gedeelde library zoals een CPAN installatie of een Ruby gem, of de broncode kopiëren naar je eigen projectboom. Het probleem met de library includen is dat het lastig is om de library op enige manier aan te passen, en vaak nog lastiger is om het uit te rollen omdat je zeker moet zijn dat iedere client die library beschikbaar heeft. Het probleem van de broncode in je project stoppen is dat alle aanpassingen die je maakt lastig te mergen zijn op het moment dat stroomopwaarts veranderingen beschikbaar komen.

Git pakt dit probleem aan door submodules te gebruiken. Submodules geven je de mogelijkheid om een Git repository als een subdirectory van een ander Git repository te gebruiken. Dit stelt je in staat staat een ander repository in je project te klonen en je commits gescheiden te houden.

## Beginnen met submodules

Stel dat je de Rack library (een Ruby web server gateway interface) wilt toevoegen aan je project, misschien je eigen veranderingen eraan wilt onderhouden, maar ook veranderingen van stroomopwaarts wilt mergen. Het eerste wat je moet doen is de externe repository klonen in jouw subdirectory. Je voegt externe projecten als submodules toe door middel van het `git submodule add` commando:

	$ git submodule add git://github.com/chneukirchen/rack.git rack
	Initialized empty Git repository in /opt/subtest/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 422 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.

Nu heb je het Rack project als een subdirectory genaamd `rack` in je eigen project. Je kunt die subdirectory in gaan, wijzigingen maken, je eigen schrijfbare remote repository toevoegen waar je veranderingen in kunt pushen, vanuit de originele repository fetchen en mergen, en zo meer. Als je `git status` uitvoert vlak nadat je de submodule toevoegt, zie je twee dingen:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      new file:   .gitmodules
	#      new file:   rack
	#

Eerst zie je het `.gitmodules` bestand. Dit is een configuratie bestand dat de mapping opslaat tussen de URL van het project en de lokale subdirectory waarin je het gepulled hebt:

	$ cat .gitmodules
	[submodule "rack"]
	      path = rack
	      url = git://github.com/chneukirchen/rack.git

Als je meerdere submodules hebt, zal je meerdere vermeldingen hebben in dit bestand. Het is belangrijk om op te merken dat dit bestand net als je andere bestanden ook onder versiebeheer staat, net als het `.gitignore` bestand. Het wordt samen met de rest van het project gepusht en gepulled. Op deze manier weten andere mensen die je project klonen waar ze de submodule projecten vandaan moeten halen.

De andere vermelding in de `git status` uitvoer is de rack regel. Als je `git diff` daarop uitvoert zul je iets interessants zien:

	$ git diff --cached rack
	diff --git a/rack b/rack
	new file mode 160000
	index 0000000..08d709f
	--- /dev/null
	+++ b/rack
	@@ -0,0 +1 @@
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Hoewel `rack` een subdirectory in je werkdirectory is, ziet Git het als een submodule en zal de inhoud niet tracken als je niet in die directory staat. In plaats daarvan slaat Git het als een aparte commit op van die repository. Als je wijzigingen maakt en in die subdirectory een commit doet, zal het superproject zien dat de HEAD daar is veranderd en de exacte commit opslaan waarop je op dat moment zit te werken; op die manier zullen anderen die dit project klonen de omgeving exact kunnen reproduceren.

Dit is een belangrijk punt met submodules: je slaat ze op als de exacte commit waar ze op staan. Je kunt een submodule niet opslaan als `master` of een andere symbolische referentie.

Als je commit, zou je zoiets als dit moeten zien:

	$ git commit -m 'first commit with submodule rack'
	[master 0550271] first commit with submodule rack
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack

Merk de 160000 modus op voor de rack vermelding. Dat is een speciale modus binnen Git, die in feite betekent dat je een commit als een directory vermelding opslaat in plaats van als een subdirectory of een bestand.

Je kunt de `rack` directory als een apart project behandelen en je superproject van tijd tot tijd vernieuwen met een pointer naar de laatste commit in dat subproject. Alle Git commando's werken onafhankelijk in de twee directories:

	$ git log -1
	commit 0550271328a0038865aad6331e620cd7238601bb
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:03:56 2009 -0700

	    first commit with submodule rack
	$ cd rack/
	$ git log -1
	commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433
	Author: Christian Neukirchen <chneukirchen@gmail.com>
	Date:   Wed Mar 25 14:49:04 2009 +0100

	    Document version change

## Een project met submodules clonen

Hier ga je een project met een submodule erin clonen. Als je zo'n project ontvangt, krijg je de directories die submodules bevatten, maar nog niet de bestanden:

	$ git clone git://github.com/schacon/myproject.git
	Initialized empty Git repository in /opt/myproject/.git/
	remote: Counting objects: 6, done.
	remote: Compressing objects: 100% (4/4), done.
	remote: Total 6 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (6/6), done.
	$ cd myproject
	$ ls -l
	total 8
	-rw-r--r--  1 schacon  admin   3 Apr  9 09:11 README
	drwxr-xr-x  2 schacon  admin  68 Apr  9 09:11 rack
	$ ls rack/
	$

De `rack` directory is er, maar hij is leeg. Je moet twee commando's uitvoeren: `git submodule init` om je lokale configuratie bestand te initialiseren, en `git submodule update` om alle data van dat project te fetchen en de juiste commit die in je superproject staat uit te checken:

	$ git submodule init
	Submodule 'rack' (git://github.com/chneukirchen/rack.git) registered for path 'rack'
	$ git submodule update
	Initialized empty Git repository in /opt/myproject/rack/.git/
	remote: Counting objects: 3181, done.
	remote: Compressing objects: 100% (1534/1534), done.
	remote: Total 3181 (delta 1951), reused 2623 (delta 1603)
	Receiving objects: 100% (3181/3181), 675.42 KiB | 173 KiB/s, done.
	Resolving deltas: 100% (1951/1951), done.
	Submodule path 'rack': checked out '08d709f78b8c5b0fbeb7821e37fa53e69afcf433'

Nu is je `rack` subdirectory in exact dezelfde staat als het was toen je het eerder gecommit had. Als een andere developer wijzigingen doet op de rack code en commit en je pulled die referentie en merged de code, dan krijg je iets dat een beetje vreemd is:

	$ git merge origin/master
	Updating 0550271..85a3eee
	Fast forward
	 rack |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)
	[master*]$ git status
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#      modified:   rack
	#

Je hebt iets gemerged dat eigenlijk een wijziging is op de pointer naar je submodule; maar de code in de submodule directory wordt niet vernieuwd, dus het lijkt erop dat je een vervuilde status hebt in je werkdirectory:

	$ git diff
	diff --git a/rack b/rack
	index 6c5e70b..08d709f 160000
	--- a/rack
	+++ b/rack
	@@ -1 +1 @@
	-Subproject commit 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	+Subproject commit 08d709f78b8c5b0fbeb7821e37fa53e69afcf433

Dit is het omdat de pointer die je hebt voor de submodule niet is wat eigenlijk in de submodule directory zit. Om dit te repareren moet je `git submodule update` opnieuw uitvoeren:

	$ git submodule update
	remote: Counting objects: 5, done.
	remote: Compressing objects: 100% (3/3), done.
	remote: Total 3 (delta 1), reused 2 (delta 0)
	Unpacking objects: 100% (3/3), done.
	From git@github.com:schacon/rack
	   08d709f..6c5e70b  master     -> origin/master
	Submodule path 'rack': checked out '6c5e70b984a60b3cecd395edd5b48a7575bf58e0'

Je moet dit iedere keer doen wanneer je een submodule wijziging pulled in het hoofdproject. Het is vreemd, maar het werkt.

Één bekend probleem doet zich voor als een developer een lokale wijziging in een submodule doet maar die niet naar een publieke server pusht. Dan committen ze een pointer naar de niet-publieke status en pushen deze naar het superproject. Als andere developers dan `git submodule update` proberen uit te voeren, dan zal het submodule systeem de commit die gerefereerd wordt niet kunnen vinden omdat het alleen op het systeem van de eerste developer bestaat. Als dat gebeurt, zal je een foutmelding als deze zien:

	$ git submodule update
	fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0
	Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

Je moet dan bekijken wie als laatste de submodule veranderd heeft:

	$ git log -1 rack
	commit 85a3eee996800fcfa91e2119372dd4172bf76678
	Author: Scott Chacon <schacon@gmail.com>
	Date:   Thu Apr 9 09:19:14 2009 -0700

	    added a submodule reference I will never make public. hahahahaha!

Dan stuur je een e-mail naar die jongen en gaat heel boos zijn tegen hem.

## Superprojecten

Soms willen developers een combinatie van subdirectories van een groot project hebben, afhankelijk van het team waarin ze zitten. Dit komt vaak voor als je van CVS of Subversion af komt, waar je een module of verzameling subdirectory gedefinieerd hebt en je wilt deze workflow behouden.

Een goeie manier om dit in Git te doen is om elk van de subdirectories een aparte Git repository te maken en dan superproject Git repositories te maken die meerdere submodules bevatten. Een voordeel van deze aanpak is dat je meer specifiek kunt definiëren wat de relaties tussen de projecten zijn met behulp van tags en branches in de superprojects.

## Problemen met submodules

Submodules gebruiken is echter niet zonder probleempjes. Ten eerste moet je relatief voorzichtig zijn met het werken in de directory van de submodule. Als je `git submodule update` uitvoert, zal het de specifieke versie van het project uitchecken, maar niet binnen een branch. Dit wordt een afgekoppelde (detached) HEAD genoemd – het houdt in dat het HEAD bestand direct naar een commit wijst en niet naar een symbolische referentie. Het probleem is dat je over het algemeen niet wilt werken in een detached HEAD omgeving, omdat het eenvoudig is om wijzigingen te verliezen. Als je een initiële `submodule update` doet, in die submodule directory commit zonder een branch te maken om in te werken en dan nogmaals `git submodule update` uitvoert in het superproject zonder in de tussentijd te committen, dan zal Git je wijzigingen overschrijven zonder het je te vertellen. Technisch gezien ben je het werk niet kwijt, maar je zult geen branch hebben die er naar wijst, dus het zal wat lastig zijn om het terug te halen.

Om dit probleem te vermijden creëer je een branch zodra je in een submodule directory werkt met behulp van `git checkout -b work` of iets dergelijks. Als je de tweede keer de submodule update doet, zal het nog steeds je werk terugdraaien maar je heb tenminste een pointer om naar terug te keren.

Tussen branches omschakelen die submodules bevatten kan ook lastig zijn. Als je een nieuwe branch aanmaakt, daar een submodule toevoegt en dat terug wisselt naar een branch zonder die submodule, zul je nog steeds de submodule directory als een ungetrackte subdirectory hebben:

	$ git checkout -b rack
	Switched to a new branch "rack"
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/myproj/rack/.git/
	...
	Receiving objects: 100% (3184/3184), 677.42 KiB | 34 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	$ git commit -am 'added rack submodule'
	[rack cc49a69] added rack submodule
	 2 files changed, 4 insertions(+), 0 deletions(-)
	 create mode 100644 .gitmodules
	 create mode 160000 rack
	$ git checkout master
	Switched to branch "master"
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#      rack/

Je moet hem verplaatsen of verwijderen, in welk geval je hem opnieuw moet clonen als je terug wisselt. Daarbij loop je kans om lokale wijzigingen of branches te verliezen die je niet gepusht hebt.

De laatste grote valkuil waar veel mensen in lopen heeft te maken met het wisselen van subdirectories naar submodules. Als je bestanden in je project trackt, en je wilt ze naar een submodule verplaatsen, dan moet je voorzichtig zijn of zal Git boos op je worden. Stel dat je de rack bestanden in een subdirectory van je project hebt, en je wilt die naar een submodule omzetten. Als je de subdirectory weggooit en dan `submodule add` uitvoert, begint Git naar je te schreeuwen:

	$ rm -Rf rack/
	$ git submodule add git@github.com:schacon/rack.git rack
	'rack' already exists in the index

Je moet de `rack` subdirectory eerst unstagen. Dan kun je de submodule toevoegen:

	$ git rm -r rack
	$ git submodule add git@github.com:schacon/rack.git rack
	Initialized empty Git repository in /opt/testsub/rack/.git/
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 88 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.

Stel nu dat je dat in een branch gedaan zou hebben. Als je probeert terug te wisselen naar een branch waar die bestanden nog in de echte boom zitten in plaats van in een submodule – dan krijg je deze foutmelding:

	$ git checkout master
	error: Untracked working tree file 'rack/AUTHORS' would be overwritten by merge.

Je moet de `rack` submodule directory uit de weg ruimen voordat je naar een branch kunt omschakelen die hem nog niet heeft:

	$ mv rack /tmp/
	$ git checkout master
	Switched to branch "master"
	$ ls
	README	rack

Als je dan terug schakelt krijg je een lege `rack` directory. Je kunt dan nogmaals `git submodule update` uitvoeren om nog eens te clonen, of je kunt je `/tmp/rack` directory terug zetten in de lege directory.
