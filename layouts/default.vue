<template>
    <div>
        <div class="navbar max-[1000px]:flex-wrap">
            <div class="flex justify-start">
                <my-button href="https://ko-fi.com/muffn" help>
                    <p>Buy me a muffin irl 🧁</p>
                </my-button>
            </div>
            <div class="self-center">
                <h2 class="title">muffnlabs</h2>
            </div>
            <div class="flex justify-end flex-wrap">
                <my-button
                    href="https://beatsaver.com/profile/4284309"
                    warning
                    outlined
                    noiconmargin
                >
                    <img
                        class="w-6"
                        src="https://beatsaver.com/static/favicon/favicon-32x32.png"
                    />
                </my-button>
                <my-button
                    href="https://github.com/nomuffn"
                    noiconmargin
                    outlined
                    secondary
                >
                    <i class="bx bxl-github bx-sm"></i>
                </my-button>
                <my-button
                    href="https://www.twitch.tv/muffnnt"
                    noiconmargin
                    outlined
                    help
                >
                    <i class="bx bxl-twitch bx-sm"></i>
                </my-button>

                <my-button
                    href="https://discordapp.com/users/219099186505711616/"
                    noiconmargin
                    outlined
                >
                    <i class="bx bxl-discord bx-sm"></i>
                </my-button>
                <my-button
                    href="https://twitter.com/nomuffn"
                    noiconmargin
                    outlined
                >
                    <i class="bx bxl-twitter bx-sm"></i>
                </my-button>

                <my-button v-if="!profile" @click="$auth.login()" outlined>
                    <p>Login</p>
                    <i class="bx bxl-discord"></i>
                </my-button>
                <div v-else class="flex m-2">
                    <my-button
                        notround
                        nomargin
                        class="pointer-events-none"
                        :label="profile.username"
                    />
                    <my-button reset outlined @click="$auth.logout()">
                        <i class="bx bx-log-out"></i>
                    </my-button>
                </div>
            </div>
        </div>
        <div class="menu p-2 flex flex-wrap justify-center">
            <my-button
                v-for="page in pages"
                :key="page.path"
                :to="'/' + page.path"
                :id="page.path"
                :text="!isActive(page) || false"
                :raised="isActive(page) || false"
                :class="{ new: page.new }"
            >
                <p style="color: #fff; font-weight: bold">{{ page.name }}</p>
                <i :class="`bx ${page.icon}`"></i>
            </my-button>
        </div>

        <Nuxt class="page" keep-alive />
        <Toast />
    </div>
</template>

<script>
// var ColorHandler = require('@/assets/ColorHandler.js')
export default {
    async created() {
        // TODO move to vuex store
        this.profile = await this.$auth.fetch()
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
            profile: null,
            pages: [
                {
                    path: '',
                    icon: 'bx-home',
                    name: 'Home',
                },
                {
                    path: 'cyberramen',
                    icon: 'bx-bot',
                    name: 'CyberRamen',
                    new: true,
                },
                {
                    path: 'tierlist',
                    icon: 'bx-pyramid',
                    name: 'Tierlists',
                },
                {
                    path: 'guess',
                    icon: 'bx-question-mark',
                    name: 'Guess',
                },
                {
                    path: 'ranking-stuff',
                    icon: 'bx-list-ul',
                    name: 'Ranking',
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
                    name: 'Playlists stuff',
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
button.new {
    &:after {
        content: 'NEW';
        display: block;
        padding: 0px 10px;
        height: auto;
        position: absolute;
        color: #c700ff;
        width: auto;
        border-radius: 10px;
        font-size: 60%;
        bottom: 0px;
        font-weight: bold;
    }
}
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
.menu {
    background-color: rgb(30, 32, 35);
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.3);
    transition: all 0.25s ease;
}
.navbar {
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: #141417;

    .title {
        padding: 0;
    }

    > * {
        flex: 1 1 100%;
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
            color: var(--primary-color) !important;
            font-weight: bold;
            text-decoration: inherit;
            &:hover {
                opacity: 1;
            }
        }
    }
    img {
        // width: 30px;
        // height: 30px;
        // margin-left: 10px;
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
