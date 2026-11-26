<template>
    <div class="toptenfeed space-y-4">
        <div v-if="loading" class="p-8 flex justify-center">
            <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
        </div>

        <template v-else-if="getScores && getScores.length">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                    v-for="(score, index) of getScores"
                    :key="index"
                    @click="openUrl(score.leaderboard_id)"
                    class="bg-[#18191c] border border-white/[0.06] hover:border-white/15 rounded-lg px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-4"
                >
                    <div class="flex items-center gap-3 min-w-0">
                        <span
                            :class="[
                                'w-7 font-mono font-semibold text-sm text-center shrink-0',
                                score.rank === 1
                                    ? 'text-amber-400'
                                    : score.rank === 2
                                    ? 'text-gray-200'
                                    : score.rank === 3
                                    ? 'text-amber-600'
                                    : 'text-gray-500',
                            ]"
                        >
                            #{{ score.rank }}
                        </span>

                        <div class="min-w-0">
                            <div class="font-semibold text-gray-100 text-sm truncate">
                                {{ score.player_name }}
                            </div>
                            <div class="text-xs text-gray-400 truncate mt-0.5" :title="score.leaderboard_name">
                                {{ score.leaderboard_name }}
                            </div>
                            <div class="text-xs text-gray-500 mt-0.5">
                                ~{{ score.hoursago }}h ago
                            </div>
                        </div>
                    </div>

                    <div class="text-right font-mono shrink-0">
                        <div class="text-sm font-semibold text-gray-100">
                            {{ formatPp(score.pp) }}<span class="text-xs text-gray-400 font-normal">pp</span>
                        </div>
                        <div class="text-xs text-gray-400 mt-0.5">
                            {{ formatNum(score.percentage) }}%
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="visibleItems < 25" class="flex justify-center pt-1">
                <button
                    @click="visibleItems += 10"
                    class="px-4 py-2 bg-[#25282c] hover:bg-[#2e3238] text-gray-200 text-xs font-medium rounded-lg border border-white/[0.08] transition-colors flex items-center gap-1"
                >
                    <span>Show more</span>
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
