<template>
    <div class="maptts" style="text-align: center">
        <div class="title_container">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        (Experimental) MapTts - Twitch Timestamps for Maps
                    </h2>
                    <p>
                        Shows timestamps for maps that streamers have played.
                        <br />
                        The script will only check approved players.
                        <br />
                        Updates every two hours.
                    </p>
                    <vs-button icon border @click="dialog['players'] = true">
                        Approved Players
                    </vs-button>
                </div>
            </div>

            <vs-button
                class="disc"
                :href="discord['href']"
                icon
                color="discord"
            >
                {{ discord["status"] }}
                <i class="bx bxl-discord"></i>
            </vs-button>
        </div>

        <div class="main_content">
            <vs-alert color="primary">
                Currently can't get the song length so the timestamps are only:
                <br />
                time the score was set in the vod minus 2:20 minutes
            </vs-alert>

            <div class="title_container">
                <h2 class="title">Latest Scores</h2>

                <vs-button icon @click="dialog['suggest'] = true">
                    Suggest Player
                    <i class="bx bxs-message-square-add"></i>
                </vs-button>
            </div>

            <div class="row">
                <div class="search">
                    <vs-input
                        v-model="search"
                        type="search"
                        placeholder="Search"
                        v-on:keyup.enter="startSearch"
                    />
                    <vs-button icon transparent @click="startSearch">
                        <i class="bx bx-search-alt"></i>
                    </vs-button>
                </div>

                <vs-pagination v-model="page" :length="paginationLength" />
            </div>

            <div class="scores">
                <Loading v-if="loading" />
                <Score v-for="score of scores" :key="score.id" :score="score" />
            </div>

            <vs-pagination v-model="page" :length="paginationLength" />
        </div>

        <SuggestPlayerDialog v-model="dialog" />
        <PlayersDialog class="players-dialog" v-model="dialog" />
    </div>
</template>

<script>
import Score from "@/components/maptts/Score.vue";
import Loading from "@/components/LoadingSpinner.vue";

export default {
    watch: {
        page(newValue, oldValue) {
            this.loadScores();
            return null;
        },
    },
    components: {
        Score,
        SuggestPlayerDialog: () =>
            import("@/components/maptts/SuggestPlayerDialog.vue"),
        PlayersDialog: () => import("@/components/maptts/PlayersDialog.vue"),
        Loading,
    },
    created() {
        if (this.doesHttpOnlyCookieExist("sessionid")) {
            this.discord["status"] = "Logout ";
            this.discord["href"] = this.$config.discordLogout;
        }
    },
    data({ $config: { discordLogin } }) {
        return {
            scores: [],
            search: "",
            page: 1,
            paginationLength: 3,
            loading: true,
            dialog: {
                suggest: false,
                players: false,
            },
            discord: {
                status: "Login ",
                href: discordLogin,
            },
        };
    },
    async fetch() {
        this.loadScores();
    },
    methods: {
        doesHttpOnlyCookieExist(cookiename) {
            var d = new Date();
            d.setTime(d.getTime() + 1000);
            var expires = "expires=" + d.toUTCString();

            document.cookie = cookiename + "=new_value;path=/;" + expires;
            if (document.cookie.indexOf(cookiename + "=") == -1) return true;
            else return false;
        },
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
        async loadScores() {
            this.loading = true;
            this.scores = await this.$mapttsApi.$get(
                `scores/${this.page - 1}/${this.search}`
            );

            if (this.scores.length < 25) {
                this.paginationLength = this.page;
            } else {
                if (this.paginationLength == this.page) {
                    this.paginationLength++;
                }
            }
            this.loading = false;
        },
        startSearch() {
            this.page = 1;
            this.paginationLength = 1;
            this.loadScores();
        },
    },
};
</script>

<style lang="scss" scoped>
.maptts {
    p {
        color: #fff;
        text-align: left;
    }

    .main_content {
        flex-direction: column;
        align-content: center;
    }

    .vs-alert {
        width: auto;
    }

    .disc {
        min-width: 85px;
    }

    .row {
        display: flex;
        margin-bottom: 30px;
        place-content: space-between;
        flex-wrap: wrap;

        .search {
            display: flex;
        }
    }

    .scores {
        max-width: 800px;
        width: 100%;
    }

    .title_container {
        justify-content: space-between;

        i {
            margin-left: 5px;

            &.noMargin {
                margin-left: 0px;
            }
        }

        .left {
            display: flex;
            .title {
                padding: 0px;

                i {
                    margin-top: 5px;
                }
            }

            .aaa {
                display: flex;
                flex-direction: column;
                padding: 20px 0px 30px 0px;
                text-align: left;
                max-width: 1000px;

                p {
                    opacity: 0.5;
                }

                .vs-button {
                    max-width: 120px;
                    margin-top: 15px;
                }
            }
            > button {
                height: max-content;
                align-self: center;
            }
        }
    }

    > .title_container {
        background: #141417;
        border-radius: 0px 0px 20px 20px;
        padding: 0px 5%;
    }

    .wrapper {
        text-align: left;
    }
}
</style>
