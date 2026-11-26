<template>
    <div v-if="compareData && compareData.length" class="space-y-5">
        <!-- Header & Metric Switcher -->
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-base font-semibold text-gray-100">All-Mapper Comparison</h2>
                <p class="text-xs text-gray-400">{{ compareData.length }} tracked mappers · click any mapper to inspect</p>
            </div>
            <div class="flex flex-wrap items-center gap-1">
                <button
                    v-for="m in compareMetrics"
                    :key="m.key"
                    @click="compareMetric = m.key"
                    :class="[
                        'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                        compareMetric === m.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1e2023] text-gray-400 hover:text-gray-200 border border-white/[0.06]',
                    ]"
                >
                    {{ m.label }}
                </button>
            </div>
        </div>

        <!-- Bar Chart + Scatter Plot Side-by-Side -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <!-- Ranked Bar Chart -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5">
                <p class="text-xs font-semibold text-gray-300 mb-3.5">
                    {{ currentCompareMetric.label }} Ranking
                </p>
                <div class="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    <div
                        v-for="(entry, i) in sortedCompareData"
                        :key="entry.mapperId"
                        class="flex items-center gap-3 group cursor-pointer"
                        @click="$emit('select-mapper', entry)"
                    >
                        <span
                            :class="[
                                'w-6 text-xs font-mono text-center shrink-0',
                                i === 0 ? 'text-amber-400 font-semibold' : 'text-gray-500',
                            ]"
                        >
                            #{{ i + 1 }}
                        </span>

                        <span
                            class="text-xs sm:text-sm text-gray-200 group-hover:text-blue-400 w-28 shrink-0 truncate transition-colors"
                            :title="entry.mapperName"
                        >
                            {{ entry.mapperName }}
                        </span>

                        <div class="flex-1 bg-[#141417] rounded h-3.5 overflow-hidden">
                            <div
                                class="h-full rounded transition-all duration-300"
                                :style="{
                                    width: `${compareBarWidth(entry)}%`,
                                    backgroundColor: i === 0 ? '#3b82f6' : i === 1 ? '#2563eb' : '#1d4ed8',
                                }"
                            ></div>
                        </div>
                        <span class="text-xs font-mono text-gray-200 w-20 text-right shrink-0">
                            {{ formatCompareValue(entry) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Interactive Scatter Plot -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 flex flex-col justify-between space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p class="text-xs font-semibold text-gray-300">Mapper Landscape</p>
                        <p class="text-[11px] text-gray-500">{{ scatterConfig.subtitle }}</p>
                    </div>
                    <div class="flex items-center bg-[#141417] p-0.5 rounded-md border border-white/[0.06] text-[11px]">
                        <button
                            v-for="opt in scatterModes"
                            :key="opt.key"
                            @click="scatterMode = opt.key; hoveredDot = null"
                            :class="scatterMode === opt.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                            class="px-2 py-1 rounded font-medium transition-colors"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>

                <div class="w-full relative aspect-[540/260]">
                    <svg class="w-full h-full" viewBox="0 0 540 260" preserveAspectRatio="xMidYMid meet">
                        <!-- Grid -->
                        <g v-for="t in scatterYTicks" :key="'y' + t.y">
                            <line x1="54" :y1="t.y" x2="520" :y2="t.y" stroke="#ffffff" stroke-opacity="0.06" stroke-dasharray="3 3" />
                            <text x="48" :y="t.y + 4" text-anchor="end" fill="#6b7280" font-size="10" font-family="monospace">{{ t.label }}</text>
                        </g>
                        <g v-for="t in scatterXTicks" :key="'x' + t.x">
                            <line :x1="t.x" y1="16" :x2="t.x" y2="220" stroke="#ffffff" stroke-opacity="0.06" stroke-dasharray="3 3" />
                            <text :x="t.x" y="236" text-anchor="middle" fill="#6b7280" font-size="10" font-family="monospace">{{ t.label }}</text>
                        </g>

                        <!-- Axes Labels -->
                        <text x="287" y="254" text-anchor="middle" fill="#9ca3af" font-size="10">{{ scatterConfig.xLabel }}</text>

                        <!-- Dots -->
                        <g
                            v-for="dot in scatterPoints"
                            :key="dot.entry.mapperId"
                            class="cursor-pointer"
                            @mouseenter="hoveredDot = dot"
                            @mouseleave="hoveredDot = null"
                            @click="$emit('select-mapper', dot.entry)"
                        >
                            <circle
                                :cx="dot.x"
                                :cy="dot.y"
                                :r="hoveredDot && hoveredDot.entry.mapperId === dot.entry.mapperId ? 7.5 : 5"
                                :fill="dot.isSelected ? '#10b981' : '#3b82f6'"
                                fill-opacity="0.85"
                                stroke="#1e2023"
                                stroke-width="1.5"
                            />
                            <text
                                :x="dot.x"
                                :y="dot.y - 9"
                                text-anchor="middle"
                                :fill="hoveredDot && hoveredDot.entry.mapperId === dot.entry.mapperId ? '#ffffff' : '#9ca3af'"
                                font-size="9.5"
                                class="pointer-events-none select-none"
                            >
                                {{ dot.entry.mapperName }}
                            </text>
                        </g>
                    </svg>
                </div>

                <div class="text-xs font-mono text-gray-400 border-t border-white/[0.06] pt-2 min-h-[20px]">
                    <template v-if="hoveredDot">
                        <span class="text-gray-100 font-sans font-semibold">{{ hoveredDot.entry.mapperName }}:</span>
                        {{ hoveredDot.xText }} · {{ hoveredDot.yText }} · {{ hoveredDot.entry.totalMaps }} maps
                    </template>
                    <span v-else class="text-gray-500 font-sans">Hover or click any point to jump to that mapper</span>
                </div>
            </div>
        </div>

        <!-- Record Holders Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
                v-for="rec in compareRecords"
                :key="rec.label"
                class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3.5 cursor-pointer transition-colors"
                @click="$emit('select-mapper', rec.entry)"
            >
                <span class="text-xs text-gray-400 block">{{ rec.label }}</span>
                <div class="text-sm font-semibold text-gray-100 mt-1">{{ rec.entry.mapperName }}</div>
                <div class="text-xs font-mono text-gray-400 mt-0.5">{{ rec.value }}</div>
            </div>
        </div>

        <!-- Sortable Head-to-Head Table -->
        <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
            <div class="px-4 py-3 border-b border-white/[0.06] bg-[#141417] flex items-center justify-between">
                <h3 class="text-xs font-semibold text-gray-300">Head-to-Head Stats</h3>
                <span class="text-xs text-gray-500">Click column headers to sort</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm text-left">
                    <thead>
                        <tr class="border-b border-white/[0.06] text-gray-400 text-xs font-medium bg-[#141417] select-none">
                            <th
                                v-for="col in tableCols"
                                :key="col.key"
                                @click="toggleTableSort(col.key)"
                                :class="['py-2.5 px-3.5 cursor-pointer hover:text-white transition-colors whitespace-nowrap', col.align === 'center' ? 'text-center' : '']"
                            >
                                {{ col.label }} <i :class="getTableSortIcon(col.key)"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/[0.05]">
                        <tr
                            v-for="entry in sortedTableData"
                            :key="entry.mapperId"
                            :class="[
                                'hover:bg-white/[0.03] cursor-pointer transition-colors',
                                selectedMapperId == entry.mapperId ? 'bg-blue-600/10' : '',
                            ]"
                            @click="$emit('select-mapper', entry)"
                        >
                            <td class="py-2.5 px-3.5 font-medium text-gray-100 whitespace-nowrap">{{ entry.mapperName }}</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-gray-300">{{ entry.totalMaps }}</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-emerald-400">+{{ entry.totalUpvotes.toLocaleString() }}</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-gray-200">{{ entry.overallRatio }}%</td>
                            <td class="py-2.5 px-3.5 text-center font-mono" :class="entry.netScore >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                                {{ entry.netScore >= 0 ? '+' : '' }}{{ entry.netScore.toLocaleString() }}
                            </td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-gray-200">+{{ entry.growth30d.toLocaleString() }}</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-gray-300">{{ entry.avgBpm }}</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-amber-400">{{ entry.avgStar }}</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-gray-300">{{ entry.mapsPerMonth }}/mo</td>
                            <td class="py-2.5 px-3.5 text-center font-mono text-gray-300 whitespace-nowrap">{{ entry.totalDurationStr }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        compareData: { type: Array, default: () => [] },
        selectedMapperId: { type: [String, Number], default: null },
    },
    data() {
        return {
            compareMetric: 'totalUpvotes',
            compareMetrics: [
                { key: 'totalUpvotes', label: 'Upvotes' },
                { key: 'netScore', label: 'Net Score' },
                { key: 'overallRatio', label: 'Approval %' },
                { key: 'growth30d', label: '30d Growth' },
                { key: 'totalMaps', label: 'Maps' },
                { key: 'avgStar', label: 'Avg Stars' },
                { key: 'mapsPerMonth', label: 'Maps/mo' },
                { key: 'totalDurationSec', label: 'Music Time' },
            ],
            scatterMode: 'upvotes_ratio',
            scatterModes: [
                { key: 'upvotes_ratio', label: 'Upvotes vs Approval' },
                { key: 'maps_growth', label: 'Maps vs 30d Growth' },
                { key: 'stars_ratio', label: 'Avg ★ vs Approval' },
            ],
            hoveredDot: null,
            tableSortKey: 'totalUpvotes',
            tableSortOrder: -1,
            tableCols: [
                { key: 'mapperName', label: 'Mapper', align: 'left' },
                { key: 'totalMaps', label: 'Maps', align: 'center' },
                { key: 'totalUpvotes', label: 'Upvotes', align: 'center' },
                { key: 'overallRatio', label: 'Approval', align: 'center' },
                { key: 'netScore', label: 'Net Score', align: 'center' },
                { key: 'growth30d', label: '30d Growth', align: 'center' },
                { key: 'avgBpm', label: 'Avg BPM', align: 'center' },
                { key: 'avgStar', label: 'Avg ★', align: 'center' },
                { key: 'mapsPerMonth', label: 'Maps/mo', align: 'center' },
                { key: 'totalDurationSec', label: 'Music', align: 'center' },
            ],
        }
    },
    computed: {
        currentCompareMetric() {
            return this.compareMetrics.find((m) => m.key === this.compareMetric) || this.compareMetrics[0]
        },
        sortedCompareData() {
            return [...this.compareData].sort((a, b) => (b[this.compareMetric] || 0) - (a[this.compareMetric] || 0))
        },
        sortedTableData() {
            const key = this.tableSortKey
            const ord = this.tableSortOrder
            return [...this.compareData].sort((a, b) => {
                if (key === 'mapperName') return String(a.mapperName || '').localeCompare(String(b.mapperName || '')) * ord
                return ((a[key] || 0) - (b[key] || 0)) * ord
            })
        },
        compareRecords() {
            if (!this.compareData.length) return []
            const best = (key) => [...this.compareData].sort((a, b) => (b[key] || 0) - (a[key] || 0))[0]
            return [
                { label: 'Most Upvotes', entry: best('totalUpvotes'), value: `+${best('totalUpvotes').totalUpvotes.toLocaleString()}` },
                { label: 'Highest Approval', entry: best('overallRatio'), value: `${best('overallRatio').overallRatio}%` },
                { label: 'Fastest Growing', entry: best('growth30d'), value: `+${best('growth30d').growth30d.toLocaleString()} in 30d` },
                { label: 'Most Prolific', entry: best('totalMaps'), value: `${best('totalMaps').totalMaps} maps` },
            ]
        },
        scatterConfig() {
            if (this.scatterMode === 'upvotes_ratio') {
                return {
                    subtitle: 'Total upvotes (X) vs overall approval % (Y)',
                    xKey: 'totalUpvotes',
                    yKey: 'overallRatio',
                    xLabel: 'Total Upvotes',
                    fmtX: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v)),
                    fmtY: (v) => `${v}%`,
                }
            }
            if (this.scatterMode === 'maps_growth') {
                return {
                    subtitle: 'Catalog size (X) vs 30d vote growth (Y)',
                    xKey: 'totalMaps',
                    yKey: 'growth30d',
                    xLabel: 'Total Maps',
                    fmtX: (v) => String(v),
                    fmtY: (v) => `+${v}`,
                }
            }
            return {
                subtitle: 'Average star rating (X) vs overall approval % (Y)',
                xKey: 'avgStar',
                yKey: 'overallRatio',
                xLabel: 'Avg Stars',
                fmtX: (v) => `★${v}`,
                fmtY: (v) => `${v}%`,
            }
        },
        scatterBounds() {
            if (!this.compareData.length) return { minX: 0, maxX: 1, minY: 0, maxY: 100 }
            const cfg = this.scatterConfig
            const xs = this.compareData.map((e) => Number(e[cfg.xKey] || 0))
            const ys = this.compareData.map((e) => Number(e[cfg.yKey] || 0))
            const minX = cfg.xKey === 'avgStar' ? Math.max(0, Math.floor(Math.min(...xs)) - 1) : 0
            const maxX = Math.max(minX + 1, Math.max(...xs) * 1.08)
            const minY = cfg.yKey === 'overallRatio' ? Math.max(0, Math.floor(Math.min(...ys) / 5) * 5 - 5) : 0
            const maxY = cfg.yKey === 'overallRatio' ? 100 : Math.max(1, Math.max(...ys) * 1.1)
            return { minX, maxX, minY, maxY }
        },
        scatterPoints() {
            const cfg = this.scatterConfig
            const { minX, maxX, minY, maxY } = this.scatterBounds
            const xLeft = 60
            const xRight = 510
            const yTop = 22
            const yBottom = 216

            return this.compareData.map((entry) => {
                const vx = Number(entry[cfg.xKey] || 0)
                const vy = Number(entry[cfg.yKey] || 0)
                const x = Math.round(xLeft + ((vx - minX) / (maxX - minX)) * (xRight - xLeft))
                const y = Math.round(yBottom - ((vy - minY) / (maxY - minY)) * (yBottom - yTop))
                return {
                    entry,
                    x,
                    y,
                    isSelected: this.selectedMapperId == entry.mapperId,
                    xText: `${cfg.xLabel}: ${cfg.fmtX(vx)}`,
                    yText: cfg.fmtY(vy),
                }
            })
        },
        scatterXTicks() {
            const cfg = this.scatterConfig
            const { minX, maxX } = this.scatterBounds
            return [0, 0.5, 1].map((f) => {
                const v = Math.round((minX + (maxX - minX) * f) * 10) / 10
                return { x: Math.round(60 + f * 450), label: cfg.fmtX(cfg.xKey === 'avgStar' ? v : Math.round(v)) }
            })
        },
        scatterYTicks() {
            const cfg = this.scatterConfig
            const { minY, maxY } = this.scatterBounds
            return [0, 0.5, 1].map((f) => {
                const v = Math.round(minY + (maxY - minY) * f)
                return { y: Math.round(216 - f * 194), label: cfg.fmtY(v) }
            })
        },
    },
    methods: {
        compareBarWidth(entry) {
            const max = Math.max(...this.compareData.map((e) => e[this.compareMetric] || 0))
            if (!max) return 0
            return Math.max(2, Math.round(((entry[this.compareMetric] || 0) / max) * 100))
        },
        formatCompareValue(entry) {
            const v = entry[this.compareMetric]
            if (this.compareMetric === 'overallRatio') return `${v}%`
            if (this.compareMetric === 'mapsPerMonth') return `${v}/mo`
            if (this.compareMetric === 'avgStar') return `★ ${v}`
            if (this.compareMetric === 'totalDurationSec') return entry.totalDurationStr
            return typeof v === 'number' ? v.toLocaleString() : v
        },
        toggleTableSort(key) {
            if (this.tableSortKey === key) {
                this.tableSortOrder = -this.tableSortOrder
            } else {
                this.tableSortKey = key
                this.tableSortOrder = key === 'mapperName' ? 1 : -1
            }
        },
        getTableSortIcon(key) {
            if (this.tableSortKey !== key) return 'bx bx-sort-alt-2 opacity-30 ml-0.5'
            return this.tableSortOrder === -1 ? 'bx bx-sort-down text-blue-400 ml-0.5' : 'bx bx-sort-up text-blue-400 ml-0.5'
        },
    },
}
</script>
