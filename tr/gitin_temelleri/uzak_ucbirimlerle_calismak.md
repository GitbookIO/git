# Uzak Uçbirimlerle Çalışmak

Bir Git projesine katkıda bulunabilmek için uzaktaki yazılım havuzlarını nasıl düzenleyeceğinizi bilmeniz gerekir. Uzaktaki yazılım havuzları, projenizin İnternet'te ya da başka bir ağda barındırılan sürümleridir. Birden fazla uzak yazılım havuzunuz olabilir, bunlardan her biri sizin için ya salt okunur ya da okunur/yazılır durumdadır. Başkalarıyla ortak çalışmak, bu yazılım havuzlarını düzenlemeyi, onlardan veri çekip (_pull_) onlara veri iterek (_push_) çalışmalarınızı paylaşmayı gerektirir.

Uzaktaki yazılım havuzlarınızı düzenleyebilmek için, projenize uzak yazılım havuzlarının nasıl ekleneceğini, kullanılmayan havuzların nasıl çıkarılacağını, çeşitli uzak dalları düzenlemeyi ve onların izlenen dallar olarak belirleyip belirlememeyi ve daha başka şeyleri gerektirir. Bu alt bölümde bu uzağı yönetme yeteneklerini inceleyeceğiz.

## Uzak Uçbirimleri Görüntüleme

Projenizde hangi uzak sunucuları ayarladığınızı görme için `git remote` komutunu kullanabilirsiniz. Bu komut, her bir uzak uçbirimin belirlenmiş kısa adını görüntüler. Eğer yazılım havuzunuzu bir yerden klonlamışsanız, en azından _origin_ uzak uçbirimini görmelisiniz —bu Git'in klonlamanın yapıldığı sunucuya verdiği öntanımlı addır.

	$ git clone git://github.com/schacon/ticgit.git
	Initialized empty Git repository in /private/tmp/ticgit/.git/
	remote: Counting objects: 595, done.
	remote: Compressing objects: 100% (269/269), done.
	remote: Total 595 (delta 255), reused 589 (delta 253)
	Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
	Resolving deltas: 100% (255/255), done.
	$ cd ticgit
	$ git remote
	origin

`-v` seçeneğini kullanarak Git'in bu kısa ad için depoladığı URL'yi de görebilirsiniz:

	$ git remote -v
	origin	git://github.com/schacon/ticgit.git

Projenizde birden çok uzak uçbirim varsa, bu komut hepsini listeleyecektir. Örneğin, benim Git yazılım havuzum şöyle görünüyor:

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

Bu demek oluyor ki bu kullanıcıların herhangi birinden kolaylıkla çekme işlemi (_pull_) yapabiliriz. Fakat dikkat ederseniz, yalnızca _origin_ uçbiriminin SSH URL'si var, yani yalnızca o havuza kod itebiliriz (_push_) (niye böyle olduğunu _4. Bölüm_'de inceleyeceğiz)

## Uzak Uçbirimler Eklemek

Önceki alt bölümlerde uzak uçbirim eklemekten söz ettim ve bazı örnekler verdim, ama bir kez daha konuyu açıkça incelemekte yarar var. Uzaktaki bir yazılım havuzunu kısa bir ad vererek eklemek için `git remote add [kisa_ad] [url]` komutunu çalıştırın:

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Artık bütün bir URL yerine `pb`'yi kullanabilirsiniz. Örneğin, Paul'ün yazılım havuzunda bulunan ama sizde bulunmayan bütün bilgileri getirmek için `git fetch pb` komutunu kullanabilirsiniz:

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

Paul'ün `mastertr` dalı sizin yazılım havuzunuzda da `pb/master` olarak erişilebilir durumdadır —kendi dallarınızdan biriyle birleştirebilir (_merge_) ya da bir yerel dal olarak seçip içeriğini inceleyebilirsiniz.

## Uzak Uçbirimlerden Getirme ve Çekme İşlemi Yapmak

Biraz önce gördüğünüz gibi, uzaktaki yazılım havuzlarından veri almak için şu komutu kullanabilirsiniz:

	$ git fetch [uzak-sunucu-adı]

