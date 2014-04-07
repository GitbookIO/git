# Интерактивное индексирование

Вместе с Git'ом поставляется пара сценариев (script), облегчающих выполнение некоторых задач в командной строке. Сейчас мы посмотрим на несколько интерактивных команд, которые помогут вам легко смастерить свои коммиты так, чтобы включить в них только определённые части файлов. Эти инструменты сильно помогают в случае, когда вы поменяли кучу файлов, а потом решили, что хотите, чтобы эти изменения были в нескольких сфокусированных коммитах, а не в одном большом путанном коммите. Так вы сможете убедиться, что ваши коммиты — это логически разделённые наборы изменений, которые будет легко просматривать другим разработчикам, работающим с вами.
Если вы выполните `git add` с опцией `-i` или `--interactive`, Git перейдёт в режим интерактивной оболочки и покажет что-то похожее на это:

	$ git add -i
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 

Как видите, эта команда показывает содержимое индекса, но в другом виде — по сути, ту же информацию вы получили бы при вызове `git status`, но здесь она в более сжатом и информативном виде. `git add -i` показывает проиндексированные изменения слева, а непроиндексированные — справа.

Затем идёт раздел Commands (команды). Тут можно сделать многие вещи, включая добавление файлов в индекс, удаление файлов из индекса, индексирование файлов частями, добавление неотслеживаемых файлов и просмотр дельт (diff) проиндексированных изменений.

## Добавление и удаление файлов из индекса

Если набрать `2` или `u` в приглашении `What now>`, сценарий спросит, какие файлы вы хотите добавить в индекс:

	What now> 2
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Чтобы проиндексировать файлы TODO и index.html, нужно набрать их номера:

	Update>> 1,2
	           staged     unstaged path
	* 1:    unchanged        +0/-1 TODO
	* 2:    unchanged        +1/-1 index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Update>>

Символ `*` рядом с каждым файлом означает, что файл выбран для индексирования. Если вы сейчас ничего не будете вводить, а нажмёте Enter в приглашении `Update>>`, то Git возьмёт всё, что уже выбрано, и добавит в индекс:

	Update>> 
	updated 2 paths

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Как видите, теперь файлы TODO и index.html проиндексированы (staged), а файл simplegit.rb — всё ещё нет. Если в этот момент вы хотите удалить файл TODO из индекса, используйте опцию `3` или `r` (revert):

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 3
	           staged     unstaged path
	  1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> 1
	           staged     unstaged path
	* 1:        +0/-1      nothing TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb
	Revert>> [enter]
	reverted one path

Взглянув на статус снова, вы увидите, что файл TODO удалён из индекса:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:    unchanged        +5/-1 lib/simplegit.rb

Чтобы посмотреть дельту для проиндексированных изменений, используйте команду `6` или `d` (diff). Она покажет вам список проиндексированных файлов, и вы сможете выбрать те, для которых хотите посмотреть дельту. Это почти то же, что указать `git diff --cached` в командной строке:

	*** Commands ***
	  1: status     2: update      3: revert     4: add untracked
	  5: patch      6: diff        7: quit       8: help
	What now> 6
	           staged     unstaged path
	  1:        +1/-1      nothing index.html
	Review diff>> 1
	diff --git a/index.html b/index.html
	index 4d07108..4335f49 100644
	--- a/index.html
	+++ b/index.html
	@@ -16,7 +16,7 @@ Date Finder

	 <p id="out">...</p>

	-<div id="footer">contact : support@github.com</div>
	+<div id="footer">contact : email.support@github.com</div>

	 <script type="text/javascript">

С помощью этих базовых команд вы можете использовать интерактивный режим для `git add`, чтобы немного проще работать со своим индексом.

## Индексирование по частям

Для Git'а также возможно индексировать определённые части файлов, а не всё сразу. Например, если вы сделали несколько изменений в файле simplegit.rb и хотите проиндексировать одно из них, а другое — нет, то сделать такое в Git'е очень легко. В строке приглашения интерактивного режима наберите `5` или `p` (patch). Git спросит, какие файлы вы хотите индексировать частями; затем для каждой части изменений в выбранных файлах один за другим будут показываться куски дельт файла, и вас будут спрашивать, хотите ли вы занести их в индекс:

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index dd5ecc4..57399e0 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -22,7 +22,7 @@ class SimpleGit
	   end

	   def log(treeish = 'master')
	-    command("git log -n 25 #{treeish}")
	+    command("git log -n 30 #{treeish}")
	   end

	   def blame(path)
	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? 

На этой стадии у вас много вариантов действий. Набрав `?`, вы получите список возможных действий:

	Stage this hunk [y,n,a,d,/,j,J,g,e,?]? ?
	y - stage this hunk (добавить этот кусок в индекс)
	n - do not stage this hunk (не добавлять этот кусок в индекс)
	a - stage this and all the remaining hunks in the file (добавить этот и все оставшиеся куски в этом файле в индекс)
	d - do not stage this hunk nor any of the remaining hunks in the file (не добавлять в индекс ни этот, ни последующие куски в этом файле)
	g - select a hunk to go to (выбрать кусок и перейти к нему)
	/ - search for a hunk matching the given regex (поиск куска по регулярному выражению)
	j - leave this hunk undecided, see next undecided hunk (отложить решение для этого куска, перейти к следующему отложенному куску)
	J - leave this hunk undecided, see next hunk (отложить решение для этого куска, перейти к следующему куску)
	k - leave this hunk undecided, see previous undecided hunk (отложить решение для этого куска, перейти к предыдущему отложенному куску)
	K - leave this hunk undecided, see previous hunk (отложить решение для этого куска, перейти к предыдущему куску)
	s - split the current hunk into smaller hunks (разбить текущий кусок на меньшие части)
	e - manually edit the current hunk (отредактировать текущий кусок вручную)
	? - print help (вывести справку)

Как правило, вы будете использовать `y` или `n` для индексирования каждого куска, но индексирование всех кусков сразу в некоторых файлах или откладывание решения на потом также может оказаться полезным. Если вы добавите в индекс одну часть файла, а другую часть — нет, вывод статуса будет выглядеть так:

	What now> 1
	           staged     unstaged path
	  1:    unchanged        +0/-1 TODO
	  2:        +1/-1      nothing index.html
	  3:        +1/-1        +4/-0 lib/simplegit.rb

Статус файла simplegit.rb выглядит любопытно. Он показывает, что часть строк в индексе, а часть — не в индексе. Мы частично проиндексировали этот файл. Теперь вы можете выйти из интерактивного сценария и выполнить `git commit`, чтобы создать коммит из этих частично проиндексированных файлов.

В заключение скажем, что нет необходимости входить в интерактивный режим `git add`, чтобы выполнять индексирование частями — вы можете запустить тот же сценарий, набрав `git add -p` или `git add --patch` в командной строке.
