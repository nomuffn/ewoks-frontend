<template>
    <div class="cards">
        <vs-card type="3" v-for="score of scores" :key="score.id" v-on:click="openUrl(score.leaderboard_id)">
            <template #title>
                <h3>{{ score.player_name }}</h3>
            </template>
            <template #text>
                <p class="leaderboard" >{{ score.leaderboard_name }}</p>
                <div class="score" >
                    <p>{{ score.pp }}pp</p>
                    <p>{{ score.percentage }}</p>
                </div>
                <p class="hours" >~{{ score.date }}h ago</p>
            </template>
        </vs-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scores: []
        }
    },
    async fetch() {
        this.scores = await fetch("http://localhost/api.php?topTenFeed").then(res => res.json())
    },
    methods : {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        }
    }
}
</script>

<style scoped>

.cards {
    display: flex;
    flex-wrap: wrap;
}

/deep/ .vs-card {
    height: 100%;
}

/deep/ .vs-card-content {
    margin: 0px 15px 15px 0px;
    width: 31%;
}

/deep/ .vs-card__title {
    padding-top: 0;
}

/deep/ .vs-card__text {
    width: 100%;
}

/deep/ .leaderboard {
    height: 35px;
    margin-top: 15px;
}

/deep/ .hours {
    text-align: right;
    font-weight: bold;
}

/deep/ .score {
    position: absolute;
    top: 13px;
    right: 18px;
}

</style>
