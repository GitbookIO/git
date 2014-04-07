# Gitolite

This section serves as a quick introduction to Gitolite, and provides basic installation and setup instructions.  It cannot, however, replace the enormous amount of [documentation][gltoc] that Gitolite comes with.  There may also be occasional changes to this section itself, so you may also want to look at the latest version [here][gldpg].

[gldpg]: http://sitaramc.github.com/gitolite/progit.html
[gltoc]: http://sitaramc.github.com/gitolite/master-toc.html

Gitolite is an authorization layer on top of Git, relying on `sshd` or `httpd` for authentication.  (Recap: authentication is identifying who the user is, authorization is deciding if he is allowed to do what he is attempting to).

Gitolite allows you to specify permissions not just by repository, but also by branch or tag names within each repository.  That is, you can specify that certain people (or groups of people) can only push certain "refs" (branches or tags) but not others.

## Installing

Installing Gitolite is very easy, even if you don’t read the extensive documentation that comes with it.  You need an account on a Unix server of some kind.  You do not need root access, assuming Git, Perl, and an OpenSSH compatible SSH server are already installed.  In the examples below, we will use the `git` account on a host called `gitserver`.

Gitolite is somewhat unusual as far as "server" software goes — access is via SSH, and so every userid on the server is a potential "gitolite host".  We will describe the simplest install method in this article; for the other methods please see the documentation.

