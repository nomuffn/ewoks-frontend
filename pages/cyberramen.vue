<template>
    <div class="cyberramen pb-12">
        <sub-header title="CyberRamen Request Tool">
            <p v-html="description"></p>
        </sub-header>

        <div class="w-full px-4 sm:px-8 mt-6">
            <!-- Error State -->
            <div v-if="error" class="bg-rose-950/40 border border-rose-800/60 rounded-xl p-6 text-center text-rose-300 my-4 shadow-lg">
                <i class="bx bx-error-circle text-4xl mb-2 text-rose-400"></i>
                <p class="font-semibold text-base">Failed to load CyberRamen jobs</p>
                <p class="text-xs text-rose-400/80 mt-1">{{ error.message || error }}</p>
            </div>

            <!-- Logged In Content -->
            <div v-else-if="profile" class="space-y-6">
                <!-- Controls & Filter Header Card -->
                <div class="bg-[#18191c] border border-gray-800 rounded-xl p-4 shadow-lg flex items-center justify-between gap-4">
                    <!-- New Request Button -->
                    <button
                        @click="createJob"
                        :disabled="creatingJob"
                        class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 shrink-0"
                    >
                        <i class="bx bx-plus-circle text-lg"></i>
                        <span>New Replay Request</span>
                    </button>

                    <!-- User Filter Dropdown -->
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

                    <!-- Search Input -->
                    <div class="relative shrink-0">
                        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                        <input
                            type="text"
                            v-model="jobFilters.textSearch"
                            placeholder="Search song title..."
                            class="bg-[#121315] text-gray-100 placeholder-gray-500 border border-gray-700 focus:border-blue-500 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none transition-all w-52"
                        />
                        <button
                            v-if="jobFilters.textSearch"
                            @click="jobFilters.textSearch = ''"
                            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full text-base transition-colors"
                        >
                            <i class="bx bx-x"></i>
                        </button>
                    </div>
                </div>

                <!-- Query Param Active Filter Alert -->
                <div
                    v-if="filteredJobs.length"
                    class="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-blue-300 shadow-md"
                >
                    <div class="flex items-center gap-2">
                        <i class="bx bx-filter-alt text-base text-blue-400"></i>
                        <span>Filtered by Job IDs: <strong class="font-mono text-gray-100">{{ filteredJobs.join(', ') }}</strong></span>
                    </div>
                    <button
                        @click="filteredJobs = []"
                        class="text-blue-400 hover:text-white transition-colors text-xs font-semibold px-2 py-0.5 rounded hover:bg-blue-900/40"
                    >
                        Clear Filter
                    </button>
                </div>

                <!-- Main Data Table Container -->
                <div class="bg-[#18191c] border border-gray-800 rounded-xl shadow-xl overflow-hidden relative min-h-[300px]">
                    <div v-if="loading && !computedJobs.length" class="p-16 flex flex-col items-center justify-center">
                        <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
                        <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Loading CyberRamen jobs...</span>
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

                        <!-- Status Column with Rich Badges -->
                        <Column field="done" header="Status" sortable>
                            <template #body="{ data: job }">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                                        job.done === 1
                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                            : job.done === 0
                                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/30 animate-pulse'
                                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                    ]"
                                >
                                    <span
                                        :class="[
                                            'w-1.5 h-1.5 rounded-full',
                                            job.done === 1 ? 'bg-emerald-400' : job.done === 0 ? 'bg-blue-400' : 'bg-rose-400'
                                        ]"
                                    ></span>
                                    {{ job.done === 1 ? 'Done' : job.done === 0 ? 'Queued' : 'Error' }}
                                </span>
                            </template>
                        </Column>

                        <!-- Song Name Column -->
                        <Column field="SongName" header="Song Name" sortable>
                            <template #body="{ data: job }">
                                <button
                                    @click="toggleRow(job)"
                                    class="text-left font-semibold text-gray-100 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group"
                                >
                                    <span>{{ job.SongName || 'Untitled Song' }}</span>
                                    <i
                                        :class="[
                                            'bx text-gray-500 group-hover:text-blue-400 transition-transform',
                                            expandedRows.some((i) => i.JobId === job.JobId) ? 'bx-chevron-down rotate-180' : 'bx-chevron-right'
                                        ]"
                                    ></i>
                                </button>
                            </template>
                        </Column>

                        <!-- Difficulty Column -->
                        <Column field="Diff" header="Diff" sortable>
                            <template #body="{ data: job }">
                                <span class="bg-gray-800/90 border border-gray-700 text-gray-200 text-xs px-2.5 py-1 rounded-md font-mono font-medium">
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

                        <!-- Actions Column -->
                        <Column header="Actions">
                            <template #body="{ data: job }">
                                <div class="flex items-center gap-2">
                                    <button
                                        @click="openJob(job)"
                                        class="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-gray-700"
                                        title="View job technical parameters"
                                    >
                                        <i class="bx bx-info-circle text-sm text-blue-400"></i> Info
                                    </button>
                                    <a
                                        v-if="job.BeatSaverKey"
                                        :href="`https://beatsaver.com/maps/${job.BeatSaverKey}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1 border border-blue-500/30"
                                        title="View map on BeatSaver"
                                    >
                                        #{{ job.BeatSaverKey }} <i class="bx bx-external-link text-xs"></i>
                                    </a>
                                </div>
                            </template>
                        </Column>

                        <!-- Expanded Row Sub-Content -->
                        <template #expansion="{ data: job, index }">
                            <div class="bg-[#121315] p-5 border-t border-b border-gray-800 space-y-4">
                                <!-- Status Messages for Incomplete Jobs -->
                                <div v-if="!job.Result" class="p-6 text-center text-gray-400 flex flex-col items-center">
                                    <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
                                    <p class="mt-3 text-sm font-medium text-blue-300 animate-pulse">Generating replays and mistake analysis... Please wait :DDD</p>
                                </div>

                                <div v-else-if="!job.Result?.includes('https://')" class="p-4 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-300 text-xs font-mono">
                                    <i class="bx bx-error text-base mr-1 text-rose-400"></i> {{ job.Result }}
                                </div>

                                <div v-else-if="!job.loadedResults" class="p-8 text-center text-gray-400">
                                    <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
                                    <p class="mt-2 text-xs font-medium">Fetching detailed replay analytics...</p>
                                </div>

                                <!-- Detailed Replay Results & Analysis -->
                                <div v-else class="space-y-4">
                                    <!-- High-Score Specifics Cards (Highest Acc & Most Mistakes) -->
                                    <div class="flex flex-wrap items-center justify-center gap-3">
                                        <!-- Highest Accuracy Badge Card -->
                                        <div v-if="job.specifics?.highestAcc?.acc" class="bg-[#18191c] border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3 shadow-md">
                                            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
                                                <i class="bx bx-trophy"></i>
                                            </div>
                                            <div>
                                                <span class="text-[11px] text-gray-400 font-semibold uppercase block">Highest Accuracy</span>
                                                <span class="text-sm font-bold font-mono text-emerald-400">{{ job.specifics.highestAcc.acc }}%</span>
                                            </div>
                                            <div class="flex items-center gap-1.5 ml-2">
                                                <button
                                                    @click="openReplay(job.specifics.highestAcc)"
                                                    class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1 border border-emerald-500/30"
                                                >
                                                    Replay <i class="bx bx-external-link"></i>
                                                </button>
                                                <a
                                                    :href="job.specifics.highestAcc.replayUrl"
                                                    class="p-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md text-sm transition-colors"
                                                    title="Download replay file"
                                                >
                                                    <i class="bx bx-download"></i>
                                                </a>
                                            </div>
                                        </div>

                                        <!-- Most Mistakes Badge Card -->
                                        <div v-if="job.specifics?.mostMistakes" class="bg-[#18191c] border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 shadow-md">
                                            <div class="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                                                <i class="bx bx-error-alt"></i>
                                            </div>
                                            <div>
                                                <span class="text-[11px] text-gray-400 font-semibold uppercase block">Most Mistakes</span>
                                                <span class="text-sm font-bold font-mono text-amber-400">{{ job.specifics.mostMistakes.mistakes || 0 }} mistakes</span>
                                            </div>
                                            <div class="flex items-center gap-1.5 ml-2">
                                                <button
                                                    @click="openReplay(job.specifics.mostMistakes)"
                                                    class="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1 border border-amber-500/30"
                                                >
                                                    Replay <i class="bx bx-external-link"></i>
                                                </button>
                                                <a
                                                    :href="job.specifics.mostMistakes.replayUrl"
                                                    class="p-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md text-sm transition-colors"
                                                    title="Download replay file"
                                                >
                                                    <i class="bx bx-download"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Tabs Container -->
                                    <TabView :activeIndex.sync="job.selectedTab" class="custom-tabview">
                                        <!-- Mistakes Tab -->
                                        <TabPanel :header="`Mistakes Breakdown (${job.sortedMistakes.length})`">
                                            <!-- Checkbox Filters -->
                                            <div class="flex flex-wrap items-center justify-center gap-6 py-3 bg-[#18191c] border border-gray-800 rounded-xl mb-4 text-xs font-medium text-gray-300">
                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <Checkbox
                                                        :id="`showBadcuts-${job.JobId}`"
                                                        v-model="computedJobs[index].filters.showBadcuts"
                                                        :binary="true"
                                                    />
                                                    <span>Badcuts (<strong class="text-rose-400 font-mono">{{ job.specifics['total_bad'] }}</strong>)</span>
                                                </label>

                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <Checkbox
                                                        :id="`showMisses-${job.JobId}`"
                                                        v-model="computedJobs[index].filters.showMisses"
                                                        :binary="true"
                                                    />
                                                    <span>Misses (<strong class="text-amber-400 font-mono">{{ job.specifics['total_miss'] }}</strong>)</span>
                                                </label>

                                                <label class="flex items-center gap-2 cursor-pointer select-none">
                                                    <Checkbox
                                                        :id="`showBombs-${job.JobId}`"
                                                        v-model="computedJobs[index].filters.showBombs"
                                                        :binary="true"
                                                    />
                                                    <span>Bomb Hits (<strong class="text-purple-400 font-mono">{{ job.specifics['total_bomb'] }}</strong>)</span>
                                                </label>
                                            </div>

                                            <!-- Mistakes Sub-DataTable -->
                                            <div class="bg-[#18191c] border border-gray-800 rounded-xl overflow-hidden shadow-inner">
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
                                                            <span class="font-mono text-xs font-bold text-blue-300 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded">
                                                                {{ mistake.time }}s
                                                            </span>
                                                        </template>
                                                    </Column>
                                                    <Column field="mistakes" header="Replays Missed" sortable>
                                                        <template #body="{ data: mistakes }">
                                                            <span class="text-xs font-mono font-semibold text-rose-400">
                                                                {{ mistakes.mistakes.length }} replays
                                                            </span>
                                                        </template>
                                                    </Column>

                                                    <!-- Nested Single Replay Mistake Expansion -->
                                                    <template #expansion="{ data: mistake }">
                                                        <div class="p-3 bg-[#121315] border-t border-gray-800">
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
                                                                                'text-xs font-mono px-2 py-0.5 rounded uppercase font-semibold border',
                                                                                m.type === 'bad' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : m.type === 'miss' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
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
                                                                <Column header="Replay Actions">
                                                                    <template #body="{ data: singleMistake }">
                                                                        <div class="flex items-center gap-2">
                                                                            <button
                                                                                @click="openReplay(job, singleMistake)"
                                                                                class="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-blue-500/30"
                                                                            >
                                                                                View Replay <i class="bx bx-external-link"></i>
                                                                            </button>
                                                                            <button
                                                                                @click="(event) => $refs[`panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`].toggle(event)"
                                                                                class="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
                                                                                title="View replay attributes"
                                                                            >
                                                                                <i class="bx bx-info-circle"></i>
                                                                            </button>
                                                                            <OverlayPanel
                                                                                :ref="`panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`"
                                                                                appendTo="body"
                                                                                class="bg-[#18191c] border border-gray-700 text-gray-100 rounded-xl p-3 shadow-2xl max-w-sm"
                                                                            >
                                                                                <div class="font-bold text-xs text-blue-400 uppercase tracking-wider mb-2 border-b border-gray-700 pb-1">
                                                                                    Replay Info
                                                                                </div>
                                                                                <div
                                                                                    v-for="attribute of Object.entries(job.sortedReplays[singleMistake.replayId])"
                                                                                    :key="attribute[0]"
                                                                                    class="flex items-center justify-between text-xs py-1 border-b border-gray-800/40"
                                                                                >
                                                                                    <span class="text-gray-400 font-medium mr-4">{{ attribute[0] }}</span>
                                                                                    <a
                                                                                        v-if="attribute[1] && String(attribute[1]).includes('https://')"
                                                                                        @click="openReplay(job, singleMistake)"
                                                                                        class="text-blue-400 hover:underline cursor-pointer font-semibold"
                                                                                    >
                                                                                        Link
                                                                                    </a>
                                                                                    <span v-else class="font-mono text-gray-200 font-semibold">{{ attribute[1] != null ? attribute[1] : 'n/a' }}</span>
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
                                            <div class="bg-[#18191c] border border-gray-800 rounded-xl overflow-hidden shadow-inner">
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
                                                            <span class="font-mono font-bold text-emerald-400 text-xs">{{ r.acc }}%</span>
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
                                                            <span :class="['font-mono text-xs font-bold', r.mistakes > 0 ? 'text-rose-400' : 'text-emerald-400']">
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
                                                    <Column header="Replay Actions">
                                                        <template #body="{ data: replay }">
                                                            <div class="flex items-center gap-2">
                                                                <button
                                                                    @click="openReplay(replay)"
                                                                    class="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-blue-500/30"
                                                                >
                                                                    View <i class="bx bx-external-link"></i>
                                                                </button>
                                                                <a
                                                                    :href="replay.replayUrl"
                                                                    class="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
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
            <div v-else class="bg-[#18191c] border border-gray-800 rounded-xl p-12 text-center text-gray-300 max-w-md mx-auto shadow-xl space-y-4 my-8">
                <i class="bx bxl-discord text-6xl text-blue-400 mb-2"></i>
                <h3 class="text-xl font-bold text-gray-100">Discord Login Required</h3>
                <p class="text-sm text-gray-400">Please sign in with your Discord account to view and submit CyberRamen replay requests.</p>
                <button
                    @click="$auth.login()"
                    class="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
                >
                    <span>Login with Discord</span>
                    <i class="bx bxl-discord text-lg"></i>
                </button>
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
        if (this.profile) this.$timer.start('loadJobs')

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
