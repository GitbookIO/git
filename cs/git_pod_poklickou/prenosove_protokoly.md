# Přenosové protokoly

Git přenáší data mezi dvěma repozitáři dvěma základními způsoby: prostřednictvím protokolu HTTP a prostřednictvím takzvaných chytrých protokolů používaných při přenosu `file://`,`ssh://` a `git://`. Tato část se ve stručnosti zaměří na to, jak tyto dva základní protokoly fungují.

## Hloupý protokol

V souvislosti s přenosem dat systému Git prostřednictvím HTTP se často mluví o hloupém protokolu (dumb protocol), protože během přenosu nevyžaduje na straně serveru žádný specifický kód Git. Proces vyzvednutí dat je sledem požadavků GET, kdy klient dokáže předpokládat rozložení repozitáře Git na serveru. Podívejme se na proces `http-fetch` pro knihovnu „simplegit“:

	$ git clone http://github.com/schacon/simplegit-progit.git

První věcí, kterou příkaz udělá, je stažení souboru `info/refs`. Tento soubor se zapisuje příkazem `update-server-info`. To je také důvod, proč ho je nutné zapnout jako zásuvný modul `post-receive`, aby přenos dat prostřednictvím protokolu probíhal správně:

	=> GET info/refs
	ca82a6dff817ec66f44342007202690a93763949     refs/heads/master

Nyní máte k dispozici seznam SHA a referencí na vzdálené repozitáře. Dále budete chtít zjistit, co je referencí HEAD, abyste mohli po dokončení procesu provést checkout.

	=> GET HEAD
	ref: refs/heads/master

Po dokončení procesu tedy budete muset přepnout na větev `master`.
V tomto okamžiku je vše připraveno a můžete zahájit proces procházení. Protože je vaším výchozím bodem objekt revize `ca82a6`, jak jste zjistili v souboru `info/refs`, začnete vyzvednutím tohoto objektu:

	=> GET objects/ca/82a6dff817ec66f44342007202690a93763949
	(179 bytes of binary data)

Tímto postupem získáte jeden objekt. Ten je na serveru ve volném formátu a vy jste ho vyzvedli statickým požadavkem GET HTTP. Objekt můžete rozbalit, extrahovat záhlaví a prohlédnout si obsah revize:

	$ git cat-file -p ca82a6dff817ec66f44342007202690a93763949
	tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	parent 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	author Scott Chacon <schacon@gmail.com> 1205815931 -0700
	committer Scott Chacon <schacon@gmail.com> 1240030591 -0700

	changed the version number

Máte však ještě další dva objekty, které potřebujete načíst: `cfda3b`, což je strom obsahu, na nějž ukazuje revize, kterou jsme právě načetli; druhým objektem je `085bb3`, což je rodič revize:

	=> GET objects/08/5bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	(179 bytes of data)

Tím získáte další objekt revize. Načtěte objekt stromu:

	=> GET objects/cf/da3bf379e4f8dba8717dee55aab78aef7f4daf
	(404 - Not Found)

Uf, zdá se, že objekt stromu není na serveru ve volném formátu, proto byla vygenerována chyba 404. Chyba má hned několik příčin. Objekt by mohl být v jiném repozitáři nebo by mohl být v tomto repozitáři, avšak v balíčkovém souboru. Git nejprve zjistí, zda jsou k dispozici alternativní repozitáře:

	=> GET objects/info/http-alternates
	(empty file)

Je-li výsledkem hledání seznam alternativních adres URL, Git se v těchto repozitářích pokusí najít volné a balíčkové soubory. Jedná se o užitečný mechanismus pro projekty, které byly odštěpeny od jiného projektu a sdílejí jeho objekty. Protože však seznam v tomto případě neobsahuje žádné alternativní repozitáře, váš objekt musí být v balíčkovém souboru. Chcete-li zjistit, jaké balíčkové soubory jsou na serveru dostupné, pomůže vám soubor `objects/info/packs`, který obsahuje jejich seznam (rovněž generován příkazem `update-server-info`):

	=> GET objects/info/packs
	P pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack

