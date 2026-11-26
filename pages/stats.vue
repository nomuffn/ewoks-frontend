<template>
    <div class="rankingstats pb-12">
        <sub-header title="Statistics stuff">
            <p>
                ScoreSaber stats refresh every hour.
                <br />
                BeatSaver &amp; RC Discord stats refresh every 24 hours.
            </p>
        </sub-header>

        <!-- Sub-Navigation Tab Bar -->
        <div class="bg-[#1e2023] border-b border-white/[0.06]">
            <div class="w-full max-w-6xl px-4 sm:px-8 mx-auto flex items-center justify-center gap-1">
                <NuxtLink
                    v-for="item in items"
                    :key="item.to"
                    :to="item.to"
                    class="nope px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 select-none"
                    :class="[
                        $route.path === item.to || ($route.path === '/stats' && item.to === '/stats/beatsaver')
                            ? 'border-blue-400 text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-200',
                    ]"
                >
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                </NuxtLink>
            </div>
        </div>

        <div class="w-full max-w-6xl px-4 sm:px-8 mx-auto mt-6">
            <NuxtChild class="sub-page" keep-alive />
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            items: [
                { label: 'BeatSaver', to: '/stats/beatsaver', icon: 'bx bx-slider-alt' },
                { label: 'ScoreSaber', to: '/stats/scoresaber', icon: 'bx bx-trophy' },
                { label: 'RC Discord', to: '/stats/discord', icon: 'bx bxl-discord' },
            ],
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.path === '/stats') return next('/stats/beatsaver')
            next()
        })
    },
}
</script>

<style lang="scss" scoped>
.rankingstats {
    min-height: 100vh;
}
</style>
