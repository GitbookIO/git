# Gitolite

<!--This section serves as a quick introduction to Gitolite, and provides basic installation and setup instructions.  It cannot, however, replace the enormous amount of [documentation][gltoc] that Gitolite comes with.  There may also be occasional changes to this section itself, so you may also want to look at the latest version [here][gldpg].-->

In diesem Abschnitt werde ich einen kurzen Einblick in Gitolite geben und die Basisinstallation und Konfiguration besprechen. Jedoch kann meine kurze Einführung nicht die ausführliche [Dokumentation][gltoc], die Gitolite bietet, ersetzen. Es könnte sein, dass es gelegentlich Änderungen an diesem Abschnitt gibt, deshalb solltest Du auch einen Blick auf die [aktuellste Version][gldpg] wagen.

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

<!--Gitolite is an authorization layer on top of Git, relying on `sshd` or `httpd` for authentication.  (Recap: authentication is identifying who the user is, authorization is deciding if he is allowed to do what he is attempting to).-->

Gitolite ist als Schicht für die Zugriffsberechtigung oberhalb von Git angeordnet und verwendet `sshd` oder `httpd`  zur Authentifikation. (Kurze Wiederholung: Bei der Authentifizierung wird der Benutzer identifiziert und die Zugriffsberechtigung entscheidet, ob der Benutzer die gewünschte Operation ausführen darf oder nicht).

<!--Gitolite allows you to specify permissions not just by repository, but also by branch or tag names within each repository.  That is, you can specify that certain people (or groups of people) can only push certain "refs" (branches or tags) but not others.-->

Gitolite ermöglicht es Dir die Berechtigungen auf Repository Ebene festzulegen, erlaubt aber zusätzlich auch die Berechtigung auf Ebene von Branches oder Tags innerhalb eines Repositorys zu definieren. Das bedeutet also, dass Du festlegen kannst, dass bestimmte Leute (oder eine Gruppe von Leuten) nur bestimmte „refs“ (Branches oder Tags) pushen können, andere Personen sollen das wiederum nicht können.

<!--## Installing-->
## Installation

<!--Installing Gitolite is very easy, even if you don’t read the extensive documentation that comes with it.  You need an account on a Unix server of some kind.  You do not need root access, assuming Git, Perl, and an OpenSSH compatible SSH server are already installed.  In the examples below, we will use the `git` account on a host called `gitserver`.-->

Auch ohne Studium der ausführlichen Dokumentation, die Gitolite beiliegt, gestaltet sich die Installtion sehr einfach. Du benötigst dazu einen Account auf irgendeiner Art von Unix Server. Du brauchst keine Root-Rechte, vorausgesetzt Git, Perl und ein OpenSSH kompatibler SSH Server sind bereits installiert. In unserem Beispiel verwenden wir den Benutzer `git` auf einem Host mit dem Namen `gitserver`.

<!--Gitolite is somewhat unusual as far as "server" software goes — access is via SSH, and so every userid on the server is a potential "gitolite host".  We will describe the simplest install method in this article; for the other methods please see the documentation.-->

Gitolite ist in Bezug auf „Server“-Software ein wenig ungewöhnlich — der Zugriff erfolgt per SSH und somit ist jede auf dem Server vorhandene User-Id ein potentieller „gitolite host“. In unserem Beispiel werden wir die einfachste Methode der Installation beschreiben. Die anderen Möglichkeiten können der Dokumentation entnommen werden.

