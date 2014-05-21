# Sürüm Kontrolü Hakkında

Sürüm kontrolü nedir ve ne işe yarar? Sürüm kontrolü, bir ya da daha fazla dosya üzerinde yapılan değişiklikleri kaydeden ve daha sonra belirli bir sürüme geri dönebilmenizi sağlayan bir sistemdir. Bu kitaptaki örneklerde yazılım kaynak kod dosyalarının sürüm kontrolünü yapacaksınız, ne var ki gerçekte sürüm kontrolünü neredeyse her türden dosya için kullanabilirsiniz.

Bir grafik ya da web tasarımcısıysanız ve bir görselin ya da tasarımın değişik sürümlerini korumak istiyorsanız (ki muhtemelen bunu yapmak istersiniz), bir Sürüm Kontrol Sistemi (SKS) kullanmanız çok akıllıca olacaktır. SKS, dosyaların ya da bütün projenin geçmişteki belirli bir sürümüne erişmenizi, zaman içinde yapılan değişiklikleri karşılaştırmanızı, soruna neden olan şeyde en son kimin değişiklik yaptığını, belirli bir hatayı kimin, ne zaman sisteme dahil ettiğini ve daha başka pek çok şeyi görebilmenizi sağlar. Öte yandan, SKS kullanmak, bir hata yaptığınızda ya da bazı dosyaları yanlışlıkla sildiğinizde durumu kolayca telâfi etmenize yardımcı olur. Üstelik, bütün bunlar size kayda değer bir ek yük de getirmez.

## Yerel Sürüm Kontrol Sistemleri

Çoğu insan, dosyaları bir klasöre (akılları başlarındaysa tarih ve zaman bilgisini de içeren bir klasöre) kopyalayarak sürüm kontrolü yapmayı tercih eder. Bu yaklaşım çok yaygındır, çünkü çok kolaydır; ama aynı zamanda hatalara da alabildiğine açıktır. Hangi klasörde olduğunuzu unutup yanlış dosyaya yazabilir ya da istemediğiniz dosyaların üstüne kopyalama yapabilirsiniz.

Bu sorunla baş edebilmek için, programcılar uzun zaman önce, dosyalardaki bütün değişiklikleri sürüm kontrolüne alan basit bir veritabanına sahip olan yerel SKS'ler geliştirdiler (bkz. Figür 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)
 
Figür 1-1. Yerel sürüm kontrol diyagramı.

En yaygın SKS araçlarından biri, bugün hâlâ pekçok bilgisayara kurulu olarak dağıtılan, rcs adında bir sistemdi. Ünlü Mac OS X işletim sistemi bile, Developer Tools'u yüklediğinizde, rcs komutunu kurmaktadır. Bu araç, iki sürüm arasındaki yamaları (yani, dosyalar arasındaki farkları) özel bir biçimde diske kaydeder; daha sonra, bu yamaları birbirine ekleyerek, bir dosyanın belirli bir sürümdeki görünümünü yeniden oluşturur.

## Merkezi Sürüm Kontrol Sistemleri

İnsanların karşılaştığı ikinci büyük sorun, başka sistemlerdeki programcılarla birlikte çalışma ihtiyacından ileri gelir. Bu sorunla başa çıkabilmek için, Merkezi Sürüm Kontrol Sistemleri (MSKS) geliştirilmiştir. Bu sistemler, meselâ CVS, Subversion ve Perforce, sürüm kontrolüne alınan bütün dosyaları tutan bir sunucu ve bu sunucudan dosyaları seçerek alan (_check out_) istemcilerden oluşur. Bu yöntem, yıllarca, sürüm kontrolünde standart yöntem olarak kabul gördü (bkz. Figür 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)
 
Figür 1-2. Merkezi sürüm kontrol diyagramı.

Bu yöntemin, özellikle yerel SKS'lere göre, çok sayıda avantajı vardır. Örneğin, bir projedeki herkes, diğerlerinin ne yaptığından belirli ölçüde haberdardır. Sistem yöneticileri kimin hangi yetkilere sahip olacağını oldukça ayrıntılı biçimde düzenleyebilirler; üstelik bir MSKS'yi yönetmek, her istemcide ayrı ayrı kurulu olan yerel veritabanlarını yönetmeye göre çok daha kolaydır.

Ne var ki, bu yöntemin de ciddi bazı sıkıntıları vardır. En aşikar sıkıntı, merkezi sunucunun arızalanması durumunda ortaya çıkacak kırılma noktası problemidir. Sunucu bir saatliğine çökecek olsa, o bir saat boyunca kullanıcıların çalışmalarını sisteme aktarmaları ya da çalıştıkları şeylerin sürümlenmiş kopyalarını kaydetmeleri mümkün olmayacaktır. Merkezi veritabanının sabit diski bozulacak olsa, yedekleme de olması gerektiği gibi yapılmamışsa, elinizdeki her şeyi —projenin, kullanıcıların bilgisayarlarında kalan yerel bellek kopyaları (_snapshot_) dışındaki bütün tarihçesini— kaybedersiniz. Yerel SKS'ler de bu sorundan muzdariptir —projenin bütün tarihçesini tek bir yerde tuttuğunuz sürece her şeyi kaybetme riskiniz vardır.

## Dağıtık Sürüm Kontrol Sistemleri

Bu noktada Dağıtık Sürüm Kontrol Sistemleri (DSKS) devreye girer. Bir DSKS'de (Git, Mercurial, Bazaar ya da Darcs örneklerinde olduğu gibi), istemciler (kullanıcılar) dosyaların yalnızca en son bellek kopyalarını almakla kalmazlar: yazılım havuzunu (_repository_) bütünüyle yansılarlar (kopyalarlar).

Böylece, sunuculardan biri çökerse, ve o sunucu üzerinden ortak çalışma yürüten sistemler varsa, istemcilerden birinin yazılım havuzu sunucuya geri yüklenerek sistem kurtarılabilir. Her seçme (_checkout_) işlemi esasında bütün verinin yedeklenmesiyle sonuçlanır (bkz. Figür 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)
 
Figür 1-3. Dağıtık sürüm kontrol diyagramı.

Dahası, bu sistemlerden çoğu birden çok uzak uçbirimdeki yazılım havuzuyla rahatlıkla çalışır, böylece, aynı proje için aynı anda farklı insan topluluklarıyla farklı biçimlerde ortak çalışmalar yürütebilirsiniz. Bu, birden çok iş akışı ile çalışabilmenizi sağlar, ki bu merkezi sistemlerde (hiyerarşik modeller gibi) mümkün değildir.
