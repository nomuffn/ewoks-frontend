<template>
    <div class="rankingStuff pb-12">
        <sub-header title="Ranking stuff">
            <p>
                Qualified map timers, RT/QAT votes feed, and recent top 10 plays.
            </p>
        </sub-header>

        <div class="w-full max-w-6xl px-4 sm:px-8 mx-auto mt-6 space-y-8">
            <!-- Header & Links Bar -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <p class="text-sm text-gray-400">
                    Thanks to
                    <a href="https://twitter.com/miitchelVR" target="_blank" rel="noopener" class="colored">miitchel</a>
                    for ScoreSaber qualification tracking code.
                </p>

                <div class="flex flex-wrap items-center gap-2">
                    <a
                        href="https://muffnlabs.de/static/qualified-maps.bplist"
                        target="_blank"
                        download
                        class="nope px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i class="bx bx-download text-sm"></i> Download Playlist
                    </a>
                    <a
                        href="https://scoresaber.com/ranking/requests"
                        target="_blank"
                        rel="noopener"
                        class="nope px-3.5 py-2 bg-[#1e2023] hover:bg-[#25282c] text-gray-200 font-medium text-xs rounded-lg border border-white/[0.08] transition-colors flex items-center gap-1.5"
                    >
                        Rank Requests <i class="bx bx-link-external text-sm"></i>
                    </a>
                </div>
            </div>

            <!-- Summary Strip -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
                <div class="px-5 py-4">
                    <span class="text-xs text-gray-400 block">Remaining Time</span>
                    <span class="text-xl font-semibold font-mono text-gray-100 mt-1 block">{{ remainingTimeAmount }} maps</span>
                </div>
                <div class="px-5 py-4">
                    <span class="text-xs text-gray-400 block">Past Ranked Date</span>
                    <span class="text-xl font-semibold font-mono text-emerald-400 mt-1 block">{{ passedRankedDateAmount }} maps</span>
                </div>
                <div class="px-5 py-4">
                    <span class="text-xs text-gray-400 block">Total Qualified</span>
                    <span class="text-xl font-semibold font-mono text-gray-100 mt-1 block">{{ maps.length }} maps</span>
                </div>
                <div class="px-5 py-4">
                    <span class="text-xs text-gray-400 block">Recorded RQ Votes</span>
                    <span class="text-xl font-semibold font-mono text-gray-100 mt-1 block">{{ votesStats?.totalVotesCount || 0 }}</span>
                </div>
            </div>

            <!-- Qualified Maps Section -->
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold text-gray-100">Currently Qualified Maps</h3>
                    <span class="text-xs text-gray-500 font-mono">{{ maps.length }} maps</span>
                </div>

                <div v-if="!maps.length" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-12 flex flex-col items-center justify-center">
                    <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
                    <span class="text-gray-400 mt-3 text-sm">Loading qualified maps...</span>
                </div>
                <time-maps-list v-else :maps="maps" />
            </div>

            <!-- RT / QAT Votes Section -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 space-y-5">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h3 class="text-base font-semibold text-gray-100">RT &amp; QAT Votes</h3>
                    <span class="text-xs text-gray-500">Updates hourly</span>
                </div>

                <div v-if="votesStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div class="bg-[#18191c] border border-white/[0.06] rounded-lg p-3.5 space-y-2">
                        <span class="text-xs font-medium text-gray-400 block">Last 24 Hours</span>
                        <div class="space-y-1.5 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">RT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.last24h?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last24h?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">QAT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.last24h?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last24h?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#18191c] border border-white/[0.06] rounded-lg p-3.5 space-y-2">
                        <span class="text-xs font-medium text-gray-400 block">Last 7 Days</span>
                        <div class="space-y-1.5 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">RT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.last7d?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last7d?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">QAT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.last7d?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last7d?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#18191c] border border-white/[0.06] rounded-lg p-3.5 space-y-2">
                        <span class="text-xs font-medium text-gray-400 block">Last 30 Days</span>
                        <div class="space-y-1.5 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">RT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.lastMonth?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.lastMonth?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">QAT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.lastMonth?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.lastMonth?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#18191c] border border-white/[0.06] rounded-lg p-3.5 space-y-2">
                        <span class="text-xs font-medium text-gray-400 block">Since Aug 2020</span>
                        <div class="space-y-1.5 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">RT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.allTime?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.allTime?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">QAT</span>
                                <div class="font-mono font-semibold">
                                    <span class="text-emerald-400">+{{ votesStats.allTime?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.allTime?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <votes-feed />
            </div>

            <!-- Top 10 High PP Plays Section -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 space-y-4">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h3 class="text-base font-semibold text-gray-100">Top 10 Scores Feed (&gt; 500 PP)</h3>
                    <span class="text-xs text-gray-500">Updates hourly</span>
                </div>
                <top-ten-feed-list />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            maps: [],
            stats: null,
            votesStats: null,
        }
    },
    async created() {
        try {
            const mapsData = await this.$defaultApi.$get('scoresaber/qualified')
            if (Array.isArray(mapsData)) {
                this.maps = mapsData.sort((a, b) => {
                    if (a.hoursleft > 0) return a.hoursleft - b.hoursleft
                    else return b.hoursleft - a.hoursleft
                })
            }
        } catch (e) {
            console.error('Failed to load qualified maps:', e)
        }

        try {
            this.stats = await this.$defaultApi.$get('scoresaber/rankedspans')
            this.votesStats = await this.$defaultApi.$get('scoresaber/rq/stats')
        } catch (e) {
            console.error('Failed to load ranking stats:', e)
        }
    },
    computed: {
        passedRankedDateAmount() {
            return this.maps.reduce((a, b) => {
                if (b.hoursleft < 0) return a + 1
                else return a
            }, 0)
        },
        remainingTimeAmount() {
            return this.maps.reduce((a, b) => {
                if (b.hoursleft > 0) return a + 1
                else return a
            }, 0)
        },
    },
}
</script>

<style lang="scss" scoped>
.rankingStuff {
    min-height: 100vh;
}
</style>
