# Beispiel für die Durchsetzung von Richtlinien mit Hilfe von Git

<!--In this section, you’ll use what you’ve learned to establish a Git workflow that checks for a custom commit message format, enforces fast-forward-only pushes, and allows only certain users to modify certain subdirectories in a project. You’ll build client scripts that help the developer know if their push will be rejected and server scripts that actually enforce the policies.-->

In diesem Abschnitt werden wir die gelernten Dinge verwenden um einen Git Arbeitsablauf umzusetzen, der das Format der Commit Nachrichten prüft, nur Pushes zulässt, die einem Fast-Forward entsprechen und der es nur einem beschränkten Kreis von Nutzern ermöglicht einzelne Unterverzeichnisse innerhalb eines Projekts zu modifizieren. Wir werden Client Skripte erstellen, die für den Entwickler prüfen, ob seine Pushes abgelehnt werden würden und wir werden Server Skripte erstellen, die diese Richtlinien um- bzw. durchsetzen.

<!--I used Ruby to write these, both because it’s my preferred scripting language and because I feel it’s the most pseudocode-looking of the scripting languages; thus you should be able to roughly follow the code even if you don’t use Ruby. However, any language will work fine. All the sample hook scripts distributed with Git are in either Perl or Bash scripting, so you can also see plenty of examples of hooks in those languages by looking at the samples.-->

Ich habe für diese Hooks Ruby verwendet, weil es einerseits meine bevorzugte Skriptsprache ist und andererseits weil der resultierende Code nahezu einem leicht zu lesenden Pseudo-Code entspricht. Auch wenn Du Ruby normalerweise nicht einsetzt, solltest Du deshalb in der Lage sein, meinen Ausführungen zu folgen. Jede andere Sprache sollte aber genauso funktionieren. Alle Beispielskripte, die standardmäßig in Git enthalten sind, sind entweder Perl oder Bash Skripte. Für diese Sprache findest Du also auch genügend Beispiele.

<!--## Server-Side Hook-->
## Server Hooks

<!--All the server-side work will go into the update file in your hooks directory. The update file runs once per branch being pushed and takes the reference being pushed to, the old revision where that branch was, and the new revision being pushed. You also have access to the user doing the pushing if the push is being run over SSH. If you’ve allowed everyone to connect with a single user (like "git") via public-key authentication, you may have to give that user a shell wrapper that determines which user is connecting based on the public key, and set an environment variable specifying that user. Here I assume the connecting user is in the `$USER` environment variable, so your update script begins by gathering all the information you need:-->

Die gesamten Skripte für den Server gehören in die Update Datei in Deinem Hooks Verzeichnis. Die Update Datei wird für jeden Branch, der gepusht wird, gestartet und erhält als Parameter die Referenz, die gepusht wird, die alte Revision auf der der Branch stand und die neue Revision, die gepusht wird. Wenn der Push über SSH ausgeführt wird, hat es auch Zugriff auf den Benutzer mit dem der Push durchgeführt wird. Wenn Du den Server so konfiguriert hast, dass jeder über einen einzelnen Benutzer (zum Beispiel „git“) über das Public-Key Verfahren zugreifen kann, dann wäre es sinnvoll diesem Benutzer einen Shell Wrapper einzurichten, der über den öffentlichen Schlüssel die Identität feststellt und damit die Umgebungsvariablen für den jeweiligen Benutzer setzen kann. In dem Beispiel setze ich voraus, dass der Benutzer, der sich verbinden will, in der Umgebungsvariable `$USER` enthalten ist. Deshalb sammelt das Update Skript erstmal alle benötigten Informationen:

	#!/usr/bin/env ruby

	$refname = ARGV[0]
	$oldrev  = ARGV[1]
	$newrev  = ARGV[2]
	$user    = ENV['USER']

	puts "Enforcing Policies... \n(#{$refname}) (#{$oldrev[0,6]}) (#{$newrev[0,6]})"

<!--Yes, I’m using global variables. Don’t judge me — it’s easier to demonstrate in this manner.-->