Bu komut, söz konusu uzaktaki yazılım havuzuna gidip orada bulunup da sizin projenizde bulunmayan bütün veriyi getirir. Bunu yaptıktan sonra sizin projenizde o uzak yazılım havuzundaki bütün dallara referanslar oluşur —ki bunları birleştirme yapmak ya da içeriği incelemek için kullanabilirsiniz. (Dalların ne olduğunu ve onları nasıl kullanabileceğinizi _3. Bölüm_'de ayrıntılı biçimde inceleyeceğiz.)

Bir yazılım havuzunu klonladığınızda, klonlama komutu söz konusu kaynak yazılım havuzunu _origin_ adıyla uzak uçbirimler arasına ekler. Dolayısıyla, `git fetch origin` komutu, klonlamayı yaptığınızdan (ya da en son getirme işlemini (_fetch_) yatığınızdan) beri sunucuya itilmiş yeni değişiklikleri getirir. Unutmayın, `fetch` komutu veriyi yeler yazılım havuzunuza indirir —otomatik olarak sizin yaptıklarınızla birleştirmeye, ya da çalıştığınız şeyler üzerinde değişiklik yapmaya kalkışmaz. Hazır olduğunuzda birleştirme işlemini sizin yapmanız gerekir.

Uzaktaki bir dalı izlemek üzere ayarlanmış bir dalınız varsa (daha fazla bilgi için sonraki alt bölüme ve _3. Bölüm_'e bakınız) bu dal üzerinde `git pull` komutunu kullanarak uzaktaki yazılım havuzundaki veriyi hem getirip hem de mevcut dalınızla birleştirebilirsiniz. Bu çalışması daha kolay bir düzen olabilir; bu arada, `git clone ` komutu, otomatik olarak, yerel yazılım havuzunuzda, uzaktaki yazılım havuzunun `master` dalını takip eden bir `master` dalı oluşturur (uzaktaki yazılım havuzunun `master` adında bir dalı olması koşuluyla). `git pull` komutu genellikle yereldeki yazılım havuzunuza kaynaklık eden sunucudan veriyi getirip otomatik olarak üzerinde çalışmakta olduğunuz dalla birleştirir.

## Uzaktaki Yazılım Havuzuna Veri İtmek

Projeniz paylaşmak istediğiniz bir hale geldiğinde, yaptıklarınızı kaynağa itmeniz gerekir. Bunun için kullanılan komut basittir: `git push [uzak-sunucu-adi] [dal-adi]`. Projenizdeki `master` dalını `origin` sunucunuzdaki `master` dalına itmek isterseniz (yineleyelim; kolanlama işlemi genellikle bu isimleri otomatik olarak oluşturur), şu komutu kullanabilirsiniz:

	$ git push origin master

Bu komut, yalnızca yazma yetkisine sahip olduğunuz bir sunucudan klonlama yapmışsanız ve son getirme işleminizden beri hiç kimse itme işlemi yapmamışsa istediğiniz sonucu verir. Eğer sizinle birlikte bir başkası daha klonlama yapmışsa ve o kişi sizden önce itme yapmışsa, sizin itme işleminiz reddedilir. İtmeden önce sizden önce itilmiş değişiklikleri çekip kendi çalışmanızla birleştirmeniz gerekir. Uzaktaki yazılım havuzlarına itme yapmak konusunda daha ayrıntılı bilgi için bkz. _3. Bölüm_.

## Uzak Uçbirim Hakkında Bilgi Almak

Belirli bir uzak uçbirim hakkında daha fazla bilgi almak isterseniz `git remote show [ucbirim-adi]` komutunu kullanabilirsiniz. Bu komutu `origin` gibi belirli bir uçbirim kısa adıyla kullanırsanız şöyle bir sonuç alırsınız:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

Bu, uçbirimin URL'sini ve dalların izlenme durumunu gösterir. Komut, size, eğer `master` dalda iseniz ve `git pull` komutunu çalıştırırsanız, bütün referansları uzak uçbirimden indirip uzaktaki `master` dalından yerel `master` dalına birleştirme yapacağını da söylüyor. Ayrıca, ekmiş olduğu bütün uzak dalları da bir liste halinde veriyor.

Yukarıdaki verdiğimiz, basit bir örnekti. Git'i daha yoğun biçimde kullandığınızda, `git remote show` komutu çok daha fazla bilgi içerecektir:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Bu çıktı, belirli dallarda `git push` komutunu çalıştırdığınızda hangi dalların otomatik olarak itileceğini gösteriyor. Buna ek olarak uzak uçbirimde bulunup da sizin projenizde henüz bulunmayan uzak dalları, uzak uçbirimden silinmiş olduğu halde sizin projenizde bulunan dalları ve `git pull` komutunu çalıştırdığınızda otomatik olarak birleştirme işlemine uğrayacak birden çok dalı gösteriyor.

## Uzan Uçbirimleri Kaldırmak ve Yeniden Adlandırmak

Bir uçbirimin kısa adını değiştirmek isterseniz, Git'in yeni sürümlerinde bunu `git remote rename` komutuyla yapabilirsiniz. Örneğin, `pb` uçbirimini `paul` diye yeniden adlandırmak isterseniz, bunu `git remote rename`'i kullanarak yapabilirsiniz:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Bu işlemin uçbirim dal adlarını da değiştirdiğini hatırlatmakta yarar var. Bu işlemden önce `pb/master` olan dalın adı artık `paul/master` olacaktır.

Bir uçbirim referansını herhangi bir nedenle —sunucuyu taşımış ya da belirli bir yansıyı artık kullanmıyor olabilirsiniz; ya da belki katılımcılardan birisi artık katkıda bulunmuyordur— kaldırmak isterseniz `git remote rm` komutunu kullanabilirsiniz:

	$ git remote rm paul
	$ git remote
	origin
