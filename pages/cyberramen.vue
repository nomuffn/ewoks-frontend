<template>
  <div class="cyberramen">
    <sub-header title="CyberRamen Request Tool">
      <p v-html="description" />
    </sub-header>

    <div v-if="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="profile" class="content flex flex-col items-center">
      <my-button
        label="Create request"
        class="my-2"
        :loading="creatingJob"
        :disabled="creatingJob"
        @click="createJob"
      />

      <Dropdown
        v-if="jobUsers.length > 1"
        v-model="jobFilters.userid"
        option-label="name"
        option-value="id"
        placeholder="Filter by user"
        :options="jobUsers"
        class="my-2"
        :show-clear="true"
        scroll-height="400px"
      />

      <InputText v-model="jobFilters.textSearch" type="text" placeholder="Text search" class="my-2" />

      <Message
        v-if="filteredJobs.length"
        severity="info"
        :closable="true"
        @close="(event) => (filteredJobs = [])"
      >
        Jobs filtered by query param: {{ filteredJobs.join() }}
      </Message>

      <ProgressBar
        v-if="loading && !computedJobs.length"
        class="my-4"
        style="width: 100px"
        mode="indeterminate"
      />
      <DataTable
        v-else
        class="w-full max-w-screen-2xl my-2"
        :value="computedJobs"
        :expanded-rows.sync="expandedRows"
        responsive-layout="scroll"
        :paginator="true"
        :rows="50"
        @row-expand="loadJob"
      >
        <Column :expander="true" :header-style="{ width: '3rem' }" />
        <Column field="done" header="Status" sortable>
          <template #body="{ data: job }">
            <InlineMessage :severity="job.done == 1 ? 'success' : job.done == 0 ? 'info' : 'error'">
              {{
                job.done == 1 ? 'Done' : job.done == 0 ? 'Queued' : 'ERROR'
              }}
            </InlineMessage>
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
              />
              <my-button
                label="Beatsaver"
                class="p-button-outlined m-1 w-24"
                type="button"
                icon-pos="right"
                @click="openLink(`https://beatsaver.com/maps/${job.BeatSaverKey}`)"
              />
            </div>
          </template>
        </Column>
        <template #expansion="{ data: job, index }">
          <p v-if="!job.Result">
            Wait until its done generating :DDD
          </p>
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
                  icon-pos="right"
                  icon="pi pi-external-link"
                  notround
                  nomargin
                  @click="openReplay(job.specifics.highestAcc)"
                />
                <my-button reset :href="job.specifics.highestAcc.replayUrl">
                  <i class="bx bx-download" />
                </my-button>
              </div>

              <div class="flex m-2">
                <my-button
                  v-if="job.specifics?.mostMistakes"
                  :label="`Most mistakes ${job.specifics.mostMistakes.mistakes || 0}`"
                  class="p-button-outlined m-1"
                  type="button"
                  icon-pos="right"
                  icon="pi pi-external-link"
                  notround
                  nomargin
                  @click="openReplay(job.specifics.mostMistakes)"
                />
                <my-button reset :href="job.specifics.mostMistakes.replayUrl">
                  <i class="bx bx-download" />
                </my-button>
              </div>
            </div>
            <TabView :active-index.sync="job.selectedTab">
              <TabPanel :header="`Mistakes: ${job.sortedMistakes.length}`">
                <MistakesTab
                  :job="job"
                  :filters="computedJobs[index].filters"
                  @openReplay="openReplay"
                />
              </TabPanel>
              <TabPanel :header="`Replays: ${Object.keys(job.sortedReplays).length}`">
                <ReplaysTab :job="job" @openReplay="openReplay" />
              </TabPanel>
            </TabView>
          </div>
        </template>
      </DataTable>
    </div>
    <div v-else class="content flex flex-col items-center">
      <p class="my-4 font-bold">
        Discord login needed
      </p>
      <my-button outlined @click="$auth.login()">
        <p>Login</p>
        <i class="bx bxl-discord" />
      </my-button>
    </div>

    <ConfirmDialog />
  </div>
</template>

<script>
import CreateJobModal from '@/components/dialogs/CreateJobModal.vue'
import JobViewModal from '~/components/dialogs/JobViewModal.vue'
import MistakesTab from '@/components/cyberramen/MistakesTab.vue'
import ReplaysTab from '@/components/cyberramen/ReplaysTab.vue'

