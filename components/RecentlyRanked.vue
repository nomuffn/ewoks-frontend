<template>
    <div>
        <vs-alert color="primary">
            Mapsets ranked in the last: (with a few exceptions)
            <br />
            <br />

            - week: <b>{{ stats[0] }}</b>
            <br />
            - 2 weeks: <b>{{ stats[1] }}</b>
            <br />
            - month: <b>{{ stats[2] }}</b>
            <br />
            - 3 months: <b>{{ stats[3] }}</b>
            <br />
            - 6 months: <b>{{ stats[4] }}</b>
        </vs-alert>

        <Loading v-if="loading" />
        <TimeMapsList :maps="maps" />
    </div>
</template>

<script>
import TimeMapsList from "@/components/TimeMapsList.vue";
import Loading from "@/components/LoadingSpinner.vue";

export default {
    components: {
        TimeMapsList,
        Loading,
    },
    data() {
        return {
            maps: [],
            stats: [],
            loading: true,
        };
    },
    async fetch() {
        let result = await this.$axios.$get("?recentlyRanked");
        this.loading = false;
        this.maps = result.maps;
        this.stats = result.stats;
    },
    methods: {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
    },
};
</script>

<style scoped></style>
