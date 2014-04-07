# Değişiklikleri Geri Almak

Herhangi bir noktada yaptığınız bir değişikliği geri almak isteyebilirsiniz. Burada yapılan değişiklikleri geri almakta kullanılabilecek bazı araçları inceleyeceğiz. Dikkatli olun, zira geri alınan bu değişikliklerden bazılarını yeniden gerçekleştiremeyebilirsiniz. Bu, eğer bir hata yaparsanız, bunu Git'i kullanarak telafi edemeyeceğiniz, az sayıda alanından biridir.

## Son Kayıt İşlemini Değiştirmek

Eğer kaydı çok erken yapmışsanız, bazı dosyaları eklemeyi unutmuşsanız ya da kayıt mesajında hata yapmışsanız, sık rastlanan düzeltme işlemlerinden birini kullanabilirsiniz. Kaydı değiştirmek isterseniz, `commit` komutunu `--amend` seçeneğiyle çalıştırabilirsiniz:

	$ git commit --amend

Bu komut, hazırlık alanındaki değişiklikleri alıp bunları kaydı değiştirmek için kullanır. Eğer son kaydınızdan beri hiçbir değişiklik yapmamışsanız (örneğin, bu komutu yeni bir kayıt yaptıktan hemen sonra çalıştırıyorsanız) o zaman kaydınızın bellek kopyası aynı kalacak ve değiştireceğiniz tek şey kayıt mesajı olacaktır.

Aynı kayıt mesajı editörü açılır, fakat editörde bir önceki kaydın kayıt mesajı görünür. Mesajı her zamanki gibi değiştirebilirsiniz, ama bu yeni kayıt mesajı öncekinin yerine geçecektir.

Söz gelimi, eğer bir kayıt sırasında belirli bir dosyada yaptığınız değişiklikleri kayda hazırlamayı unuttuğunuzu fark ederseniz, şöyle bir şey yapabilirsiniz:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend

Bu üç komuttan sonra, tarihçenize tek bir kayıt işlenmiştir —son kayıt öncekinin yerine geçer.

## Kayda Hazırlanmış Bir Dosyayı Hazırlık Alanından Kaldırmak

Bu iki alt bölüm kayda hazırlık alanındaki ve çalışma klasörünüzdeki değişiklikleri nasıl idare edeceğinizi gösteriyor. İşin güzel yanı, bu iki alanın durumunu öğrenmek için kullanacağınız komut aynı zamanda bu alanlardaki değişiklikleri nasıl geri alabileceğinizi de hatırlatıyor. Diyelim ki iki dosyayı değiştirdiniz ve bu iki değişikliği ayrı birer kayıt olarak işlemek istiyorsunuz, ama yanlışlıkla `git add *` komutunu kullanarak ikisini birden hazırlık alanına aldınız. Bunlardan birini nasıl hazırlık alanından çıkarabilirsiniz? `git status` komutu size bunu da anımsatıyor:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

“Changes to be committed” yazısının hemen altında "use `git reset HEAD <file>...` to unstage" yazdığını görüyoruz. `benchmarks.rb` dosyasını bu öneriye uygun olarak hazırlık alanından kaldıralım:

	$ git reset HEAD benchmarks.rb
	benchmarks.rb: locally modified
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Komut biraz tuhaf, ama iş görüyor. `benchmarks.rb` dosyası hazırlık alanından kaldırıldı ama hâlâ değişmiş olarak görünüyor.

## Değişmiş Durumdaki Bir Dosyayı Değişmemiş Duruma Geri Getirmek

Peki `benchmarks.rb` dosyasındaki değişiklikleri korumak istemiyorsanız? Yaptığınız değişiklikleri kolayca nasıl geri alacaksınız —son kayıtta nasıl görünüyorsa o haline (ya da ilk klonlandığı haline, yahut çalışma klasörünüze ilk aldığınız haline) nasıl geri getireceksiniz? Neyse ki `git status` komutu bunu nasıl yapacağınızı da söylüyor. Son örnek çıktıda hazırlık alanı dışındaki değişiklikler şöyle görünüyor:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Yaptığınız değişiklikleri nasıl çöpe atabileceğinizi açıkça söylüyor (en azından Git'in 1.6.1'le başlayan yeni sürümleri bunu yapıyor —eğer daha eski bir sürümle çalışıyorsanız, kolaylık sağlayan bu özellikleri edinebilmek için programı güncellemenizi öneririz). Gelin, söyleneni yapalım:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Gördüğünüz gibi değişiklikler çöpe atıldı. Bunun tehlikeli bir komut olduğunu aklınızdan çıkarmayın: o dosyaya yaptığınız bütün değişiklikler şimdi yok oldu —dosyanın üstüne yeni bir dosya kopyaladınız. Eğer dosyadaki değişiklikleri istemediğinizden yüzde yüz emin değilseniz asla bu komutu kullanmayın. Eğer sorun bu dosyada yaptığınız değişikliklerin başka işlemler yapmanıza engel olması ise bir sonraki bölümde ele alacağımız zulalama (_stash_) ve dallandırma (_branch_) işlemlerini kullanmanız daha iyi olacaktır.

Unutmayın, Git'te kaydedilmiş her şey neredeyse her zaman kurtarılabilir. Silinmiş dallardaki kayıtlar ve hatta `--amend` seçeneğiyle üzerine yazılmış kayıtlar bile kurtarılabilirler (veri kurtarma konusunda bkz. _9. Bölüm_). Diğer taraftan, kaydedilmemiş bir değişikliği kaybederseniz büyük olasılıkla onu kurtarmanız mümkün olmaz.
