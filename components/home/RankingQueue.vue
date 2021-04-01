<template>
  <div class="main_content">
    <vs-alert color="primary">
      If you have any feature/design suggestions feel free to hit me up on discord
      <img
        style="position: absolute; margin-left: 5px"
        src="eastandardsmile.png"
      />
    </vs-alert>

    <div class="col first">
      <div>
        <div class="title_container">
          <h2 class="title">Unrank timer</h2>
        </div>
        <vs-alert color="primary">
          It was finally agreed on to unrank maps
        </vs-alert>

        <Loading v-if="loading" />
        <TimeMapsList :maps="unrankMaps" />
      </div>
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
          If a map disappears from the queue it will be seen as a new qualified
          map.
        </vs-alert>

        <Loading v-if="loading" />
        <TimeMapsList :maps="maps" />
      </div>
      <div>
        <h2 class="title">Recently Ranked</h2>
        <RecentlyRanked />
      </div>
    </div>
    <div class="col" style="width: 50%; display: flex; flex-wrap: wrap">
      <div class="col">
        <div class="title_container">
          <h2 class="title">Latest RT/QAT Votes</h2>
        </div>
        <VotesFeed />
      </div>
      <div class="col">
        <div class="title_container">
          <h2 class="title">Top Ten Scores Feed for Top 150 Ranked Songs</h2>
        </div>
        <vs-alert color="primary"> Updates every hour </vs-alert>
        <TopTenFeedList />
      </div>
    </div>
  </div>
</template>

<script>
import TimeMapsList from "@/components/home/components/TimeMapsList.vue";
import RecentlyRanked from "@/components/home/components/RecentlyRanked.vue";
import VotesFeed from "@/components/home/components/VotesFeed.vue";
import TopTenFeedList from "@/components/home/components/TopTenFeedList.vue";

import Loading from "@/components/LoadingSpinner.vue";

export default {
  components: {
    TimeMapsList,
    RecentlyRanked,
    VotesFeed,
    TopTenFeedList,
    Loading,
  },
  data() {
    return {
      maps: [],
      loading: true,
      unrankMaps: [],
    };
  },
  async fetch() {
    this.maps = await this.$axios.$get("?qualifiedMaps");
    this.unrankMaps = await this.$axios.$get("?unrankMaps");
    this.loading = false;
  },
};
</script>

<style scoped>
/deep/ .first .vs-card-content {
  flex: 1;
}

/deep/ .vs-card {
  height: 100%;
  max-width: 100%;
  display: flex;
}

/deep/ .vs-card-content {
  flex: 1;
  min-width: 200px;
  margin-bottom: 15px;
}

/deep/ .first .vs-card-content {
  margin: 0px 15px 15px 0px;
}

/deep/ .vs-card__text {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

/deep/ .vs-card__text .time {
  margin-top: 5px;
  width: 100%;
  text-align: right;
}

/deep/ .time::first-letter {
  color: rgb(var(--vs-color)) !important;
  font-weight: bold;
  font-size: 140%;
  padding-top: 5px;
  display: inline-block;
}

/deep/ .card-container {
  display: flex;
  flex-wrap: wrap;
}

/deep/ h3 {
  font-size: 16px;
  max-height: 45px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/deep/ .vs-button {
  margin-top: 10px;
}

/deep/ .vs-alert {
  /* max-width: fit-content; */
}
</style>
