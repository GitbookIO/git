# Reference Git

Chcete-li si prohlédnout celou svou historii, můžete zadat příkaz `git log 1a410e`. Problém je v tom, že si k prohlížení historie a nalezení objektů stále ještě musíte pamatovat, že poslední revizí byla `1a410e`. Hodil by se soubor, do nějž budete pod jednoduchým názvem ukládat hodnotu SHA-1. Tento ukazatel pro vás bude srozumitelnější než nevlídná hodnota SHA-1.

V systému Git se těmto ukazatelům říká reference (angl. „references“ nebo „refs“). Soubory, které obsahují hodnoty SHA-1, najdete v adresáři `.git/refs`. V aktuálním projektu nejsou v tomto adresáři žádné soubory, zatím tu najdete jen jednoduchou strukturu:

	$ find .git/refs
	.git/refs
	.git/refs/heads
	.git/refs/tags
	$ find .git/refs -type f
	$

Chcete-li vytvořit novou referenci, díky níž si budete pamatovat, kde se nachází vaše poslední revize, lze to technicky provést velmi jednoduše:

	$ echo "1a410efbd13591db07496601ebc7a059dd55cfe9" > .git/refs/heads/master

Nyní můžete v příkazech Git používat „head“ referenci, kterou jste právě vytvořili, místo hodnoty SHA-1:

	$ git log --pretty=oneline  master
	1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Tím vás nenabádám, abyste přímo editovali soubory referencí. Git zná bezpečnější metodu, jak referenci aktualizovat: příkaz `update-ref`:

	$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9

A to je také skutečná podstata větví v systému Git. Jedná se o jednoduché ukazatele, neboli reference na „hlavu“ (angl. head) jedné linie práce. Chcete-li vytvořit větev zpětně na druhé revizi, můžete zadat:

	$ git update-ref refs/heads/test cac0ca

Vaše větev bude obsahovat pouze práci od této revize níže:

	$ git log --pretty=oneline test
	cac0cab538b970a37ea1e769cbbde608743bc96d second commit
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit

Vaše databáze Git bude nyní v principu vypadat tak, jak je znázorněno na obrázku 9-4.


