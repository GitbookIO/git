# Alur Kerja Branching

Sekarang dimana anda telah memiliki dasar-dasar branching dan merging, apa yang bisa atau harus anda lakukan dengannya? Pada bagian ini, kita akan membahas beberapa alur kerja umum yang menjadi mungkin dengan adanya proses branching yang ringan ini, sehingga anda dapat memutuskan apakah anda ingin memasukkannya ke dalam siklus pengembangan (development) anda.

## Branch Berjangka Lama (Long-Running Branches)

Karena Git menggunakan three-way merge yang sederhana, menggabungkan dari satu branch ke yang lainnya berkali-kali dalam jangka yang panjang umumnya mudah untuk dilakukan. Ini berarti anda dapat memiliki beberapa branch yang selalu terbuka dan yang anda gunakan untuk tahap yang berbeda dari siklus development anda; anda dapat melakukan merge secara regular atas beberapa dari mereka ke yang lainnya.

Banyak pengembang Git memiliki alur kerja yang mencakup pendekatan ini, seperti hanya memiliki kode yang sepenuhnya stabil dalam branch `master` mereka - mungkin hanya kode yang telah atau akan dirilis. Mereka memiliki branch paralel lain yang bernama `develop` atau `next` dimana mereka mengerjakan darinya atau menggunakannya untuk menguji stabilitas - belum tentu selalu stabil, namun setiap kali sampai ke keadaan stabil, branch dapat digabungkan ke `master`. Ini digunakan untuk melakukan pull dari topic branch (branch berumur pendek, seperti branch `iss53` anda sebelumnya) ketika mereka telah siap, untuk memastikan mereka lolos semua pengujian dan tidak memiliki bug (kesalahan).

Pada kenyataannya, kita sedang berbicara mengenai pointer yang bergerak menaiki garis commit yang anda buat. Branch yang stabil berada jauh di bawah garis histori dari commit anda, dan branch yang bersifat bleeding-edge berada di histori terdepan (lihat Gambar 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)
 
Gambar 3-18. Branch yang lebih stabil umumnya berada jauh di bawah histori commit.

Secara umum adalah lebih mudah untuk memikirkan mereka sebagaimana silo(?) bekerja, di mana sekumpulan commit naik ke tingkatan silo yang lebih stabil ketika mereka telah sepenuhnya diuji (lihat Gambar 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)
 
Gambar 3-19. Mungkin akan membantu untuk berpikir branch anda sebagai silo.

Anda dapat terus melakukan hal ini untuk beberapa tingkat stabilitas. Beberapa proyek yang lebih besar juga memiliki branch `proposed` atau `pu` (proposed updates) yang memiliki branch terintegrasi yang mungkin belum siap untuk masuk ke dalam branch `next` atau `master`. Idenya adalah bahwa branch anda berada pada berbagai tingkat stabilitas; ketika mereka mencapai tingkatan yang lebih stabil, mereka digabungkan ke dalam branch di atas mereka.
Sekali lagi, memiliki long-running branch tidaklah diperlukan, tetapi seringkali membantu, terutama ketika anda sedang berhadapan dengan proyek-proyek yang sangat besar atau kompleks.

## Branch Berjangka Pendek (Topic Branches)

Topic branch, bagaimanapun, berguna pada proyek-proyek untuk berbagai ukuran. Sebuah topic branch adalah branch berumur singkat yang anda buat dan gunakan untuk suatu fitur tertentu atau pekerjaan yang terkait. Ini adalah sesuatu yang mungkin tidak pernah anda lakukan dengan VCS sebelumnya karena biasanya terlalu memakan banyak untuk membuat dan menggabungkan branch. Tapi di Git adalah merupakan hal yang biasa untuk membuat, mengerjakan, menggabungkan, dan menghapus branch beberapa kali sehari.

Anda melihat ini dalam bagian terakhir pada branch `iss53` dan `hotfix` yang anda buat. Anda melakukan beberapa commit pada mereka dan langsung menghapus mereka setelah menggabungkan mereka ke dalam branch utama anda. Teknik ini memungkinkan Anda untuk beralih konteks dengan cepat dan seutuhnya — karena pekerjaan anda dipisahkan ke dalam silo-silo(?) dimana semua perubahan pada branch tersebut terkait dengan topik itu, menjadi lebih mudah untuk melihat apa yang telah terjadi selama review kode dan semacamnya. Anda dapat menyimpan perubahan di sana selama beberapa menit, hari, atau bulan, dan menggabungkan mereka di saat mereka sudah siap, terlepas dari urutan pembuatan atau pengerjaannya.

Kita ambil contoh berupa melakukan beberapa pekerjaan (pada `master`), branching untuk sebuah masalah (`iss91`), bekerja di atasnya untuk sesaat, melakukan branching kedua kalinya untuk mencoba cara lain dalam menangani hal yang sama (`iss91v2`), kembali ke branch master dan bekerja di sana untuk sementara, dan kemudian melakukan branching disana untuk melakukan beberapa pekerjaan yang anda belum yakin apakah ide itu baik (branch `dumbidea`). Histori dari commit anda akan terlihat seperti Gambar 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)
 
Gambar 3-20. Histori dari commit anda dengan beberapa topic branch.

Sekarang, katakanlah anda memutuskan anda suka solusi kedua atas masalah anda dibanding yang lain (`iss91v2`); dan anda menunjukkan branch `dumbidea` ke rekan kerja anda, dan tampak menjadi sesuatu yang jenius. Anda dapat membuang branch `iss91` yang asli (kehilangan commit C5 dan C6) dan menggabungkan dua lainnya. Histori anda kemudian tampak seperti Gambar 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)
 
Gambar 3-21. Histori anda setelah penggabungan dumbidea dan iss91v2.

Sangat penting untuk diingat ketika anda melakukan semua ini bahwa kesemua branch tersebut berada di lokal. Ketika anda melakukan branching dan merging, semuanya dilakukan hanya dalam repositori Git anda - tidak ada komunikasi yang terjadi dengan server.
