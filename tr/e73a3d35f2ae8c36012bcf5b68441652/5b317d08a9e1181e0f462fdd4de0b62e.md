# Dal Yönetimi

Dal yaratma, birleştirme ve silme işlemlerini yaptığımıza göre, gelin şimdi de dallar üzerinde çalışırken işimize yarayacak kimi dal yönetim araçlarına göz atalım.

`git branch` komutu dal yaratmak ve silmekten fazlasını yapar. Bu komutu hiçbir seçenek kullanmadan çalıştırırsanız, mevcut dallarınızın bir listesini görürsünüz:

	$ git branch
	  iss53
	* master
	  testing

`master` dalının önündeki `*` karakterine dikkatinizi çekmiştir: bu, o dalı seçmiş olduğunuzu (_checkout_) gösteriyor. Yani, bu noktada bir kayıt yapacak olursanız, yeni değişikliğiniz `master` dalını ileri götürecek. Her bir dalın en son kaydının ne olduğunu görmek isterseniz `git branch -v` komutunu çalıştırabilirsiniz:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Dallarınızın ne durumda olduğunu incelerken yararlı olacak bir başka şey de, hangi dalların üzerinde bulunduğunuz dalla birleştirilip hangisinin birleştirilmediğini görmek olabilir. `--merged` ve `--no-merge` seçenekleri Git'in 1.5.6 sürümünden itibaren kullanıma sunulmuştur. Hangi dalların üzerinde bulunduğunuz dalla birleştirilmiş olduğunu görmek için `git branch --merged` komutunu kullanabilirsiniz:

	$ git branch --merged
	  iss53
	* master

`iss53` dalını daha önce birleştirdiğiniz için listede görüyorsunuz. Bu listede önünde `*` olmayan dalları `git branch -d` komutuyla silebilirsiniz; onlardaki değişiklikleri zaten başka bir dalla birleştirdiğiniz için, herhangi bir kaybınız olmaz.

Henüz birleştirmediğiniz değişikliklerin bulunduğu dalları görmek için `git branch --no-merged` komutunu çalıştırabilirsiniz:

	$ git branch --no-merged
	  testing
Burada diğer dalı görüyorsunuz. Bu dalda henüz birleştirmediğiniz değişiklikler bulunduğu için `git branch -d` komutu hata verecektir:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Oradaki değişiklikleri kaybetmeyi göze alarak dalı her şeye rağmen silmek istiyorsanız, yukarıdaki çıktıda da belirtildiği gibi, `-D` seçeneğiyle üsteleyebilirsiniz.
