# İlk Ayarlamalar

Artık Git sisteminizde kurulu olduğuna göre, onu ihtiyacınıza göre uyarlamak için bazı düzenlemeler yapabilirsiniz. Bunları yalnızca bir kere yapmanız yeterli olacaktır: güncellemelerden etkilenmeyeceklerdir. Ayrıca istediğiniz zaman komutları yeniden çalıştırarak ayarları değiştirebilirsiniz.

Git, Git'in nasıl görüneceğini ve çalışacağını belirleyen bütün konfigürasyon değişkenlerini görmenizi ve değiştirmenizi sağlayan git config adında bir araçla birlikte gelir. Bu değişkenler üç farklı yerde depolanabilirler:

*	`/etc/gitconfig` dosyası: Sistemdeki bütün kullanıcılar ve onların bütün yazılım havuzları için geçerli olan değerleri içerir. `git config` komutunu `--system` seçeneğiyle kullanırsanız, araç bu dosyadan okuyup değişiklikleri bu dosyaya kaydedecektir.
*	`~/.gitconfig` dosyası: Kullanıcıya özeldir. `--global` seçeneğiyle Git'in bu dosyadan okuyup değişiklikleri bu dosyaya kaydetmesini sağlayabilirsiniz.
*	kullanmakta olduğunuz yazılım havuzundaki git klasöründe bulunan config dosyası (yani `.git/config`): Söz konusu yazılım havuzuna özeldir. Her düzeydeki ayarlar kendisinden önce gelen düzeydeki ayarları gölgede bırakır (_override_), dolayısıyla `.git/config`'deki değerler `/etc/gitconfig`'deki değerlerden daha baskındır.

Git, Windows sistemlerde `$HOME` klasöründeki (çoğu kullanıcı için `C:\Documents and Settings\$USER` klasörüdür) `.gitconfig` dosyasına bakar (Ç.N.: Windows kullanıcı klasörüne %HOMEPATH% çevresel değişkenini kullanarak ulaşabilirsiniz). Git, Windows sistemlerde de /etc/gitconfig dosyasını arar fakat bu konum, Git kurulumu sırasında seçtiğiniz MSys kök dizinine göredir.

## Kimliğiniz

Git'i kurduğunuzda yapmanız gereken ilk şey adınızı ve e-posta adresinizi ayarlamaktır. Bunun önemli olmasının nedeni her bir Git kaydının bu bilgiyi kullanıyor olması ve bu bilgilerin dolaşıma soktuğunuz kayıtlara değişmez biçimde işlenmesidir.

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Yinelemek gerekirse, `--global` seçeneğini kullandığınızda bunu bir kez yapmanız yeterli olacaktır, çünkü Git, o sistemde yapacağınız her işlem için bu bilgileri kullanacaktır. İsmi ya da e-posta adresini projeden projeye değiştirmek isterseniz, komutu değişiklik yapmak istediğiniz proje klasörünün içinde `--global` seçeneği olmadan çalıştırabilirsiniz.

## Editörünüz

Kimlik ayarlarınızı yaptığınıza göre, Git sizden bir mesaj yazmanızı istediğinde kullanacağınız editörle ilgili düzenlemeyi yapabilirsiniz. Aksi belirtilmedikçe Git sisteminizdeki öntanımlı (_default_) editörü kullanır, bu da genellikle Vi ya da Vim'dir. Emacs gibi başka bir metin editörü kullanmak isterseniz, şu komutu kullanabilirsiniz:

	$ git config --global core.editor emacs
	
## Dosya Karşılaştırma Aracınız

Düzenlemek isteyeceğiniz bir diğer yararlı ayar da birleştirme (_merge_) uyuşmazlıklarını gidermek için kullanacağınız araçla ilgilidir. vimdiff aracını seçmek için şu komutu kullanabilirsiniz:

	$ git config --global merge.tool vimdiff

Git kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge ve opendiff araçlarını kabul eder. Dilerseniz özel bir araç için de ayarlamalar yapabilirsiniz (bununla ilgili daha fazla bilgi için bkz. 7. Bölüm).

## Ayarlarınızı Gözden Geçirmek

Ayarlarınızı gözden geçirmek isterseniz, Git'in bulabildiği bütün ayarları listelemek için `git config --list` komutunu kullanabilirsiniz.

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Bir ayarı birden çok kez görebilirsiniz; bunun nedeni Git'in aynı ayarı değişik dosyalardan (örneğin `etc/gitconfig` ve `~/.gitconfig`'den) okumuş olmasıdır. Bu durumda Git gördüğü her bir tekil ayar için en son bulduğu değeri kullanır.

`git config {ayar}` komutunu kullanarak Git'ten bir ayarın değerini görüntülemesini de isteyebilirsiniz:

	$ git config user.name
	Scott Chacon
