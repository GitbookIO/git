# The Protocols

Git can use four major network protocols to transfer data: Local, Secure Shell (SSH), Git, and HTTP. Here we’ll discuss what they are and in what basic circumstances you would want (or not want) to use them.

It’s important to note that with the exception of the HTTP protocols, all of these require Git to be installed and working on the server.

## Local Protocol

The most basic is the _Local protocol_, in which the remote repository is in another directory on disk. This is often used if everyone on your team has access to a shared filesystem such as an NFS mount, or in the less likely case that everyone logs in to the same computer. The latter wouldn’t be ideal, because all your code repository instances would reside on the same computer, making a catastrophic loss much more likely.

If you have a shared mounted filesystem, then you can clone, push to, and pull from a local file-based repository. To clone a repository like this or to add one as a remote to an existing project, use the path to the repository as the URL. For example, to clone a local repository, you can run something like this:

	$ git clone /opt/git/project.git

Or you can do this:

	$ git clone file:///opt/git/project.git

Git operates slightly differently if you explicitly specify `file://` at the beginning of the URL. If you just specify the path, and the source and the destination are on the same filesystem, Git tries to hardlink the objects it needs. If they are not on the same filesystem, it will copy the objects it needs using the system's standard copying functionality. If you specify `file://`, Git fires up the processes that it normally uses to transfer data over a network which is generally a lot less efficient method of transferring the data. The main reason to specify the `file://` prefix is if you want a clean copy of the repository with extraneous references or objects left out — generally after an import from another version-control system or something similar (see Chapter 9 for maintenance tasks). We’ll use the normal path here because doing so is almost always faster.

To add a local repository to an existing Git project, you can run something like this:

	$ git remote add local_proj /opt/git/project.git

Then, you can push to and pull from that remote as though you were doing so over a network.

### The Pros

The pros of file-based repositories are that they’re simple and they use existing file permissions and network access. If you already have a shared filesystem to which your whole team has access, setting up a repository is very easy. You stick the bare repository copy somewhere everyone has shared access to and set the read/write permissions as you would for any other shared directory. We’ll discuss how to export a bare repository copy for this purpose in the next section, “Getting Git on a Server.”

This is also a nice option for quickly grabbing work from someone else’s working repository. If you and a co-worker are working on the same project and they want you to check something out, running a command like `git pull /home/john/project` is often easier than them pushing to a remote server and you pulling down.

### The Cons

The cons of this method are that shared access is generally more difficult to set up and reach from multiple locations than basic network access. If you want to push from your laptop when you’re at home, you have to mount the remote disk, which can be difficult and slow compared to network-based access.

It’s also important to mention that this isn’t necessarily the fastest option if you’re using a shared mount of some kind. A local repository is fast only if you have fast access to the data. A repository on NFS is often slower than the repository over SSH on the same server, allowing Git to run off local disks on each system.

## The SSH Protocol

Probably the most common transport protocol for Git is SSH. This is because SSH access to servers is already set up in most places — and if it isn’t, it’s easy to do. SSH is also the only network-based protocol that you can easily read from and write to. The other two network protocols (HTTP and Git) are generally read-only, so even if you have them available for the unwashed masses, you still need SSH for your own write commands. SSH is also an authenticated network protocol; and because it’s ubiquitous, it’s generally easy to set up and use.

To clone a Git repository over SSH, you can specify ssh:// URL like this:

	$ git clone ssh://user@server/project.git

Or you can use the shorter scp-like syntax for SSH protocol:

	$ git clone user@server:project.git

You can also not specify a user, and Git assumes the user you’re currently logged in as.

### The Pros

The pros of using SSH are many. First, you basically have to use it if you want authenticated write access to your repository over a network. Second, SSH is relatively easy to set up — SSH daemons are commonplace, many network admins have experience with them, and many OS distributions are set up with them or have tools to manage them. Next, access over SSH is secure — all data transfer is encrypted and authenticated. Last, like the Git and Local protocols, SSH is efficient, making the data as compact as possible before transferring it.

### The Cons

The negative aspect of SSH is that you can’t serve anonymous access of your repository over it. People must have access to your machine over SSH to access it, even in a read-only capacity, which doesn’t make SSH access conducive to open source projects. If you’re using it only within your corporate network, SSH may be the only protocol you need to deal with. If you want to allow anonymous read-only access to your projects, you’ll have to set up SSH for you to push over but something else for others to pull over.

## The Git Protocol

