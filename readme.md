# Staged Git Files

This module returns an array of staged files and their status acording to git.

[![Build Status](https://travis-ci.org/mcwhittemore/staged-git-files.svg?branch=master)](https://travis-ci.org/mcwhittemore/staged-git-files)

## Usage

`npm install staged-git-files`


```js
var sgf = require("staged-git-files");
sgf(function(err, results){
	//WHAT EVER YOU SO PLEASE
});
```

**Example Results**

```json
[
	{
		"filename": "package.json",
		"status": "Added"
	},
	{
		"filename": "readme.md",
		"status": "Modified"
	},
	{
		"filename": "index.js",
		"status": "Renamed"
	}
]
```

## Usage as a cli

```sh
$ sgf
Added package.json
Modified readme.md
Renamed index.js
```

## API

### sgf(filter, callback)

Get a list of staged git files

* options:
  * filter: string of git status codes. No spaces
  * relative: boolean, tells [diff to run in relative mode](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---relativeltpathgt)
* callback:
	* err: the error
	* results: file object array.

If you omit a callback `sgf` will return a promise. How to use with `async`/`await`:

```javascript
async function main () {
	const stagedFiles = await sgf();
}

main();
```


### sgf.getHead(callback)

Get head that will be used in the diff to ID which files are waiting to be staged.

* callback
	* err: the error
	* head: the git commit id which is aliased to head.

### sgf.readFile(filename, [options], callback)

This is a proxy for [fs.readFile](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback) with one change. The filename will be relative to the `sgf.cwd`

### sgf.debug

Boolean that flips logging on and off. By default this is false. If true, all git commands will be console logged.

### sgf.includeContent

If true, include content will add a `content` or `err` param to the file object.

* Default Value: false
* Content Param: the content of the file staged
* Err Param: the error message received while trying to read the file.

### sgf.cwd

The current working directory. AKA: where the .git folder you care about is.

# Default Value: is equal to process.cwd() of your app.g

## Statuses

**SGF-Status (git status code)**

* Added (A)
* Copied (C)
* Deleted (D)
* Modified (M)
* Renamed (R)
* Type-Change (T) [i.e. regular file, symlink, submodule, etc.]
* Unmerged (U)
* Unknown (X)
