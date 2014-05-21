# Menandai

Seperti kebanyakan VCS, Git memiliki kemampuan untuk menandai titik tertentu dalam sejarah sebagai sesuatu yang penting. Biasanya, orang menggunakan fungsi ini untuk menandai titik-titik pelepasan (v1.0, dan seterusnya). Pada bagian ini, Anda akan belajar untuk melihat tanda-tanda yang telah ada, bagaimana membuat tanda baru, dan perbedaan dari beberapa tipe tanda.

## Melihat Daftar Tanda Anda

Melihat daftar tanda yang sudah ada di GIT tidak berbelit-belit. Ketikkan `git tag`:

	$ git tag
	v0.1
	v1.3

Perintah ini memperlihatkan tanda-tanda yang diurutkan secara alfabetis; urutan yang terlihat ini tidak memiliki kepentingan nyata tertentu.

Anda dapat juga mencari tanda dengan pola tertentu. Repositori kode Git, sebagai contoh, mengandung lebih dari 240 tanda. Jika Anda hanya tertarik untuk melihat seri dari 1.4.2, Anda dapat menjalankan:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Membuat Tetanda

Git membagi tetanda dalam 2 tipe utama: ringan dan bercatatan. Tipe tetanda ringan sangat mirip dengan sebuah cabang yang tidak pernah berubah - tetanda hanya sebagai penunjuk ke commit tertentu. Di lain pihak, tipe tetanda bercatatan disimpan sebagai obyek penuh di dalam basis data Git. Tetanda ini di-checksum; mengandung nama penanda, email dan tanggal; memiliki pesan penandaan; dan dapat ditandatangani dan diverifikasi menggunakan GNU Privacy Guard (GPG). Anda pada umumnya direkomendasikan untuk membuat tetanda bercatatan sehingga Anda dapat memiliki semua informasi ini; tetapi jika Anda hanya menginginkan tetanda sementara atau untuk alasan tertentu tidak ingin menyimpan informasi lain yang lebih detil, tetanda ringan juga tersedia.

## Tetanda Bercatatan

Membuat sebuah tetanda bercatatan dalam Git adalah mudah. Cara termudah adalah dengan menggunakan parameter `-a` ketika Anda menjalankan perintah `tag`:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

Parameter `-m` untuk mendefinikasn pesan penandaan, yang disimpan bersamaan dengan tanda. Jika Anda tidak mencantumkan pesan untuk tanda bercatatan, Git akan menjalankan editor Anda sehingga Anda dapat mengetikkannya di sana.

Anda dapat melihat data dari tanda tadi beserta commit yang ditandainya dengan menggunakan perintah `git show`:

	$ git show v1.4
	tag v1.4
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 14:45:11 2009 -0800

	my version 1.4
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Terlihat informasi penanda, tanggal dilakukan penandaan terhadap commit, dan catatan sebelum Git menampilkan informasi commitnya.

## Tetanda Tertandatangani

Anda dapat juga menandatangani tetanda Anda menggunakan GPG, diasumsikan bahwa Anda telah memiliki kunci pribadi (private key). Yang perlu Anda lakukan adalah mengganti `a` dengan `-s`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Jika Anda menjalankan `git show` terhadap tag tadi, Anda akan melihat tanda tangan GPG Anda terlampir di sana:

	$ git show v1.5
	tag v1.5
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:22:20 2009 -0800

	my signed 1.5 tag
	-----BEGIN PGP SIGNATURE-----
	Version: GnuPG v1.4.8 (Darwin)

	iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
	Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
	=WryJ
	-----END PGP SIGNATURE-----
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

Sebentar lagi, Anda akan belajar untuk memverifikasi tanda tertandatangani.

## Tetanda Ringan

Cara lain untuk menandai sebuah commit adalah dengan sebuah tanda ringan. Pada dasarnya tetanda ini adalah checksum dari commit yang disimpan di dalam berkas - tanpa informasi lain. Untuk membuat tetanda ringan ini, jangan cantumkan parameter `-a`, `-s` ataupun `-m`.

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Pada saat ini, jika Anda menjalankan `git show` pada tag tersebut, Anda tidak akan melihat informasi lebih. Perinta tersebut hanya akan menampilkan commitnya.

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Memverifikasi Tetanda

Untuk memverifikasi sebuah tag bertandatangan, Anda menggunakan `git tag -v [nama-tag]`. Perintah ini akan menggunakan GPG untuk memverifikasi tanda tangannya. Anda membutuhkan kunci umum dari penandatangan di dalam keyring Anda agar dapat bekerja dengan benar:

	$ git tag -v v1.4.2.1
	object 883653babd8ee7ea23e6a5c392bb739348b1eb61
	type commit
	tag v1.4.2.1
	tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

	GIT 1.4.2.1

	Minor fixes since 1.4.2, including git-mv and git-http with alternates.
	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
	gpg:                 aka "[jpeg image of size 1513]"
	Primary key fingerprint: 3565 2A26 2040 E066 C9A7  4A7D C0C6 D9A4 F311 9B9A

Jika Anda tidak memiliki kunci umum dari penandatangan, Anda akan melihat serupa ini:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Mengakhirkan Penandaan

Anda dapat juga menandai commit walaupun Anda telah pindah melewatinya. Misalnya catatan sejarah commit Anda tampak seperti berikut:

	$ git log --pretty=oneline
	15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
	a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
	0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
	6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
	0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
	4682c3261057305bdd616e23b64b0857d832627b added a todo file
	166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
	9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
	964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
	8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme

Sekarang, misalnya Anda lupa untuk menandai proyek di v1.2, yang sebetulnya terletak di commit "update rakefile". Anda dapat menambahkannya. Untuk menandai commit tersebut, Anda mencantumkan checksum dari commit tersebut (atau bagian darinya) di bagian akhir dari perintah:

	$ git tag -a v1.2 9fceb02

Anda dapat melihat bahwa commit tersebut telah ditandai.

	$ git tag 
	v0.1
	v1.2
	v1.3
	v1.4
	v1.4-lw
	v1.5

	$ git show v1.2
	tag v1.2
	Tagger: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Feb 9 15:32:16 2009 -0800

	version 1.2
	commit 9fceb02d0ae598e95dc970b74767f19372d61af8
	Author: Magnus Chacon <mchacon@gee-mail.com>
	Date:   Sun Apr 27 20:43:35 2008 -0700

	    updated rakefile
	...

## Membagi Tetanda

Secara default, perintah `git push` tidak memindahkan tetanda ke server berjarak. Anda harus secara eksplisit mendorong tetanda ke server bersama setelah Anda membuatnya. Proses ini sama seperti membagi cabang berjarak - Anda dapat menjalankan `git push origin [nama-tag]`.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Jika Anda memiliki banyak tanda yang ingin Anda dorong sekaligus, Anda dapat juga menggunakan opsi `--tags` terhadap perintah `git push`. Hal ini akan memindahkan semua tetanda Anda yang belum terpindahkan ke server berjarak.

	$ git push origin --tags
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	 * [new tag]         v0.1 -> v0.1
	 * [new tag]         v1.2 -> v1.2
	 * [new tag]         v1.4 -> v1.4
	 * [new tag]         v1.4-lw -> v1.4-lw
	 * [new tag]         v1.5 -> v1.5

Saat ini, ketika orang lain menduplikasi atau menarik dari repositori Anda, Mereka akan mendapatkan semua tetanda Anda juga.
