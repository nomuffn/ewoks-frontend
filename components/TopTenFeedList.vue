<template>
    <div class="toptenfeed space-y-4">
        <div v-if="loading" class="p-8 flex justify-center">
            <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
        </div>

        <template v-else-if="getScores && getScores.length">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                    v-for="(score, index) of getScores"
                    :key="index"
                    @click="openUrl(score.leaderboard_id)"
                    class="bg-[#18191c] border border-gray-800 hover:border-amber-500/40 rounded-xl p-4 shadow-md cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                    <div class="flex items-center gap-3 min-w-0">
                        <span
                            :class="[
                                'w-8 h-8 rounded-lg font-mono font-bold text-sm flex items-center justify-center border shrink-0',
                                score.rank === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : score.rank === 2 ? 'bg-slate-300/20 text-slate-200 border-slate-300/40' : score.rank === 3 ? 'bg-amber-700/20 text-amber-400 border-amber-700/40' : 'bg-gray-900 text-gray-400 border-gray-800'
                            ]"
                        >
                            #{{ score.rank }}
                        </span>

                        <div class="min-w-0">
                            <div class="font-bold text-gray-100 group-hover:text-amber-300 transition-colors text-sm truncate">
                                {{ score.player_name }}
                            </div>
                            <div class="text-xs text-gray-400 truncate mt-0.5" :title="score.leaderboard_name">
                                {{ score.leaderboard_name }}
                            </div>
                            <div class="text-[11px] text-gray-500 font-mono mt-1">
                                ~{{ score.hoursago }}h ago
                            </div>
                        </div>
                    </div>

                    <div class="text-right font-mono shrink-0">
                        <div class="text-sm font-bold text-emerald-400">
                            {{ formatPp(score.pp) }}<span class="text-xs font-normal">pp</span>
                        </div>
                        <div class="text-xs font-semibold text-gray-300 mt-0.5">
                            {{ formatNum(score.percentage) }}%
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="visibleItems < 25" class="flex justify-center pt-2">
                <button
                    @click="visibleItems += 10"
                    class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                    <span>Show More Top Scores</span>
                    <i class="bx bx-chevron-down text-base"></i>
                </button>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scores: [],
            loading: true,
            visibleItems: 10,
        }
    },
    async created() {
        try {
            this.scores = await this.$defaultApi.$get('scoresaber/toptenfeed')
        } catch (e) {
            console.error('Failed to fetch top ten feed:', e)
            this.scores = []
        } finally {
            this.loading = false
        }
    },
    computed: {
        getScores() {
            return this.scores?.slice(0, this.visibleItems)
        },
    },
    methods: {
        openUrl(id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank').focus()
        },
    },
}
</script>

<style lang="scss" scoped>
.toptenfeed {
    width: 100%;
}
</style>
