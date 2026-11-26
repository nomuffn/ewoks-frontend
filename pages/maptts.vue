<template>
    <div class="maptts pb-12">
        <sub-header title="MapTts - Twitch Timestamps for Maps">
            <p>
                Shows Twitch VOD timestamps for maps played by Beat Saber streamers.
                <br />
                Updates every three hours.
            </p>
        </sub-header>

        <div class="w-full max-w-4xl px-4 sm:px-8 mx-auto mt-6 space-y-5">
            <!-- Notice Banner -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg px-4 py-3 flex items-center gap-3 text-gray-300 text-xs sm:text-sm">
                <i class="bx bx-info-circle text-lg text-gray-400 shrink-0"></i>
                <div>
                    running AntiLink's tool to fetch twitch VODs for players with scoresaber linked on their twitch channel lohl
                </div>
            </div>

            <!-- Controls Bar (Search & Pagination) -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
                <!-- Search Box with Filter Toggle -->
                <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[260px] max-w-xl">
                    <div class="flex bg-[#141417] p-1 rounded-lg border border-white/[0.07] text-xs shrink-0">
                        <button
                            @click="setScope('all')"
                            :class="scope === 'all' ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2.5 py-1 rounded-md transition-colors"
                        >
                            All
                        </button>
                        <button
                            @click="setScope('mapper')"
                            :class="scope === 'mapper' ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2.5 py-1 rounded-md transition-colors"
                        >
                            Mapper
                        </button>
                        <button
                            @click="setScope('player')"
                            :class="scope === 'player' ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2.5 py-1 rounded-md transition-colors"
                        >
                            Player
                        </button>
                    </div>

                    <div class="relative flex-1 min-w-[180px]">
                        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none"></i>
                        <input
                            type="text"
                            v-model="query"
                            placeholder="Search..."
                            @keyup.enter="startSearch"
                            class="w-full bg-[#141417] text-gray-100 placeholder-gray-500 border border-white/[0.08] focus:border-blue-500 rounded-lg pl-9 pr-20 py-1.5 text-sm outline-none transition-colors"
                        />
                        <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                v-if="query"
                                @click="query = ''; startSearch()"
                                class="text-gray-400 hover:text-white p-1 text-base transition-colors"
                                title="Clear search"
                            >
                                <i class="bx bx-x"></i>
                            </button>
                            <button
                                @click="startSearch"
                                class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-md transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pagination Bar -->
                <div class="flex items-center gap-1.5">
                    <button
                        @click="page--"
                        :disabled="loading || page <= 0"
                        class="p-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-lg transition-colors flex items-center"
                        title="Previous page"
                    >
                        <i class="bx bx-chevron-left text-lg"></i>
                    </button>
                    <span class="px-3 py-1.5 bg-[#141417] border border-white/[0.07] rounded-lg font-mono text-xs text-gray-200">
                        Page {{ page }}
                    </span>
                    <button
                        @click="page++"
                        :disabled="loading || scores.length < 25"
                        class="p-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-lg transition-colors flex items-center"
                        title="Next page"
                    >
                        <i class="bx bx-chevron-right text-lg"></i>
                    </button>
                </div>
            </div>

            <!-- Section Heading -->
            <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-gray-100">Latest Scores</h3>
                <span v-if="scores.length" class="text-xs text-gray-500 font-mono">
                    {{ scores.length }} scores
                </span>
            </div>

            <!-- Scores List -->
            <div>
                <div v-if="loading" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-12 flex flex-col items-center justify-center">
                    <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
                    <span class="text-gray-400 mt-3 text-sm">Loading scores...</span>
                </div>

                <div v-else-if="!scores || scores.length === 0" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-12 text-center text-gray-400">
                    <p class="text-base font-medium text-gray-200">No scores found</p>
                    <p class="text-xs text-gray-500 mt-1">Try searching for a different name or changing the filter.</p>
                </div>

                <div v-else class="space-y-3">
                    <score v-for="(score, index) of scores" :key="score.scoreId || index" :score="score" />
                </div>
            </div>

            <!-- Bottom Pagination -->
            <div v-if="scores && scores.length > 0" class="flex justify-center pt-2">
                <div class="flex items-center gap-1.5">
                    <button
                        @click="page--"
                        :disabled="loading || page <= 0"
                        class="px-3 py-1.5 bg-[#1e2023] hover:bg-[#25282c] disabled:opacity-40 text-gray-200 border border-white/[0.08] rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                        <i class="bx bx-chevron-left text-base"></i> Prev
                    </button>
                    <span class="px-3 py-1.5 bg-[#141417] border border-white/[0.07] rounded-lg font-mono text-xs text-gray-200">
                        Page {{ page }}
                    </span>
                    <button
                        @click="page++"
                        :disabled="loading || scores.length < 25"
                        class="px-3 py-1.5 bg-[#1e2023] hover:bg-[#25282c] disabled:opacity-40 text-gray-200 border border-white/[0.08] rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                        Next <i class="bx bx-chevron-right text-base"></i>
                    </button>
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
            this.initFromSearch(this.$route.query.search)
            this.startSearch()
        }
    },
    watch: {
        async page(newval, oldval) {
            await this.loadScores()
        },
    },
    data() {
        return {
            scores: [],
            query: '',
            scope: 'all', // 'all' | 'mapper' | 'player'
            page: 0,
            loading: true,
            paginatorOffset: 0,
        }
    },
    computed: {
        currentSearchString() {
            const trimmed = this.query.trim()
            if (!trimmed) return ''
            if (this.scope === 'mapper') {
                return trimmed.startsWith('mapper:') ? trimmed : `mapper:${trimmed}`
            } else if (this.scope === 'player') {
                return trimmed.startsWith('player:') ? trimmed : `player:${trimmed}`
            }
            return trimmed
        },
    },
    async fetch() {
        this.loadScores()
    },
    methods: {
        openUrl(id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank')
        },
        initFromSearch(rawSearch) {
            if (!rawSearch) return
            const s = rawSearch.trim()
            if (s.startsWith('mapper:')) {
                this.scope = 'mapper'
                this.query = s.substring('mapper:'.length).trim()
            } else if (s.startsWith('player:')) {
                this.scope = 'player'
                this.query = s.substring('player:'.length).trim()
            } else {
                this.scope = 'all'
                this.query = s
            }
        },
        setScope(newScope) {
            this.scope = newScope
            this.page = 0
            this.startSearch()
        },
        async loadScores() {
            this.loading = true
            try {
                const searchParam = this.currentSearchString
                    ? encodeURIComponent(this.currentSearchString)
                    : ''
                const res = await this.$mapttsApi.$get(`scores/${this.page}/${searchParam}`)
                if (Array.isArray(res)) {
                    this.scores = res
                } else if (res && Array.isArray(res.results)) {
                    this.scores = res.results
                } else {
                    this.scores = []
                }
            } catch (e) {
                console.error('Failed to load maptts scores:', e)
                this.scores = []
            } finally {
                this.loading = false
            }
        },
        startSearch() {
            const fullSearch = this.currentSearchString
            const res = this.$router.push({
                query: fullSearch ? { search: fullSearch } : {},
            })
            if (res && typeof res.catch === 'function') {
                res.catch(() => {})
            }
            this.page = 0
            this.paginatorOffset = 0
            this.loadScores()
        },
    },
}
</script>

<style lang="scss" scoped>
.maptts {
    min-height: 100vh;
}
</style>
