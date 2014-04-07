# Asioiden kumoaminen

Saatat haluta kumota jotain missä tahansa työvaiheessa. Esittelemme tässä muutaman perustyökalun tekemiesi muutosten kumoamiseen. Ole huolellinen, koska et voi aina peruuttaa joitakin näistä kumoamisista. Tämä on yksi muutamasta alueesta Gitissä, joissa voit menettää jonkin verran työtä, jos teet sen väärin.

## Viimeisimmän pysyvän muutoksen muuttaminen

Yksi yleinen kumoaminen tapahtuu, kun teet pysyvän muutoksen liian aikaisin ja mahdollisesti unohdat lisätä joitakin tiedostoja tai sähläät pysyvän muutoksen viestin kanssa. Jos haluat yrittää tehdä pysyvää muutosta uudestaan, voit tehdä sen `--amend`-optiolla:

	$ git commit --amend

Tämä komento ottaa lavastusalueesi ja käyttää sitä pysyvään muutokseen. Jos et ole tehnyt muutoksia viimeisimmän pysyvän muutoksesi jälkeen (esimerkiksi, jos ajat tämän komennon heti edellisen pysyvän muutoksesi jälkeen), tilannekuvasi näyttää tarkalleen samalta ja kaikki, mitä muutat, on pysyvän muutoksesi viesti.

Sama pysyvän muutoksen viestin editori aktivoituu, mutta se sisältää jo viestin edellisestä pysyvästä muutoksesta. Voit muokata viestiä samoin kuin aina, mutta se korvaa edellisen pysyvän muutoksesi.

Esimerkkinä, jos teet pysyvän muutoksen ja sitten huomaat unohtaneesi lavastaa muutokset tiedostossa, jonka haluat lisätä tähän pysyvään muutokseen, voit tehdä jotakuinkin seuraavasti:

	$ git commit -m 'initial commit'
	$ git add unohtunut_tiedosto
	$ git commit --amend

Näiden kolmen komennon jälkeen päädyt yhteen pysyvään muutokseen — toinen pysyvä muutos korvaa ensimmäisen.

## Lavastetun tiedoston lavastuksen purkaminen

Kaksi seuraavaa kappaletta havainnollistavat, kuinka paimentaa muutoksia lavastusalueellasi ja työskentelyhakemistossasi. Mukava osa on, että komento, jota käytät selvittääksesi näiden kahden alueen tilan, muistuttaa sinua myös, kuinka peruuttaa muutokset niihin. Sanokaamme, esimerkiksi, että olet muuttanut kahta tiedostoa ja haluat tehdä niistä kaksi erillistä pysyvää muutosta, mutta kirjoitit vahingossa `git add *` ja lavastit ne molemmat. Kuinka voit purkaa toisen lavastuksen? `Git status` -komento muistuttaa sinua:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

Heti ”Changes to be committed” -tekstin alla, sanotaan "use `git reset HEAD <file>...` to unstage". Joten, käyttäkäämme tätä neuvoa purkaaksemme `benchmarks.rb`-tiedoston lavastuksen:

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

Komento on hieman kummallinen, mutta se toimii. `Benchmarks.rb`-tiedosto on muokattu mutta lavastamaton jälleen.

## Muutetun tiedoston muutosten kumoaminen

Mitä, jos tajuat, ettet halua säilyttää muutoksiasi `benchmarks.rb`-tiedostoon? Kuinka voit helposti kumota sen muutokset — palauttaa sen takaisin sellaiseksi, miltä se näytti, kun teit viimeksi pysyvän muutoksen (tai alun perin kloonasit tai miten saitkaan sen työskentelyhakemistoosi)? Onneksi `git status` kertoo sinulle myös, miten tämä tehdään. Edellisessä esimerkkitulosteessa lavastamaton alue näyttää tältä:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Se kertoo sinulle melko selvästi, kuinka hylätä tekemäsi muutokset (ainakin Gitin uudemmat versiot, 1.6.1 ja uudemmat, tekevät tämän — jos sinulla on vanhempi versio, suosittelemme lämpimästi sen päivittämistä saadaksesi joitakin näistä mukavammista käytettävyysominaisuuksista). Tehkäämme kuten se sanoo:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Voit nähdä, että muutokset on peruutettu. Sinun tulisi myös ymmärtää, että tämä on vaarallinen komento: kaikki tähän tiedostoon tekemäsi muutokset ovat mennyttä — kopioit juuri toisen tiedoston sen päälle. Älä koskaan käytä tätä komentoa ellet ehdottomasti tiedä, ettet halua säilyttää tiedostoa. Jos sinun täytyy ainoastaan saada se pois tieltä, käymme läpi kätkemisen ja haarautumisen seuraavassa luvussa; ne ovat usein parempia tapoja toimia.

Muista, että kaikki, mistä on tehty pysyvä muutos Gitiin, voidaan melkein aina palauttaa. Jopa poistetuissa haaroissa olleet tai `--amend`-optiolla ylikirjoitetut pysyvät muutokset voidaan palauttaa (katso *Luku 9* datan palauttamiseksi). Kuitenkin, mitään, minkä hävität ja mistä ei ole tehty pysyvää muutosta, ei nähdä todennäköisesti koskaan uudelleen.
