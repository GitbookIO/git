# Đánh Dấu

Cũng giống như đa số các hệ quản trị phiên bản khác, Git có khả năng đánh dấu (tag) các mốc quan trọng trong lịch sử của dự án. Nhìn chung, mọi người sử dụng chức năng này để đánh dấu các thời điểm phát hành (ví dụ như `v1.0`). Trong phần này bạn sẽ được học làm sao để liệt kê các tag hiện có, làm sao để tạo mới tag, và các loại tag khác nhau hiện có. 

## Liệt Kê Tag

Liệt kê các tag hiện có trong Git khá là đơn giản. Bạn chỉ cần gõ `git tag`:

	$ git tag
	v0.1
	v1.3

Lệnh này sẽ liệt kê các tag được sắp xếp theo thứ tự bảng chứ cái; thứ tự mà nó xuất hiện không thực sự quan trọng lắm.

Bạn cũng có thể tìm kiếm một tag sử dụng mẫu (pattern). Ví dụ, trong kho chứa mã nguồn của Git có chứa hơn 240 tag. Nếu như bạn chỉ quan tâm đến các tag thuộc dải 1.4.2, bạn có thể chạy lệnh sau:

	$ git tag -l 'v1.4.2.*'
	v1.4.2.1
	v1.4.2.2
	v1.4.2.3
	v1.4.2.4

## Thêm Tag Mới

Git sử dụng hai loại tag chính: lightweight và annotated. Một lightweigh tag (hạng nhẹ) giống như một nhánh mà không có sự thay đổi - nó chỉ trỏ đến một commit nào đó. Annotated (chú thích) tag, thì lại được lưu trữ như là những đối tượng đầy đủ trong cơ sở dữ liệu của Git. Chúng được băm; chứa tên người tag, địa chỉ email và ngày tháng; có thông điệp kèm theo; và có thể được ký và xác thực bằng GNU Privacy Guard (GPG). Thông thường, annotated tag được khuyến khích sử dụng hơn vì nó có chứa các thông tin trên; tuy nhiên nếu như bạn muốn một tag tạm thời hoặc vì một lý do nào đó bạn không muốn lưu trữ các thông tin trên, lightweight tag là sự lựa chọn hợp lý hơn.

## Annotated Tags

Tạo một tag chú thích (annnotated) trong Git rất đơn giản. Cách dễ nhất là sử dụng `-a` khi bạn chạy lệnh `tag`:

	$ git tag -a v1.4 -m 'my version 1.4'
	$ git tag
	v0.1
	v1.3
	v1.4

Tham số `-m` được sử dụng để truyền vào nội dung/thông điệp cho tag. Nếu như bạn không chỉ định nội dung cho một annotated tag, Git sẽ mở trình soạn thảo và yêu cầu bạn nhập nội dung vào đó.

Bạn có thể xem được thông tin của tag cùng với commit được tag bằng cách sử dụng lệnh `git show`:

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

Nó sẽ hiện thị thông tin người tag, ngày commit được tag, và thông báo chú thích trước khi hiện thông tin của commit.

## Signed Tags

Bạn cũng có thể ký các tag của bạn sử dụng GPG, giải sử bạn có một private key. Tất cả những gì bạn cần phải làm là sử dụng `-s` thay vì `-a`:

	$ git tag -s v1.5 -m 'my signed 1.5 tag'
	You need a passphrase to unlock the secret key for
	user: "Scott Chacon <schacon@gee-mail.com>"
	1024-bit DSA key, ID F721C45A, created 2009-02-09

Nếu bạn chạy lệnh `git show` trên tag đó, bạn có thể thấy được chữ ký GPG của bạn được đính kèm theo nó:

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

Một lát nữa, bạn sẽ được học làm sao để kiểm tra/xác minh (verify) các tag đã được ký.

## Lightweight Tags

Một cách khác để tag các commit là sử dụng lightweight tag. Cơ bản nó là mã băm của một commit được lưu lại vào trong một tập tin - ngoài ra không còn thông tin nào khác. Để tạo một lightweight tag, bạn không sử dụng `-a`, `-s`, hay `-m`:

	$ git tag v1.4-lw
	$ git tag
	v0.1
	v1.3
	v1.4
	v1.4-lw
	v1.5

Lần này, nếu bạn chạy `git show` trên tag đó, bạn sẽ không thấy các thông tin bổ sung nữa. Lệnh này chỉ show commit mà thôi:

	$ git show v1.4-lw
	commit 15027957951b64cf874c3557a0f3547bd83b3ff6
	Merge: 4a447f7... a6b4c97...
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sun Feb 8 19:02:46 2009 -0800

	    Merge branch 'experiment'

## Xác Thực Các Tag

Để xác thực một tag đã được ký, bạn sử dụng `git tag -v [tên-tag]`. Lệnh này sử dụng GPG để xác minh chữ ký. Bạn cần phải có public key của người ký để có thể thực hiện được điều này:

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

Nếu như bạn không có public key của người ký, bạn sẽ thấy thông báo như sau:

	gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
	gpg: Can't check signature: public key not found
	error: could not verify the tag 'v1.4.2.1'

## Tag Muộn

Bạn cũng có thể tag các commit mà bạn đã thực hiện trước đó. Giả sử lịch sử commit của bạn giống như sau:

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

Bây giờ, giả sử bạn quên không tag dự án ở phiên bản `v1.2`, tương đương với commit "updated rakefile". Bạn vẫn có thể thêm tag vào lúc này. Để làm được điều bạn bạn cần chỉ định mã băm của commit (hoặc một phần của nó) ở cuối lệnh:

	$ git tag -a v1.2 -m 'version 1.2' 9fceb02

Bạn có thể thấy là commit đã được tag:

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

## Chia Sẻ Các Tag

Mặc định, lệnh `git push` không "truyền" (transfer) các tag lên máy chủ trung tâm. Bạn phải chỉ định một cách rõ ràng để có thể đẩy các tag lên máy chủ để sau khi đã tạo ra chúng. Quá trình này giống như chia sẽ cách nhánh trung tâm - bạn có thể chạy `git push origin [tên-tag]`.

	$ git push origin v1.5
	Counting objects: 50, done.
	Compressing objects: 100% (38/38), done.
	Writing objects: 100% (44/44), 4.56 KiB, done.
	Total 44 (delta 18), reused 8 (delta 1)
	To git@github.com:schacon/simplegit.git
	* [new tag]         v1.5 -> v1.5

Nếu bạn có rất nhiều tag muốn đẩy lên cùng một lúc, bạn có thể sử dụng tham số `--tags` cho lệnh `git push`. Nó sẽ truyền tất cả các tag chưa được đồng bộ lên máy chủ.

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

Bây giờ, nếu ai đó sao chép hoặc kéo dữ liệu từ kho chứa của bạn, họ sẽ cũng sẽ có được tất cả các tag.
