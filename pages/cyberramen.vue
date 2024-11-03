<template>
    <div class="cyberramen">
        <sub-header title="CyberRamen Request Tool">
            <p v-html="description"></p>
        </sub-header>

        <div v-if="error">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="profile" class="content flex flex-col items-center">
            <my-button
                label="Create request"
                class="my-2"
                @click="createJob"
                :loading="creatingJob"
                :disabled="creatingJob"
            />

            <Dropdown
                v-if="jobUsers.length > 1"
                v-model="jobFilters.userid"
                optionLabel="name"
                optionValue="id"
                placeholder="Filter by user"
                :options="jobUsers"
                class="my-2"
                :showClear="true"
                scrollHeight="400px"
            />

            <InputText type="text" v-model="jobFilters.textSearch" placeholder="Text search" class="my-2" />

            <Message v-if="filteredJobs.length" severity="info" @close="(event) => (filteredJobs = [])" :closable="true"
                >Jobs filtered by query param: {{ this.filteredJobs.join() }}</Message
            >

            <ProgressBar
                v-if="loading && !this.computedJobs.length"
                class="my-4"
                style="width: 100px"
                mode="indeterminate"
            />
            <DataTable
                v-else
                class="w-full max-w-screen-2xl my-2"
                :value="computedJobs"
                :expandedRows.sync="expandedRows"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="50"
                @row-expand="loadJob"
            >
                <Column :expander="true" :headerStyle="{ width: '3rem' }" />
                <Column field="done" header="Status" sortable>
                    <template #body="{ data: job }">
                        <InlineMessage :severity="job.done == 1 ? 'success' : job.done == 0 ? 'info' : 'error'">{{
                            job.done == 1 ? 'Done' : job.done == 0 ? 'Queued' : 'ERROR'
                        }}</InlineMessage>
                    </template>
                </Column>
                <Column field="SongName" header="SongName" sortable>
                    <template #body="{ data: job }">
                        <!-- p-button-text -->
                        <my-button
                            :label="job.SongName"
                            :outlined="!expandedRows.some((i) => i.JobId == job.JobId)"
                            @click="toggleRow(job)"
                        />
                    </template>
                </Column>
                <Column field="Diff" header="Diff" sortable />
                <Column field="CreatedDate" header="Created" sortable />
                <Column field="CompletedDate" header="Finished" sortable />
                <Column header="Actions">
                    <template #body="{ data: job }">
                        <div class="flex">
                            <my-button
                                label="Request info"
                                class="p-button-outlined m-1 w-24"
                                type="button"
                                @click="openJob(job)"
                            ></my-button>
                            <my-button
                                label="Beatsaver"
                                class="p-button-outlined m-1 w-24"
                                type="button"
                                iconPos="right"
                                @click="openLink(`https://beatsaver.com/maps/${job.BeatSaverKey}`)"
                            ></my-button>
                        </div>
                    </template>
                </Column>
                <template #expansion="{ data: job, index }">
                    <p v-if="!job.Result">Wait until its done generating :DDD</p>
                    <p v-else-if="!job.Result?.includes('https://')">
                        {{ job.Result }}
                    </p>
                    <ProgressBar v-else-if="!job.loadedResults" mode="indeterminate" />
                    <div v-else>
                        <div class="flex justify-center mb-2">
                            <div v-if="job.specifics?.highestAcc" class="flex m-2">
                                <my-button
                                    :label="`Highest Acc ${job.specifics.highestAcc.acc}%`"
                                    class="p-button-outlined m-1"
                                    type="button"
                                    iconPos="right"
                                    icon="pi pi-external-link"
                                    notround
                                    nomargin
                                    @click="openReplay(job.specifics.highestAcc)"
                                ></my-button>
                                <my-button reset :href="job.specifics.highestAcc.replayUrl">
                                    <i class="bx bx-download"></i>
                                </my-button>
                            </div>

                            <div class="flex m-2">
                                <my-button
                                    v-if="job.specifics?.mostMistakes"
                                    :label="`Most mistakes ${job.specifics.mostMistakes.mistakes || 0}`"
                                    class="p-button-outlined m-1"
                                    type="button"
                                    iconPos="right"
                                    icon="pi pi-external-link"
                                    notround
                                    nomargin
                                    @click="openReplay(job.specifics.mostMistakes)"
                                ></my-button>
                                <my-button reset :href="job.specifics.mostMistakes.replayUrl">
                                    <i class="bx bx-download"></i>
                                </my-button>
                            </div>
                        </div>
                        <TabView :activeIndex.sync="job.selectedTab">
                            <TabPanel :header="`Mistakes: ${job.sortedMistakes.length}`">
                                <div class="flex justify-center">
                                    <div class="field-checkbox m-2">
                                        <Checkbox
                                            :id="`showBadcuts-${job.JobId}`"
                                            v-model="computedJobs[index].filters.showBadcuts"
                                            :binary="true"
                                            class="mr-2"
                                        />
                                        <label :for="`showBadcuts-${job.JobId}`"
                                            >Show badcuts ({{ job.specifics['total_bad'] }})</label
                                        >
                                    </div>
                                    <div class="field-checkbox m-2">
                                        <Checkbox
                                            :id="`showMisses-${job.JobId}`"
                                            v-model="computedJobs[index].filters.showMisses"
                                            :binary="true"
                                            class="mr-2"
                                        />
                                        <label :for="`showMisses-${job.JobId}`"
                                            >Show misses ({{ job.specifics['total_miss'] }})</label
                                        >
                                    </div>
                                    <div class="field-checkbox m-2">
                                        <Checkbox
                                            :id="`showBombs-${job.JobId}`"
                                            v-model="computedJobs[index].filters.showBombs"
                                            :binary="true"
                                            class="mr-2"
                                        />
                                        <label :for="`showBombs-${job.JobId}`"
                                            >Show bomb hits ({{ job.specifics['total_bomb'] }})</label
                                        >
                                    </div>
                                </div>

                                <DataTable
                                    :value="getMistakes(job)"
                                    :expandedRows.sync="expandedRows"
                                    responsiveLayout="scroll"
                                    :paginator="getMistakes(job).length > 10"
                                    :rows="10"
                                >
                                    <Column :expander="true" :headerStyle="{ width: '3rem' }" />
                                    <Column field="time" header="Timestamp" sortable></Column>
                                    <Column field="mistakes" header="Amount of replays that missed" sortable>
                                        <template #body="{ data: mistakes }">
                                            {{ mistakes.mistakes.length }}
                                        </template>
                                    </Column>

                                    <template #expansion="{ data: mistake }">
                                        <DataTable
                                            class="layer-3"
                                            :value="mistake.mistakes"
                                            responsiveLayout="scroll"
                                            :paginator="mistake.mistakes.length > 10"
                                            :rows="10"
                                        >
                                            <Column field="type" header="Type" sortable></Column>
                                            <Column field="noteId" header="Note ID" sortable></Column>
                                            <Column header="Replay">
                                                <template #body="{ data: singleMistake }">
                                                    <div class="flex items-center">
                                                        <!-- <b class="mx-1 mr-auto">{{ singleMistake.replayId }}</b> -->
                                                        <my-button
                                                            icon="pi pi-external-link"
                                                            class="p-button-outlined mx-1"
                                                            type="button"
                                                            iconPos="right"
                                                            @click="openReplay(job, singleMistake)"
                                                        ></my-button>
                                                        <my-button
                                                            icon="pi pi-info"
                                                            class="p-button-outlined mx-1"
                                                            type="button"
                                                            iconPos="right"
                                                            @click="
                                                                (event) =>
                                                                    $refs[
                                                                        `panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`
                                                                    ].toggle(event)
                                                            "
                                                        ></my-button>
                                                        <OverlayPanel
                                                            :ref="`panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`"
                                                            appendTo="body"
                                                        >
                                                            <b>Replay Info</b>
                                                            <div
                                                                v-for="attribute of Object.entries(
                                                                    job.sortedReplays[singleMistake.replayId],
                                                                )"
                                                                class="flex"
                                                                :key="attribute[0]"
                                                            >
                                                                <p class="mr-auto pr-4">
                                                                    {{ attribute[0] }}
                                                                </p>
                                                                <my-button
                                                                    v-if="attribute[1].toString().includes('https://')"
                                                                    label="Link"
                                                                    class="p-button-link p-0"
                                                                    @click="openReplay(job, singleMistake)"
                                                                />
                                                                <b v-else>
                                                                    {{ attribute[1] }}
                                                                </b>
                                                            </div>
                                                        </OverlayPanel>
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </template>
                                </DataTable>
                            </TabPanel>
                            <TabPanel :header="`Replays: ${Object.keys(job.sortedReplays).length}`">
                                <DataTable
                                    class="layer-2"
                                    :value="Object.values(job.sortedReplays)"
                                    responsiveLayout="scroll"
                                    :paginator="true"
                                    :rows="10"
                                    sortField="acc"
                                    :sortOrder="-1"
                                >
                                    <Column field="acc" header="Acc" sortable />
                                    <Column field="fcAcc" header="FC Acc" sortable />
                                    <Column field="fps" header="FPS" sortable />
                                    <Column field="mistakes" header="Mistakes" sortable />
                                    <Column field="headsetYposition" header="HMD Y Pos" sortable />
                                    <Column field="height" header="height" sortable />
                                    <Column field="jd" header="jd" sortable />
                                    <Column field="postSwingAngle" header="Post Swing Angle" sortable />
                                    <Column field="preSwingAngle" header="Pre Swing Angle" sortable />
                                    <Column field="timeDeviation" header="Time deviation" sortable />
                                    <Column field="requestedAcc" header="Requested Acc" sortable />
                                    <Column header="Replay">
                                        <template #body="{ data: replay }">
                                            <div class="flex">
                                                <my-button
                                                    icon="pi pi-external-link"
                                                    class="p-button-outlined mx-1"
                                                    type="button"
                                                    iconPos="right"
                                                    @click="openReplay(replay)"
                                                ></my-button>
                                                <my-button
                                                    icon="pi pi-download"
                                                    class="p-button-outlined mx-1"
                                                    type="button"
                                                    iconPos="right"
                                                    :href="replay.replayUrl"
                                                ></my-button>
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                        </TabView>
                    </div>
                </template>
            </DataTable>
        </div>
        <div v-else class="content flex flex-col items-center">
            <p class="my-4 font-bold">Discord login needed</p>
            <my-button @click="$auth.login()" outlined>
                <p>Login</p>
                <i class="bx bxl-discord"></i>
            </my-button>
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
            jobFilters: { userid: null },
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
        this.description = (await this.$defaultApi.$get('general/stuff/public_cyberramen')).json.html
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
            if (this.jobFilters.userid?.length) {
                jobs = jobs.filter((job) => job.UserId == this.jobFilters.userid)
            }
            if (this.jobFilters.textSearch?.length) {
                jobs = jobs.filter((job) =>
                    job.SongName?.toLowerCase().includes(this.jobFilters.textSearch.toLowerCase()),
                )
            }

            return jobs.sort((a, b) => Date.parse(b.CreatedDate) - Date.parse(a.CreatedDate))
        },
        jobUsers() {
            const unique = {}
            const jobs = this.jobs
                .flatMap((job) => {
                    if (unique[job.UserId]) {
                        return []
                    } else {
                        unique[job.UserId] = true
                        return { name: job.UserName, id: job.UserId }
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
        async loadJobs(force = false) {
            if (this.error) return

            console.log('load jobs')
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
                this.$toast.add({
                    severity: 'error',
                    summary: `${e.response.statusText} ${e.response.status}`,
                    life: 3000,
                })
                this.error = e
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
                let results = (await this.$http.get(job.Result)).data

                job.sortedReplays = {}
                job.specifics = {
                    highestAcc: {},
                    mostMistakes: {},
                    total_bomb: 0,
                    total_miss: 0,
                    total_bad: 0,
                }
                // miss/badcut/bomb

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
                console.log(e)
                job.Result = 'Couldnt fetch data, probably outdated'
            }
            this.loadingJob = false
        },
        getMistakes(job) {
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
                // job is replay
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
// html {
//     height: 100%;
// }
// body {
//     background-color: var(--surface-b);
//     min-height: 100%;
//     color: #fff !important;
// }

// p {
//     margin: 5px 0px;
// }

// #app {
//     font-family: Avenir, Helvetica, Arial, sans-serif;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     text-align: center;
//     padding: 50px 0px 100px;
// }
.p-datatable .p-datatable-thead > tr > th {
    background-color: transparent !important;
}
.p-datatable .p-datatable-tbody > tr {
    background-color: transparent !important;
}

.modal-card-foot,
.modal-card-head,
.modal-card-body {
    // background-color: var(--surface-a) !important;
    background-color: var(--surface-a) !important;
    color: #fff;

    .modal-card-title {
        color: #fff;
    }
}

.p-confirm-dialog-message {
    white-space: pre-line;
}
.p-tabview-nav {
    justify-content: center;
}

// jobs
.p-datatable {
    td {
        vertical-align: middle;
    }
    .p-datatable-tbody > tr > td {
        padding: 0.5rem 1rem;
    }

    // mistakes
    .p-datatable {
        .p-datatable-thead > tr > th,
        .p-datatable-tbody > tr > td,
        .p-paginator {
            background-color: var(--surface-b) !important;
        }

        // single mistake
        .p-datatable-table {
            .p-paginator {
                background-color: #000 !important;
            }

            .p-datatable-row-expansion > td {
                padding: 0;
            }

            .p-datatable-table {
                .p-datatable-thead > tr > th,
                .p-datatable-tbody > tr > td {
                    background-color: #000 !important;
                }
            }
        }
    }
}

.p-tabview-nav > * > * {
    background-color: var(--surface-b) !important;
}
.p-tabview-panels {
    background-color: var(--surface-b) !important;
}
.layer-1 {
    background-color: var(--surface-b) !important;

    .p-tabview-panels,
    .p-tabview-nav-link {
        background-color: var(--surface-b) !important;
    }
}
.layer-2 {
    background-color: var(--surface-c);
}
.layer-3 {
    background-color: var(--surface-d);
}
</style>
