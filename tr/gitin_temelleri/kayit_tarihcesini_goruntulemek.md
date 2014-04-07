# Kayıt Tarihçesini Görüntülemek

Birkaç kayıt oluşturduktan, ya da halihazırda kayıt tarihçesi olan bir yazılım havuzunu klonladığınızda, muhtemelen geçmişe bakıp neler olduğuna göz atmak isteyeceksiniz. Bunun için kullanabileceğiniz en temel ve becerikli araç `git log` komutudur.

Buradaki örnekler benim çoğunlukla tanıtımlarda kullandığım `simplegit` adında bir projeyi kullanıyor. Projeyi edinmek için aşağıdaki komutu çalıştırabilirsiniz:

	git clone git://github.com/schacon/simplegit-progit.git

Bu projenin içinde `git log` komutunu çalıştırdığınızda şuna benzer bir çıktı göreceksiniz:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

Aksi belirtilmedikçe, `git log` bir yazılım havuzundaki kayıtları ters kronolojik sırada listeler. Yani, en son kayıtlar en üstte görünür. Görüldüğü gibi, bu komut her kaydın SHA-1 sınama toplamını, yazarının adını ve adresini, kaydedildiği tarihi ve kayıt mesajını listeler.

`git log` komutunun, size tam olarak aradığınız şeyi göstermek için kullanılabilecek çok sayıda seçeneği vardır. Burada, en çok kullanılan bazı seçenekleri tanıtacağız.

En yararlı seçeneklerden biri, kaydın içeriğini (_diff_) gösteren `-p` seçeneğidir. İsterseniz `-2`'yi kullanarak komutun çıktısını son iki kayıtla sınırlayabilirsiniz:

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,7 +5,7 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Bu seçenek daha önceki bilgilere ek olarak kaydın içeriğini de her gösterir. Bu, yazılımı gözden geçirirken ya da belirli bir katılımcı tarafından yapılan bir dizi kayıt sırasında nelerin değiştiğine hızlıca göz atarken çok işe yarar.

Dilerseniz `git log`'u özet bilgiler veren bir dizi seçenekle birlikte kullanabilirsiniz. Örneğin, her kayıtla ilgili özet istatistikler için `--stat` seçeneğini kullanabilirsiniz:

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Gördüğünüz gibi `--stat`  seçeneği, her kaydın altına o kayıtta değişikliğe uğramış dosyaların listesini, kaç tane dosyanın değişikliğe uğradığını ve söz konusu dosyalara kaç satırın eklenip çıkarıldığı bilgisini ekler. Bu bilgilerin bir özetini de kaydın en altına yerleştirir. Oldukça yararlı bir başka seçenek de `--pretty` seçeneğidir. Bu seçenek `log` çıktısının biçimini değiştirmek için kullanılır. Bu seçenekle birlikte kullanacağınız birkaç tane öntanımlı ek seçenek vardır. `oneline` ek seçeneği her bir kaydı tek bir satırda gösterir; bu çok sayıda kayda göz atıyorsanız yararlı olabilir. Ayrıca `short`, `full` ve `fuller` seçenekleri aşağı yukarı aynı miktarda bilgiyi —bazı farklarla— gösterir:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

En ilginç ek seçenek, istediğiniz log çıktısını belirlemenizi sağlayan `format` ek seçeneğidir. Bu, özellikle bilgisayar tarafından işlenecek bir çıktı oluşturmak konusunda elverişlidir —biçimi açıkça kendiniz belirlediğiniz için farklı Git sürümlerinde farklı sonuçlarla karşılaşmazsınız:

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Tablo 2-1 `format` ek seçeneğinin kabul ettiği bazı biçimlendirme seçeneklerini gösteriyor.

	Seçenek	Çıktının Açıklaması
	%H	Sınama toplamı
	%h	Kısaltılmış sınama toplamı
	%T	Git ağacı sınama toplamı
	%t	Kısaltılmış Git ağacı sınama toplamı
	%P	Ata kayıtların sınama toplamları
	%p	Ata kayıtların kısaltılmış sınama toplamları
	%an	Yazarın adı
	%ae	Yazarın e-posta adresi
	%ad	Yazılma tarihi (–date= seçeneğiyle uyumludur)
	%ar	Yazılma tarihi (göreceli tarih)
	%cn	Kaydedenin adı
	%ce	Kaydedenin e-posta adresi
	%cd	Kaydedilme tarihi
	%cr	Kaydedilme tarihi (göreceli tarih)
	%s	Konu

_yazar_'la _kaydeden_ arasında ne gibi bir fark olduğunu merak ediyor olabilirsiniz. _yazar_ yamayı oluşturan kişidir, _kaydeden_'se yamayı projeye uygulayan kişi. Bir projeye yama gönderdiğinizde, projenin çekirdek üyelerinden biri yamayı projeye uygularsa, her ikinizin de adı kaydedilecektir —sizin adınız yazar olarak onun adı kaydeden olarak. Bu farkı _5. Bölüm_'de biraz daha ayrıntılı olarak ele alacağız.

