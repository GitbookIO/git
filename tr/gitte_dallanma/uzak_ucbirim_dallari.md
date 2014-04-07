# Uzak Uçbirim Dalları

Yerel yazılım havuzunuzdaki uzak uçbirim dalları, uzak uçbirimlerdeki yazılım havuzlarınızın durumlarını gösteren imleçlerdir. Bunlar, hareket ettiremediğiniz yerel dallardır; yalnızca sunucuyla iletişim kurduğunuzda hareket ederler. Bu dallar, son bağlandığınızda sunucudaki yazılım havuzunun ne durumda olduğunu hatırlatan işaretçilerdir.

`(remote)`/`(dal)` biçimindedirler. Örneğin, sunucuya son bağlandığınızda `origin` uzak uçbirimindeki `master` dalının nasıl olduğunu görmek isterseniz, `origin/master` dalına bakmalısınız. Bir hatayı bir iş ortağıyla birlikte çözüyorsanız ve onlar `iss53` adında bir dalı sunucuya itmişlerse, sizin yerel dalınızın adı `iss53` iken, sunucuya itilmiş olan dalın adı `origin/iss53` olacaktır.

Bu biraz kafa karıştırıcı olabilir, gelin bir örnekle açıklayalım. Diyelim ki `git.şirketimiz.com` adresinde bir Git sunucunuz var. Buradan klonlama yaparsanız, Git bu yazılım havuzunu otomatik olarak `origin` olarak adlandıracak, bütün veriyi indirecek, onun `master` dalının gösterdiği kaydı gösteren `origin/master` adında hareket ettiremeyeceğiniz bir yerel dal oluşturacaktır. Git ayrıca,  üzerinde çalışabilmeniz için `origin`in `master` dalının olduğu yeri gösteren `master` adında yerel bir dal da oluşturacaktır (bkz. Figür 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)
 
Figür 3-22. Bir Git klonladığınızda hem yerel bir master dalınız hem de origin'in master dalını gösteren origin/master adında bir dalınız olur.

Eğer siz kendi master dalınızda çalışırken biir başkası `git.şirketimiz.com`'a itme yapıp `master` dalını güncellerse, tarihçeleriniz birbirinden farklılaşacaktır. Üstelik, `origin` sunucusuyla iletişime geçmediğiniz sürece sizin `origin/master` dalınız hareket etmeyecektir (bkz. Figür 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)
 
Figür 3-23. Siz yerelde çalışıyorken bir başkası sunucuya itme yaparsa, tarihçeleriniz birbirinden farklı hareket etmeye başlar.

Çalışmalarınızı eşitlemek için `git fetch origin` komutunu çalıştırabilirsiniz. Bu komut `origin` sunucusunun hangisi olduğuna bakar (bu örnekte `git.şirketimiz.com`), orada bulunup da sizde olmayan her türlü veriyi indirir, yerel veritabanınızı güncelleyip yerelinizdeki `origin/master` dalını yeni, güncel konumuna taşır (bkz. Figür 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)
 
Figür 3-24. git fetch komutu uzak uçbirim imleçlerinizi günceller.

Birden çok uzak uçbirime sahip bir projede uzak uçbirim imleçlerinin nasıl görüneceğini incelemek için, Scrum takımlarınızdan birisi tarafından kullanılan başka bir sunucunuzun daha olduğunu varsayalım. Bu sunucunun adresi `git.team1.şirketimiz.com` olsun. 2. Bölüm'de incelediğimiz gibi, bu sunucuyu projenize uzak uçbirim olarak eklemek için `git remote add` komutunu kullanabilirsiniz. Bu uçbirimin adı `teamone` olsun, ki bu adı daha sonra bütün URL yerine kısaltma olarak kullanacaksınız (bkz. Figür 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)
 
Figür 3-25. Başka bir sunucuyu uzak uçbirim olarak eklemek.

`teamone` uzak uçbiriminde bulunup da sizde bulunmayan şeyleri getirmek için `git fetch teamone` komutunu çalıştırabilirsiniz. O sunucuda bulunan veriler `origin` sunucusunda bulunanların alt kümesi olduğundan, Git herhangi bir veri çekmez, ama `teamone/master` adında, `teamone` sunucusunun `master` dalının gösterdiği kaydı gösteren bir uzak uçbirim dalı oluşturur (bkz. Figür 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)
 
Figür 3-26. teamone'nin master dalının pozisyonunu gösteren bir yerel imleciniz oluyor.

## İtme İşlemi

Bir daldaki çalışmalarınızı başkalarıyla paylaşmak istediğinizde, onu yazma yetkinizin olduğu bir uzak uçbirime itmelisiniz (_push_). yerel dallarınız otomatik olarak sunucuyla eşitlenmez —paylaşmak istediğiniz dalları açık şekilde itmelisiniz. Böylece, paylaşmak istemediğiniz dallar için özel yerel dallar kullanıp, yalnızca paylaşmak istediğiniz işlev dallarını iteblirsiniz.

