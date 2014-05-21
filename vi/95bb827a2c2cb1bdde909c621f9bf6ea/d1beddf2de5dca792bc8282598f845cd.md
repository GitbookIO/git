# Nhánh Remote

Nhánh từ xa (remote) là các tham chiếu tới trạng thái của các nhánh trên kho chứa trung tâm của bạn. Chúng là các nhánh nội bộ mà bạn không thể di chuyển; chúng chỉ di chuyển một cách tự động mỗi khi bạn thực hiện bất kỳ giao tiếp nào qua mạng lưới. Nhánh remote hoạt động như là các bookmark (dấu) để nhắc nhở bạn các nhánh trên kho chứa trung tâm của bạn ở đâu vào lần cuối cùng bạn kết nối tới.

Chúng có dạng `(remote)/(branch)`. Ví dụ, nếu bạn muốn xem nhánh `master` trên nhánh remote `origin` của bạn như thế nào từ lần giao tiếp cuối cùng, bạn sẽ dùng `origin/master`. Nếu bạn đang giải quyết một vấn đề với đối tác và họ đẩy dữ liệu lên nhánh `iss53`, bạn có thể có riêng nhánh `iss53` trên máy nội bộ; nhưng nhánh trên máy chủ sẽ trỏ tới commit tại `origin/iss53`.

Điều này có thể hơi khó hiểu một chút, vậy hãy cùng xem một ví dụ. Giả sử bạn có một máy chủ Git trên mạng của bạn tại địa chỉ `git.ourcompany.com`. Nếu bạn tạo bản sao từ đây, Git sẽ tự động đặt tên nó là `origin` cho bạn, tải về toàn bộ dữ liệu, tạo một con trỏ tới nhánh `master` và đặt tên nội bộ cho nó là `origin/master`; và bạn không thể di chuyển nó. Git cũng cung cấp cho bạn nhánh `master` riêng, bắt đầu cùng một vị trí với `master` của origin để cho bạn có thể bắt đầu làm việc (xem Hình 3-22).


