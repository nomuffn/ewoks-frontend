<template>
    <div class="beatsaver flex flex-col lg:flex-row gap-6 items-start">
        <!-- Left Column: Filter Sidebar -->
        <div class="w-full lg:w-72 bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 space-y-5 shrink-0">
            <h3 class="text-sm font-semibold text-gray-100 border-b border-white/[0.06] pb-3">
                Filter Ranked Maps
            </h3>

            <!-- Mapper Name Search -->
            <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-300 block">Mapper Name</label>
                <input
                    type="text"
                    v-model="mapperName"
                    @keyup.enter="loadResults"
                    placeholder="Enter mapper name..."
                    class="w-full bg-[#141417] text-gray-100 placeholder-gray-500 border border-white/[0.08] focus:border-blue-500 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                />
            </div>

            <!-- Order By Dropdown -->
            <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-300 block">Order By</label>
                <Dropdown
                    v-model="column"
                    :options="allColumns"
                    placeholder="Order by"
                    scrollHeight="400px"
                    class="w-full p-inputtext-sm"
                />
            </div>

            <!-- Minimum Stars Slider -->
            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-300 font-medium">Min Stars</span>
                    <span class="text-gray-200 font-mono">★ {{ stars }}</span>
                </div>
                <Slider v-model="stars" :max="14" :tooltips="false" />
            </div>

            <!-- Minimum BPM Slider -->
            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-300 font-medium">Min BPM</span>
                    <span class="text-gray-200 font-mono">{{ bpm }}</span>
                </div>
                <Slider v-model="bpm" :max="350" :tooltips="false" />
            </div>

            <!-- Uploaded Since Slider -->
            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-300 font-medium">Uploaded Since</span>
                    <span class="text-gray-200 font-mono">{{ getFormattedMonths }}</span>
                </div>
                <Slider v-model="months" :min="0" :max="getMonthsDifference" :tooltips="false" />
            </div>

            <!-- Sort Direction Toggle -->
            <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-300 block">Sort Order</label>
                <div class="flex items-center gap-4 bg-[#141417] border border-white/[0.07] p-2.5 rounded-lg justify-around text-xs text-gray-300">
                    <label class="flex items-center gap-1.5 cursor-pointer">
                        <RadioButton id="desc" value="-" v-model="descending" />
                        <span>Desc</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer">
                        <RadioButton id="asc" value="+" v-model="descending" />
                        <span>Asc</span>
                    </label>
                </div>
            </div>

            <!-- Filter Action Button -->
            <div class="pt-1">
                <button
                    @click="loadResults"
                    :disabled="loading"
                    class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                    <ProgressSpinner v-if="loading" style="width: 16px; height: 16px" strokeWidth="4" />
                    <span>Apply Filters</span>
                </button>
            </div>
        </div>

        <!-- Right Column: Results List -->
        <div class="flex-1 w-full space-y-3">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-gray-100">Results</h3>
                <span v-if="results.length" class="text-xs text-gray-500 font-mono">
                    {{ results.length }} maps
                </span>
            </div>

            <div v-if="loading" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-12 flex flex-col items-center justify-center">
                <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
                <span class="text-gray-400 mt-3 text-sm">Loading maps...</span>
            </div>

            <div v-else-if="getVisibleItems.length === 0" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-12 text-center text-gray-400">
                <p class="text-base font-medium text-gray-200">No maps found</p>
                <p class="text-xs text-gray-500 mt-1">Try adjusting your filters or clearing the mapper search.</p>
            </div>

            <template v-else>
                <div class="flex flex-col gap-2.5">
                    <div
                        v-for="(item, index) in getVisibleItems"
                        :key="item.key"
                        class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg px-4 py-3 transition-colors flex flex-wrap items-center justify-between gap-4"
                    >
                        <!-- Left Info -->
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <span class="w-8 font-mono text-xs text-gray-500 shrink-0">
                                #{{ index + 1 }}
                            </span>
                            <div class="min-w-0">
                                <div class="font-semibold text-gray-100 text-sm truncate" :title="item['songName']">
                                    {{ item['songName'] }}
                                </div>
                                <div class="text-xs text-gray-400 mt-0.5 truncate">
                                    by {{ item['levelAuthorName'] || 'Unknown Mapper' }}
                                    <span class="text-gray-600 mx-1">·</span>
                                    {{ getFormattedUploaded(item['uploaded']) }}
                                </div>
                            </div>
                        </div>

                        <!-- Right Metrics -->
                        <div class="flex flex-wrap items-center gap-5 shrink-0 font-mono text-xs">
                            <div class="text-right">
                                <span class="text-[11px] text-gray-500 block font-sans">Ratio</span>
                                <span :class="['font-semibold', isActive('ratio') ? 'text-blue-400' : 'text-gray-200']">
                                    {{ formatRatio(item['ratio']) }}
                                </span>
                            </div>

                            <div class="text-right">
                                <span class="text-[11px] text-gray-500 block font-sans">Votes</span>
                                <div class="font-semibold">
                                    <span class="text-emerald-400">+{{ item['upvotes'] }}</span>
                                    <span class="text-gray-600 mx-0.5">/</span>
                                    <span class="text-rose-400">-{{ item['downvotes'] }}</span>
                                </div>
                            </div>

                            <div class="text-right">
                                <span class="text-[11px] text-gray-500 block font-sans">Stars</span>
                                <span class="font-semibold text-amber-400">
                                    ★ {{ item['highestStar'] ? item['highestStar'].toFixed(1) : '-' }}
                                </span>
                            </div>

                            <div class="text-right">
                                <span class="text-[11px] text-gray-500 block font-sans">BPM</span>
                                <span class="font-semibold text-gray-200">
                                    {{ item['bpm'] ? Math.round(item['bpm']) : '-' }}
                                </span>
                            </div>

                            <a
                                v-if="item.key"
                                :href="`https://beatsaver.com/maps/${item.key}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="nope p-2 rounded-lg bg-[#25282c] hover:bg-[#2e3238] border border-white/[0.08] transition-colors flex items-center justify-center shrink-0"
                                title="View on BeatSaver"
                            >
                                <img class="w-4 h-4 object-contain" src="https://beatsaver.com/static/favicon/favicon-32x32.png" alt="BeatSaver" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Show More Button -->
                <div v-if="visibleItems < results.length" class="flex justify-center pt-3">
                    <button
                        @click="visibleItems += 50"
                        class="px-5 py-2 bg-[#1e2023] hover:bg-[#25282c] text-gray-200 font-medium text-xs rounded-lg border border-white/[0.08] transition-colors flex items-center gap-1.5"
                    >
                        <span>Show more</span>
                        <i class="bx bx-chevron-down text-base"></i>
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    transition: 'slide-bottom',
    data() {
        return {
            loading: false,
            descending: '-',
            stars: 0,
            bpm: 0,
            months: 0,
            mapperName: '',
            allColumns: ['Ratio', 'Upvotes', 'Downvotes'],
            column: 'Ratio',
            results: [],
            visibleItems: 10,
        }
    },
    computed: {
        getMonthsDifference() {
            const startDate = new Date('2018-05-01')
            const currentDate = new Date()
            const yearsDifference = currentDate.getFullYear() - startDate.getFullYear()
            const monthsDifference = currentDate.getMonth() - startDate.getMonth()
            return yearsDifference * 12 + monthsDifference
        },
        getFormattedMonths() {
            const startDate = new Date('2018-05-01')
            const resultDate = new Date(startDate.getFullYear(), startDate.getMonth() + this.months, 1)
            const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ]
            return `${monthNames[resultDate.getMonth()]} ${resultDate.getFullYear()}`
        },
        getVisibleItems() {
            return this.results.slice(0, this.visibleItems)
        },
    },
    mounted() {
        this.getCookies()
        this.loadResults()
    },
    methods: {
        isActive(field) {
            return this.column.toLowerCase() === field.toLowerCase()
        },
        saveCookies() {
            Cookies.set('stars', this.stars)
            Cookies.set('bpm', this.bpm)
            Cookies.set('months', this.months)
            Cookies.set('column', this.column)
            Cookies.set('descending', this.descending)
            Cookies.set('mapperName', this.mapperName)
        },
        getCookies() {
            if (Cookies.get('stars')) this.stars = parseInt(Cookies.get('stars'))
            if (Cookies.get('bpm')) this.bpm = parseInt(Cookies.get('bpm'))
            if (Cookies.get('months')) this.months = parseInt(Cookies.get('months'))
            if (Cookies.get('column')) this.column = Cookies.get('column')
            if (Cookies.get('descending')) this.descending = Cookies.get('descending')
            if (Cookies.get('mapperName')) this.mapperName = Cookies.get('mapperName')
        },
        formatRatio(val) {
            if (val === undefined || val === null || isNaN(val)) return '0%'
            const num = Number(val)
            const ratio = num > 1 ? num : num * 100
            return ratio.toFixed(1) + '%'
        },
        getFormattedUploaded(str) {
            if (!str) return '-'
            try {
                return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
            } catch (e) {
                return str
            }
        },
        async loadResults() {
            this.loading = true
            this.saveCookies()
            try {
                const getDescending = this.descending ? this.descending.replace('+', '') : '-'
                const data = {
                    column: getDescending + this.column.toLowerCase(),
                    stars: this.stars,
                    bpm: this.bpm,
                    months: this.months,
                    mapper: this.mapperName,
                }
                const csrfToken = Cookies.get('csrftoken')
                const headers = csrfToken
                    ? {
                          headers: {
                              'content-type': 'application/json',
                              'X-CSRFToken': csrfToken,
                          },
                      }
                    : {}
                const response = await this.$defaultApi.$post('beatsaver/stats', data, headers)
                this.results = response || []
                this.visibleItems = 10
            } catch (e) {
                console.error('Failed to load BeatSaver stats:', e)
                this.results = []
            } finally {
                this.loading = false
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.beatsaver {
    width: 100%;
}
</style>
