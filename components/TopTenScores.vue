<template>
    <div>
        <div class="title_container">
            <h2 class="title">Top Ten Scores Feed for Top 150 Ranked Songs</h2>
        </div>
        <alert
            v-for="alert in content.Description"
            :key="alert.id"
            :alert="alert"
        />
        <div class="cards">
            <loading-spinner v-if="loading" />
            <vs-card
                v-for="(score, index) of scores"
                :key="index"
                v-on:click="openUrl(score.leaderboard_id)"
            >
                <template #text>
                    <p class="leaderboard">
                        <span style="font-weight: bold"
                            ><span class="colored">#{{ score.rank }}</span>
                            {{ score.player_name }}</span
                        >
                        <br />
                        {{ score.leaderboard_name }}
                        <br />
                        <span class="time">~{{ score.hoursago }}h ago</span>
                    </p>
                    <div class="score">
                        <p>
                            {{ score.percentage }}
                            <br />
                            {{ score.pp }}<span class="pp">pp</span>
                        </p>
                    </div>
                </template>
            </vs-card>
        </div>
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    props: ["content"],
    data() {
        return {
            scores: [],
            loading: true,
        };
    },
    async created() {
        this.scores = await this.$defaultApi.$get("toptenfeed");
        this.loading = false;
    },
    methods: {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
    },
};
</script>

<style lang="scss">
.TopTenScores {
    .vs-card-content {
        width: 100%;

        .vs-card {
            max-width: 100%;

            .vs-card__text {
                flex-direction: row !important;
                text-align: left;

                .leaderboard {
                    width: 75%;
                    padding-right: 10px;
                }

                .score {
                    width: 25%;
                    text-align: right;
                    align-self: center;
                    text-align: right;
                    font-weight: bold;
                }

                .hours {
                    text-align: right;
                    font-weight: bold;
                }

                .pp {
                    color: rgb(var(--vs-color));
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
