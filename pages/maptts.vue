<template>
    <div class="maptts" style="text-align: center">
        <sub-header title="MapTts - Twitch Timestamps for Maps">
            Shows timestamps for maps that streamers have played.
            <br />
            Updates every three hours.
        </sub-header>

        <div class="content">
            <Message severity="success" icon="pi-info-circle"
                >Finally implemented AntiLinks tool to fetch new players from twitch (as long as they have any
                associations to scoresaber on their twitch channel)since this has been running on like one year old data
                lohl. Should fetch from a lot more players now</Message
            >

            <p class="title text-left">Latest Scores</p>

            <div class="row flex justify-between">
                <div class="search">
                    <div class="p-inputgroup">
                        <InputText v-model="search" placeholder="Search" v-on:keyup.enter="startSearch" />
                        <Button icon="pi pi-search" @click="startSearch" />
                    </div>
                </div>

                <div class="flex">
                    <Button icon="pi pi-angle-left" @click="page--" :disabled="loading || page <= 0" />
                    <p class="self-center py-3 px-5" style="background: #141417">
                        {{ page }}
                    </p>
                    <Button icon="pi pi-angle-right" @click="page++" :disabled="loading || scores.length < 25" />
                </div>
            </div>

            <div class="scores cards vertical">
                <loading-spinner v-if="loading" />
                <score v-for="score of scores" :key="score.id" :score="score" />
            </div>

            <div class="row justify-center">
                <div class="flex">
                    <Button icon="pi pi-angle-left" @click="page--" :disabled="page <= 0" />
                    <p class="self-center py-3 px-5" style="background: #141417">
                        {{ page }}
                    </p>
                    <Button icon="pi pi-angle-right" @click="page++" :disabled="scores.length < 25" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    async created() {
        if (this.$route.query.search) {
            this.search = this.$route.query.search
            this.startSearch()
        }
    },
    watch: {
        async page(newval, oldval) {
            await this.loadScores()
            console.log(this.scores.length)
        },
    },
    data() {
        return {
            scores: [],
            search: '',
            page: 0,
            loading: true,
            paginatorOffset: 0,
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
        openUrl: function (id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank')
        },
        async loadScores() {
            this.loading = true
            this.scores = await this.$mapttsApi.$get(`scores/${this.page}/${this.search}`)

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

    .vs-alertm,
    .p-message {
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
