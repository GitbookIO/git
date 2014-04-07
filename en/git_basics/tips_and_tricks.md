# Tips and Tricks

Before we finish this chapter on basic Git, a few little tips and tricks may make your Git experience a bit simpler, easier, or more familiar. Many people use Git without using any of these tips, and we won’t refer to them or assume you’ve used them later in the book; but you should probably know how to do them.

## Auto-Completion

If you use the Bash shell, Git comes with a nice auto-completion script you can enable. Download it directly from the Git source code at https://github.com/git/git/blob/master/contrib/completion/git-completion.bash . Copy this file to your home directory, and add this to your `.bashrc` file:

	source ~/git-completion.bash

If you want to set up Git to automatically have Bash shell completion for all users, copy this script to the `/opt/local/etc/bash_completion.d` directory on Mac systems or to the `/etc/bash_completion.d/` directory on Linux systems. This is a directory of scripts that Bash will automatically load to provide shell completions.

If you’re using Windows with Git Bash, which is the default when installing Git on Windows with msysGit, auto-completion should be preconfigured.

Press the Tab key when you’re writing a Git command, and it should return a set of suggestions for you to pick from:

	$ git co<tab><tab>
	commit config

In this case, typing `git co` and then pressing the Tab key twice suggests commit and config. Adding `m<tab>` completes `git commit` automatically.

This also works with options, which is probably more useful. For instance, if you’re running a `git log` command and can’t remember one of the options, you can start typing it and press Tab to see what matches:

	$ git log --s<tab>
	--shortstat  --since=  --src-prefix=  --stat   --summary

That’s a pretty nice trick and may save you some time and documentation reading.

## Git Aliases

Git doesn’t infer your command if you type it in partially. If you don’t want to type the entire text of each of the Git commands, you can easily set up an alias for each command using `git config`. Here are a couple of examples you may want to set up:

	$ git config --global alias.co checkout
	$ git config --global alias.br branch
	$ git config --global alias.ci commit
	$ git config --global alias.st status

This means that, for example, instead of typing `git commit`, you just need to type `git ci`. As you go on using Git, you’ll probably use other commands frequently as well; in this case, don’t hesitate to create new aliases.

This technique can also be very useful in creating commands that you think should exist. For example, to correct the usability problem you encountered with unstaging a file, you can add your own unstage alias to Git:

	$ git config --global alias.unstage 'reset HEAD --'

This makes the following two commands equivalent:

	$ git unstage fileA
	$ git reset HEAD fileA

This seems a bit clearer. It’s also common to add a `last` command, like this:

	$ git config --global alias.last 'log -1 HEAD'

This way, you can see the last commit easily:

	$ git last
	commit 66938dae3329c7aebe598c2246a8e6af90d04646
	Author: Josh Goebel <dreamer3@example.com>
	Date:   Tue Aug 26 19:48:51 2008 +0800

	    test for current head

	    Signed-off-by: Scott Chacon <schacon@example.com>

As you can tell, Git simply replaces the new command with whatever you alias it to. However, maybe you want to run an external command, rather than a Git subcommand. In that case, you start the command with a `!` character. This is useful if you write your own tools that work with a Git repository. We can demonstrate by aliasing `git visual` to run `gitk`:

	$ git config --global alias.visual '!gitk'
