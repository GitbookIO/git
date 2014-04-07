# İpuçları

Git'in temelleri hakkındaki bu bölümü tamamlamadan önce, Git deneyiminizi kolaylaştırabilmek için birkaç ipucu vermekte yarar var. Pek çok insan Git'i bu ipuçlarına başvurmadan kullanıyor; bu ipuçlarından ileride tekrar söz etmeyeceğimiz gibi bunları bilmeniz gerektiğini de varsaymıyoruz; ama yine de bilmeniz yararınıza olacaktır.

## Otomatik Tamamlama

Eğer Bash -shell_'ini kullanıyorsanız, Git'in otomatik tamamlama betiğini (_script_) kullanabilirsiniz. Git kaynak kodunu indirip `contrib/completion` klasörüne bakın; orada `git-completion.bash` adında bir dosya olmalı. Bu dosyayı ev dizininize (_home_) kopyalayıp `.bashrc` dosyanıza ekleyin:

	source ~/.git-completion.bash

Otomatik tamamlama özelliğinin bütün Git kullanıcıları için geçerli olmasını istiyorsanız, bu betik dosyasını Mac sistemler için `/opt/local/etc/bash_completion.d` konumuna Linux sistemlerde `/etc/bash_completion.d/` konumuna kopyalayın. Bu, Bash'ın otomatik olarak yükleyeceği betiklerin bulunduğu bir klasördür.

Eğer bir Windows kullanıcısıysanız ve Git Bash kullanıyorsanız- ki bu msysGit'le kurulum yaptığınızdaki öntanımlı programdır, otomatik tamamlama kendiliğinden gelecektir.

Bir Git komutu yazarken Sekme tuşuna bastığınızda, karşınıza bir dizi seçenek getirir:

	$ git co<selme><sekme>
	commit config

Bu örnekte, `git co` yazıp Sekme tuşuna iki kez basmak `commit` ve `config` komutlarını öneriyor. Komutun devamında `m` yazıp bir kez daha Sekme tuşuna basacak olursanız, komut otomatik olarak `git commit`'e tamamlanır.

Bu, seçeneklerde de kullanılabilir, ki muhtemelen daha yararlı olacaktır. Örneğin, `git log` komutunu çalıştırırken seçeneklerden birisini hatırlayamadınız, seçeneği yazmaya başlayıp Sekme tuşuna basarak eşleşen seçenekleri görebilirsiniz:

	$ git log --s<sekme>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Bu güzel özellik sizi zaman kazandırabileceği gibi ikide bir belgelendirmeye bakma gereğini de ortadan kaldırır.

## Takma Adlar

Bir komutun bir kısmını yazdığınızda Git bunu anlamayacaktır. Komutların uzun adlarını kullanmak istemezseniz, `git config` komutunu kullanarak bunların yerine daha kısa takma adlar belirleyebilirsiniz. Kullanmak isteyebileceğiniz bazı takma adları buraya aldık:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Bu durumda, örneğin,  `git commit` yazmak yerine `git ci` yazmanız yeterli olacaktır. Git'i kullandıkça sık kullandığınız başka komutlar da olacaktır, o zaman o komutlar için de takma adlar oluşturabilirsiniz.

Bu teknik, eksikliğini hissettiğiniz komutları oluşturmakta da yararlı olabilir. Örneğin, bir dosyayı hazırlık alanından kaldırmak için yapılması gerekenleri yeni bir komut olarak tanımlayabilirsiniz:

	$ git config --global alias.unstage 'reset HEAD --'

Bu durumda şu iki komut eşdeğer olacaktır:

	$ git unstage fileA
	$ git reset HEAD fileA

Biraz daha temiz değil mi? Bir `last` komutu eklemek de oldukça yaygındır:

	$ git config --global alias.last 'log -1 HEAD'

Böylece son kaydı kolaylıkla görebilirsiniz:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Gördüğünüz gibi Git yeni komutu takma ad olarak belirlediğini şeyin yerine kullanıyor. Ama belki de bir Git komutu çalıştırmak değil de başka bir program kullanmak istiyorsunuz. Bu durumda komutun başına `!` karakterini koymalısınız. Bir Git yazılım havuzu üzerinde çalışan kendi araçlarınızı yazıyorsanız bu seçenek yararlı olabilir. Bunu göstermek için ,`gitk`'yi çalıştırmak için `git visual` diye yeni bir takma ad tanımlayabiliriz:

	$ git config --global alias.visual '!gitk'
