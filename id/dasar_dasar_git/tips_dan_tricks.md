# Tips dan Tricks

Sebelum kita menyelesaikan bab tentang dasar-dasar Git ini, beberapa tips dan triks dapat membuat pengalaman Git Anda lebih sederhana, mudah, atau bahkan akrab. Banyak orang menggunakan Git tanpa menggunakan tip-tip berikut ini, dan kami tidak akan merujuk kepada mereka atau mengasumsikan bahwa Anda telah menggunakannya nanti dalam buku ini; tetapi Anda mungkin sebaiknya mengetahui bagaimana menggunakannya.

## Auto-Completion

Jika Anda menggunakan Bash shell, Git tersedia dengan sebuah script auto-completion yang dapat Anda hidupkan. Unduh source-code Git, dan cari direktori `contrib/completion`; di sana Anda akan menemukan berkas bernama `git-completion.bash`. Salin berkas ini ke direktori home Anda, dan tambahakn ini ke dalam berkas `.bashrc`:

	source ~/.git-completion.bash

Jika Anda ingin memasang Git agar secara otomatis menggunakan fitur ini bagi semua pengguna, salin script tadi ke direktori `/opt/local/etc/bash_completion.d` di sistem Mac atau ke direktori `/etc/bash_completion.d/` di sistem Linux. Ini adalah direktori tempat script yang akan secara otomatis dibaca oleh Bash untuk menyediakan fitur auto-complete nya.

Jika Anda menggunakan Windows dengan Git Bash, yang sebetulnya adalah setting default ketika instalasi Git di Windows menggunakan msysGit, fitur ini seharusnya sudah terkonfigurasi.

Pencet huruf Tab ketika Anda menuliskan perintah Git, dan Bash akan menampilkan beberapa kemungkinan yang Anda dapat pilih:

	$ git co<tab><tab>
	commit config

Dalam hal ini, mengetikkan `git co` dan memencet kunci Tab 2x akan menampilkan pilihan commit dan config. Dengan menambahkan `m<tab>` akan melengkapi `git commit` secara otomatis.
	
Hal ini juga bekerja terhadap opsi, yang mungkin lebih berguna. Sebagai contoh, jika Anda menjalankan perintah `git log` dan tidak ingat salah satu dari opsi yang tersedia, Anda dapat mulai mengetikkannya dan memencet Tab untuk melihat apa yang cocok:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Ini adalah trick yang cukup menarik dan dapat menghemat waktu Anda dan waktu membaca dokumentasi.

## Git Alias

Git tidak mengasumsikan perintah Anda jika Anda mengetikkannya sebagian. Jika Anda tidak ingin mengetikkan seluruh text dari setiap perintah Git, Anda dapat dengan mudah memasang alias dari setiap perintah menggunakan perintah `git config`. Berikut adalah beberapa contoh yang Anda mungkin ingin tata:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Ini berarti bahwa, sebagai contoh, daripada mengetikkan `git commit`, Anda hanya butuh untuk mengetikkan `git ci`. Sejalan dengan Anda menggunakan Git, Anda akan mungkin menggunakan perintah lain sama seringnya; dalam hal ini, jangan ragu untuk membuat alias-alias baru.

Teknik ini juga akan berguna dalam pembuatan perintah yang Anda pikir harus ada. Sebagai contoh, untuk mengkoreksi masalah kemudahan penggunaan (usability) yang Anda temukan dalam pengeluaran berkas dari area stage, Anda dapat menambahkan alias ini ke dalam Git:

	$ git config --global alias.unstage 'reset HEAD --'

Hal ini akan membuat kedua perintah berikut sama:

	$ git unstage fileA
	$ git reset HEAD fileA

Tampak lebih terbaca. Biasa juga untuk menambahkan perintah `last` sebagai berikut:

	$ git config --global alias.last 'log -1 HEAD'

Dengan demikian, Anda dapat melihat commit terakhir dengan lebih mudah:
	
	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Sebagaimana yang dapat Anda katakan, Git secara sederhana menggantikan perintah-perintah baru dengan apapun yang Anda alias kan. Namun demikian, mungkin Anda ingin menjalankan perintah eksternal, dan bukannya Git subcommand. Dalam kasus ini, Anda dapat mulai perintahnya dengan karakter `!`. Hal ini berguna jika Anda ingin membuat alat Anda sendiri yang bekerja terhadap repositori Git. Kita dapat mendemokannya dengan membuat alias `git visual` untuk menjalankan `gitk`:

	$ git config --global alias.visual '!gitk'
