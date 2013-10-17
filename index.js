var exec = require("child_process").exec;

var sgf = function(filter, callback) {

    if (typeof filter == "function") {
        callback = filter;
        filter = "ACDMRTUXB";
    }

    sgf.getHead(function(err, head) {
        if (err) {
            callback(err);
        } else {
            var command = "git diff-index --cached --name-status --diff-filter=" + filter + " " + head + " --";
            run(command, function(err, stdout, stderr) {
                if (err || stderr) {
                    callback(err || new Error(stderr));
                } else {
                    callback(null, stringToArray(stdout));
                }
            });
        }
    });
}

sgf.cwd = process.cwd();
sgf.debug = false;

sgf.firstHead = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

sgf.getHead = function(callback) {
    run("git rev-parse --verify HEAD", function(err, stdout, stderr) {
        if (err && err.message == "Command failed: fatal: Needed a single revision\n") {
            callback(null, sgf.firstHead);
        } else if (err || stderr) {
            callback(err || new Error("STDERR: " + stderr));
        } else {
            callback(null, stdout);
        }
    });
}


module.exports = sgf;

/** ======================================== HELPERS ======================================== **/

var run = function(command, callback) {
    if (sgf.debug) {
        console.log("RUNNING: " + command);
    }
    exec("cd " + module.exports.cwd + " && " + command, callback);
}

var codeToStatus = function(code) {
    /* ===============================================================================================================================
     ** PER git diff-index --help
     ** --diff-filter=[(A|C|D|M|R|T|U|X|B)...[*]]
     **     Select only files that are Added (A), Copied (C), Deleted (D), Modified (M), Renamed (R), have their type (i.e. regular
     **     file, symlink, submodule, ...) changed (T), are Unmerged (U), are Unknown (X), or have had their pairing Broken (B). Any
     **     combination of the filter characters (including none) can be used. When * (All-or-none) is added to the combination, all
     **     paths are selected if there is any file that matches other criteria in the comparison; if there is no file that matches
     **     other criteria, nothing is selected.
     ** ============================================================================================================================ */

    var map = {
        "A": "Added",
        "C": "Copied",
        "D": "Deleted",
        "M": "Modified",
        "R": "Renamed",
        "T": "Changed",
        "U": "Unmerged",
        "X": "Unknown",
        "B": "Broken"
    }

    return map[code];
}

var stringToArray = function(stdout) {
    var results = [];
    var lines = stdout.split("\n");
    var iLines = lines.length;
    var files_with_errors = 0;
    while (iLines--) {
        var line = lines[iLines];
        if (line != "") {
            var parts = line.split("\t");
            var result = {
                filename: parts[1],
                status: codeToStatus(parts[0])
            }
            results.push(result);
        }
    }
    return results;
}