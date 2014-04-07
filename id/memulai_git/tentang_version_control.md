# Tentang Version Control

Apa itu version control, dan kenapa anda harus peduli? Version control adalah sebuah sistem yang mencatat setiap perubahan terhadap sebuah berkas atau kumpulan berkas sehingga pada suatu saat anda dapat kembali kepada salah satu versi dari berkas tersebut. Sebagai contoh dalam buku ini anda akan menggunakan kode sumber perangkat lunak sebagai berkas yang akan dilakukan version controlling, meskipun pada kenyataannya anda dapat melakukan ini pada hampir semua tipe berkas di komputer.

Jika anda adalah seorang desainer grafis atau desainer web dan anda ingin menyimpan setiap versi dari gambar atau layout yang anda buat (kemungkinan besar anda pasti ingin melakukannya), maka Version Control System (VCS) merupakan sebuah solusi bijak untuk digunakan. Sistem ini memungkinkan anda untuk mengembalikan berkas anda pada kondisi/keadaan sebelumnya, mengembalikan seluruh proyek pada keadaan sebelumnya, membandingkan perubahan setiap saat, melihat siapa yang terakhir melakukan perubahan terbaru pada suatu objek sehingga berpotensi menimbulkan masalah, siapa yang menerbitkan isu, dan lainnya. Dengan menggunakan VCS dapat berarti jika anda telah mengacaukan atau kehilangan berkas, anda dapat dengan mudah mengembalikannya. Ditambah lagi, anda mendapatkan semua ini dengan overhead yang sangat sedikit.

## Version Control System Lokal

Kebanyakan orang melakukan pengontrolan versi dengan cara menyalin berkas-berkas pada direktori lain (mungkin dengan memberikan penanggalan pada direktori tersebut, jika mereka rajin). Metode seperti ini sangat umum karena sangat sederhana, namun cenderung rawan terhadap kesalahan. Anda akan sangat mudah lupa dimana direktori anda sedang berada, selain itu dapat pula terjadi ketidak sengajaan penulisan pada berkas yang salah atau menyalin pada berkas yang bukan anda maksudkan.

Untuk mengatasi permasalahan ini, para programmer mengembangkan berbagai VCS lokal yang memiliki sebuah basis data sederhana untuk menyimpan semua perubahan pada berkas yang berada dalam cakupan revision control (Lihat Gambar 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)
 
Gambar 1-1. Diagram version control lokal.

Salah satu perkakas VCS yang populer adalah rcs, kakas ini masih didistribusikan dengan berbagai komputer pada masa kini. Bahkan sistem operasi Mac OS X menyertakan rcs ketika menginstal Developer Tools. Kakas ini pada dasarnya bekerja dengan cara menyimpan kumpulan patch dari satu perubahan ke perubahan lainnya dalam format khusus pada disk; ini kemudian dapat digunakan untuk menciptakan kembali wujud/keadaan suatu berkas pada suatu saat dengan cara menggunakan patch yang berkesesuaian dengan berkas dan waktu yang diinginkan.

## Version Control Systems Terpusat

Permasalahan berikutnya yang dihadapi adalah para pengembang perlu melakukan kolaborasi dengan pengembang pada sistem lainnya. Untuk mengatasi permasalahan ini maka dibangunlah Centralized Version Control Systems (CVCSs). Sistem ini, diantaranya CVS, Subversion, dan Perforce, memiliki sebuah server untuk menyimpan setiap versi berkas, dan beberapa klien yang dapat melakukan checkout berkas dari server pusat. Untuk beberapa tahun, sistem seperti ini menjadi standard untuk version control (lihat Gambar 1-2).


![](http://git-scm.com/figures/18333fig0102-tn.png)
 
Gambar 1-2. Diagram version control terpusat.

Sistem seperti ini memiliki beberapa kelebihan, terutama jika dibandingkan dengan VCS lokal. Misalnya, setiap orang pada tingkat tertentu mengetahui apa yang orang lain lakukan pada proyek. Administrator memiliki kendali yang mantap atas siapa yang dapat melakukan apa; dan adalah jauh lebih mudah untuk mengelola sebuah CVCS dibandingkan menangani database lokal pada setiap client.

Walau demikian, sistem dengan tatanan seperti ini memiliki kelemahan serius. Kelemahan nyata yang direpresesntasikan oleh sistem dengan server terpusat. Jika server mati untuk beberapa jam, maka tidak ada seorangpun yang bisa berkolaborasi atau menyimpan perubahan terhadap apa yang mereka telah kerjakan. Jika harddisk yang menyimpan basisdata mengalami kerusakan, dan salinan yang beran belum tersimpan, anda akan kehilangan setiap perubahan dari proyek kecuali snapshot yang dimiliki oleh setiap kolaborator pada komputernya masing-masing. VCS lokal juga mengalami nasib yang sama jika anda menyimpan seluruh history perubahan proyek pada satu tempat, anda mempunyai resiko kehilangan semuanya. 

## Version Control System Terdistribusi

Inilah saatnya bagi Distributed Version Control Systems untuk mengambil tempat. dalam sebuah DVCS (seperti Git, Mercurial, Bazaar atau Darcs), klien tidak hanya melakukan checkout untuk snapshot terakhir setiap berkas, namun mereka (klien) memiliki salinan penuh dari repositori tersebut. Jadi, jika server mati, dan sistem berkolaborasi melalui server tersebut, maka klien manapun dapat mengirimkan salinan repositori tersebut kembali ke server. Setiap checkout pada DVCS merupakan sebuah backup dari keseluruhan data (lihat Gambar 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)
 
Gambar 1-3. Diagram distributed version control.

Lebih jauh lagi, kebanyakan sistem seperti ini mampu menangani sejumlah remote repository dengan baik, jadi anda dapat melakukan kolaborasi dengan berbagai kelompok kolaborator dalam berbagai cara secara bersama-sama pada suatu proyek. Hal ini memungkinkan anda untuk menyusun beberapa jenis alur kerja yang tidak mungkin dilakukan pada sistem terpusat, seperti hierarchical model. 
