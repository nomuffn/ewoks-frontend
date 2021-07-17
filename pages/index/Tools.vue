<template>
    <div class="main_content tools">
        <div class="col">
            <h2 class="title">Tools</h2>

            <div class="cards">
                <vs-card>
                    <template #title>
                        <h3>Interactive walls length fixer for rankability</h3>
                    </template>
                    <template #text>
                        <p>
                            Thanks Qwasyx for proper wall detection code since
                            I'm lazy.
                            <br />
                            <br />
                            Enter bpm and upload file. If it doesnt work try to
                            refresh and try again.
                            <br />
                            If it still doesnt work message me on discord.
                        </p>

                        <vs-input
                            label-placeholder="BPM"
                            primary
                            v-model="bpm"
                        />

                        <div class="buttons" id="fileinputblaWalls">
                            <div style="flex: 1"></div>

                            <vs-button
                                border
                                style="min-width: 120px"
                                primary
                                animation-type="scale"
                                @click="$refs.wallsInput.click()"
                            >
                                <i class="bx bx-upload"></i>
                                <template #animate>
                                    Upload difficulty
                                </template>
                            </vs-button>
                            <input
                                @change="fixWalls"
                                style="display: None"
                                type="file"
                                ref="wallsInput"
                                id="file"
                                name="file"
                                accept=".dat,.json"
                            />
                        </div>
                    </template>
                </vs-card>

                <vs-card>
                    <template #title>
                        <h3>Notes to just boring dots as timings converter</h3>
                    </template>
                    <template #text>
                        <p>
                            If it doesnt work try to refresh and try again. If
                            it still doesnt work message me on discord.
                        </p>

                        <div class="buttons" id="fileinputbla">
                            <div style="flex: 1"></div>

                            <vs-button
                                border
                                style="min-width: 120px"
                                primary
                                animation-type="scale"
                                @click="$refs.dotsInput.click()"
                            >
                                <i class="bx bx-upload"></i>
                                <template #animate>
                                    Upload difficulty
                                </template>
                            </vs-button>
                            <input
                                @change="convertToDots"
                                style="display: None"
                                type="file"
                                ref="dotsInput"
                                id="file"
                                name="file"
                                accept=".dat,.json"
                            />
                        </div>
                    </template>
                </vs-card>

                <vs-card>
                    <template #title>
                        <h3>Ranking Queue Playlist</h3>
                    </template>
                    <template #text>
                        <p>
                            Playlist will update every 3 hours.
                            <br />
                            Use Beatlist, Modassistant or the playlist
                            downloader to the right to download playlists.
                            <br />
                        </p>

                        <div class="buttons">
                            <div style="flex: 1"></div>

                            <a
                                href="bsplaylist://playlist/https://ewoks.de/playlists/InRankingQueue.json"
                                download
                            >
                                <vs-button
                                    border
                                    style="min-width: 120px"
                                    primary
                                    animation-type="scale"
                                >
                                    <i class="bx bx-cloud-download"></i>
                                    <template #animate>
                                        One-Click Install
                                    </template>
                                </vs-button>
                            </a>

                            <a href="playlists/InRankingQueue.json" download>
                                <vs-button
                                    border
                                    style="min-width: 80px"
                                    primary
                                    animation-type="scale"
                                >
                                    <i class="bx bx-download"></i>
                                    <template #animate> Download </template>
                                </vs-button>
                            </a>
                        </div>
                    </template>
                </vs-card>
            </div>
        </div>

        <div class="col">
            <h2 class="title">Scripts</h2>

            <vs-alert color="primary">
                If you find or have other scripts that you'd like to get listed
                here let me know on discord.
            </vs-alert>

            <div class="cards">
                <vs-card>
                    <template #title>
                        <h3>CustomLevelsToPlaylist</h3>
                    </template>
                    <template #text>
                        <p>
                            Converts CustomLevels to a playlist :o
                            <br />
                            - Run in a CustomLevels folder
                        </p>

                        <div class="buttons">
                            <div style="flex: 1"></div>
                            <vs-button
                                border
                                style="min-width: 60px"
                                primary
                                animation-type="scale"
                                blank
                                href="scripts/CustomLevelsToPlaylist Converter.py"
                            >
                                <i class="bx bx-code-alt"></i>
                                <template #animate> Source </template>
                            </vs-button>

                            <vs-button
                                border
                                style="min-width: 80px"
                                primary
                                animation-type="scale"
                                blank
                                href="scripts/CustomLevelsToPlaylist Converter.exe"
                            >
                                <i class="bx bxs-download"></i>
                                <template #animate> Download </template>
                            </vs-button>
                        </div>
                    </template>
                </vs-card>

                <vs-card>
                    <template #title>
                        <h3>BlueOrRedRemover</h3>
                    </template>
                    <template #text>
                        <p>
                            Removes either all blue or red notes.
                            <br />
                            - Just drag a difficulty on the file
                        </p>

                        <div class="buttons">
                            <div style="flex: 1"></div>
                            <vs-button
                                border
                                style="min-width: 60px"
                                primary
                                animation-type="scale"
                                blank
                                href="scripts/BlueOrRedRemoverYesYEs.py"
                            >
                                <i class="bx bx-code-alt"></i>
                                <template #animate> Source </template>
                            </vs-button>

                            <vs-button
                                border
                                style="min-width: 80px"
                                primary
                                animation-type="scale"
                                blank
                                href="scripts/BlueOrRedRemoverYesYEs.exe"
                            >
                                <i class="bx bxs-download"></i>
                                <template #animate> Download </template>
                            </vs-button>
                        </div>
                    </template>
                </vs-card>

                <vs-card>
                    <template #title>
                        <h3>Bookmarks 2 Text</h3>
                    </template>
                    <template #text>
                        <p>
                            Converts bookmarks to pure text so you can
                            rankability/playability mod in the editor.
                            <br />
                            - Run in a song folder
                        </p>

                        <div class="buttons">
                            <div style="flex: 1"></div>
                            <vs-button
                                border
                                style="min-width: 60px"
                                primary
                                animation-type="scale"
                                blank
                                href="scripts/bookmarks2Text.py"
                            >
                                <i class="bx bx-code-alt"></i>
                                <template #animate> Source </template>
                            </vs-button>

                            <vs-button
                                border
                                style="min-width: 80px"
                                primary
                                animation-type="scale"
                                blank
                                href="scripts/bookmarks2Text.exe"
                            >
                                <i class="bx bxs-download"></i>
                                <template #animate> Download </template>
                            </vs-button>
                        </div>
                    </template>
                </vs-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    data() {
        return {
            bpm: "",
        };
    },
    methods: {
        convertToDots(input) {
            var f = input.target.files[0];

            if (f) {
                var r = new FileReader();
                r.onload = function (e) {
                    var contents = e.target.result;
                    try {
                        var obj = JSON.parse(contents);
                        if (obj._notes != null) {
                            for (var i = 0; i < obj._notes.length; i++) {
                                if (obj._notes[i]._type === 3) {
                                    obj._notes.splice(i, 1);
                                    i = 0;
                                }

                                var c = 0;
                                for (var n = 0; n < obj._notes.length; n++) {
                                    if (
                                        obj._notes[i]._time ===
                                        obj._notes[n]._time
                                    ) {
                                        if (c === 0) {
                                            c++;
                                        } else {
                                            obj._notes.splice(n, 1);
                                            n = 0;
                                            c = 0;
                                        }
                                    }
                                }
                            }

                            for (var k in obj._notes) {
                                obj._notes[k]._lineIndex = 3;
                                obj._notes[k]._lineLayer = 0;
                                obj._notes[k]._type = 1;
                                obj._notes[k]._cutDirection = 8;
                            }
                            var element = document.createElement("a");
                            element.setAttribute(
                                "href",
                                "data:text/plain;charset=utf-8," +
                                    encodeURIComponent(JSON.stringify(obj))
                            );
                            element.setAttribute(
                                "download",
                                "Timings of " + f.name
                            );

                            element.style.display = "none";
                            document
                                .getElementById("fileinputbla")
                                .appendChild(element);
                            element.click();
                            document
                                .getElementById("fileinputbla")
                                .removeChild(element);
                        } else {
                            alert("Invalid file");
                        }
                    } catch (err) {
                        alert("Invalid file");
                    }
                };
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        },
        fixWalls(input) {
            var bpm = this.bpm;

            if (isNaN(bpm) || bpm == "") {
                alert("BPM must be a number >:(");
                return false;
            }

            var f = input.target.files[0];

            if (f) {
                var r = new FileReader();
                r.onload = function (e) {
                    var contents = e.target.result;
                    try {
                        var obj = JSON.parse(contents);

                        if (obj._obstacles != null) {
                            for (var i = 0; i < obj._obstacles.length; i++) {
                                var wall = obj._obstacles[i];

                                if (
                                    wall._duration * (60 / bpm) + 1e-9 < 0.02 &&
                                    (wall._width >= 2 ||
                                        wall._lineIndex == 1 ||
                                        wall._lineIndex == 2)
                                ) {
                                    wall._duration = (0.02 - 1e-9) / (60 / bpm);
                                }
                            }

                            var element = document.createElement("a");
                            element.setAttribute(
                                "href",
                                "data:text/plain;charset=utf-8," +
                                    encodeURIComponent(JSON.stringify(obj))
                            );
                            element.setAttribute(
                                "download",
                                "Fixed Walls for " + f.name
                            );

                            element.style.display = "none";
                            document
                                .getElementById("fileinputblaWalls")
                                .appendChild(element);
                            element.click();
                            document
                                .getElementById("fileinputblaWalls")
                                .removeChild(element);
                        } else {
                            alert("Invalid file1");
                        }
                    } catch (err) {
                        alert("Invalid file2: " + err);
                    }
                };
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        },
    },
};
</script>

<style lang="scss">
.tools {
    h2 {
        margin: 20px 0px;
    }

    .vs-input-parent {
        margin: 15px;
        width: 100%;
    }

    .cards {
        display: flex;
        flex-wrap: wrap;
    }

    .vs-card {
        padding: 10px;
    }

    .vs-card__text {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    p {
        margin-bottom: 10px;
        flex: 1;
    }

    .buttons {
        display: flex;
    }

    .vs-card-content {
        margin: 0px 20px 20px 0px;
        flex: 1;
    }

    a {
        text-decoration: none;
    }

    /* .vs-card-content.type-1 .vs-card:hover {
        box-shadow: none;
        transform: none;
    } */
}
</style>