export default {
  components: {
    MistakesTab,
    ReplaysTab
  },
  data () {
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
      description: ''
    }
  },
  timers: {
    loadJobs: {
      time: 10 * 1000,
      immediate: true,
      repeat: true
    }
  },
  computed: {
    computedJobs () {
      let jobs = this.jobs

      if (this.filteredJobs.length > 0) {
        jobs = jobs.filter(job => this.filteredJobs.includes(job.JobId))
      }
      if (this.jobFilters.userid?.length) {
        jobs = jobs.filter(job => job.UserId == this.jobFilters.userid)
      }
      if (this.jobFilters.textSearch?.length) {
        jobs = jobs.filter(job =>
          job.SongName?.toLowerCase().includes(this.jobFilters.textSearch.toLowerCase())
        )
      }

      return jobs.sort((a, b) => Date.parse(b.CreatedDate) - Date.parse(a.CreatedDate))
    },
    jobUsers () {
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
          if (a.name < b.name) { return -1 }
          if (a.name > b.name) { return 1 }
          return 0
        })
      return jobs
    }
  },
  watch: {
    filteredJobs (newval, oldval) {
      const url = new URL(window.location)
      if (newval.length > 0) {
        url.searchParams.set('jobs', newval.join())
      } else {
        url.searchParams.delete('jobs')
      }
      window.history.pushState(null, '', url.toString())
    }
  },
  async created () {
    this.description = (await this.$defaultApi.$get('general/stuff/public_cyberramen')).json.html
  },
  async mounted () {
    this.profile = await this.$auth.fetch()
    if (this.profile) { this.$timer.start('loadJobs') }

    const uri = window.location.search.substring(1)
    const params = new URLSearchParams(uri)
    if (params.get('jobs')) {
      for (const job of params.get('jobs').split(',')) { if (!isNaN(job)) { this.filteredJobs.push(parseInt(job)) } }
    }
  },
  methods: {
    converToBookmarks () {},
    openLink (url) {
      window.open(url, '_blank').focus()
    },
    async loadJobs (force = false) {
      if (this.error) { return }

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
                showBombs: false
              },
              done: job.Result?.includes('https://') ? 1 : job.Result == null ? 0 : -1
            }
          })
          .reverse()

        if (force) {
          this.jobs = []
          this.jobs = jobs
        }

        jobs = jobs.filter((job) => {
          const existingJobIndex = this.jobs.findIndex(innerJob => innerJob.JobId == job.JobId)
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
          life: 3000
        })
        this.error = e
      } finally {
        this.loading = false
      }
    },
    openJob (job) {
      this.$buefy.modal.open({
        parent: this,
        component: JobViewModal,
        hasModalCard: true,
        trapFocus: true,
        fullScreen: false,
        props: { job: this.getJobData(job) },
        events: {}
      })
    },
    async createJob () {
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
          }
        }
      })
    },
    async loadJob (job) {
      job = job.data || job
      const index = this.computedJobs.findIndex(item => item.JobId == job.JobId)

      if (!job || index == null || !job.Result || job.loadedResults || !job.Result?.includes('https://')) { return }

      this.loadingJob = true

      try {
        const results = (await this.$http.get(job.Result)).data

        job.sortedReplays = {}
        job.specifics = {
          highestAcc: {},
          mostMistakes: {},
          total_bomb: 0,
          total_miss: 0,
          total_bad: 0
        }
        // miss/badcut/bomb

        let mistakes = {}
        for (const [replayIndex, replay] of results.entries()) {
          for (const mistake of replay.ReplayMistakes) {
            const time = mistake.time.toFixed(3).toString()

            if (!mistakes[time]) { mistakes[time] = [] }

            job.specifics[`total_${mistake.type}`]++

            mistakes[time].push({
              ...mistake,
              replayId: replayIndex
            })
          }

          const newReplay = {
            ...replay.ReplayParams,
            mistakes: replay.ReplayMistakes.length,
            MapUrl: job.MapUrl
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
              })
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
    openReplay (job, mistake) {
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

      if (job.MapUrl) { url = `${url}&mapLink=${job.MapUrl.replace('http://', 'https://')}` }

      window.open(url, '_blank').focus()
    },
    getJobData (job) {
      job = structuredClone(job)
      for (const key of [
        'loadedResults',
        'sortedReplays',
        'sortedMistakes',
        'specifics',
        'filters',
        'filteredJobs',
        'done'
      ]) { delete job[key] }

      return Object.entries(job).reverse()
    },
    toggleRow (job) {
      const index = this.expandedRows.find(x => x.JobId === job.JobId)

      if (index === undefined) {
        this.expandedRows = [...this.computedJobs.filter(x => x.JobId === job.JobId), ...this.expandedRows]
        this.loadJob(job)
      } else {
        this.expandedRows = this.expandedRows.filter(x => x.JobId !== job.JobId)
      }
    }
  }
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
