# Phục Hồi

Tại thời điểm bất kỳ, bạn có thể muốn phục hồi (undo) một phần nào đó. Bây giờ, chúng ta sẽ cùng xem xét một số công cụ cơ bản dùng cho việc phục hồi các thay đổi đã thực hiện. Hãy cẩn thận, bởi vì không phải lúc nào bạn cũng có thể làm được điều này. Đây là một trong số ít thuộc thành phần của Git mà bạn có thể mất dữ liệu nếu làm sai.

## Thay Đổi Commit Cuối Cùng

Một trong những cách phục hồi phổ biến thường dùng khi bạn commit quá sớm/vội và có thể quên thêm vào đó một số tập tin hoặc là thông điệp commit không như ý muốn. Nếu như bạn muốn thực hiện lại commit đó, bạn có thể chạy lệnh commit với tham số `--amend`:

	$ git commit --amend

Lệnh này sử dụng khu vực tổ chức để commit. Nếu bạn không thay đổi gì thêm từ lần commit cuối cùng (ví dụ, bạn chạy lệnh này ngay lập tức sau commit trước đó), thì ảnh của dự án sẽ vẫn như vậy và tất cả những gì bạn thay đổi là thông điệp của commit.

Trình soạn thảo văn bản xuất hiện để bạn thay đổi thông điệp của commit, nhưng nó đã chứa nội dung thông điệp của commit trước đó. Bạn có thể sửa nội dung như thường lệ, và nó sẽ được ghi đè lên commit trước đó.

Ví dụ, nếu như bạn thực hiện xong commit và rồi sau đó mới nhận ra rằng đã quên tổ chức các thay đổi trong tập tin bạn muốn để thêm vào commit đó, bạn có thể chạy lệnh sau:

	$ git commit -m 'initial commit'
	$ git add forgotten_file
	$ git commit --amend

Sau khi chạy ba lệnh này, kết quả cuối cùng cũng vẫn chỉ là một commit - commit thứ hai sẽ thay thế các kết quả của commit trước đó.

## Loại Bỏ Tập Tin Đã Tổ Chức

Hai phần tiếp theo sẽ minh hoạ cho bạn thấy làm sao để thoả hiệp các thay đổi giữa khu vực tổ chức và thư mục làm việc. Cái hay ở đây là câu lệnh sử dụng để xác định trạng thái của hai khu vực đồng thời cũng gợi ý cho bạn làm sao thể phục hồi các thay đổi. Ví dụ như, giả sự bạn sửa nội dung của hai tập tin và muốn commit chúng làm hai lần riêng biệt nhau, nhưng bạn đã vô tình sử dụng `git add *` và tổ chức cả hai. Vậy làm thể nào để loại bỏ một trong hai khỏi khu vực tổ chức? Lệnh `git status` sẽ giúp bạn:

	$ git add .
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#       modified:   benchmarks.rb
	#

Ngay dưới phần "Thay đổi sắp được commit", nó chỉ ra rằng "sử dụng `git reset HEAD <file>...` để loại bỏ khỏi khu vực tổ chức". Vậy thì hãy làm theo gợi ý đó để loại bỏ tập tin `benchmarks.rb`:

	$ git reset HEAD benchmarks.rb
	benchmarks.rb: locally modified
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#
	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Lệnh này hơi khác biệt một chút, nhưng nó hoạt động đúng như chúng ta mong đợi. Tập tin `benchmarks.rb` được thay đổi và một lần nữa lại trở thành chưa tổ chức.

## Phục Hồi Tập Tin Đã Thay Đổi

Sẽ như thế nào khi bạn nhận ra rằng bạn không muốn giữ những thay đổi trong tập tin `benchmarks.rb`? Làm thế nào để dễ dàng phục hồi lại những thay đổi đó - phục hồi nó lại trạng thái giống như sau khi thực hiện commit cuối cùng (hoặc như sau khi sao chép (initialy cloned), hoặc như lúc bạn mới đưa chúng vào thư mục làm việc)? May mắn là, `git status` cũng sẽ cho bạn biết làm sao để thực hiện được việc đó. Trong thông báo đầu ra của ví dụ vừa rồi, khu vực tổ chức của chúng ta như sau:

	# Changes not staged for commit:
	#   (use "git add <file>..." to update what will be committed)
	#   (use "git checkout -- <file>..." to discard changes in working directory)
	#
	#       modified:   benchmarks.rb
	#

Nó chỉ cho bạn rõ ràng làm sao thể hủy những thay đổi vừa được thực hiện (ít nhất, phiên bản mới nhất của Git, 1.6.1 và mới hơn, hỗ trợ điều này - nếu bạn đang sử dụng phiên bản cũ hơn, chúng tôi khuyên bạn nên nâng cấp để có thể sử dụng được những các chức năng có tính khả dụng cao hơn). Hãy làm theo hướng dẫn:

	$ git checkout -- benchmarks.rb
	$ git status
	# On branch master
	# Changes to be committed:
	#   (use "git reset HEAD <file>..." to unstage)
	#
	#       modified:   README.txt
	#

Bạn có thể thấy những thay đổi mà bạn vừa mới phục hồi. Bạn cũng nên nhận ra rằng đây là một câu lệnh nguy hiểm: bất kỳ thay đổi nào được thực hiện trên tập tin đó không còn nữa - bạn vừa mới sao chép một tập tin khác thay thế nó. Đừng nên sử dụng lệnh này trừ khi bạn biết rõ ràng rằng bạn không cần đến tập tin đó. Nếu bạn chỉ không muốn thấy nó nữa, chúng ta sẽ tìm hiểu về phân nhánh và lưu trữ (stashing) trong chương sau; chúng là các phương pháp thay thế tốt hơn. 

Hãy nhớ là, bất cứ thứ gì đuợc commit vào Git luôn có thể phục hồi lại. Thậm chí cả các commit ở các nhánh đã bị xoá hoặc bị ghi đè bởi `--amend` (xem thêm về phục hồi dữ liệu ở *Chuơng 9*). Tuy nhiên, bất cứ thứ gì bị mất mà chưa đuợc commit thì không có cơ hội phục hồi lại.
