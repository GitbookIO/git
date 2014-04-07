# Git'in Temelleri

Peki Git özünde nedir? Bu, özümsenmesi gereken önemli bir alt bölüm, çünkü Git'in ne olduğunu ve temel çalışma ilkelerini anlarsanız, Git'i etkili biçimde kullanmanız çok daha kolay olacaktır. Git'i öğrenirken, Subversion ve Perforce gibi diğer SKS'ler hakkında bildiklerinizi aklınızdan çıkarmaya çalışın; bu aracı kullanırken yaşanabilecek kafa karışıklıklarını önlemenize yardımcı olacaktır. Git'in, kullanıcı arayüzü söz konusu sistemlerle benzerlik gösterse de, bilgiyi depolama ve yorumlama biçimi çok farklıdır; bu farklılıkları anlamak, aracı kullanırken kafa karışıklığına düşmenizi engellemekte yardımcı olacaktır.

## Farklar Değil, Bellek Kopyaları

Git ile diğer SKS'ler (Subversion ve ahbapları dahil) arasındaki esas fark, Git'in bilgiyi yorumlayış biçimiyle ilgilidir. Kavramsal olarak, diğer sistemlerin çoğu, bilgiyi dosya-tabanlı bir dizi değişiklik olarak depolar. Bu sistemler (CVS, Subversion, Perforce, Bazaar ve saire) bilgiyi, kayıt altında tuttukları bir dosya kümesi ve zamanla her bir dosya üzerinde yapılan değişikliklerin listesi olarak yorumlarlar (bkz. Figür 1-4).


