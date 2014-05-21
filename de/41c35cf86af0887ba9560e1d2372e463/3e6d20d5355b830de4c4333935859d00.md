# Zu Git umziehen

<!--If you have an existing codebase in another VCS but you’ve decided to start using Git, you must migrate your project one way or another. This section goes over some importers that are included with Git for common systems and then demonstrates how to develop your own custom importer.-->

Wenn Du bereits Quellcode in einer anderen Versionsverwaltung abgelegt hast, aber Dich nun entschieden hast, von nun an Git zu benutzen, musst Du Dein Projekt so oder so umziehen. Für geläufige Systeme bringt Git einige Importer mit. Anschließend lernen wir, wie Du Deinen eigenen, angepassten Importer entwickeln kann. All das wird im folgenden Abschnitt behandelt.

<!--## Importing-->
## Import

<!--You’ll learn how to import data from two of the bigger professionally used SCM systems — Subversion and Perforce — both because they make up the majority of users I hear of who are currently switching, and because high-quality tools for both systems are distributed with Git.-->

Jetzt ist es an der Zeit zu lernen, wie Du Daten aus zwei der am meisten benutzten (professionellen) SCM-Systeme importieren kannst: Subversion und Perforce. Ein Großteil der Benutzer, die gegenwärtig zu Git umziehen, arbeiten mit einem von diesen beiden Systemen. Außerdem liefert Git für beide jeweils hochprofessionelle Werkzeuge für den Import mit.

<!--## Subversion-->
## Subversion

<!--If you read the previous section about using `git svn`, you can easily use those instructions to `git svn clone` a repository; then, stop using the Subversion server, push to a new Git server, and start using that. If you want the history, you can accomplish that as quickly as you can pull the data out of the Subversion server (which may take a while).-->

Wenn Du die letzten Abschnitte über `git svn` gelesen hast, kannst Du diese Anleitungen ganz einfach benutzen um mit `git svn clone` ein Repository zu klonen. Anschließend stoppst den Subversion-Server, führst einen Push auf den neuen Git-Server durch und beginnst ihn zu benutzen. Wenn Du an die Historie ran willst, kannst Du das genausoschnell erreichen als ob Du die Daten aus dem Subversion-Server beziehen würdest (was eine Weile dauern könnte).

<!--However, the import isn’t perfect; and because it will take so long, you may as well do it right. The first problem is the author information. In Subversion, each person committing has a user on the system who is recorded in the commit information. The examples in the previous section show `schacon` in some places, such as the `blame` output and the `git svn log`. If you want to map this to better Git author data, you need a mapping from the Subversion users to the Git authors. Create a file called `users.txt` that has this mapping in a format like this:-->

Trotzdem ist der Import nicht perfekt. Und weil das ziemlich lange dauern wird, kannst Du es auch gleich richtig machen. Das erste Problem sind die Informationen über die Autoren. In Subversion besitzt jede Person, die mit dem System arbeitet, einen eigenen User-Account, der in den Commit-Informationen aufgezeichnet wird. Die Beispiele in den vorherigen Abschnitten zeigten dafür manchmal `schacon` an, wie beispielsweise bei der Ausgabe von `blame` und bei `git svn log`. Wenn Du dies näher an die Autoren-Daten von Git binden willst, musst Du Mapping-Informationen für die Subversion-Benutzer und die Git-Autoren anlegen. Erstelle eine Datei mit dem Namen `users.txt`, die folgendes Mapping-Format verwendet:

	schacon = Scott Chacon <schacon@geemail.com>
	selse = Someo Nelse <selse@geemail.com>

<!--To get a list of the author names that SVN uses, you can run this:-->

Um eine Liste der Namen der Autoren bekommen, die SVN benutzen, kannst Du folgendes Kommando ausführen:

	$ svn log ^/ --xml | grep -P "^<author" | sort -u | \
	      perl -pe 's/<author>(.*?)<\/author>/$1 = /' > users.txt

<!--That gives you the log output in XML format — you can look for the authors, create a unique list, and then strip out the XML. (Obviously this only works on a machine with `grep`, `sort`, and `perl` installed.) Then, redirect that output into your users.txt file so you can add the equivalent Git user data next to each entry.-->

