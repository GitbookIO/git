# Git Attribute

<!--Some of these settings can also be specified for a path, so that Git applies those settings only for a subdirectory or subset of files. These path-specific settings are called Git attributes and are set either in a `.gitattributes` file in one of your directories (normally the root of your project) or in the `.git/info/attributes` file if you don’t want the attributes file committed with your project.-->

Einige dieser Einstellungen können auch auf einen Pfad beschränkt werden, sodass sie nur für bestimmte Unterverzeichnisse oder eine Gruppe von Dateien gültig sind. Diese Einstellungen werden Git Attribute genannt und werden in der Datei `.gitattributes` in einem der Projektverzeichnisse verwaltet (üblicherweise im Root-Verzeichnis Deines Projekts). Alternativ kannst Du diese auch unter `.git/info/attributes` ablegen. In diesem Fall werden die Attribute nicht in das Repository eingecheckt und gelten nur für dieses einzelne, lokale Repository.

<!--Using attributes, you can do things like specify separate merge strategies for individual files or directories in your project, tell Git how to diff non-text files, or have Git filter content before you check it into or out of Git. In this section, you’ll learn about some of the attributes you can set on your paths in your Git project and see a few examples of using this feature in practice.-->

Mittels den Attributen ist es zum Beispiel möglich, verschiedene Merge Strategien für einzelne Dateien oder Verzeichnisse innerhalb Deines Projekts vorzugeben. Ebenso kannst Du Git anweisen, wie ein Vergleich von Binärdateien durchzuführen ist. Oder Du konfigurierst Git so, dass der Inhalt von Dateien vorgefiltert wird, wenn Du ein Commit oder Checkout durchführst. In diesem Abschnitt wirst Du einiger der Attribute kennenlernen, die Du für die einzelnen Verzeichnisse in Deinem Git Projekt vorgeben kannst. Außerdem werde ich einige Beispiele aus der Praxis näher erläutern.

<!--## Binary Files-->
## Binärdateien

<!--One cool trick for which you can use Git attributes is telling Git which files are binary (in cases it otherwise may not be able to figure out) and giving Git special instructions about how to handle those files. For instance, some text files may be machine generated and not diffable, whereas some binary files can be diffed — you’ll see how to tell Git which is which.-->

Mit Hilfe der Git Attribute ist es Dir möglich, Git mitzuteilen, welche Dateien binär sind (für den Fall, dass Git nicht in der Lage ist, dies selbst feszustellen) und wie Git diese behandeln soll. Es kann zum Beispiel sein, dass automatisiert, erstellte Textdateien nicht einfach verglichen werden können. Oder umgekehrt können manche Binärdateien leicht von einem Menschen verglichen werden. Ich werde jetzt aufzeigen, wie Du Git konfigurierst damit es solche Dateien unterscheiden kann.

<!--### Identifying Binary Files-->
### Binärdateien erkennen

<!--Some files look like text files but for all intents and purposes are to be treated as binary data. For instance, Xcode projects on the Mac contain a file that ends in `.pbxproj`, which is basically a JSON (plain text javascript data format) dataset written out to disk by the IDE that records your build settings and so on. Although it’s technically a text file, because it’s all ASCII, you don’t want to treat it as such because it’s really a lightweight database — you can’t merge the contents if two people changed it, and diffs generally aren’t helpful. The file is meant to be consumed by a machine. In essence, you want to treat it like a binary file.-->

Manche Dateien sehen zwar wie Textdateien aus, sollten aber streng genommen als Binärdateien behandelt werden. So enthalten zum Beispiel Xcode Projekte auf dem Mac eine Datei mit der Endung `.pbxproj`. Die Datei ist eigentlich nur ein JSON-Datensatz (ein Klartext Javascript Datenformat), der von der IDE gespeichert wird und unter anderem die Build Einstellungen enthält. Obwohl sie nur ASCII Zeichen enthält und damit technisch gesehen eine Textdatei ist, sollte man diese nicht als solche behandeln. In Wirklichkeit ist diese Datei eine kleine Datenbank, deren Inhalt nicht zusammengeführt werden kann, wenn zwei Leute sie geändert haben. Das Vergleichen der Datei ist ebenso selten hilfreich. Die Datei ist für die Verarbeitung durch einen Computer gedacht. Kurz gesagt, Du willst, dass man sie als Binärdatei behandelt.

