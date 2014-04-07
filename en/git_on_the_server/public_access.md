# Public Access

What if you want anonymous read access to your project? Perhaps instead of hosting an internal private project, you want to host an open source project. Or maybe you have a bunch of automated build servers or continuous integration servers that change a lot, and you don’t want to have to generate SSH keys all the time — you just want to add simple anonymous read access.

Probably the simplest way for smaller setups is to run a static web server with its document root where your Git repositories are, and then enable that `post-update` hook we mentioned in the first section of this chapter. Let’s work from the previous example. Say you have your repositories in the `/opt/git` directory, and an Apache server is running on your machine. Again, you can use any web server for this; but as an example, we’ll demonstrate some basic Apache configurations that should give you an idea of what you might need.

First you need to enable the hook:

	$ cd project.git
	$ mv hooks/post-update.sample hooks/post-update
	$ chmod a+x hooks/post-update

What does this `post-update` hook do? It looks basically like this:

	$ cat .git/hooks/post-update
	#!/bin/sh
	#
	# An example hook script to prepare a packed repository for use over
	# dumb transports.
	#
	# To enable this hook, rename this file to "post-update".
	#
	
	exec git-update-server-info

This means that when you push to the server via SSH, Git will run this command to update the files needed for HTTP fetching.

Next, you need to add a VirtualHost entry to your Apache configuration with the document root as the root directory of your Git projects. Here, we’re assuming that you have wildcard DNS set up to send `*.gitserver` to whatever box you’re using to run all this:

	<VirtualHost *:80>
	    ServerName git.gitserver
	    DocumentRoot /opt/git
	    <Directory /opt/git/>
	        Order allow, deny
	        allow from all
	    </Directory>
	</VirtualHost>

You’ll also need to set the Unix user group of the `/opt/git` directories to `www-data` so your web server can read-access the repositories, because the Apache instance running the CGI script will (by default) be running as that user:

	$ chgrp -R www-data /opt/git

When you restart Apache, you should be able to clone your repositories under that directory by specifying the URL for your project:

	$ git clone http://git.gitserver/project.git

This way, you can set up HTTP-based read access to any of your projects for a fair number of users in a few minutes. Another simple option for public unauthenticated access is to start a Git daemon, although that requires you to daemonize the process - we’ll cover this option in the next section, if you prefer that route.
