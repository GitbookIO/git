# Làm Việc Từ Xa

Để có thể cùng cộng tác với các thành viên khác trên bất kỳ dự án sử dụng Git nào, bạn cần phải biết quản lý các kho chứa của bạn. Các kho chứa từ xa là các phiên bản của dự án của bạn, đuợc lưu trữ trên Internet hoặc một mạng luới nào đó. Bạn có thể có nhiều kho chứa khác nhau, thưòng thì bạn có thể chỉ-đọc hoặc đọc/ghi. Cộng tác với các thành viên khác liên quan đến quản lý những kho chứa này và việc kéo, đẩy dữ liệu từ chúng khi bạn cần chia sẻ công việc. Quản lý các kho chứa từ xa đòi hỏi phải biết cách thêm các kho chứa, xoá kho chứa không hợp lệ, quản lý nhiều nhánh khác nhau và xác định có theo dõi chúng hay không, và còn nhiều hơn thế nữa. Trong phần này chúng ta sẽ đề cập đến các kỹ năng quản lý từ xa này.

## Hiển Thị Máy Chủ

Để xem bạn đã cấu hình tới máy chủ từ xa nào, bạn có thể chạy lệnh `git remote`. Nó sẽ liệt kê tên ngắn gọn của mỗi máy chủ từ xa bạn đã chỉ định. 
Nếu bạn sao chép nó từ một kho chứa có sẵn, ít nhất bạn sẽ thấy *bản gốc* (origin) - tên mặc định mà Git đặt cho phiên bản trên máy chủ mà bạn đã sao chép từ đó:

	$ git clone git://github.com/schacon/ticgit.git
	Initialized empty Git repository in /private/tmp/ticgit/.git/
	remote: Counting objects: 595, done.
	remote: Compressing objects: 100% (269/269), done.
	remote: Total 595 (delta 255), reused 589 (delta 253)
	Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
	Resolving deltas: 100% (255/255), done.
	$ cd ticgit
	$ git remote
	origin

Bạn cũng có thể sử dụng tham số `-v` để hiển thị địa chỉ mà Git đã lưu tên rút gọn đó:  

	$ git remote -v
	origin  git://github.com/schacon/ticgit.git (fetch)
	origin  git://github.com/schacon/ticgit.git (push)

Nếu bạn có nhiều hơn một máy chủ từ xa, lệnh này sẽ liệt kê hết tất cả. Ví dụ, kho chứa Grit sẽ hiện thị tuơng tự như sau:

	$ cd grit
	$ git remote -v
	bakkdoor  git://github.com/bakkdoor/grit.git
	cho45     git://github.com/cho45/grit.git
	defunkt   git://github.com/defunkt/grit.git
	koke      git://github.com/koke/grit.git
	origin    git@github.com:mojombo/grit.git

Điều này có nghĩa là bạn có thể "kéo" những đóng góp từ bất kỳ nguời dùng nào ở trên một cách dễ dàng. Nhưng chú ý là chỉ máy chủ nguyên bản từ xa (origin remote) là có địa chỉ SSH, do vậy nó là cái duy nhất mà tôi có thể đẩy lên (chúng ta sẽ tìm hiều tại sao trong *Chuơng 4*).

## Thêm Các Kho Chứa Từ Xa

Tôi đã đề cập và đưa một số ví dụ minh họa về việc thêm mới các kho chứa từ xa trong các phần trước, nhưng bây giờ chúng ta sẽ nói sâu hơn về nó. Để thêm mới một kho chứa Git từ xa như là một tên rút gọn để bạn có thể tham khảo dễ dàng, hãy chạy lệnh `git remote add [shortname] [url]`: 

	$ git remote
	origin
	$ git remote add pb git://github.com/paulboone/ticgit.git
	$ git remote -v
	origin	git://github.com/schacon/ticgit.git
	pb	git://github.com/paulboone/ticgit.git

