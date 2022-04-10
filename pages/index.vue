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
                        href="https://scoresaber.com/leaderboards?search=muffn"
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
                                Notes to dots converter
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

                        <div
                            v-if="!scripts.length"
                            style="align-self: center; margin: 0px 50px;"
                        >
                            <loading-spinner />
                        </div>
                        <template v-else>
                            <div
                                v-for="(item, index) in scripts"
                                :key="index"
                                class="card"
                            >
                                <h3>{{ item.title }}</h3>
                                <div v-html="item.description"></div>
                                <p class="updated_at">
                                    Last updated:
                                    {{
                                        new Date(
                                            item.updated_at,
                                        ).toLocaleDateString()
                                    }}
                                </p>

                                <div class="buttons">
                                    <vs-button
                                        border
                                        style="min-width: 60px"
                                        primary
                                        animation-type="scale"
                                        blank
                                        :href="item.source"
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
                                        :href="item.executable"
                                    >
                                        <i class="bx bxs-download"></i>
                                        <template #animate> Download </template>
                                    </vs-button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="misc">
                <!-- sorry not sorry -->
                <div
                    v-if="!links.length"
                    style="display: flex; width: 100%; justify-content: center; margin-top: 100px"
                >
                    <loading-spinner />
                </div>
                <template v-else>
                    <div v-for="cat in linkCategories" :key="cat" class="col">
                        <div class="title_container">
                            <h2 class="title">{{ getCategoryName(cat) }}</h2>
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) in getLinks(cat)"
                                :key="index"
                            >
                                <a target="_blank" :href="item.link">{{
                                    item.name
                                }}</a>
                            </li>
                        </ul>
                    </div>
                </template>
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
            scripts: [],
            links: [],
        }
    },
    async created() {
        this.scripts = await this.$defaultApi.$get('general/scripts')
        this.links = await this.$defaultApi.$get('general/links')
    },
    methods: {
        convertToDots(input) {
            convertToDots(input)
        },
        fixWalls(input) {
            fixWalls(input, this.bpm)
        },
        getCategoryName(category) {
            if (category == 'hsv') return 'HSV'
            if (category == 'customnotes') return 'Custom Notes'
            return category.charAt(0).toUpperCase() + category.slice(1)
        },
        getLinks(category) {
            return this.links.filter(conf => conf.category == category)
        },
    },
    computed: {
        linkCategories() {
            const links = this.links.map(conf => conf.category)
            return [...new Set(links)] //makes it unique
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
            flex: 1;
            // margin-bottom: 10px;
        }

        .buttons {
            display: flex;
            margin-top: 5px;
            justify-content: flex-end;
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
