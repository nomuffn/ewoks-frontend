<template>
    <div>
    <vs-alert color="primary">
        Mapsets ranked in the last: (with a few exceptions)
        <br>
        <br>

        - week: <b>{{ stats[0] }}</b>
        <br>
        - 2 weeks: <b>{{ stats[1] }}</b>
        <br>
        - month: <b>{{ stats[2] }}</b>
        <br>
        - 3 months: <b>{{ stats[3] }}</b>
        <br>
        - 6 months: <b>{{ stats[4] }}</b>

    </vs-alert>

    <TimeMapsList :maps="maps" />
    </div>
</template>

<script>

import TimeMapsList from "@/components/tabs/home/components/TimeMapsList.vue";

export default {
    components: {
        TimeMapsList
    },
    data() {
        return {
            maps: [],
            stats: []
        }
    },
    async fetch() {
        let result = await fetch("https://ewoks.de/api.php?recentlyRanked").then(res => res.json())
        this.maps = result.maps;
        this.stats = result.stats;
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
