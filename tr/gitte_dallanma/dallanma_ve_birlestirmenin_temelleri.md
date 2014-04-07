# Dallanma ve Birleştirmenin Temelleri

Gelin, basit bir örnekle, gerçek hayatta kullanacağınız bir dallanma ve birleştirme işleyişinin üstünden geçelim. Şu adımları izleyeceksiniz:

1. Bir web sitesi üzerine çalışıyor olun.
2. Üzerinde çalıştığınız yeni bir iş parçası için bir dal yaratın.
3. Çalışmalarınızı bu dalda gerçekleştirin.

Bu noktada, sizden kritik önemde başka sorun üzerinde çalışıp hızlıca bir yama hazırlamanız istensin. Bu durumda şunları yapacaksınız:

1. Ana dalınıza geri dönün.
2. Yamayı eklemek için yeni bir dal oluşturun.
3. Testleri tamamlandıktan sonra yama dalını ana dalla birleştirip yayına verin.
4. Çalışmakta olduğunuz iş parçası dalına geri dönüp çalışmaya devam edin.

## Dallanmanın Temelleri

Önce, diyelim ki bir projede çalışıyorsunuz ve halihazırda birkaç tane kaydınız var (bkz. Figür 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)
 
Figür 3-10. Kısa ve basit bir kayıt tarihçesi.

Şirketinizin kullandığı sorun izleme programındaki #53 numaralı sorun üzerinde çalışmaya karar verdiniz. Açıklığa kavuşturmak için söyleyelim: Git herhangi bir sorun izleme programına bağlı değildir; ama #53 numaralı sorun üzerinde çalışmak istediğiniz başı sonu belli bir konu olduğu için, çalışmanızı bir dal üzerinde yapacaksınız. Bir dalı yaratır yaratmaz hemen ona geçiş yapmak için `git checout` komutunu `-b` seçeneğiyle birlikte kullanabilirsiniz:

	$ git checkout -b iss53
	Switched to a new branch "iss53"

Bu, aşağıdaki iki komutun yerine kullanabileceğiniz bir kısayoldur:

	$ git branch iss53
	$ git checkout iss53

Figür 3-11 sonucu resmediyor.


![](http://git-scm.com/figures/18333fig0311-tn.png)
 
Figür 3-11. Yeni bir dal imleci yaratmak.

Web sitesi üzerinde çalışıp bazı kayıtlar yapıyorsunuz. Bunu yaptığınızda `iss53` dalı ilerliyor, çünkü seçtiğiniz dal o (yani `HEAD` onu gösteriyor; bkz. Figür 3-12).

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)
 
Figür 3-12. Çalışamız sonucunda iss53 dalı ilerledi.

Şimdi, sizden web sitesindeki bir sorun için acilen bir yama hazırlamanız istensin. Git kullanıyorsanız, yamayı daha önce `iss53` dalında yaptığınız yaptığınız değişikliklerle birlikte yayına sokmanız gerekmez; yama üzerinde çalışmaya başlamadan önce söz konusu değişiklikleri geri alıp yayındaki web sitesini kaynak koduna ulaşabilmek için fazla çabalamanıza da gerek yok. Tek yapmanız gereken `master` dalına geri dönmek.

Ama, bunu yapmadan önce şunu belirtmekte yarar var: eğer çalışma klasörünüzde ya da kayda hazırlık alanında seçmek (_checkout_) istediğiniz dalla uyuşmazlık gösteren kaydedilmemiş değişiklikler varsa, Git dal değiştirmenize izin vermeyecektir. Dal değiştirirken çalışma alanınızı temiz olması en iyisidir. Bunun üstesinden gelmek için başvurulabilecek yolları (zulalama ve kayıt değiştirme gibi) daha sonra inceleyeceğiz. Şimdilik, bütün değişikliklerinizi kaydettiniz, dolayısıyla `master` dalına geçiş yapabilirsiniz.

	$ git checkout master
	Switched to branch "master"

Bu noktada, çalışma klasörünüz #53 numaralı sorun üzerinde çalışmaya başlamadan hemen önceki halindedir ve yamayı hazırlamaya odaklanabilirsiniz. Burası önemli: Git, çalışma klasörünüzü seçtiğiniz dalın gösterdiği kaydın bellek kopyasıyla aynı olacak şekilde ayarlar. Dal, son kaydınızda nasıl görünüyorsa çalışma klasörünü o hale getirebilmek için otomatik olarak dosyaları ekler, siler ve değiştirir.

Sırada, hazırlanacak yama var. Şimdi yama üzerinde çalışmak için bir `hotfix` dalı oluşturalım (bkz. Figür 3-13):

	$ git checkout -b 'hotfix'
	Switched to a new branch "hotfix"
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix]: created 3a0874c: "fixed the broken email address"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)
 