Ja, ich verwende globale Variablen. Bitte steinigt mich dafür nicht. Auf diese Art und Weise ist es für mich einfacher das Ganze zu demonstrieren.

<!--### Enforcing a Specific Commit-Message Format-->
### Format der Commit Nachricht erzwingen

<!--Your first challenge is to enforce that each commit message must adhere to a particular format. Just to have a target, assume that each message has to include a string that looks like "ref: 1234" because you want each commit to link to a work item in your ticketing system. You must look at each commit being pushed up, see if that string is in the commit message, and, if the string is absent from any of the commits, exit non-zero so the push is rejected.-->

Deine erste Herausforderung wird es sein, sicherzustellen, dass jede Commit Nachricht einem bestimmten Format entspricht. Nehmen wir zum Beispiel an, dass jeder Commit mit einem Ticket in Deinem Issue-Tracking-System verknüpft sein soll. Deshalb soll jede Commit Nachricht diese Referenz in etwa dem Format „ref: 1234“ enthalten. Dazu musst Du jeden Commit, der gepusht werden soll, prüfen, ob der entsprechende Text enthalten ist. Ist er es nicht, so musst Du das entsprechende Skripte mit einem Rückgabewert ungleich Null beenden, damit der Push abgelehnt beziehungsweise abgebrochen wird.

<!--You can get a list of the SHA-1 values of all the commits that are being pushed by taking the `$newrev` and `$oldrev` values and passing them to a Git plumbing command called `git rev-list`. This is basically the `git log` command, but by default it prints out only the SHA-1 values and no other information. So, to get a list of all the commit SHAs introduced between one commit SHA and another, you can run something like this:-->

Eine Liste aller SHA-1 Prüfsummen, die gepusht werden sollen, erhälst Du, indem Du die Werte `$newrev` und `$oldrev` an das Git Kommando `git rev-list` übergibst (Dieser Befehl gehört zu den Low-Level Funktionen von Git. Im Englischen werden diese auch als „plumbing“ Befehle bezeichnet). Der Befehl entspricht dem `git log` Kommando, gibt aber im Gegensatz zu diesem nur die SHA-1 Prüfsummen und keine weitere Informationen aus. Um eine Liste aller SHA-1 Prüfsummen zwischen zwei Commits zu erhalten, musst Du in etwa folgendes eingeben:

	$ git rev-list 538c33..d14fc7
	d14fc7c847ab946ec39590d87783c69b031bdfb7
	9f585da4401b0a3999e84113824d15245c13f0be
	234071a1be950e2a8d078e6141f5cd20c1e61ad3
	dfa04c9ef3d5197182f13fb5b9b1fb7717d2222a
	17716ec0f1ff5c77eff40b7fe912f9f6cfd0e475

<!--You can take that output, loop through each of those commit SHAs, grab the message for it, and test that message against a regular expression that looks for a pattern.-->

Du kannst nun durch diese Liste iterieren und für jeden SHA-1 Commit die entsprechende Commit Nachricht anfordern und diese mit Hilfe eines regulären Ausdrucks auf das jeweilige Format prüfen.

<!--You have to figure out how to get the commit message from each of these commits to test. To get the raw commit data, you can use another plumbing command called `git cat-file`. I’ll go over all these plumbing commands in detail in Chapter 9; but for now, here’s what that command gives you:-->

Um dies durchführen zu können, benötigst Du das Wissen, wie man an die Commit Nachricht eines einzelnen Commits herankommt. Um die Rohdaten eines Commits zu erhalten, kannst Du eine andere Low-Level Funktion von Git verwenden, nämlich `git cat-file`. Weitere Low-Level Funktionen werde ich in Kapitel 9 näher erläutern, aber hier reicht es erst einmal, wenn Du das Kommando einfach mal ausprobierst:

	$ git cat-file commit ca82a6
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

<!--A simple way to get the commit message from a commit when you have the SHA-1 value is to go to the first blank line and take everything after that. You can do so with the `sed` command on Unix systems:-->

