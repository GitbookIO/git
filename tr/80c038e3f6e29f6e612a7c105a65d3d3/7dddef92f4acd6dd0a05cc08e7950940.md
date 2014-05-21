# Bir Git Yazılım Havuzu Edinmek

Bir Git projesi edinmenin başlıca iki yolu vardır. Bunlardan ilki, halihazırda varolan bir projeyi Git'e aktarmaktır. İkincisi ise bir sunucuda yer alan bir Git yazılım havuzunu klonlamakdır.

## Var olan Bir Klasörde Yazılım Havuzu Oluşturmak

Var olan bir projenizi sürüm kontrolü altına almak istiyorsanız, projenin bulunduğu klasöre gidip aşağıdaki komutu çalıştırmanız gerekir:

	$ git init

Bu, gerekli yazılım havuzu dosyalarını —Git iskeletini— içeren `.git` adında bir klasör oluşturur. Bu noktada, projenizdeki hiçbir şey sürüm kontrolüne girmiş değildir. (Oluşturulan `.git` klasöründe tam olarak hangi dosyaların bulunduğu hakkında daha fazla bilgi edinmek için bkz. _9. Bölüm_.)

Var olan dosyalarınızı sürüm kontrolüne almak istiyorsanız, o dosyaları hazırlayıp kayıt etmelisiniz. Bunu, sürüm kontrolüne almak istediğiniz dosyaları belirleyip kayıt altına aldığınız birkaç git komutuyla gerçekleştirebilirsiniz:

	$ git add *.c
	$ git add README
	$ git commit -m 'projenin ilk hali'

Birazdan bu komutların üzerinde duracağız. Bu noktada, sürüm kontrolüne aldığınız dosyaları içeren bir Git yazılım havuzunuz var.

## Var olan Bir Yazılım Havuzunu Klonlamak

Var olan bir Git yazılım havuzunu klonlamak istiyorsanız —söz gelimi, katkıda bulunmak istediğiniz bir proje varsa- ihtiyacınız olan komut `git clone`. Subversion gibi başka SKS'lere aşinaysanız, komutun `checkout` değil `clone` olduğunu fark etmişsinizdir. Bu önemli bir ayrımdır —Git, sunucuda bulunan neredeyse bütün veriyi kopyalar. `git clone` komutunu çalıştırdığınızda her dosyanın proje tarihçesinde bulunan her sürümü istemciye indirilir. Hatta, sunucunuzun diski bozulacak olsa, herhangi bir istemcideki herhangi bir klonu, sunucuyu klonlandığı zamanki haline geri getirmek için kullanabilirsiniz (sunucunuzdaki bazı çengel betikleri (_hook_) kaybedebilirsiniz, ama sürümlenmiş verinin tamamı elinizin altında olacaktır —daha fazla ayrıntı için bkz. _4. Bölüm_)

Bir yazılım havuzu `git clone [url]` komutuyla klonlanır. Örneğin, Grit adlı Ruby Git kütüphanesini klonlamak isterseniz, bunu şu şekilde yapabilirsiniz:

	$ git clone git://github.com/schacon/grit.git

Bu komut `grit` adında bir klasör oluşturur, bu klasörün içinde bir `.git` alt dizini oluşturup ilklemesini yapar, söz konusu yazılım havuzunun bütün verisini indirir ve son sürümünün bir koyasını seçer (_checkout_). Bu yeni `grit` klasörüne gidecek olursanız, kullanılmaya ve üzerinde çalışılmaya hazır proje dosyalarını görürsünüz. Yazılım havuzunu adı grit'ten farklı bir klasöre kopyalamak isterseniz, bunu komut satırı seçeneği olarak vermelisiniz:

	$ git clone git://github.com/schacon/grit.git mygrit

Bu komut da bir öncekiyle aynı şeyleri yapar, fakat oluşturulan klasörün adı `mygrit`'tir.

Git'in bir dizi farklı transfer protokolü vardır. Yukarıdaki örnek `git://` protokolünü kullanıyor, ama `http(s)://`'in ya da SSH  transfer protokolünü kullanan `user@server:/path.git`'in kullanıldığına da tanık olabilirsiniz. _4. Bölüm_'de Git yazılım havuzuna erişmek için sunucunun kullanabileceği bütün geçerli seçenekleri ve bunların olumlu ve olumsuz yanlarını inceleyeceğiz.
