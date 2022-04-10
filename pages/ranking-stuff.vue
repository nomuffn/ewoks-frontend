<template>
    <div class="rankingStuff">
        <div class="content">
            <div>
                <div class="title_container">
                    <h2 class="title">Qualified Maps</h2>
                    <vs-button
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
                    Vague amount of mapsets ranked in the last:
                    <br />

                    <template v-if="stats">
                        - week: <b>{{ stats['168'] }}</b>
                        <br />
                        - 2 weeks: <b>{{ stats['336'] }}</b>
                        <br />
                        - month: <b>{{ stats['720'] }}</b>
                        <br />
                        - 3 months: <b>{{ stats['2160'] }}</b>
                        <br />
                        - 6 months: <b>{{ stats['4320'] }}</b>
                    </template>
                </vs-alert>

                <loading-spinner v-if="!maps.length" />
                <time-maps-list :maps="maps" />
            </div>
            <div>
                <div class="title_container">
                    <h2 class="title">Latest RT/QAT Votes</h2>
                </div>
                <vs-alert v-if="votesStats" color="primary">
                    Updates every hour, numbers will be slightly off :)<br />
                    Votes in the last month:<br />
                    RT Up-/Downvotes:
                    <b>{{ votesStats.lastMonth.rtupvotes__sum }}</b>
                    /
                    <b>{{ votesStats.lastMonth.rtdownvotes__sum }}</b>
                    <br />
                    QAT Up-/Downvotes:
                    <b>{{ votesStats.lastMonth.qatupvotes__sum }}</b>
                    /
                    <b>{{ votesStats.lastMonth.qatdownvotes__sum }}</b>
                    <br />
                    <br />
                    Votes since 8th August 2020:<br />
                    RT Up-/Downvotes:
                    <b>{{ votesStats.allTime.rtupvotes__sum }}</b>
                    /
                    <b>{{ votesStats.allTime.rtdownvotes__sum }}</b>
                    <br />
                    QAT Up-/Downvotes:
                    <b>{{ votesStats.allTime.qatupvotes__sum }}</b>
                    /
                    <b>{{ votesStats.allTime.qatdownvotes__sum }}</b>
                    <br />
                </vs-alert>
                <votes-feed />
            </div>
            <div>
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
    transition: 'slide-bottom',
    data() {
        return {
            maps: [],
            stats: null,
            votesStats: null,
        }
    },
    async created() {
        this.maps = await this.$defaultApi.$get('scoresaber/qualified')
        this.stats = await this.$defaultApi.$get('scoresaber/rankedspans')
        this.votesStats = await this.$defaultApi.$get('scoresaber/rq/stats')
    },
}
</script>

<style lang="scss">
.rankingStuff {
    .content {
        flex-direction: column;
    }
    .cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        button {
            max-height: 50px;
            align-self: center;
            margin-bottom: 20px;
        }
    }

    .card {
        max-width: 400px;
    }
}
</style>
