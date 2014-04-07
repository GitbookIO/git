# Değişiklikleri Yazılım Havuzuna Kaydetmek

Gerçek bir Git yazılım havuzuna ve söz konusu proje için gerekli olan bir dosya seçmesine sahipsiniz. Bu proje üzerinde değişiklikler yapmanız ve proje kaydetmek istediğiniz bir seviyeye geldiğinde bu değişikliklerin bir bellek kopyasını kaydetmeniz gerekecek.

Unutmayın, çalışma klasörünüzdeki dosyalar iki halden birinde bulunurlar: _izlenenler_ (_tracked_) ve _izlenmeyenler_ (_untracked_). _İzlenen_ dosyalar, bir önceki bellek kopyasında bulunan dosyalardır; bunlar _değişmemiş_, _değişmiş_ ya da _hazırlanmış_ olabilirler. Geri kalan her şey —çalışma klasörünüzde bulunan ve bir önceki bellek kopyasında ya da hazırlama alanında bulunmayan dosyalar— _izlenmeyen_ dosyalardır. Bir yazılım havuzunu yeni kopyalamışsanız, bütün dosyalar, henüz yeni seçme yaptığınız ve hiçbir şeyi değiştirmediğiniz için, izlenen ve değişmemiş olacaktır.

Dosyaları düzenlemeye başladığınızda, Git onları değişmiş olarak görecektir, çünkü son kaydınızdan beri üzerlerinde değişiklik yapmış olacaksınız. Değiştirdiğiniz bu dosyaları önce _hazırlayıp_ sonra bütün _hazırlanmış_ değişiklikleri kaydedeceksiniz ve bu döngü böyle sürüp gidecek. Bu döngü, Figür 2-1'de gösteriliyor.



