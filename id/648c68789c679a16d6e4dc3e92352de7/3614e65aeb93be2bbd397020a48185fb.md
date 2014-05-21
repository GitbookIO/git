# Apakah Branch Itu

Untuk benar-benar mengerti cara Git melakukan branching, kita perlu kembali ke belakang dan membahas bagaimana Git menyimpan datanya. Seperti yang mungkin anda ingat dari Bab 1, Git tidak menyimpan data sebagai serangkaian kumpulan perubahan atau delta, melainkan sebagai serangkaian snapshot.

Ketika anda melakukan commit dalam Git, Git menyimpan sebuah object commit yang berisi pointer ke snapshot dari konten yang anda staged, metadata pembuat (author) dan pesan (message), dan nol atau lebih pointer ke commit yang merupakan parent (induk) langsung dari commit ini: nol jika ini commit yang pertama, satu jika ini commit yang normal, dan beberapa jika ini commit yang dihasilkan dari gabungan antara dua atau lebih branch.

Untuk memvisualisasikan ini, mari kita asumsikan anda memiliki direktori yang berisi tiga buah berkas, dan anda menambahkan mereka ke stage dan melakukan commit. Proses staging berkas melakukan checksum (dengan hash SHA-1 yang telah kita sebutkan di Bab 1), menyimpan versi berkas tersebut dalam repositori Git (Git merujuknya sebagai 'blobs'), dan menambahkan checksum tersebut ke staging area:

	$ git add README test.rb LICENSE
	$ git commit -m 'initial commit of my project'

Ketika anda membuat commit dengan menjalankan `git commit`, Git melakukan checksum pada setiap subdirektori (dalam kasus ini, hanya direktori root dari proyek) dan menyimpan object tree tersebut dalam repositori Git. Git kemudian membuat object commit yang memiliki metadata dan pointer ke root dari project tree sehingga dapat membuat kembali snapshot tersebut bila diperlukan.

Repositori Git anda sekarang berisi lima object: satu blob untuk setiap tiga berkas, satu tree yang berisi daftar isi direktori dan menentukan mana nama berkas yang disimpan blob, dan satu commit dengan pointer menunjuk ke root dari tree dan semua metadata dari commit. Secara konseptual, data dalam repositori Git anda tampak seperti Gambar 3-1.