<!--To tell Git to treat all `pbxproj` files as binary data, add the following line to your `.gitattributes` file:-->

Um Git anzuweisen alle `pbxproj` Dateien als Binärdateien zu behandeln, kannst Du die folgende Zeile zu Deiner `.gitattributes` Datei hinzufügen:

	*.pbxproj -crlf -diff

<!--Now, Git won’t try to convert or fix CRLF issues; nor will it try to compute or print a diff for changes in this file when you run `git show` or `git diff` on your project. You can also use a built-in macro `binary` that means `-crlf -diff`:-->

Ab jetzt wird Git nicht mehr versuchen CRLF Probleme zu lösen oder die Datei beim Commit oder Checkout zu ändern. Außerdem ermittelt Git keine Dateiunterschiede mehr und gibt diese auch nicht aus, wenn Du den Befehl `git show` oder `git diff` ausführst. Alternativ gibt es auch ein integriertes Makro `binary`, welches den Parametern `-crlf -diff` entspricht:

	*.pbxproj binary

<!--### Diffing Binary Files-->
### Diff bei Binärdateien

<!--In Git, you can use the attributes functionality to effectively diff binary files. You do this by telling Git how to convert your binary data to a text format that can be compared via the normal diff. But the question is how do you convert *binary* data to a text? The best solution is to find some tool that does conversion for your binary format to a text representation. Unfortunately, very few binary formats can be represented as human readable text (imagine trying to convert audio data to a text). If this is the case and you failed to get a text presentation of your file's contents, it's often relatively easy to get a human readable description of that content, or metadata. Metadata won't give you a full representation of your file's content, but in any case it's better than nothing.-->

Mit Hilfe der Git Attribute können Unterschiede in binären Dateien effektiv und leicht angezeigt werden. Du kannst Git so konfigurieren, dass es automatisch Binärdateien in Textdateien umwandelt, damit sie mit einem normalen Diff verglichen werden können. Meist stellt sich aber die Frage, wie man binäre Daten in Text konvertieren soll. Wenn man ein Werkzeug findet, welches einem diese Konvertierung abnimmt und die binäre Daten in ein Textformat umwandelt, ist dies meist die beste Lösung. Leider gibt es nur sehr wenige binäre Formate, die sich dafür eignen, dass man sie in lesbare Textformate umwandelt (Ich denke dabei zum Beispiel an Audio-Daten). Wenn dies der Fall ist und Du keine geeignete Möglichkeit gefunden hast, die Daten in lesbare Form zu wandeln, dann ist es oft relativ einfach eine entsprechende Beschreibung des eigentlichen Inhalts zu erhalten. Alternativ gibt es noch Metadaten, wobei Metadaten einem nicht ein vollständiges Abbild vom Dateiinhalt liefern können, aber in diesem Fall ist das besser als gar nichts.

<!--We'll make use of the both described approaches to get usable diffs for some widely used binary formats.-->

Im folgenden Abschnitt werden wir beide Möglichkeiten besprechen, wie man für weit verbreitete binäre Formate eine lesbare Form für einen Vergleich erhält.

<!--Side note: There are different kinds of binary formats with a text content, which are hard to find usable converter for. In such a case you could try to extract a text from your file with the `strings` program. Some of these files may use an UTF-16 encoding or other "codepages" and `strings` won’t find anything useful in there. Your mileage may vary. However, `strings` is available on most Mac and Linux systems, so it may be a good first try to do this with many binary formats.-->

Anmerkung: Es gibt verschiedene Arten von binären Formaten, welche Text beinhalten, und es ist meist sehr schwierig einen passenden Konverter zu finden. In solchen Fällen kann man sein Glück mit dem `strings`-Programm versuchen. Manche der Formate verwenden ein UTF-16 Encoding oder andere Zeichentabellen. In diesem Fall wird es mit dem Programm `strings` meist nicht funktionieren. Da `strings` jedoch auf den meisten Mac- und Linux-Systemen verfügbar ist, sollte man es durchaus auf einen Versuch ankommen lassen.

<!--#### MS Word files-->
#### MS Word files

