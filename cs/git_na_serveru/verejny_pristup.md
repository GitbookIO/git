# Veřejný přístup

A co když chcete u svého projektu nastavit anonymní oprávnění pro čtení? Nehostujete třeba interní soukromý projekt, ale „open source“ projekt. Nebo možná máte několik serverů průběžné integrace, které se neustále mění a vy nechcete stále generovat SSH klíče, rádi byste vždy přidali jen obyčejné anonymní oprávnění pro čtení.

Patrně nejjednodušším způsobem pro menší týmy je spustit statický webový server s kořenovým adresářem dokumentů, v němž budou uloženy vaše Git repozitáře, a zapnout zásuvný modul `post-update`, o kterém jsme se zmínili už v první části této kapitoly. Můžeme pokračovat v našem předchozím příkladu. Řekněme, že máte repozitáře uloženy v adresáři `/opt/git` a na vašem počítači je spuštěn server Apache. Opět, můžete použít jakýkoli webový server. Pro názornost ale ukážeme některá základní nastavení serveru Apache, abyste získali představu, co vás může čekat.

Nejprve ze všeho budete muset zapnout zásuvný modul:

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

Jestliže používáte verzi systému Git starší než 1.6, nebude příkaz `mv` nutný. Git začal pojmenovávat příklady zásuvných modulů příponou „.sample“ teprve nedávno.

Jaká je funkce zásuvného modulu `post-update`? V principu vypadá asi takto:

	$ cat .git/hooks/post-update
	#!/bin/sh
	exec git-update-server-info

Znamená to, že až budete odesílat data na server prostřednictvím SSH, Git spustí tento příkaz a aktualizuje soubory vyžadované pro přístup přes HTTP.

Dále je třeba přidat záznam VirtualHost do konfigurace Apache s kořenovým adresářem dokumentů nastaveným jako kořenový adresář vašich projektů Git. Tady předpokládáme, že máte nastaveny zástupné znaky DNS (wildcard DNS) a můžete odeslat `*.gitserver` do kteréhokoli boxu, který používáte, a spustit následující:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

Budete také muset nastavit uživatelskou skupinu adresáře `/opt/git` na `www-data`. Váš webový server tak získá přístup pro čtení k repozitářům, protože instance Apache, která spouští CGI skript, bude (standardně) spuštěna s tímto uživatelem:

	$ chgrp -R www-data /opt/git

Po restartování serveru Apache byste měli být schopni naklonovat své repozitáře v tomto adresáři. Zadejte adresu URL svého projektu:

	$ git clone http://git.gitserver/project.git

Tímto způsobem můžete během pár minut nastavit oprávnění pro čtení založené na protokolu HTTP pro větší počet uživatelů k jakémukoli svému projektu. Další jednoduchou možností nastavení veřejného neověřovaného přístupu je spustit démona Git. Pokud je pro vás tato cesta schůdnější, budeme se jí věnovat v následující části.