Dies erzeugt Dir die Log-Ausgabe im XML-Format — Du suchst damit nach den Autoren, erzeugst eine Liste ohne doppelte Einträge und wirfst anschließend das überflüssige XML weg. Leite anschließend die Ausgabe in die Datei `users.txt` um, sodass Du jedem Eintrag den entsprechenden Git-Benutzer zuordnen kannst.

<!--You can provide this file to `git svn` to help it map the author data more accurately. You can also tell `git svn` not to include the metadata that Subversion normally imports, by passing `-\-no-metadata` to the `clone` or `init` command. This makes your `import` command look like this:-->

Du kannst diese Datei dann `git svn` zur Verfügung stellen um das Tool dabei zu unterstützen, die Autoreninformationen besser zu mappen. Du kannst `git svn` ebenfalls mitteilen, dass es die Metadaten nicht einbeziehen soll, die Subversion normalerweise importiert, indem Du dem `clone` oder `init` Kommando die `--no-metadata`-Option mitgibst.

	$ git svn clone http://my-project.googlecode.com/svn/ \
	      --authors-file=users.txt --no-metadata -s my_project

<!--Now you should have a nicer Subversion import in your `my_project` directory. Instead of commits that look like this-->

Jetzt solltest Du einen hübscheren Subversion-Import in Deinem `my_project`-Verzeichnis haben. Statt eines Commit, die so aussehen:

	commit 37efa680e8473b615de980fa935944215428a35a
	Author: schacon <schacon@4c93b258-373f-11de-be05-5f7a86268029>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

	    git-svn-id: https://my-project.googlecode.com/svn/trunk@94 4c93b258-373f-11de-
	    be05-5f7a86268029

<!--they look like this:-->

sehen sie jetzt so aus:

	commit 03a8785f44c8ea5cdb0e8834b7c8e6c469be2ff2
	Author: Scott Chacon <schacon@geemail.com>
	Date:   Sun May 3 00:12:22 2009 +0000

	    fixed install - go to trunk

<!--Not only does the Author field look a lot better, but the `git-svn-id` is no longer there, either.-->

Nicht nur das Autoren-Feld sieht jetzt wesentlich besser aus. Auch die `git-svn-id` wird jetzt nicht mehr gebraucht.

<!--You need to do a bit of `post-import` cleanup. For one thing, you should clean up the weird references that `git svn` set up. First you’ll move the tags so they’re actual tags rather than strange remote branches, and then you’ll move the rest of the branches so they’re local.-->

Nach dem Import musst Du noch ein wenig aufräumen. Dafür solltest Du all die merkwürdigen Referenzen säubern, die `git svn` angelegt hat. Zuerst verschiebst Du die Tags, damit sie tatsächliche Git-Tags sind statt merkwürdigen Remote-Zweigen. Anschließend verschieben wir den Rest der Zweige, sodass sie lokale Zweige werden.

<!--To move the tags to be proper Git tags, run-->

Um die Tags so zu verschieben, dass sie echte Git-Tags werden, führst Du folgenden Befehl aus:

	$ git for-each-ref refs/remotes/tags | cut -d / -f 4- | grep -v @ | while read tagname; do git tag "$tagname" "tags/$tagname"; git branch -r -d "tags/$tagname"; done

<!--This takes the references that were remote branches that started with `tag/` and makes them real (lightweight) tags.-->

Das nimmt die Referenzen, die vorher Remote-Zweige waren, die mit `tag/` begonnen haben und macht aus ihnen echte (leichtgewichtige) Tags.

<!--Next, move the rest of the references under `refs/remotes` to be local branches:-->

Als nächstes verschieben wir den Rest der Referenzen aus `refs/remotes` und machen lokale Zweige daraus:

	$ git for-each-ref refs/remotes | cut -d / -f 3- | grep -v @ | while read branchname; do git branch "$branchname" "refs/remotes/$branchname"; git branch -r -d "$branchname"; done

<!--Now all the old branches are real Git branches and all the old tags are real Git tags. The last thing to do is add your new Git server as a remote and push to it. Here is an example of adding your server as a remote:-->

