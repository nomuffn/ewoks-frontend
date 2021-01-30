<template>
    <div class="card-container" >
        <vs-card :key="map.scoresaberId" v-for="map of qualifiedMaps"
                v-on:click="openUrl(map.scoresaberId)">
            <template #title>
            <h3>{{ map.name }}</h3>
            </template>
            <template #text>
            <p>
                ~{{ map.hourdiff }} hours
            </p>
            </template>
        </vs-card>
    </div>
</template>

<script>
export default {
    props: ['url'],
    data() {
        return {
            qualifiedMaps: []
        }
    },
    async fetch() {
        this.qualifiedMaps = await fetch(this.url).then(res => res.json())
    },
    methods : {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        }
    }
}
</script>

<style>

h3 {
    font-size: 16px;
}

.vs-card {
    max-width: 40%;
    widows: 40%;
}

.card-container {

}

.vs-card {
    max-width: 100%;
}

.vs-card-content {
    margin-bottom: 20px;
}

.vs-card__title {
    padding: 10px 0px;
    width: 80%;
}

.vs-card__text {
    display: flex;
    align-items: center;
    padding: 5px 18px;
}

.vs-card__text>p {
    text-align: right;
    font-weight: bold;
}

</style>
