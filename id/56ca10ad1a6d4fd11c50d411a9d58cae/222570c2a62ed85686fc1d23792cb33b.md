# Bekerja Berjarak

Untuk dapat berkolaborasi untuk proyek Git apapun, Anda perlu mengetahui bagaimana Anda dapat mengatur repositori berjarak dari jarak jauh. Repositori berjarak adalah sekumpulan versi dari proyek Anda yang disiarkan di Internet atau di jaringan. Anda dapat memiliki beberapa repositori berjarak, masing-masing bisanya dengan akses terbatas untuk membaca saja ataupun baca/tulis. Berkolaborasi dengan pihak lain menuntut kemampuan untuk mengatur repositori berjarak ini dan menarik dan mendorong data ke dan dari repositori berjarak tersebut ketika Anda butuh untuk membagi hasil kerja Anda.

Mengatur repositori berjarak mencakup pengetahuan untuk menambah repositori berjarak, menghapus repositori yang sudah tidak berlaku, mengatur cabang-cabang berjarak dan mendefinisikan cabang-cabang tersebut sebagai terpantau atau tidak, dan seterusnya. Dalam bagian ini, kita akan membahas kemampuan manajemen jarak jauh ini.

## Melihat Repositori Berjarak Anda

Untuk melihat server berjarak mana yang telah Anda konfigurasikan, Anda dapat menjalankan perintah `git remote`. Perintah tersebut mendaftarkan nama pendek dari masing-masing handle berjarak yang telah Anda buat sebelumnya. Jika Anda menduplikasikan repositori Anda, Anda seharusnya paling tidak dapat melihat `origin` - yaitu nama standar yang diberikan Git untuk menunjuk ke server asal tempat Anda menduplikasi: 

	$ git clone git://github.com/schacon/ticgit.git
	Initialized empty Git repository in /private/tmp/ticgit/.git/
	remote: Counting objects: 595, done.
	remote: Compressing objects: 100% (269/269), done.
	remote: Total 595 (delta 255), reused 589 (delta 253)
	Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
	Resolving deltas: 100% (255/255), done.
	$ cd ticgit
	$ git remote 
	origin

Anda juga dapat mencantumkan `-v`, yang akan menampilkan kepada Anda URL yang telah Git simpan sebagai alamat lengkap dari nama pendek tempat server asal.

	$ git remote -v
	origin	git://github.com/schacon/ticgit.git

Jika Anda memiliki lebih dari satu server berjarak, perintah tersebut akan menampilkan semuanya. Sebagai contoh, repositori Grit tampak seperti berikut.

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

Ini berarti kita bisa menarik kontribusi dari pengguna manapun dengan cukup mudah. Tapi dapat dicatat bahwa hanya server berjarak `origin` yang menggunakan URL SSH, sehingga hanya itulah satu-satunya server yang dapat saya arahkan pendorongan (kita akan bahas kenapa hal ini terjadi di Bab 4).

## Menambah Repositori Berjarak

Saya telah menyinggung dan memberikan beberapa peragaan bagaimana menambah repositori berjarak di bagian sebelumnya, namun berikut adalah bagaimana untuk melakukannya secara eksplisit. Untuk menambah sebuah repositori berjarak Git yang baru sebagai sebuah nama pendek yang Anda dapat referensikan secara mudah, jalankan `git remote add [nama pendek] [url]`:

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Sekarang Anda apat menggunakan `pb` dalam baris perintah daripada menggunakan URL lengkapnya. Sebagai contoh, jika Anda ingin mengambil semua informasi yang dimiliki oleh Paul, tapi belum Anda miliki di repositori Anda, Anda dapat menjalankan `git fetch pb`:

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

Cabang master milik Paul sekarang dapat diakses di komputer Anda sebagai `pb/master` - Anda dapat menggabungkan cabang Paul ke dalam salah satu cabang Anda, atau Anda dapat melakukan `checkout` untuk mengaksesnya langsung sebagai cabang lokal jika Anda ingin menelitinya.

## Mengambil dan Menarik dari Repositori Berjarak

Sebagaimana yang telah Anda ketahui, untuk mengambil data dari proyek berjarak Anda, Anda dapat menjalankan:

	$ git fetch [remote-name]

Perintah tersebut akan diteruskan ke repositori berjarak dan menarik semua data yang belum Anda miliki dari sana. Setelah Anda melakukan ini, Anda akan memiliki referensi terhadap semua cabang yang ada di repositori berjarak tadi, yang kemudian dapat Anda gabungkan atau periksa kapanpun. (Kita akan bahas apa itu cabang dan bagaimana menggunakannya dengan lebih detil di Bab 3.)

