# Quản Lý Các Nhánh

Bạn đã tạo mới, tích hợp, và xóa một số nhánh, bây giờ hãy cùng xem một số công cụ giúp việc quản lý nhánh trở nên dễ dàng hơn khi tần suất sử dụng nhánh của bạn ngày càng nhiều.

Lệnh `git branch` thực hiện nhiều việc hơn là chỉ tạo và xóa nhánh. Nếu bạn chạy nó không có tham số, bạn sẽ có danh sách của tất cả các nhánh hiện tại:

	$ git branch
	  iss53
	* master
	  testing

Lưu ý về  ký tự `*` đứng trước nhánh `master`: nó chỉ cho bạn thấy nhánh mà bạn đang làm việc (Checkout). Có nghĩa là nếu bạn commit ở thời điểm hiện tại, thì nhánh `master` sẽ di chuyển tiến lên phía trước với các thay đổi mới. Để xem commit mới nhất trên từng nhánh, bạn có thể chạy lệnh `git branch -v`:

	$ git branch -v
	  iss53   93b412c fix javascript issue
	* master  7a98805 Merge branch 'iss53'
	  testing 782fd34 add scott to the author list in the readmes

Một lựa chọn hữu ích khác để tìm ra trạng thái của các nhánh là lọc qua các nhánh bạn đã hoặc chưa tích hợp vào nhánh hiện tại. Các lựa chọn để sử dụng cho mục đích này gồm `--merged` và `--no-merged`. Để biết nhánh nào đã được tích hợp vào nhánh hiện tại, bạn có thể sử dụng `git branch --merged`:

	$ git branch --merged
	  iss53
	* master

Bởi vì bạn đã tích hợp nhánh `iss53` vào trước đó, bạn sẽ thấy nó ở trong danh sách này. Cách nhánh trong danh sách không có dấu `*` ở phía trước thường an toàn để xóa bằng cách sử dụng `git branch -d`; bạn đã tích hợp các thay đổi trong đó vào một nhánh khác, vì thế bạn sẽ không hề bị mất bất cứ dữ liệu gì.

Để xem cách nhánh chứa các công việc/thay đổi chưa được tích hợp vào, bạn có thể chạy lệnh `git branch --no-merged`:

	$ git branch --no-merged
	  testing

Lệnh này lại hiện thị các nhánh khác. Bởi vì chúng bao gồm các công việc mà bạn chưa tích hợp vào, xóa nó đi bằng lệnh `git branch -d` sẽ báo lỗi:

	$ git branch -d testing
	error: The branch 'testing' is not an ancestor of your current HEAD.
	If you are sure you want to delete it, run 'git branch -D testing'.

Nếu bạn thực sự muốn xóa nó đi và chấp nhận mất các thay đổi, bạn có thể bắt buộc bằng cách sử dụng tham số `-D`, như hướng dẫn trong thông báo trên.
