<template>
    <div class="start">
        <div class="content">
            <div class="summary">
                <h2>Ayo</h2>
                <span>
                    <p>i do stuff for beat saber</p>
                    <img style="margin-left: 10px" src="wicked.png" />
                </span>

                <div class="buttons">
                    <vs-button
                        style="flex: 1 1 100%"
                        href="https://scoresaber.com/?search=muffn"
                        blank
                        icon
                        class="yellow"
                    >
                        My maps
                    </vs-button>
                    <vs-button class="discord" icon border color="discord">
                        muffn#2345
                        <i class="bx bxl-discord"></i>
                    </vs-button>
                    <vs-button
                        href="https://twitter.com/nomuffn"
                        blank
                        icon
                        color="twitter"
                    >
                        @nomuffn
                        <i class="bx bxl-twitter"></i>
                    </vs-button>
                    <vs-button
                        href="https://www.twitch.tv/muffnnt"
                        blank
                        icon
                        color="twitch"
                    >
                        muffnnt
                        <i class="bx bxl-twitch"></i>
                    </vs-button>
                    <vs-button
                        href="https://github.com/nomuffn"
                        blank
                        icon
                        class="github"
                    >
                        nomuffn
                        <i class="bx bxl-github"></i>
                    </vs-button>
                </div>
                <figure>
                    <img src="muffnsuic.gif" />
                    <footer>
                        <small
                            >Made by
                            <a
                                class="colored"
                                href="https://twitter.com/AntiLink99"
                                target="_blank"
                                style="color: white;"
                                >AntiLink</a
                            ></small
                        >
                    </footer>
                </figure>
            </div>

            <div class="tools">
                <div class="col">
                    <h2 class="title">Tools & Scripts</h2>

                    <div class="cards row">
                        <div class="card">
                            <h3>
                                Interactive walls length fixer for rankability
                            </h3>
                            <p>
                                Thanks Qwasyx for proper wall detection code
                                since I'm lazy.
                                <br />
                                <br />
                                Enter bpm and upload file. If it doesnt work try
                                to refresh and try again.
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
                        </div>
                        <div class="card">
                            <h3>
                                Notes to just boring dots as timings converter
                            </h3>
                            <p>
                                If it doesnt work try to refresh and try again.
                                If it still doesnt work message me on discord.
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
                        </div>
                        <div class="card">
                            <h3>Ranking Queue Playlist</h3>
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
                                    class="nope"
                                    href="bsplaylist://playlist/https://muffnlabs.de/playlists/InRankingQueue.json"
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

                                <a
                                    class="nope"
                                    href="playlists/InRankingQueue.json"
                                    download
                                >
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
                        </div>
                        <div class="card">
                            <h3>CustomLevelsToPlaylist</h3>
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
                        </div>
                        <div class="card">
                            <h3>BlueOrRedRemover</h3>
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
                        </div>
                        <div class="card">
                            <h3>Bookmarks 2 Text</h3>
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
                        </div>
                    </div>
                </div>
            </div>

            <div class="misc">
                <div class="col">
                    <div class="title_container">
                        <h2 class="title">Useful links</h2>
                    </div>
                    <ul>
                        <li>
                            <a
                                target="_blank"
                                href="https://skystudioapps.com/bs-viewer/"
                                >+1 Rabbit's BS Viewer - Map preview in
                                browser</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://skystudioapps.com/mapping-tools/"
                                >+1 Rabbit's Mapping Tools - Very helpful if
                                you're a mapper</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://scoresaber.com/"
                                >Scoresaber - Leaderboards & Ranking System</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://hitbloq.com/"
                                >Hitbloq - Alternative Ranking System</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://accsaber.com/"
                                >Accsaber - Ranking system about acc</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://beat-savior.herokuapp.com/#/"
                                >Beat Savior - Scoresaber Ranking Stats Tool</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://scoresaber.balibalo.xyz"
                                >Balibalo Tools - PP Calculator, Top 200 PP
                                Playlist, etc.
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://cmlsc.itch.io/beat-saber-song-downloader"
                                >DaFluffyPotato's Beat Saber Song
                                Downloader/Installer</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://docs.google.com/document/d/1FwG_Zv5FcB2UpjTxmH1y5-cQ85W2ezwr4z_D6_Z_QPY/edit#heading=h.v70h5b4th1j1"
                                >Tracking/Scoring on Oculus</a
                            >
                        </li>
                    </ul>
                </div>

                <div class="col">
                    <div class="title_container">
                        <h2 class="title">Grips</h2>
                    </div>
                    <ul>
                        <li>
                            <a
                                target="_blank"
                                href="https://cdn.discordapp.com/attachments/401173069001129984/515257917927325717/Oculus_Grips_Guide.png"
                                >Rift Grips</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://media.discordapp.net/attachments/585906960164192315/715617955261448202/unknown.png"
                                >Rift S and Quest Grips</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://bsmg.wiki/assets/img/vive-grips-guide.d9b6ee34.png"
                                >Vive Grips</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://media.discordapp.net/attachments/585906960164192315/708893196687769610/PSVR_Grips.png"
                                >PS VR Grips</a
                            >
                        </li>
                    </ul>
                </div>

                <div class="col">
                    <div class="title_container">
                        <h2 class="title">Useful discords</h2>
                    </div>
                    <ul>
                        <li>
                            <a
                                target="_blank"
                                href="https://discord.gg/beatsabermods"
                                >Beat Saber Modding Group - Modding stuff</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://discord.gg/WpuDMwU"
                                >Scoresaber - Leaderboards & Ranking stuff</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://discord.gg/dwe8mbC"
                                >Cube Community - Community stuff</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://discord.gg/5NjfSAC"
                                >BeatKhana! - Tournament stuff</a
                            >
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://discordapp.com/invite/pxWwtWJ"
                                >Hitbloq - Alternative Ranking stuff</a
                            >
                        </li>
                        <li>
                            <a target="_blank" href="https://discord.gg/EdRYahH"
                                >Refugee Camp - :)</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col" style="text-align: center">
            <img
                src="monkaOgreBlinking.gif"
                style="width: 100%; max-width: 50%;"
            />
        </div>
    </div>
