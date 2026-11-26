<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
            v-for="(map, index) of maps"
            :key="index"
            @click="openUrl(map.scoresaberid)"
            class="bg-[#1e2023] border border-white/[0.06] hover:border-white/15 rounded-lg p-4 cursor-pointer transition-colors flex flex-col justify-between gap-3 group"
        >
            <div>
                <div class="flex items-start justify-between gap-2">
                    <h3 class="font-semibold text-gray-100 group-hover:text-white text-sm line-clamp-2" :title="map.name">
                        {{ map.name }}
                    </h3>
                    <i class="bx bx-link-external text-gray-500 group-hover:text-gray-300 transition-colors text-sm shrink-0 mt-0.5"></i>
                </div>
                <p class="text-xs text-gray-400 mt-1">by {{ map.mapper }}</p>
            </div>

            <div class="flex items-center justify-end">
                <span
                    :class="[
                        'text-xs font-mono font-semibold',
                        map.hoursleft >= 0 ? 'text-gray-200' : 'text-emerald-400',
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