![](http://git-scm.com/figures/18333fig0322-tn.png)

Hình 3-22. Một bản sao Git cung cấp cho bạn nhánh master riêng và nhánh origin/master trỏ tới nhánh master của origin.

Nếu bạn thực hiện một số thay đổi trên nhánh `master` nội bộ, và cùng thời điểm đó, một người nào đó đẩy lên `git.ourcompany.com` và cập nhật nhánh master của nó, thì lịch sử của bạn sẽ di chuyển về phía trước khác đi. Miễn là bạn không kết nối tới máy chủ thì con trỏ `origin/master` sẽ vẫn không đổi (xem Hình 3-23).


![](http://git-scm.com/figures/18333fig0323-tn.png)

Hình 3-23. Làm việc nội bộ và ai đó đẩy lên máy chủ khiến cho lịch sử thay đổi khác biệt nhau.

Để đồng bộ hóa các thay đổi, bạn chạy lệnh `git fetch origin`. Lệnh này sẽ tìm kiếm máy chủ nào là origin (trong trường hợp này là `git.ourcompany.com`), truy xuất toàn bộ dữ liệu mà bạn chưa có từ đó, và cập nhật cơ sở dữ liệu nội bộ của bạn, di chuyển con trỏ `origin/master` tới vị trí mới được cập nhật (xem Hình 3-24).


![](http://git-scm.com/figures/18333fig0324-tn.png)

Hình 3-24. Lệnh git fetch cập nhật các tham chiếu từ xa.

Để minh họa cho việc có nhiều máy chủ từ xa và các nhánh từ xa của các dự án thuộc các máy chủ đó, giả sử bạn có một máy chủ Git nội bộ khác sử dụng riêng cho các nhóm "thần tốc". Máy chủ này có địa chỉ là `git.team1.ourcompany.com`. Bạn có thể thêm nó như là một tham chiếu từ xa tới dự án bạn đang làm việc bằng cách chạy lệnh `git remote add` như đã giới thiệu ở Chương 2. Đặt tên cho remote đó là `teamone`, đó sẽ là tên rút gọn thay thế cho địa chỉ đầy đủ kia (xem Hình 3-25).


![](http://git-scm.com/figures/18333fig0325-tn.png)

Hình 3-25. Thêm một máy chủ từ xa khác.

Bây giờ bạn có thể chạy lệnh `git fetch teamone` để truy xất toàn bộ nội dung mà bạn chưa có từ máy chủ `teamone`. Bởi vì máy chủ đó có chứa một tập con dữ liệu từ máy chủ `origin` đang có, Git không truy xuất dữ liệu nào cả mà thiết lập một nhánh từ xa mới là `teamone/master` để trỏ tới commit mà `teamone` đang có như là nhánh `master` (xem Hình 3-26).


![](http://git-scm.com/figures/18333fig0326-tn.png)

Hình 3-26. Bạn sẽ có một tham chiếu tới vị trí nội bộ của nhánh `master` của teamone.

## Đẩy Lên

Khi bạn muốn chia sẻ một nhánh với mọi người, bạn cẩn phải đẩy nó lên một máy chủ mà bạn có quyền ghi trên đó. Nhánh nội bộ của bạn sẽ không tự động thực hiện quá trình đồng bộ hóa - mà bạn phải tự đẩy lên cách nhánh mà bạn muốn chia sẻ. Theo cách này, bạn có thể có các nhánh riêng tư cho những công việc mà bạn không muốn chia sẻ, và chỉ đẩy lên các nhánh chủ đề mà bạn muốn mọi người cùng tham gia đóng góp.

Nếu bạn có một nhánh là `serverfix` mà bạn muốn mọi người cùng cộng tác, bạn có thể đẩy nó lên theo cách mà chúng ta đã làm đối với nhánh đầu tiên. Chạy `git push (remote) (branch)`:

	$ git push origin serverfix
	Counting objects: 20, done.
	Compressing objects: 100% (14/14), done.
	Writing objects: 100% (15/15), 1.74 KiB, done.
	Total 15 (delta 5), reused 0 (delta 0)
	To git@github.com:schacon/simplegit.git
	 * [new branch]      serverfix -> serverfix

Đây là một cách làm tắt. Git tự động mở rộng nhánh `serverfix` thành `refs/heads/serverfix:refs/heads/serverfix`, có nghĩa là, "Hãy sử dụng nhánh nội bộ serverfix của tôi và đẩy nó lên để cập nhật nhánh serverfix trên máy chủ từ xa." Chúng ta sẽ đi sâu vào phần `refs/heads/` ở Chương 9, nhưng bạn thường có thể bỏ qua nó. Bạn cũng có thể chạy lệnh sau `git push origin serverfix:serverfix`, cách này cũng cho kết quả tương tự - nó có nghĩa là "Hãy sử dụng serverfix của tôi để tạo một serverfix trên máy chủ". Bạn có thể sử dụng định dạng này để đẩy một nhánh nội bộ lên một nhánh từ xa với một tên khác. Nếu bạn không muốn gọi nó là `serverfix` trên máy chủ, bạn có thể chạy lệnh sau `git push origin serverfix:awesomebranch` để đẩy nhánh nội bộ `serverfix` vào nhánh `awesomebranch` trên máy chủ trung tâm. 

Lần tới một trong các đồng nghiệp của bạn truy xuất nó từ trên máy chủ, họ sẽ có một tham chiếu tới phiên bản trên máy chủ của `serverfix` dưới tên `origin/serverfix`:

	$ git fetch origin
	remote: Counting objects: 20, done.
	remote: Compressing objects: 100% (14/14), done.
	remote: Total 15 (delta 5), reused 0 (delta 0)
	Unpacking objects: 100% (15/15), done.
	From git@github.com:schacon/simplegit
	 * [new branch]      serverfix    -> origin/serverfix

Điều quan trọng cần chú ý ở đây là khi bạn truy xuất dữ liệu từ máy chủ mà có kèm theo nhánh mới, Git sẽ không tự động tạo phiên bản nội bộ của nhánh đó. Nói cách khác, trong trường hợp này, bạn sẽ không có nhánh `serverfix` mới - bạn chỉ có một con trỏ tới `origin/serverfix` mà bạn không thể chỉnh sửa.

Để tích hợp công việc hiện tại vào nhánh bạn đang làm việc, bạn có thể chạy `git merge origin/serverfix`. Nếu bạn muốn nhánh `serverfix` riêng để có thể làm việc trên đó, bạn có thể tách nó ra khỏi nhánh trung tâm bằng cách:

	$ git checkout -b serverfix origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Cách này sẽ tạo cho bạn một nhánh nội bộ mà bạn có thể làm việc, bắt đầu cùng một vị trí với `origin/serverfix`.

## Theo Dõi Các Nhánh

Check out một nhánh nội bộ từ một nhánh trung tâm tự động tạo ra một _tracking branch_. Tracking branches là các nhánh nội bộ có liên quan trực tiếp với một nhánh trung tâm. Nếu bạn đang ở trên một tracking branch và chạy `git push`, Git tự động biết nó sẽ phải đẩy lên nhánh nào, máy chủ nào. Ngoài ra, chạy `git pull` khi đang ở trên một trong những nhánh này sẽ truy xuất toàn bộ các tham chiếu từ xa và sau đó tự động tích hợp chúng với các nhánh từ xa tương ứng.

Khi bạn tạo bản sao của một kho chứa, thông thường Git tự động tạp một nhánh `master` để theo dõi `origin/master`. Đó là lý do tại sao `git push` và `git pull` có thể chạy tốt mà không cần bất kỳ tham số nào. Tuy nhiên, bạn có thể cài đặt các tracking branch khác nếu muốn - các nhánh này không theo dõi nhánh trên `origin` cũng như `master`. Một ví dụ đơn giản giống như bạn vừa thấy: `git checkout -b [branch] [remotename]/[branch]`. Nếu bạn đang sử dụng Git phiên bản 1.6.2 trở lên, bạn có thể sử dụng `--track`:

	$ git checkout --track origin/serverfix
	Branch serverfix set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "serverfix"

Để cài đặt một nhánh nội bộ sử dụng tên khác với tên mặc định trên nhánh trung tâm, bạn có thể dễ dàng sử dụng phiên bản đầu tiên với một tên nội bộ khác:

	$ git checkout -b sf origin/serverfix
	Branch sf set up to track remote branch refs/remotes/origin/serverfix.
	Switched to a new branch "sf"

Bây giờ, nhánh nội bộ sf sẽ tự động "kéo và đẩy" từ origin/serverfix.

## Xóa Nhánh Trung Tâm

Giả sử bạn và đồng nghiệp đã hoàn thành một chức năng nào đó và đã tích hợp nó vào nhánh `master` trung tâm (hoặc bất kỳ nhánh nào khác sử dụng cho việc lưu trữ các phiên bản ổn định). Bạn có thể xóa một nhánh trung tâm đi sử dụng cú pháp sau `git push [remotename] :[branch]`. Nếu bạn muốn xóa nhánh `serverfix` trên máy chủ, bạn có thể chạy lệnh sau:

	$ git push origin :serverfix
	To git@github.com:schacon/simplegit.git
	 - [deleted]         serverfix

Vậy là đã xong, nhánh đó đã bị xóa khỏi máy chủ. Có thể bạn muốn đánh dấu trang này lại, vì bạn sẽ cần đến câu lệnh này và có thể bạn sẽ quên cú pháp của nó. Một cách để nhớ lệnh này là xem lại cú pháp chúng ta đã nhắc tới trước đó `git push [remotename] [localbranch]:[remotebranch]`. Nếu bạn bỏ qua phần `[localbranch]`, thì cơ bản bạn đang thực hiện "Không sử dụng gì từ phía nội bộ để tạo nhánh `[remotebranch]`."