Bây giờ bạn có thể sử dụng `pb` trong các câu lệnh, nó có tác dụng tương đương với một địa chỉ hoàn chỉnh. Ví dụ, nếu bạn muốn duyệt qua/truy cập tất cả thông tin mà Paul có mà bạn chưa có trong kho chứa, bạn có thể chạy lệnh `git fetch pb`: 

	$ git fetch pb
	remote: Counting objects: 58, done.
	remote: Compressing objects: 100% (41/41), done.
	remote: Total 44 (delta 24), reused 1 (delta 0)
	Unpacking objects: 100% (44/44), done.
	From git://github.com/paulboone/ticgit
	 * [new branch]      master     -> pb/master
	 * [new branch]      ticgit     -> pb/ticgit

Nhánh chính của Paul có thể truy cập cục bộ như là `pb/master` - bạn có thể tích hợp nó vào các nhánh của bạn, hoặc sử dụng nó như là một nhánh cục bộ ở thời điểm đó nếu như bạn muốn kiểm tra nó.  

## Truy Cập Và Kéo Về Từ Máy Chủ Trung Tâm

Như bạn vừa thấy, để lấy dữ liệu của các dự án từ xa về, bạn có thể chạy:

	$ git fetch [remote-name]

Lệnh này sẽ truy cập vào dự án từ xa đó và kéo xuống toàn bộ dữ liệu mà bạn chưa có trong đó cho bạn. Sau khi thực hiện xong bước này, bạn đã có các tham chiếu đến toàn bộ các nhánh của dự án từ xa đó, nơi mà bạn có thể tích hợp hoặc kiểm tra bất kỳ thời điểm nào. (Chúng ta sẽ đề cập chi tiết hơn về nhánh là gì và sử dụng chúng như thế nào ở *Chương 3*.)

Nếu bạn tạo bản sao từ một kho chứa nào đó khác, lệnh này sẽ tự động kho chứa từ xa đó vào dưới tên *origin*. Vì thế, `git fetch origin` sẽ truy xuất (fetch) bất kỳ thay đổi mới nào được đẩy lên trên máy chủ từ sau khi bạn sao chép (hoặc lần truy xuất cuối cùng). Hãy ghi nhớ một điều quan trọng là lệnh `fetch` kéo tất cả dữ liệu về kho chứa trên máy của bạn - nó không tự động tích hợp với bất kỳ thay đổi nào mà bạn đang thực hiện. Bạn phải tích hợp nó một cách thủ không vào kho chứa nội bộ khi đã sẵn sàng.

Nếu bạn có một nhánh được cài đặt để theo dõi một nhánh từ xa khác (xem phần tiếp theo và *Chương 3* để biết thêm chi tiết), bạn có thể sử dụng lệnh `git pull` để tự động truy xuất và sau đó tích hợp nhánh từ xa vào nhánh nội bộ. Đây có thể là cách dễ dàng và thoải mái hơn cho bạn; và mặc định thì, lệnh `git clone` tự động cài đặt nhánh chính nội bộ (local master branch) để theo dõi nhanh chính trên máy chủ từ xa (remote master branch) - nơi mà bạn sao chép về, (giả sử máy chủ từ xa có một nhánh chính). Thường thì khi chạy lệnh `git pull` nó sẽ truy xuất dữ liệu từ máy chủ trung tâm nơi lần đầu bạn sao chép và cố gắng tự động tích hợp chúng vào kho chứa hiện thời nơi bạn đang làm việc. 

## Đẩy Lên Máy Chủ Trung Tâm

Đến một thời điểm nào đó bạn muốn chia sẻ dự án của bạn, bạn phải đẩy ngược nó lên. Câu lệnh để thực hiện rất đơn giản: `git push [tên-máy-chủ] [tên-nhánh]`. Nếu bạn muốn đẩy nhánh master vào nhánh `orgin` trên máy chủ (nhắc lại, khi sao chép Git thường cài đặt/cấu hình mặc định các tên đó cho bạn), bạn có thể chạy lệnh sau để đẩy các công việc đã hoàn thành ngược lại máy chủ: 

	$ git push origin master