Jika Anda menduplikasi sebuah repositori, perintah tersebut akan secara otomatis menambahkan repositori berjarak dengan nama `origin`. Jadi, `git fetch origin` akan mengambil semua hasil kerja baru yang sudah didorong ke server sejak Anda melakukan duplikasi (atau terakhir Anda mengambil). Penting untuk dicatat bahwa perintah `fetch` menarik semua data ke repositori lokal - perintah tersebut tidak secara otomatis menggabungkan hasil kerja baru dengan hasil kerja Anda atau mengubah apa yang sekarang sedang Anda kerjakan. Anda harus menggabungkannya secara manual ke dalam kerja Anda ketika Anda sudah siap.

Jika Anda memiliki cabang yang sudah tertata untuk memantau cabang berjarak (lihat bagian berikutnya dan bab3 untuk informasi lebih lanjut), Anda dapat menggunakan perintah `git pull` untuk secara otomatis mengambil dan menggabungkan cabang berjarak ke dalam cabang yang sekarang sedang aktif. Alur kerja ini mungkin lebih mudah atau lebih nyaman bagi Anda; dan secara standar, perintah `git clone` secara otomatis menata cabang master di lokal Anda untuk memantau cabang master di server berjarak tempat asal Anda menduplikasi (diasumsikan bahwa repositori berjarak memiliki cabang master). Menjalankan `git pull` secara umum mengambil data dari server tempat asal kita menduplikasi dan secara otomatis mencoba untuk menggabungkannya dengan kode yang sedang kita kerjakan saat ini.

## Mendorong ke Repositori Berjarak

Ketika proyek Anda sampai pada satu titik dimana Anda ingin membaginya, Anda harus mendorongnya ke server. Perintah untuk melakukan ini mudah: `git push [nama-berjarak] [nama-cabang]`. Jika Anda ingin mendorong cabang master ke server `origin` Anda (lagi, duplikasi secara umum menata nama-nama ini secara otomatis), maka Anda dapat menjalankan berikut ini untuk mendorong hasil kerja Anda kembali ke server:

	$ git push origin master

Perintah ini hanya bekerja jika Anda menduplikasi dari server dengan akses tulis terbuka bagi Anda dan jika belum ada orang yang mendorong sebelumnya. Jika Anda dan seorang lainnya menduplikasi secara bersamaan dan mereka mendorong ke server baru kemudian Anda, hasil kerja Anda akan segera ditolak. Anda perlu menarik hasil kerja mereka dahulu dan menggabungkannya dengan hasil kerja Anda sebelum Anda diperbolehkan untuk mendorong. Lihat Bab 3 untuk informasi lebih detil tentang bagaimana untuk mendorong ke server berjarak.

## Memeriksa Repositori Berjarak

Jika Anda ingin melihat informasi tertentu lebih lanjut tentang repositori berjarak, Anda dapat menggunakan perintah `git remote show [nama-remote]`. Jika Anda menjalankan perintah ini dengan nama pendek tertentu, sepertin `origin`, Anda akan mendapatkan seperti ini:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

Perintah ini akan memperlihatkan daftar URL dari repositori berjarak dan juga informasi cabang berjarak terpantau. Perintah tersebut juga membantu Anda melihat bahwa Anda berada di cabang master dan jika Anda menjalankan `git pull`, perintah tersebut akan secara otomatis menggabungkan dari cabang master berjarak setelah mengambil semua referensi dari sana. Perintah ini juga memperlihatkan daftar semua referensi yang sudah ditarik.

Ini adalah contoh sederhana yang paling mungkin Anda temui. Ketika Anda menggunakan Git lebih sering lagi, Anda makin dapat membaca lebih banyak lagi informasi yang keluar dari `git remote show`:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Perintah ini menunjukkan cabang mana yang secara otomatis terdorong ketika Anda menjalankan `git push` di cabang-cabang tertentu. Yang juga ditunjukkan adalah cabang berjarak di server yang belum Anda miliki, cabang berjarak yang Anda miliki namun telah terhapus di server, dan beberapa cabang yang secara otomatis akan digabungkan ketika Anda menjalankan `git pull`.

## Menghapus dan Mengganti Nama Repositori Berjarak

Jika Anda ingin mengganti nama sebuah referensi, pada Git versi baru Anda dapat menjalankan `git remote rename` untuk mengganti nama pendek dari repositori berjarak. Sebagai contoh, jika Anda ingin mengganti nama `pb` menjadi `paul`, Anda dapat melakukannya dengan perintah `git remote rename`:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Patut disinggung juga bahwa hal ini merubah nama cabang berjarak Anda juga. Apa yang biasanya dapat direferensikan sebagai `pb/master` saat ini berada di `paul/master`.

Jika Anda ingin untuk menghapus sebuah referensi untuk alasan tertentu - Anda memindahkan servernya atau tidak lagi menggunakan mirror tertentu, atau mungkin seorang kontributor tidak lagi berkontribusi - Anda dapat menggunakan `git remote rm`:

	$ git remote rm paul
	$ git remote
	origin