Jetzt sind alle alten Zweige richtige Git-Zweige geworden und alle alten Tags sind echte Git-Tags. Als letztes müssen wir den neuen Git-Server noch als entfernten Server einrichten und unsere Änderungen zu ihm pushen. Da wir alle Zweige und Tags einbeziehen wollen, kannst Du diesen Befehl verwenden:

	$ git remote add origin git@my-git-server:myrepository.git

<!--Because you want all your branches and tags to go up, you can now run this:-->

	$ git push origin --all
	$ git push origin --tags

<!--All your branches and tags should be on your new Git server in a nice, clean import.-->

All Deine Zweige und Tags sollten jetzt in Deinem neuen Git-Server in einem schicken, sauberen Import vorhanden sein.

<!--## Perforce-->
## Perforce

<!--The next system you’ll look at importing from is Perforce. A Perforce importer is also distributed with Git. If you have a version of Git earlier than 1.7.11, then the importer is only available in the `contrib` section of the source code. In that case you must get the Git source code, which you can download from git.kernel.org:-->

Das nächste System, dass wir zum Importieren anschauen werden, ist Perforce. Ein Import-Werkzeug für Perforce wird ebenfalls mit Git mitgeliefert, allerdings nur im `contrib`-Bereich des Quellcodes — es ist nicht wie `git svn` standardmäßig verfügbar. Um es auszuführen, musst Du den Git-Quellcode von `git.kernel.org` herunterladen:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	$ cd git/contrib/fast-import

<!--In this `fast-import` directory, you should find an executable Python script named `git-p4`. You must have Python and the `p4` tool installed on your machine for this import to work. For example, you’ll import the Jam project from the Perforce Public Depot. To set up your client, you must export the P4PORT environment variable to point to the Perforce depot:-->

In diesem `fast-import` Verzeichnis wirst Du ein ausführbares Python-Skript mit dem Namen `git-p4` finden. Du musst Python sowie das `p4`-Werkzeug auf Deiner Maschine installiert haben, damit der Import klappt. Als Beispiel werden wir das Jam-Projekt aus dem Perforce Public Depot verwenden. Um den Client einzurichten, musst Du die P4PORT-Umgebungsvariable exportieren und sie auf das Perforce-Depot einstellen:

	$ export P4PORT=public.perforce.com:1666

<!--Run the `git-p4 clone` command to import the Jam project from the Perforce server, supplying the depot and project path and the path into which you want to import the project:-->

Führe den `git-p4 clone`-Befehl aus, um das Jam-Projekt aus dem Perforce-Server zu importieren. Dazu gibst Du den Depot- und Projekt-Pfad sowie den Pfad an, in den Du das Projekt importieren willst:

	$ git-p4 clone //public/jam/src@all /opt/p4import
	Importing from //public/jam/src@all into /opt/p4import
	Reinitialized existing Git repository in /opt/p4import/.git/
	Import destination: refs/remotes/p4/master
	Importing revision 4409 (100%)

<!--If you go to the `/opt/p4import` directory and run `git log`, you can see your imported work:-->

Wenn Du zum `/opt/p4import`-Verzeichnis wechselst und dann `git log` ausführst, kannst Du sehen, dass Dein Import funktioniert hat:

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

<!--You can see the `git-p4` identifier in each commit. It’s fine to keep that identifier there, in case you need to reference the Perforce change number later. However, if you’d like to remove the identifier, now is the time to do so — before you start doing work on the new repository. You can use `git filter-branch` to remove the identifier strings en masse:-->

Du kannst die `git-p4`-ID bei jedem Commit sehen. Es ist OK, diese ID hier zu behalten, falls Du später noch mal einen Bezug zu der Perforce-Änderung herstellen musst. Falls Du die ID entfernen willst, ist jetzt Zeit dazu — bevor Du mit der Arbeit an dem neuen Repository beginnst. Du kannst `git filter-branch` benutzen um all die IDs zu entfernen:

	$ git filter-branch --msg-filter '
	        sed -e "/^\[git-p4:/d"
	'
	Rewrite 1fd4ec126171790efd2db83548b85b1bbbc07dc2 (123/123)
	Ref 'refs/heads/master' was rewritten

