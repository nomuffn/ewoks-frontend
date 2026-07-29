<template>
    <div class="discord w-full space-y-6">
        <!-- Controls & Info Card -->
        <div class="bg-[#18191c] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div>
                <h3 class="text-base font-bold text-gray-100 flex items-center gap-2">
                    <i class="bx bxl-discord text-purple-400 text-2xl"></i> RC Discord Feed Reactions
                </h3>
                <p class="text-xs text-gray-400 mt-1">
                    Top ten scores feed messages sorted by total reaction count.
                </p>
            </div>

            <div v-if="totalRecords > 0" class="text-xs font-mono font-semibold text-blue-300 bg-blue-950/40 border border-blue-800/40 px-3 py-1 rounded-lg">
                Total Feed Messages: {{ totalRecords }}
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="space-y-4">
            <!-- Top Paginator -->
            <div class="flex justify-center bg-[#18191c] border border-gray-800 rounded-xl p-2 shadow-md">
                <Paginator
                    style="background: none; border: none;"
                    class="w-full"
                    :rows="50"
                    :totalRecords="totalRecords"
                    @page="onPage($event)"
                ></Paginator>
            </div>

            <!-- Loading Spinner -->
            <div v-if="loading" class="bg-[#18191c] border border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center shadow-xl">
                <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
                <span class="text-gray-400 mt-4 text-sm font-medium animate-pulse">Loading Discord reaction feed...</span>
            </div>

            <!-- Messages List -->
            <div v-else class="space-y-3">
                <discord-message v-for="message in messages" :message="message" :key="message.id" />
            </div>

            <!-- Bottom Paginator -->
            <div v-if="totalRecords > 50" class="flex justify-center bg-[#18191c] border border-gray-800 rounded-xl p-2 shadow-md pt-2">
                <Paginator
                    style="background: none; border: none;"
                    class="w-full"
                    :rows="50"
                    :totalRecords="totalRecords"
                    @page="onPage($event)"
                ></Paginator>
            </div>
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