Um die Commit Nachricht auf Basis der SHA-1 Prüfsumme zu extrahieren, gibt es eine einfache Möglichkeit. Dazu musst Du die Position der ersten leeren Zeile bestimmen. Der gesamte Text nach dieser leeren Zeile entspricht der Commit Nachricht. Mit dem `sed` Befehl funktioniert das unter Unix Systemen ganz einfach:

	$ git cat-file commit ca82a6 | sed '1,/^$/d'
	changed the version number

<!--You can use that incantation to grab the commit message from each commit that is trying to be pushed and exit if you see anything that doesn’t match. To exit the script and reject the push, exit non-zero. The whole method looks like this:-->

Damit sollte es Dir auf einfache Art und Weise möglich sein, jede einzelne Commit Nachricht eines Commits, welcher gepusht werden soll, zu prüfen. Du kannst den Push abbrechen, sollte einer der Nachrichten nicht dem gewünschten Format entsprechen. Um ihn abzubrechen reicht es, wenn der Rückgabewert des Skripts ungleich Null ist. Zusammengefasst ergibt sich die folgende Methode:

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

<!--Putting that in your `update` script will reject updates that contain commits that have messages that don’t adhere to your rule.-->

Wenn Du diesen Auszug in Dein `update` Skript einbaust, wird jeder Push abgelehnt, der eine Commit Nachricht enthält, die nicht Deinen Regeln entspricht.

<!--### Enforcing a User-Based ACL System-->
### Einrichten eines benutzerspezifischen ACL-Systems

<!--Suppose you want to add a mechanism that uses an access control list (ACL) that specifies which users are allowed to push changes to which parts of your projects. Some people have full access, and others only have access to push changes to certain subdirectories or specific files. To enforce this, you’ll write those rules to a file named `acl` that lives in your bare Git repository on the server. You’ll have the `update` hook look at those rules, see what files are being introduced for all the commits being pushed, and determine whether the user doing the push has access to update all those files.-->

Nehmen wir einmal an, dass Du für Deine Projekte ein Mechanismus einrichten willst, der festlegt, wer auf welche Teile Deines Projekts pushen kann. Mit Hilfe einer Zugriffssteuerungsliste (ACL – Access Control List) ist so etwas möglich. Manche Benutzer sollen vollen Zugriff auf das gesamte Repository haben, andere widerrum dürfen nur auf bestimmte Unterverzeichnisse oder spezielle Dateien pushen. Um diese Regeln durchzusetzen werden wir eine Datei mit dem Namen `acl` erstellen und diese im Bare Repository auf Deinem Git Server ablegen. Außerdem werden wir den `update` Hook so anpassen, dass dieser die erstellten Regeln prüft und bestimmt, ob die jeweilige Aktion vom jeweiligen Benutzer ausgeführt werden darf. Dazu muss der Hook alle Commits, die gepusht werden, prüfen.

<!--The first thing you’ll do is write your ACL. Here you’ll use a format very much like the CVS ACL mechanism: it uses a series of lines, where the first field is `avail` or `unavail`, the next field is a comma-delimited list of the users to which the rule applies, and the last field is the path to which the rule applies (blank meaning open access). All of these fields are delimited by a pipe (`|`) character.-->

Der erste Schritt ist das Erstellen einer ACL. In unserem Beispiel verwenden wir ein Format, welches der CVS ACL sehr ähnlich ist. Jede Zeile ist nach dem selben Format aufgebaut. Das erste Feld einer Zeile enthält entweder `avail` oder `unavail`. Das nächste Feld ist ein kommaseparierte Liste aller User, auf die die Regel zutrifft. Das letzte Feld enthält den Pfad auf welche die Regel zutrifft (ein leeres Feld bedeutet in diesem Fall freien Zugriff). Alle Felder werden durch einen senkrechten Strich (`|`, auch Pipe genannt) getrennt.

<!--In this case, you have a couple of administrators, some documentation writers with access to the `doc` directory, and one developer who only has access to the `lib` and `tests` directories, and your ACL file looks like this:-->

