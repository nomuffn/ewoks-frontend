<template>
  <div class="cards row">
    <div v-for="(map, index) of maps" :key="index" class="card" @click="openUrl(map.scoresaberid)">
      <h3 class="twolines">
        {{ map.name }}
      </h3>
      <p class="grey">
        by {{ map.mapper }}
      </p>
      <span v-html="timeString(map.hoursleft)" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['maps'],
  methods: {
    openUrl (id) {
      if (id != null) { window.open('https://scoresaber.com/leaderboard/' + id, '_blank') }
    },
    timeString (hoursleft) {
      // lazy :))
      if (hoursleft >= 0) {
        return `<p class="time">in ~${hoursleft} hours</p>`
      } else {
        const timeLeft =
                    hoursleft < -24
                      ? `${Math.round(Math.abs(hoursleft / 24))} days ago` // 🤮
                      : `${Math.round(Math.abs(hoursleft))} hours ago` // 🤮
        return `<p style='color: green; text-align: right; font-weight: bold' >${timeLeft}</p>`
      }
    }
  }
}
</script>

<style scoped></style>
