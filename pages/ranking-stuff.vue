<template>
    <div class="rankingStuff">
        <div class="content">
            <div>
                <div class="title_container">
                    <h2 class="title">Qualified Maps</h2>
                </div>

                <div class="flex">
                    <vs-button
                        href="https://muffnlabs.de/static/qualified-maps.bplist"
                    >
                        Download playlist
                    </vs-button>
                    <vs-button
                        href="https://scoresaber.com/ranking/requests"
                        target="_blank"
                    >
                        Rank Requests
                    </vs-button>
                </div>
                <Message class="self-center" :closable="false">
                    Finally moved to the new scoresaber api.
                    <br />
                    Now this list should always be fully up to date with the
                    current qualified maps. Updates every 30 minutes.
                    <br />
                    Thanks to
                    <a href="https://twitter.com/miitchelVR" target="_blank"
                        ><strong>miitchel</strong></a
                    >
                    for some code to get this going again 🤗
                </Message>

                <div class="m-4">
                    <p>
                        Maps past the ranked date:
                        <strong>{{ passedRankedDateAmount }}</strong>
                    </p>
                    <p>
                        Maps with remaining time:
                        <strong>{{ remainingTimeAmount }}</strong>
                    </p>
                </div>

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
                        Top Ten Scores Feed for > 500pp plays
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
        this.maps = (await this.$defaultApi.$get('scoresaber/qualified')).sort(
            (a, b) => {
                if (a.hoursleft > 0) return a.hoursleft - b.hoursleft
                else return b.hoursleft - a.hoursleft
            },
        )
        this.stats = await this.$defaultApi.$get('scoresaber/rankedspans')
        this.votesStats = await this.$defaultApi.$get('scoresaber/rq/stats')
    },
    computed: {
        passedRankedDateAmount() {
            return this.maps.reduce((a, b) => {
                if (b.hoursleft < 0) return a + 1
                else return a
            }, 0)
        },
        remainingTimeAmount() {
            return this.maps.reduce((a, b) => {
                if (b.hoursleft > 0) return a + 1
                else return a
            }, 0)
        },
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
