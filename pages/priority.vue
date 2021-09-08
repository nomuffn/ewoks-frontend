<template>
    <div class="priority">
        <loading-spinner v-if="loading" style="margin-bottom: 500px;" />
        <div v-else-if="!loading && data.length > 0" class="cards">
            <vs-card
                v-for="(item, index) in data"
                v-on:click="openUrl(item)"
                :key="index"
                :class="{
                    hasDownvotes: hasDownvotes(item),
                    qualified: !hasDownvotes(item) && remainingMods(item, true) == 0
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
                </template>
            </vs-card>
        </div>

        <dialogs-maps-dialog v-model="mapsDialog" @close="mapsDialog = null" />
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    data() {
        return {
            data: [],
            loading: true
        };
    },
    methods: {
        hasDownvotes(item) {
            if (item.rankVotes.downvotes > 0 || item.qatVotes.downvotes > 0) return true;
            return false;
        },
        remainingMods(item, maxx = false) {
            let max = 4;
            if (item.difficulties >= 4) max = 3;
            const modsLeft = Math.round((item.difficulties * max - item.rankVotes.upvotes) / item.difficulties);
            if (maxx && item.difficulties >= 4) return modsLeft + 1;
            return modsLeft;
        },
        openUrl: function(item) {
            window.open("https://new.scoresaber.com/ranking/request/" + item.request);
        },
        getRemainingModsText(item) {
            const modsLeft = this.remainingMods(item);
            if (item.difficulties >= 4) return `${modsLeft} / ${modsLeft + 1}(GDs)`;
            return modsLeft;
        }
    },
    async created() {
        const axios = this.$axios.create();
        //beautiful
        this.data = (await axios.$get("https://new.scoresaber.com/api/ranking/requests/top")).requests.concat(
            (await axios.$get("https://new.scoresaber.com/api/ranking/requests/belowTop")).requests
        );
        this.loading = false;
    }
};
</script>

<style lang="scss">
.page.priority {
    display: flex;
    justify-content: center;

    .cards {
        display: flex;
        flex-wrap: wrap;
        padding: 50px 100px;
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
