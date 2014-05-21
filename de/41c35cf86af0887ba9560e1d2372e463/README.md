<!--# Git and Other Systems-->
# Git und andere Versionsverwaltungen

<!--The world isn’t perfect. Usually, you can’t immediately switch every project you come in contact with to Git. Sometimes you’re stuck on a project using another VCS, and many times that system is Subversion. You’ll spend the first part of this chapter learning about `git svn`, the bidirectional Subversion gateway tool in Git.-->

Leider ist die Welt nicht perfekt. Normalerweise kannst Du nicht bei jedem Deiner Projekte sofort auf Git umsteigen. Manchmal musst Du in einem Deiner Projekte irgendeine andere Versionsverwaltung nutzen, ziemlich oft ist das Subversion. Im ersten Teil dieses Kapitels werden wir das bidirektionale Gateway zwischen Git und Subversion kennenlernen: `git svn`.

<!--At some point, you may want to convert your existing project to Git. The second part of this chapter covers how to migrate your project into Git: first from Subversion, then from Perforce, and finally via a custom import script for a nonstandard importing case.-->

Manchmal kommst Du an den Zeitpunkt, zu dem Du ein bestehendes Projekt zu Git konvertieren willst. Der zweite Teil dieses Kapitels zeigt Dir, wie Du Dein Projekt zu Git migrieren kannst. Zunächst behandeln wir Subversion, dann Perforce und zum Schluss verwenden wir ein angepasstes Import-Skript, um einen nicht standard-mäßigen Import abzudecken.

<!--# Git and Subversion-->