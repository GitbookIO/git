# Xem Lịch Sử Commit

Sau khi bạn đã thực hiện rất nhiều commit, hoặc bạn đã sao chép một kho chứa với các commit có sẵn, chắc chắn bạn sẽ muốn xem lại những gì đã xảy ra. Cách đơn giản và có liệu lực tốt nhất là sử dụng lệnh `git log`.

Các ví dụ sau đây sử dụng một dự án rất đơn giản là `simplegit` tôi thường sử dụng làm ví dụ minh hoạ. Để tải dự án này, bạn hãy chạy lệnh:

	git clone git://github.com/schacon/simplegit-progit.git

Khi bạn chạy `git log` trên dự án này, bạn sẽ thấy tương tự như sau:

	$ git log
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

Mặc định, không sử dụng tham số nào, `git log` liệt kê các commit được thực hiện trong kho chứa đó theo thứ tự thời gian. Đó là, commit mới nhất được hiển thị đầu tiên. Như bạn có thể thấy, lệnh này liệt kê từng commit với mã băm SHA-1, tên người commit, địa chỉ email, ngày lưu, và thông điệp của chúng. 

Có rất nhiều tuỳ chọn (tham biến/số) khác nhau cho lệnh `git log` giúp bạn tìm chỉ hiện thị thứ mà bạn thực sự muốn. Ở đây, chúng ta sẽ cùng xem qua các lựa chọn phổ biến, thường được sử dụng nhiều nhất.

Một trong các tuỳ chọn hữu ích nhất là `-p`, nó hiện thị diff của từng commit. Bạn cũng có thể dùng `-2` để giới hạn chỉ hiển thị hai commit gần nhất:

	$ git log -p -2
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -5,5 +5,5 @@ require 'rake/gempackagetask'
	 spec = Gem::Specification.new do |s|
	     s.name      =   "simplegit"
	-    s.version   =   "0.1.0"
	+    s.version   =   "0.1.1"
	     s.author    =   "Scott Chacon"
	     s.email     =   "schacon@gee-mail.com

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	diff --git a/lib/simplegit.rb b/lib/simplegit.rb
	index a0a60ae..47c6340 100644
	--- a/lib/simplegit.rb
	+++ b/lib/simplegit.rb
	@@ -18,8 +18,3 @@ class SimpleGit
	     end

	 end
	-
	-if $0 == __FILE__
	-  git = SimpleGit.new
	-  puts git.show
	-end
	\ No newline at end of file

Lựa chọn này hiển thị thông tin tương tự nhưng thêm vào đó là nội dung diff trực tiếp của từng commit. Điều này rất có ích cho việc xem lại mã nguồn hoặc duyệt qua nhanh chóng những commit mà đồng nghiệp của bạn đã thực hiện.

Đôi khi xem lại cách thay đổi tổng quát (word level) lại dễ dàng hơn việc xem theo dòng. Lựa chọn `--word-diff` được cung cấp trong Git, bạn có thể thêm nó vào sau lệnh `git log -p` để xem diff một cách tổng quát thay vì xem từng dòng theo cách thông thường. Xem diff tổng quát dường như là vô dụng khi sử dụng với mã nguồn, nhưng lại rất hữu ích với các tập tin văn bản lớn như sách hay luận văn. Đây là một ví dụ:

	$ git log -U1 --word-diff
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	diff --git a/Rakefile b/Rakefile
	index a874b73..8f94139 100644
	--- a/Rakefile
	+++ b/Rakefile
	@@ -7,3 +7,3 @@ spec = Gem::Specification.new do |s|
	    s.name      =   "simplegit"
	    s.version   =   [-"0.1.0"-]{+"0.1.1"+}
	    s.author    =   "Scott Chacon"

