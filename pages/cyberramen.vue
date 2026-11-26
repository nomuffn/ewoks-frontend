<template>
    <div class="cyberramen pb-12">
        <sub-header title="CyberRamen Request Tool">
            <p v-html="description"></p>
        </sub-header>

        <div class="w-full max-w-6xl px-4 sm:px-8 mx-auto mt-6">
            <!-- Error State -->
            <div v-if="error" class="bg-[#1e2023] border border-rose-500/30 rounded-lg p-6 text-center text-rose-300 my-4">
                <p class="font-medium text-sm">Failed to load CyberRamen jobs</p>
                <p class="text-xs text-rose-400/80 mt-1">{{ error.message || error }}</p>
            </div>

            <!-- Logged In Content -->
            <div v-else-if="profile" class="space-y-4">
                <!-- Top Toolbar -->
                <div class="flex flex-wrap items-center gap-2.5">
                    <div class="relative flex-1 min-w-[200px] max-w-xs">
                        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none"></i>
                        <input
                            type="text"
                            v-model="jobFilters.textSearch"
                            placeholder="Search song..."
                            class="w-full bg-[#141417] text-gray-100 placeholder-gray-500 border border-white/[0.08] focus:border-blue-500 rounded-lg pl-9 pr-8 py-2 text-sm outline-none transition-colors"
                        />
                        <button
                            v-if="jobFilters.textSearch"
                            @click="jobFilters.textSearch = ''"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 text-base transition-colors"
                            title="Clear search"
                        >
                            <i class="bx bx-x"></i>
                        </button>
                    </div>

                    <div v-if="jobUsers.length > 1" class="shrink-0">
                        <Dropdown
                            v-model="jobFilters.userid"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="All users"
                            :options="jobUsers"
                            class="w-44 p-inputtext-sm"
                            :showClear="true"
                            appendTo="body"
                            scrollHeight="400px"
                        />
                    </div>

                    <div v-if="filteredJobs.length" class="flex items-center gap-2 px-3 py-1.5 bg-[#1e2023] border border-blue-500/30 rounded-lg text-xs text-gray-300">
                        <span>Jobs: <span class="font-mono text-gray-100">{{ filteredJobs.join(', ') }}</span></span>
                        <button @click="filteredJobs = []" class="text-gray-400 hover:text-white transition-colors" title="Clear job ID filter">
                            <i class="bx bx-x text-sm"></i>
                        </button>
                    </div>

                    <button
                        @click="createJob"
                        :disabled="creatingJob"
                        class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-1.5 shrink-0 ml-auto"
                    >
                        <i class="bx bx-plus text-base"></i>
                        <span>New Request</span>
                    </button>
                </div>

                <!-- Slim Admin Summary Bar -->
                <div v-if="isAdmin && adminStats" class="bg-[#1e2023] border border-white/[0.06] rounded-lg px-4 py-2.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex flex-wrap items-center gap-x-5 gap-y-1 text-gray-400">
                            <span><strong class="font-mono text-gray-100">{{ adminStats.totalJobs }}</strong> requests</span>
                            <span><strong class="font-mono text-emerald-400">{{ adminStats.successRate }}%</strong> success</span>
                            <span><strong class="font-mono text-gray-200">{{ adminStats.completedJobs }}</strong> done</span>
                            <span><strong class="font-mono text-blue-400">{{ adminStats.queuedJobs }}</strong> queued</span>
                            <span><strong class="font-mono text-rose-400">{{ adminStats.failedJobs }}</strong> failed</span>
                            <span><strong class="font-mono text-gray-200">{{ adminStats.uniqueUsersCount }}</strong> users</span>
                        </div>

                        <div class="flex items-center gap-3 shrink-0">
                            <button
                                v-if="adminStats.topUsers?.length"
                                @click="showTopUsers = !showTopUsers"
                                class="text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-1"
                            >
                                <span>Top users</span>
                                <i :class="['bx text-sm transition-transform', showTopUsers ? 'bx-chevron-up' : 'bx-chevron-down']"></i>
                            </button>
                            <button
                                @click="fetchAdminStats"
                                class="text-gray-400 hover:text-gray-200 transition-colors p-0.5"
                                title="Refresh admin stats"
                            >
                                <i :class="['bx bx-refresh text-base', loadingAdminStats ? 'animate-spin' : '']"></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="showTopUsers && adminStats.topUsers?.length" class="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2.5 border-t border-white/[0.06]">
                        <button
                            v-for="u in adminStats.topUsers"
                            :key="u.userId || u.userName"
                            @click="toggleUserFilter(u.userId)"
                            :class="[
                                'px-2.5 py-1 rounded-md text-xs transition-colors flex items-center gap-1.5 border',
                                jobFilters.userid && jobFilters.userid == u.userId
                                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-200'
                                    : 'bg-[#141417] hover:bg-[#25282c] border-white/[0.06] text-gray-300',
                            ]"
                        >
                            <span>{{ u.userName }}</span>
                            <span class="font-mono text-[11px] text-gray-500">{{ u.count }}</span>
                        </button>
                    </div>
                </div>

                <!-- Jobs Table -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
                    <div v-if="loading && !computedJobs.length" class="p-14 flex flex-col items-center justify-center">
                        <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
                        <span class="text-gray-400 mt-3 text-sm">Loading jobs...</span>
                    </div>

                    <div v-else-if="!computedJobs.length" class="p-14 text-center text-gray-400">
                        <p class="text-sm font-medium text-gray-200">No jobs found</p>
                        <p class="text-xs text-gray-500 mt-1">Create a new replay request or adjust your filters.</p>
                    </div>

                    <template v-else>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-[#141417] border-b border-white/[0.06] text-xs font-medium text-gray-400 select-none">
                                        <th @click="toggleSort('done')" class="py-3 pl-4 pr-3 cursor-pointer hover:text-gray-200 transition-colors whitespace-nowrap w-28">
                                            Status <i :class="getSortIcon('done')"></i>
                                        </th>
                                        <th @click="toggleSort('SongName')" class="py-3 px-3 cursor-pointer hover:text-gray-200 transition-colors">
                                            Song <i :class="getSortIcon('SongName')"></i>
                                        </th>
                                        <th v-if="isAdmin" @click="toggleSort('UserName')" class="py-3 px-3 cursor-pointer hover:text-gray-200 transition-colors whitespace-nowrap">
                                            User <i :class="getSortIcon('UserName')"></i>
                                        </th>
                                        <th @click="toggleSort('Diff')" class="py-3 px-3 cursor-pointer hover:text-gray-200 transition-colors whitespace-nowrap">
                                            Diff <i :class="getSortIcon('Diff')"></i>
                                        </th>
                                        <th @click="toggleSort('CreatedDate')" class="py-3 px-3 cursor-pointer hover:text-gray-200 transition-colors whitespace-nowrap">
                                            Created <i :class="getSortIcon('CreatedDate')"></i>
                                        </th>
                                        <th @click="toggleSort('CompletedDate')" class="py-3 px-3 cursor-pointer hover:text-gray-200 transition-colors whitespace-nowrap hidden md:table-cell">
                                            Finished <i :class="getSortIcon('CompletedDate')"></i>
                                        </th>
                                        <th class="py-3 pl-3 pr-4 text-right whitespace-nowrap w-24"></th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/[0.05] text-sm">
                                    <template v-for="job in paginatedJobs">
                                        <!-- Main Job Row -->
                                        <tr
                                            :key="job.JobId"
                                            @click="toggleRow(job)"
                                            :class="[
                                                'cursor-pointer transition-colors',
                                                isExpanded(job) ? 'bg-white/[0.03]' : 'hover:bg-white/[0.025]',
                                            ]"
                                        >
                                            <!-- Chevron + Status -->
                                            <td class="py-3 pl-4 pr-3 whitespace-nowrap">
                                                <div class="flex items-center gap-2.5">
                                                    <i
                                                        :class="[
                                                            'bx bx-chevron-right text-gray-500 text-base transition-transform',
                                                            isExpanded(job) ? 'rotate-90 text-gray-300' : '',
                                                        ]"
                                                    ></i>
                                                    <span :class="['inline-flex items-center gap-1.5 text-xs font-medium', getStatusMeta(job).textClass]">
                                                        <span :class="['w-1.5 h-1.5 rounded-full', getStatusMeta(job).dotClass]"></span>
                                                        {{ getStatusMeta(job).label }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Song Name -->
                                            <td class="py-3 px-3 max-w-xs sm:max-w-sm">
                                                <div class="font-medium text-gray-100 truncate" :title="job.SongName || 'Untitled Song'">
                                                    {{ job.SongName || 'Untitled Song' }}
                                                </div>
                                            </td>

                                            <!-- User (Admin) -->
                                            <td v-if="isAdmin" class="py-3 px-3 whitespace-nowrap" @click.stop>
                                                <button
                                                    @click="toggleUserFilter(job.UserId)"
                                                    class="text-xs text-gray-300 hover:text-blue-400 transition-colors truncate max-w-[130px] block"
                                                    :title="job.UserId ? `${job.UserName || 'Unknown'} (${job.UserId})` : job.UserName"
                                                >
                                                    {{ job.UserName || 'Unknown' }}
                                                </button>
                                            </td>

                                            <!-- Difficulty -->
                                            <td class="py-3 px-3 whitespace-nowrap">
                                                <span class="text-xs font-mono text-gray-400">{{ formatDiff(job.Diff) }}</span>
                                            </td>

                                            <!-- Created -->
                                            <td class="py-3 px-3 whitespace-nowrap">
                                                <span class="text-xs font-mono text-gray-400" :title="formatFullDate(job.CreatedDate)">
                                                    {{ formatShortDate(job.CreatedDate) }}
                                                </span>
                                            </td>

                                            <!-- Finished -->
                                            <td class="py-3 px-3 whitespace-nowrap hidden md:table-cell">
                                                <span class="text-xs font-mono text-gray-500" :title="formatFullDate(job.CompletedDate)">
                                                    {{ formatShortDate(job.CompletedDate) }}
                                                </span>
                                            </td>

                                            <!-- Actions -->
                                            <td class="py-3 pl-3 pr-4 whitespace-nowrap text-right" @click.stop>
                                                <div class="inline-flex items-center justify-end gap-1">
                                                    <a
                                                        v-if="job.BeatSaverKey"
                                                        :href="`https://beatsaver.com/maps/${job.BeatSaverKey}`"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="nope px-2 py-1 rounded text-xs font-mono text-gray-400 hover:text-blue-400 hover:bg-white/[0.04] transition-colors"
                                                        title="Open on BeatSaver"
                                                    >
                                                        #{{ job.BeatSaverKey }}
                                                    </a>
                                                    <button
                                                        @click="openJob(job)"
                                                        class="p-1.5 rounded text-gray-500 hover:text-gray-200 hover:bg-white/[0.05] transition-colors"
                                                        title="Job details"
                                                    >
                                                        <i class="bx bx-info-circle text-base"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- Expanded Drawer Row -->
                                        <tr v-if="isExpanded(job)" :key="`${job.JobId}-exp`" class="bg-[#16171a]">
                                            <td :colspan="isAdmin ? 7 : 6" class="p-0">
                                                <div class="border-l-2 border-blue-500/40 px-4 sm:px-6 py-4 space-y-4">
                                                    <!-- Incomplete / Loading / Error / Empty States -->
                                                    <div v-if="!job.Result" class="py-6 text-center text-gray-400 flex flex-col items-center">
                                                        <ProgressSpinner style="width: 24px; height: 24px" strokeWidth="4" />
                                                        <p class="mt-2.5 text-xs text-gray-300">Generating replays and mistake analysis... Please wait :DDD</p>
                                                    </div>

                                                    <div v-else-if="!job.Result?.includes('https://')" class="px-3.5 py-2.5 bg-rose-950/25 border border-rose-500/25 rounded-md text-rose-300 text-xs font-mono">
                                                        {{ job.Result }}
                                                    </div>

                                                    <div v-else-if="!job.loadedResults" class="py-6 text-center text-gray-400 flex flex-col items-center">
                                                        <ProgressSpinner style="width: 24px; height: 24px" strokeWidth="4" />
                                                        <p class="mt-2 text-xs">Loading replay results...</p>
                                                    </div>

                                                    <div v-else-if="!job.loadedResults.length || !Object.keys(job.sortedReplays || {}).length" class="px-4 py-3 bg-amber-950/20 border border-amber-500/25 rounded-md text-amber-200/90 text-xs flex items-start gap-2.5">
                                                        <i class="bx bx-error text-base text-amber-400 shrink-0 mt-0.5"></i>
                                                        <div>
                                                            <span class="font-medium text-amber-200">No replays generated.</span>
                                                            This usually happens if the map uses V3 format, Noodle Extensions, or Mapping Extensions.
                                                        </div>
                                                    </div>

                                                    <!-- Loaded Replay Results -->
                                                    <template v-else>
                                                        <!-- Sub-header: Tabs + Inline Highlights -->
                                                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-2.5">
                                                            <div class="flex items-center gap-1">
                                                                <button
                                                                    @click="setJobTab(job.JobId, 'mistakes')"
                                                                    :class="[
                                                                        'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                                                                        getJobTab(job.JobId) === 'mistakes'
                                                                            ? 'bg-[#25282c] text-white'
                                                                            : 'text-gray-400 hover:text-gray-200',
                                                                    ]"
                                                                >
                                                                    Mistakes <span class="text-gray-500 font-mono ml-1">{{ job.sortedMistakes.length }}</span>
                                                                </button>
                                                                <button
                                                                    @click="setJobTab(job.JobId, 'replays')"
                                                                    :class="[
                                                                        'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                                                                        getJobTab(job.JobId) === 'replays'
                                                                            ? 'bg-[#25282c] text-white'
                                                                            : 'text-gray-400 hover:text-gray-200',
                                                                    ]"
                                                                >
                                                                    All Replays <span class="text-gray-500 font-mono ml-1">{{ Object.keys(job.sortedReplays).length }}</span>
                                                                </button>
                                                            </div>

                                                            <div class="flex flex-wrap items-center gap-4 text-xs">
                                                                <div v-if="job.specifics?.highestAcc?.acc" class="flex items-center gap-2">
                                                                    <span class="text-gray-500">Best Acc:</span>
                                                                    <span class="font-mono font-semibold text-emerald-400">{{ job.specifics.highestAcc.acc }}%</span>
                                                                    <button
                                                                        @click="openReplay(job.specifics.highestAcc)"
                                                                        class="text-gray-400 hover:text-blue-400 transition-colors"
                                                                        title="Watch highest acc replay"
                                                                    >
                                                                        <i class="bx bx-play-circle text-base"></i>
                                                                    </button>
                                                                    <a
                                                                        :href="job.specifics.highestAcc.replayUrl"
                                                                        class="nope text-gray-400 hover:text-gray-200 transition-colors"
                                                                        title="Download replay"
                                                                    >
                                                                        <i class="bx bx-download text-sm"></i>
                                                                    </a>
                                                                </div>

                                                                <div v-if="job.specifics?.mostMistakes" class="flex items-center gap-2">
                                                                    <span class="text-gray-500">Most Mistakes:</span>
                                                                    <span class="font-mono font-semibold text-amber-400">{{ job.specifics.mostMistakes.mistakes || 0 }}</span>
                                                                    <button
                                                                        @click="openReplay(job.specifics.mostMistakes)"
                                                                        class="text-gray-400 hover:text-blue-400 transition-colors"
                                                                        title="Watch replay with most mistakes"
                                                                    >
                                                                        <i class="bx bx-play-circle text-base"></i>
                                                                    </button>
                                                                    <a
                                                                        :href="job.specifics.mostMistakes.replayUrl"
                                                                        class="nope text-gray-400 hover:text-gray-200 transition-colors"
                                                                        title="Download replay"
                                                                    >
                                                                        <i class="bx bx-download text-sm"></i>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Mistakes Tab -->
                                                        <div v-if="getJobTab(job.JobId) === 'mistakes'" class="space-y-3">
                                                            <!-- Filter & Sort Row -->
                                                            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                                                                <div class="flex flex-wrap items-center gap-4 text-gray-300">
                                                                    <label class="flex items-center gap-2 cursor-pointer select-none">
                                                                        <Checkbox
                                                                            :id="`showBadcuts-${job.JobId}`"
                                                                            v-model="job.filters.showBadcuts"
                                                                            :binary="true"
                                                                        />
                                                                        <span>Badcuts <span class="text-gray-500 font-mono">({{ job.specifics['total_bad'] }})</span></span>
                                                                    </label>

                                                                    <label class="flex items-center gap-2 cursor-pointer select-none">
                                                                        <Checkbox
                                                                            :id="`showMisses-${job.JobId}`"
                                                                            v-model="job.filters.showMisses"
                                                                            :binary="true"
                                                                        />
                                                                        <span>Misses <span class="text-gray-500 font-mono">({{ job.specifics['total_miss'] }})</span></span>
                                                                    </label>

                                                                    <label class="flex items-center gap-2 cursor-pointer select-none">
                                                                        <Checkbox
                                                                            :id="`showBombs-${job.JobId}`"
                                                                            v-model="job.filters.showBombs"
                                                                            :binary="true"
                                                                        />
                                                                        <span>Bombs <span class="text-gray-500 font-mono">({{ job.specifics['total_bomb'] }})</span></span>
                                                                    </label>
                                                                </div>

                                                                <div class="flex items-center gap-1.5 text-gray-400">
                                                                    <span>Sort:</span>
                                                                    <button
                                                                        @click="setMistakesSort(job.JobId, 'time')"
                                                                        :class="getMistakesSort(job.JobId) === 'time' ? 'text-white font-medium' : 'hover:text-gray-200'"
                                                                        class="px-1.5 py-0.5 rounded transition-colors"
                                                                    >
                                                                        Time
                                                                    </button>
                                                                    <span class="text-gray-600">·</span>
                                                                    <button
                                                                        @click="setMistakesSort(job.JobId, 'count')"
                                                                        :class="getMistakesSort(job.JobId) === 'count' ? 'text-white font-medium' : 'hover:text-gray-200'"
                                                                        class="px-1.5 py-0.5 rounded transition-colors"
                                                                    >
                                                                        Most missed
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div v-if="!getMistakes(job).length" class="py-6 text-center text-xs text-gray-500">
                                                                No mistakes match the selected filters.
                                                            </div>

                                                            <div v-else class="divide-y divide-white/[0.05] border border-white/[0.06] rounded-md bg-[#1a1c20] overflow-hidden">
                                                                <div v-for="mistake in getPaginatedMistakes(job)" :key="mistake.time">
                                                                    <div
                                                                        @click="toggleMistake(job.JobId, mistake.time)"
                                                                        class="px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.025] transition-colors text-xs"
                                                                    >
                                                                        <div class="flex items-center gap-2.5">
                                                                            <i
                                                                                :class="[
                                                                                    'bx bx-chevron-right text-gray-500 text-sm transition-transform',
                                                                                    isMistakeExpanded(job.JobId, mistake.time) ? 'rotate-90 text-gray-300' : '',
                                                                                ]"
                                                                            ></i>
                                                                            <span class="font-mono font-medium text-gray-200">{{ mistake.time }}s</span>
                                                                            <span class="text-gray-500">·</span>
                                                                            <span class="text-gray-400">{{ summarizeMistakeTypes(mistake.mistakes) }}</span>
                                                                        </div>
                                                                        <span class="font-mono text-rose-400">
                                                                            {{ mistake.mistakes.length }} {{ mistake.mistakes.length === 1 ? 'replay' : 'replays' }}
                                                                        </span>
                                                                    </div>

                                                                    <!-- Expanded Timestamp Mistakes -->
                                                                    <div v-if="isMistakeExpanded(job.JobId, mistake.time)" class="bg-[#141417] border-t border-white/[0.05] divide-y divide-white/[0.04]">
                                                                        <div
                                                                            v-for="(singleMistake, mIdx) in mistake.mistakes"
                                                                            :key="`${singleMistake.replayId}-${singleMistake.noteId}-${mIdx}`"
                                                                            class="pl-9 pr-3.5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs"
                                                                        >
                                                                            <div class="flex items-center gap-4">
                                                                                <span
                                                                                    :class="[
                                                                                        'font-mono uppercase font-medium w-10',
                                                                                        singleMistake.type === 'bad'
                                                                                            ? 'text-rose-400'
                                                                                            : singleMistake.type === 'miss'
                                                                                            ? 'text-amber-400'
                                                                                            : 'text-gray-300',
                                                                                    ]"
                                                                                >
                                                                                    {{ singleMistake.type }}
                                                                                </span>
                                                                                <span class="font-mono text-gray-400">Note #{{ singleMistake.noteId }}</span>
                                                                                <span
                                                                                    v-if="job.sortedReplays[singleMistake.replayId]"
                                                                                    class="font-mono text-gray-500"
                                                                                >
                                                                                    {{ job.sortedReplays[singleMistake.replayId].acc }}% acc
                                                                                </span>
                                                                            </div>

                                                                            <div class="flex items-center gap-1.5">
                                                                                <button
                                                                                    @click="openReplay(job, singleMistake)"
                                                                                    class="px-2.5 py-1 rounded bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white transition-colors flex items-center gap-1"
                                                                                >
                                                                                    Watch <i class="bx bx-link-external text-[11px]"></i>
                                                                                </button>
                                                                                <button
                                                                                    @click="openReplayInfo(job.sortedReplays[singleMistake.replayId])"
                                                                                    class="p-1 rounded text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                                                                    title="Replay parameters"
                                                                                >
                                                                                    <i class="bx bx-info-circle text-sm"></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <!-- Mistakes Pagination -->
                                                            <div v-if="getMistakesTotalPages(job) > 1" class="flex items-center justify-end gap-2 text-xs text-gray-400">
                                                                <button
                                                                    @click="setMistakesPage(job.JobId, getMistakesPage(job.JobId) - 1)"
                                                                    :disabled="getMistakesPage(job.JobId) <= 1"
                                                                    class="px-2 py-1 rounded bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 transition-colors"
                                                                >
                                                                    Prev
                                                                </button>
                                                                <span class="font-mono">{{ getMistakesPage(job.JobId) }} / {{ getMistakesTotalPages(job) }}</span>
                                                                <button
                                                                    @click="setMistakesPage(job.JobId, getMistakesPage(job.JobId) + 1)"
                                                                    :disabled="getMistakesPage(job.JobId) >= getMistakesTotalPages(job)"
                                                                    class="px-2 py-1 rounded bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 transition-colors"
                                                                >
                                                                    Next
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <!-- All Replays Tab -->
                                                        <div v-else class="space-y-3">
                                                            <div class="overflow-x-auto border border-white/[0.06] rounded-md bg-[#1a1c20]">
                                                                <table class="w-full text-left border-collapse text-xs">
                                                                    <thead>
                                                                        <tr class="bg-[#141417] border-b border-white/[0.06] text-gray-400 font-medium select-none">
                                                                            <th
                                                                                v-for="col in replayColumns"
                                                                                :key="col.field"
                                                                                @click="toggleReplaySort(job.JobId, col.field)"
                                                                                class="py-2.5 px-3 cursor-pointer hover:text-gray-200 transition-colors whitespace-nowrap"
                                                                            >
                                                                                {{ col.label }} <i :class="getReplaySortIcon(job.JobId, col.field)"></i>
                                                                            </th>
                                                                            <th class="py-2.5 px-3 text-right whitespace-nowrap"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody class="divide-y divide-white/[0.04] font-mono">
                                                                        <tr
                                                                            v-for="(r, rIdx) in getPaginatedReplays(job)"
                                                                            :key="rIdx"
                                                                            class="hover:bg-white/[0.025] transition-colors"
                                                                        >
                                                                            <td class="py-2 px-3 font-semibold text-emerald-400">{{ r.acc }}%</td>
                                                                            <td class="py-2 px-3 text-gray-300">{{ r.fcAcc }}%</td>
                                                                            <td class="py-2 px-3" :class="r.mistakes > 0 ? 'text-rose-400' : 'text-emerald-400'">{{ r.mistakes }}</td>
                                                                            <td class="py-2 px-3 text-gray-300">{{ r.fps }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.jd }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.height }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.headsetYposition }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.preSwingAngle }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.postSwingAngle }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.timeDeviation }}</td>
                                                                            <td class="py-2 px-3 text-gray-400">{{ r.requestedAcc }}</td>
                                                                            <td class="py-2 px-3 text-right whitespace-nowrap font-sans">
                                                                                <div class="inline-flex items-center gap-1">
                                                                                    <button
                                                                                        @click="openReplay(r)"
                                                                                        class="px-2 py-1 rounded bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white transition-colors"
                                                                                        title="Watch replay"
                                                                                    >
                                                                                        Watch
                                                                                    </button>
                                                                                    <a
                                                                                        :href="r.replayUrl"
                                                                                        class="nope p-1 rounded text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                                                                        title="Download replay"
                                                                                    >
                                                                                        <i class="bx bx-download text-sm"></i>
                                                                                    </a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            <div v-if="getReplaysTotalPages(job) > 1" class="flex items-center justify-end gap-2 text-xs text-gray-400">
                                                                <button
                                                                    @click="setReplaysPage(job.JobId, getReplaysPage(job.JobId) - 1)"
                                                                    :disabled="getReplaysPage(job.JobId) <= 1"
                                                                    class="px-2 py-1 rounded bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 transition-colors"
                                                                >
                                                                    Prev
                                                                </button>
                                                                <span class="font-mono">{{ getReplaysPage(job.JobId) }} / {{ getReplaysTotalPages(job) }}</span>
                                                                <button
                                                                    @click="setReplaysPage(job.JobId, getReplaysPage(job.JobId) + 1)"
                                                                    :disabled="getReplaysPage(job.JobId) >= getReplaysTotalPages(job)"
                                                                    class="px-2 py-1 rounded bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 transition-colors"
                                                                >
                                                                    Next
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <!-- Table Footer / Pagination -->
                        <div class="bg-[#141417] border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
                            <span class="font-mono">{{ computedJobs.length }} {{ computedJobs.length === 1 ? 'job' : 'jobs' }}</span>

                            <div v-if="totalPages > 1" class="flex items-center gap-1.5">
                                <button
                                    @click="currentPage--"
                                    :disabled="currentPage <= 1"
                                    class="px-2.5 py-1 rounded bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 transition-colors"
                                >
                                    Prev
                                </button>
                                <span class="px-2 font-mono text-gray-300">{{ currentPage }} / {{ totalPages }}</span>
                                <button
                                    @click="currentPage++"
                                    :disabled="currentPage >= totalPages"
                                    class="px-2.5 py-1 rounded bg-[#25282c] hover:bg-[#2e3238] disabled:opacity-40 text-gray-200 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Logged Out State -->
            <div v-else class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-10 text-center text-gray-300 max-w-md mx-auto space-y-3 my-8">
                <i class="bx bxl-discord text-5xl text-gray-300"></i>
                <h3 class="text-lg font-semibold text-gray-100">Discord Login Required</h3>
                <p class="text-sm text-gray-400">Sign in with Discord to view and submit CyberRamen replay requests.</p>
                <div class="pt-2">
                    <button
                        @click="$auth.login()"
                        class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition-colors inline-flex items-center gap-2"
                    >
                        <span>Login with Discord</span>
                        <i class="bx bxl-discord text-base"></i>
                    </button>
                </div>
            </div>
        </div>

        <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<script>
