# Rebasing

Trong Git, có hai cách chính để tích hợp các thay đổi từ nhánh này vào nhánh khác: đó là `merge` và `rebase`. Trong phần này bạn sẽ được tìm hiểu rebase là gì, sử dụng nó như thế nào, tại sao nó được coi là một công cụ khá tuyệt vời, và trong trường hợp nào thì không nên sử dụng nó.

## Cơ Bản về Rebase

Nếu bạn xem lại ví dụ trước trong phần Tích Hợp (xem Hình 3-27), bạn có thể thấy rằng bạn đã phân nhánh công việc của bạn và thực hiện commit trên hai nhánh khác nhau.


![](http://git-scm.com/figures/18333fig0327-tn.png)

Hình 3-17. Lần phân nhánh đầu tiên.

Cách đơn giản nhất để tích hợp các nhánh, như chúng ta đã đề cập từ trước, đó là lệnh `merge`. Nó thực hiện tích hợp 3-chiều giữa hai snapshot mới nhất của hai nhánh (C3 và C4) và cha chung gần nhất của cả hai (C2), tạo mới một snapshot khác (và commit), như trong Hình 3-28.


![](http://git-scm.com/figures/18333fig0328-tn.png)

Hình 3-28. Gộp nhánh lại để hợp nhất công việc bị tách ra trước đây.

Tuy nhiên, còn có một cách khác: bạn có thể sử dụng bản vá của thay đổi được đưa ra ở C3 và áp dụng nó lên trên C4. Trong Git, đây được gọi là _rebasing_. Bằng cách sử dụng lệnh `rebase`, bạn có thể sử dụng tất cả các thay đổi được commit ở một nhánh và "chạy lại" (replay) chúng trên một nhánh khác.

Trong ví dụ này, bạn thực hiện như sau:

	$ git checkout experiment
	$ git rebase master
	First, rewinding head to replay your work on top of it...
	Applying: added staged command

Nó thực hiện bằng cách đi tới commit cha chung của hai nhánh (nhánh bạn đang làm việc và nhánh bạn đang muốn rebase), tìm sự khác biệt trong mỗi commit của nhánh mà bạn đang làm việc, lưu lại các thay đổi đó vào một tập tin tạm thời, khôi phục lại nhánh hiện tại về cùng một commit với nhánh bạn đang rebase, và cuối cùng áp dụng lần lượt các thay đổi. Hình 3-29 minh họa toàn bộ quá trình này.


![](http://git-scm.com/figures/18333fig0329-tn.png)

Hình 3-29. Quá trình rebase thay đổi ở C3 vào C4.

Đến lúc này, bạn có thể quay lại nhánh `master` và thực hiện fast-forward merge (xem Hình 3-30).


![](http://git-scm.com/figures/18333fig0330-tn.png)

Hình 3-30. Di chuyển nhánh master lên phía trước.

Bây giờ snapshot mà C3' trỏ tới cũng giống như snapshot được trở tới bởi C5 trong ví dụ sử dụng merge. Không có sự khác biệt nào khi so sánh kết quả của hai phương pháp này, nhưng sử dụng rebase sẽ cho chúng ta lịch sử rõ ràng hơn. Nếu bạn xem xét lịch sử của nhánh mà chúng ta rebase vào, nó giống như một đường thẳng: mọi thứ dường như xảy ra theo trình tự, thậm chí ban đầu nó diễn ra song song.


Bình thường, bạn sử dụng cách này để đảm bảo rằng các commit được áp dụng một cách rõ ràng, rành mạch trên nhánh remote - có lẽ là một dự án mà bạn đang đóng góp chứ không phải duy trì nó. Trong trường hợp này, bạn thực hiện công việc trên một nhánh và sau đó rebase trở lại nhánh `origin/master` khi đã sẵn sàng. Theo cách này thì người duy trì dự án đó không phải thực hiện việc tích hợp - mà chỉ chi chuyển tiến lên phía trước (fast-forwar) hoặc đơn giản là áp dụng chúng vào.

Lưu ý rằng snapshot được trỏ tới bởi commit cuối cùng, cho dù nó là kết quả của việc rebase hay merge, thì nó vẫn giống nhau - chỉ khác nhau về các bước thực hiện mà thôi. Quá trình rebase được thực hiện bằng cách thực hiện lại các thay đổi từ nhánh này qua nhánh khác theo thứ tự chúng đã được thực hiện, trong khi đó merge lại lấy hai điểm kết thúc và gộp chúng lại với nhau.

## Rebase Nâng Cao

Bạn cũng có thể thực hiện rebase trên một đối tượng khác mà không phải là nhánh rebase. Xem ví dụ Hình 3-31. Bạn tạo một nhánh chủ để (`server`) để thêm một số tính năng server-side vào dự án, và thực hiện một số commit. Sau đó bạn tạo một nhánh khác để thực hiện một số thay đổi cho phía client (`client`) và cũng commit vài lần. Cuối cùng, bạn quay trở lại nhánh server và thực hiện thêm một số commit nữa.


![](http://git-scm.com/figures/18333fig0331-tn.png)

Hình 3-31. Nhánh chủ đề được tạo từ một nhánh chủ đề khác.

Giả sử bạn quyết định tích hợp các thay đổi phía client vào nhánh chính cho bản phát hành sắp tới, nhưng bạn vẫn muốn giữ các thay đổi server-side cho đến khi nó được kiểm tra kỹ lưỡng. Bạn có thể lấy các thay đổi ở client mà không có mặt ở server (C8 và C9) sau đó chạy lại (replay) chúng trên nhánh master bằng cách sử dụng lựa chọn `--onto` cho lệnh `git rebase`:

	$ git rebase --onto master server client

Lệnh này cơ bản nói rằng, "Hãy check out nhánh client, tìm ra các bản vá từ commit chung của nhánh `client` và `server`, sau đó thực thi lại vào nhánh `master`." Nó hơi phức tạp một chút nhưng kết quả như Hình 3-32 thì lại rất tuyệt.


![](http://git-scm.com/figures/18333fig0332-tn.png)

Hình 3-32. Quá trình rebase nhánh chủ đề khỏi một nhánh chủ đề khác.

Bây giờ bạn có thể di chuyển con trỏ của nhánh master tiến lên phía trước (xem Hình 3-33):

	$ git checkout master
	$ git merge client


![](http://git-scm.com/figures/18333fig0333-tn.png)

Hình 3-33. Di chuyển nhánh master lên phía trước để bao gồm các thay đổi của nhánh client.

Giả sử rằng bạn quyết định kéo về cả nhánh trên máy chủ. Bạn có thể rebase nhánh trên máy chủ đó vào nhánh master mà không phải checkout trước bằng lệnh `git rebase [basebranch] [topicbranch]` - lệnh này sẽ checkout nhánh chủ để (trong trường hợp này là `server`) cho bạn và áp dụng lại các thay đổi vào nhánh cơ sở (base) `master`:

	$ git rebase master server

Lệnh này sẽ thực hiện lại các thay đổi trên nhánh `server` chèn vào nhánh `master` như trong Hình 3-34.


![](http://git-scm.com/figures/18333fig0334-tn.png)

Hình 3-34. Rebase nhánh server chèn lên nhánh master. 

Sau đó bạn có thể di chuyển con trỏ nhánh base (`master`):

	$ git checkout master
	$ git merge server

Bạn có thể xóa nhánh `client` và `server` vì tất cả công việc đã được tích hợp vào master và bạn không cần đến chúng nữa, lịch sử quả toàn bộ quá trình vừa rồi giống như Hình 3-35:

	$ git branch -d client
	$ git branch -d server


![](http://git-scm.com/figures/18333fig0335-tn.png)

Hình 3-35. Lịch sử commit cuối cùng.

## Rủi Ro của Rebase

Mặc dù rebase rất hữu ích nhưng nó cũng có không ít những mặt hạn chế, điều này có thể tổng kết bằng câu sau đây:

**Không được rebase các commit mà bạn đã đẩy lên một kho chứa công khai.**

Miễn là bạn làm theo hướng dẫn này, sẽ không có chuyện gì xảy ra. Nếu không, mọi người sẽ ghét bạn, và bạn sẽ bị bạn bè và gia đình coi thường.

Khi bạn thực hiện rebase, bạn đang bỏ đi các commit đã tồn tại và tái tạo lại các commit mới tương tự nhưng thực ra khác biệt. Nếu bạn đẩy commit ở một nơi nào đó và mọi người kéo xuống máy của họ, sau đó bạn sửa lại các commit đó bằng lệnh `git rebase` và đẩy lên một lần nữa, đồng nghiệp của bạn sẽ phải tích hợp lại công việc của họ và mọi thứ sẽ rối tung lên khi bạn cố gắng kéo các thay đổi của họ ngược lại máy bạn.

Hãy cùng xem một ví dụ làm sao việc rebase công khai có thể gây sự cố. Giả sử bạn tạo bản sao từ một máy chủ trung tâm và thực hiện một số thay đổi từ đó. Lịch sử commit của bạn sẽ giống như Hình 3-36.


![](http://git-scm.com/figures/18333fig0336-tn.png)

Hình 3-36. Tạo bản sao một kho chứa, và base một số thay đổi vào đó.

Bây giờ, một người khác thực hiện một số thay đổi khác có kèm theo một lần tích hợp (merge), và đẩy lên máy chủ trung tâm. Bạn truy xuất chúng và tích hợp nhánh trung tâm mới đó vào của bạn, lúc này lịch sử của bạn sẽ giống như Hình 3-37.


![](http://git-scm.com/figures/18333fig0337-tn.png)

Hình 3-37. Truy xuất thêm các commit và tích hợp lại.

Tiếp theo, người đã đẩy tích hợp đó quyết định lại và rebase lại những thay đổi của họ; họ thực hiện `git push --force` để ghi đè lịch sử trên máy chủ. Sau đó bạn truy xuất lại dữ liệu từ máy chủ, đưa về các commit mới.


![](http://git-scm.com/figures/18333fig0338-tn.png)

Hình 3-38. Một người nào đó đẩy lên các commit rebase, bỏ đi các commit có chứa thay đổi của bạn.

Lúc này, bạn phải tích hợp lại một lần nữa các thay đổi này, mặc dù trước đó bạn đã làm rồi. Quá trình rebase thay đổi mã băm SHA-1 của các commit này vì thế đối với Git chúng giống như các commit mới, mà thực tế thì bạn đã có C4 trong lịch sử của bạn (xem Hình 3-39).


![](http://git-scm.com/figures/18333fig0339-tn.png)

Hình 3-39. Bạn tích hợp các thay đổi tương tự lại một lần nữa vào một commit tích hợp mới.

Bạn phải tích hợp thay đổi đó để có thể theo kịp với các lập trình viên khác về sau này. Sau khi thực hiện việc này, lịch sử commit của bạn sẽ bao gồm cả hai commit C4 và C4' có mã SHA-1 khác nhau nhưng lại có cùng chung nội dung thay đổi cũng như thông điệp commit. Nếu bạn chạy lệnh `git log` trong trường hợp này bạn sẽ thấy hai commit cùng chung ngày commit và thông điệp, điều này sẽ gây khó hiểu cho bạn. Hơn nữa, nếu bạn đẩy chúng ngược lên máy chủ, bạn sẽ đưa vào một lần nữa tất cả các commit đã rebase đó và sẽ gây khó hiểu cho nhiều người khác nữa.

Nếu bạn sử dụng rebase như là cách để dọn dẹp các commit trước khi đẩy chúng lên, và nếu như bạn chỉ rebase commit chưa bao giờ được công khai, thì sẽ không có chuyện gì xảy ra. Nếu bạn rebase các commit đã được công khai và mọi người có thể đã tích hợp (base) nó vào công việc của họ thì bạn có thể gặp phải các vấn đề thực sự khó chị.
