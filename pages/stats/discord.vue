<template>
    <div class="discord justify-center">
        <p class="title">
            Top Ten Scores Feed Messages sorted by Total Reactions Count
        </p>
        <div class="container" v-if="paginationLength > 0 && page > 0">
            <vs-pagination v-model="page" :length="paginationLength" />
            <div class="results mt-6">
                <discord-message
                    v-for="message in messages"
                    :message="message"
                    :key="message.id"
                />
            </div>
            <vs-pagination v-model="page" :length="paginationLength" />
        </div>
        <div v-else>
            <loading-spinner />
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            page: 0,
            paginationLength: 0,
            messages: [],
        }
    },
    computed: {},

    async created() {
        this.page += 1
    },
    watch: {
        async page(newVal, oldVal) {
            const data = await this.$defaultApi.$get(
                `general/messages?page=${newVal}`,
            )
            this.messages = data.results
            this.paginationLength = Math.ceil(data.count / data.results.length)
        },
    },

    methods: {},
}
</script>

<style lang="scss">
.page .discord {
}
</style>
