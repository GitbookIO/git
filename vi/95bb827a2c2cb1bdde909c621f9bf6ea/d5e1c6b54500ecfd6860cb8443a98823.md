# Quy Trình Làm Việc Phân Nhánh

Bây giờ bạn đã có được các kiến thức cơ bản về phân nhánh và tích hợp, vậy bạn có thể hay nên làm gì với chúng. Trong phần này, chúng ta sẽ đề cập tới một số quy trình làm việc phổ biến áp dụng phân nhánh, vì thế bạn có thể tự quyết định có áp dụng chúng vào quy trình làm việc riêng của bạn hay không.

## Nhánh Lâu Đời

Bởi vì Git sử dụng tích hợp 3 chiều đơn giản, nên tích hợp từ nhánh này vào nhánh khác nhiều lần trong cùng một giai đoạn thường dễ dàng. Có nghĩa là bạn có thể có nhiều nhánh luôn mở và sử dụng chúng cho các giai đoạn phát triển khác nhau; bạn có thể tích hợp từ một số nhánh nào đó vào các nhánh khác một cách thường xuyên.

Nhiều lập trình viên Git sử dụng quy trình làm việc dựa theo phương pháp này, chẳng hạn như chỉ chứa mã nguồn ổn định hoàn toàn ở nhánh `master` - hầu như là mã nguồn đã phát hành hoặc chuẩn bị phát hành. Họ có một nhánh song song khác có tên develop hoặc next, nơi mà họ làm việc hoặc sử dụng để kiểm tra độ ổn định - nó không nhất thiết luôn luôn phải ổn định, tuy nhiên mỗi khi nó đạt được trạng thái ổn định, nó sẽ được tích hợp vào nhánh `master`. Chúng được sử dụng với vai trò là các nhánh chủ đề (topic branch) - các nhánh có vòng đời ngắn, giống như nhánh `iss53` trước đó - để đảm bảo chúng qua được các bài kiểm tra và không gây ra lỗi.

Trong thực tế, chúng ta đang nói về các con trỏ di chuyển dọc theo đường thẳng của các commit. Các nhánh ổn định hơn thường ở phía cuối của đường thẳng, còn các nhánh đang phát triển thường ở phía đầu hàng (xem Hình 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)

Hình 3-18. Nhánh ổn định hơn thường ở phía cuối hàng trong lịch sử commit.

Sẽ dễ hình dung hơn khi nghĩ về chúng như là các xi-lô, nơi mà tập hợp các commit cô đặc dần thành một xi-lô ổn định hơn khi đã được kiểm tra đầy đủ (xem Hình 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)

Hình 3-19. Có lẽ sẽ dễ hiểu hơn khi coi các nhánh là các xi-lô.

Bạn có thể tiếp tục làm theo cách này cho nhiều tầng ổn định khác nhau. Nhiều dự án lớn có nhánh `proposed` hoặc `pu` (proposed updates) được sử dụng cho các nhánh chưa đủ điều kiện để tích hợp vào `next` hoặc `master`. Ý tưởng ở đây là, các nhánh ở các tầng khác nhau của sự ổn định; khi chúng đạt tới một mức ổn định hơn nào đó, chúng sẽ được tích hợp vào tầng trên nó. 
Tóm lại, có nhiều nhánh tồn lại lâu dài không thật sự cần thiết, nhưng nó thường rất hữu ích, đặc biệt là khi bạn làm việc với các dự án lớn và phức tạp.

## Nhánh Chủ Đề

Nhánh chủ đề (topic branches) thì ngược lại, nó lại khá hữu ích cho các dự án ở bất kỳ cỡ nào. Một nhánh chủ đề là nhánh có vòng đời ngắn mà bạn tạo để phát triển một tính năng nào đó hoặc tương tự. Nó giống như một thứ gì đó mà bạn chưa từng làm với một VCS trước đây bởi vì nhìn chung nó đòi hỏi rất nhiều nỗ lực để tạo mới cũng như tích hợp các nhánh lại với nhau.

Như bạn đã thấy trong phần trước với các nhánh `iss53` và `hotfix` bạn đã tạo ra. Bạn thực hiện một số commit trên đó và xóa chúng đi ngay sau khi tính hợp chúng lại với nhánh chính. Kỹ thuật này cho phép bạn chuyển ngữ cảnh một cách nhanh chóng và toàn diện - vì công việc của bạn tách biệt hoàn toàn ở các xi-lô nơi mà tất cả các thay đổi ở nhánh đó chỉ liên quan đến chủ đề đó, điều này khiến cho việc xem xét lại (review) mã nguồn hoặc tương tự trở nên dễ dàng hơn rất nhiều. Bạn có thể giữ các thay đổi ở đó trong bất kỳ khoảng thời gian nào bạn muốn, có thể tính bằng phút, ngày, hoặc tháng, và sau đó tích hợp lại khi chúng đã sẵn sàng, không quan trọng thứ tự chúng được tạo ra hay làm việc.

Hãy cùng xét một ví dụ về thực hiện một số công việc (trên nhánh `master`), tạo nhánh cho một vấn đề cần giải quyết (`iss91`), làm việc trên đó một chút, tạo một nhánh thứ hai cùng giải quyết vấn đề đó nhưng theo một cách khác (`iss91v2`), quay trở lại nhánh `master` và làm việc trong một khoảng thời gian nhất định, sau đó tạo một nhánh khác từ đó cho một ý tưởng mà bạn không chắc chắn là nó có phải là ý hay hay không (nhánh `dumbidea`). Lúc này lịch sử commit của bạn sẽ giống Hình 3-20.


![](http://git-scm.com/figures/18333fig0320-tn.png)

Hình 3-20. Lịch sử commit với nhiều nhánh chủ đề.

Bây giờ, giả sử bạn quyết định lựa chọn cách giải quyết thứ hai (`iss91v2`); và bạn trình bày ý tưởng `dumbidea` cho các đồng nghiệp, điều mà bạn không ngờ tới rằng mọi người lại cho đó là một ý tưởng tuyệt vời. Bạn đã có thể bỏ đi nhánh ban đầu `iss91` (mất commit C5 và C6) và tích hợp hai commit còn lại. Lịch sử của bạn lúc này sẽ giống Hình 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)

Hình 3-21. Lịch sử commit sau khi tích hợp dumbidea và iss91v2.

Ghi nhớ một điều quan trọng là khi bạn làm tất cả những việc này, các nhánh hoàn toàn nằm ở máy nội bộ. Khi bạn phân nhánh và tích hợp, tất cả mọi thứ xảy ra trên kho chứa Git của bạn - không có giao tiếp tới máy chủ nào xảy ra.