In unserem Beispiel gibt es ein paar Administratoren, ein paar Leute, die sich um die Dokumentation im Verzeichnis `doc` kümmern, und einen Entwickler, der nur auf das `lib` und das `test` Verzeichnis zugreifen darf. In diesem Fall sollte die ACL Datei etwa folgendermaßen aussehen:

	avail|nickh,pjhyett,defunkt,tpw
	avail|usinclair,cdickens,ebronte|doc
	avail|schacon|lib
	avail|schacon|tests

<!--You begin by reading this data into a structure that you can use. In this case, to keep the example simple, you’ll only enforce the `avail` directives. Here is a method that gives you an associative array where the key is the user name and the value is an array of paths to which the user has write access:-->

Als erstes müssen wir die Daten in eine Struktur bringen, die wir einfach weiterverwenden können. Um das ganze Beispiel einfach zu halten, erzwingen wir hier nur die `avail` Direktive. Die folgende Funktion erzeugt ein assoziatives Array, in dem der Benutzername als Schlüssel verwendet wird. Der jeweilige Wert ist ein Array von Dateipfaden, auf die der Benutzer Zugriffsrechte besitzt.

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

<!--On the ACL file you looked at earlier, this `get_acl_access_data` method returns a data structure that looks like this:-->

Übergibt man der Funktion `get_acl_access_data` die oben overgestellte ACL wird eine Datenstruktur zurückgegeben, die etwa folgendermaßen aussieht:

	{"defunkt"=>[nil],
	 "tpw"=>[nil],
	 "nickh"=>[nil],
	 "pjhyett"=>[nil],
	 "schacon"=>["lib", "tests"],
	 "cdickens"=>["doc"],
	 "usinclair"=>["doc"],
	 "ebronte"=>["doc"]}

<!--Now that you have the permissions sorted out, you need to determine what paths the commits being pushed have modified, so you can make sure the user who’s pushing has access to all of them.-->

Nachdem wir auf diese Weise die jeweiligen Zugriffsrechte bestimmt haben, müssen wir noch rausfinden, welche Verzeichnisse bei den gepushten Commits geändert werden. Nur so können wir sicherstellen, dass ein Benutzer die entsprechenden Zugriffsrechte für das jeweilige Verzeichnis hat.

<!--You can pretty easily see what files have been modified in a single commit with the `-\-name-only` option to the `git log` command (mentioned briefly in Chapter 2):-->

Mit Hilfe des `git log` Befehls und der Option `--name-only` findet man sehr leicht heraus, welche Dateien in einem einzelnen Commit geändert wurden (dies haben wir bereits im Kapitel 2 vorgestellt):

	$ git log -1 --name-only --pretty=format:'' 9f585d

	README
	lib/test.rb

<!--If you use the ACL structure returned from the `get_acl_access_data` method and check it against the listed files in each of the commits, you can determine whether the user has access to push all of their commits:-->

Wenn wir nun die Liste der geänderten Dateien, mit der ACL Struktur, die `get_acl_access_data` zurückliefert, vergleichen, kann man ganz einfach herausfinden, ob der Benutzer das Recht hat, alle seine Commits zu pushen:

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

<!--Most of that should be easy to follow. You get a list of new commits being pushed to your server with `git rev-list`. Then, for each of those, you find which files are modified and make sure the user who’s pushing has access to all the paths being modified. One Rubyism that may not be clear is `path.index(access_path) == 0`, which is true if path begins with `access_path` — this ensures that `access_path` is not just in one of the allowed paths, but an allowed path begins with each accessed path.-->

Ich hoffe Du kannst dem Skript leicht folgen. Mit dem Befehl `git rev-list` erhälst Du eine Liste aller Dateien, die gepusht werden. Danach bestimmen wir für jeden Commit, welche Dateien geändert wurden und prüfen, ob der Benutzer auf diese Pfade zugreifen darf. Die Ruby-Zeile `path.index(access_path) == 0`, die vielleicht nicht so einfach zu verstehen ist, liefert true zurück, wenn path mit der gleichen Zeichenfolge beginnt, wie `access_path`. Das stellt sicher, dass `access_path` nicht nur innerhalb eines erlaubten Pfads als Zeichenfolge enthalten ist, sondern das wirklich der Anfang der Zeichenketten verglichen wird.