Như bạn có thể thấy, không có dòng nào được thêm hay xoá trong phần thông báo như là với diff thông thường. Thay đổi được hiển thị ngay trên một dòng. Bạn có thể thấy phần thêm mới được bao quanh trong `{+ +}` còn phần xoá đi thì trong `[- -]`. Có thể bạn cũng muốn giảm ba dòng ngữ cảnh trong phần hiển thị diff xuống còn một dòng, vì ngữ cảnh hiện tại là các từ, không phải các dòng nữa. Bạn có thể làm được điều này với tham số `-U1` như ví dụ trên.

Bạn cũng có thể sử dụng một loại lựa chọn thống kê với `git log`. Ví dụ, nếu bạn muốn xem một số thống kê tóm tắt cho mỗi commit, bạn có thể sử dụng tham số `--stat`:

	$ git log --stat
	commit ca82a6dff817ec66f44342007202690a93763949
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Mon Mar 17 21:52:11 2008 -0700

	    changed the version number

	 Rakefile |    2 +-
	 1 files changed, 1 insertions(+), 1 deletions(-)

	commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 16:40:33 2008 -0700

	    removed unnecessary test code

	 lib/simplegit.rb |    5 -----
	 1 files changed, 0 insertions(+), 5 deletions(-)

	commit a11bef06a3f659402fe7563abf99ad00de2209e6
	Author: Scott Chacon <schacon@gee-mail.com>
	Date:   Sat Mar 15 10:31:28 2008 -0700

	    first commit

	 README           |    6 ++++++
	 Rakefile         |   23 +++++++++++++++++++++++
	 lib/simplegit.rb |   25 +++++++++++++++++++++++++
	 3 files changed, 54 insertions(+), 0 deletions(-)

Như bạn có thể thấy, lựa chọn `--stat` in ra phía dưới mỗi commit danh sách các tập tin đã chỉnh sửa, bao nhiêu tập tin được sửa, và bao nhiêu dòng trong các tập tin đó được thêm vào hay xoá đi. Nó cũng in ra một phần tóm tắt ở cuối cùng. 
Một lựa chọn rất hữu ích khác là `--pretty`. Lựa chọn này thay đổi phần hiển thị ra theo các cách khác nhau. Có một số lựa chọn được cung cấp sẵn cho bạn sử dụng. Lựa chọn `oneline` in mỗi commit trên một dòng, có ích khi bạn xem nhiều commit cùng lúc. Ngoài ra các lựa chọn `short`, `full`, và `fuller` hiện thị gần như tương tự nhau với ít hoặc nhiều thông tin hơn theo cùng thứ tự:

	$ git log --pretty=oneline
	ca82a6dff817ec66f44342007202690a93763949 changed the version number
	085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
	a11bef06a3f659402fe7563abf99ad00de2209e6 first commit

Lựa chọn thú vị nhất là `format`, cho phép bạn chỉ định định dạng riêng của phần hiện thị. Nó đặc biệt hữu ích khi bạn đang xuất ra cho các máy phân tích thông tin (machine parsing) - vì bạn là người chỉ rõ định dạng, nên bạn sẽ biết được nó không bị thay đổi cùng với các cập nhật sau này của Git.

	$ git log --pretty=format:"%h - %an, %ar : %s"
	ca82a6d - Scott Chacon, 11 months ago : changed the version number
	085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
	a11bef0 - Scott Chacon, 11 months ago : first commit

Bảng 2-1 liệt kê một vài lựa chọn mà `format` sử dụng.

|Lựa chọn|Mô tả thông tin đầu ra|
|--------|----------------------|
|%H|Mã băm của commit|
|%h|Mã băm của commit ngắn gọn hơn|
|%T|Băm hiển thị dạng cây|
|%t|Băm hiển thị dạng cây ngắn gọn hơn|
|%P|Các mã băm gốc|
|%p|Mã băm gốc ngắn gọn|
|%an|Tên tác giả|
|%ae|E-mail tác giả|
|%ad|Ngày "tác giả" (định dạng tương tự như lựa chọn --date= )|
|%ar|Ngày tác giả, tương đối|
|%cn|Tên người commit|
|%ce|Email người commit|
|%cd|Ngày commit|
|%cr|Ngày commit, tương đối|
|%s|Chủ để|

