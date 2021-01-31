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

import QualifiedMapsList from "@/components/tabs/home/rankingqueue/QualifiedMapsList.vue";
import RecentlyRanked from "@/components/tabs/home/rankingqueue/RecentlyRanked.vue";
import VotesFeed from "@/components/tabs/home/rankingqueue/VotesFeed.vue";

export default {
	components: {
		QualifiedMapsList,
		RecentlyRanked,
		VotesFeed
	}
}
</script>

<style>

.main {
	margin-left: 300px;
    width: 100%;
}

.vs-col {
    margin-right: 35px;
}

.vs-sidebar-content {
	margin-top: 80px;
}

.vs-alert {
    height: auto !important;
}
.vs-alert__content {
    min-height: auto !important;
}

.title {
	display: block;
    font-weight: 400;
    font-size: 30px;
    color: #fff;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 20px 10px;
}

.text {
	color:#fff;
	margin: 20px 10px;
}



h3 {
    font-size: 16px;
}

.card-container {

}

.vs-button {
    position: absolute;
    top: 24px;
    right: 10px;
}

.vs-card {
    max-width: 100%;
    padding: 10px 0;
}

.vs-card-content {
    margin-bottom: 20px;
}

.vs-card__title {
    padding: 0px 10px;
    width: 80%;
}

.vs-card__text {
    display: flex;
    align-items: center;
    padding: 5px 18px;
    flex-wrap: wrap;
}

.vs-card__text>p {
    text-align: right;
    font-weight: bold;
    white-space: nowrap;
    width: 20%;
}

</style>