![](http://git-scm.com/figures/18333fig0904-tn.png)

Obrázek 9-4. Objekty v adresáři Git s referencemi větve „head“

Spouštíte-li příkaz typu `git branch (název větve)`, Git ve skutečnosti spustí příkaz `update-ref` a vloží hodnotu SHA-1 poslední revize větve, na níž se nacházíte, do nové reference, kterou chcete vytvořit.

## Soubor HEAD

Nyní se však nabízí otázka, jak může Git při spuštění příkazu `git branch (název větve)` znát hodnotu SHA-1 poslední revize. Odpověď zní: soubor HEAD. Soubor HEAD je symbolická reference na větev, na níž se právě nacházíte. Symbolickou referencí myslím to, že na rozdíl od normálních referencí většinou neobsahuje hodnotu SHA-1, ale spíš ukazatel na jinou referenci. Pokud se na soubor podíváte, můžete v něm najít třeba následující:

	$ cat .git/HEAD
	ref: refs/heads/master

Spustíte-li příkaz `git checkout test`, Git aktualizuje soubor do následující podoby:

	$ cat .git/HEAD
	ref: refs/heads/test

Spustíte-li příkaz `git commit`, systém vytvoří objekt revize, jehož rodičem bude hodnota SHA-1, na niž ukazuje reference v souboru HEAD.

Soubor můžete editovat také ručně, ale opět existuje i bezpečnější příkaz: `symbolic-ref`. Hodnotu souboru HEAD můžete načíst tímto příkazem:

	$ git symbolic-ref HEAD
	refs/heads/master

Hodnotu pro soubor HEAD můžete také nastavit:

	$ git symbolic-ref HEAD refs/heads/test
	$ cat .git/HEAD
	ref: refs/heads/test

Nelze však zadat symbolickou referenci mimo adresář refs:

	$ git symbolic-ref HEAD test
	fatal: Refusing to point HEAD outside of refs/

## Značky

Už jsme se seznámili se třemi základními typy objektů. Jenže existuje ještě čtvrtý. Objekt značky se v mnohém podobá objektu revize – obsahuje autora značky, datum, zprávu a ukazatel. Hlavním rozdílem je, že objekt značky ukazuje na revizi, zatímco objekt revize na strom. Podobá se také referenci větve, jen se nikdy nepřesouvá. Stále ukazuje na stejnou revizi, jen jí dává hezčí jméno.

Jak jsme zmínili už v kapitole 2, existují dva typy značek: anotované a prosté. Prostou značku lze vytvořit spuštěním například tohoto příkazu:

	$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d

To je celá prostá značka – větev, která se nikdy nepřemisťuje. Anotovaná značka je už složitější. Vytvoříte-li anotovanou značku, Git vytvoří objekt značky a zapíše referenci, která na objekt ukazuje (neukazuje tedy na samotnou revizi). To je dobře vidět, vytvoříte-li anotovanou značku (`-a` udává, že se jedná o anotovanou značku):

	$ git tag -a v1.1 1a410efbd13591db07496601ebc7a059dd55cfe9 -m 'test tag'

Pro objekt byla vytvořena tato hodnota SHA-1:

	$ cat .git/refs/tags/v1.1
	9585191f37f7b0fb9444f35a9bf50de191beadc2

Nyní pro tuto hodnotu SHA-1 spusťte příkaz `cat-file`:

	$ git cat-file -p 9585191f37f7b0fb9444f35a9bf50de191beadc2
	object 1a410efbd13591db07496601ebc7a059dd55cfe9
	type commit
	tag v1.1
	tagger Scott Chacon <schacon@gmail.com> Sat May 23 16:48:58 2009 -0700

	test tag

Všimněte si, že záznam objektu ukazuje na hodnotu revize SHA-1, k níž jste značku přidali. Měli byste také vědět, že nemusí ukazovat na revizi. Značkou můžete označit jakýkoli objekt Git. Ve zdrojovém kódu systému Git správce například vložil svůj veřejný klíč GPG jako objekt blobu a ten označil značkou. Veřejný klíč můžete zobrazit příkazem

	$ git cat-file blob junio-gpg-pub

spuštěným ve zdrojovém kódu Git. Také jádro Linuxu obsahuje objekt značky, který neukazuje na revizi. První vytvořená značka ukazuje na první strom importu zdrojového kódu.

## Reference na vzdálené repozitáře

Třetím typem reference, s níž se setkáte, je reference na vzdálený repozitář. Přidáte-li vzdálený repozitář a odešlete do něj revize, Git v adresáři `refs/remotes` uloží pro každou větev hodnotu, kterou jste do tohoto repozitáře naposled odesílali. Můžete například přidat vzdálený repozitář `origin` a odeslat do něj větev `master`:

	$ git remote add origin git@github.com:schacon/simplegit-progit.git
	$ git push origin master
	Counting objects: 11, done.
	Compressing objects: 100% (5/5), done.
	Writing objects: 100% (7/7), 716 bytes, done.
	Total 7 (delta 2), reused 4 (delta 1)
	To git@github.com:schacon/simplegit-progit.git
	   a11bef0..ca82a6d  master -> master

Poté se můžete podívat, jakou podobu měla větev `master` na vzdáleném serveru `origin`, když jste s ním naposledy komunikovali. Pomůže vám s tím soubor `refs/remotes/origin/master`:

	$ cat .git/refs/remotes/origin/master
	ca82a6dff817ec66f44342007202690a93763949

Reference na vzdálené repozitáře se od větví (reference `refs/heads`) liší zejména tím, že nelze provést jejich checkout. Git je přemisťuje jako záložky poslední známé pozice těchto větví na serveru.
