<template>
    <div class="main_content rankingQueue">
        <div class="col first">
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
                    If a map disappears from the queue it will be seen as a new
                    qualified map.
                    <br />
                    <br />
                    Mapsets ranked in the last: (with a few exceptions)
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

                <loading-spinner v-if="loading" />
                <time-maps-list :maps="maps" />
            </div>
        </div>
        <div class="col" style="width: 50%; display: flex; flex-wrap: wrap">
            <div class="col">
                <div class="title_container">
                    <h2 class="title">Latest RT/QAT Votes</h2>
                </div>
                <votes-feed />
            </div>
            <div class="col">
                <div class="title_container">
                    <h2 class="title">
                        Top Ten Scores Feed for Top 150 Ranked Songs
                    </h2>
                </div>
                <vs-alert color="primary"> Updates every hour </vs-alert>
                <top-ten-feed-list />
            </div>
        </div>
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
    async created() {
        this.maps = await this.$defaultApi.$get("qualified");
        this.stats = await this.$defaultApi.$get("rankedspans");
        this.loading = false;
    },
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.start();
            setTimeout(() => this.$nuxt.$loading.finish(), 500);
        });
    },
};
</script>

<style lang="scss">
.rankingQueue {
    .first .vs-card-content {
        flex: 1;
    }

    .vs-card {
        height: 100%;
        max-width: 100%;
        display: flex;
    }

    .vs-card-content {
        flex: 1;
        min-width: 200px;
        margin-bottom: 15px;
    }

    .first .vs-card-content {
        margin: 0px 15px 15px 0px;
    }

    .vs-card__text {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }

    .vs-card__text .time {
        margin-top: 5px;
        width: 100%;
        text-align: right;
    }

    .time::first-letter {
        color: rgb(var(--vs-color)) !important;
        font-weight: bold;
        font-size: 140%;
        padding-top: 5px;
        display: inline-block;
    }

    .card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    h3 {
        font-size: 16px;
        max-height: 45px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .vs-button {
        margin-top: 10px;
    }

    .vs-alert {
        /* max-width: fit-content; */
    }
}
</style>
