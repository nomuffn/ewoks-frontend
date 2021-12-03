<template>
    <div class="priority">
        <vs-alert color="primary">
            Days since last downvote are only shown for the first 10 downvoted mapsets to save on scoresaber requests,
            lmk if its not enough.
            <br />
            Days ago could also be off by one depending on timezones i think
        </vs-alert>
        <loading-spinner v-if="loading" style="margin-bottom: 500px;" />
        <div v-else-if="!loading && data.length > 0" class="cards">
            <vs-card
                v-for="(item, index) in data"
                v-on:click="openUrl(item)"
                :key="index"
                :class="{
                    hasDownvotes: hasDownvotes(item),
                    qualified: !hasDownvotes(item) && remainingMods(item, true) == 0,
                }"
            >
                <template #text>
                    <p class="index">#{{ index + 1 }}</p>
                    <p>
                        {{ item.levelAuthorName }}
                    </p>
                    <h3>
                        {{ item.name }}
                    </h3>
                    <p>{{ `Difficulties: ${item.difficulties}` }}</p>
                    <p>{{ `RT Votes: ${item.rankVotes.upvotes} / ${item.rankVotes.downvotes}` }}</p>
                    <p>{{ `QAT Votes: ${item.qatVotes.upvotes} / ${item.qatVotes.downvotes}` }}</p>
                    <p>{{ `Remaining mods: ${getRemainingModsText(item)}` }}</p>
                    <p class="lastComment" v-if="item.lastComment > 0">
                        {{ `Last comment ${getAgo(item.lastComment)}d ago` }}
                    </p>
                    <p class="lastComment" v-else-if="item.lastComment == 0">
                        {{ `last comment not loaded` }}
                    </p>
                </template>
            </vs-card>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            data: [],
            loading: true,
        }
    },
    methods: {
        hasDownvotes(item) {
            if (item.rankVotes.downvotes > 0 || item.qatVotes.downvotes > 0) return true
            return false
        },
        remainingMods(item, maxx = false) {
            let max = 4
            if (item.difficulties >= 4) max = 3
            const modsLeft = Math.round((item.difficulties * max - item.rankVotes.upvotes) / item.difficulties)
            if (maxx && item.difficulties >= 4) return modsLeft + 1
            return modsLeft
        },
        openUrl: function(item) {
            window.open('https://new.scoresaber.com/ranking/request/' + item.request)
        },
        getRemainingModsText(item) {
            const modsLeft = this.remainingMods(item)
            if (item.difficulties >= 4) return `${modsLeft} / ${modsLeft + 1}(GDs)`
            return modsLeft
        },
        getAgo(date) {
            const diffTime = Math.abs(Date.now() - date)
            let timeAgo = Math.ceil(diffTime / (1000 * 60 * 60))
            return Math.round(timeAgo / 24)
        },
    },
    async created() {
        const axios = this.$axios.create()
        //beautiful
        this.data = (await axios.$get('https://new.scoresaber.com/api/ranking/requests/top')).requests.concat(
            (await axios.$get('https://new.scoresaber.com/api/ranking/requests/belowTop')).requests,
        )

        let i = 0
        for (let mapset of this.data) {
            if (mapset.rankVotes.downvotes > 0) {
                if (i < 10) {
                    i++

                    let requestDetails = (
                        await axios.$get('https://new.scoresaber.com/api/ranking/request/' + mapset.request)
                    ).request
                    let allComments = requestDetails.info.rankComments

                    for (const diff of requestDetails.difficulties) {
                        if (diff.request != mapset.request) {
                            let diffDetails = await axios.$get(
                                'https://new.scoresaber.com/api/ranking/request/' + diff.request,
                            )
                            allComments = allComments.concat(diffDetails.request.info.rankComments)
                        }
                    }
                    if (allComments) {
                        let lastCommentDate
                        allComments.forEach(comment => {
                            const commentTime = new Date(comment.time)
                            if (!lastCommentDate || commentTime.getTime() > lastCommentDate.getTime())
                                lastCommentDate = commentTime
                        })
                        mapset.lastComment = lastCommentDate
                    }
                } else {
                    mapset.lastComment = 0
                }
            }
        }
        this.loading = false
    },
}
</script>

<style lang="scss">
.page.priority {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 25px 100px;

    .lastComment {
        color: orange;
    }

    .cards {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        > p {
            text-align: center;
            margin: 10px 0px;
            color: white;
            opacity: 0.5;
        }
        .vs-card-content {
            margin: 0px 15px 15px 0px;
            position: relative;
            flex-grow: 1;

            .vs-card {
                height: 100%;
                min-width: 250px;
                max-width: 100%;

                h3 {
                    max-width: 400px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }

            &.hasDownvotes {
                opacity: 0.5;
            }
            &.qualified .vs-card {
                opacity: 0.5;
                background-color: green;
            }

            .index {
                position: absolute;
                top: 20px;
                right: 20px;
            }
        }
    }
}
</style>
