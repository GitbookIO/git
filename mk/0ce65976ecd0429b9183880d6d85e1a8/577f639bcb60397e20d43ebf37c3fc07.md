# Зачувување на промени во вашето репозитори

Во еден проект имате доверлив Git репозитори и checkout-увана работна копија од сите фајлови во проектот. Секогаш кога ќе сметате дека проектот на кој што работите достигнал некое ниво кое сакате да го зачувате треба да направите 'commit' на промените во вашето репозитори. 
 
Запомнете дека секој фајл од вашиот работен директориум може да биде: да биде следен ('tracked') или да не биде следен('untracked'). Следени фајлови се сите оние кои биле во последната слика; Тие можат да бидат непроменети, променети или на сцена. Неследени фајлови се сите останати - било кои фајлови во вашиот работен директорим кои не биле во последната слика и не се на сцена. Кога за прв пат ќе клонирате некое репозитори сите ваши фајлови ќе бидат следени и непроменети бидејќи само сте ги checkout-увале и не сте направиле никаква промена во нив.

Како што ќе правите промени во фајловите Git ќе ги препознава како фајлови со променета содржина бидејќи тоа се промени после вашиот последен 'commit'.Ваквите фајлови ги ставате на сцена и им правите комит, се така во круг. Животниот циклус е прикажан на слика 2-1.


