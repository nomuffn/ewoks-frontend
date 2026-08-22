<template>
    <div class="maptts pb-12">
        <sub-header title="MapTts - Twitch Timestamps for Maps">
            <p>
                Shows Twitch VOD timestamps for maps played by Beat Saber streamers.
                <br />
                Updates automatically every three hours.
            </p>
        </sub-header>

        <div class="w-full max-w-4xl px-4 sm:px-8 mx-auto mt-6 space-y-6">
            <!-- Notice Banner -->
            <div class="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 shadow-lg flex items-start gap-3 text-emerald-300 text-xs sm:text-sm">
                <i class="bx bx-info-circle text-xl text-emerald-400 shrink-0 mt-0.5"></i>
                <div>
                    running AntiLink's tool to fetch twitch VODs for players with scoresaber linked on their twitch channel lohl
                </div>
            </div>

            <!-- Controls Header Card (Search & Pagination) -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <!-- Search Box with Filter Toggle -->
                <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[260px] max-w-xl">
                    <!-- Scope Filter Buttons (All / Mapper / Player) -->
                    <div class="flex bg-[#121315] p-1 rounded-lg border border-gray-800 text-xs shrink-0">
                        <button
                            @click="setScope('all')"
                            :class="scope === 'all' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2.5 py-1 rounded transition-colors"
                        >
                            All
                        </button>
                        <button
                            @click="setScope('mapper')"
                            :class="scope === 'mapper' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2.5 py-1 rounded transition-colors"
                        >
                            Mapper
                        </button>
                        <button
                            @click="setScope('player')"
                            :class="scope === 'player' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2.5 py-1 rounded transition-colors"
                        >
                            Player
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="relative flex-1 min-w-[180px]">
                        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                        <input
                            type="text"
                            v-model="query"
                            @keyup.enter="startSearch"
                            class="w-full bg-[#121315] text-gray-100 border border-gray-700 focus:border-blue-500 rounded-lg pl-9 pr-20 py-2 text-sm outline-none transition-all"
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
                                class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-md transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pagination Bar -->
                <div class="flex items-center gap-2">
                    <button
                        @click="page--"
                        :disabled="loading || page <= 0"
                        class="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-lg text-sm transition-colors flex items-center"
                        title="Previous page"
                    >
                        <i class="bx bx-chevron-left text-lg"></i>
                    </button>
                    <span class="px-3.5 py-1.5 bg-[#121315] border border-gray-800 rounded-lg font-mono text-xs font-bold text-blue-300">
                        Page {{ page }}
                    </span>
                    <button
                        @click="page++"
                        :disabled="loading || scores.length < 25"
                        class="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-lg text-sm transition-colors flex items-center"
                        title="Next page"
                    >
                        <i class="bx bx-chevron-right text-lg"></i>
                    </button>
                </div>
            </div>

            <!-- Header Title -->
            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-200 flex items-center gap-2">
                    <i class="bx bxl-twitch text-purple-400 text-xl"></i> Latest Streamer Scores
                </h3>
                <span v-if="scores.length" class="text-xs text-gray-400 font-mono">
                    Showing {{ scores.length }} scores
                </span>
            </div>

            <!-- Scores List Container -->
            <div class="space-y-3">
                <div v-if="loading" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center shadow-xl">
                    <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
                    <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Loading Twitch timestamps...</span>
                </div>

                <div v-else-if="!scores || scores.length === 0" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 text-center text-gray-400 flex flex-col items-center justify-center shadow-xl">
                    <i class="bx bxl-twitch text-5xl mb-3 text-purple-400/50"></i>
                    <p class="text-lg font-medium text-gray-300">No Twitch scores found</p>
                    <p class="text-sm text-gray-500 mt-1">Try searching for a different name or changing filter.</p>
                </div>

                <template v-else>
                    <score v-for="score of scores" :key="score.id" :score="score" />
                </template>
            </div>

            <!-- Bottom Pagination -->
            <div v-if="scores && scores.length > 0" class="flex justify-center pt-2">
                <div class="flex items-center gap-2 bg-[#18191c] border border-gray-800 rounded-xl p-2 px-3 shadow-lg">
                    <button
                        @click="page--"
                        :disabled="loading || page <= 0"
                        class="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-lg text-sm transition-colors flex items-center gap-1 font-semibold text-xs"
                    >
                        <i class="bx bx-chevron-left text-lg"></i> Prev
                    </button>
                    <span class="px-3.5 py-1.5 bg-[#121315] border border-gray-800 rounded-lg font-mono text-xs font-bold text-blue-300">
                        Page {{ page }}
                    </span>
                    <button
                        @click="page++"
                        :disabled="loading || scores.length < 25"
                        class="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-sm transition-colors flex items-center gap-1 font-semibold text-xs"
                    >
                        Next <i class="bx bx-chevron-right text-lg"></i>
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
                this.scores = await this.$mapttsApi.$get(`scores/${this.page}/${searchParam}`)
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
