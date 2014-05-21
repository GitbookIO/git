# Dallanma İş Akışları

Dallanma ve birleştirmenin temellerine hakim olduğunuza göre, şimdi bu bilgiyi kullanarak neler yapabileceğimize bakalım. Bu alt bölümde masrafsız dallanmanın olanaklı kıldığı bazı yaygın iş akışları üzerinde duracağız, böylece bunları kendi geliştirme döngünüzde kullanıp kullanmamaya karar verebilirsiniz.

## Uzun Süreli Dallar

Git, basit üç taraflı birleştirme yaptığı için uzun bir zaman dilimi boyunca bir daldan diğerine çok sayıda birleştirme yapmak genellikle kolaydır. Yani, sürekli açık olan ve geliştirme döngünüzün değişik aşamalarında kullanabileceğiniz birkaç dal bulundurabilirsiniz; düzenli olarak bazılarından diğerlerine birleştirme yapabilirsiniz.

Git'i kullanan pek çok yazılımcı bu yaklaşımı benimser, `master` dalında yalnızca kararlı (_stable_) durumdaki kod bulunur —yalnızca yayımlanmış olan ya da yayımlanacak kod. `develop` ya da `next` adında, kararlılık testlerinin yürütüldüğü bir paralel dalları daha vardır —bu dal o kadar kararlı olmayabilir, fakat kararlı duruma getirildiğinde `master` dalına birleştirilir. Kısa ömürlü, belirli bir işlevin geliştirilmesine ayrılmış dalların (sizin `iss53` adlı dalınız gibi) hazır olduklarında birleştirilmeleri için —bütün testlerden geçtiklerinden ve yeni hatalara kapı aralamadıklarından emin olmak amacıyla— kullanılır.

Gerçekte, yazılım tarihçesinde ileri doğru hareket eden imleçlerden söz ediyoruz. Kararlı dallar eski kayıtları, güncel dallar çok daha yenilerini gösterir (bkz. Figür 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)
 
Figür 3-18. Daha kararlı dallar genellikle kayıt tarihçesinde daha geride bulunurlar.

Bu dalları, çalışma ambarları olarak hayal ediliriz, bir dizi kayıt bütünüyle test ediltikten sonra daha kararlı başka br ambara konulurlar (bkz. Figür 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)
 
Figure 3-19. Dalların ambarlar gibi olduğunu düşünebilirsiniz.

Çeşitli kararlılık seviyeleri tanımlayıp bu işleyişi o şekilde kullanabilirsiniz. Büyük projelerde `proposed` (önerilen) ya da `pu` (proposed updates - önerilen güncellemeler) adında bir dal daha olabilir. Bu dala, `next` ya da `master` dalına birleştirilecek kadar kararlı aşamada bulunmayan dallar birleştirilir. Sonuçta, dallar farklı kararlılık seviyelerinde bulunurlar; daha kararlı bir seviyeye ulaştıklarında, bir üstlerindeki dala birleştirilirler.
Tekrarlayalım: birden çok uzun ömürlü dal bulundurmak zorunlu değildir, ama, özellikle çok büyük ya da karmaşık projelerde çalışıyorsanız çoğunlukla yararlıdır.

## İşlev Dalları

İşlev dalları, her ölçekte proje için yararlıdır. İşlev dalları, belirli bir özellikle ilgili değişikliklerin geliştirilmesi için kullanılan kısa ömürlü dallardır. Başka SKS'lerde bu çok masraflı olduğu için, muhtemelen bu yaklaşımı daha önce benimsemediniz. Ama Git'te dal yaratmak, o dal üzerinde çalışmak, dalı birleştirmek ve daha sonra silmek, günde birkaç kez yapılan yaygın bir yöntemdir.

Bunu bir önceki alt bölümde `iss53` ve `hotfix` dalları üzerinde çalışırken gördünüz. Bu dallarda birkaç değişiklik yaptınız ve bu değişiklikleri `master` dalına birleştirdikten hemen sonra bu dalları sildiniz. Bu teknik sayesinde, bağlamlar arasında hızlı ve bütünlüklü geçişler yapabilirsiniz —çalışmalarınız belirli bir işlevin geliştirilmesine adanmış farklı ambarlara ayrılmış olduğundan, geçen süre zarfında, diyelim kod gözden geçirmesi sırasında neler olduğunu kolaylıkla görebilirsiniz. Değişikliklerinizi işlev dallarında dakikalarca, günlerce ya da aylarca tutabilir, hazır oldukları zaman, hangisinin dalın daha önce oluşturulduğuna aldırmadan birleştirebilirsiniz.

Diyelim ki `master` dalında çalışıyorsunuz, sonra bir hatayı gidermek için yeni bir dal oluşturuyorsunuz (`iss91`), derken aynı hatayı başka türlü gidermek için yeni bir dal oluşturuyorsunuz (`iss91v2`), sonra `master`'a geri dönüp biraz daha çalışıyorsunuz, sonra aklınıza gelen ama çok da gerekli olmadığını düşündüğünüz bir şeyle ilgili çalışmak için yeni bir dal oluşturuyorsunuz (`dumbidea`)... Kayıt tarihçeniz Figür 3-20'deki gibi görünecektir.


![](http://git-scm.com/figures/18333fig0320-tn.png)
 
Figür 3-20. Birden çok işlev dalının bulunduğu kayıt tarihçeniz.

Şimdi diyelim ki, hatanın giderilmesinde ikinci çözümü (`iss91v2`) kullanmaya karar veriyorsunuz ve iş arkadaşlarınız `dumbidea` dalında yaptıklarınızı dahice buluyor. `iss91` dalınızı çöpe atabilir (C5 ve C6 kayıtlarını kaybedeceksiniz) diğer iki dalı birleştirebilirsiniz. Bu durumda tarihçeniz Figür 3-21'deki gibi görünecektir.


![](http://git-scm.com/figures/18333fig0321-tn.png)
 
Figür 3-21. dumbidea ve iss91v2'yi birleştirdikten sonra kayıt tarihçeniz.

Unutmayın, bütün bunları yerel dallarda yapıyorsunuz. Dal yaratırken ve birleştirme yaparken her şey yalnızca yerel yazılım havuzunda gerçekleşiyor —hiçbir sunucu iletişimi olmuyor.