Figür 3-13. hotfix dalı master dalını baz alıyor.

Testlerinizi uygulayabilir, yamanızın istediğiniz gibi olduğundan emin olduktan sonra yayına sokabilmek için `master` dalıyla birleştirebilirsiniz. Bunun için `git merge` komutu kullanılır:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast forward
	 README |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Birleştirme çıktısındaki "Fast forward" ifadesine dikkat. Birleştirdiğiniz dalın gösterdiği kayıt, üstünde bulunduğunuz dalın doğrudan devamı olduğundan, Git yalnızca imleci ileri alır. Başka bir deyişle, bir kaydı, kendi tarihçesinde geri giderek ulaşılabilecek bir başka kayıtla birleştiriyorsanız, Git ıraksayan ve birleştirilmesi gereken herhangi bir şey olmadığı için işleri kolaylaştırıp imleci ileri alır —buna "fast forward" (hızlı ileri alma) denir.

Yaptığınız değişiklik artık `master` dalı tarafından işaret edilen kaydın bellek kopyasındadır ve yayımlanabilir (bkz. Figür 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)
 
Figür 3-14. Birleştirmeden sonra master dalınız hotfix dalınızla aynı yeri gösterir.

Bu çok önemli yama yayımlandıktan sonra, kaldığınız yere geri dönebilirsiniz. Fakat önce `hotfix` dalını sileceksiniz, çünkü artık ona ihtiyacınız kalmadı —`master` dalı aynı yeri gösteriyor. `git branch` komutunu `-d` seçeneğiyle birlikte kullanarak silme işlemini yapabilirsiniz:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Şimdi kaldığınız yere geri dönebilir ve #53 numaralı sorun üzerinde çalışmaya devam edebilirsiniz (bkz. 3-15).

	$ git checkout iss53
	Switched to branch "iss53"
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53]: created ad82d7a: "finished the new footer [issue 53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)
 
Figür 3-15. iss53 dalınız bağımsız olarak ilerleyebilir.

Şunu belirtmekte yarar var: `hotfix` dalında yaptığınız düzeltme `iss53` dalındaki dosyalarda bulunmuyor. Eğer bu değişikliği çekmek isterseniz, `git merge master` komutunu çalıştırarak `master` dalınızı `iss53` dalınızla birleştirebilirsiniz; alternatif olarak `iss53` dalındaki değişiklikleri `master`dalıyla birleştirmeye hazır hale getirene kadar bekleyebilirsiniz.

## Birleştirmenin Temelleri

Diyelim ki #53 numaralı sorunla ilgili çalışmanızı tamamladınız ve `master` dalıyla birleştirmeye hazırsınız. Bunu yapabilmek için `iss53` dalınızı, aynı `hotfix` dalını yaptığınız gibi birleştireceksiniz. Bütün yapmanız gereken birleştirmeyi gerçekleştirmek istediğiniz dalı seçmek (_checkout_) ve `git merge` komutunu çalıştırmak:

	$ git checkout master
	$ git merge iss53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Bu daha önce yaptığınız `hotfix` birleştirmesinden biraz farklı görünüyor. Burada, kayıt tarihçeniz daha eski bir noktadan ıraksamıştı. Üzerinde bulunduğunuz dalın gösterdiği kayıt birleştirmekte olduğunuz dalın doğrudan atası olmadığından Git'in biraz iş yapması gerekiyor. Bu örnekte Git, iki dalın en uç noktası ve ikisinin ortak atasının kullanıldığı üç taraflı basit bir birleştirme yapıyor. Figür 3-16, bu birleştirmede kullanılan üç farklı bellek kopyasını vurguluyor.


