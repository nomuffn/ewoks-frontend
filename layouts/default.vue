<template>
    <div>
        <div class="navbar">
            <div></div>
            <div>
                <h2 class="title">muffnlabs</h2>
            </div>
            <div class="donate">
                <vs-button
                    icon
                    color="#8c329f"
                    gradient
                    blank
                    href="https://ko-fi.com/muffn"
                >
                    <p>Buy me a muffin irl</p>
                    <i class="bx bxs-donate-heart"></i>
                </vs-button>
            </div>
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
var ColorHandler = require('@/assets/ColorHandler.js')
export default {
    created() {
        ColorHandler.setColor()
    },
    head() {
        return {
            link: [
                {
                    rel: 'icon',
                    type: 'image/svg+xml',
                    href: '/favicons/' + this.getRandomFavicon(),
                },
            ],
        }
    },
    methods: {
        isActive(page) {
            // cringe
            if (
                this.$route.path.substring(1).split('/')[0] ==
                page.path.split('/')[0]
            ) {
                return true
            }
        },
        getRandomFavicon() {
            const icons = [
                'easmile.ico',
                'gael.ico',
                'monkaogre.ico',
                'muffn.ico',
                'muffncool.ico',
                'muffnw.ico',
                'waaa.ico',
                'wicked.ico',
                'lohl.ico',
                'muffnDerp.ico',
            ]
            return icons[Math.floor(Math.random() * icons.length)]
        },
    },
    data() {
        return {
            active: '',
            pages: [
                {
                    path: '',
                    icon: 'bx-home',
                    name: 'Home',
                },
                {
                    path: 'tierlist',
                    icon: 'bx-pyramid',
                    name: 'Tierlists',
                },
                {
                    path: 'ranking-stuff',
                    icon: 'bx-list-ul',
                    name: 'Ranking stuff',
                },
                {
                    path: 'maptts',
                    icon: 'bx-tv',
                    name: 'MapTts',
                },
                {
                    path: 'bsst',
                    icon: 'bx-trending-up',
                    name: 'Bsst',
                },
                {
                    path: 'stats/beatsaver',
                    icon: 'bx-stats',
                    name: 'Stats',
                },
                {
                    path: 'playlists',
                    icon: 'bxs-playlist',
                    name: 'Playlist maker',
                },
                {
                    path: 'tools',
                    icon: 'bxs-wrench',
                    name: 'Tools/Misc',
                },
                {
                    path: 'configs',
                    icon: 'bx-file-blank',
                    name: 'Configs',
                },
                {
                    path: 'timeline',
                    icon: 'bx-time',
                    name: 'Timeline',
                },
            ],
        }
    },
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
    justify-content: center;
    padding: 20px;

    .title {
        padding: 0;
    }

    > * {
        flex: 1 1 100%;
    }

    .spacer {
    }
    .donate {
        align-self: center;

        button {
            padding: 0px 20px;
            margin: 0 20px 0 auto;

            i {
                margin-left: 5px;
            }
        }
    }

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
    p,
    span {
        color: white;

        a {
            color: rgb(var(--vs-primary)) !important;
            font-weight: bold;
            text-decoration: inherit;
            &:hover {
                opacity: 1;
            }
        }
    }
    img {
        width: 30px;
        height: 30px;
        margin-left: 10px;
    }
    .bsaber {
        background: linear-gradient(
            to right,
            #ff03f1,
            #ad63ff,
            #00a1ff,
            #00c4ff,
            #ffffff
        );
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
