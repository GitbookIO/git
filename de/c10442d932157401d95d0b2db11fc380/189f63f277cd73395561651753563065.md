# Tags

<!--Like most VCSs, Git has the ability to tag specific points in history as being important. Generally, people use this functionality to mark release points (`v1.0`, and so on). In this section, you’ll learn how to list the available tags, how to create new tags, and what the different types of tags are.-->

Wie die meisten anderen VCS kann Git bestimmte Punkte in der Historie als besonders wichtig markieren, also taggen. Normalerweise verwendet man diese Funktionalität, um Release Versionen zu markieren (z.B. v1.0). In diesem Abschnitt gehen wir darauf ein, wie Du vorhandene Tags anzeigen und neue Tags erstellen kannst, und worin die Unterschiede zwischen verschiedenen Typen von Tags bestehen.

<!--## Listing Your Tags-->
## Vorhandene Tags anzeigen

<!--Listing the available tags in Git is straightforward. Just type `git tag`:-->

Um die in einem Repository vorhandenen Tags anzuzeigen, kannst Du den Befehl `git tag` ohne irgendwelche weiteren Optionen verwenden:

	$ git tag
	v0.1
	v1.3

<!--This command lists the tags in alphabetical order; the order in which they appear has no real importance.-->

Dieser Befehl listet die Tags in alphabetischer Reihenfolge auf. Die Reihenfolge ist aber eigentlich nicht so wichtig.

<!--You can also search for tags with a particular pattern. The Git source repo, for instance, contains more than 240 tags. If you’re only interested in looking at the 1.4.2 series, you can run this:-->

Du kannst auch nach Tags mit einem bestimmten Muster suchen. Das Git Quellcode Repository enthält beispielsweise mehr als 240 Tags. Wenn Du nur an denjenigen interessiert bist, die zur Version 1.4.2 gehören, kannst Du folgendes tun:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

<!--## Creating Tags-->
## Neue Tags anlegen

<!--Git uses two main types of tags: lightweight and annotated. A lightweight tag is very much like a branch that doesn’t change — it’s just a pointer to a specific commit. Annotated tags, however, are stored as full objects in the Git database. They’re checksummed; contain the tagger name, e-mail, and date; have a tagging message; and can be signed and verified with GNU Privacy Guard (GPG). It’s generally recommended that you create annotated tags so you can have all this information; but if you want a temporary tag or for some reason don’t want to keep the other information, lightweight tags are available too.-->

Git kennt im wesentlichen zwei Typen von Tags: einfache (engl. lightweight) und kommentierte (engl. annotated) Tags. Ein einfacher Tag ist wie ein Branch, der sich niemals ändert – es ist lediglich ein Zeiger auf einen bestimmten Commit. Kommentierte Tags dagegen werden als vollwertige Objekte in der Git Datenbank gespeichert. Sie haben eine Checksumme, beinhalten Namen und E-Mail Adresse desjenigen, der den Tag angelegt hat, das jeweilige Datum sowie eine Meldung. Sie können überdies mit GNU Privacy Guard (GPG) signiert und verifiziert werden. Generell empfiehlt sich deshalb, kommentierte Tags anzulegen. Wenn man aber aus irgendeinem Grund einen temporären Tag anlegen will, für den all diese zusätzlichen Informationen nicht nötig sind, dann kann man auf einfache Tags zurückgreifen.

<!--## Annotated Tags-->
## Kommentierte Tags

<!--Creating an annotated tag in Git is simple. The easiest way is to specify `-a` when you run the `tag` command:-->

Einen kommentierten Tag legst Du an, indem Du dem `git tag` Befehl die Option `-a` übergibst:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

<!--The `-m` specifies a tagging message, which is stored with the tag. If you don’t specify a message for an annotated tag, Git launches your editor so you can type it in.-->

Die Option `-m` gibt dabei wiederum die Meldung an, die zum Tag hinzugefügt wird. Wenn Du keine Meldung angibst, startet Git wie üblich Deinen Editor, sodass Du eine Meldung eingeben kannst.

<!--You can see the tag data along with the commit that was tagged by using the `git show` command:-->

`git show` zeigt Dir dann folgenden Tag zusammen mit dem jeweiligen Commit, auf den der Tag verweist, an:

	$ git show v1.4
	tag v1.4
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 14:45:11 2009 -0800

	my version 1.4

	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

<!--That shows the tagger information, the date the commit was tagged, and the annotation message before showing the commit information.-->

Die Ausgabe listet also zunächst die Informationen über denjenigen auf, der den Tag angelegt hat, sowie die Tag Meldung und dann die Commit Informationen selbst.

<!--## Signed Tags-->
## Signierte Tags

<!--You can also sign your tags with GPG, assuming you have a private key. All you have to do is use `-s` instead of `-a`:-->

Wenn Du einen privaten GPG Schlüssel hast, kannst Du Deine Tags zusätzlich mit GPG signieren. Dazu verwendest Du einfach die Option `-s` anstelle von `-a`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

<!--If you run `git show` on that tag, you can see your GPG signature attached to it:-->

Wenn Du jetzt `git show` auf diesen Tag anwendest, siehst Du, dass der Tag Deine GPG Signatur hinterlegt hat:

	$ git show v1.5
	tag v1.5
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:22:20 2009 -0800

	my signed 1.5 tag
	-----BEGIN PGP SIGNATURE-----
	Version: GnuPG v1.4.8 (Darwin)

	iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
	Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
	=WryJ
	-----END PGP SIGNATURE-----
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

<!--A bit later, you’ll learn how to verify signed tags.-->