![](http://git-scm.com/figures/18333fig0316-tn.png)
 
Figür 3-16. Git, dalları birleştirmek için en uygun ortak atayı buluyor.

Git, yalnızca dal imlecini ileri kaydırmak yerine üç taraflı birleştirmenin sonucunda ortaya çıkan bellek kopyası için otomatik bir kayıt oluşturuyor (bkz. Figür 3-17). Buna birleştirme kaydı denir ve özelliği birden çok atasının olmasıdır.

Git'in en uygun ortak atayı otomatik olarak bulduğunu vurgulamakta yarar var; bu kullanıcının en uygun ortak paydayı bulmak zorunda olduğu CVS ve Subversion'daki durumdan (1.5 sürümünden önceki haliyle) farklıdır. Bu Git kullanarak birleştirme yapmayı söz konusu diğer sistemlere göre çok daha kolay bir hale getirir.


![](http://git-scm.com/figures/18333fig0317-tn.png)
 
Figür 3-17. Git, otomatik olarak, birleştirilmiş çalışmayı içeren yeni bir kayıt nesnesi yaratır.

Çalışmanız birleştirildiğine göre, artık `iss53` dalına ihtiyacınız kalmadı. Dalı silip, sorun izleme sisteminizdeki sorunu da kapatabilirsiniz:

	$ git branch -d iss53

## Temel Birleştirme Uyuşmazlıkları

Zaman zaman bu süreç o kadar da pürüzsüz ilerlemez. Eğer aynı dosyanın aynı bölümünü her iki dalda da değiştirmişseniz, Git temiz bir birleştirme yapamaz. #53 numaraları sorun için hazırladığınız düzeltme `hotfix`le aynı yazılım parçasını değiştiriyorsa, şuna benzer bir birleştirme uyuşmazlığıyla karşılaşırsınız:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Burada Git otomatik olarak yeni bir birleştirme kaydı oluşturmadı. Sizin uyuşmazlığı çözmenizi beklemek için sürece ara verdi. Bir birleştirme uyuşmazlığından sonra hangi dosyaların birleştirilmemiş olduğunu görmek için `git status` komutunu çalıştırabilirsiniz.

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Birleştirme uyuşmazlığı henüz çözümlenmemiş her şey _unmerged_ (birleştirilmemiş) olarak gösterilecektir. Git, dosyaları açıp uyuşmazlıkları çözümleyebilmeniz için standart uyuşmazlık çözümleme işaretçileri koyar. Dosyanızda şuna benzer bir bölümle karşılaşırsınız:

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53:index.html

Burada , `HEAD`deki sürüm (ki bu `master` dalındaki sürümdür çünkü birleştirme komutunu bu daldan çalıştırdınız) üstte, (`=======` işaretinin üstündeki her şey), `iss53` dalındaki sürüm ise altta gösterilmektedir. Uyuşmazlığı çözümleyebilmek için bu ikisinden birini seçmeli, ya da birleştirmeyi istediğiniz gibi kendiniz düzenlemelisiniz. Söz gelimi, uyuşmazlığı çözmek için bütün bu kod bloğunun yerine şunu yerleştirebilirsiniz:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

Çözümlemede iki taraftan da bir şeyler var ve `<<<<<<<`, `=======`, ve `>>>>>>>` işaretlerini içeren satırlar tamamen silinmiş durumda. Uyuşmazlık olan her bir dosyadaki her bir uyuşmazlık bloğunu çözümledikten sonra her dosyanın üzerinde `git add` komutunu çalıştırarak, uyuşmazlığın o dosya için çözülmüş olduğunu belirtebilirsiniz. Bir dosyayı ayda hazırlamak o dosyayı uyuşmazlığı çözümlenmiş olarak işaretler.
Uyuşmazlıkları çözümlemek için görsel bir araç kullanmak isterseniz `git mergetool` komutunu çalıştırabilirsiniz; bu komut size tek tek herbir uyuşmazlığı gösterecek uygun bir birleştirme aracını çalıştırır:

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

Varsayılan aracın dışında bir araç kullanmak isterseniz (Git, Mac'te çalıştığım için bu örnekte `opendiff`'i seçti), Git'in desteklediği bütün birleştirme araçlarının listesini en üstte “merge tool candidates” yazısından hemen sonra görebilirsiniz. Kullanmak istediğiniz aracın adını yazın. 7. Bölüm'de kendi çalışma ortamınız için varsayılan değeri nasıl değiştirebileceğinizi inceleyeceğiz.

Birleştirme aracını kapattıktan sonra, Git size birleştirmenin başarılı olup olmadığını soracaktır. Eğer başarılı olduğunu söylerseniz, sizin yerinize dosyayı kayda hazırlayıp çözümlenmiş olarak işaretler.

Bütün uyuşmazlıkların çözümlendiğinden emin olmak için tekrar `git status` komutunu çalıştırabilirsiniz:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

Durumdan memnunsanız ve uyuşmazlığı olan bütün dosyaların kayda hazırlandığından eminseniz, `git commit`'i kullanarak birleştirme kaydını tamamlayabilirsiniz. Öntanımlı kayıt mesajı şöyle görünür:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

İleride bu birleştirme işlemini inceleyecek olanlar için yararlı olacağını düşünüyorsanız bu kayıt mesajını ayrıntılandırabilirsiniz —eğer aşikâr değilse, birleştirmeyi neden yaptığınızı, ve birleştirmede neler yaptığınızı açıklayabilirsiniz.
