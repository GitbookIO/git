# Về Quản Lý Phiên Bản

Quản lý phiên bản (mã nguồn) là gì, tại sao bạn nên quan tâm? Quản lý phiên bản là một hệ thống lưu trữ các thay đổi của một tập tin (file) hoặc tập hợp các tập tin theo thời gian, do đó nó giúp bạn có thể quay lại một phiên bản xác định nào đó sau này. Mặc dù các ví dụ trong cuốn sách này sử dụng mã nguồn của phần mềm là đối tượng cho quản lý phiên bản, song trong thực thế bất kỳ loại file nào trên máy tính cũng có thể được sử dụng cho quản lý phiên bản.

Nếu bạn là một nhà thiết kế đồ hoạ hoặc thiết kế website, bạn muốn lưu trữ tất cả các phiên bản của một bức ảnh hoặc bố cục (cái mà chắc chắn bạn cần), thì sử dụng một Hệ Thống Quản Lý phiên bản (Version Control System - VCS) là một cách làm rất khôn ngoan. Một VCS cho phép bạn: khôi phục lại phiên bản cũ của các file, khôi phục lại phiên bản cũ của toàn bộ dự án, xem lại các thay đổi đã được thực hiện theo thời gian, xem ai là người thực hiện thay đổi cuối cùng có thể gây ra sự cố, hay xem ai là người đã gây ra sự cố đó và còn nhiều hơn thế nữa. Sử dụng VCS còn đồng nghĩa với việc khi bạn làm rối tung mọi thứ lên hay vô tình xoá mất các file đi, bạn có khôi phục lại chúng một cách dễ dàng. Hơn nữa, tất cả quá trình này có thể được thực hiện rất nhanh chóng và không hề tốn quá nhiều công sức.

## Hệ Thống Quản Lý Phiên Bản Cục Bộ

Nhiều người chọn phương pháp quản lý phiên bản bằng cách copy các file sang một thư mục khác (có thể là các thư mục được đặt tên theo thời gian, nếu họ thông minh). Đây là một phương pháp rất phổ biến bởi vì nó rất đơn giản, tuy nhiên nó cũng rất dễ gây ra lỗi. Bạn sẽ rất dễ quên rằng bạn đang ở trong thư mục nào hay vô tình sửa hoặc sao chép nhầm file mà bạn không muốn.

Để giải quyết vấn đề này, từ lâu các lập trình viên đã phát triển các phiên bản VCS cục bộ có chứa một database đơn giản lưu trữ tất cả các sự thay đổi của các files dưới sự kiểm soát thay đổi (xem Hình 1-1).


![](http://git-scm.com/figures/18333fig0101-tn.png)

Hình 1-1. Mô hình quản lý phiên bản cục bộ.

Một trong những hệ thống quản lý phiên bản phổ biến hơn có tên là rcs vẫn còn được sử dụng ở nhiều máy tính cho tới bây giờ. Ngay cả hệ điều hành Mac OS X nổi tiếng cũng đưa vào các lệnh rcs khi bạn cài đặt Developer Tools (Các công cụ dành cho lập trình viên). Phần mềm này cơ bản hoạt động bằng cách lưu giữ các bản vá (những sự thay đổi giữa các file) từ phiên bản này qua phiên bản khác ở một định dạng đặc biệt được lưu trên ổ cứng; nó có thể tái tạo lại bất kỳ file nào ở bất kỳ thời điểm nào bằng cách gộp tất cả các bản vá lại với nhau.

## Hệ Thống Quản Lý Phiên Bản Tập Trung

Vấn đề nghiêm trọng tiếp theo mà mọi người thường mắc phải là họ cần cộng tác với các lập trình viên khác trong hệ thống. Để vượt qua trở ngại này, Hệ Thống Quản Lý Phiên Bản Tập Trung (Centralized Version Control Systems - CVCSs) được phát triển. Các hệ thống này, ví dụ như CVS, Subversion, và Perforce, bao gồm một máy chủ có chứa tất cả các tập tin đã được "phiên bản hoá" (versioned), và danh sách các máy khách có quyền thay đổi các tập tin này trên máy chủ trung tâm đó. Trong vòng nhiều năm, mô hình này đã trở thành tiêu chuẩn cho việc quản lý phiên bản (xem Hình 1-2). 


![](http://git-scm.com/figures/18333fig0102-tn.png)

Hình 1-2. Mô hình quản lý phiên bản tập trung.

Mô hình này cung cấp rất nhiều lợi thế, đặc biết so với việc quản lý cục bộ. Ví dụ, tất cả người dùng đều biết một phần nào đó những việc mà những người khác trong dự án đang làm. Người quản lý có quyền quản lý ai có thể làm gì theo ý muốn; và việc này dễ dàng hơn nhiều so với việc phải quản lý ở từng cơ sở dử liệu ở từng máy riêng biệt.

Tuy nhiên, mô hình này cũng có những bất cập nghiêm trọng. Dễ nhận thấy nhất đó là "sự cố tập trung" mà máy chủ trung tâm mắc phải. Nếu máy chủ đó không hoạt động trong một giờ, nghĩa là trong khoảng thời gian đó không ai có thể cộng tác với những người còn lại hoặc lưu trữ các thay đổi đã được phiên bản hoá của bất kỳ tập tin nào mà người đó đang thao tác. Nếu ổ cứng lưu trữ cơ sở dữ liệu trung tâm bị hỏng, và các sao lưu dự phòng chưa được tạo ra tính đến thời điểm đó, bạn sẽ mất toàn bộ lịch sử của dự án đó, ngoại trừ những phiên bản cục bộ mà người dùng có được trên máy tính cá nhân. Các hệ thống quản lý phiên bản cục bộ phải đối diện với vấn đề tương tự như thế này mỗi khi toàn bộ lịch sử của dự án được lưu ở một nơi, bạn có nguy cơ mất tất cả.

## Hệ Thống Quản Lý Phiên Bản Phân Tán

Đã tới lúc cần tới các Hệ Thống Quản Lý Phiên Bản Phân Tán - Distributed Version Control Systems (DVCSs). Trong các DVCS (ví dụ như Git, Mercurial, Bazaar hay Darcs), các máy khách không chỉ "check out" (sao chép về máy cục bộ) phiên bản mới nhất của các tập tin: chúng sao chép (mirror) toàn bộ kho chứa (repository). Chính vì vậy nếu như một máy chủ nào mà các hệ thống quản lý phiên bản này (mỗi máy khách là một hệ thống riêng biệt) đang cộng tác ngừng hoạt động, thì kho chứa từ bất kỳ máy khách nào cũng có thể dùng để sao chép ngược trở lại máy chủ để khôi phục lại toàn bộ hệ thống. Mỗi checkout thực sự là một bản sao đầy đủ của tất cả dữ liệu (xem Hình 1-3).


![](http://git-scm.com/figures/18333fig0103-tn.png)

Hình 1-3. Mô hình quản lý phiên bản phân tán.

Ngoài ra, phần lớn các hệ thống này xử lý rất tốt việc quản lý nhiều kho chứa từ xa, vì thế bạn có thể cộng tác với nhiều nhóm người khác nhau theo những cách khác nhau trong cùng một dự án. Việc này cho phép bạn cài đặt nhiều loại "tiến trình công việc" (workflow) không thể thực hiện được với các hệ thống tập trung, ví dụ như các mô hình phân cấp.
