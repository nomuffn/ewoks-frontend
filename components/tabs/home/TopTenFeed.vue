<template>
    <div class="main">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="flex-start" vs-align="flex-start" w="12">

                <h2 class="title">Top Ten Scores Feed for Top 150 Ranked Songs</h2>

                <vs-alert color="primary">
                    Updates every hour
                </vs-alert>

                <TopTenFeedList/>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>

import TopTenFeedList from "@/components/tabs/home/components/TopTenFeedList.vue";

export default {
	components: {
        TopTenFeedList
	}
}
</script>

<style scoped>


</style>
