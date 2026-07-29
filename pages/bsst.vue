<template>
    <div class="bsst pb-12">
        <sub-header title="Beatsaver Stats Tracker">
            <p>
                Tracks upvote and downvote changes for maps over time since earliest recorded database stats.
                <br />
                Click on any map row to view complete historical growth charts and timeframe breakdowns.
            </p>
        </sub-header>

        <!-- Full Width Container -->
        <div class="w-full px-4 sm:px-8 mt-6">
            <!-- Controls Header Card -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
                <!-- Mapper Selector -->
                <div class="flex items-center gap-3">
                    <label class="text-sm font-semibold text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                        <i class="bx bx-user text-blue-400 text-lg"></i> Mapper:
                    </label>
                    <Dropdown
                        v-if="mappers && mappers.length"
                        v-model="selectedMapper"
                        :options="mappers"
                        optionLabel="mapperName"
                        placeholder="Select mapper"
                        scrollHeight="400px"
                        :disabled="tableLoading || mappersLoading"
                        class="w-56 p-inputtext-sm"
                        @change="onMapperChange"
                    />
                    <ProgressSpinner v-if="mappersLoading" style="width: 24px; height: 24px" />
                </div>

                <!-- Search Input -->
                <div class="relative flex-1 min-w-[200px] max-w-md">
                    <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                    <input
                        type="text"
                        v-model="searchQuery"
                        @input="onSearchInput"
                        placeholder="Search song, artist, or mapper..."
                        class="w-full bg-[#121315] text-gray-100 placeholder-gray-500 border border-gray-700 focus:border-blue-500 rounded-lg pl-9 pr-9 py-2 text-sm outline-none transition-all"
                    />
                    <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full text-base transition-colors"
                        title="Clear search"
                    >
                        <i class="bx bx-x"></i>
                    </button>
                </div>

                <!-- Quick Ordering Selector -->
                <div class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                        <i class="bx bx-sort-alt-2 text-blue-400 text-lg"></i> Sort by:
                    </label>
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

                <!-- Items Per Page Selector -->
                <div class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                        <i class="bx bx-list-ol text-blue-400 text-lg"></i> Per page:
                    </label>
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
            </div>

            <!-- Deep Mapper Insights Analytics Dashboard -->
            <div v-if="insights" class="space-y-6 mb-8">
                <!-- Mapper Spotlight Banner -->
                <div class="bg-[#18191c] border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-100">{{ insights.mapperName }}</h2>
                        <p class="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
                            <span><i class="bx bx-calendar text-blue-400"></i> Active since <strong class="text-gray-200">{{ formatDate(insights.firstUpload) }}</strong></span>
                            <span class="text-gray-600">•</span>
                            <span><i class="bx bx-tachometer text-amber-400"></i> Output: <strong class="text-gray-200">{{ insights.mapsPerMonth }} maps/month</strong></span>
                            <span class="text-gray-600">•</span>
                            <span><i class="bx bx-music text-purple-400"></i> Total Mapped Music: <strong class="text-gray-200">{{ insights.totalDurationStr }}</strong></span>
                        </p>
                    </div>

                    <div class="flex items-center gap-3 font-mono">
                        <div class="bg-[#121315] border border-gray-800 px-4 py-2 rounded-xl text-right">
                            <span class="text-[11px] text-gray-400 block uppercase">Overall Approval</span>
                            <span class="text-lg font-bold text-emerald-400">{{ insights.overallRatio }}%</span>
                        </div>
                        <div class="bg-[#121315] border border-gray-800 px-4 py-2 rounded-xl text-right">
                            <span class="text-[11px] text-gray-400 block uppercase">Catalog Net Score</span>
                            <span class="text-lg font-bold text-blue-400">+{{ insights.netScore.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>

                <!-- 6 Metric Highlight Cards Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <!-- 1. Total Upvotes -->
                    <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Upvotes</span>
                        <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">
                            +{{ insights.totalUpvotes.toLocaleString() }}
                        </div>
                        <span class="text-[11px] text-gray-400 mt-1">
                            {{ insights.totalDownvotes.toLocaleString() }} downvotes
                        </span>
                    </div>

                    <!-- 2. 30-Day Vote Growth -->
                    <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">30d Vote Growth</span>
                        <div class="text-2xl font-bold font-mono text-blue-400 mt-1">
                            +{{ insights.growth30d.toLocaleString() }}
                        </div>
                        <span class="text-[11px] text-gray-400 mt-1">
                            +{{ insights.dailyGrowth30d }} votes/day
                        </span>
                    </div>

                    <!-- 3. Total Audio Time -->
                    <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Mapped Music</span>
                        <div class="text-xl font-bold font-mono text-purple-300 mt-1">
                            {{ insights.totalDurationStr }}
                        </div>
                        <span class="text-[11px] text-gray-400 mt-1">
                            Across {{ insights.totalMaps }} maps
                        </span>
                    </div>

                    <!-- 4. Average BPM -->
                    <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Average BPM</span>
                        <div class="text-2xl font-bold font-mono text-amber-400 mt-1">
                            {{ insights.avgBpm }} <span class="text-xs font-normal text-gray-400">BPM</span>
                        </div>
                        <span class="text-[11px] text-gray-400 mt-1">
                            Max: {{ insights.maxBpmMap?.bpm ? Math.round(insights.maxBpmMap.bpm) : '-' }} BPM
                        </span>
                    </div>

                    <!-- 5. Starred Maps -->
                    <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Starred Maps</span>
                        <div class="text-2xl font-bold font-mono text-amber-300 mt-1">
                            {{ insights.starredCount }} <span class="text-xs font-normal text-gray-400">maps</span>
                        </div>
                        <span class="text-[11px] text-gray-400 mt-1">
                            Avg: ★ {{ insights.avgStar }} Stars
                        </span>
                    </div>

                    <!-- 6. 7-Day Velocity -->
                    <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">7d Velocity</span>
                        <div class="text-2xl font-bold font-mono text-teal-400 mt-1">
                            +{{ insights.growth7d.toLocaleString() }}
                        </div>
                        <span class="text-[11px] text-gray-400 mt-1">
                            +{{ insights.dailyGrowth7d }} votes/day
                        </span>
                    </div>
                </div>

                <!-- Standout Maps Portfolio Showcase Cards (4 Cards) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- 1. Crown Jewel Map (Highest Approval Ratio) -->
                    <div
                        v-if="insights.highestRatioMap"
                        @click="openMapModal(insights.highestRatioMap)"
                        class="bg-[#18191c] border border-gray-800 hover:border-emerald-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                        <div class="min-w-0">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                                <i class="bx bx-crown text-sm"></i> Crown Jewel Map
                            </span>
                            <div class="font-bold text-gray-100 group-hover:text-emerald-300 transition-colors text-sm truncate" :title="insights.highestRatioMap.songName">
                                {{ insights.highestRatioMap.songName }}
                            </div>
                            <div class="text-xs text-gray-400 truncate mt-0.5">
                                {{ insights.highestRatioMap.songAuthorName }}
                            </div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-lg block">
                                {{ insights.highestRatioMap.ratio }}%
                            </span>
                            <span class="text-[10px] text-gray-400 mt-1 block">
                                +{{ insights.highestRatioMap.upvotes }} up
                            </span>
                        </div>
                    </div>

                    <!-- 2. Most Upvoted Map -->
                    <div
                        v-if="insights.mostUpvotedMap"
                        @click="openMapModal(insights.mostUpvotedMap)"
                        class="bg-[#18191c] border border-gray-800 hover:border-amber-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                        <div class="min-w-0">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1 flex items-center gap-1">
                                <i class="bx bx-trophy text-sm"></i> Most Upvoted Map
                            </span>
                            <div class="font-bold text-gray-100 group-hover:text-amber-300 transition-colors text-sm truncate" :title="insights.mostUpvotedMap.songName">
                                {{ insights.mostUpvotedMap.songName }}
                            </div>
                            <div class="text-xs text-gray-400 truncate mt-0.5">
                                {{ insights.mostUpvotedMap.songAuthorName }}
                            </div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-lg block">
                                +{{ insights.mostUpvotedMap.upvotes.toLocaleString() }}
                            </span>
                            <span class="text-[10px] text-gray-400 mt-1 block">
                                Total Upvotes
                            </span>
                        </div>
                    </div>

                    <!-- 3. Highest Star Rating Map -->
                    <div
                        v-if="insights.highestStarMap"
                        @click="openMapModal(insights.highestStarMap)"
                        class="bg-[#18191c] border border-gray-800 hover:border-blue-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                        <div class="min-w-0">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1 flex items-center gap-1">
                                <i class="bx bx-star text-sm"></i> Hardest Star Map
                            </span>
                            <div class="font-bold text-gray-100 group-hover:text-blue-300 transition-colors text-sm truncate" :title="insights.highestStarMap.songName">
                                {{ insights.highestStarMap.songName }}
                            </div>
                            <div class="text-xs text-gray-400 truncate mt-0.5">
                                {{ insights.highestStarMap.songAuthorName }}
                            </div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-xs rounded-lg block">
                                ★ {{ insights.highestStarMap.highestStar.toFixed(1) }}
                            </span>
                            <span class="text-[10px] text-gray-400 mt-1 block">
                                Star Rating
                            </span>
                        </div>
                    </div>

                    <!-- 4. Peak Speed / BPM Map -->
                    <div
                        v-if="insights.maxBpmMap"
                        @click="openMapModal(insights.maxBpmMap)"
                        class="bg-[#18191c] border border-gray-800 hover:border-purple-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                        <div class="min-w-0">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1 flex items-center gap-1">
                                <i class="bx bx-bolt-circle text-sm"></i> Fastest BPM Map
                            </span>
                            <div class="font-bold text-gray-100 group-hover:text-purple-300 transition-colors text-sm truncate" :title="insights.maxBpmMap.songName">
                                {{ insights.maxBpmMap.songName }}
                            </div>
                            <div class="text-xs text-gray-400 truncate mt-0.5">
                                {{ insights.maxBpmMap.songAuthorName }}
                            </div>
                        </div>
                        <div class="text-right font-mono shrink-0">
                            <span class="px-2.5 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs rounded-lg block">
                                {{ Math.round(insights.maxBpmMap.bpm) }} BPM
                            </span>
                            <span class="text-[10px] text-gray-400 mt-1 block">
                                Peak Speed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Bar & Active Filters -->
            <div class="flex flex-wrap items-center justify-between gap-2 mb-4 px-1 text-sm text-gray-400">
                <div class="flex items-center gap-2">
                    <span v-if="selectedMapper" class="font-semibold text-gray-200">
                        {{ selectedMapper.mapperName }}'s Maps
                    </span>
                    <span v-if="totalCount > 0" class="bg-blue-900/40 text-blue-300 border border-blue-800/60 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {{ totalCount }} {{ totalCount === 1 ? 'map' : 'maps' }}
                    </span>
                    <span class="text-xs text-gray-500 hidden sm:inline ml-2">
                        <i class="bx bx-info-circle"></i> Click headers to sort by any column. Click rows for details.
                    </span>
                </div>
                <div v-if="totalCount > 0" class="text-xs text-gray-400">
                    Showing page <span class="text-gray-200 font-medium">{{ currentPage }}</span> of <span class="text-gray-200 font-medium">{{ totalPages }}</span>
                    <span class="text-gray-500 font-mono ml-1">({{ pageSize }} per page)</span>
                </div>
            </div>

            <!-- Main Data Table Container (Fixed min-height to prevent vertical height jumps) -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl shadow-xl relative overflow-hidden min-h-[580px] flex flex-col justify-between">
                <!-- In-Table Loading Overlay (Table & controls stay mounted, overlay appears over data) -->
                <div
                    v-if="tableLoading && maps && maps.length"
                    class="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1.5px] flex flex-col items-center justify-center transition-opacity"
                >
                    <div class="bg-[#121315]/95 border border-gray-700/80 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
                        <ProgressSpinner style="width: 26px; height: 26px" strokeWidth="4" />
                        <span class="text-xs font-semibold text-gray-200">Updating table...</span>
                    </div>
                </div>

                <!-- Initial Loading Screen (Only on first page load before maps data exists) -->
                <div v-if="loading && (!maps || !maps.length)" class="p-16 flex flex-col items-center justify-center flex-1">
                    <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
                    <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Loading maps...</span>
                </div>

                <!-- Empty State -->
                <div v-else-if="!loading && (!maps || maps.length === 0)" class="p-16 text-center text-gray-400 flex flex-col items-center justify-center flex-1">
                    <i class="bx bx-folder-open text-5xl mb-3 text-gray-600"></i>
                    <p class="text-lg font-medium text-gray-300">No maps found</p>
                    <p class="text-sm text-gray-500 mt-1">Try adjusting your search query or selecting a different mapper.</p>
                    <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="mt-4 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Clear Search
                    </button>
                </div>

                <!-- Table Contents (Always Remains Mounted) -->
                <template v-else>
                    <!-- Top Pagination Bar -->
                    <div v-if="totalPages > 1" class="bg-[#121315] border-b border-gray-800 p-4 flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
                        <div class="text-xs text-gray-400">
                            Page <span class="font-semibold text-gray-200">{{ currentPage }}</span> of <span class="font-semibold text-gray-200">{{ totalPages }}</span>
                        </div>

                        <div class="flex items-center gap-1.5">
                            <button
                                @click="goToPage(1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors"
                                title="First page"
                            >
                                <i class="bx bx-first-page text-base"></i>
                            </button>
                            <button
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
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
                                        'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                                        p === currentPage
                                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                            : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                                    ]"
                                >
                                    {{ p }}
                                </button>
                            </div>

                            <button
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                Next <i class="bx bx-chevron-right text-base"></i>
                            </button>
                            <button
                                @click="goToPage(totalPages)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors"
                                title="Last page"
                            >
                                <i class="bx bx-last-page text-base"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable Table with Compact Map Info Cell & Spaced Out Columns -->
                    <div class="overflow-x-auto w-full flex-1 min-h-[440px]">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-[#121315] border-b border-gray-800 text-xs font-bold text-gray-300 uppercase tracking-wider select-none">
                                    <th class="py-4 px-4 min-w-[210px] max-w-[230px]">Map Info</th>
                                    <th
                                        @click="toggleSort('uploaded')"
                                        class="py-4 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Uploaded <i :class="getSortIcon('uploaded')"></i>
                                    </th>
                                    <th
                                        @click="toggleSort('highestStar')"
                                        class="py-4 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Stars <i :class="getSortIcon('highestStar')"></i>
                                    </th>
                                    <th
                                        @click="toggleSort('bpm')"
                                        class="py-4 px-4 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        BPM <i :class="getSortIcon('bpm')"></i>
                                    </th>
                                    <th
                                        @click="toggleSort('upvotes')"
                                        class="py-4 px-5 cursor-pointer hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Total Votes <i :class="getSortIcon('upvotes')"></i>
                                    </th>
                                    <th
                                        v-for="range in timeRanges"
                                        :key="range.key"
                                        @click="toggleSort(range.key)"
                                        class="py-4 px-4 text-center whitespace-nowrap cursor-pointer hover:text-white transition-colors min-w-[90px]"
                                    >
                                        {{ range.label }} <i :class="getSortIcon(range.key)"></i>
                                    </th>
                                    <th class="py-4 px-5 text-center whitespace-nowrap">Stats</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800/60 text-sm">
                                <tr
                                    v-for="map in maps"
                                    :key="map.key || map.hash"
                                    @click="openMapModal(map)"
                                    class="hover:bg-gray-800/60 cursor-pointer transition-colors group"
                                >
                                    <!-- Map Info Cell (Compact) -->
                                    <td class="py-4 px-4 min-w-[210px] max-w-[230px]">
                                        <div class="flex items-center gap-2.5">
                                            <div class="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-900 border border-gray-800 shrink-0">
                                                <img
                                                    :src="map.hash ? `https://cdn.scoresaber.com/covers/${map.hash.toUpperCase()}.png` : '/favicon.ico'"
                                                    @error="onImageError"
                                                    alt="Cover"
                                                    class="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div class="min-w-0 max-w-[170px]">
                                                <div class="font-semibold text-gray-100 truncate group-hover:text-blue-400 transition-colors text-sm" :title="map.songName">
                                                    {{ map.songName }}
                                                </div>
                                                <div class="text-xs text-gray-400 truncate mt-0.5" :title="map.songAuthorName">
                                                    {{ map.songAuthorName }}
                                                </div>
                                                <div class="flex items-center gap-1.5 mt-1" @click.stop>
                                                    <a
                                                        v-if="map.key"
                                                        :href="`https://beatsaver.com/maps/${map.key}`"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="inline-flex items-center gap-1 text-[11px] font-mono bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white px-1.5 py-0.5 rounded transition-colors"
                                                        title="View on BeatSaver"
                                                    >
                                                        #{{ map.key }}
                                                    </a>
                                                    <span v-if="map.levelAuthorName" class="text-[11px] text-gray-500 truncate" :title="map.levelAuthorName">
                                                        by {{ map.levelAuthorName }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Uploaded Date -->
                                    <td class="py-4 px-4 text-center text-sm font-medium text-gray-300 whitespace-nowrap">
                                        {{ formatDate(map.uploaded) }}
                                    </td>

                                    <!-- Stars -->
                                    <td class="py-4 px-4 text-center whitespace-nowrap">
                                        <span
                                            v-if="map.highestStar && map.highestStar > 0"
                                            class="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded text-sm"
                                        >
                                            ★ {{ map.highestStar.toFixed(1) }}
                                        </span>
                                        <span v-else class="text-gray-600 text-sm">-</span>
                                    </td>

                                    <!-- BPM -->
                                    <td class="py-4 px-4 text-center text-sm font-medium text-gray-300 whitespace-nowrap">
                                        {{ map.bpm ? Math.round(map.bpm) : '-' }}
                                    </td>

                                    <!-- Current Total Votes & Up/Down Breakdown -->
                                    <td class="py-4 px-5 text-center whitespace-nowrap">
                                        <div class="inline-flex flex-col items-center">
                                            <div class="inline-flex items-center gap-1.5 bg-gray-900/90 px-3 py-1 rounded-lg border border-gray-700/80 font-bold text-sm">
                                                <span class="text-emerald-400">+{{ map.latest?.upvotes ?? map.upvotes ?? 0 }}</span>
                                                <span class="text-gray-600">/</span>
                                                <span class="text-rose-400">+{{ map.latest?.downvotes ?? map.downvotes ?? 0 }}</span>
                                            </div>
                                            <span class="text-xs text-gray-400 font-mono font-medium mt-1">
                                                Total: {{ (map.latest?.upvotes ?? map.upvotes ?? 0) + (map.latest?.downvotes ?? map.downvotes ?? 0) }}
                                            </span>
                                        </div>
                                    </td>

                                    <!-- Time Range Deltas (Spaced Out Prominent Cells) -->
                                    <td
                                        v-for="range in timeRanges"
                                        :key="range.key"
                                        class="py-4 px-4 text-center whitespace-nowrap"
                                    >
                                        <div
                                            v-if="map[range.key]"
                                            class="text-sm font-bold font-mono inline-flex items-center justify-center gap-1.5"
                                        >
                                            <span
                                                :class="[
                                                    map[range.key].upvotes > 0 ? 'text-emerald-400' : 'text-gray-500'
                                                ]"
                                            >
                                                {{ map[range.key].upvotes > 0 ? '+' + map[range.key].upvotes : map[range.key].upvotes }}
                                            </span>
                                            <span class="text-gray-600 font-normal">/</span>
                                            <span
                                                :class="[
                                                    map[range.key].downvotes > 0 ? 'text-rose-400' : 'text-gray-500'
                                                ]"
                                            >
                                                {{ map[range.key].downvotes > 0 ? '+' + map[range.key].downvotes : map[range.key].downvotes }}
                                            </span>
                                        </div>
                                        <span v-else class="text-gray-600 text-sm opacity-40">-</span>
                                    </td>

                                    <!-- Action Button Cell -->
                                    <td class="py-4 px-5 text-center whitespace-nowrap" @click.stop>
                                        <button
                                            @click="openMapModal(map)"
                                            class="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors"
                                            title="View map stats chart"
                                        >
                                            <i class="bx bx-bar-chart-alt-2 text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Bottom Pagination Bar -->
                    <div v-if="totalPages > 1" class="bg-[#121315] border-t border-gray-800 p-4 flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
                        <div class="text-xs text-gray-400">
                            Page <span class="font-semibold text-gray-200">{{ currentPage }}</span> of <span class="font-semibold text-gray-200">{{ totalPages }}</span>
                            <span class="text-gray-500 font-mono ml-1">({{ pageSize }} per page)</span>
                        </div>

                        <div class="flex items-center gap-1.5">
                            <button
                                @click="goToPage(1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors"
                                title="First page"
                            >
                                <i class="bx bx-first-page text-base"></i>
                            </button>
                            <button
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1 || tableLoading"
                                class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
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
                                        'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                                        p === currentPage
                                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                            : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                                    ]"
                                >
                                    {{ p }}
                                </button>
                            </div>

                            <button
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                Next <i class="bx bx-chevron-right text-base"></i>
                            </button>
                            <button
                                @click="goToPage(totalPages)"
                                :disabled="currentPage >= totalPages || tableLoading"
                                class="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-gray-200 rounded-md text-xs font-medium transition-colors"
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
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            @click.self="closeModal"
        >
            <div class="relative w-full max-w-5xl bg-[#18191c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8">
                <!-- Modal Header -->
                <div class="bg-[#121315] border-b border-gray-800 p-5 flex items-start justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <img
                            :src="modalMap.hash ? `https://cdn.scoresaber.com/covers/${modalMap.hash.toUpperCase()}.png` : '/favicon.ico'"
                            @error="onImageError"
                            alt="Cover"
                            class="w-16 h-16 rounded-xl object-cover border border-gray-700 shrink-0"
                        />
                        <div>
                            <h3 class="text-xl font-bold text-gray-100 flex items-center gap-2">
                                {{ modalMap.songName }}
                                <span v-if="modalMap.songSubName" class="text-sm font-normal text-gray-400">
                                    {{ modalMap.songSubName }}
                                </span>
                            </h3>
                            <p class="text-sm text-gray-400 mt-0.5">
                                {{ modalMap.songAuthorName }} <span class="text-gray-600">•</span> Mapped by <span class="text-blue-400 font-medium">{{ modalMap.levelAuthorName || selectedMapper?.mapperName }}</span>
                            </p>
                            <div class="flex items-center gap-2 mt-2">
                                <a
                                    v-if="modalMap.key"
                                    :href="`https://beatsaver.com/maps/${modalMap.key}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 text-xs font-mono bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white px-2.5 py-1 rounded-md border border-blue-500/30 transition-colors"
                                >
                                    #{{ modalMap.key }} <i class="bx bx-external-link text-xs"></i>
                                </a>
                                <a
                                    v-if="modalMap.hash"
                                    :href="`https://scoresaber.com/leaderboard/${modalMap.hash}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2.5 py-1 rounded-md border border-gray-700 transition-colors"
                                >
                                    ScoreSaber <i class="bx bx-external-link text-xs"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <button
                        @click="closeModal"
                        class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Close modal (Esc)"
                    >
                        <i class="bx bx-x text-2xl"></i>
                    </button>
                </div>

                <!-- Modal Content Body -->
                <div class="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
                    <!-- Key Metric Cards Grid (6 Rich Cards) -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <!-- 1. Total Votes & Net Score -->
                        <div class="bg-[#121315] border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between">
                            <span class="text-xs text-gray-400 block font-semibold">Votes & Net Score</span>
                            <div class="text-base font-bold text-gray-100 mt-1 flex items-center gap-1">
                                <span class="text-emerald-400">+{{ modalUpvotes }}</span>
                                <span class="text-gray-600">/</span>
                                <span class="text-rose-400">+{{ modalDownvotes }}</span>
                            </div>
                            <span class="text-xs font-mono font-medium mt-1 text-blue-400">
                                {{ modalNetScore >= 0 ? '+' + modalNetScore : modalNetScore }} Net Score
                            </span>
                        </div>

                        <!-- 2. Approval Rating & Sentiment Badge -->
                        <div class="bg-[#121315] border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between">
                            <span class="text-xs text-gray-400 block font-semibold">Approval Rating</span>
                            <div class="text-lg font-bold text-gray-100 mt-1">
                                {{ modalApprovalRatio }}%
                            </div>
                            <span :class="['text-[11px] font-semibold px-1.5 py-0.5 rounded w-fit mt-1', sentimentBadgeClass]">
                                {{ sentimentLabel }}
                            </span>
                        </div>

                        <!-- 3. Portfolio Standings -->
                        <div class="bg-[#121315] border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between">
                            <span class="text-xs text-gray-400 block font-semibold">Mapper Standing</span>
                            <div class="text-base font-bold text-amber-400 mt-1">
                                Rank #{{ mapperPortfolioRank }}
                            </div>
                            <span class="text-xs text-gray-400 mt-1 font-medium">
                                of {{ totalCount }} maps by votes
                            </span>
                        </div>

                        <!-- 4. Vote Velocity (Growth Rate) -->
                        <div class="bg-[#121315] border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between">
                            <span class="text-xs text-gray-400 block font-semibold">30d Growth Rate</span>
                            <div class="text-base font-bold text-emerald-400 mt-1">
                                +{{ voteVelocity30d }} <span class="text-xs font-normal text-gray-400">/day</span>
                            </div>
                            <span class="text-xs text-gray-400 mt-1 font-medium">
                                7d: +{{ voteVelocity7d }}/day
                            </span>
                        </div>

                        <!-- 5. Rating & BPM -->
                        <div class="bg-[#121315] border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between">
                            <span class="text-xs text-gray-400 block font-semibold">Rating & BPM</span>
                            <div class="text-base font-bold text-amber-400 mt-1 flex items-center gap-1">
                                ★ {{ modalMap.highestStar ? modalMap.highestStar.toFixed(1) : '-' }}
                            </div>
                            <span class="text-xs text-gray-400 mt-1 font-medium">
                                BPM: {{ modalMap.bpm ? Math.round(modalMap.bpm) : '-' }}
                            </span>
                        </div>

                        <!-- 6. Milestone Progress -->
                        <div class="bg-[#121315] border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between">
                            <span class="text-xs text-gray-400 block font-semibold">Next Milestone</span>
                            <div class="text-sm font-bold text-blue-300 mt-1 truncate">
                                {{ milestoneTarget }} Upvotes
                            </div>
                            <div class="w-full bg-gray-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div class="bg-blue-500 h-full transition-all duration-500" :style="{ width: `${milestonePercent}%` }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Graph Section (Tabs + SVG Charts) -->
                    <div class="bg-[#121315] border border-gray-800 rounded-xl p-4">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div class="flex items-center gap-2">
                                <i class="bx bx-line-chart text-blue-400 text-xl"></i>
                                <h4 class="text-sm font-bold text-gray-200">
                                    {{ chartType === 'growth' ? 'Dual-Line All-Time Upvotes & Downvotes Timeline' : chartType === 'deltas' ? 'Period Vote Activity Deltas' : 'Daily Vote Velocity (Votes / Day)' }}
                                </h4>
                            </div>

                            <!-- Chart Mode Tabs -->
                            <div class="flex items-center bg-[#18191c] p-1 rounded-lg border border-gray-800">
                                <button
                                    @click="chartType = 'growth'"
                                    :class="[
                                        'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                                        chartType === 'growth' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
                                    ]"
                                >
                                    Dual Timeline
                                </button>
                                <button
                                    @click="chartType = 'deltas'"
                                    :class="[
                                        'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                                        chartType === 'deltas' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
                                    ]"
                                >
                                    Period Deltas
                                </button>
                                <button
                                    @click="chartType = 'velocity'"
                                    :class="[
                                        'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                                        chartType === 'velocity' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
                                    ]"
                                >
                                    Growth Rate
                                </button>
                            </div>
                        </div>

                        <!-- 1. Dual-Line Cumulative Chart (Upvotes Green, Downvotes Rose) Filtered to Creation Date -->
                        <div v-if="chartType === 'growth'" class="relative">
                            <div class="w-full relative aspect-[1000/220] max-h-[230px]">
                                <svg class="w-full h-full" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <linearGradient id="upvoteGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                                            <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    <!-- Grid Lines -->
                                    <line x1="15" y1="25" x2="985" y2="25" stroke="#374151" stroke-dasharray="4 4" stroke-opacity="0.4" />
                                    <line x1="15" y1="100" x2="985" y2="100" stroke="#374151" stroke-dasharray="4 4" stroke-opacity="0.4" />
                                    <line x1="15" y1="175" x2="985" y2="175" stroke="#374151" stroke-dasharray="4 4" stroke-opacity="0.4" />

                                    <!-- Area Path for Upvotes -->
                                    <polygon :points="upvoteAreaPoints" fill="url(#upvoteGrad)" />

                                    <!-- Upvotes Line (Green) -->
                                    <polyline
                                        :points="upvotePolylinePoints"
                                        fill="none"
                                        stroke="#10b981"
                                        stroke-width="3"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />

                                    <!-- Downvotes Line (Rose) -->
                                    <polyline
                                        :points="downvotePolylinePoints"
                                        fill="none"
                                        stroke="#f43f5e"
                                        stroke-width="2.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-dasharray="6 3"
                                    />

                                    <!-- Active Vertical Guideline -->
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

                                    <!-- Crisp Uniform Circles & Mouse Detectors -->
                                    <g v-for="(pt, idx) in chartPoints" :key="idx">
                                        <circle
                                            v-if="hoveredPoint && hoveredPoint.label === pt.label"
                                            :cx="pt.x"
                                            :cy="pt.yUp"
                                            r="8"
                                            fill="#10b981"
                                            fill-opacity="0.3"
                                            stroke="#10b981"
                                            stroke-width="2"
                                        />
                                        <circle
                                            :cx="pt.x"
                                            :cy="pt.yUp"
                                            r="5"
                                            fill="#10b981"
                                            stroke="#121315"
                                            stroke-width="2"
                                        />
                                        <circle
                                            :cx="pt.x"
                                            :cy="pt.yDown"
                                            r="4"
                                            fill="#f43f5e"
                                            stroke="#121315"
                                            stroke-width="1.5"
                                        />
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

                            <!-- X Axis Labels -->
                            <div class="flex justify-between text-xs text-gray-400 mt-2 px-1 font-mono border-t border-gray-800/60 pt-2">
                                <span v-for="pt in chartPoints" :key="pt.label" class="text-center font-medium">{{ pt.label }}</span>
                            </div>

                            <!-- Legend & Floating Hover Tooltip -->
                            <div class="flex items-center justify-between mt-3 px-2">
                                <div class="flex items-center gap-6 text-xs text-gray-400 font-medium">
                                    <span class="flex items-center gap-1.5">
                                        <span class="w-3 h-0.5 bg-emerald-500 rounded"></span> Cumulative Upvotes
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <span class="w-3 h-0.5 bg-rose-500 border-dashed rounded"></span> Cumulative Downvotes
                                    </span>
                                </div>

                                <div
                                    v-if="hoveredPoint"
                                    class="bg-gray-900/95 border border-blue-500/40 text-xs px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-3 font-mono"
                                >
                                    <span class="text-gray-300 font-semibold">{{ hoveredPoint.label }}:</span>
                                    <span class="text-emerald-400 font-bold">+{{ hoveredPoint.valUp }} up</span>
                                    <span class="text-gray-600">/</span>
                                    <span class="text-rose-400 font-bold">+{{ hoveredPoint.valDown }} down</span>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Corrected Side-by-Side Period Deltas Bar Chart -->
                        <div v-else-if="chartType === 'deltas'" class="relative">
                            <div class="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-3 border-b border-gray-800">
                                <div
                                    v-for="bar in barChartData"
                                    :key="bar.label"
                                    class="flex-1 flex flex-col items-center h-full justify-end group"
                                >
                                    <!-- Hover tooltip label -->
                                    <div class="text-xs font-mono text-gray-300 font-semibold mb-1 opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        +{{ bar.upvotes }} / +{{ bar.downvotes }}
                                    </div>

                                    <!-- Side by Side Bars -->
                                    <div class="w-full flex items-end justify-center gap-1 h-36">
                                        <div
                                            class="w-1/2 bg-emerald-500 rounded-t-md transition-all duration-300 hover:bg-emerald-400 shadow-md shadow-emerald-500/10"
                                            :style="{ height: `${bar.upHeight}%` }"
                                            :title="`${bar.label} Upvote Gain: +${bar.upvotes}`"
                                        ></div>
                                        <div
                                            class="w-1/2 bg-rose-500 rounded-t-md transition-all duration-300 hover:bg-rose-400 shadow-md shadow-rose-500/10"
                                            :style="{ height: `${bar.downHeight}%` }"
                                            :title="`${bar.label} Downvote Gain: +${bar.downvotes}`"
                                        ></div>
                                    </div>

                                    <span class="text-xs text-gray-300 font-medium mt-2 truncate max-w-full" :title="bar.label">{{ bar.label }}</span>
                                </div>
                            </div>
                            <!-- Legend -->
                            <div class="flex items-center justify-center gap-6 mt-3 text-xs text-gray-400">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-3 h-3 rounded-sm bg-emerald-500"></span> Upvotes Gained
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <span class="w-3 h-3 rounded-sm bg-rose-500"></span> Downvotes Gained
                                </span>
                            </div>
                        </div>

                        <!-- 3. Daily Growth Rate (Velocity Chart) -->
                        <div v-else class="relative">
                            <div class="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-3 border-b border-gray-800">
                                <div
                                    v-for="v in velocityChartData"
                                    :key="v.label"
                                    class="flex-1 flex flex-col items-center h-full justify-end group"
                                >
                                    <div class="text-xs font-mono text-blue-300 font-semibold mb-1 opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        +{{ v.rate }}/day
                                    </div>
                                    <div class="w-full flex items-end justify-center h-36">
                                        <div
                                            class="w-3/4 bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-400 shadow-md shadow-blue-500/10"
                                            :style="{ height: `${v.height}%` }"
                                            :title="`${v.label} Daily Rate: +${v.rate} votes/day`"
                                        ></div>
                                    </div>
                                    <span class="text-xs text-gray-300 font-medium mt-2 truncate max-w-full" :title="v.label">{{ v.label }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-center gap-6 mt-3 text-xs text-gray-400">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-3 h-3 rounded-sm bg-blue-500"></span> Average Votes Gained Per Day
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Breakdown Table (With Growth Velocity & Net Delta) -->
                    <div class="bg-[#121315] border border-gray-800 rounded-xl overflow-hidden">
                        <div class="px-4 py-3 border-b border-gray-800 bg-[#18191c] flex items-center justify-between">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-300">Complete Historical Breakdown</h4>
                            <span class="text-xs text-gray-400">Earliest DB entry & vote deltas</span>
                        </div>
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-gray-800 text-gray-400 font-bold bg-[#121315]">
                                    <th class="py-2.5 px-4">Timeframe</th>
                                    <th class="py-2.5 px-4 text-center">Upvotes</th>
                                    <th class="py-2.5 px-4 text-center">Downvotes</th>
                                    <th class="py-2.5 px-4 text-center">Net Delta</th>
                                    <th class="py-2.5 px-4 text-center">Daily Growth Rate</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800/50 text-gray-200">
                                <tr
                                    v-for="row in breakdownRows"
                                    :key="row.label"
                                    :class="row.isHighlight ? 'bg-blue-950/20 font-semibold' : 'hover:bg-gray-800/30'"
                                >
                                    <td class="py-2.5 px-4 flex items-center gap-2">
                                        <span class="text-gray-100 font-medium">{{ row.label }}</span>
                                        <span v-if="row.tag" class="bg-blue-600/30 text-blue-300 text-xs px-2 py-0.5 rounded font-mono">{{ row.tag }}</span>
                                    </td>
                                    <td class="py-2.5 px-4 text-center text-emerald-400 font-mono font-bold">+{{ row.upvotes }}</td>
                                    <td class="py-2.5 px-4 text-center text-rose-400 font-mono font-bold">+{{ row.downvotes }}</td>
                                    <td class="py-2.5 px-4 text-center font-mono font-bold" :class="row.net >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                                        {{ row.net >= 0 ? '+' + row.net : row.net }}
                                    </td>
                                    <td class="py-2.5 px-4 text-center text-blue-400 font-mono font-medium">
                                        +{{ row.rate }}/day
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-[#121315] border-t border-gray-800 p-4 flex items-center justify-end">
                    <button
                        @click="closeModal"
                        class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold transition-colors"
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
            pageSize: 25,
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
            mappersLoading: false,
            searchDebounceTimer: null,
            modalMap: null,
            chartType: 'growth',
            hoveredPoint: null,
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
            if (q.page_size) this.pageSize = parseInt(q.page_size) || 25
            if (q.search) this.searchQuery = q.search
            if (q.ordering) this.currentOrdering = q.ordering
        },
        updateQueryParams() {
            const query = {}
            if (this.selectedMapper && this.selectedMapper.mapperId) {
                query.mapperId = this.selectedMapper.mapperId
            }
            if (this.currentPage > 1) query.page = this.currentPage
            if (this.pageSize && this.pageSize !== 25) query.page_size = this.pageSize
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
        async fetchInsights() {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return
            try {
                this.insights = await this.$defaultApi.$get(`beatsaver/bsst_insights/${this.selectedMapper.mapperId}`)
            } catch (e) {
                console.error('Failed to fetch mapper insights:', e)
                this.insights = null
            }
        },
        async fetchMaps() {
            if (!this.selectedMapper || !this.selectedMapper.mapperId) return
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

                const response = await this.$defaultApi.$get(`beatsaver/bsst/${this.selectedMapper.mapperId}`, {
                    params,
                })

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
                console.error('Failed to fetch maps:', e)
                this.maps = []
                this.totalCount = 0
            } finally {
                this.loading = false
                this.tableLoading = false
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
