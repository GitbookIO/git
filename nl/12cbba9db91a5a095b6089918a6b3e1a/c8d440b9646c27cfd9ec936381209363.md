# Subboom mergen

Nu je de moeilijkheden van het submodulesysteem hebt gezien, laten we eens kijken naar een alternatieve manier om hetzelfde probleem aan te pakken. Zodra Git merged, kijkt het naar wat het moet mergen en kiest dan een toepasselijke mergestrategie om te gebruiken. Als je twee branches aan het mergen bent zal Git een _recursive_ strategie gebruiken. Als je meer dan twee branches aan het mergen bent zal Git de _octopus_ strategie kiezen. Deze strategieën worden automatisch voor je gekozen omdat de recursieve strategie complexe drie-weg merge situaties aan kan - bijvoorbeeld meer dan één gezamenlijke voorouder, maar het kan het alleen mergen van twee branches aan. De octopus merge kan meerdere branches aan, maar is voorzichtiger om moeilijke conflicten te vermijden, dus wordt deze gekozen als de standaard strategie als je meer dan twee branches probeert te mergen.

Maar er zijn andere strategieën die je ook kunt kiezen. Eén ervan is de _subtree_ merge, en je kunt deze gebruiken om het subproject probleem aan te gaan. Hier zul je zien hoe je dezelfde rack inbedding kunt doen als in de vorige paragraaf, maar in plaats daarvan subboom-merges gebruiken.

Het idee van de subboom-merge is dat je twee projecten hebt, en één van de projecten komt overeen met een subdirectory van de andere en omgekeerd. Als je een subboommerge specificeert, dan is Git slim genoeg om erachter te komen dat de ene een subboom van de andere is en vervolgens juist te mergen - het is best wel verbazingwekkend.

Eerst voeg je de Rack applicatie toe aan je project. Voeg het Rack project toe als een remote reference in je eigen project en check het dan uit in zijn eigen branch:

	$ git remote add rack_remote git@github.com:schacon/rack.git
	$ git fetch rack_remote
	warning: no common commits
	remote: Counting objects: 3184, done.
	remote: Compressing objects: 100% (1465/1465), done.
	remote: Total 3184 (delta 1952), reused 2770 (delta 1675)
	Receiving objects: 100% (3184/3184), 677.42 KiB | 4 KiB/s, done.
	Resolving deltas: 100% (1952/1952), done.
	From git@github.com:schacon/rack
	 * [new branch]      build      -> rack_remote/build
	 * [new branch]      master     -> rack_remote/master
	 * [new branch]      rack-0.4   -> rack_remote/rack-0.4
	 * [new branch]      rack-0.9   -> rack_remote/rack-0.9
	$ git checkout -b rack_branch rack_remote/master
	Branch rack_branch set up to track remote branch refs/remotes/rack_remote/master.
	Switched to a new branch "rack_branch"

Nu heb je de root van het Rack project in je `rack_branch` branch en je eigen project in de `master` branch. Als je eerste de ene uitchecked en dan de andere, kun je zien dat ze verschillende project roots hebben:

	$ ls
	AUTHORS	       KNOWN-ISSUES   Rakefile      contrib	       lib
	COPYING	       README         bin           example	       test
	$ git checkout master
	Switched to branch "master"
	$ ls
	README

Je gaat nu het Rack project in je `master` project pullen als een subdirectory. Je kunt dat in Git doen met `git read-tree`. Je zult meer over `read-tree` en zijn vriendjes leren in Hoofdstuk 9, maar weet voor nu dat het de roottree van een branch in je huidige staging area en werkdirectory leest. Je hebt zojuist teruggewisseld naar je `master` branch, en je pulled de `rack` branch in de `rack` subdirectory van de `master` branch van je hoofdproject:

	$ git read-tree --prefix=rack/ -u rack_branch

Als je commit, lijkt het alsof alle Rack bestanden in die subdirectory staan - alsof je ze uit een tarball gekopieerd hebt. Waar het interessant wordt is dat je vrij makkelijk veranderingen van één branch in de andere kunt mergen. Dus als het Rack project update kan je alle wijzigingen van stroomopwaartse binnenhalen door naar die branch te wisselen en te pullen:

	$ git checkout rack_branch
	$ git pull

Dan kun je die veranderingen terug in je master branch mergen. Je kunt `git merge -s subtree` gebruiken en het zal prima werken, maar Git zal ook de geschiedenissen samenvoegen, en dat wil je eigenlijk niet. Om de veranderingen binnen te halen en het commit bericht voor te vullen, gebruik je de `--squash` en `--no-commit` opties samen met de `-s subtree` strategie optie:

	$ git checkout master
	$ git merge --squash -s subtree --no-commit rack_branch
	Squash commit -- not updating HEAD
	Automatic merge went well; stopped before committing as requested

Alle wijzigingen van het Rack project worden gemerged en zijn klaar om lokaal gecommit te worden. Je kunt ook het tegenovergestelde doen: veranderingen doen in de `rack` subdirectory van de master branch en die later in je `rack_branch` branch mergen om ze naar de beheerders te sturen of ze stroomopwaarts te pushen.

Om een diff te krijgen tussen wat je in de `rack` subdirectory hebt en de code in je `rack_branch` branch (om te zien of je ze moet mergen) kan je niet het gebruikelijke `diff` commando toepassen. In plaats daarvan moet je `git diff-tree` uitvoeren met de branch waarmee je wilt vergelijken:

	$ git diff-tree -p rack_branch

Of om te vergelijken met wat in je `rack` subdirectory zit met wat in de `master` branch op de server zat toen je de laatste keer fetchde, kan je dit uitvoeren:

	$ git diff-tree -p rack_remote/master