Lệnh này chỉ hoạt động nếu bạn sao chép từ một máy chủ mà trên đó bạn được cấp phép quyền ghi và chưa có ai khác đẩy dữ liệu lên tại thời điểm đó. Nếu bạn và ai khác cùng sao chép tại cùng một thời điểm; người kia đẩy ngược lên, sau đó bạn cũng muốn đẩy lên, thì hành động của bạn sẽ bị từ chối ngay tức khắc. Trước hết bạn phải thực hiện kéo các thay đổi mà người đó đã thực hiện và tích hợp/gộp nó vào của bạn, sau đó bạn mới được phép đẩy lên. Xem *Chương 3* để hiểu chi tiết hơn về làm thế nào để đẩy lên máy chủ trung tâm. 

## Kiểm Tra Một Máy Chủ Trung Tâm

Nếu bạn muốn xem chi tiết hơn các thông tin về một kho chứa trung tâm nào đó, bạn có thể sử dụng lệnh `git remote show [tên-trung-tâm]`. Nếu như bạn chạy lệnh này với một tên rút gọn, như là `origin`, bạn sẽ thấy tương tự như sau:

	$ git remote show origin
	* remote origin
	  URL: git://github.com/schacon/ticgit.git
	  Remote branch merged with 'git pull' while on branch master
	    master
	  Tracked remote branches
	    master
	    ticgit

Lệnh này liệt kê địa chỉ của kho chứa trung tâm cũng như thông tin các nhánh đang theo dõi. Nó cho bạn biết rằng nếu như bạn đang ở nhánh master và chạy lệnh git pull, nó sẽ tự động tích hợp nhánh này với nhánh trung tâm sau khi truy xuất toàn bộ các tham chiếu từ xa. Nó cũng liệt kê tất cả các tham chiếu từ xa mà nó đã kéo xuống đó.

Đây là một ví dụ đơn giản mà bạn thường xuyên gặp phải. Khi bạn sử dụng Git thường xuyên hơn, bạn sẽ thường thấy nhiều thông tin hơn từ lệnh `git remote show`:

	$ git remote show origin
	* remote origin
	  URL: git@github.com:defunkt/github.git
	  Remote branch merged with 'git pull' while on branch issues
	    issues
	  Remote branch merged with 'git pull' while on branch master
	    master
	  New remote branches (next fetch will store in remotes/origin)
	    caching
	  Stale tracking branches (use 'git remote prune')
	    libwalker
	    walker2
	  Tracked remote branches
	    acl
	    apiv2
	    dashboard2
	    issues
	    master
	    postgres
	  Local branch pushed with 'git push'
	    master:master

Lệnh này hiển thị nhánh nào tự động được đẩy lên khi bạn chạy `git push` trên một nhánh nhất định. Nó cũng cho bạn thấy nhánh nào trên máy chủ trung tâm mà bạn chưa có, nhánh nào bạn có mà đã bị xóa trên máy chủ, và các nhánh nào sẽ tự động được tích hợp khi chạy lệnh `git pull`. 

## Xóa Và Đổi Tên Từ Xa

Nếu như bạn muốn đổi tên một tham chiếu, trong những phiên bản gần đây của Git bạn có thể chạy `git remote rename` để đổi tên rút gọn cho một kho chứa từ xa nào đó. Ví dụ, nếu bạn muốn đổi tên `pb` thành `paul`, bạn có thể dùng lệnh `git remote rename`:

	$ git remote rename pb paul
	$ git remote
	origin
	paul

Lệnh này đồng thời cũng sẽ thay đổi cả tên các nhánh trung tâm/từ xa của bạn. Các tham chiếu trước đây như `pb/master` sẽ đổi thành `paul/master`.

Nếu bạn muốn xóa một tham chiếu đi vì lý do nào đó - bạn đã chuyển máy chủ và không còn sử dụng một bản sao nhất định, hoặc có thể một người dùng nào đó không còn đóng góp vào dự án nữa - bạn có thể sử dụng `git remote rm`:

	$ git remote rm paul
	$ git remote
	origin
