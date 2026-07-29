<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
            v-for="(map, index) of maps"
            :key="index"
            @click="openUrl(map.scoresaberid)"
            class="bg-[#18191c] border border-gray-800 hover:border-blue-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all flex flex-col justify-between gap-3 group"
        >
            <div class="space-y-1">
                <div class="flex items-start justify-between gap-2">
                    <h3 class="font-bold text-gray-100 group-hover:text-blue-400 transition-colors text-sm line-clamp-2" :title="map.name">
                        {{ map.name }}
                    </h3>
                    <i class="bx bx-external-link text-gray-500 group-hover:text-blue-400 transition-colors text-base shrink-0"></i>
                </div>
                <p class="text-xs text-gray-400">
                    by <span class="text-blue-300 font-medium">{{ map.mapper }}</span>
                </p>
            </div>

            <div class="pt-2 border-t border-gray-800/60 flex items-center justify-between">
                <span class="text-[11px] text-gray-500 font-mono">ScoreSaber Qualified</span>
                <span
                    :class="[
                        'text-xs font-mono font-bold px-2.5 py-1 rounded-md border',
                        map.hoursleft >= 0
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    ]"
                >
                    {{ map.hoursleft >= 0 ? `in ~${map.hoursleft}h` : formatPassedTime(map.hoursleft) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['maps'],
    methods: {
        openUrl(id) {
            if (id != null) window.open('https://scoresaber.com/leaderboard/' + id, '_blank').focus()
        },
        formatPassedTime(hoursleft) {
            if (hoursleft < -24) {
                return `${Math.round(Math.abs(hoursleft / 24))}d ago`
            }
            return `${Math.round(Math.abs(hoursleft))}h ago`
        },
    },
}
</script>

<style scoped></style>
