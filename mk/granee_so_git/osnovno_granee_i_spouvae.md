# Основно Гранење и Спојување

Да разгледаме еден едноставен пример на гранење и спојување на гранки преку едноставен модел на работа кој реално би можел да се користи. Да го следиме следново сценарио:

1.  Работете на некоја веб страна.
2.  Креирате гранка за нов натпис на кој работете.
3.  Работете на оваа гранка.

Во овој момент добивате повик дека друг настан е со поголем преоритет и треба брза реакција. Го правите следново:

1.  Се враќате назад кон вашата гранка која ја користите за продукција.
2.  Креирајте гранка за да ги додадете потребните итни измени.
3.  Откако се е истестирано, ја спојувате новата гранка со гранката за продукција.
4.  Вратете се назад кон почетниот натпис на кој работевте.

## Основно гранење

Да претпоставиме дека работите на вашиот проект и веќе имате направено неколку комитирања (Слика 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)
 
Слика 3-10. Кратка и едноставна историја на записи.

Сте одлучиле дека сакате да работите на изданието #53, во кој и да било систем за водење на евиденција кој го користи вашата компанија. Да разјасниме Git не е поврзан со никој специфичен систем за евиденција на изданијата, но бидејќи сакате да работите на изданието #53, креирате нова гранка на која ќе работите. За да креираме гранка и да се префрлиме на неа може да ја користеме командата `git checkout` со опцијата `-b`:

	$ git checkout -b iss53
	Се префрламе на нова гранка "iss53"

Ова е скратеница за:

	$ git branch iss53
	$ git checkout iss53

Слика 3-11 го прикажува резултатот.


![](http://git-scm.com/figures/18333fig0311-tn.png)
 
Слика 3-11. Креирање на нов покажувач кон гранка.

Додека работите на вашата веб страна правите комит т.е ги зачувувате измените. Со ова гранката `iss53` се поместува нанапред, бидејќи сте направиле checked out (HEAD покажува кон неа; Слика 3-12):

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)
 
Слика 3-12. Гранката iss53 се поместува нанапред.

Во овој момент добивате известување дека има проблем со вашата веб страна и морате итно да го поравете проблемот. Со Git немора решението на проблемот да го направите заедно со промените на гранката `iss53`. Се што треба да направите е да се вратите назад кон вашата главна гранка (master branch).

Мора да се запази фактот дека Git нема да ви дозволи да ја смените гранката доколку во вашиот работен директориум или на сцена имате некомитирани промени кои се во конфликт со грнаката од која сакате да направите нова гранка. Најдобро е да имате чиста работна состојба пред да правите промена на гранки. Постојат начини да се заобиколи ова, кои ќе бидат објаснети подоцна. Засега вршиме комитирање на сите измени, за да се префрлиме на главната гранка:

	$ git checkout master
	Се префрламе на гранката "master"

Во овој момент, вашиот работен директориум за проектот е ист како пред почнување со работа на изданието #53 и можете да се концентрирате на решавање на настанатиот проблем. Ова е важна особина која треба да се запамети: Git го ресетира вашиот работен директориум да изгледа како целосната слика на записот од кој креирате нова гранка. Тој автоматски ги додава, бриши и модифицира датотеките се со цел вашата работна копија да биде иста со гранката во моментот кога последен пат сте комитирале на истата.

Потоа треба да го внесете решението на проблемот кој го имате. Да креираме нова гранка hotfix на која ќе работиме на проблемот (Слика 3-13):

	$ git checkout -b 'hotfix'
	Се префрламе на нова гранка "hotfix"
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix]: created 3a0874c: "fixed the broken email address"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)
 
Слика 3-13. Гранка hotfix базирана на вашата главна гранка.

Можете да направите одредени тестови за да бидете сигурни дека проблемот е решен, а потоа ја соединувате гранката со вашата главна гранка. Ова се прави со командата `git merge`:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast forward
	 README |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Во ова соединување се појавува фразата "Fast forward". Бидејќи записот кон кој што покажува гранката која ја споивте е наследник на записот на кој моментално се наоѓаме, Git го поместува покажувачот нанапред. Со други зборови кога спојуваме еден запис со запис кон кој може да се пристапи следејќи ја историјата на првиот запис, Git ги поедноставува работите со поместување на покажувачот нанапред бидејќи нема неконзистентни измени за спојување. Ова се нарекува "fast forward".

Вашите измени сега се наоѓаат во целосниот запис кон кој покажува `master` гранката (Слика 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)
 
Слика 3-14. По спојувањето главна гранка покажува кон истото место кон кое покажува hotfix гранката.

Откако решенитео на ненадејниот проблем е зачувано, подготвени сме да се вратиме назад на работата која ја работевме пред да бидеме прекинати. Меѓутоа прво ја бришеме `hotfix` гранката бидејќи повеќе не ни е потребна - `master` гранката покажува на исто место. Ова се прави со додавање на опцијата `-d` на командата `git branch`:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Сега можете да се вратите кон гранката за изданието #53 и да продолжите со работа (Слика 3-15):

	$ git checkout iss53
	Switched to branch "iss53"
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53]: created ad82d7a: "finished the new footer [issue 53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)
 
