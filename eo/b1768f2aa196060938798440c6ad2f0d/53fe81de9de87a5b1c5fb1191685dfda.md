# Ekhavi Git-deponejon

Estas du precipaj manieroj ekhavi Git-projekton. La unua prenas ekzistantan projekton kaj importas ĝin al Git. La dua klonas ekzistantan Git-deponejon de alia servilo.

## Komenci deponejon en ekzistanta dosierujo

Se vi komencas sekvi ŝanĝojn de ekzistanta projekto pere de Git, vi devas iri alla dosierujo de la projekto kaj tajpi

	$ git init

Tio kreas novan subdosierujon kun la nomo `.git` kiu enhavas ĉiujn esencajn deponejajn dosierojn — tio estas la skeleto de la Git-deponejo. Ĉi-momente, nenio en via projekto ankoraŭ estas sekvata. (Rigardu en *Ĉapitro 9* por pli da informoj pri la ekzakta enhavo de la `.git`-dosierujo kiun vi ĵus kreis.)

Se vi volas komenci versikontrolon de ekzistantaj dosieroj (kontraŭe al malplena dosierujo), vi devus verŝajne komenci sekvi tiujn dosierojn kaj fari unuan enmeton. Vi povas fari tion kun kelkaj `git add` kiuj specifigas la dosierojn kiujn vi volas sekvi, kaj post tio `git commit` por enmeti:

	$ git add *.c
	$ git add README
	$ git commit -m 'unua versio de la projekto'

Baldaŭ ni klarigu kion ĉi tiuj komandoj faras. En ĉi tiu momento vi havas Git-deponejon kun sekvataj dosieroj kaj unuan enmeton.

## Kloni ekzistantan deponejon

Se vi volas havigi al vi kopion de ekzistanta Git-deponejo — ekzemple de projekto al kiu vi volas kontribui — vi bezonos la komandon `git clone`. Se vi konas aliajn VCS-sistemojn, vi rimarkas ke la komando estas `clone` kaj ne `checkout`. Tio estas grava distingo — Git ricevas kopion de preskaŭ ĉiuj datumoj de la servilo. Ĉiu versio de ĉiu dosiero en la projekto estas elŝutata kiam vi uzas `git clone`. Verdire, se la disko de via servilo rompiĝas, vi povas uzi ajnan klonon en ajna kliento por remeti la servilon en la stato de kiam ĝi estis klonita (vi povas perdi kelkajn servilflankajn hokojn ktp, sed ĉiuj datumaj versioj estus tie — rigardu en *Ĉapitro 4* por pli da detaloj).

Oni klonas deponejon per `git clone [url]`. Ekzemple, se vi volas kloni la Git-bibliotekon por Ruby nomata Grit, vi povas fari tiel:

	$ git clone git://github.com/schacon/grit.git

Tio kreas dosierujon nomata `grit`, komencas dosierujon `.git` ene de ĝi, elŝutas ĉiujn datumojn de tiu deponejo kaj elprenas laborkopion de la lasta versio. Se vi eniras la novan dosierujon `grit`, vi vidos la projektdosierojn tie, pretaj por esti prilaborataj aŭ uzataj. Se vi volas kloni la deponejon en dosierujon kun alia nomo ol grit, vi povas specifigi tion kiel la sekvan komandlinian opcion:

	$ git clone git://github.com/schacon/grit.git mygrit

Tiu komando faras la samon kiel la antaŭa, sed la celdosierujo estas nomata `mygrit`.

Git havas iom da diversaj transigaj normoj kiujn vi povas uzi. La antaŭa ekzemplo uzas la normon `git://`, sed vi ankaŭ povas uzi `http(s)://` aŭ `user@server:/path.git`, kio uzas la transigan normon SSH. *Ĉapitro 4* enkondukos ĉiujn haveblajn opciojn kiujn la servilo povas konfiguri por aliri vian Git-deponejon, kaj ties avantaĝojn kaj malavantaĝojn.