<!--First, you’ll use the described technique to solve one of the most annoying problems known to humanity: version-controlling Word documents. Everyone knows that Word is the most horrific editor around; but, oddly, everyone uses it. If you want to version-control Word documents, you can stick them in a Git repository and commit every once in a while; but what good does that do? If you run `git diff` normally, you only see something like this:-->

Als erstes werden wir die beschriebene Technik benutzen um eines der lästigsten Probleme der Menschheit zu lösen: Versionskontrolle von Word Dokumenten. Jeder weiß, dass Word der schrecklichste Editor der Welt ist, aber trotzdem benutzt ihn jeder. Wenn Du Word Dokumente versionieren willst, kannst Du sie in Dein Repository packen und ab und zu einen Commit durchführen. Aber wozu ist das nützlich? Wenn Du einen Vergleich mit `git diff` ausführst, erhälst Du ähnliche Ausgabe wie diese:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index 88839c4..4afcb7c 100644
	Binary files a/chapter1.doc and b/chapter1.doc differ

<!--You can’t directly compare two versions unless you check them out and scan them manually, right? It turns out you can do this fairly well using Git attributes. Put the following line in your `.gitattributes` file:-->

Du kannst zwei Versionen nicht direkt vergleichen, außer Du checkst sie aus und prüfst sie manuell, richtig? Es stellt sich heraus, dass dies recht gut mittels Git Attributen möglich ist. Füge dazu die folgende Zeile in Deine `.gitattributes` Datei ein:

	*.doc diff=word

<!--This tells Git that any file that matches this pattern (.doc) should use the "word" filter when you try to view a diff that contains changes. What is the "word" filter? You have to set it up. Here you’ll configure Git to use the `catdoc` program, which was written specifically for extracting text from a binary MS Word documents (you can get it from `http://www.wagner.pp.ru/~vitus/software/catdoc/`), to convert Word documents into readable text files, which it will then diff properly:-->

Dies weist Git an, dass auf jede Datei, die diesem Dateimuster (.doc) entspricht, der „word“ Filter angewandt werden soll, wenn Du versuchst, einen Diff mit Dateiunterschieden anzusehen. Was ist nun der „word“ Filter? Dieser muss von Dir noch konfiguriert werden. Du kannst Git so konfigurieren, dass es das `catdoc` Programm verwendet um Word Dokumente in lesbare Textdateien zu konvertieren. `catdoc` wurde speziell dafür entwickelt um lesbaren Text aus binären MS Word Dokumenten zu extrahieren (du erhälst es unter `http://www.wagner.pp.ru/~vitus/software/catdoc/`).   Bei jedem Diff wird Git diese Konvertierung durchführen:

	$ git config diff.word.textconv catdoc

<!--This command adds a section to your `.git/config` that looks like this:-->

Dieser Befehl fügt in der Datei `.git/config` eine Sektion mit folgendem Aufbau hinzu:

	[diff "word"]
		textconv = catdoc

<!--Now Git knows that if it tries to do a diff between two snapshots, and any of the files end in `.doc`, it should run those files through the "word" filter, which is defined as the `catdoc` program. This effectively makes nice text-based versions of your Word files before attempting to diff them.-->

Bei jedem Vergleich von zwei Schnappschüssen wird Git Dateien mit der Dateiendung `.doc` durch den „word“ Filter jagen, welcher durch das `catdoc` Programm definiert ist. Das erzeugt gut lesbare Textversionen Deiner Word Dateien, die für den Vergleich herangezogen werden.

<!--Here’s an example. I put Chapter 1 of this book into Git, added some text to a paragraph, and saved the document. Then, I ran `git diff` to see what changed:-->

Dazu ein Beispiel. Ich habe Kapitel 1 des Buches in ein Word-Dokument einfgefügt und in Git gespeichert. Danach habe ich etwas Text in einem Absatz geändert, die Datei gespeichert und den Befehl `git diff` ausgeführt um zu prüfen, was sich geändert hat:

	$ git diff
	diff --git a/chapter1.doc b/chapter1.doc
	index c1c8a0a..b93c9e4 100644
	--- a/chapter1.doc
	+++ b/chapter1.doc
	@@ -128,7 +128,7 @@ and data size)
	 Since its birth in 2005, Git has evolved and matured to be easy to use
	 and yet retain these initial qualities. It’s incredibly fast, it’s
	 very efficient with large projects, and it has an incredible branching
	-system for non-linear development.
	+system for non-linear development (See Chapter 3).

