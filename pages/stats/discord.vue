<template>
  <div class="discord justify-center flex flex-col items-center">
    <p class="title">
      Top Ten Scores Feed Messages sorted by Total Reactions Count
    </p>
    <div class="container">
      <Paginator
        style="background: none"
        class="w-full"
        :rows="50"
        :total-records="totalRecords"
        @page="onPage($event)"
      />

      <loading-spinner v-if="loading" class="ml-auto mr-auto mt-6" />

      <div v-else class="results mt-6">
        <discord-message v-for="message in messages" :key="message.id" :message="message" />
      </div>

      <Paginator
        style="background: none"
        class="w-full"
        :rows="50"
        :total-records="totalRecords"
        @page="onPage($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  transition: 'slide-bottom',
  data () {
    return {
      page: 0,
      totalRecords: 0,
      messages: [],
      loading: false
    }
  },
  computed: {},
  watch: {
    page: {
      immediate: true,
      async handler (newVal, oldVal) {
        this.load()
      }
    }
  },

  methods: {
    async load () {
      this.loading = true
      const data = await this.$defaultApi.$get(`general/messages?page=${this.page + 1}`)
      this.messages = data.results
      this.totalRecords = data.count

      this.loading = false
    },
    onPage (event) {
      if (this.page == event.page) { return }
      this.page = event.page
    }
  }
}
</script>

<style lang="scss"></style>