<!--Now your users can’t push any commits with badly formed messages or with modified files outside of their designated paths.-->

Ab jetzt haben alle Benutzer nur für die jeweils freigegebenen Verzeichnisse Zugriffsrechte und es ist sichergestellt, dass keine falsch formatierten Commit-Nachrichten gepusht werden können.

<!--### Enforcing Fast-Forward-Only Pushes-->
### Verweigern von Pushes, welche nicht einem Fast-Forward entsprechen

<!--The only thing left is to enforce fast-forward-only pushes. To do so, you can simply set the `receive.denyDeletes` and `receive.denyNonFastForwards` settings. But enforcing this with a hook will also work, and you can modify it to do so only for certain users or whatever else you come up with later.-->

Nun müssen wir unser System nur noch so einrichten, dass es nur Fast-Forward Push-Operationen zulässt. Man verwendet dafür die `receive.denyDeletes` und `receive.denyNonFastForwards` Konfigurationsparameter. Das gleiche Ergebnis kann man aber auch über einen Hook erreichen und diesen kann man dann so konfigurieren, dass die Regeln nur für bestimmte Benutzer gelten.

<!--The logic for checking this is to see if any commits are reachable from the older revision that aren’t reachable from the newer one. If there are none, then it was a fast-forward push; otherwise, you deny it:-->

Um herauszufinden, ob es sich um einen Fast-Forward handelt, müssen wir prüfen, ob alle Commits, die ausgehend von der letzten Revision erreichbar sind, auch von der neuen Revision aus erreichbar sind. Gibt es einen Commit auf den das nicht zutrifft, so war der Push kein Fast-Forward und wir verweigern ihn:

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

<!--Everything is set up. If you run `chmod u+x .git/hooks/update`, which is the file into which you should have put all this code, and then try to push a non-fast-forward reference, you’ll get something like this:-->

Das war es. Jetzt sollte alles eingerichtet sein. Wenn Du jetzt noch den Befehl `chmod u+x .git/hooks/update` für die Datei ausführst, in die Du den obigen Code eingefügt hast, und dann einen Push ausführst, welcher keinem Fast-Forward entspricht, erhälst Du in etwa folgende Ausgabe:

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

<!--There are a couple of interesting things here. First, you see this where the hook starts running.-->

Lass uns die Ausgabe etwas genauer anschauen, denn sie enthält ein paar interessante Dinge. An Hand der folgenden Zeile erkennst Du, wenn der Hook gestartet wird.

	Enforcing Policies...
	(refs/heads/master) (8338c5) (c5b616)

<!--Notice that you printed that out to stdout at the very beginning of your update script. It’s important to note that anything your script prints to stdout will be transferred to the client.-->

Bitte beachte, dass wir diesen Text beim Start des `update`-Skripts auf stdout ausgegeben haben. Es ist wichtig zu wissen, dass alles was Dein Skript auf stdout ausgibt, auf den Client übertragen wird und dort ausgegeben wird.

<!--The next thing you’ll notice is the error message.-->

Als nächstes haben wir da noch die folgende Fehlermeldung.

	[POLICY] Cannot push a non fast-forward reference
	error: hooks/update exited with error code 1
	error: hook declined to update refs/heads/master

<!--The first line was printed out by you, the other two were Git telling you that the update script exited non-zero and that is what is declining your push. Lastly, you have this:-->

Die erste Zeile hast Du innerhalb des Skripts ausgegeben. Die anderen zwei stammen von Git und teilen Dir mit, dass Dein `update`-Skript einen Rückgabewert ungleich Null zurückgegeben hat und das der Push verweigert wird. Als Letztes schauen wir uns noch die folgenden Zeilen an:

	To git@gitserver:project.git
	 ! [remote rejected] master -> master (hook declined)
	error: failed to push some refs to 'git@gitserver:project.git'

<!--You’ll see a remote rejected message for each reference that your hook declined, and it tells you that it was declined specifically because of a hook failure.-->

Du siehst dort eine „remote rejected“ Nachricht für jede Referenz, die Dein Hook verweigert hat. Zusätzlich wird dort angegeben, aus welchem Grund der Push verweigert wurde. In diesem Fall hat der Hook den Push verweigert.