<!--Git successfully and succinctly tells me that I added the string "(See Chapter 3)", which is correct. Works perfectly!-->

Git war erfolgreich und zeigt nun kurz und bündig an, dass ich den Text „(See Chapter 3)“ hinzugefügt habe, was korrekt ist. Wie du siehst, funktioniert perfekt.

<!--#### OpenDocument Text files-->
#### OpenDocument Textdateien

<!--The same approach that we used for MS Word files (`*.doc`) can be used for OpenDocument Text files (`*.odt`) created by OpenOffice.org.-->

Bei OpenDocument Textdateien (`*.odt`), die mit OpenOffice erstellt wurden, können wir die gleiche Herangehensweise wie bei MS Word Dateien (`*.odt`) anwenden.

<!--Add the following line to your `.gitattributes` file:-->

Füge die folgende Zeile zu der `.gitattributes` Datei hinzu:

	*.odt diff=odt

<!--Now set up the `odt` diff filter in `.git/config`:-->

Jetzt müssen wir noch den `odt` Diff Filter in der `.git/config` hinzufügen:

	[diff "odt"]
		binary = true
		textconv = /usr/local/bin/odt-to-txt

<!--OpenDocument files are actually zip’ped directories containing multiple files (the content in an XML format, stylesheets, images, etc.). We’ll need to write a script to extract the content and return it as plain text. Create a file `/usr/local/bin/odt-to-txt` (you are free to put it into a different directory) with the following content:-->

OpenDocument Dateien sind eigentlich komprimierte Zip Verzeichnisse, die mehrere Dateien enthalten (der Inhalt: XML-Dateien, Stylesheets, Bilder, usw.). Wir müssen ein Skript schreiben um den Inhalt zu extrahieren und das Ergebnis als reinen Text zurückliefern. Erzeuge dazu eine Datei `/usr/local/bin/odt-to-txt` (die Datei kann in einem beliebigen Verzeichnis abgelegt werden) mit dem folgenden Inhalt:

	#! /usr/bin/env perl
	# Simplistic OpenDocument Text (.odt) to plain text converter.
	# Author: Philipp Kempgen

	if (! defined($ARGV[0])) {
		print STDERR "No filename given!\n";
		print STDERR "Usage: $0 filename\n";
		exit 1;
	}

	my $content = '';
	open my $fh, '-|', 'unzip', '-qq', '-p', $ARGV[0], 'content.xml' or die $!;
	{
		local $/ = undef;  # slurp mode
		$content = <$fh>;
	}
	close $fh;
	$_ = $content;
	s/<text:span\b[^>]*>//g;           # remove spans
	s/<text:h\b[^>]*>/\n\n*****  /g;   # headers
	s/<text:list-item\b[^>]*>\s*<text:p\b[^>]*>/\n    --  /g;  # list items
	s/<text:list\b[^>]*>/\n\n/g;       # lists
	s/<text:p\b[^>]*>/\n  /g;          # paragraphs
	s/<[^>]+>//g;                      # remove all XML tags
	s/\n{2,}/\n\n/g;                   # remove multiple blank lines
	s/\A\n+//;                         # remove leading blank lines
	print "\n", $_, "\n\n";

<!--And make it executable-->

Nun musst Du diese Datei noch ausführbar machen:

	chmod +x /usr/local/bin/odt-to-txt

<!--Now `git diff` will be able to tell you what changed in `.odt` files.-->

Jetzt kann Dir `git diff` aufzeigen, was sich in `.odt` Dateien geändert hat.

<!--#### Image files-->
#### Bilddateien

<!--Another interesting problem you can solve this way involves diffing image files. One way to do this is to run PNG files through a filter that extracts their EXIF information — metadata that is recorded with most image formats. If you download and install the `exiftool` program, you can use it to convert your images into text about the metadata, so at least the diff will show you a textual representation of any changes that happened:-->