![](http://git-scm.com/figures/18333fig0301-tn.png)
 
Gambar 3-1. Data repositori dari satu commit.

Jika anda membuat beberapa perubahan dan melakukan commit lagi, commit berikutnya menyimpan pointer ke commit yang sebelumnya. Setelah dua commit berikutnya, historinya akan terlihat seperti Gambar 3-2.


![](http://git-scm.com/figures/18333fig0302-tn.png)
 
Gambar 3-2. Object data dari Git untuk beberapa kali commit.

Sebuah branch (cabang) di Git secara sederhana hanyalah pointer yang dapat bergerak ke salah satu commit. Nama default dari branch dalam Git adalah `master`. Ketika anda membuat commit di awal, anda diberikan sebuah branch master yang menunjuk ke commit terakhir yang anda buat. Setiap kali anda melakukan commit, ia bergerak maju secara otomatis.


![](http://git-scm.com/figures/18333fig0303-tn.png)
 
Gambar 3-3. Branch menunjuk ke histori data commit.

Apa yang terjadi jika anda membuat branch (cabang) baru? Nah, melakukan hal tersebut menciptakan sebuah pointer baru untuk bergerak. Katakanlah anda membuat branch baru yang bernama `testing`. Anda melakukan ini dengan perintah `git branch`:

	$ git branch testing

Hal ini menciptakan sebuah pointer (penunjuk) baru pada commit yang sama dengan yang saat ini anda berada (lihat Gambar 3-4).


![](http://git-scm.com/figures/18333fig0304-tn.png)

Gambar 3-4. Beberapa branch menunjuk ke histori data commit.

Bagaimana Git tahu di branch mana anda berada saat ini? Git menyimpan sebuah pointer khusus yang disebut HEAD. Perhatikan bahwa ini adalah jauh berbeda dari konsep HEAD di VCS lain yang mungkin pernah anda gunakan, seperti Subversion atau CVS. Dalam Git, HEAD ini adalah pointer ke branch lokal anda saat ini. Dalam kasus ini, anda masih berada di master. Perintah git branch hanya menciptakan sebuah branch baru — namun tidak dengan serta-merta beralih ke branch itu (lihat Gambar 3-5).


![](http://git-scm.com/figures/18333fig0305-tn.png)
 
Gambar 3-5. Berkas HEAD menunjuk ke branch dimana anda berada.

Untuk beralih ke branch yang telah ada, anda dapat menjalankan perintah `git checkout`. Mari kita beralih ke branch testing yang baru saja dibuat:

	$ git checkout testing

Ini memindahkan HEAD untuk menunjuk ke branch testing (lihat Gambar 3-6).


![](http://git-scm.com/figures/18333fig0306-tn.png)

Gambar 3-6. HEAD menunjuk ke branch lain ketika anda berpindah branch.

Apa pentingnya itu? Baiklah, mari kita lakukan commit lain:

	$ vim test.rb
	$ git commit -a -m 'made a change'

Gambar 3-7 mengilustrasikan hasilnya.


![](http://git-scm.com/figures/18333fig0307-tn.png)
 
Gambar 3-7. Branch yang ditunjuk oleh HEAD bergerak maju pada setiap kali commit.

Hal ini menarik, karena sekarang branch testing anda telah bergerak maju, tetapi cabang master anda masih menunjuk ke commit dimana disitu anda menjalankan `git checkout` untuk beralih branch. Mari kita beralih kembali ke branch master:

	$ git checkout master

Gambar 3-8 memperlihatkan hasilnya.


![](http://git-scm.com/figures/18333fig0308-tn.png)
 
Gambar 3-8. HEAD bergerak ke branch lain ketika checkout.

Perintah tersebut melakukan dua hal. Ia memindahkan pointer HEAD kembali menunjuk ke branch master, dan ia mengembalikan berkas-berkas dalam direktori kerja anda kembali ke snapshot yang ditunjuk oleh master. Ini juga berarti perubahan yang anda lakukan dari titik ini ke depan akan berubah arah dari versi lama dari proyek. Hal ini pada dasarnya melakukan pemutaran balik pekerjaan yang anda lakukan dalam branch testing anda untuk sementara sehingga anda dapat pergi ke arah yang berbeda.

Mari buat sedikit perubahan dan lakukan commit lagi:

	$ vim test.rb
	$ git commit -a -m 'made other changes'

Sekarang histori proyek anda telah berubah arah (lihat Gambar 3-9). Anda membuat dan beralih ke suatu branch, melakukan beberapa pekerjaan di atasnya, dan kemudian beralih kembali ke branch utama anda dan melakukan pekerjaan lain. Kedua perubahan itu terisolasi dalam branch terpisah: anda dapat beralih antara branch dan menggabungkan (merge) mereka bersama-sama ketika anda siap. Dan anda melakukan semua itu dengan perintah `branch` dan `checkout` yang sederhana.


![](http://git-scm.com/figures/18333fig0309-tn.png)
 
Gambar 3-9. Histori dari branch yang berubah arah.

Karena sebuah branch di Git dalam kenyataannya adalah sebuah berkas sederhana yang berisi 40 karakter SHA-1 checksum dari commit yang dituju, adalah hal yang murah untuk menciptakan dan menghancurkan branch. Membuat branch baru adalah sama cepatnya dan sama sederhananya seperti menulis 41 byte ke sebuah berkas (40 karakter dan sebuah newline).

Hal ini kontras dengan cara yang dilakukan banyak VCS dalam branch, yang butuh menyalin semua berkas proyek ke direktori kedua. Ini dapat memakan waktu beberapa detik atau bahkan menit, tergantung pada ukuran proyek, sedangkan dalam Git proses ini selalu seketika. Dan lagi, karena kita merekam parent (induk) ketika melakukan commit, mencari dasar penggabungan yang tepat untuk menggabungkan dilakukan secara otomatis bagi kita dan biasanya sangat mudah dilakukan. Fitur-fitur ini membantu mendorong pengembang (developer) untuk membuat dan menggunakan cabang secara sering.

Mari kita lihat mengapa anda harus melakukannya.
