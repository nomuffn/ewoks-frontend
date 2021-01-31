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
    data() {
        return {
            qualifiedMaps: []
        }
    },
    async fetch() {
        this.qualifiedMaps = await fetch("http://localhost/api.php?qualifiedMaps").then(res => res.json())
    },
    methods : {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        }
    }
}
</script>

<style scoped>



</style>
