<template>
    <div>
        <div class="navbar">
            <h2 class="title">muffnlabs</h2>
            <vs-alert class="alert" color="primary">
                <p>
                    Beastsaber Mapping Awards are happening - I appreciate anyone who considers or votes for any of my
                    maps. Thanks in advance<img src="/peepohappycry.png" />
                </p>
                <p>
                    Some maps: Kingslayer, Popular Monster, Trapped In The Past, Drifting, Obey, Clouds, CD 321,
                    Architecture, Dabun Ningen, Duplication, Alone
                </p>
                <a class="bsaber" href="https://bsaber.com/introducing-the-beastsaber-mapping-awards" target="_blank"
                    >https://bsaber.com/introducing-the-beastsaber-mapping-awards/</a
                >
                <p>
                    Also make sure to consider voting for AntiLink as Rookie Mapper of the Year, he makes sick maps 😁
                </p>
            </vs-alert>
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
var ColorHandler = require("@/assets/ColorHandler.js")
export default {
    created() {
        ColorHandler.setColor()
    },
    head() {
        return {
            link: [
                {
                    rel: "icon",
                    type: "image/svg+xml",
                    href: "/favicons/" + this.getRandomFavicon()
                }
            ]
        }
    },
    methods: {
        isActive(page) {
            if (this.$route.path.substring(1).split("/")[0] == page.path) {
                return true
            }
        },
        getRandomFavicon() {
            const icons = [
                "easmile.ico",
                "gael.ico",
                "monkaogre.ico",
                "muffn.ico",
                "muffncool.ico",
                "muffnw.ico",
                "waaa.ico",
                "wicked.ico",
                "lohl.ico"
            ]
            return icons[Math.floor(Math.random() * icons.length)]
        }
    },
    data() {
        return {
            active: "",
            pages: [
                {
                    path: "",
                    icon: "bx-home",
                    name: "Home"
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
        }
    }
}
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
.navbar {
    display: flex;
    flex-direction: column;
    align-items: center;

    .vs-alert__content__text {
        padding: 10px 5px;
    }

    .alert {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 30px;
        width: fit-content;
        margin-bottom: 15px;
    }
    .title {
        padding-bottom: 0;
    }
    p {
        color: white;
    }
    img {
        width: 30px;
        height: 30px;
        margin-left: 10px;
    }
    .bsaber {
        background: linear-gradient(to right, #ff03f1, #ad63ff, #00a1ff, #00c4ff, #ffffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        width: fit-content;
        opacity: 0.9;

        &:hover {
            opacity: 1;
        }
    }
}
</style>
