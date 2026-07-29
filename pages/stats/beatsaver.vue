<template>
    <div class="beatsaver flex flex-col lg:flex-row gap-8 items-start">
        <!-- Left Column: Filter Sidebar Card (Spaced Out Filters) -->
        <div class="w-full lg:w-80 bg-[#18191c] border border-gray-800 rounded-xl p-6 shadow-xl space-y-6 shrink-0">
            <h3 class="text-base font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-3.5">
                <i class="bx bx-slider-alt text-blue-400 text-xl"></i> Filter Ranked Maps
            </h3>

            <!-- Mapper Name Search -->
            <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-300 block">Mapper Name</label>
                <input
                    type="text"
                    v-model="mapperName"
                    @keyup.enter="loadResults"
                    placeholder="Enter mapper name..."
                    class="w-full bg-[#121315] text-gray-100 placeholder-gray-500 border border-gray-700 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
                />
            </div>

            <!-- Order By Dropdown -->
            <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-300 block">Order By</label>
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
                <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-gray-300">Minimum Stars</span>
                    <span class="text-amber-400 font-mono">★ {{ stars }}</span>
                </div>
                <Slider v-model="stars" :max="14" :tooltips="false" />
            </div>

            <!-- Minimum BPM Slider -->
            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-gray-300">Minimum BPM</span>
                    <span class="text-blue-400 font-mono">{{ bpm }} BPM</span>
                </div>
                <Slider v-model="bpm" :max="350" :tooltips="false" />
            </div>

            <!-- Uploaded Since Slider -->
            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-gray-300">Uploaded Since</span>
                    <span class="text-purple-400 font-mono">{{ getFormattedMonths }}</span>
                </div>
                <Slider v-model="months" :min="0" :max="getMonthsDifference" :tooltips="false" />
            </div>

            <!-- Sort Direction Toggle -->
            <div class="space-y-2 pt-1">
                <label class="text-xs font-semibold text-gray-300 block">Sorting Order</label>
                <div class="flex items-center gap-4 bg-[#121315] border border-gray-800 p-2.5 rounded-lg justify-around text-xs font-semibold text-gray-300">
                    <label class="flex items-center gap-1.5 cursor-pointer">
                        <RadioButton id="desc" value="-" v-model="descending" />
                        <span>Descending</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer">
                        <RadioButton id="asc" value="+" v-model="descending" />
                        <span>Ascending</span>
                    </label>
                </div>
            </div>

            <!-- Filter Action Button -->
            <div class="pt-2">
                <button
                    @click="loadResults"
                    :disabled="loading"
                    class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <ProgressSpinner v-if="loading" style="width: 18px; height: 18px" strokeWidth="4" />
                    <i v-else class="bx bx-filter-alt text-base"></i>
                    <span>Apply Filters</span>
                </button>
            </div>
        </div>

        <!-- Right Column: Vertical List Results Cards -->
        <div class="flex-1 w-full space-y-4">
            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-100 flex items-center gap-2">
                    <i class="bx bx-list-ol text-blue-400 text-xl"></i> Filter Results
                </h3>
                <span v-if="results.length" class="text-xs text-gray-400 font-mono">
                    Found {{ results.length }} ranked maps
                </span>
            </div>

            <div v-if="loading" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center shadow-xl">
                <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
                <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Filtering BeatSaver maps...</span>
            </div>

            <div v-else-if="getVisibleItems.length === 0" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 text-center text-gray-400 flex flex-col items-center justify-center shadow-xl">
                <i class="bx bx-search-alt text-5xl mb-3 text-gray-600"></i>
                <p class="text-lg font-medium text-gray-300">No maps match your filter criteria</p>
                <p class="text-sm text-gray-500 mt-1">Try lowering minimum stars, BPM, or clearing the mapper search filter.</p>
            </div>

            <!-- Vertical Cards List -->
            <template v-else>
                <div class="flex flex-col gap-3.5">
                    <div
                        v-for="(item, index) in getVisibleItems"
                        :key="item.key"
                        class="bg-[#18191c] border border-gray-800 hover:border-blue-500/40 rounded-xl p-4 shadow-lg transition-all flex flex-wrap items-center justify-between gap-4 group"
                    >
                        <!-- Left Info Section -->
                        <div class="flex items-center gap-3.5 min-w-0 max-w-md">
                            <span class="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                                #{{ index + 1 }}
                            </span>
                            <div class="min-w-0">
                                <div class="font-bold text-gray-100 group-hover:text-blue-400 transition-colors text-base truncate" :title="item['songName']">
                                    {{ item['songName'] }}
                                </div>
                                <div class="text-xs text-gray-400 mt-0.5 truncate">
                                    by <span class="text-blue-300 font-medium">{{ item['levelAuthorName'] || 'Unknown Mapper' }}</span>
                                    <span class="text-gray-600 mx-1.5">•</span>
                                    <span>Uploaded {{ getFormattedUploaded(item['uploaded']) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Center & Right Metrics Section -->
                        <div class="flex flex-wrap items-center gap-3 shrink-0 font-mono text-xs">
                            <!-- Ratio -->
                            <div class="bg-[#121315] border border-gray-800 px-3 py-1.5 rounded-lg text-center">
                                <span class="text-[10px] text-gray-400 block uppercase font-sans">Ratio</span>
                                <span :class="['font-bold text-sm', isActive('ratio') ? 'text-blue-400 font-extrabold' : 'text-gray-200']">
                                    {{ formatRatio(item['ratio']) }}
                                </span>
                            </div>

                            <!-- Votes -->
                            <div class="bg-[#121315] border border-gray-800 px-3 py-1.5 rounded-lg text-center">
                                <span class="text-[10px] text-gray-400 block uppercase font-sans">Votes</span>
                                <div class="font-bold text-xs flex items-center gap-1 mt-0.5">
                                    <span class="text-emerald-400">+{{ item['upvotes'] }}</span>
                                    <span class="text-gray-600">/</span>
                                    <span class="text-rose-400">+{{ item['downvotes'] }}</span>
                                </div>
                            </div>

                            <!-- Stars -->
                            <div class="bg-[#121315] border border-gray-800 px-3 py-1.5 rounded-lg text-center">
                                <span class="text-[10px] text-gray-400 block uppercase font-sans">Stars</span>
                                <span class="font-bold text-sm text-amber-400">
                                    ★ {{ item['highestStar'] ? item['highestStar'].toFixed(1) : '-' }}
                                </span>
                            </div>

                            <!-- BPM -->
                            <div class="bg-[#121315] border border-gray-800 px-3 py-1.5 rounded-lg text-center">
                                <span class="text-[10px] text-gray-400 block uppercase font-sans">BPM</span>
                                <span class="font-bold text-sm text-purple-300">
                                    {{ item['bpm'] ? Math.round(item['bpm']) : '-' }}
                                </span>
                            </div>

                            <!-- BeatSaver Link Button -->
                            <a
                                v-if="item.key"
                                :href="`https://beatsaver.com/maps/${item.key}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all flex items-center justify-center shrink-0"
                                title="View on BeatSaver"
                            >
                                <img class="w-5 h-5 object-contain" src="https://beatsaver.com/static/favicon/favicon-32x32.png" alt="BeatSaver" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Show More Button -->
                <div v-if="visibleItems < results.length" class="flex justify-center pt-4">
                    <button
                        @click="visibleItems += 50"
                        class="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-semibold text-xs rounded-xl border border-gray-700 transition-colors shadow-md flex items-center gap-2"
                    >
                        <span>Show More Maps</span>
                        <i class="bx bx-chevron-down text-lg"></i>
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
                const response = await this.$defaultApi.$post('beatsaver/stats', data)
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
