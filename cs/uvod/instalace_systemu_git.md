# Instalace systému Git

Je načase začít systém Git aktivně používat. Instalaci můžete provést celou řadou způsobů — obvyklá je instalace ze zdrojových souborů nebo instalace existujícího balíčku, určeného pro vaši platformu.

## Instalace ze zdrojových souborů

Pokud je to možné, je nejvhodnější instalovat Git ze zdrojových souborů. Tak je zaručeno, že vždy získáte aktuální verzi. Každá další verze systému se snaží přidat nová vylepšení uživatelského rozhraní. Použití poslední verze je tedy zpravidla tou nejlepší cestou, samozřejmě pokud vám nedělá problémy kompilace softwaru ze zdrojových souborů.

Před instalcí samotného Gitu musí váš systém obsahovat následující knihovny, na nichž je Git závislý: curl, zlib, openssl, expat, a libiconv. Pokud používáte yum (např. Fedora) nebo apt-get (např. distribuce založené na Debianu), můžete k instalaci použít jeden z následujících příkazů:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev libssl-dev

Po doinstalování všech potřebných závislostí můžete pokračovat stažením nejnovější verze z webových stránek systému Git:

	http://git-scm.com/download

Poté přistupte ke kompilaci a instalaci:

	$ tar -zxf git-1.7.2.2.tar.gz
	$ cd git-1.7.2.2
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Po dokončení instalace můžete rovněž vyhledat aktualizace systému Git prostřednictvím systému samotného:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Instalace v Linuxu

Chcete-li nainstalovat Git v Linuxu pomocí binárního instalátoru, většinou tak můžete učinit pomocí základního nástroje pro správu balíčků, který byl součástí vaší distribuce. Ve Fedoře můžete použít nástroj yum:

	$ yum install git-core

V distribuci založené na Debianu (např. Ubuntu) zkuste použít program apt-get:

	$ apt-get install git

## Instalace v systému Mac

Existují dva jednoduché způsoby, jak nainstalovat Git v systému Mac. Tím nejjednodušším je použít grafický instalátor Git, který si můžete stáhnout ze stránky Google Code (viz obrázek 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Obrázek 1-7. Instalátor Git pro OS X

Jiným obvyklým způsobem je instalace systému Git prostřednictvím systému MacPorts (`http://www.macports.org`). Máte-li systém MacPorts nainstalován, nainstalujte Git příkazem:

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Není nutné přidávat všechny doplňky, ale pokud budete někdy používat Git s repozitáři systému Subversion, budete pravděpodobně chtít nainstalovat i doplněk +svn (viz kapitola 8).

## Instalace v systému Windows

Instalace systému Git v OS Windows je velice nenáročná. Postup instalace projektu msysGit patří k těm nejjednodušším. Ze stránky GitHub stáhněte instalační soubor exe a spusťte ho:

	http://msysgit.github.com/

Po dokončení instalace budete mít k dispozici jak verzi pro příkazový řádek (včetně SSH klienta, který se vám bude hodit později), tak standardní grafické uživatelské rozhraní.

Poznámka k používání pod Windows: Git byste měli používat z dodaného shellu msysGit (unixový styl). Umožní vám zadávat složité řádkové příkazy, které v této knize naleznete. Pokud z nějakého důvodu potřebujete používat původní windowsovský shell / konzoli příkazové řádky, budete muset používat místo apostrofů uvozovky (pro parametry s mezerami uvnitř), a parametry končící stříškou (^) budete muset uzavírat do uvozovek v případě, kdy se stříška nachází na konci řádku. Ve Windows se totiž používá jako pokračovací znak.
