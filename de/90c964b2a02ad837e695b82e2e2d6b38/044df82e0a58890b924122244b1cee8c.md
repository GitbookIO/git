# Git Hooks

<!--Like many other Version Control Systems, Git has a way to fire off custom scripts when certain important actions occur. There are two groups of these hooks: client side and server side. The client-side hooks are for client operations such as committing and merging. The server-side hooks are for Git server operations such as receiving pushed commits. You can use these hooks for all sorts of reasons, and you’ll learn about a few of them here.-->

Genau wie bei vielen anderen Versionskontrollsystemen gibt es auch bei Git die Möglichkeit eigene Skripte zu starten, wenn bestimmte, wichtige Ereignisse auftreten. Es gibt zwei Gruppen dieser Einschubmethoden: Hooks für den Client und Hooks für den Server. Die Hooks für den Client können bei Ereignissen, wie zum Beispiel einem Commit oder Merge, eingerichtet werden. Die Hooks für den Server können bei Operationen wie den Empfang von hochgeladenen Commits, ausgeführt werden. Es gibt viele Möglichkeiten diese Hooks sinnvoll einzusetzen. Einige davon werde ich hier vorstellen.

<!--## Installing a Hook-->
## Installieren eines Hooks

<!--The hooks are all stored in the `hooks` subdirectory of the Git directory. In most projects, that’s `.git/hooks`. By default, Git populates this directory with a bunch of example scripts, many of which are useful by themselves; but they also document the input values of each script. All the examples are written as shell scripts, with some Perl thrown in, but any properly named executable scripts will work fine — you can write them in Ruby or Python or what have you. These example hook files end with .sample; you’ll need to rename them.-->

Sämtliche Hooks werden im `hooks` Unterverzeichnis des Git Verzeichnisses gespeichert. In den meisten Projekten wird das `.git/hooks` sein. Git installiert in dieses Verzeichnis standardmäßig Beispielskripte. Einige davon sind auch ohne Änderung nützlich und sofort einsetzbar. Zusätzlich dokumentieren diese Beispiele die Eingabewerte des jeweiligen Skripts. Alle Beispiele sind Shellskripte, die hier und da ein Paar Zeilen Perl Code enthalten. Prinzipiell sollte aber jedes ausführbare Skript funktionieren, wenn es korrekt benannt wird. Du kannst also die Skriptsprache Deiner Wahl verwenden, z.B. Ruby oder Python. Die Beispieldateien haben die Endung .sample, sie müssen also nur noch umbenannt werden.

<!--To enable a hook script, put a file in the `hooks` subdirectory of your Git directory that is named appropriately and is executable. From that point forward, it should be called. I’ll cover most of the major hook filenames here.-->

Um ein Hook-Skript zu aktivieren, speichere eine entsprechend benannte und ausführbare Datei im `hooks` Unterverzeichnis Deines Git Verzeichnisses. Von diesem Augenblick an sollte es ausgeführt werden. Ich werde hier die meisten der wichtigen Hook Dateinamen besprechen.

<!--## Client-Side Hooks-->
## Hooks für den Client

<!--There are a lot of client-side hooks. This section splits them into committing-workflow hooks, e-mail-workflow scripts, and the rest of the client-side scripts.-->

Es gibt eine Menge Hooks auf Seiten des Clients. Der folgende Abschnitt teilt die Hooks in drei Gruppen auf: Skripte für den Commit Vorgang, Skripte für den Arbeitsablauf mit E-Mails und den Rest der Client Skripte.

<!--### Committing-Workflow Hooks-->
### Hooks für den Commit Vorgang

<!--The first four hooks have to do with the committing process. The `pre-commit` hook is run first, before you even type in a commit message. It’s used to inspect the snapshot that’s about to be committed, to see if you’ve forgotten something, to make sure tests run, or to examine whatever you need to inspect in the code. Exiting non-zero from this hook aborts the commit, although you can bypass it with `git commit -\-no-verify`. You can do things like check for code style (run lint or something equivalent), check for trailing whitespace (the default hook does exactly that), or check for appropriate documentation on new methods.-->

