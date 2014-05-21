# Rušení změn

Kdykoli si můžete přát zrušit nějakou provedenou změnu. Podívejme se proto, jaké základní nástroje se nám tu nabízejí. Ale buďte opatrní! Ne všechny zrušené změny se dají vrátit. Je to jedna z mála oblastí v systému Git, kdy při neuváženém postupu riskujete, že přijdete o část své práce.

## Změna poslední revize

Jedním z nejčastějších rušení úprav je situace, kdy zapíšete revizi příliš brzy a ještě jste např. zapomněli přidat některé soubory nebo byste rádi změnili zprávu k revizi. Chcete-li opravit poslední revizi, můžete spustit příkaz commit s parametrem `--amend`:

	$ git commit --amend

Tento příkaz vezme vaši oblast připravených změn a použije ji k vytvoření revize. Pokud jste od poslední revize neprovedli žádné změny (například spustíte tento příkaz bezprostředně po předchozí revizi), bude snímek vypadat úplně stejně a jediné, co změníte, je zpráva k revizi.

Spustí se stejný editor pro editaci zpráv k revizím, ale tentokrát už obsahuje zprávu z vaší předchozí revize. Zprávu můžete editovat stejným způsobem jako vždy. Zpráva přepíše předchozí revizi.

Pokud například zapíšete revizi a potom si uvědomíte, že jste zapomněli připravit k zapsání změny v souboru, který jste chtěli do této revize přidat, můžete provést následující:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend

Tyto tři příkazy vytvoří jedinou revizi – třetí příkaz nahradí výsledky prvního.

## Návrat souboru z oblasti připravených změn

Následující dvě části popisují, jak vrátit změny provedené v oblasti připravených změn a v pracovním adresáři. Je příjemné, že příkaz, jímž se zjišťuje stav těchto dvou oblastí, zároveň připomíná, jak v nich zrušit nežádoucí změny. Řekněme například, že jste změnili dva soubory a chcete je zapsat jako dvě oddělené změny, jenže omylem jste zadali příkaz `git add *` a oba soubory jste tím připravili k zapsání. Jak lze tyto dva soubory vrátit z oblasti připravených změn? Připomene vám to příkaz `git status`:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

Přímo pod nadpisem „Changes to be committed“ (Změny k zapsání) se říká: pro návrat z oblasti připravených změn použijte příkaz `git reset HEAD <soubor>...` Budeme se tedy řídit touto radou a vrátíme soubor `benchmarks.rb` z oblasti připravených změn:

	$ git reset HEAD benchmarks.rb
	benchmarks.rb: locally modified
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Příkaz je sice trochu zvláštní, ale funguje. Soubor `benchmarks.rb` má stav „změněn“, ale už se nenachází v oblasti připravených změn.

## Rušení změn ve změněných souborech

A co když zjistíte, že nechcete zachovat změny, které jste provedli v souboru `benchmarks.rb`? Jak je můžete snadno zrušit a vrátit soubor zpět do podoby při poslední revizi (nebo při prvním klonování nebo v jakémkoli okamžiku, kdy jste ho zaznamenali v pracovním adresáři)? Příkaz `git status` vám naštěstí řekne, co dělat. U posledního příkladu vypadá oblast připravených změn takto:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Výpis vám sděluje, jak zahodit změny (discard changes), které jste provedli (přinejmenším tak činí novější verze systému Git, od verze 1.6.1; pokud máte starší verzi, doporučujeme ji aktualizovat, čímž získáte některé z těchto vylepšených funkcí). Uděláme, co nám výpis radí:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Jak vidíte, změny byly zahozeny. Všimněte si také, že se jedná o nebezpečný příkaz. Veškeré změny, které jste v souboru provedli, jsou ztraceny, soubor jste právě překopírovali jiným souborem. Nikdy tento příkaz nepoužívejte, pokud si nejste zcela jisti, že už daný soubor nebudete potřebovat. Pokud potřebujete pouze odstranit soubor z cesty, podívejte se na odkládání a větvení v následující kapitole. Tyto postupy většinou bývají vhodnější.

Vše, co je zapsáno v systému Git, lze téměř vždy obnovit. Obnovit lze dokonce i revize na odstraněných větvích nebo revize, které byly přepsány revizí `--amend` (o obnovování dat viz kapitola 9). Pokud však dojde ke ztrátě dat, která dosud nebyla součástí žádné revize, bude tato ztráta patrně nevratná.
