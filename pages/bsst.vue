<template>
    <div class="bsst pb-12">
        <sub-header title="Beatsaver Stats Tracker">
            <p>
                Tracks upvote and downvote changes across entire mapper accounts and individual maps over time.
                <br />
                Click any map or standout card to open detailed historical charts and difficulty stats.
            </p>
        </sub-header>

        <div class="w-full max-w-[1440px] mx-auto px-4 sm:px-8 mt-6 space-y-6">
            <!-- Top Mapper Bar -->
            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-3">
                    <label class="text-xs font-medium text-gray-400 whitespace-nowrap">Mapper</label>
                    <Dropdown
                        v-if="mappers && mappers.length"
                        v-model="selectedMapper"
                        :options="mappers"
                        optionLabel="mapperName"
                        placeholder="Select mapper"
                        scrollHeight="400px"
                        :disabled="mappersLoading"
                        class="w-56 p-inputtext-sm"
                        @change="onMapperChange"
                    />
                    <ProgressSpinner v-if="mappersLoading" style="width: 20px; height: 20px" strokeWidth="4" />

                    <a
                        v-if="selectedMapper && selectedMapper.mapperId"
                        :href="`https://beatsaver.com/profile/${selectedMapper.mapperId}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="nope text-xs text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                    >
                        BeatSaver Profile <i class="bx bx-link-external text-xs"></i>
                    </a>
                </div>

                <div class="flex items-center gap-2">
                    <button
                        v-if="insights"
                        @click="showAnalytics = !showAnalytics"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border bg-[#25282c] hover:bg-[#2e3238] border-white/[0.08] text-gray-300 flex items-center gap-1.5"
                    >
                        <i :class="['bx text-sm', showAnalytics ? 'bx-hide' : 'bx-line-chart']"></i>
                        <span>{{ showAnalytics ? 'Hide Graphs' : 'Show Graphs' }}</span>
                    </button>
                    <button
                        @click="toggleCompare"
                        :disabled="compareLoading"
                        :class="[
                            'px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border',
                            showCompare
                                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                                : 'bg-[#25282c] hover:bg-[#2e3238] border-white/[0.08] text-gray-200',
                        ]"
                    >
                        <ProgressSpinner v-if="compareLoading" style="width: 14px; height: 14px" strokeWidth="4" />
                        <i v-else class="bx bx-git-compare text-sm"></i>
                        <span>{{ showCompare ? 'Close Compare' : 'Compare Mappers' }}</span>
                    </button>
                </div>
            </div>

            <!-- Cross-Mapper Comparison Panel -->
            <compare-panel
                v-if="showCompare && compareData && compareData.length"
                :compareData="compareData"
                :selectedMapperId="selectedMapper && selectedMapper.mapperId"
                @select-mapper="jumpToMapper"
            />

            <!-- Account Overview + Rich 8-Stat Strip -->
            <div v-if="insights" class="space-y-4">
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
                    <!-- Account Identity & Ratio Header -->
                    <div class="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06]">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-100">{{ insights.mapperName }}</h2>
                            <p class="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span>Active since {{ formatDate(insights.firstUpload) }}</span>
                                <span v-if="insights.latestUpload" class="text-gray-600">·</span>
                                <span v-if="insights.latestUpload">Latest {{ formatDate(insights.latestUpload) }}</span>
                                <span v-if="insights.careerDays" class="text-gray-600">·</span>
                                <span v-if="insights.careerDays">{{ (insights.careerDays / 365.25).toFixed(1) }}y span</span>
                                <span class="text-gray-600">·</span>
                                <span>{{ insights.mapsPerMonth }} maps/mo</span>
                                <span class="text-gray-600">·</span>
                                <span>{{ insights.totalDurationStr }} mapped</span>
                            </p>
                        </div>

                        <div class="flex items-center gap-6">
                            <div class="text-right">
                                <span class="text-[11px] text-gray-400 block">Approval</span>
                                <span class="text-base font-semibold font-mono text-emerald-400">{{ insights.overallRatio }}%</span>
                                <div class="w-24 h-1 bg-rose-500/50 rounded-full overflow-hidden mt-1 ml-auto">
                                    <div class="h-full bg-emerald-400" :style="{ width: `${insights.overallRatio}%` }"></div>
                                </div>
                            </div>
                            <div class="text-right font-mono">
                                <span class="text-[11px] text-gray-400 block font-sans">Net Score</span>
                                <span class="text-base font-semibold text-gray-100">
                                    {{ insights.netScore >= 0 ? '+' : '' }}{{ insights.netScore.toLocaleString() }}
                                </span>
                                <span class="text-[11px] text-gray-500 block">
                                    {{ (insights.totalVotes || insights.totalUpvotes + insights.totalDownvotes).toLocaleString() }} total
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 8-Metric Grid (2 rows of 4 on desktop) -->
                    <div class="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                        <div class="px-4 py-3.5 border-b border-white/[0.06]">
                            <span class="text-xs text-gray-400 block">Total Upvotes</span>
                            <div class="text-lg font-semibold font-mono text-emerald-400 mt-0.5">
                                +{{ insights.totalUpvotes.toLocaleString() }}
                            </div>
                            <span class="text-[11px] font-mono text-rose-400/80">-{{ insights.totalDownvotes.toLocaleString() }} down</span>
                        </div>

                        <div class="px-4 py-3.5 border-b border-white/[0.06]">
                            <span class="text-xs text-gray-400 block">30d Growth</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                +{{ insights.growth30d.toLocaleString() }}
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                +{{ insights.dailyGrowth30d }}/d · 7d: +{{ insights.growth7d.toLocaleString() }}
                            </span>
                        </div>

                        <div class="px-4 py-3.5 border-b border-white/[0.06]">
                            <span class="text-xs text-gray-400 block">1y / 24h Growth</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ accountExtraStats.growth1y !== null ? '+' + accountExtraStats.growth1y.toLocaleString() : '-' }}
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                24h: {{ accountExtraStats.growth24h !== null ? '+' + accountExtraStats.growth24h.toLocaleString() : '-' }}
                                <span v-if="accountExtraStats.growth90d !== null"> · 90d: +{{ accountExtraStats.growth90d.toLocaleString() }}</span>
                            </span>
                        </div>

                        <div class="px-4 py-3.5 border-b border-white/[0.06]">
                            <span class="text-xs text-gray-400 block">Avg / Median Upvotes</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ accountExtraStats.avgUpvotes.toLocaleString() }}
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                Median {{ accountExtraStats.medianUpvotes !== null ? accountExtraStats.medianUpvotes.toLocaleString() : '-' }} / map
                            </span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Catalog Size</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ insights.totalMaps }} <span class="text-xs font-normal text-gray-400">maps</span>
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                {{ accountExtraStats.totalDiffs !== null ? accountExtraStats.totalDiffs + ' diffs' : insights.totalDurationStr }}
                                <span v-if="accountExtraStats.avgDurationStr"> · avg {{ accountExtraStats.avgDurationStr }}</span>
                            </span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Total Notes Mapped</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ accountExtraStats.totalNotesStr }}
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                {{ accountExtraStats.avgNotesPerDiff !== null ? accountExtraStats.avgNotesPerDiff.toLocaleString() + ' notes/diff' : 'across all diffs' }}
                            </span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Ranked / Starred</span>
                            <div class="text-lg font-semibold font-mono text-amber-400 mt-0.5">
                                {{ insights.starredCount }} <span class="text-xs font-normal text-gray-400">({{ Math.round((insights.starredCount / Math.max(1, insights.totalMaps)) * 100) }}%)</span>
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                Avg ★ {{ insights.avgStar }} · Max ★ {{ insights.highestStarMap?.highestStar ? insights.highestStarMap.highestStar.toFixed(1) : '-' }}
                            </span>
                        </div>

                        <div class="px-4 py-3.5">
                            <span class="text-xs text-gray-400 block">Average BPM</span>
                            <div class="text-lg font-semibold font-mono text-gray-100 mt-0.5">
                                {{ insights.avgBpm }}
                            </div>
                            <span class="text-[11px] font-mono text-gray-500">
                                {{ insights.minBpmMap?.bpm ? Math.round(insights.minBpmMap.bpm) : '-' }}–{{ insights.maxBpmMap?.bpm ? Math.round(insights.maxBpmMap.bpm) : '-' }} BPM
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Account-Wide Graphs Suite -->
                <account-graphs
                    v-if="showAnalytics"
                    :maps="allMapperMaps"
                    :insights="insights"
                    :loading="analyticsLoading"
                    @select-map="openMapModal"
                />

                <!-- Standout Maps (6 Compact Cards) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
                    <div
                        v-for="card in standoutCards"
                        :key="card.label"
                        @click="openMapModal(card.map)"
                        class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-3 cursor-pointer transition-colors flex flex-col justify-between gap-2"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-[11px] text-gray-400">{{ card.label }}</span>
                            <span :class="['text-xs font-mono font-semibold shrink-0', card.valueClass]">{{ card.value }}</span>
                        </div>
                        <div class="min-w-0">
                            <div class="font-medium text-gray-100 text-xs truncate" :title="card.map.songName">
                                {{ card.map.songName }}
                            </div>
                            <div class="text-[11px] text-gray-500 truncate">{{ card.map.songAuthorName }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Maps Table Section -->
            <div class="space-y-3">
                <!-- Integrated Table Header & Filters -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden flex flex-col">
                    <div class="px-4 py-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-2">
                            <h3 class="text-sm font-semibold text-gray-100">
                                {{ selectedMapper ? `${selectedMapper.mapperName}'s Maps` : 'Maps' }}
                            </h3>
                            <span v-if="totalCount > 0" class="text-xs text-gray-500 font-mono">({{ totalCount }})</span>
                        </div>

                        <div class="flex flex-wrap items-center gap-2.5 flex-1 justify-end">
                            <div class="relative flex-1 min-w-[180px] max-w-xs">
                                <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none"></i>
                                <input
                                    type="text"
                                    v-model="searchQuery"
                                    @input="onSearchInput"
                                    placeholder="Search song, artist, mapper..."
                                    class="w-full bg-[#141417] text-gray-100 placeholder-gray-500 border border-white/[0.08] focus:border-blue-500 rounded-lg pl-9 pr-8 py-1.5 text-xs sm:text-sm outline-none transition-colors"
                                />
                                <button
                                    v-if="searchQuery"
                                    @click="clearSearch"
                                    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 text-base transition-colors"
                                    title="Clear search"
                                >
                                    <i class="bx bx-x"></i>
                                </button>
                            </div>

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

                            <Dropdown
                                v-model="pageSize"
                                :options="pageSizeOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Per page"
                                class="w-32 p-inputtext-sm"
                                :disabled="tableLoading"
                                @change="onPageSizeChange"
                            />
                        </div>
                    </div>

                    <!-- Table Body Container -->
                    <div class="relative min-h-[460px] flex flex-col justify-between">
                        <!-- In-Table Loading Overlay -->
                        <div
                            v-if="tableLoading && maps && maps.length"
                            class="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center"
                        >
                            <div class="bg-[#1e2023] border border-white/10 px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5">
                                <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="4" />
                                <span class="text-xs text-gray-200">Updating...</span>
                            </div>
                        </div>

                        <!-- Initial Loading -->
                        <div v-if="loading && (!maps || !maps.length)" class="p-16 flex flex-col items-center justify-center flex-1">
                            <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
                            <span class="text-gray-400 mt-3 text-sm">Loading maps...</span>
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="!loading && (!maps || maps.length === 0)" class="p-16 text-center text-gray-400 flex flex-col items-center justify-center flex-1">
                            <p class="text-sm font-medium text-gray-200">No maps found</p>
                            <p class="text-xs text-gray-500 mt-1">Try adjusting your search query or selecting a different mapper.</p>
                            <button
                                v-if="searchQuery"
                                @click="clearSearch"
                                class="mt-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                                Clear Search
                            </button>
                        </div>

                        <template v-else>
                            <!-- Scrollable Table -->
                            <div class="overflow-x-auto w-full flex-1">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-[#141417] border-b border-white/[0.06] text-xs font-medium text-gray-400 select-none">
                                            <th class="py-3 px-4 min-w-[220px] max-w-[260px]">Map</th>
                                            <th
                                                @click="toggleSort('uploaded')"
                                                class="py-3 px-3 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                            >
                                                Uploaded <i :class="getSortIcon('uploaded')"></i>
                                            </th>
                                            <th
                                                @click="toggleSort('highestStar')"
                                                class="py-3 px-3 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                            >
                                                Stars <i :class="getSortIcon('highestStar')"></i>
                                            </th>
                                            <th
                                                @click="toggleSort('bpm')"
                                                class="py-3 px-3 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                            >
                                                BPM <i :class="getSortIcon('bpm')"></i>
                                            </th>
                                            <th
                                                @click="toggleSort('upvotes')"
                                                class="py-3 px-3 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                            >
                                                Votes <i :class="getSortIcon('upvotes')"></i>
                                            </th>
                                            <th
                                                @click="toggleSort('ratio')"
                                                class="py-3 px-3 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                            >
                                                Ratio <i :class="getSortIcon('ratio')"></i>
                                            </th>
                                            <th
                                                v-for="range in timeRanges"
                                                :key="range.key"
                                                @click="toggleSort(range.key)"
                                                class="py-3 px-2.5 text-center whitespace-nowrap cursor-pointer hover:text-white transition-colors min-w-[78px]"
                                            >
                                                {{ range.label }} <i :class="getSortIcon(range.key)"></i>
                                            </th>
                                            <th class="py-3 px-3 text-center whitespace-nowrap"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-white/[0.05] text-sm">
                                        <tr
                                            v-for="map in maps"
                                            :key="map.key || map.hash"
                                            @click="openMapModal(map)"
                                            class="hover:bg-white/[0.03] cursor-pointer transition-colors"
                                        >
                                            <!-- Map Info -->
                                            <td class="py-3 px-4 min-w-[220px] max-w-[260px]">
                                                <div class="flex items-center gap-2.5">
                                                    <div class="w-10 h-10 rounded-md overflow-hidden bg-[#141417] shrink-0">
                                                        <img
                                                            :src="map.hash ? `https://cdn.scoresaber.com/covers/${map.hash.toUpperCase()}.png` : '/favicon.ico'"
                                                            @error="onImageError"
                                                            alt="Cover"
                                                            class="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div class="min-w-0">
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

                                            <!-- Uploaded -->
                                            <td class="py-3 px-3 text-center text-xs text-gray-300 whitespace-nowrap font-mono">
                                                {{ formatDate(map.uploaded) }}
                                            </td>

                                            <!-- Stars -->
                                            <td class="py-3 px-3 text-center whitespace-nowrap font-mono text-xs">
                                                <span v-if="map.highestStar && map.highestStar > 0" class="text-amber-400 font-semibold">
                                                    ★ {{ map.highestStar.toFixed(1) }}
                                                </span>
                                                <span v-else class="text-gray-600">-</span>
                                            </td>

                                            <!-- BPM -->
                                            <td class="py-3 px-3 text-center text-xs font-mono text-gray-300 whitespace-nowrap">
                                                {{ map.bpm ? Math.round(map.bpm) : '-' }}
                                            </td>

                                            <!-- Total Votes -->
                                            <td class="py-3 px-3 text-center whitespace-nowrap">
                                                <div class="inline-flex flex-col items-center font-mono">
                                                    <div class="text-xs font-semibold">
                                                        <span class="text-emerald-400">+{{ map.latest?.upvotes ?? map.upvotes ?? 0 }}</span>
                                                        <span class="text-gray-600 mx-0.5">/</span>
                                                        <span class="text-rose-400">-{{ map.latest?.downvotes ?? map.downvotes ?? 0 }}</span>
                                                    </div>
                                                    <span class="text-[10px] text-gray-500">
                                                        {{ (map.latest?.upvotes ?? map.upvotes ?? 0) + (map.latest?.downvotes ?? map.downvotes ?? 0) }} total
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Approval Ratio -->
                                            <td class="py-3 px-3 text-center whitespace-nowrap">
                                                <div class="inline-flex flex-col items-center gap-1">
                                                    <span class="text-xs font-mono text-gray-200">{{ getMapRatio(map) }}%</span>
                                                    <div class="w-12 h-1 bg-rose-500/40 rounded-full overflow-hidden">
                                                        <div class="h-full bg-emerald-400" :style="{ width: `${getMapRatio(map)}%` }"></div>
                                                    </div>
                                                </div>
                                            </td>

                                            <!-- Time Range Deltas -->
                                            <td
                                                v-for="range in timeRanges"
                                                :key="range.key"
                                                class="py-3 px-2.5 text-center whitespace-nowrap"
                                            >
                                                <div
                                                    v-if="map[range.key]"
                                                    class="text-xs font-mono inline-flex items-center justify-center gap-0.5"
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
                                            <td class="py-3 px-3 text-center whitespace-nowrap" @click.stop>
                                                <button
                                                    @click="openMapModal(map)"
                                                    class="p-1.5 rounded-md bg-[#25282c] hover:bg-blue-600 text-gray-300 hover:text-white transition-colors"
                                                    title="View map stats & graphs"
                                                >
                                                    <i class="bx bx-line-chart text-base"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Bottom Pagination Bar -->
                            <div v-if="totalPages > 1" class="bg-[#141417] border-t border-white/[0.06] px-4 py-3 flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
                                <div class="text-xs text-gray-400 font-mono">
                                    Page {{ currentPage }} of {{ totalPages }} ({{ totalCount }} maps)
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
            </div>
        </div>

        <!-- Detailed Map Modal -->
        <map-detail-modal
            :map="modalMap"
            :allMaps="allMapperMaps.length ? allMapperMaps : maps"
            :insights="insights"
            :mapperName="selectedMapper ? selectedMapper.mapperName : ''"
            :totalCount="totalCount"
            @close="closeModal"
        />
    </div>
</template>

<script>
import AccountGraphs from '@/components/bsst/AccountGraphs.vue'
import ComparePanel from '@/components/bsst/ComparePanel.vue'
import MapDetailModal from '@/components/bsst/MapDetailModal.vue'

export default {
    transition: 'slide-bottom',
    components: {
        AccountGraphs,
        ComparePanel,
        MapDetailModal,
    },
    data() {
        return {
            selectedMapper: null,
            mappers: [],
            maps: [],
            allMapperMaps: [],
            allMapsCache: {},
            insights: null,
            totalCount: 0,
            pageSize: 10,
            pageSizeOptions: [
                { label: '10 / page', value: 10 },
                { label: '25 / page', value: 25 },
                { label: '50 / page', value: 50 },
                { label: '100 / page', value: 100 },
            ],
            currentPage: 1,
            searchQuery: '',
            currentOrdering: '-uploaded',
            loading: false,
            tableLoading: false,
            analyticsLoading: false,
            showAnalytics: true,
            _tableAbortController: null,
            _mapperAbortController: null,
            mappersLoading: false,
            searchDebounceTimer: null,
            modalMap: null,
            showCompare: false,
            compareLoading: false,
            compareData: null,
            sortOptions: [
                { label: 'Newest Uploaded', value: '-uploaded' },
                { label: 'Oldest Uploaded', value: 'uploaded' },
                { label: 'Highest Stars', value: '-highestStar' },
                { label: 'Lowest Stars', value: 'highestStar' },
                { label: 'Highest Upvotes', value: '-upvotes' },
                { label: 'Highest Downvotes', value: '-downvotes' },
                { label: 'Highest BPM', value: '-bpm' },
                { label: 'Lowest BPM', value: 'bpm' },
                { label: 'Highest Ratio', value: '-ratio' },
                { label: 'Most 24h Activity', value: '-days-1' },
                { label: 'Most 7d Activity', value: '-days-7' },
                { label: 'Most 30d Activity', value: '-days-30' },
                { label: 'Most 90d Activity', value: '-days-90' },
                { label: 'Most 180d Activity', value: '-days-180' },
                { label: 'Most 1y Activity', value: '-days-360' },
                { label: 'Most 2y Activity', value: '-days-720' },
                { label: 'Most 3y Activity', value: '-days-1080' },
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
        accountExtraStats() {
            const totalMaps = Math.max(1, this.insights?.totalMaps || 1)
            const avgUpvotes = Math.round((this.insights?.totalUpvotes || 0) / totalMaps)

            if (!this.allMapperMaps.length) {
                return {
                    avgUpvotes,
                    medianUpvotes: null,
                    growth24h: null,
                    growth90d: null,
                    growth1y: null,
                    totalDiffs: null,
                    totalNotesStr: '-',
                    avgNotesPerDiff: null,
                    avgDurationStr: null,
                }
            }

            const ups = this.allMapperMaps.map((m) => m.latest?.upvotes ?? m.upvotes ?? 0).sort((a, b) => a - b)
            const medianUpvotes = ups[Math.floor(ups.length / 2)] || 0

            const sumRange = (key) =>
                this.allMapperMaps.reduce((acc, m) => acc + (m[key]?.upvotes || 0) + (m[key]?.downvotes || 0), 0)

            let totalDiffs = 0
            let totalNotes = 0
            let totalDur = 0
            let durCount = 0

            for (const m of this.allMapperMaps) {
                if (m.duration) {
                    totalDur += Number(m.duration)
                    durCount++
                }
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
                for (const d of diffs) {
                    totalDiffs++
                    totalNotes += Number(d.Notes || 0)
                }
            }

            const avgDur = durCount ? Math.round(totalDur / durCount) : 0
            const avgDurationStr = avgDur ? `${Math.floor(avgDur / 60)}m ${String(avgDur % 60).padStart(2, '0')}s` : null
            const totalNotesStr =
                totalNotes >= 1000000
                    ? (totalNotes / 1000000).toFixed(2) + 'M'
                    : totalNotes >= 1000
                    ? (totalNotes / 1000).toFixed(1) + 'k'
                    : String(totalNotes)

            return {
                avgUpvotes,
                medianUpvotes,
                growth24h: sumRange('days-1'),
                growth90d: sumRange('days-90'),
                growth1y: sumRange('days-360'),
                totalDiffs,
                totalNotesStr,
                avgNotesPerDiff: totalDiffs ? Math.round(totalNotes / totalDiffs) : null,
                avgDurationStr,
            }
        },
        standoutCards() {
            if (!this.insights) return []
            const cards = []
            if (this.insights.mostUpvotedMap) {
                cards.push({
                    label: 'Most Upvoted',
                    map: this.insights.mostUpvotedMap,
                    value: `+${this.insights.mostUpvotedMap.upvotes.toLocaleString()}`,
                    valueClass: 'text-emerald-400',
                })
            }
            if (this.insights.highestRatioMap) {
                cards.push({
                    label: 'Best Approval',
                    map: this.insights.highestRatioMap,
                    value: `${this.insights.highestRatioMap.ratio}%`,
                    valueClass: 'text-emerald-400',
                })
            }
            if (this.insights.highestStarMap) {
                cards.push({
                    label: 'Hardest Map',
                    map: this.insights.highestStarMap,
                    value: `★ ${this.insights.highestStarMap.highestStar.toFixed(1)}`,
                    valueClass: 'text-amber-400',
                })
            }
            if (this.insights.maxBpmMap) {
                cards.push({
                    label: 'Fastest BPM',
                    map: this.insights.maxBpmMap,
                    value: `${Math.round(this.insights.maxBpmMap.bpm)} BPM`,
                    valueClass: 'text-gray-200',
                })
            }
            if (this.insights.minBpmMap) {
                cards.push({
                    label: 'Slowest BPM',
                    map: this.insights.minBpmMap,
                    value: `${Math.round(this.insights.minBpmMap.bpm)} BPM`,
                    valueClass: 'text-gray-300',
                })
            }
            if (this.insights.mostControversialMap) {
                cards.push({
                    label: 'Most Controversial',
                    map: this.insights.mostControversialMap,
                    value: `${this.insights.mostControversialMap.ratio}%`,
                    valueClass: 'text-rose-400',
                })
            }
            return cards
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
            const match = (list) => list.find((m) => (m.key && m.key === map.key) || (m.hash && m.hash === map.hash))
            this.modalMap = match(this.allMapperMaps) || match(this.maps) || map
        },
        closeModal() {
            this.modalMap = null
        },
        getMapRatio(map) {
            const up = map.latest?.upvotes ?? map.upvotes ?? 0
            const down = map.latest?.downvotes ?? map.downvotes ?? 0
            if (up + down === 0) return 0
            return Math.round((up / (up + down)) * 1000) / 10
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
            this.mappersLoading = true
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
            } finally {
                this.mappersLoading = false
            }

            if (this.selectedMapper) {
                await this.fetchMapperData()
            } else {
                this.loading = false
            }
        },
        async fetchMapperData() {
            if (this._mapperAbortController) this._mapperAbortController.abort()
            this._mapperAbortController = new AbortController()
            const signal = this._mapperAbortController.signal

            await Promise.all([
                this.fetchMaps(),
                this.fetchInsights(signal),
                this.fetchAllMapperMaps(signal),
            ])
        },
        async fetchInsights(signal) {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return
            try {
                this.insights = await this.$defaultApi.$get(
                    `beatsaver/bsst_insights/${this.selectedMapper.mapperId}`,
                    { signal }
                )
            } catch (e) {
                if (e?.code === 'ERR_CANCELED' || e?.name === 'AbortError' || e?.name === 'CanceledError') return
                console.error('Failed to fetch mapper insights:', e)
                this.insights = null
            }
        },
        async fetchAllMapperMaps(signal) {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return
            const id = this.selectedMapper.mapperId

            if (this.allMapsCache[id]) {
                this.allMapperMaps = this.allMapsCache[id]
                return
            }

            this.analyticsLoading = true
            this.allMapperMaps = []
            try {
                const res = await this.$defaultApi.$get(`beatsaver/bsst/${id}`, {
                    params: { page: 1, page_size: 1000, ordering: '-uploaded' },
                    signal,
                })
                const list = Array.isArray(res) ? res : res?.results || []
                this.allMapsCache[id] = list
                this.allMapperMaps = list
            } catch (e) {
                if (e?.code === 'ERR_CANCELED' || e?.name === 'AbortError' || e?.name === 'CanceledError') return
                console.error('Failed to fetch full mapper catalog:', e)
            } finally {
                if (!signal?.aborted) {
                    this.analyticsLoading = false
                }
            }
        },
        async fetchMaps() {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return

            if (this._tableAbortController) this._tableAbortController.abort()
            this._tableAbortController = new AbortController()
            const signal = this._tableAbortController.signal

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
                if (e?.code === 'ERR_CANCELED' || e?.name === 'AbortError' || e?.name === 'CanceledError') return
                console.error('Failed to fetch maps:', e)
                this.maps = []
                this.totalCount = 0
            } finally {
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
            if (this.currentOrdering === `-${field}`) return 'bx bx-sort-down text-blue-400 ml-0.5'
            if (this.currentOrdering === field) return 'bx bx-sort-up text-blue-400 ml-0.5'
            return 'bx bx-sort-alt-2 opacity-30 hover:opacity-100 ml-0.5'
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
