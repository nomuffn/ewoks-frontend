<template>
    <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="loading && !maps.length" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-10 flex items-center justify-center gap-3 text-xs text-gray-400">
            <ProgressSpinner style="width: 22px; height: 22px" strokeWidth="4" />
            <span>Loading account analytics...</span>
        </div>

        <template v-else-if="maps && maps.length">
            <!-- Full-Width Account Vote History Card -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 class="text-sm font-semibold text-gray-100">Account Vote History</h3>
                        <p class="text-xs text-gray-500 mt-0.5">
                            {{ historySubtitle }}
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <div class="flex items-center bg-[#141417] p-1 rounded-lg border border-white/[0.06] text-xs">
                            <button
                                v-for="tab in historyTabs"
                                :key="tab.key"
                                @click="historyMode = tab.key; hoveredTimeline = null; hoveredBar = null"
                                :class="[
                                    'px-2.5 py-1 rounded-md font-medium transition-colors',
                                    historyMode === tab.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200',
                                ]"
                            >
                                {{ tab.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 1. Cumulative Account Timeline (Dual-Line SVG) -->
                <div v-if="historyMode === 'timeline'" class="space-y-3">
                    <div class="w-full relative aspect-[1000/240] max-h-[250px]">
                        <svg class="w-full h-full" viewBox="0 0 1000 240" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <linearGradient id="acctUpGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.22" />
                                    <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                                </linearGradient>
                                <linearGradient id="acctDownGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.14" />
                                    <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.0" />
                                </linearGradient>
                            </defs>

                            <!-- Horizontal Grid + Y Axis Labels -->
                            <g v-for="tick in timelineTicks" :key="tick.y">
                                <line x1="62" :y1="tick.y" x2="984" :y2="tick.y" stroke="#ffffff" stroke-opacity="0.07" stroke-dasharray="4 4" />
                                <text x="54" :y="tick.y + 4" text-anchor="end" fill="#6b7280" font-size="11" font-family="monospace">
                                    {{ formatCompact(tick.val) }}
                                </text>
                            </g>

                            <!-- Areas -->
                            <polygon :points="timelineUpArea" fill="url(#acctUpGrad)" />
                            <polygon :points="timelineDownArea" fill="url(#acctDownGrad)" />

                            <!-- Lines -->
                            <polyline
                                :points="timelineUpPolyline"
                                fill="none"
                                stroke="#10b981"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <polyline
                                :points="timelineDownPolyline"
                                fill="none"
                                stroke="#f43f5e"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-dasharray="5 3"
                            />

                            <!-- Hover Vertical Line -->
                            <line
                                v-if="hoveredTimeline"
                                :x1="hoveredTimeline.x"
                                y1="18"
                                :x2="hoveredTimeline.x"
                                y2="200"
                                stroke="#60a5fa"
                                stroke-dasharray="3 3"
                                stroke-width="1.25"
                            />

                            <!-- Points & Hit Targets -->
                            <g v-for="(pt, idx) in timelinePoints" :key="idx">
                                <circle
                                    v-if="hoveredTimeline && hoveredTimeline.label === pt.label"
                                    :cx="pt.x"
                                    :cy="pt.yUp"
                                    r="7.5"
                                    fill="#10b981"
                                    fill-opacity="0.25"
                                    stroke="#10b981"
                                    stroke-width="1.5"
                                />
                                <circle :cx="pt.x" :cy="pt.yUp" r="4" fill="#10b981" stroke="#1e2023" stroke-width="2" />
                                <circle :cx="pt.x" :cy="pt.yDown" r="3.5" fill="#f43f5e" stroke="#1e2023" stroke-width="1.5" />
                                <text :x="pt.x" y="224" text-anchor="middle" fill="#6b7280" font-size="11" font-family="monospace">
                                    {{ pt.shortLabel }}
                                </text>
                                <rect
                                    :x="pt.x - 36"
                                    y="14"
                                    width="72"
                                    height="210"
                                    fill="transparent"
                                    class="cursor-pointer"
                                    @mouseenter="hoveredTimeline = pt"
                                    @mouseleave="hoveredTimeline = null"
                                />
                            </g>
                        </svg>
                    </div>

                    <!-- Legend & Hover Readout -->
                    <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/[0.06] text-xs">
                        <div class="flex items-center gap-5 text-gray-400">
                            <span class="flex items-center gap-1.5">
                                <span class="w-3 h-0.5 bg-emerald-500 rounded"></span> Cumulative Upvotes
                            </span>
                            <span class="flex items-center gap-1.5">
                                <span class="w-3 h-0.5 bg-rose-500 rounded"></span> Cumulative Downvotes
                            </span>
                        </div>

                        <div v-if="hoveredTimeline" class="flex flex-wrap items-center gap-3 font-mono text-gray-300">
                            <span class="text-gray-400 font-sans">{{ hoveredTimeline.label }}:</span>
                            <span class="text-emerald-400 font-semibold">+{{ hoveredTimeline.up.toLocaleString() }}</span>
                            <span class="text-rose-400 font-semibold">-{{ hoveredTimeline.down.toLocaleString() }}</span>
                            <span class="text-gray-500">·</span>
                            <span>Net {{ (hoveredTimeline.up - hoveredTimeline.down).toLocaleString() }}</span>
                            <span class="text-gray-500">·</span>
                            <span>{{ hoveredTimeline.ratio }}%</span>
                        </div>
                        <span v-else class="text-gray-500">Hover any point for exact totals</span>
                    </div>
                </div>

                <!-- 2. Period Gains OR Interval Slices Bar Chart -->
                <div v-else-if="historyMode === 'periods' || historyMode === 'slices'" class="space-y-3">
                    <div class="h-52 w-full flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-1 px-1 border-b border-white/[0.06]">
                        <div
                            v-for="bar in activePeriodBars"
                            :key="bar.label"
                            class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                            @mouseenter="hoveredBar = bar"
                            @mouseleave="hoveredBar = null"
                        >
                            <div class="text-[11px] font-mono text-gray-400 group-hover:text-gray-100 mb-1.5 transition-colors whitespace-nowrap">
                                +{{ formatCompact(bar.upvotes) }}
                            </div>
                            <div class="w-full max-w-[44px] flex items-end justify-center gap-1 h-32">
                                <div
                                    class="w-1/2 bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition-colors"
                                    :style="{ height: `${bar.upHeight}%` }"
                                ></div>
                                <div
                                    class="w-1/2 bg-rose-500/80 group-hover:bg-rose-400 rounded-t transition-colors"
                                    :style="{ height: `${bar.downHeight}%` }"
                                ></div>
                            </div>
                            <span class="text-[11px] font-mono text-gray-400 mt-2 whitespace-nowrap">{{ bar.label }}</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div class="flex items-center gap-5 text-gray-400">
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Upvotes
                            </span>
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Downvotes
                            </span>
                        </div>

                        <div v-if="hoveredBar" class="flex flex-wrap items-center gap-3 font-mono text-gray-300">
                            <span class="text-gray-400 font-sans">{{ hoveredBar.fullLabel }}:</span>
                            <span class="text-emerald-400 font-semibold">+{{ hoveredBar.upvotes.toLocaleString() }}</span>
                            <span class="text-rose-400 font-semibold">-{{ hoveredBar.downvotes.toLocaleString() }}</span>
                            <span class="text-gray-500">·</span>
                            <span>Net {{ hoveredBar.net >= 0 ? '+' : '' }}{{ hoveredBar.net.toLocaleString() }}</span>
                            <span class="text-gray-500">·</span>
                            <span>{{ hoveredBar.ratio }}%</span>
                        </div>
                        <span v-else class="text-gray-500">Hover a bar to inspect period totals</span>
                    </div>
                </div>

                <!-- 3. Daily Velocity Across Date Ranges -->
                <div v-else class="space-y-3">
                    <div class="h-52 w-full flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-1 px-1 border-b border-white/[0.06]">
                        <div
                            v-for="v in velocityBars"
                            :key="v.label"
                            class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                            @mouseenter="hoveredBar = v"
                            @mouseleave="hoveredBar = null"
                        >
                            <div class="text-[11px] font-mono text-gray-300 group-hover:text-white mb-1.5 transition-colors whitespace-nowrap">
                                {{ v.rate }}/d
                            </div>
                            <div class="w-full max-w-[38px] flex items-end justify-center h-32">
                                <div
                                    class="w-full bg-blue-500/80 group-hover:bg-blue-400 rounded-t transition-colors"
                                    :style="{ height: `${v.height}%` }"
                                ></div>
                            </div>
                            <span class="text-[11px] font-mono text-gray-400 mt-2 whitespace-nowrap">{{ v.label }}</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span class="flex items-center gap-1.5 text-gray-400">
                            <span class="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Average votes gained per day
                        </span>
                        <div v-if="hoveredBar" class="flex flex-wrap items-center gap-3 font-mono text-gray-300">
                            <span class="text-gray-400 font-sans">Last {{ hoveredBar.label }}:</span>
                            <span class="text-blue-400 font-semibold">+{{ hoveredBar.rate }}/day</span>
                            <span class="text-gray-500">·</span>
                            <span class="text-emerald-400">+{{ hoveredBar.upRate }}/d up</span>
                            <span class="text-rose-400">-{{ hoveredBar.downRate }}/d down</span>
                        </div>
                        <span v-else class="text-gray-500">Hover a bar for daily breakdown</span>
                    </div>
                </div>
            </div>

            <!-- 2x2 Account Distribution & Breakdown Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Card 1: Activity by Release Year -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 flex flex-col justify-between space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-100">Catalog by Release Year</h3>
                            <p class="text-xs text-gray-500">
                                {{ yearMetric === 'maps' ? 'Maps uploaded per year' : yearMetric === 'upvotes' ? 'Total upvotes earned by release year' : 'Average approval % by release year' }}
                            </p>
                        </div>
                        <div class="flex items-center bg-[#141417] p-0.5 rounded-md border border-white/[0.06] text-[11px]">
                            <button
                                @click="yearMetric = 'maps'"
                                :class="yearMetric === 'maps' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Maps
                            </button>
                            <button
                                @click="yearMetric = 'upvotes'"
                                :class="yearMetric === 'upvotes' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Upvotes
                            </button>
                            <button
                                @click="yearMetric = 'ratio'"
                                :class="yearMetric === 'ratio' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Approval
                            </button>
                        </div>
                    </div>

                    <div class="h-44 flex items-end justify-between gap-2 pt-4 pb-1 border-b border-white/[0.06]">
                        <div
                            v-for="yr in yearlyStats"
                            :key="yr.year"
                            class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                            @mouseenter="hoveredYear = yr"
                            @mouseleave="hoveredYear = null"
                        >
                            <span class="text-[11px] font-mono text-gray-400 group-hover:text-white mb-1 whitespace-nowrap">
                                {{ yearMetric === 'maps' ? yr.count : yearMetric === 'upvotes' ? formatCompact(yr.upvotes) : yr.ratio + '%' }}
                            </span>
                            <div class="w-full max-w-[34px] flex items-end justify-center h-28">
                                <div
                                    :class="[
                                        'w-full rounded-t transition-colors',
                                        yearMetric === 'upvotes'
                                            ? 'bg-emerald-500/80 group-hover:bg-emerald-400'
                                            : 'bg-blue-500/80 group-hover:bg-blue-400',
                                    ]"
                                    :style="{ height: `${yr.height}%` }"
                                ></div>
                            </div>
                            <span class="text-[11px] font-mono text-gray-400 mt-1.5">{{ yr.year }}</span>
                        </div>
                    </div>

                    <div class="text-xs text-gray-400 font-mono min-h-[18px]">
                        <template v-if="hoveredYear">
                            <span class="text-gray-200 font-semibold">{{ hoveredYear.year }}:</span>
                            {{ hoveredYear.count }} {{ hoveredYear.count === 1 ? 'map' : 'maps' }}
                            · <span class="text-emerald-400">+{{ hoveredYear.upvotes.toLocaleString() }}</span>
                            · {{ hoveredYear.ratio }}% avg
                            <span v-if="hoveredYear.avgStar">· ★ {{ hoveredYear.avgStar }}</span>
                        </template>
                        <span v-else class="text-gray-500 font-sans">Hover a year for release details</span>
                    </div>
                </div>

                <!-- Card 2: Top Movers by Date Range -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 flex flex-col justify-between space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-100">Top Movers</h3>
                            <p class="text-xs text-gray-500">Most active maps in the selected window</p>
                        </div>
                        <div class="flex items-center bg-[#141417] p-0.5 rounded-md border border-white/[0.06] text-[11px]">
                            <button
                                v-for="r in moverRanges"
                                :key="r.key"
                                @click="moverRange = r.key"
                                :class="moverRange === r.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-mono font-medium transition-colors"
                            >
                                {{ r.label }}
                            </button>
                        </div>
                    </div>

                    <div v-if="!topMovers.length" class="py-12 text-center text-xs text-gray-500">
                        No vote changes recorded in this window.
                    </div>

                    <div v-else class="space-y-2.5 flex-1">
                        <div
                            v-for="(item, idx) in topMovers"
                            :key="item.map.key || item.map.hash || idx"
                            @click="$emit('select-map', item.map)"
                            class="group cursor-pointer space-y-1"
                        >
                            <div class="flex items-center justify-between gap-3 text-xs">
                                <div class="flex items-center gap-2 min-w-0">
                                    <span class="font-mono text-gray-500 w-4 shrink-0">{{ idx + 1 }}.</span>
                                    <span class="text-gray-200 group-hover:text-blue-400 font-medium truncate transition-colors" :title="item.map.songName">
                                        {{ item.map.songName }}
                                    </span>
                                </div>
                                <div class="font-mono shrink-0 flex items-center gap-1.5">
                                    <span class="text-emerald-400 font-semibold">+{{ item.upvotes }}</span>
                                    <span v-if="item.downvotes > 0" class="text-rose-400">-{{ item.downvotes }}</span>
                                </div>
                            </div>
                            <div class="w-full bg-[#141417] h-1.5 rounded-full overflow-hidden">
                                <div
                                    class="h-full bg-emerald-500/75 group-hover:bg-emerald-400 rounded-full transition-all duration-300"
                                    :style="{ width: `${item.width}%` }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Catalog Distributions (Stars / BPM / Approval) -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 flex flex-col justify-between space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-100">Catalog Distribution</h3>
                            <p class="text-xs text-gray-500">Spread across all {{ maps.length }} tracked maps</p>
                        </div>
                        <div class="flex items-center bg-[#141417] p-0.5 rounded-md border border-white/[0.06] text-[11px]">
                            <button
                                @click="distMode = 'stars'"
                                :class="distMode === 'stars' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Stars
                            </button>
                            <button
                                @click="distMode = 'bpm'"
                                :class="distMode === 'bpm' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                BPM
                            </button>
                            <button
                                @click="distMode = 'ratio'"
                                :class="distMode === 'ratio' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Approval
                            </button>
                        </div>
                    </div>

                    <div class="h-44 flex items-end justify-between gap-2 pt-4 pb-1 border-b border-white/[0.06]">
                        <div
                            v-for="bucket in activeDistribution"
                            :key="bucket.label"
                            class="flex-1 flex flex-col items-center h-full justify-end group"
                        >
                            <span class="text-[11px] font-mono text-gray-400 group-hover:text-white mb-1">
                                {{ bucket.count }}
                            </span>
                            <div class="w-full max-w-[40px] flex items-end justify-center h-28">
                                <div
                                    :class="[
                                        'w-full rounded-t transition-colors',
                                        distMode === 'stars'
                                            ? 'bg-amber-500/80 group-hover:bg-amber-400'
                                            : distMode === 'ratio'
                                            ? 'bg-emerald-500/80 group-hover:bg-emerald-400'
                                            : 'bg-blue-500/80 group-hover:bg-blue-400',
                                    ]"
                                    :style="{ height: `${bucket.height}%` }"
                                    :title="`${bucket.label}: ${bucket.count} maps (${bucket.pct}%)`"
                                ></div>
                            </div>
                            <span class="text-[11px] font-mono text-gray-400 mt-1.5 text-center truncate max-w-full">
                                {{ bucket.label }}
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-xs text-gray-500 font-mono">
                        <template v-if="distMode === 'stars'">
                            <span>Ranked/Starred: {{ starredSummary.count }} ({{ starredSummary.pct }}%)</span>
                            <span>Avg ★ {{ starredSummary.avg }}</span>
                        </template>
                        <template v-else-if="distMode === 'bpm'">
                            <span>Median {{ bpmSummary.median }} BPM</span>
                            <span>Range {{ bpmSummary.min }}–{{ bpmSummary.max }} BPM</span>
                        </template>
                        <template v-else>
                            <span>Median {{ ratioSummary.median }}%</span>
                            <span>{{ ratioSummary.above90 }} maps ≥ 90%</span>
                        </template>
                    </div>
                </div>

                <!-- Card 4: Artists, Collabs & Diff Breakdown -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5 flex flex-col justify-between space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-100">Catalog Breakdown</h3>
                            <p class="text-xs text-gray-500">
                                {{ breakdownTab === 'artists' ? 'Most frequently mapped song artists' : breakdownTab === 'diffs' ? 'Difficulty tiers & mod requirements' : 'Solo releases vs collaborations' }}
                            </p>
                        </div>
                        <div class="flex items-center bg-[#141417] p-0.5 rounded-md border border-white/[0.06] text-[11px]">
                            <button
                                @click="breakdownTab = 'artists'"
                                :class="breakdownTab === 'artists' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Artists
                            </button>
                            <button
                                @click="breakdownTab = 'diffs'"
                                :class="breakdownTab === 'diffs' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Diffs &amp; Mods
                            </button>
                            <button
                                @click="breakdownTab = 'collabs'"
                                :class="breakdownTab === 'collabs' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'"
                                class="px-2 py-1 rounded font-medium transition-colors"
                            >
                                Collabs
                            </button>
                        </div>
                    </div>

                    <!-- Top Artists -->
                    <div v-if="breakdownTab === 'artists'" class="space-y-2.5 flex-1">
                        <div v-for="artist in topArtists" :key="artist.name" class="space-y-1">
                            <div class="flex items-center justify-between gap-2 text-xs">
                                <span class="text-gray-200 font-medium truncate" :title="artist.name">{{ artist.name }}</span>
                                <span class="font-mono text-gray-400 shrink-0">
                                    {{ artist.count }} {{ artist.count === 1 ? 'map' : 'maps' }}
                                    <span class="text-emerald-400 ml-1.5">+{{ artist.upvotes.toLocaleString() }}</span>
                                </span>
                            </div>
                            <div class="w-full bg-[#141417] h-1.5 rounded-full overflow-hidden">
                                <div class="h-full bg-blue-500/80 rounded-full" :style="{ width: `${artist.width}%` }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Diffs & Mods -->
                    <div v-else-if="breakdownTab === 'diffs'" class="space-y-4 flex-1">
                        <div class="space-y-2">
                            <div v-for="d in diffBreakdown.tiers" :key="d.name" class="flex items-center gap-3 text-xs">
                                <span class="w-16 text-gray-300 font-mono shrink-0">{{ d.name }}</span>
                                <div class="flex-1 bg-[#141417] h-2 rounded-full overflow-hidden">
                                    <div class="h-full bg-blue-500/80 rounded-full" :style="{ width: `${d.width}%` }"></div>
                                </div>
                                <span class="w-10 text-right font-mono text-gray-400 shrink-0">{{ d.count }}</span>
                            </div>
                        </div>
                        <div class="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                            <span>Total diffs: <strong class="font-mono text-gray-200">{{ diffBreakdown.totalDiffs }}</strong></span>
                            <span>Total notes: <strong class="font-mono text-gray-200">{{ formatCompact(diffBreakdown.totalNotes) }}</strong></span>
                            <span v-for="req in diffBreakdown.reqs" :key="req.name">
                                {{ req.name }}: <strong class="font-mono text-gray-200">{{ req.count }}</strong>
                            </span>
                        </div>
                    </div>

                    <!-- Collabs -->
                    <div v-else class="space-y-4 flex-1">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-gray-300">Solo ({{ collabStats.soloCount }} maps · {{ collabStats.soloPct }}%)</span>
                                <span class="text-gray-300">Collab ({{ collabStats.collabCount }} maps · {{ collabStats.collabPct }}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-[#141417] rounded-full overflow-hidden flex">
                                <div class="h-full bg-blue-500" :style="{ width: `${collabStats.soloPct}%` }"></div>
                                <div class="h-full bg-emerald-500" :style="{ width: `${collabStats.collabPct}%` }"></div>
                            </div>
                            <div class="flex items-center justify-between text-[11px] font-mono text-gray-500">
                                <span>Avg {{ collabStats.soloAvgUp }} up/map</span>
                                <span>Avg {{ collabStats.collabAvgUp }} up/map</span>
                            </div>
                        </div>

                        <div v-if="collabStats.topPartners.length" class="pt-2 border-t border-white/[0.06] space-y-1.5">
                            <span class="text-[11px] text-gray-500 block">Frequent collaborators</span>
                            <div class="flex flex-wrap gap-1.5">
                                <span
                                    v-for="p in collabStats.topPartners"
                                    :key="p.name"
                                    class="px-2 py-0.5 bg-[#141417] border border-white/[0.06] rounded text-xs text-gray-300"
                                >
                                    {{ p.name }} <span class="font-mono text-gray-500 ml-0.5">{{ p.count }}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
const ALL_RANGES = [
    { key: 'days-1', label: '24h', fullLabel: 'Last 24 hours', days: 1 },
    { key: 'days-7', label: '7d', fullLabel: 'Last 7 days', days: 7 },
    { key: 'days-30', label: '30d', fullLabel: 'Last 30 days', days: 30 },
    { key: 'days-90', label: '90d', fullLabel: 'Last 90 days', days: 90 },
    { key: 'days-180', label: '180d', fullLabel: 'Last 180 days', days: 180 },
    { key: 'days-360', label: '1y', fullLabel: 'Last 1 year', days: 360 },
    { key: 'days-720', label: '2y', fullLabel: 'Last 2 years', days: 720 },
    { key: 'days-1080', label: '3y', fullLabel: 'Last 3 years', days: 1080 },
    { key: 'days-1440', label: '4y', fullLabel: 'Last 4 years', days: 1440 },
    { key: 'days-1800', label: '5y', fullLabel: 'Last 5 years', days: 1800 },
]

export default {
    props: {
        maps: { type: Array, default: () => [] },
        insights: { type: Object, default: null },
        loading: { type: Boolean, default: false },
    },
    data() {
        return {
            historyMode: 'timeline',
            historyTabs: [
                { key: 'timeline', label: 'Cumulative' },
                { key: 'periods', label: 'Period Totals' },
                { key: 'slices', label: 'Interval Slices' },
                { key: 'velocity', label: 'Votes / Day' },
            ],
            hoveredTimeline: null,
            hoveredBar: null,
            yearMetric: 'maps',
            hoveredYear: null,
            moverRange: 'days-30',
            moverRanges: [
                { key: 'days-1', label: '24h' },
                { key: 'days-7', label: '7d' },
                { key: 'days-30', label: '30d' },
                { key: 'days-90', label: '90d' },
                { key: 'days-360', label: '1y' },
                { key: 'days-1080', label: '3y' },
            ],
            distMode: 'stars',
            breakdownTab: 'artists',
        }
    },
    computed: {
        historySubtitle() {
            if (this.historyMode === 'timeline') return 'Total account upvotes & downvotes reconstructed across all known date ranges'
            if (this.historyMode === 'periods') return 'Total votes gained across the entire account in each lookback window'
            if (this.historyMode === 'slices') return 'Votes earned inside each discrete time slice (non-overlapping)'
            return 'Average daily vote rate across the whole account for each timeframe'
        },
        availableRanges() {
            if (!this.maps.length) return ALL_RANGES.slice(0, 6)
            return ALL_RANGES.filter((r) => this.maps.some((m) => m[r.key] !== undefined && m[r.key] !== null))
        },
        periodAggregates() {
            return this.availableRanges.map((r) => {
                let upvotes = 0
                let downvotes = 0
                for (const m of this.maps) {
                    const d = m[r.key]
                    if (d) {
                        upvotes += d.upvotes || 0
                        downvotes += d.downvotes || 0
                    }
                }
                const total = upvotes + downvotes
                const ratio = total > 0 ? Math.round((upvotes / total) * 1000) / 10 : 0
                return {
                    ...r,
                    upvotes,
                    downvotes,
                    net: upvotes - downvotes,
                    total,
                    ratio,
                }
            })
        },
        timelinePoints() {
            if (!this.maps.length) return []
            let totalUp = 0
            let totalDown = 0
            for (const m of this.maps) {
                totalUp += m.latest?.upvotes ?? m.upvotes ?? 0
                totalDown += m.latest?.downvotes ?? m.downvotes ?? 0
            }

            const raw = []
            const oldestFirst = [...this.periodAggregates].reverse()
            for (const p of oldestFirst) {
                let up = 0
                let down = 0
                for (const m of this.maps) {
                    const curUp = m.latest?.upvotes ?? m.upvotes ?? 0
                    const curDown = m.latest?.downvotes ?? m.downvotes ?? 0
                    const delta = m[p.key]
                    up += Math.max(0, curUp - (delta?.upvotes || 0))
                    down += Math.max(0, curDown - (delta?.downvotes || 0))
                }
                const tot = up + down
                raw.push({
                    label: `${p.label} ago`,
                    shortLabel: p.label,
                    up,
                    down,
                    ratio: tot > 0 ? Math.round((up / tot) * 1000) / 10 : 0,
                })
            }

            const totNow = totalUp + totalDown
            raw.push({
                label: 'Now',
                shortLabel: 'Now',
                up: totalUp,
                down: totalDown,
                ratio: totNow > 0 ? Math.round((totalUp / totNow) * 1000) / 10 : 0,
            })

            const maxVal = Math.max(1, ...raw.map((p) => Math.max(p.up, p.down)))
            const xLeft = 72
            const xRight = 974
            const yTop = 20
            const yBottom = 200
            const step = (xRight - xLeft) / Math.max(1, raw.length - 1)

            return raw.map((pt, i) => ({
                ...pt,
                x: Math.round(xLeft + i * step),
                yUp: Math.round(yBottom - (pt.up / maxVal) * (yBottom - yTop)),
                yDown: Math.round(yBottom - (pt.down / maxVal) * (yBottom - yTop)),
            }))
        },
        timelineTicks() {
            const maxVal = Math.max(1, ...this.timelinePoints.map((p) => Math.max(p.up, p.down)))
            const yTop = 20
            const yBottom = 200
            return [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
                val: Math.round(maxVal * frac),
                y: Math.round(yBottom - frac * (yBottom - yTop)),
            }))
        },
        timelineUpPolyline() {
            return this.timelinePoints.map((p) => `${p.x},${p.yUp}`).join(' ')
        },
        timelineDownPolyline() {
            return this.timelinePoints.map((p) => `${p.x},${p.yDown}`).join(' ')
        },
        timelineUpArea() {
            if (!this.timelinePoints.length) return ''
            const first = this.timelinePoints[0].x
            const last = this.timelinePoints[this.timelinePoints.length - 1].x
            return `${first},200 ${this.timelineUpPolyline} ${last},200`
        },
        timelineDownArea() {
            if (!this.timelinePoints.length) return ''
            const first = this.timelinePoints[0].x
            const last = this.timelinePoints[this.timelinePoints.length - 1].x
            return `${first},200 ${this.timelineDownPolyline} ${last},200`
        },
        activePeriodBars() {
            const list =
                this.historyMode === 'slices'
                    ? this.periodAggregates.map((p, i) => {
                          const prev = i > 0 ? this.periodAggregates[i - 1] : null
                          const upvotes = prev ? Math.max(0, p.upvotes - prev.upvotes) : p.upvotes
                          const downvotes = prev ? Math.max(0, p.downvotes - prev.downvotes) : p.downvotes
                          const tot = upvotes + downvotes
                          return {
                              label: prev ? `${prev.label}–${p.label}` : `0–${p.label}`,
                              fullLabel: prev ? `${prev.label} to ${p.label} ago` : `Last ${p.label}`,
                              upvotes,
                              downvotes,
                              net: upvotes - downvotes,
                              ratio: tot > 0 ? Math.round((upvotes / tot) * 1000) / 10 : 0,
                          }
                      })
                    : this.periodAggregates

            const maxVal = Math.max(1, ...list.map((i) => Math.max(i.upvotes, i.downvotes)))
            return list.map((item) => ({
                ...item,
                upHeight: item.upvotes > 0 ? Math.max(4, Math.round((item.upvotes / maxVal) * 100)) : 2,
                downHeight: item.downvotes > 0 ? Math.max(4, Math.round((item.downvotes / maxVal) * 100)) : 2,
            }))
        },
        velocityBars() {
            const items = this.periodAggregates.map((p) => {
                const rate = Math.round(((p.upvotes + p.downvotes) / p.days) * 10) / 10
                const upRate = Math.round((p.upvotes / p.days) * 10) / 10
                const downRate = Math.round((p.downvotes / p.days) * 10) / 10
                return { label: p.label, rate, upRate, downRate }
            })
            const maxRate = Math.max(0.1, ...items.map((i) => i.rate))
            return items.map((i) => ({
                ...i,
                height: i.rate > 0 ? Math.max(5, Math.round((i.rate / maxRate) * 100)) : 2,
            }))
        },
        yearlyStats() {
            const byYear = {}
            for (const m of this.maps) {
                if (!m.uploaded) continue
                const y = new Date(m.uploaded).getFullYear()
                if (isNaN(y)) continue
                if (!byYear[y]) {
                    byYear[y] = { year: y, count: 0, upvotes: 0, downvotes: 0, starSum: 0, starCount: 0 }
                }
                const up = m.latest?.upvotes ?? m.upvotes ?? 0
                const down = m.latest?.downvotes ?? m.downvotes ?? 0
                byYear[y].count++
                byYear[y].upvotes += up
                byYear[y].downvotes += down
                if (m.highestStar && m.highestStar > 0) {
                    byYear[y].starSum += m.highestStar
                    byYear[y].starCount++
                }
            }

            const years = Object.values(byYear).sort((a, b) => a.year - b.year)
            const enriched = years.map((yr) => {
                const tot = yr.upvotes + yr.downvotes
                return {
                    ...yr,
                    ratio: tot > 0 ? Math.round((yr.upvotes / tot) * 1000) / 10 : 0,
                    avgStar: yr.starCount > 0 ? (yr.starSum / yr.starCount).toFixed(1) : null,
                }
            })

            const maxVal = Math.max(
                1,
                ...enriched.map((y) => (this.yearMetric === 'maps' ? y.count : this.yearMetric === 'upvotes' ? y.upvotes : 100))
            )

            return enriched.map((y) => {
                const val = this.yearMetric === 'maps' ? y.count : this.yearMetric === 'upvotes' ? y.upvotes : y.ratio
                return {
                    ...y,
                    height: val > 0 ? Math.max(6, Math.round((val / maxVal) * 100)) : 2,
                }
            })
        },
        topMovers() {
            const key = this.moverRange
            const items = this.maps
                .map((m) => {
                    const d = m[key] || { upvotes: 0, downvotes: 0 }
                    const upvotes = d.upvotes || 0
                    const downvotes = d.downvotes || 0
                    return { map: m, upvotes, downvotes, total: upvotes + downvotes }
                })
                .filter((x) => x.total > 0)
                .sort((a, b) => b.upvotes - a.upvotes || b.total - a.total)
                .slice(0, 6)

            const maxUp = Math.max(1, ...items.map((i) => i.upvotes || i.total))
            return items.map((i) => ({
                ...i,
                width: Math.max(6, Math.round(((i.upvotes || i.total) / maxUp) * 100)),
            }))
        },
        activeDistribution() {
            let buckets = []
            if (this.distMode === 'stars') {
                buckets = [
                    { label: 'Unranked', match: (m) => !m.highestStar || m.highestStar <= 0 },
                    { label: '<5★', match: (m) => m.highestStar > 0 && m.highestStar < 5 },
                    { label: '5–7★', match: (m) => m.highestStar >= 5 && m.highestStar < 7 },
                    { label: '7–9★', match: (m) => m.highestStar >= 7 && m.highestStar < 9 },
                    { label: '9–11★', match: (m) => m.highestStar >= 9 && m.highestStar < 11 },
                    { label: '11★+', match: (m) => m.highestStar >= 11 },
                ]
            } else if (this.distMode === 'bpm') {
                buckets = [
                    { label: '<120', match: (m) => m.bpm > 0 && m.bpm < 120 },
                    { label: '120–150', match: (m) => m.bpm >= 120 && m.bpm < 150 },
                    { label: '150–180', match: (m) => m.bpm >= 150 && m.bpm < 180 },
                    { label: '180–210', match: (m) => m.bpm >= 180 && m.bpm < 210 },
                    { label: '210–250', match: (m) => m.bpm >= 210 && m.bpm < 250 },
                    { label: '250+', match: (m) => m.bpm >= 250 },
                ]
            } else {
                const getRatio = (m) => {
                    const up = m.latest?.upvotes ?? m.upvotes ?? 0
                    const down = m.latest?.downvotes ?? m.downvotes ?? 0
                    return up + down > 0 ? (up / (up + down)) * 100 : 0
                }
                buckets = [
                    { label: '<65%', match: (m) => getRatio(m) < 65 },
                    { label: '65–75%', match: (m) => getRatio(m) >= 65 && getRatio(m) < 75 },
                    { label: '75–85%', match: (m) => getRatio(m) >= 75 && getRatio(m) < 85 },
                    { label: '85–92%', match: (m) => getRatio(m) >= 85 && getRatio(m) < 92 },
                    { label: '92–97%', match: (m) => getRatio(m) >= 92 && getRatio(m) < 97 },
                    { label: '97–100%', match: (m) => getRatio(m) >= 97 },
                ]
            }

            const counts = buckets.map((b) => {
                const count = this.maps.filter(b.match).length
                return {
                    label: b.label,
                    count,
                    pct: this.maps.length ? Math.round((count / this.maps.length) * 100) : 0,
                }
            })
            const max = Math.max(1, ...counts.map((c) => c.count))
            return counts.map((c) => ({
                ...c,
                height: c.count > 0 ? Math.max(6, Math.round((c.count / max) * 100)) : 2,
            }))
        },
        starredSummary() {
            const starred = this.maps.filter((m) => m.highestStar && m.highestStar > 0)
            const avg = starred.length
                ? (starred.reduce((s, m) => s + m.highestStar, 0) / starred.length).toFixed(2)
                : '-'
            return {
                count: starred.length,
                pct: this.maps.length ? Math.round((starred.length / this.maps.length) * 100) : 0,
                avg,
            }
        },
        bpmSummary() {
            const bpms = this.maps.map((m) => Math.round(m.bpm || 0)).filter((v) => v > 0).sort((a, b) => a - b)
            if (!bpms.length) return { median: '-', min: '-', max: '-' }
            const mid = Math.floor(bpms.length / 2)
            return {
                median: bpms[mid],
                min: bpms[0],
                max: bpms[bpms.length - 1],
            }
        },
        ratioSummary() {
            const ratios = this.maps
                .map((m) => {
                    const up = m.latest?.upvotes ?? m.upvotes ?? 0
                    const down = m.latest?.downvotes ?? m.downvotes ?? 0
                    return up + down > 0 ? (up / (up + down)) * 100 : 0
                })
                .sort((a, b) => a - b)
            if (!ratios.length) return { median: 0, above90: 0 }
            return {
                median: ratios[Math.floor(ratios.length / 2)].toFixed(1),
                above90: ratios.filter((r) => r >= 90).length,
            }
        },
        topArtists() {
            const map = {}
            for (const m of this.maps) {
                const name = (m.songAuthorName || 'Unknown').trim() || 'Unknown'
                if (!map[name]) map[name] = { name, count: 0, upvotes: 0 }
                map[name].count++
                map[name].upvotes += m.latest?.upvotes ?? m.upvotes ?? 0
            }
            const list = Object.values(map)
                .sort((a, b) => b.count - a.count || b.upvotes - a.upvotes)
                .slice(0, 6)
            const max = Math.max(1, ...list.map((a) => a.count))
            return list.map((a) => ({ ...a, width: Math.max(8, Math.round((a.count / max) * 100)) }))
        },
        diffBreakdown() {
            const order = ['Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus']
            const tierCounts = { Easy: 0, Normal: 0, Hard: 0, Expert: 0, ExpertPlus: 0 }
            const reqCounts = {}
            let totalDiffs = 0
            let totalNotes = 0

            for (const m of this.maps) {
                let diffs = []
                if (Array.isArray(m.diffs)) {
                    diffs = m.diffs
                } else if (typeof m.diffs === 'string' && m.diffs.trim()) {
                    try {
                        diffs = JSON.parse(m.diffs)
                    } catch (e) {
                        diffs = []
                    }
                }
                const seenReqs = new Set()
                for (const d of diffs) {
                    totalDiffs++
                    totalNotes += Number(d.Notes || 0)
                    if (tierCounts[d.Diff] !== undefined) tierCounts[d.Diff]++
                    if (Array.isArray(d.Requirements)) {
                        for (const r of d.Requirements) {
                            if (r) seenReqs.add(r)
                        }
                    }
                }
                for (const r of seenReqs) {
                    reqCounts[r] = (reqCounts[r] || 0) + 1
                }
            }

            const maxTier = Math.max(1, ...Object.values(tierCounts))
            const tiers = order.map((name) => ({
                name: name === 'ExpertPlus' ? 'Expert+' : name,
                count: tierCounts[name],
                width: tierCounts[name] > 0 ? Math.max(4, Math.round((tierCounts[name] / maxTier) * 100)) : 0,
            }))

            const reqs = Object.entries(reqCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 4)

            return { tiers, totalDiffs, totalNotes, reqs }
        },
        collabStats() {
            const mapperLower = (this.insights?.mapperName || '').toLowerCase()
            let soloCount = 0
            let collabCount = 0
            let soloUp = 0
            let collabUp = 0
            const partners = {}

            for (const m of this.maps) {
                const author = (m.levelAuthorName || '').trim()
                const up = m.latest?.upvotes ?? m.upvotes ?? 0
                const isCollab = /[&+,]| x | ft\.| feat\./i.test(author) || (mapperLower && author && !author.toLowerCase().includes(mapperLower))
                if (isCollab) {
                    collabCount++
                    collabUp += up
                    const parts = author.split(/\s*(?:&|,|\+| x | and )\s*/i).map((s) => s.trim()).filter(Boolean)
                    for (const p of parts) {
                        if (mapperLower && p.toLowerCase() === mapperLower) continue
                        partners[p] = (partners[p] || 0) + 1
                    }
                } else {
                    soloCount++
                    soloUp += up
                }
            }

            const total = Math.max(1, soloCount + collabCount)
            const topPartners = Object.entries(partners)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)

            return {
                soloCount,
                collabCount,
                soloPct: Math.round((soloCount / total) * 100),
                collabPct: Math.round((collabCount / total) * 100),
                soloAvgUp: soloCount ? Math.round(soloUp / soloCount) : 0,
                collabAvgUp: collabCount ? Math.round(collabUp / collabCount) : 0,
                topPartners,
            }
        },
    },
    methods: {
        formatCompact(n) {
            if (n === null || n === undefined) return '0'
            const abs = Math.abs(n)
            if (abs >= 1000000) return (n / 1000000).toFixed(1) + 'M'
            if (abs >= 1000) return (n / 1000).toFixed(1) + 'k'
            return String(n)
        },
    },
}
</script>
