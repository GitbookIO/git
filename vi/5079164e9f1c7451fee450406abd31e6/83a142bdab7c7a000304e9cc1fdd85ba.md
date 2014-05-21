# Ghi Lại Thay Đổi vào Kho Chứa

Bây giờ bạn đã có một kho chứa Git thật sự và một bản sao dữ liệu của dự án để làm việc. Bạn cần thực hiện một số thay đổi và commit ảnh của chúng vào kho chứa mỗi lần dự án đạt tới một trạng thái nào đó mà bạn muốn ghi lại.

Hãy nhớ là mỗi tập tin trong thư mục làm việc của bạn có thể ở một trong hai trạng thái : *tracked* hoặc *untrachked*. Tập tin *tracked* là các tập tin đã có mặt trong ảnh (snapshot) trước; chúng có thể là *unmodified*, *modified*, hoặc *staged*. Tập tin *untracked* là các tập tin còn lại - bất kỳ tập tin nào trong thư mục làm việc của bạn mà không có ở ảnh (lần commit) trước hoặc không ở trong khu vực tổ chức (staging area). Ban đầu, khi bạn tạo bản sao của một kho chứa, tất cả tập tin ở trạng thái "đã được theo dõi" (tracked) và "chưa thay đổi" (unmodified) vì bạn vừa mới tải chúng về và chưa thực hiện bất kỳ thay đổi nào.

Khi bạn chỉnh sửa các tập tin, Git coi là chúng đã bị thay đổi so với lần commit trước đó. Bạn *stage* các tập tin bị thay đổi này và sau đó commit tất cả các thay đổi đã được staged (tổ chức) đó, và quá trình này cứ thế lặp đi lặp lại như được miêu tả trong Hình 2-1.


