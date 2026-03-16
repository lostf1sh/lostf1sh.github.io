---
title: git beyond the basics
date: 2026-03-10
tags: [git, workflow, productivity, tutorial]
excerpt: the commands that separate "i use git" from "i understand git."
---

# git beyond the basics

everyone knows `add`, `commit`, `push`, `pull`. but git has an entire layer of powerful tools that most developers never touch. these are the ones that changed how i work.

## interactive rebase

this is the single most useful advanced git feature. it lets you rewrite history before pushing.

```bash
git rebase -i HEAD~5
```

this opens your editor with the last 5 commits:

```
pick a1b2c3d fix login bug
pick e4f5g6h add user avatar
pick i7j8k9l wip
pick m0n1o2p fix typo
pick q3r4s5t add avatar tests
```

### what you can do

| command | effect |
|---------|--------|
| `pick` | keep the commit as-is |
| `reword` | change the commit message |
| `edit` | stop at commit, let you amend |
| `squash` | merge into previous commit |
| `fixup` | like squash but discard message |
| `drop` | remove the commit entirely |

### real workflow

that `wip` and `fix typo` commit? squash them into the commits they belong to:

```
pick a1b2c3d fix login bug
pick e4f5g6h add user avatar
fixup i7j8k9l wip
fixup m0n1o2p fix typo
pick q3r4s5t add avatar tests
```

result: clean history with three meaningful commits instead of five noisy ones.

### the golden rule

never rebase commits that have been pushed to a shared branch. rewriting published history breaks everyone's local repos. rebase your local branch before pushing, not after.

## git bisect

you know something broke between version 2.1 and now, but there are 200 commits in between. bisect finds the exact commit using binary search.

```bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good v2.1           # this tag was working
```

git checks out the middle commit. you test it and tell git:

```bash
git bisect good   # this commit is fine
# or
git bisect bad    # this commit is broken
```

git narrows down by half each time. 200 commits takes at most 8 steps.

### automated bisect

even better — give it a test script:

```bash
git bisect start HEAD v2.1
git bisect run npm test
```

git runs `npm test` at each step and finds the first failing commit automatically. walk away, get coffee, come back to the answer.

### when i use it

- a test that used to pass now fails and nobody knows why
- performance degraded somewhere in the last month
- a css layout broke and the commit is not obvious from the diff

bisect turns a needle-in-a-haystack problem into a five-minute task.

## git worktrees

worktrees let you have multiple branches checked out at the same time in different directories. no stashing, no context switching, no losing your place.

```bash
# create a worktree for a hotfix
git worktree add ../hotfix-branch hotfix/login-crash

# now you have two directories:
# ~/project          → main branch (your current work)
# ~/hotfix-branch    → hotfix/login-crash
```

### why this is better than stashing

with stash:
1. save your work (`git stash`)
2. switch branch (`git checkout hotfix`)
3. fix the issue
4. switch back (`git checkout main`)
5. restore your work (`git stash pop`)
6. hope nothing conflicts

with worktrees:
1. create worktree (`git worktree add`)
2. fix the issue in the other directory
3. done. your original work never moved.

### managing worktrees

```bash
git worktree list           # see all worktrees
git worktree remove ../hotfix-branch  # clean up when done
git worktree prune          # remove stale entries
```

i keep a convention: worktrees go in sibling directories named after the branch. `~/project` stays on main, `~/project-feat-x` is a feature branch.

### when i use them

- reviewing someone's pr while i have uncommitted work
- working on a hotfix without disrupting my feature branch
- running tests on one branch while coding on another

## git hooks

hooks are scripts that run automatically at specific points in the git workflow. they live in `.git/hooks/` or you can manage them with tools like husky or lefthook.

### useful hooks

```bash
# .git/hooks/pre-commit
#!/bin/sh
# run linter before every commit
npm run lint --quiet
if [ $? -ne 0 ]; then
    echo "lint failed. fix errors before committing."
    exit 1
fi
```

```bash
# .git/hooks/commit-msg
#!/bin/sh
# enforce conventional commit messages
if ! head -1 "$1" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}"; then
    echo "invalid commit message format."
    echo "use: type(scope): description"
    exit 1
fi
```

### shared hooks with lefthook

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      run: npx eslint {staged_files} --fix
    format:
      run: npx prettier {staged_files} --write
    types:
      run: npx tsc --noEmit

pre-push:
  commands:
    test:
      run: npm test
