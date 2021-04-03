<template>
    <div class="cards">
        <Loading v-if="loading" />
        <vs-card
            v-for="score of scores"
            :key="score.id"
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
                    <span class="time">~{{ score.date }}h ago</span>
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
    </div>
</template>

<script>
import Loading from "@/components/LoadingSpinner.vue";
export default {
    data() {
        return {
            scores: [],
            loading: true,
        };
    },
    components: {
        Loading,
    },
    async fetch() {
        this.scores = await this.$axios.$get("?topTenFeed");
        this.loading = false;
    },
    methods: {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
    },
};
</script>

<style scoped>
/deep/ .vs-card-content {
    width: 100%;
}

/deep/ .vs-card {
    max-width: 100%;
}

/deep/ .vs-card__text {
    flex-direction: row !important;
    text-align: left;
}

/deep/ .leaderboard {
    width: 75%;
    padding-right: 10px;
}

/deep/ .score {
    width: 25%;
    text-align: right;
    align-self: center;
    text-align: right;
    font-weight: bold;
}

/deep/ .hours {
    text-align: right;
    font-weight: bold;
}

/deep/ .pp {
    color: rgb(var(--vs-color));
    font-weight: bold;
}
</style>
