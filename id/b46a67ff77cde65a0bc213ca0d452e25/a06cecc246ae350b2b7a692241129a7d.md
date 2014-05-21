# Setup Git Untuk Pertama Kalinya

Sekarang anda telah memiliki Git pada sistem anda, berikutnya anda akan harus melakukan beberapa penyesuai pada lingkungan Git anda. Anda hanya perlu melakukan hal ini sekali saja; pada saat memperbaharui versi Git anda, penyesuai tidak perlu dilakukan lagi. Anda pun dapat mengubah penyesuaian tersebut setiap saat.

Pada Git terdapat sebuah perkakas yang disebut dengan git config yang memungkinkan anda untuk memperoleh informasi dan menetapkan variable konfigurasi yang mengontrol segala aspek bagaimana Git beroperasi dan berperilaku. Variable-variable ini dapat disimpan pada tiga tempat berbeda:

*	`/etc/gitconfig` file: Menyimpan berbagai nilai-nilai variable untuk setiap pengguna pada sistem dan semua repositori milik para pengguna tersebut. Jika anda memberikan opsi `--system` pada `git config`, maka Git akan membaca dan menulis file konfigurasi ini secara spesifik.
*	`~/.gitconfig` file: Spesifik hanya untuk pengguna yang bersangkutan. Anda dapat membuat Git membaca dan menulis pada berkas ini secara spesifik dengan memberikan opsi `--global`. 
*	config file pada direktori git (yaitu, `.git/config`) atau reposotori manapun yang sedang anda gunakan: Spesifik hanya pada repositori itu saja. Setiap nilai pada setiap tingkat akan selalu menimpa nilai yang telah ditetapkan pada level sebelumnya, jadi nilai yang telah di-set pada `.git/config` akan menimpa nilai yang telah di-set pada `/etc/gitconfig`.

Pada Sistem Operasi Windows, Git akan mencari berkas `.gitconfig` pada direktori `$HOME` (`C:\Documents and Settings\$USER` untuk kebanyakan kasus). Selain itu juga akan mencari /etc/gitconfig, direktori ini relatif terhadap direktori root MSys, yang mana tergantung dari direktori yang dipilih saat anda menginstall Git pada Windows anda.

## Identitas Anda

Hal pertama yang harus anda lakukan ketika menginstalkan Git adalah mengatur username dan alamat e-mail anda. Hal ini penting karena setiap commit pada Git akan menggunakan informasi ini, dan informasi ini akan selamanya disimpan dengan commit yang anda buat tersebut:

	$ git config --global user.name "John Doe"
	$ git config --global user.email johndoe@example.com

Lagi-lagi, anda hanya perlu melakukan ini sekali saja jika anda menggunakan opsi `--global`, karena Git akan selalu menggunakan informasi tersebut selama anda berada pada sistem yang sama. Jika anda ingin menimpa informasi ini dengan menggunakan e-mail atau username yang berbeda untuk proyek tertentu, anda dapat perintah tersebut tanpa menggunakan opsi `--global` ketika anda berada pada proyek tersebut.

## Editor Anda

Sekarang identitas anda telah siap, berikutnya anda dapat memilih text editor default yang akan digunakan manakala Git membutuhkan anda untuk menulis sebuah pesan. Secara default, Git akan menggunakan default editor sesuai dengan sistem operasi, biasanya adalah Vi atau Vim pada sistem Unix. Jika anda ingin menggunakan text editor yang lainnya, seperti Emacs, anda dapat melakukan perintah seperti berikut:

	$ git config --global core.editor emacs
	
## Perkakas Diff Anda

Opsi lainnya yang mungkin berguna dan mungkin ingin anda ubah adalah perkakas diff yang digunakan untuk menyelesaikan konflik yang terjadi ketika dilakukannya merge (penggabungan). Katakanlah anda ingin menggunakan vimdiff:

	$ git config --global merge.tool vimdiff

Git dapat menggunakan berbagai perkakas diff ini diantaranya kdiff3, tkdiff, meld, xxdiff, emerge, vimdiff, gvimdiff, ecmerge, dan opendiff. Anda pun dapat menggunakan perkakas kastem; lihat Bab 7 untuk informasi lebih jauh lagi mengenai hal tersebut.

## Mengecek Settingan Anda

Jika anda ingin mengecek settingan anda, anda dapat menggunakan peritah `git config --list` untuk menampilkan semua settingan yang digunakan Git:

	$ git config --list
	user.name=Scott Chacon
	user.email=schacon@gmail.com
	color.status=auto
	color.branch=auto
	color.interactive=auto
	color.diff=auto
	...

Anda mungkin akan melihat beberapa variable yang ditampilkan lebih dari sekali, hal ini terjadi karena variable yang sama diperoleh dari beberapa file konfigurasi berbeda (misalnya, `/etc/gitconfig` dan `~/.gitconfig`). Pada kasus seperti ini, Git hanya akan menggunakan nilai yang terlihat paling akhir saja.

Andapun dapat melihat apa nilai yang Git pergunakan untuk suatu variable secara spesifik dengan mengunakan `git config {key}`:

	$ git config user.name
	Scott Chacon
