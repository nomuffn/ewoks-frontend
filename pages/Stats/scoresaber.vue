<template>
    <div class="scoresaber">
        <vs-select
            v-if="activeList"
            v-model="activeList"
            label-placeholder="Sorted by"
            class="select"
            :loading="loading"
        >
            <vs-option
                v-for="(item, key) in lists"
                :key="key"
                :value="key"
                :label="item.title"
            >
                {{ item.title }}
            </vs-option>
        </vs-select>

        <!-- <vs-navbar color="#18191c" text-white square v-model="activeList">
            <vs-navbar-item v-for="(item, key) in lists" :key="key" :active="activeList == key" :id="key">
                {{ item.title }}
            </vs-navbar-item>
        </vs-navbar> -->

        <div class="sub-content">
            <div v-if="activeList" class="list">
                <div v-if="!loading && data.length > 0" class="cards vertical">
                    <p>Amount: {{ data.length }}</p>

                    <template v-if="activeList == 'highestScores'">
                        <div
                            v-for="(item, index) in getVisibleItems"
                            :key="index"
                            v-on:click="
                                openUrl(
                                    'https://scoresaber.com/leaderboard/' +
                                        item.leaderboard.id,
                                )
                            "
                            class="card highestScores"
                        >
                            <div>
                                <p>
                                    <span class="colored"
                                        >#{{ index + 1 }}</span
                                    >
                                    <span class="big">{{
                                        item.player_name
                                    }}</span>
                                    on
                                </p>
                                <p class="big">
                                    {{
                                        `${item.leaderboard.artist} - ${item.leaderboard.name} ${item.leaderboard.subname}`
                                    }}
                                </p>
                                <p>
                                    by {{ item.leaderboard.mapper }} (<span
                                        :class="item.leaderboard.diff"
                                        >{{
                                            mapDiff(item.leaderboard.diff)
                                        }}</span
                                    >; {{ item.leaderboard.stars }} stars;
                                    {{ item.leaderboard.bpm }} bpm)
                                </p>
                            </div>

                            <div class="score">
                                <p>#{{ item.rank }}</p>
                                <p>
                                    <span class="pp colored"
                                        >{{ item.pp }}pp</span
                                    >
                                </p>
                                <p class="acc">{{ item.percentage }}%</p>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            v-for="(item, index) in getVisibleItems"
                            :key="index"
                            v-on:click="
                                openUrl(
                                    'https://scoresaber.com/leaderboards?search=' +
                                        item.name,
                                )
                            "
                            class="card"
                        >
                            <h4>
                                <span class="colored">#{{ index + 1 }}</span>
                                {{ item.name }}: {{ item.value }}
                            </h4>
                            <vs-button
                                v-if="item.maps"
                                v-on:click.stop="mapsDialog = item"
                                border
                                >Maps</vs-button
                            >
                        </div>
                    </template>
                    <vs-button
                        v-if="visibleItems < data.length"
                        class="showMore"
                        icon
                        @click="visibleItems += 50"
                    >
                        Show more
                    </vs-button>
                </div>
            </div>
        </div>
        <dialogs-maps-dialog v-model="mapsDialog" @close="mapsDialog = null" />
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            data: [],
            activeList: this.$route.query?.list || 'highestScores',
            visibleItems: 10,
            loading: false,
            stats: null,
            mapsDialog: null,
            lists: {
                highestScores: {
                    title: 'Highest PP Scores',
                    getData: async () => {
                        return await this.$defaultApi.$get(
                            'scoresaber/highestscores',
                        )
                    },
                },
                mapsetMappers: {
                    title: 'Mapset Count By Mappers',
                    getData: () => {
                        return this.loadFromApi('scoresaber/mapperdist')
                    },
                },
                diffMappers: {
                    title: 'Difficulty Count By Mappers',
                    getData: () => {
                        return this.loadFromApi('scoresaber/mapperdiffdist')
                    },
                },
                mapsetArtists: {
                    title: 'Mapset Count By Song Artists',
                    getData: () => {
                        return this.loadFromApi('scoresaber/artistdist')
                    },
                },
                mapsetRQMappers: {
                    title: 'Mappers Count (Ranking Queue)',
                    getData: async () => {
                        return (
                            await this.loadFromApi('scoresaber/rq/mappers')
                        ).map(mapper => {
                            return {
                                ...mapper,
                                value: mapper.value.length,
                                maps: mapper.value,
                            }
                        })
                    },
                },
            },
        }
    },
    computed: {
        getVisibleItems() {
            return this.data.slice(0, this.visibleItems)
        },
    },

    async created() {
        this.stats = await this.$defaultApi.$get('scoresaber/ppdist')
    },
    watch: {
        activeList: {
            immediate: true,
            async handler(val) {
                this.loading = true
                this.$router.push({ query: { list: this.activeList } })
                this.visibleItems = 10
                this.data = await this.lists[this.activeList].getData()
                this.loading = false
            },
        },
    },
    methods: {
        openUrl: function(url) {
            window.open(url, '_blank')
        },
        async loadFromApi(endpoint) {
            let data = await this.$defaultApi.$get(endpoint)
            return Object.entries(data)
                .sort((a, b) => {
                    return b[1] - a[1]
                })
                .map(item => {
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