<!--If you run `git log`, you can see that all the SHA-1 checksums for the commits have changed, but the `git-p4` strings are no longer in the commit messages:-->

Wenn Du `git log` ausführst, kannst Du alle SHA1-Prüfsummen für jene Commits sehen, die sich geändert haben, aber die `git-p4`-Zeichenketten sind nicht mehr in den Commit-Nachrichten vorhanden.

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

<!--Your import is ready to push up to your new Git server.-->

Dein Import ist jetzt so weit, dass Du ihn auf den neuen Git-Server pushen kannst.

<!--## A Custom Importer-->
## Ein Import-Tool im Eigenbau

<!--If your system isn’t Subversion or Perforce, you should look for an importer online — quality importers are available for CVS, Clear Case, Visual Source Safe, even a directory of archives. If none of these tools works for you, you have a rarer tool, or you otherwise need a more custom importing process, you should use `git fast-import`. This command reads simple instructions from stdin to write specific Git data. It’s much easier to create Git objects this way than to run the raw Git commands or try to write the raw objects (see Chapter 9 for more information). This way, you can write an import script that reads the necessary information out of the system you’re importing from and prints straightforward instructions to stdout. You can then run this program and pipe its output through `git fast-import`.-->

Wenn die Versionsverwaltung, die Du verwendest, nicht Subversion oder Perforce ist, solltest Du zunächst einmal online nach einem Import-Tool suchen — gute Import-Tools sind für CVS, Clear Case, Visual Source Sage und sogar für ein Verzeichnis mit Archiven verfügbar. Wenn für Deinen Anwendungsfall keines dieser Werkzeuge passt, Du eine fast schon ausgestorbene Versionsverwaltung verwendest oder Du aus irgendeinem anderen Grund ein angepassteres Vorgehen brauchst, dann solltest Du `git fast-import` verwenden. Dieser Befehl nimmt einfache Anweisungen von `stdin` entgegen um entsprechende Git-Daten zu schreiben. Es ist viel einfacher Git-Objekte auf diese Art zu erzeugen als die blanken Git-Kommandos zu verwenden oder zu versuchen, die Roh-Objekte zu schreiben (weitere Informationen findest Du in Kapitel 9).

<!--To quickly demonstrate, you’ll write a simple importer. Suppose you work in current, you back up your project by occasionally copying the directory into a time-stamped `back_YYYY_MM_DD` backup directory, and you want to import this into Git. Your directory structure looks like this:-->

Um das kurz zu zeigen, schreiben wir einen einfachen Importer. Nehmen wir an, Du arbeitest im Verzeichnis `current` und führst ab und an ein Backup durch, indem Du dieses Verzeichnis in ein Backup-Verzeichnis kopierst und ihm einen anderen Namen mit einem Zeitstempel, z. B. `back_YYYY_MM_DD`, verpasst. Diese Struktur wollen wir jetzt in Git importieren. Dein Verzeichnis sieht also so aus:

	$ ls /opt/import_from
	back_2009_01_02
	back_2009_01_04
	back_2009_01_14
	back_2009_02_03
	current

<!--In order to import a Git directory, you need to review how Git stores its data. As you may remember, Git is fundamentally a linked list of commit objects that point to a snapshot of content. All you have to do is tell `fast-import` what the content snapshots are, what commit data points to them, and the order they go in. Your strategy will be to go through the snapshots one at a time and create commits with the contents of each directory, linking each commit back to the previous one.-->

Damit wir ein Git-Verzeichnis importieren können, müssen wir uns zunächst noch einmal anschauen, wie Git seine Daten speichert. Wie Du Dich vielleicht erinnerst, ist Git im Grundsatz eine verlinkte Liste von Commit-Objekten die auf eine Momentaufnahme (Snapshots) des Inhalts zeigt. Jetzt musst Du nur noch `fast-import` mitteilen, was dieses Snapshots sind, welche Commit-Daten zu ihnen zeigen und die Reihenfolge, in die sie gehören. Deine Strategie wir es sein, einen nach dem anderen durch die Snapshots zu gehen und Commits mit dem Inhalt eines jeden Verzeichnisses zu erzeigen und jeden dieser Commits anschließend mit dem vorherigen zu verknüpfen.

