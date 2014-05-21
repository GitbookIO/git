# Mengambil Repositori Git

Anda dapat mengambil sebuah proyek Git melalui 2 pendekatan utama. Cara pertama adalah dengan mengambil proyek atau direktori tersedia untuk dimasukkan ke dalam Git. Cara kedua adalah dengan melakukan kloning/duplikasi dari repositori Git yang sudah ada dari server. 

## Memulai Repository di Direktori Tersedia

Jika Anda mulai memantau proyek yang sudah ada menggunakan Git, Anda perlu masuk ke direktori dari proyek tersebut dan mengetikkan

	$ git init

Git akan membuat sebuah subdirektori baru bernama .git yang akan berisi semua berkas penting dari repositori Anda, yaitu kerangka repositori dari Git. Pada titik ini, belum ada apapun dari proyek Anda yang dipantau. (Lihat Bab 9 untuk informasi lebih lanjut mengenai berkas apa saja yang terdapat di dalam direktori `.git` yang baru saja kita buat.)

Jika Anda ingin mulai mengendalikan versi dari berkas tersedia (bukan direktori kosong), Anda lebih baik mulai memantau berkas tersebut dengan melakukan commit awal. Caranya adalah dengan beberapa perintah `git add` untuk merumuskan berkas yang ingin anda pantau, diikuti dengan sebuah commit:

	$ git add *.c
	$ git add README
	$ git commit –m 'versi awal proyek'

Kita akan membahas apa yang dilakukan perintah-perintah di atas sebentar lagi. Pada saat ini, Anda sudah memiliki sebuah repositori Git berisi file-file terpantau dan sebuah commit awal.

## Duplikasi Repositori Tersedia

Jika Anda ingin membuat salinan dari repositori Git yang sudah tersedia — misalnya, dari sebuah proyek yang Anda ingin ikut berkontribusi di dalamnya — perintah yang Anda butuhkan adalah `git clone`. Jika Anda sudah terbiasa dengan sistem VCS lainnya seperti Subversion, Anda akan tersadar bahwa perintahnya adalah clone dan bukan checkout. Ini adalah pembedaan yang penting — Git menerima salinan dari hampir semua data yang server miliki. Setiap versi dari setiap berkas yang tercatat dalam sejarah dari proyek tersebut akan ditarik ketika Anda menjalankan `git clone`. Bahkan, ketika cakram di server Anda rusak, Anda masih dapat menggunakan hasil duplikasi di klien untuk mengembalikan server Anda ke keadaan tepat pada saat duplikasi dibuat (Anda mungkin kehilangan beberapa hooks atau sejenisnya yang sebelumnya telah ditata di sisi server, namun semua versi data sudah kembali seperti sediakala-lihat Bab 4 untuk lebih detil).

Anda menduplikasi sebuah repositori menggunakan perintah `git clone [url]`. Sebagai contoh, jika Anda ingin menduplikasi pustaka Git Ruby yang disebut Grit, Anda dapat melakukannya sebagai berikut:

	$ git clone git://github.com/schacon/grit.git

Perintah ini akan membuat sebuah direktori yang dinamakan "grit", menata awal sebuah direktori `.git` di dalamnya, menarik semua data dari repositori, dan `checkout` versi mutakhir dari salinan kerja. Jika Anda masuk ke dalam direktori `grit` tersebut, Anda akan melihat berkas-berkas proyek sudah ada di sana, siap untuk digunakan. Jika Anda ingin membuat duplikasi dari repositori tersebut ke direktori yang tidak dinamakan grit, Anda harus merumuskan namanya sebagai opsi di perintah di atas:

	$ git clone git://github.com/schacon/grit.git mygrit

Perintah ini bekerja seperti perintah sebelumnya, namun direktori tujuannya akan diberi nama mygrit.

Git memiliki beberapa protokol transfer yang berbeda yang dapat digunakan. Pada contoh sebelumnya, kita menggunakan protokol `git://`, tetapi Anda juga dapat menggunakan `http(s)://` atau `user@server:/path.git`, yang akan menggunakan SSH sebagai protokol transfer. Bab 4 akan memperkenalkan Anda kepada semua opsi yang tersedia yang dapat ditata di sisi server untuk mengakses repositori Git Anda dan keuntungan dan kelebihan dari masing-masing protokol.
