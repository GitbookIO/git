# Cơ Bản Về Phân Nhánh và Tích Hợp

Hãy cùng xem qua một ví dụ đơn giản về phân nhánh và tích hợp với một quy trình làm việc mà có thể bạn sẽ sử dụng nó vào thực tế. Bạn sẽ thực hiện theo các bước sau: 

1. Làm việc trên một web site
2. Tạo nhánh cho một câu chuyện mới mà bạn đang làm.
3. Làm việc trên nhánh đó.

Đến lúc này, bạn nhận được thông báo rằng có một vấn đề nghiêm trọng cần được khắc phục ngay. Bạn sẽ làm theo các bước sau:

1. Chuyển lại về nhánh sản xuất (production)
2. Tạo mới một nhánh khác để khắc phục lỗi
3. Sau khi đã kiểm tra ổn định, tích hợp nhánh đó lại và đưa vào hoạt động.
4. Chuyển ngược lại với câu chuyện của bạn và tiếp tục làm việc.

## Cơ Bản về Phân Nhánh

Đầu tiên, giả sử bạn đang làm việc trên một dự án đã có một số commit từ trước (xem Hình 3-10).


![](http://git-scm.com/figures/18333fig0310-tn.png)

Hình 3-10. Một lịch sử commit ngắn và đơn giản.

Bạn quyết định sẽ giải quyết vấn đề số #53 sử dụng bất kỳ hệ thống giám sát vấn đề (issue-tracking) nào mà công ty bạn đang dùng. Để cho rõ ràng, Git không cung cấp kèm bất kỳ hệ thống giám sát vấn đề nào; nhưng bởi vì vấn đề số #53 là cái mà bạn sẽ tập trung vào nên bạn sẽ tạo một nhánh mới để làm việc trên đó. Để tạo một nhánh và chuyển sang nhánh đó đồng thời, bạn có thể chạy lệnh `git checkout` với tham số `-b`:

	$ git checkout -b iss53
	Switched to a new branch "iss53"

Đây là cách sử dụng vắn tắt của:

	$ git branch iss53
	$ git checkout iss53

Hình 3-11 minh họa kết quả.


![](http://git-scm.com/figures/18333fig0311-tn.png)

Hình 3-11. Tạo con trỏ nhánh mới.

Bạn làm việc trên đó và sau đó thực hiện một số commit. Làm như vậy sẽ khiến nhánh `iss53` di chuyển tiến lên, vì bạn đã checkout nó (hay, HEAD đang trỏ đến nó; xem Hình 3-12):

	$ vim index.html
	$ git commit -a -m 'added a new footer [issue 53]'


![](http://git-scm.com/figures/18333fig0312-tn.png)

Hình 3-12. Nhánh iss53 đã di chuyển tiến lên cùng với thay đổi của bạn.

Bây giờ bạn nhận được thông báo rằng có một vấn đề với trang web, và bạn cần khắc phục nó ngay lập tức. Với Git, bạn không phải triển khai bản vá lỗi cùng với các thay đổi bạn đã thực hiện trên nhánh `iss53`, và bạn không phải tốn quá nhiều công sức để khôi phục lại các thay đổi đó trước khi áp dụng bản vá vào sản xuất. Tất cả những gì bạn cần phải làm là chuyển lại nhánh master.

Tuy nhiên, trước khi làm điều này, bạn nên lưu ý rằng nếu thư mục làm việc hoặc khu vực tổ chức có chứa các thay đổi chưa được commit mà xung đột với nhánh bạn đang làm việc, Git sẽ không cho phép bạn chuyển nhánh. Tốt nhất là bạn nên ở trạng thái làm việc "sạch" (đã commit hết) trước khi chuyển nhánh. Có các cách khác để khắc phục vấn đề này (đó là stashing và sửa commit) mà chúng ta sẽ bàn tới sau. Hiện tại, bạn đã commit hết các thay đổi, vì vậy bạn có thể chuyển lại nhánh master:

	$ git checkout master
	Switched to branch "master"

Tại thời điểm này, thư mục làm việc của dự án giống hệt như trước khi bạn bắt đầu giải quyết vấn đề #53, và bạn có thể tập trung vào việc sửa lỗi. Điểm quan trọng cần ghi nhớ: Git khôi phục lại thư mục làm việc của bạn để nó giống như snapshot của commit mà nhánh bạn đang làm việc trỏ tới. Nó thêm, xóa, và sửa các tập tin một cách tự động để đảm bảo rằng thư mục làm việc của bạn giống như lần commit cuối cùng.

Tiếp theo, bạn có mỗi lỗi cần phải sửa. Hãy tạo mỗi nhánh để làm việc này cho tới khi nó được hoàn thành (xem Hình 3-13):

	$ git checkout -b hotfix
	Switched to a new branch "hotfix"
	$ vim index.html
	$ git commit -a -m 'fixed the broken email address'
	[hotfix]: created 3a0874c: "fixed the broken email address"
	 1 files changed, 0 insertions(+), 1 deletions(-)


![](http://git-scm.com/figures/18333fig0313-tn.png)

Hình 3-13. Nhánh hotfix dựa trên nhánh master.

Bạn có thể chạy để kiểm tra, để chắc chắn rằng bản vá lỗi hoạt động đúng theo ý bạn muốn, và sau đó tích hợp nó lại nhánh chính để triển khai. Bạn có thể làm sử dụng lệnh `git merge` để làm việc này:

	$ git checkout master
	$ git merge hotfix
	Updating f42c576..3a0874c
	Fast forward
	 README |    1 -
	 1 files changed, 0 insertions(+), 1 deletions(-)

Bạn sẽ nhận thấy rằng cụm từ "Fast forward" trong lần tích hợp đó. Bởi vì commit được trở tới bởi nhánh mà bạn tích hợp vào lại trực tiếp là upstream của commit hiện tại, vì vậy Git di chuyển con trỏ về phía trước. Nói cách khác, khi bạn cố gắng tích hợp một commit với một commit khác mà có thể truy cập được từ lịch sử của commit trước thì Git sẽ đơn giản hóa bằng cách di chuyển con trỏ về phía trước vì không có sự rẽ nhánh nào để tích hợp - đây được gọi là "fast forward".

Thay đổi của bạn bây giờ ở trong snapshot của commit được trỏ tới bởi nhánh `master`, và bạn có thể triển khai thay đổi này (xem Hình 3-14).


![](http://git-scm.com/figures/18333fig0314-tn.png)

Hình 3-14. Nhánh master và nhánh hotfix cùng trỏ tới một điểm sau khi tích hợp.

Sau khi triển khai xong bản vá lỗi quan trọng đó, bạn đã sẵn sàng để quay lại với công việc bị gián đoạn trước đó. Tuy nhiên, việc đầu tiên cần làm là xóa nhánh `hotfix` đi, vì bạn không còn cần tới nó nữa - nhánh `master` trỏ tới cùng một điểm. Bạn có thể xóa nó đi bằng cách sử dụng tham số `-d` cho lệnh `git branch`:

	$ git branch -d hotfix
	Deleted branch hotfix (3a0874c).

Bây giờ bạn đã có thể chuyển lại nhánh mà bạn đang làm việc trước đó về vấn đề #53 và tiếp tục làm việc (xem Hình 3-15):

	$ git checkout iss53
	Switched to branch "iss53"
	$ vim index.html
	$ git commit -a -m 'finished the new footer [issue 53]'
	[iss53]: created ad82d7a: "finished the new footer [issue 53]"
	 1 files changed, 1 insertions(+), 0 deletions(-)


![](http://git-scm.com/figures/18333fig0315-tn.png)

Hình 3-15. Nhánh iss53 có thể di chuyển về phía trước một cách độc lập.

Điều đáng chú ý ở đây là những công việc bạn đã thực hiện ở nhánh `hotfix` không bao gồm trong nhánh `iss53`. Nếu bạn muốn đưa chúng vào, bạn có thể tích hợp nhánh `master` vào nhánh `iss53` bằng cách chạy lệnh `git merge master`, hoặc bạn có thể chờ đợi đến khi bạn quyết định tích hợp nhánh `iss53` ngược trở lại nhánh `master` về sau.

## Cơ Bản Về Tích Hợp

Giả sử bạn đã quyết định việc giải quyết vấn đề #53 đã hoàn thành và sẵn sàng để tích hợp vào nhánh `master`. Để làm được điều này, bạn sẽ tích hợp nhánh `iss53` lại, giống như bạn đã làm với nhánh `hotfix` trước đó. Tất cả những gì cần phải làm là chuyển sang (check out) nhánh mà bạn muốn được tích hợp vào và chạy lệnh `git merge`:

	$ git checkout master
	$ git merge iss53
	Merge made by recursive.
	 README |    1 +
	 1 files changed, 1 insertions(+), 0 deletions(-)

Lần này có hơi khác so với lần tích hợp `hotfix` trước đó. Trong trường hợp này, lịch sử phát triển của bạn đã bị phân nhánh tại một thời điểm nào đó trước kia. Bởi vì commit trên nhánh mà bạn đang làm việc (master) không phải là "cha" trực tiếp của nhánh mà bạn đang tích hợp vào, Git phải làm một số việc. Trường hợp này, Git thực hiện một tích hợp 3-chiều, sử dụng hai snapshot được trỏ tới bởi các đầu mút của nhánh và "cha chung" của cả hai. Hình 3-16 minh họa ba snapshot mà Git sử dụng để thực hiện phép tích hợp trong trường hợp này.


![](http://git-scm.com/figures/18333fig0316-tn.png)

Hình 3-16. Git tự động nhận dạng "cha chung" phù hợp nhất để tích hợp các nhánh lại với nhau.

Thay vì việc chỉ di chuyển con trỏ về phía trước, Git tạo một snapshot mới - được hợp thành từ lần tích hợp 3-chiều này và cũng tự tạo một commit mới trỏ tới nó (xem Hình 3-17). Nó được biết tới như là "commit tích hợp" (merge commit) và nó đặc biệt vì có nhiều hơn một cha.

Đáng để chỉ ra rằng Git tự quyết định cha chung phù hợp nhất để sử dụng làm cơ sở cho việc tích hợp; điểm này khác với CVS hay Subversion (các phiên bản trước 1.5), khi mà các lập trình viên phải tự xác định cơ sở phù hợp nhất để tích hợp. Điều này khiến cho việc tích hợp trong Git trở nên dễ dàng hơn rất nhiều so với các hệ quản trị phiên bản khác.


![](http://git-scm.com/figures/18333fig0317-tn.png)

Hình 3-17. Git tự động tạo đối tượng commit mới chứa đựng các thay đổi đã tích hợp.

Bây giờ công việc của bạn đã được tích hợp lại với nhau, bạn không cần thiết phải giữ lại nhánh `iss53` nữa. Bạn có thể xóa nó đi và sau đó tự xóa vấn đề này trong hệ thống quản lý vấn đề của bạn:

	$ git branch -d iss53

## Mâu Thuẫn Khi Tích Hợp

Đôi khi, quá trình này không diễn ra một cách suôn sẻ. Nếu bạn thay đổi cùng một nội dung của cùng một tập tin ở hai nhánh khác nhau mà bạn đang muốn tích hợp vào, Git không thể tích hợp chúng một cách gọn gàng. Nếu bản vá lỗi cho vấn đề #53 cùng thay đổi một phần của một tập tin giống như nhánh `hotfix`, bạn sẽ nhận được một sự xung đột khi tiến hành tích hợp như sau:

	$ git merge iss53
	Auto-merging index.html
	CONFLICT (content): Merge conflict in index.html
	Automatic merge failed; fix conflicts and then commit the result.

Git chưa tự tạo commit tích hợp mới. Nó tạm dừng quá trình này lại cho đến khi bạn giải quyết xong xung đột. Nếu bạn muốn xem tập tin nào chưa được tích hợp tại bất kỳ thời điểm nào sau khi xung đột xảy ra, bạn có thể sử dụng lệnh `git status`:

	[master*]$ git status
	index.html: needs merge
	# On branch master
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#	unmerged:   index.html
	#

Với bất kỳ xung đột nào xảy ra mà chưa được giải quyết, chúng sẽ được liệt kê là unmerged (chưa được tích hợp). Git thêm các dấu hiệu chuẩn riêng để giải quyết xung đột vào các tập tin có xảy ra xung đột, vì thế bạn có thể mở và giải quyết các xung đột đó một cách thủ công. Tập tin của bạn sẽ chứa một phần tương tự như sau:

	<<<<<<< HEAD:index.html
	<div id="footer">contact : email.support@github.com</div>
	=======
	<div id="footer">
	  please contact us at support@github.com
	</div>
	>>>>>>> iss53:index.html

Điều này có nghĩa là phiên bản trong HEAD (nhánh master, vì nó là nhánh bạn đã check out khi chạy lệnh merge) là phần mới nhất của đoạn đó (mọi thứ phía trên `=======`), trong khi phiên bản ở nhánh `iss53` chính là phần phía dưới. Để giải quyết vấn đề này, bạn phải chọn một trong hai phần hoặc tự gộp nội dung của chúng lại. Ví dụ, có thể bạn giải quyết xung đột này bằng cách thay thế toàn bộ đoạn code đó bằng:

	<div id="footer">
	please contact us at email.support@github.com
	</div>

Cách giải quyết này có chứa nội dung của cả hai phần, và tôi đã xóa bỏ hoàn toàn các dòng `<<<<<<<`, `=======`, và `>>>>>>>`. Sau khi giải quyết xong tất cả các phần này trong các tập tin bị xung đột, chạy lệnh `git add` cho từng tập tin để đánh dấu là chúng đã được giải quyết. Tổ chức chúng cùng đồng nghĩa với việc đánh dấu là đã được giải quyết trong Git. Nếu bạn muốn sử dụng một công cụ có giao diện đồ họa để giải quyết những vấn đề này, bạn có thể sử dụng `git mergetool`, Git sẽ tự động mở chương trình tương ứng và trợ giúp bạn giải quyết các xung đột: 

	$ git mergetool
	merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
	Merging the files: index.html

	Normal merge conflict for 'index.html':
	  {local}: modified
	  {remote}: modified
	Hit return to start merge resolution tool (opendiff):

Nếu bạn muốn sử dụng một công cụ tích hợp khác thay vì chương trình mặc định (Git sử dụng `opendiff` cho tôi trong trường hợp này vì tôi đang sử dụng một máy tính Mac), bạn có thể xem danh sách các chương trình tương thích bằng cách chạy lệnh "merge tool candidates". Gõ tên chương trình bạn muốn sử dung. Trong Chương 7, chúng ta sẽ cùng bàn luận về việc làm thế nào để thay đổi giá trị mặc định này.

Sau khi thoát khỏi chương trình hỗ trợ tích hợp, Git sẽ hỏi bạn nếu tích hợp thành công. Nếu bạn trả lời đúng, nó sẽ đánh dấu tập tin đó là đã giải quyết cho bạn.

Bạn có thể chạy `git status` lại một lần nữa để xác thực rằng tất cả các xung đột đã được giải quyết:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	modified:   index.html
	#

Nếu bạn hài lòng với điều này, và chắc chắn rằng tất cả các xung đột đã được tổ chức, bạn có thể chạy lệnh `git commit` để hoàn thành commit tích hợp. Thông điệp mặc định của commit có dạng như sau:

	Merge branch 'iss53'

	Conflicts:
	  index.html
	#
	# It looks like you may be committing a MERGE.
	# If this is not correct, please remove the file
	# .git/MERGE_HEAD
	# and try again.
	#

Bạn có sửa lại nội dung này với các chi tiết về việc bạn đã giải quyết như thế nào nếu bạn cho rằng các thông tin đó sẽ có ích cho các thành viên khác sau này - tại sao bạn lại làm như vậy, nếu như chúng còn chưa rõ ràng.
