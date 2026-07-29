<template>
    <div class="scoresaber w-full space-y-6">
        <!-- List Selector Card -->
        <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <i class="bx bx-trophy text-amber-400 text-xl"></i>
                <label class="text-sm font-bold text-gray-200">ScoreSaber Ranking Breakdown:</label>
            </div>

            <Dropdown
                v-if="activeList"
                v-model="activeList"
                :options="lists"
                optionLabel="title"
                placeholder="Sorted by"
                scrollHeight="400px"
                :loading="loading"
                class="w-72 p-inputtext-sm"
            />
        </div>

        <!-- Sub-Content List -->
        <div class="w-full space-y-4">
            <div v-if="loading" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center shadow-xl">
                <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
                <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Loading ScoreSaber stats...</span>
            </div>

            <template v-else-if="data && data.length > 0">
                <div class="flex items-center justify-between px-1">
                    <h3 class="text-sm font-bold text-gray-300">
                        {{ activeList?.title || 'Ranking Stats' }}
                    </h3>
                    <span class="text-xs text-gray-400 font-mono">
                        Total items: {{ data.length }}
                    </span>
                </div>

                <!-- Highest PP Scores Cards Template -->
                <div v-if="activeList.key === 'highestScores'" class="space-y-3">
                    <div
                        v-for="(item, index) in getVisibleItems"
                        :key="index"
                        @click="openUrl('https://scoresaber.com/leaderboard/' + item.leaderboard_id)"
                        class="bg-[#18191c] border border-gray-800 hover:border-blue-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all flex flex-wrap items-center justify-between gap-4 group"
                    >
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-mono font-bold text-sm text-amber-400 shrink-0">
                                #{{ index + 1 }}
                            </span>
                            <div>
                                <div class="font-bold text-gray-100 group-hover:text-blue-400 transition-colors text-base">
                                    {{ item.player_name }}
                                </div>
                                <div class="text-xs text-gray-300 mt-0.5" v-if="item.leaderboard">
                                    {{ item.leaderboard.artist }} - {{ item.leaderboard.name }} {{ item.leaderboard.subname }}
                                </div>
                                <div class="text-xs text-gray-300 mt-0.5" v-else>
                                    {{ item.leaderboard_name }}
                                </div>
                                <div class="text-[11px] text-gray-400 mt-1" v-if="item.leaderboard">
                                    by {{ item.leaderboard.mapper }}
                                    <span class="mx-1 text-gray-600">•</span>
                                    <span class="font-semibold text-purple-400">{{ mapDiff(item.leaderboard.diff) }}</span>
                                    <span class="mx-1 text-gray-600">•</span>
                                    ★ {{ item.leaderboard.stars }}
                                    <span class="mx-1 text-gray-600">•</span>
                                    {{ item.leaderboard.bpm }} BPM
                                </div>
                            </div>
                        </div>

                        <div class="text-right font-mono shrink-0">
                            <div class="text-base font-bold text-emerald-400">
                                {{ formatPp(item.pp) }}pp
                            </div>
                            <div class="text-xs text-gray-400 font-semibold mt-0.5">
                                Acc: {{ formatNum(item.percentage) }}%
                            </div>
                            <div class="text-[11px] text-gray-500 mt-0.5">
                                Leaderboard Rank #{{ item.rank }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Generic List Items (Mappers / Artists / Diff Count) -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                        v-for="(item, index) in getVisibleItems"
                        :key="index"
                        @click="openUrl('https://scoresaber.com/leaderboards?search=' + item.name)"
                        class="bg-[#18191c] border border-gray-800 hover:border-gray-700 rounded-xl p-3.5 shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="w-6 h-6 rounded bg-gray-900 border border-gray-800 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                                #{{ index + 1 }}
                            </span>
                            <span class="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors truncate" :title="item.name">
                                {{ item.name }}
                            </span>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                            <span class="px-2.5 py-1 bg-blue-950/40 border border-blue-800/40 text-blue-300 font-mono text-xs font-bold rounded-lg">
                                {{ item.value }}
                            </span>
                            <my-button v-if="item.maps" @click.stop="openDialog" outlined class="text-xs px-2 py-0.5">
                                Maps
                            </my-button>
                        </div>
                    </div>
                </div>

                <!-- Show More Button -->
                <div v-if="visibleItems < data.length" class="flex justify-center pt-4">
                    <button
                        @click="visibleItems += 50"
                        class="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-semibold text-xs rounded-xl border border-gray-700 transition-colors shadow-md flex items-center gap-2"
                    >
                        <span>Show More</span>
                        <i class="bx bx-chevron-down text-lg"></i>
                    </button>
                </div>
            </template>

            <div v-else class="bg-[#18191c] border border-gray-800 rounded-xl p-16 text-center text-gray-400 flex flex-col items-center justify-center shadow-xl">
                <i class="bx bx-folder-open text-5xl mb-3 text-gray-600"></i>
                <p class="text-lg font-medium text-gray-300">No data found</p>
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
        this.activeList = this.lists.find((i) => i.key === this.$route.query?.list) || this.lists[0]
        try {
            this.stats = await this.$defaultApi.$get('scoresaber/ppdist')
        } catch (e) {
            console.error('Failed to load ppdist:', e)
        }
    },
    watch: {
        activeList: {
            async handler(val) {
                if (!val) return
                this.loading = true
                if (this.$route.query?.list !== this.activeList.key) {
                    const res = this.$router.push({ query: { list: this.activeList.key } })
                    if (res && typeof res.catch === 'function') {
                        res.catch(() => {})
                    }
                }
                this.visibleItems = 10
                try {
                    this.data = await this.activeList.getData()
                } catch (e) {
                    console.error('Failed to fetch list data:', e)
                    this.data = []
                } finally {
                    this.loading = false
                }
            },
        },
    },
    methods: {
        openUrl(url) {
            window.open(url, '_blank').focus()
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
            if (!diff) return 'Expert+'
            if (diff.includes('ExpertPlus')) return 'Expert+'
            if (diff.includes('Expert')) return 'Expert'
            if (diff.includes('Hard')) return 'Hard'
            if (diff.includes('Normal')) return 'Normal'
            if (diff.includes('Easy')) return 'Easy'
            return diff
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

<style lang="scss" scoped>
.scoresaber {
    width: 100%;
}
</style>
