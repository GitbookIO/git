# Die Refspec

<!--Throughout this book, you’ve used simple mappings from remote branches to local references; but they can be more complex.-->
<!--Suppose you add a remote like this:-->

In diesem Buch haben wir bisher einfache Zuweisungen von externen Branches auf lokale Referenzen verwendet. Sie können aber auch durchaus komplex sein. Nehmen wir an, Du hast ein Remote-Repository wie folgt definiert:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git

<!--It adds a section to your `.git/config` file, specifying the name of the remote (`origin`), the URL of the remote repository, and the refspec for fetching:-->

Das fügt eine Sektion in Deine `.git/config`-Datei hinzu, die Deinen lokalen Namen des externen Repositorys (`origin`), dessen URL und die Refspec spezifiziert, mit der neue Daten heruntergeladen werden.

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*

<!--The format of the refspec is an optional `+`, followed by `<src>:<dst>`, where `<src>` is the pattern for references on the remote side and `<dst>` is where those references will be written locally. The `+` tells Git to update the reference even if it isn’t a fast-forward.-->

Das Format der Refspec besteht aus einem optionalen `+` gefolgt von `<Quelle>:<Ziel>`, wobei `<Quelle>` ein Muster für Referenzen auf der Remote-Seite ist, und `<Ziel>` angibt, wohin diese Referenzen lokal geschrieben werden. Das `+` weist Git an, die Referenz zu mergen, wenn sie nicht mit einem Fast-forward aktualisiert werden kann.

<!--In the default case that is automatically written by a `git remote add` command, Git fetches all the references under `refs/heads/` on the server and writes them to `refs/remotes/origin/` locally. So, if there is a `master` branch on the server, you can access the log of that branch locally via-->

Der Standard, der von `git remote add` automatisch eingerichtet wird, besteht darin, dass Git automatisch alle Referenzen unter `refs/heads/` vom Server holt und sie lokal nach `refs/remotes/origin` speichert. D.h., wenn es auf dem Server einen Branch `master` gibt, kannst Du auf das Log dieses Branches wie folgt zugreifen:

	$ git log origin/master
	$ git log remotes/origin/master
	$ git log refs/remotes/origin/master

<!--They’re all equivalent, because Git expands each of them to `refs/remotes/origin/master`.-->

Diese Varianten sind allesamt äquivalent, weil Git sie jeweils zu `refs/remotes/origin/master` vervollständigt.

<!--If you want Git instead to pull down only the `master` branch each time, and not every other branch on the remote server, you can change the fetch line to-->

Wenn Du stattdessen willst, dass Git jeweils nur den Branch `master` herunterlädt und andere Branches auf dem Server ignoriert, kannst Du die `fetch`-Zeile wie folgt ändern:

	fetch = +refs/heads/master:refs/remotes/origin/master

<!--This is just the default refspec for `git fetch` for that remote. If you want to do something one time, you can specify the refspec on the command line, too. To pull the `master` branch on the remote down to `origin/mymaster` locally, you can run-->

Dies ist allerdings lediglich der Standardwert der Refspec und Du kannst ihn auf der Kommandozeile jederzeit überschreiben. Um zum Beispiel nur den Branch `master` vom Server lokal als `origin/mymaster` zu speichern, kannst Du Folgendes ausführen:

	$ git fetch origin master:refs/remotes/origin/mymaster

<!--You can also specify multiple refspecs. On the command line, you can pull down several branches like so:-->

Du kannst auch mehrere Refspecs gleichzeitig spezifizieren. Um mehrere Branches zu holen kannst du folgenden Befehl in die Kommandozeile eingeben:

	$ git fetch origin master:refs/remotes/origin/mymaster \
	   topic:refs/remotes/origin/topic
	From git@github.com:schacon/simplegit
	 ! [rejected]        master     -> origin/mymaster  (non fast forward)
	 * [new branch]      topic      -> origin/topic

<!--In this case, the master branch pull was rejected because it wasn’t a fast-forward reference. You can override that by specifying the `+` in front of the refspec.-->

