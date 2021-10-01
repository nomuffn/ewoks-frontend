<template>
    <div>
        <div class="navbar">
            <h2 class="title">muffnlabs</h2>
        </div>

        <vs-sidebar square open>
            <vs-sidebar-item
                v-for="page in pages"
                :key="page.path"
                :to="'/' + page.path"
                :id="page.path"
                :class="{ active: isActive(page) }"
            >
                <template #icon>
                    <i :class="`bx ${page.icon}`"></i>
                </template>
                {{ page.name }}
            </vs-sidebar-item>
        </vs-sidebar>

        <Nuxt class="page" keep-alive />
    </div>
</template>

<script>
var ColorHandler = require("@/assets/ColorHandler.js");
export default {
    created() {
        ColorHandler.setColor();
    },
    methods: {
        isActive(page) {
            if (this.$route.path.substring(1).split("/")[0] == page.path) {
                return true;
            }
        }
    },
    data() {
        return {
            active: "",
            pages: [
                {
                    path: "",
                    icon: "bx-home",
                    name: "Start"
                },
                {
                    path: "RankingQueue",
                    icon: "bx-list-ul",
                    name: "Ranking Queue"
                },
                {
                    path: "MapTts",
                    icon: "bx-tv",
                    name: "MapTts"
                },
                {
                    path: "Statistics",
                    icon: "bx-stats",
                    name: "Statistics"
                },
                {
                    path: "Playlists",
                    icon: "bxs-playlist",
                    name: "Playlist maker"
                }
            ]
        };
    }
};
</script>

<style lang="scss">
.page {
    color: #fff;
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

        @media (max-width: 550px) {
            margin: 0;
        }

        @media (max-width: 800px) {
            max-width: 100% !important;
            width: 100%;
        }
    }
}
</style>