Có thể bạn băn khoăn về sự khác nhau giữa _tác giả_ (author) và _người commit_ (committer). _Tác giả_ là người đầu tiên viết bản vá (patch), trong khi đó _người commit_ là người cuối cùng áp dụng miếng vá đó. Như vậy, nếu bạn gửi một bản vá cho một dự án và một trong các thành viên chính của dự án "áp dụng" (chấp nhận) bản vá đó, cả hai sẽ cùng được ghi nhận công trạng (credit) - bạn với vai trò là tác giả và thành viên của dự án trong vai trò người commit. Chúng ta sẽ bàn kỹ hơn một chút về sự khác nhau này trong *Chương 5*.

Lựa chọn `oneline` và `format` đặc biệt hữu ích khi sử dụng với một tham số khác của `log` là `--graph`. Khi sử dụng, tham số này sẽ thêm một biểu đồ sử dụng dựa trên các ký tự ASCII hiển thị nhánh và lịch sử tích hợp các tập tin của bạn, chúng ta có thể thấy trong dự án Grit như sau:

	$ git log --pretty=format:"%h %s" --graph
	* 2d3acf9 ignore errors from SIGCHLD on trap
	*  5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
	|\
	| * 420eac9 Added a method for getting the current branch.
	* | 30e367c timeout code and tests
	* | 5a09431 add timeout protection to grit
	* | e1193f8 support for heads with slashes in them
	|/
	* d6016bc require time for xmlschema
	*  11d191e Merge branch 'defunkt' into local

Vừa rồi mới chỉ là một số lựa chọn định dạng cơ bản cho `git log` - còn rất nhiều các định dạng khác. Bảng 2-2 liệt kê các lựa chọn chúng ta đã đề cập qua và một số định dạng cơ bản khác có thể hữu ích, cùng với mô tả đầu ra của lệnh `log`.

|Tuỳ chọn|Mô tả|
|--------|-----|
|-p|Hiển thị bản vá với mỗi commit.|
|--word-diff|Hiển thị bản vá ở định dạng tổng quan (word).|
|--stat|Hiển thị thống kê của các tập tin được chỉnh sửa trong mỗi commit.|
|--shortstat|Chỉ hiển thị thay đổi/thêm mới/xoá bằng lệnh --stat.|
|--name-only|Hiển thị danh sách các tập tin đã thay đổi sau thông tin của commit.|
|--name-status|Hiển thị các tập tin bị ảnh hưởng với các thông tin như thêm mới/sửa/xoá.|
|--abbrev-commit|Chỉ hiện thị một số ký tự đầu của mã băm SHA-1 thay vì tất cả 40.|
|--relative-date|Hiển thị ngày ở định dạng tương đối (ví dụ, "2 weeks ago") thay vì định dạng đầy đủ.|
|--graph|Hiển thị biểu đồ ASCII của nhánh và lịch sử tích hợp cùng với thông tin đầu ra khác.|
|--pretty|Hiện thị các commit sử dụng một định dạng khác. Các lựa chọn bao gồm oneline, short, full, fuller và format (cho phép bạn sử dụng định dạng riêng).|
|--oneline|Một lựa chọn ngắn, thuận tiện cho `--pretty=oneline --abbrev-commit`.|

## Giới Hạn Thông Tin Đầu Ra

Ngoài các lựa chọn để định dạng đầu ra, `git log` còn nhận vào một số các lựa chọn khác cho mục đích giới hạn khác - là các lựa chọn cho phép bạn hiển thị một phần các commit. Bạn đã thấy một trong các tham số đó - đó là `-2`, cái mà dùng để hiện thị hai commit mới nhất. Thực tế bạn có thể dùng `-<n>`, trong đó `n` là số nguyên dương bất kỳ để hiển thị `n` commit mới nhất. Trong thực tế, bạn thường không sử dụng chúng, vì mặc định Git đã hiển thị đầu ra theo trang do vậy bạn chỉ xem được một trang lịch sử tại một thời điểm.

