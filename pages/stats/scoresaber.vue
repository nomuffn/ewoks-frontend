<template>
    <div class="scoresaber">
        <Dropdown
            class="select"
            v-if="activeList"
            v-model="activeList"
            :options="lists"
            optionLabel="title"
            placeholder="Sorted by"
            scrollHeight="400px"
            :loading="loading"
        />

        <div class="sub-content">
            <div v-if="activeList" class="list">
                <div v-if="!loading && data.length > 0" class="cards vertical">
                    <p>Amount: {{ data.length }}</p>

                    <template v-if="activeList.key == 'highestScores'">
                        <div
                            v-for="(item, index) in getVisibleItems"
                            :key="index"
                            v-on:click="openUrl('https://scoresaber.com/leaderboard/' + item.leaderboard_id)"
                            class="card highestScores"
                        >
                            <div>
                                <p>
                                    <span class="colored">#{{ index + 1 }}</span>
                                    <span class="big">{{ item.player_name }}</span>
                                    on
                                </p>
                                <p class="big" v-if="item.leaderboard">
                                    {{
                                        `${item.leaderboard.artist} - ${item.leaderboard.name} ${item.leaderboard.subname}`
                                    }}
                                </p>
                                <p class="big" v-else>
                                    {{ item.leaderboard_name }}
                                </p>
                                <p v-if="item.leaderboard">
                                    by {{ item.leaderboard.mapper }} (<span :class="item.leaderboard.diff">{{
                                        mapDiff(item.leaderboard.diff)
                                    }}</span
                                    >; {{ item.leaderboard.stars }} stars; {{ item.leaderboard.bpm }} bpm)
                                </p>
                            </div>

                            <div class="score">
                                <p>#{{ item.rank }}</p>
                                <p>
                                    <span class="pp colored">{{ item.pp }}pp</span>
                                </p>
                                <p class="acc">{{ item.percentage }}%</p>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            v-for="(item, index) in getVisibleItems"
                            :key="index"
                            v-on:click="openUrl('https://scoresaber.com/leaderboards?search=' + item.name)"
                            class="card"
                        >
                            <h4 class="mr-4">
                                <span class="colored">#{{ index + 1 }}</span>
                                {{ item.name }}: {{ item.value }}
                            </h4>
                            <my-button v-if="item.maps" @click="openDialog" outlined> Maps </my-button>
                        </div>
                    </template>
                    <my-button v-if="visibleItems < data.length" class="showMore" @click="visibleItems += 50">
                        Show more
                    </my-button>
                </div>
            </div>
        </div>
        <dialogs-maps-dialog v-model="mapsDialog" @close="mapsDialog = null" />
    </div>
</template>

<script>
import TestModal from '@/components/TestModal.vue'

