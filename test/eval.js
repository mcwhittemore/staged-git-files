describe("As a module", function() {

    describe("current working directory should", function() {
        it("default to node's current working directory", function() {
            var sgf = require("../");
            sgf.cwd.should.equal(process.cwd());
        });

        it("be over writable", function() {
            var sgf = require("../");
            sgf.cwd = test_folder
            sgf.cwd.should.equal(test_folder);
        });
    });

    describe("getHead will return", function() {

        beforeEach(function(done) {
            setup(function(err) {
                if (err) {
                    done(err);
                } else {
                    newGit(function(err, stdout, stderr) {
                        if (err || stderr) {
                            done(err || new Error(stderr));
                        } else {
                            done();
                        }
                    });
                }
            });
        });

        it("firstHead in a repo without commits", function(done) {
            var sgf = newSGF();
            sgf.getHead(function(err, head) {
                head.should.equal(sgf.firstHead);
                done(err);
            });
        });

        it("some hash in a repo with commits", function(done) {
            addAndCommitFile(function(err, data) {
                if (err) {
                    done(err);
                } else {
                    var sgf = newSGF();
                    sgf.getHead(function(err, head) {
                        head.should.not.equal(sgf.firstHead);
                        done(err);
                    });
                }
            });
        });
    })

    describe("used in a directory with staged files", function() {

        before(function(done) {
            setup(function(err) {
                if (err) {
                    done(err);
                } else {
                    newGit(function(err, stdout, stderr) {
                        if (err || stderr) {
                            done(err || new Error(stderr));
                        } else {
                            done();
                        }
                    });
                }
            });
        });

        it("I should return the file paths and their git status", function(done) {
            addFile(function(err, data) {
                var sgf = newSGF();
                sgf(function(err, results) {
                    results[0].filename.should.equal(data.filename);
                    results[0].status.should.equal("Added");
                    done(err);
                });
            });
        });

        after(function(done) {
            cleanUp(done);
        })
    });
});