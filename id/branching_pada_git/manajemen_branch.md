# Manajemen Branch

Sekarang anda telah membuat, menggabungkan, dan menghapus beberapa branch, mari kita lihat beberapa perangkat pengelolaan branch yang akan berguna ketika anda mulai menggunakan branch sepanjang waktu.

Perintah `git branch` melakukan tidak lebih dari sekedar membuat dan menghapus branch. Jika anda menjalankannya tanpa argument, anda mendapatkan daftar sederhana dari branch anda saat ini:

	$ git branch
	  iss53
	* master
	  testing

Perhatikan karakter `*` yang menjadi prefiks pada branch `master`: ini menunjukkan bahwa branch yang telah anda check-out saat ini. Ini berarti bahwa jika anda melakukan commit pada titik ini, branch `master` akan bergerak maju dengan pekerjaan baru anda. Untuk melihat commit terakhir pada setiap cabang, anda dapat menjalankan `git branch -v`:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Kegunaan lain dari mencari tahu di branch mana anda berada adalah untuk menyaring daftar ini hingga branch yang telah atau belum anda merge (gabungkan) ke branch yang dimana anda berada. Pilihan `--merged` dan `--no-merged` yang berguna telah tersedia di Git sejak versi 1.5.6 untuk tujuan ini. Untuk melihat branch mana yang sudah digabung ke dalam branch yang dimana anda berada, anda dapat menjalankan `git branch --merged`:

	$ git branch --merged
	  iss53
	* master

Karena anda sudah melakukan merge pada `iss53` sebelumnya, anda melihatnya dalam daftar anda. Branch yang berada dalam daftar ini tanpa `*` di depannya umumnya aman untuk dihapus dengan `git branch -d`; anda telah memadukan hasil kerja mereka ke branch lain, sehingga anda tidak akan kehilangan apa-apa.

Untuk melihat semua branch yang berisi pekerjaan yang belum anda merge (gabungkan), anda dapat menjalankan `git branch --no-merged`:

	$ git branch --no-merged
	  testing

Ini menunjukkan branch anda yang lainnya. Karena ini berisi pekerjaan yang belum digabungkan, jika anda mencoba untuk menghapusnya dengan `git branch -d` maka akan gagal:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Jika anda benar-benar ingin menghapus branch tersebut dan kehilangan pekerjaan yang ada disitu, anda dapat memaksakannya dengan `-D`, sebagaimana yang ditunjukkan oleh pesan bantuan.
