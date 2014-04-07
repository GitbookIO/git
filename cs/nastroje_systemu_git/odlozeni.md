# Odložení

Až budete pracovat na některé části svého projektu, často vám může připadat, že je vaše práce poněkud neuspořádaná a vy budete třeba chtít přepnout větve a pracovat na chvíli na něčem jiném. Problém je, že nebudete chtít zapsat revizi nehotové práce, budete se k ní chtít vrátit později. Řešením této situace je odložení (stashing) příkazem `git stash`.

Odložení vezme neuspořádaný stav vašeho pracovního adresáře – tj. změněné sledované soubory a změny připravené k zapsání – a uloží ho do zásobníku nehotových změn, který můžete kdykoli znovu aplikovat.

## Odložení práce

Pro názornost uvažujme situaci, že ve svém projektu začnete pracovat na několika souborech a jednu z provedených změn připravíte k zapsání. Spustíte-li příkaz `git status`, uvidíte neuspořádaný stav svého projektu:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

Nyní chcete přepnout na jinou větev, ale nechcete zapsat změny, na nichž jste dosud pracovali – proto změny odložíte. Chcete-li do zásobníku odeslat nový odklad, spusťte příkaz `git stash`:

	$ git stash
	Saved working directory and index state \
	  "WIP on master: 049d078 added the index file"
	HEAD is now at 049d078 added the index file
	(To restore them type "git stash apply")

Váš pracovní adresář se vyčistil:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Nyní můžete bez obav přepnout větve a pracovat na jiném úkolu, vaše změny byly uloženy do zásobníku. Chcete-li se podívat, které soubory jste odložili, spusťte příkaz `git stash list`:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log

V tomto případě byly už dříve provedeny dva další odklady, a máte tak k dispozici tři různé odklady. Naposledy odložené soubory můžete znovu aplikovat příkazem, který byl uveden už v nápovědě ve výstupu původního příkazu stash: `git stash apply`. Chcete-li aplikovat některý ze starších odkladů, můžete ho určit na základě jeho označení, např. `git stash apply stash@{2}`. Pokud u příkazu neoznačíte konkrétní odklad, Git se automaticky pokusí aplikovat ten nejnovější:

	$ git stash apply
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   index.html
	#      modified:   lib/simplegit.rb
	#

Jak vidíte, Git se pokusí obnovit změněné soubory, které jste nezapsali a uložili při odkladu. V tomto případě jste měli čistý pracovní adresář, když jste se pokusili odklad aplikovat. Pokusili jste se ho aplikovat na stejnou větev, z níž jste ho uložili. K úspěšnému odkladu však není nezbytně nutné, aby byl pracovní adresář čistý ani abyste ho aplikovali na stejnou větev. Odklad můžete uložit na jedné větvi, později přepnout na jinou větev a aplikovat změny tam. Když aplikujete odklad, můžete mít v pracovním adresáři také změněné a nezapsané soubory. Nebude-li něco aplikováno čistě, Git vám oznámí konflikty při slučování.

Změny byly znovu aplikovány na vaše soubory, ale soubor, který jste předtím připravili k zapsání, nebyl znovu připraven. Chcete-li, aby se příkaz pokusil znovu aplikovat i změny připravené k zapsání, musíte zadat příkaz `git stash apply` s parametrem `--index`. Pokud jste spustili příkaz v této podobě, vrátili jste se zpět na svou původní pozici:

	$ git stash apply --index
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#

Parametr apply se pouze pokusí aplikovat odloženou práci, ta zůstává uložena ve vašem zásobníku. Chcete-li ji odstranit, spusťte příkaz `git stash drop` s názvem odkladu, který má být odstraněn:

	$ git stash list
	stash@{0}: WIP on master: 049d078 added the index file
	stash@{1}: WIP on master: c264051... Revert "added file_size"
	stash@{2}: WIP on master: 21d80a5... added number to log
	$ git stash drop stash@{0}
	Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)

Můžete také spustit příkaz `git stash pop`, jímž odklad aplikujete a současně ho odstraníte ze zásobníku.

## Odvolání odkladu

V některých případech můžete chtít aplikovat odložené změny, udělat nějakou práci, a pak odvolat změny, které byly v odkladu původně. Git nenabízí žádný příkaz ve smyslu `stash unapply`, ovšem je možné použít reverzní aplikaci patche reprezentujícího odklad:

    $ git stash show -p stash@{0} | git apply -R

Jestliže nespecifikujete konkrétní odklad, Git předpokládá odklad poslední:

    $ git stash show -p | git apply -R

Můžete si také vytvořit alias a do svého gitu přidat například příkaz `stash-unapply`:

    $ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
    $ git stash
    $ #... work work work
    $ git stash-unapply

## Vytvoření větve z odkladu

Jestliže odložíte část své práce, necháte ji určitou dobu v zásobníku a budete pokračovat ve větvi, z níž jste práci odložili, můžete mít problémy s opětovnou aplikací odkladu. Pokud se příkaz apply pokusí změnit soubor, který jste mezitím ručně změnili jinak, dojde ke konfliktu při slučování, který budete muset vyřešit. Pokud byste uvítali jednodušší způsob, jak znovu otestovat odložené změny, můžete spustit příkaz `git stash branch`, který vytvoří novou větev, stáhne do ní revizi, na níž jste se nacházeli při odložení práce, a aplikuje na ni vaši práci. Proběhne-li aplikace úspěšně, Git odklad odstraní:

	$ git stash branch testchanges
	Switched to a new branch "testchanges"
	# On branch testchanges
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#      modified:   index.html
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#      modified:   lib/simplegit.rb
	#
	Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)

Jedná se o příjemný a jednoduchý způsob, jak obnovit odloženou práci a pokračovat na ní v nové větvi.