<!--Furthermore, if the ref marker isn’t there in any of your commits, you’ll see the error message you’re printing out for that.-->

Wenn in einem Deiner Commits die Refernez zu dem Issue-Tracking-System fehlt, wird die folgende von Dir festgelegte Fehlermeldung ausgegeben.

	[POLICY] Your message is not formatted correctly

<!--Or if someone tries to edit a file they don’t have access to and push a commit containing it, they will see something similar. For instance, if a documentation author tries to push a commit modifying something in the `lib` directory, they see-->

Auch wenn jemand in einem Commit eine Datei geändert hat, die er eigentlich nicht ändern hätte dürfen, und dann versucht diesen Commit zu pushen, wird eine ähnliche Fehlermeldung ausgegeben. Wenn zum Beispiel einer der Jungs und Mädels aus dem Dokumentationsteam versucht einen Commit zu pushen, der irgendeine Änderung im Verzeichnis `lib` enthält, wird diesen die folgende Meldung angezeigt:

	[POLICY] You do not have access to push to lib/test.rb

<!--That’s all. From now on, as long as that `update` script is there and executable, your repository will never be rewound and will never have a commit message without your pattern in it, and your users will be sandboxed.-->

Von nun an wird Dein Repository immer in einem ordentlichen Zustand sein. Niemand kann Dein Repository durcheinanderbringen oder eine Commit-Nachricht einbringen, die nicht Deinen Vorgaben entspricht. Vorausgesetzt das `update`-Skript ist vorhanden und ausführbar.

<!--## Client-Side Hooks-->
## Client Hooks

<!--The downside to this approach is the whining that will inevitably result when your users’ commit pushes are rejected. Having their carefully crafted work rejected at the last minute can be extremely frustrating and confusing; and furthermore, they will have to edit their history to correct it, which isn’t always for the faint of heart.-->

Allerdings hat unser strenger `update`-Hook auch einen Nachteil. Du kannst Dich schon mal auf das unvermeidliche Jammern Deiner Mitarbeiter einstellen, wenn diese ihre Commits nicht pushen können, weil sie verweigert werden. Wenn Du deren mit viel Mühe erstellte Arbeit in letzter Minute ablehnst, kann das für die Benutzer extrem frustrierend und verwirrend sein. Dazu kommt noch, dass diese ihre Historie ändern müssen um das ganze zu korrigieren. Und das ist nicht immer etwas für schwache Nerven.

<!--The answer to this dilemma is to provide some client-side hooks that users can use to notify them when they’re doing something that the server is likely to reject. That way, they can correct any problems before committing and before those issues become more difficult to fix. Because hooks aren’t transferred with a clone of a project, you must distribute these scripts some other way and then have your users copy them to their `.git/hooks` directory and make them executable. You can distribute these hooks within the project or in a separate project, but there is no way to set them up automatically.-->

Um dieses Dilemma zu vermeiden, ist es sinnvoll Deinen Mitarbeiter eine Handvoll Client Hooks zur Verfügung zu stellen, die darauf hinweisen, dass der gerade durchgeführte Commit wahrscheinlich vom Server verweigert wird. Auf diese Art und Weise können Deine Mitarbeiter ihre Arbeit noch korrigieren bevor sie sie einchecken. Zu diesem Zeitpunkt sind die Probleme meistens noch einfacher zu lösen. Da die Hooks während des Klonvorgangs nicht mitübertragen werden, musst Du diese auf andere Weise zur Verfügung stellen. Die Benutzer müssen diese Hooks dann auch noch in ihr `.git/hooks`-Verzeichnis kopieren und ausführbar machen. Du kannst die Hooks auch in Deinem Projekt oder in einem separaten Projekt verwalten und verteilen. Allerdings gibt es keine Möglichkeit, dass diese automatisch eingerichtet werden. Dies muss vom Nutzer selber durchgeführt werden.

<!--To begin, you should check your commit message just before each commit is recorded, so you know the server won’t reject your changes due to badly formatted commit messages. To do this, you can add the `commit-msg` hook. If you have it read the message from the file passed as the first argument and compare that to the pattern, you can force Git to abort the commit if there is no match:-->