![](http://git-scm.com/figures/18333fig0104-tn.png)
 
Figür 1-4. Diğer sistemler veriyi her bir dosyanın ilk sürümu üzerinde yapılan değişiklikler olarak depolama eğilimindedir.

Git, veriyi böyle yorumlayıp depolamaz. Bunun yerine, Git, veriyi, bir mini dosya sisteminin bellek kopyaları olarak yorumlar. Her kayıt işleminde (_commit_), ya da projenizin konumunu her kaydedişinizde, Git o anda dosyalarınızın nasıl göründüğünün bir fotoğrafını çekip o bellek kopyasına bir referansı depolar. Verimli olabilmek için, değişmeyen dosyaları yeniden depolamaz, yalnızca halihazırda depolanmış olan bir önceki özdeş kopyaya bir bağlantı kurar. Git'in veriyi yorumlayışı daha çok Figür 1-5'teki gibidir.


![](http://git-scm.com/figures/18333fig0105-tn.png)
 
Figür 1-5. Git veriyi projenin zaman içindeki bellek kopyaları olarak depolar.

Bu, Git'le neredeyse bütün diğer SKS'ler arasında ciddi bir ayrımdır. Bu ayrım nedeniyle Git, sürüm kontrolünün, diğer sürüm kontrol sistemlerinin çoğu tarafından önceki kuşaklardan devralınan neredeyse bütün yönlerini yeniden gözden geçirmek zorunda bırakır. Bu ayrım Git'i basit bir SKS olmanın ötesinde, etkili araçlara sahip bir mini dosya sistemi gibi olmaya iter. Veriyi bu şekilde yorumlamanın yararlarından bazılarını dallanmayı işleyeceğimiz 3. Bölüm'de ele alacağız.

## Neredeyse Her İşlem Yerel

Git'teki işlemlerin çoğu, yalnızca yerel dosyalara ve kaynaklara ihtiyaç duyar —genellikle bilgisayar ağındaki başka bir bilgisayardaki bilgilere ihtiyaç yoktur. Eğer çoğu işlemin ağ gecikmesi maliyetiyle gerçekleştiği bir MSKS kullanmışsanız, Git'in bu yönünü görünce, onun hız tanrıları tarafından kutsanmış olduğunu düşünebilirsiniz. Çünkü projenin bütün tarihçesi orada, yerel diskinde bulunmaktadır, işlemlerin çoğu anlık gerçekleşiyor gibi görünür.

Örneğin, projenin tarihçesini taramak için Git bir sunucuya bağlanıp oradan tarihçeyi indirdikten sonra görüntülemekle uğraşmaz —yerel veritabanını okumak yeterlidir. Bu da proje terihçesini neredeyse anında görünteleyebilmeniz anlamına gelir. Bir dosyanın şimdiki haliyle bir ay önceki hali arasındaki farkları görmek isterseniz, Git, bir sunucudan fark hesaplaması yapmasını talep etmek ya da karşılaştırmayı yerelde yapabilmek için dosyanın bir ay önceki halini indirmek zorunda kalmak yerine, dosyanın bir ay önceki halini yerelde bulup fark hesaplamasını yerelde yapar.

Bu aynı zamanda, eğer bağlantınız kopmuşsa, ya da VPN bağlantını yoksa yapamayacağınız şeylerin de sayıca oldukça sınırlı olduğu anlamına geliyor. Uçağa ya da trene binmiş olduğunuz halde biraz çalışmak istiyorsanız, yükleme yapabileceğiniz bir ağ bağlantısına kavuşana kadar güle oynaya kayıt yapabilirsiniz. Eve vardığınızda VPN istemcinizin olması gerektiği gibi çalışmıyorsa, yine de çalışmaya devam edebilirsiniz. pek çok başka sistemde bunları yapmak ya imk^ansız ya da zahmetlidir. Söz gelimi Perforce'ta, bir sunucuya bağlı değilseniz fazlaca bir şey yapamazsınız; Subversion ve CVS'te dosyaları değiştirebilirsiniz, ama veritabanına kayıt yapamazsınız (çünkü veritabanına bağlantınız yoktur). Bu, çok önemli bir sorun gibi görünmeyebilir, ama ne kadar fark yaratabileceğini gördüğünüzde şaşırabilirsiniz.

## Git Bütünlüklüdür

Git'te her şey depolanmadan önce sınama toplamından geçirilir (_checksum_) ve daha sonra bu sınama toplamı kullanılarak ifade edilir. Bu da demek oluyor ki, Git fark etmeden bir dosyanın ya da klasörün içeriğini değiştirmek mümkün değildir. Bu işlev Git'in merkezi işlevlerinden biridir ve felsefesiyle bir bütünlük oluşturur. Transfer sırasında veri kaybı ya da doysa arızası olmuşsa, Git bunu mutlaka fark edecektir.

Git'in sınama toplamı için kullandığı mekanizmaya SHA-1 özeti denir. Bu, on altılı sayı sisteminin (_hexadecimal_) sembolleriyle gösterilen (0-9 ve A-F) ve dosya ve klasör düzenini temel alan bir hesaplamayla elde denilen 40 karakterlik bir karakter dizisidir. Bir SHA-1 özeti şuna benzer:

	24b9da6552252987aa493b52f8696cd6d3b00373

Bu özetler sıklıkla karşınıza çıkacak, çünkü Git onları yaygın biçimde kullanyor. Hatta, Git her şeyi dosya adıyla değil, içeriğinin özet değeriyle adreslenen veritabanında tutar.

## Git Genellikle Yalnızca Veri Ekler

Git'te işlem yaptığınızda neredeyse bu işlemlerin tamamı Git veritabanına veri ekler. Sistemin geri döndürülemez bir şey yapmasını ya da veri silmesini sağlamak çok zordur. Her SKS'de olduğu gibi henüz kaydetmediğiniz değişiklikleri kaybedebilir ya da bozabilirsiniz; ama Git'e bir bellek kopyasını kaydettikten sonra veri kaybetmek çok zordur, özellikle de veritabanınızı düzenli olarak başka bir yazılım havuzuna itiyorsanız (_push_).

Bu Git kullanmayı keyifli hale getirir, çünkü işleri ciddi biçimde sıkıntıya sokmadan denemeler yapabileceğimizi biliriz. Git'in veriyi nasıl depoladığı ve kaybolmuş görünen veriyi nasıl kurtarabileceğiniz hakkında daha derinlikli bir inceleme için bkz. 9. Bölüm.

## Üç Aşama

Şimdi dikkat! Öğrenme sürecinizin pürüzsüz ilerlemesini istiyorsanız, aklınızda bulundurmanız gereken esas şey bu. Git'te, dosyalarınızın içinde bulunabileceği üç aşama (_state_) vardır: kaydedilmiş, değiştirilmiş ve hazırlanmış. Kaydedilmiş, verinin güvenli biçimde veritabanında depolanmış olduğu anlamına gelir. Değiştirilmiş, dosyayı değiştirmiş olduğunuz fakat henüz veritabanına kaydetmediğiniz anlamına gelir. Hazırlanmış ise, değiştirilmiş bir dosyayı bir sonraki kayıt işleminde bellek kopyasına alınmak üzere işaretlediğiniz anlamına gelir.

Bu da bizi bir Git projesinin üç ana bölümüne getiriyor: Git klasörü, çalışma klasörü ve hazırlık alanı.


![](http://git-scm.com/figures/18333fig0106-tn.png)
 
Figür 1-6. Çalışma klasörü, hazırlık alanı ve Git klasörü.

Git klasörü, Git'in üstverileri (_metadata_) ve nesne veritabanını depoladığı yerdir. Bu, Git'in en önemli parçasıdır ve bir yazılım havuzunu bir bilgisayardan bir başkasına klonladığınızda kopyalanan şeydir.

Çalışma klasörü projenin bir sürümünden yapılan tek bir seçmedir. Bu dosyalar Git klasöründeki sıkıştırılmış veritabanından çıkartılıp sizin kullanımınız için sabit diske yerleştirilir.

Hazırlık alanı (_staging area_), genellikle Git klasörünüzde bulunan ve bir sonraki kayıt işlemine hangi değişikliklerin dahil olacağını tutan sade bir dosyadır. Buna bazen indeks dendiği de olur, ama hazırlık alanı ifadesi giderek daha standart hale geliyor.

Git işleyişi temelde şöyledir:

1. Çalışma klasörünüzdeki dosyalar üzerinde değişiklik yaparsınız.
2. Dosyaları bellek kopyalarını hazırlık alanına ekleyerek hazırlarsınız.
3. Dosyaların hazırlık alanındaki hallerini alıp oradaki bellek kopyasını kalıcı olarak Git klasörüne depolayan bir kayıt işlemi yaparsınız.

Bir dosyanın belirli bir sürümü Git klasöründeyse, onun kaydedilmiş olduğu kabul edilir. Eğer üzerinde değişiklik yapılmış fakat hazırlık alanına eklenmişse, hazırlanmış olduğu söylenir. Ve seçme işleminden sonra üzerinde değişiklik yapılmış fakat kayıt için hazırlanmamışsa, değiştirilmiş olarak nitelenir.