![](http://git-scm.com/figures/18333fig0201-tn.png)

Figür 2-1. Dosyalarınızın değişik durumlarının döngüsü.

## Dosyaların Durumlarını Kontrol Etmek

Hangi dosyanın hangi durumda olduğunu görmek için kullanılacak temel araç `git status` komutudur. Bu komutu bir klonlama işleminin hemen sonrasında çalıştıracak olursanız, şöyle bir şey görmelisiniz:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Bu çalışma klasörünüzün temiz olduğu anlamına gelir —başka bir deyişle, izlenmekte olup da değiştirilmiş herhangi bir dosya yoktur. Git'in saptadığı herhangi bir izlenmeyen dosya da yok, olsaydı burada listelenmiş olurdu. Son olarak, bu komut size hangi dal (_branch_) üzerinde olduğunuzu söylüyor. Şimdilik bu, daima varsayılan dal olan `master` olacaktır; Şu anda buna kafa yormayın. Sonraki bölüm de dallar ve referanslar konusu derinlemesine ele alınacak.

Diyelim ki projenize yeni bir dosya, basit bir README dosyası eklediniz. Eğer dosya önceden orada bulunmuyorsa, ve `git status` komutunu çalıştırırsanız, bu izlenmeyen dosyayı şu şekilde görürsünüz:

	$ vim README
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#	README
	nothing added to commit but untracked files present (use "git add" to track)

Yeni README dosyanızın izlenmediğini görüyorsunuz, çünkü `status` çıktısında “Untracked files” başlığı altında listelenmiştir. Bir dosyanın izlenmemesi demek, Git'in onu bir önceki bellek kopyasında (_commit_) görmemesi demektir; siz açıkça belirtmediğiniz sürece Git bu dosyayı izlemeye başlamayacaktır. Bunun nedeni, derleme çıktısı olan ikili dosyaların ya da projeye dahil etmek istemediğiniz dosyaların yanlışlıkla projeye dahil olmasını engellemektir. README dosyasını projeye eklemek istiyorsunuz, öyleyse dosyayı izlemeye alalım.

## Yeni Dosyaları İzlemeye Almak

Yeni bir dosyayı izlemeye almak için `git add` komutunu kullanmalısınız. README dosyasını izlemeye almak için komutu şu şekilde çalıştırabilirsiniz:

	$ git add README

`status` komutunu yeniden çalıştırırsanız, README dosyasının artık izlemeye alındığını ve hazırlık alanında olduğunu göreceksiniz:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#

Hazırlık alanında olduğunu “Changes to be committed” başlığının altında olmasına bakarak söyleyebilirsiniz. Eğer bu noktada bir kayıt (_commit_) yapacak olursanız, dosyanın `git add` komutunu çalıştırdığınız andaki hali bellek kopyasına kaydedilecektir. Daha önce `git init` komutunu çalıştırdıktan sonra projenize dosya eklemek için `git add (dosya)` komutunu çalıştırdığınızı hatırlayacaksınız —bunun amacı klasörünüzdeki dosyaları izlemeye almaktı. `git add` komutu bir dosya ya da klasörün konumuyla çalışır; eğer söz konusu olan bir klasörse, klasördeki bütün dosyaları tekrarlamalı olarak projeye ekler.

## Değiştirilen Dosyaları Hazırlamak

Gelin şimdi halihazırda izlenmekte olan bir dosyayı değiştirelim. İzlenmekte olan `benchmarks.rb` adındaki bir dosyayı değiştirip `status` komutunu çalıştırdığınızda şöyle bir ekran çıktısıyla karşılaşırsınız:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

`benchmarks.rb` dosyası “Changes not staged for commit” başlıklı bir bölümün altında görünüyor —bu başlık izlenmekte olan bir dosyada değişiklik yapılmış olduğu fakat dosyanın henüz hazırlık alanına alınmadığı durumlarda kullanılır. Dosyayı hazırlamak için, `git add` komutunu çalıştırın (`git add` çok amaçlı bir komuttur, bir dosyayı izlemeye almak için, kayda hazırlamak için, ya da birleştirme uyuşmazlıklarının çözüldüğünü işaretlemek gibi başka amaçlarla kullanılır). Gelin `benchmarks.rb` dosyasını kayda hazırlamak için `git add` komutunu çalıştırıp sonra da `git status` komutuyla duruma bakalım:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

Her iki dosya da kayda hazırlanmış durumdadır ve bir sonraki kaydınıza dahil edilecektir. Tam da bu noktada, henüz kaydı gerçekleştirmeden, aklınıza `benchmarks.rb` dosyasında yapmak istediğiniz küçük bir değişikliğin geldiğini düşünelim. Dosyayı yeniden açıp değişikliği yaptıktan sonra artık kaydı yapmaya hazırsınız. Fakat, `git status` komutunu bir kez daha çalıştıralım:

	$ vim benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Ne oldu? `benchmarks.rb` dosyası hem kayda hazırlanmış hem de kayda hazırlanmamış görünüyor. Bu nasıl olabiliyor? Git, bir dosyayı `git add` komutunun alıştırıldığı haliyle kayda hazırlar. Eğer şimdi kayıt yapacak olursanız, `benchmarks.rb` dosyası, çalışma klasöründe göründüğü haliyle değil, `git add` komutunu son çalıştırdığınız haliyle kayıt edilecektir. Bir dosyayı `git add` komutunu çalıştırdıktan sonra değiştirecek olursanız, dosyanın son halini kayda hazırlamak için `git add` komutunu bir kez daha çalıştırmanız gerekir:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

## Dosyaları Görmezden Gelmek

Çoğu zaman, projenizde Git'in takip etmesini, hatta size izlenmeyenler arasında göstermesini bile istemediğiniz bir küme dosya olacaktır. Bunlar, genellikle otomatik olarak oluşturulan seyir (_log_) dosyaları ya da yazılım inşa sisteminin çıktılarıdır. Bu durumlarda, bu dosyaların konumlarıyla eşleşen örüntüleri listeleyen `.gitignore` adında bir dosya oluşturabilirsiniz:

	$ cat .gitignore
	*.[oa]
	*~

İlk satır, Git'e `.o` ya da `.a` ile biten dosyaları —yazılım derlemesinin sonucunda ortaya çıkmış olabilecek _nesne_ ve _arşiv_ dosyalarını— görmezden gelmesini söylüyor. İkinci satır, Git'e Emacs gibi pek çok metin editörü tarafından geçici dosyaları işaretlemek için kullanılan tilda işaretiyle (`~`) biten bütün dosyaları görmezden gelmesini söylüyor. Bu listeye `log`, `tmp` ya da `pid` klasörlerini, otomatik olarak oluşturulan dokümantasyon dosyalarını ve sair dosyayı ekleyebilirsiniz. Daha projenin başlangıcında bir `.gitignore` dosyası oluşturmak yazılım havuzunuzda istemeyeceğiniz dosyaları yanlışlıkla kaydetmenize engel olacağından oldukça iyi bir fikirdir.

`.gitignore` dosyanızda bulundurabileceğiniz örüntüler şu kurallara bağlıdır:

*	Boş satırlar ve `#` ile başlayan satırlar görmezden gelinir.
*	Stadart _glob_ örüntüleri ayırt edilir (Ç.N.: _glob_ \*nix tarafından kullanılan sınırlı bir kurallı ifade (_regular expression_) biçimidir).
*	Bir klasörü belirtmek üzere örüntüleri bir eğik çizgi (`/`) ile sonlandırabilirsiniz.
*	Bir örüntüyü ünlem işaretiyle (`!`) başlattığınızda, örüntünün tersi gereçli olur.

_Glob_ örüntüleri _shell_'ler tarafından kullanılan basitleştirilmiş kurallı ifadelerdir (_regular expression_). Bir yıldız işareti (`*`) sıfır ya da daha fazla karakterle eşleşir; `[abc]` köşeli parantezin içindeki herhangi bir karakterle eşleşir (buradaki örnekte `a`, `b`, ya da `c` ile); soru işareti (`?`) bir karakterle eşleşir; tireyle ayrılmış karakterleri içine alan bir köşeli parantez (`[0-9]`) bu aralıktaki bütün karakterlerle eşleşir (bu örnekte 0'dan 9'a kadar olan karakterler).

Bir `.gitignore` dosyası örneği daha:

	# bir yorum - bu görmezden gelinir
	# .a dosyalarını görmezden gel
	*.a
	# ama yukarıda .a dosyalarını görmezden geliyor olsan bile lib.a dosyasını izlemeye al
	!lib.a
	# kök dizindeki /TODO dosyasını (TODO adındaki alt klasörü değil) görmezden gel
	/TODO
	# build/ klasöründeki bütün dosyaları görmezden gel
	build/
	# doc/notes.txt dosyasını görmezden gel ama doc/server/arch.txt dosyasını görmezden gelme
	doc/*.txt

## Kayda Hazırlanmış ve Hazırlanmamış Değişiklikleri Görüntülemek

`git status` komutunu fazla anlaşılmaz buluyorsanız —yalnızca hangi dosyaların değiştiğini değil, bu dosyalarda tam olarak nelerin değiştiğini görmek istiyorsanız— `git diff` komutunu kullanabilirsiniz. `git diff` komutunu ileride ayrıntılı olarak inceleyeceğiz; ama bu komutu muhtemelen en çok şu iki soruya cevap bulmak için kullanacaksınız: Değiştirip de henüz kayda hazırlamadığınız neler var? Ve kayda olmak üzere hangi değişikliklerin hazırlığını yaptınız? `git status` bu soruları genel biçimde cevaplıyor olsa da `git diff` eklenen ve çıkarılan bütün dosyaları —olduğu gibi yamayı— gösterir.

Diyelim `README` dosyasını düzenleyip kayda hazırladınız, sonra da `benchmarks.rb` dosyasını düzenlediniz ama kayda hazırlamadınız. `status` komutunu çalıştırdığınızda şöyle bir şey görürsünüz:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Henüz kayda hazırlamadığınız değişiklikleri görmek için `git diff` komutunu (başka hiçbir argüman kullanmadan) çalıştırın:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

Komut, çalışma klasörünüzün içeriğiyle kayda hazırlık alanının içeriğini karşılaştırır. Sonuç size henüz kayda hazırlamadığınız değişiklikleri gösterir.

Kayda hazırlamış olduğunuz değişiklikleri görmek için `git diff --cache` komutunu kullanabilirsiniz. (1.6.1'den sonraki Git sürümlerinde hatırlaması daha kolay olabilecek `git diff --staged` komutunu da kullanabilirsiniz.) Bu komut kayda hazırlanmış değişikliklerle son kaydı karşılaştırır.

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

Dikkat edilmesi gereken nokta, `git diff`'in son kayıttan beri yapılan bütün değişiklikleri değil yalnızca kayda hazırlanmamış değişiklikleri gösteriyor oluşudur. Bu zaman zaman kafa karıştırıcı olabilir, zira, bütün değişikliklerinizi kayda hazırladıysanız, `git diff`'in çıktısı boş olacaktır.

Yine, örnek olarak, `benchmarks.rb` dosyasını kayda hazırlayıp daha sonra üzerinde değişiklik yaparsanız, `git diff` komutunu kullanarak hangi değişikliklerin kayda hazırlandığını, hangilerinin hazırlanmadığını görüntüleyebilirsiniz:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#

Şimdi `git diff` komutuyla hangi değişikliklerin henüz kayda hazırlanmamış olduğunu

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats
	+# test line

ve `git diff --cached` komutuyla neleri kayda hazırlamış olduğunuzu görebilirsiniz:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Değişiklikleri Kaydetmek

Yaptığınız değişiklikleri dilediğiniz gibi hazırlık alanına aldığınıza göre artık onları kaydedebilirsiniz (_commit_). Unutmayın, kayda hazırlanmamış —oluşturduğunuz ya da değiştirdiğiniz fakat `git add` komutunu kullanarak kayda hazırlamadığınız— değişiklikler kaydedilmeyecektir. Onlar sabit diskinizde değiştirilmiş dosyalar olarak kalacaklar.

Bu örnekte, `git status` komutunu son çalıştırdığınızda her şeyin kayda hazırlanmış olduğunu gördünüz, dolayısıyla değişikliklerinizi kaydetmeye hazırsınız. Kayıt yapmanın en kolay yolu `git commit` komutunu kullanmaktır:

	$ git commit

Bu komutu çalıştırdığınızda sisteminizde seçili bulunan metin editörü açılacaktır. (Editörünüz _shell_'inizin `$EDITOR` çevresel değişkeni tarafından tanımlanır —genellikle vim ya da emacs'tır, fakat `git config --global core.editor` komutunu _1. Bölüm_'de gördüğünüz gibi çalıştırarak bu ayarı değiştirebilirsiniz.)

Metin editörü aşağıdaki metni görüntüler (bu örnek Vim ekranından):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       new file:   README
	#       modified:   benchmarks.rb
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

Gördüğünüz gibi hazır kayıt mesajı `git status` çıktısının `#` kullanılarak devre dışı bırakılmış haliyle en üstte bir boş satırdan oluşur. Bu devre dışı bırakılmış kayıt mesajını silip yerine kendi kayıt mesajınızı yazabilir, ya da neyi kaydettiğinizi size hatırlatması için orada bırakabilirsiniz. (Neyi değiştirdiğinizin daha ayrıntılı olarak hatırlatılmasını isterseniz, `git commit` mesajını `-v` seçeneğiyle kullanabilirsiniz. Bu seçenek kaydetmekte olduğunuz değişikliğin içeriğini de (_diff_) editörde gösterecektir.) Editörü kapattığınızda Git, yazdığınız mesajı kullanarak değişikliği kaydeder (devre dışı bırakılmış bölümü ve değişikliğin içeriğini mesajın dışında bırakır).

Bir başka seçenek de, kayıt mesajınızı `commit` komutunu `-m` seçeneğiyle aşağıdaki gibi kullanmaktır:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master]: created 463dc4f: "Fix benchmarks for speed"
	 2 files changed, 3 insertions(+), 0 deletions(-)
	 create mode 100644 README

İlk kaydınızı oluşturmuş oldunuz! Görüldüğü gibi kayıt kendisiyle ilgili bilgiler veriyor: hangi dala kayıt yapmış olduğunuzu (`master`), kaydın SHA-1 sınama toplamının ne olduğunu (`463dc4f`), kaç dosyada değişiklik yaptığınızı ve kayıtta kaç satır ekleyip çıkardığınıza dair istatistiklerin çıktısını veriyor.

Unutmayın, kayıt, hazırlık alanında kayda hazırladığınız bellek kopyasının kaydıdır. Kayda hazırlamadığınız değişiklikler, değişiklik olarak duruyor; onları da proje tarihçesine eklemek isterseniz yeni bir kayıt yapabilirsiniz. Her kayıt işleminde projenizin bir bellek kopyasını kaydediyorsunuz; bu bellek kopyalarını daha sonra geriye sarabilir ya da birbiriyle karşılaştırabilirsiniz.

## Hazırlık Alanını Atlamak

Her ne kadar kayıtları tam istediğiniz gibi düzenlemek inanılmaz derecede yararlı bir şey olsa da, hazırlık alanı kimi zaman iş akışınıza fazladan bir yük getirebilir. Git, hazırlık alanını kullanmadan geçmek isteyenler için basit bir kısayol sunuyor. `git commit` komutunu `-a` seçeneğiyle kullanırsanız, Git, halihazırda izlenmekte olan bütün dosyaları otomatik olarak kayda hazırlayıp, `git add` aşamasını atlamanızı sağlar:

	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+), 0 deletions(-)

Gördüğünüz gibi, kayıt işlemi yapmadan önce `benchmarks.rb` dosyasını `git add` komutundan geçirmek zorunda kalmadınız.

## Dosyaları Ortadan Kaldırmak

Bir dosyayı Git'ten silmek için, önce izlenen dosyaları listesinden çıkarmalı (daha doğrusu, kayda hazırlık alanından kaldırmalı) sonra da kaydetmelisiniz. `git rm` hem bunu yapar hem de dosyayı çalışma klasörünüzden siler, böylece dosyayı izlenmeyen dosyalar arasında görmezsiniz.

Eğer dosyayı çalışma klasörünüzden silerseniz, `git status` çıktısının “Changes not staged for commit” (yani _kayda hazırlanmamış olanlar_) başlığı altında boy gösterecektir:

	$ rm grit.gemspec
	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#   (use "git add/rm <file>..." to update what will be committed)
	#
	#       deleted:    grit.gemspec
	#

Sonrasında `git rm` komutunu çalıştırırsanız, dosyanın ortadan kaldırılması için kayda hazırlanmasını sağlamış olursunuz:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       deleted:    grit.gemspec
	#

Bir sonraki kaydınızda, dosya silinmiş olacak ve artık izlenmeyecektir. Eğer dosyayı değiştirmiş ve halihazırda indekse eklemişseniz, ortadan kaldırma işlemini `-f` seçeneğini kullanarak zorlamanız gerekecektir. Bu, herhangi bir bellek kopyasına kaydedilmemiş ve Git kullanılarak kurtarılamayacak verilerin kaybolmasını önlemek amacıyla geliştirilmiş bir önlemdir.

Yapmak isteyebileceğiniz bir başka şey de dosyayı çalışma klasörünüzde tutup, kayda hazırlık alanından silmek olabilir. Bir başka deyişle, dosyayı sabit diskinizde bulundurmak ama Git'in izlenecek dosyalar listesinden çıkarmak isteyebilirsiniz. Bu, özellikle belirli bir dosyayı (büyük bir seyir dosyasını ya da bir küme derlenmiş `.a` dosyasını) `.gitignore` dosyanıza eklemeyi unutup yanlışlıkla Git indeksine eklediğinizde kullanışlı olan bir özelliktir. Bunu yapmak için `--cached` seçeneğini kullanmalısınız:

	$ git rm --cached readme.txt

`git rm` komutunu dosyalar, klasörler ya da _glob_ örüntüleri üzerinde kullanabilirsiniz. Yani şöyle şeyler yapabilirsiniz:

	$ git rm log/\*.log

`*`'in önündeki ters eğik çizgi işaretini gözden kaçırmayın. Bu işaret gereklidir, çünkü _shell_'inizin dosya adı açımlamasına ek olarak, Git de kendi dosya adı açımlamasını yapar. Yukarıdaki komut, `log/` klasöründeki `.log` eklentili bütün dosyaları ortadan kaldıracaktır. Ya da, şöyle bir şey yapabilirsiniz:

	$ git rm \*~

Bu komut `~` ile biten bütün dosyaları ortadan kaldıracaktır.

## Dosyaları Taşımak

Çoğu SKS'nin aksine Git taşınan dosyaları takip etmez. Bir dosyanın adını değiştirirseniz, Git, dosyanın yeniden adlandırıldığına dair herhangi bir üstveri oluşturmaz. Fakat Git, olay olup bittikten sonra neyin ne olduğunu anlamakta oldukça beceriklidir —dosya hareketlerini keşfetme meselesini birazdan ele alacağız.

Bu nedenle Git'in bir `mv` komutu olması biraz kafa karıştırıcı olabilir. Git'te bir dosyanın adını değiştirmek istiyorsanız, şöyle bir komut çalıştırabilirsiniz:

	$ git mv eski_dosya yeni_dosya

ve istediğinizi elde edersiniz. Hatta, buna benzer bir komut çalıştırdıktan sonra `status` çıktısına bakarsanız Git'in bir dosya adlandırma işlemini (_rename_) listelediğini görürsünüz:

	$ git mv README.txt README
	$ git status
	# On branch master
	# Your branch is ahead of 'origin/master' by 1 commit.
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       renamed:    README.txt -> README
	#

Öte yandan bu komut, şu komutları arka arkaya çalıştırmaya eşdeğerdir:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git dosya taşıma işlemini dolaylı yollardan anlar, dolayısıyla dosyayı yeniden adlandırmayı bu komutlarla mı yaptığınız yoksa `mv` komutunu mu kullandığınız Git açısından önemli değildir. Tek gerçek fark arka arkaya üç komut kullanmak yerine tek bir komut kullanıyor olmanızdır —`mv` bir kullanıcıya kolalık sağlayan bir komuttur. Daha önemlisi, bir dosyanın adını değiştirmek için istediğiniz her aracı kullanabilir, `add/rm` işlemlerini sonraya kayıttan hemen öncesine bırakabilirsiniz.