Na serveru je pouze jeden balíčkový soubor, takže váš objekt musí být evidentně v něm. Pro jistotu se však ještě podíváte do souboru indexu. To je rovněž užitečné, máte-li na serveru více balíčkových souborů. Zjistíte tak, který z nich obsahuje hledaný objekt:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.idx
	(4k of binary data)

Nyní, když máte index balíčkového souboru, můžete ověřit, zda se v něm nachází váš objekt. Index uvádí hodnoty SHA všech objektů obsažených v balíčkovém souboru a ofsety k těmto objektům. Váš objekt se v tomto souboru nachází, a proto neváhejte a stáhněte celý balíčkový soubor:

	=> GET objects/pack/pack-816a9b2334da9953e530f27bcac22082a9f5b835.pack
	(13k of binary data)

Stáhli jste objekt stromu, a můžete tak pokračovat v procházení revizí. Všechny jsou navíc součástí balíčkového souboru, který jste právě stáhli, a proto nebude nutné zadávat serveru žádné další požadavky. Git provede checkout pracovní kopie větve `master`, na niž ukazovala reference HEAD, kterou jste stáhli na začátku.

Celý výstup tohoto procesu vypadá následovně:

	$ git clone http://github.com/schacon/simplegit-progit.git
	Initialized empty Git repository in /private/tmp/simplegit-progit/.git/
	got ca82a6dff817ec66f44342007202690a93763949
	walk ca82a6dff817ec66f44342007202690a93763949
	got 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Getting alternates list for http://github.com/schacon/simplegit-progit.git
	Getting pack list for http://github.com/schacon/simplegit-progit.git
	Getting index for pack 816a9b2334da9953e530f27bcac22082a9f5b835
	Getting pack 816a9b2334da9953e530f27bcac22082a9f5b835
	 which contains cfda3bf379e4f8dba8717dee55aab78aef7f4daf
	walk 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	walk a11bef06a3f659402fe7563abf99ad00de2209e6

## Chytrý protokol

Metoda přenosu HTTP je jednoduchá, avšak málo výkonná. Rozšířenější metodou přenosu dat je použití chytrého protokolu. Tyto protokoly mají na vzdáleném konci proces, který inteligentně spolupracuje se systémem Git. Umí načítat lokální data a zjistí, co klient vlastní a co potřebuje. Podle toho pro něj vygeneruje potřebná data. Existují dvě sady procesů pro přenos dat: jeden pár pro upload dat a jeden pár pro jejich stahování.

### Upload dat

K uploadu dat do vzdáleného procesu používá Git procesy `send-pack` a `receive-pack`. Proces `send-pack` se spouští na klientovi a připojuje se k procesu `receive-pack` na straně vzdáleného serveru.

Řekněme například, že ve svém projektu spustíte příkaz `git push origin master` a `origin` je definován jako URL používající protokol SSH. Git spustí proces `send-pack`, který iniciuje spojení se serverem přes SSH. Na vzdáleném serveru se pokusí spustit příkaz prostřednictvím volání SSH:

	$ ssh -x git@github.com "git-receive-pack 'schacon/simplegit-progit.git'"
	005bca82a6dff817ec66f4437202690a93763949 refs/heads/master report-status delete-refs
	003e085bb3bcb608e1e84b2432f8ecbe6306e7e7 refs/heads/topic
	0000

Příkaz `git-receive-pack` okamžitě odpoví jedním řádkem pro každou referenci, kterou v danou chvíli obsahuje – v tomto případě je to pouze větev `master` a její SHA. První řádek uvádí rovněž seznam schopností serveru (zde `report-status` a `delete-refs`).

Každý řádek začíná 4bytovou hexadecimální hodnotou, která udává, jak dlouhý je zbytek řádku. Váš první řádek začíná hodnotou 005b, tedy 91 v hexadecimální soustavě, což znamená, že na tomto řádku zbývá 91 bytů. Další řádek začíná hodnotou 003e (tedy 62), což znamená dalších 62 bytů. Následující řádek je 0000 – touto kombinací server označuje konec seznamu referencí.

