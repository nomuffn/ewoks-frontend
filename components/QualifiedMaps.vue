<template>
    <div>
        <div class="title_container">
            <h2 class="title">Qualified Maps</h2>
            <vs-button
                border
                href="https://scoresaber.com/ranking/requests"
                blank
            >
                Rank Requests
            </vs-button>
        </div>
        <vs-alert color="primary">
            <span v-html="this.$nl2br(content.Description[0].AlertText)" />

            <br />
            <template v-if="stats">
                - week: <b>{{ stats["168"] }}</b>
                <br />
                - 2 weeks: <b>{{ stats["336"] }}</b>
                <br />
                - month: <b>{{ stats["720"] }}</b>
                <br />
                - 3 months: <b>{{ stats["2160"] }}</b>
                <br />
                - 6 months: <b>{{ stats["4320"] }}</b>
            </template>
        </vs-alert>

        <alert v-for="alert in getRestAlerts" :key="alert.id" :alert="alert" />

        <loading-spinner v-if="loading" />
        <time-maps-list :maps="maps" />
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    data() {
        return {
            maps: null,
            stats: null,
            loading: true,
        };
    },
    computed: {
        getRestAlerts() {
            return this.content.Description.length > 1
                ? this.content.Description.slice(1)
                : [];
        },
    },
    props: ["content"],
    async created() {
        this.maps = await this.$defaultApi.$get("qualified");
        this.stats = await this.$defaultApi.$get("rankedspans");
        this.loading = false;
    },
    mounted() {
        //not shown anyways?
        this.$nextTick(() => {
            this.$nuxt.$loading.start();
            setTimeout(() => this.$nuxt.$loading.finish(), 500);
        });
    },
};
</script>

<style lang="scss"></style>
