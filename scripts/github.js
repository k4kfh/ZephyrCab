gh = {
    update: function (user, repo) {
        gh.releases.update(user, repo)
        gh.tags.update(user, repo)
        setTimeout(gh.processReleaseInfo, 500);
    },
    processReleaseInfo: function () {
        $.get(bundles.tools.getBaseUrl() + ".git/refs/heads/master", function (data) {
            gh.localVersion.commit = data.substring(0, data.length - 1);
            var releases = gh.releases.listByCommit();
            for (var x = 0; x < releases.length; x++) {
                if (releases[x].commit.sha == gh.localVersion.commit) {
                    gh.localVersion.release = releases[x].name;
                    gh.localVersion.prerelease = releases[x].prerelease;
                    gh.localVersion.releaseNotes = releases[x].releaseNotes;
                    gh.localVersion.publishedAt = releases[x].publishedAt;
                }
            }
            if (gh.localVersion.release == "") {
                gh.localVersion.release = "rolling-" + gh.localVersion.commit;
                gh.localVersion.prerelease = true;
                gh.localVersion.releaseNotes = "https://github.com/k4kfh/ZephyrCab/commit/" + gh.localVersion.commit;
                gh.localVersion.publishedAt = null;
            }

            $("#github-release-name").html("<code>" + gh.localVersion.release + "</code>")
            if (gh.localVersion.releaseNotes != "") {
                $("#github-release-name").attr('href', gh.localVersion.releaseNotes);
            }
            if (gh.localVersion.prerelease) {
                $("#github-release-prerelease").html("Prerelease (Unstable)")
            } else {
                $("#github-release-prerelease").html("Regular Release")
            }

            //is this the most up to date release
            var dates = []
            gh.releases.listByCommit().forEach(function (rel) {
                dates.push(rel.publishedAt)
            })
            var latestDate = Math.max.apply(null, dates)
            var latestRelease; //define for scoping
            gh.releases.listByCommit().forEach(function(rel){
                if (rel.publishedAt.getTime() == latestDate) {
                    latestRelease = rel;
                }
            })

            //if it's not a rolling release (where there is no applicable date) and it's not the latest release, let the user know
            if (gh.localVersion.release.indexOf("rolling") != -1) {
                $("#update-available").html("Rolling releases require manual update checks.")
            }
            else if (gh.localVersion.publishedAt.getTime() != latestDate && gh.localVersion.release.indexOf("rolling") == -1) {
                $("#update-available").html("Update available!")
                $("#update-available").attr("href", latestRelease.releaseNotes)
                //only alert the user actively if the release is stable
                if (latestRelease.prerelease == false) {
                    alert("New stable release available! Download the update at " + latestRelease.releaseNotes)
                }
            }
            else {
                $("#update-available").html("No updates available.")
            }
        });
    },
    releases: {
        update: function (user, repository) {
            $.get("https://api.github.com/repos/" + user + "/" + repository + "/releases", function (data, status) {
                gh.releases.rawdata = data;
            });
        },
        listByCommit: function () {
            var output = []
            gh.releases.rawdata.forEach(function (rel) {
                gh.tags.rawdata.forEach(function (tag) {
                    if (tag.name == rel.tag_name) {
                        var object = {
                            "name": tag.name,
                            "commit": tag.commit,
                            "releaseNotes": rel.html_url,
                            "prerelease": rel.prerelease,
                            "publishedAt": new Date(rel.published_at),
                        }
                        output.push(object)
                    }
                })
            })
            return output;
        },
        rawdata: [],
    },
    tags: {
        update: function (user, repository) {
            $.get("https://api.github.com/repos/" + user + "/" + repository + "/tags", function (data, status) {
                gh.tags.rawdata = data;
            });
        },
        rawdata: "",
    },
    localVersion: {
        commit: "",
        release: "",
        prerelease: "",
        releaseNotes: "",
    }
}

gh.update("k4kfh", "ZephyrCab")
