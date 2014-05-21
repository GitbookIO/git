# Tạo Một Kho Chứa Git

Bạn có thể tạo một dự án có sử dụng Git dựa theo hai phương pháp chính. Thứ nhất là dùng một dự án hay một thư mục đã có sẵn để nhập (import) vào Git. Thứ hai là tạo bản sao của một kho chứa Git đang hoạt động trên một máy chủ khác.

## Khởi Tạo Một Kho Chứa Từ Thư Mục Cũ

Nếu như bạn muốn theo dõi một dự án cũ trong Git, bạn cần ở trong thư mục của dự án đó và gõ lệnh sau:

	$ git init

Lệnh này sẽ tạo một thư mục mới có tên `.git`, thư mục này chứa tất cả các tập tin cần thiết cho kho chứa - đó chính là bộ khung/xương của kho chứa Git. Cho tới thời điểm hiện tại, vẫn chưa có gì trong dự án của bạn được theo dõi (track) hết. (Xem *Chương 9* để biết chính xác những tập tin gì có trong thư mục `.git` bạn vừa tạo.)

Nếu bạn muốn kiếm soát phiên bản cho các tập tin có sẵn (đối lập với một thư mục trống), chắc chắn bạn nên bắt đầu theo dõi các tập tin đó và thực hiện commit đầu tiên/khởi tạo (initial commit). Bạn có thể hoàn thành việc này bằng cách chỉ định tập tin bạn muốn theo dõi trong mỗi lần commit sử dụng câu lệnh `git add`:

	$ git add *.c
	$ git add README
	$ git commit -m 'phiên bản đầu tiên/khởi tạo của dự án'

Chúng ta sẽ xem những lệnh này thực hiện những gì trong chốc lát nữa. Bâu giờ thì bạn đã có một kho chứ Git với các tập tin đã được theo dõi và một lần commit đầu tiên.

## Sao Chép Một Kho Chứa Đã Tồn Tại

Nếu như bạn muốn có một bản sao của một kho chứa Git có sẵn - ví dụ như, một dự án mà bạn muốn đóng góp vào - câu lệnh bạn cần là `git clone`. Nếu như bạn đã quen thuộc với các hệ thống VCS khác như là Subversion, bạn sẽ nhận ra rằng câu lệnh này là `clone` chứ không phải `checkout`. Đây là một sự khác biệt lớn - Git nhận một bản sao của gần như tất cả dữ liệu mà máy chủ đang có. Mỗi phiên bản của mỗi tập tin sử dụng cho lịch sử của dự án được kéo về khi bạn chạy `git clone`. Thực tế, nếu ổ cứng máy chủ bị hư hỏng, bạn có thể sử dụng bất kỳ bản sao trên bất kỳ máy khách nào để khôi phục lại trạng thái của máy chủ khi nó được sao chép (bạn có thể mất một số tập tin phía máy chủ, nhưng tất cả phiên bản của dữ liệu vẫn tồn tại ở đó - xem chi tiết ở *Chương 4*).

Sử dụng lệnh `git clone [url]` để sao chép một kho chứa. Ví dụ, nếu bạn muốn tạo một bản sao của thư viện Ruby Git có tên Grit, bạn có thể thực hiện như sau:

	$ git clone git://github.com/schacon/grit.git

Một thư mục mới có tên `grit` sẽ được tạo, kèm theo thư mục `.git` và bản sao mới nhất của tất cả dữ liệu của kho chứa đó bên trong. Nếu bạn xem bên trong thư mục `grit`, bạn sẽ thấy các tập tin của dự án bên trong, và đã sẵn sàng cho bạn làm việc hoặc sử dụng. Nếu bạn muốn sao chép kho chứa này vào một thư mục có tên khác không phải là grit, bạn có thể chỉ định tên thư mục đó như là một tuỳ chọn tiếp theo khi chạy dòng lệnh:

	$ git clone git://github.com/schacon/grit.git mygrit

Lệnh này thực thi tương tự như lệnh trước, nhưng thư mục của kho chứa lúc này sẽ có tên là `mygrit`.

Bạn có thể sử dụng Git thông qua một số "giao thức truyền tải" (transfer protocol) khác nhau. Ví dụ trước sử dụng giao thức `git://`, nhưng bạn cũng có thể sử dụng `http(s)://` hoặc `user@server:/path.git` thông qua giao thức SSH. *Chương 4* sẽ giới thiệu tất cả các tuỳ chọn áp dụng trên máy chủ để nó có thể truy cập vào kho chứa Git của bạn cũng như từng ưu và nhược điểm riêng của chúng.