<!--To begin, create a user called `git` on your server and login to this user.  Copy your SSH public key (a file called `~/.ssh/id_rsa.pub` if you did a plain `ssh-keygen` with all the defaults) from your workstation, renaming it to `<yourname>.pub` (we'll use `scott.pub` in our examples).  Then run these commands:-->

Zu Beginn legst Du auf Deinem Server einen Benutzer mit dem Namen `git` an und loggst Dich mit diesem ein. Danach kopierst Du Deinen öffentlichen SSH Schlüssel (die Datei lautet `~/.ssh/id_rsa.pub`, falls Du `ssh-keygen` mit den Standardoptionen ausgeführt hast) von Deiner Workstation auf den Server und nennst ihn entsprechend dem Schema `<yourname>.pub` um (in unserem Beispiel verwenden wir die Datei `scott.pub`). Danach führst Du die folgenden Kommandos aus:

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	    # assumes $HOME/bin exists and is in your $PATH
	$ gitolite setup -pk $HOME/scott.pub

<!--That last command creates new Git repository called `gitolite-admin` on the server.-->

Der letzte Befehl erzeugt ein neues Git Repository mit dem Namen `gitolite-admin` auf Deinem Server.

<!--Finally, back on your workstation, run `git clone git@gitserver:gitolite-admin`. And you’re done!  Gitolite has now been installed on the server, and you now have a brand new repository called `gitolite-admin` in your workstation.  You administer your Gitolite setup by making changes to this repository and pushing.-->

Zum Abschluss musst Du auf Deiner Workstation den Befehl `git clone git@gitserver:gitolite-admin` ausführen. Jetzt bist Du im Prinzip fertig. Gitolite ist nun auf Deinem Server installiert und auf Deiner Workstation liegt das neue Repository `gitolite-admin` vor. Du kannst Gitolite nun administrieren, indem Du Änderungen an diesem Repository ausführst und zurück auf den Server pushst.

<!--## Customising the Install-->
## Benutzerdefinierte Installation

<!--While the default, quick, install works for most people, there are some ways to customise the install if you need to.  Some changes can be made simply by editing the rc file, but if that is not sufficient, there’s documentation on customising Gitolite.-->

Obwohl die schnelle Standardinstallation für die meisten Leute ausreicht, gibt es ein paar Möglichkeiten die Installation an Deine Gegebenheiten anzupassen, falls Du dies für nötig hältst. Teilweise reicht es, die rc Datei zu bearbeiten. Sollte das nicht ausreichen, gibt es genügend Dokumentation, die beschreibt, wie Gitolite angepasst werden kann.

<!--## Config File and Access Control Rules-->
## Konfigurationsdateien und Regeln für die Zugangskontrolle

<!--Once the install is done, you switch to the `gitolite-admin` clone you just made on your workstation, and poke around to see what you got:-->

Nachdem die Installation abgeschlossen ist, wechselst Du in den `gitolite-admin` Klon auf Deiner Workstation und stöberst dort am besten ein wenig herum:

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

<!--Notice that "scott" (the name of the pubkey in the `gitolite setup` command you used earlier) has read-write permissions on the `gitolite-admin` repository as well as a public key file of the same name.-->

Es ist wichtig anzumerken, dass „scott“ (das entspricht dem Name des öffentlichen Schlüssel, den Du beim Ausführen des `gitolite setup` Kommandos angegeben hast) Lese- und Schreibzugriff auf das `gitolite-admin` Repository hat. Zusätzlich existiert eine Datei mit dem gleichen Namen. Diese beinhaltet den öffentlichen Schlüssel.

<!--Adding users is easy.  To add a user called "alice", obtain her public key, name it `alice.pub`, and put it in the `keydir` directory of the clone of the `gitolite-admin` repo you just made on your workstation.  Add, commit, and push the change, and the user has been added.-->

Neue Benutzer hinzuzufügen gestaltet sich einfach. Um einen neuen Anwender mit dem Namen „alice“ hinzuzufügen, benötigst Du ihren öffentlichen Schlüssel. Diesen nennst Du in `alice.pub` um und legst ihn im Verzeichnis `keydir` Deines geklonten `gitolite-admin` Repositorys auf Deiner Workstation ab. Danach stagst Du die Änderungen, commitest diese und pushst sie auf den Server und voi­là, der Benutzer wurde hinzugefügt.

<!--The config file syntax for Gitolite is well documented, so we’ll only mention some highlights here.-->

Die Syntax der Gitolite Konfigurationsdateien ist gut dokumentiert, deshalb gehen wir hier nur auf die wichtigsten Details ein.

<!--You can group users or repos for convenience.  The group names are just like macros; when defining them, it doesn’t even matter whether they are projects or users; that distinction is only made when you *use* the "macro".-->

Einzelne Benutzer oder Repositorys können zur besseren Verwaltung zu Gruppen zusammengefasst werden. Die Gruppennamen verhalten sich wie Makros. Beim Anlegen ist es unabhängig, ob es sich um Projekte oder Benutzer handelt. Diese Festlegung wird erst getroffen, wenn diese „Makros“ verwendet werden.

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

<!--You can control permissions at the "ref" level.  In the following example, interns can only push the "int" branch.  Engineers can push any branch whose name starts with "eng-", and tags that start with "rc" followed by a digit.  And the admins can do anything (including rewind) to any ref.-->

Du kannst die Berechtigungen auf „ref“-Ebene (Branches und Tags) festlegen. Im folgenden Beispiel darf die Gruppe „interns“ nur auf den „int“ Branch pushen. Die Benutzer der Gruppe „engineers“ können jeden Branch pushen, der mit dem Prefix „eng-“ beginnt. Zusätzlich kann diese Gruppe jeden Tag, mit dem Namen „rc“, gefolgt von einer einzelnen Zahl, pushen. Die Benutzer der Gruppe „admins“ können jede Operation für jeden „ref“ durchführen (inklusive Rewind-Operationen).

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

<!--The expression after the `RW` or `RW+` is a regular expression (regex) that the refname (ref) being pushed is matched against.  So we call it a "refex"!  Of course, a refex can be far more powerful than shown here, so don’t overdo it if you’re not comfortable with Perl regexes.-->

Der Ausdruck hinter `RW` oder `RW+` ist ein regulärer Ausdruck (Regex), gegen den die Referenzen (ref), die gepusht werden, verglichen werden. Wir nennen das auch „Refex“. Mit einem solchen Refex hat man ein sehr mächtiges Werkzeug an der Hand und kann noch viel mehr machen, als hier aufgezeigt ist. Aus diesem Grund solltest Du es aber damit auch nicht übertreiben, wenn Du mit den regulären Ausdrücken aus Perl nicht vertraut bist.

<!--Also, as you probably guessed, Gitolite prefixes `refs/heads/` as a syntactic convenience if the refex does not begin with `refs/`.-->

Wie Du vielleicht bereits vermutest hast, stellt Gitolite den Ausdruck `refs/heads/` den Refex voran, wenn diese nicht mit `refs/` beginnen.

<!--An important feature of the config file’s syntax is that all the rules for a repository need not be in one place.  You can keep all the common stuff together, like the rules for all `oss_repos` shown above, then add specific rules for specific cases later on, like so:-->

Ein wichtige Eigenschaft der Syntax der Konfigurationsdatei ist, dass nicht alle Regeln für ein Repository an einer gemeinsamen Stelle festgehalten werden müssen. Du kannst die ganzen allgemeingültigen Dinge, wie zum Beispiel die oben gezeigten Regeln für alle `oss_repos`, an einer Stelle zusammenfassen und später dann spezifische Regeln für die einzelnen Fälle festlegen. Zum Beispiel folgendermaßen:

	repo gitolite
	    RW+                     = sitaram

<!--That rule will just get added to the ruleset for the `gitolite` repository.-->

Diese Regel gehört dann zum Regelsatz des `gitolite` Repository.

<!--At this point you might be wondering how the access control rules are actually applied, so let’s go over that briefly.-->

An dieser Stelle fragst Du Dich vielleicht, wie die Zugriffsregeln eigentlich angewandt werden. Lass uns das kurz anschauen.

<!--There are two levels of access control in Gitolite.  The first is at the repository level; if you have read (or write) access to *any* ref in the repository, then you have read (or write) access to the repository.  This is the only access control that Gitosis had.-->

Es gibt zwei Ebenen für die Zugriffsberechtigung in Gitolite. Die erste befindet sich auf Repository Ebene. Wenn Du Lese- oder Schreifzugriff auf jede Ref in einem Repository hast, dann kannst Du damit das ganze Repository sowohl lesen, als auch schreiben. Gitosis kennt nur diese Art der Zugriffsberechtigung.

<!--The second level, applicable only to "write" access, is by branch or tag within a repository.  The username, the access being attempted (`W` or `+`), and the refname being updated are known.  The access rules are checked in order of appearance in the config file, looking for a match for this combination (but remember that the refname is regex-matched, not merely string-matched).  If a match is found, the push succeeds.  A fallthrough results in access being denied.-->

Die zweite Ebene bezieht sich auf Branches oder Tags innerhalb eines Repositorys. Auf dieser Ebene kann allerdings nur der Schreibzugriff beschränkt werden. Der Benutzername, die Art des Zugriffs (`W` oder `+`) und der Refname, der aktualisiert wird, sind bekannt. Gitolite prüft, ob einer dieser Regeln auf diese Kombination zutrifft (hierbei ist allerdings zu beachten, dass der Refname mit dem regulären Ausdruck verglichen und kein eins zu eins String-Vergleich durchgeführt wird). Die Zugriffsregeln werden entsprechend der Reihenfolge innerhalb der Konfigurationsdatei abgearbeitet. Wenn eine Kombination zutrifft, kann der Push durchgeführt werden. Trifft keine zu, dann wird der Push verweigert.

<!--## Advanced Access Control with "deny" rules-->
## Erweiterte Zugriffsberechtigungen mit „deny“ Regeln

<!--So far, we’ve only seen permissions to be one of `R`, `RW`, or `RW+`.  However, Gitolite allows another permission: `-`, standing for "deny".  This gives you a lot more power, at the expense of some complexity, because now fallthrough is not the *only* way for access to be denied, so the *order of the rules now matters*!-->

Bis jetzt waren alle vorgestellten Berechtigungen entweder `R`, `RW`, oder `RW+`. Gitolite kennt aber noch eine weitere Berechtigung: `-`, welche für „deny“, also ablehnen steht. Dies gibt Dir noch viel mehr Möglichkeiten, allerdings auf Kosten der Komplexität, denn ab jetzt ist ein Falltrough nicht die einzige Möglichkeit, wie ein Zugriff auf das Repository abgelehnt wird. Das heißt, die Reihenfolge der aufgestellte Regeln, hat auch eine Bedeutung.

<!--Let us say, in the situation above, we want engineers to be able to rewind any branch *except* master and integ.  Here’s how to do that:-->

Nehmen wir mal an, dass bei unserem bekannten Beispiel, die Gruppe „engineers“ auf alle Branches, außer master und integ, Rewind-Rechte haben soll. Das können wir folgendermaßen erreichen:

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

<!--Again, you simply follow the rules top down until you hit a match for your access mode, or a deny.  Non-rewind push to master or integ is allowed by the first rule.  A rewind push to those refs does not match the first rule, drops down to the second, and is therefore denied.  Any push (rewind or non-rewind) to refs other than master or integ won’t match the first two rules anyway, and the third rule allows it.-->

Noch einmal zur Wiederholung, man muss jede einzelne Regel von oben nach unten durchgehen und überprüfen, ob eine Regel auf den aktuellen Zugriffsmodus zutrifft oder ob eine Deny-Regel den Zugriff verhindert. Ein Push auf den Branch master oder integ, welcher nicht einem Rewind Push entspricht, wird durch die erste Regel erlaubt. Ein Rewind Push auf diese Refs trifft also auf die erste Regel nicht zu. Deshalb wird die zweite Regel geprüft und auf Grund der Deny-Regel wird der Push verweigert. Jeder Push (unabhängig, ob es sich um einen Rewind Push oder einen normalen Push handelt) auf eine Ref, welche nicht master oder integ entspricht, trifft nicht auf einer der beiden ersten Regeln zu, und wird damit auf Grund der dritten Regel erlaubt.

<!--## Restricting pushes by files changed-->
## Ein Push auf Basis von Dateiänderungen einschränken

<!--In addition to restricting what branches a user can push changes to, you can also restrict what files they are allowed to touch.  For example, perhaps the Makefile (or some other program) is really not supposed to be changed by just anyone, because a lot of things depend on it or would break if the changes are not done *just right*.  You can tell Gitolite:-->

Neben der Zugriffsbeschränkung auf Basis von Branches, kannst Du genauso verhindern, dass eine Änderung an einer bestimmten Datei gepusht wird. Beispielsweise ist ein Makefile (oder auch andere Programme) nicht dafür geeignet, dass es von jeder x-beliebiegen Person geändert wird. Meist hängen von so einem Makefile viele Dinge ab oder vieles könnte schief laufen, wenn die Änderungen an der Datei nicht korrekt durchgeführt werden würden. Du kannst deshalb Gitolite folgendermaßen konfigurieren:

    repo foo
        RW                      =   @junior_devs @senior_devs

        -   VREF/NAME/Makefile  =   @junior_devs

<!--User who are migrating from the older Gitolite should note that there is a significant change in behaviour with regard to this feature; please see the migration guide for details.-->

Alle Anwender von älteren Gitolite Versionen, die auf eine neue Gitolite Version wechseln, sollten darauf achten, dass sich die neue Version signifikant anders im Bezug auf dieses Feature verhält. Die Umstellungsanleitung (migration guide) weist hier auf weitere Details hin.

<!--## Personal Branches-->
## Personenbezogene Branches

<!--Gitolite also has a feature called "personal branches" (or rather, "personal branch namespace") that can be very useful in a corporate environment.-->

Gitolite bietet mit den „personal branches“ (genauer „personal branch namespace“) eine weitere Eigenschaft, die im Unternehmensumfeld sehr hilfreich sein kann.

<!--A lot of code exchange in the Git world happens by "please pull" requests.  In a corporate environment, however, unauthenticated access is a no-no, and a developer workstation cannot do authentication, so you have to push to the central server and ask someone to pull from there.-->

Jede Menge Codeänderungen in der Welt von Git passieren, weil jemand einen Pull-Request durchführt. Im Unternehmensumfeld ist ein anonymer Zugriff ein absolutes No-Go und oft kann eine Entwickler Workstation keine Authentifizierung bieten. Deshalb müssen die Änderungen an den zentralen Server gepusht werden und jemand anders muss diese von dort abholen.

<!--This would normally cause the same branch name clutter as in a centralised VCS, plus setting up permissions for this becomes a chore for the admin.-->

Dies würde normalerweise zu dem gleichen Branchnamen-Wirrwarr führen, wie es in zentralisierten Versionskontrollsystemen anzufinden ist. Außerdem wäre es für den Administrator äußerst lästig, die ganzen Berechtigungen dafür zu setzen.

<!--Gitolite lets you define a "personal" or "scratch" namespace prefix for each developer (for example, `refs/personal/<devname>/*`); please see the documentation for details.-->

Gitolite lässt die Definition eines „personal“ oder „scratch“ Namensraum für jeden einzelnen Entwickler zu (zum Beispiel: `refs/personal/<devname>/*`). Die Dokumentation enthält dazu weitere Details.

<!--## "Wildcard" repositories-->
## „Wildcard“ Repositorys

<!--Gitolite allows you to specify repositories with wildcards (actually Perl regexes), like, for example `assignments/s[0-9][0-9]/a[0-9][0-9]`, to pick a random example.  It also allows you to assign a new permission mode (`C`) which enables users to create repositories based on such wild cards, automatically assigns ownership to the specific user who created it, allows him/her to hand out `R` and `RW` permissions to other users to collaborate, etc.  Again, please see the documentation for details.-->

Mit Platzhaltern (eigentlich Perl reguläre Ausdrücke), wie zum Beispiel `assignments/s[0-9][0-9]/a[0-9][0-9]`, kannst Du in Gitolite auch Repositorys definieren. Außerdem bietet Gitolite eine neuen Berechtigungsmodus (`C`), welcher es den Benutzern ermöglicht, auf Basis dieser Platzhalter, Repositorys zu erzeugen. Dem Benutzer, der das Repository erzeugt hat, wird dieses automatisch zugewiesen, was es ihm oder ihr ermöglicht anderen Benutzern Lese- oder Schreibrechte (`R` und `RW`) zuzuweisen, damit diese zum Projekt beitragen können. Wieder möchte ich Dich darauf hinweisen, dass die Dokumentation weitere Details enthält.

<!--## Other Features-->
## Weitere Besonderheiten

<!--We’ll round off this discussion with a sampling of other features, all of which, and many more, are described in great detail in the documentation.-->

Ich möchte das Thema Gitolite abschließen, indem ich noch ein paar weitere Besonderheiten kurz anspreche. Diese und viele weitere Features von Gitolite werden ausführlich in der Dokumentation beschrieben.

<!--**Logging**: Gitolite logs all successful accesses.  If you were somewhat relaxed about giving people rewind permissions (`RW+`) and some kid blew away `master`, the log file is a life saver, in terms of easily and quickly finding the SHA that got hosed.-->

**Protokollierung**: Gitolite protokolliert alle Zugriffe, die erfolgreich waren. Wenn Du ein bisschen nachlässig bei der Vergabe von Rewind-Rechten (`RW+`) warst und irgendeiner der Personen mit Rewinde-Rechte dann den `master` zerstört, dann kann Dir die Protokolldatei eine Menge Arbeit ersparen, weil sie Dir hilft, leicht und schnell die SHA Prüfsumme zu finden, die dem Erdboden gleich gemacht wurde.

<!--**Access rights reporting**: Another convenient feature is what happens when you try and just ssh to the server.  Gitolite shows you what repos you have access to, and what that access may be.  Here’s an example:-->

**Zugriffsrechte herausfinden**: Ein anderes praktisches Merkmal von Gitolite lernst Du kennen, wenn Du versuchst Dich über SSH auf dem Server einzuloggen. Gitolite zeigt Dir dann alle Repositorys an, auf die Du Zugriff hast und welche Berechtigung Du für diese hast. Hierzu ein Beispiel:

        hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4

             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

<!--**Delegation**: For really large installations, you can delegate responsibility for groups of repositories to various people and have them manage those pieces independently.  This reduces the load on the main admin, and makes him less of a bottleneck.-->

**Administration aufteilen**: Bei richtig großen Installationen kannst Du die Verantwortlichkeit für verschiedene Gruppen von Repositorys an verschiedene Leute verteilen, damit diese die Repositorys unabhängig verwalten können. Das macht das Leben des Haupt-Administrator leichter und verhindert, dass er der Flaschenhals im System ist.

<!--**Mirroring**: Gitolite can help you maintain multiple mirrors, and switch between them easily if the primary server goes down.-->

**Spiegelung**: Gitolite kann Dir helfen verschiedene Mirrors (Spiegelserver) zu verwalten. Außerdem ist es damit einfach zwischen verschiedenen Mirrors zu wechseln, wenn der primäre Server offline ist.

<!--# Git Daemon-->