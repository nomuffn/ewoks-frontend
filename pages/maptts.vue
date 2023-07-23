<template>
    <div class="maptts" style="text-align: center">
        <sub-header title="MapTts - Twitch Timestamps for Maps">
            Shows timestamps for maps that streamers have played.
            <br />
            Updates every three hours.
        </sub-header>

        <div class="content">
            <Message severity="info"
                >Search is now put in link so you can F5 and bookmark it WOW!
                😱</Message
            >

            <p class="title text-left">Latest Scores</p>

            <div class="row">
                <div class="search">
                    <div class="p-inputgroup">
                        <InputText
                            v-model="search"
                            placeholder="Search"
                            v-on:keyup.enter="startSearch"
                        />
                        <Button icon="pi pi-search" @click="startSearch" />
                    </div>
                </div>

                <!-- // TODO fix up paginator -->
                <Paginator
                    :rows="25"
                    :totalRecords="(page + 2) * scores.length"
                    @page="onPage($event)"
                    :first.sync="paginatorOffset"
                ></Paginator>
                <!-- <vs-pagination v-model="page" :length="paginationLength" /> -->
            </div>

            <div class="scores cards vertical">
                <loading-spinner v-if="loading" />
                <score v-for="score of scores" :key="score.id" :score="score" />
            </div>

            <Paginator
                :rows="25"
                :totalRecords="(page + 2) * scores.length"
                @page="onPage($event)"
                :first.sync="paginatorOffset"
            ></Paginator>
            <!-- <vs-pagination v-model="page" :length="paginationLength" /> -->
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
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
            page: 0,
            loading: true,
            isAuthenticated: false,
            discord: {
                status: 'Login ',
                href: discordLogin,
            },
            paginatorOffset: 0,
        }
    },
    async fetch() {
        this.loadScores()
    },
    methods: {
        onPage(event) {
            console.log({ event })
            if (this.page == event.page) return
            this.page = event.page
            this.loadScores()
        },
        doesHttpOnlyCookieExist(cookiename) {
            var d = new Date()
            d.setTime(d.getTime() + 1000)
            var expires = 'expires=' + d.toUTCString()

            document.cookie = cookiename + '=new_value;path=/;' + expires
            if (document.cookie.indexOf(cookiename + '=') == -1) return true
            else return false
        },
        openUrl: function (id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank')
        },
        async loadScores() {
            this.loading = true
            this.scores = await this.$mapttsApi.$get(
                `scores/${this.page}/${this.search}`,
            )

            this.loading = false
        },
        startSearch() {
            this.$router.push({ query: { search: this.search } })
            this.page = 0
            this.paginatorOffset = 0
            this.loadScores()
        },
    },
}
</script>

<style lang="scss" scoped>
.p-paginator {
    background: none;
}

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