![](http://git-scm.com/figures/18333fig0201-tn.png)

Hình 2-1. Vòng đời các trạng thái của tập tin.

## Kiểm Tra Trạng Thái Của Tập Tin

Công cụ chính để phát hiện trạng thái của tập tin là lệnh `git status`. Nếu bạn chạy lệnh này trực tiếp sau khi vừa tạo xong một bản sao, bạn sẽ thấy tương tự như sau:

	$ git status
	# On branch master
	nothing to commit (working directory clean)

Điều này có nghĩa là bạn có một thư mục làm việc "sạch" - hay nói cách khác, không có tập tin đang theo dõi nào bị thay đổi. Git cũng không phát hiện ra tập tin chưa được theo dõi nào, nếu không thì chúng đã được liệt kê ra đây. Cuối cùng, lệnh này cho bạn biết bạn đang thao tác trên "nhánh" (branch) nào. Hiện tại thì nó sẽ luôn là `master`, đó là nhánh mặc định; bạn chưa nên quan tâm đến vấn đề này bây giờ. Chương tiếp theo chúng ta sẽ bàn về các Nhánh chi tiết hơn.

Giả sử bạn thêm một tập tin mới vào dự án, một tập tin `README` đơn giản. Nếu như tập tin này chưa từng tồn tại trước đó, kho bạn chạy `git status`, bạn sẽ thấy thông báo tập tin chưa được theo dõi như sau:

	$ vim README
	$ git status
	# On branch master
	# Untracked files:
	#   (use "git add <file>..." to include in what will be committed)
	#
	#	README
	nothing added to commit but untracked files present (use "git add" to track)

Bạn có thể thấy là tập tin `README` mới chưa được theo dõi, bởi vì nó nằm trong danh sách "Các tập tin chưa được theo dõi:" (Untracked files) trong thông báo trạng thái được hiển thị. Chưa được theo dõi về cơ bản có nghĩa là Git thấy một tập tin chưa tồn tại trong ảnh (lần commit) trước; Git sẽ không tự động thêm nó vào các commit tiếp theo trừ khi bạn chỉ định rõ ràng cho nó làm như vậy. Theo cách này, bạn sẽ không vô tình thêm vào các tập tin nhị phân hoặc các tập tin khác mà bạn không thực sự muốn. Trường hợp này bạn thực sự muốn thêm README, vậy hãy bắt đầu theo dõi nó.

## Theo Dõi Các Tập Tin Mới

Để có thể theo dõi các tập tin mới tạo, bạn sử dụng lệnh `git add`. Và để bắt đầu theo dõi tập tin `README` bạn có thể chạy lệnh sau:

	$ git add README

Nếu bạn chạy lệnh kiểm tra trạng thái lại một lần nữa, bạn sẽ thấy tập tin `README` bây giờ đã được theo dõi và tổ chức (staged):

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#

Bạn có thể thấy nó đã được staged vì nó đã nằm trong danh sách "Các thay đổi chuẩn bị commit". Nếu bạn commit tại thời điểm này, phiên bản của tập tin ở thời điểm bạn chạy `git add` sẽ được thêm vào lịch sử commit. Nhớ lại khi bạn chạy `git init` lúc trước, sau đó là lệnh `git add (files)` - đó chính là bắt đầu theo dõi các tập tin trong thư mục của bạn. Lệnh `git add` có thể dùng cho một tập tin hoặc một thư mục; nếu là thư mục, nó sẽ thêm tất cả tập tin trong thư mục đó cũng như các thư mục con.

## Quản Lý Các Tập Tin Đã Thay Đổi

Hãy sửa một tập tin đang được theo dõi. Nếu bạn sửa một tập tin đang được theo dõi như `benchmarks.rb` sau đó chạy lệnh `status`, bạn sẽ thấy tương tự như sau:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Tập tin `benchmarks.rb` nằm trong danh sách "Các thay đổi chưa được tổ chức/đánh dấu để commit" - có nghĩa là một tập tin đang được theo dõi đã bị thay đổi trong thư mục làm việc nhưng chưa được "staged". Để làm việc này, bạn chạy lệnh `git add` (đó là một câu lệnh đa chức năng - bạn có thể dùng nó để bắt đầu theo dõi tập tin, tổ chức tập tin, hoặc các việc khác như đánh dấu đã giải quyết xong các tập tin có nội dung mâu thuẫn nhau khi tích hợp). Chạy `git add` để "stage" tập tin `benchmarks.rb` và sau đó chạy lại lệnh `git status`: 

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

Cả hai tập tin đã được tổ chức và sẽ có mặt trong lần commit tới. Bây giờ, giả sử bạn nhớ ra một chi tiết nhỏ nào đó cần thay đổi trong tập tin `benchmarks.rb` trước khi commit. Bạn lại mở nó ra và sửa, bây giờ thì sẵn sàng để commit rồi. Tuy nhiên, hãy chạy `git status` lại một lần nữa:

	$ vim benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Chuyện gì xảy ra thế này? Bây giờ `benchmarks.rb` lại nằm trong cả hai danh sách staged và unstaged. Làm sao có thể thế được? Hoá ra là Git tổ chức một tập tin chính lúc bạn chạy lệnh `git add`. Nếu bạn commit bây giờ, phiên bản của tập tin `benchmarks.rb` khi bạn chạy `git add` sẽ được commit chứ không phải như bạn nhìn thấy hiện tại trong thư mục làm việc khi chạy `git commit`. Nếu như bạn chỉnh sửa một tập tin sau khi chạy `git add`, bạn phải chạy `git add` lại một lần nữa để đưa nó vào phiên bản mới nhất:

	$ git add benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#	modified:   benchmarks.rb
	#

## Bỏ Qua Các Tập Tin

Thường thì hay có một số loại tập tin mà bạn không muốn Git tự động thêm nó vào hoặc thậm chí hiển thị là không được theo dõi. Những tập tin này thường được tạo ta tự động ví dụ như các tập tin nhật ký (log files) hay các tập được sinh ra khi biên dịch chương trình. Trong những trường hợp như thế, bạn có thể tạo một tập tin liệt kê các "mẫu" (patterns) để tìm những tập tin này có tên `.gitignore`. Đây là một ví dụ của `.gitignore`:

	$ cat .gitignore
	*.[oa]
	*~

Dòng đầu tiên yêu cầu Git bỏ qua tất cả các tập tin có đuôi là `.o` hoặc `.a` - các tập tin *object* và *archiev* có thể được tạo ra khi bạn dịch mã nguồn. Dòng thứ hai yêu cầu Git bỏ qua tất cả tập tin có đuôi là dẫu ngã (`~`), chúng được sử dụng để lưu các giá trị tạm thời bởi rất nhiều chương trình soạn thảo như Emacs. Bạn có thể thêm vào các thư mục như `log`, `tmp`, hay `pid`; hay các tài liệu được tạo ra tự động,... Tạo một tập tin `.gitignore` trước khi bắt đầu làm việc là một ý tưởng tốt, như vậy bạn sẽ không vô tình commit các tập tin mà bạn không muốn.

Quy tắc cho các mẫu có thể sử dụng trong `.gitignore` như sau:

*	Dòng trống hoặc bắt đầu với `#` sẽ được bỏ qua.
*	Các mẫu chuẩn toàn cầu hoạt động tốt.
*	Mẫu có thể kết thúc bằng dấu gạch chéo (`/`) để chỉ định một thư mục.
*	Bạn có thể có "mẫu phủ định" bằng cách thêm dấu cảm thám vào phía trước (`!`).

Các mẫu toàn cầu giống như các biểu thức chính quy (regular expression) rút gọn được sử dụng trong shell. Dấu sao (`*`) khớp với 0 hoặc nhiều ký tự; `[abc]` khớp với bất kỳ ký tự nào trong dấu ngoặc (trong trường hợp này là `a`, `b`, hoặc `c`); dấu hỏi (`?`) khớp với một ký tự đơn; và dấu ngoặc có ký tự được ngăn cách bởi dấu gạch ngang (`[0-9]`) khớp bất kỳ ký tự nào trong khoảng đó (ở đây là từ 0 đến 9).

Đây là một ví dụ của `.gitignore`:

	# a comment - dòng này được bỏ qua
	# không theo dõi tập tin có đuôi .a 
	*.a
	# nhưng theo dõi tập lib.a, mặc dù bạn đang bỏ qua tất cả tập tin .a ở trên
	!lib.a
	# chỉ bỏ qua tập TODO ở thư mục gốc, chứ không phải ở các thư mục con subdir/TODO
	/TODO
	# bỏ qua tất cả tập tin trong thư mục build/
	build/
	# bỏ qua doc/notes.txt, không phải doc/server/arch.txt
	doc/*.txt
	# bỏ qua tất cả tập .txt trong thư mục doc/
	doc/**/*.txt

Mẫu `**/` có mặt từ Git phiên bản 1.8.2 trở lên.

## Xem Các Thay Đổi Staged và Unstaged

Nếu câu lệnh `git status` quá mơ hồ với bạn - bạn muốn biết chính xác cái đã thay đổi là gì, chứ không chỉ là tập tin nào bị thay đổi - bạn có thể sử dụng lệnh `git diff`. Chúng ta sẽ nói về `git diff` chi tiết hơn trong phần sau; nhưng chắc chắn bạn sẽ thường xuyên sử dụng nó để trả lời cho hai câu hỏi sau: Cái bạn đã thay đổi nhưng chưa được staged là gì? Và Những thứ đã được staged để chuẩn bị commit là gì?. Lệnh `git status` chỉ trả lời những câu hỏi trên một cách chung chung, nhưng `git diff` chỉ cho bạn chính xác từng dòng đã được thêm hoặc xoá - hay còn được biết đến như là bản vá (patch).

Giả sử bạn sửa và stage tập tin `README` lại một lần nữa, sau đó là sửa tập `benchmarks.rb` mà không stage nó. Nếu bạn chạy lệnh `status`, bạn sẽ lại nhìn thấy tương tự như sau:

	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#	new file:   README
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#
	#	modified:   benchmarks.rb
	#

Để xem chính xác bạn đã thay đổi nhưng chưa stage những gì, hãy dùng `git diff` không sử dụng tham số nào khác:

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..da65585 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	           @commit.parents[0].parents[0].parents[0]
	         end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	         run_code(x, 'commits 2') do
	           log = git.commits('master', 15)
	           log.size

Câu lệnh này so sánh cái ở trong thư mục làm việc của bạn với cái ở trong khu vực tổ chức (staging). Kết quả cho bạn biết những thứ đã bị thay đổi mà chưa được stage.

Nếu bạn muốn xem những gì bạn đã staged mà chuẩn bị được commit, bạn có thể sử dụng `git diff --cached`. (Từ Git 1.6.1 trở đi, bạn có thể sử dụng `git diff --staged`, có thể sẽ dễ nhớ hơn.) Lệnh này so sánh những thay đổi đã được tổ chức với lần commit trước đó:

	$ git diff --cached
	diff --git a/README b/README
	new file mode 100644
	index 0000000..03902a1
	--- /dev/null
	+++ b/README2
	@@ -0,0 +1,5 @@
	+grit
	+ by Tom Preston-Werner, Chris Wanstrath
	+ http://github.com/mojombo/grit
	+
	+Grit is a Ruby library for extracting information from a Git repository

Một điều quan trọng cần ghi nhớ là chỉ chạy `git diff` không thôi thì nó sẽ không hiển thị cho bạn tất cả thay đổi từ lần comiit trước - mà chỉ có các thay đổi chưa được tổ chức. Điều này có thể gây khó hiểu một chút, bởi vì nếu như bạn đã tổ chức tất cả các thay đổi, `git diff` sẽ không hiện gì cả.

Thêm một ví dụ nữa, nếu như bạn tổ chức tập tin `benchmarks.rb` rồi sau đó mới sửa nó, bạn có thể sử dụng `git diff` để xem các thay đổi đã tổ chức cũng như chưa tổ chức:

	$ git add benchmarks.rb
	$ echo '# test line' >> benchmarks.rb
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#
	#	modified:   benchmarks.rb
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#

Bây giờ bạn có thể sử dụng `git diff` để xem những gì vẫn chưa được tổ chức

	$ git diff
	diff --git a/benchmarks.rb b/benchmarks.rb
	index e445e28..86b2f7c 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -127,3 +127,4 @@ end
	 main()

	 ##pp Grit::GitRuby.cache_client.stats
	+# test line

và `git diff --cached` để xem những gì đã được tổ chức tới thời điểm hiện tại:

	$ git diff --cached
	diff --git a/benchmarks.rb b/benchmarks.rb
	index 3cb747f..e445e28 100644
	--- a/benchmarks.rb
	+++ b/benchmarks.rb
	@@ -36,6 +36,10 @@ def main
	          @commit.parents[0].parents[0].parents[0]
	        end

	+        run_code(x, 'commits 1') do
	+          git.commits.size
	+        end
	+
	        run_code(x, 'commits 2') do
	          log = git.commits('master', 15)
	          log.size

## Commit Thay Đổi

Bây giờ, sau khi đã tổ chức các tập tin theo ý muốn, bạn có thể commit chúng. Hãy nhỡ là những gì chưa được tổ chức - bất kỳ tập tin nào được tạo ra hoặc sửa đổi sau khi chạy lệnh `git add` - sẽ không được commit. Chúng sẽ vẫn ở trạng thái đã thay đổi trên ổ cứng của bạn.
Trong trường hợp này, bạn thấy là từ lần cuối cùng chạy `git status`, tất cả mọi thứ đã được tổ chức thế nên bạn đã sẵn sàng để commit. Cách đơn giản nhất để commit là gõ vào `git commit`:

	$ git commit

Sau khi chạy lệnh này, chương trình soạn thảo do bạn lựa chọn sẽ được mở lên. (Chương trình được chỉ định bằng biến `$EDITOR` - thường là vim hoặc emacs, tuy nhiên bạn có thể chọn bất kỳ chương trình nào khác bằng cách sử dụng lệnh `git config --global core.editor` như bạn đã thấy ở *Chương 1*).

Nó sẽ hiển thị đoạn thông báo sau (trong ví dụ này là màn hình của Vim):

	# Please enter the commit message for your changes. Lines starting
	# with '#' will be ignored, and an empty message aborts the commit.
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       new file:   README
	#       modified:   benchmarks.rb
	~
	~
	~
	".git/COMMIT_EDITMSG" 10L, 283C

Bạn có thể thấy thông báo mặc định có chứa nội dung của lần chạy `git status` cuối cùng được dùng làm chú thích và một dòng trống ở trên cùng. Bạn có thể xoá những chú thích này đi và nhập vào nội dung riêng của bạn cho commit đó, hoặc bạn có thể giữ nguyên như vậy để giúp bạn nhớ được những gì đang commit. (Một cách nữa để nhắc nhở bạn rõ ràng hơn những gì bạn đã sửa là truyền vào tham số -v cho `git commit`. Làm như vậy sẽ đưa tất cả thay đổi như khi thực hiện lệnh diff vào chương trình soạn thảo, như vậy bạn có thể biết chính xác những gì bạn đã làm.) Khi bạn thoát ra khỏi chương trình soạn thảo, Git tạo commit của bạn với thông báo/điệp đó (các chú thích và diff sẽ bị bỏ đi).

Nói cách khác, bạn có thể gõ trực tiếp thông điệp cùng với lệnh `commit` bằng cách thêm vào sau cờ `-m`, như sau:

	$ git commit -m "Story 182: Fix benchmarks for speed"
	[master]: created 463dc4f: "Fix benchmarks for speed"
	 2 files changed, 3 insertions(+), 0 deletions(-)
	 create mode 100644 README

Bây giờ thì bạn đã thực hiện xong commit đầu tiên. Bạn có thể thấy là commit đó hiển thị một số thông tin về chính nó như: nhánh mà bạn commit tới (`master`), mã băm SHA-1 của commit đó, bao nhiêu tập tin đã thay đổi, và thống kê về số dòng đã thêm cũng như xoá trong commit.

Hãy nhớ là commit lưu lại ảnh các tập tin mà bạn chỉ định trong khu vực tổ chức. Bất kỳ tập tin nào không ở trong đó sẽ vẫn giữ nguyên trạng thái là đã sửa (modified); bạn có thể thực hiện một commit khác để thêm chúng vào lịch sử. Mỗi lần thực hiện commit là bạn đang ghi lại ảnh của dự án mà bạn có thể dựa vào đó để so sánh hoặc khôi phục về sau này.

## Bỏ Qua Khu Vực Tổ Chức

Mặc dù tự tổ chức commit theo cách bạn muốn là một cách hay, tuy nhiên đôi khi khu vực tổ chức khiến quy trình làm việc của bạn trở nên phức tạp. Nếu bạn muốn bỏ qua bước này, Git đã cung cấp sẵn cho bạn một "lối tắt". Chỉ cần thêm vào lựa chọn `-a` khi thực hiện `git commit`, Git sẽ tự động thêm tất cả các tập tin đã được theo dõi trước khi thực hiện lệnh commit, cho phép bạn bỏ qua bước `git add`:

	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#
	#	modified:   benchmarks.rb
	#
	$ git commit -a -m 'added new benchmarks'
	[master 83e38c7] added new benchmarks
	 1 files changed, 5 insertions(+), 0 deletions(-)

Hãy chú ý tại sao bạn không phải chạy `git add` với tập tin `benchmarks.rb` trước khi commit trong trường hợp này.

## Xoá Tập Tin

Để xoá một tập tin khỏi Git, bạn phải xoá nó khỏi danh sách được theo dõi (chính xác hơn, xoá nó khỏi khu vực tổ chức) và sau đó commit. Lệnh `git rm` thực hiện điều đó và cũng xoá tập tin khỏi thư mục làm việc vì thế bạn sẽ không thấy nó như là tập tin không được theo dõi trong những lần tiếp theo.

Nếu bạn chỉ đơn giản xoá tập tin khỏi thư mục làm việc, nó sẽ được hiện thị trong phần "Thay đổi không được tổ chức để commit" (hay _unstaged_) khi bạn chạy `git status`:

	$ rm grit.gemspec
	$ git status
	# On branch master
	#
	# Changes not staged for commit:
	#   (use "git add/rm <file>..." to update what will be committed)
	#
	#       deleted:    grit.gemspec
	#

Khi đó, nếu bạn chạy `git rm`, Git sẽ xoá tập tin đó khỏi khu vực tổ chức:

	$ git rm grit.gemspec
	rm 'grit.gemspec'
	$ git status
	# On branch master
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       deleted:    grit.gemspec
	#

Lần commit tới, tập tin đó sẽ bị xoá và không còn được theo dõi nữa. Nếu như bạn đã sửa và thêm tập tin đó vào danh sách, bạn phải ép Git xoá đi bằng cách thêm lựa chọn `-f`. Đây là một chức năng an toàn nhằm ngăn chặn việc xoá nhầm dữ liệu chưa được lưu vào ảnh và nó sẽ không thể được khôi phục từ Git.

Một chức năng hữu ích khác có thể bạn muốn sử dụng đó là giữ tập tin trong thư mục làm việc nhưng không thêm chúng vào khu vực tổ chức. Hay nói cách khác bạn muốn lưu tập tin trên ổ cứng nhưng không muốn Git theo dõi chúng nữa. Điều này đặc biệt hữu ích nếu như bạn quên thêm nó vào tập `.gitignore` và vô tình tổ chức (stage) chúng, ví dụ như một tập tin nhật ký lớn hoặc rất nhiều tập tin `.a`. Để làm được điều này, hãy sử dụng lựa chọn `--cached`:

	$ git rm --cached readme.txt

Bạn có thể truyền vào tập tin, thư mục hay mẫu (patterns) vào lệnh `git rm`. Nghĩa là bạn có thể thực hiện tương tự như:

	$ git rm log/\*.log

Chú ý dấu chéo ngược (`\`) đằng trước `*`. Việc này là cần thiết vì ngoài phần mở rộng mặc định Git còn sử dụng thêm phần mở rộng riêng - "This is necessary because Git does its own filename expansion in addition to your shell’s filename expansion". Trên Windows, dấu gạch ngược (`\`) phải bỏ đi. Lệnh này xoá toàn bộ tập tin có đuôi `.log` trong thư mục `log/`. Hoặc bạn có thể thực hiện tương tự như sau:

	$ git rm \*~

Lệnh này xoá toàn bộ tập tin kết thúc bằng `~`.

## Di Chuyển Tập Tin

Không giống như các hệ thống quản lý phiên bản khác, Git không theo dõi việc di chuyển tập tin một cách rõ ràng. Nếu bạn đổi tên một tập tin trong Git, không có thông tin nào được lưu trữ trong Git có thể cho bạn biết là bạn đã đổi tên một tập tin. 
Tuy nhiên, Git rất thông minh trong việc tìm ra điều đó - chúng ta sẽ nói về phát hiện việc di chuyển các tập tin sau.

Vì thế nên nó hơi khó hiểu khi Git cung cấp lệnh `mv`. Nếu bạn muốn đổi tên một tập tin trong Git, bạn có thể dùng 

	$ git mv file_from file_to

và nó chạy tốt. Thực tế, nếu bạn chạy lệnh tương tự và sau đó kiểm tra trạng thái, bạn sẽ thấy Git coi là nó đã đổi tên một tập tin:

	$ git mv README.txt README
	$ git status
	# On branch master
	# Your branch is ahead of 'origin/master' by 1 commit.
	#
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       renamed:    README.txt -> README
	#

Tuy nhiên, việc này lại tương tự việc thực hiện như sau:

	$ mv README.txt README
	$ git rm README.txt
	$ git add README

Git ngầm hiểu đó là đổi tên, vì thế dù bạn đổi tên bằng cách này hoặc dùng lệnh `mv` cũng không quan trọng. Sự khác biệt duy nhất ở đây là `mv` là một lệnh duy nhất thay vì ba - sử dụng nó thuận tiện hơn rất nhiều. Quan trọng hơn, bạn có thể dùng bất kỳ cách nào để đổi tên một tập tin, và chạy add/rm sau đó, trước khi commit.
