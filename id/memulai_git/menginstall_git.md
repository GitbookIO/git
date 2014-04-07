# Menginstall Git

Mari memulai menggunakan Git. Pertama, tentu saja anda harus menginstallnya terlebih dahulu. Anda dapat melakukan melalui berbagai cara; dua cara paling poluler adalah menginstallnya dari kode sumbernya atau menginstalkan paket yang telah disediakan untuk platform anda.

## Menginstall Dari Kode Sumber

Jika anda dapat melakukannya, akan sangat berguna untuk dapat menginstallnya dari kode sumber, karena anda akan mendapatkan versi terbaru dari Git. Setiap versi dari Git cenderung akan menampilkan kemajuan pada sisi antarmuka pengguna, jadi menggunakan versi terbaru seringkali menjadi jalan terbaik jika anda terbiasa melakukan kompilasi perangkat lunak dari kode sumbernya. Dan juga menjadi masalah bahwa banyak distribusi Linux yang menyertakan versi Git yang sangat lama; kecuali anda mempergunakan distribusi Linux paling up-to-date atau menggunakan backport, menginstall dari kode sumbernya mungkin menjadi solusi terbaik.

Untuk menginstall Git, anda membutuhkan beberapa library yang dibutuhkan oleh Git: curl, zlib, openssl, expat, dan libiconv. Sebagai contoh, jika anda berada pada sistem yang menggunakan yum (seperti Fedora) atau apt-get (seperti sistem berbasis Debian), anda dapat menggunakan salah satu dari perintah berikut untuk menginstall semua library yang dibutuhkan oleh Git:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev

Setelah anda memperoleh semua library yang dibutuhkan, anda kemudian dapat melanjutkan dengan mengunduh Git dari situsnya:

	http://git-scm.com/download
	
Kemudian, kompilasi dan install:

	$ tar -zxf git-1.6.0.5.tar.gz
	$ cd git-1.6.0.5
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Setelah semua ini selesai, anda juga dapat memperoleh Git terbaru melalui Git sendiri:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	
## Menginstall Git di Linux

Jika anda ingin menginstall Git di Linux menggunakan installer biner, anda bisa melakukannya melalui perkakas manajemen paket yang anda pada distribusi Linux yang anda gunakan. Jika anda menggunakan Fedora, anda dapat menggunakan yum:

	$ yum install git-core

Atau jika anda menggunakan distro berbasis Debian seperti Ubuntu, coba gunakan apt-get:

	$ apt-get install git

## Menginstall Git pada Mac

Terdapat dua cara mudah untuk menginstal Git pada sebuah komputer Mac. Cara termudah adalah menggunakan installer Git berbasis GUI, yang dapat anda peroleh dari halaman Google Code (lihat Gambar 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)
 
Gambar 1-7. Git OS X installer.

Cara lainnya adalah dengan menggunakan MacPorts (`http://www.macports.org`). Jika anda telah menginstall MacPorts, maka anda dapat menginstall Git melalui cara berikut

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Anda tidak harus menambahkan extras-nya, tetapi anda mungkin membutuhkan +svn jika anda harus menggunakan Git pada repositori Subversion (lihat Bab 8).

## Menginstall pada Sistem Operasi Windows

Menginstall Git pada Windows sangatlah mudah. Cara termudah dapat anda peroleh dengan menggunakan msysGit. Cukup download file installernya dari halaman GitHub, lalu eksekusi.

	http://msysgit.github.com/

Setelah terinstall, anda akan memperoleh versi command-line (bersama dengan klien SSH yang praktis) dan versi GUI-nya.
