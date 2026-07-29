<template>
    <div class="jobViewModal bg-[#18191c] border border-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-xl mx-auto space-y-5 text-gray-100 font-sans">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-800 pb-3.5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl">
                    <i class="bx bx-info-circle"></i>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-100">Job Details</h3>
                    <p class="text-xs text-gray-400">Request parameters & raw metadata</p>
                </div>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
                <i class="bx bx-x text-xl"></i>
            </button>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            <div
                v-for="(attribute, index) of job"
                :key="index"
                class="bg-[#121315] border border-gray-800 rounded-xl p-3 flex flex-col justify-between"
            >
                <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block font-sans">
                    {{ attribute[0] }}
                </span>
                <span class="text-sm font-bold font-mono text-gray-200 mt-1 break-all">
                    {{ attribute[1] || 'n/a' }}
                </span>
            </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end border-t border-gray-800 pt-4">
            <button
                @click="$emit('close')"
                class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl text-xs transition-colors"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['job'],
    data() {
        return {}
    },
    created() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
.jobViewModal {
    width: 100%;
}
</style>