Auf diese Art und Weise kann man ein weiteres, interessantes Problem lösen. Das Vergleichen von Bilddateien. Eine Möglichkeit dies zu tun, ist es, JPEG Dateien durch einen Filter zu schicken, der ihre EXIF Bildinformationen extrahiert. EXIF Bildinformationen sind Metadaten, die den meisten Bilddateien beigefügt werden. Wenn Du das Programm `exiftool` herunterlädst und installierst, kannst Du es benutzen um Deine Bilder in einen Text mit diesen Metainformationen umzuwandeln. Damit kann Dir ein Diff zumindest eine textuelle Repräsentation aller Veränderungen an der Datei anzeigen:

	$ echo '*.png diff=exif' >> .gitattributes
	$ git config diff.exif.textconv exiftool

<!--If you replace an image in your project and run `git diff`, you see something like this:-->

Wenn Du nun ein Bild in Deinem Projekt ersetzt und `git diff` ausführst, erhälst Du in etwa folgende Ausgabe:

	diff --git a/image.png b/image.png
	index 88839c4..4afcb7c 100644
	--- a/image.png
	+++ b/image.png
	@@ -1,12 +1,12 @@
	 ExifTool Version Number         : 7.74
	-File Size                       : 70 kB
	-File Modification Date/Time     : 2009:04:17 10:12:35-07:00
	+File Size                       : 94 kB
	+File Modification Date/Time     : 2009:04:21 07:02:43-07:00
	 File Type                       : PNG
	 MIME Type                       : image/png
	-Image Width                     : 1058
	-Image Height                    : 889
	+Image Width                     : 1056
	+Image Height                    : 827
	 Bit Depth                       : 8
	 Color Type                      : RGB with Alpha

<!--You can easily see that the file size and image dimensions have both changed.-->

Man sieht auf einen Blick, dass sowohl Dateigröße als auch die Bildabmessungen verändert wurden.

<!--## Keyword Expansion-->
## Schlüsselworterweiterung

<!--SVN- or CVS-style keyword expansion is often requested by developers used to those systems. The main problem with this in Git is that you can’t modify a file with information about the commit after you’ve committed, because Git checksums the file first. However, you can inject text into a file when it’s checked out and remove it again before it’s added to a commit. Git attributes offers you two ways to do this.-->

Entwickler, die an SVN- oder CVS-ähnliche Systeme gewöhnt sind, fragen oft nach der Möglichkeit Schlüsselwörter zu erweitern oder zu ersetzen. Mit Git ist dies nicht so einfach möglich, da eine Datei nach einem durchgeführten Commit nicht mehr verändert werden kann. Die Information über den Commit kann also nicht zur Datei hinzugefügt werden, da Git bereits bereits vor dem Commit die Prüfsumme berechnet. Jedoch hast Du die Möglichkeit Text einzufügen, wenn die Datei ausgecheckt wird und diesen dann wieder entfernen, wenn die Datei zu einem Commit hinzugefügt wird. Die Git Attribute bieten hierfür zwei Möglichkeiten an.

<!--First, you can inject the SHA-1 checksum of a blob into an `$Id$` field in the file automatically. If you set this attribute on a file or set of files, then the next time you check out that branch, Git will replace that field with the SHA-1 of the blob. It’s important to notice that it isn’t the SHA of the commit, but of the blob itself:-->

Zunächst kannst Du die SHA-1 Prüfsumme eines Blobs automatisch in ein `$Id$` Feld einer Datei einfügen. Wenn Du das folgende Attribut für eine oder eine Gruppe von Dateien einstellst, wird Git dieses Feld beim nächsten Checkout mit dem SHA-1 Wert dessen Blobs ersetzen. Hierbei ist es wichtig zu beachten, dass es die Prüfsumme des Blobs selbst ist, und nicht die des Commits:

	$ echo '*.txt ident' >> .gitattributes
	$ echo '$Id$' > test.txt

<!--The next time you check out this file, Git injects the SHA of the blob:-->

Wenn Du diese Datei das nächste Mal auscheckst, wird Git den SHA Wert des Blobs einfügen:

	$ rm test.txt
	$ git checkout -- test.txt
	$ cat test.txt
	$Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $

<!--However, that result is of limited use. If you’ve used keyword substitution in CVS or Subversion, you can include a datestamp — the SHA isn’t all that helpful, because it’s fairly random and you can’t tell if one SHA is older or newer than another.-->

Allerdings ist das Ergebnis nur beschränkt verwertbar. Die SHA Werte als solches sind nicht sehr hilfreich, da sie recht zufällig sind und nicht festgestellt werden kann ob ein SHA Wert älter oder neuer ist, als der andere. In anderen Systemen, wie CVS oder Subversion kann man mit Hilfe der Keyword Expansion Datum- und Zeitstempel einfügen.

