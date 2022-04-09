<template>
    <div class="rankingstats">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Statistics stuff
                    </h2>
                    <p v-if="stats">
                        Difficulties ranked: {{ stats['total'] }}
                        <!-- pp distribution: fix backend calc -->
                        Most stuff refreshes every hour
                    </p>
                </div>
            </div>
        </div>

        <vs-navbar color="#18191c" shadow text-white square v-model="active">
            <vs-navbar-item
                to="/Stats/beatsaver"
                :active="active == 'beatsaver'"
                id="beatsaver"
            >
                Beatsaver
            </vs-navbar-item>
            <vs-navbar-item
                to="/Stats/scoresaber"
                :active="active == 'scoresaber'"
                id="scoresaber"
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
            stats: null,
            active: 'beatsaver',
        }
    },
    async created() {
        if (this.$route.name.split('-').length == 1) {
            this.$router.push({ path: 'Stats/beatsaver' })
        } else if (this.$route.path.includes('scoresaber')) {
            this.active = 'scoresaber'
        }
        this.stats = await this.$defaultApi.$get('scoresaber/ppdist')
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