To begin, create a user called `git` on your server and login to this user.  Copy your SSH public key (a file called `~/.ssh/id_rsa.pub` if you did a plain `ssh-keygen` with all the defaults) from your workstation, renaming it to `<yourname>.pub` (we'll use `scott.pub` in our examples).  Then run these commands:

	$ git clone git://github.com/sitaramc/gitolite
	$ gitolite/install -ln
	    # assumes $HOME/bin exists and is in your $PATH
	$ gitolite setup -pk $HOME/scott.pub

That last command creates new Git repository called `gitolite-admin` on the server.

Finally, back on your workstation, run `git clone git@gitserver:gitolite-admin`. And you’re done!  Gitolite has now been installed on the server, and you now have a brand new repository called `gitolite-admin` in your workstation.  You administer your Gitolite setup by making changes to this repository and pushing.

## Customising the Install

While the default, quick, install works for most people, there are some ways to customise the install if you need to.  Some changes can be made simply by editing the rc file, but if that is not sufficient, there’s documentation on customising Gitolite.

## Config File and Access Control Rules

Once the install is done, you switch to the `gitolite-admin` clone you just made on your workstation, and poke around to see what you got:

	$ cd ~/gitolite-admin/
	$ ls
	conf/  keydir/
	$ find conf keydir -type f
	conf/gitolite.conf
	keydir/scott.pub
	$ cat conf/gitolite.conf

	repo gitolite-admin
	    RW+                 = scott

	repo testing
	    RW+                 = @all

Notice that "scott" (the name of the pubkey in the `gitolite setup` command you used earlier) has read-write permissions on the `gitolite-admin` repository as well as a public key file of the same name.

Adding users is easy.  To add a user called "alice", obtain her public key, name it `alice.pub`, and put it in the `keydir` directory of the clone of the `gitolite-admin` repo you just made on your workstation.  Add, commit, and push the change, and the user has been added.

The config file syntax for Gitolite is well documented, so we’ll only mention some highlights here.

You can group users or repos for convenience.  The group names are just like macros; when defining them, it doesn’t even matter whether they are projects or users; that distinction is only made when you *use* the "macro".

	@oss_repos      = linux perl rakudo git gitolite
	@secret_repos   = fenestra pear

	@admins         = scott
	@interns        = ashok
	@engineers      = sitaram dilbert wally alice
	@staff          = @admins @engineers @interns

You can control permissions at the "ref" level.  In the following example, interns can only push the "int" branch.  Engineers can push any branch whose name starts with "eng-", and tags that start with "rc" followed by a digit.  And the admins can do anything (including rewind) to any ref.

	repo @oss_repos
	    RW  int$                = @interns
	    RW  eng-                = @engineers
	    RW  refs/tags/rc[0-9]   = @engineers
	    RW+                     = @admins

The expression after the `RW` or `RW+` is a regular expression (regex) that the refname (ref) being pushed is matched against.  So we call it a "refex"!  Of course, a refex can be far more powerful than shown here, so don’t overdo it if you’re not comfortable with Perl regexes.

Also, as you probably guessed, Gitolite prefixes `refs/heads/` as a syntactic convenience if the refex does not begin with `refs/`.

An important feature of the config file’s syntax is that all the rules for a repository need not be in one place.  You can keep all the common stuff together, like the rules for all `oss_repos` shown above, then add specific rules for specific cases later on, like so:

	repo gitolite
	    RW+                     = sitaram

That rule will just get added to the ruleset for the `gitolite` repository.

At this point you might be wondering how the access control rules are actually applied, so let’s go over that briefly.

There are two levels of access control in Gitolite.  The first is at the repository level; if you have read (or write) access to *any* ref in the repository, then you have read (or write) access to the repository.  This is the only access control that Gitosis had.

The second level, applicable only to "write" access, is by branch or tag within a repository.  The username, the access being attempted (`W` or `+`), and the refname being updated are known.  The access rules are checked in order of appearance in the config file, looking for a match for this combination (but remember that the refname is regex-matched, not merely string-matched).  If a match is found, the push succeeds.  A fallthrough results in access being denied.

## Advanced Access Control with "deny" rules

So far, we’ve only seen permissions to be one of `R`, `RW`, or `RW+`.  However, Gitolite allows another permission: `-`, standing for "deny".  This gives you a lot more power, at the expense of some complexity, because now fallthrough is not the *only* way for access to be denied, so the *order of the rules now matters*!

Let us say, in the situation above, we want engineers to be able to rewind any branch *except* master and integ.  Here’s how to do that:

	    RW  master integ    = @engineers
	    -   master integ    = @engineers
	    RW+                 = @engineers

Again, you simply follow the rules top down until you hit a match for your access mode, or a deny.  Non-rewind push to master or integ is allowed by the first rule.  A rewind push to those refs does not match the first rule, drops down to the second, and is therefore denied.  Any push (rewind or non-rewind) to refs other than master or integ won’t match the first two rules anyway, and the third rule allows it.

## Restricting pushes by files changed

In addition to restricting what branches a user can push changes to, you can also restrict what files they are allowed to touch.  For example, perhaps the Makefile (or some other program) is really not supposed to be changed by just anyone, because a lot of things depend on it or would break if the changes are not done *just right*.  You can tell Gitolite:

    repo foo
        RW                      =   @junior_devs @senior_devs

        -   VREF/NAME/Makefile  =   @junior_devs

User who are migrating from the older Gitolite should note that there is a significant change in behaviour with regard to this feature; please see the migration guide for details.

## Personal Branches

Gitolite also has a feature called "personal branches" (or rather, "personal branch namespace") that can be very useful in a corporate environment.

A lot of code exchange in the Git world happens by "please pull" requests.  In a corporate environment, however, unauthenticated access is a no-no, and a developer workstation cannot do authentication, so you have to push to the central server and ask someone to pull from there.

This would normally cause the same branch name clutter as in a centralised VCS, plus setting up permissions for this becomes a chore for the admin.

Gitolite lets you define a "personal" or "scratch" namespace prefix for each developer (for example, `refs/personal/<devname>/*`); please see the documentation for details.

## "Wildcard" repositories

Gitolite allows you to specify repositories with wildcards (actually Perl regexes), like, for example `assignments/s[0-9][0-9]/a[0-9][0-9]`, to pick a random example.  It also allows you to assign a new permission mode (`C`) which enables users to create repositories based on such wild cards, automatically assigns ownership to the specific user who created it, allows him/her to hand out `R` and `RW` permissions to other users to collaborate, etc.  Again, please see the documentation for details.

## Other Features

We’ll round off this discussion with a sampling of other features, all of which, and many more, are described in great detail in the documentation.

**Logging**: Gitolite logs all successful accesses.  If you were somewhat relaxed about giving people rewind permissions (`RW+`) and some kid blew away `master`, the log file is a life saver, in terms of easily and quickly finding the SHA that got hosed.

**Access rights reporting**: Another convenient feature is what happens when you try and just ssh to the server.  Gitolite shows you what repos you have access to, and what that access may be.  Here’s an example:

        hello scott, this is git@git running gitolite3 v3.01-18-g9609868 on git 1.7.4.4

             R     anu-wsd
             R     entrans
             R  W  git-notes
             R  W  gitolite
             R  W  gitolite-admin
             R     indic_web_input
             R     shreelipi_converter

**Delegation**: For really large installations, you can delegate responsibility for groups of repositories to various people and have them manage those pieces independently.  This reduces the load on the main admin, and makes him less of a bottleneck.

**Mirroring**: Gitolite can help you maintain multiple mirrors, and switch between them easily if the primary server goes down.