<!--As you did in the "An Example Git Enforced Policy" section of Chapter 7, we’ll write this in Ruby, because it’s what I generally work with and it tends to be easy to read. You can write this example pretty easily in anything you’re familiar with — it just needs to print the appropriate information to stdout. And, if you are running on Windows, this means you’ll need to take special care to not introduce carriage returns at the end your lines — git fast-import is very particular about just wanting line feeds (LF) not the carriage return line feeds (CRLF) that Windows uses.-->

Wie wir das schon im Abschnitt „(...)“ in Kapitel 7 getan haben, programmieren wir diese Lösung in Ruby, weil es die Sprache ist, mit der ich normalerweise arbeite und weil sie recht einfach zu lesen ist. Du kannst das Beispiel in so ziemlich jeder Sprache schreiben, mit der Du vertraut bist — es muss nur die passenden Informationen nach `stdout` schreiben.

<!--To begin, you’ll change into the target directory and identify every subdirectory, each of which is a snapshot that you want to import as a commit. You’ll change into each subdirectory and print the commands necessary to export it. Your basic main loop looks like this:-->

Zu Beginn musst Du in das Zielverzeichnis wechseln und jedes Unterverzeichnis identifizieren, das ein Snapshot ist, den Du als Commit importieren willst. Du wirst in jedes dieser Unterverzeichnisse wechseln und den entsprechenden Befehl auszugeben um es zu exportieren. Deine Schleife wird etwa so aussehen:

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

<!--You run `print_export` inside each directory, which takes the manifest and mark of the previous snapshot and returns the manifest and mark of this one; that way, you can link them properly. "Mark" is the `fast-import` term for an identifier you give to a commit; as you create commits, you give each one a mark that you can use to link to it from other commits. So, the first thing to do in your `print_export` method is generate a mark from the directory name:-->

Du führst `print_export` für jedes Verzeichnis aus. Das nimmt das Manifest und die Markierung des letzten Snapshots entgegen und gibt das Manifest und die Markierung des aktuellen zurück; auf diese Weise kannst Du sie passend verlinken. „Mark“ ist der `fast-import`-Begriff für eine ID, die Du einem Commit gibst. Während Du Commits anlegst, verpasst Du jedem einzelnen eine Markierung, die Du benutzen kannst, um von anderen Commits zu ihm zu linken. Daher ist das erste, was Deine `print_export`-Methode macht, eine Markierung aus dem Verzeichnisnamen zu erstellen:

	mark = convert_dir_to_mark(dir)

<!--You’ll do this by creating an array of directories and using the index value as the mark, because a mark must be an integer. Your method looks like this:-->

Das erreichst Du, indem Du ein Array von Verzeichnissen anlegst und den Index-Wert als Markierung verwendest (eine Markierung muss vom Typ `integer` sein). Deine Methode sieht so aus:

	$marks = []
	def convert_dir_to_mark(dir)
	  if !$marks.include?(dir)
	    $marks << dir
	  end
	  ($marks.index(dir) + 1).to_s
	end

<!--Now that you have an integer representation of your commit, you need a date for the commit metadata. Because the date is expressed in the name of the directory, you’ll parse it out. The next line in your `print_export` file is-->

Jetzt hast Du eine `integer`-Repräsentation Deines Commits und brauchst nur noch ein Datum für die Commit-Metadaten. Da das Datum im Verzeichnisnamen enthalten ist, parsen wir es einfach daraus. Die nächste Zeile in Deiner `print_export`-Datei lautet

	date = convert_dir_to_date(dir)

<!--where `convert_dir_to_date` is defined as-->

wobei `convert_dir_to_date` so definiert ist:

	def convert_dir_to_date(dir)
	  if dir == 'current'
	    return Time.now().to_i
	  else
	    dir = dir.gsub('back_', '')
	    (year, month, day) = dir.split('_')
	    return Time.local(year, month, day).to_i
	  end
	end

<!--That returns an integer value for the date of each directory. The last piece of meta-information you need for each commit is the committer data, which you hardcode in a global variable:-->

