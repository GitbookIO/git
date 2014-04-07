# Membatalkan Apapun

Pada setiap tahapan, Anda mungkin ingin membatalkan sesuatu. Di sini, kita akan membahas beberapa alat dasar untuk membatalkan perubahan yang baru saja Anda lakukan. Harus tetap diingat bahwa kita tidak selalu dapat membatalkan apa yang telah kita batalkan. Ini adalah salah satu area dalam Git yang dapat membuat Anda kehilangan apa yang telah Anda kerjakan jika Anda melakukannya dengan tidak tepat.

## Merubah Commit Terakhir Anda

Salah satu pembatalan yang biasa dilakukan adalah ketika kita melakukan commit terlalu cepat dan mungkin terjadi lupa untuk menambah beberapa berkas, atau Anda salah memberikan pesan commit Anda. Jika Anda ingin untuk mengulang commit tersebut, Anda dapat menjalankan commit dengan opsi `--ammend`:

	$ git commit --amend

Perintah ini mangambil area stage Anda dan menggunakannya untuk commit. Jika Anda tidak melakukan perubahan apapun sejak commit terakhir Anda (seumpama, Anda menjalankan perintah ini langsung setelah commit Anda sebelumnya), maka snapshot Anda akan sama persis dengan sebelumnya dan yang Anda dapat ubah hanyalah pesan commit Anda.

Pengolah kata akan dijalankan untuk mengedit pesan commit yang telah Anda buat pada commit sebelumnya. Anda dapat ubah pesan commit ini seperti biasa, tetapi pesan commit sebelumnya akan tertimpa.

Sebagai contoh, jika Anda melakukan commit dan menyadari bahwa Anda lupa untuk memasukkan beberapa perubahan dalam sebuah berkas ke area stage dan Anda ingin untuk menambahkan perubahan ini ke dalam commit terakhir, Anda dapat melakukannya sebagai berikut:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend 

Ketiga perintah ini tetap akan bekerja di satu commit - commit kedua akan menggantikan hasil dari commit pertama.

## Mengeluarkan Berkas dari Area Stage

Dua seksi berikutnya akan menunjukkan bagaimana menangani area stage Anda dan perubahan terhadap direktori kerja Anda. Sisi baiknya adalah perintah yang Anda gunakan untuk menentukan keadaan dari kedua area tersebut juga mengingatkan Anda bagaimana membatalkan perubahannya. Sebagai contoh, mari kita anggap Anda telah merubah dua berkas dan ingin melakukan commit kepada keduanya sebagai dua perubahan terpisah, tetapi Anda secara tidak sengaja mengetikkan `git add *` dan memasukkan keduanya ke dalam area stage. Bagaimana Anda dapat mengeluarkan salah satu dari keduanya? Perintah `git status` mengingatkan Anda:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

Tepat di bawah tulisan "Changes to be committed", tercantum anjuran untuk menggunakan `git reset HEAD <file>` untuk mengeluarkan dari area stage. Mari kita gunakan anjuran tersebut untuk mengeluarkan berkas benchmarks.rb dari area stage:

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

Perintahnya terlihat agak aneh, tetapi menyelesaikan masalah. Berkas benchmarks.rb sekarang menjadi  terubah dan sudah berada di luar area stage.

## Mengembalikan Berkas Terubah

Apa yang terjadi jika Anda menyadari bahwa Anda tidak ingin menyimpan perubahan terhadap berkas benchmarks.rb? Bgaimana kita dapat dengan mudah mengembalikan berkas tersebut ke keadaan yang sama dengan saat Anda melakukan commit terakhir (atau saat awal menduplikasi, atau bagaimanapun Anda mendapatkannya ketika masuk ke direktori kerja Anda)? Untungnya, `git status` memberitahu Anda lagi bagaimana untuk melakukan hal itu. Pada contoh keluaran sebelumnya, area direktori kerja terlihat seperti berikut:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Terlihat secara eksplisit cara Anda dapat membuang perubahan yang telah Anda lakukan (paling tidak, hanya versi Git 1.6.1 atau yang lebih baru yang memperlihatkan cara ini - jika Anda memiliki versi yang lebih tua, kami sangat merekomendasikan untuk memperbaharui Git untuk mendapatkan fitur yang lebih nyaman digunakan). Mari kita lakukan apa yang tertulis di atas:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Anda dapat lihat bahwa perubahan telah dikembalikan. Anda juga seharusnya menyadari bahwa perintah ini juga berbahaya: perubahan apapun yang Anda buat di berkas tersebut akan hilang - Anda baru saja menyalin berkas lain ke perubahan Anda. Jangan pernah gunakan perintah ini kecuali Anda sangat yakin bahwa Anda tidak menginginkan berkas tersebut. Jika Anda hanya butuh untuk menyingkirkan perubahan untuk sementara, kita dapat bahas tentang penyimpanan (_to stash_) dan pencabangan (_to branch_) di bab berikutnya; kedua cara tersebut secara umum adalah cara yang lebih baik untuk dilakukan.

Ingat bahwa apapun yang dicommit di dalam Git dapat hampir selalu dikembalikan. Bahkan commit yang berada di cabang yang sudah terhapus ataupun commit yang sudah ditimpa dengan `commit --amend` masih dapat dikembalikan (lihat Bab 9 untuk penyelamatan data). Namun, apapun hilang yang belum pernah dicommit besar kumngkinannya tidak dapat dilihat kembali.
