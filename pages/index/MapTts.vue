<template>
    <div class="maptts" style="text-align: center">
        <div class="title_container">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">MapTts - Twitch Timestamps for Maps</h2>
                    <p>
                        Shows timestamps for maps that streamers have played.
                        You can suggest a link of a streamer and their
                        scoresaber profile, which will have to be approved by
                        the Approval Team until their scores & vods will be
                        checked.
                        <br />
                        Updates every hour.
                    </p>
                </div>
                <!-- <vs-button icon transparent>
                    <i class="noMargin bx bx-info-circle"></i>
                </vs-button> -->
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

                <vs-button icon @click="dialog['show'] = true">
                    Suggest Player
                    <i class="bx bxs-message-square-add"></i>
                </vs-button>
            </div>

            <div class="search">
                <vs-input v-model="search" type="search" placeholder="Search" />
                <vs-button icon transparent @click="loadScores">
                    <i class="bx bx-search-alt"></i>
                </vs-button>
            </div>

            <div class="scores">
                <Score v-for="score of scores" :key="score.id" :score="score" />
            </div>
        </div>

        <SuggestPlayerDialog v-model="dialog" />
    </div>
</template>

<script>
import Score from "@/components/maptts/Score.vue";

export default {
    components: {
        Score,
        SuggestPlayerDialog: () =>
            import("@/components/maptts/SuggestPlayerDialog.vue"),
    },
    created() {
        if (this.doesHttpOnlyCookieExist("sessionid")) {
            this.discord["status"] = "Logout ";
            this.discord["href"] = "http://192.168.2.116:8000/backend/logout";
        }
    },
    data() {
        return {
            scores: [],
            offset: 0,
            search: "",
            dialog: { show: false },
            discord: {
                status: "Login ",
                href: "http://192.168.2.116:8000/backend/discord/login",
            },
        };
    },
    async fetch() {
        console.log("fetch");
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
            this.scores = await fetch(
                `http://192.168.2.116:8000/backend/api/maptts/scores/${this.offset}/${this.search}`
            ).then((res) => res.json());
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

    .search {
        margin-bottom: 30px;
        align-self: center;
        display: flex;

        button {
            margin-left: 20px;
        }
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
