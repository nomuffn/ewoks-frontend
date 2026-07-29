<template>
  <div>
    <div class="flex justify-center">
      <div class="field-checkbox m-2">
        <Checkbox :id="`showBadcuts-${job.JobId}`" v-model="filters.showBadcuts" :binary="true" class="mr-2" />
        <label :for="`showBadcuts-${job.JobId}`">Show badcuts ({{ job.specifics['total_bad'] }})</label>
      </div>
      <div class="field-checkbox m-2">
        <Checkbox :id="`showMisses-${job.JobId}`" v-model="filters.showMisses" :binary="true" class="mr-2" />
        <label :for="`showMisses-${job.JobId}`">Show misses ({{ job.specifics['total_miss'] }})</label>
      </div>
      <div class="field-checkbox m-2">
        <Checkbox :id="`showBombs-${job.JobId}`" v-model="filters.showBombs" :binary="true" class="mr-2" />
        <label :for="`showBombs-${job.JobId}`">Show bomb hits ({{ job.specifics['total_bomb'] }})</label>
      </div>
    </div>

    <DataTable
      :value="getMistakes"
      :expanded-rows.sync="expandedRows"
      responsive-layout="scroll"
      :paginator="getMistakes.length > 10"
      :rows="10"
    >
      <Column :expander="true" :header-style="{ width: '3rem' }" />
      <Column field="time" header="Timestamp" sortable />
      <Column field="mistakes" header="Amount of replays that missed" sortable>
        <template #body="{ data: mistakes }">
          {{ mistakes.mistakes.length }}
        </template>
      </Column>

      <template #expansion="{ data: mistake }">
        <DataTable
          class="layer-3"
          :value="mistake.mistakes"
          responsive-layout="scroll"
          :paginator="mistake.mistakes.length > 10"
          :rows="10"
        >
          <Column field="type" header="Type" sortable />
          <Column field="noteId" header="Note ID" sortable />
          <Column header="Replay">
            <template #body="{ data: singleMistake }">
              <div class="flex items-center">
                <my-button
                  icon="pi pi-external-link"
                  class="p-button-outlined mx-1"
                  type="button"
                  icon-pos="right"
                  @click="openReplay(job, singleMistake)"
                />
                <my-button
                  icon="pi pi-info"
                  class="p-button-outlined mx-1"
                  type="button"
                  icon-pos="right"
                  @click="
                    (event) =>
                      $refs[
                        `panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`
                      ].toggle(event)
                  "
                />
                <OverlayPanel
                  :ref="`panel-${singleMistake.replayId}-${singleMistake.noteId}-${singleMistake.time}`"
                  append-to="body"
                >
                  <b>Replay Info</b>
                  <div
                    v-for="attribute of Object.entries(job.sortedReplays[singleMistake.replayId])"
                    :key="attribute[0]"
                    class="flex"
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
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      expandedRows: []
    }
  },
  computed: {
    getMistakes () {
      return this.job.sortedMistakes
        .map((mistake) => {
          const filteredMistakes = mistake.mistakes.filter((singleMistake) => {
            if (
              (this.filters.showBadcuts && singleMistake.type == 'bad') ||
                            (this.filters.showMisses && singleMistake.type == 'miss') ||
                            (this.filters.showBombs && singleMistake.type == 'bomb')
            ) {
              return true
            }
            return false
          })

          return {
            ...mistake,
            mistakes: filteredMistakes
          }
        })
        .filter((mistake) => {
          return mistake.mistakes.length > 0
        })
    }
  },
  methods: {
    openReplay (job, mistake) {
      this.$emit('openReplay', job, mistake)
    }
  }
}
</script>
