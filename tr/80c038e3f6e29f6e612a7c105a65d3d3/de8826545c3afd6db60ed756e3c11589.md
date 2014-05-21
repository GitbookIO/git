# Etiketleme

Çoğu SKS gibi Git'in de tarihçedeki belirli noktaları önemli olarak etiketleyebilme özelliği vardır. Genellikle insanlar bu işlevi sürümleri (`v1.0`, vs.) işaretlemek için kullanırlar. Bu alt bölümde mevcut etiketleri nasıl listeleyebileceğinizi, nasıl yeni etiketler oluşturabileceğinizi ve değişik etiket tiplerini öğreneceksiniz.

## Etiketlerinizi Listeleme

Git'te mevcut etiketleri listeleme işi epeyi kolaydır. `git tag` yazmanız yeterlidir:

	$ git tag
	v0.1
	v1.3

Bu komut etiketleri alfabetik biçimde sıralar; etiketlerin sırasının bir önemi yoktur.

İsterseniz belirli bir örüntüyle eşleşen etiketleri de arayabilirsiniz. Git kaynak yazılım havuzunda 240'tan fazla etiket vardır. Yalnızca 1.4.2 serisindeki etiketleri görmek isterseniz şu komutu çalıştırmalısınız:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Etiket Oluşturma

Git iki başlıca etiket tipi kullanır: hafif ve açıklamalı. Hafif etiketler hiç değişmeyen dallar gibidir —belirli bir kaydı işaret ederler. Öte yandan, açıklamalı etiketler, Git veritabanında bütünlüklü nesneler olarak kaydedilirler. Sınama toplamları alınır; etiketleyenin adını ve e-posta adresini içerirler; bir etiket mesajına sahiptirler ve GNU Privacy Guard (GPG) kullanılarak imzalanıp doğrulanabilirler. Genellikle bütün bu bilgilere ulaşılabilmesini olanaklı kılabilmek için açıklamalı etiketlerin kullanılması önerilir, ama bütün bu bilgileri depolamadan yalnızca geçici bir etiket oluşturmak istiyorsanız, hafif etiketleri de kullanabilirsiniz.

## Açıklamalı Etiketler

Git'te açıklamalı etiket oluşturmak basittir. En kolayı `tag` komutunu çalıştırırken `-a` seçeneğini kullanmaktır:

	$ git tag -a v1.4 -m 'sürümüm 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

`-m` seçeneği etiketle birlikte depolanacak etiketleme mesajını belirlemek için kullanılır. Açıklamalı bir etiket için mesajı bu şekilde belirlemezseniz, Git mesajı yazabilmeniz için bir editör açacaktır.

`git show` komutunu kullanarak etiketlenen kayıtla birlikte etikete ilişkin verileri de görebilirsiniz:

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

Bu, kayıt bilgisinden önce etiketleyenle ilgili bilgileri, kaydın etiketlendiği tarihi ve açıklama mesajını gösterir.

## İmzalı Etiketler

Eğer bir kişisel anahtarınız (_private key_) varsa etiketlerinizi GPG ile imzalayabilirsiniz. Yapmanız gereken tek şey `-a` yerine `-s` seçeneğini kullanmaktır:

	$ git tag -s v1.5 -m 'imzalı 1.5 etiketim'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Bu etiket üzerinde `git show` komutunu çalıştırırsanız, GPG imzasını da görebilirsiniz:

	$ git show v1.5
	tag v1.5
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:22:20 2009 -0800

	imzalı 1.5 etiketim
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

Birazdan imzalı etiketleri nasıl doğrulayabileceğinizi öğreneceksiniz.

## Hafif Etiketler

Kayıtları etiketlemenin bir yolu da hafif etiketler kullanmaktır. Bu, kayıt sınama toplamının bir dosyada depolanmasından ibarettir —başka hiçbir bilgi tutulmaz. Bir hafif etiket oluştururken `-a`, `-s` ya da `-m` seçeneklerini kullanmamalısınız.

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Şimdi etiket üzerinde `git show` komutunu çalıştıracak olsanız, etiketle ilgili ek bilgiler görmezsiniz. Komut yalnızca kaydı gösterir:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Etiketleri Doğrulamak

İmzalı bir etiketi doğrulamak için `git tag -v [etiket-adi]` komutu kullanılır. Bu komut imzayı doğrulamak için GPG'yi kullanır. Bunun düzgün çalışması için imza sahibinin kamusal anahtarı (_public key_) anahtar halkanızda (_keyring_) bulunmalıdır.

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

Eğer imzalayıcının genel anahtarına sahip değilseniz, bunun yerine aşağıdakine benzer bir şey göreceksiniz:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Sonradan Etiketleme

Geçmişteki kayıtları da etiketleyebilirsiniz. Diyelim ki Git tarihçeniz şöyle olsun:

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

Söz gelimi, "updated rakefile" kaydında projenizi `v1.2` olarak etiketlemeniz gerekiyordu, ama unuttunuz. Etiketi sonradan da ekleyebilirsiniz. O kaydı etiketlemek için komutun sonuna kaydın sınama toplamını (ya da bir parçasını) eklemelisiniz:

	$ git tag -a v1.2 9fceb02

Kaydın etiketlendiğini göreceksiniz:

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

## Etiketleri Paylaşmak

Aksi belirtilmedikçe `git push` komutu etiketleri uzak uçbirimlere aktarmaz. Etiketleri belirtik biçimde bir ortak sunucuya itmeniz gerekir. Bu süreç uçbirim dallarını paylaşmaya benzer —`git push origin [etiket-adi]` komutunu çalıştırabilirsiniz.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Bir seferde birden çok etiketi paylaşmak isterseniz, `git push` komutuyla birlikte `--tags` seçeneğini de kullanabilirsiniz. Bu, halihazırda itilmemiş olan bütün etiketlerinizi uzak uçbirime aktaracaktır.

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

Artık başka biri sizin yazılım havuzunuzdan çekme yaptığında, bütün etiketlerinize de sahip olacaktır.
