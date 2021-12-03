<template>
    <div class="cards toptenfeed vertical">
        <Loading v-if="loading" />
        <div class="card" v-for="(score, index) of getScores" :key="index" v-on:click="openUrl(score.leaderboard_id)">
            <p class="leaderboard">
                <span style="font-weight: bold"
                    ><span class="colored">#{{ score.rank }}</span> {{ score.player_name }}</span
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
        </div>
        <vs-button v-if="visibleItems < 25" class="showMore" icon @click="visibleItems += 10">
            Show more
        </vs-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scores: [],
            loading: true,
            visibleItems: 10,
        }
    },
    async created() {
        this.scores = await this.$defaultApi.$get('scoresaber/toptenfeed')
        this.loading = false
    },
    computed: {
        getScores() {
            return this.scores?.slice(0, this.visibleItems)
        },
    },
    methods: {
        openUrl: function(id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank')
        },
    },
}
</script>

<style lang="scss">
.toptenfeed {
    display: flex;
    flex-direction: column;
    align-items: center;

    .card {
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
        color: rgb(var(--vs-primary));
        font-weight: bold;
    }
}
</style>
