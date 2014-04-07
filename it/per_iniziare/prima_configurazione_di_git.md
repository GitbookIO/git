# Prima Configurazione di Git

Ora che hai Git sul tuo sistema vorrai fare un paio di cose per personalizzare l'ambiente di Git. Devi farle solo una volta: rimarrano invariate anche dopo un aggiornamento. Puoi comunque cambiarle in ogni momento, rieseguendo i comandi.

Git viene con uno strumento che si chiama 'git config' che ti permetterà d'impostare e conoscere le variabili di configurazione che controllano ogni aspetto di come appare Git e come opera. Queste variabili possono essere salvate in tre posti differenti:

*	`/etc/gitconfig`: Contiene i valori per ogni utente sul sistema e per tutti i loro repository. Se passi l'opzione` --system` a `git config`, lui legge e scrive da questo file specifico. 
*	`~/.gitconfig`: Specifico per il tuo utente. Puoi far leggere e scrivere a Git questo file passando l'opzione `--global`. 
*	file di configurazione nella directory git (cioè `.git/config`) di qualsiasi repository che si stia usando. È Specifico di quel singolo repository. Ogni livello sovrascrive i valori del precedente, così che i valori in `.git/config` vincono su quelli in `/etc/gitconfig`.

Su Windows Git cerca il file `.gitconfig` nella directory `$HOME` (`%USERPROFILE%` in Windows), che per la maggior parte delle persone è `C:\Documents and Settings\$USER` o `C:\Users\$USER`, dipendendo dalla versione (`$USER` è `%USERNAME%` in Windows). Controlla comunque anche /etc/gitconfig, sebbene sia relativo alla root di MSys, che è dove hai deciso di installare Git in Windows quando si lancia l'installazione.

## La tua Identità

La prima cosa che occorrerebbe fare quando installi Git è impostare il tuo nome utente e il tuo indirizzo e-mail. Questo è importante perché ogni commit di Git usa queste informazioni che vengono incapsulate nelle tue commit:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Con l'opzione `--global` dovrai farlo solo una volta, dopo di che Git userà sempre queste informazioni per qualsiasi operazione fatta sul sistema. Se vuoi sovrascriverle con un nome o una e-mail diversi per progetti specifici potrai eseguire il comando senza l'opzione `--global`stando in uno di quei progetti.

## Il tuo Editor

Ora che hai configurato la tua identità, puoi configurare il tuo editor di testo predefinito, che verrà usato quando Git avrà bisogno che scriva un messaggio. Per impostazione predefinita Git usa l'editor di testo predefinito del sistema, che generalmente è Vi o Vim. Se vuoi usarne uno diverso, come Emacs, potrai eseguire:

	$ git config --global core.editor emacs
	
## Il tuo Diff

Un'altra opzione utile che potresti voler configurare, è lo strumento diff predefinito, da usare per risolvere i conflitti di _merge_ (unione, ndt). Per usare vimdiff, potrai eseguire:

	$ git config --global merge.tool vimdiff

Git accetta kdeff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge e opendiff, come strumenti di merge validi. Puoi anche definire uno personalizzato: vedi il Capitolo 7 per maggiori informazioni su come farlo.

## Controlla le tue impostazioni

Per controllare le tue impostazioni puoi usare il comando `git config --list` che elenca tutte le impostazioni attuali di Git:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Potresti vedere più volte la stessa chiave perché Git legge la stessa chiave da file differenti (`/etc/gitconfig` e `~/.gitconfig`, per esempio). In questo caso, Git usa l'ultimo valore per ogni chiave unica che trova.

Puoi anche controllare quale sia il valore di una chiave specifica digitando `git config {key}`:

	$ git config user.name
	Scott Chacon
