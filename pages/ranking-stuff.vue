<template>
    <div class="rankingStuff pb-12">
        <sub-header title="ScoreSaber Ranking & Qualified Tracker">
            <p>
                Tracks ScoreSaber qualified map timelines, RT/QAT vote feeds, and high-pp top 10 plays.
            </p>
        </sub-header>

        <div class="w-full max-w-6xl px-4 sm:px-8 mx-auto mt-6 space-y-8">
            <!-- Action Header & Links Card -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-100 flex items-center gap-2">
                        <i class="bx bx-award text-amber-400 text-2xl"></i> Qualified Maps & Rank Requests
                    </h3>
                    <p class="text-xs text-gray-400 mt-1">
                        Thanks to <a href="https://twitter.com/miitchelVR" target="_blank" rel="noopener" class="text-blue-400 hover:underline font-semibold">miitchel</a> for ScoreSaber qualification tracking code.
                    </p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                    <a
                        href="https://muffnlabs.de/static/qualified-maps.bplist"
                        target="_blank"
                        download
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                        <i class="bx bx-download text-base"></i> Download Playlist
                    </a>
                    <a
                        href="https://scoresaber.com/ranking/requests"
                        target="_blank"
                        rel="noopener"
                        class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-semibold text-xs rounded-xl border border-gray-700 transition-colors flex items-center gap-2"
                    >
                        ScoreSaber Rank Requests <i class="bx bx-external-link text-sm"></i>
                    </a>
                </div>
            </div>

            <!-- Key Metric Summary Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl shrink-0">
                        <i class="bx bx-time-five"></i>
                    </div>
                    <div>
                        <span class="text-xs text-gray-400 font-semibold block uppercase">Remaining Time</span>
                        <span class="text-2xl font-bold font-mono text-amber-400 mt-0.5 block">{{ remainingTimeAmount }} maps</span>
                    </div>
                </div>

                <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl shrink-0">
                        <i class="bx bx-check-circle"></i>
                    </div>
                    <div>
                        <span class="text-xs text-gray-400 font-semibold block uppercase">Past Ranked Date</span>
                        <span class="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">{{ passedRankedDateAmount }} maps</span>
                    </div>
                </div>

                <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl shrink-0">
                        <i class="bx bx-list-ul"></i>
                    </div>
                    <div>
                        <span class="text-xs text-gray-400 font-semibold block uppercase">Total Qualified</span>
                        <span class="text-2xl font-bold font-mono text-blue-300 mt-0.5 block">{{ maps.length }} maps</span>
                    </div>
                </div>

                <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl shrink-0">
                        <i class="bx bx-[#18191c] bx-select-multiple text-purple-400 text-2xl"></i>
                    </div>
                    <div>
                        <span class="text-xs text-gray-400 font-semibold block uppercase">Recorded RQ Votes</span>
                        <span class="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">{{ votesStats?.totalVotesCount || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- Qualified Maps Section -->
            <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                    <h3 class="text-base font-bold text-gray-100 flex items-center gap-2">
                        <i class="bx bx-checkbox-checked text-emerald-400 text-xl"></i> Currently Qualified Maps
                    </h3>
                    <span class="text-xs text-gray-400 font-mono">
                        Showing {{ maps.length }} maps
                    </span>
                </div>

                <div v-if="!maps.length" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center shadow-xl">
                    <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
                    <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Loading qualified maps...</span>
                </div>
                <time-maps-list v-else :maps="maps" />
            </div>

            <!-- RT / QAT Votes Analytics Section (4 Timeframe Breakdown Grid) -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 class="text-base font-bold text-gray-100 flex items-center gap-2">
                        <i class="bx bx-select-multiple text-blue-400 text-xl"></i> RT & QAT Voting Activity Stats
                    </h3>
                    <span class="text-xs text-gray-400 flex items-center gap-1 font-mono">
                        <i class="bx bx-refresh text-sm text-gray-500"></i> Updates hourly
                    </span>
                </div>

                <div v-if="votesStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- 1. Last 24 Hours -->
                    <div class="bg-[#121315] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Last 24 Hours</span>
                            <i class="bx bx-time text-emerald-400"></i>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">RT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.last24h?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last24h?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">QAT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.last24h?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last24h?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Last 7 Days -->
                    <div class="bg-[#121315] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                            <span class="text-xs font-bold text-teal-400 uppercase tracking-wider">Last 7 Days</span>
                            <i class="bx bx-calendar-week text-teal-400"></i>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">RT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.last7d?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last7d?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">QAT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.last7d?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.last7d?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Last 30 Days -->
                    <div class="bg-[#121315] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Last 30 Days</span>
                            <i class="bx bx-calendar text-blue-400"></i>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">RT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.lastMonth?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.lastMonth?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">QAT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.lastMonth?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.lastMonth?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. All Time -->
                    <div class="bg-[#121315] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                            <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Since Aug 2020</span>
                            <i class="bx bx-history text-purple-400"></i>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">RT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.allTime?.rtupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.allTime?.rtdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 font-medium">QAT Votes</span>
                                <div class="font-mono font-bold">
                                    <span class="text-emerald-400">+{{ votesStats.allTime?.qatupvotes__sum || 0 }}</span>
                                    <span class="text-gray-600 mx-1">/</span>
                                    <span class="text-rose-400">+{{ votesStats.allTime?.qatdownvotes__sum || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Votes Feed Component -->
                <votes-feed />
            </div>

            <!-- Top 10 High PP Plays Section -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 class="text-base font-bold text-gray-100 flex items-center gap-2">
                        <i class="bx bx-trophy text-amber-400 text-xl"></i> Top 10 Scores Feed (&gt; 500 PP Plays)
                    </h3>
                    <span class="text-xs text-gray-400 font-mono">Updates hourly</span>
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
