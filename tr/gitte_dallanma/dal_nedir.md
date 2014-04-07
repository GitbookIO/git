# Dal Nedir?

Git'in dallanma işlemini nasıl yaptığını gerçekten anlayabilmek için geriye doğru bir adım atıp Git'in verilerini nasıl depoladığına bakmamız gerekiyor. 1. Bölüm'den hatırlayabileceğiniz üzere, Git verilerini bir dizi değişiklik olarak değil bir dizi bellek kopyası olarak depolar.

Git'te bir kayıt yaptığınızda, Git, kayda hazırladığınız içeriğin bellek kopyasına işaret eden imleci, yazar ve mesaj üstverisini ve söz konusu kaydın atalarını gösteren sıfır ya da daha fazla imleci (ilk kayıt için sıfır ata, normal bir kayıt için bir ata, iki ya da daha fazla dalın birleştirilmesinden oluşan bir kayıt için birden çok ata) içeren bir kayıt nesnesini depolar.

Bunu görselleştirmek için, üç dosyadan oluşan bir klasörünüzün olduğunu ve bu üç dosyayı da kayıt için hazırladığınızı varsayalım. Dosyaları kayda hazırlamak her bir dosyanın sınama toplamını alır (1. Bölüm'de söz ettiğimiz SHA-1 özeti), dosyanın o sürümünü Git yazılım havuzunda depolar (Git'te bunlara _blob_ denir (Ç.N. _blob_ Türkçe'ye damla ya da topak diye çevrilebilir, fakat kelimeyi olduğu gibi kullanmanın daha anlaşılır olacağını düşündük.)) ve sınama toplamını hazırlık alanına ekler:

	$ git add README test.rb LICENSE
	$ git commit -m 'initial commit of my project'

`git commit` komutunu çalıştırarak bir kayıt oluşturduğunuzda, Git her bir alt klasörün (bu örnekte yalnızca kök klasörün) sınama toplamını alır ve bu ağaç yapısındaki bu nesneleri yazılım havuzunda depolar. Git, daha sonra, üst veriyi ve ihtiyaç duyulduğunda bellek kopyasının yeniden yaratabilmek için ağaç yapısındaki nesneyi gösteren bir imleci içeren bir kayıt nesneyi yaratır.

Şimdi, Git yazılım havuzunuzda beş nesne bulunuyor: üç dosyanızın her biri için bir içerik _blob_'u, klasörün içeriğini listeleyen ve hangi dosyanın hangi _blob_'da depolandığı bilgisini içeren bir ağaç nesnesi ve o ağaç nesnesini gösteren bir imleci ve bütün kayıt üstverisini içeren bir kayıt nesnesi. Kavramsal olarak, Git yazılım havuzunuzdaki veri Figür 3-1'deki gibi görünür.


![](http://git-scm.com/figures/18333fig0301-tn.png)
 
Figür 3-1. Tek kayıtlı yazılım havuzundaki veri.

Yeniden değişiklik yapıp kaydederseniz, yeni kayıt kendisinden hemen önce gelen kaydı gösteren bir imleci de depolar. İki ya da daha fazla kaydın sonunda tarihçeniz Figür 3-2'deki gibi görünür.


![](http://git-scm.com/figures/18333fig0302-tn.png)
 
Figür 3-2. Birden çok kayıt sonunda Git nesne verisi.

Git'te bir dal, bu kayıtlardan birine işaret eden, yer değiştirebilen kıvrak bir imleçten ibarettir. Git'teki varsayılan dal adı `master`'dır. İlk kaydı yaptığınızda, son yaptığınız kaydı gösteren bir `master` dalına sahip olursunuz. Her kayıt yaptığınızda dal otomatik olarak son kaydı göstermek üzere hareket eder.


![](http://git-scm.com/figures/18333fig0303-tn.png)
 
Figür 3-3. Dal kayıt verisinin tarihçesini gösteriyor.

Yeni bir dal oluşturduğunuzda ne olur? Yeni kayıtlarla ilerlemenizi sağlayan yeni bir imleç yaratılır. Söz gelimi, `testing` adında yeni bir dal oluşturalım. Bunu, `git branch` komutuyla yapabilirsiniz:

	$ git branch testing

Bu, şu an bulunduğunuz kayıttan hareketle yeni bir imleç yaratır (bkz. Figür 3-4).



![](http://git-scm.com/figures/18333fig0304-tn.png)
 
Figür 3-4. Birden çok dal kayıt verisinin tarihçesini gösteriyor.

Git şu an hangi dalın üzerinde olduğunuzu nereden biliyor? `HEAD` adında özel bir imleç tutuyor. Unutmayın, buradaki `HEAD` Subversion ya da CVS gibi başka SKS'lerden alışık olduğunuz `HEAD`'den çok farklıdır. Git'te bu, üzerinde bulunduğunuz yerel dalı gösterir. Bu örnekte hâlâ `master` dalındasınız. `git branch` komutu yalnızca yeni bir dal yarattı —o dala atlamadı (bkz. Figür 3-5).


![](http://git-scm.com/figures/18333fig0305-tn.png)
 
Figür 3-5. HEAD dosyası üzerinde bulunduğunuz dalı gösteriyor.

Varolan bir dala atlamak için `git checkout` komutunu çalıştırmalısınız. Gelin, `testing` dalına atlayalım:

	$ git checkout testing

Bu, `HEAD`'in `testing` dalını göstermesiyle sonuçlanır (bkz. Figür 3-6).


![](http://git-scm.com/figures/18333fig0306-tn.png)

Figür 3-6. Dal değiştirdiğinizde HEAD üzerinde olduğunuz dalı gösterir.

Bunun ne önemi var? Gelin bir kayıt daha yapalım:

	$ vim test.rb
	$ git commit -a -m 'made a change'

Figür 3-7 sonucu resmediyor.


![](http://git-scm.com/figures/18333fig0307-tn.png)
 
Figür 3-7. HEAD'in gösterdiği dal her kayıtla ileri doğru hareket eder.

Burada ilginç olan `testing` dalı ilerlediği halde `master` dalı hâlâ dal değiştirmek için `git checkout` komutunu çalıştırdığınız zamanki yerinde duruyor. Gelin yeniden `master` dalına dönelim.

	$ git checkout master

Figür 3-8 sonucu gösteriyor.


![](http://git-scm.com/figures/18333fig0308-tn.png)
 
Figür 3-8. Seçme (checkout) işlemi yapıldığında HEAD başka bir dalı gösterir.

Örnekteki komut iki şey yaptı. `HEAD` imlecini yeniden `master` dalını gösterecek şekilde hareket ettirdi ve çalışma klasörünüzdeki dosyaları `master`'ın gösterdiği bellek kopyasındaki hallerine getirdi. Bu demek oluyor ki, bu noktada yapacağınız değişiklikler projenin daha eski bir sürümünü baz alacak. Özünde, başka bir yöne gidebilmek için `testing` dalında yaptığınız değişiklikleri geçici olarak geri almış oldunuz.

Gelin bir değişiklik daha yapıp kaydedelim:

	$ vim test.rb
	$ git commit -a -m 'made other changes'

Şimdi proje tarihçeniz iki ayrı dala ıraksadı (bkz. Figür 3-9). Yeni bir dal yaratıp ona geçtiniz, bazı değişiklikler yaptınız; sonra ana dalınıza geri döndünüz ve başka bazı değişiklikler yaptınız. Bu iki değişiklik iki ayrı dalda birbirinden yalıtık durumdalar: iki dal arasında gidip gelebilir, hazır olduğunuzda bu iki dalı birleştirebilirsiniz. Bütün bunları yalnızca `branch` ve `checkout` komutlarını kullanarak yaptınız.


![](http://git-scm.com/figures/18333fig0309-tn.png)
 
Figür 3-9. Dal tarihçeleri birbirinden ıraksadı.

Git'te bir dal işaret ettiği kaydın 40 karakterlik SHA-1 sınama toplamını içeren basit bir dosyadan ibaret olduğu için dalları yaratmak ve yok etmek oldukça masrafsızdır. Yeni bir dal yaratmak bir dosyaya 41 karakter (40 karakter ve bir satır sonu) yazmak kadar hızlıdır.

Bu, çoğu SKS'nin bütün proje dosyalarını yeni bir klasöre kopyalamayı gerektiren dallanma yaklaşımıyla keskin bir karşıtlık içindedir. Söz konusu yaklaşımda projenin boyutlarına bağlı olarak dallanma saniyeler, hatta dakikalar sürebilir; Git'te ise bu süreç her zaman anlıktır. Ayrıca, kayıt yaparken ata kayıtları da kaydettiğimiz için birleştirme sırasında uygun bir ortak payda bulma işi de otomatik olarak ve genellikle oldukça kolayca halledilir. Bu özellikler yazılımcıları sık sık dal yaratıp kullanmaya teşvik eder.

Neden böyle olması gerektiğine yakından bakalım.
