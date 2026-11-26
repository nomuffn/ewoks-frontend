<template>
    <div
        v-if="map"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto"
        @click.self="$emit('close')"
    >
        <div class="relative w-full max-w-5xl bg-[#1e2023] border border-white/[0.08] rounded-lg shadow-2xl overflow-hidden my-8">
            <!-- Modal Header -->
            <div class="bg-[#141417] border-b border-white/[0.06] p-5 flex items-start justify-between gap-4">
                <div class="flex items-center gap-4 min-w-0">
                    <img
                        :src="map.hash ? `https://cdn.scoresaber.com/covers/${map.hash.toUpperCase()}.png` : '/favicon.ico'"
                        @error="onImageError"
                        alt="Cover"
                        class="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#1e2023]"
                    />
                    <div class="min-w-0">
                        <h3 class="text-lg font-semibold text-gray-100 truncate">
                            {{ map.songName }}
                            <span v-if="map.songSubName" class="text-sm font-normal text-gray-400 ml-1">
                                {{ map.songSubName }}
                            </span>
                        </h3>
                        <p class="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span>{{ map.songAuthorName }}</span>
                            <span class="text-gray-600">·</span>
                            <span>mapped by <strong class="text-gray-200 font-medium">{{ map.levelAuthorName || mapperName }}</strong></span>
                            <span v-if="map.uploaded" class="text-gray-600">·</span>
                            <span v-if="map.uploaded">{{ formatDate(map.uploaded) }}</span>
                            <span v-if="map.duration" class="text-gray-600">·</span>
                            <span v-if="map.duration" class="font-mono">{{ formatDuration(map.duration) }}</span>
                        </p>
                        <div class="flex flex-wrap items-center gap-2 mt-2">
                            <a
                                v-if="map.key"
                                :href="`https://beatsaver.com/maps/${map.key}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="nope inline-flex items-center gap-1 text-xs font-mono bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white px-2.5 py-1 rounded-md transition-colors"
                            >
                                #{{ map.key }} <i class="bx bx-link-external text-xs"></i>
                            </a>
                            <a
                                v-if="map.hash"
                                :href="`https://scoresaber.com/leaderboard/${map.hash}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="nope inline-flex items-center gap-1 text-xs bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white px-2.5 py-1 rounded-md transition-colors"
                            >
                                ScoreSaber <i class="bx bx-link-external text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <button
                    @click="$emit('close')"
                    class="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors shrink-0"
                    title="Close modal (Esc)"
                >
                    <i class="bx bx-x text-2xl"></i>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-5 max-h-[82vh] overflow-y-auto">
                <!-- Key Metrics Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                        <span class="text-[11px] text-gray-400 block">Votes &amp; Net</span>
                        <div class="text-sm font-semibold font-mono mt-1">
                            <span class="text-emerald-400">+{{ upvotes }}</span>
                            <span class="text-gray-600 mx-0.5">/</span>
                            <span class="text-rose-400">-{{ downvotes }}</span>
                        </div>
                        <span class="text-[11px] font-mono mt-1 text-gray-400">
                            {{ netScore >= 0 ? '+' + netScore : netScore }} net
                        </span>
                    </div>

                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                        <span class="text-[11px] text-gray-400 block">Approval</span>
                        <div class="text-base font-semibold font-mono text-gray-100 mt-1">
                            {{ approvalRatio }}%
                        </div>
                        <span class="text-[11px] text-gray-400 mt-0.5 truncate">{{ sentimentLabel }}</span>
                    </div>

                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                        <span class="text-[11px] text-gray-400 block">Account Standing</span>
                        <div class="text-base font-semibold font-mono text-gray-100 mt-1">
                            #{{ portfolioRank }}
                            <span class="text-xs font-normal text-gray-500">/ {{ totalCount }}</span>
                        </div>
                        <span class="text-[11px] text-gray-500 font-mono mt-0.5">
                            {{ accountVoteShare }}% of mapper up
                        </span>
                    </div>

                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                        <span class="text-[11px] text-gray-400 block">30d Rate</span>
                        <div class="text-base font-semibold font-mono text-emerald-400 mt-1">
                            +{{ velocity30d }}<span class="text-xs font-normal text-gray-400">/d</span>
                        </div>
                        <span class="text-[11px] text-gray-500 font-mono mt-0.5">7d: +{{ velocity7d }}/d</span>
                    </div>

                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                        <span class="text-[11px] text-gray-400 block">Stars &amp; BPM</span>
                        <div class="text-base font-semibold font-mono text-amber-400 mt-1">
                            ★ {{ map.highestStar ? map.highestStar.toFixed(2) : '-' }}
                        </div>
                        <span class="text-[11px] text-gray-500 font-mono mt-0.5">{{ map.bpm ? Math.round(map.bpm) : '-' }} BPM</span>
                    </div>

                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                        <span class="text-[11px] text-gray-400 block">Next Milestone</span>
                        <div class="text-sm font-semibold font-mono text-gray-100 mt-1 truncate">
                            {{ milestoneTarget.toLocaleString() }} up
                        </div>
                        <div class="w-full bg-[#25282c] h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div class="bg-blue-500 h-full transition-all duration-300" :style="{ width: `${milestonePercent}%` }"></div>
                        </div>
                    </div>
                </div>

                <!-- Parsed Difficulties Strip -->
                <div v-if="parsedDiffs.length" class="flex flex-wrap gap-2">
                    <div
                        v-for="(d, idx) in parsedDiffs"
                        :key="idx"
                        class="bg-[#141417] border border-white/[0.06] rounded-md px-3 py-1.5 text-xs flex flex-wrap items-center gap-2.5"
                    >
                        <span class="font-medium text-gray-200">
                            {{ d.Diff === 'ExpertPlus' ? 'Expert+' : d.Diff }}
                            <span v-if="d.Char && d.Char !== 'Standard'" class="text-gray-500 font-normal">({{ d.Char }})</span>
                        </span>
                        <span v-if="d.Stars > 0" class="font-mono text-amber-400 font-semibold">★ {{ Number(d.Stars).toFixed(2) }}</span>
                        <span v-if="d.Notes" class="font-mono text-gray-400">{{ d.Notes.toLocaleString() }} notes</span>
                        <span v-if="d.Notes && map.duration" class="font-mono text-gray-500">{{ (d.Notes / map.duration).toFixed(1) }} NPS</span>
                        <span v-if="d.Njs" class="font-mono text-gray-500">NJS {{ d.Njs }}</span>
                        <span
                            v-for="req in (d.Requirements || [])"
                            :key="req"
                            class="text-[11px] text-blue-300 font-mono"
                        >
                            {{ req }}
                        </span>
                    </div>
                </div>

                <!-- Graph Section (4 Modes) -->
                <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-4 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <h4 class="text-sm font-semibold text-gray-200">
                            {{ chartHeading }}
                        </h4>

                        <div class="flex flex-wrap items-center bg-[#1e2023] p-1 rounded-lg border border-white/[0.06] text-xs">
                            <button
                                v-for="t in chartTabs"
                                :key="t.key"
                                @click="chartType = t.key; hoveredPoint = null"
                                :class="[
                                    'px-2.5 py-1 font-medium rounded-md transition-colors',
                                    chartType === t.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white',
                                ]"
                            >
                                {{ t.label }}
                            </button>
                        </div>
                    </div>

                    <!-- 1. Dual-Line Cumulative Chart -->
                    <div v-if="chartType === 'growth'" class="space-y-2.5">
                        <div class="w-full relative aspect-[1000/225] max-h-[235px]">
                            <svg class="w-full h-full" viewBox="0 0 1000 225" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    <linearGradient id="mapUpvoteGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.22" />
                                        <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                                    </linearGradient>
                                </defs>

                                <g v-for="tick in growthTicks" :key="tick.y">
                                    <line x1="56" :y1="tick.y" x2="985" :y2="tick.y" stroke="#ffffff" stroke-opacity="0.07" stroke-dasharray="4 4" />
                                    <text x="48" :y="tick.y + 4" text-anchor="end" fill="#6b7280" font-size="11" font-family="monospace">
                                        {{ formatCompact(tick.val) }}
                                    </text>
                                </g>

                                <polygon :points="upvoteAreaPoints" fill="url(#mapUpvoteGrad)" />

                                <polyline
                                    :points="upvotePolylinePoints"
                                    fill="none"
                                    stroke="#10b981"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                                <polyline
                                    :points="downvotePolylinePoints"
                                    fill="none"
                                    stroke="#f43f5e"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-dasharray="6 3"
                                />

                                <line
                                    v-if="hoveredPoint"
                                    :x1="hoveredPoint.x"
                                    y1="15"
                                    :x2="hoveredPoint.x"
                                    y2="185"
                                    stroke="#60a5fa"
                                    stroke-dasharray="3 3"
                                    stroke-width="1.5"
                                />

                                <g v-for="(pt, idx) in chartPoints" :key="idx">
                                    <circle
                                        v-if="hoveredPoint && hoveredPoint.label === pt.label"
                                        :cx="pt.x"
                                        :cy="pt.yUp"
                                        r="7.5"
                                        fill="#10b981"
                                        fill-opacity="0.25"
                                        stroke="#10b981"
                                        stroke-width="2"
                                    />
                                    <circle :cx="pt.x" :cy="pt.yUp" r="4" fill="#10b981" stroke="#141417" stroke-width="2" />
                                    <circle :cx="pt.x" :cy="pt.yDown" r="3.5" fill="#f43f5e" stroke="#141417" stroke-width="1.5" />
                                    <text :x="pt.x" y="210" text-anchor="middle" fill="#6b7280" font-size="11" font-family="monospace">
                                        {{ pt.label }}
                                    </text>
                                    <rect
                                        :x="pt.x - 32"
                                        y="10"
                                        width="64"
                                        height="200"
                                        fill="transparent"
                                        class="cursor-pointer"
                                        @mouseenter="hoveredPoint = pt"
                                        @mouseleave="hoveredPoint = null"
                                    />
                                </g>
                            </svg>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs">
                            <div class="flex items-center gap-5 text-gray-400">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-3 h-0.5 bg-emerald-500 rounded"></span> Upvotes
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <span class="w-3 h-0.5 bg-rose-500 rounded"></span> Downvotes
                                </span>
                            </div>

                            <div v-if="hoveredPoint" class="flex items-center gap-2.5 font-mono text-gray-300">
                                <span class="text-gray-400 font-sans">{{ hoveredPoint.label }}:</span>
                                <span class="text-emerald-400">+{{ hoveredPoint.valUp }}</span>
                                <span class="text-rose-400">-{{ hoveredPoint.valDown }}</span>
                                <span class="text-gray-500">·</span>
                                <span>{{ hoveredPoint.ratio }}%</span>
                            </div>
                            <span v-else class="text-gray-500">Hover any point for exact counts</span>
                        </div>
                    </div>

                    <!-- 2. Period Deltas Bar Chart -->
                    <div v-else-if="chartType === 'deltas'" class="space-y-2.5">
                        <div class="h-52 w-full flex items-end justify-between gap-2.5 pt-6 pb-2 px-2 border-b border-white/[0.06]">
                            <div
                                v-for="bar in barChartData"
                                :key="bar.label"
                                class="flex-1 flex flex-col items-center h-full justify-end group"
                            >
                                <div class="text-[11px] font-mono text-gray-400 group-hover:text-gray-200 mb-1 transition-colors whitespace-nowrap">
                                    +{{ bar.upvotes }} / -{{ bar.downvotes }}
                                </div>
                                <div class="w-full max-w-[44px] flex items-end justify-center gap-1 h-32">
                                    <div
                                        class="w-1/2 bg-emerald-500/85 rounded-t transition-colors hover:bg-emerald-400"
                                        :style="{ height: `${bar.upHeight}%` }"
                                        :title="`${bar.label} Upvotes: +${bar.upvotes}`"
                                    ></div>
                                    <div
                                        class="w-1/2 bg-rose-500/85 rounded-t transition-colors hover:bg-rose-400"
                                        :style="{ height: `${bar.downHeight}%` }"
                                        :title="`${bar.label} Downvotes: +${bar.downvotes}`"
                                    ></div>
                                </div>
                                <span class="text-[11px] font-mono text-gray-400 mt-2 truncate max-w-full">{{ bar.label }}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-center gap-5 text-xs text-gray-400">
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Upvotes
                            </span>
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Downvotes
                            </span>
                        </div>
                    </div>

                    <!-- 3. Daily Growth Rate -->
                    <div v-else-if="chartType === 'velocity'" class="space-y-2.5">
                        <div class="h-52 w-full flex items-end justify-between gap-2.5 pt-6 pb-2 px-2 border-b border-white/[0.06]">
                            <div
                                v-for="v in velocityChartData"
                                :key="v.label"
                                class="flex-1 flex flex-col items-center h-full justify-end group"
                            >
                                <div class="text-[11px] font-mono text-gray-300 mb-1 whitespace-nowrap">
                                    +{{ v.rate }}/d
                                </div>
                                <div class="w-full max-w-[38px] flex items-end justify-center h-32">
                                    <div
                                        class="w-full bg-blue-500/85 rounded-t transition-colors hover:bg-blue-400"
                                        :style="{ height: `${v.height}%` }"
                                        :title="`${v.label}: +${v.rate} votes/day`"
                                    ></div>
                                </div>
                                <span class="text-[11px] font-mono text-gray-400 mt-2 truncate max-w-full">{{ v.label }}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-center gap-5 text-xs text-gray-400">
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Average votes/day
                            </span>
                        </div>
                    </div>

                    <!-- 4. Approval % Trend Over Time -->
                    <div v-else class="space-y-2.5">
                        <div class="w-full relative aspect-[1000/225] max-h-[235px]">
                            <svg class="w-full h-full" viewBox="0 0 1000 225" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    <linearGradient id="ratioGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.22" />
                                        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
                                    </linearGradient>
                                </defs>

                                <g v-for="tick in ratioTicks" :key="tick.y">
                                    <line x1="56" :y1="tick.y" x2="985" :y2="tick.y" stroke="#ffffff" stroke-opacity="0.07" stroke-dasharray="4 4" />
                                    <text x="48" :y="tick.y + 4" text-anchor="end" fill="#6b7280" font-size="11" font-family="monospace">
                                        {{ tick.val }}%
                                    </text>
                                </g>

                                <polygon :points="ratioAreaPoints" fill="url(#ratioGrad)" />

                                <polyline
                                    :points="ratioPolylinePoints"
                                    fill="none"
                                    stroke="#3b82f6"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                                <g v-for="(pt, idx) in ratioPoints" :key="idx">
                                    <circle :cx="pt.x" :cy="pt.yRatio" r="4" fill="#3b82f6" stroke="#141417" stroke-width="2" />
                                    <text :x="pt.x" y="210" text-anchor="middle" fill="#6b7280" font-size="11" font-family="monospace">
                                        {{ pt.label }}
                                    </text>
                                    <rect
                                        :x="pt.x - 32"
                                        y="10"
                                        width="64"
                                        height="200"
                                        fill="transparent"
                                        class="cursor-pointer"
                                        @mouseenter="hoveredPoint = pt"
                                        @mouseleave="hoveredPoint = null"
                                    />
                                </g>
                            </svg>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs">
                            <span class="flex items-center gap-1.5 text-gray-400">
                                <span class="w-3 h-0.5 bg-blue-500 rounded"></span> Historical Approval %
                            </span>
                            <div v-if="hoveredPoint" class="flex items-center gap-2.5 font-mono text-gray-300">
                                <span class="text-gray-400 font-sans">{{ hoveredPoint.label }}:</span>
                                <span class="text-blue-400 font-semibold">{{ hoveredPoint.ratio }}%</span>
                                <span class="text-gray-500">(+{{ hoveredPoint.valUp }} / -{{ hoveredPoint.valDown }})</span>
                            </div>
                            <span v-else class="text-gray-500">Hover any point for ratio snapshot</span>
                        </div>
                    </div>
                </div>

                <!-- Breakdown Table -->
                <div class="bg-[#141417] border border-white/[0.06] rounded-lg overflow-hidden">
                    <div class="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                        <h4 class="text-xs font-semibold text-gray-300">Historical Breakdown</h4>
                        <span class="text-xs text-gray-500">All known lookback windows</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-white/[0.06] text-gray-400 font-medium">
                                    <th class="py-2.5 px-4">Timeframe</th>
                                    <th class="py-2.5 px-4 text-center">Upvotes</th>
                                    <th class="py-2.5 px-4 text-center">Downvotes</th>
                                    <th class="py-2.5 px-4 text-center">Net</th>
                                    <th class="py-2.5 px-4 text-center">Period Approval</th>
                                    <th class="py-2.5 px-4 text-center">Daily Rate</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/[0.05] text-gray-200">
                                <tr
                                    v-for="row in breakdownRows"
                                    :key="row.label"
                                    :class="row.isHighlight ? 'bg-white/[0.03] font-medium' : 'hover:bg-white/[0.02]'"
                                >
                                    <td class="py-2 px-4">
                                        <span class="text-gray-200">{{ row.label }}</span>
                                        <span v-if="row.tag" class="text-[11px] text-gray-500 font-mono ml-1.5">({{ row.tag }})</span>
                                    </td>
                                    <td class="py-2 px-4 text-center text-emerald-400 font-mono">+{{ row.upvotes }}</td>
                                    <td class="py-2 px-4 text-center text-rose-400 font-mono">-{{ row.downvotes }}</td>
                                    <td class="py-2 px-4 text-center font-mono" :class="row.net >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                                        {{ row.net >= 0 ? '+' + row.net : row.net }}
                                    </td>
                                    <td class="py-2 px-4 text-center font-mono text-gray-300">
                                        {{ row.ratio !== null ? row.ratio + '%' : '-' }}
                                    </td>
                                    <td class="py-2 px-4 text-center text-gray-400 font-mono">
                                        +{{ row.rate }}/d
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-[#141417] border-t border-white/[0.06] px-5 py-3 flex items-center justify-end">
                <button
                    @click="$emit('close')"
                    class="px-4 py-1.5 bg-[#25282c] hover:bg-[#2e3238] text-gray-200 rounded-lg text-xs font-medium transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        map: { type: Object, default: null },
        allMaps: { type: Array, default: () => [] },
        insights: { type: Object, default: null },
        mapperName: { type: String, default: '' },
        totalCount: { type: Number, default: 0 },
    },
    data() {
        return {
            chartType: 'growth',
            hoveredPoint: null,
            chartTabs: [
                { key: 'growth', label: 'Timeline' },
                { key: 'deltas', label: 'Period Deltas' },
                { key: 'velocity', label: 'Growth Rate' },
                { key: 'ratio', label: 'Approval Trend' },
            ],
        }
    },
    watch: {
        map() {
            this.chartType = 'growth'
            this.hoveredPoint = null
        },
    },
    computed: {
        chartHeading() {
            if (this.chartType === 'growth') return 'Upvotes & Downvotes Over Time'
            if (this.chartType === 'deltas') return 'Period Vote Deltas'
            if (this.chartType === 'velocity') return 'Daily Vote Velocity'
            return 'Approval % Over Time'
        },
        upvotes() {
            if (!this.map) return 0
            return this.map.latest?.upvotes ?? this.map.upvotes ?? 0
        },
        downvotes() {
            if (!this.map) return 0
            return this.map.latest?.downvotes ?? this.map.downvotes ?? 0
        },
        netScore() {
            return this.upvotes - this.downvotes
        },
        approvalRatio() {
            const tot = this.upvotes + this.downvotes
            return tot > 0 ? Math.round((this.upvotes / tot) * 1000) / 10 : 0
        },
        sentimentLabel() {
            const r = this.approvalRatio
            if (r >= 95) return 'Overwhelmingly Positive'
            if (r >= 85) return 'Very Positive'
            if (r >= 70) return 'Positive'
            if (r >= 50) return 'Mixed'
            return 'Negative'
        },
        portfolioRank() {
            if (!this.map || !this.allMaps.length) return 1
            const sorted = [...this.allMaps].sort(
                (a, b) => (b.latest?.upvotes ?? b.upvotes ?? 0) - (a.latest?.upvotes ?? a.upvotes ?? 0)
            )
            const key = this.map.key || this.map.hash
            const idx = sorted.findIndex((m) => (m.key || m.hash) === key)
            return idx >= 0 ? idx + 1 : 1
        },
        accountVoteShare() {
            const total = this.insights?.totalUpvotes || 0
            if (!total) return '0.0'
            return ((this.upvotes / total) * 100).toFixed(1)
        },
        parsedDiffs() {
            if (!this.map || !this.map.diffs) return []
            if (Array.isArray(this.map.diffs)) return this.map.diffs
            try {
                const parsed = JSON.parse(this.map.diffs)
                return Array.isArray(parsed) ? parsed : []
            } catch (e) {
                return []
            }
        },
        deltas() {
            const m = this.map || {}
            const get = (k) => m[k] || { upvotes: 0, downvotes: 0 }
            return {
                d1: get('days-1'),
                d7: get('days-7'),
                d30: get('days-30'),
                d90: get('days-90'),
                d180: get('days-180'),
                d360: get('days-360'),
                d720: get('days-720'),
                d1080: get('days-1080'),
                d1440: get('days-1440'),
                d1800: get('days-1800'),
            }
        },
        velocity7d() {
            const t = (this.deltas.d7.upvotes || 0) + (this.deltas.d7.downvotes || 0)
            return Math.round((t / 7) * 10) / 10
        },
        velocity30d() {
            const t = (this.deltas.d30.upvotes || 0) + (this.deltas.d30.downvotes || 0)
            return Math.round((t / 30) * 10) / 10
        },
        milestoneTarget() {
            const up = this.upvotes
            for (const step of [25, 50, 100, 250, 500, 1000, 2500]) {
                if (up < step) return step
            }
            return (Math.floor(up / 1000) + 1) * 1000
        },
        milestonePercent() {
            return Math.min(100, Math.round((this.upvotes / this.milestoneTarget) * 100))
        },
        rawTimelinePoints() {
            if (!this.map) return []
            const latestUp = this.upvotes
            const latestDown = this.downvotes
            const d = this.deltas
            const earliest = this.map.earliest
            const now = new Date()

            let startDate = earliest?.first_recorded ? new Date(earliest.first_recorded) : null
            if (!startDate && this.map.uploaded) startDate = new Date(this.map.uploaded)

            const pts = []
            if (earliest && earliest.initial_upvotes !== undefined) {
                const up = earliest.initial_upvotes
                const down = earliest.initial_downvotes || 0
                const tot = up + down
                pts.push({
                    label: earliest.first_recorded ? this.formatShortDate(earliest.first_recorded) : 'Start',
                    valUp: up,
                    valDown: down,
                    ratio: tot > 0 ? Math.round((up / tot) * 1000) / 10 : 100,
                })
            } else {
                pts.push({ label: 'Start', valUp: 0, valDown: 0, ratio: 100 })
            }

            const intervals = [
                { label: '5y', days: 1800, key: 'd1800' },
                { label: '4y', days: 1440, key: 'd1440' },
                { label: '3y', days: 1080, key: 'd1080' },
                { label: '2y', days: 720, key: 'd720' },
                { label: '1y', days: 360, key: 'd360' },
                { label: '180d', days: 180, key: 'd180' },
                { label: '90d', days: 90, key: 'd90' },
                { label: '30d', days: 30, key: 'd30' },
                { label: '7d', days: 7, key: 'd7' },
                { label: '24h', days: 1, key: 'd1' },
            ]

            for (const item of intervals) {
                const pointTime = new Date(now.getTime() - item.days * 86400 * 1000)
                if (!startDate || pointTime > startDate) {
                    const delta = d[item.key]
                    if (delta && (delta.upvotes !== undefined || delta.downvotes !== undefined)) {
                        const up = Math.max(0, latestUp - delta.upvotes)
                        const down = Math.max(0, latestDown - delta.downvotes)
                        const tot = up + down
                        pts.push({
                            label: item.label,
                            valUp: up,
                            valDown: down,
                            ratio: tot > 0 ? Math.round((up / tot) * 1000) / 10 : this.approvalRatio,
                        })
                    }
                }
            }

            pts.push({ label: 'Now', valUp: latestUp, valDown: latestDown, ratio: this.approvalRatio })
            return pts
        },
        chartPoints() {
            const raw = this.rawTimelinePoints
            const maxVal = Math.max(1, ...raw.map((p) => Math.max(p.valUp, p.valDown)))
            const xLeft = 66
            const xRight = 975
            const yTop = 20
            const yBottom = 185
            const step = (xRight - xLeft) / Math.max(1, raw.length - 1)

            return raw.map((pt, i) => ({
                ...pt,
                x: Math.round(xLeft + i * step),
                yUp: Math.round(yBottom - (pt.valUp / maxVal) * (yBottom - yTop)),
                yDown: Math.round(yBottom - (pt.valDown / maxVal) * (yBottom - yTop)),
            }))
        },
        growthTicks() {
            const maxVal = Math.max(1, ...this.rawTimelinePoints.map((p) => Math.max(p.valUp, p.valDown)))
            const yTop = 20
            const yBottom = 185
            return [0, 0.5, 1].map((f) => ({
                val: Math.round(maxVal * f),
                y: Math.round(yBottom - f * (yBottom - yTop)),
            }))
        },
        upvotePolylinePoints() {
            return this.chartPoints.map((p) => `${p.x},${p.yUp}`).join(' ')
        },
        downvotePolylinePoints() {
            return this.chartPoints.map((p) => `${p.x},${p.yDown}`).join(' ')
        },
        upvoteAreaPoints() {
            if (!this.chartPoints.length) return ''
            return `${this.chartPoints[0].x},185 ${this.upvotePolylinePoints} ${this.chartPoints[this.chartPoints.length - 1].x},185`
        },
        ratioPoints() {
            const raw = this.rawTimelinePoints
            if (!raw.length) return []
            const minR = Math.max(0, Math.floor(Math.min(...raw.map((p) => p.ratio)) / 10) * 10 - 10)
            const maxR = 100
            const span = Math.max(10, maxR - minR)
            const xLeft = 66
            const xRight = 975
            const yTop = 20
            const yBottom = 185
            const step = (xRight - xLeft) / Math.max(1, raw.length - 1)

            return raw.map((pt, i) => ({
                ...pt,
                x: Math.round(xLeft + i * step),
                yRatio: Math.round(yBottom - ((pt.ratio - minR) / span) * (yBottom - yTop)),
            }))
        },
        ratioTicks() {
            const raw = this.rawTimelinePoints
            if (!raw.length) return []
            const minR = Math.max(0, Math.floor(Math.min(...raw.map((p) => p.ratio)) / 10) * 10 - 10)
            const midR = Math.round((minR + 100) / 2)
            return [
                { val: minR, y: 185 },
                { val: midR, y: 102 },
                { val: 100, y: 20 },
            ]
        },
        ratioPolylinePoints() {
            return this.ratioPoints.map((p) => `${p.x},${p.yRatio}`).join(' ')
        },
        ratioAreaPoints() {
            if (!this.ratioPoints.length) return ''
            return `${this.ratioPoints[0].x},185 ${this.ratioPolylinePoints} ${this.ratioPoints[this.ratioPoints.length - 1].x},185`
        },
        periodWindowList() {
            const d = this.deltas
            const earliest = this.map?.earliest
            const now = new Date()
            let startDate = earliest?.first_recorded ? new Date(earliest.first_recorded) : null
            if (!startDate && this.map?.uploaded) startDate = new Date(this.map.uploaded)

            const raw = [
                { label: '24h', days: 1, upvotes: d.d1.upvotes, downvotes: d.d1.downvotes },
                { label: '7d', days: 7, upvotes: d.d7.upvotes, downvotes: d.d7.downvotes },
                { label: '30d', days: 30, upvotes: d.d30.upvotes, downvotes: d.d30.downvotes },
                { label: '90d', days: 90, upvotes: d.d90.upvotes, downvotes: d.d90.downvotes },
                { label: '180d', days: 180, upvotes: d.d180.upvotes, downvotes: d.d180.downvotes },
                { label: '1y', days: 360, upvotes: d.d360.upvotes, downvotes: d.d360.downvotes },
                { label: '2y', days: 720, upvotes: d.d720.upvotes, downvotes: d.d720.downvotes },
                { label: '3y', days: 1080, upvotes: d.d1080.upvotes, downvotes: d.d1080.downvotes },
                { label: '4y', days: 1440, upvotes: d.d1440.upvotes, downvotes: d.d1440.downvotes },
                { label: '5y', days: 1800, upvotes: d.d1800.upvotes, downvotes: d.d1800.downvotes },
            ]

            return raw.filter((item) => {
                const pt = new Date(now.getTime() - item.days * 86400 * 1000)
                return !startDate || pt > startDate || item.days <= 30
            })
        },
        barChartData() {
            const list = this.periodWindowList
            const maxVal = Math.max(1, ...list.map((i) => Math.max(i.upvotes, i.downvotes)))
            return list.map((item) => ({
                ...item,
                upHeight: item.upvotes > 0 ? Math.max(4, Math.round((item.upvotes / maxVal) * 100)) : 2,
                downHeight: item.downvotes > 0 ? Math.max(4, Math.round((item.downvotes / maxVal) * 100)) : 2,
            }))
        },
        velocityChartData() {
            const items = this.periodWindowList.map((item) => {
                const rate = Math.round(((item.upvotes + item.downvotes) / item.days) * 10) / 10
                return { label: item.label, rate }
            })
            const maxRate = Math.max(0.1, ...items.map((i) => i.rate))
            return items.map((i) => ({
                ...i,
                height: i.rate > 0 ? Math.max(6, Math.round((i.rate / maxRate) * 100)) : 2,
            }))
        },
        breakdownRows() {
            const d = this.deltas
            const e = this.map?.earliest
            const calcRate = (up, down, days) => Math.round(((up + down) / Math.max(1, days)) * 10) / 10
            const calcRatio = (up, down) => (up + down > 0 ? Math.round((up / (up + down)) * 1000) / 10 : null)
            const make = (label, src, days, extra = {}) => ({
                label,
                upvotes: src.upvotes || 0,
                downvotes: src.downvotes || 0,
                net: (src.upvotes || 0) - (src.downvotes || 0),
                ratio: calcRatio(src.upvotes || 0, src.downvotes || 0),
                rate: calcRate(src.upvotes || 0, src.downvotes || 0, days),
                ...extra,
            })

            const trackedDays = e?.first_recorded
                ? Math.max(1, Math.round((Date.now() - new Date(e.first_recorded).getTime()) / 86400000))
                : 365
            const ageDays = this.map?.uploaded
                ? Math.max(1, Math.round((Date.now() - new Date(this.map.uploaded).getTime()) / 86400000))
                : 365

            return [
                make('24 Hours', d.d1, 1),
                make('7 Days', d.d7, 7),
                make('30 Days', d.d30, 30),
                make('90 Days', d.d90, 90),
                make('180 Days', d.d180, 180),
                make('1 Year', d.d360, 360),
                make('2 Years', d.d720, 720),
                make('3 Years', d.d1080, 1080),
                make('4 Years', d.d1440, 1440),
                make('5 Years', d.d1800, 1800),
                make(
                    e?.first_recorded ? `Since Tracked (${this.formatDate(e.first_recorded)})` : 'Since Tracked',
                    { upvotes: e?.upvotes || 0, downvotes: e?.downvotes || 0 },
                    trackedDays,
                    { isHighlight: true, tag: 'Tracked' }
                ),
                make(
                    'All Time',
                    { upvotes: this.upvotes, downvotes: this.downvotes },
                    ageDays,
                    { isHighlight: true, tag: 'Total' }
                ),
            ]
        },
    },
    methods: {
        formatDate(dateStr) {
            if (!dateStr) return '-'
            try {
                return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            } catch (e) {
                return dateStr
            }
        },
        formatShortDate(dateStr) {
            if (!dateStr) return '-'
            try {
                return new Date(dateStr).toLocaleDateString('en-US', { year: '2-digit', month: 'short' })
            } catch (e) {
                return dateStr
            }
        },
        formatDuration(sec) {
            if (!sec) return ''
            const m = Math.floor(sec / 60)
            const s = Math.round(sec % 60)
            return `${m}m ${s < 10 ? '0' : ''}${s}s`
        },
        formatCompact(n) {
            if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
            return String(n)
        },
        onImageError(e) {
            e.target.src = 'https://beatsaver.com/static/favicon/apple-touch-icon.png'
        },
    },
}
</script>
