# การติดตั้ง Git

ก่อนที่จะใช้งานคุณคงต้องติดตั้ง Git ก่อน โดยคุณสามารถทำได้หลายวิธี วิธีหลักสองวิธีคือติดตั้งจากซอร์สโค้ดหรือติดตั้งจากแพคเกจที่มีอยู่แล้วสำหรับระบบปฏิบัติการของคุณ

## ติดตั้งจากซอร์สโค้ด

ถ้าเป็นไปได้เราขอแนะนำให้คุณติดตั้ง Git โดยการคอมไพล์โปรแกรมจากซอร์สโค้ด เพราะคุณจะได้ใช้เวอร์ชั่นล่าสุดซึ่งมักจะมาพร้อมกับการปรับปรุงอยู่เสมอ อีกเหตุผลหนึ่งก็คือแพคเกจที่มากับลีนุกซ์หลายรุ่นเป็นแพคเกจเวอร์ชั่นเก่ามาก ถ้าคุณไม่ได้ใช้ลีนุกซ์รุ่นล่าสุดหรือใช้ backport การติดตั้งจากซอร์สโค้ดน่าจะเป็นทางเลือกที่ดีที่สุด

ก่อนอื่นคุณต้องเตรียม library ที่จำเป็นเสียก่อน คือ curl, zlib, openssl, expat และ libiconv โดยคุณสามารถใช้ yum (ถ้าคุณใช้ Fedora) หรือ apt-get (ถ้าคุณใช้ระบบแบบ Debian) เพื่อติดตั้ง:

	$ yum install curl-devel expat-devel gettext-devel \
	  openssl-devel zlib-devel

	$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
	  libz-dev

หลังจากที่ติดตั้งโปรแกรมที่จำเป็นแล้วก็ถึงเวลาดาวน์โหลดเวอร์ชั่นล่าสุดของ Git โดยใช้คำสั่ง:	

	http://git-scm.com/download
	
จากนั้นก็คอมไพล์และติดตั้ง:

	$ tar -zxf git-1.6.0.5.tar.gz
	$ cd git-1.6.0.5
	$ make prefix=/usr/local all
	$ sudo make prefix=/usr/local install

หลังจากติดตั้งเรียบร้อยคุณสามารถดึงซอร์สโค้ดของ Git มาเพื่ออัดเกรดได้โดยใช้ตัวโปรแกรม Git เอง:

	$ git clone git://git.kernel.org/pub/scm/git/git.git
	
## การติดตั้งบนลีนุกซ์

ถ้าคุณต้องการติดตั้ง Git บนลีนุกซ์โดยใช้แพคเกจสำเร็จรูป คุณสามารถใช้ระบบจัดการแพคเกจที่มากับระบบปฏิบัติการของคุณได้เลย เช่น ถ้าคุณใช้ Fedora คุณสามารถติดตั้งผ่าน yum โดยใช้คำสั่ง:

	$ yum install git-core

หรือถ้าคุณใช้ระบบแบบ Debian อย่าง Ubuntu คุณสามารถติดตั้งผ่าน apt-get ได้:

	$ apt-get install git

## การติดตั้งบนแมค

There are two easy ways to install Git on a Mac. The easiest is to use the graphical Git installer, which you can download from the Google Code page (see Figure 1-7):

	http://code.google.com/p/git-osx-installer


![](http://git-scm.com/figures/18333fig0107-tn.png)
 
Figure 1-7. Git OS X installer.

The other major way is to install Git via MacPorts (`http://www.macports.org`). If you have MacPorts installed, install Git via

	$ sudo port install git-core +svn +doc +bash_completion +gitweb

You don’t have to add all the extras, but you’ll probably want to include +svn in case you ever have to use Git with Subversion repositories (see Chapter 8).

## Installing on Windows

Installing Git on Windows is very easy. The msysGit project has one of the easier installation procedures. Simply download the installer exe file from the GitHub page, and run it:

	http://msysgit.github.com/

After it’s installed, you have both a command-line version (including an SSH client that will come in handy later) and the standard GUI.
