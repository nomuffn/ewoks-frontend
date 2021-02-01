<template>
    <div class="main">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="flex-start" vs-align="flex-start" w="3">

                <h2 class="title">Qualified Maps</h2>

                <vs-alert color="primary">
                    If a map disappears from the queue it will be seen as a new qualified map for now
                </vs-alert>

                <vs-button border href="https://scoresaber.com/ranking/requests" blank>
                    Rank Requests
                </vs-button>

                <QualifiedMapsList/>

            </vs-col>
             <vs-col vs-type="flex" vs-justify="flex-start" vs-align="flex-start" w="3">

                <h2 class="title">Recently Ranked</h2>

                <RecentlyRanked/>

            </vs-col>
             <vs-col vs-type="flex" vs-justify="flex-start" vs-align="flex-start" w="3">

                <h2 class="title">Latest RT/QAT Votes</h2>

                <VotesFeed/>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>

import QualifiedMapsList from "@/components/tabs/home/components/QualifiedMapsList.vue";
import RecentlyRanked from "@/components/tabs/home/components/RecentlyRanked.vue";
import VotesFeed from "@/components/tabs/home/components/VotesFeed.vue";

export default {
	components: {
		QualifiedMapsList,
		RecentlyRanked,
		VotesFeed
	}
}
</script>

<style scoped>

/deep/ .vs-card {
    max-width: 100%;
    padding: 10px 0;
}

/deep/ .vs-card-content {
    margin-bottom: 20px;
}

/deep/ .vs-card__title {
    padding: 0px 10px;
    width: 80%;
}

/deep/ .vs-card__text {
    display: flex;
    align-items: center;
    padding: 5px 18px;
    flex-wrap: wrap;
}

/deep/ .vs-card__text>p {
    text-align: right;
    font-weight: bold;
    white-space: nowrap;
    width: 20%;
}


</style>