import CreateJobModal from '@/components/dialogs/CreateJobModal.vue'
import JobViewModal from '~/components/dialogs/JobViewModal.vue'

export default {
    data() {
        return {
            profile: null,
            error: null,
            jobs: [],
            loadingJobs: false,
            loadingJob: false,
            creatingJob: false,
            expandedJobIds: {},
            expandedMistakeKeys: {},
            jobTabs: {},
            mistakesPage: {},
            mistakesSort: {},
            replaysPage: {},
            replaysSort: {},
            jobFilters: { userid: null, textSearch: '' },
            filteredJobs: [],
            users: [],
            currentPage: 1,
            rowsCount: 50,
            sortField: 'CreatedDate',
            sortOrder: -1,
            loading: false,
            description: '',
            adminStats: null,
            loadingAdminStats: false,
            showTopUsers: false,
            replayColumns: [
                { field: 'acc', label: 'Acc' },
                { field: 'fcAcc', label: 'FC Acc' },
                { field: 'mistakes', label: 'Mistakes' },
                { field: 'fps', label: 'FPS' },
                { field: 'jd', label: 'JD' },
                { field: 'height', label: 'Height' },
                { field: 'headsetYposition', label: 'HMD Y' },
                { field: 'preSwingAngle', label: 'Pre' },
                { field: 'postSwingAngle', label: 'Post' },
                { field: 'timeDeviation', label: 'Time Dev' },
                { field: 'requestedAcc', label: 'Req Acc' },
            ],
        }
    },
    timers: {
        loadJobs: {
            time: 10 * 1000,
            immediate: true,
            repeat: true,
        },
    },
    async created() {
        try {
            const res = await this.$defaultApi.$get('general/stuff/public_cyberramen')
            this.description = res?.json?.html || ''
        } catch (e) {
            console.error('Failed to load CyberRamen description:', e)
        }
    },
    async mounted() {
        this.profile = await this.$auth.fetch()
        if (this.profile) {
            this.$timer.start('loadJobs')
            if (this.isAdmin) this.fetchAdminStats()
        }

        let uri = window.location.search.substring(1)
        let params = new URLSearchParams(uri)
        if (params.get('jobs')) {
            for (const job of params.get('jobs').split(',')) if (!isNaN(job)) this.filteredJobs.push(parseInt(job))
        }
    },
    watch: {
        filteredJobs(newval) {
            this.currentPage = 1
            const url = new URL(window.location)
            if (newval.length > 0) {
                url.searchParams.set('jobs', newval.join())
            } else {
                url.searchParams.delete('jobs')
            }
            window.history.pushState(null, '', url.toString())
        },
        'jobFilters.textSearch'() {
            this.currentPage = 1
        },
        'jobFilters.userid'() {
            this.currentPage = 1
        },
    },
    computed: {
        isAdmin() {
            return !!(
                this.profile &&
                (this.profile.is_staff ||
                    this.profile.is_superuser ||
                    this.profile.is_admin ||
                    (process.dev && typeof window !== 'undefined'))
            )
        },
        computedJobs() {
            let jobs = [...this.jobs]

            if (this.filteredJobs.length > 0) {
                jobs = jobs.filter((job) => this.filteredJobs.includes(job.JobId))
            }
            if (this.jobFilters.userid) {
                jobs = jobs.filter((job) => job.UserId == this.jobFilters.userid)
            }
            if (this.jobFilters.textSearch && this.jobFilters.textSearch.trim()) {
                const query = this.jobFilters.textSearch.trim().toLowerCase()
                jobs = jobs.filter((job) => job.SongName?.toLowerCase().includes(query))
            }

            const field = this.sortField
            const order = this.sortOrder
            return jobs.sort((a, b) => {
                if (field === 'CreatedDate' || field === 'CompletedDate') {
                    const da = a[field] ? Date.parse(a[field]) : 0
                    const db = b[field] ? Date.parse(b[field]) : 0
                    return (da - db) * order
                }
                if (field === 'done') {
                    return ((a.done ?? 0) - (b.done ?? 0)) * order
                }
                const va = String(a[field] || '').toLowerCase()
                const vb = String(b[field] || '').toLowerCase()
                return va.localeCompare(vb) * order
            })
        },
        totalPages() {
            return Math.max(1, Math.ceil(this.computedJobs.length / this.rowsCount))
        },
        paginatedJobs() {
            const start = (this.currentPage - 1) * this.rowsCount
            return this.computedJobs.slice(start, start + this.rowsCount)
        },
        jobUsers() {
            const unique = {}
            return this.jobs
                .flatMap((job) => {
                    if (!job.UserId || unique[job.UserId]) {
                        return []
                    } else {
                        unique[job.UserId] = true
                        return { name: job.UserName || `User ${job.UserId}`, id: job.UserId }
                    }
                })
                .sort((a, b) => a.name.localeCompare(b.name))
        },
    },
    methods: {
        toggleSort(field) {
            if (this.sortField === field) {
                this.sortOrder = -this.sortOrder
            } else {
                this.sortField = field
                this.sortOrder = field === 'CreatedDate' || field === 'CompletedDate' ? -1 : 1
            }
        },
        getSortIcon(field) {
            if (this.sortField !== field) return 'bx bx-sort-alt-2 opacity-30 ml-0.5'
            return this.sortOrder === -1 ? 'bx bx-sort-down text-blue-400 ml-0.5' : 'bx bx-sort-up text-blue-400 ml-0.5'
        },
        toggleUserFilter(userId) {
            if (!userId) return
            this.jobFilters.userid = this.jobFilters.userid == userId ? null : userId
        },
        isExpanded(job) {
            return !!this.expandedJobIds[job.JobId]
        },
        toggleRow(job) {
            const next = !this.expandedJobIds[job.JobId]
            this.$set(this.expandedJobIds, job.JobId, next)
            if (next) {
                this.loadJob(job)
            }
        },
        getStatusMeta(job) {
            if (job.done === 1) {
                if (job.loadedResults && (!job.loadedResults.length || !Object.keys(job.sortedReplays || {}).length)) {
                    return { label: 'Empty', dotClass: 'bg-amber-400', textClass: 'text-amber-400' }
                }
                return { label: 'Done', dotClass: 'bg-emerald-400', textClass: 'text-emerald-400' }
            }
            if (job.done === 0) {
                return { label: 'Queued', dotClass: 'bg-blue-400', textClass: 'text-blue-400' }
            }
            return { label: 'Error', dotClass: 'bg-rose-400', textClass: 'text-rose-400' }
        },
        formatDiff(diff) {
            if (!diff) return 'Standard'
            return diff === 'ExpertPlus' ? 'Expert+' : diff
        },
        formatShortDate(dateStr) {
            if (!dateStr) return '-'
            try {
                const d = new Date(dateStr)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
                    ', ' +
                    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            } catch (e) {
                return dateStr
            }
        },
        formatFullDate(dateStr) {
            if (!dateStr) return ''
            try {
                const d = new Date(dateStr)
                return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            } catch (e) {
                return dateStr
            }
        },
        getJobTab(jobId) {
            return this.jobTabs[jobId] || 'mistakes'
        },
        setJobTab(jobId, tab) {
            this.$set(this.jobTabs, jobId, tab)
        },
        toggleMistake(jobId, time) {
            const key = `${jobId}-${time}`
            this.$set(this.expandedMistakeKeys, key, !this.expandedMistakeKeys[key])
        },
        isMistakeExpanded(jobId, time) {
            return !!this.expandedMistakeKeys[`${jobId}-${time}`]
        },
        summarizeMistakeTypes(list) {
            const counts = { bad: 0, miss: 0, bomb: 0 }
            for (const m of list) {
                if (counts[m.type] !== undefined) counts[m.type]++
            }
            const parts = []
            if (counts.bad) parts.push(`${counts.bad} bad`)
            if (counts.miss) parts.push(`${counts.miss} miss`)
            if (counts.bomb) parts.push(`${counts.bomb} bomb`)
            return parts.join(', ')
        },
        getMistakesSort(jobId) {
            return this.mistakesSort[jobId] || 'time'
        },
        setMistakesSort(jobId, sort) {
            this.$set(this.mistakesSort, jobId, sort)
            this.$set(this.mistakesPage, jobId, 1)
        },
        getMistakesPage(jobId) {
            return this.mistakesPage[jobId] || 1
        },
        setMistakesPage(jobId, page) {
            this.$set(this.mistakesPage, jobId, Math.max(1, page))
        },
        getMistakesTotalPages(job) {
            return Math.max(1, Math.ceil(this.getMistakes(job).length / 10))
        },
        getPaginatedMistakes(job) {
            const list = this.getMistakes(job)
            const totalPages = Math.max(1, Math.ceil(list.length / 10))
            const page = Math.min(this.getMistakesPage(job.JobId), totalPages)
            const start = (page - 1) * 10
            return list.slice(start, start + 10)
        },
        getReplaysSort(jobId) {
            return this.replaysSort[jobId] || { field: 'acc', order: -1 }
        },
        toggleReplaySort(jobId, field) {
            const current = this.getReplaysSort(jobId)
            if (current.field === field) {
                this.$set(this.replaysSort, jobId, { field, order: -current.order })
            } else {
                this.$set(this.replaysSort, jobId, { field, order: -1 })
            }
            this.$set(this.replaysPage, jobId, 1)
        },
        getReplaySortIcon(jobId, field) {
            const current = this.getReplaysSort(jobId)
            if (current.field !== field) return 'bx bx-sort-alt-2 opacity-30 ml-0.5'
            return current.order === -1 ? 'bx bx-sort-down text-blue-400 ml-0.5' : 'bx bx-sort-up text-blue-400 ml-0.5'
        },
        getReplaysPage(jobId) {
            return this.replaysPage[jobId] || 1
        },
        setReplaysPage(jobId, page) {
            this.$set(this.replaysPage, jobId, Math.max(1, page))
        },
        getReplaysTotalPages(job) {
            const count = Object.keys(job.sortedReplays || {}).length
            return Math.max(1, Math.ceil(count / 10))
        },
        getPaginatedReplays(job) {
            const { field, order } = this.getReplaysSort(job.JobId)
            const list = Object.values(job.sortedReplays || {}).sort((a, b) => {
                const va = Number(a[field] ?? 0)
                const vb = Number(b[field] ?? 0)
                return (va - vb) * order
            })
            const page = this.getReplaysPage(job.JobId)
            const start = (page - 1) * 10
            return list.slice(start, start + 10)
        },
        async fetchAdminStats() {
            if (!this.isAdmin) return
            this.loadingAdminStats = true
            try {
                const res = await this.$crrApi.$get('admin_stats')
                this.adminStats = res
            } catch (e) {
                console.error('Failed to fetch admin stats:', e)
                if (process.dev || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))) {
                    const total = this.jobs.length || 11
                    const completed = this.jobs.filter((j) => j.done === 1).length || 8
                    const queued = this.jobs.filter((j) => j.done === 0).length || 2
                    const failed = total - completed - queued
                    const userMap = {}
                    this.jobs.forEach((j) => {
                        if (j.UserId) {
                            if (!userMap[j.UserId]) {
                                userMap[j.UserId] = { userId: j.UserId, userName: j.UserName || `User ${j.UserId}`, count: 0 }
                            }
                            userMap[j.UserId].count++
                        }
                    })
                    const topUsers = Object.values(userMap).sort((a, b) => b.count - a.count)
                    this.adminStats = {
                        totalJobs: total,
                        completedJobs: completed,
                        queuedJobs: queued,
                        failedJobs: failed,
                        successRate: Math.round((completed / total) * 100 * 10) / 10,
                        uniqueUsersCount: topUsers.length || 5,
                        topUsers: topUsers.length
                            ? topUsers
                            : [
                                  { userId: '100000000000000001', userName: 'user_alpha', count: 4 },
                                  { userId: '100000000000000002', userName: 'user_beta', count: 2 },
                                  { userId: '100000000000000003', userName: 'user_gamma', count: 2 },
                              ],
                    }
                }
            } finally {
                this.loadingAdminStats = false
            }
        },
        converToBookmarks() {},
        openLink(url) {
            window.open(url, '_blank').focus()
        },
        async loadJobs(force = false) {
            if (this.error) return

            this.loading = true

            try {
                let jobs = (await this.$crrApi.get('jobs')).data

                jobs = jobs
                    .map((job) => {
                        return {
                            ...job,
                            filters: {
                                showBadcuts: true,
                                showMisses: false,
                                showBombs: false,
                            },
                            done: job.Result?.includes('https://') ? 1 : job.Result == null ? 0 : -1,
                        }
                    })
                    .reverse()

                if (force) {
                    this.jobs = []
                    this.jobs = jobs
                }

                jobs = jobs.filter((job) => {
                    const existingJobIndex = this.jobs.findIndex((innerJob) => innerJob.JobId == job.JobId)
                    if (existingJobIndex >= 0 && job.Result != this.jobs[existingJobIndex].Result) {
                        this.$set(this.jobs, existingJobIndex, job)
                    }
                    return existingJobIndex < 0
                })

                this.jobs.push(...jobs)
            } catch (e) {
                if (process.dev || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))) {
                    const makeDt = (daysAgo, h = 12, m = 0) => {
                        const d = new Date()
                        d.setDate(d.getDate() - daysAgo)
                        d.setHours(h, m, 0, 0)
                        return d.toISOString().slice(0, 19).replace('T', ' ')
                    }
                    const rawJobs = [
                        { JobId: 1001, UserId: '100000000000000001', UserName: 'user_alpha', SongHash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', Mode: 'Standard', Diff: 'ExpertPlus', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1001.json', CreatedDate: makeDt(0, 14, 30), SongName: 'Song Title Alpha', BeatSaverKey: '1a2b3' },
                        { JobId: 1002, UserId: '100000000000000002', UserName: 'user_beta', SongHash: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', Mode: 'Standard', Diff: 'Expert', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1002.json', CreatedDate: makeDt(0, 10, 0), SongName: 'Song Title Beta', BeatSaverKey: '2c3d4' },
                        { JobId: 1003, UserId: '100000000000000001', UserName: 'user_alpha', SongHash: 'cccccccccccccccccccccccccccccccccccccccc', Mode: 'Standard', Diff: 'ExpertPlus', Result: null, CreatedDate: makeDt(0, 9, 15), SongName: 'Song Title Gamma (Queued)', BeatSaverKey: '3e4f5' },
                        { JobId: 1004, UserId: '100000000000000003', UserName: 'user_gamma', SongHash: 'dddddddddddddddddddddddddddddddddddddddd', Mode: 'Standard', Diff: 'Hard', Result: 'Error: Could not process map', CreatedDate: makeDt(1, 20, 0), SongName: 'Song Title Delta', BeatSaverKey: '' },
                        { JobId: 1005, UserId: '100000000000000002', UserName: 'user_beta', SongHash: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', Mode: 'Standard', Diff: 'ExpertPlus', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1005.json', CreatedDate: makeDt(1, 18, 45), SongName: 'Song Title Epsilon', BeatSaverKey: '5g6h7' },
                        { JobId: 1006, UserId: '100000000000000004', UserName: 'user_delta', SongHash: 'ffffffffffffffffffffffffffffffffffffffff', Mode: 'OneSaber', Diff: 'Expert', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1006.json', CreatedDate: makeDt(2, 8, 0), SongName: 'Song Title Zeta (One Saber)', BeatSaverKey: '6h7i8' },
                        { JobId: 1007, UserId: '100000000000000003', UserName: 'user_gamma', SongHash: '1111111111111111111111111111111111111111', Mode: 'Standard', Diff: 'ExpertPlus', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1007.json', CreatedDate: makeDt(3, 16, 20), SongName: 'Song Title Eta', BeatSaverKey: '7i8j9' },
                        { JobId: 1008, UserId: '100000000000000001', UserName: 'user_alpha', SongHash: '2222222222222222222222222222222222222222', Mode: 'Standard', Diff: 'Normal', Result: null, CreatedDate: makeDt(4, 11, 10), SongName: 'Song Title Theta (Queued)', BeatSaverKey: '8j9k0' },
                        { JobId: 1009, UserId: '100000000000000005', UserName: 'user_epsilon', SongHash: '3333333333333333333333333333333333333333', Mode: 'Standard', Diff: 'ExpertPlus', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1009.json', CreatedDate: makeDt(5, 22, 5), SongName: 'Song Title Iota', BeatSaverKey: '9k0l1' },
                        { JobId: 1010, UserId: '100000000000000005', UserName: 'user_epsilon', SongHash: '4444444444444444444444444444444444444444', Mode: 'Standard', Diff: 'Expert', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-1010.json', CreatedDate: makeDt(6, 15, 30), SongName: 'Song Title Kappa', BeatSaverKey: '0l1m2' },
                        { JobId: 1011, UserId: '100000000000000001', UserName: 'user_alpha', SongHash: '5555555555555555555555555555555555555555', Mode: 'Standard', Diff: 'ExpertPlus', Result: 'https://generated-replays.cdn.dzramen.com/mock/report-empty.json', CreatedDate: makeDt(0, 8, 0), SongName: 'V3 Map Test (No Replays)', BeatSaverKey: '0l1m3' },
                    ]
                    this.jobs = rawJobs.map((job) => ({
                        ...job,
                        filters: { showBadcuts: true, showMisses: false, showBombs: false },
                        done: job.Result?.includes('https://') ? 1 : job.Result == null ? 0 : -1,
                    }))
                    this.error = null
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: `${e.response?.statusText || 'Error'} ${e.response?.status || ''}`,
                        life: 3000,
                    })
                    this.error = e
                }
            } finally {
                this.loading = false
            }
        },
        openJob(job) {
            this.$buefy.modal.open({
                parent: this,
                component: JobViewModal,
                hasModalCard: true,
                trapFocus: true,
                fullScreen: false,
                props: { job: this.getJobData(job), title: 'Job Details' },
                events: {},
            })
        },
        openReplayInfo(replay) {
            if (!replay) return
            this.$buefy.modal.open({
                parent: this,
                component: JobViewModal,
                hasModalCard: true,
                trapFocus: true,
                fullScreen: false,
                props: { job: Object.entries(replay), title: 'Replay Parameters' },
                events: {},
            })
        },
        async createJob() {
            this.$buefy.modal.open({
                parent: this,
                component: CreateJobModal,
                hasModalCard: true,
                trapFocus: true,
                fullScreen: false,
                props: {},
                events: {
                    close: () => {
                        this.loadJobs()
                    },
                },
            })
        },
        async loadJob(job) {
            job = job.data || job
            if (!job || !job.Result || job.loadedResults || !job.Result?.includes('https://')) return

            this.loadingJob = true

            try {
                let results

                const isDev = process.dev || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))

                if (isDev && job.Result?.includes('/mock/')) {
                    if (job.Result?.includes('report-empty')) {
                        results = []
                    } else {
                        const mkReplay = (seed) => {
                            const rng = (min, max) => Math.round((min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min)) * 100) / 100
                            const acc = Math.min(99.9, 70 + rng(seed, 29))
                            const numMistakes = Math.floor(rng(seed + 1, 15))
                            const mistakes = Array.from({ length: numMistakes }, (_, i) => ({
                                time: parseFloat((i * 3.14 + seed * 0.7).toFixed(3)),
                                type: ['bad', 'miss', 'bomb'][i % 3],
                                noteId: i + seed * 10,
                            }))
                            return {
                                ReplayParams: {
                                    acc: parseFloat(acc.toFixed(2)),
                                    fcAcc: parseFloat((acc + rng(seed + 2, 3)).toFixed(2)),
                                    fps: [60, 90, 120][seed % 3],
                                    mistakes: numMistakes,
                                    headsetYposition: parseFloat((1.5 + rng(seed, 0.4)).toFixed(3)),
                                    height: parseFloat((170 + rng(seed, 20)).toFixed(1)),
                                    jd: parseFloat((15 + rng(seed, 10)).toFixed(1)),
                                    postSwingAngle: parseFloat((50 + rng(seed, 30)).toFixed(1)),
                                    preSwingAngle: parseFloat((60 + rng(seed, 20)).toFixed(1)),
                                    timeDeviation: parseFloat((0.01 + rng(seed, 0.1)).toFixed(4)),
                                    requestedAcc: parseFloat((acc - 5).toFixed(2)),
                                    replayUrl: `https://cdn.dzramen.com/mock/replay-${seed}.bsor`,
                                },
                                ReplayMistakes: mistakes,
                            }
                        }
                        results = Array.from({ length: 5 + (job.JobId % 8) }, (_, i) => mkReplay(job.JobId + i))
                    }
                } else {
                    results = (await this.$http.get(job.Result)).data
                }

                const sortedReplays = {}
                const specifics = {
                    highestAcc: {},
                    mostMistakes: {},
                    total_bomb: 0,
                    total_miss: 0,
                    total_bad: 0,
                }

                let mistakes = {}
                for (let [replayIndex, replay] of results.entries()) {
                    for (const mistake of replay.ReplayMistakes) {
                        const time = mistake.time.toFixed(3).toString()

                        if (!mistakes[time]) mistakes[time] = []

                        specifics[`total_${mistake.type}`]++

                        mistakes[time].push({
                            ...mistake,
                            replayId: replayIndex,
                        })
                    }

                    const newReplay = {
                        ...replay.ReplayParams,
                        mistakes: replay.ReplayMistakes.length,
                        MapUrl: job.MapUrl,
                    }

                    sortedReplays[replayIndex] = newReplay

                    if ((specifics.highestAcc?.acc || 0) < newReplay.acc) {
                        specifics.highestAcc = newReplay
                    }
                    if ((specifics.mostMistakes.mistakes || 0) < newReplay.mistakes) {
                        specifics.mostMistakes = newReplay
                    }
                }

                mistakes = Object.entries(mistakes)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map((item) => {
                        return {
                            time: item[0],
                            mistakes: item[1].sort((a, b) => {
                                return sortedReplays[a.replayId].acc - sortedReplays[b.replayId].acc
                            }),
                        }
                    })

                this.$set(job, 'sortedReplays', sortedReplays)
                this.$set(job, 'specifics', specifics)
                this.$set(job, 'sortedMistakes', mistakes)
                this.$set(job, 'loadedResults', results)
            } catch (e) {
                console.error(e)
                this.$set(job, 'Result', 'Could not fetch data, replay log might be outdated')
            }
            this.loadingJob = false
        },
        getMistakes(job) {
            if (!job.sortedMistakes) return []
            const filtered = job.sortedMistakes
                .map((mistake) => {
                    const filteredMistakes = mistake.mistakes.filter((singleMistake) => {
                        return (
                            (job.filters.showBadcuts && singleMistake.type == 'bad') ||
                            (job.filters.showMisses && singleMistake.type == 'miss') ||
                            (job.filters.showBombs && singleMistake.type == 'bomb')
                        )
                    })

                    return {
                        ...mistake,
                        mistakes: filteredMistakes,
                    }
                })
                .filter((mistake) => mistake.mistakes.length > 0)

            if (this.getMistakesSort(job.JobId) === 'count') {
                return [...filtered].sort((a, b) => b.mistakes.length - a.mistakes.length)
            }
            return filtered
        },
        openReplay(job, mistake) {
            let url
            if (mistake) {
                const time = (mistake.time - 3) * 1000
                url = `https://replay.beatleader.xyz/?link=${
                    job.sortedReplays[mistake.replayId].replayUrl
                }&time=${time}&speed=80`
            } else {
                url = `https://replay.beatleader.xyz/?link=${job.replayUrl}`
            }

            if (job.MapUrl) url = `${url}&mapLink=${job.MapUrl.replace('http://', 'https://')}`

            window.open(url, '_blank').focus()
        },
        getJobData(job) {
            job = structuredClone(job)
            for (const key of [
                'loadedResults',
                'sortedReplays',
                'sortedMistakes',
                'specifics',
                'filters',
                'filteredJobs',
                'done',
            ])
                delete job[key]

            return Object.entries(job).reverse()
        },
    },
}
</script>

<style lang="scss" scoped>
.cyberramen {
    min-height: 100vh;
}
</style>