```

hooks catch problems before they reach the remote. lint on commit, test on push, format on save. automate the boring stuff.

### the escape hatch

```bash
git commit --no-verify  # skip hooks (use sparingly)
```

sometimes you need to commit broken code to switch context. that is fine. just do not push it.

## git reflog

reflog is git's undo button. it records every change to HEAD, even things that `git log` does not show.

```bash
git reflog
```

```
a1b2c3d HEAD@{0}: commit: add tests
e4f5g6h HEAD@{1}: rebase: squash
i7j8k9l HEAD@{2}: rebase: start
m0n1o2p HEAD@{3}: commit: wip
q3r4s5t HEAD@{4}: checkout: moving from main to feature
```

### recovering from disasters

accidentally deleted a branch:

```bash
git reflog                    # find the commit hash
git branch recovered a1b2c3d  # recreate the branch
```

rebase went wrong:

```bash
git reflog                        # find the state before rebase
git reset --hard HEAD@{3}         # go back to that state
```

force pushed and lost commits:

```bash
git reflog                        # they are still there locally
git cherry-pick a1b2c3d           # rescue specific commits
```

### how long does reflog keep things

by default, 90 days for reachable refs and 30 days for unreachable ones. you can change this:

```bash
git config gc.reflogExpire "180 days"
```

the lesson: almost nothing in git is truly lost. if you committed it, reflog remembers.

## git stash (properly)

most people know `git stash` and `git stash pop`. but stash has more to offer.

### named stashes

```bash
git stash push -m "wip: login redesign"
git stash push -m "experiment: new api format"
git stash list
# stash@{0}: On main: experiment: new api format
# stash@{1}: On main: wip: login redesign
```

without names, `stash list` is a wall of unhelpful "WIP on main" entries.

### partial stashes

stash only specific files:

```bash
git stash push -m "just the css" -- src/styles/
```

or interactively choose hunks:

```bash
git stash push -p
```

### stash as a branch

if a stash grows complex enough to keep, turn it into a branch:

```bash
git stash branch new-feature stash@{0}
```

this creates a new branch from the stash point and applies the stash. clean.

## git blame and log archaeology

### blame with context

```bash
git blame -L 50,70 src/auth.js
```

shows who wrote lines 50-70 and when. useful for understanding *why* code looks the way it does.

### ignore formatting commits

if someone ran prettier across the whole codebase, blame becomes useless. fix it:

```bash
# create .git-blame-ignore-revs
echo "a1b2c3d  # prettier reformatting" >> .git-blame-ignore-revs
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

now `git blame` skips that commit and shows the actual author.

### log tricks

```bash
# search commit messages
git log --grep="login" --oneline

# find when a function was added
git log -S "function authenticate" --oneline

# find when a function was changed
git log -G "authenticate.*token" --oneline

# show commits that touched a specific file
git log --follow -- src/auth.js

# pretty graph
git log --oneline --graph --all
```

the `-S` flag (pickaxe) is incredibly powerful. it finds the commit that added or removed a specific string. combine it with `-p` to see the actual diff.

## git cherry-pick

take a specific commit from one branch and apply it to another.

```bash
git checkout main
git cherry-pick a1b2c3d
```

### when to use it

- a bugfix landed on a feature branch but main needs it now
- you committed to the wrong branch
- you need one specific commit from a long-lived branch without merging everything

### cherry-pick a range

```bash
git cherry-pick a1b2c3d..e4f5g6h
```

this applies all commits between those two hashes (exclusive of the first one).

### cherry-pick without committing

```bash
git cherry-pick --no-commit a1b2c3d
```

applies the changes but lets you modify them before committing. useful when the commit needs adaptation.

## git clean and reset

### cleaning untracked files

```bash
git clean -n    # dry run: see what would be deleted
git clean -fd   # actually delete untracked files and directories
```

always dry run first. `git clean` is destructive and not recoverable (unless the files are in your editor's undo history).

### reset levels

```bash
git reset --soft HEAD~1   # undo commit, keep changes staged
git reset --mixed HEAD~1  # undo commit, keep changes unstaged (default)
git reset --hard HEAD~1   # undo commit, delete changes entirely
```

`--soft` is my go-to when i committed too early. it puts everything back in staging so i can recommit properly.

`--hard` is the nuclear option. use reflog if you mess this up.

## advanced config

some git config options that improve daily life:

```bash
# better diff algorithm
git config --global diff.algorithm histogram

# auto-correct typos (runs after 1.5s delay)
git config --global help.autocorrect 15

# reuse recorded resolution for merge conflicts
git config --global rerere.enabled true

# always rebase on pull instead of merge
git config --global pull.rebase true

# sort branches by most recent commit
git config --global branch.sort -committerdate

# sign commits with ssh key
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

### rerere

`rerere` stands for "reuse recorded resolution." when you resolve a merge conflict, git remembers. next time the same conflict appears (rebasing, cherry-picking), it resolves automatically.

this alone saves hours over a long-lived feature branch.

## the mental model

git is not a linear timeline. it is a directed acyclic graph of snapshots. every commit points to its parent(s). branches are just pointers to commits. HEAD is a pointer to the current commit.

once you internalize this, everything clicks:
- **rebase** replays commits onto a new base
- **merge** creates a commit with two parents
- **cherry-pick** copies a commit's diff to a new location
- **reset** moves the branch pointer
- **reflog** records every pointer movement

the commands are just different ways of manipulating pointers and snapshots. learn the model, and the commands make themselves obvious.

-- moli