Nyní, když zná proces `send-pack` stav serveru, určí, jaké revize má, které přitom nejsou na serveru. Pro každou referenci, která bude tímto odesláním aktualizována, sdělí proces `send-pack` tuto informaci procesu `receive-pack`. Pokud například aktualizujete větev `master` a přidáváte větev `experiment`, odpověď procesu `send-pack` může mít následující podobu:

	0085ca82a6dff817ec66f44342007202690a93763949  15027957951b64cf874c3557a0f3547bd83b3ff6 refs/heads/master report-status
	00670000000000000000000000000000000000000000 cdfdb42577e2506715f8cfeacdbabc092bf63e8d refs/heads/experiment
	0000

Hodnota SHA-1 ze samých nul znamená, že na tomto místě předtím nic nebylo, protože přidáváte větev „experiment“. Pokud byste mazali referenci, viděli byste pravý opak: samé nuly na pravé straně.

Git odešle jeden řádek pro každou referenci, kterou aktualizujete. Řádek obsahuje starou hodnotu SHA, novou hodnotu SHA a referenci, která je aktualizována. První řádek navíc obsahuje schopnosti klienta. Jako další krok nahraje klient balíčkový soubor se všemi třemi objekty, které na serveru dosud nejsou. Na závěr procesu server oznámí, zda se akce zdařila, nebo nezdařila:

	000Aunpack ok

### Stahování dat

Do stahování dat se zapojují procesy `fetch-pack` a `upload-pack`. Klient iniciuje proces `fetch-pack`, který vytvoří připojení k procesu `upload-pack` na straně vzdáleného serveru a dojedná, která data budou stažena.

Existují i jiné způsoby, jak iniciovat proces `upload-pack` ve vzdáleném repozitáři. Můžete ho spustit prostřednictvím SSH stejným způsobem jako proces `receive-pack`. Proces můžete iniciovat také prostřednictvím démona Git, který na serveru standardně naslouchá portu 9418. Proces `fetch-pack` pošle démonovi po připojení data, která mají následující podobu:

	003fgit-upload-pack schacon/simplegit-progit.git\0host=myserver.com\0

Informace začínají 4 byty, které uvádějí, jaké množství dat následuje; po nich následuje příkaz, který má být spuštěn, nulový byte, název hostitelského serveru a na závěr další nulový byte. Démon Git zkontroluje, zda je příkaz skutečně možné spustit, zda existuje daný repozitář a zda jsou oprávnění k němu veřejná. Je-li vše v pořádku, spustí démon Git proces `upload-pack` a předá mu svůj požadavek.

Vyzvedáváte-li data přes SSH, spustí místo toho proces `fetch-pack` následující:

	$ ssh -x git@github.com "git-upload-pack 'schacon/simplegit-progit.git'"

V obou případech zašle po připojení procesu `fetch-pack` proces `upload-pack` zpět následující informace:

	0088ca82a6dff817ec66f44342007202690a93763949 HEAD\0multi_ack thin-pack \
	  side-band side-band-64k ofs-delta shallow no-progress include-tag
	003fca82a6dff817ec66f44342007202690a93763949 refs/heads/master
	003e085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 refs/heads/topic
	0000

Informace se nápadně podobají těm, jimiž odpovídá proces `receive-pack`, liší se však schopnosti. Kromě toho pošle proces zpět referenci HEAD, aby klient v případě, že se jedná o klonování, věděl, kam přepnout.

V tomto okamžiku proces `fetch-pack` zjistí, jaké objekty má, a vytvoří odpověď s objekty, které potřebuje. Odpověď má tvar „want“ (chci) a SHA požadovaných objektů. Naopak objekty, které už vlastní, uvádí kombinací výrazu „have“ (mám) a hodnoty SHA. Výpis je ukončen výrazem „done“, který iniciuje odeslání požadovaného balíčkového souboru nebo dat procesem `upload-pack`:

	0054want ca82a6dff817ec66f44342007202690a93763949 ofs-delta
	0032have 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	0000
	0009done

Toto jsou pouze základní případy přenosových protokolů. Ve složitějších případech podporuje klient schopnosti `multi_ack` nebo `side-band`. Uvedený příklad ale dobře ilustruje základní komunikaci tam a zpět, jak ji používají procesy chytrých protokolů.