Die ersten vier Hooks hängen mit dem Commit Prozess zusammen. Der `pre-commit` Hook wird zuerst ausgeführt, schon bevor Du die Commit Nachricht eingegeben hast. Der Hook wird oft benutzt, um den zu versionierenden Zustand des Arbeitsverzeichnisses zu prüfen, um festzustellen ob etwas vergessen wurde, um sicherzustellen das Tests ausgeführt wurden oder aus irgendeinem anderen Grund, der es nötig macht, den Code vor dem Commit zu inspizieren. Wenn das entsprechende Skript einen Wert ungleich Null zurückgibt, wird der Commit abgebrochen. Auch für die Prüfung, ob Kodierrichtlinien eingehalten wurden oder für eine statische Codeanalyse (z.B. mit lint oder einem entsprechenden Programm) kann dieses Skript verwendet werden. Das von Git installierte Beispielskript prüft zum Beispiel, ob am Zeilenende Leerzeichen vorhanden sind. Der Hook kann mit `git commit --no-verify` auch umgangen werden.

<!--The `prepare-commit-msg` hook is run before the commit message editor is fired up but after the default message is created. It lets you edit the default message before the commit author sees it. This hook takes a few options: the path to the file that holds the commit message so far, the type of commit, and the commit SHA-1 if this is an amended commit. This hook generally isn’t useful for normal commits; rather, it’s good for commits where the default message is auto-generated, such as templated commit messages, merge commits, squashed commits, and amended commits. You may use it in conjunction with a commit template to programmatically insert information.-->

Der `prepare-commit-msg` Hook wird ausgeführt, bevor der Editor für die Commit Nachricht geöffnet wird, aber nachdem die Standardnachricht erstellt wurde. Er erlaubt es die Standardnachricht zu modifizieren, bevor der Autor des Commits sie sieht. Dieser Hook akzeptiert diverse Optionen: den Pfad der Datei, die die bisherige Commit Nachricht enthält, den Typ des Commit und den SHA-1 Hash des Commit, falls es sich um ein Korrektur-Commit handelt. Dieser Hook ist üblicherweise nicht sehr nützlich bei normalen Commits; er ist eher für solche Commits gedacht, bei denen die Standardnachricht automatisch generiert wird, wie zum Beispiel vorlagenbasierte Commit Nachrichten, Commits nach einem Merge, Commits, die zusammengeführt werden und Korrektur-Commits. Du kannst diesen Hook mit einer Commit Vorlage kombinieren, um automatisiert Informationen einzufügen.

<!--The `commit-msg` hook takes one parameter, which again is the path to a temporary file that contains the current commit message. If this script exits non-zero, Git aborts the commit process, so you can use it to validate your project state or commit message before allowing a commit to go through. In the last section of this chapter, I’ll demonstrate using this hook to check that your commit message is conformant to a required pattern.-->

Der `commit-msg` Hook akzeptiert einen Parameter, der wiederum der Pfad zu der temporären Datei ist, die die momentane Commit Nachricht enthält. Falls dieses Skript nicht Null zurückgibt, so wird der Commit abgebrochen. Damit kannst Du die Gültigkeit des Projekstatus oder die Commit Nachricht prüfen, bevor ein Commit akzeptiert wird. Im letzten Abschnitt dieses Kapitels werde ich beschreiben, wie man diesen Hook benutzt, um sicherzustellen, dass Commit Nachrichten einem bestimmten Muster entsprechen.

<!--After the entire commit process is completed, the `post-commit` hook runs. It doesn’t take any parameters, but you can easily get the last commit by running `git log -1 HEAD`. Generally, this script is used for notification or something similar.-->

Wenn ein Commit komplett abgeschlossen wurde, wird der `post-commit` Hook ausgeführt. Er akzeptiert keine Parameter, aber Du kannst den letzten Commit einfach mit dem Befehl `git log -1 HEAD` abfragen. Dieses Skript wird üblicherweise für das Senden von Benachrichtigungen oder ähnlichem benutzt.

