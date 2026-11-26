<template>
    <div class="discord w-full space-y-4">
        <!-- Info Header -->
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h3 class="text-base font-semibold text-gray-100">RC Discord Reactions</h3>
                <p class="text-xs text-gray-400 mt-0.5">
                    Top ten scores feed messages sorted by total reaction count.
                </p>
            </div>

            <span v-if="totalRecords > 0" class="text-xs font-mono text-gray-500">
                {{ totalRecords }} messages
            </span>
        </div>

        <!-- Top Paginator -->
        <div class="flex justify-center">
            <Paginator
                style="background: none; border: none;"
                class="w-full"
                :rows="50"
                :totalRecords="totalRecords"
                @page="onPage($event)"
            ></Paginator>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="bg-[#1e2023] border border-white/[0.06] rounded-lg p-12 flex flex-col items-center justify-center">
            <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
            <span class="text-gray-400 mt-3 text-sm">Loading messages...</span>
        </div>

        <!-- Messages List -->
        <div v-else class="space-y-3">
            <discord-message v-for="message in messages" :message="message" :key="message.id" />
        </div>

        <!-- Bottom Paginator -->
        <div v-if="totalRecords > 50" class="flex justify-center pt-2">
            <Paginator
                style="background: none; border: none;"
                class="w-full"
                :rows="50"
                :totalRecords="totalRecords"
                @page="onPage($event)"
            ></Paginator>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            page: 0,
            totalRecords: 0,
            messages: [],
            loading: false,
        }
    },
    computed: {},
    watch: {
        page: {
            immediate: true,
            async handler(newVal, oldVal) {
                this.load()
            },
        },
    },
    methods: {
        async load() {
            this.loading = true
            try {
                const data = await this.$defaultApi.$get(`general/messages?page=${this.page + 1}`)
                this.messages = data.results || []
                this.totalRecords = data.count || 0
            } catch (e) {
                console.error('Failed to load discord messages:', e)
                this.messages = []
                this.totalRecords = 0
            } finally {
                this.loading = false
            }
        },
        onPage(event) {
            if (this.page == event.page) return
            this.page = event.page
        },
    },
}
</script>

<style lang="scss" scoped>
.discord {
    width: 100%;
}
</style>