<!--It turns out that you can write your own filters for doing substitutions in files on commit/checkout. These are the "clean" and "smudge" filters. In the `.gitattributes` file, you can set a filter for particular paths and then set up scripts that will process files just before they’re checked out ("smudge", see Figure 7-2) and just before they’re committed ("clean", see Figure 7-3). These filters can be set to do all sorts of fun things.-->

Wie sich herausstellt, kann man aber seine eigenen Filter schreiben, um bei Commits oder Checkouts Schlüsselwörter in Dateien zu ersetzen. In der `.gitattributes` Datei kann man einen Filter für bestimmte Pfade angeben und dann Skripte einrichten, die Dateien kurz vor einem Checkout („smudge“, siehe Abbildung 7-2) und kurz vor einem Commit („clean“, siehe Abbildung 7-3) modifizieren. Diese Filter können eingerichtet werden, um alle möglichen witzigen Dinge zu machen.

<!--Figure 7-2. The “smudge” filter is run on checkout.-->


![](http://git-scm.com/figures/18333fig0702-tn.png)

Abbildung 7-2. Der „smudge“ Filter wird beim Checkout ausgeführt.

<!--Figure 7-3. The “clean” filter is run when files are staged.-->


![](http://git-scm.com/figures/18333fig0703-tn.png)

Abbildung 7-3. Der „clean“ Filter wird beim Transfer in die Staging Area ausgeführt.

<!--The original commit message for this functionality gives a simple example of running all your C source code through the `indent` program before committing. You can set it up by setting the filter attribute in your `.gitattributes` file to filter `*.c` files with the "indent" filter:-->

Die Beschreibung des ersten Commits dieser Funktionalität enthält ein einfaches Beispiel, wie man all seinen C Quellcode durch das `indent` Programm leiten lassen kann, bevor ein Commit gemacht wird. Du kannst dies einrichten, indem Du das entsprechende Filterattribut in der `.gitattributes` Datei auflistest, damit `*.c` Dateien mit dem „indent“ Programm gefiltert werden:

	*.c     filter=indent

<!--Then, tell Git what the "indent" filter does on smudge and clean:-->

Dann muss Git noch gesagt werden, was der „indent“ Filter bei „smudge“ und „clean“ zu tun hat:

	$ git config --global filter.indent.clean indent
	$ git config --global filter.indent.smudge cat

<!--In this case, when you commit files that match `*.c`, Git will run them through the indent program before it commits them and then run them through the `cat` program before it checks them back out onto disk. The `cat` program is basically a no-op: it spits out the same data that it gets in. This combination effectively filters all C source code files through `indent` before committing.-->

Wenn ein Commit Dateien umfasst, die dem Muster `*.c` entspechen, wird Git diese Dateien vor Ausführung des Commits durch das `indent` Programm leiten. Werden sie wieder ausgecheckt, so schickt Git sie durch das `cat` Programm. `cat` ist im Grunde genommen eine Null-Operation: es gibt genau die Daten wieder aus, die hereinkommen. Diese Einstellung bewirkt also tatsächlich nur, dass alle C Quellcode Dateien vor einem Commit durch den `indent` Filter bearbeitet werden.

<!--Another interesting example gets `$Date$` keyword expansion, RCS style. To do this properly, you need a small script that takes a filename, figures out the last commit date for this project, and inserts the date into the file. Here is a small Ruby script that does that:-->

Ein weiteres interessantes Beispiel ermöglicht im Stile von RCS die Schlüsselworterweiterung `$Date$`. Damit dies vernünftig funktioniert, brauchst Du ein kleines Skript, welches mit Hilfe des Dateinamen das letzte Commitdatum in diesem Projekt herausfindet und dieses Datum in die Datei einfügt. Hierzu ein kleines Beispiel als Ruby Skript:

	#! /usr/bin/env ruby
	data = STDIN.read
	last_date = `git log --pretty=format:"%ad" -1`
	puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')

<!--All the script does is get the latest commit date from the `git log` command, stick that into any `$Date$` strings it sees in stdin, and print the results — it should be simple to do in whatever language you’re most comfortable in. You can name this file `expand_date` and put it in your path. Now, you need to set up a filter in Git (call it `dater`) and tell it to use your `expand_date` filter to smudge the files on checkout. You’ll use a Perl expression to clean that up on commit:-->

Das Skript ermittelt das letzte Commitdatum mittels des Befehls `git log`, ersetzt jede Zeichenfolge von `$Date` im Stream stdin mit dem Commitdatum und gibt das Ergebnis wieder aus. Dieses Skript sollte auch in der Skriptsprache Deiner Wahl leicht umzusetzen sein. Am besten nennst Du dieses Skript `expand_date` und legst es in Deinem Standard Suchpfad ab. Nun musst Du noch einen Filter (nennen wir ihn `dater`) in Git einrichten, der Dein `expand_date` Skript benutzt, um die Textdateien beim Checkout zu modifizieren. Zum Säubern der Dateien wird beim Commit ein Perl Ausdruck verwendet:

	$ git config filter.dater.smudge expand_date
	$ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'

<!--This Perl snippet strips out anything it sees in a `$Date$` string, to get back to where you started. Now that your filter is ready, you can test it by setting up a file with your `$Date$` keyword and then setting up a Git attribute for that file that engages the new filter:-->

Um wieder zum Ursprungszustand zurückzukehren entfernt dieses kurze Perl Schnipsel alles was es in einer `$Date$` Zeichenfolge findet. Jetzt da Dein Filter fertig ist, kannst Du ihn testen indem Du eine Datei mit dem `$Date$` Schlüsselwort erstellst und das entsprechende Git Attribut für diese Datei einrichtest:

	$ echo '# $Date$' > date_test.txt
	$ echo 'date*.txt filter=dater' >> .gitattributes

<!--If you commit those changes and check out the file again, you see the keyword properly substituted:-->

Wenn Du diese Änderungen eincheckst und wieder erneut auscheckst, sollte Dein Schlüsselwort korrekt ersetzt worden sein:

	$ git add date_test.txt .gitattributes
	$ git commit -m "Testing date expansion in Git"
	$ rm date_test.txt
	$ git checkout date_test.txt
	$ cat date_test.txt
	# $Date: Tue Apr 21 07:26:52 2009 -0700$

<!--You can see how powerful this technique can be for customized applications. You have to be careful, though, because the `.gitattributes` file is committed and passed around with the project but the driver (in this case, `dater`) isn’t; so, it won’t work everywhere. When you design these filters, they should be able to fail gracefully and have the project still work properly.-->

Man kann sehen wie mächtig diese Technik für Deinen Entwickleralltag sein kann. Da die `.gitattributes` Datei ebenfalls im Git Repository verwaltet wird und damit an alle Benutzer weitergeben wird, solltest Du vorsichtig mit Filtern umgehen. Denn Dein Filterskript (in diesem Fall das Skript `dater`) liegt nicht unter Versionskontrolle. Deshalb kann es passieren, dass die Schlüsselwortersetzung beziehungsweise das Arbeiten mit dem Repository nicht bei jedem funktioniert. Beim Entwickeln von Filtern solltest Du deshalb darauf achten, dass das Projekt weiterhin benutzt werden kann, auch wenn ein Filter einmal fehlschlägt.

<!--## Exporting Your Repository-->
## Exportieren von Repositorys

<!--Git attribute data also allows you to do some interesting things when exporting an archive of your project.-->

Git Attribute erlauben auch einige interessante Dinge, wenn Du Dein Projekt in ein Archiv exportierst.

<!--### export-ignore-->
### export-ignore

<!--You can tell Git not to export certain files or directories when generating an archive. If there is a subdirectory or file that you don’t want to include in your archive file but that you do want checked into your project, you can determine those files via the `export-ignore` attribute.-->

Du kannst Git anweisen gewisse Dateien oder Verzeichnisse nicht zu exportieren, wenn es ein Archiv erzeugt. Falls es Unterverzeichnisse oder Dateien gibt, die Du nicht in Deiner Archivdatei haben willst, aber in Deinem Projektrepository, so kannst Du diese Datein mit Hilfe des `export-ignore` Attributes festlegen.

<!--For example, say you have some test files in a `test/` subdirectory, and it doesn’t make sense to include them in the tarball export of your project. You can add the following line to your Git attributes file:-->

Nehmen wir zum Beispiel an, Du hast einige Testdateien in einem `test/` Unterverzeichnis und es macht keinen Sinn, dass diese in einem Tarball Export Deines Projekts enthalten sind. In diesem Fall kannst Du die folgende Zeile in Deine Git Attribute aufnehmen:

	test/ export-ignore

<!--Now, when you run git archive to create a tarball of your project, that directory won’t be included in the archive.-->

Wenn Du jetzt `git archive` ausführst, um einen Tarball Deines Projekts zu erstellen, wird das Verzeichnis nicht mit in das Archiv aufgenommen.

<!--### export-subst-->
### export-subst

<!--Another thing you can do for your archives is some simple keyword substitution. Git lets you put the string `$Format:$` in any file with any of the `-\-pretty=format` formatting shortcodes, many of which you saw in Chapter 2. For instance, if you want to include a file named `LAST_COMMIT` in your project, and the last commit date was automatically injected into it when `git archive` ran, you can set up the file like this:-->

Auch das einfache Ersetzen von Schlüsselwörtern ist bei einem Archivierungsvorgang möglich. Git erlaubt die Zeichenfolge `$Format:$` mit allen Formatierungsoptionen des Parameters `--pretty=format` in jeglichen Dateien. Viele der Optionen hast Du bereits in Kapitel 2 kennengelernt. Wenn Du zum Beispiel eine Datei namens `LAST_COMMIT` zu Deinem  Projekt hinzufügen willst, welche das Datum des letzten  Commits enthalten soll, dann kannst Du die folgenden Befehle ausführen:

	$ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
	$ echo "LAST_COMMIT export-subst" >> .gitattributes
	$ git add LAST_COMMIT .gitattributes
	$ git commit -am 'adding LAST_COMMIT file for archives'

<!--When you run `git archive`, the contents of that file when people open the archive file will look like this:-->

Nach Ausführung des Befehls `git archive`, wird die Datei `LAST_COMMIT` in Deinem Archiv in etwa folgendermaßen aussehen:

	$ cat LAST_COMMIT
	Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$

<!--## Merge Strategies-->
## Merge Strategien

<!--You can also use Git attributes to tell Git to use different merge strategies for specific files in your project. One very useful option is to tell Git to not try to merge specific files when they have conflicts, but rather to use your side of the merge over someone else’s.-->

Die Git Attribute ermöglichen es ebenso verschiedene Regeln für das Zusammenführen bestimmter Dateien innerhalb Deines Projekts festzulegen. Eine besonders nützliche Option ist es, Git so einzustellen, dass es bei bestimmten Dateien kein Zusammenführen von Konfliktstellen versucht, sondern einfach Deine Version übernimmt und die des anderen verwirft.

<!--This is helpful if a branch in your project has diverged or is specialized, but you want to be able to merge changes back in from it, and you want to ignore certain files. Say you have a database settings file called database.xml that is different in two branches, and you want to merge in your other branch without messing up the database file. You can set up an attribute like this:-->

Dies ist hilfreich, falls ein Zweig Deines Projekts sehr weit vom Hauptzweig abgewichen oder sehr speziell ist, aber Du weiterhin in der Lage sein willst, Änderungen daran zurückzuführen und dabei gewisse Dateien zu ignorieren. Nehmen wir an Du hast eine Konfigurationsdatei einer Datenbank namens database.xml, welche sich in zwei Zweigen unterscheidet. Wenn Du jetzt einen Merge von dem anderen Zweig machen möchtest ohne Deine Datenbankdatei unbrauchbar zu machen, dann kannst Du folgendes Attribut einrichten:

	database.xml merge=ours

<!--If you merge in the other branch, instead of having merge conflicts with the database.xml file, you see something like this:-->

Wenn Du ein Merge des anderen Zweiges machst, werden für die Datei database.xml keine Merge-Konflikte auftreten, sondern es wird folgendes ausgegeben:

	$ git merge topic
	Auto-merging database.xml
	Merge made by recursive.

<!--In this case, database.xml stays at whatever version you originally had.-->

In diesem Fall wird die Datei database.xml aus dem anderen Zweig ignoriert und in Deinem Zweig bleibt die Datei im gleichen Zustand wie vor dem Merge.

<!--# Git Hooks-->