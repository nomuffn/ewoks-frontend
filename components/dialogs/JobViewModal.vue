<template>
    <div class="jobViewModal bg-[#1e2023] border border-white/[0.08] rounded-lg p-5 shadow-xl w-full max-w-xl mx-auto space-y-4 text-gray-100">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/[0.07] pb-3">
            <h3 class="text-base font-semibold text-gray-100">{{ title || 'Job Details' }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors">
                <i class="bx bx-x text-xl"></i>
            </button>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
            <div
                v-for="(attribute, index) of job"
                :key="index"
                class="bg-[#141417] border border-white/[0.06] rounded-lg p-3 flex flex-col justify-between"
            >
                <span class="text-xs text-gray-400 block">
                    {{ attribute[0] }}
                </span>
                <span class="text-xs font-mono text-gray-200 mt-1 break-all">
                    {{ attribute[1] || 'n/a' }}
                </span>
            </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end border-t border-white/[0.07] pt-3.5">
            <button
                @click="$emit('close')"
                class="px-4 py-2 bg-[#25282c] hover:bg-[#2e3238] text-gray-200 font-medium rounded-lg text-xs transition-colors"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['job', 'title'],
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