Слика 3-15. Сега гранката iss53 може независно да се придвижува нанапред.

Овде е важно да се напомене дека промените кои се направени во `hotfix` гранката не се вклучени во гранката `iss53`. Ако сакате да ги повлечете овие промени, може да ја споите вашата `master` гранка со гранката `iss53` со извршување на командата `git merge master` или пак може подоцна ги повечете измените од `iss53` назад кон `master` гранката.

## Основно спојување

Да претпоставиме дека сте завршиле со работа на изданието #53 и сте подготвени да ги споите измените во `master` гранката. За да го направиме ова ќе ја споиме `iss53` гранката слично како што направивме претходно со `hotfix` гранката. Се што треба да направиме е да ја одвоиме гранката која сакаме да ја надградиме и да ја повикаме командата `git merge`:

	$ git checkout master
	$ git merge iss53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Ова изгледа малку поинаку отколку претходниот случај со спојувањето на `hotfix` гранката. Во овој случај вашата историја на развој започнува од некоја постара точка. Поради тоа што записот на гранката на која се наоѓате не е директен наследник на гранката на која што сакате да запишете, Git мора да изврши дополнителни работи. Во овој случај Git врши едноставено тристрано спојување, користејќи ги целосните записи кон кои покажуваат двете гранки и нивниот заеднички предок. На Слика 3-16 се прикажани трите целосни записи кои Git ги користи при ова спојување.


![](http://git-scm.com/figures/18333fig0316-tn.png)
 
Слика 3-16. Git автоматски го пронаоѓа најдобриот заеднички предок, кој го користи како основа за спојување.

Наместо да го помести покажувачот нанапред, Git креира нов целосен запис кој произлегува од ова тристрано спојување и креира нов комит кој покажува кон него (Слика 3-17). Овој запис при спојување е карактеристичен по тоа што има повеќе од еден родител.

Важно е да се напомене дека Git го одредува најдобриот предок кој го користи како основа при спојувањето; ова е различно од CVS или од Subversion(пред верзијата 1.5), каде програмерот кој го врши спојувањето мора сам да одреди кој е најдобар предок. Ова го прави спојувањето со Git доста полесно во споредба со овие системи.


![](http://git-scm.com/figures/18333fig0317-tn.png)
 
Слика 3-17. Git автоматски креира нов комит објект кој ги содржи споените измени.

Сега откако вашите измени се споени со главната гранака немате потреба од гранката `iss53`. Може слободно да ја избришиме:

	$ git branch -d iss53

## Основни конфликти при спојување

Повремено овој процес не се одвива толку едноставно. Git нема да може да ги спои гранките доколку имате промени во ист дел од иста датотека во двете гранки кои сакате да ги споите. Доколку вашите измени во изданието #53 афектираат ист дел од датотека на која сте работеле на `hotfix` гранката, ќе добиете конфликт кој изгледа вака:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git автоматски нема да креира нов комит објект. Тој го паузира процесот се додека не го разрешите конфликтот. Доколку сакате да видете кои датотеки не се споени после конфликтот може да ја повикате командата `git status`:

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Секој директориум во кој има конфликти кои не се разрешени се пикажани како unmerged. Git додава стандардни маркери за разрешување на конфликти на директориумите кои имаат конфликти. Конфликтните датотеки имаат секции кои изгледаат вака:

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53:index.html

Ова означува дека везијата во HEAD (вашата master гранка, бидејќи таа е гранката која ја одвоивте при повикување на командата merge) е горниот дел од сегментот (се што е над `=======`), додека верзијата во `iss53` гранката изгледа како долниот дел од сегментот. Со цел да се разреши конфликтот треба да одберете една од можностите и да ја споете содржината мануелно. На пример овој конфликт може да се разреши со промена на целиот блок со:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

This resolution has a little of each section, and I’ve fully removed the `<<<<<<<`, `=======`, and `>>>>>>>` lines. After you’ve resolved each of these sections in each conflicted file, run `git add` on each file to mark it as resolved. Staging the file marks it as resolved in Git.
If you want to use a graphical tool to resolve these issues, you can run `git mergetool`, which fires up an appropriate visual merge tool and walks you through the conflicts:

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

If you want to use a merge tool other than the default (Git chose `opendiff` for me in this case because I ran the command on a Mac), you can see all the supported tools listed at the top after “merge tool candidates”. Type the name of the tool you’d rather use. In Chapter 7, we’ll discuss how you can change this default value for your environment.

After you exit the merge tool, Git asks you if the merge was successful. If you tell the script that it was, it stages the file to mark it as resolved for you.

You can run `git status` again to verify that all conflicts have been resolved:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

If you’re happy with that, and you verify that everything that had conflicts has been staged, you can type `git commit` to finalize the merge commit. The commit message by default looks something like this:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

You can modify that message with details about how you resolved the merge if you think it would be helpful to others looking at this merge in the future — why you did what you did, if it’s not obvious.