![](http://git-scm.com/figures/18333fig0201-tn.png)
 
Слика 2-1. Животен циклус на статусот на фајловите.

## Проверка на статусот на фајловите

Главната алатка која ја користите за да дознаете кој фајл во која фаза се наоѓа е Git статус командата. Ако ја извршите оваа комнада веднаш по клонирањето треба да забележите нешто вака:
	$ git status
	# On branch master
	nothing to commit (working directory clean)

Ова значи дека имате чист работен директориѕм, т.е. не постојат следени и променети фајлови. Git не нашол неследени фајлови, во спротивно ќе бидат прикажани овде. Како последна информација што ви ја дава оваа команда е тоа на кој бранч се наоѓате. За сега тоа секогаш е главниот бранч кој е предодреден; не треба да ве засега тоа во овој момент. Во следното поглавје ќе бидат детално разгледани бранчовите и референците.  

Да речеме дека сте додале нов фајл во вашиот проект, некој едноставен README фајл. Ако фајлот не постоел претходно и ако ја извршите командата `git status`, ќе го забележите следното:

	$ vim README
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#	README
	nothing added to commit but untracked files present (use "git add" to track)

Од статусот можеда забележите дека вашиот нов README фајл не е следен и се наоѓа во “Untracked files”. Untracked во основа значи дека Git гледа фајл кој не сте го имале во последната слика (последниот комит); Git нема да го додаде новиот фајл во вашите слики кои ги комитирате се додека не му го кажете тоа експлицитно. Ова е така за да не почнете да додавате ненамерно генерирани бин фајлови или други фајлови кои не сте мислеле да ги додавате. Сакате да го додадете README, па ајде да почнеме да го следиме фајлот.

## Следење на нови фајлови

За да почнете да следите некој нов фајл морате да ја користите командата `git add`. За да започнете да го следите фајлот README можете да го извршите ова:

	$ git add README

Ако ја извршите статус командата повторно ќе забележите дека фајлот README сега е фајл кој се следи и е на сцена:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#

Можете да кажете дека фајлот е на сцена затоа што се наоѓа во “Changes to be committed”. Ако направите комит во оваа точка, историска слика ќе биде верзијата на фајлот пред да ја извршите командата git add. You may recall that when you ran git init earlier, you then ran git add (files) — that was to begin tracking files in your directory. The git add command takes a path name for either a file or a directory; if it’s a directory, the command adds all the files in that directory recursively.

## Поставуванје на сцена променети фајлови

Ајде да промениме еден фајл кој е веќе следен. Ако внесете промени во фајлот `benchmarks.rb`, кој веќе е следен и потоа повторно ја извршите командата `status`, ќе добиете нешто вака:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Фајлот benchmarks.rb се појавува по делот именуван како “Changes not staged for commit” - што значи дека се внесени промени во фајл (од вашиот работен директориум) кој е веќе следен но сеуште не е поставен на сцена. За да го поставите на сцена ја извршувате командата `git add` (ова е повеќе наменска команда - се користи за да почнете да следите некој фајл, за да поставите на сцена некој фајл и за други работи, како на пример означување на фајлови кај кои има merge конфликт како разрешени т.е. без merge конфликт). Ајде сега да ја извршиме командата `git add` за да го поставиме на сцена фајлот benchmarks.rb и потоа повторно ќе ја извршиме `git status` командата:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

И двата фајла се на сцена и ќе бидат вклучени ва вашиот следен комит. Да претпоставиме дека имате усте некоја мала промена која сакате да ја направите во benchmarks.rb пред да направите комит. Го отворате попвторно фајлот, ја правите промената и спремни сте да направие комит. Коко и да е ајде сега уште еднаш да ја извршиме `git status` командатa:

	$ vim benchmarks.rb 
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Што? Сега benchmarks.rb е прикажан и под фајлови поставени на сцена и под фајлови кои не се поставени на сцена. Како е можно? Излегува дека Git го поставува фајлот на сцена ист онаков каков што бил пред да ја извршите git add командата. Ако направите комит во овој момент, верзијата на benchmarks.rb фајлот која ќе биде комитирана ќе биде иста како онаа кога последен пат сте ја извршиле git add командата а не како онаа што е во вашиот работен директориум во моментот кога правите комит. Ако внесете промени во некој фајл откако ќе ја извршите `git add` командата морате да ја извршите истата команда уште еднаш за да ја поставите на сцена последната верзија на фајлот:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

## Игнорирање на фајлови

Често ќе имате класа на фајлови кои не сакате Git втоматски да ги додава или да ги покажува како фајлови кои не се следени. Овие фајлови често се автоматски генерирани фајлови како што се log фајлови или фајлови генерирани од вашиот систем за билдање. Во такви случаи можете да креирате правило за листање именувано како .gitignore. Еве еден пример на .gitignore фајл:

	$ cat .gitignore
	*.[oa]
	*~

The first line tells Git to ignore any files ending in .o or .a — object and archive files that may be the product of building your code. The second line tells Git to ignore all files that end with a tilde (`~`), which is used by many text editors such as Emacs to mark temporary files. You may also include a log, tmp, or pid directory; automatically generated documentation; and so on. Setting up a .gitignore file before you get going is generally a good idea so you don’t accidentally commit files that you really don’t want in your Git repository.

The rules for the patterns you can put in the .gitignore file are as follows:

*	Blank lines or lines starting with # are ignored.
*	Standard glob patterns work.
*	You can end patterns with a forward slash (`/`) to specify a directory.
*	You can negate a pattern by starting it with an exclamation point (`!`).

Glob patterns are like simplified regular expressions that shells use. An asterisk (`*`) matches zero or more characters; `[abc]` matches any character inside the brackets (in this case a, b, or c); a question mark (`?`) matches a single character; and brackets enclosing characters separated by a hyphen(`[0-9]`) matches any character between them (in this case 0 through 9) . 

Here is another example .gitignore file:

	# a comment – this is ignored
	# no .a files
	*.a
	# but do track lib.a, even though you're ignoring .a files above
	!lib.a
	# only ignore the root TODO file, not subdir/TODO
	/TODO
	# ignore all files in the build/ directory
	build/
	# ignore doc/notes.txt, but not doc/server/arch.txt
	doc/*.txt

## Viewing Your Staged and Unstaged Changes

If the `git status` command is too vague for you — you want to know exactly what you changed, not just which files were changed — you can use the `git diff` command. We’ll cover `git diff` in more detail later; but you’ll probably use it most often to answer these two questions: What have you changed but not yet staged? And what have you staged that you are about to commit? Although `git status` answers those questions very generally, `git diff` shows you the exact lines added and removed — the patch, as it were. 

Let’s say you edit and stage the README file again and then edit the benchmarks.rb file without staging it. If you run your `status` command, you once again see something like this:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

To see what you’ve changed but not yet staged, type `git diff` with no other arguments:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

That command compares what is in your working directory with what is in your staging area. The result tells you the changes you’ve made that you haven’t yet staged.

If you want to see what you’ve staged that will go into your next commit, you can use `git diff –-cached`. (In Git versions 1.6.1 and later, you can also use `git diff –-staged`, which may be easier to remember.) This command compares your staged changes to your last commit:

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

It’s important to note that `git diff` by itself doesn’t show all changes made since your last commit — only changes that are still unstaged. This can be confusing, because if you’ve staged all of your changes, `git diff` will give you no output.

For another example, if you stage the benchmarks.rb file and then edit it, you can use `git diff` to see the changes in the file that are staged and the changes that are unstaged:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#

Now you can use `git diff` to see what is still unstaged

	$ git diff 
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats 
	+# test line

and `git diff --cached` to see what you’ve staged so far:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+              
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Committing Your Changes

Now that your staging area is set up the way you want it, you can commit your changes. Remember that anything that is still unstaged — any files you have created or modified that you haven’t run `git add` on since you edited them — won’t go into this commit. They will stay as modified files on your disk.
In this case, the last time you ran `git status`, you saw that everything was staged, so you’re ready to commit your changes. The simplest way to commit is to type `git commit`:

	$ git commit

Doing so launches your editor of choice. (This is set by your shell’s `$EDITOR` environment variable — usually vim or emacs, although you can configure it with whatever you want using the `git config --global core.editor` command as you saw in Chapter 1). 

The editor displays the following text (this example is a Vim screen):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       new file:   README
	#       modified:   benchmarks.rb 
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

You can see that the default commit message contains the latest output of the `git status` command commented out and one empty line on top. You can remove these comments and type your commit message, or you can leave them there to help you remember what you’re committing. (For an even more explicit reminder of what you’ve modified, you can pass the `-v` option to `git commit`. Doing so also puts the diff of your change in the editor so you can see exactly what you did.) When you exit the editor, Git creates your commit with that commit message (with the comments and diff stripped out).

Alternatively, you can type your commit message inline with the `commit` command by specifying it after a -m flag, like this:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master]: created 463dc4f: "Fix benchmarks for speed"
	 2 files changed, 3 insertions(+), 0 deletions(-)
	 create mode 100644 README

Now you’ve created your first commit! You can see that the commit has given you some output about itself: which branch you committed to (master), what SHA-1 checksum the commit has (`463dc4f`), how many files were changed, and statistics about lines added and removed in the commit.

Remember that the commit records the snapshot you set up in your staging area. Anything you didn’t stage is still sitting there modified; you can do another commit to add it to your history. Every time you perform a commit, you’re recording a snapshot of your project that you can revert to or compare to later.

## Skipping the Staging Area

Although it can be amazingly useful for crafting commits exactly how you want them, the staging area is sometimes a bit more complex than you need in your workflow. If you want to skip the staging area, Git provides a simple shortcut. Providing the `-a` option to the `git commit` command makes Git automatically stage every file that is already tracked before doing the commit, letting you skip the `git add` part:

	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+), 0 deletions(-)

Notice how you don’t have to run `git add` on the benchmarks.rb file in this case before you commit.

## Removing Files

To remove a file from Git, you have to remove it from your tracked files (more accurately, remove it from your staging area) and then commit. The `git rm` command does that and also removes the file from your working directory so you don’t see it as an untracked file next time around.

If you simply remove the file from your working directory, it shows up under the “Changes not staged for commit” (that is, _unstaged_) area of your `git status` output:

	$ rm grit.gemspec
	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#   (use "git add/rm <file>..." to update what will be committed)
	#
	#       deleted:    grit.gemspec
	#

Then, if you run `git rm`, it stages the file’s removal:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       deleted:    grit.gemspec
	#

The next time you commit, the file will be gone and no longer tracked. If you modified the file and added it to the index already, you must force the removal with the `-f` option. This is a safety feature to prevent accidental removal of data that hasn’t yet been recorded in a snapshot and that can’t be recovered from Git.

Another useful thing you may want to do is to keep the file in your working tree but remove it from your staging area. In other words, you may want to keep the file on your hard drive but not have Git track it anymore. This is particularly useful if you forgot to add something to your `.gitignore` file and accidentally added it, like a large log file or a bunch of `.a` compiled files. To do this, use the `--cached` option:

	$ git rm --cached readme.txt

You can pass files, directories, and file-glob patterns to the `git rm` command. That means you can do things such as

	$ git rm log/\*.log

Note the backslash (`\`) in front of the `*`. This is necessary because Git does its own filename expansion in addition to your shell’s filename expansion. This command removes all files that have the `.log` extension in the `log/` directory. Or, you can do something like this:

	$ git rm \*~

This command removes all files that end with `~`.

## Moving Files

Unlike many other VCS systems, Git doesn’t explicitly track file movement. If you rename a file in Git, no metadata is stored in Git that tells it you renamed the file. However, Git is pretty smart about figuring that out after the fact — we’ll deal with detecting file movement a bit later.

Thus it’s a bit confusing that Git has a `mv` command. If you want to rename a file in Git, you can run something like

	$ git mv file_from file_to

and it works fine. In fact, if you run something like this and look at the status, you’ll see that Git considers it a renamed file:

	$ git mv README.txt README
	$ git status
	# On branch master
	# Your branch is ahead of 'origin/master' by 1 commit.
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       renamed:    README.txt -> README
	#

However, this is equivalent to running something like this:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git figures out that it’s a rename implicitly, so it doesn’t matter if you rename a file that way or with the `mv` command. The only real difference is that `mv` is one command instead of three — it’s a convenience function. More important, you can use any tool you like to rename a file, and address the add/rm later, before you commit.
