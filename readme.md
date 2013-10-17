# Staged Git Files

This module returns an array of staged files and their status acording to git.

## Usage

**Download**

`npm install sgf`

**In Code**

```
var sgf = require("staged-git-files");
sgf(function(err, results){
	//WHAT EVER YOU SO PLEASE
});
```

**Example Results**

```
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

## Statuses

**SFG-Status (git status code)**

* Added (A)
* Copied (C)
* Deleted (D)
* Modified (M)
* Renamed (R)
* Type-Change (T) [i.e. regular file, symlink, submodule, etc.]
* Unmerged (U)
* Unknown (X)
