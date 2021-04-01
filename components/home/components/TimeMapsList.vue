<template>
    <div class="card-container" >
        <vs-card :key="map.scoresaberId" v-for="map of maps"
                v-on:click="openUrl(map.scoresaberId)">
            <template #text>
            <h3>{{ map.name }}</h3>
            <p>by {{ map.mapper }}</h3>
            <p class="time">
                ~{{ map.hourdiff }} hours
            </p>
            </template>
        </vs-card>
    </div>
</template>

<script>
export default {
    props: ['maps'],
    methods : {
        openUrl: function (id) {
            if ( id != null ) window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        }
    }
}
</script>

<style scoped>

</style>