Die Funktion gibt einen Integer-Wert für das Datum eines jeden Verzeichnisses zurück. Das letzte Stück Meta-Information, das wir noch für jeden Commit brauchen, sind die Commit-Daten des Autors, die wir in eine globale Variable packen:

	$author = 'Scott Chacon <schacon@example.com>'

<!--Now you’re ready to begin printing out the commit data for your importer. The initial information states that you’re defining a commit object and what branch it’s on, followed by the mark you’ve generated, the committer information and commit message, and then the previous commit, if any. The code looks like this:-->

Jetzt können wir damit beginnen, die Commit-Daten für den Importer auszugeben. Die ursprüngliche Information gibt an, dass Du ein Commit-Objekt definierst und zu welchem Branch es gehört, gefolgt von der Markierung, die Du angelegt hast, der Committer-Information und der Commit-Nachricht und schließlich der ID des vorhergehenden Commits, falls dieser existiert. Der Code sieht wie folgt aus:

	# print the import information
	puts 'commit refs/heads/master'
	puts 'mark :' + mark
	puts "committer #{$author} #{date} -0700"
	export_data('imported from ' + dir)
	puts 'from :' + last_mark if last_mark

You hardcode the time zone (-0700) because doing so is easy. If you’re importing from another system, you must specify the time zone as an offset.
The commit message must be expressed in a special format:

	data (size)\n(contents)

The format consists of the word data, the size of the data to be read, a newline, and finally the data. Because you need to use the same format to specify the file contents later, you create a helper method, `export_data`:

	def export_data(string)
	  print "data #{string.size}\n#{string}"
	end

<!--All that’s left is to specify the file contents for each snapshot. This is easy, because you have each one in a directory — you can print out the `deleteall` command followed by the contents of each file in the directory. Git will then record each snapshot appropriately:-->

Alles, was jetzt noch übrig bleibt, ist das Feststellen des Dateiinhalts eines jeden Snapshots. Das ist einfach, weil Du jeden davon in einem Verzeichnis hast — Du kannst das `deleteall`-Kommando ausgeben, gefolgt von den Inhalten einer jeden Datei in dem Verzeichnis. Git wird dann jeden Snapshot entsprechend aufzeichnen:

	puts 'deleteall'
	Dir.glob("**/*").each do |file|
	  next if !File.file?(file)
	  inline_data(file)
	end

<!--Note:	Because many systems think of their revisions as changes from one commit to another, fast-import can also take commands with each commit to specify which files have been added, removed, or modified and what the new contents are. You could calculate the differences between snapshots and provide only this data, but doing so is more complex — you may as well give Git all the data and let it figure it out. If this is better suited to your data, check the `fast-import` man page for details about how to provide your data in this manner.-->

Anmerkung:	Da viele Systeme ihre Revisionen als Änderungen von einem Commit zu einem anderen betrachten, kann `fast-import` auch mit jedem Commit Kommandos entgegennehmen, die angeben, welche Dateien geändert, entfernt oder verändert wurden und was der neue Inhalt ist. Wir könnten die Unterschiede zwischen den Snapshots berechnen und nur diese Daten bereitstellen, aber das zu tun ist komplizierter — Du kannst Git auch einfach alle Daten füttern und es kümmert sich dann darum. Wenn dieses Vorgehen eher zu Deinen Daten passt, schau Dir die `fast-import` man-Seite an, um Details darüber zu erfahren, wie diese Daten dafür bereitgestellt werden müssen.

<!--The format for listing the new file contents or specifying a modified file with the new contents is as follows:-->

Das Format, in dem die Inhalte einer neuen Datei oder in eine geänderte Datei mit ihrem neuen Inhalt angegeben werden, sieht wie folgt aus:

	M 644 inline path/to/file
	data (size)
	(file contents)

<!--Here, 644 is the mode (if you have executable files, you need to detect and specify 755 instead), and inline says you’ll list the contents immediately after this line. Your `inline_data` method looks like this:-->

In diesem Beispiel ist 644 der Datei-Modus (wenn Du ausführbare Dateien hast, wirst Du möglicherweise 755 sehen bzw. einstellen), und inline gibt an, dass Du die Inhalte direkt im Anschluss an diese Zeile aufführen wirst. Deine `inline_data`-Methode sieht so aus:

	def inline_data(file, code = 'M', mode = '644')
	  content = File.read(file)
	  puts "#{code} #{mode} inline #{file}"
	  export_data(content)
	end

