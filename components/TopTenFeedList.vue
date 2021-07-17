<template>
    <div class="cards toptenfeed">
        <Loading v-if="loading" />
        <vs-card
            v-for="(score, index) of getScores"
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
                        {{ score.pp }}<span class="pp">pp</span>
                        <br />
                        {{ score.percentage }}
                    </p>
                </div>
            </template>
        </vs-card>
        <vs-button
            v-if="visibleItems < 25"
            class="showMore"
            icon
            @click="visibleItems += 10"
        >
            Show more
        </vs-button>
    </div>
</template>

<script>
import Loading from "@/components/LoadingSpinner.vue";
export default {
    data() {
        return {
            scores: [],
            loading: true,
            visibleItems: 10,
        };
    },
    components: {
        Loading,
    },

    async created() {
        this.scores = await this.$defaultApi.$get("toptenfeed");
        this.loading = false;
    },
    computed: {
        getScores() {
            return this.scores?.slice(0, this.visibleItems);
        },
    },
    methods: {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
    },
};
</script>

<style lang="scss">
.toptenfeed {
    display: flex;
    flex-direction: column;
    align-items: center;

    .vs-card-content {
        width: 100%;
    }

    .vs-card {
        max-width: 100%;
    }

    .vs-card__text {
        flex-direction: row !important;
        text-align: left;
    }

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
</style>