<!--The committing-workflow client-side scripts can be used in just about any workflow. They’re often used to enforce certain policies, although it’s important to note that these scripts aren’t transferred during a clone. You can enforce policy on the server side to reject pushes of commits that don’t conform to some policy, but it’s entirely up to the developer to use these scripts on the client side. So, these are scripts to help developers, and they must be set up and maintained by them, although they can be overridden or modified by them at any time.-->

Diese Skripte für den Commit Prozess können für jeden anderen Arbeitsablauf entsprechend angepasst werden. Oft werden sie benutzt um bestimmte Regeln zu erzwingen. Dabei ist es wichtig zu wissen, dass diese Skripte beim Klonen eines Repositorys nicht mit übertragen werden. Du kannst auf Seiten des Servers die Einhaltung von bestimmten Regeln erzwingen indem die hochgeladenen Commits abgelehnt werden, wenn sie diesen Prinzipien nicht entsprechen. Auf dem Client entscheidet aber der Anwender selber, ob er diese Skripte verwendet oder nicht. Dies sind also Skripte, die den Entwicklern helfen sollen, und sie müssen von ihnen erstellt und gepflegt werden. Aber sie können auch von ihnen jederzeit verändert oder umgangen werden.

<!--### E-mail Workflow Hooks-->
### Hooks für den Arbeitsablauf mit E-Mails

<!--You can set up three client-side hooks for an e-mail-based workflow. They’re all invoked by the `git am` command, so if you aren’t using that command in your workflow, you can safely skip to the next section. If you’re taking patches over e-mail prepared by `git format-patch`, then some of these may be helpful to you.-->

Für einen E-Mail basierten Arbeitsablauf kannst Du drei Hooks auf dem Client einrichten. Sie werden alle bei Ausführung des Befehls `git am` aufgerufen. Wenn Du also diesen Befehl in Deinem normalen Arbeitsablauf nicht verwendest, kann Du guten Gewissens zum nächsten Abschnitt springen. Falls Du aber Patches per E-Mail erhälst, die mit `git format-patch` erstellt wurden, könnten trotzdem einige dieser Skripte nützlich für Dich sein.

<!--The first hook that is run is `applypatch-msg`. It takes a single argument: the name of the temporary file that contains the proposed commit message. Git aborts the patch if this script exits non-zero. You can use this to make sure a commit message is properly formatted or to normalize the message by having the script edit it in place.-->

Der erste Hook, der ausgeführt wird, ist `applypatch-msg`. Er akzeptiert genau einen Parameter: den Namen der temporären Datei, die die vorgegebene Commit Nachricht enthält. Git bricht den Patch ab, falls dieses Skript nicht Null zurückgibt. Du kannst dies benutzen um sicherzustellen, dass die Commit Nachricht richtig formatiert ist, oder um die Nachricht zu standardisieren, indem das Skript sie direkt editiert.

<!--The next hook to run when applying patches via `git am` is `pre-applypatch`. It takes no arguments and is run after the patch is applied, so you can use it to inspect the snapshot before making the commit. You can run tests or otherwise inspect the working tree with this script. If something is missing or the tests don’t pass, exiting non-zero also aborts the `git am` script without committing the patch.-->

Der nächste Hook, der beim Anwenden von Patches via `git am` ausgeführt wird, ist `pre-applypatch`. Er benötigt keine Parameter und wird direkt nach Anwendung des Patches ausgeführt. Damit kannst Du den Zustand Deines Projektes noch vor dem eigentlich Commit inspizieren. Du kannst mit diesem Skript Tests ablaufen lassen oder das Arbeitsverzeichnis anderweitig untersuchen. Falls etwas fehlt oder ein Test fehlschlägt, sorgt eine Beenden des Skripts mit einem Wert ungleich Null ebenfalls für das Abbrechen des `git am` Skripts. Es wird also auch kein Commit ausgeführt.