<!--You reuse the `export_data` method you defined earlier, because it’s the same as the way you specified your commit message data.-->

Du kannst die `export_data`-Methode, die Du vorher definiert hast, wiederverwenden, da wir das auf die gleiche Weise lösen, wie wir die Daten für die Commit-Nachrichten aufbereitet haben.

<!--The last thing you need to do is to return the current mark so it can be passed to the next iteration:-->

Das letzte, das wir jetzt noch machen müssen, ist, die gegenwärtige Marke zurückzugeben, damit sie an den nächsten Durchlauf übergeben werden kann.

	return mark

<!--NOTE: If you are running on Windows you’ll need to make sure that you add one extra step. As mentioned before, Windows uses CRLF for new line characters while git fast-import expects only LF. To get around this problem and make git fast-import happy, you need to tell ruby to use LF instead of CRLF:-->

	$stdout.binmode

<!--That’s it. If you run this script, you’ll get content that looks something like this:-->

Das ist alles. Wenn Du diese Skript laufen lässt, wirst Du eine Ausgabe erhalten, die etwa wie folgt aussieht:

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

<!--To run the importer, pipe this output through `git fast-import` while in the Git repository you want to import into. You can create a new directory and then run `git init` in it for a starting point, and then run your script:-->

Um den Importer zu starten, leite die Ausgabe durch eine Pipe zu `git fast-import` weiter — während Du im Git Verzeichnis befindest, in das Du importieren willst. Zum Anfang kannst Du ein neues Verzeichnis anlegen, darin `git init` laufen lassen und anschließend das Skript starten:

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

<!--As you can see, when it completes successfully, it gives you a bunch of statistics about what it accomplished. In this case, you imported 18 objects total for 5 commits into 1 branch. Now, you can run `git log` to see your new history:-->

Wie Du sehen kannst, werden Dir eine Menge Statistiken über den erreichten Erfolg angezeigt. In diesem Beispiel haben wir insgesamt 18 Objekte für 5 Commits in einen Zweig importiert. Jetzt kannst Du `git log` ausführen, um die neue History einzusehen:

	$ git log -2
	commit 10bfe7d22ce15ee25b60a824c8982157ca593d41
	Author: Scott Chacon <schacon@example.com>
	Date:   Sun May 3 12:57:39 2009 -0700

	    imported from current

	commit 7e519590de754d079dd73b44d695a42c9d2df452
	Author: Scott Chacon <schacon@example.com>
	Date:   Tue Feb 3 01:00:00 2009 -0700

	    imported from back_2009_02_03

<!--There you go — a nice, clean Git repository. It’s important to note that nothing is checked out — you don’t have any files in your working directory at first. To get them, you must reset your branch to where `master` is now:-->

Na also — jetzt haben wir ein schickes, sauberes Git-Repository. Dabei ist es wichtig, dass noch nichts ausgecheckt ist — zu Beginn hast Du keinerlei Dateien in Deinem Arbeitsverzeichnis. Um an sie heran zu kommen, musst Du Deinen Zweig dahin zurücksetzen, wo sich `master` gerade befindet:

	$ ls
	$ git reset --hard master
	HEAD is now at 10bfe7d imported from current
	$ ls
	file.rb  lib

<!--You can do a lot more with the `fast-import` tool — handle different modes, binary data, multiple branches and merging, tags, progress indicators, and more. A number of examples of more complex scenarios are available in the `contrib/fast-import` directory of the Git source code; one of the better ones is the `git-p4` script I just covered.-->

Du kannst noch eine ganze Menge mehr mit dem `fast-import`-Tool anstellen — es kann verschiedene Modi behandeln, Binärdaten, mehrere Zweige sowie Merges, Tags, Fortschrittsbalken und mehr. Eine Reihe von Beispielen komplexerer Szenarios werden im `contrib/fast-import`-Verzeichnis des Git-Quellcodes bereitgestellt; eines der besseren ist das `git-p4` -Skript, das ich gerade behandelt habe.

<!--# Summary-->