Başkalarıyla ortaklaşa çalışmak istediğiniz `serverfix` adında bir dalınız varsa, onu da ilk dalınızı ittiğiniz gibi itebilirsiniz. `git push (remote) (branch)` komutunu çalıştırın.

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Bu bir tür kısayol sayılabilir. Git `serverfix` dal adını otomatik olarak `refs/heads/serverfix:refs/heads/serverfix` biçiminde açımlar, bu şu demektir: “yerel `serverfix` dalımı alıp uzak uçbirimin `serverfix` dalını güncellemek için kullan.” `refs/heads/` kısmınz 9. Bölüm'de ayrıntısıyla değineceğiz, ama genellikle bu kısmı kullanmasanız da olur. Aynı amaçla `git push origin serverfix:serverfix` komutunu da çalıştırabilirsiniz —bu da şu demektir: “Yereldeki serverfix'i al, bunu uzak uçbirimin serverfix'i yap.” Bu biçimi, yereldeki dal adıyla uzak uçbirimdeki dal adı farklı ise kullanabilirsiniz. Dal adının uzak uçbirimde `serferfix` olmasını istemezseniz `git push origin serverfix:awesomebranch` komutunu çalıştırarak yereldeki `serverfix` dalını uzak uçbirimdeki `awesomebranch` dalına itebilirsiniz.

Birlikte çalıştığınız insanlar sunucudan getirme işlemi (_fetch_) yaptıklarında,  sunucudaki `serverfix` sürümünün bulunduğu yeri gösteren `origin/serverfix` adında bir imlece sahip olacaklar.

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

Unutmayın, getirme (_fetch_) komutuyla yeni uzak uçbirim dallarını indirdiğinizde, yerelde otomatik olarak değiştirilebilir dallar oluşturulmaz. Başka bir deyişle, bu örnekte, `serverfix` adında bir dalınız olmaz, değiştiremeyeceğiniz `origin/serverfix` adında bir imleciniz olur.

Oradaki değişiklikleri üzerinde çalışmakta olduğunuz dala birleştirmek isterseniz, `git merge origin/serverfix` komutunu çalıştırabilirsiniz. Üzerinde çalışmak üzere kendinize ait bir `serverfix` dalınız olmasını isterseniz, uzak uçbirim dalını temel alabilirsiniz:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Bu, üzerinde çalışabileceğiniz ve `origin/serverfix`in gösterdiği yerden başlayan bir yerel dal yaratır.

## İzleme Dalları

Bir uzak uçbirim dalından yerel bir dal seçtiğinizde (_checkout_), bu işlem otomatik olarak bir _izleme dalı_ (_tracking branch_) oluşturur. İzleme dalları, uzak uçbirim dallarıyla doğrudan ilişkileri bulunan yerel dallardır. Bir izleme dalından `git push` komutunu çalıştırdığınızda , Git hangi sunucudaki hangi dala itme işlemi yapması gerektiğini bilir. Ayrıca, bu dallardan birinden `git pull` komutunu çalıştırdığınızda, bütün imleçler indirileceği gibi, bu izleme dalına karşılık gelen uzak uçbirim dalı da otomatik olarak bu dalla birleştirilir.

Bir yazılım havuzunu klonladığınızda, genellikle `origin/master` dalını izleyen bir `master` dalı yaratılır. Bu nedenle `git push` ve `git pull` komutları bu durumlarda ek argümanlara gerek kalmadan çalışırlar. Öte yandan, isterseniz başka izleme dalları da —`origin`'i ya da `master` dalınız izlemeyen dallar— oluşturabilirsiniz. Yukarıda basit bir örneğini gördük: `git checkout -b [dal] [uzak_ucbirim]/[dal]`. Git'in 1.6.2'den itibaren olan sürümlerinde `--track` kısayolunu da kullanabilirsiniz:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Uzak uçbirim dalının adından başka bir adla yerel dal oluşturmak isterseniz, yukarıdaki komutu farklı bir yerel dal adıyla kullanabilirsiniz:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "sf"

Şimdi, yereldeki sf dalı, otomatik olarak `origin/serverfix` dalına itme ve çekme işlemi yapabilecek.

## Uzak Uçbirim Dallarını Silmek

Suppose you’re done with a remote branch — say, you and your collaborators are finished with a feature and have merged it into your remote’s `master` branch (or whatever branch your stable codeline is in). You can delete a remote branch using the rather obtuse syntax `git push [remotename] :[branch]`. If you want to delete your `serverfix` branch from the server, you run the following:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Boom. No more branch on your server. You may want to dog-ear this page, because you’ll need that command, and you’ll likely forget the syntax. A way to remember this command is by recalling the `git push [remotename] [localbranch]:[remotebranch]` syntax that we went over a bit earlier. If you leave off the `[localbranch]` portion, then you’re basically saying, “Take nothing on my side and make it be `[remotebranch]`.”