<!--The last hook to run during a `git am` operation is `post-applypatch`. You can use it to notify a group or the author of the patch you pulled in that you’ve done so. You can’t stop the patching process with this script.-->

Der letzte Hook, der während der `git am` Operation ausgeführt wird, ist `post-applypatch`. Du kannst dies verwenden, um eine Benutzergruppe oder den Autoren des Patches darueber zu informieren, dass der Patch übernommen wurde. Der eigentliche Patch Vorgang kann mit diesem Skript aber nicht mehr abgebrochen werden.

<!--### Other Client Hooks-->
### Weitere Hooks für den Client

<!--The `pre-rebase` hook runs before you rebase anything and can halt the process by exiting non-zero. You can use this hook to disallow rebasing any commits that have already been pushed. The example `pre-rebase` hook that Git installs does this, although it assumes that next is the name of the branch you publish. You’ll likely need to change that to whatever your stable, published branch is.-->

Der `pre-rebase` Hook wird ausgeführt, bevor ein Rebase gestartet wird. Durch einen Rückgabewert ungleich Null kann der Rebase Vorgang abgebrochen werden. Du kannst diesen Hook dazu verwenden um beispielsweise zu verhindern, dass auf bereits gepushte Commits ein Rebase durchgeführt wird. Der von Git installierte Beispiel-Hook für `pre-rebase` macht genau das. Allerdings nimmt dieser an, dass der Name des veröffentlichten Branches ‚next‘ ist. Du musst wahrscheinlich den Namen durch den Deines stabilen, öffentlichen Branches ersetzen.

<!--After you run a successful `git checkout`, the `post-checkout` hook runs; you can use it to set up your working directory properly for your project environment. This may mean moving in large binary files that you don’t want source controlled, auto-generating documentation, or something along those lines.-->

Nach jedem erfolgreichen `git-checkout` wird der `post-checkout` Hook ausgeführt. Du kannst ihn verwenden, um Dein Arbeitsverzeichnis  für Deine Arbeitsumgebung einzurichten. Das kann das Hinzukopieren großer Binärdateien bedeuten, die Du nicht unter Versionskontrolle stellen möchtest, das automatisierte Generieren von Dokumentation, oder entsprechend ähnliche Aktionen.

<!--Finally, the `post-merge` hook runs after a successful `merge` command. You can use it to restore data in the working tree that Git can’t track, such as permissions data. This hook can likewise validate the presence of files external to Git control that you may want copied in when the working tree changes.-->

Der letzte Hook, den ich vorstellen möchte, ist der `post-merge` Hook. Er wird nach jedem erfolgreichen Aufruf von `merge` ausgeführt. Du kannst diesen benutzen, um Daten in Deinem Arbeitsverzeichnis wiederherzustellen, die Git nicht unter Versionskontrolle stellen kann. Das sind zum Beispiel Berechtigungsdaten. Dieser Hook kann genauso überprüfen, ob Dateien, die nicht unter Versionskontrolle stehen, entsprechend in das Arbeitsverzeichnis kopiert worden sind, wenn sich dieses ändert.

<!--## Server-Side Hooks-->
## Serverseitige Hooks

<!--In addition to the client-side hooks, you can use a couple of important server-side hooks as a system administrator to enforce nearly any kind of policy for your project. These scripts run before and after pushes to the server. The pre hooks can exit non-zero at any time to reject the push as well as print an error message back to the client; you can set up a push policy that’s as complex as you wish.-->

Neben den Hooks für den Client, kannst Du als Systemadministrator auch einige wichtige Hooks auf Seiten des Servers installieren. Damit kannst Du nahezu jede Art von Richtlinie für Dein Projekt erzwingen. Die Skripte werden ausgeführt bevor und nachdem ein Push auf den Server durchgeführt wurde. Das Skript für den vorgelagerten Hook kann den Push jederzeit abbrechen indem es einen Wert ungleich Null zurückgibt. Zusätzlich kann dem Client eine Fehlermeldung zurückgeliefert werden. Mit diesen Hooks kannst Du eine beliebig komplexe Push Richtlinie umsetzen.

