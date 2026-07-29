<template>
    <div class="rankingstats pb-12">
        <sub-header title="Statistics & Leaderboard Analytics">
            <p>
                ScoreSaber metrics refresh hourly.
                <br />
                BeatSaver & Ranking Community Discord stats refresh every 24 hours.
            </p>
        </sub-header>

        <div class="w-full max-w-6xl px-4 sm:px-8 mx-auto mt-6 space-y-6">
            <!-- Navigation Tab Bar -->
            <div class="bg-[#18191c] border border-gray-800 rounded-xl p-2 shadow-lg flex items-center justify-center gap-2">
                <NuxtLink
                    v-for="item in items"
                    :key="item.to"
                    :to="item.to"
                    class="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 select-none"
                    :class="[
                        $route.path === item.to || ($route.path === '/stats' && item.to === '/stats/beatsaver')
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    ]"
                >
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                </NuxtLink>
            </div>

            <!-- Page Content -->
            <NuxtChild class="content sub-page" keep-alive />
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            items: [
                { label: 'BeatSaver Filter', to: '/stats/beatsaver', icon: 'bx bx-slider-alt' },
                { label: 'ScoreSaber Leaderboards', to: '/stats/scoresaber', icon: 'bx bx-trophy' },
                { label: 'RC Discord Reactions', to: '/stats/discord', icon: 'bx bxl-discord' },
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
