# Značky

Stejně jako většina systémů VCS nabízí i Git možnost označovat v historii určitá místa, jež považujete za důležitá. Tato funkce se nejčastěji používá k označení jednotlivých vydání (např. `v1.0`). V této části vysvětlíme, jak pořídíte výpis všech dostupných značek, jak lze vytvářet značky nové a jaké typy značek se vám nabízejí.

## Výpis značek

Pořízení výpisu dostupných značek (tags) je v systému Git jednoduché. Stačí zadat příkaz `git tag`:

	$ git tag
	v0.1
	v1.3

Tento příkaz vypíše značky v abecedním pořadí. Pořadí, v němž se značky vyskytují, není relevantní.

Značky lze vyhledávat také pomocí konkrétní masky. Například zdrojový kód Git „repo“ obsahuje více než 240 značek. Pokud vás však zajímá pouze verze 1.4.2., můžete zadat:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Vytváření značek

Git používá dva hlavní druhy značek: prosté (lightweight) a anotované (annotated). Prostá značka se velmi podobá větvi, která se nemění – je to pouze ukazatel na konkrétní revizi. Naproti tomu anotované značky jsou ukládány jako plné objekty v databázi Git. U anotovaných značek se provádí kontrolní součet. Obsahují jméno autora značky (tagger), e-mail a datum, nesou vlastní zprávu (tagging message) a mohou být podepsány (signed) a ověřeny (verified) v programu GNU Privacy Guard (GPG). Obecně se doporučuje používat v zájmu úplnosti informací spíše anotované značky. Pokud však vytváříte pouze dočasnou značku nebo z nějakého důvodu nechcete zadávat podrobnější informace, můžete využívat i prosté značky.

## Anotované značky

Vytvoření anotované značky v systému Git je jednoduché. Nejjednodušším způsobem je zadat k příkazu `tag` parametr `-a`:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

Parametr `-m` udává zprávu značky, která bude uložena spolu se značkou. Pokud u anotované značky nezadáte žádnou zprávu, Git spustí textový editor, v němž zprávu zadáte.

Informace značky se zobrazí spolu s revizí, kterou značka označuje, po zadání příkazu `git show`:

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

Příkaz zobrazí ještě před informacemi o revizi informace o autorovi značky, datu, kdy byla revize označena, a zprávu značky.

## Podepsané značky

Máte-li soukromý klíč, lze značky rovněž podepsat v programu GPG. Jediné, co pro to musíte udělat, je zadat místo parametru `-a` parametr `-s`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Pokud pro tuto značku spustíte příkaz `git show`, uvidíte k ní připojen svůj podpis GPG:

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

V dalších částech se naučíte, jak podepsané značky ověřovat.

## Prosté značky

Další možností, jak označit revizi, je prostá značka. Prostá značka je v podstatě kontrolní součet revize uložený v souboru, žádné další informace neobsahuje. Chcete-li vytvořit prostou značku, nezadávejte ani jeden z parametrů `-a`, `-s` nebo `-m`:

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Pokud spustíte pro značku příkaz `git show` tentokrát, nezobrazí se k ní žádné další informace. Příkaz zobrazí pouze samotnou revizi:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Ověřování značek

Chcete-li ověřit podepsanou značku, použijte příkaz `git tag -v [název značky]`. Tento příkaz využívá k ověření podpisu program GPG. Aby příkaz správně fungoval, musíte mít ve své klíčence veřejný klíč podepisujícího (signer).

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

Pokud veřejný klíč podepisujícího nemáte, výstup bude vypadat následovně:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Dodatečné označení

Revizi lze označit značkou i poté, co jste ji už opustili. Předpokládejme, že vaše historie revizí vypadá takto:

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

Nyní předpokládejme, že jste projektu zapomněli přidělit značku `v1.2`, která byla obsažena v revizi označené jako „updated rakefile“. Značku můžete přidat dodatečně. Pro označení revize značkou zadejte na konec příkazu kontrolní součet revize (nebo jeho část):

	$ git tag -a v1.2 -m 'version 1.2' 9fceb02

Můžete se podívat, že jste revizi označil:

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

## Sdílení značek

Příkaz `git push` nepřenáší značky na vzdálené servery automaticky. Pokud jste vytvořili značku, budete ji muset na sdílený server poslat ručně. Tento proces je stejný jako sdílení vzdálených větví. Spusťte příkaz `git push origin [název značky]`.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Máte-li značek více a chcete je odeslat všechny najednou, můžete použít také parametr `--tags`, který se přidává k příkazu `git push`. Tento příkaz přenese na vzdálený server všechny vaše značky, které tam ještě nejsou.

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

Pokud nyní někdo bude klonovat nebo stahovat z vašeho repozitáře, stáhne rovněž všechny vaše značky.