Tuy nhiên, tham số kiểu giới hạn theo thời gian như `--since` và `--until` khá hữu ích. Ví dụ, lệnh này hiển thị các commit được thực hiện trong vòng hai tuần gần nhất:

	$ git log --since=2.weeks

Lệnh này hoạt động được với rất nhiều định dạng - bạn có thể chỉ định một ngày cụ thể ("2008-01-15") hoặc tương đối như "2 years 1 day 3 minutes ago".

Bạn cũng có thể lọc các commint thoả mãn một số tiêu chí nhất định. Tham số `--author` cho phép bạn lọc một tác giả nhất định, và tham số `--grep` cho phép bạn tìm kiếm các từ khoá trong thông điệp của commit. (Lưu ý là nếu như bạn muốn chỉ định tham số author và grep, bạn phải thêm vào `--all-match` bằng không lệnh đó sẽ chỉ tìm kiếm các commit thoả mãn một trong hai.)

Tham số hữu ích cuối cùng sử dụng cho `git log` với vai trò một bộ lọc là đường dẫn. Nếu bạn chỉ định một thư mục hoặc tên một tập tin, bạn có thể giới hạn các commit chỉ được thực hiện trên tập tin đó. Tham số này luôn được sử dụng cuối cùng trong câu lệnh và đứng sau hai gạch ngang (`--`) như thường lệ để phân chia các đường dẫn khác nhau.

Bảng 2-3 liệt kê các lựa chọn trên và một số lựa chọn phổ biến khác cho bạn thao khảo.

|Lựa chọn|Mô tả|
|--------|-----|
|-(n)|Chỉ hiển thị n commit mới nhất|
|--since, --after|Giới hạn các commit được thực hiện sau ngày nhất định.|
|--until, --before|Giới hạn các commit được thực hiện trước ngày nhất định.|
|--author|Chỉ hiện thị các commit mà tên tác giả thoả mãn điều kiện nhất định.|
|--committer|Chỉ hiện thị các commit mà tên người commit thoả mãn điều kiện nhất định.|

Ví dụ, bạn muốn xem các commit đã thay đổi các tập tin thử nghiệm trong lịch sử mã nguồn của Git, được commit bởi Junio Hâmno trng tháng 10 năm 2008 mà chưa được tích hợp/gộp, bạn có thể chạy lệnh sau:

	$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
	   --before="2008-11-01" --no-merges -- t/
	5610e3b - Fix testcase failure when extended attribute
	acd3b9e - Enhance hold_lock_file_for_{update,append}()
	f563754 - demonstrate breakage of detached checkout wi
	d1a43f2 - reset --hard/read-tree --reset -u: remove un
	51a94af - Fix "checkout --track -b newbranch" on detac
	b0ad11e - pull: allow "git pull origin $something:$cur

Có gần 20,000 commit trong lịch sử mã nguồn của Git, lệnh này chỉ hiện thị 6 commit thoả mãn tiêu chí đặt ra.

## Hiển Thị Lịch Sử Trên Giao Diện

Nếu bạn muốn sử dụng một công cụ đồ hoạ để trực quan hoá lịch sử commit, bạn có thể thử một chương trình Tcl/Tk có tên `gitk` được xuất bản kèm với git. Gitk cơ bản là một công cụ `git log` trực quan, nó chấp nhận hầu hết các lựa chọn để lọc mà `git log` thường dùng. Nếu bạn gõ `gitk` trên thư mục của dự án, bạn sẽ thấy giống như Hình 2-2.


![](http://git-scm.com/figures/18333fig0202-tn.png)

Hình 2-2. Công cụ trực quan hoá lịch sử commit gitk.

Bạn có thể xem lịch sử commit ở phần nửa trên của cửa sổ cùng cùng một biểu đồ "cây" (ancestry) trực quan. Phần xem diff ở nửa dưới của cửa sổ hiện thị các thay đổi trong bất kỳ commit nào bạn click ở trên.