Next is the Git protocol. This is a special daemon that comes packaged with Git; it listens on a dedicated port (9418) that provides a service similar to the SSH protocol, but with absolutely no authentication. In order for a repository to be served over the Git protocol, you must create the `git-daemon-export-ok` file — the daemon won’t serve a repository without that file in it — but other than that there is no security. Either the Git repository is available for everyone to clone or it isn’t. This means that there is generally no pushing over this protocol. You can enable push access; but given the lack of authentication, if you turn on push access, anyone on the internet who finds your project’s URL could push to your project. Suffice it to say that this is rare.

### The Pros

The Git protocol is the fastest transfer protocol available. If you’re serving a lot of traffic for a public project or serving a very large project that doesn’t require user authentication for read access, it’s likely that you’ll want to set up a Git daemon to serve your project. It uses the same data-transfer mechanism as the SSH protocol but without the encryption and authentication overhead.

### The Cons

The downside of the Git protocol is the lack of authentication. It’s generally undesirable for the Git protocol to be the only access to your project. Generally, you’ll pair it with SSH access for the few developers who have push (write) access and have everyone else use `git://` for read-only access.
It’s also probably the most difficult protocol to set up. It must run its own daemon, which is custom — we’ll look at setting one up in the “Gitosis” section of this chapter — it requires `xinetd` configuration or the like, which isn’t always a walk in the park. It also requires firewall access to port 9418, which isn’t a standard port that corporate firewalls always allow. Behind big corporate firewalls, this obscure port is commonly blocked.

## The HTTP/S Protocol

Last we have the HTTP protocol. The beauty of the HTTP or HTTPS protocol is the simplicity of setting it up. Basically, all you have to do is put the bare Git repository under your HTTP document root and set up a specific `post-update` hook, and you’re done (See Chapter 7 for details on Git hooks). At that point, anyone who can access the web server under which you put the repository can also clone your repository. To allow read access to your repository over HTTP, do something like this:

	$ cd /var/www/htdocs/
	$ git clone --bare /path/to/git_project gitproject.git
	$ cd gitproject.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

That’s all. The `post-update` hook that comes with Git by default runs the appropriate command (`git update-server-info`) to make HTTP fetching and cloning work properly. This command is run when you push to this repository over SSH; then, other people can clone via something like

	$ git clone http://example.com/gitproject.git

In this particular case, we’re using the `/var/www/htdocs` path that is common for Apache setups, but you can use any static web server — just put the bare repository in its path. The Git data is served as basic static files (see Chapter 9 for details about exactly how it’s served).

It’s possible to make Git push over HTTP as well, although that technique isn’t as widely used and requires you to set up complex WebDAV requirements. Because it’s rarely used, we won’t cover it in this book. If you’re interested in using the HTTP-push protocols, you can read about preparing a repository for this purpose at `http://www.kernel.org/pub/software/scm/git/docs/howto/setup-git-server-over-http.txt`. One nice thing about making Git push over HTTP is that you can use any WebDAV server, without specific Git features; so, you can use this functionality if your web-hosting provider supports WebDAV for writing updates to your web site.

### The Pros

The upside of using the HTTP protocol is that it’s easy to set up. Running the handful of required commands gives you a simple way to give the world read access to your Git repository. It takes only a few minutes to do. The HTTP protocol also isn’t very resource intensive on your server. Because it generally uses a static HTTP server to serve all the data, a normal Apache server can serve thousands of files per second on average — it’s difficult to overload even a small server.

You can also serve your repositories read-only over HTTPS, which means you can encrypt the content transfer; or you can go so far as to make the clients use specific signed SSL certificates. Generally, if you’re going to these lengths, it’s easier to use SSH public keys; but it may be a better solution in your specific case to use signed SSL certificates or other HTTP-based authentication methods for read-only access over HTTPS.

Another nice thing is that HTTP is such a commonly used protocol that corporate firewalls are often set up to allow traffic through this port.

### The Cons

The downside of serving your repository over HTTP is that it’s relatively inefficient for the client. It generally takes a lot longer to clone or fetch from the repository, and you often have a lot more network overhead and transfer volume over HTTP than with any of the other network protocols. Because it’s not as intelligent about transferring only the data you need — there is no dynamic work on the part of the server in these transactions — the HTTP protocol is often referred to as a _dumb_ protocol. For more information about the differences in efficiency between the HTTP protocol and the other protocols, see Chapter 9.