Als erstes fangen wir damit an, die Commit-Nachrichten beim Einchecken zu prüfen. Damit ist sichergestellt, dass Dein Server die Commits und damit die Änderungen nicht ablehnt, weil sie eine falsch formatierte Commit-Nachricht enthalten. Um dies sicherzustellen, kannst Du den `commit-msg`-Hook einrichten. Wenn Du in diesem die Nachricht aus der im ersten Argument übergebenen Datei ausliest und mit Deinem Muster vergleichst, kannst Du Git dazu bringen, dass der Commit abgebrochen wird, wenn das Muster nicht passt:

	#!/usr/bin/env ruby
	message_file = ARGV[0]
	message = File.read(message_file)

	$regex = /\[ref: (\d+)\]/

	if !$regex.match(message)
	  puts "[POLICY] Your message is not formatted correctly"
	  exit 1
	end

<!--If that script is in place (in `.git/hooks/commit-msg`) and executable, and you commit with a message that isn’t properly formatted, you see this:-->

Wenn dieses Skript an der richtigen Stelle (`.git/hooks/commit-msg`) liegt und ausführbar ist und ein Commit durchgeführt wird, welcher nicht korrekt formatiert ist, wirst Du folgende Ausgabe sehen:

	$ git commit -am 'test'
	[POLICY] Your message is not formatted correctly

<!--No commit was completed in that instance. However, if your message contains the proper pattern, Git allows you to commit:-->

In diesem Fall wurde der Commit nicht durchgeführt. Wenn die Commit-Nachricht allerdings richtig formatiert ist, erlaubt Git den Commit:

	$ git commit -am 'test [ref: 132]'
	[master e05c914] test [ref: 132]
	 1 files changed, 1 insertions(+), 0 deletions(-)

<!--Next, you want to make sure you aren’t modifying files that are outside your ACL scope. If your project’s `.git` directory contains a copy of the ACL file you used previously, then the following `pre-commit` script will enforce those constraints for you:-->

Als nächstes möchten wir sicherstellen, dass Dateien nur von den Personen geändert werden, die diese auch ändern dürfen. Dazu verwenden wir wieder die Zugriffssteuerungsliste. Wenn Dein lokales `.git`-Verzeichnis eine Kopie der ACL Datei enthält, die wir vorher erstellt haben, kann das folgende `pre-commit`-Skript dafür sorgen, dass die Regeln eingehalten werden.

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

<!--This is roughly the same script as the server-side part, but with two important differences. First, the ACL file is in a different place, because this script runs from your working directory, not from your Git directory. You have to change the path to the ACL file from this-->

Das vorgestellte Skript entspricht nahezu dem Skript, welches wir für den Server erstellt haben. Bis auf zwei wichtige Ausnahmen. Erstens, die ACL Datei befindet sich an einem anderen Speicherort, da das Skript ausgehend von Deinem Arbeitsverzeichnis und nicht ausgehend von Deinem Git-Verzeichnis ausgeführt wird. Aus diesem Grund muss der Pfad zu der ACL Datei von

	access = get_acl_access_data('acl')

<!--to this:-->

nach

	access = get_acl_access_data('.git/acl')

geändert werden.

<!--The other important difference is the way you get a listing of the files that have been changed. Because the server-side method looks at the log of commits, and, at this point, the commit hasn’t been recorded yet, you must get your file listing from the staging area instead. Instead of-->

Der andere wichtige Unterschied besteht darin, auf welche Art und Weise Du eine Liste der geänderten Dateien erhälst. Auf dem Server haben wir die Möglichkeit die Commits zu durchsuchen. Diese Möglichkeit haben wir beim Client nicht, da der Commit noch gar nicht ausgeführt wurde. Deswegen müssen wir die Dateien aus der Staging Area prüfen. Statt

	files_modified = `git log -1 --name-only --pretty=format:'' #{ref}`

<!--you have to use-->

musst Du folgende Zeile verwenden:

	files_modified = `git diff-index --cached --name-only HEAD`

