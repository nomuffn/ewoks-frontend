<template>
    <div>
        <div class="navbar">
            <h2 class="title">Ewoks</h2>
        </div>

        <vs-sidebar square v-model="active" open>
            <vs-sidebar-item to="/RankingQueue" id="/RankingQueue">
                <template #icon>
                    <i class="bx bx-list-ul"></i>
                </template>
                Ranking Queue
            </vs-sidebar-item>

            <vs-sidebar-item to="/MapTts" id="/MapTts">
                <template #icon>
                    <i class="bx bx-tv"></i>
                </template>
                Map Twitch
            </vs-sidebar-item>

            <vs-sidebar-item to="/Statistics/beatsaver" id="/Statistics">
                <template #icon>
                    <i class="bx bx-stats"></i>
                </template>
                Statistics
            </vs-sidebar-item>

            <vs-sidebar-item to="/Playlists" id="/Playlists">
                <template #icon>
                    <i class="bx bxs-playlist"></i>
                </template>
                Playlist maker
            </vs-sidebar-item>

            <vs-sidebar-item to="/Tools" id="/Tools">
                <template #icon>
                    <i class="bx bxs-category"></i>
                </template>
                Tools & Scripts
            </vs-sidebar-item>

            <vs-sidebar-item to="/Miscellaneous" id="/Miscellaneous">
                <template #icon>
                    <i class="bx bx-library"></i>
                </template>
                Miscellaneous
            </vs-sidebar-item>

            <!-- <vs-sidebar-item to="BeatCat" id="/BeatCat">
                <template #icon>
                    <i class="bx bxs-tag-alt"></i>
                </template>
                BeatCat WIP
            </vs-sidebar-item> -->
        </vs-sidebar>

        <Nuxt class="page" keep-alive />

        <vs-button class="discord" primary gradient> <i class="bx bxl-discord bx-sm"></i>muffn#2345 </vs-button>
    </div>
</template>

<script>
var ColorHandler = require("@/assets/ColorHandler.js");
export default {
    created() {
        ColorHandler.setColor();
        this.active = this.$route.path;
    },
    data() {
        return {
            active: ""
        };
    }
};
</script>

<style lang="scss">
.page {
    .content {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: 90%;
        margin-top: 10px;
        margin-bottom: 500px;
    }

    .col {
        flex: 1;
        min-width: 250px;
        margin: 0px 10px;

        @media (max-width: 800px) {
            max-width: 100% !important;
            width: 100%;
        }
    }
}
</style>
