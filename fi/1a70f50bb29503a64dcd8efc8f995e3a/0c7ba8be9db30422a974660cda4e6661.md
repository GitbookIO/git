# Ensikerran Git-asetukset

Nyt, kun sinulla on Git järjestelmässäsi, haluat tehdä muutamia asioita räätälöidäksesi Git-ympäristöäsi. Sinun tulisi tehdä nämä asiat vain kerran; ne säilyvät Gitin päivitysten välissä. Voit myös muuttaa niitä minä tahansa hetkenä ajamalla komennot läpi uudestaan.

Gitin mukanaan tulee työkalu, jota kutsutaan git configiksi. Tämä työkalu antaa sinun hakea ja asettaa kokoonpanomuuttujia, jotka kontrolloivat kaikkia aspekteja siitä, miltä Git näyttää ja miten se operoi. Nämä muuttujat voidaan varastoida kolmeen erilliseen paikkaan:

*	`/etc/gitconfig`-tiedosto: Sisältää arvot jokaiselle käyttäjälle järjestelmässä ja kaikkien heidän tietolähteensä. Jos annat option ` --system` `git config`ille, se lukee ja kirjoittaa erityisesti tähän tiedostoon.
* `~/.gitconfig`-tiedosto: Tämä on erityisesti käyttäjällesi. Voit pakottaa Gitin lukemaan ja kirjoittamaan erityisesti tähän tiedostoon antamalla option `--global`.
* config-tiedosto on Git-hakemistossa (tämä on, `.git/config`) missä tahansa tietolähteistä, jota juuri nyt käytät: Tämä on erityisesti kyseessä olevalle tietolähteelle. Jokainen taso ylikirjoittaa arvoja aikaisemmilta tasoilta, joten arvot `.git/config`issa päihittävät arvot `/etc/gitconfig`issa.

Windows-järjestelmissä Git etsii `.gitconfig`-tiedostoa `$HOME`-hakemistosta (`%USERPROFILE%` Windowsin ympäristössä), joka on `C:\Documents and Settings\$USER` tai `C:\Users\$USER` suurimmalle osalle ihmisistä , riippuen versiosta (`$USER` on `%USERNAME%` Windowsin ympäristössä). Se myös etsii yhä '/etc/gitconfig'ia, vaikkakin se on suhteellinen MSys-juureen, joka on missä tahansa minne päätät asentaa Gitin sinun Windows-järjestelmässäsi, kun suoritat asennusohjelman.

## Identiteettisi

Ensimmäinen asia, joka sinun tulisi tehdä Gitiä asentaessasi, on asettaa käyttäjänimesi ja sähköpostiosoitteesi. Tämä on tärkeää, koska jokainen pysyvä muutos, jonka Gitillä teet, käyttää tätä informaatiota, ja se on muuttumattomasti leivottu pysyviin muutoksiisi, joita liikuttelet ympäriinsä:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Tälläkin kerralla, sinun täytyy tehdä tämä ainoastaan kerran, jos annat `--global`-option, koska silloin Git käyttää aina tätä informaatiota mitä tahansa teetkään järjestelmässäsi. Jos haluat ylikirjoittaa tämän toisella nimellä tai sähköpostiosoitteella tietyille projekteille, voit aina ajaa komennon ilman `--global` optiota, kun olet projektissasi.

## Editorisi

Nyt, kun identiteettisi on asetettu, voit konfiguroida oletustekstieditorisi, jota käytetään kun Git pyytää sinua kirjoittamaan viestin. Oletusarvoisesti, Git käyttää järjestelmäsi oletuseditoria, joka yleensä on Vi tai Vim. Jos haluat käyttää erillistä tekstieditoria, kuten Emacsia, voit tehdä seuraavanlaisesti:

	$ git config --global core.editor emacs
	
## Diff-työkalusi

Seuraava hyödyllinen optio, jota saatat haluta konfiguroida, on oletus-diff-työkalu, jota käytetään yhdentämiskonfliktien selvittämiseen. Sanotaan vaikka, että haluat käyttää vimdiffiä:

	$ git config --global merge.tool vimdiff

Git hyväksyy seuraavat yhdentämistyökalut kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge, ja opendiff. Voit myös käyttää räätälöityä työkalua; katso Luku 7 saadaksesi lisäinformaatiota tähän.

## Tarkista asetuksesi

Jos haluat tarkistaa asetuksesi, sinä voit käyttää `git config --list`-komentoa listataksesi kaikki asetukset, jotka Git löytää tällä hetkellä:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Voit nähdä avaimia useammin kuin kerran, koska Git lukee saman avaimen monesta eri tiedostosta (`/etc/gitconfig`ista ja `~/.gitconfig`ista, esimerkkinä). Tässä tapauksessa, Git käyttää viimeistä arvoa jokaiselle yksittäiselle avaimelle jonka se näkee.

Voit myös tarkistaa, mitä Git ajattelee tietyn avaimen arvosta, kirjoittamalla `git config {key}`:

	$ git config user.name
	Scott Chacon
