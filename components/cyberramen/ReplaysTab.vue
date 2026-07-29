<template>
  <DataTable
    class="layer-2"
    :value="Object.values(job.sortedReplays)"
    responsive-layout="scroll"
    :paginator="true"
    :rows="10"
    sort-field="acc"
    :sort-order="-1"
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
            icon-pos="right"
            @click="openReplay(replay)"
          />
          <my-button
            icon="pi pi-download"
            class="p-button-outlined mx-1"
            type="button"
            icon-pos="right"
            :href="replay.replayUrl"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true
    }
  },
  methods: {
    openReplay (replay) {
      this.$emit('openReplay', replay)
    }
  }
}
</script>
