<template>
    <div class="maptts" style="text-align: center">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        MapTts - Twitch Timestamps for Maps
                    </h2>
                    <p>
                        Shows timestamps for maps that streamers have played.
                        <br />
                        You can suggest players for which you have to be logged
                        in.
                        <br />
                        After suggesting they will have to be approved by the
                        Approval Team.
                        <br />
                        Updates every three hours.
                    </p>
                    <vs-button icon @click="dialog['players'] = true" border>
                        Approved Players
                    </vs-button>
                </div>
            </div>

            <div class="discordWrapper">
                <vs-button
                    class="disc"
                    :href="discord['href']"
                    icon
                    color="discord"
                >
                    {{ discord['status'] }}
                    <i class="bx bxl-discord"></i>
                </vs-button>
                <p>(Only needed to suggest players)</p>
            </div>
        </div>

        <div class="content">
            <vs-alert color="primary">
                Search is now put in link so you can F5 and bookmark it WOW! 😱
            </vs-alert>

            <div class="title_container">
                <h2 class="title">Latest Scores</h2>

                <vs-button
                    v-if="isAuthenticated"
                    icon
                    @click="dialog['suggest'] = true"
                >
                    Suggest Player
                    <i class="bx bxs-message-square-add"></i>
                </vs-button>
            </div>

            <div class="row">
                <div class="search">
                    <vs-input
                        v-model="search"
                        type="search"
                        placeholder="Search"
                        v-on:keyup.enter="startSearch"
                    />
                    <vs-button icon transparent @click="startSearch">
                        <i class="bx bx-search-alt"></i>
                    </vs-button>
                </div>

                <vs-pagination v-model="page" :length="paginationLength" />
            </div>

            <div class="scores cards vertical">
                <loading-spinner v-if="loading" />
                <score v-for="score of scores" :key="score.id" :score="score" />
            </div>

            <vs-pagination v-model="page" :length="paginationLength" />
        </div>

        <dialogs-suggest-player-dialog v-model="dialog" />
        <dialogs-players-dialog class="players-dialog" v-model="dialog" />
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    watch: {
        page(newValue, oldValue) {
            this.loadScores()
            return null
        },
    },
    async created() {
        if ((this.isAuthenticated = await this.$isAuthenticated())) {
            this.discord['status'] = 'Logout '
            this.discord['href'] = this.$config.discordLogout
        }
        if (this.$route.query.search) {
            this.search = this.$route.query.search
            this.startSearch()
        }
    },
    data({ $config: { discordLogin } }) {
        return {
            scores: [],
            search: '',
            page: 1,
            paginationLength: 3,
            loading: true,
            isAuthenticated: false,
            dialog: {
                suggest: false,
                players: false,
            },
            discord: {
                status: 'Login ',
                href: discordLogin,
            },
        }
    },
    async fetch() {
        this.loadScores()
    },
    methods: {
        doesHttpOnlyCookieExist(cookiename) {
            var d = new Date()
            d.setTime(d.getTime() + 1000)
            var expires = 'expires=' + d.toUTCString()

            document.cookie = cookiename + '=new_value;path=/;' + expires
            if (document.cookie.indexOf(cookiename + '=') == -1) return true
            else return false
        },
        openUrl: function(id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank')
        },
        async loadScores() {
            this.loading = true
            this.scores = await this.$mapttsApi.$get(
                `scores/${this.page - 1}/${this.search}`,
            )

            if (this.scores.length < 25) {
                this.paginationLength = this.page
            } else {
                if (this.paginationLength == this.page) {
                    this.paginationLength++
                }
            }
            this.loading = false
        },
        startSearch() {
            this.$router.push({ query: { search: this.search } })
            this.page = 1
            this.paginationLength = 1
            this.loadScores()
        },
    },
}
</script>

<style lang="scss" scoped>
.maptts {
    p {
        color: #fff;
        text-align: left;
    }

    .header .left .aaa button {
        margin-top: 10px;
    }

    .content {
        flex-direction: column;
        align-content: center;
    }

    .vs-alert {
        max-width: 800px;
    }

    .discordWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 30px;
        .disc {
            min-width: 85px;
        }
        p {
            @media (max-width: 700px) {
                display: none;
            }
            opacity: 0.5;
        }
    }

    .row {
        display: flex;
        margin-bottom: 30px;
        place-content: space-between;
        flex-wrap: wrap;

        .search {
            display: flex;
        }
    }

    .scores {
        max-width: 800px;
        width: 100%;
    }

    .wrapper {
        text-align: left;
    }
}
</style>
