<template>
    <div class="bsst pb-12">
        <sub-header title="Beatsaver Stats Tracker">
            <p>
                Tracks upvote and downvote changes for maps over time since earliest recorded database stats.
                <br />
                Click any map row to view historical charts and timeframe breakdowns.
            </p>
        </sub-header>

        <div class="w-full px-4 sm:px-8 mt-6">
            <!-- Controls Bar -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-3.5 mb-5 flex flex-wrap items-center justify-between gap-3">
                <!-- Mapper Selector -->
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-400 whitespace-nowrap">Mapper</label>
                    <Dropdown
                        v-if="mappers && mappers.length"
                        v-model="selectedMapper"
                        :options="mappers"
                        optionLabel="mapperName"
                        placeholder="Select mapper"
                        scrollHeight="400px"
                        :disabled="mappersLoading"
                        class="w-52 p-inputtext-sm"
                        @change="onMapperChange"
                    />
                    <ProgressSpinner v-if="mappersLoading" style="width: 22px; height: 22px" />
                </div>

                <!-- Search Input -->
                <div class="relative flex-1 min-w-[200px] max-w-md">
                    <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none"></i>
                    <input
                        type="text"
                        v-model="searchQuery"
                        @input="onSearchInput"
                        placeholder="Search song, artist, or mapper..."
                        class="w-full bg-[#141417] text-gray-100 placeholder-gray-500 border border-white/[0.08] focus:border-blue-500 rounded-lg pl-9 pr-8 py-2 text-sm outline-none transition-colors"
                    />
                    <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 text-base transition-colors"
                        title="Clear search"
                    >
                        <i class="bx bx-x"></i>
                    </button>
                </div>

                <!-- Sort Selector -->
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-400 whitespace-nowrap">Sort</label>
                    <Dropdown
                        v-model="currentOrdering"
                        :options="sortOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Sort order"
                        class="w-48 p-inputtext-sm"
                        :disabled="tableLoading"
                        @change="onOrderingChange"
                    />
                </div>

                <!-- Per Page Selector -->
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-400 whitespace-nowrap">Show</label>
                    <Dropdown
                        v-model="pageSize"
                        :options="pageSizeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Per page"
                        class="w-36 p-inputtext-sm"
                        :disabled="tableLoading"
                        @change="onPageSizeChange"
                    />
                </div>

                <!-- Compare All Mappers Button -->
                <button
                    @click="toggleCompare"
                    :disabled="compareLoading"
                    :class="[
                        'px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 border',
                        showCompare
                            ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                            : 'bg-[#25282c] hover:bg-[#2e3238] border-white/[0.08] text-gray-200',
                    ]"
                >
                    <ProgressSpinner v-if="compareLoading" style="width: 14px; height: 14px" strokeWidth="4" />
                    <i v-else class="bx bx-git-compare text-sm"></i>
                    Compare Mappers
                </button>
            </div>

            <!-- Cross-Mapper Comparison Panel -->
            <transition name="slide-down">
                <div v-if="showCompare && compareData && compareData.length" class="mb-6 space-y-5">
                    <!-- Panel Header -->
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 class="text-base font-semibold text-gray-100">All-Mapper Comparison</h2>
                            <p class="text-xs text-gray-400">{{ compareData.length }} tracked mappers</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-1.5">
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

                    <!-- Bar Chart -->
                    <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-5">
                        <p class="text-xs font-medium text-gray-400 mb-3.5">
                            {{ currentCompareMetric.label }}
                        </p>
                        <div class="space-y-2">
                            <div v-for="(entry, i) in sortedCompareData" :key="entry.mapperId" class="flex items-center gap-3">
                                <span
                                    :class="[
                                        'w-6 text-xs font-mono text-center shrink-0',
                                        i === 0 ? 'text-amber-400 font-semibold' : 'text-gray-500',
                                    ]"
                                >
                                    #{{ i + 1 }}
                                </span>

                                <span
                                    class="text-sm text-gray-200 w-28 shrink-0 truncate cursor-pointer hover:text-blue-400 transition-colors"
                                    :title="entry.mapperName"
                                    @click="jumpToMapper(entry)"
                                >
                                    {{ entry.mapperName }}
                                </span>

                                <div class="flex-1 bg-[#141417] rounded h-4 overflow-hidden">
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

                    <!-- 3-Column Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-4 space-y-2.5">
                            <h3 class="text-xs font-semibold text-gray-400">Catalog Volume</h3>
                            <div v-for="entry in compareData" :key="entry.mapperId + '_vol'" class="flex items-center justify-between gap-2 text-sm">
                                <span class="text-gray-300 truncate">{{ entry.mapperName }}</span>
                                <div class="text-right shrink-0 font-mono text-xs">
                                    <span class="font-semibold text-gray-100">{{ entry.totalMaps }} maps</span>
                                    <span class="text-gray-500 block">{{ entry.totalDurationStr }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-4 space-y-2.5">
                            <h3 class="text-xs font-semibold text-gray-400">30d Vote Momentum</h3>
                            <div v-for="entry in sortedBy('growth30d')" :key="entry.mapperId + '_mom'" class="flex items-center justify-between gap-2 text-sm">
                                <span class="text-gray-300 truncate">{{ entry.mapperName }}</span>
                                <div class="text-right shrink-0 font-mono text-xs">
                                    <span class="font-semibold text-emerald-400">+{{ entry.growth30d.toLocaleString() }}</span>
                                    <span class="text-gray-500 block">+{{ entry.dailyGrowth30d }}/day</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-4 space-y-2.5">
                            <h3 class="text-xs font-semibold text-gray-400">Approval &amp; Quality</h3>
                            <div v-for="entry in sortedBy('overallRatio')" :key="entry.mapperId + '_qual'" class="flex items-center justify-between gap-2 text-sm">
                                <span class="text-gray-300 truncate">{{ entry.mapperName }}</span>
                                <div class="text-right shrink-0 font-mono text-xs">
                                    <span class="font-semibold text-gray-100">{{ entry.overallRatio }}%</span>
                                    <span class="text-gray-500 block">★ {{ entry.avgStar }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Head-to-Head Table -->
                    <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
                        <div class="px-4 py-3 border-b border-white/[0.06] bg-[#141417] flex items-center justify-between">
                            <h3 class="text-xs font-semibold text-gray-300">Head-to-Head Stats</h3>
                            <span class="text-xs text-gray-500">{{ compareData.length }} mappers</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead>
                                    <tr class="border-b border-white/[0.06] text-gray-400 text-xs font-medium bg-[#141417]">
                                        <th class="py-2.5 px-4">Mapper</th>
                                        <th class="py-2.5 px-4 text-center">Maps</th>
                                        <th class="py-2.5 px-4 text-center">Total Upvotes</th>
                                        <th class="py-2.5 px-4 text-center">Approval</th>
                                        <th class="py-2.5 px-4 text-center">Net Score</th>
                                        <th class="py-2.5 px-4 text-center">30d Growth</th>
                                        <th class="py-2.5 px-4 text-center">Avg BPM</th>
                                        <th class="py-2.5 px-4 text-center">Avg ★</th>
                                        <th class="py-2.5 px-4 text-center">Maps/mo</th>
                                        <th class="py-2.5 px-4 text-center">Music</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/[0.05]">
                                    <tr
                                        v-for="entry in compareData"
                                        :key="entry.mapperId"
                                        class="hover:bg-white/[0.03] cursor-pointer transition-colors"
                                        @click="jumpToMapper(entry)"
                                    >
                                        <td class="py-2.5 px-4 font-medium text-gray-100">{{ entry.mapperName }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-gray-300">{{ entry.totalMaps }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-emerald-400">+{{ entry.totalUpvotes.toLocaleString() }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-gray-200">{{ entry.overallRatio }}%</td>
                                        <td class="py-2.5 px-4 text-center font-mono" :class="entry.netScore >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                                            {{ entry.netScore >= 0 ? '+' : '' }}{{ entry.netScore.toLocaleString() }}
                                        </td>
                                        <td class="py-2.5 px-4 text-center font-mono text-gray-200">+{{ entry.growth30d.toLocaleString() }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-gray-300">{{ entry.avgBpm }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-amber-400">{{ entry.avgStar }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-gray-300">{{ entry.mapsPerMonth }}/mo</td>
                                        <td class="py-2.5 px-4 text-center font-mono text-gray-300">{{ entry.totalDurationStr }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Records Row -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div
                            v-for="rec in compareRecords"
                            :key="rec.label"
                            class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3.5 cursor-pointer transition-colors"
                            @click="jumpToMapper(rec.entry)"
                        >
                            <span class="text-xs text-gray-400 block">{{ rec.label }}</span>
                            <div class="text-sm font-semibold text-gray-100 mt-1">{{ rec.entry.mapperName }}</div>
                            <div class="text-xs font-mono text-gray-400 mt-0.5">{{ rec.value }}</div>
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Mapper Insights Section -->
            <div v-if="insights" class="space-y-4 mb-6">
                <!-- Mapper Overview & Metrics Strip -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
                    <div class="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06]">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-100">{{ insights.mapperName }}</h2>
                            <p class="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                                <span>Active since {{ formatDate(insights.firstUpload) }}</span>
                                <span class="text-gray-600">·</span>
                                <span>{{ insights.mapsPerMonth }} maps/month</span>
                                <span class="text-gray-600">·</span>
                                <span>{{ insights.totalDurationStr }} mapped</span>
                            </p>
                        </div>

                        <div class="flex items-center gap-6 font-mono">
                            <div class="text-right">
                                <span class="text-[11px] text-gray-400 block font-sans">Overall Approval</span>
                                <span class="text-base font-semibold text-emerald-400">{{ insights.overallRatio }}%</span>
                            </div>
                            <div class="text-right">
                                <span class="text-[11px] text-gray-400 block font-sans">Net Score</span>
                                <span class="text-base font-semibold text-gray-100">+{{ insights.netScore.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Total Upvotes</span>
                            <div class="text-lg font-semibold font-mono text-emerald-400 mt-0.5">
                                +{{ insights.totalUpvotes.toLocaleString() }}
                            </div>
                            <span class="text-[11px] text-gray-500">{{ insights.totalDownvotes.toLocaleString() }} downvotes</span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">30d Growth</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                +{{ insights.growth30d.toLocaleString() }}
                            </div>
                            <span class="text-[11px] text-gray-500">+{{ insights.dailyGrowth30d }}/day</span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Mapped Music</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ insights.totalDurationStr }}
                            </div>
                            <span class="text-[11px] text-gray-500">{{ insights.totalMaps }} maps</span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Average BPM</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ insights.avgBpm }}
                            </div>
                            <span class="text-[11px] text-gray-500">Max {{ insights.maxBpmMap?.bpm ? Math.round(insights.maxBpmMap.bpm) : '-' }}</span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Starred Maps</span>
                            <div class="text-lg font-semibold font-mono text-amber-400 mt-0.5">
                                {{ insights.starredCount }}
                            </div>
                            <span class="text-[11px] text-gray-500">Avg ★ {{ insights.avgStar }}</span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">7d Velocity</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                +{{ insights.growth7d.toLocaleString() }}
                            </div>
                            <span class="text-[11px] text-gray-500">+{{ insights.dailyGrowth7d }}/day</span>
                        </div>
                    </div>
                </div>

                <!-- Standout Maps (4 Cards) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div
                        v-if="insights.highestRatioMap"
                        @click="openMapModal(insights.highestRatioMap)"
                        class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                        <div class="min-w-0">
                            <span class="text-[11px] text-gray-400 block">Highest Approval</span>
                            <div class="font-semibold text-gray-100 text-sm truncate mt-0.5" :title="insights.highestRatioMap.songName">
                                {{ insights.highestRatioMap.songName }}
                            </div>
                            <div class="text-xs text-gray-500 truncate">{{ insights.highestRatioMap.songAuthorName }}</div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="text-sm font-semibold text-emerald-400 block">{{ insights.highestRatioMap.ratio }}%</span>
                            <span class="text-[11px] text-gray-500">+{{ insights.highestRatioMap.upvotes }}</span>
                        </div>
                    </div>

                    <div
                        v-if="insights.mostUpvotedMap"
                        @click="openMapModal(insights.mostUpvotedMap)"
                        class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                        <div class="min-w-0">
                            <span class="text-[11px] text-gray-400 block">Most Upvoted</span>
                            <div class="font-semibold text-gray-100 text-sm truncate mt-0.5" :title="insights.mostUpvotedMap.songName">
                                {{ insights.mostUpvotedMap.songName }}
                            </div>
                            <div class="text-xs text-gray-500 truncate">{{ insights.mostUpvotedMap.songAuthorName }}</div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="text-sm font-semibold text-emerald-400 block">+{{ insights.mostUpvotedMap.upvotes.toLocaleString() }}</span>
                            <span class="text-[11px] text-gray-500">upvotes</span>
                        </div>
                    </div>

                    <div
                        v-if="insights.highestStarMap"
                        @click="openMapModal(insights.highestStarMap)"
                        class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                        <div class="min-w-0">
                            <span class="text-[11px] text-gray-400 block">Highest Stars</span>
                            <div class="font-semibold text-gray-100 text-sm truncate mt-0.5" :title="insights.highestStarMap.songName">
                                {{ insights.highestStarMap.songName }}
                            </div>
                            <div class="text-xs text-gray-500 truncate">{{ insights.highestStarMap.songAuthorName }}</div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="text-sm font-semibold text-amber-400 block">★ {{ insights.highestStarMap.highestStar.toFixed(1) }}</span>
                            <span class="text-[11px] text-gray-500">stars</span>
                        </div>
                    </div>

                    <div
                        v-if="insights.maxBpmMap"
                        @click="openMapModal(insights.maxBpmMap)"
                        class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                        <div class="min-w-0">
                            <span class="text-[11px] text-gray-400 block">Fastest BPM</span>
                            <div class="font-semibold text-gray-100 text-sm truncate mt-0.5" :title="insights.maxBpmMap.songName">
                                {{ insights.maxBpmMap.songName }}
                            </div>
                            <div class="text-xs text-gray-500 truncate">{{ insights.maxBpmMap.songAuthorName }}</div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="text-sm font-semibold text-gray-100 block">{{ Math.round(insights.maxBpmMap.bpm) }}</span>
                            <span class="text-[11px] text-gray-500">BPM</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-gray-400">
                <div class="flex items-center gap-2">
                    <span v-if="selectedMapper" class="text-sm font-semibold text-gray-100">
                        {{ selectedMapper.mapperName }}'s Maps
                    </span>
                    <span v-if="totalCount > 0" class="text-gray-500 font-mono">
                        ({{ totalCount }} {{ totalCount === 1 ? 'map' : 'maps' }})
                    </span>
                </div>
                <div v-if="totalCount > 0" class="text-xs text-gray-500 font-mono">
                    Page {{ currentPage }} / {{ totalPages }}
                </div>
            </div>

            <!-- Main Data Table -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg relative overflow-hidden min-h-[580px] flex flex-col justify-between">
                <!-- In-Table Loading Overlay -->
                <div
                    v-if="tableLoading && maps && maps.length"
                    class="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center"
                >
                    <div class="bg-[#1e2023] border border-white/10 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <ProgressSpinner style="width: 22px; height: 22px" strokeWidth="4" />
                        <span class="text-xs text-gray-200">Updating...</span>
                    </div>
                </div>

                <!-- Initial Loading Screen -->
                <div v-if="loading && (!maps || !maps.length)" class="p-16 flex flex-col items-center justify-center flex-1">
                    <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
                    <span class="text-gray-400 mt-3 text-sm">Loading maps...</span>
                </div>

                <!-- Empty State -->
                <div v-else-if="!loading && (!maps || maps.length === 0)" class="p-16 text-center text-gray-400 flex flex-col items-center justify-center flex-1">
                    <p class="text-base font-medium text-gray-200">No maps found</p>
                    <p class="text-xs text-gray-500 mt-1">Try adjusting your search query or selecting a different mapper.</p>
                    <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="mt-4 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                        Clear Search
                    </button>
                </div>

                <!-- Table Contents -->
                <template v-else>
                    <!-- Top Pagination Bar -->
                    <div v-if="totalPages > 1" class="bg-[#141417] border-b border-white/[0.06] px-4 py-3 flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
                        <div class="text-xs text-gray-400 font-mono">
                            Page {{ currentPage }} of {{ totalPages }}
                        </div>

                        <div class="flex items-center gap-1">
                            <button
                                @click="goToPage(1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-2 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs transition-colors"
                                title="First page"
                            >
                                <i class="bx bx-first-page text-base"></i>
                            </button>
                            <button
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-2.5 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                <i class="bx bx-chevron-left text-base"></i> Prev
                            </button>

                            <div class="flex items-center gap-1 mx-1">
                                <button
                                    v-for="p in visiblePages"
                                    :key="p"
                                    @click="goToPage(p)"
                                    :disabled="tableLoading"
                                    :class="[
                                        'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                                        p === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-[#25282c] hover:bg-[#2e3238] text-gray-300',
                                    ]"
                                >
                                    {{ p }}
                                </button>
                            </div>

                            <button
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-2.5 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                Next <i class="bx bx-chevron-right text-base"></i>
                            </button>
                            <button
                                @click="goToPage(totalPages)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-2 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs transition-colors"
                                title="Last page"
                            >
                                <i class="bx bx-last-page text-base"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable Table -->
                    <div class="overflow-x-auto w-full flex-1 min-h-[440px]">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-[#141417] border-b border-white/[0.06] text-xs font-medium text-gray-400 select-none">
                                    <th class="py-3 px-4 min-w-[210px] max-w-[230px]">Map</th>
                                    <th
                                        @click="toggleSort('uploaded')"
                                        class="py-3 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Uploaded <i :class="getSortIcon('uploaded')"></i>
                                    </th>
                                    <th
                                        @click="toggleSort('highestStar')"
                                        class="py-3 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Stars <i :class="getSortIcon('highestStar')"></i>
                                    </th>
                                    <th
                                        @click="toggleSort('bpm')"
                                        class="py-3 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        BPM <i :class="getSortIcon('bpm')"></i>
                                    </th>
                                    <th
                                        @click="toggleSort('upvotes')"
                                        class="py-3 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Votes <i :class="getSortIcon('upvotes')"></i>
                                    </th>
                                    <th
                                        v-for="range in timeRanges"
                                        :key="range.key"
                                        @click="toggleSort(range.key)"
                                        class="py-3 px-3.5 text-center whitespace-nowrap cursor-pointer hover:text-white transition-colors min-w-[85px]"
                                    >
                                        {{ range.label }} <i :class="getSortIcon(range.key)"></i>
                                    </th>
                                    <th class="py-3 px-4 text-center whitespace-nowrap">Stats</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/[0.05] text-sm">
                                <tr
                                    v-for="map in maps"
                                    :key="map.key || map.hash"
                                    @click="openMapModal(map)"
                                    class="hover:bg-white/[0.03] cursor-pointer transition-colors"
                                >
                                    <!-- Map Info Cell -->
                                    <td class="py-3 px-4 min-w-[210px] max-w-[230px]">
                                        <div class="flex items-center gap-2.5">
                                            <div class="relative w-10 h-10 rounded-md overflow-hidden bg-[#141417] shrink-0">
                                                <img
                                                    :src="map.hash ? `https://cdn.scoresaber.com/covers/${map.hash.toUpperCase()}.png` : '/favicon.ico'"
                                                    @error="onImageError"
                                                    alt="Cover"
                                                    class="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div class="min-w-0 max-w-[170px]">
                                                <div class="font-medium text-gray-100 truncate text-sm" :title="map.songName">
                                                    {{ map.songName }}
                                                </div>
                                                <div class="text-xs text-gray-400 truncate" :title="map.songAuthorName">
                                                    {{ map.songAuthorName }}
                                                </div>
                                                <div class="flex items-center gap-1.5 mt-0.5" @click.stop>
                                                    <a
                                                        v-if="map.key"
                                                        :href="`https://beatsaver.com/maps/${map.key}`"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="nope text-[11px] font-mono text-gray-400 hover:text-blue-400 transition-colors"
                                                        title="View on BeatSaver"
                                                    >
                                                        #{{ map.key }}
                                                    </a>
                                                    <span v-if="map.levelAuthorName" class="text-[11px] text-gray-500 truncate" :title="map.levelAuthorName">
                                                        · {{ map.levelAuthorName }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Uploaded Date -->
                                    <td class="py-3 px-4 text-center text-xs text-gray-300 whitespace-nowrap font-mono">
                                        {{ formatDate(map.uploaded) }}
                                    </td>

                                    <!-- Stars -->
                                    <td class="py-3 px-4 text-center whitespace-nowrap font-mono text-xs">
                                        <span v-if="map.highestStar && map.highestStar > 0" class="text-amber-400 font-semibold">
                                            ★ {{ map.highestStar.toFixed(1) }}
                                        </span>
                                        <span v-else class="text-gray-600">-</span>
                                    </td>

                                    <!-- BPM -->
                                    <td class="py-3 px-4 text-center text-xs font-mono text-gray-300 whitespace-nowrap">
                                        {{ map.bpm ? Math.round(map.bpm) : '-' }}
                                    </td>

                                    <!-- Total Votes -->
                                    <td class="py-3 px-4 text-center whitespace-nowrap">
                                        <div class="inline-flex flex-col items-center font-mono">
                                            <div class="text-xs font-semibold">
                                                <span class="text-emerald-400">+{{ map.latest?.upvotes ?? map.upvotes ?? 0 }}</span>
                                                <span class="text-gray-600 mx-1">/</span>
                                                <span class="text-rose-400">-{{ map.latest?.downvotes ?? map.downvotes ?? 0 }}</span>
                                            </div>
                                            <span class="text-[11px] text-gray-500 mt-0.5">
                                                {{ (map.latest?.upvotes ?? map.upvotes ?? 0) + (map.latest?.downvotes ?? map.downvotes ?? 0) }} total
                                            </span>
                                        </div>
                                    </td>

                                    <!-- Time Range Deltas -->
                                    <td
                                        v-for="range in timeRanges"
                                        :key="range.key"
                                        class="py-3 px-3.5 text-center whitespace-nowrap"
                                    >
                                        <div
                                            v-if="map[range.key]"
                                            class="text-xs font-mono inline-flex items-center justify-center gap-1"
                                        >
                                            <span :class="map[range.key].upvotes > 0 ? 'text-emerald-400 font-semibold' : 'text-gray-500'">
                                                {{ map[range.key].upvotes > 0 ? '+' + map[range.key].upvotes : map[range.key].upvotes }}
                                            </span>
                                            <span class="text-gray-600">/</span>
                                            <span :class="map[range.key].downvotes > 0 ? 'text-rose-400 font-semibold' : 'text-gray-500'">
                                                {{ map[range.key].downvotes > 0 ? '+' + map[range.key].downvotes : map[range.key].downvotes }}
                                            </span>
                                        </div>
                                        <span v-else class="text-gray-600 text-xs">-</span>
                                    </td>

                                    <!-- Chart Action -->
                                    <td class="py-3 px-4 text-center whitespace-nowrap" @click.stop>
                                        <button
                                            @click="openMapModal(map)"
                                            class="p-1.5 rounded-md bg-[#25282c] hover:bg-blue-600 text-gray-300 hover:text-white transition-colors"
                                            title="View map stats chart"
                                        >
                                            <i class="bx bx-bar-chart-alt-2 text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Bottom Pagination Bar -->
                    <div v-if="totalPages > 1" class="bg-[#141417] border-t border-white/[0.06] px-4 py-3 flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
                        <div class="text-xs text-gray-400 font-mono">
                            Page {{ currentPage }} of {{ totalPages }} ({{ pageSize }}/page)
                        </div>

                        <div class="flex items-center gap-1">
                            <button
                                @click="goToPage(1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-2 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs transition-colors"
                                title="First page"
                            >
                                <i class="bx bx-first-page text-base"></i>
                            </button>
                            <button
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-2.5 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                <i class="bx bx-chevron-left text-base"></i> Prev
                            </button>

                            <div class="flex items-center gap-1 mx-1">
                                <button
                                    v-for="p in visiblePages"
                                    :key="p"
                                    @click="goToPage(p)"
                                    :disabled="tableLoading"
                                    :class="[
                                        'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                                        p === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-[#25282c] hover:bg-[#2e3238] text-gray-300',
                                    ]"
                                >
                                    {{ p }}
                                </button>
                            </div>

                            <button
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-2.5 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                Next <i class="bx bx-chevron-right text-base"></i>
                            </button>
                            <button
                                @click="goToPage(totalPages)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-2 py-1.5 bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 rounded-md text-xs transition-colors"
                                title="Last page"
                            >
                                <i class="bx bx-last-page text-base"></i>
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Map Detailed Stats Modal -->
        <div
            v-if="modalMap"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto"
            @click.self="closeModal"
        >
            <div class="relative w-full max-w-5xl bg-[#1e2023] border border-white/[0.08] rounded-lg shadow-2xl overflow-hidden my-8">
                <!-- Modal Header -->
                <div class="bg-[#141417] border-b border-white/[0.06] p-5 flex items-start justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <img
                            :src="modalMap.hash ? `https://cdn.scoresaber.com/covers/${modalMap.hash.toUpperCase()}.png` : '/favicon.ico'"
                            @error="onImageError"
                            alt="Cover"
                            class="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-gray-100 flex items-center gap-2">
                                {{ modalMap.songName }}
                                <span v-if="modalMap.songSubName" class="text-sm font-normal text-gray-400">
                                    {{ modalMap.songSubName }}
                                </span>
                            </h3>
                            <p class="text-xs text-gray-400 mt-0.5">
                                {{ modalMap.songAuthorName }} · mapped by {{ modalMap.levelAuthorName || selectedMapper?.mapperName }}
                            </p>
                            <div class="flex items-center gap-2 mt-2">
                                <a
                                    v-if="modalMap.key"
                                    :href="`https://beatsaver.com/maps/${modalMap.key}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="nope inline-flex items-center gap-1 text-xs font-mono bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white px-2.5 py-1 rounded-md transition-colors"
                                >
                                    #{{ modalMap.key }} <i class="bx bx-link-external text-xs"></i>
                                </a>
                                <a
                                    v-if="modalMap.hash"
                                    :href="`https://scoresaber.com/leaderboard/${modalMap.hash}`"
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
                        @click="closeModal"
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                        title="Close modal (Esc)"
                    >
                        <i class="bx bx-x text-2xl"></i>
                    </button>
                </div>

                <!-- Modal Content Body -->
                <div class="p-5 space-y-5 max-h-[82vh] overflow-y-auto">
                    <!-- Key Metrics Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                            <span class="text-[11px] text-gray-400 block">Votes &amp; Net</span>
                            <div class="text-sm font-semibold font-mono mt-1">
                                <span class="text-emerald-400">+{{ modalUpvotes }}</span>
                                <span class="text-gray-600 mx-0.5">/</span>
                                <span class="text-rose-400">-{{ modalDownvotes }}</span>
                            </div>
                            <span class="text-[11px] font-mono mt-1 text-gray-400">
                                {{ modalNetScore >= 0 ? '+' + modalNetScore : modalNetScore }} net
                            </span>
                        </div>

                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                            <span class="text-[11px] text-gray-400 block">Approval</span>
                            <div class="text-base font-semibold font-mono text-gray-100 mt-1">
                                {{ modalApprovalRatio }}%
                            </div>
                            <span class="text-[11px] text-gray-400 mt-0.5 truncate">{{ sentimentLabel }}</span>
                        </div>

                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                            <span class="text-[11px] text-gray-400 block">Standing</span>
                            <div class="text-base font-semibold font-mono text-gray-100 mt-1">
                                #{{ mapperPortfolioRank }}
                            </div>
                            <span class="text-[11px] text-gray-500 mt-0.5">of {{ totalCount }} maps</span>
                        </div>

                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                            <span class="text-[11px] text-gray-400 block">30d Rate</span>
                            <div class="text-base font-semibold font-mono text-emerald-400 mt-1">
                                +{{ voteVelocity30d }}<span class="text-xs font-normal text-gray-400">/d</span>
                            </div>
                            <span class="text-[11px] text-gray-500 mt-0.5">7d: +{{ voteVelocity7d }}/d</span>
                        </div>

                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                            <span class="text-[11px] text-gray-400 block">Stars &amp; BPM</span>
                            <div class="text-base font-semibold font-mono text-amber-400 mt-1">
                                ★ {{ modalMap.highestStar ? modalMap.highestStar.toFixed(1) : '-' }}
                            </div>
                            <span class="text-[11px] text-gray-500 mt-0.5">{{ modalMap.bpm ? Math.round(modalMap.bpm) : '-' }} BPM</span>
                        </div>

                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between">
                            <span class="text-[11px] text-gray-400 block">Next Milestone</span>
                            <div class="text-sm font-semibold font-mono text-gray-100 mt-1 truncate">
                                {{ milestoneTarget }} up
                            </div>
                            <div class="w-full bg-[#25282c] h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div class="bg-blue-500 h-full transition-all duration-300" :style="{ width: `${milestonePercent}%` }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Graph Section -->
                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg p-4">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h4 class="text-sm font-semibold text-gray-200">
                                {{ chartType === 'growth' ? 'Upvotes & Downvotes Over Time' : chartType === 'deltas' ? 'Period Vote Deltas' : 'Daily Vote Velocity' }}
                            </h4>

                            <!-- Chart Mode Tabs -->
                            <div class="flex items-center bg-[#1e2023] p-1 rounded-lg border border-white/[0.06]">
                                <button
                                    @click="chartType = 'growth'"
                                    :class="[
                                        'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                                        chartType === 'growth' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white',
                                    ]"
                                >
                                    Timeline
                                </button>
                                <button
                                    @click="chartType = 'deltas'"
                                    :class="[
                                        'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                                        chartType === 'deltas' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white',
                                    ]"
                                >
                                    Period Deltas
                                </button>
                                <button
                                    @click="chartType = 'velocity'"
                                    :class="[
                                        'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                                        chartType === 'velocity' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white',
                                    ]"
                                >
                                    Growth Rate
                                </button>
                            </div>
                        </div>

                        <!-- 1. Dual-Line Cumulative Chart -->
                        <div v-if="chartType === 'growth'" class="relative">
                            <div class="w-full relative aspect-[1000/220] max-h-[230px]">
                                <svg class="w-full h-full" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <linearGradient id="upvoteGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#10b981" stop-opacity="0.22" />
                                            <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    <line x1="15" y1="25" x2="985" y2="25" stroke="#374151" stroke-dasharray="4 4" stroke-opacity="0.4" />
                                    <line x1="15" y1="100" x2="985" y2="100" stroke="#374151" stroke-dasharray="4 4" stroke-opacity="0.4" />
                                    <line x1="15" y1="175" x2="985" y2="175" stroke="#374151" stroke-dasharray="4 4" stroke-opacity="0.4" />

                                    <polygon :points="upvoteAreaPoints" fill="url(#upvoteGrad)" />

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
                                            r="8"
                                            fill="#10b981"
                                            fill-opacity="0.25"
                                            stroke="#10b981"
                                            stroke-width="2"
                                        />
                                        <circle :cx="pt.x" :cy="pt.yUp" r="4.5" fill="#10b981" stroke="#141417" stroke-width="2" />
                                        <circle :cx="pt.x" :cy="pt.yDown" r="3.5" fill="#f43f5e" stroke="#141417" stroke-width="1.5" />
                                        <rect
                                            :x="pt.x - 30"
                                            y="10"
                                            width="60"
                                            height="185"
                                            fill="transparent"
                                            class="cursor-pointer"
                                            @mouseenter="hoveredPoint = pt"
                                            @mouseleave="hoveredPoint = null"
                                        />
                                    </g>
                                </svg>
                            </div>

                            <div class="flex justify-between text-xs text-gray-500 mt-2 px-1 font-mono border-t border-white/[0.06] pt-2">
                                <span v-for="pt in chartPoints" :key="pt.label" class="text-center">{{ pt.label }}</span>
                            </div>

                            <div class="flex items-center justify-between mt-3 px-1">
                                <div class="flex items-center gap-5 text-xs text-gray-400">
                                    <span class="flex items-center gap-1.5">
                                        <span class="w-3 h-0.5 bg-emerald-500 rounded"></span> Upvotes
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <span class="w-3 h-0.5 bg-rose-500 rounded"></span> Downvotes
                                    </span>
                                </div>

                                <div
                                    v-if="hoveredPoint"
                                    class="bg-[#1e2023] border border-white/10 text-xs px-3 py-1 rounded-md flex items-center gap-2.5 font-mono"
                                >
                                    <span class="text-gray-300">{{ hoveredPoint.label }}:</span>
                                    <span class="text-emerald-400">+{{ hoveredPoint.valUp }}</span>
                                    <span class="text-gray-600">/</span>
                                    <span class="text-rose-400">-{{ hoveredPoint.valDown }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Period Deltas Bar Chart -->
                        <div v-else-if="chartType === 'deltas'" class="relative">
                            <div class="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-3 border-b border-white/[0.06]">
                                <div
                                    v-for="bar in barChartData"
                                    :key="bar.label"
                                    class="flex-1 flex flex-col items-center h-full justify-end group"
                                >
                                    <div class="text-xs font-mono text-gray-400 group-hover:text-gray-200 mb-1 transition-colors whitespace-nowrap">
                                        +{{ bar.upvotes }} / -{{ bar.downvotes }}
                                    </div>
                                    <div class="w-full flex items-end justify-center gap-1 h-36">
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
                                    <span class="text-xs text-gray-400 mt-2 truncate max-w-full" :title="bar.label">{{ bar.label }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-center gap-5 mt-3 text-xs text-gray-400">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Upvotes
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Downvotes
                                </span>
                            </div>
                        </div>

                        <!-- 3. Daily Growth Rate Chart -->
                        <div v-else class="relative">
                            <div class="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-3 border-b border-white/[0.06]">
                                <div
                                    v-for="v in velocityChartData"
                                    :key="v.label"
                                    class="flex-1 flex flex-col items-center h-full justify-end group"
                                >
                                    <div class="text-xs font-mono text-gray-300 mb-1 whitespace-nowrap">
                                        +{{ v.rate }}/d
                                    </div>
                                    <div class="w-full flex items-end justify-center h-36">
                                        <div
                                            class="w-3/4 bg-blue-500/85 rounded-t transition-colors hover:bg-blue-400"
                                            :style="{ height: `${v.height}%` }"
                                            :title="`${v.label}: +${v.rate} votes/day`"
                                        ></div>
                                    </div>
                                    <span class="text-xs text-gray-400 mt-2 truncate max-w-full" :title="v.label">{{ v.label }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-center gap-5 mt-3 text-xs text-gray-400">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Average votes/day
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Breakdown Table -->
                    <div class="bg-[#141417] border border-white/[0.06] rounded-lg overflow-hidden">
                        <div class="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                            <h4 class="text-xs font-semibold text-gray-300">Historical Breakdown</h4>
                            <span class="text-xs text-gray-500">Earliest DB entry &amp; vote deltas</span>
                        </div>
                        <table class="w-full text-left text-xs sm:text-sm">
                            <thead>
                                <tr class="border-b border-white/[0.06] text-gray-400 text-xs font-medium">
                                    <th class="py-2.5 px-4">Timeframe</th>
                                    <th class="py-2.5 px-4 text-center">Upvotes</th>
                                    <th class="py-2.5 px-4 text-center">Downvotes</th>
                                    <th class="py-2.5 px-4 text-center">Net</th>
                                    <th class="py-2.5 px-4 text-center">Daily Rate</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/[0.05] text-gray-200">
                                <tr
                                    v-for="row in breakdownRows"
                                    :key="row.label"
                                    :class="row.isHighlight ? 'bg-white/[0.03] font-medium' : 'hover:bg-white/[0.02]'"
                                >
                                    <td class="py-2.5 px-4 flex items-center gap-2">
                                        <span class="text-gray-200">{{ row.label }}</span>
                                        <span v-if="row.tag" class="text-[11px] text-gray-500 font-mono">({{ row.tag }})</span>
                                    </td>
                                    <td class="py-2.5 px-4 text-center text-emerald-400 font-mono">+{{ row.upvotes }}</td>
                                    <td class="py-2.5 px-4 text-center text-rose-400 font-mono">-{{ row.downvotes }}</td>
                                    <td class="py-2.5 px-4 text-center font-mono" :class="row.net >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                                        {{ row.net >= 0 ? '+' + row.net : row.net }}
                                    </td>
                                    <td class="py-2.5 px-4 text-center text-gray-300 font-mono">
                                        +{{ row.rate }}/day
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-[#141417] border-t border-white/[0.06] px-5 py-3.5 flex items-center justify-end">
                    <button
                        @click="closeModal"
                        class="px-4 py-2 bg-[#25282c] hover:bg-[#2e3238] text-gray-200 rounded-lg text-xs font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            selectedMapper: null,
            mappers: [],
            maps: [],
            insights: null,
            totalCount: 0,
            pageSize: 10,
            pageSizeOptions: [
                { label: '10 per page', value: 10 },
                { label: '25 per page', value: 25 },
                { label: '50 per page', value: 50 },
                { label: '100 per page', value: 100 },
            ],
            currentPage: 1,
            searchQuery: '',
            currentOrdering: '-uploaded',
            loading: false,
            tableLoading: false,
            _fetchController: null,
            mappersLoading: false,
            searchDebounceTimer: null,
            modalMap: null,
            chartType: 'growth',
            hoveredPoint: null,
            // Cross-mapper comparison
            showCompare: false,
            compareLoading: false,
            compareData: null,
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
            sortOptions: [
                { label: 'Newest Uploaded', value: '-uploaded' },
                { label: 'Oldest Uploaded', value: 'uploaded' },
                { label: 'Highest Stars', value: '-highestStar' },
                { label: 'Lowest Stars', value: 'highestStar' },
                { label: 'Highest Total Upvotes', value: '-upvotes' },
                { label: 'Highest Total Downvotes', value: '-downvotes' },
                { label: 'Highest BPM', value: '-bpm' },
                { label: 'Lowest BPM', value: 'bpm' },
                { label: 'Highest Ratio', value: '-ratio' },
                { label: 'Most 24h Vote Activity', value: '-days-1' },
                { label: 'Most 7d Vote Activity', value: '-days-7' },
                { label: 'Most 30d Vote Activity', value: '-days-30' },
                { label: 'Most 90d Vote Activity', value: '-days-90' },
                { label: 'Most 180d Vote Activity', value: '-days-180' },
                { label: 'Most 1y Vote Activity', value: '-days-360' },
                { label: 'Most 2y Vote Activity', value: '-days-720' },
                { label: 'Most 3y Vote Activity', value: '-days-1080' },
            ],
            timeRanges: [
                { key: 'days-1', label: '24h' },
                { key: 'days-7', label: '7d' },
                { key: 'days-30', label: '30d' },
                { key: 'days-90', label: '90d' },
                { key: 'days-180', label: '180d' },
                { key: 'days-360', label: '1y' },
                { key: 'days-720', label: '2y' },
                { key: 'days-1080', label: '3y' },
            ],
        }
    },
    async created() {
        this.readQueryParams()
        await this.fetchMappers()
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', this.onKeyDown)
        }
    },
    beforeDestroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', this.onKeyDown)
        }
    },
    computed: {
        currentCompareMetric() {
            return this.compareMetrics.find((m) => m.key === this.compareMetric) || this.compareMetrics[0]
        },
        sortedCompareData() {
            if (!this.compareData) return []
            return [...this.compareData].sort((a, b) => (b[this.compareMetric] || 0) - (a[this.compareMetric] || 0))
        },
        compareRecords() {
            if (!this.compareData || !this.compareData.length) return []
            const best = (key) => [...this.compareData].sort((a, b) => (b[key] || 0) - (a[key] || 0))[0]
            const fmt = (entry, key) => {
                const v = entry[key]
                if (key === 'overallRatio') return `${v}%`
                if (key === 'mapsPerMonth') return `${v}/mo`
                if (key === 'avgStar') return `★ ${v}`
                if (key === 'totalDurationSec') return entry.totalDurationStr
                return typeof v === 'number' ? v.toLocaleString() : v
            }
            return [
                { label: 'Most Upvotes', icon: 'bx-up-arrow-circle', color: 'text-emerald-400', entry: best('totalUpvotes'), value: `+${best('totalUpvotes').totalUpvotes.toLocaleString()}` },
                { label: 'Highest Approval', icon: 'bx-heart', color: 'text-amber-400', entry: best('overallRatio'), value: `${best('overallRatio').overallRatio}%` },
                { label: 'Fastest Growing', icon: 'bx-trending-up', color: 'text-blue-400', entry: best('growth30d'), value: `+${best('growth30d').growth30d.toLocaleString()} in 30d` },
                { label: 'Most Prolific', icon: 'bx-music', color: 'text-violet-400', entry: best('totalMaps'), value: `${best('totalMaps').totalMaps} maps` },
            ]
        },
        modalUpvotes() {
            if (!this.modalMap) return 0
            return this.modalMap.latest?.upvotes ?? this.modalMap.upvotes ?? 0
        },
        modalDownvotes() {
            if (!this.modalMap) return 0
            return this.modalMap.latest?.downvotes ?? this.modalMap.downvotes ?? 0
        },
        totalPages() {
            return Math.max(1, Math.ceil(this.totalCount / this.pageSize))
        },
        visiblePages() {
            const current = this.currentPage
            const total = this.totalPages
            const delta = 2
            const range = []
            for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
                range.push(i)
            }
            return range
        },
        modalApprovalRatio() {
            if (!this.modalMap) return 0
            const up = this.modalUpvotes
            const down = this.modalDownvotes
            if (up + down === 0) return 0
            return Math.round((up / (up + down)) * 1000) / 10
        },
        modalNetScore() {
            if (!this.modalMap) return 0
            return this.modalUpvotes - this.modalDownvotes
        },
        sentimentLabel() {
            const r = this.modalApprovalRatio
            if (r >= 95) return 'Overwhelmingly Positive'
            if (r >= 85) return 'Very Positive'
            if (r >= 70) return 'Positive'
            if (r >= 50) return 'Mixed'
            return 'Negative'
        },
        sentimentBadgeClass() {
            const r = this.modalApprovalRatio
            if (r >= 95) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            if (r >= 85) return 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
            if (r >= 70) return 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            if (r >= 50) return 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            return 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
        },
        mapperPortfolioRank() {
            if (!this.modalMap || !this.maps || !this.maps.length) return 1
            const key = this.modalMap.key || this.modalMap.hash
            const index = this.maps.findIndex((m) => (m.key || m.hash) === key)
            return index >= 0 ? index + 1 : 1
        },
        modalDeltas() {
            if (!this.modalMap) {
                return {
                    d1: { upvotes: 0, downvotes: 0 },
                    d7: { upvotes: 0, downvotes: 0 },
                    d30: { upvotes: 0, downvotes: 0 },
                    d90: { upvotes: 0, downvotes: 0 },
                    d180: { upvotes: 0, downvotes: 0 },
                    d360: { upvotes: 0, downvotes: 0 },
                    d720: { upvotes: 0, downvotes: 0 },
                    d1080: { upvotes: 0, downvotes: 0 },
                    d1440: { upvotes: 0, downvotes: 0 },
                    d1800: { upvotes: 0, downvotes: 0 },
                }
            }
            const m = this.modalMap
            return {
                d1: m['days-1'] || { upvotes: 0, downvotes: 0 },
                d7: m['days-7'] || { upvotes: 0, downvotes: 0 },
                d30: m['days-30'] || { upvotes: 0, downvotes: 0 },
                d90: m['days-90'] || { upvotes: 0, downvotes: 0 },
                d180: m['days-180'] || { upvotes: 0, downvotes: 0 },
                d360: m['days-360'] || { upvotes: 0, downvotes: 0 },
                d720: m['days-720'] || { upvotes: 0, downvotes: 0 },
                d1080: m['days-1080'] || { upvotes: 0, downvotes: 0 },
                d1440: m['days-1440'] || { upvotes: 0, downvotes: 0 },
                d1800: m['days-1800'] || { upvotes: 0, downvotes: 0 },
            }
        },
        voteVelocity7d() {
            const d7 = this.modalDeltas.d7
            const total = (d7.upvotes || 0) + (d7.downvotes || 0)
            return Math.round((total / 7) * 10) / 10
        },
        voteVelocity30d() {
            const d30 = this.modalDeltas.d30
            const total = (d30.upvotes || 0) + (d30.downvotes || 0)
            return Math.round((total / 30) * 10) / 10
        },
        milestoneTarget() {
            const up = this.modalUpvotes
            if (up < 25) return 25
            if (up < 50) return 50
            if (up < 100) return 100
            if (up < 250) return 250
            if (up < 500) return 500
            if (up < 1000) return 1000
            if (up < 2500) return 2500
            return (Math.floor(up / 1000) + 1) * 1000
        },
        milestonePercent() {
            const up = this.modalUpvotes
            const target = this.milestoneTarget
            return Math.min(100, Math.round((up / target) * 100))
        },
        chartPoints() {
            if (!this.modalMap) return []
            const latestUp = this.modalUpvotes
            const latestDown = this.modalDownvotes
            const d = this.modalDeltas
            const earliest = this.modalMap.earliest
            const now = new Date()

            let startDate = earliest?.first_recorded ? new Date(earliest.first_recorded) : null
            if (!startDate && this.modalMap.uploaded) {
                startDate = new Date(this.modalMap.uploaded)
            }

            const rawPoints = []

            if (earliest && earliest.initial_upvotes !== undefined) {
                const label = earliest.first_recorded
                    ? this.formatDate(earliest.first_recorded)
                    : 'Earliest DB Entry'
                rawPoints.push({
                    label,
                    valUp: earliest.initial_upvotes,
                    valDown: earliest.initial_downvotes || 0,
                })
            } else {
                rawPoints.push({ label: 'Start', valUp: 0, valDown: 0 })
            }

            const timeIntervals = [
                { label: '5y ago', days: 1800, key: 'd1800' },
                { label: '4y ago', days: 1440, key: 'd1440' },
                { label: '3y ago', days: 1080, key: 'd1080' },
                { label: '2y ago', days: 720, key: 'd720' },
                { label: '1y ago', days: 360, key: 'd360' },
                { label: '180d ago', days: 180, key: 'd180' },
                { label: '90d ago', days: 90, key: 'd90' },
                { label: '30d ago', days: 30, key: 'd30' },
                { label: '7d ago', days: 7, key: 'd7' },
                { label: '24h ago', days: 1, key: 'd1' },
            ]

            for (const item of timeIntervals) {
                const pointTime = new Date(now.getTime() - item.days * 86400 * 1000)
                if (!startDate || pointTime > startDate) {
                    const delta = d[item.key]
                    if (delta && (delta.upvotes !== undefined || delta.downvotes !== undefined)) {
                        rawPoints.push({
                            label: item.label,
                            valUp: Math.max(0, latestUp - delta.upvotes),
                            valDown: Math.max(0, latestDown - delta.downvotes),
                        })
                    }
                }
            }

            rawPoints.push({ label: 'Now', valUp: latestUp, valDown: latestDown })

            const maxVal = Math.max(1, ...rawPoints.map((p) => Math.max(p.valUp, p.valDown)))

            const widthLeft = 15
            const widthRight = 985
            const chartWidth = widthRight - widthLeft
            const step = chartWidth / Math.max(1, rawPoints.length - 1)

            const heightTop = 25
            const heightBottom = 175
            const chartHeight = heightBottom - heightTop

            return rawPoints.map((pt, i) => {
                const x = widthLeft + i * step
                const normUp = pt.valUp / maxVal
                const normDown = pt.valDown / maxVal
                const yUp = heightBottom - normUp * chartHeight
                const yDown = heightBottom - normDown * chartHeight
                return {
                    ...pt,
                    x: Math.round(x),
                    yUp: Math.round(yUp),
                    yDown: Math.round(yDown),
                }
            })
        },
        upvotePolylinePoints() {
            return this.chartPoints.map((p) => `${p.x},${p.yUp}`).join(' ')
        },
        downvotePolylinePoints() {
            return this.chartPoints.map((p) => `${p.x},${p.yDown}`).join(' ')
        },
        upvoteAreaPoints() {
            if (!this.chartPoints.length) return ''
            const firstX = this.chartPoints[0].x
            const lastX = this.chartPoints[this.chartPoints.length - 1].x
            return `${firstX},175 ${this.upvotePolylinePoints} ${lastX},175`
        },
        barChartData() {
            const d = this.modalDeltas
            const earliest = this.modalMap?.earliest
            const now = new Date()

            let startDate = earliest?.first_recorded ? new Date(earliest.first_recorded) : null
            if (!startDate && this.modalMap?.uploaded) {
                startDate = new Date(this.modalMap.uploaded)
            }

            const rawList = [
                { label: '24h', days: 1, upvotes: d.d1.upvotes, downvotes: d.d1.downvotes },
                { label: '7d', days: 7, upvotes: d.d7.upvotes, downvotes: d.d7.downvotes },
                { label: '30d', days: 30, upvotes: d.d30.upvotes, downvotes: d.d30.downvotes },
                { label: '90d', days: 90, upvotes: d.d90.upvotes, downvotes: d.d90.downvotes },
                { label: '180d', days: 180, upvotes: d.d180.upvotes, downvotes: d.d180.downvotes },
                { label: '1y', days: 360, upvotes: d.d360.upvotes, downvotes: d.d360.downvotes },
                { label: '2y', days: 720, upvotes: d.d720.upvotes, downvotes: d.d720.downvotes },
                { label: '3y', days: 1080, upvotes: d.d1080.upvotes, downvotes: d.d1080.downvotes },
            ]

            const list = rawList.filter((item) => {
                const pointTime = new Date(now.getTime() - item.days * 86400 * 1000)
                return !startDate || pointTime > startDate || item.days <= 30
            })

            const maxVal = Math.max(1, ...list.map((i) => Math.max(i.upvotes, i.downvotes)))

            return list.map((item) => ({
                ...item,
                upHeight: Math.max(4, Math.round((item.upvotes / maxVal) * 100)),
                downHeight: Math.max(4, Math.round((item.downvotes / maxVal) * 100)),
            }))
        },
        velocityChartData() {
            const d = this.modalDeltas
            const earliest = this.modalMap?.earliest
            const now = new Date()

            let startDate = earliest?.first_recorded ? new Date(earliest.first_recorded) : null
            if (!startDate && this.modalMap?.uploaded) {
                startDate = new Date(this.modalMap.uploaded)
            }

            const rawList = [
                { label: '24h', days: 1, upvotes: d.d1.upvotes, downvotes: d.d1.downvotes },
                { label: '7d', days: 7, upvotes: d.d7.upvotes, downvotes: d.d7.downvotes },
                { label: '30d', days: 30, upvotes: d.d30.upvotes, downvotes: d.d30.downvotes },
                { label: '90d', days: 90, upvotes: d.d90.upvotes, downvotes: d.d90.downvotes },
                { label: '180d', days: 180, upvotes: d.d180.upvotes, downvotes: d.d180.downvotes },
                { label: '1y', days: 360, upvotes: d.d360.upvotes, downvotes: d.d360.downvotes },
                { label: '2y', days: 720, upvotes: d.d720.upvotes, downvotes: d.d720.downvotes },
                { label: '3y', days: 1080, upvotes: d.d1080.upvotes, downvotes: d.d1080.downvotes },
            ]

            const list = rawList.filter((item) => {
                const pointTime = new Date(now.getTime() - item.days * 86400 * 1000)
                return !startDate || pointTime > startDate || item.days <= 30
            })

            const items = list.map((item) => {
                const total = item.upvotes + item.downvotes
                const rate = Math.round((total / item.days) * 10) / 10
                return { label: item.label, rate }
            })
            const maxRate = Math.max(0.1, ...items.map((i) => i.rate))

            return items.map((i) => ({
                ...i,
                height: Math.max(6, Math.round((i.rate / maxRate) * 100)),
            }))
        },
        breakdownRows() {
            const d = this.modalDeltas
            const e = this.modalMap?.earliest
            const latestUp = this.modalUpvotes
            const latestDown = this.modalDownvotes

            const calcRate = (up, down, days) => {
                const total = up + down
                return Math.round((total / days) * 10) / 10
            }

            return [
                { label: '24 Hours', upvotes: d.d1.upvotes, downvotes: d.d1.downvotes, net: d.d1.upvotes - d.d1.downvotes, rate: calcRate(d.d1.upvotes, d.d1.downvotes, 1) },
                { label: '7 Days', upvotes: d.d7.upvotes, downvotes: d.d7.downvotes, net: d.d7.upvotes - d.d7.downvotes, rate: calcRate(d.d7.upvotes, d.d7.downvotes, 7) },
                { label: '30 Days', upvotes: d.d30.upvotes, downvotes: d.d30.downvotes, net: d.d30.upvotes - d.d30.downvotes, rate: calcRate(d.d30.upvotes, d.d30.downvotes, 30) },
                { label: '90 Days', upvotes: d.d90.upvotes, downvotes: d.d90.downvotes, net: d.d90.upvotes - d.d90.downvotes, rate: calcRate(d.d90.upvotes, d.d90.downvotes, 90) },
                { label: '180 Days', upvotes: d.d180.upvotes, downvotes: d.d180.downvotes, net: d.d180.upvotes - d.d180.downvotes, rate: calcRate(d.d180.upvotes, d.d180.downvotes, 180) },
                { label: '1 Year', upvotes: d.d360.upvotes, downvotes: d.d360.downvotes, net: d.d360.upvotes - d.d360.downvotes, rate: calcRate(d.d360.upvotes, d.d360.downvotes, 360) },
                { label: '2 Years', upvotes: d.d720.upvotes, downvotes: d.d720.downvotes, net: d.d720.upvotes - d.d720.downvotes, rate: calcRate(d.d720.upvotes, d.d720.downvotes, 720) },
                { label: '3 Years', upvotes: d.d1080.upvotes, downvotes: d.d1080.downvotes, net: d.d1080.upvotes - d.d1080.downvotes, rate: calcRate(d.d1080.upvotes, d.d1080.downvotes, 1080) },
                {
                    label: e?.first_recorded ? `Since Tracked (${this.formatDate(e.first_recorded)})` : 'Since Tracked (First DB Entry)',
                    upvotes: e?.upvotes || 0,
                    downvotes: e?.downvotes || 0,
                    net: (e?.upvotes || 0) - (e?.downvotes || 0),
                    rate: calcRate(e?.upvotes || 0, e?.downvotes || 0, 365),
                    isHighlight: true,
                    tag: 'Since Tracked',
                },
                {
                    label: 'All Time (Total Lifetime)',
                    upvotes: latestUp,
                    downvotes: latestDown,
                    net: latestUp - latestDown,
                    rate: calcRate(latestUp, latestDown, 365),
                    isHighlight: true,
                    tag: 'Total',
                },
            ]
        },
    },
    methods: {
        onKeyDown(e) {
            if (e.key === 'Escape' && this.modalMap) {
                this.closeModal()
            }
        },
        openMapModal(map) {
            if (!map) return
            const fullMap = this.maps.find((m) => (m.key && m.key === map.key) || (m.hash && m.hash === map.hash))
            this.modalMap = fullMap || map
            this.chartType = 'growth'
            this.hoveredPoint = null
        },
        closeModal() {
            this.modalMap = null
        },
        readQueryParams() {
            const q = this.$route.query
            if (q.page) this.currentPage = parseInt(q.page) || 1
            if (q.page_size) this.pageSize = parseInt(q.page_size) || 10
            if (q.search) this.searchQuery = q.search
            if (q.ordering) this.currentOrdering = q.ordering
        },
        updateQueryParams() {
            const query = {}
            if (this.selectedMapper && this.selectedMapper.mapperId) {
                query.mapperId = this.selectedMapper.mapperId
            }
            if (this.currentPage > 1) query.page = this.currentPage
            if (this.pageSize && this.pageSize !== 10) query.page_size = this.pageSize
            if (this.searchQuery) query.search = this.searchQuery
            if (this.currentOrdering && this.currentOrdering !== '-uploaded') {
                query.ordering = this.currentOrdering
            }
            const res = this.$router.replace({ query })
            if (res && typeof res.catch === 'function') {
                res.catch(() => {})
            }
        },
        async fetchMappers() {
            this.loading = true
            try {
                const mappers = await this.$defaultApi.$get('beatsaver/bsst_mappers')
                this.mappers = mappers || []

                const targetId = this.$route.query.mapperId
                if (targetId) {
                    this.selectedMapper = this.mappers.find((i) => i.mapperId == targetId) || this.mappers[0] || null
                } else if (this.mappers.length > 0) {
                    this.selectedMapper = this.mappers[0]
                }
            } catch (e) {
                console.error('Failed to load BSST mappers:', e)
            }

            if (this.selectedMapper) {
                await this.fetchMapperData()
            } else {
                this.loading = false
            }
        },
        async fetchMapperData() {
            await Promise.all([this.fetchMaps(), this.fetchInsights()])
        },
        _abortPendingFetch() {
            if (this._fetchController) {
                this._fetchController.abort()
            }
            this._fetchController = new AbortController()
            return this._fetchController.signal
        },
        async fetchInsights() {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return
            try {
                this.insights = await this.$defaultApi.$get(
                    `beatsaver/bsst_insights/${this.selectedMapper.mapperId}`,
                    { signal: this._fetchController?.signal }
                )
            } catch (e) {
                if (e?.code === 'ERR_CANCELED' || e?.name === 'AbortError' || e?.name === 'CanceledError') return
                console.error('Failed to fetch mapper insights:', e)
                this.insights = null
            }
        },
        async fetchMaps() {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return

            // Abort any in-flight requests and get a fresh signal
            const signal = this._abortPendingFetch()

            this.tableLoading = true
            try {
                const params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                }
                if (this.searchQuery && this.searchQuery.trim()) {
                    params.search = this.searchQuery.trim()
                }
                if (this.currentOrdering) {
                    params.ordering = this.currentOrdering
                }

                const response = await this.$defaultApi.$get(
                    `beatsaver/bsst/${this.selectedMapper.mapperId}`,
                    { params, signal }
                )

                if (response && response.results !== undefined) {
                    this.maps = response.results
                    this.totalCount = response.count || 0
                } else if (Array.isArray(response)) {
                    this.maps = response
                    this.totalCount = response.length
                } else {
                    this.maps = []
                    this.totalCount = 0
                }
            } catch (e) {
                // Silently ignore aborted requests — another fetch is already on its way
                if (e?.code === 'ERR_CANCELED' || e?.name === 'AbortError' || e?.name === 'CanceledError') return
                console.error('Failed to fetch maps:', e)
                this.maps = []
                this.totalCount = 0
            } finally {
                // Only clear the loading spinner if this signal wasn't aborted
                if (!signal.aborted) {
                    this.loading = false
                    this.tableLoading = false
                }
            }
        },
        async toggleCompare() {
            if (this.showCompare) {
                this.showCompare = false
                return
            }
            if (this.compareData) {
                this.showCompare = true
                return
            }
            this.compareLoading = true
            try {
                this.compareData = await this.$defaultApi.$get('beatsaver/bsst_compare')
                this.showCompare = true
            } catch (e) {
                console.error('Failed to load compare data:', e)
            } finally {
                this.compareLoading = false
            }
        },
        sortedBy(key) {
            if (!this.compareData) return []
            return [...this.compareData].sort((a, b) => (b[key] || 0) - (a[key] || 0))
        },
        compareBarWidth(entry) {
            if (!this.compareData || !this.compareData.length) return 0
            const max = Math.max(...this.compareData.map((e) => e[this.compareMetric] || 0))
            if (max === 0) return 0
            return Math.round(((entry[this.compareMetric] || 0) / max) * 100)
        },
        formatCompareValue(entry) {
            const v = entry[this.compareMetric]
            if (this.compareMetric === 'overallRatio') return `${v}%`
            if (this.compareMetric === 'mapsPerMonth') return `${v}/mo`
            if (this.compareMetric === 'avgStar') return `★ ${v}`
            if (this.compareMetric === 'totalDurationSec') return entry.totalDurationStr
            return typeof v === 'number' ? v.toLocaleString() : v
        },
        jumpToMapper(entry) {
            const mapper = this.mappers.find((m) => m.mapperId == entry.mapperId)
            if (mapper) {
                this.selectedMapper = mapper
                this.showCompare = false
                this.onMapperChange()
            }
        },
        onMapperChange() {
            this.currentPage = 1
            this.updateQueryParams()
            this.fetchMapperData()
        },
        onPageSizeChange() {
            this.currentPage = 1
            this.updateQueryParams()
            this.fetchMaps()
        },
        onSearchInput() {
            if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer)
            this.searchDebounceTimer = setTimeout(() => {
                this.currentPage = 1
                this.updateQueryParams()
                this.fetchMaps()
            }, 350)
        },
        clearSearch() {
            this.searchQuery = ''
            this.currentPage = 1
            this.updateQueryParams()
            this.fetchMaps()
        },
        onOrderingChange() {
            this.currentPage = 1
            this.updateQueryParams()
            this.fetchMaps()
        },
        toggleSort(field) {
            if (this.currentOrdering === `-${field}`) {
                this.currentOrdering = field
            } else {
                this.currentOrdering = `-${field}`
            }
            this.currentPage = 1
            this.updateQueryParams()
            this.fetchMaps()
        },
        getSortIcon(field) {
            if (this.currentOrdering === `-${field}`) return 'bx bx-sort-down text-blue-400 ml-1'
            if (this.currentOrdering === field) return 'bx bx-sort-up text-blue-400 ml-1'
            return 'bx bx-sort-alt-2 opacity-30 hover:opacity-100 ml-1'
        },
        goToPage(page) {
            if (page < 1 || page > this.totalPages || page === this.currentPage) return
            this.currentPage = page
            this.updateQueryParams()
            this.fetchMaps()
        },
        formatDate(dateStr) {
            if (!dateStr) return '-'
            try {
                const d = new Date(dateStr)
                return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            } catch (e) {
                return dateStr
            }
        },
        onImageError(e) {
            e.target.src = 'https://beatsaver.com/static/favicon/apple-touch-icon.png'
        },
    },
}
</script>

<style lang="scss" scoped>
.bsst {
    min-height: 100vh;
}
</style>
