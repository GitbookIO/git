# Étiquetage

À l'instar de la plupart des VCS, Git donne la possibilité d'étiqueter un certain état dans l'historique comme important.
Généralement, les gens utilisent cette fonctionnalité pour marquer les états de publication (`v1.0` et ainsi de suite).
Dans cette section, nous apprendrons comment lister les différentes étiquettes (*tag* en anglais), comment créer de nouvelles étiquettes et les différents types d'étiquettes.

## Lister vos étiquettes

Lister les étiquettes existantes dans Git est très simple.
Tapez juste `git tag` :

	$ git tag
	v0.1
	v1.3

Cette commande liste les étiquettes dans l'ordre alphabétique.
L'ordre dans lequel elles apparaissent n'a aucun rapport avec l'historique.

Vous pouvez aussi rechercher les étiquettes correspondant à un motif particulier.
Par exemple, le dépôt des sources de Git contient plus de 240 étiquettes.
Si vous souhaitez ne visualiser que les séries 1.4.2, vous pouvez lancer ceci :

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Créer des étiquettes

Git utilise deux types principaux d'étiquettes : légères et annotées.
Une étiquette légère ressemble beaucoup à une branche qui ne change pas, c'est juste un pointeur sur un *commit* spécifique.
Les étiquettes annotées, par contre sont stockées en tant qu'objets à part entière dans la base de données de Git.
Elles ont une somme de contrôle, contiennent le nom et l'adresse e-mail du créateur, la date, un message d'étiquetage et peuvent être signées et vérifiées avec GNU Privacy Guard (GPG).
Il est généralement recommandé de créer des étiquettes annotées pour générer toute cette information mais si l'étiquette doit rester temporaire ou l'information supplémentaire n'est pas désirée, les étiquettes légères peuvent suffire.

## Les étiquettes annotées

Créer des étiquettes annotées est simple avec Git.
Le plus simple est de spécifier l'option `-a` à la commande `tag` :

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

L'option `-m` permet de spécifier le message d'étiquetage qui sera stocké avec l'étiquette.
Si vous ne spécifiez pas de message en ligne pour une étiquette annotée, Git lance votre éditeur pour pouvoir le saisir.

Vous pouvez visualiser les données de l'étiquette à côté du *commit* qui a été marqué en utilisant la commande `git show` :

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

Cette commande affiche le nom du créateur, la date de création de l'étiquette et le message d'annotation avant de montrer effectivement l'information de validation.

## Les étiquettes signées

Vous pouvez aussi signer vos étiquettes avec GPG, à condition d'avoir une clé privée.
Il suffit de spécifier l'option `-s` au lieu de `-a` :

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

En lançant `git show` sur cette étiquette, on peut visualiser la signature GPG attachée :

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

Plus loin, nous verrons comment vérifier une étiquette signée.

## Les étiquettes légères

Une autre manière d'étiqueter les *commits* est d'utiliser les étiquettes légères.
Celles-ci se réduisent à stocker la somme de contrôle d'un *commit* dans un fichier, aucune autre information n'est conservée.
Pour créer une étiquette légère, il suffit de n'utiliser aucune des option `-a`, `-s` ou `-m` :

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Cette fois-ci, en lançant `git show` sur l'étiquette, on ne voit plus aucune information complémentaire.
La commande ne montre que l'information de validation :

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Vérifier des étiquettes

Pour vérifier une étiquette signée, il faut utiliser `git tag -v [nom-d'étiquette]`.
Cette commande utilise GPG pour vérifier la signature.
La clé publique du signataire doit être présente dans votre trousseau :

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

Si la clé publique du signataire n'est pas présente dans le trousseau, la commande donne le résultat suivant :

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Étiqueter après coup

Vous pouvez aussi étiqueter des *commits* plus anciens.
Supposons que l'historique des *commits* ressemble à ceci :

	$ git log --pretty=oneline
	15027957951b64cf874c3557a0f3547bd83b3ff6 Fusion branche 'experimental'
	a6b4c97498bd301d84096da251c98a07c7723e65 Début de l'écriture support
	0d52aaab4479697da7686c15f77a3d64d9165190 Un truc de plus
	6d52a271eda8725415634dd79daabbc4d9b6008e Fusion branche 'experimental'
	0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc ajout d'une fonction de validatn
	4682c3261057305bdd616e23b64b0857d832627b ajout fichier afaire
	166ae0c4d3f420721acbb115cc33848dfcc2121a début de l'ecriture support
	9fceb02d0ae598e95dc970b74767f19372d61af8 mise à jour rakefile
	964f16d36dfccde844893cac5b347e7b3d44abbc validation afaire
	8a5cbc430f1a9c3d00faaeffd07798508422908a mise à jour lisezmoi

Maintenant, supposons que vous avez oublié d'étiqueter le projet à la version `v1.2` qui correspondait au *commit* « mise à jour rakefile ».
Vous pouvez toujours le faire après l'évènement.
Pour étiqueter ce *commit*, vous spécifiez la somme de contrôle du *commit* (ou une partie) en fin de commande :

	$ git tag -a v1.2 -m 'version 1.2' 9fceb02

Le *commit* a été étiqueté :

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

	    mise à jour rakefile
	...

## Partager les étiquettes

Par défaut, la commande `git push` ne transfère pas les étiquettes vers les serveurs distants.
Il faut explicitement pousser les étiquettes après les avoir créées localement.
Ce processus s'apparente à pousser des branches distantes — vous pouvez lancer `git push origin [nom-du-tag]`.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Si vous avez de nombreuses étiquettes que vous souhaitez pousser en une fois, vous pouvez aussi utiliser l'option `--tags` avec la commande `git push`.
Ceci transférera toutes les nouvelles étiquettes vers le serveur distant.

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

À présent, lorsqu'une autre personne clone ou tire depuis votre dépôt, elle obtient aussi les étiquettes.