In diesem Fall wurde ein Pull zurückgewiesen, weil der Branch nicht mit einem simplen Fast-forward aktualisiert werden konnte. Du kannst einen Merge erzwingen, indem Du der Refspec ein `+` voranstellst.

<!--You can also specify multiple refspecs for fetching in your configuration file. If you want to always fetch the master and experiment branches, add two lines:-->

Du kannst außerdem natürlich auch mehrere Refspecs in Deiner Konfiguration spezifizieren. Wenn Du z.B. immer die Branches `master` und `experiment` holen willst, fügst Du die folgenden Zeilen hinzu:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/experiment:refs/remotes/origin/experiment

<!--You can’t use partial globs in the pattern, so this would be invalid:-->

Du kannst keine partiellen Glob-Muster verwenden, d.h. Folgendes wäre ungültig:

	fetch = +refs/heads/qa*:refs/remotes/origin/qa*

<!--However, you can use namespacing to accomplish something like that. If you have a QA team that pushes a series of branches, and you want to get the master branch and any of the QA team’s branches but nothing else, you can use a config section like this:-->

Allerdings kannst Du Namensräume verwenden, um etwas Ähnliches zu erreichen. Nehmen wir an, Du hast ein QA-Team, das regelmäßig verschiedene Branches pusht, und Du willst nun den Branch master und sämtliche Branches des QA-Teams, aber keine anderen Branches haben. Dann kannst Du eine Config-Sektion wie die folgende verwenden:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/master:refs/remotes/origin/master
	       fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*

<!--If you have a complex workflow process that has a QA team pushing branches, developers pushing branches, and integration teams pushing and collaborating on remote branches, you can namespace them easily this way.-->

In einem großen Team mit einem komplexen Workflow, in dem ein QA-Team, Entwickler und ein Integrations-Team jeweils eigene Branches pushen, kann man auf diese Weise Branches einfach in Namensräume einteilen.

<!--## Pushing Refspecs-->
## Refspecs pushen

<!--It’s nice that you can fetch namespaced references that way, but how does the QA team get their branches into a `qa/` namespace in the first place? You accomplish that by using refspecs to push.-->

Wie aber legt das QA-Team die Branches im `qa/` Namensraum ab? Das geht, indem man mit einer Refspec pusht.

<!--If the QA team wants to push their `master` branch to `qa/master` on the remote server, they can run-->

Wenn das QA-Team seinen Branch `master` in einem externen Repository als `qa/master` speichern will, kann es das wie folgt tun:

	$ git push origin master:refs/heads/qa/master

<!--If they want Git to do that automatically each time they run `git push origin`, they can add a `push` value to their config file:-->

Um Git so zu konfigurieren, dass diese Refspec jedes Mal automatisch für `git push origin` verwendet wird, kann man den `push` Wert in der Config-Datei setzen:

	[remote "origin"]
	       url = git@github.com:schacon/simplegit-progit.git
	       fetch = +refs/heads/*:refs/remotes/origin/*
	       push = refs/heads/master:refs/heads/qa/master

<!--Again, this will cause a `git push origin` to push the local `master` branch to the remote `qa/master` branch by default.-->

Auf diese Weise wird `git push origin` den lokalen Branch `master` als `qa/master` auf dem Server `origin` speichern.

<!--## Deleting References-->
## Referenzen löschen

<!--You can also use the refspec to delete references from the remote server by running something like this:-->

Man kann Refspecs außerdem verwenden, um Referenzen aus einem externen Repository zu löschen:

	$ git push origin :topic

<!--Because the refspec is `<src>:<dst>`, by leaving off the `<src>` part, this basically says to make the topic branch on the remote nothing, which deletes it.-->

Das Refspec Format ist `<Quelle>:<Ziel>`. Wenn man den Teil `<Quelle>` weglässt, dann heißt das im obigen Beispiel, dass man den Branch `topic` auf dem Server `origin` auf „nichts“ setzt, d.h. also löscht.

<!--# Transfer Protocols-->