`oneline` ve `format` ek seçenekleri özellikle `--graph` ek seçeneğiyle birlikte kullanıldıklarında çok işe yararlar. Bu ek seçenek projenizin dal (_branch_) ve birleştirme (_merge_) tarihçesini gösteren sevimli bir ASCII grafiği oluşturur. Grit yazılım havuzunun grafiğine bakalım:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Bunlar `git log`'la birlikte kullanabileceğiniz seçeneklerden yalnızca birkaçı —daha başka çok sayıda seçenek var. Tablo 2-2 yukarıda incelediğimiz seçeneklerin yanı sıra, yararlı olabilecek başka seçenekleri `git log` çıktısına olan etkileriyle birlikte listeliyor.

	Seçenek	Açıklama
	-p	Kayıtların içeriklerini de göster.
	--stat	Kayıtlarda değişikliğe uğrayan dosyalarla ilgili istatistikleri göster.
	--shortstat	Yalnızca değişikliği/eklemeyi/çıkarmayı özetleyen satırı göster command.
	--name-only	Kayıtlarda değişen dosyaların yalnızca adlarını göster.
	--name-status	Kayıtlarda değişen dosyaların adlarıyla birlikte değişme/eklenme/çıkarılma bilgisini de göster.
	--abbrev-commit	Sınama toplamının 40 karakterli tamamı yerine yalnızca ilk birkaç karakterini göster.
	--relative-date	Tarihi gün, ay, yıl olarak göstermek yerine göreceli olarak göster ("iki hafta önce" gibi).
	--graph	Log tarihçesinin yanısıra, dal ve birleştirme tarihçesini ASCII grafiği olarak göster.
	--pretty	Kayıtları alternatif bir biçimlendirmeyle göster. `oneline` `short`, `full`, `fuller` ve (kendi istediğiniz biçimi belirleyebildiğiniz) `format` ek seçenekleri kullanılabilir.

## Log Çıktısını Sınırlandırma

`git log` komutu, biçimlendirme seçeneklerinin yanı sıra bir dizi sınırlandırma seçeneği de sunar —bu seçenekler kayıtların yalnızca bir alt kümesini gösterir. Bu seçeneklerden birini yukarıda gördünüz —yalnızca son iki kaydı gösteren `-2` seçeneğini. Aslında, son `n` kaydı görmek için `n` yerine herhangi bir tam sayı koyarak bu seçeneği `-<n>` biçiminde kullanabilirsiniz. Bunu muhtemelen çok sık kullanmazsınız, zira Git `log` çıktısını zaten sayfa sayfa gösteriyor, dolayısıyla `git log` komutunu çalıştırdığınızda zaten önce kayıtların birinci sayfasını göreceksiniz.

Öte yandan `--since` ya da `--until` gibi çıktıyı zamanla sınırlayan seçenekler işinizi kolaylaştırabilir. Söz gelimi, şu komut, son iki hafta içinde yapılmış kayıtları listeliyor:

	$ git log --since=2.weeks

Bu komut pek çok değişik biçimlendirmeyle kullanılabilir —kesin bir tarih (“2008-01-15”) ya da “2 years 1 day 3 minutes ago” gibi göreli bir tarih kullanabilirsiniz.

Ayrıca listeyi belirli arama ölçütlerine uyacak biçimde filtreleyebilirsiniz. `--author` seçeneği belirli bir yazara aiy kayıtları filtrelemenizi sağlar; `--grep` seçeneğiyse kayıt mesajlarında anahtar kelimeler aramanızı sağlar. (Unutmayın, hem `author` hem de `grep` seçeneklerini kullanmak istiyorsanız, komuta `--all-match` seçeneğini de eklemelisiniz, aksi takdirde, komut bu iki seçenekten herhangi birine uyan kayıtları bulup getirecektir.)

`git log`la kullanılması son derece yararlı olan son seçenek konum seçeneğidir. `git log`'u bir klasör ya da dosya adıyla birlikte kullanırsanız, komutun çıktısını yalnızca o dosyalarda değişiklik yapan kayıtlarla sınırlamış olursunuz. Bu, komuta her zaman en son seçenek olarak eklenmelidir ve konumlar iki tireyle (`--`) diğer seçeneklerden ayrılmalıdır.

Tablo 2-3, bu seçenekleri ve birkaç başka yaygın seçeneği listeliyor.

	Seçenek	Açıklama
	-(n)	Yalnızca son n kaydı göster.
	--since, --after	Yalnızca belirli bir tarihten sonra eklenmiş kayıtlları göster.
	--until, --before	Yalnızca belirli bir tarihten önce yapılmış kayıtları göster.
	--author	Yalnızca yazarın adının belirli bir karakter katarıyla (_string_) eşleşen kayıtları göster.
	--committer	Yalnızca kaydedenin adının belirli bir karakter katarıyla eşleştiği kayıtları göster.

Örneğin, Git kaynak kod yazılım havuzu tarihçesinde birleştirme (_merge_) olmayan hangi kayıtların Junio Hamano tarafından 2008'in Ekim ayında kaydedilmiş olduğunu görmek için şu komutu çalıştırabilirsiniz:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Bu komut, Git kaynak kodu yazılım havuzundaki yaklaşık 20,000 komut arasından bu ölçütlere uyan 6 tanesini gösteriyor.

## Tarihçeyi Görselleştirmek için Grafik Arayüz Kullanımı

Kayıt tarihçenizi görüntülemek için görselliği daha çok ön planda olan bir araç kullanmak isterseniz, Git'le birlikte dağıtılan bir Tcl/Tk programı olan `gitk`'ya bir göz atmak isteyebilirsiniz. Gitk, temelde `git log`'u görselleştiren bir araçtır ve neredeyse `git log`'un kabul ettiği bütün filtreleme seçeneklerini tanır. Proje klasörünüzde komut satırına `gitk` yazacak olursanız Figür 2-2'deki gibi bir şey görürsünüz.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Figür 2-2. gitk grafiklse tarihçe görüntüleyicisi.

Pencerenin üst yarısında bir kalıtım grafiğinin yanı sıra kayıt tarihçesini görebilirsiniz. Alttaki kayıt içeriği görüntüleyicisi, tıkladığınız herhangi bir kayıttaki değişiklikleri gösterecektir.