</template>

<script>
import { fixWalls, convertToDots } from '@/assets/Helpers'

export default {
    data() {
        return {
            bpm: '',
        }
    },
    methods: {
        convertToDots(input) {
            convertToDots(input)
        },
        fixWalls(input) {
            fixWalls(input, this.bpm)
        },
    },
}
</script>

<style lang="scss">
.start {
    > .content {
        flex-direction: column;
        align-content: center;
        margin-bottom: 500px;
    }
    .summary {
        text-align: center;
        align-self: center;
        padding-top: 10px;

        > * {
            margin-bottom: 20px;
        }
        .buttons {
            display: flex;
            flex-wrap: wrap;
            button {
                flex: 1 1 45%;
                i {
                    margin-left: 5px;
                }

                &.discord {
                    pointer-events: none;
                }
            }
        }
        span {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            img {
                max-width: 50px;
            }
        }
    }
    .tools {
        .vs-input-parent {
            margin: 15px;
            width: 100%;
        }

        .cards {
            display: flex;
            flex-wrap: wrap;

            .card {
                height: 100%;
                max-width: 500px;
            }
        }

        p {
            margin-bottom: 10px;
            flex: 1;
        }

        .buttons {
            display: flex;
        }

        a {
            text-decoration: none;
        }
    }
    .misc {
        display: flex;
        flex-wrap: wrap;
        .col {
            flex: inherit;
        }

        li {
            color: white;
            margin-bottom: 7px;
        }

        a {
            color: rgb(var(--vs-primary));
            font-weight: bold;
        }
    }
}
</style>
