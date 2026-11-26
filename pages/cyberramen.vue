<template>
    <div class="cyberramen pb-12">
        <sub-header title="CyberRamen Request Tool">
            <p v-html="description"></p>
        </sub-header>

        <div class="w-full max-w-7xl px-4 sm:px-8 mx-auto mt-6">
            <!-- Error State -->
            <div v-if="error" class="bg-[#1e2023] border border-rose-500/30 rounded-lg p-6 text-center text-rose-300 my-4">
                <p class="font-semibold text-sm">Failed to load CyberRamen jobs</p>
                <p class="text-xs text-rose-400/80 mt-1">{{ error.message || error }}</p>
            </div>

            <!-- Logged In Content -->
            <div v-else-if="profile" class="space-y-5">
                <!-- Admin Stats -->
                <div v-if="isAdmin" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-4 space-y-4">
                    <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
                        <h3 class="text-sm font-semibold text-gray-100">Admin Stats</h3>
                        <button
                            @click="fetchAdminStats"
                            class="px-2.5 py-1 bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1 border border-white/[0.07]"
                            title="Refresh Admin Stats"
                        >
                            <i :class="['bx bx-refresh text-sm', loadingAdminStats ? 'animate-spin' : '']"></i> Refresh
                        </button>
                    </div>

                    <div v-if="adminStats" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg px-3 py-2.5">
                            <span class="text-[11px] text-gray-400 block">Total Requests</span>
                            <span class="text-base font-semibold font-mono text-gray-100">{{ adminStats.totalJobs }}</span>
                        </div>
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg px-3 py-2.5">
                            <span class="text-[11px] text-gray-400 block">Success Rate</span>
                            <span class="text-base font-semibold font-mono text-emerald-400">{{ adminStats.successRate }}%</span>
                        </div>
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg px-3 py-2.5">
                            <span class="text-[11px] text-gray-400 block">Completed</span>
                            <span class="text-base font-semibold font-mono text-gray-100">{{ adminStats.completedJobs }}</span>
                        </div>
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg px-3 py-2.5">
                            <span class="text-[11px] text-gray-400 block">Queued</span>
                            <span class="text-base font-semibold font-mono text-blue-400">{{ adminStats.queuedJobs }}</span>
                        </div>
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg px-3 py-2.5">
                            <span class="text-[11px] text-gray-400 block">Failed</span>
                            <span class="text-base font-semibold font-mono text-rose-400">{{ adminStats.failedJobs }}</span>
                        </div>
                        <div class="bg-[#141417] border border-white/[0.06] rounded-lg px-3 py-2.5">
                            <span class="text-[11px] text-gray-400 block">Requesters</span>
                            <span class="text-base font-semibold font-mono text-gray-100">{{ adminStats.uniqueUsersCount }}</span>
                        </div>
                    </div>

                    <!-- Top Requesters -->
                    <div v-if="adminStats?.topUsers?.length" class="flex flex-wrap items-center gap-2 pt-1">
                        <span class="text-xs text-gray-400 mr-1">Top requesters:</span>
                        <button
                            v-for="u in adminStats.topUsers"
                            :key="u.userId || u.userName"
                            @click="jobFilters.userid = (jobFilters.userid === u.userId ? null : u.userId)"
                            :class="[
                                'px-2.5 py-1 rounded-md text-xs transition-colors flex items-center gap-1.5 border',
                                jobFilters.userid && jobFilters.userid === u.userId
                                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-200'
                                    : 'bg-[#141417] hover:bg-[#25282c] border-white/[0.07] text-gray-300',
                            ]"
                            :title="`Filter by ${u.userName}`"
                        >
                            <span>{{ u.userName }}</span>
                            <span class="text-gray-500 font-mono text-[11px]">{{ u.count }}</span>
                        </button>
                    </div>
                </div>

                <!-- Controls Bar -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-3.5 flex flex-wrap items-center gap-3">
                    <div class="relative shrink-0">
                        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none"></i>
                        <input
                            type="text"
                            v-model="jobFilters.textSearch"
                            placeholder="Search song title..."
                            class="bg-[#141417] text-gray-100 placeholder-gray-500 border border-white/[0.08] focus:border-blue-500 rounded-lg pl-9 pr-8 py-2 text-sm outline-none transition-colors w-56"
                        />
                        <button
                            v-if="jobFilters.textSearch"
                            @click="jobFilters.textSearch = ''"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 text-base transition-colors"
                        >
                            <i class="bx bx-x"></i>
                        </button>
                    </div>

                    <div v-if="jobUsers.length > 1" class="shrink-0">
                        <Dropdown
                            v-model="jobFilters.userid"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Filter by user"
                            :options="jobUsers"
                            class="w-44 p-inputtext-sm"
                            :showClear="true"
                            appendTo="body"
                            scrollHeight="400px"
                        />
                    </div>

                    <button
                        @click="createJob"
                        :disabled="creatingJob"
                        class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-1.5 shrink-0 ml-auto"
                    >
                        <i class="bx bx-plus text-base"></i>
                        <span>New Replay Request</span>
                    </button>
                </div>

                <!-- Active Job ID Filter -->
                <div
                    v-if="filteredJobs.length"
                    class="bg-[#1e2023] border border-blue-500/30 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-gray-300"
                >
                    <span>Filtered by Job IDs: <strong class="font-mono text-gray-100">{{ filteredJobs.join(', ') }}</strong></span>
                    <button
                        @click="filteredJobs = []"
                        class="text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium"
                    >
                        Clear filter
                    </button>
                </div>

                <!-- Main Data Table -->
                <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden relative min-h-[300px]">
                    <div v-if="loading && !computedJobs.length" class="p-12 flex flex-col items-center justify-center">
                        <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
                        <span class="text-gray-400 mt-3 text-sm">Loading jobs...</span>
                    </div>
                    <DataTable
                        v-else
                        class="w-full text-left"
                        :value="computedJobs"
                        :expandedRows.sync="expandedRows"
                        responsiveLayout="scroll"
                        :paginator="true"
                        :rows="50"
                        @row-expand="loadJob"
                    >
                        <Column :expander="true" :headerStyle="{ width: '3rem' }" />

                        <!-- Status -->
                        <Column field="done" header="Status" sortable>
                            <template #body="{ data: job }">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1.5 text-xs font-medium',
                                        job.done === 1
                                            ? (job.loadedResults && (!job.loadedResults.length || !Object.keys(job.sortedReplays || {}).length)
                                                ? 'text-amber-400'
                                                : 'text-emerald-400')
                                            : job.done === 0
                                            ? 'text-blue-400'
                                            : 'text-rose-400',
                                    ]"
                                >
                                    <span
                                        :class="[
                                            'w-1.5 h-1.5 rounded-full',
                                            job.done === 1
                                                ? (job.loadedResults && (!job.loadedResults.length || !Object.keys(job.sortedReplays || {}).length)
                                                    ? 'bg-amber-400'
                                                    : 'bg-emerald-400')
                                                : job.done === 0
                                                ? 'bg-blue-400'
                                                : 'bg-rose-400',
                                        ]"
                                    ></span>
                                    {{
                                        job.done === 1
                                            ? (job.loadedResults && (!job.loadedResults.length || !Object.keys(job.sortedReplays || {}).length)
                                                ? 'No Replays'
                                                : 'Done')
                                            : job.done === 0
                                            ? 'Queued'
                                            : 'Error'
                                    }}
                                </span>
                            </template>
                        </Column>

                        <!-- Song Name -->
                        <Column field="SongName" header="Song Name" sortable>
                            <template #body="{ data: job }">
                                <button
                                    @click="toggleRow(job)"
                                    class="text-left font-medium text-gray-100 hover:text-blue-400 transition-colors text-sm"
                                >
                                    {{ job.SongName || 'Untitled Song' }}
                                </button>
                            </template>
                        </Column>

                        <!-- Requested By (Admin) -->
                        <Column v-if="isAdmin" field="UserName" header="Requested By" sortable>
                            <template #body="{ data: job }">
                                <div class="flex flex-col min-w-0">
                                    <span
                                        @click="jobFilters.userid = job.UserId"
                                        class="text-xs font-medium text-gray-200 hover:text-blue-400 transition-colors cursor-pointer truncate"
                                        :title="`Click to filter by ${job.UserName}`"
                                    >
                                        {{ job.UserName || 'Unknown' }}
                                    </span>
                                    <span v-if="job.UserId" class="text-[11px] text-gray-500 font-mono truncate">
                                        {{ job.UserId }}
                                    </span>
                                </div>
                            </template>
                        </Column>

                        <!-- Difficulty -->
                        <Column field="Diff" header="Diff" sortable>
                            <template #body="{ data: job }">
                                <span class="text-xs text-gray-300 font-mono">
                                    {{ job.Diff || 'Standard' }}
                                </span>
                            </template>
                        </Column>

                        <!-- Created Date -->
                        <Column field="CreatedDate" header="Created" sortable>
                            <template #body="{ data: job }">
                                <span class="text-xs text-gray-300 font-mono">
                                    {{ formatDate(job.CreatedDate) }}
                                </span>
                            </template>
                        </Column>

                        <!-- Finished Date -->
                        <Column field="CompletedDate" header="Finished" sortable>
                            <template #body="{ data: job }">
                                <span class="text-xs text-gray-400 font-mono">
                                    {{ formatDate(job.CompletedDate) }}
                                </span>
                            </template>
                        </Column>

                        <!-- Actions -->
                        <Column header="Actions">
                            <template #body="{ data: job }">
                                <div class="flex items-center gap-1.5">
                                    <button
                                        @click="openJob(job)"
                                        class="px-2.5 py-1 rounded-md bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white text-xs font-medium transition-colors border border-white/[0.07]"
                                        title="View job details"
                                    >
                                        Info
                                    </button>
                                    <a
                                        v-if="job.BeatSaverKey"
                                        :href="`https://beatsaver.com/maps/${job.BeatSaverKey}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="nope px-2.5 py-1 rounded-md bg-[#25282c] hover:bg-blue-600 text-gray-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1 border border-white/[0.07]"
                                        title="View map on BeatSaver"
                                    >
                                        #{{ job.BeatSaverKey }} <i class="bx bx-link-external text-xs"></i>
                                    </a>
                                </div>
                            </template>
                        </Column>

                        <!-- Expanded Row -->
                        <template #expansion="{ data: job, index }">
                            <div class="bg-[#141417] p-4 border-t border-white/[0.06] space-y-4">
                                <div v-if="!job.Result" class="p-6 text-center text-gray-400 flex flex-col items-center">
                                    <ProgressSpinner style="width: 28px; height: 28px" strokeWidth="4" />
                                    <p class="mt-3 text-sm text-gray-300">Generating replays and mistake analysis... Please wait :DDD</p>
                                </div>

                                <div v-else-if="!job.Result?.includes('https://')" class="p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
                                    {{ job.Result }}
                                </div>

                                <div v-else-if="!job.loadedResults" class="p-6 text-center text-gray-400">
                                    <ProgressSpinner style="width: 28px; height: 28px" strokeWidth="4" />
                                    <p class="mt-2 text-xs">Loading replay results...</p>
                                </div>

                                <div v-else-if="!job.loadedResults.length || !Object.keys(job.sortedReplays || {}).length" class="p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                                    <i class="bx bx-error text-xl text-amber-400 shrink-0 mt-0.5"></i>
                                    <div class="space-y-1">
                                        <p class="font-semibold">No replays generated for this job</p>
                                        <p class="text-amber-200/80">
                                            This job completed, but no replays were found. This might be because the map uses <strong>V3 map format</strong>, <strong>Noodle Extensions</strong>, or <strong>Mapping Extensions</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div v-else class="space-y-4">
                                    <!-- Summary Strip (Highest Acc & Most Mistakes) -->
                                    <div class="flex flex-wrap items-center gap-3">
                                        <div v-if="job.specifics?.highestAcc?.acc" class="bg-[#1e2023] border border-white/[0.07] rounded-lg px-4 py-2.5 flex items-center gap-4">
                                            <div>
                                                <span class="text-[11px] text-gray-400 block">Highest Accuracy</span>
                                                <span class="text-sm font-semibold font-mono text-emerald-400">{{ job.specifics.highestAcc.acc }}%</span>
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                                <button
                                                    @click="openReplay(job.specifics.highestAcc)"
                                                    class="px-2.5 py-1 bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                                                >
                                                    Replay <i class="bx bx-link-external"></i>
                                                </button>
                                                <a
                                                    :href="job.specifics.highestAcc.replayUrl"
                                                    class="nope p-1.5 bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white rounded-md text-sm transition-colors"
                                                    title="Download replay file"
                                                >
                                                    <i class="bx bx-download"></i>
                                                </a>
                                            </div>
                                        </div>

                                        <div v-if="job.specifics?.mostMistakes" class="bg-[#1e2023] border border-white/[0.07] rounded-lg px-4 py-2.5 flex items-center gap-4">
                                            <div>
                                                <span class="text-[11px] text-gray-400 block">Most Mistakes</span>
                                                <span class="text-sm font-semibold font-mono text-amber-400">{{ job.specifics.mostMistakes.mistakes || 0 }} mistakes</span>
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                                <button
                                                    @click="openReplay(job.specifics.mostMistakes)"
                                                    class="px-2.5 py-1 bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                                                >
                                                    Replay <i class="bx bx-link-external"></i>
                                                </button>
                                                <a
                                                    :href="job.specifics.mostMistakes.replayUrl"
                                                    class="nope p-1.5 bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white rounded-md text-sm transition-colors"
                                                    title="Download replay file"
                                                >
                                                    <i class="bx bx-download"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Tabs -->
                                    <TabView :activeIndex.sync="job.selectedTab" class="custom-tabview">
                                        <!-- Mistakes Tab -->
                                        <TabPanel :header="`Mistakes (${job.sortedMistakes.length})`">
                                            <div class="flex flex-wrap items-center gap-6 py-2.5 px-4 bg-[#1e2023] border border-white/[0.06] rounded-lg mb-3 text-xs text-gray-300">
                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <Checkbox
                                                        :id="`showBadcuts-${job.JobId}`"
                                                        v-model="computedJobs[index].filters.showBadcuts"
                                                        :binary="true"
                                                    />
                                                    <span>Badcuts (<span class="font-mono text-gray-100">{{ job.specifics['total_bad'] }}</span>)</span>
                                                </label>

                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <Checkbox
                                                        :id="`showMisses-${job.JobId}`"
                                                        v-model="computedJobs[index].filters.showMisses"
                                                        :binary="true"
                                                    />
                                                    <span>Misses (<span class="font-mono text-gray-100">{{ job.specifics['total_miss'] }}</span>)</span>
                                                </label>

                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <Checkbox
                                                        :id="`showBombs-${job.JobId}`"
                                                        v-model="computedJobs[index].filters.showBombs"
                                                        :binary="true"
                                                    />
                                                    <span>Bombs (<span class="font-mono text-gray-100">{{ job.specifics['total_bomb'] }}</span>)</span>
                                                </label>
                                            </div>

                                            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
                                                <DataTable
                                                    :value="getMistakes(job)"
                                                    :expandedRows.sync="expandedRows"
                                                    responsiveLayout="scroll"
                                                    :paginator="getMistakes(job).length > 10"
                                                    :rows="10"
                                                >
                                                    <Column :expander="true" :headerStyle="{ width: '3rem' }" />
                                                    <Column field="time" header="Timestamp" sortable>
                                                        <template #body="{ data: mistake }">
                                                            <span class="font-mono text-xs text-gray-200">{{ mistake.time }}s</span>
                                                        </template>
                                                    </Column>
                                                    <Column field="mistakes" header="Replays Missed" sortable>
                                                        <template #body="{ data: mistakes }">
                                                            <span class="text-xs font-mono text-rose-400">
                                                                {{ mistakes.mistakes.length }} replays
                                                            </span>
                                                        </template>
                                                    </Column>

                                                    <template #expansion="{ data: mistake }">
                                                        <div class="p-3 bg-[#141417] border-t border-white/[0.06]">
                                                            <DataTable
                                                                class="w-full text-left"
                                                                :value="mistake.mistakes"
                                                                responsiveLayout="scroll"
                                                                :paginator="mistake.mistakes.length > 10"
                                                                :rows="10"
                                                            >
                                                                <Column field="type" header="Type" sortable>
                                                                    <template #body="{ data: m }">
                                                                        <span
                                                                            :class="[
                                                                                'text-xs font-mono uppercase font-medium',
                                                                                m.type === 'bad'
                                                                                    ? 'text-rose-400'
                                                                                    : m.type === 'miss'
                                                                                    ? 'text-amber-400'
                                                                                    : 'text-gray-300',
                                                                            ]"
                                                                        >
                                                                            {{ m.type }}
                                                                        </span>
                                                                    </template>
                                                                </Column>
                                                                <Column field="noteId" header="Note ID" sortable>
                                                                    <template #body="{ data: m }">
                                                                        <span class="font-mono text-xs text-gray-400">#{{ m.noteId }}</span>
                                                                    </template>
                                                                </Column>
                                                                <Column header="Actions">
                                                                    <template #body="{ data: singleMistake }">
                                                                        <div class="flex items-center gap-1.5">
                                                                            <button
                                                                                @click="openReplay(job, singleMistake)"
                                                                                class="px-2.5 py-1 rounded-md bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                                                                            >
                                                                                Replay <i class="bx bx-link-external"></i>
                                                                            </button>
                                                                            <button
                                                                                @click="(event) => $refs[`panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`].toggle(event)"
                                                                                class="p-1.5 rounded-md bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white text-sm transition-colors"
                                                                                title="View replay attributes"
                                                                            >
                                                                                <i class="bx bx-info-circle"></i>
                                                                            </button>
                                                                            <OverlayPanel
                                                                                :ref="`panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`"
                                                                                appendTo="body"
                                                                                class="bg-[#1e2023] border border-white/10 text-gray-100 rounded-lg p-3 shadow-xl max-w-sm"
                                                                            >
                                                                                <div class="font-semibold text-xs text-gray-200 mb-2 border-b border-white/10 pb-1.5">
                                                                                    Replay Info
                                                                                </div>
                                                                                <div
                                                                                    v-for="attribute of Object.entries(job.sortedReplays[singleMistake.replayId])"
                                                                                    :key="attribute[0]"
                                                                                    class="flex items-center justify-between text-xs py-1 border-b border-white/[0.05]"
                                                                                >
                                                                                    <span class="text-gray-400 mr-4">{{ attribute[0] }}</span>
                                                                                    <a
                                                                                        v-if="attribute[1] && String(attribute[1]).includes('https://')"
                                                                                        @click="openReplay(job, singleMistake)"
                                                                                        class="text-blue-400 hover:underline cursor-pointer"
                                                                                    >
                                                                                        Link
                                                                                    </a>
                                                                                    <span v-else class="font-mono text-gray-200">{{ attribute[1] != null ? attribute[1] : 'n/a' }}</span>
                                                                                </div>
                                                                            </OverlayPanel>
                                                                        </div>
                                                                    </template>
                                                                </Column>
                                                            </DataTable>
                                                        </div>
                                                    </template>
                                                </DataTable>
                                            </div>
                                        </TabPanel>

                                        <!-- All Replays Tab -->
                                        <TabPanel :header="`All Replays (${Object.keys(job.sortedReplays).length})`">
                                            <div class="bg-[#1e2023] border border-white/[0.06] rounded-lg overflow-hidden">
                                                <DataTable
                                                    class="w-full text-left"
                                                    :value="Object.values(job.sortedReplays)"
                                                    responsiveLayout="scroll"
                                                    :paginator="true"
                                                    :rows="10"
                                                    sortField="acc"
                                                    :sortOrder="-1"
                                                >
                                                    <Column field="acc" header="Acc" sortable>
                                                        <template #body="{ data: r }">
                                                            <span class="font-mono font-semibold text-emerald-400 text-xs">{{ r.acc }}%</span>
                                                        </template>
                                                    </Column>
                                                    <Column field="fcAcc" header="FC Acc" sortable>
                                                        <template #body="{ data: r }">
                                                            <span class="font-mono text-gray-300 text-xs">{{ r.fcAcc }}%</span>
                                                        </template>
                                                    </Column>
                                                    <Column field="fps" header="FPS" sortable>
                                                        <template #body="{ data: r }">
                                                            <span class="font-mono text-xs text-gray-300">{{ r.fps }}</span>
                                                        </template>
                                                    </Column>
                                                    <Column field="mistakes" header="Mistakes" sortable>
                                                        <template #body="{ data: r }">
                                                            <span :class="['font-mono text-xs font-semibold', r.mistakes > 0 ? 'text-rose-400' : 'text-emerald-400']">
                                                                {{ r.mistakes }}
                                                            </span>
                                                        </template>
                                                    </Column>
                                                    <Column field="headsetYposition" header="HMD Y Pos" sortable />
                                                    <Column field="height" header="Height" sortable />
                                                    <Column field="jd" header="JD" sortable />
                                                    <Column field="postSwingAngle" header="Post Swing" sortable />
                                                    <Column field="preSwingAngle" header="Pre Swing" sortable />
                                                    <Column field="timeDeviation" header="Time Dev" sortable />
                                                    <Column field="requestedAcc" header="Requested Acc" sortable />
                                                    <Column header="Actions">
                                                        <template #body="{ data: replay }">
                                                            <div class="flex items-center gap-1.5">
                                                                <button
                                                                    @click="openReplay(replay)"
                                                                    class="px-2.5 py-1 rounded-md bg-[#25282c] hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                                                                >
                                                                    View <i class="bx bx-link-external"></i>
                                                                </button>
                                                                <a
                                                                    :href="replay.replayUrl"
                                                                    class="nope p-1.5 rounded-md bg-[#25282c] hover:bg-[#2e3238] text-gray-300 hover:text-white text-sm transition-colors"
                                                                    title="Download replay"
                                                                >
                                                                    <i class="bx bx-download"></i>
                                                                </a>
                                                            </div>
                                                        </template>
                                                    </Column>
                                                </DataTable>
                                            </div>
                                        </TabPanel>
                                    </TabView>
                                </div>
                            </div>
                        </template>
                    </DataTable>
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
            expandedRows: [],
            jobFilters: { userid: null, textSearch: '' },
            filteredJobs: [],
            users: [],
            jobsOffset: 0,
            rowsCount: 50,
            loading: false,
            description: '',
            adminStats: null,
            loadingAdminStats: false,
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
        filteredJobs(newval, oldval) {
            const url = new URL(window.location)
            if (newval.length > 0) {
                url.searchParams.set('jobs', newval.join())
            } else {
                url.searchParams.delete('jobs')
            }
            window.history.pushState(null, '', url.toString())
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
            let jobs = this.jobs

            if (this.filteredJobs.length > 0) {
                jobs = jobs.filter((job) => this.filteredJobs.includes(job.JobId))
            }
            if (this.jobFilters.userid) {
                jobs = jobs.filter((job) => job.UserId == this.jobFilters.userid)
            }
            if (this.jobFilters.textSearch && this.jobFilters.textSearch.trim()) {
                const query = this.jobFilters.textSearch.trim().toLowerCase()
                jobs = jobs.filter((job) =>
                    job.SongName?.toLowerCase().includes(query),
                )
            }

            return jobs.sort((a, b) => Date.parse(b.CreatedDate) - Date.parse(a.CreatedDate))
        },
        jobUsers() {
            const unique = {}
            const jobs = this.jobs
                .flatMap((job) => {
                    if (!job.UserId || unique[job.UserId]) {
                        return []
                    } else {
                        unique[job.UserId] = true
                        return { name: job.UserName || `User ${job.UserId}`, id: job.UserId }
                    }
                })
                .sort((a, b) => {
                    if (a.name < b.name) return -1
                    if (a.name > b.name) return 1
                    return 0
                })
            return jobs
        },
    },
    methods: {
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
                    const userCounts = {}
                    this.jobs.forEach((j) => {
                        if (j.UserId) {
                            const name = j.UserName || `User ${j.UserId}`
                            userCounts[name] = (userCounts[name] || 0) + 1
                        }
                    })
                    const topUsers = Object.entries(userCounts)
                        .map(([userName, count]) => ({ userName, count }))
                        .sort((a, b) => b.count - a.count)
                    this.adminStats = {
                        totalJobs: total,
                        completedJobs: completed,
                        queuedJobs: queued,
                        failedJobs: failed,
                        successRate: Math.round((completed / total) * 100 * 10) / 10,
                        uniqueUsersCount: Object.keys(userCounts).length || 5,
                        topUsers: topUsers.length
                            ? topUsers
                            : [
                                  { userName: 'user_alpha', count: 4 },
                                  { userName: 'user_beta', count: 2 },
                                  { userName: 'user_gamma', count: 2 },
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
        formatDate(dateStr) {
            if (!dateStr) return '-'
            try {
                const d = new Date(dateStr)
                return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            } catch (e) {
                return dateStr
            }
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
                props: { job: this.getJobData(job) },
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
            const index = this.computedJobs.findIndex((item) => item.JobId == job.JobId)

            if (!job || index == null || !job.Result || job.loadedResults || !job.Result?.includes('https://')) return

            this.loadingJob = true

            try {
                let results

                const isDev = process.dev || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))

                if (isDev && job.Result?.includes('/mock/')) {
                    if (job.Result?.includes('report-empty')) {
                        results = []
                    } else {
                        // Generate fake replay data for dev mode
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

                job.sortedReplays = {}
                job.specifics = {
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

                        job.specifics[`total_${mistake.type}`]++

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

                    job.sortedReplays[replayIndex] = newReplay

                    if ((job.specifics.highestAcc?.acc || 0) < newReplay.acc) {
                        job.specifics.highestAcc = newReplay
                    }
                    if ((job.specifics.mostMistakes.mistakes || 0) < newReplay.mistakes) {
                        job.specifics.mostMistakes = newReplay
                    }
                }

                mistakes = Object.entries(mistakes)
                    .sort((a, b) => a[0] - b[0])
                    .map((item) => {
                        return {
                            time: item[0],
                            mistakes: item[1].sort((a, b) => {
                                return job.sortedReplays[a.replayId].acc - job.sortedReplays[b.replayId].acc
                            }),
                        }
                    })

                job.sortedMistakes = mistakes
                job.loadedResults = results

                this.$set(this.computedJobs, index, job)
            } catch (e) {
                console.error(e)
                job.Result = 'Could not fetch data, replay log might be outdated'
            }
            this.loadingJob = false
        },
        getMistakes(job) {
            if (!job.sortedMistakes) return []
            return job.sortedMistakes
                .map((mistake) => {
                    const filteredMistakes = mistake.mistakes.filter((singleMistake) => {
                        if (
                            (job.filters.showBadcuts && singleMistake.type == 'bad') ||
                            (job.filters.showMisses && singleMistake.type == 'miss') ||
                            (job.filters.showBombs && singleMistake.type == 'bomb')
                        ) {
                            return true
                        }
                        return false
                    })

                    return {
                        ...mistake,
                        mistakes: filteredMistakes,
                    }
                })
                .filter((mistake) => {
                    return mistake.mistakes.length > 0
                })
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
        toggleRow(job) {
            const index = this.expandedRows.find((x) => x.JobId === job.JobId)

            if (index === undefined) {
                this.expandedRows = [...this.computedJobs.filter((x) => x.JobId === job.JobId), ...this.expandedRows]
                this.loadJob(job)
            } else {
                this.expandedRows = this.expandedRows.filter((x) => x.JobId !== job.JobId)
            }
        },
    },
}
</script>

<style lang="scss">
.cyberramen {
    min-height: 100vh;
}

.custom-tabview {
    .p-tabview-nav {
        background-color: transparent !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;

        li {
            .p-tabview-nav-link {
                background-color: transparent !important;
                border: none !important;
                color: #9ca3af !important;
                font-size: 0.875rem !important;
                font-weight: 600 !important;
                padding: 0.75rem 1.25rem !important;
                transition: color 0.2s !important;

                &:hover {
                    color: #ffffff !important;
                }
            }

            &.p-highlight .p-tabview-nav-link {
                color: #60a5fa !important;
                border-bottom: 2px solid #3b82f6 !important;
            }
        }
    }

    .p-tabview-panels {
        background-color: transparent !important;
        padding-top: 1rem !important;
    }
}
</style>