export default {
    transition: 'slide-bottom',
    data() {
        return {
            data: [],
            activeList: null,
            visibleItems: 10,
            loading: false,
            stats: null,
            mapsDialog: null,
            lists: [
                {
                    key: 'highestScores',
                    title: 'Highest PP Scores',
                    getData: async () => {
                        return await this.$defaultApi.$get('scoresaber/highestscores')
                    },
                },
                {
                    key: 'mapsetMappers',
                    title: 'Mapset Count By Mappers',
                    getData: () => {
                        return this.loadFromApi('scoresaber/mapperdist')
                    },
                },
                {
                    key: 'diffMappers',
                    title: 'Difficulty Count By Mappers',
                    getData: () => {
                        return this.loadFromApi('scoresaber/mapperdiffdist')
                    },
                },
                {
                    key: 'mapsetArtists',
                    title: 'Mapset Count By Song Artists',
                    getData: () => {
                        return this.loadFromApi('scoresaber/artistdist')
                    },
                },
                {
                    key: 'mapsetRQMappers',
                    title: 'Mappers Count (Ranking Queue)',
                    getData: async () => {
                        return (await this.loadFromApi('scoresaber/rq/mappers')).map((mapper) => {
                            return {
                                ...mapper,
                                value: mapper.value.length,
                                maps: mapper.value,
                            }
                        })
                    },
                },
            ],
        }
    },
    computed: {
        getVisibleItems() {
            return this.data.slice(0, this.visibleItems)
        },
    },

    async created() {
        this.activeList = this.lists.find((i) => i.key == this.$route.query?.list) || this.lists[0]

        this.stats = await this.$defaultApi.$get('scoresaber/ppdist')
    },
    watch: {
        activeList: {
            async handler(val) {
                console.log('activeList', val)
                if (!val) return
                this.loading = true
                this.$router.push({ query: { list: this.activeList.key } })
                this.visibleItems = 10
                this.data = await this.activeList.getData()
                this.loading = false
            },
        },
    },
    methods: {
        openUrl: function (url) {
            window.open(url, '_blank')
        },
        async loadFromApi(endpoint) {
            let data = await this.$defaultApi.$get(endpoint)
            return Object.entries(data)
                .sort((a, b) => {
                    return b[1] - a[1]
                })
                .map((item) => {
                    return { name: item[0], value: item[1] }
                })
        },
        mapDiff(diff) {
            if (diff.includes('ExpertPlus')) return 'Expert+'
            if (diff.includes('Expert')) return 'Expert'
            if (diff.includes('Hard')) return 'Hard'
            if (diff.includes('Normal')) return 'Normal'
            if (diff.includes('Easy')) return 'Easy'
        },
        openDialog() {
            this.$buefy.modal.open({
                parent: this,
                component: TestModal,
                hasModalCard: true,
                trapFocus: true,
                fullScreen: false,
                props: {},
                events: {
                    close: () => {},
                },
            })
        },
    },
}
</script>

<style lang="scss">
.page .scoresaber {
    position: relative;
    justify-content: center;
    flex-direction: column;
    align-content: center;
    align-items: center;
    margin-top: 0;
    max-width: 100%;

    .select {
        margin: 60px 0px 20px;
        width: 100%;
        max-width: 400px;
    }

    .sub-content {
        width: 100%;
        position: relative;

        .vs-alert {
            position: absolute;
            top: 0;
            left: 0;
            margin: 40px 0px 0px 0px;
            max-width: 400px;

            @media (max-width: 1350px) {
                display: none;
            }
        }

        .list {
            display: flex;
            flex-direction: column;
            align-items: center;

            .title_container {
                .title {
                    padding-bottom: 0px;
                }
            }
        }
    }

    .vs-navbar-content {
        position: relative;

        button {
            white-space: pre-line;
            padding-top: 0px;
            padding: 0px 10px 15px 10px;
        }
    }

    .cards {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0px 20px;

        > p {
            color: #fff;
            opacity: 0.5;
            margin-bottom: 20px;
        }

        .card:nth-child(2) .colored {
            color: #ffca28 !important;
        }

        .card:nth-child(3) .colored {
            color: #bdbdbd !important;
        }

        .card:nth-child(4) .colored {
            color: #b2641d !important;
        }
    }

    .col {
        flex: inherit;
        max-width: 300px;
    }

    .card {
        max-width: 600px;
        width: 100%;

        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .colored {
            font-size: 1rem;
        }

        button {
            padding: 0px 5px;
            margin: 0px;
        }
    }

    .highestScores {
        display: flex;
        justify-content: space-between;

        .big {
            font-weight: bold;
            font-size: 1rem;
        }

        .score {
            text-align: right;
            margin-left: 20px;

            .pp {
                font-size: 1.2rem;
            }

            .acc {
                font-size: 1rem;
                font-weight: bold;
            }
        }

        ._ExpertPlus_SoloStandard {
            color: #8f48db;
        }
        ._Expert_SoloStandard {
            color: #bf2a42;
        }
    }
}
</style>
