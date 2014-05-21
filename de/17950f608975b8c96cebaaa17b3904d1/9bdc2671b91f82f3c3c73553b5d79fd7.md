# Einrichten eines Benutzeraccounts

<!--The first thing you need to do is set up a free user account. If you visit the Pricing and Signup page at `http://github.com/plans` and click the "Sign Up" button on the Free account (see Figure 4-2), you’re taken to the signup page.-->

Um loslegen zu können, musst Du Dir einen Benutzeraccount erstellen. Gib dazu die Adresse `http://github.com/plans` in Deinem Browser ein und wähle den Button „Sign Up“ unter dem „Free account“-Bereich aus (siehe Abbildung 4-2). Danach wirst Du auf die Anmeldeseite weitergeleitet.

<!--Figure 4-2. The GitHub plan page.-->


![](http://git-scm.com/figures/18333fig0402-tn.png)

Abbildung 4-2. Die Angebotsseite von GitHub.

<!--Here you must choose a username that isn’t yet taken in the system and enter an e-mail address that will be associated with the account and a password (see Figure 4-3).-->

Auf dieser Seite musst Du einen Nutzernamen auswählen, der bisher im System nicht vorhanden ist. Zusätzlich musst Du Deine E-Mail Adresse angeben, die mit Deinem Account verknüpft wird, und ein Passwort angeben (siehe Abbildung 4-3).

<!--Figure 4-3. The GitHub user signup form.-->


![](http://git-scm.com/figures/18333fig0403-tn.png)

Abbildung 4-3. Das Formular für die GitHub Benutzerregistrierung.

<!--If you have it available, this is a good time to add your public SSH key as well. We covered how to generate a new key earlier, in the "Simple Setups" section. Take the contents of the public key of that pair, and paste it into the SSH Public Key text box. Clicking the "explain ssh keys" link takes you to detailed instructions on how to do so on all major operating systems.-->
<!--Clicking the "I agree, sign me up" button takes you to your new user dashboard (see Figure 4-4).-->

Wenn Du Deinen öffentlichen SSH Schlüssel zur Hand hast, kannst Du diesen auch gleich bei der Registrierung angeben. Die Vorgehensweise zum Generieren eines Schlüssels haben wir bereits im Kapitel 4.3 besprochen. Du musst den Inhalt der öffentlichen Schlüsseldatei kopieren und in das „SSH Public Key“ Formularfeld einfügen. Wenn Du auf den „explain ssh keys“ Link klickst, erhälst Du detailierte Anweisungen zum Ausführen dieses Vorgangs auf verschiedenen Betriebssystemen. Wenn Du auf den „I agree, sign me up“ Button drückst, landest Du in Deinem neuen Benutzer-Dashboard (siehe Abbildung 4-4).

<!--Figure 4-4. The GitHub user dashboard.-->


![](http://git-scm.com/figures/18333fig0404-tn.png)

Abbildung 4-4. Das GitHub Benutzer-Dashboard.

<!--Next you can create a new repository.-->

Im nächsten Schritt kannst Du ein neues Repository erzeugen.

<!--## Creating a New Repository-->
## Erzeugen eines neuen Repository

<!--Start by clicking the "create a new one" link next to Your Repositories on the user dashboard. You’re taken to the Create a New Repository form (see Figure 4-5).-->

Um ein neues Repository anzulegen, musst Du auf den „create a new one“-Link, welcher neben Deinen Repositorys auf dem Benutzer-Dashboard angezeigt wird, klicken. Du landest daraufhin im Formular zum Erzeugen eines neuen Repositorys (siehe Abbildung 4-5).

<!--Figure 4-5. Creating a new repository on GitHub.-->


![](http://git-scm.com/figures/18333fig0405-tn.png)

Abbildung 4-5. Erzeugen eines Repositorys auf GitHub.

<!--All you really have to do is provide a project name, but you can also add a description. When that is done, click the "Create Repository" button. Now you have a new repository on GitHub (see Figure 4-6).-->

Im Prinzip musst Du nur einen Projektnamen und wenn Du es für nötig erachtest eine Beschreibung Deines Projekts angeben. Wenn das erledigt ist, kannst Du auf den „Create Repository“ Button klicken. Du hast soeben Dein erstes Repository auf GitHub erzeugt (siehe Abbildung 4-6).

<!--Figure 4-6. GitHub project header information.-->


![](http://git-scm.com/figures/18333fig0406-tn.png)

Abbildung 4-6. GitHub Projektinformationen.

<!--Since you have no code there yet, GitHub will show you instructions for how create a brand-new project, push an existing Git project up, or import a project from a public Subversion repository (see Figure 4-7).-->

Da in dem Repository noch kein Code enthalten ist, gibt Dir GitHub ein paar Hinweise, wie Du ein neues Projekt anlegst, wie Du ein bereits vorhandes Git Projekt auf GitHub pusht oder wie man ein bestehendes Subversion Repository in GitHub importieren kann (siehe Abbildung 4-7).

<!--Figure 4-7. Instructions for a new repository.-->


![](http://git-scm.com/figures/18333fig0407-tn.png)

Abbildung 4-7. Anleitung zum Erzeugen eines neuen Repository.

<!--These instructions are similar to what we’ve already gone over. To initialize a project if it isn’t already a Git project, you use-->

Die Hilfestellung entspricht der Vorgehensweise, die ich bereits in diesem Buch vorgestellt habe. Um ein neues Git Projekt in einem vorhandenen Verzeichnis anzulegen, kannst Du die folgenden Befehle verwenden:

	$ git init
	$ git add .
	$ git commit -m 'initial commit'

<!--When you have a Git repository locally, add GitHub as a remote and push up your master branch:-->

Wenn Du bereits ein lokales Git Repository auf Deinem PC hast, kannst Du GitHub als zusätzlichen Remote hinzufügen und den master Branch pushen:

	$ git remote add origin git@github.com:testinguser/iphone_project.git
	$ git push origin master

<!--Now your project is hosted on GitHub, and you can give the URL to anyone you want to share your project with. In this case, it’s `http://github.com/testinguser/iphone_project`. You can also see from the header on each of your project’s pages that you have two Git URLs (see Figure 4-8).-->

Das war es schon. Dein Projekt ist nun auf GitHub erreichbar. Du kannst jetzt die zugehörige URL an jeden weitergeben, den Du am Projekt teilhaben lassen willst. In unserem Beispiel lautet der Link hierfür `http://github.com/testinguser/iphone_project`. Im oberen Header-Bereich jeder Projektseite werden zwei verschiedene Git URLs angezeigt (siehe Abbildung 4-8).

<!--Figure 4-8. Project header with a public URL and a private URL.-->


![](http://git-scm.com/figures/18333fig0408-tn.png)

Abbildung 4-8. Projekt Header mit der Angabe der öffentlichen und privaten URL.

<!--The Public Clone URL is a public, read-only Git URL over which anyone can clone the project. Feel free to give out that URL and post it on your web site or what have you.-->

Die „Public Clone URL“ ist eine öffentliche Git URL, die man zum Klonen des Projekts verwenden kann. Über diese URL kann lediglich lesend zugegriffen werden. Ein Schreibzugriff ist nicht möglich. Du kannst diese URL beliebig weiter verteilen und zum Beispiel auch auf Deiner Homepage oder einem anderen Medium veröffentlichen.

<!--The Your Clone URL is a read/write SSH-based URL that you can read or write over only if you connect with the SSH private key associated with the public key you uploaded for your user. When other users visit this project page, they won’t see that URL—only the public one.-->

Die „Your Clone URL“ ist eine auf SSH basierte URL, mit Hilfe derer, vom Projekt gelesen, als auch geschrieben werden kann. Diese URL kann aber nur der Anwender nutzen, der im Besitz des privaten Schlüssel ist, welcher zu dem öffentlichen Schlüssel gehört, der bei dem GitHub Benutzer für dieses Projekt hinterlegt ist (Du hast den öffentlichen Schlüssel bei der Registrierung Deines Accounts angegeben).. Dieser Link wird allerdings nur Dir angezeigt. Andere Benutzer, die Deine Projekte besuchen, können nur die „Public Clone URL“ sehen.

<!--## Importing from Subversion-->
## Import von Subversion

<!--If you have an existing public Subversion project that you want to import into Git, GitHub can often do that for you. At the bottom of the instructions page is a link to a Subversion import. If you click it, you see a form with information about the import process and a text box where you can paste in the URL of your public Subversion project (see Figure 4-9).-->

Wenn Du bereits ein Subversion Projekt hast und dieses in Git importieren möchtest, kann GitHub Dir diese Aufgabe in vielen Fällen übernehmen. Am Ende der Seite mit den Hilfestellungen ist ein Link, der Dich auf die Seite mit dem Formular zum Importieren eines Subversion Projekts weiterleitet. Du musst in diesem Formular nur die URL des Subversion Projekts angeben (siehe Abbildung 4-9).

<!--Figure 4-9. Subversion importing interface.-->


![](http://git-scm.com/figures/18333fig0409-tn.png)

Abbildung 4-9. Import-Schnittstelle für Subversion Projekte.

<!--If your project is very large, nonstandard, or private, this process probably won’t work for you. In Chapter 7, you’ll learn how to do more complicated manual project imports.-->

Wenn Dein Projekt sehr groß, nicht standardkonform oder nicht öffentlich einsehbar ist, kann es passieren das dieser Vorgang fehlschlägt. In Kapitel 7 liefere ich die Antwort, wie ein solcher Import, manuell durchgeführt werden kann.

<!--## Adding Collaborators-->
## Mitarbeiter hinzufügen

<!--Let’s add the rest of the team. If John, Josie, and Jessica all sign up for accounts on GitHub, and you want to give them push access to your repository, you can add them to your project as collaborators. Doing so will allow pushes from their public keys to work.-->

Um gemeinsam an einem Projekt zu arbeiten, kannst Du auch andere Personen für das Projekt freischalten. Wenn Du willst das John, Josie und Jessica ebenso auf das Projekt pushen können, musst Du sie als Mitarbeiter für Dein Projekt freischalten. Voraussetzung hierfür ist natürlich, dass Sie alle einen GitHub Account besitzen. Nachdem Du sie zum Projekt hinzugefügt hast, können sie unter Verwendung ihrer öffentlichen Schlüssel auf das Projekt pushen.

<!--Click the "edit" button in the project header or the Admin tab at the top of the project to reach the Admin page of your GitHub project (see Figure 4-10).-->

Klicke auf die „edit“-Schaltfläche in der Projektübersicht oder wähle den Admin-Tab im oberen Bereich Deines Projekts um zur Administrationsoberfläche zu gelangen (siehe Abbildung 4-10).

<!--Figure 4-10. GitHub administration page.-->


![](http://git-scm.com/figures/18333fig0410-tn.png)

Abbildung 4-10. GitHub Administrationsoberfläche.

<!--To give another user write access to your project, click the “Add another collaborator” link. A new text box appears, into which you can type a username. As you type, a helper pops up, showing you possible username matches. When you find the correct user, click the Add button to add that user as a collaborator on your project (see Figure 4-11).-->

Um einem anderen Benutzer Schreibrechte zu Deinem Projekt zu gewähren, kannst Du auf den „Add another collaborator“-Link klicken. Daraufhin erscheint ein Eingabefeld, in welches Du die Benutzer eingeben kannst. Während des Tippens, erscheint ein kleines Popup, welches Benutzernamen anzeigt, die Deiner Eingabe entsprechen. Wenn Du den gewünschten Benutzer gefunden hast, kannst Du die „Add“-Schaltfläche betätigen, um diesen Benutzer als Mitarbeiter zu Deinem Projekt hinzuzufügen (siehe Abbildung 4-11).

<!--Figure 4-11. Adding a collaborator to your project.-->


![](http://git-scm.com/figures/18333fig0411-tn.png)

Abbildung 4-11. Ein Mitarbeiter zu Deinem Projekt hinzufügen.

<!--When you’re finished adding collaborators, you should see a list of them in the Repository Collaborators box (see Figure 4-12).-->

Wenn Du Dein Team fertig zusammengestellt hast, solltest Du eine Liste aller Mitarbeiter im „Repository Collaborators“-Bereich sehen (siehe Abbildung 4.12).

<!--Figure 4-12. A list of collaborators on your project.-->


![](http://git-scm.com/figures/18333fig0412-tn.png)

Abbildung 4-12. Übersicht über alle Mitarbeiter in Deinem Projekt.

<!--If you need to revoke access to individuals, you can click the "revoke" link, and their push access will be removed. For future projects, you can also copy collaborator groups by copying the permissions of an existing project.-->

Wenn Du einer Person den Zugriff auf Dein Repository entziehen willst, kannst Du auf den „revoke“-Link klicken. Dadurch kann diese Person nicht mehr auf Dein Repository pushen. Für zukünftige Projekte kannst Du die Liste der Benutzer auch für andere Projekte übernehmen.

<!--## Your Project-->
## Dein Projekt

<!--After you push your project up or have it imported from Subversion, you have a main project page that looks something like Figure 4-13.-->

Nachdem Du das erste mal auf das GitHub Repository gepusht hast oder es von Subversion importiert hast, sieht die Hauptseite Deines GitHub-Projekts entsprechend Abbildung 4-13 aus.

<!--Figure 4-13. A GitHub main project page.-->


![](http://git-scm.com/figures/18333fig0413-tn.png)

Abbildung 4-13. Beispiel einer Hauptseite eines GitHub-Projekts.

<!--When people visit your project, they see this page. It contains tabs to different aspects of your projects. The Commits tab shows a list of commits in reverse chronological order, similar to the output of the `git log` command. The Network tab shows all the people who have forked your project and contributed back. The Downloads tab allows you to upload project binaries and link to tarballs and zipped versions of any tagged points in your project. The Wiki tab provides a wiki where you can write documentation or other information about your project. The Graphs tab has some contribution visualizations and statistics about your project. The main Source tab that you land on shows your project’s main directory listing and automatically renders the README file below it if you have one. This tab also shows a box with the latest commit information.-->

Wenn andere Dein Projekt in GitHub aufrufen, sehen sie als erstes diese Hauptseite. Die verschiedenen Funktionen, die GitHub für ein Projekt unterstützt, sind in verschiedene Tabs aufgeteilt. Der „Commit“-Tab enthält eine Liste aller Commits in chronologischer Reihenfolge. Dabei steht der neueste Commit ganz oben. Eine ähnliche Liste erhälst Du, wenn Du den `git log` Befehl ausführst. Der „Network“-Tab zeigt alle Benutzer an, die ein Fork von Deinem Projekt erstellt haben und Ihren Teil zum Projekt beigetragen haben. Im „Download“-Tab kannst Du Binärdateien hochladen oder Zip-Archive beziehungsweise Tarballs zur Verfügung stellen, die einem bestimmten Tag Deines Projekts entsprechen. Im „Wiki“-Tab findest Du ein Wiki, welches Du zu Dokumentationszwecken verwenden kannst. Außerdem kannst Du dort andere Informationen über Dein Projekt der Welt mitteilen. Der „Graphs“-Tab stellt Dir eine grafische Übersicht zur Verfügung, die Dir anzeigt, wer und wann jemand etwas zu Deinem Projekt beigetragen hat. Außerdem enthält dieser Tab eine Projekt-Statistik. Der „Source“-Tab, welcher standardmäßig beim Aufruf Deines Projekts angezeigt wird, zeigt das oberste Verzeichnis Deines Repositorys an. Wenn Dein Projekt eine README-Datei enthält, wird der Inhalt dieser Datei unterhalb der Verzeichnisstruktur angezeigt. Zusätzlich zeigt dieser Tab eine Übersicht mit den letzten Commit-Informationen an.

<!--## Forking Projects-->
## Fork von einem Projekt erstellen

<!--If you want to contribute to an existing project to which you don’t have push access, GitHub encourages forking the project. When you land on a project page that looks interesting and you want to hack on it a bit, you can click the "fork" button in the project header to have GitHub copy that project to your user so you can push to it.-->

Wenn Du an einem bereits vorhandenen Projekt mitarbeiten willst und Du zu diesem keine Schreibrechte hast, bietet Dir GitHub die Möglichkeit einen Fork von diesem Projekt zu erstellen. Wenn Du beim Stöbern durch GitHub bei einem interessanten Projekt landest und Du damit ein bisschen spielen willst, kannst Du die „Fork“-Schaltfläche im Projekt-Header auswählen. GitHub kopiert das gesamte Projekt in Deinen Benutzerbereich. Auf dieses kannst Du jetzt auch pushen.

<!--This way, projects don’t have to worry about adding users as collaborators to give them push access. People can fork a project and push to it, and the main project maintainer can pull in those changes by adding them as remotes and merging in their work.-->

Dadurch das jeder, jedes Projekt kopieren kann, muss sich der Verwalter eines Projekts nicht darum kümmern, das jedem Mitarbeiter die entsprechenden Schreibrechte erhält. Man kann einfach einen Fork erstellen und auf diesen pushen. Der Verwalter des geforkten Projekts kann dieses neue Projekt als neuen Remote hinzufügen und die Änderungen davon holen. Dann kann er diese Änderungen in das Hauptprojekt mergen.

<!--To fork a project, visit the project page (in this case, mojombo/chronic) and click the "fork" button in the header (see Figure 4-14).-->

Um einen Fork von einem Projekt zu erstellen, kannst Du die jeweilige Projektseite besuchen (in diesem Fall mojombo/chronic) und die „Fork“-Schaltfläche im oberen Bereich auswählen (siehe Abbildung 4-14).

<!--Figure 4-14. Get a writable copy of any repository by clicking the "fork" button.-->


![](http://git-scm.com/figures/18333fig0414-tn.png)

Abbildung 4-14. Durch Betätigen der „Fork“-Schaltfläche erhält man eine Kopie eines Repositorys, auf welches man Schreibrechte hat.

<!--After a few seconds, you’re taken to your new project page, which indicates that this project is a fork of another one (see Figure 4-15).-->

Nach ein paar Sekunden wirst Du zu der neuen Projektseite weitergeleitet. Dort siehst Du auch, dass dieses Projekt ein Fork eines anderen Projekts ist (siehe Abbildung 4-15).

<!--Figure 4-15. Your fork of a project.-->


![](http://git-scm.com/figures/18333fig0415-tn.png)

Abbildung 4-15. Dein Fork eines Projekts.

<!--## GitHub Summary-->
## GitHub Zusammenfassung

<!--That’s all we’ll cover about GitHub, but it’s important to note how quickly you can do all this. You can create an account, add a new project, and push to it in a matter of minutes. If your project is open source, you also get a huge community of developers who now have visibility into your project and may well fork it and help contribute to it. At the very least, this may be a way to get up and running with Git and try it out quickly.-->

Das war alles was ich über GitHub berichten möchte. Herausheben möchte ich aber, dass sich die Arbeit mit GitHub sehr einfach gestaltet. Innerhalb kürzester Zeit kannst Du Dir einen Account einrichten, ein neues Projekt hinzufügen und auf dieses pushen. Wenn Dein Projekt ein Open-Source Projekt ist und damit öffentlich einsehbar ist, steht Dir mit GitHub eine riesige Community mit zahlreichen Entwicklern zur Seite, die sich an Deinem Projekt beteiligen können, indem sie einen Fork erstellen. Vielleicht gelingt Dir mit GitHub der Einstieg in die Welt von Git noch einfacher.

<!--# Summary-->