<!--But those are the only two differences — otherwise, the script works the same way. One caveat is that it expects you to be running locally as the same user you push as to the remote machine. If that is different, you must set the `$user` variable manually.-->

Das sind die einzigen Unterschiede, ansonsten funktioniert das Skript auf die gleiche Art und Weise. Ein Nachteil besteht darin, dass davon ausgegangen wird, dass das Skript mit dem gleichen Benutzer ausgeführt wird, wie die Commits auf den Remote gepusht werden. Wenn sich diese unterscheiden, muss die `$user`-Variable manuell angepasst werden.

<!--The last thing you have to do is check that you’re not trying to push non-fast-forwarded references, but that is a bit less common. To get a reference that isn’t a fast-forward, you either have to rebase past a commit you’ve already pushed up or try pushing a different local branch up to the same remote branch.-->

Im letzten Schritt müssen wir noch prüfen, ob versucht wird einen Push durchzuführen, der keinem Fast-Forward entspricht. Das kommt normalerweise aber nicht so oft vor. Dazu muss entweder ein Rebase für Commits durchgeführt werden, die bereits gepusht wurden oder es muss ein lokaler Branch gepusht werden, dessen Name bereits auf dem Remote vorhanden ist und eine andere Historie aufweist.

<!--Because the server will tell you that you can’t push a non-fast-forward anyway, and the hook prevents forced pushes, the only accidental thing you can try to catch is rebasing commits that have already been pushed.-->

Da der Server bereits jeden Push ablehnt, der nicht einem Fast-Forward entspricht und alle Push verweigert werden, die die Historie ändern würden, kann man jetzt nur noch prüfen, ob der Benutzer einen Rebase für bereits gepushte Commits durchführt.

<!--Here is an example pre-rebase script that checks for that. It gets a list of all the commits you’re about to rewrite and checks whether they exist in any of your remote references. If it sees one that is reachable from one of your remote references, it aborts the rebase:-->

Hier möchte ich ein Beispiel `pre-rebase`-Skript vorstellen, welches diese Prüfung vornimmt. Es bestimmt eine Liste aller Commits, die neu geschrieben werden und prüft, ob diese bereits auf irgendeinem Remote vorhanden sind. Wenn dies der Fall ist, wird der Rebase abgebrochen:

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

<!--This script uses a syntax that wasn’t covered in the Revision Selection section of Chapter 6. You get a list of commits that have already been pushed up by running this:-->

Das Skript verwendet eine Syntax, die wir bereits im Kapitel 6.1 verwendet haben. Man erhält eine Liste aller Commits, die bereits gepusht wurden, wenn folgender Befehl ausgeführt wird:

	git rev-list ^#{sha}^@ refs/remotes/#{remote_ref}

<!--The `SHA^@` syntax resolves to all the parents of that commit. You’re looking for any commit that is reachable from the last commit on the remote and that isn’t reachable from any parent of any of the SHAs you’re trying to push up — meaning it’s a fast-forward.-->

Die `SHA^@`-Syntax gibt an, dass alle Eltern-Commits miteinbezogen werden sollen. Man sucht auf diese Art und Weise nach allen Commits, die ausgehend vom letzten auf dem Server vorhandenen Commit, erreichbar sind und nach allen Commits, die ausgehend von dem letzten zu pushenden Commit, nicht erreichbar sind.

<!--The main drawback to this approach is that it can be very slow and is often unnecessary — if you don’t try to force the push with `-f`, the server will warn you and not accept the push. However, it’s an interesting exercise and can in theory help you avoid a rebase that you might later have to go back and fix.-->

Diese Methode ist allerdings auch sehr langsam und meistens auch unnötig. Wenn ein Push ohne die Option `-f` ausgeführt wird und es sich um einen Push handelt, der keinem Fast-Forward entspricht, wird der Server eine Warnung ausgeben und den Push nicht akzeptieren. Allerdings ist diese Methode eine interessante Übung und kann zumindest in der Theorie verhindern, dass ein Rebase durchgeführt wird, der später wieder rückgängig gemacht werden müsste.

<!--# Summary-->