<!--### pre-receive and post-receive-->
### pre-receive und post-receive

<!--The first script to run when handling a push from a client is `pre-receive`. It takes a list of references that are being pushed from stdin; if it exits non-zero, none of them are accepted. You can use this hook to do things like make sure none of the updated references are non-fast-forwards; or to check that the user doing the pushing has create, delete, or push access or access to push updates to all the files they’re modifying with the push.-->

Das erste Skript, dass ausgeführt wird, wenn ein Push von einem Client empfangen wird, ist `pre-receive`. Es akzeptiert eine Liste von Referenzen, die über ‚stdin‘ hochgeladen werden. Wird es mit einem Wert ungleich Null beendet, so wird keine von ihnen akzeptiert. Du kannst diesen Hook benutzen, um sicherzustellen, dass keine Pushes durchgeführt werden können, welche nicht einem Fast-Forward entsprechen. Ebenso ist es möglich zu Prüfen, ob der Client, die entsprechende Berechtigung zum Erstellen, Löschen oder Aktualisieren eines Branches hat oder ob er die Berechtigung hat, die jeweiligen Dateien zu ändern, die mit dem Push hochgeladen werden.

<!--The `post-receive` hook runs after the entire process is completed and can be used to update other services or notify users. It takes the same stdin data as the `pre-receive` hook. Examples include e-mailing a list, notifying a continuous integration server, or updating a ticket-tracking system — you can even parse the commit messages to see if any tickets need to be opened, modified, or closed. This script can’t stop the push process, but the client doesn’t disconnect until it has completed; so, be careful when you try to do anything that may take a long time.-->

Der `post-receive` Hook wird aufgerufen, nachdem der komplette Prozess abgeschlossen ist und kann zum Aktualisieren anderer Dienste oder zum Benachrichtigen von Benutzern verwendet werden. Er erwartet die gleichen ‚stdin‘ Daten wie `pre-receive`. Beispielsweise können folgende Aktionen ausgeführt werden: Versand von E-Mails an eine vorgefertigte Liste von Personen, Benachrichtigen eins Continuous Integration Servers oder Aktualisieren eines Issue-Tracking-Werkzeugs (Du kannst sogar die Commit Nachrichten parsen um zu prüfen, ob bestimmte Tickets geöffnet, aktualisiert oder geschlossen werden müssen). Das Skript kann allerdings den Push Prozess nicht abbrechen und der Client bleibt bis zum Abschluss des Skripts mit dem Server verbunden. Du solltest deshalb darauf achten, dass Du keinen Vorgang ausführst, der zu viel Zeit in Anspruch nimmt.

<!--### update-->
### update

<!--The update script is very similar to the `pre-receive` script, except that it’s run once for each branch the pusher is trying to update. If the pusher is trying to push to multiple branches, `pre-receive` runs only once, whereas update runs once per branch they’re pushing to. Instead of reading from stdin, this script takes three arguments: the name of the reference (branch), the SHA-1 that reference pointed to before the push, and the SHA-1 the user is trying to push. If the update script exits non-zero, only that reference is rejected; other references can still be updated.-->

Das Update Skript ist dem `pre-receive` Skript sehr ähnlich, außer dass es für jeden Branch, den der Client aktualisieren will, ausgeführt wird. Wenn der Benutzer des Clients versucht mehrere Branches zu pushen, wird `pre-receive` nur einmalig aufgerufen, wohingegen das Update Skript für jeden einzelnen Branch ausgeführt wird. Anstatt von dem Stream stdin zu lesen, akzeptiert dieses Skript drei Argumente: der Name der Referenz (Branch), die SHA-1 Prüfsumme auf die die Referenz vor dem Push zeigt und die SHA-1 Prüfsumme, die der Anwender versucht zu pushen. Wenn das Update Skript einen Wert ungleich Null zurückgibt, wird der Vorgang nur für diese Referenz abgebrochen, die anderen Referenzen werden weiterhin aktualisiert.

<!--# An Example Git-Enforced Policy-->