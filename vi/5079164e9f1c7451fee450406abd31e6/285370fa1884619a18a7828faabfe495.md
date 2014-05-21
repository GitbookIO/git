# Mẹo Nhỏ

Trước khi kết thúc chương cơ bản về Git này, có một vài mẹo nhỏ có thể giúp ích cho việc sử dụng Git của bạn trở nên đơn giản và dễ dàng hơn. Có nhiều người vẫn sử dụng Git mà không biết đến những điều này, chúng ta sẽ không đề cập đến chúng hoặc giả định bạn sẽ sử dụng nó khi kết thúc cuốn sách này; tuy nhiên bạn nên biết cách sử dụng chúng.

## Gợi Ý

Nếu bạn đang sử dụng Bash shell (có thể hiểu là cửa sổ dòng lệnh, nhưng cũng nên phân biệt với các loại shell khác: zsh, rc,...), Git cung cấp công cụ gợi ý các lệnh rất tốt mà bạn có thể bật nó lên. Nó có thể được tải về trực tiếp từ mã nguồn của Git tại https://github.com/git/git/blob/master/contrib/completion/git-completion.bash . Sao chép tập tin này vào thư mục home của bạn và thêm dòng sau vào tập tin `.bashrc`:

	source ~/git-completion.bash

Nếu như bạn muốn cài đặt công cụ gợi ý này cho tất cả người dùng trên máy tính của bạn, hãy sao chép đoạn mã này vào thư mục `/opt/local/etc/bash_completion.d` trên máy tính Mac hoặc thư mục `/etc/bash_completion.d/` trên các máy tính chạy Linux. Đây là thư mục chứa các đoạn mã mà Bash sẽ tự động chạy để có thể cung cấp chức năng gợi ý cho bạn. 

Nếu bạn đang sử dụng Git Bash trên Windows - mặc định khi cài đặt Git trên Windows sử dụng msysGit, chức năng gợi ý đã được cấu hình sẵn.

Ấn phím Tab khi bạn gõ một câu lệnh Git, nó sẽ trả về một tập hợp các gợi ý cho bạn chọn:

	$ git co<tab><tab>
	commit config

Trong trường hợp này, gõ `git co` và sau đó gõ Tab hai lần sẽ cho bạn gợi ý commit và config. Gõ thêm `m<tab>` để có được lệnh `git commit` tự động.

Nó cũng hoạt động được với các lựa chọn/tham số, chắc chắn rất hữu ích. Ví dụ như nếu bạn đang chạy lệnh `git log` và không nhớ một trong các lựa chọn, bạn có thể bắt đầu gõ và ấn Tab để xem lệnh nào thỏa mãn:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

Đó là một mẹo rất hay và đôi khi có thể tiết kiệm thời gian đọc tài liệu cho bạn.

## Bí Danh Trong Git

Git không thể phỏng đoán ra câu lệnh nếu như bạn chỉ gõ một phần của câu lệnh đó. Nếu bạn không muốn gõ toàn bộ từng câu lệnh, bạn có thể dễ dàng cài đặt một bí danh (alias) cho mỗi lệnh sử dụng `git config`. Sau đây là một số ví dụ có thể hữu ích cho bạn:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

Có nghĩa là, ví dụ, thay vì phải gõ `git commit`, bạn chỉ cần gõ `git ci`. Khi bạn bắt đầu sử dụng Git, chắc chắn bạn sẽ sử dụng cả các câu lệnh khác một cách thường xuyên; trong trường hợp này, đừng ngần ngại tạo thêm các bí danh mới. 

Kỹ thuật này cũng có thể rất hữu ích trong việc tạo mới các câu lệnh mà bạn cho rằng sự tồn tại của chúng là cần thiết. Ví dụ như, để làm chính xác các vấn đề liên quan đến tính khả dụng mà bạn gặp phải khi bỏ tổ chức (unstaging) một tập tin, bạn có thể tự tạo bí danh riêng cho việc này:

	$ git config --global alias.unstage 'reset HEAD --'

Lệnh này tương đương với hai câu lệnh sau:

	$ git unstage fileA
	$ git reset HEAD fileA

Theo cách này thì nhìn có vẻ rõ ràng hơn. Một bí danh phổ biến khác là lệnh `last`, như sau:

	$ git config --global alias.last 'log -1 HEAD'

Với cách này, bạn có thể xem được commit cuối cùng một cách dễ dàng:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

Bạn cũng có thể tự nhận thấy rằng, Git thay thế lệnh mới với bất cứ tên gì bạn đặt cho nó. Tuy nhiên, cũng có thể bạn muốn chạy một lệnh bên ngoài, hơn là bản thân các lệnh trong Git. Trong trường hợp này, bạn bắt đầu lệnh đó với ký tự `!`. Nó khá hữu ích trong trường hợp bạn viết công cụ riêng của bạn để làm việc với Git. Một ví dụ minh họa là việc tạo bí danh cho `git visual` để chạy `gitk`: 

	$ git config --global alias.visual '!gitk'