Darauf, wie Du signierte Tags verifizieren kannst, werden wir gleich noch eingehen.

<!--## Lightweight Tags-->
## Einfache Tags

<!--Another way to tag commits is with a lightweight tag. This is basically the commit checksum stored in a file — no other information is kept. To create a lightweight tag, don’t supply the `-a`, `-s`, or `-m` option:-->

Einfache Tags sind die zweite Form von Tags, die Git kennt. Für einen einfachen Tag wird im wesentlichen die jeweilige Commit Prüfsumme, und sonst keine andere Information, in einer Datei gespeichert. Um einen einfachen Tag anzulegen, verwendest Du einfach keine der drei Optionen `-a`, `-s` und `-m`:

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

<!--This time, if you run `git show` on the tag, you don’t see the extra tag information. The command just shows the commit:-->

Wenn Du jetzt `git show` auf den Tag ausführst, siehst Du keine der zusätzlichen Tag Informationen. Der Befehl zeigt einfach den jeweiligen Commit:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

<!--## Verifying Tags-->
## Tags verifizieren

<!--To verify a signed tag, you use `git tag -v [tag-name]`. This command uses GPG to verify the signature. You need the signer’s public key in your keyring for this to work properly:-->

Um einen signierten Tag zu verifizieren, kannst Du `git tag -v [Tag Name]` verwenden. Dieser Befehl verwendet GPG, um die Signatur mit Hilfe des öffentlichen Schlüssels des Signierenden zu verifizieren – weshalb Du diesen Schlüssel in Deinem Schlüsselbund haben musst:

	$ git tag -v v1.4.2.1
	object 883653babd8ee7ea23e6a5c392bb739348b1eb61
	type commit
	tag v1.4.2.1
	tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

	GIT 1.4.2.1

	Minor fixes since 1.4.2, including git-mv and git-http with alternates.
	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
	gpg:                 aka "[jpeg image of size 1513]"
	Primary key fingerprint: 3565 2A26 2040 E066 C9A7  4A7D C0C6 D9A4 F311 9B9A

<!--If you don’t have the signer’s public key, you get something like this instead:-->

Wenn Du den öffentlichen Schlüssel des Signierenden nicht in Deinem Schlüsselbund hast, wirst Du statt dessen eine Meldung sehen wie:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

<!--## Tagging Later-->
## Nachträglich taggen

<!--You can also tag commits after you’ve moved past them. Suppose your commit history looks like this:-->

Du kannst Commits jederzeit taggen, auch lange Zeit nachdem sie angelegt wurden. Nehmen wir an, Deine Commit Historie sieht wie folgt aus:

	$ git log --pretty=oneline
	15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
	a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
	0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
	6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
	0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
	4682c3261057305bdd616e23b64b0857d832627b added a todo file
	166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
	9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
	964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
	8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme

<!--Now, suppose you forgot to tag the project at `v1.2`, which was at the "updated rakefile" commit. You can add it after the fact. To tag that commit, you specify the commit checksum (or part of it) at the end of the command:-->

Nehmen wir an, dass Du vergessen hast, Version v1.2 des Projekts zu taggen und dass dies der Commit „updated rakefile“ gewesen ist. Du kannst diesen jetzt im Nachhinein taggen, indem Du die Checksumme des Commits (oder einen Teil davon) am Ende des Befehls angibst:

	$ git tag -a v1.2 -m 'version 1.2' 9fceb02

<!--You can see that you’ve tagged the commit:-->

Du siehst jetzt, dass Du einen Tag für den Commit angelegt hast:

	$ git tag
	v0.1
	v1.2
	v1.3
	v1.4
	v1.4-lw
	v1.5

	$ git show v1.2
	tag v1.2
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:32:16 2009 -0800

	version 1.2
	commit 9fceb02d0ae598e95dc970b74767f19372d61af8
	Author: Magnus Chacon <mchacon@gee-mail.com>
	Date:   Sun Apr 27 20:43:35 2008 -0700

	    updated rakefile
	...

<!--## Sharing Tags-->
## Tags veröffentlichen

<!--By default, the `git push` command doesn’t transfer tags to remote servers. You will have to explicitly push tags to a shared server after you have created them.  This process is just like sharing remote branches — you can run `git push origin [tagname]`.-->

Der `git push` Befehl lädt Tags nicht von sich aus auf externe Server. Stattdessen muss Du Tags explizit auf einen externen Server hochladen, nachdem Du sie angelegt hast. Der Vorgang entspricht dem  bei Branches: Du kannst den Befehl `git push origin [tagname]` verwenden.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

<!--If you have a lot of tags that you want to push up at once, you can also use the `-\-tags` option to the `git push` command.  This will transfer all of your tags to the remote server that are not already there.-->

Wenn Du viele Tags auf einmal hochladen willst, kannst Du dem `git push` Befehl außerdem die `--tags` Option übergeben und auf diese Weise sämtliche Tags auf dem Remote Server veröffentlichen, die dort noch nicht bekannt sind.

	$ git push origin --tags
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	 * [new tag]         v0.1 -> v0.1
	 * [new tag]         v1.2 -> v1.2
	 * [new tag]         v1.4 -> v1.4
	 * [new tag]         v1.4-lw -> v1.4-lw
	 * [new tag]         v1.5 -> v1.5

<!--Now, when someone else clones or pulls from your repository, they will get all your tags as well.-->

Wenn jetzt jemand anderes das Repository klont oder von dort aktualisiert, wird er all diese Tags ebenfalls erhalten.

<!--# Tips and Tricks-->