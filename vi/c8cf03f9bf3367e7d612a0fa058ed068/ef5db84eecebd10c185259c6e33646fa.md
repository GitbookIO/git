# Cài Đặt Git

Hãy bắt đầu một chút vào việc sử dụng Git. Việc đầu tiên bạn cần phải làm là cài đặt nó. Có nhiều cách để thực hiện; hai cách chính đó là cài đặt từ mã nguồn hoặc cài đặt từ một gói có sẵn dựa trên hệ điều hành hiện tại của bạn.

## Cài Đặt Từ Mã Nguồn

Sẽ hữu ích hơn nếu bạn có thể cài đặt Git từ mã nguồn, vì bạn sẽ có được phiên bản mới nhất. Mỗi phiên bản của Git thường bao gồm nhiều cải tiến hữu ích về giao diện người dùng, vì thế cài đặt phiên bản mới nhất luôn là cách tốt nhất nếu như bạn quen thuộc với việc biên dịch phần mềm từ mã nguồn. Đôi khi nhiều phiên bản của Linux sử dụng các gói (package) rất cũ; vì thế trừ khi bạn đang sử dụng phiên bản mới nhất của Linux hoặc thường xuyên cập nhật, cài đặt từ mã nguồn có thể nói là sự lựa chọn tốt nhất.

Để cài đặt được Git, bạn cần có các thư viện mà Git sử dụng như sau: curl, zlib, openssl, expat, và libiconv. Ví dụ như bạn đang sử dụng một hệ điều hành có sử dụng yum (như Fedora) hoặc apt-get (như các hệ điều hành xây dựng trên nền Debian), bạn có thể sử dụng một trong các lệnh sau để cài đặt tất cả các thư viện cần thiết:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev libssl-dev

Khi đã cài đặt xong tất cả các thư viện cần thiết, bước tiếp theo là tải về phiên bản mới nhất của Git từ website của nó:

	http://git-scm.com/download

Sau đó, dịch và cài đặt:

	$ tar -zxf git-1.7.2.2.tar.gz
	$ cd git-1.7.2.2
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

Sau khi thực hiện xong các bước trên, bạn cũng có thể tải về các bản cập nhật của Git dùng chính nó như sau:

	$ git clone git://git.kernel.org/pub/scm/git/git.git

## Cài Đặt Trên Linux

Nếu như bạn muốn cài đặt Git trên Linux thông qua một chương trình cài đặt, bạn có thể làm việc này thông qua phần mềm quản lý các gói cơ bản đi kèm với hệ điều hành của bạn. Nếu bạn đang sử dụng Fedora, bạn có thể dùng yum:

	$ yum install git-core

Còn nếu bạn đang sử dụng một hệ điều hành dựa trên nhân Debian như Ubuntu, hãy dùng apt-get:

	$ apt-get install git

## Cài Đặt Trên Mac

Có hai cách đơn giản để cài đặt Git trên Mac. Cách đơn giản nhất là sử dụng chương trình cài đặt có hỗ trợ giao diện, bạn có thể tải về từ trang web của Google Code (xem Hình 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)

Hình 1-7. Chương trình cài đặt Git cho Mac OS X.

Cách khác để cài đặt Git là thông qua MacPorts (`http://www.macports.org`). Nếu như bạn đã cài đặt MacPorts, Git có thể được cài đặt sử dụng lệnh sau:

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

Bạn không phải cài đặt các thư viện đi kèm, nhưng có lẽ bạn muốn cài đặt thêm +svn trong trường hợp sử dụng chung Git với Subversion (xem Chương 8).

## Cài Đặt Trên Windows

Cài đặt Git trên Windows rất đơn giản. Dự án msysGit cung cấp một cách cài đặt Git dễ dàng hơn. Đơn giản chỉ tải về tập tin cài đặt định dạng exe từ Github, và chạy:

	http://msysgit.github.com/

Sau khi nó được cài đặt, bạn có cả hai phiên bản: command-line (bao gồm SSH) và bản giao diện chuẩn.

Chú ý khi sử dụng trên Windows: bạn nên dùng Git bằng công cụ có sẵn: msysGit shell (kiểu Unix), nó cho phép bạn sử dụng các lệnh phức tạp trong sách này. Vì lý do nào đó, bạn muốn sử dụng cửa sổ dòng lệnh chuẩn của Windows: Windows shell, bạn bản sử dụng nháy kép thay vì nháy đơn (cho các tham số đầu vào có bao gồm dấu cách) và bạn phải dùng dấu mũ (^) cho tham số nếu chúng kéo dài đến cuối dòng, vì nó là ký tự tiếp diễn trong Windows.
