<template>
    <div class="rankingstats">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Statistics stuff
                    </h2>
                    <p>
                        <!-- pp distribution: fix backend calc -->
                        Scoresaber stuff refreshes every hour
                        <br />
                        Beatsaver stuff every 24 hours
                    </p>
                </div>
            </div>
        </div>

        <vs-navbar color="#18191c" shadow text-white square>
            <vs-navbar-item
                to="/stats/beatsaver"
                :active="$route.path == '/stats/beatsaver'"
            >
                Beatsaver
            </vs-navbar-item>
            <vs-navbar-item
                to="/stats/scoresaber"
                :active="$route.path == '/stats/scoresaber'"
            >
                Scoresaber
            </vs-navbar-item>
        </vs-navbar>

        <NuxtChild class="content sub-page" keep-alive />
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            active: 'beatsaver',
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.path == '/stats') return next('/stats/beatsaver')
            next()
        })
    },
    async created() {
        // this.stats = await this.$defaultApi.$get('scoresaber/ppdist')
    },
}
</script>

<style lang="scss">
.rankingstats {
    justify-content: center;

    .vs-navbar-content {
        position: relative;

        button {
            white-space: pre-line;
            padding-top: 0px;
            padding: 0px 10px 15px 10px;
        }
    }
}
</style>
